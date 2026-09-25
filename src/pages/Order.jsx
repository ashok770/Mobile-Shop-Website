import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  ShoppingBag,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";
import { createOrder } from "../api/api";
import useAuth from "../hooks/useAuth";
import { useSettings } from "../context/SettingsContext";
import "./Order.css";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();

  // Load product from location.state or fallback to sessionStorage
  const rawProduct = location.state?.product || location.state;
  const initialQty = location.state?.quantity || 1;

  const [product, setProduct] = useState(() => {
    if (rawProduct && (rawProduct._id || rawProduct.name)) {
      try {
        sessionStorage.setItem("ommasta_checkout_product", JSON.stringify(rawProduct));
      } catch (err) {
        console.error("Failed to cache checkout product", err);
      }
      return rawProduct;
    }
    try {
      const cached = sessionStorage.getItem("ommasta_checkout_product");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [qty, setQty] = useState(initialQty);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Restore draft if saved prior to login redirect
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem("ommasta_checkout_draft");
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.name) setName(draft.name);
        if (draft.phone) setPhone(draft.phone);
        if (draft.email) setEmail(draft.email);
        if (draft.streetAddress) setStreetAddress(draft.streetAddress);
        if (draft.city) setCity(draft.city);
        if (draft.stateName) setStateName(draft.stateName);
        if (draft.pincode) setPincode(draft.pincode);
        if (draft.landmark) setLandmark(draft.landmark);
        if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
        if (draft.qty) setQty(draft.qty);
        if (draft.product && !product) setProduct(draft.product);

        sessionStorage.removeItem("ommasta_checkout_draft");

        if (user) {
          toast.success("Welcome back! Your order details have been restored.", { icon: "✅" });
        }
      }
    } catch (err) {
      console.error("Failed to restore checkout draft", err);
    }
  }, [user, product]);

  // Auto-fill from user account profile if empty
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.email && !email) setEmail(user.email);

      if (user.addresses && user.addresses.length > 0 && !streetAddress) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setName(defaultAddr.fullName || user.name || "");
          setPhone(defaultAddr.phone || "");
          setStreetAddress(defaultAddr.street || "");
          setCity(defaultAddr.city || "");
          setStateName(defaultAddr.state || "");
          setPincode(defaultAddr.pincode || "");
        }
      }
    }
  }, [user]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    if (addr.fullName) setName(addr.fullName);
    if (addr.phone) setPhone(addr.phone);
    if (addr.street) setStreetAddress(addr.street);
    if (addr.city) setCity(addr.city);
    if (addr.state) setStateName(addr.state);
    if (addr.pincode) setPincode(addr.pincode);
    toast.success("Saved address selected", { icon: "📍" });
    setActiveStep(3); // Advance to payment
  };

  // Pricing calculations
  const finalPrice = useMemo(() => {
    if (!product) return 0;
    return Number(product.finalPrice ?? product.price ?? product.originalPrice ?? 0);
  }, [product]);

  const originalPrice = useMemo(() => {
    if (!product) return 0;
    return Number(product.originalPrice ?? product.price ?? finalPrice);
  }, [product, finalPrice]);

  const totalPrice = finalPrice * qty;
  const originalTotalPrice = originalPrice * qty;
  const discountSavings = Math.max(0, originalTotalPrice - totalPrice);

  // Dynamic step completion flags
  const isContactComplete = useMemo(() => {
    const cleanPhone = phone.replace(/\D/g, "");
    return Boolean(name.trim().length >= 2 && cleanPhone.length === 10);
  }, [name, phone]);

  const isDeliveryComplete = useMemo(() => {
    const cleanPin = pincode.replace(/\D/g, "");
    return Boolean(streetAddress.trim() && city.trim() && stateName.trim() && cleanPin.length === 6);
  }, [streetAddress, city, stateName, pincode]);

  const isPaymentComplete = Boolean(paymentMethod);

  // Smooth step scroll navigation
  const goToStep = (step) => {
    setActiveStep(step);
    if (step === 1) {
      document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("order-fullname")?.focus();
    } else if (step === 2) {
      document.getElementById("section-delivery")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("order-street")?.focus();
    } else if (step === 3) {
      document.getElementById("section-payment")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Please enter your full name.";
    if (!phone.trim()) {
      errs.phone = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      errs.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!streetAddress.trim()) {
      errs.streetAddress = "Please provide your street / house / building address.";
    }
    if (!city.trim()) errs.city = "City / District is required.";
    if (!stateName.trim()) errs.stateName = "State is required.";
    if (!pincode.trim()) {
      errs.pincode = "PIN code is required.";
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errs.pincode = "Please enter a valid 6-digit PIN code.";
    }

    setErrors(errs);

    if (errs.name || errs.phone) {
      goToStep(1);
    } else if (errs.streetAddress || errs.city || errs.stateName || errs.pincode) {
      goToStep(2);
    }

    return Object.keys(errs).length === 0;
  };

  const handleOrder = async (e) => {
    if (e) e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required checkout fields.");
      return;
    }

    // Task 1: If user is not logged in when confirming, preserve draft and render to login page
    if (!user) {
      const draftData = {
        name,
        phone,
        email,
        streetAddress,
        city,
        stateName,
        pincode,
        landmark,
        paymentMethod,
        qty,
        product,
      };

      try {
        sessionStorage.setItem("ommasta_checkout_draft", JSON.stringify(draftData));
      } catch (err) {
        console.error("Failed to store draft", err);
      }

      toast("Please sign in to place and track your order.", { icon: "🔒" });
      navigate("/login", {
        state: {
          from: "/order",
          product,
          quantity: qty,
        },
      });
      return;
    }

    const compiledAddress = [
      streetAddress.trim(),
      landmark.trim() ? `Landmark: ${landmark.trim()}` : "",
      city.trim(),
      stateName.trim(),
      pincode.trim() ? `PIN: ${pincode.trim()}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    const orderData = {
      customerName: name.trim(),
      phone: phone.trim(),
      address: compiledAddress,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: finalPrice,
          quantity: qty,
        },
      ],
      paymentMethod: paymentMethod === "COD" ? "COD" : "ONLINE",
    };

    setActiveStep(4);
    setSubmitting(true);

    try {
      const data = await createOrder(orderData);

      const completedOrder = {
        orderId: data?.order?._id || data?._id || `OM-${Date.now()}`,
        customerName: name.trim(),
        phone: phone.trim(),
        address: compiledAddress,
        items: [
          {
            productId: product._id,
            name: product.name,
            price: finalPrice,
            quantity: qty,
            image: product.image,
          },
        ],
        total: totalPrice,
        paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
        orderedAt: new Date().toISOString(),
      };
      localStorage.setItem("lastOrder", JSON.stringify(completedOrder));

      toast.success("Order confirmed successfully!");

      // Dispatch WhatsApp order notification to store
      const whatsappDigits = settings?.whatsappNumber?.replace(/\D/g, "") || "919876543210";
      const message = `*NEW ORDER CONFIRMATION — OMMASTRA* 🛒
────────────────────────────
📦 *Product:* ${product.name}
🔢 *Quantity:* ${qty}
🏷️ *Unit Price:* ₹${finalPrice.toLocaleString("en-IN")}
💰 *Total Payable:* ₹${totalPrice.toLocaleString("en-IN")}
💳 *Payment Method:* ${paymentMethod === "COD" ? "Cash on Delivery (COD)" : "UPI / Online"}

👤 *Customer Details:*
• Name: ${name.trim()}
• Phone: ${phone.trim()}
• Delivery Address: ${compiledAddress}

────────────────────────────
Please confirm dispatch schedule. Thank you!`;

      try {
        window.open(`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`, "_blank");
      } catch (err) {
        console.warn("Popup blocked for WhatsApp notification", err);
      }

      navigate("/order-success", { state: { order: completedOrder } });
    } catch (err) {
      console.error("Order creation failed", err);
      const msg = err?.response?.data?.message || err?.message || "Order placement failed. Please try again.";
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please sign in to confirm your order.");
        navigate("/login", { state: { from: "/order" } });
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If no product selected, display empty state
  if (!product) {
    return (
      <main className="order-checkout-wrapper flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">No Product Selected</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Please choose a smartphone or accessory to proceed with secure checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/mobiles")}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate("/")}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="order-checkout-wrapper">
      <div className="order-checkout-container">
        {/* ================= 2. DYNAMIC & FUNCTIONAL CHECKOUT TRACKER ================= */}
        <div className="checkout-progress-bar" aria-label="Checkout Progress">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`checkout-progress-step ${activeStep === 1 ? "active" : isContactComplete ? "completed" : ""}`}
            title="Click to view Contact Information"
          >
            <span className="checkout-step-number">
              {isContactComplete && activeStep !== 1 ? <Check size={12} strokeWidth={3} /> : "01"}
            </span>
            <span>CONTACT</span>
          </button>

          <span className="checkout-step-divider">→</span>

          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`checkout-progress-step ${activeStep === 2 ? "active" : isDeliveryComplete ? "completed" : ""}`}
            title="Click to view Delivery Address"
          >
            <span className="checkout-step-number">
              {isDeliveryComplete && activeStep !== 2 ? <Check size={12} strokeWidth={3} /> : "02"}
            </span>
            <span>DELIVERY</span>
          </button>

          <span className="checkout-step-divider">→</span>

          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`checkout-progress-step ${activeStep === 3 ? "active" : isPaymentComplete && activeStep > 3 ? "completed" : ""}`}
            title="Click to view Payment Method"
          >
            <span className="checkout-step-number">
              {isPaymentComplete && activeStep > 3 ? <Check size={12} strokeWidth={3} /> : "03"}
            </span>
            <span>PAYMENT</span>
          </button>

          <span className="checkout-step-divider">→</span>

          <button
            type="button"
            disabled={!isContactComplete || !isDeliveryComplete}
            onClick={handleOrder}
            className={`checkout-progress-step ${activeStep === 4 || submitting ? "active" : ""}`}
            title="Order Confirmation"
          >
            <span className="checkout-step-number">04</span>
            <span>CONFIRMATION</span>
          </button>
        </div>

        {/* ================= 3. PAGE HEADER ================= */}
        <header className="checkout-page-header">
          <div className="checkout-header-title">
            <h1>Secure Checkout</h1>
            <p>Complete your details and review your order before placing it.</p>
          </div>
          <div className="checkout-trust-badge">
            <Lock size={14} className="text-blue-600" />
            <span>256-bit SSL Encryption</span>
          </div>
        </header>

        {/* ================= 1. MAIN TWO-COLUMN LAYOUT ================= */}
        <div className="checkout-main-grid">
          {/* ================= LEFT COLUMN: FORM SECTIONS (~65%) ================= */}
          <div className="checkout-left-form">
            <form onSubmit={handleOrder} noValidate>
              {/* Saved Addresses quick-picker (if logged in and has addresses) */}
              {user && user.addresses && user.addresses.length > 0 && (
                <div className="checkout-section-card mb-6">
                  <div className="checkout-card-header">
                    <div className="checkout-card-title">
                      <h2>Saved Addresses</h2>
                    </div>
                    <Link to="/profile/addresses" className="text-xs text-blue-600 hover:underline font-medium">
                      Manage Addresses
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id;
                      return (
                        <button
                          type="button"
                          key={addr._id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`text-left p-3.5 rounded-xl border transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                              : "border-slate-200 hover:border-slate-300 bg-slate-50/40"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-900 text-sm">{addr.fullName || "Address"}</span>
                            {isSelected && <Check size={16} className="text-blue-600 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {addr.street}, {addr.city}, {addr.pincode}
                          </p>
                          <span className="inline-block mt-2 text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {addr.phone}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 1: Contact Information */}
              <section
                id="section-contact"
                className={`checkout-section-card transition-all ${
                  activeStep === 1 ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm" : ""
                }`}
                onClick={() => setActiveStep(1)}
              >
                <div className="checkout-card-header">
                  <div className="checkout-card-title">
                    <span className="checkout-card-step-badge">1</span>
                    <h2>Contact Information</h2>
                  </div>
                  {isContactComplete && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Check size={12} strokeWidth={3} /> Completed
                    </span>
                  )}
                </div>

                <div className="checkout-grid-2">
                  {/* Full Name */}
                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="order-fullname">
                      Full Name<span className="req">*</span>
                    </label>
                    <input
                      id="order-fullname"
                      type="text"
                      placeholder="Rahul Sharma"
                      value={name}
                      onFocus={() => setActiveStep(1)}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                      }}
                      className={`checkout-input ${errors.name ? "error" : ""}`}
                      required
                    />
                    {errors.name && <p className="checkout-field-error">{errors.name}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="order-phone">
                      Mobile Number<span className="req">*</span>
                    </label>
                    <div className="checkout-input-wrapper">
                      <span className="checkout-phone-prefix">+91</span>
                      <input
                        id="order-phone"
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onFocus={() => setActiveStep(1)}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setPhone(val);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                        }}
                        className={`checkout-input checkout-phone-input ${errors.phone ? "error" : ""}`}
                        required
                      />
                    </div>
                    {errors.phone && <p className="checkout-field-error">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email Address */}
                <div className="checkout-field-group mb-0">
                  <label className="checkout-field-label" htmlFor="order-email">
                    Email Address <span className="opt">(Optional for order invoice)</span>
                  </label>
                  <input
                    id="order-email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onFocus={() => setActiveStep(1)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </section>

              {/* SECTION 2: Delivery Address */}
              <section
                id="section-delivery"
                className={`checkout-section-card transition-all ${
                  activeStep === 2 ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm" : ""
                }`}
                onClick={() => setActiveStep(2)}
              >
                <div className="checkout-card-header">
                  <div className="checkout-card-title">
                    <span className="checkout-card-step-badge">2</span>
                    <h2>Delivery Address</h2>
                  </div>
                  {isDeliveryComplete && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Check size={12} strokeWidth={3} /> Completed
                    </span>
                  )}
                </div>

                {/* Street Address */}
                <div className="checkout-field-group">
                  <label className="checkout-field-label" htmlFor="order-street">
                    Flat / House No. / Building / Street<span className="req">*</span>
                  </label>
                  <textarea
                    id="order-street"
                    rows={2}
                    placeholder="e.g. Flat 402, Royal Residency, MG Road"
                    value={streetAddress}
                    onFocus={() => setActiveStep(2)}
                    onChange={(e) => {
                      setStreetAddress(e.target.value);
                      if (errors.streetAddress) setErrors((prev) => ({ ...prev, streetAddress: null }));
                    }}
                    className={`checkout-textarea ${errors.streetAddress ? "error" : ""}`}
                    required
                  />
                  {errors.streetAddress && <p className="checkout-field-error">{errors.streetAddress}</p>}
                </div>

                {/* City, State, PIN */}
                <div className="checkout-grid-3">
                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="order-city">
                      City / District<span className="req">*</span>
                    </label>
                    <input
                      id="order-city"
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={city}
                      onFocus={() => setActiveStep(2)}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                      }}
                      className={`checkout-input ${errors.city ? "error" : ""}`}
                      required
                    />
                    {errors.city && <p className="checkout-field-error">{errors.city}</p>}
                  </div>

                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="order-state">
                      State<span className="req">*</span>
                    </label>
                    <input
                      id="order-state"
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={stateName}
                      onFocus={() => setActiveStep(2)}
                      onChange={(e) => {
                        setStateName(e.target.value);
                        if (errors.stateName) setErrors((prev) => ({ ...prev, stateName: null }));
                      }}
                      className={`checkout-input ${errors.stateName ? "error" : ""}`}
                      required
                    />
                    {errors.stateName && <p className="checkout-field-error">{errors.stateName}</p>}
                  </div>

                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="order-pincode">
                      PIN Code<span className="req">*</span>
                    </label>
                    <input
                      id="order-pincode"
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 400001"
                      value={pincode}
                      onFocus={() => setActiveStep(2)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                        if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: null }));
                      }}
                      className={`checkout-input ${errors.pincode ? "error" : ""}`}
                      required
                    />
                    {errors.pincode && <p className="checkout-field-error">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Nearby Landmark */}
                <div className="checkout-field-group mb-0">
                  <label className="checkout-field-label" htmlFor="order-landmark">
                    Nearby Landmark <span className="opt">(Optional)</span>
                  </label>
                  <input
                    id="order-landmark"
                    type="text"
                    placeholder="e.g. Near Metro Station / Behind City Hospital"
                    value={landmark}
                    onFocus={() => setActiveStep(2)}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </section>

              {/* SECTION 3: Payment Method */}
              <section
                id="section-payment"
                className={`checkout-section-card transition-all ${
                  activeStep === 3 ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm" : ""
                }`}
                onClick={() => setActiveStep(3)}
              >
                <div className="checkout-card-header">
                  <div className="checkout-card-title">
                    <span className="checkout-card-step-badge">3</span>
                    <h2>Payment Method</h2>
                  </div>
                  {isPaymentComplete && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Check size={12} strokeWidth={3} /> Selected
                    </span>
                  )}
                </div>

                {/* Option 1: Cash on Delivery */}
                <div
                  className={`payment-option-card ${paymentMethod === "COD" ? "selected" : ""}`}
                  onClick={() => {
                    setPaymentMethod("COD");
                    setActiveStep(3);
                  }}
                >
                  <div className="payment-radio-bullet">
                    {paymentMethod === "COD" && <div className="payment-radio-bullet-inner" />}
                  </div>
                  <div className="payment-option-content">
                    <div className="payment-option-header">
                      <span className="payment-option-title">Cash on Delivery</span>
                      <span className="payment-badge-recommended">Recommended</span>
                    </div>
                    <p className="payment-option-desc">
                      Pay with cash or UPI QR scan when your order arrives at your doorstep.
                    </p>
                  </div>
                </div>

                {/* Option 2: UPI / Instant Online Payment */}
                <div
                  className={`payment-option-card ${paymentMethod === "ONLINE" ? "selected" : ""}`}
                  onClick={() => {
                    setPaymentMethod("ONLINE");
                    setActiveStep(3);
                  }}
                >
                  <div className="payment-radio-bullet">
                    {paymentMethod === "ONLINE" && <div className="payment-radio-bullet-inner" />}
                  </div>
                  <div className="payment-option-content">
                    <div className="payment-option-header">
                      <span className="payment-option-title">UPI / Instant Online Payment</span>
                    </div>
                    <p className="payment-option-desc">
                      Pay securely using UPI (Google Pay, PhonePe, Paytm) upon order processing.
                    </p>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* ================= RIGHT COLUMN: STICKY ORDER SUMMARY (~35%) ================= */}
          <div className="checkout-right-summary">
            <div className="order-summary-card">
              <div className="order-summary-header">
                <h2>Order Summary</h2>
                <span className="text-xs font-semibold text-slate-500">
                  {qty} Item{qty > 1 ? "s" : ""}
                </span>
              </div>

              {/* Product Info */}
              <div className="order-product-row">
                <div className="order-product-thumb">
                  <img
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/160x160?text=Phone";
                    }}
                  />
                </div>
                <div className="order-product-details">
                  <div>
                    {product.brand && <span className="order-product-brand">{product.brand}</span>}
                    <h3 className="order-product-name">{product.name}</h3>
                  </div>

                  <div className="order-qty-stepper">
                    <span className="order-qty-label">Quantity:</span>
                    <div className="order-qty-control">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="order-qty-btn"
                        title="Decrease"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} strokeWidth={2.5} />
                      </button>
                      <span className="order-qty-val">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.min(10, q + 1))}
                        className="order-qty-btn"
                        title="Increase"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="order-pricing-box">
                <div className="order-price-row">
                  <span>Product Price</span>
                  <span className="font-medium text-slate-900">
                    ₹{(originalTotalPrice).toLocaleString("en-IN")}
                  </span>
                </div>

                {discountSavings > 0 && (
                  <div className="order-price-row discount">
                    <span>Discount</span>
                    <span>−₹{discountSavings.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="order-price-row delivery-free">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>

                <div className="order-price-divider" />

                <div className="order-price-total">
                  <span className="order-price-total-label">Total Payable</span>
                  <span className="order-price-total-val">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="order-cta-box">
                <button
                  type="button"
                  onClick={handleOrder}
                  disabled={submitting}
                  className="order-primary-btn"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Placing Order...
                    </span>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>

                <p className="order-legal-note">
                  By placing this order, you agree to our{" "}
                  <Link to="/contact">Terms & Conditions</Link> and{" "}
                  <Link to="/contact">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            {/* Compact Trust / Security Section */}
            <div className="order-trust-box">
              <div className="order-trust-item">
                <ShieldCheck size={18} className="order-trust-icon" />
                <div className="order-trust-text">
                  <h4>Secure Checkout</h4>
                  <p>Your information is transmitted securely.</p>
                </div>
              </div>

              <div className="order-trust-item">
                <Truck size={18} className="order-trust-icon" />
                <div className="order-trust-text">
                  <h4>Reliable Delivery</h4>
                  <p>Order tracking available after confirmation.</p>
                </div>
              </div>

              <div className="order-trust-item">
                <RotateCcw size={18} className="order-trust-icon" />
                <div className="order-trust-text">
                  <h4>Easy Support</h4>
                  <p>Contact support if you need help with your order.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Order;


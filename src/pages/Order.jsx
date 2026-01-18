import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOrder } from "../api/api";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 👇 SAFE access
  const product = location.state;

  // If user opens /order directly
  if (!product) {
    return (
      <div className="order-page">
        <h2>No product selected</h2>
        <p>Please select a product first.</p>

        <button className="btn" onClick={() => navigate("/mobiles")}>
          Go to Mobiles
        </button>
      </div>
    );
  }

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOrder = async () => {
    // 🔐 Validation
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    if (phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    const orderData = {
      customerName: name,
      phone,
      address,
      items: [
        {
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ],
      paymentMethod: "COD",
    };

    try {
      await createOrder(orderData);

      // ✅ WhatsApp message
      const message = `
🛒 New Order
Name: ${name}
Phone: ${phone}
Address: ${address}
Product: ${product.name}
Price: ₹${product.price}
Payment: Cash on Delivery
      `;

      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
        message,
      )}`;

      window.open(whatsappUrl, "_blank");

      setSuccess(true);
    } catch (error) {
      alert("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎉 Success Screen
  if (success) {
    return (
      <div className="order-success">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>We will contact you shortly.</p>

        <button className="btn" onClick={() => navigate("/mobiles")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Place Your Order</h2>

      {/* Product Summary */}
      <div className="order-product">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>
      </div>

      {/* Order Form */}
      <div className="order-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <p className="payment">
          Payment Method: <b>Cash on Delivery</b>
        </p>

        <button
          onClick={handleOrder}
          className="btn order-btn"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}

export default Order;

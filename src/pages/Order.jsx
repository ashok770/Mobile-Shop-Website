import { useState } from "react";
import { createOrder } from "../api/api";
import { useLocation } from "react-router-dom";

function Order() {
  const location = useLocation();
  const product = location.state; // ProductDetails passes product directly

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!product) {
    return <p style={{ textAlign: "center" }}>No product selected.</p>;
  }

  const handleOrder = async () => {
    // 🔒 Validation
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    if (!address.trim()) {
      alert("Please enter delivery address");
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
    } catch (error) {
      alert("Failed to place order");
      setLoading(false);
      return;
    }

    // 📲 WhatsApp message
    const message = `
🛒 New Order
Product: ${product.name}
Price: ₹${product.price}
Name: ${name}
Phone: ${phone}
Address: ${address}
Payment: Cash on Delivery
    `;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank");

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="order-page">
      <h2>Place Your Order</h2>

      <img
        src={product.image}
        alt={product.name}
        style={{ width: "220px", margin: "20px auto", display: "block" }}
      />

      <h3>{product.name}</h3>
      <p style={{ fontWeight: "bold" }}>₹{product.price}</p>

      {success ? (
        <p style={{ color: "green", marginTop: "20px" }}>
          ✅ Order placed successfully! We will contact you soon.
        </p>
      ) : (
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
          ></textarea>

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
      )}
    </div>
  );
}

export default Order;

import { useState } from "react";

function Order() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const productName = "Selected Product"; // later we’ll make this dynamic

  const handleOrder = () => {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    const message = `
New Order 🛒
Name: ${name}
Phone: ${phone}
Address: ${address}
Product: ${productName}
Payment: Cash on Delivery
    `;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="order-page">
      <h2>Place Your Order</h2>

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

        <button onClick={handleOrder} className="btn order-btn">
          Confirm Order on WhatsApp
        </button>
      </div>
    </div>
  );
}

export default Order;

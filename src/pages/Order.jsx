import { useState } from "react";
import { createOrder } from "../api/api";

function Order() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🔹 Later we’ll pass real product via route/state
  const productName = "Selected Product";
  const productPrice = 0;

  const handleOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    /* ===============================
       1️⃣ SAVE ORDER TO BACKEND
       =============================== */
    const orderData = {
      customerName: name,
      phone,
      address,
      items: [
        {
          name: productName,
          price: productPrice,
          quantity: 1,
        },
      ],
      paymentMethod: "COD",
    };

    try {
      await createOrder(orderData);
    } catch (error) {
      alert("Failed to place order. Try again.");
      return;
    }

    /* ===============================
       2️⃣ SEND WHATSAPP MESSAGE
       =============================== */
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

    /* ===============================
       3️⃣ RESET FORM (OPTIONAL)
       =============================== */
    setName("");
    setPhone("");
    setAddress("");
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
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Order;

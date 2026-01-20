import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOrder } from "../api/api";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle both old and new data structures
  const product = location.state?.product || location.state;
  const quantity = location.state?.quantity || 1;

  if (!product) {
    return (
      <div className="order-page">
        <h2>No product selected</h2>
        <p>Please select a product first.</p>
        <button className="btn" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  const [qty, setQty] = useState(quantity);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const finalPrice = product.finalPrice ?? product.price ?? product.originalPrice ?? 0;
  const totalPrice = finalPrice * qty;

  const handleOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill all details");
      return;
    }

    const orderData = {
      customerName: name,
      phone,
      address,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: finalPrice,
          quantity: qty,
        },
      ],
      paymentMethod: "COD",
    };

    try {
      await createOrder(orderData);

      const message = `
New Order 🛒
Product: ${product.name}
Quantity: ${qty}
Price: ₹${finalPrice}
Total: ₹${totalPrice}

Customer:
Name: ${name}
Phone: ${phone}
Address: ${address}
Payment: Cash on Delivery
`;

      window.open(
        `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
        "_blank",
      );

      navigate("/");
    } catch (err) {
      alert("Order failed. Try again.");
    }
  };

  return (
    <div className="order-page">
      <h2>Place Your Order</h2>

      <div className="order-card">
        <img src={product.image} alt={product.name} />

        <h3>{product.name}</h3>

        <p>
          {product.originalPrice && product.discountPercent > 0 && (
            <span className="old-price">₹{product.originalPrice}</span>
          )}
          <strong>₹{finalPrice}</strong>
        </p>

        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}>+</button>
        </div>

        <h3>Total: ₹{totalPrice}</h3>

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <p>
          <b>Payment:</b> Cash on Delivery
        </p>

        <button className="btn order-btn" onClick={handleOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Order;

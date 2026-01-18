import { useNavigate } from "react-router-dom";

function MobileCard({ name, price, image }) {
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate("/order", {
      state: {
        product: {
          name,
          price,
          image,
        },
      },
    });
  };

  return (
    <div className="mobile-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">₹{price}</p>

      <button className="btn order-btn" onClick={handleOrder}>
        Order Now
      </button>
    </div>
  );
}

export default MobileCard;

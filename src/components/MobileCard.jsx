import { useNavigate } from "react-router-dom";

function MobileCard({ id, name, price, image }) {
  const navigate = useNavigate();

  return (
    <div className="mobile-card">
      <img src={image} alt={name} />

      <h3>{name}</h3>
      <p className="price">₹{price}</p>

      <button
        className="btn order-btn"
        onClick={() =>
          navigate("/order", {
            state: { id, name, price, image },
          })
        }
      >
        Order Now
      </button>
    </div>
  );
}

export default MobileCard;

import { useNavigate } from "react-router-dom";

function MobileCard({ id, name, price, image }) {
  const navigate = useNavigate();

  return (
    <div className="mobile-card">
      <img src={image} alt={name} />

      <h4>{name}</h4>
      <p className="price">₹{price}</p>

      <button
        className="btn primary"
        onClick={() => navigate(`/product/${id}`)}
      >
        View Details
      </button>
    </div>
  );
}

export default MobileCard;

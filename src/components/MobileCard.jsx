import { Link } from "react-router-dom";

function MobileCard({ name, price, image }) {
  return (
    <div className="mobile-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">₹{price}</p>

      <Link to="/order" className="btn order-btn">
        Order Now
      </Link>
    </div>
  );
}

export default MobileCard;

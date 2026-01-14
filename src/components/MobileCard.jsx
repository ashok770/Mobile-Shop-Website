import { Link } from "react-router-dom";

function MobileCard({ name, price, image }) {
  return (
    <div className="card">
      <img src={image} alt={name} className="card-img" />

      <h3>{name}</h3>
      <p className="price">₹{price}</p>

      <Link to="/order" className="btn primary">
        Order Now
      </Link>
    </div>
  );
}

export default MobileCard;

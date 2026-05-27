import { NavLink, Link } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="brand-logo">
          <div className="logo-placeholder">
            <img
              src="/images/logo.png"
              alt="Ommasta Logo"
              className="logo-img"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="logo-fallback">
              <span className="logo-letter">O</span>
            </div>
          </div>
          <div className="brand-text">
            <h1 className="brand-name">
              <span className="brand-om">Om</span>
              <span className="brand-mast">mast</span>
            </h1>
            <span className="brand-tagline">Online Shop</span>
          </div>
        </Link>

        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/mobiles">Mobiles</NavLink>
          <NavLink to="/accessories">Accessories</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <button
            onClick={() => (window.location.href = "/cart.html")}
            style={{
              background: "none",
              border: "none",
              color: "#16a34a",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
              padding: "8px 12px",
            }}
          >
            🛒 Cart
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

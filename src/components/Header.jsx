import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <div className="brand-logo">
          <div className="logo-placeholder">
            <img src="/images/logo.png" alt="Ommast Logo" className="logo-img" onError={(e) => e.target.style.display = 'none'} />
            <div className="logo-fallback">O</div>
          </div>
          <div className="brand-text">
            <h1 className="brand-name">Om<span className="brand-space"></span>mast</h1>
            <span className="brand-tagline">Online Shop</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/mobiles">Mobiles</NavLink>
          <NavLink to="/accessories">Accessories</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;

import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <h1 className="logo">Mobile Shop</h1>

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

import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={{ padding: "15px", background: "#0d6efd", color: "#fff" }}>
      <h2>📱 Mobile Shop</h2>

      <nav style={{ marginTop: "10px" }}>
        <Link style={linkStyle} to="/">
          Home
        </Link>
        <Link style={linkStyle} to="/mobiles">
          Mobiles
        </Link>
        <Link style={linkStyle} to="/accessories">
          Accessories
        </Link>
        <Link style={linkStyle} to="/services">
          Services
        </Link>
        <Link style={linkStyle} to="/contact">
          Contact
        </Link>
      </nav>
    </header>
  );
}

const linkStyle = {
  marginRight: "15px",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
};

export default Header;

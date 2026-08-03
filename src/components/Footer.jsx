import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <h3 className="brand-name">
            <span className="brand-om">Om</span>
            <span className="brand-mast">mast</span>
          </h3>
          <p>
            Your trusted destination for the latest smartphones, accessories, and
            expert repair services. Genuine products, best prices.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/mobiles">Mobiles</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="tel:9876543210">9876543210</a></li>
            <li>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Store Hours</h4>
          <ul>
            <li>Mon – Sat: 10 AM – 9 PM</li>
            <li>Sunday: 11 AM – 7 PM</li>
            <li>Main Market, Your City</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 Ommast Mobile Shop. All rights reserved.</p>
        <div className="footer-social">
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" title="WhatsApp">💬</a>
          <a href="tel:9876543210" title="Call">📞</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

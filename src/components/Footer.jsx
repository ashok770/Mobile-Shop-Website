import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Headphones,
  MapPinned,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Truck,
} from "lucide-react";

function InstagramIcon({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
}

function FacebookIcon({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z" /></svg>;
}

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
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/mobiles">Mobiles</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Support</h4>
          <ul>
            <li><Link to="/services">Repair Services</Link></li>
            <li><Link to="/order">Track Your Order</Link></li>
            <li><Link to="/contact">Help Centre</Link></li>
            <li><a href="tel:9876543210">9876543210</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Store Information</h4>
          <ul>
            <li>Main Market, Your City</li>
            <li>Mon – Sat: 10 AM – 9 PM</li>
            <li>Sunday: 11 AM – 7 PM</li>
            <li><a href="mailto:hello@ommasta.com">hello@ommasta.com</a></li>
          </ul>
        </div>

        <div className="footer-col footer-follow">
          <h4>Follow Us</h4>
          <p>Stay connected for new launches, offers, and service updates.</p>
          <div className="footer-social" aria-label="Social media links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" aria-label="Google Maps"><MapPinned size={17} /></a>
          </div>
        </div>
      </div>

      <div className="container footer-trust" aria-label="Why shop with us">
        <div><BadgeCheck size={19} /><span>Genuine Products</span></div>
        <div><ShieldCheck size={19} /><span>Secure Payments</span></div>
        <div><Truck size={19} /><span>Fast Delivery</span></div>
        <div><Headphones size={19} /><span>Customer Support</span></div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 Ommast Mobile Shop. All rights reserved.</p>
        <p className="footer-made">Your trusted mobile destination.</p>
      </div>

      <div className="floating-actions" aria-label="Quick contact options">
        <a className="floating-action floating-action--whatsapp" href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={24} /></a>
        <a className="floating-action floating-action--call" href="tel:9876543210" aria-label="Call us"><PhoneCall size={22} /></a>
      </div>
    </footer>
  );
}

export default Footer;

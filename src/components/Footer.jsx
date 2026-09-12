
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  Mail,
  MessageCircle,
  PhoneCall,
} from "lucide-react";

function InstagramIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z" />
    </svg>
  );
}

function YoutubeIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a1120] text-slate-400 border-t border-slate-800/80 relative z-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Identity Column */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-3.5">
            <Link to="/" className="flex items-center gap-3 group w-fit" aria-label="Ommastra Home">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 shadow-md">
                <img
                  src="/images/logo.png"
                  alt="Ommastra"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center hidden" aria-hidden="true">
                  <span className="text-white font-black text-lg">O</span>
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                OMMASTRA
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mt-1">
              Your certified destination for authentic smartphones, premium audio gear, and factory-standard repair diagnostics.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 w-fit mt-1">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Certified Retailer &amp; Service Partner</span>
            </div>

            <div className="flex items-center gap-2.5 pt-3" aria-label="Social media links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/mobiles" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Smartphones</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Accessories</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Services</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
              <li>
                <Link to="/offers/mega-flash" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Deals &amp; Offers</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-5">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/services" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Repair Services</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
              <li>
                <Link to="/profile/orders" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Order Tracking</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center justify-between text-slate-400 hover:text-white transition-colors group">
                  <span>Help Centre</span>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </Link>
              </li>
            </ul>

            <div className="mt-5 pt-1">
              <a href="tel:9876543210" className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-emerald-400 transition-colors group">
                <Phone size={15} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </div>

          {/* Store Information Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-5">
              Store Information
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Main Market, City Center, India</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <p>Mon - Sat: 10 AM – 9 PM</p>
                  <p className="text-xs text-slate-500 mt-1">Sunday: 11 AM – 7 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail size={16} className="text-blue-400 shrink-0" />
                <a href="mailto:hello@ommastra.com" className="hover:text-blue-400 transition-colors">
                  hello@ommastra.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Ommastra Mobile Shop. All rights reserved.</p>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-500">
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-800">|</span>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Terms &amp; Conditions</Link>
            <span className="text-slate-800">|</span>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50 group/fab" aria-label="Quick contact options">
        <a
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
        <a
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          href="tel:9876543210"
          aria-label="Call us"
          title="Call Customer Support"
        >
          <PhoneCall size={20} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;

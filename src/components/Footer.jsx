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
import { useSettings } from "../context/SettingsContext";

function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z" />
    </svg>
  );
}

function YoutubeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function Footer() {
  const { settings } = useSettings();
  const whatsappDigits = settings?.whatsappNumber ? settings.whatsappNumber.replace(/\D/g, "") : "";

  return (
    <footer className="bg-[#0b1221] text-slate-400 relative z-20 overflow-hidden flex flex-col">
      {/* Main Content Area */}
      <div className="max-w-[1280px] w-full mx-auto px-5 sm:px-8 pt-14 lg:pt-[72px] pb-12 lg:pb-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 lg:gap-8">
          {/* 1. Brand Block */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group w-fit" aria-label="Ommastra Home">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-sm">
                <img src="/images/logo.png" alt="Ommastra Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">OMMASTRA</span>
            </Link>
            <p className="text-[14px] text-slate-400/90 leading-relaxed max-w-[280px]">
              Your certified destination for authentic smartphones, premium audio gear, and factory-standard repair diagnostics.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[13px] text-slate-300 w-fit">
              <ShieldCheck size={16} className="text-blue-400 shrink-0" />
              <span className="font-medium">Certified Retailer & Service Partner</span>
            </div>
            {/* Social Icons - Redesigned & Larger */}
            <div className="flex items-center gap-3 pt-4" aria-label="Social media links">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-pink-600 hover:border-pink-600 flex items-center justify-center transition-all duration-300" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              )}
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center transition-all duration-300" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              )}
              {whatsappDigits && (
                <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center transition-all duration-300" aria-label="WhatsApp">
                  <MessageCircle size={20} strokeWidth={1.5} />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300" aria-label="YouTube">
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="lg:pl-4">
            <h4 className="text-[13px] font-semibold text-slate-100 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/mobiles" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Smartphones</Link></li>
              <li><Link to="/accessories" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Accessories</Link></li>
              <li><Link to="/services" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Services</Link></li>
              <li><Link to="/offers/mega-flash" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Deals & Offers</Link></li>
            </ul>
          </div>

          {/* 3. Customer Care */}
          <div>
            <h4 className="text-[13px] font-semibold text-slate-100 uppercase tracking-widest mb-6">Customer Care</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Repair Services</Link></li>
              <li><Link to="/profile/orders" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Order Tracking</Link></li>
              <li><Link to="/contact" className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors inline-block">Help Centre</Link></li>
            </ul>
            <div className="mt-6">
              {settings?.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`} className="inline-flex items-center gap-2.5 text-[14px] text-white font-medium hover:text-blue-400 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Phone size={14} className="text-white group-hover:text-blue-400 transition-colors" />
                    </div>
                    {settings.contactPhone}
                  </a>
                )}
            </div>
          </div>

          {/* 4. Store Information */}
          <div>
            <h4 className="text-[13px] font-semibold text-slate-100 uppercase tracking-widest mb-6">Store Information</h4>
            <ul className="space-y-5">
              {settings?.address && (
                <li className="flex items-start gap-3.5">
                  <div className="mt-0.5 text-slate-400 shrink-0"><MapPin size={18} strokeWidth={1.5} /></div>
                  <span className="text-[14px] text-slate-400 leading-relaxed">
                    {`${settings.address}, ${settings.city}, ${settings.state}, ${settings.country}, ${settings.postalCode}`}
                  </span>
                </li>
              )}
              {(settings?.weekdayHours || settings?.weekendHours) && (
                <li className="flex items-start gap-3.5">
                  <div className="mt-0.5 text-slate-400 shrink-0"><Clock size={18} strokeWidth={1.5} /></div>
                  <div className="text-[14px] text-slate-400 leading-relaxed">
                    <p>{settings.weekdayHours ? `Weekdays: ${settings.weekdayHours}` : ""}{settings.weekendHours ? ` | Weekends: ${settings.weekendHours}` : ""}</p>
                  </div>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-start gap-3.5">
                  <div className="mt-0.5 text-slate-400 shrink-0"><Mail size={18} strokeWidth={1.5} /></div>
                  <a href={`mailto:${settings.contactEmail}`} className="text-[14px] text-slate-400 hover:text-blue-400 transition-colors">{settings.contactEmail}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="bg-[#070c17] border-t border-white/[0.04]">
        <div className="max-w-[1280px] w-full mx-auto px-5 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-slate-500 text-center md:text-left">© 2026 Ommastra Mobile Shop. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-5 md:gap-7 text-[13px]">
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">Terms & Conditions</Link>
            <Link to="/support" className="text-slate-500 hover:text-slate-300 transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 group/fab" aria-label="Quick contact options">
        <a
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "#"}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
        <a
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          href={settings?.contactPhone ? `tel:${settings.contactPhone}` : "#"}
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

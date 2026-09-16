import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Phone, Mail, MapPin, Clock, ArrowRight, ChevronDown, Wrench, AlertCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import "./Contact.css";

const FAQS = [
  {
    question: "How can I get a repair quote?",
    answer: "You can use the contact form above and select 'Repair / Maintenance'. Please provide your device model and the issue you're facing. Our team will reach out with an estimated quote."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can also view your order status in your Account dashboard."
  },
  {
    question: "Do you offer trade-in services?",
    answer: "Yes, we offer trade-ins for most major smartphone brands. The trade-in value depends on the condition and model of your device. Contact us for a preliminary assessment."
  },
  {
    question: "How do I get warranty support?",
    answer: "If your device is under warranty, please bring it to our store with the original receipt, or contact us using the form above with your Order ID."
  },
  {
    question: "Can you transfer data to a new phone?",
    answer: "Yes, we offer secure data transfer services from your old device to your new one when you purchase a phone from us or as a standalone service."
  }
];

function Contact() {
  const location = useLocation();
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    orderId: "",
    message: ""
  });

  const [serviceContext, setServiceContext] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, submitted

  // Parse URL Parameters
  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(location.search);
    const serviceName = params.get("service");
    
    if (serviceName) {
      setServiceContext(serviceName);
      setFormData(prev => ({ ...prev, category: "Repair / Maintenance" }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (category) => {
    setFormData(prev => ({ ...prev, category }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since there is no backend for contact submission yet, we show a notice.
    setSubmitStatus("submitted");
  };

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Settings will provide these values. Fallbacks handled in rendering.
  const { settings, loading, error } = useSettings();

  return (
    <div className="c1-page">
      {/* Hero Section */}
      <section className="c1-hero">
        <span className="c1-hero-eyebrow">Contact Ommastra</span>
        <h1 className="c1-hero-title">Need help with your device or order?</h1>
        <p className="c1-hero-sub">
          From product questions and order support to repairs, trade-ins, and after-sales care, we're here to help.
        </p>
        <div className="c1-hero-actions">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="c1-btn-primary">
            <MessageCircle size={20} /> WhatsApp Us
          </a>
          <a href={`tel:${PHONE_NUMBER}`} className="c1-btn-secondary">
            <Phone size={20} /> Call Us
          </a>
        </div>
      </section>

      <main className="c1-container">
        {/* Help Categories */}
        <section aria-labelledby="help-categories">
          <h2 id="help-categories" className="c1-section-title">How can we help?</h2>
          <div className="c1-categories">
            {["Product Inquiry", "Order Support", "Repair / Maintenance", "Trade-In", "Warranty / After-Sales", "Data Transfer"].map(cat => (
              <button 
                key={cat} 
                className="c1-category-chip"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="c1-grid">
          {/* Left Column: Contact Options */}
          <div className="c1-options">
            <div className="c1-option-card">
              <div className="c1-option-icon"><MessageCircle /></div>
              <div className="c1-option-content">
                <h3 className="c1-option-title">WhatsApp</h3>
                <p className="c1-option-desc">Fastest support channel</p>
                {settings?.whatsappNumber ? (
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="c1-option-link">
                    Chat Now <ArrowRight size={14} />
                  </a>
                ) : (
                  <span className="c1-option-link text-slate-500">WhatsApp unavailable</span>
                )}
              </div>
            </div>

            <div className="c1-option-card">
              <div className="c1-option-icon"><Phone /></div>
              <div className="c1-option-content">
                <h3 className="c1-option-title">Phone</h3>
                <p className="c1-option-desc">Speak with our team</p>
                {settings?.contactPhone ? (
                  <a href={`tel:${settings.contactPhone}`} className="c1-option-link">
                    Call Now <ArrowRight size={14} />
                  </a>
                ) : (
                  <span className="c1-option-link text-slate-500">Phone unavailable</span>
                )}
              </div>
            </div>

            <div className="c1-option-card">
              <div className="c1-option-icon"><Mail /></div>
              <div className="c1-option-content">
                <h3 className="c1-option-title">Email</h3>
                <p className="c1-option-desc">For detailed questions</p>
                {settings?.contactEmail ? (
                  <a href={`mailto:${settings.contactEmail}`} className="c1-option-link">
                    Send Email <ArrowRight size={14} />
                  </a>
                ) : (
                  <span className="c1-option-link text-slate-500">Email unavailable</span>
                )}
              </div>
            </div>

            <div className="c1-option-card">
              <div className="c1-option-icon"><MapPin /></div>
              <div className="c1-option-content">
                <h3 className="c1-option-title">Visit Store</h3>
                <p className="c1-option-desc">Physical support & repairs</p>
                <a href="#store-location" className="c1-option-link">
                  View Location <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="c1-form-card" ref={formRef}>
            <div className="c1-form-header">
              <h2 className="c1-form-title">Send us a message</h2>
            </div>

            {serviceContext && (
              <div className="c1-context-banner">
                <Wrench className="c1-context-icon" size={20} />
                <span className="c1-context-text">
                  You're contacting us about <strong>{serviceContext}</strong>
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="c1-form-row">
                <div className="c1-form-group">
                  <label className="c1-form-label">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="c1-form-input" required />
                </div>
                <div className="c1-form-group">
                  <label className="c1-form-label">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="c1-form-input" required />
                </div>
              </div>

              <div className="c1-form-row">
                <div className="c1-form-group">
                  <label className="c1-form-label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="c1-form-input" />
                </div>
                <div className="c1-form-group">
                  <label className="c1-form-label">Order ID (optional)</label>
                  <input type="text" name="orderId" value={formData.orderId} onChange={handleChange} className="c1-form-input" placeholder="e.g. ORD-12345" />
                </div>
              </div>

              <div className="c1-form-group">
                <label className="c1-form-label">How can we help? *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="c1-form-select" required>
                  <option value="" disabled>Select a topic</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Repair / Maintenance">Repair / Maintenance</option>
                  <option value="Trade-In">Trade-In</option>
                  <option value="Warranty / After-Sales">Warranty / After-Sales</option>
                  <option value="Data Transfer">Data Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="c1-form-group">
                <label className="c1-form-label">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="c1-form-textarea" placeholder="Provide as much detail as possible..." required></textarea>
              </div>

              <button type="submit" className="c1-form-submit">
                Send Request
              </button>

              {submitStatus === "submitted" && (
                <div className="c1-alert">
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Backend pending:</strong> Form submission is not yet connected to a server endpoint. Please use WhatsApp or Call for immediate assistance.
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Store Information */}
        <section id="store-location" className="c1-store-section" aria-labelledby="store-heading">
          <div className="c1-store-info">
            <h3 id="store-heading">Visit Ommastra</h3>
            <p className="c1-store-note">Note: Store configurations will be managed via Admin Settings in the future.</p>

            <div className="c1-store-details">
              <div className="c1-store-item">
                <MapPin className="c1-store-item-icon" />
                <div className="c1-store-item-text">
                  <strong>Address</strong>
                  <span>{settings?.address ? `${settings.address}, ${settings.city}, ${settings.state}, ${settings.country}, ${settings.postalCode}` : "Not configured"}</span>
                </div>
              </div>
              <div className="c1-store-item">
                <Clock className="c1-store-item-icon" />
                <div className="c1-store-item-text">
                  <strong>Working Hours</strong>
                  <span>10:00 AM – 9:00 PM (Mon–Sat)</span>
                </div>
              </div>
              <div className="c1-store-item">
                <Phone className="c1-store-item-icon" />
                <div className="c1-store-item-text">
                  <strong>Phone</strong>
                  <span>{PHONE_NUMBER}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="c1-map-container">
            <iframe
              title="shop-location"
              src="https://www.google.com/maps?q=New%20Delhi&output=embed"
              loading="lazy"
            ></iframe>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="c1-faq-section" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="c1-section-title">Common Questions</h2>
          <div className="c1-faq-list">
            {FAQS.map((faq, index) => (
              <div key={index} className={`c1-faq-item ${openFaq === index ? "open" : ""}`}>
                <button className="c1-faq-trigger" onClick={() => toggleFaq(index)} aria-expanded={openFaq === index}>
                  {faq.question}
                  <ChevronDown className="c1-faq-icon" size={20} />
                </button>
                {openFaq === index && (
                  <div className="c1-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contact;

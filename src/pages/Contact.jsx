function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you — visit us or reach out anytime</p>
      </div>

      <div className="contact-body">
        <div className="contact-card">
          <h3>Get in Touch</h3>

          <div className="contact-item">
            <div className="contact-item-icon">📞</div>
            <div className="contact-item-text">
              <strong>Phone</strong>
              <a href="tel:9876543210">9876543210</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">💬</div>
            <div className="contact-item-text">
              <strong>WhatsApp</strong>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">📍</div>
            <div className="contact-item-text">
              <strong>Address</strong>
              <span>Main Market, Your City</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">⏰</div>
            <div className="contact-item-text">
              <strong>Working Hours</strong>
              <span>10:00 AM – 9:00 PM (Mon–Sat)</span>
            </div>
          </div>
        </div>

        <div className="contact-map-card">
          <iframe
            title="shop-location"
            src="https://www.google.com/maps?q=New%20Delhi&output=embed"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;

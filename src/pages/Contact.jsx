function Contact() {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>

      <div className="contact-card">
        <p>
          <b>📞 Phone:</b> <a href="tel:9876543210">9876543210</a>
        </p>

        <p>
          <b>💬 WhatsApp:</b>{" "}
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
            Chat on WhatsApp
          </a>
        </p>

        <p>
          <b>📍 Address:</b> Main Market, Your City
        </p>

        <p>
          <b>⏰ Working Hours:</b> 10:00 AM – 9:00 PM
        </p>

        {/* Google Map */}
        <iframe
          title="shop-location"
          src="https://www.google.com/maps?q=New%20Delhi&output=embed"
          width="100%"
          height="250"
          style={{ border: 0, marginTop: "15px" }}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;

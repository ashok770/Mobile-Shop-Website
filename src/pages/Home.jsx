import "../styles/main.css";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Mobile Shop</h1>
        <p>Your one-stop shop for mobiles, accessories & repair services</p>

        <div className="hero-buttons">
          <a href="tel:9876543210" className="btn call">
            📞 Call Now
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            className="btn whatsapp"
          >
            💬 WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;

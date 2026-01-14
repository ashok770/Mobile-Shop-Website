import "../styles/main.css";
import MobileCard from "../components/MobileCard";

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
        {/* Services Section */}
        <section className="services">
          <h2>Our Services</h2>

          <div className="service-list">
            <div className="service-card">🔧 Mobile Repair</div>
            <div className="service-card">📱 Screen Replacement</div>
            <div className="service-card">⚙️ Software Update</div>
            <div className="service-card">🛡️ Warranty Support</div>
          </div>
        </section>

        <section className="mobiles">
          <h2>Featured Mobiles</h2>

          <div className="mobile-list">
            <MobileCard
              name="Samsung Galaxy S21"
              price="49999"
              image="/image/mobiles/Samsung.jpg"
            />
            <MobileCard
              name="iPhone 13"
              price="69999"
              image="/image/mobiles/iphone.jpg"
            />
            <MobileCard
              name="Redmi Note 12"
              price="17999"
              image="/image/mobiles/redmi.jpg"
            />
          </div>
        </section>
      </section>
    </div>
  );
}

export default Home;

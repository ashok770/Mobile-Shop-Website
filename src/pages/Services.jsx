function Services() {
  const services = [
    {
      id: 1,
      title: "Mobile Repair",
      desc: "All brand mobile repair by expert technicians with genuine parts",
      icon: "🔧",
    },
    {
      id: 2,
      title: "Screen Replacement",
      desc: "Original quality screen replacement for all major brands",
      icon: "📱",
    },
    {
      id: 3,
      title: "Software Update",
      desc: "OS update, bug fix & performance improvement for your device",
      icon: "⚙️",
    },
    {
      id: 4,
      title: "Warranty Support",
      desc: "Genuine warranty & after-sales support you can trust",
      icon: "🛡️",
    },
  ];

  return (
    <div className="services-page">
      <div className="services-hero">
        <h2>Our Services</h2>
        <p>Expert care for your devices — fast, reliable, and affordable</p>
      </div>

      <div className="services">
        <div className="service-list">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <a
                href="https://wa.me/919876543210?text=I want to book a service"
                target="_blank"
                rel="noreferrer"
                className="btn order-btn"
              >
                Book on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;

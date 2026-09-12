import { Wrench, Smartphone, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/main.css";

function ServicesSection() {
  const services = [
    {
      id: 1,
      title: "Expert Repair",
      desc: "All brand mobile repair by certified technicians using genuine parts.",
      Icon: Wrench,
    },
    {
      id: 2,
      title: "Screen Replacement",
      desc: "Original quality screen replacement for all major mobile models.",
      Icon: Smartphone,
    },
    {
      id: 3,
      title: "OS & Software Updates",
      desc: "Official OS updates, bug fixes, and speed optimization for your device.",
      Icon: RefreshCw,
    },
    {
      id: 4,
      title: "Warranty & Support",
      desc: "Genuine warranty coverage and dedicated after-sales support.",
      Icon: ShieldCheck,
    },
  ];

  return (
    <section className="why-ommastra-section" aria-labelledby="why-ommastra-heading">
      <div className="why-ommastra-container">
        
        {/* Editorial Header & CTA */}
        <div className="why-ommastra-header">
          <div className="why-ommastra-title-group">
            <span className="why-ommastra-eyebrow">WHY OMMASTRA</span>
            <h2 id="why-ommastra-heading" className="why-ommastra-heading">
              Care beyond the purchase
            </h2>
            <p className="why-ommastra-desc">
              Expert care for your devices, from certified repair to ongoing dedicated customer support.
            </p>
          </div>
          
          <div className="why-ommastra-cta-wrapper">
            <Link to="/services" className="why-ommastra-cta">
              View All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="why-ommastra-grid">
          {services.map((service) => (
            <div key={service.id} className="why-ommastra-card">
              <div className="why-ommastra-card-icon" aria-hidden="true">
                <service.Icon size={36} strokeWidth={1.5} />
              </div>
              <h3 className="why-ommastra-card-title">{service.title}</h3>
              <p className="why-ommastra-card-desc">{service.desc}</p>
              <Link to="/services" className="why-ommastra-card-link">
                Explore service
                <ArrowRight size={16} className="why-ommastra-card-arrow" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;

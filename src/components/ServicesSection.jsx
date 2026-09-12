import { Wrench, Smartphone, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section 
      className="w-full"
      aria-labelledby="why-ommastra-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header & CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] sm:text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
              WHY OMMASTRA
            </span>
            <h2 
              id="why-ommastra-heading" 
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
            >
              Care beyond the purchase
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Expert care for your devices, from certified repair to ongoing dedicated customer support.
            </p>
          </div>
          
          <div className="hidden md:block pb-1">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 hover:border-blue-300 rounded-lg hover:bg-blue-50"
            >
              View All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col h-full bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
            >
              <div 
                className="mb-6 inline-flex text-blue-600 transition-transform duration-300 group-hover:-translate-y-1" 
                aria-hidden="true"
              >
                <service.Icon size={36} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-lg sm:text-base font-bold text-slate-900 mb-3 leading-snug">
                {service.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-8 flex-grow">
                {service.desc}
              </p>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-auto group/link"
              >
                Explore service
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 hover:border-blue-300 rounded-lg hover:bg-white w-full justify-center"
          >
            View All Services & Repairs
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;

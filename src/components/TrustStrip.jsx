import { createElement } from "react";
import { TRUST_ITEMS } from "../constants/trustItems";

function TrustStrip() {
  return (
    <section 
      className="bg-white py-12 sm:py-16" 
      aria-label="Purchase Assurance"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Grid with vertical separators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-start sm:items-center gap-4 sm:gap-5"
            >
              {/* Icon */}
              <div 
                className="text-blue-600 shrink-0 mt-0.5 sm:mt-0 flex items-center justify-center" 
                aria-hidden="true"
              >
                {createElement(item.Icon, { size: 32, strokeWidth: 1.5 })}
              </div>
              
              {/* Content */}
              <div className="flex flex-col min-w-0">
                <h3 className="text-[15px] sm:text-base font-bold text-slate-900 leading-snug mb-1">
                  {item.label}
                </h3>
                <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default TrustStrip;

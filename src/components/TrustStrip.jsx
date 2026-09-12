import { createElement } from "react";
import { TRUST_ITEMS } from "../constants/trustItems";

function TrustStrip() {
  return (
    <section 
      className="bg-white py-8 sm:py-10 shadow-sm border-y border-slate-200 w-full" 
      aria-label="Purchase Assurance"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 sm:gap-4"
            >
              {/* Icon */}
              <div 
                className="text-blue-600 shrink-0 flex items-center justify-center" 
                aria-hidden="true"
              >
                {createElement(item.Icon, { size: 28, strokeWidth: 1.5 })}
              </div>
              
              {/* Content */}
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                  {item.label}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-tight mt-0.5">
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

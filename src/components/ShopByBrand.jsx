import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CATALOG_BRANDS = [
  {
    id: "apple",
    name: "Apple",
    path: "/mobiles?brand=Apple",
    brandClass: "font-semibold tracking-tight text-slate-900 text-[16px] md:text-[17px]",
  },
  {
    id: "samsung",
    name: "SAMSUNG",
    path: "/mobiles?brand=Samsung",
    brandClass: "font-bold tracking-[0.14em] uppercase text-slate-900 text-[13px] md:text-[14px]",
  },
  {
    id: "redmi",
    name: "Redmi",
    path: "/mobiles?brand=Redmi",
    brandClass: "font-bold tracking-tight text-slate-900 text-[16px] md:text-[17px]",
  },
  {
    id: "motorola",
    name: "Motorola",
    path: "/mobiles?brand=moto",
    brandClass: "font-semibold tracking-wide text-slate-900 text-[14px] md:text-[15px]",
  },
  {
    id: "noise",
    name: "NOISE",
    path: "/accessories?brand=Noise",
    brandClass: "font-bold tracking-[0.18em] uppercase text-slate-900 text-[12px] md:text-[13px]",
  },
  {
    id: "boult",
    name: "BOULT",
    path: "/accessories?brand=Boult",
    brandClass: "font-bold tracking-[0.12em] uppercase text-slate-900 text-[13px] md:text-[14px]",
  },
];

function ShopByBrand() {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50/70 border-b border-slate-200/70 py-6 md:py-8" aria-labelledby="shop-by-brand-title">
      <div className="container mx-auto max-w-[1280px] px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h2
              id="shop-by-brand-title"
              className="text-base md:text-lg font-bold text-slate-900 tracking-wide uppercase"
            >
              Shop by Brand
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Explore top brands you love.
            </p>
          </div>

          <Link
            to="/mobiles"
            className="group inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Brand Rail — Desktop: 6-item grid row; Mobile: horizontal scroll rail */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-3.5 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x hide-scrollbar">
          {CATALOG_BRANDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => navigate(brand.path)}
              aria-label={`Shop products from ${brand.name}`}
              className="shrink-0 snap-start w-[136px] sm:w-auto h-[56px] md:h-[62px] bg-white border border-slate-200/90 rounded-xl px-3 flex items-center justify-center text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-blue-600 transition-all duration-200 group cursor-pointer"
            >
              <span className={`${brand.brandClass} select-none transition-colors duration-200 group-hover:text-blue-600`}>
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopByBrand;

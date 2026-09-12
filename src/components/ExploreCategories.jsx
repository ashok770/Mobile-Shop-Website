import { useNavigate } from "react-router-dom";
import { Smartphone, Headphones } from "lucide-react";

const categories = [
  {
    name: "Smartphones",
    path: "/mobiles",
    Icon: Smartphone,
    desc: "Latest mobiles",
  },
  {
    name: "Accessories",
    path: "/accessories",
    Icon: Headphones,
    desc: "Premium gear",
  }
];

function ExploreCategories() {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50 py-10" aria-labelledby="shop-by-category-title">
      <div className="container mx-auto px-4 max-w-[1320px]">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Shop by Category</h2>
          <p className="text-sm text-slate-500 mt-1">Find Your Perfect Device</p>
        </div>
        <div className="flex overflow-x-auto gap-4 md:gap-8 pb-6 snap-x hide-scrollbar justify-start md:justify-center">
          {categories.map((category) => {
            return (
              <button
                key={category.name}
                type="button"
                className="flex flex-col items-center gap-3 shrink-0 snap-start group w-[100px] md:w-[130px]"
                onClick={() => navigate(category.path)}
                aria-label={`Shop ${category.name}`}
              >
                <div className="w-[84px] h-[84px] md:w-[104px] md:h-[104px] rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center p-3 group-hover:shadow-md group-hover:border-blue-400 transition-all duration-300 group-hover:-translate-y-1">
                  <category.Icon size={40} strokeWidth={1.5} className="text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <span className="block text-[14px] md:text-[15px] font-semibold text-slate-700 leading-tight group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </span>
                  <span className="block text-[11px] md:text-[12px] text-slate-500 mt-0.5">
                    {category.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExploreCategories;

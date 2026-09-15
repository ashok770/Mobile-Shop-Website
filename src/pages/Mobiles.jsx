import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/api";
import { useBrands } from "../context/BrandContext";

function Mobiles() {
  const [mobiles, setMobiles] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { brands, loading, error } = useBrands();
  
  const selectedBrand = new URLSearchParams(location.search).get("brand") || "All";
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setMobiles(data.filter((p) => p.category === "mobile"));
    };
    fetchData();
  }, []);

  const isBrandMatch = (productBrand, targetBrand) => {
    if (!targetBrand || targetBrand === "All") return true;
    if (!productBrand) return false;
    return productBrand.toLowerCase() === targetBrand.toLowerCase();
  };

  const filteredMobiles = mobiles.filter((mobile) => {
    const matchesBrand = isBrandMatch(mobile.brand, selectedBrand);
    const matchesSearch = mobile.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const handleBrandClick = (b) => {
    const params = new URLSearchParams(location.search);
    if (b === "All") {
      params.delete("brand");
    } else {
      params.set("brand", b);
    }
    navigate({ search: params.toString() });
  };

  // Build dynamic filters including "All" + active brands
  // Exclude disabled brands from the button list (handled implicitly since useBrands only returns active brands per backend behavior)
  const dynamicBrandFilters = ["All", ...(brands ? brands.map(b => b.name) : [])];

  // If URL has a brand that's not in the active list (e.g. disabled), ensure it's still accessible if we want to render it as a chip? 
  // "disabled brands should not appear as normal new filter chips. However, if the current URL contains... DO NOT automatically change or delete... let the existing product query behavior determine...".
  // To allow unchecking it, we should probably just include it in the chips if it's currently selected, or just let "All" clear it. The instructions say "disabled brands should not appear as normal new filter chips". We'll just render the active ones. The user can click "All" to clear a disabled one.

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h2>All Mobiles</h2>
          <p>Browse latest smartphones from top brands — Samsung, Apple, Redmi & more</p>
        </div>

        <div className="mobiles-toolbar">
          <input
            type="text"
            placeholder="Search mobiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filters">
            {loading ? (
              <span style={{ color: "#64748b", fontSize: "14px", padding: "8px" }}>Loading brands...</span>
            ) : error ? (
              <span style={{ color: "#ef4444", fontSize: "14px", padding: "8px" }}>Brands unavailable</span>
            ) : (
              dynamicBrandFilters.map((b) => (
                <button
                  key={b}
                  className={isBrandMatch(b, selectedBrand) && (b !== "All" || selectedBrand === "All") ? "active" : ""}
                  onClick={() => handleBrandClick(b)}
                >
                  {b}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mobile-list">
          {filteredMobiles.length > 0 ? (
            filteredMobiles.map((mobile) => (
              <ProductCard key={mobile._id} product={mobile} />
            ))
          ) : (
            <p className="page-empty">No mobiles found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mobiles;

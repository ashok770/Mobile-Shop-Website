import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/api";

function Mobiles() {
  const [mobiles, setMobiles] = useState([]);
  const location = useLocation();
  const urlBrand = new URLSearchParams(location.search).get("brand") || "All";
  const [brandFilter, setBrandFilter] = useState(() => ({
    search: location.search,
    brand: urlBrand,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const brand =
    brandFilter.search === location.search ? brandFilter.brand : urlBrand;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setMobiles(data.filter((p) => p.category === "mobile"));
    };
    fetchData();
  }, []);

  const filteredMobiles = mobiles.filter((mobile) => {
    const matchesBrand = brand === "All" || mobile.brand === brand;
    const matchesSearch = mobile.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

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
            {["All", "Samsung", "Apple", "Redmi"].map((b) => (
              <button
                key={b}
                className={brand === b ? "active" : ""}
                onClick={() =>
                  setBrandFilter({ search: location.search, brand: b })
                }
              >
                {b}
              </button>
            ))}
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

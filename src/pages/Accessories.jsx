import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/api";

const TYPE_FILTERS = ["All", "Smartwatch", "Mobile Charger", "Mobile Cover"];
const BRAND_FILTERS = ["All", "Samsung", "Apple", "Redmi", "Noise", "Boult"];

function Accessories() {
  const [accessories, setAccessories] = useState([]);
  const location = useLocation();
  const urlBrand = new URLSearchParams(location.search).get("brand") || "All";
  const [brandFilter, setBrandFilter] = useState(() => ({
    search: location.search,
    brand: urlBrand,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const selectedBrand =
    brandFilter.search === location.search ? brandFilter.brand : urlBrand;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      const filtered = data.filter((p) => p.category === "accessory");
      setAccessories(filtered);
    };
    fetchData();
  }, []);

  const filteredAccessories = accessories.filter((accessory) => {
    const matchesSearch =
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (accessory.brand &&
        accessory.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === "All" || accessory.type === selectedType;
    const matchesBrand =
      selectedBrand === "All" ||
      accessory.brand?.toLowerCase() === selectedBrand.toLowerCase();

    return matchesSearch && matchesType && matchesBrand;
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h2>All Accessories</h2>
          <p>Covers, chargers, smartwatches and more for your devices</p>
        </div>

        <div className="mobiles-toolbar">
          <input
            type="text"
            placeholder="Search accessories by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div style={{ marginBottom: "8px" }}>
          <p className="filter-group-label">Type</p>
          <div className="filter-group">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                className={`filter-chip ${selectedType === type ? "active" : ""}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p className="filter-group-label">Brand</p>
          <div className="filter-group">
            {BRAND_FILTERS.map((b) => (
              <button
                key={b}
                className={`filter-chip ${
                  selectedBrand?.toLowerCase() === b.toLowerCase() ||
                  (b === "All" && (!selectedBrand || selectedBrand === "All"))
                    ? "active"
                    : ""
                }`}
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
          {filteredAccessories.length > 0 ? (
            filteredAccessories.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))
          ) : (
            <p className="page-empty">No accessories found matching your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Accessories;

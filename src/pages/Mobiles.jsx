import { useEffect, useState } from "react";
import MobileCard from "../components/MobileCard";
import { getProducts } from "../api/api";

function Mobiles() {
  const [mobiles, setMobiles] = useState([]);
  const [brand, setBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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
                onClick={() => setBrand(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-list">
          {filteredMobiles.length > 0 ? (
            filteredMobiles.map((mobile) => (
              <MobileCard
                key={mobile._id}
                id={mobile._id}
                name={mobile.name}
                price={mobile.finalPrice ?? mobile.price ?? mobile.originalPrice}
                originalPrice={mobile.originalPrice}
                discountPercent={mobile.discountPercent || 0}
                image={mobile.images?.[0] || mobile.image}
                stock={mobile.stock}
              />
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

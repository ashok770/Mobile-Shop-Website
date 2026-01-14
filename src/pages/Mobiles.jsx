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
    <div className="container">
      {/* Page Heading */}
      <div style={{ marginBottom: "25px" }}>
        <h2>All Mobiles</h2>
        <p style={{ color: "#555", marginTop: "6px" }}>
          Browse latest mobiles from top brands
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mobiles-toolbar">
        <input
          type="text"
          placeholder="Search mobiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filters">
          <button
            className={brand === "All" ? "active" : ""}
            onClick={() => setBrand("All")}
          >
            All
          </button>
          <button
            className={brand === "Samsung" ? "active" : ""}
            onClick={() => setBrand("Samsung")}
          >
            Samsung
          </button>
          <button
            className={brand === "Apple" ? "active" : ""}
            onClick={() => setBrand("Apple")}
          >
            Apple
          </button>
          <button
            className={brand === "Redmi" ? "active" : ""}
            onClick={() => setBrand("Redmi")}
          >
            Redmi
          </button>
        </div>
      </div>

      {/* Mobiles Grid */}
      <div className="mobile-list">
        {filteredMobiles.length > 0 ? (
          filteredMobiles.map((mobile) => (
            <MobileCard
              key={mobile._id}
              name={mobile.name}
              price={mobile.price}
              image={mobile.image}
            />
          ))
        ) : (
          <p style={{ marginTop: "30px", color: "#666" }}>No mobiles found.</p>
        )}
      </div>
    </div>
  );
}

export default Mobiles;

import { useEffect, useState } from "react";
import MobileCard from "../components/MobileCard";
import { getProducts } from "../api/api";

function Accessories() {
  const [accessories, setAccessories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();

      // 🔴 THIS WAS THE ISSUE
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
      selectedBrand === "All" || accessory.brand === selectedBrand;

    return matchesSearch && matchesType && matchesBrand;
  });

  return (
    <div className="container">
      {/* Page Heading */}
      <div style={{ marginBottom: "25px" }}>
        <h2>All Accessories</h2>
        <p style={{ color: "#555", marginTop: "6px" }}>
          Browse latest accessories and gadgets
        </p>
      </div>

      {/* Search Bar */}
      <div className="mobiles-toolbar">
        <input
          type="text"
          placeholder="Search accessories by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Type Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "15px",
        }}
      >
        <button
          className={selectedType === "All" ? "active" : ""}
          onClick={() => setSelectedType("All")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: selectedType === "All" ? "#ff6b35" : "#f5f5f5",
            color: selectedType === "All" ? "white" : "#333",
            fontWeight: selectedType === "All" ? "bold" : "normal",
          }}
        >
          All
        </button>
        <button
          className={selectedType === "Smartwatch" ? "active" : ""}
          onClick={() => setSelectedType("Smartwatch")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor:
              selectedType === "Smartwatch" ? "#ff6b35" : "#f5f5f5",
            color: selectedType === "Smartwatch" ? "white" : "#333",
            fontWeight: selectedType === "Smartwatch" ? "bold" : "normal",
          }}
        >
          Smartwatch
        </button>
        <button
          className={selectedType === "Mobile Charger" ? "active" : ""}
          onClick={() => setSelectedType("Mobile Charger")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor:
              selectedType === "Mobile Charger" ? "#ff6b35" : "#f5f5f5",
            color: selectedType === "Mobile Charger" ? "white" : "#333",
            fontWeight: selectedType === "Mobile Charger" ? "bold" : "normal",
          }}
        >
          Mobile Charger
        </button>
        <button
          className={selectedType === "Mobile Cover" ? "active" : ""}
          onClick={() => setSelectedType("Mobile Cover")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor:
              selectedType === "Mobile Cover" ? "#ff6b35" : "#f5f5f5",
            color: selectedType === "Mobile Cover" ? "white" : "#333",
            fontWeight: selectedType === "Mobile Cover" ? "bold" : "normal",
          }}
        >
          Mobile Cover
        </button>
      </div>

      {/* Brand Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <button
          className={selectedBrand === "All" ? "active" : ""}
          onClick={() => setSelectedBrand("All")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: selectedBrand === "All" ? "#ff6b35" : "#f5f5f5",
            color: selectedBrand === "All" ? "white" : "#333",
            fontWeight: selectedBrand === "All" ? "bold" : "normal",
          }}
        >
          All
        </button>
        <button
          className={selectedBrand === "Samsung" ? "active" : ""}
          onClick={() => setSelectedBrand("Samsung")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor:
              selectedBrand === "Samsung" ? "#ff6b35" : "#f5f5f5",
            color: selectedBrand === "Samsung" ? "white" : "#333",
            fontWeight: selectedBrand === "Samsung" ? "bold" : "normal",
          }}
        >
          Samsung
        </button>
        <button
          className={selectedBrand === "Apple" ? "active" : ""}
          onClick={() => setSelectedBrand("Apple")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: selectedBrand === "Apple" ? "#ff6b35" : "#f5f5f5",
            color: selectedBrand === "Apple" ? "white" : "#333",
            fontWeight: selectedBrand === "Apple" ? "bold" : "normal",
          }}
        >
          Apple
        </button>
        <button
          className={selectedBrand === "Redmi" ? "active" : ""}
          onClick={() => setSelectedBrand("Redmi")}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: selectedBrand === "Redmi" ? "#ff6b35" : "#f5f5f5",
            color: selectedBrand === "Redmi" ? "white" : "#333",
            fontWeight: selectedBrand === "Redmi" ? "bold" : "normal",
          }}
        >
          Redmi
        </button>
      </div>

      {/* Accessories Grid */}
      <div className="mobile-list">
        {filteredAccessories.length > 0 ? (
          filteredAccessories.map((item) => (
            <MobileCard
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.finalPrice ?? item.price ?? item.originalPrice}
              originalPrice={item.originalPrice}
              discountPercent={item.discountPercent || 0}
              image={item.image}
              stock={item.stock}
            />
          ))
        ) : (
          <p style={{ marginTop: "30px", color: "#666" }}>
            No accessories found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Accessories;

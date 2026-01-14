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
    <div className="mobiles">
      <h2>All Mobiles</h2>

      <input
        type="text"
        placeholder="Search mobiles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="filters">
        <button onClick={() => setBrand("All")}>All</button>
        <button onClick={() => setBrand("Samsung")}>Samsung</button>
        <button onClick={() => setBrand("Apple")}>Apple</button>
        <button onClick={() => setBrand("Redmi")}>Redmi</button>
      </div>

      <div className="mobile-list">
        {filteredMobiles.map((mobile) => (
          <MobileCard
            key={mobile._id}
            name={mobile.name}
            price={mobile.price}
            image={mobile.image}
          />
        ))}
      </div>
    </div>
  );
}

export default Mobiles;

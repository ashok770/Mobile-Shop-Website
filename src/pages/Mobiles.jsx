import { useState } from "react";
import MobileCard from "../components/MobileCard";

const mobileData = [
  {
    id: 1,
    name: "Samsung Galaxy S21",
    price: 49999,
    brand: "Samsung",
    image: "/images/mobiles/samsung.jpg",
  },
  {
    id: 2,
    name: "iPhone 13",
    price: 69999,
    brand: "Apple",
    image: "/images/mobiles/iphone.jpg",
  },
  {
    id: 3,
    name: "Redmi Note 12",
    price: 17999,
    brand: "Redmi",
    image: "/images/mobiles/redmi.jpg",
  },
  {
    id: 4,
    name: "Samsung Galaxy A14",
    price: 15999,
    brand: "Samsung",
    image: "/images/mobiles/samsung.jpg",
  },
];
function Mobiles() {
  const [brand, setBrand] = useState("All");

  const filteredMobiles =
    brand === "All" ? mobileData : mobileData.filter((m) => m.brand === brand);

  return (
    <div className="mobiles">
      <h2>All Mobiles</h2>

      {/* Filter Buttons */}
      <div className="filters">
        <button onClick={() => setBrand("All")}>All</button>
        <button onClick={() => setBrand("Samsung")}>Samsung</button>
        <button onClick={() => setBrand("Apple")}>Apple</button>
        <button onClick={() => setBrand("Redmi")}>Redmi</button>
      </div>

      {/* Mobile List */}
      <div className="mobile-list">
        {filteredMobiles.map((mobile) => (
          <MobileCard
            key={mobile.id}
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

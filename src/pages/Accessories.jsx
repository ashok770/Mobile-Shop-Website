import { useEffect, useState } from "react";
import MobileCard from "../components/MobileCard";
import { getProducts } from "../api/api";

function Accessories() {
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();

      // 🔴 THIS WAS THE ISSUE
      const filtered = data.filter((p) => p.category === "accessory");

      setAccessories(filtered);
    };

    fetchData();
  }, []);

  return (
    <div className="mobiles">
      <h2>All Accessories</h2>

      <div className="mobile-list">
        {accessories.map((item) => (
          <MobileCard
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}

export default Accessories;

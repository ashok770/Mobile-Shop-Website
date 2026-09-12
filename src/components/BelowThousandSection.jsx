import { useEffect, useState } from "react";
import { getBelowThousandProducts } from "../api/api";
import HomeProductRail from "./HomeProductRail";

function BelowThousandSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsBelowThousand = await getBelowThousandProducts();
      setProducts(productsBelowThousand);
    };
    fetchProducts();
  }, []);

  return (
    <HomeProductRail
      title="Below ₹1,000"
      products={products}
      viewAllLink="/offers/below-1000"
      variant="value"
    />
  );
}

export default BelowThousandSection;

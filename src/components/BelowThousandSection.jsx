import { useEffect, useState } from "react";
import { getBelowThousandProducts } from "../api/api";
import HomeProductRail from "./HomeProductRail";

function BelowThousandSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsBelowThousand = await getBelowThousandProducts();
        setProducts(productsBelowThousand);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <HomeProductRail
      title="Below ₹1,000"
      products={products}
      viewAllLink="/offers/below-1000"
      variant="value"
      isLoading={isLoading}
    />
  );
}

export default BelowThousandSection;

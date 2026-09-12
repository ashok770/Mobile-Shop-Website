import { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import HomeProductRail from "./HomeProductRail";

function NewArrivalsSection() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isCurrent = true;

    const fetchNewArrivals = async () => {
      try {
        const catalog = await getProducts();
        const availableProducts = catalog.filter(
          (product) =>
            typeof product.stock === "undefined" || product.stock > 0,
        );

        if (isCurrent) {
          setProducts(availableProducts.slice(0, 4));
          setStatus("ready");
        }
      } catch {
        if (isCurrent) setStatus("error");
      }
    };

    fetchNewArrivals();

    return () => {
      isCurrent = false;
    };
  }, []);

  if (status === "error") return null;

  return (
    <HomeProductRail
      title="NEW ARRIVALS"
      description="Fresh picks for your next upgrade"
      products={products}
      viewAllLink="/mobiles"
      viewAllLabel="View All →"
      variant="arrivals"
      isLoading={status === "loading"}
    />
  );
}

export default NewArrivalsSection;

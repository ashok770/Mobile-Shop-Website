import { useEffect, useState } from "react";
import { getOfferProducts } from "../api/api";
import HomeProductRail from "./HomeProductRail";

function OfferSection({ title, offerType, viewAllLink, variant }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (offerType) {
      getOfferProducts(offerType)
        .then(setProducts)
        .finally(() => setIsLoading(false));
    }
  }, [offerType]);

  return (
    <HomeProductRail
      title={title}
      products={products}
      viewAllLink={viewAllLink}
      variant={variant}
      isLoading={isLoading}
    />
  );
}

export default OfferSection;

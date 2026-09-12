import { useEffect, useState } from "react";
import { getOfferProducts } from "../api/api";
import HomeProductRail from "./HomeProductRail";

function OfferSection({ title, offerType, viewAllLink, variant }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (offerType) {
      getOfferProducts(offerType).then(setProducts);
    }
  }, [offerType]);

  return (
    <HomeProductRail
      title={title}
      products={products}
      viewAllLink={viewAllLink}
      variant={variant}
    />
  );
}

export default OfferSection;

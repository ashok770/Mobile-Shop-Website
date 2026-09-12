import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/api";

const offerPriority = {
  MEGA_FLASH_SALE: 3,
  BUY_1_GET_1: 2,
  DAILY_SPECIAL: 1,
  NONE: 0,
};

const offerLabels = {
  MEGA_FLASH_SALE: "Mega Flash Sale",
  BUY_1_GET_1: "Buy 1 Get 1 Free",
  DAILY_SPECIAL: "Daily Special",
};

const getPrice = (product) =>
  product.finalPrice ?? product.price ?? product.originalPrice;

const selectFeaturedProduct = (catalog) => {
  const eligibleProducts = catalog.filter((product) => {
    const price = Number(getPrice(product));
    // Require in-stock, valid price, and either a direct offer or discount
    const isInStock = product.stock > 0;
    const hasOffer = product.offerType && product.offerType !== "NONE";
    const hasDiscount = Number(product.discountPercent) > 0;

    return isInStock && Number.isFinite(price) && price > 0 && (hasOffer || hasDiscount);
  });

  return eligibleProducts.sort((first, second) => {
    // 1. Prioritize mobile category over accessories
    const firstIsMobile = first.category === "mobile" ? 1 : 0;
    const secondIsMobile = second.category === "mobile" ? 1 : 0;
    if (secondIsMobile !== firstIsMobile) return secondIsMobile - firstIsMobile;

    // 2. Prioritize higher value products (premium feel)
    const priceDifference = Number(getPrice(second)) - Number(getPrice(first));
    if (priceDifference !== 0) return priceDifference;

    // 3. Fallback to offer priority
    const offerDifference =
      (offerPriority[second.offerType] ?? 0) -
      (offerPriority[first.offerType] ?? 0);
    if (offerDifference) return offerDifference;

    // 4. Fallback to discount percent
    const discountDifference =
      Number(second.discountPercent ?? 0) - Number(first.discountPercent ?? 0);
    if (discountDifference) return discountDifference;

    return String(first._id).localeCompare(String(second._id));
  })[0];
};

function FeaturedDealSection() {
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isCurrent = true;

    const fetchFeaturedProduct = async () => {
      try {
        const catalog = await getProducts();

        if (isCurrent) {
          setFeaturedProduct(selectFeaturedProduct(catalog));
          setStatus("ready");
        }
      } catch {
        if (isCurrent) setStatus("error");
      }
    };

    fetchFeaturedProduct();

    return () => {
      isCurrent = false;
    };
  }, []);

  if (status !== "ready" || !featuredProduct) return null;

  const image = featuredProduct.images?.[0] || featuredProduct.image;
  const price = getPrice(featuredProduct);
  const offerLabel = offerLabels[featuredProduct.offerType];
  const hasDiscount = featuredProduct.discountPercent > 0;

  return (
    <section className="featured-deal home-section">
      <p className="featured-deal__eyebrow">FEATURED DEAL</p>
      <div className="featured-deal__card">
        <div className="featured-deal__visual">
          <img src={image} alt={featuredProduct.name} />
        </div>

        <div className="featured-deal__content">
          {offerLabel && <p className="featured-deal__offer">{offerLabel}</p>}
          <h2>{featuredProduct.name}</h2>

          <div className="featured-deal__pricing">
            {featuredProduct.originalPrice && hasDiscount && (
              <span className="featured-deal__original-price">
                ₹{featuredProduct.originalPrice}
              </span>
            )}
            <span className="featured-deal__price">₹{price}</span>
            {hasDiscount && (
              <span className="featured-deal__discount">
                {featuredProduct.discountPercent}% OFF
              </span>
            )}
          </div>

          <Link
            to={`/mobiles/${featuredProduct._id}`}
            className="featured-deal__cta"
          >
            View Product →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDealSection;

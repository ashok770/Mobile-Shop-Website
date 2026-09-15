export const offerPriority = {
  MEGA_FLASH_SALE: 3,
  BUY_1_GET_1: 2,
  DAILY_SPECIAL: 1,
  NONE: 0,
};

export const offerLabels = {
  MEGA_FLASH_SALE: "Mega Flash Sale",
  BUY_1_GET_1: "Buy 1 Get 1 Free",
  DAILY_SPECIAL: "Daily Special",
};

export const getPrice = (product) =>
  product.finalPrice ?? product.price ?? product.originalPrice;

export const formatPrice = (price) => {
  if (!price || isNaN(price)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const selectFeaturedProduct = (catalog) => {
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

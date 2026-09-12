import axiosInstance from "../utils/axiosInstance";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const fetchProductData = async (path) => {
  const res = await fetch(`${API}${path}`);

  if (!res.ok) {
    throw new Error("Unable to load products");
  }

  return res.json();
};

export const getProducts = async () => {
  return fetchProductData("/api/products");
};

export const getOfferProducts = async (offerType) => {
  return fetchProductData(`/api/products/offers/${offerType}`);
};

export const getBelowThousandProducts = async () => {
  const products = await getProducts();
  return products.filter(
    (product) =>
      (product.finalPrice ?? product.price ?? product.originalPrice) <= 1000,
  );
};

export const createOrder = async (orderData) => {
  // Uses axiosInstance so the interceptor attaches Authorization: Bearer <token>
  const { data } = await axiosInstance.post("/orders", orderData);
  return data;
};

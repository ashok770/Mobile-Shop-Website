import axiosInstance from "../utils/axiosInstance";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getProducts = async () => {
  const res = await fetch(`${API}/api/products`);
  return res.json();
};

export const getOfferProducts = async (offerType) => {
  const res = await fetch(`${API}/api/products/offers/${offerType}`);
  return res.json();
};

export const createOrder = async (orderData) => {
  // Uses axiosInstance so the interceptor attaches Authorization: Bearer <token>
  const { data } = await axiosInstance.post("/orders", orderData);
  return data;
};

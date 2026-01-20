const API = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
  const res = await fetch(`${API}/api/products`);
  return res.json();
};

export const getOfferProducts = async (offerType) => {
  const res = await fetch(`${API}/api/products/offers/${offerType}`);
  return res.json();
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${API}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

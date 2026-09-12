import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  getBelowThousandProducts,
  getOfferProducts,
} from "../api/api";

const OFFER_PAGES = {
  "below-1000": {
    title: "Below ₹1,000",
    description: "Discover great-value essentials priced at ₹1,000 or less.",
    getProducts: getBelowThousandProducts,
  },
  "mega-flash": {
    title: "Mega Flash Sale",
    description: "Limited-time offers on selected devices and accessories.",
    getProducts: () => getOfferProducts("MEGA_FLASH_SALE"),
  },
  bogo: {
    title: "Buy 1 Get 1 Free",
    description: "Shop selected products included in our Buy 1 Get 1 Free offer.",
    getProducts: () => getOfferProducts("BUY_1_GET_1"),
  },
  daily: {
    title: "Daily Special",
    description: "Today's selected deals, available while they last.",
    getProducts: () => getOfferProducts("DAILY_SPECIAL"),
  },
};

function Offers({ offerKey }) {
  const offer = OFFER_PAGES[offerKey];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const offerProducts = await offer.getProducts();
        if (active) setProducts(offerProducts);
      } catch {
        if (active) setError("We couldn't load these offers. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [offer]);

  return (
    <main className="page-wrapper">
      <div className="container">
        <header className="page-header">
          <h2>{offer.title}</h2>
          <p>{offer.description}</p>
        </header>

        {loading && <p className="product-loading">Loading offers...</p>}

        {!loading && error && <p className="page-empty">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="page-empty">No offers are available right now. Please check back soon.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mobile-list">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Offers;

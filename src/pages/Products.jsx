import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/api";
import { useBrands } from "../context/BrandContext";

function Products() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const urlBrand = new URLSearchParams(location.search).get("brand") || "All";
  const { brands, loading, error } = useBrands();
  
  // Create an initial state for the brand filter to track URL vs manual selection
  const [brandFilter, setBrandFilter] = useState(() => ({
    search: location.search,
    brand: urlBrand,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  
  const selectedBrand =
    brandFilter.search === location.search ? brandFilter.brand : urlBrand;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  const isBrandMatch = (productBrand, targetBrand) => {
    if (!targetBrand || targetBrand === "All") return true;
    if (!productBrand) return false;
    const pb = productBrand.toLowerCase();
    const tb = targetBrand.toLowerCase();
    return pb === tb;
  };

  const filteredProducts = products.filter((product) => {
    const matchesBrand = isBrandMatch(product.brand, selectedBrand);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  // Extract a list of brand names to display in the filter bar
  // Include "All" and any dynamic active brands from context
  const dynamicBrandFilters = ["All", ...(brands ? brands.map(b => b.name) : [])];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h2>All Products</h2>
          <p>Browse our complete catalog across all categories and brands</p>
        </div>

        <div className="mobiles-toolbar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filters">
            {!loading && !error && dynamicBrandFilters.map((b) => (
              <button
                key={b}
                className={isBrandMatch(b, selectedBrand) && (b !== "All" || selectedBrand === "All") ? "active" : ""}
                onClick={() =>
                  setBrandFilter({ search: location.search, brand: b })
                }
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="page-empty">No products found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;

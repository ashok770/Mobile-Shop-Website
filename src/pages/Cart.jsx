import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronRight, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import "./Cart.css";

const CART_KEY = "mobile_shop_cart";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

function Cart() {
  const [cart, setCart] = useState(readCart);
  const navigate = useNavigate();

  useEffect(() => {
    const syncCart = () => setCart(readCart());
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const updateCart = (nextCart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    setCart(nextCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const changeQuantity = (productId, change) => {
    const nextCart = cart
      .map((item) => item.productId === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0);
    updateCart(nextCart);
  };

  const removeItem = (productId) => updateCart(cart.filter((item) => item.productId !== productId));
  const subtotal = cart.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="cart-page-shell">
      <div className="cart-page-container">
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link><ChevronRight size={14} /><span>Cart</span>
        </nav>
        <header className="cart-page-heading">
          <div>
            <h1>Shopping Cart</h1>
            <p>Review your selected items before checkout.</p>
          </div>
          <span className="cart-item-count">{itemCount} {itemCount === 1 ? "Item" : "Items"}</span>
        </header>

        <div className="delivery-info-card">
          <span className="delivery-info-icon"><MapPin size={20} /></span>
          <div><h2>Delivery Information</h2><p>Add your delivery address during checkout. Estimated delivery time will appear after your address is entered.</p></div>
        </div>

        {cart.length ? (
          <div className="cart-layout">
            <section className="cart-product-list" aria-label="Cart items">
              {cart.map((item) => {
                const originalPrice = Number(item.originalPrice || 0);
                const price = Number(item.price || 0);
                const discount = item.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
                return (
                  <article className="cart-product-card" key={item.productId}>
                    <div className="cart-product-image"><img src={item.image} alt={item.name} /></div>
                    <div className="cart-product-details">
                      <p className="cart-product-brand">{item.brand || "Ommasta Select"}</p>
                      <h2>{item.name}</h2>
                      <div className="cart-product-prices"><strong>₹{formatPrice(price)}</strong>{originalPrice > price && <span>₹{formatPrice(originalPrice)}</span>}{discount > 0 && <em>{discount}% off</em>}</div>
                      <div className="cart-product-controls">
                        <div className="cart-quantity" aria-label={`Quantity for ${item.name}`}>
                          <button type="button" onClick={() => changeQuantity(item.productId, -1)} aria-label="Decrease quantity"><Minus size={15} /></button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.productId, 1)} aria-label="Increase quantity"><Plus size={15} /></button>
                        </div>
                        <button className="cart-save-button" type="button">Save for later</button>
                        <button className="cart-remove-button" type="button" onClick={() => removeItem(item.productId)}><Trash2 size={15} /> Remove</button>
                      </div>
                    </div>
                    <div className="cart-line-subtotal"><span>Subtotal</span><strong>₹{formatPrice(price * item.quantity)}</strong></div>
                  </article>
                );
              })}
            </section>

            <aside className="cart-order-summary" aria-label="Order summary">
              <h2>Order Summary</h2>
              <div className="cart-summary-row"><span>Subtotal</span><strong>₹{formatPrice(subtotal)}</strong></div>
              <div className="cart-summary-row"><span>Shipping</span><strong>Free</strong></div>
              <div className="cart-summary-row"><span>Tax</span><strong>₹0</strong></div>
              <div className="cart-summary-divider" />
              <div className="cart-grand-total"><span>Grand Total</span><strong>₹{formatPrice(subtotal)}</strong></div>
              <button className="cart-checkout-button" type="button" onClick={() => { window.location.href = "/checkout.html"; }}>Proceed to Checkout</button>
              <button className="cart-continue-button" type="button" onClick={() => navigate("/mobiles")}>Continue Shopping</button>
              <div className="cart-trust-list">
                <div><Check size={16} /><span>Genuine Products</span></div>
                <div><Check size={16} /><span>Cash on Delivery Available</span></div>
                <div><ShieldCheck size={16} /><span>Secure Checkout</span></div>
              </div>
            </aside>
          </div>
        ) : (
          <section className="cart-empty-state"><ShoppingBag size={42} /><h2>Your cart is empty</h2><p>Browse our latest devices and accessories to get started.</p><button type="button" onClick={() => navigate("/mobiles")}>Continue Shopping</button></section>
        )}

        <section className="cart-recommendations" aria-labelledby="recommendations-title">
          <div><h2 id="recommendations-title">You May Also Like</h2><p>More products will appear here soon.</p></div>
          <div className="cart-placeholder-grid" aria-hidden="true"><span /><span /><span /><span /></div>
        </section>
      </div>
    </main>
  );
}

export default Cart;

const cartItemsContainer = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalPriceEl = document.getElementById("totalPrice");

function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function getDiscount(item) {
  if (item.discountPercent) return `${Math.round(item.discountPercent)}% off`;
  const original = Number(item.originalPrice);
  const price = Number(item.price);
  return original > price ? `${Math.round(((original - price) / original) * 100)}% off` : "";
}

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 2 2 2.4 10.2a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
        <h2>Your cart is empty</h2>
        <p>Browse our latest devices and accessories to get started.</p>
        <a class="empty-cart-btn" href="/mobiles">Continue Shopping</a>
      </div>`;
    cartSummary.style.display = "none";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("article");
    const productId = JSON.stringify(String(item.productId));
    const originalPrice = Number(item.originalPrice);
    const discount = getDiscount(item);
    const brand = item.brand || "Ommasta Select";

    div.className = "cart-item";
    div.innerHTML = `
      <div class="item-image-wrap"><img class="item-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" /></div>
      <div class="item-details">
        <p class="item-brand">${escapeHTML(brand)}</p>
        <h3 class="item-name">${escapeHTML(item.name)}</h3>
        <div class="item-price-section">
          <span class="item-price">₹${formatPrice(item.price)}</span>
          ${originalPrice > Number(item.price) ? `<span class="item-original-price">₹${formatPrice(originalPrice)}</span>` : ""}
          ${discount ? `<span class="discount-badge">${discount}</span>` : ""}
        </div>
        <div class="item-actions">
          <div class="quantity-controls" aria-label="Quantity controls">
            <button class="qty-btn" type="button" aria-label="Decrease quantity" onclick="decreaseQuantity(${productId}); renderCart()">−</button>
            <span class="qty-display" aria-label="Quantity">${item.quantity}</span>
            <button class="qty-btn" type="button" aria-label="Increase quantity" onclick="increaseQuantity(${productId}); renderCart()">+</button>
          </div>
          <button class="text-action save-later-btn" type="button" onclick="this.textContent='Saved for later'">Save for later</button>
          <button class="text-action remove-btn" type="button" onclick="removeFromCart(${productId}); renderCart()">Remove</button>
        </div>
      </div>
      <div class="item-total-wrap"><span class="item-total-label">Subtotal</span><span class="item-total">₹${formatPrice(Number(item.price) * item.quantity)}</span></div>`;
    cartItemsContainer.appendChild(div);
  });

  const totals = getCartTotals();
  subtotalEl.textContent = formatPrice(totals.totalPrice);
  taxEl.textContent = "0";
  totalPriceEl.textContent = formatPrice(totals.totalPrice);
  cartSummary.style.display = "block";
}

renderCart();

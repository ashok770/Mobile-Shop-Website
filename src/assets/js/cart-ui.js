const cartItemsContainer = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const totalItemsEl = document.getElementById("totalItems");
const totalPriceEl = document.getElementById("totalPrice");

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.
      </div>
    `;
    cartSummary.style.display = "none";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-details">
        <h3>${item.name}</h3>
        <div>
          <span class="price">Rs. ${item.price}</span>
          <span class="original">Rs. ${item.originalPrice}</span>
        </div>

        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${item.productId}); renderCart()">−</button>
          <strong>${item.quantity}</strong>
          <button onclick="increaseQuantity(${item.productId}); renderCart()">+</button>
        </div>

        <div class="remove-btn" onclick="removeFromCart(${item.productId}); renderCart()">
          Remove
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  const totals = getCartTotals();
  totalItemsEl.textContent = totals.totalItems;
  totalPriceEl.textContent = totals.totalPrice;

  cartSummary.style.display = "block";
}

// Initial render
renderCart();
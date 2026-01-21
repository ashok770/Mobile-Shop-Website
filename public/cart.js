// ===============================
// CART CORE LOGIC (STEP 1)
// ===============================

const CART_KEY = "mobile_shop_cart";

// ---------- Helpers ----------
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ---------- Add to Cart ----------
function addToCart(product) {
  let cart = getCart();

  // Basic stock check when provided
  if (typeof product.stock !== "undefined" && product.stock <= 0) {
    alert("Out of stock");
    return;
  }

  const existingItem = cart.find((item) => item.productId === product.productId);

  if (existingItem) {
    // If product.stock is provided, prevent exceeding available stock
    if (typeof product.stock !== "undefined") {
      if (existingItem.quantity + 1 > product.stock) {
        alert("Cannot add more — not enough stock");
        return;
      }
    }

    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.productId,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      quantity: 1,
    });
  }

  saveCart(cart);
}

// ---------- Increase Quantity ----------
function increaseQuantity(productId) {
  let cart = getCart();

  cart = cart.map((item) => {
    if (item.productId === productId) {
      item.quantity += 1;
    }
    return item;
  });

  saveCart(cart);
}

// ---------- Decrease Quantity ----------
function decreaseQuantity(productId) {
  let cart = getCart();

  cart = cart
    .map((item) => {
      if (item.productId === productId) {
        item.quantity -= 1;
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  saveCart(cart);
}

// ---------- Remove Item ----------
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.productId !== productId);
  saveCart(cart);
}

// ---------- Clear Cart ----------
function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// ---------- Totals ----------
function getCartTotals() {
  const cart = getCart();

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  return {
    totalItems,
    totalPrice,
  };
}

// Make functions globally available
window.addToCart = addToCart;
window.getCart = getCart;
window.getCartTotals = getCartTotals;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
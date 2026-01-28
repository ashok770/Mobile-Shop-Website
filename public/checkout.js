// Validation Functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9+\s\-]{8,}$/;
  return phoneRegex.test(phone);
}

// Display Order Items
function displayOrderItems() {
  const cart = getCart();
  const orderItemsDiv = document.getElementById("orderItems");

  if (cart.length === 0) {
    orderItemsDiv.innerHTML =
      '<p style="text-align: center; color: #999;">Your cart is empty</p>';
    return;
  }

  orderItemsDiv.innerHTML = cart
    .map(
      (item) => `
    <div class="order-item">
      <div class="item-name">${item.name}</div>
      <div class="item-qty">x${item.quantity}</div>
      <div class="item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
    </div>
  `,
    )
    .join("");
}

// Place Order Function
function placeOrder() {
  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const agreeTerms = document.getElementById("agreeTerms").checked;

  // Validation
  if (!customerName) {
    alert("❌ Please enter your full name");
    document.getElementById("customerName").focus();
    return;
  }

  if (!phone || !validatePhone(phone)) {
    alert("❌ Please enter a valid phone number");
    document.getElementById("phone").focus();
    return;
  }

  if (email && !validateEmail(email)) {
    alert("❌ Please enter a valid email address");
    document.getElementById("email").focus();
    return;
  }

  if (!address) {
    alert("❌ Please enter your delivery address");
    document.getElementById("address").focus();
    return;
  }

  if (!city) {
    alert("❌ Please enter your city");
    document.getElementById("city").focus();
    return;
  }

  if (!agreeTerms) {
    alert("❌ Please agree to the terms and conditions");
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    alert("❌ Your cart is empty. Please add items before placing an order.");
    return;
  }

  const totals = getCartTotals();

  const order = {
    customerName,
    phone,
    email: email || "not-provided",
    address,
    city,
    items: cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: totals.totalPrice,
    totalItems: totals.totalItems,
    paymentMethod: "COD",
    orderStatus: "Pending",
    paymentStatus: "Unpaid",
    orderDate: new Date().toISOString(),
  };

  // Show loading state
  const btn = event.target;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "⏳ Processing...";

  // Send order to backend
  const apiUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api/orders"
      : "https://your-domain.com/api/orders"; // Update with your production domain

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      clearCart();
      alert(
        "✅ Order placed successfully!\nOrder ID: " +
          (data.orderId || "Your order has been received"),
      );

      // Store order confirmation
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          ...order,
          orderId: data.orderId || Date.now(),
        }),
      );

      window.location.href = "/";
    })
    .catch((err) => {
      console.error(err);
      btn.disabled = false;
      btn.textContent = originalText;
      alert(
        "❌ Error placing order: " +
          err.message +
          "\n\nPlease try again or contact support.",
      );
    });
}

// Load page content
document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();

  if (cart.length === 0) {
    document.querySelector(".form-section").innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2>🛒 Your Cart is Empty</h2>
        <p>Please add items to your cart before checkout.</p>
        <a href="/mobiles" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Continue Shopping
        </a>
      </div>
    `;
    return;
  }

  const totals = getCartTotals();
  document.getElementById("subtotal").textContent =
    totals.totalPrice.toLocaleString();
  document.getElementById("totalAmount").textContent =
    totals.totalPrice.toLocaleString();

  displayOrderItems();
});

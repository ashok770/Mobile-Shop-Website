function placeOrder() {
  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!customerName || !phone || !address) {
    alert("Please fill all fields");
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const totals = getCartTotals();

  const order = {
    customerName,
    phone,
    address,
    items: cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    totalAmount: totals.totalPrice,
    paymentMethod: "COD",
    orderStatus: "Pending",
    paymentStatus: "Unpaid"
  };

  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Server error' }));
        alert(err.message || 'Order failed');
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      clearCart();
      alert("Order placed successfully!");
      window.location.href = "index.html";
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong. Try again.");
    });
}

// Load totals on page load
document.addEventListener("DOMContentLoaded", () => {
  const totals = getCartTotals();
  document.getElementById("totalItems").textContent = totals.totalItems;
  document.getElementById("totalAmount").textContent = totals.totalPrice;
});
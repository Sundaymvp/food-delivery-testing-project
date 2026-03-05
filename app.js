let cart = [];
let customerId = 1; // demo customer

async function loadMenu() {
  const res = await fetch('/api/menu');
  const data = await res.json();
  const menuDiv = document.getElementById('menu');
  menuDiv.innerHTML = data.map(item => `
    <div class="card">
      <h3>${item.name}</h3>
      <p>${item.description || ''}</p>
      <strong>₦${item.price.toFixed(2)}</strong><br>
      <button onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\'")}', ${item.price})">Add</button>
    </div>
  `).join('');
}

function addToCart(id, name, price) {
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({id, name, price, qty: 1});
  renderCart();
}

function renderCart() {
  const ul = document.getElementById('cart');
  ul.innerHTML = cart.map(c => `<li>${c.name} x ${c.qty} - ₦${(c.qty * c.price).toFixed(2)}</li>`).join('');
}

async function placeOrder() {
  if (cart.length === 0) return alert('Cart is empty');
  const body = {
    customerId,
    items: cart.map(c => ({menuItemId: c.id, quantity: c.qty}))
  };
  const res = await fetch('/api/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  if (res.ok) {
    alert('Order placed!');
    cart = [];
    renderCart();
    loadOrders();
  } else {
    alert('Failed to place order');
  }
}

async function loadOrders() {
  const res = await fetch('/api/orders?customerId=' + customerId);
  const data = await res.json();
  document.getElementById('orders').innerHTML = '<h2>Your Orders</h2>' + data.map(o => 
    `<div>Order #${o.id} - ${o.status} - ₦${o.totalPrice.toFixed(2)}</div>`
  ).join('');
}

document.getElementById('placeOrder').onclick = placeOrder;
loadMenu();
loadOrders();
setInterval(loadOrders, 5000);



const http = require("http");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3003";

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.json();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = await response.json();

  if (!response.ok) {
    const message = body.message || body.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return body;
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DevSecOps Commerce</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5f6f2;
        --ink: #18201d;
        --muted: #657069;
        --line: #d8ddd4;
        --surface: #ffffff;
        --accent: #176b5b;
        --accent-dark: #0e4a40;
        --warn: #a85d18;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--ink);
        font-family: Arial, Helvetica, sans-serif;
      }

      button, input {
        font: inherit;
      }

      button {
        border: 0;
        cursor: pointer;
      }

      .shell {
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      header {
        border-bottom: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: blur(12px);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .bar {
        max-width: 1180px;
        margin: 0 auto;
        padding: 18px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }

      .brand {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .brand strong {
        font-size: 18px;
      }

      .brand span {
        color: var(--muted);
        font-size: 13px;
      }

      .customer {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--muted);
        font-size: 14px;
      }

      .tier {
        color: var(--accent-dark);
        background: #e1f0ea;
        border: 1px solid #b8d8ce;
        padding: 6px 10px;
        border-radius: 999px;
        white-space: nowrap;
      }

      main {
        max-width: 1180px;
        width: 100%;
        margin: 0 auto;
        padding: 34px 24px 56px;
      }

      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
        gap: 28px;
        align-items: end;
        margin-bottom: 30px;
      }

      h1 {
        margin: 0 0 12px;
        font-size: 44px;
        line-height: 1.04;
        max-width: 720px;
      }

      .intro p {
        margin: 0;
        color: var(--muted);
        font-size: 17px;
        line-height: 1.55;
        max-width: 640px;
      }

      .system-panel {
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: 8px;
        padding: 18px;
      }

      .system-panel h2,
      .cart h2,
      .orders h2 {
        margin: 0 0 14px;
        font-size: 17px;
      }

      .service-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .service {
        border: 1px solid #e4e8df;
        border-radius: 6px;
        padding: 10px;
        color: var(--muted);
        font-size: 13px;
      }

      .service strong {
        display: block;
        color: var(--ink);
        font-size: 13px;
        margin-bottom: 4px;
      }

      .workspace {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 24px;
        align-items: start;
      }

      .catalogue {
        display: grid;
        gap: 14px;
      }

      .product {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 18px;
        border-bottom: 1px solid var(--line);
        padding: 18px 0;
      }

      .product:first-child {
        padding-top: 0;
      }

      .product h3 {
        margin: 0 0 7px;
        font-size: 21px;
      }

      .meta {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }

      .product-actions {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 10px;
        min-width: 120px;
      }

      .price {
        font-size: 20px;
        font-weight: 700;
      }

      .btn {
        min-height: 40px;
        border-radius: 6px;
        padding: 0 14px;
        background: var(--accent);
        color: #ffffff;
        transition: transform 140ms ease, background 140ms ease;
      }

      .btn:hover {
        background: var(--accent-dark);
        transform: translateY(-1px);
      }

      .btn.secondary {
        color: var(--ink);
        background: #e8ece4;
      }

      .btn.secondary:hover {
        background: #dce3d8;
      }

      .cart,
      .orders {
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: 8px;
        padding: 18px;
      }

      .cart {
        position: sticky;
        top: 92px;
      }

      .cart-items,
      .order-list {
        display: grid;
        gap: 12px;
      }

      .line-item,
      .order-item {
        border-top: 1px solid #e7ebe3;
        padding-top: 12px;
      }

      .line-title,
      .order-title {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: baseline;
      }

      .quantity {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }

      .stepper {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        background: #e8ece4;
      }

      .totals {
        border-top: 1px solid var(--line);
        margin-top: 16px;
        padding-top: 14px;
        display: grid;
        gap: 8px;
        color: var(--muted);
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .total-row.final {
        color: var(--ink);
        font-weight: 700;
        font-size: 18px;
      }

      .checkout {
        margin-top: 16px;
        width: 100%;
      }

      .empty,
      .status {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }

      .status {
        margin-top: 12px;
      }

      .status.error {
        color: var(--warn);
      }

      .orders {
        margin-top: 24px;
      }

      .badge {
        color: var(--accent-dark);
        font-size: 13px;
        font-weight: 700;
      }

      @media (max-width: 860px) {
        .intro,
        .workspace {
          grid-template-columns: 1fr;
        }

        h1 {
          font-size: 34px;
        }

        .cart {
          position: static;
        }
      }

      @media (max-width: 560px) {
        .bar,
        .customer,
        .product,
        .line-title,
        .order-title {
          align-items: flex-start;
          flex-direction: column;
        }

        .bar,
        .customer {
          display: flex;
        }

        .product {
          display: flex;
        }

        .product-actions {
          align-items: stretch;
          width: 100%;
        }

        .service-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="bar">
          <div class="brand">
            <strong>DevSecOps Commerce</strong>
            <span>Microservices checkout demo</span>
          </div>
          <div class="customer" id="customer">Loading customer profile...</div>
        </div>
      </header>

      <main>
        <section class="intro">
          <div>
            <h1>Buy platform engineering resources through a real service flow.</h1>
            <p>Browse products, build a cart, checkout, authorize a mock payment, create an order, and queue a notification across separate services.</p>
          </div>
          <aside class="system-panel">
            <h2>Services in this transaction</h2>
            <div class="service-grid">
              <div class="service"><strong>Frontend</strong>UI and API gateway</div>
              <div class="service"><strong>Product</strong>Catalogue and inventory</div>
              <div class="service"><strong>Order</strong>Checkout orchestration</div>
              <div class="service"><strong>Payment</strong>Mock authorization</div>
              <div class="service"><strong>User</strong>Customer profile</div>
              <div class="service"><strong>Notification</strong>Queued confirmation</div>
            </div>
          </aside>
        </section>

        <section class="workspace">
          <div>
            <div class="catalogue" id="catalogue">
              <p class="empty">Loading catalogue...</p>
            </div>
            <section class="orders">
              <h2>Recent orders</h2>
              <div class="order-list" id="orders">
                <p class="empty">No orders yet. Create one from the cart.</p>
              </div>
            </section>
          </div>

          <aside class="cart">
            <h2>Cart</h2>
            <div class="cart-items" id="cartItems">
              <p class="empty">Your cart is empty.</p>
            </div>
            <div class="totals" id="totals"></div>
            <button class="btn checkout" id="checkout" disabled>Checkout</button>
            <p class="status" id="status">Select products to begin.</p>
          </aside>
        </section>
      </main>
    </div>

    <script>
      const state = {
        user: null,
        products: [],
        cart: {},
        orders: []
      };

      const currency = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
      });

      const customerEl = document.getElementById("customer");
      const catalogueEl = document.getElementById("catalogue");
      const cartItemsEl = document.getElementById("cartItems");
      const totalsEl = document.getElementById("totals");
      const checkoutEl = document.getElementById("checkout");
      const statusEl = document.getElementById("status");
      const ordersEl = document.getElementById("orders");

      async function request(path, options) {
        const response = await fetch(path, options);
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.message || body.error || "Request failed");
        }

        return body;
      }

      function cartEntries() {
        return Object.entries(state.cart)
          .map(([productId, quantity]) => {
            const product = state.products.find(item => item.id === productId);
            return product ? { product, quantity } : null;
          })
          .filter(Boolean);
      }

      function totals() {
        const subtotal = cartEntries().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 4.99;
        return {
          subtotal,
          shipping,
          total: subtotal + shipping
        };
      }

      function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.className = isError ? "status error" : "status";
      }

      function renderCustomer() {
        if (!state.user) {
          customerEl.textContent = "Customer unavailable";
          return;
        }

        customerEl.innerHTML =
          "<span>" + state.user.name + "</span>" +
          "<span class=\\"tier\\">" + state.user.tier + "</span>";
      }

      function renderProducts() {
        catalogueEl.innerHTML = state.products.map(product => {
          return "<article class=\\"product\\">" +
            "<div>" +
              "<h3>" + product.name + "</h3>" +
              "<div class=\\"meta\\">" + product.category + " - " + product.description + "</div>" +
              "<div class=\\"meta\\">Inventory: " + product.inventory + " - Delivery: " + product.deliveryEstimate + "</div>" +
            "</div>" +
            "<div class=\\"product-actions\\">" +
              "<div class=\\"price\\">" + currency.format(product.price) + "</div>" +
              "<button class=\\"btn\\" data-add=\\"" + product.id + "\\">Add to cart</button>" +
            "</div>" +
          "</article>";
        }).join("");

        document.querySelectorAll("[data-add]").forEach(button => {
          button.addEventListener("click", () => {
            const productId = button.getAttribute("data-add");
            state.cart[productId] = (state.cart[productId] || 0) + 1;
            setStatus("Cart updated.");
            renderCart();
          });
        });
      }

      function renderCart() {
        const entries = cartEntries();

        if (entries.length === 0) {
          cartItemsEl.innerHTML = "<p class=\\"empty\\">Your cart is empty.</p>";
          totalsEl.innerHTML = "";
          checkoutEl.disabled = true;
          return;
        }

        cartItemsEl.innerHTML = entries.map(({ product, quantity }) => {
          return "<div class=\\"line-item\\">" +
            "<div class=\\"line-title\\">" +
              "<strong>" + product.name + "</strong>" +
              "<span>" + currency.format(product.price * quantity) + "</span>" +
            "</div>" +
            "<div class=\\"quantity\\">" +
              "<button class=\\"stepper\\" data-dec=\\"" + product.id + "\\">-</button>" +
              "<span>Qty " + quantity + "</span>" +
              "<button class=\\"stepper\\" data-inc=\\"" + product.id + "\\">+</button>" +
            "</div>" +
          "</div>";
        }).join("");

        const nextTotals = totals();
        totalsEl.innerHTML =
          "<div class=\\"total-row\\"><span>Subtotal</span><span>" + currency.format(nextTotals.subtotal) + "</span></div>" +
          "<div class=\\"total-row\\"><span>Shipping</span><span>" + currency.format(nextTotals.shipping) + "</span></div>" +
          "<div class=\\"total-row final\\"><span>Total</span><span>" + currency.format(nextTotals.total) + "</span></div>";

        checkoutEl.disabled = false;

        document.querySelectorAll("[data-inc]").forEach(button => {
          button.addEventListener("click", () => {
            const productId = button.getAttribute("data-inc");
            state.cart[productId] += 1;
            renderCart();
          });
        });

        document.querySelectorAll("[data-dec]").forEach(button => {
          button.addEventListener("click", () => {
            const productId = button.getAttribute("data-dec");
            state.cart[productId] -= 1;

            if (state.cart[productId] <= 0) {
              delete state.cart[productId];
            }

            renderCart();
          });
        });
      }

      function renderOrders() {
        if (state.orders.length === 0) {
          ordersEl.innerHTML = "<p class=\\"empty\\">No orders yet. Create one from the cart.</p>";
          return;
        }

        ordersEl.innerHTML = state.orders.map(order => {
          return "<div class=\\"order-item\\">" +
            "<div class=\\"order-title\\">" +
              "<strong>" + order.orderId + "</strong>" +
              "<span class=\\"badge\\">" + order.status + "</span>" +
            "</div>" +
            "<div class=\\"meta\\">" + order.items.length + " item group(s) - " + currency.format(order.total) + " - payment " + order.paymentStatus + " - notification " + order.notificationStatus + "</div>" +
          "</div>";
        }).join("");
      }

      async function loadApp() {
        try {
          const [customer, catalogue, orderHistory] = await Promise.all([
            request("/api/customer"),
            request("/api/products"),
            request("/api/orders")
          ]);

          state.user = customer.user;
          state.products = catalogue.products;
          state.orders = orderHistory.orders || [];
          renderCustomer();
          renderProducts();
          renderCart();
          renderOrders();
          setStatus("Ready for checkout.");
        } catch (error) {
          setStatus(error.message, true);
        }
      }

      checkoutEl.addEventListener("click", async () => {
        const entries = cartEntries();

        if (entries.length === 0 || !state.user) {
          return;
        }

        checkoutEl.disabled = true;
        setStatus("Creating order across services...");

        try {
          const payload = {
            userId: state.user.id,
            paymentMethod: "demo-card",
            items: entries.map(({ product, quantity }) => ({
              productId: product.id,
              quantity
            }))
          };

          const result = await request("/api/orders", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
          });

          state.orders.unshift(result.order);
          state.cart = {};
          renderCart();
          renderOrders();
          setStatus("Order confirmed. Payment authorized and notification queued.");
        } catch (error) {
          checkoutEl.disabled = false;
          setStatus(error.message, true);
        }
      });

      loadApp();
    </script>
  </body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://frontend");

  try {
    if (url.pathname === "/health") {
      sendJson(res, 200, { service: "frontend", status: "ok" });
      return;
    }

    if (url.pathname === "/api/customer") {
      const payload = await fetchJson(`${USER_SERVICE_URL}/me`);
      sendJson(res, 200, payload);
      return;
    }

    if (url.pathname === "/api/products") {
      const payload = await fetchJson(`${PRODUCT_SERVICE_URL}/products`);
      sendJson(res, 200, payload);
      return;
    }

    if (url.pathname === "/api/orders" && req.method === "GET") {
      const payload = await fetchJson(`${ORDER_SERVICE_URL}/orders`);
      sendJson(res, 200, payload);
      return;
    }

    if (url.pathname === "/api/orders" && req.method === "POST") {
      const body = await readBody(req);
      const payload = await postJson(`${ORDER_SERVICE_URL}/orders`, body);
      sendJson(res, 201, payload);
      return;
    }

    if (url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(html);
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    sendJson(res, 500, { error: "frontend_proxy_error", message: error.message });
  }
});

server.listen(3000, () => {
  console.log("frontend listening on port 3000");
});


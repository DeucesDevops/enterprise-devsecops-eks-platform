const http = require("http");

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:3004";
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3005";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001";

const orders = [];

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

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.json();
}

function money(value) {
  return Number(value.toFixed(2));
}

function createOrderItems(requestItems, products) {
  return requestItems.map(item => {
    const product = products.find(candidate => candidate.id === item.productId);

    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    const quantity = Number(item.quantity || 1);

    if (quantity < 1 || quantity > product.inventory) {
      throw new Error(`Invalid quantity for ${product.name}`);
    }

    return {
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal: money(product.price * quantity)
    };
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://order-service");

  if (req.url === "/health") {
    sendJson(res, 200, { service: "order-service", status: "ok" });
    return;
  }

  if (url.pathname === "/orders" && req.method === "GET") {
    sendJson(res, 200, { orders });
    return;
  }

  if (url.pathname.startsWith("/orders/") && req.method === "GET") {
    const orderId = url.pathname.split("/")[2];
    const order = orders.find(item => item.orderId === orderId);

    if (!order) {
      sendJson(res, 404, { error: "order_not_found" });
      return;
    }

    sendJson(res, 200, { order });
    return;
  }

  if (url.pathname === "/orders" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const requestItems = Array.isArray(body.items)
        ? body.items
        : [{ productId: body.productId, quantity: body.quantity || 1 }];

      if (!body.userId || requestItems.length === 0) {
        sendJson(res, 400, { error: "invalid_order_request" });
        return;
      }

      const [{ products }, { user }] = await Promise.all([
        fetchJson(`${PRODUCT_SERVICE_URL}/products`),
        fetchJson(`${USER_SERVICE_URL}/users/${body.userId}`)
      ]);

      const items = createOrderItems(requestItems, products);
      const subtotal = money(items.reduce((total, item) => total + item.lineTotal, 0));
      const shipping = subtotal >= 75 ? 0 : 4.99;
      const total = money(subtotal + shipping);

      const order = {
        orderId: `order-${Date.now()}`,
        user,
        items,
        subtotal,
        shipping,
        total,
        currency: "GBP",
        status: "created",
        createdAt: new Date().toISOString()
      };

      const payment = await postJson(`${PAYMENT_SERVICE_URL}/payments/authorize`, {
        orderId: order.orderId,
        amount: total,
        currency: order.currency,
        method: body.paymentMethod || "demo-card"
      });

      const notification = await postJson(`${NOTIFICATION_SERVICE_URL}/notifications`, {
        orderId: order.orderId,
        recipient: user.email,
        channel: "email",
        message: `Order ${order.orderId} was confirmed for ${user.name}.`
      });

      const confirmedOrder = {
        ...order,
        status: "confirmed",
        paymentStatus: payment.status,
        notificationStatus: notification.status,
        confirmedAt: new Date().toISOString()
      };

      orders.unshift(confirmedOrder);

      sendJson(res, 201, {
        order: confirmedOrder,
        payment,
        notification
      });
      return;
    } catch (error) {
      sendJson(res, 500, { error: "order_failed", message: error.message });
      return;
    }
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(3003, () => {
  console.log("order-service listening on port 3003");
});

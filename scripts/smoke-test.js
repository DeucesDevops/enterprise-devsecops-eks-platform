const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const services = [
  {
    name: "user-service",
    script: "services/user-service/src/server.js"
  },
  {
    name: "product-service",
    script: "services/product-service/src/server.js"
  },
  {
    name: "payment-service",
    script: "services/payment-service/src/server.js"
  },
  {
    name: "notification-service",
    script: "services/notification-service/src/server.js"
  },
  {
    name: "order-service",
    script: "services/order-service/src/server.js",
    env: {
      USER_SERVICE_URL: "http://127.0.0.1:3001",
      PRODUCT_SERVICE_URL: "http://127.0.0.1:3002",
      PAYMENT_SERVICE_URL: "http://127.0.0.1:3004",
      NOTIFICATION_SERVICE_URL: "http://127.0.0.1:3005"
    }
  },
  {
    name: "frontend",
    script: "apps/frontend/server.js",
    env: {
      USER_SERVICE_URL: "http://127.0.0.1:3001",
      PRODUCT_SERVICE_URL: "http://127.0.0.1:3002",
      ORDER_SERVICE_URL: "http://127.0.0.1:3003"
    }
  }
];

const children = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitFor(url, attempts = 20) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      // Service is still starting.
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${url} failed: ${JSON.stringify(body)}`);
  }

  return body;
}

function startServices() {
  for (const service of services) {
    const child = spawn(process.execPath, [path.join(root, service.script)], {
      cwd: root,
      env: {
        ...process.env,
        ...(service.env || {})
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    child.stdout.on("data", chunk => {
      process.stdout.write(`[${service.name}] ${chunk}`);
    });

    child.stderr.on("data", chunk => {
      process.stderr.write(`[${service.name}] ${chunk}`);
    });

    children.push(child);
  }
}

function stopServices() {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
}

async function run() {
  startServices();

  try {
    await waitFor("http://127.0.0.1:3000/health");
    await waitFor("http://127.0.0.1:3001/health");
    await waitFor("http://127.0.0.1:3002/health");
    await waitFor("http://127.0.0.1:3003/health");
    await waitFor("http://127.0.0.1:3004/health");
    await waitFor("http://127.0.0.1:3005/health");

    const products = await requestJson("http://127.0.0.1:3000/api/products");
    if (!Array.isArray(products.products) || products.products.length < 3) {
      throw new Error("Expected at least three products");
    }

    const customer = await requestJson("http://127.0.0.1:3000/api/customer");
    if (customer.user.id !== "user-001") {
      throw new Error("Unexpected customer profile");
    }

    const checkout = await requestJson("http://127.0.0.1:3000/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: "user-001",
        items: [
          { productId: "product-001", quantity: 1 },
          { productId: "product-003", quantity: 2 }
        ]
      })
    });

    if (
      checkout.order.status !== "confirmed" ||
      checkout.payment.status !== "authorized" ||
      checkout.notification.status !== "queued"
    ) {
      throw new Error("Checkout flow did not complete successfully");
    }

    const orders = await requestJson("http://127.0.0.1:3000/api/orders");
    if (!orders.orders.find(order => order.orderId === checkout.order.orderId)) {
      throw new Error("Order history did not include the created order");
    }

    console.log("Smoke test passed.");
  } finally {
    stopServices();
  }
}

run().catch(error => {
  console.error(error);
  stopServices();
  process.exit(1);
});


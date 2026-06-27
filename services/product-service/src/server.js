const http = require("http");

const products = [
  {
    id: "product-001",
    name: "Platform Engineering Handbook",
    category: "Books",
    description: "A practical field guide for golden paths, developer portals, and platform operations.",
    price: 39.99,
    inventory: 18,
    deliveryEstimate: "2 business days"
  },
  {
    id: "product-002",
    name: "DevSecOps Starter Kit",
    category: "Tooling",
    description: "A curated bundle of checklists, workflow templates, and security scanning playbooks.",
    price: 59.99,
    inventory: 11,
    deliveryEstimate: "Instant digital access"
  },
  {
    id: "product-003",
    name: "Kubernetes Runbook Pack",
    category: "Operations",
    description: "Incident-ready runbooks for deployments, rollbacks, scaling, and service recovery.",
    price: 29.99,
    inventory: 25,
    deliveryEstimate: "Instant digital access"
  }
];

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://product-service");

  if (req.url === "/health") {
    sendJson(res, 200, { service: "product-service", status: "ok" });
    return;
  }

  if (url.pathname === "/products") {
    sendJson(res, 200, { products });
    return;
  }

  if (url.pathname.startsWith("/products/")) {
    const productId = url.pathname.split("/")[2];
    const product = products.find(item => item.id === productId);

    if (!product) {
      sendJson(res, 404, { error: "product_not_found" });
      return;
    }

    sendJson(res, 200, { product });
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(3002, () => {
  console.log("product-service listening on port 3002");
});

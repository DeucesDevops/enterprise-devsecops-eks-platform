const http = require("http");

const payments = [];

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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://payment-service");

  if (req.url === "/health") {
    sendJson(res, 200, { service: "payment-service", status: "ok" });
    return;
  }

  if (url.pathname === "/payments" && req.method === "GET") {
    sendJson(res, 200, { payments });
    return;
  }

  if (url.pathname === "/payments/authorize" && req.method === "POST") {
    const body = await readBody(req);
    const amount = Number(body.amount);

    if (!body.orderId || !Number.isFinite(amount) || amount <= 0) {
      sendJson(res, 400, { error: "invalid_payment_request" });
      return;
    }

    const payment = {
      paymentId: `pay-${Date.now()}`,
      orderId: body.orderId,
      amount: Number(amount.toFixed(2)),
      currency: body.currency || "GBP",
      method: body.method || "demo-card",
      cardLast4: "4242",
      status: "authorized",
      authorizedAt: new Date().toISOString()
    };

    payments.push(payment);
    sendJson(res, 200, payment);
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(3004, () => {
  console.log("payment-service listening on port 3004");
});

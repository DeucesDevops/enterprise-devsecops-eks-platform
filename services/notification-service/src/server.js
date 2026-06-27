const http = require("http");

const notifications = [];

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
  const url = new URL(req.url, "http://notification-service");

  if (req.url === "/health") {
    sendJson(res, 200, { service: "notification-service", status: "ok" });
    return;
  }

  if (url.pathname === "/notifications" && req.method === "GET") {
    const orderId = url.searchParams.get("orderId");
    const filtered = orderId
      ? notifications.filter(notification => notification.orderId === orderId)
      : notifications;

    sendJson(res, 200, { notifications: filtered });
    return;
  }

  if (url.pathname === "/notifications" && req.method === "POST") {
    const body = await readBody(req);
    const notification = {
      notificationId: `note-${Date.now()}`,
      orderId: body.orderId,
      recipient: body.recipient || "customer@example.com",
      channel: body.channel || "email",
      message: body.message || "Your order update is ready.",
      status: "queued",
      queuedAt: new Date().toISOString()
    };

    notifications.push(notification);
    sendJson(res, 202, notification);
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(3005, () => {
  console.log("notification-service listening on port 3005");
});

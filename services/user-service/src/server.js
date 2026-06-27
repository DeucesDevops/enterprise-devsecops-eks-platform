const http = require("http");

const users = [
  {
    id: "user-001",
    name: "Bernard Demo",
    email: "bernard.demo@example.com",
    tier: "platform-pro",
    address: {
      line1: "12 Cloud Avenue",
      city: "London",
      country: "United Kingdom"
    }
  }
];

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://user-service");

  if (req.url === "/health") {
    sendJson(res, 200, { service: "user-service", status: "ok" });
    return;
  }

  if (url.pathname === "/users") {
    sendJson(res, 200, { users });
    return;
  }

  if (url.pathname === "/me") {
    sendJson(res, 200, { user: users[0] });
    return;
  }

  if (url.pathname.startsWith("/users/")) {
    const userId = url.pathname.split("/")[2];
    const user = users.find(item => item.id === userId);

    if (!user) {
      sendJson(res, 404, { error: "user_not_found" });
      return;
    }

    sendJson(res, 200, { user });
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(3001, () => {
  console.log("user-service listening on port 3001");
});

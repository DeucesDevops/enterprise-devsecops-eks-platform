const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const serviceChecks = [
  {
    directory: "services/user-service",
    entrypoint: "src/server.js"
  },
  {
    directory: "services/product-service",
    entrypoint: "src/server.js"
  },
  {
    directory: "services/order-service",
    entrypoint: "src/server.js"
  },
  {
    directory: "services/payment-service",
    entrypoint: "src/server.js"
  },
  {
    directory: "services/notification-service",
    entrypoint: "src/server.js"
  },
  {
    directory: "apps/frontend",
    entrypoint: "server.js"
  }
];

for (const service of serviceChecks) {
  const dockerfile = path.join(root, service.directory, "Dockerfile");
  const entrypoint = path.join(root, service.directory, service.entrypoint);

  if (!fs.existsSync(dockerfile)) {
    console.error(`Missing ${dockerfile}`);
    process.exit(1);
  }

  if (!fs.existsSync(entrypoint)) {
    console.error(`Missing ${entrypoint}`);
    process.exit(1);
  }

  const result = spawnSync(process.execPath, ["--check", entrypoint], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status);
  }
}

console.log("Service validation passed.");

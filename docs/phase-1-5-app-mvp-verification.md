# Phase 1.5 App MVP Verification

Date: 2026-06-25

This verification proves that the project now runs as a small functional e-commerce application, not only a collection of health endpoints.

## Local Validation

Repository validation:

```bash
npm run lint
```

Result:

```text
Service validation passed.
```

Docker build:

```bash
docker compose build
```

Result:

```text
frontend, user-service, product-service, order-service, payment-service, and notification-service images built successfully.
```

Docker runtime:

```bash
docker compose up -d
docker compose ps
```

Result:

```text
frontend               Up   0.0.0.0:3000->3000/tcp
user-service           Up   0.0.0.0:3001->3001/tcp
product-service        Up   0.0.0.0:3002->3002/tcp
order-service          Up   0.0.0.0:3003->3003/tcp
payment-service        Up   0.0.0.0:3004->3004/tcp
notification-service   Up   0.0.0.0:3005->3005/tcp
```

## Frontend Check

```bash
curl -fsS http://127.0.0.1:3000/
```

Confirmed frontend content includes:

```text
DevSecOps Commerce
Add to cart
Recent orders
Checkout
```

## API Flow

Customer profile:

```bash
curl -fsS http://127.0.0.1:3000/api/customer
```

Product catalogue:

```bash
curl -fsS http://127.0.0.1:3000/api/products
```

Checkout:

```bash
curl -fsS -X POST http://127.0.0.1:3000/api/orders \
  -H 'content-type: application/json' \
  -d '{"userId":"user-001","items":[{"productId":"product-001","quantity":1},{"productId":"product-003","quantity":2}]}'
```

Result:

```json
{
  "order": {
    "status": "confirmed",
    "subtotal": 99.97,
    "shipping": 0,
    "total": 99.97,
    "paymentStatus": "authorized",
    "notificationStatus": "queued"
  },
  "payment": {
    "status": "authorized",
    "amount": 99.97,
    "currency": "GBP"
  },
  "notification": {
    "status": "queued",
    "channel": "email"
  }
}
```

Follow-up checks:

```bash
curl -fsS http://127.0.0.1:3000/api/orders
curl -fsS http://127.0.0.1:3004/payments
curl -fsS http://127.0.0.1:3005/notifications
```

Result:

```text
Order history, payment records, and notification records were returned successfully.
```


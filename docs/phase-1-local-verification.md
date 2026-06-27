# Phase 1 Local Verification

Date: 2026-06-24

This verification covers both local Node processes and Docker Compose.

## Checks

Repository structure validation:

```bash
npm run lint
```

Result:

```text
Service validation passed.
```

Health endpoints:

```text
GET http://localhost:3000/health -> {"service":"frontend","status":"ok"}
GET http://localhost:3001/health -> {"service":"user-service","status":"ok"}
GET http://localhost:3002/health -> {"service":"product-service","status":"ok"}
GET http://localhost:3003/health -> {"service":"order-service","status":"ok"}
GET http://localhost:3004/health -> {"service":"payment-service","status":"ok"}
GET http://localhost:3005/health -> {"service":"notification-service","status":"ok"}
```

Sample order request:

```bash
curl -X POST http://localhost:3003/orders \
  -H 'content-type: application/json' \
  -d '{"userId":"user-001","productId":"product-001","quantity":1}'
```

Result:

```json
{
  "order": {
    "orderId": "order-1782298983996",
    "userId": "user-001",
    "productId": "product-001",
    "quantity": 1,
    "status": "confirmed"
  },
  "payment": {
    "paymentId": "pay-1782298984047",
    "orderId": "order-1782298983996",
    "status": "authorized"
  },
  "notification": {
    "notificationId": "note-1782298984053",
    "orderId": "order-1782298983996",
    "status": "queued"
  }
}
```

## Docker Compose Verification

Docker Desktop was started and the full Compose stack was validated:

```bash
docker compose up --build -d
```

Health endpoints:

```text
GET http://localhost:3000/health -> {"service":"frontend","status":"ok"}
GET http://localhost:3001/health -> {"service":"user-service","status":"ok"}
GET http://localhost:3002/health -> {"service":"product-service","status":"ok"}
GET http://localhost:3003/health -> {"service":"order-service","status":"ok"}
GET http://localhost:3004/health -> {"service":"payment-service","status":"ok"}
GET http://localhost:3005/health -> {"service":"notification-service","status":"ok"}
```

Sample order result:

```json
{
  "order": {
    "orderId": "order-1782299050390",
    "userId": "user-001",
    "productId": "product-001",
    "quantity": 1,
    "status": "confirmed"
  },
  "payment": {
    "paymentId": "pay-1782299050429",
    "orderId": "order-1782299050390",
    "status": "authorized"
  },
  "notification": {
    "notificationId": "note-1782299050435",
    "orderId": "order-1782299050390",
    "status": "queued"
  }
}
```

Running containers:

```text
frontend               Up   0.0.0.0:3000->3000/tcp
user-service           Up   0.0.0.0:3001->3001/tcp
product-service        Up   0.0.0.0:3002->3002/tcp
order-service          Up   0.0.0.0:3003->3003/tcp
payment-service        Up   0.0.0.0:3004->3004/tcp
notification-service   Up   0.0.0.0:3005->3005/tcp
```

To stop the local stack:

```bash
docker compose down
```

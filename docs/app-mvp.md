# Application MVP

This project now includes a lightweight but functional e-commerce application.

The app is intentionally small, but it exercises a real microservice flow instead of only exposing health endpoints.

## User Flow

1. Open the frontend at `http://localhost:3000`.
2. Load the demo customer profile from `user-service`.
3. Load the product catalogue from `product-service`.
4. Add one or more products to the cart.
5. Checkout through `order-service`.
6. `order-service` calculates totals and calls `payment-service`.
7. `payment-service` authorizes a mock card payment.
8. `order-service` calls `notification-service`.
9. `notification-service` queues a confirmation notification.
10. The frontend displays the confirmed order in recent orders.

## Services

| Service | Business role |
| --- | --- |
| `frontend` | Store UI and same-origin API facade |
| `user-service` | Demo customer profile |
| `product-service` | Product catalogue, prices, inventory, delivery estimates |
| `order-service` | Checkout orchestration, totals, order history |
| `payment-service` | Mock payment authorization and payment records |
| `notification-service` | Queued order notification records |

## Local Demo

Start the stack:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

API smoke test:

```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/customer
curl -X POST http://localhost:3000/api/orders \
  -H 'content-type: application/json' \
  -d '{"userId":"user-001","items":[{"productId":"product-001","quantity":1}]}'
```

## Resume-Friendly Description

Built a cloud-native e-commerce microservices platform with product catalogue, checkout, mock payment authorization, order orchestration, and notification workflows, containerized with Docker and prepared for AWS EKS deployment.

## Verification

The MVP verification record is available in:

```text
docs/phase-1-5-app-mvp-verification.md
```

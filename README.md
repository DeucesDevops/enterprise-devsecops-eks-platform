# Enterprise Cloud-Native DevSecOps Platform

This project is the first and most important repository in the DevOps portfolio.

It starts as a local mini e-commerce microservices system and grows into a production-style DevSecOps platform running on AWS EKS with Terraform, GitHub Actions, Helm, Argo CD, and full observability.

## Services

| Service | Purpose | Port |
| --- | --- | --- |
| Frontend | Store UI and API facade | 3000 |
| User Service | Demo customer profile | 3001 |
| Product Service | Product catalogue and inventory | 3002 |
| Order Service | Checkout and order orchestration | 3003 |
| Payment Service | Mock payment authorization | 3004 |
| Notification Service | Queued order notifications | 3005 |

## Local Run

```bash
docker compose up --build
```

Health checks:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
```

Create a sample order:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H 'content-type: application/json' \
  -d '{"userId":"user-001","items":[{"productId":"product-001","quantity":1}]}'
```

## Current Phase

Phase 1.5: Real App MVP.

See:

- [Project Plan](PROJECT_PLAN.md)
- [Architecture](ARCHITECTURE.md)
- [Tasks](TASKS.md)
- [CI/CD Pipeline](docs/ci-cd-pipeline.md)
- [Application MVP](docs/app-mvp.md)
- [Phase 1.5 App MVP Verification](docs/phase-1-5-app-mvp-verification.md)
- [Branching Strategy](docs/branching-strategy.md)
- [Phase 1 Local Verification](docs/phase-1-local-verification.md)
- [Dependabot](docs/dependabot.md)
- [Dependabot Review Log](docs/dependabot-review-log.md)

## CI

GitHub Actions validates the repository structure on pushes and pull requests using [.github/workflows/ci.yml](.github/workflows/ci.yml).

The private QA DevSecOps pipeline is implemented in [.github/workflows/qa-cicd.yml](.github/workflows/qa-cicd.yml) and includes secret scanning, split Checkov scans, client/server Trivy filesystem scans, linting, tests, SonarQube, Docker builds, image scans, SBOM generation, GHCR image push, QA manifest updates, and conditional EKS deployment.

## Branching Strategy

This public repository exposes the stable `main` branch for portfolio review. Active QA work, learning notes, and internal planning happen in a private workbench repository, then polished changes are promoted here.

Pull requests use [.github/pull_request_template.md](.github/pull_request_template.md) to record validation before merge.

## Dependency Automation

Dependabot is enabled through [.github/dependabot.yml](.github/dependabot.yml) to monitor npm, GitHub Actions, Docker base images, and Terraform dependency surfaces.

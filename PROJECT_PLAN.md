# Project Plan

## Goal

Build a production-style DevSecOps platform around a mini e-commerce microservices application.

The final system should demonstrate:

- Application engineering
- Docker
- CI/CD
- DevSecOps scanning
- Terraform
- AWS EKS
- Helm
- Argo CD
- Monitoring and logging
- Incident runbooks

## Phase 1: Local Application Foundation

Deliverables:

- Functional frontend MVP
- Five backend services
- Health endpoints
- Product catalogue, cart, checkout, mock payment, and notification flow
- Dockerfiles
- Docker Compose
- Basic CI workflow
- Initial documentation

Acceptance criteria:

- Every service has `/health`.
- Users can browse products, add to cart, checkout, and see order confirmation.
- Order service can call user, product, payment, and notification services.
- Docker Compose can build the local environment.
- CI performs basic repository validation.

## Phase 1.5: Real App MVP

Deliverables:

- Store UI served by the frontend service
- Same-origin frontend API routes for products, customer profile, and orders
- Product catalogue with inventory and delivery estimates
- Customer profile endpoint
- Order history endpoint
- Mock payment records
- Notification records
- MVP documentation

Acceptance criteria:

- Browser users can complete a checkout flow through `http://localhost:3000`.
- The order response includes item totals, shipping, payment status, and notification status.
- Docker Compose can build and run the full app.
- CI validates JavaScript syntax for all service entrypoints.

## Phase 2: CI and Security

Deliverables:

- GitHub Actions test workflow
- Trivy container scan
- Checkov IaC scan
- Dependabot
- Branch protection recommendation

## Phase 3: AWS and Terraform

Deliverables:

- VPC
- EKS
- RDS PostgreSQL
- ECR repositories
- IAM roles
- Terraform docs

## Phase 4: Kubernetes and Helm

Deliverables:

- Helm chart
- Kubernetes deployments
- Services
- Ingress
- HPA
- Secrets strategy

## Phase 5: GitOps

Deliverables:

- Argo CD app manifests
- Environment overlays
- Promotion workflow

## Phase 6: Observability

Deliverables:

- Prometheus
- Grafana
- Loki
- Alertmanager
- Runbooks

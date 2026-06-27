# Architecture

## Local Phase

```mermaid
flowchart LR
  B["Browser"] --> FE["Frontend :3000"]
  FE --> U["User Service :3001"]
  FE --> P["Product Service :3002"]
  FE --> O["Order Service :3003"]
  O --> U
  O --> P
  O --> PAY["Payment Service :3004"]
  O --> N["Notification Service :3005"]
```

## Target AWS Phase

```mermaid
flowchart TB
  GH["GitHub"] --> GHA["GitHub Actions"]
  GHA --> SCAN["QA Security Pipeline"]
  SCAN --> GITLEAKS["Gitleaks"]
  SCAN --> CHECKOV["Checkov"]
  SCAN --> TRIVY["Trivy FS/Image"]
  SCAN --> SBOM["SBOM"]
  GHA --> ECR["Amazon ECR or GHCR"]
  TF["Terraform"] --> AWS["AWS Platform"]
  AWS --> EKS["Amazon EKS"]
  AWS --> RDS["Amazon RDS PostgreSQL"]
  ARGO["Argo CD"] --> EKS
  EKS --> APP["E-Commerce Microservices"]
  APP --> OBS["Prometheus / Grafana / Loki"]
```

## QA Pipeline Architecture

```mermaid
flowchart TB
  QA["Push to qa"] --> SECRET["Gitleaks secret scan"]
  SECRET --> IAC["Split Checkov IaC scans"]
  SECRET --> FSCLIENT["Trivy frontend filesystem scan"]
  SECRET --> FSSERVER["Trivy service filesystem scan"]
  IAC --> CLIENT["Client lint and test"]
  IAC --> SERVER["Server lint and smoke test"]
  FSCLIENT --> CLIENT
  FSSERVER --> SERVER
  CLIENT --> SONAR["SonarQube quality gate"]
  SERVER --> SONAR
  SONAR --> BUILD["Docker build matrix"]
  BUILD --> IMAGE_SCAN["Trivy image scan"]
  BUILD --> BOM["SPDX SBOM"]
  IMAGE_SCAN --> PUSH["Push images to GHCR"]
  BOM --> PUSH
  PUSH --> MANIFEST["Update QA manifest"]
  MANIFEST --> DEPLOY["Deploy to EKS QA namespace"]
```

## Service Responsibilities

User service:

- Demo customer profile endpoint
- Health endpoint

Product service:

- Product catalogue, details, inventory and delivery estimate endpoints
- Health endpoint

Order service:

- Order creation and order history endpoints
- Calculates totals and shipping
- Calls user and product services during checkout
- Calls payment service
- Calls notification service

Payment service:

- Mock payment authorization
- Payment record listing
- Health endpoint

Notification service:

- Mock notification dispatch
- Notification record listing
- Health endpoint

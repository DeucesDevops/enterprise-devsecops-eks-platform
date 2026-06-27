# Dependabot

Dependabot keeps project dependencies visible and current by opening pull requests when supported dependency files have updates available.

## What This Repo Monitors

This repository configures Dependabot for:

- npm dependencies in `package.json`
- GitHub Actions in `.github/workflows/`
- Docker base images in each service Dockerfile
- Terraform dependencies in `infrastructure/terraform/envs/dev`

In the public portfolio repository, Dependabot targets `main`. Active dependency testing can still happen in the private workbench before polished updates are promoted publicly.

## Schedule

Dependabot checks weekly on Monday mornings using the `Europe/London` timezone.

## Why This Matters

For a DevSecOps portfolio, Dependabot demonstrates supply-chain awareness:

- dependency updates are automated
- version drift is visible in pull requests
- security updates can be reviewed and merged through the normal CI process
- the repository shows maintenance discipline, not just initial setup

## Configuration

The configuration lives in:

```text
.github/dependabot.yml
```

## Review Log

Dependabot update reviews are tracked in:

```text
docs/dependabot-review-log.md
```

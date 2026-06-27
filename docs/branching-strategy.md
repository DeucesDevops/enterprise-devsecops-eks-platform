# Public Branching Strategy

This public repository is the polished portfolio output for the project.

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Stable, portfolio-ready branch shown to reviewers and recruiters |

## Workflow

1. Build and test active work in the private workbench repository.
2. Run the private QA pipeline until the project is stable.
3. Remove private learning notes and content-planning files.
4. Export polished code and documentation to public `main`.
5. Keep public `main` stable and ready for portfolio review.

## Dependabot

Dependabot and dependency experimentation are managed in the private workbench. Public `main` should stay focused on stable, reviewed portfolio output.

## Promotion Rule

No raw learning notes, content drafts, secrets, or experimental branches should be published here.

`main` should receive only tested, portfolio-ready changes.

The private workbench remains the place for active QA work.

## GitHub Branch Protection

Branch protection is enabled for `main`.

Rules on `main`:

- Require pull requests before merging
- Require the `validate` CI check
- Require branches to be up to date before merging
- Dismiss stale pull request approvals when new commits are pushed
- Prevent force pushes
- Prevent branch deletion
- Apply rules to administrators

This keeps the public portfolio branch stable.

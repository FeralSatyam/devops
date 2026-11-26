# Pani Puri House on AWS EC2

A playful, responsive pani puri storefront built with React and Vite. It is hosted by nginx on an Amazon EC2 instance provisioned with CloudFormation and deployed by GitHub Actions.

## Deployment

Push to `main` or run **Deploy Pani Puri House to EC2** manually from the Actions tab:

```text
build React site → upload dist/ → create/update EC2 stack → copy site → check live page
```

The first run creates the instance. Later runs update the site on that instance. Add these repository secrets before starting a deployment:

| Secret | Value |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Matching AWS secret key |
| `AWS_SESSION_TOKEN` | Session token, if your AWS credentials are temporary |

See [docs/01-setup-github-secrets.md](docs/01-setup-github-secrets.md) for setup steps and [docs/03-deploy-and-connect.md](docs/03-deploy-and-connect.md) for deployment details.

## Run locally

Requires Node.js 20.19 or newer.

```bash
npm ci
npm run dev
npm run build
```

## Project files

- [src/App.jsx](src/App.jsx) — storefront content and menu
- [src/styles.css](src/styles.css) — responsive visual design
- [.github/workflows/deploy.yaml](.github/workflows/deploy.yaml) — build and EC2 deployment
- [infra/ec2-instance.yaml](infra/ec2-instance.yaml) — EC2, key pair, security group and nginx setup

Change the AWS region and stack name in the workflow's `env` block. Never commit AWS credentials or private keys. The EC2 security group allows SSH from anywhere so GitHub-hosted runners can deploy; for production, use a deployment approach that avoids public SSH access.

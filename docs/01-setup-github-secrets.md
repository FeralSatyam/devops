# 01 - Set up GitHub secrets

The workflow authenticates to AWS with repository secrets. No SSH key secret is needed; CloudFormation creates the key pair and stores its private key in SSM Parameter Store.

## 1. Fork the repository

Click **Fork** at the top of the repository page. You will make all changes in your fork.

## 2. Get the keys from the AWS Academy sandbox

1. Open your AWS Academy course and start the sandbox.
2. Open the credentials panel for the sandbox.
3. Copy the **Access Key ID**.
4. Copy the **Secret Access Key**.
5. If the credentials panel provides a **Session Token**, copy that too. Temporary AWS credentials require all three values.

> Don't swap the two values or add spaces or newlines when pasting. Either mistake makes the workflow fail with a signature error.

## 3. Add them to GitHub

In your fork, go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

| Secret name             | Value                      |
| ----------------------- | -------------------------- |
| `AWS_ACCESS_KEY_ID`     | Your AWS Access Key ID     |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Access Key |
| `AWS_SESSION_TOKEN`     | Session token (only for temporary credentials) |

## 4. Enable Actions in your fork

GitHub disables workflows in new forks. Open the **Actions** tab and click **I understand my workflows, go ahead and enable them**.

## 5. Check the region

The workflow uses `us-east-1`. If your sandbox uses another region, change `AWS_REGION` in [.github/workflows/deploy.yaml](../.github/workflows/deploy.yaml).

## Troubleshooting

- **SignatureDoesNotMatch / InvalidClientTokenId**: the keys were swapped, have stray whitespace, or are no longer valid. Copy them again and update the secrets.
- If your sandbox gives you temporary credentials, update all three values before you push; the session token is required along with the access key and secret.

Next: [02 - Customize the storefront](02-customize-your-storefront.md)

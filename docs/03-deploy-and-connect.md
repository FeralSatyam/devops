# 03 - Deploy and connect

Prerequisites: add the AWS secrets using [01 - Set up GitHub secrets](01-setup-github-secrets.md).

## Deploy

The **Deploy Pani Puri House to EC2** workflow runs on pushes to `main` that change the app, dependencies, CloudFormation template, or workflow. You can also run it from **Actions** → **Deploy Pani Puri House to EC2** → **Run workflow** and choose an instance size.

The workflow builds the static site, creates or updates the `pani-puri-house` CloudFormation stack, retrieves the instance key from SSM Parameter Store, copies `dist/` to nginx, then checks that the page is live. The first run creates the instance and can take several minutes.

The workflow requires AWS permissions for CloudFormation, EC2, and SSM Parameter Store. It uses `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, plus `AWS_SESSION_TOKEN` when the credentials are temporary.

## Open your site

After a successful run, open the **Live at http://...** URL in the run summary. The workflow reports the current public IP, including after an instance restart.

## Connect over SSH

The private key is stored in SSM Parameter Store. With AWS CLI configured for the same account and region:

```bash
KEY_ID=<KeyPairId from the workflow outputs>
aws ssm get-parameter --name /ec2/keypair/$KEY_ID --with-decryption \
  --query Parameter.Value --output text --region us-east-1 > ec2-key.pem
chmod 400 ec2-key.pem
ssh -i ec2-key.pem ec2-user@<PublicIp>
```

Useful instance checks:

```bash
ls /usr/share/nginx/html
systemctl status nginx
sudo tail /var/log/nginx/access.log
sudo cat /var/log/cloud-init-output.log
```

## Troubleshooting

- **InvalidClientTokenId or signature errors**: verify the GitHub secrets and refresh expired sandbox credentials, including the session token if provided.
- **CloudFormation validation or deployment fails**: inspect the template and the AWS error in the workflow logs.
- **The site check fails**: check the SSH, cloud-init, and nginx steps in the deploy job. The workflow prints cloud-init output if first-boot setup fails.
- **The URL stops working later**: if the instance was stopped and started, its public IP may have changed. Re-run the workflow and use its latest URL.

The security group allows SSH from `0.0.0.0/0` so GitHub-hosted runners can connect. This is suitable only for a learning setup; production deployments should avoid public SSH or tightly restrict access.

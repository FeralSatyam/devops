# 02 - Customize the storefront

The page content lives in [src/App.jsx](../src/App.jsx). Update the introduction, menu names, descriptions and prices in the `menu` list, and adjust the story and footer text to suit your shop.

The page's layout and colors are in [src/styles.css](../src/styles.css). It is responsive for mobile and desktop. The hero plate and menu illustrations are CSS and emoji, so the site does not depend on external image services.

When you're happy with the changes, run a production build:

```bash
npm ci
npm run build
```

Commit and push to `main` to deploy the updated site. Set up AWS credentials first using [01 - Set up GitHub secrets](01-setup-github-secrets.md).

Next: [03 - Deploy and connect](03-deploy-and-connect.md)

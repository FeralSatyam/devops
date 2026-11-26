# 02 - Customize the storefront

The storefront UI lives in [src/App.jsx](../src/App.jsx). Update the introduction, story and footer there. Menu items, descriptions, prices and illustrations are returned by the API in [server/index.js](../server/index.js); the order form uses those same API items and submits orders to the backend.

The page's layout and colors are in [src/styles.css](../src/styles.css). It is responsive for mobile and desktop. The hero plate and menu illustrations are CSS and emoji, so the site does not depend on external image services.

When you're happy with the changes, run a production build:

```bash
npm ci
npm run build
npm test
```

For local development, run `npm run start:server` and `npm run dev` in separate terminals. Vite proxies `/api` requests to the local Node server. Commit and push to `main` to deploy the updated site and API. Set up AWS credentials first using [01 - Set up GitHub secrets](01-setup-github-secrets.md).

Next: [03 - Deploy and connect](03-deploy-and-connect.md)

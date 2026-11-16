# GENZIQ

Building intelligent technology to solve meaningful real-world problems.

This repository contains the GENZIQ website, built with TanStack Start, React,
TypeScript, and Tailwind CSS.

## Development

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

Create and serve a production build:

```sh
npm run build
npm run preview
```

## Deployment

The site can be deployed on Vercel. Import `GENZIQ/genziq` in Vercel and use
the default build settings; Vercel assigns a free `*.vercel.app` subdomain.
Pushes to the connected branch trigger new deployments.

### Contact form email

The contact form sends submissions through [Web3Forms](https://web3forms.com/).
Create an access key configured for `anushree1888@gmail.com`, then add it to the Vercel project as the
`WEB3FORMS_ACCESS_KEY` environment variable for Production (and Preview if
needed). Redeploy after adding it. The key is read only by the server.
Messages arrive through Web3Forms, with visitors' email addresses set as the
reply-to address.

## Mission

We aim to build technology that is innovative, useful, trustworthy, and aligned
with real human needs.

## Contact

- Organization: [GENZIQ on GitHub](https://github.com/GENZIQ)
- Email: anushree1888@gmail.com

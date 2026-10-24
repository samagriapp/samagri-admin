# SamagriApp Admin

A Vite + React + TypeScript admin dashboard for SamagriApp with login, forgot-password, protected routes, dashboard analytics, and product management.

## Prerequisites

- Node.js 18+
- npm 9+
- A backend API that exposes authentication and product endpoints at `VITE_API_BASE_URL`

## Installation

```bash
npm install
```

## Environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Example (set this to the API origin plus version prefix, not an individual endpoint):

```env
VITE_API_BASE_URL=https://samagri-mcr-production.up.railway.app/api/v1
```

Important: `VITE_` values are exposed to the browser, so keep only non-secret public configuration in the client app.

## Local development

```bash
npm run dev -- --host 0.0.0.0
```

Then open http://localhost:5173.

## Production build

```bash
npm run build
```

## Preview the production build

```bash
npm run preview -- --host 0.0.0.0
```

## Backend assumptions

Authentication routes are currently configured for:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

Product routes follow the backend endpoints provided for this app:

- `GET /api/v1/products/?index=0&limit=10`
- `GET /api/v1/products/:id` (used to load an individual product for editing)
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `DELETE /api/v1/admin/products/:id`

Requests include the bearer token from the active session when the login response provides one. The API client also sends cookies for backends using cookie authentication. Product API request/response handling is centralized in `src/services/productApi.ts`. Vite loads `.env`, not `.env.example`; after changing `.env`, restart the dev server.

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm test
```

## Deployment to Vercel

1. Push the project to a GitHub repository.
2. Import it into Vercel.
3. Add the environment variable:
   - `VITE_API_BASE_URL` = your deployed backend URL
4. Deploy.

## Notes

- The app uses React Router for protected routes and redirects to `/login` when the user is not authenticated.
- The UI avoids storing passwords in local storage. Token/session state is kept in `sessionStorage` only when the backend provides a token response.
- Password-reset behavior intentionally avoids revealing whether an email exists on the platform if the backend responds generically.

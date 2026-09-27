# Money Dashboard

Next.js revenue dashboard with Prisma models for user, category, and income. It tracks amounts as integer cents and groups revenue by month and category. The public page opens with fictional sample data. Private records require an admin token and a local SQLite database.

## Local setup

1. Copy `.env.example` to `.env` and set a random `ADMIN_API_TOKEN` of at least 32 characters and `ADMIN_EMAIL`.
2. Run `pnpm install`, `pnpm --filter money-dashboard db:migrate`, and `pnpm --filter money-dashboard dev` from the workspace root.
3. Open `http://127.0.0.1:3002`. The token remains in the browser page state and is sent in `X-API-Key` only when private actions are used.

`GET /api/income` lists up to 500 rows, `POST /api/income` saves a row, `DELETE /api/income/{id}` deletes a row, and `GET /api/analytics` returns aggregates. Each route requires the admin token. CSV upload is a local preview and does not save without explicit action.

## Deployment

Run a migration with `prisma migrate deploy`, build with `pnpm build`, and start with `pnpm start`. Use persistent storage, TLS, backups, and per-user authentication before public multi-user use. This demo uses one admin token and SQLite; it does not yet implement NextAuth or Clerk. For a hosted deployment, switch Prisma to PostgreSQL and provide a managed database.

## Status

The sample dashboard and authenticated API are implemented. Stripe, Shopify, and QuickBooks are future adapters and have not been connected.

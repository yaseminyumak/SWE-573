# CulinaryGraph Frontend

React + Vite + Tailwind CSS + TanStack Query + React Router. Keycloak auth will be wired in the auth step.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Docker

```bash
docker build -t culinarygraph-frontend .
docker run -p 80:80 culinarygraph-frontend
```

## Env

- `VITE_API_BASE` — API base URL (default `/api` for proxy)

## Structure

- `src/features/` — catalog, recipe, search
- `src/shared/` — components, hooks, api (client)
- `src/auth/` — Keycloak init, AuthProvider

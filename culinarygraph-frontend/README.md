# CulinaryGraph Frontend

React + Vite + Tailwind CSS + TanStack Query + React Router + Keycloak.

## Tam yığın (Podman Compose)

Backend + Keycloak + DB ile birlikte:

```bash
cd ../docker
podman compose up --build -d
```

- UI: **http://localhost:5173** (Nginx, port 80 → host 5173)  
- `/api` istekleri konteyner içinde backend’e proxy edilir (`nginx-default.conf`).

## Yerel geliştirme (Vite)

```bash
npm install
npm run dev
```

http://localhost:5173 — `vite.config.ts` içinde `/api` → `http://localhost:8080` proxy. Önce `../docker` altında `podman compose up -d` ve backend’in 8080’de çalışması gerekir.

## Build

```bash
npm run build
npm run preview   # production build önizleme
```

## Container (tek imaj)

Dockerfile build aşamasında `VITE_KEYCLOAK_URL` ve `VITE_API_BASE` set edilir; tam yığın için `../docker/docker-compose.yml` kullan.

## Env

- `VITE_API_BASE` — API tabanı (varsayılan `/api`)
- `VITE_KEYCLOAK_URL` — Keycloak sunucu URL’si (varsayılan `http://localhost:8180`)

## Structure

- `src/features/` — catalog, recipe, search
- `src/shared/` — components, hooks, api (client)
- `src/auth/` — Keycloak init, AuthProvider

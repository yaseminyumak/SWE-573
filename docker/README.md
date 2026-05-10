# CulinaryGraph — Deployment Guide

Full stack: **PostgreSQL** (app + Keycloak DB) · **Keycloak 24** · **Spring Boot backend** · **React/Nginx frontend**

---

## Table of Contents

- [CulinaryGraph — Deployment Guide](#culinarygraph--deployment-guide)
  - [Table of Contents](#table-of-contents)
  - [1. System Requirements](#1-system-requirements)
  - [2. Prerequisites](#2-prerequisites)
    - [Docker (production)](#docker-production)
    - [Podman (local development alternative)](#podman-local-development-alternative)
    - [Other dependencies](#other-dependencies)
  - [3. Production Deployment](#3-production-deployment)
    - [3.1 Server Setup](#31-server-setup)
    - [3.2 Clone \& Configure](#32-clone--configure)
    - [3.3 Build \& Start](#33-build--start)
    - [3.4 Nginx Reverse Proxy + HTTPS](#34-nginx-reverse-proxy--https)
    - [3.5 Keycloak Configuration](#35-keycloak-configuration)
      - [Register your domain as a valid redirect URI](#register-your-domain-as-a-valid-redirect-uri)
      - [Enable user registration](#enable-user-registration)
      - [Custom login theme](#custom-login-theme)
  - [6. Database Maintenance](#6-database-maintenance)
  - [7. Environment Variables Reference](#7-environment-variables-reference)
  - [8. Service Ports](#8-service-ports)
  - [9. Quick Reference](#9-quick-reference)

---

## 1. System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| OS | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 40 GB |
| Open ports | 22, 80, 443 | same |

> Keycloak alone requires ~512 MB heap. With all services running, plan for at least 2.5 GB active memory.

---

## 2. Prerequisites

### Docker (production)

```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out and back in after this

# Verify
docker compose version          # must be v2.x (plugin, not standalone)
```

### Podman (local development alternative)

```bash
sudo apt-get install -y podman podman-compose
# On macOS: brew install podman podman-compose
```

> All commands in this guide use `docker compose`. Replace with `podman compose` for local development if preferred.

### Other dependencies

```bash
sudo apt-get install -y git python3 nginx certbot python3-certbot-nginx
```

---

## 3. Production Deployment

### 3.1 Server Setup

```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y git python3 nginx certbot python3-certbot-nginx
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in, then verify:
docker compose version
```

### 3.2 Clone & Configure

```bash
git clone https://github.com/yaseminyumak/SWE-573.git
cd SWE-573/docker
```

**Edit `docker-compose.yml` before the first boot:**

```yaml
frontend:
  build:
    args:
      VITE_KEYCLOAK_URL: https://culinary.page   # ← your domain, no trailing slash
      VITE_API_BASE: /api
```

> `VITE_KEYCLOAK_URL` is compiled into the frontend JS bundle. If your domain changes, rebuild the frontend image.

**Change default passwords** (required for production):

```yaml
postgres:
  environment:
    POSTGRES_PASSWORD: <strong-db-password>

postgres-kc:
  environment:
    POSTGRES_PASSWORD: <strong-kc-db-password>

keycloak:
  environment:
    KEYCLOAK_ADMIN_PASSWORD: <strong-admin-password>
    KC_DB_PASSWORD: <same-as-kc-db-password>

backend:
  environment:
    DB_PASSWORD: <same-as-db-password>
```

### 3.3 Build & Start

```bash
cd SWE-573/docker

docker compose build
docker compose up -d

# Watch until Keycloak is ready (~2 min)
docker compose logs -f keycloak
# Wait for: "Listening on: http://0.0.0.0:8080"

# Verify backend is up
docker compose logs -f backend
# Wait for: "Started CulinaryGraphBackendApplication in X seconds"
```

### 3.4 Nginx Reverse Proxy + HTTPS

In production, the host nginx terminates HTTPS and proxies traffic to the containers. **Keycloak is not exposed externally** — nginx proxies its OIDC endpoints internally from `localhost:8180`.

**Architecture:**

```
Browser
  │
  ├─ HTTPS :443 ──► host nginx
  │                    ├─ /realms/, /resources/, /js/  ──► localhost:8180 (Keycloak)
  │                    └─ everything else               ──► localhost:8081 (frontend)
  │
  └─ (backend API called via /api/ through the frontend nginx inside the container)
```

**Create the nginx site config:**

```bash
sudo nano /etc/nginx/sites-available/culinarygraph
```

```nginx
# ── HTTP: redirect all to HTTPS ──────────────────────────────────────────────
server {
    listen 80;
    server_name culinary.page www.culinary.page;
    return 301 https://culinary.page$request_uri;
}

# ── HTTPS www → bare domain ──────────────────────────────────────────────────
server {
    listen 443 ssl;
    server_name www.culinary.page;

    ssl_certificate     /etc/letsencrypt/live/culinary.page/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/culinary.page/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://culinary.page$request_uri;
}

# ── Main application ──────────────────────────────────────────────────────────
server {
    listen 443 ssl;
    server_name culinary.page;

    ssl_certificate     /etc/letsencrypt/live/culinary.page/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/culinary.page/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 30m;

    # Keycloak — OIDC endpoints proxied internally (port not exposed publicly)
    location ~ ^/(realms|resources|js)/ {
        proxy_pass         http://127.0.0.1:8180;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_buffer_size  128k;
        proxy_buffers      8 128k;
    }

    # Frontend (React SPA + backend API proxy)
    location / {
        proxy_pass         http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

**Enable the site and obtain the TLS certificate:**

```bash
sudo ln -s /etc/nginx/sites-available/culinarygraph /etc/nginx/sites-enabled/
sudo nginx -t   # must say "syntax is ok"

# Obtain Let's Encrypt certificate (nginx plugin handles everything)
sudo certbot --nginx -d culinary.page -d www.culinary.page

# Test auto-renewal
sudo certbot renew --dry-run

sudo systemctl reload nginx
```

**Firewall:**

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

> Port 8180 (Keycloak) and 8080 (backend) are **not** opened — they are internal only.

### 3.5 Keycloak Configuration

#### Register your domain as a valid redirect URI

Keycloak's browser-facing OIDC flow requires the `redirect_uri` sent by the frontend to be pre-registered in the client settings. Run this once from the **server terminal** after the stack is up — no Keycloak restart needed:

```bash
#!/usr/bin/env bash
set -euo pipefail

KC="http://localhost:8180"
REALM="culinarygraph"
CLIENT_ID="culinarygraph-app"
ADMIN_USER="admin"
ADMIN_PASS="admin"   # change if you updated the password

TOKEN=$(curl -sf -X POST "${KC}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=admin-cli&username=${ADMIN_USER}&password=${ADMIN_PASS}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

CLIENT_UUID=$(curl -sf "${KC}/admin/realms/${REALM}/clients?clientId=${CLIENT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")

curl -sf "${KC}/admin/realms/${REALM}/clients/${CLIENT_UUID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  | python3 -c "
import sys, json
client = json.load(sys.stdin)
new_uris = [
    'https://culinary.page', 'https://culinary.page/', 'https://culinary.page/*',
    'https://www.culinary.page', 'https://www.culinary.page/', 'https://www.culinary.page/*',
]
new_origins = ['https://culinary.page', 'https://www.culinary.page']
uris = set(client.get('redirectUris', [])); uris.update(new_uris)
client['redirectUris'] = sorted(uris)
origins = set(client.get('webOrigins', [])); origins.update(new_origins)
client['webOrigins'] = sorted(origins)
print(json.dumps(client))
" > /tmp/kc_patch.json

HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X PUT \
  "${KC}/admin/realms/${REALM}/clients/${CLIENT_UUID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/kc_patch.json)
rm -f /tmp/kc_patch.json

[ "$HTTP" = "204" ] \
  && echo "✓ Done. Keycloak updated — redirect URIs registered." \
  || { echo "✗ Failed (HTTP ${HTTP})"; exit 1; }
```

> Access the Keycloak admin console at `https://culinary.page/admin` (proxied through nginx) or directly from the server via `http://localhost:8180/admin`.

#### Enable user registration

```bash
# Via API (replace token from the script above)
curl -sf -X PUT "http://localhost:8180/admin/realms/culinarygraph" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"registrationAllowed": true}'
```

Or: Admin console → realm **culinarygraph** → **Realm settings** → **Login** → **User registration** ON → Save.

#### Custom login theme

Login, register, and error pages use the built-in `culinarygraph` theme (dark navy background, logo, branded form). Theme files are mounted read-only into the Keycloak container from `docker/keycloak/themes/culinarygraph/`.

To apply theme changes without restarting the whole stack:

```bash
docker compose restart keycloak
```

If CSS is cached in the browser: Admin console → realm **culinarygraph** → **Realm settings** → **Themes** → click **Save** (forces a cache bust), then hard refresh (`Ctrl+Shift+R`).

---

## 6. Database Maintenance

**Access the database shell:**

```bash
docker exec -it docker-postgres-1 psql -U culinarygraph -d culinarygraph
```

**Run pending Liquibase migrations** (happens automatically on backend startup):

```bash
docker compose build backend
docker compose up -d --force-recreate backend

# Watch migration output
docker compose logs -f backend | grep -i "liquibase\|changeset\|running"
```

**Backup:**

```bash
docker exec docker-postgres-1 pg_dump -U culinarygraph culinarygraph \
  > backup_$(date +%Y%m%d_%H%M).sql
```

**Restore:**

```bash
cat backup_YYYYMMDD_HHMM.sql \
  | docker exec -i docker-postgres-1 psql -U culinarygraph -d culinarygraph
```

---

## 7. Environment Variables Reference

| Variable | Service | Default | Notes |
|----------|---------|---------|-------|
| `SPRING_PROFILES_ACTIVE` | backend | `docker` | Activates docker datasource profile |
| `DB_HOST` | backend | `postgres` | PostgreSQL service name |
| `DB_PORT` | backend | `5432` | |
| `DB_NAME` | backend | `culinarygraph` | |
| `DB_USERNAME` | backend | `culinarygraph` | |
| `DB_PASSWORD` | backend | `culinarygraph` | **Change in production** |
| `KEYCLOAK_ISSUER_URI` | backend | `http://keycloak:8080/realms/culinarygraph` | Internal service-to-service URI |
| `KEYCLOAK_ADMIN` | keycloak | `admin` | |
| `KEYCLOAK_ADMIN_PASSWORD` | keycloak | `admin` | **Change in production** |
| `KC_DB_PASSWORD` | keycloak | `keycloak` | **Change in production** |
| `VITE_KEYCLOAK_URL` | frontend build arg | `http://localhost:8180` | Browser-facing Keycloak URL — set to your domain |
| `VITE_API_BASE` | frontend build arg | `/api` | API base path |

---

## 8. Service Ports

| Service | Internal port | Host binding | Exposed publicly |
|---------|-------------|-------------|-----------------|
| Frontend (nginx) | 80 | 8081 | Via host nginx → 443 |
| Backend (Spring Boot) | 8080 | 8080 | No — internal only |
| Keycloak | 8080 | 8180 | No — proxied through nginx |
| PostgreSQL (app) | 5432 | 5432 | No — internal only |
| PostgreSQL (Keycloak) | 5432 | not bound | No — internal only |

---

## 9. Quick Reference

```bash
# Start everything
cd SWE-573/docker && docker compose up -d

# Stop (data preserved)
docker compose down

# Full reset — deletes all data and Keycloak users
docker compose down -v

# Rebuild a single service
docker compose build backend
docker compose up -d --force-recreate backend

# View logs
docker compose logs -f backend
docker compose logs -f keycloak
docker compose logs -f frontend

# Database shell
docker exec -it docker-postgres-1 psql -U culinarygraph -d culinarygraph

# Rebuild frontend with production domain
docker compose build \
  --build-arg VITE_KEYCLOAK_URL=https://culinary.page \
  --build-arg VITE_API_BASE=/api \
  frontend
docker compose up -d --force-recreate frontend
```

# CulinaryGraph Backend

Modular monolith backend (DDD). Package layout: `shared`, `catalog`, `recipe`, `identity`, `search`.

## Tam yığın (Podman Compose) — önerilen

PostgreSQL, Keycloak, backend ve frontend birlikte:

```bash
cd ../docker
podman compose up --build -d
```

- API: http://localhost:8080  
- UI: http://localhost:5173  
- Keycloak: http://localhost:8180  

Backend **`docker`** profili ile çalışır (`SPRING_PROFILES_ACTIVE=docker`). Ayrıntılar: `../docker/README.md`.

## Geliştirme: sadece altyapı konteynerde

Sadece PostgreSQL + Keycloak konteynerde; backend IntelliJ, frontend `npm run dev`.

1. **Konteynerleri başlat**
   ```bash
   cd ../docker
   podman compose up -d
   ```
   - PostgreSQL: `localhost:5432`
   - Keycloak: http://localhost:8180

2. **Backend’i IntelliJ’den veya:**
   ```bash
   ./mvnw spring-boot:run
   ```
   Varsayılan: DB `localhost:5432`, Keycloak issuer `http://localhost:8180/realms/culinarygraph`, port 8080.

3. **Frontend**
   ```bash
   cd ../culinarygraph-frontend
   npm install && npm run dev
   ```
   http://localhost:5173 — Vite `/api` → `http://localhost:8080`.

## Sadece PostgreSQL (Keycloak yok)

```bash
podman compose -f docker-compose-dev.yml up -d
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Container image (tek başına)

```bash
podman build -t culinarygraph-backend .
```

## Config

- `application.properties`: datasource, JPA, Liquibase, JWT issuer (yerel geliştirme).
- `application-docker.properties`: Compose ağında `postgres` host adı.
- `application-local.properties`: OAuth2 kapalı (`local` profil).
- Liquibase: `src/main/resources/db/changelog/db.changelog-master.xml`.

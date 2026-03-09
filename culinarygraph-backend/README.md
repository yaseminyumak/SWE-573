# CulinaryGraph Backend

Modular monolith backend (DDD). Package layout: `shared`, `catalog`, `recipe`, `identity`, `search`.

## Run with container ortamı (Podman / Docker, sadece altyapı)

Backend ve frontend konteyner içinde değil; sadece PostgreSQL ve Keycloak konteynerlerde çalışıyor.

1. **Konteynerleri başlat** (PostgreSQL, Keycloak):
   ```bash
   cd docker
   podman compose up -d
   # veya: docker compose up -d
   ```
   - PostgreSQL: `localhost:5432`
   - Keycloak: http://localhost:8180

2. **Backend’i IntelliJ’den çalıştır**
   - Run: `CulinaryGraphBackendApplication` (veya `./mvnw spring-boot:run`)
   - Varsayılan ayarlar: DB `localhost:5432`, Keycloak `http://localhost:8180/realms/culinarygraph`, port 8080

3. **Frontend’i yerelde çalıştır** (ayrı terminal):
   ```bash
   cd culinarygraph-frontend
   npm install && npm run dev
   ```
   - Tarayıcı: http://localhost:5173 — `/api` istekleri Vite proxy ile backend’e (8080) gider.

## Run locally (sadece PostgreSQL)

1. **Start PostgreSQL** (Podman veya Docker ile):
   ```bash
   cd culinarygraph-backend
   podman compose -f docker-compose-dev.yml up -d
   # veya: docker compose -f docker-compose-dev.yml up -d
   ```

2. **Run the app** from IDE or:
   ```bash
   ./mvnw spring-boot:run
   ```
   Optional: use profile `local` if you add one (e.g. `-Dspring-boot.run.profiles=local`).

## Container (build & run app in container)

Build image (Podman veya Docker; PostgreSQL URL runtime’da gerekir):
```bash
podman build -t culinarygraph-backend .
# veya: docker build -t culinarygraph-backend .

podman run -p 8080:8080 \
  -e DB_HOST=host.containers.internal -e DB_PORT=5432 \
  -e DB_NAME=culinarygraph -e DB_USERNAME=culinarygraph -e DB_PASSWORD=culinarygraph \
  culinarygraph-backend
# Docker kullanıyorsanız DB_HOST=host.docker.internal
```

Or run app + PostgreSQL with a single compose file (add a `backend` service to `docker-compose-dev.yml` that builds and depends on `postgres`).

## Config

- `application.properties`: datasource, JPA, Liquibase (env: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`).
- Changelog: `src/main/resources/db/changelog/db.changelog-master.xml`.

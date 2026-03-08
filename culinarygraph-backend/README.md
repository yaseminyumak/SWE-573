# CulinaryGraph Backend

Modular monolith backend (DDD). Package layout: `shared`, `catalog`, `recipe`, `identity`, `search`.

## Run locally

1. **Start PostgreSQL**
   ```bash
   cd culinarygraph-backend
   docker compose -f docker-compose-dev.yml up -d
   ```

2. **Run the app** from IDE or:
   ```bash
   ./mvnw spring-boot:run
   ```
   Optional: use profile `local` if you add one (e.g. `-Dspring-boot.run.profiles=local`).

## Docker (build & run app in container)

Build image (requires PostgreSQL URL at runtime):
```bash
docker build -t culinarygraph-backend .
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal -e DB_PORT=5432 \
  -e DB_NAME=culinarygraph -e DB_USERNAME=culinarygraph -e DB_PASSWORD=culinarygraph \
  culinarygraph-backend
```

Or run app + PostgreSQL with a single compose file (add a `backend` service to `docker-compose-dev.yml` that builds and depends on `postgres`).

## Config

- `application.properties`: datasource, JPA, Liquibase (env: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`).
- Changelog: `src/main/resources/db/changelog/db.changelog-master.xml`.

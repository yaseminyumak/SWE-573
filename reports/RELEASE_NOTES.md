# Release notes — CulinaryGraph

---

## Key product features

**CulinaryGraph** is a **crowdsourced, region-aware** platform for **techniques**, **ingredient** stories, and **recipes**, focused on cultural context—not only dishes.

- **Identity:** Registration, login, logout via **Keycloak**; API access with **JWT** and realm roles mapped to application permissions.
- **Recipes:** Create, list, and view recipes with steps, ingredients, difficulty, and duration
- **Catalog:** Browse **techniques** and **ingredients** (regions, descriptions, detail views).
- **Discovery:** Homepage highlights and **search** entry; **knowledge map** reserved as a future graph-style view.

---

## Architecture & key decisions

- **Modular monolith:** One deployable backend; logic grouped by **bounded contexts** (e.g. catalog, recipe, identity, search) instead of microservices.
- **DDD-style structure:** Each module uses **domain → application → infrastructure → API**; business rules stay in the **domain**; **domain does not depend on** persistence frameworks.
- **Integration between modules:** Via application boundaries (services/events), not ad-hoc cross-module domain references.
- **API & data:** **REST** over HTTP; **PostgreSQL** for application data; **Liquibase** for schema versioning.
- **Identity:** **Keycloak** as the identity provider (**OIDC**); **Spring Security** as **OAuth2 resource server** validating JWTs issued for realm `culinarygraph`.
- **Frontend:** **React** SPA, **decoupled** from the backend contract (HTTP + OIDC); server state via TanStack Query; routing via React Router.
- **Runtime topology:** **Docker Compose** for a reproducible full stack (app database, Keycloak database, Keycloak, backend, Nginx + static frontend with `/api` proxy to the backend).


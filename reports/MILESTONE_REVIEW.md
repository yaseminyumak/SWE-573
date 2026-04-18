# Milestone Review — CulinaryGraph

> Companion to [`reports/RELEASE_NOTES.md`](https://github.com/yaseminyumak/SWE-573/blob/main/reports/RELEASE_NOTES.md), [`reports/PROJECT_OVERVIEW.md`](https://github.com/yaseminyumak/SWE-573/blob/main/reports/PROJECT_OVERVIEW.md), and [`DELIVERABLES_INDEX.md`](https://github.com/yaseminyumak/SWE-573/blob/main/DELIVERABLES_INDEX.md).

---

## 1. Project status

**CulinaryGraph** is a crowdsourced platform for region-aware culinary knowledge: **techniques**, **ingredient profiles**, and **recipes** with cultural context. The first milestone delivers a working full stack — backend, database, identity, frontend — deployed via **Docker Compose** to a **DigitalOcean Droplet**, with a tagged **GitHub Release** ([1.0.0-alpha](https://github.com/yaseminyumak/SWE-573/releases)).

### Decisions during development

- **Modular monolith with DDD-style layering** (per `arch-decisions.md`) instead of microservices — single deployable, clearer module boundaries (`catalog`, `recipe`, `identity`, `search`).
- **Keycloak (OIDC) for identity** — out-of-the-box registration/login, JWT-based API access, role mapping (`culinarygraph-contributor`, `culinarygraph-validator`).
- **PostgreSQL + Liquibase** — versioned schema; separate Postgres instance for Keycloak.
- **React + Vite + TanStack Query + Tailwind**, **`keycloak-js`** for OIDC.
- **Docker Compose** for the full stack to keep the deployment reproducible across local and Droplet.
- **HTTP + public IP deploy compromises:** `randomUUID` polyfill, conditional PKCE, `sslRequired=NONE` on `master`/`culinarygraph` for dev/coursework only — production target is HTTPS + domain.

### Instructor / customer feedback (so far) and reflections

- The project's **scope and domain focus** — *region-specific cooking knowledge as a form of cultural heritage*, rather than a generic recipe site — was confirmed as appropriate during instructor review. This validated the decision to keep cultural context (origin stories, provenance stories, cultural notes, region/country) as **first-class content fields on every primary entity**, not as an afterthought.
- **Reflection:** that confirmation gave the project a clear north star — every iteration this semester (auth → catalog → recipes → deploy) was scoped against the question *"does this make region-aware culinary knowledge easier to capture and share?"* The next milestone will push the same idea further by promoting `Region` (and ideally `Heritage`) from text fields into first-class entities so they can be browsed and filtered, not just read.

---

## 2. Deliverables status

Statuses: **Not started · In progress · Completed** (= implemented, tested, documented, and deployed).

### Course deliverables

| Deliverable | Status | Link |
|-------------|--------|------|
| Software Requirements Specification | **Completed** | [reports/SRS.md](https://github.com/yaseminyumak/SWE-573/blob/main/reports/SRS.md) |
| Software Design (UML) | **In progress** (use case + class diagram; sequence diagrams ad hoc) | [reports/CulinaryGraph_UseCaseDiagram.drawio](https://github.com/yaseminyumak/SWE-573/blob/main/reports/CulinaryGraph_UseCaseDiagram.drawio) · [reports/class_diagram.mermaid](https://github.com/yaseminyumak/SWE-573/blob/main/reports/class_diagram.mermaid) |
| Scenarios | **Completed** | [reports/User_Scenarios.md](https://github.com/yaseminyumak/SWE-573/blob/main/reports/User_Scenarios.md) |
| Mockups | **Completed** (key flows) | [reports/mock-ups/](https://github.com/yaseminyumak/SWE-573/tree/main/reports/mock-ups) |
| Project Plan, Communication Plan, RACI | **Completed** | [reports/ProjectPlan.md](https://github.com/yaseminyumak/SWE-573/blob/main/reports/ProjectPlan.md) |
| Main contributions write-up | **Completed** | [reports/RELEASE_NOTES.md](https://github.com/yaseminyumak/SWE-573/blob/main/reports/RELEASE_NOTES.md) · [reports/PROJECT_OVERVIEW.md](https://github.com/yaseminyumak/SWE-573/blob/main/reports/PROJECT_OVERVIEW.md) |
| Released software | **Completed** | [Releases](https://github.com/yaseminyumak/SWE-573/releases) |
| Short video demo | **Completed** | [demo.mp4](https://github.com/yaseminyumak/SWE-573/blob/main/demo.mp4) |

### Core functional areas

| Area | Status | Notes |
|------|--------|-------|
| **Recipes** — create, view, browse; ingredients + steps; region association | **Completed** | `RecipeController` (`POST/GET /api/recipes`); recipes carry `country` + tags + origin story; ingredient lines with `quantity` / `unit`; status lifecycle `DRAFT → PUBLISHED → ARCHIVED` |
| **Regions / Locations** — geographic / cultural region per content item | **In progress** | Stored as free-text `region` / `country` fields on techniques, ingredients, and recipes (see `v1.3.0-add-extended-fields.sql`); central region taxonomy (`Region` entity) is not yet a first-class aggregate |
| **Heritage** — food-related cultural heritage linked to recipes/regions | **In progress** | Cultural context captured today via `Recipe.originStory`, `Technique.culturalNotes`, and `Ingredient.provenanceStory`; an explicit `Heritage` entity (with explicit links to Recipes and Regions) is **not yet** implemented |
| **Catalog: Techniques** | **Completed (MVP)** | `TechniqueController` (`/api/catalog/techniques`); supports description, region/country, cultural notes, prerequisites, related techniques/ingredients |
| **Catalog: Ingredients** | **Completed (MVP)** | `IngredientController` (`/api/catalog/ingredients`); supports region/country, seasons, substitutes, provenance story, related techniques |
| **Identity & access (Keycloak)** | **Completed** | OIDC login/register, JWT validation in Spring Security; realm roles mapped to `ROLE_CONTRIBUTOR` / `ROLE_VALIDATOR` |
| **Knowledge Map** (graph view) | **Not started** (UI placeholder only) | Roadmap; data already includes inter-entity relationships needed to bootstrap the view |
| **Search & filters** | **In progress** | Search entry in app shell; advanced server-side filters (by region, season) pending |
| **Moderation / publication workflow** | **In progress** | Domain status lifecycle exists; admin verification UI not implemented |

---

## 3. UX design

### Domain-driven UX choices

- **Cultural context in detail views.** Recipe / technique / ingredient pages surface **origin story**, **cultural notes**, and **provenance story** alongside the “how-to,” reflecting the project’s focus on **cultural heritage**, not just dishes.
- **Region-first metadata.** Every primary entity has **region** and **country** fields visible in lists/detail to support browsing “by place,” which matches the home cook / researcher personas in [`User_Scenarios.md`](https://github.com/yaseminyumak/SWE-573/blob/main/reports/User_Scenarios.md).
- **Substitutions and seasonality.** Ingredients display **culturally appropriate substitutes** and **seasons**, supporting authenticity-aware cooking.
- **Lightweight, mobile-friendly shell.** Top navigation surfaces *Home / Techniques / Ingredients / Recipes* with a single search box; auth state is reflected immediately (Login → Profile / Logout) after Keycloak callbacks.
- **Forms guided by domain shape.** Recipe and ingredient forms guide contributors to the structured fields (steps with order, ingredient lines with quantity/unit, related techniques) so contributions stay consistent.

### Key user flows (mockups)

| Flow | Mockup |
|------|--------|
| Discover content | [homepage.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/homepage.png) |
| Authenticate | [login.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/login.png) · [register.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/register.png) |
| Profile | [profile_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/profile_page.png) |
| Browse/edit techniques | [technique_list_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/technique_list_page.png) · [technique_detail_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/technique_detail_page.png) · [add:edit_technique_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/add%3Aedit_technique_page.png) |
| Browse/edit ingredients | [ingredient_list_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/ingredient_list_page.png) · [ingredient_detail_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/ingredient_detail_page.png) · [add:edit_ingredient_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/add%3Aedit_ingredient_page.png) |
| Create / view recipes | [recipe_list_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/recipe_list_page.png) · [recipe_detail_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/recipe_detail_page.png) · [add:edit_recipe_page.png](https://github.com/yaseminyumak/SWE-573/blob/main/reports/mock-ups/add%3Aedit_recipe_page.png) |

---

## 4. Standard(s) utilized

- **OAuth 2.0 / OpenID Connect (OIDC):** identity and access via **Keycloak**; tokens are JWTs validated by Spring Security on the API side. PKCE is used in secure contexts; the JWT carries `realm_access.roles` mapped to application roles.
- **JSON Web Token (RFC 7519):** access tokens for API authentication.
- **REST + JSON over HTTP:** uniform interface (`/api/...`) with conventional verbs and status codes (`201 Created`, `404 Not Found`, etc.).
- **schema.org alignment (informal):** the recipe model intentionally aligns with [schema.org/Recipe](https://schema.org/Recipe) concepts:  
  - `name` ↔ `title`; `recipeIngredient` ↔ `ingredients[].name (+ quantity/unit)`; `recipeInstructions` ↔ `steps[]`; `totalTime` ↔ `durationMinutes`; `recipeCategory` ↔ `tags`; `inLanguage` / `recipeCuisine` informally captured by `country` / `region`.  
  - This makes the model easy to expose later as **JSON-LD** for SEO / interoperability.
- **ISO geographic naming (informal):** free-text `country` / `region` are written using human-readable names (e.g. *Turkey*, *Oaxaca*); upgrade path is to ISO 3166 (countries) and ISO 3166-2 (subdivisions) when a Region taxonomy lands.
- **Liquibase changelog format** for **versioned schema migrations** (`db.changelog-master.xml` + `v1.x.x-*.sql`).

---

## 5. API documentation

Base URL (local): `http://localhost:8080`  
Base URL (Droplet, served via the SPA Nginx): `http://<host>:5173/api`

All write endpoints require `Authorization: Bearer <Keycloak JWT>`; read endpoints (`GET`) are public per `SecurityConfig`.

### 5.1 Create a recipe — `POST /api/recipes`

Creates a new recipe owned by the authenticated user; recipe starts in `DRAFT`.

**Request**
```http
POST /api/recipes HTTP/1.1
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "title": "Safranbolu Sütlaç",
  "description": "Saffron-infused baked rice pudding from Safranbolu.",
  "difficulty": "MEDIUM",
  "durationMinutes": 90,
  "country": "Turkey",
  "tags": ["dessert", "milk", "saffron"],
  "originStory": "Safranbolu, a UNESCO city built on saffron trade...",
  "associatedTechniqueNames": ["Stovetop simmering", "Oven gratin"],
  "steps": [
    { "order": 1, "instruction": "Bring milk and rice to a gentle simmer." },
    { "order": 2, "instruction": "Bloom saffron in warm milk; add to pot." },
    { "order": 3, "instruction": "Pour into ramekins and bake until top browns." }
  ],
  "ingredients": [
    { "name": "Milk",   "quantity": "1",   "unit": "L" },
    { "name": "Rice",   "quantity": "100", "unit": "g" },
    { "name": "Sugar",  "quantity": "150", "unit": "g" },
    { "name": "Saffron","quantity": "1",   "unit": "pinch" }
  ]
}
```

**Response — `201 Created`**
```json
{
  "id": "8b8d1e7e-2f37-44a5-9cf8-1d20a5e2f6b3",
  "title": "Safranbolu Sütlaç",
  "status": "DRAFT",
  "country": "Turkey",
  "tags": ["dessert", "milk", "saffron"],
  "createdAt": "2026-04-18T09:00:00Z",
  "createdBy": "user-uuid-from-jwt-sub",
  "steps": [{ "order": 1, "instruction": "Bring milk and rice..." }],
  "ingredients": [{ "name": "Milk", "quantity": "1", "unit": "L" }]
}
```

### 5.2 Create an ingredient profile — `POST /api/catalog/ingredients`

**Request**
```http
POST /api/catalog/ingredients HTTP/1.1
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "name": "Saffron",
  "description": "Crocus stigmas used to color and perfume dishes.",
  "region": "Safranbolu",
  "country": "Turkey",
  "seasons": ["AUTUMN"],
  "substitutes": ["Turmeric (color only)"],
  "provenanceStory": "Carried along Ottoman caravan routes; Safranbolu's namesake.",
  "relatedTechniqueNames": ["Blooming in warm liquid"]
}
```

**Response — `201 Created`** (key fields)
```json
{
  "id": "0c4c2d7c-...-...",
  "name": "Saffron",
  "region": "Safranbolu",
  "country": "Turkey",
  "seasons": ["AUTUMN"],
  "status": "DRAFT"
}
```

### 5.3 Create a technique (heritage-bearing know-how) — `POST /api/catalog/techniques`

**Request**
```http
POST /api/catalog/techniques HTTP/1.1
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "name": "Nixtamalization",
  "description": "Alkaline treatment of maize to improve nutrition and flavor.",
  "region": "Oaxaca",
  "country": "Mexico",
  "difficulty": "MEDIUM",
  "culturalNotes": "Central to Mesoamerican foodways for millennia.",
  "prerequisites": "Food-grade lime (cal), maize, sturdy pot.",
  "steps": [
    { "order": 1, "instruction": "Combine maize, water and cal; bring to simmer." },
    { "order": 2, "instruction": "Steep overnight; rinse repeatedly." }
  ],
  "relatedTechniqueNames": ["Masa shaping"],
  "relatedIngredientNames": ["Maize", "Cal"]
}
```

**Response — `201 Created`** (excerpt)
```json
{
  "id": "5e6d...",
  "name": "Nixtamalization",
  "region": "Oaxaca",
  "country": "Mexico",
  "status": "DRAFT",
  "steps": [{ "order": 1, "instruction": "Combine maize..." }]
}
```

### 5.4 Read endpoints (no auth required)

| Method | Path | Returns |
|--------|------|---------|
| `GET` | `/api/recipes` | List recipes |
| `GET` | `/api/recipes/{id}` | Single recipe |
| `GET` | `/api/catalog/ingredients` · `/api/catalog/techniques` | List catalog items |
| `PUT` | `/api/recipes/{id}/archive` (auth) | Archive a recipe (lifecycle) |

---

## 6. Testing

### 6.1 Test plan / strategy

- **Pyramid:** **unit tests** for domain logic (Recipe / Ingredient / Technique state transitions, validation), **integration tests** for application services + JPA repository implementations against a Postgres test instance, **smoke tests** for REST controllers using mocked services / WebMvc test slices.
- **Mock data:** `docker/seed-content.sh` posts realistic ingredients, techniques and recipes against the running API to validate end-to-end behavior and demo content.
- **Manual QA:** scripted UI walkthroughs of the key flows (login → create recipe → list → detail) on the deployed Droplet for each release tag.
- **Frontend:** typecheck (`tsc -b`) is part of the build (run on CI / image build); component-level tests are out of scope for this milestone (planned with **Vitest + Testing Library** in the next iteration).

### 6.2 Test reports

- **Backend unit tests:** Spring Boot test starter is on the classpath; the JUnit 5 entrypoint is [`CulinarygraphBackendApplicationTests`](https://github.com/yaseminyumak/SWE-573/blob/main/culinarygraph-backend/src/test/java/com/yaseminyumak/culinarygraphbackend/CulinarygraphBackendApplicationTests.java). Generate the Surefire report locally:
  ```bash
  cd culinarygraph-backend
  mvn -B test
  # HTML report:
  open target/surefire-reports/index.html
  ```
- **Frontend:** `npm run build` runs `tsc -b && vite build`, which fails the build on TypeScript errors. A **Vitest + Testing Library** suite (run via `npm test`) is planned for the next milestone, alongside the test-coverage improvements listed in §7.3.

> Latest report outputs can be committed under `reports/test-reports/` and linked from this section once they are generated.

---

## 7. Planning

### 7.1 How the project was organized

- **Iterative “mini sprints”** as described in [`ProjectPlan.md`](https://github.com/yaseminyumak/SWE-573/blob/main/reports/ProjectPlan.md): Auth → Techniques → Ingredients → Recipes → Knowledge map → Testing.
- **Branching model:** short-lived feature branches with a small `feat/`, `fix/`, `chore/` prefix, merged via PR (per `.cursor/rules/development-workflow.mdc`).
- **Architecture decisions** are captured in `arch-decisions.md` and reviewed before implementation work begins on a sprint.

### 7.2 Tools

| Concern | Tool |
|---------|------|
| Source control + collaboration | **GitHub** (issues, PRs, releases, wiki) |
| Issue / task tracking | **GitHub Issues** + branch naming convention |
| Build & dependencies | **Maven** (backend), **npm + Vite** (frontend) |
| Database & migrations | **PostgreSQL 16**, **Liquibase** changelog |
| Identity | **Keycloak 24** |
| Containers / deploy | **Docker / Podman Compose**, **DigitalOcean Droplet** |
| Frontend state / data | **TanStack Query**, **React Router** |
| Styling | **Tailwind CSS** |
| Editor / agent | **Cursor IDE** with `.cursor/rules/` for workflow consistency |

### 7.3 Reflections

**What worked well**

- **Architecture-first.** Capturing the modular monolith / DDD layering decisions in `arch-decisions.md` *before* coding meant every sprint started with a shared mental model (which module owns this? which layer?), and module boundaries (`catalog`, `recipe`, `identity`, `search`) stayed clean as features were added.
- **Small branches and PRs.** Following the `feat/` `fix/` `chore/` convention with a PR per slice (see PR list below) kept reviews tractable, made the merge history a readable changelog, and made it easy to revert when something broke (e.g. several `feat/deploy-digital-ocean` PRs are isolated fixes).
- **Early Keycloak integration.** Wiring OIDC / JWT into the backend and frontend in the very first iteration (PR [#17](https://github.com/yaseminyumak/SWE-573/pull/17)) avoided "auth borç" later — every new endpoint and screen was built knowing how identity, roles, and tokens flow.
- **Reproducible infra with Docker Compose.** A single `docker compose up -d` brings up Postgres, Keycloak, backend, and frontend the same way locally and on the Droplet, which paid off enormously during deployment debugging.

**What to improve next**

- **Automated test coverage.** Add real backend integration tests (Testcontainers + Postgres) and a frontend Vitest + Testing Library suite, so regressions show up in CI rather than during demos.
- **CI/CD.** Add a GitHub Actions pipeline that runs `mvn verify` and the frontend build/test on every PR, and (optionally) builds + pushes Docker images on tag.
- **Search / filter UX.** Promote region- and season-based filtering to first-class UI affordances, so "browse by place" becomes a primary entry point and not just a side-effect of the data model.

**Detailed plan:** [`reports/ProjectPlan.md`](https://github.com/yaseminyumak/SWE-573/blob/main/reports/ProjectPlan.md). The plan was tracked through **GitHub Issues + branch naming** (no separate Project board), so each `feat/...` / `chore/...` branch ties directly to its issue and merged PR.

---

## 8. Individual contributions

### Member: Yasemin Yumak

- **Responsibilities:** Project owner / sole developer — product scoping, requirements, architecture, backend, frontend, identity (Keycloak), database & migrations, infrastructure, DigitalOcean deployment, and documentation.
- **Main contributions:**
  - Defined the product scope (region-aware culinary knowledge: techniques, ingredients, recipes) and produced the [SRS](https://github.com/yaseminyumak/SWE-573/blob/main/reports/SRS.md), [user scenarios](https://github.com/yaseminyumak/SWE-573/blob/main/reports/User_Scenarios.md), [class diagram](https://github.com/yaseminyumak/SWE-573/blob/main/reports/class_diagram.mermaid), [use case diagram](https://github.com/yaseminyumak/SWE-573/blob/main/reports/CulinaryGraph_UseCaseDiagram.drawio) and [project plan](https://github.com/yaseminyumak/SWE-573/blob/main/reports/ProjectPlan.md).
  - Designed the **modular monolith** with DDD-style layering (`catalog`, `recipe`, `identity`, `search`), captured in `arch-decisions.md`.
  - Implemented the backend (Spring Boot): domain, application services, REST API, Liquibase schema migrations for **Techniques**, **Ingredients**, and **Recipes** (incl. extended cultural-context fields).
  - Implemented the React SPA (Vite + Tailwind + TanStack Query) and the **Keycloak**-backed auth UX (login, register, role-aware actions), including PKCE + `randomUUID` polyfill workarounds for HTTP / public-IP contexts.
  - Built the full **Docker Compose** stack and deployed it to a **DigitalOcean Droplet**; cut the [`1.0.0-alpha` release](https://github.com/yaseminyumak/SWE-573/releases) and recorded the [demo video](https://github.com/yaseminyumak/SWE-573/blob/main/demo.mp4).
- **API contribution (back-end):** **`POST /api/recipes`** — the most composite endpoint in the system. The controller accepts a `CreateRecipeRequest` and the `RecipeService` builds the `Recipe` aggregate (validating steps order, ingredient lines, lifecycle status), wires the authenticated user from the JWT (`sub` claim → `createdBy`), persists via JPA + Liquibase-managed tables (`recipes`, `recipe_steps`, `recipe_ingredients`, `recipe_tags`, `recipe_associated_techniques`), and returns `201 Created` with the full `RecipeResponse` (including server-assigned `id`, `status=DRAFT`, `createdAt`). It is consumed by the "Add recipe" form on the SPA. The full request/response example is in §5.1, and the source is [`RecipeController.create`](https://github.com/yaseminyumak/SWE-573/blob/main/culinarygraph-backend/src/main/java/com/yaseminyumak/culinarygraphbackend/recipe/api/RecipeController.java).
- **Code-related significant PRs:**
  - [PR #14](https://github.com/yaseminyumak/SWE-573/pull/14) — Backend initialization (Spring Boot, JPA, Security, Liquibase, package skeleton).
  - [PR #16](https://github.com/yaseminyumak/SWE-573/pull/16) — Frontend initialization (React + Vite + Tailwind + TanStack Query + router).
  - [PR #17](https://github.com/yaseminyumak/SWE-573/pull/17) — Keycloak integration end-to-end (OAuth2 resource server, role mapping, frontend `keycloak-js`, Docker support).
  - [PR #19](https://github.com/yaseminyumak/SWE-573/pull/19) — Recipe management (domain, service, controller, DTOs, frontend form + list).
  - [PR #31](https://github.com/yaseminyumak/SWE-573/pull/31) — Catalog: Ingredient + Technique APIs and DTOs.
  - **Deploy / hardening series** (`feat/deploy-digital-ocean`): [PR #21](https://github.com/yaseminyumak/SWE-573/pull/21) Docker / Maven SSL, [PR #22](https://github.com/yaseminyumak/SWE-573/pull/22) frontend Keycloak init error handling, [PR #23](https://github.com/yaseminyumak/SWE-573/pull/23) PKCE based on secure context, [PR #24](https://github.com/yaseminyumak/SWE-573/pull/24) typed root container fix, [PR #25](https://github.com/yaseminyumak/SWE-573/pull/25) `crypto.randomUUID` polyfill, [PR #26](https://github.com/yaseminyumak/SWE-573/pull/26) Keycloak HTTP/dev SSL bootstrap, [PR #27](https://github.com/yaseminyumak/SWE-573/pull/27) README + Keycloak realm redirect URIs.
- **Non-code-related significant PRs / issues:**
  - [PR #4](https://github.com/yaseminyumak/SWE-573/pull/4) — SRS authored (`reports/SRS.md`).
  - [PR #7](https://github.com/yaseminyumak/SWE-573/pull/7) — User scenarios.
  - [PR #9](https://github.com/yaseminyumak/SWE-573/pull/9) and [PR #13](https://github.com/yaseminyumak/SWE-573/pull/13) — Class diagram (initial + Recipe aggregate update).
  - [PR #28](https://github.com/yaseminyumak/SWE-573/pull/28) and [PR #29](https://github.com/yaseminyumak/SWE-573/pull/29) — Mockup additions / iteration for key flows.
  - Project plan in Markdown (commit [`97f0eb6`](https://github.com/yaseminyumak/SWE-573/commit/97f0eb6)); central deliverables index (commit [`8f0467a`](https://github.com/yaseminyumak/SWE-573/commit/8f0467a)); release notes (commit [`74c47d4`](https://github.com/yaseminyumak/SWE-573/commit/74c47d4)).
- **Pull requests — process notes:** Every PR was opened from a short-lived feature branch (`feat/...` · `fix/...` · `chore/...`), self-reviewed against `arch-decisions.md`, then merged to `main` via GitHub's merge-commit (preserved in the history above). The Droplet rollout was intentionally split into many small `feat/deploy-digital-ocean` PRs (#21–#27) so each compatibility fix (Maven SSL, Keycloak HTTP, PKCE, polyfill, redirect URIs) could be reviewed and reverted independently if needed; merge conflicts were minor and resolved at PR time before merging.
- **Additional information:** Authored the [release notes](https://github.com/yaseminyumak/SWE-573/blob/main/reports/RELEASE_NOTES.md), the [deliverables index](https://github.com/yaseminyumak/SWE-573/blob/main/DELIVERABLES_INDEX.md), this milestone review, and recorded the [demo video](https://github.com/yaseminyumak/SWE-573/blob/main/demo.mp4); also wrote the seed script (`docker/seed-content.sh`) used to populate the demo environment.

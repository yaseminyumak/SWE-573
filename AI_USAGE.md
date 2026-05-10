# AI Usage Disclosure — CulinaryGraph (SWE-573)

This file documents **AI-assisted work that was actually used** in this repository, per course policy. Human authors reviewed, edited, and verified all material before it was merged or submitted.

---

## What was done (by artifact type)

### Documentation and project reports

**Tool:** Cursor (Composer / agent-style assistance)  

**Used for:** Drafting and revising Markdown under `reports/` and small README cross-links—for example expanding [ProjectPlan.md](reports/ProjectPlan.md) (phased timeline, unified work-breakdown table with BL/DG IDs, milestones), restructuring [USER_MANUAL.md](reports/USER_MANUAL.md) (flows, deployed URL, feature descriptions), and aligning deliverable indexes with the SRS.  

**Reliance:** Partial to major generation of prose and tables; factual claims and dates were checked against the real product and calendar.  

**Validation:** Manual read-through; link and path checks; edits applied after review so the text matched implemented behavior and assignment wording.

---

### Diagrams (software design)

**Tool:** Cursor  

**Used for:** Authoring and iterating [class_diagram.mermaid](reports/class_diagram.mermaid) (Mermaid class diagram: entities, relationships, readability); earlier exploratory PlantUML wording in chat was not kept as a separate committed artifact—the Mermaid source in `reports/` is the submitted form.  

**Reliance:** Partial generation (structure and labels from the codebase); several revision passes for Mermaid Live compatibility and layout.  

**Validation:** Compared to JPA entities and APIs in `culinarygraph-backend`; diagram rendered in Mermaid Live / editor preview; inconsistencies (e.g. reserved words, cardinality) fixed manually.

---

### Source code

**Tool:** Claude  

**Used for:** Assistance during implementation of the Spring Boot backend (`culinarygraph-backend/`) and the React frontend (`culinarygraph-frontend/`)—including scaffolding, endpoints, UI components, refactors, and bug fixes as the feature set grew.  

**Reliance:** Partial to major generation depending on the file or feature; the author integrated suggestions, renamed symbols to match project conventions, and trimmed scope where needed.  

**Validation:** Local builds (`mvn`, frontend bundler), manual exercise of main flows (auth, catalog CRUD, recipes, social), and code review before commits; server-side rules (e.g. ownership) were verified against the SRS and Keycloak behavior.

---

### Test and synthetic data

**Tool:** Claude **Opus 4.6**  

**Used for:** Drafting and refining **synthetic seed content** used to populate the app for demos and manual testing—for example scripted or structured content in [docker/seed-content.sh](docker/seed-content.sh) (and related data shaped for Postgres/REST).  

**Reliance:** Major generation of example names, descriptions, and relationships; treated as **non-production fiction** only.  

**Validation:** No real personal data; scripts run against local/docker DB; spot-checks in the UI that seeded entities list, filter, and link correctly; edits applied where tone or fields did not match the schema.

---

## What was not AI-generated here

- **UI mockups** under `reports/mock-ups/` were produced in **Balsamiq** (human design), not by generative AI.

---

*This disclosure is accurate to the best of the authors' knowledge and does not replace the institution's academic integrity policy.*

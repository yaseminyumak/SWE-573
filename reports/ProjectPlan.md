# Project Plan — CulinaryGraph

**Project name:** CulinaryGraph  
**Project start:** 10 February 2026  
**Target completion:** 10 May 2026  
**Calendar length:** 13 weeks (89 days)  
**Approach:** Iterative delivery aligned with [SRS](SRS.md) functional (**FR-1–FR-21**) and non-functional (**NFR-1–NFR-12**) requirements.

---

## 0. Traceability and status conventions

| Column / term | Meaning |
|----------------|---------|
| **Requirements** | One or more SRS IDs this work satisfies or supports (design/testing may reference many FRs). |
| **Status** | `Done` — delivered in repo or docs; `In progress` — active; `Planned` — scheduled before end date; `Optional` — stretch or post–May 10 per SRS notes. |
| **Deadline** | Target finish date (YYYY-MM-DD). |

Requirement summary (full text in [SRS](SRS.md)):

| Group | IDs |
|--------|-----|
| Identity & access | FR-1, FR-2, FR-3 |
| Techniques | FR-4, FR-5, FR-6, FR-7 |
| Ingredients | FR-8, FR-9, FR-10, FR-11 |
| Recipes | FR-12, FR-13, FR-14, FR-15, FR-16 |
| Associations & geography | FR-17 |
| Discovery (home) | FR-18 |
| Engagement | FR-19, FR-20 |
| Authorship / attribution | FR-21 |
| Non-functional | NFR-1–NFR-12 |

---

## 1. Phases & timeline (10 Feb – 10 May 2026)

| Phase | Calendar window | Weeks (approx.) | Focus | Key outputs |
|--------|------------------|-----------------|--------|-------------|
| **P1 — Requirements & analysis** | 10 Feb – 23 Feb | W1–W2 | Lock scope, personas, scenarios; functional & NFR baseline | [SRS](SRS.md), [User_Scenarios](User_Scenarios.md), backlog |
| **P2 — Design & modeling** | 24 Feb – 16 Mar | W3–W4 | Architecture, UI/UX, UML; stack choices | Design notes, [mock-ups](mock-ups/), diagrams under `reports/` |
| **P3 — Core implementation I** | 17 Mar – 05 Apr | W5–W7 | Auth, catalog, recipes backbone | Keycloak, techniques, ingredients, recipes API + UI |
| **P4 — Core implementation II** | 06 Apr – 27 Apr | W8–W10 | Discovery, cross-links, social, ownership | Home (FR-18), FR-16 navigation, FR-19–FR-21 |
| **P5 — Hardening & closure** | 28 Apr – 10 May | W11–W13 | Testing, documentation, deploy, demo | Test notes, [USER_MANUAL](USER_MANUAL.md), [MILESTONE_REVIEW](MILESTONE_REVIEW.md), [RELEASE_NOTES](RELEASE_NOTES.md), release tag, `demo.mp4` |

---

## 1.1 Milestones (with target dates)

| ID | Milestone | Target date | Success criteria (examples) |
|----|------------|-------------|-----------------------------|
| M1 | Requirements approved | 2026-02-23 | SRS + scenarios reviewed; backlog REQ IDs filled |
| M2 | Design completed | 2026-03-16 | Mockups + UML set (use case, class, sequence) linked in [DELIVERABLES_INDEX](../DELIVERABLES_INDEX.md) |
| M3 | Core catalog & recipes | 2026-04-13 | FR-4–FR-15 demonstrable end-to-end |
| M4 | Discovery & engagement | 2026-04-27 | FR-16–FR-21 addressed per product scope |
| M5 | Final submission | 2026-05-10 | Deployed app, manual, milestone review, demo, release tag |

---

## 2. Work breakdown (all tasks)

All rows are traceable to [SRS](SRS.md) requirements (**BL** = product / delivery, **DG** = design & UML). Status is **Done** for the May 2026 submission scope.

| ID | Task | Deliverable | Requirements | Status | Deadline |
|----|------|-------------|--------------|--------|----------|
| BL-01 | Software Requirements Specification | [SRS](SRS.md) | FR-1–FR-21, NFR-1–NFR-12 | Done | 2026-02-23 |
| BL-02 | User scenarios & personas | [User_Scenarios](User_Scenarios.md) | FR-1–FR-21 (acceptance narratives) | Done | 2026-02-23 |
| BL-03 | Project plan, communication, RACI | [ProjectPlan.md](ProjectPlan.md) (this file) | Course plan, traceability | Done | 2026-02-28 |
| BL-04 | Deliverables index & repo hygiene | [DELIVERABLES_INDEX](../DELIVERABLES_INDEX.md) | Documentation (SRS §4.1) | Done | 2026-03-02 |
| BL-05 | Containerized stack (Postgres, Keycloak, app) | `docker/` | FR-2–FR-3, NFR-7, NFR-9 | Done | 2026-03-09 |
| BL-06 | Guest register / login / logout (Keycloak) | App + Keycloak (PKCE / session) | FR-1, FR-2, FR-3 | Done | 2026-03-16 |
| BL-07 | Technique create/read/update/delete (owner) | Backend + frontend catalog | FR-4, FR-7, FR-17, FR-21 | Done | 2026-03-23 |
| BL-08 | Technique search & filters | List + filter UI | FR-5, NFR-1, NFR-5 | Done | 2026-03-23 |
| BL-09 | Technique detail view | Detail page | FR-6 | Done | 2026-03-23 |
| BL-10 | Ingredient create/read/update/delete (owner) | Backend + frontend catalog | FR-8, FR-11, FR-17, FR-21 | Done | 2026-03-30 |
| BL-11 | Ingredient search & filters | List + filter UI | FR-9, NFR-1, NFR-5 | Done | 2026-03-30 |
| BL-12 | Ingredient detail view | Detail page | FR-10 | Done | 2026-03-30 |
| BL-13 | Recipe create/read/update/delete (owner) | Backend + frontend recipes | FR-12, FR-15, FR-17, FR-21 | Done | 2026-04-13 |
| BL-14 | Recipe search & filters | List + filter UI | FR-13, NFR-1, NFR-5 | Done | 2026-04-13 |
| BL-15 | Recipe detail + links to catalog | Detail + deep links | FR-14, FR-16 | Done | 2026-04-13 |
| BL-16 | Homepage highlighted / recent content | Home view | FR-18 | Done | 2026-04-20 |
| BL-17 | Comments on recipe / technique / ingredient | Social API + UI | FR-19 | Done | 2026-04-27 |
| BL-18 | Likes + aggregate count (per entity) | Social API + UI | FR-20 | Done | 2026-04-27 |
| BL-19 | Contributor identity on list & detail | `createdBy` + profile link where applicable | FR-21 | Done | 2026-04-20 |
| BL-20 | Server-side ownership enforcement | Services / controllers | FR-3, FR-7, FR-11, FR-15, NFR-8 | Done | 2026-04-13 |
| BL-21 | Knowledge map (geo exploration) | Home / map UX | FR-5, FR-9, FR-13, FR-18 (interpretation) | Done | 2026-05-05 |
| BL-23 | User manual (end user) | [USER_MANUAL](USER_MANUAL.md) | SRS §4.1 documentation | Done | 2026-05-06 |
| BL-24 | Developer README & API notes | Repo `README`, [MILESTONE_REVIEW](MILESTONE_REVIEW.md) | SRS §4.1, NFR-11 | Done | 2026-05-06 |
| BL-25 | Milestone / course review document | [MILESTONE_REVIEW](MILESTONE_REVIEW.md) | All FR/NFR (status) | Done | 2026-05-09 |
| BL-26 | Release tag & release notes | [RELEASE_NOTES](RELEASE_NOTES.md) | Delivery | Done | 2026-05-10 |
| BL-27 | Short video demo | `demo.mp4` | Submission | Done | 2026-05-10 |
| BL-28 | Production deploy (e.g. culinary.page) | Hosted deployment | NFR-7, NFR-9 | Done | 2026-05-10 |
| DG-01 | Use case diagram | [CulinaryGraph_UseCaseDiagram.drawio](CulinaryGraph_UseCaseDiagram.drawio) | FR-1–FR-21 (actor goals), NFR-3 (UI roles) | Done | 2026-03-09 |
| DG-02 | Class diagram (persistence / domain) | [class_diagram.mermaid](class_diagram.mermaid), [class_diagram.png](class_diagram.png) | FR-4–FR-20 data shape, FR-17 associations, NFR-8 ownership fields, NFR-11 extensibility | Done | 2026-03-12 |
| DG-03 | Sequence diagram — contributor creates recipe | [add-recipe-sequence.png](add-recipe-sequence.png) | FR-12, FR-15, FR-17, NFR-8 | Done | 2026-03-16 |
| DG-04 | UI mockups (Balsamiq / PNG) | [mock-ups/](mock-ups/) | FR-3, FR-5–FR-6, FR-9–FR-10, FR-13–FR-14, FR-18, NFR-3–NFR-5 | Done | 2026-03-16 |
| DG-05 | Architecture / stack decision log | Working notes under `.cursor/` (not a formal graded deliverable path) | NFR-9–NFR-12 | Done | 2026-03-20 |

---

## 3. High-level calendar (Gantt-style reference)

*Week rows use Mondays for alignment; exact anchors are the deadlines in §2.*

| Week starting (Mon) | Phase | Highlight |
|---------------------|--------|-----------|
| 2026-02-09 | P1 | Kickoff, SRS, scenarios |
| 2026-02-16 | P1 | Requirements freeze target |
| 2026-02-23 | P2 | Design sprint: diagrams + mockups |
| 2026-03-02 | P2 | UML package complete (DG-01–DG-03) |
| 2026-03-09 | P2 / P3 | Stack hardening, auth integration |
| 2026-03-16 | P3 | Techniques vertical slice |
| 2026-03-23 | P3 | Ingredients vertical slice |
| 2026-03-30 | P3 | Recipes vertical slice start |
| 2026-04-06 | P4 | Recipes completion, cross-navigation |
| 2026-04-13 | P4 | Homepage, attribution |
| 2026-04-20 | P4 | Social (comments, likes) |
| 2026-04-27 | P4 | Feature complete buffer |
| 2026-05-04 | P5 | Docs, tests, deploy |
| 2026-05-10 | P5 | **Final submission** |

---

## 4. Communication plan

### 4.1 Stakeholders

- Project owner (student)  
- Instructor  
- Peer reviewers / classmates  

### 4.2 Communication matrix

| Communication type | Frequency | Medium | Audience | Purpose |
|--------------------|-----------|--------|----------|---------|
| Weekly progress update | Weekly | Email / docs / class | Instructor | Progress & blockers |
| Design review | Once (design phase) | Class / document | Instructor | Validate UI/UX |
| Milestone review | At each milestone | Class | Instructor | Approval |
| Issue tracking | Continuous | GitHub Issues | Self | Trace §2 task IDs (BL / DG) / REQ IDs |

### 4.3 Tools

- **Documentation** → Markdown in repo (`reports/`)  
- **Design** → Balsamiq / mockup PNGs  
- **Development** → GitHub  
- **Communication** → Email / in class  

---

## 5. RACI matrix

### 5.1 Roles

- **R:** Responsible  
- **A:** Accountable  
- **C:** Consulted  
- **I:** Informed  

### 5.2 RACI

| Task | You (PM/Dev) | Instructor |
|------|----------------|------------|
| Requirements analysis | R/A | C |
| System design & diagrams | R/A | C |
| UI/UX design | R | C |
| Development (work breakdown §2) | R | I |
| Testing | R | I |
| Documentation | R/A | C |
| Final course approval | I | A |

---

## 6. Requirement ↔ work breakdown map

| Requirement | Primary tasks (BL / DG) |
|-------------|----------------------|
| FR-1 – FR-3 | BL-06, BL-20 |
| FR-4 – FR-7 | BL-07 – BL-09 |
| FR-8 – FR-11 | BL-10 – BL-12 |
| FR-12 – FR-16 | BL-13 – BL-15 |
| FR-17 | BL-07, BL-10, BL-13 |
| FR-18 | BL-16, BL-21 (if map on home) |
| FR-19 | BL-17 |
| FR-20 | BL-18 |
| FR-21 | BL-19 |
| NFR-1 – NFR-2 | BL-08, BL-11, BL-14 (search/list UX) |
| NFR-3 – NFR-5 | DG-01–DG-05, BL-08, BL-11, BL-14 (UX) |
| NFR-6 – NFR-8 | BL-06, BL-20 (Keycloak / server authz) |
| NFR-9 – NFR-10 | BL-05, BL-28 |
| NFR-11 – NFR-12 | BL-24, stack choices |

---

*This plan combines phased timeline, milestones, a single traceable work breakdown (§2, BL-xx and DG-xx), and explicit SRS cross-references.*

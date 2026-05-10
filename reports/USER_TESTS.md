# User Tests — CulinaryGraph

Manual test cases for **acceptance** and **regression** checks from an end-user perspective. They align with the [SRS](SRS.md) functional requirements (FR-xx), the [User Manual](USER_MANUAL.md), and the journeys in [User Scenarios](User_Scenarios.md).

---

## Test scenarios

| Scope | ID | Preconditions | Steps | Expected | Status | SRS |
| --- | --- | --- | --- | --- | --- | --- |
| Authentication and session | UT-AUTH-01 | Guest | Open app; use **Login / Register**; complete **Register** with valid data. | Account is created per Keycloak flow; user ends signed in or is prompted to sign in successfully. | success | FR-1, FR-2 |
| Authentication and session | UT-AUTH-02 | Guest | Open **Login / Register**; sign in with valid Contributor credentials. | Session established; header shows **Profile** and **Logout**. | success | FR-2 |
| Authentication and session | UT-AUTH-03 | Signed in | Click **Logout**. | Session ends; **Login / Register** visible again; protected create/edit actions not available as Guest. | success | FR-2, FR-3 |
| Guest: browse, search, filters | UT-NAV-01 | Guest | From header, open **Home**, **Techniques**, **Ingredients**, **Recipes** in turn. | Each route loads without error; list or home content visible. | success | FR-3, FR-18 |
| Guest: browse, search, filters | UT-NAV-02 | Guest | On **Home**, confirm **highlighted** and/or **recently added** sections show entries when seed data exists. | Sections render expected entities or empty state is clear. | success | FR-18 |
| Guest: browse, search, filters | UT-SEA-01 | Guest | Use header **search**; enter a keyword known to exist in a title/name; submit. | **Search** page shows grouped results (recipes, techniques, ingredients) or empty state; clicking a row opens detail. | success | FR-3, FR-5, FR-9, FR-13 |
| Guest: browse, search, filters | UT-FLT-01 | Guest | Open **Techniques**; apply **country** and/or **region** (and text if present); observe list. | List only shows matching items; **clear filters** resets the list. | success | FR-5, NFR-5 |
| Guest: browse, search, filters | UT-FLT-02 | Guest | Open **Ingredients**; apply **season** and/or region/country filters. | List reflects filters; clear works. | success | FR-9, NFR-5 |
| Guest: browse, search, filters | UT-FLT-03 | Guest | Open **Recipes**; apply **difficulty**, **tags**, or other shown filters. | List reflects filters; clear works. | success | FR-13, NFR-5 |
| Detail views and cross-navigation | UT-DTL-01 | Guest | Open a **technique** that has related ingredients recorded. | Detail shows stored fields (name, steps, country, region, notes, prerequisites, photos if any) and **related ingredients** where linked. | success | FR-6 |
| Detail views and cross-navigation | UT-DTL-02 | Guest | Open an **ingredient** that has related techniques. | Detail shows ingredient fields and **related techniques** where linked. | success | FR-10 |
| Detail views and cross-navigation | UT-DTL-03 | Guest | Open a **recipe** with steps, ingredient lines, tags, origin story, photos if any. | All provided fields visible per recipe detail spec. | success | FR-14 |
| Detail views and cross-navigation | UT-LNK-01 | Guest | From a recipe detail, select a **linked technique** or **linked catalog ingredient** (when UI exposes links). | Browser navigates to the correct technique or ingredient detail page. | success | FR-16 |
| Detail views and cross-navigation | UT-ATT-01 | Guest | Open list and detail for a technique, ingredient, and recipe that expose creator identity. | **Authorship** (or contributor display name) visible where backend provides it. | success | FR-21 |
| Contributor: recipes | UT-REC-01 | Contributor | **Recipes** → **Add recipe**; fill required fields (title, difficulty, steps, ingredient lines); optionally tags, origin story, associated techniques; submit. | Recipe persists; redirect to list or detail; new row visible. | success | FR-12, FR-17 |
| Contributor: recipes | UT-REC-02 | Contributor, owns recipe | Open own recipe detail → **Edit**; change fields; save. | Updates persist on reload. | success | FR-15 |
| Contributor: recipes | UT-REC-03 | Contributor, owns recipe | Delete own recipe (if UI offers delete). | Entry removed or clearly archived per product behavior. | success | FR-15 |
| Contributor: recipes | UT-REC-04 | Contributor | Open another user’s recipe detail. | **Edit**/delete for that entity are not offered, or server rejects unauthorized actions. | success | FR-15, NFR-8 |
| Contributor: techniques | UT-TEC-01 | Contributor | **Add technique** with name, steps, country, region, cultural notes; optional photos, prerequisites, **related ingredients** from picker; submit. | Technique appears in list and detail with associations where supported. | success | FR-4, FR-17 |
| Contributor: techniques | UT-TEC-02 | Contributor, owns technique | Edit and save own technique. | Changes persist. | success | FR-7 |
| Contributor: techniques | UT-TEC-03 | Contributor | Attempt to edit/delete a technique owned by another user (via URL or UI if exposed). | Operation denied consistently (UI and/or API error). | success | FR-7, NFR-8 |
| Contributor: ingredients | UT-ING-01 | Contributor | **Add ingredient** with name, country, region(s), seasonality, sourcing notes, substitutions; optional **related techniques**; submit. | Profile appears in list and detail. | success | FR-8, FR-17 |
| Contributor: ingredients | UT-ING-02 | Contributor, owns profile | Edit and save own ingredient. | Changes persist. | success | FR-11 |
| Contributor: ingredients | UT-ING-03 | Contributor | Attempt to edit/delete another user’s ingredient profile. | Operation denied. | success | FR-11, NFR-8 |
| Profile and ownership | UT-PRF-01 | Contributor | Open **Profile** (or equivalent). | Lists or summarizes **own** techniques, ingredients, and recipes for management per user manual. | success | FR-3, FR-7, FR-11, FR-15 |
| Homepage Knowledge Map | UT-MAP-01 | Guest | On **Home**, interact with **Knowledge Map**. | The user can select a country on the map, choose **Explore**, and see content for that country. | success | Discovery (see USER_MANUAL section 3.4) |


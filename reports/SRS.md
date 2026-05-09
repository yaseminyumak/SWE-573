# Software Requirements Specification — CulinaryGraph

## 1. System Features (Functional Requirements)

### 1.1 Identity and Access

- **FR-1** — The system shall allow a Guest to register for an account (e.g. using email and password or other defined identity providers).  
- **FR-2** — The system shall allow a registered user to log in and log out, and shall maintain a session for an authenticated user.  
- **FR-3** — The system shall enforce role-based access: **Guest** (browse, search where implemented, register, and view techniques, ingredients, and recipes), **Contributor** (add, edit, and delete their own techniques, ingredient profiles, and recipes, and use relationship or association controls provided by the forms).

### 1.2 Techniques

- **FR-4** — The system shall allow a Contributor to add a technique with at least: **name**, **steps** (ordered instructions), **photos** (optional images attached to the technique), **country**, **region**, **cultural or contextual notes**, **optional prerequisites**, and **optional related ingredients** (linked to catalog ingredient entries where the feature is supported).  
- **FR-5** — The system shall allow users to search and filter techniques (e.g. by text, region, country).  
- **FR-6** — The system shall provide a technique detail view showing all stored fields for the technique and related ingredients where recorded.  
- **FR-7** — The system shall allow a Contributor to edit and delete only the techniques they have created.

### 1.3 Ingredients

- **FR-8** — The system shall allow a Contributor to add an ingredient profile with at least: **name**, **country**, **region(s)**, **seasonality**, **traditional sourcing or usage notes**, **culturally appropriate substitutions**, and **optional related techniques** (linked to catalog technique entries where the feature is supported).  
- **FR-9** — The system shall allow users to search and filter ingredient profiles (e.g. by text, region, or season).  
- **FR-10** — The system shall provide an ingredient detail view showing all stored fields and related techniques.  
- **FR-11** — The system shall allow a Contributor to edit and delete only the ingredient content they have created.

### 1.4 Recipes

- **FR-12** — The system shall allow a Contributor to add a recipe with at least: title, description, difficulty, duration, ordered preparation steps, and a list of ingredients; for each ingredient line the system shall support optional substitution notes. The system shall support optional tags, optional photos, and an optional origin or provenance story.  
- **FR-13** — The system shall allow users to search and filter recipes (e.g. by text, tags, difficulty, or other defined criteria).  
- **FR-14** — The system shall provide a recipe detail view showing stored fields (including steps, ingredients, optional tags, photos, and origin story where provided).  
- **FR-15** — The system shall allow a Contributor to edit and delete only the recipes they have created.  
- **FR-16** — From a recipe detail view (or equivalent recipe presentation), when the user selects a **linked technique name** or a **linked ingredient name** that corresponds to catalog content, the system shall navigate to the corresponding technique or ingredient detail page.

### 1.5 Data Entry and Associations

- **FR-17** — When creating or editing techniques, ingredient profiles, or recipes, the system shall allow the user to specify **country** (and **region** where applicable) and to associate content with **existing catalog ingredients** and **existing catalog techniques** where those association features are provided (e.g. pickers, multi-select, or relationship fields).

### 1.6 Discovery and Navigation

- **FR-18** — The system shall provide a homepage that displays highlighted and/or recently added techniques, ingredients, and recipes.

### 1.7 Attribution and authorship

- **FR-21** — The system shall display **authorship or contributor identity** for each technique, ingredient profile, and recipe in **list and detail** contexts where the information is available (e.g. display name or username derived from the identity provider, and/or a link to the contributor’s profile when a profile view exists). Guests and authenticated users shall be able to see who created the entry (and, where the product exposes it, who last updated it), consistent with the identity provider and any applicable privacy constraints.

### 1.8 Engagement (Comments and Likes)

- **FR-19** — The system shall allow authenticated users to **comment** on techniques, ingredient profiles, and/or recipes (e.g. a comment thread or list per entity), subject to authentication and basic validation (e.g. length limits, empty comment rejection).  
- **FR-20** — The system shall allow authenticated users to **like** (or positively rate) techniques, ingredient profiles, and/or recipes; the system shall persist likes per user where duplicate likes are not allowed, and shall display an **aggregated like count** (or clear like state) on the relevant detail or list views.

*Implementation note:* **FR-19** and **FR-20** are specified for product completeness; they may be delivered in a **future release** after the core catalog and recipe flows are stable. Traceability to these requirements should be recorded in the issue tracker when work begins. **FR-21** (authorship) is expected to ship together with visible catalog and recipe content: wherever the backend exposes creator (or updater) identity, the UI shall surface it on list and detail views unless a field is genuinely unavailable.

---

## 2. External Interface Requirements

### 2.1 User Interfaces

- The system shall provide a web-based user interface.  
- The interface shall adapt to the user's role (Guest vs Contributor), for example through role-appropriate menus and actions (e.g. Contributors see controls to add or edit their own content when signed in).

### 2.2 Hardware, Software, and Communication Interfaces

- **Hardware:** No specific hardware requirements beyond that needed to run a modern web browser and to host the application and database.  
- **Software:** The client shall run in a supported web browser; the server stack is to be determined.  
- **Communication:** The application shall use standard web protocols (e.g. HTTP/HTTPS). Use of a REST or similar API for future or external integration may be assumed at a high level; details are TBD.

---

## 3. Non-Functional Requirements

### 3.1 Performance

- **NFR-1** — Search results shall be returned within an acceptable time (e.g. within 2–3 seconds under normal load).  
- **NFR-2** — Page loads shall complete within an acceptable time (e.g. under 3 seconds under normal conditions).

### 3.2 Usability

- **NFR-3** — The user interface shall be designed for the target users, including home cooks who may not be familiar with technical terminology; labels and navigation shall be clear and consistent.  
- **NFR-4** — The application shall be usable on **desktop** devices with a clear, readable layout.  
- **NFR-5** — Search and filters (e.g. by region, season, country, or text) shall be easily discoverable and usable within the main flows (e.g. list pages or dedicated search where implemented).

### 3.3 Security and Privacy

- **NFR-6** — User passwords shall be stored using a secure one-way hashing mechanism (e.g. bcrypt or Argon2); plain-text passwords shall not be stored.  
- **NFR-7** — Sessions shall be conducted over HTTPS where possible, and session cookies shall use secure and appropriate settings.  
- **NFR-8** — Only the **content owner** shall be permitted to edit or delete a given technique, ingredient profile, or recipe; the system shall enforce this authorization on the server.

### 3.4 Reliability and Data

- **NFR-9** — User-contributed data shall be stored persistently; the system shall support or assume regular backups so that content can be recovered after a failure.  
- **NFR-10** — Data-modifying operations shall preserve consistency (e.g. use of transactions where multiple related updates are performed).

### 3.5 Maintainability and Compatibility

- **NFR-11** — The data model and architecture shall be extensible so that new relationship types or additional fields can be added without disproportionate rework.  
- **NFR-12** — The web application shall support recent **major versions of common desktop browsers** (e.g. the last two major versions of Chrome, Firefox, Safari, Edge).

---

## 4. Other Requirements

### 4.1 Documentation

- User-facing documentation (e.g. how to add a technique, how to use search and filters) should be available to support adoption.  
- Developer documentation (e.g. setup, architecture, API if any) should be maintained to support development and maintenance.

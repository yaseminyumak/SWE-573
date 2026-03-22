# Software Requirements Specification — CulinaryGraph

## 1. System Features (Functional Requirements)

### 1.1 Identity and Access

- **FR-1** — The system shall allow a Guest to register for an account (e.g. using email and password or other defined identity providers).  
- **FR-2** — The system shall allow a registered user to log in and log out, and shall maintain a session for an authenticated user.  
- **FR-3** — The system shall enforce role-based access: Guest (browse, search, view knowledge map, register, view published content per FR-22), Contributor (add/edit/delete own content, establish relationships; in shared discovery views, see only published content per FR-22), Admin (verify content, add regions, add categories, ban users).

### 1.2 Techniques

- **FR-4** — The system shall allow a Contributor to add a technique with at least: name, description, region(s), cultural or contextual notes, optional prerequisites, and optional related ingredients.  
- **FR-5** — The system shall allow users to search and filter techniques (e.g. by text, region, category, or other defined criteria).  
- **FR-6** — The system shall provide a technique detail view showing all stored fields, regional variations where applicable, and related techniques and ingredients.  
- **FR-7** — The system shall allow a Contributor to edit and delete only the techniques they have created.

### 1.3 Ingredients

- **FR-8** — The system shall allow a Contributor to add an ingredient profile with at least: name, region(s), seasonality, traditional sourcing or usage notes, culturally appropriate substitutions, and optional related techniques.  
- **FR-9** — The system shall allow users to search and filter ingredient profiles (e.g. by text, region, season, category).  
- **FR-10** — The system shall provide an ingredient detail view showing all stored fields and related techniques.  
- **FR-11** — The system shall allow a Contributor to edit and delete only the ingredient content they have created.

### 1.4 Recipes

- **FR-12** — The system shall allow a Contributor to add a recipe with at least: title, description, difficulty, duration, ordered preparation steps, and a list of ingredients; for each ingredient line the system shall support optional substitution notes. The system shall support optional tags, optional photos, and an optional origin or provenance story.  
- **FR-13** — The system shall allow users to search and filter recipes (e.g. by text, tags, difficulty, or other defined criteria), subject to publication rules in FR-22.  
- **FR-14** — The system shall provide a recipe detail view showing stored fields (including steps, ingredients, optional tags, photos, and origin story where provided), subject to publication rules in FR-22.  
- **FR-15** — The system shall allow a Contributor to edit and delete only the recipes they have created.

### 1.5 Knowledge Connections

- **FR-16** — The system shall allow a Contributor to establish relationships between entities (e.g. technique–technique, technique–ingredient, ingredient–region), with a selectable or defined relationship type where applicable.  
- **FR-17** — The system shall provide a Knowledge Map view that displays techniques, ingredients, and regions as a graph or network; this view shall be accessible to both Guest and authenticated users and shall show only **Admin-verified** (published) nodes and edges as applicable per FR-22.

### 1.6 Regions and Taxonomy

- **FR-18** — The system shall allow an Admin to add a new region (e.g. name and optional short description or parent region).  
- **FR-19** — The system shall allow an Admin to add a new category for classifying techniques and/or ingredients.  
- **FR-20** — When creating or editing techniques, ingredient profiles, or recipes, the system shall allow the user to select from existing regions and categories (e.g. from lists or dropdowns) where applicable.

### 1.7 Moderation and Publication

- **FR-21** — The system shall allow an Admin to verify content prior to publication; the system may also support rejecting or reverting content where applicable.  
- **FR-22** — Only **Admin-verified** content shall be **published** and visible in shared discovery: search, lists, public detail views, and the Knowledge Map. This applies to **Guests and Contributors alike**—neither shall see unverified content in those contexts. Unverified content shall remain unpublished (e.g. draft or pending) and shall not appear in shared discovery. A Contributor may access **their own** unverified items only through owner-specific flows (e.g. edit or manage own drafts), not through the same browse/search paths as published content. **Admins** may access unverified content as needed for verification and moderation.  
- **FR-23** — The system shall allow an Admin to ban a user account (e.g. disable access in the identity system), in line with operational policy.

### 1.8 Discovery and Navigation

- **FR-24** — The system shall provide a homepage that displays highlighted and/or recently added techniques, ingredients, and recipes (published content only per FR-22).  
- **FR-25** — The system shall provide region and category pages that list the techniques, ingredients, and recipes associated with that region or category (published content only per FR-22).

---

## 2. External Interface Requirements

### 2.1 User Interfaces

- The system shall provide a web-based user interface.  
- The interface shall adapt to the user’s role (Guest, Contributor, Admin), for example through role-appropriate menus and actions (e.g. Contributors see “Add technique” and “Establish relationship”; Admins see “Verify content”, “Add region/category”, and user moderation).

### 2.2 Hardware, Software, and Communication Interfaces

- **Hardware:** No specific hardware requirements beyond that needed to run a modern web browser and to host the application and database.  
- **Software:** The client shall run in a supported web browser; the server stack is to be determined.  
- **Communication:** The application shall use standard web protocols (e.g. HTTP/HTTPS). Use of a REST or similar API for future or external integration may be assumed at a high level; details are TBD.

---

## 3. Non-Functional Requirements

### 3.1 Performance

- **NFR-1** — Search results shall be returned within an acceptable time (e.g. within 2–3 seconds under normal load).  
- **NFR-2** — Page loads shall complete within an acceptable time (e.g. under 3 seconds under normal conditions).  
- **NFR-3** — The Knowledge Map shall support rendering or filtering for a moderate number of nodes (e.g. hundreds) so that the view remains usable, or provide filtering/zooming to keep the displayed set manageable.

### 3.2 Usability

- **NFR-4** — The user interface shall be designed for the target users, including home cooks who may not be familiar with technical terminology; labels and navigation shall be clear and consistent.  
- **NFR-5** — The application shall be usable on both mobile and desktop devices (e.g. responsive or mobile-friendly design).  
- **NFR-6** — Search and filters (e.g. by region, category, season) shall be easily discoverable and usable within the main flows (e.g. search page, list pages).

### 3.3 Security and Privacy

- **NFR-7** — User passwords shall be stored using a secure one-way hashing mechanism (e.g. bcrypt or Argon2); plain-text passwords shall not be stored.  
- **NFR-8** — Sessions shall be conducted over HTTPS where possible, and session cookies shall use secure and appropriate settings.  
- **NFR-9** — Only the content owner or an Admin shall be permitted to edit or delete a given technique, ingredient profile, or recipe; the system shall enforce this authorization on the server.

### 3.4 Reliability and Data

- **NFR-10** — User-contributed data shall be stored persistently; the system shall support or assume regular backups so that content can be recovered after a failure.  
- **NFR-11** — Data-modifying operations shall preserve consistency (e.g. use of transactions where multiple related updates are performed).

### 3.5 Maintainability and Compatibility

- **NFR-12** — The data model and architecture shall be extensible so that new relationship types or additional fields can be added without disproportionate rework.  
- **NFR-13** — The web application shall support recent major versions of common browsers (e.g. the last two major versions of Chrome, Firefox, Safari, Edge) for desktop and mobile.

### 3.6 Community and Trust

- **NFR-14** — The system shall store or support storage of content history or revision information (e.g. who created or last updated an item and when) to support transparency and community validation.

---

## 4. Other Requirements

### 4.1 Legal and Compliance

- Legal and regulatory requirements (e.g. GDPR, KVKK, or institutional policies) will be considered as the deployment context is defined; specific compliance requirements will be documented when applicable.

### 4.2 Documentation

- User-facing documentation (e.g. how to add a technique, how to use the knowledge map) should be available to support adoption.  
- Developer documentation (e.g. setup, architecture, API if any) should be maintained to support development and maintenance.

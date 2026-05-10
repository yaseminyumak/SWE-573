# CulinaryGraph — User Manual

This guide explains how to use the **CulinaryGraph** web application in clear, beginner-friendly language.

---

## 1. Introduction

### 1.1 Project overview

**CulinaryGraph** is a web application for **region-aware culinary knowledge**. It brings together **recipes**, **cooking techniques**, and **ingredient profiles** so you can read and share structured information—not only steps, but also **country**, **region**, cultural notes, substitutions, and stories.

### 1.2 Purpose of the platform

- Help **learners and curious cooks** discover how dishes and methods connect to **places** and **culture**.
- Let **contributors** add and maintain their own techniques, ingredients, and recipes with consistent fields and optional **photos** and **links** between catalog entries.

### 1.3 Supported user roles


| Role                        | What you can do                                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Guest** (not signed in)   | Browse the **Home** page, open **Techniques**, **Ingredients**, and **Recipes** lists and detail pages, use **search** (header) and **list filters** where available. You **cannot** create or edit content. |
| **Contributor** (signed in) | Everything a Guest can do, plus **create**, **edit**, and **delete your own** techniques, ingredients, and recipes; upload **images** on entities you own; manage your entries from **Profile**.             |


> **Note:** The application uses **Keycloak** for accounts. Advanced admin-only tools (if any) are outside this manual's scope.

---

## 2. Authentication

Identity is handled by **Keycloak**. You sign in and register through the **Login / Register** flow in the app header.

### 2.1 Registration

1. Open CulinaryGraph in your browser at **[https://culinary.page/](https://culinary.page/)**.
2. Click **Login / Register** in the top bar.
3. Choose **Register** and complete the sign-up form (for example username, email, and password, as required).
4. After successful registration, you may be signed in automatically or asked to sign in—follow the on-screen prompts.

### 2.2 Login

1. Click **Login / Register**.
2. Enter your **username** and **password** on the sign-in form.
3. You are returned to CulinaryGraph as a signed-in user. The top bar should show **Profile** and **Logout** instead of **Login / Register**.

### 2.3 Logout

1. While signed in, click **Logout** in the top bar.
2. Your session ends and you return to anonymous browsing.

---

## 3. Browsing & discovery

### 3.1 Browse recipes, techniques, and ingredients

Use the main navigation (top of every page):


| Link                                     | What you see                                                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Home** (`/`)                           | **Knowledge Map** (see §3.4), **Highlighted** and **Recently Added** content.            |
| **Techniques** (`/catalog/techniques`)   | List of techniques with **filters** (see §3.3). Open an item to see its **detail** page. |
| **Ingredients** (`/catalog/ingredients`) | List of ingredient profiles with filters. Open an item for detail.                       |
| **Recipes** (`/recipes`)                 | List of recipes with filters. Open an item for detail.                                   |


### 3.2 Homepage search

1. Use the **search box** in the **header** (available on all pages).
2. Type a keyword and press **Enter**.
3. You are taken to the **Search** page with results grouped into **Recipes**, **Techniques**, and **Ingredients** whose **titles or names** contain your query (simple text match).
4. Click a result row to open that entity's **detail** page.

If there are no matches, try another keyword.

### 3.3 List filters (techniques, ingredients, recipes)

On **Techniques**, **Ingredients**, and **Recipes** list pages, use the **filter controls** (sidebar or panel) to narrow by options such as:

- **Country**
- **Region** (text filter where shown)
- **Season** (ingredients)
- **Difficulty**, **tags**, and other recipe filters (as shown on the page)

Use **Clear all filters** (or equivalent) to reset. Only items matching the filters appear in the list.

### 3.4 Knowledge Map

The **Knowledge Map** on the **Home** page is **rolling out**: it gives you a geographic view of what the community has added.

- For **each country** on the map, you can see **what content exists** for that country (recipes, techniques, and ingredients that contributors have linked to that place).
- When you choose **Explore** (or the equivalent action) for a country, the app shows a **single list of all content** entered for that country—so you can scan everything in one place before opening a detail page.

### 3.5 Navigate between related content

- From a **recipe detail** page, use **Edit** (if you own the recipe), **associated techniques**, and any links shown to move to related **technique** or **ingredient** pages where the UI provides them.
- From **technique** or **ingredient** detail pages, use **related ingredients** / **related techniques** when present.
- Use the **top navigation** to switch between major areas at any time.

---

## 4. Recipes

> You must be **signed in** to create, edit, or delete recipes.

### 4.1 Create a recipe

1. Go **Recipes** → **+ Add Recipe** (or open `/recipes/new`).
2. Fill in **Title**, **Difficulty**, **Duration** (optional), **Country**, **Region** (if shown), **Steps**, and **Ingredient lines** (name; optional quantity, unit, substitution).
3. Optionally add **tags** (comma-separated), **origin story**, and select **associated techniques** from the catalog picker.
4. Submit the form to save. You are redirected to the recipe list or detail view.

### 4.2 Edit a recipe

1. Open your recipe's **detail** page.
2. If you are the **owner**, click **Edit** (`/recipes/:id/edit`).
3. Change fields and save.

Alternatively: **Profile** → **My Recipes** → **Edit**.

### 4.3 Delete a recipe

On the recipe **detail** page (as owner), click **Delete** and confirm **or** use **Profile** → **My Recipes** → **Delete**.

### 4.4 Ingredients, techniques, steps, and regions on a recipe


| Part                 | How                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Steps**            | Add multiple step lines; they are stored in order.                                         |
| **Ingredients**      | Add rows with **name**; optionally **quantity**, **unit**, **substitution** text.          |
| **Techniques**       | Pick **associated techniques** from the catalog (links the recipe to existing techniques). |
| **Region / country** | Use **Country** and **Region** fields so readers see geographic context.                   |


---

## 5. Techniques & ingredients

> You must be **signed in** to create, edit, or delete catalog entries you own.

### 5.1 Content creation flow

**New technique**

1. **Techniques** → **+ Add Technique** (`/catalog/techniques/new`).
2. Enter **Name**, **Difficulty**, **Country**, **Region**, **Cultural notes**, **Prerequisites** (optional), **Steps**, optional **photos**, and **related ingredients** where the form offers pickers.
3. Submit to save.

**New ingredient**

1. **Ingredients** → **+ Add Ingredient** (`/catalog/ingredients/new`).
2. Enter **Name**, **Country**, **Region**, **Seasons**, **Provenance story**, **Substitutions**, and optional **related techniques**.
3. Submit to save.

### 5.2 Editing and deleting owned content

Open a **detail** page you own and use **Edit** / **Delete**, or use **Profile** → **My Techniques** / **My Ingredients**. You cannot change other users' entries from the UI.

### 5.3 Linking related entities

- **Technique** form: **related ingredients** (catalog).
- **Ingredient** form: **related techniques** (catalog).
- **Recipe** form: **associated techniques** (catalog).

These links help readers jump between related detail pages.

---

## 6. Social features

### 6.1 Likes

On **recipe**, **technique**, and **ingredient** detail pages, use the **Like** control to show appreciation for content you enjoy. You can remove your like if you change your mind. The page shows an **aggregate like count** so everyone can see how often an entry has been liked.

### 6.2 Comments

Open a **recipe**, **technique**, or **ingredient** you want to discuss. Use the **Comments** area to read what others wrote and to **add your own comment** when you are signed in. Keep comments respectful and on-topic; empty or invalid submissions are rejected.

### 6.3 Viewing contributor information

On **recipe**, **technique**, and **ingredient** detail pages, look for **Created by** to see who contributed the entry (from the identity system).

---

## 7. Profile management

Open **Profile** when signed in.

### 7.1 Viewing your own content

**Profile** lists **My Techniques**, **My Ingredients**, and **My Recipes** with **Edit** and **Delete** for each row you own.

### 7.2 Activity history

There is no separate chronological activity feed. **Profile** is the main place to see everything you have created.

### 7.3 Managing uploaded images

On **detail** pages you **own**, use the **image manager** to upload, reorder, or remove images for that entity (recipes, techniques, ingredients where shown). Guests can view images; only owners get upload/delete controls.

---

## 8. Quick reference — URLs


| Page              | Path                            |
| ----------------- | ------------------------------- |
| Home              | `/`                             |
| Techniques list   | `/catalog/techniques`           |
| New technique     | `/catalog/techniques/new`       |
| Technique detail  | `/catalog/techniques/:id`       |
| Edit technique    | `/catalog/techniques/:id/edit`  |
| Ingredients list  | `/catalog/ingredients`          |
| New ingredient    | `/catalog/ingredients/new`      |
| Ingredient detail | `/catalog/ingredients/:id`      |
| Edit ingredient   | `/catalog/ingredients/:id/edit` |
| Recipes list      | `/recipes`                      |
| New recipe        | `/recipes/new`                  |
| Recipe detail     | `/recipes/:id`                  |
| Edit recipe       | `/recipes/:id/edit`             |
| Search            | `/search?q=...`                 |
| Profile           | `/profile`                      |


---

## 9. Getting help

- **Developer / setup:** `[README.md](../README.md)`, `[docker/README.md](../docker/README.md)`
- **Formal requirements:** `[SRS.md](SRS.md)`


# User Scenarios — CulinaryGraph

Who uses CulinaryGraph, why, and how. Three user types — **culinary student**, **food researcher**, and **food enthusiast** — with a short scenario for each.

Aligns with the [SRS](SRS.md) and [README](../README.md). Scenarios describe **intended journeys**; where the live app is still minimal (e.g. global search page, graph view), the steps use **navigation and list filters** that exist today.

---

## Persona 1 — Culinary student

**Who:** Defne is a culinary-arts student. She is learning traditional methods and regional variations. She needs clear, structured information she can cite and build on for exams and projects. She cares about *why* a technique differs by region and which ingredients are tied to which places.

**Why she uses CulinaryGraph:**  
She wants one place to find techniques and ingredients by region, with context (e.g. Oaxaca vs other Mexican nixtamalization). She uses it to study, to prepare presentations, and later to contribute what she learns in the kitchen or from her teachers.

**Scenario — “I need the technique and the ingredient for my report”**

Defne has to hand in a short report on nixtamalization and masa. She opens CulinaryGraph on the **Home** page and scans **highlighted** techniques and ingredients, then opens **Techniques** from the top navigation. She uses **text plus country/region filters** on the technique list to narrow entries (per **FR-5**). She opens a **technique detail** page and reads **cultural notes**, **steps**, and **related ingredients** where the contributor linked them (**FR-6**, **FR-4**). She follows a path to an **ingredient** (from a related-ingredient link or by opening **Ingredients** and filtering by region or season, **FR-9**) and reads **seasonality**, **traditional sourcing**, and **culturally appropriate substitutions** (**FR-8**). The **Knowledge Map** on the homepage remains a **placeholder**; she treats the home “map” section as a preview of future graph navigation. When her teacher mentions a variation not yet on the site, she **registers**, signs in, and uses **Add technique** to contribute a new entry with the same structured fields the SRS requires.

---

## Persona 2 — Food researcher

**Who:** Emre studies food history and culinary practices. He is interested in how techniques evolved, how they spread across regions, and how ingredients and techniques connect. He uses both primary sources and crowdsourced knowledge to map traditions.

**Why he uses CulinaryGraph:**  
He needs a structured, region-aware view of techniques and ingredients. He relies on **catalog list pages**, **detail pages**, and **relationship pickers on create/edit forms** (linking **existing ingredients** and **existing techniques**, **FR-17**) rather than a separate “moderation” or admin-only graph tool.

**Scenario — “I’m tracing how a technique connects across regions”**

Emre is comparing fermentation-related content across East Asia. From **Techniques**, he filters by **country** and scans descriptions and cultural notes. He opens several **technique detail** pages and notes **related ingredients** and **related techniques** recorded on each. To add a technique he documented in the field, he **logs in**, opens **New technique**, fills **name**, **steps**, optional **photos**, **country**, **region**, **cultural notes**, **prerequisites**, and selects **related ingredients** from the catalog (**FR-4**). He does **not** depend on an admin-only “Knowledge Map” graph (**out of current SRS scope**); his workflow is browse → compare → contribute with explicit links. When full-text search across entities is richer, he will use it alongside lists (**FR-5**, **FR-9**, **FR-13**).

---

## Persona 3 — Food enthusiast (yemek meraklısı)

**Who:** Zeynep is a home cook and food enthusiast. She loves trying authentic methods and understanding the “why” behind recipes. She is not a student or researcher; she uses the site for learning and for daily cooking. She might contribute when she has first-hand experience (e.g. from travel or family) that is not yet on the site.

**Why she uses CulinaryGraph:**  
She wants to explore a dish in full: which ingredients go into it, which techniques are used, where it’s from, what she can substitute, and how regional notes differ. She prefers **recipe** and **catalog** browsing over long articles, and appreciates **clear attribution** of who created each entry.

**Scenario — “I want to make this dish and understand what goes into it”**

Zeynep decides to make **kimchi** at home. She opens **Recipes**, filters or scrolls to find a relevant recipe, and opens the **recipe detail** view (**FR-14**). She reads **steps**, **ingredient lines** (with substitution hints where authors added them), **tags**, and **origin story** where provided (**FR-12**). Where the recipe lists **associated techniques** or catalog-linked ingredients, she uses **navigation from those names to the technique or ingredient detail** page when the link is available (**FR-16**). She opens **Ingredients** to read substitution guidance on key items (**FR-8**). She is **not** promised a separate “world map” or region-only landing pages in the current SRS; she uses **country** and **region** fields on detail pages and list filters instead. If she enjoys a recipe, a future release may let her **like** or **comment** (**FR-19**, **FR-20** — see SRS implementation note). When her colleague shares a family variation, she **registers** and uses **Add recipe** so others can cook it too.

These persona scenarios can be used for training, acceptance tests, and prioritization of features.

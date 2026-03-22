# User Scenarios — CulinaryGraph

Who uses CulinaryGraph, why, and how. Three user types — **culinary student**, **food researcher**, and **food enthusiast** — with a short scenario for each.

Aligns with the [SRS](SRS.md) and [README](../README.md).

---

## Persona 1 — Culinary student

**Who:** Defne is a culinary-arts student. She is learning traditional methods and regional variations. She needs clear, structured information she can cite and build on for exams and projects. She cares about *why* a technique differs by region and which ingredients are tied to which places.

**Why she uses CulinaryGraph:**  
She wants one place to find techniques and ingredients by region, with context (e.g. Oaxaca vs other Mexican nixtamalization). She uses it to study, to prepare presentations, and later to contribute what she learns in the kitchen or from her teachers.

**Scenario — “I need the technique and the ingredient for my report”**

Defne has to hand in a short report on nixtamalization and masa. She opens CulinaryGraph and types **“nixtamalization”** in the search bar. She gets the technique page: description, regional variations (Oaxaca vs elsewhere), related ingredients (maize, cal, water). She follows the link to **“masa”** and reads seasonality, traditional sourcing, and culturally appropriate substitutions. She then opens the **Knowledge Map**, filters by “Americas”, and sees how nixtamalization links to masa and to tortilla-making. She uses the world map, clicks **Americas**, and browses the region page to add one more technique to her report. She saves the links and writes her report. Later, when her teacher explains a variation she hasn’t seen on the site, she creates an account and adds it as a contribution.

---

## Persona 2 — Food researcher

**Who:** Emre studies food history and culinary practices. He is interested in how techniques evolved, how they spread across regions, and how ingredients and techniques connect. He uses both primary sources and crowdsourced knowledge to map traditions.

**Why he uses CulinaryGraph:**  
He needs a structured, region-aware graph of techniques and ingredients. He uses the Knowledge Map to see connections, the region pages to compare areas, and search (by technique, ingredient, or recipe-like terms) to find specific nodes. He may contribute by adding missing techniques, ingredients, or relationships and by correcting or refining existing content.

**Scenario — “I’m tracing how a technique connects across regions”**

Emre is looking at fermentation practices in East Asia. He goes to the **Knowledge Map**, filters by region “Asia”, and explores the graph: which techniques link to which ingredients and which subregions. He clicks a technique node and lands on the detail page (description, regional variations, related techniques and ingredients). He then searches for **“lacto-fermentation”** and **“gochugaru”** to see how they are linked and in which regions they appear. He notices a gap: a technique he knows from his fieldwork is missing. He logs in, adds the technique with the correct region and description, and uses **Establish relationship** to link it to the relevant ingredient and to an existing technique. The next time he opens the Knowledge Map, his new node and edges appear, and he can show the updated graph in his research.

---

## Persona 3 — Food enthusiast (yemek meraklısı)

**Who:** Zeynep is a home cook and food enthusiast. She loves trying authentic methods and understanding the “why” behind recipes. She is not a student or researcher; she uses the site for learning and for daily cooking. She might contribute when she has first-hand experience (e.g. from travel or family) that is not yet on the site.

**Why she uses CulinaryGraph:**  
She wants to explore a dish in full: which ingredients go into it, which techniques are used, where it’s from, what she can substitute, and how it changes from region to region. She prefers searching by recipe or dish name and then following ingredients, techniques, and regions rather than reading long articles. She trusts content that is verified and likes to see who contributed.

**Scenario — “I want to make this dish and understand what goes into it”**

Zeynep decides she wants to make **kimchi** at home. She opens CulinaryGraph and searches for **“kimchi”**. She lands on a recipe/dish page that ties together techniques, ingredients, and regions. She first browses the **ingredients**: napa cabbage, gochugaru, fish sauce, ginger, and others. For each ingredient she checks **what she can use instead** — e.g. culturally appropriate substitutions for gochugaru if she can’t find it, or alternatives for fish sauce. She then looks at the **techniques** used in the dish: lacto-fermentation, salting, and how they are applied step by step. She sees **which regions** the dish is common in (e.g. Korea, with subregions) and clicks through to compare **how the recipe differs across regions** — for example North vs South Korean styles, or different vegetable bases. She uses the **world map** to open the Asia region and finds other fermented dishes and ingredients from the same area for inspiration. She bookmarks the dish page and the key ingredient and technique pages, then tries making kimchi at home. When her Korean colleague shares a family variation she doesn’t see on the site, she registers and adds it so others can benefit.

These persona scenarios can be used for training, acceptance tests, and prioritization of features.

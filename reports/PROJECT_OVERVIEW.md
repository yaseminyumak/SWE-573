# CulinaryGraph — Proje Özeti, Mimari ve Yapılan İşler

Bu doküman projenin mimarisini, kullanılan teknolojileri ve bugüne kadar yapılan işleri tek bir yerde toplar. Mimari kararların ayrıntılı gerekçesi için `arch-decisions.md` (veya `.cursor/arch-decisions.md`) referans alınır.

---

## 1. Proje Özeti

**CulinaryGraph**, bölgeye özgü pişirme tekniklerini, malzeme hikayelerini ve geleneksel hazırlama yöntemlerini kitlesel kaynak (crowdsourcing) ile belgeleyen bir platformdur. Tarif sitelerinden farklı olarak odak: teknikler, malzemeler ve kültürel bağlam; ileride graph ilişkileri ile evrim zinciri ve bölge karşılaştırmaları planlanmaktadır.

**MVP (Sprint 1) kapsamı:**
- Teknik (Technique) ve malzeme (Ingredient) ekleme, görüntüleme, bölge/mevsim filtrelemesi
- Tarif (Recipe) oluşturma: adımlar, zorluk, süre; Technique ve Ingredient ile ilişki
- Kullanıcı yönetimi: Keycloak ile Contributor ve Validator rolleri
- Yayınlama akışı: DRAFT → PUBLISHED → ARCHIVED

---

## 2. Mimari Yaklaşım

### 2.1 Modular Monolith + DDD

- **Modular Monolith:** Tek deploy edilebilir uygulama; içeride modüller DDD Bounded Context’lere göre ayrılır. Modüller arası iletişim yalnızca tanımlı API veya event sınırları üzerinden yapılır.
- **DDD:** Her modülde domain (aggregate root, value object, repository arayüzü), application (use case / service), infrastructure (JPA, dış servisler) ve api (REST, DTO) katmanları ayrılır. İş kuralları domain sınıflarında tutulur; anemic model kullanılmaz.

### 2.2 Bounded Context Modülleri

| Modül      | Sorumluluk                          | Durum        |
|------------|-------------------------------------|--------------|
| **catalog**  | Technique & Ingredient yönetimi      | İskelet (package) |
| **recipe**   | Tarif oluşturma ve yayınlama        | İskelet (package) |
| **identity** | Kullanıcı rolleri ve yetki          | İskelet (package) |
| **search**   | Bölge/mevsim bazlı arama ve filtreleme | İskelet (package) |
| **shared**   | Ortak value object’ler (RegionId, UserId vb.) | İskelet (package) |

### 2.3 Katmanlı Yapı (Modül Başına)

```
modül/
├── domain/          # Aggregate root, value object, repository arayüzü (framework yok)
├── application/     # Use case servisleri, command/query
├── infrastructure/  # JPA entity, repository impl., dış adaptörler
└── api/             # REST controller, DTO, request/response
```

- **Bağımlılık yönü:** Infrastructure → Domain; Domain asla Infrastructure’a bağımlı olmaz.
- **Modüller arası:** Doğrudan Java referansı yerine application service çağrısı veya domain event kullanılır.

---

## 3. Teknoloji Stack (Detaylı)

### 3.1 Backend

| Teknoloji | Projede kullanılan / hedef | Açıklama |
|-----------|----------------------------|----------|
| **Java** | 17 (`pom.xml` java.version) | Spring Boot parent ile uyumlu. |
| **Spring Boot** | 4.0.3 (parent) | Web, güvenlik, JPA, Liquibase yönetimi. |
| **Spring Web MVC** | starter-webmvc | REST API. |
| **Spring Data JPA** | starter-data-jpa | Repository pattern, PostgreSQL. |
| **Spring Security** | starter-security | OAuth2 Resource Server (JWT). |
| **OAuth2 Resource Server** | starter-oauth2-resource-server | Keycloak JWT doğrulama. |
| **OAuth2 Client** | starter-security-oauth2-client | (İsteğe bağlı) Keycloak ile etkileşim. |
| **Liquibase** | starter-liquibase | Veritabanı migration (db/changelog). |
| **PostgreSQL** | runtime driver | Ana veritabanı. |
| **Test** | starter-data-jpa-test, security-test, webmvc-test, liquibase-test, oauth2-client-test | Entegrasyon ve birim testleri. |

**Paket yapısı:** `com.yaseminyumak.culinarygraphbackend` altında `config`, `shared`, `catalog`, `recipe`, `identity`, `search` ve ana uygulama sınıfı.

### 3.2 Frontend

| Teknoloji | Versiyon (package.json) | Açıklama |
|-----------|-------------------------|----------|
| **React** | ^19.2.0 | UI bileşenleri. |
| **React Router** | ^7.13.1 | SPA routing. |
| **Vite** | ^7.3.1 | Derleme ve dev sunucusu. |
| **TypeScript** | ~5.9.3 | Tip güvenliği. |
| **Tailwind CSS** | ^4.2.1 (@tailwindcss/vite) | Utility-first stil. |
| **TanStack Query** | ^5.90.21 | Server state, cache, API çağrıları. |
| **keycloak-js** | ^26.2.3 | Keycloak OAuth2/OIDC, PKCE, login/register. |

**Klasör yapısı:** `src/features/` (catalog, recipe, search), `src/shared/` (api client, bileşenler), `src/auth/` (Keycloak init, AuthProvider).

### 3.3 Veritabanı ve Altyapı

| Bileşen | Versiyon / not | Rol |
|---------|----------------|-----|
| **PostgreSQL** | 16-alpine | Uygulama veritabanı (culinarygraph). |
| **PostgreSQL (Keycloak)** | 16-alpine | Keycloak için ayrı instance (keycloak DB). |
| **Keycloak** | 24.0.1 (quay.io) | OAuth2/OIDC, realm `culinarygraph`, roller: contributor, validator. |
| **Container (Podman / Docker Compose)** | 2.x | postgres, postgres-kc, keycloak. Backend ve frontend şu an yerelde. Podman: `podman compose`. |
| **Nginx** | (compose’ta şu an kapalı) | İleride /api → backend, / → frontend reverse proxy. |

---

## 4. Proje Klasör Yapısı (Mevcut)

### 4.1 Repo kökü

```
SWE-573/
├── culinarygraph-backend/    # Spring Boot API
├── culinarygraph-frontend/   # React SPA
├── docker/                   # Compose, Keycloak realm, Nginx config
├── docs/                     # SRS, senaryolar, mockup, bu doküman
├── arch-decisions.md         # Mimari kararlar (referans)
└── .cursor/                  # Cursor kuralları (commit edilmez)
```

### 4.2 Backend

```
culinarygraph-backend/
├── src/main/java/com/yaseminyumak/culinarygraphbackend/
│   ├── CulinarygraphBackendApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java         # JWT + realm rol → ROLE_CONTRIBUTOR/VALIDATOR
│   │   └── SecurityConfigLocal.java    # local profil: OAuth2 kapalı
│   ├── shared/
│   ├── catalog/
│   ├── recipe/
│   ├── identity/
│   └── search/
├── src/main/resources/
│   ├── application.properties         # Datasource, JWT issuer (Keycloak)
│   ├── application-local.properties   # local profil
│   └── db/changelog/
│       └── db.changelog-master.xml    # Liquibase master (henüz migration yok)
├── docker-compose-dev.yml             # Sadece PostgreSQL (yerel geliştirme)
├── Dockerfile                         # Multi-stage: Maven build, JRE runtime
└── pom.xml
```

### 4.3 Frontend

```
culinarygraph-frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx                        # Router, QueryClient, AuthProvider
│   ├── auth/
│   │   ├── keycloak.ts                # Keycloak instance, init (check-sso, PKCE)
│   │   └── AuthProvider.tsx            # login, register, logout, isAuthenticated
│   ├── features/
│   │   ├── catalog/
│   │   │   ├── HomePage.tsx           # Ana sayfa, Login / Kayıt ol / Logout
│   │   │   └── CatalogPage.tsx
│   │   ├── recipe/
│   │   │   └── RecipeListPage.tsx     # Placeholder “coming soon”
│   │   └── search/
│   │       └── SearchPage.tsx
│   └── shared/
│       └── api/
│           └── client.ts              # API base URL, Bearer token (Keycloak)
├── vite.config.ts                     # Proxy /api → backend (localhost:8080)
├── package.json
└── Dockerfile                         # Node build, Nginx serve (şu an kullanılmıyor)
```

### 4.4 Container (Podman / Docker)

```
docker/
├── docker-compose.yml   # postgres, postgres-kc, keycloak (backend/frontend/nginx yorum satırı)
├── nginx/
│   └── nginx.conf      # /api → backend, / → frontend (ileride; Podman'da host.containers.internal)
├── keycloak/
│   └── culinarygraph-realm.json
└── README.md            # Podman/docker compose komutları
```

---

## 5. Kimlik Doğrulama ve Yetkilendirme

### 5.1 Akış

1. Kullanıcı frontend’i açar (örn. http://localhost:5173).
2. Keycloak `keycloak.init({ onLoad: 'check-sso' })` ile kontrol edilir; gerekirse login/register sayfasına yönlendirilir.
3. Giriş veya kayıt sonrası Keycloak JWT access token döner.
4. Frontend `api/client.ts` ile her istekte `Authorization: Bearer <token>` ekler.
5. Backend Spring Security OAuth2 Resource Server ile JWT’yi Keycloak issuer (örn. http://localhost:8180/realms/culinarygraph) üzerinden doğrular.
6. JWT içindeki `realm_access.roles` okunur; `culinarygraph-contributor` → `ROLE_CONTRIBUTOR`, `culinarygraph-validator` → `ROLE_VALIDATOR` olarak eşlenir.

### 5.2 Backend Güvenlik Kuralları (SecurityConfig)

- **GET /api/** → herkese açık.
- **POST/PUT/DELETE /api/** → `ROLE_CONTRIBUTOR` (ve dolayısıyla validator da yapabilir).
- **local** profil: `SecurityConfigLocal` devreye girer; OAuth2 kapatılır (sadece PostgreSQL ile yerel test için).

### 5.3 Keycloak Realm

- **Realm:** culinarygraph  
- **Client:** culinarygraph-app (public, PKCE, standard flow).  
- **Redirect URIs:** localhost:5173, localhost:5173/, localhost:80, 127.0.0.1 vb.  
- **User registration:** Açık (realm ayarı veya `registrationAllowed: true` import).  
- **Roller:** culinarygraph-contributor, culinarygraph-validator.

---

## 6. Yapılan İşler (Kronolojik / Detaylı)

### 6.1 Backend İskelesi

- Spring Boot projesi (Initializr): Web, JPA, Security, OAuth2 Resource Server, Liquibase, PostgreSQL.
- Paket yapısı: `shared`, `catalog`, `recipe`, `identity`, `search` için `package-info.java` ile modül iskeleti.
- `application.properties`: Datasource (env: DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD), JWT issuer (KEYCLOAK_ISSUER_URI, varsayılan localhost:8180/realms/culinarygraph).
- `application-local.properties`: local profil için OAuth2 kapatma.
- Liquibase: `db.changelog-master.xml` tanımı; henüz teknik/malzeme/tarif tabloları için migration eklenmedi.
- `docker-compose-dev.yml`: Sadece PostgreSQL; yerel geliştirme için.
- **Dockerfile:** Multi-stage (Maven ile build, Eclipse Temurin JRE ile çalıştırma). Backend şu an Docker’da değil; IntelliJ’den çalıştırılıyor.

### 6.2 Güvenlik (Keycloak JWT)

- **SecurityConfig** (profil ≠ local):  
  - CSRF kapalı.  
  - GET /api/** permitAll, POST/PUT/DELETE /api/** hasRole("CONTRIBUTOR").  
  - OAuth2 Resource Server JWT; JWT’den realm rolleri alınıp ROLE_CONTRIBUTOR / ROLE_VALIDATOR’a çevriliyor.
- **SecurityConfigLocal:** local profilde tüm /api/** permitAll, OAuth2 devre dışı.

### 6.3 Frontend İskelesi

- Vite + React + TypeScript; Tailwind, TanStack Query, React Router, keycloak-js kurulumu.
- **Routing:** / (HomePage), /catalog, /recipes, /search.
- **Auth:** Keycloak init (check-sso, PKCE), AuthProvider (login, register, logout, isAuthenticated). HomePage’te Login ve Kayıt ol butonları; Kayıt ol `keycloak.register()` ile doğrudan Keycloak kayıt sayfasına gidiyor.
- **API client:** `VITE_API_BASE` (varsayılan `/api`), isteklerde Keycloak token ile Bearer header. Vite proxy: `/api` → http://localhost:8080.

### 6.4 Container ortamı ve çalıştırma

- **Ortam:** Podman veya Docker. Compose dosyası her iki ortamla uyumludur (`podman compose` / `docker compose`).
- **docker-compose.yml:** Sadece postgres (port 5432 host’a açık), postgres-kc, keycloak (port 8180). Backend ve frontend servisleri yorum satırında; şu an yerelde çalışıyor.
- **Çalıştırma:**  
  1) `cd docker && podman compose up -d` (veya `docker compose up -d`).  
  2) Backend: IntelliJ’den (port 8080).  
  3) Frontend: `cd culinarygraph-frontend && npm run dev` (port 5173).  
- Nginx ileride kullanılırsa: Docker’da `host.docker.internal`, Podman’da `host.containers.internal` (compose’da `extra_hosts: host.containers.internal:host-gateway`).
- Keycloak realm: `culinarygraph-realm.json` ile import; redirect URI’ler ve (isteğe bağlı) `registrationAllowed` tanımlı.

### 6.5 Kullanıcı Deneyimi

- Ana sayfada giriş yapmamış kullanıcı için Login ve Kayıt ol; giriş yapan için Logout.
- Kayıt ol → Keycloak kayıt formu → kayıt sonrası uygulamaya dönüş (redirect URI: localhost:5173/).
- Catalog, Recipes, Search sayfaları iskelet; Recipes “coming soon” placeholder.

---

## 7. Mevcut Durum Özeti

| Alan | Durum |
|------|--------|
| **Backend** | Çalışır; güvenlik (JWT + roller) ve paket iskeleti var. Domain/application/infrastructure/api katmanları henüz doldurulmadı (catalog, recipe, identity, search). |
| **Frontend** | Çalışır; auth akışı (login, register, logout), routing, API client ve proxy hazır. Catalog/Recipe/Search sayfaları placeholder. |
| **Veritabanı** | PostgreSQL 16; Liquibase master hazır, migration dosyaları eklenmedi. |
| **Keycloak** | Realm, client, roller, kullanıcı kaydı açık; backend JWT ile doğruluyor. |
| **Docker / Podman** | Sadece altyapı (postgres, postgres-kc, keycloak). Backend/frontend yerelde. Podman için `podman compose` kullanılır. |

---

## 8. Sonraki Adımlar (Planlanan)

1. **Create Recipe use case (park edildi):** Recipe domain, Liquibase migration, RecipeService, RecipeController, frontend tarif formu ve liste.
2. **Catalog:** Technique ve Ingredient domain + persistence + API (liste/detay/oluşturma).
3. **Identity:** Backend’de kullanıcı/rol kullanımı (gerekirse Keycloak adapter).
4. **Search:** Bölge/mevsim filtreli arama endpoint’leri.
5. **Konteynerde backend/frontend:** İsteğe bağlı; build sorunları giderildikten sonra compose’a backend ve frontend servisleri eklenebilir (Podman veya Docker).

---

## 9. İlgili Dokümanlar

- **Mimari kararlar (detaylı):** `arch-decisions.md` veya `.cursor/arch-decisions.md`
- **Kullanıcı senaryoları:** `docs/User_Scenarios.md`
- **SRS:** `reports/SRS.md`
- **Geliştirme akışı:** `.cursor/rules/development-workflow.mdc` (branch, commit, .cursor’ın commit edilmemesi vb.)

---

*Bu doküman projenin mimarisini, teknolojileri ve yapılan işleri tek referansta toplamak için yazılmıştır; güncellemeler geliştirme ilerledikçe yapılmalıdır.*

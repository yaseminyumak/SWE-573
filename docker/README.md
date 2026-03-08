# CulinaryGraph — Docker (sadece altyapı)

PostgreSQL (uygulama + Keycloak için) ve Keycloak çalıştırır. **Backend ve frontend Docker’da değil;** IntelliJ ve `npm run dev` ile yerelde çalıştırılır.

## Gereksinimler

- Docker ve Docker Compose

## Komutlar

Reponun kökünden:

```bash
cd docker
docker compose up -d
```

- **PostgreSQL:** `localhost:5432` (kullanıcı/şifre: `culinarygraph`)
- **Keycloak admin:** http://localhost:8180 — kullanıcı `admin` / şifre `admin`
- **Realm:** `culinarygraph` — client `culinarygraph-app` (public, PKCE), realm rolleri `culinarygraph-contributor`, `culinarygraph-validator`

## Yerel geliştirme akışı

1. Docker’ı başlat: `docker compose up -d`
2. Backend’i IntelliJ’den çalıştır (port 8080)
3. Frontend: `cd culinarygraph-frontend && npm install && npm run dev` → http://localhost:5173

## İlk kullanım (Keycloak)

1. Keycloak’ın ayağa kalkmasını bekleyin (1–2 dakika).
2. **Kayıt açık değilse ("Registration not allowed" hatası):**
   - Keycloak Admin: http://localhost:8180 → giriş **admin** / **admin**.
   - Sol üstte **Realm** açılır menüsünden **culinarygraph** seçin (**master** değil).
   - Sol menüden **Realm settings** → üstten **Login** sekmesi.
   - **User registration** satırında **ON** yapın → **Save**.
3. **Üye olmak (kayıt):**
   - Frontend’te http://localhost:5173 → **Kayıt ol** butonuna tıklayın.
   - Keycloak kayıt formunu doldurup **Register**’a basın.
4. **Rol (isteğe bağlı):** Keycloak Admin → **Users** → kullanıcıyı seçin → **Role mapping** → `culinarygraph-contributor` veya `culinarygraph-validator` ekleyin.
5. http://localhost:5173 üzerinden giriş yapın.

**Realm’i sıfırlayıp JSON’dan tekrar import etmek** (Keycloak + Keycloak DB silinir; kayıt JSON’da açık gelir):
```bash
cd docker
docker compose down -v
docker compose up -d
```
Ardından 1–2 dakika bekleyin; realm `culinarygraph-realm.json` ile tekrar oluşur ve kayıt açık olur.

## Kapatma

```bash
docker compose down -v
```

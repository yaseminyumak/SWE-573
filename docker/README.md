# CulinaryGraph — Container ortamı (Podman / Docker)

PostgreSQL (uygulama + Keycloak için) ve Keycloak çalıştırır. **Backend ve frontend konteyner içinde değil;** IntelliJ ve `npm run dev` ile yerelde çalıştırılır.

## Gereksinimler

- **Podman** (veya Docker) ve **Podman Compose** / Docker Compose  
  Podman kullanıyorsanız: `podman compose` (Podman 4.x ile yerleşik destek) veya `podman-compose` kurulumu yeterli.

## Komutlar

Reponun kökünden:

```bash
cd docker
podman compose up -d
# veya: docker compose up -d
```

- **PostgreSQL:** `localhost:5432` (kullanıcı/şifre: `culinarygraph`)
- **Keycloak admin:** http://localhost:8180 — kullanıcı `admin` / şifre `admin`
- **Realm:** `culinarygraph` — client `culinarygraph-app` (public, PKCE), realm rolleri `culinarygraph-contributor`, `culinarygraph-validator`

## Yerel geliştirme akışı

1. Konteynerleri başlat: `podman compose up -d` (veya `docker compose up -d`)
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
podman compose down -v
podman compose up -d
# veya: docker compose down -v && docker compose up -d
```
Ardından 1–2 dakika bekleyin; realm `culinarygraph-realm.json` ile tekrar oluşur ve kayıt açık olur.

## Kapatma

```bash
podman compose down -v
# veya: docker compose down -v
```

## Podman: "docker-credential-desktop" hatası

`podman compose` kullanırken şu hata çıkarsa:

```
error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH
```

Sebep: Sistemdeki Docker/Podman config (`~/.docker/config.json`) credential helper olarak `docker-credential-desktop` (Docker Desktop’a ait) kullanıyor; Podman ile bu yok.

**Çözüm:** Config’ten credential store’u kapatın veya boş bırakın:

```bash
# Config dosyasını aç
editor ~/.docker/config.json
```

İçinde `"credsStore": "desktop"` (veya benzeri) varsa şunlardan birini yapın:
- Bu satırı silin, veya
- `"credsStore": ""` yapın.

Örnek (sadece credsStore kaldırıldı):

```json
{
  "auths": {}
}
```

Kaydedip tekrar deneyin: `podman compose up -d`.  
(İsterseniz credential store’u tamamen kaldırmak yerine sadece `credsStore` anahtarını silmek yeterli.)

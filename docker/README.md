# CulinaryGraph — Podman / Docker Compose (tam yığın)

PostgreSQL (uygulama + Keycloak DB), **Keycloak**, **Spring Boot backend** ve **React (Nginx) frontend** tek komutla ayağa kalkar.

## Gereksinimler

- **Podman** 4.x (veya Docker) ve **`podman compose`**  
  Kurulum: [Podman](https://podman.io/getting-started/installation)

## Tam yığını başlatma

Reponun kökünden:

```bash
cd docker
podman compose up --build -d
```

İlk çalıştırmada imaj build’leri (Maven + npm) birkaç dakika sürebilir.

### Portlar

| Servis    | Adres |
|-----------|--------|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8080 |
| **Keycloak** | http://localhost:8180 (admin: `admin` / `admin`) |
| **PostgreSQL** | `localhost:5432` (kullanıcı/şifre: `culinarygraph`) |

Frontend, tarayıcıdan `/api` isteklerini Nginx ile **backend** konteynerine yönlendirir. Keycloak adresi tarayıcı için **`http://localhost:8180`** kalır (`VITE_KEYCLOAK_URL` build arg).

Backend **`docker`** Spring profili ile çalışır: veritabanı `postgres` servis adıyla, JWT doğrulama Keycloak iç ağı (`keycloak:8080` JWKS) üzerinden.

### Keycloak: “HTTPS required” (HTTP + halka açık IP / Droplet)

`master` realm varsayılanı `sslRequired=EXTERNAL`: tarayıcıdan `http://DROPLET_IP:8180` giden istekler “dış” sayılır ve HTTP reddedilir. `start-dev` tek başına bunu kaldırmaz. Bu yüzden `keycloak-http-bootstrap.sh` konteyner içinden `kcadm` ile `master` (ve import edilen `culinarygraph`) için `sslRequired=NONE` ayarlar. **Yalnızca geliştirme / ders ortamı** içindir; gerçek üretimde domain + TLS kullanın.

### HTTP + ham IP: “Web Crypto API is not available”

Tarayıcıda yalnızca **HTTPS** veya **`http://localhost` / `127.0.0.1`** “secure context” sayılır; `http://DROPLET_IP:5173` değil. **keycloak-js** hem PKCE (`crypto.subtle`) hem OAuth **state** için **`crypto.randomUUID`** kullanır; ikisi de güvensiz bağlamda eksik olabilir. Uygulama: güvenli bağlam değilse **PKCE kapatılır** (`pkceMethod: false`) ve **`randomUUID` için `getRandomValues` tabanlı polyfill** yüklenir (yalnızca geliştirme/Droplet kolaylığı; üretimde **HTTPS** hedefleyin). Keycloak token adımında PKCE hatası alırsanız: **Clients → `culinarygraph-app` → Advanced** içinde PKCE’yi isteğe bağlı yapın.

### Keycloak login/register: CulinaryGraph custom theme

Login, register, forgot-password ve info/error sayfaları **özel `culinarygraph` temasıyla** gelir (parent: Keycloak'un kendi `keycloak` teması; sadece CSS + logo + arka plan görseli override edilir). Sayfa düzeni: tüm sayfa **mezze sofrası fotoğrafıyla** kaplı (`fixed`, `cover`); üstüne yumuşak navy/mor overlay, ortada **logo + beyaz form kartı** (pill inputlar + mor-pembe gradient pill CTA). Tema dosyaları:

```
docker/keycloak/themes/culinarygraph/login/
├── theme.properties
└── resources/
    ├── css/styles.css
    └── img/
        ├── logo.svg                 # form üstündeki yatay wordmark
        └── mezze-table.jpg          # tüm sayfayı kaplayan arka plan görseli
```

`docker-compose.yml` bu klasörü konteynere `/opt/keycloak/themes/culinarygraph` olarak read-only mount eder. Realm `loginTheme: "culinarygraph"` değerini hem `culinarygraph-realm.json`'dan **ilk import'ta** hem de `keycloak-http-bootstrap.sh` içinden **her açılışta** alır (yani mevcut bir DB'de bile uygulanır).

**Tema değişikliklerini uygula (canlı stack):**

```bash
cd docker
podman compose restart keycloak       # tema dosyaları read-only mount, restart yeter
```

Tarayıcıda CSS hâlâ eski görünüyorsa Keycloak'un teması sıkça cache'ler:

- Admin → realm **culinarygraph** → **Realm settings** → **Themes** → **Save** (tema değerini değiştirmeden kaydetmek cache'i temizler), veya
- Hard refresh (Cmd/Ctrl+Shift+R).

**Tasarımı değiştir:** Renkleri değiştirmek için `resources/css/styles.css` üst kısmındaki `:root { --cg-* }` değişkenlerini güncelle. Logo: `resources/img/logo.svg`. Arka plan fotoğrafı: `resources/img/mezze-table.jpg` (overlay yoğunluğu CSS'te `body.login-pf` içindeki `linear-gradient(... rgba(23,20,51,0.72) ...)` değerleriyle ayarlanır). Başlık altındaki slogan `#kc-page-title::after` ile CSS üzerinden enjekte edilir.

### Keycloak: `Invalid parameter: redirect_uri` (400)

Tarayıcıdaki uygulama adresi (ör. `http://DROPLET_IP:5173/`) **client’ın “Valid redirect URIs”** listesinde yoksa Keycloak isteği reddeder. `culinarygraph-realm.json` içinde örnek Droplet satırları vardır; **yalnızca ilk import’ta** (boş Keycloak DB) uygulanır.

**Zaten çalışan bir sunucuda** (volume dolu) iki seçenek:

1. **Admin konsolu:** `culinarygraph` realm → **Clients** → **culinarygraph-app** → **Access settings** → **Valid redirect URIs** ve **Web origins** içine ekle:  
   `http://SENIN_IP:5173/*` (ve gerekirse sondaki `/` olmadan aynı kök). **Save**.
2. Veya realm’i JSON’dan yeniden almak için Keycloak veritabanını sıfırlayıp stack’i kaldırıp açmak (`compose down -v` — **tüm kullanıcı/oturum silinir**).

Farklı bir IP kullanıyorsan `docker/keycloak/culinarygraph-realm.json` içindeki örnek IP’yi kendi adresinle değiştirip yalnızca **yeni** kurulumlarda import ettir veya yine Admin’den elle ekle.

## Durdurma ve temizlik

```bash
cd docker
podman compose down
```

Volume’larla birlikte sıfırlamak (Keycloak DB dahil, realm JSON’dan yeniden import):

```bash
podman compose down -v
```

## Sadece altyapı (Postgres + Keycloak)

Backend/frontend’i yerelde çalıştırmak istersen `docker-compose.yml` içinde `backend` ve `frontend` servislerini geçici olarak yorum satırına alıp yalnızca `postgres`, `postgres-kc`, `keycloak` bırakabilirsin; veya ayrı bir override dosyası kullanabilirsin.

## İlk kullanım (Keycloak)

1. Keycloak’ın hazır olması için ~1–2 dakika bekleyin (`podman compose ps`).
2. Realm **culinarygraph**, client **culinarygraph-app**; roller: `culinarygraph-contributor`, `culinarygraph-validator`.
3. Kayıt kapalıysa: Admin → realm **culinarygraph** → **Realm settings** → **Login** → **User registration** ON.

## Keycloak "waiting" / compose takılıyor

Resmi Keycloak imajında genelde **`wget` / `curl` yok**; healthcheck bu yüzden hep başarısız olur ve `depends_on: service_healthy` ile **backend sonsuza kadar bekler**.

**Çözüm:** `docker-compose.yml` içinde Keycloak için **healthcheck kaldırıldı**; backend yalnızca Keycloak konteynerinin **başlamasını** bekler (`service_started`). Keycloak’ın realm import + hazır olması **1–3 dakika** sürebilir; bu sürede 8080’e istek atmadan önce loglara bakın:

```bash
podman compose logs -f keycloak
```

`Listening on` veya hatasız akış görünce http://localhost:8180 açılır.

## Build: Maven `PKIX path building failed` (HTTPS / repo.maven.apache.org)

Konteyner içinde JDK, Maven Central sertifikasını doğrulayamıyorsa (kurumsal ağ SSL incelemesi, eksik CA):

1. Güncel `Dockerfile` CA paketini günceller ve `MAVEN_OPTS` ile Maven SSL/transport bayraklarını kullanır — `podman compose build --no-cache backend` deneyin.
2. Hâlâ olursa: kurumsal kök sertifikayı imajda `keytool` ile truststore’a ekleyin veya güvenli olmayan ağ dışında build alın.

## Podman: "docker-credential-desktop" hatası

`~/.docker/config.json` içinde `"credsStore": "desktop"` varsa kaldırın veya boşaltın; ardından `podman compose up --build -d` tekrar deneyin.

## SELinux (Fedora/RHEL)

Volume izin sorunu olursa Keycloak import satırına `:Z` ekleyebilirsin; macOS’ta kullanma.

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

1. Güncel `Dockerfile` CA paketini günceller ve `.mvn/jvm.config` ile SSL bayraklarını kullanır — `podman compose build --no-cache backend` deneyin.
2. Hâlâ olursa: kurumsal kök sertifikayı imajda `keytool` ile truststore’a ekleyin veya güvenli olmayan ağ dışında build alın.

## Podman: "docker-credential-desktop" hatası

`~/.docker/config.json` içinde `"credsStore": "desktop"` varsa kaldırın veya boşaltın; ardından `podman compose up --build -d` tekrar deneyin.

## SELinux (Fedora/RHEL)

Volume izin sorunu olursa Keycloak import satırına `:Z` ekleyebilirsin; macOS’ta kullanma.

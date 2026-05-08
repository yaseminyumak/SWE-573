# Unit Test Rehberi

## Gereksinimler

Testleri çalıştırmak için makinenizde **Docker** veya **Podman** kurulu olmalıdır. Java/Maven kurulumu gerekmez — her şey container içinde çalışır.

---

## Testleri Çalıştırma

`culinarygraph-backend/` dizininde çalıştırın:

```bash
make test          # tüm 107 test
make test-unit     # sadece domain testleri (43 test)
make test-service  # sadece service testleri (33 test)
make test-api      # sadece controller testleri (31 test)
```

> Makefile, testleri otomatik olarak Podman container içinde çalıştırır. Java/Maven kurulumu gerekmez.

---

## Sonuçları Okuma

Komut çalıştıktan sonra çıktının sonunda şu gibi bir özet görünür:

### Tüm testler geçtiğinde

```
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0 -- IngredientTest
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0 -- TechniqueTest
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0 -- RecipeTest
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0 -- IngredientServiceTest
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0 -- TechniqueServiceTest
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0 -- RecipeServiceTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0 -- IngredientControllerTest
[INFO] Tests run: 9,  Failures: 0, Errors: 0, Skipped: 0 -- TechniqueControllerTest
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0 -- RecipeControllerTest
...
[INFO] BUILD SUCCESS
```

### Bir test başarısız olduğunda

```
[ERROR] Tests run: 13, Failures: 1, Errors: 0 -- IngredientTest
[ERROR] IngredientTest.archive_changesStatusToArchived -- FAILURE
         AssertionError: expected: ARCHIVED but was: PUBLISHED
...
[INFO] BUILD FAILURE
```

---

## Sadece belirli testleri çalıştırma

### Tek bir test sınıfını çalıştır

```bash
podman run --rm \
  -v "$(pwd)":/app \
  -w /app \
  -e MAVEN_OPTS="-Dmaven.resolver.transport=wagon -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true" \
  maven:3.9-eclipse-temurin-17 \
  mvn test -Dtest=IngredientTest -B
```

### Tek bir test metodunu çalıştır

```bash
podman run --rm \
  -v "$(pwd)":/app \
  -w /app \
  -e MAVEN_OPTS="-Dmaven.resolver.transport=wagon -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true" \
  maven:3.9-eclipse-temurin-17 \
  mvn test -Dtest="IngredientTest#archive_changesStatusToArchived" -B
```

### Bir katmanın tüm testlerini çalıştır (örn. sadece domain testleri)

```bash
podman run --rm \
  -v "$(pwd)":/app \
  -w /app \
  -e MAVEN_OPTS="-Dmaven.resolver.transport=wagon -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true" \
  maven:3.9-eclipse-temurin-17 \
  mvn test -Dtest="IngredientTest,TechniqueTest,RecipeTest" -B
```

---

## Test Yapısı

```
src/test/java/com/yaseminyumak/culinarygraphbackend/
│
├── catalog/
│   ├── domain/
│   │   ├── IngredientTest.java        # Ingredient aggregate root kuralları
│   │   └── TechniqueTest.java         # Technique aggregate root kuralları
│   ├── application/
│   │   ├── IngredientServiceTest.java # IngredientService (Mockito)
│   │   └── TechniqueServiceTest.java  # TechniqueService (Mockito)
│   └── api/
│       ├── IngredientControllerTest.java  # GET/POST/PUT/DELETE endpoint'leri
│       └── TechniqueControllerTest.java   # GET/POST/PUT/DELETE endpoint'leri
│
├── recipe/
│   ├── domain/
│   │   └── RecipeTest.java            # Recipe aggregate root kuralları
│   ├── application/
│   │   └── RecipeServiceTest.java     # RecipeService (Mockito)
│   └── api/
│       └── RecipeControllerTest.java  # GET/POST/PUT/DELETE endpoint'leri
│
└── config/
    └── WebMvcTestSecurityConfig.java  # Controller testleri için güvenlik bypass
```

### Katman açıklamaları

| Katman | Teknoloji | Ne test eder |
|--------|-----------|--------------|
| `domain/` | Saf JUnit 5 (Spring yok) | Domain nesnelerinin iş kuralları: `create`, `update`, `publish`, `archive` state geçişleri; null korumaları; immutable getter'lar |
| `application/` | JUnit 5 + Mockito | Service metodlarının repository'yi doğru çağırması; `NotFoundException` fırlatma senaryoları |
| `api/` | JUnit 5 + MockMvc (`@WebMvcTest`) | HTTP durum kodları (200/201/204/400/404); JSON response alanları; request validasyonu |

---

## Toplam Test Sayısı

| Test Sınıfı | Sayı |
|-------------|------|
| IngredientTest | 13 |
| TechniqueTest | 13 |
| RecipeTest | 17 |
| IngredientServiceTest | 11 |
| TechniqueServiceTest | 11 |
| RecipeServiceTest | 11 |
| IngredientControllerTest | 10 |
| TechniqueControllerTest | 9 |
| RecipeControllerTest | 12 |
| **Toplam** | **107** |

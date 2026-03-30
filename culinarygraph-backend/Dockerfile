# Build stage (Java 17; Debian-based image has linux/arm64 — Alpine variant often lacks arm64)
FROM maven:3.9-eclipse-temurin-17 AS build

# Refresh OS CA bundle; fixes many PKIX errors when resolving https://repo.maven.apache.org
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates -f

WORKDIR /app

# SSL/PKIX workarounds for Maven Central inside some networks (no .mvn/ in repo — it is gitignored)
ENV MAVEN_OPTS="-Dmaven.resolver.transport=wagon -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true"

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
    CMD curl -sf http://localhost:8080/api/recipes >/dev/null || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]

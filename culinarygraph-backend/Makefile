MAVEN_IMAGE := maven:3.9-eclipse-temurin-17
MAVEN_OPTS  := -Dmaven.resolver.transport=wagon \
               -Dmaven.wagon.http.ssl.insecure=true \
               -Dmaven.wagon.http.ssl.allowall=true

RUN := podman run --rm -v "$(CURDIR)":/app -w /app -e MAVEN_OPTS="$(MAVEN_OPTS)" $(MAVEN_IMAGE)

test:
	$(RUN) mvn test -B

test-unit:
	$(RUN) mvn test -Dtest="IngredientTest,TechniqueTest,RecipeTest" -B

test-service:
	$(RUN) mvn test -Dtest="IngredientServiceTest,TechniqueServiceTest,RecipeServiceTest" -B

test-api:
	$(RUN) mvn test -Dtest="IngredientControllerTest,TechniqueControllerTest,RecipeControllerTest" -B

.PHONY: test test-unit test-service test-api

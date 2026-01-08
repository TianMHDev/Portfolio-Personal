# Etapa 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN mvn package -DskipTests

# Etapa 2: Run
FROM registry.access.redhat.com/ubi8/openjdk-17:1.23

ENV LANGUAGE='en_US:en'
COPY --from=build /usr/src/app/target/quarkus-app/lib/ /deployments/lib/
COPY --from=build /usr/src/app/target/quarkus-app/*.jar /deployments/
COPY --from=build /usr/src/app/target/quarkus-app/app/ /deployments/app/
COPY --from=build /usr/src/app/target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]

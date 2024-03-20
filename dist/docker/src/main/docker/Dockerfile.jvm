FROM registry.access.redhat.com/ubi8/openjdk-17:latest

ENV JAVA_APP_DIR=/deployments \
    APP_URL="${docker.app.files}" \
    JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager" \
    AB_ENABLED=jmx_exporter

EXPOSE 8080 8778 9779

USER 185

ADD "$APP_URL" /deployments/

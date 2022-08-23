FROM registry.access.redhat.com/ubi8/openjdk-11:latest

ENV APICURIO_DB_TYPE=postgresql9
ENV JAVA_APP_DIR=/deployments
ENV APP_URL="target/apicurio-studio-platforms-quarkus-ws-all.tar.gz"
ENV JAVA_OPTIONS="-Dapicurio.hub.storage.jdbc.type=${APICURIO_DB_TYPE} -Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV AB_ENABLED=jmx_exporter

EXPOSE 8080 8778 9779

USER 185

ADD "$APP_URL" /deployments/

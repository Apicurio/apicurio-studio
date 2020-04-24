####
# This Dockerfile is used in order to build a container that runs the Quarkus application in JVM mode
#
# Before building the docker image run:
#
# mvn package
#
# Then, build the image with:
#
# docker build -f src/main/docker/Dockerfile.jvm -t quarkus/apicurio-studio-platforms-quarkus-api-jvm .
#
# Then run the container using:
#
# docker run -i --rm -p 8080:8080 quarkus/apicurio-studio-platforms-quarkus-api-jvm
#
###
FROM registry.access.redhat.com/ubi8/ubi-minimal:8.1

ARG JAVA_PACKAGE=java-11-openjdk-headless
ARG RUN_JAVA_VERSION=1.3.5

ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en'


ENV JAVA_TOOL_OPTIONS=-Djava.net.preferIPv4Stack=true
ENV APICURIO_KC_AUTH_URL=https://studio-auth.apicur.io/auth/
ENV APICURIO_KC_REALM=apicurio-local
ENV APICURIO_KC_CLIENT_ID=apicurio-api
ENV APICURIO_KC_SSL_REQUIRED=EXTERNAL
ENV APICURIO_KC_DISABLE_TRUST_MANAGER=true
ENV APICURIO_PORT_OFFSET=0
ENV APICURIO_DB_DRIVER_NAME=h2
ENV APICURIO_DB_CONNECTION_URL=jdbc:h2:mem:apicuriodb
ENV APICURIO_DB_USER_NAME=sa
ENV APICURIO_DB_PASSWORD=sa
ENV APICURIO_DB_INITIALIZE=true
ENV APICURIO_DB_TYPE=h2
ENV APICURIO_DB_VALID_CONNECTION_CHECKER_CLASS_NAME=org.jboss.jca.adapters.jdbc.extensions.novendor.NullValidConnectionChecker
ENV APICURIO_DB_VALID_ON_MATCH=
ENV APICURIO_DB_BACKGROUND_VALIDATION=
ENV APICURIO_DB_EXCEPTION_SORTER_CLASS_NAME=org.jboss.jca.adapters.jdbc.extensions.novendor.NullExceptionSorter
ENV APICURIO_LOGGING_LEVEL=INFO
ENV APICURIO_MIN_HEAP=768m
ENV APICURIO_MAX_HEAP=2048m
ENV APICURIO_GITHUB_API_URL=
ENV APICURIO_GITLAB_API_URL=
ENV APICURIO_BITBUCKET_API_URL=
ENV QUARKUS_OIDC_AUTH_SERVER=https://studio-auth.apicur.io/auth/realms/apicurio-local
ENV QUARKUS_OIDC_CLIENT_ID=apicurio-api
ENV QUARKUS_OIDC_APPLICATION_TYPE=web-app

# Install java and the run-java script
# Also set up permissions for user `1001`
RUN microdnf install openssl curl ca-certificates ${JAVA_PACKAGE} \
    && microdnf update \
    && microdnf clean all \
    && mkdir /deployments \
    && chown 1001 /deployments \
    && chmod "g+rwX" /deployments \
    && chown 1001:root /deployments \
    && curl https://repo1.maven.org/maven2/io/fabric8/run-java-sh/${RUN_JAVA_VERSION}/run-java-sh-${RUN_JAVA_VERSION}-sh.sh -o /deployments/run-java.sh \
    && chown 1001 /deployments/run-java.sh \
    && chmod 540 /deployments/run-java.sh \
    && echo "securerandom.source=file:/dev/urandom" >> /etc/alternatives/jre/lib/security/java.security

# Configure the JAVA_OPTIONS, you can add -XshowSettings:vm to also display the heap size.
ENV JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0 \
 -Djava.util.logging.manager=org.jboss.logmanager.LogManager\
  -Xms${APICURIO_MIN_HEAP} \
  -Xmx${APICURIO_MAX_HEAP} \
  -Dquarkus.port.offset=${APICURIO_PORT_OFFSET} \
  -Dquarkus.datasource.db-kind=${APICURIO_DB_DRIVER_NAME} \
  -Dquarkus.datasource.jdbc-url=${APICURIO_DB_CONNECTION_URL} \
  -Dquarkus.datasource.username=${APICURIO_DB_USER_NAME} \
  -Dquarkus.datasource.password=${APICURIO_DB_PASSWORD} \
  -Dapicurio.hub.storage.jdbc.init=${APICURIO_DB_INITIALIZE} \
  -Dapicurio.hub.storage.jdbc.type=${APICURIO_DB_TYPE} \
  -Dapicurio.kc.auth.rootUrl=${APICURIO_KC_AUTH_URL} \
  -Dapicurio.kc.auth.realm=${APICURIO_KC_REALM} \
  -Dapicurio.logging=${APICURIO_LOGGING_LEVEL}"

COPY target/lib/* /deployments/lib/
COPY target/*-runner.jar /deployments/app.jar

EXPOSE 8080
USER 1001

ENTRYPOINT [ "/deployments/run-java.sh" ]

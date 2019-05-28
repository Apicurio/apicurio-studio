FROM centos:7
LABEL authors="Eric Wittmann <eric.wittmann@redhat.com>"
ENV RELEASE_PATH target/apicurio-studio-api-thorntail.jar
RUN yum install -y \
    java-1.8.0-openjdk-headless \
  && yum clean all

WORKDIR /opt/apicurio

ADD ${RELEASE_PATH} /opt/apicurio

RUN groupadd -r apicurio -g 1001 \
    && useradd -u 1001 -r -g apicurio -d /opt/apicurio/ -s /sbin/nologin -c "Docker image user" apicurio \
    && chown -R apicurio:apicurio /opt/apicurio/ \
    && chgrp -R 0 /opt/apicurio && chmod -R g=u /opt/apicurio

USER 1001


EXPOSE 8080


ENV JAVA_TOOL_OPTIONS=-Djava.net.preferIPv4Stack=true
ENV APICURIO_KC_AUTH_URL=https://studio-auth.apicur.io/auth/
ENV APICURIO_KC_REALM=apicurio
ENV APICURIO_KC_CLIENT_ID=apicurio-api
ENV APICURIO_KC_SSL_REQUIRED=NONE
ENV APICURIO_KC_DISABLE_TRUST_MANAGER=true
ENV APICURIO_PORT_OFFSET=0
ENV APICURIO_DB_DRIVER_NAME=h2
ENV APICURIO_DB_CONNECTION_URL=jdbc:h2:mem:apicuriodb
ENV APICURIO_DB_USER_NAME=sa
ENV APICURIO_DB_PASSWORD=sa
ENV APICURIO_DB_INITIALIZE=true
ENV APICURIO_DB_TYPE=h2
ENV APICURIO_DB_VALID_CONNECTION_CHECKER_CLASS_NAME=
ENV APICURIO_DB_VALID_ON_MATCH=
ENV APICURIO_DB_BACKGROUND_VALIDATION=
ENV APICURIO_DB_EXCEPTION_SORTER_CLASS_NAME=
ENV APICURIO_LOGGING_LEVEL=INFO
ENV APICURIO_MIN_HEAP=768m
ENV APICURIO_MAX_HEAP=2048m
ENV APICURIO_GITHUB_API_URL=
ENV APICURIO_GITLAB_API_URL=
ENV APICURIO_BITBUCKET_API_URL=


CMD java -jar /opt/apicurio/apicurio-studio-api-thorntail.jar \
    -Xms${APICURIO_MIN_HEAP} \
    -Xmx${APICURIO_MAX_HEAP} \
    -Dthorntail.port.offset=${APICURIO_PORT_OFFSET} \
    -Dthorntail.datasources.data-sources.ApicurioDS.driver-name=${APICURIO_DB_DRIVER_NAME} \
    -Dthorntail.datasources.data-sources.ApicurioDS.connection-url=${APICURIO_DB_CONNECTION_URL} \
    -Dthorntail.datasources.data-sources.ApicurioDS.user-name=${APICURIO_DB_USER_NAME} \
    -Dthorntail.datasources.data-sources.ApicurioDS.password=${APICURIO_DB_PASSWORD} \
    -Dthorntail.datasources.data-sources.ApicurioDS.valid-connection-checker-class-name=${APICURIO_DB_VALID_CONNECTION_CHECKER_CLASS_NAME} \
    -Dthorntail.datasources.data-sources.ApicurioDS.validate-on-match=${APICURIO_DB_VALID_ON_MATCH} \
    -Dthorntail.datasources.data-sources.ApicurioDS.background-validation=${APICURIO_DB_BACKGROUND_VALIDATION} \
    -Dthorntail.datasources.data-sources.ApicurioDS.exception-sorter-class-name=${APICURIO_DB_EXCEPTION_SORTER_CLASS_NAME} \   
    -Dapicurio.hub.storage.jdbc.init=${APICURIO_DB_INITIALIZE} \
    -Dapicurio.hub.storage.jdbc.type=${APICURIO_DB_TYPE} \
    -Dapicurio.kc.auth.rootUrl=${APICURIO_KC_AUTH_URL} \
    -Dapicurio.kc.auth.realm=${APICURIO_KC_REALM} \
    -Dthorntail.logging=${APICURIO_LOGGING_LEVEL}

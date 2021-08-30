FROM centos:7
LABEL authors="Eric Wittmann <eric.wittmann@redhat.com>"
ENV RELEASE_PATH target/apicurio-studio-api-thorntail.jar
RUN yum install -y \
    java-11-openjdk-headless \
  && yum clean all

WORKDIR /opt/apicurio

ADD ${RELEASE_PATH} /opt/apicurio
ADD entrypoint.sh /opt/apicurio

RUN groupadd -r apicurio -g 1001 \
    && useradd -u 1001 -r -g apicurio -d /opt/apicurio/ -s /sbin/nologin -c "Docker image user" apicurio \
    && chown -R apicurio:apicurio /opt/apicurio/ \
    && chmod 554 /opt/apicurio/entrypoint.sh \
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


ENTRYPOINT ["/opt/apicurio/entrypoint.sh"]

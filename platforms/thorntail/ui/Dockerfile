FROM centos:7
LABEL authors="Eric Wittmann <eric.wittmann@redhat.com>"
ENV RELEASE_PATH target/apicurio-studio-ui-thorntail.jar
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
ENV APICURIO_KC_CLIENT_ID=apicurio-studio
ENV APICURIO_KC_SSL_REQUIRED=NONE
ENV APICURIO_KC_DISABLE_TRUST_MANAGER=true
ENV APICURIO_PORT_OFFSET=0
ENV APICURIO_LOGGING_LEVEL=INFO
ENV APICURIO_UI_HUB_API_URL=https://localhost:8443/api
ENV APICURIO_UI_EDITING_URL=https://localhost:8443/ws
ENV APICURIO_MIN_HEAP=512m
ENV APICURIO_MAX_HEAP=2048m


CMD java -jar /opt/apicurio/apicurio-studio-ui-thorntail.jar \
    -Xms${APICURIO_MIN_HEAP} \
    -Xmx${APICURIO_MAX_HEAP} \
    -Dthorntail.port.offset=${APICURIO_PORT_OFFSET} \
    -Dapicurio-ui.hub-api.url=${APICURIO_UI_HUB_API_URL} \
    -Dapicurio-ui.editing.url=${APICURIO_UI_EDITING_URL} \
    -Dapicurio.kc.auth.rootUrl=${APICURIO_KC_AUTH_URL} \
    -Dapicurio.kc.auth.realm=${APICURIO_KC_REALM} \
    -Dthorntail.logging=${APICURIO_LOGGING_LEVEL}

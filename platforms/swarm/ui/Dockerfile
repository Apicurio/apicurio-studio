FROM centos:7
LABEL authors="Eric Wittmann <eric.wittmann@redhat.com>"
ENV RELEASE_PATH target/apicurio-studio-ui-swarm.jar
RUN yum install -y \
    java-1.8.0-openjdk-headless \
  && yum clean all

WORKDIR /opt/apicurio

ADD ${RELEASE_PATH} /opt/apicurio

RUN groupadd -r apicurio -g 1001 \
    && useradd -u 1001 -r -g apicurio -d /opt/apicurio/ -s /sbin/nologin -c "Docker image user" apicurio \
    && chown -R apicurio:apicurio /opt/apicurio/

USER 1001


EXPOSE 8080


ENV APICURIO_KC_AUTH_URL=https://auth-apistudio.rhcloud.com/auth/
ENV APICURIO_KC_REALM=apicurio
ENV APICURIO_KC_CLIENT_ID=apicurio-studio
ENV APICURIO_KC_SSL_REQUIRED=NONE
ENV APICURIO_KC_DISABLE_TRUST_MANAGER=true
ENV APICURIO_PORT_OFFSET=0
ENV APICURIO_LOGGING_LEVEL=INFO
ENV APICURIO_UI_HUB_API_URL=https://localhost:8443/api


CMD java -jar /opt/apicurio/apicurio-studio-ui-swarm.jar \
    -Dswarm.port.offset=${APICURIO_PORT_OFFSET} \
    -Dapicurio-ui.hub-api.url=${APICURIO_UI_HUB_API_URL}
    -Dswarm.logging=${APICURIO_LOGGING_LEVEL}

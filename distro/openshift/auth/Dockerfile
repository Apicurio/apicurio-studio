FROM jboss/keycloak:14.0.0

LABEL authors="Eric Wittmann <eric.wittmann@redhat.com>"

USER root

RUN mkdir -p /opt/jboss/keycloak/standalone/tmp/vfs \
 && chmod g+r -vfR /opt/jboss/keycloak/standalone \
 && chmod g+w -vf /opt/jboss/keycloak/standalone/{.,deployments} \
 && chmod g+w -vfR /opt/jboss/keycloak/standalone/{tmp,configuration,log} \
 && chgrp 0 -vfR /opt/jboss/keycloak/standalone

ENV PROXY_ADDRESS_FORWARDING=true

USER jboss

COPY themes/apicurio /opt/jboss/keycloak/themes/apicurio

ENV APICURIO_KEYCLOAK_USER=admin
ENV APICURIO_KEYCLOAK_PASSWORD=password123!
ENV APICURIO_UI_URL=http://localhost:8080/

CMD ["-b", "0.0.0.0"]

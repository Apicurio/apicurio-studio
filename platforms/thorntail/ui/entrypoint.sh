#!/bin/sh

java -jar /opt/apicurio/apicurio-studio-ui-thorntail.jar \
    -Xms${APICURIO_MIN_HEAP} \
    -Xmx${APICURIO_MAX_HEAP} \
    -Dthorntail.port.offset=${APICURIO_PORT_OFFSET} \
    -Dapicurio-ui.hub-api.url=${APICURIO_UI_HUB_API_URL} \
    -Dapicurio-ui.editing.url=${APICURIO_UI_EDITING_URL} \
    -Dapicurio-ui.spectral-api.url=${APICURIO_UI_SPECTRAL_API_URL} \
    -Dapicurio.kc.auth.rootUrl=${APICURIO_KC_AUTH_URL} \
    -Dapicurio.kc.auth.realm=${APICURIO_KC_REALM} \
    -Dthorntail.logging=${APICURIO_LOGGING_LEVEL}
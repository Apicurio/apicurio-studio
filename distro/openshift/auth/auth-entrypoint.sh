#!/bin/bash

if [ $APICURIO_KEYCLOAK_USER ] && [ $APICURIO_KEYCLOAK_PASSWORD ]; then
    /opt/jboss/keycloak/bin/add-user-keycloak.sh --user $APICURIO_KEYCLOAK_USER --password $APICURIO_KEYCLOAK_PASSWORD
fi

awk "{gsub(/APICURIO_UI_URL/,\"$APICURIO_UI_URL\");}1" /tmp/apicurio-realm.json > /tmp/apicurio-realm.configured.json

exec /opt/jboss/keycloak/bin/standalone.sh $@
exit $?

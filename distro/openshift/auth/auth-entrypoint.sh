#!/bin/bash

if [ $APICURIO_KEYCLOAK_USER ] && [ $APICURIO_KEYCLOAK_PASSWORD ]; then
    /opt/jboss/keycloak/bin/add-user-keycloak.sh --user $APICURIO_KEYCLOAK_USER --password $APICURIO_KEYCLOAK_PASSWORD
fi


if [ "$DB_VENDOR" == "POSTGRES" ]; then
  databaseToInstall="postgres"
elif [ "$DB_VENDOR" == "MYSQL" ]; then
  databaseToInstall="mysql"
elif [ "$DB_VENDOR" == "H2" ]; then
  databaseToInstall=""
else
    if (printenv | grep '^POSTGRES_' &>/dev/null); then
      databaseToInstall="postgres"
    elif (printenv | grep '^MYSQL_' &>/dev/null); then
      databaseToInstall="mysql"
    fi
fi

if [ "$databaseToInstall" != "" ]; then
    echo "[KEYCLOAK DOCKER IMAGE] Using the external $databaseToInstall database"
    /bin/sh /opt/jboss/tools/databases/change-database.sh $databaseToInstall
else
    echo "[KEYCLOAK DOCKER IMAGE] Using the embedded H2 database"
fi


awk "{gsub(/APICURIO_UI_URL/,\"$APICURIO_UI_URL\");}1" /tmp/apicurio-realm.json > /tmp/apicurio-realm.configured.json

exec /opt/jboss/keycloak/bin/standalone.sh $@
exit $?

#!/bin/bash

if [ -z "$1" ]
then
  echo "Please provide the neccessary arguments!"
  exit 1
fi

HOST_IP=$1
P=$(pwd)

##if the script runs in the container, we have to adjust the path to the mount point
if [ $P == "/" ]
then
  export P=/apicurio
fi

KC_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)
AS_DB_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)

SERVICE_CLIENT_SECRET=$(uuidgen)

sed 's/$HOST/'"localhost"'/g' $P/.env.template > $P/tmp; mv $P/tmp $P/.env

sed 's/$KC_PASSWORD/'"$KC_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$AS_DB_PASSWORD/'"$AS_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$SERVICE_CLIENT_SECRET/'"$SERVICE_CLIENT_SECRET"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env

sed 's/$DB_TYPE/'"postgresql9"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$DB_DRIVER/'"postgresql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$DB_CONN_URL/'"jdbc:postgresql:\\/\\/localhost\\/apicuriodb"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$API_VARIANT/'""'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$WS_VARIANT/'""'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env

sed 's/$HOST/'"localhost"'/g' $P/config/keycloak/apicurio-realm.json.template > $P/config/keycloak/apicurio-realm.json
sed 's/$HOST/'"localhost"'/g' $P/config/keycloak/microcks-realm.json.template > $P/config/keycloak/microcks-realm.json.tmp
sed 's/$SERVICE_CLIENT_SECRET/'"$SERVICE_CLIENT_SECRET"'/g' $P/config/keycloak/microcks-realm.json.tmp > $P/config/keycloak/microcks-realm.json

rm -rf $P/config/keycloak/microcks-realm.json.tmp

echo "Keycloak username: admin"
echo "Keycloak password: $KC_PASSWORD"
echo ""
echo "Keycloak URL: localhost:8090"
echo "Apicurio Studio URL: localhost:8093"
echo "Microcks URL: localhost:8900"

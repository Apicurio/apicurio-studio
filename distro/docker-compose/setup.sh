#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]
then
  echo "Please provide the neccessary arguments!"
  exit 1
fi

if [ "$2" != "mysql" ] && [ "$2" != "postgresql" ]
then
  echo "DB type must be mysql or postgresql"
  exit
fi

HOST_IP=$1
DB_TYPE=$2
P=$(pwd)

##if the script runs in the container, we have to adjust the path to the mount point
if [ $P == "/" ]
then
  export P=/apicurio
fi

KC_ROOT_DB_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)
KC_DB_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)
KC_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)
AS_MYSQL_ROOT_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)
AS_DB_PASSWORD=$(LC_CTYPE=C tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c6)

SERVICE_CLIENT_SECRET=$(uuidgen)

sed 's/$HOST/'"$HOST_IP"'/g' $P/.env.template > $P/tmp; mv $P/tmp $P/.env

sed 's/$KC_ROOT_DB_PASSWORD/'"$KC_ROOT_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$KC_DB_PASSWORD/'"$KC_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$KC_PASSWORD/'"$KC_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$AS_MYSQL_ROOT_PASSWORD/'"$AS_MYSQL_ROOT_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$AS_DB_PASSWORD/'"$AS_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$SERVICE_CLIENT_SECRET/'"$SERVICE_CLIENT_SECRET"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env

if [ "$DB_TYPE" == "mysql" ]
then
  sed 's/$DB_TYPE/'"mysql5"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$KC_DB_VENDOR/'"mysql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$KC_DB_ADDR/'"jboss-keycloak-mysql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_DRIVER/'"mysql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_CONN_URL/'"jdbc:mysql:\\/\\/apicurio-studio-db\\/apicuriodb"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
else
  sed 's/$DB_TYPE/'"postgresql9"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$KC_DB_VENDOR/'"postgres"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$KC_DB_ADDR/'"jboss-keycloak-postgresql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_DRIVER/'"postgresql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_CONN_URL/'"jdbc:postgresql:\\/\\/apicurio-studio-db\\/apicuriodb"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
fi



sed 's/$HOST/'"$HOST_IP"'/g' $P/config/keycloak/apicurio-realm.json.template > $P/config/keycloak/apicurio-realm.json
sed 's/$HOST/'"$HOST_IP"'/g' $P/config/keycloak/microcks-realm.json.template > $P/config/keycloak/microcks-realm.json.tmp
sed 's/$SERVICE_CLIENT_SECRET/'"$SERVICE_CLIENT_SECRET"'/g' $P/config/keycloak/microcks-realm.json.tmp > $P/config/keycloak/microcks-realm.json

rm -rf $P/config/keycloak/microcks-realm.json.tmp

echo "Keycloak username: admin"
echo "Keycloak password: $KC_PASSWORD"
echo ""
echo "Keycloak URL: $HOST_IP:8090"
echo "Apicurio URL: $HOST_IP:8093"
echo "Microcks URL: $HOST_IP:8900"

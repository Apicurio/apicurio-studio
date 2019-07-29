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

if [ $P == "/" ]
then
  export P=/apicurio
fi

KC_ROOT_DB_PASSWORD=$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)
KC_DB_PASSWORD=$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)
KC_PASSWORD=$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)
AS_MYSQL_ROOT_PASSWORD=$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)
AS_DB_PASSWORD=$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)

sed 's/$HOST/'"$HOST_IP"'/g' $P/.env.template > $P/tmp; mv $P/tmp $P/.env

sed 's/$KC_ROOT_DB_PASSWORD/'"$KC_ROOT_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$KC_DB_PASSWORD/'"$KC_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$KC_PASSWORD/'"$KC_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$AS_MYSQL_ROOT_PASSWORD/'"$AS_MYSQL_ROOT_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$AS_DB_PASSWORD/'"$AS_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env

if [ "$DB_TYPE" == "mysql" ]
then
  sed 's/$DB_TYPE/'"mysql5"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_DRIVER/'"mysql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_CONN_URL/'"jdbc:mysql:\\/\\/apicurio-studio-db\\/apicuriodb"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
else
  sed 's/$DB_TYPE/'"postgresql9"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_DRIVER/'"postgresql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
  sed 's/$DB_CONN_URL/'"jdbc:postgresql:\\/\\/apicurio-studio-db\\/apicuriodb"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
fi


sed 's/$HOST/'"$HOST_IP"'/g' $P/config/keycloak/apicurio-realm.json.template > $P/config/keycloak/apicurio-realm.json
sed 's/$HOST/'"$HOST_IP"'/g' $P/config/keycloak/microcks-realm.json.template > $P/config/keycloak/microcks-realm.json

echo "Keycloak password: $KC_PASSWORD"

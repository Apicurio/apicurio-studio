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

AS_DB_PASSWORD=$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c6)

sed 's/$HOST/'"$HOST_IP"'/g' $P/.env.template > $P/tmp; mv $P/tmp $P/.env

sed 's/$AS_DB_PASSWORD/'"$AS_DB_PASSWORD"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env

sed 's/$DB_TYPE/'"postgresql9"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$DB_DRIVER/'"postgresql"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env
sed 's/$DB_CONN_URL/'"jdbc:postgresql:\\/\\/apicurio-studio-db\\/apicuriodb"'/g' $P/.env > $P/tmp; mv $P/tmp $P/.env

echo ""
echo "Apicurio Studio URL: $HOST_IP:8093"

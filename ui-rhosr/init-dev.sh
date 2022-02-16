#!/bin/sh

echo "----"
echo "Initializing development environment for UI-only development."
echo "----"

CONFIG_TYPE=$1

if [ "x$CONFIG_TYPE" = "x" ]
then
  CONFIG_TYPE="keycloakjs"
fi

cp config/version.js src/version.js
cp config/config-$CONFIG_TYPE.js src/config.js

echo "Done.  Try:  'yarn start'"

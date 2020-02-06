#!/bin/sh

WILDFLY_DIRECTORY=$1

if [ "x$WILDFLY_DIRECTORY" = "x" ]
then
  read -p "Wildfly Location: " WILDFLY_DIRECTORY
fi

yarn build
rm -rf $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war/*.js
rm -rf $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war/*.css
rm -rf $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war/*.html
rm -rf $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war/assets
cp -rf dist-app/* $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war/
rm -rf $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war.*
touch $WILDFLY_DIRECTORY/standalone/deployments/apicurio-studio.war.dodeploy

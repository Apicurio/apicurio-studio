#!/bin/bash

sed 's/$HOST/'"$1"'/g' .env.template > .env
sed 's/$HOST/'"$1"'/g' config/keycloak/apicurio-realm.json.template > config/keycloak/apicurio-realm.json
sed 's/$HOST/'"$1"'/g' config/keycloak/microcks-realm.json.template > config/keycloak/microcks-realm.json

#!/bin/bash

docker-compose -f docker-compose.keycloak-postgresql.yml build
docker-compose -f docker-compose.keycloak-postgresql.yml -f docker-compose.microcks.yml -f docker-compose.apicurio.yml -f docker-compose-as-postgre.yml up

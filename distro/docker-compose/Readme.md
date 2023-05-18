# Docker-compose and Quarkus based installation

## Overview

This setup contains a fully configured Apicurio-Studio package, already integrated with Postgres, Keycloak and Microcks. It contains a shell script which will configure the environment. Currently every application is routed to the host network without SSL support. This is a development version, do not use it in a production environment!

Here is the port mapping:
- 8090 for Keycloak
- 8091 for the API
- 8092 for the websockets
- 8093 for the UI
- 8900 for Microcks

## Setup

The folder contains a bash script to make the initialization. The script will create the configuration files based on your IP address and your chosen database type.

The scripts will create 3 files:
- .env
- config/keycloak/apicurio-realm.json
- config/keycloak/microcks-realm.json

Supported databases:
- postgresql

### Script based setup

If you're using NIX based OS, you can run the setup script without the docker wrapper. The only dependency is "util-linux" package which contains a tool called uuidgen.

```
./setup.sh {IP_OF_YOUR_HOST}
```

Note: make sure you use the external IP address of your host here.  `localhost` and `127.0.0.1` will not work.

## Environment customisation

After the successfull run of the setup script, a file called `.env` will appear. This file contains the customisable properties of the environment. Every property is already filled in, so this is only for customization. You can set your passwords, URL's, and the versions of the components of Apicurio-Studio. The default version is the `latest`.

The passwords for DBs, KeyCloak, and the uuid of the microcks-service-account is generated dynamically with every run of the setup script.

If you want to change these settings (or the provided KeyCloak configuration) after you already started the stack, you have to remove the already existing docker volumes. The easiest way is to stop your running compose stack, and prune your volumes:

```
docker system prune --volumes
```

A simple "reset" script is also included, it will remove the generated config files for you.

```
./reset_env.sh
```

## Starting the environment

When your configs are generated, you can start the whole stack with these commands:

```

For PostgreSQL config:
./start-postgresql-environment.sh
```

### Recommended Approach due to a bug in Quarkus

If you want to do it manually, here is the command:

```

docker-compose -f docker-compose.microcks.yml -f docker-compose.apicurio.yml up

```

To clear the environment, please run these commands:

```
docker system prune --volumes
./reset_env.sh
```

## Configure users in Keycloak

The Keycloak instance is already configured, you don't have to create the realms manually.

At the first start there are no default users added to Keycloak. Please navigate to:
`http://localhost:8090`

The default credentials for Keycloak are: `admin` and the password can be found in the previously generated `.env` file, under `KEYCLOAK_PASSWORD`.

Select Apicurio realm and add a user to it. After this, you have to do this with Microcks too.


## Login to Apicurio and Microcks

Apicurio URL: `http://localhost:8093`
Microcks URL: `http://localhost:8900`

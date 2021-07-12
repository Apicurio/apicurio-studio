# Docker-compose based installation

## Overview

This setup contains a fully configured Apicurio-Studio package, already integrated with MySQL/Postgres, Keycloak and Microcks. It contains a shell script which will configure the environment. Currently every application is routed to the host network without SSL support. This is a development version, do not use it in a production environment!

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
- mysql
- postgresql

### Docker based setup

The easiest way is to open a terminal or PowerShell, and navigate into distro/docker-compose folder. In this folder enter the command below. On Windows please make sure, that your drives shares are enabled!

```
On Linux/Mac:

docker run -v $(pwd):/apicurio chriske/apicurio-setup-image:latest bash /apicurio/setup.sh {IP_OF_YOUR_HOST} {DATABASE_TYPE}

For example:
docker run -v $(pwd):/apicurio chriske/apicurio-setup-image:latest bash /apicurio/setup.sh 192.168.1.231 mysql
```

```
On Windows:

docker run -v ${PWD}:/apicurio chriske/apicurio-setup-image:latest bash /apicurio/setup.sh {IP_OF_YOUR_HOST} {DATABASE_TYPE}

For example:
docker run -v ${PWD}:/apicurio chriske/apicurio-setup-image:latest bash /apicurio/setup.sh 192.168.1.231 mysql
```

This command will pull a minimal alpine linux based image, mount the current folder to it, and it will run the setup script. At the end of the run, it will print the admin password for Keycloak, and the URLs for the services. Like this:

```
Keycloak username: admin
Keycloak password: op4oUQ

Keycloak URL: 192.168.1.231:8090
Apicurio URL: 192.168.1.231:8093
Microcks URL: 192.168.1.231:8900

```

Please copy these values somewhere where you can find them easily!


**Note**: if you have git configured to automatically convert between Windows and Unix line endings, then the above docker run is likely to fail.  Instead, you can try this alternative (example) docker command:

```
docker run -v ${PWD}:/apicurio chriske/apicurio-setup-image:latest /bin/bash -c "cp /apicurio/setup.sh /tmp/apicurio-setup.sh ; dos2unix /tmp/apicurio-setup.sh ; bash /tmp/apicurio-setup.sh 192.168.1.231 mysql"
```

This alternative command will use the `dos2unix` utility to convert the script's line endings before evaluating/executing it.

### Script based setup

If you're using NIX based OS, you can run the setup script without the docker wrapper. The only dependency is "util-linux" package which contains a tool called uuidgen.

```
./setup.sh {IP_OF_YOUR_HOST} {DATABASE_TYPE}
```

Note: make sure you use the external IP address of your host here.  `localhost` and `127.0.0.1` will not work.

## Environment customisation

After the successfull run of the setup script, a file called `.env` will appear. This file contains the customisable properties of the environment. Every property is already filled in, so this is only for customization. You can set your passwords, URL's, and the versions of the components of Apicurio-Studio. The default version is the `latest-release` tagged container from dockerhub, but you can change this as you want.

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
For Mysql config:
./start-mysql-environment.sh

For PostgreSQL config:
./start-postgresql-environment.sh
```

If you want to do it manually, here are the commands:

```
docker-compose -f docker-compose.keycloak.yml build

If you generated a config for MySQL:
docker-compose -f docker-compose.keycloak.yml -f docker-compose.microcks.yml -f docker-compose.apicurio.yml -f docker-compose-as-mysql.yml up

If you generated a config for PostgreSQL:
docker-compose -f docker-compose.keycloak.yml -f docker-compose.microcks.yml -f docker-compose.apicurio.yml -f docker-compose-as-postgre.yml up

```

Please do not mix up those commands! If you want to switch between databases, you have to clear the already existing volumes and configs.

To clear the environment, please run these commands:

```
docker system prune --volumes
./reset_env.sh
```

## Configure users in Keycloak

The Keycloak instance is already configured, you don't have to create the realms manually.

At the first start there are no default users added to Keycloak. Please navigate to:
`http://YOUR_IP:8090`

The default credentials for Keycloak are: `admin` and the password can be found in the previously generated `.env` file, under `KEYCLOAK_PASSWORD`.

Select Apicurio realm and add a user to it. After this, you have to do this with Microcks too.


## Login to Apicurio and Microcks

Apicurio URL: `http://YOUR_IP:8093`
Microcks URL: `http://YOUR_IP:8900`

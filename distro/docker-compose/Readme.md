# Docker-compose based installation

## Overview

This setup contains a fully configured Apicuiro-Studio package, already integrated with MySQL, Keycloak and Microcks. It contains a shell script which will configure the environment. Currently every application is routed to the host network without SSL support. This is a development version, do not use it in a production environment!

Here is the port mapping:
- 8090 for Keycloak
- 8091 for the API
- 8092 for the websockets
- 8093 for the UI
- 8900 for Microcks

## Setup

The folder contains a bash and a powershell script to make the initialization. The script will create the configuration files based on your IP address. The scripts will create 3 files:
- .env
- config/keycloak/apicurio-realm.json
- config/keycloak/microcks-realm.json

### Using the bash script

You just have to run it with an argument which is your IP address:

```
chmod +x setup.sh
./setup.sh 192.168.0.1
```

### Using the PowerShell script

You have to start PowerShell, and you have to setup script running:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

After this step you will be able to run our script, the argument with your IP is mandatory:
```
setup.ps1 192.168.0.1
```

## Starting the environment

When your configs are generated, you can start the whole stack with this command:
```
docker-compose -f docker-compose.keycloack.yml -f docker-compose.microcks.yml -f docker-compose.apicurio.yml up
```

## Configure users in Keycloak

The Keycloak instance is already configured, you don't have to create the realms manually.

At the first start there are no default users added to Keycloak. Please navigate to:
`http://YOUR_IP:8090`

The default credentials for Keycloak are: `admin` and `admin_password`

Select Apicurio realm and add a user to it. After this, you have to do this with Microcks too.


## Login to Apicurio and Microcks

Apicurio URL: `http://YOUR_IP:8093`
Microcks URL: `http://YOUR_IP:8900`

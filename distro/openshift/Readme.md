# Openshift based installation

## Overview

This setup contains a fully configured Apicurio-Studio package, already integrated with Postgres, Keycloak. It contains a shell script which will configure the environment. Currently every application is routed to the host network without SSL support. This is a development version, do not use it in a production environment!

## Setup

The folder contains a bash script to make the initialization. The script will create the deployment-configs, services, routes and all the resources needed. Once finished, the script will prompt the URL needed to access Apicurio Studio.

Supported databases:
- postgresql


Please copy these values somewhere where you can find them easily!

### Script based setup

Be careful, by running this script all the needed resources will be created on your current Openshift project.

If you want to change your current Openshift project, you can do it by running:


```
oc project project_name
```

```
./setup.sh
```

A simple "reset" script is also included, it will remove the generated configuration for you.

```
./cleanup.sh
```


## Configure users in Keycloak

The Keycloak instance is already configured, you don't have to create the realms manually but you'll need to create the users.

## Microcks configuration

Note that Microcks isn't being provided with this distro. But, if you have a Microcks cluster configured and available, you can configure it easily with the following commans:

```
oc set env dc/apicurio-studio-api APICURIO_MICROCKS_API_URL=microcks_url
oc set env dc/apicurio-studio-api APICURIO_MICROCKS_CLIENT_ID=microcks_client_id
oc set env dc/apicurio-studio-api APICURIO_MICROCKS_CLIENT_SECRET=microcks_client_secret
```
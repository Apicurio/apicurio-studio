# Helm Installation

## Prerequisites

This setup contains all needed configuration items to deploy Apicurio-Studio to a Kubernetes Cluster with Helm. Check if you have already prepared all dependencies needed for Installation:

- Helm 3 cli
- existing Keycloak Cluster (https://apicurio-studio.readme.io/docs/setting-up-keycloak-for-use-with-apicurio)
- Microcks Cluster ( only required if the feature is enabled)

## Setup

All configuration variables needed can be found in values.yaml.

Clone the git and check out the yaml-configs:

```
git clone https://github.com/Apicurio/apicurio-studio.git
cd apicurio-studio/distro/helm
```

### values.yaml

declare the variables in the following manner:  
 
set your Keycloak URL ending with /auth
```
  keycloak:
    url: http://KEYCLOAK_URL/auth
```
set your redirect uri if needed - standard / 
```
  ui:
    logout:
      redirect:
        uri: "/"
```
set the Main-URL ending with /studio-api
```
  ui:
    hub:
      api:
        url: http://my-apicurio.com/studio-api
```
set the Main URL ending with /ws
```
  ui:
    editing:
      url: ws://my-apicurio.com/ws
```
set your Mircocks URL ending with /api  
if you do not use Microcks you can leave it empty
```  
  microcks:
    api:
      url: http://my-microcks.com/api
```
database connection
```
  database:
    url: jdbc:mysql://apicuriodb:3306/apicuriodb
```
set the client id of your Keycloak Client used for apicurio
```
  keycloak:
    client:
      id: apicurio-studio
```
set the Keycloak Realm
```
  keycloak:
    realm: Apicurio
```
set your Microcks Client id - it expects the same realm as your Apicurio client
```
  microcks:
      id: microcks-serviceaccount
```
enable/disable share-with-everyone feature setting it "true" or "false"
```
  uiFeatureShareForEveryone: true
```
enable disable Microcks integration setting it "true" or "false"
```
  ui:
    feature:
      microcks: false
```

### apicurio-secrets

Remember that all secrets in k8s are base 64 encoded. Declare the variables in values.yaml the following manner:

```
  #a secure password for the database user
  database:
    password: apicuriodb

  #a secure passwort for the database root user
  database:
    rootPassword: apicuriodb

  #name of the database user
  database:
    user: apicuriodb

  #Keycloak client secret from your Apicurio Client
  keycloak:
    secret: apicuriokc

  #Keycloak client secret from your Mickrocks Client
  microcks:
    secret: apicuriomr
```

### Services

Regarding on the Kubernetes Cluster you either use NodePorts or Ingresses. 
If you use NodePorts change the Services in apicurio-studio-services.yaml to type NodePort.
If you use Ingresses setup the host path in apicurio-studio-ingresses.yaml.
It is recommended for a testing environment to use a reverse proxy outside of your kubernetes cluster and  redirect all traffic to Nodeports you specified in apicurio-studio-services.yaml.
Remember to either change the URLs in values.yaml or setup your Reverse Proxy. Besides that, remember that Apicurio Studio uses Websockets and thus changes the protocol (http/s to ws/s).

## Deployment

When you finished configuring the values.yaml Apicurio-Studio is ready to deploy!

```
helm install apicurio .
```

And you're done! Happy APIing!

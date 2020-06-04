# Kubernetes Installation

## Prerequisites

This setup contains all needed configuration items to deploy Apicurio-Studio to a Kubernetes Cluster. Check if you have already prepared all dependencies needed for Installation:

- existing Keycloak Cluster (https://apicurio-studio.readme.io/docs/setting-up-keycloak-for-use-with-apicurio)
- standard Storageclass for creating Persistent Volumes (Claims)
- Ingress controller ( only required if used)
- Microcks Cluster ( only required if the feature is enabled)

## Setup

All configuration variables needed can be found in apicurio-configmap.yaml and apicurio-secrets.yaml.

Clone the git and check out the yaml-configs:

```
git clone https://github.com/Apicurio/apicurio-studio.git
cd apicurio-studio/distro/kubernetes
```

### apicurio-configmap

declare the variables in the following manner:
```
  #set your Keycloak URL ending with /auth
  keycloak-url:  http://keycloak.example.com/auth
  #set your redirect uri if needed - standard / 
  apicurio-ui-logout-redirect-uri: /
  #set the Main-URL ending with /studio-api
  apicurio-ui-hub-api-url: http://my-apicurio-studio.com/studio-api
  #set the Main URL ending with /ws
  apicurio-ui-editing-url: ws://my-apicurio-studio.com/ws
  #set your Mircocks URL ending with /api
  #if you do not use Microcks you can leave it empty
  apicurio-microcks-api-url:  http://my-microcks.com/api
  #DO NOT CHANGE - change only if you use an already running database
  apicurio-db-connection-url: jdbc:mysql://apicuriodb:3306/apicuriodb
  #set the client id of your Keycloak Client used for apicurio
  apicurio-kc-client-id: apicurio-studio
  #set the Keycloak Realm
  apicurio-kc-realm: Apicurio
  # set your Microcks Client id - it expects the same realm as your Apicurio client
  apicurio-microcks-client-id: microcks-serviceaccount
  #enable/disable share-with-everyone feature setting it "true" or "false"
  apicurio-ui-feature-share-with-everyone: "true"
  #enable disable Microcks integration setting it "true" or "false"
  apicurio-ui-feature-microcks: "false"
```

### apicurio-secrets

Remember that all secrets in k8s are base 64 encoded. Declare the variables in the following manner:

```
  #a secure password for the database user
  db-password:
  #a secure passwort for the database root user
  db-root-password:
  #name of the database user
  db-user:
  #Keycloak client secret from your Apicurio Client
  apicurio-kc-client-secret:
  #Keycloak client secret from your Mickrocks Client
  apicurio-microcks-client-secret:

```

### Services

Regarding on the Kubernetes Cluster you either use NodePorts or Ingresses. 
If you use NodePorts change the Services in apicurio-studio-services.yaml to type NodePort.
If you use Ingresses setup the host path in apicurio-studio-ingresses.yaml.
It is recommended for a testing environment to use a reverse proxy outside of your kubernetes cluster and  redirect all traffic to Nodeports you specified in apicurio-studio-services.yaml.
Remember to either change the URLs in apicurio-configmap.yaml or setup your Reverse Proxy. Besides that, remember that Apicurio Studio uses Websockets and thus changes the protocol (http/s to ws/s).

## Deployment

When you finished configuring the apicurio-configmap.yaml and apicurio-secrets.yaml Apicurio-Studio is ready to deploy!
Depending on the k8s settings, especially regarding the storage provisioner, it may be useful to create PV and PVCs first with the database deploying first.


```
kubectl apply -f mysql-apicurio-persistentvolumeclaim.yaml
kubectl apply -f apicurio-configmap.yaml
kubectl apply -f apicurio-secrets.yaml
kubectl apply -f apicurio-studio-db-deployment.yaml
#deploying all configs at that moment is save, as kubernetes does not change any configs if they have not been changed between. Secondly, this is your 'i feel lucky' approach if you only want to use one command
kubectl apply -f .
```

And you're done! Happy APIing!

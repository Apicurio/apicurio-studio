# OpenShift templates

There is 1 simple OpenShift template that generates resources to deploy Apicurio Studio to OpenShift:

- *simple-sql* - deploys Apicurio Studio with an ephemeral PostgreSQL storage.

## Prerequisites

- You have an OpenShift cluster available, with access to create Deployments, Services, and Ingresses/Routes.
- You have reviewed the relevant template files.

## Steps

Create:

```shell
oc process -f template-simple-sql.yaml \
  -p NAMESPACE=apicurio-studio \
  -p INGRESS_ROUTER_CANONICAL_HOSTNAME=apps.apicur.io \
  | oc apply -f - 
```

Delete

```shell
oc process -f template-simple-sql.yaml \
  -p NAMESPACE=apicurio-studio \
  -p INGRESS_ROUTER_CANONICAL_HOSTNAME=apps.apicur.io \
  | oc delete -f - 
```

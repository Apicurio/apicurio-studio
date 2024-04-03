# Kubernetes resources

There are 3 simple kustomize bundles that generate resources to deploy Apicurio Studio to Kubernetes (or OpenShift):

- *with-ingress* - for clusters that do not support Routes (plain Kubernetes),
- *with-route* - for clusters that do support Routes (OpenShift), and
- *with-namespace* - that can be used with either of them, and which also creates a Namespace.

## Prerequisites

- You have a Kubernetes or OpenShift cluster available, with access to create Deployments, Services, and Ingresses/Routes.
- You have installed the `kustomize` tool.
- You have reviewed and/or updated the relevant `kustomize.yaml` files.

## Steps

Create:

```shell
cd with-namespace
kustomize build | kubectl apply -f -
```

Delete:

```shell
kustomize build | kubectl delete -f -
```

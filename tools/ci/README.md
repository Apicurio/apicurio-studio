# Custom CircleCI Docker Image
This docker image is used for all Apicurio builds in CircleCI.  It is based on CentOS 7 and simply installs all
of the build tools necessary for any Apicurio build.  Tools include but are not limited to:

* Maven
* Java
* Git
* Node.js
* GraalVM
* gcc

## Building the Docker Image

```
docker build -t="apicurio/ci" --rm .
```

## Pushing to Docker Hub

```
docker push apicurio/ci:latest
```

# Docker Compose

The `./src/main/resources` directory contains several *Docker Compose* files, which these should provide simple examples on how to deploy *Apicurio Studio* (e.g. for local testing). For more complicated deployments use Kubernetes resources or OpenShift templates.

## Prerequisites

- You have installed *Docker* and *Docker Compose*.

You can either build *Apicurio Studio* images locally (see the build documentation in the project root), or use the pre-built images from a public registry.

## Use-cases

- `docker-compose-simple-mem.yaml` - minimal docker compose file, that runs Apicurio Studio with an ephemeral in-memory database,
- `docker-compose-simple-sql.yaml` - docker compose file that runs Apicurio Studio with an ephemeral PostgreSQL database.

### Example

Start:

```shell
docker-compose -f docker-compose-simple-mem.yml up
```

Clean:

```shell
docker-compose -f docker-compose-simple-mem.yml rm
docker system prune --volumes
```

NOTE: You might need to restart docker compose if the `postgresql` container starts too late, and Apicurio Studio fails to connect.

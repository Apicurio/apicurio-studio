# Running Apicurio Studio testsuite

This document describes the Apicurio Studio testsuite and how to run it.

Apicurio Studio testsuite has various types of tests: unit tests and integration tests(these can be executed locally or against kubernetes/openshift).

## Unit Tests

Quick tests that verify specific functionalities or components of the application. Each maven module can have it's own set of unit tests.
For the Apicurio Studio app they can be found in `app/src/test`

Because Apicurio Studio is a Quarkus application we use `@QuarkusTest` for the unit tests, that allow us to run multiple different configurations of 
the application, easily provide mocks or external dependencies... QuarkusTest allows us to easily verify feature flags or config properties that change completely the behavior of the application. In order to do that we use `@QuarkusTestProfile` quite often.

Unit tests are executed as part of the project build. You can build the project and run the tests by executing this command:
```
make build-all
```

## Integration Tests

Located under `integration-tests`. We have a set of tests for the current version of Apicurio Studio that are run in [CI](.github/workflows/integration-tests.yaml).

This set of tests are mainly designed to work in two different modes:

+ Apicurio Studio and required infrastructure deployed locally (processes, docker containers, mocks, ...) by the testsuite. This uses the @QuarkusIntegrationTest annotation to run the required infrastructure. This is useful for running the tests in the IDE for debugging purposes.
+ Apicurio Studio and required infrasturcture are deployed externally and connection details have to be provided in order to execute the tests.

### ITs with local infrastructure

This is the normal mode used when you execute the testsuite. Because Apicurio Studio employs a unified approach to the application as of version 3.0, the only storage that can currently be used in this mode is in-memory.

When executing the testsuite you normally provide two profiles:
+ test profile (which determines the tests that will be executed), with the following options: all, ci, smoke, serdes, ui, acceptance, auth, migration, sqlit, kafkasqlit.
+ `local-tests` - this profile enables local testing mode, rather than remote testing (i.e. Studio deployed to an external environment like minikube)

As you might expect, this testsuite mode depends on the rest of the project to be built first, in order to have the application jars/images available or the serdes module to be available.

For example, to run the smoke tests group using this approach, first run `mvn clean install` (this command will execute all unit tests as well, you can skip them using `-DskipTests`) and then run `mvn verify -am -Pintegration-tests -pl integration-tests -Plocal-tests -Psmoke`.

Here is a breakdown of the options:

* `verify` - the maven command you want to run.  Verify will run the tests.
* `-am` - automatically build any maven modules needed by the module/project being built.
* `-Pintegration-tests` - enable the `integration-tests` profile, which adds the **integration-tests** maven module to the reactor.
* `-pl integration-tests` - tell maven to only build the **integration-tests* module.
* `-Plocal-tests` - enable local testing mode, which will tell the test framework to start the Quarkus application automatically for the tests.
* `-Psmoke` - run only the integration tests in the `smoke` group.

## ITs with infrastructure in Kubernetes/Openshift

The Integration Tests testsuite can be configured to expect Apicurio Studio, and its required infrastructure, to be deployed externally in a K8s cluster.

In this mode, the testsuite expects your kubeconfig file to be already configured pointing to the cluster that will be used for testing. The tests that will be executed are determined using the maven profile just as when running locally.
As for the storage variant, it will be determined by activating one of the `remote-*` maven proviles: remote-mem, remote-sql, remote-kafka.

For more help/examples of running the integration tests in this mode, see our CI jobs here: [Integration Tests GH Workflow](.github/workflows/integration-tests.yaml)

## ITs against custom infrastructure

Another way to run the tests is against custom infrastructure. You can deploy and run Apicurio Studio in whatever way you want, and then run the integration tests against that deployment.

To do this, you must once again specify the collection of integration tests you wish to run, but instead of activating the `local-tests` maven profile or one of the `remote-*` profiles, you can add `-Dquarkus.http.test-host` and `-Dquarkus.http.test-port` to the maven command line.

For example, you can run the tests against the docker version of Studio by doing the following:

### Run Studio using docker

```
docker pull quay.io/apicurio/apicurio-studio:latest-snapshot
docker run -it -p 8080:8080 quay.io/apicurio/apicurio-studio:latest-snapshot
```

### Run the integration tests against the running docker container

```
mvn verify -Psmoke -Dquarkus.http.test-host=127.0.0.1 -Dquarkus.http.test-port=8080
```


## Integration Tests testsuite internal details

The Integration Tests testsuite is written in Java and we use JUnit 5.

The main entry point for the testsuite is this class [`integration-tests/src/test/java/io/apicurio/deployment/StudioDeploymentManager.java`](integration-tests/src/test/java/io/apicurio/deployment/StudioDeploymentManager.java).

This is the class that, when running in remote mode, is responsible for deploying all the required infrastructure in K8s and making sure it remains available during the tests execution.

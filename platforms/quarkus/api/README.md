# apicurio-studio-platforms-quarkus-api project

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```
mvn quarkus:dev
```

## Packaging and running the application

By default, `mvn clean install` produces an executable JAR with the dev Quarkus configuration profile enabled, and in-memory persistence implementation.

The application can be packaged using `mvn package`.
It produces the `apicurio-studio-api-runner.jar` file in the `/target` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/lib` directory.

The application is now runnable using `java -jar target/apicurio-studio-api-runner.jar`.

### Build Options

 - `-Pprod` enables Quarkus's *prod* configuration profile, which uses configuration options suitable for a production environment, 
   e.g. a higher logging level.
   

##Runtime Configuration

- In the *dev* mode, the application uses an in-memory H2 database`.
- In the *prod* mode, you have to provide connection configuration for a PostgreSQL server as follows:

Option|Command argument|Env. variable|
|---|---|---|
|Data Source URL|`-Dquarkus.datasource.url`|`APICURIO_DB_CONNECTION_URL`|
|DS Username|`-Dquarkus.datasource.username`|`APICURIO_DB_USER_NAME`|
|DS Password|`-Dquarkus.datasource.password`|`APICURIO_DB_PASSWORD`|

To see additional options, visit:
 - [Data Source options](https://quarkus.io/guides/datasource-guide#configuration-reference) 
 
For both profiles you need to provide connection configuration for a oidc server as follows:

 Option|Command argument|Env. variable|
 |---|---|---|
 |OIDC Server|`-Dquarkus.oidc.auth-server-url`|`APICURIO_KC_AUTH_URL`|
 |OIDC Client ID|`-Dquarkus.oidc.client-id`|`APICURIO_KC_CLIENT_ID`|
 
To see additional options, visit:
 - [OIDC options](https://quarkus.io/guides/security-openid-connect) 

Note that in order to have the full `apicurio-studio` app running both the `api` and the `ws` needs to share the same database.
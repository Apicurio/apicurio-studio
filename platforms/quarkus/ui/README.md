# apicurio-studio-platforms-quarkus-ui project

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
It produces the `apicurio-studio-ui-runner.jar` file in the `/target` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/lib` directory.

The application is now runnable using `java -jar target/apicurio-studio-ui-runner.jar`.

### Build Options

 - `-Pprod` enables Quarkus's *prod* configuration profile, which uses configuration options suitable for a production environment, 
   e.g. a higher logging level.
   
   
##Runtime Configuration

For both profiles you need to provide connection configuration for a oidc server as follows:

 Option|Command argument|Env. variable|
 |---|---|---|
 |OIDC Server|`-Dstudio.keycloak.url`|`APICURIO_KC_AUTH_URL`|
 |OIDC Realm|`-Dstudio.keycloak.realm`|`APICURIO_KC_REALM`|
 |OIDC Client ID|`-Dquarkus.oidc.client-id`|`APICURIO_KC_CLIENT_ID`|
 
In `prod` profile, by default, the OIDC connector forces the `redirect_uri` to use `https://` URI - considering this component may be deployed behind a reverse proxy that handles the TLS termination.
To disable this behavior, you may set the `APICURIO_OIDC_REDIRECT_HTTPS` environment variable to `false`.

To see additional options, visit:
 - [OIDC Options](https://quarkus.io/guides/security-openid-connect) 
 
 
Also for both profiles, you need to configure the location of both the api and the ws components, you can do it as follows:

 Option|Command argument|Env. variable|
 |---|---|---|
 |API URL|`-D.apicurio-ui.hub-api.url`|`APICURIO_UI_EDITING_URL`|
 |WS URL|`-Dapicurio-ui.editing.url`|`APICURIO_UI_HUB_API_URL`|
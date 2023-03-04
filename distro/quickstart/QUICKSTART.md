# Quickstart for Apicurio Studio using Quarkus

All components depend on a keycloak server, you can use one that we own and is already configured for this purpose.

export APICURIO_KC_AUTH_URL=https://studio-auth.apicur.io/auth

And then you must build the application by using:

```bash
mvn clean install -am -pl platforms/quarkus/api -pl platforms/quarkus/ws -pl platforms/quarkus/ui
```

To start the API
```bash
qApiPath=platforms/quarkus/api
mvn $(test -f "$qApiPath/java.env" && sed -e "/^$/d" -e "/^#/d" "$qApiPath/java.env" | xargs -r -n1 printf -- "-D%s ") -f $qApiPath/pom.xml quarkus:dev
```

To start the WS
```bash
qWsPath=platforms/quarkus/ws
mvn $(test -f "$qWsPath/java.env" && sed -e "/^$/d" -e "/^#/d" "$qWsPath/java.env" | xargs -r -n1 printf -- "-D%s ") -f $qWsPath/pom.xml quarkus:dev
```

To start the UI (Tested with node 10)

```bash
qUIPath=platforms/quarkus/ui
mvn $(test -f "$qUIPath/java.env" && sed -e "/^$/d" -e "/^#/d" "$qUIPath/java.env" | xargs -r -n1 printf -- "-D%s ") -f $qUIPath/pom.xml quarkus:dev
```
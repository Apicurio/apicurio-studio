# Dev mode for Apicurio Studio using quarkus and IDE debugging

All components depend on a keycloak server
```bash
docker run -d -p 8090:8080 apicurio/apicurio-studio-auth
```
Make sure the KC's apicurio client lists the UI's address as a valid redirection URI

Rebuild the local dependencies

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
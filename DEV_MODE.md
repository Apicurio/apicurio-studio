# Dev mode for Apicurio Studio using quarkus and IDE debugging

All components depend on a keycloak server
```bash
docker run -d -p 8090:8080 apicurio/apicurio-studio-auth
```
Make sure the KC's apicurio client lists the UI's (at least?) address as a valid redirection URI

To start the API
```bash
qApiPath=platforms/quarkus/api
mvn $(test -f "$qApiPath/.javaenv" && sed -e "/^$/d" -e "/^#/d" $qApiPath/.javaenv | while read line; do printf "-D%s " "$line"; done) -f $qApiPath/pom.xml quarkus:dev
```

To start the WS
```bash
qWsPath=platforms/quarkus/ws
mvn $(test -f "$qWsPath/.javaenv" && sed -e "/^$/d" -e "/^#/d" $qWsPath/.javaenv | while read line; do printf "-D%s " "$line"; done) -f $qWsPath/pom.xml quarkus:dev
```

To start the UI (Tested with node 10)

Read https://www.apicur.io/studio/docs/setting-up-a-development-environment for the main KC setup steps
```bash
cd front-end/studio
yarn start
```
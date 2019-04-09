(Get-Content .env.template).replace('$HOST', $args[0]) | Set-Content .env
(Get-Content config/keycloak/apicurio-realm.json.template).replace('$HOST', $args[0]) | Set-Content config/keycloak/apicurio-realm.json
(Get-Content config/keycloak/microcks-realm.json.template).replace('$HOST', $args[0]) | Set-Content config/keycloak/microcks-realm.json

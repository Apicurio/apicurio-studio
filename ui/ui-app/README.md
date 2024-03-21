# Apicurio Studio UI

Apicurio Studio UI is a React based Single Page Application based on Patternfly 5.

## Requirements
This project requires node version 16.x.x and npm version > 8.3.x.
Prior to building this project make sure you have these applications installed.

## Development Scripts

Install development/build dependencies
`npm install`

Run a full build
`npm run build`

Initialize config-oidc.js
`./init-dev.sh none`

Note: the init-dev.sh script just copies an appropriate file from config/config-*.js to the right place.  You can 
either specify `local` or `3scale` as the argument to the script.  The choice depends on how you are running the 
back-end component.

Start the development server
`npm run dev`

Once the development server is running you can access the UI via http://localhost:8888

Note that you will need a registry back-end running for the UI to actually work.  The easiest way to do this is using
docker, but you could also run the registry from maven or any other way you choose.  Here is how you do it with Docker:

`docker run -it -p 8080:8080 apicurio/apicurio-studio:latest-snapshot`

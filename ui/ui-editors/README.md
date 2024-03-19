# apicurio-studio-editors
The standalone OpenAPI and AsyncAPI editors used in Apicurio Studio.

# Build and run (local)
To run the app locally, do the following:

```bash
$ npm install
$ npm run dev
```

Then open your browser (if it doesn't automatically open) to http://localhost:9011/?demo 

# Build and run (docker)
To run a production build using docker:

```bash
$ npm install
$ npm run build
$ docker build -t="apicurio/apicurio-studio-editors" --rm .
$ docker run --rm -it -p 8080:8080 apicurio/apicurio-studio-editors
```

Then open your browser to http://localhost:8080/?demo


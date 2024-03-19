## Description
This module is the user interface for Apicurio Studio.  It is a single page React application
using the following technology stack:

* Node/npm
* Typescript
* Vite
* Patternfly

The UI is broken up into multiple React applications that are composed together to provide the
full functionality.  This is done to separate concerns and more easily manage upgrade and CVEs.

The main UI component is `ui-app` and contains the bulk of the user experience.  Additional UI
components (for example `ui-editors`) provide specific functionality extracted and isolated for
reasons mentioned above.

## Building the UI
**Note**: You will need to have Node/NPM installed to work with the UI.  Version 16 or later of Node.js 
should be sufficient.

### Install Dependencies

```
npm install
```

This will result in dependencies being installed for all UI modules (e.g. `ui-app` **and** `ui-editors`).
You should see a `node_modules` in each directory if this completes successfully.

### Build
```
npm run build
```

This will transpile/build the code for all UI modules.  The result should be a `dist` directory in
each UI module.

### Package
```
npm run package
```

This will bundle up all of the UI modules into a single `dist` directory at the root of the `ui` 
directory.  This bundle is then suitable for including in e.g. a container image.

## Developing the UI

If you would like to contribute code changes to the UI, you will want to run the UI application(s)
in DEV mode.

**Warning**: For the dev version of the UI to work, you will need two files that are not checked into
version control:  `config.js` and `version.js`.  To ensure you have these files, run the `init-dev.sh`
script from the `ui-app` directory.  For more details see [ui-app/README.md](ui-app/README.md).

```
npm run dev
```

This will start the UI in dev mode, hosted (by default) on port 8888.  When running successfully,
you should see output similar to:

```
  VITE v4.4.11  ready in 149 ms

  ➜  Local:   http://127.0.0.1:8888/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

You can then access the UI on port 8888 or your localhost.

**Note**:  you will need the REST API running for the UI to work.  See the README at the root of
this repository for examples of how to do that.

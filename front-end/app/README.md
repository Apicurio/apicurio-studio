# Apiman Design Studio Front-End App

## Summary

The front-end application for the Design Studio is built using Angular 2.
This document attempts to detail how to set up the necessary toolchain to
make changes to this application.

Note: the Design Studio front end app is a very conventional angular 2 
application.  As a result, if you are familiar with angular 2 development
then you should have no problems!

## Prerequisite: Install Node.js and npm

If Node.js and npm aren't already on your machine, install them.  The
Design Studio, at the time of this writing, the following versions were
being used:

```bash
ewittman@raven ~/git/apiman/apiman-studio/front-end/app (master)
$ node -v
v5.6.0

ewittman@raven ~/git/apiman/apiman-studio/front-end/app (master)
$ npm -v
3.6.0
```

## Install npm packages

Once you have node.js and npm installed, you must use npm to install the
required packages.  This can be done like so:

```
$ npm install
npm WARN deprecated tough-cookie@2.2.2: ReDoS vulnerability parsing Set-Cookie https://nodesecurity.io/advisories/130
npm WARN deprecated lodash.assign@4.2.0: This package is deprecated. Use Object.assign.

> angular2-quickstart@1.0.0 postinstall C:\Users\ewittman\git\apiman\apiman-studio\front-end\app
> typings install

typings WARN deprecated 9/28/2016: "registry:dt/node#6.0.0+20160909174046" is deprecated (updated, replaced or removed)
typings WARN deprecated 10/3/2016: "registry:dt/jasmine#2.2.0+20160621224255" is deprecated (updated, replaced or removed)
typings WARN deprecated 9/14/2016: "registry:dt/core-js#0.0.0+20160725163759" is deprecated (updated, replaced or removed)

+-- core-js (global)
+-- jasmine (global)
`-- node (global)

angular2-quickstart@1.0.0 C:\Users\ewittman\git\apiman\apiman-studio\front-end\app
+-- @angular/common@2.0.0
+-- @angular/compiler@2.0.0
+-- @angular/core@2.0.0
+-- @angular/forms@2.0.0
+-- @angular/http@2.0.0
+-- @angular/platform-browser@2.0.0
+-- @angular/platform-browser-dynamic@2.0.0
+-- @angular/router@3.0.0
+-- @angular/upgrade@2.0.0
+-- angular2-in-memory-web-api@0.0.20
+-- bootstrap@3.3.7
+-- concurrently@2.2.0
| +-- bluebird@2.9.6
| +-- chalk@0.5.1
| | +-- ansi-styles@1.1.0
| | +-- escape-string-regexp@1.0.5
<<SNIP>>
| | |   +-- registry-auth-token@3.0.1
| | |   `-- registry-url@3.1.0
| | +-- lazy-req@1.1.0
| | +-- semver-diff@2.1.0
| | | `-- semver@5.3.0
| | `-- xdg-basedir@2.0.0
| |   `-- os-homedir@1.0.2
| +-- wordwrap@1.0.0
| `-- xtend@4.0.1
`-- zone.js@0.6.25

npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.14
npm WARN angular2-quickstart@1.0.0 No description
npm WARN angular2-quickstart@1.0.0 No repository field.

```

*NOTE*: If the typings folder doesn't show up after running npm install
(it usually does), you'll need to install it manually with the command:

```
npm run typings install
```

## Run It!

Now that everything is install, you can run the application in development
mode with the following command:

```
npm start
```

The result will be that npm will start up a lightweight HTTP server on port
3000 and serve up the application to your browser.  It will also monitor
any changes you make to source files and automatically refresh the browser
to show you the changes.
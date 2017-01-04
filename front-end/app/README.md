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
Design Studio, at the time of this writing, was using the following 
versions:

```bash
$ node -v
v5.6.0

$ npm -v
3.6.0
```

## Install npm packages

Once you have node.js and npm installed, you must use npm to install the
required packages.  This can be done like so:

```bash
$ npm install
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
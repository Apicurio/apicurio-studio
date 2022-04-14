# Apicurio Studio Public API

## What is it?
This project is an application, written in Typescript, to edit OpenAPI definitions.
[Apicurio](https://www.apicur.io/) itself is a fully featured web application to create,
edit, and publish API designs using the OpenAPI specification.  This public Apicurio
Studio API contains some Angular components that can be embedded in any Angular
application.  Currently the following components are exported via this public API:

* Apicurio OpenAPI Editor - the core editor in Apicurio for editing OpenAPI files

This project is licensed under the [Apache License 2.0](LICENSE).

## OpenAPI Versions
One of the design goals of Apicurio is to simultaneously support multiple versions of the OpenAPI
specification.  At the time of this writing, there are two versions of the OpenAPI specification:

* [OpenAPI Version 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
* [OpenAPI Version 3.0.1](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md)

Both of these versions are supported by Apicurio.  As new versions of the specification are
released, Apicurio will be updated to include support for them.

## Building the API
This section explains how to build, package, test, and publish the ApI.  If you are a developer
looking to make changes, this is a great place to start.

### Pre-Requisites
In order to do any work with the API you will need to install node.js.  As of the time of this
writing, the versions of node, npm. and yarn used were:

```
$ node -v
v5.6.0
$ npm -v
3.6.0
$ yarn --version
0.20.3
```

Make sure you download and install node/npm/yarn of at least the above versions.

### Clone and Configure
The first thing to do (obviously) is clone the repository.  Once you've cloned the git repository,
you must use yarn (or npm) to install all of the API's dependencies.  It is worth noting that the API
does not have any runtime dependencies, but it has several *build* dependencies (including typescript,
karma, jasmine, etc).  The following commands should help clone and configure:

```
git clone https://github.com/Apicurio/apicurio-studio.git
cd apicurio-studio/front-end/studio
yarn install
```

The result of this should be a number of dependencies downloaded and stored in a new `node_modules`
directory.


### Releasing a New Version
Once changes have been made and finalized, you're probably going to release a new version
of the API.  This is done by packaging the API into an npm compatible package and
publishing it (into npmjs.com).

#### Modify the Version
The first step is to increase the project's version number.  This can be done by modifing
the `package.json` file:

```json
{
  "name": "@apicurio/studio",
  "version": "1.0.1",
  "description": "A web application to help design restful APIs.",
  "license": "Apache-2.0"
}
```

Simply edit the `version` property, giving it the next logical value.  If the change is minor,
then modify the patch version.  If it's a more significant release, then modifying the major
or minor number may be appropriate.

#### Create the Package
Next, create the package (intended for release) by using yarn.  The command to create the
package is below:

```
yarn run package
```

This command will result in a new `dist` directory being created.  Within this directory
you will find a number of files, all of which must be uploaded to npmjs.com as the new
release of the API.

#### Publish to npmjs.com
Once everything has been packaged, you can simply use yarn/npm to publish the result into
npmjs.com:

```
yarn publish ./dist
```

#### Tag the Release in Git
If everything went well, you have now built, tested, packaged, and released a new version of
the API into npmjs.com for other projects to use.  The final step is to tag the source
code with the version that was just released.  For example, if you have just published version
1.2.4 of the API, you would tag it in the repository with these commands:

```
git tag -a -m 'Release 1.2.4' 1.2.4
git push origin 1.2.4
```

## Contribute Fixes and Features
This project is open source, and we welcome anybody who wants to participate and contribute!

### Get the code
The easiest way to get started with the code is to [create your own fork](http://help.github.com/forking/)
of this repository, and then clone your fork:

```bash
$ git clone git@github.com:<you>/apicurio-design-studio.git
$ cd apicurio-design-studio
$ git remote add upstream git://github.com/Apicurio/apicurio-design-studio.git
```

At any time, you can pull changes from the upstream and merge them onto your master:

```bash
$ git checkout master       # switches to the 'master' branch
$ git pull upstream master  # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
$ git push origin           # pushes all the updates to your fork, which should be in-sync with 'upstream'
```

The general idea is to keep your 'master' branch in-sync with the 'upstream/master'.

### Track Your Change
If you want to fix a bug or make any changes, please log an issue in the github
[Issue Tracker](https://github.com/Apicurio/apicurio-design-studio/issues) describing the bug or new
feature. Then we highly recommend making the changes on a topic branch named with the issue
number. For example, this command creates a branch for issue #7:

```bash
$ git checkout -b apicurio-design-studio-7
```

After you're happy with your changes and all unit tests run successfully, commit your changes
on your topic branch. Then it's time to check for and pull any recent changes that were made in
the official repository since you created your branch:

```bash
$ git checkout master         # switches to the 'master' branch
$ git pull upstream master    # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
$ git checkout apicurio-design-studio-7  # switches to your topic branch
$ git rebase master           # reapplies your changes on top of the latest in master
                              # (i.e., the latest from master will be the new base for your changes)
```

If the pull grabbed a lot of changes, you should rerun the tests to make sure your changes are
still good.  You can then either [create patches](http://progit.org/book/ch5-2.html) (one file
per commit, saved in `~/apicurio-design-studio-7`) with:

```bash
$ git format-patch -M -o ~/apicurio-design-studio-7 orgin/master
```

and upload them to the issue, or you can push your topic branch and its changes into your public
fork repository with:

```bash
$ git push origin apicurio-design-studio-7         # pushes your topic branch into your public fork
```

and [generate a pull-request](http://help.github.com/pull-requests/) for your changes.  The latter
is definitely the preferred mechanism for submitting changes.

The reason we prefer pull-requests is that we can review the proposed changes, comment on them,
discuss them with you, and likely merge the changes right into the official repository.  No muss,
no fuss!

Please try to create one commit per feature or fix, generally the easiest way to do this is
via [git squash](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits).
This makes reverting changes easier, and avoids needlessly polluting the repository history with
checkpoint commits.

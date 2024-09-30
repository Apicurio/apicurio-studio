![Verify Build Workflow](https://github.com/Apicurio/apicurio-studio/workflows/Build%20%26%20Verify/badge.svg)
[![Join the chat at https://apicurio.zulipchat.com/](https://img.shields.io/badge/zulip-join_chat-brightgreen.svg)](https://apicurio.zulipchat.com/)

![Apicurio Studio](.assets/apicurio_studio_logo_default.svg)

# The apicurio-studio project (Open Source API Design Studio)

## Summary

This is the official Git repository for the Apicurio Studio project:  http://www.apicur.io/studio

The Apicurio Studio project is an API design studio that can be used to create
new or edit existing API designs (using specifications like OpenAPI or AsyncAPI).

## Get the code

The easiest way to get started with the code is to [create your own fork](http://help.github.com/forking/)
of this repository, and then clone your fork:
```bash
  $ git clone git@github.com:<you>/apicurio-studio.git
  $ cd apicurio-studio
  $ git remote add upstream git://github.com/apicurio/apicurio-studio.git
```
At any time, you can pull changes from the upstream and merge them onto your main:
```bash
  $ git checkout main               # switches to the 'main' branch
  $ git pull upstream main          # fetches all 'upstream' changes and merges 'upstream/main' onto your 'main' branch
  $ git push origin                   # pushes all the updates to your fork, which should be in-sync with 'upstream'
```
The general idea is to keep your 'main' branch in-sync with the 'upstream/main'.

## Building apicurio-studio

### Requirements
- Node.js and NPM

### Building
Use standard NPM based UI tooling to build the project:

```bash
cd ui
npm install
npm run build
npm run package
```

## Contribute fixes and features

Apicurio Studio is open source, and we welcome anybody who wants to participate and contribute!

If you want to fix a bug or make any changes, please [log an issue in GitHub](https://github.com/apicurio/apicurio-studio/issues) describing the bug or new feature. Then we highly recommend making the changes on a topic branch named with the GitHub issue number. For example, this command creates a branch for an issue with number 1234:

```bash
  $ git checkout -b apicurio-studio-1234
```

After you're happy with your changes and a full build (with unit tests) runs successfully, commit your
changes on your topic branch. Then it's time to check for and pull any recent changes that were made in
the official repository:

```bash
  $ git checkout main               # switches to the 'main' branch
  $ git pull upstream main          # fetches all 'upstream' changes and merges 'upstream/main' onto your 'main' branch
  $ git checkout apicurio-studio-1234   # switches to your topic branch
  $ git rebase main                 # reapplies your changes on top of the latest in main
                                      # (i.e., the latest from main will be the new base for your changes)
```

If the pull grabbed a lot of changes, you should rerun your build to make sure your changes are still good.
You can then either [create patches](http://progit.org/book/ch5-2.html) (one file per commit, saved in `~/apicurio-studio-1234`) with

```bash
  $ git format-patch -M -o ~/apicurio-studio-1234 orgin/main
```

and upload them to the JIRA issue, or you can push your topic branch and its changes into your public fork repository

```bash
  $ git push origin apicurio-studio-1234         # pushes your topic branch into your public fork of apicurio-studio
```

and [generate a pull-request](http://help.github.com/pull-requests/) for your changes.

We prefer pull-requests, because we can review the proposed changes, comment on them,
discuss them with you, and likely merge the changes right into the official repository.

Please try to create one commit per feature or fix, generally the easiest way to do this is via [git squash](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits).
This makes reverting changes easier, and avoids needlessly polluting the repository history with checkpoint commits.

## Code Formatting

When you are hacking on some apicurio-studio code, we'd really appreciate it if you followed the
apicurio-studio coding standards.  The project uses `eslint` to ensure these standards.  You can
check your code using:

```bash
cd ui
npm run lint
```
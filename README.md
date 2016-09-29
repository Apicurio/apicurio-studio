# The apiman-studio project (Open Source API Design Studio)

## Summary

This is the official Git repository for the apiman studio project:  http://studio.apiman.io/

The apiman studio project is a standalone API Design Studio that can be used to create
new or edit existing API designs (using the OpenAPI specification).

## Get the code

The easiest way to get started with the code is to [create your own fork](http://help.github.com/forking/)
of this repository, and then clone your fork:

  $ git clone git@github.com:<you>/apiman-studio.git
  $ cd apiman-studio
  $ git remote add upstream git://github.com/apiman/apiman-studio.git

At any time, you can pull changes from the upstream and merge them onto your master:

  $ git checkout master               # switches to the 'master' branch
  $ git pull upstream master          # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
  $ git push origin                   # pushes all the updates to your fork, which should be in-sync with 'upstream'

The general idea is to keep your 'master' branch in-sync with the 'upstream/master'.

## Building apiman-studio

### Requirements
- Maven 3.x
- Java 8+

The following command compiles all the code, installs the JARs into your local Maven repository, and runs all of the unit tests:

  $ mvn clean install

## Quickstart (i.e. How To Run It)

TBD

## Contribute fixes and features

Apiman Studio is open source, and we welcome anybody who wants to participate and contribute!

If you want to fix a bug or make any changes, please log an issue in the [apiman-studio JIRA](http://issues.jboss.org/browse/APISTUDIO) describing the bug
or new feature. Then we highly recommend making the changes on a topic branch named with the JIRA issue number. For example, this command creates
a branch for the APISTUDIO-1234 issue:

  $ git checkout -b apiman-studio-1234

After you're happy with your changes and a full build (with unit tests) runs successfully, commit your
changes on your topic branch. Then it's time to check for and pull any recent changes that were made in
the official repository:

  $ git checkout master               # switches to the 'master' branch
  $ git pull upstream master          # fetches all 'upstream' changes and merges 'upstream/master' onto your 'master' branch
  $ git checkout apiman-studio-1234   # switches to your topic branch
  $ git rebase master                 # reapplies your changes on top of the latest in master
                                        (i.e., the latest from master will be the new base for your changes)

If the pull grabbed a lot of changes, you should rerun your build to make sure your changes are still good.
You can then either [create patches](http://progit.org/book/ch5-2.html) (one file per commit, saved in `~/apiman-studio-1234`) with

  $ git format-patch -M -o ~/apiman-studio-1234 orgin/master

and upload them to the JIRA issue, or you can push your topic branch and its changes into your public fork repository

  $ git push origin apiman-studio-1234         # pushes your topic branch into your public fork of apiman-studio

and [generate a pull-request](http://help.github.com/pull-requests/) for your changes.

We prefer pull-requests, because we can review the proposed changes, comment on them,
discuss them with you, and likely merge the changes right into the official repository.

Please try to create one commit per feature or fix, generally the easiest way to do this is via [git squash](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits).
This makes reverting changes easier, and avoids needlessly polluting the repository history with checkpoint commits.

## Code Formatting

When you are hacking on some apiman-studio code, we'd really appreciate it if you followed the
apiman-studio coding standards.  If you're using Eclipse, you can find a code formatter config
file here:

tools/src/eclipse/apiman-eclipse-formatter.xml

You should be able to import that guy straight into Eclipse by going to
*Window->Preferences :: Java/Code Style/Formatter*

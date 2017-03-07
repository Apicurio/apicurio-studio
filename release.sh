#!/bin/sh

set -e

echo "---------------------------------------------------"
echo " Releasing API Design Studio.  Many steps to follow."
echo " Please play along at home..."
echo "---------------------------------------------------"
echo ""
echo ""

echo "---------------------------------------------------"
echo " Tell me what version we're releasing!"
echo "---------------------------------------------------"
echo ""

RELEASE_VERSION=$1
DEV_VERSION=$2
BRANCH=$3
GPG_PASSPHRASE=$4

if [ "x$RELEASE_VERSION" = "x" ]
then
  read -p "Release Version: " RELEASE_VERSION
fi

if [ "x$DEV_VERSION" = "x" ]
then
  read -p "New Development Version: " DEV_VERSION
fi

if [ "x$BRANCH" = "x" ]
then
  read -p "Release Branch: [master] " BRANCH
fi
if [ "x$BRANCH" = "x" ]
then
  BRANCH=master
fi

if [ "x$GPG_PASSPHRASE" = "x" ]
then
  read -p "GPG Passphrase: " GPG_PASSPHRASE
fi


echo "######################################"
echo "Release Version: $RELEASE_VERSION"
echo "Dev Version: $DEV_VERSION"
echo "Release Branch: $BRANCH"
echo "######################################"
echo ""


mvn clean package

mvn versions:set -DnewVersion=$RELEASE_VERSION
find . -name '*.versionsBackup' -exec rm -f {} \;
mvn clean install

git add .
git commit -m "Prepare for release v$RELEASE_VERSION"
git push origin $BRANCH
git tag -a -s -m "Tagging release v$RELEASE_VERSION" v$RELEASE_VERSION
git push origin v$RELEASE_VERSION

echo "Signing and Archiving the Quickstart ZIP"
mkdir releases
cp front-end/quickstart/target/api-design-studio-$RELEASE_VERSION-quickstart.zip releases/.
gpg --armor --detach-sign releases/api-design-studio-$RELEASE_VERSION-quickstart.zip.asc


mvn versions:set -DnewVersion=$DEV_VERSION
find . -name '*.versionsBackup' -exec rm -f {} \;
git add .
git commit -m "Update to next development version: $DEV_VERSION"
git push origin $BRANCH

echo ""
echo ""
echo "---------------------------------------------------"
echo " ALL DONE!"
echo ""
echo " Remaining release tasks:"
echo "   * Update the website"
echo "   * Send a tweet!"
echo "   * Send an email to apiman-users mailing list"
echo "---------------------------------------------------"


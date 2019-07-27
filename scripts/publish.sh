#!/bin/bash

# This script runs some validation, and then publishes the cdn package to NPM.
# It's only intended to be run from a Travis build.

set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'CMD=${last_command} RET=$?; if [[ $RET -ne 0 ]]; then echo "\"${CMD}\" command failed with exit code $RET."; fi' EXIT
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH/../packages/cdn

# Make sure the git tag matches the version in client-js/package.json.
# If not, quit early.
PACKAGE_NAME="$(cat ./package.json | grep name | sed 's/[name": ,]*//' | sed 's/["\, ]*$//')"
PACKAGE_VERSION="$(cat ./package.json | grep version | sed 's/[version": ,]*//' | sed 's/["\, ]*$//')"
if [[ ! ${PACKAGE_VERSION} = ${TRAVIS_TAG} ]]; then
  echo "Git tag \"${TRAVIS_TAG}\" does not match package.json version \"${PACKAGE_VERSION}\". \"${PACKAGE_NAME}\" will not be published"
  exit 1
fi

echo "Publishing version ${PACKAGE_VERSION} of \"${PACKAGE_NAME}\" to https://registry.npmjs.org/"
rm -f ~/.npmrc
echo "@wikisophia:registry=https://registry.npmjs.org/" >> ~/.npmrc
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
npm run build:prod
npm publish

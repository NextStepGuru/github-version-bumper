#!/bin/bash
#
export CURRENT_VERSION=$(cat version.json | jq -r ".version")
CURRENT_VERSION=`npx semver "$CURRENT_VERSION" -i`
echo "testing...$CURRENT_VERSION"
echo "`jq '.version=\"'$CURRENT_VERSION'\"' version.json`" > version.json
export CURRENT_VERSION=$(cat version.json | jq -r ".version")
echo "`jq '.version=\"'$CURRENT_VERSION'\"' package.json`" > package.json
parcel build ./src/index.ts --no-source-maps --target node
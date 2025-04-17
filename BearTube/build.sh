#!/bin/bash


set -o pipefail
set -eu

version=$(jq -r .version "Shared (Extension)/Resources/manifest.json")

# Make sure we made some effort to label our releases.
git tag -v "v$version"

# Normalize versions. There might be a better way.
sed -i '' -e "s/MARKETING_VERSION = .*;/MARKETING_VERSION = $version;/" ./BearTube.xcodeproj/project.pbxproj


xcodebuild -derivedDataPath ./Build -project BearTube.xcodeproj -scheme "BearTube (macOS)" clean

# Safari Extensions must be signed.
# CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
xcodebuild -derivedDataPath ./Build -project BearTube.xcodeproj -scheme "BearTube (macOS)" build -configuration release


cd ./Build/Products/Release
zip -9ry BearTube-$version.zip BearTube.app
shasum -a 256 BearTube-$version.zip > BearTube-$version.zip.sha256

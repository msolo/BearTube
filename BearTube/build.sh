#!/bin/bash


set -o pipefail
set -eux

xcodebuild -derivedDataPath ./Build -project BearTube.xcodeproj -scheme "BearTube (macOS)" clean

# Safari Extensions must be signed.
# CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
xcodebuild -derivedDataPath ./Build -project BearTube.xcodeproj -scheme "BearTube (macOS)" build -configuration release

cd ./Build/Products/Release
zip -9ry BearTube.zip BearTube.app
shasum -a 256 BearTube.zip > BearTube.zip.sha256

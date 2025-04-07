#!/bin/bash

echo "No longer working in Chrome without some sort of special signing that seems poorly documented."
exit 1

set -o pipefail
set -eux

version=$(jq -r .version "./BearTube/manifest.json")

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --pack-extension=./BearTube --pack-extension-key=$HOME/.init/keys/BearTube.pem

mv BearTube.crx BearTube-$version.crx
shasum -a 256 BearTube-$version.crx > BearTube-$version.crx.sha256

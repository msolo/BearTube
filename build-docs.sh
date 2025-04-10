#!/bin/bash

# Reformat README to work better on GitHub Pages, which is annoyingly
# different than the inline rendering.

cp README.md docs/index.md
sed -i "" -e 's|"docs/|"|g' docs/index.md
sed -i "" -e "/# BearTube/d" docs/index.md
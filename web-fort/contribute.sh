#!/bin/bash

GREEN="\x1B[92m"
RED="\x1B[91m"
NC="\x1B[39m"

installed() {
  echo -n "$1: "
  which -s ${2:-$1} && echo -e "${GREEN}installed${NC}" || echo -e "${RED}not installed${NC}"
}

defined() {
  echo -n "$1: "
  [ ! -z $2 ] && echo -e "${GREEN}defined${NC}" || echo -e "${RED}undefined${NC}"
}

cat <<EOF
This script will check your local environment and verify you have the tools necessary for developing on webfort
The following tools are required to run webfort locally:

EOF

installed "yarn (https://yarnpkg.com/en/docs/install)" yarn
installed "docker (https://docs.docker.com/install/)" docker-compose
installed "mysql client (varies by OS; \`brew install mysql\` on macOS)" mysql
defined "\$WEBFORT_THEME_ROOT (export WEBFORT_THEME_ROOT=$(cd "$(dirname "$BASH_SOURCE")" && pwd))" $WEBFORT_THEME_ROOT
defined "\$WEBFORT_ROOT (export WEBFORT_ROOT=<path where you unzipped the production backup>)" $WEBFORT_ROOT

cat <<EOF

You will also need access to a production backup. Check out `dirname $BASH_SOURCE`/README.md for more info
Once you have met all the prerequisites, following the "Getting Started" steps in `dirname $BASH_SOURCE`/README.md
EOF
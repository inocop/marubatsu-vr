#!/usr/bin/env bash

set -euxo pipefail

RELEASE_DIR="/marubatsu/marubatsu-vr"

pushd ${RELEASE_DIR}
  sudo git fetch
  sudo git reset --hard origin/master
popd

pushd ${RELEASE_DIR}/src/docker/vr_prd
  sudo docker-compose build
  sudo docker-compose restart
popd

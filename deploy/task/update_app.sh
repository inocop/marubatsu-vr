#!/usr/bin/env bash

set -eux

RELEASE_DIR="/release/marubatsu-vr"

pushd ${RELEASE_DIR}
  git checkout master
  git pull
popd

pushd ${RELEASE_DIR}/src/docker
  docker-compose build
  docker-compose restart
popd




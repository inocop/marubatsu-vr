#!/usr/bin/env bash

set -euxo pipefail

cd `dirname $0`
if [ "${FINGERPRINT-UNDEFINE}" = "UNDEFINE" ]; then
  # PCからのデプロイ
  source ./config/production
  ssh -i ${SECRET_KEY} ${REMOTE_USER}@${REMOTE_SERVER} bash < task/update_app.sh
else
  # CircleCIからのデプロイ
  ssh ${REMOTE_USER}@${REMOTE_SERVER} bash < task/update_app.sh
fi

echo "Deployment succeeded"

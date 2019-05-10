#!/usr/bin/env bash

set -euxo pipefail

cd `dirname $0`
source ./config/production

# デプロイ
ssh -i ${SECRET_KEY} ${REMOTE_USER}@${REMOTE_SERVER} bash < task/update_app.sh

echo "Deployment succeeded"

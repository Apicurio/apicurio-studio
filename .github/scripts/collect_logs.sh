#!/bin/bash
set -e
echo "Collecting tests logs"
mkdir -p artifacts/logs
mkdir -p artifacts/failsafe-reports

DIR="integration-tests/testsuite/target"
if [ -d "$DIR" ]; then
    echo "Collecting testsuite logs"
    cp -r ${DIR}/logs artifacts
    cp -r ${DIR}/failsafe-reports artifacts
fi

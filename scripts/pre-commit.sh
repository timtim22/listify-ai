#!/usr/bin/env bash

echo "Running pre-commit hooks"

./scripts/brakeman.sh

if [ $? -ne 0 ]; then
  echo "Brakeman warnings/errors must be addressed before commit, see generated output-brakeman.json file."
  exit 1
fi

./scripts/test.sh

if [ $? -ne 0 ]; then
  echo "All tests must pass before commit."
  exit 1
fi
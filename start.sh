#!/usr/bin/env bash

set -Eeuo pipefail

readonly PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_FILE="${PROJECT_DIR}/.devcontainer/devcontainer.json"
readonly HOST_WORKSPACE="${HOME:?HOME is not set}/workspace"

if ! command -v docker >/dev/null 2>&1; then
  printf 'Error: docker was not found.\n' >&2
  exit 1
fi

if ! command -v devcontainer >/dev/null 2>&1; then
  printf 'Error: devcontainer CLI was not found.\n' >&2
  printf 'Run "Dev Containers: Install devcontainer CLI" in VS Code.\n' >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  printf 'Error: unable to connect to the Docker daemon.\n' >&2
  exit 1
fi

mkdir -p -- "${HOST_WORKSPACE}"

# devcontainer.json uses this value both as the build-time username and as the
# user selected when the container is created.
export USER="${USER:-$(id -un)}"

devcontainer up \
  --workspace-folder "${PROJECT_DIR}" \
  --config "${CONFIG_FILE}"

printf '\nThe container is ready. Run the following command in VS Code:\n'
printf 'Dev Containers: Attach to Running Container...\n'

#!/usr/bin/env bash

set -Eeuo pipefail

readonly PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_FILE="${PROJECT_DIR}/.devcontainer.json"
readonly HOST_WORKSPACE="${HOME:?HOME is not set}/workspace"
readonly IMAGE_NAME="personal-devcontainer:local"
readonly DATA_HOME="${PROJECT_DIR}/data/home"

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

mkdir -p -- "${HOST_WORKSPACE}" "${DATA_HOME}"

printf 'Building the development container image...\n'
docker build \
  --build-arg USERNAME=dev \
  --tag "${IMAGE_NAME}" \
  "${PROJECT_DIR}"

if [[ -z "$(find "${DATA_HOME}" -mindepth 1 -print -quit)" ]]; then
  printf 'Initializing the development container home directory...\n'
  temporary_container="$(docker create "${IMAGE_NAME}")"

  cleanup() {
    docker rm --force "${temporary_container}" >/dev/null 2>&1 || true
  }
  trap cleanup EXIT

  docker cp "${temporary_container}:/home/dev/." "${DATA_HOME}"
  docker rm "${temporary_container}" >/dev/null
  trap - EXIT
fi

export PERSONAL_DEVCONTAINER_HOME="${DATA_HOME}"

devcontainer up \
  --workspace-folder "${HOST_WORKSPACE}" \
  --config "${CONFIG_FILE}"

printf '\nThe container is ready. Run the following command in VS Code:\n'
printf 'Dev Containers: Attach to Running Container...\n'

#!/usr/bin/env bash

set -Eeuo pipefail

readonly PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_FILE="${PROJECT_DIR}/.devcontainer/devcontainer.json"
readonly HOST_WORKSPACE="${HOME:?HOME is not set}/workspace"

if ! command -v docker >/dev/null 2>&1; then
  printf '错误：未找到 docker。\n' >&2
  exit 1
fi

if ! command -v devcontainer >/dev/null 2>&1; then
  printf '错误：未找到 devcontainer CLI。\n' >&2
  printf '请在 VS Code 中运行 “Dev Containers: Install devcontainer CLI”。\n' >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  printf '错误：无法连接 Docker daemon。\n' >&2
  exit 1
fi

mkdir -p -- "${HOST_WORKSPACE}"

# devcontainer.json uses this value both as the build-time username and as the
# user selected when the container is created.
export USER="${USER:-$(id -un)}"

devcontainer up \
  --workspace-folder "${PROJECT_DIR}" \
  --config "${CONFIG_FILE}"

printf '\n容器已就绪。请在 VS Code 中运行：\n'
printf 'Dev Containers: Attach to Running Container...\n'

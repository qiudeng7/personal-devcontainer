#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

printf 'Installing agent configuration...\n'
sh "$project_dir/agent/main.sh"

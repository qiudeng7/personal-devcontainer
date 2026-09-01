#!/bin/sh

set -eu

repo="larksuite/cli"
binary_name="lark-cli"
install_dir="${LARK_CLI_INSTALL_DIR:-"${HOME:?HOME is not set}/.local/bin"}"
target="$install_dir/$binary_name"
os_name="linux"
arch_name="amd64"

version=$(curl -fsSL "https://api.github.com/repos/$repo/releases/latest" |
    sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"v\{0,1\}\([^"]*\)".*/\1/p' |
    sed -n '1p')

if [ -z "$version" ]; then
    printf 'Error: failed to resolve the latest lark-cli release.\n' >&2
    exit 1
fi

asset="$binary_name-$version-$os_name-$arch_name.tar.gz"
base_url="https://github.com/$repo/releases/download/v$version"
tmp_dir=$(mktemp -d "${TMPDIR:-/tmp}/lark-cli.XXXXXX")
archive="$tmp_dir/$asset"
checksums="$tmp_dir/checksums.txt"
extract_dir="$tmp_dir/extract"

cleanup() {
    rm -R "$tmp_dir" 2>/dev/null || true
}
trap cleanup EXIT HUP INT TERM

mkdir -p "$extract_dir"
curl -fsSL "$base_url/$asset" -o "$archive"
curl -fsSL "$base_url/checksums.txt" -o "$checksums"

expected=$(grep "[[:space:]]\\*\\{0,1\\}$asset\$" "$checksums" |
    sed 's/[[:space:]].*//' |
    sed -n '1p')
actual=$(sha256sum "$archive" | sed 's/[[:space:]].*//')

if [ -z "$expected" ] || [ "$actual" != "$expected" ]; then
    printf 'Error: lark-cli checksum verification failed.\n' >&2
    exit 1
fi

tar -xzf "$archive" -C "$extract_dir" "$binary_name"
mkdir -p "$install_dir"
mv "$extract_dir/$binary_name" "$target"
chmod +x "$target"

if ! "$target" --version >/dev/null 2>&1; then
    printf 'Error: lark-cli failed its version check.\n' >&2
    exit 1
fi

printf 'lark-cli: installed %s to %s\n' "$version" "$target"

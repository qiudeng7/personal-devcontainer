#!/bin/sh

set -eu

agent_source_root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
home_dir=${HOME:?HOME is not set}
codex_root="$home_dir/.codex"
codex_skills_root="$codex_root/skills"
agent_skills_root="$home_dir/.agents/skills"
installed_skill_names=

install_skill() {
    skill_source=$1
    skill_name=${skill_source##*/}

    case " $installed_skill_names " in
        *" $skill_name "*)
            printf 'Error: duplicate skill name: %s\n' "$skill_name" >&2
            exit 1
            ;;
    esac

    installed_skill_names="$installed_skill_names $skill_name"
    codex_skill_target="$codex_skills_root/$skill_name"
    agent_skill_target="$agent_skills_root/$skill_name"

    rm -rf -- "$codex_skill_target" "$agent_skill_target"
    cp -R "$skill_source" "$codex_skill_target"
    ln -s "$codex_skill_target" "$agent_skill_target"
}

install_skills() {
    skills_source_root=$1

    for skill_source in "$skills_source_root"/*; do
        [ -d "$skill_source" ] || continue

        if [ -f "$skill_source/SKILL.md" ]; then
            install_skill "$skill_source"
        else
            install_skills "$skill_source"
        fi
    done
}

printf 'Installing Codex...\n'
curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=true sh

if ! command -v codex >/dev/null 2>&1; then
    printf 'Error: Codex installation failed.\n' >&2
    exit 1
fi

printf 'Installing Codex configuration...\n'
mkdir -p "$codex_skills_root" "$agent_skills_root"
cp "$agent_source_root/AGENTS.md" "$codex_root/AGENTS.md"
cp "$agent_source_root/config.toml" "$codex_root/config.toml"

install_skills "$agent_source_root/skills"

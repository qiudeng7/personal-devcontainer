FROM gh-proxy.org/docker/archlinux:base

# 用户名和权限见 docs/development/user.md
ARG USERNAME
ARG USER_UID=1000
ARG USER_GID=1000

RUN pacman --sync --refresh --sysupgrade --noconfirm \
    && pacman --sync --noconfirm --needed \
        ca-certificates \
        curl \
        sudo \
        tzdata \
    && pacman --sync --clean --clean --noconfirm \
    && groupadd --gid "${USER_GID}" "${USERNAME}" \
    && useradd \
        --uid "${USER_UID}" \
        --gid "${USER_GID}" \
        --create-home \
        --shell /bin/bash \
        "${USERNAME}" \
    && printf '%s ALL=(root) NOPASSWD:ALL\n' "${USERNAME}" > "/etc/sudoers.d/${USERNAME}" \
    && chmod 0440 "/etc/sudoers.d/${USERNAME}" \
    && mkdir -p "/home/${USERNAME}/workspace" \
    && chown -R "${USER_UID}:${USER_GID}" "/home/${USERNAME}"

ENV HOME=/home/${USERNAME}
ENV PATH=/home/${USERNAME}/.local/bin:${PATH}

USER ${USERNAME}

COPY --chown=${USERNAME}:${USERNAME} . /personal-devcontainer

RUN sh /personal-devcontainer/main.sh \
    && rm -rf /personal-devcontainer

WORKDIR /home/${USERNAME}/workspace

CMD ["sleep", "infinity"]

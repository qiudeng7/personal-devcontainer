FROM gh-proxy.org/docker/archlinux:base

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

RUN pacman --sync --refresh --sysupgrade --noconfirm \
    && pacman --sync --noconfirm --needed \
        ca-certificates \
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

USER ${USERNAME}
WORKDIR /home/${USERNAME}/workspace

CMD ["sleep", "infinity"]

FROM gh-proxy.org/docker/archlinux:base

# This Dockerfile is parameterized by devcontainer.json. USERNAME is selected
# at build time; USER_UID and USER_GID are initial image values that Dev
# Containers may align with the host user when it creates the container.
ARG USERNAME
ARG USER_UID
ARG USER_GID

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

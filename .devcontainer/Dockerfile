FROM gh-proxy.org/docker/archlinux:base

# All build arguments below are supplied by devcontainer.json.

# Name of the non-root account created in the image. It is also used for the
# account's home directory and as the container's default user.
ARG USERNAME

# Initial numeric user ID assigned to USERNAME while building the image. Dev
# Containers may align it with the host user's UID when creating the container.
ARG USER_UID

# Initial numeric primary group ID assigned to USERNAME while building the
# image. Dev Containers may align it with the host user's GID at creation time.
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

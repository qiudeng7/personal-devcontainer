FROM gh-proxy.org/docker/archlinux:base

# 以下所有构建参数均由 devcontainer.json 提供。

# 镜像中创建的非 root 用户名，同时用于确定该用户的主目录和容器默认用户。
ARG USERNAME

# 构建镜像时分配给 USERNAME 的初始用户 ID。Dev Containers 创建容器时可能会将其
# 调整为宿主机用户的 UID。
ARG USER_UID

# 构建镜像时分配给 USERNAME 的初始主组 ID。Dev Containers 创建容器时可能会将其
# 调整为宿主机用户的 GID。
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

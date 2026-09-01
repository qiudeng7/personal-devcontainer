FROM gh-proxy.org/docker/archlinux:base

# 镜像中创建的用户名，由 devcontainer.json 提供。用户名写入镜像后保持不变。
ARG USERNAME

# UID/GID 仅作为构建基础镜像时创建用户的临时默认值。启用
# updateRemoteUserUID 后，Dev Containers 创建开发容器时会自动将其替换为
# 创建者在宿主机上的 UID/GID。
ARG USER_UID=1000
ARG USER_GID=1000

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

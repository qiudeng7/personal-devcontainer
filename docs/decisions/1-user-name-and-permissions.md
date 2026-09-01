# 1. 固定用户名与权限映射

- 状态：已接受
- 日期：2026-09-01

## 背景

开发容器需要挂载宿主机的 `~/workspace`，并允许宿主机和容器同时修改其中的
文件。在 Linux 上，文件所有权由数字 UID/GID 决定，用户名只是容器内
`/etc/passwd` 对数字身份的命名。

如果在构建时把宿主机用户名传入镜像，那么本地构建可以得到同名用户，但由
GitHub Actions 等环境生成的预构建镜像只会包含构建机用户。其他使用者创建
容器时，`containerUser` 和 `remoteUser` 可能指向镜像中不存在的用户名。

Dev Containers 的 `updateRemoteUserUID` 只负责在容器创建阶段调整已有用户的
UID/GID，不会重命名用户，也不会在每次 Attach 时重新调整身份。

## 决策

镜像和容器内的用户名统一固定为 `dev`：

```jsonc
{
  "build": {
    "args": {
      "USERNAME": "dev",
      "USER_UID": "1000",
      "USER_GID": "1000"
    }
  },
  "containerUser": "dev",
  "remoteUser": "dev",
  "updateRemoteUserUID": true
}
```

构建阶段创建 `dev:1000:1000`。Dev Containers 在 Linux 宿主机上创建容器时，
再将 `dev` 的 UID/GID 调整为当前宿主机用户的 UID/GID。容器内的用户名和主目录
始终为 `dev` 与 `/home/dev`，数字权限则跟随创建该容器的宿主机用户。

`1000:1000` 是可预测的镜像初始值，不是最终运行权限。Linux 用户在镜像中必须
拥有 UID/GID；即使 Dockerfile 不显式指定，`useradd` 也会分配一组数字身份。

## 生命周期

```text
构建镜像
  创建 dev:1000:1000
        │
        ▼
创建容器
  基于原镜像生成 UID/GID 对齐后的派生镜像
  使用派生镜像创建容器并挂载宿主机 workspace
        │
        ▼
Attach
  继续使用已经确定的 dev 及其 UID/GID，不再修改身份
```

### UID/GID 派生镜像

`updateRemoteUserUID` 不会直接修改已经发布的基础镜像。Dev Container CLI 会在
真正创建容器前，以基础镜像为起点生成一个本地派生镜像：

1. 从 `/etc/passwd` 读取 `dev` 原有的 UID、GID 和主目录。
2. 获取执行 `devcontainer up` 的宿主机用户 UID/GID。
3. 如果两组数字不同，修改派生镜像中 `/etc/passwd` 和 `/etc/group` 的记录。
4. 将 `/home/dev` 内文件的所有者递归改为新的 UID/GID。
5. 使用派生镜像创建容器，再挂载宿主机的 `~/workspace`。

当前参考实现可见 Dev Container CLI 的
[`updateUID.Dockerfile`](https://github.com/devcontainers/cli/blob/main/scripts/updateUID.Dockerfile)。

bind mount 中的文件不会复制进镜像，也不由上述 `chown` 迁移。它们始终保留
宿主机的数字所有权；调整后的 `dev` 恰好使用相同 UID/GID，因此宿主机和容器
可以用同一权限读写 workspace。

### 镜像内文件所有权

UID/GID 对齐只会递归迁移 `dev` 的主目录，不会扫描镜像中的所有路径。因此：

- 用户级工具、缓存和配置应放在 `/home/dev` 下，并由 `dev` 所有。
- `/usr`、`/opt`、`/usr/local` 等系统路径中的工具应由 `root:root` 所有，并通过
  普通读取和执行权限供 `dev` 使用。
- 不要在构建阶段把 HOME 之外的文件设置为 `dev:1000:1000`，否则创建阶段修改
  UID/GID 后，这些文件仍保留旧数字所有权。
- 不要为了对齐身份而递归修改挂载进来的 workspace；其所有权由宿主机管理。

### 冲突边界

如果镜像中已有其他用户占用宿主机目标 UID，参考 CLI 会跳过 UID/GID 更新，
最终可能无法正确访问 bind mount。如果目标 GID 已被其他组占用，参考 CLI 会
保留 `dev` 原来的 GID。向镜像增加系统用户或组时，应避免占用常见的普通用户
UID/GID。

每位宿主机用户应创建自己的容器。不同用户分别创建容器时，容器内都显示为
`dev`，但写入 bind mount 的文件会在宿主机上分别属于各自的 UID/GID。

同一个已经运行的容器不能在不同宿主机用户 Attach 时动态切换 UID/GID。如果
另一名用户直接连接现有容器，进程仍使用该容器创建时确定的身份。

## 影响

- 同一份预构建镜像可以被用户名不同的宿主机用户复用。
- 容器内用户名不会与宿主机用户名一致，但不影响 bind mount 的文件权限。
- 用户主目录和工具配置路径稳定为 `/home/dev`。
- `containerUser` 和 `remoteUser` 始终能引用镜像中确定存在的用户。
- 必须通过 `devcontainer up` 创建容器；普通 `docker run` 后再 Attach 不会自动
  应用 `updateRemoteUserUID`。
- 修改宿主机用户或其 UID/GID 后，需要重新创建容器，而不是只重新 Attach。
- 基础镜像仍保留 `dev:1000:1000`；对齐后的派生镜像属于本机创建流程，不应作为
  通用镜像发布。

## 未采用的方案

没有采用“构建时使用宿主机用户名”，因为它使预构建镜像与构建机身份绑定。

没有采用“容器启动时动态重命名用户”，因为 Dev Containers 没有原生提供该
行为，自定义 root entrypoint 会增加权限处理、启动顺序和 Attach 竞态的复杂度。

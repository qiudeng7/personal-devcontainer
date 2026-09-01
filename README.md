# Personal Dev Container

一个面向个人多项目开发的长期运行 Dev Container。它将宿主机的
`~/workspace` 挂载到容器内的 `~/workspace`，用于共享一套相对统一的开发环境。

## 当前状态

项目目前只包含基础骨架：

- 基于 Arch Linux 的容器镜像，并通过 `gh-proxy.org/docker` 加速拉取；
- 容器用户与宿主机用户名一致；
- Dev Containers 创建容器时同步宿主机 UID/GID，避免共享文件的权限问题；
- 挂载宿主机的 `~/workspace`；
- 共享宿主机时区，系统时间由宿主机内核提供；
- VS Code 关闭后不自动停止容器。

开发工具、自动启动方式和镜像发布流程将在后续补充。

## 目录结构

```text
.
├── .devcontainer/
│   ├── Dockerfile
│   ├── devcontainer.json
│   └── tools/
├── docs/
├── README.md
└── start.sh
```

## 前置条件

- Linux 宿主机；
- Docker；
- Visual Studio Code；
- VS Code Dev Containers 扩展；
- Dev Container CLI。

可以在 VS Code 命令面板中执行
`Dev Containers: Install devcontainer CLI` 安装命令行工具。

## 使用方式

克隆仓库后执行：

```bash
./start.sh
```

脚本会在必要时创建宿主机的 `~/workspace`，然后通过 `devcontainer up`
构建、创建或复用开发容器。容器就绪后，在 VS Code 中执行：

```text
Dev Containers: Attach to Running Container...
```

容器创建后，工作目录为：

```text
~/workspace
```

也可以直接用 VS Code 打开本仓库，再执行
`Dev Containers: Reopen in Container`。

## 用户与权限

容器构建时使用宿主机的用户名。Dev Containers 会在创建容器时将容器用户的
UID/GID 调整为宿主机当前用户的 UID/GID，因此宿主机和容器可以同时编辑
`~/workspace` 中的文件。

Dockerfile 中的 UID/GID 是镜像构建阶段的初始值，最终值由 Dev Containers
在容器创建阶段对齐。`start.sh` 因此使用 `devcontainer up`，而不是分别调用
`docker build` 和 `docker run`。

直接使用普通的 `docker build`、`docker run` 再 Attach，不会应用
`updateRemoteUserUID`，也就不保证共享目录权限与宿主机一致。

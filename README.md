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

开发工具、启动脚本、自动启动方式和镜像发布流程将在后续补充。

## 目录结构

```text
.
├── .devcontainer/
│   ├── Dockerfile
│   ├── devcontainer.json
│   └── tools/
├── docs/
└── README.md
```

## 前置条件

- Linux 宿主机；
- Docker；
- Visual Studio Code；
- VS Code Dev Containers 扩展；
- 宿主机存在 `~/workspace` 目录。

## 临时使用方式

在独立启动脚本完成前，可以用 VS Code 打开本仓库，执行
`Dev Containers: Reopen in Container` 来构建并启动容器。

容器创建后，工作目录为：

```text
~/workspace
```

后续将提供宿主机启动脚本，用于创建或复用长期运行的容器，再通过
`Dev Containers: Attach to Running Container...` 连接。

## 用户与权限

容器构建时使用宿主机的用户名。Dev Containers 会在创建容器时将容器用户的
UID/GID 调整为宿主机当前用户的 UID/GID，因此宿主机和容器可以同时编辑
`~/workspace` 中的文件。

如果以后绕过 Dev Containers、直接使用 `docker run` 启动镜像，启动脚本也必须
显式传入宿主机 UID/GID；该逻辑将在后续实现。

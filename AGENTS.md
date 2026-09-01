# AGENTS.md

## 项目目标

本项目提供一个长期运行、可供多个项目共用的个人 Dev Container。个人技术栈
大体统一，常用项目共享该环境；明显不同的技术栈应使用独立 Dev Container，
不要求本项目覆盖所有场景。

README 目前只保留简短简介。设计和维护约定先记录在本文件，正式用户文档以后
放入 `docs/`。

## 已确定的设计

- 基础镜像使用 `gh-proxy.org/docker/archlinux:base`。
- 宿主机默认为 Linux，源码统一放在 `~/workspace`。
- 宿主机的 `~/workspace` 挂载到容器内当前用户的 `~/workspace`。
- 容器共享宿主机的 `/etc/localtime`；系统时钟由宿主机内核提供。
- 容器作为个人工作站长期运行，VS Code 断开时不自动停止。
- 日常流程是先启动或复用容器，再使用 VS Code
  `Dev Containers: Attach to Running Container...` 连接。
- `start.sh` 必须通过 `devcontainer up` 启动环境，使
  `.devcontainer/devcontainer.json` 成为创建容器的唯一事实来源。
- 不要把普通的 `docker build`、`docker run` 加 Attach 描述为等价流程；它不会
  自动应用 `updateRemoteUserUID` 等 Dev Containers 行为。

## 用户与权限语义

- `.devcontainer/Dockerfile` 是由 `devcontainer.json` 参数化的实现文件，不是独立
  的最终运行契约。
- Dockerfile 中的构建参数不提供默认值，必须全部由 `devcontainer.json` 显式传入。
- 每个构建参数的语义写在 Dockerfile 对应的 `ARG` 前；`devcontainer.json` 只引用
  该说明，不重复维护参数文档。
- `USERNAME` 在构建时取宿主机的 `USER`，因此谁构建，镜像中的用户就叫什么。
- `USER_UID` 和 `USER_GID` 当前由 `devcontainer.json` 传入初始值 `1000`，不代表
  最终运行值。
- Dev Containers 在创建容器时通过 `updateRemoteUserUID` 将 UID/GID 与宿主机
  当前用户对齐。共享目录的权限依靠数字 UID/GID，而不是用户名文本。
- `containerUser` 和 `remoteUser` 都使用上述构建用户，保证容器进程和 VS Code
  进程采用同一身份。
- 如果以后改成由 GitHub Actions 构建并发布通用预构建镜像，必须重新设计用户
  策略；不能直接沿用构建机的用户名。

## 目录职责

- `.devcontainer/Dockerfile`：操作系统、基础包、用户以及镜像层内容。
- `.devcontainer/devcontainer.json`：构建参数、用户同步、挂载和容器生命周期。
- `.devcontainer/tools/`：以后存放开发工具的安装定义和脚本；用户明确设计之前
  不要擅自引入复杂框架。
- `start.sh`：宿主机入口，只负责前置检查和调用 Dev Container CLI。
- `docs/`：未来的设计、使用和维护文档。

## 秘密与源码

- 源码保存在 GitHub 仓库和宿主机 workspace，不烘焙进开发环境镜像。
- 任何密钥、令牌或个人秘密都不得提交到仓库或写进镜像层。
- 秘密管理计划使用 Infisical，并应在运行时按需注入；具体实现尚未确定。

## 变更要求

- 优先保持单一、长期运行、多项目共享的工作站模型。
- 修改用户、挂载或启动流程时，同时验证宿主机和容器内的文件所有权。
- 修改 Dockerfile 后至少执行一次镜像构建；修改 Shell 脚本后执行语法检查。
- 不要在未讨论前实现开发工具列表、开机自启动或镜像发布工作流。
- Git 提交信息格式为 `type(scope): 中文简短说明`，其中 type 和 scope 使用英文。

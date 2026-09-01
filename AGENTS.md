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
- `start.sh` 将宿主机的 `~/workspace` 作为 CLI 的 `--workspace-folder`，
  `devcontainer.json` 通过 `${localWorkspaceFolder}` 引用同一路径，避免重复定义。
- 本仓库目录只保存开发容器配置，通过 `--config` 显式传给 CLI，不作为实际
  workspace 挂载源。
- 容器共享宿主机的 `/etc/localtime`；系统时钟由宿主机内核提供。
- 容器作为个人工作站长期运行，VS Code 断开时不自动停止。
- 日常流程是先启动或复用容器，再使用 VS Code
  `Dev Containers: Attach to Running Container...` 连接。
- `start.sh` 必须通过 `devcontainer up` 启动环境，使
  `.devcontainer/devcontainer.json` 成为创建容器的唯一事实来源。
- 不要把普通的 `docker build`、`docker run` 加 Attach 描述为等价流程；它不会
  自动应用 `updateRemoteUserUID` 等 Dev Containers 行为。
- 镜像构建时将项目复制到 `/personal-devcontainer`，以 `dev` 用户执行根目录的
  `main.sh` 完成自定义安装，然后删除该临时目录。
- 根目录的 `main.sh` 只负责编排各配置模块；每个模块使用自己的 `main.sh` 实现
  安装逻辑。
- `agent/` 保存 Codex 的用户级指令、配置和 Skills 素材。Codex 通过官方 Shell
  安装脚本安装，素材由 `agent/main.sh` 部署到用户目录。
- `agent/skills/` 支持任意层级的聚合目录；包含 `SKILL.md` 的目录视为一个 Skill，
  不包含该文件的目录继续递归扫描。安装时按 Skill 目录名平铺，因此所有 Skill
  的目录名必须全局唯一。

## 用户与权限语义

- `.devcontainer/Dockerfile` 是由 `devcontainer.json` 参数化的实现文件，不是独立
  的最终运行契约。
- `USERNAME` 不提供默认值，必须由 `devcontainer.json` 显式传入；参数语义写在
  Dockerfile 对应的 `ARG` 前，`devcontainer.json` 只引用该说明。
- 容器用户名固定为 `dev`，从而保证预构建镜像可被不同宿主机用户复用。
- `USER_UID` 和 `USER_GID` 不属于外部配置接口，在 Dockerfile 中使用构建期临时
  默认值 `1000`，不由 `devcontainer.json` 传入，也不代表最终运行值。
- Dev Containers 在创建容器时通过 `updateRemoteUserUID` 将 UID/GID 与宿主机
  当前用户对齐。共享目录的权限依靠数字 UID/GID，而不是用户名文本。
- `containerUser` 和 `remoteUser` 都固定使用 `dev`，保证容器进程和 VS Code
  进程采用同一身份；它们不会创建用户或在 Attach 时修改用户身份。
- UID/GID 只在容器创建阶段对齐，不会在每次 Attach 时变化；一个运行中的容器
  只对应一名宿主机用户。
- Dev Container CLI 会生成 UID/GID 对齐后的本地派生镜像，并递归迁移
  `/home/dev` 的所有权；基础镜像中的 `1000:1000` 保持不变。
- 用户级文件必须位于 `/home/dev`；HOME 之外的系统工具应保持 `root:root`，避免
  UID/GID 调整后遗留旧的数字所有权。
- 完整说明见 `docs/development/user.md`。

## 目录职责

- `.devcontainer/Dockerfile`：操作系统、基础包、用户以及镜像层内容。
- `.devcontainer/devcontainer.json`：构建参数、用户同步、挂载和容器生命周期。
- `.devcontainer/tools/`：以后存放开发工具的安装定义和脚本；用户明确设计之前
  不要擅自引入复杂框架。
- `start.sh`：宿主机入口，只负责前置检查和调用 Dev Container CLI。
- `main.sh`：镜像构建期的自定义安装入口，按明确顺序调用各配置模块。
- `agent/`：Agent 配置模块，包含安装脚本、Codex 配置、用户级指令和 Skills。
- `docs/`：未来的设计、使用和维护文档。
- `docs/development/`：记录开发环境的设计机制与维护说明。

## 秘密与源码

- 源码保存在 GitHub 仓库和宿主机 workspace，不烘焙进开发环境镜像。
- 任何密钥、令牌或个人秘密都不得提交到仓库或写进镜像层。
- 秘密管理计划使用 Infisical，并应在运行时按需注入；具体实现尚未确定。

## 变更要求

- 优先保持单一、长期运行、多项目共享的工作站模型。
- 所有代码注释一律使用中文；shebang 等机器指令不受此限制。
- 所有打印到控制台的提示、状态和错误信息一律使用英文。
- 修改用户、挂载或启动流程时，同时验证宿主机和容器内的文件所有权。
- 修改 Dockerfile 后至少执行一次镜像构建；修改 Shell 脚本后执行语法检查。
- 不要在未讨论前实现开发工具列表、开机自启动或镜像发布工作流。
- Git 提交信息格式为 `type(scope): 中文简短说明`，其中 type 和 scope 使用英文。

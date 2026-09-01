# Git

为所有 Git 仓库启用用户级 Hooks，统一提交信息格式、阻止常见垃圾文件进入仓库，并控制提交规模。

## 提交信息格式

```text
type(domain): 中文消息
```

- `type`：只能包含英文字母和连字符（`-`）
- `domain`：只能包含英文字母、连字符（`-`）和斜杠（`/`）
- 消息：必须至少包含一个中文字符
- 第二行及后续内容不受约束

示例：

```text
feat(git-hooks): 添加提交信息校验
build-tools(api/auth-service): 更新登录服务构建流程
```

## 垃圾文件检查

`pre-commit` 只检查暂存区中即将提交的文件，并阻止以下高置信度垃圾文件：

- macOS 和 Windows 元数据，如 `.DS_Store`、`._*`、`__MACOSX`、`Thumbs.db` 和 `Desktop.ini`
- Vim、Emacs 等编辑器生成的交换、自动保存和备份文件
- 合并或补丁生成的 `*.orig`、`*.rej` 残留文件

构建产物、IDE 配置和依赖目录不属于全局规则，由各项目自行决定是否提交。

## 提交规模检查

`pre-commit` 会额外检查暂存区中的提交规模：

- 暂存区版本中，任意被提交文本文件不得超过 500 行
- 单次提交的新增行数与删除行数之和不得超过 3000 行
- 暂存区版本中，任意被提交文件不得超过 50 MiB
- 二进制文件不计入新增/删除行数，也不按换行数检查文件长度

3000 行适合包含锁文件、批量迁移或较大文档更新的日常提交。如果希望强制小步提交，可以降低到 600-1200 行。

## 文件

- [`config`](config)：配置用户级 `core.hooksPath`
- [`hooks/commit-msg`](hooks/commit-msg)：Git `commit-msg` 入口，调用提交信息格式规则
- [`hooks/pre-commit`](hooks/pre-commit)：Git `pre-commit` 入口，调用垃圾文件和提交规模规则
- [`hooks/commit_message_validator/main.py`](hooks/commit_message_validator/main.py)：提交信息格式规则，可单独执行
- [`hooks/no_junk_files/main.py`](hooks/no_junk_files/main.py)：垃圾文件检查规则，可单独执行
- [`hooks/commit_size_limitation/main.py`](hooks/commit_size_limitation/main.py)：提交规模检查规则，可单独执行
- [`hooks/functions.py`](hooks/functions.py)：暂存区读取公共辅助函数

Hooks 使用 Python 3 运行。本地校验可以被 `git commit --no-verify` 或仓库级 `core.hooksPath` 覆盖绕过。

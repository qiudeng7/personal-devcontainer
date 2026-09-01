# Agents.md

本文档的主要作用是介绍用户的使用习惯和工作方式。

常用工作目录一般是 ~/workspace/，服务器上的部署目录一般是 ~/deploy 。如果和你提到什么你不知道的项目你可以在习惯目录和 github 里面搜一下。

下文提到的工具在开发环境都有对应的cli和skills，如果没有cli或skills，或cli未登录，可以提醒一下用户。

## github

用户的 github 名称是 `qiudeng7`，本地安装了gh-cli，大部分项目都会放到 github


## 阿里云

用户常用阿里云的镜像仓库，边缘加速（ESA）功能，也在阿里云有服务器，你可以通过aliyun cli管理这些云服务。

云端镜像仓库访问地址和凭证在 infisical cloud 的 personal 项目(slug: `personal-1-fay`, id: `aae607db-c672-40ac-8318-643145f02989`) 下的 `/aliyun-container-registry` 目录下。

公开和私有仓库的 namespace 分别为 `qiudeng-private` 和 `qiudeng-public`
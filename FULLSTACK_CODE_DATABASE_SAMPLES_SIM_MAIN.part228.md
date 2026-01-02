---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 228
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 228 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: github.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/github.mdx

```text
---
title: GitHub
description: 通过 GitHub 交互或从 GitHub 事件触发工作流
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="github"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitHub](https://github.com/) 是全球领先的软件开发和版本控制平台，基于 Git 提供服务。它为开发者提供了一个协作环境，可以托管和审查代码、管理项目并共同构建软件。

使用 GitHub，您可以：

- **托管代码库**：在公共或私有代码库中存储代码，并进行版本控制
- **协作开发**：使用拉取请求（Pull Request）提议更改、审查代码并合并贡献
- **跟踪问题**：创建、分配和管理问题，以组织工作和跟踪错误
- **自动化工作流**：使用 GitHub Actions 自动构建、测试和部署代码
- **管理项目**：通过项目板、里程碑和任务跟踪来组织工作
- **文档管理**：使用 GitHub Pages 和 wikis 创建和维护文档

在 Sim 中，GitHub 集成使您的代理可以直接与 GitHub 仓库和工作流交互。这支持强大的自动化场景，例如代码审查协助、拉取请求管理、问题跟踪和仓库探索。您的代理可以获取仓库数据、分析代码更改、在拉取请求上发布评论以及以编程方式执行其他 GitHub 操作。此集成弥合了您的 AI 工作流与开发流程之间的差距，实现了代理与开发团队之间的无缝协作。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Github 集成到工作流程中。可以获取 PR 详情、创建 PR 评论、获取存储库信息以及获取最新提交。需要使用 github token API 密钥。可以在触发模式下使用，当创建 PR、对 PR 进行评论或推送提交时触发工作流程。

## 工具

### `github_pr`

获取 PR 详情，包括差异和更改的文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的 PR 摘要 |
| `metadata` | object | 包括文件更改的详细 PR 元数据 |

### `github_comment`

在 GitHub PR 上创建评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `body` | string | 是 | 评论内容 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `path` | string | 否 | 审查评论的文件路径 |
| `position` | number | 否 | 审查评论的行号 |
| `commentType` | string | 否 | 评论类型 \(pr_comment 或 file_comment\) |
| `line` | number | 否 | 审查评论的行号 |
| `side` | string | 否 | 差异的侧面 \(LEFT 或 RIGHT\) |
| `commitId` | string | 否 | 要评论的提交的 SHA |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的评论确认 |
| `metadata` | object | 评论元数据 |

### `github_repo_info`

检索全面的 GitHub 仓库元数据，包括星标、分叉、问题和主要语言。支持公共和私有仓库，并可选择进行身份验证。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的仓库摘要 |
| `metadata` | object | 仓库元数据 |

### `github_latest_commit`

检索 GitHub 仓库的最新提交

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `branch` | string | 否 | 分支名称 \(默认为仓库的默认分支\) |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的提交摘要 |
| `metadata` | object | 提交元数据 |

### `github_issue_comment`

在 GitHub 问题上创建评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `body` | string | 是 | 评论内容 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的评论确认 |
| `metadata` | object | 评论元数据 |

### `github_list_issue_comments`

列出 GitHub 问题上的所有评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `since` | string | 否 | 仅显示此 ISO 8601 时间戳之后更新的评论 |
| `per_page` | number | 否 | 每页结果数 \(最大 100\) |
| `page` | number | 否 | 页码 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的评论摘要 |
| `metadata` | object | 评论列表元数据 |

### `github_update_comment`

更新 GitHub 问题或拉取请求上的现有评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `comment_id` | number | 是 | 评论 ID |
| `body` | string | 是 | 更新后的评论内容 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的更新确认 |
| `metadata` | object | 更新后的评论元数据 |

### `github_delete_comment`

删除 GitHub 问题或拉取请求上的评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `comment_id` | number | 是 | 评论 ID |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的删除确认 |
| `metadata` | object | 删除结果元数据 |

### `github_list_pr_comments`

列出 GitHub 拉取请求上的所有审查评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `sort` | string | 否 | 按创建或更新排序 |
| `direction` | string | 否 | 排序方向 \(升序或降序\) |
| `since` | string | 否 | 仅显示此 ISO 8601 时间戳之后更新的评论 |
| `per_page` | number | 否 | 每页结果数 \(最大 100\) |
| `page` | number | 否 | 页码 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的审查评论摘要 |
| `metadata` | object | 审查评论列表元数据 |

### `github_create_pr`

在 GitHub 仓库中创建一个新的拉取请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `title` | string | 是 | 拉取请求标题 |
| `head` | string | 是 | 实现更改的分支名称 |
| `base` | string | 是 | 要将更改合并到的分支名称 |
| `body` | string | 否 | 拉取请求描述 \(Markdown\) |
| `draft` | boolean | 否 | 创建为草稿拉取请求 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的拉取请求创建确认 |
| `metadata` | object | 拉取请求元数据 |

### `github_update_pr`

更新 GitHub 仓库中的现有拉取请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `title` | string | 否 | 新的拉取请求标题 |
| `body` | string | 否 | 新的拉取请求描述 \(Markdown\) |
| `state` | string | 否 | 新状态 \(open 或 closed\) |
| `base` | string | 否 | 新的基准分支名称 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的 PR 更新确认 |
| `metadata` | object | 更新的拉取请求元数据 |

### `github_merge_pr`

在 GitHub 仓库中合并拉取请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `commit_title` | string | 否 | 合并提交的标题 |
| `commit_message` | string | 否 | 附加到合并提交消息的额外详细信息 |
| `merge_method` | string | 否 | 合并方法：merge、squash 或 rebase |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的合并确认 |
| `metadata` | object | 合并结果元数据 |

### `github_list_prs`

列出 GitHub 仓库中的拉取请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `state` | string | 否 | 按状态筛选：open、closed 或 all |
| `head` | string | 否 | 按 head 用户或分支名称筛选 \(格式：user:ref-name 或 organization:ref-name\) |
| `base` | string | 否 | 按 base 分支名称筛选 |
| `sort` | string | 否 | 按以下方式排序：created、updated、popularity 或 long-running |
| `direction` | string | 否 | 排序方向：asc 或 desc |
| `per_page` | number | 否 | 每页结果数 \(最大 100\) |
| `page` | number | 否 | 页码 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的拉取请求列表 |
| `metadata` | object | 拉取请求列表元数据 |

### `github_get_pr_files`

获取拉取请求中更改的文件列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `per_page` | number | 否 | 每页结果数 \(最大 100\) |
| `page` | number | 否 | 页码 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的拉取请求中更改的文件列表 |
| `metadata` | object | 拉取请求文件元数据 |

### `github_close_pr`

关闭 GitHub 仓库中的拉取请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的拉取请求关闭确认 |
| `metadata` | object | 已关闭的拉取请求元数据 |

### `github_request_reviewers`

为拉取请求指定审查者

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `pullNumber` | number | 是 | 拉取请求编号 |
| `reviewers` | string | 是 | 以逗号分隔的用户登录名列表，用于请求审查 |
| `team_reviewers` | string | 否 | 以逗号分隔的团队标识列表，用于请求审查 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的审查请求确认 |
| `metadata` | object | 请求的审查者元数据 |

### `github_get_file_content`

从 GitHub 仓库中获取文件内容。支持最大 1MB 的文件。内容以解码和人类可读的形式返回。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `path` | string | 是 | 仓库中文件的路径 \(例如："src/index.ts"\) |
| `ref` | string | 否 | 分支名称、标签或提交 SHA \(默认为仓库的默认分支\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的文件信息，包含内容预览 |
| `metadata` | object | 文件元数据，包括名称、路径、SHA、大小和 URL |

### `github_create_file`

在 GitHub 仓库中创建一个新文件。文件内容将自动进行 Base64 编码。支持最大 1MB 的文件。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `path` | string | 是 | 文件将被创建的路径 \(例如："src/newfile.ts"\) |
| `message` | string | 是 | 此文件创建的提交消息 |
| `content` | string | 是 | 文件内容 \(纯文本，将自动进行 Base64 编码\) |
| `branch` | string | 否 | 创建文件的分支 \(默认为仓库的默认分支\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的文件创建确认信息 |
| `metadata` | object | 文件和提交元数据 |

### `github_update_file`

更新 GitHub 仓库中的现有文件。需要文件的 SHA。内容将自动进行 Base64 编码。支持最大 1MB 的文件。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `path` | string | 是 | 要更新的文件路径 \(例如："src/index.ts"\) |
| `message` | string | 是 | 此文件更新的提交消息 |
| `content` | string | 是 | 新的文件内容 \(纯文本，将自动进行 Base64 编码\) |
| `sha` | string | 是 | 被替换文件的 blob SHA \(从 github_get_file_content 获取\) |
| `branch` | string | 否 | 要更新文件的分支 \(默认为仓库的默认分支\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的文件更新确认 |
| `metadata` | object | 更新的文件和提交元数据 |

### `github_delete_file`

从 GitHub 仓库中删除文件。需要文件的 SHA。此操作无法通过 API 撤销。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `path` | string | 是 | 要删除的文件路径 \(例如："src/oldfile.ts"\) |
| `message` | string | 是 | 此文件删除的提交消息 |
| `sha` | string | 是 | 被删除文件的 blob SHA \(从 github_get_file_content 获取\) |
| `branch` | string | 否 | 要删除文件的分支 \(默认为仓库的默认分支\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的文件删除确认 |
| `metadata` | object | 删除确认和提交元数据 |

### `github_get_tree`

获取 GitHub 仓库中目录的内容。返回文件和子目录的列表。使用空路径或省略路径以获取根目录内容。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `path` | string | 否 | 目录路径 \(例如："src/components"\)。留空表示根目录。 |
| `ref` | string | 否 | 分支名称、标签或提交 SHA \(默认为仓库默认分支\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的目录树列表 |
| `metadata` | object | 目录内容元数据 |

### `github_list_branches`

列出 GitHub 仓库中的所有分支。可选地按保护状态过滤并控制分页。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `protected` | boolean | 否 | 按保护状态过滤分支 |
| `per_page` | number | 否 | 每页结果数 \(最大 100，默认 30\) |
| `page` | number | 否 | 分页的页码 \(默认 1\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的分支列表 |
| `metadata` | object | 分支列表元数据 |

### `github_get_branch`

获取 GitHub 仓库中特定分支的详细信息，包括提交详情和保护状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `branch` | string | 是 | 分支名称 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的分支详情 |
| `metadata` | object | 分支元数据 |

### `github_create_branch`

通过创建指向特定提交 SHA 的 git 引用，在 GitHub 仓库中创建一个新分支。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `branch` | string | 是 | 要创建的分支名称 |
| `sha` | string | 是 | 分支指向的提交 SHA |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的分支创建确认 |
| `metadata` | object | Git 引用元数据 |

### `github_delete_branch`

通过删除 Git 引用从 GitHub 仓库中删除分支。受保护的分支无法删除。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `branch` | string | 是 | 要删除的分支名称 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的删除确认 |
| `metadata` | object | 删除元数据 |

### `github_get_branch_protection`

获取特定分支的分支保护规则，包括状态检查、审查要求和限制。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `branch` | string | 是 | 分支名称 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的分支保护摘要 |
| `metadata` | object | 分支保护配置 |

### `github_update_branch_protection`

更新特定分支的分支保护规则，包括状态检查、审查要求、管理员强制执行和推送限制。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `branch` | string | 是 | 分支名称 |
| `required_status_checks` | object | 是 | 所需状态检查配置 \(null 表示禁用\)。对象包含 strict \(布尔值\) 和 contexts \(字符串数组\) |
| `enforce_admins` | boolean | 是 | 是否对管理员强制执行限制 |
| `required_pull_request_reviews` | object | 是 | PR 审查要求 \(null 表示禁用\)。对象包含可选的 required_approving_review_count、dismiss_stale_reviews、require_code_owner_reviews |
| `restrictions` | object | 是 | 推送限制 \(null 表示禁用\)。对象包含 users \(字符串数组\) 和 teams \(字符串数组\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的分支保护更新摘要 |
| `metadata` | object | 更新后的分支保护配置 |

### `github_create_issue`

在 GitHub 仓库中创建一个新问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `title` | string | 是 | 问题标题 |
| `body` | string | 否 | 问题描述/正文 |
| `assignees` | string | 否 | 要分配给此问题的用户名列表（以逗号分隔） |
| `labels` | string | 否 | 要添加到此问题的标签名称列表（以逗号分隔） |
| `milestone` | number | 否 | 要与此问题关联的里程碑编号 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的问题创建确认 |
| `metadata` | object | 问题元数据 |

### `github_update_issue`

更新 GitHub 仓库中的现有问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `title` | string | 否 | 新的问题标题 |
| `body` | string | 否 | 新的问题描述/正文 |
| `state` | string | 否 | 问题状态 \(open 或 closed\) |
| `labels` | array | 否 | 标签名称数组 \(替换所有现有标签\) |
| `assignees` | array | 否 | 用户名数组 \(替换所有现有分配者\) |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的问题更新确认 |
| `metadata` | object | 更新的问题元数据 |

### `github_list_issues`

列出 GitHub 仓库中的问题。注意：这包括拉取请求，因为在 GitHub 中 PR 被视为问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `state` | string | 否 | 按状态筛选：open、closed 或 all \(默认：open\) |
| `assignee` | string | 否 | 按分配者用户名筛选 |
| `creator` | string | 否 | 按创建者用户名筛选 |
| `labels` | string | 否 | 按标签名称的逗号分隔列表筛选 |
| `sort` | string | 否 | 排序方式：created、updated 或 comments \(默认：created\) |
| `direction` | string | 否 | 排序方向：asc 或 desc \(默认：desc\) |
| `per_page` | number | 否 | 每页结果数 \(最大 100，默认：30\) |
| `page` | number | 否 | 页码 \(默认：1\) |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的问题列表 |
| `metadata` | object | 问题列表元数据 |

### `github_get_issue`

获取 GitHub 仓库中特定问题的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的问题详细信息 |
| `metadata` | object | 详细的问题元数据 |

### `github_close_issue`

关闭 GitHub 仓库中的一个问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `state_reason` | string | 否 | 关闭原因：已完成或未计划 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的问题关闭确认 |
| `metadata` | object | 已关闭的问题元数据 |

### `github_add_labels`

为 GitHub 仓库中的问题添加标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `labels` | string | 是 | 要添加到问题的标签名称（以逗号分隔） |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的标签确认 |
| `metadata` | object | 标签元数据 |

### `github_remove_label`

从 GitHub 仓库中的问题中移除标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `name` | string | 是 | 要移除的标签名称 |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的标签移除确认 |
| `metadata` | object | 剩余标签元数据 |

### `github_add_assignees`

为 GitHub 仓库中的问题添加受理人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 |
| `repo` | string | 是 | 仓库名称 |
| `issue_number` | number | 是 | 问题编号 |
| `assignees` | string | 是 | 要分配给问题的用户名列表（以逗号分隔） |
| `apiKey` | string | 是 | GitHub API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的分配确认 |
| `metadata` | object | 包含分配信息的更新问题元数据 |

### `github_create_release`

为 GitHub 仓库创建一个新版本。指定标签名称、目标提交、标题、描述，以及是否为草稿或预发布版本。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `tag_name` | string | 是 | 此版本的标签名称 |
| `target_commitish` | string | 否 | 指定用于创建 Git 标签的 commitish 值。可以是任何分支或提交 SHA。默认为仓库的默认分支。 |
| `name` | string | 否 | 版本的名称 |
| `body` | string | 否 | 描述版本内容的文本（支持 markdown） |
| `draft` | boolean | 否 | true 表示创建草稿（未发布）版本，false 表示创建已发布版本 |
| `prerelease` | boolean | 否 | true 表示将版本标识为预发布版本，false 表示标识为完整版本 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的发布创建摘要 |
| `metadata` | object | 包括下载 URL 的发布元数据 |

### `github_update_release`

更新现有的 GitHub 发布。修改标签名称、目标提交、标题、描述、草稿状态或预发布状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `release_id` | number | 是 | 发布的唯一标识符 |
| `tag_name` | string | 否 | 标签的名称 |
| `target_commitish` | string | 否 | 指定标签创建来源的 commitish 值 |
| `name` | string | 否 | 发布的名称 |
| `body` | string | 否 | 描述发布内容的文本 \(支持 markdown\) |
| `draft` | boolean | 否 | true 表示设置为草稿，false 表示发布 |
| `prerelease` | boolean | 否 | true 表示标识为预发布，false 表示完整发布 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的发布更新摘要 |
| `metadata` | object | 更新的发布元数据，包括下载 URL |

### `github_list_releases`

列出 GitHub 仓库的所有发布版本。返回包括标签、名称和下载 URL 在内的发布信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `per_page` | number | 否 | 每页结果数量 \(最大 100\) |
| `page` | number | 否 | 要获取的结果页码 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的发布版本列表摘要 |
| `metadata` | object | 发布版本元数据 |

### `github_get_release`

通过 ID 获取特定 GitHub 发布版本的详细信息。返回包括资源和下载 URL 在内的发布元数据。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `release_id` | number | 是 | 发布版本的唯一标识符 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的发布版本详细信息 |
| `metadata` | object | 包括下载 URL 在内的发布元数据 |

### `github_delete_release`

通过 ID 删除 GitHub 发布版本。这将永久删除发布版本，但不会删除关联的 Git 标签。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `release_id` | number | 是 | 要删除的发布版本的唯一标识符 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的删除确认信息 |
| `metadata` | object | 删除结果元数据 |

### `github_list_workflows`

列出 GitHub 仓库中的所有工作流。返回包括 ID、名称、路径、状态和徽章 URL 在内的工作流详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `per_page` | number | 否 | 每页结果数量 \(默认: 30, 最大: 100\) |
| `page` | number | 否 | 要获取的结果页码 \(默认: 1\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的工作流摘要 |
| `metadata` | object | 工作流元数据 |

### `github_get_workflow`

通过 ID 或文件名获取特定 GitHub Actions 工作流的详细信息。返回的工作流信息包括名称、路径、状态和徽章 URL。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `workflow_id` | string | 是 | 工作流 ID \(数字\) 或工作流文件名 \(例如："main.yaml"\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的工作流详细信息 |
| `metadata` | object | 工作流元数据 |

### `github_trigger_workflow`

触发 GitHub Actions 工作流的工作流调度事件。工作流必须配置了 workflow_dispatch 触发器。成功时返回 204 No Content。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `workflow_id` | string | 是 | 工作流 ID \(数字\) 或工作流文件名 \(例如："main.yaml"\) |
| `ref` | string | 是 | Git 引用 \(分支或标签名称\) 用于运行工作流 |
| `inputs` | object | 否 | 在工作流文件中配置的输入键和值 |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 确认消息 |
| `metadata` | object | 空的元数据对象 \(204 无内容响应\) |

### `github_list_workflow_runs`

列出仓库的工作流运行。支持按触发者、分支、事件和状态进行筛选。返回包括状态、结论和链接在内的运行详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `actor` | string | 否 | 按触发工作流的用户筛选 |
| `branch` | string | 否 | 按分支名称筛选 |
| `event` | string | 否 | 按事件类型筛选 \(例如：push, pull_request, workflow_dispatch\) |
| `status` | string | 否 | 按状态筛选 \(queued, in_progress, completed, waiting, requested, pending\) |
| `per_page` | number | 否 | 每页结果数量 \(默认：30，最大：100\) |
| `page` | number | 否 | 要获取的结果页码 \(默认：1\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的工作流运行摘要 |
| `metadata` | object | 工作流运行元数据 |

### `github_get_workflow_run`

获取有关特定工作流运行的详细信息（通过 ID）。返回状态、结论、时间以及运行的链接。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `run_id` | number | 是 | 工作流运行 ID |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的工作流运行详情 |
| `metadata` | object | 工作流运行元数据 |

### `github_cancel_workflow_run`

取消工作流运行。如果取消已启动，则返回 202 Accepted；如果运行无法取消（已完成），则返回 409 Conflict。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `run_id` | number | 是 | 要取消的工作流运行 ID |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 取消状态消息 |
| `metadata` | object | 取消元数据 |

### `github_rerun_workflow`

重新运行工作流运行。可选择启用调试日志记录。成功时返回 201 Created。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner` | string | 是 | 仓库所有者 \(用户或组织\) |
| `repo` | string | 是 | 仓库名称 |
| `run_id` | number | 是 | 要重新运行的工作流运行 ID |
| `enable_debug_logging` | boolean | 否 | 启用重新运行的调试日志记录 \(默认值：false\) |
| `apiKey` | string | 是 | GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 重新运行确认消息 |
| `metadata` | object | 重新运行元数据 |

### `github_list_projects`

列出组织或用户的 GitHub Projects V2。返回最多 20 个项目及其详细信息，包括 ID、标题、编号、URL 和状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner_type` | string | 是 | 所有者类型："org" 表示组织，"user" 表示用户 |
| `owner_login` | string | 是 | 组织或用户的登录名 |
| `apiKey` | string | 是 | 具有项目读取权限的 GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的项目列表 |
| `metadata` | object | 项目元数据 |

### `github_get_project`

通过项目编号获取特定 GitHub Projects V2 的详细信息。返回项目的详细信息，包括 ID、标题、描述、URL 和状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner_type` | string | 是 | 所有者类型："org" 表示组织，"user" 表示用户 |
| `owner_login` | string | 是 | 组织或用户的登录名 |
| `project_number` | number | 是 | 项目编号 |
| `apiKey` | string | 是 | 具有项目读取权限的 GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的项目详情 |
| `metadata` | object | 项目元数据 |

### `github_create_project`

创建一个新的 GitHub Project V2。需要提供所有者节点 ID（而非登录名）。返回包含 ID、标题和 URL 的已创建项目。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owner_id` | string | 是 | 所有者节点 ID \(格式：PVT_... 或 MDQ6...\)。使用 GitHub GraphQL API 从组织或用户登录中获取此 ID。 |
| `title` | string | 是 | 项目标题 |
| `apiKey` | string | 是 | 具有项目写入权限的 GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的确认消息 |
| `metadata` | object | 已创建项目的元数据 |

### `github_update_project`

更新现有的 GitHub Project V2。可以更新标题、描述、可见性（公开）或状态（关闭）。需要提供项目节点 ID。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | 是 | 项目节点 ID \(格式：PVT_...\) |
| `title` | string | 否 | 新的项目标题 |
| `shortDescription` | string | 否 | 新的项目简短描述 |
| `project_public` | boolean | 否 | 设置项目可见性 \(true = 公开, false = 私有\) |
| `closed` | boolean | 否 | 设置项目状态 \(true = 关闭, false = 打开\) |
| `apiKey` | string | 是 | 具有项目写入权限的 GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的确认消息 |
| `metadata` | object | 更新的项目元数据 |

### `github_delete_project`

删除一个 GitHub 项目 V2。此操作是永久性的，无法撤销。需要项目节点 ID。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | 是 | 项目节点 ID \(格式：PVT_...\) |
| `apiKey` | string | 是 | 具有项目管理员权限的 GitHub 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 人类可读的确认消息 |
| `metadata` | object | 已删除的项目元数据 |

## 注意事项

- 类别：`tools`
- 类型：`github`
```

--------------------------------------------------------------------------------

---[FILE: gitlab.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/gitlab.mdx

```text
---
title: GitLab
description: 与 GitLab 项目、问题、合并请求和流水线进行交互
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gitlab"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitLab](https://gitlab.com/) 是一个全面的 DevOps 平台，允许团队管理、协作并自动化其软件开发生命周期。通过 GitLab，您可以轻松处理源代码管理、CI/CD、评审和协作，全部集中在一个应用程序中。

在 Sim 中使用 GitLab，您可以：

- **管理项目和存储库**：列出并检索您的 GitLab 项目，访问详细信息并组织您的存储库
- **处理问题**：列出、创建并评论问题，以跟踪工作并有效协作
- **管理合并请求**：审查、创建并管理代码更改和同行评审的合并请求
- **自动化 CI/CD 流水线**：触发、监控并与 GitLab 流水线交互，作为自动化流程的一部分
- **通过评论协作**：为问题或合并请求添加评论，以提高团队内部的高效沟通

通过 Sim 的 GitLab 集成，您的代理可以以编程方式与您的 GitLab 项目交互。无缝自动化项目管理、问题跟踪、代码评审和流水线操作，在您的工作流程中优化软件开发过程，并增强团队协作。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 GitLab 集成到工作流程中。可以管理项目、问题、合并请求、流水线并添加评论。支持所有核心 GitLab DevOps 操作。

## 工具

### `gitlab_list_projects`

列出经过身份验证的用户可访问的 GitLab 项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `owned` | boolean | 否 | 限制为当前用户拥有的项目 |
| `membership` | boolean | 否 | 限制为当前用户是成员的项目 |
| `search` | string | 否 | 按名称搜索项目 |
| `visibility` | string | 否 | 按可见性筛选 \(public, internal, private\) |
| `orderBy` | string | 否 | 按字段排序 \(id, name, path, created_at, updated_at, last_activity_at\) |
| `sort` | string | 否 | 排序方向 \(asc, desc\) |
| `perPage` | number | 否 | 每页结果数量 \(默认 20, 最大 100\) |
| `page` | number | 否 | 分页的页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `projects` | array | GitLab 项目列表 |
| `total` | number | 项目总数 |

### `gitlab_get_project`

获取特定 GitLab 项目的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 \(例如："namespace/project"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `project` | object | GitLab 项目详情 |

### `gitlab_list_issues`

列出 GitLab 项目中的问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `state` | string | 否 | 按状态过滤 \(opened, closed, all\) |
| `labels` | string | 否 | 以逗号分隔的标签名称列表 |
| `assigneeId` | number | 否 | 按分配的用户 ID 过滤 |
| `milestoneTitle` | string | 否 | 按里程碑标题过滤 |
| `search` | string | 否 | 按标题和描述搜索问题 |
| `orderBy` | string | 否 | 按字段排序 \(created_at, updated_at\) |
| `sort` | string | 否 | 排序方向 \(asc, desc\) |
| `perPage` | number | 否 | 每页结果数量 \(默认 20，最大 100\) |
| `page` | number | 否 | 分页页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issues` | array | GitLab 问题的列表 |
| `total` | number | 问题的总数 |

### `gitlab_get_issue`

获取特定 GitLab 问题的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `issueIid` | number | 是 | 项目中的问题编号 \(在 GitLab 界面中显示的 #\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issue` | object | GitLab 问题的详细信息 |

### `gitlab_create_issue`

在 GitLab 项目中创建一个新问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `title` | string | 是 | 问题标题 |
| `description` | string | 否 | 问题描述 \(支持 Markdown\) |
| `labels` | string | 否 | 逗号分隔的标签名称列表 |
| `assigneeIds` | array | 否 | 分配的用户 ID 数组 |
| `milestoneId` | number | 否 | 分配的里程碑 ID |
| `dueDate` | string | 否 | YYYY-MM-DD 格式的截止日期 |
| `confidential` | boolean | 否 | 问题是否为机密 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issue` | object | 创建的 GitLab 问题 |

### `gitlab_update_issue`

更新 GitLab 项目中的现有问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `issueIid` | number | 是 | 问题内部 ID \(IID\) |
| `title` | string | 否 | 新问题标题 |
| `description` | string | 否 | 新问题描述 \(支持 Markdown\) |
| `stateEvent` | string | 否 | 状态事件 \(关闭或重新打开\) |
| `labels` | string | 否 | 逗号分隔的标签名称列表 |
| `assigneeIds` | array | 否 | 分配的用户 ID 数组 |
| `milestoneId` | number | 否 | 分配的里程碑 ID |
| `dueDate` | string | 否 | YYYY-MM-DD 格式的截止日期 |
| `confidential` | boolean | 否 | 问题是否为机密 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issue` | object | 更新的 GitLab 问题 |

### `gitlab_delete_issue`

从 GitLab 项目中删除问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `issueIid` | number | 是 | 问题内部 ID \(IID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 问题是否成功删除 |

### `gitlab_create_issue_note`

向 GitLab 问题添加评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | 字符串 | 是 | 项目 ID 或 URL 编码路径 |
| `issueIid` | 数字 | 是 | 问题内部 ID \(IID\) |
| `body` | 字符串 | 是 | 评论正文 \(支持 Markdown\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `note` | 对象 | 创建的评论 |

### `gitlab_list_merge_requests`

列出 GitLab 项目中的合并请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | 字符串 | 是 | 项目 ID 或 URL 编码路径 |
| `state` | 字符串 | 否 | 按状态筛选 \(opened, closed, merged, all\) |
| `labels` | 字符串 | 否 | 逗号分隔的标签名称列表 |
| `sourceBranch` | 字符串 | 否 | 按源分支筛选 |
| `targetBranch` | 字符串 | 否 | 按目标分支筛选 |
| `orderBy` | 字符串 | 否 | 按字段排序 \(created_at, updated_at\) |
| `sort` | 字符串 | 否 | 排序方向 \(asc, desc\) |
| `perPage` | 数字 | 否 | 每页结果数量 \(默认 20，最大 100\) |
| `page` | 数字 | 否 | 分页页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `mergeRequests` | array | GitLab 合并请求列表 |
| `total` | number | 合并请求的总数 |

### `gitlab_get_merge_request`

获取特定 GitLab 合并请求的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `mergeRequestIid` | number | 是 | 合并请求的内部 ID \(IID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | GitLab 合并请求的详细信息 |

### `gitlab_create_merge_request`

在 GitLab 项目中创建新的合并请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `sourceBranch` | string | 是 | 源分支名称 |
| `targetBranch` | string | 是 | 目标分支名称 |
| `title` | string | 是 | 合并请求标题 |
| `description` | string | 否 | 合并请求描述 \(支持 Markdown\) |
| `labels` | string | 否 | 逗号分隔的标签名称列表 |
| `assigneeIds` | array | 否 | 分配的用户 ID 数组 |
| `milestoneId` | number | 否 | 分配的里程碑 ID |
| `removeSourceBranch` | boolean | 否 | 合并后删除源分支 |
| `squash` | boolean | 否 | 合并时压缩提交 |
| `draft` | boolean | 否 | 标记为草稿 \(进行中\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | 创建的 GitLab 合并请求 |

### `gitlab_update_merge_request`

更新 GitLab 项目中的现有合并请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `mergeRequestIid` | number | 是 | 合并请求内部 ID \(IID\) |
| `title` | string | 否 | 新的合并请求标题 |
| `description` | string | 否 | 新的合并请求描述 |
| `stateEvent` | string | 否 | 状态事件 \(关闭或重新打开\) |
| `labels` | string | 否 | 逗号分隔的标签名称列表 |
| `assigneeIds` | array | 否 | 分配的用户 ID 数组 |
| `milestoneId` | number | 否 | 分配的里程碑 ID |
| `targetBranch` | string | 否 | 新的目标分支 |
| `removeSourceBranch` | boolean | 否 | 合并后删除源分支 |
| `squash` | boolean | 否 | 合并时压缩提交 |
| `draft` | boolean | 否 | 标记为草稿 \(进行中\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | 更新的 GitLab 合并请求 |

### `gitlab_merge_merge_request`

在 GitLab 项目中合并合并请求

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `mergeRequestIid` | number | 是 | 合并请求内部 ID \(IID\) |
| `mergeCommitMessage` | string | 否 | 自定义合并提交消息 |
| `squashCommitMessage` | string | 否 | 自定义压缩提交消息 |
| `squash` | boolean | 否 | 合并前压缩提交 |
| `shouldRemoveSourceBranch` | boolean | 否 | 合并后删除源分支 |
| `mergeWhenPipelineSucceeds` | boolean | 否 | 在流水线成功时合并 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | 合并的 GitLab 合并请求 |

### `gitlab_create_merge_request_note`

向 GitLab 合并请求添加评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `mergeRequestIid` | number | 是 | 合并请求内部 ID \(IID\) |
| `body` | string | 是 | 评论正文 \(支持 Markdown\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `note` | object | 创建的评论 |

### `gitlab_list_pipelines`

列出 GitLab 项目中的流水线

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `ref` | string | 否 | 按 ref 过滤 \(分支或标签\) |
| `status` | string | 否 | 按状态过滤 \(created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled\) |
| `orderBy` | string | 否 | 按字段排序 \(id, status, ref, updated_at, user_id\) |
| `sort` | string | 否 | 排序方向 \(asc, desc\) |
| `perPage` | number | 否 | 每页结果数量 \(默认 20，最大 100\) |
| `page` | number | 否 | 分页页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pipelines` | array | GitLab 流水线列表 |
| `total` | number | 流水线总数 |

### `gitlab_get_pipeline`

获取特定 GitLab 流水线的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `pipelineId` | number | 是 | 流水线 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pipeline` | object | GitLab 流水线详情 |

### `gitlab_create_pipeline`

在 GitLab 项目中触发新的流水线

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `ref` | string | 是 | 要运行流水线的分支或标签 |
| `variables` | array | 否 | 流水线的变量数组（每个包含 key、value 和可选的 variable_type） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pipeline` | object | 创建的 GitLab 流水线 |

### `gitlab_retry_pipeline`

重试失败的 GitLab 流水线

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `pipelineId` | number | 是 | 流水线 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pipeline` | object | 重试的 GitLab 流水线 |

### `gitlab_cancel_pipeline`

取消正在运行的 GitLab 流水线

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 项目 ID 或 URL 编码路径 |
| `pipelineId` | number | 是 | 流水线 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pipeline` | object | 已取消的 GitLab 流水线 |

## 注意

- 类别: `tools`
- 类型: `gitlab`
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 226
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 226 of 933)

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

---[FILE: confluence.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/confluence.mdx

```text
---
title: Confluence
description: 与 Confluence 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="confluence"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Confluence](https://www.atlassian.com/software/confluence) 是 Atlassian 强大的团队协作和知识管理平台。它是一个集中式工作空间，团队可以在其中创建、组织和共享跨部门和组织的信息。

使用 Confluence，您可以：

- **创建结构化文档**：使用丰富的格式构建全面的维基、项目计划和知识库
- **实时协作**：与团队成员一起在文档上协作，支持评论、提及和编辑功能
- **分层组织信息**：通过空间、页面和嵌套层次结构组织内容，实现直观导航
- **与其他工具集成**：与 Jira、Trello 和其他 Atlassian 产品连接，实现无缝工作流集成
- **控制访问权限**：管理谁可以查看、编辑或评论特定内容

在 Sim 中，Confluence 集成使您的代理能够访问和利用组织的知识库。代理可以从 Confluence 页面检索信息，搜索特定内容，甚至在需要时更新文档。这使您的工作流能够整合存储在 Confluence 实例中的集体知识，从而构建能够参考内部文档、遵循既定程序并维护最新信息资源的代理。

## 使用说明

将 Confluence 集成到工作流程中。可以读取、创建、更新、删除页面，管理评论、附件、标签，并搜索内容。

## 工具

### `confluence_retrieve`

使用 Confluence API 从 Confluence 页面检索内容。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要检索的 Confluence 页面 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 检索的时间戳 |
| `pageId` | string | Confluence 页面 ID |
| `content` | string | 去除 HTML 标签的页面内容 |
| `title` | string | 页面标题 |

### `confluence_update`

使用 Confluence API 更新 Confluence 页面。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要更新的 Confluence 页面 ID |
| `title` | string | 否 | 页面的新标题 |
| `content` | string | 否 | 页面的新内容（以 Confluence 存储格式） |
| `version` | number | 否 | 页面的版本号 \(用于防止冲突\) |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 更新的时间戳 |
| `pageId` | string | Confluence 页面 ID |
| `title` | string | 更新的页面标题 |
| `success` | boolean | 更新操作的成功状态 |

### `confluence_create_page`

在 Confluence 空间中创建新页面。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `spaceId` | string | 是 | 创建页面的 Confluence 空间 ID |
| `title` | string | 是 | 新页面的标题 |
| `content` | string | 是 | 页面内容（以 Confluence 存储格式 \(HTML\)） |
| `parentId` | string | 否 | 如果创建子页面，则为父页面 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 创建的时间戳 |
| `pageId` | string | 创建的页面 ID |
| `title` | string | 页面标题 |
| `url` | string | 页面 URL |

### `confluence_delete_page`

删除 Confluence 页面（将其移至回收站，可从回收站恢复）。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要删除的 Confluence 页面 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 删除的时间戳 |
| `pageId` | string | 已删除的页面 ID |
| `deleted` | boolean | 删除状态 |

### `confluence_search`

在 Confluence 页面、博客文章和其他内容中搜索内容。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `query` | string | 是 | 搜索查询字符串 |
| `limit` | number | 否 | 返回的最大结果数 \(默认值：25\) |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 搜索的时间戳 |
| `results` | array | 搜索结果 |

### `confluence_create_comment`

向 Confluence 页面添加评论。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要评论的 Confluence 页面 ID |
| `comment` | string | 是 | 以 Confluence 存储格式编写的评论文本 |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 创建的时间戳 |
| `commentId` | string | 创建的评论 ID |
| `pageId` | string | 页面 ID |

### `confluence_list_comments`

列出 Confluence 页面上的所有评论。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要列出评论的 Confluence 页面 ID |
| `limit` | number | 否 | 返回的最大评论数 \(默认值：25\) |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 检索的时间戳 |
| `comments` | array | 评论列表 |

### `confluence_update_comment`

更新 Confluence 页面上的现有评论。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `commentId` | string | 是 | 要更新的 Confluence 评论 ID |
| `comment` | string | 是 | 更新后的评论文本（以 Confluence 存储格式） |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 更新的时间戳 |
| `commentId` | string | 更新的评论 ID |
| `updated` | boolean | 更新状态 |

### `confluence_delete_comment`

从 Confluence 页面删除评论。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `commentId` | string | 是 | 要删除的 Confluence 评论 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 删除的时间戳 |
| `commentId` | string | 删除的评论 ID |
| `deleted` | boolean | 删除状态 |

### `confluence_upload_attachment`

将文件作为附件上传到 Confluence 页面。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要附加文件的 Confluence 页面 ID |
| `file` | file | 是 | 要作为附件上传的文件 |
| `fileName` | string | 否 | 附件的可选自定义文件名 |
| `comment` | string | 否 | 附件的可选评论 |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 上传的时间戳 |
| `attachmentId` | string | 上传的附件 ID |
| `title` | string | 附件文件名 |
| `fileSize` | number | 文件大小（以字节为单位） |
| `mediaType` | string | 附件的 MIME 类型 |
| `downloadUrl` | string | 附件的下载 URL |
| `pageId` | string | 添加附件的页面 ID |

### `confluence_list_attachments`

列出 Confluence 页面上的所有附件。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要列出附件的 Confluence 页面 ID |
| `limit` | number | 否 | 返回的最大附件数量 \(默认值：25\) |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 检索的时间戳 |
| `attachments` | array | 附件列表 |

### `confluence_delete_attachment`

从 Confluence 页面删除附件（移至回收站）。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `attachmentId` | string | 是 | 要删除的 Confluence 附件 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 删除的时间戳 |
| `attachmentId` | string | 删除的附件 ID |
| `deleted` | boolean | 删除状态 |

### `confluence_list_labels`

列出 Confluence 页面上的所有标签。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `pageId` | string | 是 | 要列出标签的 Confluence 页面 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 检索的时间戳 |
| `labels` | array | 标签列表 |

### `confluence_get_space`

获取有关特定 Confluence 空间的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `spaceId` | string | 是 | 要检索的 Confluence 空间 ID |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 检索的时间戳 |
| `spaceId` | string | 空间 ID |
| `name` | string | 空间名称 |
| `key` | string | 空间键值 |
| `type` | string | 空间类型 |
| `status` | string | 空间状态 |
| `url` | string | 空间 URL |

### `confluence_list_spaces`

列出用户可访问的所有 Confluence 空间。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 您的 Confluence 域名 \(例如：yourcompany.atlassian.net\) |
| `limit` | number | 否 | 返回的最大空间数量 \(默认值：25\) |
| `cloudId` | string | 否 | 实例的 Confluence Cloud ID。如果未提供，将使用域名进行获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 检索的时间戳 |
| `spaces` | array | 空间列表 |

## 注意事项

- 类别：`tools`
- 类型：`confluence`
```

--------------------------------------------------------------------------------

---[FILE: cursor.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/cursor.mdx

```text
---
title: Cursor
description: 启动并管理 Cursor 云代理以处理 GitHub 仓库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="cursor"
  color="#1E1E1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Cursor](https://www.cursor.so/) 是一个 AI 集成开发环境（IDE）和基于云的平台，允许您启动和管理能够直接在您的 GitHub 仓库上工作的强大 AI 代理。Cursor 代理可以自动化开发任务，提高团队的生产力，并通过进行代码更改、响应自然语言指令以及维护其活动的对话历史与您协作。

使用 Cursor，您可以：

- **为代码库启动云代理**：即时创建在云端处理您仓库的 AI 代理
- **使用自然语言委派编码任务**：通过书面指令、修改和澄清来指导代理
- **监控进度和输出**：获取代理状态，查看详细结果，并检查当前或已完成的任务
- **访问完整的对话历史**：审查所有提示和 AI 响应，以确保透明性和可审计性
- **控制和管理代理生命周期**：列出活动代理，终止代理，并管理基于 API 的代理启动和后续操作

在 Sim 中，Cursor 集成使您的代理和工作流能够以编程方式与 Cursor 云代理交互。这意味着您可以使用 Sim 来：

- 列出所有云代理并浏览其当前状态（`cursor_list_agents`）
- 获取任何代理的最新状态和输出（`cursor_get_agent`）
- 查看任何编码代理的完整对话历史（`cursor_get_conversation`）
- 为正在运行的代理添加后续指令或新提示
- 根据需要管理和终止代理

此集成帮助您将 Sim 代理的灵活智能与 Cursor 的强大开发自动化功能相结合，使您能够在项目中扩展 AI 驱动的开发。
{/* MANUAL-CONTENT-END */}

## 使用说明

与 Cursor 云代理 API 交互，启动可以在您的 GitHub 仓库上工作的 AI 代理。支持启动代理、添加后续指令、检查状态、查看对话以及管理代理生命周期。

## 工具

### `cursor_list_agents`

列出经过身份验证的用户的所有云代理，并支持可选的分页功能。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `limit` | number | 否 | 要返回的代理数量 \(默认值：20，最大值：100\) |
| `cursor` | string | 否 | 上一个响应的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的代理列表 |
| `metadata` | object | 代理列表元数据 |

### `cursor_get_agent`

检索云代理的当前状态和结果。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `agentId` | string | 是 | 云代理的唯一标识符 \(例如，bc_abc123\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的代理详细信息 |
| `metadata` | object | 代理元数据 |

### `cursor_get_conversation`

检索云代理的对话历史，包括所有用户提示和助手响应。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `agentId` | string | 是 | 云代理的唯一标识符 \(例如，bc_abc123\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 可读的对话历史 |
| `metadata` | object | 对话元数据 |

### `cursor_launch_agent`

启动一个新的云代理，根据给定的指令处理 GitHub 仓库。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `repository` | string | 是 | GitHub 仓库 URL \(例如，https://github.com/your-org/your-repo\) |
| `ref` | string | 否 | 要处理的分支、标签或提交 \(默认为默认分支\) |
| `promptText` | string | 是 | 代理的指令文本 |
| `promptImages` | string | 否 | 包含 base64 数据和尺寸的图像对象的 JSON 数组 |
| `model` | string | 否 | 要使用的模型 \(留空以自动选择\) |
| `branchName` | string | 否 | 代理使用的自定义分支名称 |
| `autoCreatePr` | boolean | 否 | 当代理完成时自动创建 PR |
| `openAsCursorGithubApp` | boolean | 否 | 以 Cursor GitHub App 的身份打开 PR |
| `skipReviewerRequest` | boolean | 否 | 跳过在 PR 上请求审阅者 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 包含代理详细信息的成功消息 |
| `metadata` | object | 启动结果的元数据 |

### `cursor_add_followup`

为现有的云代理添加后续指令。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `agentId` | string | 是 | 云代理的唯一标识符 \(例如，bc_abc123\) |
| `followupPromptText` | string | 是 | 代理的后续指令文本 |
| `promptImages` | string | 否 | 包含 base64 数据和尺寸的图像对象的 JSON 数组 \(最多 5 个\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 结果元数据 |

### `cursor_stop_agent`

停止运行中的云代理。这将暂停代理，但不会删除它。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `agentId` | string | 是 | 云代理的唯一标识符 \(例如：bc_abc123\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 结果元数据 |

### `cursor_delete_agent`

永久删除云代理。此操作无法撤销。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Cursor API 密钥 |
| `agentId` | string | 是 | 云代理的唯一标识符 \(例如，bc_abc123\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 结果元数据 |

## 注意事项

- 类别：`tools`
- 类型：`cursor`
```

--------------------------------------------------------------------------------

---[FILE: datadog.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/datadog.mdx

```text
---
title: Datadog
description: 使用 Datadog 监控基础设施、应用程序和日志
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="datadog"
  color="#632CA6"
/>

{/* MANUAL-CONTENT-START:intro */}
[Datadog](https://datadoghq.com/) 是一个全面的监控和分析平台，用于基础设施、应用程序、日志等。它使组织能够实时了解系统的健康状况和性能，检测异常，并自动化事件响应。

使用 Datadog，您可以：

- **监控指标**：收集、可视化和分析来自服务器、云服务和自定义应用程序的指标。
- **查询时间序列数据**：对性能指标运行高级查询，用于趋势分析和报告。
- **管理监控和事件**：设置监控以检测问题、触发警报并创建可观察性的事件。
- **处理停机时间**：计划和以编程方式管理计划的停机时间，在维护期间抑制警报。
- **分析日志和跟踪**（需要在 Datadog 中进行额外设置）：集中检查日志或分布式跟踪以进行更深入的故障排除。

Sim 的 Datadog 集成让您的代理能够自动化这些操作，并以编程方式与您的 Datadog 账户交互。使用它提交自定义指标、查询时间序列数据、管理监控、创建事件，并直接在 Sim 自动化中简化您的监控工作流程。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Datadog 监控集成到工作流程中。提交指标、管理监控、查询日志、创建事件、处理停机时间等。

## 工具

### `datadog_submit_metrics`

向 Datadog 提交自定义指标。用于跟踪应用程序性能、业务指标或自定义监控数据。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `series` | string | 是 | 要提交的指标系列的 JSON 数组。每个系列应包括指标名称、类型（gauge/rate/count）、点（时间戳/值对）以及可选标签。 |
| `apiKey` | string | 是 | Datadog API 密钥 |
| `site` | string | 否 | Datadog 站点/区域（默认：datadoghq.com） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 指标是否成功提交 |
| `errors` | 数组 | 提交过程中发生的任何错误 |

### `datadog_query_timeseries`

从 Datadog 查询指标时间序列数据。用于分析趋势、创建报告或检索指标值。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | Datadog 指标查询 \(例如："avg:system.cpu.user\{*\}"\) |
| `from` | 数字 | 是 | 起始时间，单位为秒的 Unix 时间戳 |
| `to` | 数字 | 是 | 结束时间，单位为秒的 Unix 时间戳 |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `applicationKey` | 字符串 | 是 | Datadog 应用密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `series` | 数组 | 包含指标名称、标签和数据点的时间序列数据数组 |
| `status` | 字符串 | 查询状态 |

### `datadog_create_event`

向 Datadog 事件流发布事件。用于部署通知、警报或任何重要事件。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | 字符串 | 是 | 事件标题 |
| `text` | 字符串 | 是 | 事件正文/描述。支持 markdown。 |
| `alertType` | 字符串 | 否 | 警报类型：error、warning、info、success、user_update、recommendation 或 snapshot |
| `priority` | 字符串 | 否 | 事件优先级：normal 或 low |
| `host` | 字符串 | 否 | 与此事件关联的主机名 |
| `tags` | 字符串 | 否 | 逗号分隔的标签列表 \(例如："env:production,service:api"\) |
| `aggregationKey` | 字符串 | 否 | 用于将事件聚合在一起的键 |
| `sourceTypeName` | 字符串 | 否 | 事件的来源类型名称 |
| `dateHappened` | 数字 | 否 | 事件发生的 Unix 时间戳 \(默认为当前时间\) |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `event` | object | 创建的事件详情 |

### `datadog_create_monitor`

在 Datadog 中创建一个新的监控/警报。监控可以跟踪指标、服务检查、事件等。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `name` | string | 是 | 监控名称 |
| `type` | string | 是 | 监控类型：指标警报、服务检查、事件警报、进程警报、日志警报、查询警报、复合警报、合成警报、SLO 警报 |
| `query` | string | 是 | 监控查询 \(例如："avg\(last_5m\):avg:system.cpu.idle\{*\} &lt; 20"\) |
| `message` | string | 否 | 通知中包含的消息。可以包含 @ 提及和 markdown。 |
| `tags` | string | 否 | 逗号分隔的标签列表 |
| `priority` | number | 否 | 监控优先级 \(1-5，其中 1 为最高\) |
| `options` | string | 否 | 监控选项的 JSON 字符串 \(阈值、notify_no_data、renotify_interval 等\) |
| `apiKey` | string | 是 | Datadog API 密钥 |
| `applicationKey` | string | 是 | Datadog 应用程序密钥 |
| `site` | string | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `monitor` | object | 创建的监控详情 |

### `datadog_get_monitor`

通过 ID 检索特定监控的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | 是 | 要检索的监控 ID |
| `groupStates` | string | 否 | 要包含的逗号分隔的组状态：alert、warn、no data、ok |
| `withDowntimes` | boolean | 否 | 包含监控的停机数据 |
| `apiKey` | string | 是 | Datadog API 密钥 |
| `applicationKey` | string | 是 | Datadog 应用程序密钥 |
| `site` | string | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `monitor` | object | 监控详情 |

### `datadog_list_monitors`

列出 Datadog 中的所有监控，并可选择按名称、标签或状态进行筛选。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupStates` | string | 否 | 用逗号分隔的组状态进行筛选：alert、warn、no data、ok |
| `name` | string | 否 | 按名称筛选监控（部分匹配） |
| `tags` | string | 否 | 用逗号分隔的标签列表进行筛选 |
| `monitorTags` | string | 否 | 用逗号分隔的监控标签列表进行筛选 |
| `withDowntimes` | boolean | 否 | 包括监控的停机时间数据 |
| `page` | number | 否 | 分页的页码（从 0 开始） |
| `pageSize` | number | 否 | 每页的监控数量（最大 1000） |
| `apiKey` | string | 是 | Datadog API 密钥 |
| `applicationKey` | string | 是 | Datadog 应用密钥 |
| `site` | string | 否 | Datadog 站点/区域（默认：datadoghq.com） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `monitors` | array | 监控列表 |

### `datadog_mute_monitor`

静音监控以暂时抑制通知。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | 是 | 要静音的监控 ID |
| `scope` | string | 否 | 静音范围（例如："host:myhost"）。如果未指定，则静音所有范围。 |
| `end` | number | 否 | 静音结束的 Unix 时间戳。如果未指定，则无限期静音。 |
| `apiKey` | string | 是 | Datadog API 密钥 |
| `applicationKey` | string | 是 | Datadog 应用密钥 |
| `site` | string | 否 | Datadog 站点/区域（默认：datadoghq.com） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 监控是否成功静音 |

### `datadog_query_logs`

搜索并检索 Datadog 的日志。用于故障排除、分析或监控。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | 日志搜索查询 \(例如："service:web-app status:error"\) |
| `from` | 字符串 | 是 | ISO-8601 格式的开始时间或相对时间 \(例如："now-1h"\) |
| `to` | 字符串 | 是 | ISO-8601 格式的结束时间或相对时间 \(例如："now"\) |
| `limit` | 数字 | 否 | 返回的最大日志数量 \(默认：50，最大：1000\) |
| `sort` | 字符串 | 否 | 排序顺序：时间戳 \(最早优先\) 或 -时间戳 \(最新优先\) |
| `indexes` | 字符串 | 否 | 要搜索的日志索引的逗号分隔列表 |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `applicationKey` | 字符串 | 是 | Datadog 应用程序密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `logs` | 数组 | 日志条目列表 |

### `datadog_send_logs`

将日志条目发送到 Datadog 进行集中式日志记录和分析。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `logs` | 字符串 | 是 | JSON 格式的日志条目数组。每个条目应包含消息，并可选包含 ddsource、ddtags、hostname、service。 |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 日志是否成功发送 |

### `datadog_create_downtime`

安排停机时间以在维护窗口期间抑制监控通知。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `scope` | 字符串 | 是 | 应用停机的范围 \(例如："host:myhost"、"env:production" 或 "*" 表示全部\) |
| `message` | 字符串 | 否 | 停机期间显示的消息 |
| `start` | 数字 | 否 | 停机开始的 Unix 时间戳 \(默认为当前时间\) |
| `end` | 数字 | 否 | 停机结束的 Unix 时间戳 |
| `timezone` | 字符串 | 否 | 停机的时区 \(例如："America/New_York"\) |
| `monitorId` | 字符串 | 否 | 要静音的特定监控 ID |
| `monitorTags` | 字符串 | 否 | 用逗号分隔的监控标签以匹配 \(例如："team:backend,priority:high"\) |
| `muteFirstRecoveryNotification` | 布尔值 | 否 | 静音首次恢复通知 |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `applicationKey` | 字符串 | 是 | Datadog 应用程序密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `downtime` | 对象 | 创建的停机详细信息 |

### `datadog_list_downtimes`

列出 Datadog 中所有已安排的停机时间。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `currentOnly` | 布尔值 | 否 | 仅返回当前活动的停机时间 |
| `monitorId` | 字符串 | 否 | 按监控 ID 过滤 |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `applicationKey` | 字符串 | 是 | Datadog 应用程序密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域 \(默认：datadoghq.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `downtimes` | 数组 | 停机时间列表 |

### `datadog_cancel_downtime`

取消已计划的停机时间。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `downtimeId` | 字符串 | 是 | 要取消的停机时间的 ID |
| `apiKey` | 字符串 | 是 | Datadog API 密钥 |
| `applicationKey` | 字符串 | 是 | Datadog 应用程序密钥 |
| `site` | 字符串 | 否 | Datadog 站点/区域（默认值：datadoghq.com） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 停机时间是否成功取消 |

## 注意事项

- 类别：`tools`
- 类型：`datadog`
```

--------------------------------------------------------------------------------

---[FILE: discord.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/discord.mdx

```text
---
title: Discord
description: 与 Discord 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="discord"
  color="#5865F2"
/>

{/* MANUAL-CONTENT-START:intro */}
[Discord](https://discord.com) 是一个功能强大的通信平台，允许您与朋友、社区和团队连接。它提供了一系列团队协作功能，包括文字频道、语音频道和视频通话。

使用 Discord 账户或机器人，您可以：

- **发送消息**：向特定频道发送消息
- **获取消息**：从特定频道获取消息
- **获取服务器**：获取特定服务器的信息
- **获取用户**：获取特定用户的信息

在 Sim 中，Discord 集成使您的代理能够访问并利用您组织的 Discord 服务器。代理可以从 Discord 频道中检索信息、搜索特定用户、获取服务器信息并发送消息。这使您的工作流程能够与 Discord 社区集成，自动化通知并创建互动体验。

> **重要提示：** 要读取消息内容，您的 Discord 机器人需要在 Discord 开发者门户中启用“消息内容意图”。如果没有此权限，您仍然可以接收消息元数据，但内容字段将显示为空。

Sim 中的 Discord 组件使用高效的延迟加载，仅在需要时获取数据，以最大限度地减少 API 调用并防止速率限制。令牌刷新会在后台自动进行，以保持您的连接。

### 设置您的 Discord 机器人

1. 前往 [Discord 开发者门户](https://discord.com/developers/applications)
2. 创建一个新应用程序并导航到“机器人”选项卡
3. 创建一个机器人并复制您的机器人令牌
4. 在“特权网关意图”下，启用 **消息内容意图** 以读取消息内容
5. 使用适当的权限将您的机器人邀请到您的服务器
{/* MANUAL-CONTENT-END */}

## 使用说明

全面的 Discord 集成：消息、线程、频道、角色、成员、邀请和 Webhooks。

## 工具

### `discord_send_message`

向 Discord 频道发送消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要发送消息的 Discord 频道 ID |
| `content` | string | 否 | 消息的文本内容 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `files` | file[] | 否 | 要附加到消息的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | Discord 消息数据 |

### `discord_get_messages`

从 Discord 频道检索消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要检索消息的 Discord 频道 ID |
| `limit` | number | 否 | 要检索的最大消息数 \(默认值: 10, 最大值: 100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 消息数据的容器 |

### `discord_get_server`

检索 Discord 服务器（公会）的信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | Discord 服务器 \(公会\) 信息 |

### `discord_get_user`

检索 Discord 用户的信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的 Discord 机器人令牌 |
| `userId` | string | 是 | Discord 用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误信息 |
| `data` | object | Discord 用户信息 |

### `discord_edit_message`

编辑 Discord 频道中的现有消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 包含消息的 Discord 频道 ID |
| `messageId` | string | 是 | 要编辑的消息 ID |
| `content` | string | 否 | 消息的新文本内容 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 更新后的 Discord 消息数据 |

### `discord_delete_message`

删除 Discord 频道中的消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 包含消息的 Discord 频道 ID |
| `messageId` | string | 是 | 要删除的消息 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_add_reaction`

为 Discord 消息添加一个反应表情

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 包含消息的 Discord 频道 ID |
| `messageId` | string | 是 | 要添加反应的消息 ID |
| `emoji` | string | 是 | 要添加的表情符号 \(unicode 表情符号或自定义表情符号，格式为 name:id\) |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_remove_reaction`

移除 Discord 消息的反应

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 包含消息的 Discord 频道 ID |
| `messageId` | string | 是 | 包含反应的消息 ID |
| `emoji` | string | 是 | 要移除的表情符号 \(unicode 表情符号或自定义表情符号，格式为 name:id\) |
| `userId` | string | 否 | 要移除反应的用户 ID \(省略以移除机器人的反应\) |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_pin_message`

在 Discord 频道中固定一条消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 包含消息的 Discord 频道 ID |
| `messageId` | string | 是 | 要固定的消息 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_unpin_message`

在 Discord 频道中取消固定一条消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 包含消息的 Discord 频道 ID |
| `messageId` | string | 是 | 要取消固定的消息 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_create_thread`

在 Discord 频道中创建一个线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要创建线程的 Discord 频道 ID |
| `name` | string | 是 | 线程的名称 \(1-100 个字符\) |
| `messageId` | string | 否 | 用于从现有消息创建线程的消息 ID |
| `autoArchiveDuration` | number | 否 | 自动归档线程的持续时间（分钟）\(60, 1440, 4320, 10080\) |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 创建的线程数据 |

### `discord_join_thread`

加入 Discord 中的一个线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `threadId` | string | 是 | 要加入的线程 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_leave_thread`

离开 Discord 中的一个线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `threadId` | string | 是 | 要离开的线程 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_archive_thread`

在 Discord 中归档或取消归档一个线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `threadId` | string | 是 | 要归档/取消归档的线程 ID |
| `archived` | boolean | 是 | 是否归档 \(true\) 或取消归档 \(false\) 线程 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 更新的线程数据 |

### `discord_create_channel`

在 Discord 服务器中创建一个新频道

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `name` | string | 是 | 频道名称 \(1-100 个字符\) |
| `type` | number | 否 | 频道类型 \(0=文本, 2=语音, 4=分类, 5=公告, 13=舞台\) |
| `topic` | string | 否 | 频道主题 \(0-1024 个字符\) |
| `parentId` | string | 否 | 频道的父分类 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 创建的频道数据 |

### `discord_update_channel`

更新 Discord 频道

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要更新的 Discord 频道 ID |
| `name` | string | 否 | 频道的新名称 |
| `topic` | string | 否 | 频道的新主题 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 更新的频道数据 |

### `discord_delete_channel`

删除 Discord 频道

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要删除的 Discord 频道 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_get_channel`

获取 Discord 频道的信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要检索的 Discord 频道 ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 频道数据 |

### `discord_create_role`

在 Discord 服务器中创建一个新角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `name` | string | 是 | 角色的名称 |
| `color` | number | 否 | RGB 颜色值，整数形式 \(例如：0xFF0000 表示红色\) |
| `hoist` | boolean | 否 | 是否将角色成员与在线成员分开显示 |
| `mentionable` | boolean | 否 | 该角色是否可以被提及 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 创建的角色数据 |

### `discord_update_role`

更新 Discord 服务器中的角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `roleId` | string | 是 | 要更新的角色 ID |
| `name` | string | 否 | 角色的新名称 |
| `color` | number | 否 | RGB 颜色值（整数） |
| `hoist` | boolean | 否 | 是否单独显示角色成员 |
| `mentionable` | boolean | 否 | 该角色是否可以被提及 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 更新后的角色数据 |

### `discord_delete_role`

从 Discord 服务器中删除角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `roleId` | string | 是 | 要删除的角色 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_assign_role`

在 Discord 服务器中为成员分配角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要分配角色的用户 ID |
| `roleId` | string | 是 | 要分配的角色 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_remove_role`

在 Discord 服务器中移除成员的角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要移除角色的用户 ID |
| `roleId` | string | 是 | 要移除的角色 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_kick_member`

将成员从 Discord 服务器中移除

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要移除的用户 ID |
| `reason` | string | 否 | 移除成员的原因 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_ban_member`

从 Discord 服务器中封禁成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要封禁的用户 ID |
| `reason` | string | 否 | 封禁成员的原因 |
| `deleteMessageDays` | number | 否 | 要删除消息的天数 \(0-7\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_unban_member`

从 Discord 服务器中解除封禁成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要解除封禁的用户 ID |
| `reason` | string | 否 | 解除封禁成员的原因 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_get_member`

获取 Discord 服务器中成员的信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要检索的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 成员数据 |

### `discord_update_member`

更新 Discord 服务器中的成员（例如，更改昵称）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |
| `userId` | string | 是 | 要更新的用户 ID |
| `nick` | string | 否 | 成员的新昵称 \(null 表示移除\) |
| `mute` | boolean | 否 | 是否在语音频道中将成员静音 |
| `deaf` | boolean | 否 | 是否在语音频道中将成员禁声 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 更新后的成员数据 |

### `discord_create_invite`

为 Discord 频道创建邀请链接

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要创建邀请的 Discord 频道 ID |
| `maxAge` | number | 否 | 邀请的持续时间（以秒为单位）\(0 = 永不过期，默认值 86400\) |
| `maxUses` | number | 否 | 最大使用次数 \(0 = 无限，默认值 0\) |
| `temporary` | boolean | 否 | 邀请是否授予临时会员资格 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 创建的邀请数据 |

### `discord_get_invite`

获取 Discord 邀请的相关信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `inviteCode` | string | 是 | 要检索的邀请代码 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 邀请数据 |

### `discord_delete_invite`

删除 Discord 邀请

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `inviteCode` | string | 是 | 要删除的邀请代码 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

### `discord_create_webhook`

在 Discord 频道中创建一个 webhook

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `channelId` | string | 是 | 要在其中创建 webhook 的 Discord 频道 ID |
| `name` | string | 是 | webhook 的名称 \(1-80 个字符\) |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 创建的 webhook 数据 |

### `discord_execute_webhook`

执行 Discord webhook 以发送消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `webhookId` | string | 是 | webhook ID |
| `webhookToken` | string | 是 | webhook 令牌 |
| `content` | string | 是 | 要发送的消息内容 |
| `username` | string | 否 | 覆盖 webhook 的默认用户名 |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 通过 webhook 发送的消息 |

### `discord_get_webhook`

获取 Discord webhook 的信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `webhookId` | string | 是 | 要检索的 webhook ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | Webhook 数据 |

### `discord_delete_webhook`

删除 Discord webhook

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 用于身份验证的机器人令牌 |
| `webhookId` | string | 是 | 要删除的 webhook ID |
| `serverId` | string | 是 | Discord 服务器 ID \(公会 ID\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |

## 注意事项

- 类别: `tools`
- 类型: `discord`
```

--------------------------------------------------------------------------------

````

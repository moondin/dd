---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 232
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 232 of 933)

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

---[FILE: jira.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/jira.mdx

```text
---
title: Jira
description: 与 Jira 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jira"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jira](https://www.atlassian.com/jira) 是一个领先的项目管理和问题跟踪平台，帮助团队有效地规划、跟踪和管理敏捷软件开发项目。作为 Atlassian 套件的一部分，Jira 已成为全球软件开发团队和项目管理专业人士的行业标准。

Jira 提供了一套全面的工具，通过其灵活且可定制的工作流系统来管理复杂项目。凭借其强大的 API 和集成能力，Jira 使团队能够简化开发流程，并保持对项目进度的清晰可见性。

Jira 的主要功能包括：

- 敏捷项目管理：支持 Scrum 和 Kanban 方法论，提供可定制的看板和工作流
- 问题跟踪：复杂的跟踪系统，用于管理缺陷、用户故事、史诗和任务，并提供详细报告
- 工作流自动化：强大的自动化规则，用于简化重复性任务和流程
- 高级搜索：JQL（Jira 查询语言）支持复杂问题过滤和报告

在 Sim 中，Jira 集成允许您的代理无缝地与您的项目管理工作流互动。这为自动化问题创建、更新和跟踪提供了可能性，作为您的 AI 工作流的一部分。该集成使代理能够以编程方式创建、检索和更新 Jira 问题，从而促进自动化项目管理任务，确保重要信息得到妥善跟踪和记录。通过将 Sim 与 Jira 连接，您可以构建智能代理，在自动化日常项目管理任务的同时保持项目的可见性，提高团队生产力，并确保一致的项目跟踪。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Jira 集成到工作流程中。可以读取、写入和更新问题。还可以基于 Jira 的 webhook 事件触发工作流程。

## 工具

### `jira_retrieve`

检索特定 Jira 问题的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `projectId` | 字符串 | 否 | Jira 项目 ID \(可选；检索单个问题时不需要\)。 |
| `issueKey` | 字符串 | 是 | 要检索的 Jira 问题键 \(例如：PROJ-123\) |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | 字符串 | 操作的时间戳 |
| `issueKey` | 字符串 | 问题键 \(例如：PROJ-123\) |
| `summary` | 字符串 | 问题摘要 |
| `description` | JSON | 问题描述内容 |
| `created` | 字符串 | 问题创建的时间戳 |
| `updated` | 字符串 | 问题最后更新的时间戳 |
| `issue` | JSON | 包含所有字段的完整问题对象 |

### `jira_update`

更新 Jira 问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `projectId` | 字符串 | 否 | 要更新问题的 Jira 项目 ID。如果未提供，将检索所有问题。 |
| `issueKey` | 字符串 | 是 | 要更新的 Jira 问题键 |
| `summary` | 字符串 | 否 | 问题的新摘要 |
| `description` | 字符串 | 否 | 问题的新描述 |
| `status` | 字符串 | 否 | 问题的新状态 |
| `priority` | 字符串 | 否 | 问题的新优先级 |
| `assignee` | 字符串 | 否 | 问题的新负责人 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | 字符串 | 操作的时间戳 |
| `issueKey` | 字符串 | 更新后的问题键 \(例如：PROJ-123\) |
| `summary` | 字符串 | 更新后的问题摘要 |

### `jira_write`

编写一个 Jira 问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `projectId` | 字符串 | 是 | 问题的项目 ID |
| `summary` | 字符串 | 是 | 问题的摘要 |
| `description` | 字符串 | 否 | 问题的描述 |
| `priority` | 字符串 | 否 | 问题的优先级 |
| `assignee` | 字符串 | 否 | 问题的负责人 |
| `cloudId` | 字符串 | 否 | 实例的 Jira 云 ID。如果未提供，将使用域名获取。 |
| `issueType` | 字符串 | 是 | 要创建的问题类型 \(例如：任务、故事\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | 字符串 | 操作的时间戳 |
| `issueKey` | 字符串 | 创建的问题键 \(例如：PROJ-123\) |
| `summary` | 字符串 | 问题摘要 |
| `url` | 字符串 | 创建的问题的 URL |

### `jira_bulk_read`

批量检索多个 Jira 问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `projectId` | 字符串 | 是 | Jira 项目 ID |
| `cloudId` | 字符串 | 否 | Jira 云 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issues` | 数组 | 包含时间戳、摘要、描述、创建和更新时间戳的 Jira 问题数组 |

### `jira_delete_issue`

删除 Jira 问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要删除的 Jira 问题键 \(例如：PROJ-123\) |
| `deleteSubtasks` | 布尔值 | 否 | 是否删除子任务。如果为 false，则无法删除具有子任务的父问题。 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | 字符串 | 操作的时间戳 |
| `issueKey` | 字符串 | 删除的问题键 |

### `jira_assign_issue`

将 Jira 问题分配给用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要分配的 Jira 问题键 \(例如：PROJ-123\) |
| `accountId` | 字符串 | 是 | 要分配问题的用户的账户 ID。使用 "-1" 进行自动分配，或使用 null 取消分配。 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | 字符串 | 操作的时间戳 |
| `issueKey` | 字符串 | 被分配的任务键 |
| `assigneeId` | 字符串 | 分配者的账户 ID |

### `jira_transition_issue`

在工作流状态之间移动 Jira 问题（例如，从“待办”到“进行中”）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要转换的 Jira 问题键 \(例如：PROJ-123\) |
| `transitionId` | 字符串 | 是 | 要执行的转换 ID \(例如：“11”表示“待办”，“21”表示“进行中”\) |
| `comment` | 字符串 | 否 | 转换问题时添加的可选评论 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 已转换的问题键 |
| `transitionId` | string | 应用的转换 ID |

### `jira_search_issues`

使用 JQL（Jira 查询语言）搜索 Jira 问题

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `jql` | 字符串 | 是 | 用于搜索问题的 JQL 查询字符串 \(例如：“project = PROJ AND status = Open”\) |
| `startAt` | 数字 | 否 | 要返回的第一个结果的索引 \(用于分页\) |
| `maxResults` | 数字 | 否 | 要返回的最大结果数 \(默认值：50\) |
| `fields` | 数组 | 否 | 要返回的字段名称数组 \(默认值：\['summary', 'status', 'assignee', 'created', 'updated'\]\) |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `total` | number | 匹配问题的总数 |
| `startAt` | number | 分页起始索引 |
| `maxResults` | number | 每页的最大结果数 |
| `issues` | array | 包含键、摘要、状态、负责人、创建时间和更新时间的匹配问题数组 |

### `jira_add_comment`

向 Jira 问题添加评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要添加评论的 Jira 问题键 \(例如：PROJ-123\) |
| `body` | 字符串 | 是 | 评论正文文本 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 添加评论的问题键 |
| `commentId` | string | 创建的评论 ID |
| `body` | string | 评论的文本内容 |

### `jira_get_comments`

获取 Jira 问题的所有评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要获取评论的 Jira 问题键 \(例如：PROJ-123\) |
| `startAt` | 数字 | 否 | 要返回的第一条评论的索引 \(默认值：0\) |
| `maxResults` | 数字 | 否 | 要返回的评论的最大数量 \(默认值：50\) |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `total` | number | 评论的总数 |
| `comments` | array | 包含 ID、作者、正文、创建时间和更新时间的评论数组 |

### `jira_update_comment`

更新 Jira 问题上的现有评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 包含评论的 Jira 问题键 \(例如：PROJ-123\) |
| `commentId` | 字符串 | 是 | 要更新的评论 ID |
| `body` | 字符串 | 是 | 更新后的评论文本 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `commentId` | string | 更新的评论 ID |
| `body` | string | 更新的评论文本 |

### `jira_delete_comment`

从 Jira 问题中删除评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 包含评论的 Jira 问题键 \(例如：PROJ-123\) |
| `commentId` | 字符串 | 是 | 要删除的评论 ID |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `commentId` | string | 已删除的评论 ID |

### `jira_get_attachments`

从 Jira 问题中获取所有附件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要获取附件的 Jira 问题键 \(例如：PROJ-123\) |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `attachments` | array | 附件数组，包括 id、文件名、大小、mimeType、创建时间、作者 |

### `jira_delete_attachment`

从 Jira 问题中删除附件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `attachmentId` | 字符串 | 是 | 要删除的附件 ID |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `attachmentId` | string | 已删除的附件 ID |

### `jira_add_worklog`

向 Jira 问题添加时间跟踪工作日志条目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要添加工作日志的 Jira 问题键 \(例如：PROJ-123\) |
| `timeSpentSeconds` | 数字 | 是 | 花费的时间（以秒为单位） |
| `comment` | 字符串 | 否 | 工作日志条目的可选评论 |
| `started` | 字符串 | 否 | 可选的 ISO 格式开始时间 \(默认为当前时间\) |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 添加工作日志的相关问题键 |
| `worklogId` | string | 创建的工作日志 ID |
| `timeSpentSeconds` | number | 花费的时间（以秒为单位） |

### `jira_get_worklogs`

从 Jira 问题中获取所有工作日志条目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要获取工作日志的 Jira 问题键 \(例如：PROJ-123\) |
| `startAt` | 数字 | 否 | 要返回的第一个工作日志的索引 \(默认值：0\) |
| `maxResults` | 数字 | 否 | 要返回的最大工作日志数 \(默认值：50\) |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `total` | number | 工作日志的总数 |
| `worklogs` | array | 工作日志数组，包括 id、作者、timeSpentSeconds、timeSpent、评论、创建时间、更新时间、开始时间 |

### `jira_update_worklog`

更新 Jira 问题上的现有工作日志条目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 包含工作日志的 Jira 问题键 \(例如：PROJ-123\) |
| `worklogId` | 字符串 | 是 | 要更新的工作日志条目的 ID |
| `timeSpentSeconds` | 数字 | 否 | 花费的时间（以秒为单位） |
| `comment` | 字符串 | 否 | 工作日志条目的可选评论 |
| `started` | 字符串 | 否 | ISO 格式的可选开始时间 |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `worklogId` | string | 更新的工作日志 ID |

### `jira_delete_worklog`

从 Jira 问题中删除工作日志条目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 包含工作日志的 Jira 问题键 \(例如：PROJ-123\) |
| `worklogId` | 字符串 | 是 | 要删除的工作日志条目的 ID |
| `cloudId` | 字符串 | 否 | 实例的 Jira Cloud ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `worklogId` | string | 已删除的工作日志 ID |

### `jira_create_issue_link`

在两个 Jira 问题之间创建链接关系

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `inwardIssueKey` | 字符串 | 是 | 内部问题的 Jira 问题键 \(例如：PROJ-123\) |
| `outwardIssueKey` | 字符串 | 是 | 外部问题的 Jira 问题键 \(例如：PROJ-456\) |
| `linkType` | 字符串 | 是 | 链接关系的类型 \(例如：“阻止”、“关联到”、“重复”\) |
| `comment` | 字符串 | 否 | 可选评论，添加到问题链接中 |
| `cloudId` | 字符串 | 否 | 实例的 Jira 云 ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `inwardIssue` | string | 内部问题键 |
| `outwardIssue` | string | 外部问题键 |
| `linkType` | string | 问题链接的类型 |
| `linkId` | string | 创建的链接 ID |

### `jira_delete_issue_link`

删除两个 Jira 问题之间的链接

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `linkId` | 字符串 | 是 | 要删除的问题链接的 ID |
| `cloudId` | 字符串 | 否 | 实例的 Jira 云 ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `linkId` | string | 已删除的链接 ID |

### `jira_add_watcher`

为 Jira 问题添加观察者以接收更新通知

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要添加观察者的 Jira 问题键 \(例如：PROJ-123\) |
| `accountId` | 字符串 | 是 | 要添加为观察者的用户账户 ID |
| `cloudId` | 字符串 | 否 | 实例的 Jira 云 ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `watcherAccountId` | string | 添加的观察者账户 ID |

### `jira_remove_watcher`

从 Jira 问题中移除观察者

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | 字符串 | 是 | 您的 Jira 域名 \(例如：yourcompany.atlassian.net\) |
| `issueKey` | 字符串 | 是 | 要移除观察者的 Jira 问题键 \(例如：PROJ-123\) |
| `accountId` | 字符串 | 是 | 要移除的观察者用户账户 ID |
| `cloudId` | 字符串 | 否 | 实例的 Jira 云 ID。如果未提供，将使用域名获取。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ts` | string | 操作的时间戳 |
| `issueKey` | string | 问题键 |
| `watcherAccountId` | string | 移除的观察者账户 ID |

## 注意事项

- 类别: `tools`
- 类型: `jira`
```

--------------------------------------------------------------------------------

---[FILE: kalshi.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/kalshi.mdx

```text
---
title: Kalshi
description: 访问预测市场并在 Kalshi 上进行交易
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="kalshi"
  color="#09C285"
/>

{/* MANUAL-CONTENT-START:intro */}
[Kalshi](https://kalshi.com) 是一个联邦监管的交易所，用户可以直接交易未来事件结果的预测市场。Kalshi 强大的 API 和 Sim 集成使代理和工作流能够以编程方式访问平台的各个方面，支持从研究和分析到自动化交易和监控的所有内容。

通过 Kalshi 在 Sim 中的集成，您可以：

- **市场和事件数据：** 搜索、筛选并检索市场和事件的实时和历史数据；获取市场状态、系列、事件分组等的详细信息。
- **账户和余额管理：** 访问账户余额、可用资金，并监控实时未平仓头寸。
- **订单和交易管理：** 下新订单、取消现有订单、查看未完成订单、检索实时订单簿，并访问完整的交易历史。
- **执行分析：** 获取最近的交易、历史成交和 K 线数据，用于回测或市场结构研究。
- **监控：** 检查全交易所或系列级别的状态，接收有关市场变化或交易暂停的实时更新，并自动化响应。
- **自动化准备：** 构建端到端的自动化代理和仪表板，消费、分析并交易基于真实世界事件概率的数据。

通过使用这些统一的工具和端点，您可以将 Kalshi 的预测市场、实时交易功能和深度事件数据无缝集成到您的 AI 驱动应用程序、仪表板和工作流中，从而实现与真实世界结果相关的复杂自动化决策。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Kalshi 预测市场集成到工作流程中。可以获取市场、单个市场、事件、单个事件、余额、头寸、订单、订单簿、交易、K线图、成交、系列、交易所状态，并进行下单/取消/修改交易。

## 工具

### `kalshi_get_markets`

从 Kalshi 检索预测市场列表，并可选择进行筛选

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `status` | string | 否 | 按状态筛选 \(未开放、开放、关闭、已结算\) |
| `seriesTicker` | string | 否 | 按系列代码筛选 |
| `eventTicker` | string | 否 | 按事件代码筛选 |
| `limit` | string | 否 | 结果数量 \(1-1000，默认值：100\) |
| `cursor` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `markets` | array | 市场对象的数组 |
| `paging` | object | 用于获取更多结果的分页游标 |

### `kalshi_get_market`

通过代码检索特定预测市场的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | 是 | 市场代码 \(例如："KXBTC-24DEC31"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `market` | object | 包含详细信息的市场对象 |

### `kalshi_get_events`

从 Kalshi 检索事件列表，并可选择进行筛选

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `status` | string | 否 | 按状态筛选 \(开放、关闭、已结算\) |
| `seriesTicker` | string | 否 | 按系列代码筛选 |
| `withNestedMarkets` | string | 否 | 在响应中包含嵌套市场 \(true/false\) |
| `limit` | string | 否 | 结果数量 \(1-200，默认值：200\) |
| `cursor` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `events` | array | 事件对象的数组 |
| `paging` | object | 用于获取更多结果的分页游标 |

### `kalshi_get_event`

通过代码检索特定事件的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `eventTicker` | string | 是 | 事件代码 |
| `withNestedMarkets` | string | 否 | 在响应中包含嵌套市场 \(true/false\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `event` | object | 包含详细信息的事件对象 |

### `kalshi_get_balance`

从 Kalshi 检索您的账户余额和投资组合价值

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `balance` | number | 账户余额（以分为单位） |
| `portfolioValue` | number | 投资组合价值（以分为单位） |
| `balanceDollars` | number | 账户余额（以美元为单位） |
| `portfolioValueDollars` | number | 投资组合价值（以美元为单位） |

### `kalshi_get_positions`

从 Kalshi 检索您的未平仓头寸

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |
| `ticker` | string | 否 | 按市场代码筛选 |
| `eventTicker` | string | 否 | 按事件代码筛选 \(最多 10 个逗号分隔\) |
| `settlementStatus` | string | 否 | 按结算状态筛选 \(all, unsettled, settled\)。默认值：unsettled |
| `limit` | string | 否 | 结果数量 \(1-1000，默认值：100\) |
| `cursor` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `positions` | array | 持仓对象的数组 |
| `paging` | object | 用于获取更多结果的分页游标 |

### `kalshi_get_orders`

通过可选过滤从 Kalshi 检索您的订单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |
| `ticker` | string | 否 | 按市场代码过滤 |
| `eventTicker` | string | 否 | 按事件代码过滤 \(最多 10 个逗号分隔\) |
| `status` | string | 否 | 按状态过滤 \(resting, canceled, executed\) |
| `limit` | string | 否 | 结果数量 \(1-200，默认值：100\) |
| `cursor` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `orders` | array | 订单对象的数组 |
| `paging` | object | 用于获取更多结果的分页游标 |

### `kalshi_get_order`

通过 ID 从 Kalshi 检索特定订单的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |
| `orderId` | string | 是 | 要检索的订单 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 包含详细信息的订单对象 |

### `kalshi_get_orderbook`

检索特定市场的订单簿（买入和卖出报价）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | 是 | 市场代码 \(例如：KXBTC-24DEC31\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `orderbook` | object | 包含买入/卖出报价的订单簿 |

### `kalshi_get_trades`

检索所有市场的最近交易

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | 否 | 结果数量 \(1-1000，默认值：100\) |
| `cursor` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `trades` | array | 交易对象的数组 |
| `paging` | object | 用于获取更多结果的分页游标 |

### `kalshi_get_candlesticks`

检索特定市场的 OHLC 蜡烛图数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | 是 | 系列代码 |
| `ticker` | string | 是 | 市场代码 \(例如：KXBTC-24DEC31\) |
| `startTs` | number | 是 | 开始时间戳 \(Unix 秒\) |
| `endTs` | number | 是 | 结束时间戳 \(Unix 秒\) |
| `periodInterval` | number | 是 | 时间间隔：1 \(1分钟\), 60 \(1小时\), 或 1440 \(1天\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `candlesticks` | array | OHLC 蜡烛图数据的数组 |

### `kalshi_get_fills`

检索您的投资组合

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |
| `ticker` | string | 否 | 按市场代码过滤 |
| `orderId` | string | 否 | 按订单 ID 过滤 |
| `minTs` | number | 否 | 最小时间戳 \(Unix 毫秒\) |
| `maxTs` | number | 否 | 最大时间戳 \(Unix 毫秒\) |
| `limit` | string | 否 | 结果数量 \(1-1000，默认值：100\) |
| `cursor` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `fills` | array | 成交/交易对象的数组 |
| `paging` | object | 用于获取更多结果的分页游标 |

### `kalshi_get_series_by_ticker`

通过代码检索特定市场系列的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | 是 | 系列代码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `series` | object | 包含详细信息的系列对象 |

### `kalshi_get_exchange_status`

检索 Kalshi 交易所的当前状态（交易和交易所活动）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `status` | object | 包含 trading_active 和 exchange_active 标志的交易所状态 |

### `kalshi_create_order`

在 Kalshi 预测市场创建新订单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥（PEM 格式）|
| `ticker` | string | 是 | 市场代码 \(例如：KXBTC-24DEC31\) |
| `side` | string | 是 | 订单方向：'yes' 或 'no' |
| `action` | string | 是 | 操作类型：'buy' 或 'sell' |
| `count` | string | 是 | 合约数量（最少 1）|
| `type` | string | 否 | 订单类型：'limit' 或 'market'（默认：limit）|
| `yesPrice` | string | 否 | Yes 价格（以美分为单位，1-99）|
| `noPrice` | string | 否 | No 价格（以美分为单位，1-99）|
| `yesPriceDollars` | string | 否 | Yes 价格（以美元为单位，例如："0.56"）|
| `noPriceDollars` | string | 否 | No 价格（以美元为单位，例如："0.56"）|
| `clientOrderId` | string | 否 | 自定义订单标识符 |
| `expirationTs` | string | 否 | 订单过期的 Unix 时间戳 |
| `timeInForce` | string | 否 | 有效时间：'fill_or_kill'，'good_till_canceled'，'immediate_or_cancel' |
| `buyMaxCost` | string | 否 | 最大成本（以美分为单位，自动启用 fill_or_kill）|
| `postOnly` | string | 否 | 设置为 'true' 以仅限做市订单 |
| `reduceOnly` | string | 否 | 设置为 'true' 以仅限减少头寸 |
| `selfTradePreventionType` | string | 否 | 自交易预防：'taker_at_cross' 或 'maker' |
| `orderGroupId` | string | 否 | 关联的订单组 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 创建的订单对象 |

### `kalshi_cancel_order`

取消 Kalshi 上的现有订单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |
| `orderId` | string | 是 | 要取消的订单 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 已取消的订单对象 |
| `reducedBy` | number | 已取消的合约数量 |

### `kalshi_amend_order`

修改 Kalshi 上现有订单的价格或数量

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | 是 | 您的 Kalshi API 密钥 ID |
| `privateKey` | string | 是 | 您的 RSA 私钥 \(PEM 格式\) |
| `orderId` | string | 是 | 要修改的订单 ID |
| `ticker` | string | 是 | 市场代码 |
| `side` | string | 是 | 订单方向：'yes' 或 'no' |
| `action` | string | 是 | 操作类型：'buy' 或 'sell' |
| `clientOrderId` | string | 是 | 原始客户指定的订单 ID |
| `updatedClientOrderId` | string | 是 | 修改后的客户指定订单 ID |
| `count` | string | 否 | 更新后的订单数量 |
| `yesPrice` | string | 否 | 更新后的 yes 价格（以分为单位 \(1-99\)） |
| `noPrice` | string | 否 | 更新后的 no 价格（以分为单位 \(1-99\)） |
| `yesPriceDollars` | string | 否 | 更新后的 yes 价格（以美元为单位 \(例如，"0.56"\)） |
| `noPriceDollars` | string | 否 | 更新后的 no 价格（以美元为单位 \(例如，"0.56"\)） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 修改后的订单对象 |

## 注意

- 类别：`tools`
- 类型：`kalshi`
```

--------------------------------------------------------------------------------

---[FILE: knowledge.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/knowledge.mdx

```text
---
title: 知识
description: 使用向量搜索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="knowledge"
  color="#00B0B0"
/>

{/* MANUAL-CONTENT-START:intro */}
Sim 的知识库是一项强大的原生功能，能够让您直接在平台内创建、管理和查询自定义知识库。通过先进的 AI 嵌入和向量搜索技术，知识库模块可以将智能搜索功能集成到您的工作流程中，使您能够轻松查找和利用组织内的相关信息。

知识库系统通过其灵活且可扩展的架构，为管理组织知识提供了全面的解决方案。借助内置的向量搜索功能，团队可以执行语义搜索，理解意义和上下文，超越传统的关键词匹配。

知识库的主要功能包括：

- 语义搜索：由高级 AI 驱动的搜索，能够理解意义和上下文，而不仅仅是关键词
- 向量嵌入：自动将文本转换为高维向量，以实现智能相似性匹配
- 自定义知识库：为不同的目的或部门创建和管理多个知识库
- 灵活的内容类型：支持各种文档格式和内容类型
- 实时更新：新内容即时索引，便于即时搜索

在 Sim 中，知识库模块使您的代理能够在自定义知识库中执行智能语义搜索。这为自动化信息检索、内容推荐和知识发现创造了机会，成为您 AI 工作流的一部分。该集成允许代理以编程方式搜索和检索相关信息，从而促进自动化知识管理任务，并确保重要信息易于访问。通过利用知识库模块，您可以构建智能代理，增强信息发现能力，同时自动化常规知识管理任务，提高团队效率，并确保组织知识的一致访问。
{/* MANUAL-CONTENT-END */}

## 使用说明

将知识整合到工作流程中。可以搜索、上传内容块并创建文档。

## 工具

### `knowledge_search`

使用向量相似性在知识库中搜索相似内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `knowledgeBaseId` | string | 是 | 要搜索的知识库的 ID |
| `query` | string | 否 | 搜索查询文本（使用标签过滤器时可选） |
| `topK` | number | 否 | 要返回的最相似结果的数量（1-100） |
| `tagFilters` | array | 否 | 包含 tagName 和 tagValue 属性的标签过滤器数组 |
| `items` | object | 否 | 无描述 |
| `properties` | string | 否 | 无描述 |
| `tagName` | string | 否 | 无描述 |
| `tagValue` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 知识库搜索结果的数组 |

### `knowledge_upload_chunk`

向知识库中的文档上传一个新的块

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `knowledgeBaseId` | string | 是 | 包含该文档的知识库的 ID |
| `documentId` | string | 是 | 要上传块的文档 ID |
| `content` | string | 是 | 要上传的块的内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | object | 关于已上传块的信息 |

### `knowledge_create_document`

在知识库中创建一个新文档

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `knowledgeBaseId` | string | 是 | 包含该文档的知识库的 ID |
| `name` | string | 是 | 文档的名称 |
| `content` | string | 是 | 文档的内容 |
| `tag1` | string | 否 | 文档的标签 1 值 |
| `tag2` | string | 否 | 文档的标签 2 值 |
| `tag3` | string | 否 | 文档的标签 3 值 |
| `tag4` | string | 否 | 文档的标签 4 值 |
| `tag5` | string | 否 | 文档的标签 5 值 |
| `tag6` | string | 否 | 文档的标签 6 值 |
| `tag7` | string | 否 | 文档的标签 7 值 |
| `documentTagsData` | array | 否 | 包含名称、类型和值的结构化标签数据 |
| `items` | object | 否 | 无描述 |
| `properties` | string | 否 | 无描述 |
| `tagName` | string | 否 | 无描述 |
| `tagValue` | string | 否 | 无描述 |
| `tagType` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | object | 关于创建文档的信息 |

## 注意事项

- 类别：`blocks`
- 类型：`knowledge`
```

--------------------------------------------------------------------------------

````

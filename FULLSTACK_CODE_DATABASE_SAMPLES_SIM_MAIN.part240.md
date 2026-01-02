---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 240
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 240 of 933)

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

---[FILE: sendgrid.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/sendgrid.mdx

```text
---
title: SendGrid
description: 使用 SendGrid 发送电子邮件并管理联系人、列表和模板
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sendgrid"
  color="#1A82E2"
/>

{/* MANUAL-CONTENT-START:intro */}
[SendGrid](https://sendgrid.com) 是一个领先的基于云的电子邮件发送平台，受到开发者和企业的信赖，可大规模发送可靠的事务性和营销电子邮件。通过其强大的 API 和工具，SendGrid 使您能够管理电子邮件通信的各个方面，从发送通知和收据到管理复杂的营销活动。

SendGrid 为用户提供了一整套电子邮件操作功能，使您能够自动化关键的电子邮件工作流，并密切管理联系人列表、模板和收件人参与度。它与 Sim 的无缝集成使代理和工作流能够发送目标消息，维护动态联系人和收件人列表，通过模板触发个性化电子邮件，并实时跟踪结果。

SendGrid 的主要功能包括：

- **事务性电子邮件：** 发送自动化和大批量的事务性电子邮件（如通知、收据和密码重置）。
- **动态模板：** 使用丰富的 HTML 或文本模板和动态数据，实现大规模高度个性化的通信。
- **联系人管理：** 添加和更新营销联系人，管理收件人列表，并针对活动目标群体进行细分。
- **附件支持：** 在电子邮件中包含一个或多个文件附件。
- **全面的 API 覆盖：** 以编程方式管理电子邮件、联系人、列表、模板、抑制组等。

通过将 SendGrid 与 Sim 连接，您的代理可以：

- 在任何工作流中发送简单或高级（模板化或多收件人）的电子邮件。
- 自动管理和细分联系人和列表。
- 利用模板实现一致性和动态个性化。
- 在自动化流程中跟踪和响应电子邮件参与情况。

此集成允许您自动化所有关键的通信流程，确保消息到达正确的受众，并直接从 Sim 工作流中维护对您组织电子邮件策略的控制。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 SendGrid 集成到您的工作流中。发送事务性电子邮件，管理营销联系人和列表，并使用电子邮件模板。支持动态模板、附件和全面的联系人管理。

## 工具

### `sendgrid_send_mail`

使用 SendGrid API 发送电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `from` | string | 是 | 发件人电子邮件地址 \(必须在 SendGrid 中验证\) |
| `fromName` | string | 否 | 发件人名称 |
| `to` | string | 是 | 收件人电子邮件地址 |
| `toName` | string | 否 | 收件人名称 |
| `subject` | string | 否 | 电子邮件主题 \(除非使用具有预定义主题的模板，否则必需\) |
| `content` | string | 否 | 电子邮件正文内容 \(除非使用具有预定义内容的模板，否则必需\) |
| `contentType` | string | 否 | 内容类型 \(text/plain 或 text/html\) |
| `cc` | string | 否 | 抄送电子邮件地址 |
| `bcc` | string | 否 | 密送电子邮件地址 |
| `replyTo` | string | 否 | 回复电子邮件地址 |
| `replyToName` | string | 否 | 回复名称 |
| `attachments` | file[] | 否 | 附加到电子邮件的文件 |
| `templateId` | string | 否 | 要使用的 SendGrid 模板 ID |
| `dynamicTemplateData` | json | 否 | 动态模板数据的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 邮件是否成功发送 |
| `messageId` | string | SendGrid 消息 ID |
| `to` | string | 收件人邮箱地址 |
| `subject` | string | 邮件主题 |

### `sendgrid_add_contact`

向 SendGrid 添加新联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `email` | string | 是 | 联系人邮箱地址 |
| `firstName` | string | 否 | 联系人名字 |
| `lastName` | string | 否 | 联系人姓氏 |
| `customFields` | json | 否 | 自定义字段键值对的 JSON 对象 \(使用字段 ID，如 e1_T, e2_N, e3_D，而不是字段名称\) |
| `listIds` | string | 否 | 用逗号分隔的列表 ID，用于添加联系人 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobId` | string | 用于跟踪异步联系人创建的作业 ID |
| `email` | string | 联系人邮箱地址 |
| `firstName` | string | 联系人名字 |
| `lastName` | string | 联系人姓氏 |
| `message` | string | 状态消息 |

### `sendgrid_get_contact`

通过 ID 从 SendGrid 获取特定联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `contactId` | string | 是 | 联系人 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 联系人 ID |
| `email` | string | 联系人邮箱地址 |
| `firstName` | string | 联系人名字 |
| `lastName` | string | 联系人姓氏 |
| `createdAt` | string | 创建时间戳 |
| `updatedAt` | string | 最后更新时间戳 |
| `listIds` | json | 联系人所属列表 ID 的数组 |
| `customFields` | json | 自定义字段值 |

### `sendgrid_search_contacts`

使用查询在 SendGrid 中搜索联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `query` | string | 是 | 搜索查询 \(例如，\"email LIKE '%example.com%' AND CONTAINS\(list_ids, 'list-id'\)\"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contacts` | json | 匹配联系人的数组 |
| `contactCount` | number | 找到的联系人总数 |

### `sendgrid_delete_contacts`

从 SendGrid 中删除一个或多个联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `contactIds` | string | 是 | 要删除的联系人 ID，逗号分隔 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobId` | string | 删除请求的作业 ID |

### `sendgrid_create_list`

在 SendGrid 中创建一个新的联系人列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `name` | string | 是 | 列表名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 列表 ID |
| `name` | string | 列表名称 |
| `contactCount` | number | 列表中的联系人数量 |

### `sendgrid_get_list`

通过 ID 从 SendGrid 获取特定列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `listId` | string | 是 | 列表 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 列表 ID |
| `name` | string | 列表名称 |
| `contactCount` | number | 列表中的联系人数量 |

### `sendgrid_list_all_lists`

从 SendGrid 获取所有联系人列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `pageSize` | number | 否 | 每页返回的列表数量 \(默认值: 100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `lists` | json | 列表数组 |

### `sendgrid_delete_list`

从 SendGrid 删除联系人列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `listId` | string | 是 | 要删除的列表 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `sendgrid_add_contacts_to_list`

在 SendGrid 中添加或更新联系人并将其分配到列表中（使用 PUT /v3/marketing/contacts）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `listId` | string | 是 | 要添加联系人的列表 ID |
| `contacts` | json | 是 | 联系人对象的 JSON 数组。每个联系人必须至少包含：email（或 phone_number_id/external_id/anonymous_id）。示例：\[\{"email": "user@example.com", "first_name": "John"\}\] |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobId` | string | 用于跟踪异步操作的作业 ID |
| `message` | string | 状态消息 |

### `sendgrid_remove_contacts_from_list`

从 SendGrid 的特定列表中移除联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `listId` | string | 是 | 列表 ID |
| `contactIds` | string | 是 | 要从列表中移除的逗号分隔的联系人 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobId` | string | 请求的作业 ID |

### `sendgrid_create_template`

在 SendGrid 中创建一个新的电子邮件模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `name` | string | 是 | 模板名称 |
| `generation` | string | 否 | 模板生成类型（legacy 或 dynamic，默认值：dynamic） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 模板 ID |
| `name` | string | 模板名称 |
| `generation` | string | 模板生成 |
| `updatedAt` | string | 最后更新时间戳 |
| `versions` | json | 模板版本数组 |

### `sendgrid_get_template`

通过 ID 从 SendGrid 获取特定模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `templateId` | string | 是 | 模板 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 模板 ID |
| `name` | string | 模板名称 |
| `generation` | string | 模板生成 |
| `updatedAt` | string | 最后更新时间戳 |
| `versions` | json | 模板版本数组 |

### `sendgrid_list_templates`

从 SendGrid 获取所有电子邮件模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `generations` | string | 否 | 按生成方式筛选 \(legacy、dynamic 或 both\) |
| `pageSize` | number | 否 | 每页返回的模板数量 \(默认值: 20\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `templates` | json | 模板数组 |

### `sendgrid_delete_template`

从 SendGrid 删除电子邮件模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `templateId` | string | 是 | 要删除的模板 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `message` | string | 状态或成功消息 |
| `messageId` | string | 邮件消息 ID \(send_mail\) |
| `to` | string | 收件人邮箱地址 \(send_mail\) |
| `subject` | string | 邮件主题 \(send_mail, create_template_version\) |
| `id` | string | 资源 ID |
| `jobId` | string | 异步操作的作业 ID |
| `email` | string | 联系人邮箱地址 |
| `firstName` | string | 联系人名字 |
| `lastName` | string | 联系人姓氏 |
| `createdAt` | string | 创建时间戳 |
| `updatedAt` | string | 最后更新时间戳 |
| `listIds` | json | 联系人所属列表 ID 的数组 |
| `customFields` | json | 自定义字段值 |
| `contacts` | json | 联系人数组 |
| `contactCount` | number | 联系人数 |
| `lists` | json | 列表数组 |
| `name` | string | 资源名称 |
| `templates` | json | 模板数组 |
| `generation` | string | 模板生成 |
| `versions` | json | 模板版本数组 |
| `templateId` | string | 模板 ID |
| `active` | boolean | 模板版本是否激活 |
| `htmlContent` | string | HTML 内容 |
| `plainContent` | string | 纯文本内容 |

### `sendgrid_create_template_version`

在 SendGrid 中创建一个新的电子邮件模板版本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | SendGrid API 密钥 |
| `templateId` | string | 是 | 模板 ID |
| `name` | string | 是 | 版本名称 |
| `subject` | string | 是 | 电子邮件主题行 |
| `htmlContent` | string | 否 | 模板的 HTML 内容 |
| `plainContent` | string | 否 | 模板的纯文本内容 |
| `active` | boolean | 否 | 此版本是否为激活状态（默认：true） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 版本 ID |
| `templateId` | string | 模板 ID |
| `name` | string | 版本名称 |
| `subject` | string | 电子邮件主题 |
| `active` | boolean | 此版本是否为激活状态 |
| `htmlContent` | string | HTML 内容 |
| `plainContent` | string | 纯文本内容 |
| `updatedAt` | string | 最后更新时间戳 |

## 注意事项

- 类别：`tools`
- 类型：`sendgrid`
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/sentry.mdx

```text
---
title: Sentry
description: 管理 Sentry 的问题、项目、事件和发布
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sentry"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
通过 [Sentry](https://sentry.io/) —— 业界领先的实时错误跟踪、性能监控和发布管理平台，增强您的错误监控和应用程序可靠性。将 Sentry 无缝集成到您的自动化代理工作流中，轻松监控问题、跟踪关键事件、管理项目，并协调所有应用程序和服务的发布。

使用 Sentry 工具，您可以：

- **监控和分类问题**：使用 `sentry_issues_list` 操作获取全面的问题列表，并通过 `sentry_issues_get` 检索单个错误和漏洞的详细信息。即时访问元数据、标签、堆栈跟踪和统计数据，以减少平均解决时间。
- **跟踪事件数据**：通过 `sentry_events_list` 和 `sentry_events_get` 分析特定的错误和事件实例，深入了解错误发生情况及其对用户的影响。
- **管理项目和团队**：使用 `sentry_projects_list` 和 `sentry_project_get` 枚举和审查所有 Sentry 项目，确保团队协作顺畅和配置集中化。
- **协调发布**：通过 `sentry_releases_list`、`sentry_release_get` 等操作，自动化版本跟踪、部署健康和变更管理。
- **获取强大的应用程序洞察**：利用高级过滤器和查询，查找未解决或高优先级问题，汇总事件统计数据，并在代码库演变时跟踪回归。

Sentry 的集成使工程和 DevOps 团队能够及早发现问题，优先处理最具影响力的漏洞，并持续改善开发堆栈中的应用程序健康状况。以编程方式协调现代可观测性、事件响应和发布生命周期管理的工作流自动化——减少停机时间并提高用户满意度。

**可用的 Sentry 关键操作**：
- `sentry_issues_list`：列出组织和项目的 Sentry 问题，支持强大的搜索和过滤功能。
- `sentry_issues_get`：检索特定 Sentry 问题的详细信息。
- `sentry_events_list`：枚举特定问题的事件，用于根本原因分析。
- `sentry_events_get`：获取单个事件的完整详细信息，包括堆栈跟踪、上下文和元数据。
- `sentry_projects_list`：列出组织内的所有 Sentry 项目。
- `sentry_project_get`：检索特定项目的配置和详细信息。
- `sentry_releases_list`：列出最近的发布及其部署状态。
- `sentry_release_get`：检索详细的发布信息，包括相关的提交和问题。

无论是主动管理应用健康状况、排查生产错误，还是自动化发布工作流，Sentry 都为您提供世界一流的监控、可操作的警报以及无缝的 DevOps 集成。通过利用 Sentry 进行错误跟踪、可观测性和发布管理，从您的智能工作流中提升软件质量和搜索可见性。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Sentry 集成到工作流中。监控问题、管理项目、跟踪事件，并协调应用程序的发布。

## 工具

### `sentry_issues_list`

列出特定组织（可选特定项目）的 Sentry 问题。返回包括状态、错误计数和最后一次查看时间戳在内的问题详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `projectSlug` | string | 否 | 按特定项目 slug 过滤问题（可选） |
| `query` | string | 否 | 用于过滤问题的搜索查询。支持 Sentry 搜索语法（例如，"is:unresolved"，"level:error"） |
| `statsPeriod` | string | 否 | 统计的时间范围（例如，"24h"，"7d"，"30d"）。如果未指定，默认为 24h。 |
| `cursor` | string | 否 | 用于检索下一页结果的分页游标 |
| `limit` | number | 否 | 每页返回的问题数量（默认：25，最大：100） |
| `status` | string | 否 | 按问题状态过滤：未解决、已解决、已忽略或已静音 |
| `sort` | string | 否 | 排序顺序：日期、新、频率、优先级或用户（默认：日期） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issues` | array | Sentry 问题列表 |

### `sentry_issues_get`

通过问题的 ID 检索特定 Sentry 问题的详细信息。返回完整的问题详情，包括元数据、标签和统计信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `issueId` | string | 是 | 要检索的问题的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issue` | object | Sentry 问题的详细信息 |

### `sentry_issues_update`

通过更改状态、分配、书签状态或其他属性来更新 Sentry 问题。返回更新后的问题详情。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `issueId` | string | 是 | 要更新的问题的唯一 ID |
| `status` | string | 否 | 问题的新状态：resolved、unresolved、ignored 或 resolvedInNextRelease |
| `assignedTo` | string | 否 | 要分配问题的用户 ID 或电子邮件。使用空字符串取消分配。 |
| `isBookmarked` | boolean | 否 | 是否为问题添加书签 |
| `isSubscribed` | boolean | 否 | 是否订阅问题更新 |
| `isPublic` | boolean | 否 | 问题是否应公开可见 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `issue` | object | 更新后的 Sentry 问题 |

### `sentry_projects_list`

列出 Sentry 组织中的所有项目。返回的项目详情包括名称、平台、团队和配置。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `cursor` | string | 否 | 用于获取下一页结果的分页游标 |
| `limit` | number | 否 | 每页返回的项目数量 \(默认: 25, 最大: 100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `projects` | array | Sentry 项目列表 |

### `sentry_projects_get`

通过项目的 slug 检索特定 Sentry 项目的详细信息。返回完整的项目详情，包括团队、功能和配置。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `projectSlug` | string | 是 | 要检索的项目的 ID 或 slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `project` | object | 关于 Sentry 项目的详细信息 |

### `sentry_projects_create`

在组织中创建一个新的 Sentry 项目。需要一个团队来关联该项目。返回创建的项目详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `name` | string | 是 | 项目的名称 |
| `teamSlug` | string | 是 | 将拥有此项目的团队的 slug |
| `slug` | string | 否 | URL 友好的项目标识符（如果未提供，则根据名称自动生成） |
| `platform` | string | 否 | 项目的平台/语言（例如，javascript、python、node、react-native）。如果未指定，默认为 "other" |
| `defaultRules` | boolean | 否 | 是否创建默认的警报规则（默认值：true） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `project` | object | 新创建的 Sentry 项目 |

### `sentry_projects_update`

通过更改名称、slug、平台或其他设置来更新 Sentry 项目。返回更新后的项目详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `projectSlug` | string | 是 | 要更新的项目的 slug |
| `name` | string | 否 | 项目的新名称 |
| `slug` | string | 否 | 新的 URL 友好的项目标识符 |
| `platform` | string | 否 | 项目的新平台/语言（例如，javascript、python、node） |
| `isBookmarked` | boolean | 否 | 是否将项目标记为书签 |
| `digestsMinDelay` | number | 否 | 摘要通知的最小延迟（以秒为单位） |
| `digestsMaxDelay` | number | 否 | 摘要通知的最大延迟（以秒为单位） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `project` | object | 更新后的 Sentry 项目 |

### `sentry_events_list`

列出 Sentry 项目中的事件。可以通过问题 ID、查询或时间段进行筛选。返回的事件详情包括上下文、标签和用户信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `projectSlug` | string | 是 | 要列出事件的项目的 slug |
| `issueId` | string | 否 | 按特定问题 ID 筛选事件 |
| `query` | string | 否 | 用于筛选事件的搜索查询。支持 Sentry 搜索语法（例如："user.email:*@example.com"） |
| `cursor` | string | 否 | 用于检索下一页结果的分页游标 |
| `limit` | number | 否 | 每页返回的事件数量（默认：50，最大：100） |
| `statsPeriod` | string | 否 | 查询的时间段（例如："24h"、"7d"、"30d"）。如果未指定，默认为 90d。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `events` | array | Sentry 事件列表 |

### `sentry_events_get`

通过事件 ID 检索特定 Sentry 事件的详细信息。返回完整的事件详情，包括堆栈跟踪、面包屑、上下文和用户信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `projectSlug` | string | 是 | 项目的 slug |
| `eventId` | string | 是 | 要检索的事件的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `event` | object | 有关 Sentry 事件的详细信息 |

### `sentry_releases_list`

列出 Sentry 组织或项目的发布版本。返回包括版本、提交、部署信息和相关项目的发布详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `projectSlug` | string | 否 | 按特定项目 slug 筛选发布版本（可选） |
| `query` | string | 否 | 用于筛选发布版本的搜索查询（例如，版本名称模式） |
| `cursor` | string | 否 | 用于检索下一页结果的分页游标 |
| `limit` | number | 否 | 每页返回的发布版本数量（默认：25，最大：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `releases` | array | Sentry 发布版本列表 |

### `sentry_releases_create`

在 Sentry 中创建一个新版本。版本是部署到环境中的代码版本。可以包含提交信息和相关项目。返回创建的版本详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `version` | string | 是 | 版本标识符 \(例如，"2.0.0"、"my-app@1.0.0" 或 git 提交 SHA\) |
| `projects` | string | 是 | 与此版本关联的项目 slug 的逗号分隔列表 |
| `ref` | string | 否 | 此版本的 Git 引用 \(提交 SHA、标签或分支\) |
| `url` | string | 否 | 指向版本的 URL \(例如，GitHub 版本页面\) |
| `dateReleased` | string | 否 | 部署版本时的 ISO 8601 时间戳 \(默认为当前时间\) |
| `commits` | string | 否 | 包含 id、repository \(可选\) 和 message \(可选\) 的提交对象 JSON 数组。例如：\[\{"id":"abc123","message":"修复错误"\}\] |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `release` | object | 新创建的 Sentry 版本 |

### `sentry_releases_deploy`

为特定环境中的 Sentry 版本创建一个部署记录。部署记录跟踪版本的部署时间和位置。返回创建的部署详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Sentry API 身份验证令牌 |
| `organizationSlug` | string | 是 | 组织的 slug |
| `version` | string | 是 | 部署的版本标识符 |
| `environment` | string | 是 | 部署版本的环境名称（例如，"production"，"staging"） |
| `name` | string | 否 | 此次部署的可选名称（例如，"Deploy v2.0 to Production"） |
| `url` | string | 否 | 指向部署的 URL（例如，CI/CD 管道 URL） |
| `dateStarted` | string | 否 | 部署开始时间的 ISO 8601 时间戳（默认为当前时间） |
| `dateFinished` | string | 否 | 部署完成时间的 ISO 8601 时间戳 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deploy` | object | 新创建的部署记录 |

## 注意

- 类别: `tools`
- 类型: `sentry`
```

--------------------------------------------------------------------------------

---[FILE: serper.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/serper.mdx

```text
---
title: Serper
description: 使用 Serper 搜索网络
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="serper"
  color="#2B3543"
/>

{/* MANUAL-CONTENT-START:intro */}
[Serper](https://www.serper.com/) 是一个 Google 搜索 API，提供开发者以编程方式访问 Google 搜索结果的功能。它为应用程序集成 Google 搜索功能提供了一种可靠且高性能的方式，无需面对网页抓取的复杂性或其他搜索 API 的限制。

使用 Serper，您可以：

- **访问 Google 搜索结果**：以编程方式获取 Google 搜索结果的结构化数据
- **执行多种搜索类型**：进行网页搜索、图片搜索、新闻搜索等
- **获取丰富的元数据**：从搜索结果中获取标题、摘要、URL 和其他相关信息
- **扩展您的应用程序**：通过可靠且快速的 API 构建基于搜索功能的特性
- **避免速率限制**：无需担心 IP 被封锁，持续访问搜索结果

在 Sim 中，Serper 集成使您的代理能够在工作流程中利用网络搜索的强大功能。这支持需要从互联网获取最新信息的复杂自动化场景。您的代理可以制定搜索查询，检索相关结果，并使用这些信息做出决策或提供响应。此集成弥合了您的工作流程自动化与网络上广泛知识之间的差距，使您的代理无需人工干预即可访问实时信息。通过将 Sim 与 Serper 连接，您可以创建能够跟上最新信息的代理，提供更准确的响应，并为用户带来更多价值。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Serper 集成到工作流程中。可以搜索网页。需要 API 密钥。

## 工具

### `serper_search`

一个强大的网页搜索工具，通过 Serper.dev API 提供对 Google 搜索结果的访问。支持多种类型的搜索，包括常规网页搜索、新闻、地点和图片，每个结果都包含相关的元数据，如标题、URL、摘要和特定类型的信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | 搜索查询 |
| `num` | 数字 | 否 | 返回结果的数量 |
| `gl` | 字符串 | 否 | 搜索结果的国家代码 |
| `hl` | 字符串 | 否 | 搜索结果的语言代码 |
| `type` | 字符串 | 否 | 要执行的搜索类型 |
| `apiKey` | 字符串 | 是 | Serper API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `searchResults` | 数组 | 包含标题、链接、摘要和特定类型元数据（新闻的日期、地点的评分、图片的 imageUrl）的搜索结果 |

## 注意事项

- 分类：`tools`
- 类型：`serper`
```

--------------------------------------------------------------------------------

---[FILE: servicenow.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/servicenow.mdx

```text
---
title: ServiceNow
description: 创建、读取、更新和删除 ServiceNow 记录
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="servicenow"
  color="#032D42"
/>

{/* MANUAL-CONTENT-START:intro */}
[ServiceNow](https://www.servicenow.com/) 是一款强大的云平台，旨在简化和自动化 IT 服务管理（ITSM）、工作流以及企业各类业务流程。ServiceNow 让您能够通过其强大的 API 管理事件、请求、任务、用户等多种内容。

使用 ServiceNow，您可以：

- **自动化 IT 工作流**：在任意 ServiceNow 表中创建、读取、更新和删除记录，如事件、任务、变更请求和用户等。
- **集成系统**：将 ServiceNow 与您的其他工具和流程连接，实现无缝自动化。
- **维护单一数据源**：让所有服务和运营数据井然有序，便于访问。
- **提升运营效率**：通过可定制的工作流和自动化，减少手动操作，提高服务质量。

在 Sim 中，ServiceNow 集成让您的代理能够在工作流中直接与 ServiceNow 实例交互。代理可以在任意 ServiceNow 表中创建、读取、更新或删除记录，并利用工单或用户数据实现复杂的自动化和决策。这一集成将您的工作流自动化与 IT 运维无缝衔接，使代理能够自动化管理服务请求、事件、用户和资产，无需人工干预。通过将 Sim 与 ServiceNow 连接，您可以自动化服务管理任务、提升响应速度，并确保对组织关键服务数据的持续、安全访问。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 ServiceNow 集成到您的工作流中。在任意 ServiceNow 表（包括事件、任务、变更请求、用户等）中创建、读取、更新和删除记录。

## 工具

### `servicenow_create_record`

在 ServiceNow 表中创建新记录

#### 输入

| 参数 | 类型 | 是否必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | 是 | ServiceNow 实例 URL（例如：https://instance.service-now.com） |
| `username` | string | 是 | ServiceNow 用户名 |
| `password` | string | 是 | ServiceNow 密码 |
| `tableName` | string | 是 | 表名（例如：incident、task、sys_user） |
| `fields` | json | 是 | 记录中要设置的字段（JSON 对象） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `record` | json | 创建的 ServiceNow 记录，包含 sys_id 及其他字段 |
| `metadata` | json | 操作元数据 |

### `servicenow_read_record`

从 ServiceNow 表中读取记录

#### 输入

| 参数 | 类型 | 是否必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | 是 | ServiceNow 实例 URL（例如：https://instance.service-now.com） |
| `username` | string | 是 | ServiceNow 用户名 |
| `password` | string | 是 | ServiceNow 密码 |
| `tableName` | string | 是 | 表名 |
| `sysId` | string | 否 | 指定记录 sys_id |
| `number` | string | 否 | 记录编号（例如：INC0010001） |
| `query` | string | 否 | 编码查询字符串（例如："active=true^priority=1"） |
| `limit` | number | 否 | 返回的最大记录数 |
| `fields` | string | 否 | 要返回的字段列表（以逗号分隔） |

#### 输出

| 参数 | 类型 | 说明 |
| --------- | ---- | ----------- |
| `records` | array | ServiceNow 记录数组 |
| `metadata` | json | 操作元数据 |

### `servicenow_update_record`

更新 ServiceNow 表中的现有记录

#### 输入

| 参数 | 类型 | 必填 | 说明 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | 是 | ServiceNow 实例 URL（例如：https://instance.service-now.com） |
| `username` | string | 是 | ServiceNow 用户名 |
| `password` | string | 是 | ServiceNow 密码 |
| `tableName` | string | 是 | 表名 |
| `sysId` | string | 是 | 要更新的记录 sys_id |
| `fields` | json | 是 | 要更新的字段（JSON 对象） |

#### 输出

| 参数 | 类型 | 说明 |
| --------- | ---- | ----------- |
| `record` | json | 已更新的 ServiceNow 记录 |
| `metadata` | json | 操作元数据 |

### `servicenow_delete_record`

从 ServiceNow 表中删除记录

#### 输入

| 参数 | 类型 | 必填 | 说明 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | 是 | ServiceNow 实例 URL（例如：https://instance.service-now.com） |
| `username` | string | 是 | ServiceNow 用户名 |
| `password` | string | 是 | ServiceNow 密码 |
| `tableName` | string | 是 | 表名 |
| `sysId` | string | 是 | 要删除的记录 sys_id |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 删除是否成功 |
| `metadata` | json | 操作元数据 |

## 备注

- 分类：`tools`
- 类型：`servicenow`
```

--------------------------------------------------------------------------------

---[FILE: sftp.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/sftp.mdx

```text
---
title: SFTP
description: 通过 SFTP（SSH 文件传输协议）传输文件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sftp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SFTP（SSH 文件传输协议）](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol) 是一种安全的网络协议，可让您在远程服务器上上传、下载和管理文件。SFTP 基于 SSH 运行，非常适合现代工作流程中的自动化加密文件传输和远程文件管理。

通过将 SFTP 工具集成到 Sim 中，您可以轻松实现 AI 代理与外部系统或服务器之间的文件自动化传输。这使您的代理能够管理关键数据交换、备份、文档生成和远程系统协调——所有这些都具有强大的安全性。

**通过 SFTP 工具可用的关键功能：**

- **上传文件：** 无缝地将任何类型的文件从您的工作流程传输到远程服务器，支持密码和 SSH 私钥认证。
- **下载文件：** 直接从远程 SFTP 服务器检索文件以进行处理、存档或进一步自动化。
- **列出和管理文件：** 枚举目录，删除或创建文件和文件夹，并远程管理文件系统权限。
- **灵活的认证：** 使用传统密码或 SSH 密钥连接，支持密码短语和权限控制。
- **大文件支持：** 以编程方式管理大文件的上传和下载，并内置大小限制以确保安全。

通过将 SFTP 集成到 Sim 中，您可以将安全的文件操作自动化为任何工作流程的一部分，无论是数据收集、报告、远程系统维护，还是平台之间的动态内容交换。

以下部分描述了可用的关键 SFTP 工具：

- **sftp_upload：** 将一个或多个文件上传到远程服务器。
- **sftp_download：** 从远程服务器下载文件到您的工作流程。
- **sftp_list：** 列出远程 SFTP 服务器上的目录内容。
- **sftp_delete：** 从远程服务器删除文件或目录。
- **sftp_create：** 在远程 SFTP 服务器上创建新文件。
- **sftp_mkdir：** 远程创建新目录。

请参阅下面的工具文档，了解每个操作的详细输入和输出参数。
{/* MANUAL-CONTENT-END */}

## 使用说明

通过 SFTP 上传、下载、列出和管理远程服务器上的文件。支持密码和私钥认证，确保文件传输安全。

## 工具

### `sftp_upload`

将文件上传到远程 SFTP 服务器

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | SFTP 服务器主机名或 IP 地址 |
| `port` | number | 是 | SFTP 服务器端口 \(默认值: 22\) |
| `username` | string | 是 | SFTP 用户名 |
| `password` | string | 否 | 用于认证的密码 \(如果未使用私钥\) |
| `privateKey` | string | 否 | 用于认证的私钥 \(OpenSSH 格式\) |
| `passphrase` | string | 否 | 加密私钥的密码短语 |
| `remotePath` | string | 是 | 远程服务器上的目标目录 |
| `files` | file[] | 否 | 要上传的文件 |
| `fileContent` | string | 否 | 要上传的直接文件内容 \(针对文本文件\) |
| `fileName` | string | 否 | 使用直接内容时的文件名 |
| `overwrite` | boolean | 否 | 是否覆盖现有文件 \(默认值: true\) |
| `permissions` | string | 否 | 文件权限 \(例如: 0644\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 上传是否成功 |
| `uploadedFiles` | json | 上传文件详情数组 \(名称, 远程路径, 大小\) |
| `message` | string | 操作状态消息 |

### `sftp_download`

从远程 SFTP 服务器下载文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | SFTP 服务器主机名或 IP 地址 |
| `port` | number | 是 | SFTP 服务器端口（默认：22） |
| `username` | string | 是 | SFTP 用户名 |
| `password` | string | 否 | 用于身份验证的密码（如果未使用私钥） |
| `privateKey` | string | 否 | 用于身份验证的私钥（OpenSSH 格式） |
| `passphrase` | string | 否 | 加密私钥的密码短语 |
| `remotePath` | string | 是 | 远程服务器上文件的路径 |
| `encoding` | string | 否 | 输出编码：utf-8 表示文本，base64 表示二进制（默认：utf-8） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 下载是否成功 |
| `fileName` | string | 下载文件的名称 |
| `content` | string | 文件内容（文本或 base64 编码） |
| `size` | number | 文件大小（字节） |
| `encoding` | string | 内容编码（utf-8 或 base64） |
| `message` | string | 操作状态消息 |

### `sftp_list`

列出远程 SFTP 服务器上的文件和目录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | SFTP 服务器主机名或 IP 地址 |
| `port` | number | 是 | SFTP 服务器端口（默认：22） |
| `username` | string | 是 | SFTP 用户名 |
| `password` | string | 否 | 用于身份验证的密码（如果未使用私钥） |
| `privateKey` | string | 否 | 用于身份验证的私钥（OpenSSH 格式） |
| `passphrase` | string | 否 | 加密私钥的密码短语 |
| `remotePath` | string | 是 | 远程服务器上的目录路径 |
| `detailed` | boolean | 否 | 是否包含详细的文件信息（大小、权限、修改日期） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作是否成功 |
| `path` | string | 被列出的目录路径 |
| `entries` | json | 包含名称、类型、大小、权限、修改时间的目录条目数组 |
| `count` | number | 目录中的条目数量 |
| `message` | string | 操作状态消息 |

### `sftp_delete`

删除远程 SFTP 服务器上的文件或目录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | SFTP 服务器主机名或 IP 地址 |
| `port` | number | 是 | SFTP 服务器端口 \(默认值: 22\) |
| `username` | string | 是 | SFTP 用户名 |
| `password` | string | 否 | 用于身份验证的密码 \(如果未使用私钥\) |
| `privateKey` | string | 否 | 用于身份验证的私钥 \(OpenSSH 格式\) |
| `passphrase` | string | 否 | 加密私钥的密码短语 |
| `remotePath` | string | 是 | 要删除的文件或目录的路径 |
| `recursive` | boolean | 否 | 是否递归删除目录 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 删除是否成功 |
| `deletedPath` | string | 被删除的路径 |
| `message` | string | 操作状态消息 |

### `sftp_mkdir`

在远程 SFTP 服务器上创建一个目录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | SFTP 服务器主机名或 IP 地址 |
| `port` | number | 是 | SFTP 服务器端口 \(默认值: 22\) |
| `username` | string | 是 | SFTP 用户名 |
| `password` | string | 否 | 用于身份验证的密码 \(如果未使用私钥\) |
| `privateKey` | string | 否 | 用于身份验证的私钥 \(OpenSSH 格式\) |
| `passphrase` | string | 否 | 加密私钥的密码短语 |
| `remotePath` | string | 是 | 新目录的路径 |
| `recursive` | boolean | 否 | 如果父目录不存在，是否创建父目录 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 目录是否成功创建 |
| `createdPath` | string | 创建的目录路径 |
| `message` | string | 操作状态消息 |

## 注意事项

- 分类: `tools`
- 类型: `sftp`
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/sharepoint.mdx

```text
---
title: SharePoint
description: 处理页面和列表
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sharepoint"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration) 是 Microsoft 提供的一个协作平台，用户可以通过它构建和管理内部网站、共享文档以及组织团队资源。它为创建数字化工作空间和简化组织内的内容管理提供了强大而灵活的解决方案。

使用 SharePoint，您可以：

- **创建团队和沟通网站**：设置页面和门户以支持协作、公告和内容分发
- **组织和共享内容**：存储文档、管理文件，并通过安全的共享功能启用版本控制
- **自定义页面**：添加文本部分以根据团队需求定制每个网站
- **提高可发现性**：使用元数据、搜索和导航工具帮助用户快速找到所需内容
- **安全协作**：通过强大的权限设置和 Microsoft 365 集成控制访问

在 Sim 中，SharePoint 集成使您的代理能够在工作流程中创建和访问 SharePoint 网站和页面。这实现了文档管理自动化、知识共享和工作空间创建，无需手动操作。代理可以根据工作流程输入动态生成新的项目页面、上传或检索文件以及组织资源。通过将 Sim 与 SharePoint 连接，您可以将结构化协作和内容管理引入自动化流程中——让您的代理能够协调团队活动、呈现关键信息，并在整个组织中维护单一的真实信息来源。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 SharePoint 集成到工作流程中。读取/创建页面、列出站点，并处理列表（读取、创建、更新项目）。需要 OAuth。

## 工具

### `sharepoint_create_page`

在 SharePoint 站点中创建新页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 否 | SharePoint 站点的 ID（内部使用） |
| `siteSelector` | string | 否 | 选择 SharePoint 站点 |
| `pageName` | string | 是 | 要创建的页面名称 |
| `pageTitle` | string | 否 | 页面标题（如果未提供，则默认为页面名称） |
| `pageContent` | string | 否 | 页面内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `page` | object | 创建的 SharePoint 页面信息 |

### `sharepoint_read_page`

从 SharePoint 站点读取特定页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | 否 | 选择 SharePoint 站点 |
| `siteId` | string | 否 | SharePoint 站点的 ID（内部使用） |
| `pageId` | string | 否 | 要读取的页面 ID |
| `pageName` | string | 否 | 要读取的页面名称（pageId 的替代选项） |
| `maxPages` | number | 否 | 列出所有页面时返回的最大页面数（默认：10，最大值：50） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `page` | object | 有关 SharePoint 页面的信息 |

### `sharepoint_list_sites`

列出所有 SharePoint 网站的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | 否 | 选择 SharePoint 网站 |
| `groupId` | string | 否 | 用于访问组团队网站的组 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `site` | object | 有关当前 SharePoint 网站的信息 |

### `sharepoint_create_list`

在 SharePoint 站点中创建新列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 否 | SharePoint 站点的 ID（内部使用） |
| `siteSelector` | string | 否 | 选择 SharePoint 站点 |
| `listDisplayName` | string | 是 | 要创建的列表的显示名称 |
| `listDescription` | string | 否 | 列表的描述 |
| `listTemplate` | string | 否 | 列表模板名称（例如，'genericList'） |
| `pageContent` | string | 否 | 可选的列 JSON。可以是顶级的列定义数组，或者是包含 \{ columns: \[...\] \} 的对象。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `list` | object | 创建的 SharePoint 列表信息 |

### `sharepoint_get_list`

获取 SharePoint 列表的元数据（以及可选的列/项目）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | 否 | 选择 SharePoint 站点 |
| `siteId` | string | 否 | SharePoint 站点的 ID（内部使用） |
| `listId` | string | 否 | 要检索的列表 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `list` | object | SharePoint 列表的信息 |

### `sharepoint_update_list`

更新 SharePoint 列表项的属性（字段）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | 否 | 选择 SharePoint 站点 |
| `siteId` | string | 否 | SharePoint 站点的 ID（内部使用） |
| `listId` | string | 否 | 包含该项的列表的 ID |
| `itemId` | string | 是 | 要更新的列表项的 ID |
| `listItemFields` | object | 是 | 要更新到列表项的字段值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `item` | object | 更新后的 SharePoint 列表项 |

### `sharepoint_add_list_items`

向 SharePoint 列表添加新项

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | 否 | 选择 SharePoint 站点 |
| `siteId` | string | 否 | SharePoint 站点的 ID（内部使用） |
| `listId` | string | 是 | 要添加项的列表的 ID |
| `listItemFields` | object | 是 | 新列表项的字段值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `item` | object | 创建的 SharePoint 列表项 |

### `sharepoint_upload_file`

将文件上传到 SharePoint 文档库

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 否 | SharePoint 站点的 ID |
| `driveId` | string | 否 | 文档库（驱动器）的 ID。如果未提供，则使用默认驱动器。 |
| `folderPath` | string | 否 | 文档库中的可选文件夹路径（例如，/Documents/Subfolder） |
| `fileName` | string | 否 | 可选：覆盖上传文件的名称 |
| `files` | file[] | 否 | 要上传到 SharePoint 的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `uploadedFiles` | array | 上传文件对象的数组 |

## 注意事项

- 类别：`tools`
- 类型：`sharepoint`
```

--------------------------------------------------------------------------------

````

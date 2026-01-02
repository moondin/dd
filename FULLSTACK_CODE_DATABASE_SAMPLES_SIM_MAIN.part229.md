---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 229
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 229 of 933)

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

---[FILE: gmail.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/gmail.mdx

```text
---
title: Gmail
description: 发送、读取、搜索和移动 Gmail 邮件，或通过 Gmail 事件触发工作流
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gmail"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Gmail](https://gmail.com) 是 Google 的一项流行电子邮件服务，提供了一个强大的平台，用于发送、接收和管理电子邮件通信。Gmail 拥有超过 18 亿的全球活跃用户，提供了功能丰富的体验，包括强大的搜索功能、组织工具和集成选项。

使用 Gmail，您可以：

- **发送和接收电子邮件**：通过简洁直观的界面与联系人交流
- **组织邮件**：使用标签、文件夹和过滤器保持收件箱井井有条
- **高效搜索**：利用 Google 强大的搜索技术快速找到特定邮件
- **自动化工作流**：创建过滤器和规则以自动处理收到的邮件
- **随时随地访问**：通过设备同步的内容和设置使用 Gmail
- **与其他服务集成**：连接 Google 日历、云端硬盘和其他生产力工具

在 Sim 中，Gmail 集成使您的代理能够以编程方式全面管理电子邮件，并具备全面的自动化功能。这支持强大的自动化场景，例如发送通知、处理收到的邮件、从电子邮件中提取信息以及大规模管理通信工作流。您的代理可以：

- **撰写和发送**：创建带有附件的个性化电子邮件并发送给收件人
- **读取和搜索**：使用 Gmail 的查询语法查找特定邮件并提取内容
- **智能组织**：将邮件标记为已读/未读，存档或取消存档电子邮件，并管理标签
- **清理收件箱**：删除邮件，在标签之间移动电子邮件，并保持收件箱整洁
- **触发工作流**：实时监听新邮件，启用对收到邮件的响应式工作流

此集成弥合了您的 AI 工作流与电子邮件通信之间的差距，实现了与全球最广泛使用的通信平台之一的无缝交互。无论您是在自动化客户支持响应、处理收据、管理订阅，还是协调团队通信，Gmail 集成都提供了全面的电子邮件自动化所需的所有工具。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Gmail 集成到工作流中。可以发送、读取、搜索和移动电子邮件。可以在触发模式下使用，当收到新电子邮件时触发工作流。

## 工具

### `gmail_send`

使用 Gmail 发送电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `to` | 字符串 | 是 | 收件人邮箱地址 |
| `subject` | 字符串 | 否 | 邮件主题 |
| `body` | 字符串 | 是 | 邮件正文内容 |
| `contentType` | 字符串 | 否 | 邮件正文的内容类型（文本或 HTML） |
| `threadId` | 字符串 | 否 | 回复的线程 ID（用于线程化） |
| `replyToMessageId` | 字符串 | 否 | Gmail 消息 ID，用于回复 - 使用 Gmail 读取结果中的 "id" 字段（不是 RFC 的 "messageId"） |
| `cc` | 字符串 | 否 | 抄送收件人（逗号分隔） |
| `bcc` | 字符串 | 否 | 密送收件人（逗号分隔） |
| `attachments` | 文件[] | 否 | 附加到邮件的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_draft`

使用 Gmail 草拟电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `to` | 字符串 | 是 | 收件人邮箱地址 |
| `subject` | 字符串 | 否 | 邮件主题 |
| `body` | 字符串 | 是 | 邮件正文内容 |
| `contentType` | 字符串 | 否 | 邮件正文的内容类型（文本或 HTML） |
| `threadId` | 字符串 | 否 | 回复的线程 ID（用于线程化） |
| `replyToMessageId` | 字符串 | 否 | Gmail 消息 ID，用于回复 - 使用 Gmail 读取结果中的 "id" 字段（不是 RFC 的 "messageId"） |
| `cc` | 字符串 | 否 | 抄送收件人（逗号分隔） |
| `bcc` | 字符串 | 否 | 密送收件人（逗号分隔） |
| `attachments` | 文件[] | 否 | 附加到邮件草稿的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 草稿元数据 |

### `gmail_read`

从 Gmail 读取电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 否 | 要读取的消息 ID |
| `folder` | string | 否 | 要从中读取电子邮件的文件夹/标签 |
| `unreadOnly` | boolean | 否 | 仅检索未读消息 |
| `maxResults` | number | 否 | 要检索的最大消息数（默认：1，最大：10） |
| `includeAttachments` | boolean | 否 | 下载并包含电子邮件附件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | 字符串 | 邮件的文本内容 |
| `metadata` | JSON | 邮件的元数据 |
| `attachments` | 文件[] | 邮件的附件 |

### `gmail_search`

在 Gmail 中搜索邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | 邮件搜索查询 |
| `maxResults` | 数字 | 否 | 返回的最大结果数 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | 字符串 | 搜索结果摘要 |
| `metadata` | 对象 | 搜索元数据 |

### `gmail_move`

在 Gmail 标签/文件夹之间移动邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | 字符串 | 是 | 要移动的邮件 ID |
| `addLabelIds` | 字符串 | 是 | 要添加的逗号分隔标签 ID \(例如：INBOX, Label_123\) |
| `removeLabelIds` | 字符串 | 否 | 要移除的逗号分隔标签 ID \(例如：INBOX, SPAM\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | 字符串 | 成功消息 |
| `metadata` | 对象 | 邮件元数据 |

### `gmail_mark_read`

将 Gmail 邮件标记为已读

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | 字符串 | 是 | 要标记为已读的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_mark_unread`

将 Gmail 邮件标记为未读

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要标记为未读的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_archive`

归档 Gmail 邮件（从收件箱中移除）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要归档的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_unarchive`

取消归档 Gmail 邮件（移回收件箱）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要取消归档的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_delete`

删除 Gmail 邮件（移至垃圾箱）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要删除邮件的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_add_label`

为 Gmail 邮件添加标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要添加标签的邮件 ID |
| `labelIds` | string | 是 | 要添加的逗号分隔标签 ID（例如：INBOX, Label_123） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

### `gmail_remove_label`

从 Gmail 邮件中移除标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要移除标签的邮件 ID |
| `labelIds` | string | 是 | 要移除的逗号分隔标签 ID（例如：INBOX, Label_123） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 邮件元数据 |

## 注意事项

- 类别：`tools`
- 类型：`gmail`
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_calendar.mdx

```text
---
title: Google Calendar
description: 管理 Google Calendar 事件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_calendar"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Calendar](https://calendar.google.com) 是 Google 功能强大的日历和日程安排服务，提供了一个全面的平台来管理事件、会议和预约。通过与 Google 生态系统的无缝集成和广泛的用户群，Google Calendar 为个人和专业的日程安排需求提供了强大的功能。

使用 Google Calendar，您可以：

- **创建和管理事件**：安排会议、预约和提醒，并添加详细信息
- **发送日历邀请**：通过电子邮件邀请自动通知和协调与会者
- **自然语言事件创建**：使用对话式语言快速添加事件，例如“明天下午 3 点与 John 开会”
- **查看和搜索事件**：轻松查找和访问多个日历中的已安排事件
- **管理多个日历**：在不同的日历中组织不同类型的事件

在 Sim 中，Google Calendar 集成使您的代理能够以编程方式创建、读取和管理日历事件。这为强大的自动化场景提供了可能，例如安排会议、发送日历邀请、检查可用性和管理事件详细信息。您的代理可以使用自然语言输入创建事件，向与会者发送自动日历邀请，检索事件信息以及列出即将发生的事件。此集成弥合了您的 AI 工作流与日历管理之间的差距，实现了与全球最广泛使用的日历平台之一的无缝日程安排自动化和协调。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google 日历集成到工作流程中。可以创建、读取、更新和列出日历事件。需要 OAuth 授权。

## 工具

### `google_calendar_create`

在 Google 日历中创建新事件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | 否 | 日历 ID \(默认为主日历\) |
| `summary` | string | 是 | 活动标题/摘要 |
| `description` | string | 否 | 活动描述 |
| `location` | string | 否 | 活动地点 |
| `startDateTime` | string | 是 | 开始日期和时间。必须包含时区偏移 \(例如：2025-06-03T10:00:00-08:00\) 或提供 timeZone 参数 |
| `endDateTime` | string | 是 | 结束日期和时间。必须包含时区偏移 \(例如：2025-06-03T11:00:00-08:00\) 或提供 timeZone 参数 |
| `timeZone` | string | 否 | 时区 \(例如：America/Los_Angeles\)。如果日期时间未包含偏移，则必需提供。如果未提供，默认为 America/Los_Angeles。 |
| `attendees` | array | 否 | 参与者电子邮件地址数组 |
| `sendUpdates` | string | 否 | 如何向参与者发送更新：all、externalOnly 或 none |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 事件创建确认消息 |
| `metadata` | json | 创建的事件元数据，包括 ID、状态和详细信息 |

### `google_calendar_list`

列出 Google 日历中的事件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | 否 | 日历 ID（默认为主日历） |
| `timeMin` | string | 否 | 事件的下限（RFC3339 时间戳，例如：2025-06-03T00:00:00Z） |
| `timeMax` | string | 否 | 事件的上限（RFC3339 时间戳，例如：2025-06-04T00:00:00Z） |
| `orderBy` | string | 否 | 返回事件的排序方式（startTime 或 updated） |
| `showDeleted` | boolean | 否 | 是否包含已删除的事件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 找到的事件数量摘要 |
| `metadata` | json | 包含分页令牌和事件详情的事件列表 |

### `google_calendar_get`

从 Google 日历获取特定事件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | 否 | 日历 ID \(默认为主日历\) |
| `eventId` | string | 是 | 要检索的事件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 事件检索确认消息 |
| `metadata` | json | 包括 ID、状态、时间和参与者的事件详情 |

### `google_calendar_quick_add`

从自然语言文本创建事件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | 否 | 日历 ID \(默认为主日历\) |
| `text` | string | 是 | 描述事件的自然语言文本 \(例如："明天下午 3 点与 John 开会"\) |
| `attendees` | array | 否 | 参与者电子邮件地址数组 \(也接受逗号分隔的字符串\) |
| `sendUpdates` | string | 否 | 如何向参与者发送更新：all、externalOnly 或 none |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 自然语言事件创建确认消息 |
| `metadata` | json | 包括解析详情的已创建事件元数据 |

### `google_calendar_invite`

邀请与会者加入现有的 Google 日历活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | 否 | 日历 ID（默认为主日历） |
| `eventId` | string | 是 | 要邀请与会者的活动 ID |
| `attendees` | array | 是 | 要邀请的与会者电子邮件地址数组 |
| `sendUpdates` | string | 否 | 如何向与会者发送更新：all、externalOnly 或 none |
| `replaceExisting` | boolean | 否 | 是替换现有与会者还是添加新与会者（默认为 false） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 与会者邀请确认消息及电子邮件发送状态 |
| `metadata` | json | 更新的活动元数据，包括与会者列表和详细信息 |

## 注意事项

- 类别：`tools`
- 类型：`google_calendar`
```

--------------------------------------------------------------------------------

---[FILE: google_docs.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_docs.mdx

```text
---
title: Google Docs
description: 阅读、编写和创建文档
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_docs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Docs](https://docs.google.com) 是一个功能强大的基于云的文档创建和编辑服务，允许用户实时创建、编辑和协作处理文档。作为 Google 办公套件的一部分，Google Docs 提供了一个多功能的平台，用于文本文档的格式化、评论和共享功能。

了解如何在 Sim 中集成 Google Docs 的“读取”工具，轻松从文档中获取数据并将其集成到您的工作流程中。本教程将引导您连接 Google Docs、设置数据读取，并使用这些信息实时自动化流程。非常适合与您的代理同步实时数据。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/f41gy9rBHhE"
  title="在 Sim 中使用 Google Docs 读取工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

了解如何在 Sim 中集成 Google Docs 的“更新”工具，通过您的工作流程轻松向文档添加内容。本教程将引导您连接 Google Docs、配置数据写入，并使用这些信息无缝自动更新文档。非常适合以最小的努力维护动态的实时文档。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/L64ROHS2ivA"
  title="在 Sim 中使用 Google Docs 更新工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

了解如何在 Sim 中集成 Google Docs 的“创建”工具，通过您的工作流程轻松生成新文档。本教程将引导您连接 Google Docs、设置文档创建，并使用工作流程数据自动填充内容。非常适合简化文档生成并提高生产力。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/lWpHH4qddWk"
  title="在 Sim 中使用 Google Docs 创建工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

使用 Google Docs，您可以：

- **创建和编辑文档**：使用全面的格式选项开发文本文档
- **实时协作**：与多位用户同时在同一文档上工作
- **跟踪更改**：查看修订历史并恢复以前的版本
- **评论和建议**：提供反馈并提出编辑建议，而不更改原始内容
- **随时随地访问**：通过设备使用 Google Docs，并自动同步到云端
- **离线工作**：在没有互联网连接的情况下继续工作，重新联网时同步更改
- **与其他服务集成**：连接 Google Drive、Sheets、Slides 和第三方应用程序

在 Sim 中，Google Docs 集成使您的代理可以以编程方式直接与文档内容交互。这支持强大的自动化场景，例如文档创建、内容提取、协作编辑和文档管理。您的代理可以读取现有文档以提取信息，写入文档以更新内容，并从头创建新文档。此集成弥合了您的 AI 工作流与文档管理之间的差距，使您能够无缝地与世界上最广泛使用的文档平台之一进行交互。通过将 Sim 与 Google Docs 连接，您可以自动化文档工作流、生成报告、从文档中提取见解并维护文档——所有这些都通过您的智能代理完成。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google Docs 集成到工作流程中。可以读取、编辑和创建文档。需要 OAuth 授权。

## 工具

### `google_docs_read`

从 Google Docs 文档中读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | 是 | 要读取的文档 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 提取的文档文本内容 |
| `metadata` | json | 包括 ID、标题和 URL 的文档元数据 |

### `google_docs_write`

在 Google Docs 文档中写入或更新内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | 是 | 要写入的文档 ID |
| `content` | string | 是 | 要写入文档的内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | 表示文档内容是否成功更新 |
| `metadata` | json | 更新后的文档元数据，包括 ID、标题和 URL |

### `google_docs_create`

创建一个新的 Google Docs 文档

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | string | 是 | 要创建的文档标题 |
| `content` | string | 否 | 要创建的文档内容 |
| `folderSelector` | string | 否 | 选择创建文档的文件夹 |
| `folderId` | string | 否 | 创建文档的文件夹 ID（内部使用） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `metadata` | json | 创建的文档元数据，包括 ID、标题和 URL |

## 注意事项

- 类别：`tools`
- 类型：`google_docs`
```

--------------------------------------------------------------------------------

---[FILE: google_drive.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_drive.mdx

```text
---
title: Google Drive
description: 创建、上传和列出文件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_drive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Drive](https://drive.google.com) 是 Google 的云存储和文件同步服务，允许用户存储文件、在设备之间同步文件，并与他人共享文件。作为 Google 生产力生态系统的核心组件，Google Drive 提供了强大的存储、组织和协作功能。

了解如何在 Sim 中集成 Google Drive 工具，通过工作流轻松从您的 Drive 中提取信息。本教程将指导您连接 Google Drive、设置数据检索以及使用存储的文档和文件来增强自动化功能。非常适合实时与您的代理同步重要数据。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cRoRr4b-EAs"
  title="在 Sim 中使用 Google Drive 工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

使用 Google Drive，您可以：

- **在云端存储文件**：上传文件并通过互联网随时随地访问
- **组织内容**：创建文件夹、使用颜色编码并实施命名约定
- **共享与协作**：控制访问权限并同时处理文件
- **高效搜索**：利用 Google 强大的搜索技术快速找到文件
- **跨设备访问**：在桌面、移动设备和网页平台上使用 Google Drive
- **与其他服务集成**：连接 Google Docs、Sheets、Slides 和第三方应用程序

在 Sim 中，Google Drive 集成使您的代理可以以编程方式直接与云存储交互。这支持强大的自动化场景，例如文件管理、内容组织和文档工作流。您的代理可以将新文件上传到特定文件夹，下载现有文件以处理其内容，并列出文件夹内容以导航存储结构。此集成弥合了 AI 工作流与文档管理系统之间的差距，实现了无人工干预的无缝文件操作。通过将 Sim 与 Google Drive 连接，您可以自动化基于文件的工作流、智能管理文档，并将云存储操作集成到代理的功能中。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google Drive 集成到工作流程中。可以创建、上传和列出文件。需要 OAuth。

## 工具

### `google_drive_upload`

上传文件到 Google Drive

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | 是 | 要上传文件的名称 |
| `file` | file | 否 | 要上传的二进制文件 \(UserFile 对象\) |
| `content` | string | 否 | 要上传的文本内容 \(使用此项或 file，不可同时使用\) |
| `mimeType` | string | 否 | 要上传文件的 MIME 类型 \(如果未提供，将从文件中自动检测\) |
| `folderSelector` | string | 否 | 选择要上传文件的文件夹 |
| `folderId` | string | 否 | 要上传文件的文件夹 ID \(内部使用\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | json | 上传文件的元数据，包括 ID、名称和链接 |

### `google_drive_create_folder`

在 Google Drive 中创建一个新文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | 是 | 要创建的文件夹名称 |
| `folderSelector` | string | 否 | 选择要在其中创建文件夹的父文件夹 |
| `folderId` | string | 否 | 父文件夹的 ID（内部使用） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | json | 创建的文件夹元数据，包括 ID、名称和父文件夹信息 |

### `google_drive_download`

从 Google Drive 下载文件（自动导出 Google Workspace 文件）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | 是 | 要下载的文件 ID |
| `mimeType` | string | 否 | 导出 Google Workspace 文件的 MIME 类型（可选） |
| `fileName` | string | 否 | 可选的文件名覆盖 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | file | 下载的文件存储在执行文件中 |

### `google_drive_list`

列出 Google Drive 中的文件和文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | 否 | 选择要列出文件的文件夹 |
| `folderId` | string | 否 | 要列出文件的文件夹 ID（内部使用） |
| `query` | string | 否 | 用于按名称过滤文件的搜索词（例如，"budget" 会找到名称中包含 "budget" 的文件）。不要在此处使用 Google Drive 查询语法 - 只需提供一个普通的搜索词即可。 |
| `pageSize` | number | 否 | 要返回的最大文件数（默认值：100） |
| `pageToken` | string | 否 | 用于分页的页面令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `files` | json | 指定文件夹中文件元数据对象的数组 |

## 注意事项

- 类别：`tools`
- 类型：`google_drive`
```

--------------------------------------------------------------------------------

---[FILE: google_forms.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_forms.mdx

```text
---
title: Google Forms
description: 查看 Google 表单的回复
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_forms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Forms](https://forms.google.com) 是 Google 的在线调查和表单工具，允许用户创建表单、收集回复并分析结果。作为 Google 办公套件的一部分，Google Forms 使用户能够轻松收集信息、反馈和数据。

了解如何在 Sim 中集成 Google Forms 工具，以自动读取和处理表单回复。本教程将指导您连接 Google Forms、检索回复，并使用收集到的数据来驱动自动化。非常适合实时同步调查结果、注册信息或反馈给您的代理。

使用 Google Forms，您可以：

- **创建调查和表单**：设计用于反馈、注册、测验等的自定义表单
- **自动收集回复**：实时收集用户数据
- **分析结果**：在 Google Forms 中查看回复或导出到 Google Sheets 进行进一步分析
- **轻松协作**：共享表单，与他人一起构建和审查问题
- **与其他 Google 服务集成**：连接 Google Sheets、Drive 等

在 Sim 中，Google Forms 集成使您的代理可以以编程方式访问表单响应。这为强大的自动化场景提供了可能，例如处理调查数据、根据新提交触发工作流以及将表单结果与其他工具同步。您的代理可以获取表单的所有响应、检索特定响应，并使用这些数据推动智能自动化。通过将 Sim 与 Google Forms 连接，您可以实现数据收集自动化、简化反馈处理，并将表单响应整合到代理的功能中。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google Forms 集成到您的工作流中。提供表单 ID 以列出响应，或指定响应 ID 以获取单个响应。需要 OAuth。

## 工具

### `google_forms_get_responses`

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| formId | string | 是 | Google 表单的 ID |
| responseId | string | 否 | 如果提供，将返回此特定响应 |
| pageSize | number | 否 | 要返回的最大响应数（服务可能返回更少）。默认为 5000 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | json | 响应或响应列表 |

## 注意事项

- 类别：`tools`
- 类型：`google_forms`
```

--------------------------------------------------------------------------------

---[FILE: google_groups.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_groups.mdx

```text
---
title: Google 群组
description: 管理 Google Workspace 群组及其成员
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_groups"
  color="#E8F0FE"
/>

## 使用说明

连接到 Google Workspace，使用 Admin SDK Directory API 创建、更新和管理群组及其成员。

## 工具

### `google_groups_list_groups`

列出 Google Workspace 域中的所有群组

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `customer` | string | 否 | 客户 ID 或 "my_customer" 表示已认证用户的域 |
| `domain` | string | 否 | 用于筛选群组的域名 |
| `maxResults` | number | 否 | 返回的最大结果数 \(1-200\) |
| `pageToken` | string | 否 | 分页的令牌 |
| `query` | string | 否 | 用于筛选群组的搜索查询 \(例如："email:admin*"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `groups` | json | 群组对象的数组 |
| `nextPageToken` | string | 用于获取下一页结果的令牌 |

### `google_groups_get_group`

通过电子邮件或群组 ID 获取特定 Google 群组的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组电子邮件地址或唯一群组 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `group` | json | 群组对象 |

### `google_groups_create_group`

在域中创建一个新的 Google 群组

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 新组的电子邮件地址 \(例如：team@yourdomain.com\) |
| `name` | string | 是 | 组的显示名称 |
| `description` | string | 否 | 组的描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `group` | json | 创建的群组对象 |

### `google_groups_update_group`

更新现有的 Google 群组

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `name` | string | 否 | 群组的新显示名称 |
| `description` | string | 否 | 群组的新描述 |
| `email` | string | 否 | 群组的新电子邮件地址 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `group` | json | 更新的群组对象 |

### `google_groups_delete_group`

删除 Google 群组

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 要删除的群组电子邮件地址或唯一群组 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `google_groups_list_members`

列出 Google 群组的所有成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `maxResults` | number | 否 | 返回的最大结果数 \(1-200\) |
| `pageToken` | string | 否 | 分页的令牌 |
| `roles` | string | 否 | 按角色筛选 \(逗号分隔：OWNER, MANAGER, MEMBER\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `members` | json | 成员对象的数组 |
| `nextPageToken` | string | 用于获取下一页结果的令牌 |

### `google_groups_get_member`

获取 Google 群组中特定成员的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `memberKey` | string | 是 | 成员的电子邮件地址或唯一成员 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `member` | json | 成员对象 |

### `google_groups_add_member`

向 Google 群组添加新成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `email` | string | 是 | 要添加成员的电子邮件地址 |
| `role` | string | 否 | 成员的角色 \(MEMBER, MANAGER, 或 OWNER\)。默认为 MEMBER。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `member` | json | 添加的成员对象 |

### `google_groups_remove_member`

从 Google 群组中移除成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `memberKey` | string | 是 | 要移除的成员的电子邮件地址或唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `google_groups_update_member`

更新成员信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `memberKey` | string | 是 | 成员的电子邮件地址或唯一成员 ID |
| `role` | string | 是 | 成员的新角色 \(MEMBER, MANAGER, 或 OWNER\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `member` | json | 更新的成员对象 |

### `google_groups_has_member`

检查用户是否为 Google 群组的成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | 是 | 群组的电子邮件地址或唯一群组 ID |
| `memberKey` | string | 是 | 要检查的成员的电子邮件地址或唯一成员 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `isMember` | boolean | 用户是否是该群组的成员 |

## 注意事项

- 类别：`tools`
- 类型：`google_groups`
```

--------------------------------------------------------------------------------

---[FILE: google_search.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_search.mdx

```text
---
title: Google 搜索
description: 搜索网络
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_search"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google 搜索](https://www.google.com) 是全球使用最广泛的搜索引擎，提供对数十亿网页和信息来源的访问。Google 搜索使用复杂的算法，根据用户查询提供相关的搜索结果，使其成为在互联网上查找信息的重要工具。

了解如何在 Sim 中集成 Google 搜索工具，通过您的工作流轻松获取实时搜索结果。本教程将指导您连接 Google 搜索、配置搜索查询，并使用实时数据增强自动化功能。非常适合为您的代理提供最新信息和更智能的决策能力。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/1B7hV9b5UMQ"
  title="在 Sim 中使用 Google 搜索工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

使用 Google 搜索，您可以：

- **查找相关信息**：通过 Google 强大的搜索算法访问数十亿网页
- **获取特定结果**：使用搜索运算符优化和定位您的查询
- **发现多样化内容**：查找文本、图片、视频、新闻和其他内容类型
- **访问知识图谱**：获取关于人物、地点和事物的结构化信息
- **利用搜索功能**：使用计算器、单位转换器等专业搜索工具

在 Sim 中，Google 搜索集成使您的代理能够以编程方式搜索网络并将搜索结果纳入其工作流。这为强大的自动化场景提供了可能，例如研究、事实核查、数据收集和信息综合。您的代理可以制定搜索查询、检索相关结果，并从这些结果中提取信息以做出决策或生成见解。此集成弥合了您的 AI 工作流与网络上广泛信息之间的差距，使您的代理能够访问来自互联网的最新信息。通过将 Sim 与 Google 搜索连接，您可以创建能够随时掌握最新信息、验证事实、进行研究并为用户提供相关网络内容的代理——这一切都无需离开您的工作流。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google 搜索集成到工作流程中。可以搜索网页。需要 API 密钥。

## 工具

### `google_search`

使用自定义搜索 API 搜索网络

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | 要执行的搜索查询 |
| `searchEngineId` | 字符串 | 是 | 自定义搜索引擎 ID |
| `num` | 字符串 | 否 | 返回结果的数量 \(默认值: 10，最大值: 10\) |
| `apiKey` | 字符串 | 是 | Google API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | 数组 | 来自 Google 的搜索结果数组 |

## 注意

- 类别: `tools`
- 类型: `google_search`
```

--------------------------------------------------------------------------------

---[FILE: google_sheets.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_sheets.mdx

```text
---
title: Google Sheets
description: 读取、写入和更新数据
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_sheets"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Sheets](https://sheets.google.com) 是一款功能强大的云端电子表格应用程序，允许用户实时创建、编辑和协作处理电子表格。作为 Google 办公套件的一部分，Google Sheets 提供了一个多功能平台，用于数据组织、分析和可视化，具有强大的格式化、公式和共享功能。

了解如何在 Sim 中集成 Google Sheets 的“读取”工具，从您的电子表格中轻松提取数据并将其集成到您的工作流中。本教程将指导您连接 Google Sheets、设置数据读取以及使用这些信息实时自动化流程。非常适合与您的代理同步实时数据。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/xxP7MZRuq_0"
  title="在 Sim 中使用 Google Sheets 读取工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

了解如何在 Sim 中使用 Google Sheets 的“写入”工具，将数据从您的工作流自动发送到 Google Sheets。本教程涵盖了集成设置、配置写入操作以及在工作流执行时无缝更新电子表格。非常适合在无需手动输入的情况下维护实时记录。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cO86qTj7qeY"
  title="在 Sim 中使用 Google Sheets 写入工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

探索如何利用 Sim 中的 Google Sheets“更新”工具，根据工作流执行修改电子表格中的现有条目。本教程演示了设置更新逻辑、映射数据字段以及即时同步更改的方法。非常适合保持数据的最新和一致性。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/95by2fL9yn4"
  title="在 Sim 中使用 Google Sheets 更新工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

了解如何在 Sim 中使用 Google Sheets 的“追加”工具，在工作流执行期间轻松向电子表格添加新行数据。本教程将引导您完成集成设置、配置追加操作以及确保数据顺利增长的过程。非常适合无需手动操作即可扩展记录！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/8DgNvLBCsAo"
  title="在 Sim 中使用 Google Sheets 追加工具"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

使用 Google Sheets，您可以：

- **创建和编辑电子表格**：开发具有全面格式和计算选项的数据驱动文档
- **实时协作**：与多位用户同时在同一电子表格上工作
- **分析数据**：使用公式、函数和数据透视表处理和理解数据
- **可视化信息**：创建图表、图形和条件格式以直观地表示数据
- **随时随地访问**：通过自动云同步在各种设备上使用 Google Sheets
- **离线工作**：在没有互联网连接的情况下继续工作，重新联网时同步更改
- **与其他服务集成**：连接 Google Drive、Forms 和第三方应用程序

在 Sim 中，Google Sheets 集成使您的代理能够以编程方式直接与电子表格数据交互。这支持强大的自动化场景，例如数据提取、分析、报告和管理。您的代理可以读取现有电子表格以提取信息，写入电子表格以更新数据，并从头创建新电子表格。此集成弥合了您的 AI 工作流与数据管理之间的差距，实现了与结构化数据的无缝交互。通过将 Sim 与 Google Sheets 连接，您可以自动化数据工作流、生成报告、从数据中提取洞察并维护最新信息——所有这些都通过您的智能代理完成。该集成支持多种数据格式和范围规范，使其足够灵活以处理多样化的数据管理需求，同时保持 Google Sheets 的协作性和可访问性。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google Sheets 集成到工作流程中。可以读取、写入、追加和更新数据。需要 OAuth 授权。

## 工具

### `google_sheets_read`

从 Google Sheets 电子表格中读取数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 电子表格的 ID \(可在 URL 中找到：docs.google.com/spreadsheets/d/\{SPREADSHEET_ID\}/edit\)。 |
| `range` | string | 否 | 要读取的 A1 表示法范围 \(例如 "Sheet1!A1:D10", "A1:B5"\)。如果未指定，默认为第一个工作表 A1:Z1000。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | json | 包括范围和单元格值的表格数据 |
| `metadata` | json | 包括 ID 和 URL 的电子表格元数据 |

### `google_sheets_write`

向 Google Sheets 电子表格写入数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 电子表格的 ID |
| `range` | string | 否 | 要写入的 A1 表示法范围 \(例如 "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | 是 | 要写入的数据，格式为二维数组 \(例如 \[\["Name", "Age"\], \["Alice", 30\], \["Bob", 25\]\]\) 或对象数组。 |
| `valueInputOption` | string | 否 | 要写入数据的格式 |
| `includeValuesInResponse` | boolean | 否 | 是否在响应中包含写入的值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updatedRange` | string | 更新的单元格范围 |
| `updatedRows` | number | 更新的行数 |
| `updatedColumns` | number | 更新的列数 |
| `updatedCells` | number | 更新的单元格数 |
| `metadata` | json | 包含 ID 和 URL 的电子表格元数据 |

### `google_sheets_update`

更新 Google Sheets 电子表格中的数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 要更新的电子表格的 ID |
| `range` | string | 否 | 要更新的 A1 表示法范围 \(例如 "Sheet1!A1:D10", "A1:B5"\) |
| `values` | array | 是 | 要更新的数据，格式为二维数组 \(例如 \[\["Name", "Age"\], \["Alice", 30\]\]\) 或对象数组。 |
| `valueInputOption` | string | 否 | 要更新数据的格式 |
| `includeValuesInResponse` | boolean | 否 | 是否在响应中包含更新的值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updatedRange` | string | 更新的单元格范围 |
| `updatedRows` | number | 更新的行数 |
| `updatedColumns` | number | 更新的列数 |
| `updatedCells` | number | 更新的单元格数 |
| `metadata` | json | 包含 ID 和 URL 的电子表格元数据 |

### `google_sheets_append`

将数据追加到 Google Sheets 电子表格的末尾

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 要追加数据的电子表格的 ID |
| `range` | string | 否 | 要追加数据的单元格范围 \(例如："Sheet1", "Sheet1!A:D"\) |
| `values` | array | 是 | 要追加的数据，格式为二维数组 \(例如：\[\["Alice", 30\], \["Bob", 25\]\]\) 或对象数组。 |
| `valueInputOption` | string | 否 | 要追加数据的格式 |
| `insertDataOption` | string | 否 | 数据插入方式 \(OVERWRITE 或 INSERT_ROWS\) |
| `includeValuesInResponse` | boolean | 否 | 是否在响应中包含追加后的值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tableRange` | string | 数据追加的表格范围 |
| `updatedRange` | string | 更新的单元格范围 |
| `updatedRows` | number | 更新的行数 |
| `updatedColumns` | number | 更新的列数 |
| `updatedCells` | number | 更新的单元格数 |
| `metadata` | json | 包括 ID 和 URL 的电子表格元数据 |

## 注意事项

- 类别: `tools`
- 类型: `google_sheets`
```

--------------------------------------------------------------------------------

---[FILE: google_slides.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_slides.mdx

```text
---
title: Google Slides
description: 阅读、编写和创建演示文稿
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_slides"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Slides](https://slides.google.com) 是一个动态的基于云的演示文稿应用程序，允许用户实时创建、编辑、协作和展示幻灯片。作为 Google 生产力套件的一部分，Google Slides 提供了一个灵活的平台，用于设计引人入胜的演示文稿，与他人协作，并通过云无缝共享内容。

了解如何在 Sim 中集成 Google Slides 工具，以轻松管理作为自动化工作流程一部分的演示文稿。通过 Sim，您可以直接通过代理和自动化流程读取、编写、创建和更新 Google Slides 演示文稿，从而轻松传递最新信息、生成自定义报告或以编程方式制作品牌幻灯片。

使用 Google Slides，您可以：

- **创建和编辑演示文稿**：使用主题、布局和多媒体内容设计视觉吸引力的幻灯片
- **实时协作**：与团队成员同时工作，评论、分配任务并实时接收演示文稿的反馈
- **随时随地展示**：在线或离线展示演示文稿，分享链接或发布到网络
- **添加图片和丰富内容**：插入图片、图形、图表和视频，使您的演示文稿更具吸引力
- **与其他服务集成**：与 Google Drive、Docs、Sheets 和其他第三方工具无缝连接
- **从任何设备访问**：在台式机、笔记本电脑、平板电脑和移动设备上使用 Google Slides，最大限度地提高灵活性

在 Sim 中，Google Slides 集成使您的代理能够以编程方式直接与演示文稿文件交互。自动化任务如读取幻灯片内容、插入新幻灯片或图片、替换整个幻灯片中的文本、生成新演示文稿以及检索幻灯片缩略图。这使您能够扩展内容创建，保持演示文稿的最新状态，并将其嵌入到自动化文档工作流程中。通过将 Sim 与 Google Slides 连接，您可以实现 AI 驱动的演示文稿管理——轻松生成、更新或从演示文稿中提取信息，而无需手动操作。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Google 幻灯片集成到工作流程中。可以读取、写入、创建演示文稿，替换文本，添加幻灯片，添加图片，以及获取缩略图。

## 工具

### `google_slides_read`

从 Google 幻灯片演示文稿中读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | 是 | 要读取的演示文稿的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `slides` | json | 包含内容的幻灯片数组 |
| `metadata` | json | 包括 ID、标题和 URL 的演示文稿元数据 |

### `google_slides_write`

在 Google 幻灯片演示文稿中写入或更新内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | 是 | 要写入的演示文稿的 ID |
| `content` | string | 是 | 要写入幻灯片的内容 |
| `slideIndex` | number | 否 | 要写入的幻灯片索引 \(默认为第一张幻灯片\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | 表示演示文稿内容是否成功更新 |
| `metadata` | json | 更新后的演示文稿元数据，包括 ID、标题和 URL |

### `google_slides_create`

创建一个新的 Google 幻灯片演示文稿

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | string | 是 | 要创建的演示文稿的标题 |
| `content` | string | 否 | 要添加到第一张幻灯片的内容 |
| `folderSelector` | string | 否 | 选择创建演示文稿的文件夹 |
| `folderId` | string | 否 | 用于创建演示文稿的文件夹 ID \(内部使用\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `metadata` | json | 创建的演示文稿元数据，包括 ID、标题和 URL |

### `google_slides_replace_all_text`

在 Google 幻灯片演示文稿中查找并替换所有文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | 是 | 演示文稿的 ID |
| `findText` | string | 是 | 要查找的文本 \(例如，\{\{placeholder\}\}\) |
| `replaceText` | string | 是 | 要替换的文本 |
| `matchCase` | boolean | 否 | 是否区分大小写 \(默认值：true\) |
| `pageObjectIds` | string | 否 | 用逗号分隔的幻灯片对象 ID 列表，用于限制替换到特定幻灯片 \(留空表示所有幻灯片\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `occurrencesChanged` | number | 替换的文本出现次数 |
| `metadata` | json | 操作元数据，包括演示文稿 ID 和 URL |

### `google_slides_add_slide`

向 Google 幻灯片演示文稿添加具有指定布局的新幻灯片

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | 是 | 演示文稿的 ID |
| `layout` | string | 否 | 幻灯片的预定义布局 \(BLANK, TITLE, TITLE_AND_BODY, TITLE_ONLY, SECTION_HEADER 等\)。默认为 BLANK。 |
| `insertionIndex` | number | 否 | 可选的从零开始的索引，指示插入幻灯片的位置。如果未指定，则幻灯片添加到末尾。 |
| `placeholderIdMappings` | string | 否 | JSON 数组的占位符映射，用于为占位符分配自定义对象 ID。格式：\[\{"layoutPlaceholder":\{"type":"TITLE"\},"objectId":"custom_title_id"\}\] |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `slideId` | string | 新创建幻灯片的对象 ID |
| `metadata` | json | 操作元数据，包括演示文稿 ID、布局和 URL |

### `google_slides_add_image`

在 Google 幻灯片演示文稿中的特定幻灯片中插入图片

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | 是 | 演示文稿的 ID |
| `pageObjectId` | string | 是 | 要添加图片的幻灯片/页面的对象 ID |
| `imageUrl` | string | 是 | 图片的公开可访问 URL（必须是 PNG、JPEG 或 GIF，最大 50MB） |
| `width` | number | 否 | 图片的宽度（单位：点，默认值：300） |
| `height` | number | 否 | 图片的高度（单位：点，默认值：200） |
| `positionX` | number | 否 | 距离左边缘的 X 位置（单位：点，默认值：100） |
| `positionY` | number | 否 | 距离顶部边缘的 Y 位置（单位：点，默认值：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `imageId` | string | 新创建图片的对象 ID |
| `metadata` | json | 操作元数据，包括演示文稿 ID 和图片 URL |

### `google_slides_get_thumbnail`

生成 Google 幻灯片演示文稿中特定幻灯片的缩略图

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | 是 | 演示文稿的 ID |
| `pageObjectId` | string | 是 | 要获取缩略图的幻灯片/页面的对象 ID |
| `thumbnailSize` | string | 否 | 缩略图的大小：SMALL（200px）、MEDIUM（800px）或 LARGE（1600px）。默认为 MEDIUM。 |
| `mimeType` | string | 否 | 缩略图图像的 MIME 类型：PNG 或 GIF。默认为 PNG。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contentUrl` | string | 缩略图图像的 URL（有效期为 30 分钟） |
| `width` | number | 缩略图的宽度（以像素为单位） |
| `height` | number | 缩略图的高度（以像素为单位） |
| `metadata` | json | 操作元数据，包括演示文稿 ID 和页面对象 ID |

## 注意

- 类别：`tools`
- 类型：`google_slides`
```

--------------------------------------------------------------------------------

---[FILE: google_vault.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/google_vault.mdx

```text
---
title: Google Vault
description: 搜索、导出和管理 Vault 事项的保留/导出
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_vault"
  color="#E8F0FE"
/>

## 使用说明

连接 Google Vault 以创建导出、列出导出并管理事项中的保留。

## 工具

### `google_vault_create_matters_export`

创建导出事项

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `matterId` | 字符串 | 是 | 无描述 |
| `exportName` | 字符串 | 是 | 无描述 |
| `corpus` | 字符串 | 是 | 要导出的数据集 \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | 字符串 | 否 | 用于限定导出的以逗号分隔的用户邮箱列表 |
| `orgUnitId` | 字符串 | 否 | 用于限定导出的组织单位 ID \(邮箱的替代选项\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `export` | json | 创建的导出对象 |

### `google_vault_list_matters_export`

列出事项的导出

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `matterId` | 字符串 | 是 | 无描述 |
| `pageSize` | 数字 | 否 | 无描述 |
| `pageToken` | 字符串 | 否 | 无描述 |
| `exportId` | 字符串 | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `exports` | json | 导出对象的数组 |
| `export` | json | 单个导出对象（当提供 exportId 时） |
| `nextPageToken` | string | 用于获取下一页结果的令牌 |

### `google_vault_download_export_file`

从 Google Vault 导出中下载单个文件（GCS 对象）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `matterId` | 字符串 | 是 | 无描述 |
| `bucketName` | 字符串 | 是 | 无描述 |
| `objectName` | 字符串 | 是 | 无描述 |
| `fileName` | 字符串 | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | 文件 | 下载的 Vault 导出文件存储在执行文件中 |

### `google_vault_create_matters_holds`

在案件中创建保留

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `matterId` | 字符串 | 是 | 无描述 |
| `holdName` | 字符串 | 是 | 无描述 |
| `corpus` | 字符串 | 是 | 要保留的数据集 \(MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE\) |
| `accountEmails` | 字符串 | 否 | 要保留的用户电子邮件的逗号分隔列表 |
| `orgUnitId` | 字符串 | 否 | 要保留的组织单位 ID \(账户的替代选项\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `hold` | json | 创建的保留对象 |

### `google_vault_list_matters_holds`

列出案件的保留

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `matterId` | 字符串 | 是 | 无描述 |
| `pageSize` | 数字 | 否 | 无描述 |
| `pageToken` | 字符串 | 否 | 无描述 |
| `holdId` | 字符串 | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `holds` | json | 保留对象的数组 |
| `hold` | json | 单个保留对象（当提供 holdId 时） |
| `nextPageToken` | string | 用于获取下一页结果的令牌 |

### `google_vault_create_matters`

在 Google Vault 中创建一个新事项

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `name` | string | 是 | 无描述 |
| `description` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `matter` | json | 创建的事项对象 |

### `google_vault_list_matters`

列出事项，或在提供 matterId 的情况下获取特定事项

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | 否 | 无描述 |
| `pageToken` | string | 否 | 无描述 |
| `matterId` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `matters` | json | 事项对象的数组 |
| `matter` | json | 单个事项对象（当提供 matterId 时） |
| `nextPageToken` | string | 用于获取下一页结果的令牌 |

## 注意事项

- 类别: `tools`
- 类型: `google_vault`
```

--------------------------------------------------------------------------------

````

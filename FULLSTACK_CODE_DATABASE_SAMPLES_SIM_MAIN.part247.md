---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 247
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 247 of 933)

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

---[FILE: zep.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/zep.mdx

```text
---
title: Zep
description: 为 AI 代理提供长期记忆
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zep"
  color="#E8E8E8"
/>

## 使用说明

集成 Zep 以管理长期记忆。创建线程、添加消息、通过 AI 驱动的摘要和事实提取功能检索上下文。

## 工具

### `zep_create_thread`

在 Zep 中开始一个新的对话线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | 是 | 线程的唯一标识符 |
| `userId` | string | 是 | 与线程关联的用户 ID |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `threadId` | string | 线程 ID |
| `userId` | string | 用户 ID |
| `uuid` | string | 内部 UUID |
| `createdAt` | string | 创建时间戳 |
| `projectUuid` | string | 项目 UUID |

### `zep_get_threads`

列出所有对话线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | 否 | 每页检索的线程数量 |
| `pageNumber` | number | 否 | 分页的页码 |
| `orderBy` | string | 否 | 用于排序结果的字段 \(created_at, updated_at, user_id, thread_id\) |
| `asc` | boolean | 否 | 排序方向：true 表示升序，false 表示降序 |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `threads` | 数组 | 线程对象的数组 |
| `responseCount` | 数字 | 此响应中的线程数量 |
| `totalCount` | 数字 | 可用线程的总数 |

### `zep_delete_thread`

从 Zep 中删除会话线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `threadId` | 字符串 | 是 | 要删除的线程 ID |
| `apiKey` | 字符串 | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | 布尔值 | 线程是否已被删除 |

### `zep_get_context`

从线程中检索用户上下文，支持摘要模式或基本模式

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `threadId` | 字符串 | 是 | 要获取上下文的线程 ID |
| `mode` | 字符串 | 否 | 上下文模式："summary"（自然语言）或 "basic"（原始事实） |
| `minRating` | 数字 | 否 | 用于筛选相关事实的最低评分 |
| `apiKey` | 字符串 | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `context` | string | 上下文字符串（摘要或基本模式） |

### `zep_get_messages`

从线程中检索消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | 是 | 要从中获取消息的线程 ID |
| `limit` | number | 否 | 要返回的最大消息数 |
| `cursor` | string | 否 | 用于分页的游标 |
| `lastn` | number | 否 | 要返回的最新消息数（覆盖限制和游标） |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `messages` | array | 消息对象数组 |
| `rowCount` | number | 此响应中的消息数 |
| `totalCount` | number | 线程中的消息总数 |

### `zep_add_messages`

向现有线程添加消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | 是 | 要添加消息的线程 ID |
| `messages` | json | 是 | 包含角色和内容的消息对象数组 |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `threadId` | string | 线程 ID |
| `added` | boolean | 消息是否成功添加 |
| `messageIds` | array | 添加的消息 UUID 数组 |

### `zep_add_user`

在 Zep 中创建新用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 用户的唯一标识符 |
| `email` | string | 否 | 用户的电子邮件地址 |
| `firstName` | string | 否 | 用户的名字 |
| `lastName` | string | 否 | 用户的姓氏 |
| `metadata` | json | 否 | 作为 JSON 对象的附加元数据 |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `userId` | string | 用户 ID |
| `email` | string | 用户电子邮件 |
| `firstName` | string | 用户名字 |
| `lastName` | string | 用户姓氏 |
| `uuid` | string | 内部 UUID |
| `createdAt` | string | 创建时间戳 |
| `metadata` | object | 用户元数据 |

### `zep_get_user`

从 Zep 检索用户信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 要检索的用户 ID |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `userId` | string | 用户 ID |
| `email` | string | 用户电子邮件 |
| `firstName` | string | 用户名字 |
| `lastName` | string | 用户姓氏 |
| `uuid` | string | 内部 UUID |
| `createdAt` | string | 创建时间戳 |
| `updatedAt` | string | 最后更新时间戳 |
| `metadata` | object | 用户元数据 |

### `zep_get_user_threads`

列出特定用户的所有会话线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 要获取线程的用户 ID |
| `limit` | number | 否 | 要返回的最大线程数 |
| `apiKey` | string | 是 | 您的 Zep API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `threads` | array | 此用户的线程对象数组 |
| `totalCount` | number | 返回的线程总数 |

## 注意

- 类别：`tools`
- 类型：`zep`
```

--------------------------------------------------------------------------------

---[FILE: zoom.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/zoom.mdx

```text
---
title: Zoom
description: 创建和管理 Zoom 会议及录制内容
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zoom"
  color="#2D8CFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zoom](https://zoom.us/) 是一个领先的基于云的通信平台，提供视频会议、网络研讨会和在线协作功能。它让用户和组织可以轻松安排、主持和管理会议，并提供屏幕共享、聊天、录制等工具。

使用 Zoom，您可以：

- **安排和管理会议**：创建即时或计划会议，包括定期活动
- **配置会议选项**：设置会议密码、启用等候室以及控制参与者的视频/音频
- **发送邀请和共享详情**：获取会议邀请和信息，便于分享
- **获取和更新会议数据**：访问会议详情、修改现有会议并以编程方式管理设置

在 Sim 中，Zoom 集成使您的代理能够自动化安排和会议管理。使用工具操作可以：

- 以编程方式创建具有自定义设置的新会议
- 列出特定用户（或您自己）的所有会议
- 检索任何会议的详情或邀请
- 直接从您的自动化中更新或删除现有会议

要连接到 Zoom，请拖放 Zoom 模块并点击 `Connect`，使用您的 Zoom 账户进行认证。连接后，您可以使用 Zoom 工具创建、列出、更新和删除 Zoom 会议。您可以随时通过点击“设置 > 集成”中的 `Disconnect` 断开您的 Zoom 账户连接，您的 Zoom 账户访问权限将立即被撤销。

这些功能使您能够简化远程协作、自动化定期视频会议，并在工作流中管理您的组织的 Zoom 环境。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Zoom 集成到工作流中。创建、列出、更新和删除 Zoom 会议。获取会议详情、邀请、录制和参与者信息。以编程方式管理云录制。

## 工具

### `zoom_create_meeting`

创建一个新的 Zoom 会议

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 用户 ID 或电子邮件地址。使用 "me" 表示已认证用户。 |
| `topic` | string | 是 | 会议主题 |
| `type` | number | 否 | 会议类型：1=即时会议，2=预定会议，3=无固定时间的循环会议，8=有固定时间的循环会议 |
| `startTime` | string | 否 | 会议开始时间，采用 ISO 8601 格式 \(例如：2025-06-03T10:00:00Z\) |
| `duration` | number | 否 | 会议时长（分钟） |
| `timezone` | string | 否 | 会议的时区 \(例如：America/Los_Angeles\) |
| `password` | string | 否 | 会议密码 |
| `agenda` | string | 否 | 会议议程 |
| `hostVideo` | boolean | 否 | 主持人视频开启时开始会议 |
| `participantVideo` | boolean | 否 | 参与者视频开启时开始会议 |
| `joinBeforeHost` | boolean | 否 | 允许参与者在主持人之前加入会议 |
| `muteUponEntry` | boolean | 否 | 参与者进入时静音 |
| `waitingRoom` | boolean | 否 | 启用等候室 |
| `autoRecording` | string | 否 | 自动录制设置：本地、云端或无 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `meeting` | object | 创建的会议及其所有属性 |

### `zoom_list_meetings`

列出 Zoom 用户的所有会议

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 用户 ID 或电子邮件地址。使用 "me" 表示已认证用户。 |
| `type` | string | 否 | 会议类型过滤器：scheduled, live, upcoming, upcoming_meetings, 或 previous_meetings |
| `pageSize` | number | 否 | 每页记录数（最大 300） |
| `nextPageToken` | string | 否 | 分页令牌，用于获取下一页结果 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `meetings` | array | 会议列表 |
| `pageInfo` | object | 分页信息 |

### `zoom_get_meeting`

获取特定 Zoom 会议的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 会议 ID |
| `occurrenceId` | string | 否 | 定期会议的发生 ID |
| `showPreviousOccurrences` | boolean | 否 | 显示定期会议的先前发生记录 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `meeting` | object | 会议详细信息 |

### `zoom_update_meeting`

更新现有的 Zoom 会议

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 要更新的会议 ID |
| `topic` | string | 否 | 会议主题 |
| `type` | number | 否 | 会议类型：1=即时，2=计划，3=无固定时间的定期会议，8=有固定时间的定期会议 |
| `startTime` | string | 否 | ISO 8601 格式的会议开始时间 \(例如：2025-06-03T10:00:00Z\) |
| `duration` | number | 否 | 会议时长（分钟） |
| `timezone` | string | 否 | 会议的时区 \(例如：America/Los_Angeles\) |
| `password` | string | 否 | 会议密码 |
| `agenda` | string | 否 | 会议议程 |
| `hostVideo` | boolean | 否 | 主持人视频开启时开始 |
| `participantVideo` | boolean | 否 | 参与者视频开启时开始 |
| `joinBeforeHost` | boolean | 否 | 允许参与者在主持人之前加入 |
| `muteUponEntry` | boolean | 否 | 参与者进入时静音 |
| `waitingRoom` | boolean | 否 | 启用等候室 |
| `autoRecording` | string | 否 | 自动录制设置：本地、云或无 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 会议是否成功更新 |

### `zoom_delete_meeting`

删除或取消 Zoom 会议

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 要删除的会议 ID |
| `occurrenceId` | string | 否 | 删除定期会议的特定场次的场次 ID |
| `scheduleForReminder` | boolean | 否 | 向注册者发送取消提醒邮件 |
| `cancelMeetingReminder` | boolean | 否 | 向注册者和替代主持人发送取消邮件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 会议是否成功删除 |

### `zoom_get_meeting_invitation`

获取 Zoom 会议的邀请文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 会议 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `invitation` | string | 会议邀请文本 |

### `zoom_list_recordings`

列出 Zoom 用户的所有云录制

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 用户 ID 或电子邮件地址。使用 "me" 表示已认证用户。 |
| `from` | string | 否 | 开始日期，格式为 yyyy-mm-dd \(最近 6 个月内\) |
| `to` | string | 否 | 结束日期，格式为 yyyy-mm-dd |
| `pageSize` | number | 否 | 每页记录数 \(最大 300\) |
| `nextPageToken` | string | 否 | 分页令牌，用于获取下一页结果 |
| `trash` | boolean | 否 | 设置为 true 以列出回收站中的录制 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `recordings` | array | 录制列表 |
| `pageInfo` | object | 分页信息 |

### `zoom_get_meeting_recordings`

获取特定 Zoom 会议的所有录制

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 会议 ID 或会议 UUID |
| `includeFolderItems` | boolean | 否 | 包括文件夹中的项目 |
| `ttl` | number | 否 | 下载 URL 的有效时间（秒）\(最大值 604800\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `recording` | object | 包含所有文件的会议录制 |

### `zoom_delete_recording`

删除 Zoom 会议的云录制

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 会议 ID 或会议 UUID |
| `recordingId` | string | 否 | 要删除的特定录制文件 ID。如果未提供，则删除所有录制。 |
| `action` | string | 否 | 删除操作："trash" \(移至回收站\) 或 "delete" \(永久删除\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 录制是否成功删除 |

### `zoom_list_past_participants`

列出过去 Zoom 会议的参与者

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | 是 | 过去会议的 ID 或 UUID |
| `pageSize` | number | 否 | 每页记录数 \(最大值 300\) |
| `nextPageToken` | string | 否 | 分页令牌，用于获取下一页结果 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `participants` | array | 会议参与者列表 |
| `pageInfo` | object | 分页信息 |

## 注意事项

- 类别: `tools`
- 类型: `zoom`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/triggers/index.mdx

```text
---
title: 概览
description: 触发器是启动 Sim 工作流的核心方式
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

<div className="flex justify-center">
  <Image
    src="/static/blocks/triggers.png"
    alt="触发器概览"
    width={500}
    height={350}
    className="my-6"
  />
</div>

## 核心触发器

使用 Start 块处理从编辑器、部署到 API 或部署到聊天的所有操作。其他触发器可用于事件驱动的工作流：

<Cards>
  <Card title="开始" href="/triggers/start">
    支持编辑器运行、API 部署和聊天部署的统一入口点
  </Card>
  <Card title="Webhook" href="/triggers/webhook">
    接收外部 webhook 负载
  </Card>
  <Card title="计划" href="/triggers/schedule">
    基于 Cron 或间隔的执行
  </Card>
  <Card title="RSS 源" href="/triggers/rss">
    监控 RSS 和 Atom 源的新内容
  </Card>
</Cards>

## 快速对比

| 触发器 | 启动条件 |
|---------|-----------------|
| **开始** | 编辑器运行、部署到 API 请求或聊天消息 |
| **计划** | 在计划块中管理的计时器 |
| **Webhook** | 收到入站 HTTP 请求时 |
| **RSS 源** | 源中发布了新项目 |

> Start 块始终公开 `input`、`conversationId` 和 `files` 字段。通过向输入格式添加自定义字段来增加结构化数据。

## 使用触发器

1. 将 Start 块放入起始槽（或其他触发器如 Webhook/Schedule）。
2. 配置任何所需的模式或认证。
3. 将该块连接到工作流的其余部分。

> 部署为每个触发器提供支持。更新工作流，重新部署，所有触发器入口点将获取新的快照。在[执行 → 部署快照](/execution)中了解更多。

## 手动执行优先级

当您在编辑器中点击 **运行** 时，Sim 会根据以下优先级顺序自动选择要执行的触发器：

1. **Start 块**（最高优先级）
2. **Schedule 触发器**
3. **外部触发器**（如 webhooks、Slack、Gmail、Airtable 等集成）

如果您的工作流有多个触发器，将执行优先级最高的触发器。例如，如果您同时有 Start 块和 Webhook 触发器，点击运行将执行 Start 块。

**带有模拟负载的外部触发器**：当手动执行外部触发器（如 webhooks 和集成）时，Sim 会根据触发器的预期数据结构自动生成模拟负载。这确保了在测试过程中，下游模块可以正确解析变量。
```

--------------------------------------------------------------------------------

---[FILE: rss.mdx]---
Location: sim-main/apps/docs/content/docs/zh/triggers/rss.mdx

```text
---
title: RSS 订阅源
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

RSS 订阅源模块监控 RSS 和 Atom 订阅源——当有新内容发布时，您的工作流会自动触发。

<div className="flex justify-center">
  <Image
    src="/static/blocks/rss.png"
    alt="RSS 订阅源模块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 配置

1. **添加 RSS 订阅源模块** - 拖动 RSS 订阅源模块以开始您的工作流
2. **输入订阅源 URL** - 粘贴任意 RSS 或 Atom 订阅源的 URL
3. **部署** - 部署您的工作流以激活轮询

部署后，订阅源每分钟检查一次是否有新内容。

## 输出字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `title` | string | 内容标题 |
| `link` | string | 内容链接 |
| `pubDate` | string | 发布日期 |
| `item` | object | 包含所有字段的原始内容 |
| `feed` | object | 原始订阅源元数据 |

可以直接访问映射字段 (`<rss.title>`)，或者使用原始对象访问任意字段 (`<rss.item.author>`, `<rss.feed.language>`)。

## 使用场景

- **内容监控** - 跟踪博客、新闻网站或竞争对手的更新
- **播客自动化** - 当新剧集发布时触发工作流
- **版本跟踪** - 监控 GitHub 发布、更新日志或产品更新
- **社交聚合** - 收集支持 RSS 订阅源的平台内容

<Callout>
RSS 触发器仅对您保存触发器后发布的内容生效。现有的订阅源内容不会被处理。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/zh/triggers/schedule.mdx

```text
---
title: 计划
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

计划模块会在指定的时间间隔或时间点自动触发工作流。

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule.png"
    alt="计划块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 计划选项

通过下拉选项配置工作流的运行时间：

<Tabs items={['简单间隔', 'Cron 表达式']}>
  <Tab>
    <ul className="list-disc space-y-1 pl-6">
      <li><strong>每隔几分钟</strong>：5 分钟、15 分钟、30 分钟的间隔</li>
      <li><strong>每小时</strong>：每小时或每隔几小时</li>
      <li><strong>每天</strong>：每天一次或多次</li>
      <li><strong>每周</strong>：一周中的特定日子</li>
      <li><strong>每月</strong>：一个月中的特定日子</li>
    </ul>
  </Tab>
  <Tab>
    <p>使用 cron 表达式进行高级调度：</p>
    <div className="text-sm space-y-1">
      <div><code>0 9 * * 1-5</code> - 每个工作日的上午 9 点</div>
      <div><code>*/15 * * * *</code> - 每 15 分钟</div>
      <div><code>0 0 1 * *</code> - 每月的第一天</div>
    </div>
  </Tab>
</Tabs>

## 配置计划

当工作流被计划时：
- 计划变为**激活**状态，并显示下次执行时间
- 点击 **"已计划"** 按钮以停用计划
- 计划在 **连续失败 3 次** 后会自动停用

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-2.png"
    alt="活动计划块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="停用的计划"
    width={500}
    height={350}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="禁用计划"
    width={500}
    height={400}
    className="my-6"
  />
</div>

已禁用的计划会显示上次激活的时间。点击 **"已禁用"** 徽章以重新激活计划。

<Callout>
计划块无法接收传入连接，仅作为纯工作流触发器。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: start.mdx]---
Location: sim-main/apps/docs/content/docs/zh/triggers/start.mdx

```text
---
title: 开始
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

“开始”模块是 Sim 中构建工作流的默认触发器。它收集结构化输入，并将其分发到您的图表的其余部分，用于编辑器测试、API 部署和聊天体验。

<div className="flex justify-center">
  <Image
    src="/static/start.png"
    alt="带有输入格式字段的开始模块"
    width={360}
    height={380}
    className="my-6"
  />
</div>

<Callout type="info">
“开始”模块在您创建工作流时位于起始位置。当您希望同一个入口点服务于编辑器运行、API 部署请求和聊天会话时，请将其保留在那里。如果只需要事件驱动的执行，可以将其替换为 Webhook 或 Schedule 触发器。
</Callout>

## 开始模块暴露的字段

“开始”模块根据执行环境发出不同的数据：

- **输入格式字段** — 您添加的每个字段都会作为 <code>&lt;start.fieldName&gt;</code> 提供。例如，`customerId` 字段会在下游模块和模板中显示为 <code>&lt;start.customerId&gt;</code>。
- **仅限聊天的字段** — 当工作流从聊天侧边栏或已部署的聊天体验中运行时，Sim 还会提供 <code>&lt;start.input&gt;</code>（最新用户消息）、<code>&lt;start.conversationId&gt;</code>（活动会话 ID）和 <code>&lt;start.files&gt;</code>（聊天附件）。

请将输入格式字段限定为您期望稍后引用的名称——这些值是编辑器、API 和聊天运行中唯一共享的结构化字段。

## 配置输入格式

使用输入格式子模块定义适用于所有执行模式的架构：

1. 为您想要收集的每个值添加一个字段。
2. 选择一个类型（`string`、`number`、`boolean`、`object`、`array` 或 `files`）。文件字段接受来自聊天和 API 调用者的上传。
3. 当您希望手动运行模式自动填充测试数据时，提供默认值。这些默认值在已部署的执行中会被忽略。
4. 重新排序字段以控制它们在编辑器表单中的显示顺序。

根据您连接的模块，通过类似 <code>&lt;start.customerId&gt;</code> 的表达式引用结构化值。

## 每个入口点的行为

<Tabs items={['编辑器运行', '部署到 API', '部署到聊天']}>
  <Tab>
    <div className="space-y-3">
      <p>
        当您在编辑器中点击 <strong>运行</strong> 时，开始模块会将输入格式呈现为一个表单。默认值使您无需重新输入数据即可轻松重新测试。提交表单会立即触发工作流，这些值将可用在 <code>&lt;start.fieldName&gt;</code>（例如 <code>&lt;start.sampleField&gt;</code>）中。
      </p>
      <p>
        表单中的文件字段会直接上传到相应的 <code>&lt;start.fieldName&gt;</code>；使用这些值为下游工具或存储步骤提供数据。
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        部署到 API 会将输入格式转换为客户端的 JSON 合约。每个字段都会成为请求体的一部分，Sim 在接收时会强制转换基本类型。文件字段需要引用已上传文件的对象；在调用工作流之前，请使用执行文件上传端点。
      </p>
      <p>
        API 调用者可以包含其他可选属性。这些属性会保存在 <code>&lt;start.fieldName&gt;</code> 输出中，因此您可以在不立即重新部署的情况下进行实验。
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        在聊天部署中，开始模块绑定到活动会话。最新消息填充 <code>&lt;start.input&gt;</code>，会话标识符可通过 <code>&lt;start.conversationId&gt;</code> 获取，用户附件会出现在 <code>&lt;start.files&gt;</code> 中，以及任何范围为 <code>&lt;start.fieldName&gt;</code> 的输入格式字段。
      </p>
      <p>
        如果您通过附加结构化上下文（例如嵌入）启动聊天，它会合并到相应的 <code>&lt;start.fieldName&gt;</code> 输出中，确保下游模块与 API 和手动运行保持一致。
      </p>
    </div>
  </Tab>
</Tabs>

## 在下游引用 Start 数据

- 将 <code>&lt;start.fieldName&gt;</code> 直接连接到需要结构化负载的代理、工具或函数中。
- 在提示字段中使用模板语法，例如 <code>&lt;start.sampleField&gt;</code> 或 <code>&lt;start.files[0].url&gt;</code>（仅限聊天）。
- 当需要对输出进行分组、更新会话历史记录或回调到聊天 API 时，请随时使用 <code>&lt;start.conversationId&gt;</code>。

## 最佳实践

- 当您希望同时支持 API 和聊天调用者时，将 Start 块视为单一入口点。
- 优先使用命名的输入格式字段，而不是在下游节点中解析原始 JSON；类型强制会自动发生。
- 如果您的工作流需要某些字段才能成功，请在 Start 之后立即添加验证或路由。

- 将 <code>&lt;start.fieldName&gt;</code> 直接连接到需要结构化负载的代理、工具或函数。
- 在提示字段中使用模板语法，例如 <code>&lt;start.sampleField&gt;</code> 或 <code>&lt;start.files[0].url&gt;</code>（仅限聊天）。
- 当需要对输出进行分组、更新会话历史记录或回调到聊天 API 时，请随时使用 <code>&lt;start.conversationId&gt;</code>。

## 最佳实践

- 当您希望同时支持 API 和聊天调用者时，将 Start 块视为单一入口点。
- 优先使用命名的输入格式字段，而不是在下游节点中解析原始 JSON；类型强制会自动发生。
- 如果某些字段是工作流成功所必需的，请在 Start 之后立即添加验证或路由。
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/zh/triggers/webhook.mdx

```text
---
title: Webhooks
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Webhook 允许外部服务通过向您的工作流发送 HTTP 请求来触发工作流的执行。Sim 支持两种基于 Webhook 的触发方式。

## 通用 Webhook 触发器

通用 Webhook 模块创建了一个灵活的端点，可以接收任何有效负载并触发您的工作流：

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="通用 Webhook 配置"
    width={500}
    height={400}
    className="my-6"
  />
</div>

### 工作原理

1. **添加通用 Webhook 模块** - 拖动通用 Webhook 模块以开始您的工作流
2. **配置有效负载** - 设置预期的有效负载结构（可选）
3. **获取 Webhook URL** - 复制自动生成的唯一端点
4. **外部集成** - 配置您的外部服务以向此 URL 发送 POST 请求
5. **工作流执行** - 每次对 Webhook URL 的请求都会触发工作流

### 功能

- **灵活的有效负载**：接受任何 JSON 格式的有效负载结构
- **自动解析**：Webhook 数据会被自动解析并供后续模块使用
- **身份验证**：支持可选的 Bearer Token 或自定义头部身份验证
- **速率限制**：内置防滥用保护
- **去重功能**：防止重复请求导致的重复执行

<Callout type="info">
通用 Webhook 触发器每次接收到 Webhook URL 的请求时都会触发，非常适合实时集成。
</Callout>

## 服务模块的触发模式

或者，您可以使用特定的服务模块（如 Slack、GitHub 等）以“触发模式”创建更专业的 Webhook 端点：

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="slack-trigger.mp4" width={700} height={450} />
</div>

### 设置触发模式

1. **添加服务模块** - 选择一个服务模块（例如 Slack、GitHub、Airtable）
2. **启用触发模式** - 在模块设置中切换“用作触发器”
3. **配置服务** - 设置该服务的身份验证和事件过滤器
4. **Webhook 注册** - 服务会自动向外部平台注册 webhook
5. **基于事件的执行** - 工作流仅针对该服务的特定事件触发

### 何时使用每种方法

**在以下情况下使用通用 Webhook：**
- 与自定义应用程序或服务集成
- 需要最大灵活性的有效负载结构
- 使用没有专用模块的服务
- 构建内部集成

**在以下情况下使用触发模式：**
- 使用支持的服务（如 Slack、GitHub 等）
- 需要服务特定的事件过滤
- 需要自动 webhook 注册
- 需要为该服务处理结构化数据

## 支持触发模式的服务

**开发与项目管理**
- GitHub - 问题、PR、推送、发布、工作流运行
- Jira - 问题事件、工作日志
- Linear - 问题、评论、项目、周期、标签

**通信**
- Slack - 消息、提及、反应
- Microsoft Teams - 聊天消息、频道通知
- Telegram - 机器人消息、命令
- WhatsApp - 消息事件

**电子邮件**
- Gmail - 新邮件（轮询）、标签更改
- Outlook - 新邮件（轮询）、文件夹事件

**客户关系管理与销售**
- HubSpot - 联系人、公司、交易、工单、对话
- Stripe - 支付、订阅、客户

**表单与调查**
- Typeform - 表单提交
- Google Forms - 表单响应
- Webflow - 集合项、表单提交

**其他**
- Airtable - 记录更改
- Twilio Voice - 来电、通话状态

## 安全性与最佳实践

### 身份验证选项

- **Bearer Tokens**: 包含 `Authorization: Bearer <token>` 标头
- **自定义标头**: 定义自定义身份验证标头

### 负载处理

- **验证**: 验证传入的负载以防止数据格式错误
- **大小限制**: Webhook 的负载大小有限制以确保安全
- **错误处理**: 为无效请求配置错误响应

### 测试 Webhook

1. 使用 Postman 或 curl 等工具测试您的 Webhook 端点
2. 检查工作流执行日志以进行调试
3. 验证负载结构是否符合您的预期
4. 测试身份验证和错误场景

<Callout type="warning">
在处理工作流中的 Webhook 数据之前，请始终验证和清理传入的数据。
</Callout>

## 常见用例

### 实时通知
- Slack 消息触发自动响应
- 关键事件的电子邮件通知

### CI/CD 集成  
- GitHub 推送触发部署工作流
- 构建状态更新
- 自动化测试流水线

### 数据同步
- Airtable 更改更新其他系统
- 表单提交触发后续操作
- 电商订单处理

### 客户支持
- 支持工单创建工作流
- 自动升级流程
- 多渠道通信路由
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/zh/variables/environment-variables.mdx

```text
---
title: 环境变量
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

环境变量为管理工作流中的配置值和密钥（包括 API 密钥和其他敏感数据）提供了一种安全的方式。它们可以在执行期间使用，同时将敏感信息从工作流定义中隔离开来。

## 变量类型

Sim 中的环境变量分为两个级别：

- **个人环境变量**：仅限于您的账户，只有您可以查看和使用
- **工作区环境变量**：在整个工作区内共享，所有团队成员都可以使用

<Callout type="info">
当命名冲突时，工作区环境变量优先于个人环境变量。
</Callout>

## 设置环境变量

前往设置页面配置您的环境变量：

<Image
  src="/static/environment/environment-1.png"
  alt="用于创建新变量的环境变量弹窗"
  width={500}
  height={350}
/>

在工作区设置中，您可以创建和管理个人及工作区级别的环境变量。个人变量仅限于您的账户，而工作区变量会与所有团队成员共享。

### 将变量设为工作区范围

使用工作区范围切换按钮，使变量对整个团队可用：

<Image
  src="/static/environment/environment-2.png"
  alt="切换环境变量的工作区范围"
  width={500}
  height={350}
/>

启用工作区范围后，该变量将对所有工作区成员可用，并可在该工作区内的任何工作流中使用。

### 工作区变量视图

一旦您拥有了工作区范围的变量，它们将显示在您的环境变量列表中：

<Image
  src="/static/environment/environment-3.png"
  alt="环境变量列表中的工作区范围变量"
  width={500}
  height={350}
/>

## 在工作流中使用变量

要在工作流中引用环境变量，请使用 `{{}}` 表示法。当您在任何输入字段中键入 `{{` 时，将会出现一个下拉菜单，显示您的个人和工作区级别的环境变量。只需选择您想要使用的变量即可。

<Image
  src="/static/environment/environment-4.png"
  alt="使用双大括号表示法的环境变量"
  width={500}
  height={350}
/>

## 变量的解析方式

**工作区变量始终优先于**个人变量，无论是谁运行工作流。

当某个键没有工作区变量时，将使用个人变量：
- **手动运行（UI）**：使用您的个人变量
- **自动运行（API、Webhook、计划任务、已部署的聊天）**：使用工作流所有者的个人变量

<Callout type="info">
个人变量最适合用于测试。生产环境的工作流请使用工作区变量。
</Callout>

## 安全最佳实践

### 针对敏感数据
- 将 API 密钥、令牌和密码存储为环境变量，而不是硬编码它们
- 对于多个团队成员需要的共享资源，使用工作区变量
- 将个人凭据保存在个人变量中

### 变量命名
- 使用描述性名称：`DATABASE_URL` 而不是 `DB`
- 在团队中遵循一致的命名约定
- 考虑使用前缀以避免冲突：`PROD_API_KEY`、`DEV_API_KEY`

### 访问控制
- 工作区环境变量遵循工作区权限
- 只有具有写入权限或更高权限的用户才能创建/修改工作区变量
- 个人变量始终对个人用户私有
```

--------------------------------------------------------------------------------

---[FILE: workflow-variables.mdx]---
Location: sim-main/apps/docs/content/docs/zh/variables/workflow-variables.mdx

```text
---
title: 工作流变量
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Sim 中的变量充当数据的全局存储，可以被工作流中的任何模块访问和修改，从而允许您通过全局变量在整个工作流中存储和共享数据。它们提供了一种强大的方式来在工作流的不同部分之间共享信息、维护状态并创建更动态的应用程序。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables.mp4" />
</div>

<Callout type="info">
  变量允许您在整个工作流中存储和共享数据，使您能够轻松维护状态并创建复杂的互联系统。
</Callout>

## 概述

变量功能作为工作流的中央数据存储，能够：

<Steps>
  <Step>
    <strong>存储全局数据</strong>：创建在工作流执行期间持久存在的变量
  </Step>
  <Step>
    <strong>在模块之间共享信息</strong>：从工作流中的任何模块访问相同的数据
  </Step>
  <Step>
    <strong>维护工作流状态</strong>：在工作流运行时跟踪重要的值
  </Step>
  <Step>
    <strong>创建动态工作流</strong>：基于存储的值构建更灵活的系统
  </Step>
</Steps>

## 创建变量

您可以通过侧边栏中的变量面板创建和管理变量。每个变量具有：

- **名称**：用于引用变量的唯一标识符
- **值**：存储在变量中的数据（支持多种数据类型）
- **描述**（可选）：解释变量用途的注释

## 访问变量

可以通过工作流中的任何模块使用变量下拉菜单访问变量。只需：

1. 在块内的任意文本字段中输入 `<`
2. 浏览下拉菜单以选择可用变量
3. 选择您想要使用的变量

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables-dropdown.mp4" />
</div>

<Callout>
  您还可以将连接标签拖到字段中以打开变量下拉菜单并访问可用变量。
</Callout>

## 变量类型

Sim 中的变量可以存储多种类型的数据：

<Tabs items={['文本', '数字', '布尔值', '对象', '数组']}>
  <Tab>

    ```
    "Hello, World!"
    ```

    <p className="mt-2">文本变量存储字符字符串。它们适用于存储消息、名称和其他文本数据。</p>
  </Tab>
  <Tab>

    ```
    42
    ```

    <p className="mt-2">数字变量存储可用于计算或比较的数值。</p>
  </Tab>
  <Tab>

    ```
    true
    ```

    <p className="mt-2">布尔变量存储 true/false 值，非常适合标志和条件检查。</p>
  </Tab>
  <Tab>

    ```json
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    ```

    <p className="mt-2">对象变量存储具有属性和值的结构化数据。</p>
  </Tab>
  <Tab>

    ```json
    [1, 2, 3, "four", "five"]
    ```

    <p className="mt-2">数组变量存储有序的项目集合。</p>
  </Tab>
</Tabs>

## 在块中使用变量

当您从块中访问变量时，您可以：

- **读取其值**：在块的逻辑中使用变量的当前值
- **修改它**：根据块的处理更新变量的值
- **在表达式中使用它**：将变量包含在表达式和计算中

## 变量作用域

Sim 中的变量具有全局作用域，这意味着：

- 它们可以从工作流中的任何块访问
- 对变量的更改在工作流执行期间保持
- 除非明确重置，否则变量在运行之间保持其值

## 最佳实践

- **使用描述性名称**：选择能够清楚表明变量代表什么的名称。例如，使用 `userPreferences` 而不是 `up`。
- **记录您的变量**：为变量添加描述，以帮助其他团队成员了解其用途和用法。
- **考虑变量作用域**：记住变量是全局的，可以被任何块修改。在设计工作流时考虑到这一点，以防止意外行为。
- **尽早初始化变量**：在工作流开始时设置并初始化变量，以确保它们在需要时可用。
- **处理缺失变量**：始终考虑变量可能尚不存在或可能具有意外值的情况。在块中添加适当的验证。
- **限制变量数量**：保持变量数量在可管理范围内。过多的变量会使您的工作流难以理解和维护。
```

--------------------------------------------------------------------------------

---[FILE: cn.ts]---
Location: sim-main/apps/docs/lib/cn.ts

```typescript
export { twMerge as cn } from 'tailwind-merge'
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: sim-main/apps/docs/lib/i18n.ts

```typescript
import { defineI18n } from 'fumadocs-core/i18n'

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
  hideLocale: 'default-locale',
  parser: 'dir',
})
```

--------------------------------------------------------------------------------

---[FILE: llms.ts]---
Location: sim-main/apps/docs/lib/llms.ts

```typescript
import type { InferPageType } from 'fumadocs-core/source'
import type { PageData, source } from '@/lib/source'

export async function getLLMText(page: InferPageType<typeof source>) {
  const data = page.data as PageData
  const processed = await data.getText('processed')
  return `# ${data.title} (${page.url})

${processed}`
}
```

--------------------------------------------------------------------------------

---[FILE: source.ts]---
Location: sim-main/apps/docs/lib/source.ts

```typescript
import { type InferPageType, loader } from 'fumadocs-core/source'
import type { DocData, DocMethods } from 'fumadocs-mdx/runtime/types'
import { docs } from '@/.source/server'
import { i18n } from './i18n'

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  i18n,
})

/** Full page data type including MDX content and metadata */
export type PageData = DocData &
  DocMethods & {
    title: string
    description?: string
    full?: boolean
  }

export type Page = InferPageType<typeof source>
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/docs/lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names into a single string, merging Tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the full URL for an asset stored in Vercel Blob
 * - If CDN is configured (NEXT_PUBLIC_BLOB_BASE_URL), uses CDN URL
 * - Otherwise falls back to local static assets served from root path
 */
export function getAssetUrl(filename: string) {
  const cdnBaseUrl = process.env.NEXT_PUBLIC_BLOB_BASE_URL
  if (cdnBaseUrl) {
    return `${cdnBaseUrl}/${filename}`
  }
  return `/${filename}`
}
```

--------------------------------------------------------------------------------

---[FILE: llms.txt]---
Location: sim-main/apps/docs/public/llms.txt

```text
# Sim Documentation

Sim is a visual workflow builder for AI applications that lets you build AI agent workflows visually. Create powerful AI agents, automation workflows, and data processing pipelines by connecting blocks on a canvas—no coding required.

## What is Sim?

Sim provides a complete ecosystem for AI workflow automation including:
- Visual workflow builder with drag-and-drop interface
- AI agent creation and automation
- 80+ built-in integrations (OpenAI, Slack, Gmail, GitHub, etc.)
- Real-time team collaboration
- Multiple deployment options (cloud-hosted or self-hosted)
- Custom integrations via MCP protocol

## Main Documentation Sections

Here are the key areas covered in our documentation:

/introduction - Getting started with Sim visual workflow builder
/getting-started - Quick start guide for building your first workflow
/blocks - Understanding workflow blocks (AI agents, APIs, functions)
/tools - 80+ built-in integrations and tools
/webhooks - Webhook triggers and handling
/mcp - Custom integrations via MCP protocol
/deployment - Cloud-hosted vs self-hosted deployment
/permissions - Team collaboration and workspace management
/collaboration - Real-time editing and team features
/workflows - Building complex automation workflows

## Technical Information

- Framework: Fumadocs (Next.js-based documentation platform)
- Content: MDX files with interactive examples
- Languages: English (primary), French, Chinese
- Search: AI-powered search and assistance available

## Complete Documentation

For the full documentation with all pages, examples, and interactive features, visit our documentation site. We also provide machine-readable versions at /llms.txt (full content) for AI systems.

## Additional Resources

- GitHub repository with workflow examples
- Discord community for support and discussions
- 80+ built-in integrations with detailed guides
- MCP protocol documentation for custom integrations
- Self-hosting guides and Docker deployment

For the complete documentation with interactive examples and visual workflow builder guides, visit https://docs.sim.ai

---

Last updated: 2025-09-15
```

--------------------------------------------------------------------------------

---[FILE: site.webmanifest]---
Location: sim-main/apps/docs/public/favicon/site.webmanifest

```text
{
  "name": "MyWebSite",
  "short_name": "MySite",
  "icons": [
    {
      "src": "/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: sim-main/apps/sim/.env.example

```text
# Database (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"

# PostgreSQL Port (Optional) - defaults to 5432 if not specified
# POSTGRES_PORT=5432

# Authentication (Required unless DISABLE_AUTH=true)
BETTER_AUTH_SECRET=your_secret_key  # Use `openssl rand -hex 32` to generate, or visit https://www.better-auth.com/docs/installation
BETTER_AUTH_URL=http://localhost:3000

# Authentication Bypass (Optional - for self-hosted deployments behind private networks)
# DISABLE_AUTH=true  # Uncomment to bypass authentication entirely. Creates an anonymous session for all requests.

# NextJS (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security (Required)
ENCRYPTION_KEY=your_encryption_key  # Use `openssl rand -hex 32` to generate, used to encrypt environment variables
INTERNAL_API_SECRET=your_internal_api_secret # Use `openssl rand -hex 32` to generate, used to encrypt internal api routes
API_ENCRYPTION_KEY=your_api_encryption_key # Use `openssl rand -hex 32` to generate, used to encrypt api keys

# Email Provider (Optional)
# RESEND_API_KEY=  # Uncomment and add your key from https://resend.com to send actual emails
                   # If left commented out, emails will be logged to console instead

# Local AI Models (Optional)
# OLLAMA_URL=http://localhost:11434  # URL for local Ollama server - uncomment if using local models
# VLLM_BASE_URL=http://localhost:8000    # Base URL for your self-hosted vLLM (OpenAI-compatible)
# VLLM_API_KEY=                          # Optional bearer token if your vLLM instance requires auth

# Admin API (Optional - for self-hosted GitOps)
# ADMIN_API_KEY=  # Use `openssl rand -hex 32` to generate. Enables admin API for workflow export/import.
                  # Usage: curl -H "x-admin-key: your_key" https://your-instance/api/v1/admin/workspaces
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: sim-main/apps/sim/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/packages/**/node_modules

# bun specific
.bun
bun.lockb
bun-debug.log*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist
**/dist/
**/standalone/
sim-standalone.tar.gz

# misc
.DS_Store
*.pem

# env files
.env
*.env
.env.local
.env.development
.env.test
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# Uploads
/uploads

.trigger
```

--------------------------------------------------------------------------------

---[FILE: components.json]---
Location: sim-main/apps/sim/components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/core/utils/cn",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "blocks": "@/blocks"
  },
  "iconLibrary": "lucide"
}
```

--------------------------------------------------------------------------------

---[FILE: drizzle.config.ts]---
Location: sim-main/apps/sim/drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit'
import { env } from './lib/core/config/env'

export default {
  schema: '../../packages/db/schema.ts',
  out: '../../packages/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
```

--------------------------------------------------------------------------------

````

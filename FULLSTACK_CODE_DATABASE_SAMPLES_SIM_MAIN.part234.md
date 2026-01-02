---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 234
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 234 of 933)

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

---[FILE: mailchimp.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mailchimp.mdx

```text
---
title: Mailchimp
description: 在 Mailchimp 中管理受众、活动和营销自动化
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailchimp"
  color="#FFE01B"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailchimp](https://mailchimp.com/) 是一个功能强大的营销自动化平台，可让您在一个地方管理受众、活动和各种营销活动。Mailchimp 强大的 API 和集成功能使您能够直接从 Sim 的工作流程中自动化外展、电子邮件营销、报告和受众管理。

在 Sim 中使用 Mailchimp 工具，您可以：

- **管理受众（列表）：**
  - 列出并检索所有 Mailchimp 受众（列表），以便于管理。
  - 获取特定受众的全面信息。
  - 创建新受众并保持您的细分最新。

- **列出成员：**
  - 访问和管理列表成员（订阅者），检索成员详细信息，并保持您的电子邮件列表同步。

- **活动管理：**
  - 自动化活动创建、发送活动，并通过全面的报告分析活动表现。

- **营销自动化：**
  - 管理自动化工作流程，设置触发器，并安排电子邮件以简化培育流程。

- **模板、细分和标签：**
  - 检索和管理您的电子邮件模板以保持品牌一致性。
  - 访问和更新受众细分以针对特定群体。
  - 创建和管理标签以进一步组织您的联系人。

- **高级列表控制：**
  - 管理合并字段和兴趣类别（组），以从订阅者那里收集丰富的结构化数据。
  - 处理登录页面、注册表单和其他潜在客户捕获工具，以最大化转化率。

- **批量操作和报告：**
  - 运行批量作业以进行大规模操作并简化大规模更新。
  - 检索有关活动、自动化和受众增长的详细报告，以优化您的营销策略。

通过在 Sim 中使用 Mailchimp，您的代理和工作流程可以大规模自动化电子邮件营销——扩展您的受众群体、个性化外展、优化参与度，并做出数据驱动的决策。无论是同步 CRM 记录、响应产品内操作触发活动，还是管理订阅者数据，Mailchimp 在 Sim 中的工具都能为您的营销自动化提供完整的程序化控制。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Mailchimp 集成到工作流程中。可以管理受众（列表）、列表成员、活动、自动化工作流程、模板、报告、分段、标签、合并字段、兴趣类别、登录页面、注册表单和批量操作。

## 工具

### `mailchimp_get_audiences`

从 Mailchimp 检索受众（列表）列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 受众数据和元数据 |

### `mailchimp_get_audience`

从 Mailchimp 检索特定受众（列表）的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 受众数据和元数据 |

### `mailchimp_create_audience`

在 Mailchimp 中创建一个新的受众（列表）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `audienceName` | string | 是 | 列表名称 |
| `contact` | string | 是 | 联系信息的 JSON 对象 |
| `permissionReminder` | string | 是 | 权限提醒文本 |
| `campaignDefaults` | string | 是 | 默认活动设置的 JSON 对象 |
| `emailTypeOption` | string | 是 | 支持多种电子邮件格式 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的受众数据 |

### `mailchimp_update_audience`

更新 Mailchimp 中现有的受众（列表）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `audienceName` | string | 否 | 列表名称 |
| `permissionReminder` | string | 否 | 权限提醒文本 |
| `campaignDefaults` | string | 否 | 默认活动设置的 JSON 对象 |
| `emailTypeOption` | string | 否 | 支持多种电子邮件格式 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的受众数据 |

### `mailchimp_delete_audience`

从 Mailchimp 中删除一个受众（列表）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 要删除的列表的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_get_members`

从 Mailchimp 受众中检索成员列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `status` | string | 否 | 按状态过滤 \(已订阅、未订阅、已清理、待处理\) |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 成员数据和元数据 |

### `mailchimp_get_member`

从 Mailchimp 受众中检索特定成员的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员的电子邮件地址或 MD5 哈希值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 成员数据和元数据 |

### `mailchimp_add_member`

向 Mailchimp 受众添加新成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `emailAddress` | string | 是 | 成员的电子邮件地址 |
| `status` | string | 是 | 订阅者状态 |
| `mergeFields` | string | 否 | 合并字段的 JSON 对象 |
| `interests` | string | 否 | 兴趣的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 添加的成员数据 |

### `mailchimp_add_or_update_member`

向 Mailchimp 受众添加新成员或更新现有成员（插入或更新）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员电子邮件地址或 MD5 哈希值 |
| `emailAddress` | string | 是 | 成员电子邮件地址 |
| `statusIfNew` | string | 是 | 如果是新成员，订阅者状态 |
| `mergeFields` | string | 否 | 合并字段的 JSON 对象 |
| `interests` | string | 否 | 兴趣的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 成员数据 |

### `mailchimp_update_member`

更新 Mailchimp 受众中的现有成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员电子邮件地址或 MD5 哈希值 |
| `emailAddress` | string | 否 | 成员电子邮件地址 |
| `status` | string | 否 | 订阅者状态 |
| `mergeFields` | string | 否 | 合并字段的 JSON 对象 |
| `interests` | string | 否 | 兴趣的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的成员数据 |

### `mailchimp_delete_member`

从 Mailchimp 受众中删除一个成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员的电子邮件地址或 MD5 哈希值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_archive_member`

从 Mailchimp 受众中永久存档（删除）一个成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员的电子邮件地址或 MD5 哈希值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 存档确认 |

### `mailchimp_unarchive_member`

将存档的成员恢复到 Mailchimp 受众

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员的电子邮件地址或 MD5 哈希值 |
| `emailAddress` | string | 是 | 成员的电子邮件地址 |
| `status` | string | 是 | 订阅者状态 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 未归档成员数据 |

### `mailchimp_get_campaigns`

从 Mailchimp 检索活动列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignType` | string | 否 | 按活动类型筛选 \(regular, plaintext, absplit, rss, variate\) |
| `status` | string | 否 | 按状态筛选 \(save, paused, schedule, sending, sent\) |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 活动数据和元数据 |

### `mailchimp_get_campaign`

从 Mailchimp 检索特定活动的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 活动数据和元数据 |

### `mailchimp_create_campaign`

在 Mailchimp 中创建一个新活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignType` | string | 是 | 活动类型 |
| `campaignSettings` | string | 是 | 活动设置的 JSON 对象 |
| `recipients` | string | 否 | 收件人的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的活动数据 |

### `mailchimp_update_campaign`

更新 Mailchimp 中的现有活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 活动的唯一 ID |
| `campaignSettings` | string | 否 | 活动设置的 JSON 对象 |
| `recipients` | string | 否 | 收件人的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的活动数据 |

### `mailchimp_delete_campaign`

从 Mailchimp 删除一个活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 要删除的活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_send_campaign`

发送一个 Mailchimp 活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 要发送的活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 发送确认 |

### `mailchimp_schedule_campaign`

安排一个 Mailchimp 活动在特定时间发送

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 要安排的活动的唯一 ID |
| `scheduleTime` | string | 是 | ISO 8601 格式的日期和时间 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 日程确认 |

### `mailchimp_unschedule_campaign`

取消之前已安排的 Mailchimp 活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 要取消安排的活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 取消安排确认 |

### `mailchimp_replicate_campaign`

创建现有 Mailchimp 活动的副本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 要复制的活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 复制的活动数据 |

### `mailchimp_get_campaign_content`

检索 Mailchimp 活动的 HTML 和纯文本内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 活动内容数据 |

### `mailchimp_set_campaign_content`

设置 Mailchimp 活动的内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 活动的唯一 ID |
| `html` | string | 否 | 活动的 HTML 内容 |
| `plainText` | string | 否 | 活动的纯文本内容 |
| `templateId` | string | 否 | 要使用的模板 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 活动内容数据 |

### `mailchimp_get_automations`

从 Mailchimp 检索自动化列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 自动化数据和元数据 |

### `mailchimp_get_automation`

从 Mailchimp 检索特定自动化的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `workflowId` | string | 是 | 自动化工作流的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 自动化数据和元数据 |

### `mailchimp_start_automation`

启动 Mailchimp 自动化工作流中的所有电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `workflowId` | string | 是 | 自动化工作流的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 启动确认 |

### `mailchimp_pause_automation`

暂停 Mailchimp 自动化工作流中的所有电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `workflowId` | string | 是 | 自动化工作流的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 暂停确认 |

### `mailchimp_add_subscriber_to_automation`

手动将订阅者添加到工作流电子邮件队列

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `workflowId` | string | 是 | 自动化工作流的唯一 ID |
| `workflowEmailId` | string | 是 | 工作流电子邮件的唯一 ID |
| `emailAddress` | string | 是 | 订阅者的电子邮件地址 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 订阅者队列数据 |

### `mailchimp_get_templates`

从 Mailchimp 检索模板列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 模板数据和元数据 |

### `mailchimp_get_template`

从 Mailchimp 检索特定模板的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `templateId` | string | 是 | 模板的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 模板数据和元数据 |

### `mailchimp_create_template`

在 Mailchimp 中创建新模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `templateName` | string | 是 | 模板名称 |
| `templateHtml` | string | 是 | 模板的 HTML 内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的模板数据 |

### `mailchimp_update_template`

在 Mailchimp 中更新现有模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `templateId` | string | 是 | 模板的唯一 ID |
| `templateName` | string | 否 | 模板名称 |
| `templateHtml` | string | 否 | 模板的 HTML 内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的模板数据 |

### `mailchimp_delete_template`

从 Mailchimp 删除一个模板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `templateId` | string | 是 | 要删除的模板的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_get_campaign_reports`

从 Mailchimp 检索活动报告列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 活动报告数据和元数据 |

### `mailchimp_get_campaign_report`

从 Mailchimp 检索特定活动的报告

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `campaignId` | string | 是 | 活动的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 活动报告数据和元数据 |

### `mailchimp_get_segments`

从 Mailchimp 受众中检索段列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 段数据和元数据 |

### `mailchimp_get_segment`

从 Mailchimp 受众中检索特定段的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentId` | string | 是 | 段的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 段数据和元数据 |

### `mailchimp_create_segment`

在 Mailchimp 受众中创建一个新分段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentName` | string | 是 | 分段的名称 |
| `segmentOptions` | string | 否 | 分段选项的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的分段数据 |

### `mailchimp_update_segment`

更新 Mailchimp 受众中的现有分段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentId` | string | 是 | 分段的唯一 ID |
| `segmentName` | string | 否 | 分段的名称 |
| `segmentOptions` | string | 否 | 分段选项的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的分段数据 |

### `mailchimp_delete_segment`

从 Mailchimp 受众中删除一个分段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentId` | string | 是 | 要删除的分段的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_get_segment_members`

从 Mailchimp 受众中检索特定分段的成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentId` | string | 是 | 分段的唯一 ID |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 分段成员数据和元数据 |

### `mailchimp_add_segment_member`

将成员添加到 Mailchimp 受众中的特定分段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentId` | string | 是 | 分段的唯一 ID |
| `emailAddress` | string | 是 | 成员的电子邮件地址 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 添加的成员数据 |

### `mailchimp_remove_segment_member`

从 Mailchimp 受众的特定分段中移除成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `segmentId` | string | 是 | 分段的唯一 ID |
| `subscriberEmail` | string | 是 | 成员的电子邮件地址或 MD5 哈希值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 移除确认 |

### `mailchimp_get_member_tags`

检索 Mailchimp 受众中与成员关联的标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员的电子邮件地址或 MD5 哈希值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 成员标签数据和元数据 |

### `mailchimp_add_member_tags`

向 Mailchimp 受众中的成员添加标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员电子邮件地址或 MD5 哈希值 |
| `tags` | string | 是 | 标签的 JSON 数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 标签添加确认 |

### `mailchimp_remove_member_tags`

从 Mailchimp 受众中的成员移除标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `subscriberEmail` | string | 是 | 成员电子邮件地址或 MD5 哈希值 |
| `tags` | string | 是 | 带有非活动状态的标签的 JSON 数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 标签移除确认 |

### `mailchimp_get_merge_fields`

从 Mailchimp 受众中检索合并字段列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `count` | string | 否 | 结果数量（默认值：10，最大值：1000） |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 合并字段数据和元数据 |

### `mailchimp_get_merge_field`

从 Mailchimp 受众中检索特定合并字段的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `mergeId` | string | 是 | 合并字段的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 合并字段数据和元数据 |

### `mailchimp_create_merge_field`

在 Mailchimp 受众中创建一个新的合并字段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `mergeName` | string | 是 | 合并字段的名称 |
| `mergeType` | string | 是 | 合并字段的类型（文本、数字、地址、电话、日期、网址、图片网址、单选按钮、下拉菜单、生日、邮政编码） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的合并字段数据 |

### `mailchimp_update_merge_field`

更新 Mailchimp 受众中的现有合并字段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `mergeId` | string | 是 | 合并字段的唯一 ID |
| `mergeName` | string | 否 | 合并字段的名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的合并字段数据 |

### `mailchimp_delete_merge_field`

从 Mailchimp 受众中删除合并字段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `mergeId` | string | 是 | 要删除的合并字段的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_get_interest_categories`

从 Mailchimp 受众中检索兴趣类别列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `count` | string | 否 | 结果数量（默认值：10，最大值：1000） |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 兴趣类别数据和元数据 |

### `mailchimp_get_interest_category`

从 Mailchimp 受众中检索特定兴趣类别的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 兴趣类别数据和元数据 |

### `mailchimp_create_interest_category`

在 Mailchimp 受众中创建一个新的兴趣类别

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryTitle` | string | 是 | 兴趣类别的标题 |
| `interestCategoryType` | string | 是 | 兴趣类别的类型（复选框，下拉菜单，单选按钮，隐藏） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的兴趣类别数据 |

### `mailchimp_update_interest_category`

更新 Mailchimp 受众中的现有兴趣类别

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |
| `interestCategoryTitle` | string | 否 | 兴趣类别的标题 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的兴趣类别数据 |

### `mailchimp_delete_interest_category`

从 Mailchimp 受众中删除一个兴趣类别

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 要删除的兴趣类别的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_get_interests`

从 Mailchimp 受众的兴趣类别中检索兴趣列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |
| `count` | string | 否 | 结果数量（默认值：10，最大值：1000） |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 兴趣数据和元数据 |

### `mailchimp_get_interest`

从 Mailchimp 受众的兴趣类别中检索特定兴趣的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |
| `interestId` | string | 是 | 兴趣的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 兴趣数据和元数据 |

### `mailchimp_create_interest`

在 Mailchimp 受众的兴趣类别中创建一个新的兴趣

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |
| `interestName` | string | 是 | 兴趣的名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的兴趣数据 |

### `mailchimp_update_interest`

更新 Mailchimp 受众的兴趣类别中的现有兴趣

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |
| `interestId` | string | 是 | 兴趣的唯一 ID |
| `interestName` | string | 否 | 兴趣的名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的兴趣数据 |

### `mailchimp_delete_interest`

从 Mailchimp 受众的兴趣类别中删除一个兴趣

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `listId` | string | 是 | 列表的唯一 ID |
| `interestCategoryId` | string | 是 | 兴趣类别的唯一 ID |
| `interestId` | string | 是 | 要删除的兴趣的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_get_landing_pages`

从 Mailchimp 检索登录页面列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `count` | string | 否 | 结果数量 \(默认值: 10, 最大值: 1000\) |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 登录页面数据和元数据 |

### `mailchimp_get_landing_page`

从 Mailchimp 检索特定登录页面的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `pageId` | string | 是 | 登录页面的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 登陆页面数据和元数据 |

### `mailchimp_create_landing_page`

在 Mailchimp 中创建一个新的登陆页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `landingPageType` | string | 是 | 登陆页面的类型 \(signup\) |
| `landingPageTitle` | string | 否 | 登陆页面的标题 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的登陆页面数据 |

### `mailchimp_update_landing_page`

在 Mailchimp 中更新现有的登陆页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `pageId` | string | 是 | 登陆页面的唯一 ID |
| `landingPageTitle` | string | 否 | 登陆页面的标题 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的登陆页面数据 |

### `mailchimp_delete_landing_page`

从 Mailchimp 删除一个着陆页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `pageId` | string | 是 | 要删除的着陆页的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

### `mailchimp_publish_landing_page`

在 Mailchimp 中发布一个着陆页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `pageId` | string | 是 | 着陆页的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 发布确认 |

### `mailchimp_unpublish_landing_page`

在 Mailchimp 中取消发布一个着陆页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `pageId` | string | 是 | 着陆页的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 取消发布确认 |

### `mailchimp_get_batch_operations`

从 Mailchimp 检索批量操作列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `count` | string | 否 | 结果数量（默认值：10，最大值：1000） |
| `offset` | string | 否 | 要跳过的结果数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 批量操作数据和元数据 |

### `mailchimp_get_batch_operation`

从 Mailchimp 检索特定批量操作的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `batchId` | string | 是 | 批量操作的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 批量操作数据和元数据 |

### `mailchimp_create_batch_operation`

在 Mailchimp 中创建新的批量操作

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `operations` | string | 是 | 操作的 JSON 数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的批量操作数据 |

### `mailchimp_delete_batch_operation`

从 Mailchimp 删除批量操作

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 带有服务器前缀的 Mailchimp API 密钥 |
| `batchId` | string | 是 | 要删除的批量操作的唯一 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除确认 |

## 注意

- 类别: `tools`
- 类型: `mailchimp`
```

--------------------------------------------------------------------------------

---[FILE: mailgun.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mailgun.mdx

```text
---
title: Mailgun
description: 使用 Mailgun 发送电子邮件并管理邮件列表
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailgun"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailgun](https://www.mailgun.com) 是一款功能强大的电子邮件发送服务，专为开发者和企业设计，能够轻松发送、接收和跟踪电子邮件。Mailgun 提供强大的 API，支持可靠的事务性和营销电子邮件、灵活的邮件列表管理以及高级事件跟踪。

通过 Mailgun 的全面功能集，您可以自动化关键的电子邮件操作，并密切监控投递率和收件人参与度。这使其成为在通信、通知和活动邮件是核心流程的工作流自动化中的理想解决方案。

Mailgun 的主要功能包括：

- **事务性电子邮件发送：** 发送大量电子邮件，例如账户通知、收据、警报和密码重置。
- **丰富的电子邮件内容：** 发送纯文本和 HTML 格式的电子邮件，并使用标签对消息进行分类和跟踪。
- **邮件列表管理：** 创建、更新和管理邮件列表及成员，以高效发送分组通信。
- **域信息：** 检索发送域的详细信息，以监控配置和健康状况。
- **事件跟踪：** 通过详细的事件数据分析电子邮件的投递率和参与度。
- **消息检索：** 访问存储的消息以满足合规性、分析或故障排除需求。

通过将 Mailgun 集成到 Sim 中，您的代理可以以编程方式发送电子邮件、管理邮件列表、访问域信息并监控实时事件，作为自动化工作流的一部分。这使您能够直接从 AI 驱动的流程中实现智能、数据驱动的用户互动。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Mailgun 集成到您的工作流中。发送事务性电子邮件，管理邮件列表及成员，查看域信息并跟踪电子邮件事件。支持文本和 HTML 格式的电子邮件、用于跟踪的标签以及全面的列表管理功能。

## 工具

### `mailgun_send_message`

使用 Mailgun API 发送电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `domain` | string | 是 | Mailgun 域名 \(例如：mg.example.com\) |
| `from` | string | 是 | 发件人电子邮件地址 |
| `to` | string | 是 | 收件人电子邮件地址 \(多个地址用逗号分隔\) |
| `subject` | string | 是 | 电子邮件主题 |
| `text` | string | 否 | 电子邮件的纯文本正文 |
| `html` | string | 否 | 电子邮件的 HTML 正文 |
| `cc` | string | 否 | 抄送电子邮件地址 \(多个地址用逗号分隔\) |
| `bcc` | string | 否 | 密送电子邮件地址 \(多个地址用逗号分隔\) |
| `tags` | string | 否 | 电子邮件标签 \(用逗号分隔\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 消息是否成功发送 |
| `id` | string | 消息 ID |
| `message` | string | 来自 Mailgun 的响应消息 |

### `mailgun_get_message`

通过其密钥检索存储的消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `domain` | string | 是 | Mailgun 域名 |
| `messageKey` | string | 是 | 消息存储密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 请求是否成功 |
| `recipients` | string | 消息接收者 |
| `from` | string | 发件人邮箱 |
| `subject` | string | 消息主题 |
| `bodyPlain` | string | 纯文本正文 |
| `strippedText` | string | 去除格式的文本 |
| `strippedSignature` | string | 去除格式的签名 |
| `bodyHtml` | string | HTML 正文 |
| `strippedHtml` | string | 去除格式的 HTML |
| `attachmentCount` | number | 附件数量 |
| `timestamp` | number | 消息时间戳 |
| `messageHeaders` | json | 消息头信息 |
| `contentIdMap` | json | 内容 ID 映射 |

### `mailgun_list_messages`

列出通过 Mailgun 发送的消息的事件（日志）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `domain` | string | 是 | Mailgun 域名 |
| `event` | string | 否 | 按事件类型过滤 \(accepted, delivered, failed, opened, clicked, etc.\) |
| `limit` | number | 否 | 返回的最大事件数 \(默认值: 100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 请求是否成功 |
| `items` | json | 事件项数组 |
| `paging` | json | 分页信息 |

### `mailgun_create_mailing_list`

创建一个新的邮件列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `address` | string | 是 | 邮件列表地址 \(例如：list@example.com\) |
| `name` | string | 否 | 邮件列表名称 |
| `description` | string | 否 | 邮件列表描述 |
| `accessLevel` | string | 否 | 访问级别：readonly、members 或 everyone |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功创建了列表 |
| `message` | string | 响应消息 |
| `list` | json | 创建的邮件列表详情 |

### `mailgun_get_mailing_list`

获取邮件列表的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `address` | string | 是 | 邮件列表地址 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 请求是否成功 |
| `list` | json | 邮件列表详情 |

### `mailgun_add_list_member`

向邮件列表添加成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `listAddress` | string | 是 | 邮件列表地址 |
| `address` | string | 是 | 成员邮箱地址 |
| `name` | string | 否 | 成员名称 |
| `vars` | string | 否 | 自定义变量的 JSON 字符串 |
| `subscribed` | boolean | 否 | 成员是否已订阅 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成员是否成功添加 |
| `message` | string | 响应消息 |
| `member` | json | 添加的成员详情 |

### `mailgun_list_domains`

列出您的 Mailgun 帐户的所有域名

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 请求是否成功 |
| `totalCount` | number | 域名总数 |
| `items` | json | 域名对象数组 |

### `mailgun_get_domain`

获取特定域名的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Mailgun API 密钥 |
| `domain` | string | 是 | 域名 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 请求是否成功 |
| `domain` | json | 域名详情 |

## 注意事项

- 类别: `tools`
- 类型: `mailgun`
```

--------------------------------------------------------------------------------

---[FILE: mcp.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mcp.mdx

```text
---
title: MCP 工具
description: 从模型上下文协议 (MCP) 服务器执行工具
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mcp"
  color="#181C1E"
/>

## 使用说明

将 MCP 集成到工作流程中。可以从 MCP 服务器执行工具。需要在工作区设置中配置 MCP 服务器。

## 注意事项

- 分类：`tools`
- 类型：`mcp`
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 231
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 231 of 933)

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

---[FILE: incidentio.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/incidentio.mdx

```text
---
title: incidentio
description: 使用 incident.io 管理事件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="incidentio"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
通过 [incident.io](https://incident.io) 提升您的事件管理能力 —— 这是一个领先的平台，可用于协调事件、简化响应流程，并在一个地方跟踪行动项。将 incident.io 无缝集成到您的自动化工作流程中，掌控事件创建、实时协作、后续跟进、排程、升级等诸多功能。

使用 incident.io 工具，您可以：

- **列出和搜索事件**：快速检索正在进行或历史事件的列表，包含严重性、状态和时间戳等元数据，使用 `incidentio_incidents_list`。
- **创建新事件**：通过 `incidentio_incidents_create` 以编程方式触发新事件的创建，指定严重性、名称、类型和自定义详细信息，确保您的响应不会被延误。
- **自动化事件后续**：利用 incident.io 强大的自动化功能，确保重要的行动项和经验教训不会被遗漏，帮助团队解决问题并改进流程。
- **自定义工作流程**：集成定制的事件类型、严重性和适合您组织需求的自定义字段。
- **通过排程和升级实施最佳实践**：通过自动分配、通知和升级来简化值班和事件管理，适应不断变化的情况。

incident.io 赋能现代组织更快响应、协调团队并捕获经验教训以实现持续改进。无论您管理的是 SRE、DevOps、安全还是 IT 事件，incident.io 都能以编程方式将集中化的顶级事件响应集成到您的代理工作流程中。

**可用的关键操作**：
- `incidentio_incidents_list`：列出、分页和筛选事件，提供完整的详细信息。
- `incidentio_incidents_create`：以编程方式打开具有自定义属性的新事件，并控制重复（幂等性）。
- ...更多功能即将推出！

通过将 incident.io 集成到您的工作流程自动化中，提升您的可靠性、责任感和运营卓越性，立即行动吧。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 incident.io 集成到工作流程中。管理事件、操作、后续任务、工作流程、日程安排、升级、自定义字段等。

## 工具

### `incidentio_incidents_list`

从 incident.io 列出事件。返回包含事件详细信息的列表，包括严重性、状态和时间戳。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `page_size` | number | 否 | 每页返回的事件数量 \(默认值：25\) |
| `after` | string | 否 | 用于获取下一页结果的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incidents` | array | 事件列表 |

### `incidentio_incidents_create`

在 incident.io 中创建一个新事件。需要 idempotency_key、severity_id 和 visibility。可选接受名称、摘要、类型和状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `idempotency_key` | string | 是 | 用于防止重复创建事件的唯一标识符。使用 UUID 或唯一字符串。 |
| `name` | string | 否 | 事件名称 \(可选\) |
| `summary` | string | 否 | 事件的简要摘要 |
| `severity_id` | string | 是 | 严重性级别的 ID \(必需\) |
| `incident_type_id` | string | 否 | 事件类型的 ID |
| `incident_status_id` | string | 否 | 初始事件状态的 ID |
| `visibility` | string | 是 | 事件的可见性："public" 或 "private" \(必需\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident` | object | 创建的事件对象 |

### `incidentio_incidents_show`

从 incident.io 根据其 ID 检索特定事件的详细信息。返回完整的事件详细信息，包括自定义字段和角色分配。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要检索的事件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident` | object | 详细的事件信息 |

### `incidentio_incidents_update`

更新 incident.io 中的现有事件。可以更新名称、摘要、严重性、状态或类型。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要更新的事件 ID |
| `name` | string | 否 | 更新后的事件名称 |
| `summary` | string | 否 | 更新后的事件摘要 |
| `severity_id` | string | 否 | 更新后的事件严重性 ID |
| `incident_status_id` | string | 否 | 更新后的事件状态 ID |
| `incident_type_id` | string | 否 | 更新后的事件类型 ID |
| `notify_incident_channel` | boolean | 是 | 是否通知事件频道关于此更新 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident` | object | 更新后的事件对象 |

### `incidentio_actions_list`

从 incident.io 列出操作。可选择按事件 ID 进行筛选。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `incident_id` | string | 否 | 按事件 ID 筛选操作 |
| `page_size` | number | 否 | 每页返回的操作数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `actions` | array | 操作列表 |

### `incidentio_actions_show`

从 incident.io 获取有关特定操作的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 操作 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `action` | object | 操作详情 |

### `incidentio_follow_ups_list`

从 incident.io 列出后续操作。可选择按事件 ID 进行筛选。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `incident_id` | string | 否 | 按事件 ID 筛选后续操作 |
| `page_size` | number | 否 | 每页返回的后续操作数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `follow_ups` | 数组 | 跟进列表 |

### `incidentio_follow_ups_show`

获取有关 incident.io 中特定跟进的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | incident.io API 密钥 |
| `id` | 字符串 | 是 | 跟进 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `follow_up` | 对象 | 跟进详情 |

### `incidentio_users_list`

列出 Incident.io 工作区中的所有用户。返回的用户详细信息包括 ID、姓名、电子邮件和角色。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | Incident.io API 密钥 |
| `page_size` | 数字 | 否 | 每页返回的结果数量 \(默认值: 25\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `users` | 数组 | 工作区中的用户列表 |

### `incidentio_users_show`

通过用户 ID 获取 Incident.io 工作区中特定用户的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | Incident.io API 密钥 |
| `id` | 字符串 | 是 | 要检索的用户的唯一标识符 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 请求用户的详细信息 |

### `incidentio_workflows_list`

列出 incident.io 工作区中的所有工作流。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `page_size` | number | 否 | 每页返回的工作流数量 |
| `after` | string | 否 | 用于获取下一页结果的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `workflows` | array | 工作流列表 |

### `incidentio_workflows_show`

获取 incident.io 中特定工作流的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要检索的工作流 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `workflow` | object | 工作流详细信息 |

### `incidentio_workflows_update`

更新 incident.io 中的现有工作流。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要更新的工作流 ID |
| `name` | string | 否 | 工作流的新名称 |
| `state` | string | 否 | 工作流的新状态 \(active, draft, 或 disabled\) |
| `folder` | string | 否 | 工作流的新文件夹 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `workflow` | object | 更新后的工作流 |

### `incidentio_workflows_delete`

删除 incident.io 中的一个工作流。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要删除的工作流的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `incidentio_schedules_list`

列出 incident.io 中的所有日程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `page_size` | number | 否 | 每页结果数量 \(默认值: 25\) |
| `after` | string | 否 | 用于获取下一页结果的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `schedules` | array | 日程列表 |

### `incidentio_schedules_create`

在 incident.io 中创建一个新日程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `name` | string | 是 | 日程名称 |
| `timezone` | string | 是 | 日程的时区 \(例如: America/New_York\) |
| `config` | string | 是 | 以 JSON 字符串形式表示的日程配置，包括轮换。例如: \{"rotations": \[\{"name": "Primary", "users": \[\{"id": "user_id"\}\], "handover_start_at": "2024-01-01T09:00:00Z", "handovers": \[\{"interval": 1, "interval_type": "weekly"\}\]\}\]\} |
| `Example` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `schedule` | object | 创建的日程 |

### `incidentio_schedules_show`

获取 incident.io 中特定日程的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 日程的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `schedule` | object | 日程详情 |

### `incidentio_schedules_update`

更新 incident.io 中的现有日程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要更新的日程 ID |
| `name` | string | 否 | 日程的新名称 |
| `timezone` | string | 否 | 日程的新时区 \(例如: America/New_York\) |
| `config` | string | 否 | 以 JSON 字符串形式表示的日程配置，包括轮换。例如: \{"rotations": \[\{"name": "Primary", "users": \[\{"id": "user_id"\}\], "handover_start_at": "2024-01-01T09:00:00Z", "handovers": \[\{"interval": 1, "interval_type": "weekly"\}\]\}\]\} |
| `Example` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `schedule` | object | 更新后的日程 |

### `incidentio_schedules_delete`

删除 incident.io 中的日程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要删除的日程 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `incidentio_escalations_list`

列出 incident.io 中的所有升级策略

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `page_size` | number | 否 | 每页结果数量 \(默认值: 25\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `escalations` | array | 升级策略列表 |

### `incidentio_escalations_create`

在 incident.io 中创建一个新的升级策略

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `idempotency_key` | string | 是 | 用于防止重复创建升级的唯一标识符。使用 UUID 或唯一字符串。 |
| `title` | string | 是 | 升级的标题 |
| `escalation_path_id` | string | 否 | 要使用的升级路径的 ID \(如果未提供 user_ids，则必需\) |
| `user_ids` | string | 否 | 要通知的用户 ID 的逗号分隔列表 \(如果未提供 escalation_path_id，则必需\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `escalation` | object | 创建的升级策略 |

### `incidentio_escalations_show`

获取 incident.io 中特定升级策略的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 升级策略的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `escalation` | object | 升级策略详情 |

### `incidentio_custom_fields_list`

列出 incident.io 中的所有自定义字段。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `custom_fields` | array | 自定义字段列表 |

### `incidentio_custom_fields_create`

在 incident.io 中创建一个新的自定义字段。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `name` | string | 是 | 自定义字段的名称 |
| `description` | string | 是 | 自定义字段的描述 \(必需\) |
| `field_type` | string | 是 | 自定义字段的类型 \(例如，text, single_select, multi_select, numeric, datetime, link, user, team\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `custom_field` | object | 已创建的自定义字段 |

### `incidentio_custom_fields_show`

获取有关 incident.io 中特定自定义字段的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 自定义字段 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `custom_field` | object | 自定义字段详情 |

### `incidentio_custom_fields_update`

更新 incident.io 中现有的自定义字段。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 自定义字段 ID |
| `name` | string | 是 | 自定义字段的新名称（必填） |
| `description` | string | 是 | 自定义字段的新描述（必填） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `custom_field` | object | 更新后的自定义字段 |

### `incidentio_custom_fields_delete`

从 incident.io 中删除自定义字段。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 自定义字段 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `incidentio_severities_list`

列出在您的 Incident.io 工作区中配置的所有严重性级别。返回的严重性详细信息包括 id、名称、描述和排名。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Incident.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `severities` | array | 严重性级别列表 |

### `incidentio_incident_statuses_list`

列出在您的 Incident.io 工作区中配置的所有事件状态。返回的状态详细信息包括 id、名称、描述和类别。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Incident.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_statuses` | array | 事件状态列表 |

### `incidentio_incident_types_list`

列出在您的 Incident.io 工作区中配置的所有事件类型。返回的类型详细信息包括 id、名称、描述和默认标志。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Incident.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_types` | array | 事件类型列表 |

### `incidentio_incident_roles_list`

列出 Incident.io 中的所有事件角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Incident.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_roles` | 数组 | 事件角色列表 |

### `incidentio_incident_roles_create`

在 incident.io 中创建一个新的事件角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | incident.io API 密钥 |
| `name` | 字符串 | 是 | 事件角色的名称 |
| `description` | 字符串 | 是 | 事件角色的描述 |
| `instructions` | 字符串 | 是 | 事件角色的指令 |
| `shortform` | 字符串 | 是 | 角色的缩写 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_role` | 对象 | 创建的事件角色 |

### `incidentio_incident_roles_show`

获取 incident.io 中特定事件角色的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | incident.io API 密钥 |
| `id` | 字符串 | 是 | 事件角色的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_role` | 对象 | 事件角色的详细信息 |

### `incidentio_incident_roles_update`

更新 incident.io 中的现有事件角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | incident.io API 密钥 |
| `id` | 字符串 | 是 | 要更新的事件角色的 ID |
| `name` | 字符串 | 是 | 事件角色的名称 |
| `description` | 字符串 | 是 | 事件角色的描述 |
| `instructions` | 字符串 | 是 | 事件角色的指令 |
| `shortform` | 字符串 | 是 | 角色的缩写 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_role` | object | 更新的事件角色 |

### `incidentio_incident_roles_delete`

删除 incident.io 中的事件角色

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要删除的事件角色的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

### `incidentio_incident_timestamps_list`

列出 incident.io 中所有事件时间戳定义

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_timestamps` | array | 事件时间戳定义列表 |

### `incidentio_incident_timestamps_show`

获取 incident.io 中特定事件时间戳定义的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 事件时间戳的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_timestamp` | object | 事件时间戳详细信息 |

### `incidentio_incident_updates_list`

列出 incident.io 中特定事件的所有更新

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `incident_id` | string | 否 | 要获取更新的事件 ID（可选 - 如果未提供，将返回所有更新） |
| `page_size` | number | 否 | 每页返回的结果数量 |
| `after` | string | 否 | 分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `incident_updates` | array | 事件更新列表 |

### `incidentio_schedule_entries_list`

列出 incident.io 中特定日程的所有条目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `schedule_id` | string | 是 | 要获取条目的日程 ID |
| `entry_window_start` | string | 否 | 用于筛选条目的开始日期/时间（ISO 8601 格式） |
| `entry_window_end` | string | 否 | 用于筛选条目的结束日期/时间（ISO 8601 格式） |
| `page_size` | number | 否 | 每页返回的结果数量 |
| `after` | string | 否 | 分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `schedule_entries` | array | 日程条目列表 |

### `incidentio_schedule_overrides_create`

在 incident.io 中创建一个新的日程覆盖

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `rotation_id` | string | 是 | 要覆盖的轮换 ID |
| `schedule_id` | string | 是 | 日程 ID |
| `user_id` | string | 否 | 要分配的用户 ID（提供以下之一：user_id、user_email 或 user_slack_id）|
| `user_email` | string | 否 | 要分配的用户邮箱（提供以下之一：user_id、user_email 或 user_slack_id）|
| `user_slack_id` | string | 否 | 要分配的用户 Slack ID（提供以下之一：user_id、user_email 或 user_slack_id）|
| `start_at` | string | 是 | 覆盖开始时间（ISO 8601 格式）|
| `end_at` | string | 是 | 覆盖结束时间（ISO 8601 格式）|

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `override` | object | 创建的日程覆盖 |

### `incidentio_escalation_paths_create`

在 incident.io 中创建一个新的升级路径

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `name` | string | 是 | 升级路径名称 |
| `path` | json | 是 | 包含目标和确认时间（以秒为单位）的升级级别数组。每个级别应包含：targets（\{id, type, schedule_id?, user_id?, urgency\} 的数组）和 time_to_ack_seconds（数字）|
| `working_hours` | json | 否 | 可选的工作时间配置。\{weekday, start_time, end_time\} 的数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `escalation_path` | object | 创建的升级路径 |

### `incidentio_escalation_paths_show`

获取 incident.io 中特定升级路径的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 升级路径的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `escalation_path` | object | 升级路径详细信息 |

### `incidentio_escalation_paths_update`

更新 incident.io 中现有的升级路径

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要更新的升级路径的 ID |
| `name` | string | 否 | 升级路径的新名称 |
| `path` | json | 否 | 新的升级路径配置。包含目标和 time_to_ack_seconds 的升级级别数组 |
| `working_hours` | json | 否 | 新的工作时间配置。包含 \{weekday, start_time, end_time\} 的数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `escalation_path` | object | 更新后的升级路径 |

### `incidentio_escalation_paths_delete`

删除 incident.io 中的升级路径

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | incident.io API 密钥 |
| `id` | string | 是 | 要删除的升级路径的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功消息 |

## 注意事项

- 类别: `tools`
- 类型: `incidentio`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/index.mdx

```text
---
title: 概览
description: 强大的工具，助力提升您的代理工作流程
---

import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Video } from '@/components/ui/video';

工具是 Sim 中的强大组件，能够让您的工作流程与外部服务交互、处理数据并执行专业任务。通过提供对各种 API 和服务的访问，它们扩展了您的代理和工作流程的能力。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="toolbar.mp4" width={700} height={450} />
</div>

## 什么是工具？

工具是提供特定功能或与外部服务集成的专用组件。工具可以用于搜索网络、与数据库交互、处理图像、生成文本或图像、通过消息平台进行通信等。

## 在工作流中使用工具

在 Sim 工作流中使用工具主要有两种方式：

<Steps>
  <Step>
    <strong>作为独立模块</strong>：当您需要确定性地直接访问工具的功能时，可以将工具作为单独的模块添加到画布上。这使您可以精确控制工具的调用时间和方式。
  </Step>
  <Step>
    <strong>作为代理工具</strong>：可以通过点击“添加工具”并配置所需参数，将工具添加到代理模块中。这允许代理根据任务的上下文和需求动态选择使用哪些工具。
  </Step>
</Steps>

## 工具配置

每个工具都需要特定的配置才能正常运行。常见的配置元素包括：

- **API 密钥**：许多工具需要通过 API 密钥进行身份验证
- **连接参数**：端点、数据库标识符等
- **输入格式**：数据应如何为工具进行结构化
- **输出处理**：如何处理工具的结果

## 可用工具

Sim 提供了多种用途的工具，包括：

- **人工智能和语言处理**：OpenAI、ElevenLabs、翻译服务
- **搜索与研究**：Google 搜索、Tavily、Exa、Perplexity
- **文档操作**：Google 文档、Google 表格、Notion、Confluence
- **媒体处理**：Vision、图像生成器
- **通信**：Slack、WhatsApp、Twilio SMS、Gmail
- **数据存储**：Pinecone、Supabase、Airtable
- **开发**：GitHub

每个工具都有其专属的文档页面，其中包含有关配置和使用的详细说明。

## 工具输出

工具通常返回结构化数据，这些数据可以由工作流中的后续模块处理。数据的格式因工具和操作而异，但通常包括：

- 主要内容或结果
- 有关操作的元数据
- 状态信息

请参阅每个工具的具体文档以了解其确切的输出格式。
```

--------------------------------------------------------------------------------

---[FILE: intercom.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/intercom.mdx

```text
---
title: Intercom
description: 在 Intercom 中管理联系人、公司、对话、工单和消息
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="intercom"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Intercom](https://www.intercom.com/) 是一个领先的客户沟通平台，能够让您在一个地方管理和自动化与联系人、公司、对话、工单和消息的互动。Sim 中的 Intercom 集成让您的代理可以通过自动化工作流以编程方式管理客户关系、支持请求和对话。

使用 Intercom 工具，您可以：

- **联系人管理：** 创建、获取、更新、列出、搜索和删除联系人——自动化您的 CRM 流程并保持客户记录的最新。
- **公司管理：** 创建新公司、检索公司详细信息，并列出与您的用户或业务客户相关的所有公司。
- **对话处理：** 获取、列出、回复和搜索对话——让代理能够跟踪正在进行的支持线程、提供答案并自动执行后续操作。
- **工单管理：** 以编程方式创建和检索工单，帮助您自动化客户服务、支持问题跟踪和工作流升级。
- **发送消息：** 向用户或潜在客户触发消息，用于入职、支持或营销，所有这些都可以在您的工作流自动化中完成。

通过将 Intercom 工具集成到 Sim 中，您可以让工作流直接与用户沟通，自动化客户支持流程，管理潜在客户，并大规模简化沟通。无论您是需要创建新联系人、保持客户数据同步、管理支持工单，还是发送个性化的参与消息，Intercom 工具都提供了一种全面的方式，将客户互动管理作为智能自动化的一部分。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Intercom 集成到工作流中。可以创建、获取、更新、列出、搜索和删除联系人；创建、获取和列出公司；获取、列出、回复和搜索对话；创建和获取工单；以及创建消息。

## 工具

### `intercom_create_contact`

使用 email、external_id 或 role 在 Intercom 中创建一个新联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 否 | 联系人的电子邮件地址 |
| `external_id` | string | 否 | 客户提供的联系人的唯一标识符 |
| `phone` | string | 否 | 联系人的电话号码 |
| `name` | string | 否 | 联系人的姓名 |
| `avatar` | string | 否 | 联系人的头像图片 URL |
| `signed_up_at` | number | 否 | 用户注册时间（Unix 时间戳） |
| `last_seen_at` | number | 否 | 用户上次访问时间（Unix 时间戳） |
| `owner_id` | string | 否 | 被分配为联系人账户所有者的管理员 ID |
| `unsubscribed_from_emails` | boolean | 否 | 联系人是否取消订阅电子邮件 |
| `custom_attributes` | string | 否 | 自定义属性，格式为 JSON 对象 \(例如，\{"attribute_name": "value"\}\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的联系人数据 |

### `intercom_get_contact`

通过 ID 从 Intercom 获取单个联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | 是 | 要检索的联系人 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 联系人数据 |

### `intercom_update_contact`

更新 Intercom 中的现有联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | 是 | 要更新的联系人 ID |
| `email` | string | 否 | 联系人的电子邮件地址 |
| `phone` | string | 否 | 联系人的电话号码 |
| `name` | string | 否 | 联系人的姓名 |
| `avatar` | string | 否 | 联系人的头像图片 URL |
| `signed_up_at` | number | 否 | 用户注册时间（Unix 时间戳） |
| `last_seen_at` | number | 否 | 用户上次访问时间（Unix 时间戳） |
| `owner_id` | string | 否 | 分配了账户所有权的管理员 ID |
| `unsubscribed_from_emails` | boolean | 否 | 联系人是否取消订阅电子邮件 |
| `custom_attributes` | string | 否 | 自定义属性，格式为 JSON 对象 \(例如：\{"attribute_name": "value"\}\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新后的联系人数据 |

### `intercom_list_contacts`

列出所有来自 Intercom 的联系人，支持分页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | 否 | 每页结果数量 \(最大值: 150\) |
| `starting_after` | string | 否 | 分页游标 - 起始 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 联系人列表 |

### `intercom_search_contacts`

使用查询在 Intercom 中搜索联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 搜索查询 \(例如, \{"field":"email","operator":"=","value":"user@example.com"\}\) |
| `per_page` | number | 否 | 每页结果数量 \(最大值: 150\) |
| `starting_after` | string | 否 | 分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 搜索结果 |

### `intercom_delete_contact`

通过 ID 从 Intercom 中删除联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | 是 | 要删除的联系人 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 删除结果 |

### `intercom_create_company`

在 Intercom 中创建或更新公司

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `company_id` | string | 是 | 您的公司唯一标识符 |
| `name` | string | 否 | 公司的名称 |
| `website` | string | 否 | 公司网站 |
| `plan` | string | 否 | 公司计划名称 |
| `size` | number | 否 | 公司员工数量 |
| `industry` | string | 否 | 公司所属行业 |
| `monthly_spend` | number | 否 | 公司为您的业务创造的收入。注意：此字段会将浮点数截断为整数（例如，155.98 会变为 155） |
| `custom_attributes` | string | 否 | 作为 JSON 对象的自定义属性 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建或更新的公司数据 |

### `intercom_get_company`

通过 ID 从 Intercom 检索单个公司

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | 是 | 要检索的公司 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 公司数据 |

### `intercom_list_companies`

列出来自 Intercom 的所有公司，支持分页。注意：此端点限制为通过分页返回最多 10,000 家公司。对于超过 10,000 家公司的数据集，请改用 Scroll API。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `per_page` | 数字 | 否 | 每页结果数量 |
| `page` | 数字 | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 操作成功状态 |
| `output` | 对象 | 公司列表 |

### `intercom_get_conversation`

通过 ID 从 Intercom 检索单个会话

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | 字符串 | 是 | 要检索的会话 ID |
| `display_as` | 字符串 | 否 | 设置为 "plaintext" 以检索纯文本消息 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 操作成功状态 |
| `output` | 对象 | 会话数据 |

### `intercom_list_conversations`

列出 Intercom 中的所有会话，并支持分页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `per_page` | 数字 | 否 | 每页结果数量 \(最大值: 150\) |
| `starting_after` | 字符串 | 否 | 分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 操作成功状态 |
| `output` | 对象 | 会话列表 |

### `intercom_reply_conversation`

以管理员身份在 Intercom 中回复对话

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | 是 | 要回复的会话 ID |
| `message_type` | string | 是 | 消息类型："comment" 或 "note" |
| `body` | string | 是 | 回复的正文文本 |
| `admin_id` | string | 否 | 撰写回复的管理员 ID。如果未提供，将使用默认管理员（Operator/Fin）。 |
| `attachment_urls` | string | 否 | 逗号分隔的图片 URL 列表（最多 10 个） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 包含回复的更新对话 |

### `intercom_search_conversations`

使用查询在 Intercom 中搜索对话

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 作为 JSON 对象的搜索查询 |
| `per_page` | number | 否 | 每页结果数量（最大值：150） |
| `starting_after` | string | 否 | 用于分页的游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 搜索结果 |

### `intercom_create_ticket`

在 Intercom 中创建新工单

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `ticket_type_id` | string | 是 | 工单类型的 ID |
| `contacts` | string | 是 | 联系人标识符的 JSON 数组（例如，\[\{"id": "contact_id"\}\]） |
| `ticket_attributes` | string | 是 | 包含工单属性的 JSON 对象，包括 _default_title_ 和 _default_description_ |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的工单数据 |

### `intercom_get_ticket`

从 Intercom 按 ID 检索单个工单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `ticketId` | string | 是 | 要检索的工单 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 工单数据 |

### `intercom_create_message`

在 Intercom 中创建并发送新的管理员发起的消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `message_type` | string | 是 | 消息类型："inapp" 或 "email" |
| `subject` | string | 否 | 消息主题（针对 email 类型） |
| `body` | string | 是 | 消息正文 |
| `from_type` | string | 是 | 发送者类型："admin" |
| `from_id` | string | 是 | 发送消息的管理员 ID |
| `to_type` | string | 是 | 接收者类型："contact" |
| `to_id` | string | 是 | 接收消息的联系人的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的消息数据 |

## 注意事项

- 类别：`tools`
- 类型：`intercom`
```

--------------------------------------------------------------------------------

---[FILE: jina.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/jina.mdx

```text
---
title: Jina
description: 搜索网络或从 URL 中提取内容
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jina"
  color="#333333"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jina AI](https://jina.ai/) 是一款强大的内容提取工具，可与 Sim 无缝集成，将网页内容转换为简洁、可读的文本。此集成使开发者能够轻松将网页内容处理功能融入其代理工作流中。

Jina AI Reader 专注于从网页中提取最相关的内容，去除杂乱、广告和格式问题，生成简洁、结构化的文本，优化语言模型和其他文本处理任务。

通过在 Sim 中集成 Jina AI，您可以：

- **从任何网页提取简洁内容**，只需提供一个 URL
- **将复杂的网页布局** 转换为结构化、可读的文本
- **保留重要的上下文**，同时去除不必要的元素
- **为您的代理工作流** 准备网页内容以供进一步处理
- **简化研究任务**，快速将网页信息转换为可用数据

此集成对于构建需要从网页收集和处理信息、进行研究或分析在线内容的代理特别有价值。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Jina AI 集成到工作流程中。搜索网络并获取适合 LLM 的结果，或使用高级解析选项从特定 URL 中提取干净的内容。

## 工具

### `jina_read_url`

使用 Jina AI Reader 提取和处理网页内容，生成简洁、适合 LLM 的文本。支持高级内容解析、链接收集和多种输出格式，并提供可配置的处理选项。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | string | 是 | 要读取并转换为 markdown 的 URL |
| `useReaderLMv2` | boolean | 否 | 是否使用 ReaderLM-v2 以获得更高质量（3 倍 token 成本） |
| `gatherLinks` | boolean | 否 | 是否在末尾收集所有链接 |
| `jsonResponse` | boolean | 否 | 是否以 JSON 格式返回响应 |
| `apiKey` | string | 是 | 您的 Jina AI API 密钥 |
| `withImagesummary` | boolean | 否 | 从页面收集所有带有元数据的图像 |
| `retainImages` | string | 否 | 控制图像包含："none" 删除所有，"all" 保留所有 |
| `returnFormat` | string | 否 | 输出格式：markdown、html、text、screenshot 或 pageshot |
| `withIframe` | boolean | 否 | 在提取中包含 iframe 内容 |
| `withShadowDom` | boolean | 否 | 提取 Shadow DOM 内容 |
| `noCache` | boolean | 否 | 绕过缓存内容以实时检索 |
| `withGeneratedAlt` | boolean | 否 | 使用 VLM 为图像生成替代文本 |
| `robotsTxt` | string | 否 | 用于 robots.txt 检查的 Bot User-Agent |
| `dnt` | boolean | 否 | 请勿跟踪 - 防止缓存/跟踪 |
| `noGfm` | boolean | 否 | 禁用 GitHub Flavored Markdown |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | 字符串 | 从 URL 提取的内容，处理为干净且适合 LLM 的文本 |
| `links` | 数组 | 页面中找到的链接列表（当启用 gatherLinks 或 withLinksummary 时） |
| `images` | 数组 | 页面中找到的图片列表（当启用 withImagesummary 时） |

### `jina_search`

搜索网络并返回前 5 个包含适合 LLM 的内容的结果。每个结果都会通过 Jina Reader API 自动处理。支持地理过滤、站点限制和分页功能。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `q` | string | 是 | 搜索查询字符串 |
| `apiKey` | string | 是 | 您的 Jina AI API 密钥 |
| `num` | number | 否 | 每页最大结果数（默认值：5） |
| `site` | string | 否 | 将结果限制为特定域名。可以用逗号分隔多个站点（例如："jina.ai,github.com"） |
| `withFavicon` | boolean | 否 | 在结果中包含网站图标 |
| `withImagesummary` | boolean | 否 | 从结果页面收集所有带有元数据的图像 |
| `withLinksummary` | boolean | 否 | 从结果页面收集所有链接 |
| `retainImages` | string | 否 | 控制图像包含："none" 删除所有，"all" 保留所有 |
| `noCache` | boolean | 否 | 绕过缓存内容以实时检索 |
| `withGeneratedAlt` | boolean | 否 | 使用 VLM 为图像生成替代文本 |
| `respondWith` | string | 否 | 设置为 "no-content" 以仅获取元数据而不包含页面内容 |
| `returnFormat` | string | 否 | 输出格式：markdown、html、text、screenshot 或 pageshot |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | 数组 | 搜索结果的数组，每个结果包含标题、描述、URL 和适合 LLM 的内容 |

## 注意事项

- 类别：`tools`
- 类型：`jina`
```

--------------------------------------------------------------------------------

````

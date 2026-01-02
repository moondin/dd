---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 230
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 230 of 933)

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

---[FILE: grafana.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/grafana.mdx

```text
---
title: Grafana
description: 与 Grafana 仪表板、警报和注释交互
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="grafana"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Grafana](https://grafana.com/) 是一个领先的开源平台，用于监控、可观测性和可视化。它允许用户从各种数据源查询、可视化、警报和分析数据，是基础设施和应用程序监控的重要工具。

使用 Grafana，您可以：

- **可视化数据**：构建和自定义仪表板，以实时显示指标、日志和跟踪
- **监控健康和状态**：检查 Grafana 实例和连接的数据源的健康状况
- **管理警报和注释**：设置警报规则，管理通知，并使用重要事件注释仪表板
- **组织内容**：将仪表板和数据源组织到文件夹中，以便更好地进行访问管理

在 Sim 中，Grafana 集成使您的代理能够通过 API 直接与您的 Grafana 实例交互，实现以下操作：

- 检查 Grafana 服务器、数据库和数据源的健康状态
- 检索、列出和管理仪表板、警报规则、注释、数据源和文件夹
- 通过将 Grafana 数据和警报集成到您的工作流自动化中，实现基础设施监控的自动化

这些功能使 Sim 代理能够监控系统，主动响应警报，并帮助确保服务的可靠性和可见性——所有这些都作为您自动化工作流的一部分。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Grafana 集成到工作流中。管理仪表板、警报、注释、数据源、文件夹，并监控健康状态。

## 工具

### `grafana_get_dashboard`

通过其 UID 获取仪表板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `dashboardUid` | string | 是 | 要检索的仪表板的 UID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `dashboard` | json | 完整的仪表板 JSON 对象 |
| `meta` | json | 仪表板元数据（版本、权限等） |

### `grafana_list_dashboards`

搜索并列出所有仪表板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL（例如：https://your-grafana.com） |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `query` | string | 否 | 按标题过滤仪表板的搜索查询 |
| `tag` | string | 否 | 按标签过滤（多个标签用逗号分隔） |
| `folderIds` | string | 否 | 按文件夹 ID 过滤（用逗号分隔） |
| `starred` | boolean | 否 | 仅返回加星标的仪表板 |
| `limit` | number | 否 | 返回的仪表板最大数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `dashboards` | array | 仪表板搜索结果列表 |

### `grafana_create_dashboard`

创建新仪表板

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL（例如：https://your-grafana.com） |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `title` | string | 是 | 新仪表板的标题 |
| `folderUid` | string | 否 | 创建仪表板的文件夹 UID |
| `tags` | string | 否 | 逗号分隔的标签列表 |
| `timezone` | string | 否 | 仪表板时区（例如：browser, utc） |
| `refresh` | string | 否 | 自动刷新间隔（例如：5s, 1m, 5m） |
| `panels` | string | 否 | 面板配置的 JSON 数组 |
| `overwrite` | boolean | 否 | 覆盖具有相同标题的现有仪表板 |
| `message` | string | 否 | 仪表板版本的提交消息 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | number | 创建的仪表板的数字 ID |
| `uid` | string | 创建的仪表板的 UID |
| `url` | string | 仪表板的 URL 路径 |
| `status` | string | 操作状态 \(成功\) |
| `version` | number | 仪表板的版本号 |
| `slug` | string | 仪表板的 URL 友好型 slug |

### `grafana_update_dashboard`

更新现有的仪表板。获取当前仪表板并合并您的更改。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `dashboardUid` | string | 是 | 要更新的仪表板的 UID |
| `title` | string | 否 | 仪表板的新标题 |
| `folderUid` | string | 否 | 要移动仪表板的新文件夹 UID |
| `tags` | string | 否 | 新标签的逗号分隔列表 |
| `timezone` | string | 否 | 仪表板时区 \(例如：browser, utc\) |
| `refresh` | string | 否 | 自动刷新间隔 \(例如：5s, 1m, 5m\) |
| `panels` | string | 否 | 面板配置的 JSON 数组 |
| `overwrite` | boolean | 否 | 即使存在版本冲突也覆盖 |
| `message` | string | 否 | 此版本的提交消息 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | number | 更新后的仪表盘的数字 ID |
| `uid` | string | 更新后的仪表盘的 UID |
| `url` | string | 仪表盘的 URL 路径 |
| `status` | string | 操作状态 \(成功\) |
| `version` | number | 仪表盘的新版本号 |
| `slug` | string | 仪表盘的 URL 友好型 slug |

### `grafana_delete_dashboard`

通过其 UID 删除仪表盘

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `dashboardUid` | string | 是 | 要删除的仪表盘的 UID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `title` | string | 已删除仪表盘的标题 |
| `message` | string | 确认消息 |
| `id` | number | 已删除仪表盘的 ID |

### `grafana_list_alert_rules`

列出 Grafana 实例中的所有警报规则

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `rules` | 数组 | 警报规则列表 |

### `grafana_get_alert_rule`

通过其 UID 获取特定的警报规则

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | Grafana 服务账户令牌 |
| `baseUrl` | 字符串 | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | 字符串 | 否 | 多组织 Grafana 实例的组织 ID |
| `alertRuleUid` | 字符串 | 是 | 要检索的警报规则的 UID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `uid` | 字符串 | 警报规则 UID |
| `title` | 字符串 | 警报规则标题 |
| `condition` | 字符串 | 警报条件 |
| `data` | JSON | 警报规则查询数据 |
| `folderUID` | 字符串 | 父文件夹 UID |
| `ruleGroup` | 字符串 | 规则组名称 |
| `noDataState` | 字符串 | 无数据返回时的状态 |
| `execErrState` | 字符串 | 执行错误时的状态 |
| `annotations` | JSON | 警报注释 |
| `labels` | JSON | 警报标签 |

### `grafana_create_alert_rule`

创建新的警报规则

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | 字符串 | 是 | Grafana 服务账户令牌 |
| `baseUrl` | 字符串 | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | 字符串 | 否 | 多组织 Grafana 实例的组织 ID |
| `title` | 字符串 | 是 | 警报规则的标题 |
| `folderUid` | 字符串 | 是 | 创建警报的文件夹 UID |
| `ruleGroup` | 字符串 | 是 | 规则组名称 |
| `condition` | 字符串 | 是 | 用作警报条件的查询或表达式的 refId |
| `data` | 字符串 | 是 | 查询/表达式数据对象的 JSON 数组 |
| `forDuration` | 字符串 | 否 | 触发前的等待时间 \(例如：5m, 1h\) |
| `noDataState` | 字符串 | 否 | 无数据返回时的状态 \(NoData, Alerting, OK\) |
| `execErrState` | 字符串 | 否 | 执行错误时的状态 \(Alerting, OK\) |
| `annotations` | 字符串 | 否 | 注释的 JSON 对象 |
| `labels` | 字符串 | 否 | 标签的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `uid` | string | 创建的警报规则的 UID |
| `title` | string | 警报规则标题 |
| `folderUID` | string | 父文件夹 UID |
| `ruleGroup` | string | 规则组名称 |

### `grafana_update_alert_rule`

更新现有的警报规则。获取当前规则并合并您的更改。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `alertRuleUid` | string | 是 | 要更新的警报规则的 UID |
| `title` | string | 否 | 警报规则的新标题 |
| `folderUid` | string | 否 | 移动警报到的新文件夹 UID |
| `ruleGroup` | string | 否 | 新规则组名称 |
| `condition` | string | 否 | 新条件 refId |
| `data` | string | 否 | 查询/表达式数据对象的新 JSON 数组 |
| `forDuration` | string | 否 | 触发前的等待时长 \(例如：5m, 1h\) |
| `noDataState` | string | 否 | 无数据返回时的状态 \(NoData, Alerting, OK\) |
| `execErrState` | string | 否 | 执行错误时的状态 \(Alerting, OK\) |
| `annotations` | string | 否 | 注释的 JSON 对象 |
| `labels` | string | 否 | 标签的 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `uid` | string | 更新的警报规则的 UID |
| `title` | string | 警报规则标题 |
| `folderUID` | string | 父文件夹 UID |
| `ruleGroup` | string | 规则组名称 |

### `grafana_delete_alert_rule`

通过其 UID 删除警报规则

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `alertRuleUid` | string | 是 | 要删除的警报规则的 UID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 确认消息 |

### `grafana_list_contact_points`

列出所有警报通知联系点

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contactPoints` | array | 联系点列表 |

### `grafana_create_annotation`

在仪表板上或作为全局注释创建注释

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `text` | string | 是 | 注释的文本内容 |
| `tags` | string | 否 | 逗号分隔的标签列表 |
| `dashboardUid` | string | 是 | 要添加注释的仪表板 UID |
| `panelId` | number | 否 | 要添加注释的面板 ID |
| `time` | number | 否 | 开始时间（以纪元毫秒为单位，默认为当前时间） |
| `timeEnd` | number | 否 | 结束时间（以纪元毫秒为单位，用于范围注释） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | number | 创建的注释的 ID |
| `message` | string | 确认消息 |

### `grafana_list_annotations`

按时间范围、仪表板或标签查询注释

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `from` | number | 否 | 开始时间（以纪元毫秒为单位） |
| `to` | number | 否 | 结束时间（以纪元毫秒为单位） |
| `dashboardUid` | string | 是 | 要查询注释的仪表板 UID |
| `panelId` | number | 否 | 按面板 ID 过滤 |
| `tags` | string | 否 | 按标签过滤（逗号分隔） |
| `type` | string | 否 | 按类型过滤 \(alert 或 annotation\) |
| `limit` | number | 否 | 返回的注释最大数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `annotations` | array | 注释列表 |

### `grafana_update_annotation`

更新现有注释

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `annotationId` | number | 是 | 要更新的注释 ID |
| `text` | string | 是 | 注释的新文本内容 |
| `tags` | string | 否 | 以逗号分隔的新标签列表 |
| `time` | number | 否 | 新的开始时间（以纪元毫秒为单位） |
| `timeEnd` | number | 否 | 新的结束时间（以纪元毫秒为单位） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | number | 更新后的注释 ID |
| `message` | string | 确认消息 |

### `grafana_delete_annotation`

通过 ID 删除注释

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `annotationId` | number | 是 | 要删除的注释 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 确认消息 |

### `grafana_list_data_sources`

列出 Grafana 中配置的所有数据源

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `dataSources` | array | 数据源列表 |

### `grafana_get_data_source`

通过其 ID 或 UID 获取数据源

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `dataSourceId` | string | 是 | 要检索的数据源的 ID 或 UID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | number | 数据源 ID |
| `uid` | string | 数据源 UID |
| `name` | string | 数据源名称 |
| `type` | string | 数据源类型 |
| `url` | string | 数据源连接 URL |
| `database` | string | 数据库名称 \(如果适用\) |
| `isDefault` | boolean | 是否为默认数据源 |
| `jsonData` | json | 其他数据源配置 |

### `grafana_list_folders`

列出 Grafana 中的所有文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `limit` | number | 否 | 要返回的最大文件夹数量 |
| `page` | number | 否 | 分页的页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `folders` | array | 文件夹列表 |

### `grafana_create_folder`

在 Grafana 中创建一个新文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Grafana 服务账户令牌 |
| `baseUrl` | string | 是 | Grafana 实例 URL \(例如：https://your-grafana.com\) |
| `organizationId` | string | 否 | 多组织 Grafana 实例的组织 ID |
| `title` | string | 是 | 新文件夹的标题 |
| `uid` | string | 否 | 文件夹的可选 UID \(如果未提供，将自动生成\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | number | 创建文件夹的数字 ID |
| `uid` | string | 创建文件夹的 UID |
| `title` | string | 创建文件夹的标题 |
| `url` | string | 文件夹的 URL 路径 |
| `hasAcl` | boolean | 文件夹是否具有自定义 ACL 权限 |
| `canSave` | boolean | 当前用户是否可以保存文件夹 |
| `canEdit` | boolean | 当前用户是否可以编辑文件夹 |
| `canAdmin` | boolean | 当前用户是否对文件夹具有管理员权限 |
| `canDelete` | boolean | 当前用户是否可以删除文件夹 |
| `createdBy` | string | 创建文件夹的用户名 |
| `created` | string | 文件夹创建的时间戳 |
| `updatedBy` | string | 最后更新文件夹的用户名 |
| `updated` | string | 文件夹最后更新的时间戳 |
| `version` | number | 文件夹的版本号 |

## 注意事项

- 类别：`tools`
- 类型：`grafana`
```

--------------------------------------------------------------------------------

---[FILE: hubspot.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/hubspot.mdx

```text
---
title: HubSpot
description: 与 HubSpot CRM 互动或通过 HubSpot 事件触发工作流
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hubspot"
  color="#FF7A59"
/>

{/* MANUAL-CONTENT-START:intro */}
[HubSpot](https://www.hubspot.com) 是一个全面的 CRM 平台，提供完整的营销、销售和客户服务工具套件，帮助企业更好地发展。凭借强大的自动化功能和广泛的 API，HubSpot 已成为全球领先的 CRM 平台之一，为各行业的各种规模企业提供服务。

HubSpot CRM 提供了一个完整的解决方案，用于管理客户关系，从初次接触到长期客户成功。该平台将联系人管理、交易跟踪、营销自动化和客户服务工具整合到一个统一的系统中，帮助团队保持一致并专注于客户成功。

HubSpot CRM 的主要功能包括：

- 联系人和公司管理：全面的数据库，用于存储和组织客户及潜在客户信息
- 交易管道：可视化销售管道，用于通过可自定义的阶段跟踪机会
- 营销活动：跟踪和管理营销活动和事件，并提供详细的归因
- 工单管理：客户支持工单系统，用于跟踪和解决客户问题
- 报价和产品项：创建和管理包含详细产品项的销售报价
- 用户和团队管理：组织团队，分配所有权，并跟踪平台上的用户活动

在 Sim 中，HubSpot 集成使您的 AI 代理能够无缝地与您的 CRM 数据交互并自动化关键业务流程。这为智能潜在客户资格认证、自动化联系人丰富、交易管理、客户支持自动化以及技术堆栈中数据同步创造了强大的机会。该集成允许代理创建、检索、更新和搜索所有主要的 HubSpot 对象，从而实现能够响应 CRM 事件、维护数据质量并确保您的团队拥有最新客户信息的复杂工作流程。通过将 Sim 与 HubSpot 连接，您可以构建 AI 代理，自动资格认证潜在客户、分配支持工单、根据客户互动更新交易阶段、生成报价，并使您的 CRM 数据与其他业务系统保持同步——最终提高团队生产力并改善客户体验。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 HubSpot 集成到您的工作流程中。通过强大的自动化功能管理联系人、公司、交易、工单和其他 CRM 对象。可以在触发模式下使用，以在联系人被创建、删除或更新时启动工作流程。

## 工具

### `hubspot_get_users`

从 HubSpot 账户中检索所有用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | 否 | 返回结果的数量 \(默认值: 100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `users` | 数组 | HubSpot 用户对象的数组 |
| `metadata` | 对象 | 操作元数据 |
| `success` | 布尔值 | 操作成功状态 |

### `hubspot_list_contacts`

从 HubSpot 账户中检索所有联系人，支持分页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | 否 | 每页结果的最大数量（最大值 100，默认值 100） |
| `after` | string | 否 | 用于获取下一页结果的分页游标 |
| `properties` | string | 否 | 逗号分隔的属性列表（例如："email,firstname,lastname"） |
| `associations` | string | 否 | 逗号分隔的对象类型列表，用于检索关联的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contacts` | 数组 | HubSpot 联系人对象的数组 |
| `paging` | 对象 | 分页信息 |
| `metadata` | 对象 | 操作元数据 |
| `success` | 布尔值 | 操作成功状态 |

### `hubspot_get_contact`

通过 ID 或电子邮件从 HubSpot 检索单个联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | 是 | 要检索的联系人的 ID 或电子邮件 |
| `idProperty` | string | 否 | 用作唯一标识符的属性（例如："email"）。如果未指定，则使用记录 ID |
| `properties` | string | 否 | 逗号分隔的属性列表 |
| `associations` | string | 否 | 逗号分隔的对象类型列表，用于检索关联的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contact` | 对象 | 带有属性的 HubSpot 联系人对象 |
| `metadata` | 对象 | 操作元数据 |
| `success` | 布尔值 | 操作成功状态 |

### `hubspot_create_contact`

在 HubSpot 中创建一个新联系人。至少需要以下之一：email、firstname 或 lastname。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `properties` | object | 是 | 作为 JSON 对象的联系人属性。必须至少包含以下之一：email、firstname 或 lastname |
| `associations` | array | 否 | 要与联系人创建关联的数组（例如，公司、交易）。每个对象应包含 "to"（带有 "id"）和 "types"（带有 "associationCategory" 和 "associationTypeId"） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contact` | 对象 | 创建的 HubSpot 联系人对象 |
| `metadata` | 对象 | 操作元数据 |
| `success` | 布尔值 | 操作成功状态 |

### `hubspot_update_contact`

通过 ID 或 email 更新 HubSpot 中的现有联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | 是 | 要更新的联系人的 ID 或 email |
| `idProperty` | string | 否 | 用作唯一标识符的属性（例如，"email"）。如果未指定，则使用记录 ID |
| `properties` | object | 是 | 要更新的联系人属性，作为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contact` | 对象 | 更新的 HubSpot 联系人对象 |
| `metadata` | 对象 | 操作元数据 |
| `success` | 布尔值 | 操作成功状态 |

### `hubspot_search_contacts`

使用过滤器、排序和查询在 HubSpot 中搜索联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | 否 | 过滤组的数组。每个组包含具有 propertyName、operator 和 value 的过滤器 |
| `sorts` | array | 否 | 包含 propertyName 和 direction \("ASCENDING" 或 "DESCENDING"\) 的排序对象数组 |
| `query` | string | 否 | 搜索查询字符串 |
| `properties` | array | 否 | 要返回的属性名称数组 |
| `limit` | number | 否 | 要返回的最大结果数 \(最大 100\) |
| `after` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contacts` | 数组 | 匹配的 HubSpot 联系人对象的数组 |
| `total` | 数字 | 匹配的联系人总数 |
| `paging` | 对象 | 分页信息 |
| `metadata` | 对象 | 操作元数据 |
| `success` | 布尔值 | 操作成功状态 |

### `hubspot_list_companies`

检索 HubSpot 帐户中的所有公司，支持分页

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | 否 | 每页的最大结果数 \(最大 100，默认 100\) |
| `after` | string | 否 | 下一页结果的分页游标 |
| `properties` | string | 否 | 逗号分隔的要返回的属性列表 |
| `associations` | string | 否 | 逗号分隔的对象类型列表，用于检索关联的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `companies` | array | HubSpot 公司对象的数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `hubspot_get_company`

从 HubSpot 按 ID 或域名检索单个公司

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | 是 | 要检索的公司的 ID 或域名 |
| `idProperty` | string | 否 | 用作唯一标识符的属性 \(例如，"domain"\)。如果未指定，则使用记录 ID |
| `properties` | string | 否 | 要返回的属性的逗号分隔列表 |
| `associations` | string | 否 | 要检索关联 ID 的对象类型的逗号分隔列表 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `company` | object | 带有属性的 HubSpot 公司对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `hubspot_create_company`

在 HubSpot 中创建一个新公司

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `properties` | object | 是 | 作为 JSON 对象的公司属性 \(例如，名称、域名、城市、行业\) |
| `associations` | array | 否 | 要与公司创建关联的数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `company` | object | 创建的 HubSpot 公司对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `hubspot_update_company`

通过 ID 或域名更新 HubSpot 中的现有公司

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | 是 | 要更新的公司的 ID 或域名 |
| `idProperty` | string | 否 | 用作唯一标识符的属性 \(例如，"domain"\)。如果未指定，则使用记录 ID |
| `properties` | object | 是 | 要更新的公司属性，作为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `company` | object | 更新的 HubSpot 公司对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `hubspot_search_companies`

使用过滤器、排序和查询在 HubSpot 中搜索公司

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | 否 | 过滤组数组。每个组包含具有 propertyName、operator 和 value 的过滤器 |
| `sorts` | array | 否 | 包含 propertyName 和 direction \("ASCENDING" 或 "DESCENDING"\) 的排序对象数组 |
| `query` | string | 否 | 搜索查询字符串 |
| `properties` | array | 否 | 要返回的属性名称数组 |
| `limit` | number | 否 | 要返回的最大结果数 \(最多 100\) |
| `after` | string | 否 | 下一页的分页游标 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `companies` | array | 匹配的 HubSpot 公司对象的数组 |
| `total` | number | 匹配的公司总数 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `hubspot_list_deals`

通过分页支持从 HubSpot 账户中检索所有交易

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | 否 | 每页的最大结果数 \(最多 100，默认 100\) |
| `after` | string | 否 | 下一页结果的分页游标 |
| `properties` | string | 否 | 逗号分隔的要返回的属性列表 |
| `associations` | string | 否 | 逗号分隔的对象类型列表，用于检索关联的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deals` | array | HubSpot 交易对象的数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

## 注意事项

- 类别: `tools`
- 类型: `hubspot`
```

--------------------------------------------------------------------------------

---[FILE: huggingface.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/huggingface.mdx

```text
---
title: Hugging Face
description: 使用 Hugging Face 推理 API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="huggingface"
  color="#0B0F19"
/>

{/* MANUAL-CONTENT-START:intro */}
[HuggingFace](https://huggingface.co/) 是一个领先的 AI 平台，提供数千种预训练的机器学习模型和强大的推理能力。通过其广泛的模型库和强大的 API，HuggingFace 为研究和生产级 AI 应用提供了全面的工具。
使用 HuggingFace，您可以：

访问预训练模型：利用用于文本生成、翻译、图像处理等的模型
生成 AI 补全：通过推理 API 使用最先进的语言模型创建内容
自然语言处理：使用专门的 NLP 模型处理和分析文本
大规模部署：托管和服务于生产应用的模型
自定义模型：针对特定用例微调现有模型

在 Sim 中，HuggingFace 集成使您的代理能够通过编程方式使用 HuggingFace 推理 API 生成补全。这支持强大的自动化场景，例如内容生成、文本分析、代码补全和创意写作。您的代理可以通过自然语言提示生成补全，访问针对不同任务的专用模型，并将 AI 生成的内容集成到工作流中。此集成弥合了您的 AI 工作流与机器学习能力之间的差距，使您能够通过全球最全面的 ML 平台之一实现无缝的 AI 驱动自动化。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Hugging Face 集成到工作流程中。可以使用 Hugging Face 推理 API 生成补全内容。需要 API 密钥。

## 工具

### `huggingface_chat`

使用 Hugging Face 推理 API 生成补全

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | 否 | 指导模型行为的系统提示 |
| `content` | string | 是 | 发送给模型的用户消息内容 |
| `provider` | string | 是 | 用于 API 请求的提供商 \(例如，novita、cerebras 等\) |
| `model` | string | 是 | 用于聊天补全的模型 \(例如，deepseek/deepseek-v3-0324\) |
| `maxTokens` | number | 否 | 生成的最大 token 数量 |
| `temperature` | number | 否 | 采样温度 \(0-2\)。较高的值使输出更随机 |
| `apiKey` | string | 是 | Hugging Face API 令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 聊天补全结果 |

## 注意事项

- 分类：`tools`
- 类型：`huggingface`
```

--------------------------------------------------------------------------------

---[FILE: hunter.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/hunter.mdx

```text
---
title: Hunter io
description: 查找并验证专业电子邮件地址
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hunter"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Hunter.io](https://hunter.io/) 是一个领先的平台，用于查找和验证专业电子邮件地址、发现公司以及丰富联系数据。Hunter.io 提供强大的 API，用于域名搜索、电子邮件查找、验证和公司发现，是销售、招聘和业务发展的重要工具。

使用 Hunter.io，您可以：

- **按域名查找电子邮件地址：** 搜索与特定公司域名相关的所有公开可用的电子邮件地址。
- **发现公司：** 使用高级筛选器和 AI 驱动的搜索找到符合您条件的公司。
- **查找特定电子邮件地址：** 使用姓名和域名定位某人在公司中最可能的电子邮件地址。
- **验证电子邮件地址：** 检查任何电子邮件地址的可投递性和有效性。
- **丰富公司数据：** 获取有关公司的详细信息，包括规模、使用的技术等。

在 Sim 中，Hunter.io 集成使您的代理可以通过编程方式搜索和验证电子邮件地址、发现公司以及使用 Hunter.io 的 API 丰富联系人数据。这使您能够在工作流程中直接自动化潜在客户生成、联系人数据丰富和电子邮件验证。您的代理可以利用 Hunter.io 的工具来简化外联工作、保持 CRM 数据的最新状态，并为销售、招聘等场景提供智能自动化支持。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Hunter 集成到工作流程中。可以搜索域名、查找电子邮件地址、验证电子邮件地址、发现公司、查找公司以及统计电子邮件地址数量。需要 API 密钥。

## 工具

### `hunter_discover`

使用 Hunter.io 的 AI 驱动搜索返回符合一组条件的公司。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 否 | 用于公司搜索的自然语言查询 |
| `domain` | string | 否 | 用于筛选的公司域名 |
| `headcount` | string | 否 | 公司规模筛选（例如，“1-10”，“11-50”） |
| `company_type` | string | 否 | 组织类型 |
| `technology` | string | 否 | 公司使用的技术 |
| `apiKey` | string | 是 | Hunter.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 符合搜索条件的公司数组，每个公司包含域名、名称、员工人数、技术和电子邮件数量 |

### `hunter_domain_search`

返回使用给定域名找到的所有电子邮件地址及其来源。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 要搜索电子邮件地址的域名 |
| `limit` | number | 否 | 返回的最大电子邮件地址数量 \(默认值：10\) |
| `offset` | number | 否 | 要跳过的电子邮件地址数量 |
| `type` | string | 否 | 过滤个人或通用电子邮件 |
| `seniority` | string | 否 | 按资历级别过滤：初级、高级或执行级别 |
| `department` | string | 否 | 按特定部门过滤 \(例如：销售、市场营销\) |
| `apiKey` | string | 是 | Hunter.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `domain` | string | 搜索的域名 |
| `disposable` | boolean | 域名是否接受一次性电子邮件地址 |
| `webmail` | boolean | 域名是否为网络邮件提供商 |
| `accept_all` | boolean | 域名是否接受所有电子邮件地址 |
| `pattern` | string | 组织使用的电子邮件模式 |
| `organization` | string | 组织名称 |
| `description` | string | 组织描述 |
| `industry` | string | 组织所属行业 |
| `twitter` | string | 组织的 Twitter 主页 |
| `facebook` | string | 组织的 Facebook 主页 |
| `linkedin` | string | 组织的 LinkedIn 主页 |
| `instagram` | string | 组织的 Instagram 主页 |
| `youtube` | string | 组织的 YouTube 频道 |
| `technologies` | array | 组织使用的技术数组 |
| `country` | string | 组织所在国家 |
| `state` | string | 组织所在州/省 |
| `city` | string | 组织所在城市 |
| `postal_code` | string | 组织的邮政编码 |
| `street` | string | 组织的街道地址 |
| `emails` | array | 为域名找到的电子邮件地址数组，每个包含值、类型、置信度、来源和人员详细信息 |

### `hunter_email_finder`

根据姓名和公司域名，找到最可能的电子邮件地址。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 公司域名 |
| `first_name` | string | 是 | 个人的名字 |
| `last_name` | string | 是 | 个人的姓氏 |
| `company` | string | 否 | 公司名称 |
| `apiKey` | string | 是 | Hunter.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `email` | string | 找到的电子邮件地址 |
| `score` | number | 找到的电子邮件地址的置信分数 |
| `sources` | array | 包含电子邮件来源的数组，每个来源包含域名、URI、提取时间、最后一次看到的时间以及是否仍在页面上 |
| `verification` | object | 包含日期和状态的验证信息 |

### `hunter_email_verifier`

验证电子邮件地址的可投递性，并提供详细的验证状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 要验证的电子邮件地址 |
| `apiKey` | string | 是 | Hunter.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `result` | string | 可投递性结果：可投递、不可投递或有风险 |
| `score` | number | 验证结果的置信分数 |
| `email` | string | 验证后的电子邮件地址 |
| `regexp` | boolean | 电子邮件是否符合有效的正则表达式模式 |
| `gibberish` | boolean | 电子邮件是否看起来是无意义的字符组合 |
| `disposable` | boolean | 电子邮件是否来自一次性电子邮件提供商 |
| `webmail` | boolean | 电子邮件是否来自网络邮件提供商 |
| `mx_records` | boolean | 域名是否存在 MX 记录 |
| `smtp_server` | boolean | SMTP 服务器是否可达 |
| `smtp_check` | boolean | SMTP 检查是否成功 |
| `accept_all` | boolean | 域名是否接受所有电子邮件地址 |
| `block` | boolean | 电子邮件是否被阻止 |
| `status` | string | 验证状态：有效、无效、接受所有、网络邮件、一次性或未知 |
| `sources` | array | 包含电子邮件来源的数组 |

### `hunter_companies_find`

通过域名丰富公司数据。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 是 | 要查找公司数据的域名 |
| `apiKey` | string | 是 | Hunter.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `person` | object | 个人信息（对于 companies_find 工具未定义） |
| `company` | object | 公司信息，包括名称、域名、行业、规模、国家、LinkedIn 和 Twitter |

### `hunter_email_count`

返回为某个域名或公司找到的电子邮件地址总数。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | 否 | 要统计电子邮件的域名（如果未提供公司名称，则必需） |
| `company` | string | 否 | 要统计电子邮件的公司名称（如果未提供域名，则必需） |
| `type` | string | 否 | 仅筛选个人或通用电子邮件 |
| `apiKey` | string | 是 | Hunter.io API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `total` | number | 找到的电子邮件地址总数 |
| `personal_emails` | number | 找到的个人电子邮件地址数量 |
| `generic_emails` | number | 找到的通用电子邮件地址数量 |
| `department` | object | 按部门分类的电子邮件地址（执行、IT、财务、管理、销售、法律、支持、人力资源、市场营销、传播） |
| `seniority` | object | 按资历级别分类的电子邮件地址（初级、高级、执行级） |

## 注意事项

- 分类：`tools`
- 类型：`hunter`
```

--------------------------------------------------------------------------------

---[FILE: image_generator.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/image_generator.mdx

```text
---
title: 图像生成器
description: 生成图像
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="image_generator"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DALL-E](https://openai.com/dall-e-3) 是 OpenAI 的先进 AI 系统，旨在根据自然语言描述生成逼真的图像和艺术作品。作为一款最先进的图像生成模型，DALL-E 能够根据文本提示创建详细且富有创意的视觉效果，让用户无需具备艺术技能即可将想法转化为视觉内容。

使用 DALL-E，您可以：

- **生成逼真的图像**：根据文本描述创建照片级真实感的视觉效果
- **设计概念艺术**：将抽象的想法转化为视觉表现
- **生成多种变体**：为同一提示生成多种解释
- **控制艺术风格**：指定艺术风格、媒介和视觉美学
- **创建详细场景**：描述包含多个元素和关系的复杂场景
- **可视化产品**：生成产品模型和设计概念
- **阐释创意**：将书面概念转化为视觉插图

在 Sim 中，DALL-E 集成使您的代理能够以编程方式生成图像，作为其工作流程的一部分。这为内容创作、视觉设计和创意构思等强大的自动化场景提供了可能。您的代理可以制定详细的提示，生成相应的图像，并将这些视觉内容整合到其输出或后续流程中。此集成弥合了自然语言处理与视觉内容创作之间的差距，使您的代理不仅可以通过文本进行交流，还可以通过引人注目的图像进行沟通。通过将 Sim 与 DALL-E 连接，您可以创建按需生成视觉内容的代理，说明概念、生成设计素材，并通过丰富的视觉元素提升用户体验——这一切都无需在创意过程中进行人工干预。
{/* MANUAL-CONTENT-END */}

## 使用说明

将图像生成器集成到工作流程中。可以使用 DALL-E 3 或 GPT Image 生成图像。需要 API 密钥。

## 工具

### `openai_image`

使用 OpenAI 生成图像

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `model` | 字符串 | 是 | 要使用的模型 \(gpt-image-1 或 dall-e-3\) |
| `prompt` | 字符串 | 是 | 所需图像的文本描述 |
| `size` | 字符串 | 是 | 生成图像的尺寸 \(1024x1024, 1024x1792 或 1792x1024\) |
| `quality` | 字符串 | 否 | 图像质量 \(standard 或 hd\) |
| `style` | 字符串 | 否 | 图像风格 \(vivid 或 natural\) |
| `background` | 字符串 | 否 | 背景颜色，仅适用于 gpt-image-1 |
| `n` | 数字 | 否 | 要生成的图像数量 \(1-10\) |
| `apiKey` | 字符串 | 是 | 您的 OpenAI API 密钥 |

#### 输出

| 参数       | 类型   | 描述             |
| --------- | ---- | ---------------- |
| `success` | boolean | 操作成功状态       |
| `output` | object  | 生成的图像数据     |

## 注意事项

- 类别：`tools`
- 类型：`image_generator`
```

--------------------------------------------------------------------------------

````

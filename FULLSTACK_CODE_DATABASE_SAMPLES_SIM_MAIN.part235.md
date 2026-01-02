---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 235
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 235 of 933)

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

---[FILE: mem0.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mem0.mdx

```text
---
title: Mem0
description: 代理内存管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mem0"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mem0](https://mem0.ai) 是一个专为 AI 代理设计的强大内存管理系统。它提供了一个持久的、可搜索的内存存储，使代理能够记住过去的交互、从经验中学习，并在对话和工作流执行中保持上下文。

使用 Mem0，您可以：

- **存储代理记忆**：保存对话历史、用户偏好和重要上下文
- **检索相关信息**：使用语义搜索找到最相关的过去交互
- **构建上下文感知代理**：使您的代理能够参考过去的对话并保持连续性
- **个性化交互**：根据用户历史和偏好定制响应
- **实现长期记忆**：创建能够随着时间学习和适应的代理
- **扩展内存管理**：满足多个用户和复杂工作流的内存需求

在 Sim 中，Mem0 集成使您的代理能够在工作流执行中保持持久记忆。这允许更自然、上下文感知的交互，代理可以回忆过去的对话、记住用户偏好，并基于先前的交互进行构建。通过将 Sim 与 Mem0 连接，您可以创建能够记住和从过去经验中学习的更具人性化的代理。该集成支持添加新记忆、语义搜索现有记忆以及检索特定记忆记录。这种内存管理功能对于构建能够随着时间保持上下文、根据用户历史个性化交互并通过积累知识不断提高性能的复杂代理至关重要。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Mem0 集成到工作流程中。可以添加、搜索和检索记忆。需要 API 密钥。

## 工具

### `mem0_add_memories`

向 Mem0 添加记忆以实现持久存储和检索

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 与记忆关联的用户 ID |
| `messages` | json | 是 | 包含角色和内容的消息对象数组 |
| `apiKey` | string | 是 | 您的 Mem0 API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ids` | array | 创建的记忆 ID 数组 |
| `memories` | array | 创建的记忆对象数组 |

### `mem0_search_memories`

使用语义搜索在 Mem0 中搜索记忆

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 要搜索记忆的用户 ID |
| `query` | string | 是 | 用于查找相关记忆的搜索查询 |
| `limit` | number | 否 | 要返回的最大结果数 |
| `apiKey` | string | 是 | 您的 Mem0 API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `searchResults` | array | 包含记忆数据的搜索结果数组，每个结果包含 id、数据和分数 |
| `ids` | array | 搜索结果中找到的记忆 ID 数组 |

### `mem0_get_memories`

通过 ID 或筛选条件从 Mem0 中检索记忆

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | 是 | 要检索记忆的用户 ID |
| `memoryId` | string | 否 | 要检索的特定记忆 ID |
| `startDate` | string | 否 | 按 created_at 筛选的开始日期（格式：YYYY-MM-DD）|
| `endDate` | string | 否 | 按 created_at 筛选的结束日期（格式：YYYY-MM-DD）|
| `limit` | number | 否 | 要返回的最大结果数量 |
| `apiKey` | string | 是 | 您的 Mem0 API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `memories` | array | 检索到的记忆对象数组 |
| `ids` | array | 检索到的记忆 ID 数组 |

## 注意事项

- 类别：`tools`
- 类型：`mem0`
```

--------------------------------------------------------------------------------

---[FILE: memory.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/memory.mdx

```text
---
title: 内存
description: 添加内存存储
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="memory"
  color="#F64F9E"
/>

## 使用说明

将记忆集成到工作流程中。可以添加记忆、获取记忆、获取所有记忆以及删除记忆。

## 工具

### `memory_add`

向数据库添加新的内存，或将数据追加到具有相同 ID 的现有内存中。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | 否 | 会话标识符（例如，user-123，session-abc）。如果此 block 已存在具有该 conversationId 的内存，新消息将附加到该内存中。 |
| `id` | string | 否 | 会话标识符的旧参数。请改用 conversationId。为向后兼容而提供。 |
| `role` | string | 是 | 代理内存的角色（user、assistant 或 system） |
| `content` | string | 是 | 代理内存的内容 |
| `blockId` | string | 否 | 可选的 block ID。如果未提供，将使用执行上下文中的当前 block ID，或默认为 "default"。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 是否成功添加了内存 |
| `memories` | 数组 | 包含新添加或更新内存的内存对象数组 |
| `error` | 字符串 | 如果操作失败，显示错误信息 |

### `memory_get`

通过 conversationId、blockId、blockName 或其组合检索内存。返回所有匹配的内存。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | 否 | 会话标识符（例如，user-123，session-abc）。如果单独提供，将返回此会话在所有 block 中的所有内存。 |
| `id` | string | 否 | 会话标识符的旧参数。请改用 conversationId。为向后兼容而提供。 |
| `blockId` | string | 否 | block 标识符。如果单独提供，将返回此 block 中所有会话的所有内存。如果与 conversationId 一起提供，将返回此 block 中该特定会话的内存。 |
| `blockName` | string | 否 | block 名称。blockId 的替代选项。如果单独提供，将返回具有此名称的 block 的所有内存。如果与 conversationId 一起提供，将返回具有此名称的 block 中该会话的内存。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 内存是否成功检索 |
| `memories` | array | 包含 conversationId、blockId、blockName 和 data 字段的内存对象数组 |
| `message` | string | 成功或错误信息 |
| `error` | string | 如果操作失败的错误信息 |

### `memory_get_all`

从数据库中检索所有内存

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到所有内存 |
| `memories` | array | 包含 key、conversationId、blockId、blockName 和 data 字段的所有内存对象数组 |
| `message` | string | 成功或错误信息 |
| `error` | string | 如果操作失败的错误信息 |

### `memory_delete`

通过 conversationId、blockId、blockName 或其组合删除内存。支持批量删除。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | 否 | 会话标识符 \(例如，user-123，session-abc\)。如果单独提供，将删除此会话在所有块中的所有内存。 |
| `id` | string | 否 | 会话标识符的旧参数。请改用 conversationId。为向后兼容而提供。 |
| `blockId` | string | 否 | 块标识符。如果单独提供，将删除此块中所有会话的所有内存。如果与 conversationId 一起提供，将删除此块中特定会话的内存。 |
| `blockName` | string | 否 | 块名称。是 blockId 的替代项。如果单独提供，将删除具有此名称的块的所有内存。如果与 conversationId 一起提供，将删除此名称的块中该会话的内存。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 内存是否成功删除 |
| `message` | string | 成功或错误信息 |
| `error` | string | 如果操作失败的错误信息 |

## 注意

- 类别：`blocks`
- 类型：`memory`
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/zh/tools/meta.json

```json
{
  "pages": [
    "index",
    "airtable",
    "arxiv",
    "asana",
    "browser_use",
    "clay",
    "confluence",
    "discord",
    "elevenlabs",
    "exa",
    "file",
    "firecrawl",
    "github",
    "gmail",
    "google_calendar",
    "google_docs",
    "google_drive",
    "google_forms",
    "google_search",
    "google_sheets",
    "google_vault",
    "hubspot",
    "huggingface",
    "hunter",
    "image_generator",
    "jina",
    "jira",
    "knowledge",
    "linear",
    "linkup",
    "mem0",
    "memory",
    "microsoft_excel",
    "microsoft_planner",
    "microsoft_teams",
    "mistral_parse",
    "mongodb",
    "mysql",
    "notion",
    "onedrive",
    "openai",
    "outlook",
    "parallel_ai",
    "perplexity",
    "pinecone",
    "pipedrive",
    "postgresql",
    "qdrant",
    "reddit",
    "resend",
    "s3",
    "salesforce",
    "serper",
    "sharepoint",
    "slack",
    "stagehand",
    "stagehand_agent",
    "stripe",
    "supabase",
    "tavily",
    "telegram",
    "thinking",
    "translate",
    "trello",
    "twilio_sms",
    "twilio_voice",
    "typeform",
    "vision",
    "wealthbox",
    "webflow",
    "whatsapp",
    "wikipedia",
    "x",
    "youtube",
    "zep"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/microsoft_excel.mdx

```text
---
title: Microsoft Excel
description: 读取、写入和更新数据
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_excel"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/excel) 是一款功能强大的电子表格应用程序，可实现数据管理、分析和可视化。通过 Sim 中的 Microsoft Excel 集成，您可以以编程方式读取、写入和操作电子表格数据，以支持您的工作流自动化需求。

通过 Microsoft Excel 集成，您可以：

- **读取电子表格数据**：访问特定范围、工作表和单元格中的数据
- **写入和更新数据**：添加新数据或修改现有电子表格内容
- **管理表格**：创建和操作表格数据结构
- **处理多个工作表**：处理工作簿中的多个工作表
- **处理数据**：导入、导出和转换电子表格数据

在 Sim 中，Microsoft Excel 集成通过 OAuth 身份验证提供无缝的电子表格功能访问。您可以从特定范围读取数据，写入新信息，更新现有单元格，并处理各种数据格式。该集成支持读取和写入操作，具有灵活的输入和输出选项。这使您能够构建有效管理电子表格数据的工作流，无论是提取信息进行分析、自动更新记录，还是在应用程序之间保持数据一致性。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Microsoft Excel 集成到工作流程中。可以读取、写入、更新、添加到表格以及创建新工作表。

## 工具

### `microsoft_excel_read`

从 Microsoft Excel 电子表格中读取数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 要读取的电子表格的 ID |
| `range` | string | 否 | 要读取的单元格范围。接受 "SheetName!A1:B2" 形式的显式范围，或仅输入 "SheetName" 以读取该工作表的已用范围。如果省略，将读取第一个工作表的已用范围。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | object | 电子表格中的范围数据 |

### `microsoft_excel_write`

向 Microsoft Excel 电子表格写入数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 要写入的电子表格的 ID |
| `range` | string | 否 | 要写入的单元格范围 |
| `values` | array | 是 | 要写入电子表格的数据 |
| `valueInputOption` | string | 否 | 要写入数据的格式 |
| `includeValuesInResponse` | boolean | 否 | 是否在响应中包含写入的值 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updatedRange` | string | 更新的范围 |
| `updatedRows` | number | 更新的行数 |
| `updatedColumns` | number | 更新的列数 |
| `updatedCells` | number | 更新的单元格数 |
| `metadata` | object | 电子表格元数据 |

### `microsoft_excel_table_add`

向 Microsoft Excel 表格添加新行

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 包含表格的电子表格的 ID |
| `tableName` | string | 是 | 要添加行的表格名称 |
| `values` | array | 是 | 要添加到表格的数据 \(数组的数组或对象的数组\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `index` | number | 添加的第一行的索引 |
| `values` | array | 添加到表格的行数组 |
| `metadata` | object | 电子表格元数据 |

### `microsoft_excel_worksheet_add`

在 Microsoft Excel 工作簿中创建一个新工作表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | 是 | 要添加工作表的 Excel 工作簿的 ID |
| `worksheetName` | string | 是 | 新工作表的名称。必须在工作簿中唯一，且不能超过 31 个字符 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `worksheet` | object | 新创建工作表的详细信息 |

## 注意

- 类别：`tools`
- 类型：`microsoft_excel`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_planner.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/microsoft_planner.mdx

```text
---
title: Microsoft Planner
description: 在 Microsoft Planner 中管理任务、计划和桶
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_planner"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Planner](https://www.microsoft.com/en-us/microsoft-365/planner) 是一款任务管理工具，可通过看板、任务和分组帮助团队以可视化方式组织工作。它与 Microsoft 365 集成，提供了一种简单直观的方式来管理团队项目、分配职责并跟踪进度。

使用 Microsoft Planner，您可以：

- **创建和管理任务**：添加具有截止日期、优先级和分配用户的新任务
- **使用分组进行组织**：按阶段、状态或类别对任务进行分组，以反映团队的工作流程
- **可视化项目状态**：使用看板、图表和筛选器监控工作负载并跟踪进度
- **与 Microsoft 365 保持集成**：无缝连接任务与 Teams、Outlook 和其他 Microsoft 工具

在 Sim 中，Microsoft Planner 集成允许您的代理以编程方式创建、读取和管理任务，作为其工作流程的一部分。代理可以根据传入请求生成新任务，检索任务详细信息以推动决策，并跨项目跟踪状态——这一切都无需人工干预。无论您是在为客户入职、内部项目跟踪还是后续任务生成构建工作流程，将 Microsoft Planner 与 Sim 集成为您的代理提供了一种结构化的方式来协调工作、自动创建任务并保持团队一致。 
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Microsoft Planner 集成到工作流程中。管理任务、计划、桶以及任务详情，包括检查清单和参考。

## 工具

### `microsoft_planner_read_task`

从 Microsoft Planner 读取任务——获取所有用户任务或特定计划中的所有任务

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | 否 | 要获取任务的计划 ID（如果未提供，则获取所有用户任务） |
| `taskId` | string | 否 | 要获取的任务 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到任务 |
| `tasks` | array | 包含筛选属性的任务对象数组 |
| `metadata` | object | 包括 planId、userId 和 planUrl 的元数据 |

### `microsoft_planner_create_task`

在 Microsoft Planner 中创建新任务

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | 是 | 要创建任务的计划 ID |
| `title` | string | 是 | 任务的标题 |
| `description` | string | 否 | 任务的描述 |
| `dueDateTime` | string | 否 | 任务的截止日期和时间（ISO 8601 格式） |
| `assigneeUserId` | string | 否 | 要分配任务的用户 ID |
| `bucketId` | string | 否 | 要放置任务的桶 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功创建任务 |
| `task` | object | 包含所有属性的已创建任务对象 |
| `metadata` | object | 包括 planId、taskId 和 taskUrl 的元数据 |

### `microsoft_planner_update_task`

更新 Microsoft Planner 中的任务

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | 是 | 要更新的任务 ID |
| `etag` | string | 是 | 要更新任务的 ETag 值（If-Match 头） |
| `title` | string | 否 | 任务的新标题 |
| `bucketId` | string | 否 | 要移动任务的桶 ID |
| `dueDateTime` | string | 否 | 任务的截止日期和时间（ISO 8601 格式） |
| `startDateTime` | string | 否 | 任务的开始日期和时间（ISO 8601 格式） |
| `percentComplete` | number | 否 | 任务完成的百分比（0-100） |
| `priority` | number | 否 | 任务的优先级（0-10） |
| `assigneeUserId` | string | 否 | 要分配任务的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功更新任务 |
| `message` | string | 任务更新成功时的成功消息 |
| `task` | object | 包含所有属性的已更新任务对象 |
| `taskId` | string | 已更新任务的 ID |
| `etag` | string | 更新后的新 ETag - 用于后续操作 |
| `metadata` | object | 包括 taskId、planId 和 taskUrl 的元数据 |

### `microsoft_planner_delete_task`

从 Microsoft Planner 中删除任务

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | 是 | 要删除的任务 ID |
| `etag` | string | 是 | 要删除任务的 ETag 值（If-Match 头） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功删除任务 |
| `deleted` | boolean | 删除确认 |
| `metadata` | object | 附加元数据 |

### `microsoft_planner_list_plans`

列出与当前用户共享的所有计划

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到计划 |
| `plans` | array | 与当前用户共享的计划对象数组 |
| `metadata` | object | 包括 userId 和 count 的元数据 |

### `microsoft_planner_read_plan`

获取特定 Microsoft Planner 计划的详细信息

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | 是 | 要检索的计划 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到计划 |
| `plan` | object | 包含所有属性的计划对象 |
| `metadata` | object | 包括 planId 和 planUrl 的元数据 |

### `microsoft_planner_list_buckets`

列出 Microsoft Planner 计划中的所有桶

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | 是 | 计划的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到桶 |
| `buckets` | array | 桶对象的数组 |
| `metadata` | object | 包括 planId 和 count 的元数据 |

### `microsoft_planner_read_bucket`

获取特定桶的详细信息

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | 是 | 要检索的桶的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到桶 |
| `bucket` | object | 包含所有属性的桶对象 |
| `metadata` | object | 包括 bucketId 和 planId 的元数据 |

### `microsoft_planner_create_bucket`

在 Microsoft Planner 计划中创建一个新桶

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | 是 | 要创建桶的计划 ID |
| `name` | string | 是 | 桶的名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功创建了桶 |
| `bucket` | object | 包含所有属性的已创建桶对象 |
| `metadata` | object | 包括 bucketId 和 planId 的元数据 |

### `microsoft_planner_update_bucket`

更新 Microsoft Planner 中的一个桶

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | 是 | 要更新的桶的 ID |
| `name` | string | 否 | 桶的新名称 |
| `etag` | string | 是 | 要更新的桶的 ETag 值（If-Match 头） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功更新了桶 |
| `bucket` | object | 包含所有属性的已更新桶对象 |
| `metadata` | object | 包括 bucketId 和 planId 的元数据 |

### `microsoft_planner_delete_bucket`

从 Microsoft Planner 中删除一个桶

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | 是 | 要删除的桶的 ID |
| `etag` | string | 是 | 要删除的桶的 ETag 值（If-Match 头） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功删除了桶 |
| `deleted` | boolean | 删除确认 |
| `metadata` | object | 其他元数据 |

### `microsoft_planner_get_task_details`

获取有关任务的详细信息，包括检查清单和引用

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | 是 | 任务的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到任务详情 |
| `taskDetails` | object | 包括描述、检查清单和引用的任务详情 |
| `etag` | string | 此任务详情的 ETag 值 - 用于更新操作 |
| `metadata` | object | 包括 taskId 的元数据 |

### `microsoft_planner_update_task_details`

更新 Microsoft Planner 中的任务详情，包括描述、检查清单项和引用

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | 是 | 任务的 ID |
| `etag` | string | 是 | 用于更新任务详情的 ETag 值（If-Match 头） |
| `description` | string | 否 | 任务的描述 |
| `checklist` | object | 否 | 作为 JSON 对象的检查清单项 |
| `references` | object | 否 | 作为 JSON 对象的引用 |
| `previewType` | string | 否 | 预览类型：automatic、noPreview、checklist、description 或 reference |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功更新任务详情 |
| `taskDetails` | object | 包含所有属性的已更新任务详情对象 |
| `metadata` | object | 包括 taskId 的元数据 |

## 注意事项

- 类别：`tools`
- 类型：`microsoft_planner`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_teams.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/microsoft_teams.mdx

```text
---
title: Microsoft Teams
description: 管理 Teams 中的消息、反应和成员
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_teams"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://teams.microsoft.com) 是一个强大的通信和协作平台，用户可以在团队和组织内进行实时消息、会议和内容共享。作为 Microsoft 生产力生态系统的一部分，Microsoft Teams 提供与 Office 365 无缝集成的聊天功能，用户可以发布消息、协调工作，并在设备和工作流之间保持连接。

使用 Microsoft Teams，您可以：

- **发送和接收消息**：通过聊天线程即时与个人或群组沟通  
- **实时协作**：在频道和聊天中共享更新和信息  
- **组织对话**：通过线程式讨论和持久聊天记录保持上下文  
- **共享文件和内容**：直接在聊天中附加和查看文档、图片和链接  
- **与 Microsoft 365 集成**：无缝连接 Outlook、SharePoint、OneDrive 等  
- **跨设备访问**：在桌面、网页和移动设备上使用 Teams，并同步云端对话  
- **安全通信**：利用企业级安全性和合规功能

在 Sim 中，Microsoft Teams 集成使您的代理可以通过编程方式直接与聊天消息交互。这为强大的自动化场景提供了可能，例如发送更新、发布警报、协调任务以及实时响应对话。您的代理可以向聊天或频道中写入新消息，根据工作流数据更新内容，并在协作发生的地方与用户互动。通过将 Sim 与 Microsoft Teams 集成，您可以弥合智能工作流与团队沟通之间的差距——帮助您的代理简化协作、自动化通信任务，并使您的团队保持一致。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Microsoft Teams 集成到工作流程中。读取、写入、更新和删除聊天和频道消息。回复消息、添加反应以及列出团队/频道成员。可以在触发模式下使用，当消息发送到聊天或频道时触发工作流程。要在消息中提及用户，请将他们的名字用 `<at>` 标签包裹起来：`<at>userName</at>`

## 工具

### `microsoft_teams_read_chat`

从 Microsoft Teams 聊天中读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | 是 | 要读取的聊天 ID |
| `includeAttachments` | boolean | 否 | 下载并将消息附件（托管内容）包含到存储中 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | Teams 聊天读取操作成功状态 |
| `messageCount` | number | 从聊天中检索到的消息数量 |
| `chatId` | string | 读取的聊天 ID |
| `messages` | array | 聊天消息对象的数组 |
| `attachmentCount` | number | 找到的附件总数 |
| `attachmentTypes` | array | 找到的附件类型 |
| `content` | string | 聊天消息的格式化内容 |
| `attachments` | file[] | 为方便起见上传的附件（扁平化） |

### `microsoft_teams_write_chat`

在 Microsoft Teams 聊天中撰写或更新内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | 是 | 要写入的聊天 ID |
| `content` | string | 是 | 要写入消息的内容 |
| `files` | file[] | 否 | 要附加到消息的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | Teams 聊天消息发送成功状态 |
| `messageId` | string | 已发送消息的唯一标识符 |
| `chatId` | string | 发送消息的聊天 ID |
| `createdTime` | string | 创建消息的时间戳 |
| `url` | string | 消息的网页 URL |
| `updatedContent` | boolean | 内容是否成功更新 |

### `microsoft_teams_read_channel`

从 Microsoft Teams 频道读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 要读取的团队 ID |
| `channelId` | string | 是 | 要读取的频道 ID |
| `includeAttachments` | boolean | 否 | 下载并将消息附件（托管内容）包含到存储中 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | Teams 频道读取操作成功状态 |
| `messageCount` | number | 从频道中检索到的消息数量 |
| `teamId` | string | 读取的团队 ID |
| `channelId` | string | 读取的频道 ID |
| `messages` | array | 频道消息对象的数组 |
| `attachmentCount` | number | 找到的附件总数 |
| `attachmentTypes` | array | 找到的附件类型 |
| `content` | string | 频道消息的格式化内容 |
| `attachments` | file[] | 为方便起见上传的附件（扁平化） |

### `microsoft_teams_write_channel`

向 Microsoft Teams 频道编写或发送消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 要写入的团队 ID |
| `channelId` | string | 是 | 要写入的频道 ID |
| `content` | string | 是 | 要写入频道的内容 |
| `files` | file[] | 否 | 要附加到消息的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | Teams 频道消息发送成功状态 |
| `messageId` | string | 已发送消息的唯一标识符 |
| `teamId` | string | 发送消息的团队 ID |
| `channelId` | string | 发送消息的频道 ID |
| `createdTime` | string | 消息创建的时间戳 |
| `url` | string | 消息的网页 URL |
| `updatedContent` | boolean | 内容是否成功更新 |

### `microsoft_teams_update_chat_message`

更新 Microsoft Teams 聊天中的现有消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | 是 | 包含消息的聊天 ID |
| `messageId` | string | 是 | 要更新的消息 ID |
| `content` | string | 是 | 消息的新内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 更新是否成功 |
| `messageId` | string | 更新的消息 ID |
| `updatedContent` | boolean | 内容是否成功更新 |

### `microsoft_teams_update_channel_message`

更新 Microsoft Teams 频道中的现有消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 团队 ID |
| `channelId` | string | 是 | 包含消息的频道 ID |
| `messageId` | string | 是 | 要更新的消息 ID |
| `content` | string | 是 | 消息的新内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 更新是否成功 |
| `messageId` | string | 已更新消息的 ID |
| `updatedContent` | boolean | 内容是否成功更新 |

### `microsoft_teams_delete_chat_message`

在 Microsoft Teams 聊天中软删除一条消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | 是 | 包含消息的聊天 ID |
| `messageId` | string | 是 | 要删除的消息 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 删除是否成功 |
| `deleted` | boolean | 删除确认 |
| `messageId` | string | 已删除消息的 ID |

### `microsoft_teams_delete_channel_message`

在 Microsoft Teams 频道中软删除一条消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 团队的 ID |
| `channelId` | string | 是 | 包含消息的频道 ID |
| `messageId` | string | 是 | 要删除的消息 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 删除是否成功 |
| `deleted` | boolean | 删除确认 |
| `messageId` | string | 已删除消息的 ID |

### `microsoft_teams_reply_to_message`

回复 Microsoft Teams 频道中的现有消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 团队 ID |
| `channelId` | string | 是 | 频道 ID |
| `messageId` | string | 是 | 要回复的消息 ID |
| `content` | string | 是 | 回复内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 回复是否成功 |
| `messageId` | string | 回复消息的 ID |
| `updatedContent` | boolean | 内容是否成功发送 |

### `microsoft_teams_get_message`

从 Microsoft Teams 聊天或频道中获取特定消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 否 | 团队 ID（用于频道消息） |
| `channelId` | string | 否 | 频道 ID（用于频道消息） |
| `chatId` | string | 否 | 聊天 ID（用于聊天消息） |
| `messageId` | string | 是 | 要检索的消息 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 检索是否成功 |
| `content` | string | 消息内容 |
| `metadata` | object | 消息元数据，包括发送者、时间戳等 |

### `microsoft_teams_set_reaction`

在 Microsoft Teams 中为消息添加表情符号反应

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 否 | 团队 ID（用于频道消息） |
| `channelId` | string | 否 | 频道 ID（用于频道消息） |
| `chatId` | string | 否 | 聊天 ID（用于聊天消息） |
| `messageId` | string | 是 | 要添加反应的消息 ID |
| `reactionType` | string | 是 | 表情符号反应（例如：❤️, 👍, 😊） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功添加了反应 |
| `reactionType` | string | 添加的表情符号 |
| `messageId` | string | 消息 ID |

### `microsoft_teams_unset_reaction`

在 Microsoft Teams 中从消息中移除表情符号反应

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 否 | 团队 ID（用于频道消息） |
| `channelId` | string | 否 | 频道 ID（用于频道消息） |
| `chatId` | string | 否 | 聊天 ID（用于聊天消息） |
| `messageId` | string | 是 | 消息 ID |
| `reactionType` | string | 是 | 要移除的表情符号反应（例如：❤️, 👍, 😊） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功移除反应 |
| `reactionType` | string | 被移除的表情符号 |
| `messageId` | string | 消息的 ID |

### `microsoft_teams_list_team_members`

列出 Microsoft Teams 团队的所有成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 团队的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 列表是否成功 |
| `members` | array | 团队成员的数组 |
| `memberCount` | number | 成员总数 |

### `microsoft_teams_list_channel_members`

列出 Microsoft Teams 频道的所有成员

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | 是 | 团队的 ID |
| `channelId` | string | 是 | 频道的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 列表是否成功 |
| `members` | array | 频道成员的数组 |
| `memberCount` | number | 成员总数 |

## 注意事项

- 类别：`tools`
- 类型：`microsoft_teams`
```

--------------------------------------------------------------------------------

---[FILE: mistral_parse.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mistral_parse.mdx

```text
---
title: Mistral Parser
description: 从 PDF 文档中提取文本
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mistral_parse"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
Mistral Parse 工具提供了一种强大的方式，通过 [Mistral 的 OCR API](https://mistral.ai/) 从 PDF 文档中提取和处理内容。该工具利用先进的光学字符识别技术，能够准确提取 PDF 文件中的文本和结构，使文档数据轻松融入您的代理工作流程。

使用 Mistral Parse 工具，您可以：

- **从 PDF 中提取文本**：将 PDF 内容准确转换为文本、Markdown 或 JSON 格式
- **处理来自 URL 的 PDF**：通过提供在线托管的 PDF 的 URL，直接提取内容
- **保留文档结构**：保留原始 PDF 的格式、表格和布局
- **提取图像**：可选地包含 PDF 中嵌入的图像
- **选择特定页面**：仅处理多页文档中您需要的页面

Mistral Parse 工具在需要处理 PDF 内容的场景中特别有用，例如分析报告、从表单中提取数据或处理扫描文档中的文本。它简化了将 PDF 内容提供给代理的过程，使他们能够像处理直接文本输入一样轻松地处理存储在 PDF 中的信息。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Mistral Parse 集成到工作流程中。可以从上传的 PDF 文档或 URL 中提取文本。需要 API 密钥。

## 工具

### `mistral_parser`

使用 Mistral OCR API 解析 PDF 文档

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `filePath` | 字符串 | 是 | 要处理的 PDF 文档的 URL |
| `fileUpload` | 对象 | 否 | 来自文件上传组件的文件上传数据 |
| `resultType` | 字符串 | 否 | 解析结果的类型（markdown、text 或 json）。默认为 markdown。 |
| `includeImageBase64` | 布尔值 | 否 | 在响应中包含 base64 编码的图像 |
| `pages` | 数组 | 否 | 要处理的特定页面（页面编号数组，从 0 开始） |
| `imageLimit` | 数字 | 否 | 从 PDF 中提取的最大图像数量 |
| `imageMinSize` | 数字 | 否 | 从 PDF 中提取的图像的最小高度和宽度 |
| `apiKey` | 字符串 | 是 | Mistral API 密钥（MISTRAL_API_KEY） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | PDF 是否成功解析 |
| `content` | string | 按请求格式提取的内容（markdown、text 或 JSON） |
| `metadata` | object | 包括 jobId、fileType、pageCount 和使用信息的处理元数据 |

## 注意事项

- 类别：`tools`
- 类型：`mistral_parse`
```

--------------------------------------------------------------------------------

---[FILE: mongodb.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mongodb.mdx

```text
---
title: MongoDB
description: 连接到 MongoDB 数据库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mongodb"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[MongoDB](https://www.mongodb.com/) 工具使您能够连接到 MongoDB 数据库，并直接在您的代理工作流中执行各种面向文档的操作。通过灵活的配置和安全的连接管理，您可以轻松地与数据交互并对其进行操作。

使用 MongoDB 工具，您可以：

- **查找文档**：使用 `mongodb_query` 操作，通过丰富的查询过滤器查询集合并检索文档。
- **插入文档**：使用 `mongodb_insert` 操作，将一个或多个文档添加到集合中。
- **更新文档**：通过指定过滤条件和更新操作，使用 `mongodb_update` 操作修改现有文档。
- **删除文档**：使用 `mongodb_delete` 操作，从集合中删除文档，指定过滤器和删除选项。
- **聚合数据**：使用 `mongodb_execute` 操作运行复杂的聚合管道，以转换和分析数据。

MongoDB 工具非常适合需要管理或分析结构化、基于文档的数据的工作流。无论是处理用户生成的内容、管理应用数据，还是支持分析，MongoDB 工具都能以安全、编程化的方式简化您的数据访问和操作。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 MongoDB 集成到工作流中。可以查找、插入、更新、删除和聚合数据。

## 工具

### `mongodb_query`

在 MongoDB 集合上执行查找操作

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MongoDB 服务器主机名或 IP 地址 |
| `port` | number | 是 | MongoDB 服务器端口 \(默认：27017\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 否 | MongoDB 用户名 |
| `password` | string | 否 | MongoDB 密码 |
| `authSource` | string | 否 | 认证数据库 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、首选\) |
| `collection` | string | 是 | 要查询的集合名称 |
| `query` | string | 否 | MongoDB 查询过滤器（JSON 字符串） |
| `limit` | number | 否 | 要返回的文档最大数量 |
| `sort` | string | 否 | 排序条件（JSON 字符串） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `documents` | array | 查询返回的文档数组 |
| `documentCount` | number | 返回的文档数量 |

### `mongodb_insert`

将文档插入到 MongoDB 集合中

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MongoDB 服务器主机名或 IP 地址 |
| `port` | number | 是 | MongoDB 服务器端口 \(默认值：27017\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 否 | MongoDB 用户名 |
| `password` | string | 否 | MongoDB 密码 |
| `authSource` | string | 否 | 认证数据库 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `collection` | string | 是 | 要插入的集合名称 |
| `documents` | array | 是 | 要插入的文档数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `documentCount` | number | 插入的文档数量 |
| `insertedId` | string | 插入文档的 ID \(单个插入\) |
| `insertedIds` | array | 插入文档的 ID 数组 \(多个插入\) |

### `mongodb_update`

更新 MongoDB 集合中的文档

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MongoDB 服务器主机名或 IP 地址 |
| `port` | number | 是 | MongoDB 服务器端口 \(默认值：27017\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 否 | MongoDB 用户名 |
| `password` | string | 否 | MongoDB 密码 |
| `authSource` | string | 否 | 认证数据库 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `collection` | string | 是 | 要更新的集合名称 |
| `filter` | string | 是 | 过滤条件（JSON 字符串） |
| `update` | string | 是 | 更新操作（JSON 字符串） |
| `upsert` | boolean | 否 | 如果未找到则创建文档 |
| `multi` | boolean | 否 | 更新多个文档 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `matchedCount` | number | 符合过滤条件的文档数量 |
| `modifiedCount` | number | 被修改的文档数量 |
| `documentCount` | number | 受影响的文档总数 |
| `insertedId` | string | 插入文档的 ID \(如果是 upsert\) |

### `mongodb_delete`

从 MongoDB 集合中删除文档

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MongoDB 服务器主机名或 IP 地址 |
| `port` | number | 是 | MongoDB 服务器端口 \(默认值：27017\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 否 | MongoDB 用户名 |
| `password` | string | 否 | MongoDB 密码 |
| `authSource` | string | 否 | 认证数据库 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `collection` | string | 是 | 要删除的集合名称 |
| `filter` | string | 是 | 过滤条件（JSON 字符串） |
| `multi` | boolean | 否 | 删除多个文档 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `deletedCount` | number | 删除的文档数量 |
| `documentCount` | number | 受影响的文档总数 |

### `mongodb_execute`

执行 MongoDB 聚合管道

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MongoDB 服务器主机名或 IP 地址 |
| `port` | number | 是 | MongoDB 服务器端口 \(默认值：27017\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 否 | MongoDB 用户名 |
| `password` | string | 否 | MongoDB 密码 |
| `authSource` | string | 否 | 认证数据库 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `collection` | string | 是 | 要执行管道的集合名称 |
| `pipeline` | string | 是 | 聚合管道（JSON 字符串） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `documents` | array | 从聚合返回的文档数组 |
| `documentCount` | number | 返回的文档数量 |

## 注意事项

- 类别：`tools`
- 类型：`mongodb`
```

--------------------------------------------------------------------------------

---[FILE: mysql.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/mysql.mdx

```text
---
title: MySQL
description: 连接到 MySQL 数据库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mysql"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[MySQL](https://www.mysql.com/) 工具使您能够连接到任何 MySQL 数据库，并直接在您的代理工作流中执行各种数据库操作。通过安全的连接处理和灵活的配置，您可以轻松管理和操作您的数据。

使用 MySQL 工具，您可以：

- **查询数据**：使用 `mysql_query` 操作执行 SELECT 查询，从您的 MySQL 表中检索数据。
- **插入记录**：通过指定表和要插入的数据，使用 `mysql_insert` 操作向表中添加新行。
- **更新记录**：使用 `mysql_update` 操作修改表中的现有数据，提供表、新数据和 WHERE 条件。
- **删除记录**：通过指定表和 WHERE 条件，使用 `mysql_delete` 操作从表中删除行。
- **执行原始 SQL**：使用 `mysql_execute` 操作运行任何自定义 SQL 命令，以满足高级用例需求。

MySQL 工具非常适合需要与结构化数据交互的场景，例如自动化报告、在系统之间同步数据或驱动数据驱动的工作流。它简化了数据库访问，使您可以通过编程方式轻松读取、写入和管理 MySQL 数据。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 MySQL 集成到工作流程中。可以查询、插入、更新、删除以及执行原始 SQL。

## 工具

### `mysql_query`

在 MySQL 数据库上执行 SELECT 查询

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MySQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | MySQL 服务器端口 \(默认值：3306\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、首选\) |
| `query` | string | 是 | 要执行的 SQL SELECT 查询 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 查询返回的行数组 |
| `rowCount` | number | 返回的行数 |

### `mysql_insert`

向 MySQL 数据库插入新记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MySQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | MySQL 服务器端口 \(默认值：3306\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、首选\) |
| `table` | string | 是 | 要插入的表名 |
| `data` | object | 是 | 以键值对形式插入的数据 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 插入行的数组 |
| `rowCount` | number | 插入的行数 |

### `mysql_update`

更新 MySQL 数据库中的现有记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MySQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | MySQL 服务器端口 \(默认值：3306\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、首选\) |
| `table` | string | 是 | 要更新的表名 |
| `data` | object | 是 | 以键值对形式更新的数据 |
| `where` | string | 是 | WHERE 子句条件 \(不包括 WHERE 关键字\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 更新行的数组 |
| `rowCount` | number | 更新的行数 |

### `mysql_delete`

从 MySQL 数据库中删除记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MySQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | MySQL 服务器端口 \(默认值：3306\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、首选\) |
| `table` | string | 是 | 要删除的表名 |
| `where` | string | 是 | WHERE 子句条件 \(不包括 WHERE 关键字\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 已删除行的数组 |
| `rowCount` | number | 已删除行的数量 |

### `mysql_execute`

在 MySQL 数据库上执行原始 SQL 查询

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | MySQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | MySQL 服务器端口 \(默认值: 3306\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、首选\) |
| `query` | string | 是 | 要执行的原始 SQL 查询 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 查询返回的行数组 |
| `rowCount` | number | 受影响的行数 |

## 注意

- 类别: `tools`
- 类型: `mysql`
```

--------------------------------------------------------------------------------

````

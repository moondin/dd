---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 236
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 236 of 933)

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

---[FILE: neo4j.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/neo4j.mdx

```text
---
title: Neo4j
description: 连接到 Neo4j 图数据库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="neo4j"
  color="#FFFFFF"
/>

## 使用说明

将 Neo4j 图数据库集成到工作流程中。可以查询、创建、合并、更新和删除节点及关系。

## 工具

### `neo4j_query`

执行 MATCH 查询以从 Neo4j 图数据库中读取节点和关系。为了获得最佳性能并防止结果集过大，请在查询中包含 LIMIT（例如，

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | Neo4j 服务器主机名或 IP 地址 |
| `port` | number | 是 | Neo4j 服务器端口 \(默认：Bolt 协议为 7687\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | Neo4j 用户名 |
| `password` | string | 是 | Neo4j 密码 |
| `encryption` | string | 否 | 连接加密模式 \(启用，禁用\) |
| `cypherQuery` | string | 是 | 要执行的 Cypher 查询 \(通常是 MATCH 语句\) |
| `parameters` | object | 否 | Cypher 查询的参数，格式为 JSON 对象。用于任何动态值，包括 LIMIT \(例如，查询："MATCH \(n\) RETURN n LIMIT $limit", 参数：\{limit: 100\}\)。 |
| `parameters` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `records` | array | 查询返回的记录数组 |
| `recordCount` | number | 返回的记录数量 |
| `summary` | json | 查询执行摘要，包括时间和计数器 |

### `neo4j_create`

执行 CREATE 语句以向 Neo4j 图数据库添加新节点和关系

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | Neo4j 服务器主机名或 IP 地址 |
| `port` | number | 是 | Neo4j 服务器端口 \(默认：Bolt 协议为 7687\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | Neo4j 用户名 |
| `password` | string | 是 | Neo4j 密码 |
| `encryption` | string | 否 | 连接加密模式 \(启用，禁用\) |
| `cypherQuery` | string | 是 | 要执行的 Cypher CREATE 语句 |
| `parameters` | object | 否 | Cypher 查询的参数，格式为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `summary` | json | 创建摘要，包括创建的节点和关系的计数 |

### `neo4j_merge`

执行 MERGE 语句以在 Neo4j 中查找或创建节点和关系（插入或更新操作）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | Neo4j 服务器主机名或 IP 地址 |
| `port` | number | 是 | Neo4j 服务器端口 \(默认：Bolt 协议为 7687\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | Neo4j 用户名 |
| `password` | string | 是 | Neo4j 密码 |
| `encryption` | string | 否 | 连接加密模式 \(启用，禁用\) |
| `cypherQuery` | string | 是 | 要执行的 Cypher MERGE 语句 |
| `parameters` | object | 否 | Cypher 查询的参数，格式为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `summary` | json | 包含节点/关系创建或匹配计数的合并摘要 |

### `neo4j_update`

执行 SET 语句以更新 Neo4j 中现有节点和关系的属性

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | Neo4j 服务器主机名或 IP 地址 |
| `port` | number | 是 | Neo4j 服务器端口 \(默认：Bolt 协议为 7687\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | Neo4j 用户名 |
| `password` | string | 是 | Neo4j 密码 |
| `encryption` | string | 否 | 连接加密模式 \(启用，禁用\) |
| `cypherQuery` | string | 是 | 包含 MATCH 和 SET 语句的 Cypher 查询以更新属性 |
| `parameters` | object | 否 | Cypher 查询的参数，格式为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `summary` | json | 包含已设置属性计数的更新摘要 |

### `neo4j_delete`

执行 DELETE 或 DETACH DELETE 语句以从 Neo4j 中删除节点和关系

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | Neo4j 服务器主机名或 IP 地址 |
| `port` | number | 是 | Neo4j 服务器端口 \(默认：Bolt 协议为 7687\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | Neo4j 用户名 |
| `password` | string | 是 | Neo4j 密码 |
| `encryption` | string | 否 | 连接加密模式 \(启用，禁用\) |
| `cypherQuery` | string | 是 | 包含 MATCH 和 DELETE/DETACH DELETE 语句的 Cypher 查询 |
| `parameters` | object | 否 | Cypher 查询的参数，格式为 JSON 对象 |
| `detach` | boolean | 否 | 是否使用 DETACH DELETE 在删除节点前移除关系 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `summary` | json | 删除摘要，包括已删除的节点和关系的计数 |

### `neo4j_execute`

在 Neo4j 图数据库上执行任意 Cypher 查询以进行复杂操作

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | Neo4j 服务器主机名或 IP 地址 |
| `port` | number | 是 | Neo4j 服务器端口 \(默认：Bolt 协议为 7687\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | Neo4j 用户名 |
| `password` | string | 是 | Neo4j 密码 |
| `encryption` | string | 否 | 连接加密模式 \(启用，禁用\) |
| `cypherQuery` | string | 是 | 要执行的 Cypher 查询 \(任何有效的 Cypher 语句\) |
| `parameters` | object | 否 | Cypher 查询的参数，格式为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `records` | array | 查询返回的记录数组 |
| `recordCount` | number | 返回的记录数量 |
| `summary` | json | 执行摘要，包括时间和计数 |

## 注意

- 分类：`tools`
- 类型：`neo4j`
```

--------------------------------------------------------------------------------

---[FILE: notion.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/notion.mdx

```text
---
title: Notion
description: 管理 Notion 页面
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="notion"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Notion](https://www.notion.so) 是一个集笔记、文档、维基和项目管理工具于一体的工作空间平台。它提供了一个灵活且可定制的环境，用户可以在各种格式中创建、组织和协作处理内容。

使用 Notion，您可以：

- **创建多功能内容**：构建文档、维基、数据库、看板、日历等
- **组织信息**：通过嵌套页面和强大的数据库以层次结构组织内容
- **无缝协作**：与团队成员共享工作空间和页面，实现实时协作
- **自定义工作空间**：使用灵活的模板和构建模块设计理想的工作流程
- **连接信息**：在页面和数据库之间建立链接，创建知识网络
- **随时随地访问**：通过网络、桌面和移动平台使用 Notion，并实现自动同步

在 Sim 中，Notion 集成使您的代理能够以编程方式直接与 Notion 工作空间交互。这支持强大的自动化场景，例如知识管理、内容创建和信息检索。您的代理可以：

- **读取 Notion 页面**：提取任何 Notion 页面中的内容和元数据。
- **读取 Notion 数据库**：检索数据库结构和信息。
- **写入页面**：向现有 Notion 页面追加新内容。
- **创建新页面**：在父页面下生成具有自定义标题和内容的新 Notion 页面。
- **查询数据库**：使用高级筛选和排序条件搜索和筛选数据库条目。
- **搜索工作空间**：在整个 Notion 工作空间中搜索符合特定查询的页面或数据库。
- **创建新数据库**：以编程方式创建具有自定义属性和结构的新数据库。

此集成弥合了您的 AI 工作流与知识库之间的差距，实现了无缝的文档和信息管理。通过将 Sim 与 Notion 连接，您可以自动化文档流程、维护最新的信息库、生成报告并智能地组织信息——这一切都通过您的智能代理完成。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Notion 集成到工作流程中。可以读取页面、读取数据库、创建页面、创建数据库、追加内容、查询数据库以及搜索工作区。需要 OAuth 授权。

## 工具

### `notion_read`

从 Notion 页面读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | 是 | 要读取的 Notion 页面 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 以 markdown 格式显示的页面内容，包括标题、段落、列表和待办事项 |
| `metadata` | object | 包括标题、URL 和时间戳在内的页面元数据 |

### `notion_read_database`

读取 Notion 数据库的信息和结构

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | 是 | 要读取的 Notion 数据库 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 数据库信息，包括标题、属性架构和元数据 |
| `metadata` | object | 数据库元数据，包括标题、ID、URL、时间戳和属性架构 |

### `notion_write`

向 Notion 页面追加内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | 是 | 要追加内容的 Notion 页面 ID |
| `content` | string | 是 | 要追加到页面的内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 确认内容已附加到页面的成功消息 |

### `notion_create_page`

在 Notion 中创建新页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | 是 | 父页面的 ID |
| `title` | string | 否 | 新页面的标题 |
| `content` | string | 否 | 创建页面时可选的附加内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 确认页面创建的成功消息 |
| `metadata` | object | 页面元数据，包括标题、页面 ID、URL 和时间戳 |

### `notion_query_database`

使用高级过滤查询和筛选 Notion 数据库条目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | 是 | 要查询的数据库 ID |
| `filter` | string | 否 | 作为 JSON 的过滤条件（可选） |
| `sorts` | string | 否 | 作为 JSON 数组的排序条件（可选） |
| `pageSize` | number | 否 | 返回结果的数量（默认：100，最大：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 格式化的数据库条目列表及其属性 |
| `metadata` | object | 查询元数据，包括总结果数、分页信息和原始结果数组 |

### `notion_search`

在 Notion 工作区中搜索所有页面和数据库

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 否 | 搜索词（留空以获取所有页面） |
| `filterType` | string | 否 | 按对象类型筛选：页面、数据库，或留空以获取所有 |
| `pageSize` | number | 否 | 返回结果数量（默认：100，最大：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 格式化的搜索结果列表，包括页面和数据库 |
| `metadata` | object | 搜索元数据，包括总结果数、分页信息和原始结果数组 |

### `notion_create_database`

在 Notion 中创建具有自定义属性的新数据库

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | 是 | 创建数据库的父页面 ID |
| `title` | string | 是 | 新数据库的标题 |
| `properties` | string | 否 | 数据库属性，格式为 JSON 对象（可选，若为空将创建默认的“名称”属性） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 包含数据库详细信息和属性列表的成功消息 |
| `metadata` | object | 数据库元数据，包括 ID、标题、URL、创建时间和属性模式 |

## 注意事项

- 类别：`tools`
- 类型：`notion`
```

--------------------------------------------------------------------------------

---[FILE: onedrive.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/onedrive.mdx

```text
---
title: OneDrive
description: 创建、上传、下载、列出和删除文件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="onedrive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[OneDrive](https://onedrive.live.com) 是 Microsoft 的云存储和文件同步服务，允许用户在设备之间安全地存储、访问和共享文件。OneDrive 深度集成于 Microsoft 365 生态系统中，支持无缝协作、版本控制以及团队和组织间的实时内容访问。

了解如何在 Sim 中集成 OneDrive 工具，以自动提取、管理和组织您的云文件到工作流程中。本教程将指导您连接 OneDrive、设置文件访问权限，并使用存储的内容来推动自动化。非常适合与您的代理实时同步重要文档和媒体。

使用 OneDrive，您可以：

- **将文件安全存储在云端**：上传并从任何设备访问文档、图片和其他文件
- **组织您的内容**：轻松创建结构化文件夹并管理文件版本
- **实时协作**：共享文件，与他人同时编辑并跟踪更改
- **跨设备访问**：通过桌面、移动设备和网页平台使用 OneDrive
- **与 Microsoft 365 集成**：与 Word、Excel、PowerPoint 和 Teams 无缝协作
- **控制权限**：通过自定义访问设置和到期控制共享文件和文件夹

在 Sim 中，OneDrive 集成使您的代理可以直接与云存储交互。代理可以将新文件上传到特定文件夹，检索和读取现有文件，并列出文件夹内容以动态组织和访问信息。此集成允许您的代理将文件操作纳入智能工作流程中——自动化文档接收、内容分析和结构化存储管理。通过将 Sim 与 OneDrive 连接，您可以让代理以编程方式管理和使用云文档，消除手动步骤，并通过安全的实时文件访问增强自动化。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 OneDrive 集成到工作流程中。可以创建文本和 Excel 文件，上传文件，下载文件，列出文件，以及删除文件或文件夹。

## 工具

### `onedrive_upload`

上传文件到 OneDrive

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | 是 | 要上传的文件名称 |
| `file` | file | 否 | 要上传的文件 \(二进制\) |
| `content` | string | 否 | 要上传的文本内容 \(如果未提供文件\) |
| `mimeType` | string | 否 | 要创建文件的 MIME 类型 \(例如，.txt 的 text/plain，.xlsx 的 application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\) |
| `folderSelector` | string | 否 | 选择上传文件的文件夹 |
| `manualFolderId` | string | 否 | 手动输入的文件夹 ID \(高级模式\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 文件是否成功上传 |
| `file` | object | 上传的文件对象，包含元数据，包括 id、name、webViewLink、webContentLink 和时间戳 |

### `onedrive_create_folder`

在 OneDrive 中创建新文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `folderName` | string | 是 | 要创建的文件夹名称 |
| `folderSelector` | string | 否 | 选择要创建文件夹的父文件夹 |
| `manualFolderId` | string | 否 | 手动输入的父文件夹 ID（高级模式） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 文件夹是否成功创建 |
| `file` | object | 创建的文件夹对象，包含元数据，包括 id、name、webViewLink 和时间戳 |

### `onedrive_download`

从 OneDrive 下载文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | 是 | 要下载的文件 ID |
| `fileName` | string | 否 | 可选的文件名覆盖 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | file | 下载的文件存储在执行文件中 |

### `onedrive_list`

列出 OneDrive 中的文件和文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | 否 | 选择要列出文件的文件夹 |
| `manualFolderId` | string | 否 | 手动输入的文件夹 ID \(高级模式\) |
| `query` | string | 否 | 用于筛选文件的查询 |
| `pageSize` | number | 否 | 要返回的文件数量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 文件是否成功列出 |
| `files` | array | 包含元数据的文件和文件夹对象数组 |
| `nextPageToken` | string | 用于检索下一页结果的令牌 \(可选\) |

### `onedrive_delete`

从 OneDrive 删除文件或文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | 是 | 要删除的文件或文件夹的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 文件是否成功删除 |
| `deleted` | boolean | 文件已删除的确认信息 |
| `fileId` | string | 已删除文件的 ID |

## 注意事项

- 类别：`tools`
- 类型：`onedrive`
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/openai.mdx

```text
---
title: 嵌入
description: 生成 Open AI 嵌入
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="openai"
  color="#10a37f"
/>

{/* MANUAL-CONTENT-START:intro */}
[OpenAI](https://www.openai.com) 是一家领先的人工智能研究和部署公司，提供一套强大的人工智能模型和 API。OpenAI 提供尖端技术，包括大型语言模型（如 GPT-4）、图像生成（DALL-E）和嵌入技术，帮助开发者构建复杂的人工智能应用程序。

使用 OpenAI，您可以：

- **生成文本**：使用 GPT 模型为各种应用创建类似人类的文本
- **创建图像**：通过 DALL-E 将文本描述转化为视觉内容
- **生成嵌入**：将文本转换为数值向量，用于语义搜索和分析
- **构建 AI 助手**：开发具有专业知识的对话代理
- **处理和分析数据**：从非结构化文本中提取见解和模式
- **翻译语言**：以高精度在不同语言之间转换内容
- **总结内容**：在保留关键信息的同时压缩长篇文本

在 Sim 中，OpenAI 集成使您的代理能够以编程方式将这些强大的 AI 功能作为其工作流程的一部分。这允许结合自然语言理解、内容生成和语义分析的复杂自动化场景。您的代理可以从文本生成向量嵌入，这些嵌入是捕捉语义意义的数值表示，支持高级搜索、分类和推荐系统。此外，通过 DALL-E 集成，代理可以根据文本描述创建图像，为视觉内容生成开辟了可能性。此集成弥合了您的工作流程自动化与最先进 AI 功能之间的差距，使您的代理能够理解上下文、生成相关内容，并基于语义理解做出智能决策。通过将 Sim 与 OpenAI 连接，您可以创建能够更智能地处理信息、生成创意内容并为用户提供更个性化体验的代理。

## 使用说明

将嵌入集成到工作流程中。可以从文本生成嵌入。需要 API 密钥。

## 工具

### `openai_embeddings`

使用 OpenAI 从文本生成嵌入

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `input` | string | 是 | 用于生成嵌入的文本 |
| `model` | string | 否 | 用于嵌入的模型 |
| `encodingFormat` | string | 否 | 返回嵌入的格式 |
| `apiKey` | string | 是 | OpenAI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 嵌入生成结果 |

## 注意事项

- 类别：`tools`
- 类型：`openai`
```

--------------------------------------------------------------------------------

---[FILE: outlook.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/outlook.mdx

```text
---
title: Outlook
description: 发送、读取、草拟、转发和移动 Outlook 邮件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="outlook"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Outlook](https://outlook.office365.com) 是一个全面的电子邮件和日历平台，帮助用户高效管理通信、日程和任务。作为 Microsoft 生产力套件的一部分，Outlook 提供了强大的工具，用于发送和组织电子邮件、协调会议，并与 Microsoft 365 应用程序无缝集成——使个人和团队能够在各设备间保持有序和连接。

使用 Microsoft Outlook，您可以：

- **发送和接收电子邮件**：与个人或分发列表进行清晰且专业的沟通  
- **管理日历和事件**：安排会议、设置提醒并查看可用性  
- **整理收件箱**：使用文件夹、类别和规则来保持电子邮件的井然有序  
- **访问联系人和任务**：在一个地方跟踪重要人员和待办事项  
- **与 Microsoft 365 集成**：与 Word、Excel、Teams 和其他 Microsoft 应用程序无缝协作  
- **跨设备访问**：在桌面、网页和移动设备上使用 Outlook，并实现实时同步  
- **维护隐私和安全性**：利用企业级加密和合规控制

在 Sim 中，Microsoft Outlook 集成使您的代理能够以编程方式直接与电子邮件和日历数据交互，具备完整的电子邮件管理功能。这为整个电子邮件工作流程提供了强大的自动化场景。您的代理可以：

- **发送和草拟**：撰写带有附件的专业电子邮件，并保存草稿以备后用
- **读取和转发**：访问收件箱消息，并将重要通信转发给团队成员
- **高效组织**：将电子邮件标记为已读或未读，在文件夹之间移动消息，并复制电子邮件以供参考
- **清理收件箱**：删除不需要的消息并维护有序的文件夹结构
- **触发工作流程**：实时响应新电子邮件，根据收到的消息启用响应式自动化

通过将 Sim 与 Microsoft Outlook 连接，您可以启用智能代理来自动化通信、简化日程安排、保持对组织通信的可见性，并在您的工作流程生态系统中保持收件箱的有序。无论您是在管理客户通信、处理发票、协调团队更新，还是自动化跟进，Outlook 集成都提供企业级的电子邮件自动化功能。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Outlook 集成到工作流程中。可以读取、草拟、发送、转发和移动电子邮件。可以在触发模式下使用，当收到新电子邮件时触发工作流程。

## 工具

### `outlook_send`

使用 Outlook 发送电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `to` | string | 是 | 收件人电子邮件地址 |
| `subject` | string | 是 | 邮件主题 |
| `body` | string | 是 | 邮件正文内容 |
| `contentType` | string | 否 | 邮件正文的内容类型（text 或 html） |
| `replyToMessageId` | string | 否 | 要回复的消息 ID（用于线程化） |
| `conversationId` | string | 否 | 用于线程化的会话 ID |
| `cc` | string | 否 | 抄送收件人（逗号分隔） |
| `bcc` | string | 否 | 密送收件人（逗号分隔） |
| `attachments` | file[] | 否 | 要附加到邮件的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 邮件发送成功状态 |
| `status` | string | 邮件的投递状态 |
| `timestamp` | string | 邮件发送的时间戳 |
| `message` | string | 成功或错误信息 |

### `outlook_draft`

使用 Outlook 草拟邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `to` | string | 是 | 收件人电子邮件地址 |
| `subject` | string | 是 | 邮件主题 |
| `body` | string | 是 | 邮件正文内容 |
| `contentType` | string | 否 | 邮件正文的内容类型（text 或 html） |
| `cc` | string | 否 | 抄送收件人（逗号分隔） |
| `bcc` | string | 否 | 密送收件人（逗号分隔） |
| `attachments` | file[] | 否 | 要附加到邮件草稿的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 邮件草稿创建成功状态 |
| `messageId` | string | 草拟邮件的唯一标识符 |
| `status` | string | 邮件草稿的状态 |
| `subject` | string | 草拟邮件的主题 |
| `timestamp` | string | 草稿创建的时间戳 |
| `message` | string | 成功或错误信息 |

### `outlook_read`

从 Outlook 读取邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `folder` | string | 否 | 要读取邮件的文件夹 ID（默认：收件箱） |
| `maxResults` | number | 否 | 要检索的最大邮件数量（默认：1，最大：10） |
| `includeAttachments` | boolean | 否 | 下载并包含邮件附件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或状态信息 |
| `results` | array | 邮件消息对象的数组 |
| `attachments` | file[] | 从所有邮件中提取的所有附件 |

### `outlook_forward`

将现有的 Outlook 消息转发给指定的收件人

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要转发的消息 ID |
| `to` | string | 是 | 收件人电子邮件地址（逗号分隔） |
| `comment` | string | 否 | 可选的评论，包含在转发的消息中 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误信息 |
| `results` | object | 投递结果详情 |

### `outlook_move`

在 Outlook 文件夹之间移动邮件

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要移动的消息 ID |
| `destinationId` | string | 是 | 目标文件夹的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 邮件移动成功状态 |
| `message` | string | 成功或错误信息 |
| `messageId` | string | 已移动消息的 ID |
| `newFolderId` | string | 目标文件夹的 ID |

### `outlook_mark_read`

将 Outlook 邮件标记为已读

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要标记为已读的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `message` | string | 成功或错误消息 |
| `messageId` | string | 邮件 ID |
| `isRead` | boolean | 邮件的已读状态 |

### `outlook_mark_unread`

将 Outlook 邮件标记为未读

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要标记为未读的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `message` | string | 成功或错误消息 |
| `messageId` | string | 邮件 ID |
| `isRead` | boolean | 邮件的已读状态 |

### `outlook_delete`

删除 Outlook 邮件（移动到已删除邮件）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要删除的邮件 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `message` | string | 成功或错误消息 |
| `messageId` | string | 已删除邮件的 ID |
| `status` | string | 删除状态 |

### `outlook_copy`

将 Outlook 消息复制到另一个文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | 是 | 要复制的消息 ID |
| `destinationId` | string | 是 | 目标文件夹的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 邮件复制成功状态 |
| `message` | string | 成功或错误信息 |
| `originalMessageId` | string | 原始消息的 ID |
| `copiedMessageId` | string | 复制消息的 ID |
| `destinationFolderId` | string | 目标文件夹的 ID |

## 注意事项

- 类别：`tools`
- 类型：`outlook`
```

--------------------------------------------------------------------------------

---[FILE: parallel_ai.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/parallel_ai.mdx

```text
---
title: Parallel AI
description: 使用 Parallel AI 进行网页研究
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="parallel_ai"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Parallel AI](https://parallel.ai/) 是一个先进的网页搜索和内容提取平台，旨在为任何查询提供全面、高质量的结果。通过利用智能处理和大规模数据提取，Parallel AI 使用户和代理能够快速、准确地访问、分析和综合来自网络的信息。

使用 Parallel AI，您可以：

- **智能搜索网络**：从广泛的来源中检索相关的最新信息  
- **提取和总结内容**：从网页和文档中获取简洁、有意义的摘录  
- **自定义搜索目标**：根据特定需求或问题定制查询以获得针对性结果  
- **大规模处理结果**：通过高级处理选项处理大量搜索结果  
- **与工作流程集成**：在 Sim 中使用 Parallel AI 来自动化研究、内容收集和知识提取  
- **控制输出粒度**：指定结果数量和每个结果的内容量  
- **安全的 API 访问**：通过 API 密钥认证保护您的搜索和数据

在 Sim 中，Parallel AI 集成使您的代理能够以编程方式执行网页搜索和内容提取。这使得强大的自动化场景成为可能，例如实时研究、竞争分析、内容监控和知识库创建。通过将 Sim 与 Parallel AI 连接，您可以解锁代理收集、处理和利用网络数据的能力，作为自动化工作流程的一部分。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Parallel AI 集成到工作流程中。可以搜索网页、从 URL 中提取信息并进行深入研究。

## 工具

### `parallel_search`

使用 Parallel AI 搜索网络。提供通过智能处理和内容提取的全面搜索结果。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `objective` | string | 是 | 搜索目标或需要回答的问题 |
| `search_queries` | string | 否 | 可选的以逗号分隔的搜索查询列表 |
| `processor` | string | 否 | 处理方法：base 或 pro \(默认值：base\) |
| `max_results` | number | 否 | 返回的最大结果数量 \(默认值：5\) |
| `max_chars_per_result` | number | 否 | 每个结果的最大字符数 \(默认值：1500\) |
| `apiKey` | string | 是 | Parallel AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 包含相关页面摘录的搜索结果 |

### `parallel_extract`

使用 Parallel AI 从特定 URL 中提取目标信息。根据您的目标处理提供的 URL，以提取相关内容。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `urls` | string | 是 | 以逗号分隔的 URL 列表，用于提取信息 |
| `objective` | string | 是 | 从提供的 URL 中提取的信息内容 |
| `excerpts` | boolean | 是 | 是否包含内容中的相关摘录 |
| `full_content` | boolean | 是 | 是否包含完整页面内容 |
| `apiKey` | string | 是 | Parallel AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 从提供的 URL 中提取的信息 |

### `parallel_deep_research`

使用 Parallel AI 在整个网络上进行全面深入的研究。从多个来源综合信息并附带引用。可能需要长达 15 分钟完成。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `input` | string | 是 | 研究查询或问题 \(最多 15,000 个字符\) |
| `processor` | string | 否 | 计算级别：base、lite、pro、ultra、ultra2x、ultra4x、ultra8x \(默认值：base\) |
| `include_domains` | string | 否 | 限制研究范围的以逗号分隔的域名列表 \(来源策略\) |
| `exclude_domains` | string | 否 | 从研究中排除的以逗号分隔的域名列表 \(来源策略\) |
| `apiKey` | string | 是 | Parallel AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `status` | string | 任务状态（已完成，失败） |
| `run_id` | string | 此研究任务的唯一 ID |
| `message` | string | 状态消息 |
| `content` | object | 研究结果（基于 output_schema 结构化） |
| `basis` | array | 引用和来源，包括推理和置信度等级 |

## 注意

- 类别：`tools`
- 类型：`parallel_ai`
```

--------------------------------------------------------------------------------

---[FILE: perplexity.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/perplexity.mdx

```text
---
title: Perplexity
description: 使用 Perplexity AI 进行聊天和搜索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="perplexity"
  color="#20808D"
/>

{/* MANUAL-CONTENT-START:intro */}
[Perplexity AI](https://www.perplexity.ai) 是一个由 AI 驱动的搜索引擎和答案引擎，它结合了大型语言模型的能力与实时网络搜索，提供准确、最新的信息以及复杂问题的全面答案。

使用 Perplexity AI，您可以：

- **获取准确答案**：通过可靠来源的引用，获得全面的问题解答
- **访问实时信息**：通过 Perplexity 的网络搜索功能获取最新信息
- **深入探索主题**：通过后续问题和相关信息更深入地研究主题
- **验证信息**：通过提供的来源和参考检查答案的可信度
- **生成内容**：基于当前信息创建摘要、分析和创意内容
- **高效研究**：通过对复杂查询的全面解答简化研究过程
- **互动式对话**：通过自然对话优化问题并探索主题

在 Sim 中，Perplexity 集成使您的代理能够以编程方式利用这些强大的 AI 功能作为其工作流程的一部分。这允许创建结合自然语言理解、实时信息检索和内容生成的复杂自动化场景。您的代理可以制定查询，接收带有引用的全面答案，并将这些信息整合到其决策过程或输出中。此集成弥合了工作流程自动化与获取当前可靠信息之间的差距，使您的代理能够做出更明智的决策并提供更准确的响应。通过将 Sim 与 Perplexity 连接，您可以创建能够跟上最新信息、提供经过充分研究的答案并为用户提供更有价值见解的代理——这一切都无需手动研究或信息收集。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Perplexity 集成到工作流程中。可以使用 Perplexity AI 聊天模型生成补全，或通过高级过滤执行网页搜索。

## 工具

### `perplexity_chat`

使用 Perplexity AI 聊天模型生成补全内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | 否 | 指导模型行为的系统提示 |
| `content` | string | 是 | 发送给模型的用户消息内容 |
| `model` | string | 是 | 用于聊天补全的模型（例如：sonar，mistral） |
| `max_tokens` | number | 否 | 要生成的最大 token 数量 |
| `temperature` | number | 否 | 介于 0 和 1 之间的采样温度 |
| `apiKey` | string | 是 | Perplexity API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 生成的文本内容 |
| `model` | string | 用于生成的模型 |
| `usage` | object | 令牌使用信息 |

### `perplexity_search`

从 Perplexity 获取排名搜索结果

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 搜索查询或查询数组（多查询搜索最多 5 个） |
| `max_results` | number | 否 | 返回的最大搜索结果数量（1-20，默认值：10） |
| `search_domain_filter` | array | 否 | 限制搜索结果的域名/URL 列表（最多 20 个） |
| `max_tokens_per_page` | number | 否 | 从每个网页检索的最大令牌数（默认值：1024） |
| `country` | string | 否 | 用于过滤搜索结果的国家代码（例如：US、GB、DE） |
| `search_recency_filter` | string | 否 | 按最近时间过滤结果：小时、天、周、月或年 |
| `search_after_date` | string | 否 | 仅包含此日期之后发布的内容（格式：MM/DD/YYYY） |
| `search_before_date` | string | 否 | 仅包含此日期之前发布的内容（格式：MM/DD/YYYY） |
| `apiKey` | string | 是 | Perplexity API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 搜索结果数组 |

## 注意事项

- 类别：`tools`
- 类型：`perplexity`
```

--------------------------------------------------------------------------------

---[FILE: pinecone.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/pinecone.mdx

```text
---
title: Pinecone
description: 使用 Pinecone 向量数据库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pinecone"
  color="#0D1117"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pinecone](https://www.pinecone.io) 是一个专为构建高性能向量搜索应用程序而设计的向量数据库。它能够高效存储、管理和进行高维向量嵌入的相似性搜索，非常适合需要语义搜索功能的 AI 应用程序。

使用 Pinecone，您可以：

- **存储向量嵌入**：高效管理大规模高维向量
- **执行相似性搜索**：在毫秒内找到与查询向量最相似的向量
- **构建语义搜索**：创建基于意义而非关键词的搜索体验
- **实现推荐系统**：基于内容相似性生成个性化推荐
- **部署机器学习模型**：运行依赖向量相似性的机器学习模型
- **无缝扩展**：处理数十亿个向量并保持一致的性能
- **维护实时索引**：随着新数据的到来实时更新您的向量数据库

在 Sim 中，Pinecone 集成使您的代理能够以编程方式利用向量搜索功能作为其工作流程的一部分。这允许结合自然语言处理与语义搜索和检索的复杂自动化场景。您的代理可以从文本生成嵌入，将这些向量存储在 Pinecone 索引中，并执行相似性搜索以找到最相关的信息。此集成弥合了您的 AI 工作流程与向量搜索基础设施之间的差距，使信息检索更加智能化，基于语义意义而非精确的关键词匹配。通过将 Sim 与 Pinecone 连接，您可以创建能够理解上下文、从大型数据集中检索相关信息并向用户提供更准确和个性化响应的代理——这一切无需复杂的基础设施管理或向量数据库的专业知识。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Pinecone 集成到工作流程中。可以生成嵌入、插入文本、使用文本搜索、获取向量以及使用向量搜索。需要 API 密钥。

## 工具

### `pinecone_generate_embeddings`

使用 Pinecone 从文本生成嵌入

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `model` | 字符串 | 是 | 用于生成嵌入的模型 |
| `inputs` | 数组 | 是 | 要生成嵌入的文本输入数组 |
| `apiKey` | 字符串 | 是 | Pinecone API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | 数组 | 包含值和向量类型的生成嵌入数据 |
| `model` | 字符串 | 用于生成嵌入的模型 |
| `vector_type` | 字符串 | 生成的向量类型（密集/稀疏） |
| `usage` | 对象 | 嵌入生成的使用统计数据 |

### `pinecone_upsert_text`

在 Pinecone 索引中插入或更新文本记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | 是 | 完整的 Pinecone 索引主机 URL |
| `namespace` | string | 是 | 要插入记录的命名空间 |
| `records` | array | 是 | 要插入的记录或记录数组，每个记录包含 _id、文本和可选的元数据 |
| `apiKey` | string | 是 | Pinecone API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `statusText` | string | 插入操作的状态 |
| `upsertedCount` | number | 成功插入的记录数量 |

### `pinecone_search_text`

在 Pinecone 索引中搜索相似文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | 是 | 完整的 Pinecone 索引主机 URL |
| `namespace` | string | 否 | 要搜索的命名空间 |
| `searchQuery` | string | 是 | 要搜索的文本 |
| `topK` | string | 否 | 要返回的结果数量 |
| `fields` | array | 否 | 结果中要返回的字段 |
| `filter` | object | 否 | 要应用于搜索的过滤器 |
| `rerank` | object | 否 | 重排序参数 |
| `apiKey` | string | 是 | Pinecone API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `matches` | array | 包含 ID、分数和元数据的搜索结果 |

### `pinecone_search_vector`

在 Pinecone 索引中搜索相似向量

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | 是 | 完整的 Pinecone 索引主机 URL |
| `namespace` | string | 否 | 要搜索的命名空间 |
| `vector` | array | 是 | 要搜索的向量 |
| `topK` | number | 否 | 要返回的结果数量 |
| `filter` | object | 否 | 要应用于搜索的过滤器 |
| `includeValues` | boolean | 否 | 在响应中包含向量值 |
| `includeMetadata` | boolean | 否 | 在响应中包含元数据 |
| `apiKey` | string | 是 | Pinecone API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `matches` | array | 包含 ID、分数、值和元数据的向量搜索结果 |
| `namespace` | string | 执行搜索的命名空间 |

### `pinecone_fetch`

从 Pinecone 索引中通过 ID 获取向量

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | 是 | 完整的 Pinecone 索引主机 URL |
| `ids` | array | 是 | 要获取的向量 ID 数组 |
| `namespace` | string | 否 | 要从中获取向量的命名空间 |
| `apiKey` | string | 是 | Pinecone API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `matches` | 数组 | 包含 ID、值、元数据和分数的获取向量 |

## 注意事项

- 类别：`tools`
- 类型：`pinecone`
```

--------------------------------------------------------------------------------

---[FILE: pipedrive.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/pipedrive.mdx

```text
---
title: Pipedrive
description: 与 Pipedrive CRM 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pipedrive"
  color="#2E6936"
/>

【手动内容开始：简介】
[Pipedrive](https://www.pipedrive.com) 是一个强大的以销售为中心的 CRM 平台，旨在帮助销售团队管理潜在客户、跟踪交易并优化销售流程。Pipedrive 以其简单性和高效性而设计，凭借直观的可视化销售流程管理和可操作的销售洞察，已成为全球销售专业人士和成长型企业的首选。

Pipedrive 提供了一整套工具，用于管理从潜在客户获取到交易完成的整个销售过程。凭借其强大的 API 和广泛的集成能力，Pipedrive 使销售团队能够自动化重复任务，保持数据一致性，并专注于最重要的事情——完成交易。

Pipedrive 的主要功能包括：

- 可视化销售流程：直观的拖放界面，用于通过可自定义的销售阶段管理交易
- 潜在客户管理：全面的潜在客户收件箱，用于捕获、筛选和转化潜在机会
- 活动跟踪：先进的系统，用于安排和跟踪电话、会议、电子邮件和任务
- 项目管理：内置的项目跟踪功能，用于售后客户成功和交付
- 邮件集成：原生邮箱集成，实现 CRM 内的无缝通信跟踪

在 Sim 中，Pipedrive 集成使您的 AI 代理能够无缝地与销售工作流程交互。这为自动化潜在客户资格审查、交易创建和更新、活动安排以及管道管理创造了机会，成为您 AI 驱动的销售流程的一部分。通过集成，代理可以以编程方式创建、检索、更新和管理交易、潜在客户、活动和项目，从而促进智能销售自动化，并确保关键的客户信息得到妥善跟踪和处理。通过将 Sim 与 Pipedrive 连接，您可以构建能够维护销售管道可见性、自动化日常 CRM 任务、智能地筛选潜在客户并确保不遗漏任何机会的 AI 代理，从而提高销售团队的生产力并推动持续的收入增长。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Pipedrive 集成到您的工作流程中。通过强大的 CRM 功能管理交易、联系人、销售管道、项目、活动、文件和通信。

## 工具

### `pipedrive_get_all_deals`

使用可选过滤器从 Pipedrive 检索所有交易

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `status` | string | 否 | 仅获取具有特定状态的交易。值：open, won, lost。如果省略，则返回所有未删除的交易 |
| `person_id` | string | 否 | 如果提供，仅返回与指定人员相关的交易 |
| `org_id` | string | 否 | 如果提供，仅返回与指定组织相关的交易 |
| `pipeline_id` | string | 否 | 如果提供，仅返回指定管道中的交易 |
| `updated_since` | string | 否 | 如果设置，仅返回在此时间之后更新的交易。格式：2025-01-01T10:20:00Z |
| `limit` | string | 否 | 返回结果的数量 \(默认：100，最大：500\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deals` | array | 来自 Pipedrive 的交易对象数组 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_deal`

检索特定交易的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | 是 | 要检索的交易 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deal` | object | 包含完整详细信息的交易对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_create_deal`

在 Pipedrive 中创建新交易

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | string | 是 | 交易标题 |
| `value` | string | 否 | 交易金额 |
| `currency` | string | 否 | 货币代码（例如，USD，EUR） |
| `person_id` | string | 否 | 与此交易关联的人员 ID |
| `org_id` | string | 否 | 与此交易关联的组织 ID |
| `pipeline_id` | string | 否 | 此交易应放置的管道 ID |
| `stage_id` | string | 否 | 此交易应放置的阶段 ID |
| `status` | string | 否 | 交易状态：open, won, lost |
| `expected_close_date` | string | 否 | 预期关闭日期，格式为 YYYY-MM-DD |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deal` | object | 创建的交易对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_update_deal`

更新 Pipedrive 中的现有交易

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | 是 | 要更新的交易 ID |
| `title` | string | 否 | 交易的新标题 |
| `value` | string | 否 | 交易的新金额 |
| `status` | string | 否 | 新状态：open, won, lost |
| `stage_id` | string | 否 | 交易的新阶段 ID |
| `expected_close_date` | string | 否 | 新的预期关闭日期，格式为 YYYY-MM-DD |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deal` | object | 更新的交易对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_files`

使用可选过滤器从 Pipedrive 检索文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | 否 | 按交易 ID 过滤文件 |
| `person_id` | string | 否 | 按人员 ID 过滤文件 |
| `org_id` | string | 否 | 按组织 ID 过滤文件 |
| `limit` | string | 否 | 返回结果数量 \(默认值：100，最大值：500\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `files` | array | 来自 Pipedrive 的文件对象数组 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_mail_messages`

从 Pipedrive 邮箱中检索邮件线程

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `folder` | string | 否 | 按文件夹筛选：收件箱、草稿、已发送、归档 \(默认：收件箱\) |
| `limit` | string | 否 | 返回结果数量 \(默认：50\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `messages` | array | 来自 Pipedrive 邮箱的邮件线程对象数组 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_mail_thread`

从特定邮件线程中检索所有消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `thread_id` | string | 是 | 邮件线程的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `messages` | array | 邮件线程中的邮件消息对象数组 |
| `metadata` | object | 包含线程 ID 的操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_pipelines`

从 Pipedrive 中检索所有管道

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `sort_by` | string | 否 | 排序字段：id、update_time、add_time \(默认：id\) |
| `sort_direction` | string | 否 | 排序方向：asc、desc \(默认：asc\) |
| `limit` | string | 否 | 返回结果数量 \(默认：100，最大：500\) |
| `cursor` | string | 否 | 用于分页，表示下一页第一个项目的标记 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pipelines` | array | 来自 Pipedrive 的管道对象数组 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_pipeline_deals`

检索特定管道中的所有交易

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pipeline_id` | string | 是 | 管道的 ID |
| `stage_id` | string | 否 | 按管道中的特定阶段筛选 |
| `status` | string | 否 | 按交易状态筛选：open、won、lost |
| `limit` | string | 否 | 返回结果数量 \(默认：100，最大：500\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deals` | array | 管道中的交易对象数组 |
| `metadata` | object | 包含管道 ID 的操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_projects`

从 Pipedrive 检索所有项目或特定项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | 否 | 可选：要检索的特定项目的 ID |
| `status` | string | 否 | 按项目状态筛选：open、completed、deleted \(仅用于列出所有项目\) |
| `limit` | string | 否 | 返回结果数量 \(默认：100，最大：500，仅用于列出所有项目\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `projects` | array | 项目对象数组（列出所有项目时） |
| `project` | object | 单个项目对象（提供 project_id 时） |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_create_project`

在 Pipedrive 中创建一个新项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | string | 是 | 项目的标题 |
| `description` | string | 否 | 项目的描述 |
| `start_date` | string | 否 | 项目开始日期，格式为 YYYY-MM-DD |
| `end_date` | string | 否 | 项目结束日期，格式为 YYYY-MM-DD |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `project` | object | 创建的项目对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_activities`

从 Pipedrive 检索活动（任务），可选过滤器

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | 否 | 按交易 ID 过滤活动 |
| `person_id` | string | 否 | 按人员 ID 过滤活动 |
| `org_id` | string | 否 | 按组织 ID 过滤活动 |
| `type` | string | 否 | 按活动类型过滤 \(通话、会议、任务、截止日期、电子邮件、午餐\) |
| `done` | string | 否 | 按完成状态过滤：0 表示未完成，1 表示已完成 |
| `limit` | string | 否 | 返回结果数量 \(默认：100，最大：500\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `activities` | array | 来自 Pipedrive 的活动对象数组 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_create_activity`

在 Pipedrive 中创建一个新活动（任务）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `subject` | string | 是 | 活动的主题/标题 |
| `type` | string | 是 | 活动类型：通话、会议、任务、截止日期、电子邮件、午餐 |
| `due_date` | string | 是 | YYYY-MM-DD 格式的截止日期 |
| `due_time` | string | 否 | HH:MM 格式的截止时间 |
| `duration` | string | 否 | HH:MM 格式的持续时间 |
| `deal_id` | string | 否 | 要关联的交易 ID |
| `person_id` | string | 否 | 要关联的人员 ID |
| `org_id` | string | 否 | 要关联的组织 ID |
| `note` | string | 否 | 活动备注 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `activity` | object | 创建的活动对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_update_activity`

更新 Pipedrive 中的现有活动（任务）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `activity_id` | string | 是 | 要更新的活动 ID |
| `subject` | string | 否 | 活动的新主题/标题 |
| `due_date` | string | 否 | 新的截止日期（YYYY-MM-DD 格式） |
| `due_time` | string | 否 | 新的截止时间（HH:MM 格式） |
| `duration` | string | 否 | 新的持续时间（HH:MM 格式） |
| `done` | string | 否 | 标记为完成：0 表示未完成，1 表示已完成 |
| `note` | string | 否 | 活动的新备注 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `activity` | object | 更新的活动对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_get_leads`

从 Pipedrive 检索所有潜在客户或特定潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | 否 | 可选：要检索的特定潜在客户的 ID |
| `archived` | string | 否 | 获取已归档的潜在客户而不是活跃的潜在客户 |
| `owner_id` | string | 否 | 按所有者用户 ID 过滤 |
| `person_id` | string | 否 | 按人员 ID 过滤 |
| `organization_id` | string | 否 | 按组织 ID 过滤 |
| `limit` | string | 否 | 返回结果数量 \(默认：100，最大：500\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `leads` | array | 潜在客户对象数组（列出所有时） |
| `lead` | object | 单个潜在客户对象（提供 lead_id 时） |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_create_lead`

在 Pipedrive 中创建一个新的潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | string | 是 | 潜在客户的名称 |
| `person_id` | string | 否 | 人员的 ID \(必需，除非提供了 organization_id\) |
| `organization_id` | string | 否 | 组织的 ID \(必需，除非提供了 person_id\) |
| `owner_id` | string | 否 | 将拥有该潜在客户的用户的 ID |
| `value_amount` | string | 否 | 潜在价值金额 |
| `value_currency` | string | 否 | 货币代码 \(例如，USD，EUR\) |
| `expected_close_date` | string | 否 | 预期关闭日期，格式为 YYYY-MM-DD |
| `visible_to` | string | 否 | 可见性：1 \(所有者和关注者\)，3 \(整个公司\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `lead` | object | 创建的潜在客户对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_update_lead`

更新 Pipedrive 中的现有潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | 是 | 要更新的潜在客户的 ID |
| `title` | string | 否 | 潜在客户的新名称 |
| `person_id` | string | 否 | 新的联系人 ID |
| `organization_id` | string | 否 | 新的组织 ID |
| `owner_id` | string | 否 | 新的所有者用户 ID |
| `value_amount` | string | 否 | 新的价值金额 |
| `value_currency` | string | 否 | 新的货币代码 \(例如，USD，EUR\) |
| `expected_close_date` | string | 否 | 新的预期关闭日期，格式为 YYYY-MM-DD |
| `is_archived` | string | 否 | 是否归档潜在客户：true 或 false |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `lead` | object | 更新的潜在客户对象 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

### `pipedrive_delete_lead`

从 Pipedrive 中删除特定潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | 是 | 要删除的潜在客户的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | object | 删除确认数据 |
| `metadata` | object | 操作元数据 |
| `success` | boolean | 操作成功状态 |

## 注意事项

- 类别: `tools`
- 类型: `pipedrive`
```

--------------------------------------------------------------------------------

````

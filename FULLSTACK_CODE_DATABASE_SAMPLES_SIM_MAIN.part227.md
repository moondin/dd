---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 227
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 227 of 933)

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

---[FILE: dropbox.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/dropbox.mdx

```text
---
title: Dropbox
description: 在 Dropbox 中上传、下载、分享和管理文件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dropbox"
  color="#0061FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Dropbox](https://dropbox.com/) 是一个流行的云存储和协作平台，能够让个人和团队安全地存储、访问和分享文件，无论身在何处。Dropbox 专为便捷的文件管理、同步和强大的协作而设计，无论您是单独工作还是与团队合作。

在 Sim 中使用 Dropbox，您可以：

- **上传和下载文件**：无缝上传任何文件到您的 Dropbox 或按需检索内容
- **列出文件夹内容**：浏览任何 Dropbox 目录中的文件和文件夹
- **创建新文件夹**：通过编程方式在您的 Dropbox 中创建新文件夹以组织文件
- **搜索文件和文件夹**：通过名称或内容定位文档、图片或其他项目
- **生成共享链接**：快速为文件和文件夹创建可分享的公共或私人链接
- **管理文件**：在自动化工作流中移动、删除或重命名文件和文件夹

这些功能使您的 Sim 代理能够直接在工作流中自动化 Dropbox 操作——从备份重要文件到分发内容以及维护有序的文件夹。将 Dropbox 用作文件的来源和目的地，使云存储管理成为您业务流程的一部分。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Dropbox 集成到您的工作流中，用于文件管理、分享和协作。上传文件、下载内容、创建文件夹、管理共享链接等。

## 工具

### `dropbox_upload`

上传文件到 Dropbox

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 文件应保存到 Dropbox 的路径 \(例如：/folder/document.pdf\) |
| `fileContent` | string | 是 | 要上传文件的 base64 编码内容 |
| `fileName` | string | 否 | 可选文件名 \(如果路径是文件夹时使用\) |
| `mode` | string | 否 | 写入模式：add \(默认\) 或 overwrite |
| `autorename` | boolean | 否 | 如果为 true，在发生冲突时重命名文件 |
| `mute` | boolean | 否 | 如果为 true，不通知用户此上传 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | object | 上传文件的元数据 |

### `dropbox_download`

从 Dropbox 下载文件并获取临时链接

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 要下载文件的路径 \(例如：/folder/document.pdf\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | object | 文件的元数据 |

### `dropbox_list_folder`

列出 Dropbox 文件夹的内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 要列出内容的文件夹路径 \(根目录使用 ""\) |
| `recursive` | boolean | 否 | 如果为 true，则递归列出内容 |
| `includeDeleted` | boolean | 否 | 如果为 true，则包括已删除的文件/文件夹 |
| `includeMediaInfo` | boolean | 否 | 如果为 true，则包括照片/视频的媒体信息 |
| `limit` | number | 否 | 要返回的最大结果数 \(默认值：500\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `entries` | array | 目录中的文件和文件夹列表 |

### `dropbox_create_folder`

在 Dropbox 中创建一个新文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 创建文件夹的路径 \(例如：/new-folder\) |
| `autorename` | boolean | 否 | 如果有冲突，是否重命名文件夹 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `folder` | object | 创建的文件夹元数据 |

### `dropbox_delete`

删除 Dropbox 中的文件或文件夹（移至回收站）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 要删除的文件或文件夹的路径 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `metadata` | object | 已删除项目的元数据 |

### `dropbox_copy`

复制 Dropbox 中的文件或文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | 是 | 要复制的文件或文件夹的源路径 |
| `toPath` | string | 是 | 复制文件或文件夹的目标路径 |
| `autorename` | boolean | 否 | 如果为 true，则在目标位置存在冲突时重命名文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `metadata` | object | 已复制项目的元数据 |

### `dropbox_move`

移动或重命名 Dropbox 中的文件或文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | 是 | 要移动的文件或文件夹的源路径 |
| `toPath` | string | 是 | 移动文件或文件夹的目标路径 |
| `autorename` | boolean | 否 | 如果为 true，则在目标位置存在冲突时重命名文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `metadata` | object | 已移动项目的元数据 |

### `dropbox_get_metadata`

获取 Dropbox 中文件或文件夹的元数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 要获取元数据的文件或文件夹路径 |
| `includeMediaInfo` | boolean | 否 | 如果为 true，则包含照片/视频的媒体信息 |
| `includeDeleted` | boolean | 否 | 如果为 true，则在结果中包含已删除的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `metadata` | object | 文件或文件夹的元数据 |

### `dropbox_create_shared_link`

为 Dropbox 中的文件或文件夹创建可共享链接

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `path` | string | 是 | 要共享的文件或文件夹路径 |
| `requestedVisibility` | string | 否 | 可见性：public、team_only 或 password |
| `linkPassword` | string | 否 | 共享链接的密码（仅当可见性为 password 时） |
| `expires` | string | 否 | ISO 8601 格式的过期日期（例如：2025-12-31T23:59:59Z） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `sharedLink` | object | 创建的共享链接 |

### `dropbox_search`

在 Dropbox 中搜索文件和文件夹

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 搜索查询 |
| `path` | string | 否 | 将搜索限制在特定文件夹路径内 |
| `fileExtensions` | string | 否 | 用逗号分隔的文件扩展名列表进行过滤（例如：pdf,xlsx） |
| `maxResults` | number | 否 | 返回的最大结果数（默认值：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `matches` | array | 搜索结果 |

## 注意

- 类别：`tools`
- 类型：`dropbox`
```

--------------------------------------------------------------------------------

---[FILE: duckduckgo.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/duckduckgo.mdx

```text
---
title: DuckDuckGo
description: 使用 DuckDuckGo 搜索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="duckduckgo"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DuckDuckGo](https://duckduckgo.com/) 是一个注重隐私的网页搜索引擎，提供即时答案、摘要、相关主题等功能——无需跟踪您或您的搜索记录。DuckDuckGo 让您无需用户画像或定向广告即可轻松获取信息。

在 Sim 中使用 DuckDuckGo，您可以：

- **搜索网页**：即时找到答案、事实和搜索查询的概述
- **获取直接答案**：检索计算、转换或事实查询的具体响应
- **访问摘要**：接收搜索主题的简短总结或描述
- **获取相关主题**：发现与搜索相关的链接和参考资料
- **过滤输出**：可选择移除 HTML 或跳过歧义消解以获得更简洁的结果

这些功能使您的 Sim 代理能够自动访问最新的网络知识——从在工作流程中呈现事实，到通过最新信息丰富文档和分析。由于 DuckDuckGo 的即时答案 API 是开放的且不需要 API 密钥，因此集成到您的自动化业务流程中既简单又安全。
{/* MANUAL-CONTENT-END */}

## 使用说明

使用 DuckDuckGo 即时答案 API 搜索网页。返回即时答案、摘要、相关主题等。无需 API 密钥即可免费使用。

## 工具

### `duckduckgo_search`

使用 DuckDuckGo 即时答案 API 搜索网页。返回查询的即时答案、摘要和相关主题。无需 API 密钥即可免费使用。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 要执行的搜索查询 |
| `noHtml` | boolean | 否 | 从结果文本中移除 HTML \(默认值: true\) |
| `skipDisambig` | boolean | 否 | 跳过歧义消解结果 \(默认值: false\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `heading` | string | 即时答案的标题 |
| `abstract` | string | 主题的简短摘要 |
| `abstractText` | string | 摘要的纯文本版本 |
| `abstractSource` | string | 摘要的来源（例如，Wikipedia） |
| `abstractURL` | string | 摘要来源的 URL |
| `image` | string | 与主题相关的图片的 URL |
| `answer` | string | 如果可用，直接答案（例如，用于计算） |
| `answerType` | string | 答案的类型（例如，calc，ip 等） |
| `type` | string | 响应类型：A（文章），D（消歧），C（类别），N（名称），E（独占） |
| `relatedTopics` | array | 包含相关主题及其 URL 和描述的数组 |

## 注意事项

- 类别：`tools`
- 类型：`duckduckgo`
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/dynamodb.mdx

```text
---
title: Amazon DynamoDB
description: 连接到 Amazon DynamoDB
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dynamodb"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) 是 AWS 提供的一项完全托管的 NoSQL 数据库服务，具有快速且可预测的性能，并支持无缝扩展。DynamoDB 允许您存储和检索任意数量的数据，并处理任何级别的请求流量，而无需您管理硬件或基础设施。

使用 DynamoDB，您可以：

- **获取项目**：使用主键查找表中的项目
- **添加项目**：在表中添加或替换项目
- **查询项目**：通过索引查询检索多个项目
- **扫描表**：读取表中的全部或部分数据
- **更新项目**：修改现有项目的特定属性
- **删除项目**：从表中移除记录

在 Sim 中，DynamoDB 集成使您的代理能够使用 AWS 凭证安全地访问和操作 DynamoDB 表。支持的操作包括：

- **获取**：通过键检索项目
- **添加**：插入或覆盖项目
- **查询**：使用键条件和过滤器运行查询
- **扫描**：通过扫描表或索引读取多个项目
- **更新**：更改一个或多个项目的特定属性
- **删除**：从表中移除项目

此集成使 Sim 代理能够以编程方式自动化管理 DynamoDB 表中的数据管理任务，从而构建无需手动操作或服务器管理的工作流，来管理、修改和检索可扩展的 NoSQL 数据。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Amazon DynamoDB 集成到工作流中。支持对 DynamoDB 表执行获取、添加、查询、扫描、更新和删除操作。

## 工具

### `dynamodb_get`

通过主键从 DynamoDB 表中获取一个项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `accessKeyId` | string | 是 | AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | AWS 秘密访问密钥 |
| `tableName` | string | 是 | DynamoDB 表名 |
| `key` | object | 是 | 要检索的项目主键 |
| `consistentRead` | boolean | 否 | 使用强一致性读取 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `item` | object | 检索到的项目 |

### `dynamodb_put`

将一个项目放入 DynamoDB 表中

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `accessKeyId` | string | 是 | AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | AWS 秘密访问密钥 |
| `tableName` | string | 是 | DynamoDB 表名 |
| `item` | object | 是 | 要放入表中的项目 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `item` | object | 创建的项目 |

### `dynamodb_query`

使用键条件从 DynamoDB 表中查询项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `accessKeyId` | string | 是 | AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | AWS 秘密访问密钥 |
| `tableName` | string | 是 | DynamoDB 表名 |
| `keyConditionExpression` | string | 是 | 键条件表达式 \(例如，"pk = :pk"\) |
| `filterExpression` | string | 否 | 结果的过滤表达式 |
| `expressionAttributeNames` | object | 否 | 保留字的属性名称映射 |
| `expressionAttributeValues` | object | 否 | 表达式属性值 |
| `indexName` | string | 否 | 要查询的二级索引名称 |
| `limit` | number | 否 | 要返回的最大项目数 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `items` | array | 返回的项目数组 |
| `count` | number | 返回的项目数量 |

### `dynamodb_scan`

扫描 DynamoDB 表中的所有项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `accessKeyId` | string | 是 | AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | AWS 秘密访问密钥 |
| `tableName` | string | 是 | DynamoDB 表名 |
| `filterExpression` | string | 否 | 结果的过滤表达式 |
| `projectionExpression` | string | 否 | 要检索的属性 |
| `expressionAttributeNames` | object | 否 | 保留字的属性名称映射 |
| `expressionAttributeValues` | object | 否 | 表达式属性值 |
| `limit` | number | 否 | 要返回的最大项目数 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `items` | array | 返回的项目数组 |
| `count` | number | 返回的项目数量 |

### `dynamodb_update`

更新 DynamoDB 表中的项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `accessKeyId` | string | 是 | AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | AWS 秘密访问密钥 |
| `tableName` | string | 是 | DynamoDB 表名 |
| `key` | object | 是 | 要更新项目的主键 |
| `updateExpression` | string | 是 | 更新表达式 \(例如，"SET #name = :name"\) |
| `expressionAttributeNames` | object | 否 | 保留字的属性名称映射 |
| `expressionAttributeValues` | object | 否 | 表达式属性值 |
| `conditionExpression` | string | 否 | 更新成功所需满足的条件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `item` | object | 更新后的项目 |

### `dynamodb_delete`

从 DynamoDB 表中删除项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `accessKeyId` | string | 是 | AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | AWS 秘密访问密钥 |
| `tableName` | string | 是 | DynamoDB 表名 |
| `key` | object | 是 | 要删除项目的主键 |
| `conditionExpression` | string | 否 | 删除成功所需满足的条件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |

## 注意

- 类别: `tools`
- 类型: `dynamodb`
```

--------------------------------------------------------------------------------

---[FILE: elasticsearch.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/elasticsearch.mdx

```text
---
title: Elasticsearch
description: 在 Elasticsearch 中搜索、索引和管理数据
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elasticsearch"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Elasticsearch](https://www.elastic.co/elasticsearch/) 是一个功能强大的分布式搜索和分析引擎，可以让您实时索引、搜索和分析海量数据。它被广泛用于支持搜索功能、日志和事件数据分析、可观测性等。

在 Sim 中使用 Elasticsearch，您可以以编程方式访问 Elasticsearch 的核心功能，包括：

- **搜索文档**：使用 Query DSL 对结构化或非结构化文本执行高级搜索，支持排序、分页和字段选择。
- **索引文档**：在任何 Elasticsearch 索引中添加新文档或更新现有文档，以便即时检索和分析。
- **获取、更新或删除文档**：通过 ID 检索、修改或删除特定文档。
- **批量操作**：在单个请求中执行多个索引或更新操作，以实现高吞吐量的数据处理。
- **管理索引**：在工作流自动化中创建、删除或获取索引的详细信息。
- **集群监控**：检查 Elasticsearch 部署的健康状况和统计信息。

Sim 的 Elasticsearch 工具支持自托管和 Elastic Cloud 环境。将 Elasticsearch 集成到您的代理工作流中，以自动化数据摄取、跨大型数据集搜索、运行报告或构建自定义搜索驱动的应用程序——无需人工干预。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Elasticsearch 集成到工作流中，实现强大的搜索、索引和数据管理。支持文档的 CRUD 操作、高级搜索查询、批量操作、索引管理和集群监控。适用于自托管和 Elastic Cloud 部署。

## 工具

### `elasticsearch_search`

使用 Query DSL 在 Elasticsearch 中搜索文档。返回匹配的文档及其分数和元数据。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管） |
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署） |
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 要搜索的索引名称 |
| `query` | string | 否 | 作为 JSON 字符串的 Query DSL |
| `from` | number | 否 | 分页的起始偏移量（默认值：0） |
| `size` | number | 否 | 返回结果的数量（默认值：10） |
| `sort` | string | 否 | 作为 JSON 字符串的排序规范 |
| `sourceIncludes` | string | 否 | 逗号分隔的字段列表以包含在 _source 中 |
| `sourceExcludes` | string | 否 | 逗号分隔的字段列表以从 _source 中排除 |
| `trackTotalHits` | boolean | 否 | 跟踪准确的总命中计数（默认值：true） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `took` | number | 搜索所花费的时间（以毫秒为单位） |
| `timed_out` | boolean | 搜索是否超时 |
| `hits` | object | 包含总数和匹配文档的搜索结果 |
| `aggregations` | json | 聚合结果（如果有） |

### `elasticsearch_index_document`

在 Elasticsearch 中索引（创建或更新）文档。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 目标索引名称 |
| `documentId` | string | 否 | 文档 ID（如果未提供则自动生成）|
| `document` | string | 是 | 文档正文，格式为 JSON 字符串 |
| `refresh` | string | 否 | 刷新策略：true、false 或 wait_for |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `_index` | string | 文档存储的索引 |
| `_id` | string | 文档 ID |
| `_version` | number | 文档版本 |
| `result` | string | 操作结果（创建或更新）|

### `elasticsearch_get_document`

通过 ID 从 Elasticsearch 检索文档。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 索引名称 |
| `documentId` | string | 是 | 要检索的文档 ID |
| `sourceIncludes` | string | 否 | 要包含的字段的逗号分隔列表 |
| `sourceExcludes` | string | 否 | 要排除的字段的逗号分隔列表 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `_index` | string | 索引名称 |
| `_id` | string | 文档 ID |
| `_version` | number | 文档版本 |
| `found` | boolean | 文档是否被找到 |
| `_source` | json | 文档内容 |

### `elasticsearch_update_document`

使用 doc merge 部分更新 Elasticsearch 中的文档。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管） |
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署） |
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 索引名称 |
| `documentId` | string | 是 | 要更新的文档 ID |
| `document` | string | 是 | 要合并的部分文档（JSON 字符串） |
| `retryOnConflict` | number | 否 | 版本冲突时的重试次数 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `_index` | string | 索引名称 |
| `_id` | string | 文档 ID |
| `_version` | number | 新的文档版本 |
| `result` | string | 操作结果（updated 或 noop） |

### `elasticsearch_delete_document`

通过 ID 从 Elasticsearch 中删除文档。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 索引名称 |
| `documentId` | string | 是 | 要删除的文档 ID |
| `refresh` | string | 否 | 刷新策略：true、false 或 wait_for |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `_index` | string | 索引名称 |
| `_id` | string | 文档 ID |
| `_version` | number | 文档版本 |
| `result` | string | 操作结果（deleted 或 not_found）|

### `elasticsearch_bulk`

在单个请求中执行多个索引、创建、删除或更新操作以实现高性能。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 否 | 未指定索引时的默认索引 |
| `operations` | string | 是 | 批量操作的 NDJSON 字符串（换行分隔的 JSON）|
| `refresh` | string | 否 | 刷新策略：true、false 或 wait_for |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `took` | number | 批量操作所花费的时间（以毫秒为单位） |
| `errors` | boolean | 是否有任何操作出现错误 |
| `items` | array | 每个操作的结果 |

### `elasticsearch_count`

统计 Elasticsearch 中符合查询条件的文档数量。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管） |
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署） |
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 要统计文档数量的索引名称 |
| `query` | string | 否 | 用于过滤文档的可选查询（JSON 字符串） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `count` | number | 符合查询条件的文档数量 |
| `_shards` | object | 分片统计信息 |

### `elasticsearch_create_index`

创建一个具有可选设置和映射的新索引。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管） |
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署） |
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 要创建的索引名称 |
| `settings` | string | 否 | 索引设置（JSON 字符串） |
| `mappings` | string | 否 | 索引映射（JSON 字符串） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | 请求是否被确认 |
| `shards_acknowledged` | boolean | 分片是否被确认 |
| `index` | string | 创建的索引名称 |

### `elasticsearch_delete_index`

删除一个索引及其所有文档。此操作不可逆。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 要删除的索引名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | 删除是否被确认 |

### `elasticsearch_get_index`

检索索引信息，包括设置、映射和别名。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `index` | string | 是 | 要检索信息的索引名称 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `index` | json | 包括别名、映射和设置的索引信息 |

### `elasticsearch_cluster_health`

获取 Elasticsearch 集群的健康状态。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管）|
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署）|
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |
| `waitForStatus` | string | 否 | 等待集群达到此状态：green、yellow 或 red |
| `timeout` | string | 否 | 等待操作的超时时间（例如，30s，1m）|

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `cluster_name` | string | 集群名称 |
| `status` | string | 集群健康状态：green、yellow 或 red |
| `number_of_nodes` | number | 集群中的节点总数 |
| `number_of_data_nodes` | number | 数据节点的数量 |
| `active_shards` | number | 活跃分片的数量 |
| `unassigned_shards` | number | 未分配分片的数量 |

### `elasticsearch_cluster_stats`

获取有关 Elasticsearch 集群的综合统计信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | 是 | 部署类型：self_hosted 或 cloud |
| `host` | string | 否 | Elasticsearch 主机 URL（适用于自托管） |
| `cloudId` | string | 否 | Elastic Cloud ID（适用于云部署） |
| `authMethod` | string | 是 | 认证方法：api_key 或 basic_auth |
| `apiKey` | string | 否 | Elasticsearch API 密钥 |
| `username` | string | 否 | 基本认证的用户名 |
| `password` | string | 否 | 基本认证的密码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `cluster_name` | string | 集群名称 |
| `status` | string | 集群健康状态 |
| `nodes` | object | 节点统计信息，包括数量和版本 |
| `indices` | object | 索引统计信息，包括文档数量和存储大小 |

## 注意

- 类别：`tools`
- 类型：`elasticsearch`
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/elevenlabs.mdx

```text
---
title: ElevenLabs
description: 使用 ElevenLabs 转换 TTS
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elevenlabs"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[ElevenLabs](https://elevenlabs.io/) 是一个最先进的文本转语音平台，可以生成极其自然且富有表现力的 AI 声音。它提供了当今最逼真且情感细腻的合成语音，非常适合创建逼真的音频内容。

使用 ElevenLabs，您可以：

- **生成自然的语音**：创建几乎与人类语音无法区分的音频
- **选择多样化的语音选项**：访问具有不同口音、语调和特征的预制语音库
- **克隆语音**：根据音频样本创建自定义语音（需获得适当的权限）
- **控制语音参数**：调整稳定性、清晰度和情感语调以微调输出
- **添加真实情感**：融入自然的情感，如快乐、悲伤或兴奋

在 Sim 中，ElevenLabs 集成使您的代理能够将文本转换为逼真的语音，从而增强应用程序的互动性和参与度。这对于创建语音助手、生成音频内容、开发无障碍应用程序或构建更具人性化的对话界面尤为有价值。该集成允许您将 ElevenLabs 的高级语音合成功能无缝集成到代理工作流中，弥合基于文本的 AI 与自然人类交流之间的差距。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 ElevenLabs 集成到工作流程中。可以将文本转换为语音。需要 API 密钥。

## 工具

### `elevenlabs_tts`

使用 ElevenLabs 语音转换 TTS

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `voiceId` | string | 是 | 要使用的语音 ID |
| `modelId` | string | 否 | 要使用的模型 ID \(默认为 eleven_monolingual_v1\) |
| `apiKey` | string | 是 | 您的 ElevenLabs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成音频的 URL |
| `audioFile` | file | 生成的音频文件 |

## 注意事项

- 类别: `tools`
- 类型: `elevenlabs`
```

--------------------------------------------------------------------------------

---[FILE: exa.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/exa.mdx

```text
---
title: Exa
description: 使用 Exa AI 搜索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="exa"
  color="#1F40ED"
/>

{/* MANUAL-CONTENT-START:intro */}
[Exa](https://exa.ai/) 是一款专为开发者和研究人员设计的 AI 驱动搜索引擎，能够从网络中提供高度相关且最新的信息。它结合了先进的语义搜索功能和 AI 理解能力，比传统搜索引擎提供更准确且更具上下文相关性的结果。

使用 Exa，您可以：

- **使用自然语言搜索**：通过对话式查询和问题查找信息
- **获取精准结果**：通过语义理解获得高度相关的搜索结果
- **访问最新信息**：从网络中检索最新信息
- **发现相似内容**：根据内容相似性发现相关资源
- **提取网页内容**：检索并处理网页的全文内容
- **带引用回答问题**：提出问题并获得带有支持来源的直接答案
- **执行研究任务**：自动化多步骤研究工作流以收集、综合和总结信息

在 Sim 中，Exa 集成允许您的代理通过 API 调用以编程方式搜索网络信息、从特定 URL 检索内容、查找相似资源、带引用回答问题以及执行研究任务。这使您的代理能够从互联网上获取实时信息，增强其提供准确、最新且相关响应的能力。该集成对于研究任务、信息收集、内容发现以及需要从网络中获取最新信息的问题解答尤为有价值。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Exa 集成到工作流程中。可以搜索、获取内容、查找相似链接、回答问题并进行研究。需要 API 密钥。

## 工具

### `exa_search`

使用 Exa AI 搜索网络。返回包含标题、URL 和文本摘要的相关搜索结果。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 要执行的搜索查询 |
| `numResults` | number | 否 | 要返回的结果数量 \(默认值: 10，最大值: 25\) |
| `useAutoprompt` | boolean | 否 | 是否使用自动提示来优化查询 \(默认值: false\) |
| `type` | string | 否 | 搜索类型：neural、keyword、auto 或 fast \(默认值: auto\) |
| `includeDomains` | string | 否 | 用逗号分隔的域名列表，包含在结果中 |
| `excludeDomains` | string | 否 | 用逗号分隔的域名列表，从结果中排除 |
| `category` | string | 否 | 按类别筛选：company、research paper、news、pdf、github、tweet、personal site、linkedin profile、financial report |
| `text` | boolean | 否 | 在结果中包含完整文本内容 \(默认值: false\) |
| `highlights` | boolean | 否 | 在结果中包含高亮片段 \(默认值: false\) |
| `summary` | boolean | 否 | 在结果中包含 AI 生成的摘要 \(默认值: false\) |
| `livecrawl` | string | 否 | 实时爬取模式：never \(默认值\)、fallback、always 或 preferred \(始终尝试实时爬取，失败时回退到缓存\) |
| `apiKey` | string | 是 | Exa AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 包含标题、URL 和文本片段的搜索结果 |

### `exa_get_contents`

使用 Exa AI 检索网页内容。返回每个 URL 的标题、文本内容以及可选的摘要。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `urls` | string | 是 | 用逗号分隔的 URL 列表，用于检索内容 |
| `text` | boolean | 否 | 如果为 true，则返回具有默认设置的完整页面文本。如果为 false，则禁用文本返回。 |
| `summaryQuery` | string | 否 | 用于指导摘要生成的查询 |
| `subpages` | number | 否 | 从提供的 URL 中爬取的子页面数量 |
| `subpageTarget` | string | 否 | 用逗号分隔的关键字，用于定位特定子页面 \(例如："docs,tutorial,about"\) |
| `highlights` | boolean | 否 | 在结果中包含高亮片段 \(默认值: false\) |
| `livecrawl` | string | 否 | 实时爬取模式：never \(默认值\)、fallback、always 或 preferred \(始终尝试实时爬取，失败时回退到缓存\) |
| `apiKey` | string | 是 | Exa AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 从 URL 检索的内容，包括标题、文本和摘要 |

### `exa_find_similar_links`

使用 Exa AI 查找与给定 URL 类似的网页。返回包含标题和文本摘要的类似链接列表。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | string | 是 | 用于查找相似链接的 URL |
| `numResults` | number | 否 | 要返回的相似链接数量 \(默认值: 10，最大值: 25\) |
| `text` | boolean | 否 | 是否包含相似页面的完整文本 |
| `includeDomains` | string | 否 | 用逗号分隔的域名列表，包含在结果中 |
| `excludeDomains` | string | 否 | 用逗号分隔的域名列表，从结果中排除 |
| `excludeSourceDomain` | boolean | 否 | 从结果中排除源域名 \(默认值: false\) |
| `highlights` | boolean | 否 | 在结果中包含高亮片段 \(默认值: false\) |
| `summary` | boolean | 否 | 在结果中包含 AI 生成的摘要 \(默认值: false\) |
| `livecrawl` | string | 否 | 实时爬取模式：never \(默认值\), fallback, always, 或 preferred \(始终尝试实时爬取，失败时回退到缓存\) |
| `apiKey` | string | 是 | Exa AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `similarLinks` | array | 找到的类似链接，包含标题、URL 和文本摘要 |

### `exa_answer`

使用 Exa AI 获取带有网络引用的 AI 生成答案。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 要回答的问题 |
| `text` | boolean | 否 | 是否包含答案的完整文本 |
| `apiKey` | string | 是 | Exa AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `answer` | string | AI 生成的答案 |
| `citations` | array | 答案的来源和引用 |

### `exa_research`

使用 AI 进行全面研究，生成带有引用的详细报告

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 研究查询或主题 |
| `model` | string | 否 | 研究模型：exa-research-fast、exa-research（默认）或 exa-research-pro |
| `apiKey` | string | 是 | Exa AI API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `research` | array | 带有引用和摘要的全面研究结果 |

## 注意

- 类别：`tools`
- 类型：`exa`
```

--------------------------------------------------------------------------------

---[FILE: file.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/file.mdx

```text
---
title: 文件
description: 读取并解析多个文件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="file"
  color="#40916C"
/>

{/* MANUAL-CONTENT-START:intro */}
文件解析工具提供了一种强大的方式来提取和处理各种文件格式的内容，使将文档数据集成到您的代理工作流程中变得更加容易。此工具支持多种文件格式，并且可以处理最大 200MB 的文件。

使用文件解析工具，您可以：

- **处理多种文件格式**：从 PDF、CSV、Word 文档 (DOCX)、文本文件等中提取文本
- **处理大文件**：处理最大 200MB 的文档
- **从 URL 解析文件**：通过提供文件的在线 URL，直接提取内容
- **一次处理多个文件**：上传并解析多个文件
- **提取结构化数据**：尽可能保留原始文档的格式和结构

文件解析工具特别适用于需要处理文档内容的场景，例如分析报告、从电子表格中提取数据或处理各种文档来源的文本。它简化了将文档内容提供给您的代理的过程，使他们能够像处理直接文本输入一样轻松地处理存储在文件中的信息。
{/* MANUAL-CONTENT-END */}

## 使用说明

将文件集成到工作流程中。可以手动上传文件或插入文件 URL。

## 工具

### `file_parser`

解析一个或多个上传的文件或来自 URL 的文件（文本、PDF、CSV、图像等）。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `filePath` | 字符串 | 是 | 文件路径。可以是单一路径、URL 或路径数组。 |
| `fileType` | 字符串 | 否 | 要解析的文件类型（如果未指定，将自动检测）。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `files` | 数组 | 解析文件的数组 |
| `combinedContent` | 字符串 | 所有解析文件的合并内容 |

## 注意事项

- 分类：`tools`
- 类型：`file`
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/firecrawl.mdx

```text
---
title: Firecrawl
description: 抓取、搜索、爬取、映射并提取网页数据
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="firecrawl"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Firecrawl](https://firecrawl.dev/) 是一个强大的网页抓取和内容提取 API，可以无缝集成到 Sim 中，帮助开发者从任何网站提取干净、结构化的内容。通过这种集成，您可以轻松地将网页转换为 Markdown 和 HTML 等可用的数据格式，同时保留重要内容。

在 Sim 中使用 Firecrawl，您可以：

- **提取干净的内容**：移除广告、导航元素和其他干扰，只保留主要内容
- **转换为结构化格式**：将网页转换为 Markdown、HTML 或 JSON
- **捕获元数据**：提取 SEO 元数据、Open Graph 标签和其他页面信息
- **处理依赖 JavaScript 的网站**：从依赖 JavaScript 的现代 Web 应用中处理内容
- **过滤内容**：使用 CSS 选择器专注于页面的特定部分
- **大规模处理**：通过可靠的 API 满足高容量抓取需求
- **搜索网络**：执行智能网络搜索并获取结构化结果
- **抓取整个网站**：抓取网站的多个页面并汇总其内容

在 Sim 中，Firecrawl 集成使您的代理能够以编程方式访问和处理 Web 内容，作为其工作流程的一部分。支持的操作包括：

- **抓取**：从单个网页提取结构化内容（Markdown、HTML、元数据）。
- **搜索**：使用 Firecrawl 的智能搜索功能在网络上搜索信息。
- **抓取**：抓取网站的多个页面，返回每个页面的结构化内容和元数据。

这使您的代理能够从网站收集信息，提取结构化数据，并利用这些信息做出决策或生成洞察——无需处理复杂的原始 HTML 解析或浏览器自动化。只需使用您的 API 密钥配置 Firecrawl 模块，选择操作（抓取、搜索或抓取），并提供相关参数。您的代理即可立即开始以干净、结构化的格式处理 Web 内容。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Firecrawl 集成到工作流程中。使用 AI 抓取页面、搜索网络、爬取整个网站、映射 URL 结构并提取结构化数据。

## 工具

### `firecrawl_scrape`

从网页中提取结构化内容，并支持全面的元数据。将内容转换为 Markdown 或 HTML，同时捕获 SEO 元数据、Open Graph 标签和页面信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | string | 是 | 要抓取内容的 URL |
| `scrapeOptions` | json | 否 | 内容抓取选项 |
| `apiKey` | string | 是 | Firecrawl API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `markdown` | string | Markdown 格式的页面内容 |
| `html` | string | 页面原始 HTML 内容 |
| `metadata` | object | 包括 SEO 和 Open Graph 信息的页面元数据 |

### `firecrawl_search`

使用 Firecrawl 在网络上搜索信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 要使用的搜索查询 |
| `apiKey` | string | 是 | Firecrawl API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | array | 搜索结果数据 |

### `firecrawl_crawl`

抓取整个网站并从所有可访问页面提取结构化内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | string | 是 | 要爬取的网站 URL |
| `limit` | number | 否 | 要爬取的最大页面数 \(默认值：100\) |
| `onlyMainContent` | boolean | 否 | 仅提取页面的主要内容 |
| `apiKey` | string | 是 | Firecrawl API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pages` | array | 包含抓取页面内容和元数据的数组 |

### `firecrawl_map`

快速可靠地从任何网站获取完整的 URL 列表。适用于在不进行爬取的情况下发现网站上的所有页面。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | string | 是 | 要映射并发现链接的基础 URL |
| `search` | string | 否 | 按与搜索词的相关性过滤结果 \(例如："blog"\) |
| `sitemap` | string | 否 | 控制站点地图的使用："skip"、"include" \(默认值\) 或 "only" |
| `includeSubdomains` | boolean | 否 | 是否包含子域名的 URL \(默认值：true\) |
| `ignoreQueryParameters` | boolean | 否 | 排除包含查询字符串的 URL \(默认值：true\) |
| `limit` | number | 否 | 返回的最大链接数 \(最大值：100,000，默认值：5,000\) |
| `timeout` | number | 否 | 请求超时时间（毫秒） |
| `location` | json | 否 | 用于代理的地理上下文 \(国家、语言\) |
| `apiKey` | string | 是 | Firecrawl API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 映射操作是否成功 |
| `links` | array | 从网站发现的 URL 数组 |

### `firecrawl_extract`

使用自然语言提示和 JSON 架构从整个网页中提取结构化数据。强大的智能数据提取功能。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `urls` | json | 是 | 要提取数据的 URL 数组 \(支持 glob 格式\) |
| `prompt` | string | 否 | 提取过程的自然语言指导 |
| `schema` | json | 否 | 定义要提取数据结构的 JSON 架构 |
| `enableWebSearch` | boolean | 否 | 启用网络搜索以查找补充信息 \(默认值：false\) |
| `ignoreSitemap` | boolean | 否 | 扫描时忽略 sitemap.xml 文件 \(默认值：false\) |
| `includeSubdomains` | boolean | 否 | 扩展扫描到子域名 \(默认值：true\) |
| `showSources` | boolean | 否 | 在响应中返回数据源 \(默认值：false\) |
| `ignoreInvalidURLs` | boolean | 否 | 跳过数组中的无效 URL \(默认值：true\) |
| `scrapeOptions` | json | 否 | 高级抓取配置选项 |
| `apiKey` | string | 是 | Firecrawl API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 提取操作是否成功 |
| `data` | object | 根据模式或提示提取的结构化数据 |

## 注意

- 类别：`tools`
- 类型：`firecrawl`
```

--------------------------------------------------------------------------------

---[FILE: generic_webhook.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/generic_webhook.mdx

```text
---
title: Webhook
description: 通过配置自定义 webhook，从任何服务接收 webhook。
---

import { BlockInfoCard } from "@/components/ui/block-info-card"
import { Image } from '@/components/ui/image'

<BlockInfoCard 
  type="generic_webhook"
  color="#10B981"
/>

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Webhook Block Configuration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 概述

通用 Webhook 模块允许您接收来自任何外部服务的 webhook。这是一个灵活的触发器，可以处理任何 JSON 负载，非常适合与没有专用 Sim 模块的服务集成。

## 基本用法

### 简单直通模式

在未定义输入格式的情况下，webhook 会按原样传递整个请求正文：

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Test webhook trigger",
    "data": {
      "key": "value"
    }
  }'
```

在下游模块中使用以下方式访问数据：
- `<webhook1.message>` → "测试 webhook 触发器"
- `<webhook1.data.key>` → "值"

### 结构化输入格式（可选）

定义输入模式以获取类型化字段，并启用高级功能，例如文件上传：

**输入格式配置：**

```json
[
  { "name": "message", "type": "string" },
  { "name": "priority", "type": "number" },
  { "name": "documents", "type": "files" }
]
```

**Webhook 请求：**

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Invoice submission",
    "priority": 1,
    "documents": [
      {
        "type": "file",
        "data": "data:application/pdf;base64,JVBERi0xLjQK...",
        "name": "invoice.pdf",
        "mime": "application/pdf"
      }
    ]
  }'
```

## 文件上传

### 支持的文件格式

webhook 支持两种文件输入格式：

#### 1. Base64 编码文件
用于直接上传文件内容：

```json
{
  "documents": [
    {
      "type": "file",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "name": "screenshot.png",
      "mime": "image/png"
    }
  ]
}
```

- **最大大小**：每个文件 20MB
- **格式**：带有 base64 编码的标准数据 URL
- **存储**：文件上传到安全的执行存储

#### 2. URL 引用
用于传递现有文件 URL：

```json
{
  "documents": [
    {
      "type": "url",
      "data": "https://example.com/files/document.pdf",
      "name": "document.pdf",
      "mime": "application/pdf"
    }
  ]
}
```

### 在下游模块中访问文件

文件被处理为具有以下属性的 `UserFile` 对象：

```typescript
{
  id: string,          // Unique file identifier
  name: string,        // Original filename
  url: string,         // Presigned URL (valid for 5 minutes)
  size: number,        // File size in bytes
  type: string,        // MIME type
  key: string,         // Storage key
  uploadedAt: string,  // ISO timestamp
  expiresAt: string    // ISO timestamp (5 minutes)
}
```

**分块访问：**
- `<webhook1.documents[0].url>` → 下载 URL
- `<webhook1.documents[0].name>` → "invoice.pdf"
- `<webhook1.documents[0].size>` → 524288
- `<webhook1.documents[0].type>` → "application/pdf"

### 完整文件上传示例

```bash
# Create a base64-encoded file
echo "Hello World" | base64
# SGVsbG8gV29ybGQK

# Send webhook with file
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "subject": "Document for review",
    "attachments": [
      {
        "type": "file",
        "data": "data:text/plain;base64,SGVsbG8gV29ybGQK",
        "name": "sample.txt",
        "mime": "text/plain"
      }
    ]
  }'
```

## 身份验证

### 配置身份验证（可选）

在 webhook 配置中：
1. 启用“需要身份验证”
2. 设置一个密钥令牌
3. 选择头类型：
   - **自定义头**: `X-Sim-Secret: your-token`
   - **授权 Bearer**: `Authorization: Bearer your-token`

### 使用身份验证

```bash
# With custom header
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret-token" \
  -d '{"message": "Authenticated request"}'

# With bearer token
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{"message": "Authenticated request"}'
```

## 最佳实践

1. **使用输入格式定义结构**：当您知道预期的模式时，定义输入格式。这提供：
   - 类型验证
   - 编辑器中的更好自动完成
   - 文件上传功能

2. **身份验证**：在生产环境的 webhook 中始终启用身份验证，以防止未经授权的访问。

3. **文件大小限制**：将文件保持在 20MB 以下。对于更大的文件，请使用 URL 引用。

4. **文件过期**：下载的文件具有 5 分钟的 URL 过期时间。请及时处理，或如果需要更长时间，请将其存储在其他地方。

5. **错误处理**：Webhook 处理是异步的。请检查执行日志以获取错误信息。

6. **测试**：在部署前，使用编辑器中的“测试 Webhook”按钮验证您的配置。

## 使用场景

- **表单提交**：接收带有文件上传的自定义表单数据
- **第三方集成**：与发送 webhook 的服务（如 Stripe、GitHub 等）连接
- **文档处理**：接受来自外部系统的文档进行处理
- **事件通知**：接收来自各种来源的事件数据
- **自定义 API**：为您的应用程序构建自定义 API 端点

## 注意事项

- 类别：`triggers`
- 类型：`generic_webhook`
- **文件支持**：通过输入格式配置可用
- **最大文件大小**：每个文件 20MB
```

--------------------------------------------------------------------------------

````

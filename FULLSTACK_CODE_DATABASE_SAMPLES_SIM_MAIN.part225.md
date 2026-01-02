---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 225
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 225 of 933)

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

---[FILE: ahrefs.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/ahrefs.mdx

```text
---
title: Ahrefs
description: 使用 Ahrefs 进行 SEO 分析
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ahrefs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Ahrefs](https://ahrefs.com/) 是一个领先的 SEO 工具集，用于分析网站、跟踪排名、监控反向链接以及研究关键词。它提供了关于您自己网站以及竞争对手的详细见解，帮助您做出数据驱动的决策以提升搜索可见性。

在 Sim 中集成 Ahrefs 后，您可以：

- **分析域名评分和权威性**：即时检查任何网站的域名评分 (DR) 和 Ahrefs 排名，以评估其权威性。
- **获取反向链接**：检索指向某个网站或特定 URL 的反向链接列表，包括锚文本、引用页面 DR 等详细信息。
- **获取反向链接统计**：访问关于反向链接类型（dofollow、nofollow、文本、图片、重定向等）的指标，适用于域名或 URL。
- **探索自然关键词** *(计划中)*：查看某个域名排名的关键词及其在 Google 搜索结果中的位置。
- **发现热门页面** *(计划中)*：识别通过自然流量和链接表现最好的页面。

这些工具让您的代理可以自动化 SEO 研究、监控竞争对手并生成报告——所有这些都可以作为您的工作流程自动化的一部分。要使用 Ahrefs 集成，您需要拥有带有 API 访问权限的 Ahrefs 企业订阅。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Ahrefs SEO 工具集成到您的工作流程中。分析域名评分、反向链接、自然关键词、热门页面等。需要 Ahrefs 企业计划和 API 访问权限。

## 工具

### `ahrefs_domain_rating`

获取目标域名的域名评分 (DR) 和 Ahrefs 排名。域名评分显示网站的强度。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | string | 是 | 要分析的目标域名 \(例如：example.com\) |
| `date` | string | 否 | 历史数据的日期，格式为 YYYY-MM-DD \(默认为今天\) |
| `apiKey` | string | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `domainRating` | number | 域名评分 \(0-100\) |
| `ahrefsRank` | number | Ahrefs 排名 - 基于反向链接配置文件强度的全球排名 |

### `ahrefs_backlinks`

获取指向目标域名或 URL 的反向链接列表。返回每个反向链接的详细信息，包括来源 URL、锚文本和域名评分。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | string | 是 | 要分析的目标域名或 URL |
| `mode` | string | 否 | 分析模式：domain \(整个域名\)、prefix \(URL 前缀\)、subdomains \(包含所有子域名\)、exact \(精确 URL 匹配\) |
| `date` | string | 否 | 历史数据的日期，格式为 YYYY-MM-DD \(默认为今天\) |
| `limit` | number | 否 | 返回结果的最大数量 \(默认值：100\) |
| `offset` | number | 否 | 分页时要跳过的结果数量 |
| `apiKey` | string | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `backlinks` | 数组 | 指向目标的反向链接列表 |

### `ahrefs_backlinks_stats`

获取目标域名或 URL 的反向链接统计信息。返回包括 dofollow、nofollow、文本、图片和重定向链接在内的不同反向链接类型的总数。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | 字符串 | 是 | 要分析的目标域名或 URL |
| `mode` | 字符串 | 否 | 分析模式：domain（整个域名）、prefix（URL 前缀）、subdomains（包含所有子域名）、exact（精确 URL 匹配） |
| `date` | 字符串 | 否 | 历史数据的日期，格式为 YYYY-MM-DD（默认为今天） |
| `apiKey` | 字符串 | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `stats` | 对象 | 反向链接统计摘要 |

### `ahrefs_referring_domains`

获取链接到目标域名或 URL 的域名列表。返回具有其域名评分、反向链接计数和发现日期的唯一引用域名。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | 字符串 | 是 | 要分析的目标域名或 URL |
| `mode` | 字符串 | 否 | 分析模式：domain（整个域名）、prefix（URL 前缀）、subdomains（包含所有子域名）、exact（精确 URL 匹配） |
| `date` | 字符串 | 否 | 历史数据的日期，格式为 YYYY-MM-DD（默认为今天） |
| `limit` | 数字 | 否 | 返回的最大结果数（默认值：100） |
| `offset` | 数字 | 否 | 分页时要跳过的结果数 |
| `apiKey` | 字符串 | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `referringDomains` | 数组 | 链接到目标的域名列表 |

### `ahrefs_organic_keywords`

获取目标域名或 URL 在 Google 搜索结果中排名的自然关键词。返回的关键词详情包括搜索量、排名位置和预估流量。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | 字符串 | 是 | 要分析的目标域名或 URL |
| `country` | 字符串 | 否 | 搜索结果的国家代码 \(例如：us, gb, de\)。默认值：us |
| `mode` | 字符串 | 否 | 分析模式：domain \(整个域名\), prefix \(URL 前缀\), subdomains \(包含所有子域名\), exact \(精确 URL 匹配\) |
| `date` | 字符串 | 否 | 历史数据的日期，格式为 YYYY-MM-DD \(默认为今天\) |
| `limit` | 数字 | 否 | 返回结果的最大数量 \(默认值：100\) |
| `offset` | 数字 | 否 | 分页时跳过的结果数量 |
| `apiKey` | 字符串 | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `keywords` | 数组 | 目标排名的自然关键词列表 |

### `ahrefs_top_pages`

获取按自然流量排序的目标域名的顶级页面。返回页面 URL 及其流量、关键词数量和预估流量价值。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | 字符串 | 是 | 要分析的目标域名 |
| `country` | 字符串 | 否 | 流量数据的国家代码 \(例如：us, gb, de\)。默认值：us |
| `mode` | 字符串 | 否 | 分析模式：domain \(整个域名\), prefix \(URL 前缀\), subdomains \(包含所有子域名\) |
| `date` | 字符串 | 否 | 历史数据的日期，格式为 YYYY-MM-DD \(默认为今天\) |
| `limit` | 数字 | 否 | 返回结果的最大数量 \(默认值：100\) |
| `offset` | 数字 | 否 | 分页时跳过的结果数量 |
| `select` | 字符串 | 否 | 要返回的字段的逗号分隔列表 \(例如：url,traffic,keywords,top_keyword,value\)。默认值：url,traffic,keywords,top_keyword,value |
| `apiKey` | 字符串 | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pages` | array | 按自然流量排序的顶级页面列表 |

### `ahrefs_keyword_overview`

获取关键字的详细指标，包括搜索量、关键字难度、CPC、点击量和流量潜力。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `keyword` | string | 是 | 要分析的关键字 |
| `country` | string | 否 | 关键字数据的国家代码 \(例如：us, gb, de\)。默认值：us |
| `apiKey` | string | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `overview` | object | 关键字指标概览 |

### `ahrefs_broken_backlinks`

获取指向目标域名或 URL 的损坏反向链接列表。这对于识别链接恢复机会非常有用。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `target` | string | 是 | 要分析的目标域名或 URL |
| `mode` | string | 否 | 分析模式：domain（整个域名）、prefix（URL 前缀）、subdomains（包括所有子域名）、exact（精确 URL 匹配） |
| `date` | string | 否 | 历史数据的日期，格式为 YYYY-MM-DD（默认为今天） |
| `limit` | number | 否 | 要返回的最大结果数（默认值：100） |
| `offset` | number | 否 | 分页时要跳过的结果数 |
| `apiKey` | string | 是 | Ahrefs API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `brokenBacklinks` | array | 损坏反向链接列表 |

## 注意事项

- 类别：`tools`
- 类型：`ahrefs`
```

--------------------------------------------------------------------------------

---[FILE: airtable.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/airtable.mdx

```text
---
title: Airtable
description: 读取、创建和更新 Airtable
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="airtable"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Airtable](https://airtable.com/) 是一个强大的云平台，它将数据库的功能与电子表格的简便性相结合。它允许用户创建灵活的数据库，用于组织、存储和协作处理信息。

使用 Airtable，您可以：

- **创建自定义数据库**：为项目管理、内容日历、库存跟踪等构建量身定制的解决方案
- **可视化数据**：以网格、看板、日历或画廊的形式查看您的信息
- **自动化工作流程**：设置触发器和操作以自动化重复性任务
- **与其他工具集成**：通过原生集成和 API 连接数百种其他应用程序

在 Sim 中，Airtable 集成使您的代理能够以编程方式与您的 Airtable 数据库交互。这使得数据操作变得无缝，例如检索信息、创建新记录和更新现有数据——所有这些都可以在您的代理工作流程中完成。将 Airtable 用作动态数据源或目标，使您的代理能够在决策和任务执行过程中访问和操作结构化信息。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Airtable 集成到工作流程中。可以创建、获取、列出或更新 Airtable 记录。需要 OAuth 授权。可用于触发模式，当 Airtable 表格更新时触发工作流程。

## 工具

### `airtable_list_records`

从 Airtable 表中读取记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | 是 | Airtable 基础的 ID |
| `tableId` | string | 是 | 表的 ID |
| `maxRecords` | number | 否 | 要返回的最大记录数 |
| `filterFormula` | string | 否 | 用于筛选记录的公式 \(例如："\(\{字段名称\} = \'值\'\)"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `records` | json | 检索到的 Airtable 记录数组 |

### `airtable_get_record`

通过 ID 从 Airtable 表中检索单个记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | 是 | Airtable 基础的 ID |
| `tableId` | string | 是 | 表的 ID 或名称 |
| `recordId` | string | 是 | 要检索的记录 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `record` | json | 检索到的 Airtable 记录，包括 id、createdTime 和字段 |
| `metadata` | json | 操作元数据，包括记录数 |

### `airtable_create_records`

向 Airtable 表中写入新记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | 是 | Airtable 基础的 ID |
| `tableId` | string | 是 | 表的 ID 或名称 |
| `records` | json | 是 | 要创建的记录数组，每个记录包含一个 `fields` 对象 |
| `fields` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `records` | json | 创建的 Airtable 记录数组 |

### `airtable_update_record`

通过 ID 更新 Airtable 表中的现有记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | 是 | Airtable 基础的 ID |
| `tableId` | string | 是 | 表的 ID 或名称 |
| `recordId` | string | 是 | 要更新的记录 ID |
| `fields` | json | 是 | 包含字段名称及其新值的对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `record` | json | 更新后的 Airtable 记录，包含 id、createdTime 和字段 |
| `metadata` | json | 操作元数据，包括记录数和更新的字段名称 |

### `airtable_update_multiple_records`

更新 Airtable 表中的多个现有记录

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | 是 | Airtable 基础的 ID |
| `tableId` | string | 是 | 表的 ID 或名称 |
| `records` | json | 是 | 要更新的记录数组，每个记录包含一个 `id` 和一个 `fields` 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `records` | json | 更新的 Airtable 记录数组 |

## 注意事项

- 类别：`tools`
- 类型：`airtable`
```

--------------------------------------------------------------------------------

---[FILE: apify.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/apify.mdx

```text
---
title: Apify
description: 运行 Apify actor 并获取结果
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apify"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apify](https://apify.com/) 是一个强大的平台，用于大规模构建、部署和运行网页自动化和网页抓取 actor。Apify 使您能够从任何网站提取有用的数据，自动化工作流程，并无缝连接您的数据管道。

使用 Apify，您可以：

- **运行现成或自定义的 actor**：集成公共 actor 或开发您自己的，自动化各种网页数据提取和浏览器任务。
- **获取数据集**：实时访问和管理由 actor 收集的结构化数据集。
- **扩展网页自动化**：利用云基础设施可靠地运行任务，可以异步或同步运行，并具有强大的错误处理能力。

在 Sim 中，Apify 集成允许您的代理以编程方式执行核心 Apify 操作：

- **运行 Actor（同步）**：使用 `apify_run_actor_sync` 启动一个 Apify actor 并等待其完成，在运行结束后立即获取结果。
- **运行 Actor（异步）**：使用 `apify_run_actor_async` 在后台启动一个 actor 并定期轮询结果，适用于较长或复杂的任务。

这些操作使您的代理能够直接在工作流程中自动化、抓取和协调数据收集或浏览器自动化任务——所有这些都具有灵活的配置和结果处理，无需手动运行或外部工具。将 Apify 集成为一个动态的自动化和数据提取引擎，以编程方式为您的代理提供网页规模的工作流程支持。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Apify 集成到您的工作流程中。使用自定义输入运行任何 Apify actor 并获取结果。支持同步和异步执行，并自动获取数据集。

## 工具

### `apify_run_actor_sync`

同步运行 APIFY actor 并获取结果（最长 5 分钟）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 来自 console.apify.com/account#/integrations 的 APIFY API 令牌 |
| `actorId` | string | 是 | Actor ID 或用户名/actor 名称 \(例如："janedoe/my-actor" 或 actor ID\) |
| `input` | string | 否 | 作为 JSON 字符串的 actor 输入。请参阅 actor 文档以了解所需字段。 |
| `timeout` | number | 否 | 超时时间（秒）\(默认：actor 默认值\) |
| `build` | string | 否 | 要运行的 actor 构建版本 \(例如："latest"、"beta" 或构建标签/编号\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | actor 运行是否成功 |
| `runId` | string | APIFY 运行 ID |
| `status` | string | 运行状态 \(SUCCEEDED, FAILED 等\) |
| `items` | array | 数据集条目 \(如果已完成\) |

### `apify_run_actor_async`

异步运行 APIFY actor 并轮询长时间运行的任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 来自 console.apify.com/account#/integrations 的 APIFY API 令牌 |
| `actorId` | string | 是 | Actor ID 或用户名/actor 名称 \(例如："janedoe/my-actor" 或 actor ID\) |
| `input` | string | 否 | 作为 JSON 字符串的 actor 输入 |
| `waitForFinish` | number | 否 | 轮询开始前的初始等待时间（秒）\(0-60\) |
| `itemLimit` | number | 否 | 要获取的最大数据集条目数 \(1-250000，默认 100\) |
| `timeout` | number | 否 | 超时时间（秒）\(默认：actor 默认值\) |
| `build` | string | 否 | 要运行的 actor 构建版本 \(例如："latest"、"beta" 或构建标签/编号\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | actor 运行是否成功 |
| `runId` | string | APIFY 运行 ID |
| `status` | string | 运行状态 \(SUCCEEDED, FAILED 等\) |
| `datasetId` | string | 包含结果的数据集 ID |
| `items` | array | 数据集条目 \(如果已完成\) |

## 注意

- 类别: `tools`
- 类型: `apify`
```

--------------------------------------------------------------------------------

---[FILE: apollo.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/apollo.mdx

```text
---
title: Apollo
description: 使用 Apollo.io 搜索、丰富和管理联系人
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apollo"
  color="#EBF212"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apollo.io](https://apollo.io/) 是一个领先的销售情报和互动平台，帮助用户大规模地查找、丰富和互动联系人及公司。Apollo.io 将广泛的联系人数据库与强大的数据丰富和工作流自动化工具相结合，帮助销售、市场营销和招聘团队加速增长。

使用 Apollo.io，您可以：

- **搜索数百万联系人和公司**：使用高级筛选器找到精准的潜在客户
- **丰富潜在客户和账户信息**：用经过验证的数据和最新信息补充缺失的细节
- **管理和组织 CRM 记录**：保持人员和公司数据的准确性和可操作性
- **自动化外联**：直接从 Apollo.io 将联系人添加到序列中并创建后续任务

在 Sim 中，Apollo.io 集成允许您的代理以编程方式执行核心 Apollo 操作：

- **搜索人员和公司**：使用 `apollo_people_search` 通过灵活的筛选器发现新的潜在客户。
- **丰富人员数据**：使用 `apollo_people_enrich` 为联系人补充经过验证的信息。
- **批量丰富人员数据**：使用 `apollo_people_bulk_enrich` 一次性大规模丰富多个联系人。
- **搜索和丰富公司信息**：使用 `apollo_company_search` 和 `apollo_company_enrich` 发现和更新关键的公司信息。

这使您的代理能够构建强大的工作流，用于潜在客户开发、CRM 数据丰富和自动化，而无需手动输入数据或切换标签页。将 Apollo.io 集成为动态数据源和 CRM 引擎，帮助您的代理在日常操作中无缝识别、筛选和联系潜在客户。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Apollo.io 集成到工作流程中。搜索人员和公司，丰富联系数据，管理您的 CRM 联系人和账户，将联系人添加到序列中，并创建任务。

## 工具

### `apollo_people_search`

搜索 Apollo

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `person_titles` | array | 否 | 要搜索的职位 \(例如，\["CEO", "VP of Sales"\]\) |
| `person_locations` | array | 否 | 要搜索的地点 \(例如，\["San Francisco, CA", "New York, NY"\]\) |
| `person_seniorities` | array | 否 | 职级 \(例如，\["senior", "executive", "manager"\]\) |
| `organization_names` | array | 否 | 要搜索的公司名称 |
| `q_keywords` | string | 否 | 要搜索的关键词 |
| `page` | number | 否 | 分页的页码 \(默认值：1\) |
| `per_page` | number | 否 | 每页的结果数 \(默认值：25，最大值：100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `people` | json | 符合搜索条件的人员数组 |
| `metadata` | json | 包括页码、每页条目数和总条目数的分页信息 |

### `apollo_people_enrich`

使用 Apollo 丰富单个人的数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `first_name` | string | 否 | 该人的名字 |
| `last_name` | string | 否 | 该人的姓氏 |
| `email` | string | 否 | 该人的电子邮件地址 |
| `organization_name` | string | 否 | 该人工作的公司名称 |
| `domain` | string | 否 | 公司域名 \(例如，apollo.io\) |
| `linkedin_url` | string | 否 | LinkedIn 个人资料 URL |
| `reveal_personal_emails` | boolean | 否 | 显示个人电子邮件地址 \(使用积分\) |
| `reveal_phone_number` | boolean | 否 | 显示电话号码 \(使用积分\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `person` | json | 来自 Apollo 的丰富人员数据 |
| `metadata` | json | 包括丰富状态的元数据 |

### `apollo_people_bulk_enrich`

使用 Apollo 一次丰富最多 10 人的数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `people` | array | 是 | 要丰富的人员数组（最多 10 人） |
| `reveal_personal_emails` | boolean | 否 | 显示个人电子邮件地址（使用积分） |
| `reveal_phone_number` | boolean | 否 | 显示电话号码（使用积分） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `people` | json | 丰富的人员数据数组 |
| `metadata` | json | 批量丰富元数据，包括总数和丰富计数 |

### `apollo_organization_search`

搜索 Apollo

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `organization_locations` | array | 否 | 要搜索的公司位置 |
| `organization_num_employees_ranges` | array | 否 | 员工数量范围（例如，\["1-10", "11-50"\]） |
| `q_organization_keyword_tags` | array | 否 | 行业或关键词标签 |
| `q_organization_name` | string | 否 | 要搜索的组织名称 |
| `page` | number | 否 | 分页的页码 |
| `per_page` | number | 否 | 每页结果数（最多：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organizations` | json | 符合搜索条件的组织数组 |
| `metadata` | json | 分页信息，包括页面、每页条目数和总条目数 |

### `apollo_organization_enrich`

使用 Apollo 为单个组织丰富数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `organization_name` | string | 否 | 组织名称（组织名称或域名至少需要一个） |
| `domain` | string | 否 | 公司域名（例如，apollo.io）（域名或组织名称至少需要一个） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organization` | json | 来自 Apollo 的丰富组织数据 |
| `metadata` | json | 丰富的元数据，包括丰富状态 |

### `apollo_organization_bulk_enrich`

使用 Apollo 一次为最多 10 个组织丰富数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `organizations` | array | 是 | 要丰富的组织数组（最多 10 个） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organizations` | json | 丰富的组织数据数组 |
| `metadata` | json | 批量丰富的元数据，包括总数和丰富的计数 |

### `apollo_contact_create`

在您的 Apollo 数据库中创建一个新联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `first_name` | string | 是 | 联系人的名字 |
| `last_name` | string | 是 | 联系人的姓氏 |
| `email` | string | 否 | 联系人的电子邮件地址 |
| `title` | string | 否 | 职位名称 |
| `account_id` | string | 否 | 要关联的 Apollo 账户 ID |
| `owner_id` | string | 否 | 联系人所有者的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contact` | json | 从 Apollo 创建的联系人数据 |
| `metadata` | json | 创建元数据，包括创建状态 |

### `apollo_contact_update`

更新您 Apollo 数据库中的现有联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `contact_id` | string | 是 | 要更新的联系人的 ID |
| `first_name` | string | 否 | 联系人的名字 |
| `last_name` | string | 否 | 联系人的姓氏 |
| `email` | string | 否 | 电子邮件地址 |
| `title` | string | 否 | 职位名称 |
| `account_id` | string | 否 | Apollo 账户 ID |
| `owner_id` | string | 否 | 联系人所有者的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contact` | json | 来自 Apollo 的更新联系人数据 |
| `metadata` | json | 更新元数据，包括更新状态 |

### `apollo_contact_search`

搜索您的团队

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `q_keywords` | string | 否 | 要搜索的关键字 |
| `contact_stage_ids` | array | 否 | 按联系人阶段 ID 过滤 |
| `page` | number | 否 | 分页的页码 |
| `per_page` | number | 否 | 每页结果数 \(最大值：100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contacts` | json | 符合搜索条件的联系人数组 |
| `metadata` | json | 分页信息，包括页码、每页条目数和总条目数 |

### `apollo_contact_bulk_create`

在您的 Apollo 数据库中一次创建最多 100 个联系人。支持去重以防止创建重复联系人。需要主密钥。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 \(需要主密钥\) |
| `contacts` | array | 是 | 要创建的联系人数组 \(最多 100 个\)。每个联系人应包括 first_name、last_name，以及可选的 email、title、account_id、owner_id |
| `run_dedupe` | boolean | 否 | 启用去重以防止创建重复联系人。当为 true 时，返回现有联系人而不进行修改 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `created_contacts` | json | 新创建联系人数组 |
| `existing_contacts` | json | 已存在联系人数组（当启用去重时） |
| `metadata` | json | 批量创建元数据，包括创建和已存在联系人的计数 |

### `apollo_contact_bulk_update`

一次更新最多 100 个现有联系人到您的 Apollo 数据库中。每个联系人必须包含一个 id 字段。需要主密钥。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `contacts` | array | 是 | 要更新的联系人数组（最多 100 个）。每个联系人必须包含 id 字段，并可选包含 first_name、last_name、email、title、account_id、owner_id |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updated_contacts` | json | 成功更新的联系人数组 |
| `failed_contacts` | json | 更新失败的联系人数组 |
| `metadata` | json | 批量更新元数据，包括更新和失败联系人的计数 |

### `apollo_account_create`

在您的 Apollo 数据库中创建一个新账户（公司）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `name` | string | 是 | 公司名称 |
| `website_url` | string | 否 | 公司网站 URL |
| `phone` | string | 否 | 公司电话号码 |
| `owner_id` | string | 否 | 账户所有者的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `account` | json | 从 Apollo 创建的账户数据 |
| `metadata` | json | 包括创建状态的元数据 |

### `apollo_account_update`

更新 Apollo 数据库中的现有账户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `account_id` | string | 是 | 要更新的账户 ID |
| `name` | string | 否 | 公司名称 |
| `website_url` | string | 否 | 公司网站 URL |
| `phone` | string | 否 | 公司电话号码 |
| `owner_id` | string | 否 | 账户所有者的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `account` | json | 从 Apollo 更新的账户数据 |
| `metadata` | json | 包括更新状态的元数据 |

### `apollo_account_search`

搜索您的团队

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `q_keywords` | string | 否 | 在账户数据中搜索的关键字 |
| `owner_id` | string | 否 | 按账户所有者用户 ID 过滤 |
| `account_stage_ids` | array | 否 | 按账户阶段 ID 过滤 |
| `page` | number | 否 | 分页的页码 |
| `per_page` | number | 否 | 每页结果数（最大值：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `accounts` | json | 符合搜索条件的账户数组 |
| `metadata` | json | 分页信息，包括页面、每页条目数和总条目数 |

### `apollo_account_bulk_create`

在您的 Apollo 数据库中一次最多创建 100 个账户。注意：Apollo 不会进行去重处理——如果条目具有相似的名称或域名，可能会创建重复账户。需要主密钥。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `accounts` | array | 是 | 要创建的账户数组（最多 100 个）。每个账户应包括名称（必需），以及可选的 website_url、phone、owner_id |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `created_accounts` | json | 新创建账户的数组 |
| `failed_accounts` | json | 创建失败的账户数组 |
| `metadata` | json | 批量创建的元数据，包括创建和失败账户的计数 |

### `apollo_account_bulk_update`

在您的 Apollo 数据库中一次最多更新 1000 个现有账户（比联系人限制更高！）。每个账户必须包含一个 id 字段。需要主密钥。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `accounts` | array | 是 | 要更新的账户数组（最多 1000 个）。每个账户必须包含 id 字段，以及可选的 name、website_url、phone、owner_id |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `updated_accounts` | json | 成功更新的账户数组 |
| `failed_accounts` | json | 更新失败的账户数组 |
| `metadata` | json | 批量更新的元数据，包括更新和失败账户的计数 |

### `apollo_opportunity_create`

在您的 Apollo 数据库中为一个账户创建一个新交易（需要主密钥）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `name` | string | 是 | 机会/交易的名称 |
| `account_id` | string | 是 | 此机会所属账户的 ID |
| `amount` | number | 否 | 机会的货币价值 |
| `stage_id` | string | 否 | 交易阶段的 ID |
| `owner_id` | string | 否 | 机会所有者的用户 ID |
| `close_date` | string | 否 | 预期的关闭日期（ISO 8601 格式） |
| `description` | string | 否 | 关于机会的描述或备注 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `opportunity` | json | 来自 Apollo 的已创建机会数据 |
| `metadata` | json | 创建元数据，包括创建状态 |

### `apollo_opportunity_search`

搜索并列出您团队中的所有交易/机会

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `q_keywords` | string | 否 | 在机会名称中搜索的关键字 |
| `account_ids` | array | 否 | 按特定账户 ID 过滤 |
| `stage_ids` | array | 否 | 按交易阶段 ID 过滤 |
| `owner_ids` | array | 否 | 按机会所有者 ID 过滤 |
| `page` | number | 否 | 分页的页码 |
| `per_page` | number | 否 | 每页结果数 \(最大值: 100\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `opportunities` | json | 符合搜索条件的机会数组 |
| `metadata` | json | 分页信息，包括页码、每页条目数和总条目数 |

### `apollo_opportunity_get`

通过 ID 检索特定交易/机会的完整详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `opportunity_id` | string | 是 | 要检索的机会 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `opportunity` | json | Apollo 提供的完整机会数据 |
| `metadata` | json | 检索元数据，包括找到的状态 |

### `apollo_opportunity_update`

更新 Apollo 数据库中现有的交易/机会

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥 |
| `opportunity_id` | string | 是 | 要更新的机会 ID |
| `name` | string | 否 | 机会/交易的名称 |
| `amount` | number | 否 | 机会的货币价值 |
| `stage_id` | string | 否 | 交易阶段的 ID |
| `owner_id` | string | 否 | 机会所有者的用户 ID |
| `close_date` | string | 否 | 预期的结束日期（ISO 8601 格式） |
| `description` | string | 否 | 关于机会的描述或备注 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `opportunity` | json | 来自 Apollo 的更新机会数据 |
| `metadata` | json | 更新的元数据，包括更新状态 |

### `apollo_sequence_search`

在您的团队中搜索序列/活动

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `q_name` | string | 否 | 按名称搜索序列 |
| `active` | boolean | 否 | 按活动状态筛选（true 表示活动序列，false 表示非活动序列） |
| `page` | number | 否 | 分页的页码 |
| `per_page` | number | 否 | 每页结果数（最大值：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `sequences` | json | 符合搜索条件的序列/活动数组 |
| `metadata` | json | 分页信息，包括页面、每页条目数和总条目数 |

### `apollo_sequence_add_contacts`

将联系人添加到 Apollo 序列

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `sequence_id` | string | 是 | 要添加联系人的序列 ID |
| `contact_ids` | array | 是 | 要添加到序列的联系人 ID 数组 |
| `emailer_campaign_id` | string | 否 | 可选的电子邮件活动 ID |
| `send_email_from_user_id` | string | 否 | 发送电子邮件的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `contacts_added` | json | 添加到序列的联系人 ID 数组 |
| `metadata` | json | 序列元数据，包括 sequence_id 和 total_added 计数 |

### `apollo_task_create`

在 Apollo 中创建新任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `note` | string | 是 | 任务备注/描述 |
| `contact_id` | string | 否 | 要关联的联系人 ID |
| `account_id` | string | 否 | 要关联的账户 ID |
| `due_at` | string | 否 | ISO 格式的截止日期 |
| `priority` | string | 否 | 任务优先级 |
| `type` | string | 否 | 任务类型 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `task` | json | 从 Apollo 创建的任务数据 |
| `metadata` | json | 包括创建状态的元数据 |

### `apollo_task_search`

在 Apollo 中搜索任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |
| `contact_id` | string | 否 | 按联系人 ID 过滤 |
| `account_id` | string | 否 | 按账户 ID 过滤 |
| `completed` | boolean | 否 | 按完成状态过滤 |
| `page` | number | 否 | 分页的页码 |
| `per_page` | number | 否 | 每页结果数（最大值：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tasks` | json | 符合搜索条件的任务数组 |
| `metadata` | json | 分页信息，包括页码、每页数量和总条目数 |

### `apollo_email_accounts`

获取团队列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Apollo API 密钥（需要主密钥） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `email_accounts` | json | 在 Apollo 中链接的团队电子邮件账户数组 |
| `metadata` | json | 元数据，包括电子邮件账户的总数 |

## 注意事项

- 类别：`tools`
- 类型：`apollo`
```

--------------------------------------------------------------------------------

---[FILE: arxiv.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/arxiv.mdx

```text
---
title: ArXiv
description: 搜索并获取 ArXiv 上的学术论文
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="arxiv"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[ArXiv](https://arxiv.org/) 是一个免费的开放获取科学研究论文存储库，涵盖物理学、数学、计算机科学、定量生物学、定量金融、统计学、电气工程、系统科学和经济学等领域。ArXiv 提供了大量的预印本和已发表文章，是全球研究人员和从业者的重要资源。

使用 ArXiv，您可以：

- **搜索学术论文**：通过关键词、作者姓名、标题、类别等查找研究
- **获取论文元数据**：访问摘要、作者列表、发表日期及其他书目信息
- **下载全文 PDF**：获取大多数论文的完整文本以进行深入研究
- **探索作者贡献**：查看特定作者的所有论文
- **保持最新动态**：发现您领域中的最新提交和热门话题

在 Sim 中，ArXiv 集成使您的代理能够以编程方式搜索、获取和分析 ArXiv 上的科学论文。这使您可以自动化文献综述、构建研究助手，或将最新的科学知识融入您的代理工作流中。将 ArXiv 用作研究、发现和知识提取的动态数据源，助力您的 Sim 项目。 
{/* MANUAL-CONTENT-END */}

## 使用说明

将 ArXiv 集成到工作流程中。可以搜索论文、获取论文详情以及作者的论文。不需要 OAuth 或 API 密钥。

## 工具

### `arxiv_search`

通过关键词、作者、标题或其他字段在 ArXiv 上搜索学术论文。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `searchQuery` | string | 是 | 要执行的搜索查询 |
| `searchField` | string | 否 | 搜索字段：all（全部），ti（标题），au（作者），abs（摘要），co（评论），jr（期刊），cat（类别），rn（报告编号） |
| `maxResults` | number | 否 | 返回结果的最大数量（默认值：10，最大值：2000） |
| `sortBy` | string | 否 | 排序依据：relevance（相关性），lastUpdatedDate（最后更新日期），submittedDate（提交日期）（默认值：relevance） |
| `sortOrder` | string | 否 | 排序顺序：ascending（升序），descending（降序）（默认值：descending） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `papers` | json | 匹配搜索查询的论文数组 |

### `arxiv_get_paper`

通过论文 ID 获取特定 ArXiv 论文的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `paperId` | string | 是 | ArXiv 论文 ID（例如："1706.03762"） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `paper` | json | 请求的 ArXiv 论文的详细信息 |

### `arxiv_get_author_papers`

通过特定作者在 ArXiv 上搜索论文。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authorName` | string | 是 | 要搜索的作者姓名 |
| `maxResults` | number | 否 | 返回结果的最大数量（默认值：10，最大值：2000） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `authorPapers` | json | 指定作者撰写的论文数组 |

## 注意事项

- 类别：`tools`
- 类型：`arxiv`
```

--------------------------------------------------------------------------------

---[FILE: asana.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/asana.mdx

```text
---
title: Asana
description: 与 Asana 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="asana"
  color="#E0E0E0"
/>

## 使用说明

将 Asana 集成到工作流程中。可以读取、写入和更新任务。

## 工具

### `asana_get_task`

通过 GID 检索单个任务或使用筛选器获取多个任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | 否 | 任务的全局唯一标识符 \(GID\)。如果未提供，将获取多个任务。 |
| `workspace` | string | 否 | 用于筛选任务的工作区 GID \(未使用 taskGid 时必需\) |
| `project` | string | 否 | 用于筛选任务的项目 GID |
| `limit` | number | 否 | 返回的最大任务数 \(默认值：50\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `ts` | string | 响应的时间戳 |
| `gid` | string | 任务的全局唯一标识符 |
| `resource_type` | string | 资源类型（任务） |
| `resource_subtype` | string | 资源子类型 |
| `name` | string | 任务名称 |
| `notes` | string | 任务备注或描述 |
| `completed` | boolean | 任务是否已完成 |
| `assignee` | object | 分配人详情 |

### `asana_create_task`

在 Asana 中创建一个新任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | 是 | 创建任务的工作区 GID |
| `name` | string | 是 | 任务名称 |
| `notes` | string | 否 | 任务的备注或描述 |
| `assignee` | string | 否 | 分配任务的用户 GID |
| `due_on` | string | 否 | 以 YYYY-MM-DD 格式的截止日期 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `ts` | string | 响应的时间戳 |
| `gid` | string | 任务的全局唯一标识符 |
| `name` | string | 任务名称 |
| `notes` | string | 任务备注或描述 |
| `completed` | boolean | 任务是否已完成 |
| `created_at` | string | 任务创建时间戳 |
| `permalink_url` | string | 任务在 Asana 中的 URL |

### `asana_update_task`

更新 Asana 中的现有任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | 是 | 要更新任务的全局唯一标识符 \(GID\) |
| `name` | string | 否 | 更新后的任务名称 |
| `notes` | string | 否 | 更新后的备注或描述 |
| `assignee` | string | 否 | 更新后的分配用户 GID |
| `completed` | boolean | 否 | 将任务标记为已完成或未完成 |
| `due_on` | string | 否 | 更新后的截止日期，格式为 YYYY-MM-DD |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `ts` | string | 响应的时间戳 |
| `gid` | string | 任务的全局唯一标识符 |
| `name` | string | 任务名称 |
| `notes` | string | 任务备注或描述 |
| `completed` | boolean | 任务是否已完成 |
| `modified_at` | string | 任务最后修改时间戳 |

### `asana_get_projects`

从 Asana 工作区检索所有项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | 是 | 要从中检索项目的工作区 GID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `ts` | string | 响应的时间戳 |
| `projects` | array | 项目数组 |

### `asana_search_tasks`

在 Asana 工作区中搜索任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | 是 | 要搜索任务的工作区 GID |
| `text` | string | 否 | 在任务名称中搜索的文本 |
| `assignee` | string | 否 | 按分配用户 GID 筛选任务 |
| `projects` | array | 否 | 按项目 GID 数组筛选任务 |
| `completed` | boolean | 否 | 按完成状态筛选 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `ts` | string | 响应的时间戳 |
| `tasks` | array | 匹配任务的数组 |

### `asana_add_comment`

向 Asana 任务添加评论（故事）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | 是 | 任务的全局唯一标识符 \(GID\) |
| `text` | string | 是 | 评论的文本内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `ts` | string | 响应的时间戳 |
| `gid` | string | 评论的全局唯一标识符 |
| `text` | string | 评论的文本内容 |
| `created_at` | string | 评论的创建时间戳 |
| `created_by` | object | 评论作者的详细信息 |

## 注意事项

- 类别：`tools`
- 类型：`asana`
```

--------------------------------------------------------------------------------

---[FILE: browser_use.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/browser_use.mdx

```text
---
title: 浏览器使用
description: 运行浏览器自动化任务
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="browser_use"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[BrowserUse](https://browser-use.com/) 是一个强大的浏览器自动化平台，能够以编程方式创建和运行浏览器任务。它通过自然语言指令提供了一种自动化网页交互的方式，使您能够浏览网站、填写表单、提取数据以及执行复杂的操作序列，而无需编写代码。

使用 BrowserUse，您可以：

- **自动化网页交互**：浏览网站、点击按钮、填写表单以及执行其他浏览器操作
- **提取数据**：从网站抓取内容，包括文本、图片和结构化数据
- **执行复杂工作流**：将多个操作串联在一起，完成复杂的网页任务
- **监控任务执行**：通过可视化反馈实时观看浏览器任务的运行
- **以编程方式处理结果**：从网页自动化任务中接收结构化输出

在 Sim 中，BrowserUse 集成允许您的代理像人类用户一样与网页交互。这使得研究、数据收集、表单提交和网页测试等场景成为可能——所有这些都通过简单的自然语言指令实现。您的代理可以从网站收集信息，与网页应用交互，并执行通常需要手动浏览的操作，从而扩展其能力，将整个网络作为资源。{/* MANUAL-CONTENT-END */}

## 使用说明

将浏览器使用集成到工作流程中。可以像真实用户与浏览器交互一样浏览网页并执行操作。需要 API 密钥。

## 工具

### `browser_use_run_task`

使用 BrowserUse 运行浏览器自动化任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `task` | string | 是 | 浏览器代理应该执行的操作 |
| `variables` | json | 否 | 可选变量，用作密钥（格式：\{key: value\}） |
| `format` | string | 否 | 无描述 |
| `save_browser_data` | boolean | 否 | 是否保存浏览器数据 |
| `model` | string | 否 | 使用的 LLM 模型（默认：gpt-4o） |
| `apiKey` | string | 是 | BrowserUse API 的 API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 任务执行标识符 |
| `success` | boolean | 任务完成状态 |
| `output` | json | 任务输出数据 |
| `steps` | json | 执行步骤 |

## 注意事项

- 类别：`tools`
- 类型：`browser_use`
```

--------------------------------------------------------------------------------

---[FILE: calendly.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/calendly.mdx

```text
---
title: Calendly
description: 管理 Calendly 的日程安排和事件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="calendly"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Calendly](https://calendly.com/) 是一个流行的日程安排自动化平台，可以帮助您轻松预订会议、活动和预约。通过 Calendly，团队和个人可以简化日程安排，减少来回邮件，并自动化与活动相关的任务。

通过 Sim 的 Calendly 集成，您的代理可以：

- **检索有关您的账户和已安排事件的信息**：使用工具获取用户信息、事件类型和已安排事件，以便进行分析或自动化。
- **管理事件类型和日程安排**：访问并列出用户或组织的可用事件类型，检索特定事件类型的详细信息，并监控已安排的会议和受邀者数据。
- **自动化跟进和工作流程**：当用户安排、重新安排或取消会议时，Sim 代理可以自动触发相应的工作流程，例如发送提醒、更新 CRM 或通知参与者。
- **通过 Webhook 轻松集成**：设置 Sim 工作流程以响应实时 Calendly Webhook 事件，包括当受邀者安排、取消或与路由表单交互时。

无论您是想自动化会议准备、管理邀请，还是根据日程安排活动运行自定义工作流程，Sim 中的 Calendly 工具都为您提供灵活且安全的访问权限。通过即时响应日程安排的变化，解锁新的自动化功能——简化您的团队运营和沟通。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Calendly 集成到您的工作流程中。管理事件类型、已安排事件、受邀者和 Webhook。还可以基于 Calendly Webhook 事件（受邀者已安排、受邀者已取消、路由表单已提交）触发工作流程。需要个人访问令牌。

## 工具

### `calendly_get_current_user`

获取当前已认证的 Calendly 用户的信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `resource` | object | 当前用户信息 |

### `calendly_list_event_types`

检索用户或组织的所有事件类型列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |
| `user` | string | 否 | 仅返回属于该用户的事件类型（URI 格式） |
| `organization` | string | 否 | 仅返回属于该组织的事件类型（URI 格式） |
| `count` | number | 否 | 每页结果数量（默认：20，最大：100） |
| `pageToken` | string | 否 | 分页的页面令牌 |
| `sort` | string | 否 | 结果的排序顺序（例如，“name:asc”、“name:desc”） |
| `active` | boolean | 否 | 如果为 true，仅显示活动的事件类型。如果为 false 或未选中，则显示所有事件类型（包括活动和非活动）。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `collection` | array | 事件类型对象数组 |

### `calendly_get_event_type`

获取特定事件类型的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |
| `eventTypeUuid` | string | 是 | 事件类型 UUID（可以是完整 URI 或仅是 UUID） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `resource` | object | 事件类型详情 |

### `calendly_list_scheduled_events`

检索用户或组织的已安排事件列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |
| `user` | string | 否 | 返回属于该用户的事件 \(URI 格式\)。必须提供 "user" 或 "organization" 之一。 |
| `organization` | string | 否 | 返回属于该组织的事件 \(URI 格式\)。必须提供 "user" 或 "organization" 之一。 |
| `invitee_email` | string | 否 | 返回受邀者具有此电子邮件的事件 |
| `count` | number | 否 | 每页结果数量 \(默认: 20, 最大: 100\) |
| `max_start_time` | string | 否 | 返回开始时间早于此时间的事件 \(ISO 8601 格式\) |
| `min_start_time` | string | 否 | 返回开始时间晚于此时间的事件 \(ISO 8601 格式\) |
| `pageToken` | string | 否 | 分页的页面令牌 |
| `sort` | string | 否 | 结果的排序顺序 \(例如: "start_time:asc", "start_time:desc"\) |
| `status` | string | 否 | 按状态筛选 \("active" 或 "canceled"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `collection` | array | 已安排事件对象的数组 |

### `calendly_get_scheduled_event`

获取特定计划事件的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |
| `eventUuid` | string | 是 | 计划事件 UUID（可以是完整 URI 或仅是 UUID） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `resource` | object | 计划事件详情 |

### `calendly_list_event_invitees`

检索计划事件的受邀者列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |
| `eventUuid` | string | 是 | 计划事件 UUID（可以是完整 URI 或仅是 UUID） |
| `count` | number | 否 | 每页结果数量（默认: 20，最大: 100） |
| `email` | string | 否 | 按电子邮件地址筛选受邀者 |
| `pageToken` | string | 否 | 分页的页面令牌 |
| `sort` | string | 否 | 结果的排序顺序（例如: "created_at:asc", "created_at:desc"） |
| `status` | string | 否 | 按状态筛选（"active" 或 "canceled"） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `collection` | array | 受邀者对象数组 |

### `calendly_cancel_event`

取消计划事件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Calendly 个人访问令牌 |
| `eventUuid` | string | 是 | 要取消的计划事件 UUID \(可以是完整 URI 或仅是 UUID\) |
| `reason` | string | 否 | 取消原因 \(将发送给受邀者\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `resource` | object | 取消详情 |

## 注意事项

- 类别: `tools`
- 类型: `calendly`
```

--------------------------------------------------------------------------------

---[FILE: clay.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/clay.mdx

```text
---
title: Clay
description: 填充 Clay 工作簿
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="clay"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Clay](https://www.clay.com/) 是一个数据增强和工作流自动化平台，通过强大的集成和灵活的输入，帮助团队简化潜在客户生成、研究和数据操作。

了解如何在 Sim 中使用 Clay 工具，通过 webhook 触发器无缝地将数据插入到 Clay 工作簿中。本教程将指导您设置 webhook、配置数据映射，并实现对 Clay 工作簿的实时更新自动化。非常适合直接从您的工作流中简化潜在客户生成和数据增强！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cx_75X5sI_s"
  title="Clay Integration with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

使用 Clay，您可以：

- **增强代理输出**：自动将您的 Sim 代理数据输入到 Clay 表格中，以便进行结构化跟踪和分析
- **通过 webhook 触发工作流**：利用 Clay 的 webhook 支持，从 Clay 内部启动 Sim 代理任务
- **利用数据循环**：通过在动态数据集上运行的代理，无缝迭代增强的数据行

在 Sim 中，Clay 集成允许您的代理通过 webhook 将结构化数据推送到 Clay 表格中。这使得收集、增强和管理动态输出（如潜在客户、研究摘要或行动项）变得轻而易举——所有这些都在一个协作的、类似电子表格的界面中完成。您的代理可以实时填充行，从而实现异步工作流，在其中 AI 生成的洞察被捕获、审查并由您的团队使用。无论您是在自动化研究、增强 CRM 数据，还是跟踪运营结果，Clay 都成为一个动态的数据层，与您的代理智能交互。通过将 Sim 与 Clay 连接，您可以获得一种强大的方式来使代理结果操作化，精确地循环数据集，并维护 AI 驱动工作的清晰、可审计记录。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Clay 集成到工作流程中。可以用数据填充表格。需要 API 密钥。

## 工具

### `clay_populate`

从 JSON 文件中将数据填充到 Clay 中。支持直接通信和带有时间戳跟踪及频道确认的通知功能。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `webhookURL` | string | 是 | 要填充的 webhook URL |
| `data` | json | 是 | 要填充的数据 |
| `authToken` | string | 否 | 用于 Clay webhook 认证的可选身份验证令牌（大多数 webhook 不需要此令牌） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `data` | json | 来自 Clay webhook 的响应数据 |
| `metadata` | object | webhook 响应元数据 |

## 注意事项

- 类别：`tools`
- 类型：`clay`
```

--------------------------------------------------------------------------------

````

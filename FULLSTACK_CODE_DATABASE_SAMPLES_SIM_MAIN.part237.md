---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 237
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 237 of 933)

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

---[FILE: polymarket.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/polymarket.mdx

```text
---
title: Polymarket
description: 访问 Polymarket 的预测市场数据
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="polymarket"
  color="#4C82FB"
/>

{/* MANUAL-CONTENT-START:intro */}
[Polymarket](https://polymarket.com) 是一个去中心化的预测市场平台，用户可以利用区块链技术交易未来事件的结果。Polymarket 提供了一个全面的 API，使开发者和代理能够访问实时市场数据、事件列表、价格信息和订单簿统计数据，以支持数据驱动的工作流和 AI 自动化。

通过 Polymarket 的 API 和 Sim 集成，您可以让代理以编程方式检索预测市场信息，探索开放市场及相关事件，分析历史价格数据，并访问订单簿和市场中点。这为研究、自动化分析以及开发能够根据市场价格得出的实时事件概率做出反应的智能代理创造了新的可能性。

Polymarket 集成的主要功能包括：

- **市场列表与筛选：** 列出所有当前或历史预测市场，可按标签筛选、排序并分页查看结果。
- **市场详情：** 通过市场 ID 或 slug 检索单个市场的详细信息，包括其结果和状态。
- **事件列表：** 访问 Polymarket 事件列表及详细事件信息。
- **订单簿与价格数据：** 分析订单簿，获取最新市场价格，查看中点，或获取任何市场的历史价格信息。
- **自动化准备：** 构建能够以编程方式对市场动态、赔率变化或特定事件结果做出反应的代理或工具。

通过使用这些文档化的 API 端点，您可以将 Polymarket 丰富的链上预测市场数据无缝集成到您自己的 AI 工作流、仪表盘、研究工具和交易自动化中。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Polymarket 预测市场集成到工作流程中。可以获取市场、单个市场、事件、单个事件、标签、系列、订单簿、价格、中点、价格历史、最后交易价格、价差、最小变动单位、持仓、交易以及搜索功能。

## 工具

### `polymarket_get_markets`

从 Polymarket 检索预测市场列表，并可选择进行筛选

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `closed` | string | 否 | 按关闭状态筛选 \(true/false\)。使用 false 仅显示活跃市场。 |
| `order` | string | 否 | 排序字段 \(例如，volumeNum, liquidityNum, startDate, endDate, createdAt\) |
| `ascending` | string | 否 | 排序方向 \(true 为升序，false 为降序\) |
| `tagId` | string | 否 | 按标签 ID 筛选 |
| `limit` | string | 否 | 每页结果数量 \(最大 50\) |
| `offset` | string | 否 | 分页偏移量 \(跳过此数量的结果\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `markets` | array | 市场对象数组 |

### `polymarket_get_market`

通过 ID 或 slug 检索特定预测市场的详细信息

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `marketId` | 字符串 | 否 | 市场 ID。如果未提供 slug，则必需。 |
| `slug` | 字符串 | 否 | 市场 slug \(例如，"will-trump-win"\)。如果未提供 marketId，则必需。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `market` | object | 包含详细信息的市场对象 |

### `polymarket_get_events`

从 Polymarket 检索事件列表，可选过滤

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `closed` | string | 否 | 按关闭状态筛选 \(true/false\)。使用 false 仅显示活跃事件。 |
| `order` | string | 否 | 排序字段 \(例如，volume, liquidity, startDate, endDate, createdAt\) |
| `ascending` | string | 否 | 排序方向 \(true 为升序，false 为降序\) |
| `tagId` | string | 否 | 按标签 ID 筛选 |
| `limit` | string | 否 | 每页结果数量 \(最大 50\) |
| `offset` | string | 否 | 分页偏移量 \(跳过此数量的结果\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `events` | 数组 | 事件对象的数组 |

### `polymarket_get_event`

通过 ID 或 slug 检索特定事件的详细信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `eventId` | string | 否 | 事件 ID。如果未提供 slug，则必需。 |
| `slug` | string | 否 | 事件 slug \(例如，"2024-presidential-election"\)。如果未提供 eventId，则必需。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `event` | 对象 | 包含详细信息的事件对象 |

### `polymarket_get_tags`

从 Polymarket 获取用于筛选市场的可用标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | 字符串 | 否 | 每页结果数量 \(最多 50\) |
| `offset` | 字符串 | 否 | 分页偏移量 \(跳过此数量的结果\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tags` | 数组 | 包含 id、标签和 slug 的标签对象数组 |

### `polymarket_search`

在 Polymarket 上搜索市场、事件和个人资料

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | 搜索查询词 |
| `limit` | 字符串 | 否 | 每页结果数量 \(最多 50\) |
| `offset` | 字符串 | 否 | 分页偏移量 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | 对象 | 包含市场、事件和个人资料数组的搜索结果 |

### `polymarket_get_series`

从 Polymarket 获取系列（相关市场组）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `limit` | 字符串 | 否 | 每页结果数量 \(最多 50\) |
| `offset` | 字符串 | 否 | 分页偏移量 \(跳过此数量的结果\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `series` | 数组 | 系列对象的数组 |

### `polymarket_get_series_by_id`

通过 ID 从 Polymarket 检索特定系列（相关市场组）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `seriesId` | string | 是 | 系列 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `series` | 对象 | 包含详细信息的系列对象 |

### `polymarket_get_orderbook`

检索特定代币的订单簿摘要

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `orderbook` | 对象 | 包含买入和卖出数组的订单簿 |

### `polymarket_get_price`

检索特定代币和方向的市场价格

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |
| `side` | string | 是 | 订单方向：买或卖 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `price` | 字符串 | 市场价格 |

### `polymarket_get_midpoint`

检索特定代币的中间价

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `midpoint` | 字符串 | 中点价格 |

### `polymarket_get_price_history`

检索特定市场代币的历史价格数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |
| `interval` | string | 否 | 截止到当前时间的持续时间 \(1m, 1h, 6h, 1d, 1w, max\)。与 startTs/endTs 互斥。 |
| `fidelity` | number | 否 | 数据分辨率（以分钟为单位）\(例如，60 表示每小时\) |
| `startTs` | number | 否 | 开始时间戳 \(Unix 秒 UTC\) |
| `endTs` | number | 否 | 结束时间戳 \(Unix 秒 UTC\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `history` | 数组 | 包含时间戳 \(t\) 和价格 \(p\) 的价格历史条目数组 |

### `polymarket_get_last_trade_price`

检索特定代币的最新交易价格

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `price` | 字符串 | 最新交易价格 |

### `polymarket_get_spread`

检索特定代币的买卖价差

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `spread` | 对象 | 包含买价和卖价的买卖价差 |

### `polymarket_get_tick_size`

检索特定代币的最小跳动单位

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | 是 | CLOB 代币 ID \(来自市场 clobTokenIds\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tickSize` | 字符串 | 最小价格变动单位 |

### `polymarket_get_positions`

从 Polymarket 检索用户持仓

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `user` | string | 是 | 用户钱包地址 |
| `market` | string | 否 | 可选的市场 ID，用于筛选持仓 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `positions` | 数组 | 持仓对象的数组 |

### `polymarket_get_trades`

从 Polymarket 获取交易历史

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `user` | 字符串 | 否 | 用于筛选交易的用户钱包地址 |
| `market` | 字符串 | 否 | 用于筛选交易的市场 ID |
| `limit` | 字符串 | 否 | 每页结果数量 \(最多 50\) |
| `offset` | 字符串 | 否 | 分页偏移量 \(跳过此数量的结果\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `trades` | 数组 | 交易对象的数组 |

## 注意事项

- 类别: `tools`
- 类型: `polymarket`
```

--------------------------------------------------------------------------------

---[FILE: postgresql.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/postgresql.mdx

```text
---
title: PostgreSQL
description: 连接到 PostgreSQL 数据库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="postgresql"
  color="#336791"
/>

{/* MANUAL-CONTENT-START:intro */}
[PostgreSQL](https://www.postgresql.org/) 工具使您能够连接到任何 PostgreSQL 数据库，并直接在您的智能工作流中执行各种数据库操作。通过安全的连接处理和灵活的配置，您可以轻松管理和与您的数据交互。

使用 PostgreSQL 工具，您可以：

- **查询数据**：使用 `postgresql_query` 操作执行 SELECT 查询，从 PostgreSQL 表中检索数据。
- **插入记录**：通过 `postgresql_insert` 操作，指定表和要插入的数据，向表中添加新行。
- **更新记录**：使用 `postgresql_update` 操作修改表中的现有数据，提供表名、新数据和 WHERE 条件。
- **删除记录**：通过 `postgresql_delete` 操作删除表中的行，指定表名和 WHERE 条件。
- **执行原始 SQL**：使用 `postgresql_execute` 操作运行任何自定义 SQL 命令，以满足高级用例。

PostgreSQL 工具非常适合需要与结构化数据交互的场景，例如自动化报告、系统间数据同步或驱动数据工作流。它简化了数据库访问，使您能够以编程方式轻松读取、写入和管理 PostgreSQL 数据。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 PostgreSQL 集成到工作流程中。可以查询、插入、更新、删除以及执行原生 SQL。

## 工具

### `postgresql_query`

在 PostgreSQL 数据库上执行 SELECT 查询

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | 字符串 | 是 | PostgreSQL 服务器主机名或 IP 地址 |
| `port` | 数字 | 是 | PostgreSQL 服务器端口 \(默认：5432\) |
| `database` | 字符串 | 是 | 要连接的数据库名称 |
| `username` | 字符串 | 是 | 数据库用户名 |
| `password` | 字符串 | 是 | 数据库密码 |
| `ssl` | 字符串 | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `query` | 字符串 | 是 | 要执行的 SQL SELECT 查询 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 查询返回的行数组 |
| `rowCount` | number | 返回的行数 |

### `postgresql_insert`

向 PostgreSQL 数据库插入数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | PostgreSQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | PostgreSQL 服务器端口 \(默认值: 5432\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `table` | string | 是 | 要插入数据的表名 |
| `data` | object | 是 | 要插入的数据对象 \(键值对\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 插入的数据 \(如果使用了 RETURNING 子句\) |
| `rowCount` | number | 插入的行数 |

### `postgresql_update`

更新 PostgreSQL 数据库中的数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | PostgreSQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | PostgreSQL 服务器端口 \(默认值: 5432\) |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式 \(禁用、必需、优先\) |
| `table` | string | 是 | 要更新数据的表名 |
| `data` | object | 是 | 包含要更新字段的数据对象 \(键值对\) |
| `where` | string | 是 | WHERE 子句条件 \(不包括 WHERE 关键字\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 更新的数据（如果使用了 RETURNING 子句） |
| `rowCount` | number | 更新的行数 |

### `postgresql_delete`

从 PostgreSQL 数据库中删除数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | PostgreSQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | PostgreSQL 服务器端口（默认：5432） |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式（禁用、必需、首选） |
| `table` | string | 是 | 要删除数据的表名 |
| `where` | string | 是 | WHERE 子句条件（不包括 WHERE 关键字） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 删除的数据（如果使用了 RETURNING 子句） |
| `rowCount` | number | 删除的行数 |

### `postgresql_execute`

在 PostgreSQL 数据库上执行原始 SQL 查询

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `host` | string | 是 | PostgreSQL 服务器主机名或 IP 地址 |
| `port` | number | 是 | PostgreSQL 服务器端口（默认：5432） |
| `database` | string | 是 | 要连接的数据库名称 |
| `username` | string | 是 | 数据库用户名 |
| `password` | string | 是 | 数据库密码 |
| `ssl` | string | 否 | SSL 连接模式（禁用、必需、首选） |
| `query` | string | 是 | 要执行的原始 SQL 查询 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `rows` | array | 查询返回的行数组 |
| `rowCount` | number | 受影响的行数 |

## 注意

- 类别：`tools`
- 类型：`postgresql`
```

--------------------------------------------------------------------------------

````

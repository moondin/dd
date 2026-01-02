---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 241
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 241 of 933)

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

---[FILE: shopify.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/shopify.mdx

```text
---
title: Shopify
description: 在您的 Shopify 商店中管理产品、订单、客户和库存
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="shopify"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Shopify](https://www.shopify.com/) 是一个领先的电子商务平台，旨在帮助商家构建、运营和发展他们的在线商店。Shopify 让您可以轻松管理商店的各个方面，从产品和库存到订单和客户。

在 Sim 中使用 Shopify，您的代理可以：

- **创建和管理产品**：添加新产品、更新产品详情以及从商店中移除产品。
- **列出和检索订单**：获取客户订单信息，包括筛选和订单管理。
- **管理客户**：访问和更新客户详情，或将新客户添加到您的商店。
- **调整库存水平**：以编程方式更改产品库存水平，确保库存准确无误。

使用 Sim 的 Shopify 集成，直接从您的自动化流程中自动化常见的商店管理工作流，例如同步库存、履行订单或管理商品列表。通过简单的编程工具，赋能您的代理访问、更新和组织所有商店数据。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Shopify 集成到您的工作流程中。管理产品、订单、客户和库存。创建、读取、更新和删除产品。列出和管理订单。处理客户数据并调整库存水平。

## 工具

### `shopify_create_product`

在您的 Shopify 商店中创建一个新产品

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `title` | string | 是 | 产品标题 |
| `descriptionHtml` | string | 否 | 产品描述 \(HTML\) |
| `vendor` | string | 否 | 产品供应商/品牌 |
| `productType` | string | 否 | 产品类型/类别 |
| `tags` | array | 否 | 产品标签 |
| `status` | string | 否 | 产品状态 \(ACTIVE, DRAFT, ARCHIVED\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `product` | object | 创建的产品 |

### `shopify_get_product`

通过 ID 从您的 Shopify 商店获取单个产品

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `productId` | string | 是 | 产品 ID \(gid://shopify/Product/123456789\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `product` | object | 产品详情 |

### `shopify_list_products`

从您的 Shopify 商店列出产品并可选进行筛选

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `first` | number | 否 | 返回的产品数量 \(默认：50，最大：250\) |
| `query` | string | 否 | 用于筛选产品的搜索查询 \(例如："title:shirt" 或 "vendor:Nike" 或 "status:active"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `products` | array | 产品列表 |
| `pageInfo` | object | 分页信息 |

### `shopify_update_product`

更新您 Shopify 商店中的现有产品

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `productId` | string | 是 | 要更新的产品 ID \(gid://shopify/Product/123456789\) |
| `title` | string | 否 | 新的产品标题 |
| `descriptionHtml` | string | 否 | 新的产品描述 \(HTML\) |
| `vendor` | string | 否 | 新的产品供应商/品牌 |
| `productType` | string | 否 | 新的产品类型/类别 |
| `tags` | array | 否 | 新的产品标签 |
| `status` | string | 否 | 新的产品状态 \(ACTIVE, DRAFT, ARCHIVED\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `product` | object | 更新后的产品 |

### `shopify_delete_product`

从您的 Shopify 商店中删除产品

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `productId` | string | 是 | 要删除的产品 ID \(gid://shopify/Product/123456789\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deletedId` | string | 已删除产品的 ID |

### `shopify_get_order`

通过 ID 从您的 Shopify 商店获取单个订单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `orderId` | string | 是 | 订单 ID \(gid://shopify/Order/123456789\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 订单详情 |

### `shopify_list_orders`

从您的 Shopify 商店列出订单并可选择过滤

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `first` | number | 否 | 要返回的订单数量 \(默认值：50，最大值：250\) |
| `status` | string | 否 | 按订单状态过滤 \(open, closed, cancelled, any\) |
| `query` | string | 否 | 用于过滤订单的搜索查询 \(例如："financial_status:paid" 或 "fulfillment_status:unfulfilled" 或 "email:customer@example.com"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `orders` | array | 订单列表 |
| `pageInfo` | object | 分页信息 |

### `shopify_update_order`

更新 Shopify 商店中的现有订单（备注、标签、电子邮件）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `orderId` | string | 是 | 要更新的订单 ID \(gid://shopify/Order/123456789\) |
| `note` | string | 否 | 新的订单备注 |
| `tags` | array | 否 | 新的订单标签 |
| `email` | string | 否 | 订单的新客户电子邮件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 更新后的订单 |

### `shopify_cancel_order`

取消 Shopify 商店中的订单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `orderId` | string | 是 | 要取消的订单 ID \(gid://shopify/Order/123456789\) |
| `reason` | string | 是 | 取消原因 \(CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER\) |
| `notifyCustomer` | boolean | 否 | 是否通知客户取消订单 |
| `refund` | boolean | 否 | 是否退款 |
| `restock` | boolean | 否 | 是否补充库存 |
| `staffNote` | string | 否 | 关于取消的员工备注 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `order` | object | 取消结果 |

### `shopify_create_customer`

在您的 Shopify 商店中创建一个新客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `email` | string | 否 | 客户电子邮件地址 |
| `firstName` | string | 否 | 客户名字 |
| `lastName` | string | 否 | 客户姓氏 |
| `phone` | string | 否 | 客户电话号码 |
| `note` | string | 否 | 关于客户的备注 |
| `tags` | array | 否 | 客户标签 |
| `addresses` | array | 否 | 客户地址 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `customer` | object | 创建的客户 |

### `shopify_get_customer`

通过 ID 从您的 Shopify 商店获取单个客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `customerId` | string | 是 | 客户 ID \(gid://shopify/Customer/123456789\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `customer` | object | 客户详情 |

### `shopify_list_customers`

列出 Shopify 商店中的客户，并支持可选筛选

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `first` | number | 否 | 要返回的客户数量 \(默认：50，最大：250\) |
| `query` | string | 否 | 用于筛选客户的搜索查询 \(例如："first_name:John" 或 "last_name:Smith" 或 "email:*@gmail.com" 或 "tag:vip"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `customers` | array | 客户列表 |
| `pageInfo` | object | 分页信息 |

### `shopify_update_customer`

更新 Shopify 商店中的现有客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `customerId` | string | 是 | 要更新的客户 ID \(gid://shopify/Customer/123456789\) |
| `email` | string | 否 | 新的客户电子邮件地址 |
| `firstName` | string | 否 | 新的客户名字 |
| `lastName` | string | 否 | 新的客户姓氏 |
| `phone` | string | 否 | 新的客户电话号码 |
| `note` | string | 否 | 关于客户的新备注 |
| `tags` | array | 否 | 新的客户标签 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `customer` | object | 更新后的客户 |

### `shopify_delete_customer`

从您的 Shopify 商店中删除客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `customerId` | string | 是 | 要删除的客户 ID \(gid://shopify/Customer/123456789\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deletedId` | string | 已删除客户的 ID |

### `shopify_list_inventory_items`

列出您的 Shopify 商店中的库存商品。使用此功能通过 SKU 查找库存商品 ID。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `first` | number | 否 | 要返回的库存商品数量 \(默认值：50，最大值：250\) |
| `query` | string | 否 | 用于筛选库存商品的搜索查询 \(例如："sku:ABC123"\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `inventoryItems` | array | 包含其 ID、SKU 和库存水平的库存商品列表 |
| `pageInfo` | object | 分页信息 |

### `shopify_get_inventory_level`

获取特定位置的产品变体的库存水平

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `inventoryItemId` | string | 是 | 库存商品 ID \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | string | 否 | 用于筛选的地点 ID \(可选\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | 库存级别详情 |

### `shopify_adjust_inventory`

调整特定位置的产品变体库存数量

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `inventoryItemId` | string | 是 | 库存项 ID \(gid://shopify/InventoryItem/123456789\) |
| `locationId` | string | 是 | 位置 ID \(gid://shopify/Location/123456789\) |
| `delta` | number | 是 | 调整数量 \(正数表示增加，负数表示减少\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | 库存调整结果 |

### `shopify_list_locations`

列出您的 Shopify 商店中的库存位置。使用此功能查找库存操作所需的位置 ID。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `first` | number | 否 | 返回的位置数量 \(默认值：50，最大值：250\) |
| `includeInactive` | boolean | 否 | 是否包含已停用的位置 \(默认值：false\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `locations` | array | 包含位置 ID、名称和地址的位置列表 |
| `pageInfo` | object | 分页信息 |

### `shopify_create_fulfillment`

创建一个履行记录以将订单商品标记为已发货。需要一个履行订单 ID（可从订单详情中获取）。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名（例如：mystore.myshopify.com） |
| `fulfillmentOrderId` | string | 是 | 履行订单 ID（例如：gid://shopify/FulfillmentOrder/123456789） |
| `trackingNumber` | string | 否 | 发货的追踪号码 |
| `trackingCompany` | string | 否 | 运输承运商名称（例如：UPS、FedEx、USPS、DHL） |
| `trackingUrl` | string | 否 | 用于追踪发货的 URL |
| `notifyCustomer` | boolean | 否 | 是否向客户发送发货确认邮件（默认值：true） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `fulfillment` | object | 包含追踪信息和已履行商品的创建履行记录 |

### `shopify_list_collections`

列出 Shopify 商店中的商品集合。可按标题、类型（自定义/智能）或句柄进行筛选。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名（例如：mystore.myshopify.com） |
| `first` | number | 否 | 要返回的集合数量（默认值：50，最大值：250） |
| `query` | string | 否 | 用于筛选集合的搜索查询（例如：“title:Summer” 或 “collection_type:smart”） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `collections` | array | 包含集合的 ID、标题和商品数量的列表 |
| `pageInfo` | object | 分页信息 |

### `shopify_get_collection`

通过 ID 获取特定集合，包括其产品。使用此功能可以检索集合中的产品。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | 是 | 您的 Shopify 商店域名 \(例如：mystore.myshopify.com\) |
| `collectionId` | string | 是 | 集合 ID \(例如：gid://shopify/Collection/123456789\) |
| `productsFirst` | number | 否 | 要从此集合返回的产品数量 \(默认：50，最大：250\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `collection` | object | 包括其产品的集合详情 |

## 注意

- 类别：`tools`
- 类型：`shopify`
```

--------------------------------------------------------------------------------

---[FILE: slack.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/slack.mdx

```text
---
title: Slack
description: 发送、更新、删除消息，在 Slack 中添加反应，或通过 Slack 事件触发工作流
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="slack"
  color="#611f69"
/>

{/* MANUAL-CONTENT-START:intro */}
[Slack](https://www.slack.com/) 是一个商业通信平台，为团队提供统一的消息、工具和文件管理场所。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/J5jz3UaWmE8"
  title="Slack Integration with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

使用 Slack，您可以：

- **自动化代理通知**：将 Sim 代理的实时更新发送到任何 Slack 频道
- **创建 webhook 端点**：将 Slack 机器人配置为 webhook，以通过 Slack 活动触发 Sim 工作流
- **增强代理工作流**：将 Slack 消息集成到您的代理中，以传递结果、警报和状态更新
- **创建和共享 Slack 画布**：以编程方式在 Slack 频道中生成协作文档（画布）
- **从频道读取消息**：从任何 Slack 频道检索和处理最近的消息，用于监控或工作流触发
- **管理机器人消息**：更新、删除以及为您的机器人发送的消息添加反应

在 Sim 中，Slack 集成使您的代理能够以编程方式与 Slack 交互，并将完整的消息管理功能作为其工作流的一部分：

- **发送消息**：代理可以向任何 Slack 频道或用户发送格式化消息，支持 Slack 的 mrkdwn 语法以实现丰富的格式化
- **更新消息**：编辑之前发送的机器人消息，以更正信息或提供状态更新
- **删除消息**：在消息不再需要或包含错误时删除机器人消息
- **添加反应**：通过为任何消息添加表情符号反应来表达情感或确认
- **创建画布**：直接在频道中创建和共享 Slack 画布（协作文档），以实现更丰富的内容共享和文档化
- **读取消息**：读取频道中的最近消息，允许根据频道活动进行监控、报告或触发进一步操作
- **下载文件**：检索 Slack 频道中共享的文件以进行处理或存档

这允许实现强大的自动化场景，例如发送具有动态更新的通知、通过可编辑的状态消息管理对话流程、通过反应确认重要消息，以及通过删除过时的机器人消息保持频道整洁。您的代理可以提供及时的信息，随着工作流的进展更新消息，创建协作文档，或在需要注意时提醒团队成员。此集成弥合了您的 AI 工作流与团队沟通之间的差距，确保每个人都能获得准确、最新的信息。通过将 Sim 与 Slack 连接，您可以创建能够在适当的时间为团队提供相关信息的代理，通过自动共享和更新见解增强协作，并减少手动状态更新的需求——同时利用您的团队已经在使用的 Slack 工作区进行沟通。

## 使用说明

将 Slack 集成到工作流程中。可以发送、更新和删除消息，创建画布，读取消息并添加反应。在高级模式下需要使用 Bot Token 而不是 OAuth。可以在触发模式下使用，当消息发送到频道时触发工作流程。

## 工具

### `slack_message`

向 Slack 频道或直接消息发送消息。支持 Slack mrkdwn 格式。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `channel` | string | 否 | 目标 Slack 频道（例如，#general） |
| `userId` | string | 否 | 目标 Slack 用户 ID，用于直接消息（例如，U1234567890） |
| `text` | string | 是 | 要发送的消息文本（支持 Slack mrkdwn 格式） |
| `thread_ts` | string | 否 | 回复的线程时间戳（创建线程回复） |
| `files` | file[] | 否 | 附加到消息的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | object | 包含 Slack 返回的所有属性的完整消息对象 |
| `ts` | string | 消息时间戳 |
| `channel` | string | 发送消息的频道 ID |
| `fileCount` | number | 上传的文件数量（当附加文件时） |

### `slack_canvas`

在频道中创建并分享 Slack 画布。画布是 Slack 内的协作文档。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `channel` | string | 是 | 目标 Slack 频道（例如，#general） |
| `title` | string | 是 | 画布的标题 |
| `content` | string | 是 | 画布内容，使用 markdown 格式 |
| `document_content` | object | 否 | 结构化的画布文档内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `canvas_id` | string | 创建的画布 ID |
| `channel` | string | 创建画布的频道 |
| `title` | string | 画布的标题 |

### `slack_message_reader`

阅读 Slack 频道中的最新消息。通过筛选选项检索会话历史记录。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `channel` | string | 否 | 要读取消息的 Slack 频道（例如，#general） |
| `userId` | string | 否 | DM 对话的用户 ID（例如，U1234567890） |
| `limit` | number | 否 | 要检索的消息数量（默认：10，最大：100） |
| `oldest` | string | 否 | 时间范围的开始（时间戳） |
| `latest` | string | 否 | 时间范围的结束（时间戳） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `messages` | array | 频道中的消息对象数组 |

### `slack_list_channels`

列出 Slack 工作区中的所有频道。返回机器人有权限访问的公共和私人频道。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的 Bot token |
| `includePrivate` | boolean | 否 | 包括机器人是成员的私人频道（默认：true） |
| `excludeArchived` | boolean | 否 | 排除已归档的频道（默认：true） |
| `limit` | number | 否 | 返回的最大频道数量（默认：100，最大：200） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `channels` | array | 工作区中的频道对象数组 |

### `slack_list_members`

列出 Slack 频道中的所有成员（用户 ID）。可与获取用户信息功能结合使用，将 ID 解析为名称。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的 Bot token |
| `channel` | string | 是 | 要列出成员的频道 ID |
| `limit` | number | 否 | 返回的最大成员数量（默认：100，最大：200） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `members` | array | 频道成员的用户 ID 数组（例如，U1234567890） |

### `slack_list_users`

列出 Slack 工作区中的所有用户。返回包含名称和头像的用户资料。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `includeDeleted` | boolean | 否 | 是否包含已停用/已删除的用户（默认值：false） |
| `limit` | number | 否 | 返回的最大用户数量（默认值：100，最大值：200） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `users` | array | 工作区中的用户对象数组 |

### `slack_get_user`

通过用户 ID 获取特定 Slack 用户的详细信息。

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `userId` | string | 是 | 要查询的用户 ID（例如，U1234567890） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 用户的详细信息 |

### `slack_download`

从 Slack 下载文件

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `fileId` | string | 是 | 要下载的文件 ID |
| `fileName` | string | 否 | 可选的文件名覆盖 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | file | 下载的文件存储在执行文件中 |

### `slack_update_message`

更新由机器人在 Slack 中之前发送的消息

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `channel` | string | 是 | 消息发布的频道 ID（例如，C1234567890） |
| `timestamp` | string | 是 | 要更新的消息的时间戳（例如，1405894322.002768） |
| `text` | string | 是 | 新的消息文本（支持 Slack mrkdwn 格式） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | object | 包含 Slack 返回的所有属性的完整更新消息对象 |
| `content` | string | 成功消息 |
| `metadata` | object | 更新的消息元数据 |

### `slack_delete_message`

删除由机器人在 Slack 中之前发送的消息

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `channel` | string | 是 | 消息发布的频道 ID（例如，C1234567890） |
| `timestamp` | string | 是 | 要删除的消息的时间戳（例如，1405894322.002768） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 已删除消息的元数据 |

### `slack_add_reaction`

为 Slack 消息添加表情符号反应

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | 否 | 认证方法：oauth 或 bot_token |
| `botToken` | string | 否 | 自定义 Bot 的令牌 |
| `channel` | string | 是 | 消息发布的频道 ID（例如，C1234567890） |
| `timestamp` | string | 是 | 要添加反应的消息的时间戳（例如，1405894322.002768） |
| `name` | string | 是 | 表情符号反应的名称（不带冒号，例如，thumbsup、heart、eyes） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 成功消息 |
| `metadata` | object | 反应元数据 |

## 注意

- 类别：`tools`
- 类型：`slack`
```

--------------------------------------------------------------------------------

---[FILE: sms.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/sms.mdx

```text
---
title: SMS
description: 使用内部 SMS 服务发送短信
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
SMS 模块允许您通过 Sim 自有的 SMS 发送基础设施（由 Twilio 提供支持）直接从工作流中发送短信。此集成使您能够以编程方式将通知、警报和其他重要信息发送到用户的移动设备，而无需任何外部配置或 OAuth。

我们的内部 SMS 服务专为可靠性和易用性而设计，非常适合自动化通信并确保您的消息高效地到达收件人。
{/* MANUAL-CONTENT-END */}

## 使用说明

使用由 Twilio 提供支持的内部 SMS 服务直接发送短信。无需外部配置或 OAuth。非常适合从您的工作流中发送通知、警报或通用短信。需要包含国家代码的有效电话号码。

## 工具

### `sms_send`

使用由 Twilio 提供支持的内部 SMS 服务发送短信

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `to` | string | 是 | 收件人电话号码（包括国家代码，例如 +1234567890） |
| `body` | string | 是 | SMS 消息内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | SMS 是否成功发送 |
| `to` | string | 收件人电话号码 |
| `body` | string | SMS 消息内容 |

## 注意事项

- 类别：`tools`
- 类型：`sms`
```

--------------------------------------------------------------------------------

---[FILE: smtp.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/smtp.mdx

```text
---
title: SMTP
description: 通过任何 SMTP 邮件服务器发送电子邮件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="smtp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SMTP（简单邮件传输协议）](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) 是互联网电子邮件传输的基础标准。通过连接任何兼容 SMTP 的服务器（如 Gmail、Outlook 或您组织的邮件基础设施），您可以以编程方式发送电子邮件并自动化您的外发通信。

SMTP 集成允许您通过直接的服务器连接完全自定义电子邮件发送，支持基本和高级的电子邮件使用场景。使用 SMTP，您可以控制消息传递、收件人管理和内容格式的每个方面，使其适用于事务性通知、大量邮件发送以及任何需要强大外发电子邮件传递的自动化工作流程。

**通过 SMTP 集成可用的关键功能包括：**

- **通用电子邮件传递：** 通过配置标准服务器连接参数，使用任何 SMTP 服务器发送电子邮件。
- **可自定义的发件人和收件人：** 指定发件人地址、显示名称、主要收件人，以及抄送 (CC) 和密送 (BCC) 字段。
- **丰富的内容支持：** 根据您的需求发送纯文本或格式丰富的 HTML 电子邮件。
- **附件：** 在外发电子邮件中包含多个文件作为附件。
- **灵活的安全性：** 根据您的 SMTP 提供商支持的协议，使用 TLS、SSL 或标准（未加密）协议进行连接。
- **高级头信息：** 设置回复地址头和其他高级电子邮件选项，以满足复杂的邮件流和用户交互需求。

通过将 SMTP 与 Sim 集成，代理和工作流程可以以编程方式将电子邮件作为任何自动化流程的一部分发送——从发送通知和确认，到自动化外部通信、报告和文档传递。这提供了一种高度灵活、与提供商无关的方法，可以直接在您的 AI 驱动流程中管理电子邮件。
{/* MANUAL-CONTENT-END */}

## 使用说明

使用任何 SMTP 服务器（如 Gmail、Outlook、自定义服务器等）发送电子邮件。配置 SMTP 连接设置，并完全控制内容、收件人和附件来发送电子邮件。

## 工具

### `smtp_send_mail`

通过 SMTP 服务器发送电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `smtpHost` | string | 是 | SMTP 服务器主机名（例如：smtp.gmail.com） |
| `smtpPort` | number | 是 | SMTP 服务器端口（TLS 为 587，SSL 为 465） |
| `smtpUsername` | string | 是 | SMTP 身份验证用户名 |
| `smtpPassword` | string | 是 | SMTP 身份验证密码 |
| `smtpSecure` | string | 是 | 安全协议（TLS、SSL 或无） |
| `from` | string | 是 | 发件人电子邮件地址 |
| `to` | string | 是 | 收件人电子邮件地址 |
| `subject` | string | 是 | 电子邮件主题 |
| `body` | string | 是 | 电子邮件正文内容 |
| `contentType` | string | 否 | 内容类型（text 或 html） |
| `fromName` | string | 否 | 发件人显示名称 |
| `cc` | string | 否 | 抄送收件人（逗号分隔） |
| `bcc` | string | 否 | 密送收件人（逗号分隔） |
| `replyTo` | string | 否 | 回复电子邮件地址 |
| `attachments` | file[] | 否 | 附加到电子邮件的文件 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 邮件是否成功发送 |
| `messageId` | string | 来自 SMTP 服务器的消息 ID |
| `to` | string | 收件人电子邮件地址 |
| `subject` | string | 电子邮件主题 |
| `error` | string | 如果发送失败的错误消息 |

## 注意

- 分类：`tools`
- 类型：`smtp`
```

--------------------------------------------------------------------------------

````

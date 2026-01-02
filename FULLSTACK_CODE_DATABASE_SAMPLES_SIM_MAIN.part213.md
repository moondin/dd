---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 213
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 213 of 933)

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
Location: sim-main/apps/docs/content/docs/ja/tools/shopify.mdx

```text
---
title: Shopify
description: Shopifyストアで商品、注文、顧客、在庫を管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="shopify"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Shopify](https://www.shopify.com/)は、商人がオンラインストアを構築、運営、成長させるのを支援するために設計された主要なeコマースプラットフォームです。Shopifyを使えば、商品や在庫から注文や顧客まで、ストアのあらゆる側面を簡単に管理できます。

SimでShopifyを使用すると、エージェントは以下のことができます：

- **商品の作成と管理**：新しい商品の追加、商品詳細の更新、ストアからの商品の削除。
- **注文の一覧表示と取得**：フィルタリングや注文管理を含む、顧客注文に関する情報の取得。
- **顧客の管理**：顧客詳細へのアクセスと更新、またはストアへの新規顧客の追加。
- **在庫レベルの調整**：商品の在庫レベルをプログラムで変更し、在庫を正確に保つ。

SimのShopify統合を使用して、在庫の同期、注文の履行、リスティングの管理などの一般的なストア管理ワークフローを自動化から直接自動化します。エージェントがシンプルでプログラム的なツールを使用して、すべてのストアデータにアクセス、更新、整理できるようにします。
{/* MANUAL-CONTENT-END */}

## 使用方法

Shopifyをワークフローに統合します。商品、注文、顧客、在庫を管理します。商品の作成、読み取り、更新、削除を行います。注文の一覧表示と管理。顧客データの処理と在庫レベルの調整。

## ツール

### `shopify_create_product`

Shopifyストアに新しい商品を作成する

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `title` | string | はい | 商品タイトル |
| `descriptionHtml` | string | いいえ | 商品説明（HTML） |
| `vendor` | string | いいえ | 商品ベンダー/ブランド |
| `productType` | string | いいえ | 商品タイプ/カテゴリー |
| `tags` | array | いいえ | 商品タグ |
| `status` | string | いいえ | 商品ステータス（ACTIVE、DRAFT、ARCHIVED） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `product` | object | 作成された商品 |

### `shopify_get_product`

IDを使用してShopifyストアから単一の商品を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `productId` | string | はい | 商品ID（gid://shopify/Product/123456789） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `product` | object | 商品の詳細 |

### `shopify_list_products`

オプションのフィルタリングを使用してShopifyストアから商品リストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `first` | number | いいえ | 返す商品数（デフォルト：50、最大：250） |
| `query` | string | いいえ | 商品をフィルタリングする検索クエリ（例："title:shirt"または"vendor:Nike"または"status:active"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `products` | array | 商品リスト |
| `pageInfo` | object | ページネーション情報 |

### `shopify_update_product`

Shopifyストアの既存の商品を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `productId` | string | はい | 更新する商品ID（gid://shopify/Product/123456789） |
| `title` | string | いいえ | 新しい商品タイトル |
| `descriptionHtml` | string | いいえ | 新しい商品説明（HTML） |
| `vendor` | string | いいえ | 新しい商品ベンダー/ブランド |
| `productType` | string | いいえ | 新しい商品タイプ/カテゴリー |
| `tags` | array | いいえ | 新しい商品タグ |
| `status` | string | いいえ | 新しい商品ステータス（ACTIVE、DRAFT、ARCHIVED） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `product` | object | 更新された商品 |

### `shopify_delete_product`

Shopifyストアから商品を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `productId` | string | はい | 削除する商品ID（gid://shopify/Product/123456789） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deletedId` | string | 削除された商品のID |

### `shopify_get_order`

IDを指定してShopifyストアから単一の注文を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `orderId` | string | はい | 注文ID（gid://shopify/Order/123456789） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | 注文の詳細 |

### `shopify_list_orders`

オプションのフィルタリングを使用してShopifyストアから注文一覧を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `first` | number | いいえ | 返す注文数（デフォルト：50、最大：250） |
| `status` | string | いいえ | 注文ステータスでフィルタリング（open、closed、cancelled、any） |
| `query` | string | いいえ | 注文をフィルタリングする検索クエリ（例："financial_status:paid"または"fulfillment_status:unfulfilled"または"email:customer@example.com"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `orders` | array | 注文のリスト |
| `pageInfo` | object | ページネーション情報 |

### `shopify_update_order`

Shopifyストアの既存の注文を更新します（メモ、タグ、メール）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン \(例：mystore.myshopify.com\) |
| `orderId` | string | はい | 更新する注文ID \(gid://shopify/Order/123456789\) |
| `note` | string | いいえ | 新しい注文メモ |
| `tags` | array | いいえ | 新しい注文タグ |
| `email` | string | いいえ | 注文の新しい顧客メール |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | 更新された注文 |

### `shopify_cancel_order`

Shopifyストアの注文をキャンセルします

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン \(例：mystore.myshopify.com\) |
| `orderId` | string | はい | キャンセルする注文ID \(gid://shopify/Order/123456789\) |
| `reason` | string | はい | キャンセル理由 \(CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER\) |
| `notifyCustomer` | boolean | いいえ | キャンセルについて顧客に通知するかどうか |
| `refund` | boolean | いいえ | 注文を返金するかどうか |
| `restock` | boolean | いいえ | 在庫を補充するかどうか |
| `staffNote` | string | いいえ | スタッフ参照用のキャンセルに関するメモ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | キャンセル結果 |

### `shopify_create_customer`

Shopifyストアに新しい顧客を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `email` | string | いいえ | 顧客のメールアドレス |
| `firstName` | string | いいえ | 顧客の名 |
| `lastName` | string | いいえ | 顧客の姓 |
| `phone` | string | いいえ | 顧客の電話番号 |
| `note` | string | いいえ | 顧客に関するメモ |
| `tags` | array | いいえ | 顧客タグ |
| `addresses` | array | いいえ | 顧客の住所 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customer` | object | 作成された顧客 |

### `shopify_get_customer`

IDからShopifyストアの単一顧客を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `customerId` | string | はい | 顧客ID（gid://shopify/Customer/123456789） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customer` | object | 顧客の詳細 |

### `shopify_list_customers`

オプションのフィルタリングを使用してShopifyストアから顧客をリストアップする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | あなたのShopifyストアドメイン（例：mystore.myshopify.com） |
| `first` | number | いいえ | 返す顧客の数（デフォルト：50、最大：250） |
| `query` | string | いいえ | 顧客をフィルタリングする検索クエリ（例："first_name:John"または"last_name:Smith"または"email:*@gmail.com"または"tag:vip"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customers` | array | 顧客のリスト |
| `pageInfo` | object | ページネーション情報 |

### `shopify_update_customer`

Shopifyストアの既存の顧客を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | あなたのShopifyストアドメイン（例：mystore.myshopify.com） |
| `customerId` | string | はい | 更新する顧客ID（gid://shopify/Customer/123456789） |
| `email` | string | いいえ | 新しい顧客のメールアドレス |
| `firstName` | string | いいえ | 新しい顧客の名 |
| `lastName` | string | いいえ | 新しい顧客の姓 |
| `phone` | string | いいえ | 新しい顧客の電話番号 |
| `note` | string | いいえ | 顧客に関する新しいメモ |
| `tags` | array | いいえ | 新しい顧客タグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customer` | object | 更新された顧客 |

### `shopify_delete_customer`

Shopifyストアから顧客を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `customerId` | string | はい | 削除する顧客ID（gid://shopify/Customer/123456789） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deletedId` | string | 削除された顧客のID |

### `shopify_list_inventory_items`

Shopifyストアから在庫アイテムを一覧表示します。SKUで在庫アイテムIDを検索する際に使用します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `first` | number | いいえ | 返す在庫アイテム数（デフォルト：50、最大：250） |
| `query` | string | いいえ | 在庫アイテムをフィルタリングする検索クエリ（例："sku:ABC123"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `inventoryItems` | array | ID、SKU、在庫レベルを含む在庫アイテムのリスト |
| `pageInfo` | object | ページネーション情報 |

### `shopify_get_inventory_level`

特定の場所での商品バリアントの在庫レベルを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `inventoryItemId` | string | はい | 在庫アイテムID（gid://shopify/InventoryItem/123456789） |
| `locationId` | string | いいえ | フィルタリングする場所ID（オプション） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | 在庫レベルの詳細 |

### `shopify_adjust_inventory`

特定の場所で商品バリアントの在庫数量を調整する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `inventoryItemId` | string | はい | 在庫アイテムID（gid://shopify/InventoryItem/123456789） |
| `locationId` | string | はい | ロケーションID（gid://shopify/Location/123456789） |
| `delta` | number | はい | 調整する量（増加は正の値、減少は負の値） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `inventoryLevel` | object | 在庫調整の結果 |

### `shopify_list_locations`

Shopifyストアから在庫ロケーションを一覧表示します。在庫操作に必要なロケーションIDを見つけるために使用します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | Shopifyストアドメイン（例：mystore.myshopify.com） |
| `first` | number | いいえ | 返すロケーションの数（デフォルト：50、最大：250） |
| `includeInactive` | boolean | いいえ | 非アクティブ化されたロケーションを含めるかどうか（デフォルト：false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `locations` | array | ID、名前、住所を含むロケーションのリスト |
| `pageInfo` | object | ページネーション情報 |

### `shopify_create_fulfillment`

注文商品を発送済みとしてマークするためのフルフィルメントを作成します。フルフィルメント注文ID（注文詳細から取得）が必要です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | あなたのShopifyストアドメイン（例：mystore.myshopify.com） |
| `fulfillmentOrderId` | string | はい | フルフィルメント注文ID（例：gid://shopify/FulfillmentOrder/123456789） |
| `trackingNumber` | string | いいえ | 配送の追跡番号 |
| `trackingCompany` | string | いいえ | 配送業者名（例：UPS、FedEx、USPS、DHL） |
| `trackingUrl` | string | いいえ | 配送を追跡するためのURL |
| `notifyCustomer` | boolean | いいえ | 顧客に発送確認メールを送信するかどうか（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `fulfillment` | object | 追跡情報とフルフィルメントされた商品を含む作成されたフルフィルメント |

### `shopify_list_collections`

Shopifyストアから商品コレクションを一覧表示します。タイトル、タイプ（カスタム/スマート）、またはハンドルでフィルタリングできます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | あなたのShopifyストアドメイン（例：mystore.myshopify.com） |
| `first` | number | いいえ | 返すコレクションの数（デフォルト：50、最大：250） |
| `query` | string | いいえ | コレクションをフィルタリングする検索クエリ（例："title:Summer"または"collection_type:smart"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `collections` | array | ID、タイトル、商品数を含むコレクションのリスト |
| `pageInfo` | object | ページネーション情報 |

### `shopify_get_collection`

IDで特定のコレクションを取得し、その製品も含めます。これを使用してコレクション内の製品を取得できます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `shopDomain` | string | はい | あなたのShopifyストアドメイン（例：mystore.myshopify.com） |
| `collectionId` | string | はい | コレクションID（例：gid://shopify/Collection/123456789） |
| `productsFirst` | number | いいえ | このコレクションから返す製品の数（デフォルト：50、最大：250） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `collection` | object | 製品を含むコレクションの詳細 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `shopify`
```

--------------------------------------------------------------------------------

---[FILE: slack.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/slack.mdx

```text
---
title: Slack
description: Slackでメッセージの送信、更新、削除、リアクションの追加、またはSlackイベントからワークフローをトリガーする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="slack"
  color="#611f69"
/>

{/* MANUAL-CONTENT-START:intro */}
[Slack](https://www.slack.com/)は、チームにメッセージング、ツール、ファイルのための統一された場所を提供するビジネスコミュニケーションプラットフォームです。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/J5jz3UaWmE8"
  title="SimとのSlack連携"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Slackでは以下のことができます：

- **エージェント通知の自動化**: Simエージェントからのリアルタイム更新を任意のSlackチャンネルに送信
- **Webhookエンドポイントの作成**: SlackボットをWebhookとして設定し、SlackのアクティビティからSimワークフローをトリガー
- **エージェントワークフローの強化**: 結果、アラート、ステータス更新を配信するためにSlackメッセージングをエージェントに統合
- **Slackキャンバスの作成と共有**: Slackチャンネルで共同作業ドキュメント（キャンバス）をプログラムで生成
- **チャンネルからのメッセージ読み取り**: 監視やワークフロートリガーのために任意のSlackチャンネルから最近のメッセージを取得して処理
- **ボットメッセージの管理**: ボットが送信したメッセージの更新、削除、リアクションの追加

Simでは、Slack統合によりエージェントがワークフローの一部としてSlackとプログラム的に対話し、完全なメッセージ管理機能を利用できます：

- **メッセージ送信**: エージェントは書式設定されたメッセージを任意のSlackチャンネルまたはユーザーに送信でき、リッチフォーマットのためのSlackのmrkdwn構文をサポート
- **メッセージ更新**: 以前に送信したボットメッセージを編集して情報を修正したりステータス更新を提供
- **メッセージ削除**: 不要になったメッセージやエラーを含むボットメッセージを削除
- **リアクション追加**: 任意のメッセージに絵文字リアクションを追加して感情や確認を表現
- **キャンバス作成**: Slackキャンバス（共同作業ドキュメント）をチャンネル内で直接作成・共有し、より豊かなコンテンツ共有とドキュメント作成を可能に
- **メッセージ読み取り**: チャンネルからの最近のメッセージを読み取り、監視、レポート作成、またはチャンネルアクティビティに基づく追加アクションのトリガーを可能に
- **ファイルダウンロード**: Slackチャンネルで共有されたファイルを処理またはアーカイブのために取得

これにより、動的な更新を含む通知の送信、編集可能なステータスメッセージによる会話フローの管理、重要なメッセージへのリアクションによる確認、古くなったボットメッセージを削除してチャンネルをクリーンに保つなど、強力な自動化シナリオが可能になります。エージェントはタイムリーな情報を提供し、ワークフローの進行に合わせてメッセージを更新し、共同作業ドキュメントを作成したり、注意が必要な時にチームメンバーに警告したりできます。この統合により、AIワークフローとチームのコミュニケーションの間のギャップが埋まり、正確で最新の情報を全員が把握できるようになります。SimとSlackを接続することで、適切なタイミングで関連情報をチームに提供し続けるエージェントを作成し、洞察を自動的に共有・更新することでコラボレーションを強化し、手動でのステータス更新の必要性を減らすことができます—すべてチームがすでにコミュニケーションを取っている既存のSlackワークスペースを活用しながら。
{/* MANUAL-CONTENT-END */}

## 使用方法

Slackをワークフローに統合します。メッセージの送信、更新、削除、キャンバスの作成、メッセージの読み取り、リアクションの追加が可能です。高度なモードではOAuthの代わりにボットトークンが必要です。トリガーモードでは、チャンネルにメッセージが送信されたときにワークフローをトリガーするために使用できます。

## ツール

### `slack_message`

Slackチャンネルまたはダイレクトメッセージにメッセージを送信します。Slack mrkdwn形式をサポートしています。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | いいえ | 対象のSlackチャンネル（例：#general） |
| `userId` | string | いいえ | ダイレクトメッセージ用の対象SlackユーザーID（例：U1234567890） |
| `text` | string | はい | 送信するメッセージテキスト（Slack mrkdwn形式をサポート） |
| `thread_ts` | string | いいえ | 返信するスレッドのタイムスタンプ（スレッド返信を作成） |
| `files` | file[] | いいえ | メッセージに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | object | Slackから返されたすべてのプロパティを含む完全なメッセージオブジェクト |
| `ts` | string | メッセージのタイムスタンプ |
| `channel` | string | メッセージが送信されたチャンネルID |
| `fileCount` | number | アップロードされたファイル数（ファイルが添付されている場合） |

### `slack_canvas`

チャンネル内でSlackキャンバスを作成して共有します。キャンバスはSlack内の共同作業用ドキュメントです。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauth または bot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | はい | 対象のSlackチャンネル（例：#general） |
| `title` | string | はい | キャンバスのタイトル |
| `content` | string | はい | マークダウン形式のキャンバスコンテンツ |
| `document_content` | object | いいえ | 構造化されたキャンバスドキュメントコンテンツ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `canvas_id` | string | 作成されたキャンバスのID |
| `channel` | string | キャンバスが作成されたチャンネル |
| `title` | string | キャンバスのタイトル |

### `slack_message_reader`

Slackチャンネルから最新のメッセージを読み取ります。フィルタリングオプション付きで会話履歴を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | いいえ | メッセージを読み取るSlackチャンネル（例：#general） |
| `userId` | string | いいえ | DMの会話用のユーザーID（例：U1234567890） |
| `limit` | number | いいえ | 取得するメッセージ数（デフォルト：10、最大：100） |
| `oldest` | string | いいえ | 時間範囲の開始（タイムスタンプ） |
| `latest` | string | いいえ | 時間範囲の終了（タイムスタンプ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `messages` | array | チャンネルからのメッセージオブジェクトの配列 |

### `slack_list_channels`

Slackワークスペース内のすべてのチャンネルを一覧表示します。ボットがアクセスできるパブリックチャンネルとプライベートチャンネルを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `includePrivate` | boolean | いいえ | ボットがメンバーであるプライベートチャンネルを含める（デフォルト：true） |
| `excludeArchived` | boolean | いいえ | アーカイブされたチャンネルを除外する（デフォルト：true） |
| `limit` | number | いいえ | 返すチャンネルの最大数（デフォルト：100、最大：200） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `channels` | array | ワークスペースからのチャンネルオブジェクトの配列 |

### `slack_list_members`

Slackチャンネル内のすべてのメンバー（ユーザーID）を一覧表示します。IDを名前に解決するには「ユーザー情報を取得」と併用してください。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | はい | メンバーを一覧表示するチャンネルID |
| `limit` | number | いいえ | 返すメンバーの最大数（デフォルト：100、最大：200） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `members` | array | チャンネルのメンバーであるユーザーIDの配列（例：U1234567890） |

### `slack_list_users`

Slackワークスペース内のすべてのユーザーを一覧表示します。名前とアバターを含むユーザープロファイルを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `includeDeleted` | boolean | いいえ | 無効化/削除されたユーザーを含める（デフォルト：false） |
| `limit` | number | いいえ | 返すユーザーの最大数（デフォルト：100、最大：200） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `users` | array | ワークスペースからのユーザーオブジェクトの配列 |

### `slack_get_user`

ユーザーIDを使用して特定のSlackユーザーに関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `userId` | string | はい | 検索するユーザーID（例：U1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | 詳細なユーザー情報 |

### `slack_download`

Slackからファイルをダウンロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `fileId` | string | はい | ダウンロードするファイルのID |
| `fileName` | string | いいえ | オプションのファイル名上書き |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | file | 実行ファイルに保存されたダウンロードファイル |

### `slack_update_message`

Slackでボットが以前に送信したメッセージを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | はい | メッセージが投稿されたチャンネルID（例：C1234567890） |
| `timestamp` | string | はい | 更新するメッセージのタイムスタンプ（例：1405894322.002768） |
| `text` | string | はい | 新しいメッセージテキスト（Slack mrkdwn形式をサポート） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | object | Slackから返されたすべてのプロパティを含む完全な更新メッセージオブジェクト |
| `content` | string | 成功メッセージ |
| `metadata` | object | 更新されたメッセージのメタデータ |

### `slack_delete_message`

Slackでボットが以前に送信したメッセージを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | はい | メッセージが投稿されたチャンネルID（例：C1234567890） |
| `timestamp` | string | はい | 削除するメッセージのタイムスタンプ（例：1405894322.002768） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | 削除されたメッセージのメタデータ |

### `slack_add_reaction`

Slackメッセージに絵文字リアクションを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | いいえ | 認証方法：oauthまたはbot_token |
| `botToken` | string | いいえ | カスタムボット用のボットトークン |
| `channel` | string | はい | メッセージが投稿されたチャンネルID（例：C1234567890） |
| `timestamp` | string | はい | リアクションするメッセージのタイムスタンプ（例：1405894322.002768） |
| `name` | string | はい | 絵文字リアクションの名前（コロンなし、例：thumbsup、heart、eyes） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | リアクションのメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `slack`
```

--------------------------------------------------------------------------------

---[FILE: sms.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/sms.mdx

```text
---
title: SMS
description: 内部SMSサービスを使用してSMSメッセージを送信する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
SMSブロックを使用すると、Twilioを基盤としたSimの独自のSMS送信インフラストラクチャを使用して、ワークフローから直接テキストメッセージを送信できます。この統合により、外部設定やOAuthを必要とせずに、通知、アラート、その他の重要な情報をユーザーのモバイルデバイスにプログラムで配信することができます。

当社の内部SMSサービスは信頼性と使いやすさを重視して設計されており、コミュニケーションの自動化と受信者へのメッセージの効率的な配信を確実にするのに最適です。
{/* MANUAL-CONTENT-END */}

## 使用方法

Twilioを基盤とした内部SMSサービスを使用して、SMSメッセージを直接送信します。外部設定やOAuthは不要です。ワークフローから通知、アラート、または一般的なテキストメッセージを送信するのに最適です。国番号を含む有効な電話番号が必要です。

## ツール

### `sms_send`

Twilioを基盤とした内部SMSサービスを使用してSMSメッセージを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `to` | string | はい | 受信者の電話番号（国番号を含む、例：+1234567890） |
| `body` | string | はい | SMSメッセージの内容 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | SMSが正常に送信されたかどうか |
| `to` | string | 受信者の電話番号 |
| `body` | string | SMSメッセージの内容 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `sms`
```

--------------------------------------------------------------------------------

---[FILE: smtp.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/smtp.mdx

```text
---
title: SMTP
description: 任意のSMTPメールサーバーを介してメールを送信
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="smtp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SMTP（Simple Mail Transfer Protocol）](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)は、インターネット上でのメール送信の基本的な標準規格です。Gmail、Outlook、または組織独自のメールインフラなど、SMTP互換サーバーに接続することで、プログラムによるメール送信や送信コミュニケーションの自動化が可能になります。

SMTP統合により、サーバーへの直接接続を通じてメール送信を完全にカスタマイズでき、基本的なものから高度なメールユースケースまでサポートします。SMTPを使用すると、メッセージ配信、受信者管理、コンテンツフォーマットなどあらゆる側面を制御できるため、トランザクションメール通知、一括メール送信、堅牢な送信メール配信を必要とするあらゆる自動化ワークフローに適しています。

**SMTP統合で利用可能な主な機能：**

- **ユニバーサルなメール配信：** 標準的なサーバー接続パラメータを設定することで、任意のSMTPサーバーを使用してメールを送信できます。
- **カスタマイズ可能な送信者と受信者：** 送信者アドレス、表示名、主要受信者、CCおよびBCCフィールドを指定できます。
- **リッチコンテンツのサポート：** 要件に応じて、プレーンテキストまたはリッチフォーマットのHTMLメールを送信できます。
- **添付ファイル：** 送信メールに複数のファイルを添付ファイルとして含めることができます。
- **柔軟なセキュリティ：** SMTPプロバイダーがサポートするTLS、SSL、または標準（非暗号化）プロトコルを使用して接続できます。
- **高度なヘッダー：** 返信先ヘッダーやその他の高度なメールオプションを設定して、複雑なメールフローやユーザーインタラクションに対応できます。

SMTPをSimと統合することで、エージェントやワークフローは、通知や確認メールの送信から、外部コミュニケーション、レポート作成、文書配信の自動化まで、あらゆる自動化プロセスの一部としてプログラムによるメール送信が可能になります。これにより、AI駆動プロセス内で直接メールを管理するための、非常に柔軟でプロバイダーに依存しないアプローチが提供されます。
{/* MANUAL-CONTENT-END */}

## 使用方法

任意のSMTPサーバー（Gmail、Outlook、カスタムサーバーなど）を使用してメールを送信します。SMTP接続設定を構成し、コンテンツ、受信者、添付ファイルを完全に制御してメールを送信できます。

## ツール

### `smtp_send_mail`

SMTPサーバー経由でメールを送信

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `smtpHost` | string | はい | SMTPサーバーのホスト名（例：smtp.gmail.com） |
| `smtpPort` | number | はい | SMTPサーバーのポート（TLSの場合は587、SSLの場合は465） |
| `smtpUsername` | string | はい | SMTP認証のユーザー名 |
| `smtpPassword` | string | はい | SMTP認証のパスワード |
| `smtpSecure` | string | はい | セキュリティプロトコル（TLS、SSL、またはNone） |
| `from` | string | はい | 送信者のメールアドレス |
| `to` | string | はい | 受信者のメールアドレス |
| `subject` | string | はい | メールの件名 |
| `body` | string | はい | メール本文の内容 |
| `contentType` | string | いいえ | コンテンツタイプ（textまたはhtml） |
| `fromName` | string | いいえ | 送信者の表示名 |
| `cc` | string | いいえ | CC受信者（カンマ区切り） |
| `bcc` | string | いいえ | BCC受信者（カンマ区切り） |
| `replyTo` | string | いいえ | 返信先メールアドレス |
| `attachments` | file[] | いいえ | メールに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メールが正常に送信されたかどうか |
| `messageId` | string | SMTPサーバーからのメッセージID |
| `to` | string | 受信者のメールアドレス |
| `subject` | string | メールの件名 |
| `error` | string | 送信に失敗した場合のエラーメッセージ |

## メモ

- カテゴリー: `tools`
- タイプ: `smtp`
```

--------------------------------------------------------------------------------

````

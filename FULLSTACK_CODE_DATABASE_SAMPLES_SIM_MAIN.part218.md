---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 218
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 218 of 933)

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

---[FILE: webflow.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/webflow.mdx

```text
---
title: Webflow
description: Webflow CMSコレクションを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webflow"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Webflow](https://webflow.com/)は、コードを書かずに応答性の高いウェブサイトを構築できる強力なビジュアルウェブデザインプラットフォームです。視覚的なデザインインターフェースと堅牢なCMS（コンテンツ管理システム）を組み合わせており、ウェブサイト用の動的コンテンツを作成、管理、公開することができます。

Webflowでは以下のことが可能です：

- **視覚的にデザインする**：クリーンでセマンティックなHTML/CSSコードを生成する視覚エディタで、カスタムウェブサイトを作成
- **動的にコンテンツを管理する**：CMSを使用してブログ投稿、製品、チームメンバー、またはカスタムデータなどの構造化されたコンテンツのコレクションを作成
- **即時に公開する**：サイトをWebflowのホスティングにデプロイするか、カスタムホスティング用にコードをエクスポート
- **レスポンシブデザインを作成する**：デスクトップ、タブレット、モバイルデバイスでシームレスに動作するサイトを構築
- **コレクションをカスタマイズする**：コンテンツタイプのカスタムフィールドとデータ構造を定義
- **コンテンツ更新を自動化する**：APIを通じてCMSコンテンツをプログラムで管理

Simでは、Webflow統合によりエージェントがAPI認証を通じてWebflow CMSコレクションとシームレスに連携できます。これにより、AIが生成したコンテンツからブログ投稿を自動作成したり、製品情報を更新したり、チームメンバープロフィールを管理したり、動的コンテンツ生成のためにCMSアイテムを取得したりするなど、強力な自動化シナリオが可能になります。エージェントは既存のアイテムをリストしてコンテンツを閲覧したり、IDで特定のアイテムを取得したり、新しいエントリを作成して新鮮なコンテンツを追加したり、既存のアイテムを更新して情報を最新の状態に保ったり、古いコンテンツを削除したりできます。この統合により、AIワークフローとWebflow CMSの間のギャップが埋まり、自動化されたコンテンツ管理、動的なウェブサイト更新、合理化されたコンテンツワークフローが可能になり、手動介入なしにサイトを常に新鮮で最新の状態に保つことができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Webflow CMSをワークフローに統合します。Webflow CMSコレクションのアイテムを作成、取得、一覧表示、更新、または削除できます。Webflowのコンテンツをプログラムで管理します。トリガーモードでは、コレクションアイテムが変更されたり、フォームが送信されたりしたときにワークフローをトリガーするために使用できます。

## ツール

### `webflow_list_items`

Webflow CMSコレクションからすべてのアイテムを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WebflowサイトのID |
| `collectionId` | string | はい | コレクションのID |
| `offset` | number | いいえ | ページネーション用のオフセット（オプション） |
| `limit` | number | いいえ | 返す最大アイテム数（オプション、デフォルト：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | json | コレクションアイテムの配列 |
| `metadata` | json | クエリに関するメタデータ |

### `webflow_get_item`

Webflow CMSコレクションから単一のアイテムを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WebflowサイトのID |
| `collectionId` | string | はい | コレクションのID |
| `itemId` | string | はい | 取得するアイテムのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `item` | json | 取得したアイテムオブジェクト |
| `metadata` | json | 取得したアイテムに関するメタデータ |

### `webflow_create_item`

Webflow CMSコレクションに新しいアイテムを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WebflowサイトのID |
| `collectionId` | string | はい | コレクションのID |
| `fieldData` | json | はい | 新しいアイテムのフィールドデータ（JSONオブジェクト）。キーはコレクションフィールド名と一致する必要があります。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `item` | json | 作成されたアイテムオブジェクト |
| `metadata` | json | 作成されたアイテムに関するメタデータ |

### `webflow_update_item`

Webflow CMSコレクション内の既存アイテムを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WebflowサイトのID |
| `collectionId` | string | はい | コレクションのID |
| `itemId` | string | はい | 更新するアイテムのID |
| `fieldData` | json | はい | 更新するフィールドデータ（JSONオブジェクト）。変更したいフィールドのみを含めてください。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `item` | json | 更新されたアイテムオブジェクト |
| `metadata` | json | 更新されたアイテムに関するメタデータ |

### `webflow_delete_item`

Webflow CMSコレクションからアイテムを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WebflowサイトのID |
| `collectionId` | string | はい | コレクションのID |
| `itemId` | string | はい | 削除するアイテムのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 削除が成功したかどうか |
| `metadata` | json | 削除に関するメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `webflow`
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/webhook.mdx

```text
---
title: Webhook
description: 外部のウェブフックからワークフローの実行をトリガーする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webhook"
  color="#10B981"
/>

## 注意事項

- カテゴリー: `triggers`
- タイプ: `webhook`
```

--------------------------------------------------------------------------------

---[FILE: whatsapp.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/whatsapp.mdx

```text
---
title: WhatsApp
description: WhatsAppメッセージを送信
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="whatsapp"
  color="#25D366"
/>

{/* MANUAL-CONTENT-START:intro */}
[WhatsApp](https://www.whatsapp.com/)は、個人と企業間の安全で信頼性の高いコミュニケーションを可能にする、世界的に人気のあるメッセージングプラットフォームです。

WhatsApp Business APIは組織に以下の強力な機能を提供します：

- **顧客とのエンゲージメント**: パーソナライズされたメッセージ、通知、更新を顧客が好むメッセージングアプリに直接送信
- **会話の自動化**: 一般的な問い合わせに対するインタラクティブなチャットボットと自動応答システムの作成
- **サポートの強化**: リッチメディアをサポートする使い慣れたインターフェースを通じてリアルタイムの顧客サービスを提供
- **コンバージョンの促進**: 安全でコンプライアンスに準拠した環境で顧客との取引やフォローアップを促進

Simでは、WhatsApp統合によりエージェントがワークフローの一部としてこれらのメッセージング機能を活用できるようになります。これにより、予約リマインダー、認証コード、アラート、インタラクティブな会話など、高度な顧客エンゲージメントシナリオが可能になります。この統合はAIワークフローと顧客コミュニケーションチャネルの間のギャップを埋め、エージェントがタイムリーで関連性の高い情報をユーザーのモバイルデバイスに直接配信できるようにします。SimとWhatsAppを接続することで、顧客が好むメッセージングプラットフォームを通じて顧客とエンゲージする知的なエージェントを構築し、ユーザー体験を向上させながら定型的なメッセージングタスクを自動化できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

WhatsAppをワークフローに統合します。メッセージを送信できます。

## ツール

### `whatsapp_send_message`

WhatsAppメッセージを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `phoneNumber` | string | はい | 国コード付き受信者電話番号 |
| `message` | string | はい | 送信するメッセージ内容 |
| `phoneNumberId` | string | はい | WhatsAppビジネス電話番号ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | WhatsAppメッセージ送信成功ステータス |
| `messageId` | string | WhatsAppメッセージの一意識別子 |
| `phoneNumber` | string | 受信者電話番号 |
| `status` | string | メッセージ配信ステータス |
| `timestamp` | string | メッセージ送信タイムスタンプ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `whatsapp`
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/wikipedia.mdx

```text
---
title: Wikipedia
description: Wikipediaからコンテンツを検索して取得する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wikipedia"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wikipedia](https://www.wikipedia.org/)は世界最大の無料オンライン百科事典で、幅広いトピックに関する何百万もの記事を提供し、ボランティアによって共同で執筆・維持されています。

Wikipediaでは以下のことができます：

- **記事を検索する**：キーワードやトピックで関連するWikipediaページを検索
- **記事の要約を取得する**：素早く参照できるようにWikipediaページの簡潔な要約を取得
- **全文にアクセスする**：詳細な情報を得るためにWikipedia記事の完全な内容を取得
- **ランダムな記事を発見する**：ランダムなWikipediaページを取得して新しいトピックを探索

Simでは、Wikipediaとの連携により、エージェントがワークフローの一部としてWikipediaのコンテンツにプログラム的にアクセスし、操作することができます。エージェントは記事の検索、要約の取得、ページ全文の取得、ランダム記事の発見などが可能で、世界最大の百科事典から最新かつ信頼性の高い情報を自動化プロセスに活用できます。この連携は、調査、コンテンツ充実、事実確認、知識発見などのシナリオに最適で、エージェントが意思決定やタスク実行プロセスにWikipediaのデータをシームレスに組み込むことができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Wikipediaをワークフローに統合します。ページの要約の取得、ページの検索、ページ内容の取得、ランダムページの取得が可能です。

## ツール

### `wikipedia_summary`

特定のWikipediaページの要約とメタデータを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | はい | 要約を取得するWikipediaページのタイトル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `summary` | object | Wikipediaページの要約とメタデータ |

### `wikipedia_search`

タイトルまたはコンテンツでWikipediaページを検索します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | Wikipediaページを検索するための検索クエリ |
| `searchLimit` | number | いいえ | 返す結果の最大数（デフォルト：10、最大：50） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `searchResults` | array | 一致するWikipediaページの配列 |

### `wikipedia_content`

WikipediaページのHTML全文を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | はい | コンテンツを取得するWikipediaページのタイトル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | object | WikipediaページのHTML全文とメタデータ |

### `wikipedia_random`

ランダムなWikipediaページを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `randomPage` | object | ランダムなWikipediaページのデータ |

## 注意事項

- カテゴリ: `tools`
- タイプ: `wikipedia`
```

--------------------------------------------------------------------------------

---[FILE: wordpress.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/wordpress.mdx

```text
---
title: WordPress
description: WordPressコンテンツを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wordpress"
  color="#21759B"
/>

{/* MANUAL-CONTENT-START:intro */}
[WordPress](https://wordpress.org/)は、世界をリードするオープンソースのコンテンツ管理システムで、ウェブサイト、ブログ、あらゆる種類のオンラインコンテンツの公開と管理を容易にします。WordPressを使用すると、投稿やページの作成と更新、カテゴリーやタグによるコンテンツの整理、メディアファイルの管理、コメントの調整、ユーザーアカウントの処理が可能になり、個人ブログから複雑なビジネスサイトまであらゆるものを運営できます。

SimとWordPressの統合により、エージェントは重要なウェブサイトのタスクを自動化できます。特定のタイトル、コンテンツ、カテゴリー、タグ、アイキャッチ画像を含む新しいブログ投稿をプログラムで作成できます。既存の投稿の更新（コンテンツ、タイトル、公開ステータスの変更など）も簡単です。また、コンテンツの公開や下書き保存、静的ページの管理、メディアのアップロード、コメントの監視、関連する分類法へのコンテンツの割り当ても可能です。

WordPressを自動化に接続することで、Simはエージェントがコンテンツの公開、編集ワークフロー、日常的なサイト管理を効率化できるようにし、手動での作業なしにウェブサイトを新鮮で整理され、安全に保つのに役立ちます。
{/* MANUAL-CONTENT-END */}

## 使用手順

WordPressと統合して、投稿、ページ、メディア、コメント、カテゴリー、タグ、ユーザーの作成、更新、管理を行います。OAuth経由のWordPress.comサイトとアプリケーションパスワード認証を使用した自己ホスト型WordPressサイトをサポートしています。

## ツール

### `wordpress_create_post`

WordPress.comに新しいブログ投稿を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `title` | string | はい | 投稿タイトル |
| `content` | string | いいえ | 投稿コンテンツ（HTMLまたはプレーンテキスト） |
| `status` | string | いいえ | 投稿ステータス：publish、draft、pending、private、またはfuture |
| `excerpt` | string | いいえ | 投稿の抜粋 |
| `categories` | string | いいえ | カンマ区切りのカテゴリーID |
| `tags` | string | いいえ | カンマ区切りのタグID |
| `featuredMedia` | number | いいえ | アイキャッチ画像のメディアID |
| `slug` | string | いいえ | 投稿のURLスラッグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `post` | object | 作成された投稿 |

### `wordpress_update_post`

WordPress.comの既存のブログ投稿を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `postId` | number | はい | 更新する投稿のID |
| `title` | string | いいえ | 投稿タイトル |
| `content` | string | いいえ | 投稿内容（HTMLまたはプレーンテキスト） |
| `status` | string | いいえ | 投稿ステータス：publish、draft、pending、private、またはfuture |
| `excerpt` | string | いいえ | 投稿の抜粋 |
| `categories` | string | いいえ | カンマ区切りのカテゴリーID |
| `tags` | string | いいえ | カンマ区切りのタグID |
| `featuredMedia` | number | いいえ | アイキャッチ画像のメディアID |
| `slug` | string | いいえ | 投稿のURLスラッグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `post` | object | 更新された投稿 |

### `wordpress_delete_post`

WordPress.comからブログ投稿を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `postId` | number | はい | 削除する投稿のID |
| `force` | boolean | いいえ | ゴミ箱をバイパスして強制的に完全に削除する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 投稿が削除されたかどうか |
| `post` | object | 削除された投稿 |

### `wordpress_get_post`

IDによってWordPress.comから単一のブログ投稿を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `postId` | number | はい | 取得する投稿のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `post` | object | 取得された投稿 |

### `wordpress_list_posts`

オプションのフィルターを使用してWordPress.comからブログ投稿を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `perPage` | number | いいえ | ページあたりの投稿数（デフォルト：10、最大：100） |
| `page` | number | いいえ | ページネーションのページ番号 |
| `status` | string | いいえ | 投稿ステータスフィルター：publish、draft、pending、private |
| `author` | number | いいえ | 著者IDでフィルタリング |
| `categories` | string | いいえ | フィルタリングするカテゴリIDのカンマ区切りリスト |
| `tags` | string | いいえ | フィルタリングするタグIDのカンマ区切りリスト |
| `search` | string | いいえ | 投稿をフィルタリングする検索語 |
| `orderBy` | string | いいえ | 並べ替えフィールド：date、id、title、slug、modified |
| `order` | string | いいえ | 並べ替え方向：ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `posts` | array | 投稿のリスト |

### `wordpress_create_page`

WordPress.comで新しいページを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `title` | string | はい | ページタイトル |
| `content` | string | いいえ | ページコンテンツ（HTMLまたはプレーンテキスト） |
| `status` | string | いいえ | ページステータス：publish、draft、pending、private |
| `excerpt` | string | いいえ | ページの抜粋 |
| `parent` | number | いいえ | 階層ページの親ページID |
| `menuOrder` | number | いいえ | ページメニューでの順序 |
| `featuredMedia` | number | いいえ | アイキャッチ画像のメディアID |
| `slug` | string | いいえ | ページのURLスラッグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `page` | object | 作成されたページ |

### `wordpress_update_page`

WordPress.comの既存ページを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `pageId` | number | はい | 更新するページのID |
| `title` | string | いいえ | ページタイトル |
| `content` | string | いいえ | ページコンテンツ（HTMLまたはプレーンテキスト） |
| `status` | string | いいえ | ページステータス：publish、draft、pending、private |
| `excerpt` | string | いいえ | ページの抜粋 |
| `parent` | number | いいえ | 階層ページの親ページID |
| `menuOrder` | number | いいえ | ページメニューでの順序 |
| `featuredMedia` | number | いいえ | アイキャッチ画像のメディアID |
| `slug` | string | いいえ | ページのURLスラッグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `page` | object | 更新されたページ |

### `wordpress_delete_page`

WordPress.comからページを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `pageId` | number | はい | 削除するページのID |
| `force` | boolean | いいえ | ゴミ箱をバイパスして強制的に完全に削除する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | ページが削除されたかどうか |
| `page` | object | 削除されたページ |

### `wordpress_get_page`

IDによってWordPress.comから単一のページを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `pageId` | number | はい | 取得するページのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `page` | object | 取得したページ |

### `wordpress_list_pages`

オプションのフィルターを使用してWordPress.comからページを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `perPage` | number | いいえ | リクエストごとのページ数（デフォルト：10、最大：100） |
| `page` | number | いいえ | ページネーションのためのページ番号 |
| `status` | string | いいえ | ページステータスフィルター：publish、draft、pending、private |
| `parent` | number | いいえ | 親ページIDでフィルタリング |
| `search` | string | いいえ | ページをフィルタリングする検索語 |
| `orderBy` | string | いいえ | フィールドで並べ替え：date、id、title、slug、modified、menu_order |
| `order` | string | いいえ | 並べ替え方向：ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pages` | array | ページのリスト |

### `wordpress_upload_media`

メディアファイル（画像、動画、ドキュメント）をWordPress.comにアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例：12345678またはmysite.wordpress.com\) |
| `file` | file | いいえ | アップロードするファイル（UserFileオブジェクト） |
| `filename` | string | いいえ | オプションのファイル名上書き（例：image.jpg） |
| `title` | string | いいえ | メディアタイトル |
| `caption` | string | いいえ | メディアキャプション |
| `altText` | string | いいえ | アクセシビリティのための代替テキスト |
| `description` | string | いいえ | メディアの説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `media` | object | アップロードされたメディアアイテム |

### `wordpress_get_media`

IDによってWordPress.comから単一のメディアアイテムを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例：12345678またはmysite.wordpress.com\) |
| `mediaId` | number | はい | 取得するメディアアイテムのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `media` | object | 取得されたメディアアイテム |

### `wordpress_list_media`

WordPress.comメディアライブラリからメディアアイテムを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `perPage` | number | いいえ | リクエストごとのメディアアイテム数（デフォルト：10、最大：100） |
| `page` | number | いいえ | ページネーション用のページ番号 |
| `search` | string | いいえ | メディアをフィルタリングする検索語 |
| `mediaType` | string | いいえ | メディアタイプでフィルタリング：image、video、audio、application |
| `mimeType` | string | いいえ | 特定のMIMEタイプでフィルタリング（例：image/jpeg） |
| `orderBy` | string | いいえ | フィールドで並べ替え：date、id、title、slug |
| `order` | string | いいえ | 並べ替え方向：ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `media` | array | メディアアイテムのリスト |

### `wordpress_delete_media`

WordPress.comからメディアアイテムを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `mediaId` | number | はい | 削除するメディアアイテムのID |
| `force` | boolean | いいえ | 強制削除（メディアにはゴミ箱がないため、削除は永続的です） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | メディアが削除されたかどうか |
| `media` | object | 削除されたメディアアイテム |

### `wordpress_create_comment`

WordPress.comの投稿に新しいコメントを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `postId` | number | はい | コメントする投稿のID |
| `content` | string | はい | コメント内容 |
| `parent` | number | いいえ | 返信の場合の親コメントID |
| `authorName` | string | いいえ | コメント投稿者の表示名 |
| `authorEmail` | string | いいえ | コメント投稿者のメールアドレス |
| `authorUrl` | string | いいえ | コメント投稿者のURL |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `comment` | object | 作成されたコメント |

### `wordpress_list_comments`

オプションのフィルターを使用してWordPress.comからコメントを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `perPage` | number | いいえ | リクエストごとのコメント数（デフォルト：10、最大：100） |
| `page` | number | いいえ | ページネーションのページ番号 |
| `postId` | number | いいえ | 投稿IDでフィルタリング |
| `status` | string | いいえ | コメントステータスでフィルタリング：approved、hold、spam、trash |
| `search` | string | いいえ | コメントをフィルタリングする検索語 |
| `orderBy` | string | いいえ | フィールドで並べ替え：date、id、parent |
| `order` | string | いいえ | 並べ替え方向：ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `comments` | array | コメントのリスト |

### `wordpress_update_comment`

WordPress.comのコメントを更新します（内容またはステータス）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例: 12345678 または mysite.wordpress.com\) |
| `commentId` | number | はい | 更新するコメントのID |
| `content` | string | いいえ | 更新されたコメント内容 |
| `status` | string | いいえ | コメントステータス: approved（承認済み）、hold（保留中）、spam（スパム）、trash（ゴミ箱） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `comment` | object | 更新されたコメント |

### `wordpress_delete_comment`

WordPress.comからコメントを削除します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例: 12345678 または mysite.wordpress.com\) |
| `commentId` | number | はい | 削除するコメントのID |
| `force` | boolean | いいえ | ゴミ箱をバイパスして強制的に完全に削除する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | コメントが削除されたかどうか |
| `comment` | object | 削除されたコメント |

### `wordpress_create_category`

WordPress.comに新しいカテゴリを作成します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `name` | string | はい | カテゴリ名 |
| `description` | string | いいえ | カテゴリの説明 |
| `parent` | number | いいえ | 階層カテゴリの親カテゴリID |
| `slug` | string | いいえ | カテゴリのURLスラッグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `category` | object | 作成されたカテゴリ |

### `wordpress_list_categories`

WordPress.comからカテゴリを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `perPage` | number | いいえ | リクエストごとのカテゴリ数（デフォルト：10、最大：100） |
| `page` | number | いいえ | ページネーションのページ番号 |
| `search` | string | いいえ | カテゴリをフィルタリングする検索語 |
| `order` | string | いいえ | 並び順の方向：ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `categories` | array | カテゴリのリスト |

### `wordpress_create_tag`

WordPress.comに新しいタグを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン（例：12345678またはmysite.wordpress.com） |
| `name` | string | はい | タグ名 |
| `description` | string | いいえ | タグの説明 |
| `slug` | string | いいえ | タグのURLスラッグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tag` | object | 作成されたタグ |

### `wordpress_list_tags`

WordPress.comからタグを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例: 12345678またはmysite.wordpress.com\) |
| `perPage` | number | いいえ | リクエストごとのタグ数 \(デフォルト: 10、最大: 100\) |
| `page` | number | いいえ | ページネーション用のページ番号 |
| `search` | string | いいえ | タグをフィルタリングする検索語 |
| `order` | string | いいえ | 並び順の方向: ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tags` | array | タグのリスト |

### `wordpress_get_current_user`

現在認証されているWordPress.comユーザーに関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例: 12345678またはmysite.wordpress.com\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | 現在のユーザー |

### `wordpress_list_users`

WordPress.comからユーザーを一覧表示する（管理者権限が必要）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例: 12345678またはmysite.wordpress.com\) |
| `perPage` | number | いいえ | リクエストごとのユーザー数 \(デフォルト: 10、最大: 100\) |
| `page` | number | いいえ | ページネーション用のページ番号 |
| `search` | string | いいえ | ユーザーをフィルタリングする検索語 |
| `roles` | string | いいえ | フィルタリングするロール名（カンマ区切り） |
| `order` | string | いいえ | 並び順の方向: ascまたはdesc |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `users` | array | ユーザーのリスト |

### `wordpress_get_user`

IDによってWordPress.comから特定のユーザーを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例：12345678またはmysite.wordpress.com\) |
| `userId` | number | はい | 取得するユーザーのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | 取得したユーザー |

### `wordpress_search_content`

WordPress.comのすべてのコンテンツタイプ（投稿、ページ、メディア）を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | はい | WordPress.comのサイトIDまたはドメイン \(例：12345678またはmysite.wordpress.com\) |
| `query` | string | はい | 検索クエリ |
| `perPage` | number | いいえ | リクエストごとの結果数 \(デフォルト：10、最大：100\) |
| `page` | number | いいえ | ページネーションのためのページ番号 |
| `type` | string | いいえ | コンテンツタイプによるフィルタリング：post、page、attachment |
| `subtype` | string | いいえ | 投稿タイプスラッグによるフィルタリング \(例：post、page\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 検索結果 |

## メモ

- カテゴリー: `tools`
- タイプ: `wordpress`
```

--------------------------------------------------------------------------------

---[FILE: x.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/x.mdx

```text
---
title: X
description: Xとインタラクトする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="x"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[X](https://x.com/)（旧Twitter）は、リアルタイムコミュニケーション、コンテンツ共有、世界中のオーディエンスとのエンゲージメントを可能にする人気のソーシャルメディアプラットフォームです。

SimにおけるX統合は、OAuth認証を活用してXのAPIと安全に接続し、エージェントがプログラムによってプラットフォームとやり取りできるようにします。このOAuth実装により、ユーザーのプライバシーとセキュリティを維持しながら、Xの機能への安全なアクセスが保証されます。

X統合により、エージェントは以下のことが可能になります：

- **コンテンツの投稿**: ワークフローから直接新しいツイートの作成、既存の会話への返信、またはメディアの共有
- **会話のモニタリング**: 関連する議論について情報を得るために、メンション、キーワード、または特定のアカウントを追跡
- **オーディエンスとのエンゲージメント**: メンション、ダイレクトメッセージ、または特定のトリガーに自動的に応答
- **トレンド分析**: トレンドトピック、ハッシュタグ、またはユーザーエンゲージメントパターンから洞察を収集
- **情報調査**: エージェントの意思決定に役立つ特定のコンテンツ、ユーザープロファイル、または会話を検索

Simでは、X統合により高度なソーシャルメディア自動化シナリオが可能になります。エージェントはブランドメンションをモニタリングして適切に対応したり、特定のトリガーに基づいてコンテンツをスケジュールして公開したり、市場調査のためのソーシャルリスニングを実施したり、会話型AIとソーシャルメディアエンゲージメントの両方にまたがるインタラクティブな体験を作成したりすることができます。SimとXをOAuthで接続することで、プラットフォームのポリシーとAPI使用のベストプラクティスを遵守しながら、一貫性のある応答性の高いソーシャルメディアプレゼンスを維持するインテリジェントなエージェントを構築できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Xをワークフローに統合します。新しいツイートの投稿、ツイートの詳細取得、ツイート検索、ユーザープロフィールの取得が可能です。OAuthが必要です。

## ツール

### `x_write`

X（Twitter）で新しいツイートの投稿、ツイートへの返信、または投票の作成を行います

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | ツイートのテキスト内容 |
| `replyTo` | string | いいえ | 返信先ツイートのID |
| `mediaIds` | array | いいえ | ツイートに添付するメディアIDの配列 |
| `poll` | object | いいえ | ツイートの投票設定 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tweet` | object | 新しく作成されたツイートデータ |

### `x_read`

返信や会話のコンテキストを含むツイートの詳細を読み取ります

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tweetId` | string | はい | 読み取るツイートのID |
| `includeReplies` | boolean | いいえ | ツイートへの返信を含めるかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tweet` | object | メインツイートデータ |

### `x_search`

キーワード、ハッシュタグ、または高度なクエリを使用してツイートを検索します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリ（X検索演算子をサポート） |
| `maxResults` | number | いいえ | 返す結果の最大数（デフォルト：10、最大：100） |
| `startTime` | string | いいえ | 検索の開始時間（ISO 8601形式） |
| `endTime` | string | いいえ | 検索の終了時間（ISO 8601形式） |
| `sortOrder` | string | いいえ | 結果の並べ替え順序（recencyまたはrelevancy） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tweets` | array | 検索クエリに一致するツイートの配列 |

### `x_user`

ユーザープロフィール情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `username` | string | はい | 検索するユーザー名（@記号なし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | Xユーザープロフィール情報 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `x`
```

--------------------------------------------------------------------------------

---[FILE: youtube.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/youtube.mdx

```text
---
title: YouTube
description: YouTubeの動画、チャンネル、プレイリストとやり取りする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="youtube"
  color="#FF0000"
/>

{/* MANUAL-CONTENT-START:intro */}
[YouTube](https://www.youtube.com/)は世界最大の動画共有プラットフォームで、数十億の動画をホストし、毎月20億人以上のログインユーザーにサービスを提供しています。

YouTubeの広範なAPI機能を使用すると、以下のことが可能です：

- **コンテンツ検索**：特定のキーワード、フィルター、パラメーターを使用してYouTubeの膨大なライブラリから関連動画を検索
- **メタデータへのアクセス**：タイトル、説明、視聴回数、エンゲージメント指標など、動画に関する詳細情報の取得
- **トレンド分析**：特定のカテゴリーや地域内の人気コンテンツやトレンドトピックの特定
- **インサイトの抽出**：視聴者の好み、コンテンツのパフォーマンス、エンゲージメントパターンに関するデータの収集

Simでは、YouTube統合によりエージェントがワークフローの一部としてYouTubeコンテンツをプログラムで検索・分析できるようになります。これにより、最新の動画情報を必要とする強力な自動化シナリオが可能になります。エージェントは指導動画の検索、コンテンツトレンドの調査、教育チャンネルからの情報収集、特定のクリエイターの新しいアップロードの監視などを行うことができます。この統合により、AIワークフローと世界最大の動画リポジトリの間のギャップが埋まり、より高度でコンテンツを意識した自動化が可能になります。SimとYouTubeを接続することで、最新情報を常に把握し、より正確な回答を提供し、ユーザーにより多くの価値を届けるエージェントを作成できます - すべて手動の介入やカスタムコードを必要とせずに実現できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

YouTubeをワークフローに統合します。動画の検索、動画詳細の取得、チャンネル情報の取得、チャンネルからすべての動画の取得、チャンネルプレイリストの取得、プレイリスト項目の取得、関連動画の検索、動画コメントの取得が可能です。

## ツール

### `youtube_search`

YouTube Data APIを使用してYouTubeで動画を検索します。チャンネル、日付範囲、動画の長さ、カテゴリ、品質、字幕などによる高度なフィルタリングをサポートしています。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | YouTube動画の検索クエリ |
| `maxResults` | number | いいえ | 返す動画の最大数（1-50） |
| `apiKey` | string | はい | YouTube APIキー |
| `channelId` | string | いいえ | 特定のYouTubeチャンネルIDに結果をフィルタリング |
| `publishedAfter` | string | いいえ | この日付以降に公開された動画のみを返す（RFC 3339形式："2024-01-01T00:00:00Z"） |
| `publishedBefore` | string | いいえ | この日付以前に公開された動画のみを返す（RFC 3339形式："2024-01-01T00:00:00Z"） |
| `videoDuration` | string | いいえ | 動画の長さでフィルタリング："short"（4分未満）、"medium"（4-20分）、"long"（20分以上）、"any" |
| `order` | string | いいえ | 結果の並べ替え："date"、"rating"、"relevance"（デフォルト）、"title"、"videoCount"、"viewCount" |
| `videoCategoryId` | string | いいえ | YouTubeカテゴリIDでフィルタリング（例："10"は音楽、"20"はゲーム） |
| `videoDefinition` | string | いいえ | 動画品質でフィルタリング："high"（HD）、"standard"、"any" |
| `videoCaption` | string | いいえ | 字幕の有無でフィルタリング："closedCaption"（字幕あり）、"none"（字幕なし）、"any" |
| `regionCode` | string | いいえ | 特定の地域に関連する結果を返す（ISO 3166-1 alpha-2国コード、例："US"、"GB"） |
| `relevanceLanguage` | string | いいえ | 言語に最も関連する結果を返す（ISO 639-1コード、例："en"、"es"） |
| `safeSearch` | string | いいえ | コンテンツフィルタリングレベル："moderate"（デフォルト）、"none"、"strict" |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | array | 検索クエリに一致するYouTube動画の配列 |

### `youtube_video_details`

特定のYouTube動画に関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `videoId` | string | はい | YouTube動画ID |
| `apiKey` | string | はい | YouTube APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `videoId` | string | YouTube動画ID |
| `title` | string | 動画タイトル |
| `description` | string | 動画の説明 |
| `channelId` | string | チャンネルID |
| `channelTitle` | string | チャンネル名 |
| `publishedAt` | string | 公開日時 |
| `duration` | string | ISO 8601形式の動画の長さ |
| `viewCount` | number | 視聴回数 |
| `likeCount` | number | 高評価数 |
| `commentCount` | number | コメント数 |
| `thumbnail` | string | 動画サムネイルURL |
| `tags` | array | 動画タグ |

### `youtube_channel_info`

YouTubeチャンネルに関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | いいえ | YouTubeチャンネルID（channelIdまたはusernameのいずれかを使用） |
| `username` | string | いいえ | YouTubeチャンネルのユーザー名（channelIdまたはusernameのいずれかを使用） |
| `apiKey` | string | はい | YouTube APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `channelId` | string | YouTubeチャンネルID |
| `title` | string | チャンネル名 |
| `description` | string | チャンネルの説明 |
| `subscriberCount` | number | 登録者数 |
| `videoCount` | number | 動画数 |
| `viewCount` | number | チャンネル総再生回数 |
| `publishedAt` | string | チャンネル作成日 |
| `thumbnail` | string | チャンネルサムネイルURL |
| `customUrl` | string | チャンネルカスタムURL |

### `youtube_channel_videos`

特定のYouTubeチャンネルからすべての動画を取得し、並べ替えオプションを提供します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | はい | 動画を取得するYouTubeチャンネルID |
| `maxResults` | number | いいえ | 返す動画の最大数（1-50） |
| `order` | string | いいえ | 並べ替え順：「date」（最新順）、「rating」、「relevance」、「title」、「viewCount」 |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `apiKey` | string | はい | YouTube APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | array | チャンネルからの動画の配列 |

### `youtube_channel_playlists`

特定のYouTubeチャンネルからすべての再生リストを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | はい | 再生リストを取得するYouTubeチャンネルID |
| `maxResults` | number | いいえ | 返す再生リストの最大数（1-50） |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `apiKey` | string | はい | YouTube APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | array | チャンネルからの再生リストの配列 |

### `youtube_playlist_items`

YouTube再生リストから動画を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `playlistId` | string | はい | YouTube再生リストID |
| `maxResults` | number | いいえ | 返す動画の最大数 |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `apiKey` | string | はい | YouTube APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | array | プレイリスト内の動画の配列 |

### `youtube_comments`

YouTube動画からコメントを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `videoId` | string | はい | YouTube動画ID |
| `maxResults` | number | いいえ | 返すコメントの最大数 |
| `order` | string | いいえ | コメントの並び順：time（時間順）またはrelevance（関連性順） |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `apiKey` | string | はい | YouTube APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | array | 動画からのコメントの配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `youtube`
```

--------------------------------------------------------------------------------

````

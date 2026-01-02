---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 198
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 198 of 933)

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

---[FILE: discord.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/discord.mdx

```text
---
title: Discord
description: Discordとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="discord"
  color="#5865F2"
/>

{/* MANUAL-CONTENT-START:intro */}
[Discord](https://discord.com)は、友人、コミュニティ、チームとつながることができる強力なコミュニケーションプラットフォームです。テキストチャンネル、ボイスチャンネル、ビデオ通話など、チームコラボレーションのための様々な機能を提供しています。

Discordアカウントまたはボットを使用すると、以下のことができます：

- **メッセージの送信**: 特定のチャンネルにメッセージを送信する
- **メッセージの取得**: 特定のチャンネルからメッセージを取得する
- **サーバーの取得**: 特定のサーバーに関する情報を取得する
- **ユーザーの取得**: 特定のユーザーに関する情報を取得する

Simでは、Discord連携によりエージェントが組織のDiscordサーバーにアクセスして活用することができます。エージェントはDiscordチャンネルから情報を取得したり、特定のユーザーを検索したり、サーバー情報を取得したり、メッセージを送信したりすることができます。これにより、ワークフローをDiscordコミュニティと統合し、通知を自動化し、インタラクティブな体験を作成することができます。

> **重要:** メッセージの内容を読むには、DiscordボットがDiscord開発者ポータルで「メッセージコンテンツインテント」を有効にする必要があります。この権限がないと、メッセージのメタデータは受信できますが、コンテンツフィールドは空になります。

SimのDiscordコンポーネントは効率的な遅延読み込みを使用し、必要な時だけデータを取得することでAPI呼び出しを最小限に抑え、レート制限を防ぎます。トークンの更新はバックグラウンドで自動的に行われ、接続を維持します。

### Discordボットの設定

1. [Discord開発者ポータル](https://discord.com/developers/applications)にアクセスします
2. 新しいアプリケーションを作成し、「Bot」タブに移動します
3. ボットを作成し、ボットトークンをコピーします
4. 「特権ゲートウェイインテント」で、メッセージ内容を読み取るための**メッセージコンテンツインテント**を有効にします
5. 適切な権限でボットをサーバーに招待します
{/* MANUAL-CONTENT-END */}

## 使用方法

包括的なDiscord統合：メッセージ、スレッド、チャンネル、ロール、メンバー、招待、ウェブフック。

## ツール

### `discord_send_message`

Discordチャンネルにメッセージを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを送信するDiscordチャンネルID |
| `content` | string | いいえ | メッセージのテキスト内容 |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `files` | file[] | いいえ | メッセージに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | Discordメッセージデータ |

### `discord_get_messages`

Discordチャンネルからメッセージを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを取得するDiscordチャンネルID |
| `limit` | number | いいえ | 取得するメッセージの最大数（デフォルト：10、最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | メッセージデータのコンテナ |

### `discord_get_server`

Discordサーバー（ギルド）に関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | Discordサーバー（ギルド）情報 |

### `discord_get_user`

Discordユーザーに関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のDiscordボットトークン |
| `userId` | string | はい | DiscordユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | Discordユーザー情報 |

### `discord_edit_message`

Discordチャンネルの既存メッセージを編集する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを含むDiscordチャンネルID |
| `messageId` | string | はい | 編集するメッセージのID |
| `content` | string | いいえ | メッセージの新しいテキスト内容 |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 更新されたDiscordメッセージデータ |

### `discord_delete_message`

Discordチャンネルからメッセージを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを含むDiscordチャンネルID |
| `messageId` | string | はい | 削除するメッセージのID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_add_reaction`

Discordメッセージにリアクション絵文字を追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを含むDiscordチャンネルID |
| `messageId` | string | はい | リアクションを付けるメッセージのID |
| `emoji` | string | はい | リアクションする絵文字（Unicode絵文字またはname:id形式のカスタム絵文字） |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_remove_reaction`

Discordメッセージからリアクションを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを含むDiscordチャンネルID |
| `messageId` | string | はい | リアクションがあるメッセージのID |
| `emoji` | string | はい | 削除する絵文字（Unicode絵文字またはname:id形式のカスタム絵文字） |
| `userId` | string | いいえ | リアクションを削除するユーザーのID（省略するとボット自身のリアクションを削除） |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_pin_message`

Discordチャンネルでメッセージをピン留めする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを含むDiscordチャンネルID |
| `messageId` | string | はい | ピン留めするメッセージのID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_unpin_message`

Discordチャンネルでメッセージのピン留めを解除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | メッセージを含むDiscordチャンネルID |
| `messageId` | string | はい | ピン留めを解除するメッセージのID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_create_thread`

Discordチャンネルでスレッドを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | スレッドを作成するDiscordチャンネルID |
| `name` | string | はい | スレッドの名前（1〜100文字） |
| `messageId` | string | いいえ | スレッドを作成する元のメッセージID（既存のメッセージからスレッドを作成する場合） |
| `autoArchiveDuration` | number | いいえ | スレッドを自動アーカイブする時間（分）（60、1440、4320、10080） |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 作成されたスレッドデータ |

### `discord_join_thread`

Discordのスレッドに参加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `threadId` | string | はい | 参加するスレッドID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_leave_thread`

Discordのスレッドから退出する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `threadId` | string | はい | 退出するスレッドID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_archive_thread`

Discordのスレッドをアーカイブまたはアーカイブ解除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `threadId` | string | はい | アーカイブ/アーカイブ解除するスレッドID |
| `archived` | boolean | はい | スレッドをアーカイブする（true）またはアーカイブ解除する（false） |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 更新されたスレッドデータ |

### `discord_create_channel`

Discordサーバーに新しいチャンネルを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `name` | string | はい | チャンネル名（1〜100文字） |
| `type` | number | いいえ | チャンネルタイプ（0=テキスト、2=ボイス、4=カテゴリ、5=アナウンス、13=ステージ） |
| `topic` | string | いいえ | チャンネルトピック（0〜1024文字） |
| `parentId` | string | いいえ | チャンネルの親カテゴリID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 作成されたチャンネルデータ |

### `discord_update_channel`

Discordチャンネルを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | 更新するDiscordチャンネルID |
| `name` | string | いいえ | チャンネルの新しい名前 |
| `topic` | string | いいえ | チャンネルの新しいトピック |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 更新されたチャンネルデータ |

### `discord_delete_channel`

Discordチャンネルを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | 削除するDiscordチャンネルID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_get_channel`

Discordチャンネルに関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | 取得するDiscordチャンネルID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | チャンネルデータ |

### `discord_create_role`

Discordサーバーに新しいロールを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `name` | string | はい | ロールの名前 |
| `color` | number | いいえ | RGB色の整数値（例：赤色の場合は0xFF0000） |
| `hoist` | boolean | いいえ | ロールメンバーをオンラインメンバーとは別に表示するかどうか |
| `mentionable` | boolean | いいえ | ロールがメンション可能かどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 作成されたロールデータ |

### `discord_update_role`

Discordサーバーのロールを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `roleId` | string | はい | 更新するロールID |
| `name` | string | いいえ | ロールの新しい名前 |
| `color` | number | いいえ | 整数としてのRGB色値 |
| `hoist` | boolean | いいえ | ロールメンバーを個別に表示するかどうか |
| `mentionable` | boolean | いいえ | ロールがメンション可能かどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 更新されたロールデータ |

### `discord_delete_role`

Discordサーバーからロールを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `roleId` | string | はい | 削除するロールID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_assign_role`

Discordサーバーのメンバーにロールを割り当てる

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | ロールを割り当てるユーザーID |
| `roleId` | string | はい | 割り当てるロールID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_remove_role`

Discordサーバーのメンバーからロールを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | ロールを削除するユーザーID |
| `roleId` | string | はい | 削除するロールID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_kick_member`

Discordサーバーからメンバーをキックする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | キックするユーザーID |
| `reason` | string | いいえ | メンバーをキックする理由 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_ban_member`

Discordサーバーからメンバーをバンする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | バンするユーザーID |
| `reason` | string | いいえ | メンバーをバンする理由 |
| `deleteMessageDays` | number | いいえ | メッセージを削除する日数（0-7） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_unban_member`

Discordサーバーからメンバーのバンを解除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | バンを解除するユーザーID |
| `reason` | string | いいえ | メンバーのバンを解除する理由 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_get_member`

Discordサーバーのメンバーに関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | 取得するユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | メンバーデータ |

### `discord_update_member`

Discordサーバーのメンバーを更新する（例：ニックネームの変更）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |
| `userId` | string | はい | 更新するユーザーID |
| `nick` | string | いいえ | メンバーの新しいニックネーム（削除する場合はnull） |
| `mute` | boolean | いいえ | ボイスチャンネルでメンバーをミュートするかどうか |
| `deaf` | boolean | いいえ | ボイスチャンネルでメンバーをスピーカーミュート（聴取禁止）するかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 更新されたメンバーデータ |

### `discord_create_invite`

Discordチャンネルの招待リンクを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | 招待を作成するDiscordチャンネルID |
| `maxAge` | number | いいえ | 招待の有効期間（秒）（0 = 無期限、デフォルト86400） |
| `maxUses` | number | いいえ | 最大使用回数（0 = 無制限、デフォルト0） |
| `temporary` | boolean | いいえ | 一時的なメンバーシップを付与するかどうか |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 作成された招待データ |

### `discord_get_invite`

Discord招待に関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `inviteCode` | string | はい | 取得する招待コード |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 招待データ |

### `discord_delete_invite`

Discord招待を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `inviteCode` | string | はい | 削除する招待コード |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

### `discord_create_webhook`

Discordチャンネルにウェブフックを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `channelId` | string | はい | ウェブフックを作成するDiscordチャンネルID |
| `name` | string | はい | ウェブフックの名前（1〜80文字） |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 作成されたウェブフックデータ |

### `discord_execute_webhook`

メッセージを送信するためにDiscordウェブフックを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `webhookId` | string | はい | ウェブフックID |
| `webhookToken` | string | はい | ウェブフックトークン |
| `content` | string | はい | 送信するメッセージ内容 |
| `username` | string | いいえ | ウェブフックのデフォルトユーザー名を上書きする |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | ウェブフックを通じて送信されたメッセージ |

### `discord_get_webhook`

Discordウェブフックに関する情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `webhookId` | string | はい | 取得するウェブフックID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | ウェブフックデータ |

### `discord_delete_webhook`

Discordウェブフックを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | 認証用のボットトークン |
| `webhookId` | string | はい | 削除するウェブフックID |
| `serverId` | string | はい | DiscordサーバーID（ギルドID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `discord`
```

--------------------------------------------------------------------------------

---[FILE: dropbox.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/dropbox.mdx

```text
---
title: Dropbox
description: Dropboxでファイルのアップロード、ダウンロード、共有、管理を行う
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dropbox"
  color="#0061FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Dropbox](https://dropbox.com/)は、個人やチームがどこからでも安全にファイルを保存、アクセス、共有できる人気のクラウドストレージおよびコラボレーションプラットフォームです。Dropboxは、一人で作業する場合でもグループで作業する場合でも、簡単なファイル管理、同期、強力なコラボレーションのために設計されています。

SimでDropboxを使用すると、次のことができます：

- **ファイルのアップロードとダウンロード**：あらゆるファイルをDropboxにシームレスにアップロードしたり、必要に応じてコンテンツを取得したりできます
- **フォルダの内容を一覧表示**：任意のDropboxディレクトリ内のファイルとフォルダを閲覧できます
- **新しいフォルダの作成**：プログラムでDropbox内に新しいフォルダを作成してファイルを整理できます
- **ファイルとフォルダの検索**：名前やコンテンツでドキュメント、画像、その他のアイテムを検索できます
- **共有リンクの生成**：ファイルやフォルダの公開または非公開の共有リンクを素早く作成できます
- **ファイルの管理**：自動化されたワークフローの一部としてファイルやフォルダの移動、削除、名前の変更ができます

これらの機能により、Simエージェントは重要なファイルのバックアップからコンテンツの配布、整理されたフォルダの維持まで、ワークフロー内で直接Dropbox操作を自動化できます。Dropboxをファイルのソースと保存先の両方として使用することで、ビジネスプロセスの一部としてシームレスなクラウドストレージ管理が可能になります。
{/* MANUAL-CONTENT-END */}

## 使用方法

ファイル管理、共有、コラボレーションのためにDropboxをワークフローに統合します。ファイルのアップロード、コンテンツのダウンロード、フォルダの作成、共有リンクの管理などが可能です。

## ツール

### `dropbox_upload`

Dropboxにファイルをアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | ファイルを保存するDropbox内のパス（例：/folder/document.pdf） |
| `fileContent` | string | はい | アップロードするファイルのbase64エンコードされたコンテンツ |
| `fileName` | string | いいえ | オプションのファイル名（パスがフォルダの場合に使用） |
| `mode` | string | いいえ | 書き込みモード：add（デフォルト）またはoverwrite |
| `autorename` | boolean | いいえ | trueの場合、競合がある場合にファイル名を変更します |
| `mute` | boolean | いいえ | trueの場合、このアップロードについてユーザーに通知しません |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | object | アップロードされたファイルのメタデータ |

### `dropbox_download`

Dropboxからファイルをダウンロードして一時リンクを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | ダウンロードするファイルのパス（例：/folder/document.pdf） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | object | ファイルのメタデータ |

### `dropbox_list_folder`

Dropbox内のフォルダの内容を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | 一覧表示するフォルダのパス（ルートの場合は""を使用） |
| `recursive` | boolean | いいえ | trueの場合、内容を再帰的に一覧表示 |
| `includeDeleted` | boolean | いいえ | trueの場合、削除されたファイル/フォルダを含める |
| `includeMediaInfo` | boolean | いいえ | trueの場合、写真/動画のメディア情報を含める |
| `limit` | number | いいえ | 返す結果の最大数（デフォルト：500） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `entries` | array | ディレクトリ内のファイルとフォルダのリスト |

### `dropbox_create_folder`

Dropboxに新しいフォルダを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | フォルダを作成する場所のパス（例：/new-folder） |
| `autorename` | boolean | いいえ | trueの場合、競合があればフォルダの名前を変更する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `folder` | object | 作成されたフォルダのメタデータ |

### `dropbox_delete`

Dropbox内のファイルまたはフォルダを削除する（ゴミ箱に移動）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | 削除するファイルまたはフォルダのパス |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `metadata` | object | 削除されたアイテムのメタデータ |

### `dropbox_copy`

Dropbox内のファイルまたはフォルダをコピーする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | はい | コピーするファイルまたはフォルダのソースパス |
| `toPath` | string | はい | コピーされたファイルまたはフォルダの宛先パス |
| `autorename` | boolean | いいえ | trueの場合、宛先で競合があればファイル名を変更する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `metadata` | object | コピーされたアイテムのメタデータ |

### `dropbox_move`

Dropbox内のファイルまたはフォルダを移動または名前変更する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fromPath` | string | はい | 移動するファイルまたはフォルダのソースパス |
| `toPath` | string | はい | 移動されたファイルまたはフォルダの宛先パス |
| `autorename` | boolean | いいえ | trueの場合、宛先で競合があればファイル名を変更する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `metadata` | object | 移動したアイテムのメタデータ |

### `dropbox_get_metadata`

Dropbox内のファイルまたはフォルダのメタデータを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | メタデータを取得するファイルまたはフォルダのパス |
| `includeMediaInfo` | boolean | いいえ | trueの場合、写真/動画のメディア情報を含める |
| `includeDeleted` | boolean | いいえ | trueの場合、結果に削除されたファイルを含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `metadata` | object | ファイルまたはフォルダのメタデータ |

### `dropbox_create_shared_link`

Dropbox内のファイルまたはフォルダの共有可能なリンクを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `path` | string | はい | 共有するファイルまたはフォルダのパス |
| `requestedVisibility` | string | いいえ | 可視性：public、team_only、またはpassword |
| `linkPassword` | string | いいえ | 共有リンクのパスワード（可視性がpasswordの場合のみ） |
| `expires` | string | いいえ | ISO 8601形式の有効期限（例：2025-12-31T23:59:59Z） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `sharedLink` | object | 作成された共有リンク |

### `dropbox_search`

Dropbox内のファイルとフォルダを検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリ |
| `path` | string | いいえ | 特定のフォルダパスに検索を制限 |
| `fileExtensions` | string | いいえ | フィルタリングするファイル拡張子のカンマ区切りリスト（例：pdf,xlsx） |
| `maxResults` | number | いいえ | 返す結果の最大数（デフォルト：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `matches` | array | 検索結果 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `dropbox`
```

--------------------------------------------------------------------------------

---[FILE: duckduckgo.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/duckduckgo.mdx

```text
---
title: DuckDuckGo
description: DuckDuckGoで検索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="duckduckgo"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DuckDuckGo](https://duckduckgo.com/)は、プライバシーを重視したウェブ検索エンジンで、あなたやあなたの検索を追跡することなく、即時の回答、要約、関連トピックなどを提供します。DuckDuckGoを使えば、ユーザープロファイリングやターゲット広告なしで簡単に情報を見つけることができます。

SimでDuckDuckGoを使用すると、以下のことができます：

- **ウェブ検索**: 特定の検索クエリに対して、回答、事実、概要を即座に見つける
- **直接的な回答を取得**: 計算、変換、事実に関するクエリに対して特定の回答を取得
- **要約にアクセス**: 検索トピックに関する短い要約や説明を受け取る
- **関連トピックを取得**: 検索に関連するリンクや参考情報を発見
- **出力をフィルタリング**: オプションでHTMLを削除したり、より明確な結果を得るために曖昧さ回避をスキップしたりする

これらの機能により、Simエージェントは最新のウェブ知識への自動アクセスを可能にします — ワークフローでの事実の表示から、最新情報によるドキュメントや分析の強化まで。DuckDuckGoのインスタントアンサーAPIはオープンでAPIキーを必要としないため、自動化されたビジネスプロセスにプライバシーを保ちながら簡単に統合できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

DuckDuckGoインスタントアンサーAPIを使用してウェブを検索します。インスタントアンサー、要約、関連トピックなどを返します。APIキーなしで無料で使用できます。

## ツール

### `duckduckgo_search`

DuckDuckGoインスタントアンサーAPIを使用してウェブを検索します。クエリに対するインスタントアンサー、要約、関連トピックを返します。APIキーなしで無料で使用できます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 実行する検索クエリ |
| `noHtml` | boolean | いいえ | 結果のテキストからHTMLを削除する（デフォルト: true） |
| `skipDisambig` | boolean | いいえ | 曖昧さ回避の結果をスキップする（デフォルト: false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `heading` | string | インスタントアンサーの見出し/タイトル |
| `abstract` | string | トピックの短い要約 |
| `abstractText` | string | 要約のプレーンテキストバージョン |
| `abstractSource` | string | 要約の情報源（例：Wikipedia） |
| `abstractURL` | string | 要約の情報源へのURL |
| `image` | string | トピックに関連する画像へのURL |
| `answer` | string | 利用可能な場合は直接的な回答（例：計算の場合） |
| `answerType` | string | 回答のタイプ（例：calc、ipなど） |
| `type` | string | レスポンスタイプ：A（記事）、D（曖昧さ回避）、C（カテゴリ）、N（名前）、E（排他的） |
| `relatedTopics` | array | URLと説明を含む関連トピックの配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `duckduckgo`
```

--------------------------------------------------------------------------------

---[FILE: dynamodb.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/dynamodb.mdx

```text
---
title: Amazon DynamoDB
description: Amazon DynamoDBに接続する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="dynamodb"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon DynamoDB](https://aws.amazon.com/dynamodb/)はAWSが提供する完全マネージド型のNoSQLデータベースサービスで、シームレスなスケーラビリティを備えた高速で予測可能なパフォーマンスを提供します。DynamoDBを使用すると、ハードウェアやインフラストラクチャを管理する必要なく、任意の量のデータを保存および取得し、あらゆるレベルのリクエストトラフィックに対応できます。

DynamoDBでは、以下のことが可能です：

- **アイテムの取得**：プライマリキーを使用してテーブル内のアイテムを検索
- **アイテムの配置**：テーブルにアイテムを追加または置換
- **アイテムのクエリ**：インデックス全体でクエリを使用して複数のアイテムを取得
- **テーブルのスキャン**：テーブル内のデータの全部または一部を読み取り
- **アイテムの更新**：既存のアイテムの特定の属性を変更
- **アイテムの削除**：テーブルからレコードを削除

Simでは、DynamoDB統合により、エージェントがAWS認証情報を使用してDynamoDBテーブルに安全にアクセスし操作することができます。サポートされている操作には以下が含まれます：

- **Get**：キーによるアイテムの取得
- **Put**：アイテムの挿入または上書き
- **Query**：キー条件とフィルターを使用したクエリの実行
- **Scan**：テーブルまたはインデックスをスキャンして複数のアイテムを読み取り
- **Update**：1つ以上のアイテムの特定の属性を変更
- **Delete**：テーブルからアイテムを削除

この統合により、SimエージェントはプログラムによってDynamoDBテーブル内のデータ管理タスクを自動化できるようになり、手動の作業やサーバー管理なしでスケーラブルなNoSQLデータを管理、変更、取得するワークフローを構築できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Amazon DynamoDBをワークフローに統合します。DynamoDBテーブルに対するGet、Put、Query、Scan、Update、Delete操作をサポートしています。

## ツール

### `dynamodb_get`

プライマリキーを使用してDynamoDBテーブルからアイテムを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `tableName` | string | はい | DynamoDBテーブル名 |
| `key` | object | はい | 取得するアイテムのプライマリキー |
| `consistentRead` | boolean | いいえ | 強力な整合性のある読み取りを使用する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `item` | object | 取得したアイテム |

### `dynamodb_put`

DynamoDBテーブルにアイテムを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `tableName` | string | はい | DynamoDBテーブル名 |
| `item` | object | はい | テーブルに追加するアイテム |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `item` | object | 作成されたアイテム |

### `dynamodb_query`

キー条件を使用してDynamoDBテーブルからアイテムをクエリする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `tableName` | string | はい | DynamoDBテーブル名 |
| `keyConditionExpression` | string | はい | キー条件式（例："pk = :pk"） |
| `filterExpression` | string | いいえ | 結果のフィルター式 |
| `expressionAttributeNames` | object | いいえ | 予約語の属性名マッピング |
| `expressionAttributeValues` | object | いいえ | 式の属性値 |
| `indexName` | string | いいえ | クエリするセカンダリインデックス名 |
| `limit` | number | いいえ | 返すアイテムの最大数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `items` | array | 返されたアイテムの配列 |
| `count` | number | 返されたアイテムの数 |

### `dynamodb_scan`

DynamoDBテーブル内のすべてのアイテムをスキャンする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `tableName` | string | はい | DynamoDBテーブル名 |
| `filterExpression` | string | いいえ | 結果のフィルター式 |
| `projectionExpression` | string | いいえ | 取得する属性 |
| `expressionAttributeNames` | object | いいえ | 予約語の属性名マッピング |
| `expressionAttributeValues` | object | いいえ | 式の属性値 |
| `limit` | number | いいえ | 返すアイテムの最大数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `items` | array | 返されたアイテムの配列 |
| `count` | number | 返されたアイテム数 |

### `dynamodb_update`

DynamoDBテーブル内のアイテムを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `tableName` | string | はい | DynamoDBテーブル名 |
| `key` | object | はい | 更新するアイテムのプライマリキー |
| `updateExpression` | string | はい | 更新式（例："SET #name = :name"） |
| `expressionAttributeNames` | object | いいえ | 予約語の属性名マッピング |
| `expressionAttributeValues` | object | いいえ | 式の属性値 |
| `conditionExpression` | string | いいえ | 更新が成功するために満たす必要がある条件 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `item` | object | 更新されたアイテム |

### `dynamodb_delete`

DynamoDBテーブルからアイテムを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `tableName` | string | はい | DynamoDBテーブル名 |
| `key` | object | はい | 削除するアイテムのプライマリキー |
| `conditionExpression` | string | いいえ | 削除が成功するために満たす必要がある条件 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `dynamodb`
```

--------------------------------------------------------------------------------

````

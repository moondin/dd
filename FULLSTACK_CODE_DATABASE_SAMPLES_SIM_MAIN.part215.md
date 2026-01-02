---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 215
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 215 of 933)

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

---[FILE: ssh.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/ssh.mdx

```text
---
title: SSH
description: SSHを介してリモートサーバーに接続する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ssh"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[SSH（Secure Shell）](https://en.wikipedia.org/wiki/Secure_Shell)は、リモートサーバーに安全に接続するための広く使用されているプロトコルで、暗号化されたチャネルを通じてコマンドの実行、ファイル転送、システム管理を行うことができます。

SimのSSHサポートにより、エージェントは以下のことが可能になります：

- **リモートコマンドの実行**: SSHでアクセス可能な任意のサーバーでシェルコマンドを実行
- **スクリプトのアップロードと実行**: 高度な自動化のための複数行スクリプトを簡単に転送して実行
- **ファイルの安全な転送**: ワークフローの一部としてファイルのアップロードとダウンロード（近日公開予定またはコマンド経由）
- **サーバー管理の自動化**: 更新、メンテナンス、監視、デプロイメント、設定タスクをプログラムで実行
- **柔軟な認証の使用**: パスワードまたは秘密鍵認証で接続、暗号化された鍵のサポートを含む

以下のSim SSHツールにより、エージェントはより大きな自動化の一部としてサーバーと対話することができます：

- `ssh_execute_command`: 任意の単一シェルコマンドをリモートで実行し、出力、ステータス、エラーを取得します。
- `ssh_execute_script`: 完全な複数行スクリプトをリモートシステムにアップロードして実行します。
-（ファイル転送などの追加ツールが近日公開予定）

SSHをエージェントワークフローに統合することで、安全なアクセス、リモート操作、サーバーオーケストレーションを自動化し、DevOps、IT自動化、カスタムリモート管理をすべてSim内からスムーズに行うことができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

SSHを介してコマンドの実行、ファイル転送、リモートサーバーの管理を行います。安全なサーバーアクセスのためのパスワードと秘密鍵認証をサポートしています。

## ツール

### `ssh_execute_command`

リモートSSHサーバーでシェルコマンドを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `command` | string | はい | リモートサーバーで実行するシェルコマンド |
| `workingDirectory` | string | いいえ | コマンド実行のための作業ディレクトリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `stdout` | string | コマンドからの標準出力 |
| `stderr` | string | 標準エラー出力 |
| `exitCode` | number | コマンド終了コード |
| `success` | boolean | コマンドが成功したかどうか（終了コード0） |
| `message` | string | 操作ステータスメッセージ |

### `ssh_execute_script`

リモートSSHサーバーに複数行スクリプトをアップロードして実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `script` | string | はい | 実行するスクリプト内容（bash、pythonなど） |
| `interpreter` | string | いいえ | スクリプトインタープリター（デフォルト：/bin/bash） |
| `workingDirectory` | string | いいえ | スクリプト実行用作業ディレクトリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `stdout` | string | スクリプトからの標準出力 |
| `stderr` | string | 標準エラー出力 |
| `exitCode` | number | スクリプト終了コード |
| `success` | boolean | スクリプトが成功したかどうか（終了コード0） |
| `scriptPath` | string | スクリプトがアップロードされた一時パス |
| `message` | string | 操作ステータスメッセージ |

### `ssh_check_command_exists`

リモートSSHサーバー上でコマンド/プログラムが存在するかを確認する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `commandName` | string | はい | 確認するコマンド名（例：docker、git、python3） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `commandExists` | boolean | コマンドが存在するかどうか |
| `commandPath` | string | コマンドへのフルパス（見つかった場合） |
| `version` | string | コマンドのバージョン出力（該当する場合） |
| `message` | string | 操作ステータスメッセージ |

### `ssh_upload_file`

リモートSSHサーバーにファイルをアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `fileContent` | string | はい | アップロードするファイルの内容（バイナリファイルの場合はbase64エンコード） |
| `fileName` | string | はい | アップロードするファイルの名前 |
| `remotePath` | string | はい | リモートサーバー上の保存先パス |
| `permissions` | string | いいえ | ファイルのパーミッション（例：0644） |
| `overwrite` | boolean | いいえ | 既存のファイルを上書きするかどうか（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `uploaded` | boolean | ファイルが正常にアップロードされたかどうか |
| `remotePath` | string | リモートサーバー上の最終パス |
| `size` | number | ファイルサイズ（バイト単位） |
| `message` | string | 操作ステータスメッセージ |

### `ssh_download_file`

リモートSSHサーバーからファイルをダウンロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `remotePath` | string | はい | リモートサーバー上のファイルパス |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `downloaded` | boolean | ファイルが正常にダウンロードされたかどうか |
| `fileContent` | string | ファイルコンテンツ（バイナリファイルの場合はbase64エンコード） |
| `fileName` | string | ダウンロードしたファイルの名前 |
| `remotePath` | string | リモートサーバー上のソースパス |
| `size` | number | ファイルサイズ（バイト単位） |
| `message` | string | 操作ステータスメッセージ |

### `ssh_list_directory`

リモートディレクトリ内のファイルとディレクトリを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `path` | string | はい | 一覧表示するリモートディレクトリのパス |
| `detailed` | boolean | いいえ | ファイルの詳細を含める（サイズ、権限、更新日） |
| `recursive` | boolean | いいえ | サブディレクトリを再帰的に一覧表示する（デフォルト：false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `entries` | array | ファイルとディレクトリエントリの配列 |

### `ssh_check_file_exists`

リモートSSHサーバー上にファイルまたはディレクトリが存在するかを確認する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `path` | string | はい | 確認するリモートファイルまたはディレクトリのパス |
| `type` | string | いいえ | 期待されるタイプ：file、directory、またはany（デフォルト：any） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `exists` | boolean | パスが存在するかどうか |
| `type` | string | パスの種類（ファイル、ディレクトリ、シンボリックリンク、見つからない） |
| `size` | number | ファイルの場合のファイルサイズ |
| `permissions` | string | ファイルのパーミッション（例：0755） |
| `modified` | string | 最終更新タイムスタンプ |
| `message` | string | 操作ステータスメッセージ |

### `ssh_create_directory`

リモートSSHサーバーにディレクトリを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `path` | string | はい | 作成するディレクトリパス |
| `recursive` | boolean | いいえ | 親ディレクトリが存在しない場合に作成する（デフォルト：true） |
| `permissions` | string | いいえ | ディレクトリのパーミッション（デフォルト：0755） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `created` | boolean | ディレクトリが正常に作成されたかどうか |
| `remotePath` | string | 作成されたディレクトリパス |
| `alreadyExists` | boolean | ディレクトリがすでに存在していたかどうか |
| `message` | string | 操作ステータスメッセージ |

### `ssh_delete_file`

リモートSSHサーバーからファイルまたはディレクトリを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `path` | string | はい | 削除するパス |
| `recursive` | boolean | いいえ | ディレクトリを再帰的に削除する（デフォルト：false） |
| `force` | boolean | いいえ | 確認なしで強制削除する（デフォルト：false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | パスが正常に削除されたかどうか |
| `remotePath` | string | 削除されたパス |
| `message` | string | 操作のステータスメッセージ |

### `ssh_move_rename`

リモートSSHサーバー上のファイルまたはディレクトリを移動または名前変更する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `sourcePath` | string | はい | ファイルまたはディレクトリの現在のパス |
| `destinationPath` | string | はい | ファイルまたはディレクトリの新しいパス |
| `overwrite` | boolean | いいえ | 宛先が存在する場合に上書きする（デフォルト：false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `moved` | boolean | 操作が成功したかどうか |
| `sourcePath` | string | 元のパス |
| `destinationPath` | string | 新しいパス |
| `message` | string | 操作のステータスメッセージ |

### `ssh_get_system_info`

リモートSSHサーバーからシステム情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `hostname` | string | サーバーのホスト名 |
| `os` | string | オペレーティングシステム（例：Linux、Darwin） |
| `architecture` | string | CPUアーキテクチャ（例：x64、arm64） |
| `uptime` | number | システムの稼働時間（秒） |
| `memory` | json | メモリ情報（合計、空き、使用中） |
| `diskSpace` | json | ディスク容量情報（合計、空き、使用中） |
| `message` | string | 操作のステータスメッセージ |

### `ssh_read_file_content`

リモートファイルの内容を読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `path` | string | はい | 読み取るリモートファイルのパス |
| `encoding` | string | いいえ | ファイルエンコーディング（デフォルト：utf-8） |
| `maxSize` | number | いいえ | 読み取る最大ファイルサイズ（MB単位、デフォルト：10） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 文字列としてのファイル内容 |
| `size` | number | バイト単位のファイルサイズ |
| `lines` | number | ファイル内の行数 |
| `remotePath` | string | リモートファイルパス |
| `message` | string | 操作ステータスメッセージ |

### `ssh_write_file_content`

リモートファイルに内容を書き込むまたは追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SSHサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SSHサーバーのポート（デフォルト：22） |
| `username` | string | はい | SSHユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `path` | string | はい | 書き込み先のリモートファイルパス |
| `content` | string | はい | ファイルに書き込む内容 |
| `mode` | string | いいえ | 書き込みモード：上書き、追加、または作成（デフォルト：上書き） |
| `permissions` | string | いいえ | ファイルのパーミッション（例：0644） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `written` | boolean | ファイルが正常に書き込まれたかどうか |
| `remotePath` | string | ファイルパス |
| `size` | number | 最終的なファイルサイズ（バイト単位） |
| `message` | string | 操作ステータスメッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `ssh`
```

--------------------------------------------------------------------------------

---[FILE: stagehand.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/stagehand.mdx

```text
---
title: Stagehand
description: Webの自動化とデータ抽出
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stagehand"
  color="#FFC83C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Stagehand](https://stagehand.com)は、BrowserbaseとモダンなLLM（OpenAIまたはAnthropic）を使用して、Webページからの構造化データの抽出と自律的なWeb自動化の両方を可能にするツールです。

StagehandはSimで2つの主要な機能を提供します：

- **stagehand_extract**: 単一のWebページから構造化データを抽出します。必要なもの（スキーマ）を指定すると、AIがページからその形式でデータを取得して解析します。これは、必要な情報とその取得場所を正確に把握している場合に、リスト、フィールド、またはオブジェクトを抽出するのに最適です。

- **stagehand_agent**: 複数ステップのタスクを完了し、要素と対話し、ページ間を移動し、構造化された結果を返すことができる自律型Webエージェントを実行します。これははるかに柔軟で、エージェントはログイン、検索、フォーム入力、複数の場所からのデータ収集、要求されたスキーマに従った最終結果の出力などを行うことができます。

**主な違い：**

- *stagehand_extract*は迅速な“このページからこのデータを抽出する”操作です。直接的な一段階の抽出タスクに最適です。
- *stagehand_agent*はWeb上で複雑な複数ステップの自律的なタスク（ナビゲーション、検索、さらには取引など）を実行し、指示とオプションのスキーマに従って動的にデータを抽出できます。

実際には、何が欲しいのかとその場所を知っている場合は**stagehand_extract**を使用し、インタラクティブなワークフローを考え実行するボットが必要な場合は**stagehand_agent**を使用します。

Stagehandを統合することで、Simエージェントはデータ収集、分析、Web上でのワークフロー実行を自動化できます：データベースの更新、情報の整理、カスタムレポートの生成を、シームレスかつ自律的に行います。
{/* MANUAL-CONTENT-END */}

## 使用方法

Stagehandをワークフローに統合します。ウェブページから構造化データを抽出したり、タスクを実行する自律型エージェントを実行したりできます。

## ツール

### `stagehand_extract`

Stagehandを使用してウェブページから構造化データを抽出する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | データを抽出するウェブページのURL |
| `instruction` | string | はい | 抽出のための指示 |
| `provider` | string | いいえ | 使用するAIプロバイダー：openaiまたはanthropic |
| `apiKey` | string | はい | 選択したプロバイダーのAPIキー |
| `schema` | json | はい | 抽出するデータの構造を定義するJSONスキーマ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | object | 提供されたスキーマに一致する抽出された構造化データ |

### `stagehand_agent`

タスクを完了し構造化データを抽出するための自律型ウェブエージェントを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `startUrl` | string | はい | エージェントを開始するウェブページのURL |
| `task` | string | はい | ウェブサイトで完了するタスクまたは達成する目標 |
| `variables` | json | いいえ | タスクで置き換えるオプションの変数（形式：\{key: value\}）。タスク内で%key%を使用して参照 |
| `format` | string | いいえ | 説明なし |
| `provider` | string | いいえ | 使用するAIプロバイダー：openaiまたはanthropic |
| `apiKey` | string | はい | 選択したプロバイダーのAPIキー |
| `outputSchema` | json | いいえ | エージェントが返すべきデータの構造を定義するオプションのJSONスキーマ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `agentResult` | object | Stagehandエージェント実行からの結果 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `stagehand`
```

--------------------------------------------------------------------------------

---[FILE: stripe.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/stripe.mdx

```text
---
title: Stripe
description: 決済処理とStripeデータの管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stripe"
  color="#635BFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Stripe](https://stripe.com/)は、支払い、顧客、サブスクリプション、請求書、商品などを簡単に管理できる強力な決済プラットフォームです。

StripeをSimに統合することで、エージェントは以下のことができます：

- **決済インテントの作成と管理**: 柔軟な設定オプションで支払いを処理。
- **顧客との連携**: ビジネスのための顧客記録の作成、取得、更新。
- **サブスクリプションの処理**: 定期請求とサブスクリプションのライフサイクル管理。
- **請求書の作成と送信**: 一回限りまたは定期的な支払いのための請求書生成。
- **課金の追跡と管理**: 支払いを監視するための課金オブジェクトの取得と更新。
- **商品と価格の設定**: 商品カタログ、価格モデル、オファーの設定。
- **Stripeイベントの監視と対応**: 支払い更新、成功した課金、その他のStripeイベントに対応するワークフローのトリガー。

SimとStripeを接続することで、エージェントワークフロー内でのシームレスな自動化と財務オペレーションが可能になります。顧客のオンボーディング、サブスクリプション管理、支払い回収、請求書生成、さらには支払いイベント発生時のカスタムアクションなど、すべてをエージェントが直接Stripeを通じて安全に処理します。

eコマース自動化、サブスクリプションサービスの構築、レポーティングや照合の実行など、Stripeツールを使えば、インテリジェントなSimワークフロー内で支払いと財務データの連携が簡単に行えます。
{/* MANUAL-CONTENT-END */}

## 使用方法

ワークフローにStripeを統合します。決済インテント、顧客、サブスクリプション、請求書、課金、商品、価格、イベントを管理します。Stripeイベントが発生したときにワークフローをトリガーするトリガーモードでも使用できます。

## ツール

### `stripe_create_payment_intent`

支払いを処理するための新しい決済インテントを作成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `amount` | number | はい | 金額（セント単位）（例：2000は$20.00） |
| `currency` | string | はい | 3文字のISO通貨コード（例：usd、eur） |
| `customer` | string | いいえ | この支払いに関連付ける顧客ID |
| `payment_method` | string | いいえ | 支払い方法ID |
| `description` | string | いいえ | 支払いの説明 |
| `receipt_email` | string | いいえ | 領収書を送信するメールアドレス |
| `metadata` | json | いいえ | 追加情報を保存するためのキーと値のペアのセット |
| `automatic_payment_methods` | json | いいえ | 自動支払い方法を有効にする（例：`{"enabled": true}`) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intent` | json | 作成されたPayment Intentオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨を含むPayment Intentのメタデータ |

### `stripe_retrieve_payment_intent`

IDで既存のPayment Intentを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | Payment Intent ID（例：pi_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intent` | json | 取得されたPayment Intentオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨を含むPayment Intentのメタデータ |

### `stripe_update_payment_intent`

既存のPayment Intentを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | Payment Intent ID（例：pi_1234567890） |
| `amount` | number | いいえ | 更新された金額（セント単位） |
| `currency` | string | いいえ | 3文字のISO通貨コード |
| `customer` | string | いいえ | 顧客ID |
| `description` | string | いいえ | 更新された説明 |
| `metadata` | json | いいえ | 更新されたメタデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intent` | json | 更新されたPayment Intentオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨を含むPayment Intentのメタデータ |

### `stripe_confirm_payment_intent`

決済を完了するためにPayment Intentを確認する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | Payment Intent ID（例：pi_1234567890） |
| `payment_method` | string | いいえ | 確認に使用する決済方法ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intent` | json | 確認されたPayment Intentオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨を含むPayment Intentのメタデータ |

### `stripe_capture_payment_intent`

承認済みのPayment Intentをキャプチャする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | Payment Intent ID（例：pi_1234567890） |
| `amount_to_capture` | number | いいえ | キャプチャする金額（セント単位、デフォルトは全額） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intent` | json | キャプチャされたPayment Intentオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨を含むPayment Intentのメタデータ |

### `stripe_cancel_payment_intent`

Payment Intentをキャンセルする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | Payment Intent ID（例：pi_1234567890） |
| `cancellation_reason` | string | いいえ | キャンセルの理由（duplicate、fraudulent、requested_by_customer、abandoned） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intent` | json | キャンセルされたPayment Intentオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨を含むPayment Intentのメタデータ |

### `stripe_list_payment_intents`

すべてのPayment Intentを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `customer` | string | いいえ | 顧客IDでフィルタリング |
| `created` | json | いいえ | 作成日でフィルタリング（例：`{"gt": 1633024800}`) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intents` | json | Payment Intentオブジェクトの配列 |
| `metadata` | json | カウントとhas_moreを含むリストメタデータ |

### `stripe_search_payment_intents`

クエリ構文を使用してPayment Intentを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："status:'succeeded' AND currency:'usd'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `payment_intents` | json | 一致するPayment Intentオブジェクトの配列 |
| `metadata` | json | カウントとhas_moreを含む検索メタデータ |

### `stripe_create_customer`

新しい顧客オブジェクトを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `email` | string | いいえ | 顧客のメールアドレス |
| `name` | string | いいえ | 顧客のフルネーム |
| `phone` | string | いいえ | 顧客の電話番号 |
| `description` | string | いいえ | 顧客の説明 |
| `address` | json | いいえ | 顧客の住所オブジェクト |
| `metadata` | json | いいえ | キーと値のペアのセット |
| `payment_method` | string | いいえ | 添付する支払い方法ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customer` | json | 作成された顧客オブジェクト |
| `metadata` | json | 顧客メタデータ |

### `stripe_retrieve_customer`

IDで既存の顧客を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 顧客ID（例：cus_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customer` | json | 取得された顧客オブジェクト |
| `metadata` | json | 顧客メタデータ |

### `stripe_update_customer`

既存の顧客を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 顧客ID（例：cus_1234567890） |
| `email` | string | いいえ | 更新されたメールアドレス |
| `name` | string | いいえ | 更新された名前 |
| `phone` | string | いいえ | 更新された電話番号 |
| `description` | string | いいえ | 更新された説明 |
| `address` | json | いいえ | 更新された住所オブジェクト |
| `metadata` | json | いいえ | 更新されたメタデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customer` | json | 更新された顧客オブジェクト |
| `metadata` | json | 顧客メタデータ |

### `stripe_delete_customer`

顧客を完全に削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 顧客ID（例：cus_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 顧客が削除されたかどうか |
| `id` | string | 削除された顧客のID |
| `metadata` | json | 削除メタデータ |

### `stripe_list_customers`

すべての顧客をリスト表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `email` | string | いいえ | メールアドレスでフィルタリング |
| `created` | json | いいえ | 作成日でフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customers` | json | 顧客オブジェクトの配列 |
| `metadata` | json | リストメタデータ |

### `stripe_search_customers`

クエリ構文を使用して顧客を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："email:\'customer@example.com\'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `customers` | json | 一致する顧客オブジェクトの配列 |
| `metadata` | json | 検索メタデータ |

### `stripe_create_subscription`

顧客の新しいサブスクリプションを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `customer` | string | はい | サブスクリプションを作成する顧客ID |
| `items` | json | はい | 価格IDを含むアイテムの配列（例：`[{"price": "price_xxx", "quantity": 1}]`） |
| `trial_period_days` | number | いいえ | トライアル日数 |
| `default_payment_method` | string | いいえ | 支払い方法ID |
| `cancel_at_period_end` | boolean | いいえ | 期間終了時にサブスクリプションをキャンセルするかどうか |
| `metadata` | json | いいえ | 追加情報を保存するためのキーと値のペアのセット |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscription` | json | 作成されたサブスクリプションオブジェクト |
| `metadata` | json | ID、ステータス、顧客を含むサブスクリプションメタデータ |

### `stripe_retrieve_subscription`

IDで既存のサブスクリプションを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | サブスクリプションID（例：sub_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscription` | json | 取得されたサブスクリプションオブジェクト |
| `metadata` | json | ID、ステータス、顧客を含むサブスクリプションメタデータ |

### `stripe_update_subscription`

既存のサブスクリプションを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | サブスクリプションID（例：sub_1234567890） |
| `items` | json | いいえ | 価格IDを含む更新された項目の配列 |
| `cancel_at_period_end` | boolean | いいえ | 期間終了時にサブスクリプションをキャンセルするかどうか |
| `metadata` | json | いいえ | 更新されたメタデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscription` | json | 更新されたサブスクリプションオブジェクト |
| `metadata` | json | ID、ステータス、顧客を含むサブスクリプションメタデータ |

### `stripe_cancel_subscription`

サブスクリプションをキャンセルする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | サブスクリプションID（例：sub_1234567890） |
| `prorate` | boolean | いいえ | キャンセルを日割り計算するかどうか |
| `invoice_now` | boolean | いいえ | すぐに請求書を発行するかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscription` | json | キャンセルされたサブスクリプションオブジェクト |
| `metadata` | json | ID、ステータス、顧客を含むサブスクリプションメタデータ |

### `stripe_resume_subscription`

キャンセル予定のサブスクリプションを再開する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | サブスクリプションID（例：sub_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscription` | json | 再開されたサブスクリプションオブジェクト |
| `metadata` | json | ID、ステータス、顧客を含むサブスクリプションメタデータ |

### `stripe_list_subscriptions`

すべてのサブスクリプションを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `customer` | string | いいえ | 顧客IDでフィルタリング |
| `status` | string | いいえ | ステータスでフィルタリング（active、past_due、unpaid、canceled、incomplete、incomplete_expired、trialing、all） |
| `price` | string | いいえ | 価格IDでフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscriptions` | json | サブスクリプションオブジェクトの配列 |
| `metadata` | json | リストメタデータ |

### `stripe_search_subscriptions`

クエリ構文を使用してサブスクリプションを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："status:'active' AND customer:'cus_xxx'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subscriptions` | json | 一致するサブスクリプションオブジェクトの配列 |
| `metadata` | json | 検索メタデータ |

### `stripe_create_invoice`

新しい請求書を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `customer` | string | はい | 顧客ID（例：cus_1234567890） |
| `description` | string | いいえ | 請求書の説明 |
| `metadata` | json | いいえ | キーと値のペアのセット |
| `auto_advance` | boolean | いいえ | 請求書を自動的に確定するかどうか |
| `collection_method` | string | いいえ | 回収方法：charge_automatically または send_invoice |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 作成された請求書オブジェクト |
| `metadata` | json | 請求書のメタデータ |

### `stripe_retrieve_invoice`

IDで既存の請求書を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 取得された請求書オブジェクト |
| `metadata` | json | 請求書メタデータ |

### `stripe_update_invoice`

既存の請求書を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |
| `description` | string | いいえ | 請求書の説明 |
| `metadata` | json | いいえ | キーと値のペアのセット |
| `auto_advance` | boolean | いいえ | 請求書を自動確定する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 更新された請求書オブジェクト |
| `metadata` | json | 請求書メタデータ |

### `stripe_delete_invoice`

下書き請求書を完全に削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 請求書が削除されたかどうか |
| `id` | string | 削除された請求書のID |
| `metadata` | json | 削除メタデータ |

### `stripe_finalize_invoice`

ドラフト請求書を確定する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |
| `auto_advance` | boolean | いいえ | 請求書を自動的に進める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 確定された請求書オブジェクト |
| `metadata` | json | 請求書メタデータ |

### `stripe_pay_invoice`

請求書を支払う

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |
| `paid_out_of_band` | boolean | いいえ | 請求書をオフラインで支払い済みとしてマークする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 支払い済みの請求書オブジェクト |
| `metadata` | json | 請求書メタデータ |

### `stripe_void_invoice`

請求書を無効にする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 無効化された請求書オブジェクト |
| `metadata` | json | 請求書メタデータ |

### `stripe_send_invoice`

顧客に請求書を送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 請求書ID（例：in_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoice` | json | 送信された請求書オブジェクト |
| `metadata` | json | 請求書メタデータ |

### `stripe_list_invoices`

すべての請求書を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `customer` | string | いいえ | 顧客IDでフィルタリング |
| `status` | string | いいえ | 請求書のステータスでフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoices` | json | 請求書オブジェクトの配列 |
| `metadata` | json | リストメタデータ |

### `stripe_search_invoices`

クエリ構文を使用して請求書を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："customer:\'cus_1234567890\'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invoices` | json | 一致する請求書オブジェクトの配列 |
| `metadata` | json | 検索メタデータ |

### `stripe_create_charge`

決済処理のための新しいチャージを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `amount` | number | はい | セント単位の金額（例：2000は$20.00） |
| `currency` | string | はい | 3文字のISO通貨コード（例：usd、eur） |
| `customer` | string | いいえ | このチャージに関連付ける顧客ID |
| `source` | string | いいえ | 支払いソースID（例：カードトークンまたは保存されたカードID） |
| `description` | string | いいえ | チャージの説明 |
| `metadata` | json | いいえ | 追加情報を保存するためのキーと値のペアのセット |
| `capture` | boolean | いいえ | チャージをすぐにキャプチャするかどうか（デフォルトはtrue） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `charge` | json | 作成されたチャージオブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨、支払い状況を含むチャージメタデータ |

### `stripe_retrieve_charge`

IDで既存のチャージを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | チャージID（例：ch_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `charge` | json | 取得された課金オブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨、支払い状況を含む課金メタデータ |

### `stripe_update_charge`

既存の課金を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 課金ID（例：ch_1234567890） |
| `description` | string | いいえ | 更新された説明 |
| `metadata` | json | いいえ | 更新されたメタデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `charge` | json | 更新された課金オブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨、支払い状況を含む課金メタデータ |

### `stripe_capture_charge`

未キャプチャの課金をキャプチャする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 課金ID（例：ch_1234567890） |
| `amount` | number | いいえ | キャプチャする金額（セント単位）（デフォルトは全額） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `charge` | json | キャプチャされた課金オブジェクト |
| `metadata` | json | ID、ステータス、金額、通貨、支払い状況を含む課金メタデータ |

### `stripe_list_charges`

すべての請求を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `customer` | string | いいえ | 顧客IDでフィルタリング |
| `created` | json | いいえ | 作成日でフィルタリング（例：`{"gt": 1633024800}`) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `charges` | json | チャージオブジェクトの配列 |
| `metadata` | json | 数とhas_moreを含むリストメタデータ |

### `stripe_search_charges`

クエリ構文を使用して請求を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："status:'succeeded' AND currency:'usd'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `charges` | json | 一致するチャージオブジェクトの配列 |
| `metadata` | json | 数とhas_moreを含む検索メタデータ |

### `stripe_create_product`

新しい商品オブジェクトを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `name` | string | はい | 商品名 |
| `description` | string | いいえ | 商品の説明 |
| `active` | boolean | いいえ | 商品がアクティブかどうか |
| `images` | json | いいえ | 商品の画像URLの配列 |
| `metadata` | json | いいえ | キーと値のペアのセット |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `product` | json | 作成された商品オブジェクト |
| `metadata` | json | 商品メタデータ |

### `stripe_retrieve_product`

IDで既存の商品を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 商品ID（例：prod_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `product` | json | 取得された商品オブジェクト |
| `metadata` | json | 商品メタデータ |

### `stripe_update_product`

既存の商品を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 商品ID（例：prod_1234567890） |
| `name` | string | いいえ | 更新された商品名 |
| `description` | string | いいえ | 更新された商品説明 |
| `active` | boolean | いいえ | 更新されたアクティブステータス |
| `images` | json | いいえ | 更新された画像URL配列 |
| `metadata` | json | いいえ | 更新されたメタデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `product` | json | 更新された商品オブジェクト |
| `metadata` | json | 商品メタデータ |

### `stripe_delete_product`

商品を完全に削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 商品ID（例：prod_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 商品が削除されたかどうか |
| `id` | string | 削除された商品のID |
| `metadata` | json | 削除メタデータ |

### `stripe_list_products`

すべての商品を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `active` | boolean | いいえ | アクティブステータスでフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `products` | json | 商品オブジェクトの配列 |
| `metadata` | json | リストメタデータ |

### `stripe_search_products`

クエリ構文を使用して商品を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："name:\'shirt\'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `products` | json | 一致する商品オブジェクトの配列 |
| `metadata` | json | 検索メタデータ |

### `stripe_create_price`

商品の新しい価格を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `product` | string | はい | 商品ID（例：prod_1234567890） |
| `currency` | string | はい | 3文字のISO通貨コード（例：usd、eur） |
| `unit_amount` | number | いいえ | 金額（セント単位、例：1000は$10.00） |
| `recurring` | json | いいえ | 定期請求の設定（間隔：日/週/月/年） |
| `metadata` | json | いいえ | キーと値のペアのセット |
| `billing_scheme` | string | いいえ | 請求スキーム（per_unitまたはtiered） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `price` | json | 作成された価格オブジェクト |
| `metadata` | json | 価格メタデータ |

### `stripe_retrieve_price`

IDで既存の価格を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 価格ID（例：price_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `price` | json | 取得された価格オブジェクト |
| `metadata` | json | 価格メタデータ |

### `stripe_update_price`

既存の価格を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | 価格ID（例：price_1234567890） |
| `active` | boolean | いいえ | 価格がアクティブかどうか |
| `metadata` | json | いいえ | 更新されたメタデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `price` | json | 更新された価格オブジェクト |
| `metadata` | json | 価格メタデータ |

### `stripe_list_prices`

すべての価格を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `product` | string | いいえ | 商品IDでフィルタリング |
| `active` | boolean | いいえ | アクティブ状態でフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `prices` | json | 価格オブジェクトの配列 |
| `metadata` | json | リストメタデータ |

### `stripe_search_prices`

クエリ構文を使用して価格を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `query` | string | はい | 検索クエリ（例："active:'true' AND currency:'usd'"） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `prices` | json | 一致する価格オブジェクトの配列 |
| `metadata` | json | 検索メタデータ |

### `stripe_retrieve_event`

IDで既存のイベントを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `id` | string | はい | イベントID（例：evt_1234567890） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `event` | json | 取得されたイベントオブジェクト |
| `metadata` | json | ID、タイプ、作成タイムスタンプを含むイベントメタデータ |

### `stripe_list_events`

すべてのイベントを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Stripe APIキー（シークレットキー） |
| `limit` | number | いいえ | 返す結果の数（デフォルト10、最大100） |
| `type` | string | いいえ | イベントタイプでフィルタリング（例：payment_intent.created） |
| `created` | json | いいえ | 作成日でフィルタリング（例：`{"gt": 1633024800}`) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `events` | json | イベントオブジェクトの配列 |
| `metadata` | json | カウントとhas_moreを含むリストメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `stripe`
```

--------------------------------------------------------------------------------

````

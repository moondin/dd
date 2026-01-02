---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 201
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 201 of 933)

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

---[FILE: gitlab.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/gitlab.mdx

```text
---
title: GitLab
description: GitLabのプロジェクト、課題、マージリクエスト、パイプラインとやり取りする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gitlab"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitLab](https://gitlab.com/)は、チームがソフトウェア開発ライフサイクルを管理、共同作業、自動化できる包括的なDevOpsプラットフォームです。GitLabを使用すると、ソースコード管理、CI/CD、レビュー、コラボレーションを単一のアプリケーションで簡単に処理できます。

SimでGitLabを使用すると、以下のことができます：

- **プロジェクトとリポジトリの管理**：GitLabプロジェクトの一覧表示と取得、詳細へのアクセス、リポジトリの整理
- **課題の操作**：作業を追跡し効果的に共同作業するための課題の一覧表示、作成、コメント
- **マージリクエストの処理**：コード変更とピアレビューのためのマージリクエストのレビュー、作成、管理
- **CI/CDパイプラインの自動化**：自動化フローの一部としてGitLabパイプラインのトリガー、監視、操作
- **コメントによる共同作業**：チーム内の効率的なコミュニケーションのために課題やマージリクエストにコメントを追加

SimのGitLab統合を使用すると、エージェントはプログラムでGitLabプロジェクトとやり取りできます。プロジェクト管理、課題追跡、コードレビュー、パイプライン操作をワークフローでシームレスに自動化し、ソフトウェア開発プロセスを最適化し、チーム全体のコラボレーションを強化します。
{/* MANUAL-CONTENT-END */}

## 使用方法

GitLabをワークフローに統合します。プロジェクト、課題、マージリクエスト、パイプライン、コメントを管理できます。GitLabのすべての主要なDevOps操作をサポートしています。

## ツール

### `gitlab_list_projects`

認証されたユーザーがアクセスできるGitLabプロジェクトを一覧表示

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `owned` | boolean | いいえ | 現在のユーザーが所有するプロジェクトに限定 |
| `membership` | boolean | いいえ | 現在のユーザーがメンバーであるプロジェクトに限定 |
| `search` | string | いいえ | 名前でプロジェクトを検索 |
| `visibility` | string | いいえ | 可視性でフィルタリング（public、internal、private） |
| `orderBy` | string | いいえ | フィールドで並べ替え（id、name、path、created_at、updated_at、last_activity_at） |
| `sort` | string | いいえ | 並べ替え方向（asc、desc） |
| `perPage` | number | いいえ | ページあたりの結果数（デフォルト20、最大100） |
| `page` | number | いいえ | ページネーションのページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `projects` | array | GitLabプロジェクトのリスト |
| `total` | number | プロジェクトの総数 |

### `gitlab_get_project`

特定のGitLabプロジェクトの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス（例："namespace/project"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `project` | object | GitLabプロジェクトの詳細 |

### `gitlab_list_issues`

GitLabプロジェクト内の課題を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `state` | string | いいえ | 状態によるフィルタリング（opened、closed、all） |
| `labels` | string | いいえ | カンマ区切りのラベル名リスト |
| `assigneeId` | number | いいえ | 担当者ユーザーIDによるフィルタリング |
| `milestoneTitle` | string | いいえ | マイルストーンタイトルによるフィルタリング |
| `search` | string | いいえ | タイトルと説明で課題を検索 |
| `orderBy` | string | いいえ | フィールドによる並べ替え（created_at、updated_at） |
| `sort` | string | いいえ | 並べ替え方向（asc、desc） |
| `perPage` | number | いいえ | ページあたりの結果数（デフォルト20、最大100） |
| `page` | number | いいえ | ページネーションのページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issues` | array | GitLab課題のリスト |
| `total` | number | 課題の総数 |

### `gitlab_get_issue`

特定のGitLab課題の詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `issueIid` | number | はい | プロジェクト内の課題番号（GitLab UIに表示される#） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issue` | object | GitLab課題の詳細 |

### `gitlab_create_issue`

GitLabプロジェクトに新しい課題を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `title` | string | はい | 課題のタイトル |
| `description` | string | いいえ | 課題の説明（Markdown対応） |
| `labels` | string | いいえ | カンマ区切りのラベル名リスト |
| `assigneeIds` | array | いいえ | 割り当てるユーザーIDの配列 |
| `milestoneId` | number | いいえ | 割り当てるマイルストーンID |
| `dueDate` | string | いいえ | YYYY-MM-DD形式の期限日 |
| `confidential` | boolean | いいえ | 課題が機密扱いかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issue` | object | 作成されたGitLab課題 |

### `gitlab_update_issue`

GitLabプロジェクト内の既存の課題を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `issueIid` | number | はい | 課題内部ID（IID） |
| `title` | string | いいえ | 新しい課題のタイトル |
| `description` | string | いいえ | 新しい課題の説明（Markdown対応） |
| `stateEvent` | string | いいえ | 状態イベント（closeまたはreopen） |
| `labels` | string | いいえ | カンマ区切りのラベル名リスト |
| `assigneeIds` | array | いいえ | 割り当てるユーザーIDの配列 |
| `milestoneId` | number | いいえ | 割り当てるマイルストーンID |
| `dueDate` | string | いいえ | YYYY-MM-DD形式の期限日 |
| `confidential` | boolean | いいえ | 課題が機密扱いかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issue` | object | 更新されたGitLab課題 |

### `gitlab_delete_issue`

GitLabプロジェクトから課題を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `issueIid` | number | はい | 課題内部ID（IID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 課題が正常に削除されたかどうか |

### `gitlab_create_issue_note`

GitLab課題にコメントを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `issueIid` | number | はい | 課題の内部ID（IID） |
| `body` | string | はい | コメント本文（Markdown対応） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `note` | object | 作成されたコメント |

### `gitlab_list_merge_requests`

GitLabプロジェクトのマージリクエスト一覧を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `state` | string | いいえ | 状態によるフィルタリング（opened、closed、merged、all） |
| `labels` | string | いいえ | カンマ区切りのラベル名リスト |
| `sourceBranch` | string | いいえ | ソースブランチによるフィルタリング |
| `targetBranch` | string | いいえ | ターゲットブランチによるフィルタリング |
| `orderBy` | string | いいえ | 並べ替えフィールド（created_at、updated_at） |
| `sort` | string | いいえ | 並べ替え方向（asc、desc） |
| `perPage` | number | いいえ | ページあたりの結果数（デフォルト20、最大100） |
| `page` | number | いいえ | ページネーションのページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `mergeRequests` | array | GitLabマージリクエストのリスト |
| `total` | number | マージリクエストの総数 |

### `gitlab_get_merge_request`

特定のGitLabマージリクエストの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `mergeRequestIid` | number | はい | マージリクエスト内部ID（IID） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | GitLabマージリクエストの詳細 |

### `gitlab_create_merge_request`

GitLabプロジェクトに新しいマージリクエストを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `sourceBranch` | string | はい | ソースブランチ名 |
| `targetBranch` | string | はい | ターゲットブランチ名 |
| `title` | string | はい | マージリクエストのタイトル |
| `description` | string | いいえ | マージリクエストの説明（Markdown対応） |
| `labels` | string | いいえ | カンマ区切りのラベル名リスト |
| `assigneeIds` | array | いいえ | 割り当てるユーザーIDの配列 |
| `milestoneId` | number | いいえ | 割り当てるマイルストーンID |
| `removeSourceBranch` | boolean | いいえ | マージ後にソースブランチを削除する |
| `squash` | boolean | いいえ | マージ時にコミットをスカッシュする |
| `draft` | boolean | いいえ | 下書き（作業中）としてマークする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | 作成されたGitLabマージリクエスト |

### `gitlab_update_merge_request`

GitLabプロジェクトの既存のマージリクエストを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `mergeRequestIid` | number | はい | マージリクエスト内部ID（IID） |
| `title` | string | いいえ | 新しいマージリクエストのタイトル |
| `description` | string | いいえ | 新しいマージリクエストの説明 |
| `stateEvent` | string | いいえ | 状態イベント（closeまたはreopen） |
| `labels` | string | いいえ | カンマ区切りのラベル名リスト |
| `assigneeIds` | array | いいえ | 割り当てるユーザーIDの配列 |
| `milestoneId` | number | いいえ | 割り当てるマイルストーンID |
| `targetBranch` | string | いいえ | 新しいターゲットブランチ |
| `removeSourceBranch` | boolean | いいえ | マージ後にソースブランチを削除する |
| `squash` | boolean | いいえ | マージ時にコミットをスカッシュする |
| `draft` | boolean | いいえ | 下書き（作業中）としてマークする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | 更新されたGitLabマージリクエスト |

### `gitlab_merge_merge_request`

GitLabプロジェクトでマージリクエストをマージする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `mergeRequestIid` | number | はい | マージリクエスト内部ID（IID） |
| `mergeCommitMessage` | string | いいえ | カスタムマージコミットメッセージ |
| `squashCommitMessage` | string | いいえ | カスタムスカッシュコミットメッセージ |
| `squash` | boolean | いいえ | マージ前にコミットをスカッシュする |
| `shouldRemoveSourceBranch` | boolean | いいえ | マージ後にソースブランチを削除する |
| `mergeWhenPipelineSucceeds` | boolean | いいえ | パイプラインが成功したらマージする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `mergeRequest` | object | マージされたGitLabマージリクエスト |

### `gitlab_create_merge_request_note`

GitLabマージリクエストにコメントを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `mergeRequestIid` | number | はい | マージリクエスト内部ID（IID） |
| `body` | string | はい | コメント本文（Markdown対応） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `note` | object | 作成されたコメント |

### `gitlab_list_pipelines`

GitLabプロジェクト内のパイプラインを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `ref` | string | いいえ | ref（ブランチまたはタグ）でフィルタリング |
| `status` | string | いいえ | ステータスでフィルタリング（created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled） |
| `orderBy` | string | いいえ | フィールドで並べ替え（id, status, ref, updated_at, user_id） |
| `sort` | string | いいえ | 並べ替え方向（asc, desc） |
| `perPage` | number | いいえ | ページあたりの結果数（デフォルト20、最大100） |
| `page` | number | いいえ | ページネーションのページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pipelines` | array | GitLabパイプラインのリスト |
| `total` | number | パイプラインの総数 |

### `gitlab_get_pipeline`

特定のGitLabパイプラインの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `pipelineId` | number | はい | パイプラインID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pipeline` | object | GitLabパイプラインの詳細 |

### `gitlab_create_pipeline`

GitLabプロジェクトで新しいパイプラインをトリガーする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `ref` | string | はい | パイプラインを実行するブランチまたはタグ |
| `variables` | array | いいえ | パイプラインの変数の配列（各変数はkey、value、およびオプションのvariable_typeを持つ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pipeline` | object | 作成されたGitLabパイプライン |

### `gitlab_retry_pipeline`

失敗したGitLabパイプラインを再試行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `pipelineId` | number | はい | パイプラインID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pipeline` | object | 再試行されたGitLabパイプライン |

### `gitlab_cancel_pipeline`

実行中のGitLabパイプラインをキャンセルする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | プロジェクトIDまたはURLエンコードされたパス |
| `pipelineId` | number | はい | パイプラインID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pipeline` | object | キャンセルされたGitLabパイプライン |

## 注意事項

- カテゴリー: `tools`
- タイプ: `gitlab`
```

--------------------------------------------------------------------------------

---[FILE: gmail.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/gmail.mdx

```text
---
title: Gmail
description: Gmailメッセージの送信、読み取り、検索、移動、またはGmailイベントからワークフローをトリガーする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gmail"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Gmail](https://gmail.com)はGoogleの人気メールサービスで、メールの送受信や管理のための堅牢なプラットフォームを提供しています。世界中で18億人以上のアクティブユーザーを持つGmailは、強力な検索機能、整理ツール、統合オプションを備えた機能豊富な体験を提供します。

Gmailでは以下のことができます：

- **メールの送受信**：クリーンで直感的なインターフェースを通じて連絡先とコミュニケーション
- **メッセージの整理**：ラベル、フォルダ、フィルターを使用して受信トレイを整理
- **効率的な検索**：Googleの強力な検索技術で特定のメッセージをすばやく見つける
- **ワークフローの自動化**：フィルターとルールを作成して受信メールを自動的に処理
- **どこからでもアクセス**：同期されたコンテンツと設定で複数のデバイスからGmailを使用
- **他のサービスとの統合**：GoogleカレンダーやDriveなどの生産性ツールと連携

Simでは、Gmail統合により、エージェントがプログラムによってメールを完全に管理し、包括的な自動化機能を利用できます。これにより、通知の送信、受信メッセージの処理、メールからの情報抽出、大規模なコミュニケーションワークフローの管理など、強力な自動化シナリオが可能になります。エージェントは以下のことができます：

- **作成と送信**: 添付ファイル付きのパーソナライズされたメールを作成し、受信者に送信
- **読み取りと検索**: Gmailのクエリ構文を使用して特定のメッセージを見つけ、コンテンツを抽出
- **インテリジェントな整理**: メッセージを既読/未読としてマーク、メールのアーカイブ/アーカイブ解除、ラベルの管理
- **受信トレイのクリーンアップ**: メッセージの削除、ラベル間のメール移動、受信トレイゼロの維持
- **ワークフローのトリガー**: 新しいメールをリアルタイムで監視し、受信メッセージに反応する応答性の高いワークフローを実現

この統合により、AIワークフローとメールコミュニケーションの間のギャップが埋められ、世界で最も広く使用されているコミュニケーションプラットフォームの一つとシームレスに連携できます。カスタマーサポートの自動応答、領収書の処理、サブスクリプションの管理、チームコミュニケーションの調整など、Gmail統合は包括的なメール自動化に必要なすべてのツールを提供します。
{/* MANUAL-CONTENT-END */}

## 使用手順

Gmailをワークフローに統合します。メールの送信、読み取り、検索、移動ができます。新しいメールを受信したときにワークフローをトリガーするトリガーモードでも使用できます。

## ツール

### Gmailで送信

Gmailを使用してメールを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `to` | string | はい | 受信者のメールアドレス |
| `subject` | string | いいえ | メールの件名 |
| `body` | string | はい | メール本文の内容 |
| `contentType` | string | いいえ | メール本文のコンテンツタイプ（テキストまたはHTML） |
| `threadId` | string | いいえ | 返信するスレッドID（スレッド化用） |
| `replyToMessageId` | string | いいえ | 返信するGmailメッセージID - Gmail読み取り結果の「id」フィールドを使用（RFC「messageId」ではない） |
| `cc` | string | いいえ | CCの受信者（カンマ区切り） |
| `bcc` | string | いいえ | BCCの受信者（カンマ区切り） |
| `attachments` | file[] | いいえ | メールに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_draft`

Gmailでメールの下書きを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `to` | string | はい | 受信者のメールアドレス |
| `subject` | string | いいえ | メールの件名 |
| `body` | string | はい | メール本文の内容 |
| `contentType` | string | いいえ | メール本文のコンテンツタイプ（テキストまたはHTML） |
| `threadId` | string | いいえ | 返信するスレッドID（スレッド化用） |
| `replyToMessageId` | string | いいえ | 返信するGmailメッセージID - Gmail読み取り結果の「id」フィールドを使用（RFC「messageId」ではない） |
| `cc` | string | いいえ | CCの受信者（カンマ区切り） |
| `bcc` | string | いいえ | BCCの受信者（カンマ区切り） |
| `attachments` | file[] | いいえ | メールの下書きに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | 下書きのメタデータ |

### `gmail_read`

Gmailからメールを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | いいえ | 読み取るメッセージのID |
| `folder` | string | いいえ | メールを読み取るフォルダ/ラベル |
| `unreadOnly` | boolean | いいえ | 未読メッセージのみを取得する |
| `maxResults` | number | いいえ | 取得するメッセージの最大数（デフォルト：1、最大：10） |
| `includeAttachments` | boolean | いいえ | メールの添付ファイルをダウンロードして含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | メールのテキスト内容 |
| `metadata` | json | メールのメタデータ |
| `attachments` | file[] | メールの添付ファイル |

### `gmail_search`

Gmailでメールを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | メール検索クエリ |
| `maxResults` | number | いいえ | 返す結果の最大数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 検索結果の概要 |
| `metadata` | object | 検索メタデータ |

### `gmail_move`

Gmailラベル/フォルダ間でメールを移動する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 移動するメッセージのID |
| `addLabelIds` | string | はい | 追加するラベルIDのカンマ区切りリスト（例：INBOX, Label_123） |
| `removeLabelIds` | string | いいえ | 削除するラベルIDのカンマ区切りリスト（例：INBOX, SPAM） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールメタデータ |

### `gmail_mark_read`

Gmailメッセージを既読としてマークする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 既読としてマークするメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_mark_unread`

Gmailメッセージを未読にする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 未読にするメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_archive`

Gmailメッセージをアーカイブする（受信トレイから削除）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | アーカイブするメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_unarchive`

Gmailメッセージをアーカイブ解除する（受信トレイに戻す）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | アーカイブ解除するメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_delete`

Gmailメッセージを削除する（ゴミ箱に移動）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 削除するメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_add_label`

Gmailメッセージにラベルを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | ラベルを追加するメッセージのID |
| `labelIds` | string | はい | 追加するラベルIDをカンマ区切りで指定（例：INBOX, Label_123） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

### `gmail_remove_label`

Gmailメッセージからラベルを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | ラベルを削除するメッセージのID |
| `labelIds` | string | はい | 削除するラベルIDをカンマ区切りで指定（例：INBOX, Label_123） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | メールのメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `gmail`
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_calendar.mdx

```text
---
title: Google カレンダー
description: Google カレンダーのイベントを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_calendar"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google カレンダー](https://calendar.google.com)は、Googleが提供する強力なカレンダーおよびスケジュールサービスで、イベント、会議、予定を管理するための包括的なプラットフォームを提供しています。Googleのエコシステム全体とのシームレスな統合と広範な普及により、Google カレンダーは個人的にも専門的にもスケジュール管理のニーズに対応する堅牢な機能を提供しています。

Google カレンダーでは、次のことができます：

- **イベントの作成と管理**：詳細情報を含む会議、予約、リマインダーのスケジュール設定
- **カレンダー招待の送信**：メール招待状を通じて参加者に自動的に通知し調整
- **自然言語によるイベント作成**：「明日の午後3時にジョンとミーティング」のような会話形式の言葉で素早くイベントを追加
- **イベントの表示と検索**：複数のカレンダーにわたって予定されたイベントを簡単に検索しアクセス
- **複数のカレンダーの管理**：様々なカレンダーにわたって異なるタイプのイベントを整理

Simでは、Google カレンダー連携によりエージェントがプログラムでカレンダーイベントを作成、読み取り、管理することができます。これにより、会議のスケジュール設定、カレンダー招待の送信、空き状況の確認、イベント詳細の管理などの強力な自動化シナリオが可能になります。エージェントは自然言語入力でイベントを作成し、参加者に自動カレンダー招待を送信し、イベント情報を取得し、今後のイベントをリストアップすることができます。この連携により、AIワークフローとカレンダー管理の間のギャップが埋められ、世界で最も広く使用されているカレンダープラットフォームの一つとのシームレスなスケジュール自動化と調整が可能になります。
{/* MANUAL-CONTENT-END */}

## 使用手順

Googleカレンダーをワークフローに統合します。カレンダーイベントの作成、読み取り、更新、一覧表示が可能です。OAuthが必要です。

## ツール

### `google_calendar_create`

Googleカレンダーに新しいイベントを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | いいえ | カレンダーID（デフォルトはプライマリ） |
| `summary` | string | はい | イベントのタイトル/概要 |
| `description` | string | いいえ | イベントの説明 |
| `location` | string | いいえ | イベントの場所 |
| `startDateTime` | string | はい | 開始日時。タイムゾーンオフセットを含める必要があります（例：2025-06-03T10:00:00-08:00）または、timeZoneパラメータを提供する |
| `endDateTime` | string | はい | 終了日時。タイムゾーンオフセットを含める必要があります（例：2025-06-03T11:00:00-08:00）または、timeZoneパラメータを提供する |
| `timeZone` | string | いいえ | タイムゾーン（例：America/Los_Angeles）。日時にオフセットが含まれていない場合は必須。提供されない場合はAmerica/Los_Angelesがデフォルト。 |
| `attendees` | array | いいえ | 参加者のメールアドレスの配列 |
| `sendUpdates` | string | いいえ | 参加者への更新通知方法：all（全員）、externalOnly（外部のみ）、またはnone（なし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | イベント作成確認メッセージ |
| `metadata` | json | 作成されたイベントのメタデータ（ID、ステータス、詳細を含む） |

### `google_calendar_list`

Googleカレンダーからイベントを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | いいえ | カレンダーID（デフォルトはprimary） |
| `timeMin` | string | いいえ | イベントの下限（RFC3339タイムスタンプ、例：2025-06-03T00:00:00Z） |
| `timeMax` | string | いいえ | イベントの上限（RFC3339タイムスタンプ、例：2025-06-04T00:00:00Z） |
| `orderBy` | string | いいえ | 返されるイベントの順序（startTimeまたはupdated） |
| `showDeleted` | boolean | いいえ | 削除されたイベントを含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 見つかったイベント数の要約 |
| `metadata` | json | ページネーショントークンとイベント詳細を含むイベントリスト |

### `google_calendar_get`

Google カレンダーから特定のイベントを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | いいえ | カレンダーID（デフォルトはプライマリ） |
| `eventId` | string | はい | 取得するイベントID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | イベント取得確認メッセージ |
| `metadata` | json | ID、ステータス、時間、参加者を含むイベント詳細 |

### `google_calendar_quick_add`

自然言語テキストからイベントを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | いいえ | カレンダーID（デフォルトはプライマリ） |
| `text` | string | はい | イベントを説明する自然言語テキスト（例：「明日午後3時にジョンとミーティング」） |
| `attendees` | array | いいえ | 参加者のメールアドレスの配列（カンマ区切りの文字列も可） |
| `sendUpdates` | string | いいえ | 参加者への更新通知方法：all（全員）、externalOnly（外部のみ）、またはnone（なし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 自然言語からのイベント作成確認メッセージ |
| `metadata` | json | 解析された詳細を含む作成されたイベントのメタデータ |

### `google_calendar_invite`

既存のGoogleカレンダーイベントに参加者を招待する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | いいえ | カレンダーID（デフォルトはプライマリ） |
| `eventId` | string | はい | 参加者を招待するイベントID |
| `attendees` | array | はい | 招待する参加者のメールアドレスの配列 |
| `sendUpdates` | string | いいえ | 参加者への更新通知方法：all、externalOnly、またはnone |
| `replaceExisting` | boolean | いいえ | 既存の参加者を置き換えるか追加するか（デフォルトはfalse） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | メール配信状況を含む参加者招待確認メッセージ |
| `metadata` | json | 参加者リストと詳細を含む更新されたイベントメタデータ |

## 注意事項

- カテゴリ: `tools`
- タイプ: `google_calendar`
```

--------------------------------------------------------------------------------

---[FILE: google_docs.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_docs.mdx

```text
---
title: Google ドキュメント
description: ドキュメントの読み取り、作成、編集
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_docs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google ドキュメント](https://docs.google.com)は、ユーザーがリアルタイムでドキュメントを作成、編集、共同作業できる強力なクラウドベースのドキュメント作成・編集サービスです。Googleの生産性スイートの一部として、Google ドキュメントは堅牢な書式設定、コメント機能、共有機能を備えたテキストドキュメント用の多目的プラットフォームを提供しています。

Simで Google ドキュメントの「読み取り」ツールを統合して、ドキュメントからデータを簡単に取得し、ワークフローに組み込む方法を学びましょう。このチュートリアルでは、Google ドキュメントの接続、データ読み取りの設定、およびその情報をリアルタイムでプロセスを自動化するために使用する方法を説明します。エージェントとライブデータを同期するのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/f41gy9rBHhE"
  title="Simで Google ドキュメント読み取りツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Simで Google ドキュメントの「更新」ツールを統合して、ワークフローを通じてドキュメントに簡単にコンテンツを追加する方法を学びましょう。このチュートリアルでは、Google ドキュメントの接続、データ書き込みの設定、およびその情報をシームレスにドキュメント更新を自動化するために使用する方法を説明します。最小限の労力で動的なリアルタイムドキュメントを維持するのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/L64ROHS2ivA"
  title="Simで Google ドキュメント更新ツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Simで Google ドキュメントの「作成」ツールを統合して、ワークフローを通じて新しいドキュメントを簡単に生成する方法を学びましょう。このチュートリアルでは、Google ドキュメントの接続、ドキュメント作成の設定、およびワークフローデータを使用してコンテンツを自動的に入力する方法を説明します。ドキュメント生成の効率化と生産性向上に最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/lWpHH4qddWk"
  title="SimでGoogle Docs作成ツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Google Docsでは、次のことができます：

- **ドキュメントの作成と編集**：包括的な書式設定オプションでテキストドキュメントを作成
- **リアルタイムでの共同作業**：同じドキュメントで複数のユーザーが同時に作業可能
- **変更の追跡**：改訂履歴を表示し、以前のバージョンを復元
- **コメントと提案**：元のコンテンツを変更せずにフィードバックや編集の提案が可能
- **どこからでもアクセス**：自動クラウド同期により、複数のデバイスでGoogle Docsを使用
- **オフラインでの作業**：インターネット接続なしで作業を続け、オンラインに戻ったときに変更を同期
- **他のサービスとの統合**：Google Drive、Sheets、Slides、およびサードパーティアプリケーションと連携

Simでは、Google Docs統合によりエージェントがプログラムでドキュメントコンテンツと直接やり取りできます。これにより、ドキュメント作成、コンテンツ抽出、共同編集、ドキュメント管理などの強力な自動化シナリオが可能になります。エージェントは既存のドキュメントから情報を抽出したり、ドキュメントに書き込んでコンテンツを更新したり、新しいドキュメントを一から作成したりできます。この統合により、AIワークフローとドキュメント管理の間のギャップが埋まり、世界で最も広く使用されているドキュメントプラットフォームの一つとシームレスに連携できます。SimとGoogle Docsを接続することで、ドキュメントワークフローの自動化、レポートの生成、ドキュメントからの洞察の抽出、ドキュメントの維持管理など、すべてをインテリジェントエージェントを通じて行うことができます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Google Docsをワークフローに統合します。ドキュメントの読み取り、書き込み、作成が可能です。OAuthが必要です。

## ツール

### `google_docs_read`

Google Docsドキュメントからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | はい | 読み取るドキュメントのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 抽出されたドキュメントのテキストコンテンツ |
| `metadata` | json | ID、タイトル、URLを含むドキュメントのメタデータ |

### `google_docs_write`

Google Docsドキュメントにコンテンツを書き込みまたは更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | はい | 書き込み先ドキュメントのID |
| `content` | string | はい | ドキュメントに書き込むコンテンツ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | ドキュメントのコンテンツが正常に更新されたかどうかを示す |
| `metadata` | json | ID、タイトル、URLを含む更新されたドキュメントのメタデータ |

### `google_docs_create`

新しいGoogle Docsドキュメントを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | 作成するドキュメントのタイトル |
| `content` | string | いいえ | 作成するドキュメントのコンテンツ |
| `folderSelector` | string | いいえ | ドキュメントを作成するフォルダを選択 |
| `folderId` | string | いいえ | ドキュメントを作成するフォルダのID（内部使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `metadata` | json | 作成されたドキュメントのメタデータ（ID、タイトル、URLを含む） |

## 注意事項

- カテゴリー: `tools`
- タイプ: `google_docs`
```

--------------------------------------------------------------------------------

---[FILE: google_drive.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_drive.mdx

```text
---
title: Google ドライブ
description: ファイルの作成、アップロード、リスト表示
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_drive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google ドライブ](https://drive.google.com)は、ユーザーがファイルを保存し、デバイス間でファイルを同期し、他のユーザーとファイルを共有できるGoogleのクラウドストレージおよびファイル同期サービスです。Googleの生産性エコシステムの中核コンポーネントとして、Google ドライブは堅牢なストレージ、整理、コラボレーション機能を提供しています。

SimでGoogle ドライブツールを統合して、ワークフローを通じてドライブから情報を簡単に取得する方法を学びましょう。このチュートリアルでは、Google ドライブの接続、データ取得のセットアップ、保存されたドキュメントやファイルを使用して自動化を強化する方法を説明します。エージェントとリアルタイムで重要なデータを同期するのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cRoRr4b-EAs"
  title="SimでGoogle ドライブツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Google ドライブでは、次のことができます：

- **クラウドにファイルを保存**：インターネットアクセスがあればどこからでもファイルをアップロードしてアクセス可能
- **コンテンツを整理**：フォルダの作成、カラーコーディングの使用、命名規則の実装
- **共有とコラボレーション**：アクセス権限を制御し、ファイルで同時に作業
- **効率的な検索**：Googleの強力な検索技術でファイルをすばやく見つける
- **複数デバイスでのアクセス**：デスクトップ、モバイル、WebプラットフォームでGoogle ドライブを使用
- **他のサービスとの統合**：Google ドキュメント、スプレッドシート、スライド、サードパーティアプリケーションと連携

Simでは、Google Drive統合により、エージェントがプログラム的にクラウドストレージと直接やり取りすることができます。これにより、ファイル管理、コンテンツ整理、ドキュメントワークフローなどの強力な自動化シナリオが可能になります。エージェントは特定のフォルダに新しいファイルをアップロードしたり、既存のファイルをダウンロードしてその内容を処理したり、フォルダの内容を一覧表示してストレージ構造をナビゲートしたりできます。この統合により、AIワークフローとドキュメント管理システムの間のギャップが埋まり、手動介入なしでシームレスなファイル操作が可能になります。SimとGoogle Driveを接続することで、ファイルベースのワークフローを自動化し、ドキュメントをインテリジェントに管理し、クラウドストレージ操作をエージェントの機能に組み込むことができます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Google Driveをワークフローに統合します。ファイルの作成、アップロード、一覧表示が可能です。OAuthが必要です。

## ツール

### `google_drive_upload`

ファイルをGoogle Driveにアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | はい | アップロードするファイルの名前 |
| `file` | file | いいえ | アップロードするバイナリファイル（UserFileオブジェクト） |
| `content` | string | いいえ | アップロードするテキストコンテンツ（fileかこちらのどちらか一方を使用、両方は不可） |
| `mimeType` | string | いいえ | アップロードするファイルのMIMEタイプ（指定がない場合はファイルから自動検出） |
| `folderSelector` | string | いいえ | ファイルをアップロードするフォルダを選択 |
| `folderId` | string | いいえ | ファイルをアップロードするフォルダのID（内部使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | json | ID、名前、リンクを含むアップロードされたファイルのメタデータ |

### `google_drive_create_folder`

Google Driveに新しいフォルダを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | はい | 作成するフォルダの名前 |
| `folderSelector` | string | いいえ | フォルダを作成する親フォルダを選択 |
| `folderId` | string | いいえ | 親フォルダのID（内部使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | json | 作成されたフォルダのメタデータ（ID、名前、親情報を含む） |

### `google_drive_download`

Google Driveからファイルをダウンロードする（Google Workspaceファイルは自動的にエクスポートされます）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | はい | ダウンロードするファイルのID |
| `mimeType` | string | いいえ | Google Workspaceファイルをエクスポートする際のMIMEタイプ（オプション） |
| `fileName` | string | いいえ | オプションのファイル名上書き |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | file | 実行ファイルに保存されたダウンロードファイル |

### `google_drive_list`

Google Drive内のファイルとフォルダを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | いいえ | ファイルを一覧表示するフォルダを選択 |
| `folderId` | string | いいえ | ファイルを一覧表示するフォルダのID（内部使用） |
| `query` | string | いいえ | ファイル名でフィルタリングする検索語（例：「budget」は名前に「budget」を含むファイルを検索）。ここではGoogle Driveのクエリ構文を使用しないでください - 単純な検索語を提供してください。 |
| `pageSize` | number | いいえ | 返すファイルの最大数（デフォルト：100） |
| `pageToken` | string | いいえ | ページネーションに使用するページトークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `files` | json | 指定されたフォルダからのファイルメタデータオブジェクトの配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `google_drive`
```

--------------------------------------------------------------------------------

---[FILE: google_forms.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_forms.mdx

```text
---
title: Google フォーム
description: Google フォームからの回答を読み取る
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_forms"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google フォーム](https://forms.google.com)は、ユーザーがフォームを作成し、回答を収集し、結果を分析できるGoogleのオンラインアンケートおよびフォームツールです。Googleの生産性スイートの一部として、Google フォームはユーザーから情報、フィードバック、データを簡単に収集することができます。

Simで Google フォームツールを統合して、ワークフローでフォームの回答を自動的に読み取り処理する方法を学びましょう。このチュートリアルでは、Google フォームの接続、回答の取得、収集したデータを使用して自動化を実現する方法を説明します。アンケート結果、登録情報、フィードバックをリアルタイムでエージェントと同期するのに最適です。

Google フォームでは、次のことができます：

- **アンケートやフォームの作成**: フィードバック、登録、クイズなどのカスタムフォームを設計
- **自動的に回答を収集**: リアルタイムでユーザーからデータを収集
- **結果の分析**: Google フォームで回答を確認したり、さらなる分析のためにGoogle スプレッドシートにエクスポート
- **簡単なコラボレーション**: フォームを共有し、他のユーザーと協力して質問を作成・確認
- **他のGoogleサービスとの統合**: Google スプレッドシート、ドライブなどと連携

Simでは、Google Formsの統合により、エージェントがプログラムでフォームの回答にアクセスできるようになります。これにより、アンケートデータの処理、新規提出に基づくワークフローのトリガー、フォーム結果と他のツールの同期など、強力な自動化シナリオが可能になります。エージェントはフォームのすべての回答を取得したり、特定の回答を取得したり、そのデータを使用してインテリジェントな自動化を実行したりできます。SimとGoogle Formsを接続することで、データ収集の自動化、フィードバック処理の効率化、フォーム回答のエージェント機能への組み込みが可能になります。
{/* MANUAL-CONTENT-END */}

## 使用方法

Google Formsをワークフローに統合します。フォームIDを提供して回答を一覧表示するか、レスポンスIDを指定して単一の回答を取得します。OAuthが必要です。

## ツール

### `google_forms_get_responses`

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| formId | string | はい | Google FormのID |
| responseId | string | いいえ | 提供された場合、この特定の回答を返します |
| pageSize | number | いいえ | 返す最大回答数（サービスはより少ない数を返す場合があります）。デフォルトは5000 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | json | 回答または回答のリスト |

## 注意事項

- カテゴリー: `tools`
- タイプ: `google_forms`
```

--------------------------------------------------------------------------------

---[FILE: google_groups.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_groups.mdx

```text
---
title: Google グループ
description: Google Workspace グループとそのメンバーを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_groups"
  color="#E8F0FE"
/>

## 使用方法

Google Workspaceに接続して、Admin SDK Directory APIを使用してグループとそのメンバーを作成、更新、管理します。

## ツール

### `google_groups_list_groups`

Google Workspaceドメイン内のすべてのグループを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `customer` | string | いいえ | 顧客IDまたは認証済みユーザーのドメインの場合は「my_customer」 |
| `domain` | string | いいえ | グループをフィルタリングするドメイン名 |
| `maxResults` | number | いいえ | 返す結果の最大数（1-200） |
| `pageToken` | string | いいえ | ページネーション用のトークン |
| `query` | string | いいえ | グループをフィルタリングする検索クエリ（例：「email:admin*」） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `groups` | json | グループオブジェクトの配列 |
| `nextPageToken` | string | 次のページの結果を取得するためのトークン |

### `google_groups_get_group`

メールアドレスまたはグループIDで特定のGoogle グループの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `group` | json | グループオブジェクト |

### `google_groups_create_group`

ドメイン内に新しいGoogle グループを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | 新しいグループのメールアドレス（例：team@yourdomain.com） |
| `name` | string | はい | グループの表示名 |
| `description` | string | いいえ | グループの説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `group` | json | 作成されたグループオブジェクト |

### `google_groups_update_group`

既存のGoogleグループを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `name` | string | いいえ | グループの新しい表示名 |
| `description` | string | いいえ | グループの新しい説明 |
| `email` | string | いいえ | グループの新しいメールアドレス |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `group` | json | 更新されたグループオブジェクト |

### `google_groups_delete_group`

Googleグループを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | 削除するグループのメールアドレスまたは一意のグループID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `google_groups_list_members`

Google グループのすべてのメンバーを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `maxResults` | number | いいえ | 返す結果の最大数（1-200） |
| `pageToken` | string | いいえ | ページネーション用のトークン |
| `roles` | string | いいえ | ロールによるフィルタリング（カンマ区切り: OWNER, MANAGER, MEMBER） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `members` | json | メンバーオブジェクトの配列 |
| `nextPageToken` | string | 次のページの結果を取得するためのトークン |

### `google_groups_get_member`

Google グループ内の特定のメンバーの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `memberKey` | string | はい | メンバーのメールアドレスまたは一意のメンバーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `member` | json | メンバーオブジェクト |

### `google_groups_add_member`

Google グループに新しいメンバーを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `email` | string | はい | 追加するメンバーのメールアドレス |
| `role` | string | いいえ | メンバーのロール（MEMBER、MANAGER、またはOWNER）。デフォルトはMEMBER。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `member` | json | 追加されたメンバーオブジェクト |

### `google_groups_remove_member`

Google Groupからメンバーを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `memberKey` | string | はい | 削除するメンバーのメールアドレスまたは一意のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `google_groups_update_member`

メンバーを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `memberKey` | string | はい | メンバーのメールアドレスまたは一意のメンバーID |
| `role` | string | はい | メンバーの新しい役割 \(MEMBER、MANAGER、またはOWNER\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `member` | json | 更新されたメンバーオブジェクト |

### `google_groups_has_member`

ユーザーがGoogle Groupのメンバーかどうかを確認する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupKey` | string | はい | グループのメールアドレスまたは一意のグループID |
| `memberKey` | string | はい | 確認するメンバーのメールアドレスまたは一意のメンバーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `isMember` | boolean | ユーザーがグループのメンバーであるかどうか |

## 注意事項

- カテゴリー: `tools`
- タイプ: `google_groups`
```

--------------------------------------------------------------------------------

---[FILE: google_search.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_search.mdx

```text
---
title: Google検索
description: ウェブを検索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_search"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google検索](https://www.google.com)は世界で最も広く使用されている検索エンジンで、何十億ものウェブページや情報源へのアクセスを提供しています。Google検索は高度なアルゴリズムを使用してユーザーのクエリに基づいた関連性の高い検索結果を提供し、インターネット上で情報を見つけるための必須ツールとなっています。

Simに Google検索ツールを統合して、ワークフローを通じてリアルタイムの検索結果を簡単に取得する方法を学びましょう。このチュートリアルでは、Google検索の接続、検索クエリの設定、そしてライブデータを使用して自動化を強化する方法を説明します。エージェントに最新情報を提供し、よりスマートな意思決定を可能にするのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/1B7hV9b5UMQ"
  title="SimでGoogle検索ツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Google検索では、以下のことが可能です：

- **関連情報の検索**: Googleの強力な検索アルゴリズムで何十億ものウェブページにアクセス
- **特定の結果の取得**: 検索演算子を使用してクエリを絞り込み、ターゲットを絞る
- **多様なコンテンツの発見**: テキスト、画像、動画、ニュースなど様々なコンテンツタイプを検索
- **ナレッジグラフへのアクセス**: 人物、場所、物事に関する構造化された情報を取得
- **検索機能の活用**: 計算機、単位変換器などの特殊な検索ツールを活用

Simでは、Google検索統合によりエージェントがプログラム的にウェブを検索し、検索結果をワークフローに組み込むことができます。これにより、調査、事実確認、データ収集、情報合成などの強力な自動化シナリオが可能になります。エージェントは検索クエリを作成し、関連する結果を取得し、それらの結果から情報を抽出して意思決定や洞察を生成することができます。この統合により、AIワークフローとウェブ上の膨大な情報の間のギャップが埋まり、エージェントがインターネット全体から最新の情報にアクセスできるようになります。SimとGoogle検索を接続することで、最新情報を常に把握し、事実を確認し、調査を行い、ユーザーに関連するウェブコンテンツを提供するエージェントを作成できます - すべてワークフローから離れることなく実現できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

ワークフローにGoogleサーチを統合します。ウェブ検索が可能です。APIキーが必要です。

## ツール

### `google_search`

カスタム検索APIでウェブを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 実行する検索クエリ |
| `searchEngineId` | string | はい | カスタム検索エンジンID |
| `num` | string | いいえ | 返す結果の数（デフォルト：10、最大：10） |
| `apiKey` | string | はい | Google APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `items` | array | Googleからの検索結果の配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `google_search`
```

--------------------------------------------------------------------------------

````

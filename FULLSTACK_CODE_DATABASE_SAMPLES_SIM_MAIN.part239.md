---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 239
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 239 of 933)

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

---[FILE: reddit.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/reddit.mdx

```text
---
title: Reddit
description: 访问 Reddit 数据和内容
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="reddit"
  color="#FF5700"
/>

{/* MANUAL-CONTENT-START:intro */}
[Reddit](https://www.reddit.com/) 是一个社交平台，用户可以在基于主题的社区（称为 subreddit）中分享和讨论内容。

在 Sim 中，您可以使用 Reddit 集成功能来：

- **获取帖子**：从任何 subreddit 中检索帖子，并提供排序选项（热门、新帖、顶帖、上升）以及按时间筛选顶帖（今天、本周、本月、今年、所有时间）。
- **获取评论**：从特定帖子中获取评论，并提供排序和设置评论数量的选项。

这些操作使您的代理能够访问和分析 Reddit 内容，作为自动化工作流程的一部分。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Reddit 集成到工作流程中。阅读帖子、评论和搜索内容。提交帖子、投票、回复、编辑以及管理您的 Reddit 账户。

## 工具

### `reddit_get_posts`

通过不同的排序选项从 subreddit 中获取帖子

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | 是 | 要获取帖子内容的 subreddit 名称（不包括 r/ 前缀） |
| `sort` | string | 否 | 帖子排序方法："hot"、"new"、"top" 或 "rising"（默认值："hot"） |
| `limit` | number | 否 | 返回的最大帖子数量（默认值：10，最大值：100） |
| `time` | string | 否 | "top" 排序帖子使用的时间筛选器："day"、"week"、"month"、"year" 或 "all"（默认值："day"） |
| `after` | string | 否 | 用于分页的项目后续 fullname |
| `before` | string | 否 | 用于分页的项目之前 fullname |
| `count` | number | 否 | 列表中已查看项目的计数（用于编号） |
| `show` | string | 否 | 显示通常会被过滤的项目（例如："all"） |
| `sr_detail` | boolean | 否 | 在响应中展开 subreddit 详细信息 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `subreddit` | string | 获取帖子的 subreddit 名称 |
| `posts` | array | 包含标题、作者、URL、评分、评论数量和元数据的帖子数组 |

### `reddit_get_comments`

从特定的 Reddit 帖子中获取评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `postId` | string | 是 | 要获取评论的 Reddit 帖子 ID |
| `subreddit` | string | 是 | 帖子所在的 subreddit（不包括 r/ 前缀） |
| `sort` | string | 否 | 评论排序方法："confidence"、"top"、"new"、"controversial"、"old"、"random"、"qa"（默认值："confidence"） |
| `limit` | number | 否 | 返回的最大评论数量（默认值：50，最大值：100） |
| `depth` | number | 否 | 线程中子树的最大深度（控制嵌套评论级别） |
| `context` | number | 否 | 包含的父评论数量 |
| `showedits` | boolean | 否 | 显示评论的编辑信息 |
| `showmore` | boolean | 否 | 在响应中包含 "加载更多评论" 元素 |
| `showtitle` | boolean | 否 | 在响应中包含提交标题 |
| `threaded` | boolean | 否 | 以线程/嵌套格式返回评论 |
| `truncate` | number | 否 | 截断评论深度的整数 |
| `after` | string | 否 | 用于分页的项目后续 fullname |
| `before` | string | 否 | 用于分页的项目之前 fullname |
| `count` | number | 否 | 列表中已查看项目的计数（用于编号） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `post` | object | 帖子信息，包括 ID、标题、作者、内容和元数据 |

### `reddit_get_controversial`

从 subreddit 获取有争议的帖子

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | 是 | 要从中获取帖子的 subreddit 名称（不带 r/ 前缀） |
| `time` | string | 否 | 有争议帖子的时间筛选："hour"、"day"、"week"、"month"、"year" 或 "all"（默认："all"） |
| `limit` | number | 否 | 返回帖子的最大数量（默认：10，最大：100） |
| `after` | string | 否 | 用于分页的项目后面的完整名称 |
| `before` | string | 否 | 用于分页的项目前面的完整名称 |
| `count` | number | 否 | 列表中已查看项目的计数（用于编号） |
| `show` | string | 否 | 显示通常会被过滤的项目（例如："all"） |
| `sr_detail` | boolean | 否 | 在响应中展开 subreddit 详细信息 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `subreddit` | string | 获取帖子的 subreddit 名称 |
| `posts` | array | 包含标题、作者、URL、评分、评论数量和元数据的有争议帖子数组 |

### `reddit_search`

在 subreddit 中搜索帖子

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | 是 | 要搜索的 subreddit 名称（不带 r/ 前缀） |
| `query` | string | 是 | 搜索查询文本 |
| `sort` | string | 否 | 搜索结果的排序方法："relevance"、"hot"、"top"、"new" 或 "comments"（默认值："relevance"） |
| `time` | string | 否 | 搜索结果的时间筛选："hour"、"day"、"week"、"month"、"year" 或 "all"（默认值："all"） |
| `limit` | number | 否 | 返回帖子的最大数量（默认值：10，最大值：100） |
| `restrict_sr` | boolean | 否 | 限制搜索仅在指定的 subreddit 中（默认值：true） |
| `after` | string | 否 | 用于分页的项目后续 fullname |
| `before` | string | 否 | 用于分页的项目之前 fullname |
| `count` | number | 否 | 列表中已查看项目的计数（用于编号） |
| `show` | string | 否 | 显示通常会被过滤的项目（例如："all"） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `subreddit` | string | 执行搜索的 subreddit 名称 |
| `posts` | array | 包含标题、作者、URL、评分、评论数量和元数据的搜索结果帖子数组 |

### `reddit_submit_post`

向 subreddit 提交一个新帖子（文本或链接）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | 是 | 要发布帖子的 subreddit 名称（不包括 r/ 前缀） |
| `title` | string | 是 | 提交的标题（最多 300 个字符） |
| `text` | string | 否 | 自定义帖子的文本内容（支持 markdown） |
| `url` | string | 否 | 链接帖子的 URL（不能与文本同时使用） |
| `nsfw` | boolean | 否 | 将帖子标记为 NSFW |
| `spoiler` | boolean | 否 | 将帖子标记为剧透 |
| `send_replies` | boolean | 否 | 发送回复通知到收件箱（默认值：true） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 帖子是否成功提交 |
| `message` | string | 成功或错误信息 |
| `data` | object | 帖子数据，包括 ID、名称、URL 和永久链接 |

### `reddit_vote`

对 Reddit 帖子或评论进行点赞、点踩或取消投票

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `id` | string | 是 | 要投票的对象全名（例如，帖子为 t3_xxxxx，评论为 t1_xxxxx） |
| `dir` | number | 是 | 投票方向：1（点赞），0（取消投票），或 -1（点踩） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 投票是否成功 |
| `message` | string | 成功或错误信息 |

### `reddit_save`

将 Reddit 帖子或评论保存到您的已保存项目中

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `id` | string | 是 | 要保存的对象全名（例如，帖子为 t3_xxxxx，评论为 t1_xxxxx） |
| `category` | string | 否 | 保存的分类（Reddit Gold 功能） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 保存是否成功 |
| `message` | string | 成功或错误信息 |

### `reddit_unsave`

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `subreddit` | string | Subreddit 名称 |
| `posts` | json | 帖子数据 |
| `post` | json | 单个帖子数据 |
| `comments` | json | 评论数据 |

### `reddit_reply`

为 Reddit 帖子或评论添加回复

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `parent_id` | string | 是 | 要回复的对象全名（例如，帖子为 t3_xxxxx，评论为 t1_xxxxx） |
| `text` | string | 是 | 以 markdown 格式编写的评论文本 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 回复是否成功发布 |
| `message` | string | 成功或错误信息 |
| `data` | object | 评论数据，包括 ID、名称、永久链接和正文 |

### `reddit_edit`

编辑您自己的 Reddit 帖子或评论的文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `thing_id` | string | 是 | 要编辑的事物完整名称（例如，帖子为 t3_xxxxx，评论为 t1_xxxxx） |
| `text` | string | 是 | 新的文本内容，支持 markdown 格式 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 编辑是否成功 |
| `message` | string | 成功或错误信息 |
| `data` | object | 更新后的内容数据 |

### `reddit_delete`

删除您自己的 Reddit 帖子或评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `id` | string | 是 | 要删除的事物完整名称（例如，帖子为 t3_xxxxx，评论为 t1_xxxxx） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 删除是否成功 |
| `message` | string | 成功或错误信息 |

### `reddit_subscribe`

订阅或取消订阅一个 subreddit

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | 是 | subreddit 的名称（不带 r/ 前缀） |
| `action` | string | 是 | 要执行的操作："sub" 表示订阅，"unsub" 表示取消订阅 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 订阅操作是否成功 |
| `message` | string | 成功或错误信息 |

## 注意事项

- 类别：`tools`
- 类型：`reddit`
```

--------------------------------------------------------------------------------

---[FILE: resend.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/resend.mdx

```text
---
title: Resend
description: 使用 Resend 发送电子邮件。
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="resend"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Resend](https://resend.com/) 是一项现代化的电子邮件服务，专为开发者设计，能够轻松发送事务性和营销电子邮件。它提供了一个简单可靠的 API 和仪表板，用于管理电子邮件的发送、模板和分析，使其成为在应用程序和工作流中集成电子邮件功能的热门选择。

使用 Resend，您可以：

- **发送事务性电子邮件**：以高送达率发送密码重置、通知、确认等邮件
- **管理模板**：创建和更新电子邮件模板，确保品牌和信息的一致性
- **跟踪分析**：监控送达率、打开率和点击率，以优化电子邮件表现
- **轻松集成**：使用简单的 API 和 SDK，与您的应用程序无缝集成
- **确保安全性**：通过强大的身份验证和域名验证保护您的电子邮件声誉

在 Sim 中，Resend 集成允许您的代理以编程方式发送电子邮件，作为自动化工作流的一部分。这支持诸如直接从 Sim 驱动的代理发送通知、警报或自定义消息等用例。通过将 Sim 与 Resend 连接，您可以自动化通信任务，确保及时可靠的电子邮件发送，无需人工干预。该集成利用您的 Resend API 密钥，在启用强大电子邮件自动化场景的同时，确保您的凭据安全。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Resend 集成到工作流程中。可以发送电子邮件。需要 API 密钥。

## 工具

### `resend_send`

使用您自己的 Resend API 密钥和发件地址发送电子邮件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `fromAddress` | 字符串 | 是 | 发件人电子邮件地址 |
| `to` | 字符串 | 是 | 收件人电子邮件地址 |
| `subject` | 字符串 | 是 | 电子邮件主题 |
| `body` | 字符串 | 是 | 电子邮件正文内容 |
| `contentType` | 字符串 | 否 | 电子邮件正文的内容类型（文本或 HTML） |
| `resendApiKey` | 字符串 | 是 | 用于发送电子邮件的 Resend API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 邮件是否成功发送 |
| `to` | 字符串 | 收件人电子邮件地址 |
| `subject` | 字符串 | 电子邮件主题 |
| `body` | 字符串 | 电子邮件正文内容 |

## 注意事项

- 类别：`tools`
- 类型：`resend`
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/s3.mdx

```text
---
title: S3
description: 上传、下载、列出和管理 S3 文件
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="s3"
  color="linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon S3](https://aws.amazon.com/s3/) 是由 Amazon Web Services 提供的一项高度可扩展、安全且持久的云存储服务。它旨在从网络上的任何地方存储和检索任意数量的数据，使其成为各种规模企业最广泛使用的云存储解决方案之一。

使用 Amazon S3，您可以：

- **存储无限数据**：上传任意大小和类型的文件，几乎没有存储容量限制
- **随时随地访问**：以低延迟从世界任何地方检索您的文件
- **确保数据持久性**：通过自动数据复制，享受 99.999999999%（11 个 9）的持久性
- **控制访问权限**：通过细粒度的安全策略管理权限和访问控制
- **自动扩展**：无需手动干预或容量规划即可处理不同的工作负载
- **无缝集成**：轻松连接其他 AWS 服务和第三方应用程序
- **优化成本**：根据访问模式从多种存储类别中选择以优化成本

在 Sim 中，S3 集成使您的代理能够使用安全的预签名 URL 检索和访问存储在 Amazon S3 存储桶中的文件。这支持强大的自动化场景，例如处理文档、分析存储数据、检索配置文件以及在工作流中访问媒体内容。您的代理可以安全地从 S3 获取文件，而无需暴露您的 AWS 凭证，从而轻松将云存储的资源集成到您的自动化流程中。此集成弥合了云存储与 AI 工作流之间的差距，通过 AWS 强大的身份验证机制，在保持安全最佳实践的同时，实现对存储数据的无缝访问。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 S3 集成到工作流程中。上传文件、下载对象、列出存储桶内容、删除对象以及在存储桶之间复制对象。需要 AWS 访问密钥和秘密访问密钥。

## 工具

### `s3_put_object`

将文件上传到 AWS S3 存储桶

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | 是 | 您的 AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | 您的 AWS 秘密访问密钥 |
| `region` | string | 是 | AWS 区域（例如，us-east-1） |
| `bucketName` | string | 是 | S3 存储桶名称 |
| `objectKey` | string | 是 | S3 中的对象键/路径（例如，folder/filename.ext） |
| `file` | file | 否 | 要上传的文件 |
| `content` | string | 否 | 要上传的文本内容（文件的替代选项） |
| `contentType` | string | 否 | Content-Type 头（如果未提供，将从文件中自动检测） |
| `acl` | string | 否 | 访问控制列表（例如，private, public-read） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `url` | string | 已上传 S3 对象的 URL |
| `metadata` | object | 包括 ETag 和位置的上传元数据 |

### `s3_get_object`

从 AWS S3 存储桶中检索对象

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | 是 | 您的 AWS 访问密钥 ID |
| `secretAccessKey` | string | 是 | 您的 AWS 秘密访问密钥 |
| `s3Uri` | string | 是 | S3 对象 URL |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `url` | string | 用于下载 S3 对象的预签名 URL |
| `metadata` | object | 文件元数据，包括类型、大小、名称和最后修改日期 |

### `s3_list_objects`

列出 AWS S3 存储桶中的对象

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | 是 | 您的 AWS Access Key ID |
| `secretAccessKey` | string | 是 | 您的 AWS Secret Access Key |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `bucketName` | string | 是 | S3 存储桶名称 |
| `prefix` | string | 否 | 用于过滤对象的前缀 \(例如，folder/\) |
| `maxKeys` | number | 否 | 返回的最大对象数 \(默认值：1000\) |
| `continuationToken` | string | 否 | 分页令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `objects` | array | S3 对象列表 |

### `s3_delete_object`

从 AWS S3 存储桶中删除对象

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | 是 | 您的 AWS Access Key ID |
| `secretAccessKey` | string | 是 | 您的 AWS Secret Access Key |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `bucketName` | string | 是 | S3 存储桶名称 |
| `objectKey` | string | 是 | 要删除的对象键/路径 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 对象是否已成功删除 |
| `metadata` | object | 删除元数据 |

### `s3_copy_object`

在 AWS S3 存储桶内或之间复制对象

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | 是 | 您的 AWS Access Key ID |
| `secretAccessKey` | string | 是 | 您的 AWS Secret Access Key |
| `region` | string | 是 | AWS 区域 \(例如，us-east-1\) |
| `sourceBucket` | string | 是 | 源存储桶名称 |
| `sourceKey` | string | 是 | 源对象键/路径 |
| `destinationBucket` | string | 是 | 目标存储桶名称 |
| `destinationKey` | string | 是 | 目标对象键/路径 |
| `acl` | string | 否 | 复制对象的访问控制列表 \(例如，private, public-read\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `url` | string | 复制的 S3 对象的 URL |
| `metadata` | object | 复制操作元数据 |

## 注意事项

- 类别：`tools`
- 类型：`s3`
```

--------------------------------------------------------------------------------

---[FILE: salesforce.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/salesforce.mdx

```text
---
title: Salesforce
description: 与 Salesforce CRM 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="salesforce"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Salesforce](https://www.salesforce.com/) 工具使您能够直接连接到 Salesforce CRM，并在您的代理工作流中执行广泛的客户关系管理操作。通过无缝且安全的集成，您可以高效地访问并自动化销售、支持和营销数据中的关键业务流程。

使用 Salesforce 工具，您可以：

- **检索账户**：使用 `salesforce_get_accounts` 操作从 Salesforce 中获取账户，支持自定义过滤、排序和字段选择。
- **创建账户**：通过 `salesforce_create_account` 操作自动将新账户添加到 Salesforce，指定名称、行业和账单地址等详细信息。
- **管理联系人**：如果提供类似工具，可用于联系人管理——添加、更新或根据需要获取联系人。
- **处理潜在客户和商机**：将潜在客户和商机管理集成到您的工作流中，让您的代理捕获、筛选并更新销售管道数据。
- **跟踪案例和任务**：通过与 Salesforce 中的案例和任务交互，自动化客户支持和跟进活动。

Salesforce 工具非常适合需要简化销售、账户管理、潜在客户生成和支持操作的工作流。无论您的代理是跨平台同步数据、提供实时客户洞察，还是自动化常规 CRM 更新，Salesforce 工具都能将 Salesforce 的全部功能和可扩展性引入您的程序化、代理驱动的流程中。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Salesforce 集成到您的工作流中。通过强大的自动化功能管理账户、联系人、潜在客户、商机、案例和任务。

## 工具

### `salesforce_get_accounts`

从 Salesforce CRM 检索账户

#### 输入

| 参数 | 类型 | 是否必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | Salesforce OAuth 的 ID 令牌（包含实例 URL） |
| `instanceUrl` | string | 否 | Salesforce 实例 URL |
| `limit` | string | 否 | 返回结果的数量（默认：100，最大：2000） |
| `fields` | string | 否 | 要返回的字段的逗号分隔列表（例如："Id,Name,Industry,Phone"） |
| `orderBy` | string | 否 | 排序字段（例如："Name ASC" 或 "CreatedDate DESC"） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 账户数据 |

### `salesforce_create_account`

在 Salesforce CRM 中创建一个新账户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `name` | string | 是 | 账户名称（必需） |
| `type` | string | 否 | 账户类型（例如：客户、合作伙伴、潜在客户） |
| `industry` | string | 否 | 行业（例如：科技、医疗、金融） |
| `phone` | string | 否 | 电话号码 |
| `website` | string | 否 | 网站 URL |
| `billingStreet` | string | 否 | 账单街道地址 |
| `billingCity` | string | 否 | 账单城市 |
| `billingState` | string | 否 | 账单州/省 |
| `billingPostalCode` | string | 否 | 账单邮政编码 |
| `billingCountry` | string | 否 | 账单国家 |
| `description` | string | 否 | 账户描述 |
| `annualRevenue` | string | 否 | 年收入（数字） |
| `numberOfEmployees` | string | 否 | 员工人数（数字） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的账户数据 |

### `salesforce_update_account`

更新 Salesforce CRM 中的现有账户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `accountId` | string | 是 | 要更新的账户 ID（必需） |
| `name` | string | 否 | 账户名称 |
| `type` | string | 否 | 账户类型 |
| `industry` | string | 否 | 行业 |
| `phone` | string | 否 | 电话号码 |
| `website` | string | 否 | 网站 URL |
| `billingStreet` | string | 否 | 账单街道地址 |
| `billingCity` | string | 否 | 账单城市 |
| `billingState` | string | 否 | 账单州/省 |
| `billingPostalCode` | string | 否 | 账单邮政编码 |
| `billingCountry` | string | 否 | 账单国家 |
| `description` | string | 否 | 账户描述 |
| `annualRevenue` | string | 否 | 年收入（数字） |
| `numberOfEmployees` | string | 否 | 员工人数（数字） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新后的账户数据 |

### `salesforce_delete_account`

从 Salesforce CRM 中删除账户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `accountId` | string | 是 | 要删除的账户 ID（必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 已删除的账户数据 |

### `salesforce_get_contacts`

从 Salesforce 获取联系人 - 如果提供了 ID，则返回单个联系人；如果未提供，则返回列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `contactId` | string | 否 | 联系人 ID（如果提供，则返回单个联系人） |
| `limit` | string | 否 | 返回结果数量（默认：100，最大：2000）。仅适用于列表查询。 |
| `fields` | string | 否 | 逗号分隔的字段（例如："Id,FirstName,LastName,Email,Phone"） |
| `orderBy` | string | 否 | 排序字段（例如："LastName ASC"）。仅适用于列表查询。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 联系人数据 |

### `salesforce_create_contact`

在 Salesforce CRM 中创建新联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `lastName` | string | 是 | 姓（必需） |
| `firstName` | string | 否 | 名 |
| `email` | string | 否 | 电子邮件地址 |
| `phone` | string | 否 | 电话号码 |
| `accountId` | string | 否 | 要关联的账户 ID |
| `title` | string | 否 | 无描述 |
| `department` | string | 否 | 部门 |
| `mailingStreet` | string | 否 | 邮寄街道 |
| `mailingCity` | string | 否 | 邮寄城市 |
| `mailingState` | string | 否 | 邮寄州 |
| `mailingPostalCode` | string | 否 | 邮寄邮政编码 |
| `mailingCountry` | string | 否 | 邮寄国家 |
| `description` | string | 否 | 联系人描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建的联系人数据 |

### `salesforce_update_contact`

更新 Salesforce CRM 中的现有联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `contactId` | string | 是 | 要更新的联系人 ID（必需） |
| `lastName` | string | 否 | 姓 |
| `firstName` | string | 否 | 名 |
| `email` | string | 否 | 邮箱地址 |
| `phone` | string | 否 | 电话号码 |
| `accountId` | string | 否 | 要关联的账户 ID |
| `title` | string | 否 | 无描述 |
| `department` | string | 否 | 部门 |
| `mailingStreet` | string | 否 | 邮寄街道 |
| `mailingCity` | string | 否 | 邮寄城市 |
| `mailingState` | string | 否 | 邮寄州 |
| `mailingPostalCode` | string | 否 | 邮寄邮政编码 |
| `mailingCountry` | string | 否 | 邮寄国家 |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 更新的联系人数据 |

### `salesforce_delete_contact`

从 Salesforce CRM 中删除联系人

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `contactId` | string | 是 | 要删除的联系人 ID（必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 已删除的联系人数据 |

### `salesforce_get_leads`

从 Salesforce 获取潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `leadId` | string | 否 | 潜在客户 ID（可选） |
| `limit` | string | 否 | 最大结果数（默认：100） |
| `fields` | string | 否 | 逗号分隔的字段 |
| `orderBy` | string | 否 | 排序字段 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 潜在客户数据 |

### `salesforce_create_lead`

创建新潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `lastName` | string | 是 | 姓（必需） |
| `company` | string | 是 | 公司（必需） |
| `firstName` | string | 否 | 名 |
| `email` | string | 否 | 无描述 |
| `phone` | string | 否 | 无描述 |
| `status` | string | 否 | 潜在客户状态 |
| `leadSource` | string | 否 | 潜在客户来源 |
| `title` | string | 否 | 无描述 |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 创建的潜在客户 |

### `salesforce_update_lead`

更新现有的潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `leadId` | string | 是 | 潜在客户 ID（必需） |
| `lastName` | string | 否 | 姓氏 |
| `company` | string | 否 | 无描述 |
| `firstName` | string | 否 | 名字 |
| `email` | string | 否 | 无描述 |
| `phone` | string | 否 | 无描述 |
| `status` | string | 否 | 潜在客户状态 |
| `leadSource` | string | 否 | 潜在客户来源 |
| `title` | string | 否 | 无描述 |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 更新的潜在客户 |

### `salesforce_delete_lead`

删除潜在客户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `leadId` | string | 是 | 潜在客户 ID（必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 已删除的潜在客户 |

### `salesforce_get_opportunities`

从 Salesforce 获取机会

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `opportunityId` | string | 否 | 机会 ID（可选） |
| `limit` | string | 否 | 最大结果数（默认：100） |
| `fields` | string | 否 | 逗号分隔的字段 |
| `orderBy` | string | 否 | 排序字段 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 机会数据 |

### `salesforce_create_opportunity`

创建新机会

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `name` | string | 是 | 机会名称（必需） |
| `stageName` | string | 是 | 阶段名称（必需） |
| `closeDate` | string | 是 | 关闭日期 YYYY-MM-DD（必需） |
| `accountId` | string | 否 | 账户 ID |
| `amount` | string | 否 | 金额（数字） |
| `probability` | string | 否 | 概率（0-100） |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 创建的机会 |

### `salesforce_update_opportunity`

更新现有的机会

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `opportunityId` | string | 是 | 机会 ID （必需） |
| `name` | string | 否 | 机会名称 |
| `stageName` | string | 否 | 阶段名称 |
| `closeDate` | string | 否 | 关闭日期 YYYY-MM-DD |
| `accountId` | string | 否 | 账户 ID |
| `amount` | string | 否 | 无描述 |
| `probability` | string | 否 | 概率（0-100） |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 更新的机会 |

### `salesforce_delete_opportunity`

删除一个机会

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `opportunityId` | string | 是 | 机会 ID （必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 删除的机会 |

### `salesforce_get_cases`

从 Salesforce 获取案例

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `caseId` | string | 否 | 案例 ID（可选） |
| `limit` | string | 否 | 最大结果数（默认：100） |
| `fields` | string | 否 | 逗号分隔的字段 |
| `orderBy` | string | 否 | 排序字段 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 案例数据 |

### `salesforce_create_case`

创建新案例

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `subject` | string | 是 | 案例主题（必需） |
| `status` | string | 否 | 状态（例如：新建、处理中、已升级） |
| `priority` | string | 否 | 优先级（例如：低、中、高） |
| `origin` | string | 否 | 来源（例如：电话、电子邮件、网页） |
| `contactId` | string | 否 | 联系人 ID |
| `accountId` | string | 否 | 账户 ID |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 创建的案例 |

### `salesforce_update_case`

更新现有案例

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `caseId` | string | 是 | 案例 ID（必需） |
| `subject` | string | 否 | 案例主题 |
| `status` | string | 否 | 状态 |
| `priority` | string | 否 | 优先级 |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 更新的案例 |

### `salesforce_delete_case`

删除案例

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `caseId` | string | 是 | 案例 ID（必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 已删除的案例 |

### `salesforce_get_tasks`

从 Salesforce 获取任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `taskId` | string | 否 | 任务 ID（可选） |
| `limit` | string | 否 | 最大结果数（默认：100） |
| `fields` | string | 否 | 逗号分隔的字段 |
| `orderBy` | string | 否 | 按字段排序 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 任务数据 |

### `salesforce_create_task`

创建新任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `subject` | string | 是 | 任务主题（必需） |
| `status` | string | 否 | 状态（例如：未开始、进行中、已完成） |
| `priority` | string | 否 | 优先级（例如：低、普通、高） |
| `activityDate` | string | 否 | 截止日期 YYYY-MM-DD |
| `whoId` | string | 否 | 相关联系人/潜在客户 ID |
| `whatId` | string | 否 | 相关账户/机会 ID |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 已创建的任务 |

### `salesforce_update_task`

更新现有任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `taskId` | string | 是 | 任务 ID（必需） |
| `subject` | string | 否 | 任务主题 |
| `status` | string | 否 | 状态 |
| `priority` | string | 否 | 优先级 |
| `activityDate` | string | 否 | 截止日期 YYYY-MM-DD |
| `description` | string | 否 | 描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 更新的任务 |

### `salesforce_delete_task`

删除任务

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `taskId` | string | 是 | 任务 ID（必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 已删除的任务 |

### `salesforce_list_reports`

获取当前用户可访问的报告列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `folderName` | string | 否 | 按文件夹名称筛选 |
| `searchTerm` | string | 否 | 按名称筛选报告的搜索词 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 报告数据 |

### `salesforce_get_report`

获取特定报告的元数据和描述信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `reportId` | string | 是 | 报告 ID（必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 报告元数据 |

### `salesforce_run_report`

执行报告并检索结果

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `reportId` | string | 是 | 报告 ID（必需） |
| `includeDetails` | string | 否 | 包含详细行（true/false，默认值：true） |
| `filters` | string | 否 | 要应用的报告过滤器的 JSON 字符串 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 报告结果 |

### `salesforce_list_report_types`

获取可用报告类型的列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 报告类型数据 |

### `salesforce_list_dashboards`

获取当前用户可访问的仪表板列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `folderName` | string | 否 | 按文件夹名称过滤 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 仪表板数据 |

### `salesforce_get_dashboard`

获取特定仪表板的详细信息和结果

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `dashboardId` | string | 是 | 仪表板 ID （必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 仪表板数据 |

### `salesforce_refresh_dashboard`

刷新仪表板以获取最新数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `dashboardId` | string | 是 | 仪表板 ID （必需） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 刷新后的仪表板数据 |

### `salesforce_query`

执行自定义 SOQL 查询以从 Salesforce 检索数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `query` | string | 是 | 要执行的 SOQL 查询（例如：SELECT Id, Name FROM Account LIMIT 10） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 查询结果 |

### `salesforce_query_more`

使用上一次查询的 nextRecordsUrl 检索更多查询结果

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `nextRecordsUrl` | string | 是 | 上一次查询响应中的 nextRecordsUrl |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 查询结果 |

### `salesforce_describe_object`

获取 Salesforce 对象的元数据和字段信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |
| `objectName` | string | 是 | 对象的 API 名称（例如：Account、Contact、Lead、Custom_Object__c） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 对象元数据 |

### `salesforce_list_objects`

获取所有可用的 Salesforce 对象列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | 否 | 无描述 |
| `instanceUrl` | string | 否 | 无描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功状态 |
| `output` | object | 对象列表 |

## 注意事项

- 类别：`tools`
- 类型：`salesforce`
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/schedule.mdx

```text
---
title: 计划
description: 按计划触发工作流执行
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="schedule"
  color="#7B68EE"
/>

## 使用说明

将 Schedule 集成到工作流程中。可以根据计划配置触发工作流程。

## 注意事项

- 类别：`triggers`
- 类型：`schedule`
```

--------------------------------------------------------------------------------

---[FILE: search.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/search.mdx

```text
---
title: 搜索
description: 搜索网络（每次搜索 $0.01）
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="search"
  color="#3B82F6"
/>

{/* MANUAL-CONTENT-START:intro */}
**搜索**工具让您可以在 Sim 工作流中使用最先进的搜索引擎进行网络搜索。使用它可以将最新的信息、新闻、事实和网络内容直接引入您的代理、自动化或对话中。

- **通用网络搜索**：从互联网获取最新信息以补充您的工作流。
- **自动化查询**：让代理或程序逻辑提交搜索查询并自动处理结果。
- **结构化结果**：返回最相关的网络结果，包括每个结果的标题、链接、摘要和日期。

> **注意：** 每次搜索费用为 **$0.01**。

此工具非常适合任何需要访问实时网络数据的工作流，或需要参考当前事件、进行研究或获取补充内容的场景。
{/* MANUAL-CONTENT-END */}

## 使用说明

使用搜索工具进行网络搜索。每次搜索费用为 $0.01。

## 工具

### `search_tool`

搜索网络。返回最相关的网络结果，包括每个结果的标题、链接、摘要和日期。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 搜索查询 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | json | 搜索结果 |
| `query` | string | 搜索查询 |
| `totalResults` | number | 结果总数 |
| `source` | string | 搜索来源（例如） |
| `cost` | json | 成本信息（$0.01） |

## 注意

- 类别：`tools`
- 类型：`search`
```

--------------------------------------------------------------------------------

````

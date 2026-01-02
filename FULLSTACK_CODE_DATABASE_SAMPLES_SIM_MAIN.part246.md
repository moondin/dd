---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 246
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 246 of 933)

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

---[FILE: wordpress.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/wordpress.mdx

```text
---
title: WordPress
description: 管理 WordPress 内容
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wordpress"
  color="#21759B"
/>

{/* MANUAL-CONTENT-START:intro */}
[WordPress](https://wordpress.org/) 是全球领先的开源内容管理系统，使发布和管理网站、博客以及各种在线内容变得简单。通过 WordPress，您可以创建和更新文章或页面，使用分类和标签组织内容，管理媒体文件，审核评论，以及处理用户账户——从个人博客到复杂的企业网站都可以轻松运行。

Sim 与 WordPress 的集成让您的代理可以自动化处理重要的网站任务。您可以通过编程方式创建具有特定标题、内容、分类、标签和特色图片的新博客文章。更新现有文章（例如更改其内容、标题或发布状态）也非常简单。您还可以发布或保存内容为草稿，管理静态页面，处理媒体上传，监督评论，并将内容分配到相关的组织分类中。

通过将 WordPress 连接到您的自动化流程，Sim 使您的代理能够简化内容发布、编辑工作流程和日常网站管理——帮助您无需手动操作即可保持网站的新鲜、有序和安全。
{/* MANUAL-CONTENT-END */}

## 使用说明

集成 WordPress 以创建、更新和管理文章、页面、媒体、评论、分类、标签和用户。支持通过 OAuth 认证的 WordPress.com 网站以及使用应用密码认证的自托管 WordPress 网站。

## 工具

### `wordpress_create_post`

在 WordPress.com 中创建一篇新博客文章

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 网站 ID 或域名 \(例如，12345678 或 mysite.wordpress.com\) |
| `title` | string | 是 | 文章标题 |
| `content` | string | 否 | 文章内容 \(HTML 或纯文本\) |
| `status` | string | 否 | 文章状态：publish, draft, pending, private, 或 future |
| `excerpt` | string | 否 | 文章摘要 |
| `categories` | string | 否 | 逗号分隔的分类 ID |
| `tags` | string | 否 | 逗号分隔的标签 ID |
| `featuredMedia` | number | 否 | 特色图片媒体 ID |
| `slug` | string | 否 | 文章的 URL slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `post` | object | 创建的文章 |

### `wordpress_update_post`

更新 WordPress.com 中的现有博客文章

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `postId` | number | 是 | 要更新的文章 ID |
| `title` | string | 否 | 文章标题 |
| `content` | string | 否 | 文章内容 \(HTML 或纯文本\) |
| `status` | string | 否 | 文章状态：发布、草稿、待审核、私密或未来 |
| `excerpt` | string | 否 | 文章摘要 |
| `categories` | string | 否 | 逗号分隔的分类 ID |
| `tags` | string | 否 | 逗号分隔的标签 ID |
| `featuredMedia` | number | 否 | 特色图片媒体 ID |
| `slug` | string | 否 | 文章的 URL slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `post` | object | 更新的文章 |

### `wordpress_delete_post`

从 WordPress.com 删除博客文章

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `postId` | number | 是 | 要删除的文章 ID |
| `force` | boolean | 否 | 跳过回收站并永久删除 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 帖子是否已被删除 |
| `post` | object | 已删除的帖子 |

### `wordpress_get_post`

通过 ID 从 WordPress.com 获取单个博客帖子

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `postId` | number | 是 | 要检索的帖子 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `post` | object | 检索到的帖子 |

### `wordpress_list_posts`

从 WordPress.com 列出博客帖子并可选添加筛选条件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `perPage` | number | 否 | 每页帖子数量 \(默认值：10，最大值：100\) |
| `page` | number | 否 | 分页的页码 |
| `status` | string | 否 | 帖子状态筛选：publish, draft, pending, private |
| `author` | number | 否 | 按作者 ID 筛选 |
| `categories` | string | 否 | 按逗号分隔的分类 ID 筛选 |
| `tags` | string | 否 | 按逗号分隔的标签 ID 筛选 |
| `search` | string | 否 | 用搜索词筛选帖子 |
| `orderBy` | string | 否 | 按字段排序：date, id, title, slug, modified |
| `order` | string | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `posts` | 数组 | 帖子列表 |

### `wordpress_create_page`

在 WordPress.com 中创建新页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `title` | 字符串 | 是 | 页面标题 |
| `content` | 字符串 | 否 | 页面内容 \(HTML 或纯文本\) |
| `status` | 字符串 | 否 | 页面状态：发布、草稿、待定、私密 |
| `excerpt` | 字符串 | 否 | 页面摘要 |
| `parent` | 数字 | 否 | 分层页面的父页面 ID |
| `menuOrder` | 数字 | 否 | 页面菜单中的顺序 |
| `featuredMedia` | 数字 | 否 | 特色图片媒体 ID |
| `slug` | 字符串 | 否 | 页面 URL slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `page` | 对象 | 创建的页面 |

### `wordpress_update_page`

更新 WordPress.com 中的现有页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `pageId` | 数字 | 是 | 要更新页面的 ID |
| `title` | 字符串 | 否 | 页面标题 |
| `content` | 字符串 | 否 | 页面内容 \(HTML 或纯文本\) |
| `status` | 字符串 | 否 | 页面状态：发布、草稿、待定、私密 |
| `excerpt` | 字符串 | 否 | 页面摘要 |
| `parent` | 数字 | 否 | 分层页面的父页面 ID |
| `menuOrder` | 数字 | 否 | 页面菜单中的顺序 |
| `featuredMedia` | 数字 | 否 | 特色图片媒体 ID |
| `slug` | 字符串 | 否 | 页面 URL slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `page` | object | 更新后的页面 |

### `wordpress_delete_page`

从 WordPress.com 删除页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `pageId` | number | 是 | 要删除的页面 ID |
| `force` | boolean | 否 | 跳过回收站并永久删除 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 页面是否已删除 |
| `page` | object | 已删除的页面 |

### `wordpress_get_page`

通过 ID 从 WordPress.com 获取单个页面

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `pageId` | number | 是 | 要检索的页面 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `page` | object | 检索到的页面 |

### `wordpress_list_pages`

从 WordPress.com 列出页面并可选添加筛选条件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `perPage` | number | 否 | 每次请求的页面数量 \(默认值：10，最大值：100\) |
| `page` | number | 否 | 分页的页码 |
| `status` | string | 否 | 页面状态筛选：publish, draft, pending, private |
| `parent` | number | 否 | 按父页面 ID 筛选 |
| `search` | string | 否 | 用于筛选页面的搜索词 |
| `orderBy` | string | 否 | 按字段排序：date, id, title, slug, modified, menu_order |
| `order` | string | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `pages` | 数组 | 页面列表 |

### `wordpress_upload_media`

上传媒体文件（图片、视频、文档）到 WordPress.com

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `file` | file | 否 | 要上传的文件 \(UserFile 对象\) |
| `filename` | string | 否 | 可选的文件名覆盖 \(例如：image.jpg\) |
| `title` | string | 否 | 媒体标题 |
| `caption` | string | 否 | 媒体说明 |
| `altText` | string | 否 | 用于无障碍的替代文本 |
| `description` | string | 否 | 媒体描述 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `media` | 对象 | 上传的媒体项 |

### `wordpress_get_media`

通过 ID 从 WordPress.com 获取单个媒体项

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名（例如：12345678 或 mysite.wordpress.com） |
| `mediaId` | 数字 | 是 | 要检索的媒体项 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `media` | 对象 | 检索到的媒体项 |

### `wordpress_list_media`

列出 WordPress.com 媒体库中的媒体项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名（例如：12345678 或 mysite.wordpress.com） |
| `perPage` | number | 否 | 每次请求的媒体项目数量（默认：10，最大值：100） |
| `page` | number | 否 | 分页的页码 |
| `search` | string | 否 | 用于筛选媒体的搜索词 |
| `mediaType` | string | 否 | 按媒体类型筛选：image, video, audio, application |
| `mimeType` | string | 否 | 按特定 MIME 类型筛选（例如：image/jpeg） |
| `orderBy` | string | 否 | 按字段排序：date, id, title, slug |
| `order` | string | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `media` | array | 媒体项目列表 |

### `wordpress_delete_media`

从 WordPress.com 删除媒体项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名（例如：12345678 或 mysite.wordpress.com） |
| `mediaId` | number | 是 | 要删除的媒体项目 ID |
| `force` | boolean | 否 | 强制删除（媒体没有回收站，因此删除是永久性的） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | 布尔值 | 媒体是否已被删除 |
| `media` | 对象 | 被删除的媒体项 |

### `wordpress_create_comment`

在 WordPress.com 的文章上创建新评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `postId` | 数字 | 是 | 要评论的文章 ID |
| `content` | 字符串 | 是 | 评论内容 |
| `parent` | 数字 | 否 | 回复的父评论 ID |
| `authorName` | 字符串 | 否 | 评论作者显示名称 |
| `authorEmail` | 字符串 | 否 | 评论作者邮箱 |
| `authorUrl` | 字符串 | 否 | 评论作者 URL |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `comment` | 对象 | 创建的评论 |

### `wordpress_list_comments`

从 WordPress.com 列出评论并可选添加筛选条件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `perPage` | 数字 | 否 | 每次请求的评论数量 \(默认：10，最大：100\) |
| `page` | 数字 | 否 | 分页的页码 |
| `postId` | 数字 | 否 | 按文章 ID 筛选 |
| `status` | 字符串 | 否 | 按评论状态筛选：approved, hold, spam, trash |
| `search` | 字符串 | 否 | 筛选评论的搜索词 |
| `orderBy` | 字符串 | 否 | 按字段排序：date, id, parent |
| `order` | 字符串 | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `comments` | array | 评论列表 |

### `wordpress_update_comment`

更新 WordPress.com 中的评论（内容或状态）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `commentId` | number | 是 | 要更新的评论 ID |
| `content` | string | 否 | 更新后的评论内容 |
| `status` | string | 否 | 评论状态：approved, hold, spam, trash |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `comment` | object | 更新后的评论 |

### `wordpress_delete_comment`

从 WordPress.com 删除评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `commentId` | number | 是 | 要删除的评论 ID |
| `force` | boolean | 否 | 跳过回收站并永久删除 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 评论是否已删除 |
| `comment` | object | 已删除的评论 |

### `wordpress_create_category`

在 WordPress.com 中创建新分类

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `name` | string | 是 | 分类名称 |
| `description` | string | 否 | 分类描述 |
| `parent` | number | 否 | 层级分类的父分类 ID |
| `slug` | string | 否 | 分类的 URL slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `category` | object | 创建的分类 |

### `wordpress_list_categories`

从 WordPress.com 列出分类

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `perPage` | number | 否 | 每次请求的分类数量 \(默认：10，最大：100\) |
| `page` | number | 否 | 分页的页码 |
| `search` | string | 否 | 用于筛选分类的搜索词 |
| `order` | string | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `categories` | array | 分类列表 |

### `wordpress_create_tag`

在 WordPress.com 中创建新标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `name` | string | 是 | 标签名称 |
| `description` | string | 否 | 标签描述 |
| `slug` | string | 否 | 标签的 URL slug |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tag` | object | 创建的标签 |

### `wordpress_list_tags`

从 WordPress.com 列出标签

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `perPage` | number | 否 | 每次请求的标签数量 \(默认：10，最大：100\) |
| `page` | number | 否 | 分页的页码 |
| `search` | string | 否 | 用于筛选标签的搜索词 |
| `order` | string | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tags` | array | 标签列表 |

### `wordpress_get_current_user`

获取当前已认证的 WordPress.com 用户信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 当前用户 |

### `wordpress_list_users`

从 WordPress.com 列出用户（需要管理员权限）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `perPage` | number | 否 | 每次请求的用户数量 \(默认：10，最大：100\) |
| `page` | number | 否 | 分页的页码 |
| `search` | string | 否 | 用于筛选用户的搜索词 |
| `roles` | string | 否 | 用于筛选的逗号分隔角色名称 |
| `order` | string | 否 | 排序方向：asc 或 desc |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `users` | 数组 | 用户列表 |

### `wordpress_get_user`

通过 ID 从 WordPress.com 获取特定用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `userId` | 数字 | 是 | 要检索的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | 对象 | 检索到的用户 |

### `wordpress_search_content`

在 WordPress.com 中搜索所有内容类型（文章、页面、媒体）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | 字符串 | 是 | WordPress.com 站点 ID 或域名 \(例如：12345678 或 mysite.wordpress.com\) |
| `query` | 字符串 | 是 | 搜索查询 |
| `perPage` | 数字 | 否 | 每次请求的结果数量 \(默认值：10，最大值：100\) |
| `page` | 数字 | 否 | 分页的页码 |
| `type` | 字符串 | 否 | 按内容类型过滤：post、page、attachment |
| `subtype` | 字符串 | 否 | 按文章类型 slug 过滤 \(例如：post、page\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | 数组 | 搜索结果 |

## 注意事项

- 类别：`tools`
- 类型：`wordpress`
```

--------------------------------------------------------------------------------

---[FILE: x.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/x.mdx

```text
---
title: X
description: 与 X 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="x"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[X](https://x.com/)（前身为 Twitter）是一个流行的社交媒体平台，能够实现实时通信、内容分享以及与全球受众的互动。

Sim 中的 X 集成利用 OAuth 认证与 X API 安全连接，使您的代理能够以编程方式与该平台互动。此 OAuth 实现确保在维护用户隐私和安全的同时，安全访问 X 的功能。

通过 X 集成，您的代理可以：

- **发布内容**：直接从您的工作流中创建新推文、回复现有对话或分享媒体
- **监控对话**：跟踪提及、关键词或特定账户，了解相关讨论
- **与受众互动**：自动回复提及、私信或特定触发器
- **分析趋势**：从热门话题、标签或用户参与模式中收集洞察
- **研究信息**：搜索特定内容、用户资料或对话，为代理决策提供信息

在 Sim 中，X 集成支持复杂的社交媒体自动化场景。您的代理可以监控品牌提及并作出适当回应，根据特定触发器安排和发布内容，进行市场研究的社交聆听，或创建跨越对话式 AI 和社交媒体互动的体验。通过 OAuth 将 Sim 与 X 连接，您可以构建智能代理，在保持一致和响应迅速的社交媒体存在的同时，遵守平台政策和 API 使用的最佳实践。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 X 集成到工作流程中。可以发布新推文、获取推文详情、搜索推文以及获取用户资料。需要 OAuth。

## 工具

### `x_write`

在 X（Twitter）上发布新推文、回复推文或创建投票

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 推文的文本内容 |
| `replyTo` | string | 否 | 要回复的推文 ID |
| `mediaIds` | array | 否 | 要附加到推文的媒体 ID 数组 |
| `poll` | object | 否 | 推文的投票配置 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tweet` | object | 新创建的推文数据 |

### `x_read`

读取推文详情，包括回复和对话上下文

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `tweetId` | string | 是 | 要读取的推文 ID |
| `includeReplies` | boolean | 否 | 是否包含推文的回复 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tweet` | object | 主推文数据 |

### `x_search`

使用关键词、标签或高级查询搜索推文

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 搜索查询（支持 X 搜索操作符） |
| `maxResults` | number | 否 | 返回的最大结果数（默认：10，最大：100） |
| `startTime` | string | 否 | 搜索的开始时间（ISO 8601 格式） |
| `endTime` | string | 否 | 搜索的结束时间（ISO 8601 格式） |
| `sortOrder` | string | 否 | 结果的排序顺序（按时间或相关性） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tweets` | 数组 | 符合搜索查询的推文数组 |

### `x_user`

获取用户资料信息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `username` | 字符串 | 是 | 要查找的用户名（不含 @ 符号） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | 对象 | X 用户资料信息 |

## 注意

- 分类：`tools`
- 类型：`x`
```

--------------------------------------------------------------------------------

---[FILE: youtube.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/youtube.mdx

```text
---
title: YouTube
description: 与 YouTube 视频、频道和播放列表互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="youtube"
  color="#FF0000"
/>

{/* MANUAL-CONTENT-START:intro */}
[YouTube](https://www.youtube.com/) 是全球最大的视频分享平台，拥有数十亿个视频，并为超过 20 亿的登录月活跃用户提供服务。

通过 YouTube 的强大 API 功能，您可以：

- **搜索内容**：使用特定关键词、过滤器和参数，在 YouTube 的庞大视频库中找到相关视频
- **访问元数据**：获取视频的详细信息，包括标题、描述、观看次数和互动指标
- **分析趋势**：识别特定类别或地区内的热门内容和趋势话题
- **提取洞察**：收集关于观众偏好、内容表现和互动模式的数据

在 Sim 中，YouTube 集成使您的代理能够以编程方式搜索和分析 YouTube 内容，作为其工作流程的一部分。这为需要最新视频信息的强大自动化场景提供了可能。您的代理可以搜索教学视频、研究内容趋势、从教育频道收集信息，或监控特定创作者的新上传内容。此集成弥合了您的 AI 工作流程与全球最大视频库之间的差距，使自动化更加复杂且内容感知。通过将 Sim 与 YouTube 连接，您可以创建能够跟上最新信息的代理，提供更准确的响应，并为用户带来更多价值——这一切都无需人工干预或自定义代码。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 YouTube 集成到工作流程中。可以搜索视频、获取视频详情、获取频道信息、获取频道中的所有视频、获取频道播放列表、获取播放列表项目、查找相关视频以及获取视频评论。

## 工具

### `youtube_search`

使用 YouTube Data API 在 YouTube 上搜索视频。支持通过频道、日期范围、时长、类别、质量、字幕等进行高级筛选。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | YouTube 视频的搜索查询 |
| `maxResults` | 数字 | 否 | 返回视频的最大数量 \(1-50\) |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |
| `channelId` | 字符串 | 否 | 将结果筛选为特定的 YouTube 频道 ID |
| `publishedAfter` | 字符串 | 否 | 仅返回此日期之后发布的视频 \(RFC 3339 格式: "2024-01-01T00:00:00Z"\) |
| `publishedBefore` | 字符串 | 否 | 仅返回此日期之前发布的视频 \(RFC 3339 格式: "2024-01-01T00:00:00Z"\) |
| `videoDuration` | 字符串 | 否 | 按视频时长筛选: "short" \(&lt;4 分钟\), "medium" \(4-20 分钟\), "long" \(&gt;20 分钟\), "any" |
| `order` | 字符串 | 否 | 按以下方式排序结果: "date", "rating", "relevance" \(默认\), "title", "videoCount", "viewCount" |
| `videoCategoryId` | 字符串 | 否 | 按 YouTube 类别 ID 筛选 \(例如: "10" 表示音乐, "20" 表示游戏\) |
| `videoDefinition` | 字符串 | 否 | 按视频质量筛选: "high" \(高清\), "standard", "any" |
| `videoCaption` | 字符串 | 否 | 按字幕可用性筛选: "closedCaption" \(有字幕\), "none" \(无字幕\), "any" |
| `regionCode` | 字符串 | 否 | 返回与特定地区相关的结果 \(ISO 3166-1 alpha-2 国家代码, 例如: "US", "GB"\) |
| `relevanceLanguage` | 字符串 | 否 | 返回与特定语言最相关的结果 \(ISO 639-1 代码, 例如: "en", "es"\) |
| `safeSearch` | 字符串 | 否 | 内容过滤级别: "moderate" \(默认\), "none", "strict" |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | 数组 | 匹配搜索查询的 YouTube 视频数组 |

### `youtube_video_details`

获取特定 YouTube 视频的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `videoId` | 字符串 | 是 | YouTube 视频 ID |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `videoId` | 字符串 | YouTube 视频 ID |
| `title` | 字符串 | 视频标题 |
| `description` | 字符串 | 视频描述 |
| `channelId` | 字符串 | 频道 ID |
| `channelTitle` | 字符串 | 频道名称 |
| `publishedAt` | 字符串 | 发布日期和时间 |
| `duration` | 字符串 | 视频时长（ISO 8601 格式） |
| `viewCount` | 数字 | 查看次数 |
| `likeCount` | 数字 | 点赞次数 |
| `commentCount` | 数字 | 评论数量 |
| `thumbnail` | 字符串 | 视频缩略图 URL |
| `tags` | 数组 | 视频标签 |

### `youtube_channel_info`

获取 YouTube 频道的详细信息。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `channelId` | 字符串 | 否 | YouTube 频道 ID \(使用 channelId 或 username\) |
| `username` | 字符串 | 否 | YouTube 频道用户名 \(使用 channelId 或 username\) |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `channelId` | 字符串 | YouTube 频道 ID |
| `title` | 字符串 | 频道名称 |
| `description` | 字符串 | 频道描述 |
| `subscriberCount` | 数字 | 订阅者数量 |
| `videoCount` | 数字 | 视频数量 |
| `viewCount` | 数字 | 频道总观看次数 |
| `publishedAt` | 字符串 | 频道创建日期 |
| `thumbnail` | 字符串 | 频道缩略图 URL |
| `customUrl` | 字符串 | 频道自定义 URL |

### `youtube_channel_videos`

从特定的 YouTube 频道获取所有视频，并提供排序选项。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `channelId` | 字符串 | 是 | 要获取视频的 YouTube 频道 ID |
| `maxResults` | 数字 | 否 | 返回视频的最大数量 \(1-50\) |
| `order` | 字符串 | 否 | 排序顺序："date" \(最新优先\)、"rating"、"relevance"、"title"、"viewCount" |
| `pageToken` | 字符串 | 否 | 分页的页面令牌 |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | 数组 | 来自频道的视频数组 |

### `youtube_channel_playlists`

从特定的 YouTube 频道获取所有播放列表。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `channelId` | 字符串 | 是 | 要获取播放列表的 YouTube 频道 ID |
| `maxResults` | 数字 | 否 | 返回播放列表的最大数量 \(1-50\) |
| `pageToken` | 字符串 | 否 | 分页的页面令牌 |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | 数组 | 来自频道的播放列表数组 |

### `youtube_playlist_items`

从 YouTube 播放列表中获取视频。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `playlistId` | 字符串 | 是 | YouTube 播放列表 ID |
| `maxResults` | 数字 | 否 | 返回视频的最大数量 |
| `pageToken` | 字符串 | 否 | 分页的页面令牌 |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | 数组 | 播放列表中的视频数组 |

### `youtube_comments`

从 YouTube 视频获取评论。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `videoId` | 字符串 | 是 | YouTube 视频 ID |
| `maxResults` | 数字 | 否 | 返回评论的最大数量 |
| `order` | 字符串 | 否 | 评论排序方式：时间或相关性 |
| `pageToken` | 字符串 | 否 | 分页的页面令牌 |
| `apiKey` | 字符串 | 是 | YouTube API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | 数组 | 视频中的评论数组 |

## 注意事项

- 类别：`tools`
- 类型：`youtube`
```

--------------------------------------------------------------------------------

---[FILE: zendesk.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/zendesk.mdx

```text
---
title: Zendesk
description: 在 Zendesk 中管理支持工单、用户和组织
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zendesk"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zendesk](https://www.zendesk.com/) 是一个领先的客户服务和支持平台，通过一套强大的工具和 API，帮助组织高效管理支持工单、用户和组织。Sim 中的 Zendesk 集成让您的客服人员能够自动化关键支持操作，并将支持数据与您的工作流程的其余部分同步。

在 Sim 中使用 Zendesk，您可以：

- **管理工单：**
  - 使用高级过滤和排序功能检索支持工单列表。
  - 获取单个工单的详细信息以进行跟踪和解决。
  - 单独或批量创建新工单，以编程方式记录客户问题。
  - 更新工单或应用批量更新以简化复杂的工作流程。
  - 在问题解决或出现重复时删除或合并工单。

- **用户管理：**
  - 检索用户列表或按条件搜索用户，以保持客户和客服目录的最新状态。
  - 获取单个用户或当前登录用户的详细信息。
  - 创建新用户或批量入职用户，自动化客户和客服的配置。
  - 更新或批量更新用户详细信息，以确保信息的准确性。
  - 根据需要删除用户，以满足隐私或账户管理需求。

- **组织管理：**
  - 列出、搜索和自动补全组织，以简化支持和账户管理。
  - 获取组织详细信息，保持数据库井然有序。
  - 创建、更新或删除组织，以反映客户群的变化。
  - 执行批量组织创建，以支持大规模入职工作。

- **高级搜索与分析：**
  - 使用多功能搜索端点，通过任意字段快速定位工单、用户或组织。
  - 检索搜索结果的计数，为报告和分析提供支持。

通过利用 Zendesk 的 Sim 集成，您的自动化工作流程可以无缝处理支持工单分类、用户入职/离职、公司管理，并保持支持运营的顺畅运行。无论您是将支持与产品、CRM 或自动化系统集成，Sim 中的 Zendesk 工具都提供强大的编程控制能力，以大规模提供一流的支持。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Zendesk 集成到工作流程中。可以获取工单、获取单个工单、创建工单、批量创建工单、更新工单、批量更新工单、删除工单、合并工单、获取用户、获取单个用户、获取当前用户、搜索用户、创建用户、批量创建用户、更新用户、批量更新用户、删除用户、获取组织、获取单个组织、自动完成组织、创建组织、批量创建组织、更新组织、删除组织、搜索、搜索计数。

## 工具

### `zendesk_get_tickets`

从 Zendesk 检索工单列表，并可选择过滤

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 \(例如，mycompany.zendesk.com 中的 "mycompany"\) |
| `status` | string | 否 | 按状态过滤 \(new, open, pending, hold, solved, closed\) |
| `priority` | string | 否 | 按优先级过滤 \(low, normal, high, urgent\) |
| `type` | string | 否 | 按类型过滤 \(problem, incident, question, task\) |
| `assigneeId` | string | 否 | 按分配的用户 ID 过滤 |
| `organizationId` | string | 否 | 按组织 ID 过滤 |
| `sortBy` | string | 否 | 排序字段 \(created_at, updated_at, priority, status\) |
| `sortOrder` | string | 否 | 排序顺序 \(asc 或 desc\) |
| `perPage` | string | 否 | 每页结果数 \(默认: 100, 最大: 100\) |
| `page` | string | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `tickets` | array | 工单对象数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |

### `zendesk_get_ticket`

通过 ID 从 Zendesk 获取单个工单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `ticketId` | string | 是 | 要检索的工单 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ticket` | object | 工单对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_create_ticket`

在 Zendesk 中创建支持自定义字段的新工单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `subject` | string | 否 | 工单主题（可选 - 如果未提供，将自动生成） |
| `description` | string | 是 | 工单描述（第一条评论） |
| `priority` | string | 否 | 优先级（低、正常、高、紧急） |
| `status` | string | 否 | 状态（新建、打开、待处理、挂起、已解决、已关闭） |
| `type` | string | 否 | 类型（问题、事件、问题、任务） |
| `tags` | string | 否 | 逗号分隔的标签 |
| `assigneeId` | string | 否 | 分配的用户 ID |
| `groupId` | string | 否 | 组 ID |
| `requesterId` | string | 否 | 请求者用户 ID |
| `customFields` | string | 否 | 自定义字段作为 JSON 对象（例如：\{"field_id": "value"\}） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ticket` | object | 创建的工单对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_create_tickets_bulk`

一次在 Zendesk 中创建多个工单（最多 100 个）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `tickets` | string | 是 | 要创建的工单对象的 JSON 数组（最多 100 个）。每个工单应包含 subject 和 comment 属性。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobStatus` | object | 任务状态对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_update_ticket`

更新 Zendesk 中的现有工单，支持自定义字段

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `ticketId` | string | 是 | 要更新的工单 ID |
| `subject` | string | 否 | 新的工单主题 |
| `comment` | string | 否 | 向工单添加评论 |
| `priority` | string | 否 | 优先级（低、正常、高、紧急） |
| `status` | string | 否 | 状态（新建、打开、待处理、挂起、已解决、已关闭） |
| `type` | string | 否 | 类型（问题、事件、问题、任务） |
| `tags` | string | 否 | 逗号分隔的标签 |
| `assigneeId` | string | 否 | 分配的用户 ID |
| `groupId` | string | 否 | 组 ID |
| `customFields` | string | 否 | 自定义字段作为 JSON 对象 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `ticket` | object | 更新的工单对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_update_tickets_bulk`

一次性更新多个 Zendesk 工单（最多 100 个）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `ticketIds` | string | 是 | 逗号分隔的工单 ID（最多 100 个） |
| `status` | string | 否 | 所有工单的新状态 |
| `priority` | string | 否 | 所有工单的新优先级 |
| `assigneeId` | string | 否 | 所有工单的新负责人 ID |
| `groupId` | string | 否 | 所有工单的新组 ID |
| `tags` | string | 否 | 要添加到所有工单的逗号分隔标签 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobStatus` | object | 任务状态对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_delete_ticket`

从 Zendesk 删除工单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `ticketId` | string | 是 | 要删除的工单 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 删除成功 |
| `metadata` | object | 操作元数据 |

### `zendesk_merge_tickets`

将多个工单合并到目标工单中

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `targetTicketId` | string | 是 | 目标工单 ID \(工单将合并到此工单中\) |
| `sourceTicketIds` | string | 是 | 逗号分隔的源工单 ID，用于合并 |
| `targetComment` | string | 否 | 合并后添加到目标工单的评论 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobStatus` | object | 任务状态对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_get_users`

从 Zendesk 检索用户列表并可选进行筛选

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 \(例如："mycompany" 对应 mycompany.zendesk.com\) |
| `role` | string | 否 | 按角色筛选 \(end-user, agent, admin\) |
| `permissionSet` | string | 否 | 按权限集 ID 筛选 |
| `perPage` | string | 否 | 每页结果数 \(默认：100，最大：100\) |
| `page` | string | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `users` | array | 用户对象数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |

### `zendesk_get_user`

从 Zendesk 根据 ID 获取单个用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `userId` | string | 是 | 要检索的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 用户对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_get_current_user`

从 Zendesk 获取当前已认证的用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 当前用户对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_search_users`

使用查询字符串在 Zendesk 中搜索用户

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `query` | string | 否 | 搜索查询字符串 |
| `externalId` | string | 否 | 按外部 ID 搜索 |
| `perPage` | string | 否 | 每页结果数量 \(默认：100，最大：100\) |
| `page` | string | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `users` | array | 用户对象数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |

### `zendesk_create_user`

在 Zendesk 中创建新用户

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `name` | string | 是 | 用户名 |
| `userEmail` | string | 否 | 用户邮箱 |
| `role` | string | 否 | 用户角色 \(end-user, agent, admin\) |
| `phone` | string | 否 | 用户电话号码 |
| `organizationId` | string | 否 | 组织 ID |
| `verified` | string | 否 | 设置为 "true" 以跳过邮箱验证 |
| `tags` | string | 否 | 逗号分隔的标签 |
| `customFields` | string | 否 | 以 JSON 对象形式的自定义字段 \(例如：\{"field_id": "value"\}\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 创建的用户对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_create_users_bulk`

使用批量导入在 Zendesk 中创建多个用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `users` | string | 是 | 要创建的用户对象的 JSON 数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobStatus` | object | 任务状态对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_update_user`

更新 Zendesk 中的现有用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `userId` | string | 是 | 要更新的用户 ID |
| `name` | string | 否 | 新的用户名 |
| `userEmail` | string | 否 | 新的用户邮箱 |
| `role` | string | 否 | 用户角色（end-user, agent, admin） |
| `phone` | string | 否 | 用户电话号码 |
| `organizationId` | string | 否 | 组织 ID |
| `verified` | string | 否 | 设置为 "true" 以标记用户为已验证 |
| `tags` | string | 否 | 逗号分隔的标签 |
| `customFields` | string | 否 | 作为 JSON 对象的自定义字段 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `user` | object | 更新的用户对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_update_users_bulk`

使用批量更新在 Zendesk 中更新多个用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `users` | string | 是 | 要更新的用户对象的 JSON 数组（必须包含 id 字段） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobStatus` | object | 任务状态对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_delete_user`

从 Zendesk 中删除用户

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `userId` | string | 是 | 要删除的用户 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 删除成功 |
| `metadata` | object | 操作元数据 |

### `zendesk_get_organizations`

从 Zendesk 检索组织列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 \(例如，mycompany.zendesk.com 中的 "mycompany"\) |
| `perPage` | string | 否 | 每页结果数 \(默认值：100，最大值：100\) |
| `page` | string | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organizations` | array | 组织对象数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |

### `zendesk_get_organization`

通过 ID 从 Zendesk 获取单个组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `organizationId` | string | 是 | 要检索的组织 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organization` | object | 组织对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_autocomplete_organizations`

通过名称前缀（用于名称匹配/自动完成）在 Zendesk 中自动完成组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `name` | string | 是 | 要搜索的组织名称 |
| `perPage` | string | 否 | 每页结果数 \(默认值：100，最大值：100\) |
| `page` | string | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organizations` | array | 组织对象数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |

### `zendesk_create_organization`

在 Zendesk 中创建一个新组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `name` | string | 是 | 组织名称 |
| `domainNames` | string | 否 | 逗号分隔的域名 |
| `details` | string | 否 | 组织详情 |
| `notes` | string | 否 | 组织备注 |
| `tags` | string | 否 | 逗号分隔的标签 |
| `customFields` | string | 否 | 以 JSON 对象形式的自定义字段 \(例如，\{"field_id": "value"\}\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organization` | object | 创建的组织对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_create_organizations_bulk`

通过批量导入在 Zendesk 中创建多个组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `organizations` | string | 是 | 要创建的组织对象的 JSON 数组 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `jobStatus` | object | 任务状态对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_update_organization`

更新 Zendesk 中的现有组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `organizationId` | string | 是 | 要更新的组织 ID |
| `name` | string | 否 | 新的组织名称 |
| `domainNames` | string | 否 | 逗号分隔的域名 |
| `details` | string | 否 | 组织详情 |
| `notes` | string | 否 | 组织备注 |
| `tags` | string | 否 | 逗号分隔的标签 |
| `customFields` | string | 否 | JSON 对象格式的自定义字段 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `organization` | object | 更新的组织对象 |
| `metadata` | object | 操作元数据 |

### `zendesk_delete_organization`

从 Zendesk 中删除一个组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `organizationId` | string | 是 | 要删除的组织 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 删除成功 |
| `metadata` | object | 操作元数据 |

### `zendesk_search`

在 Zendesk 中统一搜索工单、用户和组织

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `query` | string | 是 | 搜索查询字符串 |
| `sortBy` | string | 否 | 排序字段 \(relevance, created_at, updated_at, priority, status, ticket_type\) |
| `sortOrder` | string | 否 | 排序顺序 \(asc 或 desc\) |
| `perPage` | string | 否 | 每页结果数 \(默认: 100, 最大: 100\) |
| `page` | string | 否 | 页码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | array | 结果对象的数组 |
| `paging` | object | 分页信息 |
| `metadata` | object | 操作元数据 |

### `zendesk_search_count`

统计在 Zendesk 中与查询匹配的搜索结果数量

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `email` | string | 是 | 您的 Zendesk 邮箱地址 |
| `apiToken` | string | 是 | Zendesk API 令牌 |
| `subdomain` | string | 是 | 您的 Zendesk 子域名 |
| `query` | string | 是 | 搜索查询字符串 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `count` | number | 匹配结果的数量 |
| `metadata` | object | 操作元数据 |

## 注意事项

- 类别: `tools`
- 类型: `zendesk`
```

--------------------------------------------------------------------------------

````

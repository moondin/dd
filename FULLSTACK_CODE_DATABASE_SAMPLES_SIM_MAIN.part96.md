---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 96
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 96 of 933)

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

---[FILE: whatsapp.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/whatsapp.mdx

```text
---
title: WhatsApp
description: Send WhatsApp messages
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="whatsapp"
  color="#25D366"
/>

{/* MANUAL-CONTENT-START:intro */}
[WhatsApp](https://www.whatsapp.com/) is a globally popular messaging platform that enables secure, reliable communication between individuals and businesses.

WhatsApp Business API provides organizations with powerful capabilities to:

- **Engage customers**: Send personalized messages, notifications, and updates directly to customers' preferred messaging app
- **Automate conversations**: Create interactive chatbots and automated response systems for common inquiries
- **Enhance support**: Provide real-time customer service through a familiar interface with rich media support
- **Drive conversions**: Facilitate transactions and follow-ups with customers in a secure, compliant environment

In Sim, the WhatsApp integration enables your agents to leverage these messaging capabilities as part of their workflows. This creates opportunities for sophisticated customer engagement scenarios like appointment reminders, verification codes, alerts, and interactive conversations. The integration bridges the gap between your AI workflows and customer communication channels, allowing your agents to deliver timely, relevant information directly to users' mobile devices. By connecting Sim with WhatsApp, you can build intelligent agents that engage customers through their preferred messaging platform, enhancing user experience while automating routine messaging tasks.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate WhatsApp into the workflow. Can send messages.



## Tools

### `whatsapp_send_message`

Send WhatsApp messages

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `phoneNumber` | string | Yes | Recipient phone number with country code |
| `message` | string | Yes | Message content to send |
| `phoneNumberId` | string | Yes | WhatsApp Business Phone Number ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | WhatsApp message send success status |
| `messageId` | string | Unique WhatsApp message identifier |
| `phoneNumber` | string | Recipient phone number |
| `status` | string | Message delivery status |
| `timestamp` | string | Message send timestamp |



## Notes

- Category: `tools`
- Type: `whatsapp`
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/wikipedia.mdx

```text
---
title: Wikipedia
description: Search and retrieve content from Wikipedia
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wikipedia"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wikipedia](https://www.wikipedia.org/) is the world's largest free online encyclopedia, offering millions of articles on a vast range of topics, collaboratively written and maintained by volunteers.

With Wikipedia, you can:

- **Search for articles**: Find relevant Wikipedia pages by searching for keywords or topics
- **Get article summaries**: Retrieve concise summaries of Wikipedia pages for quick reference
- **Access full content**: Obtain the complete content of Wikipedia articles for in-depth information
- **Discover random articles**: Explore new topics by retrieving random Wikipedia pages

In Sim, the Wikipedia integration enables your agents to programmatically access and interact with Wikipedia content as part of their workflows. Agents can search for articles, fetch summaries, retrieve full page content, and discover random articles, empowering your automations with up-to-date, reliable information from the world's largest encyclopedia. This integration is ideal for scenarios such as research, content enrichment, fact-checking, and knowledge discovery, allowing your agents to seamlessly incorporate Wikipedia data into their decision-making and task execution processes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Wikipedia into the workflow. Can get page summary, search pages, get page content, and get random page.



## Tools

### `wikipedia_summary`

Get a summary and metadata for a specific Wikipedia page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | Yes | Title of the Wikipedia page to get summary for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `summary` | object | Wikipedia page summary and metadata |

### `wikipedia_search`

Search for Wikipedia pages by title or content.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query to find Wikipedia pages |
| `searchLimit` | number | No | Maximum number of results to return \(default: 10, max: 50\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `searchResults` | array | Array of matching Wikipedia pages |

### `wikipedia_content`

Get the full HTML content of a Wikipedia page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | Yes | Title of the Wikipedia page to get content for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | object | Full HTML content and metadata of the Wikipedia page |

### `wikipedia_random`

Get a random Wikipedia page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `randomPage` | object | Random Wikipedia page data |



## Notes

- Category: `tools`
- Type: `wikipedia`
```

--------------------------------------------------------------------------------

---[FILE: wordpress.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/wordpress.mdx

```text
---
title: WordPress
description: Manage WordPress content
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wordpress"
  color="#21759B"
/>

{/* MANUAL-CONTENT-START:intro */}
[WordPress](https://wordpress.org/) is the world’s leading open-source content management system, making it easy to publish and manage websites, blogs, and all types of online content. With WordPress, you can create and update posts or pages, organize your content with categories and tags, manage media files, moderate comments, and handle user accounts—allowing you to run everything from personal blogs to complex business sites.

Sim’s integration with WordPress lets your agents automate essential website tasks. You can programmatically create new blog posts with specific titles, content, categories, tags, and featured images. Updating existing posts—such as changing their content, title, or publishing status—is straightforward. You can also publish or save content as drafts, manage static pages, work with media uploads, oversee comments, and assign content to relevant organizational taxonomies.

By connecting WordPress to your automations, Sim empowers your agents to streamline content publishing, editorial workflows, and everyday site management—helping you keep your website fresh, organized, and secure without manual effort.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate with WordPress to create, update, and manage posts, pages, media, comments, categories, tags, and users. Supports WordPress.com sites via OAuth and self-hosted WordPress sites using Application Passwords authentication.



## Tools

### `wordpress_create_post`

Create a new blog post in WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `title` | string | Yes | Post title |
| `content` | string | No | Post content \(HTML or plain text\) |
| `status` | string | No | Post status: publish, draft, pending, private, or future |
| `excerpt` | string | No | Post excerpt |
| `categories` | string | No | Comma-separated category IDs |
| `tags` | string | No | Comma-separated tag IDs |
| `featuredMedia` | number | No | Featured image media ID |
| `slug` | string | No | URL slug for the post |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | The created post |

### `wordpress_update_post`

Update an existing blog post in WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `postId` | number | Yes | The ID of the post to update |
| `title` | string | No | Post title |
| `content` | string | No | Post content \(HTML or plain text\) |
| `status` | string | No | Post status: publish, draft, pending, private, or future |
| `excerpt` | string | No | Post excerpt |
| `categories` | string | No | Comma-separated category IDs |
| `tags` | string | No | Comma-separated tag IDs |
| `featuredMedia` | number | No | Featured image media ID |
| `slug` | string | No | URL slug for the post |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | The updated post |

### `wordpress_delete_post`

Delete a blog post from WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `postId` | number | Yes | The ID of the post to delete |
| `force` | boolean | No | Bypass trash and force delete permanently |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the post was deleted |
| `post` | object | The deleted post |

### `wordpress_get_post`

Get a single blog post from WordPress.com by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `postId` | number | Yes | The ID of the post to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | The retrieved post |

### `wordpress_list_posts`

List blog posts from WordPress.com with optional filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of posts per page \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `status` | string | No | Post status filter: publish, draft, pending, private |
| `author` | number | No | Filter by author ID |
| `categories` | string | No | Comma-separated category IDs to filter by |
| `tags` | string | No | Comma-separated tag IDs to filter by |
| `search` | string | No | Search term to filter posts |
| `orderBy` | string | No | Order by field: date, id, title, slug, modified |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `posts` | array | List of posts |

### `wordpress_create_page`

Create a new page in WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `title` | string | Yes | Page title |
| `content` | string | No | Page content \(HTML or plain text\) |
| `status` | string | No | Page status: publish, draft, pending, private |
| `excerpt` | string | No | Page excerpt |
| `parent` | number | No | Parent page ID for hierarchical pages |
| `menuOrder` | number | No | Order in page menu |
| `featuredMedia` | number | No | Featured image media ID |
| `slug` | string | No | URL slug for the page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `page` | object | The created page |

### `wordpress_update_page`

Update an existing page in WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `pageId` | number | Yes | The ID of the page to update |
| `title` | string | No | Page title |
| `content` | string | No | Page content \(HTML or plain text\) |
| `status` | string | No | Page status: publish, draft, pending, private |
| `excerpt` | string | No | Page excerpt |
| `parent` | number | No | Parent page ID for hierarchical pages |
| `menuOrder` | number | No | Order in page menu |
| `featuredMedia` | number | No | Featured image media ID |
| `slug` | string | No | URL slug for the page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `page` | object | The updated page |

### `wordpress_delete_page`

Delete a page from WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `pageId` | number | Yes | The ID of the page to delete |
| `force` | boolean | No | Bypass trash and force delete permanently |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the page was deleted |
| `page` | object | The deleted page |

### `wordpress_get_page`

Get a single page from WordPress.com by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `pageId` | number | Yes | The ID of the page to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `page` | object | The retrieved page |

### `wordpress_list_pages`

List pages from WordPress.com with optional filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of pages per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `status` | string | No | Page status filter: publish, draft, pending, private |
| `parent` | number | No | Filter by parent page ID |
| `search` | string | No | Search term to filter pages |
| `orderBy` | string | No | Order by field: date, id, title, slug, modified, menu_order |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pages` | array | List of pages |

### `wordpress_upload_media`

Upload a media file (image, video, document) to WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `file` | file | No | File to upload \(UserFile object\) |
| `filename` | string | No | Optional filename override \(e.g., image.jpg\) |
| `title` | string | No | Media title |
| `caption` | string | No | Media caption |
| `altText` | string | No | Alternative text for accessibility |
| `description` | string | No | Media description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `media` | object | The uploaded media item |

### `wordpress_get_media`

Get a single media item from WordPress.com by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `mediaId` | number | Yes | The ID of the media item to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `media` | object | The retrieved media item |

### `wordpress_list_media`

List media items from the WordPress.com media library

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of media items per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `search` | string | No | Search term to filter media |
| `mediaType` | string | No | Filter by media type: image, video, audio, application |
| `mimeType` | string | No | Filter by specific MIME type \(e.g., image/jpeg\) |
| `orderBy` | string | No | Order by field: date, id, title, slug |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `media` | array | List of media items |

### `wordpress_delete_media`

Delete a media item from WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `mediaId` | number | Yes | The ID of the media item to delete |
| `force` | boolean | No | Force delete \(media has no trash, so deletion is permanent\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the media was deleted |
| `media` | object | The deleted media item |

### `wordpress_create_comment`

Create a new comment on a WordPress.com post

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `postId` | number | Yes | The ID of the post to comment on |
| `content` | string | Yes | Comment content |
| `parent` | number | No | Parent comment ID for replies |
| `authorName` | string | No | Comment author display name |
| `authorEmail` | string | No | Comment author email |
| `authorUrl` | string | No | Comment author URL |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `comment` | object | The created comment |

### `wordpress_list_comments`

List comments from WordPress.com with optional filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of comments per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `postId` | number | No | Filter by post ID |
| `status` | string | No | Filter by comment status: approved, hold, spam, trash |
| `search` | string | No | Search term to filter comments |
| `orderBy` | string | No | Order by field: date, id, parent |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `comments` | array | List of comments |

### `wordpress_update_comment`

Update a comment in WordPress.com (content or status)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `commentId` | number | Yes | The ID of the comment to update |
| `content` | string | No | Updated comment content |
| `status` | string | No | Comment status: approved, hold, spam, trash |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `comment` | object | The updated comment |

### `wordpress_delete_comment`

Delete a comment from WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `commentId` | number | Yes | The ID of the comment to delete |
| `force` | boolean | No | Bypass trash and force delete permanently |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the comment was deleted |
| `comment` | object | The deleted comment |

### `wordpress_create_category`

Create a new category in WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `name` | string | Yes | Category name |
| `description` | string | No | Category description |
| `parent` | number | No | Parent category ID for hierarchical categories |
| `slug` | string | No | URL slug for the category |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `category` | object | The created category |

### `wordpress_list_categories`

List categories from WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of categories per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `search` | string | No | Search term to filter categories |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `categories` | array | List of categories |

### `wordpress_create_tag`

Create a new tag in WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `name` | string | Yes | Tag name |
| `description` | string | No | Tag description |
| `slug` | string | No | URL slug for the tag |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tag` | object | The created tag |

### `wordpress_list_tags`

List tags from WordPress.com

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of tags per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `search` | string | No | Search term to filter tags |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tags` | array | List of tags |

### `wordpress_get_current_user`

Get information about the currently authenticated WordPress.com user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | The current user |

### `wordpress_list_users`

List users from WordPress.com (requires admin privileges)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `perPage` | number | No | Number of users per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `search` | string | No | Search term to filter users |
| `roles` | string | No | Comma-separated role names to filter by |
| `order` | string | No | Order direction: asc or desc |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | List of users |

### `wordpress_get_user`

Get a specific user from WordPress.com by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `userId` | number | Yes | The ID of the user to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | The retrieved user |

### `wordpress_search_content`

Search across all content types in WordPress.com (posts, pages, media)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | Yes | WordPress.com site ID or domain \(e.g., 12345678 or mysite.wordpress.com\) |
| `query` | string | Yes | Search query |
| `perPage` | number | No | Number of results per request \(default: 10, max: 100\) |
| `page` | number | No | Page number for pagination |
| `type` | string | No | Filter by content type: post, page, attachment |
| `subtype` | string | No | Filter by post type slug \(e.g., post, page\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Search results |



## Notes

- Category: `tools`
- Type: `wordpress`
```

--------------------------------------------------------------------------------

---[FILE: x.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/x.mdx

```text
---
title: X
description: Interact with X
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="x"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[X](https://x.com/) (formerly Twitter) is a popular social media platform that enables real-time communication, content sharing, and engagement with audiences worldwide.

The X integration in Sim leverages OAuth authentication to securely connect with the X API, allowing your agents to interact with the platform programmatically. This OAuth implementation ensures secure access to X's features while maintaining user privacy and security.

With the X integration, your agents can:

- **Post content**: Create new tweets, reply to existing conversations, or share media directly from your workflows
- **Monitor conversations**: Track mentions, keywords, or specific accounts to stay informed about relevant discussions
- **Engage with audiences**: Automatically respond to mentions, direct messages, or specific triggers
- **Analyze trends**: Gather insights from trending topics, hashtags, or user engagement patterns
- **Research information**: Search for specific content, user profiles, or conversations to inform agent decisions

In Sim, the X integration enables sophisticated social media automation scenarios. Your agents can monitor brand mentions and respond appropriately, schedule and publish content based on specific triggers, conduct social listening for market research, or create interactive experiences that span both conversational AI and social media engagement. By connecting Sim with X through OAuth, you can build intelligent agents that maintain a consistent and responsive social media presence while adhering to platform policies and best practices for API usage.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate X into the workflow. Can post a new tweet, get tweet details, search tweets, and get user profile.



## Tools

### `x_write`

Post new tweets, reply to tweets, or create polls on X (Twitter)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text content of your tweet |
| `replyTo` | string | No | ID of the tweet to reply to |
| `mediaIds` | array | No | Array of media IDs to attach to the tweet |
| `poll` | object | No | Poll configuration for the tweet |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tweet` | object | The newly created tweet data |

### `x_read`

Read tweet details, including replies and conversation context

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tweetId` | string | Yes | ID of the tweet to read |
| `includeReplies` | boolean | No | Whether to include replies to the tweet |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tweet` | object | The main tweet data |

### `x_search`

Search for tweets using keywords, hashtags, or advanced queries

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query \(supports X search operators\) |
| `maxResults` | number | No | Maximum number of results to return \(default: 10, max: 100\) |
| `startTime` | string | No | Start time for search \(ISO 8601 format\) |
| `endTime` | string | No | End time for search \(ISO 8601 format\) |
| `sortOrder` | string | No | Sort order for results \(recency or relevancy\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tweets` | array | Array of tweets matching the search query |

### `x_user`

Get user profile information

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `username` | string | Yes | Username to look up \(without @ symbol\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | X user profile information |



## Notes

- Category: `tools`
- Type: `x`
```

--------------------------------------------------------------------------------

---[FILE: youtube.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/youtube.mdx

```text
---
title: YouTube
description: Interact with YouTube videos, channels, and playlists
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="youtube"
  color="#FF0000"
/>

{/* MANUAL-CONTENT-START:intro */}
[YouTube](https://www.youtube.com/) is the world's largest video sharing platform, hosting billions of videos and serving over 2 billion logged-in monthly users.

With YouTube's extensive API capabilities, you can:

- **Search content**: Find relevant videos across YouTube's vast library using specific keywords, filters, and parameters
- **Access metadata**: Retrieve detailed information about videos including titles, descriptions, view counts, and engagement metrics
- **Analyze trends**: Identify popular content and trending topics within specific categories or regions
- **Extract insights**: Gather data about audience preferences, content performance, and engagement patterns

In Sim, the YouTube integration enables your agents to programmatically search and analyze YouTube content as part of their workflows. This allows for powerful automation scenarios that require up-to-date video information. Your agents can search for instructional videos, research content trends, gather information from educational channels, or monitor specific creators for new uploads. This integration bridges the gap between your AI workflows and the world's largest video repository, enabling more sophisticated and content-aware automations. By connecting Sim with YouTube, you can create agents that stay current with the latest information, provide more accurate responses, and deliver more value to users - all without requiring manual intervention or custom code.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate YouTube into the workflow. Can search for videos, get video details, get channel information, get all videos from a channel, get channel playlists, get playlist items, find related videos, and get video comments.



## Tools

### `youtube_search`

Search for videos on YouTube using the YouTube Data API. Supports advanced filtering by channel, date range, duration, category, quality, captions, and more.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query for YouTube videos |
| `maxResults` | number | No | Maximum number of videos to return \(1-50\) |
| `apiKey` | string | Yes | YouTube API Key |
| `channelId` | string | No | Filter results to a specific YouTube channel ID |
| `publishedAfter` | string | No | Only return videos published after this date \(RFC 3339 format: "2024-01-01T00:00:00Z"\) |
| `publishedBefore` | string | No | Only return videos published before this date \(RFC 3339 format: "2024-01-01T00:00:00Z"\) |
| `videoDuration` | string | No | Filter by video length: "short" \(&lt;4 min\), "medium" \(4-20 min\), "long" \(&gt;20 min\), "any" |
| `order` | string | No | Sort results by: "date", "rating", "relevance" \(default\), "title", "videoCount", "viewCount" |
| `videoCategoryId` | string | No | Filter by YouTube category ID \(e.g., "10" for Music, "20" for Gaming\) |
| `videoDefinition` | string | No | Filter by video quality: "high" \(HD\), "standard", "any" |
| `videoCaption` | string | No | Filter by caption availability: "closedCaption" \(has captions\), "none" \(no captions\), "any" |
| `regionCode` | string | No | Return results relevant to a specific region \(ISO 3166-1 alpha-2 country code, e.g., "US", "GB"\) |
| `relevanceLanguage` | string | No | Return results most relevant to a language \(ISO 639-1 code, e.g., "en", "es"\) |
| `safeSearch` | string | No | Content filtering level: "moderate" \(default\), "none", "strict" |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | array | Array of YouTube videos matching the search query |

### `youtube_video_details`

Get detailed information about a specific YouTube video.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `videoId` | string | Yes | YouTube video ID |
| `apiKey` | string | Yes | YouTube API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `videoId` | string | YouTube video ID |
| `title` | string | Video title |
| `description` | string | Video description |
| `channelId` | string | Channel ID |
| `channelTitle` | string | Channel name |
| `publishedAt` | string | Published date and time |
| `duration` | string | Video duration in ISO 8601 format |
| `viewCount` | number | Number of views |
| `likeCount` | number | Number of likes |
| `commentCount` | number | Number of comments |
| `thumbnail` | string | Video thumbnail URL |
| `tags` | array | Video tags |

### `youtube_channel_info`

Get detailed information about a YouTube channel.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | No | YouTube channel ID \(use either channelId or username\) |
| `username` | string | No | YouTube channel username \(use either channelId or username\) |
| `apiKey` | string | Yes | YouTube API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `channelId` | string | YouTube channel ID |
| `title` | string | Channel name |
| `description` | string | Channel description |
| `subscriberCount` | number | Number of subscribers |
| `videoCount` | number | Number of videos |
| `viewCount` | number | Total channel views |
| `publishedAt` | string | Channel creation date |
| `thumbnail` | string | Channel thumbnail URL |
| `customUrl` | string | Channel custom URL |

### `youtube_channel_videos`

Get all videos from a specific YouTube channel, with sorting options.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | Yes | YouTube channel ID to get videos from |
| `maxResults` | number | No | Maximum number of videos to return \(1-50\) |
| `order` | string | No | Sort order: "date" \(newest first\), "rating", "relevance", "title", "viewCount" |
| `pageToken` | string | No | Page token for pagination |
| `apiKey` | string | Yes | YouTube API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | array | Array of videos from the channel |

### `youtube_channel_playlists`

Get all playlists from a specific YouTube channel.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `channelId` | string | Yes | YouTube channel ID to get playlists from |
| `maxResults` | number | No | Maximum number of playlists to return \(1-50\) |
| `pageToken` | string | No | Page token for pagination |
| `apiKey` | string | Yes | YouTube API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | array | Array of playlists from the channel |

### `youtube_playlist_items`

Get videos from a YouTube playlist.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `playlistId` | string | Yes | YouTube playlist ID |
| `maxResults` | number | No | Maximum number of videos to return |
| `pageToken` | string | No | Page token for pagination |
| `apiKey` | string | Yes | YouTube API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | array | Array of videos in the playlist |

### `youtube_comments`

Get comments from a YouTube video.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `videoId` | string | Yes | YouTube video ID |
| `maxResults` | number | No | Maximum number of comments to return |
| `order` | string | No | Order of comments: time or relevance |
| `pageToken` | string | No | Page token for pagination |
| `apiKey` | string | Yes | YouTube API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `items` | array | Array of comments from the video |



## Notes

- Category: `tools`
- Type: `youtube`
```

--------------------------------------------------------------------------------

````

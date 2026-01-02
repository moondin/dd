---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 85
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 85 of 933)

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

---[FILE: qdrant.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/qdrant.mdx

```text
---
title: Qdrant
description: Use Qdrant vector database
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="qdrant"
  color="#1A223F"
/>

{/* MANUAL-CONTENT-START:intro */}
[Qdrant](https://qdrant.tech) is an open-source vector database designed for efficient storage, management, and retrieval of high-dimensional vector embeddings. Qdrant enables fast and scalable semantic search, making it ideal for AI applications that require similarity search, recommendation systems, and contextual information retrieval.

With Qdrant, you can:

- **Store vector embeddings**: Efficiently manage and persist high-dimensional vectors at scale
- **Perform semantic similarity search**: Find the most similar vectors to a query vector in real time
- **Filter and organize data**: Use advanced filtering to narrow down search results based on metadata or payload
- **Fetch specific points**: Retrieve vectors and their associated payloads by ID
- **Scale seamlessly**: Handle large collections and high-throughput workloads

In Sim, the Qdrant integration enables your agents to interact with Qdrant programmatically as part of their workflows. Supported operations include:

- **Upsert**: Insert or update points (vectors and payloads) in a Qdrant collection
- **Search**: Perform similarity search to find vectors most similar to a given query vector, with optional filtering and result customization
- **Fetch**: Retrieve specific points from a collection by their IDs, with options to include payloads and vectors

This integration allows your agents to leverage powerful vector search and management capabilities, enabling advanced automation scenarios such as semantic search, recommendation, and contextual retrieval. By connecting Sim with Qdrant, you can build agents that understand context, retrieve relevant information from large datasets, and deliver more intelligent and personalized responses—all without managing complex infrastructure.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Qdrant into the workflow. Can upsert, search, and fetch points.



## Tools

### `qdrant_upsert_points`

Insert or update points in a Qdrant collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | Qdrant base URL |
| `apiKey` | string | No | Qdrant API key \(optional\) |
| `collection` | string | Yes | Collection name |
| `points` | array | Yes | Array of points to upsert |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `status` | string | Status of the upsert operation |
| `data` | object | Result data from the upsert operation |

### `qdrant_search_vector`

Search for similar vectors in a Qdrant collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | Qdrant base URL |
| `apiKey` | string | No | Qdrant API key \(optional\) |
| `collection` | string | Yes | Collection name |
| `vector` | array | Yes | Vector to search for |
| `limit` | number | No | Number of results to return |
| `filter` | object | No | Filter to apply to the search |
| `search_return_data` | string | No | Data to return from search |
| `with_payload` | boolean | No | Include payload in response |
| `with_vector` | boolean | No | Include vector in response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | array | Vector search results with ID, score, payload, and optional vector data |
| `status` | string | Status of the search operation |

### `qdrant_fetch_points`

Fetch points by ID from a Qdrant collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | Qdrant base URL |
| `apiKey` | string | No | Qdrant API key \(optional\) |
| `collection` | string | Yes | Collection name |
| `ids` | array | Yes | Array of point IDs to fetch |
| `fetch_return_data` | string | No | Data to return from fetch |
| `with_payload` | boolean | No | Include payload in response |
| `with_vector` | boolean | No | Include vector in response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | array | Fetched points with ID, payload, and optional vector data |
| `status` | string | Status of the fetch operation |



## Notes

- Category: `tools`
- Type: `qdrant`
```

--------------------------------------------------------------------------------

---[FILE: rds.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/rds.mdx

```text
---
title: Amazon RDS
description: Connect to Amazon RDS via Data API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="rds"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon RDS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) is a fully managed relational database that automatically starts up, shuts down, and scales capacity based on your application's needs. It allows you to run SQL databases in the cloud without managing database servers.

With RDS Aurora Serverless, you can:

- **Query data**: Run flexible SQL queries across your tables
- **Insert new records**: Add data to your database automatically
- **Update existing records**: Modify data in your tables using custom filters
- **Delete records**: Remove unwanted data using precise criteria
- **Execute raw SQL**: Run any valid SQL command supported by Aurora

In Sim, the RDS integration enables your agents to work with Amazon Aurora Serverless databases securely and programmatically. Supported operations include:

- **Query**: Run SELECT and other SQL queries to fetch rows from your database
- **Insert**: Insert new records into tables with structured data
- **Update**: Change data in rows that match your specified conditions
- **Delete**: Remove records from a table by custom filters or criteria
- **Execute**: Run raw SQL for advanced scenarios

This integration allows your agents to automate a wide range of database operations without manual intervention. By connecting Sim with Amazon RDS, you can build agents that manage, update, and retrieve relational data within your workflows—all without handling database infrastructure or connections.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Amazon RDS Aurora Serverless into the workflow using the Data API. Can query, insert, update, delete, and execute raw SQL without managing database connections.



## Tools

### `rds_query`

Execute a SELECT query on Amazon RDS using the Data API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `resourceArn` | string | Yes | ARN of the Aurora DB cluster |
| `secretArn` | string | Yes | ARN of the Secrets Manager secret containing DB credentials |
| `database` | string | No | Database name \(optional\) |
| `query` | string | Yes | SQL SELECT query to execute |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of rows returned from the query |
| `rowCount` | number | Number of rows returned |

### `rds_insert`

Insert data into an Amazon RDS table using the Data API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `resourceArn` | string | Yes | ARN of the Aurora DB cluster |
| `secretArn` | string | Yes | ARN of the Secrets Manager secret containing DB credentials |
| `database` | string | No | Database name \(optional\) |
| `table` | string | Yes | Table name to insert into |
| `data` | object | Yes | Data to insert as key-value pairs |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of inserted rows |
| `rowCount` | number | Number of rows inserted |

### `rds_update`

Update data in an Amazon RDS table using the Data API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `resourceArn` | string | Yes | ARN of the Aurora DB cluster |
| `secretArn` | string | Yes | ARN of the Secrets Manager secret containing DB credentials |
| `database` | string | No | Database name \(optional\) |
| `table` | string | Yes | Table name to update |
| `data` | object | Yes | Data to update as key-value pairs |
| `conditions` | object | Yes | Conditions for the update \(e.g., \{"id": 1\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of updated rows |
| `rowCount` | number | Number of rows updated |

### `rds_delete`

Delete data from an Amazon RDS table using the Data API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `resourceArn` | string | Yes | ARN of the Aurora DB cluster |
| `secretArn` | string | Yes | ARN of the Secrets Manager secret containing DB credentials |
| `database` | string | No | Database name \(optional\) |
| `table` | string | Yes | Table name to delete from |
| `conditions` | object | Yes | Conditions for the delete \(e.g., \{"id": 1\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of deleted rows |
| `rowCount` | number | Number of rows deleted |

### `rds_execute`

Execute raw SQL on Amazon RDS using the Data API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `accessKeyId` | string | Yes | AWS access key ID |
| `secretAccessKey` | string | Yes | AWS secret access key |
| `resourceArn` | string | Yes | ARN of the Aurora DB cluster |
| `secretArn` | string | Yes | ARN of the Secrets Manager secret containing DB credentials |
| `database` | string | No | Database name \(optional\) |
| `query` | string | Yes | Raw SQL query to execute |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of rows returned or affected |
| `rowCount` | number | Number of rows affected |



## Notes

- Category: `tools`
- Type: `rds`
```

--------------------------------------------------------------------------------

---[FILE: reddit.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/reddit.mdx

```text
---
title: Reddit
description: Access Reddit data and content
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="reddit"
  color="#FF5700"
/>

{/* MANUAL-CONTENT-START:intro */}
[Reddit](https://www.reddit.com/) is a social platform where users share and discuss content in topic-based communities called subreddits.

In Sim, you can use the Reddit integration to:

- **Get Posts**: Retrieve posts from any subreddit, with options to sort (Hot, New, Top, Rising) and filter Top posts by time (Day, Week, Month, Year, All Time).
- **Get Comments**: Fetch comments from a specific post, with options to sort and set the number of comments.

These operations let your agents access and analyze Reddit content as part of your automated workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Reddit into workflows. Read posts, comments, and search content. Submit posts, vote, reply, edit, and manage your Reddit account.



## Tools

### `reddit_get_posts`

Fetch posts from a subreddit with different sorting options

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Yes | The name of the subreddit to fetch posts from \(without the r/ prefix\) |
| `sort` | string | No | Sort method for posts: "hot", "new", "top", or "rising" \(default: "hot"\) |
| `limit` | number | No | Maximum number of posts to return \(default: 10, max: 100\) |
| `time` | string | No | Time filter for "top" sorted posts: "day", "week", "month", "year", or "all" \(default: "day"\) |
| `after` | string | No | Fullname of a thing to fetch items after \(for pagination\) |
| `before` | string | No | Fullname of a thing to fetch items before \(for pagination\) |
| `count` | number | No | A count of items already seen in the listing \(used for numbering\) |
| `show` | string | No | Show items that would normally be filtered \(e.g., "all"\) |
| `sr_detail` | boolean | No | Expand subreddit details in the response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | string | Name of the subreddit where posts were fetched from |
| `posts` | array | Array of posts with title, author, URL, score, comments count, and metadata |

### `reddit_get_comments`

Fetch comments from a specific Reddit post

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `postId` | string | Yes | The ID of the Reddit post to fetch comments from |
| `subreddit` | string | Yes | The subreddit where the post is located \(without the r/ prefix\) |
| `sort` | string | No | Sort method for comments: "confidence", "top", "new", "controversial", "old", "random", "qa" \(default: "confidence"\) |
| `limit` | number | No | Maximum number of comments to return \(default: 50, max: 100\) |
| `depth` | number | No | Maximum depth of subtrees in the thread \(controls nested comment levels\) |
| `context` | number | No | Number of parent comments to include |
| `showedits` | boolean | No | Show edit information for comments |
| `showmore` | boolean | No | Include "load more comments" elements in the response |
| `showtitle` | boolean | No | Include submission title in the response |
| `threaded` | boolean | No | Return comments in threaded/nested format |
| `truncate` | number | No | Integer to truncate comment depth |
| `after` | string | No | Fullname of a thing to fetch items after \(for pagination\) |
| `before` | string | No | Fullname of a thing to fetch items before \(for pagination\) |
| `count` | number | No | A count of items already seen in the listing \(used for numbering\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `post` | object | Post information including ID, title, author, content, and metadata |

### `reddit_get_controversial`

Fetch controversial posts from a subreddit

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Yes | The name of the subreddit to fetch posts from \(without the r/ prefix\) |
| `time` | string | No | Time filter for controversial posts: "hour", "day", "week", "month", "year", or "all" \(default: "all"\) |
| `limit` | number | No | Maximum number of posts to return \(default: 10, max: 100\) |
| `after` | string | No | Fullname of a thing to fetch items after \(for pagination\) |
| `before` | string | No | Fullname of a thing to fetch items before \(for pagination\) |
| `count` | number | No | A count of items already seen in the listing \(used for numbering\) |
| `show` | string | No | Show items that would normally be filtered \(e.g., "all"\) |
| `sr_detail` | boolean | No | Expand subreddit details in the response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | string | Name of the subreddit where posts were fetched from |
| `posts` | array | Array of controversial posts with title, author, URL, score, comments count, and metadata |

### `reddit_search`

Search for posts within a subreddit

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Yes | The name of the subreddit to search in \(without the r/ prefix\) |
| `query` | string | Yes | Search query text |
| `sort` | string | No | Sort method for search results: "relevance", "hot", "top", "new", or "comments" \(default: "relevance"\) |
| `time` | string | No | Time filter for search results: "hour", "day", "week", "month", "year", or "all" \(default: "all"\) |
| `limit` | number | No | Maximum number of posts to return \(default: 10, max: 100\) |
| `restrict_sr` | boolean | No | Restrict search to the specified subreddit only \(default: true\) |
| `after` | string | No | Fullname of a thing to fetch items after \(for pagination\) |
| `before` | string | No | Fullname of a thing to fetch items before \(for pagination\) |
| `count` | number | No | A count of items already seen in the listing \(used for numbering\) |
| `show` | string | No | Show items that would normally be filtered \(e.g., "all"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | string | Name of the subreddit where search was performed |
| `posts` | array | Array of search result posts with title, author, URL, score, comments count, and metadata |

### `reddit_submit_post`

Submit a new post to a subreddit (text or link)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Yes | The name of the subreddit to post to \(without the r/ prefix\) |
| `title` | string | Yes | Title of the submission \(max 300 characters\) |
| `text` | string | No | Text content for a self post \(markdown supported\) |
| `url` | string | No | URL for a link post \(cannot be used with text\) |
| `nsfw` | boolean | No | Mark post as NSFW |
| `spoiler` | boolean | No | Mark post as spoiler |
| `send_replies` | boolean | No | Send reply notifications to inbox \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the post was submitted successfully |
| `message` | string | Success or error message |
| `data` | object | Post data including ID, name, URL, and permalink |

### `reddit_vote`

Upvote, downvote, or unvote a Reddit post or comment

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id` | string | Yes | Thing fullname to vote on \(e.g., t3_xxxxx for post, t1_xxxxx for comment\) |
| `dir` | number | Yes | Vote direction: 1 \(upvote\), 0 \(unvote\), or -1 \(downvote\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the vote was successful |
| `message` | string | Success or error message |

### `reddit_save`

Save a Reddit post or comment to your saved items

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id` | string | Yes | Thing fullname to save \(e.g., t3_xxxxx for post, t1_xxxxx for comment\) |
| `category` | string | No | Category to save under \(Reddit Gold feature\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the save was successful |
| `message` | string | Success or error message |

### `reddit_unsave`

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `subreddit` | string | Subreddit name |
| `posts` | json | Posts data |
| `post` | json | Single post data |
| `comments` | json | Comments data |

### `reddit_reply`

Add a comment reply to a Reddit post or comment

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `parent_id` | string | Yes | Thing fullname to reply to \(e.g., t3_xxxxx for post, t1_xxxxx for comment\) |
| `text` | string | Yes | Comment text in markdown format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the reply was posted successfully |
| `message` | string | Success or error message |
| `data` | object | Comment data including ID, name, permalink, and body |

### `reddit_edit`

Edit the text of your own Reddit post or comment

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `thing_id` | string | Yes | Thing fullname to edit \(e.g., t3_xxxxx for post, t1_xxxxx for comment\) |
| `text` | string | Yes | New text content in markdown format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the edit was successful |
| `message` | string | Success or error message |
| `data` | object | Updated content data |

### `reddit_delete`

Delete your own Reddit post or comment

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id` | string | Yes | Thing fullname to delete \(e.g., t3_xxxxx for post, t1_xxxxx for comment\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the deletion was successful |
| `message` | string | Success or error message |

### `reddit_subscribe`

Subscribe or unsubscribe from a subreddit

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | Yes | The name of the subreddit \(without the r/ prefix\) |
| `action` | string | Yes | Action to perform: "sub" to subscribe or "unsub" to unsubscribe |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the subscription action was successful |
| `message` | string | Success or error message |



## Notes

- Category: `tools`
- Type: `reddit`
```

--------------------------------------------------------------------------------

---[FILE: resend.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/resend.mdx

```text
---
title: Resend
description: Send emails with Resend.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="resend"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Resend](https://resend.com/) is a modern email service designed for developers to send transactional and marketing emails with ease. It provides a simple, reliable API and dashboard for managing email delivery, templates, and analytics, making it a popular choice for integrating email functionality into applications and workflows.

With Resend, you can:

- **Send transactional emails**: Deliver password resets, notifications, confirmations, and more with high deliverability
- **Manage templates**: Create and update email templates for consistent branding and messaging
- **Track analytics**: Monitor delivery, open, and click rates to optimize your email performance
- **Integrate easily**: Use a straightforward API and SDKs for seamless integration with your applications
- **Ensure security**: Benefit from robust authentication and domain verification to protect your email reputation

In Sim, the Resend integration allows your agents to programmatically send emails as part of your automated workflows. This enables use cases such as sending notifications, alerts, or custom messages directly from your Sim-powered agents. By connecting Sim with Resend, you can automate communication tasks, ensuring timely and reliable email delivery without manual intervention. The integration leverages your Resend API key, keeping your credentials secure while enabling powerful email automation scenarios.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Resend into the workflow. Can send emails. Requires API Key.



## Tools

### `resend_send`

Send an email using your own Resend API key and from address

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fromAddress` | string | Yes | Email address to send from |
| `to` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject |
| `body` | string | Yes | Email body content |
| `contentType` | string | No | Content type for the email body \(text or html\) |
| `resendApiKey` | string | Yes | Resend API key for sending emails |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the email was sent successfully |
| `to` | string | Recipient email address |
| `subject` | string | Email subject |
| `body` | string | Email body content |



## Notes

- Category: `tools`
- Type: `resend`
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/s3.mdx

```text
---
title: S3
description: Upload, download, list, and manage S3 files
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="s3"
  color="linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon S3](https://aws.amazon.com/s3/) is a highly scalable, secure, and durable cloud storage service provided by Amazon Web Services. It's designed to store and retrieve any amount of data from anywhere on the web, making it one of the most widely used cloud storage solutions for businesses of all sizes.

With Amazon S3, you can:

- **Store unlimited data**: Upload files of any size and type with virtually unlimited storage capacity
- **Access from anywhere**: Retrieve your files from anywhere in the world with low-latency access
- **Ensure data durability**: Benefit from 99.999999999% (11 9's) durability with automatic data replication
- **Control access**: Manage permissions and access controls with fine-grained security policies
- **Scale automatically**: Handle varying workloads without manual intervention or capacity planning
- **Integrate seamlessly**: Connect with other AWS services and third-party applications easily
- **Optimize costs**: Choose from multiple storage classes to optimize costs based on access patterns

In Sim, the S3 integration enables your agents to retrieve and access files stored in your Amazon S3 buckets using secure presigned URLs. This allows for powerful automation scenarios such as processing documents, analyzing stored data, retrieving configuration files, and accessing media content as part of your workflows. Your agents can securely fetch files from S3 without exposing your AWS credentials, making it easy to incorporate cloud-stored assets into your automation processes. This integration bridges the gap between your cloud storage and AI workflows, enabling seamless access to your stored data while maintaining security best practices through AWS's robust authentication mechanisms.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate S3 into the workflow. Upload files, download objects, list bucket contents, delete objects, and copy objects between buckets. Requires AWS access key and secret access key.



## Tools

### `s3_put_object`

Upload a file to an AWS S3 bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Yes | Your AWS Access Key ID |
| `secretAccessKey` | string | Yes | Your AWS Secret Access Key |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `bucketName` | string | Yes | S3 bucket name |
| `objectKey` | string | Yes | Object key/path in S3 \(e.g., folder/filename.ext\) |
| `file` | file | No | File to upload |
| `content` | string | No | Text content to upload \(alternative to file\) |
| `contentType` | string | No | Content-Type header \(auto-detected from file if not provided\) |
| `acl` | string | No | Access control list \(e.g., private, public-read\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `url` | string | URL of the uploaded S3 object |
| `metadata` | object | Upload metadata including ETag and location |

### `s3_get_object`

Retrieve an object from an AWS S3 bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Yes | Your AWS Access Key ID |
| `secretAccessKey` | string | Yes | Your AWS Secret Access Key |
| `s3Uri` | string | Yes | S3 Object URL |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `url` | string | Pre-signed URL for downloading the S3 object |
| `metadata` | object | File metadata including type, size, name, and last modified date |

### `s3_list_objects`

List objects in an AWS S3 bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Yes | Your AWS Access Key ID |
| `secretAccessKey` | string | Yes | Your AWS Secret Access Key |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `bucketName` | string | Yes | S3 bucket name |
| `prefix` | string | No | Prefix to filter objects \(e.g., folder/\) |
| `maxKeys` | number | No | Maximum number of objects to return \(default: 1000\) |
| `continuationToken` | string | No | Token for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `objects` | array | List of S3 objects |

### `s3_delete_object`

Delete an object from an AWS S3 bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Yes | Your AWS Access Key ID |
| `secretAccessKey` | string | Yes | Your AWS Secret Access Key |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `bucketName` | string | Yes | S3 bucket name |
| `objectKey` | string | Yes | Object key/path to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deleted` | boolean | Whether the object was successfully deleted |
| `metadata` | object | Deletion metadata |

### `s3_copy_object`

Copy an object within or between AWS S3 buckets

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | Yes | Your AWS Access Key ID |
| `secretAccessKey` | string | Yes | Your AWS Secret Access Key |
| `region` | string | Yes | AWS region \(e.g., us-east-1\) |
| `sourceBucket` | string | Yes | Source bucket name |
| `sourceKey` | string | Yes | Source object key/path |
| `destinationBucket` | string | Yes | Destination bucket name |
| `destinationKey` | string | Yes | Destination object key/path |
| `acl` | string | No | Access control list for the copied object \(e.g., private, public-read\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `url` | string | URL of the copied S3 object |
| `metadata` | object | Copy operation metadata |



## Notes

- Category: `tools`
- Type: `s3`
```

--------------------------------------------------------------------------------

````

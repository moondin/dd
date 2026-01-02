---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 77
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 77 of 933)

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

---[FILE: linkedin.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/linkedin.mdx

```text
---
title: LinkedIn
description: Share posts and manage your LinkedIn presence
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkedin"
  color="#0072B1"
/>

{/* MANUAL-CONTENT-START:intro */}
[LinkedIn](https://www.linkedin.com) is the world’s largest professional networking platform, empowering users to build their careers, connect with their network, and share professional content. LinkedIn is widely used by professionals across industries for personal branding, recruiting, job search, and business development.

With LinkedIn, you can easily share posts to your personal feed to engage with your network, and access information about your profile to highlight your professional achievements. Automated integration with Sim allows you to leverage LinkedIn functionality programmatically—enabling agents and workflows to post updates, report on your professional presence, and keep your feed active without manual effort.

Key LinkedIn features available through this integration include:

- **Share Posts:** Automatically publish professional updates, articles, or announcements to your LinkedIn personal feed.
- **Profile Information:** Retrieve detailed information about your LinkedIn profile to monitor or use in downstream tasks within your workflows.

These capabilities make it easy to keep your LinkedIn network engaged and to extend your professional reach efficiently as part of your AI or workflow automation strategy.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate LinkedIn into workflows. Share posts to your personal feed and access your LinkedIn profile information.



## Tools

### `linkedin_share_post`

Share a post to your personal LinkedIn feed

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text content of your LinkedIn post |
| `visibility` | string | No | Who can see this post: "PUBLIC" or "CONNECTIONS" \(default: "PUBLIC"\) |
| `request` | string | No | No description |
| `output` | string | No | No description |
| `output` | string | No | No description |
| `specificContent` | string | No | No description |
| `shareCommentary` | string | No | No description |
| `visibility` | string | No | No description |
| `headers` | string | No | No description |
| `output` | string | No | No description |
| `output` | string | No | No description |
| `output` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `postId` | string | Created post ID |
| `profile` | json | LinkedIn profile information |
| `error` | string | Error message if operation failed |

### `linkedin_get_profile`

Retrieve your LinkedIn profile information

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `postId` | string | Created post ID |
| `profile` | json | LinkedIn profile information |
| `error` | string | Error message if operation failed |



## Notes

- Category: `tools`
- Type: `linkedin`
```

--------------------------------------------------------------------------------

---[FILE: linkup.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/linkup.mdx

```text
---
title: Linkup
description: Search the web with Linkup
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="linkup"
  color="#D6D3C7"
/>

{/* MANUAL-CONTENT-START:intro */}
[Linkup](https://linkup.so) is a powerful web search tool that integrates seamlessly with Sim, allowing your AI agents to access up-to-date information from the web with proper source attribution.

Linkup enhances your AI agents by providing them with the ability to search the web for current information. When integrated into your agent's toolkit:

- **Real-time Information Access**: Agents can retrieve the latest information from the web, keeping responses current and relevant.
- **Source Attribution**: All information comes with proper citations, ensuring transparency and credibility.
- **Simple Implementation**: Add Linkup to your agents toolset with minimal configuration.
- **Contextual Awareness**: Agents can use web information while maintaining their personality and conversational style.

To implement Linkup in your agent, simply add the tool to your agent's configuration. Your agent will then be able to search the web whenever they need to answer questions requiring current information.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Linkup into the workflow. Can search the web.



## Tools

### `linkup_search`

Search the web for information using Linkup

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `q` | string | Yes | The search query |
| `depth` | string | Yes | Search depth \(has to either be "standard" or "deep"\) |
| `outputType` | string | Yes | Type of output to return \(has to be "sourcedAnswer" or "searchResults"\) |
| `apiKey` | string | Yes | Enter your Linkup API key |
| `includeImages` | boolean | No | Whether to include images in search results |
| `fromDate` | string | No | Start date for filtering results \(YYYY-MM-DD format\) |
| `toDate` | string | No | End date for filtering results \(YYYY-MM-DD format\) |
| `excludeDomains` | string | No | Comma-separated list of domain names to exclude from search results |
| `includeDomains` | string | No | Comma-separated list of domain names to restrict search results to |
| `includeInlineCitations` | boolean | No | Add inline citations to answers \(only applies when outputType is "sourcedAnswer"\) |
| `includeSources` | boolean | No | Include sources in response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `answer` | string | The sourced answer to the search query |
| `sources` | array | Array of sources used to compile the answer, each containing name, url, and snippet |



## Notes

- Category: `tools`
- Type: `linkup`
```

--------------------------------------------------------------------------------

````

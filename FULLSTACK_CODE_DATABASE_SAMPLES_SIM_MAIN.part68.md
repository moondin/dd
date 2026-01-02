---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 68
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 68 of 933)

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

---[FILE: exa.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/exa.mdx

```text
---
title: Exa
description: Search with Exa AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="exa"
  color="#1F40ED"
/>

{/* MANUAL-CONTENT-START:intro */}
[Exa](https://exa.ai/) is an AI-powered search engine designed specifically for developers and researchers, providing highly relevant and up-to-date information from across the web. It combines advanced semantic search capabilities with AI understanding to deliver more accurate and contextually relevant results than traditional search engines.

With Exa, you can:

- **Search with natural language**: Find information using conversational queries and questions
- **Get precise results**: Receive highly relevant search results with semantic understanding
- **Access up-to-date information**: Retrieve current information from across the web
- **Find similar content**: Discover related resources based on content similarity
- **Extract webpage contents**: Retrieve and process the full text of web pages
- **Answer questions with citations**: Ask questions and receive direct answers with supporting sources
- **Perform research tasks**: Automate multi-step research workflows to gather, synthesize, and summarize information

In Sim, the Exa integration allows your agents to search the web for information, retrieve content from specific URLs, find similar resources, answer questions with citations, and conduct research tasks—all programmatically through API calls. This enables your agents to access real-time information from the internet, enhancing their ability to provide accurate, current, and relevant responses. The integration is particularly valuable for research tasks, information gathering, content discovery, and answering questions that require up-to-date information from across the web.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Exa into the workflow. Can search, get contents, find similar links, answer a question, and perform research.



## Tools

### `exa_search`

Search the web using Exa AI. Returns relevant search results with titles, URLs, and text snippets.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query to execute |
| `numResults` | number | No | Number of results to return \(default: 10, max: 25\) |
| `useAutoprompt` | boolean | No | Whether to use autoprompt to improve the query \(default: false\) |
| `type` | string | No | Search type: neural, keyword, auto or fast \(default: auto\) |
| `includeDomains` | string | No | Comma-separated list of domains to include in results |
| `excludeDomains` | string | No | Comma-separated list of domains to exclude from results |
| `category` | string | No | Filter by category: company, research paper, news, pdf, github, tweet, personal site, linkedin profile, financial report |
| `text` | boolean | No | Include full text content in results \(default: false\) |
| `highlights` | boolean | No | Include highlighted snippets in results \(default: false\) |
| `summary` | boolean | No | Include AI-generated summaries in results \(default: false\) |
| `livecrawl` | string | No | Live crawling mode: never \(default\), fallback, always, or preferred \(always try livecrawl, fall back to cache if fails\) |
| `apiKey` | string | Yes | Exa AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Search results with titles, URLs, and text snippets |

### `exa_get_contents`

Retrieve the contents of webpages using Exa AI. Returns the title, text content, and optional summaries for each URL.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Yes | Comma-separated list of URLs to retrieve content from |
| `text` | boolean | No | If true, returns full page text with default settings. If false, disables text return. |
| `summaryQuery` | string | No | Query to guide the summary generation |
| `subpages` | number | No | Number of subpages to crawl from the provided URLs |
| `subpageTarget` | string | No | Comma-separated keywords to target specific subpages \(e.g., "docs,tutorial,about"\) |
| `highlights` | boolean | No | Include highlighted snippets in results \(default: false\) |
| `livecrawl` | string | No | Live crawling mode: never \(default\), fallback, always, or preferred \(always try livecrawl, fall back to cache if fails\) |
| `apiKey` | string | Yes | Exa AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Retrieved content from URLs with title, text, and summaries |

### `exa_find_similar_links`

Find webpages similar to a given URL using Exa AI. Returns a list of similar links with titles and text snippets.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The URL to find similar links for |
| `numResults` | number | No | Number of similar links to return \(default: 10, max: 25\) |
| `text` | boolean | No | Whether to include the full text of the similar pages |
| `includeDomains` | string | No | Comma-separated list of domains to include in results |
| `excludeDomains` | string | No | Comma-separated list of domains to exclude from results |
| `excludeSourceDomain` | boolean | No | Exclude the source domain from results \(default: false\) |
| `highlights` | boolean | No | Include highlighted snippets in results \(default: false\) |
| `summary` | boolean | No | Include AI-generated summaries in results \(default: false\) |
| `livecrawl` | string | No | Live crawling mode: never \(default\), fallback, always, or preferred \(always try livecrawl, fall back to cache if fails\) |
| `apiKey` | string | Yes | Exa AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `similarLinks` | array | Similar links found with titles, URLs, and text snippets |

### `exa_answer`

Get an AI-generated answer to a question with citations from the web using Exa AI.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The question to answer |
| `text` | boolean | No | Whether to include the full text of the answer |
| `apiKey` | string | Yes | Exa AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `answer` | string | AI-generated answer to the question |
| `citations` | array | Sources and citations for the answer |

### `exa_research`

Perform comprehensive research using AI to generate detailed reports with citations

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Research query or topic |
| `model` | string | No | Research model: exa-research-fast, exa-research \(default\), or exa-research-pro |
| `apiKey` | string | Yes | Exa AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `research` | array | Comprehensive research findings with citations and summaries |



## Notes

- Category: `tools`
- Type: `exa`
```

--------------------------------------------------------------------------------

---[FILE: file.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/file.mdx

```text
---
title: File
description: Read and parse multiple files
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="file"
  color="#40916C"
/>

{/* MANUAL-CONTENT-START:intro */}
The File Parser tool provides a powerful way to extract and process content from various file formats, making it easy to incorporate document data into your agent workflows. This tool supports multiple file formats and can handle files up to 200MB in size.

With the File Parser, you can:

- **Process multiple file formats**: Extract text from PDFs, CSVs, Word documents (DOCX), text files, and more
- **Handle large files**: Process documents up to 200MB in size
- **Parse files from URLs**: Directly extract content from files hosted online by providing their URLs
- **Process multiple files at once**: Upload and parse several files in a single operation
- **Extract structured data**: Maintain formatting and structure from the original documents when possible

The File Parser tool is particularly useful for scenarios where your agents need to work with document content, such as analyzing reports, extracting data from spreadsheets, or processing text from various document sources. It simplifies the process of making document content available to your agents, allowing them to work with information stored in files just as easily as with direct text input.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate File into the workflow. Can upload a file manually or insert a file url.



## Tools

### `file_parser`

Parse one or more uploaded files or files from URLs (text, PDF, CSV, images, etc.)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `filePath` | string | Yes | Path to the file\(s\). Can be a single path, URL, or an array of paths. |
| `fileType` | string | No | Type of file to parse \(auto-detected if not specified\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `files` | array | Array of parsed files |
| `combinedContent` | string | Combined content of all parsed files |



## Notes

- Category: `tools`
- Type: `file`
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/firecrawl.mdx

```text
---
title: Firecrawl
description: Scrape, search, crawl, map, and extract web data
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="firecrawl"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Firecrawl](https://firecrawl.dev/) is a powerful web scraping and content extraction API that integrates seamlessly into Sim, enabling developers to extract clean, structured content from any website. This integration provides a simple way to transform web pages into usable data formats like Markdown and HTML while preserving the essential content.

With Firecrawl in Sim, you can:

- **Extract clean content**: Remove ads, navigation elements, and other distractions to get just the main content
- **Convert to structured formats**: Transform web pages into Markdown, HTML, or JSON
- **Capture metadata**: Extract SEO metadata, Open Graph tags, and other page information
- **Handle JavaScript-heavy sites**: Process content from modern web applications that rely on JavaScript
- **Filter content**: Focus on specific parts of a page using CSS selectors
- **Process at scale**: Handle high-volume scraping needs with a reliable API
- **Search the web**: Perform intelligent web searches and retrieve structured results
- **Crawl entire sites**: Crawl multiple pages from a website and aggregate their content

In Sim, the Firecrawl integration enables your agents to access and process web content programmatically as part of their workflows. Supported operations include:

- **Scrape**: Extract structured content (Markdown, HTML, metadata) from a single web page.
- **Search**: Search the web for information using Firecrawl's intelligent search capabilities.
- **Crawl**: Crawl multiple pages from a website, returning structured content and metadata for each page.

This allows your agents to gather information from websites, extract structured data, and use that information to make decisions or generate insights—all without having to navigate the complexities of raw HTML parsing or browser automation. Simply configure the Firecrawl block with your API key, select the operation (Scrape, Search, or Crawl), and provide the relevant parameters. Your agents can immediately begin working with web content in a clean, structured format.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Firecrawl into the workflow. Scrape pages, search the web, crawl entire sites, map URL structures, and extract structured data with AI.



## Tools

### `firecrawl_scrape`

Extract structured content from web pages with comprehensive metadata support. Converts content to markdown or HTML while capturing SEO metadata, Open Graph tags, and page information.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The URL to scrape content from |
| `scrapeOptions` | json | No | Options for content scraping |
| `apiKey` | string | Yes | Firecrawl API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `markdown` | string | Page content in markdown format |
| `html` | string | Raw HTML content of the page |
| `metadata` | object | Page metadata including SEO and Open Graph information |

### `firecrawl_search`

Search for information on the web using Firecrawl

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query to use |
| `apiKey` | string | Yes | Firecrawl API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | array | Search results data |

### `firecrawl_crawl`

Crawl entire websites and extract structured content from all accessible pages

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The website URL to crawl |
| `limit` | number | No | Maximum number of pages to crawl \(default: 100\) |
| `onlyMainContent` | boolean | No | Extract only main content from pages |
| `apiKey` | string | Yes | Firecrawl API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pages` | array | Array of crawled pages with their content and metadata |

### `firecrawl_map`

Get a complete list of URLs from any website quickly and reliably. Useful for discovering all pages on a site without crawling them.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The base URL to map and discover links from |
| `search` | string | No | Filter results by relevance to a search term \(e.g., "blog"\) |
| `sitemap` | string | No | Controls sitemap usage: "skip", "include" \(default\), or "only" |
| `includeSubdomains` | boolean | No | Whether to include URLs from subdomains \(default: true\) |
| `ignoreQueryParameters` | boolean | No | Exclude URLs containing query strings \(default: true\) |
| `limit` | number | No | Maximum number of links to return \(max: 100,000, default: 5,000\) |
| `timeout` | number | No | Request timeout in milliseconds |
| `location` | json | No | Geographic context for proxying \(country, languages\) |
| `apiKey` | string | Yes | Firecrawl API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the mapping operation was successful |
| `links` | array | Array of discovered URLs from the website |

### `firecrawl_extract`

Extract structured data from entire webpages using natural language prompts and JSON schema. Powerful agentic feature for intelligent data extraction.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `urls` | json | Yes | Array of URLs to extract data from \(supports glob format\) |
| `prompt` | string | No | Natural language guidance for the extraction process |
| `schema` | json | No | JSON Schema defining the structure of data to extract |
| `enableWebSearch` | boolean | No | Enable web search to find supplementary information \(default: false\) |
| `ignoreSitemap` | boolean | No | Ignore sitemap.xml files during scanning \(default: false\) |
| `includeSubdomains` | boolean | No | Extend scanning to subdomains \(default: true\) |
| `showSources` | boolean | No | Return data sources in the response \(default: false\) |
| `ignoreInvalidURLs` | boolean | No | Skip invalid URLs in the array \(default: true\) |
| `scrapeOptions` | json | No | Advanced scraping configuration options |
| `apiKey` | string | Yes | Firecrawl API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the extraction operation was successful |
| `data` | object | Extracted structured data according to the schema or prompt |



## Notes

- Category: `tools`
- Type: `firecrawl`
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 476
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 476 of 933)

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

---[FILE: parallel.ts]---
Location: sim-main/apps/sim/blocks/blocks/parallel.ts

```typescript
import { ParallelIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ToolResponse } from '@/tools/types'

export const ParallelBlock: BlockConfig<ToolResponse> = {
  type: 'parallel_ai',
  name: 'Parallel AI',
  description: 'Web research with Parallel AI',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Parallel AI into the workflow. Can search the web, extract information from URLs, and conduct deep research.',
  docsLink: 'https://docs.parallel.ai/',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: ParallelIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Search', id: 'search' },
        { label: 'Extract from URLs', id: 'extract' },
        { label: 'Deep Research', id: 'deep_research' },
      ],
      value: () => 'search',
    },
    {
      id: 'objective',
      title: 'Search Objective',
      type: 'long-input',
      placeholder: "When was the United Nations established? Prefer UN's websites.",
      required: true,
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'search_queries',
      title: 'Search Queries',
      type: 'long-input',
      placeholder:
        'Enter search queries separated by commas (e.g., "Founding year UN", "Year of founding United Nations")',
      required: false,
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'urls',
      title: 'URLs',
      type: 'long-input',
      placeholder:
        'Enter URLs separated by commas (e.g., https://example.com, https://another.com)',
      required: true,
      condition: { field: 'operation', value: 'extract' },
    },
    {
      id: 'extract_objective',
      title: 'Extract Objective',
      type: 'long-input',
      placeholder: 'What information to extract from the URLs?',
      required: true,
      condition: { field: 'operation', value: 'extract' },
    },
    {
      id: 'excerpts',
      title: 'Include Excerpts',
      type: 'dropdown',
      options: [
        { label: 'Yes', id: 'true' },
        { label: 'No', id: 'false' },
      ],
      value: () => 'true',
      condition: { field: 'operation', value: 'extract' },
    },
    {
      id: 'full_content',
      title: 'Include Full Content',
      type: 'dropdown',
      options: [
        { label: 'Yes', id: 'true' },
        { label: 'No', id: 'false' },
      ],
      value: () => 'false',
      condition: { field: 'operation', value: 'extract' },
    },
    {
      id: 'research_input',
      title: 'Research Query',
      type: 'long-input',
      placeholder: 'Enter your research question (up to 15,000 characters)',
      required: true,
      condition: { field: 'operation', value: 'deep_research' },
    },
    {
      id: 'include_domains',
      title: 'Include Domains',
      type: 'short-input',
      placeholder: 'Comma-separated domains to include',
      required: false,
      condition: { field: 'operation', value: 'deep_research' },
    },
    {
      id: 'exclude_domains',
      title: 'Exclude Domains',
      type: 'short-input',
      placeholder: 'Comma-separated domains to exclude',
      required: false,
      condition: { field: 'operation', value: 'deep_research' },
    },
    {
      id: 'processor',
      title: 'Processor',
      type: 'dropdown',
      options: [
        { label: 'Lite', id: 'lite' },
        { label: 'Base', id: 'base' },
        { label: 'Core', id: 'core' },
        { label: 'Core 2x', id: 'core2x' },
        { label: 'Pro', id: 'pro' },
        { label: 'Ultra', id: 'ultra' },
        { label: 'Ultra 2x', id: 'ultra2x' },
        { label: 'Ultra 4x', id: 'ultra4x' },
      ],
      value: () => 'base',
      condition: { field: 'operation', value: ['search', 'deep_research'] },
    },
    {
      id: 'max_results',
      title: 'Max Results',
      type: 'short-input',
      placeholder: '5',
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'max_chars_per_result',
      title: 'Max Chars',
      type: 'short-input',
      placeholder: '1500',
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Parallel AI API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['parallel_search', 'parallel_extract', 'parallel_deep_research'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'search':
            // Convert search_queries from comma-separated string to array (if provided)
            if (params.search_queries && typeof params.search_queries === 'string') {
              const queries = params.search_queries
                .split(',')
                .map((query: string) => query.trim())
                .filter((query: string) => query.length > 0)
              // Only set if we have actual queries
              if (queries.length > 0) {
                params.search_queries = queries
              } else {
                params.search_queries = undefined
              }
            }

            // Convert numeric parameters
            if (params.max_results) {
              params.max_results = Number(params.max_results)
            }
            if (params.max_chars_per_result) {
              params.max_chars_per_result = Number(params.max_chars_per_result)
            }

            return 'parallel_search'

          case 'extract':
            // Map extract_objective to objective for the tool
            params.objective = params.extract_objective

            // Convert boolean strings to actual booleans with defaults
            if (params.excerpts === 'true' || params.excerpts === true) {
              params.excerpts = true
            } else if (params.excerpts === 'false' || params.excerpts === false) {
              params.excerpts = false
            } else {
              // Default to true if not provided
              params.excerpts = true
            }

            if (params.full_content === 'true' || params.full_content === true) {
              params.full_content = true
            } else if (params.full_content === 'false' || params.full_content === false) {
              params.full_content = false
            } else {
              // Default to false if not provided
              params.full_content = false
            }

            return 'parallel_extract'

          case 'deep_research':
            // Map research_input to input for the tool
            params.input = params.research_input
            return 'parallel_deep_research'

          default:
            return 'parallel_search'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation type' },
    objective: { type: 'string', description: 'Search objective or question' },
    search_queries: { type: 'string', description: 'Comma-separated search queries' },
    urls: { type: 'string', description: 'Comma-separated URLs' },
    extract_objective: { type: 'string', description: 'What to extract from URLs' },
    excerpts: { type: 'boolean', description: 'Include excerpts' },
    full_content: { type: 'boolean', description: 'Include full content' },
    research_input: { type: 'string', description: 'Deep research query' },
    include_domains: { type: 'string', description: 'Domains to include' },
    exclude_domains: { type: 'string', description: 'Domains to exclude' },
    processor: { type: 'string', description: 'Processing method' },
    max_results: { type: 'number', description: 'Maximum number of results' },
    max_chars_per_result: { type: 'number', description: 'Maximum characters per result' },
    apiKey: { type: 'string', description: 'Parallel AI API key' },
  },
  outputs: {
    results: { type: 'string', description: 'Search or extract results (JSON stringified)' },
    status: { type: 'string', description: 'Task status (for deep research)' },
    run_id: { type: 'string', description: 'Task run ID (for deep research)' },
    message: { type: 'string', description: 'Status message (for deep research)' },
    content: {
      type: 'string',
      description: 'Research content (for deep research, JSON stringified)',
    },
    basis: {
      type: 'string',
      description: 'Citations and sources (for deep research, JSON stringified)',
    },
    metadata: {
      type: 'string',
      description: 'Task metadata (for deep research, JSON stringified)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: perplexity.ts]---
Location: sim-main/apps/sim/blocks/blocks/perplexity.ts

```typescript
import { PerplexityIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { PerplexityChatResponse, PerplexitySearchResponse } from '@/tools/perplexity/types'

type PerplexityResponse = PerplexityChatResponse | PerplexitySearchResponse

export const PerplexityBlock: BlockConfig<PerplexityResponse> = {
  type: 'perplexity',
  name: 'Perplexity',
  description: 'Use Perplexity AI for chat and search',
  longDescription:
    'Integrate Perplexity into the workflow. Can generate completions using Perplexity AI chat models or perform web searches with advanced filtering.',
  authMode: AuthMode.ApiKey,
  docsLink: 'https://docs.sim.ai/tools/perplexity',
  category: 'tools',
  bgColor: '#20808D', // Perplexity turquoise color
  icon: PerplexityIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Chat', id: 'perplexity_chat' },
        { label: 'Search', id: 'perplexity_search' },
      ],
      value: () => 'perplexity_chat',
    },
    // Chat operation inputs
    {
      id: 'systemPrompt',
      title: 'System Prompt',
      type: 'long-input',
      placeholder: 'System prompt to guide the model behavior...',
      condition: { field: 'operation', value: 'perplexity_chat' },
    },
    {
      id: 'content',
      title: 'User Prompt',
      type: 'long-input',
      placeholder: 'Enter your prompt here...',
      required: true,
      condition: { field: 'operation', value: 'perplexity_chat' },
    },
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      options: [
        { label: 'Sonar', id: 'sonar' },
        { label: 'Sonar Pro', id: 'sonar-pro' },
        { label: 'Sonar Deep Research', id: 'sonar-deep-research' },
        { label: 'Sonar Reasoning', id: 'sonar-reasoning' },
        { label: 'Sonar Reasoning Pro', id: 'sonar-reasoning-pro' },
      ],
      value: () => 'sonar',
      condition: { field: 'operation', value: 'perplexity_chat' },
    },
    {
      id: 'temperature',
      title: 'Temperature',
      type: 'slider',
      min: 0,
      max: 1,
      value: () => '0.7',
      condition: { field: 'operation', value: 'perplexity_chat' },
    },
    {
      id: 'max_tokens',
      title: 'Max Tokens',
      type: 'short-input',
      placeholder: 'Maximum number of tokens',
      condition: { field: 'operation', value: 'perplexity_chat' },
    },
    // Search operation inputs
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter your search query...',
      required: true,
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'max_results',
      title: 'Max Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'search_domain_filter',
      title: 'Domain Filter',
      type: 'long-input',
      placeholder: 'science.org, pnas.org, cell.com (comma-separated, max 20)',
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'max_tokens_per_page',
      title: 'Max Page Tokens',
      type: 'short-input',
      placeholder: '1024',
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'country',
      title: 'Country',
      type: 'short-input',
      placeholder: 'US, GB, DE, etc.',
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'search_recency_filter',
      title: 'Recency Filter',
      type: 'dropdown',
      placeholder: 'Select option...',
      options: [
        { label: 'Past Hour', id: 'hour' },
        { label: 'Past Day', id: 'day' },
        { label: 'Past Week', id: 'week' },
        { label: 'Past Month', id: 'month' },
        { label: 'Past Year', id: 'year' },
      ],
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'search_after_date',
      title: 'After Date',
      type: 'short-input',
      placeholder: 'MM/DD/YYYY',
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'search_before_date',
      title: 'Before Date',
      type: 'short-input',
      placeholder: 'MM/DD/YYYY',
      condition: { field: 'operation', value: 'perplexity_search' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Perplexity API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['perplexity_chat', 'perplexity_search'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'perplexity_chat':
            return 'perplexity_chat'
          case 'perplexity_search':
            return 'perplexity_search'
          default:
            return 'perplexity_chat'
        }
      },
      params: (params) => {
        if (params.operation === 'perplexity_search') {
          // Process domain filter from comma-separated string to array
          let domainFilter: string[] | undefined
          if (params.search_domain_filter && typeof params.search_domain_filter === 'string') {
            domainFilter = params.search_domain_filter
              .split(',')
              .map((d) => d.trim())
              .filter((d) => d.length > 0)
          }

          const searchParams = {
            apiKey: params.apiKey,
            query: params.query,
            max_results: params.max_results ? Number.parseInt(params.max_results) : undefined,
            search_domain_filter: domainFilter,
            max_tokens_per_page: params.max_tokens_per_page
              ? Number.parseInt(params.max_tokens_per_page)
              : undefined,
            country: params.country || undefined,
            search_recency_filter: params.search_recency_filter || undefined,
            search_after_date: params.search_after_date || undefined,
            search_before_date: params.search_before_date || undefined,
          }

          return searchParams
        }

        // Chat params (default)
        const chatParams = {
          apiKey: params.apiKey,
          model: params.model,
          content: params.content,
          systemPrompt: params.systemPrompt,
          max_tokens: params.max_tokens ? Number.parseInt(params.max_tokens) : undefined,
          temperature: params.temperature ? Number.parseFloat(params.temperature) : undefined,
        }

        return chatParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    // Chat operation inputs
    content: { type: 'string', description: 'User prompt content' },
    systemPrompt: { type: 'string', description: 'System instructions' },
    model: { type: 'string', description: 'AI model to use' },
    max_tokens: { type: 'string', description: 'Maximum output tokens' },
    temperature: { type: 'string', description: 'Response randomness' },
    // Search operation inputs
    query: { type: 'string', description: 'Search query' },
    max_results: { type: 'string', description: 'Maximum search results' },
    search_domain_filter: { type: 'string', description: 'Domain filter (comma-separated)' },
    max_tokens_per_page: { type: 'string', description: 'Max tokens per page' },
    country: { type: 'string', description: 'Country code filter' },
    search_recency_filter: { type: 'string', description: 'Recency filter' },
    search_after_date: { type: 'string', description: 'After date filter' },
    search_before_date: { type: 'string', description: 'Before date filter' },
    // Common
    apiKey: { type: 'string', description: 'Perplexity API key' },
  },
  outputs: {
    // Chat outputs
    content: { type: 'string', description: 'Generated response' },
    model: { type: 'string', description: 'Model used' },
    usage: { type: 'json', description: 'Token usage' },
    // Search outputs
    results: { type: 'json', description: 'Search results array' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: pinecone.ts]---
Location: sim-main/apps/sim/blocks/blocks/pinecone.ts

```typescript
import { PineconeIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { PineconeResponse } from '@/tools/pinecone/types'

export const PineconeBlock: BlockConfig<PineconeResponse> = {
  type: 'pinecone',
  name: 'Pinecone',
  description: 'Use Pinecone vector database',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Pinecone into the workflow. Can generate embeddings, upsert text, search with text, fetch vectors, and search with vectors.',
  docsLink: 'https://docs.sim.ai/tools/pinecone',
  category: 'tools',
  bgColor: '#0D1117',
  icon: PineconeIcon,

  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Generate Embeddings', id: 'generate' },
        { label: 'Upsert Text', id: 'upsert_text' },
        { label: 'Search With Text', id: 'search_text' },
        { label: 'Search With Vector', id: 'search_vector' },
        { label: 'Fetch Vectors', id: 'fetch' },
      ],
      value: () => 'generate',
    },
    // Generate embeddings fields
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      options: [
        { label: 'multilingual-e5-large', id: 'multilingual-e5-large' },
        { label: 'llama-text-embed-v2', id: 'llama-text-embed-v2' },
        {
          label: 'pinecone-sparse-english-v0',
          id: 'pinecone-sparse-english-v0',
        },
      ],
      condition: { field: 'operation', value: 'generate' },
      value: () => 'multilingual-e5-large',
    },
    {
      id: 'inputs',
      title: 'Text Inputs',
      type: 'long-input',
      placeholder: '[{"text": "Your text here"}]',
      condition: { field: 'operation', value: 'generate' },
      required: true,
    },
    // Upsert text fields
    {
      id: 'indexHost',
      title: 'Index Host',
      type: 'short-input',
      placeholder: 'https://index-name-abc123.svc.project-id.pinecone.io',
      condition: { field: 'operation', value: 'upsert_text' },
      required: true,
    },
    {
      id: 'namespace',
      title: 'Namespace',
      type: 'short-input',
      placeholder: 'default',
      condition: { field: 'operation', value: 'upsert_text' },
      required: true,
    },
    {
      id: 'records',
      title: 'Records',
      type: 'long-input',
      placeholder:
        '{"_id": "rec1", "text": "Apple\'s first product, the Apple I, was released in 1976.", "category": "product"}\n{"_id": "rec2", "chunk_text": "Apples are a great source of dietary fiber.", "category": "nutrition"}',
      condition: { field: 'operation', value: 'upsert_text' },
      required: true,
    },
    // Search text fields
    {
      id: 'indexHost',
      title: 'Index Host',
      type: 'short-input',
      placeholder: 'https://index-name-abc123.svc.project-id.pinecone.io',
      condition: { field: 'operation', value: 'search_text' },
      required: true,
    },
    {
      id: 'namespace',
      title: 'Namespace',
      type: 'short-input',
      placeholder: 'default',
      condition: { field: 'operation', value: 'search_text' },
      required: true,
    },
    {
      id: 'searchQuery',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter text to search for',
      condition: { field: 'operation', value: 'search_text' },
      required: true,
    },
    {
      id: 'topK',
      title: 'Top K Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'search_text' },
    },
    {
      id: 'fields',
      title: 'Fields to Return',
      type: 'long-input',
      placeholder: '["category", "text"]',
      condition: { field: 'operation', value: 'search_text' },
    },
    {
      id: 'filter',
      title: 'Filter',
      type: 'long-input',
      placeholder: '{"category": "product"}',
      condition: { field: 'operation', value: 'search_text' },
    },
    {
      id: 'rerank',
      title: 'Rerank Options',
      type: 'long-input',
      placeholder: '{"model": "bge-reranker-v2-m3", "rank_fields": ["text"], "top_n": 2}',
      condition: { field: 'operation', value: 'search_text' },
    },
    // Fetch fields
    {
      id: 'indexHost',
      title: 'Index Host',
      type: 'short-input',
      placeholder: 'https://index-name-abc123.svc.project-id.pinecone.io',
      condition: { field: 'operation', value: 'fetch' },
      required: true,
    },
    {
      id: 'namespace',
      title: 'Namespace',
      type: 'short-input',
      placeholder: 'Namespace',
      condition: { field: 'operation', value: 'fetch' },
      required: true,
    },
    {
      id: 'ids',
      title: 'Vector IDs',
      type: 'long-input',
      placeholder: '["vec1", "vec2"]',
      condition: { field: 'operation', value: 'fetch' },
      required: true,
    },
    // Add vector search fields
    {
      id: 'indexHost',
      title: 'Index Host',
      type: 'short-input',
      placeholder: 'https://index-name-abc123.svc.project-id.pinecone.io',
      condition: { field: 'operation', value: 'search_vector' },
      required: true,
    },
    {
      id: 'namespace',
      title: 'Namespace',
      type: 'short-input',
      placeholder: 'default',
      condition: { field: 'operation', value: 'search_vector' },
      required: true,
    },
    {
      id: 'vector',
      title: 'Query Vector',
      type: 'long-input',
      placeholder: '[0.1, 0.2, 0.3, ...]',
      condition: { field: 'operation', value: 'search_vector' },
      required: true,
    },
    {
      id: 'topK',
      title: 'Top K Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'search_vector' },
    },
    {
      id: 'options',
      title: 'Options',
      type: 'checkbox-list',
      options: [
        { id: 'includeValues', label: 'Include Values' },
        { id: 'includeMetadata', label: 'Include Metadata' },
      ],
      condition: { field: 'operation', value: 'search_vector' },
    },
    // Common fields
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Your Pinecone API key',
      password: true,
      required: true,
    },
  ],

  tools: {
    access: [
      'pinecone_generate_embeddings',
      'pinecone_upsert_text',
      'pinecone_search_text',
      'pinecone_search_vector',
      'pinecone_fetch',
    ],
    config: {
      tool: (params: Record<string, any>) => {
        switch (params.operation) {
          case 'generate':
            return 'pinecone_generate_embeddings'
          case 'upsert_text':
            return 'pinecone_upsert_text'
          case 'search_text':
            return 'pinecone_search_text'
          case 'fetch':
            return 'pinecone_fetch'
          case 'search_vector':
            return 'pinecone_search_vector'
          default:
            throw new Error('Invalid operation selected')
        }
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Pinecone API key' },
    indexHost: { type: 'string', description: 'Index host URL' },
    namespace: { type: 'string', description: 'Vector namespace' },
    // Generate embeddings inputs
    model: { type: 'string', description: 'Embedding model' },
    inputs: { type: 'json', description: 'Text inputs' },
    parameters: { type: 'json', description: 'Model parameters' },
    // Upsert text inputs
    records: { type: 'json', description: 'Records to upsert' },
    // Search text inputs
    searchQuery: { type: 'string', description: 'Search query text' },
    topK: { type: 'string', description: 'Top K results' },
    fields: { type: 'json', description: 'Fields to return' },
    filter: { type: 'json', description: 'Search filter' },
    rerank: { type: 'json', description: 'Rerank options' },
    // Fetch inputs
    ids: { type: 'json', description: 'Vector identifiers' },
    vector: { type: 'json', description: 'Query vector' },
    includeValues: { type: 'boolean', description: 'Include vector values' },
    includeMetadata: { type: 'boolean', description: 'Include metadata' },
  },

  outputs: {
    matches: { type: 'json', description: 'Search matches' },
    upsertedCount: { type: 'number', description: 'Upserted count' },
    data: { type: 'json', description: 'Response data' },
    model: { type: 'string', description: 'Model information' },
    vector_type: { type: 'string', description: 'Vector type' },
    usage: { type: 'json', description: 'Usage statistics' },
  },
}
```

--------------------------------------------------------------------------------

````

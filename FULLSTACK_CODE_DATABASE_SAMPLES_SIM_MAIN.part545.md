---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 545
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 545 of 933)

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

---[FILE: docs-chunker.ts]---
Location: sim-main/apps/sim/lib/chunkers/docs-chunker.ts

```typescript
import fs from 'fs/promises'
import path from 'path'
import { TextChunker } from '@/lib/chunkers/text-chunker'
import type { DocChunk, DocsChunkerOptions } from '@/lib/chunkers/types'
import { generateEmbeddings } from '@/lib/knowledge/embeddings'
import { createLogger } from '@/lib/logs/console/logger'

interface HeaderInfo {
  level: number
  text: string
  slug?: string
  anchor?: string
  position?: number
}

interface Frontmatter {
  title?: string
  description?: string
  [key: string]: any
}

const logger = createLogger('DocsChunker')

/**
 * Docs-specific chunker that processes .mdx files and tracks header context
 */
export class DocsChunker {
  private readonly textChunker: TextChunker
  private readonly baseUrl: string

  constructor(options: DocsChunkerOptions = {}) {
    // Use the existing TextChunker for chunking logic
    this.textChunker = new TextChunker({
      chunkSize: options.chunkSize ?? 300, // Max 300 tokens per chunk
      minChunkSize: options.minChunkSize ?? 1,
      overlap: options.overlap ?? 50,
    })
    // Use localhost docs in development, production docs otherwise
    this.baseUrl = options.baseUrl ?? 'https://docs.sim.ai'
  }

  /**
   * Process all .mdx files in the docs directory
   */
  async chunkAllDocs(docsPath: string): Promise<DocChunk[]> {
    const allChunks: DocChunk[] = []

    try {
      const mdxFiles = await this.findMdxFiles(docsPath)
      logger.info(`Found ${mdxFiles.length} .mdx files to process`)

      for (const filePath of mdxFiles) {
        try {
          const chunks = await this.chunkMdxFile(filePath, docsPath)
          allChunks.push(...chunks)
          logger.info(`Processed ${filePath}: ${chunks.length} chunks`)
        } catch (error) {
          logger.error(`Error processing ${filePath}:`, error)
        }
      }

      logger.info(`Total chunks generated: ${allChunks.length}`)
      return allChunks
    } catch (error) {
      logger.error('Error processing docs:', error)
      throw error
    }
  }

  /**
   * Process a single .mdx file
   */
  async chunkMdxFile(filePath: string, basePath: string): Promise<DocChunk[]> {
    const content = await fs.readFile(filePath, 'utf-8')
    const relativePath = path.relative(basePath, filePath)

    // Parse frontmatter and content
    const { data: frontmatter, content: markdownContent } = this.parseFrontmatter(content)

    // Extract headers from the content
    const headers = this.extractHeaders(markdownContent)

    // Generate document URL
    const documentUrl = this.generateDocumentUrl(relativePath)

    // Split content into chunks
    const textChunks = await this.splitContent(markdownContent)

    // Generate embeddings for all chunks at once (batch processing)
    logger.info(`Generating embeddings for ${textChunks.length} chunks in ${relativePath}`)
    const embeddings = textChunks.length > 0 ? await generateEmbeddings(textChunks) : []
    const embeddingModel = 'text-embedding-3-small'

    // Convert to DocChunk objects with header context and embeddings
    const chunks: DocChunk[] = []
    let currentPosition = 0

    for (let i = 0; i < textChunks.length; i++) {
      const chunkText = textChunks[i]
      const chunkStart = currentPosition
      const chunkEnd = currentPosition + chunkText.length

      // Find the most relevant header for this chunk
      const relevantHeader = this.findRelevantHeader(headers, chunkStart)

      const chunk: DocChunk = {
        text: chunkText,
        tokenCount: Math.ceil(chunkText.length / 4), // Simple token estimation
        sourceDocument: relativePath,
        headerLink: relevantHeader ? `${documentUrl}#${relevantHeader.anchor}` : documentUrl,
        headerText: relevantHeader?.text || frontmatter.title || 'Document Root',
        headerLevel: relevantHeader?.level || 1,
        embedding: embeddings[i] || [],
        embeddingModel,
        metadata: {
          startIndex: chunkStart,
          endIndex: chunkEnd,
          title: frontmatter.title,
        },
      }

      chunks.push(chunk)
      currentPosition = chunkEnd
    }

    return chunks
  }

  /**
   * Find all .mdx files recursively
   */
  private async findMdxFiles(dirPath: string): Promise<string[]> {
    const files: string[] = []

    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        const subFiles = await this.findMdxFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }

    return files
  }

  /**
   * Extract headers and their positions from markdown content
   */
  private extractHeaders(content: string): HeaderInfo[] {
    const headers: HeaderInfo[] = []
    const headerRegex = /^(#{1,6})\s+(.+)$/gm
    let match

    while ((match = headerRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const anchor = this.generateAnchor(text)

      headers.push({
        text,
        level,
        anchor,
        position: match.index,
      })
    }

    return headers
  }

  /**
   * Generate URL-safe anchor from header text
   */
  private generateAnchor(headerText: string): string {
    return headerText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Generate document URL from relative path
   */
  private generateDocumentUrl(relativePath: string): string {
    // Convert file path to URL path
    // e.g., "tools/knowledge.mdx" -> "/tools/knowledge"
    const urlPath = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/') // Handle Windows paths

    return `${this.baseUrl}/${urlPath}`
  }

  /**
   * Find the most relevant header for a given position
   */
  private findRelevantHeader(headers: HeaderInfo[], position: number): HeaderInfo | null {
    if (headers.length === 0) return null

    // Find the last header that comes before this position
    let relevantHeader: HeaderInfo | null = null

    for (const header of headers) {
      if (header.position !== undefined && header.position <= position) {
        relevantHeader = header
      } else {
        break
      }
    }

    return relevantHeader
  }

  /**
   * Split content into chunks using the existing TextChunker with table awareness
   */
  private async splitContent(content: string): Promise<string[]> {
    // Clean the content first
    const cleanedContent = this.cleanContent(content)

    // Detect table boundaries to avoid splitting them
    const tableBoundaries = this.detectTableBoundaries(cleanedContent)

    // Use the existing TextChunker
    const chunks = await this.textChunker.chunk(cleanedContent)

    // Post-process chunks to ensure tables aren't split
    const processedChunks = this.mergeTableChunks(
      chunks.map((chunk) => chunk.text),
      tableBoundaries,
      cleanedContent
    )

    // Ensure no chunk exceeds 300 tokens
    const finalChunks = this.enforceSizeLimit(processedChunks)

    return finalChunks
  }

  /**
   * Clean content by removing MDX-specific elements and excessive whitespace
   */
  private cleanContent(content: string): string {
    return (
      content
        // Remove import statements
        .replace(/^import\s+.*$/gm, '')
        // Remove JSX components and React-style comments
        .replace(/<[^>]+>/g, ' ')
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
        // Remove excessive whitespace
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim()
    )
  }

  /**
   * Parse frontmatter from MDX content
   */
  private parseFrontmatter(content: string): { data: Frontmatter; content: string } {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) {
      return { data: {}, content }
    }

    const [, frontmatterText, markdownContent] = match
    const data: Frontmatter = {}

    // Simple YAML parsing for title and description
    const lines = frontmatterText.split('\n')
    for (const line of lines) {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim()
        const value = line
          .slice(colonIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '')
        data[key] = value
      }
    }

    return { data, content: markdownContent }
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  /**
   * Detect table boundaries in markdown content to avoid splitting them
   */
  private detectTableBoundaries(content: string): { start: number; end: number }[] {
    const tables: { start: number; end: number }[] = []
    const lines = content.split('\n')

    let inTable = false
    let tableStart = -1

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detect table start (markdown table row with pipes)
      if (line.includes('|') && line.split('|').length >= 3 && !inTable) {
        // Check if next line is table separator (contains dashes and pipes)
        const nextLine = lines[i + 1]?.trim()
        if (nextLine?.includes('|') && nextLine.includes('-')) {
          inTable = true
          tableStart = i
        }
      }
      // Detect table end (empty line or non-table content)
      else if (inTable && (!line.includes('|') || line === '' || line.startsWith('#'))) {
        tables.push({
          start: this.getCharacterPosition(lines, tableStart),
          end: this.getCharacterPosition(lines, i - 1) + lines[i - 1]?.length || 0,
        })
        inTable = false
      }
    }

    // Handle table at end of content
    if (inTable && tableStart >= 0) {
      tables.push({
        start: this.getCharacterPosition(lines, tableStart),
        end: content.length,
      })
    }

    return tables
  }

  /**
   * Get character position from line number
   */
  private getCharacterPosition(lines: string[], lineIndex: number): number {
    return lines.slice(0, lineIndex).reduce((acc, line) => acc + line.length + 1, 0)
  }

  /**
   * Merge chunks that would split tables
   */
  private mergeTableChunks(
    chunks: string[],
    tableBoundaries: { start: number; end: number }[],
    originalContent: string
  ): string[] {
    if (tableBoundaries.length === 0) {
      return chunks
    }

    const mergedChunks: string[] = []
    let currentPosition = 0

    for (const chunk of chunks) {
      const chunkStart = originalContent.indexOf(chunk, currentPosition)
      const chunkEnd = chunkStart + chunk.length

      // Check if this chunk intersects with any table
      const intersectsTable = tableBoundaries.some(
        (table) =>
          (chunkStart >= table.start && chunkStart <= table.end) ||
          (chunkEnd >= table.start && chunkEnd <= table.end) ||
          (chunkStart <= table.start && chunkEnd >= table.end)
      )

      if (intersectsTable) {
        // Find which table(s) this chunk intersects with
        const affectedTables = tableBoundaries.filter(
          (table) =>
            (chunkStart >= table.start && chunkStart <= table.end) ||
            (chunkEnd >= table.start && chunkEnd <= table.end) ||
            (chunkStart <= table.start && chunkEnd >= table.end)
        )

        // Create a chunk that includes the complete table(s)
        const minStart = Math.min(chunkStart, ...affectedTables.map((t) => t.start))
        const maxEnd = Math.max(chunkEnd, ...affectedTables.map((t) => t.end))
        const completeChunk = originalContent.slice(minStart, maxEnd)

        // Only add if we haven't already included this content
        if (!mergedChunks.some((existing) => existing.includes(completeChunk.trim()))) {
          mergedChunks.push(completeChunk.trim())
        }
      } else {
        mergedChunks.push(chunk)
      }

      currentPosition = chunkEnd
    }

    return mergedChunks.filter((chunk) => chunk.length > 50) // Filter out tiny chunks
  }

  /**
   * Enforce 300 token size limit on chunks
   */
  private enforceSizeLimit(chunks: string[]): string[] {
    const finalChunks: string[] = []

    for (const chunk of chunks) {
      const tokens = this.estimateTokens(chunk)

      if (tokens <= 300) {
        // Chunk is within limit
        finalChunks.push(chunk)
      } else {
        // Chunk is too large - split it
        const lines = chunk.split('\n')
        let currentChunk = ''

        for (const line of lines) {
          const testChunk = currentChunk ? `${currentChunk}\n${line}` : line

          if (this.estimateTokens(testChunk) <= 300) {
            currentChunk = testChunk
          } else {
            // Adding this line would exceed limit
            if (currentChunk.trim()) {
              finalChunks.push(currentChunk.trim())
            }
            currentChunk = line
          }
        }

        // Add final chunk if it has content
        if (currentChunk.trim()) {
          finalChunks.push(currentChunk.trim())
        }
      }
    }

    return finalChunks.filter((chunk) => chunk.trim().length > 100)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/chunkers/index.ts

```typescript
export { DocsChunker } from './docs-chunker'
export { JsonYamlChunker } from './json-yaml-chunker'
export { StructuredDataChunker } from './structured-data-chunker'
export { TextChunker } from './text-chunker'
export * from './types'
```

--------------------------------------------------------------------------------

---[FILE: json-yaml-chunker.ts]---
Location: sim-main/apps/sim/lib/chunkers/json-yaml-chunker.ts

```typescript
import * as yaml from 'js-yaml'
import type { Chunk, ChunkerOptions } from '@/lib/chunkers/types'
import { createLogger } from '@/lib/logs/console/logger'
import { getAccurateTokenCount } from '@/lib/tokenization'
import { estimateTokenCount } from '@/lib/tokenization/estimators'

const logger = createLogger('JsonYamlChunker')

function getTokenCount(text: string): number {
  try {
    return getAccurateTokenCount(text, 'text-embedding-3-small')
  } catch (error) {
    logger.warn('Tiktoken failed, falling back to estimation')
    const estimate = estimateTokenCount(text)
    return estimate.count
  }
}

/**
 * Configuration for JSON/YAML chunking
 * Reduced limits to ensure we stay well under OpenAI's 8,191 token limit per embedding request
 */
const JSON_YAML_CHUNKING_CONFIG = {
  TARGET_CHUNK_SIZE: 1000, // Target tokens per chunk
  MIN_CHUNK_SIZE: 100, // Minimum tokens per chunk
  MAX_CHUNK_SIZE: 1500, // Maximum tokens per chunk
  MAX_DEPTH_FOR_SPLITTING: 5, // Maximum depth to traverse for splitting
}

export class JsonYamlChunker {
  private chunkSize: number
  private minChunkSize: number

  constructor(options: ChunkerOptions = {}) {
    this.chunkSize = options.chunkSize || JSON_YAML_CHUNKING_CONFIG.TARGET_CHUNK_SIZE
    this.minChunkSize = options.minChunkSize || JSON_YAML_CHUNKING_CONFIG.MIN_CHUNK_SIZE
  }

  /**
   * Check if content is structured JSON/YAML data
   */
  static isStructuredData(content: string): boolean {
    try {
      JSON.parse(content)
      return true
    } catch {
      try {
        yaml.load(content)
        return true
      } catch {
        return false
      }
    }
  }

  /**
   * Chunk JSON/YAML content intelligently based on structure
   */
  async chunk(content: string): Promise<Chunk[]> {
    try {
      let data: any
      try {
        data = JSON.parse(content)
      } catch {
        data = yaml.load(content)
      }
      const chunks = this.chunkStructuredData(data)

      const tokenCounts = chunks.map((c) => c.tokenCount)
      const totalTokens = tokenCounts.reduce((a, b) => a + b, 0)
      const maxTokens = Math.max(...tokenCounts)
      const avgTokens = Math.round(totalTokens / chunks.length)

      logger.info(
        `JSON chunking complete: ${chunks.length} chunks, ${totalTokens} total tokens (avg: ${avgTokens}, max: ${maxTokens})`
      )

      return chunks
    } catch (error) {
      logger.info('JSON parsing failed, falling back to text chunking')
      return this.chunkAsText(content)
    }
  }

  /**
   * Chunk structured data based on its structure
   */
  private chunkStructuredData(data: any, path: string[] = []): Chunk[] {
    const chunks: Chunk[] = []

    if (Array.isArray(data)) {
      return this.chunkArray(data, path)
    }

    if (typeof data === 'object' && data !== null) {
      return this.chunkObject(data, path)
    }

    const content = JSON.stringify(data, null, 2)
    const tokenCount = getTokenCount(content)

    if (tokenCount >= this.minChunkSize) {
      chunks.push({
        text: content,
        tokenCount,
        metadata: {
          startIndex: 0,
          endIndex: content.length,
        },
      })
    }

    return chunks
  }

  /**
   * Chunk an array intelligently
   */
  private chunkArray(arr: any[], path: string[]): Chunk[] {
    const chunks: Chunk[] = []
    let currentBatch: any[] = []
    let currentTokens = 0

    const contextHeader = path.length > 0 ? `// ${path.join('.')}\n` : ''

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const itemStr = JSON.stringify(item, null, 2)
      const itemTokens = getTokenCount(itemStr)

      if (itemTokens > this.chunkSize) {
        if (currentBatch.length > 0) {
          const batchContent = contextHeader + JSON.stringify(currentBatch, null, 2)
          chunks.push({
            text: batchContent,
            tokenCount: getTokenCount(batchContent),
            metadata: {
              startIndex: i - currentBatch.length,
              endIndex: i - 1,
            },
          })
          currentBatch = []
          currentTokens = 0
        }

        if (typeof item === 'object' && item !== null) {
          const subChunks = this.chunkStructuredData(item, [...path, `[${i}]`])
          chunks.push(...subChunks)
        } else {
          chunks.push({
            text: contextHeader + itemStr,
            tokenCount: itemTokens,
            metadata: {
              startIndex: i,
              endIndex: i,
            },
          })
        }
      } else if (currentTokens + itemTokens > this.chunkSize && currentBatch.length > 0) {
        const batchContent = contextHeader + JSON.stringify(currentBatch, null, 2)
        chunks.push({
          text: batchContent,
          tokenCount: getTokenCount(batchContent),
          metadata: {
            startIndex: i - currentBatch.length,
            endIndex: i - 1,
          },
        })
        currentBatch = [item]
        currentTokens = itemTokens
      } else {
        currentBatch.push(item)
        currentTokens += itemTokens
      }
    }

    if (currentBatch.length > 0) {
      const batchContent = contextHeader + JSON.stringify(currentBatch, null, 2)
      chunks.push({
        text: batchContent,
        tokenCount: getTokenCount(batchContent),
        metadata: {
          startIndex: arr.length - currentBatch.length,
          endIndex: arr.length - 1,
        },
      })
    }

    return chunks
  }

  /**
   * Chunk an object intelligently
   */
  private chunkObject(obj: Record<string, any>, path: string[]): Chunk[] {
    const chunks: Chunk[] = []
    const entries = Object.entries(obj)

    const fullContent = JSON.stringify(obj, null, 2)
    const fullTokens = getTokenCount(fullContent)

    if (fullTokens <= this.chunkSize) {
      chunks.push({
        text: fullContent,
        tokenCount: fullTokens,
        metadata: {
          startIndex: 0,
          endIndex: fullContent.length,
        },
      })
      return chunks
    }

    let currentObj: Record<string, any> = {}
    let currentTokens = 0
    let currentKeys: string[] = []

    for (const [key, value] of entries) {
      const valueStr = JSON.stringify({ [key]: value }, null, 2)
      const valueTokens = getTokenCount(valueStr)

      if (valueTokens > this.chunkSize) {
        if (Object.keys(currentObj).length > 0) {
          const objContent = JSON.stringify(currentObj, null, 2)
          chunks.push({
            text: objContent,
            tokenCount: getTokenCount(objContent),
            metadata: {
              startIndex: 0,
              endIndex: objContent.length,
            },
          })
          currentObj = {}
          currentTokens = 0
          currentKeys = []
        }

        if (typeof value === 'object' && value !== null) {
          const subChunks = this.chunkStructuredData(value, [...path, key])
          chunks.push(...subChunks)
        } else {
          chunks.push({
            text: valueStr,
            tokenCount: valueTokens,
            metadata: {
              startIndex: 0,
              endIndex: valueStr.length,
            },
          })
        }
      } else if (
        currentTokens + valueTokens > this.chunkSize &&
        Object.keys(currentObj).length > 0
      ) {
        const objContent = JSON.stringify(currentObj, null, 2)
        chunks.push({
          text: objContent,
          tokenCount: getTokenCount(objContent),
          metadata: {
            startIndex: 0,
            endIndex: objContent.length,
          },
        })
        currentObj = { [key]: value }
        currentTokens = valueTokens
        currentKeys = [key]
      } else {
        currentObj[key] = value
        currentTokens += valueTokens
        currentKeys.push(key)
      }
    }

    if (Object.keys(currentObj).length > 0) {
      const objContent = JSON.stringify(currentObj, null, 2)
      chunks.push({
        text: objContent,
        tokenCount: getTokenCount(objContent),
        metadata: {
          startIndex: 0,
          endIndex: objContent.length,
        },
      })
    }

    return chunks
  }

  /**
   * Fall back to text chunking if JSON parsing fails
   */
  private async chunkAsText(content: string): Promise<Chunk[]> {
    const chunks: Chunk[] = []
    const lines = content.split('\n')
    let currentChunk = ''
    let currentTokens = 0
    let startIndex = 0

    for (const line of lines) {
      const lineTokens = getTokenCount(line)

      if (currentTokens + lineTokens > this.chunkSize && currentChunk) {
        chunks.push({
          text: currentChunk,
          tokenCount: currentTokens,
          metadata: {
            startIndex,
            endIndex: startIndex + currentChunk.length,
          },
        })

        startIndex += currentChunk.length + 1
        currentChunk = line
        currentTokens = lineTokens
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n${line}` : line
        currentTokens += lineTokens
      }
    }

    if (currentChunk && currentTokens >= this.minChunkSize) {
      chunks.push({
        text: currentChunk,
        tokenCount: currentTokens,
        metadata: {
          startIndex,
          endIndex: startIndex + currentChunk.length,
        },
      })
    }

    return chunks
  }

  /**
   * Static method for chunking JSON/YAML data with default options
   */
  static async chunkJsonYaml(content: string, options: ChunkerOptions = {}): Promise<Chunk[]> {
    const chunker = new JsonYamlChunker(options)
    return chunker.chunk(content)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: structured-data-chunker.ts]---
Location: sim-main/apps/sim/lib/chunkers/structured-data-chunker.ts

```typescript
import type { Chunk, StructuredDataOptions } from '@/lib/chunkers/types'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('StructuredDataChunker')

// Configuration for structured data chunking (CSV, XLSX, etc.)
const STRUCTURED_CHUNKING_CONFIG = {
  // Target 2000-3000 tokens per chunk for better semantic meaning
  TARGET_CHUNK_SIZE: 2500,
  MIN_CHUNK_SIZE: 500,
  MAX_CHUNK_SIZE: 4000,

  // For spreadsheets, group rows together
  ROWS_PER_CHUNK: 100, // Start with 100 rows per chunk
  MIN_ROWS_PER_CHUNK: 20,
  MAX_ROWS_PER_CHUNK: 500,

  // For better embeddings quality
  INCLUDE_HEADERS_IN_EACH_CHUNK: true,
  MAX_HEADER_SIZE: 200, // tokens
}

/**
 * Smart chunker for structured data (CSV, XLSX) that preserves semantic meaning
 */
export class StructuredDataChunker {
  /**
   * Chunk structured data intelligently based on rows and semantic boundaries
   */
  static async chunkStructuredData(
    content: string,
    options: StructuredDataOptions = {}
  ): Promise<Chunk[]> {
    const chunks: Chunk[] = []
    const lines = content.split('\n').filter((line) => line.trim())

    if (lines.length === 0) {
      return chunks
    }

    // Detect headers (first line or provided)
    const headerLine = options.headers?.join('\t') || lines[0]
    const dataStartIndex = options.headers ? 0 : 1

    // Calculate optimal rows per chunk based on content
    const estimatedTokensPerRow = StructuredDataChunker.estimateTokensPerRow(
      lines.slice(dataStartIndex, Math.min(10, lines.length))
    )
    const optimalRowsPerChunk =
      StructuredDataChunker.calculateOptimalRowsPerChunk(estimatedTokensPerRow)

    logger.info(
      `Structured data chunking: ${lines.length} rows, ~${estimatedTokensPerRow} tokens/row, ${optimalRowsPerChunk} rows/chunk`
    )

    let currentChunkRows: string[] = []
    let currentTokenEstimate = 0
    const headerTokens = StructuredDataChunker.estimateTokens(headerLine)
    let chunkStartRow = dataStartIndex

    for (let i = dataStartIndex; i < lines.length; i++) {
      const row = lines[i]
      const rowTokens = StructuredDataChunker.estimateTokens(row)

      // Check if adding this row would exceed our target
      const projectedTokens =
        currentTokenEstimate +
        rowTokens +
        (STRUCTURED_CHUNKING_CONFIG.INCLUDE_HEADERS_IN_EACH_CHUNK ? headerTokens : 0)

      const shouldCreateChunk =
        (projectedTokens > STRUCTURED_CHUNKING_CONFIG.TARGET_CHUNK_SIZE &&
          currentChunkRows.length >= STRUCTURED_CHUNKING_CONFIG.MIN_ROWS_PER_CHUNK) ||
        currentChunkRows.length >= optimalRowsPerChunk

      if (shouldCreateChunk && currentChunkRows.length > 0) {
        // Create chunk with current rows
        const chunkContent = StructuredDataChunker.formatChunk(
          headerLine,
          currentChunkRows,
          options.sheetName
        )
        chunks.push(StructuredDataChunker.createChunk(chunkContent, chunkStartRow, i - 1))

        // Reset for next chunk
        currentChunkRows = []
        currentTokenEstimate = 0
        chunkStartRow = i
      }

      currentChunkRows.push(row)
      currentTokenEstimate += rowTokens
    }

    // Add remaining rows as final chunk
    if (currentChunkRows.length > 0) {
      const chunkContent = StructuredDataChunker.formatChunk(
        headerLine,
        currentChunkRows,
        options.sheetName
      )
      chunks.push(StructuredDataChunker.createChunk(chunkContent, chunkStartRow, lines.length - 1))
    }

    logger.info(`Created ${chunks.length} chunks from ${lines.length} rows of structured data`)

    return chunks
  }

  /**
   * Format a chunk with headers and context
   */
  private static formatChunk(headerLine: string, rows: string[], sheetName?: string): string {
    let content = ''

    // Add sheet name context if available
    if (sheetName) {
      content += `=== ${sheetName} ===\n\n`
    }

    // Add headers for context
    if (STRUCTURED_CHUNKING_CONFIG.INCLUDE_HEADERS_IN_EACH_CHUNK) {
      content += `Headers: ${headerLine}\n`
      content += `${'-'.repeat(Math.min(80, headerLine.length))}\n`
    }

    // Add data rows
    content += rows.join('\n')

    // Add row count for context
    content += `\n\n[Rows ${rows.length} of data]`

    return content
  }

  /**
   * Create a chunk object with actual row indices
   */
  private static createChunk(content: string, startRow: number, endRow: number): Chunk {
    const tokenCount = StructuredDataChunker.estimateTokens(content)

    return {
      text: content,
      tokenCount,
      metadata: {
        startIndex: startRow,
        endIndex: endRow,
      },
    }
  }

  /**
   * Estimate tokens in text (rough approximation)
   */
  private static estimateTokens(text: string): number {
    // Rough estimate: 1 token per 4 characters for English text
    // For structured data with numbers, it's closer to 1 token per 3 characters
    return Math.ceil(text.length / 3)
  }

  /**
   * Estimate average tokens per row from sample
   */
  private static estimateTokensPerRow(sampleRows: string[]): number {
    if (sampleRows.length === 0) return 50 // default estimate

    const totalTokens = sampleRows.reduce(
      (sum, row) => sum + StructuredDataChunker.estimateTokens(row),
      0
    )
    return Math.ceil(totalTokens / sampleRows.length)
  }

  /**
   * Calculate optimal rows per chunk based on token estimates
   */
  private static calculateOptimalRowsPerChunk(tokensPerRow: number): number {
    const optimal = Math.floor(STRUCTURED_CHUNKING_CONFIG.TARGET_CHUNK_SIZE / tokensPerRow)

    return Math.min(
      Math.max(optimal, STRUCTURED_CHUNKING_CONFIG.MIN_ROWS_PER_CHUNK),
      STRUCTURED_CHUNKING_CONFIG.MAX_ROWS_PER_CHUNK
    )
  }

  /**
   * Check if content appears to be structured data
   */
  static isStructuredData(content: string, mimeType?: string): boolean {
    // Check mime type first
    if (mimeType) {
      const structuredMimeTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/tab-separated-values',
      ]
      if (structuredMimeTypes.includes(mimeType)) {
        return true
      }
    }

    // Check content structure
    const lines = content.split('\n').slice(0, 10) // Check first 10 lines
    if (lines.length < 2) return false

    // Check for consistent delimiters (comma, tab, pipe)
    const delimiters = [',', '\t', '|']
    for (const delimiter of delimiters) {
      const counts = lines.map(
        (line) => (line.match(new RegExp(`\\${delimiter}`, 'g')) || []).length
      )
      const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length

      // If most lines have similar delimiter counts, it's likely structured
      if (avgCount > 2 && counts.every((c) => Math.abs(c - avgCount) <= 2)) {
        return true
      }
    }

    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: text-chunker.ts]---
Location: sim-main/apps/sim/lib/chunkers/text-chunker.ts

```typescript
import type { Chunk, ChunkerOptions } from '@/lib/chunkers/types'

/**
 * Lightweight text chunker optimized for RAG applications
 * Uses hierarchical splitting with simple character-based token estimation
 */
export class TextChunker {
  private readonly chunkSize: number
  private readonly minChunkSize: number
  private readonly overlap: number

  // Hierarchical separators ordered from largest to smallest semantic units
  private readonly separators = [
    '\n\n\n', // Document sections
    '\n---\n', // Markdown horizontal rules
    '\n***\n', // Markdown horizontal rules (alternative)
    '\n___\n', // Markdown horizontal rules (alternative)
    '\n# ', // Markdown H1 headings
    '\n## ', // Markdown H2 headings
    '\n### ', // Markdown H3 headings
    '\n#### ', // Markdown H4 headings
    '\n##### ', // Markdown H5 headings
    '\n###### ', // Markdown H6 headings
    '\n\n', // Paragraphs
    '\n', // Lines
    '. ', // Sentences
    '! ', // Exclamations
    '? ', // Questions
    '; ', // Semicolons
    ', ', // Commas
    ' ', // Words
  ]

  constructor(options: ChunkerOptions = {}) {
    this.chunkSize = options.chunkSize ?? 512
    this.minChunkSize = options.minChunkSize ?? 1
    this.overlap = options.overlap ?? 0
  }

  /**
   * Simple token estimation using character count
   */
  private estimateTokens(text: string): number {
    // Handle empty or whitespace-only text
    if (!text?.trim()) return 0

    // Simple estimation: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  /**
   * Split text recursively using hierarchical separators
   */
  private async splitRecursively(text: string, separatorIndex = 0): Promise<string[]> {
    const tokenCount = this.estimateTokens(text)

    // If chunk is small enough, return it
    if (tokenCount <= this.chunkSize) {
      return text.length >= this.minChunkSize ? [text] : []
    }

    // If we've run out of separators, force split by character count
    if (separatorIndex >= this.separators.length) {
      const chunks: string[] = []
      const targetLength = Math.ceil((text.length * this.chunkSize) / tokenCount)

      for (let i = 0; i < text.length; i += targetLength) {
        const chunk = text.slice(i, i + targetLength).trim()
        if (chunk.length >= this.minChunkSize) {
          chunks.push(chunk)
        }
      }
      return chunks
    }

    const separator = this.separators[separatorIndex]
    const parts = text.split(separator).filter((part) => part.trim())

    // If no split occurred, try next separator
    if (parts.length <= 1) {
      return await this.splitRecursively(text, separatorIndex + 1)
    }

    const chunks: string[] = []
    let currentChunk = ''

    for (const part of parts) {
      const testChunk = currentChunk + (currentChunk ? separator : '') + part

      if (this.estimateTokens(testChunk) <= this.chunkSize) {
        currentChunk = testChunk
      } else {
        // Save current chunk if it meets minimum size
        if (currentChunk.trim() && currentChunk.length >= this.minChunkSize) {
          chunks.push(currentChunk.trim())
        }

        // Start new chunk with current part
        // If part itself is too large, split it further
        if (this.estimateTokens(part) > this.chunkSize) {
          chunks.push(...(await this.splitRecursively(part, separatorIndex + 1)))
          currentChunk = ''
        } else {
          currentChunk = part
        }
      }
    }

    // Add final chunk if it exists and meets minimum size
    if (currentChunk.trim() && currentChunk.length >= this.minChunkSize) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  /**
   * Add overlap between chunks if specified
   */
  private addOverlap(chunks: string[]): string[] {
    if (this.overlap <= 0 || chunks.length <= 1) {
      return chunks
    }

    const overlappedChunks: string[] = []

    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i]

      // Add overlap from previous chunk
      if (i > 0) {
        const prevChunk = chunks[i - 1]
        const words = prevChunk.split(/\s+/)
        const overlapWords = words.slice(-Math.min(this.overlap, words.length))

        if (overlapWords.length > 0) {
          chunk = `${overlapWords.join(' ')} ${chunk}`
        }
      }

      overlappedChunks.push(chunk)
    }

    return overlappedChunks
  }

  /**
   * Clean and normalize text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize Windows line endings
      .replace(/\r/g, '\n') // Normalize old Mac line endings
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .replace(/\t/g, ' ') // Convert tabs to spaces
      .replace(/ {2,}/g, ' ') // Collapse multiple spaces
      .trim()
  }

  /**
   * Main chunking method
   */
  async chunk(text: string): Promise<Chunk[]> {
    if (!text?.trim()) {
      return []
    }

    // Clean the text
    const cleanedText = this.cleanText(text)

    // Split into chunks
    let chunks = await this.splitRecursively(cleanedText)

    // Add overlap if configured
    chunks = this.addOverlap(chunks)

    // Convert to Chunk objects with metadata
    let previousEndIndex = 0
    const chunkPromises = chunks.map(async (chunkText, index) => {
      let startIndex: number
      let actualContentLength: number

      if (index === 0 || this.overlap <= 0) {
        // First chunk or no overlap - start from previous end
        startIndex = previousEndIndex
        actualContentLength = chunkText.length
      } else {
        // Calculate overlap length in characters
        const prevChunk = chunks[index - 1]
        const prevWords = prevChunk.split(/\s+/)
        const overlapWords = prevWords.slice(-Math.min(this.overlap, prevWords.length))
        const overlapLength = Math.min(
          chunkText.length,
          overlapWords.length > 0 ? overlapWords.join(' ').length + 1 : 0 // +1 for space
        )

        startIndex = previousEndIndex - overlapLength
        actualContentLength = chunkText.length - overlapLength
      }

      const safeStart = Math.max(0, startIndex)
      const endIndexSafe = safeStart + actualContentLength

      const chunk: Chunk = {
        text: chunkText,
        tokenCount: this.estimateTokens(chunkText),
        metadata: {
          startIndex: safeStart,
          endIndex: endIndexSafe,
        },
      }

      previousEndIndex = endIndexSafe
      return chunk
    })

    return await Promise.all(chunkPromises)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/chunkers/types.ts

```typescript
export interface ChunkMetadata {
  startIndex: number
  endIndex: number
  tokenCount: number
}

export interface TextChunk {
  text: string
  metadata: ChunkMetadata
}

export interface ChunkerOptions {
  chunkSize?: number
  minChunkSize?: number
  overlap?: number
}

export interface Chunk {
  text: string
  tokenCount: number
  metadata: {
    startIndex: number
    endIndex: number
  }
}

export interface StructuredDataOptions {
  headers?: string[]
  totalRows?: number
  sheetName?: string
}

export interface DocChunk {
  text: string
  tokenCount: number
  sourceDocument: string
  headerLink: string
  headerText: string
  headerLevel: number
  embedding: number[]
  embeddingModel: string
  metadata: {
    sourceUrl?: string
    headers?: string[]
    title?: string
    startIndex: number
    endIndex: number
  }
}

export interface DocsChunkerOptions extends ChunkerOptions {
  baseUrl?: string
}
```

--------------------------------------------------------------------------------

````

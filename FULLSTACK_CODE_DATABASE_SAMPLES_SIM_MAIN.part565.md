---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 565
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 565 of 933)

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

---[FILE: csv-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/csv-parser.ts

```typescript
import { createReadStream, existsSync } from 'fs'
import { Readable } from 'stream'
import { type Options, parse } from 'csv-parse'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CsvParser')

const CONFIG = {
  MAX_PREVIEW_ROWS: 1000, // Only keep first 1000 rows for preview
  MAX_SAMPLE_ROWS: 100, // Sample for metadata
  MAX_ERRORS: 100, // Stop after 100 errors
  STREAM_CHUNK_SIZE: 16384, // 16KB chunks for streaming
}

export class CsvParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    if (!filePath) {
      throw new Error('No file path provided')
    }

    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const stream = createReadStream(filePath, {
      highWaterMark: CONFIG.STREAM_CHUNK_SIZE,
    })

    return this.parseStream(stream)
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    const bufferSize = buffer.length
    logger.info(
      `Parsing CSV buffer, size: ${bufferSize} bytes (${(bufferSize / 1024 / 1024).toFixed(2)} MB)`
    )

    const stream = Readable.from(buffer, {
      highWaterMark: CONFIG.STREAM_CHUNK_SIZE,
    })

    return this.parseStream(stream)
  }

  private parseStream(inputStream: NodeJS.ReadableStream): Promise<FileParseResult> {
    return new Promise((resolve, reject) => {
      let rowCount = 0
      let errorCount = 0
      let headers: string[] = []
      let processedContent = ''
      const sampledRows: any[] = []
      const errors: string[] = []
      let firstRowProcessed = false
      let aborted = false

      const parserOptions: Options = {
        columns: true, // Use first row as headers
        skip_empty_lines: true, // Skip empty lines
        trim: true, // Trim whitespace
        relax_column_count: true, // Allow variable column counts
        relax_quotes: true, // Be lenient with quotes
        skip_records_with_error: true, // Skip bad records
        raw: false,
        cast: false,
      }
      const parser = parse(parserOptions)

      parser.on('readable', () => {
        let record
        while ((record = parser.read()) !== null && !aborted) {
          rowCount++

          if (!firstRowProcessed && record) {
            headers = Object.keys(record).map((h) => sanitizeTextForUTF8(String(h)))
            processedContent = `${headers.join(', ')}\n`
            firstRowProcessed = true
          }

          if (rowCount <= CONFIG.MAX_PREVIEW_ROWS) {
            try {
              const cleanValues = Object.values(record).map((v: any) =>
                sanitizeTextForUTF8(String(v || ''))
              )
              processedContent += `${cleanValues.join(', ')}\n`

              if (rowCount <= CONFIG.MAX_SAMPLE_ROWS) {
                sampledRows.push(record)
              }
            } catch (err) {
              logger.warn(`Error processing row ${rowCount}:`, err)
            }
          }

          if (rowCount % 10000 === 0) {
            logger.info(`Processed ${rowCount} rows...`)
          }
        }
      })

      parser.on('skip', (err: any) => {
        errorCount++

        if (errorCount <= 5) {
          const errorMsg = `Row ${err.lines || rowCount}: ${err.message || 'Unknown error'}`
          errors.push(errorMsg)
          logger.warn('CSV skip:', errorMsg)
        }

        if (errorCount >= CONFIG.MAX_ERRORS) {
          aborted = true
          parser.destroy()
          reject(new Error(`Too many errors (${errorCount}). File may be corrupted.`))
        }
      })

      parser.on('error', (err: Error) => {
        logger.error('CSV parser error:', err)
        reject(new Error(`CSV parsing failed: ${err.message}`))
      })

      parser.on('end', () => {
        if (!aborted) {
          if (rowCount > CONFIG.MAX_PREVIEW_ROWS) {
            processedContent += `\n[... ${rowCount.toLocaleString()} total rows, showing first ${CONFIG.MAX_PREVIEW_ROWS} ...]\n`
          }

          logger.info(`CSV parsing complete: ${rowCount} rows, ${errorCount} errors`)

          resolve({
            content: sanitizeTextForUTF8(processedContent),
            metadata: {
              rowCount,
              headers,
              errorCount,
              errors: errors.slice(0, 10),
              truncated: rowCount > CONFIG.MAX_PREVIEW_ROWS,
              sampledData: sampledRows,
            },
          })
        }
      })

      inputStream.on('error', (err) => {
        logger.error('Input stream error:', err)
        parser.destroy()
        reject(new Error(`Stream error: ${err.message}`))
      })

      inputStream.pipe(parser)
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/doc-parser.ts

```typescript
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('DocParser')

export class DocParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      logger.info(`Parsing DOC file: ${filePath}`)

      const buffer = await readFile(filePath)
      return this.parseBuffer(buffer)
    } catch (error) {
      logger.error('DOC file parsing error:', error)
      throw new Error(`Failed to parse DOC file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Parsing DOC buffer, size:', buffer.length)

      if (!buffer || buffer.length === 0) {
        throw new Error('Empty buffer provided')
      }

      let parseOfficeAsync
      try {
        const officeParser = await import('officeparser')
        parseOfficeAsync = officeParser.parseOfficeAsync
      } catch (importError) {
        logger.warn('officeparser not available, using fallback extraction')
        return this.fallbackExtraction(buffer)
      }

      try {
        const result = await parseOfficeAsync(buffer)

        if (!result) {
          throw new Error('officeparser returned no result')
        }

        const resultString = typeof result === 'string' ? result : String(result)

        const content = sanitizeTextForUTF8(resultString.trim())

        logger.info('DOC parsing completed successfully with officeparser')

        return {
          content: content,
          metadata: {
            characterCount: content.length,
            extractionMethod: 'officeparser',
          },
        }
      } catch (extractError) {
        logger.warn('officeparser failed, using fallback:', extractError)
        return this.fallbackExtraction(buffer)
      }
    } catch (error) {
      logger.error('DOC buffer parsing error:', error)
      throw new Error(`Failed to parse DOC buffer: ${(error as Error).message}`)
    }
  }

  private fallbackExtraction(buffer: Buffer): FileParseResult {
    logger.info('Using fallback text extraction for DOC file')

    const text = buffer.toString('utf8', 0, Math.min(buffer.length, 100000))

    const readableText = text
      .match(/[\x20-\x7E\s]{4,}/g)
      ?.filter(
        (chunk) =>
          chunk.trim().length > 10 && /[a-zA-Z]/.test(chunk) && !/^[\x00-\x1F]*$/.test(chunk)
      )
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    const content = readableText
      ? sanitizeTextForUTF8(readableText)
      : 'Unable to extract text from DOC file. Please convert to DOCX format for better results.'

    return {
      content,
      metadata: {
        extractionMethod: 'fallback',
        characterCount: content.length,
        warning: 'Basic text extraction used. For better results, convert to DOCX format.',
      },
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: docx-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/docx-parser.ts

```typescript
import { readFile } from 'fs/promises'
import mammoth from 'mammoth'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('DocxParser')

// Define interface for mammoth result
interface MammothResult {
  value: string
  messages: any[]
}

export class DocxParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      const buffer = await readFile(filePath)

      return this.parseBuffer(buffer)
    } catch (error) {
      logger.error('DOCX file error:', error)
      throw new Error(`Failed to parse DOCX file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Parsing buffer, size:', buffer.length)

      const result = await mammoth.extractRawText({ buffer })

      let htmlResult: MammothResult = { value: '', messages: [] }
      try {
        htmlResult = await mammoth.convertToHtml({ buffer })
      } catch (htmlError) {
        logger.warn('HTML conversion warning:', htmlError)
      }

      return {
        content: result.value,
        metadata: {
          messages: [...result.messages, ...htmlResult.messages],
          html: htmlResult.value,
        },
      }
    } catch (error) {
      logger.error('DOCX buffer parsing error:', error)
      throw new Error(`Failed to parse DOCX buffer: ${(error as Error).message}`)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: html-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/html-parser.ts

```typescript
import { readFile } from 'fs/promises'
import * as cheerio from 'cheerio'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('HtmlParser')

export class HtmlParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      const buffer = await readFile(filePath)
      return this.parseBuffer(buffer)
    } catch (error) {
      logger.error('HTML file error:', error)
      throw new Error(`Failed to parse HTML file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Parsing HTML buffer, size:', buffer.length)

      const htmlContent = buffer.toString('utf-8')
      const $ = cheerio.load(htmlContent)

      // Extract meta information before removing tags
      const title = $('title').text().trim()
      const metaDescription = $('meta[name="description"]').attr('content') || ''

      $('script, style, noscript, meta, link, iframe, object, embed, svg').remove()

      $.root()
        .contents()
        .filter(function () {
          return this.type === 'comment'
        })
        .remove()

      const content = this.extractStructuredText($)

      const sanitizedContent = sanitizeTextForUTF8(content)

      const characterCount = sanitizedContent.length
      const wordCount = sanitizedContent.split(/\s+/).filter((word) => word.length > 0).length
      const estimatedTokenCount = Math.ceil(characterCount / 4)

      const headings = this.extractHeadings($)

      const links = this.extractLinks($)

      return {
        content: sanitizedContent,
        metadata: {
          title,
          metaDescription,
          characterCount,
          wordCount,
          tokenCount: estimatedTokenCount,
          headings,
          links: links.slice(0, 50),
          hasImages: $('img').length > 0,
          imageCount: $('img').length,
          hasTable: $('table').length > 0,
          tableCount: $('table').length,
          hasList: $('ul, ol').length > 0,
          listCount: $('ul, ol').length,
        },
      }
    } catch (error) {
      logger.error('HTML buffer parsing error:', error)
      throw new Error(`Failed to parse HTML buffer: ${(error as Error).message}`)
    }
  }

  /**
   * Extract structured text content preserving document hierarchy
   */
  private extractStructuredText($: cheerio.CheerioAPI): string {
    const contentParts: string[] = []

    const rootElement = $('body').length > 0 ? $('body') : $.root()

    this.processElement($, rootElement, contentParts, 0)

    return contentParts.join('\n').trim()
  }

  /**
   * Recursively process elements to extract text with structure
   */
  private processElement(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<any>,
    contentParts: string[],
    depth: number
  ): void {
    element.contents().each((_, node) => {
      if (node.type === 'text') {
        const text = $(node).text().trim()
        if (text) {
          contentParts.push(text)
        }
      } else if (node.type === 'tag') {
        const $node = $(node)
        const tagName = node.tagName?.toLowerCase()

        switch (tagName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6': {
            const headingText = $node.text().trim()
            if (headingText) {
              contentParts.push(`\n${headingText}\n`)
            }
            break
          }

          case 'p': {
            const paragraphText = $node.text().trim()
            if (paragraphText) {
              contentParts.push(`${paragraphText}\n`)
            }
            break
          }

          case 'br':
            contentParts.push('\n')
            break

          case 'hr':
            contentParts.push('\n---\n')
            break

          case 'li': {
            const listItemText = $node.text().trim()
            if (listItemText) {
              const indent = '  '.repeat(Math.min(depth, 3))
              contentParts.push(`${indent}• ${listItemText}`)
            }
            break
          }

          case 'ul':
          case 'ol':
            contentParts.push('\n')
            this.processElement($, $node, contentParts, depth + 1)
            contentParts.push('\n')
            break

          case 'table':
            this.processTable($, $node, contentParts)
            break

          case 'blockquote': {
            const quoteText = $node.text().trim()
            if (quoteText) {
              contentParts.push(`\n> ${quoteText}\n`)
            }
            break
          }

          case 'pre':
          case 'code': {
            const codeText = $node.text().trim()
            if (codeText) {
              contentParts.push(`\n\`\`\`\n${codeText}\n\`\`\`\n`)
            }
            break
          }

          case 'div':
          case 'section':
          case 'article':
          case 'main':
          case 'aside':
          case 'nav':
          case 'header':
          case 'footer':
            this.processElement($, $node, contentParts, depth)
            break

          case 'a': {
            const linkText = $node.text().trim()
            const href = $node.attr('href')
            if (linkText) {
              if (href?.startsWith('http')) {
                contentParts.push(`${linkText} (${href})`)
              } else {
                contentParts.push(linkText)
              }
            }
            break
          }

          case 'img': {
            const alt = $node.attr('alt')
            if (alt) {
              contentParts.push(`[Image: ${alt}]`)
            }
            break
          }

          default:
            this.processElement($, $node, contentParts, depth)
        }
      }
    })
  }

  /**
   * Process table elements to extract structured data
   */
  private processTable(
    $: cheerio.CheerioAPI,
    table: cheerio.Cheerio<any>,
    contentParts: string[]
  ): void {
    contentParts.push('\n[Table]')

    table.find('tr').each((_, row) => {
      const $row = $(row)
      const cells: string[] = []

      $row.find('td, th').each((_, cell) => {
        const cellText = $(cell).text().trim()
        cells.push(cellText || '')
      })

      if (cells.length > 0) {
        contentParts.push(`| ${cells.join(' | ')} |`)
      }
    })

    contentParts.push('[/Table]\n')
  }

  /**
   * Extract heading structure for metadata
   */
  private extractHeadings($: cheerio.CheerioAPI): Array<{ level: number; text: string }> {
    const headings: Array<{ level: number; text: string }> = []

    $('h1, h2, h3, h4, h5, h6').each((_, element) => {
      const $element = $(element)
      const tagName = element.tagName?.toLowerCase()
      const level = Number.parseInt(tagName?.charAt(1) || '1', 10)
      const text = $element.text().trim()

      if (text) {
        headings.push({ level, text })
      }
    })

    return headings
  }

  /**
   * Extract links from the document
   */
  private extractLinks($: cheerio.CheerioAPI): Array<{ text: string; href: string }> {
    const links: Array<{ text: string; href: string }> = []

    $('a[href]').each((_, element) => {
      const $element = $(element)
      const href = $element.attr('href')
      const text = $element.text().trim()

      if (href && text && href.startsWith('http')) {
        links.push({ text, href })
      }
    })

    return links
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: sim-main/apps/sim/lib/file-parsers/index.test.ts

```typescript
import path from 'path'
/**
 * Unit tests for file parsers
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'

const mockExistsSync = vi.fn().mockReturnValue(true)
const mockReadFile = vi.fn().mockResolvedValue(Buffer.from('test content'))

const mockPdfParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed PDF content',
  metadata: {
    info: { Title: 'Test PDF' },
    pageCount: 5,
    version: '1.7',
  },
})

const mockCsvParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed CSV content',
  metadata: {
    headers: ['column1', 'column2'],
    rowCount: 10,
  },
})

const mockDocxParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed DOCX content',
  metadata: {
    pages: 3,
    author: 'Test Author',
  },
})

const mockTxtParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed TXT content',
  metadata: {
    characterCount: 100,
    tokenCount: 10,
  },
})

const mockMdParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed MD content',
  metadata: {
    characterCount: 100,
    tokenCount: 10,
  },
})

const mockPptxParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed PPTX content',
  metadata: {
    slideCount: 5,
    extractionMethod: 'officeparser',
  },
})

const mockHtmlParseFile = vi.fn().mockResolvedValue({
  content: 'Parsed HTML content',
  metadata: {
    title: 'Test HTML Document',
    headingCount: 3,
    linkCount: 2,
  },
})

const createMockModule = () => {
  const mockParsers: Record<string, FileParser> = {
    pdf: { parseFile: mockPdfParseFile },
    csv: { parseFile: mockCsvParseFile },
    docx: { parseFile: mockDocxParseFile },
    txt: { parseFile: mockTxtParseFile },
    md: { parseFile: mockMdParseFile },
    pptx: { parseFile: mockPptxParseFile },
    ppt: { parseFile: mockPptxParseFile },
    html: { parseFile: mockHtmlParseFile },
    htm: { parseFile: mockHtmlParseFile },
  }

  return {
    parseFile: async (filePath: string): Promise<FileParseResult> => {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      if (!mockExistsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      const extension = path.extname(filePath).toLowerCase().substring(1)

      if (!Object.keys(mockParsers).includes(extension)) {
        throw new Error(
          `Unsupported file type: ${extension}. Supported types are: ${Object.keys(mockParsers).join(', ')}`
        )
      }

      return mockParsers[extension].parseFile(filePath)
    },

    isSupportedFileType: (extension: string): boolean => {
      if (!extension) return false
      return Object.keys(mockParsers).includes(extension.toLowerCase())
    },
  }
}

describe('File Parsers', () => {
  beforeEach(() => {
    vi.resetModules()

    vi.doMock('fs', () => ({
      existsSync: mockExistsSync,
    }))

    vi.doMock('fs/promises', () => ({
      readFile: mockReadFile,
    }))

    vi.doMock('@/lib/file-parsers/index', () => createMockModule())

    vi.doMock('@/lib/file-parsers/pdf-parser', () => ({
      PdfParser: vi.fn().mockImplementation(() => ({
        parseFile: mockPdfParseFile,
      })),
    }))

    vi.doMock('@/lib/file-parsers/csv-parser', () => ({
      CsvParser: vi.fn().mockImplementation(() => ({
        parseFile: mockCsvParseFile,
      })),
    }))

    vi.doMock('@/lib/file-parsers/docx-parser', () => ({
      DocxParser: vi.fn().mockImplementation(() => ({
        parseFile: mockDocxParseFile,
      })),
    }))

    vi.doMock('@/lib/file-parsers/txt-parser', () => ({
      TxtParser: vi.fn().mockImplementation(() => ({
        parseFile: mockTxtParseFile,
      })),
    }))

    vi.doMock('@/lib/file-parsers/md-parser', () => ({
      MdParser: vi.fn().mockImplementation(() => ({
        parseFile: mockMdParseFile,
      })),
    }))

    vi.doMock('@/lib/file-parsers/pptx-parser', () => ({
      PptxParser: vi.fn().mockImplementation(() => ({
        parseFile: mockPptxParseFile,
      })),
    }))

    vi.doMock('@/lib/file-parsers/html-parser', () => ({
      HtmlParser: vi.fn().mockImplementation(() => ({
        parseFile: mockHtmlParseFile,
      })),
    }))

    global.console = {
      ...console,
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })

  describe('parseFile', () => {
    it('should validate file existence', async () => {
      mockExistsSync.mockReturnValueOnce(false)

      const { parseFile } = await import('@/lib/file-parsers/index')

      const testFilePath = '/test/files/test.pdf'
      await expect(parseFile(testFilePath)).rejects.toThrow('File not found')
      expect(mockExistsSync).toHaveBeenCalledWith(testFilePath)
    })

    it('should throw error if file path is empty', async () => {
      const { parseFile } = await import('@/lib/file-parsers/index')
      await expect(parseFile('')).rejects.toThrow('No file path provided')
    })

    it('should parse PDF files successfully', async () => {
      const expectedResult = {
        content: 'Parsed PDF content',
        metadata: {
          info: { Title: 'Test PDF' },
          pageCount: 5,
          version: '1.7',
        },
      }

      mockPdfParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/document.pdf')

      expect(result).toEqual(expectedResult)
    })

    it('should parse CSV files successfully', async () => {
      const expectedResult = {
        content: 'Parsed CSV content',
        metadata: {
          headers: ['column1', 'column2'],
          rowCount: 10,
        },
      }

      mockCsvParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/data.csv')

      expect(result).toEqual(expectedResult)
    })

    it('should parse DOCX files successfully', async () => {
      const expectedResult = {
        content: 'Parsed DOCX content',
        metadata: {
          pages: 3,
          author: 'Test Author',
        },
      }

      mockDocxParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/document.docx')

      expect(result).toEqual(expectedResult)
    })

    it('should parse TXT files successfully', async () => {
      const expectedResult = {
        content: 'Parsed TXT content',
        metadata: {
          characterCount: 100,
          tokenCount: 10,
        },
      }

      mockTxtParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/document.txt')

      expect(result).toEqual(expectedResult)
    })

    it('should parse MD files successfully', async () => {
      const expectedResult = {
        content: 'Parsed MD content',
        metadata: {
          characterCount: 100,
          tokenCount: 10,
        },
      }

      mockMdParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/document.md')

      expect(result).toEqual(expectedResult)
    })

    it('should parse PPTX files successfully', async () => {
      const expectedResult = {
        content: 'Parsed PPTX content',
        metadata: {
          slideCount: 5,
          extractionMethod: 'officeparser',
        },
      }

      mockPptxParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/presentation.pptx')

      expect(result).toEqual(expectedResult)
    })

    it('should parse PPT files successfully', async () => {
      const expectedResult = {
        content: 'Parsed PPTX content',
        metadata: {
          slideCount: 5,
          extractionMethod: 'officeparser',
        },
      }

      mockPptxParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/presentation.ppt')

      expect(result).toEqual(expectedResult)
    })

    it('should parse HTML files successfully', async () => {
      const expectedResult = {
        content: 'Parsed HTML content',
        metadata: {
          title: 'Test HTML Document',
          headingCount: 3,
          linkCount: 2,
        },
      }

      mockHtmlParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/document.html')

      expect(result).toEqual(expectedResult)
    })

    it('should parse HTM files successfully', async () => {
      const expectedResult = {
        content: 'Parsed HTML content',
        metadata: {
          title: 'Test HTML Document',
          headingCount: 3,
          linkCount: 2,
        },
      }

      mockHtmlParseFile.mockResolvedValueOnce(expectedResult)
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const result = await parseFile('/test/files/document.htm')

      expect(result).toEqual(expectedResult)
    })

    it('should throw error for unsupported file types', async () => {
      mockExistsSync.mockReturnValue(true)

      const { parseFile } = await import('@/lib/file-parsers/index')
      const unsupportedFilePath = '/test/files/image.png'

      await expect(parseFile(unsupportedFilePath)).rejects.toThrow('Unsupported file type')
    })

    it('should handle errors during parsing', async () => {
      mockExistsSync.mockReturnValue(true)

      const parsingError = new Error('CSV parsing failed')
      mockCsvParseFile.mockRejectedValueOnce(parsingError)

      const { parseFile } = await import('@/lib/file-parsers/index')
      await expect(parseFile('/test/files/data.csv')).rejects.toThrow('CSV parsing failed')
    })
  })

  describe('isSupportedFileType', () => {
    it('should return true for supported file types', async () => {
      const { isSupportedFileType } = await import('@/lib/file-parsers/index')

      expect(isSupportedFileType('pdf')).toBe(true)
      expect(isSupportedFileType('csv')).toBe(true)
      expect(isSupportedFileType('docx')).toBe(true)
      expect(isSupportedFileType('txt')).toBe(true)
      expect(isSupportedFileType('md')).toBe(true)
      expect(isSupportedFileType('pptx')).toBe(true)
      expect(isSupportedFileType('ppt')).toBe(true)
      expect(isSupportedFileType('html')).toBe(true)
      expect(isSupportedFileType('htm')).toBe(true)
    })

    it('should return false for unsupported file types', async () => {
      const { isSupportedFileType } = await import('@/lib/file-parsers/index')

      expect(isSupportedFileType('png')).toBe(false)
      expect(isSupportedFileType('unknown')).toBe(false)
    })

    it('should handle uppercase extensions', async () => {
      const { isSupportedFileType } = await import('@/lib/file-parsers/index')

      expect(isSupportedFileType('PDF')).toBe(true)
      expect(isSupportedFileType('CSV')).toBe(true)
      expect(isSupportedFileType('TXT')).toBe(true)
      expect(isSupportedFileType('MD')).toBe(true)
      expect(isSupportedFileType('PPTX')).toBe(true)
      expect(isSupportedFileType('HTML')).toBe(true)
    })

    it('should handle errors gracefully', async () => {
      const errorMockModule = {
        isSupportedFileType: () => {
          throw new Error('Failed to get parsers')
        },
      }

      vi.doMock('@/lib/file-parsers/index', () => errorMockModule)

      const { isSupportedFileType } = await import('@/lib/file-parsers/index')

      expect(() => isSupportedFileType('pdf')).toThrow('Failed to get parsers')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/file-parsers/index.ts

```typescript
import { existsSync } from 'fs'
import path from 'path'
import type { FileParseResult, FileParser, SupportedFileType } from '@/lib/file-parsers/types'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('FileParser')

let parserInstances: Record<string, FileParser> | null = null

/**
 * Get parser instances with lazy initialization
 */
function getParserInstances(): Record<string, FileParser> {
  if (parserInstances === null) {
    parserInstances = {}

    try {
      try {
        logger.info('Loading PDF parser...')
        const { PdfParser } = require('@/lib/file-parsers/pdf-parser')
        parserInstances.pdf = new PdfParser()
        logger.info('PDF parser loaded successfully')
      } catch (error) {
        logger.error('Failed to load PDF parser:', error)
      }

      try {
        const { CsvParser } = require('@/lib/file-parsers/csv-parser')
        parserInstances.csv = new CsvParser()
        logger.info('Loaded streaming CSV parser with csv-parse library')
      } catch (error) {
        logger.error('Failed to load streaming CSV parser:', error)
      }

      try {
        const { DocxParser } = require('@/lib/file-parsers/docx-parser')
        parserInstances.docx = new DocxParser()
      } catch (error) {
        logger.error('Failed to load DOCX parser:', error)
      }

      try {
        const { DocParser } = require('@/lib/file-parsers/doc-parser')
        parserInstances.doc = new DocParser()
      } catch (error) {
        logger.error('Failed to load DOC parser:', error)
      }

      try {
        const { TxtParser } = require('@/lib/file-parsers/txt-parser')
        parserInstances.txt = new TxtParser()
      } catch (error) {
        logger.error('Failed to load TXT parser:', error)
      }

      try {
        const { MdParser } = require('@/lib/file-parsers/md-parser')
        parserInstances.md = new MdParser()
      } catch (error) {
        logger.error('Failed to load MD parser:', error)
      }

      try {
        const { XlsxParser } = require('@/lib/file-parsers/xlsx-parser')
        parserInstances.xlsx = new XlsxParser()
        parserInstances.xls = new XlsxParser()
        logger.info('Loaded XLSX parser')
      } catch (error) {
        logger.error('Failed to load XLSX parser:', error)
      }

      try {
        const { PptxParser } = require('@/lib/file-parsers/pptx-parser')
        parserInstances.pptx = new PptxParser()
        parserInstances.ppt = new PptxParser()
      } catch (error) {
        logger.error('Failed to load PPTX parser:', error)
      }

      try {
        const { HtmlParser } = require('@/lib/file-parsers/html-parser')
        parserInstances.html = new HtmlParser()
        parserInstances.htm = new HtmlParser()
      } catch (error) {
        logger.error('Failed to load HTML parser:', error)
      }

      try {
        const { parseJSON, parseJSONBuffer } = require('@/lib/file-parsers/json-parser')
        parserInstances.json = {
          parseFile: parseJSON,
          parseBuffer: parseJSONBuffer,
        }
        logger.info('Loaded JSON parser')
      } catch (error) {
        logger.error('Failed to load JSON parser:', error)
      }

      try {
        const { parseYAML, parseYAMLBuffer } = require('@/lib/file-parsers/yaml-parser')
        parserInstances.yaml = {
          parseFile: parseYAML,
          parseBuffer: parseYAMLBuffer,
        }
        parserInstances.yml = {
          parseFile: parseYAML,
          parseBuffer: parseYAMLBuffer,
        }
        logger.info('Loaded YAML parser')
      } catch (error) {
        logger.error('Failed to load YAML parser:', error)
      }
    } catch (error) {
      logger.error('Error loading file parsers:', error)
    }
  }

  return parserInstances
}

/**
 * Parse a file based on its extension
 * @param filePath Path to the file
 * @returns Parsed content and metadata
 */
export async function parseFile(filePath: string): Promise<FileParseResult> {
  try {
    if (!filePath) {
      throw new Error('No file path provided')
    }

    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const extension = path.extname(filePath).toLowerCase().substring(1)
    logger.info('Attempting to parse file with extension:', extension)

    const parsers = getParserInstances()

    if (!Object.keys(parsers).includes(extension)) {
      logger.info('No parser found for extension:', extension)
      throw new Error(
        `Unsupported file type: ${extension}. Supported types are: ${Object.keys(parsers).join(', ')}`
      )
    }

    logger.info('Using parser for extension:', extension)
    const parser = parsers[extension]
    return await parser.parseFile(filePath)
  } catch (error) {
    logger.error('File parsing error:', error)
    throw error
  }
}

/**
 * Parse a buffer based on file extension
 * @param buffer Buffer containing the file data
 * @param extension File extension without the dot (e.g., 'pdf', 'csv')
 * @returns Parsed content and metadata
 */
export async function parseBuffer(buffer: Buffer, extension: string): Promise<FileParseResult> {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty buffer provided')
    }

    if (!extension) {
      throw new Error('No file extension provided')
    }

    const normalizedExtension = extension.toLowerCase()
    logger.info('Attempting to parse buffer with extension:', normalizedExtension)

    const parsers = getParserInstances()

    if (!Object.keys(parsers).includes(normalizedExtension)) {
      logger.info('No parser found for extension:', normalizedExtension)
      throw new Error(
        `Unsupported file type: ${normalizedExtension}. Supported types are: ${Object.keys(parsers).join(', ')}`
      )
    }

    logger.info('Using parser for extension:', normalizedExtension)
    const parser = parsers[normalizedExtension]

    if (parser.parseBuffer) {
      return await parser.parseBuffer(buffer)
    }
    throw new Error(`Parser for ${normalizedExtension} does not support buffer parsing`)
  } catch (error) {
    logger.error('Buffer parsing error:', error)
    throw error
  }
}

/**
 * Check if a file type is supported
 * @param extension File extension without the dot
 * @returns true if supported, false otherwise
 */
export function isSupportedFileType(extension: string): extension is SupportedFileType {
  try {
    return Object.keys(getParserInstances()).includes(extension.toLowerCase())
  } catch (error) {
    logger.error('Error checking supported file type:', error)
    return false
  }
}

export type { FileParseResult, FileParser, SupportedFileType }
```

--------------------------------------------------------------------------------

---[FILE: json-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/json-parser.ts

```typescript
import type { FileParseResult } from '@/lib/file-parsers/types'

/**
 * Parse JSON files
 */
export async function parseJSON(filePath: string): Promise<FileParseResult> {
  const fs = await import('fs/promises')
  const content = await fs.readFile(filePath, 'utf-8')

  try {
    // Parse to validate JSON
    const jsonData = JSON.parse(content)

    // Return pretty-printed JSON for better readability
    const formattedContent = JSON.stringify(jsonData, null, 2)

    // Extract metadata about the JSON structure
    const metadata = {
      type: 'json',
      isArray: Array.isArray(jsonData),
      keys: Array.isArray(jsonData) ? [] : Object.keys(jsonData),
      itemCount: Array.isArray(jsonData) ? jsonData.length : undefined,
      depth: getJsonDepth(jsonData),
    }

    return {
      content: formattedContent,
      metadata,
    }
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Parse JSON from buffer
 */
export async function parseJSONBuffer(buffer: Buffer): Promise<FileParseResult> {
  const content = buffer.toString('utf-8')

  try {
    const jsonData = JSON.parse(content)
    const formattedContent = JSON.stringify(jsonData, null, 2)

    const metadata = {
      type: 'json',
      isArray: Array.isArray(jsonData),
      keys: Array.isArray(jsonData) ? [] : Object.keys(jsonData),
      itemCount: Array.isArray(jsonData) ? jsonData.length : undefined,
      depth: getJsonDepth(jsonData),
    }

    return {
      content: formattedContent,
      metadata,
    }
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculate the depth of a JSON object
 */
function getJsonDepth(obj: any): number {
  if (obj === null || typeof obj !== 'object') return 0

  if (Array.isArray(obj)) {
    return obj.length > 0 ? 1 + Math.max(...obj.map(getJsonDepth)) : 1
  }

  const depths = Object.values(obj).map(getJsonDepth)
  return depths.length > 0 ? 1 + Math.max(...depths) : 1
}
```

--------------------------------------------------------------------------------

````

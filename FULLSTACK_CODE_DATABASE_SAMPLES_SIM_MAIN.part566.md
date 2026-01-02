---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 566
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 566 of 933)

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

---[FILE: md-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/md-parser.ts

```typescript
import { readFile } from 'fs/promises'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('MdParser')

export class MdParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      const buffer = await readFile(filePath)

      return this.parseBuffer(buffer)
    } catch (error) {
      logger.error('MD file error:', error)
      throw new Error(`Failed to parse MD file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Parsing buffer, size:', buffer.length)

      const result = buffer.toString('utf-8')
      const content = sanitizeTextForUTF8(result)

      return {
        content,
        metadata: {
          characterCount: content.length,
          tokenCount: Math.floor(content.length / 4),
        },
      }
    } catch (error) {
      logger.error('MD buffer parsing error:', error)
      throw new Error(`Failed to parse MD buffer: ${(error as Error).message}`)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pdf-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/pdf-parser.ts

```typescript
import { readFile } from 'fs/promises'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('PdfParser')

export class PdfParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      logger.info('Starting to parse file:', filePath)

      if (!filePath) {
        throw new Error('No file path provided')
      }

      logger.info('Reading file...')
      const dataBuffer = await readFile(filePath)
      logger.info('File read successfully, size:', dataBuffer.length)

      return this.parseBuffer(dataBuffer)
    } catch (error) {
      logger.error('Error reading file:', error)
      throw error
    }
  }

  async parseBuffer(dataBuffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Starting to parse buffer, size:', dataBuffer.length)

      const { extractText, getDocumentProxy } = await import('unpdf')

      const uint8Array = new Uint8Array(dataBuffer)

      const pdf = await getDocumentProxy(uint8Array)

      const { totalPages, text } = await extractText(pdf, { mergePages: true })

      logger.info('PDF parsed successfully, pages:', totalPages, 'text length:', text.length)

      const cleanContent = text.replace(/\u0000/g, '')

      return {
        content: cleanContent,
        metadata: {
          pageCount: totalPages,
          source: 'unpdf',
        },
      }
    } catch (error) {
      logger.error('Error parsing buffer:', error)
      throw error
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pptx-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/pptx-parser.ts

```typescript
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('PptxParser')

export class PptxParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      logger.info(`Parsing PowerPoint file: ${filePath}`)

      const buffer = await readFile(filePath)
      return this.parseBuffer(buffer)
    } catch (error) {
      logger.error('PowerPoint file parsing error:', error)
      throw new Error(`Failed to parse PowerPoint file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Parsing PowerPoint buffer, size:', buffer.length)

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

        if (!result || typeof result !== 'string') {
          throw new Error('officeparser returned invalid result')
        }

        const content = sanitizeTextForUTF8(result.trim())

        logger.info('PowerPoint parsing completed successfully with officeparser')

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
      logger.error('PowerPoint buffer parsing error:', error)
      throw new Error(`Failed to parse PowerPoint buffer: ${(error as Error).message}`)
    }
  }

  private fallbackExtraction(buffer: Buffer): FileParseResult {
    logger.info('Using fallback text extraction for PowerPoint file')

    const text = buffer.toString('utf8', 0, Math.min(buffer.length, 200000))

    const readableText = text
      .match(/[\x20-\x7E\s]{4,}/g)
      ?.filter(
        (chunk) =>
          chunk.trim().length > 10 &&
          /[a-zA-Z]/.test(chunk) &&
          !/^[\x00-\x1F]*$/.test(chunk) &&
          !/^[^\w\s]*$/.test(chunk)
      )
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    const content = readableText
      ? sanitizeTextForUTF8(readableText)
      : 'Unable to extract text from PowerPoint file. Please ensure the file contains readable text content.'

    return {
      content,
      metadata: {
        extractionMethod: 'fallback',
        characterCount: content.length,
        warning: 'Basic text extraction used',
      },
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: txt-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/txt-parser.ts

```typescript
import { readFile } from 'fs/promises'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TxtParser')

export class TxtParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      const buffer = await readFile(filePath)

      return this.parseBuffer(buffer)
    } catch (error) {
      logger.error('TXT file error:', error)
      throw new Error(`Failed to parse TXT file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      logger.info('Parsing buffer, size:', buffer.length)

      const rawContent = buffer.toString('utf-8')
      const result = sanitizeTextForUTF8(rawContent)

      return {
        content: result,
        metadata: {
          characterCount: result.length,
          tokenCount: result.length / 4,
        },
      }
    } catch (error) {
      logger.error('TXT buffer parsing error:', error)
      throw new Error(`Failed to parse TXT buffer: ${(error as Error).message}`)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/file-parsers/types.ts

```typescript
export interface FileParseResult {
  content: string
  metadata?: Record<string, any>
}

export interface FileParser {
  parseFile(filePath: string): Promise<FileParseResult>
  parseBuffer?(buffer: Buffer): Promise<FileParseResult>
}

export type SupportedFileType =
  | 'pdf'
  | 'csv'
  | 'doc'
  | 'docx'
  | 'txt'
  | 'md'
  | 'xlsx'
  | 'xls'
  | 'html'
  | 'htm'
  | 'pptx'
  | 'ppt'
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/file-parsers/utils.ts

```typescript
/**
 * Utility functions for file parsing
 */

/**
 * Clean text content to ensure it's safe for UTF-8 storage in PostgreSQL
 * Removes null bytes and control characters that can cause encoding errors
 */
export function sanitizeTextForUTF8(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .replace(/\0/g, '') // Remove null bytes (0x00)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters except \t(0x09), \n(0x0A), \r(0x0D)
    .replace(/\uFFFD/g, '') // Remove Unicode replacement character
    .replace(/[\uD800-\uDFFF]/g, '') // Remove unpaired surrogate characters
}

/**
 * Sanitize an array of strings
 */
export function sanitizeTextArray(texts: string[]): string[] {
  return texts.map((text) => sanitizeTextForUTF8(text))
}

/**
 * Check if a string contains problematic characters for UTF-8 storage
 */
export function hasInvalidUTF8Characters(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false
  }

  // Check for null bytes and control characters
  return (
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text) ||
    /\uFFFD/.test(text) ||
    /[\uD800-\uDFFF]/.test(text)
  )
}
```

--------------------------------------------------------------------------------

---[FILE: xlsx-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/xlsx-parser.ts

```typescript
import { existsSync } from 'fs'
import * as XLSX from 'xlsx'
import type { FileParseResult, FileParser } from '@/lib/file-parsers/types'
import { sanitizeTextForUTF8 } from '@/lib/file-parsers/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('XlsxParser')

// Configuration for handling large XLSX files
const CONFIG = {
  MAX_PREVIEW_ROWS: 1000, // Only keep first 1000 rows for preview
  MAX_SAMPLE_ROWS: 100, // Sample for metadata
  ROWS_PER_CHUNK: 50, // Aggregate 50 rows per chunk to reduce chunk count
  MAX_CELL_LENGTH: 1000, // Truncate very long cell values
  MAX_CONTENT_SIZE: 10 * 1024 * 1024, // 10MB max content size
}

export class XlsxParser implements FileParser {
  async parseFile(filePath: string): Promise<FileParseResult> {
    try {
      if (!filePath) {
        throw new Error('No file path provided')
      }

      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      logger.info(`Parsing XLSX file: ${filePath}`)

      // Read with streaming option for large files
      const workbook = XLSX.readFile(filePath, {
        dense: true, // Use dense mode for better memory efficiency
        sheetStubs: false, // Don't create stub cells
      })

      return this.processWorkbook(workbook)
    } catch (error) {
      logger.error('XLSX file parsing error:', error)
      throw new Error(`Failed to parse XLSX file: ${(error as Error).message}`)
    }
  }

  async parseBuffer(buffer: Buffer): Promise<FileParseResult> {
    try {
      const bufferSize = buffer.length
      logger.info(
        `Parsing XLSX buffer, size: ${bufferSize} bytes (${(bufferSize / 1024 / 1024).toFixed(2)} MB)`
      )

      if (!buffer || buffer.length === 0) {
        throw new Error('Empty buffer provided')
      }

      const workbook = XLSX.read(buffer, {
        type: 'buffer',
        dense: true, // Use dense mode for better memory efficiency
        sheetStubs: false, // Don't create stub cells
      })

      return this.processWorkbook(workbook)
    } catch (error) {
      logger.error('XLSX buffer parsing error:', error)
      throw new Error(`Failed to parse XLSX buffer: ${(error as Error).message}`)
    }
  }

  private processWorkbook(workbook: XLSX.WorkBook): FileParseResult {
    const sheetNames = workbook.SheetNames
    let content = ''
    let totalRows = 0
    let truncated = false
    let contentSize = 0
    const sampledData: any[] = []

    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]

      // Get sheet dimensions
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      const rowCount = range.e.r - range.s.r + 1

      logger.info(`Processing sheet: ${sheetName} with ${rowCount} rows`)

      // Convert to JSON with header row
      const sheetData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '', // Default value for empty cells
        blankrows: false, // Skip blank rows
      })

      const actualRowCount = sheetData.length
      totalRows += actualRowCount

      // Store limited sample for metadata
      if (sampledData.length < CONFIG.MAX_SAMPLE_ROWS) {
        const sampleSize = Math.min(CONFIG.MAX_SAMPLE_ROWS - sampledData.length, actualRowCount)
        sampledData.push(...sheetData.slice(0, sampleSize))
      }

      // Only process limited rows for preview
      const rowsToProcess = Math.min(actualRowCount, CONFIG.MAX_PREVIEW_ROWS)
      const cleanSheetName = sanitizeTextForUTF8(sheetName)

      // Add sheet header
      const sheetHeader = `\n=== Sheet: ${cleanSheetName} ===\n`
      content += sheetHeader
      contentSize += sheetHeader.length

      if (actualRowCount > 0) {
        // Get headers if available
        const headers = sheetData[0] as any[]
        if (headers && headers.length > 0) {
          const headerRow = headers.map((h) => this.truncateCell(h)).join('\t')
          content += `${headerRow}\n`
          content += `${'-'.repeat(Math.min(80, headerRow.length))}\n`
          contentSize += headerRow.length + 82
        }

        // Process data rows in chunks
        let chunkContent = ''
        let chunkRowCount = 0

        for (let i = 1; i < rowsToProcess; i++) {
          const row = sheetData[i] as any[]
          if (row && row.length > 0) {
            const rowString = row.map((cell) => this.truncateCell(cell)).join('\t')

            chunkContent += `${rowString}\n`
            chunkRowCount++

            // Add chunk separator every N rows for better readability
            if (chunkRowCount >= CONFIG.ROWS_PER_CHUNK) {
              content += chunkContent
              contentSize += chunkContent.length
              chunkContent = ''
              chunkRowCount = 0

              // Check content size limit
              if (contentSize > CONFIG.MAX_CONTENT_SIZE) {
                truncated = true
                break
              }
            }
          }
        }

        // Add remaining chunk content
        if (chunkContent && contentSize < CONFIG.MAX_CONTENT_SIZE) {
          content += chunkContent
          contentSize += chunkContent.length
        }

        // Add truncation notice if needed
        if (actualRowCount > rowsToProcess) {
          const notice = `\n[... ${actualRowCount.toLocaleString()} total rows, showing first ${rowsToProcess.toLocaleString()} ...]\n`
          content += notice
          truncated = true
        }
      } else {
        content += '[Empty sheet]\n'
      }

      // Stop processing if content is too large
      if (contentSize > CONFIG.MAX_CONTENT_SIZE) {
        content += '\n[... Content truncated due to size limits ...]\n'
        truncated = true
        break
      }
    }

    logger.info(
      `XLSX parsing completed: ${sheetNames.length} sheets, ${totalRows} total rows, truncated: ${truncated}`
    )

    const cleanContent = sanitizeTextForUTF8(content).trim()

    return {
      content: cleanContent,
      metadata: {
        sheetCount: sheetNames.length,
        sheetNames: sheetNames,
        totalRows: totalRows,
        truncated: truncated,
        sampledData: sampledData.slice(0, CONFIG.MAX_SAMPLE_ROWS),
        contentSize: contentSize,
      },
    }
  }

  private truncateCell(cell: any): string {
    if (cell === null || cell === undefined) {
      return ''
    }

    let cellStr = String(cell)

    // Truncate very long cells
    if (cellStr.length > CONFIG.MAX_CELL_LENGTH) {
      cellStr = `${cellStr.substring(0, CONFIG.MAX_CELL_LENGTH)}...`
    }

    return sanitizeTextForUTF8(cellStr)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: yaml-parser.ts]---
Location: sim-main/apps/sim/lib/file-parsers/yaml-parser.ts

```typescript
import * as yaml from 'js-yaml'
import type { FileParseResult } from '@/lib/file-parsers/types'

/**
 * Parse YAML files
 */
export async function parseYAML(filePath: string): Promise<FileParseResult> {
  const fs = await import('fs/promises')
  const content = await fs.readFile(filePath, 'utf-8')

  try {
    // Parse YAML to validate and extract structure
    const yamlData = yaml.load(content)

    // Convert to JSON for consistent processing
    const jsonContent = JSON.stringify(yamlData, null, 2)

    // Extract metadata about the YAML structure
    const metadata = {
      type: 'yaml',
      isArray: Array.isArray(yamlData),
      keys: Array.isArray(yamlData) ? [] : Object.keys(yamlData || {}),
      itemCount: Array.isArray(yamlData) ? yamlData.length : undefined,
      depth: getYamlDepth(yamlData),
    }

    return {
      content: jsonContent,
      metadata,
    }
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Parse YAML from buffer
 */
export async function parseYAMLBuffer(buffer: Buffer): Promise<FileParseResult> {
  const content = buffer.toString('utf-8')

  try {
    const yamlData = yaml.load(content)
    const jsonContent = JSON.stringify(yamlData, null, 2)

    const metadata = {
      type: 'yaml',
      isArray: Array.isArray(yamlData),
      keys: Array.isArray(yamlData) ? [] : Object.keys(yamlData || {}),
      itemCount: Array.isArray(yamlData) ? yamlData.length : undefined,
      depth: getYamlDepth(yamlData),
    }

    return {
      content: jsonContent,
      metadata,
    }
  } catch (error) {
    throw new Error(`Invalid YAML: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculate the depth of a YAML/JSON object
 */
function getYamlDepth(obj: any): number {
  if (obj === null || typeof obj !== 'object') return 0

  if (Array.isArray(obj)) {
    return obj.length > 0 ? 1 + Math.max(...obj.map(getYamlDepth)) : 1
  }

  const depths = Object.values(obj).map(getYamlDepth)
  return depths.length > 0 ? 1 + Math.max(...depths) : 1
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: sim-main/apps/sim/lib/guardrails/.gitignore

```text
# Python virtual environment
venv/

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# Presidio cache
.presidio/
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/apps/sim/lib/guardrails/README.md

```text
# Guardrails Validators

Validation scripts for the Guardrails block.

## Validators

- **JSON Validation** - Validates if content is valid JSON (TypeScript)
- **Regex Validation** - Validates content against regex patterns (TypeScript)
- **Hallucination Detection** - Validates LLM output against knowledge base using RAG + LLM scoring (TypeScript)
- **PII Detection** - Detects personally identifiable information using Microsoft Presidio (Python)

## Setup

### TypeScript Validators (JSON, Regex, Hallucination)

No additional setup required! These validators work out of the box.

For **hallucination detection**, you'll need:
- A knowledge base with documents
- An LLM provider API key (or use hosted models)

### Python Validators (PII Detection)

For **PII detection**, you need to set up a Python virtual environment and install Microsoft Presidio:

```bash
cd apps/sim/lib/guardrails
./setup.sh
```

This will:
1. Create a Python virtual environment in `apps/sim/lib/guardrails/venv`
2. Install required dependencies:
   - `presidio-analyzer` - PII detection engine
   - `presidio-anonymizer` - PII masking/anonymization

The TypeScript wrapper will automatically use the virtual environment's Python interpreter.

## Usage

### JSON & Regex Validation

These are implemented in TypeScript and work out of the box - no additional dependencies needed.

### Hallucination Detection

The hallucination detector uses a modern RAG + LLM confidence scoring approach:

1. **RAG Query** - Calls the knowledge base search API to retrieve relevant chunks
2. **LLM Confidence Scoring** - Uses an LLM to score how well the user input is supported by the retrieved context on a 0-10 confidence scale:
   - 0-2: Full hallucination - completely unsupported by context, contradicts the context
   - 3-4: Low confidence - mostly unsupported, significant claims not in context
   - 5-6: Medium confidence - partially supported, some claims not in context
   - 7-8: High confidence - mostly supported, minor details not in context
   - 9-10: Very high confidence - fully supported by context, all claims verified
3. **Threshold Check** - Compares the confidence score against your threshold (default: 3)
4. **Result** - Returns `passed: true/false` with confidence score and reasoning

**Configuration:**
- `knowledgeBaseId` (required): Select from dropdown of available knowledge bases
- `threshold` (optional): Confidence threshold 0-10, default 3 (scores below 3 fail)
- `topK` (optional): Number of chunks to retrieve, default 10
- `model` (required): Select from dropdown of available LLM models, default `gpt-4o-mini`
- `apiKey` (conditional): API key for the LLM provider (hidden for hosted models and Ollama)

### PII Detection

The PII detector uses Microsoft Presidio to identify personally identifiable information:

1. **Analysis** - Scans text for PII entities using pattern matching, NER, and context
2. **Detection** - Identifies PII types like names, emails, phone numbers, SSNs, credit cards, etc.
3. **Action** - Either blocks the request or masks the PII based on mode

**Modes:**
- **Block Mode** (default): Fails validation if any PII is detected
- **Mask Mode**: Passes validation and returns text with PII replaced by `<ENTITY_TYPE>` placeholders

**Configuration:**
- `piiEntityTypes` (optional): Array of PII types to detect (empty = detect all)
- `piiMode` (optional): `block` or `mask`, default `block`
- `piiLanguage` (optional): Language code, default `en`

**Supported PII Types:**
- **Common**: Person name, Email, Phone, Credit card, Location, IP address, Date/time, URL
- **USA**: SSN, Passport, Driver license, Bank account, ITIN
- **UK**: NHS number, National Insurance Number
- **Other**: Spanish NIF/NIE, Italian fiscal code, Polish PESEL, Singapore NRIC, Australian ABN/TFN, Indian Aadhaar/PAN, and more

See [Presidio documentation](https://microsoft.github.io/presidio/supported_entities/) for full list.

## Files

- `validate_json.ts` - JSON validation (TypeScript)
- `validate_regex.ts` - Regex validation (TypeScript)
- `validate_hallucination.ts` - Hallucination detection with RAG + LLM scoring (TypeScript)
- `validate_pii.ts` - PII detection TypeScript wrapper (TypeScript)
- `validate_pii.py` - PII detection using Microsoft Presidio (Python)
- `validate.test.ts` - Test suite for JSON and regex validators
- `validate_hallucination.py` - Legacy Python hallucination detector (deprecated)
- `requirements.txt` - Python dependencies for PII detection (and legacy hallucination)
- `setup.sh` - Legacy installation script (deprecated)
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: sim-main/apps/sim/lib/guardrails/requirements.txt

```text
# Microsoft Presidio for PII detection
presidio-analyzer>=2.2.0
presidio-anonymizer>=2.2.0
```

--------------------------------------------------------------------------------

---[FILE: setup.sh]---
Location: sim-main/apps/sim/lib/guardrails/setup.sh

```bash
#!/bin/bash

# Setup script for guardrails validators
# This creates a virtual environment and installs Python dependencies

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"

echo "Setting up Python environment for guardrails..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is not installed. Please install Python 3 first."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install -r "$SCRIPT_DIR/requirements.txt"

echo ""
echo "✅ Setup complete! Guardrails validators are ready to use."
echo ""
echo "Virtual environment created at: $VENV_DIR"
```

--------------------------------------------------------------------------------

---[FILE: validate_hallucination.ts]---
Location: sim-main/apps/sim/lib/guardrails/validate_hallucination.ts

```typescript
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { executeProviderRequest } from '@/providers'
import { getApiKey, getProviderFromModel } from '@/providers/utils'

const logger = createLogger('HallucinationValidator')

export interface HallucinationValidationResult {
  passed: boolean
  error?: string
  score?: number
  reasoning?: string
}

export interface HallucinationValidationInput {
  userInput: string
  knowledgeBaseId: string
  threshold: number // 0-10 confidence scale, default 3 (scores below 3 fail)
  topK: number // Number of chunks to retrieve, default 10
  model: string
  apiKey?: string
  workflowId?: string
  requestId: string
}

/**
 * Query knowledge base to get relevant context chunks using the search API
 */
async function queryKnowledgeBase(
  knowledgeBaseId: string,
  query: string,
  topK: number,
  requestId: string,
  workflowId?: string
): Promise<string[]> {
  try {
    logger.info(`[${requestId}] Querying knowledge base`, {
      knowledgeBaseId,
      query: query.substring(0, 100),
      topK,
    })

    // Call the knowledge base search API directly
    const searchUrl = `${getBaseUrl()}/api/knowledge/search`

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        knowledgeBaseIds: [knowledgeBaseId],
        query,
        topK,
        workflowId,
      }),
    })

    if (!response.ok) {
      logger.error(`[${requestId}] Knowledge base query failed`, {
        status: response.status,
      })
      return []
    }

    const result = await response.json()
    const results = result.data?.results || []

    const chunks = results.map((r: any) => r.content || '').filter((c: string) => c.length > 0)

    logger.info(`[${requestId}] Retrieved ${chunks.length} chunks from knowledge base`)

    return chunks
  } catch (error: any) {
    logger.error(`[${requestId}] Error querying knowledge base`, {
      error: error.message,
    })
    return []
  }
}

/**
 * Use an LLM to score confidence based on RAG context
 * Returns a confidence score from 0-10 where:
 * - 0 = full hallucination (completely unsupported)
 * - 10 = fully grounded (completely supported)
 */
async function scoreHallucinationWithLLM(
  userInput: string,
  ragContext: string[],
  model: string,
  apiKey: string,
  requestId: string
): Promise<{ score: number; reasoning: string }> {
  try {
    const contextText = ragContext.join('\n\n---\n\n')

    const systemPrompt = `You are a confidence scoring system. Your job is to evaluate how well a user's input is supported by the provided reference context from a knowledge base.

Score the input on a confidence scale from 0 to 10:
- 0-2: Full hallucination - completely unsupported by context, contradicts the context
- 3-4: Low confidence - mostly unsupported, significant claims not in context
- 5-6: Medium confidence - partially supported, some claims not in context
- 7-8: High confidence - mostly supported, minor details not in context
- 9-10: Very high confidence - fully supported by context, all claims verified

Respond ONLY with valid JSON in this exact format:
{
  "score": <number between 0-10>,
  "reasoning": "<brief explanation of your score>"
}

Do not include any other text, markdown formatting, or code blocks. Only output the raw JSON object. Be strict - only give high scores (7+) if the input is well-supported by the context.`

    const userPrompt = `Reference Context:
${contextText}

User Input to Evaluate:
${userInput}

Evaluate the consistency and provide your score and reasoning in JSON format.`

    logger.info(`[${requestId}] Calling LLM for hallucination scoring`, {
      model,
      contextChunks: ragContext.length,
    })

    const providerId = getProviderFromModel(model)

    const response = await executeProviderRequest(providerId, {
      model,
      systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistent scoring
      apiKey,
    })

    if (response instanceof ReadableStream || ('stream' in response && 'execution' in response)) {
      throw new Error('Unexpected streaming response from LLM')
    }

    const content = response.content.trim()
    logger.debug(`[${requestId}] LLM response:`, { content })

    let jsonContent = content

    if (content.includes('```')) {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (jsonMatch) {
        jsonContent = jsonMatch[1]
      }
    }

    const result = JSON.parse(jsonContent)

    if (typeof result.score !== 'number' || result.score < 0 || result.score > 10) {
      throw new Error('Invalid score format from LLM')
    }

    logger.info(`[${requestId}] Confidence score: ${result.score}/10`, {
      reasoning: result.reasoning,
    })

    return {
      score: result.score,
      reasoning: result.reasoning || 'No reasoning provided',
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Error scoring with LLM`, {
      error: error.message,
    })
    throw new Error(`Failed to score confidence: ${error.message}`)
  }
}

/**
 * Validate user input against knowledge base using RAG + LLM scoring
 */
export async function validateHallucination(
  input: HallucinationValidationInput
): Promise<HallucinationValidationResult> {
  const { userInput, knowledgeBaseId, threshold, topK, model, apiKey, workflowId, requestId } =
    input

  try {
    if (!userInput || userInput.trim().length === 0) {
      return {
        passed: false,
        error: 'User input is required',
      }
    }

    if (!knowledgeBaseId) {
      return {
        passed: false,
        error: 'Knowledge base ID is required',
      }
    }

    let finalApiKey: string
    try {
      const providerId = getProviderFromModel(model)
      finalApiKey = getApiKey(providerId, model, apiKey)
    } catch (error: any) {
      return {
        passed: false,
        error: `API key error: ${error.message}`,
      }
    }

    // Step 1: Query knowledge base with RAG
    const ragContext = await queryKnowledgeBase(
      knowledgeBaseId,
      userInput,
      topK,
      requestId,
      workflowId
    )

    if (ragContext.length === 0) {
      return {
        passed: false,
        error: 'No relevant context found in knowledge base',
      }
    }

    // Step 2: Use LLM to score confidence
    const { score, reasoning } = await scoreHallucinationWithLLM(
      userInput,
      ragContext,
      model,
      finalApiKey,
      requestId
    )

    logger.info(`[${requestId}] Confidence score: ${score}`, {
      reasoning,
      threshold,
    })

    // Step 3: Check against threshold. Lower scores = less confidence = fail validation
    const passed = score >= threshold

    return {
      passed,
      score,
      reasoning,
      error: passed
        ? undefined
        : `Low confidence: score ${score}/10 is below threshold ${threshold}`,
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Hallucination validation error`, {
      error: error.message,
    })
    return {
      passed: false,
      error: `Validation error: ${error.message}`,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: validate_json.ts]---
Location: sim-main/apps/sim/lib/guardrails/validate_json.ts

```typescript
/**
 * Validate if input is valid JSON
 */
export interface ValidationResult {
  passed: boolean
  error?: string
}

export function validateJson(inputStr: string): ValidationResult {
  try {
    JSON.parse(inputStr)
    return { passed: true }
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return { passed: false, error: `Invalid JSON: ${error.message}` }
    }
    return { passed: false, error: `Validation error: ${error.message}` }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: validate_pii.py]---
Location: sim-main/apps/sim/lib/guardrails/validate_pii.py

```python
#!/usr/bin/env python3
"""
PII Detection Validator using Microsoft Presidio

Detects personally identifiable information (PII) in text and either:
- Blocks the request if PII is detected (block mode)
- Masks the PII and returns the masked text (mask mode)
"""

import sys
import json
from typing import List, Dict, Any

try:
    from presidio_analyzer import AnalyzerEngine
    from presidio_anonymizer import AnonymizerEngine
    from presidio_anonymizer.entities import OperatorConfig
except ImportError:
    print(json.dumps({
        "passed": False,
        "error": "Presidio not installed. Run: pip install presidio-analyzer presidio-anonymizer",
        "detectedEntities": []
    }))
    sys.exit(0)


def detect_pii(
    text: str,
    entity_types: List[str],
    mode: str = "block",
    language: str = "en"
) -> Dict[str, Any]:
    """
    Detect PII in text using Presidio
    
    Args:
        text: Input text to analyze
        entity_types: List of PII entity types to detect (e.g., ["PERSON", "EMAIL_ADDRESS"])
        mode: "block" to fail validation if PII found, "mask" to return masked text
        language: Language code (default: "en")
    
    Returns:
        Dictionary with validation result
    """
    try:
        # Initialize Presidio engines
        analyzer = AnalyzerEngine()
        
        # Analyze text for PII
        results = analyzer.analyze(
            text=text,
            entities=entity_types if entity_types else None,  # None = detect all
            language=language
        )
        
        # Extract detected entities
        detected_entities = []
        for result in results:
            detected_entities.append({
                "type": result.entity_type,
                "start": result.start,
                "end": result.end,
                "score": result.score,
                "text": text[result.start:result.end]
            })
        
        # If no PII detected, validation passes
        if not results:
            return {
                "passed": True,
                "detectedEntities": [],
                "maskedText": None
            }
        
        # Block mode: fail validation if PII detected
        if mode == "block":
            entity_summary = {}
            for entity in detected_entities:
                entity_type = entity["type"]
                entity_summary[entity_type] = entity_summary.get(entity_type, 0) + 1
            
            summary_str = ", ".join([f"{count} {etype}" for etype, count in entity_summary.items()])
            
            return {
                "passed": False,
                "error": f"PII detected: {summary_str}",
                "detectedEntities": detected_entities,
                "maskedText": None
            }
        
        # Mask mode: anonymize PII and return masked text
        elif mode == "mask":
            anonymizer = AnonymizerEngine()
            
            # Use <ENTITY_TYPE> as the replacement pattern
            operators = {}
            for entity_type in set([r.entity_type for r in results]):
                operators[entity_type] = OperatorConfig("replace", {"new_value": f"<{entity_type}>"})
            
            anonymized_result = anonymizer.anonymize(
                text=text,
                analyzer_results=results,
                operators=operators
            )
            
            return {
                "passed": True,
                "detectedEntities": detected_entities,
                "maskedText": anonymized_result.text
            }
        
        else:
            return {
                "passed": False,
                "error": f"Invalid mode: {mode}. Must be 'block' or 'mask'",
                "detectedEntities": []
            }
            
    except Exception as e:
        return {
            "passed": False,
            "error": f"PII detection failed: {str(e)}",
            "detectedEntities": []
        }


def main():
    """Main entry point for CLI usage"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        text = data.get("text", "")
        entity_types = data.get("entityTypes", [])
        mode = data.get("mode", "block")
        language = data.get("language", "en")
        
        # Validate inputs
        if not text:
            result = {
                "passed": False,
                "error": "No text provided",
                "detectedEntities": []
            }
        else:
            result = detect_pii(text, entity_types, mode, language)
        
        # Output result with marker for parsing
        print(f"__SIM_RESULT__={json.dumps(result)}")
        
    except json.JSONDecodeError as e:
        print(f"__SIM_RESULT__={json.dumps({
            'passed': False,
            'error': f'Invalid JSON input: {str(e)}',
            'detectedEntities': []
        })}")
    except Exception as e:
        print(f"__SIM_RESULT__={json.dumps({
            'passed': False,
            'error': f'Unexpected error: {str(e)}',
            'detectedEntities': []
        })}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````

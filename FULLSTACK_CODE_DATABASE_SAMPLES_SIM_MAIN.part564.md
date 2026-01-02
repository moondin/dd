---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 564
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 564 of 933)

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

---[FILE: isolated-vm-worker.cjs]---
Location: sim-main/apps/sim/lib/execution/isolated-vm-worker.cjs

```text
/**
 * Node.js worker for isolated-vm execution.
 * Runs in a separate Node.js process, communicates with parent via IPC.
 */

const ivm = require('isolated-vm')

const USER_CODE_START_LINE = 4
const pendingFetches = new Map()
let fetchIdCounter = 0
const FETCH_TIMEOUT_MS = 30000

/**
 * Extract line and column from error stack or message
 */
function extractLineInfo(errorMessage, stack) {
  if (stack) {
    const stackMatch = stack.match(/(?:<isolated-vm>|user-function\.js):(\d+):(\d+)/)
    if (stackMatch) {
      return {
        line: Number.parseInt(stackMatch[1], 10),
        column: Number.parseInt(stackMatch[2], 10),
      }
    }
    const atMatch = stack.match(/at\s+(?:<isolated-vm>|user-function\.js):(\d+):(\d+)/)
    if (atMatch) {
      return {
        line: Number.parseInt(atMatch[1], 10),
        column: Number.parseInt(atMatch[2], 10),
      }
    }
  }

  const msgMatch = errorMessage.match(/:(\d+):(\d+)/)
  if (msgMatch) {
    return {
      line: Number.parseInt(msgMatch[1], 10),
      column: Number.parseInt(msgMatch[2], 10),
    }
  }

  return {}
}

/**
 * Convert isolated-vm error info to a format compatible with the route's error handling
 */
function convertToCompatibleError(errorInfo, userCode) {
  const { name } = errorInfo
  let { message, stack } = errorInfo

  message = message
    .replace(/\s*\[user-function\.js:\d+:\d+\]/g, '')
    .replace(/\s*\[<isolated-vm>:\d+:\d+\]/g, '')
    .replace(/\s*\(<isolated-vm>:\d+:\d+\)/g, '')
    .trim()

  const lineInfo = extractLineInfo(errorInfo.message, stack)

  let userLine
  let lineContent

  if (lineInfo.line !== undefined) {
    userLine = lineInfo.line - USER_CODE_START_LINE
    const codeLines = userCode.split('\n')
    if (userLine > 0 && userLine <= codeLines.length) {
      lineContent = codeLines[userLine - 1]?.trim()
    } else if (userLine <= 0) {
      userLine = 1
      lineContent = codeLines[0]?.trim()
    } else {
      userLine = codeLines.length
      lineContent = codeLines[codeLines.length - 1]?.trim()
    }
  }

  if (stack) {
    stack = stack.replace(/<isolated-vm>:(\d+):(\d+)/g, (_, line, col) => {
      const adjustedLine = Number.parseInt(line, 10) - USER_CODE_START_LINE
      return `user-function.js:${Math.max(1, adjustedLine)}:${col}`
    })
    stack = stack.replace(/at <isolated-vm>:(\d+):(\d+)/g, (_, line, col) => {
      const adjustedLine = Number.parseInt(line, 10) - USER_CODE_START_LINE
      return `at user-function.js:${Math.max(1, adjustedLine)}:${col}`
    })
  }

  return {
    message,
    name,
    stack,
    line: userLine,
    column: lineInfo.column,
    lineContent,
  }
}

/**
 * Execute code in isolated-vm
 */
async function executeCode(request) {
  const { code, params, envVars, contextVariables, timeoutMs, requestId } = request
  const stdoutChunks = []
  let isolate = null

  try {
    isolate = new ivm.Isolate({ memoryLimit: 128 })
    const context = await isolate.createContext()
    const jail = context.global

    await jail.set('global', jail.derefInto())

    const logCallback = new ivm.Callback((...args) => {
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ')
      stdoutChunks.push(`${message}\n`)
    })
    await jail.set('__log', logCallback)

    const errorCallback = new ivm.Callback((...args) => {
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ')
      stdoutChunks.push(`ERROR: ${message}\n`)
    })
    await jail.set('__error', errorCallback)

    await jail.set('params', new ivm.ExternalCopy(params).copyInto())
    await jail.set('environmentVariables', new ivm.ExternalCopy(envVars).copyInto())

    for (const [key, value] of Object.entries(contextVariables)) {
      await jail.set(key, new ivm.ExternalCopy(value).copyInto())
    }

    const fetchCallback = new ivm.Reference(async (url, optionsJson) => {
      return new Promise((resolve) => {
        const fetchId = ++fetchIdCounter
        const timeout = setTimeout(() => {
          if (pendingFetches.has(fetchId)) {
            pendingFetches.delete(fetchId)
            resolve(JSON.stringify({ error: 'Fetch request timed out' }))
          }
        }, FETCH_TIMEOUT_MS)
        pendingFetches.set(fetchId, { resolve, timeout })
        if (process.send && process.connected) {
          process.send({ type: 'fetch', fetchId, requestId, url, optionsJson })
        } else {
          clearTimeout(timeout)
          pendingFetches.delete(fetchId)
          resolve(JSON.stringify({ error: 'Parent process disconnected' }))
        }
      })
    })
    await jail.set('__fetchRef', fetchCallback)

    const bootstrap = `
      // Set up console object
      const console = {
        log: (...args) => __log(...args),
        error: (...args) => __error(...args),
        warn: (...args) => __log('WARN:', ...args),
        info: (...args) => __log(...args),
      };

      // Set up fetch function that uses the host's secure fetch
      async function fetch(url, options) {
        let optionsJson;
        if (options) {
          try {
            optionsJson = JSON.stringify(options);
          } catch {
            throw new Error('fetch options must be JSON-serializable');
          }
        }
        const resultJson = await __fetchRef.apply(undefined, [url, optionsJson], { result: { promise: true } });
        let result;
        try {
          result = JSON.parse(resultJson);
        } catch {
          throw new Error('Invalid fetch response');
        }

        if (result.error) {
          throw new Error(result.error);
        }

        // Create a Response-like object
        return {
          ok: result.ok,
          status: result.status,
          statusText: result.statusText,
          headers: {
            get: (name) => result.headers[name.toLowerCase()] || null,
            entries: () => Object.entries(result.headers),
          },
          text: async () => result.body,
          json: async () => {
            try {
              return JSON.parse(result.body);
            } catch (e) {
              throw new Error('Failed to parse response as JSON: ' + e.message);
            }
          },
          blob: async () => { throw new Error('blob() not supported in sandbox'); },
          arrayBuffer: async () => { throw new Error('arrayBuffer() not supported in sandbox'); },
        };
      }

      // Prevent access to dangerous globals with stronger protection
      const undefined_globals = [
        'Isolate', 'Context', 'Script', 'Module', 'Callback', 'Reference',
        'ExternalCopy', 'process', 'require', 'module', 'exports', '__dirname', '__filename'
      ];
      for (const name of undefined_globals) {
        try {
          Object.defineProperty(global, name, {
            value: undefined,
            writable: false,
            configurable: false
          });
        } catch {}
      }
    `

    const bootstrapScript = await isolate.compileScript(bootstrap)
    await bootstrapScript.run(context)

    const wrappedCode = `
      (async () => {
        try {
          const __userResult = await (async () => {
            ${code}
          })();
          return JSON.stringify({ success: true, result: __userResult });
        } catch (error) {
          // Capture full error details including stack trace
          const errorInfo = {
            message: error.message || String(error),
            name: error.name || 'Error',
            stack: error.stack || ''
          };
          console.error(error.stack || error.message || error);
          return JSON.stringify({ success: false, errorInfo });
        }
      })()
    `

    const userScript = await isolate.compileScript(wrappedCode, { filename: 'user-function.js' })
    const resultJson = await userScript.run(context, { timeout: timeoutMs, promise: true })

    let result = null
    let error

    if (typeof resultJson === 'string') {
      try {
        const parsed = JSON.parse(resultJson)
        if (parsed.success) {
          result = parsed.result
        } else if (parsed.errorInfo) {
          error = convertToCompatibleError(parsed.errorInfo, code)
        } else {
          error = { message: 'Unknown error', name: 'Error' }
        }
      } catch {
        result = resultJson
      }
    }

    const stdout = stdoutChunks.join('')

    if (error) {
      return { result: null, stdout, error }
    }

    return { result, stdout }
  } catch (err) {
    const stdout = stdoutChunks.join('')

    if (err instanceof Error) {
      const errorInfo = {
        message: err.message,
        name: err.name,
        stack: err.stack,
      }

      if (err.message.includes('Script execution timed out')) {
        return {
          result: null,
          stdout,
          error: {
            message: `Execution timed out after ${timeoutMs}ms`,
            name: 'TimeoutError',
          },
        }
      }

      return {
        result: null,
        stdout,
        error: convertToCompatibleError(errorInfo, code),
      }
    }

    return {
      result: null,
      stdout,
      error: {
        message: String(err),
        name: 'Error',
        line: 1,
        lineContent: code.split('\n')[0]?.trim(),
      },
    }
  } finally {
    if (isolate) {
      isolate.dispose()
    }
  }
}

process.on('message', async (msg) => {
  try {
    if (msg.type === 'execute') {
      const result = await executeCode(msg.request)
      if (process.send && process.connected) {
        process.send({ type: 'result', executionId: msg.executionId, result })
      }
    } else if (msg.type === 'fetchResponse') {
      const pending = pendingFetches.get(msg.fetchId)
      if (pending) {
        clearTimeout(pending.timeout)
        pendingFetches.delete(msg.fetchId)
        pending.resolve(msg.response)
      }
    }
  } catch (err) {
    if (msg.type === 'execute' && process.send && process.connected) {
      process.send({
        type: 'result',
        executionId: msg.executionId,
        result: {
          result: null,
          stdout: '',
          error: {
            message: err instanceof Error ? err.message : 'Worker error',
            name: 'WorkerError',
          },
        },
      })
    }
  }
})

if (process.send) {
  process.send({ type: 'ready' })
}
```

--------------------------------------------------------------------------------

---[FILE: isolated-vm.ts]---
Location: sim-main/apps/sim/lib/execution/isolated-vm.ts

```typescript
import { type ChildProcess, execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateProxyUrl } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('IsolatedVMExecution')

let nodeAvailable: boolean | null = null

function checkNodeAvailable(): boolean {
  if (nodeAvailable !== null) return nodeAvailable
  try {
    execSync('node --version', { stdio: 'ignore' })
    nodeAvailable = true
  } catch {
    nodeAvailable = false
  }
  return nodeAvailable
}

export interface IsolatedVMExecutionRequest {
  code: string
  params: Record<string, unknown>
  envVars: Record<string, string>
  contextVariables: Record<string, unknown>
  timeoutMs: number
  requestId: string
}

export interface IsolatedVMExecutionResult {
  result: unknown
  stdout: string
  error?: IsolatedVMError
}

export interface IsolatedVMError {
  message: string
  name: string
  stack?: string
  line?: number
  column?: number
  lineContent?: string
}

interface PendingExecution {
  resolve: (result: IsolatedVMExecutionResult) => void
  timeout: ReturnType<typeof setTimeout>
}

let worker: ChildProcess | null = null
let workerReady = false
let workerReadyPromise: Promise<void> | null = null
let workerIdleTimeout: ReturnType<typeof setTimeout> | null = null
const pendingExecutions = new Map<number, PendingExecution>()
let executionIdCounter = 0

const WORKER_IDLE_TIMEOUT_MS = 60000

function cleanupWorker() {
  if (workerIdleTimeout) {
    clearTimeout(workerIdleTimeout)
    workerIdleTimeout = null
  }
  if (worker) {
    worker.kill()
    worker = null
  }
  workerReady = false
  workerReadyPromise = null
}

function resetIdleTimeout() {
  if (workerIdleTimeout) {
    clearTimeout(workerIdleTimeout)
  }
  workerIdleTimeout = setTimeout(() => {
    if (pendingExecutions.size === 0) {
      logger.info('Cleaning up idle isolated-vm worker')
      cleanupWorker()
    }
  }, WORKER_IDLE_TIMEOUT_MS)
}

/**
 * Secure fetch wrapper that validates URLs to prevent SSRF attacks
 */
async function secureFetch(requestId: string, url: string, options?: RequestInit): Promise<string> {
  const validation = validateProxyUrl(url)
  if (!validation.isValid) {
    logger.warn(`[${requestId}] Blocked fetch request due to SSRF validation`, {
      url: url.substring(0, 100),
      error: validation.error,
    })
    return JSON.stringify({ error: `Security Error: ${validation.error}` })
  }

  try {
    const response = await fetch(url, options)
    const body = await response.text()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    return JSON.stringify({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      body,
      headers,
    })
  } catch (error: unknown) {
    return JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown fetch error' })
  }
}

/**
 * Handle IPC messages from the Node.js worker
 */
function handleWorkerMessage(message: unknown) {
  if (typeof message !== 'object' || message === null) return
  const msg = message as Record<string, unknown>

  if (msg.type === 'result') {
    const pending = pendingExecutions.get(msg.executionId as number)
    if (pending) {
      clearTimeout(pending.timeout)
      pendingExecutions.delete(msg.executionId as number)
      pending.resolve(msg.result as IsolatedVMExecutionResult)
    }
    return
  }

  if (msg.type === 'fetch') {
    const { fetchId, requestId, url, optionsJson } = msg as {
      fetchId: number
      requestId: string
      url: string
      optionsJson?: string
    }
    let options: RequestInit | undefined
    if (optionsJson) {
      try {
        options = JSON.parse(optionsJson)
      } catch {
        worker?.send({
          type: 'fetchResponse',
          fetchId,
          response: JSON.stringify({ error: 'Invalid fetch options JSON' }),
        })
        return
      }
    }
    secureFetch(requestId, url, options)
      .then((response) => {
        try {
          worker?.send({ type: 'fetchResponse', fetchId, response })
        } catch (err) {
          logger.error('Failed to send fetch response to worker', { err, fetchId })
        }
      })
      .catch((err) => {
        try {
          worker?.send({
            type: 'fetchResponse',
            fetchId,
            response: JSON.stringify({
              error: err instanceof Error ? err.message : 'Fetch failed',
            }),
          })
        } catch (sendErr) {
          logger.error('Failed to send fetch error to worker', { sendErr, fetchId })
        }
      })
  }
}

/**
 * Start the Node.js worker process
 */
async function ensureWorker(): Promise<void> {
  if (workerReady && worker) return
  if (workerReadyPromise) return workerReadyPromise

  workerReadyPromise = new Promise<void>((resolve, reject) => {
    if (!checkNodeAvailable()) {
      reject(
        new Error(
          'Node.js is required for code execution but was not found. ' +
            'Please install Node.js (v20+) from https://nodejs.org'
        )
      )
      return
    }

    const currentDir = path.dirname(fileURLToPath(import.meta.url))
    const workerPath = path.join(currentDir, 'isolated-vm-worker.cjs')

    if (!fs.existsSync(workerPath)) {
      reject(new Error(`Worker file not found at ${workerPath}`))
      return
    }

    import('node:child_process').then(({ spawn }) => {
      worker = spawn('node', [workerPath], {
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        serialization: 'json',
      })

      worker.on('message', handleWorkerMessage)

      let stderrData = ''
      worker.stderr?.on('data', (data: Buffer) => {
        stderrData += data.toString()
      })

      const startTimeout = setTimeout(() => {
        worker?.kill()
        worker = null
        workerReady = false
        workerReadyPromise = null
        reject(new Error('Worker failed to start within timeout'))
      }, 10000)

      const readyHandler = (message: unknown) => {
        if (
          typeof message === 'object' &&
          message !== null &&
          (message as { type?: string }).type === 'ready'
        ) {
          workerReady = true
          clearTimeout(startTimeout)
          worker?.off('message', readyHandler)
          resolve()
        }
      }
      worker.on('message', readyHandler)

      worker.on('exit', (code) => {
        if (workerIdleTimeout) {
          clearTimeout(workerIdleTimeout)
          workerIdleTimeout = null
        }

        const wasStartupFailure = !workerReady && workerReadyPromise

        worker = null
        workerReady = false
        workerReadyPromise = null

        let errorMessage = 'Worker process exited unexpectedly'
        if (stderrData.includes('isolated_vm') || stderrData.includes('MODULE_NOT_FOUND')) {
          errorMessage =
            'Code execution requires the isolated-vm native module which failed to load. ' +
            'This usually means the module needs to be rebuilt for your Node.js version. ' +
            'Please run: cd node_modules/isolated-vm && npm rebuild'
          logger.error('isolated-vm module failed to load', { stderr: stderrData })
        } else if (stderrData) {
          errorMessage = `Worker process failed: ${stderrData.slice(0, 500)}`
          logger.error('Worker process failed', { stderr: stderrData })
        }

        if (wasStartupFailure) {
          clearTimeout(startTimeout)
          reject(new Error(errorMessage))
          return
        }

        for (const [id, pending] of pendingExecutions) {
          clearTimeout(pending.timeout)
          pending.resolve({
            result: null,
            stdout: '',
            error: { message: errorMessage, name: 'WorkerError' },
          })
          pendingExecutions.delete(id)
        }
      })
    })
  })

  return workerReadyPromise
}

/**
 * Execute JavaScript code in an isolated V8 isolate via Node.js subprocess.
 * The worker's V8 isolate enforces timeoutMs internally. The parent timeout
 * (timeoutMs + 1000) is a safety buffer for IPC communication.
 */
export async function executeInIsolatedVM(
  req: IsolatedVMExecutionRequest
): Promise<IsolatedVMExecutionResult> {
  if (workerIdleTimeout) {
    clearTimeout(workerIdleTimeout)
    workerIdleTimeout = null
  }

  await ensureWorker()

  if (!worker) {
    return {
      result: null,
      stdout: '',
      error: { message: 'Failed to start isolated-vm worker', name: 'WorkerError' },
    }
  }

  const executionId = ++executionIdCounter

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      pendingExecutions.delete(executionId)
      resolve({
        result: null,
        stdout: '',
        error: { message: `Execution timed out after ${req.timeoutMs}ms`, name: 'TimeoutError' },
      })
    }, req.timeoutMs + 1000)

    pendingExecutions.set(executionId, { resolve, timeout })

    try {
      worker!.send({ type: 'execute', executionId, request: req })
    } catch {
      clearTimeout(timeout)
      pendingExecutions.delete(executionId)
      resolve({
        result: null,
        stdout: '',
        error: { message: 'Failed to send execution request to worker', name: 'WorkerError' },
      })
      return
    }

    resetIdleTimeout()
  })
}
```

--------------------------------------------------------------------------------

---[FILE: languages.ts]---
Location: sim-main/apps/sim/lib/execution/languages.ts

```typescript
/**
 * Supported code execution languages
 */
export enum CodeLanguage {
  JavaScript = 'javascript',
  Python = 'python',
}

/**
 * Type guard to check if a string is a valid CodeLanguage
 */
export function isValidCodeLanguage(value: string): value is CodeLanguage {
  return Object.values(CodeLanguage).includes(value as CodeLanguage)
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(language: CodeLanguage): string {
  switch (language) {
    case CodeLanguage.JavaScript:
      return 'JavaScript'
    case CodeLanguage.Python:
      return 'Python'
    default:
      return language
  }
}

/**
 * Default language for code execution
 */
export const DEFAULT_CODE_LANGUAGE = CodeLanguage.JavaScript
```

--------------------------------------------------------------------------------

---[FILE: preprocessing.ts]---
Location: sim-main/apps/sim/lib/execution/preprocessing.ts

```typescript
import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { checkServerSideUsageLimits } from '@/lib/billing/calculations/usage-monitor'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { RateLimiter } from '@/lib/core/rate-limiter/rate-limiter'
import { createLogger } from '@/lib/logs/console/logger'
import { LoggingSession } from '@/lib/logs/execution/logging-session'
import { getWorkspaceBilledAccountUserId } from '@/lib/workspaces/utils'

const logger = createLogger('ExecutionPreprocessing')

const BILLING_ERROR_MESSAGES = {
  BILLING_REQUIRED:
    'Unable to resolve billing account. This workflow cannot execute without a valid billing account.',
  BILLING_ERROR_GENERIC: 'Error resolving billing account',
} as const

/**
 * Attempts to resolve billing actor with fallback for resume contexts.
 * Returns the resolved actor user ID or null if resolution fails and should block execution.
 *
 * For resume contexts, this function allows fallback to the workflow owner if workspace
 * billing cannot be resolved, ensuring users can complete their paused workflows even
 * if billing configuration changes mid-execution.
 *
 * @returns Object containing actorUserId (null if should block) and shouldBlock flag
 */
async function resolveBillingActorWithFallback(params: {
  requestId: string
  workflowId: string
  workspaceId: string
  executionId: string
  triggerType: string
  workflowRecord: WorkflowRecord
  userId: string
  isResumeContext: boolean
  baseActorUserId: string | null
  failureReason: 'null' | 'error'
  error?: unknown
  loggingSession?: LoggingSession
}): Promise<
  { actorUserId: string; shouldBlock: false } | { actorUserId: null; shouldBlock: true }
> {
  const {
    requestId,
    workflowId,
    workspaceId,
    executionId,
    triggerType,
    workflowRecord,
    userId,
    isResumeContext,
    baseActorUserId,
    failureReason,
    error,
    loggingSession,
  } = params

  if (baseActorUserId) {
    return { actorUserId: baseActorUserId, shouldBlock: false }
  }

  const workflowOwner = workflowRecord.userId?.trim()
  if (isResumeContext && workflowOwner) {
    const logMessage =
      failureReason === 'null'
        ? '[BILLING_FALLBACK] Workspace billing account is null. Using workflow owner for billing.'
        : '[BILLING_FALLBACK] Exception during workspace billing resolution. Using workflow owner for billing.'

    logger.warn(`[${requestId}] ${logMessage}`, {
      workflowId,
      workspaceId,
      fallbackUserId: workflowOwner,
      ...(error ? { error } : {}),
    })

    return { actorUserId: workflowOwner, shouldBlock: false }
  }

  const fallbackUserId = workflowRecord.userId || userId || 'unknown'
  const errorMessage =
    failureReason === 'null'
      ? BILLING_ERROR_MESSAGES.BILLING_REQUIRED
      : BILLING_ERROR_MESSAGES.BILLING_ERROR_GENERIC

  logger.warn(`[${requestId}] ${errorMessage}`, {
    workflowId,
    workspaceId,
    ...(error ? { error } : {}),
  })

  await logPreprocessingError({
    workflowId,
    executionId,
    triggerType,
    requestId,
    userId: fallbackUserId,
    workspaceId,
    errorMessage,
    loggingSession,
  })

  return { actorUserId: null, shouldBlock: true }
}

export interface PreprocessExecutionOptions {
  // Required fields
  workflowId: string
  userId: string // The authenticated user ID
  triggerType: 'manual' | 'api' | 'webhook' | 'schedule' | 'chat'
  executionId: string
  requestId: string

  // Optional checks configuration
  checkRateLimit?: boolean // Default: false for manual/chat, true for others
  checkDeployment?: boolean // Default: true for non-manual triggers
  skipUsageLimits?: boolean // Default: false (only use for test mode)

  // Context information
  workspaceId?: string // If known, used for billing resolution
  loggingSession?: LoggingSession // If provided, will be used for error logging
  isResumeContext?: boolean // If true, allows fallback billing on resolution failure (for paused workflow resumes)
}

/**
 * Result of preprocessing checks
 */
export interface PreprocessExecutionResult {
  success: boolean
  error?: {
    message: string
    statusCode: number // HTTP status code (401, 402, 403, 404, 429, 500)
    logCreated: boolean // Whether error was logged to execution_logs
  }
  actorUserId?: string // The user ID that will be billed
  workflowRecord?: WorkflowRecord
  userSubscription?: SubscriptionInfo | null
  rateLimitInfo?: {
    allowed: boolean
    remaining: number
    resetAt: Date
  }
}

type WorkflowRecord = typeof workflow.$inferSelect
type SubscriptionInfo = Awaited<ReturnType<typeof getHighestPrioritySubscription>>

export async function preprocessExecution(
  options: PreprocessExecutionOptions
): Promise<PreprocessExecutionResult> {
  const {
    workflowId,
    userId,
    triggerType,
    executionId,
    requestId,
    checkRateLimit = triggerType !== 'manual' && triggerType !== 'chat',
    checkDeployment = triggerType !== 'manual',
    skipUsageLimits = false,
    workspaceId: providedWorkspaceId,
    loggingSession: providedLoggingSession,
    isResumeContext = false,
  } = options

  logger.info(`[${requestId}] Starting execution preprocessing`, {
    workflowId,
    userId,
    triggerType,
    executionId,
  })

  // ========== STEP 1: Validate Workflow Exists ==========
  let workflowRecord: WorkflowRecord | null = null
  try {
    const records = await db.select().from(workflow).where(eq(workflow.id, workflowId)).limit(1)

    if (records.length === 0) {
      logger.warn(`[${requestId}] Workflow not found: ${workflowId}`)

      await logPreprocessingError({
        workflowId,
        executionId,
        triggerType,
        requestId,
        userId: 'unknown',
        workspaceId: '',
        errorMessage:
          'Workflow not found. The workflow may have been deleted or is no longer accessible.',
        loggingSession: providedLoggingSession,
      })

      return {
        success: false,
        error: {
          message: 'Workflow not found',
          statusCode: 404,
          logCreated: true,
        },
      }
    }

    workflowRecord = records[0]
  } catch (error) {
    logger.error(`[${requestId}] Error fetching workflow`, { error, workflowId })

    await logPreprocessingError({
      workflowId,
      executionId,
      triggerType,
      requestId,
      userId: userId || 'unknown',
      workspaceId: providedWorkspaceId || '',
      errorMessage: 'Internal error while fetching workflow',
      loggingSession: providedLoggingSession,
    })

    return {
      success: false,
      error: {
        message: 'Internal error while fetching workflow',
        statusCode: 500,
        logCreated: true,
      },
    }
  }

  const workspaceId = workflowRecord.workspaceId || providedWorkspaceId || ''

  // ========== STEP 2: Check Deployment Status ==========
  // If workflow is not deployed and deployment is required, reject without logging.
  // No log entry or cost should be created for calls to undeployed workflows
  // since the workflow was never intended to run.
  if (checkDeployment && !workflowRecord.isDeployed) {
    logger.warn(`[${requestId}] Workflow not deployed: ${workflowId}`)

    return {
      success: false,
      error: {
        message: 'Workflow is not deployed',
        statusCode: 403,
        logCreated: false,
      },
    }
  }

  // ========== STEP 3: Resolve Billing Actor ==========
  let actorUserId: string | null = null

  try {
    if (workspaceId) {
      actorUserId = await getWorkspaceBilledAccountUserId(workspaceId)
      if (actorUserId) {
        logger.info(`[${requestId}] Using workspace billed account: ${actorUserId}`)
      }
    }

    if (!actorUserId) {
      actorUserId = workflowRecord.userId || userId
      logger.info(`[${requestId}] Using workflow owner as actor: ${actorUserId}`)
    }

    if (!actorUserId) {
      const result = await resolveBillingActorWithFallback({
        requestId,
        workflowId,
        workspaceId,
        executionId,
        triggerType,
        workflowRecord,
        userId,
        isResumeContext,
        baseActorUserId: actorUserId,
        failureReason: 'null',
        loggingSession: providedLoggingSession,
      })

      if (result.shouldBlock) {
        return {
          success: false,
          error: {
            message: 'Unable to resolve billing account',
            statusCode: 500,
            logCreated: true,
          },
        }
      }

      actorUserId = result.actorUserId
    }
  } catch (error) {
    logger.error(`[${requestId}] Error resolving billing actor`, { error, workflowId })

    const result = await resolveBillingActorWithFallback({
      requestId,
      workflowId,
      workspaceId,
      executionId,
      triggerType,
      workflowRecord,
      userId,
      isResumeContext,
      baseActorUserId: null,
      failureReason: 'error',
      error,
      loggingSession: providedLoggingSession,
    })

    if (result.shouldBlock) {
      return {
        success: false,
        error: {
          message: 'Error resolving billing account',
          statusCode: 500,
          logCreated: true,
        },
      }
    }

    actorUserId = result.actorUserId
  }

  // ========== STEP 4: Get User Subscription ==========
  let userSubscription: SubscriptionInfo = null
  try {
    userSubscription = await getHighestPrioritySubscription(actorUserId)
    logger.debug(`[${requestId}] User subscription retrieved`, {
      actorUserId,
      hasSub: !!userSubscription,
      plan: userSubscription?.plan,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching subscription`, { error, actorUserId })
  }

  // ========== STEP 5: Check Rate Limits ==========
  let rateLimitInfo: { allowed: boolean; remaining: number; resetAt: Date } | undefined

  if (checkRateLimit) {
    try {
      const rateLimiter = new RateLimiter()
      rateLimitInfo = await rateLimiter.checkRateLimitWithSubscription(
        actorUserId,
        userSubscription,
        triggerType,
        false // not async
      )

      if (!rateLimitInfo.allowed) {
        logger.warn(`[${requestId}] Rate limit exceeded for user ${actorUserId}`, {
          triggerType,
          remaining: rateLimitInfo.remaining,
          resetAt: rateLimitInfo.resetAt,
        })

        await logPreprocessingError({
          workflowId,
          executionId,
          triggerType,
          requestId,
          userId: actorUserId,
          workspaceId,
          errorMessage: `Rate limit exceeded. ${rateLimitInfo.remaining} requests remaining. Resets at ${rateLimitInfo.resetAt.toISOString()}.`,
          loggingSession: providedLoggingSession,
        })

        return {
          success: false,
          error: {
            message: `Rate limit exceeded. Please try again later.`,
            statusCode: 429,
            logCreated: true,
          },
        }
      }

      logger.debug(`[${requestId}] Rate limit check passed`, {
        remaining: rateLimitInfo.remaining,
      })
    } catch (error) {
      logger.error(`[${requestId}] Error checking rate limits`, { error, actorUserId })

      await logPreprocessingError({
        workflowId,
        executionId,
        triggerType,
        requestId,
        userId: actorUserId,
        workspaceId,
        errorMessage: 'Error checking rate limits. Execution blocked for safety.',
        loggingSession: providedLoggingSession,
      })

      return {
        success: false,
        error: {
          message: 'Error checking rate limits',
          statusCode: 500,
          logCreated: true,
        },
      }
    }
  }

  // ========== STEP 6: Check Usage Limits (CRITICAL) ==========
  if (!skipUsageLimits) {
    try {
      const usageCheck = await checkServerSideUsageLimits(actorUserId)

      if (usageCheck.isExceeded) {
        logger.warn(
          `[${requestId}] User ${actorUserId} has exceeded usage limits. Blocking execution.`,
          {
            currentUsage: usageCheck.currentUsage,
            limit: usageCheck.limit,
            workflowId,
            triggerType,
          }
        )

        await logPreprocessingError({
          workflowId,
          executionId,
          triggerType,
          requestId,
          userId: actorUserId,
          workspaceId,
          errorMessage:
            usageCheck.message ||
            `Usage limit exceeded: $${usageCheck.currentUsage?.toFixed(2)} used of $${usageCheck.limit?.toFixed(2)} limit. Please upgrade your plan to continue.`,
          loggingSession: providedLoggingSession,
        })

        return {
          success: false,
          error: {
            message:
              usageCheck.message || 'Usage limit exceeded. Please upgrade your plan to continue.',
            statusCode: 402,
            logCreated: true,
          },
        }
      }

      logger.debug(`[${requestId}] Usage limit check passed`, {
        currentUsage: usageCheck.currentUsage,
        limit: usageCheck.limit,
      })
    } catch (error) {
      logger.error(`[${requestId}] Error checking usage limits`, { error, actorUserId })

      await logPreprocessingError({
        workflowId,
        executionId,
        triggerType,
        requestId,
        userId: actorUserId,
        workspaceId,
        errorMessage:
          'Unable to determine usage limits. Execution blocked for security. Please contact support.',
        loggingSession: providedLoggingSession,
      })

      return {
        success: false,
        error: {
          message: 'Unable to determine usage limits. Execution blocked for security.',
          statusCode: 500,
          logCreated: true,
        },
      }
    }
  } else {
    logger.debug(`[${requestId}] Skipping usage limits check (test mode)`)
  }

  // ========== SUCCESS: All Checks Passed ==========
  logger.info(`[${requestId}] All preprocessing checks passed`, {
    workflowId,
    actorUserId,
    triggerType,
  })

  return {
    success: true,
    actorUserId,
    workflowRecord,
    userSubscription,
    rateLimitInfo,
  }
}

/**
 * Helper function to log preprocessing errors to the database
 *
 * This ensures users can see why their workflow execution was blocked.
 */
async function logPreprocessingError(params: {
  workflowId: string
  executionId: string
  triggerType: string
  requestId: string
  userId: string
  workspaceId: string
  errorMessage: string
  loggingSession?: LoggingSession
}): Promise<void> {
  const {
    workflowId,
    executionId,
    triggerType,
    requestId,
    userId,
    workspaceId,
    errorMessage,
    loggingSession,
  } = params

  try {
    const session =
      loggingSession || new LoggingSession(workflowId, executionId, triggerType as any, requestId)

    await session.safeStart({
      userId,
      workspaceId,
      variables: {},
    })

    await session.safeCompleteWithError({
      error: {
        message: errorMessage,
        stackTrace: undefined,
      },
      traceSpans: [],
    })

    logger.debug(`[${requestId}] Logged preprocessing error to database`, {
      workflowId,
      executionId,
    })
  } catch (error) {
    logger.error(`[${requestId}] Failed to log preprocessing error`, {
      error,
      workflowId,
      executionId,
    })
    // Don't throw - error logging should not block the error response
  }
}
```

--------------------------------------------------------------------------------

````

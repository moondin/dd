---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 212
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 212 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: config.ts]---
Location: mlflow-master/libs/typescript/core/src/core/config.ts

```typescript
import path from 'path';
import fs from 'fs';
import os from 'os';
import { parse as parseIni } from 'ini';
import { initializeSDK } from './provider';

/**
 * Default Databricks profile name
 */
const DEFAULT_PROFILE = 'DEFAULT';

/**
 * Validate that a URI has a proper protocol (http or https)
 * @param uri The URI to validate
 * @returns true if valid, false otherwise
 */
function isValidHttpUri(uri: string): boolean {
  try {
    const url = new URL(uri);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Configuration options for the MLflow tracing SDK
 */
export interface MLflowTracingConfig {
  /**
   * The host where traces will be logged.
   * Can be:
   * - HTTP URI for MLflow trace server backend
   * - "databricks" (uses default profile)
   * - "databricks://profile" (uses specific profile)
   */
  trackingUri: string;

  /**
   * The experiment ID where traces will be logged
   */
  experimentId: string;

  /**
   * The location of the Databricks config file, default to ~/.databrickscfg
   */
  databricksConfigPath?: string;

  /**
   * The Databricks host. If not provided, the host will be read from the Databricks config file.
   */
  host?: string;

  /**
   * The Databricks token. If not provided, the token will be read from the Databricks config file.
   */
  databricksToken?: string;

  /**
   * The tracking server username for basic auth.
   */
  trackingServerUsername?: string;

  /**
   * The tracking server password for basic auth.
   */
  trackingServerPassword?: string;
}

/**
 * Initialization options for the MLflow tracing SDK. The trackingUri and experimentId
 * can be omitted and will be resolved from environment variables when available. Since
 * this is used on the client side, we need to make sure the trackingUri and experimentId
 * are required.
 */
export type MLflowTracingInitOptions = Partial<MLflowTracingConfig>;

/**
 * Global configuration state
 */
let globalConfig: MLflowTracingConfig | null = null;

/**
 * Configure the MLflow tracing SDK with tracking location settings.
 * This must be called before using other tracing functions.
 *
 * @param config Configuration object with trackingUri and experimentId
 *
 * @example
 * ```typescript
 * import { init, withSpan } from 'mlflow-tracing-ts';
 *
 * // Option 1: Use MLflow Tracking Server
 * init({
 *   trackingUri: "http://localhost:5000",
 *   experimentId: "123456789"
 * });
 *
 * // Option 2: Use default Databricks profile from ~/.databrickscfg
 * init({
 *   trackingUri: "databricks",
 *   experimentId: "123456789"
 * });
 *
 * // Option 3: Use specific Databricks profile
 * init({
 *   trackingUri: "databricks://my-profile",
 *   experimentId: "123456789"
 * });
 *
 * // Option 4: Custom config file path
 * init({
 *   trackingUri: "databricks",
 *   experimentId: "123456789",
 *   databricksConfigPath: "/path/to/my/databrickscfg"
 * });
 *
 * // Option 5: Override with explicit host/token (bypasses config file)
 * init({
 *   trackingUri: "databricks",
 *   experimentId: "123456789",
 *   host: "https://my-workspace.databricks.com",
 *   databricksToken: "my-token"
 * });
 *
 * // Now you can use tracing functions
 * function add(a: number, b: number) {
 *   return withSpan(
 *     { name: 'add', inputs: { a, b } },
 *     (span) => {
 *       const result = a + b;
 *       span.setOutputs({ result });
 *       return result;
 *     }
 *   );
 * }
 * ```
 */
export function init(config: MLflowTracingInitOptions): void {
  const trackingUri = config.trackingUri ?? process.env.MLFLOW_TRACKING_URI;
  const experimentId = config.experimentId ?? process.env.MLFLOW_EXPERIMENT_ID;

  if (!trackingUri) {
    throw new Error(
      'An MLflow Tracking URI is required, please provide the trackingUri option to init, or set the MLFLOW_TRACKING_URI environment variable'
    );
  }

  if (!experimentId) {
    throw new Error(
      'An MLflow experiment ID is required, please provide the experimentId option to init, or set the MLFLOW_EXPERIMENT_ID environment variable'
    );
  }

  if (typeof trackingUri !== 'string') {
    throw new Error('trackingUri must be a string');
  }

  if (typeof experimentId !== 'string') {
    throw new Error('experimentId must be a string');
  }

  const databricksConfigPath =
    config.databricksConfigPath ?? path.join(os.homedir(), '.databrickscfg');

  const effectiveConfig: MLflowTracingConfig = {
    ...config,
    trackingUri,
    experimentId,
    databricksConfigPath
  };

  if (
    effectiveConfig.trackingUri === 'databricks' ||
    effectiveConfig.trackingUri?.startsWith('databricks://')
  ) {
    const configPathToUse = effectiveConfig.databricksConfigPath;

    if (!effectiveConfig.host || !effectiveConfig.databricksToken) {
      const envHost = process.env.DATABRICKS_HOST;
      const envToken = process.env.DATABRICKS_TOKEN;

      if (envHost && envToken) {
        if (!effectiveConfig.host) {
          effectiveConfig.host = envHost;
        }
        if (!effectiveConfig.databricksToken) {
          effectiveConfig.databricksToken = envToken;
        }
      } else {
        // Fall back to config file
        // Determine profile name from trackingUri
        let profile = DEFAULT_PROFILE;
        if (effectiveConfig.trackingUri?.startsWith('databricks://')) {
          const profilePart = effectiveConfig.trackingUri.slice('databricks://'.length);
          if (profilePart) {
            profile = profilePart;
          }
        }

        try {
          const { host, token } = readDatabricksConfig(configPathToUse ?? '', profile);
          if (!effectiveConfig.host) {
            effectiveConfig.host = host;
          }
          if (!effectiveConfig.databricksToken) {
            effectiveConfig.databricksToken = token;
          }
        } catch (error) {
          throw new Error(
            `Failed to read Databricks configuration for profile '${profile}': ${(error as Error).message}. ` +
              `Make sure your ${configPathToUse} file exists and contains valid credentials, or set DATABRICKS_HOST and DATABRICKS_TOKEN environment variables.`
          );
        }
      }
    }
  } else {
    // For self-hosted MLflow tracking server, validate and use the trackingUri as the host
    if (!isValidHttpUri(effectiveConfig.trackingUri ?? '')) {
      throw new Error(
        `Invalid trackingUri: '${effectiveConfig.trackingUri}'. Must be a valid HTTP or HTTPS URL.`
      );
    }
    effectiveConfig.host = effectiveConfig.trackingUri;
  }

  globalConfig = { ...effectiveConfig };

  // Initialize SDK with new configuration
  initializeSDK();
}

/**
 * Get the current configuration. Throws an error if not configured.
 * @returns The current MLflow tracing configuration
 */
export function getConfig(): MLflowTracingConfig {
  if (!globalConfig) {
    throw new Error(
      'The MLflow Tracing client is not configured. Please call init() with host and experimentId before using tracing functions.'
    );
  }
  return globalConfig;
}

/**
 * Read Databricks configuration from .databrickscfg file
 * @internal This function is exported only for testing purposes
 * @param configPath Path to the Databricks config file
 * @param profile Profile name to read (defaults to 'DEFAULT')
 * @returns Object containing host and token
 */
export function readDatabricksConfig(configPath: string, profile: string = DEFAULT_PROFILE) {
  try {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Databricks config file not found at ${configPath}`);
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = parseIni(configContent);

    if (!config[profile]) {
      throw new Error(`Profile '${profile}' not found in Databricks config file`);
    }

    const profileConfig = config[profile] as { host?: string; token?: string };

    if (!profileConfig.host) {
      throw new Error(`Host not found for profile '${profile}' in Databricks config file`);
    }

    if (!profileConfig.token) {
      throw new Error(`Token not found for profile '${profile}' in Databricks config file`);
    }

    return {
      host: profileConfig.host,
      token: profileConfig.token
    };
  } catch (error) {
    throw new Error(`Failed to read Databricks config: ${(error as Error).message}`);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: mlflow-master/libs/typescript/core/src/core/constants.ts

```typescript
/**
 * Constants for MLflow Tracing
 */

/**
 * Enum for span types that can be used with MLflow Tracing
 */
export enum SpanType {
  LLM = 'LLM',
  CHAIN = 'CHAIN',
  AGENT = 'AGENT',
  TOOL = 'TOOL',
  CHAT_MODEL = 'CHAT_MODEL',
  RETRIEVER = 'RETRIEVER',
  PARSER = 'PARSER',
  EMBEDDING = 'EMBEDDING',
  RERANKER = 'RERANKER',
  MEMORY = 'MEMORY',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Constants for MLflow span attribute keys
 */
export const SpanAttributeKey = {
  EXPERIMENT_ID: 'mlflow.experimentId',
  TRACE_ID: 'mlflow.traceRequestId',
  INPUTS: 'mlflow.spanInputs',
  OUTPUTS: 'mlflow.spanOutputs',
  SPAN_TYPE: 'mlflow.spanType',
  // This attribute is used to store token usage information from LLM responses.
  // Stored in {"input_tokens": int, "output_tokens": int, "total_tokens": int} format.
  TOKEN_USAGE: 'mlflow.chat.tokenUsage',
  // This attribute indicates which flavor/format generated the LLM span. This is
  // used by downstream (e.g., UI) to determine the message format for parsing.
  MESSAGE_FORMAT: 'mlflow.message.format'
};

/**
 * Constants for MLflow trace metadata keys
 */
export const TraceMetadataKey = {
  SOURCE_RUN: 'mlflow.sourceRun',
  MODEL_ID: 'mlflow.modelId',
  SIZE_BYTES: 'mlflow.trace.sizeBytes',
  SCHEMA_VERSION: 'mlflow.trace_schema.version',
  TOKEN_USAGE: 'mlflow.trace.tokenUsage',
  // Deprecated, do not use. These fields are used for storing trace request and response
  // in MLflow 2.x. In MLflow 3.x, these are replaced in favor of the request_preview and
  // response_preview fields in the trace info.
  // TODO: Remove this once the new trace table UI is available that is based on MLflow V3 trace.
  INPUTS: 'mlflow.traceInputs',
  OUTPUTS: 'mlflow.traceOutputs'
};

/**
 * Constants for MLflow trace tag keys
 */
export const TraceTagKey = {
  MLFLOW_ARTIFACT_LOCATION: 'mlflow.artifactLocation'
};

/**
 * Current version of the MLflow trace schema
 */
export const TRACE_SCHEMA_VERSION = '3';

/**
 * The prefix for MLflow trace IDs
 */
export const TRACE_ID_PREFIX = 'tr-';

/**
 * The default name for spans if the name is not provided when starting a span
 */
export const DEFAULT_SPAN_NAME = 'span';

/**
 * Trace ID for no-op spans
 */
export const NO_OP_SPAN_TRACE_ID = 'no-op-span-trace-id';

/**
 * Constants for token usage keys (matching Python TokenUsageKey)
 */
export const TokenUsageKey = {
  INPUT_TOKENS: 'input_tokens',
  OUTPUT_TOKENS: 'output_tokens',
  TOTAL_TOKENS: 'total_tokens'
};

/**
 * Max length of the request/response preview in the trace info.
 */
export const REQUEST_RESPONSE_PREVIEW_MAX_LENGTH = 1000;
```

--------------------------------------------------------------------------------

---[FILE: provider.ts]---
Location: mlflow-master/libs/typescript/core/src/core/provider.ts

```typescript
import { trace, Tracer } from '@opentelemetry/api';
import { MlflowSpanExporter, MlflowSpanProcessor } from '../exporters/mlflow';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getConfig } from './config';
import { MlflowClient } from '../clients';

let sdk: NodeSDK | null = null;
// Keep a reference to the span processor for flushing
let processor: MlflowSpanProcessor | null = null;

export function initializeSDK(): void {
  if (sdk) {
    sdk.shutdown().catch((error) => {
      console.error('Error shutting down existing SDK:', error);
    });
  }

  try {
    const hostConfig = getConfig();
    if (!hostConfig.host) {
      console.warn('MLflow tracking server not configured. Call init() before using tracing APIs.');
      return;
    }

    const client = new MlflowClient({
      trackingUri: hostConfig.trackingUri,
      host: hostConfig.host,
      databricksToken: hostConfig.databricksToken,
      trackingServerUsername: hostConfig.trackingServerUsername,
      trackingServerPassword: hostConfig.trackingServerPassword
    });
    const exporter = new MlflowSpanExporter(client);
    processor = new MlflowSpanProcessor(exporter);

    sdk = new NodeSDK({ spanProcessors: [processor] });
    sdk.start();
  } catch (error) {
    console.error('Failed to initialize MLflow tracing:', error);
  }
}

export function getTracer(module_name: string): Tracer {
  return trace.getTracer(module_name);
}

/**
 * Force flush all pending trace exports.
 */
export async function flushTraces(): Promise<void> {
  await processor?.forceFlush();
}
```

--------------------------------------------------------------------------------

---[FILE: trace_manager.ts]---
Location: mlflow-master/libs/typescript/core/src/core/trace_manager.ts

```typescript
import { LiveSpan, Span } from './entities/span';
import { TraceInfo } from './entities/trace_info';
import { Trace } from './entities/trace';
import { TraceData } from './entities/trace_data';
import {
  REQUEST_RESPONSE_PREVIEW_MAX_LENGTH,
  SpanAttributeKey,
  TraceMetadataKey
} from './constants';

/**
 * Internal representation to keep the state of a trace.
 * Uses a Map<string, LiveSpan> instead of TraceData to allow access by span_id.
 */
class _Trace {
  info: TraceInfo;
  spanDict: Map<string, LiveSpan>;

  constructor(info: TraceInfo) {
    this.info = info;
    this.spanDict = new Map<string, LiveSpan>();
  }

  /**
   * Convert the internal trace representation to an MLflow Trace object
   */
  toMlflowTrace(): Trace {
    // Convert LiveSpan, mutable objects, into immutable Span objects before persisting
    const traceData = new TraceData([...this.spanDict.values()] as Span[]);

    const root_span = traceData.spans.find((span) => span.parentId == null);
    if (root_span) {
      // Accessing the OTel span directly get serialized value directly.
      // TODO: Implement the smart truncation logic.
      // Only set previews if they haven't been explicitly set by updateCurrentTrace
      if (!this.info.requestPreview) {
        this.info.requestPreview = getPreviewString(
          root_span._span.attributes[SpanAttributeKey.INPUTS] as string
        );
      }
      if (!this.info.responsePreview) {
        this.info.responsePreview = getPreviewString(
          root_span._span.attributes[SpanAttributeKey.OUTPUTS] as string
        );
      }

      // TODO: Remove this once the new trace table UI is available that is based on MLflow V3 trace.
      // Until then, these two metadata are still used to render the "request" and "response" columns.
      this.info.traceMetadata[TraceMetadataKey.INPUTS] = this.info.requestPreview;
      this.info.traceMetadata[TraceMetadataKey.OUTPUTS] = this.info.responsePreview;
    }

    return new Trace(this.info, traceData);
  }
}

function getPreviewString(inputsOrOutputs: string): string {
  if (!inputsOrOutputs) {
    return '';
  }

  if (inputsOrOutputs.length > REQUEST_RESPONSE_PREVIEW_MAX_LENGTH) {
    return inputsOrOutputs.slice(0, REQUEST_RESPONSE_PREVIEW_MAX_LENGTH - 3) + '...';
  }
  return inputsOrOutputs;
}

/**
 * Manage spans and traces created by the tracing system in memory.
 * This class is implemented as a singleton.
 */
export class InMemoryTraceManager {
  private static _instance: InMemoryTraceManager | undefined;

  // In-memory cache to store trace_id -> _Trace mapping
  // TODO: Add TTL to the trace buffer similarly to Python SDK
  private _traces: Map<string, _Trace>;
  // Store mapping between OpenTelemetry trace ID and MLflow trace ID
  private _otelIdToMlflowTraceId: Map<string, string>;

  // Store the last active trace ID
  lastActiveTraceId: string | undefined;

  /**
   * Singleton pattern implementation
   */
  static getInstance(): InMemoryTraceManager {
    if (InMemoryTraceManager._instance == null) {
      InMemoryTraceManager._instance = new InMemoryTraceManager();
    }
    return InMemoryTraceManager._instance;
  }

  private constructor() {
    this._traces = new Map<string, _Trace>();
    this._otelIdToMlflowTraceId = new Map<string, string>();
  }

  /**
   * Register a new trace info object to the in-memory trace registry.
   * @param otelTraceId The OpenTelemetry trace ID for the new trace
   * @param traceInfo The trace info object to be stored
   */
  registerTrace(otelTraceId: string, traceInfo: TraceInfo): void {
    this._traces.set(traceInfo.traceId, new _Trace(traceInfo));
    this._otelIdToMlflowTraceId.set(otelTraceId, traceInfo.traceId);
  }

  /**
   * Store the given span in the in-memory trace data.
   * @param span The span to be stored
   */
  registerSpan(span: LiveSpan): void {
    const trace = this._traces.get(span.traceId);
    if (trace) {
      trace.spanDict.set(span.spanId, span);
    } else {
      console.debug(`Tried to register span ${span.spanId} for trace ${span.traceId}
                     but trace not found. Please make sure to register the trace first.`);
    }
  }

  /**
   * Get the trace for the given trace ID.
   * Returns the trace object or null if not found.
   * @param traceId The trace ID to look up
   */
  getTrace(traceId: string): _Trace | null {
    return this._traces.get(traceId) || null;
  }

  /**
   * Get the MLflow trace ID for the given OpenTelemetry trace ID.
   * @param otelTraceId The OpenTelemetry trace ID
   */
  getMlflowTraceIdFromOtelId(otelTraceId: string): string | null {
    return this._otelIdToMlflowTraceId.get(otelTraceId) || null;
  }

  /**
   * Get the span for the given trace ID and span ID.
   * @param traceId The trace ID
   * @param spanId The span ID
   */
  getSpan(traceId?: string | null, spanId?: string | null): LiveSpan | null {
    if (traceId == null || spanId == null) {
      return null;
    }
    return this._traces.get(traceId)?.spanDict.get(spanId) || null;
  }

  /**
   * Pop trace data for the given OpenTelemetry trace ID and return it as
   * a ready-to-publish Trace object.
   * @param otelTraceId The OpenTelemetry trace ID
   */
  popTrace(otelTraceId: string): Trace | null {
    const mlflowTraceId = this._otelIdToMlflowTraceId.get(otelTraceId);
    if (!mlflowTraceId) {
      console.debug(`Tried to pop trace ${otelTraceId} but no trace found.`);
      return null;
    }

    this._otelIdToMlflowTraceId.delete(otelTraceId);
    const trace = this._traces.get(mlflowTraceId);
    if (trace) {
      this._traces.delete(mlflowTraceId);
      return trace.toMlflowTrace();
    }
    console.debug(`Tried to pop trace ${otelTraceId} but trace not found.`);
    return null;
  }

  /**
   * Clear all the aggregated trace data. This should only be used for testing.
   */
  static reset(): void {
    if (InMemoryTraceManager._instance) {
      InMemoryTraceManager._instance._traces.clear();
      InMemoryTraceManager._instance._otelIdToMlflowTraceId.clear();
      InMemoryTraceManager._instance = undefined;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: span.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/span.ts

```typescript
import {
  HrTime,
  INVALID_SPANID,
  INVALID_TRACEID,
  SpanStatusCode as OTelSpanStatusCode
} from '@opentelemetry/api';
import type { Span as OTelSpan } from '@opentelemetry/sdk-trace-base';
import { SpanAttributeKey, SpanType, NO_OP_SPAN_TRACE_ID } from '../constants';
import { SpanEvent } from './span_event';
import { SpanStatus, SpanStatusCode } from './span_status';
import {
  convertHrTimeToNanoSeconds,
  convertNanoSecondsToHrTime,
  encodeSpanIdToBase64,
  encodeTraceIdToBase64,
  decodeIdFromBase64
} from '../utils';
import { safeJsonStringify } from '../utils/json';
/**
 * MLflow Span interface
 */

export interface ISpan {
  /**
   * The OpenTelemetry span wrapped by MLflow Span
   */
  readonly _span: OTelSpan;

  /**
   * The trace ID
   */
  readonly traceId: string;

  /**
   * The attributes of the span
   */
  readonly attributes: Record<string, any>;

  get spanId(): string;
  get name(): string;
  get spanType(): SpanType;
  get startTime(): HrTime;
  get endTime(): HrTime | null;
  get parentId(): string | null;
  get status(): SpanStatus;
  get inputs(): any;
  get outputs(): any;

  /**
   * Get an attribute from the span
   * @param key Attribute key
   * @returns Attribute value
   */
  getAttribute(key: string): any;

  /**
   * Get events from the span
   */
  get events(): SpanEvent[];

  /**
   * Convert this span to JSON format
   * @returns JSON object representation of the span
   */
  toJson(): SerializedSpan;
}

/**
 * MLflow Span class that wraps the OpenTelemetry Span.
 */
export class Span implements ISpan {
  readonly _span: OTelSpan;
  readonly _attributesRegistry: SpanAttributesRegistry;

  // Internal only flag to allow mutating the ended span. This is used to set the custom attributes
  // from span processor's onEnd hook. The hook is invoked after the span is ended and OpenTelemetry
  // blocks setting attributes on them by default. Set this flag to true to allow mutating the ended
  // span.
  allowMutatingEndedSpan: boolean = false;

  /**
   * Create a new MLflowSpan
   * @param span OpenTelemetry span
   */
  constructor(span: OTelSpan, is_mutable: boolean = false) {
    this._span = span;

    if (is_mutable) {
      this._attributesRegistry = new SpanAttributesRegistry(span);
    } else {
      this._attributesRegistry = new CachedSpanAttributesRegistry(span);
    }
  }

  get traceId(): string {
    return this.getAttribute(SpanAttributeKey.TRACE_ID) as string;
  }

  get spanId(): string {
    return this._span.spanContext().spanId;
  }

  get spanType(): SpanType {
    return this.getAttribute(SpanAttributeKey.SPAN_TYPE) as SpanType;
  }

  /**
   * Get the parent span ID
   */
  get parentId(): string | null {
    return this._span.parentSpanContext?.spanId ?? null;
  }

  get name(): string {
    return this._span.name;
  }

  get startTime(): HrTime {
    return this._span.startTime;
  }

  get endTime(): HrTime | null {
    return this._span.endTime;
  }

  get status(): SpanStatus {
    return SpanStatus.fromOtelStatus(this._span.status);
  }

  get inputs(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getAttribute(SpanAttributeKey.INPUTS);
  }

  get outputs(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getAttribute(SpanAttributeKey.OUTPUTS);
  }

  get attributes(): Record<string, any> {
    return this._attributesRegistry.getAll();
  }

  getAttribute(key: string): any {
    return this._attributesRegistry.get(key);
  }

  get events(): SpanEvent[] {
    return this._span.events.map((event) => {
      const [seconds, nanoseconds] = event.time;
      return new SpanEvent({
        name: event.name,
        attributes: event.attributes as Record<string, any>,
        timestamp: BigInt(seconds) * 1_000_000_000n + BigInt(nanoseconds)
      });
    });
  }

  /**
   * Convert this span to JSON format (OpenTelemetry format)
   * @returns JSON object representation of the span
   */
  toJson(): SerializedSpan {
    return {
      trace_id: encodeTraceIdToBase64(this.traceId),
      span_id: encodeSpanIdToBase64(this.spanId),
      // Use empty string for parent_span_id if it is not set, to be consistent with Python implementation.
      parent_span_id: this.parentId ? encodeSpanIdToBase64(this.parentId) : '',
      name: this.name,
      start_time_unix_nano: convertHrTimeToNanoSeconds(this.startTime),
      end_time_unix_nano: this.endTime ? convertHrTimeToNanoSeconds(this.endTime) : null,
      status: {
        code: this.status?.statusCode || SpanStatusCode.UNSET,
        message: this.status?.description
      },
      attributes: this.attributes || {},
      events: this.events.map((event) => ({
        name: event.name,
        time_unix_nano: event.timestamp,
        attributes: event.attributes || {}
      }))
    };
  }

  /**
   * Create a Span from JSON data (following Python implementation)
   * Converts the JSON data back into OpenTelemetry-compatible span
   */
  static fromJson(json: SerializedSpan): ISpan {
    // Convert the JSON data back to an OpenTelemetry-like span structure
    // This is simplified compared to Python but follows the same pattern

    const otelSpanData = {
      name: json.name,
      startTime: convertNanoSecondsToHrTime(json.start_time_unix_nano),
      endTime: json.end_time_unix_nano ? convertNanoSecondsToHrTime(json.end_time_unix_nano) : null,
      status: {
        code: convertStatusCodeToOTel(json.status.code),
        message: json.status.message
      },
      // For fromJson, attributes are already in their final form (not JSON serialized)
      // so we store them directly
      attributes: json.attributes || {},
      events: (json.events || []).map((event) => ({
        name: event.name,
        time: convertNanoSecondsToHrTime(event.time_unix_nano),
        attributes: event.attributes || {}
      })),
      ended: true,
      // Add spanContext() method that returns proper SpanContext
      spanContext: () => ({
        traceId: decodeIdFromBase64(json.trace_id),
        spanId: decodeIdFromBase64(json.span_id),
        traceFlags: 1, // Sampled
        isRemote: false
      }),
      // Add parentSpanContext for parent span ID
      parentSpanContext: json.parent_span_id
        ? {
            traceId: decodeIdFromBase64(json.trace_id),
            spanId: decodeIdFromBase64(json.parent_span_id),
            traceFlags: 1,
            isRemote: false
          }
        : undefined
    };

    // Create a span that behaves like our Span class but from downloaded data
    return new Span(otelSpanData as OTelSpan, false); // false = immutable
  }
}

/**
 * Convert MLflow status codes to OpenTelemetry status codes
 * @param statusCode Status code from MLflow JSON format
 * @returns OpenTelemetry compatible status code
 */
function convertStatusCodeToOTel(statusCode?: string): OTelSpanStatusCode {
  if (!statusCode) {
    return OTelSpanStatusCode.UNSET;
  }

  // Handle MLflow format -> OTel format conversion
  switch (statusCode) {
    case 'STATUS_CODE_OK':
      return OTelSpanStatusCode.OK;
    case 'STATUS_CODE_ERROR':
      return OTelSpanStatusCode.ERROR;
    case 'STATUS_CODE_UNSET':
      return OTelSpanStatusCode.UNSET;
    // Also handle OTel format directly
    case 'OK':
      return OTelSpanStatusCode.OK;
    case 'ERROR':
      return OTelSpanStatusCode.ERROR;
    case 'UNSET':
      return OTelSpanStatusCode.UNSET;
    default:
      return OTelSpanStatusCode.UNSET;
  }
}

export class LiveSpan extends Span {
  // Internal only flag to allow mutating the ended span
  allowMutatingEndedSpan: boolean = false;

  constructor(span: OTelSpan, traceId: string, span_type: SpanType) {
    super(span, true);
    this.setAttribute(SpanAttributeKey.TRACE_ID, traceId);
    this.setAttribute(SpanAttributeKey.SPAN_TYPE, span_type);
  }

  /**
   * Set the type of the span
   * @param spanType The type of the span
   */
  setSpanType(spanType: SpanType): void {
    this.setAttribute(SpanAttributeKey.SPAN_TYPE, spanType);
  }

  /**
   * Set inputs for the span
   * @param inputs Input data for the span
   */
  setInputs(inputs: any): void {
    this.setAttribute(SpanAttributeKey.INPUTS, inputs);
  }

  /**
   * Set outputs for the span
   * @param outputs Output data for the span
   */
  setOutputs(outputs: any): void {
    this.setAttribute(SpanAttributeKey.OUTPUTS, outputs);
  }

  /**
   * Set an attribute on the span
   * @param key Attribute key
   * @param value Attribute value
   */
  setAttribute(key: string, value: any): void {
    this._attributesRegistry.set(key, value, this.allowMutatingEndedSpan);
  }

  /**
   * Set multiple attributes on the span
   * @param attributes Object containing key-value pairs for attributes
   */
  setAttributes(attributes: Record<string, any>): void {
    if (!attributes || Object.keys(attributes).length === 0) {
      return;
    }

    Object.entries(attributes).forEach(([key, value]) => {
      this.setAttribute(key, value);
    });
  }

  /**
   * Add an event to the span
   * @param event Event object with name and attributes
   */
  addEvent(event: SpanEvent): void {
    // Convert BigInt timestamp to HrTime for OpenTelemetry
    const timeInput = convertNanoSecondsToHrTime(event.timestamp);
    this._span.addEvent(event.name, event.attributes, timeInput);
  }

  /**
   * Record an exception event to the span
   * @param error Error object
   */
  recordException(error: Error): void {
    this._span.recordException(error);
  }

  /**
   * Set the status of the span
   * @param status Status code or SpanStatus object
   * @param description Optional description for the status
   */
  setStatus(status: SpanStatus | SpanStatusCode | string, description?: string): void {
    if (status instanceof SpanStatus) {
      this._span.setStatus(status.toOtelStatus());
    } else if (typeof status === 'string') {
      const spanStatus = new SpanStatus(status as SpanStatusCode, description);
      this._span.setStatus(spanStatus.toOtelStatus());
    }
  }

  /**
   * End the span
   *
   * @param outputs Optional outputs to set before ending
   * @param attributes Optional attributes to set before ending
   * @param status Optional status code
   * @param endTimeNs Optional end time in nanoseconds
   */
  end(options?: {
    outputs?: any;
    attributes?: Record<string, any>;
    status?: SpanStatus | SpanStatusCode;
    endTimeNs?: number;
  }): void {
    try {
      if (options?.outputs != null) {
        this.setOutputs(options.outputs);
      }

      if (options?.attributes != null) {
        this.setAttributes(options.attributes);
      }

      if (options?.status != null) {
        this.setStatus(options.status);
      }

      // NB: In OpenTelemetry, status code remains UNSET if not explicitly set
      // by the user. However, there is no way to set the status when using
      // `trace` function wrapper. Therefore, we just automatically set the status
      // to OK if it is not ERROR.
      if (this.status.statusCode !== SpanStatusCode.ERROR) {
        this.setStatus(SpanStatusCode.OK);
      }

      // OTel SDK default end time to current time if not provided
      const endTime = options?.endTimeNs
        ? convertNanoSecondsToHrTime(options.endTimeNs)
        : undefined;
      this._span.end(endTime);
    } catch (error) {
      console.error(`Failed to end span ${this.spanId}: ${String(error)}.`);
    }
  }
}

/**
 * A no-operation span implementation that doesn't record anything
 */
export class NoOpSpan implements ISpan {
  readonly _span: any; // Use any for NoOp span to avoid type conflicts
  readonly _attributesRegistry: SpanAttributesRegistry;

  allowMutatingEndedSpan: boolean = false;

  constructor(span?: any) {
    // Create a minimal no-op span object
    this._span = span || {
      spanContext: () => ({
        spanId: INVALID_SPANID,
        traceId: INVALID_TRACEID
      }),
      attributes: {},
      events: []
    };
    this._attributesRegistry = new SpanAttributesRegistry(this._span as OTelSpan);
  }

  get traceId(): string {
    return NO_OP_SPAN_TRACE_ID;
  }
  get spanId(): string {
    return '';
  }
  get parentId(): string | null {
    return null;
  }
  get name(): string {
    return '';
  }
  get spanType(): SpanType {
    return SpanType.UNKNOWN;
  }
  get startTime(): HrTime {
    return [0, 0];
  }
  get endTime(): HrTime | null {
    return null;
  }
  get status(): SpanStatus {
    return new SpanStatus(SpanStatusCode.UNSET);
  }
  get inputs(): any {
    return null;
  }
  get outputs(): any {
    return null;
  }
  get attributes(): Record<string, any> {
    return {};
  }

  getAttribute(_key: string): any {
    return null;
  }

  // Implement all methods to do nothing
  setSpanType(_spanType: SpanType): void {}
  setInputs(_inputs: any): void {}
  setOutputs(_outputs: any): void {}
  setAttribute(_key: string, _value: any): void {}
  setAttributes(_attributes: Record<string, any>): void {}
  setStatus(_status: SpanStatus | SpanStatusCode | string, _description?: string): void {}
  addEvent(_event: SpanEvent): void {}
  recordException(_error: Error): void {}
  end(
    _outputs?: any,
    _attributes?: Record<string, any>,
    _status?: SpanStatus | SpanStatusCode,
    _endTimeNs?: number
  ): void {}

  get events(): SpanEvent[] {
    return [];
  }

  toJson(): SerializedSpan {
    return {
      trace_id: NO_OP_SPAN_TRACE_ID,
      span_id: '',
      parent_span_id: '',
      name: '',
      start_time_unix_nano: 0n,
      end_time_unix_nano: null,
      status: { code: 'UNSET', message: '' },
      attributes: {},
      events: []
    };
  }
}

export interface SerializedSpan {
  trace_id: string;
  span_id: string;
  parent_span_id: string;
  name: string;
  // Use bigint for nanosecond timestamps to maintain precision
  start_time_unix_nano: bigint;
  end_time_unix_nano: bigint | null;
  status: {
    code: string;
    message: string;
  };
  attributes: Record<string, any>;
  events: {
    name: string;
    time_unix_nano: bigint;
    attributes: Record<string, any>;
  }[];
}

/**
 * A utility class to manage the span attributes.
 * In MLflow users can add arbitrary key-value pairs to the span attributes, however,
 * OpenTelemetry only allows a limited set of types to be stored in the attribute values.
 * Therefore, we serialize all values into JSON string before storing them in the span.
 * This class provides simple getter and setter methods to interact with the span attributes
 * without worrying about the serde process.
 */
class SpanAttributesRegistry {
  private readonly _span: OTelSpan;

  constructor(otelSpan: OTelSpan) {
    this._span = otelSpan;
  }

  /**
   * Get all attributes as a dictionary
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    if (this._span.attributes) {
      Object.keys(this._span.attributes).forEach((key) => {
        result[key] = this.get(key);
      });
    }
    return result;
  }

  /**
   * Get a single attribute value
   */
  get(key: string): any {
    const serializedValue = this._span.attributes?.[key];
    if (serializedValue && typeof serializedValue === 'string') {
      try {
        return JSON.parse(serializedValue);
      } catch (e) {
        // If JSON.parse fails, this might be a raw string value or
        // the span was created from JSON (attributes already parsed)
        // In that case, return the value as-is
        return serializedValue;
      }
    }
    return serializedValue;
  }

  /**
   * Set a single attribute value
   */
  set(key: string, value: any, allowMutatingEndedSpan: boolean = false): void {
    if (typeof key !== 'string') {
      console.warn(`Attribute key must be a string, but got ${typeof key}. Skipping.`);
      return;
    }

    if (allowMutatingEndedSpan && this._span.ended) {
      // Directly set the attribute value to bypass the isSpanEnded check.
      this._span.attributes[key] = safeJsonStringify(value);
      return;
    }

    // NB: OpenTelemetry attribute can store not only string but also a few primitives like
    // int, float, bool, and list of them. However, we serialize all into JSON string here
    // for the simplicity in deserialization process.
    this._span.setAttribute(key, safeJsonStringify(value));
  }
}

/**
 * A cache-enabled version of the SpanAttributesRegistry.
 * The caching helps to avoid the redundant deserialization of the attribute, however, it does
 * not handle the value change well. Therefore, this class should only be used for the persisted
 * spans that are immutable, and thus implemented as a subclass of SpanAttributesRegistry.
 */
class CachedSpanAttributesRegistry extends SpanAttributesRegistry {
  private readonly _cache = new Map<string, any>();

  /**
   * Get a single attribute value with LRU caching (maxsize=128)
   */
  get(key: string): any {
    if (this._cache.has(key)) {
      // Move to end (most recently used)
      const value = this._cache.get(key);
      this._cache.delete(key);
      this._cache.set(key, value);
      return value;
    }

    const value = super.get(key);

    // Implement LRU eviction
    if (this._cache.size >= 128) {
      // Remove least recently used (first entry)
      const firstKey = this._cache.keys().next().value;
      if (firstKey != null) {
        this._cache.delete(firstKey);
      }
    }

    this._cache.set(key, value);
    return value;
  }

  /**
   * Set operation is not allowed for cached registry (immutable spans)
   */
  set(_key: string, _value: any, _allowMutatingEndedSpan: boolean = false): void {
    throw new Error('The attributes of the immutable span must not be updated.');
  }
}

/**
 * Factory function to create a span object.
 */
export function createMlflowSpan(
  otelSpan: any,
  traceId: string,
  spanType?: string
): NoOpSpan | Span | LiveSpan {
  // NonRecordingSpan always has a spanId of '0000000000000000'
  // https://github.com/open-telemetry/opentelemetry-js/blob/f2cfd1327a5b131ea795301b10877291aac4e6f5/api/src/trace/invalid-span-constants.ts#L23C32-L23C48
  /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call */
  if (!otelSpan || otelSpan.spanContext().spanId === INVALID_SPANID) {
    return new NoOpSpan(otelSpan);
  }

  // If the span is completed, it should be immutable.
  if (otelSpan.ended) {
    return new Span(otelSpan);
  }

  return new LiveSpan(otelSpan, traceId, (spanType as SpanType) || SpanType.UNKNOWN);
  /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call */
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 213
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 213 of 991)

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

---[FILE: span_event.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/span_event.ts

```typescript
/**
 * MLflow Span Event Entities
 *
 * This module provides TypeScript implementations of MLflow span event entities,
 * compatible with OpenTelemetry for recording specific occurrences during span execution.
 */

/**
 * Type definition for attribute values that can be stored in span events.
 * Compatible with OpenTelemetry attribute value types.
 */
export type AttributeValue = string | number | boolean | string[] | number[] | boolean[];

/**
 * Parameters for creating a SpanEvent instance.
 */
export interface SpanEventParams {
  /** Name of the event */
  name: string;
  /**
   * The exact time the event occurred, measured in nanoseconds since epoch.
   * If not provided, the current time will be used.
   */
  timestamp?: bigint;
  /**
   * A collection of key-value pairs representing detailed attributes of the event,
   * such as exception stack traces or other contextual information.
   */
  attributes?: Record<string, AttributeValue>;
}

/**
 * Represents an event that records specific occurrences or moments in time
 * during a span, such as an exception being thrown. Compatible with OpenTelemetry.
 *
 * SpanEvents are used to capture important moments during span execution,
 * providing detailed context about what happened and when.
 *
 * @example
 * ```typescript
 * // Create a custom event
 * const event = new SpanEvent({
 *   name: 'user_action',
 *   attributes: {
 *     'action.type': 'click',
 *     'element.id': 'submit-button'
 *   }
 * });
 *
 * // Create an event from an exception
 * const errorEvent = SpanEvent.fromException(new Error('Something went wrong'));
 * ```
 */
export class SpanEvent {
  /** Name of the event */
  readonly name: string;

  /**
   * The exact time the event occurred, measured in nanosecond since epoch.
   * Defaults to current time if not provided during construction.
   */
  readonly timestamp: bigint;

  /**
   * A collection of key-value pairs representing detailed attributes of the event.
   * Attributes provide contextual information about the event.
   */
  readonly attributes: Record<string, AttributeValue>;

  /**
   * Creates a new SpanEvent instance.
   *
   * @param params - Event parameters including name, optional timestamp, and attributes
   *
   * @example
   * ```typescript
   * const event = new SpanEvent({
   *   name: 'database_query',
   *   attributes: {
   *     'db.statement': 'SELECT * FROM users',
   *     'db.duration_ms': 150
   *   }
   * });
   * ```
   */
  constructor(params: SpanEventParams) {
    this.name = params.name;
    this.timestamp = params.timestamp ?? this.getCurrentTimeNano();
    this.attributes = params.attributes ?? {};
  }

  /**
   * Creates a span event from an exception.
   *
   * This is a convenience method for creating events that represent exceptions
   * or errors that occurred during span execution. The event will include
   * standard exception attributes like message, type, and stack trace.
   *
   * @param exception - The exception to create an event from
   * @returns New SpanEvent instance representing the exception
   *
   * @example
   * ```typescript
   * try {
   *   // Some operation that might fail
   *   throw new Error('Database connection failed');
   * } catch (error) {
   *   const errorEvent = SpanEvent.fromException(error);
   *   span.addEvent(errorEvent);
   * }
   * ```
   */
  static fromException(exception: Error): SpanEvent {
    const stackTrace = this.getStackTrace(exception);

    return new SpanEvent({
      name: 'exception',
      attributes: {
        'exception.message': exception.message,
        'exception.type': exception.name,
        'exception.stacktrace': stackTrace
      }
    });
  }

  /**
   * Gets the stack trace from an error object.
   *
   * @param error - The error to extract stack trace from
   * @returns Stack trace as a string, or error representation if stack trace unavailable
   */
  private static getStackTrace(error: Error): string {
    try {
      return error.stack ?? String(error);
    } catch {
      // Fallback if stack trace extraction fails
      return String(error);
    }
  }

  /**
   * Convert this SpanEvent to JSON format
   * @returns JSON object representation of the span event
   */
  toJson(): Record<string, string | bigint | Record<string, AttributeValue>> {
    return {
      name: this.name,
      timestamp: this.timestamp,
      attributes: this.attributes
    };
  }

  /**
   * Gets the current time in nanoseconds since epoch.
   *
   * @returns Current timestamp in nanoseconds
   */
  private getCurrentTimeNano(): bigint {
    return BigInt(Date.now()) * BigInt(1e6);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: span_status.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/span_status.ts

```typescript
import { SpanStatus as OTelStatus, SpanStatusCode as OTelSpanStatusCode } from '@opentelemetry/api';

/**
 * MLflow Span Status module
 *
 * This module provides the MLflow SpanStatusCode enum and SpanStatus class,
 * matching the Python MLflow implementation.
 */

/**
 * Enum for status code of a span
 * Uses the same set of status codes as OTLP SpanStatusCode
 * https://github.com/open-telemetry/opentelemetry-proto/blob/189b2648d29aa6039aeb2
lemetry/proto/trace/v1/trace.proto#L314-L322
 */
export enum SpanStatusCode {
  /** Status is unset/unspecified */
  UNSET = 'STATUS_CODE_UNSET',
  /** The operation completed successfully */
  OK = 'STATUS_CODE_OK',
  /** The operation encountered an error */
  ERROR = 'STATUS_CODE_ERROR'
}

/**
 * Status of the span or the trace.
 */
export class SpanStatus {
  /**
   * The status code of the span or the trace.
   */
  readonly statusCode: SpanStatusCode;

  /**
   * Description of the status. This should be only set when the status is ERROR,
   * otherwise it will be ignored.
   */
  readonly description: string;

  /**
   * Create a new SpanStatus instance
   * @param statusCode The status code - must be one of SpanStatusCode enum values
   * @param description Optional description, typically used for ERROR status
   */
  constructor(statusCode: SpanStatusCode, description: string = '') {
    // If user provides a string status code, validate it and convert to enum
    this.statusCode = statusCode;
    this.description = description;
  }

  /**
   * Convert SpanStatus object to OpenTelemetry status object.
   */
  toOtelStatus(): OTelStatus {
    let otelStatusCode: OTelSpanStatusCode;

    switch (this.statusCode) {
      case SpanStatusCode.OK:
        otelStatusCode = OTelSpanStatusCode.OK;
        break;
      case SpanStatusCode.ERROR:
        otelStatusCode = OTelSpanStatusCode.ERROR;
        break;
      case SpanStatusCode.UNSET:
      default:
        otelStatusCode = OTelSpanStatusCode.UNSET;
        break;
    }

    return {
      code: otelStatusCode,
      message: this.description
    };
  }

  /**
   * Convert OpenTelemetry status object to SpanStatus object.
   */
  static fromOtelStatus(otelStatus: OTelStatus): SpanStatus {
    let statusCode: SpanStatusCode;

    switch (otelStatus.code) {
      case OTelSpanStatusCode.OK:
        statusCode = SpanStatusCode.OK;
        break;
      case OTelSpanStatusCode.ERROR:
        statusCode = SpanStatusCode.ERROR;
        break;
      case OTelSpanStatusCode.UNSET:
      default:
        statusCode = SpanStatusCode.UNSET;
        break;
    }

    return new SpanStatus(statusCode, otelStatus.message ?? '');
  }

  /**
   * Convert this SpanStatus to JSON format
   * @returns JSON object representation of the span status
   */
  toJson(): Record<string, string | SpanStatusCode> {
    return {
      status_code: this.statusCode,
      description: this.description
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: trace.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/trace.ts

```typescript
import { SerializedTraceInfo, TraceInfo } from './trace_info';
import { SerializedTraceData, TraceData } from './trace_data';

/**
 * Represents a complete trace with metadata and span data
 */
export class Trace {
  /**
   * Trace metadata
   */
  info: TraceInfo;

  /**
   * Trace data containing spans
   */
  data: TraceData;

  /**
   * Create a new Trace instance
   * @param info Trace metadata
   * @param data Trace data containing spans
   */
  constructor(info: TraceInfo, data: TraceData) {
    this.info = info;
    this.data = data;
  }

  /**
   * Convert this Trace instance to JSON format
   * @returns JSON object representation of the Trace
   */
  toJson(): SerializedTrace {
    return {
      info: this.info.toJson(),
      data: this.data.toJson()
    };
  }

  /**
   * Create a Trace instance from JSON data
   * @param json JSON object containing trace data
   * @returns Trace instance
   */
  static fromJson(json: SerializedTrace): Trace {
    const info = TraceInfo.fromJson(json.info);
    const data = TraceData.fromJson(json.data);
    return new Trace(info, data);
  }
}

interface SerializedTrace {
  info: SerializedTraceInfo;
  data: SerializedTraceData;
}
```

--------------------------------------------------------------------------------

---[FILE: trace_data.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/trace_data.ts

```typescript
import { ISpan, SerializedSpan, Span } from './span';

/**
 * Represents the spans and associated data for a trace
 */
export class TraceData {
  /**
   * The spans that make up this trace
   */
  spans: ISpan[];

  /**
   * Create a new TraceData instance
   * @param spans List of spans
   */
  constructor(spans: ISpan[] = []) {
    this.spans = spans;
  }

  /**
   * Convert this TraceData instance to JSON format
   * @returns JSON object representation of the TraceData
   */
  toJson(): SerializedTraceData {
    return {
      spans: this.spans.map((span) => span.toJson())
    };
  }

  /**
   * Create a TraceData instance from JSON data (following Python implementation)
   * @param json JSON object containing trace data
   * @returns TraceData instance
   */
  static fromJson(json: SerializedTraceData): TraceData {
    const spans: ISpan[] = json.spans.map((spanData) => Span.fromJson(spanData));
    return new TraceData(spans);
  }
}

export interface SerializedTraceData {
  spans: SerializedSpan[];
}
```

--------------------------------------------------------------------------------

---[FILE: trace_info.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/trace_info.ts

```typescript
import type { TraceLocation, TraceLocationType } from './trace_location';
import type { TraceState } from './trace_state';
import { TraceMetadataKey } from '../constants';

/**
 * Interface for token usage information
 */
export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

/**
 * Metadata about a trace, such as its ID, location, timestamp, etc.
 */
export class TraceInfo {
  /**
   * The primary identifier for the trace
   */
  traceId: string;

  /**
   * The location where the trace is stored
   */
  traceLocation: TraceLocation;

  /**
   * Start time of the trace, in milliseconds
   */
  requestTime: number;

  /**
   * State of the trace
   */
  state: TraceState;

  /**
   * Request to the model/agent (JSON-encoded, may be truncated)
   */
  requestPreview?: string;

  /**
   * Response from the model/agent (JSON-encoded, may be truncated)
   */
  responsePreview?: string;

  /**
   * Client supplied request ID associated with the trace
   */
  clientRequestId?: string;

  /**
   * Duration of the trace, in milliseconds
   */
  executionDuration?: number;

  /**
   * Key-value pairs associated with the trace (immutable)
   */
  traceMetadata: Record<string, string>;

  /**
   * Tags associated with the trace (mutable)
   */
  tags: Record<string, string>;

  /**
   * List of assessments associated with the trace.
   * TODO: Assessments are not yet supported in the TypeScript SDK.
   */
  assessments: any[];

  /**
   * Create a new TraceInfo instance
   * @param params TraceInfo parameters
   */
  constructor(params: {
    traceId: string;
    traceLocation: TraceLocation;
    requestTime: number;
    state: TraceState;
    requestPreview?: string;
    responsePreview?: string;
    clientRequestId?: string;
    executionDuration?: number;
    traceMetadata?: Record<string, string>;
    tags?: Record<string, string>;
    assessments?: any[];
  }) {
    this.traceId = params.traceId;
    this.traceLocation = params.traceLocation;
    this.requestTime = params.requestTime;
    this.state = params.state;
    this.requestPreview = params.requestPreview;
    this.responsePreview = params.responsePreview;
    this.clientRequestId = params.clientRequestId;
    this.executionDuration = params.executionDuration;
    this.traceMetadata = params.traceMetadata || {};
    this.tags = params.tags || {};
    // TODO: Assessments are not yet supported in the TypeScript SDK.
    this.assessments = [];
  }

  /**
   * Convert this TraceInfo instance to JSON format
   * @returns JSON object representation of the TraceInfo
   */
  toJson(): SerializedTraceInfo {
    return {
      trace_id: this.traceId,
      client_request_id: this.clientRequestId,
      trace_location: {
        type: this.traceLocation.type,
        mlflow_experiment: this.traceLocation.mlflowExperiment
          ? {
              experiment_id: this.traceLocation.mlflowExperiment.experimentId
            }
          : undefined,
        inference_table: this.traceLocation.inferenceTable
          ? {
              full_table_name: this.traceLocation.inferenceTable.fullTableName
            }
          : undefined
      },
      request_preview: this.requestPreview,
      response_preview: this.responsePreview,
      request_time: new Date(this.requestTime).toISOString(),
      execution_duration:
        this.executionDuration != null ? `${this.executionDuration / 1000}s` : undefined,
      state: this.state,
      trace_metadata: this.traceMetadata,
      tags: this.tags,
      assessments: this.assessments
    };
  }

  /**
   * Get aggregated token usage information for this trace.
   * Returns null if no token usage data is available.
   * @returns Token usage object or null
   */
  get tokenUsage(): TokenUsage | null {
    const tokenUsageJson = this.traceMetadata[TraceMetadataKey.TOKEN_USAGE];

    if (!tokenUsageJson) {
      return null;
    }

    const usage = JSON.parse(tokenUsageJson) as TokenUsage;
    return {
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      total_tokens: usage.total_tokens
    };
  }

  /**
   * Create a TraceInfo instance from JSON data
   * @param json JSON object containing trace info data
   * @returns TraceInfo instance
   */
  static fromJson(json: SerializedTraceInfo): TraceInfo {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    return new TraceInfo({
      traceId: json.trace_id,
      clientRequestId: json.client_request_id,
      traceLocation: {
        type: json.trace_location?.type as TraceLocationType,
        mlflowExperiment: json.trace_location?.mlflow_experiment
          ? { experimentId: json.trace_location.mlflow_experiment.experiment_id }
          : undefined,
        inferenceTable: json.trace_location?.inference_table
          ? { fullTableName: json.trace_location.inference_table.full_table_name }
          : undefined
      },
      requestPreview: json.request_preview,
      responsePreview: json.response_preview,
      requestTime: json.request_time != null ? new Date(json.request_time).getTime() : Date.now(),
      executionDuration:
        json.execution_duration != null
          ? parseFloat(json.execution_duration.replace('s', '')) * 1000
          : undefined,
      state: json.state,
      traceMetadata: json.trace_metadata || {},
      tags: json.tags || {},
      assessments: json.assessments || []
    });
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }
}

export interface SerializedTraceInfo {
  trace_id: string;
  client_request_id?: string;
  trace_location: {
    type: TraceLocationType;
    mlflow_experiment?: {
      experiment_id: string;
    };
    inference_table?: {
      full_table_name: string;
    };
  };
  request_preview?: string;
  response_preview?: string;
  // "request_time": "2025-06-15T14:07:41.282Z"
  request_time: string;
  execution_duration?: string;
  state: TraceState;
  trace_metadata: Record<string, string>;
  tags: Record<string, string>;
  // TODO: Define proper type for assessments once supported
  assessments: any[];
}
```

--------------------------------------------------------------------------------

---[FILE: trace_location.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/trace_location.ts

```typescript
/**
 * Types of trace locations
 */
export enum TraceLocationType {
  /**
   * Unspecified trace location type
   */
  TRACE_LOCATION_TYPE_UNSPECIFIED = 'TRACE_LOCATION_TYPE_UNSPECIFIED',

  /**
   * Trace is stored in an MLflow experiment
   */
  MLFLOW_EXPERIMENT = 'MLFLOW_EXPERIMENT',

  /**
   * Trace is stored in a Databricks inference table
   */
  INFERENCE_TABLE = 'INFERENCE_TABLE'
}

/**
 * Interface representing an MLflow experiment location
 */
export interface MlflowExperimentLocation {
  /**
   * The ID of the MLflow experiment where the trace is stored
   */
  experimentId: string;
}

/**
 * Interface representing a Databricks inference table location
 */
export interface InferenceTableLocation {
  /**
   * The fully qualified name of the inference table where the trace is stored
   */
  fullTableName: string;
}

/**
 * Interface representing the location where the trace is stored
 */
export interface TraceLocation {
  /**
   * The type of the trace location
   */
  type: TraceLocationType;

  /**
   * The MLflow experiment location
   * Set this when the location type is MLflow experiment
   */
  mlflowExperiment?: MlflowExperimentLocation;

  /**
   * The inference table location
   * Set this when the location type is Databricks Inference table
   */
  inferenceTable?: InferenceTableLocation;
}

/**
 * Create a TraceLocation from an experiment ID
 * @param experimentId The ID of the MLflow experiment
 */
export function createTraceLocationFromExperimentId(experimentId: string): TraceLocation {
  return {
    type: TraceLocationType.MLFLOW_EXPERIMENT,
    mlflowExperiment: {
      experimentId: experimentId
    }
  };
}
```

--------------------------------------------------------------------------------

---[FILE: trace_state.ts]---
Location: mlflow-master/libs/typescript/core/src/core/entities/trace_state.ts

```typescript
import { SpanStatusCode } from '@opentelemetry/api';

/**
 * Enum representing the state of a trace
 */
export enum TraceState {
  /**
   * Unspecified trace state
   */
  STATE_UNSPECIFIED = 'STATE_UNSPECIFIED',

  /**
   * Trace successfully completed
   */
  OK = 'OK',

  /**
   * Trace encountered an error
   */
  ERROR = 'ERROR',

  /**
   * Trace is currently in progress
   */
  IN_PROGRESS = 'IN_PROGRESS'
}

/**
 * Convert OpenTelemetry status code to MLflow TraceState
 * @param statusCode OpenTelemetry status code
 */
export function fromOtelStatus(statusCode: SpanStatusCode): TraceState {
  switch (statusCode) {
    case SpanStatusCode.OK:
      return TraceState.OK;
    case SpanStatusCode.ERROR:
      return TraceState.ERROR;
    default:
      return TraceState.STATE_UNSPECIFIED;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/libs/typescript/core/src/core/utils/index.ts

```typescript
import type { HrTime } from '@opentelemetry/api';
import { LiveSpan, Span } from '../entities/span';
import { SpanAttributeKey } from '../constants';
import { TokenUsage } from '../entities/trace_info';

/**
 * OpenTelemetry Typescript SDK uses a unique timestamp format `HrTime` to represent
 * timestamps. This function converts a timestamp in nanoseconds to an `HrTime`
 * Supports both number and BigInt for large timestamps
 * Ref: https://github.com/open-telemetry/opentelemetry-js/blob/a9fc600f2bd7dbf9345ec14e4421f1cc034f1f9c/api/src/common/Time.ts#L17-L30C13
 * @param nanoseconds The timestamp in nanoseconds (number or BigInt)
 * @returns The timestamp in `HrTime` format
 */
export function convertNanoSecondsToHrTime(nanoseconds: number | bigint): HrTime {
  // Handle both number and BigInt inputs
  if (typeof nanoseconds === 'bigint') {
    // Use BigInt arithmetic to maintain precision
    const seconds = Number(nanoseconds / 1_000_000_000n);
    const nanos = Number(nanoseconds % 1_000_000_000n);
    return [seconds, nanos] as HrTime;
  }
  // For regular numbers, use standard arithmetic
  return [Math.floor(nanoseconds / 1e9), nanoseconds % 1e9] as HrTime;
}

/**
 * Convert HrTime to nanoseconds as BigInt
 * @param hrTime HrTime tuple [seconds, nanoseconds]
 * @returns BigInt nanoseconds
 */
export function convertHrTimeToNanoSeconds(hrTime: HrTime): bigint {
  return BigInt(hrTime[0]) * 1_000_000_000n + BigInt(hrTime[1]);
}

/**
 * Convert HrTime to milliseconds
 * @param hrTime HrTime tuple [seconds, nanoseconds]
 * @returns Milliseconds
 */
export function convertHrTimeToMs(hrTime: HrTime): number {
  return Math.floor(hrTime[0] * 1e3 + hrTime[1] / 1e6);
}

/**
 * Convert a hex span ID to base64 format for JSON serialization
 * Following Python implementation: _encode_span_id_to_byte
 * @param spanId Hex string span ID (16 chars)
 * @returns Base64 encoded span ID
 */
export function encodeSpanIdToBase64(spanId: string): string {
  // Convert hex string to bytes (8 bytes for span ID)
  const bytes = new Uint8Array(8);

  // Parse hex string (add padding to 16 chars)
  const hexStr = spanId.padStart(16, '0');
  for (let i = 0; i < 8; i++) {
    bytes[i] = parseInt(hexStr.substring(i * 2, i * 2 + 2), 16);
  }

  // Convert to base64
  return Buffer.from(bytes).toString('base64');
}

/**
 * Convert a hex span ID to base64 format for JSON serialization
 * Following Python implementation: _encode_trace_id_to_byte
 * @param spanId Hex string span ID (32 chars)
 * @returns Base64 encoded span ID
 */
export function encodeTraceIdToBase64(traceId: string): string {
  // Convert hex string to bytes (16 bytes for trace ID)
  const bytes = new Uint8Array(16);

  // Parse hex string (add padding to 32 chars)
  const hexStr = traceId.padStart(32, '0');
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hexStr.substring(i * 2, i * 2 + 2), 16);
  }

  // Convert to base64
  return Buffer.from(bytes).toString('base64');
}

/**
 * Convert a base64 span ID back to hex format
 * Following Python implementation: _decode_id_from_byte
 * @param base64SpanId Base64 encoded span ID
 * @returns Hex string span ID
 */
export function decodeIdFromBase64(base64SpanId: string): string {
  // Decode from base64
  const bytes = Buffer.from(base64SpanId, 'base64');

  // Convert to hex string
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Deduplicate span names in the trace data by appending an index number to the span name.
 *
 * This is only applied when there are multiple spans with the same name. The span names
 * are modified in place to avoid unnecessary copying.
 *
 * Examples:
 *   ["red", "red"] -> ["red_1", "red_2"]
 *   ["red", "red", "blue"] -> ["red_1", "red_2", "blue"]
 *
 * @param spans A list of spans to deduplicate
 */
export function deduplicateSpanNamesInPlace(spans: LiveSpan[]): void {
  // Count occurrences of each span name
  const spanNameCounter = new Map<string, number>();

  for (const span of spans) {
    const name = span.name;
    spanNameCounter.set(name, (spanNameCounter.get(name) || 0) + 1);
  }

  // Apply renaming only for duplicated spans
  const spanNameIndexes = new Map<string, number>();
  for (const [name, count] of spanNameCounter.entries()) {
    if (count > 1) {
      spanNameIndexes.set(name, 1);
    }
  }

  // Add index to the duplicated span names
  for (const span of spans) {
    const name = span.name;
    const currentIndex = spanNameIndexes.get(name);

    if (currentIndex !== undefined) {
      // Modify the span name in place by accessing the internal OpenTelemetry span
      // The 'name' field is readonly in OTel but we need to jail-break it here
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (span._span as any).name = `${name}_${currentIndex}`;
      spanNameIndexes.set(name, currentIndex + 1);
    }
  }
}

/**
 * Map function arguments to an object with parameter names as keys
 * @param func The function to extract parameter names from
 * @param args The arguments passed to the function
 * @returns Object mapping parameter names to argument values
 */
export function mapArgsToObject(func: Function, args: any[]): Record<string, any> {
  const paramNames = getParameterNames(func);

  // If we can't extract parameter names, return the args as an array
  if (paramNames.length === 0) {
    return args.length === 0 ? {} : { args };
  }

  const result: Record<string, any> = {};

  paramNames.forEach((name, index) => {
    if (index < args.length) {
      result[name] = args[index];
    }
  });

  return result;
}

/**
 * Extract parameter names from a function using string parsing
 * @param func The function to extract parameter names from
 * @returns Array of parameter names
 */
function getParameterNames(func: Function): string[] {
  const funcStr = func.toString();

  // Handle arrow functions and regular functions
  let paramMatch: RegExpMatchArray | null;

  // Try arrow function pattern: (a, b) => or a =>
  const arrowMatch = funcStr.match(/^[^(]*\(?([^)=]*)\)?\s*=>/);
  if (arrowMatch) {
    const params = arrowMatch[1].trim();
    if (!params) {
      return [];
    }

    // Handle single parameter without parentheses
    if (!params.includes(',') && !funcStr.includes('(')) {
      return [params.trim()];
    }

    paramMatch = ['', params];
  } else {
    // Try regular function pattern: function name(a, b) or (a, b)
    paramMatch = funcStr.match(/(?:function\s*[^(]*)??\(([^)]*)\)/);
  }

  if (!paramMatch?.[1]) {
    return [];
  }

  // Split parameters while handling nested brackets/braces
  const params = [];
  let current = '';
  let depth = 0;

  const paramStr = paramMatch[1];
  for (let i = 0; i < paramStr.length; i++) {
    const char = paramStr[i];

    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
    } else if (char === ',' && depth === 0) {
      params.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    params.push(current.trim());
  }

  return params
    .map((param) => {
      let name = param.trim();

      // Skip destructured parameters
      if (name.includes('{') || name.includes('[')) {
        return null;
      }

      name = name.split('=')[0].trim(); // Remove default values: a = 5
      name = name.split(':')[0].trim(); // Remove type annotations: a: number
      if (name.startsWith('...')) {
        return null; // Ignore rest operator: ...args
      }
      return name;
    })
    .filter((name): name is string => name != null && name !== '');
}

/**
 * Aggregate token usage information from all spans in a trace.
 *
 * This function iterates through all spans and extracts token usage from the
 * SpanAttributeKey.TOKEN_USAGE attribute. It avoids double-counting token usage
 * when both parent and child spans have usage data (e.g., LangChain ChatOpenAI + OpenAI tracing).
 *
 * @param spans - Array of spans to aggregate usage from
 * @returns Aggregated token usage or null if no usage data exists
 */
export function aggregateUsageFromSpans(spans: Span[]): TokenUsage | null {
  const totalUsage: TokenUsage = {
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0
  };
  let hasUsageData = false;

  // Track spans that have usage data to avoid double counting
  const spansWithUsage = new Set<string>();

  for (const span of spans) {
    const tokenUsageAttr = span.attributes[SpanAttributeKey.TOKEN_USAGE];
    if (!tokenUsageAttr) {
      continue;
    }
    const tokenUsage = tokenUsageAttr as TokenUsage;

    // Skip if this span's parent also has usage data (avoid double counting)
    let shouldSkip = false;
    if (span.parentId) {
      const parentSpan = spans.find((s) => s.spanId === span.parentId);
      const parentUsageAttr = parentSpan?.attributes[SpanAttributeKey.TOKEN_USAGE];
      if (parentUsageAttr) {
        shouldSkip = true;
      }
    }

    if (!shouldSkip) {
      totalUsage.input_tokens += tokenUsage.input_tokens;
      totalUsage.output_tokens += tokenUsage.output_tokens;
      totalUsage.total_tokens += tokenUsage.total_tokens;
      hasUsageData = true;

      spansWithUsage.add(span.spanId);
    }
  }
  return hasUsageData ? totalUsage : null;
}
```

--------------------------------------------------------------------------------

---[FILE: json.ts]---
Location: mlflow-master/libs/typescript/core/src/core/utils/json.ts

```typescript
import fastStringify from 'fast-safe-stringify';

// Configure json-bigint to handle large integers

type JSON = {
  parse: (text: string) => any;
  stringify: (value: any) => string;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONBigInt = require('./json-bigint/index.js');
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const JSONBig: JSON = JSONBigInt({
  useNativeBigInt: true,
  alwaysParseAsBig: false,
  storeAsString: false
});

/**
 * Safely stringify a value to JSON, handling circular references and non-serializable objects.
 * Uses fast-safe-stringify for optimal performance and reliability.
 *
 * @param value The value to stringify
 * @returns JSON string representation of the value
 */
export function safeJsonStringify(value: any): string {
  // MLflow-specific replacer that handles functions, undefined, and errors
  const mlflowReplacer = (_key: string, val: any): any => {
    if (typeof val === 'function') {
      return '[Function]';
    }
    if (val === undefined) {
      return '[Undefined]';
    }

    if (val instanceof Error) {
      return {
        name: val.name,
        message: val.message,
        stack: val.stack
      };
    }

    return val;
  };

  // Use fast-safe-stringify with our MLflow replacer
  // The circular reference detection is handled by fast-safe-stringify itself
  return fastStringify(value, mlflowReplacer);
}

export { JSONBig };
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: mlflow-master/libs/typescript/core/src/core/utils/json-bigint/index.js

```javascript
/**
 * NOTE: The contents of this file have been inlined from the json-bigint package's source code
 * https://github.com/sidorares/json-bigint/blob/master/json-bigint.js
 *
 * The repository contains a critical bug fix for decimal handling, however, it has not been
 * released to npm yet. This file is a copy of the source code with the bug fix applied.
 * https://github.com/sidorares/json-bigint/commit/3530541b016d9041db6c1e7019e6999790bfd857
 *
 * :copyright: Copyright (c) 2013 Andrey Sidorov
 * :license: The MIT License (MIT)
 */

// @ts-nocheck
var json_stringify = require('./stringify.js').stringify;
var json_parse = require('./parse.js');

module.exports = function (options) {
  return {
    parse: json_parse(options),
    stringify: json_stringify
  };
};
//create the default method members with no options applied for backwards compatibility
module.exports.parse = json_parse();
module.exports.stringify = json_stringify;
```

--------------------------------------------------------------------------------

````

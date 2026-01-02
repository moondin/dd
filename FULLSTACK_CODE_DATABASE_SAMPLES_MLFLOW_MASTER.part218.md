---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 218
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 218 of 991)

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

---[FILE: span_status.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/span_status.test.ts

```typescript
import { SpanStatusCode as OTelSpanStatusCode } from '@opentelemetry/api';
import { SpanStatus, SpanStatusCode } from '../../../src/core/entities/span_status';

describe('SpanStatus', () => {
  describe('initialization', () => {
    // Test both enum and string initialization (parameterized test equivalent)
    const testCases = [
      { input: 'STATUS_CODE_OK', expected: SpanStatusCode.OK },
      { input: 'STATUS_CODE_ERROR', expected: SpanStatusCode.ERROR },
      { input: 'STATUS_CODE_UNSET', expected: SpanStatusCode.UNSET }
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should initialize with status code ${input}`, () => {
        const spanStatus = new SpanStatus(input as SpanStatusCode, 'test');
        expect(spanStatus.statusCode).toBe(expected);
        expect(spanStatus.description).toBe('test');
      });
    });
  });

  describe('OpenTelemetry status conversion', () => {
    const conversionTestCases = [
      {
        mlflowStatus: SpanStatusCode.OK,
        otelStatus: OTelSpanStatusCode.OK
      },
      {
        mlflowStatus: SpanStatusCode.ERROR,
        otelStatus: OTelSpanStatusCode.ERROR
      },
      {
        mlflowStatus: SpanStatusCode.UNSET,
        otelStatus: OTelSpanStatusCode.UNSET
      }
    ];

    conversionTestCases.forEach(({ mlflowStatus, otelStatus }) => {
      it(`should convert ${mlflowStatus} to OpenTelemetry status correctly`, () => {
        const spanStatus = new SpanStatus(mlflowStatus);
        const otelStatusResult = spanStatus.toOtelStatus();

        expect(otelStatusResult.code).toBe(otelStatus);
      });
    });
  });

  describe('toJson round-trip serialization', () => {
    it('should serialize and recreate status with all properties', () => {
      const originalStatus = new SpanStatus(SpanStatusCode.ERROR, 'Something went wrong');

      const json = originalStatus.toJson();

      // Verify JSON structure
      expect(json).toEqual({
        status_code: SpanStatusCode.ERROR,
        description: 'Something went wrong'
      });

      // Create new status from JSON data
      const recreatedStatus = new SpanStatus(json.status_code as SpanStatusCode, json.description);

      // Verify round-trip preservation
      expect(recreatedStatus.statusCode).toBe(originalStatus.statusCode);
      expect(recreatedStatus.description).toBe(originalStatus.description);
      expect(recreatedStatus.toJson()).toEqual(originalStatus.toJson());
    });

    it('should handle status with different status codes', () => {
      const testCases = [
        { code: SpanStatusCode.OK, description: 'All good' },
        { code: SpanStatusCode.ERROR, description: 'Failed operation' },
        { code: SpanStatusCode.UNSET, description: '' }
      ];

      testCases.forEach(({ code, description }) => {
        const originalStatus = new SpanStatus(code, description);
        const json = originalStatus.toJson();
        const recreatedStatus = new SpanStatus(
          json.status_code as SpanStatusCode,
          json.description
        );

        expect(recreatedStatus.statusCode).toBe(originalStatus.statusCode);
        expect(recreatedStatus.description).toBe(originalStatus.description);
        expect(recreatedStatus.toJson()).toEqual(originalStatus.toJson());
      });
    });

    it('should handle status with minimal properties', () => {
      const originalStatus = new SpanStatus(SpanStatusCode.OK);

      const json = originalStatus.toJson();

      expect(json).toEqual({
        status_code: SpanStatusCode.OK,
        description: ''
      });

      const recreatedStatus = new SpanStatus(json.status_code as SpanStatusCode, json.description);

      expect(recreatedStatus.statusCode).toBe(originalStatus.statusCode);
      expect(recreatedStatus.description).toBe(originalStatus.description);
      expect(recreatedStatus.toJson()).toEqual(originalStatus.toJson());
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: trace.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/trace.test.ts

```typescript
import { trace } from '@opentelemetry/api';
import { BasicTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Trace } from '../../../src/core/entities/trace';
import { TraceInfo } from '../../../src/core/entities/trace_info';
import { TraceData } from '../../../src/core/entities/trace_data';
import { TraceState } from '../../../src/core/entities/trace_state';
import { createTraceLocationFromExperimentId } from '../../../src/core/entities/trace_location';
import { createMlflowSpan } from '../../../src/core/entities/span';

// Set up a proper tracer provider
const provider = new BasicTracerProvider();
trace.setGlobalTracerProvider(provider);

const tracer = trace.getTracer('mlflow-test-tracer', '1.0.0');

describe('Trace', () => {
  function createMockTraceInfo(): TraceInfo {
    return new TraceInfo({
      traceId: 'tr-12345',
      clientRequestId: 'client-request-id',
      traceLocation: createTraceLocationFromExperimentId('exp-123'),
      requestTime: Date.now(),
      state: TraceState.OK,
      executionDuration: 1000,
      requestPreview: '{"prompt": "Hello"}',
      responsePreview: '{"response": "Hi there"}',
      traceMetadata: { key: 'value' },
      tags: { env: 'test' },
      assessments: []
    });
  }

  function createMockTraceData(): TraceData {
    const span = tracer.startSpan('parent');
    const mlflowSpan = createMlflowSpan(span, 'tr-12345');
    span.end();
    return new TraceData([mlflowSpan]);
  }

  describe('constructor', () => {
    it('should create a Trace with info and data', () => {
      const traceInfo = createMockTraceInfo();
      const traceData = createMockTraceData();

      const trace = new Trace(traceInfo, traceData);

      expect(trace.info).toBe(traceInfo);
      expect(trace.data).toBe(traceData);
    });
  });

  describe('toJson/fromJson round-trip serialization', () => {
    it('should serialize and deserialize a complete trace correctly', () => {
      const originalTraceInfo = createMockTraceInfo();
      const originalTraceData = createMockTraceData();
      const originalTrace = new Trace(originalTraceInfo, originalTraceData);

      const json = originalTrace.toJson();

      // Verify JSON structure
      expect(json).toHaveProperty('info');
      expect(json).toHaveProperty('data');
      expect(json.info).toMatchObject({
        trace_id: 'tr-12345',
        request_time: expect.any(String),
        state: TraceState.OK
      });
      expect(json.data).toMatchObject({
        spans: [
          {
            name: 'parent',
            trace_id: expect.any(String),
            span_id: expect.any(String),
            parent_span_id: '',
            start_time_unix_nano: expect.any(BigInt),
            end_time_unix_nano: expect.any(BigInt),
            attributes: {
              'mlflow.spanType': 'UNKNOWN'
            },
            status: { code: 'STATUS_CODE_UNSET' },
            events: []
          }
        ]
      });

      // Round-trip test
      const recreatedTrace = Trace.fromJson(json);

      expect(recreatedTrace).toBeInstanceOf(Trace);
      expect(recreatedTrace.info).toBeInstanceOf(TraceInfo);
      expect(recreatedTrace.data).toBeInstanceOf(TraceData);

      // Verify that key properties are preserved
      expect(recreatedTrace.info.traceId).toBe(originalTrace.info.traceId);
      expect(recreatedTrace.info.state).toBe(originalTrace.info.state);
      expect(recreatedTrace.data.spans.length).toEqual(originalTrace.data.spans.length);

      // Verify round-trip JSON serialization matches
      expect(recreatedTrace.toJson()).toEqual(originalTrace.toJson());
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: trace_info.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/trace_info.test.ts

```typescript
import { TraceInfo } from '../../../src/core/entities/trace_info';
import { TraceLocationType } from '../../../src/core/entities/trace_location';
import { TraceState } from '../../../src/core/entities/trace_state';

describe('TraceInfo', () => {
  const createTestTraceInfo = () => {
    return new TraceInfo({
      traceId: 'test-trace-id',
      traceLocation: {
        type: TraceLocationType.MLFLOW_EXPERIMENT,
        mlflowExperiment: {
          experimentId: 'test-experiment-id'
        }
      },
      requestTime: 1000,
      state: TraceState.OK,
      requestPreview: '{"input":"test"}',
      responsePreview: '{"output":"result"}',
      clientRequestId: 'client-request-id',
      executionDuration: 500,
      traceMetadata: { 'meta-key': 'meta-value' },
      tags: { 'tag-key': 'tag-value' },
      assessments: []
    });
  };

  describe('constructor', () => {
    it('should create a TraceInfo instance with all properties', () => {
      const traceInfo = createTestTraceInfo();

      expect(traceInfo.traceId).toBe('test-trace-id');
      expect(traceInfo.traceLocation.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(traceInfo.traceLocation.mlflowExperiment?.experimentId).toBe('test-experiment-id');
      expect(traceInfo.requestTime).toBe(1000);
      expect(traceInfo.state).toBe(TraceState.OK);
      expect(traceInfo.requestPreview).toBe('{"input":"test"}');
      expect(traceInfo.responsePreview).toBe('{"output":"result"}');
      expect(traceInfo.clientRequestId).toBe('client-request-id');
      expect(traceInfo.executionDuration).toBe(500);
      expect(traceInfo.traceMetadata['meta-key']).toBe('meta-value');
      expect(traceInfo.tags['tag-key']).toBe('tag-value');
      expect(traceInfo.assessments).toEqual([]);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: trace_location.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/trace_location.test.ts

```typescript
import {
  TraceLocation,
  TraceLocationType,
  createTraceLocationFromExperimentId
} from '../../../src/core/entities/trace_location';

describe('TraceLocation', () => {
  describe('constructor and basic functionality', () => {
    it('should create a TraceLocation with MLflow experiment', () => {
      const traceLocation: TraceLocation = {
        type: TraceLocationType.MLFLOW_EXPERIMENT,
        mlflowExperiment: { experimentId: '123' }
      };

      expect(traceLocation.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(traceLocation.mlflowExperiment?.experimentId).toBe('123');
      expect(traceLocation.inferenceTable).toBeUndefined();
    });

    it('should create a TraceLocation with inference table', () => {
      const traceLocation: TraceLocation = {
        type: TraceLocationType.INFERENCE_TABLE,
        inferenceTable: { fullTableName: 'a.b.c' }
      };

      expect(traceLocation.type).toBe(TraceLocationType.INFERENCE_TABLE);
      expect(traceLocation.inferenceTable?.fullTableName).toBe('a.b.c');
      expect(traceLocation.mlflowExperiment).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate that only one location type can be provided', () => {
      // This test validates the conceptual constraint that only one location should be provided
      // In TypeScript, this is more of a usage pattern validation
      const invalidLocation: TraceLocation = {
        type: TraceLocationType.TRACE_LOCATION_TYPE_UNSPECIFIED,
        mlflowExperiment: { experimentId: '123' },
        inferenceTable: { fullTableName: 'a.b.c' }
      };

      // Both are defined, which violates the constraint
      expect(invalidLocation.mlflowExperiment).toBeDefined();
      expect(invalidLocation.inferenceTable).toBeDefined();
      // In a real implementation, this would throw an error during validation
    });

    it('should validate type matches MLflow experiment location', () => {
      // This represents a mismatch: INFERENCE_TABLE type with mlflowExperiment data
      const mismatchedLocation: TraceLocation = {
        type: TraceLocationType.INFERENCE_TABLE,
        mlflowExperiment: { experimentId: '123' }
      };

      expect(mismatchedLocation.type).toBe(TraceLocationType.INFERENCE_TABLE);
      expect(mismatchedLocation.mlflowExperiment).toBeDefined();
      expect(mismatchedLocation.inferenceTable).toBeUndefined();
      // In a real implementation, this would be caught by validation
    });

    it('should validate type matches inference table location', () => {
      // This represents a mismatch: MLFLOW_EXPERIMENT type with inferenceTable data
      const mismatchedLocation: TraceLocation = {
        type: TraceLocationType.MLFLOW_EXPERIMENT,
        inferenceTable: { fullTableName: 'a.b.c' }
      };

      expect(mismatchedLocation.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(mismatchedLocation.inferenceTable).toBeDefined();
      expect(mismatchedLocation.mlflowExperiment).toBeUndefined();
      // In a real implementation, this would be caught by validation
    });
  });

  describe('createTraceLocationFromExperimentId', () => {
    it('should create a TraceLocation with MLflow experiment', () => {
      const experimentId = 'experiment123';
      const location = createTraceLocationFromExperimentId(experimentId);

      expect(location.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(location.mlflowExperiment).toBeDefined();
      expect(location.mlflowExperiment?.experimentId).toBe(experimentId);
      expect(location.inferenceTable).toBeUndefined();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: trace_state.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/trace_state.test.ts

```typescript
import { TraceState, fromOtelStatus } from '../../../src/core/entities/trace_state';
import { SpanStatusCode } from '@opentelemetry/api';

describe('TraceState', () => {
  describe('enum values', () => {
    it('should have the correct enum values', () => {
      expect(TraceState.STATE_UNSPECIFIED).toBe('STATE_UNSPECIFIED');
      expect(TraceState.OK).toBe('OK');
      expect(TraceState.ERROR).toBe('ERROR');
      expect(TraceState.IN_PROGRESS).toBe('IN_PROGRESS');
    });
  });

  describe('fromOtelStatus', () => {
    it('should convert OpenTelemetry OK status to TraceState.OK', () => {
      const result = fromOtelStatus(SpanStatusCode.OK);
      expect(result).toBe(TraceState.OK);
    });

    it('should convert OpenTelemetry ERROR status to TraceState.ERROR', () => {
      const result = fromOtelStatus(SpanStatusCode.ERROR);
      expect(result).toBe(TraceState.ERROR);
    });

    it('should convert OpenTelemetry UNSET status to TraceState.STATE_UNSPECIFIED', () => {
      const result = fromOtelStatus(SpanStatusCode.UNSET);
      expect(result).toBe(TraceState.STATE_UNSPECIFIED);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/utils/index.test.ts

```typescript
import type { HrTime } from '@opentelemetry/api';
import {
  convertNanoSecondsToHrTime,
  convertHrTimeToNanoSeconds,
  encodeSpanIdToBase64,
  encodeTraceIdToBase64,
  decodeIdFromBase64,
  deduplicateSpanNamesInPlace,
  mapArgsToObject
} from '../../../src/core/utils';
import { createTestSpan } from '../../helper';
import { LiveSpan } from '../../../src/core/entities/span';

describe('utils', () => {
  describe('convertNanoSecondsToHrTime', () => {
    // Using table-driven tests with test.each for time conversion
    test.each([
      {
        description: 'small nanosecond values',
        input: 123456789,
        expected: [0, 123456789]
      },
      {
        description: 'values exactly at 1 second',
        input: 1_000_000_000,
        expected: [1, 0]
      },
      {
        description: 'zero',
        input: 0,
        expected: [0, 0]
      }
    ])('should convert $description correctly', ({ input, expected }) => {
      const result = convertNanoSecondsToHrTime(input);
      expect(result).toEqual(expected);
    });

    it('should convert large nanosecond values correctly', () => {
      // Note: JavaScript loses precision with very large numbers
      // The computation seconds * 1e9 + nanosInSecond loses precision
      const seconds = 1234567890;
      const nanosInSecond = 123456789;
      const nanos = seconds * 1e9 + nanosInSecond;
      const result = convertNanoSecondsToHrTime(nanos);
      expect(result[0]).toBe(seconds);
      // Due to precision loss in the calculation above
      expect(result[1]).toBe(123456768);
    });

    it('should handle maximum safe integer', () => {
      const maxSafeInt = Number.MAX_SAFE_INTEGER;
      const result = convertNanoSecondsToHrTime(maxSafeInt);
      expect(result[0]).toBe(Math.floor(maxSafeInt / 1e9));
      expect(result[1]).toBe(maxSafeInt % 1e9);
    });
  });

  describe('convertHrTimeToNanoSeconds', () => {
    it('should convert HrTime with zero seconds correctly', () => {
      const hrTime: HrTime = [0, 123456789];
      const result = convertHrTimeToNanoSeconds(hrTime);
      expect(result).toBe(123456789n);
    });

    it('should convert HrTime with seconds correctly', () => {
      const hrTime: HrTime = [5, 500000000];
      const result = convertHrTimeToNanoSeconds(hrTime);
      expect(result).toBe(5_500_000_000n);
    });

    it('should handle zero HrTime', () => {
      const hrTime: HrTime = [0, 0];
      const result = convertHrTimeToNanoSeconds(hrTime);
      expect(result).toBe(0n);
    });

    it('should handle large HrTime values', () => {
      const hrTime: HrTime = [1234567890, 123456789];
      const result = convertHrTimeToNanoSeconds(hrTime);
      const expected = 1234567890n * 1_000_000_000n + 123456789n;
      expect(result).toBe(expected);
    });

    it('should be reversible with convertNanoSecondsToHrTime', () => {
      const testValues = [0, 123456789, 1_000_000_000, 5_500_000_000];

      testValues.forEach((nanos) => {
        const hrTime = convertNanoSecondsToHrTime(nanos);
        const result = convertHrTimeToNanoSeconds(hrTime);
        expect(result).toBe(BigInt(nanos));
      });
    });
  });

  describe('encodeSpanIdToBase64', () => {
    // Using array syntax for test.each (alternative to object syntax)
    test.each([
      ['standard 16-character hex span ID', '0123456789abcdef', 'ASNFZ4mrze8='],
      ['short span IDs with zero padding', 'abc', 'AAAAAAAACrw='],
      ['all zeros', '0000000000000000', 'AAAAAAAAAAA='],
      ['all F characters', 'ffffffffffffffff', '//////////8=']
    ])('should encode %s', (description, spanId, expected) => {
      const result = encodeSpanIdToBase64(spanId);
      expect(result).toBe(expected);
    });

    it('should handle mixed case hex strings', () => {
      const spanId = 'AbCdEf1234567890';
      const result = encodeSpanIdToBase64(spanId);
      // Should work the same as lowercase
      const lowercase = encodeSpanIdToBase64('abcdef1234567890');
      expect(result).toBe(lowercase);
    });
  });

  describe('encodeTraceIdToBase64', () => {
    it('should encode a standard 32-character hex trace ID', () => {
      const traceId = '0123456789abcdef0123456789abcdef';
      const result = encodeTraceIdToBase64(traceId);
      expect(result).toBe('ASNFZ4mrze8BI0VniavN7w==');
    });

    it('should pad short trace IDs with zeros', () => {
      const traceId = 'abc';
      const result = encodeTraceIdToBase64(traceId);
      // Should be padded to '00000000000000000000000000000abc'
      expect(result).toBe('AAAAAAAAAAAAAAAAAAAKvA==');
    });

    it('should handle all zeros', () => {
      const traceId = '00000000000000000000000000000000';
      const result = encodeTraceIdToBase64(traceId);
      expect(result).toBe('AAAAAAAAAAAAAAAAAAAAAA==');
    });

    it('should handle all F characters', () => {
      const traceId = 'ffffffffffffffffffffffffffffffff';
      const result = encodeTraceIdToBase64(traceId);
      expect(result).toBe('/////////////////////w==');
    });

    it('should handle mixed case hex strings', () => {
      const traceId = 'AbCdEf1234567890AbCdEf1234567890';
      const result = encodeTraceIdToBase64(traceId);
      // Should work the same as lowercase
      const lowercase = encodeTraceIdToBase64('abcdef1234567890abcdef1234567890');
      expect(result).toBe(lowercase);
    });
  });

  describe('decodeIdFromBase64', () => {
    it('should decode a base64 encoded span ID back to hex', () => {
      const base64Id = 'ASNFZ4mrze8=';
      const result = decodeIdFromBase64(base64Id);
      expect(result).toBe('0123456789abcdef');
    });

    it('should decode a base64 encoded trace ID back to hex', () => {
      const base64Id = 'ASNFZ4mrze8BI0VniavN7w==';
      const result = decodeIdFromBase64(base64Id);
      expect(result).toBe('0123456789abcdef0123456789abcdef');
    });

    it('should handle all zeros', () => {
      const spanBase64 = 'AAAAAAAAAAA=';
      const traceBase64 = 'AAAAAAAAAAAAAAAAAAAAAA==';

      expect(decodeIdFromBase64(spanBase64)).toBe('0000000000000000');
      expect(decodeIdFromBase64(traceBase64)).toBe('00000000000000000000000000000000');
    });

    it('should handle all F values', () => {
      const spanBase64 = '//////////8=';
      const traceBase64 = '/////////////////////w==';

      expect(decodeIdFromBase64(spanBase64)).toBe('ffffffffffffffff');
      expect(decodeIdFromBase64(traceBase64)).toBe('ffffffffffffffffffffffffffffffff');
    });

    it('should be reversible with encodeSpanIdToBase64', () => {
      const testSpanIds = [
        '0123456789abcdef',
        '0000000000000000',
        'ffffffffffffffff',
        'deadbeef12345678'
      ];

      testSpanIds.forEach((spanId) => {
        const encoded = encodeSpanIdToBase64(spanId);
        const decoded = decodeIdFromBase64(encoded);
        expect(decoded).toBe(spanId);
      });
    });

    it('should be reversible with encodeTraceIdToBase64', () => {
      const testTraceIds = [
        '0123456789abcdef0123456789abcdef',
        '00000000000000000000000000000000',
        'ffffffffffffffffffffffffffffffff',
        'deadbeef12345678deadbeef12345678'
      ];

      testTraceIds.forEach((traceId) => {
        const encoded = encodeTraceIdToBase64(traceId);
        const decoded = decodeIdFromBase64(encoded);
        expect(decoded).toBe(traceId);
      });
    });

    it('should handle empty base64 string', () => {
      const result = decodeIdFromBase64('');
      expect(result).toBe('');
    });

    it('should handle single byte base64', () => {
      // Base64 for single byte 0xFF
      const result = decodeIdFromBase64('/w==');
      expect(result).toBe('ff');
    });
  });

  describe('Edge cases and integration', () => {
    it('should handle conversion chain for span IDs', () => {
      // Test that we can go from hex -> base64 -> hex without loss
      const originalHex = 'a1b2c3d4e5f67890';
      const base64 = encodeSpanIdToBase64(originalHex);
      const decodedHex = decodeIdFromBase64(base64);

      expect(decodedHex).toBe(originalHex);
    });

    it('should handle conversion chain for trace IDs', () => {
      // Test that we can go from hex -> base64 -> hex without loss
      const originalHex = 'a1b2c3d4e5f67890a1b2c3d4e5f67890';
      const base64 = encodeTraceIdToBase64(originalHex);
      const decodedHex = decodeIdFromBase64(base64);

      expect(decodedHex).toBe(originalHex);
    });

    it('should handle odd-length hex strings for span ID', () => {
      const oddHex = '12345'; // 5 characters
      const base64 = encodeSpanIdToBase64(oddHex);
      const decoded = decodeIdFromBase64(base64);

      // Should be padded to '0000000000012345'
      expect(decoded).toBe('0000000000012345');
    });

    it('should handle odd-length hex strings for trace ID', () => {
      const oddHex = '12345'; // 5 characters
      const base64 = encodeTraceIdToBase64(oddHex);
      const decoded = decodeIdFromBase64(base64);

      // Should be padded to '00000000000000000000000000012345'
      expect(decoded).toBe('00000000000000000000000000012345');
    });

    it('should handle very long hex strings by truncation', () => {
      // Span ID should only use first 16 chars
      const longHex = '0123456789abcdef0123456789abcdef0123456789abcdef';
      const spanBase64 = encodeSpanIdToBase64(longHex);
      const decodedSpan = decodeIdFromBase64(spanBase64);

      // Should only encode first 16 chars
      expect(decodedSpan).toBe('0123456789abcdef');
    });

    it('should produce consistent results across multiple calls', () => {
      const spanId = 'deadbeef12345678';
      const traceId = 'deadbeef12345678deadbeef12345678';

      // Multiple calls should produce identical results
      const spanBase64_1 = encodeSpanIdToBase64(spanId);
      const spanBase64_2 = encodeSpanIdToBase64(spanId);
      expect(spanBase64_1).toBe(spanBase64_2);

      const traceBase64_1 = encodeTraceIdToBase64(traceId);
      const traceBase64_2 = encodeTraceIdToBase64(traceId);
      expect(traceBase64_1).toBe(traceBase64_2);
    });
  });
});

describe('deduplicateSpanNamesInPlace', () => {
  it('should deduplicate spans with duplicate names', () => {
    const spans = [createTestSpan('red'), createTestSpan('red')];

    deduplicateSpanNamesInPlace(spans);

    expect(spans[0].name).toBe('red_1');
    expect(spans[1].name).toBe('red_2');
  });

  it('should deduplicate only duplicate names, leaving unique names unchanged', () => {
    const spans = [createTestSpan('red'), createTestSpan('red'), createTestSpan('blue')];

    deduplicateSpanNamesInPlace(spans);

    expect(spans[0].name).toBe('red_1');
    expect(spans[1].name).toBe('red_2');
    expect(spans[2].name).toBe('blue');
  });

  it('should handle multiple sets of duplicates', () => {
    const spans = [
      createTestSpan('red'),
      createTestSpan('blue'),
      createTestSpan('red'),
      createTestSpan('green'),
      createTestSpan('blue'),
      createTestSpan('red')
    ];
    deduplicateSpanNamesInPlace(spans);

    expect(spans[0].name).toBe('red_1');
    expect(spans[1].name).toBe('blue_1');
    expect(spans[2].name).toBe('red_2');
    expect(spans[3].name).toBe('green');
    expect(spans[4].name).toBe('blue_2');
    expect(spans[5].name).toBe('red_3');
  });

  it('should handle spans with no duplicates', () => {
    const spans = [createTestSpan('red'), createTestSpan('blue'), createTestSpan('green')];

    deduplicateSpanNamesInPlace(spans);

    expect(spans[0].name).toBe('red');
    expect(spans[1].name).toBe('blue');
    expect(spans[2].name).toBe('green');
  });

  it('should handle empty array', () => {
    const spans: LiveSpan[] = [];

    expect(() => deduplicateSpanNamesInPlace(spans)).not.toThrow();
    expect(spans.length).toBe(0);
  });
});

describe('mapArgsToObject', () => {
  // Basic argument mapping test cases
  test.each([
    {
      description: 'regular functions',
      func: function add(a: number, b: number) {
        return a + b;
      },
      args: [5, 10],
      expected: { a: 5, b: 10 }
    },
    {
      description: 'arrow functions',
      func: (x: number, y: number) => x * y,
      args: [3, 4],
      expected: { x: 3, y: 4 }
    },
    {
      description: 'single parameter functions',
      func: (value: number) => value * 2,
      args: [7],
      expected: { value: 7 }
    },
    {
      description: 'functions with no parameters',
      func: () => 42,
      args: [],
      expected: {}
    },
    {
      description: 'functions with default parameters',
      func: function withDefaults(name: string, greeting: string = 'Hello') {
        return greeting + ' ' + name;
      },
      args: ['World'],
      expected: { name: 'World' }
    },
    {
      description: 'functions with type annotations',
      func: function typed(id: number, name: string, active: boolean) {
        return { id, name, active };
      },
      args: [123, 'John', true],
      expected: { id: 123, name: 'John', active: true }
    },
    {
      description: 'anonymous functions',
      func: function (first: string, second: number) {
        return first + second;
      },
      args: ['hello', 42],
      expected: { first: 'hello', second: 42 }
    },
    {
      description: 'fewer arguments than parameters',
      func: function threeParams(a: number, b: number, c: number) {
        return a + b + c;
      },
      args: [1, 2],
      expected: { a: 1, b: 2 }
    },
    {
      description: 'more arguments than parameters',
      func: function twoParams(a: number, b: number) {
        return a + b;
      },
      args: [1, 2, 3, 4],
      expected: { a: 1, b: 2 }
    },
    {
      description: 'complex argument types (objects, arrays)',
      func: function complex(obj: object, arr: any[], str: string) {
        return { obj, arr, str };
      },
      args: [{ key: 'value' }, [1, 2, 3], 'test'],
      expected: { obj: { key: 'value' }, arr: [1, 2, 3], str: 'test' }
    },
    {
      description: 'null and undefined arguments',
      func: function nullable(a: any, b: any, c: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return a + b + c;
      },
      args: [null, undefined, 'value'],
      expected: { a: null, b: undefined, c: 'value' }
    },
    {
      description: 'functions with destructured parameters gracefully',
      func: function withDestructuring({ prop }: any, normal: string) {
        return prop + normal;
      },
      args: [{ prop: 'value' }, 'normal'],
      expected: { normal: { prop: 'value' } }
    },
    {
      description: 'fallback to args array when parameter extraction fails',
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      func: new Function('return arguments[0] + arguments[1];'),
      args: [1, 2],
      expected: { args: [1, 2] }
    },
    {
      description: 'empty object for no parameters and no arguments',
      func: () => {},
      args: [],
      expected: {}
    },
    {
      description: 'edge case with only whitespace parameters',
      func: () => {},
      args: [],
      expected: {}
    },
    {
      description: 'functions with object destructuring parameters (JS/TS kwarg-only pattern)',
      func: ({ a, b }: { a: number; b: number }) => a + b,
      args: [{ a: 5, b: 10 }],
      expected: { args: [{ a: 5, b: 10 }] }
    }
  ])('should handle $description', ({ func, args, expected }) => {
    const result = mapArgsToObject(func, args);
    expect(result).toEqual(expected);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: json.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/utils/json.test.ts

```typescript
import { safeJsonStringify } from '../../../src/core/utils/json';

describe('safeJsonStringify', () => {
  it('should stringify simple values correctly', () => {
    expect(safeJsonStringify('hello')).toBe('"hello"');
    expect(safeJsonStringify(123)).toBe('123');
    expect(safeJsonStringify(true)).toBe('true');
    expect(safeJsonStringify(null)).toBe('null');
    expect(safeJsonStringify({ a: 1, b: 'test' })).toBe('{"a":1,"b":"test"}');
    expect(safeJsonStringify([1, 2, 3])).toBe('[1,2,3]');
  });

  it('should handle circular references', () => {
    const obj: any = { name: 'test' };
    obj.self = obj;

    const result = safeJsonStringify(obj);
    const parsed = JSON.parse(result);

    expect(parsed.name).toBe('test');
    expect(parsed.self).toBe('[Circular]');
  });

  it('should handle functions', () => {
    const obj = {
      name: 'test',
      fn: () => console.log('hello'),
      method: function () {
        return 42;
      }
    };

    const result = safeJsonStringify(obj);
    const parsed = JSON.parse(result);

    expect(parsed.name).toBe('test');
    expect(parsed.fn).toBe('[Function]');
    expect(parsed.method).toBe('[Function]');
  });

  it('should handle undefined values', () => {
    const obj = {
      name: 'test',
      value: undefined,
      nested: { prop: undefined }
    };

    const result = safeJsonStringify(obj);
    const parsed = JSON.parse(result);

    expect(parsed.name).toBe('test');
    expect(parsed.value).toBe('[Undefined]');
    expect(parsed.nested.prop).toBe('[Undefined]');
  });

  it('should handle Error objects', () => {
    const error = new Error('Test error');
    const obj = {
      status: 'failed',
      error
    };

    const result = safeJsonStringify(obj);
    const parsed = JSON.parse(result);

    expect(parsed.status).toBe('failed');
    expect(parsed.error.name).toBe('Error');
    expect(parsed.error.message).toBe('Test error');
    expect(parsed.error.stack).toBeDefined();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: mlflow-master/libs/typescript/integrations/anthropic/jest.config.js

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  globalSetup: '<rootDir>/../../jest.global-server-setup.ts',
  globalTeardown: '<rootDir>/../../jest.global-server-teardown.ts',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: mlflow-master/libs/typescript/integrations/anthropic/package.json

```json
{
  "name": "mlflow-anthropic",
  "version": "0.1.1",
  "description": "Anthropic integration package for MLflow Tracing",
  "repository": {
    "type": "git",
    "url": "https://github.com/mlflow/mlflow.git"
  },
  "homepage": "https://mlflow.org/",
  "author": {
    "name": "MLflow",
    "url": "https://mlflow.org/"
  },
  "bugs": {
    "url": "https://github.com/mlflow/mlflow/issues"
  },
  "license": "Apache-2.0",
  "keywords": [
    "mlflow",
    "tracing",
    "observability",
    "opentelemetry",
    "llm",
    "anthropic",
    "claude",
    "javascript",
    "typescript"
  ],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "peerDependencies": {
    "mlflow-tracing": "^0.1.0-rc.0",
    "@anthropic-ai/sdk": "^0.32.0"
  },
  "devDependencies": {
    "jest": "^29.6.2",
    "typescript": "^5.8.3"
  },
  "engines": {
    "node": ">=18"
  },
  "files": [
    "dist/"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/libs/typescript/integrations/anthropic/README.md

```text
# MLflow Typescript SDK - Anthropic

Seamlessly integrate [MLflow Tracing](https://github.com/mlflow/mlflow/tree/main/libs/typescript) with Anthropic to automatically trace your Claude API calls.

| Package                | NPM                                                                                                                                               | Description                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [mlflow-anthropic](./) | [![npm package](https://img.shields.io/npm/v/mlflow-tracing-anthropic?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing-anthropic) | Auto-instrumentation integration for Anthropic. |

## Installation

```bash
npm install mlflow-anthropic
```

The package includes the [`mlflow-tracing`](https://github.com/mlflow/mlflow/tree/main/libs/typescript) package and `@anthropic-ai/sdk` package as peer dependencies. Depending on your package manager, you may need to install these two packages separately.

## Quickstart

Start MLflow Tracking Server if you don't have one already:

```bash
pip install mlflow
mlflow server --backend-store-uri sqlite:///mlruns.db --port 5000
```

Self-hosting MLflow server requires Python 3.10 or higher. If you don't have one, you can also use [managed MLflow service](https://mlflow.org/#get-started) for free to get started quickly.

Instantiate MLflow SDK in your application:

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.init({
  trackingUri: 'http://localhost:5000',
  experimentId: '<experiment-id>'
});
```

Create a trace for Anthropic Claude:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { tracedAnthropic } from 'mlflow-anthropic';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const client = tracedAnthropic(anthropic);

const response = await client.messages.create({
  model: 'claude-3-7-sonnet-20250219',
  max_tokens: 256,
  messages: [{ role: 'user', content: 'Hello Claude' }]
});
```

View traces in MLflow UI:

![MLflow Tracing UI](https://github.com/mlflow/mlflow/blob/master/docs/static/images/llms/anthropic/anthropic-tracing.png?raw=True)

## Documentation 📘

Official documentation for MLflow Typescript SDK can be found [here](https://mlflow.org/docs/latest/genai/tracing/quickstart).

## License

This project is licensed under the [Apache License 2.0](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: mlflow-master/libs/typescript/integrations/anthropic/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 217
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 217 of 991)

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

---[FILE: config.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/config.test.ts

```typescript
import fs from 'fs';
import os from 'os';
import path from 'path';
import { init, getConfig, readDatabricksConfig } from '../../src/core/config';

describe('Config', () => {
  describe('init and getConfig', () => {
    describe('environment variable resolution', () => {
      afterEach(() => {
        delete process.env.MLFLOW_TRACKING_URI;
        delete process.env.MLFLOW_EXPERIMENT_ID;
      });

      it('should read tracking configuration from environment variables when not provided', () => {
        process.env.MLFLOW_TRACKING_URI = 'http://env-tracking-host:5000';
        process.env.MLFLOW_EXPERIMENT_ID = 'env-experiment-id';

        init({});

        const result = getConfig();
        expect(result.trackingUri).toBe('http://env-tracking-host:5000');
        expect(result.experimentId).toBe('env-experiment-id');
        expect(result.host).toBe('http://env-tracking-host:5000');
      });

      it('should throw an error when trackingUri is missing from both config and environment', () => {
        process.env.MLFLOW_EXPERIMENT_ID = 'env-experiment-id';

        expect(() => init({ experimentId: 'config-experiment-id' })).toThrow(
          'An MLflow Tracking URI is required, please provide the trackingUri option to init, or set the MLFLOW_TRACKING_URI environment variable'
        );
      });

      it('should throw an error when experimentId is missing from both config and environment', () => {
        process.env.MLFLOW_TRACKING_URI = 'http://env-tracking-host:5000';

        expect(() => init({ trackingUri: 'http://explicit-host:5000' })).toThrow(
          'An MLflow experiment ID is required, please provide the experimentId option to init, or set the MLFLOW_EXPERIMENT_ID environment variable'
        );
      });
    });

    it('should initialize with MLflow tracking server configuration', () => {
      const config = {
        trackingUri: 'http://localhost:5000',
        experimentId: '123456789'
      };

      init(config);

      const result = getConfig();
      expect(result.trackingUri).toBe('http://localhost:5000');
      expect(result.experimentId).toBe('123456789');
      expect(result.host).toBe('http://localhost:5000');
    });

    it('should throw error if trackingUri is missing', () => {
      const config = {
        trackingUri: '',
        experimentId: '123456789'
      };

      expect(() => init(config)).toThrow(
        'An MLflow Tracking URI is required, please provide the trackingUri option to init, or set the MLFLOW_TRACKING_URI environment variable'
      );
    });

    it('should throw error if experimentId is missing', () => {
      const config = {
        trackingUri: 'http://localhost:5000',
        experimentId: ''
      };

      expect(() => init(config)).toThrow(
        'An MLflow experiment ID is required, please provide the experimentId option to init, or set the MLFLOW_EXPERIMENT_ID environment variable'
      );
    });

    it('should throw error if trackingUri is not a string', () => {
      const config = {
        trackingUri: 123 as any,
        experimentId: '123456789'
      };

      expect(() => init(config)).toThrow('trackingUri must be a string');
    });

    it('should throw error if experimentId is not a string', () => {
      const config = {
        trackingUri: 'http://localhost:5000',
        experimentId: 123 as any
      };

      expect(() => init(config)).toThrow('experimentId must be a string');
    });

    it('should throw error for malformed trackingUri', () => {
      const config = {
        trackingUri: 'not-a-valid-uri',
        experimentId: '123456789'
      };

      expect(() => init(config)).toThrow(
        "Invalid trackingUri: 'not-a-valid-uri'. Must be a valid HTTP or HTTPS URL."
      );
    });

    it.skip('should throw error if getConfig is called without init', () => {
      // Skip this test as it interferes with other tests due to module state
      expect(() => getConfig()).toThrow(
        'The MLflow Tracing client is not configured. Please call init() with host and experimentId before using tracing functions.'
      );
    });

    describe('Databricks configuration', () => {
      const tempDir = path.join(os.tmpdir(), 'mlflow-databricks-test-' + Date.now());
      const configPath = path.join(tempDir, '.databrickscfg');

      beforeEach(() => {
        fs.mkdirSync(tempDir, { recursive: true });
      });

      afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
      });

      it('should read Databricks config for default profile', () => {
        const configContent = `[DEFAULT]
host = https://my-workspace.databricks.com
token = dapi123456789abcdef

[dev]
host = https://dev-workspace.databricks.com
token = dapi987654321fedcba`;

        fs.writeFileSync(configPath, configContent);

        const config = {
          trackingUri: 'databricks',
          experimentId: '123456789',
          databricksConfigPath: configPath
        };

        init(config);

        const result = getConfig();
        expect(result.host).toBe('https://my-workspace.databricks.com');
        expect(result.databricksToken).toBe('dapi123456789abcdef');
      });

      it('should read Databricks config for specific profile', () => {
        const configContent = `[DEFAULT]
host = https://my-workspace.databricks.com
token = dapi123456789abcdef

[dev]
host = https://dev-workspace.databricks.com
token = dapi987654321fedcba`;

        fs.writeFileSync(configPath, configContent);

        const config = {
          trackingUri: 'databricks://dev',
          experimentId: '123456789',
          databricksConfigPath: configPath
        };

        init(config);

        const result = getConfig();
        expect(result.host).toBe('https://dev-workspace.databricks.com');
        expect(result.databricksToken).toBe('dapi987654321fedcba');
      });

      it('should use explicit host/token over config file', () => {
        const configContent = `[DEFAULT]
host = https://my-workspace.databricks.com
token = dapi123456789abcdef`;

        fs.writeFileSync(configPath, configContent);

        const config = {
          trackingUri: 'databricks',
          experimentId: '123456789',
          databricksConfigPath: configPath,
          host: 'https://override-workspace.databricks.com',
          databricksToken: 'override-token'
        };

        init(config);

        const result = getConfig();
        expect(result.host).toBe('https://override-workspace.databricks.com');
        expect(result.databricksToken).toBe('override-token');
      });

      it('should throw error if Databricks config file not found', () => {
        const config = {
          trackingUri: 'databricks',
          experimentId: '123456789',
          databricksConfigPath: '/nonexistent/path/.databrickscfg'
        };

        expect(() => init(config)).toThrow(/Failed to read Databricks configuration/);
        expect(() => init(config)).toThrow(
          /Make sure your \/nonexistent\/path\/.databrickscfg file exists/
        );
      });

      it('should throw error if profile not found in config', () => {
        const configContent = `[DEFAULT]
host = https://my-workspace.databricks.com
token = dapi123456789abcdef`;

        fs.writeFileSync(configPath, configContent);

        const config = {
          trackingUri: 'databricks://nonexistent',
          experimentId: '123456789',
          databricksConfigPath: configPath
        };

        expect(() => init(config)).toThrow(
          /Failed to read Databricks configuration for profile 'nonexistent'/
        );
      });

      it('should handle empty profile name as DEFAULT', () => {
        const configContent = `[DEFAULT]
host = https://my-workspace.databricks.com
token = dapi123456789abcdef`;

        fs.writeFileSync(configPath, configContent);

        const config = {
          trackingUri: 'databricks://',
          experimentId: '123456789',
          databricksConfigPath: configPath
        };

        init(config);

        const result = getConfig();
        expect(result.host).toBe('https://my-workspace.databricks.com');
        expect(result.databricksToken).toBe('dapi123456789abcdef');
      });

      it('should use environment variables over config file', () => {
        const configContent = `[DEFAULT]
host = https://config-workspace.databricks.com
token = config-token`;

        fs.writeFileSync(configPath, configContent);

        // Set environment variables
        process.env.DATABRICKS_HOST = 'https://env-workspace.databricks.com';
        process.env.DATABRICKS_TOKEN = 'env-token';

        const config = {
          trackingUri: 'databricks',
          experimentId: '123456789',
          databricksConfigPath: configPath
        };

        init(config);

        const result = getConfig();
        expect(result.host).toBe('https://env-workspace.databricks.com');
        expect(result.databricksToken).toBe('env-token');

        // Clean up environment variables
        delete process.env.DATABRICKS_HOST;
        delete process.env.DATABRICKS_TOKEN;
      });
    });
  });

  describe('readDatabricksConfig', () => {
    const tempDir = path.join(os.tmpdir(), 'mlflow-read-test-' + Date.now());
    const configPath = path.join(tempDir, '.databrickscfg');

    beforeEach(() => {
      fs.mkdirSync(tempDir, { recursive: true });
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('should read DEFAULT profile by default', () => {
      const configContent = `[DEFAULT]
host = https://default-workspace.databricks.com
token = default-token`;

      fs.writeFileSync(configPath, configContent);

      const result = readDatabricksConfig(configPath);
      expect(result.host).toBe('https://default-workspace.databricks.com');
      expect(result.token).toBe('default-token');
    });

    it('should read specific profile', () => {
      const configContent = `[DEFAULT]
host = https://default-workspace.databricks.com
token = default-token

[production]
host = https://prod-workspace.databricks.com
token = prod-token`;

      fs.writeFileSync(configPath, configContent);

      const result = readDatabricksConfig(configPath, 'production');
      expect(result.host).toBe('https://prod-workspace.databricks.com');
      expect(result.token).toBe('prod-token');
    });

    it('should handle config with extra fields', () => {
      const configContent = `[DEFAULT]
host = https://default-workspace.databricks.com
token = default-token
username = user@example.com
jobs-api-version = 2.1`;

      fs.writeFileSync(configPath, configContent);

      const result = readDatabricksConfig(configPath);
      expect(result.host).toBe('https://default-workspace.databricks.com');
      expect(result.token).toBe('default-token');
    });

    it('should throw error if config file not found', () => {
      expect(() => readDatabricksConfig('/nonexistent/path/.databrickscfg')).toThrow(
        'Failed to read Databricks config: Databricks config file not found at /nonexistent/path/.databrickscfg'
      );
    });

    it('should throw error if profile not found', () => {
      const configContent = `[DEFAULT]
host = https://default-workspace.databricks.com
token = default-token`;

      fs.writeFileSync(configPath, configContent);

      expect(() => readDatabricksConfig(configPath, 'nonexistent')).toThrow(
        "Failed to read Databricks config: Profile 'nonexistent' not found in Databricks config file"
      );
    });

    it('should throw error if host missing in profile', () => {
      const configContent = `[DEFAULT]
token = default-token`;

      fs.writeFileSync(configPath, configContent);

      expect(() => readDatabricksConfig(configPath)).toThrow(
        "Failed to read Databricks config: Host not found for profile 'DEFAULT' in Databricks config file"
      );
    });

    it('should throw error if token missing in profile', () => {
      const configContent = `[DEFAULT]
host = https://default-workspace.databricks.com`;

      fs.writeFileSync(configPath, configContent);

      expect(() => readDatabricksConfig(configPath)).toThrow(
        "Failed to read Databricks config: Token not found for profile 'DEFAULT' in Databricks config file"
      );
    });

    it('should handle malformed config file', () => {
      const configContent = `This is not a valid INI file
[missing closing bracket
host = value`;

      fs.writeFileSync(configPath, configContent);

      // The ini parser is permissive, so this might not throw, but profile won't be found
      expect(() => readDatabricksConfig(configPath, 'DEFAULT')).toThrow(
        /Failed to read Databricks config/
      );
    });

    it('should read Databricks config for multiple profiles', () => {
      const configContent = `[DEFAULT]
host = https://default-workspace.databricks.com
token = dapi123456789abcdef

[dev]
host = https://dev-workspace.databricks.com
token = dapidev123456789ab

[staging]
host = https://staging-workspace.databricks.com
token = dapistaging123456`;

      fs.writeFileSync(configPath, configContent);

      // Test DEFAULT profile
      let result = readDatabricksConfig(configPath);
      expect(result.host).toBe('https://default-workspace.databricks.com');
      expect(result.token).toBe('dapi123456789abcdef');

      // Test dev profile
      result = readDatabricksConfig(configPath, 'dev');
      expect(result.host).toBe('https://dev-workspace.databricks.com');
      expect(result.token).toBe('dapidev123456789ab');

      // Test staging profile
      result = readDatabricksConfig(configPath, 'staging');
      expect(result.host).toBe('https://staging-workspace.databricks.com');
      expect(result.token).toBe('dapistaging123456');
    });

    it('should handle Azure Databricks config format', () => {
      const configContent = `[azure]
host = https://adb-1234567890123456.7.azuredatabricks.net
token = dapiazure123456789abcdef`;

      fs.writeFileSync(configPath, configContent);

      const result = readDatabricksConfig(configPath, 'azure');
      expect(result.host).toBe('https://adb-1234567890123456.7.azuredatabricks.net');
      expect(result.token).toBe('dapiazure123456789abcdef');
    });

    it('should handle AWS Databricks config format', () => {
      const configContent = `[aws]
host = https://dbc-abcd1234-5678.cloud.databricks.com
token = dapiaws123456789abcdef`;

      fs.writeFileSync(configPath, configContent);

      const result = readDatabricksConfig(configPath, 'aws');
      expect(result.host).toBe('https://dbc-abcd1234-5678.cloud.databricks.com');
      expect(result.token).toBe('dapiaws123456789abcdef');
    });

    it('should handle GCP Databricks config format', () => {
      const configContent = `[gcp]
host = https://1234567890123456.7.gcp.databricks.com
token = dapigcp123456789abcdef`;

      fs.writeFileSync(configPath, configContent);

      const result = readDatabricksConfig(configPath, 'gcp');
      expect(result.host).toBe('https://1234567890123456.7.gcp.databricks.com');
      expect(result.token).toBe('dapigcp123456789abcdef');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: trace_manager.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/trace_manager.test.ts

```typescript
import { InMemoryTraceManager } from '../../src/core/trace_manager';
import { Trace } from '../../src/core/entities/trace';
import { TraceInfo } from '../../src/core/entities/trace_info';
import { createTraceLocationFromExperimentId } from '../../src/core/entities/trace_location';
import { TraceState } from '../../src/core/entities/trace_state';
import { createTestSpan } from '../helper';
import { Span } from '../../src/core/entities/span';
import { TraceMetadataKey } from '../../src/core/constants';

/**
 * Helper function to create a test TraceInfo object
 */
function createTestTraceInfo(traceId: string): TraceInfo {
  return new TraceInfo({
    traceId,
    traceLocation: createTraceLocationFromExperimentId('1'),
    requestTime: Date.now(),
    state: TraceState.IN_PROGRESS,
    requestPreview: undefined,
    responsePreview: undefined,
    traceMetadata: {},
    tags: {}
  });
}

describe('InMemoryTraceManager', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    InMemoryTraceManager.reset();
  });

  afterEach(() => {
    // Clean up after each test
    InMemoryTraceManager.reset();
  });

  it('should return the same instance when called multiple times', () => {
    const obj1 = InMemoryTraceManager.getInstance();
    const obj2 = InMemoryTraceManager.getInstance();
    expect(obj1).toBe(obj2);
  });

  it('should add spans and pop traces correctly', () => {
    const traceManager = InMemoryTraceManager.getInstance();

    // Add a new trace info
    const traceId = 'tr-1';
    const otelTraceId = '12345';
    traceManager.registerTrace(otelTraceId, createTestTraceInfo(traceId));

    // Add a span for a new trace
    const span11 = createTestSpan('test', traceId, 'span11');
    traceManager.registerSpan(span11);

    expect(traceManager.getTrace(traceId)).toBeTruthy();
    const trace1 = traceManager.getTrace(traceId);
    expect(trace1?.info.traceId).toBe(traceId);
    expect(trace1?.spanDict.size).toBe(1);

    // Add more spans to the same trace
    const span111 = createTestSpan('test', traceId, 'span111');
    const span112 = createTestSpan('test', traceId, 'span112');
    traceManager.registerSpan(span111);
    traceManager.registerSpan(span112);
    expect(trace1?.spanDict.size).toBe(3);

    // Pop the trace data
    const poppedTrace1 = traceManager.popTrace(otelTraceId);
    expect(poppedTrace1).toBeInstanceOf(Trace);
    expect(poppedTrace1?.info.traceId).toBe(traceId);
    expect(poppedTrace1?.data.spans.length).toBe(3);
    expect(traceManager.getTrace(traceId)).toBeNull();
    expect(poppedTrace1?.data.spans[0]).toBeInstanceOf(Span);
  });

  it('should truncate the request/response preview if it exceeds the max length', () => {
    const traceManager = InMemoryTraceManager.getInstance();
    const traceId = 'tr-1';
    const otelTraceId = '12345';
    traceManager.registerTrace(otelTraceId, createTestTraceInfo(traceId));

    const span = createTestSpan('test', traceId, 'span11');
    span.setInputs('a'.repeat(5000));
    traceManager.registerSpan(span);

    const trace = traceManager.popTrace(otelTraceId);
    expect(trace?.info.requestPreview).toHaveLength(1000);
    expect(trace?.info.traceMetadata[TraceMetadataKey.INPUTS]).toHaveLength(1000);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: span.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/span.test.ts

```typescript
import { trace } from '@opentelemetry/api';
import { BasicTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  createMlflowSpan,
  Span,
  NoOpSpan,
  type LiveSpan,
  type SerializedSpan
} from '../../../src/core/entities/span';
import { SpanEvent } from '../../../src/core/entities/span_event';
import { SpanStatus, SpanStatusCode } from '../../../src/core/entities/span_status';
import { SpanAttributeKey, SpanType } from '../../../src/core/constants';
import { convertHrTimeToNanoSeconds } from '../../../src/core/utils';
import { JSONBig } from '../../../src/core/utils/json';

// Set up a proper tracer provider
const provider = new BasicTracerProvider();
trace.setGlobalTracerProvider(provider);

const tracer = trace.getTracer('mlflow-test-tracer', '1.0.0');

describe('Span', () => {
  describe('createMlflowSpan', () => {
    describe('Live Span Creation', () => {
      it('should create a live span from an active OpenTelemetry span', () => {
        const traceId = 'tr-12345';

        const span = tracer.startSpan('parent');

        try {
          const mlflowSpan = createMlflowSpan(span, traceId, SpanType.LLM);

          expect(mlflowSpan).toBeInstanceOf(Span);
          expect(mlflowSpan.traceId).toBe(traceId);
          expect(mlflowSpan.name).toBe('parent');
          /* OpenTelemetry's end time default value is 0 when unset */
          expect(mlflowSpan.startTime[0]).toBeGreaterThan(0); // Check seconds part of HrTime
          expect(mlflowSpan.endTime?.[1]).toBe(0); // Check nanoseconds part of HrTime
          expect(mlflowSpan.parentId).toBeNull();
        } finally {
          span.end();
        }
      });

      it('should handle span inputs and outputs', () => {
        const traceId = 'tr-12345';
        const span = tracer.startSpan('test');

        try {
          const mlflowSpan = createMlflowSpan(span, traceId) as LiveSpan;

          mlflowSpan.setInputs({ input: 1 });
          mlflowSpan.setOutputs(2);

          expect(mlflowSpan.inputs).toEqual({ input: 1 });
          expect(mlflowSpan.outputs).toBe(2);
        } finally {
          span.end();
        }
      });

      it('should handle span attributes', () => {
        const traceId = 'tr-12345';
        const span = tracer.startSpan('test');

        try {
          const mlflowSpan = createMlflowSpan(span, traceId) as LiveSpan;

          mlflowSpan.setAttribute('key', 3);
          expect(mlflowSpan.getAttribute('key')).toBe(3);

          // Test complex object serialization
          const complexObject = { nested: { value: 'test' } };
          mlflowSpan.setAttribute('complex', complexObject);
          expect(mlflowSpan.getAttribute('complex')).toEqual(complexObject);
        } finally {
          span.end();
        }
      });

      it('should handle span status', () => {
        const traceId = 'tr-12345';
        const span = tracer.startSpan('test');

        try {
          const mlflowSpan = createMlflowSpan(span, traceId) as LiveSpan;

          mlflowSpan.setStatus(SpanStatusCode.OK);
          expect(mlflowSpan.status).toBeInstanceOf(SpanStatus);
          expect(mlflowSpan.status?.statusCode).toBe(SpanStatusCode.OK);
        } finally {
          span.end();
        }
      });

      it('should handle span events', () => {
        const traceId = 'tr-12345';
        const span = tracer.startSpan('test');

        try {
          const mlflowSpan = createMlflowSpan(span, traceId) as LiveSpan;

          const event = new SpanEvent({
            name: 'test_event',
            timestamp: 99999n,
            attributes: { foo: 'bar' }
          });

          mlflowSpan.addEvent(event);

          const events = mlflowSpan.events;
          expect(events.length).toBeGreaterThan(0);

          // Find our test event
          const testEvent = events.find((e) => e.name === 'test_event');
          expect(testEvent).toBeDefined();
          expect(testEvent?.attributes).toEqual({ foo: 'bar' });
        } finally {
          span.end();
        }
      });
    });

    describe('Completed Span Creation', () => {
      it('should create a completed span from an active OpenTelemetry span', () => {
        const traceId = 'tr-12345';
        const span = tracer.startSpan('parent');
        span.setAttribute(SpanAttributeKey.TRACE_ID, JSONBig.stringify(traceId));
        span.setAttribute(SpanAttributeKey.INPUTS, '{"input": 1}');
        span.setAttribute(SpanAttributeKey.OUTPUTS, '2');
        span.setAttribute('custom_attr', 'custom_value');
        span.end();

        const mlflowSpan = createMlflowSpan(span, traceId);

        expect(mlflowSpan).toBeInstanceOf(Span);
        expect(mlflowSpan.traceId).toBe(traceId);
        expect(mlflowSpan.name).toBe('parent');
        expect(convertHrTimeToNanoSeconds(mlflowSpan.startTime)).toBeGreaterThan(0n);
        expect(mlflowSpan.endTime).toBeDefined();
        if (mlflowSpan.endTime) {
          expect(convertHrTimeToNanoSeconds(mlflowSpan.endTime)).toBeGreaterThan(0n);
        }
        expect(mlflowSpan.parentId).toBeNull();
        expect(mlflowSpan.inputs).toEqual({ input: 1 });
        expect(mlflowSpan.outputs).toBe(2);
        expect(mlflowSpan.getAttribute('custom_attr')).toBe('custom_value');

        // Setter should not be defined for completed span
        expect('setInputs' in mlflowSpan).toBe(false);
        expect('setOutputs' in mlflowSpan).toBe(false);
        expect('setAttribute' in mlflowSpan).toBe(false);
        expect('addEvent' in mlflowSpan).toBe(false);
      });
    });

    describe('No-Op Span Creation', () => {
      it('should create a no-op span from null input', () => {
        const traceId = 'tr-12345';
        const span = createMlflowSpan(null, traceId);

        expect(span).toBeInstanceOf(NoOpSpan);
        expect(span.traceId).toBe('no-op-span-trace-id');
        expect(span.spanId).toBe('');
        expect(span.name).toBe('');
        expect(span.startTime).toEqual([0, 0]); // HrTime format [seconds, nanoseconds]
        expect(span.endTime).toBeNull();
        expect(span.parentId).toBeNull();
        expect(span.inputs).toBeNull();
        expect(span.outputs).toBeNull();
      });

      it('should create a no-op span from undefined input', () => {
        const traceId = 'tr-12345';
        const span = createMlflowSpan(undefined, traceId);

        expect(span).toBeInstanceOf(NoOpSpan);
      });
    });
  });

  describe('Exception Safety', () => {
    it('should handle exceptions in span.end() gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const traceId = 'tr-12345';
      const span = tracer.startSpan('test-span');

      try {
        const mlflowSpan = createMlflowSpan(span, traceId) as LiveSpan;

        // Mock the underlying OTel span to throw on end()
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const originalEnd = span.end;
        span.end = jest.fn(() => {
          throw new Error('OTel span.end() failed');
        });

        expect(() => mlflowSpan.end()).not.toThrow();

        // Restore original end method
        span.end = originalEnd;
      } finally {
        span.end();
        consoleErrorSpy.mockRestore();
      }
    });
  });

  describe('Circular Reference Handling', () => {
    it('should handle circular references in span attributes', () => {
      const traceId = 'tr-circular';
      const span = tracer.startSpan('circular-test');

      try {
        const mlflowSpan = createMlflowSpan(span, traceId, SpanType.UNKNOWN) as LiveSpan;

        // Create an object with circular reference
        const circularObj: any = { name: 'test' };
        circularObj.self = circularObj;

        // This should not throw
        expect(() => {
          mlflowSpan.setAttribute('circular', circularObj);
        }).not.toThrow();

        // Verify the circular reference is replaced with placeholder
        const attrValue = mlflowSpan.getAttribute('circular');
        expect(attrValue.name).toBe('test');
        expect(attrValue.self).toBe('[Circular]');
      } finally {
        span.end();
      }
    });

    it('should handle non-serializable objects', () => {
      const traceId = 'tr-non-serializable';
      const span = tracer.startSpan('non-serializable-test');

      try {
        const mlflowSpan = createMlflowSpan(span, traceId, SpanType.UNKNOWN) as LiveSpan;

        // Test various non-serializable objects
        const testData = {
          func: () => console.log('test'),
          undefinedVal: undefined,
          error: new Error('Test error'),
          date: new Date('2024-01-01'),
          regex: /test/g,
          map: new Map([['key', 'value']]),
          set: new Set([1, 2, 3])
        };

        // This should not throw
        expect(() => {
          mlflowSpan.setAttribute('nonSerializable', testData);
        }).not.toThrow();

        const attrValue = mlflowSpan.getAttribute('nonSerializable');
        expect(attrValue.func).toBe('[Function]');
        expect(attrValue.undefinedVal).toBe('[Undefined]');
        expect(attrValue.error.name).toBe('Error');
        expect(attrValue.error.message).toBe('Test error');
        expect(attrValue.date).toBeDefined(); // Date should be serialized normally
      } finally {
        span.end();
      }
    });
  });

  describe('JSON Serialization', () => {
    it('should produce correct JSON format for toJson()', () => {
      const traceId = 'tr-12345';
      const span = tracer.startSpan('test-span');

      try {
        const mlflowSpan = createMlflowSpan(span, traceId, SpanType.LLM) as LiveSpan;

        // Set inputs, outputs, and attributes to match expected format
        mlflowSpan.setInputs({ x: 1 });
        mlflowSpan.setOutputs(2);
        mlflowSpan.setAttribute('mlflow.spanFunctionName', 'f');
        mlflowSpan.setStatus(SpanStatusCode.OK);

        // Add an event
        const event = new SpanEvent({
          name: 'test_event',
          timestamp: 1500000000000n,
          attributes: { eventAttr: 'value' }
        });
        mlflowSpan.addEvent(event);
      } finally {
        span.end();
      }

      // Get the completed span
      const completedSpan = createMlflowSpan(span, traceId);
      const json = completedSpan.toJson();

      // Validate JSON structure matches expected format
      expect(json).toHaveProperty('span_id');
      expect(json).toHaveProperty('name', 'test-span');
      expect(json).toHaveProperty('start_time_unix_nano');
      expect(json).toHaveProperty('end_time_unix_nano');
      expect(json).toHaveProperty('attributes');
      expect(json).toHaveProperty('status');
      expect(json).toHaveProperty('events');

      // Validate that attributes exist and have correct values
      expect(json.attributes['mlflow.spanInputs']).toEqual({ x: 1 });
      expect(json.attributes['mlflow.spanOutputs']).toBe(2);
      expect(json.attributes['mlflow.spanType']).toBe('LLM');
      expect(json.attributes['mlflow.traceRequestId']).toBe(traceId);

      // Validate status format
      expect(json.status).toHaveProperty('code');
      expect(json.status.code).toBe('STATUS_CODE_OK');

      // Validate timestamps are bigint for precision
      expect(typeof json.start_time_unix_nano).toBe('bigint');
      expect(typeof json.end_time_unix_nano).toBe('bigint');

      // Validate events structure
      expect(Array.isArray(json.events)).toBe(true);
      if (json.events.length > 0) {
        const event = json.events[0];
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('time_unix_nano');
        expect(event).toHaveProperty('attributes');
      }
    });

    it('should match expected JSON format from real MLflow data', () => {
      // Create a span that matches the real MLflow data structure
      const expectedSpanData = {
        trace_id: 'rZo9DIws+6d2tejICXD4gw==',
        span_id: 'DOD2qjZ6ZrU=',
        trace_state: '',
        parent_span_id: '',
        name: 'python',
        start_time_unix_nano: 1749996461282772491n,
        end_time_unix_nano: 1749996461365717111n,
        attributes: {
          'mlflow.spanOutputs': '2',
          'mlflow.spanType': '"LLM"',
          'mlflow.spanInputs': '{"x": 1}',
          'mlflow.traceRequestId': '"tr-ad9a3d0c8c2cfba776b5e8c80970f883"',
          'mlflow.spanFunctionName': '"f"'
        },
        status: {
          message: '',
          code: 'STATUS_CODE_OK'
        },
        events: []
      };

      // Convert to JSON string and parse with json-bigint to get proper bigints
      const jsonString = JSONBig.stringify(expectedSpanData);
      const parsedData = JSONBig.parse(jsonString) as SerializedSpan;

      // Test fromJson can handle this format
      const span = Span.fromJson(parsedData);

      // Validate key properties
      expect(span.traceId).toBe('tr-ad9a3d0c8c2cfba776b5e8c80970f883');
      expect(span.spanId).toBe('0ce0f6aa367a66b5');
      expect(span.name).toBe('python');
      expect(span.spanType).toBe(SpanType.LLM);
      expect(convertHrTimeToNanoSeconds(span.startTime)).toBe(1749996461282772491n);
      expect(convertHrTimeToNanoSeconds(span.endTime!)).toBe(1749996461365717111n);
      expect(span.parentId).toBeNull();
      expect(span.status.statusCode).toBe(SpanStatusCode.OK);
      expect(span.status.description).toBe('');
      expect(span.inputs).toStrictEqual({ x: 1 });
      expect(span.outputs).toBe(2);
      expect(span.events).toEqual([]);
    });

    it('should handle round-trip JSON serialization correctly', () => {
      const traceId = 'tr-test-round-trip';
      const span = tracer.startSpan('round-trip-test');

      try {
        const mlflowSpan = createMlflowSpan(span, traceId, SpanType.CHAIN) as LiveSpan;

        // Set comprehensive test data
        mlflowSpan.setInputs({ input: 'test', number: 42 });
        mlflowSpan.setOutputs({ result: 'success', count: 100 });
        mlflowSpan.setAttribute('custom.attribute', 'custom_value');
        mlflowSpan.setAttribute('numeric.attribute', 123);
        mlflowSpan.setStatus(SpanStatusCode.OK);
      } finally {
        span.end();
      }

      // Round-trip test: span -> JSON -> span -> JSON
      const originalSpan = createMlflowSpan(span, traceId);
      const originalJson = originalSpan.toJson();

      // Create new span from JSON
      const reconstructedSpan = Span.fromJson(originalJson);

      // Key properties should match
      expect(reconstructedSpan.name).toBe(originalSpan.name);
      expect(reconstructedSpan.parentId).toBe(originalSpan.parentId);
      expect(reconstructedSpan.startTime).toEqual(originalSpan.startTime);
      expect(reconstructedSpan.endTime).toEqual(originalSpan.endTime);

      // Attributes should be preserved
      expect(reconstructedSpan.attributes).toEqual(originalSpan.attributes);

      // Status should be preserved
      expect(reconstructedSpan.status.statusCode).toBe(originalSpan.status.statusCode);

      // Events should be preserved
      expect(reconstructedSpan.events).toEqual(originalSpan.events);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: span_event.test.ts]---
Location: mlflow-master/libs/typescript/core/tests/core/entities/span_event.test.ts

```typescript
import { SpanEvent } from '../../../src/core/entities/span_event';

describe('SpanEvent', () => {
  describe('constructor', () => {
    it('should create a span event with all parameters', () => {
      const timestamp = BigInt(Date.now()) * 1_000_000n; // nanoseconds
      const attributes = {
        key1: 'value1',
        key2: 42,
        key3: true,
        key4: ['a', 'b', 'c']
      };

      const event = new SpanEvent({
        name: 'test_event',
        timestamp,
        attributes
      });

      expect(event.name).toBe('test_event');
      expect(event.timestamp).toBe(timestamp);
      expect(event.attributes).toEqual(attributes);
    });
  });

  describe('fromException', () => {
    it('should create a span event from a basic error', () => {
      const error = new Error('Test error message');
      const event = SpanEvent.fromException(error);

      expect(event.name).toBe('exception');
      expect(event.attributes['exception.message']).toBe('Test error message');
      expect(event.attributes['exception.type']).toBe('Error');
      expect(event.attributes['exception.stacktrace']).toContain('Test error message');
    });
  });

  describe('toJson round-trip serialization', () => {
    it('should serialize and maintain all properties', () => {
      const originalEvent = new SpanEvent({
        name: 'test_event',
        timestamp: 1234567890000n,
        attributes: {
          string_attr: 'test_value',
          number_attr: 42,
          boolean_attr: true,
          string_array: ['a', 'b', 'c'],
          number_array: [1, 2, 3],
          boolean_array: [true, false, true]
        }
      });

      const json = originalEvent.toJson();

      // Verify JSON structure
      expect(json).toEqual({
        name: 'test_event',
        timestamp: 1234567890000n,
        attributes: {
          string_attr: 'test_value',
          number_attr: 42,
          boolean_attr: true,
          string_array: ['a', 'b', 'c'],
          number_array: [1, 2, 3],
          boolean_array: [true, false, true]
        }
      });

      // Create new event from JSON data
      const recreatedEvent = new SpanEvent({
        name: json.name as string,
        timestamp: json.timestamp as bigint,
        attributes: json.attributes as Record<string, any>
      });

      // Verify round-trip preservation
      expect(recreatedEvent.name).toBe(originalEvent.name);
      expect(recreatedEvent.timestamp).toBe(originalEvent.timestamp);
      expect(recreatedEvent.attributes).toEqual(originalEvent.attributes);
      expect(recreatedEvent.toJson()).toEqual(originalEvent.toJson());
    });

    it('should handle events with minimal properties', () => {
      const originalEvent = new SpanEvent({
        name: 'minimal_event'
      });

      const json = originalEvent.toJson();

      expect(json.name).toBe('minimal_event');
      expect(json.timestamp).toBeGreaterThan(0);
      expect(json.attributes).toEqual({});

      // Recreate and verify
      const recreatedEvent = new SpanEvent({
        name: json.name as string,
        timestamp: json.timestamp as bigint,
        attributes: json.attributes as Record<string, any>
      });

      expect(recreatedEvent.name).toBe(originalEvent.name);
      expect(recreatedEvent.timestamp).toBe(originalEvent.timestamp);
      expect(recreatedEvent.attributes).toEqual(originalEvent.attributes);
    });
  });
});
```

--------------------------------------------------------------------------------

````

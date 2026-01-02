---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 578
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 578 of 991)

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

---[FILE: TraceUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/TraceUtils.ts

```typescript
import { MlflowService } from '../sdk/MlflowService';
import {
  type ModelTrace,
  type ModelTraceSpan,
  type ModelTraceSpanV2,
  type ModelTraceSpanV3,
  type ModelTraceInfoV3,
  type Assessment,
  type ExpectationAssessment,
} from '@databricks/web-shared/model-trace-explorer';
import {
  getSpansLocation,
  TRACKING_STORE_SPANS_LOCATION,
} from '../../shared/web-shared/genai-traces-table/utils/TraceUtils';
import { getExperimentTraceV3 } from '../../shared/web-shared/model-trace-explorer/api';

/**
 * Fetches trace information and data for a given trace ID.
 *
 * @param traceId - The ID of the trace to fetch
 * @returns Promise resolving to ModelTrace object or undefined if trace cannot be fetched
 */
export async function getTrace(traceId?: string, traceInfo?: ModelTrace['info']): Promise<ModelTrace | undefined> {
  if (!traceId) {
    return undefined;
  }

  // Check spans location tag to decide the source of span data
  // If spans are in the tracking store, use V3 get-trace (allow_partial=true)
  // Otherwise, fall back to artifact route. Currently, tracking store tag is
  // only set when the backend is OSS SQLAlchemyStore.
  if (getSpansLocation(traceInfo as ModelTraceInfoV3) === TRACKING_STORE_SPANS_LOCATION) {
    const traceResp = await getExperimentTraceV3({ traceId });
    if (traceResp?.trace && traceResp.trace.data) {
      return {
        info: traceResp.trace.trace_info || {},
        data: traceResp.trace.data,
      };
    }
  }
  const [traceInfoResponse, traceData] = await Promise.all([
    MlflowService.getExperimentTraceInfoV3(traceId),
    MlflowService.getExperimentTraceData(traceId),
  ]);

  return traceData
    ? {
        info: traceInfoResponse?.trace?.trace_info || {},
        data: traceData,
      }
    : undefined;
}

/**
 * Fetches trace information and data for a given trace ID using the legacy API.
 *
 * @param requestId - The ID of the request to fetch
 * @returns Promise resolving to ModelTrace object or undefined if trace cannot be fetched
 */
export async function getTraceLegacy(requestId?: string): Promise<ModelTrace | undefined> {
  if (!requestId) {
    return undefined;
  }

  const [traceInfo, traceData] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MlflowService.getExperimentTraceInfo(requestId!).then((response) => response.trace_info || {}),
    // get-trace-artifact is only currently supported in mlflow 2.0 apis
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MlflowService.getExperimentTraceData(requestId!),
  ]);
  return traceData
    ? {
        info: traceInfo,
        data: traceData,
      }
    : undefined;
}

export function isRootSpan(span: ModelTraceSpan): boolean {
  // Check if it's V3 format (has trace_id and span_id fields)
  if ('trace_id' in span && 'span_id' in span) {
    const v3Span = span as ModelTraceSpanV3;
    return !v3Span.parent_span_id;
  }

  // V2 format (has context field)
  const v2Span = span as ModelTraceSpanV2;
  return !v2Span.parent_span_id && !v2Span.parent_id;
}

export function getRootSpan(trace: ModelTrace): ModelTraceSpan | null {
  const spans = trace.data?.spans || [];
  return spans.find(isRootSpan) || null;
}

/**
 * Converts a value to a string representation
 * If already a string, returns as-is. Otherwise, JSON stringifies it.
 */
function ensureString(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

/**
 * Helper function to extract a field from a span, supporting both V2 and V3 formats.
 * V2 format has direct fields (inputs/outputs), while V3 format uses attributes.
 */
function extractFieldFromSpan(
  rootSpan: ModelTraceSpan,
  v2FieldName: 'inputs' | 'outputs',
  v3AttributeKey: string,
): string | null {
  // V2 format - direct field
  if (v2FieldName in rootSpan) {
    const value = (rootSpan as any)[v2FieldName];
    if (value !== undefined) {
      return ensureString(value);
    }
  }

  // V3 format or V2 with attributes - check attributes
  if (rootSpan.attributes?.[v3AttributeKey] !== undefined) {
    return ensureString(rootSpan.attributes[v3AttributeKey]);
  }

  return null;
}

export function extractInputs(trace: ModelTrace): string | null {
  const rootSpan = getRootSpan(trace);
  if (!rootSpan) return null;

  return extractFieldFromSpan(rootSpan, 'inputs', 'mlflow.spanInputs');
}

export function extractOutputs(trace: ModelTrace): string | null {
  const rootSpan = getRootSpan(trace);
  if (!rootSpan) return null;

  return extractFieldFromSpan(rootSpan, 'outputs', 'mlflow.spanOutputs');
}

function isExpectationAssessment(assessment: Assessment): assessment is ExpectationAssessment {
  return 'expectation' in assessment;
}

function extractExpectationValue(expectation: ExpectationAssessment['expectation']): any {
  if ('value' in expectation) {
    return expectation.value;
  }

  if ('serialized_value' in expectation && expectation.serialized_value) {
    try {
      return JSON.parse(expectation.serialized_value.value);
    } catch {
      return expectation.serialized_value.value;
    }
  }

  return null;
}

export function extractExpectations(trace: ModelTrace): Record<string, any> {
  const result: Record<string, any> = {};

  // Check if info is ModelTraceInfoV3 (has assessments)
  const info = trace.info as ModelTraceInfoV3;
  if (!info.assessments || !Array.isArray(info.assessments)) {
    return result;
  }

  // Filter and process assessments
  info.assessments.forEach((assessment: Assessment) => {
    // Only process expectation assessments (not feedback)
    if (!isExpectationAssessment(assessment)) {
      return;
    }

    // Skip invalid assessments
    if (assessment.valid === false) {
      return;
    }

    // Only include HUMAN source type
    if (assessment.source?.source_type !== 'HUMAN') {
      return;
    }

    // Extract the expectation value
    const value = extractExpectationValue(assessment.expectation);
    if (value !== undefined && value !== null) {
      result[assessment.assessment_name] = value;
    }
  });

  return result;
}

/**
 * Single document retrieved from a retrieval span
 */
export interface RetrievedDocument {
  doc_uri: string;
  content: string;
}

/**
 * Retrieval context from a single retrieval span
 */
export interface RetrievalContext {
  span_id: string;
  span_name: string;
  documents: Array<RetrievedDocument>;
}

/**
 * All retrieval contexts for a trace (chat assessments API format)
 * Contains retrieval contexts from all top-level retrieval spans
 */
export interface TraceRetrievalContexts {
  retrieved_documents: Array<RetrievalContext>;
}

/**
 * Check if a span is a retrieval span
 */
function isRetrievalSpan(span: ModelTraceSpan): boolean {
  // V3 format
  if ('trace_id' in span && 'span_id' in span) {
    const v3Span = span as ModelTraceSpanV3;
    let spanType = v3Span.attributes?.['mlflow.spanType'];

    // Handle JSON-encoded string values (e.g., '"RETRIEVER"' -> 'RETRIEVER')
    if (typeof spanType === 'string' && spanType.startsWith('"') && spanType.endsWith('"')) {
      try {
        spanType = JSON.parse(spanType);
      } catch {
        // If parsing fails, use as-is
      }
    }

    return spanType === 'RETRIEVER';
  }

  // V2 format
  const v2Span = span as ModelTraceSpanV2;
  let spanType = v2Span.span_type;

  // Handle JSON-encoded string values (e.g., '"RETRIEVER"' -> 'RETRIEVER')
  if (typeof spanType === 'string' && spanType.startsWith('"') && spanType.endsWith('"')) {
    try {
      spanType = JSON.parse(spanType);
    } catch {
      // If parsing fails, use as-is
    }
  }

  return spanType === 'RETRIEVER';
}

/**
 * Helper to find a span by its ID
 */
function findSpanById(spans: ModelTraceSpan[], spanId: string): ModelTraceSpan | undefined {
  return spans.find((s) => {
    if ('span_id' in s) {
      return (s as ModelTraceSpanV3).span_id === spanId;
    }
    return (s as ModelTraceSpanV2).context.span_id === spanId;
  });
}

/**
 * Get top-level retrieval spans from a trace
 * Top-level retrieval spans are retrieval spans that are not children of other retrieval spans
 *
 * For example, given the following spans:
 * - Span A (Chain)
 *   - Span B (Retriever)
 *     - Span C (Retriever)
 *   - Span D (Retriever)
 *     - Span E (LLM)
 *       - Span F (Retriever)
 * Span B and Span D are top-level retrieval spans.
 * Span C and Span F are NOT top-level retrieval spans because they are children of other retrieval spans.
 *
 * Based on mlflow/genai/utils/trace_utils.py::_get_top_level_retrieval_spans
 */
function getTopLevelRetrievalSpans(trace: ModelTrace): ModelTraceSpan[] {
  const spans = trace.data?.spans || [];
  if (spans.length === 0) {
    return [];
  }

  // Get all retrieval spans
  const retrievalSpans = spans.filter(isRetrievalSpan);
  if (retrievalSpans.length === 0) {
    return [];
  }

  // Build a map of retrieval span IDs for quick lookup
  const retrievalSpanIds = new Set<string>();
  for (const span of retrievalSpans) {
    const spanId = 'span_id' in span ? (span as ModelTraceSpanV3).span_id : (span as ModelTraceSpanV2).context.span_id;
    if (spanId) {
      retrievalSpanIds.add(spanId);
    }
  }

  // Filter to only top-level retrieval spans
  const topLevelSpans: ModelTraceSpan[] = [];

  for (const span of retrievalSpans) {
    let isTopLevel = true;

    // Get initial parent ID based on span format
    let currentParentId: string | null | undefined;
    if ('trace_id' in span && 'span_id' in span) {
      currentParentId = (span as ModelTraceSpanV3).parent_span_id;
    } else {
      const v2Span = span as ModelTraceSpanV2;
      currentParentId = v2Span.parent_span_id || v2Span.parent_id;
    }

    // Check if any ancestor is a retrieval span
    while (currentParentId) {
      if (retrievalSpanIds.has(currentParentId)) {
        isTopLevel = false;
        break;
      }

      // Find parent span to continue traversing (inlined to avoid closure issues)
      let parentSpan: ModelTraceSpan | undefined;
      for (const s of spans) {
        const sId = 'span_id' in s ? (s as ModelTraceSpanV3).span_id : (s as ModelTraceSpanV2).context.span_id;
        if (sId === currentParentId) {
          parentSpan = s;
          break;
        }
      }

      if (!parentSpan) {
        break;
      }

      // Get next parent ID
      if ('trace_id' in parentSpan && 'span_id' in parentSpan) {
        currentParentId = (parentSpan as ModelTraceSpanV3).parent_span_id;
      } else {
        const v2Parent = parentSpan as ModelTraceSpanV2;
        currentParentId = v2Parent.parent_span_id || v2Parent.parent_id;
      }
    }

    if (isTopLevel) {
      topLevelSpans.push(span);
    }
  }

  return topLevelSpans;
}

/**
 * Extract retrieval contexts from a trace
 * Returns retrieval contexts from all top-level retrieval spans
 */
export function extractRetrievalContext(trace: ModelTrace): TraceRetrievalContexts | null {
  const topLevelRetrievalSpans = getTopLevelRetrievalSpans(trace);
  if (topLevelRetrievalSpans.length === 0) {
    return null;
  }

  // Extract documents from each top-level retrieval span
  const retrievalResults: Array<RetrievalContext> = [];

  for (const retrievalSpan of topLevelRetrievalSpans) {
    let retrievedDocuments: Array<RetrievedDocument> = [];
    let spanId: string = '';
    let spanName: string = '';

    // V3 format
    if ('trace_id' in retrievalSpan && 'span_id' in retrievalSpan) {
      const v3Span = retrievalSpan as ModelTraceSpanV3;
      spanId = v3Span.span_id || '';
      spanName = v3Span.name || spanId;
      let outputs = v3Span.attributes?.['mlflow.spanOutputs'];

      // Handle JSON-encoded outputs (parse if it's a string)
      if (typeof outputs === 'string') {
        try {
          outputs = JSON.parse(outputs);
        } catch {
          // If parsing fails, skip this span
          continue;
        }
      }

      // Extract retrieved documents from outputs
      if (outputs && typeof outputs === 'object' && Array.isArray(outputs)) {
        retrievedDocuments = outputs.map((item: any) => ({
          doc_uri: item.doc_uri || item.uri || item.metadata?.doc_uri || '',
          content: item.content || item.page_content || '',
        }));
      }
    } else {
      // V2 format
      const v2Span = retrievalSpan as ModelTraceSpanV2;
      spanId = v2Span.context?.span_id || '';
      spanName = v2Span.name || spanId;

      // Extract retrieved documents from outputs
      if (v2Span.outputs && Array.isArray(v2Span.outputs)) {
        retrievedDocuments = v2Span.outputs.map((item: any) => ({
          doc_uri: item.doc_uri || item.uri || '',
          content: item.content || item.page_content || '',
        }));
      }
    }

    // Add this span's result
    if (retrievedDocuments.length > 0) {
      retrievalResults.push({ span_id: spanId, span_name: spanName, documents: retrievedDocuments });
    }
  }

  // Return null if we couldn't extract any documents
  if (retrievalResults.length === 0) {
    return null;
  }

  return {
    retrieved_documents: retrievalResults,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: Fixtures.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/test-utils/Fixtures.ts

```typescript
import type { ExperimentEntity, RunInfoEntity } from '../../types';

const createExperiment = ({
  experimentId = '0',
  name = 'Default',
  artifactLocation = 'dbfs:/databricks/mlflow/0',
  lifecycleStage = 'active',
  tags = [],
  allowedActions = [],
} = {}): ExperimentEntity => ({
  experimentId,
  name,
  artifactLocation,
  lifecycleStage,
  tags,
  allowedActions,
  creationTime: 0,
  lastUpdateTime: 0,
});

const createRunInfo = (): RunInfoEntity => {
  return {
    runUuid: '0',
    experimentId: '0',
    artifactUri: '',
    endTime: 0,
    status: 'RUNNING',
    lifecycleStage: '',
    runName: '',
    startTime: 0,
  };
};

const fixtures = {
  createExperiment,
  createRunInfo,
  experiments: [createExperiment(), createExperiment({ experimentId: '1', name: 'Test' })],
};

export default fixtures;
```

--------------------------------------------------------------------------------

---[FILE: ReduxStoreFixtures.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/test-utils/ReduxStoreFixtures.ts

```typescript
export const mockExperiment = (eid: string, name: string) => {
  return { experimentId: eid, name: name, allowedActions: [] };
};

export const mockRunInfo = (
  run_id: string,
  experiment_id = undefined,
  artifact_uri = undefined,
  lifecycle_stage = undefined,
) => {
  return {
    runUuid: run_id,
    experimentId: experiment_id,
    artifactUri: artifact_uri,
    lifecycleStage: lifecycle_stage,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: api.test.ts]---
Location: mlflow-master/mlflow/server/js/src/gateway/api.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { setupServer } from '../common/utils/setup-msw';
import { NotFoundError } from '@databricks/web-shared/errors';
import { rest } from 'msw';
import { GatewayApi } from './api';

describe('GatewayApi', () => {
  const server = setupServer();

  describe('Provider Metadata', () => {
    it('should properly return error when listProviders API responds with bare status', async () => {
      server.use(
        rest.get('/ajax-api/3.0/mlflow/endpoints/supported-providers', (req, res, ctx) => res(ctx.status(404))),
      );

      const expectedMessage = new NotFoundError({}).message;

      await expect(GatewayApi.listProviders()).rejects.toThrow(expectedMessage);
    });

    it('should properly return error with message extracted from listModels API', async () => {
      server.use(
        rest.get('/ajax-api/3.0/mlflow/endpoints/supported-models', (req, res, ctx) =>
          res(
            ctx.status(500),
            ctx.json({
              code: 'INTERNAL_ERROR',
              message: 'Failed to fetch models',
            }),
          ),
        ),
      );

      await expect(GatewayApi.listModels()).rejects.toThrow('Failed to fetch models');
    });
  });

  describe('Secrets Management', () => {
    it('should properly return error when createSecret API fails', async () => {
      server.use(
        rest.post('/ajax-api/3.0/mlflow/secrets/create', (req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({
              code: 'INVALID_PARAMETER_VALUE',
              message: 'Secret name already exists',
            }),
          ),
        ),
      );

      await expect(
        GatewayApi.createSecret({
          secret_name: 'duplicate-secret',
          secret_value: 'test-value',
        }),
      ).rejects.toThrow('Secret name already exists');
    });

    it('should properly return error when listSecrets API responds with bare status', async () => {
      server.use(rest.get('/ajax-api/3.0/mlflow/secrets/list', (req, res, ctx) => res(ctx.status(403))));

      await expect(GatewayApi.listSecrets()).rejects.toThrow();
    });
  });

  describe('Endpoints Management', () => {
    it('should properly return error when createEndpoint API fails', async () => {
      server.use(
        rest.post('/ajax-api/3.0/mlflow/endpoints/create', (req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({
              code: 'INVALID_PARAMETER_VALUE',
              message: 'At least one model definition is required',
            }),
          ),
        ),
      );

      await expect(
        GatewayApi.createEndpoint({
          name: 'test-endpoint',
          model_definition_ids: [],
        }),
      ).rejects.toThrow('At least one model definition is required');
    });

    it('should properly return error when listEndpoints API responds with bare status', async () => {
      server.use(rest.get('/ajax-api/3.0/mlflow/endpoints/list', (req, res, ctx) => res(ctx.status(500))));

      await expect(GatewayApi.listEndpoints()).rejects.toThrow();
    });
  });

  describe('Model Definitions Management', () => {
    it('should properly return error when createModelDefinition API fails', async () => {
      server.use(
        rest.post('/ajax-api/3.0/mlflow/model-definitions/create', (req, res, ctx) =>
          res(
            ctx.status(400),
            ctx.json({
              code: 'INVALID_PARAMETER_VALUE',
              message: 'Model definition name already exists',
            }),
          ),
        ),
      );

      await expect(
        GatewayApi.createModelDefinition({
          name: 'duplicate-model',
          secret_id: 'secret-123',
          provider: 'openai',
          model_name: 'gpt-4',
        }),
      ).rejects.toThrow('Model definition name already exists');
    });

    it('should properly return error when listModelDefinitions API responds with bare status', async () => {
      server.use(rest.get('/ajax-api/3.0/mlflow/model-definitions/list', (req, res, ctx) => res(ctx.status(500))));

      await expect(GatewayApi.listModelDefinitions()).rejects.toThrow();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: mlflow-master/mlflow/server/js/src/gateway/api.ts

```typescript
import { matchPredefinedError, UnknownError } from '@databricks/web-shared/errors';
import { fetchEndpoint } from '../common/utils/FetchUtils';
import type {
  ProvidersResponse,
  ModelsResponse,
  ProviderConfig,
  CreateSecretRequest,
  CreateSecretResponse,
  GetSecretResponse,
  UpdateSecretRequest,
  UpdateSecretResponse,
  ListSecretsResponse,
  CreateEndpointRequest,
  CreateEndpointResponse,
  GetEndpointResponse,
  UpdateEndpointRequest,
  UpdateEndpointResponse,
  ListEndpointsResponse,
  CreateModelDefinitionRequest,
  CreateModelDefinitionResponse,
  GetModelDefinitionResponse,
  ListModelDefinitionsResponse,
  UpdateModelDefinitionRequest,
  UpdateModelDefinitionResponse,
  AttachModelToEndpointRequest,
  AttachModelToEndpointResponse,
  DetachModelFromEndpointRequest,
  CreateEndpointBindingRequest,
  CreateEndpointBindingResponse,
  ListEndpointBindingsResponse,
} from './types';

const defaultErrorHandler = async ({
  reject,
  response,
  err: originalError,
}: {
  reject: (cause: any) => void;
  response: Response;
  err: Error;
}) => {
  const predefinedError = matchPredefinedError(response);
  const error = predefinedError instanceof UnknownError ? originalError : predefinedError;
  if (response) {
    try {
      const messageFromResponse = (await response.json())?.message;
      if (messageFromResponse) {
        error.message = messageFromResponse;
      }
    } catch {
      // Keep original error message if extraction fails
    }
  }

  reject(error);
};

export const GatewayApi = {
  // Provider Metadata
  listProviders: () => {
    const relativeUrl = 'ajax-api/3.0/mlflow/endpoints/supported-providers';
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<ProvidersResponse>;
  },

  listModels: (provider?: string) => {
    const params = new URLSearchParams();
    if (provider) {
      params.append('provider', provider);
    }
    const relativeUrl = ['ajax-api/3.0/mlflow/endpoints/supported-models', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<ModelsResponse>;
  },

  getProviderConfig: (provider: string) => {
    const params = new URLSearchParams();
    params.append('provider', provider);
    const relativeUrl = ['ajax-api/3.0/mlflow/endpoints/provider-config', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<ProviderConfig>;
  },

  // Secrets Management
  createSecret: (request: CreateSecretRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/secrets/create',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<CreateSecretResponse>;
  },

  getSecret: (secretId: string) => {
    const params = new URLSearchParams();
    params.append('secret_id', secretId);
    const relativeUrl = ['ajax-api/3.0/mlflow/secrets/get', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<GetSecretResponse>;
  },

  updateSecret: (request: UpdateSecretRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/secrets/update',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<UpdateSecretResponse>;
  },

  deleteSecret: (secretId: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/secrets/delete',
      method: 'DELETE',
      body: JSON.stringify({ secret_id: secretId }),
      error: defaultErrorHandler,
    });
  },

  listSecrets: (provider?: string) => {
    const params = new URLSearchParams();
    if (provider) {
      params.append('provider', provider);
    }
    const relativeUrl = ['ajax-api/3.0/mlflow/secrets/list', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<ListSecretsResponse>;
  },

  // Endpoints Management
  createEndpoint: (request: CreateEndpointRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/create',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<CreateEndpointResponse>;
  },

  getEndpoint: (endpointId: string) => {
    const params = new URLSearchParams();
    params.append('endpoint_id', endpointId);
    const relativeUrl = ['ajax-api/3.0/mlflow/endpoints/get', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<GetEndpointResponse>;
  },

  updateEndpoint: (request: UpdateEndpointRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/update',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<UpdateEndpointResponse>;
  },

  deleteEndpoint: (endpointId: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/delete',
      method: 'DELETE',
      body: JSON.stringify({ endpoint_id: endpointId }),
      error: defaultErrorHandler,
    });
  },

  listEndpoints: (provider?: string) => {
    const params = new URLSearchParams();
    if (provider) {
      params.append('provider', provider);
    }
    const relativeUrl = ['ajax-api/3.0/mlflow/endpoints/list', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<ListEndpointsResponse>;
  },

  // Model Definitions Management
  createModelDefinition: (request: CreateModelDefinitionRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/model-definitions/create',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<CreateModelDefinitionResponse>;
  },

  getModelDefinition: (modelDefinitionId: string) => {
    const params = new URLSearchParams();
    params.append('model_definition_id', modelDefinitionId);
    const relativeUrl = ['ajax-api/3.0/mlflow/model-definitions/get', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<GetModelDefinitionResponse>;
  },

  listModelDefinitions: () => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/model-definitions/list',
      error: defaultErrorHandler,
    }) as Promise<ListModelDefinitionsResponse>;
  },

  updateModelDefinition: (request: UpdateModelDefinitionRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/model-definitions/update',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<UpdateModelDefinitionResponse>;
  },

  deleteModelDefinition: (modelDefinitionId: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/model-definitions/delete',
      method: 'DELETE',
      body: JSON.stringify({ model_definition_id: modelDefinitionId }),
      error: defaultErrorHandler,
    });
  },

  // Attach/Detach Models to Endpoints
  attachModelToEndpoint: (request: AttachModelToEndpointRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/models/attach',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<AttachModelToEndpointResponse>;
  },

  detachModelFromEndpoint: (request: DetachModelFromEndpointRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/models/detach',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    });
  },

  // Endpoint Bindings Management
  createEndpointBinding: (request: CreateEndpointBindingRequest) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/bindings/create',
      method: 'POST',
      body: JSON.stringify(request),
      error: defaultErrorHandler,
    }) as Promise<CreateEndpointBindingResponse>;
  },

  deleteEndpointBinding: (bindingId: string) => {
    return fetchEndpoint({
      relativeUrl: 'ajax-api/3.0/mlflow/endpoints/bindings/delete',
      method: 'DELETE',
      body: JSON.stringify({ binding_id: bindingId }),
      error: defaultErrorHandler,
    });
  },

  listEndpointBindings: (endpointId?: string, experimentId?: string) => {
    const params = new URLSearchParams();
    if (endpointId) {
      params.append('endpoint_id', endpointId);
    }
    if (experimentId) {
      params.append('experiment_id', experimentId);
    }
    const relativeUrl = ['ajax-api/3.0/mlflow/endpoints/bindings/list', params.toString()].join('?');
    return fetchEndpoint({
      relativeUrl,
      error: defaultErrorHandler,
    }) as Promise<ListEndpointBindingsResponse>;
  },
};
```

--------------------------------------------------------------------------------

---[FILE: route-defs.ts]---
Location: mlflow-master/mlflow/server/js/src/gateway/route-defs.ts

```typescript
import { createLazyRouteElement } from '../common/utils/RoutingUtils';
import { GatewayPageId, GatewayRoutePaths } from './routes';

export const getGatewayRouteDefs = () => {
  return [
    {
      path: GatewayRoutePaths.gatewayPage,
      element: createLazyRouteElement(() => import('./pages/GatewayPage')),
      pageId: GatewayPageId.gatewayPage,
    },
  ];
};
```

--------------------------------------------------------------------------------

---[FILE: routes.ts]---
Location: mlflow-master/mlflow/server/js/src/gateway/routes.ts

```typescript
import { createMLflowRoutePath, generatePath } from '../common/utils/RoutingUtils';

export enum GatewayPageId {
  gatewayPage = 'mlflow.gateway',
}

export class GatewayRoutePaths {
  static get gatewayPage() {
    return createMLflowRoutePath('/gateway');
  }
}

class GatewayRoutes {
  static get gatewayPageRoute() {
    return GatewayRoutePaths.gatewayPage;
  }
}

export default GatewayRoutes;
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/gateway/types.ts

```typescript
export interface Provider {
  name: string;
}

export interface Model {
  model: string;
  provider: string;
  supports_function_calling: boolean;
}

export interface SecretField {
  name: string;
  type: string;
  description?: string;
  required: boolean;
}

export interface ConfigField {
  name: string;
  type: string;
  description?: string;
  required: boolean;
}

export interface AuthMode {
  mode: string;
  display_name: string;
  description?: string;
  secret_fields: SecretField[];
  config_fields: ConfigField[];
}

export interface ProviderConfig {
  auth_modes: AuthMode[];
  default_mode: string;
}

export interface ProvidersResponse {
  providers: string[];
}

export interface ModelsResponse {
  models: Model[];
}

export interface Secret {
  secret_id: string;
  secret_name: string;
  provider?: string;
  auth_config?: Record<string, any>;
  created_at: number;
  updated_at: number;
  created_by?: string;
  updated_by?: string;
}

export interface CreateSecretRequest {
  secret_name: string;
  secret_value: string;
  provider?: string;
  auth_config_json?: string;
  created_by?: string;
}

export interface CreateSecretResponse {
  secret: Secret;
}

export interface GetSecretResponse {
  secret: Secret;
}

export interface UpdateSecretRequest {
  secret_id: string;
  secret_value: string;
  auth_config_json?: string;
  updated_by?: string;
}

export interface UpdateSecretResponse {
  secret: Secret;
}

export interface ListSecretsResponse {
  secrets: Secret[];
}

export interface ModelDefinition {
  model_definition_id: string;
  name: string;
  secret_id: string;
  secret_name: string;
  provider: string;
  model_name: string;
  created_at: number;
  last_updated_at: number;
  created_by?: string;
  last_updated_by?: string;
  endpoint_count: number;
}

export interface EndpointModelMapping {
  mapping_id: string;
  endpoint_id: string;
  model_definition_id: string;
  model_definition?: ModelDefinition;
  weight: number;
  created_at: number;
  created_by?: string;
}

export interface Endpoint {
  endpoint_id: string;
  name: string;
  model_mappings: EndpointModelMapping[];
  created_at: number;
  last_updated_at: number;
  created_by?: string;
  last_updated_by?: string;
}

export interface CreateEndpointRequest {
  name?: string;
  model_definition_ids: string[];
  created_by?: string;
}

export interface CreateEndpointResponse {
  endpoint: Endpoint;
}

export interface GetEndpointResponse {
  endpoint: Endpoint;
}

export interface UpdateEndpointRequest {
  endpoint_id: string;
  name?: string;
  updated_by?: string;
}

export interface UpdateEndpointResponse {
  endpoint: Endpoint;
}

export interface ListEndpointsResponse {
  endpoints: Endpoint[];
}

// Model Definition CRUD
export interface CreateModelDefinitionRequest {
  name: string;
  secret_id: string;
  provider: string;
  model_name: string;
  created_by?: string;
}

export interface CreateModelDefinitionResponse {
  model_definition: ModelDefinition;
}

export interface GetModelDefinitionResponse {
  model_definition: ModelDefinition;
}

export interface ListModelDefinitionsResponse {
  model_definitions: ModelDefinition[];
}

export interface UpdateModelDefinitionRequest {
  model_definition_id: string;
  name?: string;
  secret_id?: string;
  provider?: string;
  model_name?: string;
  last_updated_by?: string;
}

export interface UpdateModelDefinitionResponse {
  model_definition: ModelDefinition;
}

// Attach/Detach Model to Endpoint
export interface AttachModelToEndpointRequest {
  endpoint_id: string;
  model_definition_id: string;
  weight?: number;
  created_by?: string;
}

export interface AttachModelToEndpointResponse {
  mapping: EndpointModelMapping;
}

export interface DetachModelFromEndpointRequest {
  endpoint_id: string;
  model_definition_id: string;
}

export interface EndpointBinding {
  binding_id: string;
  endpoint_id: string;
  experiment_id: string;
  created_at: number;
}

export interface CreateEndpointBindingRequest {
  endpoint_id: string;
  experiment_id: string;
}

export interface CreateEndpointBindingResponse {
  binding: EndpointBinding;
}

export interface ListEndpointBindingsResponse {
  bindings: EndpointBinding[];
}
```

--------------------------------------------------------------------------------

---[FILE: useModelsQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/gateway/hooks/useModelsQuery.tsx

```typescript
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { GatewayApi } from '../api';
import type { ModelsResponse } from '../types';

const queryFn = ({ queryKey }: QueryFunctionContext<ModelsQueryKey>) => {
  const [, { provider }] = queryKey;
  return GatewayApi.listModels(provider);
};

type ModelsQueryKey = ['gateway_models', { provider?: string }];

export const useModelsQuery = ({ provider }: { provider?: string } = {}) => {
  const queryResult = useQuery<ModelsResponse, Error, ModelsResponse, ModelsQueryKey>(
    ['gateway_models', { provider }],
    {
      queryFn,
      retry: false,
      enabled: provider !== undefined,
    },
  );

  return {
    data: queryResult.data?.models,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useProviderConfigQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/gateway/hooks/useProviderConfigQuery.tsx

```typescript
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { GatewayApi } from '../api';
import type { ProviderConfig } from '../types';

const queryFn = ({ queryKey }: QueryFunctionContext<ProviderConfigQueryKey>) => {
  const [, { provider }] = queryKey;
  return GatewayApi.getProviderConfig(provider);
};

type ProviderConfigQueryKey = ['gateway_provider_config', { provider: string }];

export const useProviderConfigQuery = ({ provider }: { provider: string }) => {
  const queryResult = useQuery<ProviderConfig, Error, ProviderConfig, ProviderConfigQueryKey>(
    ['gateway_provider_config', { provider }],
    {
      queryFn,
      retry: false,
      enabled: Boolean(provider),
    },
  );

  return {
    data: queryResult.data,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useProvidersQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/gateway/hooks/useProvidersQuery.tsx

```typescript
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { GatewayApi } from '../api';
import type { ProvidersResponse } from '../types';

const queryFn = () => {
  return GatewayApi.listProviders();
};

type ProvidersQueryKey = ['gateway_providers'];

export const useProvidersQuery = () => {
  const queryResult = useQuery<ProvidersResponse, Error, ProvidersResponse, ProvidersQueryKey>(['gateway_providers'], {
    queryFn,
    retry: false,
  });

  return {
    data: queryResult.data?.providers,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: GatewayPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/gateway/pages/GatewayPage.tsx

```typescript
import { ScrollablePageWrapper } from '@mlflow/mlflow/src/common/components/ScrollablePageWrapper';
import { useProvidersQuery } from '../hooks/useProvidersQuery';
import { Alert, Header, Spacer, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';

const GatewayPage = () => {
  const { theme } = useDesignSystemTheme();
  const { data, error, isLoading } = useProvidersQuery();

  return (
    <ScrollablePageWrapper css={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Spacer shrinks={false} />
      <Header
        title={
          <FormattedMessage defaultMessage="Gateway" description="Header title for the gateway configuration page" />
        }
      />
      <Spacer shrinks={false} />
      <div css={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {error && (
          <>
            <Alert type="error" message={error.message} componentId="mlflow.gateway.error" closable={false} />
            <Spacer />
          </>
        )}
        {isLoading && (
          <div css={{ padding: theme.spacing.md }}>
            <FormattedMessage defaultMessage="Loading providers..." description="Loading message for providers list" />
          </div>
        )}
        {data && !isLoading && (
          <div css={{ padding: theme.spacing.md }}>
            <h3>
              <FormattedMessage defaultMessage="Available Providers" description="Title for providers list" />
            </h3>
            <Spacer size="sm" />
            <ul css={{ listStyle: 'none', padding: 0 }}>
              {data.map((provider) => (
                <li key={provider} css={{ padding: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                  {provider}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ScrollablePageWrapper>
  );
};

export default withErrorBoundary(ErrorUtils.mlflowServices.EXPERIMENTS, GatewayPage);
```

--------------------------------------------------------------------------------

````

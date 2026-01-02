---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 574
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 574 of 991)

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

---[FILE: MlflowService.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/MlflowService.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

/**
 * DO NOT EDIT!!!
 *
 * @NOTE(dli) 12-21-2016
 *   This file is generated. For now, it is a snapshot of the proto services as of
 *   Aug 1, 2018 3:42:41 PM. We will update the generation pipeline to actually
 *   place these generated objects in the correct location shortly.
 */
import type { ModelTraceInfo, ModelTraceData } from '@databricks/web-shared/model-trace-explorer';
import { type ParsedQs, stringify as queryStringStringify } from 'qs';
import {
  defaultResponseParser,
  deleteJson,
  fetchEndpoint,
  getBigIntJson,
  getJson,
  HTTPMethods,
  patchJson,
  postBigIntJson,
  postJson,
} from '../../common/utils/FetchUtils';
import type { RunInfoEntity } from '../types';
import {
  transformGetExperimentResponse,
  transformGetRunResponse,
  transformSearchExperimentsResponse,
  transformSearchRunsResponse,
} from './FieldNameTransformers';

type CreateRunApiRequest = {
  experiment_id: string;
  start_time?: number;
  tags?: any;
  run_name?: string;
};

type GetCredentialsForLoggedModelArtifactReadResult = {
  credentials: {
    credential_info: {
      type: string;
      signed_uri: string;
      path: string;
    };
  }[];
};

const searchRunsPath = () => 'ajax-api/2.0/mlflow/runs/search';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class MlflowService {
  /**
   * Create a mlflow experiment
   */
  static createExperiment = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/create', data });

  /**
   * Delete a mlflow experiment
   */
  static deleteExperiment = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/delete', data });

  /**
   * Update a mlflow experiment
   */
  static updateExperiment = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/update', data });

  /**
   * Search mlflow experiments
   */
  static searchExperiments = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/search', data }).then(
      transformSearchExperimentsResponse,
    );

  /**
   * Get mlflow experiment
   */
  static getExperiment = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/get', data }).then(transformGetExperimentResponse);

  /**
   * Get mlflow experiment by name
   */
  static getExperimentByName = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/get-by-name', data }).then(
      transformGetExperimentResponse,
    );

  /**
   * Create a mlflow experiment run
   */
  static createRun = (data: CreateRunApiRequest) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/create', data }) as Promise<{
      run: { info: RunInfoEntity };
    }>;

  /**
   * Delete a mlflow experiment run
   */
  static deleteRun = (data: { run_id: string }) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/delete', data });

  /**
   * Search datasets used in experiments
   */
  static searchDatasets = (data: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/search-datasets', data });

  /**
   * Restore a mlflow experiment run
   */
  static restoreRun = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/restore', data });

  /**
   * Update a mlflow experiment run
   */
  static updateRun = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/update', data });

  /**
   * Log mlflow experiment run metric
   */
  static logMetric = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/log-metric', data });

  /**
   * Log mlflow experiment run parameter
   */
  static logParam = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/log-parameter', data });

  /**
   * Get mlflow experiment run
   */
  static getRun = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/get', data }).then(transformGetRunResponse);

  /**
   * Search mlflow experiment runs
   */
  static searchRuns = (data: any) =>
    postJson({ relativeUrl: searchRunsPath(), data }).then(transformSearchRunsResponse);

  /**
   * List model artifacts
   */
  static listArtifacts = (data: any) => getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/artifacts/list', data });

  /**
   * List model artifacts for logged models
   */
  static listArtifactsLoggedModel = ({ loggedModelId, path }: { loggedModelId: string; path: string }) =>
    getBigIntJson({
      relativeUrl: `ajax-api/2.0/mlflow/logged-models/${loggedModelId}/artifacts/directories`,
      data: path ? { artifact_directory_path: path } : {},
    });

  static getCredentialsForLoggedModelArtifactRead = ({
    loggedModelId,
    path,
  }: {
    loggedModelId: string;
    path: string;
  }) =>
    postBigIntJson({
      relativeUrl: `ajax-api/2.0/mlflow/logged-models/${loggedModelId}/artifacts/credentials-for-download`,
      data: {
        paths: [path],
      },
    }) as Promise<GetCredentialsForLoggedModelArtifactReadResult>;

  /**
   * Get metric history
   */
  static getMetricHistory = (data: any) =>
    getBigIntJson({ relativeUrl: 'ajax-api/2.0/mlflow/metrics/get-history', data });

  /**
   * Set mlflow experiment run tag
   */
  static setTag = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/set-tag', data });

  /**
   * Delete mlflow experiment run tag
   */
  static deleteTag = (data: any) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/delete-tag', data });

  /**
   * Set mlflow experiment tag
   */
  static setExperimentTag = (data: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/set-experiment-tag', data });

  /**
   * Delete mlflow experiment tag
   */
  static deleteExperimentTag = (data: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/experiments/delete-experiment-tag', data });

  /**
   * Create prompt engineering run
   */
  static createPromptLabRun = (data: {
    experiment_id: string;
    tags?: { key: string; value: string }[];
    prompt_template: string;
    prompt_parameters: { key: string; value: string }[];
    model_route: string;
    model_parameters: { key: string; value: string | number | undefined }[];
    model_output_parameters: { key: string; value: string | number }[];
    model_output: string;
  }) => postJson({ relativeUrl: 'ajax-api/2.0/mlflow/runs/create-promptlab-run', data });

  /**
   * Proxy post request to gateway server
   */
  static gatewayProxyPost = (data: { gateway_path: string; json_data: any }, error?: any) =>
    postJson({ relativeUrl: 'ajax-api/2.0/mlflow/gateway-proxy', data, error });

  /**
   * Proxy get request to gateway server
   */
  static gatewayProxyGet = (data: { gateway_path: string; json_data?: any }) =>
    getJson({ relativeUrl: 'ajax-api/2.0/mlflow/gateway-proxy', data });

  /**
   * Traces API: get traces list
   */
  static getExperimentTraces = (
    experimentIds: string[],
    orderBy: string,
    pageToken?: string,
    filterString = '',
    maxResults?: number,
  ) => {
    type GetExperimentTracesResponse = {
      traces?: ModelTraceInfo[];
      next_page_token?: string;
      prev_page_token?: string;
    };

    // usually we send array data via POST request, but since this
    // is a GET, we need to treat it specially. we use `qs` to
    // serialize the array into a query string which the backend
    // can handle. this is similar to the approach taken in the
    // GetMetricHistoryBulkInterval API.
    const queryString = queryStringStringify(
      {
        experiment_ids: experimentIds,
        order_by: orderBy,
        page_token: pageToken,
        max_results: maxResults,
        filter: filterString,
      },
      { arrayFormat: 'repeat' },
    );

    return fetchEndpoint({
      relativeUrl: `ajax-api/2.0/mlflow/traces?${queryString}`,
    }) as Promise<GetExperimentTracesResponse>;
  };

  static getExperimentTraceInfo = (requestId: string) => {
    type GetExperimentTraceInfoResponse = {
      trace_info?: ModelTraceInfo;
    };

    return getJson({
      relativeUrl: `ajax-api/2.0/mlflow/traces/${requestId}/info`,
    }) as Promise<GetExperimentTraceInfoResponse>;
  };

  static getExperimentTraceInfoV3 = (requestId: string) => {
    type GetExperimentTraceInfoV3Response = {
      trace?: {
        trace_info?: ModelTraceInfo;
      };
    };

    return getJson({
      relativeUrl: `ajax-api/3.0/mlflow/traces/${requestId}`,
    }) as Promise<GetExperimentTraceInfoV3Response>;
  };

  /**
   * Traces API: get credentials for data download
   */
  static getExperimentTraceData = <T = ModelTraceData>(traceRequestId: string) => {
    return getJson({
      relativeUrl: `ajax-api/2.0/mlflow/get-trace-artifact`,
      data: {
        request_id: traceRequestId,
      },
    }) as Promise<T>;
  };

  /**
   * Traces API: set trace tag
   */
  static setExperimentTraceTag = (traceRequestId: string, key: string, value: string) =>
    patchJson({
      relativeUrl: `ajax-api/2.0/mlflow/traces/${traceRequestId}/tags`,
      data: {
        key,
        value,
      },
    });

  /**
   * Traces API: set trace tag V3
   */
  static setExperimentTraceTagV3 = (traceRequestId: string, key: string, value: string) =>
    patchJson({
      relativeUrl: `ajax-api/3.0/mlflow/traces/${traceRequestId}/tags`,
      data: {
        key,
        value,
      },
    });

  /**
   * Traces API: delete trace tag V3
   */
  static deleteExperimentTraceTagV3 = (traceRequestId: string, key: string) =>
    deleteJson({
      relativeUrl: `ajax-api/3.0/mlflow/traces/${traceRequestId}/tags`,
      data: {
        key,
      },
    });

  /**
   * Traces API: delete trace tag
   */
  static deleteExperimentTraceTag = (traceRequestId: string, key: string) =>
    deleteJson({
      relativeUrl: `ajax-api/2.0/mlflow/traces/${traceRequestId}/tags`,
      data: {
        key,
      },
    });

  static deleteTracesV3 = (experimentId: string, traceRequestIds: string[]) =>
    postJson({
      relativeUrl: `ajax-api/3.0/mlflow/traces/delete-traces`,
      data: {
        experiment_id: experimentId,
        request_ids: traceRequestIds,
      },
    }) as Promise<{ traces_deleted: number }>;

  static deleteTraces = (experimentId: string, traceRequestIds: string[]) =>
    postJson({
      relativeUrl: `ajax-api/2.0/mlflow/traces/delete-traces`,
      data: {
        experiment_id: experimentId,
        request_ids: traceRequestIds,
      },
    }) as Promise<{ traces_deleted: number }>;
}
```

--------------------------------------------------------------------------------

---[FILE: ModelGatewayService.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/ModelGatewayService.test.ts

```typescript
import { jest, describe, afterEach, test, expect, beforeEach } from '@jest/globals';
import { ModelGatewayService } from './ModelGatewayService';
import { ModelGatewayRouteTask } from './MlflowEnums';
import { fetchEndpoint } from '../../common/utils/FetchUtils';
import { MlflowService } from './MlflowService';

jest.mock('../../common/utils/FetchUtils', () => ({
  ...jest.requireActual<typeof import('../../common/utils/FetchUtils')>('../../common/utils/FetchUtils'),
  fetchEndpoint: jest.fn(),
}));

describe('ModelGatewayService', () => {
  beforeEach(() => {
    jest
      .spyOn(MlflowService, 'gatewayProxyPost')
      .mockResolvedValue({ choices: [{ message: { content: 'output text' } }], usage: {} });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Creates a request call to the MLflow deployments model route', async () => {
    const result = await ModelGatewayService.queryModelGatewayRoute(
      {
        name: 'chat_route',
        key: 'mlflow_deployment_endpoint:test-mlflow-deployment-endpoint-chat',
        task: ModelGatewayRouteTask.LLM_V1_CHAT,
        type: 'mlflow_deployment_endpoint',
        mlflowDeployment: {
          endpoint_type: ModelGatewayRouteTask.LLM_V1_CHAT,
          endpoint_url: '/endpoint-url',
          model: {
            name: 'mpt-7b',
            provider: 'mosaic',
          },
          name: 'test-mlflow-deployment-endpoint-chat',
        },
      },
      { inputText: 'input text', parameters: { temperature: 0.5, max_tokens: 50 } },
    );

    expect(MlflowService.gatewayProxyPost).toHaveBeenCalledWith(
      expect.objectContaining({
        gateway_path: 'endpoint-url',
        json_data: { messages: [{ content: 'input text', role: 'user' }], temperature: 0.5, max_tokens: 50 },
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        text: 'output text',
      }),
    );
  });

  test('Throws when task is not supported', async () => {
    try {
      await ModelGatewayService.queryModelGatewayRoute(
        {
          name: 'embeddings_route',
          key: 'mlflow_deployment_endpoint:test-mlflow-deployment-endpoint-embeddings',
          task: ModelGatewayRouteTask.LLM_V1_EMBEDDINGS,
          type: 'mlflow_deployment_endpoint',
          mlflowDeployment: {
            endpoint_type: ModelGatewayRouteTask.LLM_V1_EMBEDDINGS,
            endpoint_url: '/endpoint-url',
            model: {
              name: 'mpt-7b',
              provider: 'mosaic',
            },
            name: 'test-mlflow-deployment-endpoint-embeddings',
          },
        },
        { inputText: 'input text', parameters: { temperature: 0.5, max_tokens: 50 } },
      );
    } catch (e: any) {
      expect(e.message).toMatch(/Unsupported served LLM model task/);
    }
  });

  test('Throws when route type is not supported', async () => {
    try {
      await ModelGatewayService.queryModelGatewayRoute(
        {
          type: 'some-unsupported-type',
          name: 'completions_route',
        } as any,
        { inputText: 'input text', parameters: { temperature: 0.5, max_tokens: 50 } },
      );
    } catch (e: any) {
      expect(e.message).toMatch(/Unknown route type/);
    }
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelGatewayService.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/ModelGatewayService.ts

```typescript
import invariant from 'invariant';
import { getJson } from '../../common/utils/FetchUtils';
import { MlflowService } from './MlflowService';
import { ModelGatewayRouteTask } from './MlflowEnums';
import { GatewayErrorWrapper } from '../utils/LLMGatewayUtils';
import { fetchEndpoint, HTTPMethods } from '../../common/utils/FetchUtils';
import { parseEndpointEvaluationResponse } from '../utils/LLMGatewayUtils';
const DATABRICKS_API_CLIENT_PROMPTLAB = 'PromptLab';

export interface ModelGatewayQueryPayload {
  inputText: string;
  parameters: {
    temperature?: number;
    max_tokens?: number;
    stop?: string[];
  };
}

export interface ModelGatewayResponseMetadata<T extends ModelGatewayRouteTask> {
  mode: string;
  route_type: T;
  total_tokens: number;
  output_tokens: number;
  input_tokens: number;
}

export interface ModelGatewayCompletionsResponseType {
  candidates: {
    text: string;
    metadata: {
      finish_reason: string;
    };
  }[];

  metadata: ModelGatewayResponseMetadata<ModelGatewayRouteTask.LLM_V1_COMPLETIONS>;
}

export interface ModelGatewayChatResponseType {
  candidates: {
    message: { role: string; content: string };
    metadata: {
      finish_reason: string;
    };
  }[];

  metadata: ModelGatewayResponseMetadata<ModelGatewayRouteTask.LLM_V1_CHAT>;
}

export type ModelGatewayResponseType = ModelGatewayCompletionsResponseType | ModelGatewayChatResponseType;

export interface EndpointModelCompletionsResponseType {
  choices: {
    text: string;
    finish_reason: string;
  }[];

  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface EndpointModelChatResponseType {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];

  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export type EndpointModelGatewayResponseType = EndpointModelCompletionsResponseType | EndpointModelChatResponseType;

export interface ModelGatewayModelInfo {
  /**
   * "Original" name of the model (e.g. "gpt-4o-mini")
   */
  name: string;
  /**
   * Name of the model provider (e.g. "OpenAI")
   */
  provider: string;
}

/**
 * Response object for routes. Does not include model credentials.
 */
export interface ModelGatewayRouteLegacy {
  /**
   * User-defined name of the model route
   */
  name: string;
  /**
   * Type of route (e.g., embedding, text generation, etc.)
   */
  route_type: ModelGatewayRouteTask;
  /**
   * Underlying ML model that can be accessed via this route. Could add other types of resources in the future.
   */
  model: ModelGatewayModelInfo;
}

export interface MlflowDeploymentsEndpoint {
  name: string;
  endpoint_type: ModelGatewayRouteTask;
  endpoint_url: string;
  model: ModelGatewayModelInfo;
}

export type ModelGatewayRouteType = 'mlflow_deployment_endpoint';

export interface ModelGatewayRoute {
  type: ModelGatewayRouteType;
  /**
   * Key of the route, the type is always prefix
   */
  key: `${ModelGatewayRouteType}:${string}`;

  name: string;
  /**
   * Type of route (e.g., embedding, text generation, etc.)
   */
  task: ModelGatewayRouteTask;
  /**
   * MLflow deployments URL of the endpoint
   */
  mlflowDeployment?: MlflowDeploymentsEndpoint;
}

export interface SearchMlflowDeploymentsModelRoutesResponse {
  endpoints: MlflowDeploymentsEndpoint[];
}

const gatewayErrorHandler = ({
  reject,
  response,
  err,
}: {
  reject: (reason?: any) => void;
  response: Response;
  err: Error;
}) => {
  if (response) {
    response.text().then((text: any) => reject(new GatewayErrorWrapper(text, response.status)));
  } else if (err) {
    reject(new GatewayErrorWrapper(err, 500));
  }
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class ModelGatewayService {
  static createEvaluationTextPayload(inputText: string, task: ModelGatewayRouteTask) {
    switch (task) {
      case ModelGatewayRouteTask.LLM_V1_COMPLETIONS: {
        return { prompt: inputText };
      }
      case ModelGatewayRouteTask.LLM_V1_CHAT: {
        return { messages: [{ content: inputText, role: 'user' }] };
      }
      case ModelGatewayRouteTask.LLM_V1_EMBEDDINGS: {
        // Should never happen
        throw new Error(`Unsupported served LLM model task "${task}"!`);
      }
      default:
        throw new Error(`Unknown served LLM model task "${task}"!`);
    }
  }

  static queryMLflowDeploymentEndpointRoute = async (
    route: ModelGatewayRoute,
    data: ModelGatewayQueryPayload,
  ): Promise<any> => {
    invariant(route.mlflowDeployment, 'Trying to call a MLflow deployment route without a deployment_url');
    const { inputText } = data;
    const textPayload = ModelGatewayService.createEvaluationTextPayload(inputText, route.task);
    const processed_data = {
      ...textPayload,
      ...data.parameters,
    };

    return MlflowService.gatewayProxyPost({
      gateway_path: route.mlflowDeployment.endpoint_url.substring(1),
      json_data: processed_data,
    }) as Promise<ModelGatewayResponseType>;
  };

  static queryModelGatewayRoute = async (route: ModelGatewayRoute, payload: ModelGatewayQueryPayload) => {
    if (route.type === 'mlflow_deployment_endpoint') {
      invariant(route.mlflowDeployment, 'Trying to call a serving endpoint route without an endpoint');
      const result = await this.queryMLflowDeploymentEndpointRoute(route, payload);
      return parseEndpointEvaluationResponse(result, route.task);
    }

    throw new Error('Unknown route type');
  };
}
```

--------------------------------------------------------------------------------

---[FILE: SampledMetricHistoryService.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/SampledMetricHistoryService.test.ts

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { fetchEndpoint } from '../../common/utils/FetchUtils';
import { createChartAxisRangeKey } from '../components/runs-charts/components/RunsCharts.common';
import type { SampledMetricsByRunUuidState } from '../types';
import { getSampledMetricHistoryBulkAction } from './SampledMetricHistoryService';

jest.mock('../../common/utils/FetchUtils', () => ({
  fetchEndpoint: jest.fn(),
}));

const testRange: [number, number] = [300, 500];
const testRangeKey = createChartAxisRangeKey(testRange);

describe('getSampledMetricHistoryBulkAction service function', () => {
  const testDispatch = jest.fn();
  beforeEach(() => {
    testDispatch.mockClear();
    jest.mocked(fetchEndpoint).mockClear();
  });
  const runAction = (state: SampledMetricsByRunUuidState) => {
    const actionCreator = getSampledMetricHistoryBulkAction(['run_1', 'run_2'], 'metric_key', undefined, testRange);
    // @ts-expect-error Argument of type 'Mock<UnknownFunction>' is not assignable to parameter of type 'ThunkDispatch<ReduxState, any>'
    actionCreator(testDispatch, () => ({ entities: { sampledMetricsByRunUuid: state } } as any));
  };
  it('should be able to retrieve sampled metric history for all runs', () => {
    runAction({});
    expect(fetchEndpoint).toHaveBeenCalledWith({
      relativeUrl: expect.stringMatching(
        /get-history-bulk-interval\?run_ids=run_1&run_ids=run_2&metric_key=metric_key/,
      ),
    });
  });

  it('should skip retrieval of sampled metric history for runs with the data already loaded', () => {
    runAction({
      run_1: { metric_key: { [testRangeKey]: { metricsHistory: [], loading: false } } },
    });
    expect(fetchEndpoint).toHaveBeenCalledWith({
      relativeUrl: expect.stringMatching(/get-history-bulk-interval\?run_ids=run_2&metric_key=metric_key/),
    });
  });
  it('should skip retrieval of sampled metric history for runs with error reported', () => {
    runAction({
      run_2: { metric_key: { [testRangeKey]: { error: true, loading: false } } },
    });
    expect(fetchEndpoint).toHaveBeenCalledWith({
      relativeUrl: expect.stringMatching(/get-history-bulk-interval\?run_ids=run_1&metric_key=metric_key/),
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SampledMetricHistoryService.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/sdk/SampledMetricHistoryService.ts
Signals: Redux/RTK

```typescript
import { difference } from 'lodash';
import { getUUID } from '../../common/utils/ActionUtils';
import { fetchEndpoint, jsonBigIntResponseParser } from '../../common/utils/FetchUtils';
import type { AsyncAction, ReduxState, ThunkDispatch } from '../../redux-types';
import { createChartAxisRangeKey } from '../components/runs-charts/components/RunsCharts.common';
import type { MetricEntity } from '../types';
import { type ParsedQs, stringify as queryStringStringify } from 'qs';
import { EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL } from '../utils/MetricsUtils';

interface GetHistoryBulkIntervalResponseType {
  metrics: (MetricEntity & { run_id: string })[];
}

export const GET_SAMPLED_METRIC_HISTORY_API_BULK = 'GET_SAMPLED_METRIC_HISTORY_API_BULK';
export interface GetSampledMetricHistoryBulkAction
  extends AsyncAction<
    GetHistoryBulkIntervalResponseType,
    {
      id?: string;
      isRefreshing?: boolean;
      runUuids: string[];
      key: string;
      rangeKey: string;
      maxResults?: number;
    }
  > {
  type: 'GET_SAMPLED_METRIC_HISTORY_API_BULK';
}

export const getSampledMetricHistoryBulkAction =
  (
    runUuids: string[],
    metricKey: string,
    maxResults?: number,
    range?: [number | string, number | string],
    /**
     * Refresh mode.
     * If set to `all`, disregard cache and always fetch data for all run UUIDs.
     * If set to  `auto`, fetch data for run UUIDs that the data is considered stale.
     * If unset, fetch data for run UUIDs that we don't have data for.
     */
    refreshMode: 'all' | 'auto' | undefined = undefined,
  ) =>
  (dispatch: ThunkDispatch, getState: () => ReduxState) => {
    const rangeKey = createChartAxisRangeKey(range);
    const getExistingDataForRunUuid = (runUuid: string) =>
      getState().entities.sampledMetricsByRunUuid[runUuid]?.[metricKey];

    const skippedRunUuids = runUuids.filter((runUuid) => {
      // If refresh mode is set to `all`, no runs are skipped
      if (refreshMode === 'all') {
        return false;
      }
      const sampledHistoryEntry = getExistingDataForRunUuid(runUuid)?.[rangeKey];

      // If refresh mode is set to `auto`, skip runs that are fresh or are being loaded
      if (refreshMode === 'auto') {
        const timePassedSinceLastUpdate = Date.now() - (sampledHistoryEntry?.lastUpdatedTime || 0);
        const isFresh = timePassedSinceLastUpdate < EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL;
        const isInitialized = Boolean(sampledHistoryEntry?.lastUpdatedTime);
        const isLoadingOrRefreshing = sampledHistoryEntry?.loading || sampledHistoryEntry?.refreshing;

        // Skip loading data for runs that
        // - were not initialized before
        // - have fresh data
        // - are being loaded already
        return !isInitialized || isFresh || isLoadingOrRefreshing;
      }

      // If refresh mode is unset, skip runs that we already have data for
      return sampledHistoryEntry?.error || sampledHistoryEntry?.loading || sampledHistoryEntry?.metricsHistory;
    });

    const runUuidsToFetch = difference(runUuids, skippedRunUuids);

    if (!runUuidsToFetch.length || !decodeURIComponent(metricKey)) {
      return Promise.resolve();
    }

    // Prepare query params
    const queryParamsInput: ParsedQs = {
      run_ids: runUuidsToFetch,
      metric_key: decodeURIComponent(metricKey),
      max_results: maxResults?.toString(),
    };

    // Add range to query string if specified
    if (range) {
      const [start_step, end_step] = range;
      queryParamsInput['start_step'] = start_step.toString();
      queryParamsInput['end_step'] = end_step.toString();
    }

    // We are not using MlflowService because this endpoint requires
    // special query string treatment
    const queryParams = queryStringStringify(
      queryParamsInput,
      // This configures qs to stringify arrays as ?run_ids=123&run_ids=234
      { arrayFormat: 'repeat' },
    );

    const request = fetchEndpoint({
      relativeUrl: `ajax-api/2.0/mlflow/metrics/get-history-bulk-interval?${queryParams}`,
      success: jsonBigIntResponseParser,
    });

    return dispatch({
      type: GET_SAMPLED_METRIC_HISTORY_API_BULK,
      payload: request,
      meta: {
        id: getUUID(),
        runUuids: runUuidsToFetch,
        key: metricKey,
        rangeKey,
        maxResults,
        isRefreshing: Boolean(refreshMode),
      },
    });
  };
```

--------------------------------------------------------------------------------

---[FILE: ArtifactUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/ArtifactUtils.test.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { test, expect } from '@jest/globals';
import { ArtifactNode } from './ArtifactUtils';

const getTestArtifactNode = () => {
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const rootNode = new ArtifactNode(true, undefined);
  rootNode.isLoaded = true;
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const dir1 = new ArtifactNode(false, { path: 'dir1', is_dir: true });
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const file1 = new ArtifactNode(false, { path: 'file1', is_dir: false, file_size: '159' });
  rootNode.children = { dir1, file1 };
  return rootNode;
};

test('deepCopy works properly', () => {
  const rootNode = getTestArtifactNode();
  const copiedNode = rootNode.deepCopy();
  // Checks equality of all members.
  expect(rootNode).toEqual(copiedNode);
  expect(rootNode).not.toBe(copiedNode);
});
```

--------------------------------------------------------------------------------

---[FILE: ArtifactUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/ArtifactUtils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { MLFLOW_LOGGED_ARTIFACTS_TAG } from '../constants';
import { RunLoggedArtifactType, type RunLoggedArtifactsDeclaration } from '../types';
import type { KeyValueEntity } from '../../common/types';

export class ArtifactNode {
  children: any;
  fileInfo: any;
  isLoaded: any;
  isRoot: any;
  constructor(isRoot: any, fileInfo: any, children: any) {
    this.isRoot = isRoot;
    this.isLoaded = false;
    // fileInfo should not be defined for the root node.
    this.fileInfo = fileInfo;
    // map of basename to ArtifactNode
    this.children = children;
  }

  deepCopy() {
    const node = new ArtifactNode(this.isRoot, this.fileInfo, undefined);
    node.isLoaded = this.isLoaded;
    if (this.children) {
      const copiedChildren = {};
      Object.keys(this.children).forEach((name) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        copiedChildren[name] = this.children[name].deepCopy();
      });
      node.children = copiedChildren;
    }
    return node;
  }

  setChildren(fileInfos: any) {
    if (fileInfos) {
      this.children = {};
      this.isLoaded = true;
      fileInfos.forEach((fileInfo: any) => {
        // basename is the last part of the path for this fileInfo.
        const pathParts = fileInfo.path.split('/');
        const basename = pathParts[pathParts.length - 1];
        let children;
        if (fileInfo.is_dir) {
          children = [];
        }
        this.children[basename] = new ArtifactNode(false, fileInfo, children);
      });
    } else {
      this.isLoaded = true;
    }
  }

  static findChild(node: any, path: any) {
    // Filter out empty strings caused by spurious instances of slash, i.e.
    // "model/" instead of just "model"
    const parts = path.split('/').filter((item: any) => item);
    let ret = node;
    parts.forEach((part: any) => {
      if (ret.children && ret.children[part] !== undefined) {
        ret = ret.children[part];
      } else {
        throw new Error("Can't find child.");
      }
    });
    return ret;
  }

  static isEmpty(node: any) {
    return node.children === undefined || Object.keys(node.children).length === 0;
  }
}

/**
 * Extracts the list of tables logged in the run from the run tags.
 */
export const extractLoggedTablesFromRunTags = (runTags: Record<string, KeyValueEntity>) => {
  const rawLoggedArtifactsDeclaration = runTags?.[MLFLOW_LOGGED_ARTIFACTS_TAG]?.value;
  const tablesInRun: Set<string> = new Set();
  if (rawLoggedArtifactsDeclaration) {
    try {
      const loggedArtifacts: RunLoggedArtifactsDeclaration = JSON.parse(rawLoggedArtifactsDeclaration);

      loggedArtifacts
        .filter(({ type }) => type === RunLoggedArtifactType.TABLE)
        .forEach(({ path }) => {
          tablesInRun.add(path);
        });
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new SyntaxError(`The "${MLFLOW_LOGGED_ARTIFACTS_TAG}" tag is malformed!`);
      }
      throw error;
    }
  }
  return Array.from(tablesInRun);
};
```

--------------------------------------------------------------------------------

---[FILE: CsvUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/CsvUtils.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { chartDataToCsv, chartMetricHistoryToCsv, runInfosToCsv } from './CsvUtils';

const createFakePayload = (n = 3): any => {
  const runNames = new Array(n).fill('').map((_, index) => `run-${index + 1}`);
  return {
    runInfos: runNames.map((name, index) => ({
      runUuid: `uuid-for-${name}`,
      experimentId: '123',
      runName: name,
      status: 'FINISHED',
      startTime: 1669896000000 + index * 60000, // 2022-12-01 12:00:00Z + 1 minute per run index
      endTime: 1669896001000 + index * 60000, // 2022-12-01 12:00:01Z + 1 minute per run index
    })),
    paramKeyList: ['param_1', 'param_2'],
    metricKeyList: ['metric_1', 'metric_2'],
    tagKeyList: ['tag_1'],
    paramsList: runNames.map((name) => [
      { key: 'param_1', value: `param_1_for_${name}` },
      { key: 'param_2', value: `param_2_for_${name}` },
    ]),
    tagsList: runNames.map((name) => ({
      tag_1: { key: 'tag_1', value: `tag_1_for_${name}` },
    })),
    metricsList: runNames.map((_, index) => [
      { key: 'metric_1', value: (index + 1) * 10 + 1 }, // run 1 will get 11, run two will get 21 etc.
      { key: 'metric_2', value: (index + 1) * 10 + 2 }, // run 1 will get 12, run two will get 22 etc.
    ]),
  };
};

describe('CsvUtils', () => {
  it('generates proper number of runs', () => {
    const resultCsv = runInfosToCsv(createFakePayload(10));
    expect(resultCsv.trim().split('\n').length).toEqual(11); // One header line and 10 data lines
  });

  it('generates empty set for empty run list', () => {
    const resultCsv = runInfosToCsv(createFakePayload(0));

    // Assert that it's just the header and nothing else
    expect(resultCsv.trim()).toEqual(
      '"Start Time","Duration","Run ID","Name","Source Type","Source Name","User","Status","param_1","param_2","metric_1","metric_2","tag_1"',
    );
  });

  it('generates valid header and data', () => {
    const resultCsv = runInfosToCsv(createFakePayload(3));
    const csvStrings = resultCsv.trim().split('\n');

    const run1csv = csvStrings[1].split(',');
    const run2csv = csvStrings[2].split(',');
    const run3csv = csvStrings[3].split(',');

    // Assert header contents
    expect(csvStrings[0]).toEqual(
      '"Start Time","Duration","Run ID","Name","Source Type","Source Name","User","Status","param_1","param_2","metric_1","metric_2","tag_1"',
    );

    const PARAM_1_INDEX_POS = 8;
    const PARAM_2_INDEX_POS = 9;
    const METRIC_1_INDEX_POS = 10;
    const METRIC_2_INDEX_POS = 11;
    const TAG_1_INDEX_POS = 12;

    expect(run1csv).toContain('"2022-12-01 12:00:00"');
    expect(run2csv).toContain('"2022-12-01 12:01:00"');
    expect(run3csv).toContain('"2022-12-01 12:02:00"');

    expect(run1csv).toContain('"1.0s"');
    expect(run2csv).toContain('"1.0s"');
    expect(run3csv).toContain('"1.0s"');

    expect(run1csv).toContain('"uuid-for-run-1"');
    expect(run2csv).toContain('"uuid-for-run-2"');
    expect(run3csv).toContain('"uuid-for-run-3"');

    expect(run1csv).toContain('"run-1"');
    expect(run2csv).toContain('"run-2"');
    expect(run3csv).toContain('"run-3"');

    expect(run1csv[PARAM_1_INDEX_POS]).toEqual('"param_1_for_run-1"');
    expect(run2csv[PARAM_1_INDEX_POS]).toEqual('"param_1_for_run-2"');
    expect(run3csv[PARAM_1_INDEX_POS]).toEqual('"param_1_for_run-3"');

    expect(run1csv[PARAM_2_INDEX_POS]).toEqual('"param_2_for_run-1"');
    expect(run2csv[PARAM_2_INDEX_POS]).toEqual('"param_2_for_run-2"');
    expect(run3csv[PARAM_2_INDEX_POS]).toEqual('"param_2_for_run-3"');

    expect(run1csv[METRIC_1_INDEX_POS].toString()).toEqual('"11"');
    expect(run2csv[METRIC_1_INDEX_POS].toString()).toEqual('"21"');
    expect(run3csv[METRIC_1_INDEX_POS].toString()).toEqual('"31"');

    expect(run1csv[METRIC_2_INDEX_POS].toString()).toEqual('"12"');
    expect(run2csv[METRIC_2_INDEX_POS].toString()).toEqual('"22"');
    expect(run3csv[METRIC_2_INDEX_POS].toString()).toEqual('"32"');

    expect(run1csv[TAG_1_INDEX_POS]).toEqual('"tag_1_for_run-1"');
    expect(run2csv[TAG_1_INDEX_POS]).toEqual('"tag_1_for_run-2"');
    expect(run3csv[TAG_1_INDEX_POS]).toEqual('"tag_1_for_run-3"');
  });

  it('generates proper metric history CSV for run traces', () => {
    const traces = [
      {
        displayName: 'Run 1',
        runInfo: { runUuid: 'uuid-1' },
        metricsHistory: {
          metric1: [
            { key: 'metric1', step: 1, timestamp: 1000, value: 10 },
            { key: 'metric1', step: 2, timestamp: 2000, value: 20 },
          ],
          metric2: [
            { key: 'metric2', step: 1, timestamp: 1000, value: 100 },
            { key: 'metric2', step: 2, timestamp: 2000, value: 200 },
          ],
        },
      },
      {
        displayName: 'Run 2',
        runInfo: { runUuid: 'uuid-2' },
        metricsHistory: {
          metric1: [
            { key: 'metric1', step: 1, timestamp: 1000, value: 30 },
            { key: 'metric1', step: 2, timestamp: 2000, value: 40 },
          ],
          metric2: [
            { key: 'metric2', step: 1, timestamp: 1000, value: 300 },
            { key: 'metric2', step: 2, timestamp: 2000, value: 400 },
          ],
        },
      },
    ] as any;

    const metricKeys = ['metric1', 'metric2'];

    const expectedCsv = `"Run","Run ID","metric","step","timestamp","value"
"Run 1","uuid-1","metric1","1","1000","10"
"Run 1","uuid-1","metric1","2","2000","20"
"Run 2","uuid-2","metric1","1","1000","30"
"Run 2","uuid-2","metric1","2","2000","40"
"Run 1","uuid-1","metric2","1","1000","100"
"Run 1","uuid-1","metric2","2","2000","200"
"Run 2","uuid-2","metric2","1","1000","300"
"Run 2","uuid-2","metric2","2","2000","400"`;

    const resultCsv = chartMetricHistoryToCsv(traces, metricKeys);

    expect(resultCsv.trim()).toEqual(expectedCsv);
  });

  it('generates proper CSV for multi-metric and multi-param chart data', () => {
    const traces = [
      {
        displayName: 'Run 1',
        runInfo: { runUuid: 'uuid-1' },
        metrics: {
          metric1: { key: 'metric1', value: 10 },
          metric2: { key: 'metric2', value: 100 },
        },
        params: {
          param1: { key: 'param1', value: 'value1' },
          param2: { key: 'param2', value: 'value2' },
        },
      },
      {
        displayName: 'Run 2',
        runInfo: { runUuid: 'uuid-2' },
        metrics: {
          metric1: { key: 'metric1', value: 20 },
          metric2: { key: 'metric2', value: 200 },
        },
        params: {
          param1: { key: 'param1', value: 'value3' },
          param2: { key: 'param2', value: 'value4' },
        },
      },
    ] as any;

    const metricKeys = ['metric1', 'metric2'];
    const paramKeys = ['param1', 'param2'];

    const expectedCsv = `"Run","Run ID","metric1","metric2","param1","param2"
"Run 1","uuid-1","10","100","value1","value2"
"Run 2","uuid-2","20","200","value3","value4"`;

    const resultCsv = chartDataToCsv(traces, metricKeys, paramKeys);

    expect(resultCsv.trim()).toEqual(expectedCsv);
  });
});
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 542
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 542 of 991)

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

---[FILE: useMonitoringFilters.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/useMonitoringFilters.tsx
Signals: React

```typescript
import { useCallback, useMemo } from 'react';
import { useSearchParams } from '../../common/utils/RoutingUtils';
import { useMonitoringConfig } from './useMonitoringConfig';

export const START_TIME_LABEL_QUERY_PARAM_KEY = 'startTimeLabel';
const START_TIME_QUERY_PARAM_KEY = 'startTime';
const END_TIME_QUERY_PARAM_KEY = 'endTime';

export type START_TIME_LABEL =
  | 'LAST_HOUR'
  | 'LAST_24_HOURS'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_YEAR'
  | 'ALL'
  | 'CUSTOM';
export const DEFAULT_START_TIME_LABEL: START_TIME_LABEL = 'LAST_7_DAYS';

export interface MonitoringFilters {
  startTimeLabel?: START_TIME_LABEL;
  startTime?: string;
  endTime?: string;
}

/**
 * Query param-powered hook that returns the monitoring filters from the URL.
 */
export const useMonitoringFilters = () => {
  const monitoringConfig = useMonitoringConfig();

  const [searchParams, setSearchParams] = useSearchParams();

  const startTimeLabel =
    (searchParams.get(START_TIME_LABEL_QUERY_PARAM_KEY) as START_TIME_LABEL | undefined) || DEFAULT_START_TIME_LABEL;
  let startTime = searchParams.get(START_TIME_QUERY_PARAM_KEY) || undefined;
  let endTime = searchParams.get(END_TIME_QUERY_PARAM_KEY) ?? undefined;
  if (startTimeLabel !== 'CUSTOM') {
    const absoluteStartEndTime = getAbsoluteStartEndTime(monitoringConfig.dateNow, { startTimeLabel });
    startTime = absoluteStartEndTime.startTime;
    endTime = absoluteStartEndTime.endTime;
  } else {
    startTime = searchParams.get(START_TIME_QUERY_PARAM_KEY) || undefined;
    endTime = searchParams.get(END_TIME_QUERY_PARAM_KEY) ?? undefined;
  }

  const monitoringFilters = useMemo<MonitoringFilters>(
    () => ({
      startTimeLabel,
      startTime,
      endTime,
    }),
    [startTimeLabel, startTime, endTime],
  );

  const setMonitoringFilters = useCallback(
    (monitoringFilters: MonitoringFilters | undefined, replace = false) => {
      setSearchParams(
        (params) => {
          if (monitoringFilters?.startTime === undefined) {
            params.delete(START_TIME_QUERY_PARAM_KEY);
          } else if (monitoringFilters.startTimeLabel === 'CUSTOM') {
            params.set(START_TIME_QUERY_PARAM_KEY, monitoringFilters.startTime);
          }
          if (monitoringFilters?.endTime === undefined) {
            params.delete(END_TIME_QUERY_PARAM_KEY);
          } else if (monitoringFilters.startTimeLabel === 'CUSTOM') {
            params.set(END_TIME_QUERY_PARAM_KEY, monitoringFilters.endTime);
          }
          if (monitoringFilters?.startTimeLabel === undefined) {
            params.delete(START_TIME_LABEL_QUERY_PARAM_KEY);
          } else {
            params.set(START_TIME_LABEL_QUERY_PARAM_KEY, monitoringFilters.startTimeLabel);
          }
          return params;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return [monitoringFilters, setMonitoringFilters] as const;
};

export function getAbsoluteStartEndTime(
  dateNow: Date,
  monitoringFilters: MonitoringFilters,
): {
  startTime: string | undefined;
  endTime: string | undefined;
} {
  if (monitoringFilters.startTimeLabel && monitoringFilters.startTimeLabel !== 'CUSTOM') {
    return startTimeLabelToStartEndTime(dateNow, monitoringFilters.startTimeLabel);
  }
  return {
    startTime: monitoringFilters.startTime,
    endTime: monitoringFilters.endTime,
  };
}

export function startTimeLabelToStartEndTime(
  dateNow: Date,
  startTimeLabel: START_TIME_LABEL,
): {
  startTime: string | undefined;
  endTime: string | undefined;
} {
  switch (startTimeLabel) {
    case 'LAST_HOUR':
      return {
        startTime: new Date(new Date(dateNow).setUTCHours(new Date().getUTCHours() - 1)).toISOString(),
        endTime: dateNow.toISOString(),
      };
    case 'LAST_24_HOURS':
      return {
        startTime: new Date(new Date(dateNow).setUTCDate(new Date().getUTCDate() - 1)).toISOString(),
        endTime: dateNow.toISOString(),
      };
    case 'LAST_7_DAYS':
      return {
        startTime: new Date(new Date(dateNow).setUTCDate(new Date().getUTCDate() - 7)).toISOString(),
        endTime: dateNow.toISOString(),
      };
    case 'LAST_30_DAYS':
      return {
        startTime: new Date(new Date(dateNow).setUTCDate(new Date().getUTCDate() - 30)).toISOString(),
        endTime: dateNow.toISOString(),
      };
    case 'LAST_YEAR':
      return {
        startTime: new Date(new Date(dateNow).setUTCFullYear(new Date().getUTCFullYear() - 1)).toISOString(),
        endTime: dateNow.toISOString(),
      };
    case 'ALL':
      return {
        startTime: undefined,
        endTime: dateNow.toISOString(),
      };
    default:
      throw new Error(`Unexpected start time label: ${startTimeLabel}`);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useMonitoringViewState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/useMonitoringViewState.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '../../common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'viewState';

export type MonitoringViewState = 'charts' | 'logs' | 'insights';

/**
 * Query param-powered hook that returns the view state from the URL.
 */
export const useMonitoringViewState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const viewState = (searchParams.get(QUERY_PARAM_KEY) ?? 'logs') as MonitoringViewState;

  const setViewState = useCallback(
    (viewState: MonitoringViewState | undefined, replace = false) => {
      setSearchParams(
        (params) => {
          if (viewState === undefined) {
            params.delete(QUERY_PARAM_KEY);
            return params;
          }
          params.set(QUERY_PARAM_KEY, viewState);
          return params;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return [viewState, setViewState] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useCombinedRunInputsOutputsModels.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useCombinedRunInputsOutputsModels.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { renderHook, waitFor } from '../../../common/utils/TestUtils.react18';
import type {
  UseGetRunQueryResponseInputs,
  UseGetRunQueryResponseOutputs,
} from '../../components/run-page/hooks/useGetRunQuery';
import { useCombinedRunInputsOutputsModels } from './useCombinedRunInputsOutputsModels';
import type { RunInfoEntity } from '../../types';
import { LoggedModelStatusProtoEnum } from '../../types';

describe('useCombinedRunInputsOutputsModels', () => {
  const generateTestModel = (modelId: string) => ({
    info: {
      artifact_uri: `dbfs:/databricks/mlflow/${modelId}`,
      creation_timestamp_ms: 1728322600000,
      last_updated_timestamp_ms: 1728322600000,
      source_run_id: 'run-id-1',
      creator_id: 'test@test.com',
      experiment_id: 'test-experiment',
      model_id: modelId,
      model_type: 'Agent',
      name: `${modelId}-name`,
      tags: [],
      status_message: 'Ready',
      status: LoggedModelStatusProtoEnum.LOGGED_MODEL_READY,
      registrations: [],
    },
    data: {
      metrics: [
        {
          key: 'metric-test',
          value: 10,
          run_id: 'test-run-id',
        },
        {
          key: 'unrelated-metric',
          value: 10,
          run_id: 'unrelated-run-id',
        },
      ],
    },
  });

  const testRunInfo: RunInfoEntity = {
    runUuid: 'test-run-id',
    experimentId: 'experiment-id',
    startTime: 0,
    endTime: 1,
    artifactUri: '',
    lifecycleStage: 'active',
    status: 'FINISHED',
    runName: 'run-name',
  };

  const renderTestHook = (...params: Parameters<typeof useCombinedRunInputsOutputsModels>) =>
    renderHook(() => useCombinedRunInputsOutputsModels(...params));

  it('returns an empty array if no inputs or outputs are provided', () => {
    const { result } = renderTestHook();
    expect(result.current.models).toEqual([]);
  });

  it('returns logged models with direction and filtered metrics', async () => {
    const inputs: UseGetRunQueryResponseInputs = {
      __typename: 'MlflowRunInputs',
      datasetInputs: null,
      modelInputs: [
        { __typename: 'MlflowModelInput', modelId: 'input-model-1' },
        { __typename: 'MlflowModelInput', modelId: 'input-model-2' },
      ],
    };

    const outputs: UseGetRunQueryResponseOutputs = {
      __typename: 'MlflowRunOutputs',
      modelOutputs: [
        { __typename: 'MlflowModelOutput', modelId: 'output-model-1', step: '0' },
        { __typename: 'MlflowModelOutput', modelId: 'output-model-2', step: '0' },
      ],
    };

    const testModels = [
      generateTestModel('input-model-1'),
      generateTestModel('input-model-2'),
      generateTestModel('output-model-1'),
      generateTestModel('output-model-2'),
    ];

    const { result } = renderTestHook(inputs, outputs, testRunInfo, testModels);

    // Wait for models to be fetched
    await waitFor(() => {
      expect(result.current.models.length).toBe(4);
    });

    // Assert IDs
    const loggedModelIds = result.current.models.map((model) => model.info?.model_id);
    expect(loggedModelIds).toContain('input-model-1');
    expect(loggedModelIds).toContain('input-model-2');
    expect(loggedModelIds).toContain('output-model-1');
    expect(loggedModelIds).toContain('output-model-2');

    // Assert proper directions
    expect(result.current.models.find((model) => model.info?.model_id === 'input-model-1')?.direction).toBe('input');
    expect(result.current.models.find((model) => model.info?.model_id === 'input-model-2')?.direction).toBe('input');
    expect(result.current.models.find((model) => model.info?.model_id === 'output-model-1')?.direction).toBe('output');
    expect(result.current.models.find((model) => model.info?.model_id === 'output-model-2')?.direction).toBe('output');

    // Assert that only related metrics are present in the result
    const metrics = result.current.models.find((model) => model.info?.model_id === 'input-model-1')?.data?.metrics;

    expect(metrics?.length).toEqual(1);
    expect(metrics?.map((metric) => metric.key)).toContain('metric-test');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useCombinedRunInputsOutputsModels.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useCombinedRunInputsOutputsModels.tsx
Signals: React

```typescript
import { compact, uniq, uniqBy } from 'lodash';
import { useMemo } from 'react';
import type {
  UseGetRunQueryResponseInputs,
  UseGetRunQueryResponseOutputs,
  UseGetRunQueryResponseRunInfo,
} from '../../components/run-page/hooks/useGetRunQuery';
import type { LoggedModelProto, RunInfoEntity } from '../../types';

type LoggedModelProtoWithRunDirection = LoggedModelProto & { direction: 'input' | 'output'; step?: string };

const filterMetricsByMatchingRunId = (runUuid?: string | null) => (loggedModel: LoggedModelProtoWithRunDirection) => {
  if (loggedModel.data?.metrics) {
    return {
      ...loggedModel,
      data: {
        ...loggedModel.data,
        metrics: loggedModel.data.metrics.filter((metric) => !runUuid || metric.run_id === runUuid),
      },
    };
  }
  return loggedModel;
};

export const useCombinedRunInputsOutputsModels = (
  inputs?: UseGetRunQueryResponseInputs,
  outputs?: UseGetRunQueryResponseOutputs,
  runInfo?: RunInfoEntity | UseGetRunQueryResponseRunInfo,
  loggedModelsV3?: LoggedModelProto[],
) => {
  const inputLoggedModels = useMemo(() => {
    const inputModelIds = compact(uniq(inputs?.modelInputs?.map((modelInput) => modelInput.modelId)));
    return inputModelIds.map<LoggedModelProtoWithRunDirection | undefined>((model_id) => {
      const model = loggedModelsV3?.find((model) => model.info?.model_id === model_id);
      if (!model) return undefined;
      return { ...model, direction: 'input' as const };
    });
  }, [inputs?.modelInputs, loggedModelsV3]);

  const outputLoggedModels = useMemo(() => {
    const outputModelIds = compact(uniq(outputs?.modelOutputs?.map((modelOutput) => modelOutput.modelId)));
    return outputModelIds.map<LoggedModelProtoWithRunDirection | undefined>((model_id) => {
      const model = loggedModelsV3?.find((model) => model.info?.model_id === model_id);

      const correspondingOutputEntry = outputs?.modelOutputs?.find(({ modelId }) => modelId === model?.info?.model_id);

      if (!model) return undefined;
      return { ...model, direction: 'output' as const, step: correspondingOutputEntry?.step ?? undefined };
    });
  }, [outputs?.modelOutputs, loggedModelsV3]);

  const modelsWithDirection = useMemo(() => {
    return (
      uniqBy(
        compact([...inputLoggedModels, ...outputLoggedModels]).map(filterMetricsByMatchingRunId(runInfo?.runUuid)),
        (modelData) => modelData.info?.model_id,
      ) ?? []
    );
  }, [inputLoggedModels, outputLoggedModels, runInfo]);

  return { models: modelsWithDirection };
};
```

--------------------------------------------------------------------------------

---[FILE: useGetLoggedModelQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useGetLoggedModelQuery.tsx
Signals: React

```typescript
import { type QueryFunctionContext, useQuery, useQueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { LoggedModelProto } from '../../types';
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useCallback } from 'react';

type UseGetLoggedModelQueryResponseType = {
  model: LoggedModelProto;
};

type UseGetLoggedModelQueryKey = ['GET_LOGGED_MODEL', string];

const getQueryKey = (loggedModelId: string): UseGetLoggedModelQueryKey => ['GET_LOGGED_MODEL', loggedModelId] as const;

const queryFn = async ({
  queryKey: [, loggedModelId],
}: QueryFunctionContext<UseGetLoggedModelQueryKey>): Promise<UseGetLoggedModelQueryResponseType> =>
  fetchAPI(getAjaxUrl(`ajax-api/2.0/mlflow/logged-models/${loggedModelId}`), 'GET');

/**
 * Retrieve logged model from API based on its ID
 */
export const useGetLoggedModelQuery = ({
  loggedModelId,
  enabled = true,
}: {
  loggedModelId?: string;
  enabled?: boolean;
}) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<
    UseGetLoggedModelQueryResponseType,
    Error,
    UseGetLoggedModelQueryResponseType,
    UseGetLoggedModelQueryKey
  >({
    queryKey: getQueryKey(loggedModelId ?? ''),
    queryFn,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
  });

  return {
    isLoading,
    isFetching,
    data: data?.model,
    refetch,
    error,
  } as const;
};

/**
 * Lazy query function to retrieve logged model from API based on its ID
 */
export const useGetLoggedModelLazyQuery = () => {
  const client = useQueryClient();
  return useCallback(
    (modelId: string) => client.ensureQueryData({ queryKey: getQueryKey(modelId), queryFn }),
    [client],
  );
};

/**
 * A non-hook version of useGetLoggedModelQuery that can be used in async functions.
 * @deprecated Use useGetLoggedModelQuery instead. This function is provided for backward compatibility for legacy class-based components.
 */
export const asyncGetLoggedModel = async (
  loggedModelId: string,
  failSilently = false,
): Promise<UseGetLoggedModelQueryResponseType | undefined> => {
  try {
    const data = await fetchAPI(getAjaxUrl(`ajax-api/2.0/mlflow/logged-models/${loggedModelId}`), 'GET');
    return data;
  } catch (error) {
    if (failSilently) {
      return undefined;
    }
    throw error;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: useGetLoggedModelsQuery.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useGetLoggedModelsQuery.test.tsx

```typescript
import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import { rest } from 'msw';
import { setupServer } from '../../../common/utils/setup-msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetLoggedModelsQuery } from './useGetLoggedModelsQuery';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

describe('useGetLoggedModelsQuery', () => {
  const callSpy = jest.fn();

  setupServer(
    rest.get('/ajax-api/2.0/mlflow/logged-models:batchGet', (req, res, ctx) => {
      // Capture the model_ids from the URL query parameters
      const modelIds = req.url.searchParams.getAll('model_ids');
      callSpy(modelIds);

      return res(
        ctx.json({
          models: modelIds.map((id) => ({
            info: { model_id: id, name: `model-${id}` },
            data: {},
          })),
        }),
      );
    }),
  );

  beforeEach(() => {
    callSpy.mockClear();
  });

  test('should properly construct URL query params with model_ids', async () => {
    const modelIds = ['model-123', 'model-456', 'model-789'];

    const { result } = renderHook(() => useGetLoggedModelsQuery({ modelIds }, {}), {
      wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
    });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the correct model_ids were passed in the URL
    expect(callSpy).toHaveBeenCalledTimes(1);
    expect(callSpy).toHaveBeenCalledWith(modelIds);

    // Verify the returned data matches what we expect
    expect(result.current.data).toHaveLength(3);
    expect(result.current.data?.map((model) => model.info?.model_id)).toEqual(modelIds);
    expect(result.current.data?.map((model) => model.info?.name)).toEqual([
      'model-model-123',
      'model-model-456',
      'model-model-789',
    ]);
  });

  test('should handle empty model IDs array', async () => {
    const { result } = renderHook(() => useGetLoggedModelsQuery({ modelIds: [] }, {}), {
      wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(callSpy).toHaveBeenCalledTimes(0);
    expect(result.current.data).toEqual([]);
  });

  test('should handle undefined model IDs', async () => {
    const { result } = renderHook(() => useGetLoggedModelsQuery({}, {}), {
      wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(callSpy).toHaveBeenCalledTimes(0);
    expect(result.current.data).toEqual([]);
  });

  test('should chunk requests when requesting lot of model IDs', async () => {
    const threeAndHalfHundredModelIds = Array.from({ length: 350 }, (_, i) => `model-${i + 1}`);
    const { result } = renderHook(() => useGetLoggedModelsQuery({ modelIds: threeAndHalfHundredModelIds }, {}), {
      wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(callSpy).toHaveBeenCalledTimes(4);
    expect(callSpy).toHaveBeenCalledWith(threeAndHalfHundredModelIds.slice(0, 100));
    expect(callSpy).toHaveBeenCalledWith(threeAndHalfHundredModelIds.slice(100, 200));
    expect(callSpy).toHaveBeenCalledWith(threeAndHalfHundredModelIds.slice(200, 300));
    expect(callSpy).toHaveBeenCalledWith(threeAndHalfHundredModelIds.slice(300, 400));

    expect(result.current.data).toEqual(
      threeAndHalfHundredModelIds.map((id) => ({
        info: { model_id: id, name: `model-${id}` },
        data: {},
      })),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGetLoggedModelsQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useGetLoggedModelsQuery.tsx

```typescript
import {
  type QueryFunctionContext,
  useQuery,
  type UseQueryOptions,
} from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { LoggedModelProto } from '../../types';
import { chunk } from 'lodash';
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';

const LOGGED_MODEL_BY_ID_BATCH_LIMIT = 100; // API supports batch size of 100

type QueryResult = {
  models?: LoggedModelProto[];
};

type QueryKey = ['GET_LOGGED_MODELS', string[]];

const getQueryKey = (loggedModelIds: string[]): QueryKey => ['GET_LOGGED_MODELS', loggedModelIds] as const;

const queryFn = async ({ queryKey: [, loggedModelIds] }: QueryFunctionContext<QueryKey>): Promise<QueryResult[]> => {
  const modelIdChunks = chunk(loggedModelIds, LOGGED_MODEL_BY_ID_BATCH_LIMIT);
  return Promise.all<QueryResult>(
    modelIdChunks.map((chunkedIds) => {
      const queryParams = new URLSearchParams();
      for (const id of chunkedIds) {
        queryParams.append('model_ids', id);
      }
      return fetchAPI(getAjaxUrl(`ajax-api/2.0/mlflow/logged-models:batchGet?${queryParams.toString()}`), 'GET');
    }),
  );
};

/**
 * Retrieve many logged model from API based on IDs
 */
export const useGetLoggedModelsQuery = (
  {
    modelIds,
  }: {
    modelIds?: string[];
  },
  options: UseQueryOptions<QueryResult[], Error, LoggedModelProto[], QueryKey>,
) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<QueryResult[], Error, LoggedModelProto[], QueryKey>({
    queryKey: getQueryKey(modelIds ?? []),
    queryFn,
    select: (results) => results?.flatMap((result) => result?.models || []),
    retry: false,
    ...options,
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    error,
  } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: usePatchLoggedModelsTags.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/usePatchLoggedModelsTags.tsx

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { entries } from 'lodash';
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';

export const usePatchLoggedModelsTags = ({ loggedModelId }: { loggedModelId?: string }) => {
  const { isLoading, error, mutateAsync } = useMutation<unknown, Error, Record<string, string>>({
    mutationFn: async (variables) => {
      const requestBody = {
        tags: entries(variables).map(([key, value]) => ({ key, value })),
      };

      return fetchAPI(getAjaxUrl(`ajax-api/2.0/mlflow/logged-models/${loggedModelId}/tags`), 'PATCH', requestBody);
    },
  });

  return {
    isLoading,
    error,
    patch: mutateAsync,
  } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useRelatedRunsDataForLoggedModels.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useRelatedRunsDataForLoggedModels.test.tsx

```typescript
import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import { rest } from 'msw';
import { setupServer } from '../../../common/utils/setup-msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useRelatedRunsDataForLoggedModels } from './useRelatedRunsDataForLoggedModels';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

describe('useRelatedRunsDataForLoggedModels', () => {
  const callSpy = jest.fn();
  setupServer(
    rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
      callSpy(req.url.searchParams.get('run_id'));
      return res(
        ctx.json({
          run: {
            info: {
              run_name: `run-name-for-${req.url.searchParams.get('run_id')}`,
              run_id: req.url.searchParams.get('run_id'),
            },
          },
        }),
      );
    }),
  );
  beforeEach(() => {
    callSpy.mockClear();
  });
  test('should properly call for runs data based on metadata found in logged models', async () => {
    const { result } = renderHook(
      () =>
        useRelatedRunsDataForLoggedModels({
          loggedModels: [
            {
              data: {
                metrics: [{ run_id: 'logged-metric-run-id-3' }, { run_id: 'logged-metric-run-id-2' }],
              },
              info: {
                source_run_id: 'source-run-id-1',
                experiment_id: 'experimentId',
              },
            } as any,
            {
              data: {
                metrics: [{ run_id: 'logged-metric-run-id-1' }],
              },
              info: {
                source_run_id: 'source-run-id-100',
                experiment_id: 'experimentId',
              },
            } as any,
          ],
        }),
      {
        wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(callSpy).toHaveBeenCalledTimes(5);

    expect(callSpy).toHaveBeenCalledWith('logged-metric-run-id-1');
    expect(callSpy).toHaveBeenCalledWith('logged-metric-run-id-2');
    expect(callSpy).toHaveBeenCalledWith('logged-metric-run-id-3');
    expect(callSpy).toHaveBeenCalledWith('source-run-id-1');
    expect(callSpy).toHaveBeenCalledWith('source-run-id-100');

    expect(result.current.data.map(({ info: { runName } }) => runName)).toEqual([
      'run-name-for-logged-metric-run-id-1',
      'run-name-for-logged-metric-run-id-2',
      'run-name-for-logged-metric-run-id-3',
      'run-name-for-source-run-id-1',
      'run-name-for-source-run-id-100',
    ]);
  });

  test('should not call for runs data based when not necessary', async () => {
    const { result } = renderHook(
      () =>
        useRelatedRunsDataForLoggedModels({
          loggedModels: [
            {
              data: {},
              info: {
                source_run_id: '',
                experiment_id: 'experimentId',
              },
            } as any,
          ],
        }),
      {
        wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(callSpy).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useRelatedRunsDataForLoggedModels.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useRelatedRunsDataForLoggedModels.tsx
Signals: React

```typescript
import type { LoggedModelProto, RunEntity } from '../../types';
import { useEffect, useMemo } from 'react';
import { compact, sortBy, uniq } from 'lodash';
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQueries } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MlflowService } from '../../sdk/MlflowService';
import { useArrayMemo } from '../../../common/hooks/useArrayMemo';

type UseRegisteredModelRelatedRunNamesQueryKey = ['USE_RELATED_RUNS_DATA_FOR_LOGGED_MODELS', { runUuid: string }];

const getQueryKey = (runUuid: string): UseRegisteredModelRelatedRunNamesQueryKey => [
  'USE_RELATED_RUNS_DATA_FOR_LOGGED_MODELS',
  { runUuid },
];

const queryFn = async ({
  queryKey: [, { runUuid }],
}: QueryFunctionContext<UseRegisteredModelRelatedRunNamesQueryKey>): Promise<RunEntity | null> => {
  try {
    const data = await MlflowService.getRun({ run_id: runUuid });
    return data?.run;
  } catch (e) {
    return null;
  }
};

/**
 * Hook used to fetch necessary run data based on metadata found in logged models
 */
export const useRelatedRunsDataForLoggedModels = ({ loggedModels = [] }: { loggedModels?: LoggedModelProto[] }) => {
  const runUuids = useMemo(() => {
    // Extract all run ids found in metrics and source run ids
    const allMetricRunUuids = compact(
      loggedModels?.flatMap((loggedModel) => loggedModel?.data?.metrics?.map((metric) => metric.run_id)),
    );
    const allSourceRunUuids = compact(loggedModels?.map((loggedModel) => loggedModel?.info?.source_run_id));
    const distinctRunUuids = sortBy(uniq([...allMetricRunUuids, ...allSourceRunUuids]));

    return distinctRunUuids;
  }, [loggedModels]);

  const queryResults = useQueries({
    queries: runUuids.map((runUuid) => ({
      queryKey: getQueryKey(runUuid),
      queryFn,
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    })),
  });

  const loading = queryResults.some(({ isLoading }) => isLoading);
  const error = queryResults.find(({ error }) => error)?.error as Error | undefined;

  const memoizedQueryResults = useArrayMemo(queryResults.map(({ data }) => data));

  const data = useMemo(
    () => memoizedQueryResults.map((data) => data).filter(Boolean) as RunEntity[],
    [memoizedQueryResults],
  );

  return {
    data,
    loading,
    error,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useSearchLoggedModelsQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/hooks/logged-models/useSearchLoggedModelsQuery.tsx
Signals: React

```typescript
import { useInfiniteQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { isEmpty, last, uniqBy } from 'lodash';
import type { LoggedModelMetricDataset, LoggedModelProto } from '../../types';
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useMemo } from 'react';

type UseSearchLoggedModelsQueryResponseType = {
  models: LoggedModelProto[];
  next_page_token?: string;
};

export const useSearchLoggedModelsQuery = (
  {
    experimentIds,
    orderByAsc,
    orderByField,
    searchQuery,
    selectedFilterDatasets,
    orderByDatasetName,
    orderByDatasetDigest,
  }: {
    experimentIds?: string[];
    orderByAsc?: boolean;
    orderByField?: string;
    searchQuery?: string;
    selectedFilterDatasets?: LoggedModelMetricDataset[];
    orderByDatasetName?: string;
    orderByDatasetDigest?: string;
  },
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = {},
) => {
  // Uniquely identify the query by the experiment IDs, order by, filter query and datasets, and order by asc
  const queryKey = [
    'SEARCH_LOGGED_MODELS',
    JSON.stringify(experimentIds),
    orderByField,
    orderByAsc,
    searchQuery,
    JSON.stringify(selectedFilterDatasets),
    orderByDatasetName,
    orderByDatasetDigest,
  ];

  const { data, isLoading, isFetching, fetchNextPage, refetch, error } = useInfiniteQuery<
    UseSearchLoggedModelsQueryResponseType,
    Error
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const requestBody = {
        experiment_ids: experimentIds,
        order_by: [
          {
            field_name: orderByField ?? 'creation_time',
            ascending: orderByAsc ?? false,
            dataset_name: orderByDatasetName,
            dataset_digest: orderByDatasetDigest,
          },
        ],

        page_token: pageParam,
        filter: searchQuery,
        datasets: !isEmpty(selectedFilterDatasets) ? selectedFilterDatasets : undefined,
      };

      return fetchAPI(getAjaxUrl('ajax-api/2.0/mlflow/logged-models/search'), 'POST', requestBody);
    },
    cacheTime: 0,
    getNextPageParam: (lastPage) => lastPage.next_page_token,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
  });

  // Concatenate all the models from all the result pages
  const modelsData = useMemo(() => data?.pages.flatMap((page) => page?.models).filter(Boolean), [data]);

  // The current page token is the one from the last page
  const nextPageToken = last(data?.pages)?.next_page_token;

  return {
    isLoading,
    isFetching,
    data: modelsData,
    nextPageToken,
    refetch,
    error,
    loadMoreResults: fetchNextPage,
  } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentChatSessionsGenericErrorState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/ExperimentChatSessionsGenericErrorState.tsx

```typescript
import { DangerIcon, Empty, PageWrapper } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export const ExperimentChatSessionsGenericErrorState = ({ error }: { error?: Error }) => {
  return (
    <PageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage
            defaultMessage="Error"
            description="Title for error fallback component in the MLflow experiment chat sessions page"
          />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering chat sessions."
              description="Description for default error message in the MLflow experiment chat sessions page"
            />
          )
        }
        image={<DangerIcon />}
      />
    </PageWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentChatSessionsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/ExperimentChatSessionsPage.tsx
Signals: React

```typescript
import { FormattedMessage } from '@databricks/i18n';
import ErrorUtils from '@mlflow/mlflow/src/common/utils/ErrorUtils';
import { withErrorBoundary } from '@mlflow/mlflow/src/common/utils/withErrorBoundary';
import { TracesV3Toolbar } from '../../components/experiment-page/components/traces-v3/TracesV3Toolbar';
import invariant from 'invariant';
import { useParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { useMemo, useState } from 'react';
import {
  CUSTOM_METADATA_COLUMN_ID,
  GenAIChatSessionsTable,
  createTraceLocationForExperiment,
  createTraceLocationForUCSchema,
  useSearchMlflowTraces,
} from '@databricks/web-shared/genai-traces-table';
import { MonitoringConfigProvider, useMonitoringConfig } from '../../hooks/useMonitoringConfig';
import { getAbsoluteStartEndTime, useMonitoringFilters } from '../../hooks/useMonitoringFilters';
import { SESSION_ID_METADATA_KEY, shouldUseTracesV4API } from '@databricks/web-shared/model-trace-explorer';
import { useGetExperimentQuery } from '../../hooks/useExperimentQuery';
import { getChatSessionsFilter } from './utils';
import { ExperimentChatSessionsPageWrapper } from './ExperimentChatSessionsPageWrapper';
import { useGetDeleteTracesAction } from '../../components/experiment-page/components/traces-v3/hooks/useGetDeleteTracesAction';

const ExperimentChatSessionsPageImpl = () => {
  const { experimentId } = useParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  invariant(experimentId, 'Experiment ID must be defined');

  const [monitoringFilters] = useMonitoringFilters();
  const monitoringConfig = useMonitoringConfig();
  const { loading: isLoadingExperiment } = useGetExperimentQuery({
    experimentId,
    options: {
      fetchPolicy: 'cache-only',
    },
  });

  const timeRange = useMemo(() => {
    const { startTime, endTime } = getAbsoluteStartEndTime(monitoringConfig.dateNow, monitoringFilters);
    return {
      startTime: startTime ? new Date(startTime).getTime().toString() : undefined,
      endTime: endTime ? new Date(endTime).getTime().toString() : undefined,
    };
  }, [monitoringConfig.dateNow, monitoringFilters]);

  const traceSearchLocations = useMemo(
    () => {
      return [createTraceLocationForExperiment(experimentId)];
    },
    // prettier-ignore
    [
      experimentId,
    ],
  );

  const filters = useMemo(() => getChatSessionsFilter({ sessionId: null }), []);

  const {
    data: traces,
    isLoading,
    isFetching,
  } = useSearchMlflowTraces({
    locations: traceSearchLocations,
    timeRange,
    filters,
    searchQuery,
    disabled: false,
  });

  const deleteTracesAction = useGetDeleteTracesAction({ traceSearchLocations });

  const traceActions = {
    deleteTracesAction,
  };

  return (
    <div css={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <TracesV3Toolbar
        // prettier-ignore
        viewState="sessions"
      />
      <GenAIChatSessionsTable
        experimentId={experimentId}
        traces={traces ?? []}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        traceActions={traceActions}
      />
    </div>
  );
};

const ExperimentChatSessionsPage = () => {
  return (
    <ExperimentChatSessionsPageWrapper>
      <MonitoringConfigProvider>
        <ExperimentChatSessionsPageImpl />
      </MonitoringConfigProvider>
    </ExperimentChatSessionsPageWrapper>
  );
};

export default ExperimentChatSessionsPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentChatSessionsPageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/ExperimentChatSessionsPageWrapper.tsx

```typescript
import { ErrorBoundary } from 'react-error-boundary';
import { ExperimentChatSessionsGenericErrorState } from './ExperimentChatSessionsGenericErrorState';

export const ExperimentChatSessionsPageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ErrorBoundary fallback={<ExperimentChatSessionsGenericErrorState />}>{children}</ErrorBoundary>;
};
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/utils.tsx

```typescript
import { CUSTOM_METADATA_COLUMN_ID, FilterOperator } from '@databricks/web-shared/genai-traces-table';
import { SESSION_ID_METADATA_KEY } from '@databricks/web-shared/model-trace-explorer';

export const getChatSessionsFilter = ({
  sessionId,
}: {
  // pass null to query all sessions
  sessionId: string | null;
}) => {
  return [
    {
      column: `${CUSTOM_METADATA_COLUMN_ID}:${SESSION_ID_METADATA_KEY}`,
      operator: sessionId ? FilterOperator.EQUALS : FilterOperator.CONTAINS,
      value: sessionId ?? '',
    },
  ];
};
```

--------------------------------------------------------------------------------

````

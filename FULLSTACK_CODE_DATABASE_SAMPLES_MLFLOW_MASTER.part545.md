---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 545
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 545 of 991)

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

---[FILE: useCreateEvaluationDatasetMutation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useCreateEvaluationDatasetMutation.tsx

```typescript
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useMutation, useQueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { EvaluationDataset } from '../types';
import { SEARCH_EVALUATION_DATASETS_QUERY_KEY } from '../constants';

type CreateDatasetResponse = {
  dataset: EvaluationDataset;
};

type CreateDatasetPayload = {
  datasetName: string;
  experimentIds?: string[];
};

export const useCreateEvaluationDatasetMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const { mutate: createEvaluationDatasetMutation, isLoading } = useMutation({
    mutationFn: async ({ datasetName, experimentIds }: CreateDatasetPayload) => {
      const requestBody = {
        name: datasetName,
        experiment_ids: experimentIds,
      };

      const response = (await fetchAPI(
        getAjaxUrl('ajax-api/3.0/mlflow/datasets/create'),
        'POST',
        requestBody,
      )) as CreateDatasetResponse;

      return response.dataset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEARCH_EVALUATION_DATASETS_QUERY_KEY] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    createEvaluationDatasetMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useDeleteEvaluationDatasetMutation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useDeleteEvaluationDatasetMutation.tsx

```typescript
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useMutation, useQueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { SEARCH_EVALUATION_DATASETS_QUERY_KEY } from '../constants';

export const useDeleteEvaluationDatasetMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteEvaluationDatasetMutation, isLoading } = useMutation({
    mutationFn: async ({ datasetId }: { datasetId: string }) => {
      await fetchAPI(getAjaxUrl(`ajax-api/3.0/mlflow/datasets/${datasetId}`), 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEARCH_EVALUATION_DATASETS_QUERY_KEY] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    deleteEvaluationDatasetMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExportTracesToDatasetModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useExportTracesToDatasetModal.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';
import { ExportTracesToDatasetModal } from '../components/ExportTracesToDatasetModal';
import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';

// used to pass the modal from mlflow codebase to genai-traces-table
export const useExportTracesToDatasetModal = ({ experimentId }: { experimentId: string }) => {
  const [visible, setVisible] = useState(false);
  const renderExportTracesToDatasetsModal = useCallback(
    ({ selectedTraceInfos }: { selectedTraceInfos: ModelTraceInfoV3[] }) => (
      <ExportTracesToDatasetModal
        experimentId={experimentId}
        visible={visible}
        setVisible={setVisible}
        selectedTraceInfos={selectedTraceInfos}
      />
    ),
    [experimentId, visible, setVisible],
  );

  return {
    showExportTracesToDatasetsModal: visible,
    setShowExportTracesToDatasetsModal: setVisible,
    renderExportTracesToDatasetsModal,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useFetchTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useFetchTraces.tsx

```typescript
import { useQuery } from '@databricks/web-shared/query-client';
import { getTrace } from '../../../utils/TraceUtils';
import { FETCH_TRACES_QUERY_KEY } from '../constants';
import { chunk } from 'lodash';

const MAX_PARALLEL_REQUESTS = 20;

// TODO: migrate this to the batch get traces API in a shared location when it is available
export const useFetchTraces = ({ traceIds }: { traceIds: string[] }) => {
  return useQuery({
    queryKey: [FETCH_TRACES_QUERY_KEY, traceIds],
    queryFn: async ({ queryKey: [, traceIds] }) => {
      const chunks = chunk(traceIds, MAX_PARALLEL_REQUESTS);

      const results = [];
      for (const chunk of chunks) {
        const traces = await Promise.all(chunk.map((traceId) => getTrace(traceId)));
        results.push(...traces);
      }

      return results;
    },
  });
};
```

--------------------------------------------------------------------------------

---[FILE: useGetDatasetRecords.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useGetDatasetRecords.tsx
Signals: React

```typescript
import { useInfiniteQuery } from '@databricks/web-shared/query-client';
import { fetchAPI, getAjaxUrl, getJson } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useMemo } from 'react';
import { parseJSONSafe } from '@mlflow/mlflow/src/common/utils/TagUtils';
import type { EvaluationDatasetRecord } from '../types';
import { GET_DATASET_RECORDS_QUERY_KEY } from '../constants';

const GET_DATASET_RECORDS_PAGE_SIZE = 50;

type GetDatasetRecordsResponse = {
  // JSON serialized list of dataset records
  records: string;
  next_page_token?: string;
};

export const useGetDatasetRecords = ({ datasetId, enabled = true }: { datasetId: string; enabled?: boolean }) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, refetch, error } = useInfiniteQuery<
    GetDatasetRecordsResponse,
    Error
  >({
    queryKey: [GET_DATASET_RECORDS_QUERY_KEY, datasetId],
    queryFn: async ({ queryKey: [, datasetId], pageParam = undefined }) => {
      const queryParams = new URLSearchParams();
      queryParams.set('dataset_id', datasetId as string);
      queryParams.set('max_results', GET_DATASET_RECORDS_PAGE_SIZE.toString());
      if (pageParam) {
        queryParams.set('page_token', pageParam ?? '');
      }

      return (await fetchAPI(
        getAjaxUrl(`ajax-api/3.0/mlflow/datasets/${datasetId}/records?${queryParams.toString()}`),
        'GET',
      )) as GetDatasetRecordsResponse;
    },
    cacheTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
    getNextPageParam: (lastPage) => lastPage.next_page_token,
  });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => parseJSONSafe(page.records) as EvaluationDatasetRecord[]) ?? [],
    [data],
  );

  return {
    data: flatData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    refetch,
    error,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useInfiniteScrollFetch.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useInfiniteScrollFetch.tsx
Signals: React

```typescript
import { useCallback } from 'react';

const INFINITE_SCROLL_BOTTOM_OFFSET = 200;

/**
 * Util function to fetch next page when user scrolls to the end of a scrollable container
 */
export const useInfiniteScrollFetch = ({
  isFetching,
  hasNextPage,
  fetchNextPage,
}: {
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}) => {
  return useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < INFINITE_SCROLL_BOTTOM_OFFSET && !isFetching && hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, hasNextPage],
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useSearchEvaluationDatasets.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useSearchEvaluationDatasets.tsx
Signals: React

```typescript
import { useInfiniteQuery } from '@databricks/web-shared/query-client';
import type { EvaluationDataset } from '../types';
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useMemo } from 'react';
import { SEARCH_EVALUATION_DATASETS_QUERY_KEY } from '../constants';

const SEARCH_EVALUATION_DATASETS_PAGE_SIZE = 50;

type SearchEvaluationDatasetsResponse = {
  datasets?: EvaluationDataset[];
  next_page_token?: string;
};

export const useSearchEvaluationDatasets = ({
  experimentId,
  enabled = true,
  nameFilter = '',
}: {
  experimentId: string;
  enabled?: boolean;
  nameFilter?: string;
}) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, refetch, error } = useInfiniteQuery<
    SearchEvaluationDatasetsResponse,
    Error
  >({
    queryKey: [SEARCH_EVALUATION_DATASETS_QUERY_KEY, experimentId, nameFilter],
    queryFn: async ({ queryKey: [, experimentId, nameFilter], pageParam = undefined }) => {
      const filterString = nameFilter ? `name ILIKE '%${nameFilter}%'` : undefined;
      const requestBody = {
        experiment_ids: [experimentId],
        filter_string: filterString,
        order_by: ['created_time DESC'],
        max_results: SEARCH_EVALUATION_DATASETS_PAGE_SIZE,
        page_token: pageParam,
      };

      return (await fetchAPI(
        getAjaxUrl('ajax-api/3.0/mlflow/datasets/search'),
        'POST',
        requestBody,
      )) as SearchEvaluationDatasetsResponse;
    },
    cacheTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
    getNextPageParam: (lastPage) => lastPage.next_page_token,
  });

  const flatData = useMemo(() => data?.pages.flatMap((page) => page.datasets ?? []) ?? [], [data]);

  return {
    data: flatData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    refetch,
    error,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useSelectedDatasetBySearchParam.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useSelectedDatasetBySearchParam.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useSelectedDatasetBySearchParam } from './useSelectedDatasetBySearchParam';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

jest.mock('../../../../common/utils/RoutingUtils', () => ({
  useSearchParams: jest.fn(),
}));

describe('useSelectedDatasetBySearchParam', () => {
  let mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = jest.fn((setter) => {
    // @ts-expect-error 'setter' is of type 'unknown'
    mockSearchParams = setter(mockSearchParams);
  });

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    jest.clearAllMocks();
    jest.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  test('should return selectedDatasetIdId from URL', () => {
    jest
      .mocked(useSearchParams)
      .mockReturnValue([new URLSearchParams({ selectedDatasetId: 'dataset-123' }), mockSetSearchParams]);

    const {
      result: {
        current: [resultDatasetId],
      },
    } = renderHook(() => useSelectedDatasetBySearchParam());

    expect(resultDatasetId).toEqual('dataset-123');
  });

  test('should set selectedDatasetIdId in URL', () => {
    const {
      result: {
        current: [, setSelectedDatasetId],
      },
    } = renderHook(() => useSelectedDatasetBySearchParam());

    act(() => {
      setSelectedDatasetId('dataset-456');
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedDatasetId')).toEqual('dataset-456');
  });

  test('should clear selectedDatasetIdId when set to undefined', () => {
    mockSearchParams = new URLSearchParams({ selectedDatasetId: 'dataset-123' });

    const {
      result: {
        current: [, setSelectedDatasetId],
      },
    } = renderHook(() => useSelectedDatasetBySearchParam());

    act(() => {
      setSelectedDatasetId(undefined);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedDatasetId')).toBeNull();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useSelectedDatasetBySearchParam.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useSelectedDatasetBySearchParam.ts
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'selectedDatasetId';

/**
 * Query param-powered hook that returns the selected dataset ID.
 * Used to persist dataset selection in the URL for the datasets tab,
 * enabling shareable URLs.
 */
export const useSelectedDatasetBySearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDatasetId = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setSelectedDatasetId = useCallback(
    (datasetId: string | undefined) => {
      setSearchParams(
        (params) => {
          if (!datasetId) {
            params.delete(QUERY_PARAM_KEY);
            return params;
          }
          params.set(QUERY_PARAM_KEY, datasetId);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearSelectedDatasetId = useCallback(() => {
    setSearchParams(
      (params) => {
        params.delete(QUERY_PARAM_KEY);
        return params;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return [selectedDatasetId, setSelectedDatasetId, clearSelectedDatasetId] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useUpsertDatasetRecordsMutation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useUpsertDatasetRecordsMutation.tsx

```typescript
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';
import { useMutation } from '@databricks/web-shared/query-client';

type UpsertDatasetRecordsPayload = {
  datasetId: string;
  // JSON serialized list of dataset records
  records: string;
};

type UpsertDatasetRecordsResponse = {
  insertedCount: number;
  updatedCount: number;
};

export const useUpsertDatasetRecordsMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const { mutate: upsertDatasetRecordsMutation, isLoading } = useMutation({
    mutationFn: async ({ datasetId, records }: UpsertDatasetRecordsPayload) => {
      const requestBody = {
        dataset_id: datasetId,
        records: records,
      };

      const response = (await fetchAPI(
        getAjaxUrl(`ajax-api/3.0/mlflow/datasets/${datasetId}/records`),
        'POST',
        requestBody,
      )) as UpsertDatasetRecordsResponse;

      return response;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    upsertDatasetRecordsMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: datasetUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/utils/datasetUtils.ts

```typescript
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import {
  getModelTraceId,
  getModelTraceSpanParentId,
  isV3ModelTraceInfo,
  isV3ModelTraceSpan,
  tryDeserializeAttribute,
} from '@databricks/web-shared/model-trace-explorer';
import { compact, isNil } from 'lodash';

// keep this in sync with EvaluationData._process_trace_records
// from the mlflow python SDK
export const extractDatasetInfoFromTraces = (traces: ModelTrace[]) => {
  const rowData = traces.map((trace) => {
    const rootSpan = trace.data.spans.find((span) => !getModelTraceSpanParentId(span));
    if (isNil(rootSpan)) {
      return null;
    }

    const expectations: Record<string, any> = {};
    if (isV3ModelTraceInfo(trace.info)) {
      for (const assessment of trace.info.assessments ?? []) {
        if (!('expectation' in assessment)) {
          continue;
        }
        // the getAssessmentValue util does not deserialize
        // the expectation value, so we do it manually here
        if ('serialized_value' in assessment.expectation) {
          const value = assessment.expectation.serialized_value.value;
          try {
            expectations[assessment.assessment_name] = JSON.parse(value);
          } catch (e) {
            expectations[assessment.assessment_name] = value;
          }
        } else {
          expectations[assessment.assessment_name] = assessment.expectation.value;
        }
      }
    }

    return {
      inputs: isV3ModelTraceSpan(rootSpan)
        ? tryDeserializeAttribute(rootSpan.attributes?.['mlflow.spanInputs'])
        : rootSpan.inputs,
      expectations,
      source: {
        source_type: 'TRACE',
        source_data: { trace_id: getModelTraceId(trace) },
      },
    };
  });

  return compact(rowData);
};
```

--------------------------------------------------------------------------------

---[FILE: EvalRunsVisibilityHeaderCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/EvalRunsVisibilityHeaderCell.tsx
Signals: React

```typescript
import { DashIcon, DropdownMenu, VisibleIcon, VisibleOffIcon, useDesignSystemTheme } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RUNS_VISIBILITY_MODE } from '../../components/experiment-page/models/ExperimentPageUIState';
import { useExperimentEvaluationRunsRowVisibility } from './hooks/useExperimentEvaluationRunsRowVisibility';

/**
 * Header cell component for the visibility column in evaluation runs table.
 * Displays an eye icon button that opens a dropdown menu with visibility mode options.
 */
export const EvalRunsVisibilityHeaderCell = React.memo(() => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const { visibilityMode, setVisibilityMode, usingCustomVisibility, allRunsHidden } =
    useExperimentEvaluationRunsRowVisibility();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          css={styles.actionButton(theme)}
          data-testid="eval-runs-visibility-column-header"
          aria-label={intl.formatMessage({
            defaultMessage: 'Toggle visibility of evaluation runs',
            description: 'Evaluation runs table > toggle visibility of runs > accessible label',
          })}
        >
          {visibilityMode === RUNS_VISIBILITY_MODE.HIDEALL ||
          visibilityMode === RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS ||
          allRunsHidden ? (
            <VisibleOffIcon />
          ) : (
            <VisibleIcon />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.RadioGroup
          componentId="mlflow.eval-runs.visibility-mode-selector"
          value={visibilityMode}
          onValueChange={(value) => setVisibilityMode(value as RUNS_VISIBILITY_MODE)}
        >
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.FIRST_10_RUNS}>
            {/* Dropdown menu does not support indeterminate state, so we're doing it manually */}
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Show first 10"
              description="Menu option for showing only 10 first runs in the evaluation runs table"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.FIRST_20_RUNS}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Show first 20"
              description="Menu option for showing only 20 first runs in the evaluation runs table"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.SHOWALL}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Show all runs"
              description="Menu option for revealing all hidden runs in the evaluation runs table"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.HIDEALL}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Hide all runs"
              description="Menu option for hiding all runs in the evaluation runs table"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Hide finished runs"
              description="Menu option for hiding all finished runs in the evaluation runs table"
            />
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});

const styles = {
  actionButton: (theme: Theme) => ({
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    verticalAlign: 'text-bottom',
    minWidth: 24,
    minHeight: 24,
    svg: {
      width: theme.general.iconFontSize,
      height: theme.general.iconFontSize,
      cursor: 'pointer',
      color: theme.colors.textPrimary,
      flexShrink: 0,
    },
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsPage.test.tsx

```typescript
import { jest, describe, beforeAll, beforeEach, test, expect } from '@jest/globals';
import type { DefaultBodyType, PathParams, ResponseResolver, RestRequest, RestContext } from 'msw';
import { rest } from 'msw';
import { setupServer } from '../../../common/utils/setup-msw';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExperimentEvaluationRunsPage from './ExperimentEvaluationRunsPage';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

jest.mock('../../hooks/useExperimentQuery', () => ({
  useGetExperimentQuery: jest.fn(() => ({})),
}));

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // higher timeout for heavier table testing

const createMockRun = ({ index }: { index: number }) => ({
  data: {
    params: [],
    tags: [],
    metrics: [],
  },
  info: {
    artifact_uri: '',
    end_time: 0,
    experiment_id: 'exp-1',
    lifecycle_stage: '',
    run_uuid: `run-${index}`,
    run_name: `Test Run ${index}`,
    start_time: 0,
    status: 'FINISHED',
  },
  inputs: {
    dataset_inputs: [],
    model_inputs: [],
  },
  outputs: {
    model_outputs: [],
  },
});
const createMockResponse = ({ pageToken, pageSize }: { pageToken?: string; pageSize: number }) => {
  const allResults = 300;
  const page = Number(pageToken) || 1;
  const allRuns = Array.from({ length: allResults }, (_, i) => createMockRun({ index: i }));
  const next_page_token = page * pageSize < allResults ? (page + 1).toString() : null;
  return {
    runs: allRuns.slice((page - 1) * pageSize, page * pageSize),
    next_page_token,
  };
};

describe('ExperimentEvaluationRunsPage', () => {
  const { history } = setupTestRouter();

  const searchRequestHandler: ResponseResolver<
    RestRequest<DefaultBodyType, PathParams>,
    RestContext,
    DefaultBodyType
  > = (req, res, ctx) => {
    return res(
      ctx.json(
        createMockResponse({
          pageToken: (req.body as any)['page_token'] as string,
          pageSize: Number((req.body as any)['max_results'] as string),
        }),
      ),
    );
  };
  const server = setupServer(
    // prettier-ignore
    rest.post('ajax-api/2.0/mlflow/runs/search', searchRequestHandler),
  );

  const renderTestComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <TestApolloProvider disableCache>
        <QueryClientProvider client={queryClient}>
          <MockedReduxStoreProvider state={{ entities: { colorByRunUuid: {} } }}>
            <IntlProvider locale="en">
              <DesignSystemProvider>
                <TestRouter
                  routes={[testRoute(<ExperimentEvaluationRunsPage />, '/experiments/:experimentId/evaluation-runs')]}
                  history={history}
                  initialEntries={['/experiments/exp-1/evaluation-runs']}
                />
              </DesignSystemProvider>
            </IntlProvider>
          </MockedReduxStoreProvider>
        </QueryClientProvider>
      </TestApolloProvider>,
    );
  };

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  beforeEach(async () => {
    server.resetHandlers();
    renderTestComponent();
    const table = await screen.findByRole('table');
    Object.defineProperty(table, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(table, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  test('should display runs title when fetched', async () => {
    await waitFor(() => {
      // Make sure first and last items are displayed.
      expect(screen.getByText('Test Run 0')).toBeInTheDocument();
      expect(screen.getByText('Test Run 49')).toBeInTheDocument();
    });
    // Make sure the next page is not yet fetched.
    expect(screen.queryByText('Test Run 50')).not.toBeInTheDocument();
  });

  test('should load next page when scroll is at the bottom', async () => {
    fireEvent.scroll(screen.getByRole('table'), { target: { scrollTop: 1000 } });
    await waitFor(() => {
      // Make sure first and last items are displayed.
      expect(screen.getByText('Test Run 50')).toBeInTheDocument();
      expect(screen.getByText('Test Run 99')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

````

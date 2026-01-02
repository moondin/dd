---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 495
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 495 of 991)

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

---[FILE: useLoggedModelsForExperimentRunsTableV2.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRunsTableV2.test.tsx

```typescript
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from '../../../../common/utils/setup-msw';
import { useLoggedModelsForExperimentRunsTableV2 } from './useLoggedModelsForExperimentRunsTableV2';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { RunInfoEntity } from '../../../types';

// Enable feature flags
jest.mock('../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/FeatureUtils')>(
    '../../../../common/utils/FeatureUtils',
  ),
  isExperimentLoggedModelsUIEnabled: jest.fn(() => true),
}));

describe('useLoggedModelsForExperimentRunsTableV2', () => {
  const server = setupServer();

  beforeAll(() => server.listen());

  beforeEach(() => {
    server.use(
      rest.get('/ajax-api/2.0/mlflow/logged-models:batchGet', (req, res, ctx) => {
        // Extract model IDs from the query parameters
        const modelIds = req.url.searchParams.getAll('model_ids');

        const sourceRunIdByModelIdMap: Record<string, string> = {
          'model-id-1': 'run-1',
          'model-id-2': 'run-1',
          'model-id-3': 'run-2',
        };

        // Create mock models based on the requested IDs
        const models = modelIds.map((modelId) => ({
          info: {
            model_id: modelId,
            name: `model-${modelId}`,
            source_run_id: sourceRunIdByModelIdMap[modelId],
            experiment_id: 'test-experiment',
          },
          data: {},
        }));

        return res(ctx.json({ models }));
      }),
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  // Create a wrapper component with QueryClientProvider
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  test('should extract model IDs from inputs and outputs and fetch models', async () => {
    // Prepare test data
    const runData = [
      {
        runInfo: { runUuid: 'run-1' } as RunInfoEntity,
        inputs: {
          modelInputs: [{ modelId: 'model-id-1' }],
        },
        outputs: {
          modelOutputs: [{ modelId: 'model-id-2' }],
        },
      },
      {
        runInfo: { runUuid: 'run-2' } as RunInfoEntity,
        inputs: {
          modelInputs: [{ modelId: 'model-id-3' }],
        },
        outputs: undefined,
      },
    ];

    // Render the hook
    const { result } = renderHook(() => useLoggedModelsForExperimentRunsTableV2({ runData, enabled: true }), {
      wrapper,
    });

    // Initially the result should be an empty object
    expect(result.current).toEqual({});

    // Wait for the query to complete
    await waitFor(() => {
      // Verify the hook returns the expected data structure
      expect(Object.keys(result.current)).toContain('run-1');
      expect(Object.keys(result.current)).toContain('run-2');
    });

    // Verify the models are correctly associated with their runs
    expect(result.current['run-1'].length).toBe(2);
    expect(result.current['run-1'][0].info?.model_id).toBe('model-id-1');
    expect(result.current['run-1'][1].info?.model_id).toBe('model-id-2');

    expect(result.current['run-2'].length).toBe(1);
    expect(result.current['run-2'][0].info?.model_id).toBe('model-id-3');
  });

  test('should handle runs with no model IDs', async () => {
    // Prepare test data with no model IDs
    const runData = [
      {
        runInfo: { runUuid: 'run-1' } as RunInfoEntity,
        inputs: { modelInputs: [] },
        outputs: { modelOutputs: [] },
      },
    ];

    // Render the hook
    const { result } = renderHook(() => useLoggedModelsForExperimentRunsTableV2({ runData, enabled: true }), {
      wrapper,
    });

    // The result should be an empty object since there are no models to fetch
    expect(result.current).toEqual({});

    // Wait for a short time to ensure no API calls are made
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The result should still be an empty object
    expect(result.current).toEqual({});
  });

  test('should handle undefined inputs and outputs', async () => {
    // Prepare test data with undefined inputs and outputs
    const runData = [
      {
        runInfo: { runUuid: 'run-1' } as RunInfoEntity,
        // No inputs or outputs defined
      },
    ];

    // Render the hook
    const { result } = renderHook(() => useLoggedModelsForExperimentRunsTableV2({ runData, enabled: true }), {
      wrapper,
    });

    // The result should be an empty object since there are no models to fetch
    expect(result.current).toEqual({});

    // Wait for a short time to ensure no API calls are made
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The result should still be an empty object
    expect(result.current).toEqual({});
  });

  test('should not fetch models when disabled', async () => {
    // Prepare test data
    const runData = [
      {
        runInfo: { runUuid: 'run-1' } as RunInfoEntity,
        inputs: {
          modelInputs: [{ modelId: 'model-id-1' }],
        },
      },
    ];

    // Render the hook with enabled=false
    const { result } = renderHook(() => useLoggedModelsForExperimentRunsTableV2({ runData, enabled: false }), {
      wrapper,
    });

    // The result should be an empty object
    expect(result.current).toEqual({});

    // Wait for a short time to ensure no API calls are made
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The result should still be an empty object
    expect(result.current).toEqual({});
  });

  test('should deduplicate model IDs from the same run', async () => {
    // Prepare test data with duplicate model IDs
    const runData = [
      {
        runInfo: { runUuid: 'run-1' } as RunInfoEntity,
        inputs: {
          modelInputs: [{ modelId: 'model-id-1' }, { modelId: 'model-id-1' }], // Duplicate ID
        },
        outputs: {
          modelOutputs: [{ modelId: 'model-id-1' }, { modelId: 'model-id-2' }], // Another duplicate
        },
      },
    ];

    // Render the hook
    const { result } = renderHook(() => useLoggedModelsForExperimentRunsTableV2({ runData, enabled: true }), {
      wrapper,
    });

    // Wait for the query to complete
    await waitFor(() => {
      expect(Object.keys(result.current)).toContain('run-1');
    });

    // Verify the models are correctly deduplicated
    expect(result.current['run-1'].length).toBe(2); // Only 2 unique models

    // Check that the model IDs are unique
    const modelIds = result.current['run-1'].map((model) => model.info?.model_id);
    expect(new Set(modelIds).size).toBe(modelIds.length);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRunsTableV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRunsTableV2.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { LoggedModelProto, RunInfoEntity, RunInputsType, RunOutputsType } from '../../../types';
import { useGetLoggedModelsQuery } from '../../../hooks/logged-models/useGetLoggedModelsQuery';
import { uniq } from 'lodash';

/**
 * Custom hook to fetch logged models for experiment runs table.
 * It processes run data to extract model IDs and fetches the corresponding logged models.
 *
 * Contrary to V1, this version uses runs' inputs and outputs to determine the model IDs,
 * instead of getting all models logged in the experiment.
 */
export const useLoggedModelsForExperimentRunsTableV2 = ({
  runData,
  enabled,
}: {
  runData: {
    runInfo: RunInfoEntity;
    inputs?: RunInputsType;
    outputs?: RunOutputsType;
  }[];
  enabled?: boolean;
}) => {
  const modelIdsByRunId = useMemo(() => {
    if (!enabled) {
      return {};
    }
    const modelIdsMap: Record<string, string[]> = {};
    for (const { runInfo, inputs, outputs } of runData) {
      const runId = runInfo.runUuid;
      const inputModelIds = inputs?.modelInputs?.map((input) => input.modelId) || [];
      const outputModelIds = outputs?.modelOutputs?.map((output) => output.modelId) || [];
      const allModelIds = [...inputModelIds, ...outputModelIds];
      if (runId && allModelIds.length > 0) {
        modelIdsMap[runId] = uniq(allModelIds); // Ensure unique model IDs per run
      }
    }
    return modelIdsMap;
  }, [runData, enabled]);

  const modelIds = useMemo(() => {
    if (!enabled) {
      return [];
    }
    // Unique model IDs across all runs with no repeats
    return uniq(Object.values(modelIdsByRunId).flat());
  }, [modelIdsByRunId, enabled]);

  const loggedModelsData = useGetLoggedModelsQuery(
    {
      modelIds,
    },
    {
      enabled: enabled && modelIds.length > 0,
    },
  );

  const loggedModelsByRunId = useMemo(() => {
    if (!loggedModelsData.data) {
      return {};
    }
    return Object.entries(modelIdsByRunId).reduce<Record<string, LoggedModelProto[]>>((acc, [runId, modelIds]) => {
      acc[runId] = loggedModelsData.data?.filter((model) => modelIds.includes(model.info?.model_id || '')) ?? [];
      return acc;
    }, {});
  }, [modelIdsByRunId, loggedModelsData.data]);

  return loggedModelsByRunId;
};
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRunV2.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRunV2.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useLoggedModelsForExperimentRunV2 } from './useLoggedModelsForExperimentRunV2';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useGetLoggedModelsQuery } from '../../../hooks/logged-models/useGetLoggedModelsQuery';
import type { UseGetRunQueryResponseInputs, UseGetRunQueryResponseOutputs } from '../../run-page/hooks/useGetRunQuery';

// Mock the useGetLoggedModelsQuery hook
jest.mock('../../../hooks/logged-models/useGetLoggedModelsQuery', () => ({
  useGetLoggedModelsQuery: jest.fn(),
}));

describe('useLoggedModelsForExperimentRun', () => {
  // Create a wrapper component with QueryClientProvider
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for useGetLoggedModelsQuery
    jest.mocked(useGetLoggedModelsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    } as any);
  });

  test('should extract model IDs from inputs and outputs and fetch models', async () => {
    const mockModels = [
      { info: { model_id: 'model-123', name: 'model-model-123' }, data: {} },
      { info: { model_id: 'model-456', name: 'model-model-456' }, data: {} },
      { info: { model_id: 'model-789', name: 'model-model-789' }, data: {} },
    ];

    // Mock the query hook to return data
    jest.mocked(useGetLoggedModelsQuery).mockReturnValue({
      data: mockModels,
      isLoading: false,
      error: undefined,
    } as any);

    const runInputs = {
      modelInputs: [{ modelId: 'model-123' }, { modelId: 'model-456' }],
    } as UseGetRunQueryResponseInputs;

    const runOutputs = {
      modelOutputs: [
        { modelId: 'model-456' }, // Duplicate that should be de-duped
        { modelId: 'model-789' },
      ],
    } as UseGetRunQueryResponseOutputs;

    const { result } = renderHook(() => useLoggedModelsForExperimentRunV2({ runInputs, runOutputs }), { wrapper });

    // Verify the hook was called with the right parameters
    expect(useGetLoggedModelsQuery).toHaveBeenCalledWith(
      { modelIds: ['model-123', 'model-456', 'model-789'] },
      { enabled: true, refetchOnWindowFocus: false },
    );

    // Verify the returned data matches what we expect
    expect(result.current.models).toEqual(mockModels);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  test('should handle undefined inputs and outputs', async () => {
    const { result } = renderHook(
      () =>
        useLoggedModelsForExperimentRunV2({
          runInputs: undefined,
          runOutputs: undefined,
        }),
      { wrapper },
    );

    // Should not call useGetLoggedModelsQuery with modelIds
    expect(useGetLoggedModelsQuery).toHaveBeenCalledWith(
      { modelIds: undefined },
      { enabled: false, refetchOnWindowFocus: false },
    );

    // No models should be returned
    expect(result.current.models).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  test('should handle empty model inputs and outputs', async () => {
    const runInputs: UseGetRunQueryResponseInputs = {
      modelInputs: [],
    } as any;

    const runOutputs: UseGetRunQueryResponseOutputs = {
      modelOutputs: [],
    } as any;

    const { result } = renderHook(() => useLoggedModelsForExperimentRunV2({ runInputs, runOutputs }), { wrapper });

    // Should not call useGetLoggedModelsQuery with modelIds
    expect(useGetLoggedModelsQuery).toHaveBeenCalledWith(
      { modelIds: undefined },
      { enabled: false, refetchOnWindowFocus: false },
    );

    // No models should be returned
    expect(result.current.models).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  test('should handle API error', async () => {
    const mockError = new Error('API error');

    // Mock the query hook to return an error
    jest.mocked(useGetLoggedModelsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    } as any);

    const runInputs: UseGetRunQueryResponseInputs = {
      modelInputs: [{ modelId: 'model-123' }],
    } as any;

    const { result } = renderHook(
      () =>
        useLoggedModelsForExperimentRunV2({
          runInputs,
          runOutputs: undefined,
        }),
      { wrapper },
    );

    // Verify error is propagated
    expect(result.current.error).toBe(mockError);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRunV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRunV2.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import { useGetLoggedModelsQuery } from '../../../hooks/logged-models/useGetLoggedModelsQuery';
import type { UseGetRunQueryResponseInputs, UseGetRunQueryResponseOutputs } from '../../run-page/hooks/useGetRunQuery';
import { compact, isEmpty, uniq } from 'lodash';

export const useLoggedModelsForExperimentRunV2 = ({
  runInputs,
  runOutputs,
  enabled = true,
}: {
  runInputs?: UseGetRunQueryResponseInputs;
  runOutputs?: UseGetRunQueryResponseOutputs;
  enabled?: boolean;
}) => {
  const modelIds = useMemo(() => {
    const inputs = runInputs?.modelInputs ?? [];
    const outputs = runOutputs?.modelOutputs ?? [];
    const allModels = [...inputs, ...outputs];
    const modelIds = uniq(compact(allModels.map(({ modelId }) => modelId)));

    if (isEmpty(modelIds)) {
      return undefined;
    }

    return modelIds;
  }, [runInputs, runOutputs]);

  const isHookEnabled = enabled && !isEmpty(modelIds);

  const {
    data: loggedModelsData,
    isLoading,
    error,
  } = useGetLoggedModelsQuery(
    {
      modelIds,
    },
    {
      enabled: isHookEnabled,
      refetchOnWindowFocus: false,
    },
  );

  return { models: loggedModelsData, isLoading: isHookEnabled && isLoading, error };
};
```

--------------------------------------------------------------------------------

---[FILE: useNavigateToExperimentPageTab.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useNavigateToExperimentPageTab.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { useNavigateToExperimentPageTab } from './useNavigateToExperimentPageTab';
import { setupTestRouter, testRoute, TestRouter } from '../../../../common/utils/RoutingTestUtils';
import { createMLflowRoutePath, useParams } from '../../../../common/utils/RoutingUtils';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';
import { setupServer } from '../../../../common/utils/setup-msw';
import { graphql } from 'msw';
import type { MlflowGetExperimentQuery } from '../../../../graphql/__generated__/graphql';
import { ExperimentKind } from '../../../constants';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000); // Larger timeout for integration testing

describe('useNavigateToExperimentPageTab', () => {
  const server = setupServer();

  beforeEach(() => {
    server.resetHandlers();
  });

  const { history } = setupTestRouter();

  const mockResponseWithExperimentKind = (experimentKind: ExperimentKind) => {
    server.use(
      graphql.query<MlflowGetExperimentQuery>('MlflowGetExperimentQuery', (req, res, ctx) => {
        return res(
          ctx.data({
            mlflowGetExperiment: {
              __typename: 'MlflowGetExperimentResponse',
              experiment: {
                tags: [
                  {
                    __typename: 'MlflowExperimentTag',
                    key: 'mlflow.experimentKind',
                    value: experimentKind,
                  },
                ],
              },
            } as any,
          }),
        );
      }),
    );
  };

  const renderTestHook = (initialRoute: string, enabled = true) => {
    const TestExperimentPage = () => {
      const { isEnabled } = useNavigateToExperimentPageTab({
        enabled,
        experimentId: '123',
      });

      if (isEnabled) {
        return null;
      }

      return <span>this is default entry page</span>;
    };
    const TestExperimentTabsPage = () => {
      // /experiments/:experimentId/:tabName
      const { tabName } = useParams();
      return <span>experiment page displaying {tabName} tab</span>;
    };
    return render(
      <TestRouter
        history={history}
        routes={[
          testRoute(<TestExperimentPage />, createMLflowRoutePath('/experiments/:experimentId')),
          testRoute(<TestExperimentTabsPage />, createMLflowRoutePath('/experiments/:experimentId/:tabName')),
        ]}
        initialEntries={[initialRoute]}
      />,
      { wrapper: ({ children }) => <TestApolloProvider disableCache>{children}</TestApolloProvider> },
    );
  };
  test('should not redirect if the hook is disabled', async () => {
    renderTestHook(createMLflowRoutePath('/experiments/123'), false);

    await waitFor(() => {
      expect(screen.getByText('this is default entry page')).toBeInTheDocument();
    });
  });

  test('should redirect to the traces tab on GenAI experiment kind', async () => {
    mockResponseWithExperimentKind(ExperimentKind.GENAI_DEVELOPMENT);

    renderTestHook(createMLflowRoutePath('/experiments/123'));

    expect(await screen.findByText('experiment page displaying traces tab')).toBeInTheDocument();
  });

  test('should redirect to the traces tab on custom development experiment kind', async () => {
    mockResponseWithExperimentKind(ExperimentKind.CUSTOM_MODEL_DEVELOPMENT);

    renderTestHook(createMLflowRoutePath('/experiments/123'));

    expect(await screen.findByText('experiment page displaying runs tab')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useNavigateToExperimentPageTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useNavigateToExperimentPageTab.tsx
Signals: React

```typescript
import { useEffect, useMemo } from 'react';
import { useNavigate } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { ExperimentKind, ExperimentPageTabName } from '../../../constants';
import { useGetExperimentQuery } from '../../../hooks/useExperimentQuery';
import { getExperimentKindFromTags } from '../../../utils/ExperimentKindUtils';
import { coerceToEnum } from '@databricks/web-shared/utils';

/**
 * This hook navigates user to the appropriate tab in the experiment page based on the experiment kind.
 */
export const useNavigateToExperimentPageTab = ({
  enabled,
  experimentId,
}: {
  enabled?: boolean;
  experimentId: string;
}) => {
  const navigate = useNavigate();

  const { data: experiment, loading: loadingExperiment } = useGetExperimentQuery({
    experimentId,
    options: {
      skip: !enabled,
    },
  });

  const experimentKind = useMemo(() => {
    if (loadingExperiment || !experiment) {
      return null;
    }
    const experimentTags = experiment && 'tags' in experiment ? experiment?.tags : [];

    if (experiment) {
      const experimentKindTagValue = getExperimentKindFromTags(experimentTags);
      return coerceToEnum(ExperimentKind, experimentKindTagValue, ExperimentKind.NO_INFERRED_TYPE);
    }
    return null;
  }, [experiment, loadingExperiment]);

  useEffect(() => {
    if (!enabled || !experimentKind) {
      return;
    }

    // By default, we navigate to the Runs tab
    let targetTab = ExperimentPageTabName.Runs;

    // For GENAI_DEVELOPMENT, we navigate to the Traces tab.
    if (experimentKind === ExperimentKind.GENAI_DEVELOPMENT) {
      targetTab = ExperimentPageTabName.Traces;
    }

    navigate(Routes.getExperimentPageTabRoute(experimentId, targetTab), { replace: true });
  }, [navigate, experimentId, enabled, experimentKind]);

  return {
    isEnabled: enabled,
    isLoading: enabled && loadingExperiment,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePersistExperimentPageViewState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/usePersistExperimentPageViewState.tsx
Signals: React

```typescript
import { useEffect, useMemo } from 'react';

import { pick } from 'lodash';
import { createExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { loadExperimentViewState, saveExperimentViewState } from '../utils/persistSearchFacets';
import type { ExperimentQueryParamsSearchFacets } from './useExperimentPageSearchFacets';
import { EXPERIMENT_PAGE_QUERY_PARAM_KEYS, useUpdateExperimentPageSearchFacets } from './useExperimentPageSearchFacets';

/**
 * Takes care of initializing the search facets from persisted view state and persisting them.
 * Partially replaces GetExperimentRunsContext.
 */
export const usePersistExperimentPageViewState = (
  uiState: ExperimentPageUIState,
  searchFacets: ExperimentQueryParamsSearchFacets | null,
  experimentIds: string[],
  disabled = false,
) => {
  const setSearchFacets = useUpdateExperimentPageSearchFacets();

  const persistKey = useMemo(() => (experimentIds ? JSON.stringify(experimentIds.sort()) : null), [experimentIds]);

  // If there are no query params visible in the address bar, either reinstantiate
  // them from persisted view state or use default values.
  useEffect(() => {
    if (disabled) {
      return;
    }
    if (!searchFacets) {
      const persistedViewState = persistKey ? loadExperimentViewState(persistKey) : null;
      const rebuiltViewState = pick(
        { ...createExperimentPageSearchFacetsState(), ...persistedViewState },
        EXPERIMENT_PAGE_QUERY_PARAM_KEYS,
      );
      setSearchFacets(rebuiltViewState, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFacets, persistKey, disabled]);

  // Persist complete view state in local storage when either search facets or UI state change
  useEffect(() => {
    if (!searchFacets || !persistKey || disabled) {
      return;
    }
    saveExperimentViewState({ ...searchFacets, ...uiState }, persistKey);
  }, [searchFacets, uiState, persistKey, disabled]);
};
```

--------------------------------------------------------------------------------

---[FILE: usePopulateImagesByRunUuid.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/usePopulateImagesByRunUuid.tsx
Signals: React, Redux/RTK

```typescript
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import { listImagesApi } from '@mlflow/mlflow/src/experiment-tracking/actions';
import { EXPERIMENT_RUNS_IMAGE_AUTO_REFRESH_INTERVAL } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '@mlflow/mlflow/src/redux-types';
import { NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE } from '@mlflow/mlflow/src/experiment-tracking/constants';

export const usePopulateImagesByRunUuid = ({
  runUuids,
  runUuidsIsActive,
  autoRefreshEnabled,
  enabled,
}: {
  runUuids: string[];
  runUuidsIsActive: boolean[];
  autoRefreshEnabled?: boolean;
  enabled?: boolean;
}) => {
  // Retrieve image keys for each run. This should only re-render when the runUuids change.
  // This populates the imagesByRunUuid with imageKeys, which will be used elsewhere to fetch metadata.
  const dispatch = useDispatch<ThunkDispatch>();

  /**
   * The criteria to populate images for a run is
   * 1. The run is not hidden
   * 2. The run includes the mlflow.loggedImage tag
   * 3. The run's image is not already populated
   */
  // We need to use a serialized version of runUuids to avoid re-triggering the effect when using an array.
  const runUuidsSerialized = runUuids.slice(0, NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE).join(',');
  useEffect(() => {
    // Regular single fetch event with no auto-refresh capabilities. Used if auto-refresh is disabled.
    if (!enabled || autoRefreshEnabled) {
      return;
    }
    runUuidsSerialized.split(',').forEach((runUuid) => {
      if (runUuid) {
        dispatch(listImagesApi(runUuid));
      }
    });
  }, [runUuidsSerialized, dispatch, autoRefreshEnabled, enabled]);

  const refreshTimeoutRef = useRef<number | undefined>(undefined);
  const autoRefreshEnabledRef = useRef(autoRefreshEnabled && enabled);
  autoRefreshEnabledRef.current = autoRefreshEnabled;

  const runUuidsIsActiveSerialized = runUuidsIsActive.slice(0, NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE).join(',');
  // A fetch effect with auto-refresh capabilities. Used only if auto-refresh is enabled.
  useEffect(() => {
    let hookUnmounted = false;

    if (!enabled || !autoRefreshEnabled) {
      return;
    }

    const fetchImagesFn = async (autoRefresh: boolean) => {
      const runUuids = runUuidsSerialized.split(',');

      const activeRunUuids = runUuidsIsActiveSerialized.split(',');
      // If auto-refresh is enabled, only fetch images for runs that are currently active
      const filteredRunUuids = autoRefresh ? runUuids.filter((_, index) => activeRunUuids[index] === 'true') : runUuids;

      filteredRunUuids.forEach((runUuid) => {
        if (runUuid) {
          dispatch(listImagesApi(runUuid, autoRefresh));
        }
      });
    };

    const scheduleRefresh = async () => {
      // Initial check to confirm that auto-refresh is still enabled and the hook is still mounted
      if (!autoRefreshEnabledRef.current || hookUnmounted) {
        return;
      }
      try {
        await fetchImagesFn(true);
      } catch (e) {
        // In case of error during auto-refresh, log the error but do break the auto-refresh loop
        Utils.logErrorAndNotifyUser(e);
      }
      clearTimeout(refreshTimeoutRef.current);

      // After loading the data, schedule the next refresh if the hook is still enabled and mounted
      if (!autoRefreshEnabledRef.current || hookUnmounted) {
        return;
      }

      refreshTimeoutRef.current = window.setTimeout(scheduleRefresh, EXPERIMENT_RUNS_IMAGE_AUTO_REFRESH_INTERVAL);
    };

    fetchImagesFn(false).then(scheduleRefresh);

    return () => {
      fetchImagesFn(true);
      // Mark the hook as unmounted to prevent scheduling new auto-refreshes with current data
      hookUnmounted = true;
      // Clear the timeout
      clearTimeout(refreshTimeoutRef.current);
    };
  }, [dispatch, runUuidsSerialized, runUuidsIsActiveSerialized, autoRefreshEnabled, enabled]);
};
```

--------------------------------------------------------------------------------

---[FILE: useRunsArtifacts.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useRunsArtifacts.test.tsx

```typescript
import { jest, describe, afterEach, test, expect } from '@jest/globals';
import { listArtifactsApi } from '../../../actions';
import { useRunsArtifacts } from './useRunsArtifacts';
import type { ArtifactListFilesResponse } from '../../../types';
import { renderHook, cleanup, waitFor } from '@testing-library/react';

const mockArtifactsData: Record<string, ArtifactListFilesResponse> = {
  'run-1': {
    root_uri: 'run-1',
    files: [
      {
        path: 'artifact1.txt',
        is_dir: false,
        file_size: 300,
      },
    ],
  },
  'run-2': {
    root_uri: 'run-2',
    files: [
      {
        path: 'artifact2.txt',
        is_dir: false,
        file_size: 300,
      },
    ],
  },
};

jest.mock('../../../actions', () => ({
  ...jest.requireActual<typeof import('../../../actions')>('../../../actions'),
  listArtifactsApi: jest.fn((runUuid: string) => {
    return {
      payload: mockArtifactsData[runUuid],
    };
  }),
}));

describe('useRunsArtifacts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  test('fetches artifacts for given run UUIDs', async () => {
    const runUuids = ['run-1', 'run-2'];
    const { result } = renderHook(() => useRunsArtifacts(runUuids));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Make sure API is called correctly
    expect(listArtifactsApi).toHaveBeenCalledWith('run-1');
    expect(listArtifactsApi).toHaveBeenCalledWith('run-2');
    expect(listArtifactsApi).toHaveBeenCalledTimes(2);

    expect(result.current.artifactsKeyedByRun).toEqual(mockArtifactsData);
  });

  test('returns empty object when no run UUIDs are provided', () => {
    const runUuids: string[] = [];
    const { result } = renderHook(() => useRunsArtifacts(runUuids));

    expect(result.current.artifactsKeyedByRun).toEqual({});
  });

  test('returns empty object when no artifacts are found', () => {
    const runUuids = ['run-3'];
    const { result } = renderHook(() => useRunsArtifacts(runUuids));

    expect(result.current.artifactsKeyedByRun).toEqual({});
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useRunsArtifacts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useRunsArtifacts.tsx
Signals: React

```typescript
import { useEffect, useState } from 'react';
import { listArtifactsApi } from '../../../actions';
import type { ArtifactListFilesResponse } from '../../../types';

/**
 * Fetches artifacts given a list of run UUIDs
 * @param runUuids List of run UUIDs
 * @returns Object containing artifacts keyed by run UUID
 */
export const useRunsArtifacts = (runUuids: string[]) => {
  const [artifactsKeyedByRun, setArtifactsKeyedByRun] = useState<Record<string, ArtifactListFilesResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtifacts = async () => {
      setIsLoading(true);
      setError(null);

      const artifactsByRun: Record<string, ArtifactListFilesResponse> = {};

      try {
        await Promise.all(
          runUuids.map(async (runUuid) => {
            const response = listArtifactsApi(runUuid);
            const artifacts = (await response.payload) as ArtifactListFilesResponse;
            artifactsByRun[runUuid] = artifacts;
          }),
        );
        setArtifactsKeyedByRun(artifactsByRun);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (runUuids.length > 0) {
      fetchArtifacts();
    } else {
      setArtifactsKeyedByRun({});
      setIsLoading(false);
    }
  }, [runUuids]);

  return { artifactsKeyedByRun, isLoading, error };
};
```

--------------------------------------------------------------------------------

---[FILE: useRunSortOptions.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useRunSortOptions.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';

import { ATTRIBUTE_COLUMN_SORT_LABEL } from '../../../constants';
import { useRunSortOptions } from './useRunSortOptions';

describe('useRunSortOptions', () => {
  test('tests useRunSortOptions without metrics nor params', () => {
    const sortOptions = renderHook(() => useRunSortOptions([], [])).result.current;

    expect(sortOptions).toStrictEqual([
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DATE,
        value: 'attributes.start_time***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DATE,
        value: 'attributes.start_time***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.USER,
        value: 'tags.`mlflow.user`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.USER,
        value: 'tags.`mlflow.user`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.RUN_NAME,
        value: 'tags.`mlflow.runName`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.RUN_NAME,
        value: 'tags.`mlflow.runName`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.SOURCE,
        value: 'tags.`mlflow.source.name`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.SOURCE,
        value: 'tags.`mlflow.source.name`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.VERSION,
        value: 'tags.`mlflow.source.git.commit`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.VERSION,
        value: 'tags.`mlflow.source.git.commit`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DESCRIPTION,
        value: 'tags.`mlflow.note.content`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DESCRIPTION,
        value: 'tags.`mlflow.note.content`***DESCENDING',
        order: 'DESCENDING',
      },
    ]);
  });

  test('creates RunSortOptions with metrics and params', () => {
    const sortOptions = renderHook(() => useRunSortOptions(['metric1', 'metric2'], ['param1', 'param2'])).result
      .current;

    expect(sortOptions).toStrictEqual([
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DATE,
        value: 'attributes.start_time***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DATE,
        value: 'attributes.start_time***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.USER,
        value: 'tags.`mlflow.user`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.USER,
        value: 'tags.`mlflow.user`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.RUN_NAME,
        value: 'tags.`mlflow.runName`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.RUN_NAME,
        value: 'tags.`mlflow.runName`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.SOURCE,
        value: 'tags.`mlflow.source.name`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.SOURCE,
        value: 'tags.`mlflow.source.name`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.VERSION,
        value: 'tags.`mlflow.source.git.commit`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.VERSION,
        value: 'tags.`mlflow.source.git.commit`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DESCRIPTION,
        value: 'tags.`mlflow.note.content`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: ATTRIBUTE_COLUMN_SORT_LABEL.DESCRIPTION,
        value: 'tags.`mlflow.note.content`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: 'metric1',
        value: 'metrics.`metric1`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: 'metric1',
        value: 'metrics.`metric1`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: 'metric2',
        value: 'metrics.`metric2`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: 'metric2',
        value: 'metrics.`metric2`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: 'param1',
        value: 'params.`param1`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: 'param1',
        value: 'params.`param1`***DESCENDING',
        order: 'DESCENDING',
      },
      {
        label: 'param2',
        value: 'params.`param2`***ASCENDING',
        order: 'ASCENDING',
      },
      {
        label: 'param2',
        value: 'params.`param2`***DESCENDING',
        order: 'DESCENDING',
      },
    ]);
  });
});
```

--------------------------------------------------------------------------------

````

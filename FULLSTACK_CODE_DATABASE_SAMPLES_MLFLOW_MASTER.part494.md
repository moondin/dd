---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 494
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 494 of 991)

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

---[FILE: useInferExperimentKind.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useInferExperimentKind.test.tsx

```typescript
import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { UseGetExperimentQueryResultExperiment } from '../../../hooks/useExperimentQuery';
import { useInferExperimentKind } from './useInferExperimentKind';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { setupServer } from '../../../../common/utils/setup-msw';
import { rest } from 'msw';
import { ExperimentKind } from '../../../constants';

describe('useInferExperimentKind', () => {
  const server = setupServer();
  beforeEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  const renderTestHook = (props: Partial<Parameters<typeof useInferExperimentKind>[0]> = {}) => {
    const queryClient = new QueryClient();

    return renderHook(
      () =>
        useInferExperimentKind({
          experimentId: '123',
          isLoadingExperiment: false,
          updateExperimentKind: jest.fn(),
          ...props,
        }),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      },
    );
  };

  test('it should not be able to infer any specific type when no traces or runs are present', async () => {
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        return res(ctx.json({}));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        return res(ctx.json({}));
      }),
    );
    const updateExperimentKind = jest.fn();
    const { result } = renderTestHook({ updateExperimentKind });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.inferredExperimentKind).toBe(ExperimentKind.NO_INFERRED_TYPE);
    expect(updateExperimentKind).not.toHaveBeenCalled();
  });

  test('it should infer GenAI type when traces are present', async () => {
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        return res(ctx.json({ traces: [{ id: 'trace1' }] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        return res(ctx.json({ runs: [{ info: { run_uuid: 'run1' } }] }));
      }),
    );
    const updateExperimentKind = jest.fn();
    const { result } = renderTestHook({ updateExperimentKind });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.inferredExperimentKind).toBe(ExperimentKind.GENAI_DEVELOPMENT_INFERRED);
    expect(updateExperimentKind).not.toHaveBeenCalled();
  });

  test('it should infer custom model development when no traces, but training runs are present', async () => {
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        return res(ctx.json({ traces: [] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        return res(ctx.json({ runs: [{ info: { run_uuid: 'run1' } }] }));
      }),
    );
    const updateExperimentKind = jest.fn();
    const { result } = renderTestHook({ updateExperimentKind });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.inferredExperimentKind).toBe(ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED);
    expect(updateExperimentKind).not.toHaveBeenCalled();
  });

  test('it should skip inference logic if the experiment is still loading', async () => {
    const tracesApiSpyFn = jest.fn();
    const searchRunsApiSpyFn = jest.fn();
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        tracesApiSpyFn(req);
        return res(ctx.json({ traces: [] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        searchRunsApiSpyFn(req);
        return res(ctx.json({ runs: [{ info: { run_uuid: 'run1' } }] }));
      }),
    );
    const updateExperimentKind = jest.fn();
    const { result } = renderTestHook({
      experimentId: undefined,
      isLoadingExperiment: true,
      updateExperimentKind,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    expect(tracesApiSpyFn).not.toHaveBeenCalled();
    expect(searchRunsApiSpyFn).not.toHaveBeenCalled();
    expect(updateExperimentKind).not.toHaveBeenCalled();
  });

  test('it should skip inference logic if the hook is disabled', async () => {
    const tracesApiSpyFn = jest.fn();
    const searchRunsApiSpyFn = jest.fn();
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        tracesApiSpyFn(req);
        return res(ctx.json({ traces: [] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        searchRunsApiSpyFn(req);
        return res(ctx.json({ runs: [{ info: { run_uuid: 'run1' } }] }));
      }),
    );
    const updateExperimentKind = jest.fn();
    const { result } = renderTestHook({
      enabled: false,
      updateExperimentKind,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(tracesApiSpyFn).not.toHaveBeenCalled();
    expect(searchRunsApiSpyFn).not.toHaveBeenCalled();
    expect(updateExperimentKind).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useInferExperimentKind.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useInferExperimentKind.tsx
Signals: React

```typescript
import { useEffect, useMemo, useState } from 'react';
import { useExperimentContainsTraces } from '../../traces/hooks/useExperimentContainsTraces';
import { ExperimentKind, ExperimentPageTabName } from '../../../constants';
import { useExperimentContainsTrainingRuns } from '../../traces/hooks/useExperimentContainsTrainingRuns';
import { isEditableExperimentKind } from '../../../utils/ExperimentKindUtils';

export const useInferExperimentKind = ({
  experimentId,
  isLoadingExperiment,
  enabled = true,
  experimentTags,
  updateExperimentKind,
}: {
  experimentId?: string;
  isLoadingExperiment: boolean;
  enabled?: boolean;
  experimentTags?: { key?: string | null; value?: string | null }[] | null;
  updateExperimentKind: (params: { experimentId: string; kind: ExperimentKind }) => void;
}) => {
  const { containsTraces, isLoading: isTracesBeingDetermined } = useExperimentContainsTraces({
    experimentId,
    enabled,
  });

  const [isDismissed, setIsDismissed] = useState(false);

  const { containsRuns, isLoading: isTrainingRunsBeingDetermined } = useExperimentContainsTrainingRuns({
    experimentId,
    enabled,
  });

  const isLoading = enabled && (isLoadingExperiment || isTracesBeingDetermined || isTrainingRunsBeingDetermined);

  const inferredExperimentKind = useMemo(() => {
    if (!enabled || isLoading || isDismissed) {
      return undefined;
    }
    if (containsTraces) {
      return ExperimentKind.GENAI_DEVELOPMENT_INFERRED;
    }
    if (containsRuns) {
      return ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED;
    }
    return ExperimentKind.NO_INFERRED_TYPE;
  }, [
    // prettier-ignore
    enabled,
    isDismissed,
    isLoading,
    containsTraces,
    containsRuns,
  ]);

  const inferredExperimentPageTab = useMemo(() => {
    if (inferredExperimentKind === ExperimentKind.GENAI_DEVELOPMENT_INFERRED) {
      return ExperimentPageTabName.Traces;
    }
    if (inferredExperimentKind === ExperimentKind.CUSTOM_MODEL_DEVELOPMENT_INFERRED) {
      return ExperimentPageTabName.Runs;
    }
    return undefined;
  }, [inferredExperimentKind]);

  // automatically update the experiment type if it's not user-editable
  useEffect(() => {
    if (inferredExperimentKind && !isEditableExperimentKind(inferredExperimentKind)) {
      updateExperimentKind({ experimentId: experimentId ?? '', kind: inferredExperimentKind });
    }
  }, [experimentId, inferredExperimentKind, updateExperimentKind]);

  return {
    isLoading,
    inferredExperimentKind,
    inferredExperimentPageTab,
    dismiss: () => setIsDismissed(true),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useInitializeUIState.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useInitializeUIState.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { generateExperimentHash, useInitializeUIState } from './useInitializeUIState';
import { MemoryRouter } from '../../../../common/utils/RoutingUtils';
import { loadExperimentViewState } from '../utils/persistSearchFacets';
import {
  type ExperimentPageUIState,
  createExperimentPageUIState,
  RUNS_VISIBILITY_MODE,
} from '../models/ExperimentPageUIState';
import { createExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import { RunsChartType } from '../../runs-charts/runs-charts.types';
import { expandedEvaluationRunRowsUIStateInitializer } from '../utils/expandedRunsViewStateInitializer';
import { createBaseExperimentEntity, createBaseRunsData, createBaseRunsInfoEntity } from '../utils/test-utils';

const experimentIds = ['experiment_1'];

jest.mock('../utils/persistSearchFacets');
jest.mock('../utils/expandedRunsViewStateInitializer', () => ({
  expandedEvaluationRunRowsUIStateInitializer: jest.fn(),
}));

const initialUIState = createExperimentPageUIState();
const baseRunsData = createBaseRunsData();
const experiment1 = createBaseExperimentEntity();
const runInfoEntity1 = createBaseRunsInfoEntity();

describe('useInitializeUIState', () => {
  beforeEach(() => {
    jest.mocked(loadExperimentViewState).mockImplementation(() => ({}));
  });

  const renderParametrizedHook = () => {
    return renderHook(() => useInitializeUIState(experimentIds), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
  };

  test('should return empty UI state when no persisted state is present', () => {
    const { result } = renderParametrizedHook();
    const [uiState] = result.current;
    expect(uiState).toEqual(initialUIState);
  });

  test('should return persisted UI state when present', () => {
    const persistedState = {
      ...createExperimentPageSearchFacetsState(),
      ...initialUIState,
      orderByKey: 'metrics.m1',
      orderByAsc: true,
      viewMaximized: true,
      runListHidden: true,
      selectedColumns: ['metrics.m2'],
    };
    jest.mocked(loadExperimentViewState).mockImplementation(() => persistedState);
    const { result } = renderParametrizedHook();
    const [uiState] = result.current;
    expect(uiState).toEqual({
      ...initialUIState,
      viewMaximized: true,
      runListHidden: true,
      selectedColumns: ['metrics.m2'],
    });
  });

  test('should properly update UI state using both setter patterns', () => {
    const { result } = renderParametrizedHook();
    const [, setUIState] = result.current;

    const customUIState: ExperimentPageUIState = {
      runListHidden: true,
      runsPinned: ['run_1'],
      selectedColumns: ['metrics.m2'],
      viewMaximized: true,
      runsExpanded: { run_2: true },
      runsHidden: ['run_3'],
      runsHiddenMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
      compareRunCharts: [{ type: RunsChartType.BAR, deleted: false, isGenerated: true }],
      isAccordionReordered: false,
      groupBy: '',
      groupsExpanded: {},
      autoRefreshEnabled: true,
    };

    act(() => {
      setUIState(customUIState);
    });

    expect(result.current[0]).toEqual(customUIState);

    act(() => {
      setUIState((prevState) => ({
        ...prevState,
        viewMaximized: false,
        runsExpanded: { run_4: true },
        compareRunCharts: [],
      }));
    });

    expect(result.current[0]).toEqual({
      runListHidden: true,
      runsPinned: ['run_1'],
      selectedColumns: ['metrics.m2'],
      viewMaximized: false,
      runsExpanded: { run_4: true },
      runsHidden: ['run_3'],
      runsHiddenMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
      compareRunCharts: [],
      isAccordionReordered: false,
      groupBy: '',
      groupsExpanded: {},
      autoRefreshEnabled: true,
    });
  });

  describe('seedInitialUIState', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const runsData = { ...baseRunsData, runInfos: [runInfoEntity1] };

    test('should not seed UI state if there are no experiments or runs', () => {
      const { result } = renderParametrizedHook();
      const [, , seedInitialUIState] = result.current;

      act(() => {
        seedInitialUIState([], runsData);
      });

      expect(result.current[0]).toEqual(initialUIState);
      expect(expandedEvaluationRunRowsUIStateInitializer).not.toHaveBeenCalled();
    });

    test("should not trigger uiStateInitializers if it's not the first session", () => {
      const persistedState = {
        ...createExperimentPageSearchFacetsState(),
        ...initialUIState,
        orderByKey: 'metrics.m1',
        orderByAsc: true,
        viewMaximized: true,
        runListHidden: true,
        selectedColumns: ['metrics.m2'],
      };
      jest.mocked(loadExperimentViewState).mockImplementation(() => persistedState);

      const { result } = renderParametrizedHook();
      const [, , seedInitialUIState] = result.current;

      act(() => {
        seedInitialUIState([experiment1], runsData);
      });

      expect(expandedEvaluationRunRowsUIStateInitializer).not.toHaveBeenCalled();
    });

    test('should not trigger uiStateInitializers if there are no new jobs', async () => {
      const { result } = renderParametrizedHook();

      act(() => {
        result.current[2]([experiment1], runsData);
      });

      act(() => {
        result.current[2]([experiment1], runsData);
      });

      expect(expandedEvaluationRunRowsUIStateInitializer).toHaveBeenCalledTimes(1);
    });

    test('should trigger uiStateInitializers if there are new runs', async () => {
      const { result } = renderParametrizedHook();

      act(() => {
        result.current[2]([experiment1], runsData);
      });

      act(() => {
        result.current[2]([experiment1], {
          ...runsData,
          runInfos: [...runsData.runInfos, { ...runInfoEntity1, runUuid: 'run_2' }],
        });
      });

      expect(expandedEvaluationRunRowsUIStateInitializer).toHaveBeenCalledTimes(2);
    });

    test('should not trigger uiStateInitializers if non-unique run ids are sorted differently', async () => {
      const { result } = renderParametrizedHook();

      act(() => {
        result.current[2]([experiment1], {
          ...runsData,
          runInfos: [...runsData.runInfos, { ...runInfoEntity1, runUuid: 'run_2' }],
        });
      });

      act(() => {
        result.current[2]([experiment1], {
          ...runsData,
          runInfos: [{ ...runInfoEntity1, runUuid: 'run_2' }, ...runsData.runInfos],
        });
      });

      expect(expandedEvaluationRunRowsUIStateInitializer).toHaveBeenCalledTimes(1);
    });

    test('should trigger uiStateInitializers', () => {
      const { result } = renderParametrizedHook();
      const [, , seedInitialUIState] = result.current;

      act(() => {
        seedInitialUIState([experiment1], runsData);
      });

      const initializerInput = [[experiment1], initialUIState, runsData, false];

      // @ts-expect-error A spread argument must either have a tuple type or be passed to a rest parameter
      expect(expandedEvaluationRunRowsUIStateInitializer).toHaveBeenCalledWith(...initializerInput);
    });

    test('should trigger uiStateInitializers with isSeeded = true on 2nd invocation', () => {
      const { result } = renderParametrizedHook();
      jest.mocked(expandedEvaluationRunRowsUIStateInitializer).mockReturnValue(initialUIState);

      act(() => {
        result.current[2]([experiment1], runsData);
      });

      expect(expandedEvaluationRunRowsUIStateInitializer).toHaveBeenCalledWith(
        [experiment1],
        initialUIState,
        runsData,
        false,
      );

      act(() => {
        result.current[2]([experiment1], {
          ...runsData,
          runInfos: [...runsData.runInfos, { ...runInfoEntity1, runUuid: 'run_2' }],
        });
      });

      expect(expandedEvaluationRunRowsUIStateInitializer).toHaveBeenCalledWith(
        [experiment1],
        initialUIState,
        expect.objectContaining({ runInfos: expect.any(Array) }),
        true,
      );
    });
  });
});

describe('generateExperimentHash', () => {
  test('it generates a hash key based on the experiment and run data', () => {
    const runs = {
      ...baseRunsData,
      runInfos: [runInfoEntity1, { ...runInfoEntity1, runUuid: 'run_2' }],
    };
    expect(generateExperimentHash(runs, [experiment1])).toEqual('experiment_1:run_1:run_2');
  });

  test("returns null if there's no runs", () => {
    expect(generateExperimentHash(baseRunsData, [experiment1])).toBeNull();
  });

  test("returns null if there's no experiments", () => {
    const runs = {
      ...baseRunsData,
      runInfos: [runInfoEntity1],
    };
    expect(generateExperimentHash(runs, [])).toBeNull();
  });

  test('sorts experiments and runs before generating hash', () => {
    const runs = {
      ...baseRunsData,
      runInfos: [
        { ...runInfoEntity1, runUuid: 'run_3' },
        { ...runInfoEntity1, runUuid: 'run_1' },
        { ...runInfoEntity1, runUuid: 'run_2' },
      ],
    };
    const experiments = [
      { ...experiment1, experimentId: 'experiment_2' },
      { ...experiment1, experimentId: 'experiment_1' },
    ];

    expect(generateExperimentHash(runs, experiments)).toEqual('experiment_1:experiment_2:run_1:run_2:run_3');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useInitializeUIState.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useInitializeUIState.ts
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { EXPERIMENT_PAGE_UI_STATE_FIELDS, createExperimentPageUIState } from '../models/ExperimentPageUIState';
import { loadExperimentViewState } from '../utils/persistSearchFacets';
import { keys, pick } from 'lodash';
import type { ExperimentRunsSelectorResult } from '../utils/experimentRuns.selector';
import type { UseExperimentsResult } from './useExperiments';
import { useUpdateExperimentPageSearchFacets } from './useExperimentPageSearchFacets';
import { expandedEvaluationRunRowsUIStateInitializer } from '../utils/expandedRunsViewStateInitializer';

// prettier-ignore
const uiStateInitializers = [
  expandedEvaluationRunRowsUIStateInitializer,
];

type UpdateUIStateAction = {
  type: 'UPDATE_UI_STATE';
  payload: ExperimentPageUIState | ((current: ExperimentPageUIState) => ExperimentPageUIState);
};

type SetupInitUIStateAction = {
  type: 'INITIAL_UI_STATE_SEEDED';
};

type LoadNewExperimentAction = {
  type: 'LOAD_NEW_EXPERIMENT';
  payload: { uiState: ExperimentPageUIState; isSeeded: boolean; isFirstVisit: boolean; newPersistKey: string };
};

type UIStateContainer = {
  uiState: ExperimentPageUIState;
  currentPersistKey: string;
  isSeeded: boolean;
  /**
   * Indicates if the user is visiting the experiment page for the first time in the current session.
   */
  isFirstVisit: boolean;
};

const baseState = createExperimentPageUIState();

export const useInitializeUIState = (
  experimentIds: string[],
): [
  ExperimentPageUIState,
  React.Dispatch<React.SetStateAction<ExperimentPageUIState>>,
  (experiments: UseExperimentsResult, runs: ExperimentRunsSelectorResult) => void,
] => {
  const persistKey = useMemo(() => JSON.stringify(experimentIds.sort()), [experimentIds]);

  // Hash of the current experiment and runs. Used to determine if the UI state could be re-seeded.
  const [experimentHash, setExperimentHash] = useState<string | null>(null);

  const updateSearchFacets = useUpdateExperimentPageSearchFacets();

  const [{ uiState, isSeeded, isFirstVisit }, dispatchAction] = useReducer(
    (state: UIStateContainer, action: UpdateUIStateAction | SetupInitUIStateAction | LoadNewExperimentAction) => {
      if (action.type === 'UPDATE_UI_STATE') {
        const newState = typeof action.payload === 'function' ? action.payload(state.uiState) : action.payload;
        return {
          ...state,
          uiState: newState,
        };
      }
      if (action.type === 'INITIAL_UI_STATE_SEEDED') {
        if (state.isSeeded) {
          return state;
        }
        return {
          ...state,
          isSeeded: true,
        };
      }
      if (action.type === 'LOAD_NEW_EXPERIMENT') {
        return {
          uiState: action.payload.uiState,
          isFirstVisit: action.payload.isFirstVisit,
          currentPersistKey: action.payload.newPersistKey,
          isSeeded: action.payload.isSeeded,
        };
      }
      return state;
    },
    undefined,
    () => {
      const persistedViewState = loadExperimentViewState(persistKey);
      const persistedStateFound = Boolean(keys(persistedViewState || {}).length);
      const persistedUIState = persistedStateFound ? pick(persistedViewState, EXPERIMENT_PAGE_UI_STATE_FIELDS) : {};
      return {
        uiState: { ...baseState, ...persistedUIState },
        isSeeded: persistedStateFound,
        isFirstVisit: !persistedStateFound,
        currentPersistKey: persistKey,
      };
    },
  );

  const setUIState = useCallback(
    (newStateOrSelector: ExperimentPageUIState | ((current: ExperimentPageUIState) => ExperimentPageUIState)) => {
      dispatchAction({ type: 'UPDATE_UI_STATE', payload: newStateOrSelector });
    },
    [],
  );

  const seedInitialUIState = useCallback(
    (experiments: UseExperimentsResult, runs: ExperimentRunsSelectorResult) => {
      // Disable if there are no experiments/runs or if the state has already been persisted previously
      if (!isFirstVisit || experiments.length === 0 || runs.runInfos.length === 0) {
        return;
      }

      const newHash = generateExperimentHash(runs, experiments);

      if (experimentHash === newHash && isSeeded) {
        // Do not re-seed if the hash is the same, as we don't expect changes in the UI state
        return;
      }

      // Then, update the UI state using all known UI state initializers
      setUIState((uiState) => {
        const newUIState = uiStateInitializers.reduce(
          (state, initializer) => initializer(experiments, state, runs, isSeeded),
          {
            ...uiState,
          },
        );
        return newUIState;
      });

      setExperimentHash(newHash);
      if (!isSeeded) {
        // Mark the initial state as seeded (effectively set isSeeded to true)
        dispatchAction({ type: 'INITIAL_UI_STATE_SEEDED' });
      }
    },
    // prettier-ignore
    [
      isSeeded,
      isFirstVisit,
      setUIState,
      experimentHash,
    ],
  );

  // Each time persist key (experiment IDs) change, load persisted view state
  useEffect(() => {
    const persistedViewState = loadExperimentViewState(persistKey);
    const persistedUIState = pick(persistedViewState, EXPERIMENT_PAGE_UI_STATE_FIELDS);
    const isSeeded = Boolean(keys(persistedViewState || {}).length);
    const isFirstVisit = !isSeeded;

    dispatchAction({
      type: 'LOAD_NEW_EXPERIMENT',
      payload: { uiState: { ...baseState, ...persistedUIState }, isSeeded, isFirstVisit, newPersistKey: persistKey },
    });
  }, [persistKey]);

  return [uiState, setUIState, seedInitialUIState];
};

export const generateExperimentHash = (runs: ExperimentRunsSelectorResult, experiments: UseExperimentsResult) => {
  if (runs.runInfos.length === 0 || experiments.length === 0) {
    return null;
  }

  const sortedExperimentIds = experiments.map((exp) => exp.experimentId).sort();

  const sortedRunUuids = runs.runInfos.map((run) => run.runUuid).sort();

  return `${sortedExperimentIds.join(':')}:${sortedRunUuids.join(':')}`;
};
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRun.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRun.test.tsx
Signals: React

```typescript
import { describe, beforeAll, afterEach, jest, afterAll, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useLoggedModelsForExperimentRun } from './useLoggedModelsForExperimentRun';
import { setupServer } from '../../../../common/utils/setup-msw';
import { rest } from 'msw';
import { QueryClientProvider, QueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import React from 'react';

const mockExperimentId = 'experiment-123';
const mockRunId = 'run-456';
const mockModelId1 = 'model-789';
const mockModelId2 = 'model-101';

const mockRunInputs = {
  datasetInputs: [],
  modelInputs: [{ modelId: mockModelId1 }],
} as any;

const mockRunOutputs = {
  modelOutputs: [{ modelId: mockModelId2 }],
} as any;

const mockLoggedModelsData = [
  { id: 'logged-model-1', name: 'Model 1', attributes: { model_id: mockModelId1 } },
  { id: 'logged-model-2', name: 'Model 2', attributes: { model_id: mockModelId2 } },
];

// Setup MSW server to mock API calls
const server = setupServer(
  rest.post('/ajax-api/2.0/mlflow/logged-models/search', (req, res, ctx) => {
    return res(
      ctx.json({
        models: mockLoggedModelsData,
        next_page_token: null,
      }),
    );
  }),
);

// Create a wrapper with QueryClient for the hooks
const createHookWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLoggedModelsForExperimentRun', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  test('should disable the hook when inputs change from valid to empty', async () => {
    // Create a hook with valid inputs/outputs initially
    const { result, rerender } = renderHook(
      (props) => useLoggedModelsForExperimentRun(mockExperimentId, mockRunId, props.inputs, props.outputs),
      {
        wrapper: createHookWrapper(),
        initialProps: {
          inputs: mockRunInputs,
          outputs: mockRunOutputs,
        },
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.models).toEqual(mockLoggedModelsData);
    });

    rerender({
      inputs: { modelInputs: [] },
      outputs: { modelOutputs: [] },
    });

    // The hook should now be disabled and return no data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.models).toBeUndefined();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRun.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRun.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import { useSearchLoggedModelsQuery } from '../../../hooks/logged-models/useSearchLoggedModelsQuery';
import type { UseGetRunQueryResponseInputs, UseGetRunQueryResponseOutputs } from '../../run-page/hooks/useGetRunQuery';
import { compact, isEmpty, uniq } from 'lodash';

export const useLoggedModelsForExperimentRun = (
  experimentId: string,
  runId: string,
  runInputs?: UseGetRunQueryResponseInputs,
  runOutputs?: UseGetRunQueryResponseOutputs,
  enabled = true,
) => {
  const searchQuery = useMemo(() => {
    const inputs = runInputs?.modelInputs ?? [];
    const outputs = runOutputs?.modelOutputs ?? [];
    const allModels = [...inputs, ...outputs];
    const modelIds = uniq(compact(allModels.map(({ modelId }) => modelId)));

    if (isEmpty(modelIds)) {
      return undefined;
    }

    return `attributes.model_id IN (${modelIds.map((id) => `'${id}'`).join(',')})`;
  }, [runInputs, runOutputs]);

  const isHookEnabled = enabled && Boolean(searchQuery);

  const {
    data: loggedModelsData,
    isLoading,
    error,
  } = useSearchLoggedModelsQuery(
    { experimentIds: [experimentId], searchQuery },
    {
      enabled: isHookEnabled,
    },
  );

  return {
    // We explicitly check if the hook is supposed to be enabled before returning data,
    // otherwise react-query might erroneously return data from the cache.
    models: isHookEnabled ? loggedModelsData : undefined,
    // Same goes for `isLoading` which sometimes returns `true` despite the hook being disabled.
    isLoading: isHookEnabled && isLoading,
    error,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRunsTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRunsTable.test.tsx

```typescript
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from '../../../../common/utils/setup-msw';
import { useLoggedModelsForExperimentRunsTable } from './useLoggedModelsForExperimentRunsTable';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

describe('useLoggedModelsForExperimentRunsTable', () => {
  const server = setupServer();

  beforeAll(() => server.listen());

  beforeEach(() => {
    server.use(
      rest.post('/ajax-api/2.0/mlflow/logged-models/search', (req, res, ctx) =>
        res(
          ctx.json({
            models: [
              {
                info: {
                  source_run_id: 'run-1',
                  name: 'test-logged-model-1',
                  experiment_id: 'test-experiment',
                  model_id: 'model-id-1',
                },
              },
              {
                info: {
                  source_run_id: 'run-1',
                  name: 'test-logged-model-2',
                  experiment_id: 'test-experiment',
                  model_id: 'model-id-2',
                },
              },
              {
                info: {
                  source_run_id: 'run-3',
                  name: 'test-logged-model-3',
                  experiment_id: 'test-experiment',
                  model_id: 'model-id-3',
                },
              },
            ],
          }),
        ),
      ),
    );
  });

  test('should return logged models for experiment runs', async () => {
    const { result } = renderHook(() => useLoggedModelsForExperimentRunsTable({ experimentIds: ['test-experiment'] }), {
      wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
    });
    await waitFor(() => {
      expect(result.current).toEqual({
        'run-1': [
          {
            info: expect.objectContaining({
              source_run_id: 'run-1',
              name: 'test-logged-model-1',
              experiment_id: 'test-experiment',
              model_id: 'model-id-1',
            }),
          },
          {
            info: expect.objectContaining({
              source_run_id: 'run-1',
              name: 'test-logged-model-2',
              experiment_id: 'test-experiment',
              model_id: 'model-id-2',
            }),
          },
        ],
        'run-3': [
          {
            info: expect.objectContaining({
              source_run_id: 'run-3',
              name: 'test-logged-model-3',
              experiment_id: 'test-experiment',
              model_id: 'model-id-3',
            }),
          },
        ],
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsForExperimentRunsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useLoggedModelsForExperimentRunsTable.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import { useSearchLoggedModelsQuery } from '../../../hooks/logged-models/useSearchLoggedModelsQuery';
import type { LoggedModelProto } from '../../../types';

export const useLoggedModelsForExperimentRunsTable = ({
  experimentIds,
  enabled = true,
}: {
  experimentIds: string[];
  enabled?: boolean;
}) => {
  const { data: loggedModelsData } = useSearchLoggedModelsQuery(
    { experimentIds },
    {
      enabled,
    },
  );

  const loggedModelsByRunId = useMemo(
    () =>
      loggedModelsData?.reduce<Record<string, LoggedModelProto[]>>((acc, model) => {
        const { source_run_id } = model.info ?? {};
        if (!source_run_id) {
          return acc;
        }
        if (!acc[source_run_id]) {
          acc[source_run_id] = [];
        }
        acc[source_run_id].push(model);
        return acc;
      }, {}),
    [loggedModelsData],
  );

  return loggedModelsByRunId;
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 533
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 533 of 991)

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

---[FILE: useRunsChartTraceHighlight.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useRunsChartTraceHighlight.ts
Signals: React

```typescript
import { isUndefined, noop } from 'lodash';
import {
  type PropsWithChildren,
  createContext,
  createElement,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { shouldEnableUnifiedChartDataTraceHighlight } from '../../../../common/utils/FeatureUtils';

/**
 * Function used to highlight particular trace in the experiment runs chart,
 * for both hover and select scenarios.
 * Since implementation varies across chart types, the function is curryable where
 * two first-level parameters determine the target SVG selector paths to the trace within
 * target chart type.
 *
 * @param traceSelector selector path to the trace for a particular chart type
 * @param parentSelector selector path to the traces container for a particular chart type
 */
const highlightChartTracesFn =
  (traceSelector: string, parentSelector: string) =>
  /**
   * @param parent a HTML element containing the chart
   * @param hoverIndex index of a trace that should be hover-higlighted, set -1 to remove highlight
   * @param selectIndex index of a trace that should be select-higlighted, set -1 to remove highlight
   */
  (parent: HTMLElement, hoverIndex: number, selectIndex: number, numberOfBands = 0) => {
    const deselected = hoverIndex === -1 && selectIndex === -1;

    parent.querySelector('.is-hover-highlight')?.classList.remove('is-hover-highlight');
    if (hoverIndex > -1) {
      parent.querySelectorAll(traceSelector)[hoverIndex]?.classList.add('is-hover-highlight');
    }

    parent.querySelector('.is-selection-highlight')?.classList.remove('is-selection-highlight');
    if (selectIndex > -1) {
      parent.querySelectorAll(traceSelector)[selectIndex]?.classList.add('is-selection-highlight');
    }

    if (numberOfBands > 0) {
      const bandTraceIndex =
        selectIndex > -1 ? selectIndex - numberOfBands : hoverIndex > -1 ? hoverIndex - numberOfBands : -1;
      parent.querySelectorAll(traceSelector).forEach((e, index) => {
        e.classList.toggle('is-band', index >= 0 && index < numberOfBands);
        e.classList.toggle('is-band-highlighted', index === bandTraceIndex);
      });
    } else {
      parent.querySelectorAll(traceSelector).forEach((e) => e.classList.remove('is-band'));
    }

    if (deselected) {
      parent.querySelector(parentSelector)?.classList.remove('is-highlight');
    } else {
      parent.querySelector(parentSelector)?.classList.add('is-highlight');
    }
  };

/**
 * Type-specific implementation of highlightChartTracesFn for bar charts
 */
export const highlightBarTraces = highlightChartTracesFn('svg .trace.bars g.point', '.trace.bars');

/**
 * Type-specific implementation of highlightChartTracesFn for line charts
 */
export const highlightLineTraces = highlightChartTracesFn('svg .scatterlayer g.trace', '.scatterlayer');

/**
 * Type-specific implementation of highlightChartTracesFn for scatter and contour charts
 */
export const highlightScatterTraces = highlightChartTracesFn('svg .scatterlayer path.point', '.trace.scatter');

/**
 * This hook provides mechanisms necessary for highlighting SVG trace paths
 * in experiment runs charts.
 *
 * @param containerDiv HTML element containing the chart
 * @param selectedRunUuid currently selected run UUID (set to -1 if none)
 * @param runsData array containing run informations, should be the same order as provided to the chart
 * @param highlightFn a styling function that will be called when the trace should be (un)highlighted, please refer to `highlightCallbackFn()`
 */
export const useRenderRunsChartTraceHighlight = (
  containerDiv: HTMLElement | null,
  selectedRunUuid: string | null | undefined,
  runsData: { uuid?: string }[],
  highlightFn: ReturnType<typeof highlightChartTracesFn>,
  numberOfBands = 0,
) => {
  // Save the last runs data to be available immediately on non-stateful callbacks
  const lastRunsData = useRef(runsData);
  lastRunsData.current = runsData;

  const selectedTraceIndex = useMemo(() => {
    if (!containerDiv || !selectedRunUuid) {
      return -1;
    }
    return runsData.findIndex(({ uuid }) => uuid === selectedRunUuid);
  }, [runsData, containerDiv, selectedRunUuid]);

  const [hoveredPointIndex, setHoveredPointIndex] = useState(-1);
  const { onHighlightChange } = useRunsChartTraceHighlight();

  useEffect(() => {
    // Disable this hook variant if new highlight model is enabled
    if (shouldEnableUnifiedChartDataTraceHighlight()) {
      return;
    }
    if (!containerDiv) {
      return;
    }
    highlightFn(containerDiv, hoveredPointIndex, selectedTraceIndex, numberOfBands);
  }, [highlightFn, containerDiv, selectedTraceIndex, hoveredPointIndex, numberOfBands]);

  useEffect(() => {
    // Use this hook variant only if new highlight model is enabled
    if (!shouldEnableUnifiedChartDataTraceHighlight()) {
      return;
    }
    if (!containerDiv) {
      return;
    }
    // Here, we don't report stateful hovered run UUID since it's handled by the new highlight model
    highlightFn(containerDiv, -1, selectedTraceIndex, numberOfBands);
  }, [highlightFn, containerDiv, selectedTraceIndex, numberOfBands]);

  // Save the last selected trace index to be available immediately on non-stateful callbacks
  const lastSelectedTraceIndex = useRef(selectedTraceIndex);
  lastSelectedTraceIndex.current = selectedTraceIndex;

  const highlightChangeListener = useCallback(
    (newExtern: string | null) => {
      if (!containerDiv) {
        return;
      }

      const externallyHighlightedRunIndex = lastRunsData.current.findIndex(({ uuid }) => uuid === newExtern);
      highlightFn(containerDiv, externallyHighlightedRunIndex, lastSelectedTraceIndex.current, numberOfBands);
    },
    [highlightFn, containerDiv, numberOfBands],
  );

  // Listen to the highlight change event
  useEffect(() => onHighlightChange(highlightChangeListener), [onHighlightChange, highlightChangeListener]);

  return {
    selectedTraceIndex,
    hoveredPointIndex,
    // With the unified chart data trace highlight, we don't need to do costly state updates anymore
    setHoveredPointIndex: shouldEnableUnifiedChartDataTraceHighlight() ? noop : setHoveredPointIndex,
  };
};

export enum ChartsTraceHighlightSource {
  NONE,
  CHART,
  TABLE,
}

interface RunsChartsSetHighlightContextType {
  highlightDataTrace: (
    traceUuid: string | null,
    options?: { source?: ChartsTraceHighlightSource; shouldBlock?: boolean },
  ) => void;
  onHighlightChange: (fn: (traceUuid: string | null, source?: ChartsTraceHighlightSource) => void) => () => void;
}

const RunsChartsSetHighlightContext = createContext<RunsChartsSetHighlightContextType>({
  highlightDataTrace: () => {},
  onHighlightChange: () => () => {},
});

export const RunsChartsSetHighlightContextProvider = ({ children }: PropsWithChildren<unknown>) => {
  const highlightListenerFns = useRef<((traceUuid: string | null, source?: ChartsTraceHighlightSource) => void)[]>([]);
  const block = useRef(false);

  // Stable and memoized context value
  const contextValue = useMemo<RunsChartsSetHighlightContextType>(() => {
    // If new highlight model is disabled, disable entire feature by providint empty logic to the context
    if (!shouldEnableUnifiedChartDataTraceHighlight()) {
      return {
        highlightDataTrace: () => {},
        onHighlightChange: () => () => {},
      };
    }

    const notifyListeners = (traceUuid: string | null, source?: ChartsTraceHighlightSource) => {
      for (const fn of highlightListenerFns.current) {
        fn(traceUuid, source);
      }
    };

    const highlightDataTrace = (
      traceUuid: string | null,
      { shouldBlock, source }: { source?: ChartsTraceHighlightSource; shouldBlock?: boolean } = {},
    ) => {
      if (!isUndefined(shouldBlock)) {
        block.current = shouldBlock;
      } else if (block.current) {
        return;
      }
      notifyListeners(traceUuid, source);
    };

    const onHighlightChange = (listener: (traceUuid: string | null, source?: ChartsTraceHighlightSource) => void) => {
      highlightListenerFns.current.push(listener);
      return () => {
        highlightListenerFns.current = highlightListenerFns.current.filter((fn) => fn !== listener);
      };
    };

    return {
      highlightDataTrace,
      onHighlightChange,
    };
  }, []);

  return createElement(RunsChartsSetHighlightContext.Provider, { value: contextValue }, children);
};

export const useRunsChartTraceHighlight = () => useContext(RunsChartsSetHighlightContext);
```

--------------------------------------------------------------------------------

---[FILE: useRunsHighlightTableRow.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useRunsHighlightTableRow.tsx
Signals: React

```typescript
import { type RefObject, useCallback, useEffect } from 'react';
import { ChartsTraceHighlightSource, useRunsChartTraceHighlight } from './useRunsChartTraceHighlight';
import type { CellMouseOverEvent } from '@ag-grid-community/core';

const DEFAULT_HIGH_LIGHT_CLASS_NAME = 'is-highlighted';

/**
 * Helper hook adding support for useRunsChartTraceSetHighlight() logic to a ag-grid table rows
 */
export const useRunsHighlightTableRow = (
  /**
   * Reference to the container element of the table.
   */
  containerElementRef: RefObject<HTMLDivElement>,
  /**
   * Class name to be added to the highlighted row.
   */
  highlightedClassName = DEFAULT_HIGH_LIGHT_CLASS_NAME,
  /**
   * Additional selector prefix to be used to find the row element.
   */
  findInFlexColumns = false,
  /**
   * Optional function to extract the row UUID from the table data, used in row hover callback.
   */
  getRowUuid?: (data: any) => string | undefined,
) => {
  const { onHighlightChange, highlightDataTrace } = useRunsChartTraceHighlight();
  /**
   * Listener function that highlights a row in the table by adding a class to it.
   */
  const highlightFn = useCallback(
    (rowUuid: string | null, source?: ChartsTraceHighlightSource) => {
      // First, quickly remove the highlight class from the previous highlighted row
      const existingHighlightedRowElement = containerElementRef.current?.querySelector(`.${highlightedClassName}`);

      const additionalSelectorPrefix = findInFlexColumns ? '.ag-center-cols-viewport' : '';

      // Find the new row element and add the highlight class to it
      const rowElement = containerElementRef.current?.querySelector(
        `${additionalSelectorPrefix} .ag-row[row-id="${rowUuid}"]`,
      );
      if (existingHighlightedRowElement && existingHighlightedRowElement !== rowElement) {
        existingHighlightedRowElement.classList.remove(highlightedClassName);
      }

      // Do not highlight the row if the source of highlight event is the table itself
      if (source === ChartsTraceHighlightSource.TABLE) {
        return;
      }

      rowElement && rowElement.classList.add(highlightedClassName);
    },
    [containerElementRef, highlightedClassName, findInFlexColumns],
  );

  // Subscribe to the highlight change event
  useEffect(() => onHighlightChange(highlightFn), [highlightFn, onHighlightChange]);

  // Create event handlers for table cell mouse over and out events
  const cellMouseOverHandler = useCallback(
    ({ data }: CellMouseOverEvent) => {
      const isGroupRow = typeof data === 'object' && 'groupParentInfo' in data;
      // Extract the trace UUID from the data
      // Use runUuid for non-group rows and rowUuid for group rows
      const dataTraceUuid = getRowUuid ? getRowUuid({ data }) : isGroupRow ? data.rowUuid : data.runUuid;

      highlightDataTrace(dataTraceUuid, {
        source: ChartsTraceHighlightSource.TABLE,
      });
    },
    [highlightDataTrace, getRowUuid],
  );

  const cellMouseOutHandler = useCallback(() => highlightDataTrace(null), [highlightDataTrace]);

  return { cellMouseOverHandler, cellMouseOutHandler };
};
```

--------------------------------------------------------------------------------

---[FILE: useSampledMetricHistory.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useSampledMetricHistory.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useSampledMetricHistory } from './useSampledMetricHistory';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
import { fetchEndpoint } from '../../../../common/utils/FetchUtils';
import { getSampledMetricHistoryBulkAction } from '../../../sdk/SampledMetricHistoryService';
import React from 'react';
import { shouldEnableGraphQLSampledMetrics } from '../../../../common/utils/FeatureUtils';
import { IntlProvider } from 'react-intl';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';

jest.mock('../../../../common/utils/FeatureUtils', () => ({
  shouldEnableGraphQLSampledMetrics: jest.fn(),
}));

jest.mock('../../../sdk/SampledMetricHistoryService', () => ({
  getSampledMetricHistoryBulkAction: jest.fn(),
}));

const hookWrapper: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <IntlProvider locale="en">
    <TestApolloProvider>
      <MockedReduxStoreProvider
        state={{
          entities: {
            sampledMetricsByRunUuid: {},
          },
        }}
      >
        {children}
      </MockedReduxStoreProvider>
    </TestApolloProvider>
  </IntlProvider>
);

describe('useSampledMetricHistory (REST)', () => {
  beforeEach(() => {
    jest.mocked(shouldEnableGraphQLSampledMetrics).mockImplementation(() => false);
    jest.mocked(getSampledMetricHistoryBulkAction).mockClear();
    jest.mocked(getSampledMetricHistoryBulkAction).mockImplementation(
      () =>
        ({
          payload: Promise.resolve({}),
          type: 'GET_SAMPLED_METRIC_HISTORY_API_BULK',
        } as any),
    );
  });

  test('should create service calling action when run UUIDs and metric keys are provided', async () => {
    renderHook(
      () =>
        useSampledMetricHistory({
          runUuids: ['run-uuid-1'],
          metricKeys: ['metric-a'],
          enabled: true,
          autoRefreshEnabled: true,
        }),
      {
        wrapper: hookWrapper,
      },
    );

    await waitFor(() => {
      expect(getSampledMetricHistoryBulkAction).toHaveBeenCalledWith(
        ['run-uuid-1'],
        'metric-a',
        undefined,
        undefined,
        undefined,
      );
    });
  });

  test('not call service action when run UUIDs are not provided', async () => {
    renderHook(
      () =>
        useSampledMetricHistory({
          runUuids: [],
          metricKeys: ['metric-a'],
          enabled: true,
          autoRefreshEnabled: true,
        }),
      {
        wrapper: hookWrapper,
      },
    );

    expect(getSampledMetricHistoryBulkAction).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useSampledMetricHistory.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useSampledMetricHistory.tsx
Signals: React, Redux/RTK

```typescript
import { chunk, isEqual, keyBy } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../../redux-types';
import { createChartAxisRangeKey } from '../components/RunsCharts.common';
import { getSampledMetricHistoryBulkAction } from '../../../sdk/SampledMetricHistoryService';
import type { SampledMetricsByRunUuidState } from '@mlflow/mlflow/src/experiment-tracking/types';
import { EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL } from '../../../utils/MetricsUtils';
import Utils from '../../../../common/utils/Utils';
import { shouldEnableGraphQLSampledMetrics } from '../../../../common/utils/FeatureUtils';
import { useSampledMetricHistoryGraphQL } from './useSampledMetricHistoryGraphQL';

type SampledMetricData = SampledMetricsByRunUuidState[string][string][string];

export type SampledMetricsByRun = {
  runUuid: string;
} & {
  [metricKey: string]: SampledMetricData;
};

const SAMPLED_METRIC_HISTORY_API_RUN_LIMIT = 100;

/**
 * Automatically fetches sampled metric history for runs, used in run runs charts.
 * After updating list of metrics or runs, optimizes the request and fetches
 * only the missing entries.
 *
 * REST-based implementation.
 */
const useSampledMetricHistoryREST = (params: {
  runUuids: string[];
  metricKeys: string[];
  maxResults?: number;
  range?: [number, number];
  enabled?: boolean;
  autoRefreshEnabled?: boolean;
}) => {
  const { metricKeys, runUuids, enabled, maxResults, range, autoRefreshEnabled } = params;
  const dispatch = useDispatch<ThunkDispatch>();

  const { resultsByRunUuid, isLoading, isRefreshing } = useSelector(
    (store: ReduxState) => {
      const rangeKey = createChartAxisRangeKey(range);

      let anyRunRefreshing = false;
      let anyRunLoading = false;

      const returnValues: SampledMetricsByRun[] = runUuids.map((runUuid) => {
        const metricsByMetricKey = metricKeys.reduce(
          (dataByMetricKey: { [key: string]: SampledMetricData }, metricKey: string) => {
            const runMetricData = store.entities.sampledMetricsByRunUuid[runUuid]?.[metricKey]?.[rangeKey];

            if (!runMetricData) {
              return dataByMetricKey;
            }

            anyRunLoading = anyRunLoading || Boolean(runMetricData.loading);
            anyRunRefreshing = anyRunRefreshing || Boolean(runMetricData.refreshing);

            dataByMetricKey[metricKey] = runMetricData;
            return dataByMetricKey;
          },
          {},
        );

        return {
          runUuid,
          ...metricsByMetricKey,
        };
      });

      return {
        isLoading: anyRunLoading,
        isRefreshing: anyRunRefreshing,
        resultsByRunUuid: keyBy(returnValues, 'runUuid'),
      };
    },
    (left, right) =>
      isEqual(left.resultsByRunUuid, right.resultsByRunUuid) &&
      left.isLoading === right.isLoading &&
      left.isRefreshing === right.isRefreshing,
  );

  const refreshFn = useCallback(() => {
    metricKeys.forEach((metricKey) => {
      chunk(runUuids, SAMPLED_METRIC_HISTORY_API_RUN_LIMIT).forEach((runUuidsChunk) => {
        const action = getSampledMetricHistoryBulkAction(runUuidsChunk, metricKey, maxResults, range, 'all');
        dispatch(action);
      });
    });
  }, [dispatch, maxResults, runUuids, metricKeys, range]);

  const refreshTimeoutRef = useRef<number | undefined>(undefined);
  const autoRefreshEnabledRef = useRef(autoRefreshEnabled && params.enabled);
  autoRefreshEnabledRef.current = autoRefreshEnabled && params.enabled;

  // Serialize runUuids to a string to use as a dependency in the effect,
  // directly used runUuids can cause unnecessary re-fetches
  const runUuidsSerialized = useMemo(() => runUuids.join(','), [runUuids]);

  // Regular single fetch effect with no auto-refresh capabilities. Used if auto-refresh is disabled.
  useEffect(() => {
    if (!enabled || autoRefreshEnabled) {
      return;
    }
    metricKeys.forEach((metricKey) => {
      chunk(runUuids, SAMPLED_METRIC_HISTORY_API_RUN_LIMIT).forEach((runUuidsChunk) => {
        const action = getSampledMetricHistoryBulkAction(runUuidsChunk, metricKey, maxResults, range);
        dispatch(action);
      });
    });
  }, [dispatch, maxResults, runUuids, metricKeys, range, enabled, autoRefreshEnabled]);

  // A fetch effect with auto-refresh capabilities. Used only if auto-refresh is enabled.
  useEffect(() => {
    let hookUnmounted = false;
    if (!enabled || !autoRefreshEnabled) {
      return;
    }

    // Base fetching function, used for both initial call and subsequent auto-refresh calls
    const fetchMetricsFn = async (isAutoRefreshing = false) => {
      const runUuids = runUuidsSerialized.split(',').filter((runUuid: string) => runUuid !== '');
      await Promise.all(
        metricKeys.map(async (metricKey) =>
          Promise.all(
            chunk(runUuids, SAMPLED_METRIC_HISTORY_API_RUN_LIMIT).map(async (runUuidsChunk) =>
              dispatch(
                getSampledMetricHistoryBulkAction(
                  runUuidsChunk,
                  metricKey,
                  maxResults,
                  range,
                  isAutoRefreshing ? 'auto' : undefined,
                ),
              ),
            ),
          ),
        ),
      );
    };

    const scheduleRefresh = async () => {
      // Initial check to confirm that auto-refresh is still enabled and the hook is still mounted
      if (!autoRefreshEnabledRef.current || hookUnmounted) {
        return;
      }
      try {
        await fetchMetricsFn(true);
      } catch (e) {
        // In case of error during auto-refresh, log the error but do break the auto-refresh loop
        Utils.logErrorAndNotifyUser(e);
      }
      clearTimeout(refreshTimeoutRef.current);

      // After loading the data, schedule the next refresh if the hook is still enabled and mounted
      if (!autoRefreshEnabledRef.current || hookUnmounted) {
        return;
      }

      refreshTimeoutRef.current = window.setTimeout(
        scheduleRefresh,
        EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL,
      );
    };

    fetchMetricsFn().then(scheduleRefresh);

    return () => {
      // Mark the hook as unmounted to prevent scheduling new auto-refreshes with current data
      hookUnmounted = true;

      // Clear the timeout
      clearTimeout(refreshTimeoutRef.current);
    };
  }, [dispatch, maxResults, runUuidsSerialized, metricKeys, range, enabled, autoRefreshEnabled]);

  return { isLoading, isRefreshing, resultsByRunUuid, refresh: refreshFn };
};

/**
 * A switcher hook that selects between the REST and GraphQL implementations of the
 * `useSampledMetricHistory` hook based on flags and parameter context.
 */
export const useSampledMetricHistory = (params: {
  runUuids: string[];
  metricKeys: string[];
  maxResults?: number;
  range?: [number, number];
  enabled?: boolean;
  autoRefreshEnabled?: boolean;
}) => {
  const { metricKeys, enabled, autoRefreshEnabled, runUuids } = params;

  // We should use the apollo hook if there is only one metric key and the number of runUuids is less than 100.
  // To be improved after endpoint will start supporting multiple metric keys.
  const shouldUseGraphql = shouldEnableGraphQLSampledMetrics() && metricKeys.length === 1 && runUuids.length <= 100;

  const legacyResult = useSampledMetricHistoryREST({
    ...params,
    enabled: enabled && !shouldUseGraphql,
    autoRefreshEnabled: autoRefreshEnabled && !shouldUseGraphql,
  });

  const graphQlResult = useSampledMetricHistoryGraphQL({
    ...params,
    metricKey: metricKeys[0],
    enabled: enabled && shouldUseGraphql,
    autoRefreshEnabled: autoRefreshEnabled && shouldUseGraphql,
  });

  return shouldUseGraphql ? graphQlResult : legacyResult;
};
```

--------------------------------------------------------------------------------

---[FILE: useSampledMetricHistoryGraphQL.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useSampledMetricHistoryGraphQL.test.tsx

```typescript
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { graphql } from 'msw';
import { setupServer } from '../../../../common/utils/setup-msw';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';
import type { GetMetricHistoryBulkInterval } from '../../../../graphql/__generated__/graphql';
import { GetRun, MlflowRunStatus } from '../../../../graphql/__generated__/graphql';
import { useSampledMetricHistoryGraphQL } from './useSampledMetricHistoryGraphQL';
import { IntlProvider } from 'react-intl';
import Utils from '../../../../common/utils/Utils';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@mlflow/mlflow/src/common/utils/graphQLHooks';

const createMetrics = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    __typename: 'MlflowMetricWithRunId' as const,
    timestamp: (i * 1000).toString(),
    step: i.toString(),
    runId: `test-run-uuid-${i % 10}`,
    key: 'test-metric-key',
    value: i,
  }));

describe('useSampledMetricHistoryGraphQL', () => {
  const server = setupServer();

  beforeEach(() => {
    server.resetHandlers();
  });

  const getApolloClient = () => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: createHttpLink(),
    });
  };

  const renderTestHook = (runUuids: string[]) =>
    renderHook(
      () =>
        useSampledMetricHistoryGraphQL({
          metricKey: 'test-metric-key',
          runUuids,
          enabled: true,
          autoRefreshEnabled: true,
        }),
      {
        wrapper: ({ children }) => (
          <IntlProvider locale="en">
            <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>
          </IntlProvider>
        ),
      },
    );

  it('returns a correct data payload corresponding to mocked response', async () => {
    server.use(
      graphql.query<GetMetricHistoryBulkInterval>('GetMetricHistoryBulkInterval', (req, res, ctx) =>
        res(
          ctx.data({
            mlflowGetMetricHistoryBulkInterval: {
              __typename: 'MlflowGetMetricHistoryBulkIntervalResponse',
              apiError: null,
              metrics: createMetrics(100),
            },
          }),
        ),
      ),
    );

    const { result } = renderTestHook(['test-run-uuid-2', 'test-run-uuid-5']);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Known run uuids should have 10 metric entries each
    expect(result.current.resultsByRunUuid['test-run-uuid-2']?.['test-metric-key'].metricsHistory).toHaveLength(10);
    expect(result.current.resultsByRunUuid['test-run-uuid-5']?.['test-metric-key'].metricsHistory).toHaveLength(10);

    // Unknown run uuid should not have any metric entries
    expect(result.current.resultsByRunUuid['test-run-uuid-118']?.['test-metric-key'].metricsHistory).toBeUndefined();
  });

  it('displays "resource not found" error if relevant message comes from the backend', async () => {
    jest.spyOn(Utils, 'displayGlobalErrorNotification');

    server.use(
      graphql.query<GetMetricHistoryBulkInterval>('GetMetricHistoryBulkInterval', (req, res, ctx) =>
        res(
          ctx.data({
            mlflowGetMetricHistoryBulkInterval: {
              __typename: 'MlflowGetMetricHistoryBulkIntervalResponse',
              apiError: {
                __typename: 'ApiError',
                code: 'RESOURCE_DOES_NOT_EXIST',
                message: 'Requested resource does not exist',
              },
              metrics: null,
            },
          }),
        ),
      ),
    );

    const { result } = renderTestHook(['test-run-uuid-1']);

    await waitFor(() => {
      expect(Utils.displayGlobalErrorNotification).toHaveBeenCalledWith('Requested resource does not exist');
    });

    expect(result.current.apiError).toEqual(expect.objectContaining({ code: 'RESOURCE_DOES_NOT_EXIST' }));
  });

  it('returns apollo-level error if occurred', async () => {
    jest.spyOn(Utils, 'displayGlobalErrorNotification');

    server.use(
      graphql.query<GetMetricHistoryBulkInterval>('GetMetricHistoryBulkInterval', (req, res, ctx) =>
        res(
          ctx.status(400),
          ctx.data({
            mlflowGetMetricHistoryBulkInterval: {
              __typename: 'MlflowGetMetricHistoryBulkIntervalResponse',
              apiError: null,
              metrics: null,
            },
          }),
        ),
      ),
    );

    const { result } = renderTestHook(['test-run-uuid-1']);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useSampledMetricHistoryGraphQL.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useSampledMetricHistoryGraphQL.tsx
Signals: React

```typescript
import { gql, NetworkStatus } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL } from '../../../utils/MetricsUtils';
import { groupBy, keyBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import type { SampledMetricsByRun } from './useSampledMetricHistory';
import type { GetMetricHistoryBulkInterval } from '../../../../graphql/__generated__/graphql';
import Utils from '../../../../common/utils/Utils';
import { useIntl } from 'react-intl';

const GET_METRIC_HISTORY_BULK_INTERVAL = gql`
  query GetMetricHistoryBulkInterval($data: MlflowGetMetricHistoryBulkIntervalInput!)
  @component(name: "MLflow.ExperimentRunTracking") {
    mlflowGetMetricHistoryBulkInterval(input: $data) {
      __typename
      metrics {
        timestamp
        step
        runId
        key
        value
      }
      apiError {
        code
        message
      }
    }
  }
`;

export const useSampledMetricHistoryGraphQL = ({
  metricKey,
  runUuids,
  autoRefreshEnabled,
  enabled,
  maxResults = 320,
  range,
}: {
  runUuids: string[];
  metricKey: string;
  maxResults?: number;
  range?: [number, number];
  enabled?: boolean;
  autoRefreshEnabled?: boolean;
}) => {
  const intl = useIntl();
  const { data, refetch, startPolling, stopPolling, networkStatus, error } = useQuery<GetMetricHistoryBulkInterval>(
    GET_METRIC_HISTORY_BULK_INTERVAL,
    {
      skip: !enabled,
      notifyOnNetworkStatusChange: true,
      pollInterval: autoRefreshEnabled ? EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL : undefined,
      onCompleted(data) {
        if (data.mlflowGetMetricHistoryBulkInterval?.apiError?.code === 'RESOURCE_DOES_NOT_EXIST') {
          Utils.displayGlobalErrorNotification(
            intl.formatMessage({
              defaultMessage: 'Requested resource does not exist',
              description:
                'Error message displayed when a requested run does not exist while fetching sampled metric data',
            }),
          );
        } else if (data.mlflowGetMetricHistoryBulkInterval?.apiError?.message) {
          Utils.logErrorAndNotifyUser(new Error(data.mlflowGetMetricHistoryBulkInterval.apiError.message));
        }
      },
      variables: {
        data: {
          runIds: runUuids,
          metricKey,
          startStep: range?.[0] ?? null,
          endStep: range?.[1] ?? null,
          maxResults,
        },
      },
    },
  );

  useEffect(() => {
    if (autoRefreshEnabled) {
      startPolling(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL);
    } else {
      stopPolling();
    }
  }, [autoRefreshEnabled, startPolling, stopPolling]);

  const resultsByRunUuid = useMemo<Record<string, SampledMetricsByRun>>(() => {
    if (data) {
      const metrics = data?.mlflowGetMetricHistoryBulkInterval?.metrics;
      const metricsByRunId = groupBy(metrics, 'runId');

      // Transform the data into the already existing format
      return keyBy(
        runUuids.map(
          (runId) =>
            ({
              runUuid: runId,
              [metricKey]: {
                metricsHistory: metricsByRunId[runId]?.map(({ key, step, timestamp, value }) => ({
                  key: key ?? undefined,
                  step: Number(step),
                  timestamp: Number(timestamp),
                  value: value ?? undefined,
                })),
              },
            } as SampledMetricsByRun),
        ),
        'runUuid',
      );
    }

    return {};
  }, [data, metricKey, runUuids]);

  const isLoading = networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.setVariables;
  const isRefreshing = networkStatus === NetworkStatus.poll;
  return {
    resultsByRunUuid,
    isLoading,
    isRefreshing,
    refresh: refetch,
    error,
    apiError: data?.mlflowGetMetricHistoryBulkInterval?.apiError,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: differenceView.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/differenceView.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import type { KeyValueEntity } from '../../../../common/types';
import type { RunsChartsDifferenceCardConfig } from '../runs-charts.types';
import { DifferenceCardConfigCompareGroup, RunsChartType } from '../runs-charts.types';
import {
  getDifferenceChartDisplayedValue,
  differenceView,
  isDifferent,
  getDifferenceViewDataGroups,
  DifferenceChartCellDirection,
} from './differenceView';

describe('getFixedPointValue correctly rounds numbers and parses strings', () => {
  test('should convert number to 2 decimal points', () => {
    expect(getDifferenceChartDisplayedValue(3.33333333)).toEqual('3.33');
  });

  test('should convert number to 5 decimal points', () => {
    expect(getDifferenceChartDisplayedValue(3.123456, 5)).toEqual('3.12346');
  });

  test('should not change strings', () => {
    expect(getDifferenceChartDisplayedValue('this is a string', 5)).toEqual('this is a string');
  });
});

describe('differenceView correctly displays text indicating a positive or negative difference', () => {
  test('should display positive text with +', () => {
    expect(differenceView(3.33333333, 1)).toEqual({ label: '+2.33', direction: DifferenceChartCellDirection.POSITIVE });
  });

  test('should display negative text with -', () => {
    expect(differenceView(1, 3.12345)).toEqual({ label: '-2.12', direction: DifferenceChartCellDirection.NEGATIVE });
  });

  test('should ignore strings', () => {
    expect(differenceView('hi', 3.12345)).toEqual(undefined);
  });
});

describe('isDifferent correctly indicates whether two values are different', () => {
  test('should indicate different types as different', () => {
    expect(isDifferent(3.33333333, 'hi')).toEqual(true);
    expect(isDifferent('hi', 12345)).toEqual(true);
  });

  test('should indicate different numbers as different', () => {
    expect(isDifferent(3.33333333, 1)).toEqual(true);
    expect(isDifferent(1, 3.12345)).toEqual(true);
  });

  test('should indicate different strings as different', () => {
    expect(isDifferent('hi', 'hello')).toEqual(true);
  });

  test('should indicate the same strings as not different', () => {
    expect(isDifferent('hi', 'hi')).toEqual(false);
  });

  test('should indicate the same numbers as not different', () => {
    expect(isDifferent(3.33333333, 3.33333333)).toEqual(false);
  });
});

describe('getDifferenceViewDataGroups correctly groups metrics, system metrics, and parameters', () => {
  const cardConfig: RunsChartsDifferenceCardConfig = {
    type: RunsChartType.DIFFERENCE,
    chartName: 'someChartName',
    showChangeFromBaseline: true,
    showDifferencesOnly: false,
    compareGroups: [
      DifferenceCardConfigCompareGroup.MODEL_METRICS,
      DifferenceCardConfigCompareGroup.SYSTEM_METRICS,
      DifferenceCardConfigCompareGroup.PARAMETERS,
    ],
    deleted: false,
    isGenerated: false,
    baselineColumnUuid: 'runUuid1',
  };

  const previewData = [
    {
      uuid: 'runUuid1',
      displayName: 'Run 1', // Add displayName property
      params: {
        algorithm: { key: 'algorithm', value: 'linear' },
      }, // Add params property
      metrics: {
        metric1: { key: 'metric1', value: 1, step: 1, timestamp: 0 },
        'system/metric': { key: 'system/metric', value: 1, step: 1, timestamp: 0 },
      },
      tags: {
        tag1: { key: 'tag1', value: 'val1' } as KeyValueEntity,
        'mlflow.user': { key: 'mlflow.user', value: 'user1' } as KeyValueEntity,
      },
      images: {},
    },
    {
      uuid: 'runUuid2',
      user_id: 'user1',
      displayName: 'Run 2', // Add displayName property
      params: {
        algorithm: { key: 'algorithm', value: 'logistic' },
      }, // Add params property
      metrics: {
        metric1: { key: 'metric1', value: 2, step: 1, timestamp: 0 },
        'system/metric': { key: 'system/metric', value: 2, step: 1, timestamp: 0 },
      },
      tags: {
        tag1: { key: 'tag1', value: 'val2' } as KeyValueEntity,
        'mlflow.user': { key: 'mlflow.user', value: 'user1' } as KeyValueEntity,
      },
      images: {},
    },
  ];

  test('should group metrics', () => {
    const result = getDifferenceViewDataGroups(previewData, cardConfig, 'headingColumn', null);
    expect(result.modelMetrics).toEqual([
      {
        headingColumn: 'metric1',
        runUuid1: 1,
        runUuid2: 2,
      },
    ]);
    expect(result.systemMetrics).toEqual([
      {
        headingColumn: 'system/metric',
        runUuid1: 1,
        runUuid2: 2,
      },
    ]);
    expect(result.parameters).toEqual([
      {
        headingColumn: 'algorithm',
        runUuid1: 'linear',
        runUuid2: 'logistic',
      },
    ]);
    expect(result.tags).toEqual([
      {
        headingColumn: 'tag1',
        runUuid1: 'val1',
        runUuid2: 'val2',
      },
    ]);
  });
});
```

--------------------------------------------------------------------------------

````

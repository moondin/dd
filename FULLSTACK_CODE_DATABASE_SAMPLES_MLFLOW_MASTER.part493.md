---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 493
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 493 of 991)

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

---[FILE: useExperimentRuns.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentRuns.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDispatch } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../../redux-types';
import { loadMoreRunsApi, searchRunsApi } from '../../../actions';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { createSearchRunsParams, fetchModelVersionsForRuns } from '../utils/experimentPage.fetch-utils';
import type { ExperimentRunsSelectorResult } from '../utils/experimentRuns.selector';
import { experimentRunsSelector } from '../utils/experimentRuns.selector';
import type { ExperimentQueryParamsSearchFacets } from './useExperimentPageSearchFacets';
import type { ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import { ErrorWrapper } from '../../../../common/utils/ErrorWrapper';
import { searchModelVersionsApi } from '../../../../model-registry/actions';
import { PredefinedError } from '@databricks/web-shared/errors';
import { mapErrorWrapperToPredefinedError } from '../../../../common/utils/ErrorUtils';
import { shouldUsePredefinedErrorsInExperimentTracking } from '../../../../common/utils/FeatureUtils';
import Utils from '../../../../common/utils/Utils';
import { useExperimentRunsAutoRefresh } from './useExperimentRunsAutoRefresh';
import type { RunEntity, SearchRunsApiResponse } from '../../../types';

export type FetchRunsHookParams = ReturnType<typeof createSearchRunsParams> & {
  requestedFacets: ExperimentPageSearchFacetsState;
};

export type FetchRunsHookFunction = (
  params: FetchRunsHookParams,
  options?: {
    isAutoRefreshing?: boolean;
    discardResultsFn?: (lastRequestedParams: FetchRunsHookParams, response?: SearchRunsApiResponse) => boolean;
  },
) => Promise<{ runs: RunEntity[]; next_page_token?: string }>;

// Calculate actual params to use for fetching runs
const createFetchRunsRequestParams = (
  searchFacets: ExperimentQueryParamsSearchFacets | null,
  experimentIds: string[],
  runsPinned: string[],
): FetchRunsHookParams | null => {
  if (!searchFacets || !experimentIds.length) {
    return null;
  }
  const searchParams = createSearchRunsParams(experimentIds, { ...searchFacets, runsPinned }, Date.now());
  return { ...searchParams, requestedFacets: searchFacets };
};

/**
 * This hook will request for new runs data based on the current experiment page search facets and UI state.
 * Replaces GetExperimentRunsContext and a substantial portion of <ExperimentRuns> component stack.
 */
export const useExperimentRuns = (
  uiState: ExperimentPageUIState,
  searchFacets: ExperimentQueryParamsSearchFacets | null,
  experimentIds: string[],
  disabled = false,
) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const [runsData, setRunsData] = useState<ExperimentRunsSelectorResult>(() => createEmptyRunsResult());

  const enableWorkspaceModelsRegistryCall = true;

  const persistKey = useMemo(() => (experimentIds ? JSON.stringify(experimentIds.sort()) : null), [experimentIds]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);
  const [isInitialLoadingRuns, setIsInitialLoadingRuns] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<ErrorWrapper | Error | null>(null);
  const cachedPinnedRuns = useRef<string[]>([]);

  const lastFetchedTime = useRef<number | null>(null);
  const lastRequestedParams = useRef<FetchRunsHookParams | null>(null);
  const lastSuccessfulRequestedParams = useRef<FetchRunsHookParams | null>(null);

  // Reset initial loading state when experiment IDs change
  useEffect(() => {
    if (disabled) {
      return;
    }
    setIsInitialLoadingRuns(true);
    setRunsData(createEmptyRunsResult());
  }, [persistKey, disabled]);

  const setResultRunsData = useCallback(
    (store: ReduxState, experimentIds: string[], requestedFacets: ExperimentPageSearchFacetsState) => {
      setRunsData(
        experimentRunsSelector(store, {
          datasetsFilter: requestedFacets.datasetsFilter,
          lifecycleFilter: requestedFacets.lifecycleFilter,
          modelVersionFilter: requestedFacets.modelVersionFilter,
          // In the new version of the view state, experiment IDs are used instead of full experiment entities:
          experiments: [],
          experimentIds,
        }),
      );
    },
    [],
  );

  useEffect(() => {
    cachedPinnedRuns.current = uiState.runsPinned;
  }, [uiState.runsPinned]);

  const loadModelVersions = useCallback(
    (runs: Parameters<typeof fetchModelVersionsForRuns>[0]) => {
      const handleModelVersionLoadFailure = (error: Error | ErrorWrapper) => {
        const normalizedError =
          (error instanceof ErrorWrapper ? mapErrorWrapperToPredefinedError(error) : error) ?? error;
        const message =
          normalizedError instanceof ErrorWrapper ? normalizedError.getMessageField() : normalizedError.message;
        Utils.displayGlobalErrorNotification(`Failed to load model versions for runs: ${message}`);
      };
      if (enableWorkspaceModelsRegistryCall) {
        fetchModelVersionsForRuns(runs || [], searchModelVersionsApi, dispatch).catch(handleModelVersionLoadFailure);
      }
    },
    [dispatch, enableWorkspaceModelsRegistryCall],
  );

  // Main function for fetching runs
  const fetchRuns: FetchRunsHookFunction = useCallback(
    (fetchParams, options = {}) =>
      dispatch((thunkDispatch: ThunkDispatch, getStore: () => ReduxState) => {
        // If we're auto-refreshing, we don't want to show the loading spinner and
        // we don't want to update the last requested params - they're used to determine
        // whether to discard results when the automatically fetched data changes.
        if (!options.isAutoRefreshing) {
          setIsLoadingRuns(true);
          lastRequestedParams.current = fetchParams;
        }
        return thunkDispatch((fetchParams.pageToken ? loadMoreRunsApi : searchRunsApi)(fetchParams))
          .then(async ({ value }) => {
            lastFetchedTime.current = Date.now();

            setIsLoadingRuns(false);
            setIsInitialLoadingRuns(false);
            setRequestError(null);

            if (lastRequestedParams.current && options.discardResultsFn?.(lastRequestedParams.current, value)) {
              return value;
            }

            lastSuccessfulRequestedParams.current = fetchParams;
            setNextPageToken(value.next_page_token || null);

            // We rely on redux reducer to update the state with new runs data,
            // then we pick it up from the store. This benefits other pages that use same data
            // from the same store slice (e.g. run details page). Will be changed when moving to graphQL.
            setResultRunsData(getStore(), fetchParams.experimentIds, fetchParams.requestedFacets);

            // In the end, load model versions for the fetched runs
            loadModelVersions(value.runs || []);
            return value;
          })
          .catch((e: ErrorWrapper | PredefinedError) => {
            setIsLoadingRuns(false);
            setIsInitialLoadingRuns(false);
            if (shouldUsePredefinedErrorsInExperimentTracking()) {
              // If it's already a PredefinedError, we don't need to map it again
              if (e instanceof PredefinedError) {
                setRequestError(e);
                return;
              }
              const maybePredefinedError = mapErrorWrapperToPredefinedError(e);
              if (maybePredefinedError) {
                setRequestError(maybePredefinedError);
                return;
              }
            }
            setRequestError(e);
            if (!shouldUsePredefinedErrorsInExperimentTracking()) {
              Utils.logErrorAndNotifyUser(e);
            }
          });
      }),
    [dispatch, setResultRunsData, loadModelVersions],
  );

  // Fetch runs when new request params are available
  // (e.g. after search facets change)
  useEffect(() => {
    if (disabled) {
      return;
    }
    const requestParams = createFetchRunsRequestParams(searchFacets, experimentIds, cachedPinnedRuns.current);
    if (requestParams) {
      fetchRuns(requestParams);
    }
  }, [fetchRuns, dispatch, disabled, searchFacets, experimentIds]);

  const loadMoreRuns = async () => {
    const requestParams = createFetchRunsRequestParams(searchFacets, experimentIds, cachedPinnedRuns.current);
    if (!nextPageToken || !requestParams) {
      return [];
    }
    return fetchRuns({ ...requestParams, pageToken: nextPageToken });
  };

  const refreshRuns = useCallback(() => {
    if (lastSuccessfulRequestedParams.current) {
      fetchRuns({ ...lastSuccessfulRequestedParams.current, pageToken: undefined });
    }
  }, [fetchRuns]);

  useExperimentRunsAutoRefresh({
    experimentIds,
    fetchRuns,
    searchFacets,
    enabled: uiState.autoRefreshEnabled,
    cachedPinnedRuns,
    runsData,
    isLoadingRuns: isLoadingRuns,
    lastFetchedTime,
  });

  return {
    isLoadingRuns,
    moreRunsAvailable: Boolean(nextPageToken),
    refreshRuns,
    loadMoreRuns,
    isInitialLoadingRuns,
    runsData,
    requestError,
  };
};

const createEmptyRunsResult = () => ({
  datasetsList: [],
  experimentTags: {},
  metricKeyList: [],
  metricsList: [],
  modelVersionsByRunUuid: {},
  paramKeyList: [],
  paramsList: [],
  runInfos: [],
  runUuidsMatchingFilter: [],
  tagsList: [],
  inputsOutputsList: [],
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentRunsAutoRefresh.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentRunsAutoRefresh.tsx
Signals: React

```typescript
import { useEffect, useRef } from 'react';
import { RUNS_SEARCH_MAX_RESULTS } from '../../../actions';
import { isArray, isEqual } from 'lodash';
import type { ExperimentQueryParamsSearchFacets } from './useExperimentPageSearchFacets';
import type { ExperimentRunsSelectorResult } from '../utils/experimentRuns.selector';
import { RUNS_AUTO_REFRESH_INTERVAL, createSearchRunsParams } from '../utils/experimentPage.fetch-utils';
import type { FetchRunsHookFunction, FetchRunsHookParams } from './useExperimentRuns';
import type { SearchRunsApiResponse } from '../../../types';

/**
 * Enables auto-refreshing runs on the experiment page.
 * The hook will schedule a new runs fetch every `RUNS_AUTO_REFRESH_INTERVAL` milliseconds and will be postponed
 * if user is currently loading runs or changes the search facets.
 */
export const useExperimentRunsAutoRefresh = ({
  experimentIds,
  lastFetchedTime,
  fetchRuns,
  searchFacets,
  enabled,
  cachedPinnedRuns,
  runsData,
  isLoadingRuns,
}: {
  cachedPinnedRuns: React.MutableRefObject<string[]>;
  lastFetchedTime: React.MutableRefObject<number | null>;
  enabled: boolean;
  experimentIds: string[];
  fetchRuns: FetchRunsHookFunction;
  searchFacets: ExperimentQueryParamsSearchFacets | null;
  runsData: ExperimentRunsSelectorResult;
  isLoadingRuns: boolean;
}) => {
  const refreshTimeoutRef = useRef<number | undefined>(undefined);

  const isLoadingImmediate = useRef(isLoadingRuns);
  const autoRefreshEnabledRef = useRef(enabled);
  const currentResults = useRef(runsData.runInfos);

  currentResults.current = runsData.runInfos;
  isLoadingImmediate.current = isLoadingRuns;
  autoRefreshEnabledRef.current = enabled;

  useEffect(() => {
    // Each time the parameters change, clear the timeout and try to schedule a new one
    window.clearTimeout(refreshTimeoutRef.current);

    // If auto refresh has been disabled or user is currently loading runs, do not schedule a new refresh
    if (!enabled || isLoadingRuns) {
      return;
    }

    const scheduleRefresh = async () => {
      const hasBeenInitialized = Boolean(lastFetchedTime.current);
      const timePassed = lastFetchedTime.current ? Date.now() - lastFetchedTime.current : 0;
      if (searchFacets && hasBeenInitialized && timePassed >= RUNS_AUTO_REFRESH_INTERVAL) {
        // We want no less results than the current amount of runs displayed, round up to the next page
        const initialRunsCount = currentResults.current.length;

        // Use Math.max(1, ...) so at least one page is fetched
        const requestedRunsCount =
          Math.max(1, Math.ceil(initialRunsCount / RUNS_SEARCH_MAX_RESULTS)) * RUNS_SEARCH_MAX_RESULTS;

        const requestParams = {
          ...createSearchRunsParams(
            experimentIds,
            { ...searchFacets, runsPinned: cachedPinnedRuns.current },
            Date.now(),
          ),
          requestedFacets: searchFacets,
          maxResults: requestedRunsCount,
        };

        let autoRefreshFetchedPages = 0;
        let autoRefreshResultsCount = 0;
        let currentPageToken = undefined;

        const discardResultsFn = (lastRequestedParams: FetchRunsHookParams, value?: SearchRunsApiResponse) => {
          // If it's not the final page and we still didn't reach the requested amount of runs,
          // flag results as not to be displayed yet
          if (autoRefreshResultsCount + (value?.runs?.length ?? 0) < requestedRunsCount && value?.next_page_token) {
            return true;
          }

          // At this moment, check if the results from auto-refresh should be considered. If the following
          // conditions are met, the results from auto-refresh will be discarded.
          if (
            // Skip if auto-refresh has been disabled before the results response came back
            !autoRefreshEnabledRef.current ||
            // Skip if user has loaded more runs since the last request
            initialRunsCount > requestedRunsCount ||
            // Skip if the requested facets have changed since the last request
            !isEqual(lastRequestedParams.requestedFacets, requestParams.requestedFacets)
          ) {
            return true;
          }

          // Otherwise, return "false" and consider the results from auto-refresh as valid
          return false;
        };

        while (autoRefreshFetchedPages === 0 || currentPageToken) {
          // We have enough results, no need to fetch more
          if (autoRefreshResultsCount >= requestedRunsCount) {
            break;
          }
          autoRefreshFetchedPages++;
          const result = await fetchRuns(
            { ...requestParams, pageToken: currentPageToken },
            {
              isAutoRefreshing: true,
              discardResultsFn,
            },
          );
          autoRefreshResultsCount += isArray(result?.runs) ? result.runs.length : 0;
          currentPageToken = result?.next_page_token;
        }
      }

      // Clear the timeout before scheduling a new one
      window.clearTimeout(refreshTimeoutRef.current);

      // If auto refresh has been disabled during last fetch, do not schedule a new one
      if (!autoRefreshEnabledRef.current) {
        return;
      }
      refreshTimeoutRef.current = window.setTimeout(scheduleRefresh, RUNS_AUTO_REFRESH_INTERVAL);
    };
    scheduleRefresh();
    return () => {
      clearTimeout(refreshTimeoutRef.current);
    };
  }, [experimentIds, fetchRuns, searchFacets, enabled, cachedPinnedRuns, lastFetchedTime, isLoadingRuns]);
};
```

--------------------------------------------------------------------------------

---[FILE: useExperiments.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperiments.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
import { describe, it, expect } from '@jest/globals';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../fixtures/experiment-runs.fixtures';
import { useExperiments } from './useExperiments';

describe('useExperiments', () => {
  const WrapComponent = (Component: React.ComponentType<React.PropsWithChildren<unknown>>, store: any) => {
    return (
      <Provider store={createStore((s) => s as any, store)}>
        <Component />
      </Provider>
    );
  };
  it('fetches single experiment from the store properly', () => {
    let experiments: any;
    const Component = () => {
      experiments = useExperiments(['123456789']);
      return null;
    };

    mount(WrapComponent(Component, EXPERIMENT_RUNS_MOCK_STORE));

    expect(experiments.length).toEqual(1);
  });

  it('fetches multiple experiments from the store properly', () => {
    let experiments: any;
    const Component = () => {
      experiments = useExperiments(['123456789', '654321']);
      return null;
    };

    mount(WrapComponent(Component, EXPERIMENT_RUNS_MOCK_STORE));

    expect(experiments.length).toEqual(2);
  });

  it('does not select non-existing experiments', () => {
    let experiments: any;
    const Component = () => {
      experiments = useExperiments(['123', '321']);
      return null;
    };

    mount(WrapComponent(Component, EXPERIMENT_RUNS_MOCK_STORE));

    expect(experiments.length).toEqual(0);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperiments.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperiments.ts
Signals: Redux/RTK

```typescript
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import type { ExperimentEntity, ExperimentStoreEntities } from '../../../types';

export type UseExperimentsResult = ExperimentEntity[];

/**
 * Hook that returns data and functions necessary for rendering
 * experiment(s) details - name, title, tags etc.
 */
export const useExperiments = (ids: (number | string)[]): UseExperimentsResult =>
  useSelector(
    (state: { entities: ExperimentStoreEntities }) =>
      ids.map((id) => state.entities.experimentsById[id]).filter(Boolean),
    (oldExperiments, newExperiments) => isEqual(oldExperiments, newExperiments),
  );
```

--------------------------------------------------------------------------------

---[FILE: useExperimentTableSelectRowHandler.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentTableSelectRowHandler.tsx
Signals: React

```typescript
import type { GridApi, RowSelectedEvent, SelectionChangedEvent } from '@ag-grid-community/core';
import { useCallback, useRef } from 'react';
import type { ExperimentPageViewState } from '../models/ExperimentPageViewState';
import type { RunRowType } from '../utils/experimentPage.row-types';
import { uniqBy } from 'lodash';

/**
 * Helper function that select particular run rows in the ag-grid.
 */
const agGridSelectRunRows = (runUuids: string[], isSelected: boolean, gridApi: GridApi) => {
  gridApi.forEachNode((node) => {
    if (node.data?.isLoadMoreRow) {
      return;
    }
    const { runInfo, runDateAndNestInfo: childRunDateInfo } = node.data as RunRowType;

    if (!runInfo) {
      return;
    }

    const childrenRunUuid = runInfo.runUuid;
    if (runUuids.includes(childrenRunUuid)) {
      // If we found children being parents, mark their children
      // to be selected as well.
      if (childRunDateInfo?.childrenIds) {
        runUuids.push(...childRunDateInfo.childrenIds);
      }

      node.setSelected(isSelected, false, true);
    }
  });
};

/**
 * Helper function that select particular group rows in the ag-grid.
 */
const agGridSelectGroupRows = (rowData: RunRowType[], gridApi: GridApi) => {
  gridApi.forEachNode((node) => {
    const data: RunRowType = node.data;
    if (!data.groupParentInfo) {
      return;
    }

    // If all runs belonging to the group are selected, select the group
    if (data.groupParentInfo.runUuids.every((runUuid) => rowData.some((row) => row.runUuid === runUuid))) {
      node.setSelected(true, false, true);
    }

    // If none of the runs belonging to the group are selected, deselect the group
    if (!data.groupParentInfo.runUuids.some((runUuid) => rowData.some((row) => row.runUuid === runUuid))) {
      node.setSelected(false, false, true);
    }
  });
};

/**
 * Returns handlers for row selection in the experiment runs table.
 * Supports groups, nested runs and regular flat hierarchy.
 */
export const useExperimentTableSelectRowHandler = (
  updateViewState: (newPartialViewState: Partial<ExperimentPageViewState>) => void,
) => {
  const onSelectionChange = useCallback(
    ({ api }: SelectionChangedEvent) => {
      const selectedUUIDs: string[] = api
        .getSelectedRows()
        // Filter out "load more" and group rows
        .filter((row) => row.runInfo)
        .map(({ runInfo }) => runInfo.runUuid);
      updateViewState({
        runsSelected: selectedUUIDs.reduce((aggregate, curr) => ({ ...aggregate, [curr]: true }), {}),
      });
    },
    [updateViewState],
  );

  const handleRowSelected = useCallback((event: RowSelectedEvent) => {
    // Let's check if the actual number of selected rows have changed
    // to avoid empty runs
    const isSelected = Boolean(event.node.isSelected());

    // We will continue only if the selected row has properly set runDateInfo
    const { runDateAndNestInfo, runInfo, groupParentInfo } = event.data as RunRowType;

    if (groupParentInfo) {
      agGridSelectRunRows(groupParentInfo.runUuids, isSelected, event.api);
    }

    if (!runDateAndNestInfo) {
      return;
    }
    const { isParent, expanderOpen, childrenIds } = runDateAndNestInfo;

    // We will continue only if the selected row is a parent containing
    // children and is actually expanded
    if (isParent && expanderOpen && childrenIds) {
      const childrenIdsToSelect = childrenIds;
      agGridSelectRunRows(childrenIdsToSelect, isSelected, event.api);
    } else if (runInfo) {
      // If we are selecting a run row, we need to select other runs with the same UUID
      agGridSelectRunRows([runInfo.runUuid], isSelected, event.api);

      // Next, we need to (de)select the group row if all runs belonging to the group are (de)selected
      const selectedRunRows = uniqBy(
        event.api.getSelectedRows().filter((row) => Boolean(row.runUuid)),
        'runUuid',
      );
      agGridSelectGroupRows(selectedRunRows, event.api);
    }
  }, []);

  return { handleRowSelected, onSelectionChange };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentViewLocalStore.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentViewLocalStore.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { renderHook } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import LocalStorageUtils from '../../../../common/utils/LocalStorageUtils';
import { useExperimentViewLocalStore } from './useExperimentViewLocalStore';

jest.mock('../../../../common/utils/LocalStorageUtils');

describe('useExperimentViewLocalStore', () => {
  it('tests useExperimentViewLocalStore', () => {
    renderHook(() => useExperimentViewLocalStore('123'));
    expect(LocalStorageUtils.getStoreForComponent).toHaveBeenCalledWith('ExperimentView', '123');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentViewLocalStore.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentViewLocalStore.ts
Signals: React

```typescript
import { useMemo } from 'react';
import LocalStorageUtils from '../../../../common/utils/LocalStorageUtils';

/**
 * This hook returns a memoized version of persistable store namespaced for the ExperimentView.
 * It can serve as a store for persisting state for a particular experiment - in this case,
 * the experiment id should be provided as a `identifier` parameter. It can also serve as a store for some
 * general purpose - e.g. you can provide "onboarding" as a identifier to get a store specific
 * for the onboarding section of the experiment view.
 *
 * @param storeIdentifier a unique identifier of created store - can be an experiment id or a general purpose name
 */
export const useExperimentViewLocalStore = (storeIdentifier: string) =>
  useMemo(() => LocalStorageUtils.getStoreForComponent('ExperimentView', storeIdentifier), [storeIdentifier]);
```

--------------------------------------------------------------------------------

---[FILE: useFetchedRunsNotification.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useFetchedRunsNotification.enzyme.test.tsx
Signals: React

```typescript
import { describe, jest, beforeEach, it, expect } from '@jest/globals';
import type { NotificationInstance } from '@databricks/design-system';
import { useEffect } from 'react';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import type { RunEntity, RunInfoEntity } from '../../../types';
import { EXPERIMENT_PARENT_ID_TAG } from '../utils/experimentPage.common-utils';
import { useFetchedRunsNotification } from './useFetchedRunsNotification';

const generateRuns = (n: number, asChildRuns = false): RunEntity[] =>
  new Array(n).fill(0).map(
    (_, index) =>
      ({
        info: { runUuid: asChildRuns ? `run_child${index}` : `run${index}` },
        data: asChildRuns ? { tags: [{ key: EXPERIMENT_PARENT_ID_TAG, value: `parent-id-${index}` }] } : undefined,
      } as any),
  );

describe('useFetchedRunsNotification', () => {
  const notificationInstance = {
    close: jest.fn(),
    info: jest.fn(),
  } as any as NotificationInstance;

  const createWrapper = (fetchedRuns: RunEntity[], existingRunInfos: RunInfoEntity[] = []) => {
    const TestComponent = () => {
      const showNotification = useFetchedRunsNotification(notificationInstance);
      useEffect(() => {
        showNotification(fetchedRuns, existingRunInfos);
      }, [showNotification]);
      return <div />;
    };
    return mountWithIntl(<TestComponent />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays proper notification for mixed runs', () => {
    createWrapper([...generateRuns(7, false), ...generateRuns(3, true)]);

    expect(notificationInstance.info).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Loaded 10 runs, including 3 child runs' }),
    );
  });

  it('displays proper notification for mixed runs w/ correct pluralization', () => {
    createWrapper([...generateRuns(9, false), ...generateRuns(1, true)]);

    expect(notificationInstance.info).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Loaded 10 runs, including 1 child run' }),
    );
  });

  it('displays proper notification for child-only runs', () => {
    createWrapper(generateRuns(10, true));

    expect(notificationInstance.info).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Loaded 10 child runs' }),
    );
  });

  it('displays notification with runs properly counted while excluding existing runs', () => {
    const fetchedRuns = [...generateRuns(50, false), ...generateRuns(50, true)];

    const existingRunInfos = [
      ...fetchedRuns.slice(0, 10).map(({ info }) => info), // 10 existing parent runs
      ...fetchedRuns.slice(50, 80).map(({ info }) => info), // 30 existing child runs
    ];
    createWrapper(fetchedRuns, existingRunInfos);

    expect(notificationInstance.info).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Loaded 60 runs, including 20 child runs' }),
    );
  });

  it('does not display notification when no runs are fetched', () => {
    createWrapper([]);
    expect(notificationInstance.info).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useFetchedRunsNotification.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useFetchedRunsNotification.tsx
Signals: React

```typescript
import type { NotificationInstance } from '@databricks/design-system';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import type { RunEntity, RunInfoEntity } from '../../../types';
import { EXPERIMENT_PARENT_ID_TAG } from '../utils/experimentPage.common-utils';

const FETCHED_RUN_NOTIFICATION_DURATION = 3; // Seconds
const FETCHED_RUN_NOTIFICATION_KEY = 'FETCHED_RUN_NOTIFICATION_KEY';

const countFetchedRuns = (fetchedRuns: RunEntity[], existingRunInfos: RunInfoEntity[] = []) => {
  // Extract only runs that are not loaded yet
  const newRuns = fetchedRuns.filter((r) => !existingRunInfos.some((x) => x.runUuid === r.info.runUuid));

  // Next, extract runs containing non-empty "parentRunId" tag
  const runsWithParent = newRuns.filter((run: any) => {
    const runTagsList = run?.data?.tags;
    return (
      Array.isArray(runTagsList) &&
      runTagsList.some((tag) => tag.key === EXPERIMENT_PARENT_ID_TAG && Boolean(tag.value))
    );
  });

  // Return counts of both all runs and those with parent
  return {
    allRuns: newRuns.length,
    childRuns: runsWithParent.length,
  };
};

export const useFetchedRunsNotification = (notification: NotificationInstance) => {
  const { formatMessage } = useIntl();

  // Creates the localized message based on the returned run count
  const getMessage = useCallback(
    (allRuns: number, childRuns: number) => {
      // Returned when only child runs are loaded
      if (allRuns === childRuns) {
        return formatMessage(
          {
            defaultMessage: 'Loaded {childRuns} child {childRuns, plural, =1 {run} other {runs}}',
            description: 'Experiment page > loaded more runs notification > loaded only child runs',
          },
          { childRuns: childRuns },
        );
      }

      // Returned when we fetch both regular (parent) and child runs
      return formatMessage(
        {
          defaultMessage:
            // eslint-disable-next-line formatjs/no-multiple-plurals
            'Loaded {allRuns} {allRuns, plural, =1 {run} other {runs}}, including {childRuns} child {childRuns, plural, =1 {run} other {runs}}',
          description: 'Experiment page > loaded more runs notification > loaded both parent and child runs',
        },
        { allRuns, childRuns: childRuns },
      );
    },
    [formatMessage],
  );

  return useCallback(
    (fetchedRuns: RunEntity[], existingRunInfos: RunInfoEntity[]) => {
      if (Array.isArray(fetchedRuns)) {
        // Get counted runs
        const { allRuns, childRuns } = countFetchedRuns(fetchedRuns, existingRunInfos);

        // Display notification only if there are any new child runs
        if (childRuns < 1) {
          return;
        }

        // If there is a similar notification visible already, close it first
        // to avoid confusion due to multiple displayed notification elements
        notification.close(FETCHED_RUN_NOTIFICATION_KEY);

        // Display the notification
        notification.info({
          message: getMessage(allRuns, childRuns),
          duration: FETCHED_RUN_NOTIFICATION_DURATION,
          placement: 'bottomRight',
          key: FETCHED_RUN_NOTIFICATION_KEY,
        });
      }
    },
    [notification, getMessage],
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useFetchExperiments.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useFetchExperiments.ts
Signals: React

```typescript
import { useContext } from 'react';

import { GetExperimentsContext } from '../contexts/GetExperimentsContext';

export const useFetchExperiments = () => {
  const getExperimentsContext = useContext(GetExperimentsContext);

  if (!getExperimentsContext) {
    throw new Error('Trying to use GetExperimentsContext actions outside of the context!');
  }

  return getExperimentsContext;
};
```

--------------------------------------------------------------------------------

---[FILE: useGetExperimentPageActiveTabByRoute.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useGetExperimentPageActiveTabByRoute.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useGetExperimentPageActiveTabByRoute } from './useGetExperimentPageActiveTabByRoute';
import { ExperimentPageTabName } from '../../../constants';
import { useLocation } from '../../../../common/utils/RoutingUtils';

jest.mock('../../../../common/utils/RoutingUtils', () => ({
  useLocation: jest.fn(),
  matchPath: jest.fn((routePath: string, pathname: string) => {
    // Simple implementation of matchPath for testing
    if (routePath.includes(':experimentId')) {
      const routePattern = routePath.replace(':experimentId', '\\d+');
      const regex = new RegExp(routePattern);
      return regex.test(pathname);
    }
    return routePath === pathname;
  }),
  createMLflowRoutePath: jest.fn((path) => path),
}));

describe('useGetExperimentPageActiveTabByRoute', () => {
  const testCases = [
    {
      name: 'should return Runs tab when on runs route',
      pathname: '/experiments/123/runs',
      expectedTabName: ExperimentPageTabName.Runs,
      expectedTopLevelTabName: ExperimentPageTabName.Runs,
    },
    {
      name: 'should return Traces tab when on traces route',
      pathname: '/experiments/123/traces',
      expectedTabName: ExperimentPageTabName.Traces,
      expectedTopLevelTabName: ExperimentPageTabName.Traces,
    },
    {
      name: 'should return Models tab when on models route',
      pathname: '/experiments/123/models',
      expectedTabName: ExperimentPageTabName.Models,
      expectedTopLevelTabName: ExperimentPageTabName.Models,
    },
    {
      name: 'should return undefined when on unknown route',
      pathname: '/experiments/123/unknown',
      expectedTabName: undefined,
      expectedTopLevelTabName: undefined,
    },
    {
      name: 'should return undefined when on experiment root route',
      pathname: '/experiments/123',
      expectedTabName: undefined,
      expectedTopLevelTabName: undefined,
    },
  ];

  test.each(testCases)('$name', ({ pathname, expectedTabName, expectedTopLevelTabName }) => {
    jest.mocked(useLocation).mockReturnValue({ pathname, state: undefined, search: '', hash: '', key: '' });

    const { result } = renderHook(() => useGetExperimentPageActiveTabByRoute());

    expect(result.current.tabName).toBe(expectedTabName);
    expect(result.current.topLevelTabName).toBe(expectedTopLevelTabName);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGetExperimentPageActiveTabByRoute.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useGetExperimentPageActiveTabByRoute.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import { matchPath, useLocation } from '../../../../common/utils/RoutingUtils';
import { RoutePaths } from '../../../routes';
import { ExperimentPageTabName } from '../../../constants';
import { map } from 'lodash';

// Maps experiment page route paths to enumerated tab names
const ExperimentPageRoutePathToTabNameMap = map(
  {
    [RoutePaths.experimentPageTabRuns]: ExperimentPageTabName.Runs,
    [RoutePaths.experimentPageTabTraces]: ExperimentPageTabName.Traces,
    [RoutePaths.experimentPageTabModels]: ExperimentPageTabName.Models,
    [RoutePaths.experimentPageTabEvaluationRuns]: ExperimentPageTabName.EvaluationRuns,
    [RoutePaths.experimentPageTabDatasets]: ExperimentPageTabName.Datasets,
    [RoutePaths.experimentPageTabChatSessions]: ExperimentPageTabName.ChatSessions,
    [RoutePaths.experimentPageTabSingleChatSession]: ExperimentPageTabName.SingleChatSession,
    [RoutePaths.experimentPageTabScorers]: ExperimentPageTabName.Judges,
    // OSS experiment prompt page routes
    [RoutePaths.experimentPageTabPrompts]: ExperimentPageTabName.Prompts,
    [RoutePaths.experimentPageTabPromptDetails]: ExperimentPageTabName.Prompts,
  },
  (tabName, routePath) => ({ routePath, tabName }),
);

// Gets exact tab name based on given pathname
const getTabNameFromRoutePath = (pathname: string) =>
  ExperimentPageRoutePathToTabNameMap
    // Find the first route path that matches the given pathname
    .find(({ routePath }) => Boolean(matchPath(routePath, pathname)))?.tabName;

// Maps exact tab names to top-level tab names
const getTopLevelTab = (tabName?: ExperimentPageTabName) => {
  return tabName;
};

export const useGetExperimentPageActiveTabByRoute = () => {
  const { pathname } = useLocation();

  const tabNameFromRoute = useMemo(() => {
    const tabName = getTabNameFromRoutePath(pathname);
    return tabName;
  }, [pathname]);

  return {
    tabName: tabNameFromRoute,
    topLevelTabName: getTopLevelTab(tabNameFromRoute),
  };
};
```

--------------------------------------------------------------------------------

````

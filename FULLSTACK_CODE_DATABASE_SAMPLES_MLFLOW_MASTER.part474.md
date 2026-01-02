---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 474
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 474 of 991)

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

---[FILE: useExperimentLoggedModelsChartsData.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelsChartsData.tsx
Signals: React

```typescript
import { compact, keyBy } from 'lodash';
import { useMemo } from 'react';
import type { LoggedModelProto } from '../../../types';
import { getStableColorForRun } from '../../../utils/RunNameUtils';
import type { RunsChartsRunData } from '../../runs-charts/components/RunsCharts.common';
import { useExperimentLoggedModelListPageRowVisibilityContext } from './useExperimentLoggedModelListPageRowVisibility';

export const getMetricByDatasetChartDataKey = (metricKey?: string, datasetName?: string) =>
  datasetName ? JSON.stringify([datasetName, metricKey]) : metricKey ?? '';

/**
 * Creates chart-consumable data based on logged models, including metrics and parameters.
 * TODO: optimize, add unit tests
 */
export const useExperimentLoggedModelsChartsData = (loggedModels: LoggedModelProto[]) => {
  const { isRowHidden } = useExperimentLoggedModelListPageRowVisibilityContext();
  return useMemo<RunsChartsRunData[]>(
    () =>
      compact(
        loggedModels.map<RunsChartsRunData | null>((model, index) =>
          model.info?.model_id
            ? {
                displayName: model.info?.name ?? model.info?.model_id ?? 'Unknown',
                images: {},

                metrics: keyBy(
                  model.data?.metrics?.map(({ dataset_name, key, value, timestamp, step }) => ({
                    // Instead of using plain metric key, we will use specific data access key generated based on metric key and dataset
                    dataKey: getMetricByDatasetChartDataKey(key, dataset_name),
                    key: key ?? '',
                    value: value ?? 0,
                    timestamp: timestamp ?? 0,
                    step: step ?? 0,
                  })),
                  'dataKey',
                ),
                params: keyBy(
                  model.data?.params
                    ?.map(({ key, value }) => ({ key: key ?? '', value: value ?? '' }))
                    .filter(({ key }) => key) ?? [],
                  'key',
                ),
                tags: {},
                uuid: model.info.model_id,
                hidden: isRowHidden(model.info.model_id, index),
                color: getStableColorForRun(model.info.model_id),
              }
            : null,
        ),
      ),
    [loggedModels, isRowHidden],
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelsChartsUIState.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelsChartsUIState.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useExperimentLoggedModelsChartsUIState } from './useExperimentLoggedModelsChartsUIState';
import type { LoggedModelProto } from '../../../types';
import { useExperimentLoggedModelAllMetricsByDataset } from './useExperimentLoggedModelAllMetricsByDataset';
import { getMetricByDatasetChartDataKey } from './useExperimentLoggedModelsChartsData';

const getLoggedModelList = (n = 5) => {
  return Array.from(
    { length: n },
    (_, index): LoggedModelProto => ({
      info: { name: 'model-' + (index + 1) },
      data: {
        metrics: [
          { key: 'dataset-metric-' + (index + 1), dataset_name: 'dataset-' + (index + 1), value: (index + 1) * 10 },
          { key: 'independent-metric', value: (index + 1) * 10 },
        ],
      },
    }),
  );
};

const modelSetWithOneMetric = getLoggedModelList(1);
const modelSetWithTwoMetrics = getLoggedModelList(2);

describe('useExperimentLoggedModelsChartsUIState, useExperimentLoggedModelAllMetricsByDataset', () => {
  const renderTestHook = (data: LoggedModelProto[]) =>
    renderHook(
      (props) => {
        const metrics = useExperimentLoggedModelAllMetricsByDataset(props.data);
        return useExperimentLoggedModelsChartsUIState(metrics, 'test-experiment-id');
      },
      {
        initialProps: { data },
      },
    );
  test('it should generate the correct initial state and expand it when new metrics arrive', async () => {
    const { result, rerender } = renderTestHook(modelSetWithOneMetric);

    await waitFor(() => {
      expect(result.current.chartUIState.compareRunCharts).toEqual([
        expect.objectContaining({
          metricSectionId: 'autogen-dataset-1',
          metricKey: 'dataset-metric-1',
          datasetName: 'dataset-1',
          dataAccessKey: getMetricByDatasetChartDataKey('dataset-metric-1', 'dataset-1'),
        }),
        expect.objectContaining({ metricSectionId: 'default', metricKey: 'independent-metric' }),
      ]);

      expect(result.current.chartUIState.compareRunSections).toEqual([
        expect.objectContaining({ name: 'dataset-1', uuid: 'autogen-dataset-1' }),
        expect.objectContaining({ name: 'Metrics', uuid: 'default' }),
      ]);
    });

    rerender({ data: modelSetWithTwoMetrics });

    await waitFor(() => {
      expect(result.current.chartUIState.compareRunCharts).toEqual([
        expect.objectContaining({
          metricSectionId: 'autogen-dataset-1',
          metricKey: 'dataset-metric-1',
          datasetName: 'dataset-1',
          dataAccessKey: getMetricByDatasetChartDataKey('dataset-metric-1', 'dataset-1'),
        }),
        expect.objectContaining({
          metricSectionId: 'autogen-dataset-2',
          metricKey: 'dataset-metric-2',
          datasetName: 'dataset-2',
          dataAccessKey: getMetricByDatasetChartDataKey('dataset-metric-2', 'dataset-2'),
        }),
        expect.objectContaining({ metricSectionId: 'default', metricKey: 'independent-metric' }),
      ]);

      expect(result.current.chartUIState.compareRunSections).toEqual([
        expect.objectContaining({ name: 'dataset-1', uuid: 'autogen-dataset-1' }),
        expect.objectContaining({ name: 'dataset-2', uuid: 'autogen-dataset-2' }),
        expect.objectContaining({ name: 'Metrics', uuid: 'default' }),
      ]);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelsChartsUIState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelsChartsUIState.tsx
Signals: React

```typescript
import { useCallback, useEffect, useReducer, useState } from 'react';
import type { ExperimentRunsChartsUIConfiguration } from '../../experiment-page/models/ExperimentPageUIState';
import type { ChartSectionConfig } from '../../../types';
import type {
  RunsChartsBarCardConfig,
  RunsChartsCardConfig,
  RunsChartsMetricByDatasetEntry,
} from '../../runs-charts/runs-charts.types';
import { RunsChartType } from '../../runs-charts/runs-charts.types';
import { isEmpty, uniq } from 'lodash';
import type { RunsChartsUIConfigurationSetter } from '../../runs-charts/hooks/useRunsChartsUIConfiguration';

type UpdateChartStateAction = { type: 'UPDATE'; stateSetter: RunsChartsUIConfigurationSetter };
type InitializeChartStateAction = { type: 'INITIALIZE'; initialConfig?: LoggedModelsChartsUIConfiguration };
type NewLoggedModelsStateAction = { type: 'METRICS_UPDATED'; metricsByDatasets: RunsChartsMetricByDatasetEntry[] };

type ChartsReducerAction = UpdateChartStateAction | NewLoggedModelsStateAction | InitializeChartStateAction;

interface LoggedModelsChartsUIConfiguration extends ExperimentRunsChartsUIConfiguration {
  isDirty: boolean;
}

const createLocalStorageKey = (storeIdentifier: string, version = 1) =>
  `experiment-logged-models-charts-ui-state-v${version}-${storeIdentifier}`;

/**
 * Generates a list of chart tiles based on logged models metrics and datasets.
 */
const getExperimentLoggedModelsPageChartSetup = (metricsByDatasets: RunsChartsMetricByDatasetEntry[]) => {
  const compareRunCharts: RunsChartsBarCardConfig[] = metricsByDatasets.map(
    ({ dataAccessKey, metricKey, datasetName }) => ({
      deleted: false,
      type: RunsChartType.BAR,
      uuid: `autogen-${dataAccessKey}`,
      metricSectionId: datasetName ? `autogen-${datasetName}` : 'default',
      isGenerated: true,
      metricKey,
      dataAccessKey,
      datasetName,
      displayName: datasetName ? `(${datasetName}) ${metricKey}` : undefined,
    }),
  );

  const compareRunSections: ChartSectionConfig[] = uniq(metricsByDatasets.map(({ datasetName }) => datasetName)).map(
    (datasetName) => ({
      display: true,
      name: datasetName ?? 'Metrics',
      uuid: datasetName ? `autogen-${datasetName}` : 'default',
      isReordered: false,
    }),
  );

  if (isEmpty(compareRunSections)) {
    compareRunSections.push({
      display: true,
      name: 'Metrics',
      uuid: 'default',
      isReordered: false,
    });
  }

  return {
    compareRunCharts,
    compareRunSections,
  };
};

// Internal utility function  used to merge the current charts state with potentially incoming new charts and sections
const reconcileChartsAndSections = (
  currentState: LoggedModelsChartsUIConfiguration,
  newCharts: { compareRunCharts: RunsChartsCardConfig[]; compareRunSections: ChartSectionConfig[] },
) => {
  // If there are no charts / sections, or if the state is in pristine state, just set the new charts if they're not empty
  if (!currentState.compareRunCharts || !currentState.compareRunSections || !currentState.isDirty) {
    if (newCharts.compareRunCharts.length > 0 || newCharts.compareRunSections.length > 0) {
      return {
        ...currentState,
        compareRunCharts: newCharts.compareRunCharts ?? [],
        compareRunSections: newCharts.compareRunSections ?? [],
      };
    }
  }

  // Otherwise, detect new sections and charts and add them to the list
  const newChartsToAdd = newCharts.compareRunCharts.filter(
    (newChart) => !currentState.compareRunCharts?.find((chart) => chart.uuid === newChart.uuid),
  );
  const newSectionsToAdd = newCharts.compareRunSections.filter(
    (newSection) =>
      newChartsToAdd.find((newChart) => newChart.metricSectionId === newSection.uuid) &&
      !currentState.compareRunSections?.find((section) => section.uuid === newSection.uuid),
  );

  if (newSectionsToAdd.length > 0 || newChartsToAdd.length > 0) {
    return {
      ...currentState,
      compareRunCharts: currentState.compareRunCharts
        ? [...currentState.compareRunCharts, ...newChartsToAdd]
        : newCharts.compareRunCharts,
      compareRunSections: currentState.compareRunSections
        ? [...currentState.compareRunSections, ...newSectionsToAdd]
        : newCharts.compareRunSections,
    };
  }
  return currentState;
};

const chartsUIStateInitializer = (): LoggedModelsChartsUIConfiguration => ({
  compareRunCharts: undefined,
  compareRunSections: undefined,
  autoRefreshEnabled: false,
  isAccordionReordered: false,
  chartsSearchFilter: '',
  globalLineChartConfig: undefined,
  isDirty: false,
});

// Reducer to manage the state of the charts UI
const chartsUIStateReducer = (state: LoggedModelsChartsUIConfiguration, action: ChartsReducerAction) => {
  // 'UPDATE' is sent by controls that updates the UI state directly
  if (action.type === 'UPDATE') {
    return { ...action.stateSetter(state), isDirty: true };
  }
  // 'METRICS_UPDATED' is sent when new logged models data is available and potentially new charts need to be added
  if (action.type === 'METRICS_UPDATED') {
    const { compareRunCharts, compareRunSections } = getExperimentLoggedModelsPageChartSetup(action.metricsByDatasets);
    const newState = reconcileChartsAndSections(state, { compareRunCharts, compareRunSections });
    return newState;
  }
  if (action.type === 'INITIALIZE') {
    if (action.initialConfig) {
      return action.initialConfig;
    }
  }
  return state;
};

const loadPersistedDataFromStorage = async (storeIdentifier: string) => {
  // This function is async on purpose to accommodate potential asynchoronous storage mechanisms (e.g. IndexedDB) in the future
  const serializedData = localStorage.getItem(createLocalStorageKey(storeIdentifier));
  if (!serializedData) {
    return undefined;
  }
  try {
    return JSON.parse(serializedData);
  } catch {
    return undefined;
  }
};

const saveDataToStorage = async (storeIdentifier: string, dataToPersist: LoggedModelsChartsUIConfiguration) => {
  localStorage.setItem(createLocalStorageKey(storeIdentifier), JSON.stringify(dataToPersist));
};

export const useExperimentLoggedModelsChartsUIState = (
  metricsByDatasets: RunsChartsMetricByDatasetEntry[],
  storeIdentifier: string,
) => {
  const [chartUIState, dispatchChartUIState] = useReducer(chartsUIStateReducer, undefined, chartsUIStateInitializer);
  const [loading, setLoading] = useState(true);

  // Attempt to load the persisted data when the component mounts
  useEffect(() => {
    setLoading(true);
    loadPersistedDataFromStorage(storeIdentifier).then((data) => {
      dispatchChartUIState({ type: 'INITIALIZE', initialConfig: data });
      setLoading(false);
    });
  }, [storeIdentifier]);

  // Attempt to update the charts state when the logged models change
  useEffect(() => {
    if (loading) {
      return;
    }
    dispatchChartUIState({ type: 'METRICS_UPDATED', metricsByDatasets });
  }, [metricsByDatasets, loading]);

  // Attempt persist the data when the state changes
  useEffect(() => {
    if (chartUIState.isDirty) {
      saveDataToStorage(storeIdentifier, chartUIState);
    }
  }, [storeIdentifier, chartUIState]);

  // Create an updater function to pass it to chart controls
  const updateUIState = useCallback(
    (stateSetter: RunsChartsUIConfigurationSetter) =>
      dispatchChartUIState({
        type: 'UPDATE',
        stateSetter,
      }),
    [],
  );

  return { chartUIState, updateUIState, loading };
};
```

--------------------------------------------------------------------------------

---[FILE: useLoggedModelsListPagePageState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useLoggedModelsListPagePageState.tsx
Signals: React

```typescript
import { first, isEmpty, isEqual } from 'lodash';
import { useCallback, useReducer, useState } from 'react';
import { RUNS_VISIBILITY_MODE } from '../../experiment-page/models/ExperimentPageUIState';
import { isLoggedModelRowHidden } from './useExperimentLoggedModelListPageRowVisibility';
import type { LoggedModelMetricDataset } from '../../../types';
import { ExperimentLoggedModelListPageKnownColumns } from './useExperimentLoggedModelListPageTableColumns';
import { useSafeDeferredValue } from '../../../../common/hooks/useSafeDeferredValue';
import type { LoggedModelsTableGroupByMode } from '../ExperimentLoggedModelListPageTable.utils';

type ActionType =
  | { type: 'SET_ORDER_BY'; orderByColumn: string; orderByAsc: boolean }
  | { type: 'SET_GROUP_BY'; groupBy?: LoggedModelsTableGroupByMode }
  | { type: 'SET_COLUMN_VISIBILITY'; columnVisibility: Record<string, boolean> }
  | { type: 'TOGGLE_DATASET'; dataset: LoggedModelMetricDataset }
  | { type: 'CLEAR_DATASETS' }
  | { type: 'SET_RUN_VISIBILITY'; visibilityMode?: RUNS_VISIBILITY_MODE; rowUuid?: string; rowIndex?: number };

/**
 * Defines current state of the logged models table.
 */
export type LoggedModelsListPageState = {
  orderByColumn?: string;
  orderByAsc: boolean;
  columnVisibility?: Record<string, boolean>;
  rowVisibilityMode: RUNS_VISIBILITY_MODE;
  rowVisibilityMap?: Record<string, boolean>;
  selectedFilterDatasets?: LoggedModelMetricDataset[];
  searchQuery?: string;
  groupBy?: LoggedModelsTableGroupByMode;
};

export const LoggedModelsListPageSortableColumns: string[] = [ExperimentLoggedModelListPageKnownColumns.CreationTime];

/**
 * Provides state management for the logged models table.
 */
export const useLoggedModelsListPageState = () => {
  const [state, dispatch] = useReducer(
    (state: LoggedModelsListPageState, action: ActionType): LoggedModelsListPageState => {
      if (action.type === 'SET_ORDER_BY') {
        return { ...state, orderByColumn: action.orderByColumn, orderByAsc: action.orderByAsc };
      }
      if (action.type === 'SET_GROUP_BY') {
        return { ...state, groupBy: action.groupBy };
      }
      if (action.type === 'SET_COLUMN_VISIBILITY') {
        return { ...state, columnVisibility: action.columnVisibility };
      }
      if (action.type === 'CLEAR_DATASETS') {
        return { ...state, selectedFilterDatasets: [] };
      }
      if (action.type === 'TOGGLE_DATASET') {
        return {
          ...state,
          selectedFilterDatasets: state.selectedFilterDatasets?.some((dataset) => isEqual(dataset, action.dataset))
            ? state.selectedFilterDatasets?.filter((dataset) => !isEqual(dataset, action.dataset))
            : [...(state.selectedFilterDatasets ?? []), action.dataset],
        };
      }
      if (action.type === 'SET_RUN_VISIBILITY') {
        if (action.visibilityMode) {
          return { ...state, rowVisibilityMode: action.visibilityMode, rowVisibilityMap: {} };
        }
        if (action.rowUuid && action.rowIndex !== undefined) {
          const currentHidden = isLoggedModelRowHidden(
            state.rowVisibilityMode,
            action.rowUuid,
            action.rowIndex,
            state.rowVisibilityMap ?? {},
          );
          return { ...state, rowVisibilityMap: { ...state.rowVisibilityMap, [action.rowUuid]: currentHidden } };
        }
      }
      return state;
    },
    {
      orderByColumn: first(LoggedModelsListPageSortableColumns),
      orderByAsc: false,
      columnVisibility: {},
      rowVisibilityMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
    },
  );

  const setOrderBy = useCallback(
    (orderByColumn: string, orderByAsc: boolean) => dispatch({ type: 'SET_ORDER_BY', orderByColumn, orderByAsc }),
    [],
  );

  const setColumnVisibility = useCallback(
    (columnVisibility: Record<string, boolean>) => dispatch({ type: 'SET_COLUMN_VISIBILITY', columnVisibility }),
    [],
  );

  const setRowVisibilityMode = useCallback(
    (visibilityMode: RUNS_VISIBILITY_MODE) => dispatch({ type: 'SET_RUN_VISIBILITY', visibilityMode }),
    [],
  );

  const toggleRowVisibility = useCallback(
    (rowUuid: string, rowIndex: number) => dispatch({ type: 'SET_RUN_VISIBILITY', rowUuid, rowIndex }),
    [],
  );

  const toggleDataset = useCallback(
    (dataset: LoggedModelMetricDataset) => dispatch({ type: 'TOGGLE_DATASET', dataset }),
    [],
  );

  const setGroupBy = useCallback(
    (groupBy?: LoggedModelsTableGroupByMode) => dispatch({ type: 'SET_GROUP_BY', groupBy }),
    [],
  );

  const clearSelectedDatasets = useCallback(() => dispatch({ type: 'CLEAR_DATASETS' }), []);

  const deferredState = useSafeDeferredValue(state);

  // Search filter state does not go through deferred value
  const [searchQuery, updateSearchQuery] = useState<string>('');

  // To be expanded with other filters in the future
  const isFilteringActive = Boolean(searchQuery || !isEmpty(state.selectedFilterDatasets));

  return {
    state: deferredState,
    isFilteringActive,
    searchQuery,
    setOrderBy,
    setColumnVisibility,
    setRowVisibilityMode,
    toggleRowVisibility,
    updateSearchQuery,
    toggleDataset,
    clearSelectedDatasets,
    setGroupBy,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useValidateLoggedModelSignature.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useValidateLoggedModelSignature.ts
Signals: React

```typescript
import { useCallback } from 'react';
import { getArtifactBlob, getLoggedModelArtifactLocationUrl } from '../../../../common/utils/ArtifactUtils';
import { MLMODEL_FILE_NAME } from '../../../constants';
import type { LoggedModelProto } from '../../../types';

const lazyJsYaml = () => import('js-yaml');

export const useValidateLoggedModelSignature = (loggedModel?: LoggedModelProto | null) =>
  useCallback(async () => {
    if (!loggedModel?.info?.model_id || !loggedModel?.info?.artifact_uri) {
      return true;
    }

    const artifactLocation = getLoggedModelArtifactLocationUrl(MLMODEL_FILE_NAME, loggedModel.info.model_id);
    const blob = await getArtifactBlob(artifactLocation);

    const yamlContent = (await lazyJsYaml()).load(await blob.text());

    const isValid = yamlContent?.signature?.inputs !== undefined && yamlContent?.signature?.outputs !== undefined;

    return isValid;
  }, [loggedModel]);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/ExperimentPage.tsx
Signals: React

```typescript
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
// prettier-ignore
import {
  getExperimentApi,
  setCompareExperiments,
  setExperimentTagApi,
} from '../../actions';
import Utils from '../../../common/utils/Utils';
import { GetExperimentsContextProvider } from './contexts/GetExperimentsContext';
import { ExperimentView } from './ExperimentView';
import { LegacySkeleton, PageWrapper, useDesignSystemTheme } from '@databricks/design-system';
import { useNavigateToExperimentPageTab } from './hooks/useNavigateToExperimentPageTab';
import { useExperimentIds } from './hooks/useExperimentIds';

/**
 * Concrete actions for GetExperiments context
 */
const getExperimentActions = {
  setExperimentTagApi,
  getExperimentApi,
  setCompareExperiments,
};

/**
 * Main entry point for the experiment page. This component
 * provides underlying structure with context containing
 * concrete versions of store actions.
 */
const ExperimentPage = () => {
  const { formatMessage } = useIntl();
  const { theme } = useDesignSystemTheme();
  const experimentIds = useExperimentIds();

  useEffect(() => {
    const pageTitle = formatMessage({
      defaultMessage: 'Experiment Runs - Databricks',
      description: 'Title on a page used to manage MLflow experiments runs',
    });
    Utils.updatePageTitle(pageTitle);
  }, [formatMessage]);

  const isComparingExperiments = experimentIds.length > 1;

  // Check if view mode determines rendering using another route. If true, wait for the redirection and return null.
  const { isLoading: isAutoNavigatingToTab, isEnabled: isAutoNavigateEnabled } = useNavigateToExperimentPageTab({
    enabled: !isComparingExperiments,
    experimentId: experimentIds[0],
  });

  if (isAutoNavigatingToTab) {
    return <LegacySkeleton />;
  }
  if (isAutoNavigateEnabled) {
    return null;
  }
  return (
    <PageWrapper css={{ height: '100%', paddingTop: theme.spacing.md }}>
      <GetExperimentsContextProvider actions={getExperimentActions}>
        <ExperimentView />
      </GetExperimentsContextProvider>
    </PageWrapper>
  );
};

export default ExperimentPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/ExperimentView.tsx
Signals: React, Redux/RTK

```typescript
import { LegacySkeleton, useDesignSystemTheme } from '@databricks/design-system';
import { useEffect, useState } from 'react';
import { ErrorCodes } from '../../../common/constants';
import { getExperimentApi } from '../../actions';
import { ExperimentKind } from '../../constants';
import { ExperimentViewHeaderCompare } from './components/header/ExperimentViewHeaderCompare';
import { ExperimentViewRuns } from './components/runs/ExperimentViewRuns';
import { useExperiments } from './hooks/useExperiments';
import { useFetchExperiments } from './hooks/useFetchExperiments';
import { useElementHeight } from '../../../common/utils/useElementHeight';
import { searchDatasetsApi } from '../../actions';
import Utils from '../../../common/utils/Utils';
import { ExperimentPageUIStateContextProvider } from './contexts/ExperimentPageUIStateContext';
import { first } from 'lodash';
import { shouldUsePredefinedErrorsInExperimentTracking } from '../../../common/utils/FeatureUtils';
import { useExperimentPageSearchFacets } from './hooks/useExperimentPageSearchFacets';
import { usePersistExperimentPageViewState } from './hooks/usePersistExperimentPageViewState';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../redux-types';
import { useExperimentRuns } from './hooks/useExperimentRuns';
import type { ExperimentRunsSelectorResult } from './utils/experimentRuns.selector';
import { useSharedExperimentViewState } from './hooks/useSharedExperimentViewState';
import { useInitializeUIState } from './hooks/useInitializeUIState';
import { ExperimentViewDescriptionNotes } from './components/ExperimentViewDescriptionNotes';
import invariant from 'invariant';
import { useExperimentPageViewMode } from './hooks/useExperimentPageViewMode';
import { ExperimentViewTraces } from './components/ExperimentViewTraces';
import { FormattedMessage } from 'react-intl';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import { NotFoundError, PermissionError } from '@databricks/web-shared/errors';
import { ExperimentViewNotFound } from './components/ExperimentViewNotFound';
import { ExperimentViewNoPermissionsError } from './components/ExperimentViewNoPermissionsError';
import { ErrorViewV2 } from '../../../common/components/ErrorViewV2';
import { ExperimentViewHeader } from './components/header/ExperimentViewHeader';
import { ExperimentViewHeaderKindSelector } from './components/header/ExperimentViewHeaderKindSelector';
import { getExperimentKindFromTags } from '../../utils/ExperimentKindUtils';
import { useUpdateExperimentKind } from './hooks/useUpdateExperimentKind';
import { canModifyExperiment } from './utils/experimentPage.common-utils';
import { useInferExperimentKind } from './hooks/useInferExperimentKind';
import { ExperimentViewInferredKindModal } from './components/header/ExperimentViewInferredKindModal';

export const ExperimentView = ({ showHeader = true }: { showHeader?: boolean }) => {
  const dispatch = useDispatch<ThunkDispatch>();
  const { theme } = useDesignSystemTheme();

  const [searchFacets, experimentIds, isPreview] = useExperimentPageSearchFacets();
  const [viewMode] = useExperimentPageViewMode();

  const experiments = useExperiments(experimentIds);

  const [firstExperiment] = experiments;

  const { fetchExperiments, isLoadingExperiment, requestError: experimentRequestError } = useFetchExperiments();

  const { elementHeight: hideableElementHeight, observeHeight } = useElementHeight();

  const [editing, setEditing] = useState(false);

  const [showAddDescriptionButton, setShowAddDescriptionButton] = useState(true);

  // Create new version of the UI state for the experiment page on this level
  const [uiState, setUIState, seedInitialUIState] = useInitializeUIState(experimentIds);

  const { isViewStateShared } = useSharedExperimentViewState(setUIState, first(experiments));

  // Get the maximized state from the new view state model if flag is set
  const isMaximized = uiState.viewMaximized;

  const {
    isLoadingRuns,
    loadMoreRuns,
    runsData,
    moreRunsAvailable,
    requestError: runsRequestError,
    refreshRuns,
  } = useExperimentRuns(uiState, searchFacets, experimentIds);

  useEffect(() => {
    // If the new tabbed UI is enabled, fetch the experiments only if they are not already loaded.
    // Helps with the smooth page transition.
    if (experimentIds.every((id) => experiments.find((exp) => exp.experimentId === id))) {
      return;
    }
    fetchExperiments(experimentIds);
  }, [fetchExperiments, experimentIds, experiments]);

  useEffect(() => {
    // Seed the initial UI state when the experiments and runs are loaded.
    // Should only run once.
    seedInitialUIState(experiments, runsData);
  }, [seedInitialUIState, experiments, runsData]);

  useEffect(() => {
    const requestAction = searchDatasetsApi(experimentIds);
    dispatch(requestAction).catch((e) => {
      // In V2 error handling, do not display datasets retrieval error
      if (!shouldUsePredefinedErrorsInExperimentTracking()) {
        Utils.logErrorAndNotifyUser(e);
      }
    });
  }, [dispatch, experimentIds]);

  const isComparingExperiments = experimentIds.length > 1;

  usePersistExperimentPageViewState(uiState, searchFacets, experimentIds, isViewStateShared || isPreview);

  const isViewInitialized = Boolean(!isLoadingExperiment && experiments[0] && runsData && searchFacets);

  const { mutate: updateExperimentKind, isLoading: updatingExperimentKind } = useUpdateExperimentKind(() => {
    if (isComparingExperiments) {
      return;
    }
    return dispatch(getExperimentApi(experimentIds[0]));
  });

  const experimentKind = getExperimentKindFromTags(first(experiments)?.tags);
  const firstExperimentId = first(experiments)?.experimentId;

  const {
    inferredExperimentKind,
    isLoading: inferringExperimentType,
    dismiss,
  } = useInferExperimentKind({
    experimentId: firstExperimentId,
    isLoadingExperiment,
    enabled: showHeader && !isComparingExperiments && !experimentKind,
    experimentTags: first(experiments)?.tags,
    updateExperimentKind,
  });

  if (
    // Scenario for 404: either request error is resolved to NotFoundError or the code of ErrorWrapper is "RESOURCE_DOES_NOT_EXIST"
    experimentRequestError instanceof NotFoundError ||
    (experimentRequestError instanceof ErrorWrapper &&
      experimentRequestError.getErrorCode() === ErrorCodes.RESOURCE_DOES_NOT_EXIST)
  ) {
    return <ExperimentViewNotFound />;
  }

  if (
    // Scenario for 401: either request error is resolved to PermissionError or the code of ErrorWrapper is "PERMISSION_DENIED"
    experimentRequestError instanceof PermissionError ||
    (experimentRequestError instanceof ErrorWrapper &&
      experimentRequestError.getErrorCode() === ErrorCodes.PERMISSION_DENIED)
  ) {
    return <ExperimentViewNoPermissionsError />;
  }

  if (experimentRequestError instanceof Error) {
    return <ErrorViewV2 css={{ height: '100%' }} error={experimentRequestError} />;
  }

  if (!isViewInitialized) {
    // In the new view state model, wait for search facets to initialize
    return <LegacySkeleton />;
  }

  invariant(searchFacets, 'searchFacets should be initialized at this point');

  const isLoading = isLoadingExperiment || !experiments[0];

  const canUpdateExperimentKind = true;

  if (inferredExperimentKind === ExperimentKind.NO_INFERRED_TYPE && canUpdateExperimentKind) {
    return (
      <ExperimentViewInferredKindModal
        onConfirm={(kind) => {
          firstExperimentId &&
            updateExperimentKind(
              { experimentId: firstExperimentId, kind },
              {
                onSettled: dismiss,
              },
            );
        }}
        onDismiss={dismiss}
      />
    );
  }

  const renderTaskSection = () => {
    return null;
  };

  const renderExperimentHeader = () => (
    <>
      <>
        <ExperimentViewHeader
          experiment={firstExperiment}
          searchFacetsState={searchFacets || undefined}
          uiState={uiState}
          setEditing={setEditing}
          experimentKindSelector={
            !isComparingExperiments && firstExperimentId ? (
              <ExperimentViewHeaderKindSelector
                value={experimentKind}
                inferredExperimentKind={inferredExperimentKind}
                onChange={(kind) => updateExperimentKind({ experimentId: firstExperimentId, kind })}
                isUpdating={updatingExperimentKind || inferringExperimentType}
                key={inferredExperimentKind}
                readOnly={!canUpdateExperimentKind}
              />
            ) : null
          }
        />
        <div
          css={{
            width: '100%',
            borderTop: `1px solid ${theme.colors.border}`,
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
          }}
        />
      </>
      <div
        style={{
          maxHeight: isMaximized ? 0 : hideableElementHeight,
        }}
        css={{ overflowY: 'hidden', flexShrink: 0, transition: 'max-height .12s' }}
      >
        <div ref={observeHeight}>
          <ExperimentViewDescriptionNotes
            experiment={firstExperiment}
            setShowAddDescriptionButton={setShowAddDescriptionButton}
            editing={editing}
            setEditing={setEditing}
          />
        </div>
      </div>
    </>
  );

  const getRenderedView = () => {
    if (viewMode === 'TRACES') {
      return <ExperimentViewTraces experimentIds={experimentIds} />;
    }

    return (
      <ExperimentViewRuns
        isLoading={false}
        experiments={experiments}
        isLoadingRuns={isLoadingRuns}
        runsData={runsData as ExperimentRunsSelectorResult}
        searchFacetsState={searchFacets}
        loadMoreRuns={loadMoreRuns}
        moreRunsAvailable={moreRunsAvailable}
        requestError={runsRequestError}
        refreshRuns={refreshRuns}
        uiState={uiState}
      />
    );
  };

  return (
    <ExperimentPageUIStateContextProvider setUIState={setUIState}>
      <div css={styles.experimentViewWrapper}>
        {isLoading ? (
          <LegacySkeleton title paragraph={false} active />
        ) : showHeader ? (
          <>
            {isComparingExperiments ? (
              <ExperimentViewHeaderCompare experiments={experiments} />
            ) : (
              renderExperimentHeader()
            )}
          </>
        ) : (
          // When the header is not shown, we still want to render the promo banner and task section
          <>
            {/* prettier-ignore */}
            {renderTaskSection()}
          </>
        )}
        {getRenderedView()}
      </div>
    </ExperimentPageUIStateContextProvider>
  );
};

const styles = {
  experimentViewWrapper: { height: '100%', display: 'flex', flexDirection: 'column' as const },
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentListViewTagsFilter.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/ExperimentListViewTagsFilter.tsx
Signals: React

```typescript
import { useFieldArray, useForm } from 'react-hook-form';
import type { TagFilter } from '../hooks/useTagsFilter';
import { OPERATORS } from '../hooks/useTagsFilter';
import { Button, CloseIcon, PlusIcon, RHFControlledComponents, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import type { Interpolation, Theme } from '@emotion/react';
import { Fragment } from 'react';

const EMPTY_TAG = { key: '', value: '', operator: 'IS' } satisfies TagFilter;

type Props = {
  tagsFilter: TagFilter[];
  setTagsFilter: (_: TagFilter[]) => void;
};

export function ExperimentListViewTagsFilter({ tagsFilter, setTagsFilter }: Props) {
  const { control, handleSubmit } = useForm<{ tagsFilter: TagFilter[] }>({
    defaultValues: { tagsFilter: tagsFilter.length === 0 ? [EMPTY_TAG] : tagsFilter },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'tagsFilter' });
  const { theme } = useDesignSystemTheme();
  const { formatMessage } = useIntl();

  const labelStyles: Interpolation<Theme> = {
    fontWeight: theme.typography.typographyBoldFontWeight,
  };

  const labels = {
    key: formatMessage({
      defaultMessage: 'Key',
      description: 'Tag filter input for key field in the tags filter popover for experiments page search by tags',
    }),
    operator: formatMessage({
      defaultMessage: 'Operator',
      description: 'Tag filter input for operator field in the tags filter popover for experiments page search by tags',
    }),
    value: formatMessage({
      defaultMessage: 'Value',
      description: 'Tag filter input for value field in the tags filter popover for experiments page search by tags',
    }),
  };

  return (
    <form
      onSubmit={handleSubmit((data) => setTagsFilter(data.tagsFilter))}
      css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, padding: theme.spacing.md }}
    >
      <fieldset
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, auto)',
          gap: theme.spacing.sm,
        }}
      >
        <label htmlFor={`${fields[0].id}-key`} css={labelStyles}>
          {labels.key}
        </label>
        <label htmlFor={`${fields[0].id}-op`} css={labelStyles}>
          {labels.operator}
        </label>
        <label htmlFor={`${fields[0].id}-value`} css={labelStyles}>
          {labels.value}
        </label>
        <label />
        {fields.map((field, index) => (
          <Fragment key={field.id}>
            <RHFControlledComponents.Input
              id={`${field.id}-key`}
              componentId={`mlflow.experiment_list_view.tag_filter.key_input_${index}`}
              name={`tagsFilter.${index}.key`}
              control={control}
              aria-label={labels.key}
              placeholder={labels.key}
              required
            />
            <RHFControlledComponents.LegacySelect
              id={`${field.id}-op`}
              name={`tagsFilter.${index}.operator`}
              control={control}
              options={OPERATORS.map((op) => ({ key: op, value: op }))}
              aria-label={labels.operator}
              css={{ minWidth: '14ch' }}
            />
            <RHFControlledComponents.Input
              id={`${field.id}-value`}
              componentId={`mlflow.experiment_list_view.tag_filter.value_input_${index}`}
              name={`tagsFilter.${index}.value`}
              control={control}
              aria-label={labels.value}
              placeholder={labels.value}
              required
            />
            <Button
              componentId={`mlflow.experiment_list_view.tag_filter.remove_filter_button_${index}`}
              type="tertiary"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              aria-label={formatMessage({
                defaultMessage: 'Remove filter',
                description: 'Button to remove a filter in the tags filter popover for experiments page search by tags',
              })}
            >
              <CloseIcon />
            </Button>
          </Fragment>
        ))}
      </fieldset>
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          componentId="mlflow.experiment_list_view.tag_filter.add_filter_button"
          onClick={() => append(EMPTY_TAG)}
          icon={<PlusIcon />}
        >
          <FormattedMessage
            defaultMessage="Add filter"
            description="Button to add a new filter in the tags filter popover for experiments page search by tags"
          />
        </Button>
        <div css={{ display: 'flex', gap: theme.spacing.sm }}>
          <Button
            componentId="mlflow.experiment_list_view.tag_filter.clear_filters_button"
            onClick={() => setTagsFilter([])}
          >
            <FormattedMessage
              defaultMessage="Clear filters"
              description="Button to clear filters in the tags filter popover for experiments page search by tags"
            />
          </Button>
          <Button
            htmlType="submit"
            componentId="mlflow.experiment_list_view.tag_filter.apply_filters_button"
            type="primary"
          >
            <FormattedMessage
              defaultMessage="Apply filters"
              description="Button to apply filters in the tags filter popover for experiments page search by tags"
            />
          </Button>
        </div>
      </div>
    </form>
  );
}
```

--------------------------------------------------------------------------------

````

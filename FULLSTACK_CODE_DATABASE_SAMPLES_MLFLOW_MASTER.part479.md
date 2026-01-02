---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 479
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 479 of 991)

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

---[FILE: ExperimentViewRuns.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRuns.test.tsx

```typescript
import { jest, describe, beforeAll, beforeEach, test, expect } from '@jest/globals';
import { MockedReduxStoreProvider } from '../../../../../common/utils/TestUtils';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import type { ExperimentViewRunsProps } from './ExperimentViewRuns';
import { ExperimentViewRuns } from './ExperimentViewRuns';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { createExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { setupServer } from '../../../../../common/utils/setup-msw';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { useFetchedRunsNotification } from '../../hooks/useFetchedRunsNotification';
import { useExperimentRunRows } from '../../utils/experimentPage.row-utils';
import { DesignSystemProvider } from '@databricks/design-system';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // Larger timeout for integration testing (table rendering)

// Rendering ag-grid table takes a lot of resources and time, we increase waitFor()'s timeout from default 5000 ms
const WAIT_FOR_TIMEOUT = 10_000;

// Enable feature flags
jest.mock('../../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../../common/utils/FeatureUtils')>(
    '../../../../../common/utils/FeatureUtils',
  ),
}));

// Mock rows preparation function to enable contract test
jest.mock('../../utils/experimentPage.row-utils', () => {
  const module = jest.requireActual<typeof import('../../utils/experimentPage.row-utils')>(
    '../../utils/experimentPage.row-utils',
  );
  return {
    ...module,
    useExperimentRunRows: jest.fn(module.useExperimentRunRows),
  };
});

// Mock less relevant, costly components
jest.mock('../../hooks/useCreateNewRun', () => ({
  CreateNewRunContextProvider: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('./ExperimentViewRunsControls', () => ({
  ExperimentViewRunsControls: () => <div />,
}));
jest.mock('../../hooks/useFetchedRunsNotification', () => ({ useFetchedRunsNotification: jest.fn() }));

const mockTagKeys = Object.keys(EXPERIMENT_RUNS_MOCK_STORE.entities.tagsByRunUuid['experiment123456789_run1']);

describe('ExperimentViewRuns', () => {
  const server = setupServer();

  const loadMoreRunsMockFn = jest.fn<ExperimentViewRunsProps['loadMoreRuns']>();

  beforeAll(() => {
    jest.setSystemTime(new Date(2022, 0, 1));
    server.listen();
  });

  beforeEach(() => {
    jest.mocked(useExperimentRunRows).mockClear();
  });

  const defaultProps: ExperimentViewRunsProps = {
    experiments: [EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789']],
    runsData: {
      paramKeyList: ['p1', 'p2', 'p3'],
      metricKeyList: ['m1', 'm2', 'm3'],
      modelVersionsByRunUuid: {},
      runUuidsMatchingFilter: ['experiment123456789_run1'],
      tagsList: [EXPERIMENT_RUNS_MOCK_STORE.entities.tagsByRunUuid['experiment123456789_run1']],
      runInfos: [EXPERIMENT_RUNS_MOCK_STORE.entities.runInfosByUuid['experiment123456789_run1']],
      paramsList: [[{ key: 'p1', value: 'pv1' }]],
      metricsList: [[{ key: 'm1', value: 'mv1' }]],
      datasetsList: [[{ dataset: { digest: 'ab12', name: 'dataset_name' } }]],
      experimentTags: {},
    } as any,
    isLoading: false,
    searchFacetsState: createExperimentPageSearchFacetsState(),
    uiState: Object.assign(createExperimentPageUIState(), {
      runsPinned: ['experiment123456789_run1'],
    }),
    isLoadingRuns: false,
    loadMoreRuns: loadMoreRunsMockFn,
    refreshRuns: jest.fn(),
    requestError: null,
    moreRunsAvailable: false,
  };

  const queryClient = new QueryClient();

  const renderTestComponent = (additionalProps: Partial<ExperimentViewRunsProps> = {}) => {
    return render(<ExperimentViewRuns {...defaultProps} {...additionalProps} />, {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <IntlProvider locale="en">
            <QueryClientProvider client={queryClient}>
              <DesignSystemProvider>
                <MockedReduxStoreProvider
                  state={{
                    entities: {
                      modelVersionsByRunUuid: {},
                      colorByRunUuid: {},
                    },
                  }}
                >
                  {children}
                </MockedReduxStoreProvider>
              </DesignSystemProvider>
            </QueryClientProvider>
          </IntlProvider>
        </MemoryRouter>
      ),
    });
  };

  test('should render the table with all relevant data', async () => {
    renderTestComponent();

    // Assert cell with the name
    await waitFor(
      () => {
        expect(screen.getByRole('gridcell', { name: /experiment123456789_run1$/ })).toBeInTheDocument();
      },
      {
        timeout: WAIT_FOR_TIMEOUT,
      },
    );

    // Assert cell with the dataset
    expect(screen.getByRole('gridcell', { name: /dataset_name \(ab12\)/ })).toBeInTheDocument();
  });

  test('[contract] should properly call getting row data function', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(useExperimentRunRows).toHaveBeenCalledWith(
        expect.objectContaining({
          metricKeyList: ['m1', 'm2', 'm3'],
          paramKeyList: ['p1', 'p2', 'p3'],
          tagKeyList: mockTagKeys,
          runsPinned: ['experiment123456789_run1'],
          nestChildren: true,
        }),
      );
    });
  });

  test('should properly react to the new runs data', async () => {
    const { rerender } = renderTestComponent();

    await waitFor(() => {
      expect(useExperimentRunRows).toHaveBeenCalled();
    });
    // Assert that we're not calling for generating columns/rows
    // while having "newparam" parameter
    expect(useExperimentRunRows).not.toHaveBeenCalledWith(
      expect.objectContaining({
        paramKeyList: ['p1', 'p2', 'p3', 'newparam'],
      }),
    );

    // Update the param key list with "newparam" as a new entry
    rerender(
      <ExperimentViewRuns
        {...defaultProps}
        runsData={{ ...defaultProps.runsData, paramKeyList: ['p1', 'p2', 'p3', 'newparam'] }}
      />,
    );

    await waitFor(() => {
      // Assert that "newparam" parameter is being included in calls
      // for new columns and rows
      expect(useExperimentRunRows).toHaveBeenCalledWith(
        expect.objectContaining({
          paramKeyList: ['p1', 'p2', 'p3', 'newparam'],
        }),
      );
    });
  });

  test('displays "(...) fetched more runs" notification when necessary', async () => {
    const mockedShowNotification = jest.fn();
    jest.mocked(useFetchedRunsNotification).mockImplementation(() => mockedShowNotification);
    loadMoreRunsMockFn.mockResolvedValue([{ info: { runUuid: 'new' } }]);
    renderTestComponent({
      moreRunsAvailable: true,
      isLoadingRuns: false,
    });

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument();
      },
      {
        timeout: WAIT_FOR_TIMEOUT,
      },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    await waitFor(() => {
      expect(mockedShowNotification).toHaveBeenLastCalledWith(
        [{ info: { runUuid: 'new' } }],
        [EXPERIMENT_RUNS_MOCK_STORE.entities.runInfosByUuid['experiment123456789_run1']],
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRuns.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRuns.tsx
Signals: React, Redux/RTK

```typescript
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLegacyNotification } from '@databricks/design-system';
import type {
  DatasetSummary,
  ExperimentEntity,
  LIFECYCLE_FILTER,
  MODEL_VERSION_FILTER,
  RunDatasetWithTags,
  UpdateExperimentViewStateFn,
} from '../../../../types';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { ExperimentViewRunsControls } from './ExperimentViewRunsControls';
import { ExperimentViewRunsTable } from './ExperimentViewRunsTable';
import { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import Utils from '../../../../../common/utils/Utils';
import { ATTRIBUTE_COLUMN_SORT_KEY, MLFLOW_LOGGED_IMAGE_ARTIFACTS_PATH } from '../../../../constants';
import type { RunRowType } from '../../utils/experimentPage.row-types';
import { useExperimentRunRows } from '../../utils/experimentPage.row-utils';
import { useFetchedRunsNotification } from '../../hooks/useFetchedRunsNotification';
import type { DatasetWithRunType } from './ExperimentViewDatasetDrawer';
import { ExperimentViewDatasetDrawer } from './ExperimentViewDatasetDrawer';
import { useExperimentViewLocalStore } from '../../hooks/useExperimentViewLocalStore';
import { EvaluationArtifactCompareView } from '../../../evaluation-artifacts-compare/EvaluationArtifactCompareView';
import { shouldUseGetLoggedModelsBatchAPI } from '../../../../../common/utils/FeatureUtils';
import { CreateNewRunContextProvider } from '../../hooks/useCreateNewRun';
import { useExperimentPageViewMode } from '../../hooks/useExperimentPageViewMode';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { RunsCompare } from '../../../runs-compare/RunsCompare';
import type { ErrorWrapper } from '../../../../../common/utils/ErrorWrapper';
import type { ReduxState } from '../../../../../redux-types';
import { ThunkDispatch } from '../../../../../redux-types';
import type { ExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';
import { useIsTabActive } from '../../../../../common/hooks/useIsTabActive';
import { ExperimentViewRunsTableResizer } from './ExperimentViewRunsTableResizer';
import { RunsChartsSetHighlightContextProvider } from '../../../runs-charts/hooks/useRunsChartTraceHighlight';
import { useLoggedModelsForExperimentRunsTable } from '../../hooks/useLoggedModelsForExperimentRunsTable';
import { ExperimentViewRunsRequestError } from '../ExperimentViewRunsRequestError';
import { useLoggedModelsForExperimentRunsTableV2 } from '../../hooks/useLoggedModelsForExperimentRunsTableV2';
import { useResizableMaxWidth } from '@mlflow/mlflow/src/shared/web-shared/hooks/useResizableMaxWidth';

export interface ExperimentViewRunsOwnProps {
  isLoading: boolean;
  experiments: ExperimentEntity[];
  modelVersionFilter?: MODEL_VERSION_FILTER;
  lifecycleFilter?: LIFECYCLE_FILTER;
  datasetsFilter?: DatasetSummary[];
  onMaximizedChange?: (newIsMaximized: boolean) => void;

  searchFacetsState: ExperimentPageSearchFacetsState;
  uiState: ExperimentPageUIState;
}

export interface ExperimentViewRunsProps extends ExperimentViewRunsOwnProps {
  runsData: ExperimentRunsSelectorResult;
  isLoadingRuns: boolean;
  loadMoreRuns: () => Promise<any>;
  moreRunsAvailable: boolean;
  requestError: ErrorWrapper | Error | null;
  refreshRuns: () => void;
}

/**
 * Creates time with milliseconds set to zero, usable in calculating
 * relative time
 */
const createCurrentTime = () => {
  const mountTime = new Date();
  mountTime.setMilliseconds(0);
  return mountTime;
};

const INITIAL_RUN_COLUMN_SIZE = 295;
const CHARTS_MIN_WIDTH = 350;

export const ExperimentViewRuns = React.memo((props: ExperimentViewRunsProps) => {
  const [compareRunsMode] = useExperimentPageViewMode();
  const {
    experiments,
    runsData,
    uiState,
    searchFacetsState,
    isLoadingRuns,
    loadMoreRuns,
    moreRunsAvailable,
    requestError,
    refreshRuns,
  } = props;

  const isComparingExperiments = experiments.length > 1;

  // Non-persistable view model state is being created locally
  const [viewState, setViewState] = useState(new ExperimentPageViewState());

  const { experimentId } = experiments[0];
  const expandRowsStore = useExperimentViewLocalStore(experimentId);
  const [expandRows, updateExpandRows] = useState<boolean>(expandRowsStore.getItem('expandRows') === 'true');

  useEffect(() => {
    expandRowsStore.setItem('expandRows', expandRows);
  }, [expandRows, expandRowsStore]);

  const {
    paramKeyList,
    metricKeyList,
    tagsList,
    paramsList,
    metricsList,
    runInfos,
    runUuidsMatchingFilter,
    datasetsList,
    inputsOutputsList,
  } = runsData;

  const modelVersionsByRunUuid = useSelector(({ entities }: ReduxState) => entities.modelVersionsByRunUuid);

  /**
   * Create a list of run infos with assigned metrics, params and tags
   */
  const runData = useMemo(
    () =>
      runInfos.map((runInfo, index) => ({
        runInfo,
        params: paramsList[index],
        metrics: metricsList[index],
        tags: tagsList[index],
        datasets: datasetsList[index],
        inputs: inputsOutputsList?.[index]?.inputs || {},
        outputs: inputsOutputsList?.[index]?.outputs || {},
      })),
    [datasetsList, metricsList, paramsList, runInfos, tagsList, inputsOutputsList],
  );

  const { orderByKey, searchFilter } = searchFacetsState;
  // In new view state model, runs state is in the uiState instead of the searchFacetsState.
  const { runsPinned, runsExpanded, runsHidden, runListHidden } = uiState;

  const isComparingRuns = compareRunsMode !== 'TABLE';

  const updateViewState = useCallback<UpdateExperimentViewStateFn>(
    (newPartialViewState) => setViewState((currentViewState) => ({ ...currentViewState, ...newPartialViewState })),
    [],
  );

  const addColumnClicked = useCallback(() => {
    updateViewState({ columnSelectorVisible: true });
  }, [updateViewState]);

  const shouldNestChildrenAndFetchParents = useMemo(
    () => (!orderByKey && !searchFilter) || orderByKey === ATTRIBUTE_COLUMN_SORT_KEY.DATE,
    [orderByKey, searchFilter],
  );

  // Value used a reference for the "date" column
  const [referenceTime, setReferenceTime] = useState(createCurrentTime);

  // We're setting new reference date only when new runs data package has arrived
  useEffect(() => {
    setReferenceTime(createCurrentTime);
  }, [runInfos]);

  const filteredTagKeys = useMemo(() => Utils.getVisibleTagKeyList(tagsList), [tagsList]);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDatasetWithRun, setSelectedDatasetWithRun] = useState<DatasetWithRunType>();

  const experimentIds = useMemo(() => experiments.map(({ experimentId }) => experimentId), [experiments]);

  // Check if we should use new GetLoggedModels API.
  // If true, logged (and registered) models will be fetched based on runs inputs/outputs.
  const isUsingGetLoggedModelsAPI = shouldUseGetLoggedModelsBatchAPI();

  // Conditionally use legacy hook for fetching all logged models in the experiment
  const loggedModelsV3ByRunUuidFromExperiment = useLoggedModelsForExperimentRunsTable({
    experimentIds,
    enabled: !isUsingGetLoggedModelsAPI,
  });

  // Conditionally use new hook for fetching logged models based on runs inputs/outputs
  const loggedModelsV3ByRunUuidFromRunInputsOutputs = useLoggedModelsForExperimentRunsTableV2({
    runData,
    enabled: isUsingGetLoggedModelsAPI,
  });

  // Select the appropriate logged models based on the feature flag
  const loggedModelsV3ByRunUuid = isUsingGetLoggedModelsAPI
    ? loggedModelsV3ByRunUuidFromRunInputsOutputs
    : loggedModelsV3ByRunUuidFromExperiment;

  // Use new, memoized version of the row creation function.
  // Internally disabled if the flag is not set.
  const visibleRuns = useExperimentRunRows({
    experiments,
    paramKeyList,
    metricKeyList,
    modelVersionsByRunUuid,
    runsExpanded,
    tagKeyList: filteredTagKeys,
    nestChildren: shouldNestChildrenAndFetchParents,
    referenceTime,
    runData,
    runUuidsMatchingFilter,
    runsPinned,
    runsHidden,
    groupBy: uiState.groupBy,
    groupsExpanded: uiState.groupsExpanded,
    runsHiddenMode: uiState.runsHiddenMode,
    runsVisibilityMap: uiState.runsVisibilityMap,
    useGroupedValuesInCharts: uiState.useGroupedValuesInCharts,
    searchFacetsState,
    loggedModelsV3ByRunUuid,
  });

  const [notificationsFn, notificationContainer] = useLegacyNotification();
  const showFetchedRunsNotifications = useFetchedRunsNotification(notificationsFn);

  const [tableAreaWidth, setTableAreaWidth] = useState(INITIAL_RUN_COLUMN_SIZE);

  const loadMoreRunsCallback = useCallback(() => {
    if (moreRunsAvailable && !isLoadingRuns) {
      // Don't do this if we're loading runs
      // to prevent too many requests from being
      // sent out
      loadMoreRuns().then((runs) => {
        // Display notification about freshly loaded runs
        showFetchedRunsNotifications(runs, runInfos);
      });
    }
  }, [moreRunsAvailable, isLoadingRuns, loadMoreRuns, runInfos, showFetchedRunsNotifications]);

  const datasetSelected = useCallback((dataset: RunDatasetWithTags, run: RunRowType) => {
    setSelectedDatasetWithRun({ datasetWithTags: dataset, runData: run });
    setIsDrawerOpen(true);
  }, []);

  const isTabActive = useIsTabActive();
  const autoRefreshEnabled = uiState.autoRefreshEnabled && isTabActive;
  const usingGroupedValuesInCharts = uiState.useGroupedValuesInCharts ?? true;

  const tableElement =
    requestError instanceof Error && !isLoadingRuns ? (
      <ExperimentViewRunsRequestError error={requestError} />
    ) : (
      <ExperimentViewRunsTable
        experiments={experiments}
        runsData={runsData}
        searchFacetsState={searchFacetsState}
        viewState={viewState}
        isLoading={isLoadingRuns}
        updateViewState={updateViewState}
        onAddColumnClicked={addColumnClicked}
        rowsData={visibleRuns}
        loadMoreRunsFunc={loadMoreRunsCallback}
        moreRunsAvailable={moreRunsAvailable}
        onDatasetSelected={datasetSelected}
        expandRows={expandRows}
        uiState={uiState}
        compareRunsMode={compareRunsMode}
      />
    );

  // Generate a unique storage key based on the experiment IDs
  const configStorageKey = useMemo(
    () =>
      experiments
        .map((e) => e.experimentId)
        .sort()
        .join(','),
    [experiments],
  );

  const { resizableMaxWidth, ref } = useResizableMaxWidth(CHARTS_MIN_WIDTH);

  return (
    <CreateNewRunContextProvider visibleRuns={visibleRuns} refreshRuns={refreshRuns}>
      <RunsChartsSetHighlightContextProvider>
        <ExperimentViewRunsControls
          viewState={viewState}
          updateViewState={updateViewState}
          runsData={runsData}
          searchFacetsState={searchFacetsState}
          experimentId={experimentId}
          requestError={requestError}
          expandRows={expandRows}
          updateExpandRows={updateExpandRows}
          refreshRuns={refreshRuns}
          uiState={uiState}
          isLoading={isLoadingRuns}
          isComparingExperiments={isComparingExperiments}
        />
        <div
          ref={ref}
          css={{
            minHeight: 225, // This is the exact height for displaying a minimum five rows and table header
            height: '100%',
            position: 'relative',
            display: 'flex',
          }}
        >
          {isComparingRuns ? (
            <ExperimentViewRunsTableResizer
              onResize={setTableAreaWidth}
              runListHidden={runListHidden}
              width={tableAreaWidth}
              maxWidth={resizableMaxWidth}
            >
              {tableElement}
            </ExperimentViewRunsTableResizer>
          ) : (
            tableElement
          )}
          {compareRunsMode === 'CHART' && (
            <RunsCompare
              isLoading={isLoadingRuns}
              comparedRuns={visibleRuns}
              metricKeyList={runsData.metricKeyList}
              paramKeyList={runsData.paramKeyList}
              experimentTags={runsData.experimentTags}
              compareRunCharts={uiState.compareRunCharts}
              compareRunSections={uiState.compareRunSections}
              groupBy={usingGroupedValuesInCharts ? uiState.groupBy : null}
              autoRefreshEnabled={autoRefreshEnabled}
              hideEmptyCharts={uiState.hideEmptyCharts}
              globalLineChartConfig={uiState.globalLineChartConfig}
              chartsSearchFilter={uiState.chartsSearchFilter}
              storageKey={configStorageKey}
              minWidth={CHARTS_MIN_WIDTH}
            />
          )}
          {compareRunsMode === 'ARTIFACT' && (
            <EvaluationArtifactCompareView
              comparedRuns={visibleRuns}
              viewState={viewState}
              updateViewState={updateViewState}
              onDatasetSelected={datasetSelected}
              disabled={Boolean(uiState.groupBy)}
            />
          )}
          {notificationContainer}
          {selectedDatasetWithRun && (
            <ExperimentViewDatasetDrawer
              isOpen={isDrawerOpen}
              setIsOpen={setIsDrawerOpen}
              selectedDatasetWithRun={selectedDatasetWithRun}
              setSelectedDatasetWithRun={setSelectedDatasetWithRun}
            />
          )}
        </div>
      </RunsChartsSetHighlightContextProvider>
    </CreateNewRunContextProvider>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsColumnSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsColumnSelector.tsx
Signals: React

```typescript
import {
  Button,
  ChevronDownIcon,
  ColumnsIcon,
  Dropdown,
  Input,
  SearchIcon,
  Tree,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { Theme } from '@emotion/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Utils from '../../../../../common/utils/Utils';
import { ATTRIBUTE_COLUMN_LABELS, COLUMN_TYPES } from '../../../../constants';
import { useUpdateExperimentViewUIState } from '../../contexts/ExperimentPageUIStateContext';
import { useExperimentIds } from '../../hooks/useExperimentIds';
import type { ExperimentPageUIState } from '../../models/ExperimentPageUIState';
import {
  extractCanonicalSortKey,
  isCanonicalSortKeyOfType,
  makeCanonicalSortKey,
} from '../../utils/experimentPage.common-utils';
import type { ExperimentRunsSelectorResult } from '../../utils/experimentRuns.selector';
import { customMetricBehaviorDefs } from '../../utils/customMetricBehaviorUtils';

/**
 * We need to recreate antd's tree check callback signature since it's not importable
 */
type AntdTreeCheckCallback = { node: { key: string | number; checked: boolean } };

/**
 * Function localizing antd tree inside a DOM element. Used to focusing by keyboard.
 */
const locateAntdTree = (parent: HTMLElement | null): HTMLElement | null =>
  parent?.querySelector('[role="tree"] input') || null;

const GROUP_KEY = 'GROUP';

const GROUP_KEY_ATTRIBUTES = makeCanonicalSortKey(GROUP_KEY, COLUMN_TYPES.ATTRIBUTES);
const GROUP_KEY_PARAMS = makeCanonicalSortKey(GROUP_KEY, COLUMN_TYPES.PARAMS);
const GROUP_KEY_METRICS = makeCanonicalSortKey(GROUP_KEY, COLUMN_TYPES.METRICS);
const GROUP_KEY_TAGS = makeCanonicalSortKey(GROUP_KEY, COLUMN_TYPES.TAGS);

/**
 * Returns all usable attribute columns basing on view mode and enabled flagged features
 */
const getAttributeColumns = (isComparing: boolean) => {
  const result = [
    ATTRIBUTE_COLUMN_LABELS.USER,
    ATTRIBUTE_COLUMN_LABELS.SOURCE,
    ATTRIBUTE_COLUMN_LABELS.VERSION,
    ATTRIBUTE_COLUMN_LABELS.MODELS,
    ATTRIBUTE_COLUMN_LABELS.DESCRIPTION,
  ];

  if (isComparing) {
    result.unshift(ATTRIBUTE_COLUMN_LABELS.EXPERIMENT_NAME);
  }

  result.unshift(ATTRIBUTE_COLUMN_LABELS.DATASET);

  return result;
};

/**
 * Function filters list of string by a given query string.
 */
const findMatching = (values: string[], filterQuery: string) =>
  values.filter((v) => v.toLowerCase().includes(filterQuery.toLowerCase()));

/**
 * Function dissects given string and wraps the
 * searched query with <strong>...</strong> if found. Used for highlighting search.
 */
const createHighlightedNode = (value: string, filterQuery: string) => {
  if (!filterQuery) {
    return value;
  }
  const index = value.toLowerCase().indexOf(filterQuery.toLowerCase());
  const beforeStr = value.substring(0, index);
  const matchStr = value.substring(index, index + filterQuery.length);
  const afterStr = value.substring(index + filterQuery.length);

  return index > -1 ? (
    <span>
      {beforeStr}
      <strong>{matchStr}</strong>
      {afterStr}
    </span>
  ) : (
    value
  );
};
export interface ExperimentViewRunsColumnSelectorProps {
  runsData: ExperimentRunsSelectorResult;
  columnSelectorVisible: boolean;
  onChangeColumnSelectorVisible: (value: boolean) => void;
  selectedColumns: string[];
}

/**
 * A component displaying the searchable column list - implementation.
 */
export const ExperimentViewRunsColumnSelector = React.memo(
  ({
    runsData,
    columnSelectorVisible,
    onChangeColumnSelectorVisible,
    selectedColumns,
  }: ExperimentViewRunsColumnSelectorProps) => {
    const updateUIState = useUpdateExperimentViewUIState();
    const experimentIds = useExperimentIds();
    const [filter, setFilter] = useState('');
    const { theme } = useDesignSystemTheme();

    const searchInputRef = useRef<any>(null);
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Extract all attribute columns
    const attributeColumnNames = useMemo(() => getAttributeColumns(experimentIds.length > 1), [experimentIds.length]);

    const setCheckedColumns = useCallback(
      (updateFn: (existingCheckedColumns: string[]) => string[]) =>
        updateUIState((facets: ExperimentPageUIState) => {
          const newColumns = updateFn(facets.selectedColumns);
          const uniqueNewColumns = Array.from(new Set(newColumns));
          return { ...facets, selectedColumns: uniqueNewColumns };
        }),
      [updateUIState],
    );

    // Extract unique list of tags
    const tagsKeyList = useMemo(() => Utils.getVisibleTagKeyList(runsData.tagsList), [runsData]);

    // Extract canonical key names for attributes, params, metrics and tags.
    const canonicalKeyNames = useMemo(
      () => ({
        [COLUMN_TYPES.ATTRIBUTES]: attributeColumnNames.map((key) =>
          makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, key),
        ),
        [COLUMN_TYPES.PARAMS]: runsData.paramKeyList.map((key) => makeCanonicalSortKey(COLUMN_TYPES.PARAMS, key)),
        [COLUMN_TYPES.METRICS]: runsData.metricKeyList.map((key) => makeCanonicalSortKey(COLUMN_TYPES.METRICS, key)),
        [COLUMN_TYPES.TAGS]: tagsKeyList.map((key) => makeCanonicalSortKey(COLUMN_TYPES.TAGS, key)),
      }),
      [runsData, attributeColumnNames, tagsKeyList],
    );

    // This memoized value holds the tree structure generated from
    // attributes, params, metrics and tags. Displays only filtered values.
    const treeData = useMemo(() => {
      const result = [];

      const filteredAttributes = findMatching(attributeColumnNames, filter);
      const filteredParams = findMatching(runsData.paramKeyList, filter);
      const filteredMetrics = findMatching(runsData.metricKeyList, filter);
      const filteredTags = findMatching(tagsKeyList, filter);

      if (filteredAttributes.length) {
        result.push({
          key: GROUP_KEY_ATTRIBUTES,
          title: `Attributes`,
          children: filteredAttributes.map((attributeKey) => ({
            key: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, attributeKey),
            title: createHighlightedNode(attributeKey, filter),
          })),
        });
      }
      if (filteredMetrics.length) {
        result.push({
          key: GROUP_KEY_METRICS,
          title: `Metrics (${filteredMetrics.length})`,
          children: filteredMetrics.map((metricKey) => {
            const customColumnDef = customMetricBehaviorDefs[metricKey];
            return {
              key: makeCanonicalSortKey(COLUMN_TYPES.METRICS, metricKey),
              title: createHighlightedNode(customColumnDef?.displayName ?? metricKey, filter),
            };
          }),
        });
      }
      if (filteredParams.length) {
        result.push({
          key: GROUP_KEY_PARAMS,
          title: `Parameters (${filteredParams.length})`,
          children: filteredParams.map((paramKey) => ({
            key: makeCanonicalSortKey(COLUMN_TYPES.PARAMS, paramKey),
            title: createHighlightedNode(paramKey, filter),
          })),
        });
      }
      if (filteredTags.length) {
        result.push({
          key: GROUP_KEY_TAGS,
          title: `Tags (${filteredTags.length})`,
          children: filteredTags.map((tagKey) => ({
            key: makeCanonicalSortKey(COLUMN_TYPES.TAGS, tagKey),
            title: tagKey,
          })),
        });
      }

      return result;
    }, [attributeColumnNames, filter, runsData, tagsKeyList]);

    // This callback toggles entire group of keys
    const toggleGroup = useCallback(
      (isChecked: boolean, keyList: string[]) => {
        if (!isChecked) {
          setCheckedColumns((checked) => [...checked, ...keyList]);
        } else {
          setCheckedColumns((checked) => checked.filter((k) => !keyList.includes(k)));
        }
      },
      [setCheckedColumns],
    );

    // This callback is intended to select/deselect a single key
    const toggleSingleKey = useCallback(
      (key: string, isChecked: boolean) => {
        if (!isChecked) {
          setCheckedColumns((checked) => [...checked, key]);
        } else {
          setCheckedColumns((checked) => checked.filter((k) => k !== key));
        }
      },
      [setCheckedColumns],
    );

    useEffect(() => {
      if (columnSelectorVisible) {
        setFilter('');

        // Let's wait for the next execution frame, then:
        // - restore the dropdown menu scroll position
        // - focus the search input
        // - bring the dropdown into the viewport using scrollIntoView()
        requestAnimationFrame(() => {
          scrollableContainerRef?.current?.scrollTo(0, 0);
          searchInputRef.current?.focus({ preventScroll: true });

          if (buttonRef.current) {
            buttonRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        });
      }
    }, [columnSelectorVisible]);

    const onCheck = useCallback(
      // We need to recreate antd's tree check callback signature
      (_: any, { node: { key, checked } }: AntdTreeCheckCallback) => {
        if (isCanonicalSortKeyOfType(key.toString(), GROUP_KEY)) {
          const columnType = extractCanonicalSortKey(key.toString(), GROUP_KEY);
          const canonicalKeysForGroup = canonicalKeyNames[columnType];
          if (canonicalKeysForGroup) {
            toggleGroup(checked, findMatching(canonicalKeysForGroup, filter));
          }
        } else {
          toggleSingleKey(key.toString(), checked);
        }
      },
      [canonicalKeyNames, toggleGroup, toggleSingleKey, filter],
    );

    // This callback moves focus to tree element if down arrow has been pressed
    // when inside search input area.
    const searchInputKeyDown = useCallback<React.KeyboardEventHandler<HTMLInputElement>>((e) => {
      if (e.key === 'ArrowDown') {
        const treeElement = locateAntdTree(scrollableContainerRef.current);

        if (treeElement) {
          treeElement.focus();
        }
      }
    }, []);

    // A JSX block containing the dropdown
    const dropdownContent = (
      <div
        css={{
          backgroundColor: theme.colors.backgroundPrimary,
          width: 400,
          border: `1px solid`,
          borderColor: theme.colors.border,
          [theme.responsive.mediaQueries.xs]: {
            width: '100vw',
          },
        }}
        onKeyDown={(e) => {
          // Since we're controlling the visibility of the dropdown,
          // we need to handle the escape key to close it.
          if (e.key === 'Escape') {
            onChangeColumnSelectorVisible(false);
            buttonRef.current?.focus();
          }
        }}
      >
        <div css={(theme) => ({ padding: theme.spacing.md })}>
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscolumnselector.tsx_300"
            value={filter}
            prefix={<SearchIcon />}
            placeholder="Search columns"
            allowClear
            ref={searchInputRef}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            onKeyDown={searchInputKeyDown}
          />
        </div>
        <div
          ref={scrollableContainerRef}
          css={{
            // Maximum height of 15 elements times 32 pixels as defined in
            // design-system/src/design-system/Tree/Tree.tsx
            maxHeight: 15 * 32,
            overflowY: 'scroll',
            overflowX: 'hidden',
            paddingBottom: theme.spacing.md,
            'span[title]': {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            },
            [theme.responsive.mediaQueries.xs]: {
              maxHeight: 'calc(100vh - 100px)',
            },
          }}
        >
          <Tree
            data-testid="column-selector-tree"
            mode="checkable"
            dangerouslySetAntdProps={{
              checkedKeys: selectedColumns,
              onCheck,
            }}
            defaultExpandedKeys={[GROUP_KEY_ATTRIBUTES, GROUP_KEY_PARAMS, GROUP_KEY_METRICS, GROUP_KEY_TAGS]}
            treeData={treeData}
          />
        </div>
      </div>
    );

    return (
      <Dropdown
        overlay={dropdownContent}
        placement="bottomLeft"
        trigger={['click']}
        visible={columnSelectorVisible}
        onVisibleChange={onChangeColumnSelectorVisible}
      >
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_experimentviewrunscolumnselector.tsx_315"
          ref={buttonRef}
          style={{ display: 'flex', alignItems: 'center' }}
          data-testid="column-selection-dropdown"
          icon={<ColumnsIcon />}
        >
          <FormattedMessage
            defaultMessage="Columns"
            description="Dropdown text to display columns names that could to be rendered for the experiment runs table"
          />{' '}
          <ChevronDownIcon />
        </Button>
      </Dropdown>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentViewRunsControls.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/ExperimentViewRunsControls.stories.tsx
Signals: React, Redux/RTK

```typescript
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../../../../common/utils/RoutingUtils';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../../fixtures/experiment-runs.fixtures';
import { ExperimentViewRunsControls } from './ExperimentViewRunsControls';
import { experimentRunsSelector } from '../../utils/experimentRuns.selector';
import type { ExperimentPageViewState } from '../../models/ExperimentPageViewState';
import { createExperimentPageUIState } from '../../models/ExperimentPageUIState';
import { createExperimentPageSearchFacetsState } from '../../models/ExperimentPageSearchFacetsState';

const MOCK_EXPERIMENT = EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'];

const MOCK_RUNS_DATA = experimentRunsSelector(EXPERIMENT_RUNS_MOCK_STORE, {
  experiments: [MOCK_EXPERIMENT],
});

const MOCK_ACTIONS = {
  searchRunsPayload: () => Promise.resolve({}),
  searchRunsApi: () => ({ type: 'foobar', payload: Promise.resolve({}), meta: {} }),
};

export default {
  title: 'ExperimentView/ExperimentViewRunsControls',
  component: ExperimentViewRunsControls,
  argTypes: {},
};

const createComponentWrapper = (viewState: ExperimentPageViewState) => () => {
  const [searchFacetsState] = useState(createExperimentPageSearchFacetsState());
  const [messages] = useState<string[]>([]);

  return (
    <Provider
      store={createStore((s) => s as any, EXPERIMENT_RUNS_MOCK_STORE, compose(applyMiddleware(promiseMiddleware())))}
    >
      <IntlProvider locale="en">
        <MemoryRouter>
          <div
            css={{
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: '1px solid #ccc',
            }}
          >
            <h2>Component:</h2>
          </div>
          <ExperimentViewRunsControls
            runsData={MOCK_RUNS_DATA}
            searchFacetsState={searchFacetsState}
            experimentId="123"
            viewState={viewState}
            updateViewState={() => {}}
            requestError={null}
            expandRows={false}
            updateExpandRows={() => {}}
            refreshRuns={() => {}}
            uiState={createExperimentPageUIState()}
            isLoading={false}
            isComparingExperiments={false}
          />
          <div
            css={{
              marginTop: 20,
              paddingTop: 10,
              borderTop: '1px solid #ccc',
            }}
          >
            <h2>Debug info:</h2>
            <h3>Current search facets state:</h3>
            <div css={{ fontFamily: 'monospace', marginBottom: 10 }}>{JSON.stringify(searchFacetsState)}</div>
            <h3>Log:</h3>
            {messages.map((m, i) => (
              <div key={i} css={{ fontFamily: 'monospace' }}>
                - {m}
              </div>
            ))}
          </div>
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
};

export const Default = createComponentWrapper({
  runsSelected: {},
  columnSelectorVisible: false,
  hiddenChildRunsSelected: {},
  previewPaneVisible: false,
  artifactViewState: {},
});

export const WithOneRunSelected = createComponentWrapper({
  runsSelected: { experiment123456789_run1: true, experiment123456789_run2: false },
  columnSelectorVisible: false,
  hiddenChildRunsSelected: {},
  previewPaneVisible: false,
  artifactViewState: {},
});

export const WithTwoRunSelected = createComponentWrapper({
  runsSelected: { experiment123456789_run1: true, experiment123456789_run2: true },
  columnSelectorVisible: false,
  hiddenChildRunsSelected: {},
  previewPaneVisible: false,
  artifactViewState: {},
});
```

--------------------------------------------------------------------------------

````

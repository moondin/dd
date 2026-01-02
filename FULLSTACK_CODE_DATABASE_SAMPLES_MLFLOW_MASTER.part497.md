---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 497
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 497 of 991)

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

---[FILE: useUpdateExperimentTags.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useUpdateExperimentTags.test.tsx

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import {
  renderHook,
  act,
  waitFor,
  render,
  screen,
  within,
  fastFillInput,
  renderWithIntl,
} from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { useUpdateExperimentTags } from './useUpdateExperimentTags';
import type { ExperimentEntity } from '../../../types';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MlflowService } from '../../../sdk/MlflowService';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';

jest.mock('../../../../common/utils/LocalStorageUtils');

const mockExperiment = {
  experiment_id: '12345',
  name: 'test-experiment',
  tags: [{ key: 'tag1', value: 'value1' }],
} as unknown as ExperimentEntity;

describe('useUpdateExperimentTags', () => {
  beforeEach(() => {
    jest.spyOn(MlflowService, 'setExperimentTag').mockResolvedValue({});
    jest.spyOn(MlflowService, 'deleteExperimentTag').mockResolvedValue({});
  });

  function renderTestComponent(onSuccess: () => void) {
    function TestComponent() {
      const { showEditExperimentTagsModal, EditTagsModal } = useUpdateExperimentTags({ onSuccess });
      return (
        <>
          <button onClick={() => showEditExperimentTagsModal(mockExperiment)}>trigger button</button>
          {EditTagsModal}
        </>
      );
    }
    renderWithIntl(
      <QueryClientProvider client={new QueryClient()}>
        <DesignSystemProvider>
          <TestComponent />
        </DesignSystemProvider>
      </QueryClientProvider>,
    );
  }

  const renderTestHook = (onSuccess: () => void) =>
    renderHook(() => useUpdateExperimentTags({ onSuccess }), {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
          </DesignSystemProvider>
        </IntlProvider>
      ),
    });

  it('should show nothing initially', () => {
    const onSuccess = jest.fn();
    const { result } = renderTestHook(onSuccess);

    expect(result.current.EditTagsModal.props.visible).toBeFalsy();
    expect(result.current.isLoading).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should show edit modal if called with experiment', async () => {
    const onSuccess = jest.fn();
    const { result } = renderTestHook(onSuccess);

    act(() => {
      result.current.showEditExperimentTagsModal(mockExperiment);
    });

    await waitFor(() => {
      expect(result.current.EditTagsModal).not.toBeNull();
    });

    expect(result.current.EditTagsModal.props.visible).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call api services and success callback when edited and saved', async () => {
    const onSuccess = jest.fn();
    renderTestComponent(onSuccess);

    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));

    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();
    await userEvent.click(within(screen.getByRole('status', { name: 'tag1' })).getByRole('button'));

    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'tag2');

    await userEvent.click(screen.getByText(/Add tag "tag2"/));
    await fastFillInput(screen.getByLabelText('Value'), 'value2');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    await waitFor(() => {
      expect(MlflowService.deleteExperimentTag).toHaveBeenCalledWith({
        experiment_id: mockExperiment.experimentId,
        key: 'tag1',
      });
      expect(MlflowService.setExperimentTag).toHaveBeenCalledWith({
        experiment_id: mockExperiment.experimentId,
        key: 'tag2',
        value: 'value2',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useUpdateExperimentTags.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useUpdateExperimentTags.tsx
Signals: React

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useEditKeyValueTagsModal } from '../../../../common/hooks/useEditKeyValueTagsModal';
import { useCallback } from 'react';
import { diffCurrentAndNewTags, isUserFacingTag } from '../../../../common/utils/TagUtils';
import { MlflowService } from '../../../sdk/MlflowService';
import type { ExperimentEntity } from '../../../types';

type UpdateTagsPayload = {
  experimentId: string;
  toAdd: { key: string; value: string }[];
  toDelete: { key: string }[];
};

export const useUpdateExperimentTags = ({ onSuccess }: { onSuccess?: () => void }) => {
  const updateMutation = useMutation<unknown, Error, UpdateTagsPayload>({
    mutationFn: async ({ toAdd, toDelete, experimentId }) => {
      return Promise.all([
        ...toAdd.map(({ key, value }) => MlflowService.setExperimentTag({ experiment_id: experimentId, key, value })),
        ...toDelete.map(({ key }) => MlflowService.deleteExperimentTag({ experiment_id: experimentId, key })),
      ]);
    },
  });

  const { EditTagsModal, showEditTagsModal, isLoading } = useEditKeyValueTagsModal<
    Pick<ExperimentEntity, 'experimentId' | 'name' | 'tags'>
  >({
    valueRequired: true,
    saveTagsHandler: (experiment, currentTags, newTags) => {
      const { addedOrModifiedTags, deletedTags } = diffCurrentAndNewTags(currentTags, newTags);

      return new Promise<void>((resolve, reject) => {
        if (!experiment) {
          return reject();
        }
        // Send all requests to the mutation
        updateMutation.mutate(
          {
            experimentId: experiment.experimentId,
            toAdd: addedOrModifiedTags,
            toDelete: deletedTags,
          },
          {
            onSuccess: () => {
              resolve();
              onSuccess?.();
            },
            onError: reject,
          },
        );
      });
    },
  });

  const showEditExperimentTagsModal = useCallback(
    (experiment: ExperimentEntity) =>
      showEditTagsModal({
        experimentId: experiment.experimentId,
        name: experiment.name,
        tags: experiment.tags.filter((tag) => isUserFacingTag(tag.key)),
      }),
    [showEditTagsModal],
  );

  return { EditTagsModal, showEditExperimentTagsModal, isLoading };
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageSearchFacetsState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/models/ExperimentPageSearchFacetsState.tsx

```typescript
import {
  DEFAULT_LIFECYCLE_FILTER,
  DEFAULT_MODEL_VERSION_FILTER,
  DEFAULT_ORDER_BY_ASC,
  DEFAULT_ORDER_BY_KEY,
  DEFAULT_START_TIME,
} from '../../../constants';
import type { DatasetSummary, LIFECYCLE_FILTER, MODEL_VERSION_FILTER } from '../../../types';

/**
 * Defines persistable model representing sort and filter values
 * used by runs table and controls
 */
export interface ExperimentPageSearchFacetsState {
  /**
   * SQL-like query string used to filter runs, e.g. "params.alpha = '0.5'"
   */
  searchFilter: string;

  /**
   * Canonical order_by key like "params.`alpha`". May be null to indicate the table
   * should use the natural row ordering provided by the server.
   */
  orderByKey: string;

  /**
   * Whether the order imposed by orderByKey should be ascending or descending.
   */
  orderByAsc: boolean;

  /**
   * Filter key to show results based on start time
   */
  startTime: string;

  /**
   * Lifecycle filter of runs to display
   */
  lifecycleFilter: LIFECYCLE_FILTER;

  /**
   * Datasets filter of runs to display
   */
  datasetsFilter: DatasetSummary[];

  /**
   * Filter of model versions to display
   */
  modelVersionFilter: MODEL_VERSION_FILTER;
}

/**
 * Defines default experiment page search facets state.
 */
export const createExperimentPageSearchFacetsState = (): ExperimentPageSearchFacetsState => ({
  searchFilter: '',
  orderByKey: DEFAULT_ORDER_BY_KEY,
  orderByAsc: DEFAULT_ORDER_BY_ASC,
  startTime: DEFAULT_START_TIME,
  lifecycleFilter: DEFAULT_LIFECYCLE_FILTER,
  datasetsFilter: [],
  modelVersionFilter: DEFAULT_MODEL_VERSION_FILTER,
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageUIState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/models/ExperimentPageUIState.tsx

```typescript
import { ATTRIBUTE_COLUMN_LABELS, COLUMN_TYPES } from '../../../constants';
import type { RunsChartsLineCardConfig, SerializedRunsChartsCardConfigCard } from '../../runs-charts/runs-charts.types';
import { makeCanonicalSortKey } from '../utils/experimentPage.common-utils';
import type { ChartSectionConfig } from '@mlflow/mlflow/src/experiment-tracking/types';
import type { RunsGroupByConfig } from '../utils/experimentPage.group-row-utils';
import { RunsChartsLineChartXAxisType } from '../../runs-charts/components/RunsCharts.common';

export const EXPERIMENT_PAGE_UI_STATE_FIELDS = [
  'selectedColumns',
  'runsExpanded',
  'runsPinned',
  'runsHidden',
  'runsVisibilityMap',
  'runsHiddenMode',
  'compareRunCharts',
  'compareRunSections',
  'viewMaximized',
  'runListHidden',
  'isAccordionReordered',
  'groupBy',
  'groupsExpanded',
  'autoRefreshEnabled',
  'useGroupedValuesInCharts',
  'hideEmptyCharts',
  'globalLineChartConfig',
  'chartsSearchFilter',
];

const getDefaultSelectedColumns = () => {
  const result = [
    // "Source" and "Model" columns are visible by default
    makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, ATTRIBUTE_COLUMN_LABELS.SOURCE),
    makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, ATTRIBUTE_COLUMN_LABELS.MODELS),
    makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, ATTRIBUTE_COLUMN_LABELS.DATASET),
  ];

  return result;
};

export enum RUNS_VISIBILITY_MODE {
  SHOWALL = 'SHOW_ALL',
  HIDEALL = 'HIDE_ALL',
  FIRST_10_RUNS = 'FIRST_10_RUNS',
  FIRST_20_RUNS = 'FIRST_20_RUNS',
  HIDE_FINISHED_RUNS = 'HIDE_FINISHED_RUNS',
  CUSTOM = 'CUSTOM',
}

export type RunsChartsGlobalLineChartConfig = Partial<
  Pick<RunsChartsLineCardConfig, 'selectedXAxisMetricKey' | 'xAxisKey' | 'lineSmoothness'>
>;

/**
 * An interface describing serializable, persistable configuration for charts displaying
 * experiment run data: metrics, parameters etc. Used in experiment page's runs compare view and
 * run page's charts view.
 */
export interface ExperimentRunsChartsUIConfiguration {
  /**
   * Currently configured charts for comparing runs, if any.
   */
  compareRunCharts?: SerializedRunsChartsCardConfigCard[];

  /**
   * Currently configured sections for grouping charts across runs
   */
  compareRunSections?: ChartSectionConfig[];
  /**
   * Determines if the sections have been reordered
   */
  isAccordionReordered: boolean;

  /**
   * Determines if the auto refresh of the chart data is enabled
   */
  autoRefreshEnabled: boolean;

  /**
   * Global line chart settings that are applied to all line charts
   */
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;

  /**
   * Regex string used to filter visible charts
   */
  chartsSearchFilter?: string;
}

/**
 * Defines model representing experiment page UI state.
 */
export interface ExperimentPageUIState extends ExperimentRunsChartsUIConfiguration {
  /**
   * Currently selected visible columns
   */
  selectedColumns: string[];

  /**
   * Object mapping run UUIDs (strings) to booleans, where a boolean value of true indicates that
   * a run has been expanded (its child runs are visible).
   */
  runsExpanded: Record<string, boolean>;

  /**
   * List of pinned row UUIDs
   */
  runsPinned: string[];

  /**
   * List of hidden row UUIDs
   * @deprecated Use "runsVisibilityMap" field instead which has better control over visibility
   */
  runsHidden: string[];

  /**
   * Determines default visibility mode for runs which are not explicitly specified by "runsVisibilityMap" field
   */
  runsHiddenMode: RUNS_VISIBILITY_MODE;

  /**
   * Object mapping run UUIDs (strings) to booleans, where a boolean value of true indicates that
   * a run has been hidden (its child runs are not visible).
   */
  runsVisibilityMap?: Record<string, boolean>;

  /**
   * Determines if the experiment view is maximized
   */
  viewMaximized: boolean;

  /**
   * Determines if the run list is hidden
   */
  runListHidden: boolean;

  /**
   * Current group by key - contains mode (tag, param, dataset), value and aggregation function
   */
  groupBy: string | RunsGroupByConfig | null;

  /**
   * Determines if the grouped and aggregated values should be displayed in charts
   */
  useGroupedValuesInCharts?: boolean;

  /**
   * Map of the currently expanded run groups
   */
  groupsExpanded: Record<string, boolean>;

  /**
   * Determines if charts with no corresponding data should be hidden
   */
  hideEmptyCharts?: boolean;
}

/**
 * Creates a new instance of experiment page UI state.
 */
export const createExperimentPageUIState = (): ExperimentPageUIState => ({
  selectedColumns: getDefaultSelectedColumns(),
  runsExpanded: {},
  runsPinned: [],
  runsHidden: [],
  runsVisibilityMap: {},
  runsHiddenMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
  compareRunCharts: undefined,
  compareRunSections: undefined,
  viewMaximized: false,
  runListHidden: false,
  isAccordionReordered: false,
  useGroupedValuesInCharts: true,
  hideEmptyCharts: true,
  groupBy: null,
  groupsExpanded: {},
  // Auto-refresh is enabled by default
  autoRefreshEnabled: true,
  globalLineChartConfig: {
    xAxisKey: RunsChartsLineChartXAxisType.STEP,
    lineSmoothness: 0,
    selectedXAxisMetricKey: '',
  },
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageViewState.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/models/ExperimentPageViewState.ts

```typescript
/**
 * Defines non-persistable, local state that
 * controls visibility of various UI elements in the
 * runs table and controls
 */
export class ExperimentPageViewState {
  /**
   * Currently selected runs
   */
  runsSelected: Record<string, boolean> = {};

  /**
   * Currently hidden, selected child runs
   */
  hiddenChildRunsSelected: Record<string, boolean> = {};

  /**
   * Display "select columns" dropdown
   */
  columnSelectorVisible = false;

  /**
   * Display "select columns" dropdown
   */
  previewPaneVisible = false;

  /**
   * Persists controls state in the evaluation artifact compare mode
   */
  artifactViewState: {
    selectedTables?: string[];
    groupByCols?: string[];
    outputColumn?: string;
    intersectingOnly?: boolean;
  } = {
    selectedTables: [],
    groupByCols: [],
    outputColumn: '',
    intersectingOnly: false,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: customMetricBehaviorUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/customMetricBehaviorUtils.ts

```typescript
/**
 * Defines the behavior of a custom metric in the experiment page.
 */
interface CustomMetricBehaviorDef {
  /**
   * Display name of the metric. Used in column header, chart title, sort by and column selector.
   */
  displayName: string;
  /**
   * Formatter for the metric value. Used in table and chart tooltips.
   */
  valueFormatter: ({ value }: { value: number | string }) => string;
  /**
   * Initial width of the column in the table in pixels.
   */
  initialColumnWidth?: number;
  /**
   * Format of the axis tick labels in the chart.
   */
  chartAxisTickFormat?: string;
}

/**
 * Custom metric behavior definitions.
 */
export const customMetricBehaviorDefs: Record<string, CustomMetricBehaviorDef> = {
  // empty
};
```

--------------------------------------------------------------------------------

---[FILE: expandedRunsViewStateInitializer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/expandedRunsViewStateInitializer.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { expandedEvaluationRunRowsUIStateInitializer } from './expandedRunsViewStateInitializer';
import { createBaseExperimentEntity, createBaseRunsData, createBaseUIState } from './test-utils';

describe('expandedRunsViewStateInitializer', () => {
  test("it should not change ui state if it's already seeded", () => {
    const initialState = createBaseUIState();
    const baseRunsData = createBaseRunsData();
    const experiments = [createBaseExperimentEntity()];
    const updatedState = expandedEvaluationRunRowsUIStateInitializer(experiments, initialState, baseRunsData, true);

    // Should be unchanged because it's already seeded
    expect(updatedState).toEqual(initialState);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: expandedRunsViewStateInitializer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/expandedRunsViewStateInitializer.ts

```typescript
import { compact } from 'lodash';
import { MLFLOW_RUN_TYPE_TAG, MLFLOW_RUN_TYPE_VALUE_EVALUATION } from '../../../constants';
import type { ExperimentEntity } from '../../../types';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { EXPERIMENT_PARENT_ID_TAG } from './experimentPage.common-utils';
import type { ExperimentRunsSelectorResult } from './experimentRuns.selector';

export const expandedEvaluationRunRowsUIStateInitializer = (
  experiments: ExperimentEntity[],
  uiState: ExperimentPageUIState,
  runsData: ExperimentRunsSelectorResult,
  isSeeded: boolean,
) => {
  if (isSeeded) {
    return uiState;
  }

  const evaluationRunIds = runsData.runInfos
    .filter((run, index) => runsData.tagsList[index]?.[MLFLOW_RUN_TYPE_TAG]?.value === MLFLOW_RUN_TYPE_VALUE_EVALUATION)
    .map(({ runUuid }) => runUuid);

  const parentIdsOfEvaluationRunIds = compact(
    runsData.runInfos.map(
      ({ runUuid }, index) =>
        evaluationRunIds.includes(runUuid) && runsData.tagsList[index]?.[EXPERIMENT_PARENT_ID_TAG].value,
    ),
  );

  if (parentIdsOfEvaluationRunIds.length) {
    return {
      ...uiState,
      runsExpanded: parentIdsOfEvaluationRunIds.reduce(
        (aggregate, runUuid) => ({ ...aggregate, [runUuid]: true }),
        uiState.runsExpanded,
      ),
    };
  }
  return uiState;
};
```

--------------------------------------------------------------------------------

---[FILE: experimentPage.column-utils.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.column-utils.enzyme.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { mount } from 'enzyme';
import { ATTRIBUTE_COLUMN_LABELS, COLUMN_TYPES } from '../../../constants';
import type { UseRunsColumnDefinitionsParams } from './experimentPage.column-utils';
import { useRunsColumnDefinitions } from './experimentPage.column-utils';
import {
  EXPERIMENT_FIELD_PREFIX_METRIC,
  EXPERIMENT_FIELD_PREFIX_PARAM,
  EXPERIMENT_FIELD_PREFIX_TAG,
  makeCanonicalSortKey,
} from './experimentPage.common-utils';
import type { ColDef, ColGroupDef } from '@ag-grid-community/core';
import { createExperimentPageUIState } from '../models/ExperimentPageUIState';

const getHookResult = (params: UseRunsColumnDefinitionsParams) => {
  let result = null;
  const Component = () => {
    result = useRunsColumnDefinitions(params);
    return null;
  };
  mount(<Component />);
  return result;
};

describe('ExperimentViewRuns column utils', () => {
  const MOCK_HOOK_PARAMS: UseRunsColumnDefinitionsParams = {} as any;

  const MOCK_METRICS = ['metric_1', 'metric_2'];
  const MOCK_PARAMS = ['param_1', 'param_2'];
  const MOCK_TAGS = ['tag_1', 'tag_2'];

  beforeEach(() => {
    Object.assign(MOCK_HOOK_PARAMS, {
      columnApi: { setColumnVisible: jest.fn() },
      compareExperiments: false,
      metricKeyList: MOCK_METRICS,
      paramKeyList: MOCK_PARAMS,
      tagKeyList: MOCK_TAGS,
      onExpand: jest.fn(),
      onTogglePin: jest.fn(),
      onToggleVisibility: jest.fn(),
      selectedColumns: createExperimentPageUIState().selectedColumns,
    });
  });

  test('it creates proper column definitions with basic attributes', () => {
    const columnDefinitions = getHookResult(MOCK_HOOK_PARAMS);

    // Assert existence of regular attribute columns
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.DATE,
          cellRenderer: 'DateCellRenderer',
        }),
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.DURATION,
        }),
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.RUN_NAME,
          cellRenderer: 'RunNameCellRenderer',
        }),
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.USER,
        }),
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.VERSION,
          cellRenderer: 'VersionCellRenderer',
        }),
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.SOURCE,
          cellRenderer: 'SourceCellRenderer',
        }),
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.DESCRIPTION,
          cellRenderer: 'RunDescriptionCellRenderer',
        }),
      ]),
    );

    // Assert existence of metric, param and tag columns
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          children: expect.arrayContaining(
            MOCK_METRICS.map((key) =>
              expect.objectContaining({
                colId: makeCanonicalSortKey(COLUMN_TYPES.METRICS, key),
                field: `${EXPERIMENT_FIELD_PREFIX_METRIC}-${key}`,
              }),
            ),
          ),
        }),
        expect.objectContaining({
          children: expect.arrayContaining(
            MOCK_PARAMS.map((key) =>
              expect.objectContaining({
                colId: makeCanonicalSortKey(COLUMN_TYPES.PARAMS, key),
                field: `${EXPERIMENT_FIELD_PREFIX_PARAM}-${key}`,
              }),
            ),
          ),
        }),
        expect.objectContaining({
          children: expect.arrayContaining(
            MOCK_TAGS.map((key) =>
              expect.objectContaining({
                colId: makeCanonicalSortKey(COLUMN_TYPES.TAGS, key),
                field: `${EXPERIMENT_FIELD_PREFIX_TAG}-${key}`,
              }),
            ),
          ),
        }),
      ]),
    );

    // We're not comparing experiments so experiment name should be hidden
    expect(columnDefinitions).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.EXPERIMENT_NAME,
        }),
      ]),
    );
  });

  test('it displays experiment name column when necessary', () => {
    const columnDefinitions = getHookResult({ ...MOCK_HOOK_PARAMS, compareExperiments: true });

    // When comparing experiments, we should display experiment name column as well
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          headerName: ATTRIBUTE_COLUMN_LABELS.EXPERIMENT_NAME,
        }),
      ]),
    );
  });

  test('it hides and shows certain metrics and param columns', () => {
    const hookParams = MOCK_HOOK_PARAMS;
    const Component = (props: { hookParams: UseRunsColumnDefinitionsParams }) => {
      useRunsColumnDefinitions(props.hookParams);
      return null;
    };
    // Initialize and mount the component with initial set of params
    const wrapper = mount(<Component hookParams={hookParams} />);

    // Next, select some columns by changing the props of the component
    hookParams.selectedColumns = ['metrics.`metric_1`', 'params.`param_2`'];
    wrapper.setProps({
      hookParams,
    });

    const setColumnVisibleMock = MOCK_HOOK_PARAMS.columnApi?.setColumnVisible;

    // Assert that setColumnVisible() has been called with "true" for metric_1 and param_2...
    expect(setColumnVisibleMock).toHaveBeenCalledWith(makeCanonicalSortKey(COLUMN_TYPES.METRICS, 'metric_1'), true);
    expect(setColumnVisibleMock).toHaveBeenCalledWith(makeCanonicalSortKey(COLUMN_TYPES.PARAMS, 'param_2'), true);

    // ...but has not for the remaining columns
    expect(setColumnVisibleMock).not.toHaveBeenCalledWith(makeCanonicalSortKey(COLUMN_TYPES.METRICS, 'metric_2'), true);
    expect(setColumnVisibleMock).not.toHaveBeenCalledWith(makeCanonicalSortKey(COLUMN_TYPES.PARAMS, 'param_1'), true);
  });

  test('it includes all columns', () => {
    const selectedColumns = [
      makeCanonicalSortKey(COLUMN_TYPES.METRICS, 'metric_1'),
      makeCanonicalSortKey(COLUMN_TYPES.PARAMS, 'param_2'),
      makeCanonicalSortKey(COLUMN_TYPES.TAGS, 'tag_1'),
    ];

    // Get column definitions
    const columnDefinitions = getHookResult({
      ...MOCK_HOOK_PARAMS,
      selectedColumns,
      isComparingRuns: false,
    }) as unknown as ColGroupDef[];

    // Find the metrics column group - should include all metrics
    const metricsGroup = columnDefinitions.find((col) => col.groupId === COLUMN_TYPES.METRICS) as ColGroupDef;
    expect(metricsGroup).toBeDefined();
    expect(metricsGroup.children?.length).toBe(2); // All metrics

    // Find the params column group - should include all params
    const paramsGroup = columnDefinitions.find((col) => col.groupId === COLUMN_TYPES.PARAMS) as ColGroupDef;
    expect(paramsGroup).toBeDefined();
    expect(paramsGroup.children?.length).toBe(2); // All params

    // Find the tags column group - should include all tags
    const tagsGroup = columnDefinitions.find((col) => (col as any).colId === COLUMN_TYPES.TAGS) as ColGroupDef;
    expect(tagsGroup).toBeDefined();
    expect(tagsGroup.children?.length).toBe(2); // All tags
  });

  test('it includes all columns when comparing runs regardless of selection', () => {
    // Set up selected columns but enable comparing runs
    const selectedColumns = [makeCanonicalSortKey(COLUMN_TYPES.METRICS, 'metric_1')];

    const columnDefinitions = getHookResult({
      ...MOCK_HOOK_PARAMS,
      selectedColumns,
      isComparingRuns: true,
    }) as unknown as any[];

    // When comparing runs, we should only have 2 columns (checkbox and run name)
    expect(columnDefinitions?.length).toBe(2);
  });

  test('remembers metric/param/tag keys even if they are not in the newly fetched set', () => {
    // Let's start with initializing the component with only one known metric key: "metric_1"
    const hookParams: UseRunsColumnDefinitionsParams = {
      ...MOCK_HOOK_PARAMS,
      metricKeyList: ['metric_1'],
    };
    let result: ColGroupDef[] = [];
    const Component = (props: { hookParams: UseRunsColumnDefinitionsParams }) => {
      result = useRunsColumnDefinitions(props.hookParams) as ColGroupDef[];
      return null;
    };
    const wrapper = mount(<Component hookParams={hookParams} />);

    // Assert single metric column in the result set
    expect(result.find((r) => r.groupId === COLUMN_TYPES.METRICS)?.children?.map(({ colId }: ColDef) => colId)).toEqual(
      ['metrics.`metric_1`'],
    );

    // Next, add a new set of two metrics
    wrapper.setProps({
      hookParams: { ...hookParams, metricKeyList: ['metric_1', 'metric_2'] },
    });

    // Assert two metric columns in the result set
    expect(result.find((r) => r.groupId === COLUMN_TYPES.METRICS)?.children?.map(({ colId }: ColDef) => colId)).toEqual(
      ['metrics.`metric_1`', 'metrics.`metric_2`'],
    );

    // Finally, retract the first metric and leave "metric_2" only
    wrapper.setProps({
      hookParams: { ...hookParams, metricKeyList: ['metric_2'] },
    });

    // We expect previous metric column to still exist - this ensures that columns won't
    // disappear on the new dataset without certain metric/param/tag keys
    expect(result.find((r) => r.groupId === COLUMN_TYPES.METRICS)?.children?.map(({ colId }: ColDef) => colId)).toEqual(
      ['metrics.`metric_1`', 'metrics.`metric_2`'],
    );
  });
});
```

--------------------------------------------------------------------------------

````

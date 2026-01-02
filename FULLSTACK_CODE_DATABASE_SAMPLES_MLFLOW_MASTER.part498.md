---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 498
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 498 of 991)

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

---[FILE: experimentPage.column-utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.column-utils.tsx
Signals: React

```typescript
import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ColumnApi,
  IsFullWidthRowParams,
  SuppressKeyboardEventParams,
} from '@ag-grid-community/core';
import type { SpinnerProps } from '@databricks/design-system';
import { Spinner, useDesignSystemTheme } from '@databricks/design-system';
import type React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import Utils from '../../../../common/utils/Utils';
import { ATTRIBUTE_COLUMN_LABELS, ATTRIBUTE_COLUMN_SORT_KEY, COLUMN_TYPES } from '../../../constants';
import { ColumnHeaderCell } from '../components/runs/cells/ColumnHeaderCell';
import { DateCellRenderer } from '../components/runs/cells/DateCellRenderer';
import { RunDescriptionCellRenderer } from '../components/runs/cells/RunDescriptionCellRenderer';
import { ExperimentNameCellRenderer } from '../components/runs/cells/ExperimentNameCellRenderer';
import { ModelsCellRenderer } from '../components/runs/cells/ModelsCellRenderer';
import { ModelsHeaderCellRenderer } from '../components/runs/cells/ModelsHeaderCellRenderer';
import { SourceCellRenderer } from '../components/runs/cells/SourceCellRenderer';
import { VersionCellRenderer } from '../components/runs/cells/VersionCellRenderer';
import {
  EXPERIMENT_FIELD_PREFIX_METRIC,
  EXPERIMENT_FIELD_PREFIX_PARAM,
  EXPERIMENT_FIELD_PREFIX_TAG,
  getQualifiedEntityName,
  makeCanonicalSortKey,
} from './experimentPage.common-utils';
import type { RunRowType } from './experimentPage.row-types';
import {
  RowActionsCellRenderer,
  RowActionsCellRendererSuppressKeyboardEvents,
} from '../components/runs/cells/RowActionsCellRenderer';
import { RowActionsHeaderCellRenderer } from '../components/runs/cells/RowActionsHeaderCellRenderer';
import { RunNameCellRenderer } from '../components/runs/cells/RunNameCellRenderer';
import { LoadMoreRowRenderer } from '../components/runs/cells/LoadMoreRowRenderer';
import {
  DatasetsCellRenderer,
  DatasetsCellRendererSuppressKeyboardEvents,
} from '../components/runs/cells/DatasetsCellRenderer';
import type { RunDatasetWithTags } from '../../../types';
import { AggregateMetricValueCell } from '../components/runs/cells/AggregateMetricValueCell';
import { type RUNS_VISIBILITY_MODE } from '../models/ExperimentPageUIState';
import { useMediaQuery } from '@databricks/web-shared/hooks';
import { customMetricBehaviorDefs } from './customMetricBehaviorUtils';

const cellClassIsOrderedBy = ({ colDef, context }: CellClassParams) => {
  return context.orderByKey === colDef.headerComponentParams?.canonicalSortKey;
};

/**
 * Width for "run name" column.
 */
const RUN_NAME_COLUMN_WIDTH = 190;

/**
 * Width for "run actions" column.
 */
const BASE_RUN_ACTIONS_COLUMN_WIDTH = 105;
const VISIBILITY_TOGGLE_WIDTH = 32;

/**
 * Calculates width for "actions" column. "compactMode" should be set to true
 * for compare runs mode when checkboxes are hidden.
 */
const getActionsColumnWidth = (isComparingRuns?: boolean) => {
  return isComparingRuns ? BASE_RUN_ACTIONS_COLUMN_WIDTH : BASE_RUN_ACTIONS_COLUMN_WIDTH - VISIBILITY_TOGGLE_WIDTH;
};

/*
 * Functions used to generate grid field names for params, metrics and prefixes
 */
export const createParamFieldName = (key: string) => `${EXPERIMENT_FIELD_PREFIX_PARAM}-${key}`;
const createMetricFieldName = (key: string) => `${EXPERIMENT_FIELD_PREFIX_METRIC}-${key}`;
const createTagFieldName = (key: string) => `${EXPERIMENT_FIELD_PREFIX_TAG}-${key}`;

const UntrackedSpinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ loading, ...props }) => {
  return Spinner({ loading: false, ...props });
};

/**
 * A default listener that suppresses default agGrid keyboard events on the row actions cell renderer.
 * If the focus is on a cell, the tab key should be allowed to navigate to the next focusable element instead of a next cell.
 */
const defaultKeyboardNavigationSuppressor = ({ event }: SuppressKeyboardEventParams) =>
  event.key === 'Tab' && event.target instanceof HTMLElement && event.target.classList.contains('ag-cell');

/**
 * Functions returns all framework components to be used by agGrid
 */
export const getFrameworkComponents = () => ({
  agColumnHeader: ColumnHeaderCell,

  // A workaround for https://github.com/ag-grid/ag-grid/issues/7028.
  // The page will add an interaction hold directly instead of relying on DuBois' Spinner
  // to do it.
  loadingOverlayComponent: UntrackedSpinner,

  /**
   * We're saving cell renderer component references, otherwise
   * agGrid will unnecessarily flash cells' content (e.g. when changing sort order)
   */
  LoadMoreRowRenderer,
  SourceCellRenderer,
  ModelsCellRenderer,
  ModelsHeaderCellRenderer,
  VersionCellRenderer,
  DateCellRenderer,
  ExperimentNameCellRenderer,
  RunDescriptionCellRenderer,
  RowActionsCellRenderer,
  RowActionsHeaderCellRenderer,
  RunNameCellRenderer,
  DatasetsCellRenderer,
  AggregateMetricValueCell,
});

/**
 * Certain columns are described as run attributes (opposed to metrics, params etc.), however
 * they actually source their data from the run tags. This objects maps tag names to column identifiers.
 */
const TAGS_TO_COLUMNS_MAP = {
  [ATTRIBUTE_COLUMN_SORT_KEY.USER]: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, 'User'),
  [ATTRIBUTE_COLUMN_SORT_KEY.RUN_NAME]: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, 'Run Name'),
  [ATTRIBUTE_COLUMN_SORT_KEY.SOURCE]: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, 'Source'),
  [ATTRIBUTE_COLUMN_SORT_KEY.VERSION]: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, 'Version'),
  [ATTRIBUTE_COLUMN_SORT_KEY.DESCRIPTION]: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, 'Description'),
};

/**
 * Function returns unique row ID to be used in runs table
 */
export const getRowId = ({ data }: { data: RunRowType }) => data.rowUuid;

/**
 * Determines if a data row houses "load more" button
 */
export const getRowIsLoadMore = ({ rowNode }: IsFullWidthRowParams) => rowNode.data.isLoadMoreRow;

/**
 * Parameters used by `useRunsColumnDefinitions()` hook
 */
export interface UseRunsColumnDefinitionsParams {
  selectedColumns: string[];
  onExpand: (parentUuid: string, childrenIds: string[]) => void;
  onTogglePin: (runUuid: string) => void;
  onToggleVisibility:
    | ((runUuidOrToggle: string) => void)
    | ((mode: RUNS_VISIBILITY_MODE, runOrGroupUuid: string) => void);
  compareExperiments: boolean;
  metricKeyList: string[];
  paramKeyList: string[];
  tagKeyList: string[];
  columnApi?: ColumnApi;
  isComparingRuns?: boolean;
  onDatasetSelected?: (dataset: RunDatasetWithTags, run: RunRowType) => void;
  expandRows?: boolean;
  allRunsHidden?: boolean;
  usingCustomVisibility?: boolean;
  runsHiddenMode?: RUNS_VISIBILITY_MODE;
}

/**
 * List of all attribute columns that can be shown/hidden by user
 * - when displaying a single experiment (ADJUSTABLE_ATTRIBUTE_COLUMNS_SINGLE_EXPERIMENT)
 * - when comparing experiments (ADJUSTABLE_ATTRIBUTE_COLUMNS)
 */

export const getAdjustableAttributeColumns = (isComparingExperiments = false) => {
  const result = [
    ATTRIBUTE_COLUMN_LABELS.USER,
    ATTRIBUTE_COLUMN_LABELS.SOURCE,
    ATTRIBUTE_COLUMN_LABELS.VERSION,
    ATTRIBUTE_COLUMN_LABELS.MODELS,
    ATTRIBUTE_COLUMN_LABELS.DATASET,
    ATTRIBUTE_COLUMN_LABELS.DESCRIPTION,
  ];

  if (isComparingExperiments) {
    result.push(ATTRIBUTE_COLUMN_LABELS.EXPERIMENT_NAME);
  }
  return result;
};

/**
 * This internal hook passes through the list of all metric/param/tag keys.
 * The lists are memoized internally so if somehow a particular param/metric/tag key is not present
 * in the new runs set (e.g. due to reverse sorting), the relevant column will be still displayed.
 * This prevents weirdly disappearing columns on exotic run sets.
 */
const useCumulativeColumnKeys = ({
  paramKeyList,
  metricKeyList,
  tagKeyList,
}: Pick<UseRunsColumnDefinitionsParams, 'tagKeyList' | 'metricKeyList' | 'paramKeyList'>) => {
  const cachedMetricKeys = useRef<Set<string>>(new Set());
  const cachedParamKeys = useRef<Set<string>>(new Set());
  const cachedTagKeys = useRef<Set<string>>(new Set());

  const paramKeys = useMemo(() => {
    paramKeyList.forEach((key) => cachedParamKeys.current.add(key));
    return Array.from(cachedParamKeys.current);
  }, [paramKeyList]);

  const metricKeys = useMemo(() => {
    metricKeyList.forEach((key) => cachedMetricKeys.current.add(key));
    return Array.from(cachedMetricKeys.current);
  }, [metricKeyList]);

  const tagKeys = useMemo(() => {
    tagKeyList.forEach((key) => cachedTagKeys.current.add(key));
    return Array.from(cachedTagKeys.current);
  }, [tagKeyList]);

  const cumulativeColumns = useMemo(
    () => ({
      paramKeys,
      metricKeys,
      tagKeys,
    }),
    [metricKeys, paramKeys, tagKeys],
  );

  return cumulativeColumns;
};

/**
 * This hook creates a agGrid-compatible column set definition basing on currently
 * used sort-filter model and provided list of metrics, params and tags.
 *
 * Internally, it reacts to changes to `selectedColumns` and hides/shows relevant columns
 * if necessary.
 *
 * @param params see UseRunsColumnDefinitionsParams
 */
export const useRunsColumnDefinitions = ({
  selectedColumns,
  compareExperiments,
  onTogglePin,
  onToggleVisibility,
  onExpand,
  paramKeyList,
  metricKeyList,
  tagKeyList,
  columnApi,
  onDatasetSelected,
  isComparingRuns,
  expandRows,
  runsHiddenMode,
}: UseRunsColumnDefinitionsParams) => {
  const { theme } = useDesignSystemTheme();

  const cumulativeColumns = useCumulativeColumnKeys({
    metricKeyList,
    tagKeyList,
    paramKeyList,
  });

  // Generate columns differently on super small viewport sizes
  const usingCompactViewport = useMediaQuery(`(max-width: ${theme.responsive.breakpoints.sm}px)`);

  const columnSet = useMemo(() => {
    const columns: (ColDef | ColGroupDef)[] = [];

    // Checkbox selection column
    columns.push({
      valueGetter: ({ data: { pinned, hidden } }) => ({ pinned, hidden }),
      checkboxSelection: true,
      headerComponent: 'RowActionsHeaderCellRenderer',
      headerComponentParams: { onToggleVisibility },
      headerCheckboxSelection: true,
      headerName: '',
      cellClass: 'is-checkbox-cell',
      cellRenderer: 'RowActionsCellRenderer',
      cellRendererParams: { onTogglePin, onToggleVisibility },
      pinned: usingCompactViewport ? undefined : 'left',
      minWidth: getActionsColumnWidth(isComparingRuns),
      width: getActionsColumnWidth(isComparingRuns),
      maxWidth: getActionsColumnWidth(isComparingRuns),
      resizable: false,
      suppressKeyboardEvent: RowActionsCellRendererSuppressKeyboardEvents,
    });

    const isRunColumnDynamicSized = isComparingRuns;

    // Run name column
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.RUN_NAME,
      colId: isRunColumnDynamicSized ? undefined : TAGS_TO_COLUMNS_MAP[ATTRIBUTE_COLUMN_SORT_KEY.RUN_NAME],
      headerTooltip: ATTRIBUTE_COLUMN_SORT_KEY.RUN_NAME,
      pinned: usingCompactViewport ? undefined : 'left',
      sortable: true,
      cellRenderer: 'RunNameCellRenderer',
      cellRendererParams: { onExpand, isComparingRuns },
      equals: (runA: RunRowType, runB: RunRowType) =>
        runA?.rowUuid === runB?.rowUuid && runA?.groupParentInfo?.expanderOpen === runB?.groupParentInfo?.expanderOpen,
      headerComponentParams: {
        canonicalSortKey: ATTRIBUTE_COLUMN_SORT_KEY.RUN_NAME,
      },
      cellClassRules: {
        'is-ordered-by': cellClassIsOrderedBy,
      },
      initialWidth: isRunColumnDynamicSized ? undefined : RUN_NAME_COLUMN_WIDTH,
      flex: isRunColumnDynamicSized ? 1 : undefined,
      resizable: !isComparingRuns,
      suppressKeyboardEvent: defaultKeyboardNavigationSuppressor,
    });

    // If we are only comparing runs, that's it - we cut off the list after the run name column.
    // This behavior might be revisited and changed later.
    if (isComparingRuns) {
      return columns;
    }

    // Date and expander selection column
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.DATE,
      headerTooltip: ATTRIBUTE_COLUMN_SORT_KEY.DATE,
      pinned: usingCompactViewport ? undefined : 'left',
      sortable: true,
      field: 'runDateAndNestInfo',
      cellRenderer: 'DateCellRenderer',
      cellRendererParams: { onExpand },
      equals: (dateInfo1, dateInfo2) => isEqual(dateInfo1, dateInfo2),
      headerComponentParams: {
        canonicalSortKey: ATTRIBUTE_COLUMN_SORT_KEY.DATE,
      },
      cellClassRules: {
        'is-ordered-by': cellClassIsOrderedBy,
      },
      initialWidth: 150,
    });

    // Datasets column - guarded by a feature flag
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.DATASET,
      colId: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, ATTRIBUTE_COLUMN_LABELS.DATASET),
      headerTooltip: ATTRIBUTE_COLUMN_LABELS.DATASET,
      sortable: false,
      field: 'datasets',
      cellRenderer: 'DatasetsCellRenderer',
      cellRendererParams: { onDatasetSelected, expandRows },
      cellClass: 'is-multiline-cell',
      initialWidth: 300,
      suppressKeyboardEvent: DatasetsCellRendererSuppressKeyboardEvents,
    });

    // Duration column
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.DURATION,
      field: 'duration',
      initialWidth: 80,
    });

    // Experiment name column
    if (compareExperiments) {
      columns.push({
        headerName: ATTRIBUTE_COLUMN_LABELS.EXPERIMENT_NAME,
        colId: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, ATTRIBUTE_COLUMN_LABELS.EXPERIMENT_NAME),
        field: 'experimentName',
        cellRenderer: 'ExperimentNameCellRenderer',
        equals: (experimentName1, experimentName2) => isEqual(experimentName1, experimentName2),
        initialWidth: 140,
        initialHide: true,
        suppressKeyboardEvent: defaultKeyboardNavigationSuppressor,
      });
    }

    // User column
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.USER,
      colId: TAGS_TO_COLUMNS_MAP[ATTRIBUTE_COLUMN_SORT_KEY.USER],
      headerTooltip: ATTRIBUTE_COLUMN_SORT_KEY.USER,
      field: 'user',
      sortable: true,
      headerComponentParams: {
        canonicalSortKey: ATTRIBUTE_COLUMN_SORT_KEY.USER,
      },
      cellClassRules: {
        'is-ordered-by': cellClassIsOrderedBy,
      },
      initialHide: true,
    });

    // Source column
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.SOURCE,
      colId: TAGS_TO_COLUMNS_MAP[ATTRIBUTE_COLUMN_SORT_KEY.SOURCE],
      field: 'tags',
      cellRenderer: 'SourceCellRenderer',
      equals: (tags1 = {}, tags2 = {}) => Utils.getSourceName(tags1) === Utils.getSourceName(tags2),
      sortable: true,
      headerComponentParams: {
        canonicalSortKey: ATTRIBUTE_COLUMN_SORT_KEY.SOURCE,
      },
      cellClassRules: {
        'is-ordered-by': cellClassIsOrderedBy,
      },
      initialHide: true,
      suppressKeyboardEvent: defaultKeyboardNavigationSuppressor,
    });

    // Version column
    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.VERSION,
      colId: TAGS_TO_COLUMNS_MAP[ATTRIBUTE_COLUMN_SORT_KEY.VERSION],
      field: 'version',
      cellRenderer: 'VersionCellRenderer',
      equals: (version1 = {}, version2 = {}) => isEqual(version1, version2),
      sortable: true,
      headerComponentParams: {
        canonicalSortKey: ATTRIBUTE_COLUMN_SORT_KEY.VERSION,
      },
      cellClassRules: {
        'is-ordered-by': cellClassIsOrderedBy,
      },
      initialHide: true,
    });

    // Models column
    columns.push({
      headerComponent: 'ModelsHeaderCellRenderer',
      colId: makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, ATTRIBUTE_COLUMN_LABELS.MODELS),
      field: 'models',
      cellRenderer: 'ModelsCellRenderer',
      initialWidth: 200,
      equals: (models1 = {}, models2 = {}) => isEqual(models1, models2),
      initialHide: true,
      suppressKeyboardEvent: defaultKeyboardNavigationSuppressor,
    });

    columns.push({
      headerName: ATTRIBUTE_COLUMN_LABELS.DESCRIPTION,
      colId: TAGS_TO_COLUMNS_MAP[ATTRIBUTE_COLUMN_SORT_KEY.DESCRIPTION],
      field: 'tags',
      cellRenderer: 'RunDescriptionCellRenderer',
      initialWidth: 300,
      initialHide: true,
      sortable: true,
      headerComponentParams: {
        canonicalSortKey: ATTRIBUTE_COLUMN_SORT_KEY.DESCRIPTION,
      },
      cellClassRules: {
        'is-ordered-by': cellClassIsOrderedBy,
      },
    });

    const { metricKeys, paramKeys, tagKeys } = cumulativeColumns;

    // Metrics columns
    if (metricKeys.length) {
      columns.push({
        headerName: 'Metrics',
        groupId: COLUMN_TYPES.METRICS,
        children: metricKeys.map((metricKey) => {
          const canonicalSortKey = makeCanonicalSortKey(COLUMN_TYPES.METRICS, metricKey);
          const customMetricColumnDef = customMetricBehaviorDefs[metricKey];
          const displayName = customMetricColumnDef?.displayName ?? metricKey;
          const fieldName = createMetricFieldName(metricKey);
          const tooltip = getQualifiedEntityName(COLUMN_TYPES.METRICS, metricKey);
          return {
            headerName: displayName,
            colId: canonicalSortKey,
            headerTooltip: tooltip,
            field: fieldName,
            tooltipValueGetter: (params) => {
              return params.data?.[fieldName];
            },
            initialWidth: customMetricColumnDef?.initialColumnWidth ?? 100,
            initialHide: true,
            sortable: true,
            headerComponentParams: {
              canonicalSortKey,
            },
            valueFormatter: customMetricColumnDef?.valueFormatter,
            cellRendererSelector: ({ data: { groupParentInfo } }) =>
              groupParentInfo ? { component: 'AggregateMetricValueCell' } : undefined,
            cellClassRules: {
              'is-previewable-cell': () => true,
              'is-ordered-by': cellClassIsOrderedBy,
            },
          };
        }),
      });
    }

    // Parameter columns
    if (paramKeys.length) {
      columns.push({
        headerName: 'Parameters',
        groupId: COLUMN_TYPES.PARAMS,
        children: paramKeys.map((paramKey) => {
          const canonicalSortKey = makeCanonicalSortKey(COLUMN_TYPES.PARAMS, paramKey);
          return {
            colId: canonicalSortKey,
            headerName: paramKey,
            headerTooltip: getQualifiedEntityName(COLUMN_TYPES.PARAMS, paramKey),
            field: createParamFieldName(paramKey),
            tooltipField: createParamFieldName(paramKey),
            initialHide: true,
            initialWidth: 100,
            sortable: true,
            headerComponentParams: {
              canonicalSortKey,
            },
            cellClassRules: {
              'is-previewable-cell': () => true,
              'is-ordered-by': cellClassIsOrderedBy,
            },
          };
        }),
      });
    }

    // Tags columns
    if (tagKeys.length) {
      columns.push({
        headerName: 'Tags',
        colId: COLUMN_TYPES.TAGS,
        children: tagKeys.map((tagKey) => {
          const canonicalSortKey = makeCanonicalSortKey(COLUMN_TYPES.TAGS, tagKey);
          return {
            colId: canonicalSortKey,
            headerName: tagKey,
            initialHide: true,
            initialWidth: 100,
            headerTooltip: getQualifiedEntityName(COLUMN_TYPES.TAGS, tagKey),
            field: createTagFieldName(tagKey),
            tooltipField: createTagFieldName(tagKey),
          };
        }),
      });
    }

    return columns;
  }, [
    onTogglePin,
    onToggleVisibility,
    onExpand,
    compareExperiments,
    cumulativeColumns,
    isComparingRuns,
    onDatasetSelected,
    expandRows,
    usingCompactViewport,
  ]);

  const canonicalSortKeys = useMemo(
    () => [
      ...getAdjustableAttributeColumns(true).map((key) => makeCanonicalSortKey(COLUMN_TYPES.ATTRIBUTES, key)),
      ...cumulativeColumns.paramKeys.map((key) => makeCanonicalSortKey(COLUMN_TYPES.PARAMS, key)),
      ...cumulativeColumns.metricKeys.map((key) => makeCanonicalSortKey(COLUMN_TYPES.METRICS, key)),
      ...cumulativeColumns.tagKeys.map((key) => makeCanonicalSortKey(COLUMN_TYPES.TAGS, key)),
    ],
    [cumulativeColumns],
  );

  useEffect(() => {
    if (!columnApi || isComparingRuns) {
      return;
    }
    for (const canonicalKey of canonicalSortKeys) {
      const visible = selectedColumns.includes(canonicalKey);
      columnApi.setColumnVisible(canonicalKey, visible);
    }
  }, [selectedColumns, columnApi, canonicalSortKeys, isComparingRuns]);

  return columnSet;
};

export const EXPERIMENTS_DEFAULT_COLUMN_SETUP = {
  initialWidth: 100,
  autoSizePadding: 0,
  headerComponentParams: { menuIcon: 'fa-bars' },
  resizable: true,
  filter: true,
  suppressMenu: true,
  suppressMovable: true,
};
```

--------------------------------------------------------------------------------

---[FILE: experimentPage.common-row-utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.common-row-utils.test.ts

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { fromPairs } from 'lodash';
import { shouldUseRunRowsVisibilityMap } from '../../../../common/utils/FeatureUtils';
import { RUNS_VISIBILITY_MODE } from '../models/ExperimentPageUIState';
import { determineIfRowIsHidden } from './experimentPage.common-row-utils';

jest.mock('../../../../common/utils/FeatureUtils', () => ({
  shouldUseRunRowsVisibilityMap: jest.fn(),
}));

describe('determineIfRowIsHidden when using legacy runsHidden UI state', () => {
  beforeEach(() => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(false);
  });
  it.each([
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, rowIndex: 5, expected: false },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, rowIndex: 5, expected: false },
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, rowIndex: 15, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, rowIndex: 15, expected: false },
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, rowIndex: 25, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, rowIndex: 25, expected: true },
    { mode: RUNS_VISIBILITY_MODE.HIDEALL, rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.CUSTOM, rowIndex: 5, expected: true },
  ])(
    'should return $expected if runs visibility mode is $mode and runsHidden includes runUuid having index $rowIndex',
    ({ expected, mode, rowIndex }) => {
      const runsHidden = ['run1', 'run2'];
      const runUuid = 'run1';
      const result = determineIfRowIsHidden(mode, runsHidden, runUuid, rowIndex, {}, 'RUNNING');

      expect(result).toBe(expected);
    },
  );

  it('hides finished runs when mode is HIDE_FINISHED_RUNS', () => {
    const runsHidden: string[] = [];
    const runUuid = 'run1';
    expect(
      determineIfRowIsHidden(RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS, runsHidden, runUuid, 5, {}, 'FINISHED'),
    ).toBe(true);
    expect(determineIfRowIsHidden(RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS, runsHidden, runUuid, 5, {}, 'RUNNING')).toBe(
      false,
    );
  });

  it.each([
    { mode: RUNS_VISIBILITY_MODE.HIDEALL, rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.CUSTOM, rowIndex: 5, expected: false },
  ])(
    'should return $expected if runs visibility mode is $mode and runsHidden does not include runUuid having index $rowIndex',
    ({ expected, mode, rowIndex }) => {
      const runsHidden = ['run1', 'run2'];
      const runUuid = 'run3';
      const result = determineIfRowIsHidden(mode, runsHidden, runUuid, rowIndex, {}, 'RUNNING');

      expect(result).toBe(expected);
    },
  );
});

describe('determineIfRowIsHidden when using runsVisibilityMap UI state', () => {
  // Setup:
  // - runs "run1" and "run2" are hidden in the visibility map
  // - code should use runs visibility map instead of "runsHidden" field
  // - we're testing visibility of "run1" and "run3" at various row indexes

  const runsVisibilityMap = { run1: false, run2: false };

  beforeEach(() => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(true);
  });
  it.each([
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, runUuid: 'run1', rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, runUuid: 'run3', rowIndex: 5, expected: false },
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, runUuid: 'run3', rowIndex: 15, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, runUuid: 'run1', rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, runUuid: 'run3', rowIndex: 5, expected: false },
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, runUuid: 'run1', rowIndex: 15, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, runUuid: 'run1', rowIndex: 15, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS, runUuid: 'run1', rowIndex: 25, expected: true },
    { mode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS, runUuid: 'run1', rowIndex: 25, expected: true },
    { mode: RUNS_VISIBILITY_MODE.HIDEALL, runUuid: 'run1', rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.HIDEALL, runUuid: 'run3', rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.SHOWALL, runUuid: 'run1', rowIndex: 5, expected: true },
    { mode: RUNS_VISIBILITY_MODE.SHOWALL, runUuid: 'run3', rowIndex: 5, expected: false },
  ])(
    'should return $expected if runs visibility mode is $mode and runsHidden includes runUuid having index $rowIndex',
    ({ expected, runUuid, mode, rowIndex }) => {
      const result = determineIfRowIsHidden(mode, [], runUuid, rowIndex, runsVisibilityMap, 'RUNNING');

      expect(result).toBe(expected);
    },
  );

  it('hides finished runs when mode is HIDE_FINISHED_RUNS using visibility map', () => {
    const runUuid = 'run3';
    expect(
      determineIfRowIsHidden(RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS, [], runUuid, 5, runsVisibilityMap, 'FINISHED'),
    ).toBe(true);
    expect(
      determineIfRowIsHidden(RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS, [], runUuid, 5, runsVisibilityMap, 'FAILED'),
    ).toBe(true);
    expect(
      determineIfRowIsHidden(RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS, [], runUuid, 5, runsVisibilityMap, 'RUNNING'),
    ).toBe(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: experimentPage.common-row-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.common-row-utils.ts

```typescript
import { isUndefined } from 'lodash';
import { shouldUseRunRowsVisibilityMap } from '../../../../common/utils/FeatureUtils';
import { RUNS_VISIBILITY_MODE } from '../models/ExperimentPageUIState';

// Utility function that determines if a particular table run should be hidden,
// based on the selected mode, position on the list and current state of manually hidden runs array.
export const determineIfRowIsHidden = (
  runsHiddenMode: RUNS_VISIBILITY_MODE,
  /**
   * @deprecated Use "runsVisibilityMap" field instead which has better control over visibility
   */
  runsHidden: string[],
  runUuid: string,
  rowIndex: number,
  runsVisibilityMap: Record<string, boolean>,
  runStatus?: string,
) => {
  // If using rows visibility map, we should always use it to determine visibility
  if (shouldUseRunRowsVisibilityMap()) {
    if (!isUndefined(runsVisibilityMap[runUuid])) {
      return !runsVisibilityMap[runUuid];
    }
  } else if (runsHiddenMode === RUNS_VISIBILITY_MODE.CUSTOM) {
    /**
     * TODO: clean up runsHidden after ramping up runsVisibilityMap
     */
    return runsHidden.includes(runUuid);
  }
  if (runsHiddenMode === RUNS_VISIBILITY_MODE.HIDEALL) {
    return true;
  }
  if (runsHiddenMode === RUNS_VISIBILITY_MODE.FIRST_10_RUNS) {
    return rowIndex >= 10;
  }
  if (runsHiddenMode === RUNS_VISIBILITY_MODE.FIRST_20_RUNS) {
    return rowIndex >= 20;
  }
  if (runsHiddenMode === RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS) {
    return ['FINISHED', 'FAILED', 'KILLED'].includes(runStatus ?? '');
  }
  return false;
};
```

--------------------------------------------------------------------------------

---[FILE: experimentPage.common-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.common-utils.ts

```typescript
import type { IntlShape } from 'react-intl';
import { saveAs } from 'file-saver';
import type { ExperimentEntity } from '../../../types';
import type { ExperimentRunsSelectorResult } from './experimentRuns.selector';
import { chartDataToCsv, chartMetricHistoryToCsv, runInfosToCsv } from '../../../utils/CsvUtils';
import type { RunsChartsRunData } from '../../runs-charts/components/RunsCharts.common';

export const EXPERIMENT_FIELD_PREFIX_PARAM = '$$$param$$$';
export const EXPERIMENT_FIELD_PREFIX_METRIC = '$$$metric$$$';
export const EXPERIMENT_FIELD_PREFIX_TAG = '$$$tag$$$';
export const EXPERIMENT_PARENT_ID_TAG = 'mlflow.parentRunId';
export const EXPERIMENT_LOG_MODEL_HISTORY_TAG = 'mlflow.log-model.history';
export const EXPERIMENT_RUNS_TABLE_ROW_HEIGHT = 32;

const MLFLOW_NOTEBOOK_TYPE = 'NOTEBOOK';
const MLFLOW_EXPERIMENT_TYPE = 'MLFLOW_EXPERIMENT';

const EXPERIMENT_TYPE_TAG = 'mlflow.experimentType';
const EXPERIMENT_SOURCE_TYPE_TAG = 'mlflow.experiment.sourceType';
const EXPERIMENT_SOURCE_ID_TAG = 'mlflow.experiment.sourceId';

enum ExperimentSourceType {
  REPO_NOTEBOOK = 'REPO_NOTEBOOK',
}

/**
 * Function that gets the experiment type for a given experiment object
 */
export const getExperimentType = (experiment: ExperimentEntity) => {
  const experimentType = experiment.tags.find((tag) => tag.key === EXPERIMENT_TYPE_TAG);
  if (experimentType) {
    return experimentType.value;
  }
  return null;
};

const hasExperimentType = (experiment: ExperimentEntity, type: string) => getExperimentType(experiment) === type;

/**
 * Function returns true if the experiment is of default ("MLFLOW_EXPERIMENT") type
 */
export const isExperimentTypeDefault = (experiment: ExperimentEntity) =>
  hasExperimentType(experiment, MLFLOW_EXPERIMENT_TYPE);

/**
 * Function returns true if the experiment is of notebook type
 */
export const isExperimentTypeNotebook = (experiment: ExperimentEntity) =>
  hasExperimentType(experiment, MLFLOW_NOTEBOOK_TYPE);

/**
 * Function that checks if experiment's allowed actions include
 * modification. TODO: fix typo in the const name.
 */
export const canModifyExperiment = (experiment: ExperimentEntity) =>
  (experiment.allowedActions || []).includes('MODIFIY_PERMISSION');

/**
 * Function that gets the experiment source ID for a given experiment object
 */
export const getExperimentSourceId = (experiment: ExperimentEntity) =>
  experiment.tags?.find((tag) => tag.key === EXPERIMENT_SOURCE_ID_TAG)?.value;

/**
 * Function that checks if experiment comes from repository notebook
 */
export const isRepoNotebookExperiment = (experiment: ExperimentEntity) =>
  experiment.tags?.find((tag) => tag.key === EXPERIMENT_SOURCE_TYPE_TAG)?.value === ExperimentSourceType.REPO_NOTEBOOK;

/**
 * Function used for downloading run data in CSV form.
 */
export const downloadRunsCsv = (
  runsData: ExperimentRunsSelectorResult,
  filteredTagKeys: string[],
  filteredParamKeys: string[],
  filteredMetricKeys: string[],
) => {
  const { runInfos, paramsList, metricsList, tagsList } = runsData;

  const csv = runInfosToCsv({
    runInfos,
    paramKeyList: filteredParamKeys,
    metricKeyList: filteredMetricKeys,
    tagKeyList: filteredTagKeys,
    paramsList,
    metricsList,
    tagsList,
  });
  const blob = new Blob([csv], { type: 'application/csv;charset=utf-8' });
  saveAs(blob, 'runs.csv');
};

/**
 * Function used for downloading metric history chart data in CSV form.
 */
export const downloadChartMetricHistoryCsv = (traces: RunsChartsRunData[], metricKeys: string[], title: string) => {
  const csv = chartMetricHistoryToCsv(traces, metricKeys);
  const blob = new Blob([csv], { type: 'application/csv;charset=utf-8' });
  saveAs(blob, `${title}.csv`);
};

/**
 * Function used for downloading latest chart data in CSV form.
 */
export const downloadChartDataCsv = (
  traces: RunsChartsRunData[],
  metricKeys: string[],
  paramKeys: string[],
  title: string,
) => {
  const csv = chartDataToCsv(traces, metricKeys, paramKeys);
  const blob = new Blob([csv], { type: 'application/csv;charset=utf-8' });
  saveAs(blob, `${title}.csv`);
};

/**
 * Function used for preparing values for "created" (start time) runs filter.
 */
export const getStartTimeColumnDisplayName = (intl: IntlShape) => ({
  LAST_HOUR: intl.formatMessage({
    defaultMessage: 'Last hour',
    description: 'Option for the start select dropdown to filter runs from the last hour',
  }),
  LAST_24_HOURS: intl.formatMessage({
    defaultMessage: 'Last 24 hours',
    description: 'Option for the start select dropdown to filter runs from the last 24 hours',
  }),
  LAST_7_DAYS: intl.formatMessage({
    defaultMessage: 'Last 7 days',
    description: 'Option for the start select dropdown to filter runs from the last 7 days',
  }),
  LAST_30_DAYS: intl.formatMessage({
    defaultMessage: 'Last 30 days',
    description: 'Option for the start select dropdown to filter runs from the last 30 days',
  }),
  LAST_YEAR: intl.formatMessage({
    defaultMessage: 'Last year',
    description: 'Option for the start select dropdown to filter runs since the last 1 year',
  }),
});

/**
 * Creates qualified entity name given a key type and name, wrapping in backticks
 * or quotes as needed and where appropriate
 */
export const getQualifiedEntityName = (keyType: string, keyName: string) => {
  let replace = '';
  if (
    keyName.includes('"') ||
    keyName.includes(' ') ||
    keyName.includes('.') ||
    keyName.includes('(') ||
    keyName.includes(')')
  ) {
    replace = '`';
  }
  if (keyName.includes('`')) {
    replace = '"';
  }
  return `${keyType}.${replace}${keyName}${replace}`;
};

/**
 * Creates canonical sort key name for metrics and params
 */
export const makeCanonicalSortKey = (keyType: string, keyName: string) => keyType + '.`' + keyName + '`';

export const isCanonicalSortKeyOfType = (canonicalKey: string, keyType: string) => canonicalKey.startsWith(keyType);

/**
 * Extracts param/metric/tag name from the canonical key
 */
export const extractCanonicalSortKey = (canonicalKey: string, keyType: string) =>
  canonicalKey.substring(keyType.length + 2).slice(0, -1);
```

--------------------------------------------------------------------------------

---[FILE: experimentPage.fetch-utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.fetch-utils.test.ts

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { EXPERIMENT_LOG_MODEL_HISTORY_TAG } from './experimentPage.common-utils';
import { fetchModelVersionsForRuns } from './experimentPage.fetch-utils';

jest.mock('../../../../model-registry/constants', () => ({
  MAX_RUNS_IN_SEARCH_MODEL_VERSIONS_FILTER: 5,
}));

describe('experiment page fetch utils', () => {
  describe('fetchModelVersionsForRuns', () => {
    // Let's generate 20 runs result
    const runsDataPayload = new Array(20).fill(0).map((_, index) => ({
      info: {
        run_id: `run_${index}`,
      },
      data: {
        // Then put log model history in 10 of them
        tags: index % 2 ? [{ key: EXPERIMENT_LOG_MODEL_HISTORY_TAG, value: 'abc' }] : [],
      },
    })) as any;

    test('it correctly constructs action for fetching model versions basing on search runs API result', () => {
      const actionCreatorMock = jest.fn();
      const dispatchMock = jest.fn();
      // @ts-expect-error Argument of type 'Mock<UnknownFunction>' is not assignable to parameter
      fetchModelVersionsForRuns(runsDataPayload, actionCreatorMock, dispatchMock);

      // We're chunking by 5 runs so we expect 2 calls for sum of 10 runs
      expect(actionCreatorMock).toHaveBeenCalledTimes(2);
      expect(actionCreatorMock.mock.calls[0][0]).toEqual({ run_id: ['run_1', 'run_3', 'run_5', 'run_7', 'run_9'] });
      expect(actionCreatorMock.mock.calls[1][0]).toEqual({
        run_id: ['run_11', 'run_13', 'run_15', 'run_17', 'run_19'],
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````

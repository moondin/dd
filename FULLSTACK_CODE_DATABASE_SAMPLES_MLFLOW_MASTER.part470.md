---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 470
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 470 of 991)

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

---[FILE: ExperimentLoggedModelListPageOrderBySelector.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageOrderBySelector.test.tsx
Signals: React

```typescript
import { describe, it, expect } from '@jest/globals';
import { useState } from 'react';
import { useExperimentLoggedModelListPageTableColumns } from './hooks/useExperimentLoggedModelListPageTableColumns';
import { ExperimentLoggedModelListPageOrderBySelector } from './ExperimentLoggedModelListPageOrderBySelector';
import { render, screen, waitFor, within } from '../../../common/utils/TestUtils.react18';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '@databricks/design-system';

const metrics = [
  { dataset_name: 'train', dataset_digest: '123456', key: 'rmse', value: 0.1 },
  { dataset_name: 'train', dataset_digest: '123456', key: 'r2', value: 0.1 },
  { dataset_name: 'test', dataset_digest: '987654', key: 'rmse', value: 0.1 },
  { dataset_name: 'test', dataset_digest: '987654', key: 'r2', value: 0.1 },
  { dataset_name: undefined, dataset_digest: undefined, key: 'accuracy', value: 0.1 },
];

const testLoggedModels = [
  {
    info: { model_id: 'm-1', name: 'model_with_all_metrics' },
    data: { metrics },
  },
  {
    info: { model_id: 'm-2', name: 'model_with_test_metrics' },
    data: { metrics: metrics.filter((m) => m.dataset_name === 'test') },
  },
  {
    info: { model_id: 'm-2', name: 'model_with_train_metrics' },
    data: { metrics: metrics.filter((m) => m.dataset_name === 'train') },
  },
];
describe('ExperimentLoggedModelListPageOrderBySelector', () => {
  const renderTestComponent = () => {
    const TestComponent = () => {
      const [loggedModels, setLoggedModels] = useState(testLoggedModels);
      const [orderByAsc, setOrderByAsc] = useState(true);
      const [orderByColumn, setOrderByColumn] = useState('creation_time');
      const { columnDefs } = useExperimentLoggedModelListPageTableColumns({
        loggedModels,
      });

      return (
        <div>
          <ExperimentLoggedModelListPageOrderBySelector
            orderByColumn={orderByColumn}
            orderByAsc={orderByAsc}
            onChangeOrderBy={(column, asc) => {
              setOrderByAsc(asc);
              setOrderByColumn(column);
            }}
            columnDefs={columnDefs}
          />
          <div>
            Currently sorting by: {orderByColumn} {orderByAsc ? 'ascending' : 'descending'}
          </div>
          <div>
            <button
              onClick={() => {
                setLoggedModels([testLoggedModels[1]]);
              }}
            >
              Load models with test dataset only
            </button>
            <button
              onClick={() => {
                setLoggedModels([]);
              }}
            >
              Clear model list
            </button>
          </div>
        </div>
      );
    };

    return render(<TestComponent />, {
      wrapper: ({ children }) => (
        <DesignSystemProvider>
          <IntlProvider locale="en">{children}</IntlProvider>
        </DesignSystemProvider>
      ),
    });
  };

  it('should render without crashing', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sort/ })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /Sort/ }));

    expect(screen.getByRole('group', { name: 'Metrics (test (#987654))' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Metrics (train (#123456))' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Metrics' })).toBeInTheDocument();

    await userEvent.click(
      within(screen.getByRole('group', { name: 'Metrics (test (#987654))' })).getByRole('menuitemcheckbox', {
        name: 'rmse',
      }),
    );

    await waitFor(() => {
      screen.getByText(
        'Currently sorting by: metrics.{"metricKey":"rmse","datasetName":"test","datasetDigest":"987654"} ascending',
      );
    });

    expect(screen.getByRole('button', { name: 'Sort: rmse' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Sort: rmse' }));

    await userEvent.click(screen.getByRole('button', { name: 'Sort descending' }));

    await waitFor(() => {
      screen.getByText(
        'Currently sorting by: metrics.{"metricKey":"rmse","datasetName":"test","datasetDigest":"987654"} descending',
      );
    });

    // Close the dropdown
    await userEvent.click(screen.getByRole('menu', { name: 'Sort: rmse' }));

    // Click "Clear model list" button
    await userEvent.click(screen.getByText('Clear model list'));

    // Open the dropdown again
    await userEvent.click(screen.getByRole('button', { name: 'Sort: rmse' }));

    // Check if the currently sorted column is still visible
    await waitFor(() => {
      expect(
        within(screen.getByRole('group', { name: 'Currently sorted by' })).getByRole('menuitemcheckbox', {
          name: 'rmse',
        }),
      ).toBeInTheDocument();
    });

    // Close the dropdown
    await userEvent.click(screen.getByRole('menu', { name: 'Sort: rmse' }));

    // Load models with test dataset only
    await userEvent.click(screen.getByText('Load models with test dataset only'));

    // Open the dropdown again
    await userEvent.click(screen.getByRole('button', { name: 'Sort: rmse' }));

    expect(screen.getByRole('group', { name: 'Metrics (test (#987654))' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Metrics (train (#123456))' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Metrics' })).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageOrderBySelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageOrderBySelector.tsx
Signals: React

```typescript
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Button,
  DropdownMenu,
  Input,
  SearchIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useMemo, useState } from 'react';

import type { IntlShape, MessageDescriptor } from 'react-intl';
import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
import { ToggleIconButton } from '../../../common/components/ToggleIconButton';
import {
  ExperimentLoggedModelListPageKnownColumns,
  LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX,
  parseLoggedModelMetricOrderByColumnId,
} from './hooks/useExperimentLoggedModelListPageTableColumns';

interface BasicColumnDef {
  colId?: string;
  groupId?: string;
  headerName?: string;
  children?: BasicColumnDef[];
}

const getSortableColumnLabel = (colId: string | ExperimentLoggedModelListPageKnownColumns, intl: IntlShape) => {
  const labels: Partial<Record<ExperimentLoggedModelListPageKnownColumns | string, MessageDescriptor>> = {
    [ExperimentLoggedModelListPageKnownColumns.CreationTime]: defineMessage({
      defaultMessage: 'Creation time',
      description: 'Label for the creation time column in the logged model list page',
    }),
  };

  const descriptor = labels[colId];

  if (descriptor) {
    return intl.formatMessage(descriptor);
  }

  const parsedColumn = parseLoggedModelMetricOrderByColumnId(colId);

  if (parsedColumn) {
    return parsedColumn.metricKey;
  }

  return colId;
};

export const ExperimentLoggedModelListPageOrderBySelector = ({
  orderByColumn,
  orderByAsc,
  onChangeOrderBy,
  columnDefs = [],
}: {
  orderByColumn: string;
  orderByAsc?: boolean;
  onChangeOrderBy: (orderByColumn: string, orderByAsc: boolean) => void;
  columnDefs: BasicColumnDef[] | undefined;
}) => {
  const intl = useIntl();
  const [filter, setFilter] = useState('');
  const { theme } = useDesignSystemTheme();

  const groupedOrderByOptions = useMemo<BasicColumnDef[]>(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const attributeColumnGroup = {
      groupId: 'attributes',
      headerName: intl.formatMessage({
        defaultMessage: 'Attributes',
        description: 'Label for the attributes column group in the logged model column selector',
      }),
      children: [
        {
          colId: ExperimentLoggedModelListPageKnownColumns.CreationTime,
          headerName: getSortableColumnLabel(ExperimentLoggedModelListPageKnownColumns.CreationTime, intl),
        },
      ].filter(({ headerName }) => headerName?.toLowerCase().includes(lowerCaseFilter)),
    };

    // Next, get all the dataset-grouped metric column groups
    const metricColumnGroups = columnDefs
      .filter((col) => col.groupId?.startsWith(LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX))
      .map((col) => ({
        ...col,
        children: col.children?.filter(({ colId }) => colId?.includes(lowerCaseFilter)),
        headerName: col.headerName
          ? `Metrics (${col.headerName})`
          : intl.formatMessage({
              defaultMessage: 'Metrics',
              description: 'Label for the ungrouped metrics column group in the logged model column selector',
            }),
      }));

    const sortableColumnGroups = [attributeColumnGroup, ...metricColumnGroups].filter(
      (col) => col.children && col.children.length > 0,
    );

    // If the currently used sorting field is not found, this probably means that
    // user has filtered out results containing this column. Let's add it to the list
    // of sortable columns so that user won't be confused.
    if (
      !sortableColumnGroups.some((group) => group.children && group.children.some((col) => col.colId === orderByColumn))
    ) {
      const { metricKey } = parseLoggedModelMetricOrderByColumnId(orderByColumn);

      if (metricKey) {
        sortableColumnGroups.push({
          groupId: 'current',
          headerName: intl.formatMessage({
            defaultMessage: 'Currently sorted by',
            description: 'Label for the custom column group in the logged model column selector',
          }),
          children: [{ colId: orderByColumn, headerName: metricKey }],
        });
      }
    }
    return sortableColumnGroups;
  }, [columnDefs, intl, filter, orderByColumn]);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button
          componentId="mlflow.logged_model.list.order_by"
          icon={orderByAsc ? <SortAscendingIcon /> : <SortDescendingIcon />}
        >
          <FormattedMessage
            defaultMessage="Sort: {sortBy}"
            description="Label for the filter button in the logged model list page. sortBy is the name of the column by which the table is currently sorted."
            values={{ sortBy: getSortableColumnLabel(orderByColumn, intl) }}
          />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content css={{ maxHeight: 300, overflow: 'auto' }}>
        <div
          css={{
            padding: `${theme.spacing.sm}px ${theme.spacing.lg / 2}px ${theme.spacing.sm}px`,
            width: '100%',
            display: 'flex',
            gap: theme.spacing.xs,
          }}
        >
          <Input
            componentId="mlflow.logged_model.list.order_by.filter"
            prefix={<SearchIcon />}
            value={filter}
            type="search"
            onChange={(e) => setFilter(e.target.value)}
            placeholder={intl.formatMessage({
              defaultMessage: 'Search',
              description: 'Placeholder for the search input in the logged model list page sort column selector',
            })}
            autoFocus
            allowClear
          />
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.xs,
            }}
          >
            <ToggleIconButton
              pressed={!orderByAsc}
              icon={<ArrowDownIcon />}
              componentId="mlflow.logged_model.list.order_by.button_desc"
              onClick={() => onChangeOrderBy(orderByColumn, false)}
              aria-label={intl.formatMessage({
                defaultMessage: 'Sort descending',
                description: 'Label for the sort descending button in the logged model list page',
              })}
            />
            <ToggleIconButton
              pressed={orderByAsc}
              icon={<ArrowUpIcon />}
              componentId="mlflow.logged_model.list.order_by.button_asc"
              onClick={() => onChangeOrderBy(orderByColumn, true)}
              aria-label={intl.formatMessage({
                defaultMessage: 'Sort ascending',
                description: 'Label for the sort ascending button in the logged model list page',
              })}
            />
          </div>
        </div>

        {groupedOrderByOptions.map(({ headerName, children, groupId }) => (
          <DropdownMenu.Group key={groupId} aria-label={headerName}>
            <DropdownMenu.Label>{headerName}</DropdownMenu.Label>
            {children?.map(({ headerName: columnHeaderName, colId }) => (
              <DropdownMenu.CheckboxItem
                key={colId}
                componentId="mlflow.logged_model.list.order_by.column_toggle"
                checked={orderByColumn === colId}
                onClick={() => {
                  if (!colId) {
                    return;
                  }
                  onChangeOrderBy(colId, Boolean(orderByAsc));
                }}
              >
                <DropdownMenu.ItemIndicator />
                {columnHeaderName}
              </DropdownMenu.CheckboxItem>
            ))}
          </DropdownMenu.Group>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageTable.tsx
Signals: React

```typescript
import {
  Button,
  Empty,
  getShadowScrollStyles,
  TableSkeleton,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import MLFlowAgGrid from '../../../common/components/ag-grid/AgGrid';
import { useExperimentAgGridTableStyles } from '../experiment-page/components/runs/ExperimentViewRunsTable';
import type { LoggedModelProto, RunEntity } from '../../types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ExperimentLoggedModelListPageTableContextProvider,
  useExperimentLoggedModelListPageTableContext,
} from './ExperimentLoggedModelListPageTableContext';
import { LoggedModelsListPageSortableColumns } from './hooks/useLoggedModelsListPagePageState';
import type { ColumnApi, IsFullWidthRowParams } from '@ag-grid-community/core';
import { type ColDef, type ColGroupDef, type SortChangedEvent } from '@ag-grid-community/core';
import { FormattedMessage } from 'react-intl';
import { useRunsHighlightTableRow } from '../runs-charts/hooks/useRunsHighlightTableRow';
import { ExperimentLoggedModelListPageTableEmpty } from './ExperimentLoggedModelListPageTableEmpty';
import { LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX } from './hooks/useExperimentLoggedModelListPageTableColumns';
import { first, groupBy, isEmpty, orderBy } from 'lodash';
import type {
  LoggedModelDataWithSourceRun,
  LoggedModelsTableGroupByMode,
  LoggedModelsTableRow,
} from './ExperimentLoggedModelListPageTable.utils';
import {
  getLoggedModelsTableRowID,
  LoggedModelsTableDataRow,
  LoggedModelsTableGroupHeaderRowClass,
  LoggedModelsTableGroupingEnabledClass,
  LoggedModelsTableLoadMoreRowSymbol,
  LoggedModelsTableSpecialRowID,
  useLoggedModelTableDataRows,
} from './ExperimentLoggedModelListPageTable.utils';

const LOGGED_MODELS_GRID_ROW_HEIGHT = 36;

interface ExperimentLoggedModelListPageTableProps {
  loggedModels?: LoggedModelProto[];
  isLoading: boolean;
  isLoadingMore: boolean;
  badRequestError?: Error;
  moreResultsAvailable?: boolean;
  onLoadMore?: () => void;
  onOrderByChange?: (orderByColumn: string, orderByAsc: boolean) => void;
  orderByColumn?: string;
  orderByAsc?: boolean;
  columnDefs?: (ColDef | ColGroupDef)[];
  columnVisibility?: Record<string, boolean>;
  relatedRunsData?: RunEntity[] | null;
  className?: string;
  disableLoadMore?: boolean;
  displayShowExampleButton?: boolean;
  isFilteringActive?: boolean;
  groupModelsBy?: LoggedModelsTableGroupByMode | undefined;
}

const ExperimentLoggedModelListPageTableImpl = ({
  loggedModels,
  isLoading,
  isLoadingMore,
  badRequestError,
  onLoadMore,
  orderByColumn,
  orderByAsc,
  moreResultsAvailable,
  onOrderByChange,
  columnDefs = [],
  columnVisibility,
  relatedRunsData,
  className,
  disableLoadMore,
  displayShowExampleButton = true,
  isFilteringActive = true,
  groupModelsBy,
}: ExperimentLoggedModelListPageTableProps) => {
  const { theme } = useDesignSystemTheme();

  const styles = useExperimentAgGridTableStyles({ usingCustomHeaderComponent: false });

  // Keep track of expanded groups in the table
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);

  const columnApiRef = useRef<ColumnApi | null>(null);

  const loggedModelsWithSourceRuns = useMemo<LoggedModelDataWithSourceRun[] | undefined>(() => {
    if (!loggedModels || !relatedRunsData) {
      return loggedModels;
    }
    return loggedModels.map((loggedModel) => {
      const sourceRun = relatedRunsData.find((run) => run?.info?.runUuid === loggedModel?.info?.source_run_id);
      return { ...loggedModel, sourceRun };
    });
  }, [loggedModels, relatedRunsData]);

  // Expand or collapse the group based on its ID
  const onGroupToggle = useCallback((groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  }, []);

  // Get all data rows in the table: logged models and groups if applicable
  const loggedModelsDataRows = useLoggedModelTableDataRows({
    loggedModelsWithSourceRuns,
    groupModelsBy,
    expandedGroups,
  });

  // Get all the table rows, including data rows and the "Load more" row if applicable
  const loggedModelsTableRows = useMemo<LoggedModelsTableRow[] | undefined>(() => {
    if (isLoading) {
      return undefined;
    }
    if (disableLoadMore || !loggedModelsDataRows || loggedModelsDataRows.length === 0) {
      return loggedModelsDataRows;
    }
    return [...loggedModelsDataRows, LoggedModelsTableLoadMoreRowSymbol];
  }, [loggedModelsDataRows, isLoading, disableLoadMore]);

  const sortChangedHandler = useCallback(
    (event: SortChangedEvent) => {
      // Find the currently sorted column using ag-grid's column API
      const sortedColumn = event.columnApi.getColumnState().find((col) => col.sort);
      if (!sortedColumn?.colId) {
        return;
      }
      if (
        LoggedModelsListPageSortableColumns.includes(sortedColumn.colId) ||
        sortedColumn.colId.startsWith(LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX)
      ) {
        onOrderByChange?.(sortedColumn?.colId, sortedColumn.sort === 'asc');
      }
    },
    [onOrderByChange],
  );

  const updateSortIndicator = useCallback((field?: string, asc?: boolean) => {
    // Reflect the sort state in the ag-grid's column state
    const column = columnApiRef.current?.getColumn(field);
    if (column) {
      // Find the currently sorted column and if it's no the same one, clear its sort state
      const currentSortedColumnId = columnApiRef.current?.getColumnState().find((col) => col.sort)?.colId;
      if (currentSortedColumnId !== column.getColId()) {
        columnApiRef.current?.getColumn(currentSortedColumnId)?.setSort(null);
      }
      column.setSort(asc ? 'asc' : 'desc');
    }
  }, []);

  const updateColumnVisibility = useCallback((newColumnVisibility?: Record<string, boolean>) => {
    // Reflect the visibility state in the ag-grid's column state
    for (const column of columnApiRef?.current?.getAllColumns() ?? []) {
      columnApiRef.current?.setColumnVisible(column, newColumnVisibility?.[column.getColId()] !== false);
    }
  }, []);

  // Since ag-grid column API is not stateful, we use side effect to update the UI
  useEffect(() => updateSortIndicator(orderByColumn, orderByAsc), [updateSortIndicator, orderByColumn, orderByAsc]);
  useEffect(() => updateColumnVisibility(columnVisibility), [updateColumnVisibility, columnVisibility]);

  const containsGroupedColumns = useMemo(() => columnDefs.some((col) => 'children' in col), [columnDefs]);

  const containerElement = useRef<HTMLDivElement | null>(null);

  const { cellMouseOverHandler, cellMouseOutHandler } = useRunsHighlightTableRow(
    containerElement,
    undefined,
    true,
    getLoggedModelsTableRowID,
  );

  return (
    <ExperimentLoggedModelListPageTableContextProvider
      loadMoreResults={onLoadMore}
      moreResultsAvailable={moreResultsAvailable}
      isLoadingMore={isLoadingMore}
      expandedGroups={expandedGroups}
      onGroupToggle={onGroupToggle}
    >
      <div
        css={{
          overflow: 'hidden',
          flex: 1,
          ...styles,
          '.ag-cell': {
            alignItems: 'center',
            [`&.${LoggedModelsTableGroupHeaderRowClass}`]: {
              overflow: 'visible',
            },
          },
          borderTop: `1px solid ${theme.colors.border}`,
          '.ag-header-cell.is-checkbox-header-cell': {
            paddingLeft: theme.spacing.sm,
          },
          '&& .ag-root-wrapper': { border: 0 },
        }}
        className={[
          'ag-theme-balham',
          className,
          // When using grouping, add a special class to the table
          // to enable padding
          groupModelsBy ? LoggedModelsTableGroupingEnabledClass : '',
        ].join(' ')}
        ref={containerElement}
      >
        <MLFlowAgGrid
          columnDefs={columnDefs}
          rowData={loggedModelsTableRows}
          rowHeight={LOGGED_MODELS_GRID_ROW_HEIGHT}
          rowSelection="multiple"
          suppressRowClickSelection
          suppressMovableColumns
          getRowId={getLoggedModelsTableRowID}
          suppressLoadingOverlay
          suppressNoRowsOverlay
          suppressColumnMoveAnimation
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={LoadMoreRow}
          onSortChanged={sortChangedHandler}
          onGridReady={({ columnApi }) => {
            columnApiRef.current = columnApi;
            updateSortIndicator(orderByColumn, orderByAsc);
            updateColumnVisibility(columnVisibility);
          }}
          onCellMouseOver={cellMouseOverHandler}
          onCellMouseOut={cellMouseOutHandler}
        />
        {isLoading && (
          <div
            css={{
              inset: 0,
              top: (containsGroupedColumns ? theme.general.heightBase : 0) + theme.spacing.lg,
              position: 'absolute',
              paddingTop: theme.spacing.md,
              paddingRight: theme.spacing.md,
            }}
          >
            <TableSkeleton
              lines={8}
              label={
                <FormattedMessage
                  defaultMessage="Models loading"
                  description="Label for a loading spinner when table containing models is being loaded"
                />
              }
            />
          </div>
        )}
        {!isLoading && loggedModels?.length === 0 && (
          <ExperimentLoggedModelListPageTableEmpty
            displayShowExampleButton={displayShowExampleButton}
            badRequestError={badRequestError}
            isFilteringActive={isFilteringActive}
          />
        )}
      </div>
    </ExperimentLoggedModelListPageTableContextProvider>
  );
};

const LoadMoreRow = () => {
  const { theme } = useDesignSystemTheme();

  const { moreResultsAvailable, loadMoreResults, isLoadingMore } = useExperimentLoggedModelListPageTableContext();

  if (!moreResultsAvailable) {
    return null;
  }
  return (
    <div
      css={{
        pointerEvents: 'all',
        userSelect: 'all',
        padding: theme.spacing.sm,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Button
        componentId="mlflow.logged_models.list.load_more"
        type="primary"
        size="small"
        onClick={loadMoreResults}
        loading={isLoadingMore}
      >
        <FormattedMessage
          defaultMessage="Load more"
          description="Label for a button to load more results in the logged models table"
        />
      </Button>
    </div>
  );
};

export const ExperimentLoggedModelListPageTable = React.memo(ExperimentLoggedModelListPageTableImpl);

const isFullWidthRow: ((params: IsFullWidthRowParams) => boolean) | undefined = ({ rowNode }) =>
  rowNode.data === LoggedModelsTableLoadMoreRowSymbol;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageTable.utils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageTable.utils.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import {
  isLoggedModelDataGroupDataRow,
  LoggedModelsTableGroupByMode,
  LoggedModelsTableSpecialRowID,
  useLoggedModelTableDataRows,
} from './ExperimentLoggedModelListPageTable.utils';
import type { LoggedModelDataWithSourceRun } from './ExperimentLoggedModelListPageTable.utils';
import type { RunEntity } from '../../types';

describe('ExperimentLoggedModelListPageTable.utils', () => {
  describe('useLoggedModelTableDataRows', () => {
    // Sample data for testing
    const createSampleRun = (runId: string): RunEntity => ({
      info: {
        runName: `Run ${runId}`,
        runUuid: runId,
        experimentId: 'exp-1',
        status: 'FINISHED',
        startTime: 1623456789,
        endTime: 1623456999,
        artifactUri: `artifacts/${runId}`,
        lifecycleStage: 'active',
      },
      data: {
        params: [],
        tags: [],
        metrics: [],
      },
    });

    const createSampleLoggedModel = (
      modelId: string,
      runId?: string,
      sourceRun?: RunEntity,
    ): LoggedModelDataWithSourceRun => ({
      info: {
        model_id: modelId,
        name: `model-${modelId}`,
        source_run_id: runId,
      },
      sourceRun,
    });

    test('should return undefined when no logged models are provided', () => {
      const { result } = renderHook(() =>
        useLoggedModelTableDataRows({
          loggedModelsWithSourceRuns: undefined,
          expandedGroups: [],
        }),
      );

      expect(result.current).toBeUndefined();
    });

    test('should return empty array when logged models array is empty', () => {
      const { result } = renderHook(() =>
        useLoggedModelTableDataRows({
          loggedModelsWithSourceRuns: [],
          expandedGroups: [],
        }),
      );

      expect(result.current).toEqual([]);
    });

    test('should return models as-is when no grouping is specified', () => {
      const run1 = createSampleRun('run-1');
      const run2 = createSampleRun('run-2');

      const model1 = createSampleLoggedModel('model-1', 'run-1', run1);
      const model2 = createSampleLoggedModel('model-2', 'run-2', run2);
      const model3 = createSampleLoggedModel('model-3', 'run-1', run1);

      const loggedModels = [model1, model2, model3];

      const { result } = renderHook(() =>
        useLoggedModelTableDataRows({
          loggedModelsWithSourceRuns: loggedModels,
          expandedGroups: [],
        }),
      );

      // Should return all models without grouping
      expect(result.current).toHaveLength(3);
      expect((result.current?.[0] as LoggedModelDataWithSourceRun).info?.model_id).toBe('model-1');
      expect((result.current?.[1] as LoggedModelDataWithSourceRun).info?.model_id).toBe('model-2');
      expect((result.current?.[2] as LoggedModelDataWithSourceRun).info?.model_id).toBe('model-3');
    });

    test('should group models by run when grouping by runs', () => {
      const run1 = createSampleRun('run-1');
      const run2 = createSampleRun('run-2');

      const model1 = createSampleLoggedModel('model-1', 'run-1', run1);
      const model2 = createSampleLoggedModel('model-2', 'run-2', run2);
      const model3 = createSampleLoggedModel('model-3', 'run-1', run1);
      const model4 = createSampleLoggedModel('model-4', undefined, undefined); // No run ID

      const loggedModels = [model1, model2, model3, model4];

      const { result } = renderHook(() =>
        useLoggedModelTableDataRows({
          loggedModelsWithSourceRuns: loggedModels,
          groupModelsBy: LoggedModelsTableGroupByMode.RUNS,
          expandedGroups: [],
        }),
      );

      // Should return groups but not the models since no groups are expanded
      expect(result.current).toHaveLength(3); // 3 groups: run-1, run-2, and REMAINING_MODELS_GROUP

      const [firstGroup, secondGroup, remainingGroup] = result.current || [];

      // Check that all returned items are groups
      expect(isLoggedModelDataGroupDataRow(firstGroup)).toBe(true);
      expect(isLoggedModelDataGroupDataRow(secondGroup)).toBe(true);
      expect(isLoggedModelDataGroupDataRow(remainingGroup)).toBe(true);

      // Check group IDs - the REMAINING_MODELS_GROUP should be last
      expect(isLoggedModelDataGroupDataRow(firstGroup) && firstGroup.groupUuid).toBe('run-1');
      expect(isLoggedModelDataGroupDataRow(secondGroup) && secondGroup.groupUuid).toBe('run-2');
      expect(isLoggedModelDataGroupDataRow(remainingGroup) && remainingGroup.groupUuid).toBe(
        LoggedModelsTableSpecialRowID.REMAINING_MODELS_GROUP,
      );

      // Check that the source run is correctly set for the groups
      expect(isLoggedModelDataGroupDataRow(firstGroup) && firstGroup.groupData?.sourceRun).toBe(run1);
      expect(isLoggedModelDataGroupDataRow(secondGroup) && secondGroup.groupData?.sourceRun).toBe(run2);
    });

    test('should expand groups that are in the expandedGroups array', () => {
      const run1 = createSampleRun('run-1');
      const run2 = createSampleRun('run-2');

      const model1 = createSampleLoggedModel('model-1', 'run-1', run1);
      const model2 = createSampleLoggedModel('model-2', 'run-2', run2);
      const model3 = createSampleLoggedModel('model-3', 'run-1', run1);
      const model4 = createSampleLoggedModel('model-4', undefined, undefined); // No run ID

      const loggedModels = [model1, model2, model3, model4];

      const { result } = renderHook(() =>
        useLoggedModelTableDataRows({
          loggedModelsWithSourceRuns: loggedModels,
          groupModelsBy: LoggedModelsTableGroupByMode.RUNS,
          expandedGroups: ['run-1', LoggedModelsTableSpecialRowID.REMAINING_MODELS_GROUP],
        }),
      );

      // Should have 3 groups + 2 models from run-1 + 1 model from REMAINING_MODELS_GROUP
      expect(result.current).toHaveLength(6);

      const [firstGroup, model1FromRun1, model2FromRun1, secondGroup, remainingGroup, modelFromRemaining] =
        result.current || [];

      // Check the structure: group -> models -> group -> models -> group
      expect(isLoggedModelDataGroupDataRow(firstGroup) && firstGroup.isGroup).toBe(true);
      expect(isLoggedModelDataGroupDataRow(firstGroup) && firstGroup.groupUuid).toBe('run-1');

      expect(isLoggedModelDataGroupDataRow(secondGroup) && secondGroup.isGroup).toBe(true);
      expect(isLoggedModelDataGroupDataRow(secondGroup) && secondGroup.groupUuid).toBe('run-2');

      // Models from run-1 (expanded)
      expect(model1FromRun1 && 'info' in model1FromRun1).toBe(true);
      expect(model1FromRun1 && !isLoggedModelDataGroupDataRow(model1FromRun1) && model1FromRun1.info?.model_id).toBe(
        'model-1',
      );
      expect(model2FromRun1 && !isLoggedModelDataGroupDataRow(model2FromRun1) && 'info' in model2FromRun1).toBe(true);
      expect(model2FromRun1 && !isLoggedModelDataGroupDataRow(model2FromRun1) && model2FromRun1.info?.model_id).toBe(
        'model-3',
      );

      expect(isLoggedModelDataGroupDataRow(remainingGroup) && remainingGroup.isGroup).toBe(true);
      expect(isLoggedModelDataGroupDataRow(remainingGroup) && remainingGroup.groupUuid).toBe(
        LoggedModelsTableSpecialRowID.REMAINING_MODELS_GROUP,
      );

      // Model from REMAINING_MODELS_GROUP (expanded)
      expect(
        modelFromRemaining && !isLoggedModelDataGroupDataRow(modelFromRemaining) && 'info' in modelFromRemaining,
      ).toBe(true);
      expect(
        modelFromRemaining && !isLoggedModelDataGroupDataRow(modelFromRemaining) && modelFromRemaining.info?.model_id,
      ).toBe('model-4');
    });

    test('should handle empty expandedGroups array', () => {
      const run1 = createSampleRun('run-1');
      const model1 = createSampleLoggedModel('model-1', 'run-1', run1);
      const model2 = createSampleLoggedModel('model-2', 'run-1', run1);

      const loggedModels = [model1, model2];

      const { result } = renderHook(() =>
        useLoggedModelTableDataRows({
          loggedModelsWithSourceRuns: loggedModels,
          groupModelsBy: LoggedModelsTableGroupByMode.RUNS,
          expandedGroups: [],
        }),
      );

      const [group] = result.current || [];

      // Should only have the group, no models
      expect(result.current).toHaveLength(1);
      expect(isLoggedModelDataGroupDataRow(group) && group.isGroup).toBe(true);
      expect(isLoggedModelDataGroupDataRow(group) && group.groupUuid).toBe('run-1');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageTable.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageTable.utils.tsx
Signals: React

```typescript
import { first, groupBy, isEmpty, isObject, orderBy } from 'lodash';
import type { LoggedModelProto, RunEntity } from '../../types';
import { useMemo } from 'react';

export enum LoggedModelsTableGroupByMode {
  RUNS = 'runs',
}

export interface LoggedModelDataGroupDataRow {
  isGroup: true;
  groupUuid: string;
  groupData?: {
    sourceRun?: RunEntity;
  };
}

export const isLoggedModelDataGroupDataRow = (data?: LoggedModelsTableDataRow): data is LoggedModelDataGroupDataRow => {
  return isObject(data) && 'isGroup' in data && data.isGroup === true;
};

export const isLoggedModelRow = (data?: LoggedModelsTableDataRow | symbol): data is LoggedModelDataWithSourceRun => {
  return isObject(data) && !isLoggedModelDataGroupDataRow(data);
};

export const LoggedModelsTableLoadMoreRowSymbol = Symbol('LoadMoreRow');

/**
 * Represents a logged model entity enriched with source run
 */
export interface LoggedModelDataWithSourceRun extends LoggedModelProto {
  sourceRun?: RunEntity;
}

/**
 * Represents a >data< row in the logged models table.
 * It's defined to distinguish it from the special "Load more" row.
 */
export type LoggedModelsTableDataRow = LoggedModelDataWithSourceRun | LoggedModelDataGroupDataRow;

/**
 * All possible types of rows in the logged models table.
 */
export type LoggedModelsTableRow = LoggedModelsTableDataRow | typeof LoggedModelsTableLoadMoreRowSymbol;

export const LoggedModelsTableGroupingEnabledClass = 'mlflow-logged-models-table-grouped';
export const LoggedModelsTableGroupHeaderRowClass = 'mlflow-logged-models-table-group-cell';

export enum LoggedModelsTableSpecialRowID {
  LOAD_MORE = 'LOAD_MORE',
  REMAINING_MODELS_GROUP = 'REMAINING_MODELS_GROUP',
}

/**
 * Returns the ID of the logged models table row.
 */
export const getLoggedModelsTableRowID = ({ data }: { data: LoggedModelsTableRow }) => {
  if (!isObject(data)) {
    return LoggedModelsTableSpecialRowID.LOAD_MORE;
  }
  if ('isGroup' in data) {
    return data.groupUuid;
  }
  return data?.info?.model_id ?? '';
};

/**
 * Generates the data rows for the logged models table based on the provided parameters.
 * Supports grouping by source runs if specified.
 */
export const useLoggedModelTableDataRows = ({
  groupModelsBy,
  loggedModelsWithSourceRuns,
  expandedGroups,
}: {
  loggedModelsWithSourceRuns?: LoggedModelDataWithSourceRun[];
  groupModelsBy?: LoggedModelsTableGroupByMode;
  expandedGroups: string[];
}) => {
  return useMemo<LoggedModelsTableDataRow[] | undefined>(() => {
    // If grouping is unavailable or not set, return the original list
    if (!groupModelsBy || isEmpty(loggedModelsWithSourceRuns)) {
      return loggedModelsWithSourceRuns;
    }

    const groups = groupBy(
      loggedModelsWithSourceRuns,
      (loggedModel) => loggedModel.info?.source_run_id ?? LoggedModelsTableSpecialRowID.REMAINING_MODELS_GROUP,
    );

    // Place ungrouped models in a special group at the end
    const sortedGroups = orderBy(
      Object.entries(groups),
      ([groupId]) => groupId !== LoggedModelsTableSpecialRowID.REMAINING_MODELS_GROUP,
      'desc',
    );

    const rows: LoggedModelsTableDataRow[] = [];

    sortedGroups.forEach(([runUuid, models]) => {
      rows.push({
        isGroup: true,
        groupUuid: runUuid,
        groupData: {
          sourceRun: first(models)?.sourceRun,
        },
      });
      if (expandedGroups.includes(runUuid)) {
        rows.push(...models);
      }
    });

    return rows;
  }, [loggedModelsWithSourceRuns, expandedGroups, groupModelsBy]);
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageTableContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageTableContext.tsx
Signals: React

```typescript
import { createContext, useContext, useMemo } from 'react';

type ExperimentLoggedModelListPageTableContextType = {
  moreResultsAvailable?: boolean;
  isLoadingMore?: boolean;
  loadMoreResults?: () => void;
  expandedGroups?: string[];
  onGroupToggle?: (groupId: string) => void;
};

const ExperimentLoggedModelListPageTableContext = createContext<ExperimentLoggedModelListPageTableContextType>({});

export const ExperimentLoggedModelListPageTableContextProvider = ({
  loadMoreResults,
  moreResultsAvailable,
  isLoadingMore,
  children,
  expandedGroups,
  onGroupToggle,
}: React.PropsWithChildren<ExperimentLoggedModelListPageTableContextType>) => {
  const contextValue = useMemo(
    () => ({
      moreResultsAvailable,
      loadMoreResults,
      isLoadingMore,
      expandedGroups,
      onGroupToggle,
    }),
    [moreResultsAvailable, loadMoreResults, isLoadingMore, expandedGroups, onGroupToggle],
  );

  return (
    <ExperimentLoggedModelListPageTableContext.Provider value={contextValue}>
      {children}
    </ExperimentLoggedModelListPageTableContext.Provider>
  );
};

export const useExperimentLoggedModelListPageTableContext = () => useContext(ExperimentLoggedModelListPageTableContext);
```

--------------------------------------------------------------------------------

````

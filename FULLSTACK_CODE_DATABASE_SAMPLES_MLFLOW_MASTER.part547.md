---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 547
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 547 of 991)

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

---[FILE: ExperimentEvaluationRunsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import { Empty, Table, TableHeader, TableRow, TableSkeletonRows, Typography } from '@databricks/design-system';
import type { EvalRunsTableColumnDef } from './ExperimentEvaluationRunsTable.constants';
import { getExperimentEvalRunsDefaultColumns } from './ExperimentEvaluationRunsTable.constants';
import type { OnChangeFn, SortDirection, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel } from '@tanstack/react-table';
import type { ExpandedState, RowSelectionState } from '@tanstack/react-table';
import { ExperimentEvaluationRunsTableRow } from './ExperimentEvaluationRunsTableRow';
import type { DatasetWithRunType } from '../../components/experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { useCallback, useMemo, useState, forwardRef } from 'react';
import { KeyedValueCell, SortableHeaderCell } from './ExperimentEvaluationRunsTableCellRenderers';
import { getEvalRunCellValueBasedOnColumn } from './ExperimentEvaluationRunsTable.utils';
import type { RunEntityOrGroupData } from './ExperimentEvaluationRunsPage.utils';
import type { ExperimentEvaluationRunsPageMode } from './hooks/useExperimentEvaluationRunsPageMode';
import { useExperimentEvaluationRunsRowVisibility } from './hooks/useExperimentEvaluationRunsRowVisibility';

export interface ExperimentEvaluationRunsTableProps {
  data: RunEntityOrGroupData[];
  uniqueColumns: string[];
  selectedColumns: { [key: string]: boolean };
  selectedRunUuid?: string;
  setSelectedRunUuid: (runUuid: string) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  setSelectedDatasetWithRun: (datasetWithRun: DatasetWithRunType) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
  viewMode: ExperimentEvaluationRunsPageMode;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const ExperimentEvaluationRunsTable = forwardRef<HTMLDivElement, ExperimentEvaluationRunsTableProps>(
  (
    {
      data,
      uniqueColumns,
      selectedColumns,
      selectedRunUuid,
      setSelectedRunUuid,
      isLoading,
      hasNextPage,
      rowSelection,
      setRowSelection,
      setSelectedDatasetWithRun,
      setIsDrawerOpen,
      viewMode,
      onScroll,
    },
    ref,
  ) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [expandedRows, setExpandedRows] = useState<ExpandedState>(true);
    const { isRowHidden } = useExperimentEvaluationRunsRowVisibility();

    const columns = useMemo(() => {
      const allColumns = getExperimentEvalRunsDefaultColumns(viewMode);

      // add a column for each available metric
      uniqueColumns.forEach((column) => {
        allColumns.push({
          id: column,
          accessorFn: (row) => {
            if ('subRuns' in row) {
              return undefined;
            }
            return getEvalRunCellValueBasedOnColumn(column, row);
          },
          cell: KeyedValueCell,
          header: SortableHeaderCell,
          enableSorting: true,
          sortingFn: 'alphanumeric',
          meta: {
            styles: {
              minWidth: 100,
              maxWidth: 200,
            },
          },
        });
      });
      return allColumns.filter((column) => selectedColumns[column.id ?? '']);
    }, [selectedColumns, uniqueColumns, viewMode]);

    const table = useReactTable<RunEntityOrGroupData>(
      'mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTable.tsx',
      {
        columns,
        data: data,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row, index) => {
          if ('info' in row) {
            return row.info.runUuid;
          }
          return row.groupKey;
        },
        enableSorting: true,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        enableColumnResizing: false,
        enableExpanding: true,
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => {
          if ('subRuns' in row) {
            return row.subRuns;
          }
          return undefined;
        },
        getRowCanExpand: (row) => Boolean(row.subRows?.length),
        onExpandedChange: setExpandedRows,
        meta: {
          setSelectedRunUuid,
          setSelectedDatasetWithRun,
          setIsDrawerOpen,
        },
        onRowSelectionChange: setRowSelection,
        state: {
          rowSelection,
          sorting,
          expanded: expandedRows,
        },
      },
    );

    return (
      <Table css={{ flex: 1 }} scrollable onScroll={onScroll} ref={ref}>
        <TableRow isHeader>
          {table.getLeafHeaders().map((header) => {
            return (
              <TableHeader
                key={header.id}
                css={(header.column.columnDef as EvalRunsTableColumnDef).meta?.styles}
                sortable={header.column.getCanSort()}
                sortDirection={header.column.getIsSorted() as SortDirection}
                onToggleSort={header.column.getToggleSortingHandler()}
                componentId="mlflow.eval-runs.header"
                header={header}
                column={header.column}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            );
          })}
        </TableRow>

        {!isLoading &&
          table.getRowModel().rows.map((row) => {
            const isActive = 'info' in row.original ? row.original.info.runUuid === selectedRunUuid : false;
            const runStatus = 'info' in row.original ? row.original.info.status : undefined;
            return (
              <ExperimentEvaluationRunsTableRow
                key={row.id}
                row={row}
                isActive={isActive}
                isSelected={rowSelection[row.id]}
                isExpanded={row.getIsExpanded()}
                isHidden={isRowHidden(row.id, row.index, runStatus)}
                columns={columns}
              />
            );
          })}

        {(isLoading || hasNextPage) && <TableSkeletonRows table={table} />}
      </Table>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsTable.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTable.utils.tsx

```typescript
import type { RunEntity } from '../../types';
import { EvalRunsTableKeyedColumnPrefix } from './ExperimentEvaluationRunsTable.constants';

export const createEvalRunsTableKeyedColumnKey = (columnType: EvalRunsTableKeyedColumnPrefix, key: string): string =>
  [columnType, key].join('.');
export const parseEvalRunsTableKeyedColumnKey = (
  key: string,
): undefined | { columnType: EvalRunsTableKeyedColumnPrefix; key: string } => {
  const [columnType, ...rest] = key.split('.');
  if (
    !rest.length ||
    !Object.values(EvalRunsTableKeyedColumnPrefix).includes(columnType as EvalRunsTableKeyedColumnPrefix)
  ) {
    return undefined;
  }
  return {
    columnType: columnType as EvalRunsTableKeyedColumnPrefix,
    key: rest.join('.'),
  };
};

export const getEvalRunCellValueBasedOnColumn = (columnId: string, rowData: RunEntity): string | number | undefined => {
  const { columnType, key: rowDataKey } = parseEvalRunsTableKeyedColumnKey(columnId) ?? {};
  if (!rowDataKey) {
    return undefined;
  }
  switch (columnType) {
    case EvalRunsTableKeyedColumnPrefix.METRIC:
      return rowData.data?.metrics?.find((metric) => metric.key === rowDataKey)?.value ?? undefined;
    case EvalRunsTableKeyedColumnPrefix.PARAM:
      return rowData.data?.params?.find((param) => param.key === rowDataKey)?.value ?? undefined;
    case EvalRunsTableKeyedColumnPrefix.TAG:
      return rowData.data?.tags?.find((tag) => tag.key === rowDataKey)?.value ?? undefined;
    default:
      return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsTableCellRenderers.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTableCellRenderers.tsx
Signals: React

```typescript
import {
  ModelsIcon,
  TableIcon,
  Tag,
  Tooltip,
  Typography,
  useDesignSystemTheme,
  Checkbox,
  ParagraphSkeleton,
  Button,
  NewWindowIcon,
  SortUnsortedIcon,
  VisibleIcon,
  VisibleOffIcon,
} from '@databricks/design-system';
import type { ColumnDef, HeaderContext } from '@tanstack/react-table';
import { DatasetSourceTypes, RunEntity } from '../../types';
import { Link } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { useGetLoggedModelQuery } from '../../hooks/logged-models/useGetLoggedModelQuery';
import Routes from '../../routes';
import { FormattedMessage } from 'react-intl';
import { useSaveExperimentRunColor } from '../../components/experiment-page/hooks/useExperimentRunColor';
import { useGetExperimentRunColor } from '../../components/experiment-page/hooks/useExperimentRunColor';
import { RunColorPill } from '../../components/experiment-page/components/RunColorPill';
import { TimeAgo } from '@databricks/web-shared/browse';
import { parseEvalRunsTableKeyedColumnKey } from './ExperimentEvaluationRunsTable.utils';
import { useMemo } from 'react';
import type { RunEntityOrGroupData } from './ExperimentEvaluationRunsPage.utils';
import { useExperimentEvaluationRunsRowVisibility } from './hooks/useExperimentEvaluationRunsRowVisibility';
import { RunPageTabName } from '../../constants';

export const CheckboxCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({
  row,
  table: {
    options: { meta },
  },
}) => {
  if ('subRuns' in row.original) {
    return <div>-</div>;
  }

  return (
    <Checkbox
      componentId="mlflow.eval-runs.checkbox-cell"
      data-testid={`eval-runs-table-cell-checkbox-${row.id}`}
      disabled={!row.getCanSelect()}
      isChecked={row.getIsSelected()}
      wrapperStyle={{ padding: 0, margin: 0 }}
      onChange={() => row.toggleSelected()}
    />
  );
};

export const RunNameCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({
  row,
  table: {
    options: { meta },
  },
}) => {
  const { theme } = useDesignSystemTheme();
  const saveRunColor = useSaveExperimentRunColor();
  const getRunColor = useGetExperimentRunColor();

  if ('subRuns' in row.original) {
    return <div>-</div>;
  }

  const runUuid = row.original.info.runUuid;

  return (
    <div
      css={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}
      onClick={() => {
        (meta as any).setSelectedRunUuid?.(runUuid);
      }}
    >
      <RunColorPill
        color={getRunColor(runUuid)}
        onChangeColor={(colorValue) => saveRunColor({ runUuid, colorValue })}
      />
      <Typography.Link
        css={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 1 }}
        componentId="mlflow.eval-runs.run-name-cell"
        id="run-name-cell"
      >
        {row.original.info.runName}
      </Typography.Link>
      <div
        css={{
          display: 'none',
          flexShrink: 0,
          '.eval-runs-table-row:hover &': { display: 'inline' },
          svg: {
            width: theme.typography.fontSizeMd,
            height: theme.typography.fontSizeMd,
          },
        }}
      >
        <Link
          target="_blank"
          rel="noreferrer"
          to={Routes.getRunPageTabRoute(row.original.info.experimentId, runUuid, RunPageTabName.EVALUATIONS)}
        >
          <Tooltip
            content={
              <FormattedMessage
                defaultMessage="Go to the run"
                description="Tooltip for the run name cell in the evaluation runs table, opening the run page in a new tab"
              />
            }
            componentId="mlflow.eval-runs.run-name-cell.tooltip"
          >
            <Button
              type="link"
              target="_blank"
              icon={<NewWindowIcon />}
              size="small"
              componentId="mlflow.eval-runs.run-name-cell.open-run-page"
            />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export const DatasetCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({
  row,
  table: {
    options: { meta },
  },
}) => {
  const { theme } = useDesignSystemTheme();

  if ('subRuns' in row.original) {
    return <div>-</div>;
  }

  const run = row.original;
  const datasets = run.inputs?.datasetInputs ?? [];
  const displayedDataset = datasets[0]?.dataset ?? null;

  if (!displayedDataset) {
    return <div>-</div>;
  }

  const openDatasetDrawer = () => {
    (meta as any).setSelectedDatasetWithRun({
      datasetWithTags: { dataset: displayedDataset },
      runData: {
        experimentId: run.info?.experimentId,
        runUuid: run.info?.runUuid ?? '',
        runName: run.info?.runName,
        datasets: datasets,
      },
    });
    (meta as any).setIsDrawerOpen(true);
  };

  const baseTagContent = (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        maxWidth: '100%',
        color: theme.colors.textPrimary,
      }}
    >
      <TableIcon css={{ '& > svg': { width: 12, height: 12 } }} />
      <Typography.Text css={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
        {displayedDataset.name}
      </Typography.Text>
    </div>
  );
  const tagContent = baseTagContent;

  return (
    <div>
      <Tooltip componentId="mlflow.eval-runs.dataset-cell-tooltip" content={displayedDataset.name}>
        <Tag
          componentId="mlflow.eval-runs.dataset-cell"
          onClick={openDatasetDrawer}
          id="dataset-cell"
          css={{ maxWidth: '100%', marginRight: 0 }}
        >
          {tagContent}
        </Tag>
      </Tooltip>
    </div>
  );
};

export const ModelVersionCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({ row }) => {
  const modelId = 'inputs' in row.original ? row.original.inputs?.modelInputs?.[0]?.modelId : undefined;
  const { theme } = useDesignSystemTheme();
  const { data, isLoading } = useGetLoggedModelQuery({ loggedModelId: modelId, enabled: Boolean(modelId) });

  if (!modelId || 'subRuns' in row.original) {
    return <div>-</div>;
  }

  const displayValue = data?.info?.name ?? modelId;

  return isLoading ? (
    <ParagraphSkeleton />
  ) : (
    <Tooltip componentId="mlflow.eval-runs.model-version-cell-tooltip" content={displayValue}>
      <Tag
        componentId="mlflow.eval-runs.model-version-cell"
        id="model-version-cell"
        css={{ maxWidth: '100%', marginRight: 0, cursor: 'pointer' }}
      >
        <Link
          to={Routes.getExperimentLoggedModelDetailsPageRoute(row.original.info.experimentId, modelId)}
          target="_blank"
          css={{ maxWidth: '100%' }}
        >
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              maxWidth: '100%',
            }}
          >
            <ModelsIcon css={{ '& > svg': { width: 12, height: 12, color: theme.colors.textPrimary } }} />
            <Typography.Text css={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {displayValue}
            </Typography.Text>
          </div>
        </Link>
      </Tag>
    </Tooltip>
  );
};

export const KeyedValueCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({ getValue }) => {
  const value = getValue<string>();
  return <span title={value}>{value ?? '-'}</span>;
};

export const SortableHeaderCell = ({
  column,
  title,
}: HeaderContext<RunEntityOrGroupData, unknown> & { title?: React.ReactElement }) => {
  const { theme } = useDesignSystemTheme();

  const displayedKey = useMemo(() => parseEvalRunsTableKeyedColumnKey(column.id)?.key ?? column.id, [column.id]);

  return (
    <div
      css={{
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        ':hover': { cursor: 'pointer', '& > div': { display: 'inline' } },
      }}
    >
      <Tooltip componentId={`mlflow.eval-runs.sortable-header-cell.tooltip-${column.id}`} content={displayedKey}>
        <span css={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
          <Typography.Text bold>{title ?? displayedKey}</Typography.Text>
        </span>
      </Tooltip>
      {!column.getIsSorted() && (
        <div
          css={{
            display: 'none',
            flexShrink: 0,
          }}
        >
          <SortUnsortedIcon />
        </div>
      )}
    </div>
  );
};

export const CreatedAtCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({ row }) => {
  if ('subRuns' in row.original) {
    return <div>-</div>;
  }

  const createdAt = row.original.info.startTime;
  if (!createdAt) {
    return <div>-</div>;
  }
  return <TimeAgo date={new Date(Number(createdAt))} />;
};

export const VisiblityCell: ColumnDef<RunEntityOrGroupData>['cell'] = ({ row, table }) => {
  const { isRowHidden, toggleRowVisibility } = useExperimentEvaluationRunsRowVisibility();
  // TODO: allow toggling visibility for a whole run group
  if ('subRuns' in row.original) {
    return <div>-</div>;
  }
  const runUuid = row.original.info.runUuid;
  const rowIndex = row.index;
  const runStatus = row.original.info.status;
  const Icon = isRowHidden(runUuid, rowIndex, runStatus) ? VisibleOffIcon : VisibleIcon;

  return <Icon onClick={() => toggleRowVisibility(runUuid)} css={{ cursor: 'pointer' }} />;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsTableControls.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTableControls.tsx
Signals: React

```typescript
import {
  useDesignSystemTheme,
  Button,
  Modal,
  DialogCombobox,
  DialogComboboxTrigger,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  RefreshIcon,
  DialogComboboxSectionHeader,
  Spacer,
  SegmentedControlGroup,
  SegmentedControlButton,
  TableIcon,
  ChartLineIcon,
  ListBorderIcon,
  Tooltip,
} from '@databricks/design-system';
import type { RowSelectionState } from '@tanstack/react-table';
import { FormattedMessage, useIntl } from 'react-intl';
import { RunsSearchAutoComplete } from '../../components/experiment-page/components/runs/RunsSearchAutoComplete';
import type { RunEntity } from '../../types';
import type { ExperimentRunsSelectorResult } from '../../components/experiment-page/utils/experimentRuns.selector';
import type { KeyValueEntity } from '../../../common/types';
import { ErrorWrapper } from '@mlflow/mlflow/src/common/utils/ErrorWrapper';
import { useCallback, useMemo, useState } from 'react';
import { useDeleteRuns } from '../../components/experiment-page/hooks/useDeleteRuns';
import type { EvalRunsTableColumnId } from './ExperimentEvaluationRunsTable.constants';
import {
  EVAL_RUNS_COLUMN_LABELS,
  EVAL_RUNS_COLUMN_TYPE_LABELS,
  EVAL_RUNS_UNSELECTABLE_COLUMNS,
  EvalRunsTableKeyedColumnPrefix,
} from './ExperimentEvaluationRunsTable.constants';
import { parseEvalRunsTableKeyedColumnKey } from './ExperimentEvaluationRunsTable.utils';
import { groupBy } from 'lodash';
import { ExperimentEvaluationRunsTableGroupBySelector } from './ExperimentEvaluationRunsTableGroupBySelector';
import type { RunsGroupByConfig } from '../../components/experiment-page/utils/experimentPage.group-row-utils';
import { ExperimentEvaluationRunsPageMode } from './hooks/useExperimentEvaluationRunsPageMode';

// function to mimic the data structure of the legacy runs response
// so we can reuse the RunsSearchAutoComplete component
const getRunTableMetadata = (runsData: RunEntity[]): ExperimentRunsSelectorResult => {
  const metricKeys = new Set<string>();
  const paramKeys = new Set<string>();
  const tags: Record<string, KeyValueEntity>[] = [];

  runsData.forEach((run) => {
    run.data.metrics?.forEach((metric) => {
      metricKeys.add(metric.key);
    });
    run.data.params?.forEach((param) => {
      paramKeys.add(param.key);
    });

    const runTags: Record<string, KeyValueEntity> = {};
    run.data.tags?.forEach((tag) => {
      runTags[tag.key] = { key: tag.key, value: tag.value };
    });

    tags.push(runTags);
  });

  return {
    metricKeyList: Array.from(metricKeys),
    paramKeyList: Array.from(paramKeys),
    tagsList: tags,
  } as ExperimentRunsSelectorResult;
};

export const ExperimentEvaluationRunsTableControls = ({
  rowSelection,
  setRowSelection,
  refetchRuns,
  isFetching,
  runs,
  searchRunsError,
  searchFilter,
  setSearchFilter,
  selectedColumns,
  setSelectedColumns,
  groupByConfig,
  setGroupByConfig,
  viewMode,
  setViewMode,
}: {
  rowSelection: RowSelectionState;
  setRowSelection: (selection: RowSelectionState) => void;
  runs: RunEntity[];
  refetchRuns: () => void;
  isFetching: boolean;
  searchRunsError: ErrorWrapper | Error | null;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  selectedColumns: { [key: string]: boolean };
  setSelectedColumns: (columns: { [key: string]: boolean }) => void;
  groupByConfig: RunsGroupByConfig | null;
  setGroupByConfig: (groupBy: RunsGroupByConfig | null) => void;
  viewMode?: ExperimentEvaluationRunsPageMode;
  setViewMode?: (mode: ExperimentEvaluationRunsPageMode) => void;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const selectedRunUuids = Object.entries(rowSelection)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const { mutate, isLoading } = useDeleteRuns({
    onSuccess: () => {
      refetchRuns();
      setRowSelection({});
      setDeleteModalVisible(false);
    },
  });

  const handleDelete = useCallback(() => {
    mutate({ runUuids: selectedRunUuids });
  }, [mutate, selectedRunUuids]);

  const columnPartitions = useMemo(
    () =>
      groupBy(
        Object.entries(selectedColumns),
        ([columnId]) =>
          parseEvalRunsTableKeyedColumnKey(columnId)?.columnType ?? EvalRunsTableKeyedColumnPrefix.ATTRIBUTE,
      ),
    [selectedColumns],
  );

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      <div css={{ display: 'flex', gap: theme.spacing.sm }}>
        <SegmentedControlGroup
          name="mlflow.eval-runs.page-mode-selector"
          componentId="mlflow.eval-runs.page-mode-selector"
          value={viewMode}
          css={{ flexShrink: 0 }}
        >
          <SegmentedControlButton
            value={ExperimentEvaluationRunsPageMode.TRACES}
            icon={
              <Tooltip
                componentId="mlflow.eval-runs.traces-mode-toggle-tooltip"
                content={
                  <FormattedMessage
                    defaultMessage="Trace view"
                    description="Tooltip for traces preview mode toggle in evaluation runs table controls"
                  />
                }
                delayDuration={0}
              >
                <ListBorderIcon />
              </Tooltip>
            }
            onClick={() => setViewMode?.(ExperimentEvaluationRunsPageMode.TRACES)}
          />
          <SegmentedControlButton
            value={ExperimentEvaluationRunsPageMode.CHARTS}
            icon={
              <Tooltip
                componentId="mlflow.eval-runs.charts-mode-toggle-tooltip"
                content={
                  <FormattedMessage
                    defaultMessage="Charts"
                    description="Tooltip for charts page mode toggle in evaluation runs table controls"
                  />
                }
                delayDuration={0}
              >
                <ChartLineIcon />
              </Tooltip>
            }
            onClick={() => setViewMode?.(ExperimentEvaluationRunsPageMode.CHARTS)}
          />
        </SegmentedControlGroup>
        <RunsSearchAutoComplete
          css={{ minWidth: 0 }}
          runsData={getRunTableMetadata(runs)}
          searchFilter={searchFilter}
          onSearchFilterChange={setSearchFilter}
          onClear={() => setSearchFilter('')}
          requestError={searchRunsError}
        />
        <Button
          css={{ flexShrink: 0 }}
          icon={<RefreshIcon />}
          disabled={isFetching}
          onClick={refetchRuns}
          componentId="mlflow.eval-runs.table-refresh-button"
        />
      </div>
      <div css={{ display: 'flex', gap: theme.spacing.sm }}>
        <DialogCombobox componentId="mlflow.eval-runs.table-column-selector" label="Columns" multiSelect>
          <DialogComboboxTrigger />
          <DialogComboboxContent>
            <DialogComboboxOptionList>
              {Object.entries(columnPartitions).map(([columnType, columns]) => {
                if (!columns.length) {
                  return null;
                }
                const headerLabelDescriptor =
                  EVAL_RUNS_COLUMN_TYPE_LABELS[columnType as EvalRunsTableKeyedColumnPrefix];
                return (
                  // eslint-disable-next-line react/jsx-key
                  <>
                    <Spacer size="xs" />
                    <DialogComboboxSectionHeader>
                      {headerLabelDescriptor ? intl.formatMessage(headerLabelDescriptor) : columnType}
                    </DialogComboboxSectionHeader>
                    {columns.map(([column, selected]) => {
                      const labelDescriptorForKnownColumn = EVAL_RUNS_COLUMN_LABELS[column as EvalRunsTableColumnId];
                      const label = labelDescriptorForKnownColumn
                        ? intl.formatMessage(labelDescriptorForKnownColumn)
                        : parseEvalRunsTableKeyedColumnKey(column)?.key ?? column;

                      if (EVAL_RUNS_UNSELECTABLE_COLUMNS.has(column)) {
                        return null;
                      }

                      return (
                        <DialogComboboxOptionListCheckboxItem
                          key={column}
                          value={column}
                          onChange={() => {
                            const newSelectedColumns = { ...selectedColumns };
                            newSelectedColumns[column] = !selected;
                            setSelectedColumns(newSelectedColumns);
                          }}
                          checked={selected}
                        >
                          {label}
                        </DialogComboboxOptionListCheckboxItem>
                      );
                    })}
                  </>
                );
              })}
            </DialogComboboxOptionList>
          </DialogComboboxContent>
        </DialogCombobox>
        <ExperimentEvaluationRunsTableGroupBySelector
          groupByConfig={groupByConfig}
          setGroupByConfig={setGroupByConfig}
          runs={runs}
        />
        {selectedRunUuids.length > 0 && (
          <div css={{ display: 'flex', flexDirection: 'row', gap: theme.spacing.sm }}>
            <Button danger componentId="select-all-runs-button" onClick={() => setDeleteModalVisible(true)}>
              <FormattedMessage defaultMessage="Delete" description="Delete runs" />
            </Button>
            <Modal
              componentId="mlflow.eval-runs.runs-delete-modal"
              visible={deleteModalVisible}
              onOk={handleDelete}
              okButtonProps={{ danger: true, loading: isLoading }}
              okText={
                <FormattedMessage defaultMessage="Delete" description="Delete evaluation runs modal button text" />
              }
              onCancel={() => {
                setDeleteModalVisible(false);
              }}
              cancelText={
                <FormattedMessage defaultMessage="Cancel" description="Delete evaluation runs cancel button text" />
              }
              confirmLoading={isLoading}
              title={
                <FormattedMessage
                  defaultMessage="Delete {numRuns, plural, =1 {1 run} other {# runs}}"
                  description="Delete evaluation runs modal title"
                  values={{ numRuns: selectedRunUuids.length }}
                />
              }
            >
              <FormattedMessage
                defaultMessage="Are you sure you want to delete these runs?"
                description="Delete evaluation runs modal confirmation text"
              />
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsTableGroupBySelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTableGroupBySelector.tsx
Signals: React

```typescript
import {
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  DialogComboboxSectionHeader,
  DialogComboboxTrigger,
} from '@databricks/design-system';
import { EVAL_RUNS_UNSELECTABLE_COLUMNS } from './ExperimentEvaluationRunsTable.constants';
import {
  RunGroupingAggregateFunction,
  RunGroupingMode,
} from '../../components/experiment-page/utils/experimentPage.row-types';
import type { RunEntity } from '../../types';
import { FormattedMessage } from 'react-intl';
import type { RunsGroupByConfig } from '../../components/experiment-page/utils/experimentPage.group-row-utils';
import { isGroupedBy } from '../../components/experiment-page/utils/experimentPage.group-row-utils';
import { isUserFacingTag } from '@mlflow/mlflow/src/common/utils/TagUtils';
import { useMemo } from 'react';

export const ExperimentEvaluationRunsTableGroupBySelector = ({
  groupByConfig,
  setGroupByConfig,
  runs,
}: {
  groupByConfig: RunsGroupByConfig | null;
  setGroupByConfig: (groupBy: RunsGroupByConfig | null) => void;
  runs: RunEntity[];
}) => {
  const hasDatasets = runs.some((run) => (run.inputs?.datasetInputs?.length ?? 0) > 0);
  const { uniqueParams, uniqueTags } = useMemo(() => {
    const uniqueParams = new Set<string>();
    const uniqueTags = new Set<string>();

    for (const run of runs) {
      for (const param of run.data?.params ?? []) {
        uniqueParams.add(param.key);
      }
      for (const tag of run.data?.tags ?? []) {
        if (isUserFacingTag(tag.key)) {
          uniqueTags.add(tag.key);
        }
      }
    }

    return { uniqueParams, uniqueTags };
  }, [runs]);

  const toggleGroupBy = (mode: RunGroupingMode, columnName: string) => {
    const groupByKeys = groupByConfig?.groupByKeys ?? [];
    const newGroupByKeys = new Set(groupByKeys);
    if (isGroupedBy(groupByConfig, mode, columnName)) {
      // we can't delete objects directly from a set
      // without the reference to the original object
      for (const key of newGroupByKeys) {
        if (key.mode === mode && key.groupByData === columnName) {
          newGroupByKeys.delete(key);
        }
      }
    } else {
      newGroupByKeys.add({ mode, groupByData: columnName });
    }

    if (newGroupByKeys.size === 0) {
      setGroupByConfig(null);
    } else {
      setGroupByConfig({
        aggregateFunction: groupByConfig?.aggregateFunction ?? RunGroupingAggregateFunction.Average,
        groupByKeys: Array.from(newGroupByKeys),
      });
    }
  };

  return (
    <DialogCombobox componentId="mlflow.eval-runs.table-column-selector" label="Group by" multiSelect>
      <DialogComboboxTrigger />
      <DialogComboboxContent>
        <DialogComboboxOptionList>
          {hasDatasets && (
            <>
              <DialogComboboxSectionHeader>
                <FormattedMessage
                  defaultMessage="Attributes"
                  description="Section header for the attributes in a 'group by' selector"
                />
              </DialogComboboxSectionHeader>
              <DialogComboboxOptionListCheckboxItem
                key="dataset"
                value="dataset"
                checked={isGroupedBy(groupByConfig, RunGroupingMode.Dataset, 'dataset')}
                onChange={() => {
                  toggleGroupBy(RunGroupingMode.Dataset, 'dataset');
                }}
              />
            </>
          )}
          {uniqueParams.size > 0 && (
            <>
              <DialogComboboxSectionHeader>
                <FormattedMessage
                  defaultMessage="Parameters"
                  description="Section header for the parameters in a 'group by' selector"
                />
              </DialogComboboxSectionHeader>
              {Array.from(uniqueParams).map((param) => (
                <DialogComboboxOptionListCheckboxItem
                  key={param}
                  value={param}
                  checked={isGroupedBy(groupByConfig, RunGroupingMode.Param, param)}
                  onChange={() => {
                    toggleGroupBy(RunGroupingMode.Param, param);
                  }}
                />
              ))}
            </>
          )}
          {uniqueTags.size > 0 && (
            <>
              <DialogComboboxSectionHeader>
                <FormattedMessage
                  defaultMessage="Tags"
                  description="Section header for the tags in a 'group by' selector"
                />
              </DialogComboboxSectionHeader>
              {Array.from(uniqueTags).map((tag) => (
                <DialogComboboxOptionListCheckboxItem
                  key={tag}
                  value={tag}
                  checked={isGroupedBy(groupByConfig, RunGroupingMode.Tag, tag)}
                  onChange={() => {
                    toggleGroupBy(RunGroupingMode.Tag, tag);
                  }}
                />
              ))}
            </>
          )}
        </DialogComboboxOptionList>
      </DialogComboboxContent>
    </DialogCombobox>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsTableRow.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTableRow.tsx
Signals: React

```typescript
import React from 'react';
import {
  TableRow,
  TableCell,
  useDesignSystemTheme,
  Typography,
  Button,
  ChevronRightIcon,
  ChevronDownIcon,
  Tooltip,
  Tag,
} from '@databricks/design-system';
import type { EvalRunsTableColumnDef } from './ExperimentEvaluationRunsTable.constants';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import type { RunEntityOrGroupData } from './ExperimentEvaluationRunsPage.utils';
import type { RunGroupByGroupingValue } from '../../components/experiment-page/utils/experimentPage.row-types';
import { RunGroupingMode } from '../../components/experiment-page/utils/experimentPage.row-types';
import { FormattedMessage } from 'react-intl';

type TracesViewTableRowProps = {
  row: Row<RunEntityOrGroupData>;
  isActive: boolean;
  // use for memoization updates to the checkbox
  isSelected: boolean;
  isExpanded: boolean;
  columns: EvalRunsTableColumnDef[];
  isHidden: boolean;
};

const GroupTag = ({ groupKey, groupValue }: { groupKey: string; groupValue: string }): React.ReactElement => {
  const { theme } = useDesignSystemTheme();

  return (
    <Tooltip content={groupKey + ': ' + groupValue} componentId="mlflow.eval-runs.group-tag">
      <Tag css={{ margin: 0 }} componentId="mlflow.eval-runs.group-tag">
        <Typography.Text
          bold
          css={{
            maxWidth: 100,
            marginRight: theme.spacing.xs,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {groupKey}:
        </Typography.Text>
        <Typography.Text css={{ maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {groupValue}
        </Typography.Text>
      </Tag>
    </Tooltip>
  );
};

const GroupLabel = ({ groupValues }: { groupValues: RunGroupByGroupingValue }): React.ReactElement => {
  const key = groupValues.groupByData;
  if (groupValues.mode === RunGroupingMode.Dataset) {
    return <GroupTag key={key} groupKey="Dataset" groupValue={String(groupValues.value)} />;
  }

  return <GroupTag key={key} groupKey={key} groupValue={String(groupValues.value)} />;
};

export const ExperimentEvaluationRunsTableRow = React.memo(
  ({ row, isActive }: TracesViewTableRowProps) => {
    const { theme } = useDesignSystemTheme();

    if ('groupValues' in row.original) {
      return (
        <TableRow key={row.id} className="eval-runs-table-row">
          <TableCell>
            <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <Button
                componentId="mlflow.eval-runs.group-expand-button"
                size="small"
                css={{ flexShrink: 0 }}
                icon={row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
                onClick={row.getToggleExpandedHandler()}
              />
              <Typography.Text bold>
                <FormattedMessage
                  defaultMessage="Group:"
                  description="Label for a group of runs in the evaluation runs table"
                />
              </Typography.Text>
              {row.original.groupValues.map((groupValue) => (
                <GroupLabel key={groupValue.groupByData} groupValues={groupValue} />
              ))}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={row.id} className="eval-runs-table-row">
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            css={[
              (cell.column.columnDef as EvalRunsTableColumnDef).meta?.styles,
              {
                backgroundColor: isActive ? theme.colors.actionDefaultBackgroundHover : 'transparent',
              },
            ]}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  },
  (prev, next) => {
    return (
      prev.isActive === next.isActive &&
      prev.isSelected === next.isSelected &&
      prev.columns === next.columns &&
      prev.isExpanded === next.isExpanded &&
      prev.isHidden === next.isHidden
    );
  },
);
```

--------------------------------------------------------------------------------

````

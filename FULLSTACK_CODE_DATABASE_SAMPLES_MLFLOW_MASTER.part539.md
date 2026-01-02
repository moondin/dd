---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 539
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 539 of 991)

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

---[FILE: TracesViewTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  CursorPagination,
  DangerIcon,
  Empty,
  Table,
  TableHeader,
  TableRow,
  TableSkeletonRows,
  Typography,
  useDesignSystemTheme,
  Button,
  DropdownMenu,
  TableRowAction,
  ColumnsIcon,
} from '@databricks/design-system';
import type { SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { isNil, entries } from 'lodash';
import Utils from '../../../common/utils/Utils';
import { Link } from '../../../common/utils/RoutingUtils';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import Routes from '../../routes';
import {
  ExperimentViewTracesTableColumnLabels,
  ExperimentViewTracesTableColumns,
  TRACE_TABLE_CHECKBOX_COLUMN_ID,
  TRACE_TAG_NAME_TRACE_NAME,
  getTraceInfoRunId,
  getTraceInfoTotalTokens,
  getTraceTagValue,
} from './TracesView.utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { TracesViewTableTagCell } from './TracesViewTableTagCell';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import { TracesViewTableStatusCell } from './TracesViewTableStatusCell';
import { TracesViewTableRequestPreviewCell, TracesViewTableResponsePreviewCell } from './TracesViewTablePreviewCell';
import { TracesViewTableSourceCell } from './TracesViewTableSourceCell';
import type { TracesColumnDef } from './TracesViewTable.utils';
import { getColumnSizeClassName, getHeaderSizeClassName } from './TracesViewTable.utils';
import { TracesViewTableRow } from './TracesViewTableRow';
import { TracesViewTableTimestampCell } from './TracesViewTableTimestampCell';
import { TracesViewTableHeaderCheckbox } from './TracesViewTableHeaderCheckbox';
import { TracesViewTableCellCheckbox } from './TracesViewTableCellCheckbox';
import { TracesViewTableNoTracesQuickstart } from './quickstart/TracesViewTableNoTracesQuickstart';
import { isUnstableNestedComponentsMigrated } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

export interface TracesViewTableProps {
  experimentIds: string[];
  runUuid?: string;
  traces: ModelTraceInfoWithRunName[];
  onTraceClicked?: (trace: ModelTraceInfo) => void;
  onTraceTagsEdit?: (trace: ModelTraceInfo) => void;
  onTagsUpdated?: () => void;
  loading: boolean;
  error?: Error;
  usingFilters?: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onResetFilters: () => void;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  rowSelection: { [id: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [id: string]: boolean }>>;
  hiddenColumns?: string[];
  disableTokenColumn?: boolean;
  baseComponentId: string;
  toggleHiddenColumn: (columnId: string) => void;
  disabledColumns?: string[];
}

type TracesViewTableMeta = {
  baseComponentId: string;
  onTraceClicked?: TracesViewTableProps['onTraceClicked'];
  onTraceTagsEdit?: TracesViewTableProps['onTraceTagsEdit'];
};

const RequestIdCell: TracesColumnDef['cell'] = ({
  row: { original },
  table: {
    options: { meta },
  },
}) => {
  const { baseComponentId, onTraceClicked } = meta as TracesViewTableMeta;
  return (
    <Typography.Link
      componentId={`${baseComponentId}.traces_table.request_id_link`}
      ellipsis
      css={{ maxWidth: '100%', textOverflow: 'ellipsis' }}
      onClick={() => {
        onTraceClicked?.(original);
      }}
    >
      {original.request_id}
    </Typography.Link>
  );
};

const TraceNameCell: TracesColumnDef['cell'] = ({
  row: { original },
  table: {
    options: { meta },
  },
}) => {
  const { baseComponentId, onTraceClicked } = meta as TracesViewTableMeta;
  return (
    <Typography.Link
      componentId={`${baseComponentId}.traces_table.trace_name_link`}
      ellipsis
      css={{ maxWidth: '100%', textOverflow: 'ellipsis' }}
      onClick={() => {
        onTraceClicked?.(original);
      }}
    >
      {getTraceTagValue(original, TRACE_TAG_NAME_TRACE_NAME)}
    </Typography.Link>
  );
};

const RunNameCell: TracesColumnDef['cell'] = ({ row: { original } }) => {
  const runId = getTraceInfoRunId(original);
  if (!runId || !original.experiment_id) {
    return null;
  }
  const label = original.runName || runId;
  return (
    <Link
      css={{
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        overflow: 'hidden',
      }}
      to={Routes.getRunPageRoute(original.experiment_id, runId)}
    >
      {label}
    </Link>
  );
};

const TraceTagsCell: TracesColumnDef['cell'] = ({
  row: { original },
  table: {
    options: { meta },
  },
}) => {
  const { onTraceTagsEdit, baseComponentId } = meta as TracesViewTableMeta;
  return (
    <TracesViewTableTagCell
      tags={original.tags || []}
      onAddEditTags={() => onTraceTagsEdit?.(original)}
      baseComponentId={baseComponentId}
    />
  );
};

type ColumnListItem = {
  key: string;
  label: string;
};

export const TracesViewTable = React.memo(
  ({
    experimentIds,
    runUuid,
    traces,
    loading,
    error,
    onTraceClicked,
    onTraceTagsEdit,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    usingFilters,
    onResetFilters,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    hiddenColumns = [],
    disableTokenColumn,
    baseComponentId,
    toggleHiddenColumn,
    disabledColumns = [],
  }: TracesViewTableProps) => {
    const intl = useIntl();
    const { theme } = useDesignSystemTheme();

    const showQuickStart = !loading && traces.length === 0 && !usingFilters && !error;

    const useStaticColumnsCells = isUnstableNestedComponentsMigrated();

    const allColumnsList = useMemo<ColumnListItem[]>(() => {
      return entries(ExperimentViewTracesTableColumnLabels)
        .map(([key, label]) => ({
          key,
          label: intl.formatMessage(label),
        }))
        .filter(({ key }) => !disabledColumns.includes(key));
    }, [intl, disabledColumns]);

    const columns = useMemo<TracesColumnDef[]>(() => {
      if (showQuickStart) {
        return [];
      }

      const columns: TracesColumnDef[] = [
        {
          id: TRACE_TABLE_CHECKBOX_COLUMN_ID,
          header: TracesViewTableHeaderCheckbox,
          enableResizing: false,
          enableSorting: false,
          cell: TracesViewTableCellCheckbox,
          meta: { styles: { minWidth: 32, maxWidth: 32 } },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.requestId]),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.requestId,
          cell: useStaticColumnsCells
            ? RequestIdCell
            : ({ row: { original } }) => {
                return (
                  <Typography.Link
                    componentId={`${baseComponentId}.traces_table.request_id_link`}
                    ellipsis
                    css={{ maxWidth: '100%', textOverflow: 'ellipsis' }}
                    onClick={() => {
                      onTraceClicked?.(original);
                    }}
                  >
                    {original.request_id}
                  </Typography.Link>
                );
              },
          meta: { styles: { minWidth: 200 } },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.traceName]),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.traceName,
          cell: useStaticColumnsCells
            ? TraceNameCell
            : ({ row: { original } }) => {
                return (
                  <Typography.Link
                    componentId={`${baseComponentId}.traces_table.trace_name_link`}
                    ellipsis
                    css={{ maxWidth: '100%', textOverflow: 'ellipsis' }}
                    onClick={() => {
                      onTraceClicked?.(original);
                    }}
                  >
                    {getTraceTagValue(original, TRACE_TAG_NAME_TRACE_NAME)}
                  </Typography.Link>
                );
              },
          meta: { styles: { minWidth: 150 } },
        },
        {
          header: intl.formatMessage(
            ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.timestampMs],
          ),
          id: ExperimentViewTracesTableColumns.timestampMs,
          accessorFn: (data) => data.timestamp_ms,
          enableSorting: true,
          enableResizing: true,
          cell: TracesViewTableTimestampCell,
          meta: { styles: { minWidth: 100 } },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.status]),
          id: ExperimentViewTracesTableColumns.status,
          enableSorting: false,
          enableResizing: true,
          cell: TracesViewTableStatusCell,
          meta: { styles: { minWidth: 100 } },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.inputs]),
          id: ExperimentViewTracesTableColumns.inputs,
          enableSorting: false,
          enableResizing: true,
          cell: TracesViewTableRequestPreviewCell,
          meta: { multiline: true },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.outputs]),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.outputs,
          cell: TracesViewTableResponsePreviewCell,
          meta: { multiline: true },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.runName]),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.runName,
          cell: useStaticColumnsCells
            ? RunNameCell
            : ({ row: { original } }) => {
                const runId = getTraceInfoRunId(original);
                if (!runId || !original.experiment_id) {
                  return null;
                }
                const label = original.runName || runId;
                return (
                  <Link
                    css={{
                      maxWidth: '100%',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      overflow: 'hidden',
                    }}
                    to={Routes.getRunPageRoute(original.experiment_id, runId)}
                  >
                    {label}
                  </Link>
                );
              },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.source]),
          enableSorting: true,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.source,
          cell: TracesViewTableSourceCell,
          meta: { styles: { minWidth: 100 } },
        },
      ];

      if (!disableTokenColumn) {
        columns.push({
          header: intl.formatMessage(
            ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.totalTokens],
          ),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.totalTokens,
          accessorFn: (data) => getTraceInfoTotalTokens(data),
          meta: { styles: { minWidth: 80, maxWidth: 80 } },
        });
      }
      columns.push(
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.latency]),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.latency,
          accessorFn: (data) => {
            if (isNil(data.execution_time_ms) || !isFinite(data.execution_time_ms)) {
              return null;
            }
            return Utils.formatDuration(data.execution_time_ms);
          },
          meta: { styles: { minWidth: 100 } },
        },
        {
          header: intl.formatMessage(ExperimentViewTracesTableColumnLabels[ExperimentViewTracesTableColumns.tags]),
          enableSorting: false,
          enableResizing: true,
          id: ExperimentViewTracesTableColumns.tags,
          cell: useStaticColumnsCells
            ? TraceTagsCell
            : ({ row: { original } }) => {
                return (
                  <TracesViewTableTagCell
                    tags={original.tags || []}
                    onAddEditTags={() => onTraceTagsEdit?.(original)}
                    baseComponentId={baseComponentId}
                  />
                );
              },
        },
      );

      return columns.filter((column) => column.id && !hiddenColumns.includes(column.id));
    }, [
      intl,
      onTraceClicked,
      onTraceTagsEdit,
      disableTokenColumn,
      hiddenColumns,
      baseComponentId,
      useStaticColumnsCells,
      showQuickStart,
    ]);

    const table = useReactTable<ModelTraceInfoWithRunName>(
      'mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTable.tsx',
      {
        columns,
        data: showQuickStart ? [] : traces,
        state: { sorting, rowSelection },
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row, index) => row.request_id || index.toString(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        enableColumnResizing: true,
        enableRowSelection: true,
        columnResizeMode: 'onChange',
        meta: { baseComponentId, onTraceClicked, onTraceTagsEdit } satisfies TracesViewTableMeta,
      },
    );

    const getEmptyState = () => {
      if (error) {
        const errorMessage = error instanceof ErrorWrapper ? error.getMessageField() : error.message;
        return (
          <Empty
            image={<DangerIcon />}
            description={errorMessage}
            title={
              <FormattedMessage
                defaultMessage="Error"
                description="Experiment page > traces table > error state title"
              />
            }
          />
        );
      }
      if (!loading && traces.length === 0 && usingFilters) {
        return (
          <Empty
            description={
              <FormattedMessage
                defaultMessage="No traces found with the current filter query. <button>Reset filters</button> to see all traces."
                description="Experiment page > traces table > no traces recorded"
                values={{
                  button: (chunks: any) => (
                    <Typography.Link
                      componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracesviewtable.tsx_289"
                      onClick={onResetFilters}
                    >
                      {chunks}
                    </Typography.Link>
                  ),
                }}
              />
            }
            title={
              <FormattedMessage
                defaultMessage="No traces found"
                description="Experiment page > traces table > no traces recorded"
              />
            }
          />
        );
      }
      return null;
    };

    // to improve performance, we pass the column sizes as inline styles to the table
    const columnSizeInfo = table.getState().columnSizingInfo;
    const columnSizeVars = React.useMemo(() => {
      if (showQuickStart) {
        return {};
      }
      const headers = table.getFlatHeaders();
      const colSizes: { [key: string]: number } = {};
      headers.forEach((header) => {
        colSizes[getHeaderSizeClassName(header.id)] = header.getSize();
        colSizes[getColumnSizeClassName(header.column.id)] = header.column.getSize();
      });
      return colSizes;
      // we need to recompute this whenever columns get resized or changed
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnSizeInfo, columns, table, showQuickStart]);

    if (showQuickStart) {
      return <TracesViewTableNoTracesQuickstart baseComponentId={baseComponentId} runUuid={runUuid} />;
    }

    return (
      <Table
        scrollable
        empty={getEmptyState()}
        style={columnSizeVars}
        pagination={
          <CursorPagination
            componentId={`${baseComponentId}.traces_table.pagination`}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
          />
        }
      >
        <TableRow isHeader>
          {table.getLeafHeaders().map((header) => {
            return (
              <TableHeader
                componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracesviewtable.tsx_365"
                key={header.id}
                css={(header.column.columnDef as TracesColumnDef).meta?.styles}
                sortable={header.column.getCanSort()}
                sortDirection={header.column.getIsSorted() || 'none'}
                onToggleSort={header.column.getToggleSortingHandler()}
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                isResizing={header.column.getIsResizing()}
                style={{
                  flex: `calc(var(${getHeaderSizeClassName(header.id)}) / 100)`,
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            );
          })}
          <TableRowAction>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  componentId={`${baseComponentId}.traces_table.column_selector_dropdown`}
                  icon={<ColumnsIcon />}
                  size="small"
                  aria-label={intl.formatMessage({
                    defaultMessage: 'Select columns',
                    description: 'Experiment page > traces table > column selector dropdown aria label',
                  })}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                {allColumnsList.map(({ key, label }) => (
                  <DropdownMenu.CheckboxItem
                    key={key}
                    componentId={`${baseComponentId}.traces_table.column_toggle_button`}
                    checked={!hiddenColumns.includes(key)}
                    onClick={() => toggleHiddenColumn(key)}
                  >
                    <DropdownMenu.ItemIndicator />
                    {label}
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </TableRowAction>
        </TableRow>
        {loading && <TableSkeletonRows table={table} />}
        {!loading &&
          !error &&
          table
            .getRowModel()
            .rows.map((row) => (
              <TracesViewTableRow key={row.id} row={row} columns={columns} selected={rowSelection[row.id]} />
            ))}
      </Table>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTable.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTable.utils.ts

```typescript
import type { ColumnDef } from '@tanstack/react-table';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import type { Interpolation, Theme } from '@emotion/react';

export type TracesColumnDef = ColumnDef<ModelTraceInfoWithRunName> & {
  meta?: {
    styles?: Interpolation<Theme>;
    multiline?: boolean;
  };
};

export const getHeaderSizeClassName = (id: string) => `--header-${id}-size`;
export const getColumnSizeClassName = (id: string) => `--col-${id}-size`;
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableCellCheckbox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableCellCheckbox.tsx
Signals: React

```typescript
import React from 'react';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import type { Row } from '@tanstack/react-table';
import { Checkbox } from '@databricks/design-system';

type TracesViewCellCheckboxProps = {
  row: Row<ModelTraceInfoWithRunName>;
};

export const TracesViewTableCellCheckbox = ({ row }: TracesViewCellCheckboxProps) => {
  return (
    <Checkbox
      componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracesviewtablecellcheckbox.tsx_12"
      data-testid={`trace-table-cell-checkbox-${row.id}`}
      disabled={!row.getCanSelect()}
      isChecked={row.getIsSelected()}
      wrapperStyle={{ padding: 0, margin: 0 }}
      onChange={() => row.toggleSelected()}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableHeaderCheckbox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableHeaderCheckbox.tsx
Signals: React

```typescript
import React from 'react';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import type { Table } from '@tanstack/react-table';
import { Checkbox } from '@databricks/design-system';

type TracesViewTableCheckboxProps = {
  table: Table<ModelTraceInfoWithRunName>;
};

export const TracesViewTableHeaderCheckbox = ({ table }: TracesViewTableCheckboxProps) => {
  const isChecked = table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() ? null : false);

  return (
    <Checkbox
      componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracesviewtableheadercheckbox.tsx_14"
      data-testid="trace-table-header-checkbox"
      isChecked={isChecked}
      wrapperStyle={{ padding: 0, margin: 0 }}
      onChange={table.toggleAllRowsSelected}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTablePreviewCell.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTablePreviewCell.test.tsx

```typescript
import { describe, test, jest, expect } from '@jest/globals';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { render, screen } from '../../../common/utils/TestUtils.react18';
import { TracesViewTableResponsePreviewCell } from './TracesViewTablePreviewCell';
import { Table, TableCell, TableRow } from '@databricks/design-system';
import userEvent from '@testing-library/user-event';
import { MlflowService } from '../../sdk/MlflowService';

const shortValue = '{"test":"short"}';
const longValue = `{"model_input":[{"query":"What is featured in the last version of MLflow?"}],"system_prompt":"\\nYou are an assistant for Databricks users. You are answering python, coding, SQL, data engineering, spark, data science, DW and platform, API or infrastructure administration question related to Databricks. If the question is not related to one of these topics, kindly decline to answer. If you don't know the answer, just say that you don't know, don't try to make up an answer. Keep the answer as concise as possible.Use the following pieces of context to answer the question at the end:\\n","params":{"model_name":"databricks-dbrx-instruct","temperature":0.1,"max_tokens":1000}}`;
const longValueTruncated = `{"model_input":[{"query":"What is featured in the last version of MLflow?"}],"system_prompt":"\\nYou are an assistant for Databricks users. You are answering python, coding, SQL, data engineering, spark, data science, DW and platform, API or infrast...`;

const formattedLongValue = JSON.stringify(JSON.parse(longValue), null, 2);

describe('ExperimentViewTracesTablePreviewCell', () => {
  const renderTable = (value: string) => {
    const Component = () => {
      const table = useReactTable({
        columns: [
          {
            // @ts-expect-error [FEINF-4084] Type 'ColumnDefTemplate<CellContext<ModelTraceInfoWithRunName, unknown>>' is not assignable to type 'ColumnDefTemplate...
            cell: TracesViewTableResponsePreviewCell,
            id: 'test',
          },
        ],
        data: [
          {
            request_metadata: [{ key: 'mlflow.traceOutputs', value }],
            request_id: 'test_request_id',
          },
        ],
        getCoreRowModel: getCoreRowModel(),
      });

      return (
        <Table>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      );
    };

    render(<Component />);
  };

  test('it should expand short values and request more data', async () => {
    jest
      .spyOn(MlflowService, 'getExperimentTraceData')
      .mockImplementation(() => Promise.resolve({ response: longValue }));

    renderTable(longValueTruncated);
    expect(screen.queryByRole('button')).toBeInTheDocument();

    expect(screen.getByText(longValueTruncated)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));

    expect(MlflowService.getExperimentTraceData).toHaveBeenCalledWith('test_request_id');

    expect(document.body.textContent).toContain(formattedLongValue);

    await userEvent.click(screen.getByRole('button'));

    expect(document.body.textContent).not.toContain(formattedLongValue);
  });

  test('it should unescape non-ascii characters', async () => {
    jest
      .spyOn(MlflowService, 'getExperimentTraceData')
      .mockImplementation(() => Promise.resolve({ response: longValue }));

    const escapedJson = '{"model_input":"\\uD83D\\uDE42"}';
    const unescapedJson = '{"model_input":"🙂"}';
    renderTable(escapedJson);
    expect(screen.getByText(unescapedJson, { collapseWhitespace: false })).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTablePreviewCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTablePreviewCell.tsx
Signals: React

```typescript
import { Button, ChevronDownIcon, ChevronRightIcon, useDesignSystemTheme } from '@databricks/design-system';
import { isString } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { MlflowService } from '../../sdk/MlflowService';
import Utils from '../../../common/utils/Utils';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import type { CellContext, ColumnDefTemplate } from '@tanstack/react-table';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import { getTraceInfoInputs, getTraceInfoOutputs, isTraceMetadataPossiblyTruncated } from './TracesView.utils';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { css } from '@emotion/react';

const clampedLinesCss = css`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const TracesViewTablePreviewCell = ({
  value,
  traceId,
  previewFieldName,
}: {
  value: string;
  traceId: string;
  previewFieldName: 'request' | 'response';
}) => {
  const { theme } = useDesignSystemTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullData, setFullData] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const fetchFullData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await MlflowService.getExperimentTraceData<{
        request?: any;
        response?: any;
      }>(traceId);

      if (previewFieldName in response) {
        const previewValue = response[previewFieldName];
        const requestData = isString(previewValue) ? previewValue : JSON.stringify(previewValue);
        setFullData(requestData);
      }
    } catch (e: any) {
      const errorMessage = e instanceof ErrorWrapper ? e.getUserVisibleError() : e.message;
      Utils.logErrorAndNotifyUser(`Error fetching response: ${errorMessage}`);
    }
    setLoading(false);
  }, [previewFieldName, traceId]);

  const valuePossiblyTruncated = isTraceMetadataPossiblyTruncated(value);

  const expand = useCallback(async () => {
    if (!fullData && valuePossiblyTruncated) {
      await fetchFullData();
    }
    setIsExpanded(true);
  }, [fullData, fetchFullData, valuePossiblyTruncated]);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <div css={{ display: 'flex', gap: theme.spacing.xs }}>
      <Button
        // it's difficult to distinguish between run and experiment page
        // in this component due to how the data is passed to the table,
        // so the base component ID here is simply `mlflow.traces`
        componentId="mlflow.traces.traces_table.expand_cell_preview"
        size="small"
        icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        onClick={isExpanded ? collapse : expand}
        css={{ flexShrink: 0 }}
        loading={loading}
        type="primary"
      />
      <div
        title={value}
        css={[
          {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          !isExpanded && clampedLinesCss,
        ]}
      >
        {isExpanded ? <ExpandedParamCell value={fullData ?? value} /> : value}
      </div>
    </div>
  );
};

const ExpandedParamCell = ({ value }: { value: string }) => {
  const { theme } = useDesignSystemTheme();

  const structuredJSONValue = useMemo(() => {
    // Attempts to parse the value as JSON and returns a pretty printed version if successful.
    // If JSON structure is not found, returns null.
    try {
      const objectData = JSON.parse(value);
      return JSON.stringify(objectData, null, 2);
    } catch (e) {
      return null;
    }
  }, [value]);
  return (
    <div
      css={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: structuredJSONValue ? 'monospace' : undefined,
      }}
    >
      <CodeSnippet
        language="json"
        wrapLongLines
        style={{
          padding: theme.spacing.sm,
        }}
        theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
      >
        {structuredJSONValue || value}
      </CodeSnippet>
    </div>
  );
};

export const TracesViewTableRequestPreviewCell: ColumnDefTemplate<CellContext<ModelTraceInfoWithRunName, unknown>> = ({
  row: { original },
}) => (
  <TracesViewTablePreviewCell
    previewFieldName="request"
    traceId={original.request_id || ''}
    value={getTraceInfoInputs(original) || ''}
  />
);

export const TracesViewTableResponsePreviewCell: ColumnDefTemplate<CellContext<ModelTraceInfoWithRunName, unknown>> = ({
  row: { original },
}) => (
  <TracesViewTablePreviewCell
    previewFieldName="response"
    traceId={original.request_id || ''}
    value={getTraceInfoOutputs(original) || ''}
  />
);
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableRow.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableRow.tsx
Signals: React

```typescript
import React from 'react';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useDesignSystemTheme } from '@databricks/design-system';
import type { TracesColumnDef } from './TracesViewTable.utils';
import { getColumnSizeClassName } from './TracesViewTable.utils';
import { TRACE_TABLE_CHECKBOX_COLUMN_ID } from './TracesView.utils';
import { isEqual } from 'lodash';

type TracesViewTableRowProps = {
  row: Row<ModelTraceInfoWithRunName>;
  // used only for memoization updates
  selected: boolean;
  columns: TracesColumnDef[];
};

export const TracesViewTableRow = React.memo(
  ({ row }: TracesViewTableRowProps) => {
    const { theme } = useDesignSystemTheme();

    return (
      <div
        role="row"
        key={row.id}
        data-testid="endpoints-list-table-rows"
        css={{
          minHeight: theme.general.buttonHeight,
          display: 'flex',
          flexDirection: 'row',
          ':hover': {
            backgroundColor: 'var(--table-row-hover)',
          },
          paddingRight: '32px', // width of the column selector defined in TableRowActionStyles
          borderBottom: `1px solid var(--table-separator-color)`,
        }}
      >
        {row.getAllCells().map((cell) => {
          const multiline = (cell.column.columnDef as TracesColumnDef).meta?.multiline;
          const isSelect = cell.column.id === TRACE_TABLE_CHECKBOX_COLUMN_ID;
          const padding = isSelect ? theme.spacing.sm : `${theme.spacing.sm}px ${theme.spacing.xs}px`;

          return (
            <div
              role="cell"
              css={[
                {
                  '--table-row-vertical-padding': `${theme.spacing.sm}px`,
                  flex: `calc(var(${getColumnSizeClassName(cell.column.id)}) / 100)`,
                  overflow: 'hidden',
                  whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
                  textOverflow: multiline ? 'ellipsis' : undefined,
                  padding,
                },
                (cell.column.columnDef as TracesColumnDef).meta?.styles,
              ]}
              key={cell.id}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        })}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.columns === next.columns &&
      prev.selected === next.selected &&
      isEqual(prev.row.original.tags, next.row.original.tags)
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableSourceCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableSourceCell.tsx

```typescript
import type { CellContext, ColumnDefTemplate } from '@tanstack/react-table';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import { keyBy } from 'lodash';
import { SourceCellRenderer } from '../experiment-page/components/runs/cells/SourceCellRenderer';

export const TracesViewTableSourceCell: ColumnDefTemplate<CellContext<ModelTraceInfoWithRunName, unknown>> = ({
  row: { original },
}) => <SourceCellRenderer value={keyBy(original.tags, 'key')} />;
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableStatusCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableStatusCell.tsx

```typescript
import type { CellContext, ColumnDefTemplate } from '@tanstack/react-table';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import { CheckCircleIcon, ClockIcon, XCircleIcon, useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentViewTracesStatusLabels } from './TracesView.utils';
import { useIntl } from 'react-intl';
import type { Theme } from '@emotion/react';

const getIcon = (status: ModelTraceInfoWithRunName['status'], theme: Theme) => {
  if (status === 'IN_PROGRESS') {
    return <ClockIcon css={{ color: theme.colors.textValidationWarning }} />;
  }

  if (status === 'OK') {
    return <CheckCircleIcon css={{ color: theme.colors.textValidationSuccess }} />;
  }

  if (status === 'ERROR') {
    return <XCircleIcon css={{ color: theme.colors.textValidationDanger }} />;
  }

  return null;
};

export const TracesViewTableStatusCell: ColumnDefTemplate<CellContext<ModelTraceInfoWithRunName, unknown>> = ({
  row: { original },
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const labelDescriptor = ExperimentViewTracesStatusLabels[original.status || 'UNSET'];

  return (
    <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
      {getIcon(original.status, theme)}
      {labelDescriptor ? intl.formatMessage(labelDescriptor) : ''}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableTagCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableTagCell.tsx

```typescript
import { Button, PencilIcon, SpeechBubblePlusIcon, useDesignSystemTheme } from '@databricks/design-system';
import { MLFLOW_INTERNAL_PREFIX } from '../../../common/utils/TagUtils';
import { KeyValueTag } from '../../../common/components/KeyValueTag';
import { FormattedMessage } from 'react-intl';

export const TracesViewTableTagCell = ({
  onAddEditTags,
  tags,
  baseComponentId,
}: {
  tags: { key: string; value: string }[];
  onAddEditTags: () => void;
  baseComponentId: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const visibleTagList = tags?.filter(({ key }) => key && !key.startsWith(MLFLOW_INTERNAL_PREFIX)) || [];
  const containsTags = visibleTagList.length > 0;
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: theme.spacing.xs,
        rowGap: theme.spacing.xs,
      }}
    >
      {visibleTagList.map((tag) => (
        <KeyValueTag
          key={tag.key}
          tag={tag}
          css={{ marginRight: 0 }}
          charLimit={20}
          maxWidth={150}
          enableFullViewModal
        />
      ))}{' '}
      <Button
        componentId={`${baseComponentId}.traces_table.edit_tag`}
        size="small"
        icon={!containsTags ? undefined : <PencilIcon />}
        onClick={onAddEditTags}
        children={
          !containsTags ? (
            <FormattedMessage
              defaultMessage="Add tags"
              description="Button text to add tags to a trace in the experiment traces table"
            />
          ) : undefined
        }
        css={{
          flexShrink: 0,
          opacity: 0,
          '[role=row]:hover &': {
            opacity: 1,
          },
          '[role=row]:focus-within &': {
            opacity: 1,
          },
        }}
        type="tertiary"
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTableTimestampCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTableTimestampCell.tsx
Signals: React

```typescript
import type { CellContext, ColumnDefTemplate } from '@tanstack/react-table';
import React from 'react';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';
import { Tooltip } from '@databricks/design-system';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';

export const TracesViewTableTimestampCell: ColumnDefTemplate<CellContext<ModelTraceInfoWithRunName, unknown>> =
  React.memo(
    ({ row: { original } }) => {
      if (!original.timestamp_ms) {
        return null;
      }
      return (
        <Tooltip
          componentId="mlflow.experiment-tracking.traces-timestamp.display"
          content={new Date(original.timestamp_ms).toLocaleString(navigator.language, {
            timeZoneName: 'short',
          })}
          side="right"
        >
          <span>{Utils.timeSinceStr(original.timestamp_ms)}</span>
        </Tooltip>
      );
    },
    () => true,
  );
```

--------------------------------------------------------------------------------

````

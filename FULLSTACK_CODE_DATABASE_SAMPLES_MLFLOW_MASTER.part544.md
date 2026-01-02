---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 544
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 544 of 991)

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

---[FILE: ExperimentEvaluationDatasetRecordsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetRecordsTable.tsx
Signals: React

```typescript
import { useState, useMemo, useEffect } from 'react';
import { useGetDatasetRecords } from '../hooks/useGetDatasetRecords';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import { Empty, TableCell, TableHeader, TableRow, TableSkeletonRows } from '@databricks/design-system';
import { Table } from '@databricks/design-system';
import { useIntl } from 'react-intl';
import { JsonCell } from './ExperimentEvaluationDatasetJsonCell';
import { ExperimentEvaluationDatasetRecordsToolbar } from './ExperimentEvaluationDatasetRecordsToolbar';
import type { EvaluationDataset, EvaluationDatasetRecord } from '../types';
import { useInfiniteScrollFetch } from '../hooks/useInfiniteScrollFetch';

const INPUTS_COLUMN_ID = 'inputs';
const OUTPUTS_COLUMN_ID = 'outputs';
const EXPECTATIONS_COLUMN_ID = 'expectations';

const columns: ColumnDef<EvaluationDatasetRecord, string>[] = [
  {
    id: INPUTS_COLUMN_ID,
    accessorKey: 'inputs',
    header: 'Inputs',
    enableResizing: false,
    cell: JsonCell,
  },
  {
    id: OUTPUTS_COLUMN_ID,
    accessorKey: 'outputs',
    header: 'Outputs',
    enableResizing: false,
    cell: JsonCell,
  },
  {
    id: EXPECTATIONS_COLUMN_ID,
    accessorKey: 'expectations',
    header: 'Expectations',
    enableResizing: false,
    cell: JsonCell,
  },
];

export const ExperimentEvaluationDatasetRecordsTable = ({ dataset }: { dataset: EvaluationDataset }) => {
  const intl = useIntl();
  const datasetId = dataset.dataset_id;

  const [rowSize, setRowSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [searchFilter, setSearchFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    [INPUTS_COLUMN_ID]: true,
    [OUTPUTS_COLUMN_ID]: false,
    [EXPECTATIONS_COLUMN_ID]: true,
  });

  const {
    data: datasetRecords,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
  } = useGetDatasetRecords({
    datasetId: datasetId ?? '',
    enabled: !!datasetId,
  });

  const fetchMoreOnBottomReached = useInfiniteScrollFetch({
    isFetching,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
  });

  // Filter records based on search term
  const filteredRecords = useMemo(() => {
    if (!searchFilter.trim()) {
      return datasetRecords ?? [];
    }

    const searchTerm = searchFilter.toLowerCase();
    return (datasetRecords ?? []).filter((record) => {
      // Search in inputs
      const inputsString = JSON.stringify(record.inputs || {}).toLowerCase();
      if (inputsString.includes(searchTerm)) return true;

      // Search in expectations
      const expectationsString = JSON.stringify(record.expectations || {}).toLowerCase();
      if (expectationsString.includes(searchTerm)) return true;

      return false;
    });
  }, [datasetRecords, searchFilter]);

  // Auto-fetch more records when filtering reduces visible results but more pages exist.
  // This ensures we keep loading until we find matching records or exhaust all pages.
  // TODO: Implement table virtualization to improve performance with large datasets.
  useEffect(() => {
    if (!searchFilter.trim() || isFetching || !hasNextPage) {
      return;
    }

    // Threshold based on row size - smaller rows show more records, so need higher threshold
    const minResultsThreshold = rowSize === 'sm' ? 20 : rowSize === 'md' ? 10 : 5;
    if (filteredRecords.length < minResultsThreshold) {
      fetchNextPage();
    }
  }, [filteredRecords.length, searchFilter, isFetching, hasNextPage, fetchNextPage, rowSize]);

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetRecordsTable.tsx',
    {
      columns,
      data: filteredRecords,
      getCoreRowModel: getCoreRowModel(),
      getRowId: (row) => row.dataset_record_id,
      enableColumnResizing: false,
      meta: { rowSize, searchFilter },
      state: {
        columnVisibility,
      },
    },
  );

  return (
    <div
      css={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ExperimentEvaluationDatasetRecordsToolbar
        dataset={dataset}
        datasetRecords={datasetRecords ?? []}
        columns={columns}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        rowSize={rowSize}
        setRowSize={setRowSize}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      <Table
        css={{ flex: 1 }}
        empty={
          !isLoading && table.getRowModel().rows.length === 0 ? (
            <Empty
              description={intl.formatMessage({
                defaultMessage: 'No records found',
                description: 'Empty state for the evaluation dataset records table',
              })}
            />
          ) : undefined
        }
        scrollable
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement)}
      >
        <TableRow isHeader>
          {table.getLeafHeaders().map(
            (header) =>
              header.column.getIsVisible() && (
                <TableHeader
                  key={header.id}
                  componentId="mlflow.eval-dataset-records.column-header"
                  header={header}
                  column={header.column}
                  css={{ position: 'sticky', top: 0, zIndex: 1 }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeader>
              ),
          )}
        </TableRow>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
        {(isLoading || isFetching) && <TableSkeletonRows table={table} />}
      </Table>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetRecordsToolbar.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetRecordsToolbar.tsx

```typescript
import {
  Button,
  ColumnsIcon,
  DropdownMenu,
  Input,
  RowsIcon,
  SearchIcon,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { FormattedMessage } from 'react-intl';
import type { EvaluationDataset, EvaluationDatasetRecord } from '../types';
import { parseJSONSafe } from '@mlflow/mlflow/src/common/utils/TagUtils';

const getTotalRecordsCount = (profile: string | undefined): number | undefined => {
  if (!profile) {
    return undefined;
  }

  const profileJson = parseJSONSafe(profile);
  return profileJson?.num_records ?? undefined;
};

export const ExperimentEvaluationDatasetRecordsToolbar = ({
  dataset,
  datasetRecords,
  columns,
  columnVisibility,
  setColumnVisibility,
  rowSize,
  setRowSize,
  searchFilter,
  setSearchFilter,
}: {
  dataset: EvaluationDataset;
  datasetRecords: EvaluationDatasetRecord[];
  columns: ColumnDef<EvaluationDatasetRecord, any>[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
  rowSize: 'sm' | 'md' | 'lg';
  setRowSize: (rowSize: 'sm' | 'md' | 'lg') => void;
  searchFilter: string;
  setSearchFilter: (searchFilter: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const datasetName = dataset?.name;
  const profile = dataset?.profile;
  const totalRecordsCount = getTotalRecordsCount(profile);
  const loadedRecordsCount = datasetRecords.length;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: theme.spacing.sm,
            paddingRight: theme.spacing.sm,
          }}
        >
          <Typography.Title level={3} withoutMargins>
            {datasetName}
          </Typography.Title>
          <Typography.Text color="secondary" size="sm">
            <FormattedMessage
              defaultMessage="Displaying {loadedRecordsCount} of {totalRecordsCount, plural, =1 {1 record} other {# records}}"
              description="Label for the number of records displayed"
              values={{ loadedRecordsCount: loadedRecordsCount ?? 0, totalRecordsCount: totalRecordsCount ?? 0 }}
            />
          </Typography.Text>
        </div>
        <div css={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.xs }}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button componentId="mlflow.eval-datasets.records-toolbar.row-size-toggle" icon={<RowsIcon />} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.RadioGroup
                componentId="mlflow.eval-datasets.records-toolbar.row-size-radio"
                value={rowSize}
                onValueChange={(value) => setRowSize(value as 'sm' | 'md' | 'lg')}
              >
                <DropdownMenu.Label>
                  <Typography.Text color="secondary">
                    <FormattedMessage defaultMessage="Row height" description="Label for the row height radio group" />
                  </Typography.Text>
                </DropdownMenu.Label>
                <DropdownMenu.RadioItem key="sm" value="sm">
                  <DropdownMenu.ItemIndicator />
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Small" description="Small row size" />
                  </Typography.Text>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem key="md" value="md">
                  <DropdownMenu.ItemIndicator />
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Medium" description="Medium row size" />
                  </Typography.Text>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem key="lg" value="lg">
                  <DropdownMenu.ItemIndicator />
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Large" description="Large row size" />
                  </Typography.Text>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button componentId="mlflow.eval-datasets.records-toolbar.columns-toggle" icon={<ColumnsIcon />} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {columns.map((column) => (
                <DropdownMenu.CheckboxItem
                  componentId="mlflow.eval-datasets.records-toolbar.column-checkbox"
                  key={column.id}
                  checked={columnVisibility[column.id ?? ''] ?? false}
                  onCheckedChange={(checked) =>
                    setColumnVisibility({
                      ...columnVisibility,
                      [column.id ?? '']: checked,
                    })
                  }
                >
                  <DropdownMenu.ItemIndicator />
                  <Typography.Text>{column.header}</Typography.Text>
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      <div
        css={{
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.sm,
        }}
      >
        <Input
          componentId="mlflow.eval-datasets.records-toolbar.search-input"
          prefix={<SearchIcon />}
          placeholder="Search inputs and expectations"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          css={{ maxWidth: '540px', flex: 1 }}
        />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsActionsCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsActionsCell.tsx
Signals: React

```typescript
import { DropdownMenu, OverflowIcon, Spinner, TableRowAction, TrashIcon } from '@databricks/design-system';
import { Button } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import type { Row } from '@tanstack/react-table';
import type { EvaluationDataset } from '../types';
import { SEARCH_EVALUATION_DATASETS_QUERY_KEY } from '../constants';
import { useDeleteEvaluationDatasetMutation } from '../hooks/useDeleteEvaluationDatasetMutation';
import { useQueryClient } from '@databricks/web-shared/query-client';
import { useCallback } from 'react';

// Component for rendering dataset actions
export const ActionsCell = ({ row }: { row: Row<EvaluationDataset> }) => {
  const queryClient = useQueryClient();

  const { deleteEvaluationDatasetMutation, isLoading: isDeletingDataset } = useDeleteEvaluationDatasetMutation({
    onSuccess: () => {
      // invalidate the datasets query
      queryClient.invalidateQueries({ queryKey: [SEARCH_EVALUATION_DATASETS_QUERY_KEY] });
    },
  });

  const handleDelete = useCallback(() => {
    deleteEvaluationDatasetMutation({ datasetId: row.original.dataset_id });
  }, [deleteEvaluationDatasetMutation, row]);

  return (
    <TableRowAction css={{ padding: 0 }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            componentId="mlflow.eval-datasets.dataset-actions-menu"
            size="small"
            icon={<OverflowIcon />}
            aria-label="Dataset actions"
            css={{ padding: '4px' }}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            componentId="mlflow.eval-datasets.delete-dataset-menu-option"
            disabled={isDeletingDataset}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete();
            }}
          >
            <DropdownMenu.IconWrapper>
              <TrashIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage defaultMessage="Delete dataset" description="Delete evaluation dataset menu item" />
            {isDeletingDataset && (
              <DropdownMenu.HintColumn>
                <Spinner />
              </DropdownMenu.HintColumn>
            )}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </TableRowAction>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsEmptyState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsEmptyState.tsx

```typescript
import { Empty, Typography, useDesignSystemTheme } from '@databricks/design-system';
import datasetsEmptyImg from '@mlflow/mlflow/src/common/static/eval-datasets-empty.svg';
import { FormattedMessage } from 'react-intl';
import { CreateEvaluationDatasetButton } from './CreateEvaluationDatasetButton';

export const ExperimentEvaluationDatasetsEmptyState = ({ experimentId }: { experimentId: string }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.md,
      }}
    >
      <Typography.Title level={3} color="secondary">
        <FormattedMessage
          defaultMessage="Create an evaluation dataset"
          description="Evaluation datasets empty state title"
        />
      </Typography.Title>
      <Typography.Paragraph color="secondary" css={{ maxWidth: 600 }}>
        <FormattedMessage
          defaultMessage="Create evaluation datasets in order to iteratively evaluate and improve your app. For example, build a dataset from production traces with negative feedback. {learnMoreLink}"
          description="Description for a quickstart guide on MLflow evaluation datasets"
          values={{
            learnMoreLink: (
              <Typography.Link
                componentId="mlflow.eval-datasets.learn-more-link"
                href="https://mlflow.org/docs/latest/genai/datasets/"
                openInNewTab
              >
                <FormattedMessage defaultMessage="Learn more" description="Learn more link text" />
              </Typography.Link>
            ),
          }}
        />
      </Typography.Paragraph>
      <img
        css={{ marginBottom: theme.spacing.md, maxWidth: 'min(100%, 600px)' }}
        src={datasetsEmptyImg}
        alt="No datasets found"
      />
      <CreateEvaluationDatasetButton experimentId={experimentId} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsIdCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsIdCell.tsx
Signals: React

```typescript
import React from 'react';
import { Tag, Tooltip } from '@databricks/design-system';
import type { Row } from '@tanstack/react-table';
import { useCopyController } from '@databricks/web-shared/copy';
import type { EvaluationDataset } from '../types';

export const DatasetIdCell = ({ row }: { row: Row<EvaluationDataset> }) => {
  const datasetId = row.original.dataset_id;
  const { copy, tooltipOpen, tooltipMessage, handleTooltipOpenChange } = useCopyController(datasetId, 'Click to copy');

  return (
    <Tooltip
      content={tooltipMessage}
      open={tooltipOpen}
      onOpenChange={handleTooltipOpenChange}
      componentId="mlflow.eval-datasets.dataset-id-tooltip"
    >
      <Tag
        css={{ width: 'fit-content', maxWidth: '100%', cursor: 'pointer' }}
        componentId="mlflow.eval-datasets.dataset-id"
        color="indigo"
        onClick={copy}
      >
        <span
          css={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {datasetId}
        </span>
      </Tag>
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsLastUpdatedCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsLastUpdatedCell.tsx

```typescript
import { Tooltip } from '@databricks/design-system';
import type { Row } from '@tanstack/react-table';
import type { EvaluationDataset } from '../types';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';

export const LastUpdatedCell = ({ row }: { row: Row<EvaluationDataset> }) => {
  return row.original.last_update_time ? (
    <Tooltip
      content={new Date(row.original.last_update_time).toLocaleString()}
      componentId="mlflow.eval-datasets.last-updated-cell-tooltip"
    >
      <span>{Utils.timeSinceStr(row.original.last_update_time)}</span>
    </Tooltip>
  ) : (
    <span>-</span>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsListTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsListTable.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import {
  Empty,
  Table,
  TableHeader,
  TableRow,
  TableSkeletonRows,
  Input,
  Button,
  RefreshIcon,
  useDesignSystemTheme,
  SearchIcon,
  TableCell,
  ColumnsIcon,
  DropdownMenu,
  Typography,
} from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';
import type { ColumnDef, Row, SortDirection, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import type { EvaluationDataset } from '../types';
import { NameCell } from './ExperimentEvaluationDatasetsNameCell';
import { LastUpdatedCell } from './ExperimentEvaluationDatasetsLastUpdatedCell';
import { ActionsCell } from './ExperimentEvaluationDatasetsActionsCell';
import { DatasetIdCell } from './ExperimentEvaluationDatasetsIdCell';
import { isEqual } from 'lodash';
import { useInfiniteScrollFetch } from '../hooks/useInfiniteScrollFetch';
import { CreateEvaluationDatasetButton } from './CreateEvaluationDatasetButton';

const COLUMN_IDS = {
  DATASET_ID: 'dataset_id',
  NAME: 'name',
  LAST_UPDATE_TIME: 'last_update_time',
  CREATED_TIME: 'created_time',
  CREATED_BY: 'created_by',
  SOURCE_TYPE: 'source_type',
  ACTIONS: 'actions',
};

const DEFAULT_ENABLED_COLUMN_IDS = [
  COLUMN_IDS.DATASET_ID,
  COLUMN_IDS.NAME,
  COLUMN_IDS.LAST_UPDATE_TIME,
  COLUMN_IDS.ACTIONS,
];
const UNSELECTABLE_COLUMN_IDS = [COLUMN_IDS.ACTIONS];

const columns: ColumnDef<EvaluationDataset, any>[] = [
  {
    id: COLUMN_IDS.DATASET_ID,
    accessorKey: 'dataset_id',
    header: 'Dataset ID',
    enableSorting: false,
    cell: DatasetIdCell,
  },
  {
    id: COLUMN_IDS.NAME,
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: NameCell,
  },
  {
    id: COLUMN_IDS.LAST_UPDATE_TIME,
    accessorKey: 'last_update_time',
    accessorFn: (row: EvaluationDataset) => (row.last_update_time ? new Date(row.last_update_time).getTime() : 0),
    header: 'Updated At',
    enableSorting: true,
    size: 150,
    maxSize: 150,
    cell: LastUpdatedCell,
  },
  {
    id: COLUMN_IDS.CREATED_TIME,
    accessorKey: 'created_time',
    accessorFn: (row: EvaluationDataset) => (row.created_time ? new Date(row.created_time).getTime() : 0),
    header: 'Created At',
    enableSorting: true,
    cell: ({ row }: { row: Row<EvaluationDataset> }) => new Date(row.original.created_time).toLocaleString(),
  },
  {
    id: COLUMN_IDS.CREATED_BY,
    accessorKey: 'created_by',
    header: 'Created By',
    enableSorting: true,
  },
  {
    id: COLUMN_IDS.SOURCE_TYPE,
    accessorKey: 'source_type',
    header: 'Source Type',
    enableSorting: true,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    size: 36,
    maxSize: 36,
    cell: ActionsCell,
  },
];

interface ExperimentEvaluationDatasetsTableRowProps {
  row: Row<EvaluationDataset>;
  columnVisibility: { [key: string]: boolean };
  isActive: boolean;
  onSelectDataset: (dataset: EvaluationDataset) => void;
}

const ExperimentEvaluationDatasetsTableRow: React.FC<
  React.PropsWithChildren<ExperimentEvaluationDatasetsTableRowProps>
> = React.memo(
  ({ row, isActive, onSelectDataset }) => {
    const { theme } = useDesignSystemTheme();

    return (
      <TableRow key={row.id} className="eval-datasets-table-row" onClick={() => onSelectDataset(row.original)}>
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            css={{
              backgroundColor: isActive ? theme.colors.actionDefaultBackgroundHover : 'transparent',
              width: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : 'auto',
              maxWidth: cell.column.columnDef.maxSize ? `${cell.column.columnDef.maxSize}px` : 'auto',
              minWidth: cell.column.columnDef.minSize ? `${cell.column.columnDef.minSize}px` : 'auto',
              ...(cell.column.id === 'actions' && { paddingLeft: 0, paddingRight: 0 }),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  },
  (prev, next) => {
    return prev.isActive === next.isActive && isEqual(prev.columnVisibility, next.columnVisibility);
  },
);

export const ExperimentEvaluationDatasetsListTable = ({
  experimentId,
  datasets,
  isLoading,
  isFetching,
  error,
  refetch,
  fetchNextPage,
  hasNextPage,
  selectedDatasetId,
  setSelectedDatasetId,
  searchFilter,
  setSearchFilter,
}: {
  experimentId: string;
  datasets: EvaluationDataset[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  selectedDatasetId?: string;
  setSelectedDatasetId: (datasetId: string | undefined) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'created_time',
      desc: true, // Most recent first
    },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>(
    columns.reduce((acc, column) => {
      acc[column.id ?? ''] = DEFAULT_ENABLED_COLUMN_IDS.includes(column.id ?? '');
      return acc;
    }, {} as { [key: string]: boolean }),
  );
  // Control field that gets updated immediately
  const [internalSearchFilter, setInternalSearchFilter] = useState(searchFilter);

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsListTable.tsx',
    {
      columns,
      data: datasets ?? [],
      getCoreRowModel: getCoreRowModel(),
      getRowId: (row) => row.dataset_id,
      enableSorting: true,
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      enableColumnResizing: false,
      state: {
        sorting,
        columnVisibility,
      },
    },
  );

  const fetchMoreOnBottomReached = useInfiniteScrollFetch({
    isFetching,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
  });

  if (error) {
    return <div>Error loading datasets</div>;
  }

  return (
    <div css={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <Input
          allowClear
          placeholder="Search by dataset name"
          value={internalSearchFilter}
          onChange={(e) => {
            setInternalSearchFilter(e.target.value);
            if (!e.target.value) {
              setSearchFilter(e.target.value);
            }
          }}
          onClear={() => {
            setInternalSearchFilter('');
            setSearchFilter('');
          }}
          onPressEnter={() => setSearchFilter(internalSearchFilter)}
          componentId="mlflow.eval-datasets.search-input"
          css={{ flex: 1 }}
          prefix={<SearchIcon />}
        />
        <div css={{ display: 'flex', alignItems: 'center', marginRight: theme.spacing.sm }}>
          <Button
            icon={<RefreshIcon />}
            disabled={isFetching}
            onClick={() => refetch()}
            componentId="mlflow.eval-datasets.table-refresh-button"
          />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button icon={<ColumnsIcon />} componentId="mlflow.eval-datasets.table-column-selector-button" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {columns.map(
                (column) =>
                  !UNSELECTABLE_COLUMN_IDS.includes(column.id ?? '') && (
                    <DropdownMenu.CheckboxItem
                      componentId="mlflow.eval-datasets.table-column-selector-checkbox"
                      key={column.id ?? ''}
                      checked={columnVisibility[column.id ?? ''] ?? false}
                      onCheckedChange={(checked) =>
                        setColumnVisibility({
                          ...columnVisibility,
                          [column.id ?? '']: checked,
                        })
                      }
                    >
                      <DropdownMenu.ItemIndicator />
                      <Typography.Text>{column.header}</Typography.Text>
                    </DropdownMenu.CheckboxItem>
                  ),
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      <CreateEvaluationDatasetButton experimentId={experimentId} />
      <div css={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Table
          css={{ height: '100%' }}
          empty={
            !isLoading && !isFetching && datasets.length === 0 ? (
              <Empty
                description={intl.formatMessage({
                  defaultMessage: 'No evaluation datasets found',
                  description: 'Empty state for the evaluation datasets page',
                })}
              />
            ) : undefined
          }
          onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement)}
          scrollable
        >
          <TableRow isHeader>
            {table.getLeafHeaders().map((header) => (
              <TableHeader
                key={header.id}
                sortable={header.column.getCanSort()}
                sortDirection={header.column.getIsSorted() as SortDirection}
                onToggleSort={header.column.getToggleSortingHandler()}
                componentId="mlflow.eval-datasets.column-header"
                header={header}
                column={header.column}
                css={{
                  width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto',
                  maxWidth: header.column.columnDef.maxSize ? `${header.column.columnDef.maxSize}px` : 'auto',
                  minWidth: header.column.columnDef.minSize ? `${header.column.columnDef.minSize}px` : 'auto',
                  cursor: header.column.getCanSort() ? 'pointer' : 'default',
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>

          {!isLoading &&
            table
              .getRowModel()
              .rows.map((row) => (
                <ExperimentEvaluationDatasetsTableRow
                  key={row.id}
                  row={row}
                  columnVisibility={columnVisibility}
                  isActive={row.original.dataset_id === selectedDatasetId}
                  onSelectDataset={(dataset) => setSelectedDatasetId(dataset.dataset_id)}
                />
              ))}

          {(isLoading || isFetching) && <TableSkeletonRows table={table} />}
        </Table>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsNameCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetsNameCell.tsx

```typescript
import { Typography } from '@databricks/design-system';
import { useDesignSystemTheme } from '@databricks/design-system';
import type { Row } from '@tanstack/react-table';
import type { EvaluationDataset } from '../types';

export const NameCell = ({ row }: { row: Row<EvaluationDataset> }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div css={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
      <Typography.Link
        css={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 1 }}
        componentId="mlflow.eval-datasets.dataset-name-cell"
      >
        {row.original.name}
      </Typography.Link>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExportTracesToDatasetModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExportTracesToDatasetModal.tsx
Signals: React

```typescript
import {
  Empty,
  Input,
  Modal,
  SearchIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableRowSelectCell,
  TableSkeletonRows,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import { FormattedMessage } from 'react-intl';
import { useInfiniteScrollFetch } from '../hooks/useInfiniteScrollFetch';
import { useSearchEvaluationDatasets } from '../hooks/useSearchEvaluationDatasets';
import type { EvaluationDataset } from '../types';
import { useCallback, useState } from 'react';
import { getModelTraceId } from '@databricks/web-shared/model-trace-explorer';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import { compact } from 'lodash';
import { extractDatasetInfoFromTraces } from '../utils/datasetUtils';
import { useUpsertDatasetRecordsMutation } from '../hooks/useUpsertDatasetRecordsMutation';
import { CreateEvaluationDatasetButton } from './CreateEvaluationDatasetButton';
import { useFetchTraces } from '../hooks/useFetchTraces';

const columns: ColumnDef<EvaluationDataset, string>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
];

export const ExportTracesToDatasetModal = ({
  experimentId,
  visible,
  setVisible,
  selectedTraceInfos,
}: {
  experimentId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selectedTraceInfos: ModelTrace['info'][];
}) => {
  const { theme } = useDesignSystemTheme();
  const [searchFilter, setSearchFilter] = useState('');
  const [internalSearchFilter, setInternalSearchFilter] = useState(searchFilter);

  const traceIds = selectedTraceInfos.map((traceInfo) =>
    // hacky wrap just to get the id, as this util function expects
    // the full trace, which is not available in the trace table
    getModelTraceId({ info: traceInfo, data: { spans: [] } }),
  );
  const { data: traces, isLoading: isLoadingTraces } = useFetchTraces({ traceIds });
  const datasetRowsToExport = extractDatasetInfoFromTraces(compact(traces));

  const {
    data: datasets,
    isLoading: isLoadingDatasets,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useSearchEvaluationDatasets({ experimentId, nameFilter: searchFilter });

  const isInitialLoading = isLoadingDatasets || isLoadingTraces;

  const fetchMoreOnBottomReached = useInfiniteScrollFetch({
    isFetching,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
  });

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExportTracesToDatasetModal.tsx',
    {
      columns,
      getRowId: (row) => row.dataset_id,
      data: datasets ?? [],
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: false,
    },
  );

  const selectedDatasets = table.getSelectedRowModel().rows.map((row) => row.original);

  const { upsertDatasetRecordsMutation, isLoading: isUpsertingDatasetRecords } = useUpsertDatasetRecordsMutation({
    onSuccess: () => {
      setVisible(false);
    },
  });

  const handleExport = useCallback(() => {
    Promise.all(
      selectedDatasets.map((dataset) =>
        upsertDatasetRecordsMutation({
          datasetId: dataset.dataset_id,
          records: JSON.stringify(datasetRowsToExport),
        }),
      ),
    );
  }, [selectedDatasets, upsertDatasetRecordsMutation, datasetRowsToExport]);

  return (
    <Modal
      componentId="mlflow.export-traces-to-dataset-modal"
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={<FormattedMessage defaultMessage="Export" description="Export traces to dataset modal action button" />}
      okButtonProps={{
        disabled: isLoadingTraces || selectedDatasets.length === 0,
        loading: isUpsertingDatasetRecords,
      }}
      onOk={handleExport}
      title={
        <FormattedMessage
          defaultMessage="Export traces to datasets"
          description="Export traces to dataset modal title"
        />
      }
    >
      <div css={{ height: '500px', overflow: 'hidden' }}>
        <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center', marginBottom: theme.spacing.sm }}>
          <Input
            allowClear
            placeholder="Search by dataset name"
            value={internalSearchFilter}
            onChange={(e) => {
              setInternalSearchFilter(e.target.value);
              if (!e.target.value) {
                setSearchFilter(e.target.value);
              }
            }}
            onClear={() => {
              setInternalSearchFilter('');
              setSearchFilter('');
            }}
            onPressEnter={() => setSearchFilter(internalSearchFilter)}
            componentId="mlflow.eval-datasets.search-input"
            css={{ flex: 1 }}
            prefix={<SearchIcon />}
          />
          <CreateEvaluationDatasetButton experimentId={experimentId} />
        </div>
        <Table
          scrollable
          onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget as HTMLDivElement)}
          someRowsSelected={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
          empty={
            !isLoadingDatasets &&
            !isFetching &&
            datasets.length === 0 && (
              <Empty
                description={
                  <FormattedMessage
                    defaultMessage="No evaluation datasets found"
                    description="Empty state for the evaluation datasets page"
                  />
                }
              />
            )
          }
        >
          <TableRow isHeader>
            <TableRowSelectCell
              componentId="mlflow.export-traces-to-dataset-modal.header-checkbox"
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
            {table.getLeafHeaders().map((header) => (
              <TableHeader
                key={header.id}
                componentId="mlflow.eval-datasets.column-header"
                header={header}
                column={header.column}
                css={{ width: header.column.columnDef.size, maxWidth: header.column.columnDef.maxSize }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>
          {!isInitialLoading &&
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                <div>
                  <TableRowSelectCell
                    componentId="mlflow.export-traces-to-dataset-modal.row-checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </div>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    css={{ width: cell.column.columnDef.size, maxWidth: cell.column.columnDef.maxSize }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {(isInitialLoading || isFetching) && <TableSkeletonRows table={table} />}
        </Table>
      </div>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

````

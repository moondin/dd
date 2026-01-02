---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 613
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 613 of 991)

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

---[FILE: GenAiTracesTableBodyRows.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTableBodyRows.tsx
Signals: React

```typescript
import { flexRender } from '@tanstack/react-table';
import type { Cell, Row, RowSelectionState } from '@tanstack/react-table';
import type { VirtualItem } from '@tanstack/react-virtual';
import React from 'react';

import { TableCell, TableRow, TableRowSelectCell, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import type { TracesTableColumn, EvalTraceComparisonEntry } from './types';
import { escapeCssSpecialCharacters } from './utils/DisplayUtils';

interface GenAiTracesTableBodyRowsProps {
  rows: Row<EvalTraceComparisonEntry>[];
  isComparing: boolean;
  enableRowSelection?: boolean;
  virtualItems: VirtualItem<Element>[];
  virtualizerTotalSize: number;
  virtualizerMeasureElement: (node: HTMLDivElement | null) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  rowSelectionState: RowSelectionState | undefined;
  selectedColumns: TracesTableColumn[];
}

export const GenAiTracesTableBodyRows = React.memo(
  ({
    rows,
    isComparing,
    enableRowSelection,
    virtualItems,
    virtualizerTotalSize,
    virtualizerMeasureElement,
    selectedColumns,
  }: GenAiTracesTableBodyRowsProps) => {
    return (
      <div
        style={{
          height: `${virtualizerTotalSize}px`, // tells scrollbar how big the table is
          position: 'relative', // needed for absolute positioning of rows
          display: 'grid',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index] as Row<EvalTraceComparisonEntry>;
          const exportableTrace = row.original.currentRunValue && !isComparing;
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={(node) => virtualizerMeasureElement(node)}
              style={{
                position: 'absolute',
                transform: `translate3d(0, ${virtualRow.start}px, 0)`,
                willChange: 'transform',
                width: '100%',
              }}
            >
              <GenAiTracesTableBodyRow
                row={row}
                exportableTrace={exportableTrace}
                enableRowSelection={enableRowSelection}
                isSelected={enableRowSelection ? row.getIsSelected() : undefined}
                isComparing={isComparing}
                selectedColumns={selectedColumns}
              />
            </div>
          );
        })}
      </div>
    );
  },
);

// Memoized wrapper for the body rows which is used during column resizing
export const MemoizedGenAiTracesTableBodyRows = React.memo(GenAiTracesTableBodyRows) as typeof GenAiTracesTableBodyRows;

export const GenAiTracesTableBodyRow = React.memo(
  ({
    row,
    exportableTrace,
    enableRowSelection,
    isComparing,
    isSelected,
    // eslint-disable-next-line react/no-unused-prop-types
    selectedColumns, // Prop needed to force row re-rending when selectedColumns change
  }: {
    row: Row<EvalTraceComparisonEntry>;
    exportableTrace?: boolean;
    enableRowSelection?: boolean;
    isComparing: boolean;
    isSelected?: boolean;
    selectedColumns: TracesTableColumn[];
  }) => {
    const cells = row.getVisibleCells();
    const intl = useIntl();
    return (
      <>
        <TableRow>
          <div css={{ display: 'flex', overflow: 'hidden', flexShrink: 0 }}>
            {enableRowSelection && (
              <Tooltip
                componentId="mlflow.experiment-evaluation-monitoring.evals-logs-table-cell-tooltip"
                content={
                  isComparing
                    ? intl.formatMessage({
                        defaultMessage: 'You cannot select rows when comparing runs',
                        description: 'Tooltip message for the select button when comparing runs',
                      })
                    : !exportableTrace
                    ? intl.formatMessage({
                        defaultMessage:
                          'This trace is not exportable because it either contains an error or the response is not a ChatCompletionResponse.',
                        description: 'Tooltip message for the export button when the trace is not exportable',
                      })
                    : null
                }
              >
                <TableRowSelectCell
                  componentId="mlflow.experiment-evaluation-monitoring.evals-logs-table-cell"
                  checked={isSelected && exportableTrace}
                  onChange={row.getToggleSelectedHandler()}
                  isDisabled={isComparing || !exportableTrace}
                />
              </Tooltip>
            )}
          </div>
          {cells.map((cell) => (
            <GenAiTracesTableBodyRowCell cell={cell} key={cell.id} />
          ))}
        </TableRow>
      </>
    );
  },
);

export const GenAiTracesTableBodyRowCell = React.memo(({ cell }: { cell: Cell<EvalTraceComparisonEntry, unknown> }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <TableCell
      key={cell.id}
      style={{
        flex: `1 1 var(--col-${escapeCssSpecialCharacters(cell.column.id)}-size)`,
      }}
      css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // First span, make it width full.
        '> span:first-of-type': {
          padding: `${theme.spacing.xs}px 0px`,
          width: '100%',
        },
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: GenAITracesTableContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAITracesTableContext.tsx
Signals: React

```typescript
import type { Table } from '@tanstack/react-table';
import React, { createContext, useMemo, useState } from 'react';

import type { EvalTraceComparisonEntry } from './types';

type TraceRow = EvalTraceComparisonEntry & { multiline?: boolean };

export interface GenAITracesTableContextValue<T> {
  /** TanStack table instance (may be undefined until grandchild mounts) */
  table: Table<T> | undefined;
  /** Grandchild calls this once when it builds the table */
  setTable: (tbl: Table<T> | undefined) => void;

  selectedRowIds: string[];
  /** Grandchild updates this on every selection change */
  setSelectedRowIds: (rowIds: string[]) => void;
}
export const GenAITracesTableContext = createContext<GenAITracesTableContextValue<TraceRow>>({
  table: undefined,
  setTable: () => {},
  selectedRowIds: [],
  setSelectedRowIds: () => {},
});

interface GenAITracesTableProviderProps {
  children: React.ReactNode;
}

export const GenAITracesTableProvider: React.FC<React.PropsWithChildren<GenAITracesTableProviderProps>> = ({
  children,
}) => {
  const [table, setTable] = useState<Table<TraceRow> | undefined>();
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const value = useMemo(() => ({ table, setTable, selectedRowIds, setSelectedRowIds }), [table, selectedRowIds]);

  return <GenAITracesTableContext.Provider value={value}>{children}</GenAITracesTableContext.Provider>;
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiTracesTableFilter.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTableFilter.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  Button,
  ChevronDownIcon,
  useDesignSystemTheme,
  FilterIcon,
  Popover,
  PlusIcon,
  XCircleFillIcon,
  Spinner,
  DangerIcon,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { TableFilterItem } from './components/filters/TableFilterItem';
import { FilterOperator } from './types';
import type { AssessmentInfo, TableFilterFormState, TableFilter, TableFilterOptions, TracesTableColumn } from './types';

export const GenAiTracesTableFilter = ({
  filters,
  setFilters,
  assessmentInfos,
  experimentId,
  tableFilterOptions,
  allColumns,
  isMetadataLoading,
  metadataError,
  usesV4APIs,
}: {
  filters: TableFilter[];
  setFilters: (filters: TableFilter[]) => void;
  assessmentInfos: AssessmentInfo[];
  experimentId: string;
  tableFilterOptions: TableFilterOptions;
  allColumns: TracesTableColumn[];
  isMetadataLoading?: boolean;
  metadataError?: Error | null;
  usesV4APIs?: boolean;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const hasActiveFilters = filters.length > 0;

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, [setFilters]);

  return (
    <Popover.Root componentId="mlflow.genai_traces_table_filter.filter_dropdown">
      <Popover.Trigger asChild>
        <Button
          endIcon={<ChevronDownIcon />}
          componentId="mlflow.evaluations_review.table_ui.filter_button"
          css={{
            border: hasActiveFilters ? `1px solid ${theme.colors.actionDefaultBorderFocus} !important` : '',
            backgroundColor: hasActiveFilters ? `${theme.colors.actionDefaultBackgroundHover} !important` : '',
          }}
        >
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.sm,
              alignItems: 'center',
            }}
          >
            <FilterIcon />
            {intl.formatMessage(
              {
                defaultMessage: 'Filters{numFilters}',
                description: 'Evaluation review > evaluations list > filter dropdown button',
              },
              {
                numFilters: hasActiveFilters ? ` (${filters.length})` : '',
              },
            )}
            {hasActiveFilters && (
              <XCircleFillIcon
                css={{
                  fontSize: 12,
                  cursor: 'pointer',
                  color: theme.colors.grey400,
                  '&:hover': {
                    color: theme.colors.grey600,
                  },
                }}
                onClick={() => {
                  clearFilters();
                }}
              />
            )}
          </div>
        </Button>
      </Popover.Trigger>
      <Popover.Content align="start" css={{ padding: theme.spacing.md }}>
        {metadataError ? (
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.xs,
              padding: `${theme.spacing.md}px`,
              color: theme.colors.textValidationDanger,
            }}
            data-testid="filter-dropdown-error"
          >
            <DangerIcon />
            <FormattedMessage
              defaultMessage="Fetching traces failed"
              description="Error message for fetching traces failed"
            />
          </div>
        ) : isMetadataLoading ? (
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.xs,
              padding: `${theme.spacing.md}px`,
              color: theme.colors.textSecondary,
            }}
            data-testid="filter-dropdown-loading"
          >
            <Spinner size="small" />
          </div>
        ) : (
          <FilterForm
            filters={filters}
            assessmentInfos={assessmentInfos}
            setFilters={setFilters}
            experimentId={experimentId}
            tableFilterOptions={tableFilterOptions}
            allColumns={allColumns}
            usesV4APIs={usesV4APIs}
          />
        )}
      </Popover.Content>
    </Popover.Root>
  );
};

const useFilterForm = (filters: TableFilter[]) => {
  const form = useForm<TableFilterFormState>({
    defaultValues: {
      filters: filters.length > 0 ? filters : [{ column: '', operator: FilterOperator.EQUALS, value: '' }],
    },
  });

  return form;
};

const FilterForm = ({
  filters,
  assessmentInfos,
  setFilters,
  experimentId,
  tableFilterOptions,
  allColumns,
  usesV4APIs,
}: {
  filters: TableFilter[];
  assessmentInfos: AssessmentInfo[];
  setFilters: (filters: TableFilter[]) => void;
  experimentId: string;
  tableFilterOptions: TableFilterOptions;
  allColumns: TracesTableColumn[];
  usesV4APIs?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  const filterForm = useFilterForm(filters);

  const { setValue, watch } = filterForm;

  const localFilters = watch('filters');

  return (
    <FormProvider {...filterForm}>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.lg,
          overflow: 'auto',
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
          {localFilters.map((filter, index) => (
            <TableFilterItem
              key={filter.column + filter.operator + filter.value + index}
              tableFilter={filter}
              index={index}
              onChange={(newFilter) => {
                localFilters[index] = newFilter;
                setValue('filters', localFilters);
              }}
              onDelete={() => {
                const newFilters = [...localFilters];
                newFilters.splice(index, 1);
                // If there are no filters, add an initial filter
                if (newFilters.length === 0) {
                  newFilters.push({ column: '', operator: FilterOperator.EQUALS, value: '' });
                }
                setValue('filters', newFilters);
              }}
              assessmentInfos={assessmentInfos}
              experimentId={experimentId}
              tableFilterOptions={tableFilterOptions}
              allColumns={allColumns}
              usesV4APIs={usesV4APIs}
            />
          ))}
        </div>
        <div>
          <Button
            componentId="mlflow.evaluations_review.table_ui.add_filter_button"
            icon={<PlusIcon />}
            onClick={() => {
              setValue('filters', [...localFilters, { column: '', operator: FilterOperator.EQUALS, value: '' }]);
            }}
          >
            <FormattedMessage
              defaultMessage="Add filter"
              description="Button label for adding a filter in the GenAI Traces Table filter form"
            />
          </Button>
        </div>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            componentId="mlflow.evaluations_review.table_ui.apply_filters_button"
            type="primary"
            onClick={() => setFilters(localFilters)}
            css={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <FormattedMessage
              defaultMessage="Apply filters"
              description="Button label for applying the filters in the GenAI Traces Table"
            />
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiTracesTableHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTableHeader.tsx
Signals: React

```typescript
import { flexRender } from '@tanstack/react-table';
import type { HeaderGroup, ColumnSizingState, Updater } from '@tanstack/react-table';
import { isNil } from 'lodash';
import React, { useState } from 'react';

import {
  HoverCard,
  TableHeader,
  TableRow,
  TableRowSelectCell,
  useDesignSystemTheme,
  ChevronDownIcon,
} from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { EvaluationsAssessmentHoverCard } from './components/EvaluationsAssessmentHoverCard';
import { AssessmentColumnSummary } from './components/charts/AssessmentColumnSummary';
import { createAssessmentColumnId } from './hooks/useTableColumns';
import {
  type AssessmentAggregates,
  type AssessmentFilter,
  type AssessmentInfo,
  type AssessmentValueType,
  type EvalTraceComparisonEntry,
} from './types';
import { escapeCssSpecialCharacters } from './utils/DisplayUtils';

interface GenAiTracesTableHeaderProps {
  enableRowSelection?: boolean;
  enableGrouping?: boolean;
  selectedAssessmentInfos: AssessmentInfo[];
  assessmentNameToAggregates: Record<string, AssessmentAggregates>;
  assessmentFilters: AssessmentFilter[];
  toggleAssessmentFilter: (
    assessmentName: string,
    filterValue: AssessmentValueType,
    run: string,
    filterType?: AssessmentFilter['filterType'],
  ) => void;
  runDisplayName?: string;
  compareToRunUuid?: string;
  compareToRunDisplayName?: string;
  disableAssessmentTooltips?: boolean;
  collapsedHeader: boolean;
  setCollapsedHeader: (collapsed: boolean) => void;
  isComparing: boolean;
  headerGroups: HeaderGroup<EvalTraceComparisonEntry>[];
  allRowSelected: boolean;
  someRowSelected: boolean;
  toggleAllRowsSelectedHandler: () => (event: unknown) => void;
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void;
}

export const GenAiTracesTableHeader = React.memo(
  ({
    enableRowSelection,
    enableGrouping,
    selectedAssessmentInfos,
    assessmentNameToAggregates,
    assessmentFilters,
    toggleAssessmentFilter,
    runDisplayName,
    compareToRunUuid,
    compareToRunDisplayName,
    disableAssessmentTooltips,
    collapsedHeader,
    setCollapsedHeader,
    isComparing,
    headerGroups,
    allRowSelected,
    someRowSelected,
    toggleAllRowsSelectedHandler,
    setColumnSizing,
  }: GenAiTracesTableHeaderProps) => {
    const { theme } = useDesignSystemTheme();
    const intl = useIntl();
    const [isChevronHovered, setIsChevronHovered] = useState(false);

    // super hacky way to get the border to show between the header and the row
    const borderCss = enableGrouping
      ? {
          position: 'relative' as const,
          '&::before': {
            content: '""',
            position: 'absolute' as const,
            top: '32px',
            left: 0,
            right: 0,
            borderTop: `1px solid ${theme.colors.border}`,
          },
        }
      : {};

    return (
      <>
        {headerGroups.map((headerGroup, depth) => (
          <TableRow
            isHeader
            key={headerGroup.id}
            css={{
              position: 'sticky',
              top: depth * 40,
              zIndex: 100,
              // hack to hide the bottom border of the first row
              ...(enableGrouping && {
                '& > *': {
                  borderBottom: depth === 0 ? 'none' : undefined,
                },
              }),
              ...(depth === headerGroups.length - 1 && {
                borderBottom: `1px solid ${isChevronHovered ? theme.colors.blue500 : theme.colors.border}`,
                transition: 'border-color 0.2s',
                // Remove default cell borders in the last header row
                '& > *': {
                  borderBottom: 'none',
                },
              }),
            }}
          >
            {enableRowSelection && (
              <div css={selectedAssessmentInfos.length === 0 && depth === 1 ? {} : borderCss}>
                <TableRowSelectCell
                  componentId="mlflow.experiment-evaluation-monitoring.evals-logs-table-header-select-cell"
                  checked={allRowSelected}
                  indeterminate={someRowSelected}
                  onChange={toggleAllRowsSelectedHandler()}
                  checkboxLabel={intl.formatMessage({
                    defaultMessage: 'Select all',
                    description: 'Description for button to select all rows in table',
                  })}
                  noCheckbox={depth === 0}
                  isDisabled={isComparing}
                />
              </div>
            )}
            {headerGroup.headers.map((header) => {
              if (header.isPlaceholder) return null; // skip spacer cells

              const assessmentInfo = selectedAssessmentInfos.find(
                (info) => createAssessmentColumnId(info.name) === header.id,
              );

              const title = header.isPlaceholder ? null : (
                <div
                  css={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                  title={String(flexRender(header.column.columnDef.header, header.getContext()))}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              );
              const titleElement =
                assessmentInfo && !disableAssessmentTooltips ? (
                  <HoverCard
                    key={header.id}
                    content={
                      <>
                        <EvaluationsAssessmentHoverCard
                          assessmentInfo={assessmentInfo}
                          assessmentNameToAggregates={assessmentNameToAggregates}
                          allAssessmentFilters={assessmentFilters}
                          toggleAssessmentFilter={toggleAssessmentFilter}
                          runUuid={runDisplayName}
                          compareToRunUuid={compareToRunUuid ? compareToRunDisplayName : undefined}
                        />
                      </>
                    }
                    trigger={title}
                  />
                ) : !isNil(title) ? (
                  title
                ) : null;

              return (
                <TableHeader
                  key={header.column.id}
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluations_evaluationsoverview.tsx_576"
                  css={{
                    '> span:first-of-type': {
                      width: '100%',
                      height: '100%',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    },
                    ...(selectedAssessmentInfos.length === 0 && depth === 1 ? {} : borderCss),
                  }}
                  style={{
                    flex: `${header.colSpan} 1 var(--header-${escapeCssSpecialCharacters(header?.column.id)}-size)`,
                  }}
                  header={header}
                  column={header.column}
                  setColumnSizing={setColumnSizing}
                >
                  <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                    {titleElement}
                    <div
                      css={{
                        borderTop:
                          !enableGrouping && selectedAssessmentInfos.length > 0
                            ? `1px solid ${theme.colors.border}`
                            : '',
                        width: '100%',
                      }}
                    >
                      {assessmentInfo && (
                        <AssessmentColumnSummary
                          theme={theme}
                          intl={intl}
                          assessmentInfo={assessmentInfo}
                          assessmentAggregates={assessmentNameToAggregates[assessmentInfo.name]}
                          allAssessmentFilters={assessmentFilters}
                          toggleAssessmentFilter={toggleAssessmentFilter}
                          currentRunDisplayName={runDisplayName}
                          compareToRunDisplayName={compareToRunUuid ? compareToRunDisplayName : undefined}
                          collapsedHeader={collapsedHeader}
                        />
                      )}
                    </div>
                  </div>
                </TableHeader>
              );
            })}
            {depth === headerGroups.length - 1 && (
              <div
                css={{
                  paddingTop: '0px !important',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 101,
                  padding: 0,
                  pointerEvents: 'none',
                }}
              >
                {/* Mask the border under the chevron */}
                <div
                  css={{
                    position: 'absolute',
                    left: '50%',
                    top: '100%',
                    width: '24px',
                    height: '12px',
                    background: theme.colors.backgroundPrimary,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 101,
                  }}
                />
                {/* Chevron circle, pointer events enabled */}
                <div
                  css={{
                    position: 'absolute',
                    left: '50%',
                    top: '100%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 102,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCollapsedHeader(!collapsedHeader)}
                  onMouseEnter={() => setIsChevronHovered(true)}
                  onMouseLeave={() => setIsChevronHovered(false)}
                >
                  <div
                    css={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: theme.colors.backgroundPrimary,
                      border: `2px solid ${theme.colors.border}`,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      ':hover': {
                        borderColor: theme.colors.blue500,
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)',
                      },
                      opacity: isChevronHovered ? 1 : 0.5,
                    }}
                  >
                    <ChevronDownIcon
                      css={{
                        transform: !collapsedHeader ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s, opacity 0.2s',
                        color: theme.colors.textSecondary,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </TableRow>
        ))}
      </>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: GenAiTracesTableSearchInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTableSearchInput.tsx
Signals: React

```typescript
import { useEffect, useState } from 'react';

import { TableFilterInput } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

const SEARCH_QUERY_FILTER_DEBOUNCE_MS = 400;

export function GenAiTracesTableSearchInput({
  searchQuery,
  setSearchQuery,
  placeholder,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}) {
  const intl = useIntl();

  const [pendingUserQuery, setPendingUserQuery] = useState(searchQuery);
  // When the search query changes, update the pending user query.
  useEffect(() => {
    setPendingUserQuery(searchQuery);
  }, [searchQuery]);

  // Debounce adding the filter search query to the URL so we don't over push to the URL.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(pendingUserQuery);
    }, SEARCH_QUERY_FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [pendingUserQuery, setSearchQuery]);

  return (
    <TableFilterInput
      componentId="mlflow.evaluations_review.table_ui.filter_input"
      placeholder={
        placeholder ??
        intl.formatMessage({
          defaultMessage: 'Search traces by request',
          description: 'Placeholder text for the search input in the trace results table',
        })
      }
      value={pendingUserQuery}
      onChange={(e) => setPendingUserQuery(e.target.value)}
    />
  );
}
```

--------------------------------------------------------------------------------

````

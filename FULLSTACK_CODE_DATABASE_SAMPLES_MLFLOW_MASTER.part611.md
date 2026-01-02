---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 611
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 611 of 991)

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

---[FILE: GenAiTracesTable.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTable.utils.ts

```typescript
import type { ColumnDef } from '@tanstack/react-table';
import { isNil } from 'lodash';

import { KnownEvaluationResultAssessmentName } from './enum';
import {
  REQUEST_TIME_COLUMN_ID,
  STATE_COLUMN_ID,
  SOURCE_COLUMN_ID,
  TAGS_COLUMN_ID,
  EXECUTION_DURATION_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
  SORTABLE_INFO_COLUMNS,
  TRACE_ID_COLUMN_ID,
  SESSION_COLUMN_ID,
  INPUTS_COLUMN_ID,
  RESPONSE_COLUMN_ID,
  USER_COLUMN_ID,
  LOGGED_MODEL_COLUMN_ID,
  TOKENS_COLUMN_ID,
  LINKED_PROMPTS_COLUMN_ID,
} from './hooks/useTableColumns';
import { TracesTableColumnGroup, TracesTableColumnType } from './types';
import type { TracesTableColumn, EvalTraceComparisonEntry, RunEvaluationTracesDataEntry } from './types';
import { getTraceInfoInputs, shouldUseTraceInfoV3 } from './utils/TraceUtils';
import type { ModelTraceInfoV3 } from '../model-trace-explorer';

const GROUP_PRIORITY = [
  TracesTableColumnGroup.INFO,
  TracesTableColumnGroup.ASSESSMENT,
  TracesTableColumnGroup.EXPECTATION,
  TracesTableColumnGroup.TAG,
] as const;

/** Preferred order *within* the INFO group by column ID */
const INFO_COLUMN_PRIORITY = [
  TRACE_ID_COLUMN_ID,
  INPUTS_COLUMN_ID,
  RESPONSE_COLUMN_ID,
  SESSION_COLUMN_ID,
  USER_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
  LOGGED_MODEL_COLUMN_ID,
  TOKENS_COLUMN_ID,
] as const;

/** Preferred order *within* the ASSESSMENT group by column ID */
const ASSESSMENT_COLUMN_PRIORITY = [KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT] as const;

const groupRank: Record<TracesTableColumnGroup, number> = Object.fromEntries(
  GROUP_PRIORITY.map((grp, idx) => [grp, idx]),
) as any;

const infoColumnRank: Record<string, number> = Object.fromEntries(INFO_COLUMN_PRIORITY.map((id, idx) => [id, idx]));

const assessmentColumnRank: Record<string, number> = Object.fromEntries(
  ASSESSMENT_COLUMN_PRIORITY.map((id, idx) => [id, idx]),
);

export function sortGroupedColumns(columns: TracesTableColumn[], isComparing?: boolean): TracesTableColumn[] {
  return [...columns].sort((colA, colB) => {
    // If comparing, always put request time column first
    if (isComparing) {
      if (colA.id === INPUTS_COLUMN_ID) return -1;
      if (colB.id === INPUTS_COLUMN_ID) return 1;
    }

    // 1) Compare their groups by precomputed rank
    const groupA = colA.group ?? TracesTableColumnGroup.INFO;
    const groupB = colB.group ?? TracesTableColumnGroup.INFO;
    const groupComparison = groupRank[groupA] - groupRank[groupB];
    if (groupComparison !== 0) return groupComparison;

    // 2) Same group: INFO
    if (groupA === TracesTableColumnGroup.INFO) {
      const rankA = infoColumnRank[colA.id] ?? Infinity;
      const rankB = infoColumnRank[colB.id] ?? Infinity;
      if (rankA !== rankB) return rankA - rankB;
      return colA.label.localeCompare(colB.label);
    }

    // 3) Same group: ASSESSMENT
    if (groupA === TracesTableColumnGroup.ASSESSMENT) {
      const rankA = assessmentColumnRank[colA.id] ?? Infinity;
      const rankB = assessmentColumnRank[colB.id] ?? Infinity;
      if (rankA !== rankB) return rankA - rankB;
      return colA.label.localeCompare(colB.label);
    }

    // 4) Same group: EXPECTATION
    if (groupA === TracesTableColumnGroup.EXPECTATION) {
      return colA.label.localeCompare(colB.label);
    }

    // 5) Same group: TAG (or any other fallback)
    return colA.label.localeCompare(colB.label);
  });
}

export const sortColumns = (columns: ColumnDef<EvalTraceComparisonEntry>[], selectedColumns: TracesTableColumn[]) => {
  return columns.sort((a, b) => {
    const getPriority = (col: typeof a) => {
      const colType = selectedColumns.find((c) => c.id === col.id)?.type;

      if (colType === TracesTableColumnType.INPUT) return 1;
      if (col.id === TRACE_NAME_COLUMN_ID) return 2;
      if (colType === TracesTableColumnType.TRACE_INFO) return 3;
      if (colType === TracesTableColumnType.INTERNAL_MONITOR_REQUEST_TIME) return 4;
      if (colType === TracesTableColumnType.ASSESSMENT) return 5;
      return 999; // keep any other columns after the known ones
    };

    // primary sort key: our priority number
    const diff = getPriority(a) - getPriority(b);
    if (diff !== 0) return diff;

    // secondary key: for assessment columns, prioritize 'Overall' and then sort alphabetically by label
    const aCol = selectedColumns.find((c) => c.id === a.id);
    const bCol = selectedColumns.find((c) => c.id === b.id);
    if (aCol?.type === TracesTableColumnType.ASSESSMENT && bCol?.type === TracesTableColumnType.ASSESSMENT) {
      if (aCol.id === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT) return -1;
      if (bCol.id === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT) return 1;
      return (aCol.label || '').localeCompare(bCol.label || '');
    }

    // tertiary key: original array order (stable sort fallback)
    return 0;
  });
};

export const traceInfoSortingFn = (
  traceInfoA: ModelTraceInfoV3 | undefined,
  traceInfoB: ModelTraceInfoV3 | undefined,
  colId: string,
) => {
  // only support sorting by request time for now
  if (!SORTABLE_INFO_COLUMNS.includes(colId)) {
    return 0;
  }

  const aVal = String(getTraceInfoValueWithColId(traceInfoA as ModelTraceInfoV3, colId) ?? '');
  const bVal = String(getTraceInfoValueWithColId(traceInfoB as ModelTraceInfoV3, colId) ?? '');

  return aVal.localeCompare(bVal, undefined, { numeric: true });
};

export const getTraceInfoValueWithColId = (traceInfo: ModelTraceInfoV3, colId: string) => {
  switch (colId) {
    case REQUEST_TIME_COLUMN_ID:
    case EXECUTION_DURATION_COLUMN_ID:
    case TAGS_COLUMN_ID:
    case STATE_COLUMN_ID:
      return traceInfo[colId];
    case SOURCE_COLUMN_ID:
      return traceInfo.tags;
    case TRACE_ID_COLUMN_ID:
      return traceInfo.trace_id;
    case SESSION_COLUMN_ID:
      return traceInfo.tags?.['mlflow.trace.session'];
    case LINKED_PROMPTS_COLUMN_ID:
      return traceInfo.tags?.['mlflow.linkedPrompts'];
    default:
      throw new Error(`Unknown column id: ${colId}`);
  }
};

function getUniqueInputRequests(
  evaluationResults: RunEvaluationTracesDataEntry[],
): Map<string, RunEvaluationTracesDataEntry> {
  const resultMap = new Map<string, RunEvaluationTracesDataEntry>();
  // If there are duplicate input ids, we need to append a count to the key to ensure uniqueness.
  const duplicateIndexMap = new Map<string, number>();

  evaluationResults?.forEach((entry) => {
    let key = shouldUseTraceInfoV3([entry]) ? getTraceInfoInputs(entry.traceInfo as ModelTraceInfoV3) : entry.inputsId;
    if (resultMap.has(key)) {
      const currentCount = duplicateIndexMap.get(entry.inputsId) || 0;
      const newCount = currentCount + 1;
      duplicateIndexMap.set(entry.inputsId, newCount);
      key = `${entry.inputsId}_${newCount}`;
    }
    resultMap.set(key, entry);
  });
  return resultMap;
}

export function computeEvaluationsComparison(
  currentRunEvalResults: RunEvaluationTracesDataEntry[],
  otherRunEvalResults?: RunEvaluationTracesDataEntry[],
): EvalTraceComparisonEntry[] {
  if (isNil(otherRunEvalResults)) {
    return currentRunEvalResults.map((entry) => ({ currentRunValue: entry }));
  }

  // TODO(nsthorat): This logic does not work when a single eval run contains the same input ids, e.g. there is multiple evals with the same
  // input id. This is a bug in the current implementation.

  // Merge the two eval results by joining on inputsId. There may be results that are only present in one of the two.
  const otherRunEvalResultsMap = getUniqueInputRequests(otherRunEvalResults);

  const currentRunEvalResultsMap = getUniqueInputRequests(currentRunEvalResults);
  const allRequestIds = new Set([...currentRunEvalResultsMap.keys(), ...otherRunEvalResultsMap.keys()]);

  return Array.from(allRequestIds).map((inputsId) => {
    return {
      currentRunValue: currentRunEvalResultsMap.get(inputsId),
      otherRunValue: otherRunEvalResultsMap.get(inputsId),
    };
  });
}
```

--------------------------------------------------------------------------------

---[FILE: GenAITracesTableActions.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAITracesTableActions.tsx
Signals: React

```typescript
import type { RowSelectionState } from '@tanstack/react-table';
import { compact, isNil } from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';

import { Button, Tooltip, DropdownMenu, ChevronDownIcon } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { GenAITracesTableContext } from './GenAITracesTableContext';
import { GenAiDeleteTraceModal } from './components/GenAiDeleteTraceModal';
import type { RunEvaluationTracesDataEntry, TraceActions } from './types';
import { shouldEnableTagGrouping } from './utils/FeatureUtils';
import { applyTraceInfoV3ToEvalEntry, getRowIdFromTrace } from './utils/TraceUtils';
import { GenAITraceComparisonModal } from './components/GenAITraceComparisonModal';
import type { ModelTraceInfoV3 } from '../model-trace-explorer';

interface GenAITracesTableActionsProps {
  experimentId: string;
  // @deprecated
  selectedTraces?: RunEvaluationTracesDataEntry[];
  // @deprecated
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  traceActions?: TraceActions;
  traceInfos: ModelTraceInfoV3[] | undefined;
}

export const GenAITracesTableActions = (props: GenAITracesTableActionsProps) => {
  const { traceActions, experimentId, selectedTraces: selectedTracesFromProps, traceInfos, setRowSelection } = props;

  const { table, selectedRowIds } = useContext(GenAITracesTableContext);

  const selectedTracesFromContext: RunEvaluationTracesDataEntry[] | undefined = useMemo(
    () =>
      applyTraceInfoV3ToEvalEntry(
        selectedRowIds
          .map((rowId) => {
            const traceInfo = traceInfos?.find((trace) => getRowIdFromTrace(trace) === rowId);
            if (!traceInfo) {
              return undefined;
            }
            return {
              evaluationId: traceInfo.trace_id,
              requestId: traceInfo.client_request_id || traceInfo.trace_id,
              inputsId: traceInfo.trace_id,
              inputs: {},
              outputs: {},
              targets: {},
              overallAssessments: [],
              responseAssessmentsByName: {},
              metrics: {},
              traceInfo,
            };
          })
          .filter((trace) => !isNil(trace)),
      ),
    [selectedRowIds, traceInfos],
  );

  const selectedTraces: RunEvaluationTracesDataEntry[] = selectedTracesFromProps || selectedTracesFromContext;

  return (
    <TraceActionsDropdown
      experimentId={experimentId}
      selectedTraces={selectedTraces}
      traceActions={traceActions}
      setRowSelection={setRowSelection ?? table?.setRowSelection}
    />
  );
};

interface TraceActionsDropdownProps {
  experimentId: string;
  selectedTraces: RunEvaluationTracesDataEntry[];
  traceActions?: TraceActions;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>> | undefined;
}

const TraceActionsDropdown = (props: TraceActionsDropdownProps) => {
  const { experimentId, selectedTraces, traceActions, setRowSelection } = props;
  const intl = useIntl();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleEditTags = useCallback(() => {
    if (selectedTraces.length === 1 && selectedTraces[0].traceInfo && traceActions?.editTags) {
      traceActions.editTags.showEditTagsModalForTrace(selectedTraces[0].traceInfo);
    }
  }, [selectedTraces, traceActions]);

  const handleDeleteTraces = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleOpenCompare = useCallback(() => {
    setShowCompareModal(true);
  }, []);

  const handleCloseCompare = useCallback(() => {
    setShowCompareModal(false);
  }, []);

  const deleteTraces = useCallback(
    async (experimentId: string, traceIds: string[]) => {
      await traceActions?.deleteTracesAction?.deleteTraces?.(experimentId, traceIds);
      setRowSelection?.({});
    },
    [setRowSelection, traceActions],
  );

  const hasExportAction = Boolean(traceActions?.exportToEvals);
  const hasEditTagsAction = shouldEnableTagGrouping() && Boolean(traceActions?.editTags);
  const hasDeleteAction = Boolean(traceActions?.deleteTracesAction);

  const handleExportToDatasets = useCallback(() => {
    traceActions?.exportToEvals?.setShowExportTracesToDatasetsModal?.(true);
  }, [traceActions?.exportToEvals]);
  const showDatasetModal = traceActions?.exportToEvals?.showExportTracesToDatasetsModal;

  const isEditTagsDisabled = selectedTraces.length > 1;
  const noTracesSelected = selectedTraces.length === 0;
  const noActionsAvailable = !hasExportAction && !hasEditTagsAction && !hasDeleteAction;

  const canCompare = selectedTraces.length >= 2 && selectedTraces.length < 4;

  if (noActionsAvailable) {
    return null;
  }

  const ActionButton = (
    <Button
      componentId="mlflow.genai-traces-table.actions-dropdown"
      disabled={noTracesSelected}
      type="primary"
      endIcon={<ChevronDownIcon />}
    >
      {intl.formatMessage(
        {
          defaultMessage: 'Actions{count}',
          description: 'Trace actions dropdown button',
        },
        {
          count: noTracesSelected ? '' : ` (${selectedTraces.length})`,
        },
      )}
    </Button>
  );

  return (
    <>
      <DropdownMenu.Root>
        {noTracesSelected ? (
          <Tooltip
            componentId="mlflow.genai-traces-table.actions-disabled-tooltip"
            content={intl.formatMessage({
              defaultMessage: 'Select one or more traces to add to an evaluation or edit the traces.',
              description: 'Tooltip shown when actions button is disabled due to no trace selection',
            })}
          >
            <div>
              <DropdownMenu.Trigger asChild>{ActionButton}</DropdownMenu.Trigger>
            </div>
          </Tooltip>
        ) : (
          <DropdownMenu.Trigger asChild>{ActionButton}</DropdownMenu.Trigger>
        )}
        <DropdownMenu.Content>
          <DropdownMenu.Item
            componentId="mlflow.genai-traces-table.compare-traces"
            onClick={handleOpenCompare}
            disabled={!canCompare}
          >
            {intl.formatMessage({ defaultMessage: 'Compare', description: 'Compare traces button' })}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          {hasExportAction && (
            <>
              <DropdownMenu.Group>
                <DropdownMenu.Label>
                  {intl.formatMessage({
                    defaultMessage: 'Use for evaluation',
                    description: 'Trace actions dropdown group label',
                  })}
                </DropdownMenu.Label>
                <DropdownMenu.Item
                  componentId="mlflow.genai-traces-table.export-to-datasets"
                  onClick={handleExportToDatasets}
                >
                  {intl.formatMessage({
                    defaultMessage: 'Add to evaluation dataset',
                    description: 'Add traces to evaluation dataset action',
                  })}
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </>
          )}
          {(hasEditTagsAction || hasDeleteAction) && (
            <>
              {hasExportAction && <DropdownMenu.Separator />}
              <DropdownMenu.Group>
                <DropdownMenu.Label>
                  {intl.formatMessage({
                    defaultMessage: 'Edit',
                    description: 'Trace actions dropdown group label',
                  })}
                </DropdownMenu.Label>
                {hasEditTagsAction && (
                  <DropdownMenu.Item
                    componentId="mlflow.genai-traces-table.edit-tags"
                    onClick={handleEditTags}
                    disabled={isEditTagsDisabled}
                  >
                    {intl.formatMessage({
                      defaultMessage: 'Edit tags',
                      description: 'Edit tags action',
                    })}
                  </DropdownMenu.Item>
                )}
                {hasDeleteAction && (
                  <DropdownMenu.Item
                    componentId="mlflow.genai-traces-table.delete-traces"
                    onClick={handleDeleteTraces}
                    disabled={traceActions?.deleteTracesAction?.isDisabled}
                    disabledReason={traceActions?.deleteTracesAction?.disabledReason}
                  >
                    {intl.formatMessage({
                      defaultMessage: 'Delete traces',
                      description: 'Delete traces action',
                    })}
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Group>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {traceActions?.editTags?.EditTagsModal}

      {
        // prettier-ignore
        showDatasetModal &&
        traceActions?.exportToEvals?.renderExportTracesToDatasetsModal?.({
          selectedTraceInfos: compact(selectedTraces.map((trace) => trace.traceInfo)),
        })
      }

      {showDeleteModal && traceActions?.deleteTracesAction && (
        <GenAiDeleteTraceModal
          experimentIds={[experimentId]}
          visible={showDeleteModal}
          selectedTraces={selectedTraces}
          handleClose={() => setShowDeleteModal(false)}
          deleteTraces={deleteTraces}
        />
      )}

      {showCompareModal && (
        <GenAITraceComparisonModal
          traceIds={compact(selectedTraces.map((trace) => trace.traceInfo?.trace_id))}
          onClose={handleCloseCompare}
        />
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiTracesTableBody.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTableBody.tsx
Signals: React

```typescript
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import type { RowSelectionState, OnChangeFn, ColumnDef, Row } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { isNil } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { Empty, SearchIcon, Spinner, Table, useDesignSystemTheme } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';
import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';

import { GenAITracesTableContext } from './GenAITracesTableContext';
import { sortColumns, sortGroupedColumns } from './GenAiTracesTable.utils';
import { getColumnConfig } from './GenAiTracesTableBody.utils';
import { MemoizedGenAiTracesTableBodyRows } from './GenAiTracesTableBodyRows';
import { GenAiTracesTableHeader } from './GenAiTracesTableHeader';
import { HeaderCellRenderer } from './cellRenderers/HeaderCellRenderer';
import { GenAiEvaluationTracesReviewModal } from './components/GenAiEvaluationTracesReviewModal';
import type { GetTraceFunction } from './hooks/useGetTrace';
import { REQUEST_TIME_COLUMN_ID, SESSION_COLUMN_ID, SERVER_SORTABLE_INFO_COLUMNS } from './hooks/useTableColumns';
import {
  type EvaluationsOverviewTableSort,
  TracesTableColumnType,
  type AssessmentAggregates,
  type AssessmentFilter,
  type AssessmentInfo,
  type AssessmentValueType,
  type EvalTraceComparisonEntry,
  type SaveAssessmentsQuery,
  type TracesTableColumn,
  TracesTableColumnGroup,
} from './types';
import { getAssessmentAggregates } from './utils/AggregationUtils';
import { escapeCssSpecialCharacters } from './utils/DisplayUtils';
import { getRowIdFromEvaluation } from './utils/TraceUtils';

export const GenAiTracesTableBody = React.memo(
  ({
    experimentId,
    selectedColumns,
    evaluations,
    selectedEvaluationId,
    selectedAssessmentInfos,
    assessmentInfos,
    assessmentFilters,
    tableSort,
    onChangeEvaluationId,
    getRunColor,
    runUuid,
    runDisplayName,
    compareToRunUuid,
    compareToRunDisplayName,
    rowSelection,
    setRowSelection,
    exportToEvalsInstanceEnabled = false,
    getTrace,
    toggleAssessmentFilter,
    saveAssessmentsQuery,
    disableAssessmentTooltips,
    onTraceTagsEdit,
    enableRowSelection,
    enableGrouping = false,
    allColumns,
    displayLoadingOverlay,
  }: {
    experimentId: string;
    selectedColumns: TracesTableColumn[];
    evaluations: EvalTraceComparisonEntry[];
    selectedEvaluationId: string | undefined;
    selectedAssessmentInfos: AssessmentInfo[];
    assessmentInfos: AssessmentInfo[];
    assessmentFilters: AssessmentFilter[];
    tableSort: EvaluationsOverviewTableSort | undefined;
    onChangeEvaluationId: (evaluationId: string | undefined) => void;
    getRunColor?: (runUuid: string) => string;
    // Current run
    runUuid?: string;
    runDisplayName?: string;
    // Other run
    compareToRunUuid?: string;
    compareToRunDisplayName?: string;
    rowSelection?: RowSelectionState;
    setRowSelection?: OnChangeFn<RowSelectionState>;
    exportToEvalsInstanceEnabled?: boolean;
    getTrace?: GetTraceFunction;
    toggleAssessmentFilter: (
      assessmentName: string,
      filterValue: AssessmentValueType,
      run: string,
      filterType?: AssessmentFilter['filterType'],
    ) => void;
    saveAssessmentsQuery?: SaveAssessmentsQuery;
    disableAssessmentTooltips?: boolean;
    onTraceTagsEdit?: (trace: ModelTraceInfoV3) => void;
    enableRowSelection?: boolean;
    enableGrouping?: boolean;
    allColumns: TracesTableColumn[];
    displayLoadingOverlay?: boolean;
  }) => {
    const intl = useIntl();
    const { theme } = useDesignSystemTheme();
    const [collapsedHeader, setCollapsedHeader] = useState(false);

    const isComparing = !isNil(compareToRunUuid);

    const evaluationInputs = selectedColumns.filter((col) => col.type === TracesTableColumnType.INPUT);

    const { columns } = useMemo(() => {
      if (!enableGrouping) {
        // Return flat columns without grouping
        const columnsList = selectedColumns.map((col) =>
          getColumnConfig(col, {
            evaluationInputs,
            isComparing,
            theme,
            intl,
            experimentId,
            onChangeEvaluationId,
            onTraceTagsEdit,
          }),
        );

        return { columns: sortColumns(columnsList, selectedColumns) };
      }

      // Create a map of group IDs to their column arrays
      const groupColumns = new Map<TracesTableColumnGroup, ColumnDef<EvalTraceComparisonEntry>[]>();
      const sortedGroupedColumns = sortGroupedColumns(selectedColumns, isComparing);

      sortedGroupedColumns.forEach((col) => {
        // Get the group for this column, defaulting to 'Info' if not specified
        const groupId = col.group || TracesTableColumnGroup.INFO;

        // Initialize the group's columns array if it doesn't exist
        if (!groupColumns.has(groupId)) {
          groupColumns.set(groupId, []);
        }

        // or branch of this should never get hit
        (groupColumns.get(groupId) || []).push(
          getColumnConfig(col, {
            evaluationInputs,
            isComparing,
            theme,
            intl,
            experimentId,
            onChangeEvaluationId,
            onTraceTagsEdit,
          }),
        );
      });

      // Convert the map to an array of column groups and sort columns within each group
      const topLevelColumns: ColumnDef<EvalTraceComparisonEntry>[] = Array.from(groupColumns.entries()).map(
        ([groupId, columns]) => ({
          header: HeaderCellRenderer,
          meta: {
            groupId,
            visibleCount: columns.length,
            totalCount: allColumns.filter((col) => col.group === groupId).length,
            enableGrouping,
          },
          id: `${groupId}-group`,
          columns,
        }),
      );

      return { columns: topLevelColumns };
    }, [
      selectedColumns,
      evaluationInputs,
      isComparing,
      onChangeEvaluationId,
      theme,
      intl,
      experimentId,
      onTraceTagsEdit,
      enableGrouping,
      allColumns,
    ]);

    const { setTable, setSelectedRowIds } = React.useContext(GenAITracesTableContext);

    const table = useReactTable<EvalTraceComparisonEntry & { multiline?: boolean }>(
      'js/packages/web-shared/src/genai-traces-table/GenAiTracesTableBody.tsx',
      {
        data: evaluations,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        enableRowSelection,
        enableMultiSort: true,
        state: {
          rowSelection,
        },
        meta: {
          getRunColor,
        },
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => getRowIdFromEvaluation(row.currentRunValue),
      },
    );

    // Need to check if rowSelection is undefined, otherwise getIsAllRowsSelected throws an error
    const allRowSelected = rowSelection !== undefined && table.getIsAllRowsSelected();
    const someRowSelected = table.getIsSomeRowsSelected();

    useEffect(() => {
      setTable(table);

      return () => setTable(undefined);
    }, [table, setTable]);

    useEffect(() => {
      if (enableRowSelection) {
        setSelectedRowIds(table.getSelectedRowModel().rows.map((r) => r.id));
      }
    }, [table, rowSelection, setSelectedRowIds, enableRowSelection]);

    // When the table is empty.
    const emptyDescription = intl.formatMessage({
      defaultMessage: ' No traces found. Try clearing your active filters to see more traces.',
      description: 'Text displayed when no traces are found in the trace review page',
    });

    const emptyComponent = <Empty description={emptyDescription} image={<SearchIcon />} />;
    const isEmpty = (): boolean => table.getRowModel().rows.length === 0;

    // Updating sorting when the prop changes.
    useEffect(() => {
      // Only do client-side sorting for columns that are not supported by the server.
      if (!tableSort || SERVER_SORTABLE_INFO_COLUMNS.includes(tableSort.key)) {
        table.setSorting([]);
        return;
      }

      if (tableSort.key === SESSION_COLUMN_ID) {
        table.setSorting([
          {
            id: tableSort.key,
            desc: !tableSort.asc,
          },
          {
            id: REQUEST_TIME_COLUMN_ID,
            desc: false,
          },
        ]);
      } else {
        table.setSorting([
          {
            id: tableSort.key,
            desc: !tableSort.asc,
          },
        ]);
      }
    }, [tableSort, table]);

    const { rows } = table.getRowModel();

    // The virtualizer needs to know the scrollable container element
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
      count: rows.length,
      estimateSize: () => 120, // estimate row height for accurate scrollbar dragging
      getScrollElement: () => tableContainerRef.current,
      measureElement:
        typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
          ? (element) => element?.getBoundingClientRect().height
          : undefined,
      overscan: 10,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const tableHeaderGroups = table.getHeaderGroups();

    /**
     * Instead of calling `column.getSize()` on every render for every header
     * and especially every data cell (very expensive),
     * we will calculate all column sizes at once at the root table level in a useMemo
     * and pass the column sizes down as CSS variables to the <table> element.
     */
    const { columnSizeVars, tableWidth } = useMemo(() => {
      const colSizes: { [key: string]: string } = {};
      tableHeaderGroups.forEach((headerGroup) => {
        headerGroup.headers.forEach((header) => {
          colSizes[`--header-${escapeCssSpecialCharacters(header.column.id)}-size`] = header.getSize() + 'px';
        });
      });

      // Calculate the total width of the table by adding up the width of all columns.
      let tableWidth = 0;
      if (rows.length > 0) {
        const row = rows[0] as Row<EvalTraceComparisonEntry>;
        const cells = row.getVisibleCells();
        cells.forEach((cell) => {
          colSizes[`--col-${escapeCssSpecialCharacters(cell.column.id)}-size`] = cell.column.getSize() + 'px';
          tableWidth += cell.column.getSize();
        });
      }

      return { columnSizeVars: colSizes, tableWidth: tableWidth + 'px' };
    }, [tableHeaderGroups, rows]);

    // Compute assessment aggregates.
    const assessmentNameToAggregates = useMemo(() => {
      const result: Record<string, AssessmentAggregates> = {};
      for (const assessmentInfo of selectedAssessmentInfos) {
        result[assessmentInfo.name] = getAssessmentAggregates(assessmentInfo, evaluations, assessmentFilters);
      }
      return result;
    }, [selectedAssessmentInfos, evaluations, assessmentFilters]);

    return (
      <>
        <div
          className="container"
          ref={tableContainerRef}
          css={{
            height: '100%',
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'auto',
            minWidth: '100%',
            width: tableWidth,
          }}
        >
          <Table
            css={{
              width: '100%',
              ...columnSizeVars, // Define column sizes on the <table> element
            }}
            empty={isEmpty() ? emptyComponent : undefined}
            someRowsSelected={enableRowSelection ? someRowSelected || allRowSelected : undefined}
          >
            <GenAiTracesTableHeader
              headerGroups={table.getHeaderGroups()}
              enableRowSelection={enableRowSelection}
              enableGrouping={enableGrouping}
              selectedAssessmentInfos={selectedAssessmentInfos}
              assessmentNameToAggregates={assessmentNameToAggregates}
              assessmentFilters={assessmentFilters}
              toggleAssessmentFilter={toggleAssessmentFilter}
              runDisplayName={runDisplayName}
              compareToRunUuid={compareToRunUuid}
              compareToRunDisplayName={compareToRunDisplayName}
              disableAssessmentTooltips={disableAssessmentTooltips}
              collapsedHeader={collapsedHeader}
              setCollapsedHeader={setCollapsedHeader}
              isComparing={isComparing}
              allRowSelected={allRowSelected}
              someRowSelected={someRowSelected}
              toggleAllRowsSelectedHandler={table.getToggleAllRowsSelectedHandler}
              setColumnSizing={table.setColumnSizing}
            />

            <MemoizedGenAiTracesTableBodyRows
              rows={rows}
              isComparing={isComparing}
              enableRowSelection={enableRowSelection}
              virtualItems={virtualItems}
              virtualizerTotalSize={rowVirtualizer.getTotalSize()}
              virtualizerMeasureElement={rowVirtualizer.measureElement}
              rowSelectionState={rowSelection}
              selectedColumns={selectedColumns}
            />
          </Table>
        </div>
        {displayLoadingOverlay && (
          <div
            css={{
              position: 'absolute',
              inset: 0,
              backgroundColor: theme.colors.backgroundPrimary,
              opacity: 0.75,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner size="large" />
          </div>
        )}
        {selectedEvaluationId && (
          <GenAiEvaluationTracesReviewModal
            experimentId={experimentId}
            runUuid={runUuid}
            runDisplayName={runDisplayName}
            otherRunDisplayName={compareToRunDisplayName}
            evaluations={rows.map((row) => row.original)}
            selectedEvaluationId={selectedEvaluationId}
            onChangeEvaluationId={onChangeEvaluationId}
            exportToEvalsInstanceEnabled={exportToEvalsInstanceEnabled}
            assessmentInfos={assessmentInfos}
            getTrace={getTrace}
            saveAssessmentsQuery={saveAssessmentsQuery}
          />
        )}
      </>
    );
  },
);
```

--------------------------------------------------------------------------------

````

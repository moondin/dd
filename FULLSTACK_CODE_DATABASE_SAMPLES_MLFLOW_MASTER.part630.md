---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 630
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 630 of 991)

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

---[FILE: GenAIChatSessionsActions.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/GenAIChatSessionsActions.tsx
Signals: React

```typescript
import type { RowSelectionState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

import { Button, Tooltip, DropdownMenu, ChevronDownIcon } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';
import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { displayErrorNotification, displaySuccessNotification } from '@databricks/web-shared/model-trace-explorer';

import type { SessionTableRow } from './types';
import { GenAiDeleteTraceModal } from '../components/GenAiDeleteTraceModal';
import type { TraceActions } from '../types';

interface GenAIChatSessionsActionsProps {
  experimentId: string;
  selectedSessions: SessionTableRow[];
  traceActions?: TraceActions;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export const GenAIChatSessionsActions = (props: GenAIChatSessionsActionsProps) => {
  const { experimentId, selectedSessions, traceActions, setRowSelection } = props;
  const intl = useIntl();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteSessions = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  // Convert selected sessions to traces for deletion
  const tracesToDelete = useMemo(() => {
    const allTracesInSelectedSessions: ModelTraceInfoV3[] = [];

    selectedSessions.forEach((session) => {
      allTracesInSelectedSessions.push(...session.traces);
    });

    return allTracesInSelectedSessions.map((trace) => ({
      evaluationId: trace.trace_id,
      requestId: trace.client_request_id || trace.trace_id,
      inputsId: trace.trace_id,
      inputs: {},
      outputs: {},
      targets: {},
      overallAssessments: [],
      responseAssessmentsByName: {},
      metrics: {},
      traceInfo: trace,
    }));
  }, [selectedSessions]);

  const deleteTraces = useCallback(
    async (experimentId: string, traceIds: string[]) => {
      try {
        await traceActions?.deleteTracesAction?.deleteTraces?.(experimentId, traceIds);
        setRowSelection?.({});
        setShowDeleteModal(false);

        const sessionMessage = intl.formatMessage(
          {
            defaultMessage: '{count, plural, one {Session} other {{count} sessions}} deleted successfully',
            description: 'Success message after deleting sessions - session count',
          },
          { count: selectedSessions.length },
        );

        const traceMessage = intl.formatMessage(
          {
            defaultMessage: '{count, plural, one {# trace was} other {# traces were}} removed',
            description: 'Success message after deleting sessions - trace count',
          },
          { count: traceIds.length },
        );

        displaySuccessNotification(`${sessionMessage}. ${traceMessage}.`);
      } catch (error) {
        displayErrorNotification(
          intl.formatMessage(
            {
              defaultMessage: 'Failed to delete sessions. Error: {error}',
              description: 'Error message when deleting sessions fails',
            },
            {
              error: error instanceof Error ? error.message : String(error),
            },
          ),
        );
        throw error;
      }
    },
    [setRowSelection, traceActions, selectedSessions.length, intl],
  );

  const hasDeleteAction = Boolean(traceActions?.deleteTracesAction);
  const noSessionsSelected = selectedSessions.length === 0;
  const noActionsAvailable = !hasDeleteAction;

  if (noActionsAvailable) {
    return null;
  }

  const ActionButton = (
    <Button
      componentId="mlflow.chat-sessions.actions-dropdown"
      endIcon={<ChevronDownIcon />}
      disabled={noSessionsSelected || traceActions?.deleteTracesAction?.isDisabled}
    >
      {intl.formatMessage(
        {
          defaultMessage: 'Actions ({count})',
          description: 'Actions dropdown button label with count of selected sessions',
        },
        { count: selectedSessions.length },
      )}
    </Button>
  );

  return (
    <>
      <DropdownMenu.Root modal={false}>
        <Tooltip
          componentId="mlflow.chat-sessions.actions-dropdown-tooltip"
          content={
            noSessionsSelected
              ? intl.formatMessage({
                  defaultMessage: 'Select at least one session to enable actions',
                  description: 'Tooltip for disabled actions button when no sessions are selected',
                })
              : traceActions?.deleteTracesAction?.disabledReason
          }
        >
          <DropdownMenu.Trigger asChild>{ActionButton}</DropdownMenu.Trigger>
        </Tooltip>
        <DropdownMenu.Content align="end">
          {hasDeleteAction && (
            <>
              <DropdownMenu.Item
                componentId="mlflow.chat-sessions.delete-sessions"
                onClick={handleDeleteSessions}
                disabled={traceActions?.deleteTracesAction?.isDisabled}
                disabledReason={traceActions?.deleteTracesAction?.disabledReason}
              >
                {intl.formatMessage({
                  defaultMessage: 'Delete sessions',
                  description: 'Delete sessions action',
                })}
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <GenAiDeleteTraceModal
        experimentIds={[experimentId]}
        visible={showDeleteModal}
        selectedTraces={tracesToDelete}
        handleClose={() => setShowDeleteModal(false)}
        deleteTraces={deleteTraces}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAIChatSessionsEmptyState.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/GenAIChatSessionsEmptyState.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { CodeSnippet, SnippetCopyAction } from '@databricks/web-shared/snippet';

const EXAMPLE_CODE = `import mlflow

@mlflow.trace
def chat_completion(message: str, user_id: str, session_id: str):
    # Set these metadata keys to associate the trace to a user and session
    mlflow.update_current_trace(
        metadata={
            "mlflow.trace.user": user_id,
            "mlflow.trace.session": session_id,
        }
    )

    # Replace with your chat logic
    return "Your response here"

# Depending on your setup, user and session IDs can be passed to your
# server handler via the network request from your client applications,
# or derived from some other request context. 
user_id = "user-123"
session_id = "session-123"

chat_completion("Hello, how are you?", user_id, session_id)`;

export const GenAIChatSessionsEmptyState = () => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ flex: 1, flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography.Title level={3} color="secondary">
        <FormattedMessage
          defaultMessage="Group traces from the same chat session together"
          description="Empty state title for the chat sessions table"
        />
      </Typography.Title>
      <Typography.Paragraph color="secondary" css={{ maxWidth: 600 }}>
        <FormattedMessage
          defaultMessage="MLflow allows you associate traces with users and chat sessions. This is useful for analyzing multi-turn conversations, enabling you to inspect what happened at each step. Copy the code snippet below to generate a sample trace, or visit the documentation for a more in-depth example."
          description="Empty state description for the chat sessions table"
        />
        <Typography.Link
          componentId="mlflow.chat_sessions.empty_state.learn_more_link"
          css={{ marginLeft: theme.spacing.xs }}
          href="https://mlflow.org/docs/latest/genai/tracing/track-users-sessions/"
          openInNewTab
        >
          <FormattedMessage
            defaultMessage="Learn more"
            description="Link to the documentation page for user and session tracking"
          />
        </Typography.Link>
      </Typography.Paragraph>
      <div css={{ position: 'relative' }}>
        <SnippetCopyAction
          componentId="mlflow.chat_sessions.empty_state.example_code_copy"
          css={{ position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
          copyText={EXAMPLE_CODE}
        />
        <CodeSnippet language="python" showLineNumbers>
          {EXAMPLE_CODE}
        </CodeSnippet>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAIChatSessionsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/GenAIChatSessionsTable.tsx
Signals: React

```typescript
import type { Row, SortingState, RowSelectionState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableRowSelectCell,
  TableSkeletonRows,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { useReactTable_verifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';

import { GenAIChatSessionsEmptyState } from './GenAIChatSessionsEmptyState';
import { GenAIChatSessionsToolbar } from './GenAIChatSessionsToolbar';
import { SessionIdCellRenderer } from './cell-renderers/SessionIdCellRenderer';
import { SessionNumericCellRenderer } from './cell-renderers/SessionNumericCellRenderer';
import { SessionSourceCellRenderer } from './cell-renderers/SessionSourceCellRenderer';
import { useSessionsTableColumnVisibility } from './hooks/useSessionsTableColumnVisibility';
import type { SessionTableRow, SessionTableColumn } from './types';
import { getSessionTableRows } from './utils';
import type { TraceActions } from '../types';
import MlflowUtils from '../utils/MlflowUtils';
import { Link, useLocation } from '../utils/RoutingUtils';

const columns: SessionTableColumn[] = [
  {
    id: 'sessionId',
    header: 'Session ID',
    accessorKey: 'sessionId',
    cell: SessionIdCellRenderer,
    defaultVisibility: true,
    enableSorting: true,
    sortingFn: (a: Row<SessionTableRow>, b: Row<SessionTableRow>) =>
      a.original.sessionId.localeCompare(b.original.sessionId),
  },
  {
    id: 'requestPreview',
    header: 'Input',
    accessorKey: 'requestPreview',
    defaultVisibility: true,
  },
  {
    id: 'sessionStartTime',
    header: 'Session start time',
    accessorKey: 'sessionStartTime',
    defaultVisibility: true,
    enableSorting: true,
  },
  {
    id: 'sessionDuration',
    header: 'Session duration',
    accessorKey: 'sessionDuration',
    defaultVisibility: true,
    enableSorting: true,
  },
  {
    id: 'tokens',
    header: 'Tokens',
    accessorKey: 'tokens',
    defaultVisibility: false,
    enableSorting: true,
    cell: SessionNumericCellRenderer,
  },
  {
    id: 'turns',
    header: 'Turns',
    accessorKey: 'turns',
    defaultVisibility: false,
    enableSorting: true,
    cell: SessionNumericCellRenderer,
  },
  {
    id: 'source',
    header: 'Source',
    cell: SessionSourceCellRenderer,
    defaultVisibility: false,
  },
];

interface ExperimentEvaluationDatasetsTableRowProps {
  row: Row<SessionTableRow>;
  enableRowSelection?: boolean;
}

const ExperimentChatSessionsTableRow: React.FC<React.PropsWithChildren<ExperimentEvaluationDatasetsTableRowProps>> =
  React.memo(
    ({ row, enableRowSelection }) => {
      const { search } = useLocation();
      const { theme } = useDesignSystemTheme();

      return (
        <TableRow key={row.id} className="eval-datasets-table-row">
          {enableRowSelection && (
            <div css={{ display: 'flex', overflow: 'hidden', flexShrink: 0 }}>
              <TableRowSelectCell
                componentId="mlflow.chat-sessions.table-row-checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          )}
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              css={{
                backgroundColor: 'transparent',
                flex: `calc(var(--col-${cell.column.id}-size) / 100)`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                '> span:first-of-type': {
                  padding: `${theme.spacing.xs}px 0px`,
                  width: '100%',
                },
                ...(cell.column.id === 'actions' && { paddingLeft: 0, paddingRight: 0 }),
              }}
            >
              <Link
                to={{
                  pathname: MlflowUtils.getExperimentChatSessionPageRoute(
                    row.original.experimentId,
                    row.original.sessionId,
                  ),
                  search,
                }}
                css={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Link>
            </TableCell>
          ))}
        </TableRow>
      );
    },
    () => false,
  );

export const GenAIChatSessionsTable = ({
  experimentId,
  traces,
  isLoading,
  searchQuery,
  setSearchQuery,
  traceActions,
}: {
  experimentId: string;
  traces: ModelTraceInfoV3[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  traceActions?: TraceActions;
}) => {
  const { theme } = useDesignSystemTheme();

  const sessionTableRows = useMemo(() => getSessionTableRows(experimentId, traces), [experimentId, traces]);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'sessionStartTime', desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { columnVisibility, setColumnVisibility } = useSessionsTableColumnVisibility({
    experimentId,
    columns,
  });

  const enableRowSelection = Boolean(traceActions);

  const table = useReactTable<SessionTableRow>({
    data: sessionTableRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: SessionTableRow) => row.sessionId,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const columnSizeInfo = table.getState().columnSizingInfo;
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (const header of headers) {
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // we need to recompute this whenever columns get resized or changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizeInfo, table, columnVisibility]);

  const selectedSessions = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rowSelection],
  );

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        position: 'relative',
        marginTop: theme.spacing.sm,
      }}
    >
      <GenAIChatSessionsToolbar
        columns={columns}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        traceActions={traceActions}
        experimentId={experimentId}
        selectedSessions={selectedSessions}
        setRowSelection={setRowSelection}
      />
      <Table
        style={{ ...columnSizeVars }}
        empty={!isLoading && sessionTableRows.length === 0 ? <GenAIChatSessionsEmptyState /> : undefined}
        scrollable
        someRowsSelected={
          enableRowSelection ? table.getIsAllRowsSelected() || table.getIsSomeRowsSelected() : undefined
        }
      >
        <TableRow isHeader>
          {enableRowSelection && (
            <div css={{ display: 'flex', overflow: 'hidden', flexShrink: 0 }}>
              <TableRowSelectCell
                componentId="mlflow.chat-sessions.table-header-checkbox"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            </div>
          )}
          {table.getLeafHeaders().map((header) => (
            <TableHeader
              key={header.id}
              componentId="mlflow.chat-sessions.table-header"
              header={header}
              column={header.column}
              sortable={header.column.getCanSort()}
              css={{
                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                flex: `calc(var(--col-${header.id}-size) / 100)`,
              }}
              sortDirection={header.column.getIsSorted() || 'none'}
              onToggleSort={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeader>
          ))}
        </TableRow>

        {!isLoading &&
          table
            .getRowModel()
            .rows.map((row) => (
              <ExperimentChatSessionsTableRow key={row.id} row={row} enableRowSelection={enableRowSelection} />
            ))}

        {isLoading && <TableSkeletonRows table={table} />}
      </Table>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAIChatSessionsToolbar.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/GenAIChatSessionsToolbar.tsx

```typescript
import type { RowSelectionState } from '@tanstack/react-table';

import {
  ColumnsIcon,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  DialogComboboxTrigger,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { GenAIChatSessionsActions } from './GenAIChatSessionsActions';
import type { SessionTableColumn, SessionTableRow } from './types';
import { GenAiTracesTableSearchInput } from '../GenAiTracesTableSearchInput';
import type { TraceActions } from '../types';

export const GenAIChatSessionsToolbar = ({
  columns,
  columnVisibility,
  setColumnVisibility,
  searchQuery,
  setSearchQuery,
  traceActions,
  experimentId,
  selectedSessions,
  setRowSelection,
}: {
  columns: SessionTableColumn[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (columnVisibility: Record<string, boolean>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  traceActions?: TraceActions;
  experimentId: string;
  selectedSessions: SessionTableRow[];
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  return (
    <div css={{ display: 'flex', gap: theme.spacing.sm }}>
      <GenAiTracesTableSearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={intl.formatMessage({
          defaultMessage: 'Search chat sessions by input',
          description: 'Placeholder text for the search input in the chat sessions table',
        })}
      />
      <DialogCombobox
        componentId="mlflow.chat-sessions.table-column-selector"
        label={
          <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
            <ColumnsIcon />
            <FormattedMessage
              defaultMessage="Columns"
              description="Columns label for the chat sessions table column selector"
            />
          </div>
        }
        multiSelect
      >
        <DialogComboboxTrigger />
        <DialogComboboxContent>
          <DialogComboboxOptionList>
            {Object.entries(columnVisibility).map(([columnId, isVisible]) => {
              return (
                <DialogComboboxOptionListCheckboxItem
                  key={columnId}
                  value={columnId}
                  onChange={() => {
                    const newColumnVisibility = { ...columnVisibility };
                    newColumnVisibility[columnId] = !isVisible;
                    setColumnVisibility(newColumnVisibility);
                  }}
                  checked={isVisible}
                >
                  {columns.find((column) => column.id === columnId)?.header}
                </DialogComboboxOptionListCheckboxItem>
              );
            })}
          </DialogComboboxOptionList>
        </DialogComboboxContent>
      </DialogCombobox>
      {traceActions && (
        <GenAIChatSessionsActions
          experimentId={experimentId}
          selectedSessions={selectedSessions}
          traceActions={traceActions}
          setRowSelection={setRowSelection}
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/types.ts

```typescript
import type { ColumnDef } from '@tanstack/react-table';

import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';

export type SessionTableRow = {
  sessionId: string;
  requestPreview?: string;
  firstTrace: ModelTraceInfoV3;
  experimentId: string;
  sessionStartTime: string;
  sessionDuration: string | null;
  tokens: number;
  turns: number;
  traces: ModelTraceInfoV3[];
};

export type SessionTableColumn = {
  id: string;
  header: string;
  accessorKey?: string;
  defaultVisibility: boolean;
} & ColumnDef<SessionTableRow>;
```

--------------------------------------------------------------------------------

---[FILE: utils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/utils.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';

import { getSessionTableRows } from './utils';
import type { ModelTraceInfoV3 } from '../../model-trace-explorer';

const MOCK_TRACES: ModelTraceInfoV3[] = [
  {
    trace_id: 'tr-22',
    trace_location: {
      type: 'MLFLOW_EXPERIMENT',
      mlflow_experiment: {
        experiment_id: '0',
      },
    },
    request_time: '2025-10-31T04:34:14.127Z',
    execution_duration: '1.0s',
    state: 'OK',
    trace_metadata: {
      'mlflow.trace_schema.version': '3',
      'mlflow.trace.tokenUsage': '{"input_tokens": 100, "output_tokens": 100, "total_tokens": 200}',
      'mlflow.source.type': 'LOCAL',
      'mlflow.source.name': 'script.py',
      'mlflow.user': 'daniel.lok',
      'mlflow.trace.session': 'session-2',
    },
    tags: {},
    request_preview: 'Session 2 turn 2 request',
    response_preview: 'Session 2 turn 2 response',
  },
  {
    trace_id: 'tr-21',
    trace_location: {
      type: 'MLFLOW_EXPERIMENT',
      mlflow_experiment: {
        experiment_id: '0',
      },
    },
    request_time: '2025-10-31T04:34:04.119Z',
    execution_duration: '1.0s',
    state: 'OK',
    trace_metadata: {
      'mlflow.trace_schema.version': '3',
      'mlflow.trace.tokenUsage': '{"input_tokens": 100, "output_tokens": 100, "total_tokens": 200}',
      'mlflow.source.type': 'LOCAL',
      'mlflow.source.name': 'script.py',
      'mlflow.user': 'daniel.lok',
      'mlflow.trace.session': 'session-2',
    },
    tags: {},
    request_preview: 'Session 2 turn 1 request',
    response_preview: 'Session 2 turn 1 response',
  },
  {
    trace_id: 'tr-11',
    trace_location: {
      type: 'MLFLOW_EXPERIMENT',
      mlflow_experiment: {
        experiment_id: '0',
      },
    },
    request_time: '2025-10-31T04:33:41.004Z',
    execution_duration: '1.0s',
    state: 'OK',
    trace_metadata: {
      'mlflow.trace_schema.version': '3',
      'mlflow.trace.tokenUsage': '{"input_tokens": 100, "output_tokens": 100, "total_tokens": 200}',
      'mlflow.source.type': 'LOCAL',
      'mlflow.source.name': 'script.py',
      'mlflow.user': 'daniel.lok',
      'mlflow.trace.session': 'session-1',
    },
    tags: {},
    request_preview: 'Session 1 turn 1 request',
    response_preview: 'Session 1 turn 1 response',
  },
];

describe('getSessionTableRows', () => {
  it('should parse the sessions correctly', () => {
    const rows = getSessionTableRows('0', MOCK_TRACES);

    // two unique sessions
    expect(rows.length).toBe(2);

    // first session should be session 2 (sorted by request time descending)
    expect(rows[0].sessionId).toBe('session-2');
    expect(rows[0].requestPreview).toBe('Session 2 turn 1 request');
    expect(rows[0].firstTrace.trace_id).toBe('tr-21');
    expect(rows[0].experimentId).toBe('0');
    expect(rows[0].sessionStartTime).toBe('2025-10-31 04:34:04');
    expect(rows[0].sessionDuration).toBe('2.0s');
    expect(rows[0].tokens).toBe(400);
    expect(rows[0].turns).toBe(2);

    expect(rows[1].sessionId).toBe('session-1');
    expect(rows[1].requestPreview).toBe('Session 1 turn 1 request');
    expect(rows[1].firstTrace.trace_id).toBe('tr-11');
    expect(rows[1].experimentId).toBe('0');
    expect(rows[1].sessionStartTime).toBe('2025-10-31 04:33:41');
    expect(rows[1].sessionDuration).toBe('1.0s');
    expect(rows[1].tokens).toBe(200);
    expect(rows[1].turns).toBe(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/utils.tsx

```typescript
import { compact, isNil, sortBy } from 'lodash';

import {
  getTotalTokens,
  type ModelTraceInfoV3,
  SESSION_ID_METADATA_KEY,
} from '@databricks/web-shared/model-trace-explorer';

import type { SessionTableRow } from './types';
import MlflowUtils from '../utils/MlflowUtils';

export const groupTracesBySession = (traces: ModelTraceInfoV3[]) => {
  const sessionIdMap: Record<string, ModelTraceInfoV3[]> = {};

  traces.forEach((trace) => {
    const sessionId = trace.trace_metadata?.[SESSION_ID_METADATA_KEY];
    if (!sessionId) {
      return;
    }

    const sessionTraces = sessionIdMap[sessionId] ?? [];
    sessionIdMap[sessionId] = [...sessionTraces, trace];
  });

  return sessionIdMap;
};

export const getSessionTableRows = (experimentId: string, traces: ModelTraceInfoV3[]): SessionTableRow[] => {
  const sessionIdMap = groupTracesBySession(traces);

  return compact(
    Object.entries(sessionIdMap).map(([sessionId, traces]) => {
      if (traces.length === 0) {
        return null;
      }

      // sort traces within a session by time (earliest first)
      const sortedTraces = sortBy(traces, (trace) => new Date(trace.request_time));
      const firstTrace = sortedTraces[0];

      // take request preview from the first trace
      const requestPreview = firstTrace.request_preview;

      const totalTokens = sortedTraces.reduce((acc, trace) => acc + (getTotalTokens(trace) ?? 0), 0);

      return {
        sessionId,
        requestPreview,
        firstTrace,
        experimentId,
        sessionStartTime: MlflowUtils.formatTimestamp(new Date(firstTrace.request_time)),
        sessionDuration: calculateSessionDuration(traces),
        tokens: totalTokens,
        turns: sortedTraces.length,
        traces: sortedTraces,
      };
    }),
  );
};

const calculateSessionDuration = (traces: ModelTraceInfoV3[]) => {
  const durations = traces.map((trace) => trace.execution_duration);

  if (durations.some((duration) => isNil(duration))) {
    return null;
  }

  const parsedSeconds = durations.map((duration) => parseFloat(duration ?? '0'));
  if (parsedSeconds.some((duration) => isNaN(duration))) {
    return null;
  }

  const totalMs = parsedSeconds.reduce((a, b) => a + b, 0) * 1000;
  return MlflowUtils.formatDuration(totalMs);
};
```

--------------------------------------------------------------------------------

---[FILE: SessionIdCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/cell-renderers/SessionIdCellRenderer.tsx

```typescript
import type { Row } from '@tanstack/react-table';

import { Tag, Typography } from '@databricks/design-system';

import type { SessionTableRow } from '../types';

export const SessionIdCellRenderer = ({ row }: { row: Row<SessionTableRow> }) => {
  const sessionId = row.original.sessionId;

  return (
    <Tag
      componentId="mlflow.chat-sessions.session-id-tag"
      color="indigo"
      css={{ maxWidth: '100%', overflow: 'hidden', cursor: 'pointer' }}
    >
      <Typography.Text ellipsis>{sessionId}</Typography.Text>
    </Tag>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: SessionNumericCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/cell-renderers/SessionNumericCellRenderer.tsx

```typescript
import type { CellContext } from '@tanstack/react-table';

import { Tag } from '@databricks/design-system';

import type { SessionTableRow } from '../types';

export const SessionNumericCellRenderer = (props: CellContext<SessionTableRow, unknown>) => {
  const { cell } = props;
  const value = cell.getValue();

  return <Tag componentId="mlflow.genai-traces-table.session-tokens">{value}</Tag>;
};
```

--------------------------------------------------------------------------------

---[FILE: SessionSourceCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/cell-renderers/SessionSourceCellRenderer.tsx

```typescript
import type { Row } from '@tanstack/react-table';

import { SourceCellRenderer } from '../../cellRenderers/Source/SourceRenderer';
import type { SessionTableRow } from '../types';

export const SessionSourceCellRenderer = ({ row }: { row: Row<SessionTableRow> }) => {
  const firstTrace = row.original.firstTrace;
  return <SourceCellRenderer traceInfo={firstTrace} isComparing={false} />;
};
```

--------------------------------------------------------------------------------

---[FILE: useSessionsTableColumnVisibility.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/sessions-table/hooks/useSessionsTableColumnVisibility.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import { useLocalStorage } from '@databricks/web-shared/hooks';

import type { SessionTableColumn } from '../types';

const LOCAL_STORAGE_KEY = 'experiment-chat-sessions-table-column-visibility';
const LOCAL_STORAGE_VERSION = 1;

export const useSessionsTableColumnVisibility = ({
  experimentId,
  columns,
}: {
  experimentId: string;
  columns: SessionTableColumn[];
}) => {
  const defaultColumnVisibility = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = column.defaultVisibility;
      return acc;
    }, {} as Record<string, boolean>);
  }, [columns]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage<Record<string, boolean>>({
    key: `${LOCAL_STORAGE_KEY}-${experimentId}`,
    version: LOCAL_STORAGE_VERSION,
    initialValue: defaultColumnVisibility,
  });

  return {
    columnVisibility,
    setColumnVisibility,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluatedTraceTestUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/test-fixtures/EvaluatedTraceTestUtils.ts

```typescript
import type { ModelTraceInfoV3 } from '../../model-trace-explorer';
import { KnownEvaluationResultAssessmentName } from '../enum';
import type {
  RunEvaluationResultAssessment,
  RunEvaluationTracesDataEntry,
  AssessmentInfo,
  AssessmentDType,
  TracesTableColumn,
} from '../types';
import { TracesTableColumnType, TracesTableColumnGroup } from '../types';

export function createTestTrace(entry: {
  requestId: string;
  request: string;
  assessments: {
    name: string;
    value: string | number | boolean | null | undefined;
    dtype: 'pass-fail' | 'float' | 'boolean' | 'string';
  }[];
}): RunEvaluationTracesDataEntry {
  const assessments: RunEvaluationResultAssessment[] = entry.assessments.map((assessment) => {
    let numericValue = null;
    let booleanValue = null;
    let stringValue = null;

    switch (assessment.dtype) {
      case 'pass-fail':
      case 'string':
        stringValue = typeof assessment.value === 'string' ? assessment.value : null;
        break;
      case 'float':
        numericValue = typeof assessment.value === 'number' ? assessment.value : null;
        break;
      case 'boolean':
        booleanValue = typeof assessment.value === 'boolean' ? assessment.value : null;
        break;
    }

    return {
      name: assessment.name,
      stringValue,
      numericValue,
      booleanValue,
    };
  });

  const responseAssessmentsByName: Record<string, RunEvaluationResultAssessment[]> = {};
  for (const assessment of assessments) {
    if (!responseAssessmentsByName[assessment.name]) {
      responseAssessmentsByName[assessment.name] = [];
    }
    responseAssessmentsByName[assessment.name].push(assessment);
  }

  return {
    evaluationId: `eval_${entry.requestId}`,
    requestId: entry.requestId,
    inputs: { request: entry.request },
    inputsId: `input_${entry.requestId}`,
    outputs: {},
    targets: {},
    overallAssessments: assessments.filter((a) => a.name === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT),
    responseAssessmentsByName,
    metrics: {},
  };
}

export function createTestTraces(
  entries: {
    requestId: string;
    request: string;
    assessments: {
      name: string;
      value: string | number | boolean | null | undefined;
      dtype: 'pass-fail' | 'float' | 'boolean' | 'string';
    }[];
  }[],
): RunEvaluationTracesDataEntry[] {
  return entries.map(createTestTrace);
}

/**
 * Helper function to create test trace info V3
 */
export const createTestTraceInfoV3 = (
  traceId: string,
  requestId: string,
  request: string,
  assessments: Array<{
    name: string;
    value: string | number | boolean;
    dtype: 'pass-fail' | 'numeric' | 'boolean' | 'string';
  }> = [],
  experimentId = 'test-experiment-id',
): ModelTraceInfoV3 => ({
  trace_id: traceId,
  client_request_id: requestId,
  trace_location: {
    type: 'MLFLOW_EXPERIMENT',
    mlflow_experiment: { experiment_id: experimentId },
  },
  request,
  request_preview: request,
  response: 'Test response',
  response_preview: 'Test response',
  request_time: '2024-01-15T10:00:00Z',
  execution_duration: '1000',
  state: 'OK',
  trace_metadata: {},
  tags: {},
  assessments: assessments.map((assessment) => ({
    assessment_id: `${traceId}_${assessment.name}`,
    assessment_name: assessment.name,
    trace_id: traceId,
    create_time: '2024-01-15T10:00:00Z',
    last_update_time: '2024-01-15T10:00:00Z',
    feedback: {
      value: assessment.value,
    },
    source: {
      source_type: 'LLM_JUDGE',
      source_id: 'test-judge',
    },
  })),
});

/**
 * Helper function to create test assessment info
 */
export const createTestAssessmentInfo = (
  name: string,
  displayName: string,
  dtype: AssessmentDType = 'string',
): AssessmentInfo => ({
  name,
  displayName,
  isKnown: true,
  isOverall: false,
  metricName: name,
  isCustomMetric: false,
  isEditable: false,
  isRetrievalAssessment: false,
  dtype,
  uniqueValues: new Set(['test-value']),
  docsLink: '',
  missingTooltip: '',
  description: '',
});

/**
 * Helper function to create test columns
 */
export const createTestColumns = (assessmentInfos: AssessmentInfo[]): TracesTableColumn[] => {
  const columns: TracesTableColumn[] = [
    {
      id: 'request',
      label: 'Request',
      type: TracesTableColumnType.INPUT,
      group: TracesTableColumnGroup.INFO,
    },
    {
      id: 'trace_id',
      label: 'Trace ID',
      type: TracesTableColumnType.TRACE_INFO,
      group: TracesTableColumnGroup.INFO,
    },
  ];

  // Add assessment columns
  assessmentInfos.forEach((assessmentInfo) => {
    columns.push({
      id: `assessment_${assessmentInfo.name}`,
      label: assessmentInfo.displayName,
      type: TracesTableColumnType.ASSESSMENT,
      group: TracesTableColumnGroup.ASSESSMENT,
      assessmentInfo,
    });
  });

  return columns;
};
```

--------------------------------------------------------------------------------

````

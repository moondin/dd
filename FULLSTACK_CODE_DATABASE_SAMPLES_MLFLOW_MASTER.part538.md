---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 538
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 538 of 991)

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

---[FILE: TracesView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesView.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { waitFor, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../../common/utils/TestUtils.react18';
import { TracesView, TRACE_AUTO_REFRESH_INTERVAL } from './TracesView';
import { MlflowService } from '../../sdk/MlflowService';
import type { KeyValueEntity } from '../../../common/types';
import { DesignSystemProvider } from '@databricks/design-system';
import type { ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { MemoryRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // increase timeout

const testExperimentId = 'some-experiment-id';
const testExperimentIds = [testExperimentId];

const pagesCount = 3;

const generateMockTrace = (uniqueId: string, timestampMs = 100, metadata: KeyValueEntity[] = []): ModelTraceInfo => ({
  request_id: `tr-${uniqueId}`,
  experiment_id: testExperimentId,
  timestamp_ms: 1712134300000 + timestampMs,
  execution_time_ms: timestampMs,
  status: 'OK',
  attributes: {},
  request_metadata: [...metadata],
  tags: [],
});

const getMockTraceResponse = (tracesToReturn: number) => {
  return (_: string[], __: string, token: string | undefined) => {
    const page = token ? JSON.parse(token).page : 1;
    const traces = new Array(tracesToReturn).fill(0).map((_, i) => generateMockTrace(`trace-page${page}-${i + 1}`, i));
    const next_page_token = page < pagesCount ? JSON.stringify({ page: page + 1 }) : undefined;
    return Promise.resolve({ traces, next_page_token });
  };
};

describe('TracesView', () => {
  it('should auto-refresh traces', async () => {
    jest.useFakeTimers();

    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation(getMockTraceResponse(10));

    renderWithIntl(
      <MemoryRouter>
        <DesignSystemProvider>
          <TracesView experimentIds={testExperimentIds} />
        </DesignSystemProvider>
      </MemoryRouter>,
    );
    expect(MlflowService.getExperimentTraces).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      // 10 rows + 1 header
      expect(screen.getAllByRole('row')).toHaveLength(11);
    });

    // simulate new traces from the backend
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation(getMockTraceResponse(20));

    jest.advanceTimersByTime(TRACE_AUTO_REFRESH_INTERVAL + 1000);

    // expect that the new traces have been fetched and show up
    expect(MlflowService.getExperimentTraces).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(21);
    });
  });

  it('should allow trace selection', async () => {
    // this line is necessary for userEvent to work with fake timers
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const mockTraces = new Array(10).fill(0).map((_, i) => generateMockTrace(`trace-${i + 1}`));
    const getTracesSpy = jest.spyOn(MlflowService, 'getExperimentTraces').mockResolvedValue({
      traces: mockTraces,
      next_page_token: undefined,
    });
    const deleteTracesSpy = jest.spyOn(MlflowService, 'deleteTraces').mockResolvedValue({ traces_deleted: 1 });

    renderWithIntl(
      <MemoryRouter>
        <DesignSystemProvider>
          <TracesView experimentIds={testExperimentIds} />
        </DesignSystemProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(11);
    });

    const traceIds = mockTraces.map((trace) => trace.request_id);
    const headerCheckbox = screen.getByTestId('trace-table-header-checkbox');

    // clicking on the header checkbox should select all rows
    await user.click(headerCheckbox);
    traceIds.forEach((traceId) => {
      expect(screen.getByTestId(`trace-table-cell-checkbox-${traceId}`)).toBeChecked();
    });

    // when opening the delete dialog, all selected traces should be listed
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.queryByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('10 traces will be deleted.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));

    // test that deselecting all rows works as well
    await user.click(headerCheckbox);
    traceIds.forEach((traceId) => {
      expect(screen.getByTestId(`trace-table-cell-checkbox-${traceId}`)).not.toBeChecked();
    });

    // test that single-row selections works
    const rowCheckbox = screen.getByTestId(`trace-table-cell-checkbox-${traceIds[0]}`);
    await user.click(rowCheckbox);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    // test that the description correctly handles plural (10 traces -> 1 trace)
    expect(await screen.queryByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('1 trace will be deleted.')).toBeInTheDocument();

    // auto-refresh might cause a hardcoded value to flake, so we
    // check that after clicking the button, it has incremented by 1
    const mockCalls = getTracesSpy.mock.calls.length;
    await user.click(screen.getByRole('button', { name: 'Delete 1 trace' }));

    // check that delete and refresh have been called
    expect(deleteTracesSpy).toHaveBeenCalledTimes(1);
    await waitForElementToBeRemoved((): any => screen.queryByRole('dialog'));
    expect(getTracesSpy).toHaveBeenCalledTimes(mockCalls + 1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TracesView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesView.tsx
Signals: React

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

import { useExperimentTraces } from './hooks/useExperimentTraces';
import { TracesViewTable } from './TracesViewTable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TraceDataDrawer } from './TraceDataDrawer';
import { useEditExperimentTraceTags } from './hooks/useEditExperimentTraceTags';
import { TracesViewControls } from './TracesViewControls';
import type { SortingState } from '@tanstack/react-table';
import { compact, isFunction, isNil, uniq } from 'lodash';
import { useExperimentViewTracesUIState } from './hooks/useExperimentViewTracesUIState';
import { ExperimentViewTracesTableColumns, getTraceInfoTotalTokens } from './TracesView.utils';
import { useActiveExperimentTrace } from './hooks/useActiveExperimentTrace';
import { useActiveExperimentSpan } from './hooks/useActiveExperimentSpan';
import type { ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';

export const TRACE_AUTO_REFRESH_INTERVAL = 30000;

const defaultSorting: SortingState = [{ id: ExperimentViewTracesTableColumns.timestampMs, desc: true }];

export const TracesView = ({
  experimentIds,
  runUuid,
  loggedModelId,
  disabledColumns,
  baseComponentId = runUuid ? 'mlflow.run.traces' : 'mlflow.experiment_page.traces',
}: {
  experimentIds: string[];
  /**
   * If `runUuid` is provided, the traces will be filtered to only show traces from that run.
   */
  runUuid?: string;
  /**
   * If `loggedModelId` is provided, the traces will be filtered to only show traces from that logged model.
   */
  loggedModelId?: string;
  /**
   * Columns that should be disabled in the table.
   * Disabled columns are hidden and are not available to be toggled at all.
   */
  disabledColumns?: ExperimentViewTracesTableColumns[];
  /**
   * The base component ID for the traces view. If not provided, will be inferred from the other props.
   */
  baseComponentId?: string;
}) => {
  const timeoutRef = useRef<number | undefined>(undefined);
  const [filter, setFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [rowSelection, setRowSelection] = useState<{ [id: string]: boolean }>({});

  const [selectedTraceId, setSelectedTraceId] = useActiveExperimentTrace();
  const [selectedSpanId, setSelectedSpanId] = useActiveExperimentSpan();

  const { traces, loading, error, hasNextPage, hasPreviousPage, fetchNextPage, fetchPrevPage, refreshCurrentPage } =
    useExperimentTraces({
      experimentIds,
      sorting,
      filter,
      runUuid,
      loggedModelId,
    });

  const onTraceClicked = useCallback(
    ({ request_id }: ModelTraceInfo) => setSelectedTraceId(request_id),
    [setSelectedTraceId],
  );

  // clear row selections when the page changes.
  // the backend specifies a max of 100 deletions,
  // plus it's confusing to have selections on a
  // page that the user can't see
  const onNextPage = useCallback(() => {
    fetchNextPage();
    setRowSelection({});
  }, [fetchNextPage]);

  const onPreviousPage = useCallback(() => {
    fetchPrevPage();
    setRowSelection({});
  }, [fetchPrevPage]);

  // auto-refresh traces
  useEffect(() => {
    // if the hook reruns, clear the current timeout, since we'll be scheduling another
    window.clearTimeout(timeoutRef.current);

    const scheduleRefresh = async () => {
      // only refresh if the user is on the first page
      // otherwise it might mess with browsing old traces
      if (loading || hasPreviousPage) return;

      await refreshCurrentPage(true);

      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(scheduleRefresh, TRACE_AUTO_REFRESH_INTERVAL);
    };

    timeoutRef.current = window.setTimeout(scheduleRefresh, TRACE_AUTO_REFRESH_INTERVAL);
    return () => window.clearTimeout(timeoutRef.current);
  }, [refreshCurrentPage, loading, hasPreviousPage]);

  const { theme } = useDesignSystemTheme();

  // Try to find the trace info for the currently selected trace id
  const selectedTraceInfo = useMemo(() => {
    if (!selectedTraceId) return undefined;
    return traces.find((trace) => trace.request_id === selectedTraceId);
  }, [selectedTraceId, traces]);

  const {
    // hiddenColumns is a list of columns that are hidden by the user.
    uiState,
    toggleHiddenColumn,
  } = useExperimentViewTracesUIState(experimentIds);

  const existingTagKeys = useMemo(
    () => uniq(compact(traces.flatMap((trace) => trace.tags?.map((tag) => tag.key)))),
    [traces],
  );

  const usingFilters = filter !== '';

  const anyTraceContainsTokenCount = traces.some((trace) => !isNil(getTraceInfoTotalTokens(trace)));

  // Automatically disabled columns: hide the token count column if there's no trace that contains token count information.
  const autoDisabledColumns = useMemo(
    () => (!anyTraceContainsTokenCount ? [ExperimentViewTracesTableColumns.totalTokens] : []),
    [anyTraceContainsTokenCount],
  );

  // Combine columns that are disabled by parent component and columns that are disabled automatically.
  const allDisabledColumns = useMemo(
    () => [...(disabledColumns ?? []), ...autoDisabledColumns],
    [disabledColumns, autoDisabledColumns],
  );

  const allHiddenColumns = useMemo(
    () => [...(uiState.hiddenColumns ?? []), ...allDisabledColumns],
    [uiState, allDisabledColumns],
  );

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <TracesViewControls
        experimentIds={experimentIds}
        filter={filter}
        onChangeFilter={setFilter}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        refreshTraces={refreshCurrentPage}
        baseComponentId={baseComponentId}
        runUuid={runUuid}
        traces={traces}
      />
      <TracesViewTable
        experimentIds={experimentIds}
        runUuid={runUuid}
        traces={traces}
        loading={loading}
        error={error}
        onTraceClicked={onTraceClicked}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onTagsUpdated={refreshCurrentPage}
        usingFilters={usingFilters}
        onResetFilters={() => setFilter('')}
        hiddenColumns={allHiddenColumns}
        disableTokenColumn={!anyTraceContainsTokenCount}
        disabledColumns={allDisabledColumns}
        setSorting={(sortingSetter) => {
          // If header is clicked enough times, tanstack table switches to "no sort" mode.
          // In that case, we should just reverse the direction of the current sort instead.
          if (isFunction(sortingSetter)) {
            return setSorting((currentState) => {
              const newState = sortingSetter(currentState);
              const currentSortBy = currentState[0];
              if ((!newState || newState.length === 0) && currentSortBy) {
                return [{ id: currentSortBy.id, desc: !currentSortBy.desc }];
              }
              return newState;
            });
          }
        }}
        sorting={sorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        baseComponentId={baseComponentId}
        toggleHiddenColumn={toggleHiddenColumn}
      />
      {selectedTraceId && (
        <TraceDataDrawer
          traceInfo={selectedTraceInfo}
          loadingTraceInfo={loading}
          requestId={selectedTraceId}
          onClose={() => setSelectedTraceId(undefined)}
          selectedSpanId={selectedSpanId}
          onSelectSpan={setSelectedSpanId}
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesView.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesView.utils.ts

```typescript
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { type MessageDescriptor, defineMessage } from 'react-intl';
import { isNil } from 'lodash';

const TRACE_METADATA_FIELD_RUN_ID = 'mlflow.sourceRun';
const TRACE_METADATA_FIELD_TOTAL_TOKENS = 'total_tokens';
const TRACE_METADATA_FIELD_INPUTS = 'mlflow.traceInputs';
const TRACE_METADATA_FIELD_OUTPUTS = 'mlflow.traceOutputs';
export const TRACE_TAG_NAME_TRACE_NAME = 'mlflow.traceName';

// Truncation limit for tracing metadata, taken from:
// https://github.com/mlflow/mlflow/blob/2b457f2b46fc135a3fba77aefafe2319a899fc08/mlflow/tracing/constant.py#L23
const MAX_CHARS_IN_TRACE_INFO_METADATA_AND_TAGS = 250;

const getTraceMetadataField = (traceInfo: ModelTraceInfo, field: string) => {
  return traceInfo.request_metadata?.find(({ key }) => key === field)?.value;
};

export const isTraceMetadataPossiblyTruncated = (traceMetadata: string) => {
  return traceMetadata.length >= MAX_CHARS_IN_TRACE_INFO_METADATA_AND_TAGS;
};

export const getTraceInfoRunId = (traceInfo: ModelTraceInfo) =>
  getTraceMetadataField(traceInfo, TRACE_METADATA_FIELD_RUN_ID);

export const getTraceInfoTotalTokens = (traceInfo: ModelTraceInfo) =>
  getTraceMetadataField(traceInfo, TRACE_METADATA_FIELD_TOTAL_TOKENS);

export const getTraceInfoInputs = (traceInfo: ModelTraceInfo) => {
  const inputs = getTraceMetadataField(traceInfo, TRACE_METADATA_FIELD_INPUTS);
  if (isNil(inputs)) {
    return undefined;
  }
  try {
    return JSON.stringify(JSON.parse(inputs)); // unescape non-ascii characters
  } catch (e) {
    return inputs;
  }
};

export const getTraceInfoOutputs = (traceInfo: ModelTraceInfo) => {
  const outputs = getTraceMetadataField(traceInfo, TRACE_METADATA_FIELD_OUTPUTS);
  if (isNil(outputs)) {
    return undefined;
  }
  try {
    return JSON.stringify(JSON.parse(outputs)); // unescape non-ascii characters
  } catch (e) {
    return outputs;
  }
};

export const getTraceTagValue = (traceInfo: ModelTraceInfo, tagName: string) => {
  if (Array.isArray(traceInfo.tags)) {
    return traceInfo.tags?.find(({ key }) => key === tagName)?.value;
  }

  return traceInfo.tags?.[tagName];
};

export const getTraceDisplayName = (traceInfo: ModelTraceInfo) => {
  return getTraceTagValue(traceInfo, TRACE_TAG_NAME_TRACE_NAME) || traceInfo.request_id;
};

export const EXPERIMENT_TRACES_SORTABLE_COLUMNS = ['timestamp_ms'];

// defining a separate const for this column as
// we don't users to be able to control its visibility
export const TRACE_TABLE_CHECKBOX_COLUMN_ID = 'select';

export enum ExperimentViewTracesTableColumns {
  requestId = 'request_id',
  traceName = 'traceName',
  timestampMs = 'timestamp_ms',
  inputs = 'inputs',
  outputs = 'outputs',
  runName = 'runName',
  totalTokens = 'total_tokens',
  source = 'source',
  latency = 'latency',
  tags = 'tags',
  status = 'status',
}

export const ExperimentViewTracesTableColumnLabels: Record<ExperimentViewTracesTableColumns, MessageDescriptor> = {
  [ExperimentViewTracesTableColumns.requestId]: defineMessage({
    defaultMessage: 'Request ID',
    description: 'Experiment page > traces table > request id column header',
  }),
  [ExperimentViewTracesTableColumns.traceName]: defineMessage({
    defaultMessage: 'Trace name',
    description: 'Experiment page > traces table > trace name column header',
  }),
  [ExperimentViewTracesTableColumns.timestampMs]: defineMessage({
    defaultMessage: 'Time created',
    description: 'Experiment page > traces table > time created column header',
  }),
  [ExperimentViewTracesTableColumns.status]: defineMessage({
    defaultMessage: 'Status',
    description: 'Experiment page > traces table > status column header',
  }),
  [ExperimentViewTracesTableColumns.inputs]: defineMessage({
    defaultMessage: 'Request',
    description: 'Experiment page > traces table > input column header',
  }),
  [ExperimentViewTracesTableColumns.outputs]: defineMessage({
    defaultMessage: 'Response',
    description: 'Experiment page > traces table > output column header',
  }),
  [ExperimentViewTracesTableColumns.runName]: defineMessage({
    defaultMessage: 'Run name',
    description: 'Experiment page > traces table > run name column header',
  }),
  [ExperimentViewTracesTableColumns.totalTokens]: defineMessage({
    defaultMessage: 'Tokens',
    description: 'Experiment page > traces table > tokens column header',
  }),
  [ExperimentViewTracesTableColumns.source]: defineMessage({
    defaultMessage: 'Source',
    description: 'Experiment page > traces table > source column header',
  }),
  [ExperimentViewTracesTableColumns.latency]: defineMessage({
    defaultMessage: 'Execution time',
    description: 'Experiment page > traces table > latency column header',
  }),
  [ExperimentViewTracesTableColumns.tags]: defineMessage({
    defaultMessage: 'Tags',
    description: 'Experiment page > traces table > tags column header',
  }),
};

export const ExperimentViewTracesStatusLabels = {
  UNSET: null,
  IN_PROGRESS: defineMessage({
    defaultMessage: 'In progress',
    description: 'Experiment page > traces table > status label > in progress',
  }),
  OK: defineMessage({
    defaultMessage: 'OK',
    description: 'Experiment page > traces table > status label > ok',
  }),
  ERROR: defineMessage({
    defaultMessage: 'Error',
    description: 'Experiment page > traces table > status label > error',
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewControls.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewControls.test.tsx

```typescript
import { describe, jest, beforeEach, test, expect } from '@jest/globals';
import userEventGlobal, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { renderWithIntl, screen } from '../../../common/utils/TestUtils.react18';
import { TracesViewControls } from './TracesViewControls';

// Disable pointer events check for DialogCombobox which masks the elements we want to click
const userEvent = userEventGlobal.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

describe('ExperimentViewTracesControls', () => {
  const mockOnChangeFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial filter value', () => {
    const filter = 'test-filter';
    renderWithIntl(
      <TracesViewControls
        experimentIds={['0']}
        filter={filter}
        onChangeFilter={mockOnChangeFilter}
        rowSelection={{}}
        setRowSelection={() => {}}
        refreshTraces={() => {}}
        baseComponentId="test"
        traces={[]}
      />,
    );

    const filterInput = screen.getByPlaceholderText('Search traces');
    expect(filterInput).toBeInTheDocument();
    expect(filterInput).toHaveValue(filter);
  });

  test('calls onChangeFilter when filter input value changes', async () => {
    const filter = 'test-filter';
    renderWithIntl(
      <TracesViewControls
        experimentIds={['0']}
        filter={filter}
        onChangeFilter={mockOnChangeFilter}
        rowSelection={{}}
        setRowSelection={() => {}}
        refreshTraces={() => {}}
        baseComponentId="test"
        traces={[]}
      />,
    );

    const filterInput = screen.getByPlaceholderText('Search traces');
    const newFilterValue = 'new-filter';
    await userEvent.clear(filterInput);
    await userEvent.type(filterInput, `${newFilterValue}{enter}`);

    expect(mockOnChangeFilter).toHaveBeenCalledWith(newFilterValue);
  });

  test('calls onChangeFilter with empty string when clear button is clicked', async () => {
    const filter = 'test-filter';
    renderWithIntl(
      <TracesViewControls
        experimentIds={['0']}
        filter={filter}
        onChangeFilter={mockOnChangeFilter}
        rowSelection={{}}
        setRowSelection={() => {}}
        refreshTraces={() => {}}
        baseComponentId="test"
        traces={[]}
      />,
    );

    const clearButton = screen.getByRole('button', { name: 'close-circle' });
    await userEvent.click(clearButton);

    expect(mockOnChangeFilter).toHaveBeenCalledWith('');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TracesViewControls.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewControls.tsx
Signals: React

```typescript
import {
  Button,
  InfoSmallIcon,
  Input,
  Popover,
  SearchIcon,
  TableFilterLayout,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { TracesViewControlsActions } from './TracesViewControlsActions';
import type { ModelTraceInfoWithRunName } from './hooks/useExperimentTraces';

const InputTooltip = ({ baseComponentId }: { baseComponentId: string }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Popover.Root
      componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracesviewcontrols.tsx_28"
      modal={false}
    >
      <Popover.Trigger asChild>
        <Button
          size="small"
          type="link"
          icon={
            <InfoSmallIcon
              css={{
                svg: { width: 16, height: 16, color: theme.colors.textSecondary },
              }}
            />
          }
          componentId={`${baseComponentId}.traces_table.filter_tooltip`}
        />
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Arrow />
        <Typography.Paragraph>
          <FormattedMessage
            defaultMessage="Search traces using a simplified version of the SQL {whereBold} clause."
            description="Tooltip string to explain how to search runs from the experiments table"
            values={{ whereBold: <b>WHERE</b> }}
          />
        </Typography.Paragraph>
        <FormattedMessage defaultMessage="Examples:" description="Text header for examples of mlflow search syntax" />
        <ul>
          <li>
            <code>tags.some_tag = "abc"</code>
          </li>
        </ul>
      </Popover.Content>
    </Popover.Root>
  );
};

export const TracesViewControls = ({
  experimentIds,
  filter,
  onChangeFilter,
  rowSelection,
  setRowSelection,
  refreshTraces,
  baseComponentId,
  runUuid,
  traces,
}: {
  experimentIds: string[];
  filter: string;
  onChangeFilter: (newFilter: string) => void;
  rowSelection: { [id: string]: boolean };
  setRowSelection: (newSelection: { [id: string]: boolean }) => void;
  refreshTraces: () => void;
  baseComponentId: string;
  runUuid?: string;
  traces: ModelTraceInfoWithRunName[];
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  // Internal filter value state, used to control the input value
  const [filterValue, setFilterValue] = useState<string | undefined>(filter || undefined);
  const [isEvaluateTracesModalOpen, setEvaluateTracesModalOpen] = useState(false);

  const displayedFilterValue = filterValue ?? filter;

  const selectedRequestIds = Object.entries(rowSelection)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => id);
  const showActionButtons = selectedRequestIds.length > 0;

  const searchOrDeleteControls = showActionButtons ? (
    <TracesViewControlsActions
      experimentIds={experimentIds}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      refreshTraces={refreshTraces}
      baseComponentId={baseComponentId}
    />
  ) : (
    <TableFilterLayout css={{ marginBottom: 0 }}>
      <Input
        componentId={`${baseComponentId}.traces_table.search_filter`}
        placeholder={intl.formatMessage({
          defaultMessage: 'Search traces',
          description: 'Experiment page > traces view filters > filter string input placeholder',
        })}
        value={displayedFilterValue}
        // Matches runs filter input width
        css={{ width: 430 }}
        onChange={(e) => setFilterValue(e.target.value)}
        prefix={<SearchIcon />}
        suffix={<InputTooltip baseComponentId={baseComponentId} />}
        allowClear
        onClear={() => {
          onChangeFilter('');
          setFilterValue(undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChangeFilter(displayedFilterValue);
            setFilterValue(undefined);
          }
        }}
      />
    </TableFilterLayout>
  );

  return (
    <div css={{ display: 'flex', gap: theme.spacing.xs }}>
      {/* Search and delete controls */}
      {searchOrDeleteControls}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewControlsActions.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewControlsActions.tsx
Signals: React

```typescript
import { Button, useDesignSystemTheme } from '@databricks/design-system';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TracesViewDeleteTraceModal } from './TracesViewDeleteTraceModal';

export const TracesViewControlsActions = ({
  experimentIds,
  rowSelection,
  setRowSelection,
  refreshTraces,
  baseComponentId,
}: {
  experimentIds: string[];
  rowSelection: { [id: string]: boolean };
  setRowSelection: (rowSelection: { [id: string]: boolean }) => void;
  refreshTraces: () => void;
  baseComponentId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useDesignSystemTheme();

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}
    >
      <Button componentId={`${baseComponentId}.traces_table.delete_traces`} onClick={openModal} danger>
        <FormattedMessage
          defaultMessage="Delete"
          description="Experiment page > traces view controls > Delete button"
        />
      </Button>
      <TracesViewDeleteTraceModal
        experimentIds={experimentIds}
        visible={isModalOpen}
        rowSelection={rowSelection}
        handleClose={closeModal}
        refreshTraces={refreshTraces}
        setRowSelection={setRowSelection}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewDeleteTraceModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewDeleteTraceModal.tsx
Signals: React

```typescript
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import { keys, pickBy } from 'lodash';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { MlflowService } from '../../sdk/MlflowService';
import { Modal, Typography } from '@databricks/design-system';

export const TracesViewDeleteTraceModal = ({
  experimentIds,
  visible,
  rowSelection,
  setRowSelection,
  handleClose,
  refreshTraces,
}: {
  experimentIds: string[];
  visible: boolean;
  rowSelection: { [id: string]: boolean };
  setRowSelection: (rowSelection: { [id: string]: boolean }) => void;
  handleClose: () => void;
  refreshTraces: () => void;
}) => {
  const intl = useIntl();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const tracesToDelete = keys(pickBy(rowSelection, (value) => value));

  const submitDeleteTraces = async () => {
    try {
      // TODO: Add support for deleting traces from multiple experiments
      // The trace data contains the experiment ID, so we simply need to
      // pass the trace data instead of just the trace IDs.
      await MlflowService.deleteTraces(experimentIds[0] ?? '', tracesToDelete);

      // reset row selection and refresh traces
      setRowSelection({});
      refreshTraces();
      handleClose();
    } catch (e: any) {
      setErrorMessage(
        intl.formatMessage({
          defaultMessage: 'An error occured while attempting to delete traces. Please refresh the page and try again.',
          description: 'Experiment page > traces view controls > Delete traces modal > Error message',
        }),
      );
    }
    setIsLoading(false);
  };

  const handleOk = () => {
    submitDeleteTraces();
    setIsLoading(true);
  };

  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracesviewdeletetracemodal.tsx_62"
      title={
        <FormattedMessage
          defaultMessage="{count, plural, one {Delete Trace} other {Delete Traces}}"
          description="Experiment page > traces view controls > Delete traces modal > Title"
          values={{ count: tracesToDelete.length }}
        />
      }
      visible={visible}
      onCancel={handleClose}
      okText={
        <FormattedMessage
          defaultMessage="Delete {count, plural, one { # trace } other { # traces }}"
          description="Experiment page > traces view controls > Delete traces modal > Delete button"
          values={{ count: tracesToDelete.length }}
        />
      }
      onOk={handleOk}
      okButtonProps={{ loading: isLoading, danger: true }}
    >
      {errorMessage && <Typography.Paragraph color="error">{errorMessage}</Typography.Paragraph>}
      <Typography.Paragraph>
        <Typography.Text bold>
          <FormattedMessage
            defaultMessage="{count, plural, one { # trace } other { # traces }} will be deleted."
            description="Experiment page > traces view controls > Delete traces modal > Confirmation message title"
            values={{
              count: tracesToDelete.length,
            }}
          />
        </Typography.Text>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FormattedMessage
          defaultMessage="Deleted traces cannot be restored. Are you sure you want to proceed?"
          description="Experiment page > traces view controls > Delete traces modal > Confirmation message"
        />
      </Typography.Paragraph>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesViewTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TracesViewTable.test.tsx

```typescript
import { jest, describe, test, expect, beforeEach, it } from '@jest/globals';
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { screen } from '@testing-library/react';
import type { TracesViewTableProps } from './TracesViewTable';
import { TracesViewTable } from './TracesViewTable';
import { renderWithIntl } from '../../../common/utils/TestUtils.react18';
import type { KeyValueEntity } from '../../../common/types';
import userEvent from '@testing-library/user-event';
import { ExperimentViewTracesTableColumns } from './TracesView.utils';
import { DesignSystemProvider } from '@databricks/design-system';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larger timeout for integration testing (table rendering)

const generateMockTrace = (
  uniqueId: string,
  timestampMs = 100,
  requestMetadata: KeyValueEntity[] = [],
  tags: KeyValueEntity[] = [],
): ModelTraceInfo => ({
  request_id: `tr-${uniqueId}`,
  experiment_id: 'test-experiment-id',
  timestamp_ms: 1712134300000 + timestampMs,
  execution_time_ms: timestampMs,
  status: 'OK',
  attributes: {},
  request_metadata: [...requestMetadata],
  tags: [
    {
      key: 'mlflow.traceName',
      value: `Trace name: ${uniqueId}`,
    },
    ...tags,
  ],
});

describe('ExperimentViewTracesTable', () => {
  const mockToggleHiddenColumn = jest.fn();
  const renderTestComponent = ({
    error,
    traces,
    disableTokenColumn = false,
    loading = false,
    hiddenColumns = [],
    usingFilters = false,
  }: Partial<TracesViewTableProps> = {}) => {
    return renderWithIntl(
      <DesignSystemProvider>
        <TracesViewTable
          experimentIds={['123']}
          hiddenColumns={hiddenColumns}
          error={error}
          traces={traces || []}
          hasNextPage={false}
          hasPreviousPage={false}
          loading={loading}
          onNextPage={() => {}}
          onPreviousPage={() => {}}
          onResetFilters={() => {}}
          sorting={[]}
          setSorting={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          disableTokenColumn={disableTokenColumn}
          baseComponentId="test"
          toggleHiddenColumn={mockToggleHiddenColumn}
          usingFilters={usingFilters}
        />
      </DesignSystemProvider>,
    );
  };

  test('renders the table with traces', () => {
    const mockTraces = new Array(12).fill(0).map((_, i) => generateMockTrace(`trace-${i + 1}`, i));
    renderTestComponent({ traces: mockTraces });
    expect(screen.getByRole('cell', { name: 'Trace name: trace-1' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Trace name: trace-12' })).toBeInTheDocument();
  });

  test('renders the table with trace full of data', () => {
    const mockTrace = generateMockTrace(
      'trace-test',
      123,
      [
        {
          key: 'mlflow.traceInputs',
          value: 'test-inputs',
        },
        {
          key: 'mlflow.traceOutputs',
          value: 'test-outputs',
        },
        {
          key: 'total_tokens',
          value: '1234',
        },
      ],
      [
        {
          key: 'some-test-tag',
          value: 'value',
        },
        {
          key: 'mlflow.source.type',
          value: 'NOTEBOOK',
        },
        {
          key: 'mlflow.source.name',
          value: '/Users/test@databricks.com/test-notebook',
        },
        {
          key: 'mlflow.databricks.notebookID',
          value: 'test-id',
        },
      ],
    );
    renderTestComponent({ traces: [mockTrace] });
    expect(screen.getByRole('cell', { name: 'Trace name: trace-test' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'test-inputs' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'test-outputs' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '1234' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /some-test-tag/ })).toBeInTheDocument();
    expect(screen.getByText('test-notebook')).toBeInTheDocument();
  });

  test('renders the table with trace when no tokens are present', () => {
    const mockTraces = new Array(12).fill(0).map((_, i) => generateMockTrace(`trace-${i + 1}`, i));

    renderTestComponent({ traces: mockTraces, disableTokenColumn: true });
    expect(screen.queryByRole('columnheader', { name: 'Tokens' })).not.toBeInTheDocument();
  });

  test('renders the table with error', () => {
    renderTestComponent({ traces: [], error: new Error('Test error') });
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  test('renders the quickstart when no traces are present', () => {
    renderTestComponent({ traces: [] });
    expect(document.body.textContent).not.toBe('');
  });

  test('renders the empty message when using filters with no results', () => {
    renderTestComponent({ traces: [], usingFilters: true });
    expect(screen.getByText('No traces found')).toBeInTheDocument();
    expect(screen.getByText('Reset filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select columns/i })).toBeInTheDocument();
  });

  describe('Column selector', () => {
    const user = userEvent.setup();
    beforeEach(() => {
      jest.clearAllMocks();
    });

    async function openColumnSelector(hiddenColumns: string[] = []) {
      // Add at least one trace to ensure the table is rendered with the column selector
      const mockTraces = [generateMockTrace('test-trace')];
      renderTestComponent({ traces: mockTraces, hiddenColumns });
      const columnSelectorButton = screen.getByRole('button', { name: /select columns/i });
      await user.click(columnSelectorButton);
    }

    it('renders the column selector dropdown', async () => {
      await openColumnSelector();

      // Verify dropdown content
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('shows correct checkbox states based on hidden columns', async () => {
      await openColumnSelector([ExperimentViewTracesTableColumns.tags]);

      // Check that the Tags column checkbox is unchecked
      const tagsCheckbox = screen.getByRole('menuitemcheckbox', { name: /tags/i });
      expect(tagsCheckbox).toHaveAttribute('aria-checked', 'false');

      // Check that other column checkboxes are checked
      expect(screen.getByRole('menuitemcheckbox', { name: /request id/i })).toHaveAttribute('aria-checked', 'true');
    });

    it('calls toggleHiddenColumn when a checkbox is clicked', async () => {
      await openColumnSelector([ExperimentViewTracesTableColumns.tags]);

      // Click the Tags column checkbox
      const tagsCheckbox = screen.getByRole('menuitemcheckbox', { name: /tags/i });
      await user.click(tagsCheckbox);

      // Verify that toggleHiddenColumn was called with the correct column ID
      expect(mockToggleHiddenColumn).toHaveBeenCalledWith(ExperimentViewTracesTableColumns.tags);
    });
  });
});
```

--------------------------------------------------------------------------------

````

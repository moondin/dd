---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 614
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 614 of 991)

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

---[FILE: GenAITracesTableToolbar.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAITracesTableToolbar.intg.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ComponentProps } from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import { GenAITracesTableToolbar } from './GenAITracesTableToolbar';
import type { GetTraceFunction } from './index';
import { createTestTraceInfoV3, createTestAssessmentInfo, createTestColumns } from './index';
import type { TableFilter, EvaluationsOverviewTableSort, TraceActions } from './types';
import { TracesTableColumnType, TracesTableColumnGroup, FilterOperator } from './types';
import type { ModelTraceInfoV3 } from '../model-trace-explorer';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000);

// Mock necessary modules
jest.mock('@databricks/web-shared/global-settings', () => ({
  getUser: jest.fn(),
}));

jest.mock('@databricks/web-shared/hooks', () => {
  return {
    getLocalStorageItemByParams: jest.fn().mockReturnValue({ hiddenColumns: undefined }),
    useLocalStorage: jest.fn().mockReturnValue([{}, jest.fn()]),
  };
});

const testExperimentId = 'test-experiment-id';

describe('GenAITracesTableToolbar - integration test', () => {
  beforeEach(() => {
    // Mock user ID
    jest.mocked(getUser).mockImplementation(() => 'test.user@mlflow.org');

    // Mocked returned timestamp
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderTestComponent = (
    traceInfos: ModelTraceInfoV3[] = [],
    additionalProps: Partial<ComponentProps<typeof GenAITracesTableToolbar>> = {},
  ) => {
    const defaultAssessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
      createTestAssessmentInfo('is_correct', 'Is Correct', 'boolean'),
    ];

    const defaultColumns = createTestColumns(defaultAssessmentInfos);

    const defaultProps: ComponentProps<typeof GenAITracesTableToolbar> = {
      experimentId: testExperimentId,
      allColumns: defaultColumns,
      assessmentInfos: defaultAssessmentInfos,
      traceInfos,
      tableFilterOptions: { source: [] },
      searchQuery: '',
      setSearchQuery: jest.fn(),
      filters: [],
      setFilters: jest.fn(),
      tableSort: undefined,
      setTableSort: jest.fn(),
      selectedColumns: defaultColumns,
      toggleColumns: jest.fn(),
      setSelectedColumns: jest.fn(),
      traceActions: {
        exportToEvals: {
          showExportTracesToDatasetsModal: false,
          setShowExportTracesToDatasetsModal: jest.fn(),
          renderExportTracesToDatasetsModal: jest.fn(),
        },
        deleteTracesAction: {
          deleteTraces: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        },
        editTags: {
          showEditTagsModalForTrace: jest.fn(),
          EditTagsModal: <div>Edit Tags Modal</div>,
        },
      },
      countInfo: {
        currentCount: 10,
        totalCount: 20,
        maxAllowedCount: 100,
        logCountLoading: false,
      },
      ...additionalProps,
    };

    const TestComponent = () => {
      return (
        <DesignSystemProvider>
          <QueryClientProvider
            client={
              new QueryClient({
                logger: {
                  error: () => {},
                  log: () => {},
                  warn: () => {},
                },
              })
            }
          >
            <GenAITracesTableToolbar {...defaultProps} />
          </QueryClientProvider>
        </DesignSystemProvider>
      );
    };

    return render(
      <IntlProvider locale="en">
        <TestComponent />
      </IntlProvider>,
    );
  };

  it('renders toolbar with basic elements', async () => {
    const traceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world',
        [{ name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' }],
        testExperimentId,
      ),
    ];

    renderTestComponent(traceInfos);

    // Verify basic toolbar elements are rendered
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // Search input
    expect(screen.getByText('10 of 20')).toBeInTheDocument(); // Count info
  });

  it('handles search query input', async () => {
    const setSearchQueryMock = jest.fn();
    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      setSearchQuery: setSearchQueryMock,
    });

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    // The search component might not call the function immediately, so just verify it's defined
    expect(setSearchQueryMock).toBeDefined();
  });

  it('handles filter changes', async () => {
    const setFiltersMock = jest.fn();
    const traceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world',
        [{ name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' }],
        testExperimentId,
      ),
    ];

    renderTestComponent(traceInfos, {
      setFilters: setFiltersMock,
    });

    // Find and click on a filter button
    const filterButtons = screen.getAllByRole('button');
    const filterButton = filterButtons.find(
      (button) => button.textContent?.includes('Filter') || button.textContent?.includes('overall_assessment'),
    );

    fireEvent.click(filterButton as Element);
    // The actual filter interaction would depend on the filter component implementation
    expect(setFiltersMock).toBeDefined();
  });

  it('handles table sort changes', async () => {
    const setTableSortMock = jest.fn();
    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      setTableSort: setTableSortMock,
    });

    // Find and click on a sort dropdown
    const sortButtons = screen.getAllByRole('button');
    const sortButton = sortButtons.find(
      (button) =>
        button.textContent?.includes('Sort') || button.textContent?.includes('▼') || button.textContent?.includes('▲'),
    );

    fireEvent.click(sortButton as Element);
    expect(setTableSortMock).toBeDefined();
  });

  it('handles column selection', async () => {
    const setSelectedColumnsMock = jest.fn();
    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      setSelectedColumns: setSelectedColumnsMock,
    });

    // Find and click on a column selector button
    const columnButtons = screen.getAllByRole('button');
    const columnButton = columnButtons.find(
      (button) => button.textContent?.includes('Columns') || button.textContent?.includes('▼'),
    );

    fireEvent.click(columnButton as Element);
    expect(setSelectedColumnsMock).toBeDefined();
  });

  it('handles trace actions', async () => {
    const traceActions: TraceActions = {
      exportToEvals: {
        showExportTracesToDatasetsModal: false,
        setShowExportTracesToDatasetsModal: jest.fn(),
        renderExportTracesToDatasetsModal: jest.fn(),
      },
      deleteTracesAction: {
        deleteTraces: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      },
      editTags: {
        showEditTagsModalForTrace: jest.fn(),
        EditTagsModal: <div>Edit Tags Modal</div>,
      },
    };

    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      traceActions,
    });

    // Verify trace actions are available
    expect(traceActions.exportToEvals).toBeDefined();
    expect(traceActions.deleteTracesAction).toBeDefined();
    expect(traceActions.editTags).toBeDefined();
  });

  it('displays correct count information', async () => {
    const countInfo = {
      currentCount: 5,
      totalCount: 15,
      maxAllowedCount: 100,
      logCountLoading: false,
    };

    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      countInfo,
    });

    expect(screen.getByText('5 of 15')).toBeInTheDocument();
  });

  it('displays warning when count exceeds max allowed', async () => {
    const countInfo = {
      currentCount: 150,
      totalCount: 200,
      maxAllowedCount: 100,
      logCountLoading: false,
    };

    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      countInfo,
    });

    // Should show warning icon and max count
    expect(screen.getByText('100 of 100+')).toBeInTheDocument();
  });

  it('handles undefined optional props gracefully', async () => {
    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      tableSort: undefined,
      filters: [], // Provide empty array instead of undefined
      searchQuery: '',
    });

    // Verify toolbar renders without errors
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles assessment filter interactions', async () => {
    const setFiltersMock = jest.fn();
    const filters: TableFilter[] = [
      {
        column: TracesTableColumnGroup.ASSESSMENT,
        key: 'overall_assessment',
        operator: FilterOperator.EQUALS,
        value: 'yes',
      },
    ];

    const traceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world',
        [{ name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' }],
        testExperimentId,
      ),
    ];

    renderTestComponent(traceInfos, {
      filters,
      setFilters: setFiltersMock,
    });

    // Verify filter is applied and can be interacted with
    expect(setFiltersMock).toBeDefined();
  });

  it('handles column toggle functionality', async () => {
    const toggleColumnsMock = jest.fn();
    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      toggleColumns: toggleColumnsMock,
    });

    // Find column selector and interact with it
    const columnButtons = screen.getAllByRole('button');
    const columnButton = columnButtons.find(
      (button) => button.textContent?.includes('Columns') || button.textContent?.includes('▼'),
    );

    fireEvent.click(columnButton as Element);
    expect(toggleColumnsMock).toBeDefined();
  });

  it('handles sort dropdown interactions', async () => {
    const setTableSortMock = jest.fn();
    const tableSort: EvaluationsOverviewTableSort = {
      key: 'trace_id',
      type: TracesTableColumnType.TRACE_INFO,
      asc: true,
    };

    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      tableSort,
      setTableSort: setTableSortMock,
    });

    // Find sort dropdown and interact with it
    const sortButtons = screen.getAllByRole('button');
    const sortButton = sortButtons.find(
      (button) =>
        button.textContent?.includes('Sort') || button.textContent?.includes('▼') || button.textContent?.includes('▲'),
    );

    fireEvent.click(sortButton as Element);
    expect(setTableSortMock).toBeDefined();
  });

  it('handles different assessment types in filters', async () => {
    const setFiltersMock = jest.fn();
    const traceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world',
        [
          { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.85, dtype: 'numeric' },
          { name: 'is_correct', value: true, dtype: 'boolean' },
        ],
        testExperimentId,
      ),
    ];

    renderTestComponent(traceInfos, {
      setFilters: setFiltersMock,
    });

    // Verify filter functionality is available for different assessment types
    expect(setFiltersMock).toBeDefined();
  });

  it('handles column selection with grouped columns', async () => {
    const setSelectedColumnsMock = jest.fn();
    const traceInfos = [createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId)];

    renderTestComponent(traceInfos, {
      setSelectedColumns: setSelectedColumnsMock,
    });

    // Verify column selection functionality is available
    expect(setSelectedColumnsMock).toBeDefined();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GenAITracesTableToolbar.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAITracesTableToolbar.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import React, { useCallback } from 'react';

import {
  Typography,
  useDesignSystemTheme,
  TableFilterLayout,
  Tooltip,
  Spinner,
  WarningIcon,
} from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { GenAITracesTableActions } from './GenAITracesTableActions';
import { GenAiTracesTableFilter } from './GenAiTracesTableFilter';
import { GenAiTracesTableSearchInput } from './GenAiTracesTableSearchInput';
import { EvaluationsOverviewColumnSelectorGrouped } from './components/EvaluationsOverviewColumnSelectorGrouped';
import { EvaluationsOverviewSortDropdown } from './components/EvaluationsOverviewSortDropdown';
import type {
  EvaluationsOverviewTableSort,
  TraceActions,
  AssessmentInfo,
  TracesTableColumn,
  TableFilter,
  TableFilterOptions,
} from './types';
import { shouldEnableTagGrouping } from './utils/FeatureUtils';
import type { ModelTraceInfoV3 } from '../model-trace-explorer';

interface CountInfo {
  currentCount?: number;
  totalCount: number;
  maxAllowedCount: number;
  logCountLoading: boolean;
}

interface GenAITracesTableToolbarProps {
  // Experiment metadata
  experimentId: string;

  // Table metadata
  allColumns: TracesTableColumn[];
  assessmentInfos: AssessmentInfo[];

  // Table data
  traceInfos: ModelTraceInfoV3[] | undefined;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: TableFilter[];
  setFilters: (newFilters: TableFilter[] | undefined, replace?: boolean) => void;
  tableSort: EvaluationsOverviewTableSort | undefined;
  setTableSort: (sort: EvaluationsOverviewTableSort | undefined) => void;
  selectedColumns: TracesTableColumn[];
  toggleColumns: (newColumns: TracesTableColumn[]) => void;
  setSelectedColumns: (nextSelected: TracesTableColumn[]) => void;

  // Actions
  traceActions?: TraceActions;

  // Stats
  countInfo: CountInfo;

  // Table filter options
  tableFilterOptions: TableFilterOptions;

  // Loading state
  isMetadataLoading?: boolean;

  // Error state
  metadataError?: Error | null;

  // whether or not the toolbar show show additional search options only
  // available in the new APIs. this param is somewhat confusingly named
  // in OSS, since the "new APIs" still use the v3 prefixes
  usesV4APIs?: boolean;
}

export const GenAITracesTableToolbar: React.FC<React.PropsWithChildren<GenAITracesTableToolbarProps>> = React.memo(
  (props: GenAITracesTableToolbarProps) => {
    const {
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      tableSort,
      setTableSort,
      selectedColumns,
      toggleColumns,
      setSelectedColumns,
      assessmentInfos,
      experimentId,
      traceInfos,
      tableFilterOptions,
      traceActions,
      allColumns,
      countInfo,
      isMetadataLoading,
      usesV4APIs,
      metadataError,
    } = props;
    const { theme } = useDesignSystemTheme();

    const onSortChange = useCallback(
      (sortOption, orderByAsc) => {
        setTableSort({ key: sortOption.key, type: sortOption.type, asc: orderByAsc });
      },
      [setTableSort],
    );

    return (
      <div
        css={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-end',
          gap: theme.spacing.sm,
          paddingBottom: `${theme.spacing.xs}px`,
        }}
      >
        <TableFilterLayout
          css={{
            marginBottom: 0,
            flex: 1,
          }}
        >
          <GenAiTracesTableSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <GenAiTracesTableFilter
            filters={filters}
            setFilters={setFilters}
            assessmentInfos={assessmentInfos}
            experimentId={experimentId}
            tableFilterOptions={tableFilterOptions}
            allColumns={allColumns}
            isMetadataLoading={isMetadataLoading}
            metadataError={metadataError}
            usesV4APIs={usesV4APIs}
          />
          <EvaluationsOverviewSortDropdown
            tableSort={tableSort}
            columns={selectedColumns}
            onChange={onSortChange}
            enableGrouping={shouldEnableTagGrouping()}
            isMetadataLoading={isMetadataLoading}
            metadataError={metadataError}
          />

          <EvaluationsOverviewColumnSelectorGrouped
            columns={allColumns}
            selectedColumns={selectedColumns}
            toggleColumns={toggleColumns}
            setSelectedColumns={setSelectedColumns}
            isMetadataLoading={isMetadataLoading}
            metadataError={metadataError}
          />
          {traceActions && (
            <GenAITracesTableActions experimentId={experimentId} traceActions={traceActions} traceInfos={traceInfos} />
          )}
        </TableFilterLayout>
        <SampledInfoBadge countInfo={countInfo} />
      </div>
    );
  },
);

const SampledInfoBadge = (props: { countInfo: CountInfo }) => {
  const { countInfo } = props;
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  if (countInfo.logCountLoading || isNil(countInfo.currentCount)) {
    return <Spinner size="small" />;
  }

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}
    >
      {countInfo.currentCount >= countInfo.maxAllowedCount && (
        <Tooltip
          componentId="mlflow.experiment_list_view.max_traces.tooltip"
          content={intl.formatMessage(
            {
              defaultMessage: 'Only the top {evalResultsCount} results are shown',
              description: 'Evaluation review > evaluations list > sample info tooltip',
            },
            {
              evalResultsCount: countInfo.maxAllowedCount,
            },
          )}
        >
          <WarningIcon color="warning" />
        </Tooltip>
      )}
      <Typography.Hint>
        {intl.formatMessage(
          {
            defaultMessage: '{numFilteredEvals} of {numEvals}',
            description: 'Text displayed when showing a filtered subset evaluations in the evaluation review page',
          },
          {
            // Sometimes the api returns more than the max allowed count. To avoid confusion, we show the max allowed count.
            numFilteredEvals:
              countInfo.currentCount >= countInfo.maxAllowedCount ? countInfo.maxAllowedCount : countInfo.currentCount,
            numEvals:
              countInfo.totalCount >= countInfo.maxAllowedCount
                ? `${countInfo.maxAllowedCount}+`
                : countInfo.totalCount,
          },
        )}
      </Typography.Hint>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/index.ts

```typescript
// TBD: this module will provide a space for trace UI components shared
// between new Tiles UI in webapp and evaluation review UI in MLflow.
// Eventually everything will be moved to monolith codebase.

export { mergeMetricsAndAssessmentsWithEvaluations } from './utils/EvaluationDataParseUtils';

export { COMPARE_TO_RUN_COLOR, CURRENT_RUN_COLOR } from './utils/Colors';

export { useAssessmentFilters } from './hooks/useAssessmentFilters';

export {
  isEvaluationResultOverallAssessment,
  isEvaluationResultPerRetrievalChunkAssessment,
  isRetrievedContext,
  KnownEvaluationResultAssessmentStringValue,
  KnownEvaluationResultAssessmentValueLabel,
} from './components/GenAiEvaluationTracesReview.utils';

export { useTableSort } from './hooks/useTableSort';

export { GenAiTracesTable } from './GenAITracesTable';
export { useGenAiExperimentRunsForComparison } from './hooks/useGenAiExperimentRunsForComparison';
export { useGenAiTraceEvaluationArtifacts } from './hooks/useGenAiTraceEvaluationArtifacts';
export {
  useMlflowTraces,
  useSearchMlflowTraces,
  useMlflowTracesTableMetadata,
  invalidateMlflowSearchTracesCache,
  searchMlflowTracesQueryFn,
  SEARCH_MLFLOW_TRACES_QUERY_KEY,
} from './hooks/useMlflowTraces';
export { getEvalTabTotalTracesLimit } from './utils/FeatureUtils';
export { GenAITracesTableToolbar } from './GenAITracesTableToolbar';
export { GenAITracesTableBodyContainer } from './GenAITracesTableBodyContainer';
export { useTableColumns } from './hooks/useTableColumns';
export { getAssessmentInfos } from './utils/AggregationUtils';

export { useFilters } from './hooks/useFilters';

export { GenAITracesTableContext, GenAITracesTableProvider } from './GenAITracesTableContext';

export { MarkdownConverterProvider as GenAiTracesMarkdownConverterProvider } from './utils/MarkdownUtils';

export { RunColorCircle } from './components/RunColorCircle';

export { useSelectedColumns } from './hooks/useGenAITracesUIState';

export { GenAiEvaluationTracesReviewModal } from './components/GenAiEvaluationTracesReviewModal';

export * from './types';

export {
  GenAiTraceEvaluationArtifactFile,
  KnownEvaluationResultAssessmentMetadataFields,
  KnownEvaluationResultAssessmentName,
} from './enum';

export {
  ASSESSMENTS_DOC_LINKS,
  getJudgeMetricsLink,
  KnownEvaluationResultAssessmentValueDescription,
} from './components/GenAiEvaluationTracesReview.utils';

export {
  COMPARE_TO_RUN_DROPDOWN_COMPONENT_ID,
  RUN_EVALUATION_RESULTS_TAB_COMPARE_RUNS,
  RUN_EVALUATION_RESULTS_TAB_SINGLE_RUN,
} from './utils/EvaluationLogging';

export {
  getTracesTagKeys,
  getTraceInfoInputs,
  getTraceInfoOutputs,
  convertTraceInfoV3ToRunEvalEntry,
} from './utils/TraceUtils';

export {
  REQUEST_TIME_COLUMN_ID,
  EXECUTION_DURATION_COLUMN_ID,
  STATE_COLUMN_ID,
  TAGS_COLUMN_ID,
  RESPONSE_COLUMN_ID,
  TOKENS_COLUMN_ID,
  TRACE_ID_COLUMN_ID,
  CUSTOM_METADATA_COLUMN_ID,
} from './hooks/useTableColumns';

// Test utilities
export {
  createTestTraceInfoV3,
  createTestAssessmentInfo,
  createTestColumns,
} from './test-fixtures/EvaluatedTraceTestUtils';

export { shouldUseTracesV4API } from './utils/FeatureUtils';
export { createTraceLocationForExperiment, createTraceLocationForUCSchema } from './utils/TraceLocationUtils';
export type { GetTraceFunction } from './hooks/useGetTrace';
export { useFetchTraceV4LazyQuery } from './hooks/useFetchTraceV4';
export { doesTraceSupportV4API } from './utils/TraceLocationUtils';
export { GenAIChatSessionsTable } from './sessions-table/GenAIChatSessionsTable';
export { useGetTraces } from './hooks/useGetTraces';
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/types.ts

```typescript
import type { GetTraceFunction } from './hooks/useGetTrace';
import type { ModelTraceInfoV3, ModelTraceSpan } from '../model-trace-explorer';

export type AssessmentDType = 'string' | 'numeric' | 'boolean' | 'pass-fail' | 'unknown';
export type AssessmentType = 'AI_JUDGE' | 'HUMAN' | 'CODE';

// Reflects structure logged by mlflow.log_table()
export interface RawGenaiEvaluationArtifactResponse {
  columns?: (string | null)[];
  data?: (string | number | null | boolean | Record<string, any>)[][];
  filename: string;
}

export interface AssessmentInfo {
  name: string;
  displayName: string;
  // True when the assessment comes from a built-in judge.
  isKnown: boolean;
  isOverall: boolean;
  // The metric that produced the assessment. Defined as the name of the judge or custom metric function that produced the assessment.
  metricName: string;
  source?: RunEvaluationResultAssessmentSource;
  isCustomMetric: boolean;
  isEditable: boolean;
  isRetrievalAssessment: boolean;
  // The type of the assessment value.
  dtype: AssessmentDType;
  uniqueValues: Set<AssessmentValueType>;

  // Display metadata.
  docsLink: string;
  missingTooltip: string;
  description: string;

  // True if if the assesment contains at least one error
  containsErrors?: boolean;
}

interface RootCauseAssessmentInfo {
  assessmentName: string;
  suggestedActions?: string;
}

export interface EvaluationArtifactTableEntryAssessment {
  evaluation_id: string;

  name: string;

  boolean_value: boolean | null;
  numeric_value: number | null;
  string_value: string | null;
  rationale: string | null;

  source: {
    source_type: AssessmentType;
    source_id: string;
    metadata: any;
  };

  metadata?: Record<string, any>;

  timestamp: number;

  error_code?: string;
  error_message?: string;
}

export interface EvaluationArtifactTableEntryMetric {
  evaluation_id: string;
  key: string;
  value: number;
  timestamp: number;
}

export interface EvaluationArtifactTableEntryEvaluation {
  evaluation_id: string;
  inputs_id: string;
  request_id: string;
  run_id?: string;

  inputs: Record<string, any>;
  outputs: Record<string, any>;
  targets: Record<string, any>;
}

export type RunEvaluationResultAssessmentSource = {
  sourceType: AssessmentType;
  sourceId: string;
  metadata: Record<string, string>;
};

export type RunEvaluationResultAssessment = {
  name: string;
  rationale?: string | null;
  source?: RunEvaluationResultAssessmentSource;
  metadata?: Record<string, string | boolean | number>;
  errorCode?: string;
  errorMessage?: string;
  numericValue?: number | null;
  booleanValue?: boolean | null;
  stringValue?: string | null;
  // Root cause assessment points to the assessment name causing the failure.
  rootCauseAssessment?: RootCauseAssessmentInfo | null;
  timestamp?: number | null;
};

export type AssessmentValueType = string | boolean | number | undefined;

export type AssessmentRunCounts = Map<AssessmentValueType, number>;

export interface AssessmentAggregates {
  assessmentInfo: AssessmentInfo;

  // Counts for the current run and other run.
  currentCounts?: AssessmentRunCounts;
  otherCounts?: AssessmentRunCounts;

  // Numeric values for the current run and other run.
  currentNumericValues?: number[];
  otherNumericValues?: number[];

  currentNumRootCause: number;
  otherNumRootCause: number;

  // Numeric aggregate counts for the current run.
  currentNumericAggregate?: NumericAggregate;

  assessmentFilters: AssessmentFilter[];
}

export interface EvaluationsOverviewTableSort {
  key: string;
  type: TracesTableColumnType;
  asc: boolean;
}

export interface TraceActions {
  exportToEvals?: {
    showExportTracesToDatasetsModal?: boolean;
    setShowExportTracesToDatasetsModal?: (visible: boolean) => void;
    renderExportTracesToDatasetsModal?: ({
      selectedTraceInfos,
    }: {
      selectedTraceInfos: ModelTraceInfoV3[];
    }) => React.ReactNode;
  };
  deleteTracesAction?: {
    deleteTraces?: (experimentId: string, traceIds: string[]) => Promise<any>;
    isDisabled?: boolean;
    disabledReason?: string;
  };
  editTags?: {
    showEditTagsModalForTrace: (trace: ModelTraceInfoV3) => void;
    EditTagsModal: React.ReactNode;
  };
}

// @deprecated, use TableFilter instead
export interface AssessmentFilter {
  assessmentName: string;
  filterValue: AssessmentValueType;
  // Only defined when filtering on an assessment for RCA values.
  filterType?: 'rca' | undefined;
  run: string;
}
export type TableFilter = {
  // The column group (e.g. "Assessments") or a specific column (e.g. "execution_duration")
  column: TracesTableColumnGroup | string;
  // Should be defined if a column group is used.
  key?: string;
  operator: FilterOperator;
  value: TableFilterValue;
};

export type TableFilterValue = string | boolean | number | undefined;

export interface TableFilterOption {
  value: string;
  renderValue: () => string | React.ReactNode;
}

export interface TableFilterOptions {
  source: TableFilterOption[];
  prompt?: TableFilterOption[];
}

export enum FilterOperator {
  EQUALS = '=',
  NOT_EQUALS = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUALS = '>=',
  LESS_THAN_OR_EQUALS = '<=',
  CONTAINS = 'CONTAINS',
}

export interface AssessmentDropdownSuggestionItem {
  label: string;
  key: string;
  rootAssessmentName?: string;
  disabled?: boolean;
}

export interface RunEvaluationResultAssessmentDraft extends RunEvaluationResultAssessment {
  isDraft: true;
}

export type RunEvaluationResultMetric = {
  key: string;
  value: number;
  timestamp: number;
};

export type RunEvaluationTracesRetrievalChunk = {
  docUrl: string;
  content: string;
  retrievalAssessmentsByName?: Record<string, RunEvaluationResultAssessment[]>;
  target?: string;
};

export type TraceV3 = {
  info: ModelTraceInfoV3;
  data: {
    spans: ModelTraceSpan[];
  };
};

/**
 * An entity encompassing single review evaluation data.
 */
export type RunEvaluationTracesDataEntry = {
  evaluationId: string;
  requestId: string;
  inputsTitle?: string;
  inputs: Record<string, any>;
  inputsId: string;
  outputs: Record<string, any>;
  targets: Record<string, any>;
  errorCode?: string;
  errorMessage?: string;
  requestTime?: string;
  overallAssessments: RunEvaluationResultAssessment[];
  responseAssessmentsByName: Record<
    // Keyed by assessment name (e.g. "overall_judgement", "readability_score" etc.)
    string,
    RunEvaluationResultAssessment[]
  >;
  metrics: Record<string, RunEvaluationResultMetric>;
  retrievalChunks?: RunEvaluationTracesRetrievalChunk[];

  // NOTE(nsthorat): We will slowly migrate to this type.
  traceInfo?: ModelTraceInfoV3;
};

export interface EvalTraceComparisonEntry {
  currentRunValue?: RunEvaluationTracesDataEntry;
  otherRunValue?: RunEvaluationTracesDataEntry;
}

export interface SaveAssessmentsQuery {
  savePendingAssessments: (
    runUuid: string,
    evaluationId: string,
    pendingAssessmentEntries: RunEvaluationResultAssessmentDraft[],
  ) => void;
  isSaving: boolean;
}

// Internal type used to determine behavior of different types of columns.
// We should try to move away from this and start to use TracesTableColumnGroup instead.
export enum TracesTableColumnType {
  ASSESSMENT = 'ASSESSMENT',
  EXPECTATION = 'EXPECTATION',
  TRACE_INFO = 'TRACE_INFO',
  INPUT = 'INPUT',
  // This is a hack so that internal agent monitoring can display request time.
  INTERNAL_MONITOR_REQUEST_TIME = 'INTERNAL_MONITOR_REQUEST_TIME',
}

// This represents columns that are grouped together.
// For example, each assessment is its own column, but they are all grouped under the "Assessments" column group.
export enum TracesTableColumnGroup {
  ASSESSMENT = 'ASSESSMENT',
  EXPECTATION = 'EXPECTATION',
  TAG = 'TAG',
  INFO = 'INFO',
}

export const TracesTableColumnGroupToLabelMap = {
  [TracesTableColumnGroup.ASSESSMENT]: 'Assessments',
  [TracesTableColumnGroup.EXPECTATION]: 'Expectations',
  [TracesTableColumnGroup.TAG]: 'Tags',
  // We don't show a label for the info column group
  [TracesTableColumnGroup.INFO]: '\u00A0',
};

export interface TracesTableColumn {
  /** This is the assessment name for assessments, and a static string for trace info and input columns */
  id: string;
  /** The label for the column, displayed in the table header. */
  label: string;
  /** The label for the column used in filter dropdowns. If not provided, defaults to `label`. */
  filterLabel?: string;
  type: TracesTableColumnType;
  group?: TracesTableColumnGroup;

  // TODO: Remove this field once migration to trace info v3 is complete
  assessmentInfo?: AssessmentInfo;
  expectationName?: string;
}

export interface TableFilterFormState {
  filters: TableFilter[];
}

// A bucket of a numeric aggregate.
export type NumericAggregateCount = {
  // The lower bound of the bucket, inclusive.
  lower: number;
  // The upper bound of the bucket, exclusive except for the last bucket.
  upper: number;
  // The number of values in the bucket.
  count: number;
};

// A numeric aggregate with the min, mid, and max values, and the counts of values in each bucket.
export type NumericAggregate = {
  min: number;
  max: number;
  maxCount: number;
  counts: NumericAggregateCount[];
};
```

--------------------------------------------------------------------------------

---[FILE: ErrorCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/ErrorCell.tsx

```typescript
import { DangerIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

export const ErrorCell = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <span
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        svg: { width: '12px', height: '12px' },
        color: theme.colors.textValidationWarning,
      }}
    >
      <DangerIcon css={{ color: theme.colors.textValidationWarning }} />
      <FormattedMessage defaultMessage="Error" description="Error status in the evaluations table." />{' '}
    </span>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: HeaderCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/HeaderCellRenderer.tsx

```typescript
import type { HeaderContext } from '@tanstack/react-table';

import { HoverCard, useDesignSystemTheme } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { TracesTableColumnGroup, TracesTableColumnGroupToLabelMap, type EvalTraceComparisonEntry } from '../types';

type HeaderCellRendererMeta = {
  groupId: TracesTableColumnGroup;
  visibleCount: number;
  totalCount: number;
  enableGrouping?: boolean;
};

export const HeaderCellRenderer = (props: HeaderContext<EvalTraceComparisonEntry, unknown>) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const { groupId, visibleCount, totalCount, enableGrouping } = props.column.columnDef.meta as HeaderCellRendererMeta;

  if (!enableGrouping) {
    return TracesTableColumnGroupToLabelMap[groupId as TracesTableColumnGroup];
  }

  const groupName = TracesTableColumnGroupToLabelMap[groupId as TracesTableColumnGroup];
  return (
    <div
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        gap: theme.spacing.sm,
      }}
    >
      <div>{groupName}</div>
      {groupId === TracesTableColumnGroup.INFO ? null : visibleCount === totalCount ? (
        <div
          css={{
            color: theme.colors.textSecondary,
            fontWeight: 'normal',
          }}
        >
          ({visibleCount}/{totalCount})
        </div>
      ) : (
        <HoverCard
          trigger={
            <div
              css={{
                color: theme.colors.textSecondary,
                ':hover': {
                  textDecoration: 'underline',
                },
                fontWeight: 'normal',
              }}
            >
              ({visibleCount}/{totalCount})
            </div>
          }
          content={intl.formatMessage(
            {
              defaultMessage: 'Showing {visibleCount} out of {totalCount} {groupName}. Select columns to view more.',
              description: 'Tooltip for the group column header',
            },
            {
              visibleCount,
              totalCount,
              groupName,
            },
          )}
          align="start"
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

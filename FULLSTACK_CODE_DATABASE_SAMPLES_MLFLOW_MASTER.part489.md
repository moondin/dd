---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 489
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 489 of 991)

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

---[FILE: TracesV3Logs.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3Logs.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TracesV3Logs } from './TracesV3Logs';
import { IntlProvider } from '@databricks/i18n';
import { QueryClient, QueryClientProvider, type UseMutateAsyncFunction } from '@databricks/web-shared/query-client';
import { DesignSystemProvider } from '@databricks/design-system';
import {
  useMlflowTracesTableMetadata,
  useSearchMlflowTraces,
  useSelectedColumns,
  useFilters,
  useTableSort,
  GenAITracesTableProvider,
  REQUEST_TIME_COLUMN_ID,
  TracesTableColumnType,
  TracesTableColumnGroup,
} from '@databricks/web-shared/genai-traces-table';
import { useSetInitialTimeFilter } from './hooks/useSetInitialTimeFilter';
import { useDeleteTracesMutation } from '../../../evaluations/hooks/useDeleteTraces';
import { useEditExperimentTraceTags } from '../../../traces/hooks/useEditExperimentTraceTags';
import { useMarkdownConverter } from '@mlflow/mlflow/src/common/utils/MarkdownUtils';
import { GenericNetworkRequestError } from '@mlflow/mlflow/src/shared/web-shared/errors/PredefinedErrors';
import { TestRouter, testRoute, waitForRoutesToBeRendered } from '@mlflow/mlflow/src/common/utils/RoutingTestUtils';

// Mock all external dependencies
jest.mock('@databricks/web-shared/genai-traces-table', () => {
  const actual = jest.requireActual<typeof import('@databricks/web-shared/genai-traces-table')>(
    '@databricks/web-shared/genai-traces-table',
  );
  return {
    ...actual,
    useMlflowTracesTableMetadata: jest.fn(),
    useSearchMlflowTraces: jest.fn(),
    useSelectedColumns: jest.fn(),
    useFilters: jest.fn(),
    useTableSort: jest.fn(),
    invalidateMlflowSearchTracesCache: jest.fn(),
  };
});

jest.mock('./hooks/useSetInitialTimeFilter', () => ({
  useSetInitialTimeFilter: jest.fn(),
}));

jest.mock('../../../evaluations/hooks/useDeleteTraces', () => ({
  useDeleteTracesMutation: jest.fn(),
}));

jest.mock('../../../traces/hooks/useEditExperimentTraceTags', () => ({
  useEditExperimentTraceTags: jest.fn(),
}));
jest.mock('@mlflow/mlflow/src/common/utils/MarkdownUtils', () => ({
  useMarkdownConverter: jest.fn(),
}));

jest.mock('@mlflow/mlflow/src/common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('@mlflow/mlflow/src/common/utils/FeatureUtils')>(
    '@mlflow/mlflow/src/common/utils/FeatureUtils',
  ),
  shouldEnableTagGrouping: jest.fn().mockReturnValue(true),
}));

jest.mock('@mlflow/mlflow/src/experiment-tracking/sdk/MlflowService', () => ({
  MlflowService: {
    getExperimentTraceInfoV3: jest.fn(),
    getExperimentTraceData: jest.fn(),
  },
}));

// Mock the empty state component to avoid deep dependency issues
jest.mock('./TracesV3EmptyState', () => ({
  TracesV3EmptyState: jest.fn(() => null),
}));

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <TestRouter
      routes={[
        testRoute(
          <IntlProvider locale="en">
            <QueryClientProvider client={queryClient}>
              <DesignSystemProvider>
                <GenAITracesTableProvider>
                  <TracesV3Logs experimentId="test-experiment" endpointName="test-endpoint" {...props} />
                </GenAITracesTableProvider>
              </DesignSystemProvider>
            </QueryClientProvider>
          </IntlProvider>,
        ),
      ]}
    />,
  );
};

describe('TracesV3Logs', () => {
  beforeEach(() => {
    // Default mock implementations
    jest.mocked(useMarkdownConverter).mockReturnValue((markdown?: string) => markdown || '');

    jest.mocked(useSelectedColumns).mockReturnValue({
      selectedColumns: [
        {
          id: REQUEST_TIME_COLUMN_ID,
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
          label: 'Request Time',
        },
      ],
      toggleColumns: jest.fn(),
      setSelectedColumns: jest.fn(),
    });

    jest.mocked(useFilters).mockReturnValue([[], jest.fn()]);

    jest
      .mocked(useTableSort)
      .mockReturnValue([
        { key: REQUEST_TIME_COLUMN_ID, type: TracesTableColumnType.TRACE_INFO, asc: false },
        jest.fn(),
      ]);

    jest.mocked(useDeleteTracesMutation).mockReturnValue({
      mutateAsync: jest.fn(),
    } as any);

    jest.mocked(useEditExperimentTraceTags).mockReturnValue({
      showEditTagsModalForTrace: jest.fn(),
      EditTagsModal: <div>EditTagsModal</div>,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Loading State Test Matrix
   *
   * This matrix covers all combinations of the 3 main loading states:
   * - isMetadataLoading (from useMlflowTracesTableMetadata)
   * - isInitialTimeFilterLoading (from useSetInitialTimeFilter)
   * - traceInfosLoading (from useSearchMlflowTraces)
   *
   * UI Components tracked:
   * - Toolbar: GenAITracesTableToolbar (always rendered, but column selector can be loading)
   * - Table: Either GenAITracesTableBodyContainer or ParagraphSkeleton components
   *
   * | isMetadataLoading | isInitialTimeFilterLoading | traceInfosLoading | UI in Loading State | UI Showing Data |
   * |-------------------|----------------------------|-------------------|---------------------|-----------------|
   * | false             | false                      | false             | None | Toolbar, Table |
   * | false             | false                      | true              | Table | Toolbar |
   * | false             | true                       | false             | Table | Toolbar |
   * | false             | true                       | true              | Table | Toolbar |
   * | true              | false                      | false             | Table | Toolbar (selecting a selector shows spinner) |
   * | true              | false                      | true              | Table | Toolbar (selecting a selector shows spinner) |
   * | true              | true                       | false             | Table | Toolbar (selecting a selector shows spinner) |
   * | true              | true                       | true              | Table | Toolbar (selecting a selector shows spinner) |
   *
   */

  const loadingStateMatrix = [
    {
      isMetadataLoading: false,
      isInitialTimeFilterLoading: false,
      traceInfosLoading: false,
      testName: 'all loading states false',
      uiInLoadingState: [],
      uiShowingData: ['toolbar', 'table'],
    },
    {
      isMetadataLoading: false,
      isInitialTimeFilterLoading: false,
      traceInfosLoading: true,
      testName: 'only traceInfosLoading true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar'],
    },
    {
      isMetadataLoading: false,
      isInitialTimeFilterLoading: true,
      traceInfosLoading: false,
      testName: 'only isInitialTimeFilterLoading true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar'],
    },
    {
      isMetadataLoading: false,
      isInitialTimeFilterLoading: true,
      traceInfosLoading: true,
      testName: 'isInitialTimeFilterLoading and traceInfosLoading true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar'],
    },
    {
      isMetadataLoading: true,
      isInitialTimeFilterLoading: false,
      traceInfosLoading: false,
      testName: 'only isMetadataLoading true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar (selecting a selector shows spinner)'],
    },
    {
      isMetadataLoading: true,
      isInitialTimeFilterLoading: false,
      traceInfosLoading: true,
      testName: 'isMetadataLoading and traceInfosLoading true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar (selecting a selector shows spinner)'],
    },
    {
      isMetadataLoading: true,
      isInitialTimeFilterLoading: true,
      traceInfosLoading: false,
      testName: 'isMetadataLoading and isInitialTimeFilterLoading true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar (selecting a selector shows spinner)'],
    },
    {
      isMetadataLoading: true,
      isInitialTimeFilterLoading: true,
      traceInfosLoading: true,
      testName: 'all loading states true',
      uiInLoadingState: ['table'],
      uiShowingData: ['toolbar (selecting a selector shows spinner)'],
    },
  ];

  describe('Error handling', () => {
    it('should display error in table when useMlflowTracesTableMetadata errors', async () => {
      const mockError = new GenericNetworkRequestError({ status: 500 }, new Error('Failed to fetch metadata'));

      jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
        assessmentInfos: [],
        allColumns: [],
        totalCount: 0,
        isLoading: false,
        error: mockError,
        isEmpty: false,
        tableFilterOptions: { source: [] },
        evaluatedTraces: [],
        otherEvaluatedTraces: [],
      });

      jest.mocked(useSetInitialTimeFilter).mockReturnValue({
        isInitialTimeFilterLoading: false,
      });

      jest.mocked(useSearchMlflowTraces).mockReturnValue({
        data: [],
        isLoading: false,
        isFetching: false,
        error: null,
      } as any);

      renderComponent();
      await waitForRoutesToBeRendered();

      // Verify error is displayed in the table body
      expect(screen.getByText('Fetching traces failed')).toBeInTheDocument();
      expect(screen.getByText('A network error occurred.')).toBeInTheDocument();
    });

    it('should display error in each selector when useMlflowTracesTableMetadata errors', async () => {
      const mockError = new GenericNetworkRequestError({ status: 500 }, new Error('Failed to fetch metadata'));

      jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
        assessmentInfos: [],
        allColumns: [],
        totalCount: 0,
        isLoading: false,
        error: mockError,
        isEmpty: false,
        tableFilterOptions: { source: [] },
        evaluatedTraces: [],
        otherEvaluatedTraces: [],
      });

      jest.mocked(useSetInitialTimeFilter).mockReturnValue({
        isInitialTimeFilterLoading: false,
      });

      jest.mocked(useSearchMlflowTraces).mockReturnValue({
        data: [],
        isLoading: false,
        isFetching: false,
        error: null,
      } as any);

      renderComponent();
      await waitForRoutesToBeRendered();

      // Test error in column selector
      const columnSelectorButton = screen.getByTestId('column-selector-button');
      await userEvent.click(columnSelectorButton);

      await waitFor(() => {
        // Look for the error message in the dropdown
        const dropdowns = screen.getAllByText('Fetching traces failed');
        // Should have exactly 2: one in the table and one in the column selector dropdown
        expect(dropdowns.length).toBe(2);
      });

      // Close column selector by clicking outside
      await userEvent.click(document.body);

      // Test error in sort dropdown
      const sortButton = screen.getByTestId('sort-select-dropdown');
      await userEvent.click(sortButton);

      await waitFor(() => {
        const dropdowns = screen.getAllByText('Fetching traces failed');
        // Should have exactly 2: one in the table and one in the sort dropdown
        expect(dropdowns.length).toBe(2);
      });

      // Close sort dropdown by clicking outside
      await userEvent.click(document.body);

      // Test error in filter dropdown
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await userEvent.click(filterButton);

      await waitFor(() => {
        const dropdowns = screen.getAllByText('Fetching traces failed');
        // Should have exactly 2: one in the table and one in the filter dropdown
        expect(dropdowns.length).toBe(2);
      });
    });
  });

  describe('Loading state combinations', () => {
    loadingStateMatrix.forEach(
      ({
        isMetadataLoading,
        isInitialTimeFilterLoading,
        traceInfosLoading,
        testName,
        uiInLoadingState,
        uiShowingData,
      }) => {
        it(`should render correctly when ${testName}`, async () => {
          // Set up mocks for this specific test case
          const mockColumns = [
            {
              id: REQUEST_TIME_COLUMN_ID,
              type: TracesTableColumnType.TRACE_INFO,
              group: TracesTableColumnGroup.INFO,
              label: 'Request Time',
            },
          ];

          jest.mocked(useMlflowTracesTableMetadata).mockReturnValue({
            assessmentInfos: [],
            allColumns: mockColumns,
            totalCount: 10,
            isLoading: isMetadataLoading,
            error: null,
            isEmpty: false,
            tableFilterOptions: { source: [] },
            evaluatedTraces: [],
            otherEvaluatedTraces: [],
          });

          jest.mocked(useSetInitialTimeFilter).mockReturnValue({
            isInitialTimeFilterLoading: isInitialTimeFilterLoading,
          });

          jest.mocked(useSearchMlflowTraces).mockReturnValue({
            data: traceInfosLoading ? undefined : [{ trace_id: 'test-trace-1' }],
            isLoading: traceInfosLoading,
            isFetching: traceInfosLoading,
            error: null,
          } as any);

          renderComponent();
          await waitForRoutesToBeRendered();

          // Verify table loading state
          if (uiInLoadingState.includes('table')) {
            // When traceInfosLoading is true, we should see ParagraphSkeleton components
            // The component renders 10 skeleton lines
            const loadingTexts = screen.getAllByText('Loading...');
            expect(loadingTexts.length).toBeGreaterThan(0);
          }

          // Verify table showing data
          if (uiShowingData.includes('table')) {
            // When table is showing data, we should not see loading skeletons
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
          }

          // Verify toolbar state - check if toolbar exists
          // The toolbar is always rendered, containing the search and filters
          const filterButton = screen.getByRole('button', { name: /filter/i });
          expect(filterButton).toBeInTheDocument();

          if (uiShowingData.includes('toolbar (selecting a selector shows spinner)')) {
            // When metadata is loading, clicking the column selector will show loading state in the dialog
            const columnSelectorButton = screen.getByTestId('column-selector-button');
            expect(columnSelectorButton).toBeInTheDocument();

            // Click the button to open the dialog
            await userEvent.click(columnSelectorButton);

            // Verify the dialog shows loading state
            await waitFor(() => {
              // The DialogComboboxContent with loading=true should have aria-busy
              const dialogContent = screen.getByLabelText(/columns options/i);
              expect(dialogContent).toHaveAttribute('aria-busy', 'true');
            });

            // Test sort dropdown shows spinner when loading
            const sortButton = screen.getByTestId('sort-select-dropdown');
            expect(sortButton).toBeInTheDocument();

            await userEvent.click(sortButton);

            await waitFor(() => {
              // Sort dropdown should show loading spinner
              expect(screen.getByTestId('sort-dropdown-loading')).toBeInTheDocument();
            });

            // Test filter dropdown shows spinner when loading
            await userEvent.click(filterButton);

            await waitFor(() => {
              // Filter dropdown should show loading spinner
              expect(screen.getByTestId('filter-dropdown-loading')).toBeInTheDocument();
            });
          } else if (uiShowingData.includes('toolbar')) {
            // When metadata is not loading, column selector should work normally
            const columnSelectorButton = screen.getByTestId('column-selector-button');
            expect(columnSelectorButton).toBeInTheDocument();

            // Click the button to verify it opens the dialog with content
            await userEvent.click(columnSelectorButton);

            // Verify the dialog content is shown without loading state
            await waitFor(() => {
              const dialogContent = screen.getByLabelText(/columns options/i);
              expect(dialogContent).toHaveAttribute('aria-busy', 'false');
            });

            // Test sort dropdown shows content when not loading
            const sortButton = screen.getByTestId('sort-select-dropdown');
            expect(sortButton).toBeInTheDocument();

            await userEvent.click(sortButton);

            await waitFor(() => {
              // Sort dropdown should show search input when not loading
              // Just check that a search input exists in the dropdown content
              const dropdownContent = screen.getByRole('menu');
              const searchInput = within(dropdownContent).getByPlaceholderText(/search/i);
              expect(searchInput).toBeInTheDocument();
            });

            // Test filter dropdown shows content when not loading
            const filterButton = screen.getByRole('button', { name: /filter/i });
            expect(filterButton).toBeInTheDocument();

            await userEvent.click(filterButton);

            await waitFor(() => {
              // Filter dropdown should show filter form when not loading
              // Look for buttons that are typically in the filter form
              const applyButton = screen.getByRole('button', { name: /apply/i });
              expect(applyButton).toBeInTheDocument();
            });
          }
        });
      },
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: TracesV3Logs.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3Logs.tsx
Signals: React

```typescript
import React, { useCallback, useMemo, useState } from 'react';
import { isEmpty as isEmptyFn } from 'lodash';
import { Empty, ParagraphSkeleton, DangerIcon } from '@databricks/design-system';
import type { TracesTableColumn, TraceActions, GetTraceFunction } from '@databricks/web-shared/genai-traces-table';
import { shouldUseTracesV4API, useUnifiedTraceTagsModal } from '@databricks/web-shared/model-trace-explorer';
import {
  EXECUTION_DURATION_COLUMN_ID,
  GenAiTracesMarkdownConverterProvider,
  GenAITracesTableBodyContainer,
  GenAITracesTableToolbar,
  REQUEST_TIME_COLUMN_ID,
  STATE_COLUMN_ID,
  RESPONSE_COLUMN_ID,
  TracesTableColumnType,
  useSearchMlflowTraces,
  useSelectedColumns,
  getEvalTabTotalTracesLimit,
  GenAITracesTableProvider,
  useFilters,
  getTracesTagKeys,
  useTableSort,
  useMlflowTracesTableMetadata,
  TOKENS_COLUMN_ID,
  TRACE_ID_COLUMN_ID,
  invalidateMlflowSearchTracesCache,
  createTraceLocationForExperiment,
  doesTraceSupportV4API,
} from '@databricks/web-shared/genai-traces-table';
import { useMarkdownConverter } from '@mlflow/mlflow/src/common/utils/MarkdownUtils';
import { shouldEnableTraceInsights } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import { useDeleteTracesMutation } from '../../../evaluations/hooks/useDeleteTraces';
import { useEditExperimentTraceTags } from '../../../traces/hooks/useEditExperimentTraceTags';
import { useIntl } from '@databricks/i18n';
import { getTrace as getTraceV3 } from '@mlflow/mlflow/src/experiment-tracking/utils/TraceUtils';
import { TracesV3EmptyState } from './TracesV3EmptyState';
import { useQueryClient } from '@databricks/web-shared/query-client';
import { useSetInitialTimeFilter } from './hooks/useSetInitialTimeFilter';
import { checkColumnContents } from './utils/columnUtils';
// eslint-disable-next-line no-useless-rename -- renaming due to copybara transformation
import { useExportTracesToDatasetModal as useExportTracesToDatasetModal } from '@mlflow/mlflow/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useExportTracesToDatasetModal';
import { useGetDeleteTracesAction } from './hooks/useGetDeleteTracesAction';
const ContextProviders = ({
  children,
  makeHtmlFromMarkdown,
  experimentId,
}: {
  makeHtmlFromMarkdown: (markdown?: string) => string;
  experimentId?: string;
  children: React.ReactNode;
}) => {
  return (
    <GenAiTracesMarkdownConverterProvider makeHtml={makeHtmlFromMarkdown}>
      {children}
    </GenAiTracesMarkdownConverterProvider>
  );
};

const TracesV3LogsImpl = React.memo(
  ({
    experimentId,
    endpointName,
    timeRange,
    isLoadingExperiment,
    loggedModelId,
  }: {
    experimentId: string;
    endpointName: string;
    timeRange?: { startTime: string | undefined; endTime: string | undefined };
    isLoadingExperiment?: boolean;
    loggedModelId?: string;
  }) => {
    const makeHtmlFromMarkdown = useMarkdownConverter();
    const intl = useIntl();
    const enableTraceInsights = shouldEnableTraceInsights();

    const traceSearchLocations = useMemo(
      () => {
        return [createTraceLocationForExperiment(experimentId)];
      },
      // prettier-ignore
      [
        experimentId,
      ],
    );

    const isQueryDisabled = false;
    const usesV4APIs = true;

    const getTrace = getTraceV3;

    // Get metadata
    const {
      assessmentInfos,
      allColumns,
      totalCount,
      evaluatedTraces,
      isLoading: isMetadataLoading,
      error: metadataError,
      isEmpty,
      tableFilterOptions,
    } = useMlflowTracesTableMetadata({
      locations: traceSearchLocations,
      timeRange,
      filterByLoggedModelId: loggedModelId,
      disabled: isQueryDisabled,
    });

    // Setup table states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useFilters();
    const queryClient = useQueryClient();

    const defaultSelectedColumns = useCallback(
      (allColumns: TracesTableColumn[]) => {
        const { responseHasContent, inputHasContent, tokensHasContent } = checkColumnContents(evaluatedTraces);

        return allColumns.filter(
          (col) =>
            col.type === TracesTableColumnType.ASSESSMENT ||
            col.type === TracesTableColumnType.EXPECTATION ||
            (inputHasContent && col.type === TracesTableColumnType.INPUT) ||
            (responseHasContent && col.type === TracesTableColumnType.TRACE_INFO && col.id === RESPONSE_COLUMN_ID) ||
            (tokensHasContent && col.type === TracesTableColumnType.TRACE_INFO && col.id === TOKENS_COLUMN_ID) ||
            (col.type === TracesTableColumnType.TRACE_INFO &&
              [TRACE_ID_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, REQUEST_TIME_COLUMN_ID, STATE_COLUMN_ID].includes(
                col.id,
              )) ||
            col.type === TracesTableColumnType.INTERNAL_MONITOR_REQUEST_TIME,
        );
      },
      [evaluatedTraces],
    );

    const { selectedColumns, toggleColumns, setSelectedColumns } = useSelectedColumns(
      experimentId,
      allColumns,
      defaultSelectedColumns,
    );

    const [tableSort, setTableSort] = useTableSort(selectedColumns, {
      key: REQUEST_TIME_COLUMN_ID,
      type: TracesTableColumnType.TRACE_INFO,
      asc: false,
    });

    // Set the initial time filter when there are no traces
    const { isInitialTimeFilterLoading } = useSetInitialTimeFilter({
      locations: traceSearchLocations,
      isTracesEmpty: isEmpty,
      isTraceMetadataLoading: isMetadataLoading,
      disabled: isQueryDisabled,
    });

    // Get traces data
    const {
      data: traceInfos,
      isLoading: traceInfosLoading,
      isFetching: traceInfosFetching,
      error: traceInfosError,
    } = useSearchMlflowTraces({
      locations: traceSearchLocations,
      currentRunDisplayName: endpointName,
      searchQuery,
      filters,
      timeRange,
      filterByLoggedModelId: loggedModelId,
      tableSort,
      disabled: isQueryDisabled,
    });

    const deleteTracesMutation = useDeleteTracesMutation();

    // Local, legacy version of trace tag editing modal
    const { showEditTagsModalForTrace, EditTagsModal } = useEditExperimentTraceTags({
      onSuccess: () => invalidateMlflowSearchTracesCache({ queryClient }),
      existingTagKeys: getTracesTagKeys(traceInfos || []),
    });

    // Unified version of trace tag editing modal using shared components
    const { showTagAssignmentModal: showEditTagsModalForTraceUnified, TagAssignmentModal: EditTagsModalUnified } =
      useUnifiedTraceTagsModal({
        componentIdPrefix: 'mlflow.experiment-traces',
        onSuccess: () => invalidateMlflowSearchTracesCache({ queryClient }),
      });

    const deleteTracesAction = useGetDeleteTracesAction({ traceSearchLocations });

    // TODO: Unify export action between managed and OSS
    const { showExportTracesToDatasetsModal, setShowExportTracesToDatasetsModal, renderExportTracesToDatasetsModal } =
      useExportTracesToDatasetModal({
        experimentId,
      });

    const traceActions: TraceActions = useMemo(() => {
      return {
        deleteTracesAction,
        exportToEvals: {
          showExportTracesToDatasetsModal: showExportTracesToDatasetsModal,
          setShowExportTracesToDatasetsModal: setShowExportTracesToDatasetsModal,
          renderExportTracesToDatasetsModal: renderExportTracesToDatasetsModal,
        },
        // Enable unified tags modal if V4 APIs is enabled
        editTags: shouldUseTracesV4API()
          ? {
              showEditTagsModalForTrace: showEditTagsModalForTraceUnified,
              EditTagsModal: EditTagsModalUnified,
            }
          : {
              showEditTagsModalForTrace,
              EditTagsModal,
            },
      };
    }, [
      deleteTracesAction,
      showExportTracesToDatasetsModal,
      setShowExportTracesToDatasetsModal,
      renderExportTracesToDatasetsModal,
      showEditTagsModalForTraceUnified,
      EditTagsModalUnified,
      showEditTagsModalForTrace,
      EditTagsModal,
    ]);

    const countInfo = useMemo(() => {
      return {
        currentCount: traceInfos?.length,
        logCountLoading: traceInfosLoading,
        totalCount: totalCount,
        maxAllowedCount: getEvalTabTotalTracesLimit(),
      };
    }, [traceInfos, totalCount, traceInfosLoading]);

    const isTableLoading = traceInfosLoading || isInitialTimeFilterLoading || isMetadataLoading;
    const displayLoadingOverlay = false;

    const tableError = traceInfosError || metadataError;
    const isTableEmpty = isEmpty && !isTableLoading && !tableError;

    // Helper function to render the main content based on current state
    const renderMainContent = () => {
      // If isEmpty and not enableTraceInsights, show empty state without navigation
      if (!enableTraceInsights && isTableEmpty) {
        return (
          <TracesV3EmptyState
            experimentIds={[experimentId]}
            loggedModelId={loggedModelId}
            traceSearchLocations={traceSearchLocations}
            isCallDisabled={isQueryDisabled}
          />
        );
      }
      // Default traces view with optional navigation
      return (
        <div
          css={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <div
            css={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            {isTableLoading ? (
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: '8px',
                  padding: '16px',
                }}
              >
                {[...Array(10).keys()].map((i) => (
                  <ParagraphSkeleton label="Loading..." key={i} seed={`s-${i}`} />
                ))}
              </div>
            ) : tableError ? (
              <div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Empty
                  image={<DangerIcon />}
                  title={intl.formatMessage({
                    defaultMessage: 'Fetching traces failed',
                    description: 'Evaluation review > evaluations list > error state title',
                  })}
                  description={tableError.message}
                />
              </div>
            ) : (
              <ContextProviders makeHtmlFromMarkdown={makeHtmlFromMarkdown} experimentId={experimentId}>
                <GenAITracesTableBodyContainer
                  experimentId={experimentId}
                  allColumns={allColumns}
                  currentTraceInfoV3={traceInfos || []}
                  currentRunDisplayName={endpointName}
                  getTrace={getTrace}
                  assessmentInfos={assessmentInfos}
                  setFilters={setFilters}
                  filters={filters}
                  selectedColumns={selectedColumns}
                  tableSort={tableSort}
                  onTraceTagsEdit={showEditTagsModalForTrace}
                  displayLoadingOverlay={displayLoadingOverlay}
                />
              </ContextProviders>
            )}
          </div>
        </div>
      );
    };

    // Single unified layout with toolbar and content
    return (
      <GenAITracesTableProvider>
        <div
          css={{
            overflowY: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <GenAITracesTableToolbar
            experimentId={experimentId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            assessmentInfos={assessmentInfos}
            traceInfos={traceInfos}
            tableFilterOptions={tableFilterOptions}
            countInfo={countInfo}
            traceActions={traceActions}
            tableSort={tableSort}
            setTableSort={setTableSort}
            allColumns={allColumns}
            selectedColumns={selectedColumns}
            toggleColumns={toggleColumns}
            setSelectedColumns={setSelectedColumns}
            isMetadataLoading={isMetadataLoading}
            metadataError={metadataError}
            usesV4APIs={usesV4APIs}
          />
          {renderMainContent()}
        </div>
      </GenAITracesTableProvider>
    );
  },
);

export const TracesV3Logs = TracesV3LogsImpl;
```

--------------------------------------------------------------------------------

---[FILE: TracesV3PageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3PageWrapper.tsx

```typescript
import { ErrorBoundary } from 'react-error-boundary';
import { TracesV3GenericErrorState } from './TracesV3GenericErrorState';

export const TracesV3PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ErrorBoundary fallback={<TracesV3GenericErrorState />}>{children}</ErrorBoundary>;
};
```

--------------------------------------------------------------------------------

---[FILE: TracesV3Toolbar.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3Toolbar.tsx

```typescript
import { SpeechBubbleIcon, Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CopyActionButton } from '@databricks/web-shared/copy';
import { TracesV3DateSelector } from './TracesV3DateSelector';
import { FormattedMessage } from '@databricks/i18n';

export const TracesV3Toolbar = ({ viewState, sessionId }: { viewState: string; sessionId?: string }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderBottom: `1px solid ${theme.colors.grey100}`,
        paddingBottom: `${theme.spacing.sm}px`,
      }}
    >
      {/**
       * in the single chat session view, the date sector is irrelevant as we
       * want to show all traces in the session regardless date.
       * additionally, we want to show the session ID in the title bar so
       * the user knows which session they are viewing.
       */}
      {!(viewState === 'single-chat-session') && <TracesV3DateSelector />}
      {viewState === 'single-chat-session' && (
        <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <Tag
            color="default"
            componentId="mlflow.chat-sessions.session-header-label"
            css={{ padding: theme.spacing.xs + 2, margin: 0 }}
          >
            <span css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <SpeechBubbleIcon />
              <Typography.Text ellipsis bold>
                <FormattedMessage defaultMessage="Session" description="Label preceding a chat session ID" />
              </Typography.Text>
            </span>
          </Tag>
          <Typography.Title level={3} withoutMargins>
            {sessionId}
          </Typography.Title>
          {sessionId && (
            <CopyActionButton
              copyText={sessionId}
              componentId="mlflow.chat-sessions.copy-session-id"
              buttonProps={{ icon: undefined }}
            />
          )}
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TracesV3View.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/TracesV3View.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';
import { TracesV3Logs } from './TracesV3Logs';
import {
  MonitoringConfigProvider,
  useMonitoringConfig,
} from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringConfig';
import { TracesV3PageWrapper } from './TracesV3PageWrapper';
import { useMonitoringViewState } from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringViewState';
import {
  getAbsoluteStartEndTime,
  useMonitoringFilters,
} from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringFilters';
import { useExperiments } from '../../hooks/useExperiments';
import { TracesV3Toolbar } from './TracesV3Toolbar';

interface TracesV3ContentProps {
  viewState: string;
  experimentId: string;
  endpointName?: string;
  timeRange: { startTime: string | undefined; endTime: string | undefined };
}

const TracesV3Content = ({
  // comment for copybara formatting
  viewState,
  experimentId,
  endpointName,
  timeRange,
}: TracesV3ContentProps) => {
  if (viewState === 'logs') {
    return (
      <TracesV3Logs
        experimentId={experimentId || ''}
        // TODO: Remove this once the endpointName is not needed
        endpointName={endpointName || ''}
        timeRange={timeRange}
      />
    );
  }
  return null;
};

const TracesV3ViewImpl = ({
  experimentIds,
  isLoadingExperiment,
}: {
  experimentIds: string[];
  isLoadingExperiment?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const [monitoringFilters, _setMonitoringFilters] = useMonitoringFilters();
  const monitoringConfig = useMonitoringConfig();

  // Traces view only works with one experiment
  const experimentId = experimentIds[0];
  const [viewState] = useMonitoringViewState();

  const timeRange = useMemo(() => {
    const { startTime, endTime } = getAbsoluteStartEndTime(monitoringConfig.dateNow, monitoringFilters);
    return {
      startTime: startTime ? new Date(startTime).getTime().toString() : undefined,
      endTime: endTime ? new Date(endTime).getTime().toString() : undefined,
    };
  }, [monitoringConfig.dateNow, monitoringFilters]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        height: '100%',
        overflowY: 'hidden',
      }}
    >
      <TracesV3Toolbar
        // prettier-ignore
        viewState={viewState}
      />
      <TracesV3Content
        // comment for copybara formatting
        viewState={viewState}
        experimentId={experimentId}
        timeRange={timeRange}
      />
    </div>
  );
};

export const TracesV3View = ({
  experimentIds,
  isLoadingExperiment,
}: {
  experimentIds: string[];
  isLoadingExperiment?: boolean;
}) => (
  <TracesV3PageWrapper>
    <MonitoringConfigProvider>
      <TracesV3ViewImpl experimentIds={experimentIds} isLoadingExperiment={isLoadingExperiment} />
    </MonitoringConfigProvider>
  </TracesV3PageWrapper>
);
```

--------------------------------------------------------------------------------

---[FILE: useGetDeleteTracesAction.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/hooks/useGetDeleteTracesAction.tsx
Signals: React

```typescript
import type { TraceActions } from '@databricks/web-shared/genai-traces-table';
import { useMemo } from 'react';
import { useDeleteTracesMutation } from '../../../../evaluations/hooks/useDeleteTraces';
import type { ModelTraceLocation } from '@databricks/web-shared/model-trace-explorer';

export const useGetDeleteTracesAction = ({ traceSearchLocations }: { traceSearchLocations: ModelTraceLocation[] }) => {
  const deleteTracesMutation = useDeleteTracesMutation();

  const deleteTracesAction: TraceActions['deleteTracesAction'] = useMemo(
    () => {
      return {
        deleteTraces: async (experimentId: string, traceIds: string[]) =>
          deleteTracesMutation.mutateAsync({ experimentId, traceRequestIds: traceIds }),
      };
    },
    // prettier-ignore
    [
      deleteTracesMutation,
    ],
  );
  return deleteTracesAction;
};
```

--------------------------------------------------------------------------------

````

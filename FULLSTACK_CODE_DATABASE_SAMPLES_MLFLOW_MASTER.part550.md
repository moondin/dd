---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 550
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 550 of 991)

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

---[FILE: ExperimentLoggedModelListPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-logged-models/ExperimentLoggedModelListPage.test.tsx

```typescript
import { jest, describe, beforeAll, beforeEach, test, expect } from '@jest/globals';
import { graphql, rest } from 'msw';
import { setupServer } from '../../../common/utils/setup-msw';
import { render, screen, waitFor, within, act } from '@testing-library/react';
import ExperimentLoggedModelListPage from './ExperimentLoggedModelListPage';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import userEvent from '@testing-library/user-event';
import { LoggedModelStatusProtoEnum } from '../../types';
import { first, orderBy } from 'lodash';
import type { RunsChartsBarCardConfig } from '../../components/runs-charts/runs-charts.types';
import type { RunsChartsRunData } from '../../components/runs-charts/components/RunsCharts.common';
import { createMLflowRoutePath } from '../../../common/utils/RoutingUtils';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // increase timeout due to testing heavier tables and charts

jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
  isLoggedModelsFilteringAndSortingEnabled: jest.fn(() => true),
}));

// Mock the chart component to save some resources while easily assert that the correct chart is rendered
jest.mock('../../components/runs-charts/components/RunsChartsDraggableCard', () => ({
  RunsChartsDraggableCard: ({
    cardConfig,
    chartRunData,
  }: {
    cardConfig: RunsChartsBarCardConfig;
    chartRunData: RunsChartsRunData[];
  }) => (
    <div data-testid="test-chart">
      <span>this is chart for {cardConfig.metricKey}</span>
      <span>
        displaying data for models:{' '}
        {chartRunData
          .filter(({ hidden }) => !hidden)
          .map((dataTrace) => dataTrace.uuid)
          .join(',')}
      </span>
    </div>
  ),
}));

describe('ExperimentLoggedModelListPage', () => {
  const { history } = setupTestRouter();

  // Simulate API returning logged models in particular order, configured by "ascending" flag
  const createTestLoggedModelsResponse = (
    experiment_id = 'test-experiment',
    {
      ascending = false,
      pageToken,
      filter,
    }: {
      ascending?: boolean;
      pageToken?: string;
      // Filter string, the only supported one is "metrics.common-metric" one
      filter?: string;
    } = {},
  ) => {
    const allResults = 6;
    const pageSize = 3;
    const page = Number(pageToken) || 1;

    const modelsWithRegisteredVersions = ['m-6', 'm-4'];
    // Parse filter string to extract the value of "metrics.common-metric"
    const parsedFilterMetric = filter ? filter.match(/metrics\.common-metric = (.+)/)?.[1] : undefined;

    if (filter && !parsedFilterMetric) {
      throw new Error('Parse error: invalid filter string');
    }

    const allModels = Array.from({ length: allResults }, (_, i) => ({
      info: {
        experiment_id,
        model_id: `m-${i + 1}`,
        model_type: 'Agent',
        name: `Test model ${i + 1}`,
        registrations: [],
        source_run_id: 'test-run',
        status: LoggedModelStatusProtoEnum.LOGGED_MODEL_PENDING,
        status_message: 'Pending',
        tags: modelsWithRegisteredVersions.includes(`m-${i + 1}`)
          ? [
              {
                key: 'mlflow.modelVersions',
                value: JSON.stringify([
                  {
                    name: 'registered-model-name-' + (i + 1),
                    version: 1,
                  },
                ]),
              },
            ]
          : [],
        creation_timestamp_ms: i * 1000,
      },
      data: {
        metrics: [
          {
            key: 'common-metric',
            timestamp: i,
            step: i,
            value: i,
            dataset_digest: undefined as string | undefined,
            dataset_name: undefined as string | undefined,
          },
          {
            key: 'test-metric-for-model-' + (i + 1),
            timestamp: i,
            step: i,
            value: i,
            dataset_digest: undefined as string | undefined,
            dataset_name: undefined as string | undefined,
          },
        ],
      },
    })).filter(
      (model) =>
        !parsedFilterMetric ||
        model.data.metrics.some(
          (metric) => metric.key === 'common-metric' && metric.value === Number(parsedFilterMetric),
        ),
    );

    const next_page_token = page * pageSize < allResults ? (page + 1).toString() : null;

    const orderedModels = orderBy(allModels, [({ info }) => info.creation_timestamp_ms], [ascending ? 'asc' : 'desc']);

    return {
      models: orderedModels.slice((page - 1) * pageSize, page * pageSize),
      next_page_token,
    };
  };

  const server = setupServer(
    rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
      return res(ctx.json({ run: { info: { run_uuid: 'test-run' } } }));
    }),
    rest.post<any>('/ajax-api/2.0/mlflow/logged-models/search', (req, res, ctx) => {
      try {
        const responsePayload = createTestLoggedModelsResponse('test-experiment', {
          ascending: (req?.body as any)?.order_by?.[0]?.ascending,
          pageToken: (req?.body as any)?.page_token,
          filter: (req?.body as any)?.filter,
        });

        return res(ctx.json(responsePayload));
      } catch (error: any) {
        return res(ctx.status(400), ctx.json({ message: error.message, error_code: 400 }));
      }
    }),
  );

  const renderTestComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <TestApolloProvider disableCache>
        <QueryClientProvider client={queryClient}>
          <MockedReduxStoreProvider state={{ entities: { experimentTagsByExperimentId: {} } }}>
            <IntlProvider locale="en">
              <DesignSystemProvider>
                <TestRouter
                  routes={[testRoute(<ExperimentLoggedModelListPage />, '/experiments/:experimentId')]}
                  history={history}
                  initialEntries={['/experiments/test-experiment']}
                />
              </DesignSystemProvider>
            </IntlProvider>
          </MockedReduxStoreProvider>
        </QueryClientProvider>
      </TestApolloProvider>,
    );
  };

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  beforeEach(() => {
    server.resetHandlers();
  });

  test('should display experiment title and test logged models when fetched', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText('Test model 6')).toBeInTheDocument();
      expect(screen.getByText('Test model 5')).toBeInTheDocument();
      expect(screen.getByText('Test model 4')).toBeInTheDocument();
    });
  });

  test('should load more runs', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText('Test model 6')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('link', { name: /Test model \d/ }).map((cell) => cell.textContent)).toEqual([
      'Test model 6',
      'Test model 5',
      'Test model 4',
    ]);

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));

    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: /Test model \d/ }).map((cell) => cell.textContent)).toEqual([
        'Test model 6',
        'Test model 5',
        'Test model 4',
        'Test model 3',
        'Test model 2',
        'Test model 1',
      ]);
    });

    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  test('should fetch and display run names', async () => {
    server.use(
      rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
        return res(ctx.json({ run: { info: { run_uuid: 'test-run', run_name: 'Test run name' } } }));
      }),
    );

    renderTestComponent();

    // We should see run names as links
    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: 'Test run name' }).length).toBeGreaterThan(0);
    });

    // The link should point to the run page
    expect(first(screen.getAllByRole('link', { name: 'Test run name' }))).toHaveAttribute(
      'href',
      createMLflowRoutePath('/experiments/test-experiment/runs/test-run'),
    );
  });

  test('should display registered model versions', async () => {
    renderTestComponent();

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Test model 6')).toBeInTheDocument();
    });

    // Expect model 6 to have a link to the registered model version
    expect(screen.getByRole('link', { name: /registered-model-name-6 v1/ })).toHaveAttribute(
      'href',
      createMLflowRoutePath('/models/registered-model-name-6/versions/1'),
    );

    // Expect model 5 to not have any registered model version links
    expect(screen.queryByRole('link', { name: /registered-model-name-5/ })).not.toBeInTheDocument();
  });

  test('should use search query filter and display filtered results', async () => {
    renderTestComponent();

    // We should see run names as links
    await waitFor(() => {
      expect(screen.getByPlaceholderText('metrics.rmse >= 0.8')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText('metrics.rmse >= 0.8'), 'metrics.common-metric = 5{enter}');

    await waitFor(() => {
      expect(screen.getByText('Test model 6')).toBeInTheDocument();
    });

    expect(screen.queryByText('Test model 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Test model 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Test model 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Test model 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Test model 1')).not.toBeInTheDocument();
  });

  test('should use search query filter and display empty results with relevant message', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('metrics.rmse >= 0.8')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText('metrics.rmse >= 0.8'), 'metrics.common-metric = 55{enter}');

    await waitFor(() => {
      expect(screen.getByText('No models found')).toBeInTheDocument();
    });
  });

  test('should use malformed search query filter and display error message', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('metrics.rmse >= 0.8')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText('metrics.rmse >= 0.8'), 'metr.malformed_query="{enter}');

    await waitFor(() => {
      expect(screen.getByText('Parse error: invalid filter string')).toBeInTheDocument();
    });

    jest.restoreAllMocks();
  });

  test('should allow filtering by datasets', async () => {
    const requestSpy = jest.fn();
    server.use(
      rest.post<any>('/ajax-api/2.0/mlflow/logged-models/search', (req, res, ctx) => {
        requestSpy(req.body);
        const responsePayload = createTestLoggedModelsResponse('test-experiment');
        const firstModelResult = responsePayload.models[0];
        const secondModelResult = responsePayload.models[1];

        for (const metric of firstModelResult.data.metrics) {
          metric.dataset_digest = '123456';
          metric.dataset_name = 'train_dataset';
        }
        for (const metric of secondModelResult.data.metrics) {
          metric.dataset_digest = '987654';
          metric.dataset_name = 'test_dataset';
        }

        return res(ctx.json(responsePayload));
      }),
    );

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText('Test model 6')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Datasets' }));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'train_dataset (#123456)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'test_dataset (#987654)' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('option', { name: 'train_dataset (#123456)' }));

    await waitFor(() => {
      expect(requestSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          datasets: [
            {
              dataset_digest: '123456',
              dataset_name: 'train_dataset',
            },
          ],
        }),
      );
    });
  });

  describe('ExperimentLoggedModelListPage: charts', () => {
    test('should display charts and filter them by metric name', async () => {
      renderTestComponent();

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: 'Chart view' })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('radio', { name: 'Chart view' }));

      await waitFor(() => {
        expect(screen.getAllByTestId('test-chart').length).toBe(4);
      });

      expect(screen.getByText('this is chart for common-metric')).toBeInTheDocument();
      expect(screen.getByText('this is chart for test-metric-for-model-6')).toBeInTheDocument();
      expect(screen.getByText('this is chart for test-metric-for-model-5')).toBeInTheDocument();
      expect(screen.getByText('this is chart for test-metric-for-model-4')).toBeInTheDocument();

      await userEvent.type(screen.getByPlaceholderText('Search metric charts'), 'common-metric');

      await waitFor(() => {
        expect(screen.getAllByTestId('test-chart').length).toBe(1);
      });

      expect(screen.getByText('this is chart for common-metric')).toBeInTheDocument();
    });

    test('should reflect visibility of logged models on charts', async () => {
      renderTestComponent();

      await waitFor(() => {
        expect(screen.getByRole('radio', { name: 'Chart view' })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('radio', { name: 'Chart view' }));

      await waitFor(() => {
        expect(screen.getAllByText('displaying data for models: m-6,m-5,m-4').length).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(screen.getByText('Test model 5')).toBeInTheDocument();
      });

      // Click visibility button for model 5
      await userEvent.click(
        within(screen.getByText('Test model 5').closest('[role=row]') as HTMLElement).getByRole('button'),
      );

      await waitFor(() => {
        expect(screen.getAllByText('displaying data for models: m-6,m-4').length).toBeGreaterThan(0);
      });

      // Hide all runs
      await userEvent.click(screen.getByLabelText('Toggle visibility of rows'));
      await userEvent.click(screen.getByText('Hide all runs'));

      // Click visibility button for model 4
      await userEvent.click(
        within(screen.getByText('Test model 4').closest('[role=row]') as HTMLElement).getByRole('button'),
      );

      await waitFor(() => {
        expect(screen.getAllByText('displaying data for models: m-4').length).toBeGreaterThan(0);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-logged-models/ExperimentLoggedModelListPage.tsx
Signals: React

```typescript
import { Alert, Spacer, useDesignSystemTheme } from '@databricks/design-system';
import invariant from 'invariant';
import { useParams } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import { ExperimentLoggedModelPageWrapper } from './ExperimentLoggedModelPageWrapper';

import { isLoggedModelsFilteringAndSortingEnabled } from '../../../common/utils/FeatureUtils';
import { useEffect, useState } from 'react';
import { ExperimentLoggedModelListPageTable } from '../../components/experiment-logged-models/ExperimentLoggedModelListPageTable';
import { useSearchLoggedModelsQuery } from '../../hooks/logged-models/useSearchLoggedModelsQuery';
import { ExperimentLoggedModelListPageControls } from '../../components/experiment-logged-models/ExperimentLoggedModelListPageControls';
import {
  parseLoggedModelMetricOrderByColumnId,
  useExperimentLoggedModelListPageTableColumns,
} from '../../components/experiment-logged-models/hooks/useExperimentLoggedModelListPageTableColumns';
import { ExperimentLoggedModelOpenDatasetDetailsContextProvider } from '../../components/experiment-logged-models/hooks/useExperimentLoggedModelOpenDatasetDetails';
import { useLoggedModelsListPageState } from '../../components/experiment-logged-models/hooks/useLoggedModelsListPagePageState';
import { useRelatedRunsDataForLoggedModels } from '../../hooks/logged-models/useRelatedRunsDataForLoggedModels';
import {
  ExperimentLoggedModelListPageMode,
  useExperimentLoggedModelListPageMode,
} from '../../components/experiment-logged-models/hooks/useExperimentLoggedModelListPageMode';
import { ExperimentViewRunsTableResizer } from '../../components/experiment-page/components/runs/ExperimentViewRunsTableResizer';
import { ExperimentLoggedModelListCharts } from '../../components/experiment-logged-models/ExperimentLoggedModelListCharts';
import { ExperimentLoggedModelListPageRowVisibilityContextProvider } from '../../components/experiment-logged-models/hooks/useExperimentLoggedModelListPageRowVisibility';
import { RunsChartsSetHighlightContextProvider } from '../../components/runs-charts/hooks/useRunsChartTraceHighlight';
import { BadRequestError } from '@databricks/web-shared/errors';
import { useResizableMaxWidth } from '@mlflow/mlflow/src/shared/web-shared/hooks/useResizableMaxWidth';

const INITIAL_RUN_COLUMN_SIZE = 295;
const CHARTS_MIN_WIDTH = 350;

const ExperimentLoggedModelListPageImpl = () => {
  const { experimentId } = useParams();
  const { theme } = useDesignSystemTheme();
  const sortingAndFilteringEnabled = isLoggedModelsFilteringAndSortingEnabled();

  const {
    state: {
      orderByColumn,
      orderByAsc,
      columnVisibility,
      rowVisibilityMap,
      rowVisibilityMode,
      selectedFilterDatasets,
      groupBy,
    },
    searchQuery,
    isFilteringActive,
    setOrderBy,
    setColumnVisibility,
    setRowVisibilityMode,
    toggleRowVisibility,
    updateSearchQuery,
    toggleDataset,
    clearSelectedDatasets,
    setGroupBy,
  } = useLoggedModelsListPageState();

  invariant(experimentId, 'Experiment ID must be defined');

  const { viewMode, setViewMode } = useExperimentLoggedModelListPageMode();

  // Translate currently sorting column to the format accepted by the API query.
  // If the column is a metric, we need to parse and pass the dataset name and digest if found.
  const getOrderByRequestData = () => {
    if (!orderByColumn) {
      return { orderByField: undefined };
    }
    const parsedMetricOrderByColumn = parseLoggedModelMetricOrderByColumnId(orderByColumn);
    if (parsedMetricOrderByColumn.datasetDigest && parsedMetricOrderByColumn.datasetName) {
      return {
        orderByField: `metrics.${parsedMetricOrderByColumn.metricKey}`,
        orderByDatasetName: parsedMetricOrderByColumn.datasetName,
        orderByDatasetDigest: parsedMetricOrderByColumn.datasetDigest,
      };
    }
    return { orderByField: orderByColumn };
  };

  const {
    data: loggedModels,
    isFetching: isFetchingLoggedModels,
    isLoading: isLoadingLoggedModels,
    error: loggedModelsError,
    nextPageToken,
    loadMoreResults,
  } = useSearchLoggedModelsQuery({
    experimentIds: [experimentId],
    orderByAsc,
    searchQuery,
    selectedFilterDatasets,
    ...getOrderByRequestData(),
  });

  // Find and extract 400 error from the logged models error
  const badRequestError = loggedModelsError instanceof BadRequestError ? loggedModelsError : undefined;

  const { data: relatedRunsData } = useRelatedRunsDataForLoggedModels({ loggedModels });

  const { columnDefs, compactColumnDefs } = useExperimentLoggedModelListPageTableColumns({
    loggedModels,
    columnVisibility,
    isLoading: isLoadingLoggedModels,
    orderByColumn,
    orderByAsc,
    enableSortingByMetrics: sortingAndFilteringEnabled,
  });

  const [tableAreaWidth, setTableAreaWidth] = useState<number>(INITIAL_RUN_COLUMN_SIZE);
  const [tableHidden, setTableHidden] = useState(false);

  const isCompactTableMode = viewMode !== ExperimentLoggedModelListPageMode.TABLE;

  const tableElement =
    isCompactTableMode && tableHidden ? (
      <div css={{ width: theme.spacing.md }} />
    ) : (
      <ExperimentLoggedModelListPageTable
        columnDefs={isCompactTableMode ? compactColumnDefs : columnDefs}
        loggedModels={loggedModels ?? []}
        isLoading={isLoadingLoggedModels}
        isLoadingMore={isFetchingLoggedModels}
        badRequestError={badRequestError}
        moreResultsAvailable={Boolean(nextPageToken)}
        onLoadMore={loadMoreResults}
        onOrderByChange={setOrderBy}
        orderByAsc={orderByAsc}
        orderByColumn={orderByColumn}
        columnVisibility={columnVisibility}
        relatedRunsData={relatedRunsData}
        isFilteringActive={isFilteringActive}
        groupModelsBy={groupBy}
      />
    );

  const { resizableMaxWidth, ref } = useResizableMaxWidth(CHARTS_MIN_WIDTH);

  return (
    <ExperimentLoggedModelOpenDatasetDetailsContextProvider>
      <ExperimentLoggedModelListPageRowVisibilityContextProvider
        visibilityMap={rowVisibilityMap}
        visibilityMode={rowVisibilityMode}
        setRowVisibilityMode={setRowVisibilityMode}
        toggleRowVisibility={toggleRowVisibility}
      >
        <ExperimentLoggedModelListPageControls
          columnDefs={columnDefs}
          columnVisibility={columnVisibility}
          onChangeOrderBy={setOrderBy}
          onUpdateColumns={setColumnVisibility}
          orderByColumn={orderByColumn}
          orderByAsc={orderByAsc}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          onChangeSearchQuery={updateSearchQuery}
          loggedModelsData={loggedModels ?? []}
          sortingAndFilteringEnabled={sortingAndFilteringEnabled}
          selectedFilterDatasets={selectedFilterDatasets}
          onToggleDataset={toggleDataset}
          onClearSelectedDatasets={clearSelectedDatasets}
          groupBy={groupBy}
          onChangeGroupBy={setGroupBy}
        />
        <Spacer size="sm" shrinks={false} />
        {/* Display error message, but not if it's 400 - in that case, the error message is displayed in the table */}
        {loggedModelsError?.message && !badRequestError && (
          <>
            <Alert
              componentId="mlflow.logged_models.list.error"
              message={loggedModelsError.message}
              type="error"
              closable={false}
            />
            <Spacer size="sm" shrinks={false} />
          </>
        )}
        {isCompactTableMode ? (
          <RunsChartsSetHighlightContextProvider>
            <div ref={ref} css={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
              <ExperimentViewRunsTableResizer
                onResize={setTableAreaWidth}
                runListHidden={tableHidden}
                width={tableAreaWidth}
                onHiddenChange={setTableHidden}
                maxWidth={resizableMaxWidth}
              >
                {tableElement}
              </ExperimentViewRunsTableResizer>
              {viewMode === ExperimentLoggedModelListPageMode.CHART && (
                <ExperimentLoggedModelListCharts
                  loggedModels={loggedModels ?? []}
                  experimentId={experimentId}
                  minWidth={CHARTS_MIN_WIDTH}
                />
              )}
            </div>
          </RunsChartsSetHighlightContextProvider>
        ) : (
          tableElement
        )}
      </ExperimentLoggedModelListPageRowVisibilityContextProvider>
    </ExperimentLoggedModelOpenDatasetDetailsContextProvider>
  );
};

const ExperimentLoggedModelListPage = () => (
  <ExperimentLoggedModelPageWrapper>
    <ExperimentLoggedModelListPageImpl />
  </ExperimentLoggedModelPageWrapper>
);

export default ExperimentLoggedModelListPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelPageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-logged-models/ExperimentLoggedModelPageWrapper.tsx

```typescript
import { UserActionErrorHandler } from '@databricks/web-shared/metrics';
import { ErrorBoundary } from 'react-error-boundary';
import { DangerIcon, Empty, PageWrapper } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

const PageFallback = ({ error }: { error?: Error }) => {
  return (
    <PageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage
            defaultMessage="Error"
            description="Title for error fallback component in prompts management UI"
          />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering this component."
              description="Description for default error message in prompts management UI"
            />
          )
        }
        image={<DangerIcon />}
      />
    </PageWrapper>
  );
};

/**
 * Wrapper for all experiment logged model pages.
 * Provides error boundaries and user action error handling.
 */
export const ExperimentLoggedModelPageWrapper = ({
  children,
  resetKey,
}: {
  children: React.ReactNode;
  resetKey?: unknown;
}) => {
  return (
    <ErrorBoundary FallbackComponent={PageFallback} resetKeys={[resetKey]}>
      <UserActionErrorHandler>{children}</UserActionErrorHandler>
    </ErrorBoundary>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageSubTabSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/ExperimentPageSubTabSelector.tsx

```typescript
import { Spacer, Tabs, useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentPageTabName } from '../../constants';
import { Link } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { FormattedMessage } from '@databricks/i18n';
import Routes from '../../routes';

export const ExperimentPageSubTabSelector = ({
  experimentId,
  activeTab,
}: {
  experimentId: string;
  activeTab: ExperimentPageTabName;
}) => {
  const { theme } = useDesignSystemTheme();

  if (activeTab === ExperimentPageTabName.EvaluationRuns || activeTab === ExperimentPageTabName.Datasets) {
    return (
      <Tabs.Root
        componentId="mlflow.experiment.details.sub-tab-selector"
        value={activeTab}
        css={{ '& > div': { marginBottom: 0 } }}
      >
        <Tabs.List>
          <Tabs.Trigger value={ExperimentPageTabName.EvaluationRuns}>
            <Link
              css={{ color: theme.colors.textPrimary }}
              to={Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.EvaluationRuns)}
            >
              <FormattedMessage
                defaultMessage="Runs"
                description="Label for the evaluation runs sub-tab in the MLflow experiment navbar"
              />
            </Link>
          </Tabs.Trigger>
          <Tabs.Trigger value={ExperimentPageTabName.Datasets}>
            <Link
              css={{ color: theme.colors.textPrimary }}
              to={Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Datasets)}
            >
              <FormattedMessage
                defaultMessage="Datasets"
                description="Label for the evaluation datasets sub-tab in the MLflow experiment navbar"
              />
            </Link>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    );
  }

  return (
    <>
      <Spacer size="sm" shrinks={false} />
      <div css={{ width: '100%', borderTop: `1px solid ${theme.colors.border}` }} />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageTabs.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-page-tabs/ExperimentPageTabs.test.tsx

```typescript
import { jest, describe, beforeAll, beforeEach, test, expect } from '@jest/globals';
import { DesignSystemProvider } from '@databricks/design-system';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { graphql, rest } from 'msw';
import { IntlProvider } from 'react-intl';
import { setupTestRouter, TestRouter, waitForRoutesToBeRendered } from '../../../common/utils/RoutingTestUtils';
import { setupServer } from '../../../common/utils/setup-msw';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { NOTE_CONTENT_TAG } from '../../utils/NoteUtils';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { ExperimentKind } from '../../constants';
import { createLazyRouteElement, createMLflowRoutePath } from '../../../common/utils/RoutingUtils';
import { PageId, RoutePaths } from '../../routes';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000); // Larger timeout for integration testing

jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
}));
jest.mock('../experiment-logged-models/ExperimentLoggedModelListPage', () => ({
  // mock default export
  __esModule: true,
  default: () => <div>ExperimentLoggedModelListPage</div>,
}));

jest.mock('../experiment-traces/ExperimentTracesPage', () => ({
  // mock default export
  __esModule: true,
  default: () => <div>Experiment traces page</div>,
}));

describe('ExperimentLoggedModelListPage', () => {
  const { history } = setupTestRouter();
  const createTestExperiment = (
    id = '12345678',
    name = 'Test experiment name',
    tags = [{ key: 'mlflow.experimentKind', value: ExperimentKind.CUSTOM_MODEL_DEVELOPMENT }],
  ) => {
    return {
      __typename: 'MlflowExperiment',
      artifactLocation: null,
      name,
      creationTime: null,
      experimentId: id,
      lastUpdateTime: null,
      lifecycleStage: 'active',
      tags,
    };
  };
  const createTestExperimentResponse = (experiment: any) => ({
    mlflowGetExperiment: {
      __typename: 'MlflowGetExperimentResponse',
      apiError: null,
      experiment,
    },
  });

  const server = setupServer(
    graphql.query('MlflowGetExperimentQuery', (req, res, ctx) =>
      res(ctx.data(createTestExperimentResponse(createTestExperiment()))),
    ),
    // Add MSW handlers for experiment kind inference API calls
    rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => res(ctx.json({ traces: [] }))),
    rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => res(ctx.json({ runs: [] }))),
  );

  const renderTestComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <TestApolloProvider disableCache>
        <MockedReduxStoreProvider state={{ entities: { experimentTagsByExperimentId: {}, experimentsById: {} } }}>
          <IntlProvider locale="en">
            <QueryClientProvider client={queryClient}>
              <DesignSystemProvider>
                <TestRouter
                  routes={[
                    {
                      path: RoutePaths.experimentPage,
                      pageId: PageId.experimentPage,
                      element: createLazyRouteElement(() => import('./ExperimentPageTabs')),
                      children: [
                        {
                          path: RoutePaths.experimentPageTabTraces,
                          pageId: PageId.experimentPageTabTraces,
                          element: createLazyRouteElement(() => import('../experiment-traces/ExperimentTracesPage')),
                        },
                        {
                          path: RoutePaths.experimentPageTabModels,
                          pageId: PageId.experimentPageTabModels,
                          element: createLazyRouteElement(
                            () => import('../experiment-logged-models/ExperimentLoggedModelListPage'),
                          ),
                        },
                      ],
                    },
                  ]}
                  history={history}
                  initialEntries={[createMLflowRoutePath('/experiments/12345678/models')]}
                />
              </DesignSystemProvider>
            </QueryClientProvider>
          </IntlProvider>
        </MockedReduxStoreProvider>
      </TestApolloProvider>,
    );
  };

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  beforeEach(() => {
    server.resetHandlers();
  });

  test('should display experiment title when fetched', async () => {
    renderTestComponent();

    // Wait for lazy-loaded route components to finish loading and PageLoading skeleton to be removed.
    // First test in suite takes longer because lazy modules haven't been cached yet.
    await waitFor(() => waitForRoutesToBeRendered());

    await waitFor(() => {
      expect(screen.getByText('Test experiment name')).toBeInTheDocument();
    });
  });

  test('integration test: should display popover about inferred experiment kind', async () => {
    const confirmTagApiSpy = jest.fn();

    server.resetHandlers(
      graphql.query('MlflowBatchGetExperimentsQuery', (req, res, ctx) =>
        res(ctx.data(createTestExperimentResponse([createTestExperiment('12345678', 'Test experiment name', [])]))),
      ),
      graphql.query('MlflowGetExperimentQuery', (req, res, ctx) =>
        res(ctx.data(createTestExperimentResponse(createTestExperiment('12345678', 'Test experiment name', [])))),
      ),
    );

    // Simulate experiment's traces so "GenAI" experiment kind is inferred
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        return res(ctx.json({ traces: [{ id: 'trace1' }] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        return res(ctx.json({ runs: [{ info: { run_uuid: 'run1' } }] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/experiments/set-experiment-tag', (req, res, ctx) => {
        confirmTagApiSpy(req.body);
        return res(ctx.json({}));
      }),
    );

    renderTestComponent();

    // Check that the popover is displayed
    expect(
      await screen.findByText(
        "We've automatically detected the experiment type to be 'GenAI apps & agents'. You can either confirm or change the type.",
        undefined,
      ),
    ).toBeInTheDocument();

    // Check we've been redirected to the Traces tab
    expect(await screen.findByText('Experiment traces page')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(confirmTagApiSpy).toHaveBeenCalledWith({
      experiment_id: '12345678',
      key: 'mlflow.experimentKind',
      value: ExperimentKind.GENAI_DEVELOPMENT,
    });
  });

  test('integration test: should display modal with information about impossible experiment type inference', async () => {
    const confirmTagApiSpy = jest.fn();
    server.resetHandlers(
      graphql.query('MlflowGetExperimentQuery', (req, res, ctx) =>
        res(ctx.data(createTestExperimentResponse(createTestExperiment('12345678', 'Test experiment name', [])))),
      ),
    );

    // Simulate empty experiment so no experiment kind can be inferred
    server.use(
      rest.get('/ajax-api/2.0/mlflow/traces', (req, res, ctx) => {
        return res(ctx.json({ traces: [] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) => {
        return res(ctx.json({ runs: [] }));
      }),
      rest.post('/ajax-api/2.0/mlflow/experiments/set-experiment-tag', (req, res, ctx) => {
        confirmTagApiSpy(req.body);
        return res(ctx.json({}));
      }),
    );

    renderTestComponent();

    expect(
      await screen.findByText(
        "We support multiple experiment types, each with its own set of features. Please select the type you'd like to use. You can change this later if needed.",
        undefined,
      ),
    ).toBeInTheDocument();

    const modal = screen.getByRole('dialog');

    await userEvent.click(within(modal).getByRole('radio', { name: 'GenAI apps & agents' }));
    await userEvent.click(within(modal).getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(confirmTagApiSpy).toHaveBeenCalledWith({
        experiment_id: '12345678',
        key: 'mlflow.experimentKind',
        value: ExperimentKind.GENAI_DEVELOPMENT,
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````

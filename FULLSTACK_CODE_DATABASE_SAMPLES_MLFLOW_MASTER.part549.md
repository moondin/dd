---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 549
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 549 of 991)

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

---[FILE: ExperimentLoggedModelDetailsPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-logged-models/ExperimentLoggedModelDetailsPage.test.tsx

```typescript
import { jest, describe, beforeAll, beforeEach, test, expect } from '@jest/globals';
import { DesignSystemProvider } from '@databricks/design-system';
import { getTableRowByCellText, getTableCellInRow } from '@databricks/design-system/test-utils/rtl';
import { render, screen, waitFor, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import ExperimentLoggedModelDetailsPage from './ExperimentLoggedModelDetailsPage';
import userEvent from '@testing-library/user-event';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import { setupServer } from '../../../common/utils/setup-msw';
import { graphql, rest } from 'msw';
import type { GetRun, GetRunVariables, MlflowGetExperimentQuery } from '../../../graphql/__generated__/graphql';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { first } from 'lodash';
import { LoggedModelStatusProtoEnum } from '../../types';
import Utils from '../../../common/utils/Utils';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useExperimentTrackingDetailsPageLayoutStyles } from '../../hooks/useExperimentTrackingDetailsPageLayoutStyles';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // Larger timeout for integration testing (tables rendering)

jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
}));

jest.mock('../../hooks/useExperimentTrackingDetailsPageLayoutStyles', () => ({
  useExperimentTrackingDetailsPageLayoutStyles: jest.fn(),
}));

const testExperimentName = '/Some test experiment';

const testData = {
  metrics: [
    {
      key: 'metric-1',
      value: 10,
      step: 1,
      timestamp: 1728322600000,
      dataset_digest: '1',
      dataset_name: 'dataset-1',
      model_id: 'm-1',
      run_id: 'run-id-1',
    },
    {
      key: 'metric-2',
      value: 20,
      step: 1,
      timestamp: 1728322600000,
      dataset_digest: '2',
      dataset_name: 'dataset-2',
      model_id: 'm-1',
      run_id: 'run-id-2',
    },
    {
      key: 'metric-11',
      value: 20,
      step: 1,
      timestamp: 1728322600000,
      dataset_digest: '1',
      dataset_name: 'dataset-1',
      model_id: 'm-1',
      run_id: 'run-id-1',
    },
  ],
  params: [
    {
      key: 'top_k',
      value: '0.9',
    },
    {
      key: 'generative_llm',
      value: 'GPT-4',
    },
    {
      key: 'max_tokens',
      value: '2000',
    },
  ],
};

const getMockedModelResponse = (data: any = testData) =>
  rest.get('/ajax-api/2.0/mlflow/logged-models/:modelId', (req, res, ctx) =>
    res(
      ctx.json({
        model: {
          info: {
            artifact_uri: `dbfs:/databricks/mlflow/model-1`,
            creation_timestamp_ms: 1728322600000,
            last_updated_timestamp_ms: 1728322600000,
            source_run_id: 'run-id-1',
            creator_id: 'test@test.com',
            experiment_id: 'test-experiment',
            model_id: `m-1`,
            model_type: 'Agent',
            name: 'model-1',
            tags: [
              {
                key: 'mlflow.sourceRunName',
                value: 'run-name',
              },
              {
                key: 'mlflow.user',
                value: 'user@users.com',
              },
              {
                key: 'mlflow.modelVersions',
                value: JSON.stringify([
                  { name: 'main.default.alpha-uc-model', version: '3' },
                  { name: 'beta-wmr-model', version: '2' },
                  { name: 'main.default.gamma-uc-model', version: '1' },
                ]),
              },
            ],
            status_message: 'Ready',
            status: LoggedModelStatusProtoEnum.LOGGED_MODEL_READY,
            registrations: [],
          },
          data,
        },
      }),
    ),
  );

describe('ExperimentLoggedModelListPage', () => {
  const { history } = setupTestRouter();
  const server = setupServer(
    getMockedModelResponse(),
    // Mock the run details API to respond with the run name
    rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) =>
      res(
        ctx.json({
          run: {
            info: {
              // Transform "run-id-1" to "run-name-1"
              run_name: `run-name-${req.url.searchParams.get('run_id')?.replace(/\D+/g, '')}`,
              run_uuid: req.url.searchParams.get('run_id'),
            },
          },
        }),
      ),
    ),
    graphql.query<MlflowGetExperimentQuery>('MlflowGetExperimentQuery', (req, res, ctx) =>
      res(
        ctx.data({
          mlflowGetExperiment: {
            __typename: 'MlflowGetExperimentResponse',
            apiError: null,
            experiment: {
              __typename: 'MlflowExperiment',
              name: testExperimentName,
            } as any,
          },
        }),
      ),
    ),
    rest.get('/ajax-api/2.0/mlflow/registered-models/search', (req, res, ctx) => res(ctx.json({}))),
  );

  const renderTestComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <TestApolloProvider disableCache>
        <QueryClientProvider client={queryClient}>
          <IntlProvider locale="en">
            <DesignSystemProvider>
              <MockedReduxStoreProvider
                state={{ entities: { colorByRunUuid: {}, modelByName: { testmodel: { name: 'testmodel' } } } }}
              >
                <TestRouter
                  routes={[
                    testRoute(<ExperimentLoggedModelDetailsPage />, '/experiments/:experimentId/models/:loggedModelId'),
                    testRoute(<div />, '*'),
                  ]}
                  history={history}
                  initialEntries={['/experiments/test-experiment/models/m-12345']}
                />
              </MockedReduxStoreProvider>
            </DesignSystemProvider>
          </IntlProvider>
        </QueryClientProvider>
      </TestApolloProvider>,
    );
  };

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  beforeEach(() => {
    jest
      .mocked<any>(useExperimentTrackingDetailsPageLayoutStyles)
      .mockReturnValue({ usingUnifiedDetailsLayout: false });
    server.resetHandlers();
  });

  test('should display page with the sample data (legacy layout)', async () => {
    const { container } = renderTestComponent();

    await waitFor(() => {
      expect(container.textContent).toMatch(/Model ID\s*m-1/);
      expect(container.textContent).toMatch(/Source run ID\s*run-id-\d/);
    });

    expect(container.textContent).toMatch(/Created by\s*user@users.com/);

    await waitFor(() => {
      expect(container.textContent).toMatch(/Source run\s*run-name-\d/);
    });

    // Expect the experiment name to be visible in the breadcrumbs
    await waitFor(() => {
      expect(screen.getByRole('link', { name: testExperimentName })).toBeInTheDocument();
    });
  });

  test('should display page with the sample data (unified sidebar layout)', async () => {
    jest.mocked<any>(useExperimentTrackingDetailsPageLayoutStyles).mockReturnValue({ usingUnifiedDetailsLayout: true });

    const { container, getByRole } = renderTestComponent();

    await waitFor(() => {
      expect(container.textContent).toMatch(/Status\s*Ready/);
      expect(container.textContent).toMatch(/Model ID\s*m-1/);
      expect(container.textContent).toMatch(/Source run ID\s*run-id-\d/);
    });

    expect(container.textContent).toMatch(/Created by\s*user@users.com/);

    await waitFor(() => {
      expect(container.textContent).toMatch(/Source run\s*run-name-\d/);
    });
  });

  test('should handle "not found" error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      rest.get('/ajax-api/2.0/mlflow/logged-models/:modelId', (req, res, ctx) =>
        res(
          ctx.status(404),
          ctx.json({
            message: 'Not found',
            code: 'RESOURCE_DOES_NOT_EXIST',
          }),
        ),
      ),
    );

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
    jest.restoreAllMocks();
  });

  test('should gracefully handle experiment load error', async () => {
    server.use(
      graphql.query<MlflowGetExperimentQuery>('MlflowGetExperimentQuery', (req, res, ctx) =>
        res(
          ctx.data({
            mlflowGetExperiment: {
              __typename: 'MlflowGetExperimentResponse',
              apiError: {
                __typename: 'ApiError',
                code: 'RESOURCE_DOES_NOT_EXIST',
                message: 'Experiment not found',
              },
              experiment: null,
            },
          }),
        ),
      ),
    );

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText('Experiment load error: Experiment not found')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'model-1' })).toBeInTheDocument();
    });
  });
  test('should render parameter list', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByRole('row', { name: 'top_k 0.9' })).toBeInTheDocument();
    });
    expect(screen.getByRole('row', { name: 'generative_llm GPT-4' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'max_tokens 2000' })).toBeInTheDocument();
  });

  test('should render metrics table', async () => {
    const { container } = renderTestComponent();

    // Assert metrics table to be visible on the page
    await waitFor(() => {
      expect(within(container).getByPlaceholderText('Search metrics')).toBeInTheDocument();
    });

    // Find the row with metric-1
    const table = screen.getByTestId('logged-model-details-metrics-table');
    const firstDataRow = getTableRowByCellText(table, 'metric-1', { columnHeaderName: 'Metric' });

    // Assert existence of the dataset link
    expect(within(firstDataRow).getByRole('button', { name: 'dataset-1 (#1)' })).toBeInTheDocument();

    // Assert existence of the source run link
    expect(within(firstDataRow).getByRole('link', { name: 'run-name-1' })).toBeInTheDocument();
    expect(within(firstDataRow).getByRole('link', { name: 'run-name-1' }).getAttribute('href')).toContain('run-id-1');

    // Assert existence of the metric value
    expect(getTableCellInRow(table, { columnHeaderName: 'Metric', cellText: 'metric-1' }, 'Value')).toHaveTextContent(
      /[-0-9.]+/,
    );

    // Try to search by metric name
    await userEvent.type(screen.getByPlaceholderText('Search metrics'), 'metric-2');
    // Assert that the table displays a single data row (+ 1 header row)
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 1);

    // Try to search by run name
    await userEvent.clear(screen.getByPlaceholderText('Search metrics'));
    await userEvent.type(screen.getByPlaceholderText('Search metrics'), 'run-name-2');
    // Assert that the table displays a single data row (+ 1 header row)
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 1);

    // Try to search by dataset name
    await userEvent.clear(screen.getByPlaceholderText('Search metrics'));
    await userEvent.type(screen.getByPlaceholderText('Search metrics'), 'dataset-2');
    // Assert that the table displays a single data row (+ 1 header row)
    expect(within(table).getAllByRole('row')).toHaveLength(1 + 1);

    // Try to search for non-existent metric
    await userEvent.clear(screen.getByPlaceholderText('Search metrics'));
    await userEvent.type(screen.getByPlaceholderText('Search metrics'), 'some-bogus-metric');

    // Assert that the table displays no metrics found message
    expect(screen.getByText('No metrics match the search filter')).toBeInTheDocument();
  });

  test('should render runs table with run names', async () => {
    const { container } = renderTestComponent();

    // Assert runs table to be visible on the page
    await waitFor(() => {
      expect(screen.getByTestId('logged-model-details-runs-table')).toBeInTheDocument();
    });

    // Find the row with run-1
    const table = screen.getByTestId('logged-model-details-runs-table');

    // Locate data rows
    const firstDataRow = getTableRowByCellText(table, 'run-name-1', { columnHeaderName: 'Run' });
    const lastDataRow = getTableRowByCellText(table, 'run-name-2', { columnHeaderName: 'Run' });

    // Assert that rows actually contain links to run details pages
    expect(within(firstDataRow).getByRole('link', { name: 'run-name-1' })).toBeInTheDocument();
    expect(within(firstDataRow).getByRole('link', { name: 'run-name-1' }).getAttribute('href')).toContain('run-id-1');
    expect(within(lastDataRow).getByRole('link', { name: 'run-name-2' })).toBeInTheDocument();
    expect(within(lastDataRow).getByRole('link', { name: 'run-name-2' }).getAttribute('href')).toContain('run-id-2');

    // Assert correct datasets according to demo data generation rules
    expect(within(firstDataRow).getByText('dataset-1 (#1)')).toBeInTheDocument();
    expect(within(lastDataRow).getByText('dataset-2 (#2)')).toBeInTheDocument();
  });

  test('should render dataset details by clicking in the metrics table', async () => {
    server.use(
      graphql.query<any, GetRunVariables>('GetRun', (req, res, ctx) =>
        res(
          ctx.data({
            mlflowGetRun: {
              __typename: 'MlflowGetRunResponse',
              apiError: null,
              run: {
                __typename: 'MlflowRun',
                data: null,
                experiment: null,
                info: {
                  __typename: 'MlflowRunInfo',
                  runUuid: req.variables.data.runId,
                } as any,
                modelVersions: null,
                outputs: null,
                inputs: {
                  __typename: 'MlflowRunInputs',
                  datasetInputs: ['1', '2'].map((datasetDigest) => ({
                    __typename: 'MlflowDatasetInput',
                    dataset: {
                      __typename: 'MlflowDataset',
                      digest: datasetDigest,
                      name: `dataset-${datasetDigest}`,
                      source: JSON.stringify({ tags: {} }),
                      sourceType: 'code',
                      profile: JSON.stringify({}),
                      schema: JSON.stringify({
                        mlflow_colspec: [
                          { type: 'double', name: `test-input-for-dataset-${datasetDigest}`, required: true },
                        ],
                      }),
                    },
                    tags: null,
                  })),
                },
              },
            },
          }),
        ),
      ),
    );

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByTestId('logged-model-details-runs-table')).toBeInTheDocument();
    });

    const table = screen.getByTestId('logged-model-details-runs-table');

    const datasetButton = first(within(table).getAllByRole('button', { name: 'dataset-1 (#1)' })) as HTMLButtonElement;

    // Click on the dataset button
    await userEvent.click(datasetButton);

    // Wait until dataset dialogs is rendered
    await waitFor(() => {
      const datasetDrawer = screen.getByRole('dialog', { name: /Data details for/ });
      expect(datasetDrawer).toBeInTheDocument();
      // Make sure that the input from the schema column spec is rendered
      expect(within(datasetDrawer).getByText('test-input-for-dataset-1')).toBeInTheDocument();
    });
  });

  test('should display dataset details error when dataset run is not available', async () => {
    server.use(getMockedModelResponse());
    server.use(
      graphql.query<GetRun, GetRunVariables>('GetRun', (req, res, ctx) =>
        res(
          ctx.data({
            mlflowGetRun: {
              __typename: 'MlflowGetRunResponse',
              apiError: {
                __typename: 'ApiError',
                message: 'Run not found',
                code: 'RESOURCE_DOES_NOT_EXIST',
                helpUrl: null,
              },
              run: null,
            },
          }),
        ),
      ),
    );

    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByTestId('logged-model-details-runs-table')).toBeInTheDocument();
    });

    const table = screen.getByTestId('logged-model-details-runs-table');

    const datasetButton = first(within(table).getAllByRole('button', { name: 'dataset-1 (#1)' })) as HTMLButtonElement;

    await userEvent.click(datasetButton);

    // Error message should be displayed
    await waitFor(() => {
      expect(screen.getByText('The run containing the dataset could not be found.')).toBeInTheDocument();
    });
  });
  test('should successfully register logged model in workspace registry', async () => {
    jest.spyOn(Utils, 'displayGlobalInfoNotification');
    const registerApiSpy = jest.fn();
    server.use(getMockedModelResponse({}));
    server.use(rest.post('/ajax-api/2.0/mlflow/registered-models/create', (req, res, ctx) => res(ctx.json({}))));
    server.use(
      rest.post('/ajax-api/2.0/mlflow/model-versions/create', (req, res, ctx) => {
        registerApiSpy(req.body);
        return res(ctx.json({}));
      }),
    );
    const { container } = renderTestComponent();

    await waitFor(() => {
      expect(within(container).getByRole('button', { name: 'Register model' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Register model' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Select a model')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Select a model'));

    await waitFor(() => {
      expect(screen.getByText('Create New Model')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Create New Model'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Input a model name')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText('Input a model name'), 'new-model-name');

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    const expectedMessage = 'Model registered successfully';

    await waitFor(() => {
      expect(Utils.displayGlobalInfoNotification).toHaveBeenCalledWith(expect.stringContaining(expectedMessage));
    });

    expect(registerApiSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        model_id: 'm-1',
      }),
    );

    jest.restoreAllMocks();
  });

  test('should attempt to delete logged model', async () => {
    const deleteApiSpy = jest.fn();

    server.use(getMockedModelResponse({}));
    server.use(
      rest.delete('/ajax-api/2.0/mlflow/logged-models/:modelId', (req, res, ctx) => {
        deleteApiSpy(req.params);
        return res(ctx.json({}));
      }),
    );
    const { container } = renderTestComponent();

    await waitFor(() => {
      expect(within(container).getByLabelText('More actions')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText('More actions'));

    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteApiSpy).toHaveBeenCalledWith({ modelId: 'm-1' });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-logged-models/ExperimentLoggedModelDetailsPage.tsx
Signals: React

```typescript
import { Alert, PageWrapper, TableSkeleton, useDesignSystemTheme, Spacer } from '@databricks/design-system';
import invariant from 'invariant';
import { useParams } from '../../../common/utils/RoutingUtils';
import { ExperimentLoggedModelDetailsHeader } from '../../components/experiment-logged-models/ExperimentLoggedModelDetailsHeader';
import { ExperimentLoggedModelPageWrapper } from './ExperimentLoggedModelPageWrapper';
import { ExperimentLoggedModelDetailsNav } from '../../components/experiment-logged-models/ExperimentLoggedModelDetailsNav';
import { ExperimentLoggedModelDetailsOverview } from '../../components/experiment-logged-models/ExperimentLoggedModelDetailsOverview';
import { useGetLoggedModelQuery } from '../../hooks/logged-models/useGetLoggedModelQuery';
import { useGetExperimentQuery } from '../../hooks/useExperimentQuery';
import React from 'react';
import { ExperimentLoggedModelDetailsArtifacts } from '../../components/experiment-logged-models/ExperimentLoggedModelDetailsArtifacts';
import { useUserActionErrorHandler } from '@databricks/web-shared/metrics';
import { FormattedMessage } from 'react-intl';
import { ExperimentLoggedModelDetailsTraces } from '../../components/experiment-logged-models/ExperimentLoggedModelDetailsTraces';
import { getExperimentKindFromTags } from '../../utils/ExperimentKindUtils';

/**
 * Temporary "in construction" placeholder box, to be removed after implementing the actual content.
 */
const PlaceholderBox = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.md,
        border: `4px dashed ${theme.colors.border}`,
        marginBottom: theme.spacing.md,
        flex: 1,
      }}
    >
      {children}
    </div>
  );
};

const ExperimentLoggedModelDetailsPageImpl = () => {
  const { experimentId, loggedModelId, tabName } = useParams();
  const { clearUserActionError, currentUserActionError } = useUserActionErrorHandler();

  invariant(experimentId, 'Experiment ID must be defined');
  invariant(loggedModelId, 'Logged model ID must be defined');

  const { theme } = useDesignSystemTheme();
  const {
    data: loggedModel,
    isLoading: loggedModelLoading,
    error: loggedModelLoadError,
    refetch,
  } = useGetLoggedModelQuery({ loggedModelId });
  const {
    data: experimentData,
    loading: experimentLoading,
    apiError: experimentApiError,
    apolloError: experimentApolloError,
  } = useGetExperimentQuery({ experimentId });

  // If there is an unrecoverable error loading the model, throw it to be handled by the error boundary
  if (loggedModelLoadError) {
    throw loggedModelLoadError;
  }

  const experimentLoadError = experimentApiError ?? experimentApolloError;

  const renderSelectedTab = () => {
    if (loggedModelLoading) {
      return <TableSkeleton lines={12} />;
    }

    // TODO: implement error handling
    if (!loggedModel) {
      return null;
    }

    const experiment = experimentData;

    if (tabName === 'traces') {
      return (
        <ExperimentLoggedModelDetailsTraces
          loggedModel={loggedModel}
          experimentTags={experiment?.tags ?? []}
          isLoadingExperiment={experimentLoading}
        />
      );
    } else if (tabName === 'artifacts') {
      return <ExperimentLoggedModelDetailsArtifacts loggedModel={loggedModel} />;
    }

    const experimentKind = getExperimentKindFromTags(experiment?.tags);

    return (
      <ExperimentLoggedModelDetailsOverview
        onDataUpdated={refetch}
        loggedModel={loggedModel}
        experimentKind={experimentKind}
      />
    );
  };

  return (
    <>
      <ExperimentLoggedModelDetailsHeader
        experimentId={experimentId}
        experiment={experimentData}
        loggedModel={loggedModel}
        loading={loggedModelLoading || experimentLoading}
        onSuccess={refetch}
      />
      {currentUserActionError && (
        <Alert
          componentId="mlflow.logged_model.details.user-action-error"
          css={{ marginBottom: theme.spacing.sm }}
          type="error"
          message={currentUserActionError.displayMessage ?? currentUserActionError.message}
          onClose={clearUserActionError}
        />
      )}
      {experimentLoadError?.message && (
        <Alert
          componentId="mlflow.logged_model.details.experiment-error"
          css={{ marginBottom: theme.spacing.sm }}
          type="error"
          message={
            <FormattedMessage
              defaultMessage="Experiment load error: {errorMessage}"
              description="Error message displayed on logged models page when experiment data fails to load"
              values={{ errorMessage: experimentLoadError.message }}
            />
          }
          closable={false}
        />
      )}
      <ExperimentLoggedModelDetailsNav experimentId={experimentId} modelId={loggedModelId} activeTabName={tabName} />
      <div css={{ overflow: 'auto', flex: 1 }}>{renderSelectedTab()}</div>
    </>
  );
};

const ExperimentLoggedModelDetailsPage = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <ExperimentLoggedModelPageWrapper>
      <PageWrapper
        css={{
          display: 'flex',
          overflow: 'hidden',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Spacer shrinks={false} />
        <ExperimentLoggedModelDetailsPageImpl />
        <Spacer shrinks={false} />
      </PageWrapper>
    </ExperimentLoggedModelPageWrapper>
  );
};

export default ExperimentLoggedModelDetailsPage;
```

--------------------------------------------------------------------------------

````

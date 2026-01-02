---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 506
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 506 of 991)

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

---[FILE: RunPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunPage.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { renderWithIntl, screen, waitFor, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { getExperimentApi, getRunApi, updateRunApi } from '../../actions';
import { searchModelVersionsApi } from '../../../model-registry/actions';
import { merge } from 'lodash';
import type { ReduxState } from '../../../redux-types';
import type { DeepPartial } from 'redux';
import { RunPage } from './RunPage';
import { testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import type { RunInfoEntity } from '../../types';
import userEvent from '@testing-library/user-event';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import {
  shouldEnableGraphQLRunDetailsPage,
  shouldUseGetLoggedModelsBatchAPI,
} from '../../../common/utils/FeatureUtils';
import { setupServer } from '../../../common/utils/setup-msw';
import { graphql, rest } from 'msw';
import type { GetRun, GetRunVariables } from '../../../graphql/__generated__/graphql';
import { MlflowRunStatus } from '../../../graphql/__generated__/graphql';
import { DesignSystemProvider } from '@databricks/design-system';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import Utils from '../../../common/utils/Utils';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // Higher timeout due to integration testing and tables

jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
  shouldEnableGraphQLRunDetailsPage: jest.fn(),
  isModelsInUCEnabled: jest.fn(),
  isRegisterUCModelFromUIEnabled: jest.fn(),
  shouldUseGetLoggedModelsBatchAPI: jest.fn(),
}));

const mockAction = (id: string) => ({ type: 'action', payload: Promise.resolve(), meta: { id } });

jest.mock('../../actions', () => ({
  getExperimentApi: jest.fn(() => mockAction('experiment_request')),
  getRunApi: jest.fn(() => mockAction('run_request')),
  updateRunApi: jest.fn(() => mockAction('run_request')),
}));

jest.mock('../../../model-registry/actions', () => ({
  searchModelVersionsApi: jest.fn(() => mockAction('models_request')),
  searchRegisteredModelsApi: jest.fn(() => mockAction('search_registered_models_request')),
  ucRegisterModelVersionApi: jest.fn(() => mockAction('register_model_version_request')),
}));

const testRunUuid = 'test-run-uuid';
const testExperimentId = '12345';
const testRunInfo: Partial<RunInfoEntity> = {
  runName: 'Test run Name',
  experimentId: testExperimentId,
};

describe('RunPage (legacy redux + REST API)', () => {
  const server = setupServer();

  beforeEach(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    jest.mocked(shouldEnableGraphQLRunDetailsPage).mockImplementation(() => false);
  });

  const mountComponent = (
    entities: DeepPartial<ReduxState['entities']> = {},
    apis: DeepPartial<ReduxState['apis']> = {},
  ) => {
    const state: DeepPartial<ReduxState> = {
      entities: merge(
        {
          artifactRootUriByRunUuid: {},
          runInfosByUuid: {},
          experimentsById: {},
          tagsByRunUuid: {},
          latestMetricsByRunUuid: {},
          runDatasetsByUuid: {},
          paramsByRunUuid: {},
          modelVersionsByRunUuid: {},
        },
        entities,
      ),
      apis: merge(
        {
          experiment_request: { active: true },
          run_request: { active: true },
        },
        apis,
      ),
    };

    const queryClient = new QueryClient();

    const renderResult = renderWithIntl(
      <TestApolloProvider>
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <MockedReduxStoreProvider state={state}>
              <TestRouter
                initialEntries={[`/experiment/${testExperimentId}/run/${testRunUuid}`]}
                routes={[testRoute(<RunPage />, '/experiment/:experimentId/run/:runUuid')]}
              />
            </MockedReduxStoreProvider>
          </QueryClientProvider>
        </DesignSystemProvider>
      </TestApolloProvider>,
    );

    return renderResult;
  };

  beforeEach(() => {
    jest.mocked(getRunApi).mockClear();
    jest.mocked(getExperimentApi).mockClear();
    jest.mocked(searchModelVersionsApi).mockClear();
    jest.mocked(updateRunApi).mockClear();
  });

  test('Start fetching run when store is empty and experiment and indicate loading state', async () => {
    mountComponent();

    await waitFor(() => {
      expect(screen.getByText('Run page loading')).toBeInTheDocument();
    });

    expect(getRunApi).toHaveBeenCalledWith(testRunUuid);
    expect(getExperimentApi).toHaveBeenCalledWith(testExperimentId);
    expect(searchModelVersionsApi).toHaveBeenCalledWith({ run_id: testRunUuid });
  });

  const entitiesWithMockRun = {
    runInfosByUuid: { [testRunUuid]: testRunInfo },
    experimentsById: {
      [testExperimentId]: { experimentId: testExperimentId, name: 'Test experiment name' },
    },
    tagsByRunUuid: { [testRunUuid]: {} },
    latestMetricsByRunUuid: {},
    runDatasetsByUuid: {},
    paramsByRunUuid: {},
    modelVersionsByRunUuid: {},
  };

  test('Do not display loading state when run and experiments are already loaded', async () => {
    mountComponent(entitiesWithMockRun);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Test run Name/ })).toBeInTheDocument();
    });

    expect(getRunApi).not.toHaveBeenCalled();
    expect(getExperimentApi).not.toHaveBeenCalled();
    expect(searchModelVersionsApi).toHaveBeenCalled();
  });

  test('Attempt to rename the run', async () => {
    mountComponent(entitiesWithMockRun);

    await waitFor(() => {
      expect(screen.getByLabelText('Open header dropdown menu')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText('Open header dropdown menu'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    await userEvent.clear(screen.getByTestId('rename-modal-input'));
    await userEvent.type(screen.getByTestId('rename-modal-input'), 'brand_new_run_name');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateRunApi).toHaveBeenCalledWith('test-run-uuid', 'brand_new_run_name', expect.anything());
  });

  test('Display 404 page in case of missing run', async () => {
    const runFetchError = new ErrorWrapper({ error_code: 'RESOURCE_DOES_NOT_EXIST' });

    mountComponent({}, { run_request: { active: false, error: runFetchError } });

    await waitFor(() => {
      expect(screen.getByText(/Run ID test-run-uuid does not exist/)).toBeInTheDocument();
    });
  });
});

describe('RunPage (GraphQL API)', () => {
  const server = setupServer();

  beforeEach(() => {
    jest.mocked(shouldEnableGraphQLRunDetailsPage).mockImplementation(() => true);
  });

  beforeEach(() => {
    server.use(
      graphql.query<GetRun, GetRunVariables>('GetRun', (req, res, ctx) => {
        if (req.variables.data.runId === 'invalid-run-uuid') {
          return res(
            ctx.data({
              mlflowGetRun: {
                __typename: 'MlflowGetRunResponse',
                apiError: {
                  __typename: 'ApiError',
                  helpUrl: null,
                  code: 'RESOURCE_DOES_NOT_EXIST',
                  message: 'Run not found',
                },
                run: null,
              },
            }),
          );
        }
        const metric = {
          __typename: 'MlflowMetricExtension' as const,
          key: 'test-metric',
          value: 100,
          step: '1',
          timestamp: '1000',
        };
        return res(
          ctx.data({
            mlflowGetRun: {
              __typename: 'MlflowGetRunResponse',
              apiError: null,
              run: {
                // Use 'any' type to satisfy multiple query implementations
                __typename: 'MlflowRun' as any,
                data: {
                  __typename: 'MlflowRunData',
                  metrics: [metric],
                  params: [{ __typename: 'MlflowParam', key: 'test-param', value: 'test-param-value' }],
                  tags: [
                    { __typename: 'MlflowRunTag', key: 'test-tag-a', value: 'test-tag-a-value' },
                    { __typename: 'MlflowRunTag', key: 'test-tag-b', value: 'test-tag-b-value' },
                  ],
                },
                experiment: {
                  __typename: 'MlflowExperiment',
                  artifactLocation: null,
                  experimentId: 'test-experiment',
                  lastUpdateTime: null,
                  lifecycleStage: null,
                  name: 'test experiment',
                  tags: [],
                },
                info: {
                  __typename: 'MlflowRunInfo',
                  artifactUri: null,
                  experimentId: 'test-experiment',
                  lifecycleStage: null,
                  runName: 'test run',
                  runUuid: 'test-run-uuid',
                  status: MlflowRunStatus.FINISHED,
                  userId: null,
                  startTime: '1672578000000',
                  endTime: '1672578300000',
                },
                inputs: {
                  __typename: 'MlflowRunInputs',
                  modelInputs: null,
                  datasetInputs: [
                    {
                      __typename: 'MlflowDatasetInput',
                      dataset: {
                        __typename: 'MlflowDataset',
                        digest: 'digest',
                        name: 'dataset-name',
                        profile: 'profile',
                        schema: 'schema',
                        source: 'source',
                        sourceType: 'sourceType',
                      },
                      tags: [{ __typename: 'MlflowInputTag', key: 'tag1', value: 'value1' }],
                    },
                  ],
                },
                outputs: {
                  __typename: 'MlflowRunOutputs',
                  modelOutputs: [{ __typename: 'MlflowModelOutput', modelId: 'test-model-id', step: '1' }],
                },
                modelVersions: [],
              },
            },
          }),
        );
      }),
    );
  });

  const mountComponent = (runUuid = testRunUuid) => {
    const queryClient = new QueryClient();

    const renderResult = renderWithIntl(
      <TestApolloProvider disableCache>
        <QueryClientProvider client={queryClient}>
          <MockedReduxStoreProvider
            state={{ entities: { modelVersionsByRunUuid: {}, tagsByRunUuid: {}, modelByName: {} } }}
          >
            <DesignSystemProvider>
              <TestRouter
                initialEntries={[`/experiment/${testExperimentId}/run/${runUuid}`]}
                routes={[testRoute(<RunPage />, '/experiment/:experimentId/run/:runUuid')]}
              />
            </DesignSystemProvider>
          </MockedReduxStoreProvider>
        </QueryClientProvider>
      </TestApolloProvider>,
    );

    return renderResult;
  };

  test('Properly fetch and display basic data', async () => {
    mountComponent();

    await waitFor(() => {
      expect(screen.getByText('test run')).toBeInTheDocument();
    });

    // Tags:
    expect(screen.getByText('test-tag-a')).toBeInTheDocument();
    expect(screen.getByText('test-tag-b')).toBeInTheDocument();

    // Params table:
    expect(screen.getByText('test-param')).toBeInTheDocument();
    expect(screen.getByText('test-param-value')).toBeInTheDocument();

    // Metrics table:
    expect(screen.getByRole('link', { name: 'test-metric' })).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    // Dataset:
    expect(screen.getByText('dataset-name (digest)')).toBeInTheDocument();

    // Find metadata rows and verify their values
    const durationRow = screen.getByTestId('key-value-Duration');
    expect(durationRow.lastElementChild).toHaveTextContent('5.0min');

    const experimentIdRow = screen.getByTestId('key-value-Experiment ID');
    expect(experimentIdRow.lastElementChild).toHaveTextContent('test-experiment');

    const statusRow = screen.getByTestId('key-value-Status');
    expect(statusRow.lastElementChild).toHaveTextContent('Finished');
  });

  test('Properly display duration for ongoing run', async () => {
    // Mock run response with ongoing run and endTime set to 0
    server.resetHandlers(
      graphql.query<GetRun, GetRunVariables>('GetRun', (req, res, ctx) => {
        return res(
          ctx.data({
            mlflowGetRun: {
              __typename: 'MlflowGetRunResponse',
              apiError: null,
              run: {
                __typename: 'MlflowRun' as any,
                data: null,
                experiment: {
                  __typename: 'MlflowExperiment',
                  artifactLocation: null,
                  experimentId: 'test-experiment',
                  lastUpdateTime: null,
                  lifecycleStage: null,
                  name: 'test experiment',
                  tags: [],
                },
                info: {
                  __typename: 'MlflowRunInfo',
                  artifactUri: null,
                  experimentId: 'test-experiment',
                  lifecycleStage: null,
                  runName: 'test run',
                  runUuid: 'test-run-uuid',
                  status: MlflowRunStatus.RUNNING,
                  userId: null,
                  startTime: '1672578000000',
                  endTime: '0',
                },
                inputs: null,
                outputs: null,
                modelVersions: [],
              },
            },
          }),
        );
      }),
    );

    mountComponent();

    await waitFor(() => {
      expect(screen.getByText('test run')).toBeInTheDocument();
    });

    // For ongoing runs, duration row should be present but empty
    const durationRow = screen.getByTestId('key-value-Duration');
    expect(durationRow.lastElementChild).toBeEmptyDOMElement();

    // Status row should show the running status
    const statusRow = screen.getByTestId('key-value-Status');
    expect(statusRow.lastElementChild).toHaveTextContent('Running');
  });

  test('Display 404 page in case of missing run', async () => {
    mountComponent('invalid-run-uuid');

    await waitFor(() => {
      expect(screen.getByText(/Run ID invalid-run-uuid does not exist/)).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunPage.tsx
Signals: React, Redux/RTK

```typescript
import {
  DangerIcon,
  Empty,
  LegacySkeleton,
  ParagraphSkeleton,
  TitleSkeleton,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useSelector } from 'react-redux';
import invariant from 'invariant';
import React, { useMemo, useState } from 'react';

import { PageContainer } from '../../../common/components/PageContainer';
import { useNavigate, useParams } from '../../../common/utils/RoutingUtils';
import Utils from '../../../common/utils/Utils';
import { RunPageTabName } from '../../constants';
import { RenameRunModal } from '../modals/RenameRunModal';
import { RunViewArtifactTab } from './RunViewArtifactTab';
import { RunViewHeader } from './RunViewHeader';
import { RunViewOverview } from './RunViewOverview';
import { useRunDetailsPageData } from './hooks/useRunDetailsPageData';
import { useRunViewActiveTab } from './useRunViewActiveTab';
import type { ReduxState } from '../../../redux-types';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import { RunNotFoundView } from '../RunNotFoundView';
import { ErrorCodes } from '../../../common/constants';
import NotFoundPage from '../NotFoundPage';
import { RunViewEvaluationsTab } from '../evaluations/RunViewEvaluationsTab';
import { FormattedMessage } from 'react-intl';
import { isSystemMetricKey } from '../../utils/MetricsUtils';
import DeleteRunModal from '../modals/DeleteRunModal';
import Routes from '../../routes';
import { RunViewMetricCharts } from './RunViewMetricCharts';
import {
  shouldEnableGraphQLRunDetailsPage,
  shouldUseGetLoggedModelsBatchAPI,
} from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import { useMediaQuery } from '@databricks/web-shared/hooks';
import { getGraphQLErrorMessage } from '../../../graphql/get-graphql-error';
import { useLoggedModelsForExperimentRun } from '../experiment-page/hooks/useLoggedModelsForExperimentRun';
import { useLoggedModelsForExperimentRunV2 } from '../experiment-page/hooks/useLoggedModelsForExperimentRunV2';
import { getExperimentKindFromTags } from '../../utils/ExperimentKindUtils';

const RunPageLoadingState = () => (
  <PageContainer>
    <TitleSkeleton
      loading
      label={<FormattedMessage defaultMessage="Run page loading" description="Run page > Loading state" />}
    />
    {[...Array(3).keys()].map((i) => (
      <ParagraphSkeleton key={i} seed={`s-${i}`} />
    ))}
  </PageContainer>
);

export const RunPage = () => {
  const { runUuid, experimentId } = useParams<{
    runUuid: string;
    experimentId: string;
  }>();
  const navigate = useNavigate();
  const { theme } = useDesignSystemTheme();
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  invariant(runUuid, '[RunPage] Run UUID route param not provided');
  invariant(experimentId, '[RunPage] Experiment ID route param not provided');

  // After invariant checks, we can safely cast these as non-null
  const safeRunUuid = runUuid as string;
  const safeExperimentId = experimentId as string;

  const {
    experiment,
    error,
    latestMetrics,
    loading,
    params,
    refetchRun,
    runInfo,
    tags,
    experimentFetchError,
    runFetchError,
    apiError,
    datasets,
    runInputs,
    runOutputs,
    registeredModelVersionSummaries,
  } = useRunDetailsPageData({
    experimentId: safeExperimentId,
    runUuid: safeRunUuid,
  });

  const hasRunData = Boolean(runInfo);

  const [modelMetricKeys, systemMetricKeys] = useMemo<[string[], string[]]>(() => {
    if (!latestMetrics) {
      return [[], []];
    }

    return [
      Object.keys(latestMetrics).filter((metricKey) => !isSystemMetricKey(metricKey)),
      Object.keys(latestMetrics).filter((metricKey) => isSystemMetricKey(metricKey)),
    ];
  }, [latestMetrics]);

  const { comparedExperimentIds = [], hasComparedExperimentsBefore = false } = useSelector(
    (state: ReduxState) => state.comparedExperiments || {},
  );

  const activeTab = useRunViewActiveTab();

  const isUsingGetLoggedModelsApi = shouldUseGetLoggedModelsBatchAPI();

  const loggedModelsForRun = useLoggedModelsForExperimentRun(
    safeExperimentId,
    safeRunUuid,
    runInputs,
    runOutputs,
    !isUsingGetLoggedModelsApi,
  );
  const loggedModelsForRunV2 = useLoggedModelsForExperimentRunV2({
    runInputs,
    runOutputs,
    enabled: isUsingGetLoggedModelsApi,
  });

  const {
    error: loggedModelsError,
    isLoading: isLoadingLoggedModels,
    models: loggedModelsV3,
  } = isUsingGetLoggedModelsApi ? loggedModelsForRunV2 : loggedModelsForRun;

  const renderActiveTab = () => {
    if (!runInfo) {
      return null;
    }
    const renderEvaluationTab = () => (
      <RunViewEvaluationsTab
        runUuid={safeRunUuid}
        runTags={tags}
        experiment={experiment}
        experimentId={safeExperimentId}
        runDisplayName={Utils.getRunDisplayName(runInfo, safeRunUuid)}
      />
    );
    switch (activeTab) {
      case RunPageTabName.MODEL_METRIC_CHARTS:
        return (
          <RunViewMetricCharts
            key="model"
            mode="model"
            metricKeys={modelMetricKeys}
            runInfo={runInfo}
            latestMetrics={latestMetrics}
            tags={tags}
            params={params}
          />
        );

      case RunPageTabName.SYSTEM_METRIC_CHARTS:
        return (
          <RunViewMetricCharts
            key="system"
            mode="system"
            metricKeys={systemMetricKeys}
            runInfo={runInfo}
            latestMetrics={latestMetrics}
            tags={tags}
            params={params}
          />
        );
      case RunPageTabName.EVALUATIONS:
        return renderEvaluationTab();
      case RunPageTabName.ARTIFACTS:
        return (
          <RunViewArtifactTab
            runUuid={safeRunUuid}
            runTags={tags}
            runOutputs={runOutputs}
            experimentId={safeExperimentId}
            artifactUri={runInfo.artifactUri ?? undefined}
          />
        );
      case RunPageTabName.TRACES:
        return renderEvaluationTab();
    }

    return (
      <RunViewOverview
        runInfo={runInfo}
        tags={tags}
        params={params}
        latestMetrics={latestMetrics}
        runUuid={safeRunUuid}
        onRunDataUpdated={refetchRun}
        runInputs={runInputs}
        runOutputs={runOutputs}
        datasets={datasets}
        registeredModelVersionSummaries={registeredModelVersionSummaries}
        loggedModelsV3={loggedModelsV3}
        isLoadingLoggedModels={isLoadingLoggedModels}
        loggedModelsError={loggedModelsError ?? undefined}
        experimentKind={getExperimentKindFromTags(experiment?.tags)}
      />
    );
  };

  // Use full height page with scrollable tab area only for non-xs screens
  const useFullHeightPage = useMediaQuery(`(min-width: ${theme.responsive.breakpoints.sm}px)`);

  const initialLoading = loading && (!runInfo || !experiment);

  // Handle "run not found" error
  if (
    // For REST API:
    (runFetchError instanceof ErrorWrapper && runFetchError.getErrorCode() === ErrorCodes.RESOURCE_DOES_NOT_EXIST) ||
    // For GraphQL:
    apiError?.code === ErrorCodes.RESOURCE_DOES_NOT_EXIST ||
    (error && getGraphQLErrorMessage(error).match(/not found$/))
  ) {
    return <RunNotFoundView runId={safeRunUuid} />;
  }

  // Handle experiment not found error
  if (
    experimentFetchError instanceof ErrorWrapper &&
    experimentFetchError.getErrorCode() === ErrorCodes.RESOURCE_DOES_NOT_EXIST
  ) {
    return <NotFoundPage />;
  }

  // Catch-all for legacy REST API errors
  if (runFetchError || experimentFetchError) {
    return null;
  }

  // Catch-all for GraphQL errors
  if (
    shouldEnableGraphQLRunDetailsPage() &&
    (error || apiError) &&
    // We display the error only if we have no run data, as it's possible
    // to get partial results due to failure in a nested resolver
    !hasRunData
  ) {
    return (
      <div css={{ marginTop: theme.spacing.lg }}>
        <Empty
          title={
            <FormattedMessage
              defaultMessage="Can't load run details"
              description="Run page > error loading page title"
            />
          }
          description={getGraphQLErrorMessage(apiError ?? error)}
          image={<DangerIcon />}
        />
      </div>
    );
  }

  // Display spinner/skeleton for the initial data load
  if (initialLoading || !runInfo || !experiment) {
    return <RunPageLoadingState />;
  }

  return (
    <>
      <PageContainer usesFullHeight={useFullHeightPage}>
        {/* Header fixed on top */}
        <RunViewHeader
          comparedExperimentIds={comparedExperimentIds}
          experiment={experiment}
          handleRenameRunClick={() => setRenameModalVisible(true)}
          handleDeleteRunClick={() => setDeleteModalVisible(true)}
          hasComparedExperimentsBefore={hasComparedExperimentsBefore}
          runDisplayName={Utils.getRunDisplayName(runInfo, safeRunUuid)}
          runTags={tags}
          runParams={params}
          runUuid={safeRunUuid}
          runOutputs={runOutputs}
          artifactRootUri={runInfo?.artifactUri ?? undefined}
          registeredModelVersionSummaries={registeredModelVersionSummaries}
          isLoading={loading || isLoadingLoggedModels}
        />
        {/* Scroll tab contents independently within own container */}
        <div css={{ flex: 1, overflow: 'auto', marginBottom: theme.spacing.sm, display: 'flex' }}>
          {renderActiveTab()}
        </div>
      </PageContainer>
      <RenameRunModal
        runUuid={safeRunUuid}
        onClose={() => setRenameModalVisible(false)}
        runName={runInfo.runName ?? ''}
        isOpen={renameModalVisible}
        onSuccess={refetchRun}
      />
      <DeleteRunModal
        selectedRunIds={[safeRunUuid]}
        onClose={() => setDeleteModalVisible(false)}
        isOpen={deleteModalVisible}
        onSuccess={() => {
          navigate(Routes.getExperimentPageRoute(safeExperimentId));
        }}
      />
    </>
  );
};

export default RunPage;
```

--------------------------------------------------------------------------------

---[FILE: RunViewArtifactTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewArtifactTab.tsx
Signals: React

```typescript
import { LegacySkeleton, useDesignSystemTheme } from '@databricks/design-system';
import type { KeyValueEntity } from '../../../common/types';
import ArtifactPage from '../ArtifactPage';
import { useMediaQuery } from '@databricks/web-shared/hooks';
import { useGetRunQuery, type UseGetRunQueryResponseOutputs } from './hooks/useGetRunQuery';
import { useMemo } from 'react';
import { keyBy } from 'lodash';

/**
 * A run page tab containing the artifact browser
 */
export const RunViewArtifactTab = ({
  runTags: tagsFromSearchRuns,
  experimentId,
  runOutputs,
  artifactUri,
  runUuid,
}: {
  runUuid: string;
  experimentId: string;
  artifactUri?: string;
  runOutputs?: UseGetRunQueryResponseOutputs;
  runTags: Record<string, KeyValueEntity>;
}) => {
  const { theme } = useDesignSystemTheme();

  // Use scrollable artifact area only for non-xs screens
  const useFullHeightPage = useMediaQuery(`(min-width: ${theme.responsive.breakpoints.sm}px)`);

  const runTags = tagsFromSearchRuns;
  const runTagsList = useMemo(() => Object.values(runTags), [runTags]);

  return (
    <div
      css={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        paddingBottom: theme.spacing.md,
        position: 'relative',
      }}
    >
      <ArtifactPage
        runUuid={runUuid}
        runTags={runTags}
        runOutputs={runOutputs}
        useAutoHeight={useFullHeightPage}
        artifactRootUri={artifactUri}
        experimentId={experimentId}
        entityTags={runTagsList}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewChartTooltipBody.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewChartTooltipBody.tsx

```typescript
import type { MetricHistoryByName, RunInfoEntity } from '../../types';
import {
  containsMultipleRunsTooltipData,
  RunsChartsTooltipMode,
  type RunsChartsTooltipBodyProps,
} from '../runs-charts/hooks/useRunsChartsTooltip';
import { isSystemMetricKey } from '../../utils/MetricsUtils';
import Utils from '../../../common/utils/Utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { isUndefined } from 'lodash';
import type {
  RunsCompareMultipleTracesTooltipData,
  RunsMetricsSingleTraceTooltipData,
} from '../runs-charts/components/RunsMetricsLinePlot';
import type { RunsMetricsBarPlotHoverData } from '../runs-charts/components/RunsMetricsBarPlot';
import { RunsMultipleTracesTooltipBody } from '../runs-charts/components/RunsMultipleTracesTooltipBody';
import { Spacer, Typography } from '@databricks/design-system';

/**
 * Tooltip body displayed when hovering over run view metric charts
 */
export const RunViewChartTooltipBody = ({
  contextData: { metricsForRun },
  hoverData,
  chartData: { metricKey },
  isHovering,
  mode,
}: RunsChartsTooltipBodyProps<
  { metricsForRun: MetricHistoryByName },
  { metricKey: string },
  RunsMetricsBarPlotHoverData | RunsMetricsSingleTraceTooltipData | RunsCompareMultipleTracesTooltipData
>) => {
  const singleTraceHoverData = containsMultipleRunsTooltipData(hoverData) ? hoverData.hoveredDataPoint : hoverData;
  const intl = useIntl();

  if (
    mode === RunsChartsTooltipMode.MultipleTracesWithScanline &&
    containsMultipleRunsTooltipData(hoverData) &&
    isHovering
  ) {
    return <RunsMultipleTracesTooltipBody hoverData={hoverData} />;
  }

  if (!singleTraceHoverData?.metricEntity) {
    return null;
  }

  const { timestamp, step, value } = singleTraceHoverData.metricEntity;

  const metricContainsHistory = metricsForRun?.[metricKey]?.length > 1;
  const isSystemMetric = isSystemMetricKey(metricKey);
  const displayTimestamp = metricContainsHistory && isSystemMetric && !isUndefined(timestamp);
  const displayStep = metricContainsHistory && !isSystemMetric && !isUndefined(step);

  return (
    <div>
      {displayStep && (
        <div css={styles.valueField}>
          <strong>
            <FormattedMessage defaultMessage="Step" description="Run page > Charts tab > Chart tooltip > Step label" />:
          </strong>{' '}
          {step}
        </div>
      )}
      {displayTimestamp && (
        <div css={styles.valueField}>
          <strong>
            <FormattedMessage
              defaultMessage="Timestamp"
              description="Run page > Charts tab > Chart tooltip > Timestamp label"
            />
            :
          </strong>{' '}
          {Utils.formatTimestamp(timestamp, intl)}
        </div>
      )}
      {value && (
        <div>
          <Typography.Text bold>{metricKey}</Typography.Text>
          <Spacer size="xs" />
          <Typography.Text>{value}</Typography.Text>
        </div>
      )}
    </div>
  );
};

const styles = {
  valueField: {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewHeader.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewHeader.intg.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { DesignSystemProvider } from '@databricks/design-system';
import { RunViewHeader } from './RunViewHeader';
import { ExperimentKind, ExperimentPageTabName } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { EXPERIMENT_KIND_TAG_KEY } from '../../utils/ExperimentKindUtils';
import { TestRouter, testRoute, waitForRoutesToBeRendered } from '@mlflow/mlflow/src/common/utils/RoutingTestUtils';
import Routes from '../../routes';

jest.mock('../../../common/utils/FeatureUtils', () => ({
  shouldEnableExperimentPageHeaderV2: () => true,
  shouldUseRenamedUnifiedTracesTab: () => false,
  shouldDisableReproduceRunButton: () => false,
}));

describe('RunViewHeader - integration test', () => {
  const testRunUuid = 'test-run-uuid';
  const testExperimentId = 'test-experiment-id';
  const testRunName = 'Test Run';

  const renderTestComponent = (props: any) => {
    const defaultProps = {
      runDisplayName: testRunName,
      runUuid: testRunUuid,
      runTags: {},
      runParams: {},
      experiment: {
        experimentId: testExperimentId,
        name: 'Test Experiment',
        tags: [],
      },
      handleRenameRunClick: jest.fn(),
      handleDeleteRunClick: jest.fn(),
      registeredModelVersionSummaries: [],
      ...props,
    };

    const TestComponent = () => {
      return (
        <TestRouter
          routes={[
            testRoute(
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
                  <RunViewHeader {...defaultProps} />
                </QueryClientProvider>
              </DesignSystemProvider>,
            ),
          ]}
        />
      );
    };

    return render(
      <IntlProvider locale="en">
        <TestComponent />
      </IntlProvider>,
    );
  };

  it('routes to evaluation-runs tab when experiment is GenAI and has no model outputs', async () => {
    const experimentWithGenAITag = {
      experimentId: testExperimentId,
      name: 'Test Experiment',
      tags: [{ key: EXPERIMENT_KIND_TAG_KEY, value: ExperimentKind.GENAI_DEVELOPMENT }],
    };

    const runOutputs = {
      modelOutputs: [],
    };

    renderTestComponent({
      experiment: experimentWithGenAITag,
      runOutputs,
    });

    await waitForRoutesToBeRendered();

    const experimentLink = screen.getByTestId('experiment-observatory-link-runs');
    expect(experimentLink.textContent).toBe('Evaluations');
    const expectedPath = Routes.getExperimentPageTabRoute(testExperimentId, ExperimentPageTabName.EvaluationRuns);
    expect(experimentLink.getAttribute('href')).toBe(expectedPath);
  });

  it('routes to runs tab when experiment is GenAI but has model outputs', async () => {
    const experimentWithGenAITag = {
      experimentId: testExperimentId,
      name: 'Test Experiment',
      tags: [{ key: EXPERIMENT_KIND_TAG_KEY, value: ExperimentKind.GENAI_DEVELOPMENT }],
    };

    const runOutputs = {
      modelOutputs: [{ someOutput: 'value' }],
    };

    renderTestComponent({
      experiment: experimentWithGenAITag,
      runOutputs,
    });

    await waitForRoutesToBeRendered();

    const experimentLink = screen.getByTestId('experiment-observatory-link-runs');
    expect(experimentLink.textContent).toBe('Runs');
    const expectedPath = Routes.getExperimentPageTabRoute(testExperimentId, ExperimentPageTabName.Runs);
    expect(experimentLink.getAttribute('href')).toBe(expectedPath);
  });

  it('routes to runs tab when experiment is not GenAI', async () => {
    const experimentWithoutGenAITag = {
      experimentId: testExperimentId,
      name: 'Test Experiment',
      tags: [],
    };

    renderTestComponent({
      experiment: experimentWithoutGenAITag,
    });

    await waitForRoutesToBeRendered();

    const experimentLink = screen.getByTestId('experiment-observatory-link-runs');
    expect(experimentLink.textContent).toBe('Runs');
    const expectedPath = Routes.getExperimentPageTabRoute(testExperimentId, ExperimentPageTabName.Runs);
    expect(experimentLink.getAttribute('href')).toBe(expectedPath);
  });
});
```

--------------------------------------------------------------------------------

````

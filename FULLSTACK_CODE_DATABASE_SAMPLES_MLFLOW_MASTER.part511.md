---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 511
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 511 of 991)

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

---[FILE: useSearchRunsQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useSearchRunsQuery.tsx

```typescript
import { type ApolloError, type ApolloQueryResult, gql } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { first } from 'lodash';
import type { SearchRuns } from '../../../../graphql/__generated__/graphql';

const SEARCH_RUNS_QUERY = gql`
  query SearchRuns($data: MlflowSearchRunsInput!) {
    mlflowSearchRuns(input: $data) {
      apiError {
        helpUrl
        code
        message
      }
      runs {
        info {
          runName
          status
          runUuid
          experimentId
          artifactUri
          endTime
          lifecycleStage
          startTime
          userId
        }
        experiment {
          experimentId
          name
          tags {
            key
            value
          }
          artifactLocation
          lifecycleStage
          lastUpdateTime
        }
        data {
          metrics {
            key
            value
            step
            timestamp
          }
          params {
            key
            value
          }
          tags {
            key
            value
          }
        }
        inputs {
          datasetInputs {
            dataset {
              digest
              name
              profile
              schema
              source
              sourceType
            }
            tags {
              key
              value
            }
          }
          modelInputs {
            modelId
          }
        }
        outputs {
          modelOutputs {
            modelId
            step
          }
        }
        modelVersions {
          version
          name
          creationTimestamp
          status
          source
        }
      }
    }
  }
`;

export type UseSearchRunsQueryResponseDataMetrics = NonNullable<
  NonNullable<NonNullable<UseSearchRunsQueryDataResponseSingleRun>['data']>['metrics']
>;
export type UseSearchRunsQueryDataResponseSingleRun = NonNullable<
  NonNullable<SearchRuns['mlflowSearchRuns']>['runs']
>[0];
export type UseSearchRunsQueryDataApiError = NonNullable<SearchRuns['mlflowSearchRuns']>['apiError'];
export type UseSearchRunsQueryResponse = {
  data?: UseSearchRunsQueryDataResponseSingleRun;
  loading: boolean;
  apolloError?: ApolloError;
  apiError?: UseSearchRunsQueryDataApiError;
  refetchRun: () => Promise<ApolloQueryResult<SearchRuns>>;
};

export const useSearchRunsQuery = ({
  filter,
  experimentIds,
  disabled = false,
}: {
  filter?: string;
  experimentIds: string[];
  disabled?: boolean;
}): UseSearchRunsQueryResponse => {
  const {
    data,
    loading,
    error: apolloError,
    refetch,
  } = useQuery<any, any>(SEARCH_RUNS_QUERY, {
    variables: {
      data: {
        filter,
        experimentIds,
      },
    },
    skip: disabled,
  });

  return {
    loading,
    data: first(data?.mlflowSearchRuns?.runs ?? []),
    refetchRun: refetch,
    apolloError,
    apiError: data?.mlflowSearchRuns?.apiError,
  } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useSelectedArtifactBySearchParam.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useSelectedArtifactBySearchParam.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'selectedArtifact';

/**
 * Query param-powered hook that returns the selected artifact information.
 * Used to persist artifact selection in the URL for the artifacts tab.
 *
 * The selectedArtifact format is: "sourceId:artifactPath"
 * - sourceId: The ID of the source (run UUID or model ID)
 * - artifactPath: The path to the artifact within that source
 */
export const useSelectedArtifactBySearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedArtifact = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setSelectedArtifact = useCallback(
    (sourceId: string, artifactPath: string) => {
      setSearchParams(
        (params) => {
          if (!sourceId || !artifactPath) {
            params.delete(QUERY_PARAM_KEY);
            return params;
          }
          params.set(QUERY_PARAM_KEY, `${sourceId}:${artifactPath}`);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearSelectedArtifact = useCallback(() => {
    setSearchParams(
      (params) => {
        params.delete(QUERY_PARAM_KEY);
        return params;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const parsedSelectedArtifact = selectedArtifact?.includes(':')
    ? {
        sourceId: selectedArtifact.split(':')?.[0],
        artifactPath: selectedArtifact.split(':').slice(1).join(':'),
      }
    : undefined;

  return [parsedSelectedArtifact, setSelectedArtifact, clearSelectedArtifact] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useUnifiedRegisteredModelVersionsSummariesForRun.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useUnifiedRegisteredModelVersionsSummariesForRun.tsx
Signals: Redux/RTK

```typescript
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../../redux-types';
import { ModelRegistryRoutes } from '../../../../model-registry/routes';
import { shouldEnableGraphQLModelVersionsForRunDetails } from '../../../../common/utils/FeatureUtils';
import type { UseGetRunQueryResponse } from './useGetRunQuery';
import type { LoggedModelProto } from '../../../types';

/**
 * A unified model version summary that can be used to display model versions on the run page.
 */
export type RunPageModelVersionSummary = {
  displayedName: string | null;
  version: string | null;
  link: string;
  status: string | null;
  source: string | null;
  sourceLoggedModel?: LoggedModelProto;
};

/**
 * We're currently using multiple ways to get model versions on the run page,
 * we also differentiate between UC and workspace registry models.
 *
 * This hook is intended to unify the way we get model versions on the run page to be displayed in overview and register model dropdown.
 */
export const useUnifiedRegisteredModelVersionsSummariesForRun = ({
  queryResult,
  runUuid,
}: {
  runUuid: string;
  queryResult?: UseGetRunQueryResponse;
}): RunPageModelVersionSummary[] => {
  const { registeredModels: registeredModelsFromStore } = useSelector(({ entities }: ReduxState) => ({
    registeredModels: entities.modelVersionsByRunUuid[runUuid],
  }));

  if (shouldEnableGraphQLModelVersionsForRunDetails()) {
    const result: RunPageModelVersionSummary[] = [];
    if (queryResult?.data && 'modelVersions' in queryResult.data) {
      queryResult.data?.modelVersions?.forEach((modelVersion) => {
        result.push({
          displayedName: modelVersion.name,
          version: modelVersion.version,
          link:
            modelVersion.name && modelVersion.version
              ? ModelRegistryRoutes.getModelVersionPageRoute(modelVersion.name, modelVersion.version)
              : '',
          status: modelVersion.status,
          source: modelVersion.source,
        });
      });
    }
    return result;
  }

  if (registeredModelsFromStore) {
    return registeredModelsFromStore.map((modelVersion) => {
      const name = modelVersion.name;
      const link = ModelRegistryRoutes.getModelVersionPageRoute(name, modelVersion.version);
      return {
        displayedName: modelVersion.name,
        version: modelVersion.version,
        link,
        status: modelVersion.status,
        source: modelVersion.source,
      };
    });
  }

  return [];
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewChildRunsBox.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewChildRunsBox.test.tsx

```typescript
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { renderWithIntl, screen, waitFor } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { createMLflowRoutePath, MemoryRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { DesignSystemProvider } from '@databricks/design-system';
import { RunViewChildRunsBox } from './RunViewChildRunsBox';
import { MlflowService } from '../../../sdk/MlflowService';
import userEvent from '@testing-library/user-event';
import type { RunInfoEntity } from '../../../types';

jest.mock('../../../sdk/MlflowService', () => ({
  MlflowService: {
    searchRuns: jest.fn(),
  },
}));

const experimentId = 'exp-id';
const parentRunUuid = 'parent-run';

const createRunInfo = (runUuid: string, runName: string): RunInfoEntity => ({
  artifactUri: '',
  endTime: 0,
  experimentId,
  lifecycleStage: 'active',
  runUuid,
  runName,
  startTime: 0,
  status: 'FINISHED',
});

describe('RunViewChildRunsBox', () => {
  const renderComponent = () =>
    renderWithIntl(
      <MemoryRouter>
        <DesignSystemProvider>
          <RunViewChildRunsBox runUuid={parentRunUuid} experimentId={experimentId} />
        </DesignSystemProvider>
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.mocked(MlflowService.searchRuns).mockReset();
  });

  test('renders loading state and displays child runs', async () => {
    jest.mocked(MlflowService.searchRuns).mockResolvedValueOnce({
      runs: [{ info: createRunInfo('child-1', 'Child run 1'), data: { metrics: [], params: [], tags: [] } }],
      next_page_token: undefined,
    });

    renderComponent();

    expect(screen.getByText('Child runs loading')).toBeInTheDocument();

    // Check for the label
    expect(await screen.findByText('Child runs')).toBeInTheDocument();

    const link = await screen.findByRole('link', { name: 'Child run 1' });
    expect(link).toHaveAttribute('href', createMLflowRoutePath(`/experiments/${experimentId}/runs/child-1`));
    expect(screen.queryByText('Child runs loading')).not.toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    jest.mocked(MlflowService.searchRuns).mockRejectedValueOnce(new Error('boom'));

    renderComponent();

    expect(await screen.findByText('Failed to load child runs')).toBeInTheDocument();
    expect(screen.getByText('Child runs')).toBeInTheDocument();
  });

  test('renders nothing when no child runs are returned', async () => {
    jest.mocked(MlflowService.searchRuns).mockResolvedValueOnce({ runs: [], next_page_token: undefined });

    renderComponent();

    expect(screen.getByText('Child runs loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Child runs loading')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Child runs')).not.toBeInTheDocument();
  });

  test('loads more runs when clicking the Load more button', async () => {
    jest
      .mocked(MlflowService.searchRuns)
      .mockResolvedValueOnce({
        runs: [{ info: createRunInfo('child-1', 'Child run 1'), data: { metrics: [], params: [], tags: [] } }],
        next_page_token: 'next-token',
      })
      .mockResolvedValueOnce({
        runs: [{ info: createRunInfo('child-2', 'Child run 2'), data: { metrics: [], params: [], tags: [] } }],
        next_page_token: undefined,
      });

    renderComponent();

    expect(await screen.findByText('Child runs')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Child run 1' })).toBeInTheDocument();

    const loadMore = screen.getByRole('button', { name: 'Load more' });
    await userEvent.click(loadMore);

    expect(await screen.findByRole('link', { name: 'Child run 2' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
    expect(jest.mocked(MlflowService.searchRuns)).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ page_token: 'next-token' }),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewChildRunsBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewChildRunsBox.tsx
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react';
import { Button, ParagraphSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { KeyValueProperty } from '@databricks/web-shared/utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { MlflowService } from '../../../sdk/MlflowService';
import type { RunInfoEntity } from '../../../types';
import { EXPERIMENT_PARENT_ID_TAG } from '../../experiment-page/utils/experimentPage.common-utils';

const PAGE_SIZE = 10;

export const RunViewChildRunsBox = ({ runUuid, experimentId }: { runUuid: string; experimentId: string }) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const [childRuns, setChildRuns] = useState<RunInfoEntity[] | undefined>();
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // TODO: refactor to use `react-query`
  const loadChildRuns = useCallback(
    async (pageToken?: string) => {
      setIsLoading(true);
      try {
        const res = await MlflowService.searchRuns({
          experiment_ids: [experimentId],
          filter: `tags.\`${EXPERIMENT_PARENT_ID_TAG}\` = '${runUuid}'`,
          order_by: ['attributes.start_time DESC'],
          max_results: PAGE_SIZE,
          page_token: pageToken,
        });
        const infos = res.runs?.map((r: any) => r.info) || [];
        setChildRuns((prev = []) => [...prev, ...infos]);
        setNextPageToken(res.next_page_token);
        setHasError(false);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [experimentId, runUuid],
  );

  useEffect(() => {
    setChildRuns(undefined);
    setNextPageToken(undefined);
    loadChildRuns();
  }, [loadChildRuns]);

  if (childRuns !== undefined && childRuns.length === 0) {
    return null;
  }

  const renderValue = () => {
    if (hasError) {
      return (
        <Typography.Text color="error">
          <FormattedMessage
            defaultMessage="Failed to load child runs"
            description="Run page > Overview > Child runs error"
          />
        </Typography.Text>
      );
    }

    if (childRuns === undefined) {
      return (
        <ParagraphSkeleton
          loading
          label={
            <FormattedMessage
              defaultMessage="Child runs loading"
              description="Run page > Overview > Child runs loading"
            />
          }
        />
      );
    }

    return (
      <div>
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.sm,
            padding: `${theme.spacing.sm}px 0`,
          }}
        >
          {childRuns.map((info, index) => (
            <Typography.Text key={info.runUuid} css={{ whiteSpace: 'nowrap' }}>
              <Link to={Routes.getRunPageRoute(info.experimentId, info.runUuid)}>{info.runName}</Link>
              {index < childRuns.length - 1 && ','}
            </Typography.Text>
          ))}
        </div>
        {nextPageToken && (
          <div css={{ marginBottom: theme.spacing.sm }}>
            <Button
              componentId="mlflow.run_details.overview.child_runs.load_more_button"
              size="small"
              onClick={() => loadChildRuns(nextPageToken)}
              loading={isLoading}
            >
              <FormattedMessage defaultMessage="Load more" description="Run page > Overview > Child runs load more" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <KeyValueProperty
      keyValue={intl.formatMessage({
        defaultMessage: 'Child runs',
        description: 'Run page > Overview > Child runs',
      })}
      value={renderValue()}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewDatasetBox.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewDatasetBox.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import type { DeepPartial } from 'redux';
import { renderWithIntl, act, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { RunDatasetWithTags, RunInfoEntity } from '../../../types';
import { RunViewDatasetBox } from './RunViewDatasetBox';
import userEvent from '@testing-library/user-event';
import { openDropdownMenu } from '@databricks/design-system/test-utils/rtl';
import { ExperimentViewDatasetDrawer } from '../../experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { DesignSystemProvider } from '@databricks/design-system';
jest.mock('../../experiment-page/components/runs/ExperimentViewDatasetDrawer', () => ({
  ExperimentViewDatasetDrawer: jest.fn(() => <div />),
}));

const testRunUuid = 'test-run-uuid';
const testRunName = 'Test run name';
const testExperimentId = '12345';

const testRunInfo = {
  experimentId: testExperimentId,
  lifecycleStage: 'active',
  runName: testRunName,
  runUuid: testRunUuid,
} as RunInfoEntity;

const testTags = { testTag: { key: 'testTag', value: 'xyz' } } as any;

describe('RunViewDatasetBox', () => {
  const renderComponent = (datasets: DeepPartial<RunDatasetWithTags>[] = []) => {
    return renderWithIntl(
      <DesignSystemProvider>
        <RunViewDatasetBox runInfo={testRunInfo} datasets={datasets as any} tags={testTags} />
      </DesignSystemProvider>,
    );
  };

  test('Render single dataset', async () => {
    const testDatasetWithTags = {
      tags: [{ key: 'mlflow.data.context', value: 'train' }],
      dataset: {
        digest: '12345',
        name: 'dataset_train',
      },
    };
    renderComponent([testDatasetWithTags]);

    const linkElement = screen.getByRole('link', { name: /dataset_train \(12345\)/ });

    expect(linkElement).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    await userEvent.click(linkElement);

    expect(ExperimentViewDatasetDrawer).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        selectedDatasetWithRun: expect.objectContaining({
          datasetWithTags: testDatasetWithTags,
        }),
      }),
      // @ts-expect-error Expected 1 arguments, but got 2
      {},
    );
  });

  test('Render multiple datasets', async () => {
    const datasets = [
      {
        tags: [{ key: 'mlflow.data.context', value: 'train' }],
        dataset: {
          digest: '12345',
          name: 'dataset_train',
        },
      },
      {
        tags: [{ key: 'mlflow.data.context', value: 'eval' }],
        dataset: {
          digest: '54321',
          name: 'dataset_eval',
        },
      },
    ];
    const [, evalDataset] = datasets;
    renderComponent(datasets);

    const expandButton = screen.getByRole('button', { name: '+1' });
    expect(expandButton).toBeInTheDocument();

    await act(async () => {
      await openDropdownMenu(expandButton);
    });

    const linkElement = screen.getByRole('link', { name: /dataset_eval \(54321\)/ });

    await userEvent.click(linkElement);

    expect(ExperimentViewDatasetDrawer).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        selectedDatasetWithRun: expect.objectContaining({
          datasetWithTags: evalDataset,
        }),
      }),
      // @ts-expect-error Expected 1 arguments, but got 2
      {},
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewDatasetBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewDatasetBox.tsx
Signals: React

```typescript
import type { RunDatasetWithTags, RunInfoEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import { Button, DropdownMenu, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentViewDatasetWithContext } from '../../experiment-page/components/runs/ExperimentViewDatasetWithContext';
import { useState } from 'react';
import type { DatasetWithRunType } from '../../experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { ExperimentViewDatasetDrawer } from '../../experiment-page/components/runs/ExperimentViewDatasetDrawer';
import type { UseGetRunQueryResponseRunInfo } from '../hooks/useGetRunQuery';

/**
 * Renders single dataset, either in overview table cell or within a dropdown
 */
const DatasetEntry = ({ dataset, onClick }: { dataset: RunDatasetWithTags; onClick: () => void }) => {
  return (
    <Typography.Link
      componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewdatasetbox.tsx_16"
      role="link"
      css={{
        textAlign: 'left',
      }}
      onClick={onClick}
    >
      <ExperimentViewDatasetWithContext datasetWithTags={dataset} displayTextAsLink css={{ margin: 0 }} />
    </Typography.Link>
  );
};

/**
 * Displays run datasets section in run detail overview.
 */
export const RunViewDatasetBox = ({
  tags,
  runInfo,
  datasets,
}: {
  tags: Record<string, KeyValueEntity>;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  datasets: RunDatasetWithTags[];
}) => {
  const [selectedDatasetWithRun, setSelectedDatasetWithRun] = useState<DatasetWithRunType | null>(null);
  const { theme } = useDesignSystemTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!datasets || !datasets.length) {
    return null;
  }

  const firstDataset = datasets[0];
  const remainingDatasets = datasets.slice(1);

  const datasetClicked = (dataset: RunDatasetWithTags) => {
    setSelectedDatasetWithRun({
      datasetWithTags: dataset,
      runData: {
        experimentId: runInfo.experimentId ?? undefined,
        runUuid: runInfo.runUuid ?? '',
        runName: runInfo.runName ?? undefined,
        datasets: datasets,
        tags: tags,
      },
    });
    setIsDrawerOpen(true);
  };

  return (
    <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
      <DatasetEntry dataset={firstDataset} onClick={() => datasetClicked(firstDataset)} />
      {remainingDatasets.length ? (
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewdatasetbox.tsx_70"
              size="small"
            >
              +{remainingDatasets.length}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {remainingDatasets.map((datasetWithTags) => {
              return (
                <DropdownMenu.Item
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewdatasetbox.tsx_81"
                  key={datasetWithTags.dataset.digest}
                >
                  <DatasetEntry dataset={datasetWithTags} onClick={() => datasetClicked(datasetWithTags)} />
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : null}
      {selectedDatasetWithRun && (
        <ExperimentViewDatasetDrawer
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          selectedDatasetWithRun={selectedDatasetWithRun}
          setSelectedDatasetWithRun={setSelectedDatasetWithRun}
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewDatasetBoxV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewDatasetBoxV2.tsx
Signals: React

```typescript
import { Overflow, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useState } from 'react';
import type { RunDatasetWithTags, RunInfoEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import type { DatasetWithRunType } from '../../experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { ExperimentViewDatasetDrawer } from '../../experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { ExperimentViewDatasetWithContext } from '../../experiment-page/components/runs/ExperimentViewDatasetWithContext';
import type { UseGetRunQueryResponseRunInfo } from '../hooks/useGetRunQuery';

/**
 * Displays run datasets section in run detail overview.
 */
export const RunViewDatasetBoxV2 = ({
  tags,
  runInfo,
  datasets,
}: {
  tags: Record<string, KeyValueEntity>;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  datasets: RunDatasetWithTags[];
}) => {
  const [selectedDatasetWithRun, setSelectedDatasetWithRun] = useState<DatasetWithRunType | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme } = useDesignSystemTheme();

  if (!datasets || !datasets.length) {
    return null;
  }

  const datasetClicked = (dataset: RunDatasetWithTags) => {
    setSelectedDatasetWithRun({
      datasetWithTags: dataset,
      runData: {
        experimentId: runInfo.experimentId ?? undefined,
        runUuid: runInfo.runUuid ?? '',
        runName: runInfo.runName ?? undefined,
        datasets: datasets,
        tags: tags,
      },
    });
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Overflow>
        {datasets.map((datasetWithTags) => (
          // eslint-disable-next-line react/jsx-key
          <Typography.Link
            componentId="mlflow.run_details.datasets_box.dataset_link"
            css={{
              textAlign: 'left',
              '.anticon': {
                fontSize: theme.general.iconFontSize,
              },
            }}
            onClick={() => datasetClicked(datasetWithTags)}
          >
            <ExperimentViewDatasetWithContext datasetWithTags={datasetWithTags} displayTextAsLink css={{ margin: 0 }} />
          </Typography.Link>
        ))}
      </Overflow>
      {selectedDatasetWithRun && (
        <ExperimentViewDatasetDrawer
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          selectedDatasetWithRun={selectedDatasetWithRun}
          setSelectedDatasetWithRun={setSelectedDatasetWithRun}
        />
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewDescriptionBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewDescriptionBox.tsx
Signals: React, Redux/RTK

```typescript
import { useState } from 'react';
import { EditableNote } from '../../../../common/components/EditableNote';
import type { KeyValueEntity } from '../../../../common/types';
import { NOTE_CONTENT_TAG } from '../../../utils/NoteUtils';
import { Button, PencilIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../../redux-types';
import { setTagApi } from '../../../actions';
import { FormattedMessage, useIntl } from 'react-intl';
import { CollapsibleContainer } from '@mlflow/mlflow/src/common/components/CollapsibleContainer';

/**
 * Displays editable description section in run detail overview.
 */
export const RunViewDescriptionBox = ({
  runUuid,
  tags,
  onDescriptionChanged,
  isFlatLayout = false,
}: {
  runUuid: string;
  tags: Record<string, KeyValueEntity>;
  onDescriptionChanged: () => void | Promise<void>;
  /**
   * When true, renders in a compact horizontal layout.
   * - Removes section title and bottom margin
   * - Places edit button inline with content
   * - Hides "No description" placeholder
   * When false (default), renders in standard vertical layout with full styling.
   */
  isFlatLayout?: boolean;
}) => {
  const noteContent = tags[NOTE_CONTENT_TAG]?.value || '';

  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const dispatch = useDispatch<ThunkDispatch>();

  const handleSubmitEditNote = (markdown: string) =>
    dispatch(setTagApi(runUuid, NOTE_CONTENT_TAG, markdown))
      .then(onDescriptionChanged)
      .then(() => setShowNoteEditor(false));
  const handleCancelEditNote = () => setShowNoteEditor(false);

  const isEmpty = !noteContent;

  const TypographyWrapper = isFlatLayout ? Typography.Text : Typography.Title;

  return (
    <div css={{ marginBottom: isFlatLayout ? 0 : theme.spacing.md }}>
      <TypographyWrapper
        level={4}
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
        withoutMargins={isFlatLayout}
      >
        {!isFlatLayout && (
          <FormattedMessage
            defaultMessage="Description"
            description="Run page > Overview > Description section > Section title"
          />
        )}
        {isFlatLayout && !isEmpty ? null : (
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewdescriptionbox.tsx_46"
            size="small"
            type="tertiary"
            aria-label={intl.formatMessage({
              defaultMessage: 'Edit description',
              description: 'Run page > Overview > Description section > Edit button label',
            })}
            onClick={() => setShowNoteEditor(true)}
            icon={<PencilIcon />}
            css={{
              ...(isFlatLayout && {
                '&&': {
                  padding: '0 !important',
                },
              }),
            }}
          >
            {isFlatLayout ? (
              <FormattedMessage
                defaultMessage="Add description"
                description="Run page > Overview > Description section > Add description button"
              />
            ) : null}
          </Button>
        )}
      </TypographyWrapper>
      {isEmpty && !showNoteEditor && !isFlatLayout && (
        <Typography.Hint>
          <FormattedMessage
            defaultMessage="No description"
            description="Run page > Overview > Description section > Empty value placeholder"
          />
        </Typography.Hint>
      )}
      {(!isEmpty || showNoteEditor) &&
        (isFlatLayout ? (
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: theme.spacing.sm,
            }}
          >
            <div
              css={{
                '&& p': {
                  margin: '0 !important',
                },
              }}
            >
              {showNoteEditor ? (
                <EditableNote
                  defaultMarkdown={noteContent}
                  onSubmit={handleSubmitEditNote}
                  onCancel={handleCancelEditNote}
                  showEditor={showNoteEditor}
                />
              ) : (
                <CollapsibleContainer isExpanded={isExpanded} setIsExpanded={setIsExpanded} maxHeight={100}>
                  <EditableNote
                    defaultMarkdown={noteContent}
                    onSubmit={handleSubmitEditNote}
                    onCancel={handleCancelEditNote}
                    showEditor={showNoteEditor}
                  />
                </CollapsibleContainer>
              )}
            </div>
            {!showNoteEditor && (
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewdescriptionbox.tsx_46"
                size="small"
                type="tertiary"
                aria-label={intl.formatMessage({
                  defaultMessage: 'Edit description',
                  description: 'Run page > Overview > Description section > Edit button label',
                })}
                onClick={() => setShowNoteEditor(true)}
                icon={<PencilIcon />}
              />
            )}
          </div>
        ) : showNoteEditor ? (
          <EditableNote
            defaultMarkdown={noteContent}
            onSubmit={handleSubmitEditNote}
            onCancel={handleCancelEditNote}
            showEditor={showNoteEditor}
          />
        ) : (
          <CollapsibleContainer isExpanded={isExpanded} setIsExpanded={setIsExpanded} maxHeight={100}>
            <EditableNote
              defaultMarkdown={noteContent}
              onSubmit={handleSubmitEditNote}
              onCancel={handleCancelEditNote}
              showEditor={showNoteEditor}
            />
          </CollapsibleContainer>
        ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

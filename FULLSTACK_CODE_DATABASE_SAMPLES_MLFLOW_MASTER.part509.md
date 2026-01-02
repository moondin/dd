---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 509
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 509 of 991)

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

---[FILE: RunViewOverview.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewOverview.intg.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, expect, test } from '@jest/globals';
import type { DeepPartial } from 'redux';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { waitFor, renderWithIntl, screen, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { RunViewOverview } from './RunViewOverview';
import type { ReduxState } from '../../../redux-types';
import { MemoryRouter } from '../../../common/utils/RoutingUtils';
import { cloneDeep, merge } from 'lodash';
import userEvent from '@testing-library/user-event';
import { setTagApi } from '../../actions';
import type { UseGetRunQueryDataResponse } from './hooks/useGetRunQuery';
import { useGetRunQuery } from './hooks/useGetRunQuery';
import { usePromptVersionsForRunQuery } from '../../pages/prompts/hooks/usePromptVersionsForRunQuery';
import { NOTE_CONTENT_TAG } from '../../utils/NoteUtils';
import {
  shouldEnableRunDetailsMetadataBoxOnRunDetailsPage,
  shouldEnableArtifactsOnRunDetailsPage,
} from '../../../common/utils/FeatureUtils';
import { DesignSystemProvider } from '@databricks/design-system';
import { EXPERIMENT_PARENT_ID_TAG } from '../experiment-page/utils/experimentPage.common-utils';
import type { RunInfoEntity } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { LoggedModelProto } from '../../types';
import { type RunPageModelVersionSummary } from './hooks/useUnifiedRegisteredModelVersionsSummariesForRun';
import { ExperimentKind, MLFLOW_LINKED_PROMPTS_TAG } from '../../constants';

jest.mock('../../../common/components/Prompt', () => ({
  Prompt: jest.fn(() => <div />),
}));

jest.mock('../../actions', () => ({
  setTagApi: jest.fn(() => ({ type: 'setTagApi', payload: Promise.resolve() })),
}));

jest.mock('./hooks/useGetRunQuery', () => ({
  useGetRunQuery: jest.fn(),
}));

jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
  shouldEnableRunDetailsMetadataBoxOnRunDetailsPage: jest.fn(() => false),
  shouldEnableArtifactsOnRunDetailsPage: jest.fn(() => false),
  shouldEnableGraphQLRunDetailsPage: jest.fn(() => true),
}));

const testPromptName = 'test-prompt';
const testPromptVersion = 1;
const testPromptName2 = 'test-prompt-2';

jest.mock('../../pages/prompts/hooks/usePromptVersionsForRunQuery', () => ({
  usePromptVersionsForRunQuery: jest.fn(() => ({
    data: {
      model_versions: [
        {
          name: testPromptName,
          version: testPromptVersion,
        },
      ],
    },
  })),
}));

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larget timeout for integration testing

const testRunUuid = 'test-run-uuid';
const testRunName = 'Test run name';
const testExperimentId = '12345';

const testRunInfo = {
  artifactUri: 'file:/mlflow/tracking/12345/artifacts',
  startTime: 1672578000000, // 2023-01-01 14:00:00
  endTime: 1672578300000, // 2023-01-01 14:05:00
  experimentId: testExperimentId,
  lifecycleStage: 'active',
  runName: testRunName,
  runUuid: testRunUuid,
  status: 'FINISHED' as const,
};

const testEntitiesState: Partial<ReduxState['entities']> = {
  tagsByRunUuid: {
    [testRunUuid]: {},
  },
  runInfosByUuid: {
    [testRunUuid]: testRunInfo,
  },
  runDatasetsByUuid: {
    [testRunUuid]: [],
  },
  paramsByRunUuid: {
    [testRunUuid]: {
      param_a: { key: 'param_a', value: 'param_a_value' },
      param_b: { key: 'param_b', value: 'param_b_value' },
      param_c: { key: 'param_c', value: 'param_c_value' },
    } as any,
  },
  latestMetricsByRunUuid: {
    [testRunUuid]: {
      metric_1: { key: 'metric_1', value: 'metric_1_value' },
      metric_2: { key: 'metric_2', value: 'metric_2_value' },
      metric_3: { key: 'metric_3', value: 'metric_3_value' },
    } as any,
  },
  modelVersionsByRunUuid: {
    [testRunUuid]: [],
  },
};

describe('RunViewOverview integration', () => {
  beforeEach(() => {
    jest.mocked(useGetRunQuery).mockReset();
  });

  const onRunDataUpdated = jest.fn<() => void>();
  const renderComponent = ({
    tags = {},
    runInfo,
    reduxStoreEntities = {},
    loggedModelsV3,
    registeredModelVersionSummaries = [],
    experimentKind = ExperimentKind.CUSTOM_MODEL_DEVELOPMENT,
  }: {
    tags?: Record<string, KeyValueEntity>;
    reduxStoreEntities?: DeepPartial<ReduxState['entities']>;
    runInfo?: Partial<RunInfoEntity>;
    registeredModelVersionSummaries?: RunPageModelVersionSummary[];
    loggedModelsV3?: LoggedModelProto[] | undefined;
    experimentKind?: ExperimentKind;
  } = {}) => {
    const state: DeepPartial<ReduxState> = {
      entities: merge(
        cloneDeep(testEntitiesState),
        {
          tagsByRunUuid: {
            [testRunUuid]: tags,
          },
        },
        reduxStoreEntities,
      ),
    };

    const queryClient = new QueryClient();

    return renderWithIntl(
      <DesignSystemProvider>
        <QueryClientProvider client={queryClient}>
          <MockedReduxStoreProvider state={state}>
            <TestApolloProvider>
              <MemoryRouter>
                <RunViewOverview
                  onRunDataUpdated={onRunDataUpdated}
                  runUuid={testRunUuid}
                  latestMetrics={testEntitiesState.latestMetricsByRunUuid?.[testRunUuid] || {}}
                  params={testEntitiesState.paramsByRunUuid?.[testRunUuid] || {}}
                  runInfo={{ ...testRunInfo, ...runInfo }}
                  tags={merge({}, testEntitiesState.tagsByRunUuid?.[testRunUuid], tags) || {}}
                  registeredModelVersionSummaries={registeredModelVersionSummaries}
                  loggedModelsV3={loggedModelsV3}
                  experimentKind={experimentKind}
                />
              </MemoryRouter>
            </TestApolloProvider>
          </MockedReduxStoreProvider>
        </QueryClientProvider>
      </DesignSystemProvider>,
    );
  };

  test('Render component in the simplest form and assert minimal set of values', async () => {
    const { container } = renderComponent();

    // Empty description
    expect(screen.getByText('No description')).toBeInTheDocument();

    // Start time
    expect(container.textContent).toMatch(/Created at\s*01\/01\/2023, 01:00:00 PM/);

    // Status
    expect(container.textContent).toMatch(/Status\s*Finished/);

    // Run ID
    expect(container.textContent).toMatch(/Run ID\s*test-run-uuid/);

    // Duration
    expect(container.textContent).toMatch(/Duration\s*5\.0min/);

    // Experiment ID
    expect(container.textContent).toMatch(/Experiment ID\s*12345/);

    // Datasets
    expect(container.textContent).toMatch(/Datasets\s*None/);

    // Registered models
    expect(container.textContent).toMatch(/Registered models\s*None/);
  });
  test('Render and change run description', async () => {
    renderComponent({
      tags: {
        [NOTE_CONTENT_TAG]: { key: NOTE_CONTENT_TAG, value: 'existing description' },
      },
    });

    // Non-empty description
    expect(screen.getByText('existing description')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Edit description' }));
    await userEvent.clear(screen.getByTestId('text-area'));
    await userEvent.type(screen.getByTestId('text-area'), 'hello');
    await userEvent.click(screen.getByTestId('editable-note-save-button'));

    expect(setTagApi).toHaveBeenCalledWith('test-run-uuid', NOTE_CONTENT_TAG, 'hello');
  });

  test.each([
    ['200ms', 30, 230],
    ['1.0s', 1000, 2000],
    ['1.5min', 500, 90500],
    ['1.3h', 10, 4500010],
  ])('Properly render %s formatted run duration', (expectedDuration, startTime, endTime) => {
    const { container } = renderComponent({
      runInfo: { startTime, endTime },
    });

    expect(container.textContent).toMatch(expectedDuration);
  });

  test("Render cell with run's author", () => {
    const { container } = renderComponent({
      tags: {
        'mlflow.user': { key: 'mlflow.user', value: 'test.joe@databricks.com' },
      },
    });

    expect(container.textContent).toMatch('test.joe@databricks.com');
  });

  test('Render cell with logged models and display dropdown menu', async () => {
    renderComponent({
      runInfo: {
        artifactUri: 'file:/mlflow/tracking/12345/artifacts',
      },
      tags: {
        'mlflow.log-model.history': {
          key: 'mlflow.log-model.history',
          value: JSON.stringify([
            {
              artifact_path: 'path/to/model',
              flavors: { sklearn: {} },
              utc_time_created: 1672578000000,
            },
            {
              artifact_path: 'path/to/xgboost/model',
              flavors: { xgboost: {} },
              utc_time_created: 1672578000000,
            },
          ]),
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/sklearn/)).toBeInTheDocument();
    });

    const modelLink = screen.getByRole('link', { name: /sklearn/ });
    expect(modelLink).toHaveAttribute('href', expect.stringMatching(/test-run-uuid\/artifacts\/path\/to\/model$/));

    const moreButton = screen.getByRole('button', { name: '+1' });
    expect(moreButton).toBeInTheDocument();

    await userEvent.click(moreButton);
    expect(screen.getByText('xgboost')).toBeInTheDocument();
  });

  test('Render cell with registered models and display dropdown menu', async () => {
    renderComponent({
      runInfo: {
        artifactUri: 'file:/mlflow/tracking/12345/artifacts',
      },
      registeredModelVersionSummaries: [
        {
          displayedName: 'test-registered-model',
          version: '1',
          link: '/models/test-registered-model/versions/1',
          source: 'file:/mlflow/tracking/12345/artifacts',
          status: 'READY',
        },
        {
          displayedName: 'another-test-registered-model',
          version: '2',
          link: '/models/another-test-registered-model/versions/2',
          source: 'file:/mlflow/tracking/12345/artifacts',
          status: 'READY',
        },
      ],
      tags: {},
    });

    await waitFor(() => {
      expect(screen.getByText(/test-registered-model/)).toBeInTheDocument();
    });

    const modelLink = screen.getByRole('link', { name: /test-registered-model/ });
    expect(modelLink).toHaveAttribute('href', expect.stringMatching(/test-registered-model\/versions\/1$/));

    const moreButton = screen.getByRole('button', { name: '+1' });
    expect(moreButton).toBeInTheDocument();

    await userEvent.click(moreButton);
    expect(screen.getByText('another-test-registered-model')).toBeInTheDocument();
  });

  test('Render child run and check for the existing parent run link', () => {
    const testParentRunUuid = 'test-parent-run-uuid';
    const testParentRunName = 'Test parent run name';

    jest.mocked(useGetRunQuery).mockReturnValue({
      data: {
        info: {
          runName: testParentRunName,
          runUuid: testParentRunUuid,
          experimentId: testExperimentId,
        },
      } as UseGetRunQueryDataResponse,
      loading: false,
      apolloError: undefined,
      apiError: undefined,
      refetchRun: jest.fn() as any,
    });

    const { container } = renderComponent({
      tags: {
        [EXPERIMENT_PARENT_ID_TAG]: {
          key: EXPERIMENT_PARENT_ID_TAG,
          value: testParentRunUuid,
        } as KeyValueEntity,
      },
      runInfo: {},
      reduxStoreEntities: {
        runInfosByUuid: {
          [testParentRunUuid]: {
            experimentId: testExperimentId,
            runUuid: testParentRunUuid,
            runName: testParentRunName,
          },
        },
      },
    });

    expect(container.textContent).toMatch(/Parent run\s*Test parent run name/);
    expect(screen.getByRole('link', { name: /Test parent run name/ })).toBeInTheDocument();
  });

  test('Render child run and load the parent run name if it does not exist', async () => {
    const testParentRunUuid = 'test-parent-run-uuid';

    renderComponent({
      tags: {
        [EXPERIMENT_PARENT_ID_TAG]: {
          key: EXPERIMENT_PARENT_ID_TAG,
          value: testParentRunUuid,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Parent run name loading')).toBeInTheDocument();
      expect(useGetRunQuery).toHaveBeenCalledWith({ runUuid: testParentRunUuid, disabled: false });
    });
  });

  test('Run overview contains prompts from run tags', async () => {
    renderComponent({
      tags: {
        [MLFLOW_LINKED_PROMPTS_TAG]: {
          key: MLFLOW_LINKED_PROMPTS_TAG,
          value: JSON.stringify([{ name: testPromptName2, version: testPromptVersion.toString() }]),
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(`${testPromptName2} (v${testPromptVersion})`)).toBeInTheDocument();
    });
  });

  test('Run overview contains registered prompts', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(`${testPromptName} (v${testPromptVersion})`)).toBeInTheDocument();
      expect(usePromptVersionsForRunQuery).toHaveBeenCalledWith({ runUuid: testRunUuid });
    });
  });
  // TODO: expand integration tests when tags, params, metrics and models are complete
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewOverview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewOverview.tsx
Signals: React

```typescript
import { FormattedMessage, useIntl } from 'react-intl';
import { useMemo } from 'react';

import { Button, FileIcon, Spacer, Spinner, Typography, useDesignSystemTheme } from '@databricks/design-system';

import Utils from '../../../common/utils/Utils';
import { useLocation } from '../../../common/utils/RoutingUtils';
import { EXPERIMENT_PARENT_ID_TAG } from '../experiment-page/utils/experimentPage.common-utils';

import { RunViewStatusBox } from './overview/RunViewStatusBox';
import { RunViewUserLinkBox } from './overview/RunViewUserLinkBox';
import { DetailsOverviewParamsTable } from '../DetailsOverviewParamsTable';
import { RunViewMetricsTable } from './overview/RunViewMetricsTable';
import { RunViewDatasetBox } from './overview/RunViewDatasetBox';
import { RunViewParentRunBox } from './overview/RunViewParentRunBox';
import { RunViewTagsBox } from './overview/RunViewTagsBox';
import { RunViewDescriptionBox } from './overview/RunViewDescriptionBox';
import { DetailsOverviewMetadataRow } from '../DetailsOverviewMetadataRow';
import { RunViewRegisteredModelsBox } from './overview/RunViewRegisteredModelsBox';
import { RunViewRegisteredPromptsBox } from './overview/RunViewRegisteredPromptsBox';
import { RunViewLoggedModelsBox } from './overview/RunViewLoggedModelsBox';
import { RunViewSourceBox } from './overview/RunViewSourceBox';
import { DetailsOverviewMetadataTable } from '@mlflow/mlflow/src/experiment-tracking/components/DetailsOverviewMetadataTable';
import type { LoggedModelProto } from '../../types';
import { ExperimentKind } from '../../constants';
import { useExperimentLoggedModelRegisteredVersions } from '../experiment-logged-models/hooks/useExperimentLoggedModelRegisteredVersions';
import { DetailsOverviewCopyableIdBox } from '../DetailsOverviewCopyableIdBox';
import type { RunInfoEntity } from '../../types';
import type {
  UseGetRunQueryResponseInputs,
  UseGetRunQueryResponseOutputs,
  UseGetRunQueryResponseRunInfo,
} from './hooks/useGetRunQuery';
import type { MetricEntitiesByName, RunDatasetWithTags } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { type RunPageModelVersionSummary } from './hooks/useUnifiedRegisteredModelVersionsSummariesForRun';
import { isEmpty, uniqBy } from 'lodash';
import { RunViewLoggedModelsTable } from './overview/RunViewLoggedModelsTable';
import { DetailsPageLayout } from '../../../common/components/details-page-layout/DetailsPageLayout';
import { useRunDetailsPageOverviewSectionsV2 } from './hooks/useRunDetailsPageOverviewSectionsV2';
import { RunViewDetailsMetadataBox } from './overview/RunViewDetailsMetadataBox';
import {
  shouldEnableRunDetailsMetadataBoxOnRunDetailsPage,
  shouldEnableArtifactsOnRunDetailsPage,
} from '@mlflow/mlflow/src/common/utils/FeatureUtils';

const EmptyValue = () => <Typography.Hint>—</Typography.Hint>;

export const RunViewOverview = ({
  runUuid,
  onRunDataUpdated,
  tags,
  runInfo,
  datasets,
  params,
  latestMetrics,
  runInputs,
  runOutputs,
  registeredModelVersionSummaries: registeredModelVersionSummariesForRun,
  loggedModelsV3 = [],
  isLoadingLoggedModels = false,
  loggedModelsError,
  experimentKind,
}: {
  runUuid: string;
  onRunDataUpdated: () => void | Promise<any>;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  tags: Record<string, KeyValueEntity>;
  latestMetrics: MetricEntitiesByName;
  runInputs?: UseGetRunQueryResponseInputs;
  runOutputs?: UseGetRunQueryResponseOutputs;
  datasets?: RunDatasetWithTags[];
  params: Record<string, KeyValueEntity>;
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
  loggedModelsV3?: LoggedModelProto[];
  isLoadingLoggedModels?: boolean;
  loggedModelsError?: Error;
  experimentKind?: ExperimentKind;
}) => {
  const { theme } = useDesignSystemTheme();
  const { search } = useLocation();
  const intl = useIntl();

  const loggedModelsFromTags = useMemo(() => Utils.getLoggedModelsFromTags(tags), [tags]);
  const parentRunIdTag = tags[EXPERIMENT_PARENT_ID_TAG];
  const containsLoggedModelsFromInputsOutputs = !isEmpty(runInputs?.modelInputs) || !isEmpty(runOutputs?.modelOutputs);
  const shouldRenderLoggedModelsBox = !containsLoggedModelsFromInputsOutputs;
  const shouldRenderLinkedPromptsTable = experimentKind === ExperimentKind.GENAI_DEVELOPMENT;

  // We have two flags for controlling the visibility of the "logged models" section:
  // - `shouldRenderLoggedModelsBox` determines if "logged models" section should be rendered.
  //   It is hidden if any IAv3 logged models are detected in inputs/outputs, in this case we're
  //   displaying a big table instead.
  // - `shouldDisplayContentsOfLoggedModelsBox` determines if the contents of the "logged models"
  //   section should be displayed. It is hidden if there are no logged models to display.
  const shouldDisplayContentsOfLoggedModelsBox = loggedModelsFromTags?.length > 0 || loggedModelsV3?.length > 0;
  const { modelVersions: loggedModelsV3RegisteredModels } = useExperimentLoggedModelRegisteredVersions({
    loggedModels: loggedModelsV3,
  });

  /**
   * We have to query multiple sources for registered model versions (logged models API, models API, UC)
   * and it's possible to end up with duplicates.
   * We can dedupe them using `link` field, which should be unique for each model.
   */
  const registeredModelVersionSummaries = uniqBy(
    [...registeredModelVersionSummariesForRun, ...loggedModelsV3RegisteredModels],
    (model) => model?.link,
  );

  const shouldEnableRunDetailsMetadataBox = shouldEnableRunDetailsMetadataBoxOnRunDetailsPage();

  const renderPromptMetadataRow = () => {
    return (
      <DetailsOverviewMetadataRow
        title={
          <FormattedMessage
            defaultMessage="Registered prompts"
            description="Run page > Overview > Run prompts section label"
          />
        }
        value={<RunViewRegisteredPromptsBox tags={tags} runUuid={runUuid} />}
      />
    );
  };

  const renderDetails = () => {
    if (shouldEnableRunDetailsMetadataBox) {
      return (
        <>
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gridTemplateRows: 'auto auto',
              gap: theme.spacing.lg,
              width: '100%',
              [theme.responsive.mediaQueries.xl]: {
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr',
              },
            }}
          >
            <div
              css={{
                width: '100%',
                [theme.responsive.mediaQueries.xl]: {
                  gridColumn: 1,
                },
              }}
            >
              <RunViewDetailsMetadataBox
                runUuid={runUuid}
                runInfo={runInfo}
                tags={tags}
                datasets={datasets}
                search={search}
                onRunDataUpdated={onRunDataUpdated}
                registeredModelVersionSummaries={registeredModelVersionSummaries}
              />
            </div>
            <div
              css={{
                width: '100%',
                display: 'flex',
              }}
            >
              {/* eslint-disable-next-line */}
              {/* prettier-ignore */}
            </div>
          </div>
          <Spacer size="lg" />
        </>
      );
    }

    return (
      <DetailsOverviewMetadataTable>
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Created at"
              description="Run page > Overview > Run start time section label"
            />
          }
          value={runInfo.startTime ? Utils.formatTimestamp(runInfo.startTime, intl) : <EmptyValue />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Created by"
              description="Run page > Overview > Run author section label"
            />
          }
          value={<RunViewUserLinkBox runInfo={runInfo} tags={tags} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Experiment ID"
              description="Run page > Overview > experiment ID section label"
            />
          }
          value={<DetailsOverviewCopyableIdBox value={runInfo?.experimentId ?? ''} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage defaultMessage="Status" description="Run page > Overview > Run status section label" />
          }
          value={<RunViewStatusBox status={runInfo.status} useSpinner />}
        />
        <DetailsOverviewMetadataRow
          title={<FormattedMessage defaultMessage="Run ID" description="Run page > Overview > Run ID section label" />}
          value={<DetailsOverviewCopyableIdBox value={runInfo.runUuid ?? ''} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Duration"
              description="Run page > Overview > Run duration section label"
            />
          }
          value={Utils.getDuration(runInfo.startTime, runInfo.endTime)}
        />
        {parentRunIdTag && (
          <DetailsOverviewMetadataRow
            title={<FormattedMessage defaultMessage="Parent run" description="Run page > Overview > Parent run" />}
            value={<RunViewParentRunBox parentRunUuid={parentRunIdTag.value} />}
          />
        )}
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Datasets used"
              description="Run page > Overview > Run datasets section label"
            />
          }
          value={
            datasets?.length ? <RunViewDatasetBox tags={tags} runInfo={runInfo} datasets={datasets} /> : <EmptyValue />
          }
        />
        <DetailsOverviewMetadataRow
          title={<FormattedMessage defaultMessage="Tags" description="Run page > Overview > Run tags section label" />}
          value={<RunViewTagsBox runUuid={runInfo.runUuid ?? ''} tags={tags} onTagsUpdated={onRunDataUpdated} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage defaultMessage="Source" description="Run page > Overview > Run source section label" />
          }
          value={<RunViewSourceBox tags={tags} search={search} runUuid={runUuid} />}
        />
        {shouldRenderLoggedModelsBox && (
          <DetailsOverviewMetadataRow
            title={
              <FormattedMessage
                defaultMessage="Logged models"
                description="Run page > Overview > Run models section label"
              />
            }
            value={
              isLoadingLoggedModels ? (
                <Spinner />
              ) : shouldDisplayContentsOfLoggedModelsBox ? (
                <RunViewLoggedModelsBox
                  // Pass the run info and logged models
                  runInfo={runInfo}
                  loggedModels={loggedModelsFromTags}
                  // Provide loggedModels from IA v3
                  loggedModelsV3={loggedModelsV3}
                />
              ) : (
                <EmptyValue />
              )
            }
          />
        )}
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Registered models"
              description="Run page > Overview > Run models section label"
            />
          }
          value={
            registeredModelVersionSummaries?.length > 0 ? (
              <RunViewRegisteredModelsBox registeredModelVersionSummaries={registeredModelVersionSummaries} />
            ) : (
              <EmptyValue />
            )
          }
        />
        {renderPromptMetadataRow()}
      </DetailsOverviewMetadataTable>
    );
  };

  const renderParams = () => {
    return <DetailsOverviewParamsTable params={params} expandToParentContainer />;
  };
  const detailsSectionsV2 = useRunDetailsPageOverviewSectionsV2({
    runUuid,
    runInfo,
    tags,
    onTagsUpdated: onRunDataUpdated,
    datasets,
    loggedModelsV3,
    shouldRenderLoggedModelsBox,
    registeredModelVersionSummaries,
  });
  const usingSidebarLayout = true;
  return (
    <DetailsPageLayout
      css={{ flex: 1, alignSelf: 'flex-start' }}
      // Enable sidebar layout based on feature flag
      usingSidebarLayout={usingSidebarLayout}
      secondarySections={detailsSectionsV2}
    >
      {usingSidebarLayout && (
        <RunViewDescriptionBox runUuid={runUuid} tags={tags} onDescriptionChanged={onRunDataUpdated} />
      )}
      {!usingSidebarLayout && (
        <>
          {/* prettier-ignore */}
          {renderDetails()}
        </>
      )}
      <div
        // Use different grid setup for unified details page layout
        css={[
          usingSidebarLayout ? { flexDirection: 'column' } : { minHeight: 360, maxHeight: 760 },
          {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
            overflow: 'hidden',
            [theme.responsive.mediaQueries.xl]: {
              flexDirection: usingSidebarLayout ? 'column' : 'row',
            },
          },
        ]}
      >
        <div
          css={{
            display: 'flex',
            flex: 1,
            width: '100%',
          }}
        >
          <RunViewMetricsTable
            latestMetrics={latestMetrics}
            runInfo={runInfo}
            loggedModels={loggedModelsV3}
            expandToParentContainer
          />
        </div>
        <div
          css={{
            display: 'flex',
            flex: 1,
          }}
        >
          {renderParams()}
        </div>
      </div>
      {containsLoggedModelsFromInputsOutputs && (
        <>
          {!usingSidebarLayout && <Spacer />}
          <div css={{ minHeight: 360, maxHeight: 760, overflow: 'hidden', display: 'flex' }}>
            <RunViewLoggedModelsTable
              loggedModelsV3={loggedModelsV3}
              isLoadingLoggedModels={isLoadingLoggedModels}
              inputs={runInputs}
              outputs={runOutputs}
              runInfo={runInfo}
              loggedModelsError={loggedModelsError}
            />
          </div>
        </>
      )}
      {!usingSidebarLayout && <Spacer />}
      {/* Add a spacer so the page doesn't jump when searching params / metrics */}
      <div css={{ height: 500 }} />
    </DetailsPageLayout>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useRunDetailsPageDataLegacy.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/useRunDetailsPageDataLegacy.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRunDetailsPageDataLegacy } from './useRunDetailsPageDataLegacy';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';

import { getExperimentApi, getRunApi } from '../../actions';
import { searchModelVersionsApi } from '../../../model-registry/actions';
import { merge } from 'lodash';
import type { ReduxState } from '../../../redux-types';
import type { DeepPartial } from 'redux';
import Utils from '../../../common/utils/Utils';

const mockAction = (id: string) => ({ type: 'action', payload: Promise.resolve(), meta: { id } });

jest.mock('../../actions', () => ({
  getExperimentApi: jest.fn(() => mockAction('experiment_request')),
  getRunApi: jest.fn(() => mockAction('run_request')),
}));

jest.mock('../../../model-registry/actions', () => ({
  searchModelVersionsApi: jest.fn(() => mockAction('models_request')),
}));

const testRunUuid = 'test-run-uuid';
const testExperimentId = '12345';

describe('useRunDetailsPageDataLegacy', () => {
  const mountHook = (entities: DeepPartial<ReduxState['entities']> = {}, apis: DeepPartial<ReduxState['apis']> = {}) =>
    renderHook(() => useRunDetailsPageDataLegacy(testRunUuid, testExperimentId), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MockedReduxStoreProvider
          state={{
            entities: merge(
              {
                runInfosByUuid: {},
                experimentsById: {},
                tagsByRunUuid: {
                  [testRunUuid]: [
                    { key: 'testtag1', value: '' },
                    { key: '\t', value: 'value1' },
                  ],
                },
                latestMetricsByRunUuid: {
                  [testRunUuid]: [
                    { key: 'met1', value: 2, timestamp: 1000, step: 0 },
                    { key: '', value: 0, timestamp: 1000, step: 0 },
                  ],
                },
                modelVersionsByRunUuid: {},
                paramsByRunUuid: {
                  [testRunUuid]: [
                    { key: 'p1', value: '' },
                    { key: '\n', value: '0' },
                  ],
                },
                runDatasetsByUuid: {
                  [testRunUuid]: [
                    {
                      dataset: {
                        digest: 'digest',
                        name: 'name',
                        profile: 'profile',
                        schema: 'schema',
                        source: 'source',
                        sourceType: 'sourceType',
                      },
                      tags: [{ key: 'tag1', value: 'value1' }],
                    },
                  ],
                },
              },
              entities,
            ),
            apis,
          }}
        >
          {children}
        </MockedReduxStoreProvider>
      ),
    });

  beforeEach(() => {
    jest.mocked(getRunApi).mockClear();
    jest.mocked(getExperimentApi).mockClear();
    jest.mocked(searchModelVersionsApi).mockClear();

    jest.mocked(getRunApi).mockImplementation(() => mockAction('run_request') as any);
    jest.mocked(getExperimentApi).mockImplementation(() => mockAction('experiment_request') as any);
    jest.spyOn(Utils, 'logErrorAndNotifyUser');
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Start fetching run and experiment if it's not in the store already", () => {
    const { result } = mountHook();

    const { data } = result.current;

    expect(data.experiment).toBeUndefined();
    expect(data.runInfo).toBeUndefined();

    expect(getRunApi).toHaveBeenCalledWith(testRunUuid);
    expect(getExperimentApi).toHaveBeenCalledWith(testExperimentId);
    expect(searchModelVersionsApi).toHaveBeenCalledWith({ run_id: testRunUuid });
  });

  test("Do not fetch run if it's in the store already", () => {
    const { result } = mountHook({ runInfosByUuid: { [testRunUuid]: { runName: 'some_run' } } });

    const { data, loading } = result.current;

    expect(data.experiment).toBeUndefined();
    expect(data.runInfo).toEqual({ runName: 'some_run' });
    expect(loading).toEqual(true);

    expect(getRunApi).not.toHaveBeenCalled();
    expect(getExperimentApi).toHaveBeenCalledWith(testExperimentId);
  });

  test("Do not fetch experiment if it's in the store already", () => {
    const { result } = mountHook({
      experimentsById: { [testExperimentId]: { name: 'some_experiment' } },
    });

    const { data } = result.current;

    expect(data.runInfo).toBeUndefined();
    expect(data.experiment).toEqual({ name: 'some_experiment' });

    expect(getRunApi).toHaveBeenCalledWith(testRunUuid);
    expect(getExperimentApi).not.toHaveBeenCalled();
  });

  test('Properly conveys get experiment API error if there is one', () => {
    const experimentFetchError = new Error('experiment_fetch_error');
    const { result } = mountHook({}, { experiment_request: { active: false, error: experimentFetchError } });

    expect(result.current.errors.experimentFetchError).toBe(experimentFetchError);
  });

  test('Properly conveys get run API error if there is one', () => {
    const runFetchError = new Error('run_fetch_error');
    const { result } = mountHook({}, { run_request: { active: false, error: runFetchError } });

    expect(result.current.errors.runFetchError).toBe(runFetchError);
  });

  test('Properly reports experiment fetch error if there is one', async () => {
    jest.mocked(getExperimentApi).mockImplementation(() => {
      return {
        type: 'get_experiment',
        meta: { id: 'abc' },
        payload: Promise.reject(new Error('experiment_fetch_error')),
      };
    });
    jest.spyOn(Utils, 'logErrorAndNotifyUser');

    mountHook();

    await waitFor(() => {
      expect(jest.mocked(Utils.logErrorAndNotifyUser).mock.lastCall?.[0]).toBeInstanceOf(Error);
      expect(jest.mocked(Utils.logErrorAndNotifyUser).mock.lastCall?.[0].message).toEqual('experiment_fetch_error');
    });
  });

  test('Properly reports run fetch error if there is one', async () => {
    jest.mocked(getRunApi).mockImplementation(() => {
      return {
        type: 'get_run',
        meta: { id: 'abc' },
        payload: Promise.reject(new Error('run_fetch_error')),
      };
    });
    mountHook();

    await waitFor(() => {
      expect(jest.mocked(Utils.logErrorAndNotifyUser).mock.lastCall?.[0]).toBeInstanceOf(Error);
      expect(jest.mocked(Utils.logErrorAndNotifyUser).mock.lastCall?.[0].message).toEqual('run_fetch_error');
    });
  });

  test('To refetch the data when necessary', async () => {
    const { result } = mountHook();

    expect(getRunApi).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.refetchRun();
    });

    expect(getRunApi).toHaveBeenCalledTimes(2);
  });

  test('Fetches metrics, params, and tags with non-empty key and empty value, but not those with empty key', () => {
    const { result } = mountHook();
    const { tags, params, latestMetrics, datasets } = result.current.data;

    expect(tags).toEqual({ '0': { key: 'testtag1', value: '' } });
    expect(params).toEqual({ '0': { key: 'p1', value: '' } });
    expect(latestMetrics).toEqual({ '0': { key: 'met1', value: 2, timestamp: 1000, step: 0 } });

    expect(datasets).toEqual([
      {
        dataset: {
          digest: 'digest',
          name: 'name',
          profile: 'profile',
          schema: 'schema',
          source: 'source',
          sourceType: 'sourceType',
        },
        tags: [{ key: 'tag1', value: 'value1' }],
      },
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useRunDetailsPageDataLegacy.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/useRunDetailsPageDataLegacy.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../redux-types';
import { getExperimentApi, getRunApi } from '../../actions';
import { searchModelVersionsApi } from '../../../model-registry/actions';
import { pickBy } from 'lodash';
import Utils from '../../../common/utils/Utils';

/**
 * Hook fetching data for the run page: both run and experiment entities.
 * The initial fetch action is omitted if entities are already in the store.
 */
export const useRunDetailsPageDataLegacy = (
  runUuid: string,
  experimentId: string,
  enableWorkspaceModelsRegistryCall = true,
) => {
  const [runRequestId, setRunRequestId] = useState('');
  const [experimentRequestId, setExperimentRequestId] = useState('');
  const dispatch = useDispatch<ThunkDispatch>();

  // Get the necessary data from the store

  const { runInfo, tags, latestMetrics, experiment, params, datasets } = useSelector((state: ReduxState) => ({
    runInfo: state.entities.runInfosByUuid[runUuid],
    // Filter out tags, metrics, and params that are entirely whitespace
    tags: pickBy(state.entities.tagsByRunUuid[runUuid], (tag) => tag.key.trim().length > 0),
    latestMetrics: pickBy(state.entities.latestMetricsByRunUuid[runUuid], (metric) => metric.key.trim().length > 0),
    params: pickBy(state.entities.paramsByRunUuid[runUuid], (param) => param.key.trim().length > 0),
    experiment: state.entities.experimentsById[experimentId],
    datasets: state.entities.runDatasetsByUuid[runUuid],
  }));

  const fetchRun = useCallback(() => {
    const action = getRunApi(runUuid);
    setRunRequestId(action.meta.id);
    return dispatch(action);
  }, [dispatch, runUuid]);

  const fetchExperiment = useCallback(() => {
    const action = getExperimentApi(experimentId);
    setExperimentRequestId(action.meta.id);
    return dispatch(action);
  }, [dispatch, experimentId]);

  const fetchModelVersions = useCallback(() => {
    if (enableWorkspaceModelsRegistryCall) {
      dispatch(searchModelVersionsApi({ run_id: runUuid }));
    }
  }, [dispatch, runUuid, enableWorkspaceModelsRegistryCall]);

  // Do the initial run & experiment fetch only if it's not in the store already
  useEffect(() => {
    if (!runInfo) {
      fetchRun().catch((e) => Utils.logErrorAndNotifyUser(e));
    }
    fetchModelVersions();
  }, [runInfo, fetchRun, fetchModelVersions]);

  useEffect(() => {
    if (!experiment) {
      fetchExperiment().catch((e) => Utils.logErrorAndNotifyUser(e));
    }
  }, [experiment, fetchExperiment]);

  // Check the "apis" store for the requests status
  const { loading: runLoading, error: runFetchError } = useSelector((state: ReduxState) => ({
    loading: !runRequestId || Boolean(state.apis?.[runRequestId]?.active),
    error: state.apis?.[runRequestId]?.error,
  }));

  const { loading: experimentLoading, error: experimentFetchError } = useSelector((state: ReduxState) => ({
    loading: !runRequestId || Boolean(state.apis?.[experimentRequestId]?.active),
    error: state.apis?.[experimentRequestId]?.error,
  }));

  const loading = runLoading || experimentLoading;

  return {
    loading,
    data: {
      runInfo,
      tags,
      params,
      latestMetrics,
      experiment,
      datasets,
    },
    refetchRun: fetchRun,
    errors: { runFetchError, experimentFetchError },
  };
};
```

--------------------------------------------------------------------------------

````

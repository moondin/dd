---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 512
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 512 of 991)

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

---[FILE: RunViewDetailsMetadataBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewDetailsMetadataBox.tsx

```typescript
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, FileIcon, InfoSmallIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import Utils from '../../../../common/utils/Utils';
import { EXPERIMENT_PARENT_ID_TAG } from '../../experiment-page/utils/experimentPage.common-utils';

import { RunViewStatusBox } from './RunViewStatusBox';
import { RunViewUserLinkBox } from './RunViewUserLinkBox';
import { RunViewDatasetBox } from './RunViewDatasetBox';
import { RunViewParentRunBox } from './RunViewParentRunBox';
import { RunViewTagsBox } from './RunViewTagsBox';
import { RunViewDescriptionBox } from './RunViewDescriptionBox';
import { RunViewRegisteredModelsBox } from './RunViewRegisteredModelsBox';
import { RunViewSourceBox } from './RunViewSourceBox';
import { DetailsOverviewCopyableIdBox } from '../../DetailsOverviewCopyableIdBox';
import type { RunInfoEntity } from '../../../types';
import type { RunDatasetWithTags } from '../../../types';
import type { UseGetRunQueryResponseRunInfo } from '../hooks/useGetRunQuery';
import type { KeyValueEntity } from '../../../../common/types';
import { type RunPageModelVersionSummary } from '../hooks/useUnifiedRegisteredModelVersionsSummariesForRun';

const { Title } = Typography;

const EmptyValue = () => <Typography.Hint>—</Typography.Hint>;

const PairsContentSection = ({ title, value }: { title: React.ReactNode; value: React.ReactNode }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <tr
      css={{
        display: 'flex',
        minHeight: theme.general.heightSm,
      }}
    >
      <th
        css={{
          flex: `0 0 164px`,
          padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'start',
        }}
      >
        {title}
      </th>
      <td
        css={{
          flex: 1,
          padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </td>
    </tr>
  );
};

export const RunViewDetailsMetadataBox = ({
  runUuid,
  runInfo,
  tags,
  datasets,
  search,
  onRunDataUpdated,
  registeredModelVersionSummaries,
}: {
  runUuid: string;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  tags: Record<string, KeyValueEntity>;
  datasets?: RunDatasetWithTags[];
  search: string;
  onRunDataUpdated: () => void | Promise<any>;
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const parentRunIdTag = tags[EXPERIMENT_PARENT_ID_TAG];
  return (
    <section
      aria-labelledby="Run details section"
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.spacing.sm,
        border: `1px solid ${theme.colors.borderDecorative}`,
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        <InfoSmallIcon
          css={{
            width: theme.spacing.lg,
            height: theme.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.spacing.sm,
          }}
        />
        <Title level={3} withoutMargins>
          <FormattedMessage
            defaultMessage="Run details"
            description="Run page > Overview > Run details section heading"
          />
        </Title>
      </div>
      <table css={{ display: 'flex' }}>
        <tbody>
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Description"
                  description="Run page > Overview > Description section > Section title"
                />
              </Typography.Text>
            }
            value={
              <RunViewDescriptionBox
                runUuid={runUuid}
                tags={tags}
                onDescriptionChanged={onRunDataUpdated}
                isFlatLayout
              />
            }
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Created at"
                  description="Run page > Overview > Run start time section label"
                />
              </Typography.Text>
            }
            value={runInfo.startTime ? Utils.formatTimestamp(runInfo.startTime, intl) : <EmptyValue />}
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Created by"
                  description="Run page > Overview > Run author section label"
                />
              </Typography.Text>
            }
            value={<RunViewUserLinkBox runInfo={runInfo} tags={tags} />}
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Status"
                  description="Run page > Overview > Run status section label"
                />
              </Typography.Text>
            }
            value={<RunViewStatusBox status={runInfo.status} useSpinner />}
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage defaultMessage="Run ID" description="Run page > Overview > Run ID section label" />
              </Typography.Text>
            }
            value={<DetailsOverviewCopyableIdBox value={runInfo.runUuid ?? ''} />}
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Duration"
                  description="Run page > Overview > Run duration section label"
                />
              </Typography.Text>
            }
            value={Utils.getDuration(runInfo.startTime, runInfo.endTime)}
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Dataset used"
                  description="Run page > Overview > Run datasets section label"
                />
              </Typography.Text>
            }
            value={
              datasets?.length ? (
                <RunViewDatasetBox tags={tags} runInfo={runInfo} datasets={datasets} />
              ) : (
                <EmptyValue />
              )
            }
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Type"
                  description="Run page > Overview > Experiment ID section label"
                />
              </Typography.Text>
            }
            value={<Typography.Text withoutMargins>Training</Typography.Text>}
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage defaultMessage="Tags" description="Run page > Overview > Run tags section label" />
              </Typography.Text>
            }
            value={
              <RunViewTagsBox
                runUuid={runInfo.runUuid ?? ''}
                tags={tags}
                onTagsUpdated={onRunDataUpdated}
                css={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  '& div': { paddingTop: 0, paddingBottom: 0 },
                  '& button': { paddingTop: 0, paddingBottom: 0 },
                }}
              />
            }
          />
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Source"
                  description="Run page > Overview > Run source section label"
                />
              </Typography.Text>
            }
            value={
              <RunViewSourceBox tags={tags} search={search} runUuid={runUuid} css={{ padding: 0 }} hasIcon={false} />
            }
          />
          {parentRunIdTag && (
            <PairsContentSection
              title={
                <Typography.Text bold withoutMargins>
                  <FormattedMessage defaultMessage="Parent run" description="Run page > Overview > Parent run" />
                </Typography.Text>
              }
              value={<RunViewParentRunBox parentRunUuid={parentRunIdTag.value} />}
            />
          )}
          <PairsContentSection
            title={
              <Typography.Text bold withoutMargins>
                <FormattedMessage
                  defaultMessage="Model registered"
                  description="Run page > Overview > Model registered section label"
                />
              </Typography.Text>
            }
            value={
              registeredModelVersionSummaries?.length > 0 ? (
                <RunViewRegisteredModelsBox registeredModelVersionSummaries={registeredModelVersionSummaries} />
              ) : (
                <EmptyValue />
              )
            }
          />
        </tbody>
      </table>
    </section>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewLoggedModelsBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewLoggedModelsBox.tsx
Signals: React

```typescript
import { ModelsIcon, Overflow, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { Link } from '../../../../common/utils/RoutingUtils';
import type { RunInfoEntity } from '../../../types';
import { type LoggedModelProto } from '../../../types';
import Routes from '../../../routes';
import { first } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useMemo } from 'react';
import type { UseGetRunQueryResponseRunInfo } from '../hooks/useGetRunQuery';

/**
 * Displays list of registered models in run detail overview.
 */
export const RunViewLoggedModelsBox = ({
  loggedModels,
  loggedModelsV3,
  runInfo,
}: {
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  loggedModelsV3: LoggedModelProto[];
  loggedModels: {
    artifactPath: string;
    flavors: string[];
    utcTimeCreated: number;
  }[];
}) => {
  const { theme } = useDesignSystemTheme();
  const { experimentId, runUuid } = runInfo;

  const getModelFlavorName = (flavors: string[]) => {
    return (
      first(flavors) || (
        <FormattedMessage
          defaultMessage="Model"
          description="Run page > Overview > Logged models > Unknown model flavor"
        />
      )
    );
  };

  // Check if list has models with same flavor names.
  // If true, display artifact path in dropdown menu to reduce ambiguity.
  const shouldDisplayArtifactPaths = useMemo(() => {
    const flavors = loggedModels.map((model) => getModelFlavorName(model.flavors));
    const uniqueFlavors = new Set(flavors);
    return uniqueFlavors.size !== flavors.length;
  }, [loggedModels]);

  return (
    <Overflow>
      {loggedModels.map((model, index) => {
        return (
          <Link
            to={Routes.getRunPageRoute(experimentId ?? '', runUuid ?? '', model.artifactPath)}
            key={model.artifactPath}
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              cursor: 'pointer',
              height: shouldDisplayArtifactPaths && index > 0 ? theme.general.heightBase : theme.general.heightSm,
            }}
          >
            <ModelsIcon />
            <div>
              {getModelFlavorName(model.flavors)}
              {shouldDisplayArtifactPaths && index > 0 && <Typography.Hint>{model.artifactPath}</Typography.Hint>}
            </div>
          </Link>
        );
      })}
      {loggedModelsV3.map((model, index) => {
        return (
          <Link
            to={Routes.getExperimentLoggedModelDetailsPageRoute(experimentId ?? '', model.info?.model_id ?? '')}
            key={model.info?.model_id ?? index}
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              cursor: 'pointer',
              height: shouldDisplayArtifactPaths && index > 0 ? theme.general.heightBase : theme.general.heightSm,
            }}
          >
            <ModelsIcon />
            <div>{model.info?.name}</div>
          </Link>
        );
      })}
    </Overflow>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewLoggedModelsTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewLoggedModelsTable.test.tsx
Signals: React

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, waitFor } from '../../../../common/utils/TestUtils.react18';
import type { LoggedModelProto } from '../../../types';
import { LoggedModelStatusProtoEnum, type RunInfoEntity } from '../../../types';
import type { UseGetRunQueryResponseInputs, UseGetRunQueryResponseOutputs } from '../hooks/useGetRunQuery';
import { RunViewLoggedModelsTable } from './RunViewLoggedModelsTable';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';
import { DesignSystemProvider } from '@databricks/design-system';
import { TestRouter, testRoute } from '../../../../common/utils/RoutingTestUtils';
import type { ComponentProps } from 'react';
import { QueryClient, QueryClientProvider } from '../../../../common/utils/reactQueryHooks';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // High timeout because of testing heavy data table

describe('RunViewLoggedModelsTable', () => {
  const testLoggedModels: LoggedModelProto[] = [
    'input-model-1',
    'input-model-2',
    'output-model-1',
    'output-model-2',
  ].map((modelId) => ({
    info: {
      artifact_uri: `dbfs:/databricks/mlflow/${modelId}`,
      creation_timestamp_ms: 1728322600000,
      last_updated_timestamp_ms: 1728322600000,
      source_run_id: 'run-id-1',
      experiment_id: 'test-experiment',
      model_id: modelId,
      model_type: 'Agent',
      name: `${modelId}-name`,
      tags: [],
      status_message: 'Ready',
      status: LoggedModelStatusProtoEnum.LOGGED_MODEL_READY,
      registrations: [],
    },
    data: {},
  }));

  const inputs: UseGetRunQueryResponseInputs = {
    __typename: 'MlflowRunInputs',
    datasetInputs: null,
    modelInputs: [
      { __typename: 'MlflowModelInput', modelId: 'input-model-1' },
      { __typename: 'MlflowModelInput', modelId: 'input-model-2' },
    ],
  };

  const outputs: UseGetRunQueryResponseOutputs = {
    __typename: 'MlflowRunOutputs',
    modelOutputs: [
      { __typename: 'MlflowModelOutput', modelId: 'output-model-1', step: '2' },
      { __typename: 'MlflowModelOutput', modelId: 'output-model-2', step: '7' },
    ],
  };
  const runInfo: RunInfoEntity = {
    runUuid: 'run-id',
    experimentId: 'experiment-id',
    startTime: 0,
    endTime: 1,
    artifactUri: '',
    lifecycleStage: 'active',
    status: 'FINISHED',
    runName: 'run-name',
  };

  const renderTestComponent = (props: Partial<ComponentProps<typeof RunViewLoggedModelsTable>> = {}) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <RunViewLoggedModelsTable
        inputs={inputs}
        outputs={outputs}
        runInfo={runInfo}
        loggedModelsV3={testLoggedModels}
        isLoadingLoggedModels={false}
        {...props}
      />,
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            <TestApolloProvider>
              <DesignSystemProvider>
                <IntlProvider locale="en">
                  <TestRouter routes={[testRoute(<>{children}</>)]} />
                </IntlProvider>
              </DesignSystemProvider>
            </TestApolloProvider>
          </QueryClientProvider>
        ),
      },
    );
  };
  it('renders a table with logged models', async () => {
    const { getByText, getByRole, queryByText, getAllByRole } = renderTestComponent();

    await waitFor(() => {
      expect(getByText(/Logged models \(\d+\)/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(queryByText('Models loading')).not.toBeInTheDocument();
    });

    expect(getByRole('grid')).toBeInTheDocument();

    // Wait for the first cell to appear
    await waitFor(() => {
      expect(getByRole('gridcell', { name: /input-model-1-name/ })).toBeInTheDocument();
    });

    // Assert that all cells are rendered
    expect(getByRole('gridcell', { name: /input-model-2-name/ })).toBeInTheDocument();
    expect(getByRole('gridcell', { name: /output-model-1-name/ })).toBeInTheDocument();
    expect(getByRole('gridcell', { name: /output-model-2-name/ })).toBeInTheDocument();

    expect(getAllByRole('gridcell', { name: 'Input' })).toHaveLength(2);
    expect(getAllByRole('gridcell', { name: 'Output' })).toHaveLength(2);
  });

  it('renders corresponding steps for logged models', async () => {
    const { getByRole } = renderTestComponent();

    // Wait for the first cell to appear
    await waitFor(() => {
      expect(getByRole('gridcell', { name: /output-model-1-name/ })).toBeInTheDocument();
    });

    const [outputModelOneRow, outputModelTwoRow] = [/output-model-1-name/, /output-model-2-name/].map(
      (cellContent) => getByRole('gridcell', { name: cellContent }).closest('[role="row"]') as HTMLElement,
    );

    // Due to lack of accessibility labels in ag-grid, we are using column IDs
    const stepColId = getByRole('columnheader', { name: 'Step' }).getAttribute('col-id');

    expect(outputModelOneRow.querySelector(`[col-id="${stepColId}"]`)).toHaveTextContent('2');
    expect(outputModelTwoRow.querySelector(`[col-id="${stepColId}"]`)).toHaveTextContent('7');
  });

  it('renders error message when  provided', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText, queryByText } = renderTestComponent({
      loggedModelsError: new Error('Something went wrong.'),
    });

    await waitFor(() => {
      expect(getByText(/Logged models \(\d+\)/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(queryByText('Models loading')).not.toBeInTheDocument();
    });

    expect(getByText('Something went wrong.')).toBeInTheDocument();

    jest.restoreAllMocks();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewLoggedModelsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewLoggedModelsTable.tsx
Signals: React

```typescript
import {
  Alert,
  Button,
  ColumnsIcon,
  getShadowScrollStyles,
  Spacer,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCombinedRunInputsOutputsModels } from '../../../hooks/logged-models/useCombinedRunInputsOutputsModels';
import type { LoggedModelProto, RunInfoEntity } from '../../../types';
import { ExperimentLoggedModelListPageTable } from '../../experiment-logged-models/ExperimentLoggedModelListPageTable';
import {
  ExperimentLoggedModelListPageKnownColumns,
  useExperimentLoggedModelListPageTableColumns,
} from '../../experiment-logged-models/hooks/useExperimentLoggedModelListPageTableColumns';
import { ExperimentLoggedModelOpenDatasetDetailsContextProvider } from '../../experiment-logged-models/hooks/useExperimentLoggedModelOpenDatasetDetails';
import type {
  UseGetRunQueryResponseInputs,
  UseGetRunQueryResponseOutputs,
  UseGetRunQueryResponseRunInfo,
} from '../hooks/useGetRunQuery';
import { ExperimentLoggedModelListPageColumnSelector } from '../../experiment-logged-models/ExperimentLoggedModelListPageColumnSelector';

const supportedAttributeColumnKeys = [
  ExperimentLoggedModelListPageKnownColumns.RelationshipType,
  ExperimentLoggedModelListPageKnownColumns.Step,
  ExperimentLoggedModelListPageKnownColumns.Name,
  ExperimentLoggedModelListPageKnownColumns.Status,
  ExperimentLoggedModelListPageKnownColumns.CreationTime,
  ExperimentLoggedModelListPageKnownColumns.RegisteredModels,
  ExperimentLoggedModelListPageKnownColumns.Dataset,
];

export const RunViewLoggedModelsTable = ({
  inputs,
  outputs,
  runInfo,
  loggedModelsV3,
  isLoadingLoggedModels = false,
  loggedModelsError,
}: {
  inputs?: UseGetRunQueryResponseInputs;
  outputs?: UseGetRunQueryResponseOutputs;
  runInfo?: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  loggedModelsV3: LoggedModelProto[];
  isLoadingLoggedModels?: boolean;
  loggedModelsError?: Error;
}) => {
  const { theme } = useDesignSystemTheme();

  const { models: loggedModels } = useCombinedRunInputsOutputsModels(inputs, outputs, runInfo, loggedModelsV3);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const { columnDefs } = useExperimentLoggedModelListPageTableColumns({
    loggedModels: loggedModels,
    columnVisibility,
    disablePinnedColumns: true,
    disableOrderBy: true,
    supportedAttributeColumnKeys,
  });

  return (
    <div css={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div css={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={4} css={{ flexShrink: 0 }}>
          <FormattedMessage
            defaultMessage="Logged models ({length})"
            description="A header for a table of logged models displayed on the run page. The 'length' variable is being replaced with the number of displayed logged models."
            values={{ length: loggedModels.length }}
          />
        </Typography.Title>
        <ExperimentLoggedModelListPageColumnSelector
          columnDefs={columnDefs}
          onUpdateColumns={setColumnVisibility}
          columnVisibility={columnVisibility}
          customTrigger={<Button componentId="mlflow.logged_model.list.columns" icon={<ColumnsIcon />} />}
        />
      </div>
      <Spacer size="sm" shrinks={false} />
      <div
        css={{
          padding: theme.spacing.sm,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.general.borderRadiusBase,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {loggedModelsError instanceof Error && loggedModelsError.message && (
          <>
            <Alert
              type="error"
              description={loggedModelsError.message}
              message={
                <FormattedMessage
                  defaultMessage="Error loading logged models"
                  description="Error message displayed in the experiment run details page when loading logged models fails"
                />
              }
              closable={false}
              componentId="mlflow.run_page.logged_model.list.error"
            />
            <Spacer size="sm" shrinks={false} />
          </>
        )}
        <ExperimentLoggedModelOpenDatasetDetailsContextProvider>
          <ExperimentLoggedModelListPageTable
            columnDefs={columnDefs}
            loggedModels={loggedModels}
            columnVisibility={columnVisibility}
            isLoading={isLoadingLoggedModels}
            isLoadingMore={false}
            moreResultsAvailable={false}
            disableLoadMore
            css={getTableTheme(theme)}
            displayShowExampleButton={false}
          />
        </ExperimentLoggedModelOpenDatasetDetailsContextProvider>
      </div>
    </div>
  );
};

const getTableTheme = (theme: Theme) => ({
  '&.ag-theme-balham': {
    '--ag-border-color': theme.colors.border,
    '--ag-row-border-color': theme.colors.border,
    '--ag-foreground-color': theme.colors.textPrimary,
    '--ag-background-color': 'transparent',
    '--ag-odd-row-background-color': 'transparent',
    '--ag-row-hover-color': theme.colors.actionDefaultBackgroundHover,
    '--ag-selected-row-background-color': theme.colors.actionDefaultBackgroundPress,
    '--ag-header-foreground-color': theme.colors.textPrimary,
    '--ag-header-background-color': theme.colors.backgroundPrimary,
    '--ag-modal-overlay-background-color': theme.colors.overlayOverlay,
    '.ag-header-row.ag-header-row-column-group': {
      '--ag-header-foreground-color': theme.colors.textPrimary,
    },
    borderTop: 0,
    fontSize: theme.typography.fontSizeBase,
    '.ag-center-cols-viewport': {
      ...getShadowScrollStyles(theme, {
        orientation: 'horizontal',
      }),
    },
  },
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewMetricsTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewMetricsTable.test.tsx

```typescript
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { keyBy } from 'lodash';
import { renderWithIntl, fastFillInput, act, screen, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { LoggedModelProto, MetricEntitiesByName, RunInfoEntity } from '../../../types';
import { RunViewMetricsTable } from './RunViewMetricsTable';
import { MemoryRouter } from '../../../../common/utils/RoutingUtils';

// Larger timeout for integration testing (table rendering)
// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000);

const testRunUuid = 'test-run-uuid';
const testRunName = 'Test run name';
const testExperimentId = '12345';

const testRunInfo = {
  experimentId: testExperimentId,
  lifecycleStage: 'active',
  runName: testRunName,
  runUuid: testRunUuid,
} as RunInfoEntity;

// Generates array of metric_a1, metric_a2, ..., metric_b2, ..., metric_c3 metric keys with values from 1.0 to 9.0
const sampleLatestMetrics = keyBy(
  ['a', 'b', 'c'].flatMap((letter, letterIndex) =>
    [1, 2, 3].map((digit, digitIndex) => ({
      key: `metric_${letter}${digit}`,
      value: (letterIndex * 3 + digitIndex + 1).toFixed(1),
    })),
  ),
  'key',
) as any;

describe('RunViewMetricsTable', () => {
  const renderComponent = (
    latestMetrics: MetricEntitiesByName = sampleLatestMetrics,
    loggedModels?: LoggedModelProto[],
  ) => {
    return renderWithIntl(
      <MemoryRouter>
        <RunViewMetricsTable runInfo={testRunInfo} latestMetrics={latestMetrics} loggedModels={loggedModels} />
      </MemoryRouter>,
    );
  };

  test('Renders the table with no metrics recorded', () => {
    renderComponent({});
    expect(screen.getByText('No metrics recorded')).toBeInTheDocument();
  });
  test('Renders the table with values and filters values', async () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Metrics (9)' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'metric_a1 1.0' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'metric_c3 9.0' })).toBeInTheDocument();

    // Expect 10 rows for 9 metrics and 1 table header
    expect(screen.getAllByRole('row')).toHaveLength(9 + 1);

    // Change the filter query
    await fastFillInput(screen.getByRole('textbox'), 'metric_a');

    // Expect 4 rows for 3 filtered metrics and 1 table header
    expect(screen.getAllByRole('row')).toHaveLength(3 + 1);

    // Change the filter query
    await fastFillInput(screen.getByRole('textbox'), 'metric_xyz');

    // Expect no result rows, a header row and a message
    expect(screen.queryAllByRole('row')).toHaveLength(0 + 1);
    expect(screen.getByText('No metrics match the search filter')).toBeInTheDocument();
  });
  test('Renders the table with system and model metrics', async () => {
    renderComponent({
      'system/system_metric_abc': { key: 'system/system_metric_abc', value: 'system_value_1' },
      'system/system_metric_xyz': { key: 'system/system_metric_xyz', value: 'system_value_2' },
      model_metric_1: { key: 'model_metric_abc', value: 'model_value_abc' },
      model_metric_2: { key: 'model_metric_xyz', value: 'model_value_xyz' },
    } as any);
    expect(screen.getByRole('heading', { name: 'Metrics (4)' })).toBeInTheDocument();

    // Expect 7 rows: 4 rows for metrics, 2 header rows for sections (system and model) and 1 header row for table
    expect(screen.getAllByRole('row')).toHaveLength(4 + 2 + 1);
    expect(screen.getByRole('cell', { name: /^System metrics/ })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /^Model metrics/ })).toBeInTheDocument();

    // Change the filter query
    await fastFillInput(screen.getByRole('textbox'), 'system_');

    // Expect 4 rows: 2 rows for metrics, 1 header row for sections (system) and 1 header row for table
    expect(screen.getAllByRole('row')).toHaveLength(2 + 1 + 1);
    expect(screen.queryByRole('cell', { name: /^System metrics/ })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: /^Model metrics/ })).not.toBeInTheDocument();

    // Change the filter query
    await fastFillInput(screen.getByRole('textbox'), 'foo-bar-abc-xyz');

    // Expect no result rows, a header row and a message
    expect(screen.queryAllByRole('row')).toHaveLength(0 + 1);
    expect(screen.getByText('No metrics match the search filter')).toBeInTheDocument();
  });
  test('Renders the table with logged models', () => {
    renderComponent(sampleLatestMetrics, [
      {
        data: { metrics: [sampleLatestMetrics['metric_a2']] },
        info: { name: 'model_a2', model_id: 'm-a2' },
      },
      {
        data: { metrics: [sampleLatestMetrics['metric_c1']] },
        info: { name: 'model_c1', model_id: 'm-c1' },
      },
    ]);
    const rowWithMetricA2 = screen.getByRole('row', { name: /metric_a2/ });
    const rowWithMetricC1 = screen.getByRole('row', { name: /metric_c1/ });

    expect(within(rowWithMetricA2).getByRole('link', { name: 'model_a2' })).toHaveAttribute(
      'href',
      expect.stringMatching(/models\/m-a2/),
    );

    expect(within(rowWithMetricC1).getByRole('link', { name: 'model_c1' })).toHaveAttribute(
      'href',
      expect.stringMatching(/models\/m-c1/),
    );
  });
});
```

--------------------------------------------------------------------------------

````

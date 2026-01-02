---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 468
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 468 of 991)

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

---[FILE: ExperimentLoggedModelDetailsOverview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsOverview.tsx
Signals: React

```typescript
import { Alert, GenericSkeleton, Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { LoggedModelProto } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { DetailsOverviewMetadataTable } from '../DetailsOverviewMetadataTable';
import { DetailsOverviewMetadataRow } from '../DetailsOverviewMetadataRow';
import { FormattedMessage } from 'react-intl';
import { ExperimentLoggedModelTableDateCell } from './ExperimentLoggedModelTableDateCell';
import { ExperimentLoggedModelStatusIndicator } from './ExperimentLoggedModelStatusIndicator';
import { DetailsOverviewCopyableIdBox } from '../DetailsOverviewCopyableIdBox';
import { ExperimentLoggedModelDescription } from './ExperimentLoggedModelDescription';
import { DetailsOverviewParamsTable } from '../DetailsOverviewParamsTable';
import { useMemo } from 'react';
import { isEmpty, keyBy } from 'lodash';
import { ExperimentLoggedModelDetailsMetricsTable } from './ExperimentLoggedModelDetailsMetricsTable';
import { ExperimentLoggedModelDetailsPageRunsTable } from './ExperimentLoggedModelDetailsRunsTable';
import { ExperimentLoggedModelDetailsPageLinkedPromptsTable } from './ExperimentLoggedModelDetailsPageLinkedPromptsTable';
import { useRelatedRunsDataForLoggedModels } from '../../hooks/logged-models/useRelatedRunsDataForLoggedModels';
import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import { ExperimentLoggedModelAllDatasetsList } from './ExperimentLoggedModelAllDatasetsList';
import { ExperimentLoggedModelOpenDatasetDetailsContextProvider } from './hooks/useExperimentLoggedModelOpenDatasetDetails';
import { ExperimentLoggedModelDetailsModelVersionsList } from './ExperimentLoggedModelDetailsModelVersionsList';
import { ExperimentLoggedModelSourceBox } from './ExperimentLoggedModelSourceBox';
import { DetailsPageLayout } from '../../../common/components/details-page-layout/DetailsPageLayout';
import { useExperimentLoggedModelDetailsMetadataV2 } from './hooks/useExperimentLoggedModelDetailsMetadataV2';
import { ExperimentKind, MLFLOW_LOGGED_MODEL_USER_TAG } from '../../constants';

export const ExperimentLoggedModelDetailsOverview = ({
  onDataUpdated,
  loggedModel,
  experimentKind,
}: {
  onDataUpdated: () => void | Promise<any>;
  loggedModel?: LoggedModelProto;
  experimentKind?: ExperimentKind;
}) => {
  const { theme } = useDesignSystemTheme();
  const shouldRenderLinkedPromptsTable = experimentKind === ExperimentKind.GENAI_DEVELOPMENT;

  // Fetch related runs data for the logged model
  const {
    data: relatedRunsData,
    loading: relatedRunsLoading,
    error: relatedRunsDataError,
  } = useRelatedRunsDataForLoggedModels({ loggedModels: loggedModel ? [loggedModel] : [] });

  const relatedSourceRun = useMemo(
    () => relatedRunsData?.find((r) => r.info?.runUuid === loggedModel?.info?.source_run_id),
    [loggedModel?.info?.source_run_id, relatedRunsData],
  );

  const paramsDictionary = useMemo(
    () =>
      keyBy(
        (loggedModel?.data?.params ?? []).filter(({ key, value }) => !isEmpty(key) && !isEmpty(value)),
        'key',
      ) as Record<string, KeyValueEntity>,
    [loggedModel?.data?.params],
  );

  const renderDetails = () => {
    if (!loggedModel) {
      return null;
    }
    return (
      <DetailsOverviewMetadataTable>
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Created at"
              description="Label for the creation timestamp of a logged model on the logged model details page"
            />
          }
          value={<ExperimentLoggedModelTableDateCell value={loggedModel.info?.creation_timestamp_ms} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Created by"
              description="Label for the creator of a logged model on the logged model details page"
            />
          }
          value={loggedModel.info?.tags?.find((tag) => tag.key === MLFLOW_LOGGED_MODEL_USER_TAG)?.value ?? '-'}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Status"
              description="Label for the status of a logged model on the logged model details page"
            />
          }
          value={<ExperimentLoggedModelStatusIndicator data={loggedModel} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Model ID"
              description="Label for the model ID of a logged model on the logged model details page"
            />
          }
          value={<DetailsOverviewCopyableIdBox value={loggedModel.info?.model_id ?? ''} />}
        />
        {/* If the logged model has a source run, display the source run name after its loaded */}
        {loggedModel.info?.source_run_id &&
          loggedModel.info?.experiment_id &&
          (relatedRunsLoading || relatedSourceRun) && (
            <DetailsOverviewMetadataRow
              title={
                <FormattedMessage
                  defaultMessage="Source run"
                  description="Label for the source run name of a logged model on the logged model details page"
                />
              }
              value={
                // Display a skeleton while loading
                relatedRunsLoading ? (
                  <GenericSkeleton css={{ width: 200, height: theme.spacing.md }} />
                ) : (
                  <Link to={Routes.getRunPageRoute(loggedModel.info?.experiment_id, loggedModel.info?.source_run_id)}>
                    {relatedSourceRun?.info?.runName}
                  </Link>
                )
              }
            />
          )}
        {loggedModel.info?.source_run_id && (
          <DetailsOverviewMetadataRow
            title={
              <FormattedMessage
                defaultMessage="Source run ID"
                description="Label for the source run ID of a logged model on the logged model details page"
              />
            }
            value={<DetailsOverviewCopyableIdBox value={loggedModel.info?.source_run_id ?? ''} />}
          />
        )}
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Logged from"
              description="Label for the source (where it was logged from) of a logged model on the logged model details page. It can be e.g. a notebook or a file."
            />
          }
          value={<ExperimentLoggedModelSourceBox loggedModel={loggedModel} displayDetails />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Datasets used"
              description="Label for the datasets used by a logged model on the logged model details page"
            />
          }
          value={<ExperimentLoggedModelAllDatasetsList loggedModel={loggedModel} />}
        />
        <DetailsOverviewMetadataRow
          title={
            <FormattedMessage
              defaultMessage="Model versions"
              description="Label for the model versions of a logged model on the logged model details page"
            />
          }
          value={<ExperimentLoggedModelDetailsModelVersionsList loggedModel={loggedModel} />}
        />
      </DetailsOverviewMetadataTable>
    );
  };

  const detailsSectionsV2 = useExperimentLoggedModelDetailsMetadataV2({
    loggedModel,
    relatedRunsLoading,
    relatedSourceRun,
  });

  return (
    <ExperimentLoggedModelOpenDatasetDetailsContextProvider>
      <DetailsPageLayout css={{ flex: 1 }} usingSidebarLayout secondarySections={detailsSectionsV2} sidebarSize="sm">
        <ExperimentLoggedModelDescription loggedModel={loggedModel} onDescriptionChanged={onDataUpdated} />

        {relatedRunsDataError?.message && (
          <>
            <Alert
              closable={false}
              message={
                <FormattedMessage
                  defaultMessage="Error when fetching related runs data: {error}"
                  description="Error message displayed when logged model details page couldn't fetch related runs data"
                  values={{
                    error: relatedRunsDataError.message,
                  }}
                />
              }
              type="error"
              componentId="mlflow.logged_model.details.related_runs.error"
            />
            <Spacer size="md" />
          </>
        )}
        <div
          css={[
            {
              display: 'flex',
              flexDirection: 'column',
            },
            {
              gap: theme.spacing.lg,
              overflow: 'hidden',
              // add some bottom padding so the user can interact with the
              // last table closer to the center of the page
              paddingBottom: theme.spacing.lg * 3,
            },
          ]}
        >
          <ExperimentLoggedModelDetailsMetricsTable
            loggedModel={loggedModel}
            relatedRunsLoading={relatedRunsLoading}
            relatedRunsData={relatedRunsData ?? undefined}
          />
          <DetailsOverviewParamsTable params={paramsDictionary} />
          <ExperimentLoggedModelDetailsPageRunsTable
            loggedModel={loggedModel}
            relatedRunsLoading={relatedRunsLoading}
            relatedRunsData={relatedRunsData ?? undefined}
          />
          {shouldRenderLinkedPromptsTable && (
            <ExperimentLoggedModelDetailsPageLinkedPromptsTable loggedModel={loggedModel} />
          )}
        </div>
      </DetailsPageLayout>
    </ExperimentLoggedModelOpenDatasetDetailsContextProvider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsPageLinkedPromptsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsPageLinkedPromptsTable.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import type { LoggedModelProto } from '../../types';
import { ExperimentLinkedPromptsTable } from '../experiment-prompts/ExperimentLinkedPromptsTable';
import { MLFLOW_LINKED_PROMPTS_TAG } from '../../constants';

interface Props {
  loggedModel?: LoggedModelProto;
}

export const ExperimentLoggedModelDetailsPageLinkedPromptsTable = ({ loggedModel }: Props) => {
  const tags = loggedModel?.info?.tags;
  const experimentId = loggedModel?.info?.experiment_id ?? '';
  const linkedPromptsTag = tags?.find(({ key }) => key === MLFLOW_LINKED_PROMPTS_TAG);
  const rawLinkedPrompts: { name: string; version: string }[] = useMemo(() => {
    try {
      return JSON.parse(linkedPromptsTag?.value ?? '[]');
    } catch (e) {
      // fail gracefully, just don't show any linked prompts
      return [];
    }
  }, [linkedPromptsTag]);

  const data = useMemo(
    () => rawLinkedPrompts.map((prompt) => ({ ...prompt, experimentId })),
    [rawLinkedPrompts, experimentId],
  );

  return <ExperimentLinkedPromptsTable data={data} />;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsRegisterButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsRegisterButton.tsx
Signals: React

```typescript
import { FormattedMessage, useIntl } from 'react-intl';
import type { LoggedModelProto } from '../../types';
import { RegisterModel } from '../../../model-registry/components/RegisterModel';
import { useCallback } from 'react';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { CopyButton } from '../../../shared/building_blocks/CopyButton';
import { CopyIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useValidateLoggedModelSignature } from './hooks/useValidateLoggedModelSignature';
import Utils from '../../../common/utils/Utils';

const RegisterLoggedModelInUCCodeSnippet = ({ modelId }: { modelId: string }) => {
  const { theme } = useDesignSystemTheme();

  const code = `import mlflow

mlflow.set_registry_uri("databricks-uc")

model_uri = "models:/${modelId}"
model_name = "main.default.my_model"

mlflow.register_model(model_uri=model_uri, name=model_name)
`;

  return (
    <div>
      <Typography.Text>
        <FormattedMessage
          defaultMessage="In order to register model in Unity Catalog, copy and run the following code in the notebook:"
          description="Instruction to register model in Unity Catalog on the logged model details page"
        />
      </Typography.Text>
      <div css={{ position: 'relative' }}>
        <CopyButton
          css={{ zIndex: 1, position: 'absolute', top: theme.spacing.sm, right: theme.spacing.sm }}
          showLabel={false}
          copyText={code}
          icon={<CopyIcon />}
        />
        <CodeSnippet
          showLineNumbers
          style={{
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
          }}
          language="python"
        >
          {code}
        </CodeSnippet>
      </div>
    </div>
  );
};

export const ExperimentLoggedModelDetailsRegisterButton = ({
  loggedModel,
  onSuccess,
}: {
  loggedModel?: LoggedModelProto | null;
  onSuccess?: () => void;
}) => {
  const intl = useIntl();
  const handleSuccess = useCallback(
    (data?: { value: { status?: string } }) => {
      onSuccess?.();
      const successTitle = intl.formatMessage({
        defaultMessage: 'Model registered successfully',
        description: 'Notification title for model registration succeeded on the logged model details page',
      });
      Utils.displayGlobalInfoNotification(`${successTitle} ${data?.value?.status ?? ''}`);
    },
    [intl, onSuccess],
  );

  const handleError = useCallback(
    (error?: Error | ErrorWrapper) => {
      const errorTitle = intl.formatMessage({
        defaultMessage: 'Error registering model',
        description: 'Notification title for model registration failure on the logged model details page',
      });
      const message = (error instanceof ErrorWrapper ? error.getMessageField() : error?.message) ?? String(error);
      Utils.displayGlobalErrorNotification(`${errorTitle} ${message}`);
    },
    [intl],
  );

  /**
   * Function that validates that the model file is valid to be registered in UC (contains signature inputs and outputs),
   * passed to the RegisterModel component.
   */
  const modelFileValidationFn = useValidateLoggedModelSignature(loggedModel);

  if (!loggedModel?.info?.artifact_uri || !loggedModel.info.model_id) {
    return null;
  }

  return (
    <RegisterModel
      modelPath={loggedModel.info.artifact_uri}
      modelRelativePath=""
      disabled={false}
      loggedModelId={loggedModel.info.model_id}
      buttonType="primary"
      showButton
      onRegisterSuccess={handleSuccess}
      onRegisterFailure={handleError}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsRunsTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsRunsTable.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import type { LoggedModelProto, RunEntity } from '../../types';
import { ExperimentLoggedModelDetailsPageRunsTable } from './ExperimentLoggedModelDetailsRunsTable';
import { testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';

describe('ExperimentLoggedModelDetailsRunsTable', () => {
  const relatedRuns: RunEntity[] = [1, 2, 3].map(
    (i) =>
      ({
        data: {},
        info: {
          runName: `test-run-name-${i}`,
          runUuid: `test-run-id-${i}`,
        },
      } as any),
  );
  const testLoggedModelMetrics: LoggedModelProto = {
    info: {
      source_run_id: 'test-run-id-2',
      model_id: 'test-model-id',
    },
    data: {
      metrics: [
        {
          run_id: 'test-run-id-1',
          key: 'test-key',
          value: 1,
          dataset_name: 'dataset-run-1',
          dataset_digest: '1',
          model_id: 'test-model-id',
        },
        {
          run_id: 'test-run-id-2',
          key: 'test-key',
          value: 1,
          dataset_name: 'dataset-run-2',
          dataset_digest: '2',
          model_id: 'test-model-id',
        },
      ],
    },
  };

  const testLoggedModelNoMetrics: LoggedModelProto = {
    info: {
      source_run_id: 'test-run-id-2',
      model_id: 'test-model-id',
    },
  };

  const renderComponent = (loggedModel: LoggedModelProto) =>
    render(
      <IntlProvider locale="en">
        <TestRouter
          routes={[
            testRoute(
              <ExperimentLoggedModelDetailsPageRunsTable relatedRunsData={relatedRuns} loggedModel={loggedModel} />,
            ),
          ]}
        />
      </IntlProvider>,
    );

  test('should render runs extracted from metrics', async () => {
    renderComponent(testLoggedModelMetrics);

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'test-run-name-1' })).toBeVisible();
      expect(screen.getByRole('cell', { name: 'test-run-name-2' })).toBeVisible();
    });

    // We have 2 runs + 1 header row
    expect(screen.getAllByRole('row')).toHaveLength(2 + 1);
  });

  test('should render data based only on source run', async () => {
    renderComponent(testLoggedModelNoMetrics);

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'test-run-name-2' })).toBeVisible();
    });

    // We have 1 run + 1 header row
    expect(screen.getAllByRole('row')).toHaveLength(1 + 1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsRunsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsRunsTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  Empty,
  Input,
  Overflow,
  SearchIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableSkeleton,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useIntl } from 'react-intl';
import type { CellContext, ColumnDef, ColumnDefTemplate } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table';
import { entries, groupBy, isEmpty, uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { LoggedModelProto, RunEntity } from '../../types';
import { ExperimentLoggedModelDetailsTableRunCellRenderer } from './ExperimentLoggedModelDetailsTableRunCellRenderer';
import { ExperimentLoggedModelDatasetButton } from './ExperimentLoggedModelDatasetButton';
import { useExperimentTrackingDetailsPageLayoutStyles } from '../../hooks/useExperimentTrackingDetailsPageLayoutStyles';

interface RunsTableRow {
  experimentId?: string;
  runName?: string;
  runId: string;
  datasets: {
    datasetName: string;
    datasetDigest: string;
    runId: string;
  }[];
}

type RunsTableCellRenderer = ColumnDefTemplate<CellContext<RunsTableRow, unknown>>;

const DatasetListCellRenderer = ({ getValue }: CellContext<RunsTableRow, RunsTableRow['datasets']>) => {
  const datasets = getValue() ?? [];

  if (isEmpty(datasets)) {
    return <>-</>;
  }

  return (
    <Overflow>
      {datasets.map(({ datasetDigest, datasetName, runId }) => (
        <ExperimentLoggedModelDatasetButton
          datasetName={datasetName}
          datasetDigest={datasetDigest}
          runId={runId}
          key={[datasetName, datasetDigest].join('.')}
        />
      ))}
    </Overflow>
  );
};

export const ExperimentLoggedModelDetailsPageRunsTable = ({
  loggedModel,
  relatedRunsData,
  relatedRunsLoading,
}: {
  loggedModel?: LoggedModelProto;
  relatedRunsData?: RunEntity[];
  relatedRunsLoading?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const { detailsPageTableStyles, detailsPageNoEntriesStyles } = useExperimentTrackingDetailsPageLayoutStyles();
  const intl = useIntl();
  const [filter, setFilter] = useState('');

  const runsWithDatasets = useMemo(() => {
    if (relatedRunsLoading) {
      return [];
    }
    const allMetrics = loggedModel?.data?.metrics ?? [];
    const runsByDatasets = groupBy(allMetrics, 'run_id');
    if (loggedModel?.info?.source_run_id && !runsByDatasets[loggedModel.info.source_run_id]) {
      runsByDatasets[loggedModel.info.source_run_id] = [];
    }
    return entries(runsByDatasets).map(([runId, metrics]) => {
      // Locate unique dataset entries
      const distinctDatasets = uniqBy(metrics, 'dataset_name')
        .map(({ dataset_digest, dataset_name }) => ({
          datasetDigest: dataset_digest,
          datasetName: dataset_name,
          runId,
        }))
        .filter((dataset) => Boolean(dataset.datasetName) || Boolean(dataset.datasetDigest));

      const runName = relatedRunsData?.find((run) => run.info?.runUuid === runId)?.info?.runName;
      return {
        runId,
        runName,
        datasets: distinctDatasets,
        experimentId: loggedModel?.info?.experiment_id,
      };
    });
  }, [loggedModel, relatedRunsLoading, relatedRunsData]);

  const filteredRunsWithDatasets = useMemo(
    () =>
      runsWithDatasets.filter(({ runName, datasets }) => {
        const filterLower = filter.toLowerCase();
        return (
          runName?.toLowerCase().includes(filterLower) ||
          datasets.find((d) => d.datasetName?.toLowerCase().includes(filterLower))
        );
      }),
    [filter, runsWithDatasets],
  );

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'run',
        header: intl.formatMessage({
          defaultMessage: 'Run',
          description: 'Column header for the run name in the runs table on the logged model details page',
        }),
        enableResizing: true,
        size: 240,
        accessorFn: ({ runId, runName, experimentId }) => ({
          runId,
          runName,
          experimentId,
        }),
        cell: ExperimentLoggedModelDetailsTableRunCellRenderer as RunsTableCellRenderer,
      },
      {
        id: 'input',
        header: intl.formatMessage({
          defaultMessage: 'Input',
          description: 'Column header for the input in the runs table on the logged model details page',
        }),
        accessorKey: 'datasets',
        enableResizing: false,
        cell: DatasetListCellRenderer as RunsTableCellRenderer,
      },
    ],
    [intl],
  );

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsRunsTable.tsx',
    {
      data: filteredRunsWithDatasets,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getRowId: (row) => row.key,
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      columns,
    },
  );

  const renderTableContent = () => {
    if (relatedRunsLoading) {
      return <TableSkeleton lines={3} />;
    }
    if (!runsWithDatasets.length) {
      return (
        <div css={detailsPageNoEntriesStyles}>
          <Empty
            description={
              <FormattedMessage
                defaultMessage="No runs"
                description="Placeholder text for the runs table on the logged model details page when there are no runs"
              />
            }
          />
        </div>
      );
    }

    const areAllResultsFiltered = filteredRunsWithDatasets.length < 1;

    return (
      <>
        <div css={{ marginBottom: theme.spacing.sm }}>
          <Input
            componentId="mlflow.logged_model.details.runs.table.search"
            prefix={<SearchIcon />}
            placeholder={intl.formatMessage({
              defaultMessage: 'Search runs',
              description: 'Placeholder text for the search input in the runs table on the logged model details page',
            })}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            allowClear
          />
        </div>
        <Table
          scrollable
          ref={(element) => element?.setAttribute('data-testid', 'logged-model-details-runs-table')}
          empty={
            areAllResultsFiltered ? (
              <div>
                <Empty
                  description={
                    <FormattedMessage
                      defaultMessage="No runs match the search filter"
                      description="No results message for the runs table on the logged model details page"
                    />
                  }
                />
              </div>
            ) : null
          }
          css={detailsPageTableStyles}
        >
          <TableRow isHeader>
            {table.getLeafHeaders().map((header, index) => (
              <TableHeader
                componentId="mlflow.logged_model.details.runs.table.header"
                key={header.id}
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                isResizing={header.column.getIsResizing()}
                css={{
                  flexGrow: header.column.getCanResize() ? 0 : 1,
                }}
                style={{
                  flexBasis: header.column.getCanResize() ? header.column.getSize() : undefined,
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    flexGrow: cell.column.getCanResize() ? 0 : 1,
                    flexBasis: cell.column.getCanResize() ? cell.column.getSize() : undefined,
                  }}
                  multiline
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      </>
    );
  };

  return (
    <div css={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: 400 }}>
      <Typography.Title css={{ fontSize: 16 }}>Runs</Typography.Title>
      <div
        css={{
          padding: theme.spacing.sm,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.general.borderRadiusBase,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {renderTableContent()}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsTableRunCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsTableRunCellRenderer.tsx

```typescript
import type { CellContext, ColumnDefTemplate } from '@tanstack/react-table';
import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';

export const ExperimentLoggedModelDetailsTableRunCellRenderer: ColumnDefTemplate<
  CellContext<
    unknown,
    {
      runId?: string | null;
      runName?: string | null;
      experimentId?: string | null;
    }
  >
> = ({ getValue }) => {
  const { runName, runId } = getValue() ?? {};

  return <Link to={Routes.getDirectRunPageRoute(runId ?? '')}>{runName || runId}</Link>;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsTraces.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsTraces.test.tsx

```typescript
import { jest, describe, beforeAll, test, expect } from '@jest/globals';
import { rest } from 'msw';
import { IntlProvider } from 'react-intl';
import { setupServer } from '../../../common/utils/setup-msw';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';
import type { LoggedModelProto } from '../../types';
import { ExperimentLoggedModelDetailsTraces } from './ExperimentLoggedModelDetailsTraces';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';
import { DesignSystemProvider } from '@databricks/design-system';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // Larger timeout for integration testing (table rendering)

describe('ExperimentLoggedModelDetailsTraces integration test', () => {
  const queryClient = new QueryClient();
  const { history } = setupTestRouter();
  const server = setupServer(
    rest.post('/ajax-api/3.0/mlflow/traces/search', (req, res, ctx) => {
      return res(
        ctx.json({
          traces: [
            {
              trace_id: 'trace_1',
              request: '{"input": "value"}',
              response: '{"output": "value"}',
              trace_metadata: {
                user_id: 'user123',
                environment: 'production',
                'mlflow.internal.key': 'internal_value',
              },
            },
          ],
          next_page_token: undefined,
        }),
      );
    }),
  );

  const renderTestComponent = (loggedModel: LoggedModelProto) => {
    return render(<ExperimentLoggedModelDetailsTraces loggedModel={loggedModel} />, {
      wrapper: ({ children }) => (
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <IntlProvider locale="en">
              <TestRouter
                routes={[testRoute(<>{children}</>, '/experiments/:experimentId/models/:loggedModelId')]}
                history={history}
                initialEntries={[
                  `/experiments/${loggedModel.info?.experiment_id}/models/${loggedModel.info?.model_id}`,
                ]}
              />
            </IntlProvider>
          </QueryClientProvider>
        </DesignSystemProvider>
      ),
    });
  };

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  test('should fetch and display table of traces', async () => {
    renderTestComponent({
      info: {
        experiment_id: 'test-experiment',
        model_id: 'm-test-model-id',
      },
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search traces by request')).toBeInTheDocument();
    });
  });
  test('should display quickstart when model contains no traces', async () => {
    renderTestComponent({
      info: {
        experiment_id: 'test-experiment',
        model_id: 'm-some-other-model-id-with-no-traces',
      },
    });

    await waitFor(() => {
      expect(document.body.textContent).not.toBe('');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsTraces.tsx
Signals: React

```typescript
import { useEffect, useMemo, useState } from 'react';
import type { LoggedModelProto } from '../../types';
import { ExperimentLoggedModelDetailsTracesIntroductionText } from './ExperimentLoggedModelDetailsTracesIntroductionText';
import { TracesViewTableNoTracesQuickstartContextProvider } from '../traces/quickstart/TracesViewTableNoTracesQuickstartContext';
import { TracesV3Logs } from '../experiment-page/components/traces-v3/TracesV3Logs';
import { shouldUseTracesV4API } from '@databricks/web-shared/genai-traces-table';

export const ExperimentLoggedModelDetailsTraces = ({
  loggedModel,
  experimentTags,
  isLoadingExperiment,
}: {
  loggedModel: LoggedModelProto;
  experimentTags?: {
    key: string | null;
    value: string | null;
  }[];
  isLoadingExperiment?: boolean;
}) => {
  const experimentIds = useMemo(() => [loggedModel.info?.experiment_id ?? ''], [loggedModel.info?.experiment_id]);
  if (!loggedModel.info?.experiment_id) {
    return null;
  }
  return (
    <div css={{ height: '100%' }}>
      <TracesViewTableNoTracesQuickstartContextProvider
        introductionText={
          loggedModel.info?.model_id && (
            <ExperimentLoggedModelDetailsTracesIntroductionText modelId={loggedModel.info.model_id} />
          )
        }
        displayVersionWarnings={false}
      >
        {/* prettier-ignore */}
        <TracesComponent
          experimentIds={experimentIds}
          loggedModelId={loggedModel.info?.model_id}
          isLoadingExperiment={isLoadingExperiment}
        />
      </TracesViewTableNoTracesQuickstartContextProvider>
    </div>
  );
};

const TracesComponent = ({
  experimentIds,
  loggedModelId,
  isLoadingExperiment,
}: {
  experimentIds: string[];
  loggedModelId: string | undefined;
  isLoadingExperiment?: boolean;
}) => {
  // prettier-ignore
  return experimentIds.length > 0 ? (
    <TracesV3Logs
      experimentId={experimentIds[0]}
      endpointName=""
      loggedModelId={loggedModelId}
      isLoadingExperiment={isLoadingExperiment}
    />
  ) : null;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsTracesIntroductionText.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsTracesIntroductionText.tsx

```typescript
import { Alert, CopyIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { FormattedMessage } from 'react-intl';
import { CopyButton } from '../../../shared/building_blocks/CopyButton';

export const ExperimentLoggedModelDetailsTracesIntroductionText = ({ modelId }: { modelId: string }) => {
  const { theme } = useDesignSystemTheme();
  const code = `import mlflow
          
mlflow.set_active_model(model_id="${modelId}")`;

  return (
    <>
      <Typography.Paragraph>
        <FormattedMessage
          defaultMessage="This tab displays all the traces logged to this logged model. MLflow supports automatic tracing for many popular generative AI frameworks. Follow the steps below to log your first trace. For more information about MLflow Tracing, visit the <a>MLflow documentation</a>."
          description="Message that explains the function of the 'Traces' tab in logged model page. This message is followed by a tutorial explaining how to get started with MLflow Tracing."
          values={{
            a: (text: string) => (
              <Typography.Link
                componentId="mlflow.logged_model.traces.traces_table.quickstart_docs_link"
                href="https://mlflow.org/docs/latest/llms/tracing/index.html"
                openInNewTab
              >
                {text}
              </Typography.Link>
            ),
          }}
        />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FormattedMessage
          defaultMessage="You can start logging traces to this logged model by calling {code} first:"
          description='Introductory text for the code example for logging traces to an existing logged model. The code contains reference to "mlflow.set_active_model" function call'
          values={{
            code: <code>mlflow.set_active_model</code>,
          }}
        />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <div css={{ position: 'relative', width: 'min-content' }}>
          <CopyButton
            componentId="mlflow.logged_model.traces.traces_table.set_active_model_quickstart_snippet_copy"
            css={{ zIndex: 1, position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
            showLabel={false}
            copyText={code}
            icon={<CopyIcon />}
          />
          <CodeSnippet
            showLineNumbers
            theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
            style={{
              padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            }}
            language="python"
          >
            {code}
          </CodeSnippet>
        </div>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FormattedMessage
          defaultMessage="Next, you can log traces to this logged model depending on your framework:"
          description="Introductory text for the code example for logging traces to an existing logged model. This part is displayed after the code example for setting the active model."
        />
      </Typography.Paragraph>
    </>
  );
};
```

--------------------------------------------------------------------------------

````

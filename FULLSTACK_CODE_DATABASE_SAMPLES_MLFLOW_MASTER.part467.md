---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 467
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 467 of 991)

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

---[FILE: ExperimentLoggedModelDescription.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDescription.tsx
Signals: React

```typescript
import { useState } from 'react';
import { EditableNote } from '../../../common/components/EditableNote';
import type { LoggedModelProto } from '../../types';
import { NOTE_CONTENT_TAG } from '../../utils/NoteUtils';
import { Button, PencilIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import { usePatchLoggedModelsTags } from '../../hooks/logged-models/usePatchLoggedModelsTags';
import { useUserActionErrorHandler } from '@databricks/web-shared/metrics';

/**
 * Displays editable description section in logged model detail overview.
 */
export const ExperimentLoggedModelDescription = ({
  loggedModel,
  onDescriptionChanged,
}: {
  loggedModel?: LoggedModelProto;
  onDescriptionChanged: () => void | Promise<void>;
}) => {
  const descriptionContent = loggedModel?.info?.tags?.find((tag) => tag.key === NOTE_CONTENT_TAG)?.value ?? undefined;

  const [showNoteEditor, setShowDescriptionEditor] = useState(false);
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const { patch } = usePatchLoggedModelsTags({ loggedModelId: loggedModel?.info?.model_id });
  const { handleError } = useUserActionErrorHandler();

  const handleSubmitEditDescription = async (markdown: string) => {
    try {
      await patch({ [NOTE_CONTENT_TAG]: markdown });
      await onDescriptionChanged();
      setShowDescriptionEditor(false);
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleCancelEditDescription = () => setShowDescriptionEditor(false);

  const isEmpty = !descriptionContent;

  return (
    <div css={{ marginBottom: theme.spacing.md }}>
      <Typography.Title level={4} css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
        <FormattedMessage
          defaultMessage="Description"
          description="Label for descriptions section on the logged models details page"
        />
        <Button
          componentId="mlflow.logged_models.details.description.edit"
          size="small"
          type="tertiary"
          aria-label={intl.formatMessage({
            defaultMessage: 'Edit description',
            description: 'Label for the edit description button on the logged models details page',
          })}
          onClick={() => setShowDescriptionEditor(true)}
          icon={<PencilIcon />}
        />
      </Typography.Title>
      {isEmpty && !showNoteEditor && (
        <Typography.Hint>
          <FormattedMessage
            defaultMessage="No description"
            description="Placeholder text when no description is provided for the logged model displayed in the logged models details page"
          />
        </Typography.Hint>
      )}
      {(!isEmpty || showNoteEditor) && (
        <EditableNote
          defaultMarkdown={descriptionContent}
          onSubmit={handleSubmitEditDescription}
          onCancel={handleCancelEditDescription}
          showEditor={showNoteEditor}
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsArtifacts.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsArtifacts.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeAll, test, expect } from '@jest/globals';
import { DesignSystemProvider } from '@databricks/design-system';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { setupServer } from '../../../common/utils/setup-msw';
import { render, waitFor } from '../../../common/utils/TestUtils.react18';
import { apis, artifactsByRunUuid } from '../../reducers/Reducers';
import { ExperimentLoggedModelDetailsArtifacts } from './ExperimentLoggedModelDetailsArtifacts';
import { setupTestRouter, testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';

describe('ExperimentLoggedModelDetailsArtifacts integration test', () => {
  const { history } = setupTestRouter();
  const server = setupServer(
    rest.get('/ajax-api/2.0/mlflow/logged-models/:modelId/artifacts/directories', (req, res, ctx) =>
      res(
        ctx.json({
          root_uri: 'dbfs:/databricks/mlflow-tracking/123/logged_models/test-model-id/artifacts',
          files: [
            {
              path: 'conda.yaml',
              is_dir: false,
              file_size: 123,
            },
            {
              path: 'requirements.txt',
              is_dir: false,
              file_size: 234,
            },
          ],
        }),
      ),
    ),
    rest.get('/ajax-api/2.0/mlflow/logged-models/:modelId/artifacts/files', (req, res, ctx) =>
      res(ctx.text('this is text file content of ' + req.url.searchParams.get('artifact_file_path'))),
    ),
    rest.get('/get-artifact', (req, res, ctx) =>
      res(ctx.text('this is text file content of ' + req.url.searchParams.get('path'))),
    ),
  );

  const renderTestComponent = () => {
    const loggedModel = {
      info: {
        model_id: 'test-model-id',
        artifact_uri: 'dbfs:/databricks/mlflow-tracking/123/logged_models/test-model-id/artifacts',
      },
    };

    const store = createStore(
      combineReducers({
        entities: combineReducers({
          artifactsByRunUuid,
          modelVersionsByModel: () => ({}),
        }),
        apis,
      }),
      {},
      compose(applyMiddleware(thunk, promiseMiddleware())),
    );

    return render(<ExperimentLoggedModelDetailsArtifacts loggedModel={loggedModel} />, {
      wrapper: ({ children }) => (
        <DesignSystemProvider>
          <IntlProvider locale="en">
            <Provider store={store}>
              <TestRouter routes={[testRoute(<>{children}</>)]} history={history} />
            </Provider>
          </IntlProvider>
        </DesignSystemProvider>
      ),
    });
  };

  beforeAll(() => {
    process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] = 'true';
    server.listen();
  });

  test('should render list of artifacts and display file contents', async () => {
    const { getByText } = renderTestComponent();

    await waitFor(() => {
      expect(getByText('requirements.txt')).toBeInTheDocument();
      expect(getByText('conda.yaml')).toBeInTheDocument();
    });

    await userEvent.click(getByText('requirements.txt'));

    await waitFor(() => {
      expect(getByText('this is text file content of requirements.txt')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsArtifacts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsArtifacts.tsx

```typescript
import type { LoggedModelProto } from '../../types';
import ArtifactPage from '../ArtifactPage';

export const ExperimentLoggedModelDetailsArtifacts = ({ loggedModel }: { loggedModel: LoggedModelProto }) => {
  return (
    <div css={{ height: '100%', overflow: 'hidden', display: 'flex' }}>
      <ArtifactPage
        isLoggedModelsMode
        loggedModelId={loggedModel.info?.model_id ?? ''}
        artifactRootUri={loggedModel?.info?.artifact_uri ?? ''}
        useAutoHeight
        experimentId={loggedModel?.info?.experiment_id ?? ''}
        entityTags={loggedModel?.info?.tags}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsHeader.tsx

```typescript
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import { PageHeader } from '../../../shared/building_blocks/PageHeader';
import {
  Button,
  DropdownMenu,
  GenericSkeleton,
  Icon,
  OverflowIcon,
  Tag,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { UseGetExperimentQueryResultExperiment } from '../../hooks/useExperimentQuery';
import type { LoggedModelProto } from '../../types';
import { ExperimentLoggedModelDetailsRegisterButton } from './ExperimentLoggedModelDetailsRegisterButton';
import { ExperimentPageTabName } from '../../constants';
import { useExperimentLoggedModelDeleteModal } from './hooks/useExperimentLoggedModelDeleteModal';
import { LoggedModelIcon } from './assets/LoggedModelIcon';
import { isEmpty } from 'lodash';
import { useExperimentLoggedModelRegisteredVersions } from './hooks/useExperimentLoggedModelRegisteredVersions';

export const ExperimentLoggedModelDetailsHeader = ({
  experimentId,
  experiment,
  loading = false,
  loggedModel,
  onSuccess,
}: {
  experimentId: string;
  experiment?: UseGetExperimentQueryResultExperiment;
  loading?: boolean;
  loggedModel?: LoggedModelProto | null;
  onSuccess?: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const modelDisplayName = loggedModel?.info?.name;
  const navigate = useNavigate();
  const intl = useIntl();

  const { modalElement: DeleteModalElement, openModal } = useExperimentLoggedModelDeleteModal({
    loggedModel,
    onSuccess: () => {
      navigate(Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Models));
    },
  });

  const { modelVersions } = useExperimentLoggedModelRegisteredVersions({
    loggedModels: loggedModel ? [loggedModel] : [],
  });

  const modelIsNotRegistered = isEmpty(modelVersions);

  const getExperimentName = () => {
    if (experiment && 'name' in experiment) {
      return experiment?.name;
    }
    return experimentId;
  };

  const breadcrumbs = [
    // eslint-disable-next-line react/jsx-key
    <Link to={Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Models)}>
      {getExperimentName()}
    </Link>,
    // eslint-disable-next-line react/jsx-key
    <Link to={Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Models)}>
      <FormattedMessage
        defaultMessage="Models"
        description="Breadcrumb for models tab of experiments page on the logged model details page"
      />
    </Link>,
  ];

  return (
    <div css={{ flexShrink: 0 }}>
      {loading ? (
        <ExperimentLoggedModelDetailsHeaderSkeleton />
      ) : (
        <PageHeader
          title={
            modelIsNotRegistered ? (
              <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center', justifyContent: 'flex-start' }}>
                <ExperimentLoggedModelDetailsHeaderIcon />
                <span>{modelDisplayName}</span>
                <Tag
                  color="brown"
                  componentId="mlflow.logged_model.details.not_registered_tag"
                  css={{ marginRight: 0 }}
                >
                  {intl.formatMessage({
                    defaultMessage: 'Not registered',
                    description: 'Tag for not registered model on the logged model details page',
                  })}
                </Tag>
              </div>
            ) : (
              <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <ExperimentLoggedModelDetailsHeaderIcon />
                <span>{modelDisplayName}</span>
              </div>
            )
          }
          dangerouslyAppendEmotionCSS={{ h2: { display: 'flex', gap: theme.spacing.sm }, wordBreak: 'break-word' }}
          breadcrumbs={breadcrumbs}
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                componentId="mlflow.logged_model.details.more_actions"
                icon={<OverflowIcon />}
                aria-label={intl.formatMessage({
                  defaultMessage: 'More actions',
                  description: 'A label for the dropdown menu trigger on the logged model details page',
                })}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item componentId="mlflow.logged_model.details.delete_button" onClick={openModal}>
                <FormattedMessage defaultMessage="Delete" description="Delete action for logged model" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <ExperimentLoggedModelDetailsRegisterButton loggedModel={loggedModel} onSuccess={onSuccess} />
        </PageHeader>
      )}
      {DeleteModalElement}
    </div>
  );
};

const ExperimentLoggedModelDetailsHeaderIcon = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 6,
        borderRadius: theme.spacing.lg,
      }}
    >
      <Icon component={LoggedModelIcon} css={{ display: 'flex', color: theme.colors.textSecondary }} />
    </div>
  );
};

const ExperimentLoggedModelDetailsHeaderSkeleton = () => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ height: 2 * theme.general.heightSm, marginBottom: theme.spacing.sm }}>
      <div css={{ height: theme.spacing.lg }}>
        <GenericSkeleton css={{ width: 100, height: theme.spacing.md }} loading />
      </div>
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <div css={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.xs * 0.5 }}>
          <GenericSkeleton css={{ width: theme.general.heightSm, height: theme.general.heightSm }} loading />
          <GenericSkeleton css={{ width: 160, height: theme.general.heightSm }} loading />
        </div>
        <div css={{ display: 'flex', gap: theme.spacing.sm }}>
          <GenericSkeleton css={{ width: 100, height: theme.general.heightSm }} loading />
          <GenericSkeleton css={{ width: 60, height: theme.general.heightSm }} loading />
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsMetricsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsMetricsTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  Empty,
  Input,
  SearchIcon,
  Table,
  TableCell,
  TableHeader,
  TableIcon,
  TableRow,
  TableSkeleton,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  type CellContext,
  type ColumnDef,
  type ColumnDefTemplate,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import type { LoggedModelProto, LoggedModelMetricProto, RunEntity } from '../../types';
import { ExperimentLoggedModelDetailsTableRunCellRenderer } from './ExperimentLoggedModelDetailsTableRunCellRenderer';
import { ExperimentLoggedModelDatasetButton } from './ExperimentLoggedModelDatasetButton';
import { useExperimentTrackingDetailsPageLayoutStyles } from '../../hooks/useExperimentTrackingDetailsPageLayoutStyles';

interface LoggedModelMetricWithRunData extends LoggedModelMetricProto {
  experimentId?: string | null;
  runName?: string | null;
}

type MetricTableCellRenderer = ColumnDefTemplate<CellContext<LoggedModelMetricWithRunData, unknown>>;
type ColumnMeta = {
  styles?: React.CSSProperties;
};

const SingleDatasetCellRenderer = ({
  getValue,
}: CellContext<
  LoggedModelMetricProto,
  {
    datasetName: string;
    datasetDigest: string;
    runId: string | null;
  }
>) => {
  const { datasetDigest, datasetName, runId } = getValue();

  if (!datasetName) {
    return '-';
  }

  return <ExperimentLoggedModelDatasetButton datasetName={datasetName} datasetDigest={datasetDigest} runId={runId} />;
};

export const ExperimentLoggedModelDetailsMetricsTable = ({
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

  const metricsWithRunData = useMemo(() => {
    if (relatedRunsLoading) {
      return [];
    }
    return (
      loggedModel?.data?.metrics?.map((metric) => {
        const runName = relatedRunsData?.find((run) => run.info?.runUuid === metric.run_id)?.info?.runName;
        return {
          ...metric,
          experimentId: loggedModel.info?.experiment_id,
          runName,
        };
      }) ?? []
    );
  }, [loggedModel, relatedRunsLoading, relatedRunsData]);

  const filteredMetrics = useMemo(
    () =>
      metricsWithRunData.filter(({ key, dataset_name, dataset_digest, runName }) => {
        const filterLower = filter.toLowerCase();
        return (
          key?.toLowerCase().includes(filterLower) ||
          dataset_name?.toLowerCase().includes(filterLower) ||
          dataset_digest?.toLowerCase().includes(filterLower) ||
          runName?.toLowerCase().includes(filterLower)
        );
      }),
    [filter, metricsWithRunData],
  );

  const columns = useMemo<ColumnDef<LoggedModelMetricWithRunData>[]>(
    () => [
      {
        id: 'metric',
        accessorKey: 'key',
        header: intl.formatMessage({
          defaultMessage: 'Metric',
          description: 'Label for the metric column in the logged model details metrics table',
        }),
        enableResizing: true,
        size: 240,
      },
      {
        id: 'dataset',
        header: intl.formatMessage({
          defaultMessage: 'Dataset',
          description: 'Label for the dataset column in the logged model details metrics table',
        }),
        accessorFn: ({ dataset_name: datasetName, dataset_digest: datasetDigest, run_id: runId }) => ({
          datasetName,
          datasetDigest,
          runId,
        }),
        enableResizing: true,
        cell: SingleDatasetCellRenderer as MetricTableCellRenderer,
      },
      {
        id: 'sourceRun',
        header: intl.formatMessage({
          defaultMessage: 'Source run',
          description:
            "Label for the column indicating a run being the source of the logged model's metric (i.e. source run). Displayed in the logged model details metrics table.",
        }),
        accessorFn: ({ run_id: runId, runName, experimentId }) => ({
          runId,
          runName,
          experimentId,
        }),
        enableResizing: true,
        cell: ExperimentLoggedModelDetailsTableRunCellRenderer as MetricTableCellRenderer,
      },
      {
        id: 'value',
        header: intl.formatMessage({
          defaultMessage: 'Value',
          description: 'Label for the value column in the logged model details metrics table',
        }),
        accessorKey: 'value',
        // In full-width layout, let "Value" fill the remaining space
        enableResizing: true,
        meta: {
          styles: {
            minWidth: 120,
          },
        },
      },
    ],
    [intl],
  );

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsMetricsTable.tsx',
    {
      data: filteredMetrics,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getRowId: (row) => [row.key, row.dataset_digest, row.run_id].join('.') ?? '',
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      columns,
    },
  );

  const renderTableContent = () => {
    if (relatedRunsLoading) {
      return <TableSkeleton lines={3} />;
    }
    if (!metricsWithRunData.length) {
      return (
        <div css={detailsPageNoEntriesStyles}>
          <Empty
            description={
              <FormattedMessage
                defaultMessage="No metrics recorded"
                description="Placeholder text when no metrics are recorded for a logged model"
              />
            }
          />
        </div>
      );
    }

    const areAllResultsFiltered = filteredMetrics.length < 1;

    return (
      <>
        <div css={{ marginBottom: theme.spacing.sm }}>
          <Input
            componentId="mlflow.logged_model.details.metrics.table.search"
            prefix={<SearchIcon />}
            placeholder={intl.formatMessage({
              defaultMessage: 'Search metrics',
              description: 'Placeholder text for the search input in the logged model details metrics table',
            })}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            allowClear
          />
        </div>
        <Table
          ref={(element) => element?.setAttribute('data-testid', 'logged-model-details-metrics-table')}
          scrollable
          empty={
            areAllResultsFiltered ? (
              <div>
                <Empty
                  description={
                    <FormattedMessage
                      defaultMessage="No metrics match the search filter"
                      description="Message displayed when no metrics match the search filter in the logged model details metrics table"
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
                componentId="mlflow.logged_model.details.metrics.table.header"
                key={header.id}
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                isResizing={header.column.getIsResizing()}
                css={{
                  flexGrow: header.column.getCanResize() ? 0 : 1,
                  ...(header.column.columnDef.meta as ColumnMeta)?.styles,
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
                  css={{
                    ...(cell.column.columnDef.meta as ColumnMeta)?.styles,
                  }}
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
      <Typography.Title level={4}>
        <FormattedMessage
          defaultMessage="Metrics ({length})"
          description="Header for the metrics table on the logged model details page. (Length) is the number of metrics currently displayed."
          values={{ length: metricsWithRunData.length }}
        />
      </Typography.Title>
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

---[FILE: ExperimentLoggedModelDetailsModelVersionsList.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsModelVersionsList.tsx
Signals: React

```typescript
import { Overflow, Tag, useDesignSystemTheme } from '@databricks/design-system';
import { type LoggedModelProto } from '../../types';
import { useExperimentLoggedModelRegisteredVersions } from './hooks/useExperimentLoggedModelRegisteredVersions';
import { isEmpty } from 'lodash';
import { Link } from '../../../common/utils/RoutingUtils';
import { useMemo } from 'react';
import { ReactComponent as RegisteredModelOkIcon } from '../../../common/static/registered-model-grey-ok.svg';

export const ExperimentLoggedModelDetailsModelVersionsList = ({
  loggedModel,
  empty,
}: {
  loggedModel: LoggedModelProto;
  empty?: React.ReactElement;
}) => {
  const loggedModels = useMemo(() => [loggedModel], [loggedModel]);
  const { theme } = useDesignSystemTheme();
  const { modelVersions } = useExperimentLoggedModelRegisteredVersions({ loggedModels });

  if (isEmpty(modelVersions)) {
    return empty ?? <>-</>;
  }

  return (
    <Overflow>
      {modelVersions?.map(({ displayedName, version, link }) => (
        <Link
          to={link}
          key={`${displayedName}-${version}`}
          css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}
        >
          <span css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, wordBreak: 'break-all' }}>
            <RegisteredModelOkIcon css={{ flexShrink: 0 }} /> {displayedName}{' '}
          </span>
          <Tag componentId="mlflow.logged_model.details.registered_model_version_tag">v{version}</Tag>
        </Link>
      ))}
    </Overflow>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsNav.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsNav.tsx

```typescript
import { NavigationMenu } from '@databricks/design-system';
import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';

import { FormattedMessage } from 'react-intl';

export const ExperimentLoggedModelDetailsNav = ({
  experimentId,
  modelId,
  activeTabName,
}: {
  experimentId: string;
  modelId: string;
  activeTabName?: string;
}) => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item key="overview" active={!activeTabName}>
          <Link to={Routes.getExperimentLoggedModelDetailsPageRoute(experimentId, modelId)}>
            <FormattedMessage
              defaultMessage="Overview"
              description="Label for the overview tab on the logged model details page"
            />
          </Link>
        </NavigationMenu.Item>
        {/* TODO: Implement when available */}
        {/* <NavigationMenu.Item key="evaluations" active={activeTabName === 'evaluations'}>
          <Link to={Routes.getExperimentLoggedModelDetailsPageRoute(experimentId, modelId, 'evaluations')}>
            <FormattedMessage
              defaultMessage="Evaluations"
              description="Label for the evaluations tab on the logged model details page"
            />
          </Link>
        </NavigationMenu.Item> */}
        <NavigationMenu.Item key="traces" active={activeTabName === 'traces'}>
          <Link to={Routes.getExperimentLoggedModelDetailsPageRoute(experimentId, modelId, 'traces')}>
            <FormattedMessage
              defaultMessage="Traces"
              description="Label for the traces tab on the logged model details page"
            />
          </Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item key="artifacts" active={activeTabName === 'artifacts'}>
          <Link to={Routes.getExperimentLoggedModelDetailsPageRoute(experimentId, modelId, 'artifacts')}>
            <FormattedMessage
              defaultMessage="Artifacts"
              description="Label for the artifacts tab on the logged model details page"
            />
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDetailsOverview.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDetailsOverview.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import type { ComponentProps } from 'react';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import { ExperimentLoggedModelDetailsOverview } from './ExperimentLoggedModelDetailsOverview';
import { ExperimentKind } from '../../constants';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MockedProvider } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { testRoute, TestRouter } from '../../../common/utils/RoutingTestUtils';

jest.mock('../../hooks/logged-models/useRelatedRunsDataForLoggedModels', () => ({
  useRelatedRunsDataForLoggedModels: () => ({
    data: [],
    loading: false,
    error: null,
  }),
}));

describe('ExperimentLoggedModelDetailsOverview', () => {
  const renderTestComponent = (props: Partial<ComponentProps<typeof ExperimentLoggedModelDetailsOverview>> = {}) => {
    render(
      <ExperimentLoggedModelDetailsOverview
        onDataUpdated={jest.fn<() => void>()}
        loggedModel={{ data: {}, info: { name: 'TestModel', model_id: 'm-123456' } }}
        {...props}
      />,
      {
        wrapper: ({ children }) => (
          <TestRouter
            routes={[
              testRoute(
                <DesignSystemProvider>
                  <IntlProvider locale="en">
                    <MockedProvider>
                      <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
                    </MockedProvider>
                  </IntlProvider>
                </DesignSystemProvider>,
                '*',
              ),
            ]}
          />
        ),
      },
    );
  };

  test('Logged model overview contains linked prompts when experiment is of GenAI type', async () => {
    renderTestComponent({ experimentKind: ExperimentKind.GENAI_DEVELOPMENT });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Prompts' })).toBeInTheDocument();
    });
  });

  test('Logged model overview skips linked prompts box when experiment is not of GenAI type', async () => {
    renderTestComponent({ experimentKind: ExperimentKind.CUSTOM_MODEL_DEVELOPMENT });

    await waitFor(() => {
      expect(screen.getByText('m-123456')).toBeInTheDocument();
    });

    expect(screen.queryByRole('heading', { name: 'Prompts' })).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````

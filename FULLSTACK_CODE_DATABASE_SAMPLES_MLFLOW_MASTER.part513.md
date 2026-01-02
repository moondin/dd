---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 513
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 513 of 991)

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

---[FILE: RunViewMetricsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewMetricsTable.tsx
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
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { LoggedModelProto, MetricEntitiesByName, MetricEntity, RunInfoEntity } from '../../../types';
import { compact, flatMap, groupBy, isEmpty, keyBy, mapValues, sum, values } from 'lodash';
import { useMemo, useState } from 'react';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { RunPageTabName } from '../../../constants';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { isSystemMetricKey } from '../../../utils/MetricsUtils';
import type { ColumnDef, Table as TableDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import type { UseGetRunQueryResponseRunInfo } from '../hooks/useGetRunQuery';
import { isUndefined } from 'lodash';
import { useExperimentTrackingDetailsPageLayoutStyles } from '../../../hooks/useExperimentTrackingDetailsPageLayoutStyles';

const { systemMetricsLabel, modelMetricsLabel } = defineMessages({
  systemMetricsLabel: {
    defaultMessage: 'System metrics',
    description: 'Run page > Overview > Metrics table > System charts section > title',
  },
  modelMetricsLabel: {
    defaultMessage: 'Model metrics',
    description: 'Run page > Overview > Metrics table > Model charts section > title',
  },
});

const metricKeyMatchesFilter =
  (filter: string) =>
  ({ key }: MetricEntity) =>
    key.toLowerCase().includes(filter.toLowerCase());

interface MetricEntityWithLoggedModels extends MetricEntity {
  loggedModels?: LoggedModelProto[];
}

const RunViewMetricsTableSection = ({
  metricsList,
  runInfo,
  header,
  table,
}: {
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  metricsList: MetricEntityWithLoggedModels[];
  header?: React.ReactNode;
  table: TableDef<MetricEntityWithLoggedModels>;
}) => {
  const { theme } = useDesignSystemTheme();
  const [{ column: keyColumn }, ...otherColumns] = table.getLeafHeaders();

  const valueColumn = otherColumns.find((column) => column.id === 'value')?.column;

  const anyRowHasModels = metricsList.some(({ loggedModels }) => !isEmpty(loggedModels));
  const modelColumn = otherColumns.find((column) => column.id === 'models')?.column;

  return metricsList.length ? (
    <>
      {header && (
        <TableRow>
          <TableCell css={{ flex: 1, backgroundColor: theme.colors.backgroundSecondary }}>
            <Typography.Text bold>
              {header} ({metricsList.length})
            </Typography.Text>
          </TableCell>
        </TableRow>
      )}
      {metricsList.map(
        ({
          // Get metric key and value to display in table
          key,
          value,
          loggedModels,
        }) => (
          <TableRow key={key}>
            <TableCell
              style={{
                flex: keyColumn.getCanResize() ? keyColumn.getSize() / 100 : undefined,
              }}
            >
              <Link
                to={Routes.getRunPageTabRoute(
                  runInfo.experimentId ?? '',
                  runInfo.runUuid ?? '',
                  RunPageTabName.MODEL_METRIC_CHARTS,
                )}
              >
                {key}
              </Link>
            </TableCell>
            <TableCell
              css={{
                flex: valueColumn?.getCanResize() ? valueColumn.getSize() / 100 : undefined,
              }}
            >
              {value.toString()}
            </TableCell>
            {anyRowHasModels && (
              <TableCell
                css={{
                  flex: modelColumn?.getCanResize() ? modelColumn.getSize() / 100 : undefined,
                }}
              >
                {!isEmpty(loggedModels) ? (
                  <Overflow>
                    {loggedModels?.map((model) => (
                      <Link
                        key={model.info?.model_id}
                        target="_blank"
                        rel="noopener noreferrer"
                        to={Routes.getExperimentLoggedModelDetailsPage(
                          model.info?.experiment_id ?? '',
                          model.info?.model_id ?? '',
                        )}
                      >
                        {model.info?.name}
                      </Link>
                    ))}
                  </Overflow>
                ) : (
                  '-'
                )}
              </TableCell>
            )}
          </TableRow>
        ),
      )}
    </>
  ) : null;
};

/**
 * Displays table with metrics key/values in run detail overview.
 */
export const RunViewMetricsTable = ({
  latestMetrics,
  runInfo,
  loggedModels,
  expandToParentContainer,
}: {
  latestMetrics: MetricEntitiesByName;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  loggedModels?: LoggedModelProto[];
  expandToParentContainer?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const { detailsPageTableStyles, detailsPageNoEntriesStyles } = useExperimentTrackingDetailsPageLayoutStyles();
  const intl = useIntl();
  const [filter, setFilter] = useState('');

  /**
   * Aggregate logged models by metric key.
   * This is used to display the models associated with each metric in the table.
   */
  const loggedModelsByMetricKey = useMemo(() => {
    if (!loggedModels) {
      return {};
    }
    const metricsWithModels = compact(
      flatMap(loggedModels, (model) => model.data?.metrics?.map(({ key }) => ({ key, model }))),
    );
    const groupedMetrics = groupBy(metricsWithModels, 'key');
    return mapValues(groupedMetrics, (group) => group.map(({ model }) => model));
  }, [loggedModels]);

  /**
   * Enrich the metric list with related logged models.
   */
  const metricValues = useMemo<MetricEntityWithLoggedModels[]>(() => {
    const metricList = values(latestMetrics);

    if (isEmpty(loggedModelsByMetricKey)) {
      return metricList;
    }
    return metricList.map((metric) => ({
      ...metric,
      loggedModels: loggedModelsByMetricKey[metric.key] ?? [],
    }));
  }, [latestMetrics, loggedModelsByMetricKey]);

  const anyRowHasModels = metricValues.some(({ loggedModels }) => !isEmpty(loggedModels));

  const modelColumnDefs: ColumnDef<MetricEntityWithLoggedModels>[] = useMemo(
    () => [
      {
        id: 'models',
        header: intl.formatMessage({
          defaultMessage: 'Models',
          description: 'Run page > Overview > Metrics table > Models column header',
        }),
        accessorKey: 'models',
        enableResizing: true,
      },
    ],
    [intl],
  );

  const columns = useMemo(() => {
    const columnDefs: ColumnDef<MetricEntityWithLoggedModels>[] = [
      {
        id: 'key',
        accessorKey: 'key',
        header: () => (
          <FormattedMessage
            defaultMessage="Metric"
            description="Run page > Overview > Metrics table > Key column header"
          />
        ),
        enableResizing: true,
        size: 240,
      },
      {
        id: 'value',
        header: () => (
          <FormattedMessage
            defaultMessage="Value"
            description="Run page > Overview > Metrics table > Value column header"
          />
        ),
        accessorKey: 'value',
        enableResizing: true,
      },
    ];

    if (anyRowHasModels) {
      columnDefs.push(...modelColumnDefs);
    }

    return columnDefs;
  }, [anyRowHasModels, modelColumnDefs]);

  // Break down metric lists into system and model segments. If no system (or model) metrics
  // are detected, return a single segment.
  const metricSegments = useMemo(() => {
    const systemMetrics = metricValues.filter(({ key }) => isSystemMetricKey(key));
    const modelMetrics = metricValues.filter(({ key }) => !isSystemMetricKey(key));
    const isSegmented = systemMetrics.length > 0 && modelMetrics.length > 0;
    if (!isSegmented) {
      return [{ header: undefined, metrics: metricValues.filter(metricKeyMatchesFilter(filter)) }];
    }
    return [
      {
        header: intl.formatMessage(systemMetricsLabel),
        metrics: systemMetrics.filter(metricKeyMatchesFilter(filter)),
      },
      {
        header: intl.formatMessage(modelMetricsLabel),
        metrics: modelMetrics.filter(metricKeyMatchesFilter(filter)),
      },
    ];
  }, [filter, metricValues, intl]);

  const table = useReactTable<MetricEntity>(
    'mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewMetricsTable.tsx',
    {
      data: metricValues,
      getCoreRowModel: getCoreRowModel(),
      getRowId: (row) => row.key,
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      columns,
    },
  );

  const renderTableContent = () => {
    if (!metricValues.length) {
      return (
        <div css={detailsPageNoEntriesStyles}>
          <Empty
            description={
              <FormattedMessage
                defaultMessage="No metrics recorded"
                description="Run page > Overview > Metrics table > No metrics recorded"
              />
            }
          />
        </div>
      );
    }

    const areAllResultsFiltered = sum(metricSegments.map(({ metrics }) => metrics.length)) < 1;

    return (
      <>
        <div css={{ marginBottom: theme.spacing.sm }}>
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewmetricstable.tsx_186"
            prefix={<SearchIcon />}
            placeholder={intl.formatMessage({
              defaultMessage: 'Search metrics',
              description: 'Run page > Overview > Metrics table > Filter input placeholder',
            })}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            allowClear
          />
        </div>

        <Table
          scrollable
          empty={
            areAllResultsFiltered ? (
              <div>
                <Empty
                  description={
                    <FormattedMessage
                      defaultMessage="No metrics match the search filter"
                      description="Message displayed when no metrics match the search filter in the run details page details metrics table"
                    />
                  }
                />
              </div>
            ) : null
          }
          css={detailsPageTableStyles}
        >
          <TableRow isHeader>
            {table.getLeafHeaders().map((header) => (
              <TableHeader
                componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewmetricstable.tsx_312"
                key={header.id}
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                isResizing={header.column.getIsResizing()}
                style={{
                  flex: header.column.getCanResize() ? header.column.getSize() / 100 : undefined,
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>
          {metricSegments.map((segment, index) => (
            <RunViewMetricsTableSection
              key={segment.header || index}
              metricsList={segment.metrics}
              runInfo={runInfo}
              header={segment.header}
              table={table}
            />
          ))}
        </Table>
      </>
    );
  };
  return (
    <div
      css={{
        flex: expandToParentContainer ? 1 : '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Typography.Title level={4} css={{ flexShrink: 0 }}>
        <FormattedMessage
          defaultMessage="Metrics ({length})"
          description="Run page > Overview > Metrics table > Section title"
          values={{ length: metricValues.filter(metricKeyMatchesFilter(filter)).length }}
        />
      </Typography.Title>
      <div
        css={{
          padding: theme.spacing.sm,
          border: `1px solid ${theme.colors.borderDecorative}`,
          borderRadius: theme.general.borderRadiusBase,
          display: 'flex',
          flexDirection: 'column',
          flex: expandToParentContainer ? 1 : '0 0 auto',
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

---[FILE: RunViewParentRunBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewParentRunBox.tsx
Signals: React, Redux/RTK

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../../redux-types';
import { useEffect, useMemo } from 'react';
import { getRunApi } from '../../../actions';
import { ParagraphSkeleton } from '@databricks/design-system';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { FormattedMessage } from 'react-intl';
import { shouldEnableGraphQLRunDetailsPage } from '../../../../common/utils/FeatureUtils';
import { useGetRunQuery } from '../hooks/useGetRunQuery';

export const RunViewParentRunBox = ({ parentRunUuid }: { parentRunUuid: string }) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const parentRunInfoRedux = useSelector(({ entities }: ReduxState) => {
    return entities.runInfosByUuid[parentRunUuid];
  });

  const parentRunInfoGraphql = useGetRunQuery({
    runUuid: parentRunUuid,
    disabled: !shouldEnableGraphQLRunDetailsPage(),
  });

  const parentRunInfo = useMemo(() => {
    return shouldEnableGraphQLRunDetailsPage() ? parentRunInfoGraphql?.data?.info : parentRunInfoRedux;
  }, [parentRunInfoGraphql, parentRunInfoRedux]);

  useEffect(() => {
    // Don't call REST API if GraphQL is enabled
    if (shouldEnableGraphQLRunDetailsPage()) {
      return;
    }
    if (!parentRunInfo) {
      dispatch(getRunApi(parentRunUuid));
    }
  }, [dispatch, parentRunUuid, parentRunInfo]);

  if (!parentRunInfo) {
    return (
      <ParagraphSkeleton
        loading
        label={
          <FormattedMessage
            defaultMessage="Parent run name loading"
            description="Run page > Overview > Parent run name loading"
          />
        }
      />
    );
  }

  if (!parentRunInfo.experimentId || !parentRunInfo.runUuid) {
    return null;
  }

  return (
    <Link to={Routes.getRunPageRoute(parentRunInfo.experimentId, parentRunInfo.runUuid)}>{parentRunInfo.runName}</Link>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewPromptsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewPromptsTable.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import type { KeyValueEntity } from '../../../../common/types';
import { ExperimentLinkedPromptsTable } from '../../experiment-prompts/ExperimentLinkedPromptsTable';
import { MLFLOW_LINKED_PROMPTS_TAG } from '../../../constants';

export const RunViewPromptsTable = ({
  runTags,
  experimentId,
}: {
  runTags: Record<string, KeyValueEntity>;
  experimentId?: string | null;
}) => {
  const linkedPromptsTagValue = runTags[MLFLOW_LINKED_PROMPTS_TAG]?.value;

  const rawLinkedPrompts: { name: string; version: string }[] = useMemo(() => {
    if (!linkedPromptsTagValue) {
      return [];
    }
    try {
      return JSON.parse(linkedPromptsTagValue ?? '[]');
    } catch (e) {
      // fail gracefully, just don't show any linked prompts
      return [];
    }
  }, [linkedPromptsTagValue]);

  const data = useMemo(
    () => rawLinkedPrompts.map((prompt) => ({ ...prompt, experimentId: experimentId ?? '' })),
    [rawLinkedPrompts, experimentId],
  );

  return <ExperimentLinkedPromptsTable data={data} />;
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewRegisteredModelsBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewRegisteredModelsBox.tsx

```typescript
import { Overflow, Tag, useDesignSystemTheme } from '@databricks/design-system';
import { Link } from '../../../../common/utils/RoutingUtils';
import { ReactComponent as RegisteredModelOkIcon } from '../../../../common/static/registered-model-grey-ok.svg';
import type { RunPageModelVersionSummary } from '../hooks/useUnifiedRegisteredModelVersionsSummariesForRun';

/**
 * Displays list of registered models in run detail overview.
 * TODO: expand with logged models after finalizing design
 */
export const RunViewRegisteredModelsBox = ({
  registeredModelVersionSummaries,
}: {
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Overflow>
      {registeredModelVersionSummaries?.map((modelSummary) => (
        <Link
          key={modelSummary.displayedName}
          to={modelSummary.link}
          css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}
        >
          <RegisteredModelOkIcon /> {modelSummary.displayedName}{' '}
          <Tag
            componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewregisteredmodelsbox.tsx_40"
            css={{ cursor: 'pointer' }}
          >
            v{modelSummary.version}
          </Tag>
        </Link>
      ))}
    </Overflow>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewRegisteredPromptsBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewRegisteredPromptsBox.tsx

```typescript
import { ParagraphSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { KeyValueEntity } from '@mlflow/mlflow/src/common/types';

import { Link } from '../../../../common/utils/RoutingUtils';
import { usePromptVersionsForRunQuery } from '../../../pages/prompts/hooks/usePromptVersionsForRunQuery';
import Routes from '../../../routes';
import { parseLinkedPromptsFromRunTags } from '../../../pages/prompts/utils';

export const RunViewRegisteredPromptsBox = ({
  tags,
  runUuid,
}: {
  tags: Record<string, KeyValueEntity>;
  runUuid: string;
}) => {
  const { theme } = useDesignSystemTheme();
  // This part is for supporting prompt versions created using mlflow < 3.1.0
  const { data, error, isLoading } = usePromptVersionsForRunQuery({ runUuid });
  const promptVersionsFromPromptTags = data?.model_versions || [];
  const promptVersionsFromRunTags = parseLinkedPromptsFromRunTags(tags);
  const promptVersions = [...promptVersionsFromPromptTags, ...promptVersionsFromRunTags];

  if (isLoading) {
    return <ParagraphSkeleton />;
  }

  if (error || !promptVersions || promptVersions.length === 0) {
    return <Typography.Hint css={{ padding: `${theme.spacing.xs}px 0px` }}>—</Typography.Hint>;
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        flexWrap: 'wrap',
        padding: `${theme.spacing.xs}px 0px`,
      }}
    >
      {promptVersions.map((promptVersion, index) => {
        const to = Routes.getPromptDetailsPageRoute(encodeURIComponent(promptVersion.name));
        const displayText = `${promptVersion.name} (v${promptVersion.version})`;
        return (
          <Typography.Text key={displayText} css={{ whiteSpace: 'nowrap' }}>
            <Link to={to}>{displayText}</Link>
            {index < promptVersions.length - 1 && ','}
          </Typography.Text>
        );
      })}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewSourceBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewSourceBox.tsx

```typescript
import {
  BranchIcon,
  CopyIcon,
  GitCommitIcon,
  Tag,
  Tooltip,
  Typography,
  useDesignSystemTheme,
  Popover,
} from '@databricks/design-system';
import Utils from '../../../../common/utils/Utils';
import type { KeyValueEntity } from '../../../../common/types';
import { MLFLOW_RUN_GIT_SOURCE_BRANCH_TAG } from '../../../constants';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';
import { ExperimentSourceTypeIcon } from '../../ExperimentSourceTypeIcon';

export const RunViewSourceBox = ({
  runUuid,
  tags,
  search,
  className,
  hasIcon = true,
}: {
  runUuid: string;
  tags: Record<string, KeyValueEntity>;
  search: string;
  className?: string;
  hasIcon?: boolean;
}) => {
  const branchName = tags?.[MLFLOW_RUN_GIT_SOURCE_BRANCH_TAG]?.value;
  const commitHash = tags?.[Utils.gitCommitTag]?.value;
  const runSource = Utils.renderSource(tags, search, runUuid, branchName);

  const { theme } = useDesignSystemTheme();
  return runSource ? (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        flexWrap: 'wrap',
      }}
      className={className}
    >
      {hasIcon && (
        <ExperimentSourceTypeIcon
          sourceType={tags[Utils.sourceTypeTag]?.value}
          css={{ color: theme.colors.actionPrimaryBackgroundDefault }}
        />
      )}
      {runSource}{' '}
      {branchName && (
        <Tooltip componentId="mlflow.experiment-tracking.run-source.branch" content={branchName}>
          <Tag
            componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewsourcebox.tsx_48"
            css={{ marginRight: 0 }}
          >
            <div css={{ display: 'flex', gap: 4, whiteSpace: 'nowrap' }}>
              <BranchIcon /> {branchName}
            </div>
          </Tag>
        </Tooltip>
      )}
      {commitHash && (
        <Popover.Root componentId="mlflow.run_details.overview.source.commit_hash_popover">
          <Popover.Trigger asChild>
            <Tag
              componentId="mlflow.run_details.overview.source.commit_hash"
              css={{ marginRight: 0, '&>div': { paddingRight: 0 } }}
            >
              <div css={{ display: 'flex', gap: theme.spacing.xs, whiteSpace: 'nowrap', alignContent: 'center' }}>
                <GitCommitIcon />
                {commitHash.slice(0, 7)}
              </div>
            </Tag>
          </Popover.Trigger>
          <Popover.Content align="start">
            <Popover.Arrow />
            <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
              {commitHash}
              <CopyButton showLabel={false} size="small" type="tertiary" copyText={commitHash} icon={<CopyIcon />} />
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
    </div>
  ) : (
    <Typography.Hint>—</Typography.Hint>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewStatusBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewStatusBox.tsx

```typescript
import { Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { RunInfoEntity } from '../../../types';
import { RunStatusIcon } from '../../RunStatusIcon';
import { FormattedMessage } from 'react-intl';
import type { MlflowRunStatus } from '../../../../graphql/__generated__/graphql';

/**
 * Displays run status cell in run detail overview.
 */
export const RunViewStatusBox = ({
  status,
  useSpinner = false,
  className,
}: {
  status: RunInfoEntity['status'] | MlflowRunStatus | null;
  /**
   * Determines if animated spinner will be used for RUNNING state. If false, clock icon will be used.
   */
  useSpinner?: boolean;
  className?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const getTagColor = () => {
    if (status === 'FINISHED') {
      return theme.isDarkMode ? theme.colors.green800 : theme.colors.green100;
    }
    if (status === 'KILLED' || status === 'FAILED') {
      return theme.isDarkMode ? theme.colors.red800 : theme.colors.red100;
    }
    if (status === 'SCHEDULED' || status === 'RUNNING') {
      return theme.isDarkMode ? theme.colors.blue800 : theme.colors.blue100;
    }

    return undefined;
  };

  const getStatusLabel = () => {
    if (status === 'FINISHED') {
      return (
        <Typography.Text color="success">
          <FormattedMessage
            defaultMessage="Finished"
            description="Run page > Overview > Run status cell > Value for finished state"
          />
        </Typography.Text>
      );
    }
    if (status === 'KILLED') {
      return (
        <Typography.Text color="error">
          <FormattedMessage
            defaultMessage="Killed"
            description="Run page > Overview > Run status cell > Value for killed state"
          />
        </Typography.Text>
      );
    }
    if (status === 'FAILED') {
      return (
        <Typography.Text color="error">
          <FormattedMessage
            defaultMessage="Failed"
            description="Run page > Overview > Run status cell > Value for failed state"
          />
        </Typography.Text>
      );
    }
    if (status === 'RUNNING') {
      return (
        <Typography.Text color="info">
          <FormattedMessage
            defaultMessage="Running"
            description="Run page > Overview > Run status cell > Value for running state"
          />
        </Typography.Text>
      );
    }
    if (status === 'SCHEDULED') {
      return (
        <Typography.Text color="info">
          <FormattedMessage
            defaultMessage="Scheduled"
            description="Run page > Overview > Run status cell > Value for scheduled state"
          />
        </Typography.Text>
      );
    }
    return status;
  };

  return (
    <Tag
      componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_overview_runviewstatusbox.tsx_81"
      css={{ backgroundColor: getTagColor() }}
      className={className}
    >
      {status && <RunStatusIcon status={status} useSpinner={useSpinner} />}{' '}
      <Typography.Text css={{ marginLeft: theme.spacing.sm }}>{getStatusLabel()}</Typography.Text>
    </Tag>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewTagsBox.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewTagsBox.intg.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';

import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
import { renderWithIntl, fastFillInput, act, screen, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { setRunTagsBulkApi } from '../../../actions';
import type { KeyValueEntity } from '../../../../common/types';
import { RunViewTagsBox } from './RunViewTagsBox';
import { DesignSystemProvider } from '@databricks/design-system';

const testRunUuid = 'test-run-uuid';

jest.mock('../../../actions', () => ({
  setRunTagsBulkApi: jest.fn(() => ({ type: 'setRunTagsBulkApi', payload: Promise.resolve() })),
}));

describe('RunViewTagsBox integration', () => {
  const onTagsUpdated = jest.fn();

  function renderTestComponent(existingTags: Record<string, KeyValueEntity> = {}) {
    renderWithIntl(
      <DesignSystemProvider>
        <MockedReduxStoreProvider>
          <RunViewTagsBox onTagsUpdated={onTagsUpdated} runUuid={testRunUuid} tags={existingTags} />,
        </MockedReduxStoreProvider>
      </DesignSystemProvider>,
    );
  }

  beforeEach(() => {
    jest.mocked(setRunTagsBulkApi).mockClear();
    onTagsUpdated.mockClear();
  });

  test('it should display empty tag list and adding a new one', async () => {
    // Render the component, wait to load initial data
    await act(async () => {
      renderTestComponent();
    });

    expect(screen.getByRole('button', { name: 'Add tags' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Add tags' }));

    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'new_tag_with_value');

    await userEvent.click(screen.getByText(/Add tag "new_tag_with_value"/));
    await fastFillInput(screen.getByLabelText('Value'), 'tag_value');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(setRunTagsBulkApi).toHaveBeenCalledWith(
      'test-run-uuid',
      [],
      [{ key: 'new_tag_with_value', value: 'tag_value' }],
    );
    expect(onTagsUpdated).toHaveBeenCalled();
  });

  test('should modify already existing tag list', async () => {
    // Render the component, wait to load initial data
    await act(async () => {
      renderTestComponent([
        { key: 'existing_tag_1', value: 'val1' },
        { key: 'existing_tag_2', value: 'val2' },
        { key: 'mlflow.existing_tag_3', value: 'val2' },
      ] as any);
    });

    expect(screen.getByRole('status', { name: 'existing_tag_1' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'existing_tag_2' })).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: /existing_tag_3/ })).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Edit tags' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Edit tags' }));

    const modalBody = screen.getByRole('dialog');

    await userEvent.click(
      within(within(modalBody).getByRole('status', { name: 'existing_tag_1' })).getByRole('button'),
    );

    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'new_tag_with_value');

    await userEvent.click(screen.getByText(/Add tag "new_tag_with_value"/));
    await fastFillInput(screen.getByLabelText('Value'), 'tag_value');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(setRunTagsBulkApi).toHaveBeenCalledWith(
      'test-run-uuid',
      [
        { key: 'existing_tag_1', value: 'val1' },
        { key: 'existing_tag_2', value: 'val2' },
      ],
      [
        { key: 'existing_tag_2', value: 'val2' },
        { key: 'new_tag_with_value', value: 'tag_value' },
      ],
    );
    expect(onTagsUpdated).toHaveBeenCalled();
  });

  test('should react accordingly when API responds with an error', async () => {
    jest.mocked(setRunTagsBulkApi).mockImplementation(
      () =>
        ({
          type: 'setRunTagsBulkApi',
          payload: Promise.reject(new Error('Some error message')),
        } as any),
    );

    await act(async () => {
      renderTestComponent();
    });

    expect(screen.getByRole('button', { name: 'Add tags' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Add tags' }));

    await fastFillInput(within(screen.getByRole('dialog')).getByRole('combobox'), 'new_tag_with_value');

    await userEvent.click(screen.getByText(/Add tag "new_tag_with_value"/));
    await fastFillInput(screen.getByLabelText('Value'), 'tag_value');
    await userEvent.click(screen.getByLabelText('Add tag'));

    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    expect(setRunTagsBulkApi).toHaveBeenCalledWith(
      'test-run-uuid',
      [],
      [{ key: 'new_tag_with_value', value: 'tag_value' }],
    );

    expect(screen.getByText('Some error message')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewTagsBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewTagsBox.tsx
Signals: React, Redux/RTK

```typescript
import { Button, PencilIcon, Spinner, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { shouldUseSharedTaggingUI } from '../../../../common/utils/FeatureUtils';
import { useEditKeyValueTagsModal } from '../../../../common/hooks/useEditKeyValueTagsModal';
import { useTagAssignmentModal } from '../../../../common/hooks/useTagAssignmentModal';
import type { KeyValueEntity } from '../../../../common/types';
import { KeyValueTag } from '../../../../common/components/KeyValueTag';
import { FormattedMessage, useIntl } from 'react-intl';
import { keys, values } from 'lodash';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../../redux-types';
import { setRunTagsBulkApi, saveRunTagsApi } from '../../../actions';
import { useMemo, useState } from 'react';
import { isUserFacingTag } from '../../../../common/utils/TagUtils';

/**
 * Displays run tags cell in run detail overview.
 */
export const RunViewTagsBox = ({
  runUuid,
  tags,
  onTagsUpdated,
  className,
}: {
  runUuid: string;
  tags: Record<string, KeyValueEntity>;
  onTagsUpdated: () => void;
  className?: string;
}) => {
  const sharedTaggingUIEnabled = shouldUseSharedTaggingUI();

  const [isSavingTags, setIsSavingTags] = useState(false);

  const { theme } = useDesignSystemTheme();
  const dispatch = useDispatch<ThunkDispatch>();
  const intl = useIntl();

  // Get keys and tag entities while excluding system tags
  const [visibleTagKeys, visibleTagEntities] = useMemo(
    () => [keys(tags).filter(isUserFacingTag), values(tags).filter(({ key }) => isUserFacingTag(key))],
    [tags],
  );

  const tagsKeyValueMap: KeyValueEntity[] = visibleTagEntities.map(({ key, value }) => ({ key, value }));

  const { TagAssignmentModal, showTagAssignmentModal } = useTagAssignmentModal({
    componentIdPrefix: 'mlflow.run-view-tags-box',
    initialTags: tagsKeyValueMap,
    isLoading: isSavingTags,
    onSubmit: (newTags: KeyValueEntity[], deletedTags: KeyValueEntity[]) => {
      setIsSavingTags(true);
      return dispatch(saveRunTagsApi(runUuid, newTags, deletedTags)).then(() => {
        setIsSavingTags(false);
      });
    },
    onSuccess: onTagsUpdated,
  });

  const { EditTagsModal, showEditTagsModal, isLoading } = useEditKeyValueTagsModal({
    valueRequired: true,
    allAvailableTags: visibleTagKeys,
    saveTagsHandler: async (_, existingTags, newTags) =>
      dispatch(setRunTagsBulkApi(runUuid, existingTags, newTags)).then(onTagsUpdated),
  });

  const showEditModal = () => {
    if (sharedTaggingUIEnabled) {
      showTagAssignmentModal();
      return;
    }

    showEditTagsModal({ tags: visibleTagEntities });
  };

  const editTagsLabel = intl.formatMessage({
    defaultMessage: 'Edit tags',
    description: "Run page > Overview > Tags cell > 'Edit' button label",
  });

  return (
    <div
      css={{
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.xs,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '> *': {
          marginRight: '0 !important',
        },
        gap: theme.spacing.xs,
      }}
      className={className}
    >
      {tagsKeyValueMap.length < 1 ? (
        <Button
          componentId="mlflow.run_details.overview.tags.add_button"
          size="small"
          type="tertiary"
          onClick={showEditModal}
        >
          <FormattedMessage
            defaultMessage="Add tags"
            description="Run page > Overview > Tags cell > 'Add' button label"
          />
        </Button>
      ) : (
        <>
          {tagsKeyValueMap.map((tag) => (
            <KeyValueTag tag={tag} key={`${tag.key}-${tag.value}`} enableFullViewModal css={{ marginRight: 0 }} />
          ))}
          <Tooltip componentId="mlflow.run_details.overview.tags.edit_button.tooltip" content={editTagsLabel}>
            <Button
              componentId="mlflow.run_details.overview.tags.edit_button"
              aria-label={editTagsLabel}
              size="small"
              icon={<PencilIcon />}
              onClick={showEditModal}
            />
          </Tooltip>
        </>
      )}
      {isLoading && <Spinner size="small" />}
      {/** Old modal for editing tags */}
      {EditTagsModal}
      {/** New modal for editing tags, using shared tagging UI */}
      {TagAssignmentModal}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewUserLinkBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/overview/RunViewUserLinkBox.tsx

```typescript
import { Link } from '../../../../common/utils/RoutingUtils';
import Utils from '../../../../common/utils/Utils';
import Routes from '../../../routes';
import type { RunInfoEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import type { UseGetRunQueryResponseRunInfo } from '../hooks/useGetRunQuery';

export const RunViewUserLinkBox = ({
  runInfo,
  tags,
}: {
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  tags: Record<string, KeyValueEntity>;
}) => {
  const user = Utils.getUser(runInfo, tags);
  return <Link to={Routes.searchRunsByUser(runInfo?.experimentId ?? '', user)}>{user}</Link>;
};
```

--------------------------------------------------------------------------------

````

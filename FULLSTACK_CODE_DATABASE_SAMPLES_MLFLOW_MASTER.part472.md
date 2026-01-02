---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 472
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 472 of 991)

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

---[FILE: ExperimentLoggedModelTableNameCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableNameCell.tsx
Signals: React

```typescript
import { Overflow, ParagraphSkeleton, Tag, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import type { LoggedModelProto } from '../../types';
import { getStableColorForRun } from '../../utils/RunNameUtils';
import { RunColorPill } from '../experiment-page/components/RunColorPill';
import { ExperimentLoggedModelTableGroupCell } from './ExperimentLoggedModelTableGroupCell';
import type { LoggedModelsTableRow } from './ExperimentLoggedModelListPageTable.utils';
import {
  isLoggedModelDataGroupDataRow,
  isLoggedModelRow,
  LoggedModelsTableGroupingEnabledClass,
} from './ExperimentLoggedModelListPageTable.utils';
import { isSymbol } from 'lodash';
import { useExperimentLoggedModelRegisteredVersions } from './hooks/useExperimentLoggedModelRegisteredVersions';
import { FormattedMessage } from 'react-intl';
import React, { useMemo } from 'react';
import { shouldUnifyLoggedModelsAndRegisteredModels } from '@mlflow/mlflow/src/common/utils/FeatureUtils';

export const ExperimentLoggedModelTableNameCell = (props: { data: LoggedModelsTableRow }) => {
  const { theme } = useDesignSystemTheme();
  const { data } = props;
  const loggedModelData = isLoggedModelRow(data) ? (data as LoggedModelProto) : null;
  const loggedModels = useMemo(() => (loggedModelData ? [loggedModelData] : []), [loggedModelData]);

  const isUnifiedLoggedModelsEnabled = shouldUnifyLoggedModelsAndRegisteredModels();

  const { modelVersions: allModelVersions, isLoading } = useExperimentLoggedModelRegisteredVersions({
    loggedModels,
    checkAcl: Boolean(loggedModelData) && isUnifiedLoggedModelsEnabled,
  });

  if (isSymbol(data)) {
    return null;
  }

  if (isLoggedModelDataGroupDataRow(data)) {
    return <ExperimentLoggedModelTableGroupCell data={data} />;
  }

  // Filter to only show models that the user has access to
  const registeredModelVersions =
    isUnifiedLoggedModelsEnabled && allModelVersions ? allModelVersions.filter((model) => model.hasAccess) : [];

  const originalName = data.info?.name;

  // Build tooltip content for original logged model info
  const getTooltipContent = () => {
    if (!isUnifiedLoggedModelsEnabled || registeredModelVersions.length === 0) {
      return null;
    }

    const linkUrl =
      data.info?.experiment_id && data.info?.model_id
        ? Routes.getExperimentLoggedModelDetailsPageRoute(data.info.experiment_id, data.info.model_id)
        : null;

    if (!linkUrl) {
      return (
        <FormattedMessage
          defaultMessage="Original logged model: {originalName}"
          description="Tooltip text showing the original logged model name"
          values={{ originalName }}
        />
      );
    }

    return (
      <div>
        <FormattedMessage
          defaultMessage="Original logged model: {originalModelLink}"
          description="Tooltip text with link to the original logged model"
          values={{
            originalModelLink: (
              <Link to={linkUrl} css={{ color: 'inherit', textDecoration: 'underline' }}>
                {originalName}
              </Link>
            ),
          }}
        />
      </div>
    );
  };

  const tooltipContent = getTooltipContent();

  // Show loading spinner if ACL checking is in progress
  if (isLoading && isUnifiedLoggedModelsEnabled) {
    return (
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          width: '100%',
          [`.${LoggedModelsTableGroupingEnabledClass} &`]: {
            paddingLeft: theme.spacing.lg,
          },
        }}
      >
        <RunColorPill color={getStableColorForRun(data.info?.model_id || '')} />
        <ParagraphSkeleton label="Loading..." />
      </div>
    );
  }

  // If we have any registered models, show them; otherwise show original logged model
  if (registeredModelVersions.length > 0) {
    // If there's only one registered model, show it normally with the color pill
    if (registeredModelVersions.length === 1) {
      const primaryModel = registeredModelVersions[0];

      const content = (
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            [`.${LoggedModelsTableGroupingEnabledClass} &`]: {
              paddingLeft: theme.spacing.lg,
            },
          }}
        >
          <RunColorPill color={getStableColorForRun(data.info?.model_id || '')} />
          <Link to={primaryModel.link} css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            {primaryModel.displayedName}
            <Tag
              componentId="mlflow.logged_model.name_cell_version_tag"
              css={{ marginRight: 0, verticalAlign: 'middle' }}
            >
              v{primaryModel.version}
            </Tag>
          </Link>
        </div>
      );

      return tooltipContent ? (
        <Tooltip content={tooltipContent} componentId="mlflow.logged_model.name_cell_tooltip">
          {content}
        </Tooltip>
      ) : (
        content
      );
    }

    // If there are multiple registered models, show primary + overflow for the rest
    const content = (
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          [`.${LoggedModelsTableGroupingEnabledClass} &`]: {
            paddingLeft: theme.spacing.lg,
          },
        }}
      >
        <RunColorPill color={getStableColorForRun(data.info?.model_id || '')} />
        <Overflow>
          {registeredModelVersions.map((modelVersion) => (
            <React.Fragment key={modelVersion.link}>
              <Link to={modelVersion.link} css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                {modelVersion.displayedName}
                <Tag
                  componentId="mlflow.logged_model.name_cell_version_tag"
                  css={{ marginRight: 0, verticalAlign: 'middle' }}
                >
                  v{modelVersion.version}
                </Tag>
              </Link>
            </React.Fragment>
          ))}
        </Overflow>
      </div>
    );

    return tooltipContent ? (
      <Tooltip content={tooltipContent} componentId="mlflow.logged_model.name_cell_tooltip">
        {content}
      </Tooltip>
    ) : (
      content
    );
  }

  // Fallback to original logged model behavior
  const linkUrl =
    data.info?.experiment_id && data.info?.model_id
      ? Routes.getExperimentLoggedModelDetailsPageRoute(data.info.experiment_id, data.info.model_id)
      : null;

  if (!linkUrl) {
    return <>{originalName}</>;
  }

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        [`.${LoggedModelsTableGroupingEnabledClass} &`]: {
          paddingLeft: theme.spacing.lg,
        },
      }}
    >
      <RunColorPill color={getStableColorForRun(data.info?.model_id || '')} />
      <Link to={linkUrl}>{originalName}</Link>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableRegisteredModelsCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableRegisteredModelsCell.tsx
Signals: React

```typescript
import type { LoggedModelProto } from '../../types';
import { GraphQLExperimentRun } from '../../types';
import { Link } from '../../../common/utils/RoutingUtils';
import { useExperimentLoggedModelRegisteredVersions } from './hooks/useExperimentLoggedModelRegisteredVersions';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { Overflow, Tag, useDesignSystemTheme } from '@databricks/design-system';
import { ReactComponent as RegisteredModelOkIcon } from '../../../common/static/registered-model-grey-ok.svg';

export const ExperimentLoggedModelTableRegisteredModelsCell = ({ data }: { data: LoggedModelProto }) => {
  const { theme } = useDesignSystemTheme();

  const loggedModels = useMemo(() => [data], [data]);

  const { modelVersions } = useExperimentLoggedModelRegisteredVersions({ loggedModels });

  if (!isEmpty(modelVersions)) {
    return (
      <Overflow>
        {modelVersions.map((modelVersion) => (
          <React.Fragment key={modelVersion.link}>
            <Link to={modelVersion.link} css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
              <RegisteredModelOkIcon />
              {modelVersion.displayedName}
              <Tag
                componentId="mlflow.logged_model.list.registered_model_cell_version_tag"
                css={{ marginRight: 0, verticalAlign: 'middle' }}
              >
                v{modelVersion.version}
              </Tag>
            </Link>
          </React.Fragment>
        ))}
      </Overflow>
    );
  }
  return '-';
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableSourceCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableSourceCell.tsx

```typescript
import type { LoggedModelProto } from '../../types';
import { ExperimentLoggedModelSourceBox } from './ExperimentLoggedModelSourceBox';

/**
 * A cell renderer/wrapper component for displaying the model's source in logged models table.
 */
export const ExperimentLoggedModelTableSourceCell = ({ data }: { data: LoggedModelProto }) => {
  return <ExperimentLoggedModelSourceBox loggedModel={data} />;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelTableSourceRunCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelTableSourceRunCell.tsx

```typescript
import type { GraphQLExperimentRun, LoggedModelProto } from '../../types';
import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';

interface LoggedModelWithSourceRun extends LoggedModelProto {
  sourceRun?: GraphQLExperimentRun;
}

export const ExperimentLoggedModelTableSourceRunCell = ({ data }: { data: LoggedModelWithSourceRun }) => {
  if (data.info?.experiment_id && data.info?.source_run_id) {
    return (
      <Link to={Routes.getRunPageRoute(data.info?.experiment_id, data.info?.source_run_id)} target="_blank">
        {data.sourceRun?.info?.runName ?? data.info?.source_run_id}
      </Link>
    );
  }
  return data.info?.source_run_id || <>-</>;
};
```

--------------------------------------------------------------------------------

---[FILE: LoggedModelIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/assets/LoggedModelIcon.tsx

```typescript
export const LoggedModelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H6M10 1L11.8204 2.69904M10 1L13.8051 4.55138C13.9294 4.66744 14 4.82991 14 5V5"
      stroke="#5F7281"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M9 1V4C9 4.55228 9.44772 5 10 5H14" stroke="#5F7281" strokeWidth="1.5" strokeLinecap="round" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.54688 8.46874C7.15855 8.46874 6.84375 8.78354 6.84375 9.17186C6.84375 9.56019 7.15855 9.87499 7.54688 9.87499C7.9352 9.87499 8.25001 9.56019 8.25001 9.17186C8.25001 8.78354 7.9352 8.46874 7.54688 8.46874ZM6 9.17186C6 8.31755 6.69256 7.62499 7.54688 7.62499C8.12447 7.62499 8.62812 7.94155 8.8938 8.41063L11.3531 7.87602C11.4381 7.10209 12.0941 6.49999 12.8906 6.49999C13.7449 6.49999 14.4375 7.19255 14.4375 8.04687C14.4375 8.68073 14.0563 9.22554 13.5106 9.46451L13.6692 10.7337C14.4212 10.8388 15 11.4846 15 12.2656C15 13.1199 14.3074 13.8125 13.4531 13.8125C12.9691 13.8125 12.5371 13.5902 12.2534 13.2422L10.7798 13.8869C10.7808 13.9088 10.7812 13.9309 10.7812 13.9531C10.7812 14.8074 10.0887 15.5 9.23436 15.5C8.38005 15.5 7.68748 14.8074 7.68748 13.9531C7.68748 13.4508 7.92695 13.0043 8.29795 12.7218L7.69494 10.7117C7.64621 10.7164 7.59682 10.7187 7.54688 10.7187C6.69256 10.7187 6 10.0262 6 9.17186ZM9.07426 9.41814C9.08407 9.35684 9.09027 9.29434 9.09265 9.23086L11.4923 8.7092C11.711 9.17002 12.1507 9.50555 12.6745 9.57877L12.8332 10.848C12.6211 10.9408 12.4339 11.0799 12.2842 11.2524L9.07426 9.41814ZM8.71576 10.1851C8.646 10.2655 8.56808 10.3386 8.48328 10.4032L9.0863 12.4132C9.13503 12.4086 9.18442 12.4062 9.23436 12.4062C9.76585 12.4062 10.2347 12.6743 10.5132 13.0826L11.9193 12.4674C11.9107 12.4014 11.9062 12.334 11.9062 12.2656C11.9062 12.1818 11.9129 12.0995 11.9257 12.0193L8.71576 10.1851ZM12.75 12.2656C12.75 11.8773 13.0648 11.5625 13.4531 11.5625C13.8414 11.5625 14.1562 11.8773 14.1562 12.2656C14.1562 12.6539 13.8414 12.9687 13.4531 12.9687C13.0648 12.9687 12.75 12.6539 12.75 12.2656ZM9.23436 13.25C8.84604 13.25 8.53124 13.5648 8.53124 13.9531C8.53124 14.3414 8.84604 14.6562 9.23436 14.6562C9.62269 14.6562 9.93749 14.3414 9.93749 13.9531C9.93749 13.5648 9.62269 13.25 9.23436 13.25ZM12.1875 8.04687C12.1875 7.65854 12.5023 7.34374 12.8906 7.34374C13.2789 7.34374 13.5938 7.65854 13.5938 8.04687C13.5938 8.43519 13.2789 8.74999 12.8906 8.74999C12.5023 8.74999 12.1875 8.43519 12.1875 8.04687Z"
      fill="#5F7281"
      stroke="#5F7281"
      strokeWidth="0.5"
    />
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelAllMetricsByDataset.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelAllMetricsByDataset.tsx
Signals: React

```typescript
import { orderBy } from 'lodash';
import type { LoggedModelProto } from '../../../types';
import { useMemo } from 'react';
import type { RunsChartsMetricByDatasetEntry } from '../../runs-charts/runs-charts.types';
import { getMetricByDatasetChartDataKey } from './useExperimentLoggedModelsChartsData';

export const useExperimentLoggedModelAllMetricsByDataset = (loggedModels: LoggedModelProto[]) =>
  useMemo(() => {
    const metricsByDataset: RunsChartsMetricByDatasetEntry[] = [];
    loggedModels.forEach((model) => {
      model.data?.metrics?.forEach(({ key: metricKey, dataset_name: datasetName }) => {
        if (metricKey && !metricsByDataset.find((e) => e.metricKey === metricKey && e.datasetName === datasetName)) {
          const dataAccessKey = getMetricByDatasetChartDataKey(metricKey, datasetName);
          metricsByDataset.push({ metricKey, datasetName, dataAccessKey });
        }
      });
    });
    return orderBy(metricsByDataset, ({ datasetName }) => !datasetName);
  }, [loggedModels]);
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelDeleteModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelDeleteModal.tsx
Signals: React

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { Alert, Modal, Spacer } from '@databricks/design-system';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { LoggedModelProto } from '../../../types';
import { fetchAPI, getAjaxUrl } from '@mlflow/mlflow/src/common/utils/FetchUtils';

export const useExperimentLoggedModelDeleteModal = ({
  loggedModel,
  onSuccess,
}: {
  loggedModel?: LoggedModelProto | null;
  onSuccess?: () => void | Promise<any>;
}) => {
  const [open, setOpen] = useState(false);

  const mutation = useMutation<
    unknown,
    Error,
    {
      loggedModelId: string;
    }
  >({
    mutationFn: async ({ loggedModelId }) => {
      await fetchAPI(getAjaxUrl(`ajax-api/2.0/mlflow/logged-models/${loggedModelId}`), 'DELETE');
    },
  });

  const { mutate, isLoading, reset: resetMutation } = mutation;

  const modalElement = (
    <Modal
      componentId="mlflow.logged_model.details.delete_modal"
      visible={open}
      onCancel={() => setOpen(false)}
      title={
        <FormattedMessage
          defaultMessage="Delete logged model"
          description="A header of the modal used for deleting logged models"
        />
      }
      okText={
        <FormattedMessage
          defaultMessage="Delete"
          description="A confirmation label of the modal used for deleting logged models"
        />
      }
      okButtonProps={{ danger: true, loading: isLoading }}
      onOk={async () => {
        if (!loggedModel?.info?.model_id) {
          setOpen(false);
          return;
        }
        mutate(
          {
            loggedModelId: loggedModel.info.model_id,
          },
          {
            onSuccess: () => {
              onSuccess?.();
              setOpen(false);
            },
          },
        );
      }}
      cancelText={
        <FormattedMessage
          defaultMessage="Cancel"
          description="A cancel label for the modal used for deleting logged models"
        />
      }
    >
      {mutation.error?.message && (
        <>
          <Alert
            componentId="mlflow.logged_model.details.delete_modal.error"
            closable={false}
            message={mutation.error.message}
            type="error"
          />
          <Spacer />
        </>
      )}
      <FormattedMessage
        defaultMessage="Are you sure you want to delete this logged model?"
        description="A content of the delete logged model confirmation modal"
      />
    </Modal>
  );

  const openModal = useCallback(() => {
    resetMutation();
    setOpen(true);
  }, [resetMutation]);

  return { modalElement, openModal };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelDetailsMetadataV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelDetailsMetadataV2.tsx

```typescript
import { GenericSkeleton, useDesignSystemTheme } from '@databricks/design-system';
import type { LoggedModelProto, RunEntity } from '../../../types';
import { useIntl } from 'react-intl';
import { ExperimentLoggedModelTableDateCell } from '../ExperimentLoggedModelTableDateCell';
import { ExperimentLoggedModelStatusIndicator } from '../ExperimentLoggedModelStatusIndicator';
import { DetailsOverviewCopyableIdBox } from '../../DetailsOverviewCopyableIdBox';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import type { AsideSections } from '@databricks/web-shared/utils';
import { KeyValueProperty, NoneCell } from '@databricks/web-shared/utils';
import { ExperimentLoggedModelSourceBox } from '../ExperimentLoggedModelSourceBox';
import { ExperimentLoggedModelAllDatasetsList } from '../ExperimentLoggedModelAllDatasetsList';
import { ExperimentLoggedModelDetailsModelVersionsList } from '../ExperimentLoggedModelDetailsModelVersionsList';
import { MLFLOW_LOGGED_MODEL_USER_TAG } from '../../../constants';

enum ExperimentLoggedModelDetailsMetadataSections {
  DETAILS = 'DETAILS',
  DATASETS = 'DATASETS',
  MODEL_VERSIONS = 'MODEL_VERSIONS',
}

export const useExperimentLoggedModelDetailsMetadataV2 = ({
  loggedModel,
  relatedRunsLoading,
  relatedSourceRun,
}: {
  loggedModel?: LoggedModelProto;
  relatedRunsLoading?: boolean;
  relatedSourceRun?: RunEntity;
}): AsideSections => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const detailsContent = loggedModel && (
    <>
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Created at',
          description: 'Label for the creation timestamp of a logged model on the logged model details page',
        })}
        value={<ExperimentLoggedModelTableDateCell value={loggedModel?.info?.creation_timestamp_ms} />}
      />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Created by',
          description: 'Label for the creator of a logged model on the logged model details page',
        })}
        value={loggedModel.info?.tags?.find((tag) => tag.key === MLFLOW_LOGGED_MODEL_USER_TAG)?.value ?? '-'}
      />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Status',
          description: 'Label for the status of a logged model on the logged model details page',
        })}
        value={<ExperimentLoggedModelStatusIndicator data={loggedModel} />}
      />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Model ID',
          description: 'Label for the model ID of a logged model on the logged model details page',
        })}
        value={
          <DetailsOverviewCopyableIdBox
            value={loggedModel.info?.model_id ?? ''}
            css={{
              whiteSpace: 'nowrap',
            }}
          />
        }
      />
      {loggedModel.info?.source_run_id &&
        loggedModel.info?.experiment_id &&
        (relatedRunsLoading || relatedSourceRun) && (
          <KeyValueProperty
            keyValue={intl.formatMessage({
              defaultMessage: 'Source run',
              description: 'Label for the source run name of a logged model on the logged model details page',
            })}
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
        <KeyValueProperty
          keyValue={intl.formatMessage({
            defaultMessage: 'Source run ID',
            description: 'Label for the source run ID of a logged model on the logged model details page',
          })}
          value={
            <DetailsOverviewCopyableIdBox
              value={loggedModel.info?.source_run_id ?? ''}
              element={
                loggedModel.info?.experiment_id ? (
                  <Link to={Routes.getRunPageRoute(loggedModel.info?.experiment_id, loggedModel.info?.source_run_id)}>
                    {loggedModel.info?.source_run_id}
                  </Link>
                ) : undefined
              }
            />
          }
        />
      )}
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Logged from',
          description:
            'Label for the source (where it was logged from) of a logged model on the logged model details page. It can be e.g. a notebook or a file.',
        })}
        value={
          <ExperimentLoggedModelSourceBox
            loggedModel={loggedModel}
            displayDetails
            css={{ paddingTop: theme.spacing.xs, paddingBottom: theme.spacing.xs, wordBreak: 'break-all' }}
          />
        }
      />
    </>
  );

  return [
    {
      id: ExperimentLoggedModelDetailsMetadataSections.DETAILS,
      title: intl.formatMessage({
        defaultMessage: 'About this logged model',
        description: 'Title for the details sidebar of a logged model on the logged model details page',
      }),
      content: detailsContent,
    },
    {
      id: ExperimentLoggedModelDetailsMetadataSections.DATASETS,
      title: intl.formatMessage({
        defaultMessage: 'Datasets used',
        description: 'Label for the datasets used by a logged model on the logged model details page',
      }),
      content: loggedModel && <ExperimentLoggedModelAllDatasetsList loggedModel={loggedModel} empty={<NoneCell />} />,
    },
    {
      id: ExperimentLoggedModelDetailsMetadataSections.MODEL_VERSIONS,
      title: intl.formatMessage({
        defaultMessage: 'Model versions',
        description: 'Label for the model versions of a logged model on the logged model details page',
      }),
      content: loggedModel && (
        <ExperimentLoggedModelDetailsModelVersionsList empty={<NoneCell />} loggedModel={loggedModel} />
      ),
    },
  ];
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelListPageMode.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelListPageMode.tsx

```typescript
import { coerceToEnum } from '@databricks/web-shared/utils';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

export enum ExperimentLoggedModelListPageMode {
  TABLE = 'TABLE',
  CHART = 'CHART',
}

const VIEW_MODE_QUERY_PARAM = 'viewMode';

export const useExperimentLoggedModelListPageMode = () => {
  const [params, setParams] = useSearchParams();
  const viewMode = coerceToEnum(
    ExperimentLoggedModelListPageMode,
    params.get(VIEW_MODE_QUERY_PARAM),
    ExperimentLoggedModelListPageMode.TABLE,
  );
  const setViewMode = (mode: ExperimentLoggedModelListPageMode) => {
    setParams({ [VIEW_MODE_QUERY_PARAM]: mode });
  };
  return { viewMode, setViewMode } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelListPageRowVisibility.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelListPageRowVisibility.tsx
Signals: React

```typescript
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { RUNS_VISIBILITY_MODE } from '../../experiment-page/models/ExperimentPageUIState';
import { determineIfRowIsHidden } from '../../experiment-page/utils/experimentPage.common-row-utils';
import { isUndefined } from 'lodash';

const ExperimentLoggedModelListPageRowVisibilityContext = createContext<{
  isRowHidden: (rowUuid: string, rowIndex: number) => boolean;
  setRowVisibilityMode: (visibilityMode: RUNS_VISIBILITY_MODE) => void;
  toggleRowVisibility: (rowUuid: string, rowIndex: number) => void;
  visibilityMode: RUNS_VISIBILITY_MODE;
  usingCustomVisibility: boolean;
}>({
  isRowHidden: () => false,
  setRowVisibilityMode: () => {},
  toggleRowVisibility: () => {},
  visibilityMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
  usingCustomVisibility: false,
});

// Utility function that determines if a particular table row should be hidden,
// based on the selected mode, position on the list and the visibility map.
export const isLoggedModelRowHidden = (
  rowsVisibilityMode: RUNS_VISIBILITY_MODE,
  runUuid: string,
  rowIndex: number,
  runsVisibilityMap: Record<string, boolean>,
) => {
  // If using rows visibility map, we should always use it to determine visibility
  if (!isUndefined(runsVisibilityMap[runUuid])) {
    return !runsVisibilityMap[runUuid];
  }
  if (rowsVisibilityMode === RUNS_VISIBILITY_MODE.HIDEALL) {
    return true;
  }
  if (rowsVisibilityMode === RUNS_VISIBILITY_MODE.FIRST_10_RUNS) {
    return rowIndex >= 10;
  }
  if (rowsVisibilityMode === RUNS_VISIBILITY_MODE.FIRST_20_RUNS) {
    return rowIndex >= 20;
  }

  return false;
};

export const ExperimentLoggedModelListPageRowVisibilityContextProvider = ({
  children,
  visibilityMap = {},
  visibilityMode,
  setRowVisibilityMode,
  toggleRowVisibility,
}: {
  visibilityMap?: Record<string, boolean>;
  visibilityMode: RUNS_VISIBILITY_MODE;
  children: React.ReactNode;
  setRowVisibilityMode: (visibilityMode: RUNS_VISIBILITY_MODE) => void;
  toggleRowVisibility: (rowUuid: string, rowIndex: number) => void;
}) => {
  const isRowHidden = useCallback(
    (rowUuid: string, rowIndex: number) => isLoggedModelRowHidden(visibilityMode, rowUuid, rowIndex, visibilityMap),
    [visibilityMap, visibilityMode],
  );

  const usingCustomVisibility = useMemo(() => Object.keys(visibilityMap).length > 0, [visibilityMap]);

  const contextValue = useMemo(
    () => ({ isRowHidden, setRowVisibilityMode, toggleRowVisibility, visibilityMode, usingCustomVisibility }),
    [isRowHidden, setRowVisibilityMode, toggleRowVisibility, visibilityMode, usingCustomVisibility],
  );

  return (
    <ExperimentLoggedModelListPageRowVisibilityContext.Provider value={contextValue}>
      {children}
    </ExperimentLoggedModelListPageRowVisibilityContext.Provider>
  );
};

export const useExperimentLoggedModelListPageRowVisibilityContext = () =>
  useContext(ExperimentLoggedModelListPageRowVisibilityContext);
```

--------------------------------------------------------------------------------

````

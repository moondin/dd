---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 461
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 461 of 991)

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

---[FILE: EvaluationCreatePromptRunOutput.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationCreatePromptRunOutput.tsx
Signals: React

```typescript
import {
  Alert,
  Button,
  FormUI,
  Input,
  PlayIcon,
  StopIcon,
  TableSkeleton,
  Tooltip,
  Typography,
  WarningIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import {
  PROMPTLAB_METADATA_COLUMN_LATENCY,
  PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS,
} from '../../prompt-engineering/PromptEngineering.utils';
import { useMemo } from 'react';
import { type ModelGatewayResponseType } from '../../../sdk/ModelGatewayService';

const { TextArea } = Input;

interface EvaluationCreatePromptRunOutputProps {
  evaluationMetadata: Partial<ModelGatewayResponseType['metadata']>;
  isEvaluating?: boolean;
  isOutputDirty?: boolean;
  evaluationOutput: string;
  evaluationError: string | null;
  evaluateButtonTooltip: string | null;
  onEvaluateClick?: () => void;
  onCancelClick?: () => void;
  disabled?: boolean;
}

/**
 * Part of EvaluationCreatePromptRunModal, houses evaluate/cancel buttons
 * and evaluation output with the metadata
 */
export const EvaluationCreatePromptRunOutput = ({
  evaluationMetadata,
  isEvaluating,
  isOutputDirty,
  evaluationOutput,
  evaluationError,
  evaluateButtonTooltip,
  disabled,
  onEvaluateClick,
  onCancelClick,
}: EvaluationCreatePromptRunOutputProps) => {
  const { theme } = useDesignSystemTheme();

  const metadataOutput = useMemo(() => {
    if (!evaluationMetadata) {
      return null;
    }
    if (isEvaluating) {
      return null;
    }
    return (
      <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
        {PROMPTLAB_METADATA_COLUMN_LATENCY in evaluationMetadata && (
          <Typography.Hint size="sm">
            {Math.round(Number(evaluationMetadata[PROMPTLAB_METADATA_COLUMN_LATENCY]))} ms
            {'MLFLOW_total_tokens' in evaluationMetadata ? ',' : ''}
          </Typography.Hint>
        )}
        {PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS in evaluationMetadata && (
          <Typography.Hint size="sm">
            <FormattedMessage
              defaultMessage="{totalTokens} total tokens"
              description="Experiment page > artifact compare view > results table > total number of evaluated tokens"
              values={{ totalTokens: evaluationMetadata[PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS] }}
            />
          </Typography.Hint>
        )}
      </div>
    );
  }, [evaluationMetadata, isEvaluating, theme]);

  return (
    <>
      <div css={{ marginBottom: theme.spacing.md }}>
        <Tooltip
          componentId="mlflow.experiment-tracking.evaluation-prompt-output.evaluate"
          content={evaluateButtonTooltip}
        >
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationcreatepromptrunoutput.tsx_85"
            data-testid="button-evaluate"
            icon={<PlayIcon />}
            onClick={onEvaluateClick}
            disabled={disabled}
            loading={isEvaluating}
          >
            <FormattedMessage
              defaultMessage="Evaluate"
              description='Experiment page > new run modal > "evaluate" button label'
            />
          </Button>
        </Tooltip>
        {isEvaluating && (
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationcreatepromptrunoutput.tsx_99"
            data-testid="button-cancel"
            icon={<StopIcon />}
            onClick={onCancelClick}
            css={{ marginLeft: theme.spacing.sm }}
          >
            <FormattedMessage
              defaultMessage="Cancel"
              description='Experiment page > new run modal > "cancel" button label'
            />
          </Button>
        )}
      </div>
      <FormUI.Label>
        <FormattedMessage
          defaultMessage="Output"
          description="Experiment page > new run modal > evaluation output field label"
        />
        {isOutputDirty && (
          <Tooltip
            componentId="mlflow.experiment-tracking.evaluation-prompt-output.add"
            content={
              <FormattedMessage
                defaultMessage="Model, input data or prompt have changed since last evaluation of the output"
                description="Experiment page > new run modal > dirty output (out of sync with new data)"
              />
            }
          >
            <span>
              <WarningIcon css={{ marginLeft: theme.spacing.xs }} />
            </span>
          </Tooltip>
        )}
      </FormUI.Label>
      <FormUI.Hint>
        <FormattedMessage
          defaultMessage="This is the output generated by the LLM using the prompt template and input values defined above."
          description="Experiment page > new run modal > evaluation output field hint"
        />
      </FormUI.Hint>
      {!evaluationError && isEvaluating && (
        <div css={{ marginTop: theme.spacing.sm }}>
          <TableSkeleton lines={5} />
        </div>
      )}
      {!isEvaluating && (
        <TextArea
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationcreatepromptrunoutput.tsx_144"
          rows={5}
          css={{ cursor: 'default' }}
          data-testid="prompt-output"
          value={evaluationOutput}
          readOnly
        />
      )}
      {!isEvaluating && evaluationError && <FormUI.Message message={evaluationError} type="error" />}
      <div css={{ marginTop: theme.spacing.sm }}>{metadataOutput}</div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationCreateRunPromptTemplateErrors.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationCreateRunPromptTemplateErrors.tsx

```typescript
import { Typography } from '@databricks/design-system';
import type { getPromptInputVariableNameViolations } from '../../prompt-engineering/PromptEngineering.utils';
import { FormattedMessage, defineMessage, useIntl } from 'react-intl';

const whitespaceViolationMessage = defineMessage({
  defaultMessage: 'The following variable names contain spaces which is disallowed: {invalidNames}',
  description: 'Experiment page > new run modal > variable name validation > including spaces error',
});

export const EvaluationCreateRunPromptTemplateErrors = ({
  violations,
}: {
  violations: ReturnType<typeof getPromptInputVariableNameViolations>;
}) => {
  const { namesWithSpaces } = violations;
  const { formatMessage } = useIntl();
  return (
    <>
      {namesWithSpaces.length > 0 && (
        <Typography.Text
          color="warning"
          size="sm"
          aria-label={formatMessage(whitespaceViolationMessage, {
            invalidNames: namesWithSpaces.join(', '),
          })}
        >
          <FormattedMessage
            {...whitespaceViolationMessage}
            values={{
              invalidNames: (
                <>
                  {namesWithSpaces.map((nameWithSpace) => (
                    <code key={nameWithSpace}>{nameWithSpace}</code>
                  ))}
                </>
              ),
            }}
          />
        </Typography.Text>
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationGroupByHeaderCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationGroupByHeaderCellRenderer.tsx

```typescript
import type { IHeaderParams } from '@ag-grid-community/core';
import { Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { truncate } from 'lodash';
import { EvaluationTableHeader } from './EvaluationTableHeader';

interface EvaluationGroupByHeaderCellRendererProps extends IHeaderParams {
  displayName: string;
  onAddNewInputs: () => void;
  displayAddNewInputsButton?: boolean;
}

/**
 * Component used as a column header for "group by" columns
 */
export const EvaluationGroupByHeaderCellRenderer = ({ displayName }: EvaluationGroupByHeaderCellRendererProps) => {
  const { theme } = useDesignSystemTheme();

  return (
    <EvaluationTableHeader css={{ justifyContent: 'flex-start', padding: theme.spacing.sm }}>
      <Tooltip
        componentId="mlflow.experiment-tracking.evaluation-group-header.toggle"
        content={truncate(displayName, { length: 250 })}
      >
        <span>
          <Typography.Text bold css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayName}
          </Typography.Text>
        </span>
      </Tooltip>
    </EvaluationTableHeader>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationImageCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationImageCellRenderer.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { ICellRendererParams } from '@ag-grid-community/core';
import { FormattedMessage } from 'react-intl';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import type { UseEvaluationArtifactTableDataResult } from '../hooks/useEvaluationArtifactTableData';
import { ImagePlot } from '@mlflow/mlflow/src/experiment-tracking/components/runs-charts/components/charts/ImageGridPlot.common';
import type { EvaluateCellImage } from '@mlflow/mlflow/src/experiment-tracking/types';

interface EvaluationImageCellRendererProps extends ICellRendererParams {
  value: EvaluateCellImage;
  isGroupByColumn?: boolean;
  context: { highlightedText: string };

  data: UseEvaluationArtifactTableDataResult extends (infer U)[] ? U : UseEvaluationArtifactTableDataResult;

  // Valid only for run columns
  run?: RunRowType;
}

/**
 * Component used to render a single text cell in the evaluation artifacts comparison table.
 */
/* eslint-disable complexity */
export const EvaluationImageCellRenderer = ({ value }: EvaluationImageCellRendererProps) => {
  const { theme } = useDesignSystemTheme();

  const backgroundColor = theme.colors.backgroundPrimary;

  return (
    <div
      css={{
        height: '100%',
        whiteSpace: 'normal',
        padding: theme.spacing.sm,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor,
        '&:hover': {
          backgroundColor: theme.colors.actionDefaultBackgroundHover,
        },
      }}
    >
      {!value || !value.url || !value.compressed_url ? (
        <Typography.Text color="info" css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <FormattedMessage
            defaultMessage="(empty)"
            description="Experiment page > artifact compare view > results table > no result (empty cell)"
          />
        </Typography.Text>
      ) : (
        <span
          css={{
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '7',
            width: '100%',
            height: '100%',
          }}
        >
          <ImagePlot imageUrl={value.url} compressedImageUrl={value.compressed_url} />
        </span>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationRunHeaderCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationRunHeaderCellRenderer.tsx
Signals: React

```typescript
import {
  Button,
  DropdownMenu,
  OverflowIcon,
  PlayIcon,
  StopIcon,
  VisibleIcon,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';
import { Link } from '../../../../common/utils/RoutingUtils';
import ExperimentRoutes from '../../../routes';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { EvaluationRunHeaderModelIndicator } from './EvaluationRunHeaderModelIndicator';
import { shouldEnablePromptLab } from '../../../../common/utils/FeatureUtils';
import { EvaluationRunHeaderDatasetIndicator } from './EvaluationRunHeaderDatasetIndicator';
import type { RunDatasetWithTags } from '../../../types';
import { usePromptEngineeringContext } from '../contexts/PromptEngineeringContext';
import { FormattedMessage, useIntl } from 'react-intl';
import React, { useMemo } from 'react';
import { EvaluationTableHeader } from './EvaluationTableHeader';
import { canEvaluateOnRun } from '../../prompt-engineering/PromptEngineering.utils';
import { useGetExperimentRunColor } from '../../experiment-page/hooks/useExperimentRunColor';
import { RunColorPill } from '../../experiment-page/components/RunColorPill';

interface EvaluationRunHeaderCellRendererProps {
  run: RunRowType;
  onHideRun: (runUuid: string) => void;
  onDuplicateRun: (run: RunRowType) => void;
  onDatasetSelected: (dataset: RunDatasetWithTags, run: RunRowType) => void;
  groupHeaderContent?: React.ReactNode;
}

/**
 * Component used as a column header for output ("run") columns
 */
export const EvaluationRunHeaderCellRenderer = ({
  run,
  onHideRun,
  onDuplicateRun,
  onDatasetSelected,
  groupHeaderContent = null,
}: EvaluationRunHeaderCellRendererProps) => {
  const { theme } = useDesignSystemTheme();
  const { getEvaluableRowCount, evaluateAllClick, runColumnsBeingEvaluated, canEvaluateInRunColumn } =
    usePromptEngineeringContext();
  const intl = useIntl();
  const evaluableRowCount = getEvaluableRowCount(run);
  const getRunColor = useGetExperimentRunColor();
  const evaluateAllButtonEnabled = evaluableRowCount > 0;

  const evaluatingAllInProgress = runColumnsBeingEvaluated.includes(run.runUuid);

  const evaluateAllTooltipContent = useMemo(() => {
    if (!evaluateAllButtonEnabled) {
      return intl.formatMessage({
        defaultMessage: 'There are no evaluable rows within this column',
        description:
          'Experiment page > artifact compare view > run column header > Disabled "Evaluate all" button tooltip when no rows are evaluable',
      });
    }
    if (evaluateAllButtonEnabled && !evaluatingAllInProgress) {
      return intl.formatMessage(
        {
          defaultMessage: 'Process {evaluableRowCount} rows without evaluation output',
          description: 'Experiment page > artifact compare view > run column header > "Evaluate all" button tooltip',
        },
        {
          evaluableRowCount,
        },
      );
    }

    return null;
  }, [evaluableRowCount, evaluateAllButtonEnabled, evaluatingAllInProgress, intl]);

  return (
    <EvaluationTableHeader
      css={{
        justifyContent: 'flex-start',
        padding: theme.spacing.sm,
        paddingBottom: 0,
        paddingTop: theme.spacing.sm,
        flexDirection: 'column',
        gap: theme.spacing.xs / 2,
        overflow: 'hidden',
      }}
      groupHeaderContent={groupHeaderContent}
    >
      <div
        css={{
          width: '100%',
          display: 'flex',
        }}
      >
        <span css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
          <RunColorPill color={getRunColor(run.runUuid)} />
          <Link to={ExperimentRoutes.getRunPageRoute(run.experimentId || '', run.runUuid)} target="_blank">
            {run.runName}
          </Link>
        </span>
        <div css={{ flexBasis: theme.spacing.sm, flexShrink: 0 }} />

        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheadercellrenderer.tsx_112"
          onClick={() => onHideRun(run.runUuid)}
          size="small"
          icon={<VisibleIcon />}
          css={{ flexShrink: 0 }}
        />
        <div css={{ flex: 1 }} />
        {shouldEnablePromptLab() && canEvaluateInRunColumn(run) && (
          <>
            <div css={{ flexBasis: theme.spacing.sm }} />
            <Tooltip componentId="mlflow.run.artifact_view.evaluate_all.tooltip" content={evaluateAllTooltipContent}>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheadercellrenderer.tsx_118"
                disabled={!evaluateAllButtonEnabled}
                size="small"
                onClick={() => evaluateAllClick(run)}
                icon={evaluatingAllInProgress ? <StopIcon /> : <PlayIcon />}
              >
                {evaluatingAllInProgress ? (
                  <FormattedMessage
                    defaultMessage="Stop evaluating"
                    description='Experiment page > artifact compare view > run column header > "Evaluate all" button label when the column is being evaluated'
                  />
                ) : (
                  <FormattedMessage
                    defaultMessage="Evaluate all"
                    description='Experiment page > artifact compare view > run column header > "Evaluate all" button label'
                  />
                )}
              </Button>
            </Tooltip>
          </>
        )}
        <div css={{ flexBasis: theme.spacing.sm }} />
        {shouldEnablePromptLab() && canEvaluateOnRun(run) && (
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger asChild>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheadercellrenderer.tsx_143"
                size="small"
                icon={<OverflowIcon />}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheadercellrenderer.tsx_150"
                onClick={() => onDuplicateRun(run)}
              >
                <FormattedMessage
                  defaultMessage="Duplicate run"
                  description='Experiment page > artifact compare view > run column header > "duplicate run" button label'
                />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </div>

      {shouldEnablePromptLab() && canEvaluateOnRun(run) ? (
        <EvaluationRunHeaderModelIndicator run={run} />
      ) : (
        <EvaluationRunHeaderDatasetIndicator run={run} onDatasetSelected={onDatasetSelected} />
      )}
    </EvaluationTableHeader>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationRunHeaderDatasetIndicator.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationRunHeaderDatasetIndicator.tsx
Signals: React

```typescript
import { Button, Popover, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentViewDatasetWithContext } from '../../experiment-page/components/runs/ExperimentViewDatasetWithContext';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import type { RunDatasetWithTags } from '../../../types';
import { useCallback } from 'react';

interface EvaluationRunHeaderDatasetIndicatorProps {
  run: RunRowType;
  onDatasetSelected: (dataset: RunDatasetWithTags, run: RunRowType) => void;
}

export const EvaluationRunHeaderDatasetIndicator = ({
  run,
  onDatasetSelected,
}: EvaluationRunHeaderDatasetIndicatorProps) => {
  const { theme } = useDesignSystemTheme();

  const handleDatasetSelected = useCallback(
    (datasetWithTags: RunDatasetWithTags) => onDatasetSelected(datasetWithTags, run),
    [onDatasetSelected, run],
  );

  if (run.datasets?.length < 1) {
    return null;
  }

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        overflow: 'hidden',
      }}
    >
      <div css={{ flexShrink: 1, flexGrow: 1, overflow: 'hidden' }}>
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheaderdatasetindicator.tsx_37"
          type="link"
          onClick={() => handleDatasetSelected(run.datasets[0])}
        >
          <ExperimentViewDatasetWithContext
            datasetWithTags={run.datasets[0]}
            displayTextAsLink
            css={{ marginTop: theme.spacing.xs / 2, marginBottom: theme.spacing.xs / 2 }}
          />
        </Button>
      </div>
      {run.datasets.length > 1 && (
        <div css={{ flexShrink: 0, flexGrow: 1, display: 'flex', alignItems: 'flex-end' }}>
          <Popover.Root
            componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheaderdatasetindicator.tsx_51"
            modal={false}
          >
            <Popover.Trigger asChild>
              <Button
                componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheaderdatasetindicator.tsx_49"
                size="small"
                style={{ borderRadius: '8px', width: '40px' }}
              >
                <Typography.Text color="secondary">+{run.datasets.length - 1}</Typography.Text>
              </Button>
            </Popover.Trigger>
            <Popover.Content align="start">
              {run.datasets
                .slice(1)
                .filter(Boolean)
                .map((datasetWithTags) => (
                  <div
                    css={{
                      height: theme.general.heightSm,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    key={`${datasetWithTags.dataset.name}-${datasetWithTags.dataset.digest}`}
                  >
                    <Button
                      componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheaderdatasetindicator.tsx_66"
                      type="link"
                      onClick={() => handleDatasetSelected(datasetWithTags)}
                    >
                      <ExperimentViewDatasetWithContext datasetWithTags={datasetWithTags} displayTextAsLink />
                    </Button>
                  </div>
                ))}
            </Popover.Content>
          </Popover.Root>
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationRunHeaderModelIndicator.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationRunHeaderModelIndicator.tsx
Signals: Redux/RTK

```typescript
import { Button, Popover, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../../redux-types';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import {
  canEvaluateOnRun,
  extractEvaluationPrerequisitesForRun,
} from '../../prompt-engineering/PromptEngineering.utils';
import { usePromptEngineeringContext } from '../contexts/PromptEngineeringContext';

interface EvaluationRunHeaderModelIndicatorProps {
  run: RunRowType;
}
export const EvaluationRunHeaderModelIndicator = ({ run }: EvaluationRunHeaderModelIndicatorProps) => {
  const { theme } = useDesignSystemTheme();

  const { isHeaderExpanded } = usePromptEngineeringContext();

  const promptEvaluationDataForRun = extractEvaluationPrerequisitesForRun(run);

  const gatewayRoute = useSelector(({ modelGateway }: ReduxState) => {
    const gatewayKey = `${promptEvaluationDataForRun.routeType}:${promptEvaluationDataForRun.routeName}`;
    return promptEvaluationDataForRun.routeName ? modelGateway.modelGatewayRoutes[gatewayKey] : null;
  });

  if (!canEvaluateOnRun(run) || !promptEvaluationDataForRun) {
    return null;
  }

  const { parameters, promptTemplate, routeName } = promptEvaluationDataForRun;
  const { stop: stopSequences = [] } = parameters;

  return (
    <div
      css={{
        marginTop: theme.spacing.xs,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        overflowX: 'hidden',
        width: '100%',
      }}
    >
      {gatewayRoute && 'mlflowDeployment' in gatewayRoute && gatewayRoute.mlflowDeployment && (
        <Typography.Hint>{gatewayRoute.mlflowDeployment.name}</Typography.Hint>
      )}
      {isHeaderExpanded && (
        <>
          <Typography.Hint>
            <FormattedMessage
              // eslint-disable-next-line formatjs/enforce-placeholders -- TODO(FEINF-2480)
              defaultMessage="Temperature: {temperature}"
              description="Experiment page > artifact compare view > run column header prompt metadata > temperature parameter"
              values={parameters}
            />
          </Typography.Hint>
          <Typography.Hint>
            <FormattedMessage
              // eslint-disable-next-line formatjs/enforce-placeholders -- TODO(FEINF-2480)
              defaultMessage="Max. tokens: {max_tokens}"
              description="Experiment page > artifact compare view > run column header prompt metadata > max tokens parameter"
              values={parameters}
            />
          </Typography.Hint>
          {stopSequences.length ? (
            <Typography.Hint css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <FormattedMessage
                defaultMessage="Stop sequences: {stopSequences}"
                description="Experiment page > artifact compare view > run column header prompt metadata > stop sequences parameter"
                values={{ stopSequences: stopSequences?.join(', ') }}
              />
            </Typography.Hint>
          ) : null}
          <div css={{ fontSize: 0 }}>
            <Popover.Root componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheadermodelindicator.tsx_107">
              <Popover.Trigger asChild>
                <Button
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationrunheadermodelindicator.tsx_115"
                  type="link"
                  size="small"
                  css={{
                    fontSize: theme.typography.fontSizeSm,
                  }}
                >
                  <FormattedMessage
                    defaultMessage="View prompt template"
                    description='Experiment page > artifact compare view > run column header prompt metadata > "view prompt template" button label'
                  />
                </Button>
              </Popover.Trigger>
              <Popover.Content css={{ maxWidth: 300 }}>
                <Popover.Arrow />
                {promptTemplate}
              </Popover.Content>
            </Popover.Root>
          </div>
        </>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationTableActionsCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationTableActionsCellRenderer.tsx

```typescript
import { Button, PlusIcon, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

interface EvaluationTableActionsCellRendererProps {
  onAddNewInputs: () => void;
  displayAddNewInputsButton: boolean;
}

export const EvaluationTableActionsCellRenderer = ({
  onAddNewInputs,
  displayAddNewInputsButton,
}: EvaluationTableActionsCellRendererProps) => {
  const { theme } = useDesignSystemTheme();
  if (!displayAddNewInputsButton) {
    return null;
  }

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing.xs,
      }}
    >
      <Tooltip
        componentId="mlflow.experiment-tracking.evaluation-table-actions.add-row"
        side="right"
        content={
          <FormattedMessage
            defaultMessage="Add row"
            description="Experiment page > artifact compare view > add new row button"
          />
        }
      >
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationtableactionscellrenderer.tsx_37"
          icon={<PlusIcon />}
          onClick={onAddNewInputs}
        />
      </Tooltip>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationTableActionsColumnRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationTableActionsColumnRenderer.tsx

```typescript
import { Button, ChevronDownIcon, ChevronRightIcon, Tooltip } from '@databricks/design-system';
import { EvaluationTableHeader } from './EvaluationTableHeader';
import { usePromptEngineeringContext } from '../contexts/PromptEngineeringContext';
import { FormattedMessage } from 'react-intl';

const enlargedIconStyle = { svg: { width: 20, height: 20 } };

export const EvaluationTableActionsColumnRenderer = () => {
  const { toggleExpandedHeader, isHeaderExpanded } = usePromptEngineeringContext();

  return (
    <EvaluationTableHeader>
      <Tooltip
        componentId="mlflow.experiment-tracking.evaluation-table-column.toggle-detail"
        side="right"
        content={
          <FormattedMessage
            defaultMessage="Toggle detailed view"
            description='Experiment page > artifact compare view > table header > label for "toggle detailed view" button'
          />
        }
      >
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationtableactionscolumnrenderer.tsx_22"
          icon={
            isHeaderExpanded ? (
              <ChevronDownIcon css={enlargedIconStyle} />
            ) : (
              <ChevronRightIcon css={enlargedIconStyle} />
            )
          }
          onClick={toggleExpandedHeader}
        />
      </Tooltip>
    </EvaluationTableHeader>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationTableHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationTableHeader.tsx
Signals: React

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import type { PropsWithChildren, ReactNode } from 'react';

interface Props {
  className?: string;
  groupHeaderContent?: ReactNode;
  isGroupByHeader?: false;
}

export const EvaluationTableHeader = ({ children, className, groupHeaderContent = null }: PropsWithChildren<Props>) => {
  const { theme } = useDesignSystemTheme();

  return (
    // Header cell wrapper element
    <div
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Spacer element serving as a group header */}
      <div
        css={{
          width: '100%',
          flexBasis: 40,
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.borderDecorative}`,
          boxSizing: 'border-box',
        }}
        className="header-group-cell"
      >
        {groupHeaderContent}
      </div>
      {/* Main header cell content */}
      <div
        css={{
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: theme.spacing.xs,
          borderRight: `1px solid ${theme.colors.borderDecorative}`,
        }}
        className={className}
      >
        {children}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationTextCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationTextCellRenderer.tsx
Signals: React, Redux/RTK

```typescript
import { TableSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { ICellRendererParams } from '@ag-grid-community/core';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { usePromptEngineeringContext } from '../contexts/PromptEngineeringContext';
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../../redux-types';
import { EvaluationCellEvaluateButton } from './EvaluationCellEvaluateButton';
import { shouldEnablePromptLab } from '../../../../common/utils/FeatureUtils';
import type { UseEvaluationArtifactTableDataResult } from '../hooks/useEvaluationArtifactTableData';
import { JsonPreview } from '../../../../common/components/JsonFormatting';

// Truncate the text in the cell, it doesn't make sense to populate
// more data into the DOM since cells have hidden overflow anyway
const MAX_TEXT_LENGTH = 512;

interface EvaluationTextCellRendererProps extends ICellRendererParams {
  value: string;
  isGroupByColumn?: boolean;
  context: { highlightedText: string };

  data: UseEvaluationArtifactTableDataResult extends (infer U)[] ? U : UseEvaluationArtifactTableDataResult;

  // Valid only for run columns
  run?: RunRowType;
}

/**
 * Internal use component - breaks down the rendered text into chunks and highlights
 * particular part found by the provided substring.
 */
const HighlightedText = React.memo(({ text, highlight }: { text: string; highlight: string }) => {
  const { theme } = useDesignSystemTheme();
  if (!highlight) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part.toLowerCase() === highlight.toLowerCase() ? (
            <span css={{ backgroundColor: theme.colors.yellow200 }}>{part}</span>
          ) : (
            part
          )}
        </React.Fragment>
      ))}
    </>
  );
});

/**
 * Component used to render a single text cell in the evaluation artifacts comparison table.
 */
/* eslint-disable complexity */
export const EvaluationTextCellRenderer = ({
  value,
  context,
  isGroupByColumn,
  run,
  data,
}: EvaluationTextCellRendererProps) => {
  const { theme } = useDesignSystemTheme();
  const { pendingDataLoading, canEvaluateInRunColumn } = usePromptEngineeringContext();
  const isGatewayRoutesLoading = useSelector(
    ({ modelGateway: { modelGatewayRoutesLoading, modelGatewayRoutesLoadingLegacy } }: ReduxState) => {
      return modelGatewayRoutesLoading.loading;
    },
  );

  const isCellEvaluating = run && pendingDataLoading[run.runUuid]?.[data?.key];
  const outputMetadata = (run && data.outputMetadataByRunUuid?.[run.runUuid]) || null;

  const backgroundColor =
    outputMetadata?.isPending || data.isPendingInputRow
      ? theme.colors.backgroundSecondary
      : theme.colors.backgroundPrimary;

  const structuredJSONValue = React.useMemo(() => {
    try {
      const objectData = JSON.parse(value);
      return objectData;
    } catch (e) {
      return null;
    }
  }, [value]);

  return (
    <div
      css={{
        height: '100%',
        whiteSpace: 'normal',
        padding: theme.spacing.sm,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor,
        '&:hover': {
          backgroundColor: theme.colors.actionDefaultBackgroundHover,
        },
      }}
    >
      {isCellEvaluating ? (
        <TableSkeleton lines={3} />
      ) : (
        <>
          {!value ? (
            <Typography.Text color="info" css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <FormattedMessage
                defaultMessage="(empty)"
                description="Experiment page > artifact compare view > results table > no result (empty cell)"
              />
            </Typography.Text>
          ) : structuredJSONValue ? (
            <JsonPreview json={JSON.stringify(structuredJSONValue, null, 2)} />
          ) : (
            <span
              css={{
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '7',
              }}
            >
              {isGroupByColumn && context.highlightedText ? (
                <HighlightedText text={value} highlight={context.highlightedText} />
              ) : typeof value === 'string' ? (
                value.substring(0, MAX_TEXT_LENGTH)
              ) : (
                /**
                 * There is a transient state when this value is an object used
                 * for EvaluationImageCellRenderer. This will prevent displaying
                 * [object Object] in the cell and cause AgGrid errors.
                 */
                typeof value !== 'object' && value
              )}
            </span>
          )}
        </>
      )}
      {shouldEnablePromptLab() && run && canEvaluateInRunColumn(run) && (
        <div
          css={{
            position: 'absolute',
            left: 8,
            bottom: 8,
            right: 8,
            display: 'flex',
            gap: theme.spacing.sm,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            {!value && (
              <EvaluationCellEvaluateButton
                disabled={isCellEvaluating}
                isLoading={isGatewayRoutesLoading}
                run={run}
                rowKey={data.key}
              />
            )}
            {(outputMetadata?.isPending || data.isPendingInputRow) && (
              <Typography.Hint size="sm" css={{ fontStyle: 'italic' }}>
                <FormattedMessage
                  defaultMessage="Unsaved"
                  description="Experiment page > artifact compare view > results table > unsaved indicator"
                />
              </Typography.Hint>
            )}
          </div>
          {outputMetadata && !isCellEvaluating && (
            <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
              {outputMetadata.evaluationTime && (
                <Typography.Hint size="sm">
                  {Math.round(outputMetadata.evaluationTime)} ms
                  {outputMetadata.totalTokens ? ',' : ''}
                </Typography.Hint>
              )}
              {outputMetadata.totalTokens && (
                <Typography.Hint size="sm">
                  <FormattedMessage
                    defaultMessage="{totalTokens} total tokens"
                    description="Experiment page > artifact compare view > results table > total number of evaluated tokens"
                    values={{ totalTokens: outputMetadata.totalTokens }}
                  />
                </Typography.Hint>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

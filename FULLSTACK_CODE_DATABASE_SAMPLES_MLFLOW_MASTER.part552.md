---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 552
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 552 of 991)

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

---[FILE: CustomCodeScorerFormRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/CustomCodeScorerFormRenderer.tsx
Signals: React

```typescript
import React from 'react';
import { useDesignSystemTheme, Typography, CopyIcon } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';
import { useWatch, type Control } from 'react-hook-form';
import type { SCORER_TYPE } from './constants';
import { COMPONENT_ID_PREFIX, type ScorerFormMode, SCORER_FORM_MODE } from './constants';
import EvaluateTracesSectionRenderer from './EvaluateTracesSectionRenderer';

const getDocLink = () => {
  return 'https://mlflow.org/docs/latest/genai/eval-monitor/scorers/custom/';
};

/**
 * Code block component with copy button using OSS CodeSnippet
 */
const CodeBlockWithCopy: React.FC<{
  code: string;
  language: 'bash' | 'python';
  theme: any;
}> = ({ code, language, theme }) => {
  // Map bash to text since CodeSnippet doesn't support bash
  const snippetLanguage = language === 'bash' ? 'text' : language;

  return (
    <div css={{ position: 'relative' }}>
      <CopyButton
        css={{ zIndex: 1, position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
        showLabel={false}
        copyText={code}
        icon={<CopyIcon />}
      />
      <CodeSnippet
        language={snippetLanguage}
        theme={theme.isDarkMode ? 'duotoneDark' : 'light'}
        style={{ padding: theme.spacing.sm }}
      >
        {code}
      </CodeSnippet>
    </div>
  );
};

export interface CustomCodeScorerFormData {
  name: string;
  code: string;
  sampleRate: number;
  filterString?: string;
  scorerType: typeof SCORER_TYPE.CUSTOM_CODE;
}

interface CustomCodeScorerFormRendererProps {
  control: Control<CustomCodeScorerFormData>;
  mode: ScorerFormMode;
}

const CustomCodeScorerFormRenderer: React.FC<CustomCodeScorerFormRendererProps> = ({ control, mode }) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const code = useWatch({ control, name: 'code' });

  const sectionStyles = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: theme.spacing.sm,
    paddingLeft: mode === SCORER_FORM_MODE.DISPLAY ? theme.spacing.lg : 0,
  };
  const stopPropagationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (mode === SCORER_FORM_MODE.CREATE) {
    const step1Code = `pip install --upgrade "mlflow>=3.1.0"`;

    const step2Code = `from mlflow.genai.scorers import scorer, ScorerSamplingConfig
from typing import Optional, Any
from mlflow.entities import Feedback
import mlflow.entities

@scorer
def my_custom_scorer(
  inputs: Optional[dict[str, Any]],  # The agent's raw input, parsed from the Trace or dataset, as a Python dict
  outputs: Optional[Any],  # The agent's raw output, parsed from the Trace or dataset
  expectations: Optional[dict[str, Any]],  # The expectations passed to evaluate(data=...), as a Python dict
  trace: Optional[mlflow.entities.Trace]  # The app's resulting Trace containing spans and other metadata
) -> int | float | bool | str | Feedback | list[Feedback]:
    """
    Custom scorer template - implement your scoring logic here.
    Return a score as int, float, bool, str, or Feedback object(s).
    """
    # TODO: Implement your custom scoring logic
    return 1.0`;

    const step3Code = `custom_scorer = my_custom_scorer.register(name="my_custom_scorer")`;

    return (
      <div css={{ display: 'flex', flexDirection: 'column' }}>
        <Typography.Text>
          <FormattedMessage
            defaultMessage="Follow these steps to create a custom judge using your own code. {link}"
            description="Brief instructions for custom judge functions"
            values={{
              link: (
                <Typography.Link
                  componentId={`${COMPONENT_ID_PREFIX}.custom-scorer-form.documentation-link`}
                  href={getDocLink()}
                  openInNewTab
                >
                  <FormattedMessage defaultMessage="Learn more" description="Documentation link text" />
                </Typography.Link>
              ),
            }}
          />
        </Typography.Text>
        {/* Step 1: Install MLflow */}
        <div>
          <Typography.Title level={4} css={{ marginBottom: theme.spacing.sm }}>
            <FormattedMessage
              defaultMessage="Step 1: Install MLflow"
              description="Step 1 title for custom judge creation"
            />
          </Typography.Title>
          <Typography.Text css={{ display: 'block', marginBottom: theme.spacing.md, maxWidth: 800 }}>
            <FormattedMessage
              defaultMessage="Install or upgrade MLflow to ensure you have the latest judge functionality."
              description="Step 1 description for installing MLflow"
            />
          </Typography.Text>
          <CodeBlockWithCopy
            // Dummy comment to ensure copybara won't fail with formatting issues
            code={step1Code}
            language="bash"
            theme={theme}
          />
        </div>
        {/* Step 2: Define your scorer */}
        <div>
          <Typography.Title level={4} css={{ marginBottom: theme.spacing.sm }}>
            <FormattedMessage
              defaultMessage="Step 2: Define your judge function"
              description="Step 2 title for custom judge creation"
            />
          </Typography.Title>
          <Typography.Text css={{ display: 'block', marginBottom: theme.spacing.md, maxWidth: 800 }}>
            <FormattedMessage
              defaultMessage="Create a custom judge function using the {decorator} decorator. Implement your scoring logic in the function body. {link}"
              description="Step 2 description for defining judge function"
              values={{
                decorator: <Typography.Text code>@scorer</Typography.Text>,
                link: (
                  <Typography.Link
                    componentId={`${COMPONENT_ID_PREFIX}.custom-scorer-form.step2-documentation-link`}
                    href={getDocLink()}
                    openInNewTab
                  >
                    <FormattedMessage defaultMessage="Learn more" description="Documentation link text" />
                  </Typography.Link>
                ),
              }}
            />
          </Typography.Text>
          <CodeBlockWithCopy
            // Dummy comment to ensure copybara won't fail with formatting issues
            code={step2Code}
            language="python"
            theme={theme}
          />
        </div>
        {/* Step 3: Register and start the scorer */}
        <div>
          <Typography.Title level={4} css={{ marginBottom: theme.spacing.sm }}>
            <FormattedMessage
              defaultMessage="Step 3: Register the judge"
              description="Step 3 title for custom judge creation"
            />
          </Typography.Title>
          <Typography.Text css={{ display: 'block', marginBottom: theme.spacing.md, maxWidth: 800 }}>
            <FormattedMessage
              defaultMessage="Register your judge. The judge will then show up in this UI."
              description="Step 3 description for registering and starting judge"
            />
          </Typography.Text>
          <CodeBlockWithCopy
            // Dummy comment to ensure copybara won't fail with formatting issues
            code={step3Code}
            language="python"
            theme={theme}
          />
        </div>
      </div>
    );
  }

  return (
    <div css={sectionStyles}>
      <div
        onClick={stopPropagationClick}
        css={{ cursor: 'auto', marginBottom: mode === SCORER_FORM_MODE.DISPLAY ? theme.spacing.sm : 0 }}
      >
        <CodeBlockWithCopy
          // Dummy comment to ensure copybara won't fail with formatting issues
          code={code || ''}
          language="python"
          theme={theme}
        />
      </div>

      <EvaluateTracesSectionRenderer control={control} mode={mode} />
    </div>
  );
};

export default CustomCodeScorerFormRenderer;
```

--------------------------------------------------------------------------------

---[FILE: DeleteScorerModalRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/DeleteScorerModalRenderer.tsx
Signals: React

```typescript
import React from 'react';
import { DangerModal, Alert, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import type { ScheduledScorer } from './types';
import type { PredefinedError } from '@databricks/web-shared/errors';
import { COMPONENT_ID_PREFIX } from './constants';

interface DeleteScorerModalRendererProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scorer: ScheduledScorer;
  isLoading?: boolean;
  error?: PredefinedError | null;
}

export const DeleteScorerModalRenderer: React.FC<DeleteScorerModalRendererProps> = ({
  isOpen,
  onClose,
  onConfirm,
  scorer,
  isLoading = false,
  error,
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <DangerModal
      componentId={`${COMPONENT_ID_PREFIX}.delete-modal`}
      title={
        <FormattedMessage defaultMessage="Delete judge" description="Title for the delete judge confirmation modal" />
      }
      visible={isOpen}
      onCancel={onClose}
      onOk={onConfirm}
      confirmLoading={isLoading}
    >
      <>
        <FormattedMessage
          defaultMessage="Are you sure you want to delete the judge ''{scorerName}''? This action cannot be undone."
          description="Confirmation message for deleting a judge"
          values={{ scorerName: scorer.name }}
        />
        {error && (
          <Alert
            componentId={`${COMPONENT_ID_PREFIX}.delete-modal-error`}
            type="error"
            message={error.message || error.displayMessage}
            closable={false}
            css={{ marginTop: theme.spacing.md }}
          />
        )}
      </>
    </DangerModal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluateTracesSectionRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/EvaluateTracesSectionRenderer.tsx
Signals: React

```typescript
import React from 'react';
import {
  useDesignSystemTheme,
  Typography,
  FormUI,
  Slider,
  Input,
  Checkbox,
  Accordion,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { Controller, type Control, useWatch } from 'react-hook-form';
import { COMPONENT_ID_PREFIX, type ScorerFormMode, SCORER_FORM_MODE } from './constants';

interface EvaluateTracesSectionRendererProps {
  control: Control<any>;
  mode: ScorerFormMode;
}

const EvaluateTracesSectionRenderer: React.FC<EvaluateTracesSectionRendererProps> = ({ control, mode }) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  // Watch the sample rate to determine if automatic evaluation is enabled
  const sampleRate = useWatch({
    control,
    name: 'sampleRate',
  });
  const disableMonitoring = useWatch({
    control,
    name: 'disableMonitoring',
  });

  const isAutomaticEvaluationEnabled = sampleRate > 0;

  const stopPropagationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sectionStyles = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  };

  if (disableMonitoring) {
    return null;
  }

  return (
    <>
      {/* Evaluation settings section header */}
      {(mode === SCORER_FORM_MODE.EDIT || mode === SCORER_FORM_MODE.CREATE) && (
        <div css={sectionStyles}>
          <FormUI.Label>
            <FormattedMessage
              defaultMessage="Evaluation settings"
              description="Section header for evaluation settings"
            />
          </FormUI.Label>
        </div>
      )}
      {/* Automatic evaluation checkbox */}
      <div>
        <Controller
          name="sampleRate"
          control={control}
          render={({ field }) => (
            <Checkbox
              componentId={`${COMPONENT_ID_PREFIX}.automatic-evaluation-checkbox`}
              isChecked={isAutomaticEvaluationEnabled}
              onChange={(checked) => {
                // If unchecked, set sample rate to 0; if checked and currently 0, set to 100
                field.onChange(checked ? 100 : 0);
              }}
              disabled={mode === SCORER_FORM_MODE.DISPLAY}
              onClick={stopPropagationClick}
            >
              <FormattedMessage
                defaultMessage="Automatically evaluate future traces using this judge"
                description="Checkbox label for enabling automatic evaluation"
              />
            </Checkbox>
          )}
        />
      </div>
      {/* Sample Rate and Filter String - stacked vertically (hidden when automatic evaluation is disabled) */}
      {isAutomaticEvaluationEnabled && (
        <Accordion componentId={`${COMPONENT_ID_PREFIX}.advanced-accordion`} chevronAlignment="left">
          <Accordion.Panel
            key="advanced"
            header={<FormattedMessage defaultMessage="Advanced" description="Advanced settings accordion header" />}
          >
            {/* Sample Rate Slider */}
            <div css={sectionStyles}>
              <FormUI.Label htmlFor="mlflow-experiment-scorers-sample-rate">
                <FormattedMessage defaultMessage="Sample rate" description="Section header for sample rate" />
              </FormUI.Label>
              <FormUI.Hint>
                <FormattedMessage
                  defaultMessage="Percentage of traces evaluated by this judge."
                  description="Hint text for sample rate slider"
                />
              </FormUI.Hint>
              <Controller
                name="sampleRate"
                control={control}
                render={({ field }) => (
                  <div onClick={stopPropagationClick}>
                    <Slider.Root
                      value={[field.value || 0]}
                      onValueChange={(value) => field.onChange(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      disabled={mode === SCORER_FORM_MODE.DISPLAY}
                      id="mlflow-experiment-scorers-sample-rate"
                      aria-label={intl.formatMessage({
                        defaultMessage: 'Sample rate',
                        description: 'Aria label for sample rate slider',
                      })}
                      css={{
                        width: '100% !important',
                        maxWidth: '400px !important',
                        '&[data-orientation="horizontal"]': {
                          width: '100% !important',
                          maxWidth: '400px !important',
                        },
                      }}
                    >
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                      <Slider.Thumb />
                    </Slider.Root>
                    <div
                      css={{
                        marginTop: theme.spacing.xs,
                        fontSize: theme.typography.fontSizeSm,
                        color: theme.colors.textSecondary,
                        textAlign: 'left',
                      }}
                    >
                      {field.value || 0}%
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Filter String Input */}
            <div css={sectionStyles}>
              <FormUI.Label htmlFor="mlflow-experiment-scorers-filter-string">
                <FormattedMessage
                  defaultMessage="Filter string (optional)"
                  description="Section header for filter string"
                />
              </FormUI.Label>
              <FormUI.Hint>
                <FormattedMessage
                  defaultMessage="Only run on traces matching this filter; leave blank to run on all. Uses MLflow {link}."
                  description="Hint text for filter string input"
                  values={{
                    link: (
                      <Typography.Link
                        componentId={`${COMPONENT_ID_PREFIX}.search-traces-syntax-link`}
                        href="https://mlflow.org/docs/latest/genai/tracing/search-traces/"
                        openInNewTab
                      >
                        {intl.formatMessage({
                          defaultMessage: 'search_traces syntax',
                          description: 'Link text for search traces documentation',
                        })}
                      </Typography.Link>
                    ),
                  }}
                />
              </FormUI.Hint>
              <Controller
                name="filterString"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    componentId={`${COMPONENT_ID_PREFIX}.filter-string-input`}
                    id="mlflow-experiment-scorers-filter-string"
                    readOnly={mode === SCORER_FORM_MODE.DISPLAY}
                    placeholder={
                      mode === SCORER_FORM_MODE.EDIT || mode === SCORER_FORM_MODE.CREATE
                        ? intl.formatMessage({
                            defaultMessage: "trace.status = 'OK'",
                            description: 'Placeholder example for filter string input',
                          })
                        : undefined
                    }
                    css={{
                      cursor: mode === SCORER_FORM_MODE.EDIT || mode === SCORER_FORM_MODE.CREATE ? 'text' : 'auto',
                      width: '100%',
                      maxWidth: '400px',
                    }}
                    onClick={stopPropagationClick}
                  />
                )}
              />
            </div>
          </Accordion.Panel>
        </Accordion>
      )}
    </>
  );
};

export default EvaluateTracesSectionRenderer;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentScorersContentContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ExperimentScorersContentContainer.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { useDesignSystemTheme, ParagraphSkeleton, Button, PlusIcon, Spacer } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import ScorerCardContainer from './ScorerCardContainer';
import ScorerModalRenderer from './ScorerModalRenderer';
import ScorerEmptyStateRenderer from './ScorerEmptyStateRenderer';
import { useGetScheduledScorers } from './hooks/useGetScheduledScorers';
import { COMPONENT_ID_PREFIX, SCORER_FORM_MODE } from './constants';

interface ExperimentScorersContentContainerProps {
  experimentId: string;
}

const ExperimentScorersContentContainer: React.FC<ExperimentScorersContentContainerProps> = ({ experimentId }) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scheduledScorersResult = useGetScheduledScorers(experimentId);
  const scorers = scheduledScorersResult.data?.scheduledScorers || [];

  const handleNewScorerClick = () => {
    setIsModalVisible(true);
  };

  // If no scorers exist and we're not currently showing the modal, show empty state
  const shouldShowEmptyState = scorers.length === 0 && !isModalVisible && !scheduledScorersResult.isLoading;

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Handle error state - throw error to be caught by PanelBoundary
  if (scheduledScorersResult.isError && scheduledScorersResult.error) {
    throw scheduledScorersResult.error;
  }

  // Handle loading state
  if (scheduledScorersResult.isLoading) {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: theme.spacing.sm,
          padding: theme.spacing.lg,
        }}
      >
        {[...Array(3).keys()].map((i) => (
          <ParagraphSkeleton
            label={intl.formatMessage({
              defaultMessage: 'Loading judges...',
              description: 'Loading message while fetching experiment judges',
            })}
            key={i}
            seed={`scorer-${i}`}
          />
        ))}
      </div>
    );
  }

  // Show empty state when there are no scorers
  if (shouldShowEmptyState) {
    return <ScorerEmptyStateRenderer onAddScorerClick={handleNewScorerClick} />;
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {/* Header with New scorer button */}
      <div
        css={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: theme.spacing.sm,
        }}
      >
        <Button
          type="primary"
          icon={<PlusIcon />}
          componentId={`${COMPONENT_ID_PREFIX}.new-scorer-button`}
          onClick={handleNewScorerClick}
        >
          <FormattedMessage defaultMessage="New judge" description="Button text to create a new judge" />
        </Button>
      </div>
      <Spacer size="sm" />
      {/* Content area */}
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
            width: '100%',
          }}
        >
          {scorers.map((scorer) => (
            <ScorerCardContainer key={scorer.name} scorer={scorer} experimentId={experimentId} />
          ))}
        </div>
      </div>
      {/* New Scorer Modal */}
      <ScorerModalRenderer
        visible={isModalVisible}
        onClose={closeModal}
        experimentId={experimentId}
        mode={SCORER_FORM_MODE.CREATE}
      />
    </div>
  );
};

export default ExperimentScorersContentContainer;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentScorersPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ExperimentScorersPage.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';
import { useDesignSystemTheme, Empty, Spacer, SparkleIcon, Typography, Alert } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import { ErrorBoundary } from 'react-error-boundary';
import ExperimentScorersContentContainer from './ExperimentScorersContentContainer';
import { useParams } from '../../../common/utils/RoutingUtils';
import { enableScorersUI } from '../../../common/utils/FeatureUtils';
import { isExperimentEvalResultsMonitoringUIEnabled } from '../../../common/utils/FeatureUtils';
import { usePrefetchTraces } from './useEvaluateTraces';
import { DEFAULT_TRACE_COUNT } from './constants';

const getProductionMonitoringDocUrl = () => {
  return 'https://mlflow.org/docs/latest/genai/eval-monitor/';
};

interface ExperimentScorersPageProps {
  experimentId?: string;
}
const ErrorFallback = ({ error }: { error?: Error }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
      }}
    >
      <Empty
        title={
          <FormattedMessage
            defaultMessage="Unable to load experiment judges"
            description="Error message when experiment judges page fails to load"
          />
        }
        description={
          error ? (
            <span>{error.message}</span>
          ) : (
            <FormattedMessage
              defaultMessage="We encountered an issue loading the judges interface. Please refresh the page or contact support if the problem persists."
              description="Error description for experiment judges page loading failure"
            />
          )
        }
      />
    </div>
  );
};

const ExperimentScorersPage: React.FC<ExperimentScorersPageProps> = () => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const { experimentId } = useParams();
  const isFeatureEnabled = enableScorersUI();

  const prefetchParams = useMemo(
    () => ({
      traceCount: DEFAULT_TRACE_COUNT,
      locations: experimentId
        ? [{ mlflow_experiment: { experiment_id: experimentId }, type: 'MLFLOW_EXPERIMENT' as const }]
        : [],
    }),
    [experimentId],
  );

  // Prefetch traces when the page loads
  usePrefetchTraces(prefetchParams);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {!isFeatureEnabled ? (
        // Show empty state with documentation link when feature flag is off
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.lg,
          }}
        >
          <Empty
            image={<SparkleIcon css={{ fontSize: 48, color: theme.colors.textSecondary }} />}
            title={
              <FormattedMessage
                defaultMessage="Create and manage judges"
                description="Title for the empty state of the judges page"
              />
            }
            description={
              <div css={{ maxWidth: 600, textAlign: 'center' }}>
                <Spacer size="sm" />
                <FormattedMessage
                  defaultMessage="Configure predefined judges, create guidelines-based LLM judges, or build custom judge functions to track your unique metrics. {link}"
                  description="Description for the empty state of the judges page"
                  values={{
                    link: (
                      <Typography.Link
                        componentId="mlflow.experiment-scorers.documentation-link"
                        href="https://mlflow.org/docs/latest/genai/eval-monitor/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FormattedMessage
                          defaultMessage="Learn more about configuring judges"
                          description="Link text for configuring judges documentation"
                        />
                      </Typography.Link>
                    ),
                  }}
                />
              </div>
            }
          />
        </div>
      ) : // Show the actual scorers UI when feature flag is on
      experimentId ? (
        <ExperimentScorersContentContainer experimentId={experimentId || ''} />
      ) : null}
    </ErrorBoundary>
  );
};

export default ExperimentScorersPage;
```

--------------------------------------------------------------------------------

````

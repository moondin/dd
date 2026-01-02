---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 554
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 554 of 991)

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

---[FILE: SampleScorerOutputPanelContainer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/SampleScorerOutputPanelContainer.test.tsx

```typescript
import { render } from '@testing-library/react';
import { IntlProvider } from '@databricks/i18n';
import { useForm } from 'react-hook-form';
import SampleScorerOutputPanelContainer from './SampleScorerOutputPanelContainer';
import { useEvaluateTraces, type JudgeEvaluationResult, type EvaluateTracesParams } from './useEvaluateTraces';
import { type ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import SampleScorerOutputPanelRenderer from './SampleScorerOutputPanelRenderer';
import type { ScorerFormData } from './utils/scorerTransformUtils';
import { LLM_TEMPLATE } from './types';
import { jest } from '@jest/globals';
import { describe } from '@jest/globals';
import { beforeEach } from '@jest/globals';
import { it } from '@jest/globals';
import { expect } from '@jest/globals';

jest.mock('./useEvaluateTraces');
jest.mock('./SampleScorerOutputPanelRenderer');

const mockedUseEvaluateTraces = jest.mocked(useEvaluateTraces);
const mockedRenderer = jest.mocked(SampleScorerOutputPanelRenderer);

const experimentId = 'exp-123';

function createMockTrace(traceId: string): ModelTrace {
  return {
    info: { trace_id: traceId } as any,
    data: { spans: [] },
  } as ModelTrace;
}

function createMockEvalResult(traceId: string): JudgeEvaluationResult {
  return {
    trace: createMockTrace(traceId),
    results: [
      {
        assessment_id: `assessment-${traceId}`,
        result: 'PASS',
        rationale: 'Good quality',
        error: null,
      },
    ],
    error: null,
  };
}

// Test wrapper component that sets up a real form
interface TestWrapperProps {
  defaultValues?: Partial<ScorerFormData>;
  onScorerFinished?: () => void;
}

function TestWrapper({ defaultValues, onScorerFinished }: TestWrapperProps) {
  const { control } = useForm<ScorerFormData>({
    defaultValues: {
      name: 'Test Scorer',
      instructions: 'Test instructions',
      llmTemplate: LLM_TEMPLATE.CUSTOM,
      sampleRate: 100,
      scorerType: 'llm',
      ...defaultValues,
    },
  });

  return (
    <IntlProvider locale="en">
      <SampleScorerOutputPanelContainer
        control={control}
        experimentId={experimentId}
        onScorerFinished={onScorerFinished}
      />
    </IntlProvider>
  );
}

describe('SampleScorerOutputPanelContainer', () => {
  const mockEvaluateTraces: jest.MockedFunction<(params: EvaluateTracesParams) => Promise<JudgeEvaluationResult[]>> =
    jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseEvaluateTraces.mockReturnValue([
      mockEvaluateTraces,
      {
        data: null,
        isLoading: false,
        error: null,
        reset: jest.fn(),
      },
    ]);

    mockedRenderer.mockReturnValue(null);
  });

  const renderComponent = (props: TestWrapperProps = {}) => {
    return render(<TestWrapper {...props} />);
  };

  describe('Golden Path - Successful Operations', () => {
    it('should render and call renderer with correct initial props', () => {
      renderComponent();

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          isRunScorerDisabled: false,
          error: null,
          currentTraceIndex: 0,
          totalTraces: 0,
          tracesCount: 10,
        }),
        expect.anything(),
      );
    });

    it('should pass evaluation results to renderer when data is available', () => {
      const mockResults = [createMockEvalResult('trace-1'), createMockEvalResult('trace-2')];

      mockedUseEvaluateTraces.mockReturnValue([
        mockEvaluateTraces,
        {
          data: mockResults,
          isLoading: false,
          error: null,
          reset: jest.fn(),
        },
      ]);

      renderComponent();

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          totalTraces: 2,
          currentTrace: mockResults[0].trace,
          assessments: expect.any(Array),
        }),
        expect.anything(),
      );
    });

    it('should pass loading state to renderer', () => {
      mockedUseEvaluateTraces.mockReturnValue([
        mockEvaluateTraces,
        {
          data: null,
          isLoading: true,
          error: null,
          reset: jest.fn(),
        },
      ]);

      renderComponent();

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
        }),
        expect.anything(),
      );
    });

    it('should pass error state to renderer when evaluation fails', () => {
      const mockError = new Error('API error');

      mockedUseEvaluateTraces.mockReturnValue([
        mockEvaluateTraces,
        {
          data: null,
          isLoading: false,
          error: mockError,
          reset: jest.fn(),
        },
      ]);

      renderComponent();

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          error: mockError,
        }),
        expect.anything(),
      );
    });

    it('should provide handleRunScorer callback that calls evaluateTraces', async () => {
      const mockResults = [createMockEvalResult('trace-1')];
      mockEvaluateTraces.mockResolvedValue(mockResults);

      renderComponent();

      const rendererProps = mockedRenderer.mock.calls[0][0];
      rendererProps.handleRunScorer();

      expect(mockEvaluateTraces).toHaveBeenCalledWith({
        traceCount: 10,
        locations: [{ mlflow_experiment: { experiment_id: experimentId }, type: 'MLFLOW_EXPERIMENT' }],
        judgeInstructions: 'Test instructions',
        experimentId,
      });
    });

    it('should call onScorerFinished when evaluation succeeds with results', async () => {
      const onScorerFinished = jest.fn();
      const mockResults = [createMockEvalResult('trace-1')];
      mockEvaluateTraces.mockResolvedValue(mockResults);

      renderComponent({ onScorerFinished });

      const rendererProps = mockedRenderer.mock.calls[0][0];
      await rendererProps.handleRunScorer();

      expect(onScorerFinished).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should disable run scorer button when instructions are empty', () => {
      renderComponent({ defaultValues: { instructions: '' } });

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          isRunScorerDisabled: true,
          runScorerDisabledTooltip: expect.any(String),
        }),
        expect.anything(),
      );
    });

    it('should disable run scorer button when instructions are undefined', () => {
      renderComponent({ defaultValues: { instructions: undefined } });

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          isRunScorerDisabled: true,
        }),
        expect.anything(),
      );
    });

    it('should not call onScorerFinished when evaluation returns empty results', async () => {
      const onScorerFinished = jest.fn();
      mockEvaluateTraces.mockResolvedValue([]);

      renderComponent({ onScorerFinished });

      const rendererProps = mockedRenderer.mock.calls[0][0];
      rendererProps.handleRunScorer();

      expect(onScorerFinished).not.toHaveBeenCalled();
    });

    it('should handle undefined currentTrace when no data is available', () => {
      mockedUseEvaluateTraces.mockReturnValue([
        mockEvaluateTraces,
        {
          data: null,
          isLoading: false,
          error: null,
          reset: jest.fn(),
        },
      ]);

      renderComponent();

      expect(mockedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          currentTrace: undefined,
          assessments: undefined,
        }),
        expect.anything(),
      );
    });
  });

  describe('Error Conditions', () => {
    it('should not call evaluateTraces when instructions are missing', async () => {
      renderComponent({ defaultValues: { instructions: undefined } });

      const rendererProps = mockedRenderer.mock.calls[0][0];
      rendererProps.handleRunScorer();

      expect(mockEvaluateTraces).not.toHaveBeenCalled();
    });

    it('should handle evaluation errors gracefully', async () => {
      mockEvaluateTraces.mockRejectedValue(new Error('API error'));

      renderComponent();

      const rendererProps = mockedRenderer.mock.calls[0][0];
      rendererProps.handleRunScorer();

      // Error is caught and handled by the hook
      expect(mockEvaluateTraces).toHaveBeenCalledTimes(1);
    });

    it('should not call onScorerFinished when evaluation fails', async () => {
      const onScorerFinished = jest.fn();
      mockEvaluateTraces.mockRejectedValue(new Error('Network error'));

      renderComponent({ onScorerFinished });

      const rendererProps = mockedRenderer.mock.calls[0][0];
      rendererProps.handleRunScorer();

      expect(onScorerFinished).not.toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SampleScorerOutputPanelContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/SampleScorerOutputPanelContainer.tsx
Signals: React

```typescript
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch, useFormState } from 'react-hook-form';
import { useIntl } from '@databricks/i18n';
import type { ScorerFormData } from './utils/scorerTransformUtils';
import { useEvaluateTraces } from './useEvaluateTraces';
import SampleScorerOutputPanelRenderer from './SampleScorerOutputPanelRenderer';
import { convertEvaluationResultToAssessment } from './llmScorerUtils';
import { extractTemplateVariables } from '../../utils/evaluationUtils';
import { DEFAULT_TRACE_COUNT, ASSESSMENT_NAME_TEMPLATE_MAPPING } from './constants';
import { LLM_TEMPLATE } from './types';

interface SampleScorerOutputPanelContainerProps {
  control: Control<ScorerFormData>;
  experimentId: string;
  onScorerFinished?: () => void;
}

const SampleScorerOutputPanelContainer: React.FC<SampleScorerOutputPanelContainerProps> = ({
  control,
  experimentId,
  onScorerFinished,
}) => {
  const intl = useIntl();
  const judgeInstructions = useWatch({ control, name: 'instructions' });
  const scorerName = useWatch({ control, name: 'name' });
  const llmTemplate = useWatch({ control, name: 'llmTemplate' });
  const guidelines = useWatch({ control, name: 'guidelines' });
  const scorerType = useWatch({ control, name: 'scorerType' });
  const { errors } = useFormState({ control });

  const [tracesCount, setTracesCount] = useState(DEFAULT_TRACE_COUNT);
  const [evaluateTraces, { data, isLoading, error, reset }] = useEvaluateTraces();

  // Carousel state for navigating through traces
  const [currentTraceIndex, setCurrentTraceIndex] = useState(0);

  // Request ID pattern to handle stale results
  const requestIdRef = useRef(0);

  // Determine if we're in custom or built-in judge mode
  const isCustomMode = llmTemplate === LLM_TEMPLATE.CUSTOM;

  // Reset results when switching modes or templates
  useEffect(() => {
    reset();
    setCurrentTraceIndex(0);
  }, [llmTemplate, reset]);

  // Handle the "Run scorer" button click
  const handleRunScorer = useCallback(async () => {
    // Validate inputs based on mode
    if (isCustomMode ? !judgeInstructions : !llmTemplate) {
      return;
    }

    // Increment request ID and save for this request
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    // Reset to first trace when running scorer
    setCurrentTraceIndex(0);

    try {
      // Prepare evaluation parameters based on mode
      const evaluationParams = isCustomMode
        ? {
            traceCount: tracesCount,
            locations: [{ mlflow_experiment: { experiment_id: experimentId }, type: 'MLFLOW_EXPERIMENT' as const }],
            judgeInstructions: judgeInstructions || '',
            experimentId,
          }
        : {
            traceCount: tracesCount,
            locations: [{ mlflow_experiment: { experiment_id: experimentId }, type: 'MLFLOW_EXPERIMENT' as const }],
            requestedAssessments: [
              {
                assessment_name:
                  ASSESSMENT_NAME_TEMPLATE_MAPPING[llmTemplate as keyof typeof ASSESSMENT_NAME_TEMPLATE_MAPPING],
              },
            ],
            experimentId,
            guidelines: guidelines ? [guidelines] : undefined,
          };

      const results = await evaluateTraces(evaluationParams);

      // Check if results are still current (user hasn't changed settings)
      if (thisRequestId === requestIdRef.current) {
        // Call onScorerFinished after successful evaluation
        if (results && results.length > 0) {
          onScorerFinished?.();
        }
      }
    } catch (error) {
      // Error is already handled by the hook's error state
    }
  }, [
    isCustomMode,
    judgeInstructions,
    llmTemplate,
    guidelines,
    tracesCount,
    evaluateTraces,
    experimentId,
    onScorerFinished,
  ]);

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentTraceIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (data) {
      setCurrentTraceIndex((prev) => Math.min(data.length - 1, prev + 1));
    }
  };

  // Get current evaluation result from data
  const currentEvalResult = data?.[currentTraceIndex];

  // Convert judge evaluation result to assessments for display
  const assessments = useMemo(() => {
    if (!currentEvalResult || !llmTemplate) {
      return undefined;
    }

    const baseName = scorerName || llmTemplate;

    // Custom judges or built-in judges with no results: single assessment
    if (isCustomMode || currentEvalResult.results.length === 0) {
      const assessment = convertEvaluationResultToAssessment(currentEvalResult, baseName);
      return [assessment];
    }

    // Built-in judges with results: map over each result
    return currentEvalResult.results.map((result, index) => {
      return convertEvaluationResultToAssessment(
        {
          ...currentEvalResult,
          results: [result],
        },
        baseName,
        index,
      );
    });
  }, [currentEvalResult, isCustomMode, llmTemplate, scorerName]);

  // Check if instructions contain {{trace}} variable (custom judges only)
  const hasTraceVariable = useMemo(() => {
    if (!isCustomMode || !judgeInstructions) return false;
    const templateVariables = extractTemplateVariables(judgeInstructions);
    return templateVariables.includes('trace');
  }, [isCustomMode, judgeInstructions]);

  // Determine if run scorer button should be disabled
  const hasNameError = Boolean((errors as any).name?.message);
  const hasInstructionsError = Boolean((errors as any).instructions?.message);
  const isRetrievalRelevance = llmTemplate === LLM_TEMPLATE.RETRIEVAL_RELEVANCE;

  const isRunScorerDisabled = isCustomMode
    ? !judgeInstructions || hasInstructionsError || hasTraceVariable
    : hasNameError || isRetrievalRelevance;

  // Determine tooltip message based on why the button is disabled
  const runScorerDisabledTooltip = useMemo(() => {
    if (isCustomMode) {
      // Custom judge mode
      if (!judgeInstructions) {
        return intl.formatMessage({
          defaultMessage: 'Please enter instructions to run the judge',
          description: 'Tooltip message when instructions are missing',
        });
      }
      if (hasInstructionsError) {
        return intl.formatMessage({
          defaultMessage: 'Please fix the validation errors in the instructions',
          description: 'Tooltip message when instructions have validation errors',
        });
      }
      if (hasTraceVariable) {
        return intl.formatMessage({
          defaultMessage: 'The trace variable is not supported when running the judge on a sample of traces',
          description: 'Tooltip message when instructions contain trace variable',
        });
      }
    } else {
      // Built-in judge mode
      if (isRetrievalRelevance) {
        return intl.formatMessage({
          defaultMessage: 'Retrieval Relevance is not yet supported for sample judge output',
          description: 'Tooltip message when retrieval relevance template is selected',
        });
      }
      if (hasNameError) {
        return intl.formatMessage({
          defaultMessage: 'Please fix the validation errors',
          description: 'Tooltip message when there are validation errors',
        });
      }
    }
    return undefined;
  }, [
    isCustomMode,
    judgeInstructions,
    hasInstructionsError,
    hasTraceVariable,
    hasNameError,
    isRetrievalRelevance,
    intl,
  ]);

  return (
    <SampleScorerOutputPanelRenderer
      isLoading={isLoading}
      isRunScorerDisabled={isRunScorerDisabled}
      runScorerDisabledTooltip={runScorerDisabledTooltip}
      error={error}
      currentTraceIndex={currentTraceIndex}
      currentTrace={currentEvalResult?.trace ?? undefined}
      assessments={assessments}
      handleRunScorer={handleRunScorer}
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      totalTraces={data?.length ?? 0}
      tracesCount={tracesCount}
      onTracesCountChange={setTracesCount}
    />
  );
};

export default SampleScorerOutputPanelContainer;
```

--------------------------------------------------------------------------------

---[FILE: SampleScorerOutputPanelRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/SampleScorerOutputPanelRenderer.tsx
Signals: React

```typescript
import React from 'react';
import {
  useDesignSystemTheme,
  Typography,
  SimpleSelect,
  SimpleSelectOption,
  Button,
  PlayCircleFillIcon,
  LoadingState,
  ChevronLeftIcon,
  ChevronRightIcon,
  Alert,
  Tooltip,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { SimplifiedModelTraceExplorer } from '@databricks/web-shared/model-trace-explorer';
import type { Assessment, ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import { COMPONENT_ID_PREFIX, BUTTON_VARIANT, type ButtonVariant } from './constants';

/**
 * Run scorer button component.
 * Handles both "Run scorer" and "Re-Run scorer" variants with appropriate styling.
 */
const RunScorerButton: React.FC<{
  // Dummy comment to ensure copybara won't fail with formatting issues
  variant: ButtonVariant;
  onClick: () => Promise<void>;
  loading: boolean;
  disabled: boolean;
}> = ({
  // Dummy comment to ensure copybara won't fail with formatting issues
  variant,
  onClick,
  loading,
  disabled,
}) => {
  const { theme } = useDesignSystemTheme();
  const isRerun = variant === BUTTON_VARIANT.RERUN;

  const button = (
    <Button
      componentId={`${COMPONENT_ID_PREFIX}.${isRerun ? 'rerun-scorer-button' : 'run-scorer-button'}`}
      type="primary"
      size={isRerun ? 'small' : undefined}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      <PlayCircleFillIcon css={{ marginRight: isRerun ? theme.spacing.xs : theme.spacing.sm }} />
      {isRerun ? (
        <FormattedMessage defaultMessage="Re-Run judge" description="Button text for re-running judge" />
      ) : (
        <FormattedMessage defaultMessage="Run judge" description="Button text for running judge" />
      )}
    </Button>
  );
  return button;
};

interface SampleScorerOutputPanelRendererProps {
  isLoading: boolean;
  isRunScorerDisabled: boolean;
  runScorerDisabledTooltip?: string;
  error: Error | null;
  currentTraceIndex: number;
  currentTrace: ModelTrace | undefined;
  assessments: Assessment[] | undefined;
  handleRunScorer: () => Promise<void>;
  handlePrevious: () => void;
  handleNext: () => void;
  totalTraces: number;
  tracesCount: number;
  onTracesCountChange: (count: number) => void;
}

const SampleScorerOutputPanelRenderer: React.FC<SampleScorerOutputPanelRendererProps> = ({
  isLoading,
  isRunScorerDisabled,
  runScorerDisabledTooltip,
  error,
  currentTraceIndex,
  currentTrace,
  assessments,
  handleRunScorer,
  handlePrevious,
  handleNext,
  totalTraces,
  tracesCount,
  onTracesCountChange,
}) => {
  const { theme } = useDesignSystemTheme();

  // Whether we are showing a trace or the initial screen
  const isInitialScreen = !currentTrace;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borders.borderRadiusMd,
        overflow: 'hidden',
      }}
    >
      {/* Header with title and dropdown */}
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          backgroundColor: theme.colors.backgroundSecondary,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <Typography.Text bold css={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <FormattedMessage defaultMessage="Sample judge output" description="Title for sample judge output panel" />
        </Typography.Text>
        <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
          <SimpleSelect
            componentId={`${COMPONENT_ID_PREFIX}.sample-output-traces-select`}
            id="sample-output-traces-select"
            value={String(tracesCount)}
            onChange={({ target }) => onTracesCountChange(Number(target.value))}
            triggerSize="small"
          >
            <SimpleSelectOption value="1">
              <FormattedMessage defaultMessage="Last trace" description="Option for last trace" />
            </SimpleSelectOption>
            <SimpleSelectOption value="5">
              <FormattedMessage defaultMessage="Last 5 traces" description="Option for last 5 traces" />
            </SimpleSelectOption>
            <SimpleSelectOption value="10">
              <FormattedMessage defaultMessage="Last 10 traces" description="Option for last 10 traces" />
            </SimpleSelectOption>
          </SimpleSelect>
          {!isInitialScreen && (
            <Tooltip
              componentId={`${COMPONENT_ID_PREFIX}.rerun-scorer-button-tooltip`}
              content={isRunScorerDisabled ? runScorerDisabledTooltip : undefined}
            >
              <RunScorerButton
                variant={BUTTON_VARIANT.RERUN}
                onClick={handleRunScorer}
                loading={isLoading}
                disabled={isRunScorerDisabled}
              />
            </Tooltip>
          )}
        </div>
      </div>
      {/* Content area */}
      <div
        css={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          backgroundColor: theme.colors.backgroundPrimary,
          overflowY: 'auto',
        }}
      >
        {!isInitialScreen && currentTrace ? (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              padding: theme.spacing.md,
              gap: theme.spacing.xs,
            }}
          >
            {/* Carousel controls and trace info */}
            <div
              css={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
                <Button
                  componentId={`${COMPONENT_ID_PREFIX}.previous-trace-button`}
                  size="small"
                  onClick={handlePrevious}
                  disabled={currentTraceIndex === 0}
                >
                  <ChevronLeftIcon />
                  <FormattedMessage defaultMessage="Previous" description="Button text for previous trace" />
                </Button>
                <Button
                  componentId={`${COMPONENT_ID_PREFIX}.next-trace-button`}
                  size="small"
                  onClick={handleNext}
                  disabled={currentTraceIndex === totalTraces - 1}
                >
                  <FormattedMessage defaultMessage="Next" description="Button text for next trace" />
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>

            <div css={{ height: '600px' }}>
              <SimplifiedModelTraceExplorer modelTrace={currentTrace} assessments={assessments ?? []} />
            </div>
          </div>
        ) : error ? (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: theme.spacing.md,
              padding: theme.spacing.lg,
            }}
          >
            <Alert
              componentId={`${COMPONENT_ID_PREFIX}.scorer-error-alert`}
              type="error"
              message={error.message}
              closable={false}
              css={{ width: '100%', maxWidth: '600px' }}
            />
            <Tooltip
              componentId={`${COMPONENT_ID_PREFIX}.run-scorer-button-error-tooltip`}
              content={isRunScorerDisabled ? runScorerDisabledTooltip : undefined}
            >
              <RunScorerButton
                variant={BUTTON_VARIANT.RUN}
                onClick={handleRunScorer}
                loading={isLoading}
                disabled={isRunScorerDisabled}
              />
            </Tooltip>
          </div>
        ) : (
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              textAlign: 'center',
              padding: theme.spacing.lg,
            }}
          >
            {isLoading && (
              <div css={{ marginBottom: theme.spacing.md }}>
                <LoadingState />
              </div>
            )}
            <Typography.Text size="lg" color="secondary" bold css={{ margin: 0, marginBottom: theme.spacing.xs }}>
              <FormattedMessage defaultMessage="Run judge on traces" description="Title for running judge on traces" />
            </Typography.Text>
            <Typography.Text color="secondary" css={{ margin: 0, marginBottom: theme.spacing.md }}>
              <FormattedMessage
                defaultMessage="Run the judge on the selected group of traces"
                description="Description for running judge on traces"
              />
            </Typography.Text>
            <Tooltip
              componentId={`${COMPONENT_ID_PREFIX}.run-scorer-button-initial-tooltip`}
              content={isRunScorerDisabled ? runScorerDisabledTooltip : undefined}
            >
              <RunScorerButton
                variant={BUTTON_VARIANT.RUN}
                onClick={handleRunScorer}
                loading={isLoading}
                disabled={isRunScorerDisabled}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleScorerOutputPanelRenderer;
```

--------------------------------------------------------------------------------

---[FILE: ScorerCardContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerCardContainer.tsx
Signals: React

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ScheduledScorer } from './types';
import { useDeleteScheduledScorerMutation } from './hooks/useDeleteScheduledScorer';
import { syncFormWithScorer, getFormValuesFromScorer } from './scorerCardUtils';
import type { LLMScorerFormData } from './LLMScorerFormRenderer';
import type { CustomCodeScorerFormData } from './CustomCodeScorerFormRenderer';
import { DeleteScorerModalRenderer } from './DeleteScorerModalRenderer';
import ScorerCardRenderer from './ScorerCardRenderer';
import ScorerModalRenderer from './ScorerModalRenderer';
import { SCORER_FORM_MODE } from './constants';

interface ScorerCardContainerProps {
  scorer: ScheduledScorer;
  experimentId: string;
}

const ScorerCardContainer: React.FC<ScorerCardContainerProps> = ({ scorer, experimentId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<'delete' | 'edit' | null>(null);

  // Hook for deleting scorer
  const deleteScorerMutation = useDeleteScheduledScorerMutation();

  // React Hook Form for display mode
  const { control, reset, setValue, getValues } = useForm<LLMScorerFormData | CustomCodeScorerFormData>({
    defaultValues: getFormValuesFromScorer(scorer),
  });

  // Sync form state with scorer prop changes
  useEffect(() => {
    syncFormWithScorer(scorer, reset);
  }, [scorer, reset]);

  const handleCardClick = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleExpandToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    },
    [isExpanded],
  );

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModal('edit');
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setActiveModal('delete');
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteScorerMutation.mutate(
      {
        experimentId,
        scorerNames: [scorer.name],
      },
      {
        onSuccess: () => {
          setActiveModal(null);
        },
      },
    );
  }, [deleteScorerMutation, experimentId, scorer.name]);

  const handleDeleteCancel = useCallback(() => {
    setActiveModal(null);
    deleteScorerMutation.reset();
  }, [deleteScorerMutation]);

  return (
    <>
      <ScorerCardRenderer
        scorer={scorer}
        isExpanded={isExpanded}
        onCardClick={handleCardClick}
        onExpandToggle={handleExpandToggle}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        control={control}
        setValue={setValue}
        getValues={getValues}
      />
      <ScorerModalRenderer
        visible={activeModal === 'edit'}
        onClose={handleCloseEditModal}
        experimentId={experimentId}
        mode={SCORER_FORM_MODE.EDIT}
        existingScorer={scorer}
      />
      <DeleteScorerModalRenderer
        isOpen={activeModal === 'delete'}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        scorer={scorer}
        isLoading={deleteScorerMutation.isLoading}
        error={deleteScorerMutation.error}
      />
    </>
  );
};

export default ScorerCardContainer;
```

--------------------------------------------------------------------------------

---[FILE: ScorerCardRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerCardRenderer.tsx
Signals: React

```typescript
import React from 'react';
import type { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import {
  useDesignSystemTheme,
  Typography,
  Tag,
  Button,
  Card,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleIcon,
  PencilIcon,
  OverflowIcon,
  DropdownMenu,
  TrashIcon,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { isNil } from 'lodash';
import type { ScheduledScorer } from './types';
import { getTypeDisplayName, getTypeIcon, getTypeColor, getStatusTag } from './scorerCardUtils';
import LLMScorerFormRenderer, { type LLMScorerFormData } from './LLMScorerFormRenderer';
import CustomCodeScorerFormRenderer, { type CustomCodeScorerFormData } from './CustomCodeScorerFormRenderer';
import { COMPONENT_ID_PREFIX, SCORER_FORM_MODE } from './constants';

interface ScorerCardOverflowMenuProps {
  onDelete: () => void;
}

const ScorerCardOverflowMenu: React.FC<ScorerCardOverflowMenuProps> = ({ onDelete }) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete();
    },
    [onDelete],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button componentId={`${COMPONENT_ID_PREFIX}.overflow-button`} size="small" icon={<OverflowIcon />} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item componentId={`${COMPONENT_ID_PREFIX}.delete-button`} onClick={handleClick}>
          <DropdownMenu.IconWrapper>
            <TrashIcon />
          </DropdownMenu.IconWrapper>
          <FormattedMessage defaultMessage="Delete" description="Delete judge button" />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

interface ScorerCardRendererProps {
  scorer: ScheduledScorer;
  isExpanded: boolean;
  onCardClick: () => void;
  onExpandToggle: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: () => void;
  control: Control<LLMScorerFormData | CustomCodeScorerFormData>;
  setValue: UseFormSetValue<LLMScorerFormData | CustomCodeScorerFormData>;
  getValues: UseFormGetValues<LLMScorerFormData | CustomCodeScorerFormData>;
}

const ScorerCardRenderer: React.FC<ScorerCardRendererProps> = ({
  scorer,
  isExpanded,
  onCardClick,
  onExpandToggle,
  onEditClick,
  onDeleteClick,
  control,
  setValue,
  getValues,
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  return (
    <Card
      componentId={`${COMPONENT_ID_PREFIX}.scorer-card`}
      css={{
        padding: theme.spacing.md,
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
      onClick={onCardClick}
    >
      {/* Header with title, expand button and action buttons */}
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: theme.spacing.xs,
          alignItems: 'flex-start',
        }}
      >
        <Button
          componentId={`${COMPONENT_ID_PREFIX}.expand-button`}
          icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          size="small"
          type="tertiary"
          onClick={onExpandToggle}
          css={{
            padding: theme.spacing.xs,
          }}
          disabled={false}
        />
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <div css={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm }}>
            <Typography.Title level={4} css={{ margin: 0, marginBottom: '0 !important' }}>
              {scorer.name}
            </Typography.Title>
            <Tag
              componentId={`${COMPONENT_ID_PREFIX}.scorer-type-tag`}
              color={getTypeColor(scorer)}
              icon={getTypeIcon(scorer)}
            >
              {getTypeDisplayName(scorer, intl)}
            </Tag>
          </div>
          {/* Metadata such as sample rate, filter string and version - only show when collapsed */}
          {!isExpanded && (!isNil(scorer.sampleRate) || scorer.filterString || !isNil(scorer.version)) ? (
            <div
              css={{
                display: 'flex',
                gap: theme.spacing.sm,
                alignItems: 'center',
              }}
            >
              {!scorer.disableMonitoring && !isNil(scorer.sampleRate) && (
                <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                  <Typography.Hint>
                    <FormattedMessage defaultMessage="Sample rate:" description="Sample rate label for scorer" />
                  </Typography.Hint>
                  <Typography.Hint>
                    <FormattedMessage
                      defaultMessage="{sampleRatePercent}%"
                      description="Sample rate value for scorer"
                      values={{ sampleRatePercent: scorer.sampleRate }}
                    />
                  </Typography.Hint>
                </div>
              )}
              {!scorer.disableMonitoring && !isNil(scorer.sampleRate) && scorer.filterString && (
                <CircleIcon css={{ color: theme.colors.textSecondary, fontSize: '6px' }} />
              )}
              {!scorer.disableMonitoring && scorer.filterString && (
                <Typography.Hint>
                  <FormattedMessage
                    defaultMessage="Filter: {filterString}"
                    description="Filter display for scorer"
                    values={{ filterString: scorer.filterString }}
                  />
                </Typography.Hint>
              )}
              {!isNil(scorer.version) && (
                <Typography.Hint>
                  <FormattedMessage
                    defaultMessage="Version {version}"
                    description="Version display for judge"
                    values={{ version: scorer.version }}
                  />
                </Typography.Hint>
              )}
            </div>
          ) : null}
        </div>
        <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
          {!scorer.disableMonitoring && (
            <Tag
              componentId={`${COMPONENT_ID_PREFIX}.scorer-status-tag`}
              color={getStatusTag(scorer, intl).color}
              icon={getStatusTag(scorer, intl).icon}
            >
              {getStatusTag(scorer, intl).text}
            </Tag>
          )}
          <Button
            componentId={`${COMPONENT_ID_PREFIX}.edit-button`}
            size="small"
            icon={<PencilIcon />}
            onClick={onEditClick}
          >
            <FormattedMessage defaultMessage="Edit" description="Edit button for judge" />
          </Button>
          <ScorerCardOverflowMenu onDelete={onDeleteClick} />
        </div>
      </div>
      {/* Expanded content - aligned with scorer name, display mode only */}
      {isExpanded && (
        <div
          css={{
            gridColumn: '2 / -1',
            marginTop: theme.spacing.md,
            cursor: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {scorer.type === 'llm' && (
            <LLMScorerFormRenderer
              mode={SCORER_FORM_MODE.DISPLAY}
              control={control as Control<LLMScorerFormData>}
              setValue={setValue as UseFormSetValue<LLMScorerFormData>}
              getValues={getValues as UseFormGetValues<LLMScorerFormData>}
            />
          )}
          {scorer.type === 'custom-code' && (
            <CustomCodeScorerFormRenderer
              control={control as Control<CustomCodeScorerFormData>}
              mode={SCORER_FORM_MODE.DISPLAY}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default ScorerCardRenderer;
```

--------------------------------------------------------------------------------

````

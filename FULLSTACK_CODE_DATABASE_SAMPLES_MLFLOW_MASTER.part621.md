---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 621
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 621 of 991)

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

---[FILE: EvaluationTraceDataDrawer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationTraceDataDrawer.tsx

```typescript
import { isNil } from 'lodash';

import { Drawer, Empty, Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import { ModelTraceExplorer } from '@databricks/web-shared/model-trace-explorer';

export const EvaluationTraceDataDrawer = ({
  requestId,
  onClose,
  trace,
}: {
  requestId: string;
  onClose: () => void;
  trace: ModelTrace;
}) => {
  const { theme } = useDesignSystemTheme();
  const title = (
    <Typography.Title level={2} withoutMargins>
      {requestId}
    </Typography.Title>
  );

  const renderContent = () => {
    const containsSpans = trace.data.spans.length > 0;
    if (isNil(trace) || !containsSpans) {
      return (
        <>
          <Spacer size="lg" />
          <Empty
            description={null}
            title={
              <FormattedMessage
                defaultMessage="No trace data recorded"
                description="Experiment page > traces data drawer > no trace data recorded empty state"
              />
            }
          />
        </>
      );
    } else {
      return (
        <div
          css={{
            height: '100%',
            marginLeft: -theme.spacing.lg,
            marginRight: -theme.spacing.lg,
            marginBottom: -theme.spacing.lg,
          }}
          // This is required for mousewheel scrolling within `Drawer`
          onWheel={(e) => e.stopPropagation()}
        >
          <ModelTraceExplorer modelTrace={trace} />
        </div>
      );
    }
  };

  return (
    <Drawer.Root
      modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Drawer.Content
        componentId="mlflow.evaluations_review.trace_data_drawer"
        width="85vw"
        title={title}
        expandContentToFullHeight
      >
        {renderContent()}
      </Drawer.Content>
    </Drawer.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiDeleteTraceModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAiDeleteTraceModal.tsx
Signals: React

```typescript
import React, { useState } from 'react';

import { Modal, Typography } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import type { RunEvaluationTracesDataEntry } from '../types';

export const GenAiDeleteTraceModal = ({
  experimentIds,
  visible,
  selectedTraces,
  handleClose,
  deleteTraces,
}: {
  experimentIds: string[];
  visible: boolean;
  selectedTraces: RunEvaluationTracesDataEntry[];
  handleClose: () => void;
  deleteTraces: (experimentId: string, traceIds: string[]) => Promise<void>;
}) => {
  const intl = useIntl();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const tracesToDelete = selectedTraces.map((trace) => trace.evaluationId);

  const submitDeleteTraces = async () => {
    try {
      await deleteTraces(experimentIds[0] ?? '', tracesToDelete);
      handleClose();
    } catch (e: any) {
      setErrorMessage(
        intl.formatMessage({
          defaultMessage: 'An error occured while attempting to delete traces. Please refresh the page and try again.',
          description: 'Experiment page > traces view controls > Delete traces modal > Error message',
        }),
      );
    }
    setIsLoading(false);
  };

  const handleOk = () => {
    submitDeleteTraces();
    setIsLoading(true);
  };

  return (
    <Modal
      componentId="eval-tab.delete_traces-modal"
      title={
        <FormattedMessage
          defaultMessage="{count, plural, one {Delete Trace} other {Delete Traces}}"
          description="Experiment page > traces view controls > Delete traces modal > Title"
          values={{ count: tracesToDelete.length }}
        />
      }
      visible={visible}
      onCancel={handleClose}
      okText={
        <FormattedMessage
          defaultMessage="Delete {count, plural, one { # trace } other { # traces }}"
          description="Experiment page > traces view controls > Delete traces modal > Delete button"
          values={{ count: tracesToDelete.length }}
        />
      }
      onOk={handleOk}
      okButtonProps={{ loading: isLoading, danger: true }}
    >
      {errorMessage && <Typography.Paragraph color="error">{errorMessage}</Typography.Paragraph>}
      <Typography.Paragraph>
        <Typography.Text bold>
          <FormattedMessage
            defaultMessage="{count, plural, one { # trace } other { # traces }} will be deleted."
            description="Experiment page > traces view controls > Delete traces modal > Confirmation message title"
            values={{
              count: tracesToDelete.length,
            }}
          />
        </Typography.Text>
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FormattedMessage
          defaultMessage="Deleted traces cannot be restored. Are you sure you want to proceed?"
          description="Experiment page > traces view controls > Delete traces modal > Confirmation message"
        />
      </Typography.Paragraph>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiEvaluationBadge.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAiEvaluationBadge.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

export const GenAiEvaluationBadge = ({
  backgroundColor,
  icon,
  children,
}:
  | {
      backgroundColor?: string;
      icon?: React.ReactNode;
      children: React.ReactNode;
    }
  | {
      backgroundColor?: string;
      icon: React.ReactNode;
      children?: null;
    }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px 8px',
        gap: theme.spacing.xs,
        borderRadius: theme.borders.borderRadiusMd,
        color: theme.colors.textSecondary,
        backgroundColor: backgroundColor || theme.colors.backgroundSecondary,
        fontSize: theme.typography.fontSizeSm,
      }}
    >
      {icon ? icon : null}
      {children ? <span>{children}</span> : null}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiEvaluationTracesReview.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAiEvaluationTracesReview.intg.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, expect, it } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider, useIntl } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import type { UseQueryResult } from '@databricks/web-shared/query-client';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import { GenAiEvaluationTracesReview } from './GenAiEvaluationTracesReview';
import { createTestTrace } from '../test-fixtures/EvaluatedTraceTestUtils';
import type { RunEvaluationTracesDataEntry } from '../types';
import { getAssessmentInfos } from '../utils/AggregationUtils';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(120000); // This is quite expensive test

// Mock necessary modules
jest.mock('@databricks/web-shared/global-settings', () => ({
  getUser: jest.fn(),
}));

const testRunUuid = 'test-run-uuid';

describe('Evaluations review single eval - integration test', () => {
  beforeEach(() => {
    // Mock user ID
    jest.mocked(getUser).mockImplementation(() => 'test.user@mlflow.org');

    // Mocked returned timestamp
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000);

    // Silence a noisy issue with Typeahead component and its '_TYPE' prop
    // eslint-disable-next-line no-console -- TODO(FEINF-3587)
    const originalConsoleError = console.error;
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (args[0]?.includes?.('React does not recognize the `%s` prop on a DOM element')) {
        return;
      }
      originalConsoleError(...args);
    });

    // This is necessary to avoid ".scrollTo is not a function" error
    // See https://github.com/vuejs/vue-test-utils/issues/319#issuecomment-354667621
    Element.prototype.scrollTo = () => {};
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderTestComponent = (
    evaluation: RunEvaluationTracesDataEntry,
    additionalProps: Partial<ComponentProps<typeof GenAiEvaluationTracesReview>> = {},
  ) => {
    const TestComponent = () => {
      const intl = useIntl();

      return (
        <DesignSystemProvider>
          <QueryClientProvider
            client={
              new QueryClient({
                logger: {
                  error: () => {},
                  log: () => {},
                  warn: () => {},
                },
              })
            }
          >
            {evaluation ? (
              <GenAiEvaluationTracesReview
                experimentId="test-experiment-id"
                runUuid={testRunUuid}
                evaluation={evaluation}
                selectNextEval={() => {}}
                isNextAvailable={false}
                runDisplayName="Test Run"
                assessmentInfos={getAssessmentInfos(intl, [evaluation], undefined)}
                traceQueryResult={
                  {
                    isLoading: false,
                    data: undefined,
                  } as unknown as UseQueryResult<ModelTrace | undefined, unknown>
                }
                compareToTraceQueryResult={
                  {
                    isLoading: false,
                    data: undefined,
                  } as unknown as UseQueryResult<ModelTrace | undefined, unknown>
                }
                {...additionalProps}
              />
            ) : (
              <></>
            )}
          </QueryClientProvider>
        </DesignSystemProvider>
      );
    };

    return render(
      <IntlProvider locale="en">
        <TestComponent />
      </IntlProvider>,
    );
  };

  const waitForViewToBeReady = () =>
    waitFor(() => expect(screen.getByText(/Overall assessment/)).toBeInTheDocument(), {
      timeout: 2000,
    });

  it('Make sure a single evaluation can be rendered', async () => {
    const testTrace = createTestTrace({
      requestId: 'request_0',
      request: 'Hello world',
      assessments: [
        {
          name: 'overall_assessment',
          value: 'yes',
          dtype: 'pass-fail',
        },
      ],
    });

    renderTestComponent(testTrace);

    await waitForViewToBeReady();

    // Smoke test that the eval rendered.
    expect(screen.getByText('Hello world')).toBeInTheDocument();

    expect(screen.getByText('Detailed assessments')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GenAiEvaluationTracesReview.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAiEvaluationTracesReview.tsx
Signals: React

```typescript
import { useCallback, useEffect, useRef } from 'react';

import { Spinner, useDesignSystemTheme } from '@databricks/design-system';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import type { UseQueryResult } from '@databricks/web-shared/query-client';

import { EvaluationsReviewDetails } from './EvaluationsReviewDetails';
import {
  copyAiOverallAssessmentAsHumanAssessment,
  shouldRepeatExistingOriginalOverallAiAssessment,
} from './GenAiEvaluationTracesReview.utils';
import type { AssessmentInfo, RunEvaluationTracesDataEntry, SaveAssessmentsQuery } from '../types';
import { RUN_EVALUATIONS_SINGLE_ITEM_REVIEW_UI_PAGE_ID } from '../utils/EvaluationLogging';

export const GenAiEvaluationTracesReview = ({
  experimentId,
  evaluation,
  otherEvaluation,
  className,
  runUuid,
  isReadOnly = false,
  selectNextEval,
  isNextAvailable,
  runDisplayName,
  compareToRunDisplayName,
  exportToEvalsInstanceEnabled = false,
  assessmentInfos,
  traceQueryResult,
  compareToTraceQueryResult,
  saveAssessmentsQuery,
}: {
  experimentId: string;
  evaluation: RunEvaluationTracesDataEntry;
  otherEvaluation?: RunEvaluationTracesDataEntry;
  className?: string;
  runUuid?: string;
  isReadOnly?: boolean;
  selectNextEval: () => void;
  isNextAvailable: boolean;
  runDisplayName?: string;
  compareToRunDisplayName?: string;
  exportToEvalsInstanceEnabled?: boolean;
  assessmentInfos: AssessmentInfo[];
  traceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
  compareToTraceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
  saveAssessmentsQuery?: SaveAssessmentsQuery;
}) => {
  const { theme } = useDesignSystemTheme();

  const handleSavePendingAssessments = useCallback(
    async (evaluation, pendingAssessments) => {
      if (!evaluation || isReadOnly || !runUuid || !saveAssessmentsQuery) {
        return;
      }

      // Prepare the list of assessments to be sent to the backend.
      const assessmentsToSave = pendingAssessments.slice();

      // Even if user did not provide any explicit overall assessment, we still should be able to mark the evaluation as reviewed.
      // We check if there are no user provided overall assessments and if the last overall assessment was AI generated.
      const shouldRepeatOverallAiAssessment = shouldRepeatExistingOriginalOverallAiAssessment(
        evaluation,
        pendingAssessments,
      );

      // If we should repeat the AI generated overall assessment, we need to copy and add it to the list of assessments to save.
      if (shouldRepeatOverallAiAssessment) {
        const repeatedOverallAssessment = copyAiOverallAssessmentAsHumanAssessment(evaluation);

        repeatedOverallAssessment && assessmentsToSave.unshift(repeatedOverallAssessment);
      }

      return saveAssessmentsQuery.savePendingAssessments(runUuid, evaluation.evaluationId, assessmentsToSave);
    },
    [runUuid, isReadOnly, saveAssessmentsQuery],
  );

  // Scroll right side panel to the top when switching between evaluations
  const reviewDetailsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    reviewDetailsRef.current?.scrollTo(0, 0);
  }, [evaluation.evaluationId]);

  return (
    <div
      // comment for copybara formatting
      css={{ display: 'flex', position: 'relative', overflow: 'scroll' }}
      className={className}
    >
      <div
        css={{
          flex: 1,
          overflow: 'auto',
        }}
        ref={reviewDetailsRef}
      >
        <EvaluationsReviewDetails
          experimentId={experimentId}
          key={evaluation.evaluationId}
          evaluationResult={evaluation}
          otherEvaluationResult={otherEvaluation}
          onSavePendingAssessments={handleSavePendingAssessments}
          onClickNext={selectNextEval}
          isNextAvailable={isNextAvailable}
          isReadOnly={isReadOnly || !runUuid}
          runDisplayName={runDisplayName}
          compareToRunDisplayName={compareToRunDisplayName}
          exportToEvalsInstanceEnabled={exportToEvalsInstanceEnabled}
          assessmentInfos={assessmentInfos}
          traceQueryResult={traceQueryResult}
          compareToTraceQueryResult={compareToTraceQueryResult}
        />
      </div>
      {saveAssessmentsQuery?.isSaving && (
        <div
          css={{
            inset: 0,
            position: 'absolute',
            backgroundColor: theme.colors.overlayOverlay,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: theme.options.zIndexBase + 1,
          }}
        >
          <Spinner size="large" inheritColor css={{ color: theme.colors.backgroundPrimary }} />
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAiEvaluationTracesReview.utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAiEvaluationTracesReview.utils.test.ts

```typescript
import { describe, it, jest, expect } from '@jest/globals';

import type { ThemeType } from '@databricks/design-system';
import { I18nUtils } from '@databricks/i18n';

import {
  autoSelectFirstNonEmptyEvaluationId,
  getAssessmentValueLabel,
  getEvaluationResultInputTitle,
  getEvaluationResultTitle,
  stringifyValue,
} from './GenAiEvaluationTracesReview.utils';
import type { AssessmentInfo, RunEvaluationTracesDataEntry } from '../types';

const buildExampleRunEvaluationTracesDataEntry = ({
  evaluationId,
  inputs,
}: {
  evaluationId: string | undefined | null;
  inputs?: any;
}): RunEvaluationTracesDataEntry => {
  return {
    requestId: '',
    // @ts-expect-error test the case where evaluationId is undefined or null
    evaluationId: evaluationId,
    inputs: inputs || {},
    inputsId: '',
    outputs: {},
    targets: {},
    overallAssessments: [],
    responseAssessmentsByName: { overall_assessment: [] },
    metrics: {},
    retrievalChunks: [],
  };
};

describe('EvaluationsReview utils', () => {
  describe('autoSelectFirstNonEmptyEvaluationId', () => {
    const exampleEvaluations = [
      buildExampleRunEvaluationTracesDataEntry({ evaluationId: undefined }),
      buildExampleRunEvaluationTracesDataEntry({ evaluationId: null }),
      buildExampleRunEvaluationTracesDataEntry({ evaluationId: '' }),
      buildExampleRunEvaluationTracesDataEntry({ evaluationId: 'evaluation-1' }),
      buildExampleRunEvaluationTracesDataEntry({ evaluationId: 'evaluation-2' }),
    ];

    it('should select the first non-empty evaluation id', () => {
      const mockSetter = jest.fn();
      autoSelectFirstNonEmptyEvaluationId(exampleEvaluations, undefined, mockSetter);
      expect(mockSetter).toHaveBeenCalledWith('evaluation-1');
      expect(mockSetter).toHaveBeenCalledTimes(1);
    });

    it.each([
      [],
      null,
      // All evaluations have empty evaluation id
      [
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: undefined }),
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: null }),
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: '' }),
      ],
    ])('should not set if no non-empty evaluation id', (evaluations: RunEvaluationTracesDataEntry[] | null) => {
      const mockSetter = jest.fn();
      autoSelectFirstNonEmptyEvaluationId(evaluations, undefined, mockSetter);
      expect(mockSetter).not.toHaveBeenCalled();
    });

    it('should not set if selectedEvaluationId is already set', () => {
      const mockSetter = jest.fn();
      autoSelectFirstNonEmptyEvaluationId(exampleEvaluations, 'some-eval-id', mockSetter);
      expect(mockSetter).not.toHaveBeenCalled();
    });
  });

  describe('getEvaluationResultTitle', () => {
    it('should get the inputs.request if present', () => {
      const actual = getEvaluationResultTitle(
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: 'evaluation-1', inputs: { request: 'request' } }),
      );
      expect(actual).toEqual('request');
    });

    it('should get the evaluation id if inputs.request not present', () => {
      const actual = getEvaluationResultTitle(
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: 'evaluation-1' }),
      );
      expect(actual).toEqual('evaluation-1');
    });

    it('should get the stringify inputs.request if not a string', () => {
      const actual = getEvaluationResultTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: { arg1: { foo: 'bar' } },
        }),
      );
      expect(actual).toEqual(stringifyValue({ arg1: { foo: 'bar' } }));
    });

    it('should parse openai messages', () => {
      const actual = getEvaluationResultTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: { messages: [{ role: 'user', content: 'foo' }] },
        }),
      );
      expect(actual).toEqual('foo');
    });

    it('should read the last message from openai messages', () => {
      const actual = getEvaluationResultTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: {
            messages: [
              { role: 'user', content: 'foo' },
              { role: 'assistant', content: 'yes?' },
              { role: 'user', content: 'bar' },
            ],
          },
        }),
      );
      expect(actual).toEqual('bar');
    });
  });

  describe('getEvaluationResultInputTitle', () => {
    it('should return the input if it is a string', () => {
      const actual = getEvaluationResultInputTitle(
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: 'evaluation-1', inputs: { request: 'request' } }),
        'request',
      );
      expect(actual).toEqual('request');
    });

    it('should stringify the input if it is not a string', () => {
      const actual = getEvaluationResultInputTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: { customKey: { custom: 'custom' } },
        }),
        'customKey',
      );
      expect(actual).toEqual(stringifyValue({ custom: 'custom' }));
    });

    it('should return undefined if the key does not exist', () => {
      const actual = getEvaluationResultInputTitle(
        buildExampleRunEvaluationTracesDataEntry({ evaluationId: 'evaluation-1' }),
        'request',
      );
      expect(actual).toBeUndefined();
    });

    it('should parse openai messages', () => {
      const actual = getEvaluationResultInputTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: { messages: [{ role: 'user', content: 'foo' }] },
        }),
        'messages',
      );
      expect(actual).toEqual('foo');
    });

    it('should read the last message from openai messages', () => {
      const actual = getEvaluationResultInputTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: {
            messages: [
              { role: 'user', content: 'foo' },
              { role: 'assistant', content: 'yes?' },
              { role: 'user', content: 'bar' },
            ],
          },
        }),
        'messages',
      );
      expect(actual).toEqual('bar');
    });

    it('should parse openai messages without messages key', () => {
      const actual = getEvaluationResultInputTitle(
        buildExampleRunEvaluationTracesDataEntry({
          evaluationId: 'evaluation-1',
          inputs: {
            messages_custom: [
              { role: 'user', content: 'foo' },
              { role: 'assistant', content: 'yes?' },
              { role: 'user', content: 'bar' },
            ],
          },
        }),
        'messages_custom',
      );
      expect(actual).toEqual('bar');
    });
  });

  it('should read the last message from openai messages, when nested under request', () => {
    const actual = getEvaluationResultInputTitle(
      buildExampleRunEvaluationTracesDataEntry({
        evaluationId: 'evaluation-1',
        inputs: {
          request: {
            messages: [
              { role: 'user', content: 'foo' },
              { role: 'assistant', content: 'yes?' },
              { role: 'user', content: 'bar' },
            ],
          },
        },
      }),
      'request',
    );
    expect(actual).toEqual('bar');
  });
});

describe('getAssessmentValueLabel', () => {
  const intl = I18nUtils.createIntlWithLocale();
  const mockTheme = {} as ThemeType;

  const createMockAssessmentInfo = (dtype: AssessmentInfo['dtype']): AssessmentInfo => ({
    name: 'test_assessment',
    displayName: 'Test Assessment',
    isKnown: false,
    isOverall: false,
    metricName: 'test_metric',
    source: undefined,
    isCustomMetric: false,
    isEditable: false,
    isRetrievalAssessment: false,
    dtype,
    uniqueValues: new Set(),
    docsLink: '',
    missingTooltip: '',
    description: '',
  });

  it('should return "Error" for error value regardless of dtype', () => {
    const booleanAssessment = createMockAssessmentInfo('boolean');
    const result = getAssessmentValueLabel(intl, mockTheme, booleanAssessment, 'Error');
    expect(result.content).toBe('Error');
  });

  it('should return "Error" for pass-fail dtype with error value', () => {
    const passFail = createMockAssessmentInfo('pass-fail');
    const result = getAssessmentValueLabel(intl, mockTheme, passFail, 'Error');
    expect(result.content).toBe('Error');
  });

  it('should return "True" for boolean dtype with true value', () => {
    const booleanAssessment = createMockAssessmentInfo('boolean');
    const result = getAssessmentValueLabel(intl, mockTheme, booleanAssessment, true);
    expect(result.content).toBe('True');
  });

  it('should return "False" for boolean dtype with false value', () => {
    const booleanAssessment = createMockAssessmentInfo('boolean');
    const result = getAssessmentValueLabel(intl, mockTheme, booleanAssessment, false);
    expect(result.content).toBe('False');
  });

  it('should return "null" for boolean dtype with undefined value', () => {
    const booleanAssessment = createMockAssessmentInfo('boolean');
    const result = getAssessmentValueLabel(intl, mockTheme, booleanAssessment, undefined);
    expect(result.content).toBe('null');
  });

  it('should return string representation for other dtypes', () => {
    const stringAssessment = createMockAssessmentInfo('string');
    const result = getAssessmentValueLabel(intl, mockTheme, stringAssessment, 'custom_value');
    expect(result.content).toBe('custom_value');
  });
});
```

--------------------------------------------------------------------------------

````

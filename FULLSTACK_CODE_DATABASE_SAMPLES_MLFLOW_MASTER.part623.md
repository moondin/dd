---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 623
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 623 of 991)

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

---[FILE: GenAiEvaluationTracesReviewModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAiEvaluationTracesReviewModal.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import React, { useCallback, useMemo } from 'react';

import {
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  GenericSkeleton,
  Modal,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { ModelTraceExplorer, type ModelTrace } from '@databricks/web-shared/model-trace-explorer';

import { EvaluationsReviewDetailsHeader } from './EvaluationsReviewDetails';
import { GenAiEvaluationTracesReview } from './GenAiEvaluationTracesReview';
import { useGenAITracesTableConfig } from '../hooks/useGenAITracesTableConfig';
import type { GetTraceFunction } from '../hooks/useGetTrace';
import { useGetTrace } from '../hooks/useGetTrace';
import type { AssessmentInfo, EvalTraceComparisonEntry, SaveAssessmentsQuery } from '../types';
import { getSpansLocation, TRACKING_STORE_SPANS_LOCATION } from '../utils/TraceUtils';

const MODAL_SPACING_REM = 4;
const DEFAULT_MODAL_MARGIN_REM = 1;

export const GenAiEvaluationTracesReviewModal = React.memo(
  ({
    experimentId,
    runUuid,
    evaluations,
    selectedEvaluationId,
    onChangeEvaluationId,
    runDisplayName,
    otherRunDisplayName,
    exportToEvalsInstanceEnabled = false,
    assessmentInfos,
    getTrace,
    saveAssessmentsQuery,
  }: {
    experimentId: string;
    runUuid?: string;
    evaluations: EvalTraceComparisonEntry[];
    selectedEvaluationId: string;
    onChangeEvaluationId: (evaluationId: string | undefined) => void;
    runDisplayName?: string;
    otherRunDisplayName?: string;
    exportToEvalsInstanceEnabled?: boolean;
    assessmentInfos: AssessmentInfo[];
    getTrace?: GetTraceFunction;
    saveAssessmentsQuery?: SaveAssessmentsQuery;
  }) => {
    const { theme, classNamePrefix } = useDesignSystemTheme();

    const handleClose = useCallback(() => {
      onChangeEvaluationId(undefined);
    }, [onChangeEvaluationId]);

    // The URL always has an evaluation id, so we look in either current or other for the eval.
    const findEval = useCallback(
      (entry: EvalTraceComparisonEntry) =>
        entry.currentRunValue?.evaluationId === selectedEvaluationId ||
        entry.otherRunValue?.evaluationId === selectedEvaluationId,
      [selectedEvaluationId],
    );

    const previousEvaluationIdx = useMemo(
      () => (evaluations ? evaluations?.findIndex(findEval) - 1 : undefined),
      [evaluations, findEval],
    );
    const isPreviousAvailable = useMemo(
      () => previousEvaluationIdx !== undefined && previousEvaluationIdx >= 0,
      [previousEvaluationIdx],
    );

    const nextEvaluationIdx = useMemo(
      () => (evaluations ? evaluations?.findIndex(findEval) + 1 : undefined),
      [evaluations, findEval],
    );
    const isNextAvailable = useMemo(
      () => nextEvaluationIdx !== undefined && nextEvaluationIdx < evaluations.length,
      [nextEvaluationIdx, evaluations],
    );

    const selectPreviousEval = useCallback(() => {
      if (evaluations === null || previousEvaluationIdx === undefined) return;

      const newEvalId =
        evaluations[previousEvaluationIdx]?.currentRunValue?.evaluationId ||
        evaluations[previousEvaluationIdx]?.otherRunValue?.evaluationId;
      onChangeEvaluationId(newEvalId);
    }, [evaluations, previousEvaluationIdx, onChangeEvaluationId]);

    const selectNextEval = useCallback(() => {
      if (evaluations === null || nextEvaluationIdx === undefined) return;

      const newEvalId =
        evaluations[nextEvaluationIdx]?.currentRunValue?.evaluationId ||
        evaluations[nextEvaluationIdx]?.otherRunValue?.evaluationId;
      onChangeEvaluationId(newEvalId);
    }, [evaluations, nextEvaluationIdx, onChangeEvaluationId]);

    const evaluation = useMemo(() => evaluations?.find(findEval), [evaluations, findEval]);
    const nextEvaluation = useMemo(
      () => (nextEvaluationIdx && evaluations ? evaluations?.[nextEvaluationIdx] : undefined),
      [evaluations, nextEvaluationIdx],
    );
    const previousEvaluation = useMemo(
      () => (previousEvaluationIdx && evaluations ? evaluations?.[previousEvaluationIdx] : undefined),
      [evaluations, previousEvaluationIdx],
    );

    const tracesTableConfig = useGenAITracesTableConfig();

    // --- Auto-polling until trace is complete if the backend supports returning partial spans ---
    const spansLocation = getSpansLocation(evaluation?.currentRunValue?.traceInfo);
    const shouldEnablePolling = spansLocation === TRACKING_STORE_SPANS_LOCATION;

    const traceQueryResult = useGetTrace(getTrace, evaluation?.currentRunValue?.traceInfo, shouldEnablePolling);
    const compareToTraceQueryResult = useGetTrace(getTrace, evaluation?.otherRunValue?.traceInfo, shouldEnablePolling);

    // Prefetching the next and previous traces to optimize performance
    useGetTrace(getTrace, nextEvaluation?.currentRunValue?.traceInfo);
    useGetTrace(getTrace, previousEvaluation?.currentRunValue?.traceInfo);

    // is true if only one of the two runs has a trace
    const isSingleTraceView = Boolean(evaluation?.currentRunValue) !== Boolean(evaluation?.otherRunValue);

    const currentTraceQueryResult =
      selectedEvaluationId === evaluation?.currentRunValue?.evaluationId ? traceQueryResult : compareToTraceQueryResult;

    if (isNil(evaluation)) {
      return <></>;
    }

    return (
      <div
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            selectPreviousEval();
          } else if (e.key === 'ArrowRight') {
            selectNextEval();
          }
        }}
      >
        <Modal
          componentId="mlflow.evaluations_review.modal"
          visible
          title={
            evaluation.currentRunValue ? (
              <EvaluationsReviewDetailsHeader evaluationResult={evaluation.currentRunValue} />
            ) : evaluation.otherRunValue ? (
              <EvaluationsReviewDetailsHeader evaluationResult={evaluation.otherRunValue} />
            ) : null
          }
          onCancel={handleClose}
          size="wide"
          verticalSizing="maxed_out"
          css={{
            width: '100% !important',
            padding: `0 ${MODAL_SPACING_REM}rem !important`,
            [`& .${classNamePrefix}-modal-body`]: {
              flex: 1,
              paddingTop: 0,
            },
            [`& .${classNamePrefix}-modal-header`]: {
              paddingBottom: theme.spacing.sm,
            },
          }}
          footer={null} // Hide the footer
        >
          {/* Only show skeleton for the first fetch to avoid flickering when polling new spans */}
          {!currentTraceQueryResult?.data && currentTraceQueryResult?.isFetching && (
            <GenericSkeleton
              label="Loading trace..."
              style={{
                // Size the width and height to fit the modal content area
                width: 'calc(100% - 45px)',
                height: 'calc(100% - 100px)',
                position: 'absolute',
                paddingRight: 500,
                zIndex: 2100,
                backgroundColor: theme.colors.backgroundPrimary,
              }}
            />
          )}
          {
            // Show ModelTraceExplorer only if there is no run to compare to and there's trace data.
            isSingleTraceView && !isNil(currentTraceQueryResult?.data) ? (
              <div css={{ height: '100%', marginLeft: -theme.spacing.lg, marginRight: -theme.spacing.lg }}>
                {/* prettier-ignore */}
                <ModelTraceExplorerModalBody
                  traceData={currentTraceQueryResult.data}
                />
              </div>
            ) : (
              evaluation.currentRunValue && (
                <GenAiEvaluationTracesReview
                  experimentId={experimentId}
                  evaluation={evaluation.currentRunValue}
                  otherEvaluation={evaluation.otherRunValue}
                  selectNextEval={selectNextEval}
                  isNextAvailable={isNextAvailable}
                  css={{ flex: 1, overflow: 'hidden' }}
                  runUuid={runUuid}
                  isReadOnly={!tracesTableConfig.enableRunEvaluationWriteFeatures}
                  runDisplayName={runDisplayName}
                  compareToRunDisplayName={otherRunDisplayName}
                  exportToEvalsInstanceEnabled={exportToEvalsInstanceEnabled}
                  assessmentInfos={assessmentInfos}
                  traceQueryResult={traceQueryResult}
                  compareToTraceQueryResult={compareToTraceQueryResult}
                  saveAssessmentsQuery={saveAssessmentsQuery}
                />
              )
            )
          }
        </Modal>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'fixed',
            top: '50%',
            left: 0,
            zIndex: 2000,
            opacity: '.75',
            width: `${MODAL_SPACING_REM + DEFAULT_MODAL_MARGIN_REM}rem`,
            '&:hover': {
              opacity: '1.0',
            },
          }}
        >
          <div
            css={{
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: theme.legacyBorders.borderRadiusMd,
              marginRight: theme.spacing.sm,
            }}
          >
            <Button
              disabled={!isPreviousAvailable}
              componentId="mlflow.evaluations_review.modal.previous_eval"
              icon={<ChevronLeftIcon />}
              onClick={() => selectPreviousEval()}
            />
          </div>
        </div>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-start',
            position: 'fixed',
            top: '50%',
            right: 0,
            zIndex: 2000,
            width: `${MODAL_SPACING_REM + DEFAULT_MODAL_MARGIN_REM}rem`,
            opacity: '.75',
            '&:hover': {
              opacity: '1.0',
            },
          }}
        >
          <div
            css={{
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: theme.legacyBorders.borderRadiusMd,
              marginLeft: theme.spacing.sm,
            }}
          >
            <Button
              disabled={!isNextAvailable}
              componentId="mlflow.evaluations_review.modal.next_eval"
              icon={<ChevronRightIcon />}
              onClick={() => selectNextEval()}
            />
          </div>
        </div>
      </div>
    );
  },
);

// prettier-ignore
const ModelTraceExplorerModalBody = ({
  traceData,
}: {
  traceData: ModelTrace;
}) => {
  return (
    <ModelTraceExplorer
      modelTrace={traceData}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: GenAITraceComparisonModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAITraceComparisonModal.test.tsx
Signals: React

```typescript
import { jest, describe, it, expect, afterEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from '@databricks/i18n';
import { DesignSystemProvider } from '@databricks/design-system';
import type { ModelTrace } from '../../model-trace-explorer';
import { MOCK_TRACE } from '../../model-trace-explorer/ModelTraceExplorer.test-utils';
import { GenAITraceComparisonModal } from './GenAITraceComparisonModal';

jest.mock('../../model-trace-explorer', () => ({
  ModelTraceExplorer: jest.fn(() => <div data-testid="model-trace-explorer" />),
}));

jest.mock('@mlflow/mlflow/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useFetchTraces', () => ({
  useFetchTraces: jest.fn(),
}));

const getModelTraceExplorerMock = () =>
  (jest.requireMock('../../model-trace-explorer') as any).ModelTraceExplorer as jest.Mock;
const getUseFetchTracesMock = () =>
  (
    jest.requireMock(
      '@mlflow/mlflow/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useFetchTraces',
    ) as any
  ).useFetchTraces as jest.Mock;

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <IntlProvider locale="en">
      <DesignSystemProvider>{ui}</DesignSystemProvider>
    </IntlProvider>,
  );

describe('GenAITraceComparisonModal', () => {
  const mockTraceIds = ['trace-1', 'trace-2'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading message when traces are still being resolved', () => {
    getUseFetchTracesMock().mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderWithProviders(<GenAITraceComparisonModal traceIds={mockTraceIds} onClose={jest.fn()} />);

    expect(screen.getByText('Loading traces…')).toBeInTheDocument();
    expect(getModelTraceExplorerMock()).not.toHaveBeenCalled();
  });

  it('requests the traces and renders the explorer for each resolved trace', async () => {
    const resolvedTrace: ModelTrace = {
      ...MOCK_TRACE,
      info: {
        ...(MOCK_TRACE.info as any),
        trace_id: 'trace-1',
      },
    } as ModelTrace;

    getUseFetchTracesMock().mockReturnValue({
      data: [resolvedTrace],
      isLoading: false,
    });

    renderWithProviders(<GenAITraceComparisonModal traceIds={mockTraceIds} onClose={jest.fn()} />);

    await waitFor(() => expect(getUseFetchTracesMock()).toHaveBeenCalledWith({ traceIds: mockTraceIds }));

    await waitFor(() => expect(screen.getAllByTestId('model-trace-explorer')).toHaveLength(1));

    expect(getModelTraceExplorerMock()).toHaveBeenCalledWith(
      expect.objectContaining({
        modelTrace: resolvedTrace,
        initialActiveView: 'summary',
        isInComparisonView: true,
      }),
      {},
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GenAITraceComparisonModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/GenAITraceComparisonModal.tsx
Signals: React

```typescript
import { ModelTraceExplorer } from '../../model-trace-explorer';
import { useMemo } from 'react';

import { Modal, Typography, useDesignSystemTheme } from '@databricks/design-system';

import { useIntl } from '@databricks/i18n';
import { useFetchTraces } from '@mlflow/mlflow/src/experiment-tracking/pages/experiment-evaluation-datasets/hooks/useFetchTraces';
import { compact } from 'lodash';

export const GenAITraceComparisonModal = ({ traceIds, onClose }: { traceIds: string[]; onClose: () => void }) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const { data: fetchedTraces, isLoading } = useFetchTraces({ traceIds });

  const modelTraces = useMemo(() => compact(fetchedTraces), [fetchedTraces]);

  return (
    <Modal
      componentId="mlflow.genai-traces-table.compare-modal"
      visible
      title={intl.formatMessage({ defaultMessage: 'Compare traces', description: 'Compare traces modal title' })}
      onCancel={onClose}
      size="wide"
      verticalSizing="maxed_out"
      footer={null}
      dangerouslySetAntdProps={{ width: '95%' }}
    >
      <div
        css={{
          height: '100%',
          overflow: 'auto',
          marginLeft: -theme.spacing.lg,
          marginRight: -theme.spacing.lg,
        }}
      >
        <div
          css={{
            display: 'flex',
            minHeight: '100%',
            flexWrap: 'nowrap',
          }}
        >
          {isLoading || !modelTraces || modelTraces.length === 0 ? (
            <Typography.Text>
              {intl.formatMessage({ defaultMessage: 'Loading traces…', description: 'Loading traces message' })}
            </Typography.Text>
          ) : (
            modelTraces.map((modelTrace, index) => (
              <div
                key={traceIds[index]}
                css={{
                  flex: '1 1 0',
                  minHeight: '100%',
                  minWidth: 0,
                  borderRight: index < modelTraces.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                }}
              >
                <ModelTraceExplorer modelTrace={modelTrace} initialActiveView="summary" isInComparisonView />
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunColorCircle.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/RunColorCircle.tsx
Signals: React

```typescript
import React from 'react';

export const RunColorCircle = React.memo(({ color, hidden }: { color: string; hidden?: boolean }) => {
  return (
    <label
      css={{
        width: 12,
        height: 12,
        borderRadius: 6,
        flexShrink: 0,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        cursor: 'default',
        position: 'relative',
      }}
      style={{
        backgroundColor: color,
        display: hidden ? 'none' : '',
      }}
    >
      <span
        css={{
          clip: 'rect(0px, 0px, 0px, 0px)',
          clipPath: 'inset(50%)',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
      >
        {color}
      </span>
    </label>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: VerticalBar.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/VerticalBar.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

export const VerticalBar = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        width: '1.5px',
        backgroundColor: theme.colors.border,
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentColumnSummary.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/charts/AssessmentColumnSummary.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import React, { useMemo } from 'react';

import type { ThemeType } from '@databricks/design-system';
import type { IntlShape } from '@databricks/i18n';

import { CategoricalAggregateChart } from './CategoricalAggregateChart';
import { NumericAggregateChart } from './NumericAggregateChart';
import {
  type AssessmentAggregates,
  type AssessmentFilter,
  type AssessmentInfo,
  type AssessmentValueType,
} from '../../types';
import { AGGREGATE_SCORE_CHANGE_BACKGROUND_COLORS, AGGREGATE_SCORE_CHANGE_TEXT_COLOR } from '../../utils/Colors';
import { getDisplayOverallScoreAndChange } from '../../utils/DisplayUtils';
import { withAlpha } from '../GenAiEvaluationTracesReview.utils';

export const AssessmentColumnSummary = React.memo(
  ({
    theme,
    intl,
    assessmentInfo,
    assessmentAggregates,
    allAssessmentFilters,
    toggleAssessmentFilter,
    currentRunDisplayName,
    compareToRunDisplayName,
    collapsedHeader,
  }: {
    theme: ThemeType;
    intl: IntlShape;
    assessmentInfo: AssessmentInfo;
    assessmentAggregates: AssessmentAggregates;
    allAssessmentFilters: AssessmentFilter[];
    toggleAssessmentFilter: (
      assessmentName: string,
      filterValue: AssessmentValueType,
      run: string,
      filterType?: AssessmentFilter['filterType'],
    ) => void;
    currentRunDisplayName?: string;
    compareToRunDisplayName?: string;
    collapsedHeader?: boolean;
  }) => {
    const dtypeAggregateLabel = useMemo(() => {
      if (assessmentInfo.dtype === 'pass-fail') {
        return intl.formatMessage({
          defaultMessage: 'PASS',
          description: 'Header label for pass/fail assessment type for the pass rate',
        });
      } else if (assessmentInfo.dtype === 'boolean') {
        return intl.formatMessage({
          defaultMessage: 'TRUE',
          description: 'Header label for boolean assessment type for the true rate',
        });
      } else if (assessmentInfo.dtype === 'string') {
        return intl.formatMessage({
          defaultMessage: 'STRING',
          description: 'Header label for string assessment type',
        });
      } else if (assessmentInfo.dtype === 'numeric') {
        return intl.formatMessage({
          defaultMessage: 'AVG',
          description: 'Header label for numeric assessment type for the average value',
        });
      }
      return undefined;
    }, [assessmentInfo, intl]);

    /** Overall aggregate scores */
    const { displayScore, displayScoreChange, changeDirection } = useMemo(
      () => getDisplayOverallScoreAndChange(intl, assessmentInfo, assessmentAggregates),
      [intl, assessmentInfo, assessmentAggregates],
    );

    if (assessmentInfo.dtype === 'unknown') {
      return null;
    }

    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: theme.spacing.xs,
          }}
        >
          {/* Aggregate label, e.g. "PASS" or "TRUE" */}
          <div
            css={{
              fontWeight: 400,
              fontSize: '10px',
              color: theme.colors.textPlaceholder,
            }}
          >
            {dtypeAggregateLabel}
          </div>
          {/* Overall score & diff */}
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.xs,
            }}
          >
            {/* Current run score */}
            <div
              css={{
                fontSize: theme.typography.fontSizeLg,
                color: theme.colors.textPrimary,
                fontWeight: theme.typography.typographyBoldFontWeight,
              }}
            >
              {displayScore}
            </div>
            {/* Diff score */}
            {!isNil(displayScoreChange) && compareToRunDisplayName && (
              <div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '20px',
                  gap: theme.spacing.xs,
                  padding: `2px ${theme.spacing.xs}px`,
                  fontSize: theme.typography.fontSizeMd,
                  fontWeight: 'normal',
                  borderRadius: theme.general.borderRadiusBase,
                  color: AGGREGATE_SCORE_CHANGE_TEXT_COLOR,
                  backgroundColor:
                    changeDirection === 'none'
                      ? ''
                      : changeDirection === 'up'
                      ? AGGREGATE_SCORE_CHANGE_BACKGROUND_COLORS.up
                      : changeDirection === 'down'
                      ? AGGREGATE_SCORE_CHANGE_BACKGROUND_COLORS.down
                      : withAlpha(theme.colors.textSecondary, 0.1),
                }}
              >
                {displayScoreChange}
              </div>
            )}
          </div>
        </div>

        {!collapsedHeader &&
          (!isNil(assessmentAggregates.currentNumericAggregate) ? (
            <NumericAggregateChart numericAggregate={assessmentAggregates.currentNumericAggregate} />
          ) : (
            // Categorical charts
            <CategoricalAggregateChart
              theme={theme}
              intl={intl}
              assessmentInfo={assessmentInfo}
              assessmentAggregates={assessmentAggregates}
              allAssessmentFilters={allAssessmentFilters}
              toggleAssessmentFilter={toggleAssessmentFilter}
              currentRunDisplayName={currentRunDisplayName}
              compareToRunDisplayName={compareToRunDisplayName}
            />
          ))}
      </div>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: CategoricalAggregateChart.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/charts/CategoricalAggregateChart.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { IntlProvider } from '@databricks/i18n';

import { CategoricalAggregateChart } from './CategoricalAggregateChart';
import type { AssessmentInfo, AssessmentAggregates, AssessmentFilter } from '../../types';
import { getBarChartData } from '../../utils/AggregationUtils';
import { getDisplayScore } from '../../utils/DisplayUtils';

// Mock the utilities
jest.mock('../../utils/AggregationUtils', () => ({
  ERROR_KEY: 'Error',
  getBarChartData: jest.fn(),
}));

jest.mock('../../utils/DisplayUtils', () => ({
  getDisplayScore: jest.fn(),
  getDisplayScoreChange: jest.fn(),
}));

const mockGetBarChartData = jest.mocked(getBarChartData);
const mockGetDisplayScore = jest.mocked(getDisplayScore);

// Test wrapper with IntlProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

const mockTheme = {
  colors: {
    actionDefaultBackgroundHover: '#f0f0f0',
    actionDefaultBackgroundPress: '#e0e0e0',
    textSecondary: '#666',
    textValidationWarning: '#ff6b6b',
  },
  spacing: {
    xs: 8,
  },
  typography: {
    fontSizeSm: 12,
  },
  general: {
    borderRadiusBase: 4,
  },
} as any;

const mockIntl = {
  formatMessage: jest.fn((message, values) => {
    // @ts-expect-error 'message' is of type 'unknown'
    if (message.defaultMessage === '+{count} more') {
      // @ts-expect-error 'values' is of type 'unknown'
      return `+${values.count} more`;
    }
    // @ts-expect-error 'message' is of type 'unknown'
    return message.defaultMessage || '';
  }),
} as any;

const mockAssessmentInfo: AssessmentInfo = {
  name: 'test_assessment',
  displayName: 'Test Assessment',
  isKnown: true,
  isOverall: false,
  metricName: 'test_metric',
  isCustomMetric: false,
  isEditable: false,
  isRetrievalAssessment: false,
  dtype: 'string',
  uniqueValues: new Set(['value1', 'value2', 'value3']),
  docsLink: '',
  missingTooltip: '',
  description: '',
};

const mockAssessmentAggregates: AssessmentAggregates = {
  assessmentInfo: mockAssessmentInfo,
  currentCounts: new Map(),
  otherCounts: new Map(),
  currentNumRootCause: 0,
  otherNumRootCause: 0,
  assessmentFilters: [],
};

const mockAllAssessmentFilters: AssessmentFilter[] = [];

const mockToggleAssessmentFilter = jest.fn();

describe('CategoricalAggregateChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      theme: mockTheme,
      intl: mockIntl,
      assessmentInfo: mockAssessmentInfo,
      assessmentAggregates: mockAssessmentAggregates,
      allAssessmentFilters: mockAllAssessmentFilters,
      toggleAssessmentFilter: mockToggleAssessmentFilter,
      currentRunDisplayName: 'Current Run',
      compareToRunDisplayName: 'Compare Run',
    };

    return render(
      <TestWrapper>
        <CategoricalAggregateChart {...defaultProps} {...props} />
      </TestWrapper>,
    );
  };

  describe('sorting behavior', () => {
    it('should maintain original order for pass-fail assessments', () => {
      const mockBarData = [
        {
          name: 'No',
          current: { value: 20, fraction: 0.8, isSelected: false, toggleFilter: jest.fn(), tooltip: 'No: 20' },
          backgroundColor: '#dc3545',
        },
        {
          name: 'Yes',
          current: { value: 5, fraction: 0.2, isSelected: false, toggleFilter: jest.fn(), tooltip: 'Yes: 5' },
          backgroundColor: '#28a745',
        },
      ];

      mockGetBarChartData.mockReturnValue(mockBarData);
      mockGetDisplayScore.mockReturnValue('80%');

      const passFailAssessmentInfo = { ...mockAssessmentInfo, dtype: 'pass-fail' as const };
      renderComponent({ assessmentInfo: passFailAssessmentInfo });

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveTextContent('No');
      expect(rows[1]).toHaveTextContent('Yes');
    });

    it('should maintain original order for boolean assessments', () => {
      const mockBarData = [
        {
          name: 'false',
          current: { value: 15, fraction: 0.75, isSelected: false, toggleFilter: jest.fn(), tooltip: 'false: 15' },
          backgroundColor: '#dc3545',
        },
        {
          name: 'true',
          current: { value: 5, fraction: 0.25, isSelected: false, toggleFilter: jest.fn(), tooltip: 'true: 5' },
          backgroundColor: '#28a745',
        },
      ];

      mockGetBarChartData.mockReturnValue(mockBarData);
      mockGetDisplayScore.mockReturnValue('75%');

      const booleanAssessmentInfo = { ...mockAssessmentInfo, dtype: 'boolean' as const };
      renderComponent({ assessmentInfo: booleanAssessmentInfo });

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveTextContent('false');
      expect(rows[1]).toHaveTextContent('true');
    });

    it('should sort by frequency for other assessment types', () => {
      const mockBarData = [
        {
          name: 'low',
          current: { value: 2, fraction: 0.1, isSelected: false, toggleFilter: jest.fn(), tooltip: 'low: 2' },
          backgroundColor: '#ffc107',
        },
        {
          name: 'high',
          current: { value: 15, fraction: 0.75, isSelected: false, toggleFilter: jest.fn(), tooltip: 'high: 15' },
          backgroundColor: '#28a745',
        },
        {
          name: 'medium',
          current: { value: 3, fraction: 0.15, isSelected: false, toggleFilter: jest.fn(), tooltip: 'medium: 3' },
          backgroundColor: '#fd7e14',
        },
      ];

      mockGetBarChartData.mockReturnValue(mockBarData);
      mockGetDisplayScore.mockReturnValue('75%');

      renderComponent();

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveTextContent('high');
      expect(rows[1]).toHaveTextContent('medium');
      expect(rows[2]).toHaveTextContent('low');
    });

    it('should put error and null entries at the bottom', () => {
      const mockBarData = [
        {
          name: 'Error',
          current: { value: 1, fraction: 0.05, isSelected: false, toggleFilter: jest.fn(), tooltip: 'Error: 1' },
          backgroundColor: '#dc3545',
        },
        {
          name: 'value1',
          current: { value: 10, fraction: 0.5, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value1: 10' },
          backgroundColor: '#007bff',
        },
        {
          name: 'null',
          current: { value: 2, fraction: 0.1, isSelected: false, toggleFilter: jest.fn(), tooltip: 'null: 2' },
          backgroundColor: '#6c757d',
        },
        {
          name: 'value2',
          current: { value: 7, fraction: 0.35, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value2: 7' },
          backgroundColor: '#28a745',
        },
      ];

      mockGetBarChartData.mockReturnValue(mockBarData);
      mockGetDisplayScore.mockReturnValue('50%');

      renderComponent();

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveTextContent('value1');
      expect(rows[1]).toHaveTextContent('value2');
      expect(rows[2]).toHaveTextContent('Error');
      expect(rows[3]).toHaveTextContent('null');
    });
  });

  describe('popover behavior', () => {
    it('should show popover when there are more than 4 items', () => {
      const mockBarData = [
        {
          name: 'value1',
          current: { value: 10, fraction: 0.4, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value1: 10' },
          backgroundColor: '#007bff',
        },
        {
          name: 'value2',
          current: { value: 8, fraction: 0.32, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value2: 8' },
          backgroundColor: '#28a745',
        },
        {
          name: 'value3',
          current: { value: 4, fraction: 0.16, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value3: 4' },
          backgroundColor: '#ffc107',
        },
        {
          name: 'value4',
          current: { value: 2, fraction: 0.08, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value4: 2' },
          backgroundColor: '#fd7e14',
        },
        {
          name: 'value5',
          current: { value: 1, fraction: 0.04, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value5: 1' },
          backgroundColor: '#6c757d',
        },
      ];

      mockGetBarChartData.mockReturnValue(mockBarData);
      mockGetDisplayScore.mockReturnValue('40%');

      renderComponent();

      expect(screen.getByText('value1')).toBeInTheDocument();
      expect(screen.getByText('value2')).toBeInTheDocument();
      expect(screen.getByText('value3')).toBeInTheDocument();
      expect(screen.queryByText('value4')).not.toBeInTheDocument();
      expect(screen.queryByText('value5')).not.toBeInTheDocument();
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('should not show popover when there are 4 or fewer items', () => {
      const mockBarData = [
        {
          name: 'value1',
          current: { value: 10, fraction: 0.4, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value1: 10' },
          backgroundColor: '#007bff',
        },
        {
          name: 'value2',
          current: { value: 8, fraction: 0.32, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value2: 8' },
          backgroundColor: '#28a745',
        },
        {
          name: 'value3',
          current: { value: 4, fraction: 0.16, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value3: 4' },
          backgroundColor: '#ffc107',
        },
        {
          name: 'value4',
          current: { value: 2, fraction: 0.08, isSelected: false, toggleFilter: jest.fn(), tooltip: 'value4: 2' },
          backgroundColor: '#fd7e14',
        },
      ];

      mockGetBarChartData.mockReturnValue(mockBarData);
      mockGetDisplayScore.mockReturnValue('40%');

      renderComponent();

      expect(screen.getByText('value1')).toBeInTheDocument();
      expect(screen.getByText('value2')).toBeInTheDocument();
      expect(screen.getByText('value3')).toBeInTheDocument();
      expect(screen.getByText('value4')).toBeInTheDocument();
      expect(screen.queryByText('+0 more')).not.toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

````

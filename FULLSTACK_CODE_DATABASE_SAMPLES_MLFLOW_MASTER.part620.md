---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 620
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 620 of 991)

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

---[FILE: EvaluationsReviewDetails.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewDetails.tsx
Signals: React

```typescript
import { useState } from 'react';

import { Alert, Button, Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import type { UseQueryResult } from '@databricks/web-shared/query-client';

import { EvaluationsReviewAssessmentsSection } from './EvaluationsReviewAssessmentsSection';
import { EvaluationsReviewHeaderSection } from './EvaluationsReviewHeaderSection';
import { EvaluationsReviewInputSection } from './EvaluationsReviewInputSection';
import { EvaluationsReviewResponseSection } from './EvaluationsReviewResponseSection';
import { EvaluationsReviewRetrievalSection } from './EvaluationsReviewRetrievalSection';
import { getEvaluationResultTitle } from './GenAiEvaluationTracesReview.utils';
import { usePendingAssessmentEntries } from '../hooks/usePendingAssessmentEntries';
import type { AssessmentInfo, RunEvaluationResultAssessmentDraft, RunEvaluationTracesDataEntry } from '../types';

export const EvaluationsReviewDetailsHeader = ({
  evaluationResult,
}: {
  evaluationResult: RunEvaluationTracesDataEntry;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, overflow: 'hidden' }}>
      <Typography.Title
        level={2}
        withoutMargins
        css={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {getEvaluationResultTitle(evaluationResult)}
      </Typography.Title>
    </div>
  );
};

export const EvaluationsReviewDetails = ({
  experimentId,
  evaluationResult,
  otherEvaluationResult,
  onSavePendingAssessments,
  onClickNext,
  runDisplayName,
  compareToRunDisplayName,
  isNextAvailable = false,
  isReadOnly = false,
  exportToEvalsInstanceEnabled = false,
  assessmentInfos,
  traceQueryResult,
  compareToTraceQueryResult,
}: {
  experimentId: string;
  evaluationResult: RunEvaluationTracesDataEntry;
  otherEvaluationResult?: RunEvaluationTracesDataEntry;
  onSavePendingAssessments?: (
    evaluationResult: RunEvaluationTracesDataEntry,
    pendingAssessments: RunEvaluationResultAssessmentDraft[],
  ) => Promise<void>;
  onClickNext?: () => void;
  runDisplayName?: string;
  compareToRunDisplayName?: string;
  isNextAvailable?: boolean;
  isReadOnly?: boolean;
  exportToEvalsInstanceEnabled?: boolean;
  assessmentInfos: AssessmentInfo[];
  traceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
  compareToTraceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
}) => {
  const intl = useIntl();

  const { pendingAssessments, draftEvaluationResult, upsertAssessment, resetPendingAssessments } =
    usePendingAssessmentEntries(evaluationResult);

  const hasPendingAssessments = pendingAssessments.length > 0;

  // If user has already reviewed the evaluation, this flag allows to override the review and enable editing
  const [overridingExistingReview, setOverridingExistingReview] = useState(false);

  const hasErrorCode = Boolean(evaluationResult.errorCode);
  const hasErrorMessage = Boolean(evaluationResult.errorMessage);
  const showAlert = hasErrorCode || hasErrorMessage;
  const [alertExpanded, setAlertExpanded] = useState(false);
  const toggleAlertExpanded = () => setAlertExpanded((alertExpanded) => !alertExpanded);

  return (
    <>
      {showAlert ? (
        <>
          <Alert
            action={
              hasErrorMessage && (
                <Button
                  componentId={`mlflow.evaluations_review.evaluation_error_alert.show_${
                    alertExpanded ? 'less' : 'more'
                  }_button`}
                  onClick={toggleAlertExpanded}
                >
                  {alertExpanded ? (
                    <FormattedMessage defaultMessage="Show less" description="Button to close alert description" />
                  ) : (
                    <FormattedMessage defaultMessage="Show more" description="Button to expand alert description" />
                  )}
                </Button>
              )
            }
            closable={false}
            componentId="mlflow.evaluations_review.evaluation_error_alert"
            message={hasErrorCode ? `${evaluationResult.errorCode}` : 'UNKNOWN_ERROR'}
            description={alertExpanded && `${evaluationResult.errorMessage}`}
            type="error"
          />
          <Spacer size="md" />
        </>
      ) : null}
      <EvaluationsReviewHeaderSection
        experimentId={experimentId}
        runDisplayName={runDisplayName}
        otherRunDisplayName={compareToRunDisplayName}
        evaluationResult={evaluationResult}
        otherEvaluationResult={otherEvaluationResult}
        exportToEvalsInstanceEnabled={exportToEvalsInstanceEnabled}
        traceQueryResult={traceQueryResult}
        compareToTraceQueryResult={compareToTraceQueryResult}
      />
      <EvaluationsReviewAssessmentsSection
        evaluationResult={draftEvaluationResult}
        otherEvaluationResult={otherEvaluationResult}
        onUpsertAssessment={upsertAssessment}
        onClickNext={onClickNext}
        onSavePendingAssessments={async () => {
          // Save and reset the pending assessments
          await onSavePendingAssessments?.(evaluationResult, pendingAssessments);
          resetPendingAssessments();
        }}
        isNextAvailable={isNextAvailable}
        overridingExistingReview={overridingExistingReview}
        setOverridingExistingReview={setOverridingExistingReview}
        pendingAssessments={pendingAssessments}
        onResetPendingAssessments={resetPendingAssessments}
        isReadOnly={isReadOnly}
        assessmentInfos={assessmentInfos}
      />
      <EvaluationsReviewInputSection
        evaluationResult={evaluationResult}
        otherEvaluationResult={otherEvaluationResult}
      />
      <EvaluationsReviewResponseSection
        evaluationResult={evaluationResult}
        otherEvaluationResult={otherEvaluationResult}
      />
      <EvaluationsReviewRetrievalSection
        evaluationResult={draftEvaluationResult}
        otherEvaluationResult={otherEvaluationResult}
        onUpsertAssessment={upsertAssessment}
        overridingExistingReview={overridingExistingReview}
        isReadOnly={isReadOnly}
        assessmentInfos={assessmentInfos}
        traceQueryResult={traceQueryResult}
        compareToTraceQueryResult={compareToTraceQueryResult}
      />
      <Spacer size="lg" />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewExpandableCell.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewExpandableCell.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { EvaluationsReviewExpandedJSONValueCell } from './EvaluationsReviewExpandableCell';

describe('EvaluationsReviewExpandedJSONValueCell', () => {
  const renderTestComponent = (value: string | Record<string, unknown>) =>
    render(<EvaluationsReviewExpandedJSONValueCell value={value} />);

  // Helper function to normalize JSON string for comparison
  const normalizeJSON = (json: string) => JSON.stringify(JSON.parse(json));

  test('renders string value as is when not valid JSON', () => {
    const value = 'This is a plain text string';
    renderTestComponent(value);
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  test('renders formatted JSON when given a valid JSON string', () => {
    const jsonString = '{"name":"test","value":123}';
    renderTestComponent(jsonString);
    const element = screen.getByText((content) => {
      try {
        // Try to parse the content as JSON and compare normalized versions
        return normalizeJSON(content) === normalizeJSON(jsonString);
      } catch {
        return false;
      }
    });
    expect(element).toBeInTheDocument();
  });

  test('renders formatted JSON when given an object', () => {
    const objectValue = { name: 'test', value: 123, nested: { key: 'value' } };
    renderTestComponent(objectValue);
    const element = screen.getByText((content) => {
      try {
        // Try to parse the content as JSON and compare with the original object
        return normalizeJSON(content) === JSON.stringify(objectValue);
      } catch {
        return false;
      }
    });
    expect(element).toBeInTheDocument();
  });

  test('renders string value when given invalid JSON string', () => {
    const invalidJson = '{invalid json}';
    renderTestComponent(invalidJson);
    expect(screen.getByText(invalidJson)).toBeInTheDocument();
  });

  test('handles complex nested objects', () => {
    const complexObject = {
      name: 'test',
      array: [1, 2, 3],
      nested: {
        key: 'value',
        another: {
          deep: true,
        },
      },
    };
    renderTestComponent(complexObject);
    const element = screen.getByText((content) => {
      try {
        // Try to parse the content as JSON and compare with the original object
        return normalizeJSON(content) === JSON.stringify(complexObject);
      } catch {
        return false;
      }
    });
    expect(element).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewExpandableCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewExpandableCell.tsx
Signals: React

```typescript
import { useMemo } from 'react';

export const EvaluationsReviewExpandedJSONValueCell = ({ value }: { value: string | Record<string, unknown> }) => {
  const structuredJSONValue = useMemo(() => {
    // If value is already an object, stringify it directly
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }

    // If value is a string, try to parse it as JSON
    if (typeof value === 'string') {
      try {
        const objectData = JSON.parse(value);
        return JSON.stringify(objectData, null, 2);
      } catch (e) {
        return null;
      }
    }

    // For any other type, return null
    return null;
  }, [value]);

  return (
    <div
      css={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: structuredJSONValue ? 'monospace' : undefined,
      }}
    >
      {structuredJSONValue || String(value)}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewHeaderSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewHeaderSection.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useState } from 'react';

import { Button, Spacer, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import type { UseQueryResult } from '@databricks/web-shared/query-client';

import { EvaluationTraceDataDrawer } from './EvaluationTraceDataDrawer';
import { VerticalBar } from './VerticalBar';
import { GenAITracesTableActions } from '../GenAITracesTableActions';
import type { GetTraceFunction } from '../hooks/useGetTrace';
import type { RunEvaluationTracesDataEntry } from '../types';
import { prettySizeWithUnit } from '../utils/DisplayUtils';

// Keep in sync with https://src.dev.databricks.com/databricks-eng/universe@679eb50f2399a24f4c7f919ccb55028bd8662316/-/blob/tracing-server/src/dao/TraceEntitySpace.scala?L45
const DROPPED_SPAN_SIZE_TRACE_METADATA_KEY = 'databricks.tracingserver.dropped_spans_size_bytes';

const EvaluationsReviewSingleRunHeaderSection = ({
  experimentId,
  runDisplayName,
  evaluationResult,
  exportToEvalsInstanceEnabled = false,
  traceQueryResult,
  getTrace,
}: {
  experimentId: string;
  runDisplayName?: string;
  evaluationResult: RunEvaluationTracesDataEntry;
  exportToEvalsInstanceEnabled?: boolean;
  traceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
  getTrace?: GetTraceFunction;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const [selectedTraceDetailsRequestId, setSelectedTraceDetailsRequestId] = useState<string | null>(null);

  const droppedSpanSize = evaluationResult.traceInfo?.trace_metadata?.[DROPPED_SPAN_SIZE_TRACE_METADATA_KEY];
  let prettySizeString: string | undefined;
  if (!isNil(droppedSpanSize)) {
    const fractionDigits = 2;
    const prettySize = prettySizeWithUnit(Number(droppedSpanSize), fractionDigits);
    prettySizeString = `${prettySize.value} ${prettySize.unit}`;
  }

  return (
    <div css={{ width: '100%' }}>
      <div
        css={{
          width: '100%',
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sm,
        }}
      >
        <Typography.Title level={4}>{runDisplayName}</Typography.Title>
        {evaluationResult.requestId && (
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.sm,
            }}
          >
            {exportToEvalsInstanceEnabled && getTrace && (
              <GenAITracesTableActions
                experimentId={experimentId}
                selectedTraces={[evaluationResult]}
                traceInfos={undefined}
              />
            )}
            <Tooltip
              delayDuration={0}
              componentId="mlflow.evaluations_review.see_detailed_trace_view_tooltip"
              content={
                droppedSpanSize
                  ? `The trace spans were not stored due to their large size: ${prettySizeString}`
                  : undefined
              }
              side="left"
            >
              <Button
                componentId="mlflow.evaluations_review.see_detailed_trace_view_button"
                onClick={() => setSelectedTraceDetailsRequestId(evaluationResult.requestId)}
                loading={traceQueryResult.isLoading}
                disabled={!isNil(droppedSpanSize)}
              >
                <FormattedMessage
                  defaultMessage="See detailed trace view"
                  description="Evaluation review > see detailed trace view button"
                />
              </Button>
            </Tooltip>
          </div>
        )}
        {selectedTraceDetailsRequestId &&
          (!isNil(traceQueryResult.data) ? (
            <EvaluationTraceDataDrawer
              onClose={() => {
                setSelectedTraceDetailsRequestId(null);
              }}
              requestId={selectedTraceDetailsRequestId}
              trace={traceQueryResult.data}
            />
          ) : (
            <>
              {intl.formatMessage({
                defaultMessage: 'No trace data available',
                description: 'Evaluation review > no trace data available',
              })}
            </>
          ))}
      </div>
      <Spacer size="md" />
    </div>
  );
};

/**
 * Displays inputs for a given evaluation result, across one or two runs.
 */
export const EvaluationsReviewHeaderSection = ({
  experimentId,
  runDisplayName,
  otherRunDisplayName,
  evaluationResult,
  otherEvaluationResult,
  exportToEvalsInstanceEnabled = false,
  traceQueryResult,
  compareToTraceQueryResult,
}: {
  experimentId: string;
  evaluationResult: RunEvaluationTracesDataEntry;
  runDisplayName?: string;
  otherRunDisplayName?: string;
  otherEvaluationResult?: RunEvaluationTracesDataEntry;
  exportToEvalsInstanceEnabled?: boolean;
  traceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
  compareToTraceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        width: '100%',
        gap: theme.spacing.sm,
      }}
    >
      <EvaluationsReviewSingleRunHeaderSection
        experimentId={experimentId}
        runDisplayName={runDisplayName}
        evaluationResult={evaluationResult}
        exportToEvalsInstanceEnabled={exportToEvalsInstanceEnabled}
        traceQueryResult={traceQueryResult}
      />
      {otherRunDisplayName && otherEvaluationResult && (
        <>
          <VerticalBar />
          <EvaluationsReviewSingleRunHeaderSection
            experimentId={experimentId}
            runDisplayName={otherRunDisplayName}
            evaluationResult={otherEvaluationResult}
            exportToEvalsInstanceEnabled={exportToEvalsInstanceEnabled}
            traceQueryResult={compareToTraceQueryResult}
          />
        </>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewInputSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewInputSection.tsx

```typescript
import { Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { EvaluationsReviewTextBox } from './EvaluationsReviewTextBox';
import type { RunEvaluationTracesDataEntry } from '../types';

/**
 * Displays inputs for a given evaluation result of a single run.
 */
const EvaluationsReviewSingleRunInputSection = ({
  evaluationResult,
}: {
  evaluationResult: RunEvaluationTracesDataEntry;
}) => {
  const { theme } = useDesignSystemTheme();
  const { inputs } = evaluationResult;
  const inputsEntries = Object.entries(inputs);
  const noValues = inputsEntries.length === 0;
  return (
    <div css={{ width: '100%', paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }}>
      <Typography.Text bold>
        <FormattedMessage
          defaultMessage="{count, plural, one {Input} other {Inputs}}"
          description="Evaluation review > input section > title"
          values={{ count: inputsEntries.length }}
        />
      </Typography.Text>
      <Spacer size="sm" />
      {noValues && (
        <Typography.Paragraph>
          <FormattedMessage
            defaultMessage="No inputs logged"
            description="Evaluation review > input section > no values"
          />
        </Typography.Paragraph>
      )}
      {inputsEntries.map(([key, input]) => (
        <EvaluationsReviewTextBox fieldName={key} title={key} value={input} key={key} />
      ))}
    </div>
  );
};

/**
 * Displays inputs for a given evaluation result, across one or two runs.
 */
export const EvaluationsReviewInputSection = ({
  evaluationResult,
  otherEvaluationResult,
}: {
  evaluationResult?: RunEvaluationTracesDataEntry;
  otherEvaluationResult?: RunEvaluationTracesDataEntry;
}) => {
  const { theme } = useDesignSystemTheme();
  const inputsAreTheSame = evaluationResult?.inputsId === otherEvaluationResult?.inputsId;
  return (
    <div
      css={{
        display: 'flex',
        width: '100%',
        gap: theme.spacing.sm,
      }}
    >
      {evaluationResult && <EvaluationsReviewSingleRunInputSection evaluationResult={evaluationResult} />}
      {!inputsAreTheSame && otherEvaluationResult && (
        <EvaluationsReviewSingleRunInputSection evaluationResult={otherEvaluationResult} />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewListItemIndicator.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewListItemIndicator.tsx

```typescript
import { QuestionMarkIcon, SparkleDoubleIcon, UserIcon, useDesignSystemTheme } from '@databricks/design-system';

import { hasBeenEditedByHuman } from './GenAiEvaluationTracesReview.utils';
import type { AssessmentInfo, RunEvaluationResultAssessment } from '../types';
import { getEvaluationResultAssessmentBackgroundColor } from '../utils/Colors';

/**
 * A small indicator that shows the evaluation result's icon and sentiment.
 */
export const EvaluationsReviewListItemIndicator = ({
  assessment,
  chunkRelevanceAssessmentInfo,
}: {
  assessment?: RunEvaluationResultAssessment;
  chunkRelevanceAssessmentInfo?: AssessmentInfo;
}) => {
  const { theme } = useDesignSystemTheme();

  if (!assessment && !chunkRelevanceAssessmentInfo) {
    return <></>;
  }

  return (
    <div
      css={{
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
        paddingTop: 1,
        paddingBottom: 1,
        backgroundColor: chunkRelevanceAssessmentInfo
          ? getEvaluationResultAssessmentBackgroundColor(theme, chunkRelevanceAssessmentInfo, assessment)
          : '',
        borderRadius: theme.general.borderRadiusBase,
        svg: { width: 12, height: 12 },
      }}
    >
      {assessment ? (
        <>{hasBeenEditedByHuman(assessment) ? <UserIcon /> : <SparkleDoubleIcon />}</>
      ) : (
        <QuestionMarkIcon />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewResponseSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewResponseSection.tsx

```typescript
import { Spacer, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { EvaluationsReviewTextBox } from './EvaluationsReviewTextBox';
import {
  isRetrievedContext,
  KnownEvaluationResultAssessmentOutputLabel,
  KnownEvaluationResultAssessmentTargetLabel,
} from './GenAiEvaluationTracesReview.utils';
import { VerticalBar } from './VerticalBar';
import type { RunEvaluationTracesDataEntry } from '../types';

const EvaluationsReviewSingleRunResponseSection = ({
  evaluationResult,
}: {
  evaluationResult: RunEvaluationTracesDataEntry;
}) => {
  const { theme } = useDesignSystemTheme();

  const { outputs, targets } = evaluationResult;

  // Filter out retrieve_context values
  const outputEntries = Object.entries(outputs).filter(([, value]) => !isRetrievedContext(value));
  const targetEntries = Object.entries(targets).filter(([, value]) => !isRetrievedContext(value));

  const noValues = outputEntries.length === 0 && targetEntries.length === 0;

  return (
    <div css={{ paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md, width: '100%' }}>
      <Typography.Text bold>
        <FormattedMessage defaultMessage="Response" description="Evaluation review > Response section > title" />
      </Typography.Text>
      <Spacer size="sm" />
      {noValues && (
        <Typography.Paragraph>
          <FormattedMessage
            defaultMessage="No responses or targets logged"
            description="Evaluation review > Response section > no values"
          />
        </Typography.Paragraph>
      )}
      <div css={{ display: 'flex', gap: theme.spacing.md, alignItems: 'flex-start' }}>
        {outputEntries.length > 0 && (
          <div css={{ flex: 1 }}>
            {outputEntries.map(([key, output]) => {
              const mappedTitle = KnownEvaluationResultAssessmentOutputLabel[key];
              const title = mappedTitle ? <FormattedMessage {...mappedTitle} /> : key;
              return <EvaluationsReviewTextBox key={key} fieldName={key} title={title} value={output} showCopyIcon />;
            })}
          </div>
        )}

        {targetEntries.length > 0 && (
          <div css={{ flex: 1 }}>
            {targetEntries.map(([key, output]) => {
              const mappedTitle = KnownEvaluationResultAssessmentTargetLabel[key];
              const title = mappedTitle ? <FormattedMessage {...mappedTitle} /> : key;
              return <EvaluationsReviewTextBox key={key} fieldName={key} title={title} value={output} showCopyIcon />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Displays responses and targets for a given evaluation result.
 */
export const EvaluationsReviewResponseSection = ({
  evaluationResult,
  otherEvaluationResult,
}: {
  evaluationResult?: RunEvaluationTracesDataEntry;
  otherEvaluationResult?: RunEvaluationTracesDataEntry;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        width: '100%',
        gap: theme.spacing.sm,
      }}
    >
      {evaluationResult && <EvaluationsReviewSingleRunResponseSection evaluationResult={evaluationResult} />}
      {otherEvaluationResult && (
        <>
          <VerticalBar />
          <EvaluationsReviewSingleRunResponseSection evaluationResult={otherEvaluationResult} />
        </>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewRetrievalSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewRetrievalSection.tsx
Signals: React

```typescript
import { first, isNil } from 'lodash';
import { useMemo, useState } from 'react';

import { Spacer, Tag, TableSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useIntl, FormattedMessage } from '@databricks/i18n';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import type { UseQueryResult } from '@databricks/web-shared/query-client';

import { EvaluationsReviewAssessments } from './EvaluationsReviewAssessments';
import { EvaluationsReviewListItemIndicator } from './EvaluationsReviewListItemIndicator';
import {
  isEvaluationResultReviewedAlready,
  KnownEvaluationResultAssessmentMetadataFields,
  getOrderedAssessments,
  KnownEvaluationRetrievalAssessmentNames,
  KnownEvaluationResultAssessmentName,
} from './GenAiEvaluationTracesReview.utils';
import { VerticalBar } from './VerticalBar';
import type {
  AssessmentInfo,
  RunEvaluationResultAssessmentDraft,
  RunEvaluationTracesDataEntry,
  RunEvaluationTracesRetrievalChunk,
} from '../types';
import { useMarkdownConverter } from '../utils/MarkdownUtils';
import { getRetrievedContextFromTrace } from '../utils/TraceUtils';

function isValidHttpUrl(str: any) {
  // The URL() constructor will throw on invalid URL
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

const RetrievedChunkHeader = ({ chunk, index }: { chunk: RunEvaluationTracesRetrievalChunk; index: number }) => {
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Tag componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluations_components_evaluationsreviewretrievalsection.tsx_30">
        #{index + 1}
      </Tag>
      {isValidHttpUrl(chunk.docUrl) ? (
        <Typography.Link
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluations_components_evaluationsreviewretrievalsection.tsx_32"
          href={chunk.docUrl}
          ellipsis
          openInNewTab
          strong
        >
          {chunk.docUrl}
        </Typography.Link>
      ) : (
        <Typography.Title level={4} withoutMargins ellipsis>
          {chunk.docUrl}
        </Typography.Title>
      )}
    </div>
  );
};

const EvaluationsReviewSingleRunRetrievalSection = ({
  evaluationResult,
  onUpsertAssessment,
  overridingExistingReview = false,
  isReadOnly = false,
  assessmentInfos,
  traceQueryResult,
}: {
  evaluationResult: RunEvaluationTracesDataEntry;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  overridingExistingReview?: boolean;
  isReadOnly?: boolean;
  assessmentInfos: AssessmentInfo[];
  traceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { makeHTML } = useMarkdownConverter();

  const evaluationRetrievalChunks = useMemo(() => {
    return !isNil(evaluationResult.retrievalChunks) && evaluationResult.retrievalChunks.length > 0
      ? evaluationResult.retrievalChunks
      : getRetrievedContextFromTrace(evaluationResult.responseAssessmentsByName, traceQueryResult.data);
  }, [evaluationResult.responseAssessmentsByName, evaluationResult.retrievalChunks, traceQueryResult.data]);

  const selectedEntryHtmlContent = useMemo(
    () => makeHTML(evaluationRetrievalChunks?.[selectedIndex]?.content),
    [evaluationRetrievalChunks, selectedIndex, makeHTML],
  );

  const noRetrievalFound = (evaluationRetrievalChunks || []).length === 0;

  const toBeReviewed =
    !isReadOnly && (!isEvaluationResultReviewedAlready(evaluationResult) || overridingExistingReview);

  const selectedChunk = evaluationRetrievalChunks?.[selectedIndex];

  const sectionTitle = intl.formatMessage({
    defaultMessage: 'Retrieval',
    description: 'Evaluation review > Retrieval section > title',
  });

  return (
    <div
      css={{
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="region"
      aria-label={sectionTitle}
    >
      <Typography.Text bold>{sectionTitle}</Typography.Text>

      {isNil(evaluationRetrievalChunks) && traceQueryResult.isFetching ? (
        <TableSkeleton lines={3} />
      ) : noRetrievalFound ? (
        <Typography.Text>
          <i>
            <FormattedMessage
              defaultMessage="No span with type RETRIEVER found in trace."
              description="GenAi Traces Table > Modal > Message displayed when no retrievals are found"
            />
          </i>
        </Typography.Text>
      ) : (
        <div
          css={{
            minHeight: 400,
            maxHeight: 600,
            overflow: 'hidden',
            display: 'flex',
            marginTop: theme.spacing.sm,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.general.borderRadiusBase,
          }}
        >
          <div
            css={{
              flex: 1,
              flexShrink: 1,
              maxWidth: 300,
              minWidth: 200,
              overflow: 'auto',
              padding: theme.spacing.sm,
              borderRight: `1px solid ${theme.colors.border}`,
            }}
            role="listbox"
          >
            {noRetrievalFound && (
              <Typography.Paragraph>
                <FormattedMessage
                  defaultMessage="No retrieval logged"
                  description="Evaluation review > retrieval section > no values"
                />
              </Typography.Paragraph>
            )}
            {(evaluationRetrievalChunks || []).map((chunk, index) => {
              const chunkRelevanceAssessmentInfo = assessmentInfos.find(
                (info) => info.name === KnownEvaluationResultAssessmentName.CHUNK_RELEVANCE,
              );

              return (
                <div
                  role="option"
                  aria-label={chunk.content?.slice(0, 255)}
                  aria-selected={index === selectedIndex}
                  key={[chunk.docUrl, index].join('-')}
                  css={{
                    backgroundColor: index === selectedIndex ? theme.colors.actionIconBackgroundHover : 'transparent',
                    '&:hover': {
                      backgroundColor: theme.colors.actionIconBackgroundHover,
                    },
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    overflow: 'hidden',
                    display: 'flex',
                    gap: theme.spacing.sm,
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    setSelectedIndex(index);
                  }}
                >
                  {/* TODO: Find a better way to determine which retrieval assessment to use for the indicator */}
                  <EvaluationsReviewListItemIndicator
                    chunkRelevanceAssessmentInfo={chunkRelevanceAssessmentInfo}
                    assessment={first(
                      chunk?.retrievalAssessmentsByName?.[KnownEvaluationResultAssessmentName.CHUNK_RELEVANCE],
                    )}
                  />
                  <Typography.Text ellipsis css={{ flex: 1, lineHeight: theme.typography.lineHeightLg }}>
                    {chunk.content}
                  </Typography.Text>
                </div>
              );
            })}
          </div>

          {selectedChunk && (
            <div css={{ flex: 2, display: 'flex', flexDirection: 'column', width: 0 }}>
              <div
                css={{
                  padding: theme.spacing.md,
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                <RetrievedChunkHeader chunk={selectedChunk} index={selectedIndex} />
                <Spacer size="md" />
                <EvaluationsReviewAssessments
                  assessmentsType="retrieval"
                  assessmentsByName={getOrderedAssessments(selectedChunk.retrievalAssessmentsByName || {})}
                  onUpsertAssessment={(assessment: RunEvaluationResultAssessmentDraft) => {
                    if (!assessment.metadata) {
                      assessment.metadata = {};
                    }
                    // Set the chunk index to the selected index
                    assessment.metadata[KnownEvaluationResultAssessmentMetadataFields.CHUNK_INDEX] = selectedIndex;
                    onUpsertAssessment(assessment);
                  }}
                  allowEditing={toBeReviewed}
                  allowMoreThanOne
                  options={KnownEvaluationRetrievalAssessmentNames}
                  inputs={[selectedIndex]}
                  assessmentInfos={assessmentInfos}
                />
              </div>
              <div css={{ padding: theme.spacing.md, overflow: 'auto' }}>
                <Typography.Paragraph>
                  <span
                    css={{ display: 'contents' }}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: selectedEntryHtmlContent ?? '' }}
                  />
                </Typography.Paragraph>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Displays RAG retrieval results for a given evaluation result.
 */
export const EvaluationsReviewRetrievalSection = ({
  evaluationResult,
  otherEvaluationResult,
  onUpsertAssessment,
  overridingExistingReview = false,
  isReadOnly = false,
  assessmentInfos,
  traceQueryResult,
  compareToTraceQueryResult,
}: {
  evaluationResult?: RunEvaluationTracesDataEntry;
  otherEvaluationResult?: RunEvaluationTracesDataEntry;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  overridingExistingReview?: boolean;
  isReadOnly?: boolean;
  assessmentInfos: AssessmentInfo[];
  traceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
  compareToTraceQueryResult: UseQueryResult<ModelTrace | undefined, unknown>;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        width: '100%',
        gap: theme.spacing.sm,
      }}
    >
      {evaluationResult && (
        <EvaluationsReviewSingleRunRetrievalSection
          evaluationResult={evaluationResult}
          onUpsertAssessment={onUpsertAssessment}
          overridingExistingReview={overridingExistingReview}
          isReadOnly={isReadOnly}
          assessmentInfos={assessmentInfos}
          traceQueryResult={traceQueryResult}
        />
      )}
      {otherEvaluationResult && (
        <>
          <VerticalBar />
          <EvaluationsReviewSingleRunRetrievalSection
            evaluationResult={otherEvaluationResult}
            onUpsertAssessment={onUpsertAssessment}
            overridingExistingReview={overridingExistingReview}
            isReadOnly={isReadOnly}
            assessmentInfos={assessmentInfos}
            traceQueryResult={compareToTraceQueryResult}
          />
        </>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewTextBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewTextBox.tsx
Signals: React

```typescript
import { isString } from 'lodash';
import React, { useMemo } from 'react';

import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CopyActionButton } from '@databricks/web-shared/copy';

import { EvaluationsReviewExpandedJSONValueCell } from './EvaluationsReviewExpandableCell';
import { EXPECTED_FACTS_FIELD_NAME, stringifyValue } from './GenAiEvaluationTracesReview.utils';
import { useMarkdownConverter } from '../utils/MarkdownUtils';

export const EvaluationsReviewTextBox = ({
  fieldName,
  title,
  value,
  showCopyIcon,
}: {
  fieldName: string;
  title: React.ReactNode;
  value: any;
  showCopyIcon?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  const { makeHTML } = useMarkdownConverter();

  const htmlContent = useMemo(() => {
    return isString(value) ? makeHTML(value) : null;
  }, [value, makeHTML]);

  const jsonContent = useMemo(() => {
    return isString(value) ? null : stringifyValue(value);
  }, [value]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        flex: 1,
        border: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.md,
        borderRadius: theme.general.borderRadiusBase,
        marginBottom: theme.spacing.md,
      }}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Text bold>{title}</Typography.Text>
        {showCopyIcon && (
          <CopyActionButton copyText={stringifyValue(value)} componentId="mlflow.evaluations_review.textbox.copy" />
        )}
      </div>
      <Typography.Paragraph
        css={{
          marginBottom: '0 !important',
        }}
      >
        {isString(value) ? (
          // eslint-disable-next-line react/no-danger
          <span css={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: htmlContent ?? '' }} />
        ) : fieldName === EXPECTED_FACTS_FIELD_NAME && Array.isArray(value) ? (
          <ul>
            {value.map((fact, index) => (
              <li key={index}>
                <EvaluationsReviewExpandedJSONValueCell key={index} value={fact} />
              </li>
            ))}
          </ul>
        ) : (
          <EvaluationsReviewExpandedJSONValueCell value={jsonContent} />
        )}
      </Typography.Paragraph>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

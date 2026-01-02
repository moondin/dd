---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 633
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 633 of 991)

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

---[FILE: DisplayUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/DisplayUtils.tsx

```typescript
import { isNil } from 'lodash';

import type { IntlShape } from '@databricks/i18n';
import { FormattedMessage } from '@databricks/i18n';

import { getAssessmentAggregateOverallFraction } from './AggregationUtils';
import type { AssessmentAggregates, AssessmentInfo } from '../types';
const NUM_DECIMALS_PERCENTAGE_DISPLAY = 1;

/** Display a fraction (0-1) as a percentage. */
export function displayPercentage(fraction: number, numDecimalsDisplayPercentage = NUM_DECIMALS_PERCENTAGE_DISPLAY) {
  // We wrap in a Number to remove trailing zeros (4.00 => 4).
  return Number((fraction * 100).toFixed(numDecimalsDisplayPercentage)).toString();
}

export function displayFloat(value: number | undefined | null, numDecimals = 3) {
  if (isNil(value)) {
    return 'null';
  }
  const multiplier = Math.pow(10, numDecimals);
  const result = Math.round(value * multiplier) / multiplier;
  return result.toString();
}

/**
 * Computes the overall display score for an assessment, and the change in score from the other run.
 */
export function getDisplayOverallScoreAndChange(
  intl: IntlShape,
  assessmentInfo: AssessmentInfo,
  assessmentDisplayInfo: AssessmentAggregates,
): {
  displayScore: string;
  displayScoreChange: string | undefined;
  changeDirection: 'up' | 'down' | 'none';
  aggregateType: 'average' | 'percentage-true' | 'categorical';
} {
  if (assessmentInfo.dtype === 'numeric') {
    // Compute the average score for displayScore, and the change in average for displayScoreChange.
    const currentNumericValues = assessmentDisplayInfo.currentNumericValues;
    const otherNumericValues = assessmentDisplayInfo.otherNumericValues;

    let currentAverage = NaN;
    let otherAverage = NaN;
    if (currentNumericValues) {
      currentAverage = currentNumericValues.reduce((a, b) => a + b, 0) / currentNumericValues.length;
    }
    if (otherNumericValues) {
      otherAverage = otherNumericValues.reduce((a, b) => a + b, 0) / otherNumericValues.length;
    }
    const displayScore = displayFloat(currentAverage, 2);
    const scoreChange = otherNumericValues ? currentAverage - otherAverage : undefined;
    const changeDirection = scoreChange ? (scoreChange > 0 ? 'up' : 'down') : 'none';

    const displayScoreChange = scoreChange
      ? changeDirection === 'up'
        ? `+${displayFloat(Math.abs(scoreChange), 2)}`
        : changeDirection === 'down'
        ? `-${displayFloat(Math.abs(scoreChange), 2)}`
        : '+0'
      : undefined;

    return {
      displayScore,
      displayScoreChange,
      changeDirection,
      aggregateType: 'average',
    };
  } else if (assessmentInfo.dtype === 'pass-fail' || assessmentInfo.dtype === 'boolean') {
    const numDecimalsDisplayPercentage = 0;
    const scoreFraction = getAssessmentAggregateOverallFraction(assessmentInfo, assessmentDisplayInfo.currentCounts);
    const displayScore = displayPercentage(scoreFraction, numDecimalsDisplayPercentage) + '%';
    const scoreChange = assessmentDisplayInfo.otherCounts
      ? scoreFraction - getAssessmentAggregateOverallFraction(assessmentInfo, assessmentDisplayInfo.otherCounts)
      : undefined;
    const changeDirection = scoreChange ? (scoreChange > 0 ? 'up' : 'down') : 'none';
    const displayScoreChange = scoreChange
      ? (changeDirection === 'up' || changeDirection === 'none' ? '+' : '') +
        displayPercentage(scoreChange, numDecimalsDisplayPercentage) +
        '%'
      : undefined;

    return {
      displayScore,
      displayScoreChange,
      changeDirection,
      aggregateType: 'percentage-true',
    };
  } else if (assessmentInfo.dtype === 'string') {
    const numUniqueValues = assessmentInfo.uniqueValues.size;
    return {
      displayScore:
        numUniqueValues !== 1
          ? intl.formatMessage(
              {
                defaultMessage: '{numUniqueValues} values',
                description: 'Text for number of unique values for categorical assessment',
              },
              { numUniqueValues },
            )
          : intl.formatMessage({
              defaultMessage: '1 value',
              description: 'Text for number of unique values for categorical assessment',
            }),
      displayScoreChange: '',
      changeDirection: 'none',
      aggregateType: 'categorical',
    };
  } else {
    return {
      displayScore: 'N/A',
      displayScoreChange: 'N/A',
      changeDirection: 'none',
      aggregateType: 'categorical',
    };
  }
}

export function getDisplayScore(assessmentInfo: AssessmentInfo, fraction: number) {
  return displayPercentage(fraction, 0) + '%';
}

export function getDisplayScoreChange(assessmentInfo: AssessmentInfo, scoreChange: number, asPercentage = true) {
  if (assessmentInfo.dtype === 'numeric') {
    const changeDirection = scoreChange > 0 ? 'up' : 'down';
    return changeDirection === 'up' ? `+${displayFloat(scoreChange, 2)}` : `-${displayFloat(scoreChange, 2)}`;
  } else {
    const changeDirection = scoreChange >= 0 ? 'up' : 'down';
    if (asPercentage) {
      return changeDirection === 'up'
        ? `+${displayPercentage(scoreChange, 0)}%`
        : `-${displayPercentage(scoreChange * -1, 0)}%`;
    } else {
      return changeDirection === 'up' ? `+${scoreChange}` : `-${scoreChange}`;
    }
  }
}

// This is forked from mlflow: https://src.dev.databricks.com/databricks-eng/universe/-/blob/mlflow/server/js/src/common/utils/Utils.tsx?L188
export function timeSinceStr(date: any, referenceDate = new Date()) {
  // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
  const seconds = Math.max(0, Math.floor((referenceDate - date) / 1000));
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 year} other {# years}} ago"
        description="Text for time in years since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 month} other {# months}} ago"
        description="Text for time in months since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 day} other {# days}} ago"
        description="Text for time in days since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 hour} other {# hours}} ago"
        description="Text for time in hours since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 minute} other {# minutes}} ago"
        description="Text for time in minutes since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  return (
    <FormattedMessage
      defaultMessage="{timeSince, plural, =1 {1 second} other {# seconds}} ago"
      description="Text for time in seconds since given date for MLflow views"
      values={{ timeSince: seconds }}
    />
  );
}

// Function to escape CSS Special characters by adding \\ before them. Needed when inserting CSS variables.
export function escapeCssSpecialCharacters(str: string) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/([!"#$%&'()*+,\.\/:;\s<=>?@[\\\]^`{|}~])/g, '\\$1');
}

// Adapted from query-insights/utils/numberUtils
export function prettySizeWithUnit(bytes: number | null | undefined, fractionDigits?: number) {
  return prettyNumberWithUnit(bytes, 1024, ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'], fractionDigits);
}

function prettyNumberWithUnit(
  value: string | number | null | undefined,
  divisor: number,
  units: string[] = [],
  fractionDigits?: number,
): { unit: string; value: string; numericValue: number | undefined; divisor: number } {
  let val = Number(value);

  if (isNaN(val) || !isFinite(val)) {
    return {
      value: '',
      numericValue: undefined,
      unit: '',
      divisor: 1,
    };
  }

  let unit = 0;
  let greatestDivisor = 1;

  while (val >= divisor && unit < units.length - 1) {
    val /= divisor;
    greatestDivisor *= divisor;
    unit += 1;
  }

  return {
    value: formatNumber(val, fractionDigits),
    numericValue: val,
    unit: units[unit],
    divisor: greatestDivisor,
  };
}

function formatNumber(value: number, fractionDigits = 3): string {
  return Math.round(value) !== value ? value.toFixed(fractionDigits) : value.toString();
}
```

--------------------------------------------------------------------------------

---[FILE: DocUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/DocUtils.ts

```typescript
export const getDocsLink = (docUrl: string) => {
  return `https://mlflow.org/docs/latest${docUrl}`;
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationDataParseUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/EvaluationDataParseUtils.ts

```typescript
import { difference, groupBy, isNil, isNumber, isPlainObject, orderBy, zipObject } from 'lodash';

import { KnownEvaluationResultAssessmentMetadataFields, KnownEvaluationResultAssessmentName } from '../enum';
import type {
  EvaluationArtifactTableEntryAssessment,
  EvaluationArtifactTableEntryEvaluation,
  EvaluationArtifactTableEntryMetric,
  RawGenaiEvaluationArtifactResponse,
  RunEvaluationResultAssessment,
  RunEvaluationResultMetric,
  RunEvaluationTracesDataEntry,
  RunEvaluationTracesRetrievalChunk,
} from '../types';

export const isEvaluationResultOverallAssessment = (assessmentEntry: RunEvaluationResultAssessment) =>
  assessmentEntry.metadata?.[KnownEvaluationResultAssessmentMetadataFields.IS_OVERALL_ASSESSMENT] === true;

export const isEvaluationResultPerRetrievalChunkAssessment = (assessmentEntry: RunEvaluationResultAssessment) =>
  isNumber(assessmentEntry.metadata?.[KnownEvaluationResultAssessmentMetadataFields.CHUNK_INDEX]);

/**
 * Checks if the given value is a retrieved context.
 * A retrieved context is a list of objects with a `doc_uri` and `content` field.
 */
export const isRetrievedContext = (value: any): boolean => {
  return Array.isArray(value) && value.every((v) => isPlainObject(v) && 'doc_uri' in v && 'content' in v);
};

/**
 * Extracts the first retrieved context value from the given record.
 * Returns undefined if no retrieved context is found.
 */
const getFirstRetrievedContextValue = (
  record?: Record<string, any>,
): { doc_uri: string; content: string }[] | undefined => {
  return Object.values(record || {}).find(isRetrievedContext) as { doc_uri: string; content: string }[];
};

/**
 * Extracts the retrieval chunks from the given outputs, targets and per-chunk assessments.
 */
export const extractRetrievalChunks = (
  outputs?: Record<string, any>,
  targets?: Record<string, any>,
  perChunkAssessments?: RunEvaluationResultAssessment[],
): RunEvaluationTracesRetrievalChunk[] => {
  // Only support one retrieved context for now, first one is used
  const retrievedContext = getFirstRetrievedContextValue(outputs) || [];
  const expectedRetrievedContext = getFirstRetrievedContextValue(targets);

  return retrievedContext.map((retrievedContext, index) => {
    const target = expectedRetrievedContext?.[index];
    const assessments = (perChunkAssessments || []).filter(
      (assessment) => (assessment.metadata || {})[KnownEvaluationResultAssessmentMetadataFields.CHUNK_INDEX] === index,
    );
    // Group detailed assessments by name
    const retrievalAssessmentsByName = groupBy(assessments, 'name');
    // Ensure each group is sorted by timestamp in descending order
    Object.keys(retrievalAssessmentsByName).forEach((key) => {
      retrievalAssessmentsByName[key] = orderBy(retrievalAssessmentsByName[key], 'timestamp', 'desc');
    });

    return {
      docUrl: retrievedContext.doc_uri,
      content: retrievedContext.content,
      retrievalAssessmentsByName: retrievalAssessmentsByName,
      target: target?.content,
    };
  });
};

export function parseRawTableArtifact<T>(artifactData?: RawGenaiEvaluationArtifactResponse): T | undefined {
  if (!artifactData) {
    return undefined;
  }
  const { columns, data, filename } = artifactData;

  if (!columns || !Array.isArray(columns)) {
    throw new SyntaxError(`Artifact ${filename} is malformed, it does not contain "columns" array`);
  }
  if (!data || !Array.isArray(data)) {
    throw new SyntaxError(`Artifact ${filename} is malformed, it does not contain "data" array`);
  }

  const normalizedColumns = columns.map((column, index) => column ?? `column_${index}`);

  return data.map((row) => zipObject(normalizedColumns, row)) as T;
}

export function mergeMetricsAndAssessmentsWithEvaluations(
  evaluations: EvaluationArtifactTableEntryEvaluation[],
  metrics?: EvaluationArtifactTableEntryMetric[],
  assessments?: EvaluationArtifactTableEntryAssessment[],
): RunEvaluationTracesDataEntry[] {
  // Group metrics by evaluation_id.
  const metricsByEvaluation = (metrics || []).reduce<Record<string, Record<string, RunEvaluationResultMetric>>>(
    (acc, entry: any) => {
      if (!acc[entry.evaluation_id]) {
        acc[entry.evaluation_id] = {};
      }
      const { key, value, timestamp } = entry;
      acc[entry.evaluation_id][key] = { key, value, timestamp };
      return acc;
    },
    {},
  );

  // Group assessments by evaluation_id.
  const assessmentsByEvaluation = (assessments || []).reduce<Record<string, RunEvaluationResultAssessment[]>>(
    (acc, entry: EvaluationArtifactTableEntryAssessment) => {
      if (!acc[entry.evaluation_id]) {
        acc[entry.evaluation_id] = [];
      }
      acc[entry.evaluation_id].push({
        booleanValue: !isNil(entry.boolean_value) ? Boolean(entry.boolean_value) : entry.boolean_value,
        numericValue: !isNil(entry.numeric_value) ? Number(entry.numeric_value) : entry.numeric_value,
        stringValue: !isNil(entry.string_value) ? String(entry.string_value) : entry.string_value,
        metadata: entry.metadata || {},
        ...(entry.error_code && { errorCode: entry.error_code }),
        ...(entry.error_message && { errorMessage: entry.error_message }),
        name: entry.name,
        rationale: entry.rationale || null,
        source: {
          metadata: entry.source?.metadata ?? {},
          sourceId: entry.source?.source_id,
          sourceType: entry.source?.source_type,
        },
        timestamp: entry.timestamp,
      });
      return acc;
    },
    {},
  );

  return evaluations.map((entry: any) => {
    // Get all assessments for the evaluation and group them by name
    const allAssessmentsSorted = orderBy(assessmentsByEvaluation[entry.evaluation_id] || [], 'timestamp', 'desc');
    const overallAssessments: RunEvaluationResultAssessment[] = allAssessmentsSorted
      .filter(isEvaluationResultOverallAssessment)
      .map((assessment) => {
        // Find the "[assessment_name]" prefix and convert it to the rootCauseAssessment, removing it from the prefix.
        // The format is: "[assessment_name] rationale **Suggested Actions**: suggestedActions"
        const match = assessment.rationale?.match(/^\[(.*?)\](.*?)(?:\*\*Suggested Actions\*\*:(.*))?$/s);

        const assessmentName = match ? match[1]?.trim() : undefined;
        const newRationale = match ? match[2]?.trim() : undefined;
        const suggestedActions = match ? match[3]?.trim() : undefined;

        assessment.rationale = newRationale || assessment.rationale;
        const result: RunEvaluationResultAssessment = {
          ...assessment,
          rootCauseAssessment: !isNil(assessmentName) ? { assessmentName, suggestedActions } : undefined,
        };
        return result;
      });
    if (overallAssessments.length === 0) {
      // In the special case where there is no overall assessment, we create a null here so the UI can render it.
      overallAssessments.push({
        name: KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT,
        rationale: null,
        source: {
          sourceType: 'AI_JUDGE',
          sourceId: 'UNKNOWN',
          metadata: {},
        },
        metadata: {},
        numericValue: null,
        booleanValue: null,
        stringValue: null,
        timestamp: null,
      });
    }
    // TODO(nsthorat): perRetrievalChunkAsessments should be treated differently than other methods, and removed from the overall metrics.
    const perRetrievalChunkAssessments = allAssessmentsSorted.filter(isEvaluationResultPerRetrievalChunkAssessment);

    // All assessments that are not overall or per retrieval chunk are response assessments
    const responseAssessments = difference(allAssessmentsSorted, overallAssessments, perRetrievalChunkAssessments);

    // Group response assessments by name
    const responseAssessmentsByName = groupBy(responseAssessments, 'name');
    // Ensure each group is sorted by timestamp in descending order
    Object.keys(responseAssessmentsByName).forEach((key) => {
      responseAssessmentsByName[key] = orderBy(responseAssessmentsByName[key], 'timestamp', 'desc');
    });

    return {
      evaluationId: entry.evaluation_id,
      requestId: entry.request_id,
      inputs: entry.inputs,
      inputsId: entry.inputs_id,
      outputs: entry.outputs ?? {},
      targets: entry.targets ?? {},
      ...(entry.error_code && { errorCode: entry.error_code }),
      ...(entry.error_message && { errorMessage: entry.error_message }),
      overallAssessments,
      responseAssessmentsByName,
      metrics: metricsByEvaluation[entry.evaluation_id] || {},
      retrievalChunks: extractRetrievalChunks(entry.outputs, entry.targets, perRetrievalChunkAssessments),
    };
  });
}
```

--------------------------------------------------------------------------------

---[FILE: EvaluationLogging.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/EvaluationLogging.ts

```typescript
/** Constants for logging. */

// Pages
export const RUN_EVALUATION_RESULTS_TAB_SINGLE_RUN = 'mlflow.evaluations_review.run_evaluation_results_single_run_page';
export const RUN_EVALUATION_RESULTS_TAB_COMPARE_RUNS =
  'mlflow.evaluations_review.run_evaluation_results_compare_runs_page';

// When a user opens a single item in the evaluations table, the page ID for the evaluations review page modal.
export const RUN_EVALUATIONS_SINGLE_ITEM_REVIEW_UI_PAGE_ID = 'mlflow.evaluations_review.review_ui';

// Views
// Counts the number of times the expanded assessment details is clicked, showing how many times users view rationales.
export const EXPANDED_ASSESSMENT_DETAILS_VIEW: Record<string, string> = {
  // Important note: Overall is always expanded.
  overall: 'mlflow.evaluations_review.expanded_overall_assessment_details_view',
  response: 'mlflow.evaluations_review.expanded_response_assessment_details_view',
  retrieval: 'mlflow.evaluations_review.expanded_retrieval_assessment_details_view',
};

export const ASSESSMENT_RATIONAL_HOVER_DETAILS_VIEW =
  'mlflow.evaluations_review.assessment_rationale_hover_details_view';

// Buttons
// The component ID for the compare-to-run dropdown in the evaluations table.
export const COMPARE_TO_RUN_DROPDOWN_COMPONENT_ID = 'mlflow.evaluations_review.table_ui.compare_to_run_combobox';

// The component ID for the filter dropdown in the evaluations table.
export const FILTER_DROPDOWN_COMPONENT_ID = 'mlflow.evaluations_review.table_ui.filter_form';

// The component ID for the column selector dropdown in the evaluations table.
export const COLUMN_SELECTOR_DROPDOWN_COMPONENT_ID = 'mlflow.evaluations_review.table_ui.column_filter_combobox';
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsFilterUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/EvaluationsFilterUtils.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { filterEvaluationResults } from './EvaluationsFilterUtils';
import type { AssessmentFilter, EvalTraceComparisonEntry, RunEvaluationTracesDataEntry } from '../types';

describe('filterEvaluationResults', () => {
  const evals: EvalTraceComparisonEntry[] = [
    {
      currentRunValue: {
        evaluationId: `eval-00`,
        requestId: `req-00`,
        inputs: {
          messages: [
            { role: 'user', content: 'Hello one' },
            { role: 'assistant', content: 'Hello Response' },
          ],
        },
        inputsId: `inputs-00`,
        outputs: {},
        targets: {},
        overallAssessments: [{ name: 'overall_assessment', stringValue: 'no', rationale: 'Fails criteria' }],
        responseAssessmentsByName: {
          safety: [{ name: 'safety', stringValue: 'yes', rationale: 'Fails criteria' }],
          customAssessment: [{ name: 'customAssessment', stringValue: 'maybe', rationale: 'Unclear' }],
        },
        metrics: {},
      },
      otherRunValue: {
        evaluationId: `eval-01`,
        requestId: `req-01`,
        inputs: {
          messages: [
            { role: 'user', content: 'Hello one' },
            { role: 'assistant', content: 'Hello Response' },
          ],
        },
        inputsId: `inputs-01`,
        outputs: {},
        targets: {},
        overallAssessments: [{ name: 'overall_assessment', stringValue: 'yes', rationale: 'Passes criteria' }],
        responseAssessmentsByName: {
          safety: [{ name: 'safety', stringValue: 'no', rationale: 'Passes criteria' }],
          customAssessment: [{ name: 'customAssessment', stringValue: 'yes', rationale: 'Clear' }],
        },
        metrics: {},
      },
    },
    {
      currentRunValue: {
        evaluationId: `eval-02`,
        requestId: `req-02`,
        inputs: {
          messages: [
            { role: 'user', content: 'Hello again' },
            { role: 'assistant', content: 'Hello again Response' },
          ],
        },
        inputsId: `inputs-02`,
        outputs: {},
        targets: {},
        overallAssessments: [{ name: 'overall_assessment', stringValue: 'maybe', rationale: 'Somewhat unclear' }],
        responseAssessmentsByName: {
          safety: [{ name: 'safety', stringValue: 'yes', rationale: 'Somewhat fails criteria' }],
          customAssessment: [{ name: 'customAssessment', stringValue: 'no', rationale: 'Not clear' }],
        },
        metrics: {},
      },
      otherRunValue: {
        evaluationId: `eval-03`,
        requestId: `req-03`,
        inputs: {
          messages: [
            { role: 'user', content: 'Hello again' },
            { role: 'assistant', content: 'Hello again Response' },
          ],
        },
        inputsId: `inputs-03`,
        outputs: {},
        targets: {},
        overallAssessments: [{ name: 'overall_assessment', stringValue: 'yes', rationale: 'Clear' }],
        responseAssessmentsByName: {
          safety: [{ name: 'safety', stringValue: 'no', rationale: 'Passes criteria' }],
          customAssessment: [{ name: 'customAssessment', stringValue: 'yes', rationale: 'Clear' }],
        },
        metrics: {},
      },
    },
  ];
  it('filter on search query matches deeply on inputs', () => {
    const assessmentFilters: AssessmentFilter[] = [];
    const searchQuery = 'hello again';

    const filteredResults = filterEvaluationResults(evals, assessmentFilters, searchQuery);

    expect(filteredResults).toEqual([evals[1]]);
  });

  it('filter on search query matches in trace request preview', () => {
    const evalsWithTraceInfo: EvalTraceComparisonEntry[] = [
      {
        currentRunValue: {
          ...evals[0].currentRunValue!,
          inputs: { inputs: 'paris' },
        },
      },
      {
        currentRunValue: {
          ...evals[1].currentRunValue!,
          inputs: { inputs: 'london' },
        },
      },
    ];

    let filteredResults = filterEvaluationResults(evalsWithTraceInfo, [], 'paris');

    expect(filteredResults).toEqual([evalsWithTraceInfo[0]]);

    filteredResults = filterEvaluationResults(evalsWithTraceInfo, [], 'inputs');

    expect(filteredResults).toEqual(evalsWithTraceInfo);
  });

  it('filters on assessment value when multiple assessment value types exist for same name', () => {
    const makeEntry = (
      assessments: RunEvaluationTracesDataEntry['responseAssessmentsByName'],
    ): EvalTraceComparisonEntry => ({
      currentRunValue: {
        evaluationId: 'eval-1',
        requestId: 'req-1',
        inputs: {},
        inputsId: 'inputs-1',
        outputs: {},
        targets: {},
        overallAssessments: [],
        responseAssessmentsByName: assessments,
        metrics: {},
      },
    });

    const evalsWithMultipleAssessments: EvalTraceComparisonEntry[] = [
      makeEntry({
        mixedAssessment: [
          { name: 'mixedAssessment', errorMessage: 'Some error' },
          { name: 'mixedAssessment', stringValue: 'yes' },
        ],
      }),
      makeEntry({
        mixedAssessment: [{ name: 'mixedAssessment', stringValue: 'no' }],
      }),
      makeEntry({
        mixedAssessment: [{ name: 'mixedAssessment', errorMessage: 'Only error' }],
      }),
    ];

    const yesFilter: AssessmentFilter[] = [
      { assessmentName: 'mixedAssessment', filterValue: 'yes', run: 'currentRun' },
    ];
    const noFilter: AssessmentFilter[] = [{ assessmentName: 'mixedAssessment', filterValue: 'no', run: 'currentRun' }];

    const yesResults = filterEvaluationResults(evalsWithMultipleAssessments, yesFilter, undefined, 'currentRun');
    expect(yesResults).toHaveLength(1);
    expect(yesResults[0]).toBe(evalsWithMultipleAssessments[0]);

    const noResults = filterEvaluationResults(evalsWithMultipleAssessments, noFilter, undefined, 'currentRun');
    expect(noResults).toHaveLength(1);
    expect(noResults[0]).toBe(evalsWithMultipleAssessments[1]);
  });

  it('filters on Error value to find assessments with errors', () => {
    const makeEntry = (
      assessments: RunEvaluationTracesDataEntry['responseAssessmentsByName'],
    ): EvalTraceComparisonEntry => ({
      currentRunValue: {
        evaluationId: 'eval-1',
        requestId: 'req-1',
        inputs: {},
        inputsId: 'inputs-1',
        outputs: {},
        targets: {},
        overallAssessments: [],
        responseAssessmentsByName: assessments,
        metrics: {},
      },
    });

    const evalsWithErrors: EvalTraceComparisonEntry[] = [
      makeEntry({
        testAssessment: [{ name: 'testAssessment', stringValue: 'yes' }],
      }),
      makeEntry({
        testAssessment: [{ name: 'testAssessment', errorMessage: 'Some error occurred' }],
      }),
      makeEntry({
        testAssessment: [{ name: 'testAssessment', stringValue: 'no' }],
      }),
    ];

    const errorFilter: AssessmentFilter[] = [
      { assessmentName: 'testAssessment', filterValue: 'Error', run: 'currentRun' },
    ];

    const errorResults = filterEvaluationResults(evalsWithErrors, errorFilter, undefined, 'currentRun');
    expect(errorResults).toHaveLength(1);
    expect(errorResults[0]).toBe(evalsWithErrors[1]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsFilterUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/EvaluationsFilterUtils.ts

```typescript
import { isNil } from 'lodash';

import {
  getEvaluationResultAssessmentValue,
  KnownEvaluationResultAssessmentName,
} from '../components/GenAiEvaluationTracesReview.utils';
import type { AssessmentFilter, EvalTraceComparisonEntry } from '../types';
import { ERROR_KEY } from './AggregationUtils';

function filterEval(
  comparisonEntry: EvalTraceComparisonEntry,
  filters: AssessmentFilter[],
  currentRunDisplayName?: string,
  otherRunDisplayName?: string,
): boolean {
  // Currently only filters on the current run value.
  const currentRunValue = comparisonEntry?.currentRunValue;
  const otherRunValue = comparisonEntry?.otherRunValue;

  let includeEval = true;

  for (const filter of filters) {
    const assessmentName = filter.assessmentName;
    const filterValue = filter.filterValue;
    const run = filter.run;
    const runValue =
      run === currentRunDisplayName ? currentRunValue : run === otherRunDisplayName ? otherRunValue : undefined;
    // TODO(nsthorat): Fix this logic, not clear that this is the right way to filter.
    if (runValue === undefined) {
      continue;
    }

    const assessments =
      assessmentName === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT
        ? runValue.overallAssessments ?? []
        : runValue.responseAssessmentsByName[assessmentName] ?? [];

    if (filter.filterType === 'rca') {
      const currentIsAssessmentRootCause =
        runValue?.overallAssessments[0]?.rootCauseAssessment?.assessmentName === assessmentName;
      includeEval = includeEval && currentIsAssessmentRootCause;
    } else {
      // Filtering for undefined means we want traces with NO assessments for this name
      // Filtering for ERROR_KEY means we want traces with assessments that have an errorMessage
      const matchesFilter =
        filterValue === undefined
          ? assessments.length === 0
          : filterValue === ERROR_KEY
          ? assessments.some((assessment) => Boolean(assessment.errorMessage))
          : assessments.some(
              (assessment) => (getEvaluationResultAssessmentValue(assessment) ?? undefined) === filterValue,
            );
      includeEval = includeEval && matchesFilter;
    }
  }
  return includeEval;
}

export function filterEvaluationResults(
  evaluationResults: EvalTraceComparisonEntry[],
  assessmentFilters: AssessmentFilter[],
  searchQuery?: string,
  currentRunDisplayName?: string,
  otherRunDisplayName?: string,
): EvalTraceComparisonEntry[] {
  // Filter results by the assessment filters.
  return (
    evaluationResults
      .filter((entry) => {
        return filterEval(entry, assessmentFilters, currentRunDisplayName, otherRunDisplayName);
      })
      // Filter results by the text search box.
      .filter((entry) => {
        if (isNil(searchQuery) || searchQuery === '') {
          return true;
        }
        const searchQueryLower = searchQuery.toLowerCase();
        const currentInputsContainSearchQuery = JSON.stringify(entry.currentRunValue?.inputs)
          .toLowerCase()
          .includes(searchQueryLower);
        const inputsIdEqualsToSearchQuery = entry.currentRunValue?.inputsId.toLowerCase() === searchQueryLower;
        return currentInputsContainSearchQuery || inputsIdEqualsToSearchQuery;
      })
  );
}
```

--------------------------------------------------------------------------------

---[FILE: FeatureUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/FeatureUtils.ts

```typescript
export const shouldEnableRunEvaluationReviewUIWriteFeatures = () => {
  return false;
};

export const shouldEnableTagGrouping = () => {
  return true;
};

export const shouldEnableUnifiedEvalTab = () => {
  return false;
};

/**
 * Page size for MLflow traces 3.0 search api used in eval tab
 */
export const getMlflowTracesSearchPageSize = () => {
  // OSS backend limit is 500
  return 500;
};

/**
 * Total number of traces that will be fetched via mlflow traces 3.0 search api in eval tab
 */
export const getEvalTabTotalTracesLimit = () => {
  return 1000;
};

/**
 * Determines if traces V4 API should be used to fetch traces
 */
export const shouldUseTracesV4API = () => {
  return false;
};
```

--------------------------------------------------------------------------------

---[FILE: FetchUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/FetchUtils.ts

```typescript
import { matchPredefinedError } from '../../errors';

// eslint-disable-next-line no-restricted-globals
export const fetchFn = fetch; // use global fetch for oss

export const makeRequest = async <T>(path: string, method: 'POST' | 'GET', body?: T, signal?: AbortSignal) => {
  const options: RequestInit = {
    method,
    signal,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...getDefaultHeaders(document.cookie),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetchFn(path, options);

  if (!response.ok) {
    const error = matchPredefinedError(response);
    try {
      const errorMessageFromResponse = await (await response.json()).message;
      if (errorMessageFromResponse) {
        error.message = errorMessageFromResponse;
      }
    } catch {
      // do nothing
    }
    throw error;
  }

  return response.json();
};

export const getAjaxUrl = (relativeUrl: any) => {
  if (process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] === 'true' && !relativeUrl.startsWith('/')) {
    return '/' + relativeUrl;
  }
  return relativeUrl;
};

// Parse cookies from document.cookie
function parseCookies(cookieString = document.cookie) {
  return cookieString.split(';').reduce((cookies: { [key: string]: string }, cookie: string) => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(value || '');
    return cookies;
  }, {});
}

export const getDefaultHeadersFromCookies = (cookieStr: any) => {
  const headerCookiePrefix = 'mlflow-request-header-';
  const parsedCookie = parseCookies(cookieStr);
  if (!parsedCookie || Object.keys(parsedCookie).length === 0) {
    return {};
  }
  return Object.keys(parsedCookie)
    .filter((cookieName) => cookieName.startsWith(headerCookiePrefix))
    .reduce(
      (acc, cookieName) => ({
        ...acc,
        [cookieName.substring(headerCookiePrefix.length)]: parsedCookie[cookieName],
      }),
      {},
    );
};

export const getDefaultHeaders = (cookieStr: any) => {
  const cookieHeaders = getDefaultHeadersFromCookies(cookieStr);
  return {
    ...cookieHeaders,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: MarkdownUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/MarkdownUtils.tsx
Signals: React

```typescript
import React from 'react';

const MarkdownConverterProviderContext = React.createContext({
  makeHTML: (markdown?: string) => markdown,
});

export const MarkdownConverterProvider = ({
  children,
  makeHtml,
}: {
  children: React.ReactNode;
  makeHtml: (markdown?: string) => string;
}) => {
  return (
    <MarkdownConverterProviderContext.Provider value={{ makeHTML: makeHtml }}>
      {children}
    </MarkdownConverterProviderContext.Provider>
  );
};

export const useMarkdownConverter = () => React.useContext(MarkdownConverterProviderContext);
```

--------------------------------------------------------------------------------

````

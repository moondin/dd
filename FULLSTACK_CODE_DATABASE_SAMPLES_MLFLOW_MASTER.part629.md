---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 629
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 629 of 991)

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

---[FILE: usePendingAssessmentEntries.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/usePendingAssessmentEntries.ts
Signals: React

```typescript
import { flatMap, groupBy, orderBy, uniq } from 'lodash';
import { useCallback, useMemo, useReducer } from 'react';

import {
  KnownEvaluationResultAssessmentMetadataFields,
  getEvaluationResultAssessmentChunkIndex,
  getEvaluationResultAssessmentValue,
  isEvaluationResultOverallAssessment,
  isEvaluationResultPerRetrievalChunkAssessment,
} from '../components/GenAiEvaluationTracesReview.utils';
import type { RunEvaluationResultAssessmentDraft, RunEvaluationTracesDataEntry } from '../types';

export const usePendingAssessmentEntries = (evaluationResult: RunEvaluationTracesDataEntry) => {
  const [pendingAssessments, dispatch] = useReducer(
    (
      state: RunEvaluationResultAssessmentDraft[],
      action:
        | {
            type: 'upsertAssessment';
            payload: RunEvaluationResultAssessmentDraft;
          }
        | {
            type: 'resetPendingAssessments';
          },
    ): RunEvaluationResultAssessmentDraft[] => {
      switch (action.type) {
        case 'resetPendingAssessments':
          return [];
        case 'upsertAssessment':
          const existingPendingAssessment = state.find(
            (assessment) =>
              assessment.name === action.payload.name &&
              getEvaluationResultAssessmentChunkIndex(assessment) ===
                getEvaluationResultAssessmentChunkIndex(action.payload),
          );

          // If the incoming assessment is already in the pending list, update it.
          if (existingPendingAssessment) {
            return state.map((assessment) => {
              if (assessment === existingPendingAssessment) {
                // Special case: handling existing assessment without value. The value of the incoming assessment
                // will be used to update the name of the assessment.
                if (getEvaluationResultAssessmentValue(assessment) === '' && action.payload.stringValue) {
                  return { ...action.payload, stringValue: '', name: action.payload.stringValue };
                }
                return action.payload;
              }
              return assessment;
            });
          }
          return [action.payload, ...state];
      }
    },
    [],
  );

  const overallAssessmentList = useMemo(() => {
    if (!evaluationResult) {
      return [];
    }
    const pendingOverallAssessment = pendingAssessments.find(isEvaluationResultOverallAssessment);
    if (pendingOverallAssessment) {
      return [pendingOverallAssessment, ...evaluationResult.overallAssessments];
    }
    return evaluationResult.overallAssessments;
  }, [evaluationResult, pendingAssessments]);

  const responseAssessmentMap = useMemo(() => {
    if (!evaluationResult) {
      return {};
    }

    const allAssessmentNames = uniq([
      ...Object.keys(evaluationResult.responseAssessmentsByName),
      ...pendingAssessments
        .filter(
          (assessment) =>
            !isEvaluationResultOverallAssessment(assessment) &&
            !isEvaluationResultPerRetrievalChunkAssessment(assessment),
        )
        .map((assessment) => assessment.name),
    ]);

    return Object.fromEntries(
      allAssessmentNames.map((key) => {
        const pendingAssessmentForType = pendingAssessments.filter((assessment) => assessment.name === key);
        return [key, [...pendingAssessmentForType, ...(evaluationResult.responseAssessmentsByName[key] || [])]];
      }),
    );
  }, [evaluationResult, pendingAssessments]);

  const retrievalChunksWithDraftAssessments = useMemo(() => {
    const perChunkAssessments = pendingAssessments.filter(isEvaluationResultPerRetrievalChunkAssessment);
    return evaluationResult.retrievalChunks?.map((chunk, index) => {
      const pendingAssessmentForChunk = perChunkAssessments.filter(
        (assessment) => assessment.metadata?.[KnownEvaluationResultAssessmentMetadataFields.CHUNK_INDEX] === index,
      );
      const existingAssessments = flatMap(chunk.retrievalAssessmentsByName ?? {});
      // Group detailed assessments by name
      const retrievalAssessmentsByName = groupBy([...pendingAssessmentForChunk, ...existingAssessments], 'name');
      // Ensure each group is sorted by timestamp in descending order
      Object.keys(retrievalAssessmentsByName).forEach((key) => {
        retrievalAssessmentsByName[key] = orderBy(retrievalAssessmentsByName[key], 'timestamp', 'desc');
      });
      return {
        ...chunk,
        retrievalAssessmentsByName: retrievalAssessmentsByName,
      };
    });
  }, [pendingAssessments, evaluationResult]);

  const draftEvaluationResult = useMemo(() => {
    return {
      ...evaluationResult,
      overallAssessments: overallAssessmentList,
      responseAssessmentsByName: responseAssessmentMap,
      retrievalChunks: retrievalChunksWithDraftAssessments,
    };
  }, [evaluationResult, overallAssessmentList, responseAssessmentMap, retrievalChunksWithDraftAssessments]);

  const upsertAssessment = useCallback(
    (assessment: RunEvaluationResultAssessmentDraft) => dispatch({ type: 'upsertAssessment', payload: assessment }),
    [],
  );

  const resetPendingAssessments = useCallback(() => dispatch({ type: 'resetPendingAssessments' }), []);

  return {
    pendingAssessments,
    draftEvaluationResult,
    upsertAssessment,
    resetPendingAssessments,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useTableColumns.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useTableColumns.test.tsx

```typescript
import { jest, describe, afterEach, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';

import type { IntlShape } from '@databricks/i18n';

import { useTableColumns, REQUEST_TIME_COLUMN_ID, createAssessmentColumnId } from './useTableColumns';
import type { RunEvaluationTracesDataEntry, AssessmentInfo } from '../types';
import { TracesTableColumnType, TracesTableColumnGroup } from '../types';
import { shouldUseTraceInfoV3 } from '../utils/TraceUtils';

jest.mock('../utils/TraceUtils', () => ({
  shouldUseTraceInfoV3: jest.fn(),
  createCustomMetadataColumnId: jest.fn((key: string) => `custom_metadata:${key}`),
  createTagColumnId: jest.fn((key: string) => `tag:${key}`),
  MLFLOW_INTERNAL_PREFIX: 'mlflow.',
}));

jest.mock('../utils/FeatureUtils', () => ({
  shouldEnableTagGrouping: jest.fn(() => false),
}));

describe('useTableColumns', () => {
  const baseEvalDataEntry: RunEvaluationTracesDataEntry = {
    evaluationId: 'eval-123',
    requestId: 'req-456',
    inputsId: 'eval-123',
    inputs: {},
    outputs: {},
    targets: {},
    errorCode: undefined,
    errorMessage: undefined,
    overallAssessments: [],
    responseAssessmentsByName: {},
    metrics: {},
    retrievalChunks: undefined,
    traceInfo: undefined,
  };

  const baseAssessmentInfo: AssessmentInfo = {
    name: 'overall_assessment',
    displayName: 'Overall',
    isKnown: true,
    isOverall: true,
    metricName: 'overall_assessment',
    source: undefined,
    isCustomMetric: false,
    isEditable: false,
    isRetrievalAssessment: false,
    dtype: 'pass-fail',
    uniqueValues: new Set(['yes', 'no']),
    docsLink: 'https://example.com/docs',
    missingTooltip: '',
    description: 'An example built-in assessment.',
    containsErrors: false,
  };

  const mockIntl: IntlShape = {
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
    // ... mock other IntlShape properties if needed
  } as IntlShape;

  const renderUseTableColumnsHook = (
    currentEvaluationResults: RunEvaluationTracesDataEntry[],
    assessmentInfos: AssessmentInfo[],
    runUuid?: string,
    otherEvaluationResults?: RunEvaluationTracesDataEntry[],
  ) => {
    return renderHook(() =>
      useTableColumns(mockIntl, currentEvaluationResults, assessmentInfos, runUuid, otherEvaluationResults),
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns only input columns + no additional info columns when Trace Info V3 is false', () => {
    // 2. Make sure the mock returns false for this scenario
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(false);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { request: 'Hello world', kwarg2: 'value2' },
        traceInfo: undefined,
      },
      {
        ...baseEvalDataEntry,
        inputs: { request: 'Another input', kwarg1: 'value1' },
        traceInfo: undefined,
      },
    ];

    // Some fake assessments (none are retrieval-based here)
    const fakeAssessments: AssessmentInfo[] = [
      { ...baseAssessmentInfo, name: 'overall_assessment', displayName: 'Overall', isRetrievalAssessment: false },
    ];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    expect(result.current).toHaveLength(4);

    // Check the columns we expect
    const [col1, col2, col3, col4] = result.current;
    expect(col1.id).toBe('request');
    expect(col1.type).toBe(TracesTableColumnType.INPUT);

    expect(col2.id).toBe('kwarg2');
    expect(col2.type).toBe(TracesTableColumnType.INPUT);

    expect(col3.id).toBe('kwarg1');
    expect(col3.type).toBe(TracesTableColumnType.INPUT);

    expect(col4.id).toBe(createAssessmentColumnId('overall_assessment'));
    expect(col4.type).toBe(TracesTableColumnType.ASSESSMENT);
  });

  it('returns standard columns when Trace Info V3 is true (request + trace info columns + assessments)', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    // In V3, the hook ignores inputs except for a single "Request" column
    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {},
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [
      {
        ...baseAssessmentInfo,
        name: 'quality',
        displayName: 'Quality Score',
        isRetrievalAssessment: false,
      },
    ];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    // Expected columns:
    // 1) request (INPUT)
    // 2) trace_id (TRACE_INFO)
    // 3) trace_name (TRACE_INFO)
    // 4) response (TRACE_INFO)
    // 5) user (TRACE_INFO)
    // 6) session (TRACE_INFO)
    // 7) execution_duration (TRACE_INFO)
    // 8) request_time (TRACE_INFO)
    // 9) state (TRACE_INFO)
    // 10) source (TRACE_INFO)
    // 11) logged_model (TRACE_INFO)
    // 12) prompt (TRACE_INFO)
    // 13) tokens (TRACE_INFO)
    // 14) run_name (TRACE_INFO)
    // 15) tags (TRACE_INFO)
    // 16) quality (ASSESSMENT)
    expect(result.current).toHaveLength(16);

    const colIds = result.current.map((c) => c.id);
    expect(colIds).toContain('request');
    expect(colIds).toContain('trace_id');
    expect(colIds).toContain('trace_name');
    expect(colIds).toContain('response');
    expect(colIds).toContain('user');
    expect(colIds).toContain('session');
    expect(colIds).toContain('execution_duration');
    expect(colIds).toContain(REQUEST_TIME_COLUMN_ID);
    expect(colIds).toContain('state');
    expect(colIds).toContain('source');
    expect(colIds).toContain('run_name');
    expect(colIds).toContain('tags');
    expect(colIds).toContain(createAssessmentColumnId('quality'));
    expect(colIds).toContain('logged_model');
    expect(colIds).toContain('tokens');
  });

  it('returns standard columns when run id is provided', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    // In V3, the hook ignores inputs except for a single "Request" column
    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {},
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [
      {
        ...baseAssessmentInfo,
        name: 'quality',
        displayName: 'Quality Score',
        isRetrievalAssessment: false,
      },
    ];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments, 'run-123');

    // Expected columns:
    // 1) request (INPUT)
    // 2) trace_id (TRACE_INFO)
    // 3) trace_name (TRACE_INFO)
    // 4) response (TRACE_INFO)
    // 5) user (TRACE_INFO)
    // 6) session (TRACE_INFO)
    // 7) execution_duration (TRACE_INFO)
    // 8) request_time (TRACE_INFO)
    // 9) state (TRACE_INFO)
    // 10) source (TRACE_INFO)
    // 11) logged_model (TRACE_INFO)
    // 12) prompt (TRACE_INFO)
    // 13) tokens (TRACE_INFO)
    // 14) tags (TRACE_INFO)
    // 15) quality (ASSESSMENT)
    expect(result.current).toHaveLength(15);

    const colIds = result.current.map((c) => c.id);
    expect(colIds).toContain('request');
    expect(colIds).toContain('trace_id');
    expect(colIds).toContain('trace_name');
    expect(colIds).toContain('response');
    expect(colIds).toContain('user');
    expect(colIds).toContain('session');
    expect(colIds).toContain('execution_duration');
    expect(colIds).toContain(REQUEST_TIME_COLUMN_ID);
    expect(colIds).toContain('state');
    expect(colIds).toContain('source');
    expect(colIds).toContain('tags');
    expect(colIds).toContain(createAssessmentColumnId('quality'));
    expect(colIds).not.toContain('run_name');
    expect(colIds).toContain('logged_model');
    expect(colIds).toContain('tokens');
  });

  it('excludes retrieval-based assessments from columns', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(false);

    const fakeResults: RunEvaluationTracesDataEntry[] = [{ ...baseEvalDataEntry, inputs: { request: 'Hello world' } }];

    const fakeAssessments: AssessmentInfo[] = [
      {
        ...baseAssessmentInfo,
        name: 'overall_assessment',
        displayName: 'Overall Assessment',
        isRetrievalAssessment: false,
      },
      {
        ...baseAssessmentInfo,
        name: 'retrieval_only',
        displayName: 'Retrieval Only',
        isRetrievalAssessment: true,
      },
    ];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    // We only expect:
    //  1) request (INPUT)
    //  2) overall_assessment (ASSESSMENT)
    // The 'retrieval_only' column should be filtered out

    expect(result.current).toHaveLength(2);

    const colIds = result.current.map((col) => col.id);
    expect(colIds).toEqual(['request', createAssessmentColumnId('overall_assessment')]);
  });

  it('handles an empty results and assessments array gracefully', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(false);

    const fakeResults: RunEvaluationTracesDataEntry[] = [];
    const fakeAssessments: AssessmentInfo[] = [];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    // With no data, there should be no columns at all
    expect(result.current).toHaveLength(0);
  });

  it('includes custom metadata columns when Trace Info V3 is true and custom metadata is present', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {
            user_id: 'user123',
            environment: 'production',
            deployment_version: 'v1.2.3',
          },
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [
      {
        ...baseAssessmentInfo,
        name: 'quality',
        displayName: 'Quality Score',
        isRetrievalAssessment: false,
      },
    ];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    // Expected columns:
    // 1) request (INPUT)
    // 2-16) standard trace info columns (trace_id, trace_name, response, user, session, execution_duration, request_time, state, source, logged_model, prompt, tokens, run_name, tags)
    // 17-19) custom metadata columns (user_id, environment, deployment_version)
    // 20) quality (ASSESSMENT)
    expect(result.current).toHaveLength(19);

    const colIds = result.current.map((c) => c.id);
    expect(colIds).toContain('custom_metadata:user_id');
    expect(colIds).toContain('custom_metadata:environment');
    expect(colIds).toContain('custom_metadata:deployment_version');

    // Verify custom metadata columns have correct properties
    const userIdColumn = result.current.find((c) => c.id === 'custom_metadata:user_id');
    expect(userIdColumn).toEqual({
      id: 'custom_metadata:user_id',
      label: 'user_id',
      type: TracesTableColumnType.TRACE_INFO,
      group: TracesTableColumnGroup.INFO,
    });
  });

  it('excludes MLflow internal keys from custom metadata columns', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {
            user_id: 'user123',
            'mlflow.internal.key': 'internal_value',
            'mlflow.run_id': 'run123',
            environment: 'production',
          },
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    const colIds = result.current.map((c) => c.id);
    // Should include custom metadata
    expect(colIds).toContain('custom_metadata:user_id');
    expect(colIds).toContain('custom_metadata:environment');
    // Should exclude MLflow internal keys
    expect(colIds).not.toContain('custom_metadata:mlflow.internal.key');
    expect(colIds).not.toContain('custom_metadata:mlflow.run_id');
  });

  it('handles multiple results with different custom metadata keys', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {
            user_id: 'user123',
            environment: 'production',
          },
        },
      },
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Another query' },
        traceInfo: {
          request: '',
          execution_duration: '456',
          request_time: '789',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {
            deployment_version: 'v1.2.3',
            region: 'us-west-2',
          },
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    const colIds = result.current.map((c) => c.id);
    // Should include all unique custom metadata keys from both results
    expect(colIds).toContain('custom_metadata:user_id');
    expect(colIds).toContain('custom_metadata:environment');
    expect(colIds).toContain('custom_metadata:deployment_version');
    expect(colIds).toContain('custom_metadata:region');

    // Should not duplicate keys
    const customMetadataColumns = colIds.filter((id) => id.startsWith('custom_metadata:'));
    expect(customMetadataColumns).toHaveLength(4);
  });

  it('handles results with no trace_metadata gracefully', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          // No trace_metadata
        } as any,
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    const colIds = result.current.map((c) => c.id);
    // Should not include any custom metadata columns
    const customMetadataColumns = colIds.filter((id) => id.startsWith('custom_metadata:'));
    expect(customMetadataColumns).toHaveLength(0);
  });

  it('handles empty trace_metadata object gracefully', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {}, // Empty object
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments);

    const colIds = result.current.map((c) => c.id);
    // Should not include any custom metadata columns
    const customMetadataColumns = colIds.filter((id) => id.startsWith('custom_metadata:'));
    expect(customMetadataColumns).toHaveLength(0);
  });

  it('includes custom metadata columns from otherEvaluationResults when provided', () => {
    jest.mocked(shouldUseTraceInfoV3).mockReturnValue(true);

    const fakeResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Hello world' },
        traceInfo: {
          request: '',
          execution_duration: '123',
          request_time: '456',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {
            user_id: 'user123',
          },
        },
      },
    ];

    const otherResults: RunEvaluationTracesDataEntry[] = [
      {
        ...baseEvalDataEntry,
        inputs: { userQuery: 'Other query' },
        traceInfo: {
          request: '',
          execution_duration: '789',
          request_time: '012',
          state: 'OK',
          tags: {},
          trace_id: '',
          trace_location: {} as any,
          trace_metadata: {
            environment: 'staging',
            deployment_version: 'v2.0.0',
          },
        },
      },
    ];

    const fakeAssessments: AssessmentInfo[] = [];

    const { result } = renderUseTableColumnsHook(fakeResults, fakeAssessments, undefined, otherResults);

    const colIds = result.current.map((c) => c.id);
    // Should include custom metadata from both current and other results
    expect(colIds).toContain('custom_metadata:user_id');
    expect(colIds).toContain('custom_metadata:environment');
    expect(colIds).toContain('custom_metadata:deployment_version');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useTableColumns.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useTableColumns.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useMemo } from 'react';

import type { IntlShape } from '@databricks/i18n';

import type { ModelTraceInfoV3 } from '../../model-trace-explorer';
import { KnownEvaluationResultAssessmentName } from '../enum';
import type { AssessmentInfo, RunEvaluationTracesDataEntry, TracesTableColumn } from '../types';
import { TracesTableColumnGroup, TracesTableColumnType } from '../types';
import { shouldEnableTagGrouping } from '../utils/FeatureUtils';
import {
  createCustomMetadataColumnId,
  createTagColumnId,
  MLFLOW_INTERNAL_PREFIX,
  shouldUseTraceInfoV3,
} from '../utils/TraceUtils';

export const USER_COLUMN_ID = 'user';
export const SESSION_COLUMN_ID = 'session';
export const RESPONSE_COLUMN_ID = 'response';
export const TRACE_ID_COLUMN_ID = 'trace_id';
export const REQUEST_TIME_COLUMN_ID = 'request_time';
export const EXECUTION_DURATION_COLUMN_ID = 'execution_duration';
export const STATE_COLUMN_ID = 'state';
export const SOURCE_COLUMN_ID = 'source';
export const TAGS_COLUMN_ID = 'tags';
export const TRACE_NAME_COLUMN_ID = 'trace_name';
export const INPUTS_COLUMN_ID = 'request';
export const RUN_NAME_COLUMN_ID = 'run_name';
export const LOGGED_MODEL_COLUMN_ID = 'logged_model';
export const TOKENS_COLUMN_ID = 'tokens';
export const CUSTOM_METADATA_COLUMN_ID = 'custom_metadata';
export const SPAN_NAME_COLUMN_ID = 'span.name';
export const SPAN_TYPE_COLUMN_ID = 'span.type';
export const SPAN_CONTENT_COLUMN_ID = 'span.content';
export const LINKED_PROMPTS_COLUMN_ID = 'prompt';

export const SORTABLE_INFO_COLUMNS = [EXECUTION_DURATION_COLUMN_ID, REQUEST_TIME_COLUMN_ID, SESSION_COLUMN_ID];
// Columns that are sortable by the server. Server-side sorting should be prioritized over client-side sorting.
export const SERVER_SORTABLE_INFO_COLUMNS = [EXECUTION_DURATION_COLUMN_ID, REQUEST_TIME_COLUMN_ID];

// This is a short term fix to not display any additional assessments with the trace info v3 migration.
// Long term we should decide how to best display these assessments.
const EXCLUDED_ASSESSMENT_NAMES = [
  KnownEvaluationResultAssessmentName.CHUNK_RELEVANCE,
  KnownEvaluationResultAssessmentName.TOTAL_INPUT_TOKEN_COUNT,
  KnownEvaluationResultAssessmentName.TOTAL_OUTPUT_TOKEN_COUNT,
  KnownEvaluationResultAssessmentName.TOTAL_TOKEN_COUNT,
  KnownEvaluationResultAssessmentName.DOCUMENT_RECALL,
  KnownEvaluationResultAssessmentName.DOCUMENT_RATINGS,
];

const ASSESSMENT_COLUMN_ID_SUFFIX = '_assessment_column';
const EXPECTATION_COLUMN_ID_SUFFIX = '_expectation_column';

// Add a suffix to the assessment name as the id to make it work for blank names.
export function createAssessmentColumnId(assessmentName: string) {
  return assessmentName + ASSESSMENT_COLUMN_ID_SUFFIX;
}

export function createExpectationColumnId(expectationName: string) {
  return expectationName + EXPECTATION_COLUMN_ID_SUFFIX;
}

export const useTableColumns = (
  intl: IntlShape,
  currentEvaluationResults: RunEvaluationTracesDataEntry[],
  assessmentInfos: AssessmentInfo[],
  runUuid: string | undefined,
  otherEvaluationResults?: RunEvaluationTracesDataEntry[],
  isTraceInfoV3Override?: boolean,
) => {
  const allColumns: TracesTableColumn[] = useMemo(() => {
    const isTraceInfoV3 = isTraceInfoV3Override ?? shouldUseTraceInfoV3(currentEvaluationResults);
    let inputCols = [];
    if (!isTraceInfoV3) {
      let inputKeys = new Set<string>();
      let traceInfoColumns = new Set<keyof ModelTraceInfoV3>();

      currentEvaluationResults.forEach((result) => {
        const { inputs } = result;
        inputKeys = new Set<string>([...inputKeys, ...Object.keys(inputs || {})]);

        traceInfoColumns = new Set<keyof ModelTraceInfoV3>([
          ...traceInfoColumns,
          ...Object.keys(result.traceInfo || {}),
        ] as (keyof ModelTraceInfoV3)[]);
      });

      inputCols = [...inputKeys].map((key) => ({
        id: key,
        label: key,
        type: TracesTableColumnType.INPUT,
      }));
    } else {
      inputCols = [
        {
          id: INPUTS_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Request',
            description: 'Column label for request',
          }),
          type: TracesTableColumnType.INPUT,
          group: TracesTableColumnGroup.INFO,
        },
      ];
    }

    const assessmentColumns = assessmentInfos
      .map((assessmentInfo) => ({
        id: createAssessmentColumnId(assessmentInfo.name),
        label: assessmentInfo.displayName,
        type: TracesTableColumnType.ASSESSMENT,
        assessmentInfo,
        group: TracesTableColumnGroup.ASSESSMENT,
      }))
      .filter(
        (assessment) =>
          // retrieval columns should not be displayed in the table since they don't apply to the overall trace
          !assessment.assessmentInfo.isRetrievalAssessment &&
          !EXCLUDED_ASSESSMENT_NAMES.includes(assessment.assessmentInfo.name as KnownEvaluationResultAssessmentName),
      );

    let infoCols;
    const expectationColumns: Record<string, TracesTableColumn> = {};
    if (isTraceInfoV3) {
      infoCols = [
        {
          id: TRACE_ID_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Trace ID',
            description: 'Column label for trace ID',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: TRACE_NAME_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Trace name',
            description: 'Column label for trace name',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: RESPONSE_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Response',
            description: 'Column label for response',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: USER_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'User',
            description: 'Column label for user',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: SESSION_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Session',
            description: 'Column label for session',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: EXECUTION_DURATION_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Execution time',
            description: 'Column label for execution time',
          }),
          filterLabel: intl.formatMessage({
            defaultMessage: 'Execution time (ms)',
            description: 'Column label for execution time with the unit suffix',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: REQUEST_TIME_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Request time',
            description: 'Column label for request time',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: STATE_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'State',
            description: 'Column label for state',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: SOURCE_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Source',
            description: 'Column label for source',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: LOGGED_MODEL_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Version',
            description: 'Column label for logged model',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        // Only available in OSS
        {
          id: LINKED_PROMPTS_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Prompt',
            description: 'Column label for linked prompts',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        {
          id: TOKENS_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Tokens',
            description: 'Column label for tokens',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        // Only show run name column on experiment level traces, where runUuid is not provided
        isNil(runUuid) && {
          id: RUN_NAME_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Run name',
            description: 'Column label for run name',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.INFO,
        },
        !shouldEnableTagGrouping() && {
          id: TAGS_COLUMN_ID,
          label: intl.formatMessage({
            defaultMessage: 'Tags',
            description: 'Column label for tags',
          }),
          type: TracesTableColumnType.TRACE_INFO,
          group: TracesTableColumnGroup.TAG,
        },
      ];

      const allResults = [...currentEvaluationResults, ...(otherEvaluationResults || [])];
      // Populate custom metadata columns
      const customMetadataColumns: Record<string, TracesTableColumn> = {};
      allResults.forEach((result: RunEvaluationTracesDataEntry) => {
        const traceMetadata = result.traceInfo?.trace_metadata;
        if (traceMetadata) {
          Object.keys(traceMetadata).forEach((key) => {
            if (!key.startsWith(MLFLOW_INTERNAL_PREFIX) && !customMetadataColumns[key]) {
              customMetadataColumns[key] = {
                id: createCustomMetadataColumnId(key),
                label: key,
                type: TracesTableColumnType.TRACE_INFO,
                group: TracesTableColumnGroup.INFO,
              };
            }
          });
        }

        const expectations = result.targets;
        if (expectations) {
          Object.keys(expectations).forEach((expectationName) => {
            if (!expectationColumns[expectationName]) {
              expectationColumns[expectationName] = {
                id: createExpectationColumnId(expectationName),
                label: expectationName,
                type: TracesTableColumnType.EXPECTATION,
                group: TracesTableColumnGroup.EXPECTATION,
                expectationName,
              };
            }
          });
        }
      });
      infoCols = [...infoCols, ...Object.values(customMetadataColumns)];

      if (shouldEnableTagGrouping()) {
        const tagColumnRecords: Record<string, TracesTableColumn> = {};
        allResults
          .map((result) => result.traceInfo?.tags)
          .forEach((tag) => {
            Object.keys(tag || {}).forEach((key) => {
              if (!key.startsWith(MLFLOW_INTERNAL_PREFIX) && !tagColumnRecords[key]) {
                tagColumnRecords[key] = {
                  id: createTagColumnId(key),
                  label: key,
                  type: TracesTableColumnType.TRACE_INFO,
                  group: TracesTableColumnGroup.TAG,
                };
              }
            });
          });
        const tagColumns = Object.values(tagColumnRecords);

        infoCols = [...infoCols, ...tagColumns];
      }
    } else {
      infoCols = currentEvaluationResults.some((result) => !isNil(result.requestTime))
        ? [
            {
              id: REQUEST_TIME_COLUMN_ID,
              label: intl.formatMessage({
                defaultMessage: 'Request time',
                description: 'Column label for request time',
              }),
              type: TracesTableColumnType.INTERNAL_MONITOR_REQUEST_TIME,
            },
          ]
        : [];
    }

    return [...inputCols, ...infoCols, ...assessmentColumns, ...Object.values(expectationColumns)].filter(
      (col): col is TracesTableColumn => Boolean(col),
    );
  }, [currentEvaluationResults, intl, assessmentInfos, runUuid, otherEvaluationResults, isTraceInfoV3Override]);

  return allColumns;
};
```

--------------------------------------------------------------------------------

---[FILE: useTableSort.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useTableSort.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import type { EvaluationsOverviewTableSort, TracesTableColumn } from '../types';

export const useTableSort = (
  selectedColumns: TracesTableColumn[],
  initialTableSort?: EvaluationsOverviewTableSort,
): [EvaluationsOverviewTableSort | undefined, (sort: EvaluationsOverviewTableSort | undefined) => void] => {
  const [tableSort, setTableSort] = useState<EvaluationsOverviewTableSort | undefined>(
    initialTableSort && selectedColumns.find((c) => c.id === initialTableSort.key) ? initialTableSort : undefined,
  );

  // This is to keep table sort in sync with selected columns.
  // e.g. if the user deselects the column that is currently used for sorting,
  // we should clear the sort.
  const derivedTableSort = useMemo(() => {
    if (!tableSort) return undefined;

    if (!selectedColumns.find((c) => c.id === tableSort.key)) {
      return undefined;
    }

    return tableSort;
  }, [tableSort, selectedColumns]);

  return [derivedTableSort, setTableSort];
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 466
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 466 of 991)

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

---[FILE: useDeleteTraces.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useDeleteTraces.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';
import { useDeleteTracesMutation } from './useDeleteTraces';
import { MlflowService } from '../../../sdk/MlflowService';
import { invalidateMlflowSearchTracesCache } from '@databricks/web-shared/genai-traces-table';

// Mock the dependencies
jest.mock('../../../sdk/MlflowService', () => ({
  MlflowService: {
    deleteTracesV3: jest.fn(),
  },
}));

jest.mock('@databricks/web-shared/genai-traces-table', () => ({
  invalidateMlflowSearchTracesCache: jest.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries to simplify testing
      },
    },
    logger: {
      error: () => {},
      log: () => {},
      warn: () => {},
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useDeleteTracesMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call MlflowService.deleteTracesV3 with correct parameters for single batch', async () => {
    const mockResponse = { traces_deleted: 5 };
    jest.mocked(MlflowService.deleteTracesV3).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    const traceIds = ['trace-1', 'trace-2', 'trace-3', 'trace-4', 'trace-5'];
    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should make single API call since we have less than 100 traces
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(1);
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledWith('test-experiment-id', traceIds);

    // Should return the correct result
    expect(result.current.data).toEqual({ traces_deleted: 5 });

    // Should invalidate cache on success
    expect(invalidateMlflowSearchTracesCache).toHaveBeenCalledTimes(1);
    expect(invalidateMlflowSearchTracesCache).toHaveBeenCalledWith({ queryClient: expect.any(QueryClient) });
  });

  test('should batch trace IDs into chunks of 100 and process in parallel', async () => {
    // Create 250 trace IDs to test batching
    const traceIds = Array.from({ length: 250 }, (_, i) => `trace-${i + 1}`);

    // Mock responses for each batch
    const mockResponses = [
      { traces_deleted: 100 }, // First batch: 100 traces
      { traces_deleted: 100 }, // Second batch: 100 traces
      { traces_deleted: 50 }, // Third batch: 50 traces
    ];

    jest
      .mocked(MlflowService.deleteTracesV3)
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1])
      .mockResolvedValueOnce(mockResponses[2]);

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should make 3 API calls (250 traces / 100 per batch = 3 batches)
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(3);

    // Verify first batch (traces 1-100)
    expect(MlflowService.deleteTracesV3).toHaveBeenNthCalledWith(1, 'test-experiment-id', traceIds.slice(0, 100));

    // Verify second batch (traces 101-200)
    expect(MlflowService.deleteTracesV3).toHaveBeenNthCalledWith(2, 'test-experiment-id', traceIds.slice(100, 200));

    // Verify third batch (traces 201-250)
    expect(MlflowService.deleteTracesV3).toHaveBeenNthCalledWith(3, 'test-experiment-id', traceIds.slice(200, 250));

    // Should sum up the total traces deleted
    expect(result.current.data).toEqual({ traces_deleted: 250 });

    // Should invalidate cache on success
    expect(invalidateMlflowSearchTracesCache).toHaveBeenCalledTimes(1);
  });

  test('should handle exactly 100 trace IDs without over-batching', async () => {
    const traceIds = Array.from({ length: 100 }, (_, i) => `trace-${i + 1}`);
    const mockResponse = { traces_deleted: 100 };

    jest.mocked(MlflowService.deleteTracesV3).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should make exactly 1 API call for 100 traces
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(1);
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledWith('test-experiment-id', traceIds);

    expect(result.current.data).toEqual({ traces_deleted: 100 });
  });

  test('should handle exactly 101 trace IDs by creating 2 batches', async () => {
    const traceIds = Array.from({ length: 101 }, (_, i) => `trace-${i + 1}`);

    const mockResponses = [
      { traces_deleted: 100 }, // First batch: 100 traces
      { traces_deleted: 1 }, // Second batch: 1 trace
    ];

    jest
      .mocked(MlflowService.deleteTracesV3)
      .mockResolvedValueOnce(mockResponses[0])
      .mockResolvedValueOnce(mockResponses[1]);

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should make 2 API calls
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(2);

    // Verify first batch (100 traces)
    expect(MlflowService.deleteTracesV3).toHaveBeenNthCalledWith(1, 'test-experiment-id', traceIds.slice(0, 100));

    // Verify second batch (1 trace)
    expect(MlflowService.deleteTracesV3).toHaveBeenNthCalledWith(2, 'test-experiment-id', traceIds.slice(100, 101));

    expect(result.current.data).toEqual({ traces_deleted: 101 });
  });

  test('should handle empty trace IDs array', async () => {
    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: [],
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should not make any API calls for empty array
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(0);

    // Should return 0 traces deleted
    expect(result.current.data).toEqual({ traces_deleted: 0 });

    // Should still invalidate cache
    expect(invalidateMlflowSearchTracesCache).toHaveBeenCalledTimes(1);
  });

  test('should handle partial failures in batched requests', async () => {
    const traceIds = Array.from({ length: 150 }, (_, i) => `trace-${i + 1}`);

    // First batch succeeds, second batch fails
    jest
      .mocked(MlflowService.deleteTracesV3)
      .mockResolvedValueOnce({ traces_deleted: 100 })
      .mockRejectedValueOnce(new Error('Network error on second batch'));

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Should have attempted 2 API calls
    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(2);

    // Error should be from the failed batch
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('Network error on second batch');

    // Should not invalidate cache on error
    expect(invalidateMlflowSearchTracesCache).toHaveBeenCalledTimes(0);
  });

  test('should handle single batch failure', async () => {
    const traceIds = ['trace-1', 'trace-2'];

    jest.mocked(MlflowService.deleteTracesV3).mockRejectedValueOnce(new Error('Permission denied'));

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('Permission denied');

    // Should not invalidate cache on error
    expect(invalidateMlflowSearchTracesCache).toHaveBeenCalledTimes(0);
  });

  test('should process all batches in parallel, not sequentially', async () => {
    const traceIds = Array.from({ length: 300 }, (_, i) => `trace-${i + 1}`);

    // Create promises that we can control timing of
    let resolveFirst: (value: any) => void;
    let resolveSecond: (value: any) => void;
    let resolveThird: (value: any) => void;

    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve;
    });
    const secondPromise = new Promise((resolve) => {
      resolveSecond = resolve;
    });
    const thirdPromise = new Promise((resolve) => {
      resolveThird = resolve;
    });

    jest
      .mocked(MlflowService.deleteTracesV3)
      .mockReturnValueOnce(firstPromise as any)
      .mockReturnValueOnce(secondPromise as any)
      .mockReturnValueOnce(thirdPromise as any);

    const { result } = renderHook(() => useDeleteTracesMutation(), {
      wrapper: createWrapper(),
    });

    // Start the mutation
    result.current.mutate({
      experimentId: 'test-experiment-id',
      traceRequestIds: traceIds,
    });

    // All three calls should be made immediately (parallel execution)
    await waitFor(() => {
      expect(MlflowService.deleteTracesV3).toHaveBeenCalledTimes(3);
    });

    // Resolve the promises in reverse order to verify they're parallel
    resolveThird!({ traces_deleted: 100 });
    resolveFirst!({ traces_deleted: 100 });
    resolveSecond!({ traces_deleted: 100 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ traces_deleted: 300 });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useDeleteTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useDeleteTraces.tsx

```typescript
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';
import { MlflowService } from '../../../sdk/MlflowService';
import { invalidateMlflowSearchTracesCache } from '@databricks/web-shared/genai-traces-table';

export const useDeleteTracesMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<{ traces_deleted: number }, Error, { experimentId: string; traceRequestIds: string[] }>({
    mutationFn: async ({ experimentId, traceRequestIds }) => {
      // Chunk the trace IDs into groups of 100
      const chunks = [];
      for (let i = 0; i < traceRequestIds.length; i += 100) {
        chunks.push(traceRequestIds.slice(i, i + 100));
      }

      // Make parallel calls for each chunk
      const deletePromises = chunks.map((chunk) => MlflowService.deleteTracesV3(experimentId, chunk));

      const results = await Promise.all(deletePromises);

      // Sum up the total traces deleted
      const totalDeleted = results.reduce((sum, result) => sum + result.traces_deleted, 0);

      return { traces_deleted: totalDeleted };
    },
    onSuccess: () => invalidateMlflowSearchTracesCache({ queryClient }),
  });

  return mutation;
};
```

--------------------------------------------------------------------------------

---[FILE: useRunLoggedTraceTableArtifacts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useRunLoggedTraceTableArtifacts.tsx
Signals: React

```typescript
import { intersection } from 'lodash';
import type { KeyValueEntity } from '../../../../common/types';
import { extractLoggedTablesFromRunTags } from '../../../utils/ArtifactUtils';
import { GenAiTraceEvaluationArtifactFile } from '@databricks/web-shared/genai-traces-table';
import { useMemo } from 'react';

/**
 * Returns the list of known evaluation table artifacts that are logged for a run based on its tags.
 */
export const useRunLoggedTraceTableArtifacts = (runTags?: Record<string, KeyValueEntity>) =>
  useMemo(() => {
    if (!runTags) {
      return [];
    }
    return intersection(extractLoggedTablesFromRunTags(runTags), [
      GenAiTraceEvaluationArtifactFile.Evaluations,
      GenAiTraceEvaluationArtifactFile.Metrics,
      GenAiTraceEvaluationArtifactFile.Assessments,
    ]) as GenAiTraceEvaluationArtifactFile[];
  }, [runTags]);
```

--------------------------------------------------------------------------------

---[FILE: useSavePendingEvaluationAssessments.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useSavePendingEvaluationAssessments.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
import { uploadArtifactApi } from '../../../actions';
import { useSavePendingEvaluationAssessments } from './useSavePendingEvaluationAssessments';
import type {
  RunEvaluationResultAssessment,
  RunEvaluationResultAssessmentDraft,
} from '@databricks/web-shared/genai-traces-table';
import { getArtifactChunkedText } from '../../../../common/utils/ArtifactUtils';
import { merge } from 'lodash';
import { KnownEvaluationResultAssessmentMetadataFields } from '@databricks/web-shared/genai-traces-table';

jest.mock('../../../../common/utils/ArtifactUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/ArtifactUtils')>(
    '../../../../common/utils/ArtifactUtils',
  ),
  getArtifactChunkedText: jest.fn(),
}));

jest.mock('../../../actions', () => ({
  getEvaluationTableArtifact: jest.fn(),
  uploadArtifactApi: jest.fn(),
}));

const sampleExistingAssessmentSourceMetadata = {
  key_a: '1',
  key_b: '2',
};

const sampleExistingAssessmentData = {
  columns: [
    'evaluation_id',
    'name',
    'source',
    'timestamp',
    'boolean_value',
    'numeric_value',
    'string_value',
    'rationale',
    'metadata',
  ],
  data: [
    [
      'test-evaluation-id',
      'overall_assessment',
      { source_id: '', source_metadata: {}, source_type: 'AI_JUDGE' },
      1,
      null,
      null,
      'some-existing-assessment-value',
      '',
      { is_overall_assessment: true },
    ],
    [
      'test-evaluation-id',
      'groundedness',
      { source_id: '', source_metadata: {}, source_type: 'AI_JUDGE' },
      100,
      null,
      null,
      'no',
      '',
      {},
    ],
    [
      'test-evaluation-id',
      'groundedness',
      { source_id: 'user@user.com', source_metadata: sampleExistingAssessmentSourceMetadata, source_type: 'HUMAN' },
      200,
      null,
      null,
      'yes',
      '',
      {},
    ],
    [
      'unrelated-evaluation-id',
      'overall_assessment',
      { source_id: '', source_metadata: {}, source_type: 'AI_JUDGE' },
      1,
      null,
      null,
      'some-existing-assessment-value',
      '',
      { is_overall_assessment: true },
    ],
  ],
};

describe('useSavePendingEvaluationAssessments', () => {
  const createDeferredUploadArtifactApi = () => {
    const result: { resolveUpload: () => void } = { resolveUpload: jest.fn() };
    const deferredPromise = new Promise<void>((resolve) => {
      result.resolveUpload = resolve;
    });
    jest
      .mocked(uploadArtifactApi)
      .mockImplementation(() => ({ type: 'uploadArtifactApi', payload: deferredPromise } as any));

    return result;
  };

  beforeEach(() => {
    jest
      .mocked(uploadArtifactApi)
      .mockImplementation(() => ({ type: 'uploadArtifactApi', payload: Promise.resolve() } as any));
    jest.mocked(getArtifactChunkedText).mockImplementation(() => {
      return Promise.resolve(JSON.stringify(sampleExistingAssessmentData));
    });
  });
  const renderTestHook = () =>
    renderHook(() => useSavePendingEvaluationAssessments(), {
      wrapper: MockedReduxStoreProvider,
    });

  const createAssessmentObject = (
    name: string,
    value: string,
    isHuman = false,
    isDraft = false,
    isOverall = false,
    sourceId = '',
  ): RunEvaluationResultAssessment | RunEvaluationResultAssessmentDraft => ({
    name,
    stringValue: value,
    booleanValue: null,
    metadata: isOverall ? { [KnownEvaluationResultAssessmentMetadataFields.IS_OVERALL_ASSESSMENT]: true } : {},
    numericValue: null,
    rationale: '',
    source: {
      metadata: {},
      sourceId,
      sourceType: isHuman ? 'HUMAN' : 'AI_JUDGE',
    },
    timestamp: 0,
    isDraft: isDraft || undefined,
  });

  test('it should save pending assessments to the simulated upload function', async () => {
    const sampleEvaluationAssessments = [
      createAssessmentObject('overall_assessment', 'yes', true, false, true),
      createAssessmentObject('overall_assessment', 'weak yes', true, false, true),
      createAssessmentObject('overall_assessment', 'no', false, false, true),
      createAssessmentObject('correctness', 'no', true, true),
      createAssessmentObject('correctness', 'yes', false),
    ] as RunEvaluationResultAssessmentDraft[];

    const { resolveUpload } = createDeferredUploadArtifactApi();

    const { result } = renderTestHook();

    await act(async () => {
      result.current.savePendingAssessments('test-run-uuid', 'test-evaluation-id', sampleEvaluationAssessments);
    });

    await waitFor(() => {
      expect(result.current.isSaving).toBe(true);
    });

    resolveUpload();

    await waitFor(() => {
      expect(result.current.isSaving).toBe(false);
    });
    const [sentTestRunUuid, sentArtifactPath, sentContents] = jest.mocked(uploadArtifactApi).mock.lastCall || [];

    expect(sentTestRunUuid).toEqual('test-run-uuid');
    expect(sentArtifactPath).toEqual('_assessments.json');
    expect(sentContents.columns).toEqual(sampleExistingAssessmentData.columns);

    const originalUnrelatedEvaluationDataEntry = sampleExistingAssessmentData.data.find(
      ([evaluationId]) => evaluationId === 'unrelated-evaluation-id',
    );

    expect(sentContents.data).toContainEqual(originalUnrelatedEvaluationDataEntry);

    expect(sentContents.data).toContainEqual(expect.arrayContaining(['overall_assessment', 'yes']));
    expect(sentContents.data).toContainEqual(expect.arrayContaining(['overall_assessment', 'weak yes']));
    expect(sentContents.data).toContainEqual(expect.arrayContaining(['overall_assessment', 'no']));

    expect(sentContents.data).toContainEqual(expect.arrayContaining(['correctness', 'no']));
    expect(sentContents.data).toContainEqual(expect.arrayContaining(['correctness', 'yes']));
  });

  describe('it should discard existing entries when incoming assessment have matching sources', () => {
    // Create a new assessment with the same name as an existing assessment
    const userProvidedTestAssessment = createAssessmentObject(
      'groundedness',
      'no',
      true,
      true,
      false,
      'user@user.com',
    ) as RunEvaluationResultAssessmentDraft;

    const assessmentWithSameSource = merge({}, userProvidedTestAssessment, {
      source: { metadata: sampleExistingAssessmentSourceMetadata },
    });
    const assessmentWithEqualSource = merge({}, userProvidedTestAssessment, {
      // Change order of keys in assessment
      name: userProvidedTestAssessment.name,
      // Change order of keys in source metadata
      source: { metadata: { key_b: '2', key_a: '1' } },
    });

    test.each([
      ['same', assessmentWithSameSource],
      ['value-equal', assessmentWithEqualSource],
    ])('For %s assessment object', async (name, userAssessment) => {
      const { resolveUpload } = createDeferredUploadArtifactApi();
      const { result } = renderTestHook();

      await act(async () => {
        result.current.savePendingAssessments('test-run-uuid', 'test-evaluation-id', [userAssessment]);
      });

      resolveUpload();

      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
      });

      const [, , sentContents] = jest.mocked(uploadArtifactApi).mock.lastCall || [];

      // The existing assessment with the same source should be removed
      expect(sentContents.data).not.toContainEqual(
        expect.arrayContaining(['groundedness', expect.objectContaining({ source_id: 'user@user.com' }), 'yes']),
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useSavePendingEvaluationAssessments.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useSavePendingEvaluationAssessments.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../../redux-types';
import { GET_EVALUATION_TABLE_ARTIFACT, uploadArtifactApi } from '../../../actions';
import type {
  RunEvaluationResultAssessment,
  RunEvaluationResultAssessmentDraft,
} from '@databricks/web-shared/genai-traces-table';
import type { RawEvaluationArtifact } from '../../../sdk/EvaluationArtifactService';
import { parseEvaluationTableArtifact } from '../../../sdk/EvaluationArtifactService';
import { getArtifactChunkedText, getArtifactLocationUrl } from '../../../../common/utils/ArtifactUtils';
import { isArray, isEqual } from 'lodash';
import Utils from '../../../../common/utils/Utils';
import { fulfilled } from '../../../../common/utils/ActionUtils';
import { ASSESSMENTS_ARTIFACT_FILE_NAME } from '../constants';

/**
 * Local utility function to fetch existing raw assessments artifact data.
 */
const fetchExistingRawAssessmentsArtifactData = async (runUuid: string): Promise<RawEvaluationArtifact> => {
  const fullArtifactSrcPath = getArtifactLocationUrl(ASSESSMENTS_ARTIFACT_FILE_NAME, runUuid);

  const fileContents = await getArtifactChunkedText(fullArtifactSrcPath).then((artifactContent) =>
    JSON.parse(artifactContent),
  );

  if (!isArray(fileContents.data) || !isArray(fileContents.columns)) {
    throw new Error('Artifact is malformed and/or not valid JSON');
  }

  return fileContents;
};

// We have to keep the list of fields in sync with the schema defined in MLflow.
// See mlflow/evaluation/utils.py#_get_assessments_dataframe_schema for the schema definition.
const assessmentsToEvaluationArtifactJSONRows = (
  evaluationId: string,
  assessments: RunEvaluationResultAssessment[],
): RawEvaluationArtifact['data'] => {
  return assessments.map((assessment) => {
    return [
      evaluationId,
      assessment.name,
      {
        source_type: assessment.source?.sourceType,
        source_id: assessment.source?.sourceId,
        source_metadata: assessment.source?.metadata,
      },
      assessment.timestamp || null,
      assessment.booleanValue || null,
      assessment.numericValue || null,
      assessment.stringValue || null,
      assessment.rationale || null,
      assessment.metadata || null,
      null, // error_code
      null, // error_message
    ];
  });
};

/**
 * Iterates through the existing assessments and removes the ones with matching sources from the pending assessments.
 * Accepts the existing assessments artifact and the pending assessments to be saved.
 */
const filterExistingAssessmentsBySource = (
  evaluationId: string,
  existingAssessmentsArtifact: RawEvaluationArtifact,
  pendingAssessments: RunEvaluationResultAssessmentDraft[],
) => {
  // Parse the existing assessments artifact file
  const existingAssessmentsFile = parseEvaluationTableArtifact(
    ASSESSMENTS_ARTIFACT_FILE_NAME,
    existingAssessmentsArtifact,
  );

  // Map the sources of the pending assessments to the format of the existing assessments
  const sourcesInPendingAssessments = pendingAssessments.map(({ name, source }) => ({
    name,
    source: source
      ? {
          source_type: source.sourceType,
          source_id: source.sourceId,
          source_metadata: source.metadata,
        }
      : undefined,
  }));

  // Find the entries in the existing assessments that have the same evaluation_id and source as the pending assessments
  const entriesToBeRemoved = existingAssessmentsFile.entries.filter(
    ({ evaluation_id, name, source }) =>
      evaluationId === evaluation_id &&
      sourcesInPendingAssessments.find((incomingEntry) => isEqual({ name, source }, incomingEntry)),
  );

  // Find the indexes of the entries to be removed
  const indexesToBeRemoved = entriesToBeRemoved.map((entry) => existingAssessmentsFile.entries.indexOf(entry));

  // Remove the entries from the existing assessments
  return existingAssessmentsArtifact.data.filter((_, index) => !indexesToBeRemoved.includes(index));
};

export const useSavePendingEvaluationAssessments = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const [isSaving, setIsSaving] = useState(false);

  const savePendingAssessments = useCallback(
    async (runUuid: string, evaluationId: string, pendingAssessmentEntries: RunEvaluationResultAssessmentDraft[]) => {
      try {
        setIsSaving(true);
        // Start with fetching existing state of the data so we have the fresh one
        const existingAssessmentsArtifact = await fetchExistingRawAssessmentsArtifactData(runUuid);

        // Map the assessments to the JSON file format
        const newData = assessmentsToEvaluationArtifactJSONRows(evaluationId, pendingAssessmentEntries);

        // Filter out the existing assessments that have the same source as the pending assessments
        const filteredExistingData = filterExistingAssessmentsBySource(
          evaluationId,
          existingAssessmentsArtifact,
          pendingAssessmentEntries,
        );

        // Upload the new artifact file. Explicitly "await" for the result so we can catch any errors.
        await dispatch(
          uploadArtifactApi(runUuid, ASSESSMENTS_ARTIFACT_FILE_NAME, {
            columns: existingAssessmentsArtifact.columns,
            data: [...filteredExistingData, ...newData],
          }),
        );

        dispatch({
          type: fulfilled(GET_EVALUATION_TABLE_ARTIFACT),
          payload: parseEvaluationTableArtifact(ASSESSMENTS_ARTIFACT_FILE_NAME, {
            columns: existingAssessmentsArtifact.columns,
            data: [...filteredExistingData, ...newData],
          }),
          meta: { runUuid, artifactPath: ASSESSMENTS_ARTIFACT_FILE_NAME },
        });
      } catch (e: any) {
        Utils.logErrorAndNotifyUser(e.message || e);
        throw e;
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch],
  );

  return { savePendingAssessments, isSaving };
};
```

--------------------------------------------------------------------------------

---[FILE: useSelectedRunUuid.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useSelectedRunUuid.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'selectedRunUuid';

/**
 * Query param-powered hook that returns the selected run uuid.
 */
export const useSelectedRunUuid = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedRunUuid = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setSelectedRunUuid = useCallback(
    (selectedRunUuid: string | undefined) => {
      setSearchParams(
        (params) => {
          if (selectedRunUuid === undefined) {
            params.delete(QUERY_PARAM_KEY);
            return params;
          }
          params.set(QUERY_PARAM_KEY, selectedRunUuid);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [selectedRunUuid, setSelectedRunUuid] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelActionsCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelActionsCell.tsx

```typescript
import { Button, DashIcon, DropdownMenu, useDesignSystemTheme, VisibleOffIcon } from '@databricks/design-system';
import { type LoggedModelProto } from '../../types';
import { useExperimentLoggedModelListPageRowVisibilityContext } from './hooks/useExperimentLoggedModelListPageRowVisibility';
import { ReactComponent as VisibleFillIcon } from '../../../common/static/icon-visible-fill.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { RUNS_VISIBILITY_MODE } from '../experiment-page/models/ExperimentPageUIState';
import { coerceToEnum } from '@databricks/web-shared/utils';

export const ExperimentLoggedModelActionsCell = ({ data, rowIndex }: { data: LoggedModelProto; rowIndex: number }) => {
  const { isRowHidden, toggleRowVisibility } = useExperimentLoggedModelListPageRowVisibilityContext();
  const isHidden = isRowHidden(data.info?.model_id ?? '', rowIndex);
  const { theme } = useDesignSystemTheme();
  return (
    <Button
      componentId="mlflow.logged_model.list_page.row_visibility_toggle"
      type="link"
      onClick={() => toggleRowVisibility(data.info?.model_id ?? '', rowIndex)}
      icon={
        isHidden ? (
          <VisibleOffIcon css={{ color: theme.colors.textSecondary }} />
        ) : (
          <VisibleFillIcon css={{ color: theme.colors.textSecondary }} />
        )
      }
    />
  );
};

export const ExperimentLoggedModelActionsHeaderCell = () => {
  const intl = useIntl();
  const { visibilityMode, usingCustomVisibility, setRowVisibilityMode } =
    useExperimentLoggedModelListPageRowVisibilityContext();
  const { theme } = useDesignSystemTheme();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button
          componentId="mlflow.logged_model.list_page.global_row_visibility_toggle"
          type="link"
          data-testid="experiment-view-runs-visibility-column-header"
          aria-label={intl.formatMessage({
            defaultMessage: 'Toggle visibility of rows',
            description:
              'Accessibility label for the button that toggles visibility of rows in the experiment view logged models compare mode',
          })}
        >
          {visibilityMode === RUNS_VISIBILITY_MODE.HIDEALL ? (
            <VisibleOffIcon css={{ color: theme.colors.textSecondary }} />
          ) : (
            <VisibleFillIcon css={{ color: theme.colors.textSecondary }} />
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.RadioGroup
          componentId="mlflow.logged_model.list_page.global_row_visibility_toggle.options"
          value={visibilityMode}
          onValueChange={(e) =>
            setRowVisibilityMode(coerceToEnum(RUNS_VISIBILITY_MODE, e, RUNS_VISIBILITY_MODE.FIRST_10_RUNS))
          }
        >
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.FIRST_10_RUNS}>
            {/* Dropdown menu does not support indeterminate state, so we're doing it manually */}
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Show first 10"
              description="Menu option for showing only 10 first runs in the experiment view runs compare mode"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.FIRST_20_RUNS}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Show first 20"
              description="Menu option for showing only 10 first runs in the experiment view runs compare mode"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.SHOWALL}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Show all runs"
              description="Menu option for revealing all hidden runs in the experiment view runs compare mode"
            />
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.HIDEALL}>
            <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
            <FormattedMessage
              defaultMessage="Hide all runs"
              description="Menu option for revealing all hidden runs in the experiment view runs compare mode"
            />
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelAllDatasetsList.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelAllDatasetsList.tsx
Signals: React

```typescript
import { Overflow } from '@databricks/design-system';
import { useMemo } from 'react';
import { type LoggedModelProto } from '../../types';
import { ExperimentLoggedModelDatasetButton } from './ExperimentLoggedModelDatasetButton';

export const ExperimentLoggedModelAllDatasetsList = ({
  loggedModel,
  empty,
}: {
  loggedModel: LoggedModelProto;
  empty?: React.ReactElement;
}) => {
  const uniqueDatasets = useMemo(() => {
    const allMetrics = loggedModel.data?.metrics ?? [];
    return allMetrics.reduce<{ dataset_name: string; dataset_digest: string; run_id: string | undefined }[]>(
      (aggregate, { dataset_digest, dataset_name, run_id }) => {
        if (
          dataset_name &&
          dataset_digest &&
          !aggregate.find(
            (dataset) => dataset.dataset_name === dataset_name && dataset.dataset_digest === dataset_digest,
          )
        ) {
          aggregate.push({ dataset_name, dataset_digest, run_id });
        }
        return aggregate;
      },
      [],
    );
  }, [loggedModel]);

  if (!uniqueDatasets.length) {
    return empty ?? <>-</>;
  }

  return (
    <Overflow>
      {uniqueDatasets.map(({ dataset_digest, dataset_name, run_id }) => (
        <ExperimentLoggedModelDatasetButton
          datasetName={dataset_name}
          datasetDigest={dataset_digest}
          runId={run_id ?? null}
          key={[dataset_name, dataset_digest].join('.')}
        />
      ))}
    </Overflow>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelDatasetButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelDatasetButton.tsx
Signals: React

```typescript
import { Button, Spinner, TableIcon, useDesignSystemTheme } from '@databricks/design-system';
import { useState } from 'react';
import { useExperimentLoggedModelOpenDatasetDetails } from './hooks/useExperimentLoggedModelOpenDatasetDetails';
import { useUserActionErrorHandler } from '@databricks/web-shared/metrics';

export const ExperimentLoggedModelDatasetButton = ({
  datasetName,
  datasetDigest,
  runId,
}: {
  datasetName: string;
  datasetDigest: string;
  runId: string | null;
}) => {
  const { theme } = useDesignSystemTheme();
  const [loadingDatasetDetails, setLoadingDatasetDetails] = useState(false);
  const { onDatasetClicked } = useExperimentLoggedModelOpenDatasetDetails();
  const { handleError } = useUserActionErrorHandler();

  const handleDatasetClick = (datasetName: string, datasetDigest: string, runId: string | null) => {
    if (runId) {
      setLoadingDatasetDetails(true);
      onDatasetClicked?.({ datasetName, datasetDigest, runId })
        .catch((error) => {
          handleError(error);
        })
        .finally(() => setLoadingDatasetDetails(false));
    }
  };

  return (
    <Button
      type="link"
      icon={loadingDatasetDetails ? <Spinner size="small" css={{ marginRight: theme.spacing.sm }} /> : <TableIcon />}
      key={[datasetName, datasetDigest].join('.')}
      componentId="mlflow.logged_model.dataset"
      onClick={() => handleDatasetClick(datasetName, datasetDigest, runId)}
    >
      {datasetName} (#{datasetDigest})
    </Button>
  );
};
```

--------------------------------------------------------------------------------

````

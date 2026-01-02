---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 560
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 560 of 991)

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

---[FILE: useGetScheduledScorers.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useGetScheduledScorers.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { renderHook, waitFor } from '@testing-library/react';
import { NotFoundError, InternalServerError } from '@databricks/web-shared/errors';
import { useGetScheduledScorers } from './useGetScheduledScorers';
import { listScheduledScorers, type MLflowScorer } from '../api';

// Mock external dependencies
jest.mock('../api');

const mockListScheduledScorers = jest.mocked(listScheduledScorers);

describe('useGetScheduledScorers', () => {
  let queryClient: QueryClient;

  const mockExperimentId = 'experiment-123';

  // Mock MLflowScorer responses (new API structure)
  const mockMLflowScorers: MLflowScorer[] = [
    {
      experiment_id: 123,
      scorer_name: 'llm-guidelines-scorer',
      scorer_version: 1,
      serialized_scorer: JSON.stringify({
        mlflow_version: '3.3.2+ui',
        serialization_version: 1,
        name: 'llm-guidelines-scorer',
        builtin_scorer_class: 'Guidelines',
        builtin_scorer_pydantic_data: {
          name: 'llm-guidelines-scorer',
          required_columns: ['outputs', 'inputs'],
          guidelines: ['Test guideline 1', 'Test guideline 2'],
        },
      }),
      creation_time: 1234567890,
      scorer_id: 'scorer-id-1',
    },
    {
      experiment_id: 123,
      scorer_name: 'custom-code-scorer',
      scorer_version: 1,
      serialized_scorer: JSON.stringify({
        mlflow_version: '3.3.2+ui',
        serialization_version: 1,
        name: 'custom-code-scorer',
        call_source: 'def my_scorer(inputs, outputs):\n    return {"score": 1}',
        call_signature: '(inputs, outputs)',
        original_func_name: 'my_scorer',
      }),
      creation_time: 1234567891,
      scorer_id: 'scorer-id-2',
    },
  ];

  const mockApiResponse = {
    scorers: mockMLflowScorers,
  };

  const mockEmptyApiResponse = {
    scorers: [],
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
  });

  describe('Golden Path - Successful Operations', () => {
    it('should successfully fetch and transform scheduled scorers', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      mockListScheduledScorers.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert - Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBe(null);

      // Verify the response structure and transformation
      expect(result.current.data).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'llm-guidelines-scorer',
            type: 'llm',
            llmTemplate: 'Guidelines',
            guidelines: ['Test guideline 1', 'Test guideline 2'],
            sampleRate: undefined, // Not included in MLflowScorer
            version: 1,
            disableMonitoring: true,
            is_instructions_judge: false,
            model: undefined,
          },
          {
            name: 'custom-code-scorer',
            type: 'custom-code',
            code: 'def my_scorer(inputs, outputs):\n    def my_scorer(inputs, outputs):\n        return {"score": 1}',
            callSignature: '(inputs, outputs)',
            originalFuncName: 'my_scorer',
            sampleRate: undefined,
            version: 1,
            disableMonitoring: true,
          },
        ],
      });

      expect(mockListScheduledScorers).toHaveBeenCalledWith(mockExperimentId);

      // Verify cache was populated
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual(result.current.data);
    });

    it('should successfully handle empty scorers list', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      mockListScheduledScorers.mockResolvedValue(mockEmptyApiResponse);

      const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [],
      });

      expect(mockListScheduledScorers).toHaveBeenCalledWith(mockExperimentId);

      // Verify cache was populated with empty data
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [],
      });
    });

    it('should handle response with missing scorers field', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      const responseWithoutScorers = {};
      mockListScheduledScorers.mockResolvedValue(responseWithoutScorers as any);

      const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [],
      });

      // Verify cache was populated with fallback data
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [],
      });
    });
  });

  describe('Query Configuration', () => {
    it('should not execute query when experimentId is falsy', () => {
      const falsyValues = [undefined, ''];

      falsyValues.forEach((experimentId) => {
        const { result } = renderHook(() => useGetScheduledScorers(experimentId), {
          wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
        });

        expect(result.current.data).toBeUndefined();
        expect(mockListScheduledScorers).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error Conditions', () => {
    it('should handle various API errors properly', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      const errors = [new InternalServerError({}), new NotFoundError({}), new Error('Network timeout')];

      for (const apiError of errors) {
        jest.clearAllMocks();
        mockListScheduledScorers.mockRejectedValue(apiError);

        // Create a new client for each iteration to avoid eslint warning
        const testQueryClient = queryClient;
        const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
          wrapper: ({ children }) => <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>,
        });

        // Act & Assert
        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBe(apiError);
        expect(result.current.data).toBeUndefined();
        expect(mockListScheduledScorers).toHaveBeenCalledWith(mockExperimentId);

        // Verify cache was not populated due to error
        const cacheAfterError = testQueryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
        expect(cacheAfterError).toBeUndefined();
      }
    });

    it('should handle scorer transformation errors gracefully', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      // Create a malformed scorer that will cause transformation to fail
      const malformedScorer: MLflowScorer = {
        experiment_id: 123,
        scorer_name: 'malformed-scorer',
        scorer_version: 1,
        serialized_scorer: 'invalid-json', // This will cause JSON.parse to fail
        creation_time: 1234567890,
        scorer_id: 'scorer-id-malformed',
      };

      const malformedResponse = {
        scorers: [malformedScorer],
      };

      mockListScheduledScorers.mockResolvedValue(malformedResponse);

      const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // The transformation should fail due to invalid JSON
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBeTruthy();
      expect(mockListScheduledScorers).toHaveBeenCalledWith(mockExperimentId);

      // Verify cache was not populated due to transformation error
      const cacheAfterError = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfterError).toBeUndefined();
    });
  });

  describe('Query Key and Caching', () => {
    it('should use correct query key format', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      mockListScheduledScorers.mockResolvedValue(mockEmptyApiResponse);

      const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Assert - Verify the specific query key is used
      const cacheData = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheData).toBeDefined();

      // Verify different experiment IDs use different cache keys
      const differentExperimentCache = queryClient.getQueryData([
        'mlflow',
        'scheduled-scorers',
        'different-experiment',
      ]);
      expect(differentExperimentCache).toBeUndefined();
    });

    it('should respect staleTime configuration', async () => {
      // Arrange
      mockListScheduledScorers.mockResolvedValue(mockEmptyApiResponse);

      const { result } = renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify query was cached and won't refetch immediately
      const queryState = queryClient.getQueryState(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(queryState?.dataUpdatedAt).toBeDefined();

      // Clear mock to verify no refetch happens
      jest.clearAllMocks();

      // Render hook again - should not trigger new request due to staleTime
      renderHook(() => useGetScheduledScorers(mockExperimentId), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      expect(mockListScheduledScorers).not.toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGetScheduledScorers.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useGetScheduledScorers.tsx

```typescript
import { useQuery, type UseQueryResult } from '@databricks/web-shared/query-client';
import { UnknownError, type PredefinedError } from '@databricks/web-shared/errors';
import type { ScheduledScorer, ScorerConfig } from '../types';
import { convertMLflowScorerToConfig, transformScorerConfig } from '../utils/scorerTransformUtils';
import { listScheduledScorers, ListScorersResponse } from '../api';

// Define response types
export type GetScheduledScorersResponse = {
  experiment_id: string;
  scheduled_scorers?: {
    scorers: ScorerConfig[];
  };
};

export interface ScheduledScorersResponse {
  experimentId: string;
  scheduledScorers: ScheduledScorer[];
}

export function useGetScheduledScorers(
  experimentId?: string,
): UseQueryResult<ScheduledScorersResponse, PredefinedError> {
  return useQuery<ScheduledScorersResponse, PredefinedError>({
    queryKey: ['mlflow', 'scheduled-scorers', experimentId],
    queryFn: async () => {
      if (!experimentId) {
        throw new UnknownError('Experiment ID is required');
      }
      const response: ListScorersResponse = await listScheduledScorers(experimentId);

      // Transform the response to match ScheduledScorersResponse
      const scheduledScorers = response.scorers?.map(convertMLflowScorerToConfig).map(transformScorerConfig) || [];

      return {
        experimentId: experimentId,
        scheduledScorers,
      };
    },
    enabled: !!experimentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
```

--------------------------------------------------------------------------------

---[FILE: useUpdateScheduledScorer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useUpdateScheduledScorer.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { renderHook, waitFor } from '@testing-library/react';
import { InternalServerError } from '@databricks/web-shared/errors';
import { useUpdateScheduledScorerMutation } from './useUpdateScheduledScorer';
import { registerScorer, type RegisterScorerResponse } from '../api';
import { transformScheduledScorer } from '../utils/scorerTransformUtils';

// Mock external dependencies
jest.mock('../api');

const mockRegisterScorer = jest.mocked(registerScorer);

describe('useUpdateScheduledScorerMutation', () => {
  let queryClient: QueryClient;

  const mockExperimentId = 'experiment-123';

  const mockUpdatedLLMScorer = {
    name: 'original-scorer',
    type: 'llm' as const,
    llmTemplate: 'Guidelines' as const,
    guidelines: ['Updated guideline 1', 'Updated guideline 2'],
    sampleRate: 75,
    filterString: 'updated_column = "value"',
  };

  const mockUpdatedCustomCodeScorer = {
    name: 'updated-custom-scorer',
    type: 'custom-code' as const,
    code: 'def updated_scorer(inputs, outputs):\n    return {"score": 0.8}',
    sampleRate: 60,
    filterString: 'status = "success"',
    callSignature: '',
    originalFuncName: '',
  };

  const mockRegisterResponse: RegisterScorerResponse = {
    version: 2,
    scorer_id: 'scorer-id-123',
    experiment_id: mockExperimentId,
    name: 'original-scorer',
    serialized_scorer: '{"type": "llm", "guidelines": ["Updated guideline 1", "Updated guideline 2"]}',
    creation_time: 1234567890,
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Golden Path - Successful Updates', () => {
    it('should successfully update a single scorer', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      mockRegisterScorer.mockResolvedValue(mockRegisterResponse);

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorers: [mockUpdatedLLMScorer],
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;

      // Verify the response structure
      expect(response).toMatchObject({
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [
            {
              scorer_version: 2,
              serialized_scorer: '{"type": "llm", "guidelines": ["Updated guideline 1", "Updated guideline 2"]}',
            },
          ],
        },
      });

      // Verify registerScorer was called with transformed config
      const expectedTransformedConfig = transformScheduledScorer(mockUpdatedLLMScorer);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig);
      expect(mockRegisterScorer).toHaveBeenCalledTimes(1);

      // Verify cache was updated
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: expect.arrayContaining([
          expect.objectContaining({
            name: 'original-scorer',
            version: 2,
          }),
        ]),
      });
    });

    it('should successfully update multiple scorers in parallel', async () => {
      // Arrange
      const scorer1 = { ...mockUpdatedLLMScorer, name: 'scorer-1' };
      const scorer2 = { ...mockUpdatedCustomCodeScorer, name: 'scorer-2' };

      const response1: RegisterScorerResponse = {
        version: 2,
        scorer_id: 'scorer-id-1',
        experiment_id: mockExperimentId,
        name: 'scorer-1',
        serialized_scorer: '{"type": "llm"}',
        creation_time: 1234567890,
      };

      const response2: RegisterScorerResponse = {
        version: 3,
        scorer_id: 'scorer-id-2',
        experiment_id: mockExperimentId,
        name: 'scorer-2',
        serialized_scorer: '{"type": "custom-code"}',
        creation_time: 1234567891,
      };

      // Mock registerScorer to return different responses based on the scorer name
      mockRegisterScorer.mockImplementation(async (experimentId, scorerConfig) => {
        if (scorerConfig.name === 'scorer-1') {
          return response1;
        }
        return response2;
      });

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorers: [scorer1, scorer2],
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;

      // Verify both scorers were updated
      expect(response.scheduled_scorers?.scorers).toHaveLength(2);
      expect(response.scheduled_scorers?.scorers[0]).toMatchObject({
        scorer_version: 2,
      });
      expect(response.scheduled_scorers?.scorers[1]).toMatchObject({
        scorer_version: 3,
      });

      // Verify registerScorer was called twice
      expect(mockRegisterScorer).toHaveBeenCalledTimes(2);

      const expectedTransformedConfig1 = transformScheduledScorer(scorer1);
      const expectedTransformedConfig2 = transformScheduledScorer(scorer2);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig1);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig2);

      // Verify cache was updated
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: expect.arrayContaining([
          expect.objectContaining({
            name: 'scorer-1',
            version: 2,
          }),
          expect.objectContaining({
            name: 'scorer-2',
            version: 3,
          }),
        ]),
      });
    });

    it('should handle custom code scorer updates', async () => {
      // Arrange
      const customCodeResponse: RegisterScorerResponse = {
        version: 1,
        scorer_id: 'scorer-id-custom',
        experiment_id: mockExperimentId,
        name: 'updated-custom-scorer',
        serialized_scorer:
          '{"type": "custom-code", "code": "def updated_scorer(inputs, outputs):\\n    return {\\"score\\": 0.8}"}',
        creation_time: 1234567891,
      };

      mockRegisterScorer.mockResolvedValue(customCodeResponse);

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorers: [mockUpdatedCustomCodeScorer],
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;

      // Verify the response structure
      expect(response).toMatchObject({
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [
            {
              scorer_version: 1,
            },
          ],
        },
      });

      // Verify registerScorer was called with transformed config
      const expectedTransformedConfig = transformScheduledScorer(mockUpdatedCustomCodeScorer);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig);
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('should handle registerScorer API failure', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      const serverError = new InternalServerError({});
      mockRegisterScorer.mockRejectedValue(serverError);

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await expect(
        result.current.mutateAsync({
          experimentId: mockExperimentId,
          scheduledScorers: [mockUpdatedLLMScorer],
        }),
      ).rejects.toThrow(InternalServerError);

      expect(mockRegisterScorer).toHaveBeenCalled();

      // Verify cache was not modified due to error
      const cacheAfterError = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfterError).toBeUndefined();
    });

    it('should handle partial failure when updating multiple scorers', async () => {
      // Arrange
      const scorer1 = { ...mockUpdatedLLMScorer, name: 'scorer-1' };
      const scorer2 = { ...mockUpdatedCustomCodeScorer, name: 'scorer-2' };

      const serverError = new InternalServerError({});

      // Mock first call succeeds, second call fails
      mockRegisterScorer
        .mockResolvedValueOnce({
          version: 2,
          scorer_id: 'scorer-id-1',
          experiment_id: mockExperimentId,
          name: 'scorer-1',
          serialized_scorer: '{"type": "llm"}',
          creation_time: 1234567890,
        })
        .mockRejectedValueOnce(serverError);

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await expect(
        result.current.mutateAsync({
          experimentId: mockExperimentId,
          scheduledScorers: [scorer1, scorer2],
        }),
      ).rejects.toThrow(InternalServerError);

      // Verify both registerScorer calls were made (Promise.all doesn't short-circuit)
      expect(mockRegisterScorer).toHaveBeenCalledTimes(2);

      // Verify cache was not modified due to error
      const cacheAfterError = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfterError).toBeUndefined();
    });

    it('should transform scorer config correctly before calling API', async () => {
      // Arrange
      mockRegisterScorer.mockResolvedValue(mockRegisterResponse);

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      await result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorers: [mockUpdatedLLMScorer],
      });

      // Assert - verify the transformation was applied
      const expectedTransformedConfig = transformScheduledScorer(mockUpdatedLLMScorer);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig);
      expect(mockRegisterScorer).toHaveBeenCalledTimes(1);
    });

    it('should convert responses correctly to ScorerConfig format', async () => {
      // Arrange
      const scorer1 = { ...mockUpdatedLLMScorer, name: 'scorer-1' };
      const scorer2 = { ...mockUpdatedCustomCodeScorer, name: 'scorer-2' };

      const response1: RegisterScorerResponse = {
        version: 5,
        scorer_id: 'unique-id-1',
        experiment_id: '999',
        name: 'scorer-1',
        serialized_scorer: '{"custom": "data1"}',
        creation_time: 9999999991,
      };

      const response2: RegisterScorerResponse = {
        version: 6,
        scorer_id: 'unique-id-2',
        experiment_id: '999',
        name: 'scorer-2',
        serialized_scorer: '{"custom": "data2"}',
        creation_time: 9999999992,
      };

      mockRegisterScorer.mockImplementation(async (experimentId, scorerConfig) => {
        if (scorerConfig.name === 'scorer-1') {
          return response1;
        }
        return response2;
      });

      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const response = await result.current.mutateAsync({
        experimentId: '999',
        scheduledScorers: [scorer1, scorer2],
      });

      // Assert - verify the response conversion
      expect(response.scheduled_scorers?.scorers[0]).toMatchObject({
        scorer_version: 5,
        serialized_scorer: '{"custom": "data1"}',
      });

      expect(response.scheduled_scorers?.scorers[1]).toMatchObject({
        scorer_version: 6,
        serialized_scorer: '{"custom": "data2"}',
      });
    });

    it('should handle empty scheduledScorers array', async () => {
      // Arrange
      const { result } = renderHook(() => useUpdateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const response = await result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorers: [],
      });

      // Assert
      expect(response).toMatchObject({
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [],
        },
      });

      // Verify registerScorer was not called
      expect(mockRegisterScorer).not.toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useUpdateScheduledScorer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useUpdateScheduledScorer.tsx

```typescript
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';
import type { PredefinedError } from '@databricks/web-shared/errors';
import type { ScheduledScorer, ScorerConfig } from '../types';
import { transformScheduledScorer, convertRegisterScorerResponseToConfig } from '../utils/scorerTransformUtils';
import { updateScheduledScorersCache } from './scheduledScorersCacheUtils';
import { registerScorer, type RegisterScorerResponse } from '../api';

// Define request and response types based on monitoring_service.proto
export type UpdateScheduledScorersRequest = {
  scheduled_scorers: {
    scorers: ScorerConfig[];
  };
  update_mask: {
    paths: string;
  };
};

export type UpdateScheduledScorersResponse = {
  experiment_id: string;
  scheduled_scorers?: {
    scorers: ScorerConfig[];
  };
};

export const useUpdateScheduledScorerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateScheduledScorersResponse, // TData - response type
    PredefinedError, // TError - error type (fetchOrFail throws PredefinedError)
    {
      experimentId: string;
      scheduledScorers: ScheduledScorer[];
    } // TVariables - input type
  >({
    mutationFn: async ({ experimentId, scheduledScorers }) => {
      // The backend will update if the name already exists
      const updatePromises = scheduledScorers.map(async (scorer) => {
        const scorerConfig = transformScheduledScorer(scorer);
        const registerResponse: RegisterScorerResponse = await registerScorer(experimentId, scorerConfig);
        return convertRegisterScorerResponseToConfig(registerResponse);
      });

      // Wait for all updates to complete and collect the updated configs
      const updatedScorerConfigs = await Promise.all(updatePromises);

      // Return response in expected format
      return {
        experiment_id: experimentId,
        scheduled_scorers: {
          scorers: updatedScorerConfigs,
        },
      };
    },
    onSuccess: (data, variables) => {
      updateScheduledScorersCache(queryClient, data, variables.experimentId, true);
    },
  });
};
```

--------------------------------------------------------------------------------

````

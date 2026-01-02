---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 559
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 559 of 991)

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

---[FILE: useCreateScheduledScorer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useCreateScheduledScorer.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { renderHook, waitFor } from '@testing-library/react';
import { InternalServerError } from '@databricks/web-shared/errors';
import { useCreateScheduledScorerMutation } from './useCreateScheduledScorer';
import { registerScorer, type RegisterScorerResponse } from '../api';
import { transformScheduledScorer } from '../utils/scorerTransformUtils';

// Mock external dependencies
jest.mock('../api');

const mockRegisterScorer = jest.mocked(registerScorer);

describe('useCreateScheduledScorerMutation', () => {
  let queryClient: QueryClient;
  const mockExperimentId = 'experiment-123';

  const mockLLMScorer = {
    name: 'test-llm-scorer',
    type: 'llm' as const,
    llmTemplate: 'Guidelines' as const,
    guidelines: ['Test guideline 1', 'Test guideline 2'],
    sampleRate: 50,
    filterString: 'column = "value"',
  };

  const mockCustomCodeScorer = {
    name: 'test-custom-scorer',
    type: 'custom-code' as const,
    code: 'def my_scorer(inputs, outputs):\n    return {"score": 1}',
    sampleRate: 25,
    callSignature: '',
    originalFuncName: '',
  };

  const mockRegisterResponse: RegisterScorerResponse = {
    version: 1,
    scorer_id: 'scorer-id-123',
    experiment_id: mockExperimentId,
    name: 'test-llm-scorer',
    serialized_scorer: '{"type": "llm", "guidelines": ["Test guideline 1", "Test guideline 2"]}',
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

  describe('Golden Path - Successful Operations', () => {
    it('should successfully register a new LLM scorer', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      mockRegisterScorer.mockResolvedValue(mockRegisterResponse);

      const { result } = renderHook(() => useCreateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorer: mockLLMScorer,
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
              serialized_scorer: '{"type": "llm", "guidelines": ["Test guideline 1", "Test guideline 2"]}',
            },
          ],
        },
      });

      // Verify registerScorer was called with transformed config
      const expectedTransformedConfig = transformScheduledScorer(mockLLMScorer);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig);

      // Verify cache was updated
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: expect.arrayContaining([
          expect.objectContaining({
            name: 'test-llm-scorer',
            version: 1,
          }),
        ]),
      });
    });

    it('should successfully register a new custom code scorer', async () => {
      // Arrange
      const customCodeResponse: RegisterScorerResponse = {
        version: 1,
        scorer_id: 'scorer-id-456',
        experiment_id: mockExperimentId,
        name: 'test-custom-scorer',
        serialized_scorer:
          '{"type": "custom-code", "code": "def my_scorer(inputs, outputs):\\n    return {\\"score\\": 1}"}',
        creation_time: 1234567891,
      };

      mockRegisterScorer.mockResolvedValue(customCodeResponse);

      const { result } = renderHook(() => useCreateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorer: mockCustomCodeScorer,
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
      const expectedTransformedConfig = transformScheduledScorer(mockCustomCodeScorer);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig);

      // Verify cache was updated
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: expect.arrayContaining([
          expect.objectContaining({
            name: 'test-custom-scorer',
            version: 1,
          }),
        ]),
      });
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('should handle registerScorer API failure', async () => {
      // Arrange
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      const networkError = new InternalServerError({});
      mockRegisterScorer.mockRejectedValue(networkError);

      const { result } = renderHook(() => useCreateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await expect(
        result.current.mutateAsync({
          experimentId: mockExperimentId,
          scheduledScorer: mockLLMScorer,
        }),
      ).rejects.toThrow(InternalServerError);

      expect(mockRegisterScorer).toHaveBeenCalled();

      // Verify cache was not modified due to error
      const cacheAfterError = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfterError).toBeUndefined();
    });

    it('should transform scorer config correctly before calling API', async () => {
      // Arrange
      mockRegisterScorer.mockResolvedValue(mockRegisterResponse);

      const { result } = renderHook(() => useCreateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      await result.current.mutateAsync({
        experimentId: mockExperimentId,
        scheduledScorer: mockLLMScorer,
      });

      // Assert - verify the transformation was applied
      const expectedTransformedConfig = transformScheduledScorer(mockLLMScorer);
      expect(mockRegisterScorer).toHaveBeenCalledWith(mockExperimentId, expectedTransformedConfig);
      expect(mockRegisterScorer).toHaveBeenCalledTimes(1);
    });

    it('should convert response correctly to ScorerConfig format', async () => {
      // Arrange
      const customResponse: RegisterScorerResponse = {
        version: 5,
        scorer_id: 'unique-id-789',
        experiment_id: '999',
        name: 'custom-scorer-name',
        serialized_scorer: '{"custom": "data"}',
        creation_time: 9999999999,
      };

      mockRegisterScorer.mockResolvedValue(customResponse);

      const { result } = renderHook(() => useCreateScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const response = await result.current.mutateAsync({
        experimentId: '999',
        scheduledScorer: mockLLMScorer,
      });

      // Assert - verify the response conversion
      expect(response.scheduled_scorers?.scorers[0]).toMatchObject({
        scorer_version: 5,
        serialized_scorer: '{"custom": "data"}',
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useCreateScheduledScorer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useCreateScheduledScorer.tsx

```typescript
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';
import type { PredefinedError } from '@databricks/web-shared/errors';
import type { ScheduledScorer, ScorerConfig } from '../types';
import { transformScheduledScorer, convertRegisterScorerResponseToConfig } from '../utils/scorerTransformUtils';
import { updateScheduledScorersCache } from './scheduledScorersCacheUtils';
import { registerScorer, type RegisterScorerResponse } from '../api';

// Define request and response types based on monitoring_service.proto
export type CreateScheduledScorersRequest = {
  scheduled_scorers: {
    scorers: ScorerConfig[];
  };
};

export type CreateScheduledScorersResponse = {
  experiment_id: string;
  scheduled_scorers?: {
    scorers: ScorerConfig[];
  };
};

export const useCreateScheduledScorerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateScheduledScorersResponse, // TData - response type
    PredefinedError, // TError - error type (fetchOrFail throws PredefinedError)
    { experimentId: string; scheduledScorer: ScheduledScorer } // TVariables - input type
  >({
    mutationFn: async ({ experimentId, scheduledScorer }) => {
      // Transform the scorer to backend format
      const scorerConfig = transformScheduledScorer(scheduledScorer);

      // Register the single scorer using the register endpoint
      const registerResponse: RegisterScorerResponse = await registerScorer(experimentId, scorerConfig);

      // Convert the register response to ScorerConfig
      const createdScorerConfig = convertRegisterScorerResponseToConfig(registerResponse);

      return {
        experiment_id: experimentId,
        scheduled_scorers: {
          scorers: [createdScorerConfig],
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

---[FILE: useDeleteScheduledScorer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useDeleteScheduledScorer.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { renderHook, waitFor } from '@testing-library/react';
import { InternalServerError } from '@databricks/web-shared/errors';
import { useDeleteScheduledScorerMutation } from './useDeleteScheduledScorer';
import { deleteScheduledScorers } from '../api';

// Mock external dependencies
jest.mock('../api');

const mockDeleteScheduledScorers = jest.mocked(deleteScheduledScorers);

describe('useDeleteScheduledScorerMutation', () => {
  let queryClient: QueryClient;

  const mockExperimentId = 'experiment-123';

  const mockScorerConfig1 = {
    scorer_name: 'test-scorer-1',
    serialized_scorer: '{"name": "test-scorer-1"}',
    sample_rate: 0.5,
    filter_string: 'column = "value1"',
    scorer_version: 1,
  };

  const mockScorerConfig2 = {
    scorer_name: 'test-scorer-2',
    serialized_scorer: '{"name": "test-scorer-2"}',
    sample_rate: 0.25,
    filter_string: 'column = "value2"',
    scorer_version: 1,
  };

  const mockDeleteAllResponse = {
    experiment_id: mockExperimentId,
    scheduled_scorers: {
      scorers: [],
    },
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

  describe('Golden Path - Successful Operations', () => {
    it('should successfully delete all scorers when no scorerNames provided', async () => {
      // Arrange - Set up initial cache with scorers
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
        ],
      });

      mockDeleteScheduledScorers.mockResolvedValue(mockDeleteAllResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;
      expect(response).toEqual(mockDeleteAllResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, undefined);

      // Verify cache was invalidated (not set to empty array)
      // The cache should be marked as stale for refetching
      const cacheState = queryClient.getQueryState(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheState?.isInvalidated).toBe(true);
    });

    it('should successfully delete all scorers when empty scorerNames array provided', async () => {
      // Arrange - Set up initial cache with scorers
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
        ],
      });

      mockDeleteScheduledScorers.mockResolvedValue(mockDeleteAllResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scorerNames: [],
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;
      expect(response).toEqual(mockDeleteAllResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, []);

      // Verify cache was invalidated
      const cacheState = queryClient.getQueryState(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheState?.isInvalidated).toBe(true);
    });

    it('should successfully delete specific scorers and update cache', async () => {
      // Arrange - Set up initial cache with two scorers
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
        ],
      });

      const expectedDeleteResponse = {
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [mockScorerConfig2],
        },
      };

      mockDeleteScheduledScorers.mockResolvedValue(expectedDeleteResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scorerNames: ['test-scorer-1'],
      });

      // Assert
      const response = await mutationPromise;
      expect(response).toEqual(expectedDeleteResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, ['test-scorer-1']);

      // Verify cache was updated with only the remaining scorer
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
        ],
      });
    });

    it('should delete multiple specific scorers and update cache', async () => {
      // Arrange - Set up initial cache with three scorers
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
          {
            name: 'test-scorer-3',
            type: 'custom-code',
            sampleRate: 75,
            filterString: 'column = "value3"',
            code: '',
            version: 1,
          },
        ],
      });

      const expectedDeleteResponse = {
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [mockScorerConfig2],
        },
      };

      mockDeleteScheduledScorers.mockResolvedValue(expectedDeleteResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act - Delete scorer-1 and scorer-3, leaving scorer-2
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scorerNames: ['test-scorer-1', 'test-scorer-3'],
      });

      // Assert
      const response = await mutationPromise;
      expect(response).toEqual(expectedDeleteResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, ['test-scorer-1', 'test-scorer-3']);

      // Verify cache was updated with only scorer-2
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
        ],
      });
    });

    it('should handle deletion when cache does not exist', async () => {
      // Arrange - No initial cache set
      const initialCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(initialCache).toBeUndefined();

      mockDeleteScheduledScorers.mockResolvedValue(mockDeleteAllResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scorerNames: ['test-scorer-1'],
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;
      expect(response).toEqual(mockDeleteAllResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, ['test-scorer-1']);

      // When there's no existing cache, removeScheduledScorersFromCache invalidates the query
      // but invalidation on a non-existent cache doesn't create a cache entry
      // Just verify that the operation completed successfully without error
      const cacheAfter = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfter).toBeUndefined();
    });

    it('should handle deletion when scorer names do not match existing scorers', async () => {
      // Arrange - Set up initial cache with two scorers
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
        ],
      });

      const mockExistingScorersResponse = {
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [mockScorerConfig1, mockScorerConfig2],
        },
      };

      // Backend returns all scorers unchanged when deleting non-existent scorer
      mockDeleteScheduledScorers.mockResolvedValue(mockExistingScorersResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const mutationPromise = result.current.mutateAsync({
        experimentId: mockExperimentId,
        scorerNames: ['non-existent-scorer'],
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const response = await mutationPromise;
      expect(response).toEqual(mockExistingScorersResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, ['non-existent-scorer']);

      // Verify cache still has both scorers (nothing was deleted)
      const updatedCache = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(updatedCache).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
          {
            name: 'test-scorer-2',
            type: 'custom-code',
            sampleRate: 25,
            filterString: 'column = "value2"',
            code: '',
            version: 1,
          },
        ],
      });
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('should handle deleteScheduledScorers API failure when deleting specific scorers', async () => {
      // Arrange - Set up initial cache
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
        ],
      });

      const networkError = new InternalServerError({});
      mockDeleteScheduledScorers.mockRejectedValue(networkError);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await expect(
        result.current.mutateAsync({
          experimentId: mockExperimentId,
          scorerNames: ['test-scorer-1'],
        }),
      ).rejects.toThrow(InternalServerError);

      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, ['test-scorer-1']);

      // Verify cache was not modified due to error
      const cacheAfterError = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfterError).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
        ],
      });
    });

    it('should handle deleteScheduledScorers API failure when deleting all scorers', async () => {
      // Arrange - Set up initial cache
      queryClient.setQueryData(['mlflow', 'scheduled-scorers', mockExperimentId], {
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
        ],
      });

      const deleteError = new InternalServerError({});
      mockDeleteScheduledScorers.mockRejectedValue(deleteError);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act & Assert
      await expect(
        result.current.mutateAsync({
          experimentId: mockExperimentId,
        }),
      ).rejects.toThrow(InternalServerError);

      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, undefined);

      // Verify cache was not modified due to error
      const cacheAfterError = queryClient.getQueryData(['mlflow', 'scheduled-scorers', mockExperimentId]);
      expect(cacheAfterError).toEqual({
        experimentId: mockExperimentId,
        scheduledScorers: [
          {
            name: 'test-scorer-1',
            type: 'custom-code',
            sampleRate: 50,
            filterString: 'column = "value1"',
            code: '',
            version: 1,
          },
        ],
      });
    });

    it('should return response correctly', async () => {
      // Arrange
      const customResponse = {
        experiment_id: mockExperimentId,
        scheduled_scorers: {
          scorers: [mockScorerConfig1],
        },
      };

      mockDeleteScheduledScorers.mockResolvedValue(customResponse);

      const { result } = renderHook(() => useDeleteScheduledScorerMutation(), {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
      });

      // Act
      const response = await result.current.mutateAsync({
        experimentId: mockExperimentId,
        scorerNames: ['test-scorer-2'],
      });

      // Assert - verify the response is returned as-is
      expect(response).toEqual(customResponse);
      expect(mockDeleteScheduledScorers).toHaveBeenCalledWith(mockExperimentId, ['test-scorer-2']);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useDeleteScheduledScorer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/hooks/useDeleteScheduledScorer.tsx

```typescript
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';
import type { PredefinedError } from '@databricks/web-shared/errors';
import type { ScorerConfig } from '../types';
import { removeScheduledScorersFromCache } from './scheduledScorersCacheUtils';
import { deleteScheduledScorers } from '../api';

// Define response types based on monitoring_service.proto
export type DeleteScheduledScorersResponse = {
  experiment_id: string;
  scheduled_scorers?: {
    scorers: ScorerConfig[];
  };
};

export const useDeleteScheduledScorerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteScheduledScorersResponse, // TData - response type
    PredefinedError, // TError - error type (fetchOrFail throws PredefinedError)
    {
      experimentId: string;
      scorerNames?: string[]; // If provided, delete only specific scorers. If not provided, delete all scorers.
    } // TVariables - input type
  >({
    mutationFn: async ({ experimentId, scorerNames }) => {
      return await deleteScheduledScorers(experimentId, scorerNames);
    },
    onSuccess: (data, variables) => {
      removeScheduledScorersFromCache(queryClient, variables.experimentId, variables.scorerNames);
    },
  });
};
```

--------------------------------------------------------------------------------

````

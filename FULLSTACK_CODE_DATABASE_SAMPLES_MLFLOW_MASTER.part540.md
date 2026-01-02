---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 540
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 540 of 991)

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

---[FILE: useActiveExperimentSpan.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useActiveExperimentSpan.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useActiveExperimentSpan } from './useActiveExperimentSpan';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

jest.mock('../../../../common/utils/RoutingUtils', () => ({
  useSearchParams: jest.fn(),
}));

describe('useActiveExperimentSpan', () => {
  let mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = jest.fn((setter) => {
    // @ts-expect-error 'setter' is of type 'unknown'
    mockSearchParams = setter(mockSearchParams);
  });

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    jest.clearAllMocks();
    jest.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  test('should return selectedSpanId', () => {
    jest
      .mocked(useSearchParams)
      .mockReturnValue([new URLSearchParams({ selectedSpanId: 'span-initial' }), mockSetSearchParams]);

    const {
      result: {
        current: [resultSpanId],
      },
    } = renderHook(() => useActiveExperimentSpan());

    expect(resultSpanId).toEqual('span-initial');
  });

  test('should set selectedSpanId to undefined', () => {
    const {
      result: {
        current: [, setSelectedSpanId],
      },
    } = renderHook(() => useActiveExperimentSpan());

    act(() => {
      setSelectedSpanId(undefined);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedSpanId')).toBeNull();
  });

  test('should set selectedSpanId to a value', () => {
    const {
      result: {
        current: [, setSelectedSpanId],
      },
    } = renderHook(() => useActiveExperimentSpan());

    act(() => {
      setSelectedSpanId('span-12345');
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedSpanId')).toEqual('span-12345');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useActiveExperimentSpan.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useActiveExperimentSpan.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'selectedSpanId';

/**
 * Query param-powered hook that returns the currently selected span ID and a function to set the selected span ID.
 * To be used in traces page components.
 */
export const useActiveExperimentSpan = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSpanId = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setSelectedSpanId = useCallback(
    (selectedSpanId: string | undefined) => {
      setSearchParams(
        (params) => {
          if (selectedSpanId === undefined) {
            params.delete(QUERY_PARAM_KEY);
            return params;
          }
          params.set(QUERY_PARAM_KEY, selectedSpanId);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [selectedSpanId, setSelectedSpanId] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useActiveExperimentTrace.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useActiveExperimentTrace.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useActiveExperimentTrace } from './useActiveExperimentTrace';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

jest.mock('../../../../common/utils/RoutingUtils', () => ({
  useSearchParams: jest.fn(),
}));

describe('useActiveExperimentTrace', () => {
  let mockSearchParams = new URLSearchParams();
  const mockSetSearchParams = jest.fn((setter) => {
    // @ts-expect-error 'setter' is of type 'unknown'
    mockSearchParams = setter(mockSearchParams);
  });

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    jest.clearAllMocks();
    jest.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  test('should return selectedTraceId', () => {
    jest
      .mocked(useSearchParams)
      .mockReturnValue([new URLSearchParams({ selectedTraceId: 'tr-initial' }), mockSetSearchParams]);

    const {
      result: {
        current: [resultTraceId],
      },
    } = renderHook(() => useActiveExperimentTrace());

    expect(resultTraceId).toEqual('tr-initial');
  });

  test('should set selectedTraceId to undefined', () => {
    const {
      result: {
        current: [, setSelectedTraceId],
      },
    } = renderHook(() => useActiveExperimentTrace());

    act(() => {
      setSelectedTraceId(undefined);
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedTraceId')).toBeNull();
  });

  test('should set selectedTraceId to a value', () => {
    const {
      result: {
        current: [, setSelectedTraceId],
      },
    } = renderHook(() => useActiveExperimentTrace());

    act(() => {
      setSelectedTraceId('tr-12345');
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSearchParams.get('selectedTraceId')).toEqual('tr-12345');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useActiveExperimentTrace.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useActiveExperimentTrace.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'selectedTraceId';

/**
 * Query param-powered hook that returns the currently selected trace ID and a function to set the selected trace ID.
 * To be used in traces page components.
 */
export const useActiveExperimentTrace = () => {
  // TODO(ML-40722): Create separate UI route for traces page and use route params instead of search params
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTraceId = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setSelectedTraceId = useCallback(
    (selectedTraceId: string | undefined) => {
      setSearchParams((params) => {
        if (selectedTraceId === undefined) {
          params.delete(QUERY_PARAM_KEY);
          return params;
        }
        params.set(QUERY_PARAM_KEY, selectedTraceId);
        return params;
      });
    },
    [setSearchParams],
  );

  return [selectedTraceId, setSelectedTraceId] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useEditExperimentTraceTags.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useEditExperimentTraceTags.test.tsx

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { useEditExperimentTraceTags } from './useEditExperimentTraceTags';
import { renderWithIntl, screen, within } from '../../../../common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';
import { MlflowService } from '../../../sdk/MlflowService';
import { DesignSystemProvider } from '@databricks/design-system';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larger timeout for integration testing (form rendering)

const mockTraceInfo: ModelTraceInfoV3 = {
  trace_id: 'tr-1',
  client_request_id: 'tr-1',
  tags: { 'existing-tag': 'existing-value' },
  trace_location: {} as any,
  request_time: '0',
  state: 'OK',
  trace_metadata: {},
};

describe('useEditExperimentTraceTag', () => {
  function renderTestComponent(trace: ModelTraceInfoV3, useV3Apis = false) {
    function TestComponent() {
      const { showEditTagsModalForTrace, EditTagsModal } = useEditExperimentTraceTags({
        onSuccess: jest.fn(),
      });
      return (
        <>
          <button onClick={() => showEditTagsModalForTrace(trace)}>trigger button</button>
          {EditTagsModal}
        </>
      );
    }
    const { rerender } = renderWithIntl(
      <DesignSystemProvider>
        <TestComponent />
      </DesignSystemProvider>,
    );
    return {
      rerender: () =>
        rerender(
          <DesignSystemProvider>
            <TestComponent />
          </DesignSystemProvider>,
        ),
    };
  }

  test('it should properly add tag with key and value with v3 apis', async () => {
    // Mock the service functions
    jest.spyOn(MlflowService, 'setExperimentTraceTagV3').mockImplementation(() => Promise.resolve({}));
    jest.spyOn(MlflowService, 'deleteExperimentTraceTagV3').mockImplementation(() => Promise.resolve({}));

    // Mock v2 apis to throw an error
    jest.spyOn(MlflowService, 'setExperimentTraceTag').mockImplementation(() => {
      throw new Error('Should not be called');
    });
    jest.spyOn(MlflowService, 'deleteExperimentTraceTag').mockImplementation(() => {
      throw new Error('Should not be called');
    });

    // Render the component
    renderTestComponent(mockTraceInfo, true);

    // Click on the trigger button
    await userEvent.click(screen.getByRole('button', { name: 'trigger button' }));

    // Expect the modal to be shown
    expect(screen.getByRole('dialog', { name: /Add\/Edit tags/ })).toBeInTheDocument();

    // Fill out the form
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('combobox'));
    await userEvent.type(within(screen.getByRole('dialog')).getByRole('combobox'), 'newtag');
    await userEvent.click(screen.getByText(/Add tag "newtag"/));
    await userEvent.type(screen.getByLabelText('Value'), 'newvalue');

    // Add the tag
    await userEvent.click(screen.getByLabelText('Add tag'));

    // Remove the existing tag
    await userEvent.click(within(screen.getByRole('status', { name: 'existing-tag' })).getByRole('button'));

    // Finally, save the tags
    await userEvent.click(screen.getByRole('button', { name: 'Save tags' }));

    // We expect one new tag to be added
    expect(MlflowService.setExperimentTraceTagV3).toHaveBeenCalledTimes(1);
    expect(MlflowService.setExperimentTraceTagV3).toHaveBeenCalledWith('tr-1', 'newtag', 'newvalue');

    // We expect one existing tag to be deleted
    expect(MlflowService.deleteExperimentTraceTagV3).toHaveBeenCalledTimes(1);
    expect(MlflowService.deleteExperimentTraceTagV3).toHaveBeenCalledWith('tr-1', 'existing-tag');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEditExperimentTraceTags.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useEditExperimentTraceTags.tsx
Signals: React

```typescript
import type { ModelTraceInfo, ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { useEditKeyValueTagsModal } from '../../../../common/hooks/useEditKeyValueTagsModal';
import { MlflowService } from '../../../sdk/MlflowService';
import type { KeyValueEntity } from '../../../../common/types';
import { useCallback } from 'react';
import { MLFLOW_INTERNAL_PREFIX } from '../../../../common/utils/TagUtils';

type EditedModelTrace = {
  traceRequestId: string;
  tags: KeyValueEntity[];
};

export const useEditExperimentTraceTags = ({
  onSuccess,
  existingTagKeys = [],
}: {
  onSuccess?: () => void;
  existingTagKeys?: string[];
}) => {
  const { showEditTagsModal, EditTagsModal } = useEditKeyValueTagsModal<EditedModelTrace>({
    saveTagsHandler: async (editedEntity, existingTags, newTags) => {
      if (!editedEntity.traceRequestId) {
        return;
      }
      const requestId = editedEntity.traceRequestId;
      // First, determine new tags to be added
      const addedOrModifiedTags = newTags.filter(
        ({ key: newTagKey, value: newTagValue }) =>
          !existingTags.some(
            ({ key: existingTagKey, value: existingTagValue }) =>
              existingTagKey === newTagKey && newTagValue === existingTagValue,
          ),
      );

      // Next, determine those to be deleted
      const deletedTags = existingTags.filter(
        ({ key: existingTagKey }) => !newTags.some(({ key: newTagKey }) => existingTagKey === newTagKey),
      );

      // Fire all requests at once
      const updateRequests = Promise.all([
        ...addedOrModifiedTags.map(({ key, value }) => MlflowService.setExperimentTraceTagV3(requestId, key, value)),
        ...deletedTags.map(({ key }) => MlflowService.deleteExperimentTraceTagV3(requestId, key)),
      ]);

      return updateRequests;
    },
    valueRequired: true,
    allAvailableTags: existingTagKeys.filter((tagKey) => tagKey && !tagKey.startsWith(MLFLOW_INTERNAL_PREFIX)),
    onSuccess: onSuccess,
  });

  const showEditTagsModalForTrace = useCallback(
    (trace: ModelTraceInfoV3) => {
      if (!trace.trace_id) {
        return;
      }
      const tagsArray = Object.entries(trace.tags ?? {}).map(([key, value]) => ({ key, value }));
      const visibleTags = tagsArray.filter(({ key }) => key && !key.startsWith(MLFLOW_INTERNAL_PREFIX)) || [];
      showEditTagsModal({
        traceRequestId: trace.trace_id,
        tags: visibleTags || [],
      });
    },
    [showEditTagsModal],
  );

  return {
    showEditTagsModalForTrace,
    EditTagsModal,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentContainsTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentContainsTraces.tsx

```typescript
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MlflowService } from '../../../sdk/MlflowService';
import { isEmpty } from 'lodash';
import invariant from 'invariant';

const QUERY_KEY = 'EXPERIMENT_CONTAINS_TRACES';

/**
 * Hook for checking if there are any traces for a given experiment.
 * Returns `containsTraces` set to `true` if there's at least one trace, `false` otherwise.
 */
export const useExperimentContainsTraces = ({
  experimentId,
  enabled,
}: {
  experimentId?: string;
  enabled?: boolean;
}) => {
  const { data, isLoading } = useQuery(
    [QUERY_KEY, experimentId],
    async () => {
      invariant(experimentId, 'experimentId is required');
      const experimentIds = [experimentId];

      return MlflowService.getExperimentTraces(experimentIds, 'timestamp_ms DESC', undefined, undefined, 1);
    },
    {
      enabled: enabled && Boolean(experimentId),
    },
  );

  const containsTraces = !isLoading && !isEmpty(data?.traces);
  return {
    containsTraces,
    isLoading: isLoading && enabled && Boolean(experimentId),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentContainsTrainingRuns.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentContainsTrainingRuns.tsx
Signals: React

```typescript
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MlflowService } from '../../../sdk/MlflowService';
import { isEmpty } from 'lodash';
import invariant from 'invariant';
import { useMemo } from 'react';

const QUERY_KEY = 'EXPERIMENT_CONTAINS_TRAINING_RUNS';

/**
 * Hook for checking if there are any runs in a given experiment.
 * Returns `containsRuns` set to `true` if there's at least one run, `false` otherwise.
 */
export const useExperimentContainsTrainingRuns = ({
  experimentId,
  enabled,
}: {
  experimentId?: string;
  enabled?: boolean;
}) => {
  const { data, isLoading, error } = useQuery(
    [QUERY_KEY, experimentId],
    async () => {
      invariant(experimentId, 'experimentId is required');
      const experimentIds = [experimentId];

      const ret = await MlflowService.searchRuns({
        experiment_ids: experimentIds,
        max_results: 1,
      });

      return ret;
    },
    {
      enabled: Boolean(experimentId) && enabled,
    },
  );

  const containsRuns = useMemo(() => !isLoading && !isEmpty(data?.runs), [isLoading, data]);

  return {
    containsRuns,
    isLoading: isLoading && enabled && Boolean(experimentId),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentTraceData.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentTraceData.test.tsx

```typescript
import { describe, afterEach, jest, test, expect } from '@jest/globals';
import { renderHook, cleanup, waitFor } from '@testing-library/react';
import { MlflowService } from '../../../sdk/MlflowService';
import { ModelSpanType, ModelTraceStatus, type ModelTraceData } from '@databricks/web-shared/model-trace-explorer';
import { useExperimentTraceData } from './useExperimentTraceData';
import Utils from '../../../../common/utils/Utils';

const testRequestId = 'tr-trace-1';

const mockTraceData: ModelTraceData = {
  spans: [
    {
      name: 'test-span',
      start_time: 0,
      end_time: 1,
      status: {
        status_code: 1,
        description: 'OK',
      },
      context: {
        span_id: 'span-1',
        trace_id: testRequestId,
      },
      parent_span_id: null,
      span_type: 'test-span-type',
      type: ModelSpanType.FUNCTION,
    },
  ],
};

const mockMangledTraceData: any = {
  spans: { something: ['very', 'wrong'] },
};

describe('useExperimentTraceData', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  const renderTestHook = (skip?: boolean) => renderHook(() => useExperimentTraceData(testRequestId, skip));
  test('fetches trace data', async () => {
    jest.spyOn(MlflowService, 'getExperimentTraceData').mockImplementation(() => Promise.resolve(mockTraceData));

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook();
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the traces are fetched correctly.
    expect(result.current.traceData).toBeDefined();
    expect(result.current.traceData).toEqual(mockTraceData);
  });

  test('returns error when necessary', async () => {
    jest
      .spyOn(MlflowService, 'getExperimentTraceData')
      .mockImplementation(() => Promise.reject(new Error('Some error')));

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook();
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toEqual('Some error');
  });

  test('shows error when data is badly formatted', async () => {
    jest.spyOn(MlflowService, 'getExperimentTraceData').mockImplementation(() => Promise.resolve(mockMangledTraceData));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Utils, 'logErrorAndNotifyUser');

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook();
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    expect(Utils.logErrorAndNotifyUser).toHaveBeenCalled();
  });

  test("doesn't dispatch a network request if skip argument is provided", async () => {
    jest.spyOn(MlflowService, 'getExperimentTraceData');
    renderTestHook(true);
    expect(MlflowService.getExperimentTraceData).not.toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentTraceData.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentTraceData.tsx
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react';
import { MlflowService } from '../../../sdk/MlflowService';
import { ModelTraceStatus, type ModelTraceData } from '@databricks/web-shared/model-trace-explorer';
import Utils from '../../../../common/utils/Utils';

export const useExperimentTraceData = (traceId?: string, skip = false) => {
  const [traceData, setTraceData] = useState<ModelTraceData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchTraceData = useCallback(async (traceId: string) => {
    setLoading(true);
    try {
      const response = await MlflowService.getExperimentTraceData(traceId);

      if (Array.isArray(response.spans)) {
        setTraceData(response);
      } else {
        // Not a showstopper, but we should log this error and notify the user.
        Utils.logErrorAndNotifyUser('Invalid trace data response: ' + JSON.stringify(response?.toString()));
      }
    } catch (e: any) {
      setError(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (traceId && !skip) {
      fetchTraceData(traceId);
    }
  }, [fetchTraceData, traceId, skip]);

  return { traceData, loading, error };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentTraceInfo.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentTraceInfo.tsx
Signals: React

```typescript
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { useCallback, useEffect, useState } from 'react';
import { MlflowService } from '../../../sdk/MlflowService';

/**
 * Fetches single trace info object for a given trace request ID.
 */
export const useExperimentTraceInfo = (requestId: string, enabled = true) => {
  const [traceInfo, setTraceInfoData] = useState<ModelTraceInfo | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchTraceInfo = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setError(undefined);

    try {
      const response = await MlflowService.getExperimentTraceInfo(requestId);

      if (!response.trace_info) {
        setTraceInfoData(undefined);
        return;
      }

      setTraceInfoData(response.trace_info);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [enabled, requestId]);

  useEffect(() => {
    fetchTraceInfo();
  }, [fetchTraceInfo]);

  return {
    traceInfo,
    loading,
    error,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentTraces.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/hooks/useExperimentTraces.test.tsx

```typescript
import { describe, afterEach, test, jest, expect } from '@jest/globals';
import { renderHook, cleanup, waitFor, act } from '@testing-library/react';
import { useExperimentTraces } from './useExperimentTraces';
import { MlflowService } from '../../../sdk/MlflowService';
import { type ModelTraceInfo } from '@databricks/web-shared/model-trace-explorer';
import { first, last } from 'lodash';
import type { KeyValueEntity } from '../../../../common/types';

const testExperimentId = 'some-experiment-id';
const testExperimentIds = [testExperimentId];

const generateMockTrace = (uniqueId: string, timestampMs = 100, metadata: KeyValueEntity[] = []): ModelTraceInfo => ({
  request_id: `tr-${uniqueId}`,
  experiment_id: testExperimentId,
  timestamp_ms: 1712134300000 + timestampMs,
  execution_time_ms: timestampMs,
  status: 'OK',
  attributes: {},
  request_metadata: [...metadata],
  tags: [],
});

const pagesCount = 3;

describe('useExperimentTraces', () => {
  afterEach(() => {
    cleanup();
  });

  const renderTestHook = (
    filter = '',
    sorting: {
      id: string;
      desc: boolean;
    }[] = [],
    runUuid?: string,
  ) =>
    renderHook(() =>
      useExperimentTraces({
        experimentIds: testExperimentIds,
        filter,
        sorting,
        runUuid,
      }),
    );
  test('fetches traces and navigates through pages', async () => {
    // Mocking the getExperimentTraces function to return 100 traces per page.
    // We will use simple {"page": 1} token to simulate pagination.
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation((_, __, token) => {
      const page = token ? JSON.parse(token).page : 1;
      const traces = new Array(100).fill(0).map((_, i) => generateMockTrace(`trace-page${page}-${i + 1}`, i));
      const next_page_token = page < pagesCount ? JSON.stringify({ page: page + 1 }) : undefined;
      return Promise.resolve({ traces, next_page_token });
    });

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook();
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the traces are fetched correctly.
    expect(first(result.current.traces)?.request_id).toEqual('tr-trace-page1-1');
    expect(last(result.current.traces)?.request_id).toEqual('tr-trace-page1-100');
    expect(result.current.error).toEqual(undefined);

    // Check that the pagination works correctly.
    expect(result.current.hasPreviousPage).toEqual(false);
    expect(result.current.hasNextPage).toEqual(true);

    // Fetch the next page and check that the traces are updated.
    await act(async () => {
      result.current.fetchNextPage();
    });

    expect(first(result.current.traces)?.request_id).toEqual('tr-trace-page2-1');
    expect(last(result.current.traces)?.request_id).toEqual('tr-trace-page2-100');

    // Fetch the previous page and check that the traces are updated.
    await act(async () => {
      result.current.fetchPrevPage();
    });

    expect(first(result.current.traces)?.request_id).toEqual('tr-trace-page1-1');
    expect(last(result.current.traces)?.request_id).toEqual('tr-trace-page1-100');

    // Move to the last page and check that the pagination is correct.
    await act(async () => {
      result.current.fetchNextPage();
    });
    await act(async () => {
      result.current.fetchNextPage();
    });

    expect(first(result.current.traces)?.request_id).toEqual('tr-trace-page3-1');
    expect(last(result.current.traces)?.request_id).toEqual('tr-trace-page3-100');

    expect(result.current.hasPreviousPage).toEqual(true);
    expect(result.current.hasNextPage).toEqual(false);
  });

  test('navigates through pages maintaining the same sort by value', async () => {
    // Mocking the getExperimentTraces function to return 100 traces per page.
    // We will use simple {"page": 1} token to simulate pagination.
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation((_, __, token) => {
      const page = token ? JSON.parse(token).page : 1;
      const traces = new Array(100).fill(0).map((_, i) => generateMockTrace(`trace-page${page}-${i + 1}`, i));
      const next_page_token = page < pagesCount ? JSON.stringify({ page: page + 1 }) : undefined;
      return Promise.resolve({ traces, next_page_token });
    });

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook('', [{ id: 'timestamp_ms', desc: false }]);
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    expect(MlflowService.getExperimentTraces).toHaveBeenLastCalledWith(
      ['some-experiment-id'],
      'timestamp_ms ASC',
      undefined,
      '',
    );

    // Fetch the next page and check that the traces are updated.
    await act(async () => {
      result.current.fetchNextPage();
    });

    expect(MlflowService.getExperimentTraces).toHaveBeenLastCalledWith(
      ['some-experiment-id'],
      'timestamp_ms ASC',
      '{"page":2}',
      '',
    );
  });

  test('returns error when necessary', async () => {
    // Mocking the getExperimentTraces function to return 100 traces per page.
    // On the second page, we will return an error.
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation((_, __, token) => {
      if (token) {
        return Promise.reject(new Error('Some error'));
      }
      const traces = new Array(100).fill(0).map((_, i) => generateMockTrace(`trace-${i + 1}`, i));
      return Promise.resolve({ traces, next_page_token: 'some-token' });
    });

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook();

    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the traces are fetched correctly.
    expect(first(result.current.traces)?.request_id).toEqual('tr-trace-1');
    expect(last(result.current.traces)?.request_id).toEqual('tr-trace-100');

    // Check that the pagination works correctly.
    expect(result.current.error).toEqual(undefined);
    expect(result.current.hasPreviousPage).toEqual(false);
    expect(result.current.hasNextPage).toEqual(true);

    // Fetch the next page and check that the error is returned.
    await act(async () => {
      result.current.fetchNextPage();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toEqual('Some error');
  });

  test('requests for run names', async () => {
    jest.spyOn(MlflowService, 'searchRuns').mockImplementation(
      async () =>
        ({
          runs: [
            {
              info: {
                runUuid: 'run-1',
                runName: 'A run number one',
              },
            },
          ],
        } as any),
    );

    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation((_, __, token) => {
      const traces = [
        // First two traces reference the same run, third trace references another one, last one does not have any run
        generateMockTrace('trace-1', 0, [{ key: 'mlflow.sourceRun', value: 'run-1' }]),
        generateMockTrace('trace-2', 0, [{ key: 'mlflow.sourceRun', value: 'run-1' }]),
        generateMockTrace('trace-3', 0, [{ key: 'mlflow.sourceRun', value: 'run-2' }]),
        generateMockTrace('trace-4', 0),
      ];
      return Promise.resolve({ traces });
    });

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook();

    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    const getTraceById = (id: string) => result.current.traces.find((trace) => trace.request_id === id);

    // First two traces reference to the actual run
    expect(getTraceById('tr-trace-1')?.runName).toEqual('A run number one');
    expect(getTraceById('tr-trace-2')?.runName).toEqual('A run number one');

    // Third trace references to the nonexistent run so the run ID is used instead of the name
    expect(getTraceById('tr-trace-3')?.runName).toEqual('run-2');

    // Last trace does not reference to any run
    expect(getTraceById('tr-trace-4')?.runName).toEqual(undefined);
  });

  test('sends proper filter query', async () => {
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation(() => Promise.resolve({ traces: [] }));

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook('tags.test_tag="xyz"');
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the trace API is called with the correct filter query.
    expect(MlflowService.getExperimentTraces).toHaveBeenCalledWith(
      testExperimentIds,
      expect.anything(),
      undefined,
      'tags.test_tag="xyz"',
    );
  });

  test('does correct run ID filtering', async () => {
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation(() => Promise.resolve({ traces: [] }));

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook(undefined, undefined, 'test-run-id');
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the trace API is called with the correct filter query.
    expect(MlflowService.getExperimentTraces).toHaveBeenLastCalledWith(
      testExperimentIds,
      expect.anything(),
      undefined,
      "request_metadata.`mlflow.sourceRun`='test-run-id'",
    );
  });

  test('sends proper filter query with run ID filtering', async () => {
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation(() => Promise.resolve({ traces: [] }));

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook('tags.test_tag="xyz"', undefined, 'test-run-id');
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the trace API is called with the correct filter query.
    expect(MlflowService.getExperimentTraces).toHaveBeenLastCalledWith(
      testExperimentIds,
      expect.anything(),
      undefined,
      'tags.test_tag="xyz" AND request_metadata.`mlflow.sourceRun`=\'test-run-id\'',
    );
  });

  test('sends proper sorting query', async () => {
    jest.spyOn(MlflowService, 'getExperimentTraces').mockImplementation(() => Promise.resolve({ traces: [] }));

    // Render the hook and wait for the traces to be fetched.
    const { result } = renderTestHook('tags.test_tag="xyz"', [{ id: 'timestamp_ms', desc: false }]);
    await waitFor(() => {
      expect(result.current.loading).toEqual(false);
    });

    // Check that the trace API is called with the correct filter query.
    expect(MlflowService.getExperimentTraces).toHaveBeenCalledWith(
      testExperimentIds,
      'timestamp_ms ASC',
      undefined,
      'tags.test_tag="xyz"',
    );
  });
});
```

--------------------------------------------------------------------------------

````

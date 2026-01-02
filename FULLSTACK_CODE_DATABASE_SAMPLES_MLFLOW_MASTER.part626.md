---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 626
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 626 of 991)

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

---[FILE: useGenAITracesUIState.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGenAITracesUIState.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useCallback, useMemo } from 'react';

import { useLocalStorage } from '@databricks/web-shared/hooks';

import {
  EXECUTION_DURATION_COLUMN_ID,
  SOURCE_COLUMN_ID,
  STATE_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
} from './useTableColumns';
import type { TracesTableColumn } from '../types';
import { TracesTableColumnType } from '../types';

export interface GenAITracesUIState {
  /**
   * A map of column ids to boolean values.
   * If a column id is present in the map, the column is hidden if the value is false, and visible if the value is true.
   */
  columnOverrides: Record<string, boolean>;
}

const DEFAULT_MAX_VISIBLE_COLUMNS = 10;

const LOCAL_STORAGE_KEY = 'genaiTracesUIState-columns';
const LOCAL_STORAGE_VERSION = 1;

const toVisibleColumnsFromHiddenColumns = (hiddenColumns: string[], allColumns: TracesTableColumn[]) => {
  return allColumns.filter((col) => !hiddenColumns.includes(col.id));
};

const toHiddenColumnsFromVisibleColumns = (visibleColumns: TracesTableColumn[], allColumns: TracesTableColumn[]) => {
  return allColumns.filter((col) => !visibleColumns.includes(col)).map((col) => col.id);
};

// This function adjusts the hidden columns to ensure that the number of visible columns is at most DEFAULT_MAX_VISIBLE_COLUMNS
// If over the limit, it removes assessment columns until the limit is met.
const adjustHiddenColumns = (hiddenColumns: string[], allColumns: TracesTableColumn[]): string[] => {
  let visibleColumns = toVisibleColumnsFromHiddenColumns(hiddenColumns, allColumns);
  if (visibleColumns.length > DEFAULT_MAX_VISIBLE_COLUMNS) {
    const assessmentColumns = visibleColumns.filter((col) => col.type === TracesTableColumnType.ASSESSMENT);
    const nonAssessmentColumns = visibleColumns.filter((col) => col.type !== TracesTableColumnType.ASSESSMENT);

    // Calculate how many assessment columns we need to remove
    const columnsToRemove = visibleColumns.length - DEFAULT_MAX_VISIBLE_COLUMNS;
    const assessmentColumnsToKeep = Math.max(0, assessmentColumns.length - columnsToRemove);

    // Keep the first N assessment columns and all non-assessment columns
    visibleColumns = [...nonAssessmentColumns, ...assessmentColumns.slice(0, assessmentColumnsToKeep)];
  }
  return toHiddenColumnsFromVisibleColumns(visibleColumns, allColumns);
};

const getDefaultHiddenColumns = (
  allColumns: TracesTableColumn[],
  defaultSelectedColumns?: (allColumns: TracesTableColumn[]) => TracesTableColumn[],
): string[] => {
  if (defaultSelectedColumns) {
    return adjustHiddenColumns(
      toHiddenColumnsFromVisibleColumns(defaultSelectedColumns(allColumns), allColumns),
      allColumns,
    );
  }

  return adjustHiddenColumns(
    [TRACE_NAME_COLUMN_ID, SOURCE_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID],
    allColumns,
  );
};

export const useGenAITracesUIStateColumns = (
  experimentId: string,
  allColumns: TracesTableColumn[],
  defaultSelectedColumns?: (allColumns: TracesTableColumn[]) => TracesTableColumn[],
  runUuid?: string,
): {
  hiddenColumns: string[];
  toggleColumns: (cols: TracesTableColumn[]) => void;
} => {
  const [columnState, setColumnState] = useLocalStorage<GenAITracesUIState | undefined>({
    key: `${LOCAL_STORAGE_KEY}-${experimentId}-${runUuid}`,
    version: LOCAL_STORAGE_VERSION,
    initialValue: undefined,
  });

  const defaultHidden = useMemo(() => {
    return getDefaultHiddenColumns(allColumns, defaultSelectedColumns);
  }, [allColumns, defaultSelectedColumns]);

  const hiddenColumns = useMemo(() => {
    const hidden = new Set(defaultHidden);

    if (!columnState?.columnOverrides) {
      return defaultHidden;
    }

    Object.entries(columnState.columnOverrides).forEach(([id, show]) => {
      if (show) {
        hidden.delete(id);
      } else {
        hidden.add(id);
      }
    });

    return [...hidden];
  }, [columnState, defaultHidden]);

  const toggleColumns = useCallback(
    (cols: TracesTableColumn[]) => {
      if (!cols.length) return;

      setColumnState((prev) => {
        const prevOverrides = prev?.columnOverrides ?? {};
        const nextOverrides = { ...prevOverrides };
        let changed = false;

        cols.forEach((col) => {
          /* derive current visibility:  true = hidden, false = visible */
          const currentlyHidden =
            col.id in prevOverrides
              ? !prevOverrides[col.id] // invert, because stored flag is *show*
              : defaultHidden.includes(col.id);

          const newShow = currentlyHidden;
          if (nextOverrides[col.id] !== newShow) {
            nextOverrides[col.id] = newShow;
            changed = true;
          }
        });

        return changed ? { ...prev, columnOverrides: nextOverrides } : prev;
      });
    },
    [setColumnState, defaultHidden],
  );

  return { hiddenColumns, toggleColumns };
};

/**
 * This hook is used to manage the selected columns for the GenAITracesTable.
 * It uses the useGenAITracesUIStateColumns hook to manage the hidden columns, and then filters the allColumns to get the selected columns.
 * It also provides a function to set the selected columns, which will toggle the columns to be visible or hidden.
 * @returns selectedColumns: The selected columns
 * @returns toggleColumns: A function to toggle the columns
 * @returns setSelectedColumns: A function to set the selected columns - can use to do bulk updates to selected columns
 */
export const useSelectedColumns = (
  experimentId: string,
  allColumns: TracesTableColumn[],
  defaultSelectedColumns?: (cols: TracesTableColumn[]) => TracesTableColumn[],
  runUuid?: string,
) => {
  const { hiddenColumns, toggleColumns } = useGenAITracesUIStateColumns(
    experimentId,
    allColumns,
    defaultSelectedColumns,
    runUuid,
  );

  const selectedColumns = useMemo(
    () => allColumns.filter((c) => !hiddenColumns.includes(c.id)),
    [allColumns, hiddenColumns],
  );

  const setSelectedColumns = useCallback(
    (nextSelected: TracesTableColumn[]) => {
      if (isNil(nextSelected)) return;

      const wantSelected = new Set(nextSelected.map((c) => c.id));
      const toToggle: TracesTableColumn[] = [];

      allColumns.forEach((col) => {
        const isSelectedNow = !hiddenColumns.includes(col.id);
        const willBeSelected = wantSelected.has(col.id);

        if (isSelectedNow !== willBeSelected) {
          // only flip what actually changes
          toToggle.push(col);
        }
      });

      if (toToggle.length) {
        toggleColumns(toToggle);
      }
    },
    [allColumns, hiddenColumns, toggleColumns],
  );

  return { selectedColumns, toggleColumns, setSelectedColumns };
};
```

--------------------------------------------------------------------------------

---[FILE: useGetTrace.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGetTrace.test.tsx
Signals: React

```typescript
import { describe, beforeEach, afterEach, jest, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import type { ModelTrace, ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import type { GetTraceFunction } from './useGetTrace';
import { useGetTrace } from './useGetTrace';

describe('useGetTrace', () => {
  let queryClient: QueryClient;

  const demoTraceInfo: ModelTraceInfoV3 = {
    trace_id: 'trace-id-123',
    trace_location: { type: 'MLFLOW_EXPERIMENT', mlflow_experiment: { experiment_id: 'exp-1' } },
    request_time: '1625247600000',
    state: 'OK',
    trace_metadata: {},
    tags: {},
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Don't override retry settings for tests
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockTrace: ModelTrace = {
    data: {
      spans: [],
    },
    info: {
      request_id: 'test-request-id',
      timestamp_ms: 1234567890,
      execution_time_ms: 100,
      status: 'OK',
      request_metadata: [],
      tags: [],
    },
  };

  test('should be disabled when getTrace is not provided', () => {
    const mockGetTrace = jest.fn();
    const { result } = renderHook(() => useGetTrace(undefined, demoTraceInfo), { wrapper });

    // Query should be disabled when getTrace is nil (enabled: !isNil(getTrace) && ...)
    // The enabled condition evaluates to false when getTrace is undefined
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.data).toBeUndefined();

    // Verify that no getTrace function was called since none was provided
    expect(mockGetTrace).not.toHaveBeenCalled();
  });

  test('should be disabled when traceId is not provided', () => {
    const mockGetTrace = jest.fn<GetTraceFunction>().mockResolvedValue(mockTrace);
    const { result } = renderHook(() => useGetTrace(mockGetTrace, undefined), { wrapper });

    // Query should be disabled when both requestId and traceId are nil
    // The enabled condition evaluates to false when both requestId and traceId are undefined
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.isSuccess).toBe(false);
    expect(mockGetTrace).not.toHaveBeenCalled();
  });

  test('should fetch trace when getTrace and traceId are provided', async () => {
    const mockGetTrace = jest.fn<GetTraceFunction>().mockResolvedValue(mockTrace);
    const { result } = renderHook(() => useGetTrace(mockGetTrace, demoTraceInfo), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetTrace).toHaveBeenCalledWith('trace-id-123', demoTraceInfo);
    expect(result.current.data).toEqual(mockTrace);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGetTrace.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGetTrace.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useCallback, useMemo } from 'react';

import { isV3ModelTraceInfo, type ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import { useQuery } from '@databricks/web-shared/query-client';

export type GetTraceFunction = (traceId?: string, traceInfo?: ModelTrace['info']) => Promise<ModelTrace | undefined>;

export function useGetTrace(getTrace?: GetTraceFunction, traceInfo?: ModelTrace['info'], enablePolling = false) {
  const traceId = useMemo(() => {
    if (!traceInfo) {
      return undefined;
    }
    return isV3ModelTraceInfo(traceInfo) ? traceInfo.trace_id : traceInfo.request_id ?? '';
  }, [traceInfo]);

  const getTraceFn = useCallback(
    (traceInfo?: ModelTrace['info']) => {
      if (!getTrace || isNil(traceId)) {
        return Promise.resolve(undefined);
      }
      return getTrace(traceId, traceInfo);
    },
    [getTrace, traceId],
  );

  const getRefreshInterval = (data: ModelTrace | undefined) => {
    // Keep polling until trace is completed and span counts matches with the number logged in the
    // trace info. The latter check is to avoid race condition where the trace status is finalized
    // before child spans arrive at the backend.
    const traceInfo = data && isV3ModelTraceInfo(data.info) ? data.info : undefined;

    if (!traceInfo || traceInfo.state === 'IN_PROGRESS') return 1000;

    const traceStats = traceInfo.trace_metadata?.['mlflow.trace.sizeStats'];

    // If the stats metadata is not available, stop polling.
    if (!traceStats) return false;

    const expected = JSON.parse(traceStats).num_spans;
    const actual = data?.data?.spans?.length ?? 0;
    return expected === actual ? false : 1000;
  };

  return useQuery({
    queryKey: ['getTrace', traceId],
    queryFn: () => getTraceFn(traceInfo),
    enabled: !isNil(getTrace) && !isNil(traceId),
    staleTime: Infinity, // Keep data fresh as long as the component is mounted
    refetchOnWindowFocus: false, // Disable refetching on window focus
    retry: 1,
    keepPreviousData: true,
    refetchInterval: enablePolling ? getRefreshInterval : false,
  });
}
```

--------------------------------------------------------------------------------

---[FILE: useGetTraces.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGetTraces.tsx
Signals: React

```typescript
import { compact, isNil } from 'lodash';
import { useCallback } from 'react';

import { isV3ModelTraceInfo, type ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import { useQueries, useQueryClient } from '@databricks/web-shared/query-client';

import { useArrayMemo } from './useArrayMemo';

export type GetTraceFunction = (traceId?: string, traceInfo?: ModelTrace['info']) => Promise<ModelTrace | undefined>;

const QUERY_KEY = 'getTrace';

// unfortunately the util from model-trace-explorer
// requires the whole trace object, not just the info
function getModelTraceId(traceInfo: ModelTrace['info']): string {
  return isV3ModelTraceInfo(traceInfo) ? traceInfo.trace_id : traceInfo.request_id ?? '';
}

export function useGetTraces(getTrace?: GetTraceFunction, traceInfos?: ModelTrace['info'][]) {
  const queryClient = useQueryClient();

  const queries = useQueries({
    queries: (traceInfos ?? []).map((traceInfo) => {
      const traceId = getModelTraceId(traceInfo);

      return {
        queryKey: [QUERY_KEY, traceId],
        queryFn: async () => {
          return getTrace?.(traceId, traceInfo);
        },
        enabled: !isNil(getTrace) && Boolean(traceId),
        refetchOnWindowFocus: false,
        retry: 1,
        keepPreviousData: true,
      };
    }),
  });

  const data = useArrayMemo(compact(queries.map((query) => query.data)));
  const isLoading = queries.some((query) => query.isLoading);
  const invalidateSingleTraceQuery = useCallback(
    (traceId?: string) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, traceId] });
    },
    [queryClient],
  );

  return {
    data,
    isLoading,
    invalidateSingleTraceQuery,
  };
}
```

--------------------------------------------------------------------------------

````

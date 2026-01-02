---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 625
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 625 of 991)

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

---[FILE: useActiveEvaluation.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useActiveEvaluation.tsx
Signals: React

```typescript
import { useCallback } from 'react';

import { useSearchParams } from '../utils/RoutingUtils';

const QUERY_PARAM_KEY = 'selectedEvaluationId';

/**
 * Query param-powered hook that returns the currently selected evaluation ID
 * and a function to set the selected evaluation ID.
 */
export const useActiveEvaluation = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedEvaluationId = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setSelectedEvaluationId = useCallback(
    (selectedEvaluationId: string | undefined) => {
      setSearchParams((params) => {
        if (selectedEvaluationId === undefined) {
          params.delete(QUERY_PARAM_KEY);
          return params;
        }
        params.set(QUERY_PARAM_KEY, selectedEvaluationId);
        return params;
      });
    },
    [setSearchParams],
  );

  return [selectedEvaluationId, setSelectedEvaluationId] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useArrayMemo.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useArrayMemo.ts
Signals: React

```typescript
import { useRef } from 'react';

/**
 * A custom hook that memoizes an array based on the reference of its elements, not the array itself.
 */
export function useArrayMemo<T>(array: T[]) {
  // This holds reference to previous value
  const ref = useRef<T[]>();
  // Check if each element of the old and new array match
  const areArraysConsideredTheSame =
    ref.current && array.length === ref.current.length
      ? array.every((element, i) => {
          return element === ref.current?.[i];
        })
      : // Initially there's no old array defined/stored, so set to false
        false;

  if (!areArraysConsideredTheSame) {
    ref.current = array;
  }

  return areArraysConsideredTheSame && ref.current ? ref.current : array;
}
```

--------------------------------------------------------------------------------

---[FILE: useAssessmentFilters.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useAssessmentFilters.tsx
Signals: React

```typescript
import { useCallback, useMemo } from 'react';

import type { AssessmentFilter, AssessmentInfo, AssessmentValueType } from '../types';
import { useSearchParams } from '../utils/RoutingUtils';

const QUERY_PARAM_KEY = 'assessmentFilter';
const VALUE_SEPARATOR = '::';

/**
 * Query param-powered hook that returns the compare to run uuid when comparison is enabled.
 */
export const useAssessmentFilters = (assessmentInfos: AssessmentInfo[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const assessmentFilters: AssessmentFilter[] = useMemo(() => {
    const assessmentFiltersUrl = searchParams.getAll(QUERY_PARAM_KEY) ?? [];

    return assessmentFiltersUrl.reduce<AssessmentFilter[]>((filters, urlFilter) => {
      const [run, assessmentName, filterValueString, filterType] = urlFilter.split(VALUE_SEPARATOR);
      const assessmentInfo = assessmentInfos?.find((info) => info.name === assessmentName);
      if (assessmentInfo) {
        const filterValue = serializedStringToAssessmentValue(assessmentInfo, filterValueString);
        filters.push({
          run,
          assessmentName,
          filterValue,
          filterType: filterType === '' ? undefined : filterType,
        } as AssessmentFilter);
      }
      return filters;
    }, []);
  }, [assessmentInfos, searchParams]);

  const setAssessmentFilters = useCallback(
    (filters: AssessmentFilter[] | undefined, replace = false) => {
      setSearchParams(
        (params: URLSearchParams) => {
          params.delete(QUERY_PARAM_KEY);

          if (filters) {
            filters.forEach((filter) => {
              params.append(
                QUERY_PARAM_KEY,
                [
                  filter.run,
                  filter.assessmentName,
                  assessmentValueToSerializedString(filter.filterValue),
                  filter.filterType,
                ].join(VALUE_SEPARATOR),
              );
            });
          }

          return params;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return [assessmentFilters, setAssessmentFilters] as const;
};

export function serializedStringToAssessmentValueV2(value: string): AssessmentValueType {
  if (value === 'undefined') {
    return undefined;
  }

  // Handle boolean values
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  // TODO(nsthorat): handle float / int types here.
  return value;
}

export function serializedStringToAssessmentValue(assessmentInfo: AssessmentInfo, value: string): AssessmentValueType {
  if (assessmentInfo.dtype === 'pass-fail') {
    if (value === 'undefined') {
      return undefined;
    }
    return value;
  } else if (assessmentInfo.dtype === 'boolean') {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      return undefined;
    }
  }
  // TODO(nsthorat): handle float / int types here.
  return value;
}

export function assessmentValueToSerializedString(value: AssessmentValueType): string {
  if (value === undefined || value === null) return 'undefined';
  return `${value}`;
}
```

--------------------------------------------------------------------------------

---[FILE: useEditAssessmentFormState.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useEditAssessmentFormState.test.tsx

```typescript
import { describe, afterEach, jest, it, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

import { IntlProvider } from '@databricks/i18n';

import { useEditAssessmentFormState } from './useEditAssessmentFormState';
import {
  KnownEvaluationResponseAssessmentNames,
  KnownEvaluationResultAssessmentName,
} from '../components/GenAiEvaluationTracesReview.utils';
import type { AssessmentInfo } from '../types';

const KNOWN_ASSESSMENT_INFOS = KnownEvaluationResponseAssessmentNames.map((name) => getKnownAssessmentInfos(name));

function getKnownAssessmentInfos(name: string): AssessmentInfo {
  return {
    name,
    displayName: name,
    isKnown: true,
    isOverall: name === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT,
    metricName: 'test-metric',
    source: {
      sourceType: 'AI_JUDGE',
      sourceId: 'test-source-id',
      metadata: {},
    },
    isCustomMetric: false,
    isEditable: true,
    isRetrievalAssessment: false,
    dtype: 'string',
    uniqueValues: new Set(['yes', 'no']),
    docsLink: 'https://docs.example.com',
    missingTooltip: 'Missing tooltip',
    description: 'Test assessment description',
  };
}

describe('useEditAssessmentFormState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderTestedHook = (assessmentInfos?: AssessmentInfo[]) =>
    renderHook(() => useEditAssessmentFormState([], assessmentInfos), {
      wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
    });

  it('should initialize with correct initial state', () => {
    const { result } = renderTestedHook([]);

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.editingAssessment).toBeUndefined();
    expect(result.current.showUpsertForm).toBeFalsy();
  });

  it('should be empty list for known assessment infos when adding new tag', () => {
    const { result } = renderTestedHook(KNOWN_ASSESSMENT_INFOS);

    act(() => {
      result.current.addAssessment();
    });

    expect(result.current.showUpsertForm).toBeTruthy();
    expect(result.current.editingAssessment).toBeUndefined();

    expect(result.current.suggestions).toEqual([]);
  });

  it('should pre-populate boolean assessments', () => {
    const humanTagAssessment: AssessmentInfo = {
      name: 'custom-assessment',
      displayName: 'Custom Assessment',
      isKnown: false,
      isOverall: false,
      metricName: 'test-metric',
      source: {
        sourceType: 'HUMAN',
        sourceId: 'test-source-id',
        metadata: {},
      },
      isCustomMetric: false,
      isEditable: true,
      isRetrievalAssessment: false,
      dtype: 'boolean',
      uniqueValues: new Set([true, false]),
      docsLink: 'https://docs.example.com',
      missingTooltip: 'Missing tooltip',
      description: 'Test assessment description',
    };

    const { result } = renderTestedHook([...KNOWN_ASSESSMENT_INFOS, humanTagAssessment]);

    act(() => {
      result.current.addAssessment();
    });

    expect(result.current.showUpsertForm).toBeTruthy();
    expect(result.current.editingAssessment).toBeUndefined();

    expect(result.current.suggestions).toEqual([
      {
        key: humanTagAssessment.name,
        label: humanTagAssessment.name,
        rootAssessmentName: 'custom-assessment',
        disabled: false,
      },
    ]);
  });

  it('should set form state with original assessment for editing', () => {
    const originalAssessment = {
      name: KnownEvaluationResultAssessmentName.CORRECTNESS,
      stringValue: 'yes',
    } as any;
    const { result } = renderTestedHook(KNOWN_ASSESSMENT_INFOS);

    act(() => {
      result.current.editAssessment(originalAssessment);
    });

    expect(result.current.showUpsertForm).toBeTruthy();
    expect(result.current.editingAssessment).toEqual(originalAssessment);
    expect(result.current.suggestions).toEqual(
      [
        ['yes', 'Correct', KnownEvaluationResultAssessmentName.CORRECTNESS],
        ['no', 'Incorrect', KnownEvaluationResultAssessmentName.CORRECTNESS],
      ].map(([key, label, rootAssessmentName]) => ({ key, label, rootAssessmentName })),
    );
  });

  it('should cancel edit and reset form state', () => {
    const { result } = renderTestedHook(KNOWN_ASSESSMENT_INFOS);

    act(() => {
      result.current.addAssessment();
    });

    expect(result.current.showUpsertForm).toBeTruthy();

    act(() => {
      result.current.closeForm();
    });

    expect(result.current.showUpsertForm).toBeFalsy();
    expect(result.current.editingAssessment).toBeUndefined();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEditAssessmentFormState.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useEditAssessmentFormState.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';

import { useIntl } from '@databricks/i18n';

import { getAssessmentValueSuggestions } from '../components/GenAiEvaluationTracesReview.utils';
import type { AssessmentInfo, AssessmentDropdownSuggestionItem, RunEvaluationResultAssessment } from '../types';

/**
 * Manages the state of the edit assessment form. Provides methods to start adding and editing assessments.
 */
export const useEditAssessmentFormState = (
  assessmentHistory: RunEvaluationResultAssessment[],
  assessmentInfos?: AssessmentInfo[],
) => {
  const intl = useIntl();

  // The assessment that is currently being edited.
  const [editingAssessment, setEditingAssessment] = useState<RunEvaluationResultAssessment | undefined>(undefined);
  // True if the upsert form is currently being shown, false otherwise.
  const [showUpsertForm, setShowUpsertForm] = useState(false);
  // A list of suggestions for the value dropdown.
  const [suggestions, setSuggestions] = useState<AssessmentDropdownSuggestionItem[]>([]);

  const setFormState = useCallback(
    (isEditing: boolean, assessment?: RunEvaluationResultAssessment) => {
      setEditingAssessment(assessment);
      setShowUpsertForm(isEditing);
      setSuggestions(getAssessmentValueSuggestions(intl, assessment, assessmentHistory, assessmentInfos));
    },
    [intl, assessmentInfos, assessmentHistory],
  );
  const editAssessment = useCallback(
    (assessment: RunEvaluationResultAssessment) => setFormState(true, assessment),
    [setFormState],
  );
  const addAssessment = useCallback(() => setFormState(true, undefined), [setFormState]);
  const closeForm = useCallback(() => {
    setEditingAssessment(undefined);
    setShowUpsertForm(false);
  }, []);

  return {
    suggestions,
    editingAssessment,
    showUpsertForm,
    addAssessment,
    editAssessment,
    closeForm,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationsSearchQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useEvaluationsSearchQuery.tsx
Signals: React

```typescript
import { useCallback } from 'react';

import { useSearchParams } from '../utils/RoutingUtils';

const QUERY_PARAM_KEY = 'searchQuery';

/**
 * Query param-powered hook that returns the search query for evaluations.
 */
export const useEvaluationsSearchQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get(QUERY_PARAM_KEY) ?? '';

  const setSearchQuery = useCallback(
    (value: string | undefined) => {
      setSearchParams((params) => {
        if (value === undefined || value === '') {
          params.delete(QUERY_PARAM_KEY);
          return params;
        }
        params.set(QUERY_PARAM_KEY, value);
        return params;
      });
    },
    [setSearchParams],
  );

  return [searchQuery, setSearchQuery] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentVersionsQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useExperimentVersionsQuery.tsx

```typescript
import { useQuery } from '@databricks/web-shared/query-client';

import { getAjaxUrl, makeRequest } from '../utils/FetchUtils';

interface LoggedModel {
  info: {
    model_id: string;
    experiment_id: string;
    name: string;
    creation_timestamp_ms?: number;
    last_updated_timestamp_ms?: number;
    artifact_uri?: string;
    status?: string;
    creator_id?: number;
    tags?: Array<{
      key: string;
      value: string;
    }>;
  };
  data: any;
}

interface UseExperimentVersionsQueryResponseType {
  models: LoggedModel[];
  next_page_token?: string;
}

export const useExperimentVersionsQuery = (
  experimentId: string,
  disabled = false,
): {
  data: LoggedModel[] | undefined;
  isLoading: boolean;
  error?: Error;
} => {
  const queryKey = ['EXPERIMENT_MODEL_VERSIONS', experimentId];

  const { data, isLoading, error } = useQuery<UseExperimentVersionsQueryResponseType, Error>({
    queryKey,
    queryFn: async () => {
      // Search for model versions related to this experiment
      const requestBody = {
        experiment_ids: [experimentId],
      };

      return makeRequest(getAjaxUrl('ajax-api/2.0/mlflow/logged-models/search'), 'POST', requestBody);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !disabled,
    refetchOnMount: false,
    retry: false,
  });

  return {
    data: data?.models,
    isLoading,
    error: error || undefined,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useFetchTraceV4.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useFetchTraceV4.tsx
Signals: React

```typescript
import invariant from 'invariant';
import { first } from 'lodash';
import { useCallback } from 'react';

import { useQueryClient } from '@databricks/web-shared/query-client';

import { type ModelTraceInfoV3, TracesServiceV4 } from '../../model-trace-explorer';

const FETCH_TRACE_V4_QUERY_KEY = 'FETCH_TRACE_V4_QUERY_KEY';

type UseFetchTraceV4Params = never;

export const useFetchTraceV4LazyQuery = (params: UseFetchTraceV4Params) => {
  const queryClient = useQueryClient();
  return useCallback(
    (traceInfo?: ModelTraceInfoV3) => {
      return queryClient.ensureQueryData({
        queryKey: [FETCH_TRACE_V4_QUERY_KEY, traceInfo?.trace_id],
        queryFn: async () => {
          invariant(traceInfo?.trace_id, 'Trace ID is required to fetch trace');
          const traceResponse = await TracesServiceV4.getBatchTracesV4({
            traceIds: [traceInfo.trace_id],
            traceLocation: traceInfo.trace_location,
          });

          return first(
            // Convert response to the commonly used format
            traceResponse.traces.map((trace) => ({
              info: trace.trace_info,
              data: { spans: trace.spans },
            })),
          );
        },
      });
    },
    // prettier-ignore
    [
      queryClient,
    ],
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useFilters.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useFilters.tsx
Signals: React

```typescript
import { useCallback, useMemo } from 'react';

import { assessmentValueToSerializedString, serializedStringToAssessmentValueV2 } from './useAssessmentFilters';
import { type TableFilter, type TableFilterValue, type FilterOperator, TracesTableColumnGroup } from '../types';
import { useSearchParams } from '../utils/RoutingUtils';

const QUERY_PARAM_KEY = 'filter';
const VALUE_SEPARATOR = '::';

/**
 * Query param-powered hook that manages both generic and assessment filters.
 * Each filter is stored in the URL as: key::operator::value::type
 */
export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TableFilter[] = useMemo(() => {
    const filtersUrl = searchParams.getAll(QUERY_PARAM_KEY) ?? [];

    return filtersUrl.reduce<TableFilter[]>((filters, urlFilter) => {
      const [column, urlOperator, value, key] = urlFilter.split(VALUE_SEPARATOR);
      if (!column || !urlOperator || !value) return filters;

      const operator = urlOperator as FilterOperator;

      const isAssessmentFilter = column === TracesTableColumnGroup.ASSESSMENT;
      let filterValue: TableFilterValue = value;
      if (isAssessmentFilter) {
        filterValue = serializedStringToAssessmentValueV2(value);
      }

      filters.push({
        column,
        key,
        operator,
        value: filterValue,
      });

      return filters;
    }, []);
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: TableFilter[] | undefined, replace = false) => {
      setSearchParams(
        (params: URLSearchParams) => {
          params.delete(QUERY_PARAM_KEY);

          if (newFilters) {
            newFilters.forEach((filter) => {
              let filterValue = filter.value;
              if (filter.column === TracesTableColumnGroup.ASSESSMENT) {
                filterValue = assessmentValueToSerializedString(filter.value);
              }
              params.append(
                QUERY_PARAM_KEY,
                [filter.column, filter.operator, filterValue, filter.key].join(VALUE_SEPARATOR),
              );
            });
          }

          return params;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return [filters, setFilters] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useGenAiExperimentRunsForComparison.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGenAiExperimentRunsForComparison.tsx

```typescript
import type { QueryFunctionContext } from '@databricks/web-shared/query-client';
import { useQuery } from '@databricks/web-shared/query-client';

import { getAjaxUrl, makeRequest } from '../utils/FetchUtils';

type UseExperimentRunsForTraceComparisonQueryKey = ['EXPERIMENT_RUNS_FOR_TRACE_COMPARISON', { experimentId: string }];

const getQueryKey = (experimentId: string): UseExperimentRunsForTraceComparisonQueryKey => [
  'EXPERIMENT_RUNS_FOR_TRACE_COMPARISON',
  { experimentId },
];

type RawSearchRunsResponse = {
  runs: {
    info?: {
      run_uuid?: string;
      run_name?: string;
    };
  }[];
};

const queryFn = async ({
  queryKey: [, { experimentId }],
}: QueryFunctionContext<UseExperimentRunsForTraceComparisonQueryKey>): Promise<RawSearchRunsResponse> => {
  const url = getAjaxUrl('ajax-api/2.0/mlflow/runs/search');
  return makeRequest(url, 'POST', {
    experiment_ids: [experimentId],
  });
};

/**
 * Fetches the runs for the given experiment, used for the "compare to" dropdown in the eval page.
 */
export const useGenAiExperimentRunsForComparison = (experimentId: string, disabled = false) => {
  const { data, error, isLoading, isFetching } = useQuery<
    RawSearchRunsResponse,
    Error,
    RawSearchRunsResponse,
    UseExperimentRunsForTraceComparisonQueryKey
  >(getQueryKey(experimentId), {
    queryFn,
    enabled: !disabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const runInfos = data?.runs?.map((run) => ({
    runUuid: run.info?.run_uuid,
    runName: run.info?.run_name,
  }));

  return {
    requestError: error,
    isLoading,
    isFetching,
    runInfos,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useGenAiTraceEvaluationArtifacts.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGenAiTraceEvaluationArtifacts.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import type { QueryFunctionContext } from '@databricks/web-shared/query-client';
import { useQueries } from '@databricks/web-shared/query-client';

import { GenAiTraceEvaluationArtifactFile } from '../enum';
import type {
  EvaluationArtifactTableEntryAssessment,
  EvaluationArtifactTableEntryEvaluation,
  EvaluationArtifactTableEntryMetric,
  RawGenaiEvaluationArtifactResponse,
} from '../types';
import { mergeMetricsAndAssessmentsWithEvaluations, parseRawTableArtifact } from '../utils/EvaluationDataParseUtils';
import { getAjaxUrl, makeRequest } from '../utils/FetchUtils';

type UseGetTraceEvaluationArtifactQueryKey = [
  'GET_TRACE_EVALUATION_ARTIFACT',
  { runUuid: string; artifactFile: GenAiTraceEvaluationArtifactFile },
];

const getQueryKey = (
  runUuid: string,
  artifactFile: GenAiTraceEvaluationArtifactFile,
): UseGetTraceEvaluationArtifactQueryKey => ['GET_TRACE_EVALUATION_ARTIFACT', { runUuid, artifactFile }];

const queryFn = async ({
  queryKey: [, { runUuid, artifactFile }],
}: QueryFunctionContext<UseGetTraceEvaluationArtifactQueryKey>): Promise<RawGenaiEvaluationArtifactResponse> => {
  const queryParams = new URLSearchParams({ run_uuid: runUuid, path: artifactFile });
  const url = [getAjaxUrl('ajax-api/2.0/mlflow/get-artifact'), queryParams].join('?');
  return makeRequest(url, 'GET').then((data) => ({
    ...data,
    filename: artifactFile,
  }));
};

const allArtifactFiles = [
  GenAiTraceEvaluationArtifactFile.Assessments,
  GenAiTraceEvaluationArtifactFile.Evaluations,
  GenAiTraceEvaluationArtifactFile.Metrics,
];

/**
 * Fetches evaluation trace artifacts for a given run.
 * @param runUuid - The run UUID for which to fetch evaluation artifacts.
 * @param artifacts - The list of artifact files to fetch. By default, all artifacts are fetched.
 */
export const useGenAiTraceEvaluationArtifacts = (
  { runUuid, artifacts = allArtifactFiles }: { runUuid: string; artifacts?: GenAiTraceEvaluationArtifactFile[] },
  { disabled = false }: { disabled?: boolean } = {},
) => {
  const isAnyArtifactRetrievalEnabled =
    !disabled && allArtifactFiles.some((artifactFile) => artifacts.includes(artifactFile));

  const queriesResult = useQueries({
    queries: allArtifactFiles.map((artifactFile) => ({
      queryFn,
      queryKey: getQueryKey(runUuid, artifactFile),
      enabled: !disabled && artifacts.includes(artifactFile),
      refetchOnWindowFocus: false,
    })),
  });

  const isLoading = queriesResult.some((query) => query.isLoading);
  const isFetching = queriesResult.some((query) => query.isFetching);
  const error = queriesResult.find((query) => query.error);

  const [assessments, evaluations, metrics] = queriesResult.map((query) => query.data);

  const parsedAssessments = useMemo(
    () => parseRawTableArtifact<EvaluationArtifactTableEntryAssessment[]>(assessments),
    [assessments],
  );
  const parsedEvaluations = useMemo(
    () => parseRawTableArtifact<EvaluationArtifactTableEntryEvaluation[]>(evaluations),
    [evaluations],
  );
  const parsedMetrics = useMemo(() => parseRawTableArtifact<EvaluationArtifactTableEntryMetric[]>(metrics), [metrics]);

  const mergedData = useMemo(() => {
    if (!parsedEvaluations) {
      return undefined;
    }
    return mergeMetricsAndAssessmentsWithEvaluations(parsedEvaluations, parsedMetrics, parsedAssessments);
  }, [parsedAssessments, parsedEvaluations, parsedMetrics]);

  return {
    requestError: error,
    isLoading: isLoading && isAnyArtifactRetrievalEnabled,
    isFetching: isFetching && isAnyArtifactRetrievalEnabled,
    data: mergedData,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useGenAITracesTableConfig.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGenAITracesTableConfig.test.tsx
Signals: React

```typescript
import { describe, it, expect, jest } from '@jest/globals';
import { render, renderHook, screen } from '@testing-library/react';
import { merge } from 'lodash';
import React from 'react';

import { useGenAITracesTableConfig, GenAITracesTableConfigProvider } from './useGenAITracesTableConfig';

// Mock shouldEnableUnifiedEvalTab
jest.mock('../utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../utils/FeatureUtils')>('../utils/FeatureUtils'),
  shouldEnableRunEvaluationReviewUIWriteFeatures: jest.fn().mockReturnValue(false),
}));

describe('GenAITracesTableConfigProvider', () => {
  it('provides default values when no config is given', () => {
    const TestComponent = () => {
      const config = useGenAITracesTableConfig();
      return (
        <div data-testid="enableRunEvaluationWriteFeatures">{String(config.enableRunEvaluationWriteFeatures)}</div>
      );
    };

    render(
      <GenAITracesTableConfigProvider>
        <TestComponent />
      </GenAITracesTableConfigProvider>,
    );

    expect(screen.getByTestId('enableRunEvaluationWriteFeatures').textContent).toBe('false');
  });

  it('overrides default values when config is provided', () => {
    const TestComponent = () => {
      const config = useGenAITracesTableConfig();
      return (
        <div data-testid="enableRunEvaluationWriteFeatures">{String(config.enableRunEvaluationWriteFeatures)}</div>
      );
    };

    render(
      <GenAITracesTableConfigProvider config={{ enableRunEvaluationWriteFeatures: true }}>
        <TestComponent />
      </GenAITracesTableConfigProvider>,
    );

    expect(screen.getByTestId('enableRunEvaluationWriteFeatures').textContent).toBe('true');
  });

  it('ignores undefined values in the provided config', () => {
    const TestComponent = () => {
      const config = useGenAITracesTableConfig();
      return (
        <div data-testid="enableRunEvaluationWriteFeatures">{String(config.enableRunEvaluationWriteFeatures)}</div>
      );
    };

    render(
      <GenAITracesTableConfigProvider config={{ enableRunEvaluationWriteFeatures: undefined }}>
        <TestComponent />
      </GenAITracesTableConfigProvider>,
    );

    expect(screen.getByTestId('enableRunEvaluationWriteFeatures').textContent).toBe('false');
  });

  it('merges provided config with default config correctly', () => {
    const mockProvidedConfig = { enableRunEvaluationWriteFeatures: true };
    const expectedConfig = merge({}, { enableRunEvaluationWriteFeatures: false }, mockProvidedConfig);

    const TestComponent = () => {
      const config = useGenAITracesTableConfig();
      return (
        <div data-testid="enableRunEvaluationWriteFeatures">{String(config.enableRunEvaluationWriteFeatures)}</div>
      );
    };

    render(
      <GenAITracesTableConfigProvider config={mockProvidedConfig}>
        <TestComponent />
      </GenAITracesTableConfigProvider>,
    );

    expect(screen.getByTestId('enableRunEvaluationWriteFeatures').textContent).toBe(
      String(expectedConfig.enableRunEvaluationWriteFeatures),
    );
  });
});

describe('useGenAITracesTableConfig', () => {
  it('returns default values when used without a provider', () => {
    const { result } = renderHook(() => useGenAITracesTableConfig());

    expect(result.current.enableRunEvaluationWriteFeatures).toBe(false); // Default from getDefaultConfig()
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGenAITracesTableConfig.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGenAITracesTableConfig.tsx
Signals: React

```typescript
import { merge } from 'lodash';
import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';

import { shouldEnableRunEvaluationReviewUIWriteFeatures } from '../utils/FeatureUtils';

export interface GenAITracesTableConfig {
  enableRunEvaluationWriteFeatures: NonNullable<boolean | undefined>;
}

// Define a default configuration
const getDefaultConfig = (): GenAITracesTableConfig => ({
  enableRunEvaluationWriteFeatures: shouldEnableRunEvaluationReviewUIWriteFeatures() ?? false,
});

// Create the context with a default value
const GenAITracesTableConfigContext = createContext<GenAITracesTableConfig>(getDefaultConfig());

interface GenAITracesTableConfigProviderProps {
  config?: Partial<GenAITracesTableConfig>;
  children: ReactNode;
}

export const GenAITracesTableConfigProvider: React.FC<React.PropsWithChildren<GenAITracesTableConfigProviderProps>> = ({
  config = {},
  children,
}) => {
  const defaultConfig = getDefaultConfig();
  // Remove undefined values from the config object

  const mergedConfig: GenAITracesTableConfig = merge({}, defaultConfig, config);

  return (
    <GenAITracesTableConfigContext.Provider value={mergedConfig}>{children}</GenAITracesTableConfigContext.Provider>
  );
};

export const useGenAITracesTableConfig = (): GenAITracesTableConfig => {
  const context = useContext(GenAITracesTableConfigContext);

  if (!context) {
    return getDefaultConfig(); // Fallback to defaults if no provider is found
  }

  return context;
};
```

--------------------------------------------------------------------------------

---[FILE: useGenAITracesUIState.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/hooks/useGenAITracesUIState.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';

import { useGenAITracesUIStateColumns, useSelectedColumns } from './useGenAITracesUIState';
import {
  EXECUTION_DURATION_COLUMN_ID,
  INPUTS_COLUMN_ID,
  REQUEST_TIME_COLUMN_ID,
  SOURCE_COLUMN_ID,
  STATE_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
} from './useTableColumns';
import type { TracesTableColumn } from '../types';
import { TracesTableColumnType } from '../types';

const sort = (a: string[]) => [...a].sort();

const STORAGE_KEY = (expId: string, runUuid?: string) => `genaiTracesUIState-columns-${expId}-${runUuid}`;

const mockColumns = [
  { id: INPUTS_COLUMN_ID, type: TracesTableColumnType.INPUT, label: 'Request' },
  { id: 'col1', type: TracesTableColumnType.ASSESSMENT, label: 'Assessment 1' },
  { id: 'col2', type: TracesTableColumnType.ASSESSMENT, label: 'Assessment 2' },
  { id: 'col3', type: TracesTableColumnType.ASSESSMENT, label: 'Assessment 3' },
  { id: 'col4', type: TracesTableColumnType.ASSESSMENT, label: 'Assessment 4' },
  { id: 'col5', type: TracesTableColumnType.ASSESSMENT, label: 'Assessment 5' },
  { id: EXECUTION_DURATION_COLUMN_ID, type: TracesTableColumnType.TRACE_INFO, label: 'Execution Duration' },
  { id: REQUEST_TIME_COLUMN_ID, type: TracesTableColumnType.TRACE_INFO, label: 'Request Time' },
  { id: SOURCE_COLUMN_ID, type: TracesTableColumnType.TRACE_INFO, label: 'Source' },
  { id: TRACE_NAME_COLUMN_ID, type: TracesTableColumnType.TRACE_INFO, label: 'Trace Name' },
  { id: STATE_COLUMN_ID, type: TracesTableColumnType.TRACE_INFO, label: 'State' },
  { id: 'tags-eval', type: TracesTableColumnType.TRACE_INFO, label: 'Tag - eval' },
];

type UseLSParams = { key: string; initialValue: any };
const memoryStore: Record<string, any> = {};

jest.mock('@databricks/web-shared/hooks', () => {
  const actual = jest.requireActual<typeof import('@databricks/web-shared/hooks')>('@databricks/web-shared/hooks');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
  const React = require('react');

  return {
    ...actual,
    useLocalStorage: ({ key, initialValue }: UseLSParams) => {
      const [state, setState] = React.useState(key in memoryStore ? memoryStore[key] : initialValue);
      React.useEffect(() => {
        memoryStore[key] = state;
      }, [key, state]);
      return [state, setState] as const;
    },
  };
});

const expId = 'exp-123';

describe('useGenAITracesUIStateColumns', () => {
  beforeEach(() => {
    // eslint-disable-next-line guard-for-in
    for (const k in memoryStore) delete memoryStore[k];
  });

  describe('useSelectedColumns', () => {
    beforeEach(() => {
      // eslint-disable-next-line guard-for-in
      for (const k in memoryStore) delete memoryStore[k];
    });

    it('selectedColumns with all columns -> should max out at 10 columns', () => {
      const { result } = renderHook(() => useSelectedColumns(expId, mockColumns, (cols) => cols));

      expect(sort(result.current.selectedColumns.map((c) => c.id))).toEqual(
        sort([
          INPUTS_COLUMN_ID,
          'col1',
          'col2',
          'col3',
          EXECUTION_DURATION_COLUMN_ID,
          REQUEST_TIME_COLUMN_ID,
          SOURCE_COLUMN_ID,
          STATE_COLUMN_ID,
          TRACE_NAME_COLUMN_ID,
          'tags-eval',
        ]),
      );
    });

    it('setSelectedColumns -> should update selectedColumns', () => {
      const { result } = renderHook(() => useSelectedColumns(expId, mockColumns, (cols) => cols));

      act(() => {
        result.current.setSelectedColumns([
          mockColumns.find((c) => c.id === INPUTS_COLUMN_ID) as TracesTableColumn,
          mockColumns.find((c) => c.id === 'col1') as TracesTableColumn,
          mockColumns.find((c) => c.id === 'col2') as TracesTableColumn,
          mockColumns.find((c) => c.id === 'col3') as TracesTableColumn,
          mockColumns.find((c) => c.id === 'col4') as TracesTableColumn,
        ]);
      });

      expect(sort(result.current.selectedColumns.map((c) => c.id))).toEqual(
        sort([INPUTS_COLUMN_ID, 'col1', 'col2', 'col3', 'col4']),
      );
    });

    it('setSelectedColumns resets all when empty', () => {
      const { result } = renderHook(() => useSelectedColumns(expId, mockColumns, (cols) => cols));

      act(() => {
        result.current.setSelectedColumns([]);
      });

      expect(sort(result.current.selectedColumns.map((c) => c.id))).toEqual(sort([]));
    });
  });

  it('falls back to default hidden columns when storage empty', () => {
    const { result } = renderHook(() => useGenAITracesUIStateColumns(expId, mockColumns));

    expect(sort(result.current.hiddenColumns)).toEqual(
      sort([TRACE_NAME_COLUMN_ID, SOURCE_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID]),
    );
  });

  it('prefers columnOverrides from local storage', () => {
    /* user explicitly hid INPUTS and STATE */
    memoryStore[STORAGE_KEY(expId)] = {
      columnOverrides: {
        [INPUTS_COLUMN_ID]: false,
        [STATE_COLUMN_ID]: false,
        col5: true,
      },
    };

    const { result } = renderHook(() => useGenAITracesUIStateColumns(expId, mockColumns));

    expect(sort(result.current.hiddenColumns)).toEqual(
      sort([INPUTS_COLUMN_ID, TRACE_NAME_COLUMN_ID, SOURCE_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID]),
    );
  });

  it('derives hidden columns from initialSelectedColumns', () => {
    const initialSelected = (cols: typeof mockColumns) => cols.filter((c) => c.id !== 'col1'); // leave col1 un-selected

    const { result } = renderHook(() => useGenAITracesUIStateColumns(expId, mockColumns, initialSelected));

    // initialSelected leaves 1 assessment (col1) hidden ➜ 11 visible.
    // The clamp can only show 10, so it hides 1 more assessment (col5).
    // Final hidden set: col1 + col5  = 2 assessments hidden.
    expect(sort(result.current.hiddenColumns)).toEqual(sort(['col1', 'col5']));
  });

  it('derives hidden columns from defaultSelectedColumns and local storage', () => {
    memoryStore[STORAGE_KEY(expId)] = {
      columnOverrides: {
        [INPUTS_COLUMN_ID]: true,
        [REQUEST_TIME_COLUMN_ID]: false,
        [STATE_COLUMN_ID]: false,
        col5: true,
        [TRACE_NAME_COLUMN_ID]: false,
        [SOURCE_COLUMN_ID]: false,
        col2: false,
        col3: true,
      },
    };

    const { result } = renderHook(() =>
      useGenAITracesUIStateColumns(expId, mockColumns, (cols) =>
        cols.filter((c) => c.id !== 'col2' && c.id !== 'col5'),
      ),
    );

    expect(sort(result.current.hiddenColumns)).toEqual(
      sort([REQUEST_TIME_COLUMN_ID, TRACE_NAME_COLUMN_ID, SOURCE_COLUMN_ID, STATE_COLUMN_ID, 'col2']),
    );
  });

  it('toggleColumns updates the in-memory state', () => {
    const { result } = renderHook(() => useGenAITracesUIStateColumns(expId, mockColumns));

    /* default hidden first */
    expect(sort(result.current.hiddenColumns)).toEqual(
      sort([TRACE_NAME_COLUMN_ID, SOURCE_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID]),
    );

    /* toggle INPUTS → should now be hidden too */
    act(() => {
      const inputCol = mockColumns.find((c) => c.id === INPUTS_COLUMN_ID) as TracesTableColumn;
      result.current.toggleColumns([inputCol]);
    });

    expect(sort(result.current.hiddenColumns)).toEqual(
      sort([TRACE_NAME_COLUMN_ID, SOURCE_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID, INPUTS_COLUMN_ID]),
    );
  });

  it('auto-hides assessment columns to keep ≤10 visible', () => {
    const initialSelected = (cols: typeof mockColumns) => cols; // all visible

    const { result } = renderHook(() => useGenAITracesUIStateColumns(expId, mockColumns, initialSelected));

    expect(result.current.hiddenColumns).toEqual(sort(['col4', 'col5'])); // only 3 of 5 remain visible
  });
});
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 637
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 637 of 991)

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

---[FILE: TraceUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/utils/TraceUtils.ts

```typescript
import { isNil, uniq } from 'lodash';

import { getAssessmentValue, ModelTraceSpanType } from '@databricks/web-shared/model-trace-explorer';
import type {
  Assessment,
  ExpectationAssessment,
  FeedbackAssessment,
  ModelTrace,
  ModelTraceInfoV3,
  RetrieverDocument,
} from '@databricks/web-shared/model-trace-explorer';

import {
  MLFLOW_ASSESSMENT_SOURCE_RUN_ID,
  MLFLOW_TRACE_SOURCE_SCORER_NAME_TAG,
} from '../../model-trace-explorer/constants';
import { stringifyValue } from '../components/GenAiEvaluationTracesReview.utils';
import { KnownEvaluationResultAssessmentName } from '../enum';
import { CUSTOM_METADATA_COLUMN_ID, TAGS_COLUMN_ID } from '../hooks/useTableColumns';
import type {
  AssessmentType,
  RunEvaluationResultAssessment,
  RunEvaluationResultAssessmentSource,
  RunEvaluationTracesDataEntry,
  RunEvaluationTracesRetrievalChunk,
} from '../types';

// This is the key used by the eval harness to record
// which chunk a given retrieval assessment corresponds to.
const MLFLOW_SPAN_OUTPUT_KEY = 'span_output_key';

const MLFLOW_ASSESSMENT_ROOT_CAUSE_ASSESSMENT = 'root_cause_assessment';
const MLFLOW_ASSESSMENT_ROOT_CAUSE_RATIONALE = 'root_cause_rationale';
const MLFLOW_ASSESSMENT_SUGGESTED_ACTION = 'suggested_action';
export const MLFLOW_SOURCE_RUN_KEY = 'mlflow.sourceRun';

export const MLFLOW_INTERNAL_PREFIX = 'mlflow.';

export const DEFAULT_RUN_PLACEHOLDER_NAME = 'monitor';

const SPANS_LOCATION_TAG_KEY = 'mlflow.trace.spansLocation';
export const TRACKING_STORE_SPANS_LOCATION = 'TRACKING_STORE';

export const getRowIdFromEvaluation = (evaluation?: RunEvaluationTracesDataEntry) => {
  return evaluation?.evaluationId || '';
};

export const getRowIdFromTrace = (trace?: ModelTraceInfoV3) => {
  return trace?.trace_id || '';
};

export const getTagKeyFromColumnId = (columnId: string) => {
  return columnId.split(':').pop();
};

export const getCustomMetadataKeyFromColumnId = (columnId: string) => {
  return columnId.split(':').pop();
};

export const createTagColumnId = (tagKey: string) => {
  return `${TAGS_COLUMN_ID}:${tagKey}`;
};

export const createCustomMetadataColumnId = (metadataKey: string) => {
  return `${CUSTOM_METADATA_COLUMN_ID}:${metadataKey}`;
};

export const getTracesTagKeys = (traces: ModelTraceInfoV3[]): string[] => {
  return uniq(
    traces
      .map((result) => {
        return Object.keys(result.tags || {}).filter((key) => key && !key.startsWith(MLFLOW_INTERNAL_PREFIX));
      })
      .flat(),
  );
};

/**
 * Filter out the traces that are not created by the given evaluation run.
 *
 * NB: This utility is also used for the general trace view in a Run Detail page.
 *
 * @param traces - The traces to filter.
 * @param runUuid - The run UUID to filter by.
 * @returns The filtered traces.
 */
export const filterTracesByAssessmentSourceRunId = (
  traces: ModelTraceInfoV3[] | undefined,
  runUuid?: string | null,
): ModelTraceInfoV3[] | undefined => {
  if (!traces || !runUuid) {
    return traces;
  }

  return traces.reduce<ModelTraceInfoV3[]>((acc, trace) => {
    const assessments = trace.assessments || [];

    // Filter assessments to those that are created by this evaluation run.
    const filteredAssessments = assessments.filter((assessment) => {
      const sourceRunId = assessment.metadata?.[MLFLOW_ASSESSMENT_SOURCE_RUN_ID];
      return !sourceRunId || sourceRunId === runUuid;
    });

    // Filter out the scorer traces.
    const sourceScorerName = trace.tags?.[MLFLOW_TRACE_SOURCE_SCORER_NAME_TAG];
    if (sourceScorerName) {
      return acc;
    }

    // Early return to avoid the overhead of copying the trace and assessments below.
    if (filteredAssessments.length === assessments.length) {
      acc.push(trace);
      return acc;
    }

    // Render only the assessments that are created by this evaluation run. This is to avoid showing
    // feedbacks logged from other runs in the evaluation results.
    acc.push({
      ...trace,
      assessments: filteredAssessments,
    });
    return acc;
  }, []);
};

// This function checks if the traceInfo field is present in the first entry of the evalResults array.
// We assume that all entries in evalResults will either contain traceInfo or not.
export const shouldUseTraceInfoV3 = (evalResults: RunEvaluationTracesDataEntry[]): boolean => {
  return evalResults.length > 0 && Boolean(evalResults[0].traceInfo);
};

const safelyParseValue = <T>(val: string): string | T => {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

export const getTraceInfoInputs = (traceInfo: ModelTraceInfoV3) => {
  return traceInfo.request_preview || traceInfo.request || traceInfo.trace_metadata?.['mlflow.traceInputs'] || '';
};

export const getTraceInfoOutputs = (traceInfo: ModelTraceInfoV3) => {
  return traceInfo.response_preview || traceInfo.response || traceInfo.trace_metadata?.['mlflow.traceOutputs'] || '';
};

/**
 * Returns the "spans location" tag value if present.
 */
export function getSpansLocation(traceInfo?: ModelTraceInfoV3): string | undefined {
  return traceInfo?.tags[SPANS_LOCATION_TAG_KEY] || undefined;
}

const isExpectationAssessment = (assessment: Assessment): assessment is ExpectationAssessment => {
  return Boolean('expectation' in assessment && assessment.expectation);
};

const LIST_TRACES_IGNORE_ASSESSMENTS = ['agent/latency_seconds'];

function processExpectationAssessment(assessment: ExpectationAssessment, targets: Record<string, any>): void {
  const assessmentName = assessment.assessment_name;
  const assessmentValue = getAssessmentValue(assessment);

  if (Array.isArray(assessmentValue)) {
    // Parse string elements if possible, otherwise keep original values (booleans, numbers, objects, etc.)
    targets[assessmentName] = assessmentValue.map((val) => (typeof val === 'string' ? safelyParseValue(val) : val));
  } else if (typeof assessmentValue === 'string') {
    // Parse JSON-encoded strings like "true", "42", "{...}", etc.
    targets[assessmentName] = safelyParseValue(assessmentValue);
  } else {
    // Preserve non-string primitives and objects (boolean, number, null, plain objects)
    targets[assessmentName] = assessmentValue;
  }
}

function processFeedbackAssessment(
  assessment: FeedbackAssessment,
  overallAssessments: RunEvaluationResultAssessment[],
  responseAssessmentsByName: Record<string, RunEvaluationResultAssessment[]>,
): void {
  const assessmentName = assessment.assessment_name;
  const evalResultAssessment = convertFeedbackAssessmentToRunEvalAssessment(assessment);

  if (assessmentName === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT) {
    overallAssessments.push(evalResultAssessment);
  }
  if (!responseAssessmentsByName[assessmentName]) {
    responseAssessmentsByName[assessmentName] = [];
  }

  responseAssessmentsByName[assessmentName].push(evalResultAssessment);
}

const convertAssessmentV3Source = (assessment: Assessment): RunEvaluationResultAssessmentSource | undefined => {
  if (!assessment.source?.source_type) {
    return undefined;
  }
  const sourceType = assessment.source?.source_type;

  let runEvalSourceType: AssessmentType;
  if (sourceType === 'LLM_JUDGE') {
    runEvalSourceType = 'AI_JUDGE';
  } else {
    runEvalSourceType = sourceType as AssessmentType;
  }

  return {
    sourceType: runEvalSourceType,
    sourceId: assessment.source?.source_id || '',
    metadata: {},
  };
};

const convertFeedbackAssessmentToRunEvalAssessment = (
  assessment: FeedbackAssessment,
): RunEvaluationResultAssessment => {
  const assessmentValue = assessment.feedback?.value;
  const isOverallAssessment = assessment.assessment_name === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT;
  const source = convertAssessmentV3Source(assessment);
  const error = assessment.feedback?.error || assessment.error;
  return {
    name: assessment.assessment_name,
    stringValue: typeof assessmentValue === 'string' ? assessmentValue : undefined,
    booleanValue: typeof assessmentValue === 'boolean' ? assessmentValue : undefined,
    numericValue: typeof assessmentValue === 'number' ? assessmentValue : undefined,
    errorCode: error?.error_code,
    errorMessage: error?.error_message,
    rationale: assessment.metadata?.[MLFLOW_ASSESSMENT_ROOT_CAUSE_RATIONALE] || assessment.rationale,
    source,
    rootCauseAssessment: isOverallAssessment
      ? {
          assessmentName: assessment.metadata?.[MLFLOW_ASSESSMENT_ROOT_CAUSE_ASSESSMENT] || '',
          suggestedActions: assessment.metadata?.[MLFLOW_ASSESSMENT_SUGGESTED_ACTION],
        }
      : undefined,
    metadata: assessment.metadata,
  };
};

export const convertTraceInfoV3ToRunEvalEntry = (traceInfo: ModelTraceInfoV3): RunEvaluationTracesDataEntry => {
  const evaluationId = getRowIdFromTrace(traceInfo);

  // Prepare containers for our assessments.
  const overallAssessments: RunEvaluationResultAssessment[] = [];
  const responseAssessmentsByName: Record<string, RunEvaluationResultAssessment[]> = {};
  const targets: Record<string, any> = {};

  traceInfo.assessments?.forEach((assessment) => {
    const assessmentName = assessment.assessment_name;

    if (LIST_TRACES_IGNORE_ASSESSMENTS.includes(assessmentName)) {
      return;
    }

    if (assessment.valid === false) {
      return;
    }

    if (isExpectationAssessment(assessment)) {
      processExpectationAssessment(assessment, targets);
    } else {
      processFeedbackAssessment(assessment, overallAssessments, responseAssessmentsByName);
    }
  });

  // trace server has input/output in request/response field, and mlflow tracking server has it in the metadata
  const rawInputs = getTraceInfoInputs(traceInfo);
  const rawOutputs = getTraceInfoOutputs(traceInfo);

  let inputsTitle = rawInputs;
  let inputs: Record<string, any> = {};
  let outputs: Record<string, any> = {};
  try {
    inputs = JSON.parse(rawInputs);

    // Try to parse OpenAI messages
    const messages = inputs['messages'];
    if (Array.isArray(messages) && !isNil(messages[0]?.content)) {
      inputsTitle = messages[messages.length - 1]?.content;
    } else {
      inputsTitle = stringifyValue(inputs);
    }
  } catch {
    inputs = {
      request: rawInputs,
    };
  }

  try {
    outputs = { response: JSON.parse(rawOutputs) };
  } catch {
    outputs = { response: rawOutputs };
  }
  return {
    evaluationId,
    requestId: traceInfo.client_request_id || evaluationId,
    inputsId: evaluationId,
    inputsTitle,
    inputs,
    outputs,
    targets,
    overallAssessments,
    responseAssessmentsByName,
    metrics: {},
    traceInfo,
  };
};

export const applyTraceInfoV3ToEvalEntry = (
  evalResults: RunEvaluationTracesDataEntry[],
): RunEvaluationTracesDataEntry[] => {
  if (!shouldUseTraceInfoV3(evalResults)) {
    return evalResults;
  }
  return evalResults.map((result) => {
    if (!result.traceInfo) {
      return result;
    }
    // Convert the single TraceInfo to a single RunEvaluationTracesDataEntry
    const converted = convertTraceInfoV3ToRunEvalEntry(result.traceInfo);
    // Merge the newly converted fields with the existing data
    return {
      ...result,
      ...converted,
    };
  });
};

export const isTraceExportable = (entry: RunEvaluationTracesDataEntry) => {
  let responseJson;
  try {
    responseJson = JSON.parse(entry.outputs['response']);
  } catch {
    if (!entry.outputs['response']) {
      return false;
    }
    // entry.outputs.response may already be parsed in case of external monitors
    // so try using it directly here.
    responseJson = entry.outputs['response'];
  }
  if (isNil(responseJson)) {
    return false;
  }

  const responseIsChatCompletion =
    (Array.isArray(responseJson['messages']) && !isNil(responseJson['messages']?.[0]?.['content'])) ||
    (Array.isArray(responseJson['choices']) && !isNil(responseJson['choices']?.[0]?.['message']?.['content']));

  return responseIsChatCompletion;
};

export function getRetrievedContextFromTrace(
  responseAssessmentsByName: Record<string, RunEvaluationResultAssessment[]>,
  trace: ModelTrace | undefined,
): RunEvaluationTracesRetrievalChunk[] | undefined {
  if (isNil(trace)) {
    return undefined;
  }
  let docUriKey = 'doc_uri';
  const tags = trace.info.tags as Record<string, string> | undefined;
  if (tags?.['retrievers']) {
    const retrieverInfos = safelyParseValue<{ doc_uri: string; chunk_id: string }[]>(tags['retrievers']);
    if (typeof retrieverInfos === 'object' && retrieverInfos.length > 0) {
      docUriKey = retrieverInfos[0].doc_uri;
    }
  }

  const retrievalSpans = trace.data.spans.filter(
    (span) =>
      span.attributes?.['mlflow.spanType'] &&
      safelyParseValue(span.attributes?.['mlflow.spanType']) === ModelTraceSpanType.RETRIEVER,
  );
  if (retrievalSpans.length === 0) {
    return [];
  }

  // Return the last retrieval span chronologically since it is the one analyzed by our judges.
  const spanOutputs = retrievalSpans.at(-1)?.attributes?.['mlflow.spanOutputs'];
  if (!spanOutputs) {
    return [];
  }

  const outputs = safelyParseValue(spanOutputs) as RetrieverDocument[];
  if (!Array.isArray(outputs)) {
    return [];
  }

  const retrievalChunks = outputs.map((doc, index) => {
    return {
      docUrl: doc.metadata?.[docUriKey],
      content: doc.page_content,
      retrievalAssessmentsByName: getRetrievalAssessmentsByName(responseAssessmentsByName, index),
    };
  });

  return retrievalChunks;
}

const getRetrievalAssessmentsByName = (
  responseAssessmentsByName: Record<string, RunEvaluationResultAssessment[]>,
  chunkIndex: number,
): Record<string, RunEvaluationResultAssessment[]> => {
  const filteredResponseAssessmentsByName = Object.fromEntries(
    Object.entries(responseAssessmentsByName)
      .map(([key, assessments]) => [
        key,
        assessments.filter((assessment) => Number(assessment?.metadata?.[MLFLOW_SPAN_OUTPUT_KEY]) === chunkIndex),
      ])
      .filter(([key, filteredAssessments]) => filteredAssessments.length > 0),
  );

  return filteredResponseAssessmentsByName;
};
```

--------------------------------------------------------------------------------

---[FILE: getUser.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/global-settings/getUser.tsx

```typescript
export const getUser = () => {
  // return a dummy user as the OSS backend
  // does not transmit user info to frontend
  return 'User';
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/global-settings/index.ts

```typescript
export * from './getUser';
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/hooks/index.ts

```typescript
export { useMediaQuery } from './useMediaQuery';
export { useResizeObserver } from './useResizeObserver';
export { useLocalStorage } from './useLocalStorage';
```

--------------------------------------------------------------------------------

---[FILE: useLocalStorage.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/hooks/useLocalStorage.ts
Signals: React

```typescript
import { useState, useCallback } from 'react';

/** Params that describe a local storage key for use with {@link useLocalStorage}. */
export interface UseLocalStorageParams<T> {
  key: string;
  version: number;
  initialValue: T;
  onFailure?: (error: unknown) => void;
}

export const buildStorageKey = (baseKey: string, version: number): string => {
  const storageKey = `${baseKey}_v${version}`;
  return storageKey;
};

/**
 * Builds a storage key based on the provided {@link UseLocalStorageParams}.
 *
 * For details see {@link buildStorageKey}.
 */
export function buildStorageKeyByParams({ key, version }: Omit<UseLocalStorageParams<any>, 'initialValue'>): string {
  return buildStorageKey(key, version);
}

/**
 * Retrieves a value from the localStorage based on the provided key.
 * If the value is not found or cannot be parsed as JSON, the initial value is returned.
 *
 * @param {string} key - The key to retrieve the value from localStorage.
 * @param {number} version - The version of the storage key.
 * @param {*} initialValue - The initial value to return if the value is not found or cannot be parsed.
 * @returns {*} - The retrieved value or the initial value if not found or cannot be parsed.
 *
 * @example
 * // Example 1: Retrieving a stored value
 * const storedValue = getLocalStorageItem("username", 0.1, true, "Guest");
 * // Returns the value stored in localStorage with the key "username",
 * // or the initial value "Guest" if the key is not found or cannot be parsed.
 *
 * // Example 2: Retrieving a non-existent value
 * const nonExistentValue = getLocalStorageItem("email", 0.1, true, null);
 * // Returns null as the initial value is used since the key "email" is not found.
 */
export const getLocalStorageItem = <T>(key: string, version: number, initialValue: T): T => {
  const fullKey = buildStorageKey(key, version);
  try {
    const item = window.localStorage.getItem(fullKey);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    return initialValue;
  }
};

/**
 * Retrieves a value from local storage for the provided {@link UseLocalStorageParams}.
 *
 * For details see {@link getLocalStorageItem}.
 */
export function getLocalStorageItemByParams<T>({ key, version, initialValue }: UseLocalStorageParams<T>): T {
  return getLocalStorageItem(key, version, initialValue);
}

/**
 * Sets a value in the localStorage for the provided key.
 *
 * @param key - The key to set the value in localStorage.
 * @param {number} version - The version of the storage key.
 * @param {*} value - The value to be stored in localStorage.
 * @param {function} onFailure - The function to be called if an error occurs while setting the value.
 * @returns {void}
 *
 * @example
 * // Example 1: Storing a string value
 * setLocalStorageItem("username", 0.1, true, "John");
 *
 * // Example 2: Storing an object
 * const user = { name: "Alice", age: 25 };
 * setLocalStorageItem("user", 0.1, true, user);
 */
export const setLocalStorageItem = <T>(
  key: string,
  version: number,
  value: T,
  onFailure?: (error: unknown) => void,
): void => {
  const fullKey = buildStorageKey(key, version);
  const valueToSet = JSON.stringify(value);

  try {
    localStorage.setItem(fullKey, valueToSet);
  } catch (error) {
    onFailure?.(error);
  }
};

/**
 * Sets a value in local storage for the provided {@link UseLocalStorageParams}.
 *
 * For details see {@link setLocalStorageItem}.
 */
export function setLocalStorageItemByParams<T>(
  { key, version }: Omit<UseLocalStorageParams<T>, 'initialValue'>,
  value: T,
  onFailure?: (error: unknown) => void,
) {
  setLocalStorageItem(key, version, value, onFailure);
}

/**
 * It works similar to useState() but uses local storage for backing the data
 * WARNING: Do not reuse the same key in more than one place
 * Think about what will happen if two tabs are opened and they overwrite each other's value
 */
export function useLocalStorage<T>({ key, version, initialValue, onFailure }: UseLocalStorageParams<T>) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getLocalStorageItem<T>(key, version, initialValue);
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        setLocalStorageItem<T>(key, version, newValue, onFailure);
        return newValue;
      });
    },
    [key, version, onFailure],
  );

  return [storedValue, setValue] as const;
}
```

--------------------------------------------------------------------------------

---[FILE: useMediaQuery.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/hooks/useMediaQuery.ts
Signals: React

```typescript
import React from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

function useMatchesMediaQuery(queryList: MediaQueryList) {
  return useSyncExternalStore(
    React.useCallback(
      (callback) => {
        queryList.addEventListener('change', callback);
        return () => {
          queryList.removeEventListener('change', callback);
        };
      },
      [queryList],
    ),
    () => queryList.matches,
  );
}

/**
 * React hook that listens for changes to a [media query][media-query]. Uses
 * [`window.matchMedia()`][match-media] under-the-hood.
 *
 * [media-query]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
 * [match-media]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 *
 * @usage
 *
 * ```tsx
 * function FancyButton() {
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion)');
 *   return prefersReducedMotion ? <Button /> : <DancingButton />;
 * }
 * ```
 *
 * > **Note**
 * > The vast majority of use-cases can (and should) use vanilla CSS media
 * > queries instead of this hook — which will cause a re-render when the match
 * > state changes. Usage of this hook should be reserved for use-cases where
 * > CSS cannot be used instead.
 * >
 * > ```tsx
 * > <Button css={{ 'not (prefers-reduced-motion)': { animation: … } }} />
 * > ```
 */
export function useMediaQuery(query: string) {
  // Note: a new MediaQueryList is created with every _usage_ of this hook.
  // It's probably cheap to create many instances of MediaQueryList, and
  // garbage collection will still clean up as expected, but consider using a
  // [weak cache](https://github.com/tc39/proposal-weakrefs#weak-caches) to
  // reuse MediaQueryLists where possible if performance is impacted.
  const queryList = React.useMemo(() => window.matchMedia(query), [query]);
  return useMatchesMediaQuery(queryList);
}
```

--------------------------------------------------------------------------------

---[FILE: useResizableMaxWidth.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/hooks/useResizableMaxWidth.ts
Signals: React

```typescript
import type { MutableRefObject } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export function useResizableMaxWidth(minWidth: number) {
  const ref: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  const updateWidth = useCallback(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth);
    }
  }, []);

  useLayoutEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  const refCallback = useCallback(
    (node: HTMLDivElement) => {
      ref.current = node;
      updateWidth();
    },
    [updateWidth],
  );

  const resizableMaxWidth = containerWidth === undefined ? undefined : containerWidth - minWidth;
  return { resizableMaxWidth, ref: refCallback };
}
```

--------------------------------------------------------------------------------

---[FILE: useResizeObserver.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/hooks/useResizeObserver.tsx
Signals: React

```typescript
import { type RefObject, useRef, useCallback, useEffect, useState } from 'react';

type ResizeObserverOptions<ElementType extends Element> = {
  /**
   * The element to watch for size changes. Can either pass a ref object or a function that when called will return the element to be watched
   */
  ref: RefObject<ElementType | null> | (() => ElementType | null);
  /**
   * Optionally debounces state updates, to prevent rerendering on every single resize
   */
  debounceTimeMs?: number;
};

export function useResizeObserver<ElementType extends Element>({
  ref: rootRef,
  debounceTimeMs,
}: ResizeObserverOptions<ElementType>): { width: number; height: number } | null {
  const prevSize = useRef<{ width: number; height: number }>({ width: -1, height: -1 });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const onResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      const rect = entries[0].contentRect;
      if (prevSize.current.width === -1) {
        // First update, just set size immediately
        prevSize.current = { width: rect.width, height: rect.height };
        setSize(prevSize.current);
        return;
      }

      if (rect.width !== prevSize.current.width || rect.height !== prevSize.current.height) {
        prevSize.current.width = rect.width;
        prevSize.current.height = rect.height;

        if (!debounceTimeMs) {
          setSize({ ...prevSize.current });
          return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          setSize({ ...prevSize.current });
        }, debounceTimeMs);
      }
    },
    [debounceTimeMs],
  );

  const observerRef = useRef<ResizeObserver>();
  if (!observerRef.current) {
    observerRef.current = new ResizeObserver(onResize);
  }

  useEffect(() => {
    const rootElement = typeof rootRef === 'function' ? rootRef() : rootRef.current;
    if (rootElement) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO(FEINF-3982)
      const observer = observerRef.current!;
      observer.observe(rootElement);
      return () => observer.unobserve(rootElement);
    }
    return;
  });

  return size;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/metrics/index.tsx

```typescript
export async function recordEvent(
  eventName: string,
  additionalTags?: Record<string, string>,
  eventData?: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) {}

export * from './UserActionErrorHandler';
```

--------------------------------------------------------------------------------

---[FILE: UserActionErrorHandler.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/metrics/UserActionErrorHandler.tsx
Signals: React

```typescript
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type SyntheticEvent,
} from 'react';

import { matchPredefinedError } from '../errors';
import type { HandleableError, PredefinedError } from '../errors';

export type UserActionError = PredefinedError | null;

type UserActionErrorHandlerContextProps = {
  currentUserActionError: UserActionError;
  handleError: (error: HandleableError, onErrorCallback?: (err: UserActionError) => void) => void;
  handlePromise: (promise: Promise<any>) => void;
  clearUserActionError: () => void;
};

const UserActionErrorHandlerContext = createContext<UserActionErrorHandlerContextProps>({
  currentUserActionError: null,
  handleError: () => {},
  handlePromise: () => {},
  clearUserActionError: () => {},
});

type UserActionErrorHandlerProps = {
  errorFilter?: (error: any) => boolean;
};

export const UserActionErrorHandler = ({ children, errorFilter }: PropsWithChildren<UserActionErrorHandlerProps>) => {
  const [currentUserActionError, setCurrentUserActionError] = useState<UserActionError>(null);

  const handleError = useCallback(
    (error: HandleableError, onErrorCallback?: (err: UserActionError) => void) => {
      if (!errorFilter?.(error)) {
        const predefinedError = matchPredefinedError(error);

        setCurrentUserActionError(predefinedError);

        if (onErrorCallback) {
          onErrorCallback(predefinedError);
        }
      }
    },
    [setCurrentUserActionError, errorFilter],
  );

  const handlePromise = useCallback(
    (promise: Promise<any>) => {
      promise.catch((error: HandleableError) => {
        handleError(error);
      });
    },
    [handleError],
  );

  const clearUserActionError = useCallback(() => {
    setCurrentUserActionError(null);
  }, [setCurrentUserActionError]);

  return (
    <UserActionErrorHandlerContext.Provider
      value={useMemo(
        () => ({
          currentUserActionError,
          handleError,
          handlePromise,
          clearUserActionError,
        }),
        [clearUserActionError, currentUserActionError, handleError, handlePromise],
      )}
    >
      {children}
    </UserActionErrorHandlerContext.Provider>
  );
};

export type UserErrorActionHandlerHook = {
  currentUserActionError: UserActionError;
  handleError: (error: HandleableError, onErrorCallback?: (err: UserActionError) => void) => void;
  /** @deprecated Use handleError instead, or get permission from #product-analytics to use */
  handleErrorWithEvent: (
    event: SyntheticEvent | Event,
    error: HandleableError,
    onErrorCallback?: (err: UserActionError) => void,
  ) => void;
  handlePromise: (promise: Promise<any>) => void;
  clearUserActionError: () => void;
};

export const useUserActionErrorHandler = (): UserErrorActionHandlerHook => {
  const { currentUserActionError, handleError, handlePromise, clearUserActionError } =
    useContext(UserActionErrorHandlerContext);

  const handleErrorWithEventImpl = useCallback(
    (event: SyntheticEvent | Event, error: HandleableError, onErrorCallback?: (err: UserActionError) => void) => {
      handleError(error, onErrorCallback);
    },
    [handleError],
  );

  return useMemo(
    () => ({
      currentUserActionError,
      handleError,
      handleErrorWithEvent: handleErrorWithEventImpl,
      handlePromise,
      clearUserActionError,
    }),
    [clearUserActionError, handleError, handlePromise, currentUserActionError, handleErrorWithEventImpl],
  );
};

export function withUserActionErrorHandler<P>(
  Component: React.ComponentType<React.PropsWithChildren<P>>,
  errorFilter?: (error: any) => boolean,
): React.ComponentType<React.PropsWithChildren<P>> {
  return function UserActionErrorHandlerWrapper(props: P) {
    return (
      <UserActionErrorHandler errorFilter={errorFilter}>
        {/* @ts-expect-error Generics don't play well with WithConditionalCSSProp type coming @emotion/react jsx typing to validate css= prop values typing. More details here: emotion-js/emotion#2169 */}
        <Component {...props} />
      </UserActionErrorHandler>
    );
  };
}
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/api.ts

```typescript
import invariant from 'invariant';
import { isString } from 'lodash';

import {
  type Assessment,
  type Expectation,
  type Feedback,
  type ModelTraceInfoV3,
  type ModelTraceLocation,
  type ModelTraceLocationMlflowExperiment,
  type ModelTraceLocationUcSchema,
  type ModelTraceSpanV3,
} from './ModelTrace.types';
import { fetchAPI, getAjaxUrl } from './ModelTraceExplorer.request.utils';
import { createTraceV4SerializedLocation } from './ModelTraceExplorer.utils';

export const deleteAssessment = ({ traceId, assessmentId }: { traceId: string; assessmentId: string }) =>
  fetchAPI(getAjaxUrl(`ajax-api/3.0/mlflow/traces/${traceId}/assessments/${assessmentId}`), 'DELETE');

// these fields are set by the server on create
export type CreateAssessmentPayload = {
  assessment: Omit<Assessment, 'assessment_id' | 'create_time' | 'last_update_time'>;
};

export type CreateAssessmentV3Response = {
  assessment: Assessment;
};

export const createAssessment = ({
  payload,
}: {
  payload: CreateAssessmentPayload;
}): Promise<CreateAssessmentV3Response> =>
  fetchAPI(getAjaxUrl(`ajax-api/3.0/mlflow/traces/${payload.assessment.trace_id}/assessments`), 'POST', payload);

export const fetchTraceInfoV3 = ({ traceId }: { traceId: string }) =>
  fetchAPI(getAjaxUrl(`ajax-api/3.0/mlflow/traces/${traceId}`));

export type UpdateAssessmentPayload = {
  // we only support updating these fields
  assessment: {
    feedback?: Feedback;
    expectation?: Expectation;
    rationale?: string;
    metadata?: Record<string, string>;
    assessment_name?: string;
  };
  // comma-separated list of fields to update
  update_mask: string;
};

export type UpdateAssessmentV3Response = {
  assessment: Assessment;
};

export const updateAssessment = ({
  traceId,
  assessmentId,
  payload,
}: {
  traceId: string;
  assessmentId: string;
  payload: UpdateAssessmentPayload;
}) => fetchAPI(getAjaxUrl(`ajax-api/3.0/mlflow/traces/${traceId}/assessments/${assessmentId}`), 'PATCH', payload);

export type CreateAssessmentV4Response = Assessment;

const createAssessmentV4 = ({
  // prettier-ignore
  payload: {
    assessment,
  },
  traceLocation,
}: {
  payload: CreateAssessmentPayload;
  traceLocation?: ModelTraceLocation | string;
}): Promise<CreateAssessmentV4Response> => {
  invariant(traceLocation, 'Trace location is required for creating assessment via V4 API');
  const serializedLocation = isString(traceLocation) ? traceLocation : createTraceV4SerializedLocation(traceLocation);
  invariant(serializedLocation, 'Trace location could not be resolved');

  const requestBody: Record<string, any> = assessment;

  const queryParams = new URLSearchParams();
  const endpointPath = getAjaxUrl(
    `ajax-api/4.0/mlflow/traces/${serializedLocation}/${assessment.trace_id}/assessments`,
  );
  const urlWithParams = `${endpointPath}?${queryParams.toString()}`;

  return fetchAPI(urlWithParams, 'POST', requestBody);
};

export type UpdateAssessmentV4Response = Assessment;

const updateAssessmentV4 = ({
  traceId,
  assessmentId,
  payload,
  traceLocation,
}: {
  traceId: string;
  assessmentId: string;
  payload: UpdateAssessmentPayload;
  traceLocation?: ModelTraceLocation | string;
}) => {
  const { assessment, update_mask } = payload;
  invariant(traceLocation, 'Trace location is required for creating assessment via V4 API');
  const serializedLocation = isString(traceLocation) ? traceLocation : createTraceV4SerializedLocation(traceLocation);
  invariant(serializedLocation, 'Trace location could not be resolved');

  const queryParams = new URLSearchParams();
  queryParams.append('update_mask', update_mask);
  const endpointPath = getAjaxUrl(
    `ajax-api/4.0/mlflow/traces/${serializedLocation}/${traceId}/assessments/${assessmentId}`,
  );
  const urlWithParams = `${endpointPath}?${queryParams.toString()}`;
  return fetchAPI(urlWithParams, 'PATCH', assessment);
};

const deleteAssessmentV4 = ({
  traceId,
  sqlWarehouseId,
  assessmentId,
  traceLocation,
}: {
  traceId: string;
  sqlWarehouseId?: string;
  assessmentId: string;
  traceLocation: ModelTraceLocation;
}) => {
  const queryParams = new URLSearchParams();
  const serializedLocation = createTraceV4SerializedLocation(traceLocation);
  const endpointPath = getAjaxUrl(
    `ajax-api/4.0/mlflow/traces/${serializedLocation}/${traceId}/assessments/${assessmentId}`,
  );
  const urlWithParams = `${endpointPath}?${queryParams.toString()}`;
  return fetchAPI(urlWithParams, 'DELETE');
};

export const searchTracesV4 = async ({
  signal,
  orderBy,
  locations,
  filter,
}: {
  signal?: AbortSignal;
  orderBy?: string[];
  filter?: string;
  locations?: (ModelTraceLocationMlflowExperiment | ModelTraceLocationUcSchema)[];
}) => {
  const payload: Record<string, any> = {
    locations,
    filter,
    max_results: 1000,
    order_by: orderBy,
  };
  const queryResponse = await fetchAPI(getAjaxUrl('ajax-api/4.0/mlflow/traces/search'), 'POST', payload, signal);

  const json = queryResponse as { trace_infos: ModelTraceInfoV3[]; next_page_token?: string };

  return json?.trace_infos ?? [];
};

export const getBatchTracesV4 = async ({
  traceIds,
  traceLocation,
}: {
  /**
   * List of trace IDs to fetch.
   */
  traceIds: string[];
  /**
   * Location descriptor of the traces. All provided trace ID must correspond to and share the same location.
   */
  traceLocation: ModelTraceLocation | string;
}) => {
  const locationString = isString(traceLocation) ? traceLocation : createTraceV4SerializedLocation(traceLocation);

  const endpointPath = getAjaxUrl(`ajax-api/4.0/mlflow/traces/${locationString}/batchGet`);

  const queryParams = new URLSearchParams();
  for (const traceId of traceIds) {
    queryParams.append('trace_ids', traceId);
  }

  const urlWithParams = `${endpointPath}?${queryParams.toString()}`;

  const data: {
    traces: {
      trace_info: ModelTraceInfoV3;
      spans: ModelTraceSpanV3[];
    }[];
  } = await fetchAPI(urlWithParams, 'GET');

  return data;
};

/**
 * Traces API: get a single trace (info + spans) with optional partial support. Only supported
 * by OSS SQLAlchemyStore now.
 */
export const getExperimentTraceV3 = ({ traceId }: { traceId: string }) => {
  const endpointPath = getAjaxUrl(`ajax-api/3.0/mlflow/traces/get`);

  const queryParams = new URLSearchParams();
  queryParams.append('trace_id', traceId);
  queryParams.append('allow_partial', 'true');
  const urlWithParams = `${endpointPath}?${queryParams.toString()}`;

  return fetchAPI(urlWithParams, 'GET');
};

// prettier-ignore
export const getTraceInfoV4 = ({
  traceId,
  traceLocation,
}: {
  traceId: string;
  traceLocation: ModelTraceLocation | string;
}) => {
  const serializedLocation = isString(traceLocation) ? traceLocation : createTraceV4SerializedLocation(traceLocation);
  const endpointPath = getAjaxUrl(`ajax-api/4.0/mlflow/traces/${serializedLocation}/${traceId}/info`);
  const queryParams = new URLSearchParams();

  const urlWithParams = `${endpointPath}?${queryParams.toString()}`;

  return fetchAPI(urlWithParams);
};

export const setTraceTagV4 = async ({
  traceLocation,
  tag,
  traceId,
}: {
  traceLocation: ModelTraceLocation;
  tag: { key: string; value: string };
  traceId: string;
}) => {
  const serializedTraceLocation = createTraceV4SerializedLocation(traceLocation);
  const endpointPath = getAjaxUrl(`ajax-api/4.0/mlflow/traces/${serializedTraceLocation}/${traceId}/tags`);
  const searchParams = new URLSearchParams();
  const queryString = searchParams.toString();
  const uri = `${endpointPath}?${queryString}`;
  return fetchAPI(uri, 'PATCH', tag);
};

export const deleteTraceTagV4 = async ({
  tagKey,
  traceId,
  traceLocation,
}: {
  tagKey: string;
  traceId: string;
  traceLocation: ModelTraceLocation;
}) => {
  const serializedTraceLocation = createTraceV4SerializedLocation(traceLocation);
  const endpointPath = getAjaxUrl(
    `ajax-api/4.0/mlflow/traces/${serializedTraceLocation}/${traceId}/tags/${encodeURIComponent(tagKey)}`,
  );
  const searchParams = new URLSearchParams();
  const queryString = searchParams.toString();
  const uri = `${endpointPath}?${queryString}`;
  return fetchAPI(uri, 'DELETE');
};

export const setTraceTagV3 = async ({ tag, traceId }: { tag: { key: string; value: string }; traceId: string }) => {
  const endpointPath = getAjaxUrl(`ajax-api/3.0/mlflow/traces/${traceId}/tags`);
  return fetchAPI(endpointPath, 'PATCH', tag);
};

export const deleteTraceTagV3 = async ({ tagKey, traceId }: { tagKey: string; traceId: string }) => {
  const endpointPath = getAjaxUrl(`ajax-api/3.0/mlflow/traces/${traceId}/tags`);
  const searchParams = new URLSearchParams();

  searchParams.append('key', tagKey);

  const queryString = searchParams.toString();
  const uri = `${endpointPath}?${queryString}`;
  return fetchAPI(uri, 'DELETE');
};

/**
 * Service containing methods for interacting with the V4 traces API.
 */
export const TracesServiceV4 = {
  searchTracesV4,
  getBatchTracesV4,
  getTraceInfoV4,
  createAssessmentV4,
  updateAssessmentV4,
  deleteAssessmentV4,
  // END-EDGE
  setTraceTagV4,
  deleteTraceTagV4,
};

/**
 * Service containing methods for interacting with the V3 traces API.
 */
export const TracesServiceV3 = {
  setTraceTagV3,
  deleteTraceTagV3,
};
```

--------------------------------------------------------------------------------

````

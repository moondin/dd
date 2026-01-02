---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 490
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 490 of 991)

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

---[FILE: useSetInitialTimeFilter.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/hooks/useSetInitialTimeFilter.ts
Signals: React

```typescript
import { useEffect } from 'react';
import { useSearchParams } from '../../../../../../common/utils/RoutingUtils';
import { useSearchMlflowTraces } from '@databricks/web-shared/genai-traces-table';
import { REQUEST_TIME_COLUMN_ID, TracesTableColumnType } from '@databricks/web-shared/genai-traces-table';
import { useMonitoringFilters } from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringFilters';
import { START_TIME_LABEL_QUERY_PARAM_KEY } from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringFilters';
import type {
  ModelTraceLocationMlflowExperiment,
  ModelTraceLocationUcSchema,
} from '@databricks/web-shared/model-trace-explorer';

const DEFAULT_EMPTY_CHECK_PAGE_SIZE = 500;

/**
 * Hook for setting the default time filter when there are no traces using the default time filter.
 */
export const useSetInitialTimeFilter = ({
  locations,
  isTracesEmpty,
  isTraceMetadataLoading,
  sqlWarehouseId,
  disabled = false,
}: {
  locations: (ModelTraceLocationMlflowExperiment | ModelTraceLocationUcSchema)[];
  isTracesEmpty: boolean;
  isTraceMetadataLoading: boolean;
  sqlWarehouseId?: string;
  disabled?: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const [monitoringFilters, setMonitoringFilters] = useMonitoringFilters();

  // Additional hook for fetching traces when there is no time range filters set in the
  // url params and no traces.
  const shouldFetchForEmptyCheck =
    isTracesEmpty && !isTraceMetadataLoading && !searchParams.has(START_TIME_LABEL_QUERY_PARAM_KEY);

  const { data: emptyCheckTraces, isLoading: emptyCheckLoading } = useSearchMlflowTraces({
    locations,
    tableSort: {
      key: REQUEST_TIME_COLUMN_ID,
      type: TracesTableColumnType.TRACE_INFO,
      asc: false,
    },
    disabled: !shouldFetchForEmptyCheck || disabled,
    limit: DEFAULT_EMPTY_CHECK_PAGE_SIZE,
    pageSize: DEFAULT_EMPTY_CHECK_PAGE_SIZE,
    sqlWarehouseId,
  });

  // Set monitoring filters based on oldest trace from empty check
  if (shouldFetchForEmptyCheck && emptyCheckTraces && emptyCheckTraces.length > 0 && !emptyCheckLoading) {
    // Since traces are sorted in descending order (newest first), the oldest trace is the last one while newest is the first one
    const oldestTrace = emptyCheckTraces[emptyCheckTraces.length - 1];

    setMonitoringFilters({
      startTimeLabel: 'CUSTOM',
      startTime: oldestTrace.request_time,
      endTime: new Date().toISOString(),
    });
  }

  // Return loading state so component can show loading skeleton
  const isInitialTimeFilterLoading = shouldFetchForEmptyCheck && emptyCheckLoading;

  return {
    isInitialTimeFilterLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: columnUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/utils/columnUtils.ts

```typescript
import type { RunEvaluationTracesDataEntry } from '@databricks/web-shared/genai-traces-table';
import { getTraceInfoInputs, getTraceInfoOutputs } from '@databricks/web-shared/genai-traces-table';

export const checkColumnContents = (
  evalRows: RunEvaluationTracesDataEntry[],
): { responseHasContent: boolean; inputHasContent: boolean; tokensHasContent: boolean } => {
  let responseHasContent = false;
  let inputHasContent = false;
  let tokensHasContent = false;

  for (const evalRow of evalRows) {
    const traceInfo = evalRow.traceInfo;
    if (!traceInfo) {
      continue;
    }
    if (getTraceInfoInputs(traceInfo)) {
      inputHasContent = true;
    }
    if (getTraceInfoOutputs(traceInfo)) {
      responseHasContent = true;
    }
    // TODO: consolidate all mlflow specific tags to consts in ModelTraceExplorer
    if (evalRow.traceInfo?.trace_metadata?.['mlflow.trace.tokenUsage']) {
      tokensHasContent = true;
    }
  }

  return { responseHasContent, inputHasContent, tokensHasContent };
};
```

--------------------------------------------------------------------------------

---[FILE: dateUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/traces-v3/utils/dateUtils.ts

```typescript
import type { START_TIME_LABEL } from '@mlflow/mlflow/src/experiment-tracking/hooks/useMonitoringFilters';
import type { IntlShape } from 'react-intl';

export type TimeBucket = 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export interface NamedDateFilter {
  key: START_TIME_LABEL;
  label: string;
}

export function getNamedDateFilters(intl: IntlShape): NamedDateFilter[] {
  return [
    {
      key: 'LAST_HOUR',
      label: intl.formatMessage({
        defaultMessage: 'Last hour',
        description: 'Option for the start select dropdown to filter runs from the last hour',
      }),
    },
    {
      key: 'LAST_24_HOURS',
      label: intl.formatMessage({
        defaultMessage: 'Last 24 hours',
        description: 'Option for the start select dropdown to filter runs from the last 24 hours',
      }),
    },
    {
      key: 'LAST_7_DAYS',
      label: intl.formatMessage({
        defaultMessage: 'Last 7 days',
        description: 'Option for the start select dropdown to filter runs from the last 7 days',
      }),
    },
    {
      key: 'LAST_30_DAYS',
      label: intl.formatMessage({
        defaultMessage: 'Last 30 days',
        description: 'Option for the start select dropdown to filter runs from the last 30 days',
      }),
    },
    {
      key: 'LAST_YEAR',
      label: intl.formatMessage({
        defaultMessage: 'Last year',
        description: 'Option for the start select dropdown to filter runs since the last 1 year',
      }),
    },
    {
      key: 'ALL',
      label: intl.formatMessage({
        defaultMessage: 'All',
        description: 'Option for the start select dropdown to filter runs from the beginning of time',
      }),
    },
    {
      key: 'CUSTOM',
      label: intl.formatMessage({
        defaultMessage: 'Custom',
        description: 'Option for the start select dropdown to filter runs with a custom time range',
      }),
    },
  ];
}
```

--------------------------------------------------------------------------------

---[FILE: ExperimentPageUIStateContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/contexts/ExperimentPageUIStateContext.tsx
Signals: React

```typescript
import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { createExperimentPageUIState } from '../models/ExperimentPageUIState';

const ExperimentPageUISetStateContext = React.createContext<
  React.Dispatch<React.SetStateAction<ExperimentPageUIState>>
>((state) => state);

// Creates contexts for setting current UI state
export const ExperimentPageUIStateContextProvider = ({
  children,
  setUIState,
}: {
  children: ReactNode;
  setUIState: React.Dispatch<React.SetStateAction<ExperimentPageUIState>>;
}) => (
  <ExperimentPageUISetStateContext.Provider value={setUIState}>{children}</ExperimentPageUISetStateContext.Provider>
);

export const useUpdateExperimentViewUIState = () => React.useContext(ExperimentPageUISetStateContext);
```

--------------------------------------------------------------------------------

---[FILE: GetExperimentsContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/contexts/GetExperimentsContext.tsx
Signals: React, Redux/RTK

```typescript
import { isEqual } from 'lodash';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { mapErrorWrapperToPredefinedError } from '../../../../common/utils/ErrorUtils';
import { shouldUsePredefinedErrorsInExperimentTracking } from '../../../../common/utils/FeatureUtils';
import { ErrorWrapper } from '../../../../common/utils/ErrorWrapper';
import RequestStateWrapper from '../../../../common/components/RequestStateWrapper';
import Utils from '../../../../common/utils/Utils';
import type { getExperimentApi, setCompareExperiments, setExperimentTagApi } from '../../../actions';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../../redux-types';

export interface GetExperimentsContextActions {
  setExperimentTagApi: typeof setExperimentTagApi;
  getExperimentApi: typeof getExperimentApi;
  setCompareExperiments: typeof setCompareExperiments;
}

export interface GetExperimentsContextType {
  /**
   * Function used to (re)fetch experiments using their IDs.
   */
  fetchExperiments: (experimentIds: string[]) => void;

  /**
   * Indicates if experiments are being loaded at the moment
   */
  isLoadingExperiment: boolean;

  /**
   * Contains error descriptor if fetching runs failed
   */
  requestError: ErrorWrapper | Error | null;

  /**
   * All experiment-related actions creators
   */
  actions: GetExperimentsContextActions;
}

/**
 * Wrapper context that aggregates concrete redux actions necessary to fetch experiments.
 */
export const GetExperimentsContext = createContext<GetExperimentsContextType | null>(null);

/**
 * Provider component for GetExperimentsContext.
 * Accepts concrete redux actions for searching experiments.
 */
export const GetExperimentsContextProvider = ({
  children,
  actions,
}: React.PropsWithChildren<{
  actions: GetExperimentsContextActions;
}>) => {
  const [fetchExperimentsRequestIds, setFetchExperimentsRequestIds] = useState<string[]>([]);
  const [isLoadingExperiment, setIsLoadingExperiment] = useState(false);

  const [requestError, setRequestError] = useState<any>(null);

  const dispatch = useDispatch<ThunkDispatch>();

  const fetchExperiments = useCallback(
    (experimentIds: string[]) => {
      const fetchFn = () => {
        const newRequestIds = experimentIds.map((experimentId) => {
          const requestAction = actions.getExperimentApi(experimentId);
          dispatch(requestAction).catch((e) => {
            if (!shouldUsePredefinedErrorsInExperimentTracking()) {
              Utils.logErrorAndNotifyUser(e);
            }
          });
          return requestAction.meta.id;
        });
        setFetchExperimentsRequestIds((requestIds) =>
          isEqual(newRequestIds, requestIds) ? requestIds : newRequestIds,
        );
      };

      setRequestError(null);
      fetchFn();
    },
    [actions, dispatch],
  );

  const contextValue = useMemo(
    () => ({
      fetchExperiments,
      isLoadingExperiment,
      requestError: requestError,
      actions,
    }),
    [actions, fetchExperiments, isLoadingExperiment, requestError],
  );

  const renderFn = (_isLoading: false, _renderError: any, requests: any[]) => {
    /**
     * TODO:
     * Defer setting this state because currently it might happen inside
     * RequestStateWrapper's render function which causes React to act up.
     * Either rebuild RequestStateWrapper or introduce some workaround.
     */
    setIsLoadingExperiment(requests.some((r) => fetchExperimentsRequestIds.includes(r.id) && r.active));

    if (!requestError) {
      requests.forEach((request) => {
        if (request.error) {
          if (shouldUsePredefinedErrorsInExperimentTracking()) {
            const maybePredefinedError = mapErrorWrapperToPredefinedError(request.error);
            if (maybePredefinedError) {
              setRequestError(maybePredefinedError);
              return;
            }
          }
          setRequestError(request.error);
        }
      });
    }

    return children;
  };

  return (
    <GetExperimentsContext.Provider value={contextValue}>
      <RequestStateWrapper
        shouldOptimisticallyRender
        // eslint-disable-next-line no-trailing-spaces
        requestIds={fetchExperimentsRequestIds}
      >
        {renderFn}
      </RequestStateWrapper>
    </GetExperimentsContext.Provider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: experiment-runs.fixtures.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/fixtures/experiment-runs.fixtures.ts

```typescript
import type { ExperimentStoreEntities } from '../../../types';

/**
 * Sample snapshot of the store with experiment and runs.
 *
 * Three experiments:
 * - "123456789" with 5 runs:
 *   - runs 1-4 are active
 *   - run 5 is deleted
 *   - runs 1-4 have metrics "met1", "met2" and "met3"
 *   - runs 1-3 have tags "testtag1" and "testtag2"
 *   - run 4 have tags "testtag1", "testtag2" and "testag3"
 *   - all runs have params "p1", "p2" and "p3"
 * - "654321" with one run:
 *   - active state, one metric "met1", no params
 * - "789" without runs
 * - "3210" with one run:
 *   - active state
 *   - metrics "met1" and ""
 *   - tags "testtag1" and "\t"
 *   - params "p1" and "\n"
 */
export const EXPERIMENT_RUNS_MOCK_STORE: { entities: ExperimentStoreEntities } = {
  entities: {
    artifactRootUriByRunUuid: {},
    runInputsOutputsByUuid: {},
    artifactsByRunUuid: {},
    sampledMetricsByRunUuid: {},
    modelByName: {},
    colorByRunUuid: {},
    runUuidsMatchingFilter: [],
    runDatasetsByUuid: {
      experiment123456789_run1: [
        {
          dataset: {
            digest: 'abc',
            name: 'dataset_train',
            profile: '{}',
            schema: '{}',
            source: '{}',
            sourceType: 'local',
          },
          tags: [{ key: 'mlflow.data.context', value: 'training' } as any],
        },
        {
          dataset: {
            digest: '123',
            name: 'dataset_eval',
            profile: '{}',
            schema: '{}',
            source: '{}',
            sourceType: 'local',
          },
          tags: [{ key: 'mlflow.data.context', value: 'eval' } as any],
        },
      ],
    },
    experimentsById: {
      '123456789': {
        experimentId: '123456789',
        name: '/Users/john.doe@databricks.com/test-experiment',
        artifactLocation: 'dbfs:/databricks/mlflow-tracking/123456789',
        lifecycleStage: 'active',
        lastUpdateTime: 1654502190803,
        creationTime: 1654502190803,
        tags: [
          { key: 'mlflow.ownerId', value: '987654321' },
          {
            key: 'mlflow.experiment.sourceName',
            value: '/Users/john.doe@databricks.com/test-experiment',
          },
          { key: 'mlflow.ownerId', value: '987654321' },
          { key: 'mlflow.ownerEmail', value: 'john.doe@databricks.com' },
          { key: 'mlflow.experimentType', value: 'NOTEBOOK' },
        ],
        allowedActions: ['MODIFIY_PERMISSION', 'DELETE', 'RENAME'],
      },
      '654321': {
        experimentId: '654321',
        name: '/Users/john.doe@databricks.com/test-experiment',
        artifactLocation: 'dbfs:/databricks/mlflow-tracking/654321',
        lifecycleStage: 'active',
        lastUpdateTime: 1654502190603,
        creationTime: 1654502190603,
        tags: [],
        allowedActions: ['MODIFIY_PERMISSION', 'DELETE', 'RENAME'],
      },
      '789': {
        experimentId: '789',
        name: '/Users/john.doe@databricks.com/test-experiment',
        artifactLocation: 'dbfs:/databricks/mlflow-tracking/789',
        lifecycleStage: 'active',
        lastUpdateTime: 1000502190603,
        creationTime: 1000502190603,
        tags: [],
        allowedActions: ['MODIFIY_PERMISSION', 'DELETE', 'RENAME'],
      },
      '3210': {
        experimentId: '3210',
        name: '/Users/john.doe@databricks.com/test-experiment',
        artifactLocation: 'dbfs:/databricks/mlflow-tracking/3210',
        lifecycleStage: 'active',
        lastUpdateTime: 1000502190604,
        creationTime: 1000502190604,
        tags: [],
        allowedActions: ['MODIFIY_PERMISSION', 'DELETE', 'RENAME'],
      },
    },
    runInfosByUuid: {
      experiment123456789_run1: {
        runUuid: 'experiment123456789_run1',
        runName: 'experiment123456789_run1',
        experimentId: '123456789',
        status: 'FINISHED',
        startTime: 1660116336860,
        endTime: 1660116337489,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/123456789/experiment123456789_run1/artifacts',
        lifecycleStage: 'active',
      },
      experiment123456789_run2: {
        runUuid: 'experiment123456789_run2',
        runName: 'experiment123456789_run2',
        experimentId: '123456789',
        status: 'FINISHED',
        startTime: 1660116265829,
        endTime: 1660116266518,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/123456789/experiment123456789_run2/artifacts',
        lifecycleStage: 'active',
      },
      experiment123456789_run3: {
        runUuid: 'experiment123456789_run3',
        runName: 'experiment123456789_run3',
        experimentId: '123456789',
        status: 'FINISHED',
        startTime: 1660116197855,
        endTime: 1660116198498,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/123456789/experiment123456789_run3/artifacts',
        lifecycleStage: 'active',
      },
      experiment123456789_run4: {
        runUuid: 'experiment123456789_run4',
        runName: 'experiment123456789_run4',
        experimentId: '123456789',
        status: 'FINISHED',
        startTime: 1660116194167,
        endTime: 1660116194802,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/123456789/experiment123456789_run4/artifacts',
        lifecycleStage: 'active',
      },
      experiment123456789_run5: {
        runUuid: 'experiment123456789_run5',
        runName: 'experiment123456789_run5',
        experimentId: '123456789',
        status: 'FINISHED',
        startTime: 1660116194167,
        endTime: 1660116194802,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/123456789/experiment123456789_run5/artifacts',
        lifecycleStage: 'deleted',
      },
      experiment654321_run1: {
        runUuid: 'experiment654321_run1',
        runName: 'experiment654321_run1',
        experimentId: '654321',
        status: 'FINISHED',
        startTime: 1660116161320,
        endTime: 1660116194039,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/654321/experiment654321_run1/artifacts',
        lifecycleStage: 'active',
      },
      experiment3210_run1: {
        runUuid: 'experiment3210_run1',
        runName: 'experiment3210_run1',
        experimentId: '3210',
        status: 'FINISHED',
        startTime: 1660116161321,
        endTime: 1660116194042,
        artifactUri: 'dbfs:/databricks/mlflow-tracking/3210/experiment3210_run1/artifacts',
        lifecycleStage: 'active',
      },
    },
    runInfoOrderByUuid: [
      'experiment123456789_run1',
      'experiment123456789_run2',
      'experiment123456789_run3',
      'experiment123456789_run4',
      'experiment123456789_run5',
      'experiment654321_run1',
      'experiment3210_run1',
    ],
    metricsByRunUuid: {},
    imagesByRunUuid: {},
    latestMetricsByRunUuid: {
      experiment123456789_run1: {
        met1: {
          key: 'met1',
          value: 255,
          timestamp: 1000,
          step: 0,
        },
        met2: {
          key: 'met2',
          value: 180,
          timestamp: 1000,
          step: 0,
        },
        met3: {
          key: 'met3',
          value: 333,
          timestamp: 1000,
          step: 0,
        },
      },
      experiment123456789_run2: {
        met1: {
          key: 'met1',
          value: 55,
          timestamp: 1000,
          step: 0,
        },
        met2: {
          key: 'met2',
          value: 80,
          timestamp: 1000,
          step: 0,
        },
        met3: {
          key: 'met3',
          value: 133,
          timestamp: 1000,
          step: 0,
        },
      },
      experiment123456789_run3: {
        met1: {
          key: 'met1',
          value: 5,
          timestamp: 1000,
          step: 0,
        },
        met2: {
          key: 'met2',
          value: 10,
          timestamp: 1000,
          step: 0,
        },
        met3: {
          key: 'met3',
          value: 33,
          timestamp: 1000,
          step: 0,
        },
      },
      experiment123456789_run4: {
        met1: {
          key: 'met1',
          value: 5,
          timestamp: 1000,
          step: 0,
        },
        met2: {
          key: 'met2',
          value: 10,
          timestamp: 1000,
          step: 0,
        },
        met3: {
          key: 'met3',
          value: 33,
          timestamp: 1000,
          step: 0,
        },
      },
      experiment654321_run1: {
        met1: {
          key: 'met1',
          value: 5,
          timestamp: 1000,
          step: 0,
        },
      },
      experiment3210_run1: {
        met1: {
          key: 'met1',
          value: 2,
          timestamp: 1000,
          step: 0,
        },
        '': {
          key: '',
          value: 0,
          timestamp: 1000,
          step: 0,
        },
      },
    },
    minMetricsByRunUuid: {},
    maxMetricsByRunUuid: {},
    paramsByRunUuid: {
      experiment123456789_run1: {
        p1: {
          key: 'p1',
          value: '12',
        },
        p2: {
          key: 'p2',
          value: '17',
        },
        p3: {
          key: 'p3',
          value: '57',
        },
      },
      experiment123456789_run2: {
        p1: {
          key: 'p1',
          value: '11',
        },
        p2: {
          key: 'p2',
          value: '16',
        },
        p3: {
          key: 'p3',
          value: '56',
        },
      },
      experiment123456789_run3: {
        p1: {
          key: 'p1',
          value: '10',
        },
        p2: {
          key: 'p2',
          value: '15',
        },
        p3: {
          key: 'p3',
          value: '55',
        },
      },
      experiment123456789_run4: {
        p1: {
          key: 'p1',
          value: '10',
        },
        p2: {
          key: 'p2',
          value: '15',
        },
        p3: {
          key: 'p3',
          value: '55',
        },
      },
      experiment123456789_run5: {
        p1: {
          key: 'p1',
          value: '10',
        },
        p2: {
          key: 'p2',
          value: '15',
        },
        p3: {
          key: 'p3',
          value: '55',
        },
      },
      experiment654321_run1: {},
      experiment3210_run1: {
        p1: {
          key: 'p1',
          value: '',
        },
        '\n': {
          key: '\n',
          value: '0',
        },
      },
    },
    tagsByRunUuid: {
      experiment123456789_run1: {
        testtag1: {
          key: 'testtag1',
          value: 'value1',
        },
        testtag2: {
          key: 'testtag2',
          value: 'value2',
        },
      },
      experiment123456789_run2: {
        testtag1: {
          key: 'testtag1',
          value: 'value1_2',
        },
        testtag2: {
          key: 'testtag2',
          value: 'value2_2',
        },
      },
      experiment123456789_run3: {
        testtag1: {
          key: 'testtag1',
          value: 'value1_3',
        },
        testtag2: {
          key: 'testtag2',
          value: 'value2_3',
        },
      },
      experiment123456789_run4: {
        testtag1: {
          key: 'testtag1',
          value: 'value1_4',
        },
        testtag2: {
          key: 'testtag2',
          value: 'value2_4',
        },
        testtag3: {
          key: 'testtag3',
          value: 'value3',
        },
        'tag with a space': {
          key: 'tag with a space',
          value: 'value3',
        },
      },
      experiment654321_run1: {
        testtag1: {
          key: 'testtag1',
          value: 'value1_5',
        },
        testtag2: {
          key: 'testtag2',
          value: 'value2_5',
        },
      },
      experiment3210_run1: {
        testtag1: {
          key: 'testtag1',
          value: '',
        },
        '\t': {
          key: '\t',
          value: 'value1',
        },
      },
    },
    experimentTagsByExperimentId: {
      '123456789': {
        'mlflow.ownerId': {
          key: 'mlflow.ownerId',
          value: '987654321',
        },
        'mlflow.experiment.sourceName': {
          key: 'mlflow.experiment.sourceName',
          value: '/Users/john.doe@databricks.com/test-experiment',
        },
        'mlflow.ownerEmail': {
          key: 'mlflow.ownerEmail',
          value: 'john.doe@databricks.com',
        },
        'mlflow.experimentType': {
          key: 'mlflow.experimentType',
          value: 'NOTEBOOK',
        },
      },
    },
    modelVersionsByRunUuid: {
      experiment123456789_run4: [
        {
          name: 'test_model',
          creation_timestamp: 1234,
          current_stage: '',
          last_updated_timestamp: 1234,
          run_id: 'experiment123456789_run4',
          source: 'notebook',
          status: 'active',
          user_id: '123',
          version: '1',
        },
      ],
    },
    modelVersionsByModel: {},
    datasetsByExperimentId: {
      123456789: [
        {
          experiment_id: '123456789',
          name: 'dataset_train',
          digest: 'abc',
        },
        {
          experiment_id: '123456789',
          name: 'dataset_eval',
          digest: '123',
        },
      ],
    },
  },
};

/**
 * Object mapping runUuids to mock metric history for each run.
 * This is used to test generating aggregate history for run groups,
 * for example in `createValueAggregatedMetricHistory()`.
 *
 * The "base" metric for run 1 is [5,4,3,2,1] and [0,1,2,3,5] for run 2.
 * The "metric" metric is `base - 2` for run 1, and `base + 2` for run 2.
 */

export const MOCK_RUN_UUIDS_TO_HISTORY_MAP = {
  '11ab92332f8c4ed28cac10fbfb8e0ecc': {
    runUuid: '11ab92332f8c4ed28cac10fbfb8e0ecc',
    metric: {
      metricsHistory: [
        {
          key: 'metric',
          value: 3,
          timestamp: 1706499312509,
          step: 0,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'metric',
          value: 2,
          timestamp: 1706499312755,
          step: 1,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'metric',
          value: 1,
          timestamp: 1706499312952,
          step: 2,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'metric',
          value: 0,
          timestamp: 1706499313139,
          step: 3,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'metric',
          value: -1,
          timestamp: 1706499313326,
          step: 4,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
      ],
      loading: false,
      refreshing: false,
    },
    base: {
      metricsHistory: [
        {
          key: 'base',
          value: 5,
          timestamp: 1706499312374,
          step: 0,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'base',
          value: 4,
          timestamp: 1706499312614,
          step: 1,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'base',
          value: 3,
          timestamp: 1706499312863,
          step: 2,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'base',
          value: 2,
          timestamp: 1706499313042,
          step: 3,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
        {
          key: 'base',
          value: 1,
          timestamp: 1706499313238,
          step: 4,
          run_id: '11ab92332f8c4ed28cac10fbfb8e0ecc',
        },
      ],
      loading: false,
      refreshing: false,
    },
  },
  a9b89d3b2bf54d9ba8ae539dbffa9a4c: {
    runUuid: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
    metric: {
      metricsHistory: [
        {
          key: 'metric',
          value: 3,
          timestamp: 1706499310846,
          step: 0,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'metric',
          value: 4,
          timestamp: 1706499311022,
          step: 1,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'metric',
          value: 5,
          timestamp: 1706499311240,
          step: 2,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'metric',
          value: 6,
          timestamp: 1706499311435,
          step: 3,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'metric',
          value: 7,
          timestamp: 1706499311609,
          step: 4,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
      ],
      loading: false,
      refreshing: false,
    },
    base: {
      metricsHistory: [
        {
          key: 'base',
          value: 1,
          timestamp: 1706499310738,
          step: 0,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'base',
          value: 2,
          timestamp: 1706499310937,
          step: 1,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'base',
          value: 3,
          timestamp: 1706499311144,
          step: 2,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'base',
          value: 4,
          timestamp: 1706499311337,
          step: 3,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
        {
          key: 'base',
          value: 5,
          timestamp: 1706499311522,
          step: 4,
          run_id: 'a9b89d3b2bf54d9ba8ae539dbffa9a4c',
        },
      ],
      loading: false,
      refreshing: false,
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: useCreateNewRun.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useCreateNewRun.tsx
Signals: React

```typescript
import React, { useCallback, useContext, useMemo, useState } from 'react';
import type { RunRowType } from '../utils/experimentPage.row-types';
import { EvaluationCreatePromptRunModal } from '../../evaluation-artifacts-compare/EvaluationCreatePromptRunModal';
import { shouldEnablePromptLab } from '../../../../common/utils/FeatureUtils';

const CreateNewRunContext = React.createContext<{
  createNewRun: (runToDuplicate?: RunRowType) => void;
}>({
  createNewRun: () => {},
});

/**
 * A thin context wrapper dedicated to invoke "create run" modal in various areas of the experiment runs page UI
 */
export const CreateNewRunContextProvider = ({
  children,
  visibleRuns,
  refreshRuns,
}: {
  children: React.ReactNode;
  visibleRuns: RunRowType[];
  refreshRuns: (() => Promise<never[]>) | (() => Promise<any> | null) | (() => void);
}) => {
  if (!shouldEnablePromptLab()) {
    return <>{children}</>;
  }
  /**
   * Feature flag evaluation is static in the session, so it's safe to call hooks conditionally
   */
  /* eslint-disable react-hooks/rules-of-hooks */
  const [isOpen, setIsOpen] = useState(false);
  const [runBeingDuplicated, setRunBeingDuplicated] = useState<RunRowType | null>(null);

  const contextValue = useMemo(
    () => ({
      createNewRun: (runToDuplicate?: RunRowType) => {
        setIsOpen(true);
        setRunBeingDuplicated(runToDuplicate || null);
      },
    }),
    [],
  );

  return (
    <CreateNewRunContext.Provider value={contextValue}>
      {children}
      <EvaluationCreatePromptRunModal
        visibleRuns={visibleRuns}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        runBeingDuplicated={runBeingDuplicated}
        refreshRuns={refreshRuns}
      />
    </CreateNewRunContext.Provider>
  );
};

export const useCreateNewRun = () => useContext(CreateNewRunContext);
```

--------------------------------------------------------------------------------

---[FILE: useDeleteRuns.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useDeleteRuns.tsx

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MlflowService } from '../../../sdk/MlflowService';

export const useDeleteRuns = ({ onSuccess, onError }: { onSuccess: () => void; onError?: (error: Error) => void }) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ runUuids }: { runUuids: string[] }) =>
      Promise.all(runUuids.map((runUuid) => MlflowService.deleteRun({ run_id: runUuid }))),
    onSuccess,
    onError,
  });

  return { mutate, isLoading };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentEvaluationRunsData.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentEvaluationRunsData.test.tsx

```typescript
import { describe, beforeAll, beforeEach, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from '../../../../common/utils/setup-msw';
import { useExperimentEvaluationRunsData } from './useExperimentEvaluationRunsData';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';

describe('useExperimentEvaluationRunsData', () => {
  const server = setupServer();

  beforeAll(() => server.listen());

  beforeEach(() => {
    server.use(
      rest.post('/ajax-api/2.0/mlflow/runs/search', (req, res, ctx) =>
        res(
          ctx.json({
            runs: [
              {
                info: {
                  run_uuid: 'run-1',
                  name: 'test-logged-model-1',
                  experiment_id: 'test-experiment',
                },
                outputs: {
                  model_outputs: [
                    {
                      model_id: 'm-1',
                    },
                  ],
                },
              },
              {
                info: {
                  run_uuid: 'run-2',
                  name: 'test-logged-model-1',
                  experiment_id: 'test-experiment',
                },
              },
            ],
          }),
        ),
      ),
    );
  });

  test('should separate runs with and without model outputs', async () => {
    const { result } = renderHook(
      () => useExperimentEvaluationRunsData({ experimentId: 'test-experiment', enabled: true, filter: '' }),
      {
        wrapper: ({ children }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>,
      },
    );
    await waitFor(() => {
      // expect only the run with no model output
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0]).toEqual(
        expect.objectContaining({
          info: expect.objectContaining({
            run_uuid: 'run-2',
            name: 'test-logged-model-1',
            experiment_id: 'test-experiment',
          }),
        }),
      );
    });

    expect(result.current.trainingRuns).toHaveLength(1);
    expect(result.current.trainingRuns?.[0]).toEqual(
      expect.objectContaining({
        info: expect.objectContaining({
          run_uuid: 'run-1',
          name: 'test-logged-model-1',
          experiment_id: 'test-experiment',
        }),
      }),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentEvaluationRunsData.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentEvaluationRunsData.tsx
Signals: React

```typescript
import { useInfiniteQuery } from '@databricks/web-shared/query-client';
import type { SearchRunsApiResponse } from '@mlflow/mlflow/src/experiment-tracking/types';
import { MlflowService } from '../../../sdk/MlflowService';
import { useMemo } from 'react';

export const useExperimentEvaluationRunsData = ({
  experimentId,
  enabled,
  filter,
}: {
  experimentId: string;
  enabled: boolean;
  filter: string;
}) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, refetch, error } = useInfiniteQuery<
    SearchRunsApiResponse,
    Error
  >({
    queryKey: ['SEARCH_RUNS', experimentId, filter],
    queryFn: async ({ pageParam = undefined }) => {
      const requestBody = {
        experiment_ids: [experimentId],
        order_by: ['attributes.start_time DESC'],
        run_view_type: 'ACTIVE_ONLY',
        filter,
        max_results: 50,
        page_token: pageParam,
      };

      return MlflowService.searchRuns(requestBody);
    },
    cacheTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
    getNextPageParam: (lastPage) => lastPage.next_page_token,
  });

  const { evaluationRuns, trainingRuns } = useMemo(() => {
    if (!data?.pages) {
      return { evaluationRuns: [], trainingRuns: [] };
    }
    const allRuns = data.pages.flatMap((page) => page.runs || []);
    return allRuns.reduce(
      (acc, run) => {
        const isTrainingRun = run.outputs?.modelOutputs?.length ?? 0;

        if (isTrainingRun) {
          acc.trainingRuns.push(run);
        } else {
          acc.evaluationRuns.push(run);
        }

        return acc;
      },
      { evaluationRuns: [] as typeof allRuns, trainingRuns: [] as typeof allRuns },
    );
  }, [data]);

  return {
    data: evaluationRuns,
    trainingRuns,
    hasNextPage,
    fetchNextPage,
    refetch,
    isLoading,
    isFetching,
    error,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentIds.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentIds.ts
Signals: React

```typescript
import qs from 'qs';
import { useMemo } from 'react';
import { useParams, useLocation } from '../../../../common/utils/RoutingUtils';
import Utils from '../../../../common/utils/Utils';

export type UseExperimentIdsResult = string[];

/**
 * Hook that returns requested experiment IDs basing on the URL.
 * It extracts ids basing on either route match (in case of a single experiment)
 * or query params (in case of comparing experiments.).
 *
 * @returns array of strings with experiment IDs
 */

export const useExperimentIds = (): UseExperimentIdsResult => {
  const params = useParams<{ experimentId?: string }>();
  const location = useLocation();

  const normalizedLocationSearch = useMemo(() => decodeURIComponent(location.search), [location.search]);

  /**
   * Memoized string containing experiment IDs for comparison ("?experiments=...")
   */
  const compareExperimentIdsQueryParam = useMemo(() => {
    const queryParams = qs.parse(normalizedLocationSearch.substring(1));
    if (queryParams['experiments']) {
      const experimentIdsRaw = queryParams['experiments'];
      return experimentIdsRaw?.toString() || '';
    }

    return '';
  }, [normalizedLocationSearch]);

  return useMemo(() => {
    // Case #1: single experiment
    if (params?.experimentId) {
      return [params?.experimentId];
    }

    // Case #2: multiple (compare) experiments
    if (compareExperimentIdsQueryParam) {
      try {
        return JSON.parse(compareExperimentIdsQueryParam);
      } catch {
        // Apparently URL is malformed
        Utils.logErrorAndNotifyUser(`Could not parse experiment query parameter ${compareExperimentIdsQueryParam}`);
        return '';
      }
    }

    return [];
  }, [compareExperimentIdsQueryParam, params?.experimentId]);
};
```

--------------------------------------------------------------------------------

````

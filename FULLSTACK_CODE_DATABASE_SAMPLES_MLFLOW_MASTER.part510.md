---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 510
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 510 of 991)

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

---[FILE: useRunViewActiveTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/useRunViewActiveTab.tsx

```typescript
import { useParams } from '../../../common/utils/RoutingUtils';
import { RunPageTabName } from '../../constants';

/**
 * Returns the run view's active tab.
 * - Supports multi-slash artifact paths (hence '*' catch-all param)
 * - Supports both new (/artifacts/...) and previous (/artifactPath/...) routes
 */
export const useRunViewActiveTab = (): RunPageTabName => {
  const { '*': tabParam } = useParams<{ '*': string }>();
  if (tabParam === 'model-metrics') {
    return RunPageTabName.MODEL_METRIC_CHARTS;
  }
  if (tabParam === 'system-metrics') {
    return RunPageTabName.SYSTEM_METRIC_CHARTS;
  }
  if (tabParam === 'evaluations') {
    return RunPageTabName.EVALUATIONS;
  }
  if (tabParam === 'traces') {
    return RunPageTabName.TRACES;
  }
  if (tabParam?.match(/^(artifactPath|artifacts)/)) {
    return RunPageTabName.ARTIFACTS;
  }

  return RunPageTabName.OVERVIEW;
};
```

--------------------------------------------------------------------------------

---[FILE: csv_broken.csv]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/csv/csv_broken.csv

```text
Username, Identifier,First name,Last name
booker12,9012
grey07,2070,Laura,Grey
johnson81
jenkins46,9346,Mary,Jenkins
,
smith79,5079,Jamie,Smith
```

--------------------------------------------------------------------------------

---[FILE: csv_colons.csv]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/csv/csv_colons.csv

```text
Username; Identifier;First name;Last name
booker12;9012;Rachel;Booker
grey07;2070;Laura;Grey
johnson81;4081;Craig;Johnson
jenkins46;9346;Mary;Jenkins
smith79;5079;Jamie;Smith
```

--------------------------------------------------------------------------------

---[FILE: csv_commas.csv]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/csv/csv_commas.csv

```text
Username, Identifier,First name,Last name
booker12,9012,Rachel,Booker
grey07,2070,Laura,Grey
johnson81,4081,Craig,Johnson
jenkins46,9346,Mary,Jenkins
smith79,5079,Jamie,Smith
```

--------------------------------------------------------------------------------

---[FILE: sample.geojson]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/geojson/sample.geojson

```text
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-109.050076, 41.000659],
            [-109.048044, 40.619241],
            [-109.050946, 40.444368],
            [-109.05082, 40.231093],
            [-109.050613, 39.875055],
            [-109.051263, 39.624974],
            [-109.050765, 39.366677],
            [-109.051516, 39.124982],
            [-109.054189, 38.874984],
            [-109.059538, 38.719986],
            [-109.060062, 38.275489],
            [-109.041762, 38.16469],
            [-109.042816, 37.962359],
            [-109.041058, 37.907236],
            [-109.04192, 37.530525],
            [-109.04581, 37.374993],
            [-109.045223, 36.999084],
            [-108.875317, 36.998839],
            [-108.249358, 36.999015],
            [-107.729194, 37.000002],
            [-107.464127, 37.000004],
            [-107.10724, 37.000008],
            [-106.877293, 37.000141],
            [-106.869798, 36.992424],
            [-106.591178, 36.992923],
            [-106.201469, 36.994122],
            [-105.66472, 36.995874],
            [-105.222398, 36.995166],
            [-105.029226, 36.992727],
            [-104.644997, 36.993379],
            [-104.338833, 36.993535],
            [-103.817803, 36.997339],
            [-103.499968, 36.999185],
            [-103.002199, 37.000104],
            [-102.815074, 36.999774],
            [-102.698142, 36.995149],
            [-102.375461, 36.99458],
            [-102.042089, 36.993016],
            [-102.04182, 37.410149],
            [-102.041626, 37.696699],
            [-102.044515, 37.984575],
            [-102.044946, 38.384358],
            [-102.045075, 38.669561],
            [-102.046046, 38.981776],
            [-102.049052, 39.373991],
            [-102.050952, 39.749993],
            [-102.051744, 40.003078],
            [-102.051554, 40.500023],
            [-102.051417, 40.742793],
            [-102.051717, 41.002359],
            [-102.556721, 41.0022],
            [-102.827237, 41.002143],
            [-103.365314, 41.001846],
            [-103.669054, 41.001442],
            [-104.053249, 41.001406],
            [-104.625519, 41.001428],
            [-104.855273, 40.998048],
            [-105.341415, 40.997972],
            [-105.726441, 40.996836],
            [-106.061181, 40.996999],
            [-106.314218, 40.998923],
            [-106.439563, 41.001978],
            [-106.625592, 41.00211],
            [-107.003119, 41.003421],
            [-107.241194, 41.002804],
            [-107.750627, 41.001971],
            [-108.046539, 41.002064],
            [-108.181227, 41.000455],
            [-108.526029, 40.999592],
            [-109.050076, 41.000659]
          ]
        ]
      },
      "properties": { "name": "Colorado", "ns_code": "01779779", "geoid": "08", "usps_abbrev": "CO", "fips_code": "08" }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: test_html.html]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/html/test_html.html

```text
<!DOCTYPE html>
<html>
  <head>
    <title>Test HTML</title>
  </head>
  <body>
    <h1>Test HTML</h1>
    <p>This is a test HTML file.</p>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: table_eval_broken.json]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/json/table_eval_broken.json

```json
{
  "columns": [
    "company_name",
    "company_goal",
    "prompt",
    "output",
    "MLFLOW_model",
    "MLFLOW_route_type",
    "MLFLOW_latency"
  BROKEN
```

--------------------------------------------------------------------------------

---[FILE: table_eval_data.json]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/json/table_eval_data.json

```json
{
  "columns": [
    "company_name",
    "company_goal",
    "prompt",
    "output",
    "MLFLOW_model",
    "MLFLOW_route_type",
    "MLFLOW_latency"
  ],
  "data": [
    [
      "Abc",
      "bottom line revenue",
      "You are a marketing consultant for a technology company. Develop a marketing strategy report for Abc aiming to bottom line revenue",
      " Here is an outline for a marketing strategy report aimed at increasing bottom line revenue for the technology company Abc:\n\nIntroduction \n- Brief background on Abc - products/services, target markets, competitive landscape\n- Objective of report: Provide recommendations to increase bottom line revenue through marketing strategies\n\nMarket Analysis\n- Trends in Abc's industry and target markets\n- Customer analysis - demographics, psychographics, buying behavior \n- Competitor analysis - positioning, pricing,",
      "",
      "",
      "7788.29999999702"
    ],
    [
      "XYZ Company",
      "Increase top-line revenue",
      "You are a marketing consultant for a technology company. Develop a marketing strategy report for XYZ Company aiming to Increase top-line revenue",
      " Here is an outline for a marketing strategy report aimed at increasing top-line revenue for XYZ Company:\n\nXYZ Company \nMarketing Strategy Report\n\nExecutive Summary\n- Brief overview of key recommendations to increase revenue \n\nCurrent Situation Analysis\n- Background on XYZ Company's products/services, target customers, competitive landscape\n- Analysis of current marketing efforts and sales performance \n\nOpportunities for Growth \n- New customer segments to target\n- Additional products/services to meet customer needs",
      "claude-2",
      "llm/v1/completions",
      "11563.60000000149"
    ]
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: table_unnamed_columns.json]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/json/table_unnamed_columns.json

```json
{
  "columns": [0, 1],
  "data": [
    ["a", "b"],
    [1, 2]
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: MLmodel]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/artifact-fixtures/models/MLmodel

```text
artifact_path: MLmodel
flavors:
  python_function:
    cloudpickle_version: 2.2.1
    env:
      conda: conda.yaml
      virtualenv: python_env.yaml
    loader_module: mlflow.pyfunc.model
    python_model: python_model.pkl
    python_version: 3.10.12
mlflow_version: 2.7.1
model_uuid: test-model-uuid
run_id: test-run-uuid
signature:
  inputs: '[{"type": "double", "name": "test_model_input"}]'
  outputs: '[{"type": "tensor", "name": "test_model_output", "tensor-spec": {"dtype": "float64", "shape": [-1]}}]'
  params: null
utc_time_created: '2023-01-01 10:57:16.077123'
```

--------------------------------------------------------------------------------

---[FILE: RunIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/assets/RunIcon.tsx

```typescript
export const RunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="3" r="2" stroke="#727272" strokeWidth="1.5" />
    <path
      d="M9 7.25C8.58579 7.25 8.25 7.58579 8.25 8C8.25 8.41421 8.58579 8.75 9 8.75V8V7.25ZM4.5 3V3.75H12V3V2.25H4.5V3ZM12 8V7.25H9V8V8.75H12V8ZM14.5 5.5H13.75C13.75 6.4665 12.9665 7.25 12 7.25V8V8.75C13.7949 8.75 15.25 7.29493 15.25 5.5H14.5ZM12 3V3.75C12.9665 3.75 13.75 4.5335 13.75 5.5H14.5H15.25C15.25 3.70507 13.7949 2.25 12 2.25V3Z"
      fill="#727272"
    />
    <path
      d="M6.5 8H4C2.61929 8 1.5 9.11929 1.5 10.5V10.5C1.5 11.8807 2.61929 13 4 13H13.5"
      stroke="#727272"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10.5 6.5L9.00077 8C8.96056 8 10.5 9.5 10.5 9.5"
      stroke="#727272"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12.5 11.5C12.5 11.5 14 12.972 14 13C14 13.028 12.5 14.5 12.5 14.5"
      stroke="#727272"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
```

--------------------------------------------------------------------------------

---[FILE: useGetRunQuery.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useGetRunQuery.test.tsx

```typescript
import { describe, beforeEach, it, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { graphql } from 'msw';
import { useGetRunQuery } from './useGetRunQuery';
import { setupServer } from '../../../../common/utils/setup-msw';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';
import type { GetRun } from '../../../../graphql/__generated__/graphql';
import { MlflowRunStatus } from '../../../../graphql/__generated__/graphql';

describe('useGetRunQuery', () => {
  const server = setupServer();

  beforeEach(() => {
    server.resetHandlers();
  });

  it('returns a correct data payload corresponding to mocked response', async () => {
    server.use(
      graphql.query('GetRun', (req, res, ctx) =>
        res(
          ctx.data({
            mlflowGetRun: {
              apiError: null,
              run: {
                info: {
                  runName: 'test-run-name',
                  artifactUri: 'test-artifact-uri',
                  startTime: '174000000',
                  endTime: '175000000',
                  experimentId: 'test-experiment-id',
                  lifecycleStage: 'active',
                  runUuid: 'test-run-uuid',
                  status: MlflowRunStatus.FINISHED,
                  userId: null,
                },
                experiment: {
                  artifactLocation: 'test-artifact-location',
                  experimentId: 'test-experiment-id',
                  name: 'test-experiment-name',
                  lastUpdateTime: '175000000',
                  lifecycleStage: 'active',
                  tags: [],
                },
                modelVersions: null,
                data: null,
                inputs: null,
              },
            },
          }),
        ),
      ),
    );

    const { result } = renderHook(() => useGetRunQuery({ runUuid: 'test-run-uuid' }), {
      wrapper: ({ children }) => <TestApolloProvider disableCache>{children}</TestApolloProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data?.info?.runName).toEqual('test-run-name');
    expect(result.current.data?.experiment?.name).toEqual('test-experiment-name');
  });

  it('returns an error corresponding to mocked failing response', async () => {
    server.use(
      graphql.query<GetRun>('GetRun', (req, res, ctx) => res(ctx.errors([{ message: 'test-error-message' }]))),
    );

    const { result } = renderHook(() => useGetRunQuery({ runUuid: 'test-run-uuid' }), {
      wrapper: TestApolloProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.apolloError?.message).toEqual('test-error-message');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGetRunQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useGetRunQuery.tsx

```typescript
import { type ApolloError, type ApolloQueryResult, gql } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import type { GetRun, GetRunVariables } from '../../../../graphql/__generated__/graphql';
import { useQuery, useLazyQuery } from '@mlflow/mlflow/src/common/utils/graphQLHooks';

const GET_RUN_QUERY = gql`
  query GetRun($data: MlflowGetRunInput!) @component(name: "MLflow.ExperimentRunTracking") {
    mlflowGetRun(input: $data) {
      apiError {
        helpUrl
        code
        message
      }
      run {
        info {
          runName
          status
          runUuid
          experimentId
          artifactUri
          endTime
          lifecycleStage
          startTime
          userId
        }
        experiment {
          experimentId
          name
          tags {
            key
            value
          }
          artifactLocation
          lifecycleStage
          lastUpdateTime
        }
        modelVersions {
          status
          version
          name
          source
        }
        data {
          metrics {
            key
            value
            step
            timestamp
          }
          params {
            key
            value
          }
          tags {
            key
            value
          }
        }
        inputs {
          datasetInputs {
            dataset {
              digest
              name
              profile
              schema
              source
              sourceType
            }
            tags {
              key
              value
            }
          }
          modelInputs {
            modelId
          }
        }
        outputs {
          modelOutputs {
            modelId
            step
          }
        }
      }
    }
  }
`;

export type UseGetRunQueryResponseRunInfo = NonNullable<NonNullable<UseGetRunQueryDataResponse>['info']>;
export type UseGetRunQueryResponseDatasetInputs = NonNullable<
  NonNullable<UseGetRunQueryDataResponse>['inputs']
>['datasetInputs'];
export type UseGetRunQueryResponseInputs = NonNullable<UseGetRunQueryDataResponse>['inputs'];
export type UseGetRunQueryResponseOutputs = NonNullable<UseGetRunQueryDataResponse>['outputs'];
export type UseGetRunQueryResponseExperiment = NonNullable<NonNullable<UseGetRunQueryDataResponse>['experiment']>;
export type UseGetRunQueryResponseDataMetrics = NonNullable<
  NonNullable<NonNullable<UseGetRunQueryDataResponse>['data']>['metrics']
>;

export type UseGetRunQueryDataResponse = NonNullable<GetRun['mlflowGetRun']>['run'];
export type UseGetRunQueryDataApiError = NonNullable<GetRun['mlflowGetRun']>['apiError'];
export type UseGetRunQueryResponse = {
  data?: UseGetRunQueryDataResponse;
  loading: boolean;
  apolloError?: ApolloError;
  apiError?: UseGetRunQueryDataApiError;
  refetchRun: () => Promise<ApolloQueryResult<GetRun>>;
};

export const useGetRunQuery = ({
  runUuid,
  disabled = false,
}: {
  runUuid: string;
  disabled?: boolean;
}): UseGetRunQueryResponse => {
  const {
    data,
    loading,
    error: apolloError,
    refetch,
  } = useQuery<GetRun, GetRunVariables>(GET_RUN_QUERY, {
    variables: {
      data: {
        runId: runUuid,
      },
    },
    skip: disabled,
  });

  return {
    loading,
    data: data?.mlflowGetRun?.run,
    refetchRun: refetch,
    apolloError,
    apiError: data?.mlflowGetRun?.apiError,
  } as const;
};

export const useLazyGetRunQuery = () => useLazyQuery<GetRun, GetRunVariables>(GET_RUN_QUERY);
```

--------------------------------------------------------------------------------

---[FILE: useRunDetailsPageData.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useRunDetailsPageData.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useRunDetailsPageData } from './useRunDetailsPageData';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';

import { merge } from 'lodash';
import type { ReduxState } from '../../../../redux-types';
import type { DeepPartial } from 'redux';
import { searchModelVersionsApi } from '../../../../model-registry/actions';

const mockAction = (id: string) => ({ type: 'action', payload: Promise.resolve(), meta: { id } });

jest.mock('../../../actions', () => ({
  getExperimentApi: jest.fn(() => mockAction('experiment_request')),
  getRunApi: jest.fn(() => mockAction('run_request')),
}));

jest.mock('../../../../model-registry/actions', () => ({
  searchModelVersionsApi: jest.fn(() => mockAction('models_request')),
}));

jest.mock('@mlflow/mlflow/src/common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('@mlflow/mlflow/src/common/utils/FeatureUtils')>(
    '@mlflow/mlflow/src/common/utils/FeatureUtils',
  ),
  shouldEnableGraphQLRunDetailsPage: () => false,
}));

const testRunUuid = 'test-run-uuid';
const testExperimentId = '12345';

describe('useRunDetailsPageData', () => {
  beforeEach(() => {
    jest.mocked(searchModelVersionsApi).mockClear();
  });
  const mountHook = (entities: DeepPartial<ReduxState['entities']> = {}, apis: DeepPartial<ReduxState['apis']> = {}) =>
    renderHook(() => useRunDetailsPageData({ runUuid: testRunUuid, experimentId: testExperimentId }), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MockedReduxStoreProvider
          state={{
            entities: merge(
              {
                runInfosByUuid: {},
                experimentsById: {},
                tagsByRunUuid: {
                  [testRunUuid]: [
                    { key: 'testtag1', value: '' },
                    { key: '\t', value: 'value1' },
                  ],
                },
                latestMetricsByRunUuid: {
                  [testRunUuid]: [
                    { key: 'met1', value: 2, timestamp: 1000, step: 0 },
                    { key: '', value: 0, timestamp: 1000, step: 0 },
                  ],
                },
                modelVersionsByRunUuid: {},
                paramsByRunUuid: {
                  [testRunUuid]: [
                    { key: 'p1', value: '' },
                    { key: '\n', value: '0' },
                  ],
                },
                runDatasetsByUuid: {
                  [testRunUuid]: [
                    {
                      dataset: {
                        digest: 'digest',
                        name: 'name',
                        profile: 'profile',
                        schema: 'schema',
                        source: 'source',
                        sourceType: 'sourceType',
                      },
                      tags: [{ key: 'tag1', value: 'value1' }],
                    },
                  ],
                },
              },
              entities,
            ),
            apis,
          }}
        >
          {children}
        </MockedReduxStoreProvider>
      ),
    });

  test('Fetches metrics, params, and tags with non-empty key and empty value, but not those with empty key', () => {
    const { result } = mountHook();
    const { tags, params, latestMetrics, datasets } = result.current;

    expect(tags).toEqual({ '0': { key: 'testtag1', value: '' } });
    expect(params).toEqual({ '0': { key: 'p1', value: '' } });
    expect(latestMetrics).toEqual({ '0': { key: 'met1', value: 2, timestamp: 1000, step: 0 } });
    expect(datasets).toEqual([
      {
        dataset: {
          digest: 'digest',
          name: 'name',
          profile: 'profile',
          schema: 'schema',
          source: 'source',
          sourceType: 'sourceType',
        },
        tags: [{ key: 'tag1', value: 'value1' }],
      },
    ]);
  });
  test('calls model versions API endpoint when enabled', async () => {
    const { result } = mountHook();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(searchModelVersionsApi).toHaveBeenCalled();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useRunDetailsPageData.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useRunDetailsPageData.tsx
Signals: React, Redux/RTK

```typescript
import { isEmpty, keyBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useRunDetailsPageDataLegacy } from '../useRunDetailsPageDataLegacy';
import type {
  UseGetRunQueryDataApiError,
  UseGetRunQueryResponseDataMetrics,
  UseGetRunQueryResponseDatasetInputs,
  UseGetRunQueryResponseRunInfo,
} from './useGetRunQuery';
import {
  type UseGetRunQueryResponseExperiment,
  useGetRunQuery,
  type UseGetRunQueryResponseInputs,
  type UseGetRunQueryResponseOutputs,
} from './useGetRunQuery';
import type { RunDatasetWithTags } from '../../../types';
import {
  type ExperimentEntity,
  type MetricEntitiesByName,
  type MetricEntity,
  type RunInfoEntity,
} from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import {
  shouldEnableGraphQLModelVersionsForRunDetails,
  shouldEnableGraphQLRunDetailsPage,
} from '../../../../common/utils/FeatureUtils';
import type { ThunkDispatch } from '../../../../redux-types';
import { useDispatch } from 'react-redux';
import { searchModelVersionsApi } from '../../../../model-registry/actions';
import type { ApolloError } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import type { ErrorWrapper } from '../../../../common/utils/ErrorWrapper';
import { pickBy } from 'lodash';
import {
  type RunPageModelVersionSummary,
  useUnifiedRegisteredModelVersionsSummariesForRun,
} from './useUnifiedRegisteredModelVersionsSummariesForRun';

// Internal util: transforms an array of objects into a keyed object by the `key` field
const transformToKeyedObject = <Output, Input = any>(inputArray: Input[]) =>
  // TODO: fix this type error
  // @ts-expect-error: Conversion of type 'Dictionary<Input>' to type 'Record<string, Output>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  keyBy(inputArray, 'key') as Record<string, Output>;

// Internal util: transforms an array of metric values into an array of MetricEntity objects
// GraphQL uses strings for steps and timestamp so we cast them to numbers
const transformMetricValues = (inputArray: UseGetRunQueryResponseDataMetrics): MetricEntity[] =>
  inputArray
    .filter(({ key, value, step, timestamp }) => key !== null && value !== null && step !== null && timestamp !== null)
    .map(({ key, value, step, timestamp }: any) => ({
      key,
      value,
      step: Number(step),
      timestamp: Number(timestamp),
    }));

// Internal util: transforms an array of dataset inputs into an array of RunDatasetWithTags objects
export const transformDatasets = (inputArray?: UseGetRunQueryResponseDatasetInputs): RunDatasetWithTags[] | undefined =>
  inputArray?.map((datasetInput) => ({
    dataset: {
      digest: datasetInput.dataset?.digest ?? '',
      name: datasetInput.dataset?.name ?? '',
      profile: datasetInput.dataset?.profile ?? '',
      schema: datasetInput.dataset?.schema ?? '',
      source: datasetInput.dataset?.source ?? '',
      sourceType: datasetInput.dataset?.sourceType ?? '',
    },
    tags:
      datasetInput.tags
        ?.map((tag) => ({
          key: tag.key ?? '',
          value: tag.value ?? '',
        }))
        .filter((tag) => !isEmpty(tag.key)) ?? [],
  }));

interface UseRunDetailsPageDataResult {
  experiment?: ExperimentEntity | UseGetRunQueryResponseExperiment;
  error: Error | ErrorWrapper | undefined | ApolloError;

  latestMetrics: MetricEntitiesByName;
  loading: boolean;
  params: Record<string, KeyValueEntity>;
  refetchRun: any;
  runInfo?: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  tags: Record<string, KeyValueEntity>;
  datasets?: RunDatasetWithTags[];
  runInputs?: UseGetRunQueryResponseInputs;
  runOutputs?: UseGetRunQueryResponseOutputs;

  // Only present in legacy implementation
  runFetchError?: Error | ErrorWrapper | undefined;
  experimentFetchError?: Error | ErrorWrapper | undefined;

  registeredModelVersionSummaries: RunPageModelVersionSummary[];

  // Only present in graphQL implementation
  apiError?: UseGetRunQueryDataApiError;
}

/**
 * An updated version of the `useRunDetailsPageData` hook that either uses the REST API-based implementation
 * or the GraphQL-based implementation to fetch run details, based on the `shouldEnableGraphQLRunDetailsPage` flag.
 */
export const useRunDetailsPageData = ({
  runUuid,
  experimentId,
}: {
  runUuid: string;
  experimentId: string;
}): UseRunDetailsPageDataResult => {
  const usingGraphQL = shouldEnableGraphQLRunDetailsPage();
  const dispatch = useDispatch<ThunkDispatch>();

  const enableWorkspaceModelsRegistryCall = true;

  // If GraphQL flag is enabled, use the graphQL query to fetch the run data.
  // We can safely disable the eslint rule since feature flag evaluation is stable
  /* eslint-disable react-hooks/rules-of-hooks */
  if (usingGraphQL) {
    const graphQLQuery = () =>
      useGetRunQuery({
        runUuid,
      });

    const detailsPageGraphqlResponse = graphQLQuery();

    // If model versions are colocated in the GraphQL response, we don't need to make an additional API call
    useEffect(() => {
      if (shouldEnableGraphQLModelVersionsForRunDetails()) {
        return;
      }
      if (enableWorkspaceModelsRegistryCall) {
        dispatch(searchModelVersionsApi({ run_id: runUuid }));
      }
    }, [dispatch, runUuid, enableWorkspaceModelsRegistryCall]);

    const { latestMetrics, tags, params, datasets } = useMemo(() => {
      // Filter out tags, metrics, and params that are entirely whitespace
      return {
        latestMetrics: pickBy(
          transformToKeyedObject<MetricEntity>(
            transformMetricValues(detailsPageGraphqlResponse.data?.data?.metrics ?? []),
          ),
          (metric) => metric.key.trim().length > 0,
        ),
        tags: pickBy(
          transformToKeyedObject<KeyValueEntity>(detailsPageGraphqlResponse.data?.data?.tags ?? []),
          (tag) => tag.key.trim().length > 0,
        ),
        params: pickBy(
          transformToKeyedObject<KeyValueEntity>(detailsPageGraphqlResponse.data?.data?.params ?? []),
          (param) => param.key.trim().length > 0,
        ),
        datasets: transformDatasets(detailsPageGraphqlResponse.data?.inputs?.datasetInputs),
      };
    }, [detailsPageGraphqlResponse.data]);

    const registeredModelVersionSummaries = useUnifiedRegisteredModelVersionsSummariesForRun({
      runUuid,
      queryResult: detailsPageGraphqlResponse,
    });

    return {
      runInfo: detailsPageGraphqlResponse.data?.info ?? undefined,
      experiment: detailsPageGraphqlResponse.data?.experiment ?? undefined,
      loading: detailsPageGraphqlResponse.loading,
      error: detailsPageGraphqlResponse.apolloError,
      apiError: detailsPageGraphqlResponse.apiError,
      refetchRun: detailsPageGraphqlResponse.refetchRun,
      runInputs: detailsPageGraphqlResponse.data?.inputs,
      runOutputs: detailsPageGraphqlResponse.data?.outputs,
      registeredModelVersionSummaries,
      datasets,
      latestMetrics,
      tags,
      params,
    };
  }

  // If GraphQL flag is disabled, use the legacy implementation to fetch the run data.
  const detailsPageResponse = useRunDetailsPageDataLegacy(runUuid, experimentId, enableWorkspaceModelsRegistryCall);
  const error = detailsPageResponse.errors.runFetchError || detailsPageResponse.errors.experimentFetchError;

  const registeredModelVersionSummaries = useUnifiedRegisteredModelVersionsSummariesForRun({
    runUuid,
  });

  return {
    runInfo: detailsPageResponse.data?.runInfo,
    latestMetrics: detailsPageResponse.data?.latestMetrics,
    tags: detailsPageResponse.data?.tags,
    experiment: detailsPageResponse.data?.experiment,
    params: detailsPageResponse.data?.params,
    datasets: detailsPageResponse.data?.datasets,
    loading: detailsPageResponse.loading,
    error,
    runFetchError: detailsPageResponse.errors.runFetchError,
    experimentFetchError: detailsPageResponse.errors.experimentFetchError,
    refetchRun: detailsPageResponse.refetchRun,
    registeredModelVersionSummaries,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useRunDetailsPageOverviewSectionsV2.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/hooks/useRunDetailsPageOverviewSectionsV2.tsx
Signals: React

```typescript
import { Button, FileIcon, useDesignSystemTheme } from '@databricks/design-system';
import type { AsideSections } from '@databricks/web-shared/utils';
import { KeyValueProperty, NoneCell } from '@databricks/web-shared/utils';
import { FormattedMessage, useIntl } from 'react-intl';
import type { LoggedModelProto, RunDatasetWithTags, RunInfoEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import type { UseGetRunQueryResponseRunInfo } from './useGetRunQuery';
import Utils from '../../../../common/utils/Utils';
import { RunViewTagsBox } from '../overview/RunViewTagsBox';
import { RunViewUserLinkBox } from '../overview/RunViewUserLinkBox';
import { DetailsOverviewCopyableIdBox } from '../../DetailsOverviewCopyableIdBox';
import { RunViewStatusBox } from '../overview/RunViewStatusBox';
import { RunViewParentRunBox } from '../overview/RunViewParentRunBox';
import { RunViewChildRunsBox } from '../overview/RunViewChildRunsBox';
import { EXPERIMENT_PARENT_ID_TAG } from '../../experiment-page/utils/experimentPage.common-utils';
import { RunViewDatasetBoxV2 } from '../overview/RunViewDatasetBoxV2';
import { RunViewSourceBox } from '../overview/RunViewSourceBox';
import { Link, useLocation } from '../../../../common/utils/RoutingUtils';
import { RunViewLoggedModelsBox } from '../overview/RunViewLoggedModelsBox';
import { useMemo } from 'react';
import type { RunPageModelVersionSummary } from './useUnifiedRegisteredModelVersionsSummariesForRun';
import { RunViewRegisteredModelsBox } from '../overview/RunViewRegisteredModelsBox';
import Routes from '../../../routes';
import { RunViewRegisteredPromptsBox } from '../overview/RunViewRegisteredPromptsBox';

enum RunDetailsPageMetadataSections {
  DETAILS = 'DETAILS',
  DATASETS = 'DATASETS',
  TAGS = 'TAGS',
  REGISTERED_MODELS = 'REGISTERED_MODELS',
}

export const useRunDetailsPageOverviewSectionsV2 = ({
  runUuid,
  runInfo,
  tags,
  onTagsUpdated,
  datasets,
  shouldRenderLoggedModelsBox,
  loggedModelsV3,
  registeredModelVersionSummaries,
}: {
  runUuid: string;
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  tags: Record<string, KeyValueEntity>;
  onTagsUpdated: () => void;
  datasets?: RunDatasetWithTags[];
  shouldRenderLoggedModelsBox?: boolean;
  loggedModelsV3: LoggedModelProto[];
  registeredModelVersionSummaries: RunPageModelVersionSummary[];
}): AsideSections => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const { search } = useLocation();
  const loggedModelsFromTags = useMemo(() => Utils.getLoggedModelsFromTags(tags), [tags]);

  const parentRunIdTag = tags[EXPERIMENT_PARENT_ID_TAG];

  const renderPromptMetadataRow = () => {
    return (
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Registered prompts',
          description: 'Run page > Overview > Run prompts section label',
        })}
        value={<RunViewRegisteredPromptsBox tags={tags} runUuid={runUuid} />}
      />
    );
  };

  const detailsContent = runInfo && (
    <>
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Created at',
          description: 'Run page > Overview > Run start time section label',
        })}
        value={runInfo.startTime ? Utils.formatTimestamp(runInfo.startTime, intl) : <NoneCell />}
      />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Created by',
          description: 'Run page > Overview > Run author section label',
        })}
        value={<RunViewUserLinkBox runInfo={runInfo} tags={tags} />}
      />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Experiment ID',
          description: 'Run page > Overview > experiment ID section label',
        })}
        value={
          <DetailsOverviewCopyableIdBox
            value={runInfo?.experimentId ?? ''}
            element={
              runInfo?.experimentId ? (
                <Link to={Routes.getExperimentPageRoute(runInfo.experimentId)}>{runInfo?.experimentId}</Link>
              ) : undefined
            }
          />
        }
      />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Status',
          description: 'Run page > Overview > Run status section label',
        })}
        value={<RunViewStatusBox status={runInfo.status} useSpinner />}
      />

      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Run ID',
          description: 'Run page > Overview > Run ID section label',
        })}
        value={<DetailsOverviewCopyableIdBox value={runInfo.runUuid ?? ''} />}
      />

      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Duration',
          description: 'Run page > Overview > Run duration section label',
        })}
        value={Utils.getDuration(runInfo.startTime, runInfo.endTime)}
      />

      {parentRunIdTag && (
        <KeyValueProperty
          keyValue={intl.formatMessage({
            defaultMessage: 'Parent run',
            description: 'Run page > Overview > Parent run',
          })}
          value={<RunViewParentRunBox parentRunUuid={parentRunIdTag.value} />}
        />
      )}
      <RunViewChildRunsBox runUuid={runUuid} experimentId={runInfo.experimentId ?? ''} />
      <KeyValueProperty
        keyValue={intl.formatMessage({
          defaultMessage: 'Source',
          description: 'Run page > Overview > Run source section label',
        })}
        value={
          <RunViewSourceBox
            tags={tags}
            search={search}
            runUuid={runUuid}
            css={{
              paddingTop: theme.spacing.xs,
              paddingBottom: theme.spacing.xs,
            }}
          />
        }
      />
      {shouldRenderLoggedModelsBox && (
        <KeyValueProperty
          keyValue={intl.formatMessage({
            defaultMessage: 'Logged models',
            description: 'Run page > Overview > Run models section label',
          })}
          value={
            <RunViewLoggedModelsBox
              // Pass the run info and logged models
              runInfo={runInfo}
              loggedModels={loggedModelsFromTags}
              loggedModelsV3={loggedModelsV3}
            />
          }
        />
      )}
      {renderPromptMetadataRow()}
    </>
  );

  return [
    {
      id: RunDetailsPageMetadataSections.DETAILS,
      title: intl.formatMessage({
        defaultMessage: 'About this run',
        description: 'Title for the details/metadata section on the run details page',
      }),
      content: detailsContent,
    },
    {
      id: RunDetailsPageMetadataSections.DATASETS,
      title: intl.formatMessage({
        defaultMessage: 'Datasets',
        description: 'Title for the datasets section on the run details page',
      }),
      content: datasets?.length ? (
        <RunViewDatasetBoxV2 tags={tags} runInfo={runInfo} datasets={datasets} />
      ) : (
        <NoneCell />
      ),
    },
    {
      id: RunDetailsPageMetadataSections.TAGS,
      title: intl.formatMessage({
        defaultMessage: 'Tags',
        description: 'Title for the tags section on the run details page',
      }),
      content: <RunViewTagsBox runUuid={runInfo.runUuid ?? ''} tags={tags} onTagsUpdated={onTagsUpdated} />,
    },
    {
      id: RunDetailsPageMetadataSections.REGISTERED_MODELS,
      title: intl.formatMessage({
        defaultMessage: 'Registered models',
        description: 'Title for the registered models section on the run details page',
      }),
      content:
        registeredModelVersionSummaries?.length > 0 ? (
          <RunViewRegisteredModelsBox registeredModelVersionSummaries={registeredModelVersionSummaries} />
        ) : (
          <NoneCell />
        ),
    },
  ];
};
```

--------------------------------------------------------------------------------

````

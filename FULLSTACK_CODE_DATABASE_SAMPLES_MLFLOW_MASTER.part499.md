---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 499
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 499 of 991)

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

---[FILE: experimentPage.fetch-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.fetch-utils.ts
Signals: Redux/RTK

```typescript
import { chunk, isEqual } from 'lodash';
import { AnyAction } from 'redux';
import type { searchModelVersionsApi } from '../../../../model-registry/actions';
import { MAX_RUNS_IN_SEARCH_MODEL_VERSIONS_FILTER } from '../../../../model-registry/constants';
import {
  ATTRIBUTE_COLUMN_SORT_KEY,
  DEFAULT_LIFECYCLE_FILTER,
  DEFAULT_MODEL_VERSION_FILTER,
  DEFAULT_START_TIME,
} from '../../../constants';
import { ViewType } from '../../../sdk/MlflowEnums';
import { LIFECYCLE_FILTER } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import { EXPERIMENT_LOG_MODEL_HISTORY_TAG } from './experimentPage.common-utils';
import type { ThunkDispatch } from '../../../../redux-types';
import type { ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import { RUNS_SEARCH_MAX_RESULTS } from '../../../actions';
import { getUUID } from '../../../../common/utils/ActionUtils';
import { shouldUseRegexpBasedAutoRunsSearchFilter } from '../../../../common/utils/FeatureUtils';

const START_TIME_COLUMN_OFFSET = {
  ALL: null,
  LAST_HOUR: 1 * 60 * 60 * 1000,
  LAST_24_HOURS: 24 * 60 * 60 * 1000,
  LAST_7_DAYS: 7 * 24 * 60 * 60 * 1000,
  LAST_30_DAYS: 30 * 24 * 60 * 60 * 1000,
  LAST_YEAR: 12 * 30 * 24 * 60 * 60 * 1000,
};

const VALID_TABLE_ALIASES = [
  'attribute',
  'attributes',
  'attr',
  'run',
  'metric',
  'metrics',
  'param',
  'params',
  'parameter',
  'tag',
  'tags',
  'dataset',
  'datasets',
  'model',
  'models',
];
const SQL_SYNTAX_PATTERN = new RegExp(
  `(${VALID_TABLE_ALIASES.join('|')})\\.\\S+\\s*(>|<|>=|<=|=|!=| like| ilike| rlike| in)`,
  'i',
);

export const RUNS_AUTO_REFRESH_INTERVAL = 30000;

/**
 * Creates "order by" SQL expression
 */
const createOrderByExpression = ({ orderByKey, orderByAsc }: ExperimentPageSearchFacetsState) => {
  if (orderByKey) {
    return orderByAsc ? [orderByKey + ' ASC'] : [orderByKey + ' DESC'];
  }
  return [];
};

/**
 * Creates SQL expression for filtering by run start time
 */
const createStartTimeExpression = ({ startTime }: ExperimentPageSearchFacetsState, referenceTime: number) => {
  const offset = START_TIME_COLUMN_OFFSET[startTime as keyof typeof START_TIME_COLUMN_OFFSET];
  if (!startTime || !offset || startTime === 'ALL') {
    return null;
  }
  const startTimeOffset = referenceTime - offset;

  return `attributes.start_time >= ${startTimeOffset}`;
};

/**
 * Creates SQL expression for filtering by selected datasets
 */
const createDatasetsFilterExpression = ({ datasetsFilter }: ExperimentPageSearchFacetsState) => {
  if (datasetsFilter.length === 0) {
    return null;
  }
  const datasetNames = datasetsFilter.map((dataset) => `'${dataset.name}'`).join(',');
  const datasetDigests = datasetsFilter.map((dataset) => `'${dataset.digest}'`).join(',');

  return `dataset.name IN (${datasetNames}) AND dataset.digest IN (${datasetDigests})`;
};

export const detectSqlSyntaxInSearchQuery = (searchFilter: string) => {
  return SQL_SYNTAX_PATTERN.test(searchFilter);
};

export const createQuickRegexpSearchFilter = (searchFilter: string) =>
  `attributes.run_name RLIKE '${searchFilter.replace(/'/g, "\\'")}'`;

/**
 * Combines search filter and start time SQL expressions
 */
const createFilterExpression = (
  { searchFilter }: ExperimentPageSearchFacetsState,
  startTimeExpression: string | null,
  datasetsFilterExpression: string | null,
) => {
  if (
    shouldUseRegexpBasedAutoRunsSearchFilter() &&
    searchFilter.length > 0 &&
    !detectSqlSyntaxInSearchQuery(searchFilter)
  ) {
    return createQuickRegexpSearchFilter(searchFilter);
  }

  const activeFilters = [];
  if (searchFilter) activeFilters.push(searchFilter);
  if (startTimeExpression) activeFilters.push(startTimeExpression);
  if (datasetsFilterExpression) activeFilters.push(datasetsFilterExpression);

  if (activeFilters.length === 0) return undefined;
  return activeFilters.join(' and ');
};

/**
 * If this function returns true, the ExperimentView should nest children underneath their parents
 * and fetch all root level parents of visible runs. If this function returns false, the views will
 * not nest children or fetch any additional parents. Will always return true if the orderByKey is
 * 'attributes.start_time'
 */
const shouldNestChildrenAndFetchParents = ({ orderByKey, searchFilter }: ExperimentPageSearchFacetsState) =>
  (!orderByKey && !searchFilter) || orderByKey === ATTRIBUTE_COLUMN_SORT_KEY.DATE;

/**
 *
 * Function creates API-compatible query object basing on the given criteria.
 * @param experimentIds IDs of experiments to be queries for runs
 * @param searchFacetsState the sort/filter model to use
 * @param referenceTime reference time to calculate startTime filter
 * @param pageToken next page token if fetching the next page
 */
export const createSearchRunsParams = (
  experimentIds: string[],
  searchFacetsState: ExperimentPageSearchFacetsState & { runsPinned: string[] },
  referenceTime: number,
  pageToken?: string,
  maxResults?: number,
) => {
  const runViewType =
    searchFacetsState.lifecycleFilter === LIFECYCLE_FILTER.ACTIVE ? ViewType.ACTIVE_ONLY : ViewType.DELETED_ONLY;

  const { runsPinned = undefined } = searchFacetsState;

  const orderBy = createOrderByExpression(searchFacetsState);
  const startTimeExpression = createStartTimeExpression(searchFacetsState, referenceTime);
  const datasetsFilterExpression = createDatasetsFilterExpression(searchFacetsState);
  const filter = createFilterExpression(searchFacetsState, startTimeExpression, datasetsFilterExpression);
  const shouldFetchParents = shouldNestChildrenAndFetchParents(searchFacetsState);

  return {
    // Experiment IDs
    experimentIds,

    // Filters and sort options
    filter,
    runViewType,
    orderBy,
    shouldFetchParents,

    // Next page token for loading more runs
    pageToken,
    runsPinned,

    maxResults: maxResults || RUNS_SEARCH_MAX_RESULTS,
  };
};
/**
 * Function checks if given runs set contain info about log model history and if true,
 * fetches model versions for them
 *
 * @param runsPayload runs payload returned from the searchRuns API
 * @param actionCreator redux-thunk action creator that for search model versions action
 * @param dispatch redux-compatible dispatch function
 */
export const fetchModelVersionsForRuns = (
  runsPayload: {
    info: {
      run_id: string;
    };
    data: {
      tags: KeyValueEntity[];
    };
  }[],
  actionCreator: typeof searchModelVersionsApi,
  dispatch: ThunkDispatch,
) => {
  const runsWithLogModelHistory = runsPayload.filter((run) =>
    run.data.tags.some((t) => t.key === EXPERIMENT_LOG_MODEL_HISTORY_TAG),
  );

  const promises = chunk(runsWithLogModelHistory, MAX_RUNS_IN_SEARCH_MODEL_VERSIONS_FILTER).map((runsChunk) => {
    const action = actionCreator(
      {
        run_id: runsChunk.map((run) => run.info.run_id),
      },
      getUUID(),
    );
    return dispatch(action);
  });

  return Promise.all(promises);
};

/**
 * Function consumes a search state facets object and returns `true`
 * if at least one filter-related facet is not-default meaning that runs
 * are currently filtered.
 */
export const isSearchFacetsFilterUsed = (currentSearchFacetsState: ExperimentPageSearchFacetsState) => {
  const { lifecycleFilter, modelVersionFilter, datasetsFilter, searchFilter, startTime } = currentSearchFacetsState;
  return Boolean(
    lifecycleFilter !== DEFAULT_LIFECYCLE_FILTER ||
      modelVersionFilter !== DEFAULT_MODEL_VERSION_FILTER ||
      datasetsFilter.length !== 0 ||
      searchFilter ||
      startTime !== DEFAULT_START_TIME,
  );
};
```

--------------------------------------------------------------------------------

---[FILE: experimentPage.group-row-utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.group-row-utils.test.ts

```typescript
import { describe, it, expect, test } from '@jest/globals';
import { compact, first, flatMap, get, last } from 'lodash';
import {
  createAggregatedMetricHistory,
  createRunsGroupByKey,
  createValueAggregatedMetricHistory,
  getGroupedRowRenderMetadata,
  getRunGroupDisplayName,
  normalizeRunsGroupByKey,
} from './experimentPage.group-row-utils';
import type { RowGroupRenderMetadata } from './experimentPage.row-types';
import { RunGroupingAggregateFunction, RunGroupingMode } from './experimentPage.row-types';
import type { SingleRunData } from './experimentPage.row-utils';
import { MOCK_RUN_UUIDS_TO_HISTORY_MAP } from '../fixtures/experiment-runs.fixtures';

describe('createRunsGroupByKey', () => {
  it('should return an empty string if mode is undefined', () => {
    expect(createRunsGroupByKey(undefined, 'groupByData', RunGroupingAggregateFunction.Max)).toEqual('');
  });
  it('should return the correct group key when mode is defined', () => {
    expect(createRunsGroupByKey(RunGroupingMode.Param, 'param2', RunGroupingAggregateFunction.Max)).toEqual(
      'param.max.param2',
    );
    expect(createRunsGroupByKey(RunGroupingMode.Tag, 'tagA', RunGroupingAggregateFunction.Min)).toEqual('tag.min.tagA');
    expect(createRunsGroupByKey(RunGroupingMode.Dataset, 'dataset', RunGroupingAggregateFunction.Average)).toEqual(
      'dataset.average.dataset',
    );
  });
});
describe('normalizeRunsGroupByKey', () => {
  it('should return null if groupByKey is undefined', () => {
    const groupByKey = undefined;
    const result = normalizeRunsGroupByKey(groupByKey);
    expect(result).toBeNull();
  });
  it('should return null if groupByKey does not match the expected pattern', () => {
    const groupByKey = 'invalidKey';
    const result = normalizeRunsGroupByKey(groupByKey);
    expect(result).toBeNull();
  });
  it('should return null object if group by config does not match the expected mode', () => {
    expect(normalizeRunsGroupByKey('somemode.min.groupByData')).toBeNull();
    expect(normalizeRunsGroupByKey('param.somefunction.groupByData')).toBeNull();
  });
  it('should return properly parsed group by config', () => {
    expect(normalizeRunsGroupByKey('param.min.groupByData')).toEqual({
      aggregateFunction: RunGroupingAggregateFunction.Min,
      groupByKeys: [
        {
          mode: RunGroupingMode.Param,
          groupByData: 'groupByData',
        },
      ],
    });
    expect(normalizeRunsGroupByKey('tag.max.groupByData')).toEqual({
      aggregateFunction: RunGroupingAggregateFunction.Max,
      groupByKeys: [
        {
          mode: RunGroupingMode.Tag,
          groupByData: 'groupByData',
        },
      ],
    });
    expect(normalizeRunsGroupByKey('dataset.average.dataset')).toEqual({
      aggregateFunction: RunGroupingAggregateFunction.Average,
      groupByKeys: [
        {
          mode: RunGroupingMode.Dataset,
          groupByData: 'dataset',
        },
      ],
    });
  });
});
describe('getGroupedRowRenderMetadata', () => {
  describe('grouping by single tags or single param', () => {
    const testRunData: SingleRunData[] = [
      {
        runInfo: {
          runUuid: 'run1',
        } as any,
        datasets: [],
        metrics: [{ key: 'metric1', value: 2 }] as any,
        params: [
          { key: 'param1', value: 'param_1_value_1' },
          { key: 'param2', value: 'param_2_value_1' },
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-170' },
        ] as any,
        tags: { tag1: { key: 'tag1', value: 'tag_1_value_1' }, tag2: { key: 'tag2', value: 'tag_2_value_1' } } as any,
      },
      {
        runInfo: {
          runUuid: 'run2',
        } as any,
        datasets: [],
        metrics: [{ key: 'metric1', value: 8 }] as any,
        params: [
          { key: 'param1', value: 'param_1_value_1' },
          { key: 'param2', value: 'param_2_value_2' },
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-50' },
        ] as any,
        tags: { tag1: { key: 'tag1', value: 'tag_1_value_1' }, tag2: { key: 'tag2', value: 'tag_2_value_2' } } as any,
      },
      {
        runInfo: {
          runUuid: 'run3',
        } as any,
        datasets: [],
        metrics: [{ key: 'metric1', value: 14 }] as any,
        params: [
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-80' },
        ] as any,
        tags: {},
      },
    ];
    it('grouping by tags with groups containing multiple runs and contracted ungrouped runs', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'tag1',
              mode: RunGroupingMode.Tag,
            },
          ],
        },
        groupsExpanded: {},
        runData: testRunData,
      });
      // We expect 4 rows: 2 groups and 2 runs
      expect(groupedRunsMetadata).toHaveLength(4);
      expect(get(groupedRunsMetadata, '0.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '1.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '2.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '3.isGroup')).toEqual(true);
      // First group contains runs relevant to "tag_1_value_1" value of "tag1"
      expect(get(groupedRunsMetadata, '0.groupId')).toEqual('tag.tag1.tag_1_value_1');
      // Second group contains remaining runs without value
      expect(get(groupedRunsMetadata, '3.groupId')).toEqual('tag.tag1');
    });
    it('grouping by tags with groups containing single runs and contracted ungrouped runs', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'tag2',
              mode: RunGroupingMode.Tag,
            },
          ],
        },
        groupsExpanded: {},
        runData: testRunData,
      });
      // We expect 5 rows: 3 groups and 2 runs
      expect(groupedRunsMetadata).toHaveLength(5);
      expect(get(groupedRunsMetadata, '0.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '1.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '2.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '3.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '4.isGroup')).toEqual(true);
      // First group contains runs relevant to "tag_2_value_1" value of "tag2"
      expect(get(groupedRunsMetadata, '0.groupId')).toEqual('tag.tag2.tag_2_value_1');
      // Second group contains runs relevant to "tag_2_value_2" value of "tag2"
      expect(get(groupedRunsMetadata, '2.groupId')).toEqual('tag.tag2.tag_2_value_2');
      // Third group contains remaining runs without value
      expect(get(groupedRunsMetadata, '4.groupId')).toEqual('tag.tag2');
    });
    it('grouping by tags with groups containing expanded ungrouped runs', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'tag2',
              mode: RunGroupingMode.Tag,
            },
          ],
        },
        // Expand group with remaining runs
        groupsExpanded: { 'tag.tag2': true },
        runData: testRunData,
      });
      // We expect 6 rows: 3 groups and 3 runs
      expect(groupedRunsMetadata).toHaveLength(6);
      expect(get(groupedRunsMetadata, '0.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '1.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '2.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '3.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '4.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '5.isGroup')).toBeUndefined();
      // First two runs contains that are grouped, last run is ungrouped (does not have any matching value)
      expect(get(groupedRunsMetadata, '1.belongsToGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '3.belongsToGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '5.belongsToGroup')).toEqual(false);
    });
    it('grouping using unknown mode returns only ungrouped values', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'tag2',
              mode: 'someUnknownMode' as any,
            },
          ],
        },
        groupsExpanded: {},
        runData: testRunData,
      });
      const allRunUuids = testRunData.map((run) => run.runInfo.runUuid);

      expect(get(groupedRunsMetadata, '0.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '0.isRemainingRunsGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '0.runUuids')).toEqual(allRunUuids);
    });

    it('grouping by params with groups containing all groups contracted', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'tag2',
              mode: RunGroupingMode.Tag,
            },
          ],
        },
        // Contract all groups
        groupsExpanded: { 'tag.tag2.tag_2_value_1': false, 'tag.tag2.tag_2_value_2': false, 'tag.tag2': false },
        runData: testRunData,
      });
      // We should have only group rows without any runs
      expect(groupedRunsMetadata).toHaveLength(3);
      expect(get(groupedRunsMetadata, '0.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '1.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '2.isGroup')).toEqual(true);
    });
    it.each([
      // Aggregate functions and expected metric values according to the test data
      [RunGroupingAggregateFunction.Average, 8],
      [RunGroupingAggregateFunction.Min, 2],
      [RunGroupingAggregateFunction.Max, 14],
    ])('groups by param and aggregates the metric data properly by %s', (aggregateFunction, result) => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction,
          groupByKeys: [
            {
              groupByData: 'param3',
              mode: RunGroupingMode.Param,
            },
          ],
        },
        groupsExpanded: {},
        runData: testRunData,
      });
      expect(groupedRunsMetadata).toHaveLength(4);
      expect(get(groupedRunsMetadata, '0.aggregatedMetricEntities')).toEqual([
        { key: 'metric1', value: result, maxStep: 0 },
      ]);
    });
    it.each([
      // Aggregate functions and expected param values according to the test data
      [RunGroupingAggregateFunction.Average, -100],
      [RunGroupingAggregateFunction.Min, -170],
      [RunGroupingAggregateFunction.Max, -50],
    ])('groups by param and aggregates the param data properly by %s', (aggregateFunction, result) => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction,
          groupByKeys: [
            {
              groupByData: 'param3',
              mode: RunGroupingMode.Param,
            },
          ],
        },
        groupsExpanded: {},
        runData: testRunData,
      });
      expect(groupedRunsMetadata).toHaveLength(4);
      expect(get(groupedRunsMetadata, '0.aggregatedParamEntities')).toEqual([
        { key: 'param_number', maxStep: 0, value: result },
      ]);
    });
  });
  describe('grouping by datasets', () => {
    const testRunData: SingleRunData[] = [
      {
        runInfo: {
          runUuid: 'run1',
        } as any,
        datasets: [{ dataset: { name: 'dataset_alpha', digest: '1234' } }] as any,
        metrics: [{ key: 'metric1', value: 2 }] as any,
        params: [],
        tags: {},
      },
      {
        runInfo: {
          runUuid: 'run2',
        } as any,
        datasets: [{ dataset: { name: 'dataset_alpha', digest: '1234' } }] as any,
        metrics: [{ key: 'metric1', value: 8 }] as any,
        params: [],
        tags: {},
      },
      {
        runInfo: {
          runUuid: 'run3',
        } as any,
        // Similar dataset but with another digest
        datasets: [{ dataset: { name: 'dataset_alpha', digest: '1a2b3c4d' } }] as any,
        metrics: [{ key: 'metric1', value: 14 }] as any,
        params: [],
        tags: {},
      },
      {
        runInfo: {
          runUuid: 'run4',
        } as any,
        datasets: [{ dataset: { name: 'dataset_beta', digest: '321' } }] as any,
        metrics: [{ key: 'metric1', value: 14 }] as any,
        params: [],
        tags: {},
      },
    ];
    it('grouping by datasets with groups containing multiple runs and contracted ungrouped runs', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'dataset',
              mode: RunGroupingMode.Dataset,
            },
          ],
        },
        groupsExpanded: {},
        runData: testRunData,
      });
      // We expect 7 rows: 3 groups and 4 runs
      expect(groupedRunsMetadata).toHaveLength(7);
      expect(get(groupedRunsMetadata, '0.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '1.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '2.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '3.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '4.isGroup')).toBeUndefined();
      expect(get(groupedRunsMetadata, '5.isGroup')).toEqual(true);
      expect(get(groupedRunsMetadata, '6.isGroup')).toBeUndefined();
      // We expect 3 groups - first one contains two runs
      expect(get(groupedRunsMetadata, '0.groupId')).toEqual('dataset.dataset.dataset_alpha.1234');
      expect(get(groupedRunsMetadata, '0.runUuids')).toEqual(['run1', 'run2']);
      // Second group differs only by digest and contains one run
      expect(get(groupedRunsMetadata, '3.groupId')).toEqual('dataset.dataset.dataset_alpha.1a2b3c4d');
      expect(get(groupedRunsMetadata, '3.runUuids')).toEqual(['run3']);
      // Third group contains one run
      expect(get(groupedRunsMetadata, '5.groupId')).toEqual('dataset.dataset.dataset_beta.321');
      expect(get(groupedRunsMetadata, '5.runUuids')).toEqual(['run4']);
    });
  });
  describe('grouping by multiple keys', () => {
    const smallTestRunData: SingleRunData[] = [
      {
        runInfo: {
          runUuid: 'run1',
        } as any,
        datasets: [],
        metrics: [{ key: 'metric1', value: 2 }] as any,
        params: [
          { key: 'param1', value: 'param_1_value_1' },
          { key: 'param2', value: 'param_2_value_1' },
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-170' },
        ] as any,
        tags: { tag1: { key: 'tag1', value: 'tag_1_value_1' }, tag2: { key: 'tag2', value: 'tag_2_value_1' } } as any,
      },
      {
        runInfo: {
          runUuid: 'run2',
        } as any,
        datasets: [{ dataset: { name: 'dataset_alpha', digest: '1234' } }] as any,
        metrics: [{ key: 'metric1', value: 8 }] as any,
        params: [
          { key: 'param1', value: 'param_1_value_1' },
          { key: 'param2', value: 'param_2_value_2' },
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-50' },
        ] as any,
        tags: { tag1: { key: 'tag1', value: 'tag_1_value_1' }, tag2: { key: 'tag2', value: 'tag_2_value_2' } } as any,
      },
      {
        runInfo: {
          runUuid: 'run3',
        } as any,
        datasets: [
          { dataset: { name: 'dataset_alpha', digest: '1234' } },
          { dataset: { name: 'dataset_beta', digest: '321' } },
        ] as any,
        metrics: [{ key: 'metric1', value: 14 }] as any,
        params: [
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-80' },
        ],
        tags: {},
      },
      {
        runInfo: {
          runUuid: 'run4',
        } as any,
        datasets: [] as any,
        metrics: [{ key: 'metric1', value: 14 }] as any,
        params: [
          { key: 'param3', value: 'param_3_value' },
          { key: 'param_number', value: '-80' },
        ],
        tags: {},
      },
    ];

    test('it should properly group by parameter and tag', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'param2',
              mode: RunGroupingMode.Param,
            },
            {
              mode: RunGroupingMode.Tag,
              groupByData: 'tag2',
            },
          ],
        },
        groupsExpanded: {},
        runData: smallTestRunData,
      });

      const resultingGroups = groupedRunsMetadata?.filter(({ isGroup }) => isGroup) as RowGroupRenderMetadata[];

      // We expect 3 groups: 2 groups with grouped values and 1 "remaining runs" group
      expect(resultingGroups.map(getRunGroupDisplayName)).toEqual([
        'param2: param_2_value_1, tag2: tag_2_value_1',
        'param2: param_2_value_2, tag2: tag_2_value_2',
        '',
      ]);
      expect(get(last(resultingGroups), 'isRemainingRunsGroup')).toEqual(true);

      expect(get(resultingGroups, '0.runUuids')).toEqual(['run1']);
      expect(get(resultingGroups, '1.runUuids')).toEqual(['run2']);
      expect(get(resultingGroups, '2.runUuids')).toEqual(['run3', 'run4']);
    });
    test('it should properly group by datasets and tag', () => {
      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'dataset',
              mode: RunGroupingMode.Dataset,
            },
            {
              mode: RunGroupingMode.Tag,
              groupByData: 'tag2',
            },
          ],
        },
        groupsExpanded: {},
        runData: smallTestRunData,
      });

      const resultingGroups = groupedRunsMetadata?.filter(({ isGroup }) => isGroup) as RowGroupRenderMetadata[];

      // We expect 5 groups: 4 groups with grouped values and 1 "remaining runs" group
      expect(resultingGroups.map(getRunGroupDisplayName)).toEqual([
        'tag2: tag_2_value_1, dataset: (none)',
        'tag2: tag_2_value_2, dataset: dataset_alpha.1234',
        'tag2: (none), dataset: dataset_alpha.1234',
        'tag2: (none), dataset: dataset_beta.321',
        '',
      ]);
      expect(get(last(resultingGroups), 'isRemainingRunsGroup')).toEqual(true);

      expect(get(resultingGroups, '0.runUuids')).toEqual(['run1']);
      expect(get(resultingGroups, '1.runUuids')).toEqual(['run2']);
      expect(get(resultingGroups, '2.runUuids')).toEqual(['run3']);
      expect(get(resultingGroups, '3.runUuids')).toEqual(['run3']);
      expect(get(resultingGroups, '4.runUuids')).toEqual(['run4']);
    });
    test('it should properly group heavily uncorrelated runs data', () => {
      const heavyRunsData: SingleRunData[] = new Array(50).fill(0).map((_, i) => {
        return {
          datasets: new Array(50).fill(0).map((_, j) => ({
            dataset: {
              digest: `digest_${j}`,
              name: `name_dataset${j}_run_${i}`,
            },
          })),
          metrics: [],
          params: [
            {
              key: 'param_a',
              value: `param_value_${i}`,
            },
          ],
          runInfo: {
            runUuid: `run${i}`,
          },
          tags: {
            tag_a: {
              key: 'tag_a',
              value: `tag_value_${i}`,
            },
          },
        } as any;
      });

      const groupedRunsMetadata = getGroupedRowRenderMetadata({
        groupBy: {
          aggregateFunction: RunGroupingAggregateFunction.Min,
          groupByKeys: [
            {
              groupByData: 'dataset',
              mode: RunGroupingMode.Dataset,
            },
            {
              mode: RunGroupingMode.Tag,
              groupByData: 'tag_a',
            },
            {
              mode: RunGroupingMode.Param,
              groupByData: 'param_a',
            },
          ],
        },
        groupsExpanded: {},
        runData: heavyRunsData,
      });

      // We expect 50*50 groups and 50*50 runs, since there are
      // 50 distinct datasets in each run with 50 distinct tag and param values
      const resultingGroups = groupedRunsMetadata?.filter(({ isGroup }) => isGroup) as RowGroupRenderMetadata[];
      const resultingRuns = groupedRunsMetadata?.filter(({ isGroup }) => !isGroup) as RowGroupRenderMetadata[];
      expect(resultingGroups).toHaveLength(50 * 50);
      expect(resultingRuns).toHaveLength(50 * 50);
    });
  });
});

describe('metric history aggregation', () => {
  it('correctly generates aggregated metrics', () => {
    // for metric vs metric plotting
    const {
      min: valuesMin,
      max: valuesMax,
      average: valuesAvg,
    } = createValueAggregatedMetricHistory(
      MOCK_RUN_UUIDS_TO_HISTORY_MAP,
      'metric', // metricKey
      'base', // selectedXAxisMetricKey
      false, // ignoreOutliers
    );
    // for metric vs step plotting
    const metricsHistoryInGroup = flatMap(MOCK_RUN_UUIDS_TO_HISTORY_MAP, (obj) => {
      return obj['metric'].metricsHistory;
    });
    const steps = [0, 1, 2, 3, 4];
    const {
      min: stepMin,
      max: stepMax,
      average: stepAvg,
    } = createAggregatedMetricHistory(steps, 'metric', metricsHistoryInGroup);
    /**
     * the mock metric object is constructed such that the min and max
     * are -2 and +2 with respect to the base. however, the base differs
     * from run to run, for example:
     *
     * run1 (metric is +2): base = [1, 2, 3, 4, 5], metric = [3, 4, 5, 6, 7]
     * run2 (metric is -2): base = [5, 4, 3, 2, 1], metric = [3, 2, 1, 0, -1]
     *
     * therefore, when `metric` is plotted with `base` as the x-axis, we should
     * see min/max consistently being +/- 2 vs. average.
     *
     * with `steps` as the x-axis, we should see the range expand from +/- 0 to +/- 8.
     *
     * the asserts below should illustrate the differences between the two
     * aggregators.
     */
    expect(valuesAvg.map((e) => e.value)).toEqual([1, 2, 3, 4, 5]);
    expect(stepAvg.map((e) => e.value)).toEqual([3, 3, 3, 3, 3]);
    expect(valuesMin.map((e) => e.value)).toEqual([-1, 0, 1, 2, 3]);
    expect(stepMin.map((e) => e.value)).toEqual([3, 2, 1, 0, -1]);
    expect(valuesMax.map((e) => e.value)).toEqual([3, 4, 5, 6, 7]);
    expect(stepMax.map((e) => e.value)).toEqual([3, 4, 5, 6, 7]);
  });
});
```

--------------------------------------------------------------------------------

````

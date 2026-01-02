---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 502
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 502 of 991)

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

---[FILE: experimentPage.row-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentPage.row-utils.ts
Signals: React

```typescript
import { useMemo } from 'react';
import { isNumber, isString, keyBy, last, sortBy, uniq } from 'lodash';
import Utils from '../../../../common/utils/Utils';
import type {
  ExperimentEntity,
  ModelVersionInfoEntity,
  RunInfoEntity,
  RunDatasetWithTags,
  MetricEntity,
} from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import type { LoggedModelProto } from '../../../types';
import type {
  RowGroupRenderMetadata,
  RowRenderMetadata,
  RunGroupParentInfo,
  RunRowDateAndNestInfo,
  RunRowModelsInfo,
  RunRowType,
  RunRowVersionInfo,
} from './experimentPage.row-types';
import { RunGroupingAggregateFunction, RunGroupingMode } from './experimentPage.row-types';
import type { ExperimentRunsSelectorResult } from './experimentRuns.selector';
import {
  EXPERIMENT_FIELD_PREFIX_METRIC,
  EXPERIMENT_FIELD_PREFIX_PARAM,
  EXPERIMENT_FIELD_PREFIX_TAG,
  EXPERIMENT_PARENT_ID_TAG,
} from './experimentPage.common-utils';
import { getStableColorForRun } from '../../../utils/RunNameUtils';
import { getGroupedRowRenderMetadata, type RunsGroupByConfig } from './experimentPage.group-row-utils';
import { type ExperimentPageUIState, RUNS_VISIBILITY_MODE } from '../models/ExperimentPageUIState';
import { determineIfRowIsHidden } from './experimentPage.common-row-utils';
import { type ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';

/**
 * A simple tree-like interface used in nested rows calculations.
 */
interface SimpleTreeNode {
  value: string;
  parent?: SimpleTreeNode;
}

/**
 * For a given run dataset from the store, this function prepares
 * a list of rows metadata discarding any information about the parent/child run hierarchy.
 */
const getFlatRowRenderMetadata = (runData: SingleRunData[]) =>
  runData.map<RowRenderMetadata>(({ runInfo, metrics = [], params = [], tags = {}, datasets = [] }, index) => ({
    index,
    runInfo,
    level: 0, // All runs will be on "0" level here,
    isPinnable: !tags[EXPERIMENT_PARENT_ID_TAG]?.value,
    metrics: metrics,
    params: params,
    tags: tags,
    datasets: datasets,
    rowUuid: runInfo.runUuid,
  }));

/**
 * For a given run dataset from the store, this function prepares
 * a list of rows metadata taking the parent/child run hierarchy into consideration.
 */
const getNestedRowRenderMetadata = ({
  runsExpanded,
  runData,
}: {
  runsExpanded: Record<string, boolean>;
  runData: SingleRunData[];
}) => {
  // First, map run IDs to their indices - will be helpful later on.
  const runIdToIndex: Record<string, number> = {};
  runData.forEach(({ runInfo }, index) => {
    runIdToIndex[runInfo.runUuid] = index;
  });

  // Create a list of tree nodes for all run infos. Each leaf's value is the run UUID.
  const treeNodes: SimpleTreeNode[] = runData.map(({ runInfo }) => ({ value: runInfo.runUuid }));

  // We're going to check if any hierarchy is detected in the run set. If not,
  // we will not bother with unnecessary calculations.
  let foundHierarchy = false;

  // Iterate through all the tags and assign proper parent references
  runData.forEach(({ tags }, index) => {
    const parentRunId = tags?.[EXPERIMENT_PARENT_ID_TAG];
    if (parentRunId) {
      const parentRunIndex = runIdToIndex[parentRunId.value];
      if (parentRunIndex !== undefined) {
        foundHierarchy = true;
        treeNodes[index].parent = treeNodes[parentRunIndex];
      }
    }
  });

  // If no parent tags are found, we're not going calculate
  // tree-related stuff and return a flat list instead.
  if (!foundHierarchy) {
    return getFlatRowRenderMetadata(runData);
  }

  // Iterate through the tree and convert it to a flat parent->children mapping array
  const parentIdToChildren: Record<string, number[]> = {};
  const rootIndexes: any[] = [];
  treeNodes.forEach((treeNode, index) => {
    const { parent } = treeNode;
    if (parent !== undefined && parent.value !== treeNode.value) {
      if (parentIdToChildren[parent.value]) {
        parentIdToChildren[parent.value].push(index);
      } else {
        parentIdToChildren[parent.value] = [index];
      }
    } else {
      // If a node has no parent, let's register it as a root index
      rootIndexes.push(index);
    }
  });

  const resultRowsMetadata: RowRenderMetadata[] = [];

  // Create and invoke a simple DFS search with "visited" set so we won't be caught in a cycle
  const visited = new Set();
  const doDfs = (dfsIndex: number, currLevel: number) => {
    if (!visited.has(dfsIndex)) {
      const currentNodeRunInfo = runData[dfsIndex].runInfo;
      const currentNodeRunId = currentNodeRunInfo.runUuid;

      // Only rows that are top-level parents or those being on the top level are pinnable
      const isPinnable = Boolean(rootIndexes.includes(dfsIndex)) || currLevel === 0;

      const rowMetadata: RowRenderMetadata = {
        index: dfsIndex,
        isParent: false,
        hasExpander: false,
        level: currLevel,
        runInfo: currentNodeRunInfo,
        params: runData[dfsIndex].params || [],
        metrics: runData[dfsIndex].metrics || [],
        tags: runData[dfsIndex].tags || {},
        datasets: runData[dfsIndex].datasets || [],
        isPinnable,
        rowUuid: currentNodeRunId,
      };
      if (parentIdToChildren[currentNodeRunId]) {
        rowMetadata.isParent = true;
        rowMetadata.hasExpander = true;
        rowMetadata.expanderOpen = Boolean(runsExpanded[currentNodeRunId]);
        rowMetadata.childrenIds = parentIdToChildren[currentNodeRunId].map((cIdx) => runData[cIdx].runInfo.runUuid);
      }

      resultRowsMetadata.push(rowMetadata);
      visited.add(dfsIndex);

      const childrenIndices = parentIdToChildren[currentNodeRunId];
      // Repeat DFS for children nodes - only if the current node is expanded
      if (childrenIndices) {
        if (runsExpanded[currentNodeRunId]) {
          childrenIndices.forEach((dIdx) => {
            doDfs(dIdx, currLevel + 1);
          });
        }
      }
    }
  };

  // Invoke the DFS for all root indexes
  rootIndexes.forEach((rootNodeIndex) => {
    doDfs(rootNodeIndex, 0);
  });
  return resultRowsMetadata;
};

/**
 * Iterates through all key/value data given for a run and
 * returns mapped dataset in a "PREFIX-NAME" form, e.g. '$$$param$$$-paramname".
 * Fills '-' placeholder in all empty places.
 */
const createKeyValueDataForRunRow = (
  list: { key: string; value: string | number }[],
  keys: (string | number)[],
  prefix: string,
) => {
  if (!list) {
    return {};
  }

  const map: Record<string, string | number> = {};

  // First, populate all values (cells) with default placeholder: '-'
  for (const key of keys) {
    map[`${prefix}-${key}`] = '-';
  }

  // Then, override with existing value if found
  for (const { key, value } of list) {
    if (value || isNumber(value)) {
      map[`${prefix}-${key}`] = value;
    }
  }

  return map;
};

/**
 * Creates ag-grid compatible row dataset for all given runs basing on
 * the data retrieved from the API and from the refux store.
 * Please refer to PrepareRunsGridDataParams type for type reference.
 */
export const prepareRunsGridData = ({
  experiments,
  modelVersionsByRunUuid,
  loggedModelsV3ByRunUuid = {},
  runsExpanded,
  nestChildren,
  referenceTime,
  paramKeyList,
  metricKeyList,
  tagKeyList,
  runsPinned,
  runsHidden,
  runsHiddenMode = RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
  runsVisibilityMap = {},
  runData,
  runUuidsMatchingFilter,
  groupBy = null,
  groupsExpanded = {},
  useGroupedValuesInCharts,
  searchFacetsState,
}: PrepareRunsGridDataParams) => {
  const experimentNameMap = Utils.getExperimentNameMap(Utils.sortExperimentsById(experiments)) as Record<
    string,
    { name: string; basename: string }
  >;

  // Gate grouping by the feature flag
  const shouldGroupRows = Boolean(groupBy);

  // Early returning function that will return relevant row render metadata depending on a determined mode.
  // It can be either grouped rows, nested rows (parent/child) or flat rows.
  const getRowRenderMetadata = (): (RowRenderMetadata | RowGroupRenderMetadata)[] => {
    // If grouping is enabled and configured, we will return grouped rows
    if (shouldGroupRows) {
      const groupedRows = getGroupedRowRenderMetadata({
        runData,
        groupBy,
        groupsExpanded,
        searchFacetsState,
        runsHidden,
        runsVisibilityMap,
        runsHiddenMode,
        useGroupedValuesInCharts,
      });

      if (groupedRows) {
        return groupedRows;
      }
    }

    // If nesting is enabled, we will return nested rows
    if (nestChildren) {
      return getNestedRowRenderMetadata({
        runData,
        runsExpanded,
      });
    }

    // Otherwise, we will return flat list of rows
    return getFlatRowRenderMetadata(runData);
  };

  // We will aggregate children of pinned parent rows here so we will easily pin them as well
  const childrenToPin: string[] = [];

  // Now, enrich the intermediate row metadata with attributes, metrics and params and
  // return it as a grid-consumable "RunRowType" type.
  const rows = getRowRenderMetadata().map<RunRowType>((runOrGroupInfoMetadata) => {
    // If the row is a group parent, we will create a special row for it
    if (runOrGroupInfoMetadata.isGroup) {
      return createGroupParentRow(runOrGroupInfoMetadata, runsPinned, metricKeyList, paramKeyList);
    }

    const {
      runInfo,
      isParent = false,
      hasExpander = false,
      level = 0,
      expanderOpen = false,
      isPinnable = false,
      childrenIds = [],
      tags,
      params,
      metrics,
      datasets,
      belongsToGroup,
      rowUuid,
      visibilityControl,
      hidden,
    } = runOrGroupInfoMetadata;

    // Extract necessary basic info
    const runUuid = runInfo.runUuid;
    const { experimentId } = runInfo;
    const experimentName = experimentNameMap[experimentId];
    const user = Utils.getUser(runInfo, tags);
    const duration = Utils.getDuration(runInfo.startTime, runInfo.endTime);
    const runName = Utils.getRunName(runInfo) || runInfo.runUuid;

    // Extract visible tags (i.e. those not prefixed with "mlflow.")
    const visibleTags = Utils.getVisibleTagValues(tags).map(([key, value]) => ({
      key,
      value,
    }));

    // Prepare a data package to be used by "Start time" cell
    const runDateAndNestInfo: RunRowDateAndNestInfo = {
      startTime: runInfo.startTime,
      referenceTime,
      experimentId,
      runUuid,
      runStatus: runInfo.status,
      isParent,
      hasExpander,
      expanderOpen,
      childrenIds,
      level,
      belongsToGroup: Boolean(belongsToGroup),
    };

    // Prepare a data package to be used by "Models" cell
    const models: RunRowModelsInfo = {
      registeredModels: modelVersionsByRunUuid[runInfo.runUuid] || [], // ModelInfoEntity
      loggedModels: Utils.getLoggedModelsFromTags(tags),
      loggedModelsV3: loggedModelsV3ByRunUuid[runInfo.runUuid] || [],
      experimentId: runInfo.experimentId,
      runUuid: runInfo.runUuid,
    };

    // Prepare a data package to be used by "Version" cell
    const version: RunRowVersionInfo = {
      version: Utils.getSourceVersion(tags),
      name: Utils.getSourceName(tags),
      type: Utils.getSourceType(tags),
    };

    const isCurrentRowPinned = isPinnable && runsPinned.includes(runUuid);
    const isParentPinned = childrenToPin.includes(runUuid);

    // If this or a parent row is pinned, pin children as well
    if (isCurrentRowPinned || isParentPinned) {
      childrenToPin.push(...childrenIds);
    }

    // Compile everything into a data object to be consumed by the grid component
    return {
      runUuid,
      rowUuid,
      runDateAndNestInfo,
      runInfo,
      experimentName,
      experimentId,
      duration,
      user,
      runName,
      runStatus: runInfo.status,
      tags,
      models,
      params,
      version,
      pinnable: isPinnable,
      defaultColor: getStableColorForRun(runUuid),
      visibilityControl,
      hidden: hidden ?? false,
      pinned: isCurrentRowPinned || isParentPinned,
      ...createKeyValueDataForRunRow(params, paramKeyList, EXPERIMENT_FIELD_PREFIX_PARAM),
      ...createKeyValueDataForRunRow(metrics, metricKeyList, EXPERIMENT_FIELD_PREFIX_METRIC),
      datasets,
      ...createKeyValueDataForRunRow(visibleTags, tagKeyList, EXPERIMENT_FIELD_PREFIX_TAG),
    };
  });

  // If grouping is enabled, we need to group rows into chunks and hoist pinned rows within them
  if (shouldGroupRows && rows.some((row) => row.groupParentInfo)) {
    const chunks = rows.reduce<RunRowType[][]>((chunkContainer, run) => {
      if (run.groupParentInfo) {
        chunkContainer.push([]);
      }
      last(chunkContainer)?.push(run);
      return chunkContainer;
    }, []);

    const sortedChunks = sortBy(
      chunks,
      (chunk) => chunk[0]?.groupParentInfo && !runsPinned.includes(chunk[0]?.groupParentInfo?.groupId),
    );

    const chunksWithSortedRuns = sortedChunks.map((chunkRuns) => {
      const [groupHeader, ...runs] = chunkRuns;
      return [groupHeader, ...hoistPinnedRuns(runs, runUuidsMatchingFilter)];
    });

    const groupedRuns = chunksWithSortedRuns.flat();

    return groupedRuns;
  }

  // If the flat structure is displayed, we can hoist pinned rows to the top
  return determineVisibleRuns(
    hoistPinnedRuns(rows, runUuidsMatchingFilter),
    runsHidden,
    runsHiddenMode,
    runsVisibilityMap,
  );
};

// Hook version of prepareRunsGridData()
export const useExperimentRunRows = ({
  experiments,
  modelVersionsByRunUuid,
  loggedModelsV3ByRunUuid,
  runsExpanded,
  nestChildren,
  referenceTime,
  paramKeyList,
  metricKeyList,
  tagKeyList,
  runsPinned,
  runsHidden,
  runsVisibilityMap,
  runData,
  runUuidsMatchingFilter,
  groupBy,
  runsHiddenMode,
  groupsExpanded = {},
  useGroupedValuesInCharts,
  searchFacetsState,
}: PrepareRunsGridDataParams) =>
  useMemo(
    () =>
      prepareRunsGridData({
        experiments,
        modelVersionsByRunUuid,
        loggedModelsV3ByRunUuid,
        runsExpanded,
        nestChildren,
        referenceTime,
        paramKeyList,
        metricKeyList,
        tagKeyList,
        runsPinned,
        runsHidden,
        runsVisibilityMap,
        runData,
        runUuidsMatchingFilter,
        groupBy,
        groupsExpanded,
        runsHiddenMode,
        useGroupedValuesInCharts,
        searchFacetsState,
      }),
    [
      // Explicitly include each dependency here to avoid unnecessary recalculations
      experiments,
      modelVersionsByRunUuid,
      loggedModelsV3ByRunUuid,
      runsExpanded,
      nestChildren,
      referenceTime,
      paramKeyList,
      metricKeyList,
      tagKeyList,
      runsPinned,
      runsHidden,
      runsVisibilityMap,
      runData,
      runUuidsMatchingFilter,
      groupBy,
      groupsExpanded,
      runsHiddenMode,
      useGroupedValuesInCharts,
      searchFacetsState,
    ],
  );

const determineVisibleRuns = (
  runs: RunRowType[],
  runsHidden: string[],
  runsHiddenMode: RUNS_VISIBILITY_MODE,
  runsVisibilityMap: Record<string, boolean> = {},
): RunRowType[] => {
  // In the new visibility model, we will count rows that can change visibility (groups and ungrouped runs)
  // and use the counter to limit the visible rows based on selected mode
  let visibleRowCounter = 0;
  return runs.map((runRow) => {
    // If a row is a run group, we use its rowUuid for setting visibility.
    // If this is a run, use runUuid.
    const runUuidToToggle = runRow.groupParentInfo ? runRow.rowUuid : runRow.runUuid;

    const rowWithHiddenFlag = {
      ...runRow,
      hidden: determineIfRowIsHidden(
        runsHiddenMode,
        runsHidden,
        runUuidToToggle,
        visibleRowCounter,
        runsVisibilityMap,
        runRow.runStatus,
      ),
    };

    const isGroupContainingRuns = runRow.groupParentInfo && !runRow.groupParentInfo.isRemainingRunsGroup;
    const isUngroupedRun = !runRow.runDateAndNestInfo?.belongsToGroup;
    if (isGroupContainingRuns || isUngroupedRun) {
      visibleRowCounter++;
    }

    return rowWithHiddenFlag;
  });
};

const hoistPinnedRuns = (rowCollection: RunRowType[], uuidWhitelist: string[]) => [
  // Add pinned rows to the top
  ...rowCollection.filter(({ pinned }) => pinned),

  // Next, add all remaining rows - however, sweep out all runs that don't match the current filter. This
  // will hide all filtered out runs that were pinned before, but were eventually un-pinned.
  ...rowCollection.filter(({ pinned, runUuid }) => runUuid && !pinned && uuidWhitelist.includes(runUuid)),
];

export type SingleRunData = {
  runInfo: RunInfoEntity;
  params: KeyValueEntity[];
  metrics: MetricEntity[];
  datasets: RunDatasetWithTags[];
  tags: Record<string, KeyValueEntity>;
};

/**
 * All parameters necessary to calculate run row data.
 */
type PrepareRunsGridDataParams = Pick<
  ExperimentRunsSelectorResult,
  'metricKeyList' | 'paramKeyList' | 'modelVersionsByRunUuid'
> &
  Pick<
    ExperimentPageUIState,
    'runsExpanded' | 'runsPinned' | 'runsHidden' | 'useGroupedValuesInCharts' | 'runsVisibilityMap'
  > &
  Partial<Pick<ExperimentPageUIState, 'groupsExpanded' | 'runsHiddenMode'>> & {
    /**
     * List of experiments containing the runs
     */
    experiments: ExperimentEntity[];

    /**
     * Registered model versions arrays per run uuid
     */
    modelVersionsByRunUuid: Record<string, ModelVersionInfoEntity[]>;

    /**
     * Logged models v3 data
     */
    loggedModelsV3ByRunUuid?: Record<string, LoggedModelProto[]>;
    /**
     * Boolean flag indicating if hierarchical runs should be generated
     */
    nestChildren: boolean;

    /**
     * List of all visible tag keys
     */
    tagKeyList: string[];

    /**
     * A reference time necessary to calculate "xxx minutes ago"-like labels
     */
    referenceTime: Date;

    /**
     * List of simplified run objects containing all relevant data
     */
    runData: SingleRunData[];

    /**
     * List of all runs IDs that match the current filter
     * (this excludes all rows that on the list just because they are pinned)
     */
    runUuidsMatchingFilter: string[];

    groupBy: string | RunsGroupByConfig | null;

    searchFacetsState?: Readonly<ExperimentPageSearchFacetsState>;
  };

export const extractRunRowParamFloat = (run: RunRowType, paramName: string, fallback = undefined) => {
  const paramEntity = extractRunRowParam(run, paramName);
  if (!paramEntity) {
    return fallback;
  }

  const parsed = parseFloat(paramEntity);
  return isNaN(parsed) ? fallback : parsed;
};

export const extractRunRowParamInteger = (run: RunRowType, paramName: string, fallback = undefined) => {
  const paramEntity = extractRunRowParam(run, paramName);
  if (!paramEntity) {
    return fallback;
  }

  const parsed = parseInt(paramEntity, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const extractRunRowParam = (run: RunRowType, paramName: string, fallback = undefined) => {
  const paramEntity = run.params?.find(({ key }) => paramName === key);
  return paramEntity?.value || fallback;
};

/**
 * Creates a group parent row based on a run group render metadata object.
 */
const createGroupParentRow = (
  groupRunMetadata: RowGroupRenderMetadata,
  runsPinned: string[],
  metricKeyList: string[],
  paramKeyList: string[],
): RunRowType => {
  const groupParentInfo: RunGroupParentInfo = {
    groupingValues: groupRunMetadata.groupingValues,
    isRemainingRunsGroup: groupRunMetadata.isRemainingRunsGroup,
    expanderOpen: groupRunMetadata.expanderOpen,
    groupId: groupRunMetadata.groupId,
    aggregatedMetricData: keyBy(groupRunMetadata.aggregatedMetricEntities, 'key'),
    aggregatedParamData: keyBy(groupRunMetadata.aggregatedParamEntities, 'key'),
    runUuids: groupRunMetadata.runUuids,
    runUuidsForAggregation: groupRunMetadata.runUuidsForAggregation,
    aggregateFunction: groupRunMetadata.aggregateFunction,
    allRunsHidden: groupRunMetadata.allRunsHidden,
  };

  return {
    // Group parent rows have no run UUIDs set
    runUuid: '',
    datasets: [],
    pinnable: true,
    duration: null,
    models: null,
    rowUuid: groupParentInfo.groupId,
    groupParentInfo: groupParentInfo,
    pinned: runsPinned.includes(groupParentInfo.groupId),
    defaultColor: getStableColorForRun(groupParentInfo.groupId),
    visibilityControl: groupRunMetadata.visibilityControl,
    hidden: groupRunMetadata.hidden ?? false,
    ...createKeyValueDataForRunRow(
      groupRunMetadata.aggregatedMetricEntities,
      metricKeyList,
      EXPERIMENT_FIELD_PREFIX_METRIC,
    ),
    ...createKeyValueDataForRunRow(
      groupRunMetadata.aggregatedParamEntities,
      paramKeyList,
      EXPERIMENT_FIELD_PREFIX_PARAM,
    ),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: experimentRuns.selector.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentRuns.selector.test.tsx
Signals: Redux/RTK

```typescript
import { describe, it, expect } from '@jest/globals';
import { renderHook } from '../../../../common/utils/TestUtils.react18';
import { Provider, useSelector } from 'react-redux';
import type { DeepPartial } from 'redux';
import { createStore } from 'redux';
import { EXPERIMENT_RUNS_MOCK_STORE } from '../fixtures/experiment-runs.fixtures';
import type { ExperimentRunsSelectorParams } from './experimentRuns.selector';
import { experimentRunsSelector } from './experimentRuns.selector';
import { LIFECYCLE_FILTER, MODEL_VERSION_FILTER } from '../../../types';

import type { ReduxState } from '../../../../redux-types';

describe('useExperimentRuns', () => {
  const mountComponentWithExperimentRuns = (
    experimentIds: string[],
    filterParams: DeepPartial<ExperimentRunsSelectorParams> = {},
  ) => {
    return renderHook(
      () =>
        useSelector((state: ReduxState) =>
          experimentRunsSelector(state, {
            experiments: experimentIds.map((id) => ({ experimentId: id })) as any,
            ...filterParams,
          }),
        ),
      {
        wrapper: ({ children }) => (
          <Provider store={createStore((s) => s as any, EXPERIMENT_RUNS_MOCK_STORE)}>{children}</Provider>
        ),
      },
    );
  };
  it('fetches single experiment runs from the store properly', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);

    expect(Object.keys(result.runInfos).length).toEqual(4);

    expect(Object.values(result.runInfos).map((r) => r.experimentId)).toEqual(expect.arrayContaining(['123456789']));
  });
  it('fetches experiment tags from the store properly', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);
    expect(result.experimentTags).toEqual(
      expect.objectContaining({
        'mlflow.experimentType': expect.objectContaining({
          key: 'mlflow.experimentType',
          value: 'NOTEBOOK',
        }),
        'mlflow.ownerEmail': expect.objectContaining({
          key: 'mlflow.ownerEmail',
          value: 'john.doe@databricks.com',
        }),
      }),
    );
  });
  it('fetches experiment runs tags from the store properly', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);

    expect(result.tagsList[0]).toEqual(
      expect.objectContaining({
        testtag1: expect.objectContaining({
          key: 'testtag1',
          value: 'value1',
        }),
      }),
    );

    expect(result.tagsList[1]).toEqual(
      expect.objectContaining({
        testtag2: expect.objectContaining({
          key: 'testtag2',
          value: 'value2_2',
        }),
      }),
    );
  });
  it('fetches metric and param keys list from the store properly', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);

    expect(result.metricKeyList).toEqual(['met1', 'met2', 'met3']);
    expect(result.paramKeyList).toEqual(['p1', 'p2', 'p3']);
  });
  it('fetches metrics list from the store properly', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);
    expect(result.metricsList[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'met1',
          value: 255,
          timestamp: 1000,
          step: 0,
        }),
      ]),
    );

    expect(result.metricsList[2]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'met1',
          value: 5,
          timestamp: 1000,
          step: 0,
        }),
      ]),
    );
  });
  it('fetches params list from the store properly', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);
    expect(result.paramsList[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'p1',
          value: '12',
        }),
      ]),
    );

    expect(result.paramsList[2]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'p2',
          value: '15',
        }),
      ]),
    );
  });

  it('fetches metrics for experiment without params', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['654321']);

    expect(result.metricKeyList).toEqual(['met1']);
    expect(result.paramKeyList).toEqual([]);

    expect(result.paramsList).toEqual([[]]);
    expect(result.metricsList[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'met1',
          value: 5,
          timestamp: 1000,
          step: 0,
        }),
      ]),
    );
  });

  it('fetches datasets for experiment runs', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789']);

    expect(result.datasetsList[0]).toEqual(
      EXPERIMENT_RUNS_MOCK_STORE.entities.runDatasetsByUuid['experiment123456789_run1'],
    );
  });

  it('filters runs with assigned model', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789'], {
      modelVersionFilter: MODEL_VERSION_FILTER.WITH_MODEL_VERSIONS,
    });

    expect(Object.keys(result.runInfos).length).toEqual(1);
  });

  it('filters runs without assigned model', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789'], {
      modelVersionFilter: MODEL_VERSION_FILTER.WTIHOUT_MODEL_VERSIONS,
    });

    expect(Object.keys(result.runInfos).length).toEqual(3);
  });

  it('filters runs without datasets in datasetsFilter', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789'], {
      datasetsFilter: [{ experiment_id: '123456789', name: 'dataset_train', digest: 'abc' }],
    });

    expect(result.datasetsList.length).toEqual(1);
    expect(result.datasetsList[0]).toEqual(
      EXPERIMENT_RUNS_MOCK_STORE.entities.runDatasetsByUuid['experiment123456789_run1'],
    );
  });

  it('fetches only active runs by default', () => {
    const {
      result: { current: resultDefault },
    } = mountComponentWithExperimentRuns(['123456789']);

    const {
      result: { current: resultActive },
    } = mountComponentWithExperimentRuns(['123456789'], {
      lifecycleFilter: LIFECYCLE_FILTER.ACTIVE,
    });

    const {
      result: { current: resultDeleted },
    } = mountComponentWithExperimentRuns(['123456789'], {
      lifecycleFilter: LIFECYCLE_FILTER.DELETED,
    });

    expect(resultDefault.runInfos).toEqual(resultActive.runInfos);
    expect(resultDefault.runInfos).not.toEqual(resultDeleted.runInfos);
  });

  it('filters deleted runs', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['123456789'], {
      lifecycleFilter: LIFECYCLE_FILTER.DELETED,
    });

    expect(Object.keys(result.runInfos).length).toEqual(1);
  });

  it('fetches empty values for experiment with no runs and tags', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['789']);

    expect(result.experimentTags).toEqual({});
    expect(result.tagsList).toEqual([]);
    expect(result.runInfos).toEqual([]);
    expect(result.metricKeyList).toEqual([]);
    expect(result.paramKeyList).toEqual([]);
    expect(result.paramsList).toEqual([]);
    expect(result.metricsList).toEqual([]);
  });

  it('fetches empty values for not found experiment', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['55555']);

    expect(result.experimentTags).toEqual({});
    expect(result.tagsList).toEqual([]);
    expect(result.runInfos).toEqual([]);
    expect(result.metricKeyList).toEqual([]);
    expect(result.paramKeyList).toEqual([]);
    expect(result.paramsList).toEqual([]);
    expect(result.metricsList).toEqual([]);
  });

  it('fetches metrics, params, and tags with non-empty key and empty value, but not those with empty key', () => {
    const {
      result: { current: result },
    } = mountComponentWithExperimentRuns(['3210']);

    expect(result.metricsList.length).toEqual(1);
    expect(result.metricsList[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'met1',
          value: 2,
        }),
      ]),
    );

    expect(result.tagsList.length).toEqual(1);
    expect(result.tagsList[0]).toEqual(
      expect.objectContaining({
        testtag1: expect.objectContaining({
          key: 'testtag1',
          value: '',
        }),
      }),
    );

    expect(result.paramsList.length).toEqual(1);
    expect(result.paramsList[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'p1',
          value: '',
        }),
      ]),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: experimentRuns.selector.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/experimentRuns.selector.ts

```typescript
import type {
  ExperimentEntity,
  ExperimentStoreEntities,
  ModelVersionInfoEntity,
  DatasetSummary,
  RunInfoEntity,
  RunDatasetWithTags,
  MetricEntity,
  RunInputsType,
  RunOutputsType,
} from '../../../types';
import { LIFECYCLE_FILTER, MODEL_VERSION_FILTER } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import { getLatestMetrics } from '../../../reducers/MetricReducer';
import { getExperimentTags, getParams, getRunDatasets, getRunInfo, getRunTags } from '../../../reducers/Reducers';
import { pickBy } from 'lodash';

export type ExperimentRunsSelectorResult = {
  /**
   * Array of run infos
   */
  runInfos: RunInfoEntity[];

  /**
   * List of unique metric keys
   */
  runUuidsMatchingFilter: string[];

  /**
   * List of unique metric keys
   */
  metricKeyList: string[];

  /**
   * List of unique param keys
   */
  paramKeyList: string[];

  /**
   * List of metrics indexed by the respective runs.
   * Example: metricsList[2] contains list of all
   * metrics corresponding to the 3rd run in the run list
   */
  metricsList: MetricEntity[][];

  /**
   * List of metrics indexed by the respective runs.
   * Example: paramsList[2] contains list of all
   * params corresponding to the 3rd run in the run list
   */
  paramsList: KeyValueEntity[][];

  /**
   * List of tags indexed by the respective runs.
   * Example: tagsList[2] contains dictionary of all
   * tags corresponding to the 3rd run in the run list
   */
  tagsList: Record<string, KeyValueEntity>[];

  /**
   * Dictionary containing model information objects indexed by run uuid
   */
  modelVersionsByRunUuid: Record<string, ModelVersionInfoEntity[]>;

  /**
   * Dictionary containing all tags assigned to a experiment
   * (single experiment only)
   */
  experimentTags: Record<string, KeyValueEntity>;

  /**
   * List of dataset arrays indexed by the respective runs.
   * E.g. datasetsList[2] yields an array of all
   * datasets corresponding to the 3rd run in the run list
   */
  datasetsList: RunDatasetWithTags[][];

  /**
   * List of inputs and outputs for each run.
   */
  inputsOutputsList?: { inputs?: RunInputsType; outputs?: RunOutputsType }[];
};

export type ExperimentRunsSelectorParams = {
  experiments: ExperimentEntity[];
  experimentIds?: string[];
  lifecycleFilter?: LIFECYCLE_FILTER;
  modelVersionFilter?: MODEL_VERSION_FILTER;
  datasetsFilter?: DatasetSummary[];
};

/**
 * Extracts run infos filtered by lifecycle filter and model version filter
 */
const extractRunInfos = (
  runUuids: string[],
  state: { entities: ExperimentStoreEntities },
  {
    lifecycleFilter = LIFECYCLE_FILTER.ACTIVE,
    modelVersionFilter = MODEL_VERSION_FILTER.ALL_RUNS,
    datasetsFilter = [],
  }: ExperimentRunsSelectorParams,
): RunInfoEntity[] => {
  const { modelVersionsByRunUuid } = state.entities;

  return (
    runUuids
      // Get the basic run info
      .map((run_id) => [getRunInfo(run_id, state), getRunDatasets(run_id, state)])
      // Filter out runs by given lifecycle filter
      .filter(([rInfo, _]) => {
        if (lifecycleFilter === LIFECYCLE_FILTER.ACTIVE) {
          return rInfo.lifecycleStage === 'active';
        } else {
          return rInfo.lifecycleStage === 'deleted';
        }
      })
      // Filter out runs by given model version filter
      .filter(([rInfo, _]) => {
        if (modelVersionFilter === MODEL_VERSION_FILTER.ALL_RUNS) {
          return true;
        } else if (modelVersionFilter === MODEL_VERSION_FILTER.WITH_MODEL_VERSIONS) {
          return rInfo.runUuid in modelVersionsByRunUuid;
        } else if (modelVersionFilter === MODEL_VERSION_FILTER.WTIHOUT_MODEL_VERSIONS) {
          return !(rInfo.runUuid in modelVersionsByRunUuid);
        } else {
          // eslint-disable-next-line no-console -- TODO(FEINF-3587)
          console.warn('Invalid input to model version filter - defaulting to showing all runs.');
          return true;
        }
      })
      .filter(([_, datasets]) => {
        if (!datasetsFilter || datasetsFilter.length === 0) return true;
        if (!datasets) return false;

        // Returns true if there exists a dataset that is in datasetsFilter
        return datasets.some((datasetWithTags: RunDatasetWithTags) => {
          const datasetName = datasetWithTags.dataset.name;
          const datasetDigest = datasetWithTags.dataset.digest;

          return datasetsFilter.some(({ name, digest }) => name === datasetName && digest === datasetDigest);
        });
      })
      .map(([rInfo, _]) => rInfo)
  );
};

export const experimentRunsSelector = (
  state: { entities: ExperimentStoreEntities },
  params: ExperimentRunsSelectorParams,
): ExperimentRunsSelectorResult => {
  const { experiments } = params;
  const experimentIds = params.experimentIds || experiments.map((e) => e.experimentId);
  const comparingExperiments = experimentIds.length > 1;

  // Read the order of runs from array of UUIDs in the store, because otherwise the order when
  // reading from the object is not guaranteed. This is important when we are trying to sort runs by
  // metrics and other fields.
  const runOrder = state.entities.runInfoOrderByUuid || [];
  const runs = runOrder.map((runUuid) => state.entities.runInfosByUuid[runUuid]);

  /**
   * Extract run UUIDs relevant to selected experiments
   */
  const runUuids = runs
    .filter(({ experimentId }) => experimentIds.includes(experimentId))
    .map(({ runUuid }) => runUuid);

  /**
   * Extract model version and runs matching filter directly from the store
   */
  const { modelVersionsByRunUuid, runUuidsMatchingFilter } = state.entities;

  /**
   * Extract run infos
   */
  const runInfos = extractRunInfos(runUuids, state, params);

  /**
   * Set of unique metric keys
   */
  const metricKeysSet = new Set<string>();

  /**
   * Set of unique param keys
   */
  const paramKeysSet = new Set<string>();

  const datasetsList = runInfos.map((runInfo) => {
    return state.entities.runDatasetsByUuid[runInfo.runUuid];
  });

  const inputsOutputsList = runInfos.map((runInfo) => {
    return state.entities.runInputsOutputsByUuid[runInfo.runUuid];
  });

  /**
   * Extracting lists of metrics by run index
   */
  const metricsList = runInfos.map((runInfo) => {
    const metricsByRunUuid = getLatestMetrics(runInfo.runUuid, state);
    const metrics = (Object.values(metricsByRunUuid || {}) as any[]).filter(
      (metric) => metric.key.trim().length > 0, // Filter out metrics that are entirely whitespace
    );
    metrics.forEach((metric) => {
      metricKeysSet.add(metric.key);
    });
    return metrics;
  }) as MetricEntity[][];

  /**
   * Extracting lists of params by run index
   */
  const paramsList = runInfos.map((runInfo) => {
    const paramValues = (Object.values(getParams(runInfo.runUuid, state)) as any[]).filter(
      (param) => param.key.trim().length > 0, // Filter out params that are entirely whitespace
    );
    paramValues.forEach((param) => {
      paramKeysSet.add(param.key);
    });
    return paramValues;
  }) as KeyValueEntity[][];

  /**
   * Extracting dictionaries of tags by run index
   */
  const tagsList = runInfos.map((runInfo) =>
    pickBy(
      getRunTags(runInfo.runUuid, state),
      (tags) => tags.key.trim().length > 0, // Filter out tags that are entirely whitespace
    ),
  ) as Record<string, KeyValueEntity>[];

  const firstExperimentId = experimentIds[0];

  /**
   * If there is only one experiment, extract experiment tags as well
   */
  const experimentTags = (comparingExperiments ? {} : getExperimentTags(firstExperimentId, state)) as Record<
    string,
    KeyValueEntity
  >;

  return {
    modelVersionsByRunUuid,
    experimentTags,
    runInfos,
    paramsList,
    tagsList,
    metricsList,
    runUuidsMatchingFilter,
    datasetsList,
    inputsOutputsList,
    metricKeyList: Array.from(metricKeysSet.values()).sort(),
    paramKeyList: Array.from(paramKeysSet.values()).sort(),
  };
};
```

--------------------------------------------------------------------------------

````

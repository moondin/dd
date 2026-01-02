---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 546
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 546 of 991)

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

---[FILE: ExperimentEvaluationRunsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsPage.tsx
Signals: React

```typescript
import invariant from 'invariant';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Global } from '@emotion/react';
import { useExperimentEvaluationRunsData } from '../../components/experiment-page/hooks/useExperimentEvaluationRunsData';
import { ExperimentEvaluationRunsPageWrapper } from './ExperimentEvaluationRunsPageWrapper';
import { ExperimentEvaluationRunsTable } from './ExperimentEvaluationRunsTable';
import type { RowSelectionState } from '@tanstack/react-table';
import { useParams } from '../../../common/utils/RoutingUtils';
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { ResizableBox } from 'react-resizable';
import { ExperimentViewRunsTableResizerHandle } from '../../components/experiment-page/components/runs/ExperimentViewRunsTableResizer';
import { RunViewEvaluationsTab } from '../../components/evaluations/RunViewEvaluationsTab';
import { ExperimentEvaluationRunsTableControls } from './ExperimentEvaluationRunsTableControls';
import evalRunsEmptyImg from '@mlflow/mlflow/src/common/static/eval-runs-empty.svg';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import type { DatasetWithRunType } from '../../components/experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { ExperimentViewDatasetDrawer } from '../../components/experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { compact, keyBy, mapValues, uniq, xor, xorBy } from 'lodash';
import {
  EVAL_RUNS_TABLE_BASE_SELECTION_STATE,
  EvalRunsTableKeyedColumnPrefix,
} from './ExperimentEvaluationRunsTable.constants';
import { FormattedMessage } from 'react-intl';
import { useSelectedRunUuid } from '../../components/evaluations/hooks/useSelectedRunUuid';
import { RunEvaluationButton } from './RunEvaluationButton';
import { isUserFacingTag } from '../../../common/utils/TagUtils';
import { createEvalRunsTableKeyedColumnKey } from './ExperimentEvaluationRunsTable.utils';
import type { RunsGroupByConfig } from '../../components/experiment-page/utils/experimentPage.group-row-utils';
import { getGroupByRunsData } from './ExperimentEvaluationRunsPage.utils';
import {
  ExperimentEvaluationRunsPageMode,
  useExperimentEvaluationRunsPageMode,
} from './hooks/useExperimentEvaluationRunsPageMode';
import { ExperimentEvaluationRunsPageCharts } from './charts/ExperimentEvaluationRunsPageCharts';
import { ExperimentEvaluationRunsRowVisibilityProvider } from './hooks/useExperimentEvaluationRunsRowVisibility';

const getLearnMoreLink = () => {
  return 'https://mlflow.org/docs/latest/genai/eval-monitor/quickstart/';
};

const ExperimentEvaluationRunsPageImpl = () => {
  const { experimentId } = useParams();
  const { theme } = useDesignSystemTheme();
  const [tableWidth, setTableWidth] = useState(432);
  const [dragging, setDragging] = useState(false);
  const [runListHidden, setRunListHidden] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedDatasetWithRun, setSelectedDatasetWithRun] = useState<DatasetWithRunType>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: boolean }>(
    EVAL_RUNS_TABLE_BASE_SELECTION_STATE,
  );

  const [groupBy, setGroupBy] = useState<RunsGroupByConfig | null>(null);
  const { viewMode, setViewMode } = useExperimentEvaluationRunsPageMode();

  const [selectedRunUuid, setSelectedRunUuid] = useSelectedRunUuid();

  invariant(experimentId, 'Experiment ID must be defined');

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const {
    data: runs,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useExperimentEvaluationRunsData({
    experimentId,
    enabled: true,
    filter: searchFilter,
  });

  const runUuids = runs?.map((run) => run.info.runUuid) ?? [];
  // set the selected run to the first run if we don't already have one
  // or if the selected run went out of scope (e.g. was deleted)
  if (runs?.length && (!selectedRunUuid || !runUuids.includes(selectedRunUuid))) {
    setSelectedRunUuid(runs[0].info.runUuid);
  }

  /**
   * Generate a list of unique data columns based on runs' metrics, params, and tags.
   */
  const uniqueColumns = useMemo(() => {
    const metricKeys: Set<string> = new Set();
    const paramKeys: Set<string> = new Set();
    const tagKeys: Set<string> = new Set();
    // Using for-of to avoid costlier functions and iterators
    for (const run of runs ?? []) {
      for (const metric of run.data.metrics ?? []) {
        metricKeys.add(metric.key);
      }
      for (const param of run.data.params ?? []) {
        paramKeys.add(param.key);
      }
      for (const tag of run.data.tags ?? []) {
        if (isUserFacingTag(tag.key)) {
          tagKeys.add(tag.key);
        }
      }
    }
    return [
      ...Array.from(metricKeys).map((key) =>
        createEvalRunsTableKeyedColumnKey(EvalRunsTableKeyedColumnPrefix.METRIC, key),
      ),
      ...Array.from(paramKeys).map((key) =>
        createEvalRunsTableKeyedColumnKey(EvalRunsTableKeyedColumnPrefix.PARAM, key),
      ),
      ...Array.from(tagKeys).map((key) => createEvalRunsTableKeyedColumnKey(EvalRunsTableKeyedColumnPrefix.TAG, key)),
    ];
  }, [runs]);

  const baseColumns = useMemo(() => Object.keys(EVAL_RUNS_TABLE_BASE_SELECTION_STATE), []);
  const existingColumns = useMemo(
    () => Object.keys(selectedColumns).filter((column) => !baseColumns.includes(column)),
    [baseColumns, selectedColumns],
  );
  const columnDifference = useMemo(() => xor(existingColumns, uniqueColumns), [existingColumns, uniqueColumns]);
  // if there is a difference between the existing column state and
  // the unique metrics (e.g. the user performed a search and the
  // list of available metrics changed), reset the selected columns
  // to the default state to avoid displaying columns that don't exist
  if (columnDifference.length > 0) {
    setSelectedColumns({
      ...EVAL_RUNS_TABLE_BASE_SELECTION_STATE,
      ...mapValues(keyBy(uniqueColumns), () => false),
    });
  }

  const isEmpty = runUuids.length === 0 && !searchFilter && !isLoading;

  const runsAndGroupValues = getGroupByRunsData(runs ?? [], groupBy);

  const renderActiveTab = (selectedRunUuid: string) => {
    if (viewMode === ExperimentEvaluationRunsPageMode.CHARTS) {
      return <ExperimentEvaluationRunsPageCharts runs={runs} experimentId={experimentId} />;
    }

    return (
      <RunViewEvaluationsTab
        experimentId={experimentId}
        runUuid={selectedRunUuid}
        runDisplayName={Utils.getRunDisplayName(
          runs?.find((run) => run.info.runUuid === selectedRunUuid)?.info,
          selectedRunUuid,
        )}
        setCurrentRunUuid={setSelectedRunUuid}
      />
    );
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const offsetFromBottomToFetchMore = 100;
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < offsetFromBottomToFetchMore && !isFetching && hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, hasNextPage],
  );

  // a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <ExperimentEvaluationRunsRowVisibilityProvider>
      <div css={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: '0px' }}>
        <ResizableBox
          css={{ display: 'flex', position: 'relative' }}
          style={{ flex: `0 0 ${runListHidden ? 0 : tableWidth}px` }}
          width={tableWidth}
          axis="x"
          resizeHandles={['e']}
          minConstraints={[250, 0]}
          handle={
            <ExperimentViewRunsTableResizerHandle
              runListHidden={runListHidden}
              updateRunListHidden={(value) => {
                setRunListHidden(!runListHidden);
              }}
            />
          }
          onResize={(event, { size }) => {
            if (runListHidden) {
              return;
            }
            setTableWidth(size.width);
          }}
          onResizeStart={() => !runListHidden && setDragging(true)}
          onResizeStop={() => setDragging(false)}
        >
          <div
            css={{
              display: runListHidden ? 'none' : 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
              maxWidth: '100%',
              flex: 1,
              zIndex: 0,
              minHeight: '0px',
              overflow: 'hidden',
              paddingRight: theme.spacing.sm,
            }}
          >
            <ExperimentEvaluationRunsTableControls
              runs={runs ?? []}
              refetchRuns={refetch}
              isFetching={isFetching || isLoading}
              searchRunsError={error}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              groupByConfig={groupBy}
              setGroupByConfig={setGroupBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <ExperimentEvaluationRunsTable
              data={runsAndGroupValues}
              uniqueColumns={uniqueColumns}
              selectedColumns={selectedColumns}
              selectedRunUuid={viewMode === ExperimentEvaluationRunsPageMode.TRACES ? selectedRunUuid : undefined}
              setSelectedRunUuid={(runUuid: string) => {
                setSelectedRunUuid(runUuid);
              }}
              isLoading={isLoading}
              hasNextPage={hasNextPage ?? false}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              setSelectedDatasetWithRun={setSelectedDatasetWithRun}
              setIsDrawerOpen={setIsDrawerOpen}
              viewMode={viewMode}
              onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
              ref={tableContainerRef}
            />
          </div>
        </ResizableBox>
        <div
          css={{
            flex: 1,
            display: 'flex',
            borderLeft: `1px solid ${theme.colors.border}`,
            minHeight: '0px',
            overflowY: 'scroll',
          }}
        >
          {selectedRunUuid ? (
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: '0px',
                paddingLeft: theme.spacing.sm,
              }}
            >
              {renderActiveTab(selectedRunUuid)}
            </div>
          ) : isEmpty ? (
            <div
              css={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: theme.spacing.lg,
                paddingLeft: theme.spacing.md,
                maxWidth: '100%',
              }}
            >
              <Typography.Title level={3} color="secondary">
                <FormattedMessage
                  defaultMessage="Evaluate and improve the quality, cost, latency of your GenAI app"
                  description="Title of the empty state for the evaluation runs page"
                />
              </Typography.Title>
              <Typography.Paragraph color="secondary" css={{ maxWidth: 'min(100%, 600px)', textAlign: 'center' }}>
                <FormattedMessage
                  defaultMessage="Create evaluation datasets in order to iteratively evaluate and improve your app. Run evaluations to check that your fixes are working, and compare quality between app / prompt versions. {learnMoreLink}"
                  description="Description of the empty state for the evaluation runs page"
                  values={{
                    learnMoreLink: (
                      <Typography.Link
                        componentId="mlflow.eval-runs.empty-state.learn-more-link"
                        href={getLearnMoreLink()}
                        css={{ whiteSpace: 'nowrap' }}
                        openInNewTab
                      >
                        {/* eslint-disable-next-line formatjs/enforce-description */}
                        <FormattedMessage defaultMessage="Learn more" />
                      </Typography.Link>
                    ),
                  }}
                />
              </Typography.Paragraph>
              <img css={{ maxWidth: '100%', maxHeight: 200 }} src={evalRunsEmptyImg} alt="No runs found" />
              <div css={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                <RunEvaluationButton experimentId={experimentId} />
              </div>
            </div>
          ) : null}
        </div>
        {dragging && (
          <Global
            styles={{
              'body, :host': {
                userSelect: 'none',
              },
            }}
          />
        )}
        {selectedDatasetWithRun && (
          <ExperimentViewDatasetDrawer
            isOpen={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
            selectedDatasetWithRun={selectedDatasetWithRun}
            setSelectedDatasetWithRun={setSelectedDatasetWithRun}
          />
        )}
      </div>
    </ExperimentEvaluationRunsRowVisibilityProvider>
  );
};

const ExperimentEvaluationRunsPage = () => (
  <ExperimentEvaluationRunsPageWrapper>
    <ExperimentEvaluationRunsPageImpl />
  </ExperimentEvaluationRunsPageWrapper>
);

export default ExperimentEvaluationRunsPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsPage.utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsPage.utils.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import type { ExperimentEvaluationRunsGroupData } from './ExperimentEvaluationRunsPage.utils';
import { getGroupByRunsData } from './ExperimentEvaluationRunsPage.utils';
import type { RunDatasetWithTags, RunEntity } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import type { RunsGroupByConfig } from '../../components/experiment-page/utils/experimentPage.group-row-utils';
import {
  RunGroupingMode,
  RunGroupingAggregateFunction,
} from '../../components/experiment-page/utils/experimentPage.row-types';

const createMockDataset = (digest: string): RunDatasetWithTags => ({
  dataset: {
    digest,
    name: 'dataset',
    profile: 'profile',
    schema: 'schema',
    source: 'source',
    sourceType: 'code',
  },
  tags: [],
});

const createMockRun = ({
  runUuid,
  datasets,
  params,
  tags,
}: {
  runUuid: string;
  datasets?: RunDatasetWithTags[];
  params?: KeyValueEntity[];
  tags?: KeyValueEntity[];
}): RunEntity => ({
  data: {
    params: params ?? [],
    tags: tags ?? [],
    metrics: [],
  },
  info: {
    artifactUri: '',
    endTime: 0,
    experimentId: 'exp-1',
    lifecycleStage: '',
    runUuid,
    runName: 'Test Run',
    startTime: 0,
    status: 'FINISHED',
  },
  inputs: {
    datasetInputs: datasets ?? [],
    modelInputs: [],
  },
  outputs: {
    modelOutputs: [],
  },
});

const MOCK_RUNS = [
  createMockRun({
    runUuid: 'run-1',
    datasets: [createMockDataset('digest-1')],
    tags: [{ key: 'tag-1', value: 'value-1' }],
  }),
  createMockRun({
    runUuid: 'run-2',
    datasets: [createMockDataset('digest-1')],
    params: [{ key: 'param-1', value: 'value-1' }],
  }),
  createMockRun({
    runUuid: 'run-3',
    datasets: [createMockDataset('digest-2')],
  }),
  createMockRun({
    runUuid: 'run-4',
  }),
];

describe('ExperimentEvaluationRunsPage.utils', () => {
  describe('getGroupByRunsData', () => {
    it('should return runs unchanged if groupBy is null', () => {
      const result = getGroupByRunsData(MOCK_RUNS, null);

      expect(result).toEqual(MOCK_RUNS);
      expect(result).toHaveLength(4);
    });

    it('should group runs by dataset digest', () => {
      const groupBy: RunsGroupByConfig = {
        aggregateFunction: RunGroupingAggregateFunction.Average,
        groupByKeys: [{ mode: RunGroupingMode.Dataset, groupByData: 'dataset' }],
      };

      const result = getGroupByRunsData(MOCK_RUNS, groupBy);

      expect(result).toHaveLength(3);
      const group0 = result[0] as ExperimentEvaluationRunsGroupData;
      expect(group0.groupValues).toBeDefined();
      expect(group0.groupValues).toEqual([
        { mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: 'digest-1' },
      ]);
      expect(group0.subRuns).toHaveLength(2);
      expect(group0.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-1', 'run-2']);

      const group1 = result[1] as ExperimentEvaluationRunsGroupData;
      expect(group1.groupValues).toEqual([
        { mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: 'digest-2' },
      ]);
      expect(group1.subRuns).toHaveLength(1);
      expect(group1.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-3']);

      const group2 = result[2] as ExperimentEvaluationRunsGroupData;
      expect(group2.groupValues).toEqual([{ mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: null }]);
      expect(group2.subRuns).toHaveLength(1);
      expect(group2.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-4']);
    });

    it('should group runs by parameter value', () => {
      const groupBy: RunsGroupByConfig = {
        aggregateFunction: RunGroupingAggregateFunction.Average,
        groupByKeys: [{ mode: RunGroupingMode.Param, groupByData: 'param-1' }],
      };

      const result = getGroupByRunsData(MOCK_RUNS, groupBy);

      expect(result).toHaveLength(2);
      const group0 = result[0] as ExperimentEvaluationRunsGroupData;
      expect(group0.groupValues).toEqual([{ mode: RunGroupingMode.Param, groupByData: 'param-1', value: null }]);
      expect(group0.subRuns).toHaveLength(3);
      expect(group0.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-1', 'run-3', 'run-4']);

      const group1 = result[1] as ExperimentEvaluationRunsGroupData;
      expect(group1.groupValues).toEqual([{ mode: RunGroupingMode.Param, groupByData: 'param-1', value: 'value-1' }]);
      expect(group1.subRuns).toHaveLength(1);
      expect(group1.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-2']);
    });

    it('should group runs by tag value', () => {
      const groupBy: RunsGroupByConfig = {
        aggregateFunction: RunGroupingAggregateFunction.Average,
        groupByKeys: [{ mode: RunGroupingMode.Tag, groupByData: 'tag-1' }],
      };

      const result = getGroupByRunsData(MOCK_RUNS, groupBy);

      expect(result).toHaveLength(2);
      const group0 = result[0] as ExperimentEvaluationRunsGroupData;
      expect(group0.groupValues).toEqual([{ mode: RunGroupingMode.Tag, groupByData: 'tag-1', value: 'value-1' }]);
      expect(group0.subRuns).toHaveLength(1);
      expect(group0.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-1']);

      const group1 = result[1] as ExperimentEvaluationRunsGroupData;
      expect(group1.groupValues).toEqual([{ mode: RunGroupingMode.Tag, groupByData: 'tag-1', value: null }]);
      expect(group1.subRuns).toHaveLength(3);
      expect(group1.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-2', 'run-3', 'run-4']);
    });

    it('should group runs by combinations of grouping modes', () => {
      const groupBy: RunsGroupByConfig = {
        aggregateFunction: RunGroupingAggregateFunction.Average,
        groupByKeys: [
          { mode: RunGroupingMode.Dataset, groupByData: 'dataset' },
          { mode: RunGroupingMode.Param, groupByData: 'param-1' },
        ],
      };

      const result = getGroupByRunsData(MOCK_RUNS, groupBy);

      // 4 groups:
      // - dataset: digest-1, param-1: value-1
      // - dataset: digest-1, param-1: null
      // - dataset: digest-2, param-1: null
      // - dataset: null, param-1: null
      expect(result).toHaveLength(4);
      const group0 = result[0] as ExperimentEvaluationRunsGroupData;
      expect(group0.groupValues).toEqual([
        { mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: 'digest-1' },
        { mode: RunGroupingMode.Param, groupByData: 'param-1', value: null },
      ]);
      expect(group0.subRuns).toHaveLength(1);
      expect(group0.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-1']);

      const group1 = result[1] as ExperimentEvaluationRunsGroupData;
      expect(group1.groupValues).toEqual([
        { mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: 'digest-1' },
        { mode: RunGroupingMode.Param, groupByData: 'param-1', value: 'value-1' },
      ]);
      expect(group1.subRuns).toHaveLength(1);
      expect(group1.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-2']);

      const group2 = result[2] as ExperimentEvaluationRunsGroupData;
      expect(group2.groupValues).toEqual([
        { mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: 'digest-2' },
        { mode: RunGroupingMode.Param, groupByData: 'param-1', value: null },
      ]);
      expect(group2.subRuns).toHaveLength(1);
      expect(group2.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-3']);

      const group3 = result[3] as ExperimentEvaluationRunsGroupData;
      expect(group3.groupValues).toEqual([
        { mode: RunGroupingMode.Dataset, groupByData: 'dataset', value: null },
        { mode: RunGroupingMode.Param, groupByData: 'param-1', value: null },
      ]);
      expect(group3.subRuns).toHaveLength(1);
      expect(group3.subRuns?.map((r) => r.info.runUuid)).toEqual(['run-4']);
    });

    it('should handle empty runs array', () => {
      const groupBy: RunsGroupByConfig = {
        aggregateFunction: RunGroupingAggregateFunction.Average,
        groupByKeys: [{ mode: RunGroupingMode.Dataset, groupByData: 'dataset' }],
      };

      const result = getGroupByRunsData([], groupBy);

      expect(result).toEqual([]);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsPage.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsPage.utils.ts

```typescript
import type { RunEntity } from '../../types';
import type { RunsGroupByConfig } from '../../components/experiment-page/utils/experimentPage.group-row-utils';
import type { RunGroupByGroupingValue } from '../../components/experiment-page/utils/experimentPage.row-types';
import { RunGroupingMode } from '../../components/experiment-page/utils/experimentPage.row-types';

export type ExperimentEvaluationRunsGroupData = {
  groupKey: string;
  groupValues: RunGroupByGroupingValue[];
  subRuns: RunEntity[];
};

export type RunEntityOrGroupData = RunEntity | ExperimentEvaluationRunsGroupData;

// string key for easy access in the map object
const createGroupKey = (groupData: RunGroupByGroupingValue) => {
  if (groupData.mode === RunGroupingMode.Dataset) {
    return `Dataset: ${groupData.value}`;
  } else {
    return `${groupData.groupByData} (${groupData.mode}): ${groupData.value}`;
  }
};

const getGroupValues = (run: RunEntity, groupBy: RunsGroupByConfig): RunGroupByGroupingValue[] => {
  const groupByKeys = groupBy.groupByKeys;

  const values: RunGroupByGroupingValue[] = [];

  for (const groupByKey of groupByKeys) {
    switch (groupByKey.mode) {
      case RunGroupingMode.Dataset:
        values.push({
          mode: RunGroupingMode.Dataset,
          groupByData: 'dataset',
          // in genai evaluate, it's not possible to have multiple dataset inputs,
          // so we can just use the first one. however, this logic will need
          // to be updated if we support multiple dataset inputs in the future
          value: run.inputs?.datasetInputs?.[0]?.dataset?.digest ?? null,
        });
        break;
      case RunGroupingMode.Param:
        const param = run.data?.params?.find((p) => p.key === groupByKey.groupByData);
        values.push({
          mode: RunGroupingMode.Param,
          groupByData: groupByKey.groupByData,
          value: param?.value ?? null,
        });
        break;
      case RunGroupingMode.Tag:
        const tag = run.data?.tags?.find((t) => t.key === groupByKey.groupByData);
        values.push({
          mode: RunGroupingMode.Tag,
          groupByData: groupByKey.groupByData,
          value: tag?.value ?? null,
        });
        break;
      default:
        break;
    }
  }

  return values;
};

export const getGroupByRunsData = (runs: RunEntity[], groupBy: RunsGroupByConfig | null): RunEntityOrGroupData[] => {
  if (!groupBy) {
    return runs;
  }

  const runGroupsMap: Record<
    string,
    {
      groupValues: RunGroupByGroupingValue[];
      subRuns: RunEntity[];
    }
  > = {};

  for (const run of runs) {
    const groupValues = getGroupValues(run, groupBy);
    const groupKey = groupValues.map(createGroupKey).join(', ');
    if (!runGroupsMap[groupKey]) {
      runGroupsMap[groupKey] = {
        groupValues,
        subRuns: [],
      };
    }
    runGroupsMap[groupKey].subRuns.push(run);
  }

  const runsWithGroupValues: RunEntityOrGroupData[] = [];
  Object.entries(runGroupsMap).forEach(([groupKey, { groupValues, subRuns }]) => {
    const groupHeadingRow: RunEntityOrGroupData = {
      groupKey,
      groupValues,
      subRuns,
    };
    runsWithGroupValues.push(groupHeadingRow);
  });

  return runsWithGroupValues;
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsPageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsPageWrapper.tsx

```typescript
import { UserActionErrorHandler } from '@databricks/web-shared/metrics';
import { ErrorBoundary } from 'react-error-boundary';
import { DangerIcon, Empty, PageWrapper } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

const PageFallback = ({ error }: { error?: Error }) => {
  return (
    <PageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage
            defaultMessage="Error"
            description="Title for error fallback component in experiment evaluation runs UI"
          />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering this component."
              description="Description for default error message in experiment evaluation runs UI"
            />
          )
        }
        image={<DangerIcon />}
      />
    </PageWrapper>
  );
};

/**
 * Wrapper for all experiment evaluation runs pages.
 * Provides error boundaries and user action error handling.
 */
export const ExperimentEvaluationRunsPageWrapper = ({
  children,
  resetKey,
}: {
  children: React.ReactNode;
  resetKey?: unknown;
}) => {
  return (
    <ErrorBoundary FallbackComponent={PageFallback} resetKeys={[resetKey]}>
      <UserActionErrorHandler>{children}</UserActionErrorHandler>
    </ErrorBoundary>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsTable.constants.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/ExperimentEvaluationRunsTable.constants.tsx

```typescript
import type { MessageDescriptor } from 'react-intl';
import { defineMessage, FormattedMessage } from 'react-intl';
import {
  CheckboxCell,
  CreatedAtCell,
  DatasetCell,
  ModelVersionCell,
  RunNameCell,
  SortableHeaderCell,
  VisiblityCell,
} from './ExperimentEvaluationRunsTableCellRenderers';
import type { ColumnDef } from '@tanstack/react-table';
import type { Theme, Interpolation } from '@emotion/react';
import type { RunEntityOrGroupData } from './ExperimentEvaluationRunsPage.utils';
import { ExperimentEvaluationRunsPageMode } from './hooks/useExperimentEvaluationRunsPageMode';
import { EvalRunsVisibilityHeaderCell } from './EvalRunsVisibilityHeaderCell';

export interface ExperimentEvaluationRunsTableMeta {
  setSelectedRunUuid: (runUuid: string) => void;
}

export enum ExperimentEvaluationRunsTableColumns {
  runName = 'run_name',
  dataset = 'dataset',
  modelVersion = 'model_version',
}

export type EvalRunsTableColumnDef = ColumnDef<RunEntityOrGroupData> & {
  meta?: {
    styles?: Interpolation<Theme>;
  };
};

export enum EvalRunsTableColumnId {
  checkbox = 'checkbox',
  visibility = 'visibility',
  runName = 'run_name',
  dataset = 'dataset',
  modelVersion = 'model_version',
  createdAt = 'created_at',
}

export enum EvalRunsTableKeyedColumnPrefix {
  ATTRIBUTE = 'attribute',
  METRIC = 'metric',
  PARAM = 'param',
  TAG = 'tag',
}

export const EVAL_RUNS_UNSELECTABLE_COLUMNS: Set<string> = new Set([
  EvalRunsTableColumnId.checkbox,
  EvalRunsTableColumnId.visibility,
  EvalRunsTableColumnId.runName,
]);

export const EVAL_RUNS_TABLE_BASE_SELECTION_STATE: { [key: string]: boolean } = {
  [EvalRunsTableColumnId.checkbox]: true,
  [EvalRunsTableColumnId.visibility]: true,
  [EvalRunsTableColumnId.runName]: true,
  [EvalRunsTableColumnId.createdAt]: true,
  [EvalRunsTableColumnId.dataset]: true,
  [EvalRunsTableColumnId.modelVersion]: true,
};

export const EVAL_RUNS_COLUMN_LABELS: Record<EvalRunsTableColumnId, MessageDescriptor> = {
  [EvalRunsTableColumnId.checkbox]: defineMessage({
    defaultMessage: 'Select',
    description: 'Label for the checkbox column in the evaluation runs table',
  }),
  [EvalRunsTableColumnId.visibility]: defineMessage({
    defaultMessage: 'Visibility',
    description: 'Label for the visibility icon column in the evaluation runs table',
  }),
  [EvalRunsTableColumnId.runName]: defineMessage({
    defaultMessage: 'Run Name',
    description: 'Column header for run name in the evaluation runs table',
  }),
  [EvalRunsTableColumnId.createdAt]: defineMessage({
    defaultMessage: 'Created at',
    description: 'Column header for created timestamp in the evaluation runs table',
  }),
  [EvalRunsTableColumnId.dataset]: defineMessage({
    defaultMessage: 'Dataset',
    description: 'Label for the dataset column in the evaluation runs table',
  }),
  [EvalRunsTableColumnId.modelVersion]: defineMessage({
    defaultMessage: 'Version',
    description: 'Column header for model versions in the evaluation runs table',
  }),
};

export const EVAL_RUNS_COLUMN_TYPE_LABELS: Record<EvalRunsTableKeyedColumnPrefix, MessageDescriptor> = {
  [EvalRunsTableKeyedColumnPrefix.ATTRIBUTE]: defineMessage({
    defaultMessage: 'Attributes',
    description: 'Header for attribute columns in the evaluation runs table column configuration',
  }),
  [EvalRunsTableKeyedColumnPrefix.METRIC]: defineMessage({
    defaultMessage: 'Metrics',
    description: 'Header for metric columns in the evaluation runs table column configuration',
  }),
  [EvalRunsTableKeyedColumnPrefix.PARAM]: defineMessage({
    defaultMessage: 'Params',
    description: 'Header for parameter columns in the evaluation runs table column configuration',
  }),
  [EvalRunsTableKeyedColumnPrefix.TAG]: defineMessage({
    defaultMessage: 'Tags',
    description: 'Header for tag columns in the evaluation runs table column configuration',
  }),
};

export const getExperimentEvalRunsDefaultColumns = (
  viewMode: ExperimentEvaluationRunsPageMode,
): EvalRunsTableColumnDef[] => {
  const unselectableColumns: EvalRunsTableColumnDef[] = [
    {
      id: EvalRunsTableColumnId.checkbox,
      cell: CheckboxCell,
      enableResizing: false,
      enableSorting: false,
      size: 32,
      meta: { styles: { minWidth: 32, maxWidth: 32 } },
    },
  ];

  if (viewMode === ExperimentEvaluationRunsPageMode.CHARTS) {
    unselectableColumns.push({
      id: EvalRunsTableColumnId.visibility,
      header: EvalRunsVisibilityHeaderCell,
      cell: VisiblityCell,
      enableResizing: false,
      enableSorting: false,
      size: 40,
      meta: { styles: { minWidth: 40, maxWidth: 40, padding: '0 4px' } },
    });
  }

  const restColumns: EvalRunsTableColumnDef[] = [
    {
      id: EvalRunsTableColumnId.runName,
      header: () => <FormattedMessage {...EVAL_RUNS_COLUMN_LABELS[EvalRunsTableColumnId.runName]} />,
      cell: RunNameCell,
      enableResizing: true,
      meta: {
        styles: {
          minWidth: 100,
        },
      },
    },
    {
      id: EvalRunsTableColumnId.createdAt,
      header: (context) => (
        <SortableHeaderCell
          {...context}
          title={<FormattedMessage {...EVAL_RUNS_COLUMN_LABELS[EvalRunsTableColumnId.createdAt]} />}
        />
      ),
      accessorFn: (row) => {
        if ('subRuns' in row) {
          return undefined;
        }
        return row.info.startTime;
      },
      cell: CreatedAtCell,
      enableSorting: true,
      sortingFn: 'alphanumeric',
      enableResizing: true,
      meta: {
        styles: {
          minWidth: 100,
        },
      },
    },
    {
      id: EvalRunsTableColumnId.dataset,
      header: () => <FormattedMessage {...EVAL_RUNS_COLUMN_LABELS[EvalRunsTableColumnId.dataset]} />,
      cell: DatasetCell,
      enableResizing: true,
      meta: {
        styles: {
          minWidth: 100,
        },
      },
    },
    {
      id: EvalRunsTableColumnId.modelVersion,
      header: () => <FormattedMessage {...EVAL_RUNS_COLUMN_LABELS[EvalRunsTableColumnId.modelVersion]} />,
      cell: ModelVersionCell,
      enableResizing: true,
      meta: {
        styles: {
          minWidth: 100,
        },
      },
    },
  ];

  return [...unselectableColumns, ...restColumns];
};
```

--------------------------------------------------------------------------------

````

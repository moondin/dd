---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 537
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 537 of 991)

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

---[FILE: RunsCompare.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-compare/RunsCompare.tsx
Signals: React, Redux/RTK

```typescript
import { TableSkeleton, useDesignSystemTheme } from '@databricks/design-system';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { MetricEntitiesByName, ChartSectionConfig, ImageEntity } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { RunsChartsCardConfig } from '../runs-charts/runs-charts.types';
import type { RunsChartType } from '../runs-charts/runs-charts.types';
import { type SerializedRunsChartsCardConfigCard } from '../runs-charts/runs-charts.types';
import { RunsChartsConfigureModal } from '../runs-charts/components/RunsChartsConfigureModal';
import { isEmptyChartCard, type RunsChartsRunData } from '../runs-charts/components/RunsCharts.common';
import {
  AUTOML_EVALUATION_METRIC_TAG,
  LOG_IMAGE_TAG_INDICATOR,
  MLFLOW_EXPERIMENT_PRIMARY_METRIC_NAME,
} from '../../constants';
import { RunsChartsTooltipBody } from '../runs-charts/components/RunsChartsTooltipBody';
import { RunsChartsTooltipWrapper } from '../runs-charts/hooks/useRunsChartsTooltip';
import { useUpdateExperimentViewUIState } from '../experiment-page/contexts/ExperimentPageUIStateContext';
import {
  type ExperimentPageUIState,
  RUNS_VISIBILITY_MODE,
  type RunsChartsGlobalLineChartConfig,
} from '../experiment-page/models/ExperimentPageUIState';
import type { RunRowType } from '../experiment-page/utils/experimentPage.row-types';
import { RunsChartsSectionAccordion } from '../runs-charts/components/sections/RunsChartsSectionAccordion';
import type { ReduxState } from '@mlflow/mlflow/src/redux-types';
import { SearchIcon } from '@databricks/design-system';
import { Input } from '@databricks/design-system';
import { useIntl } from 'react-intl';
import {
  type RunsGroupByConfig,
  getRunGroupDisplayName,
  isRemainingRunsGroup,
  normalizeRunsGroupByKey,
} from '../experiment-page/utils/experimentPage.group-row-utils';
import { keyBy, values } from 'lodash';
import {
  type RunsChartsUIConfigurationSetter,
  RunsChartsUIConfigurationContextProvider,
  useUpdateRunsChartsUIConfiguration,
  useReorderRunsChartsFn,
  useInsertRunsChartsFn,
  useRemoveRunsChartFn,
  useConfirmChartCardConfigurationFn,
} from '../runs-charts/hooks/useRunsChartsUIConfiguration';
import { useToggleRowVisibilityCallback } from '../experiment-page/hooks/useToggleRowVisibilityCallback';
import { RunsChartsFullScreenModal } from '../runs-charts/components/RunsChartsFullScreenModal';
import { usePopulateImagesByRunUuid } from '../experiment-page/hooks/usePopulateImagesByRunUuid';
import { useGetExperimentRunColor } from '../experiment-page/hooks/useExperimentRunColor';
import { RunsChartsGlobalChartSettingsDropdown } from '../runs-charts/components/RunsChartsGlobalChartSettingsDropdown';
import { RunsChartsDraggableCardsGridContextProvider } from '../runs-charts/components/RunsChartsDraggableCardsGridContext';
import { RunsChartsFilterInput } from '../runs-charts/components/RunsChartsFilterInput';
import { RUNS_CHARTS_UI_Z_INDEX } from '../runs-charts/utils/runsCharts.const';

export interface RunsCompareProps {
  comparedRuns: RunRowType[];
  isLoading: boolean;
  metricKeyList: string[];
  paramKeyList: string[];
  experimentTags: Record<string, KeyValueEntity>;
  compareRunCharts?: SerializedRunsChartsCardConfigCard[];
  compareRunSections?: ChartSectionConfig[];
  groupBy: null | string | RunsGroupByConfig;
  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
  chartsSearchFilter?: string;
  storageKey: string;
  minWidth: number;
}

/**
 * Utility function: based on a run row coming from runs table, creates run data trace to be used in charts
 */
const createRunDataTrace = (
  run: RunRowType,
  latestMetricsByRunUuid: Record<string, MetricEntitiesByName>,
  paramsByRunUuid: Record<string, Record<string, KeyValueEntity>>,
  tagsByRunUuid: Record<string, Record<string, KeyValueEntity>>,
  imagesByRunUuid: Record<string, Record<string, Record<string, ImageEntity>>>,
  color: string,
) => ({
  uuid: run.runUuid,
  displayName: run.runInfo?.runName || run.runUuid,
  runInfo: run.runInfo,
  metrics: latestMetricsByRunUuid[run.runUuid] || {},
  params: paramsByRunUuid[run.runUuid] || {},
  tags: tagsByRunUuid[run.runUuid] || {},
  images: imagesByRunUuid[run.runUuid] || {},
  color,
  pinned: run.pinned,
  pinnable: run.pinnable,
  metricsHistory: {},
  belongsToGroup: run.runDateAndNestInfo?.belongsToGroup,
  hidden: run.hidden,
});

/**
 * Utility function: based on a group row coming from runs table, creates run group data trace to be used in charts
 */
const createGroupDataTrace = (run: RunRowType, color: string) => {
  // Latest aggregated metrics in groups does not contain step or timestamps.
  // For step, we're using maxStep which will help determine the chart type.
  // For timestamp, we use 0 as a placeholder.
  const metricsData = run.groupParentInfo?.aggregatedMetricData
    ? keyBy(
        values(run.groupParentInfo?.aggregatedMetricData).map(({ key, value, maxStep }) => ({
          key,
          value,
          step: maxStep,
          timestamp: 0,
        })),
        'key',
      )
    : {};
  return {
    uuid: run.rowUuid,
    displayName: getRunGroupDisplayName(run.groupParentInfo),
    groupParentInfo: run.groupParentInfo,
    metrics: metricsData,
    params: run.groupParentInfo?.aggregatedParamData || {},
    // TODO: add tags for groups
    tags: {},
    images: {},
    color,
    pinned: run.pinned,
    pinnable: run.pinnable,
    metricsHistory: {},
    hidden: run.hidden,
  };
};

/**
 * Component displaying comparison charts and differences (and in future artifacts) between experiment runs.
 * Intended to be mounted next to runs table.
 *
 * This component extracts params/metrics from redux store by itself for quicker access. However,
 * it needs a provided list of compared run entries using same model as runs table.
 */
const RunsCompareImpl = ({
  isLoading,
  comparedRuns,
  metricKeyList,
  paramKeyList,
  experimentTags,
  compareRunCharts,
  compareRunSections,
  groupBy,
  autoRefreshEnabled,
  hideEmptyCharts,
  globalLineChartConfig,
  chartsSearchFilter,
  minWidth,
}: RunsCompareProps) => {
  // Updater function for the general experiment view UI state
  const updateUIState = useUpdateExperimentViewUIState();
  const getRunColor = useGetExperimentRunColor();

  // Updater function for charts UI state
  const updateChartsUIState = useUpdateRunsChartsUIConfiguration();

  const { paramsByRunUuid, latestMetricsByRunUuid, tagsByRunUuid, imagesByRunUuid } = useSelector(
    (state: ReduxState) => ({
      paramsByRunUuid: state.entities.paramsByRunUuid,
      latestMetricsByRunUuid: state.entities.latestMetricsByRunUuid,
      tagsByRunUuid: state.entities.tagsByRunUuid,
      imagesByRunUuid: state.entities.imagesByRunUuid,
    }),
  );

  const { theme } = useDesignSystemTheme();
  const [initiallyLoaded, setInitiallyLoaded] = useState(false);
  const [configuredCardConfig, setConfiguredCardConfig] = useState<RunsChartsCardConfig | null>(null);
  const [search, setSearch] = useState('');
  const { formatMessage } = useIntl();

  const groupByNormalized = useMemo(
    () =>
      // In case we encounter deprecated string-based group by descriptor
      normalizeRunsGroupByKey(groupBy),
    [groupBy],
  );

  const [fullScreenChart, setFullScreenChart] = useState<
    | {
        config: RunsChartsCardConfig;
        title: string | ReactNode;
        subtitle: ReactNode;
      }
    | undefined
  >(undefined);

  const addNewChartCard = (metricSectionId: string) => {
    return (type: RunsChartType) => {
      // TODO: pass existing runs data and get pre-configured initial setup for every chart type
      setConfiguredCardConfig(RunsChartsCardConfig.getEmptyChartCardByType(type, false, undefined, metricSectionId));
    };
  };

  const startEditChart = useCallback((chartCard: RunsChartsCardConfig) => {
    setConfiguredCardConfig(chartCard);
  }, []);

  useEffect(() => {
    if (!initiallyLoaded && !isLoading) {
      setInitiallyLoaded(true);
    }
  }, [initiallyLoaded, isLoading]);

  const primaryMetricKey = useMemo(() => {
    const automlEntry = experimentTags[AUTOML_EVALUATION_METRIC_TAG];
    const mlflowPrimaryEntry = experimentTags[MLFLOW_EXPERIMENT_PRIMARY_METRIC_NAME];
    return automlEntry?.value || mlflowPrimaryEntry?.value || metricKeyList[0] || '';
  }, [experimentTags, metricKeyList]);

  /**
   * Dataset generated for all charts in a single place
   */
  const chartData: RunsChartsRunData[] = useMemo(() => {
    if (!groupBy) {
      return comparedRuns
        .filter((run) => run.runInfo)
        .map<RunsChartsRunData>((run) =>
          createRunDataTrace(
            run,
            latestMetricsByRunUuid,
            paramsByRunUuid,
            tagsByRunUuid,
            imagesByRunUuid,
            getRunColor(run.runUuid),
          ),
        );
    }

    const groupChartDataEntries = comparedRuns
      .filter((run) => run.groupParentInfo && !isRemainingRunsGroup(run.groupParentInfo))
      .map<RunsChartsRunData>((group) => createGroupDataTrace(group, getRunColor(group.groupParentInfo?.groupId)));

    const remainingRuns = comparedRuns
      .filter((run) => !run.groupParentInfo && !run.runDateAndNestInfo?.belongsToGroup)
      .map((run) =>
        createRunDataTrace(
          run,
          latestMetricsByRunUuid,
          paramsByRunUuid,
          tagsByRunUuid,
          imagesByRunUuid,
          getRunColor(run.runUuid),
        ),
      );

    return [...groupChartDataEntries, ...remainingRuns];
  }, [groupBy, comparedRuns, latestMetricsByRunUuid, paramsByRunUuid, tagsByRunUuid, imagesByRunUuid, getRunColor]);

  const filteredImageData = chartData.filter((run) => !run.hidden && run.tags[LOG_IMAGE_TAG_INDICATOR]);
  usePopulateImagesByRunUuid({
    runUuids: filteredImageData.map((run) => run.uuid),
    runUuidsIsActive: filteredImageData.map((run) => run.runInfo?.status === 'RUNNING'),
    enabled: true,
    autoRefreshEnabled,
  });

  // Set chart cards to the user-facing base config if there is no other information.
  useEffect(() => {
    if ((!compareRunSections || !compareRunCharts) && chartData.length > 0) {
      const { resultChartSet, resultSectionSet } = RunsChartsCardConfig.getBaseChartAndSectionConfigs({
        primaryMetricKey,
        runsData: chartData,
        useParallelCoordinatesChart: true,
      });
      updateChartsUIState(
        (current) => ({
          ...current,
          compareRunCharts: resultChartSet,
          compareRunSections: resultSectionSet,
        }),
        true,
      );
    }
  }, [compareRunCharts, compareRunSections, primaryMetricKey, chartData, updateChartsUIState]);

  /**
   * When chartData changes, we need to update the RunCharts with the latest charts
   */
  useEffect(() => {
    updateChartsUIState((current) => {
      if (!current.compareRunCharts || !current.compareRunSections) {
        return current;
      }

      const { resultChartSet, resultSectionSet, isResultUpdated } = RunsChartsCardConfig.updateChartAndSectionConfigs({
        compareRunCharts: current.compareRunCharts,
        compareRunSections: current.compareRunSections,
        runsData: chartData,
        isAccordionReordered: current.isAccordionReordered,
      });

      if (!isResultUpdated) {
        return current;
      }
      return {
        ...current,
        compareRunCharts: resultChartSet,
        compareRunSections: resultSectionSet,
      };
    }, true);
  }, [chartData, updateChartsUIState]);

  const onTogglePin = useCallback(
    (runUuid: string) => {
      updateUIState((existingFacets: ExperimentPageUIState) => ({
        ...existingFacets,
        runsPinned: !existingFacets.runsPinned.includes(runUuid)
          ? [...existingFacets.runsPinned, runUuid]
          : existingFacets.runsPinned.filter((r) => r !== runUuid),
      }));
    },
    [updateUIState],
  );

  const toggleRunVisibility = useToggleRowVisibilityCallback(comparedRuns);

  const onHideRun = useCallback(
    (runUuid: string) => toggleRunVisibility(RUNS_VISIBILITY_MODE.CUSTOM, runUuid),
    [toggleRunVisibility],
  );

  const confirmChartCardConfiguration = useConfirmChartCardConfigurationFn();

  const submitForm = (configuredCard: Partial<RunsChartsCardConfig>) => {
    confirmChartCardConfiguration(configuredCard);

    // Hide the modal
    setConfiguredCardConfig(null);
  };

  /**
   * Removes the chart from the compare run view.
   */
  const removeChart = useRemoveRunsChartFn();

  /**
   * Reorders the charts in the compare run view.
   */
  const reorderCharts = useReorderRunsChartsFn();

  /*
   * Inserts the source chart into the target group
   */
  const insertCharts = useInsertRunsChartsFn();

  /**
   * Data utilized by the tooltip system:
   * runs data and toggle pin callback
   */
  const tooltipContextValue = useMemo(
    () => ({ runs: chartData, onTogglePin, onHideRun }),
    [chartData, onHideRun, onTogglePin],
  );

  // If using draggable grid layout, already filter out charts that are empty or deleted
  const visibleChartCards = useMemo(() => {
    if (hideEmptyCharts) {
      return compareRunCharts?.filter((chartCard) => !chartCard.deleted && !isEmptyChartCard(chartData, chartCard));
    }
    return compareRunCharts?.filter((chartCard) => !chartCard.deleted);
  }, [chartData, compareRunCharts, hideEmptyCharts]);

  if (!initiallyLoaded) {
    return <RunsCompareSkeleton />;
  }

  return (
    <div
      css={{
        flex: 1,
        borderTop: `1px solid ${theme.colors.border}`,
        borderLeft: `1px solid ${theme.colors.border}`,

        // Let's cover 1 pixel of the grid's border for the sleek look
        marginLeft: -1,

        position: 'relative' as const,
        backgroundColor: theme.colors.backgroundSecondary,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        zIndex: 1,
        overflowY: 'auto' as const,

        // Make sure charts are visible even on small screens
        minWidth,
      }}
      data-testid="experiment-view-compare-runs-chart-area"
    >
      <div
        css={[
          {
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.sm,
            display: 'flex',
            gap: theme.spacing.xs,
            position: 'sticky',
            top: 0,
            // Make sure the search bar is above the charts
            zIndex: RUNS_CHARTS_UI_Z_INDEX.SEARCH_BAR,
            backgroundColor: theme.colors.backgroundSecondary,
            // Use negative margin to properly cover surrounding area with background color
            marginLeft: -theme.spacing.md,
            marginRight: -theme.spacing.md,
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
          },
        ]}
      >
        <RunsChartsFilterInput chartsSearchFilter={chartsSearchFilter} />
        <RunsChartsGlobalChartSettingsDropdown
          updateUIState={updateChartsUIState}
          metricKeyList={metricKeyList}
          globalLineChartConfig={globalLineChartConfig}
        />
      </div>
      <RunsChartsTooltipWrapper contextData={tooltipContextValue} component={RunsChartsTooltipBody}>
        <RunsChartsDraggableCardsGridContextProvider visibleChartCards={visibleChartCards}>
          <RunsChartsSectionAccordion
            compareRunSections={compareRunSections}
            compareRunCharts={visibleChartCards}
            reorderCharts={reorderCharts}
            insertCharts={insertCharts}
            chartData={chartData}
            startEditChart={startEditChart}
            removeChart={removeChart}
            addNewChartCard={addNewChartCard}
            search={chartsSearchFilter ?? ''}
            groupBy={groupByNormalized}
            setFullScreenChart={setFullScreenChart}
            autoRefreshEnabled={autoRefreshEnabled}
            hideEmptyCharts={hideEmptyCharts}
            globalLineChartConfig={globalLineChartConfig}
          />
        </RunsChartsDraggableCardsGridContextProvider>
      </RunsChartsTooltipWrapper>
      {configuredCardConfig && (
        <RunsChartsConfigureModal
          chartRunData={chartData}
          metricKeyList={metricKeyList}
          paramKeyList={paramKeyList}
          config={configuredCardConfig}
          onSubmit={submitForm}
          onCancel={() => setConfiguredCardConfig(null)}
          groupBy={groupByNormalized}
          globalLineChartConfig={globalLineChartConfig}
        />
      )}
      <RunsChartsFullScreenModal
        fullScreenChart={fullScreenChart}
        onCancel={() => setFullScreenChart(undefined)}
        chartData={chartData}
        groupBy={groupByNormalized}
        tooltipContextValue={tooltipContextValue}
        tooltipComponent={RunsChartsTooltipBody}
        autoRefreshEnabled={autoRefreshEnabled}
        globalLineChartConfig={globalLineChartConfig}
      />
    </div>
  );
};

/* eslint-disable react-hooks/rules-of-hooks */
export const RunsCompare = (props: RunsCompareProps) => {
  // Updater function for the general experiment view UI state
  const updateUIState = useUpdateExperimentViewUIState();

  // An extracted partial updater function, responsible for setting charts UI state
  const updateChartsUIState = useCallback<(stateSetter: RunsChartsUIConfigurationSetter) => void>(
    (setter) => {
      updateUIState((state) => ({
        ...state,
        ...setter(state),
      }));
    },
    [updateUIState],
  );

  return (
    <RunsChartsUIConfigurationContextProvider updateChartsUIState={updateChartsUIState}>
      <RunsCompareImpl {...props} />
    </RunsChartsUIConfigurationContextProvider>
  );
};
/* eslint-enable react-hooks/rules-of-hooks */

const RunsCompareSkeleton = () => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '200px',
        gap: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.border}`,
        borderLeft: `1px solid ${theme.colors.border}`,
        marginLeft: -1,
        backgroundColor: theme.colors.backgroundSecondary,
        padding: theme.spacing.md,
        zIndex: 1,
      }}
    >
      {new Array(6).fill(null).map((_, index) => (
        <TableSkeleton key={index} lines={5} seed={index.toString()} />
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useGroupedChartRunData.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-compare/hooks/useGroupedChartRunData.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { type UseGroupedChartRunDataParams, useGroupedChartRunData } from './useGroupedChartRunData';
import type { RunsChartsRunData } from '../../runs-charts/components/RunsCharts.common';
import { RunGroupingAggregateFunction } from '../../experiment-page/utils/experimentPage.row-types';
import { last } from 'lodash';
import type { SampledMetricsByRun } from '../../runs-charts/hooks/useSampledMetricHistory';

const ungroupedDataTrace: RunsChartsRunData = {
  displayName: 'Ungrouped run 1',
  belongsToGroup: false,
  runInfo: {},
} as any;

const testChartDataTraces: RunsChartsRunData[] = [
  {
    groupParentInfo: {
      runUuids: ['run_1', 'run_2'],
    },
    displayName: 'Group 1',
    uuid: 'group-1',
  } as any,
  {
    groupParentInfo: {
      runUuids: ['run_3', 'run_4'],
    },
    displayName: 'Group 2',
    uuid: 'group-2',
  },
];

const testSampledRunMetrics: Record<string, SampledMetricsByRun> = {
  run_1: {
    runUuid: 'run_1',
    metric_1: {
      metricsHistory: [
        {
          key: 'metric_1',
          value: 1,
          step: 1,
          timestamp: 1,
        },
        {
          key: 'metric_1',
          value: 10,
          step: 2,
          timestamp: 10,
        },
      ],
    },
  },
  run_2: {
    runUuid: 'run_2',
    metric_1: {
      metricsHistory: [
        {
          key: 'metric_1',
          value: 5,
          step: 1,
          timestamp: 1,
        },
        {
          key: 'metric_1',
          value: 20,
          step: 2,
          timestamp: 30,
        },
      ],
    },
  },
  run_3: {
    runUuid: 'run_3',
    metric_1: {
      metricsHistory: [
        {
          key: 'metric_1',
          value: 20,
          step: 1,
          timestamp: 1,
        },
      ],
    },
  },
  run_4: {
    runUuid: 'run_3',
    metric_1: {
      metricsHistory: [
        {
          key: 'metric_1',
          value: 40,
          step: 1,
          timestamp: 1,
        },
        {
          key: 'metric_1',
          value: 500,
          step: 2,
          timestamp: 2,
        },
      ],
    },
  },
} as any;

describe('useGroupedChartRunData', () => {
  const renderConfiguredHook = (params: Partial<UseGroupedChartRunDataParams>) =>
    renderHook<RunsChartsRunData[], UseGroupedChartRunDataParams>((props) => useGroupedChartRunData(props), {
      initialProps: {
        enabled: params.enabled ?? true,
        ungroupedRunsData: params.ungroupedRunsData ?? [],
        metricKeys: params.metricKeys ?? [],
        sampledDataResultsByRunUuid: params.sampledDataResultsByRunUuid ?? {},
        aggregateFunction: params.aggregateFunction ?? RunGroupingAggregateFunction.Average,
        ignoreOutliers: params.ignoreOutliers ?? false,
      },
    });
  it('should return the fallback data if grouping is disabled', () => {
    const ungroupedRunsData = [{ uuid: '1' }, { uuid: '2' }] as any;
    const result = renderConfiguredHook({
      ungroupedRunsData,
      enabled: false,
    });
    expect(result.result.current).toEqual(ungroupedRunsData);
  });

  it('should aggregate the data and return proper group boundaries', () => {
    const result = renderConfiguredHook({
      ungroupedRunsData: testChartDataTraces,
      sampledDataResultsByRunUuid: testSampledRunMetrics,
      enabled: true,
      aggregateFunction: RunGroupingAggregateFunction.Average,
      metricKeys: ['metric_1'],
    });

    const groupedData = result.result.current;
    expect(groupedData).toHaveLength(2);

    const [firstGroup, secondGroup] = groupedData;

    expect(firstGroup.aggregatedMetricsHistory?.['metric_1']).toEqual({
      average: [
        {
          // Expect value to be average of two source entries
          key: 'metric_1',
          step: 1,
          timestamp: 1,
          value: 3,
        },
        {
          // Expect value to be average of two source entries
          key: 'metric_1',
          step: 2,
          // For the second step in the first group, we expect to be average timestamp of two source entries
          timestamp: 20,
          value: 15,
        },
      ],
      max: [
        {
          key: 'metric_1',
          step: 1,
          timestamp: 1,
          value: 5,
        },
        {
          key: 'metric_1',
          step: 2,
          timestamp: 20,
          value: 20,
        },
      ],
      min: [
        {
          key: 'metric_1',
          step: 1,
          timestamp: 1,
          value: 1,
        },
        {
          key: 'metric_1',
          step: 2,
          timestamp: 20,
          value: 10,
        },
      ],
    });
    // We use average aggregation so we expect the metricsHistory to be the same as the calculated average dataset
    expect(firstGroup.metricsHistory?.['metric_1']).toEqual(firstGroup.aggregatedMetricsHistory?.['metric_1'].average);
    expect(secondGroup.aggregatedMetricsHistory?.['metric_1']).toEqual({
      average: [
        {
          key: 'metric_1',
          step: 1,
          timestamp: 1,
          value: 30,
        },
        {
          key: 'metric_1',
          step: 2,
          timestamp: 2,
          // In the second group, we have only one source entry for the second step,
          // so we expect the average to be the same as the value
          value: 500,
        },
      ],
      max: [
        {
          key: 'metric_1',
          step: 1,
          timestamp: 1,
          value: 40,
        },
        {
          key: 'metric_1',
          step: 2,
          timestamp: 2,
          value: 500,
        },
      ],
      min: [
        {
          key: 'metric_1',
          step: 1,
          timestamp: 1,
          value: 20,
        },
        {
          key: 'metric_1',
          step: 2,
          timestamp: 2,
          value: 500,
        },
      ],
    });
    expect(secondGroup.metricsHistory?.['metric_1']).toEqual(
      secondGroup.aggregatedMetricsHistory?.['metric_1'].average,
    );
  });

  it('should aggregate the data and append ungrouped runs at the end', () => {
    const result = renderConfiguredHook({
      ungroupedRunsData: [...testChartDataTraces, ungroupedDataTrace],
      sampledDataResultsByRunUuid: testSampledRunMetrics,
      enabled: true,
      aggregateFunction: RunGroupingAggregateFunction.Average,
      metricKeys: ['metric_1'],
    });

    const groupedData = result.result.current;
    expect(groupedData).toHaveLength(3);

    expect(last(groupedData)).toEqual(ungroupedDataTrace);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useGroupedChartRunData.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-compare/hooks/useGroupedChartRunData.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { RunGroupingAggregateFunction } from '../../experiment-page/utils/experimentPage.row-types';
import invariant from 'invariant';
import {
  removeOutliersFromMetricHistory,
  type RunsChartsRunData,
} from '../../runs-charts/components/RunsCharts.common';
import {
  createAggregatedMetricHistory,
  createValueAggregatedMetricHistory,
  type SyntheticMetricHistory,
} from '../../experiment-page/utils/experimentPage.group-row-utils';
import { uniq, type Dictionary, compact, pick, isNil } from 'lodash';
import type { SampledMetricsByRun } from '../../runs-charts/hooks/useSampledMetricHistory';
import type { MetricHistoryByName } from '../../../types';

export interface UseGroupedChartRunDataParams {
  ungroupedRunsData: RunsChartsRunData[];
  enabled: boolean;
  aggregateFunction?: RunGroupingAggregateFunction;
  metricKeys: string[];
  sampledDataResultsByRunUuid: Dictionary<SampledMetricsByRun>;
  selectedXAxisMetricKey?: string;
  ignoreOutliers: boolean;
}

/**
 * Returns a new array of RunsChartsRunData with aggregated metrics for grouped runs.
 * In order to make rendering of the confidence interval possible, the returned dataset contains
 * min, max and average values for each metric while respecting the metric history.
 */
export const useGroupedChartRunData = ({
  ungroupedRunsData,
  enabled,
  aggregateFunction,
  metricKeys,
  sampledDataResultsByRunUuid,
  selectedXAxisMetricKey,
  ignoreOutliers,
}: UseGroupedChartRunDataParams) => {
  return useMemo(() => {
    if (!enabled || !aggregateFunction) {
      return ungroupedRunsData;
    }

    // Extract groups from the result set and calculate aggregated metrics
    const perGroupData: RunsChartsRunData[] = ungroupedRunsData
      .filter(({ groupParentInfo }) => groupParentInfo)
      .map((group) => {
        const aggregatedMetricsHistory: Record<string, SyntheticMetricHistory> = {};
        metricKeys.forEach((metricKey) => {
          invariant(group.groupParentInfo, 'groupParentInfo should be defined');

          const aggregatedRunUuidsInGroup =
            group.groupParentInfo.runUuidsForAggregation ?? group.groupParentInfo.runUuids;

          let aggregatedMetricsHistoryForMetric;
          if (!isNil(selectedXAxisMetricKey)) {
            aggregatedMetricsHistoryForMetric = createValueAggregatedMetricHistory(
              pick(sampledDataResultsByRunUuid, aggregatedRunUuidsInGroup),
              metricKey,
              selectedXAxisMetricKey,
              ignoreOutliers,
            );
          } else {
            const metricsHistoryInGroup = compact(
              aggregatedRunUuidsInGroup.flatMap((runUuid) => {
                const metricsHistory = sampledDataResultsByRunUuid[runUuid]?.[metricKey]?.metricsHistory;
                if (ignoreOutliers) {
                  return metricsHistory ? removeOutliersFromMetricHistory(metricsHistory) : undefined;
                }
                return metricsHistory;
              }),
            );

            // Get all step numbers from all runs in the group
            const steps = uniq(metricsHistoryInGroup.map((h) => h.step)).sort((a, b) => a - b);

            aggregatedMetricsHistoryForMetric = createAggregatedMetricHistory(steps, metricKey, metricsHistoryInGroup);
          }

          aggregatedMetricsHistory[metricKey] = aggregatedMetricsHistoryForMetric;
        });
        const metricsHistory = metricKeys.reduce<MetricHistoryByName>((acc, key) => {
          const history = aggregatedMetricsHistory[key][aggregateFunction];
          if (history && history.length > 0) {
            acc[key] = history;
          }
          return acc;
        }, {});

        return {
          ...group,
          metricsHistory,
          aggregatedMetricsHistory,
        };
      });

    const ungroupedRuns = ungroupedRunsData.filter(({ belongsToGroup }) => belongsToGroup === false);

    return [...perGroupData, ...ungroupedRuns];
  }, [
    metricKeys,
    sampledDataResultsByRunUuid,
    ungroupedRunsData,
    enabled,
    aggregateFunction,
    selectedXAxisMetricKey,
    ignoreOutliers,
  ]);
};
```

--------------------------------------------------------------------------------

---[FILE: TraceDataDrawer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/traces/TraceDataDrawer.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import {
  DangerIcon,
  Drawer,
  Empty,
  Spacer,
  TableSkeleton,
  TitleSkeleton,
  Typography,
  WarningIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { getTraceDisplayName } from './TracesView.utils';
import { useExperimentTraceData } from './hooks/useExperimentTraceData';
import {
  type ModelTraceInfo,
  ModelTraceExplorer,
  ModelTraceExplorerSkeleton,
} from '@databricks/web-shared/model-trace-explorer';
import { FormattedMessage } from 'react-intl';
import { useExperimentTraceInfo } from './hooks/useExperimentTraceInfo';
const ContextProviders = ({ children, experimentId }: { children: React.ReactNode; experimentId?: string }) => {
  return <>{children}</>;
};

export const TraceDataDrawer = ({
  requestId,
  traceInfo,
  loadingTraceInfo,
  onClose,
  selectedSpanId,
  onSelectSpan,
}: {
  requestId: string;
  traceInfo?: ModelTraceInfo;
  loadingTraceInfo?: boolean;
  onClose: () => void;
  selectedSpanId?: string;
  onSelectSpan?: (selectedSpanId?: string) => void;
}) => {
  const {
    traceData,
    loading: loadingTraceData,
    error,
  } = useExperimentTraceData(
    requestId,
    // skip fetching trace data if trace is in progress
    traceInfo?.status === 'IN_PROGRESS',
  );
  const { theme } = useDesignSystemTheme();

  // Usually, we rely on the parent component to provide trace info object (when clicked in a table row).
  // But in some cases it's not available (e.g. when deep linking to a trace when the entity is not on the same page)
  // and then we fetch it independently here.
  const shouldFetchTraceInfo = !loadingTraceInfo && !traceInfo;

  const { traceInfo: internalTraceInfo, loading: loadingInternalTracingInfo } = useExperimentTraceInfo(
    requestId,
    shouldFetchTraceInfo,
  );

  const traceInfoToUse = traceInfo || internalTraceInfo;

  const title = useMemo(() => {
    if (loadingTraceInfo || loadingInternalTracingInfo) {
      return <TitleSkeleton />;
    }
    if (traceInfoToUse) {
      return (
        <Typography.Title level={2} withoutMargins>
          {getTraceDisplayName(traceInfoToUse as ModelTraceInfo)}
        </Typography.Title>
      );
    }
    return requestId;
  }, [
    // Memo dependency list
    loadingTraceInfo,
    loadingInternalTracingInfo,
    traceInfoToUse,
    requestId,
  ]);

  // Construct the model trace object with the trace info and trace data
  const combinedModelTrace = useMemo(
    () =>
      traceData
        ? {
            info: traceInfoToUse || {},
            data: traceData,
          }
        : undefined,
    [traceData, traceInfoToUse],
  );

  const containsSpans = (traceData?.spans || []).length > 0;

  const renderContent = () => {
    if (loadingTraceData || loadingTraceInfo || loadingInternalTracingInfo) {
      return <ModelTraceExplorerSkeleton />;
    }
    if (traceInfo?.status === 'IN_PROGRESS') {
      return (
        <>
          <Spacer size="lg" />
          <Empty
            image={<WarningIcon />}
            description={
              <FormattedMessage
                defaultMessage="Trace data is not available for in-progress traces. Please wait for the trace to complete."
                description="Experiment page > traces data drawer > in-progress description"
              />
            }
            title={
              <FormattedMessage
                defaultMessage="Trace data not available"
                description="Experiment page > traces data drawer > in-progress title"
              />
            }
          />
        </>
      );
    }
    if (error) {
      return (
        <>
          <Spacer size="lg" />
          <Empty
            image={<DangerIcon />}
            description={
              <FormattedMessage
                defaultMessage="An error occurred while attempting to fetch the trace data. Please wait a moment and try again."
                description="Experiment page > traces data drawer > error state description"
              />
            }
            title={
              <FormattedMessage
                defaultMessage="Error"
                description="Experiment page > traces data drawer > error state title"
              />
            }
          />
        </>
      );
    }
    if (!containsSpans) {
      return (
        <>
          <Spacer size="lg" />
          <Empty
            description={null}
            title={
              <FormattedMessage
                defaultMessage="No trace data recorded"
                description="Experiment page > traces data drawer > no trace data recorded empty state"
              />
            }
          />
        </>
      );
    }
    if (combinedModelTrace) {
      return (
        <div
          css={{
            height: '100%',
            marginLeft: -theme.spacing.lg,
            marginRight: -theme.spacing.lg,
            marginBottom: -theme.spacing.lg,
          }}
          // This is required for mousewheel scrolling within `Drawer`
          onWheel={(e) => e.stopPropagation()}
        >
          <ContextProviders experimentId={traceInfoToUse?.experiment_id}>
            <ModelTraceExplorer
              modelTrace={combinedModelTrace}
              selectedSpanId={selectedSpanId}
              onSelectSpan={onSelectSpan}
            />
          </ContextProviders>
        </div>
      );
    }
    return null;
  };

  return (
    <Drawer.Root
      modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Drawer.Content
        componentId="codegen_mlflow_app_src_experiment-tracking_components_traces_tracedatadrawer.tsx_222"
        width="90vw"
        title={title}
        expandContentToFullHeight
      >
        {renderContent()}
      </Drawer.Content>
    </Drawer.Root>
  );
};
```

--------------------------------------------------------------------------------

````

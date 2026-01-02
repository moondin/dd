---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 523
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 523 of 991)

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

---[FILE: RunsChartsDifferenceChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsDifferenceChartCard.tsx
Signals: React

```typescript
import { Button, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useCallback, useMemo } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import {
  DISABLED_GROUP_WHEN_GROUPBY,
  DifferenceCardConfigCompareGroup,
  type RunsChartsCardConfig,
  type RunsChartsDifferenceCardConfig,
} from '../../runs-charts.types';
import type { RunsChartCardFullScreenProps } from './ChartCard.common';
import { type RunsChartCardReorderProps, RunsChartCardWrapper, RunsChartsChartsDragGroup } from './ChartCard.common';
import { useConfirmChartCardConfigurationFn } from '../../hooks/useRunsChartsUIConfiguration';
import { useIntl, FormattedMessage } from 'react-intl';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import { DifferenceViewPlot } from '../charts/DifferenceViewPlot';

export interface RunsChartsDifferenceChartCardProps extends RunsChartCardReorderProps, RunsChartCardFullScreenProps {
  config: RunsChartsDifferenceCardConfig;
  chartRunData: RunsChartsRunData[];

  hideEmptyCharts?: boolean;

  onDelete: () => void;
  onEdit: () => void;
  groupBy: RunsGroupByConfig | null;
}

/**
 * A placeholder component displayed before runs difference chart is being configured by user
 */
const NotConfiguredDifferenceChartPlaceholder = ({ onEdit }: { onEdit: () => void }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
        <Typography.Title css={{ marginTop: theme.spacing.md }} color="secondary" level={3}>
          <FormattedMessage
            defaultMessage="Compare runs"
            description="Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > chart not configured warning > title"
          />
        </Typography.Title>
        <Typography.Text css={{ marginBottom: theme.spacing.md }} color="secondary">
          <FormattedMessage
            defaultMessage="Use the runs difference view to compare model and system metrics, parameters, attributes,
            and tags across runs."
            description="Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > chart not configured warning > description"
          />
        </Typography.Text>
        <Button componentId="mlflow.charts.difference_chart_configure_button" type="primary" onClick={onEdit}>
          <FormattedMessage
            defaultMessage="Configure chart"
            description="Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > configure chart button"
          />
        </Button>
      </div>
    </div>
  );
};

export const RunsChartsDifferenceChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  groupBy,
  fullScreen,
  setFullScreenChart,
  hideEmptyCharts,
  ...reorderProps
}: RunsChartsDifferenceChartCardProps) => {
  const toggleFullScreenChart = () => {
    setFullScreenChart?.({
      config,
      title: config.chartName,
      subtitle: null,
    });
  };

  const [isConfigured, slicedRuns] = useMemo(() => {
    const configured = Boolean(config.compareGroups?.length);
    return [configured, chartRunData.filter(({ hidden }) => !hidden).reverse()];
  }, [chartRunData, config]);

  const isEmptyDataset = useMemo(() => {
    return !isConfigured;
  }, [isConfigured]);

  const confirmChartCardConfiguration = useConfirmChartCardConfigurationFn();

  const setCardConfig = (setter: (current: RunsChartsCardConfig) => RunsChartsDifferenceCardConfig) => {
    confirmChartCardConfiguration(setter(config));
  };

  const showChangeFromBaselineToggle = useCallback(() => {
    confirmChartCardConfiguration({
      ...config,
      showChangeFromBaseline: !config.showChangeFromBaseline,
    } as RunsChartsCardConfig);
  }, [config, confirmChartCardConfiguration]);

  const showDifferencesOnlyToggle = useCallback(() => {
    confirmChartCardConfiguration({
      ...config,
      showDifferencesOnly: !config.showDifferencesOnly,
    } as RunsChartsCardConfig);
  }, [config, confirmChartCardConfiguration]);

  const { formatMessage } = useIntl();

  const chartBody = (
    <>
      {!isConfigured ? (
        <NotConfiguredDifferenceChartPlaceholder onEdit={onEdit} />
      ) : (
        <DifferenceViewPlot
          previewData={slicedRuns}
          groupBy={groupBy}
          cardConfig={config}
          setCardConfig={setCardConfig}
        />
      )}
    </>
  );
  let showTooltip = undefined;
  if (groupBy && DISABLED_GROUP_WHEN_GROUPBY.some((group) => config.compareGroups.includes(group))) {
    showTooltip = formatMessage({
      defaultMessage: 'Disable grouped runs to compare parameters, tag, or attributes',
      description:
        'Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > disable group runs tooltip message',
    });
  }
  if (fullScreen) {
    return chartBody;
  }

  // Do not render the card if the chart is empty and the user has enabled hiding empty charts
  if (hideEmptyCharts && isEmptyDataset) {
    return null;
  }

  return (
    <RunsChartCardWrapper
      onEdit={onEdit}
      onDelete={onDelete}
      title={config.chartName}
      uuid={config.uuid}
      dragGroupKey={RunsChartsChartsDragGroup.GENERAL_AREA}
      toggleFullScreenChart={toggleFullScreenChart}
      toggles={[
        {
          toggleLabel: formatMessage({
            defaultMessage: 'Show change from baseline',
            description:
              'Runs charts > components > cards > RunsChartsDifferenceChartCard > Show change from baseline toggle label',
          }),
          currentToggle: config.showChangeFromBaseline,
          setToggle: showChangeFromBaselineToggle,
        },
        {
          toggleLabel: formatMessage({
            defaultMessage: 'Show differences only',
            description:
              'Runs charts > components > cards > RunsChartsDifferenceChartCard > Show differences only toggle label',
          }),
          currentToggle: config.showDifferencesOnly,
          setToggle: showDifferencesOnlyToggle,
        },
      ]}
      tooltip={showTooltip}
      {...reorderProps}
    >
      {chartBody}
    </RunsChartCardWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsImageChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsImageChartCard.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import type { RunsChartCardFullScreenProps } from './ChartCard.common';
import { type RunsChartCardReorderProps, RunsChartCardWrapper, RunsChartsChartsDragGroup } from './ChartCard.common';
import { useConfirmChartCardConfigurationFn } from '../../hooks/useRunsChartsUIConfiguration';
import type { RunsChartsCardConfig, RunsChartsImageCardConfig } from '../../runs-charts.types';
import { ImageGridPlot } from '../charts/ImageGridPlot';
import { useDesignSystemTheme } from '@databricks/design-system';
import { useImageSliderStepMarks } from '../../hooks/useImageSliderStepMarks';
import {
  DEFAULT_IMAGE_GRID_CHART_NAME,
  LOG_IMAGE_TAG_INDICATOR,
  NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE,
} from '@mlflow/mlflow/src/experiment-tracking/constants';
import { LineSmoothSlider } from '@mlflow/mlflow/src/experiment-tracking/components/LineSmoothSlider';
import type { RunsGroupByConfig } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/utils/experimentPage.group-row-utils';

export interface RunsChartsImageChartCardProps extends RunsChartCardReorderProps, RunsChartCardFullScreenProps {
  config: RunsChartsImageCardConfig;
  chartRunData: RunsChartsRunData[];

  onDelete: () => void;
  onEdit: () => void;
  groupBy: RunsGroupByConfig | null;
}

export const RunsChartsImageChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  groupBy,
  fullScreen,
  setFullScreenChart,
  ...reorderProps
}: RunsChartsImageChartCardProps) => {
  const { theme } = useDesignSystemTheme();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Optimizations for smoother slider experience. Maintain a local copy of config, and update
  // the global state only after the user has finished dragging the slider.
  const [tmpConfig, setTmpConfig] = useState(config);
  const confirmChartCardConfiguration = useConfirmChartCardConfigurationFn();
  const updateStep = useCallback(
    (newStep: number) => {
      // Skip updating base chart config if step is the same as current step.
      if (config.step === newStep) {
        return;
      }
      confirmChartCardConfiguration({ ...config, step: newStep } as RunsChartsImageCardConfig);
    },
    [config, confirmChartCardConfiguration],
  );
  const tmpStepChange = useCallback((newStep: number) => {
    setTmpConfig((currentConfig) => {
      // Skip updating temporary config if step is the same as current step.
      if (currentConfig.step === newStep) {
        return currentConfig;
      }
      return { ...currentConfig, step: newStep };
    });
  }, []);

  const chartName = config.imageKeys.length === 1 ? config.imageKeys[0] : DEFAULT_IMAGE_GRID_CHART_NAME;

  const toggleFullScreenChart = () => {
    setFullScreenChart?.({
      config,
      title: chartName,
      subtitle: null,
    });
  };

  const slicedRuns = useMemo(() => chartRunData.filter(({ hidden }) => !hidden).reverse(), [chartRunData]);

  const setCardConfig = useCallback(
    (setter: (current: RunsChartsCardConfig) => RunsChartsImageCardConfig) => {
      confirmChartCardConfiguration(setter(config));
    },
    [config, confirmChartCardConfiguration],
  );

  const { stepMarks, maxMark, minMark } = useImageSliderStepMarks({
    data: slicedRuns,
    selectedImageKeys: config.imageKeys || [],
  });

  const stepMarkLength = Object.keys(stepMarks).length;

  useEffect(() => {
    // If there is only one step mark, set the step to the min mark
    if (stepMarkLength === 1 && tmpConfig.step !== minMark) {
      updateStep(minMark);
      tmpStepChange(minMark);
    }
  }, [minMark, stepMarkLength, tmpConfig.step, updateStep, tmpStepChange]);

  const shouldDisplayImageLimitIndicator =
    slicedRuns.filter((run) => {
      return run.tags[LOG_IMAGE_TAG_INDICATOR];
    }).length > NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE;

  const chartBody = (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: fullScreen ? '100%' : undefined,
        width: '100%',
        overflow: 'hidden',
        marginTop: theme.spacing.sm,
        gap: theme.spacing.md,
      }}
    >
      <div
        ref={containerRef}
        css={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        <ImageGridPlot
          previewData={slicedRuns}
          groupBy={groupBy}
          cardConfig={tmpConfig}
          setCardConfig={setCardConfig}
        />
      </div>
      <div
        css={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'inline-flex',
          gap: theme.spacing.md,
        }}
      >
        <div css={{ flex: 1 }}>
          <LineSmoothSlider
            value={tmpConfig.step}
            onChange={tmpStepChange}
            max={maxMark}
            min={minMark}
            marks={stepMarks}
            disabled={Object.keys(stepMarks).length <= 1}
            onAfterChange={updateStep}
            css={{
              '&[data-orientation="horizontal"]': { width: 'auto' },
            }}
          />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return chartBody;
  }

  const cardBodyToRender = chartBody;

  return (
    <RunsChartCardWrapper
      onEdit={onEdit}
      onDelete={onDelete}
      title={chartName}
      subtitle={
        shouldDisplayImageLimitIndicator && `Displaying images from first ${NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE} runs`
      }
      uuid={config.uuid}
      dragGroupKey={RunsChartsChartsDragGroup.GENERAL_AREA}
      toggleFullScreenChart={toggleFullScreenChart}
      {...reorderProps}
    >
      {cardBodyToRender}
    </RunsChartCardWrapper>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsLineChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsLineChartCard.tsx
Signals: React, Redux/RTK

```typescript
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { RunsChartsLineChartXAxisType, removeOutliersFromMetricHistory } from '../RunsCharts.common';
import { RunsMetricsLinePlot } from '../RunsMetricsLinePlot';
import { RunsChartsTooltipMode, useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import {
  RunsChartsLineChartYAxisType,
  type RunsChartsCardConfig,
  type RunsChartsLineCardConfig,
} from '../../runs-charts.types';
import type { RunsChartCardVisibilityProps, RunsChartCardSizeProps } from './ChartCard.common';
import {
  type RunsChartCardReorderProps,
  RunsChartCardWrapper,
  RunsChartsChartsDragGroup,
  RunsChartCardLoadingPlaceholder,
} from './ChartCard.common';
import { useSampledMetricHistory } from '../../hooks/useSampledMetricHistory';
import { compact, intersection, isEqual, isUndefined, pick, uniq } from 'lodash';
import {
  shouldEnableRelativeTimeDateAxis,
  shouldEnableChartExpressions,
} from '../../../../../common/utils/FeatureUtils';
import { findAbsoluteTimestampRangeForRelativeRange } from '../../utils/findChartStepsByTimestamp';
import type { Figure } from 'react-plotly.js';
import type { ReduxState } from '../../../../../redux-types';
import { shallowEqual, useSelector } from 'react-redux';
import { useCompareRunChartSelectedRange } from '../../hooks/useCompareRunChartSelectedRange';
import type { MetricHistoryByName } from '@mlflow/mlflow/src/experiment-tracking/types';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import { useGroupedChartRunData } from '../../../runs-compare/hooks/useGroupedChartRunData';
import type { ExperimentChartImageDownloadFileFormat } from '../../hooks/useChartImageDownloadHandler';
import { useChartImageDownloadHandler } from '../../hooks/useChartImageDownloadHandler';
import { downloadChartMetricHistoryCsv } from '../../../experiment-page/utils/experimentPage.common-utils';
import { RunsChartsNoDataFoundIndicator } from '../RunsChartsNoDataFoundIndicator';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';
import { useLineChartGlobalConfig } from '../hooks/useLineChartGlobalConfig';

const getV2ChartTitle = (cardConfig: RunsChartsLineCardConfig): string => {
  if (shouldEnableChartExpressions() && cardConfig.yAxisKey === RunsChartsLineChartYAxisType.EXPRESSION) {
    const expressions = cardConfig.yAxisExpressions?.map((exp) => exp.expression) || [];
    return expressions?.join(' vs ') || '';
  }
  if (!cardConfig.selectedMetricKeys || cardConfig.selectedMetricKeys.length === 0) {
    return cardConfig.metricKey;
  }

  return cardConfig.selectedMetricKeys.join(' vs ');
};

export interface RunsChartsLineChartCardProps
  extends RunsChartCardReorderProps,
    RunsChartCardSizeProps,
    RunsChartCardVisibilityProps {
  config: RunsChartsLineCardConfig;
  chartRunData: RunsChartsRunData[];

  groupBy: RunsGroupByConfig | null;

  onDelete: () => void;
  onEdit: () => void;

  fullScreen?: boolean;

  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;

  setFullScreenChart?: (chart: { config: RunsChartsCardConfig; title: string; subtitle: ReactNode }) => void;
  onDownloadFullMetricHistoryCsv?: (runUuids: string[], metricKeys: string[]) => void;

  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
}

const SUPPORTED_DOWNLOAD_FORMATS: (ExperimentChartImageDownloadFileFormat | 'csv' | 'csv-full')[] = [
  'png',
  'svg',
  'csv',
  'csv-full',
];

export const RunsChartsLineChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  onDownloadFullMetricHistoryCsv,
  groupBy,
  fullScreen,
  setFullScreenChart,
  autoRefreshEnabled,
  hideEmptyCharts,
  globalLineChartConfig,
  isInViewport: isInViewportProp,
  isInViewportDeferred: isInViewportDeferredProp,
  positionInSection,
  ...reorderProps
}: RunsChartsLineChartCardProps) => {
  const { xAxisKey, selectedXAxisMetricKey, lineSmoothness } = useLineChartGlobalConfig(config, globalLineChartConfig);

  const toggleFullScreenChart = useCallback(() => {
    setFullScreenChart?.({
      config,
      title: getV2ChartTitle(config),
      subtitle: null,
    });
  }, [config, setFullScreenChart]);

  const slicedRuns = useMemo(() => chartRunData.filter(({ hidden }) => !hidden).reverse(), [chartRunData]);

  const isGrouped = useMemo(() => slicedRuns.some((r) => r.groupParentInfo), [slicedRuns]);

  const isEmptyDataset = useMemo(() => {
    const metricKeys = config.selectedMetricKeys ?? [config.metricKey];
    const metricsInRuns = slicedRuns.flatMap(({ metrics }) => Object.keys(metrics));
    return intersection(metricKeys, uniq(metricsInRuns)).length === 0;
  }, [config, slicedRuns]);

  const runUuidsToFetch = useMemo(() => {
    if (isGrouped) {
      // First, get all runs inside visible groups
      const runsInGroups = compact(slicedRuns.map((r) => r.groupParentInfo)).flatMap((g) => g.runUuids);

      // Finally, get "remaining" runs that are not grouped
      const ungroupedRuns = compact(
        slicedRuns.filter((r) => !r.groupParentInfo && !r.belongsToGroup).map((r) => r.runInfo?.runUuid),
      );
      return [...runsInGroups, ...ungroupedRuns];
    }
    // If grouping is disabled, just get all run UUIDs from runInfo
    return compact(slicedRuns.map((r) => r.runInfo?.runUuid));
  }, [slicedRuns, isGrouped]);

  const metricKeys = useMemo(() => {
    const getYAxisKeys = (config: RunsChartsLineCardConfig) => {
      const fallback = [config.metricKey];
      if (!shouldEnableChartExpressions() || config.yAxisKey !== RunsChartsLineChartYAxisType.EXPRESSION) {
        return config.selectedMetricKeys ?? fallback;
      }
      const yAxisKeys = config.yAxisExpressions?.reduce((acc, exp) => {
        exp.variables.forEach((variable) => acc.add(variable));
        return acc;
      }, new Set<string>());
      return yAxisKeys === undefined ? fallback : Array.from(yAxisKeys);
    };
    const yAxisKeys = getYAxisKeys(config);
    const xAxisKeys = !selectedXAxisMetricKey ? [] : [selectedXAxisMetricKey];

    return yAxisKeys.concat(xAxisKeys);
  }, [config, selectedXAxisMetricKey]);

  const { setTooltip, resetTooltip, destroyTooltip, selectedRunUuid } = useRunsChartsTooltip(
    config,
    RunsChartsTooltipMode.MultipleTracesWithScanline,
  );

  // If the chart is in fullscreen mode, we always render its body.
  // Otherwise, we only render the chart if it is in the viewport.
  const isInViewport = fullScreen || isInViewportProp;
  const isInViewportDeferred = fullScreen || isInViewportDeferredProp;

  const { aggregateFunction } = groupBy || {};

  const sampledMetricsByRunUuid = useSelector(
    (state: ReduxState) => pick(state.entities.sampledMetricsByRunUuid, runUuidsToFetch),
    shallowEqual,
  );

  /**
   * We set a local state for changes because full screen and non-full screen charts are
   * different components - this prevents having to sync them.
   */
  const [yRangeLocal, setYRangeLocal] = useState<[number, number] | undefined>(() => {
    if (config.range && !isUndefined(config.range.yMin) && !isUndefined(config.range.yMax)) {
      return [config.range.yMin, config.range.yMax];
    }
    return undefined;
  });

  const { setOffsetTimestamp, stepRange, xRangeLocal, setXRangeLocal } = useCompareRunChartSelectedRange(
    config,
    xAxisKey,
    config.metricKey,
    sampledMetricsByRunUuid,
    runUuidsToFetch,
    xAxisKey === RunsChartsLineChartXAxisType.STEP ? config.xAxisScaleType : 'linear',
  );

  const { resultsByRunUuid, isLoading, isRefreshing } = useSampledMetricHistory({
    runUuids: runUuidsToFetch,
    metricKeys,
    enabled: isInViewportDeferred,
    maxResults: 320,
    range: stepRange,
    autoRefreshEnabled,
  });

  const chartLayoutUpdated = ({ layout }: Readonly<Figure>) => {
    // We only want to update the local state if the chart is not in full screen mode.
    // If not, this can cause synchronization issues between the full screen and non-full screen charts.
    if (!fullScreen) {
      let yAxisMin = yRangeLocal?.[0];
      let yAxisMax = yRangeLocal?.[1];
      let xAxisMin = xRangeLocal?.[0];
      let xAxisMax = xRangeLocal?.[1];

      const { autorange: yAxisAutorange, range: newYRange } = layout.yaxis || {};
      const yRangeChanged = !isEqual(yAxisAutorange ? [undefined, undefined] : newYRange, [yAxisMin, yAxisMax]);

      if (yRangeChanged) {
        // When user zoomed in/out or changed the Y range manually, hide the tooltip
        destroyTooltip();
      }

      if (yAxisAutorange) {
        yAxisMin = undefined;
        yAxisMax = undefined;
      } else if (newYRange) {
        yAxisMin = newYRange[0];
        yAxisMax = newYRange[1];
      }

      const { autorange: xAxisAutorange, range: newXRange } = layout.xaxis || {};
      if (xAxisAutorange) {
        // Remove saved range if chart is back to default viewport
        xAxisMin = undefined;
        xAxisMax = undefined;
      } else if (newXRange) {
        const ungroupedRunUuids = compact(slicedRuns.map(({ runInfo }) => runInfo?.runUuid));
        const groupedRunUuids = slicedRuns.flatMap(({ groupParentInfo }) => groupParentInfo?.runUuids ?? []);

        if (!shouldEnableRelativeTimeDateAxis() && xAxisKey === RunsChartsLineChartXAxisType.TIME_RELATIVE) {
          const timestampRange = findAbsoluteTimestampRangeForRelativeRange(
            resultsByRunUuid,
            [...ungroupedRunUuids, ...groupedRunUuids],
            newXRange as [number, number],
          );
          setOffsetTimestamp([...(timestampRange as [number, number])]);
        } else if (xAxisKey === RunsChartsLineChartXAxisType.TIME_RELATIVE_HOURS) {
          const timestampRange = findAbsoluteTimestampRangeForRelativeRange(
            resultsByRunUuid,
            [...ungroupedRunUuids, ...groupedRunUuids],
            newXRange as [number, number],
            1000 * 60 * 60, // Convert hours to milliseconds
          );
          setOffsetTimestamp([...(timestampRange as [number, number])]);
        } else {
          setOffsetTimestamp(undefined);
        }
        xAxisMin = newXRange[0];
        xAxisMax = newXRange[1];
      }

      if (
        !isEqual(
          { xMin: xRangeLocal?.[0], xMax: xRangeLocal?.[1], yMin: yRangeLocal?.[0], yMax: yRangeLocal?.[1] },
          { xMin: xAxisMin, xMax: xAxisMax, yMin: yAxisMin, yMax: yAxisMax },
        )
      ) {
        setXRangeLocal(isUndefined(xAxisMin) || isUndefined(xAxisMax) ? undefined : [xAxisMin, xAxisMax]);
        setYRangeLocal(isUndefined(yAxisMin) || isUndefined(yAxisMax) ? undefined : [yAxisMin, yAxisMax]);
      }
    }
  };

  useEffect(() => {
    destroyTooltip();
  }, [destroyTooltip, isLoading]);

  const sampledData: RunsChartsRunData[] = useMemo(
    () =>
      slicedRuns.map((run) => {
        const metricsHistory = metricKeys.reduce((acc: MetricHistoryByName, key) => {
          const history = resultsByRunUuid[run.uuid]?.[key]?.metricsHistory;
          if (history) {
            acc[key] = config.ignoreOutliers ? removeOutliersFromMetricHistory(history) : history;
          }
          return acc;
        }, {});

        return {
          ...run,
          metricsHistory,
        };
      }),
    [metricKeys, resultsByRunUuid, slicedRuns, config.ignoreOutliers],
  );

  const sampledGroupData = useGroupedChartRunData({
    enabled: isGrouped,
    ungroupedRunsData: sampledData,
    metricKeys,
    sampledDataResultsByRunUuid: resultsByRunUuid,
    aggregateFunction,
    selectedXAxisMetricKey: xAxisKey === RunsChartsLineChartXAxisType.METRIC ? selectedXAxisMetricKey : undefined,
    ignoreOutliers: config.ignoreOutliers ?? false,
  });

  // Use grouped data traces only if enabled and if there are any groups
  const chartData = isGrouped ? sampledGroupData : sampledData;

  const [imageDownloadHandler, setImageDownloadHandler] = useChartImageDownloadHandler();

  // If the component is not in the viewport, we don't want to render the chart
  const renderChartBody = isInViewport;

  // If the data is loading or chart has just entered the viewport, show a skeleton
  const renderSkeleton = isLoading || !isInViewportDeferred;

  const chartBody = (
    <div
      css={[
        styles.lineChartCardWrapper,
        {
          height: fullScreen ? '100%' : undefined,
        },
      ]}
    >
      {!renderChartBody ? null : renderSkeleton ? (
        <RunsChartCardLoadingPlaceholder />
      ) : (
        <RunsMetricsLinePlot
          runsData={chartData}
          metricKey={config.metricKey}
          selectedMetricKeys={config.selectedMetricKeys}
          scaleType={config.scaleType}
          xAxisKey={xAxisKey}
          xAxisScaleType={config.xAxisScaleType}
          yAxisKey={config.yAxisKey}
          yAxisExpressions={config.yAxisExpressions}
          selectedXAxisMetricKey={selectedXAxisMetricKey}
          lineSmoothness={lineSmoothness}
          useDefaultHoverBox={false}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          selectedRunUuid={selectedRunUuid}
          onUpdate={chartLayoutUpdated}
          xRange={xRangeLocal}
          yRange={yRangeLocal}
          fullScreen={fullScreen}
          displayPoints={config.displayPoints}
          onSetDownloadHandler={setImageDownloadHandler}
          positionInSection={positionInSection ?? 0}
        />
      )}
    </div>
  );

  const onClickDownload = useCallback(
    (format) => {
      const savedChartTitle = config.selectedMetricKeys?.join('-') ?? config.metricKey;
      if (format === 'csv-full') {
        const singleRunUuids = compact(chartData.map((d) => d.runInfo?.runUuid));
        const runUuidsFromGroups = compact(
          chartData
            .filter(({ groupParentInfo }) => groupParentInfo)
            .flatMap((group) => group.groupParentInfo?.runUuids),
        );
        const runUuids = [...singleRunUuids, ...runUuidsFromGroups];
        onDownloadFullMetricHistoryCsv?.(runUuids, config.selectedMetricKeys || [config.metricKey]);
        return;
      }
      if (format === 'csv') {
        downloadChartMetricHistoryCsv(chartData, config.selectedMetricKeys || [config.metricKey], savedChartTitle);
        return;
      }
      imageDownloadHandler?.(format, savedChartTitle);
    },
    [chartData, config, imageDownloadHandler, onDownloadFullMetricHistoryCsv],
  );

  // Do not render the card if the chart is empty and the user has enabled hiding empty charts
  if (hideEmptyCharts && isEmptyDataset) {
    return null;
  }

  if (fullScreen) {
    return chartBody;
  }

  return (
    <RunsChartCardWrapper
      onEdit={onEdit}
      onDelete={onDelete}
      title={getV2ChartTitle(config)}
      uuid={config.uuid}
      dragGroupKey={RunsChartsChartsDragGroup.GENERAL_AREA}
      supportedDownloadFormats={SUPPORTED_DOWNLOAD_FORMATS}
      onClickDownload={onClickDownload}
      // Disable fullscreen button if the chart is empty
      toggleFullScreenChart={isEmptyDataset ? undefined : toggleFullScreenChart}
      isRefreshing={isRefreshing}
      isHidden={!isInViewport}
      {...reorderProps}
    >
      {isEmptyDataset ? <RunsChartsNoDataFoundIndicator /> : chartBody}
    </RunsChartCardWrapper>
  );
};

const styles = {
  lineChartCardWrapper: {
    overflow: 'hidden',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsParallelChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsParallelChartCard.tsx
Signals: React

```typescript
import { Button, DropdownMenu, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useCallback, useMemo } from 'react';
import { ReactComponent as ParallelChartSvg } from '../../../../../common/static/parallel-chart-placeholder.svg';
import type { RunsChartsRunData } from '../RunsCharts.common';
import LazyParallelCoordinatesPlot from '../charts/LazyParallelCoordinatesPlot';
import { isParallelChartConfigured, processParallelCoordinateData } from '../../utils/parallelCoordinatesPlot.utils';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsParallelCardConfig } from '../../runs-charts.types';
import type { RunsChartCardFullScreenProps, RunsChartCardVisibilityProps } from './ChartCard.common';
import {
  type RunsChartCardReorderProps,
  RunsChartCardWrapper,
  RunsChartsChartsDragGroup,
  RunsChartCardLoadingPlaceholder,
} from './ChartCard.common';
import { FormattedMessage } from 'react-intl';
import { useUpdateExperimentViewUIState } from '../../../experiment-page/contexts/ExperimentPageUIStateContext';
import { downloadChartDataCsv } from '../../../experiment-page/utils/experimentPage.common-utils';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import { RunsChartsNoDataFoundIndicator } from '../RunsChartsNoDataFoundIndicator';

export interface RunsChartsParallelChartCardProps
  extends RunsChartCardReorderProps,
    RunsChartCardFullScreenProps,
    RunsChartCardVisibilityProps {
  config: RunsChartsParallelCardConfig;
  chartRunData: RunsChartsRunData[];

  hideEmptyCharts?: boolean;

  onDelete: () => void;
  onEdit: () => void;
  groupBy: RunsGroupByConfig | null;
}

/**
 * A placeholder component displayed before parallel coords chart is being configured by user
 */
const NotConfiguredParallelCoordsPlaceholder = ({ onEdit }: { onEdit: () => void }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
        <ParallelChartSvg />
        <Typography.Title css={{ marginTop: theme.spacing.md }} color="secondary" level={3}>
          <FormattedMessage
            defaultMessage="Compare parameter importance"
            description="Experiment page > compare runs > parallel coordinates chart > chart not configured warning > title"
          />
        </Typography.Title>
        <Typography.Text css={{ marginBottom: theme.spacing.md }} color="secondary">
          <FormattedMessage
            defaultMessage="Use the parallel coordinates chart to compare how various parameters in model affect your model metrics."
            description="Experiment page > compare runs > parallel coordinates chart > chart not configured warning > description"
          />
        </Typography.Text>
        <Button componentId="mlflow.charts.parallel_coords_chart_configure_button" type="primary" onClick={onEdit}>
          <FormattedMessage
            defaultMessage="Configure chart"
            description="Experiment page > compare runs > parallel coordinates chart > configure chart button"
          />
        </Button>
      </div>
    </div>
  );
};

/**
 * A placeholder component displayed before parallel coords chart is being configured by user
 */
const UnsupportedDataPlaceholder = () => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
        <ParallelChartSvg />
        <Typography.Title css={{ marginTop: theme.spacing.md, textAlign: 'center' }} color="secondary" level={3}>
          <FormattedMessage
            defaultMessage="Parallel coordinates chart does not support aggregated string values."
            description="Experiment page > compare runs > parallel coordinates chart > unsupported string values warning > title"
          />
        </Typography.Title>
        <Typography.Text css={{ marginBottom: theme.spacing.md }} color="secondary">
          <FormattedMessage
            defaultMessage="Use other parameters or disable run grouping to continue."
            description="Experiment page > compare runs > parallel coordinates chart > unsupported string values warning > description"
          />
        </Typography.Text>
      </div>
    </div>
  );
};

export const RunsChartsParallelChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  groupBy,
  fullScreen,
  setFullScreenChart,
  hideEmptyCharts,
  isInViewport: isInViewportProp,
  ...reorderProps
}: RunsChartsParallelChartCardProps) => {
  const updateUIState = useUpdateExperimentViewUIState();

  const toggleFullScreenChart = () => {
    setFullScreenChart?.({
      config,
      title: 'Parallel Coordinates',
      subtitle: displaySubtitle ? subtitle : null,
    });
  };

  const configuredChartRunData = useMemo(() => {
    if (config?.showAllRuns) {
      return chartRunData;
    }
    return chartRunData?.filter(({ hidden }) => !hidden);
  }, [chartRunData, config?.showAllRuns]);

  const containsStringValues = useMemo(
    () =>
      config.selectedParams?.some(
        (paramKey) => configuredChartRunData?.some((dataTrace) => isNaN(Number(dataTrace.params[paramKey]?.value))),
        [config.selectedParams, configuredChartRunData],
      ),
    [config.selectedParams, configuredChartRunData],
  );

  const updateVisibleOnlySetting = useCallback(
    (showAllRuns: boolean) => {
      updateUIState((state) => {
        const newCompareRunCharts = state.compareRunCharts?.map((existingChartConfig) => {
          if (existingChartConfig.uuid === config.uuid) {
            const parallelChartConfig = existingChartConfig as RunsChartsParallelCardConfig;
            return { ...parallelChartConfig, showAllRuns };
          }
          return existingChartConfig;
        });

        return { ...state, compareRunCharts: newCompareRunCharts };
      });
    },
    [config.uuid, updateUIState],
  );

  const [isConfigured, parallelCoordsData] = useMemo(() => {
    const configured = isParallelChartConfigured(config);

    // Prepare the data in the parcoord-es format
    const data = configured
      ? processParallelCoordinateData(configuredChartRunData, config.selectedParams, config.selectedMetrics)
      : [];

    return [configured, data];
  }, [config, configuredChartRunData]);

  const isEmptyDataset = useMemo(() => {
    return parallelCoordsData.length === 0;
  }, [parallelCoordsData]);

  // If the chart is in fullscreen mode, we always render its body.
  // Otherwise, we only render the chart if it is in the viewport.
  const isInViewport = fullScreen || isInViewportProp;

  const { setTooltip, resetTooltip, selectedRunUuid, closeContextMenu } = useRunsChartsTooltip(config);

  const containsUnsupportedValues = containsStringValues && groupBy;
  const displaySubtitle = isConfigured && !containsUnsupportedValues;

  const subtitle = (
    <>
      {config.showAllRuns ? (
        <FormattedMessage
          defaultMessage="Showing all runs"
          description="Experiment page > compare runs > parallel chart > header > indicator for all runs shown"
        />
      ) : (
        <FormattedMessage
          defaultMessage="Showing only visible runs"
          description="Experiment page > compare runs > parallel chart > header > indicator for only visible runs shown"
        />
      )}
    </>
  );

  const chartBody = (
    <>
      {!isConfigured ? (
        <NotConfiguredParallelCoordsPlaceholder onEdit={onEdit} />
      ) : containsUnsupportedValues ? (
        <UnsupportedDataPlaceholder />
      ) : parallelCoordsData.length === 0 ? (
        <RunsChartsNoDataFoundIndicator />
      ) : (
        // Avoid displaying empty set, otherwise parcoord-es goes crazy
        <div
          css={[
            styles.parallelChartCardWrapper,
            {
              height: fullScreen ? '100%' : undefined,
            },
          ]}
        >
          {isInViewport ? (
            <LazyParallelCoordinatesPlot
              data={parallelCoordsData}
              selectedParams={config.selectedParams}
              selectedMetrics={config.selectedMetrics}
              onHover={setTooltip}
              onUnhover={resetTooltip}
              axesRotateThreshold={8}
              selectedRunUuid={selectedRunUuid}
              closeContextMenu={closeContextMenu}
              fallback={<RunsChartCardLoadingPlaceholder css={{ flex: 1 }} />}
            />
          ) : null}
        </div>
      )}
    </>
  );

  if (fullScreen) {
    return chartBody;
  }

  // Do not render the card if the chart is empty and the user has enabled hiding empty charts
  if (hideEmptyCharts && isEmptyDataset) {
    return null;
  }

  const fullScreenEnabled = isConfigured && !containsUnsupportedValues && !isEmptyDataset;

  return (
    <RunsChartCardWrapper
      onEdit={onEdit}
      onDelete={onDelete}
      title="Parallel Coordinates"
      subtitle={displaySubtitle ? subtitle : null}
      uuid={config.uuid}
      tooltip={
        <FormattedMessage
          defaultMessage="The parallel coordinates chart shows runs with columns that are either numbers or strings. If a column has string entries, the runs corresponding to the 30 most recent unique values will be shown. Only runs with all relevant metrics and/or parameters will be displayed."
          description="Experiment page > charts > parallel coordinates chart > tooltip explaining what data is expected to be rendered"
        />
      }
      dragGroupKey={RunsChartsChartsDragGroup.PARALLEL_CHARTS_AREA}
      // Disable fullscreen button if the chart is empty
      toggleFullScreenChart={fullScreenEnabled ? toggleFullScreenChart : undefined}
      additionalMenuContent={
        <>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_runschartsparallelchartcard.tsx_293"
            checked={!config.showAllRuns}
            onClick={() => updateVisibleOnlySetting(false)}
          >
            <DropdownMenu.ItemIndicator />
            <FormattedMessage
              defaultMessage="Show only visible"
              description="Experiment page > compare runs tab > chart header > move down option"
            />
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_runschartsparallelchartcard.tsx_300"
            checked={config.showAllRuns}
            onClick={() => updateVisibleOnlySetting(true)}
          >
            <DropdownMenu.ItemIndicator />
            <FormattedMessage
              defaultMessage="Show all runs"
              description="Experiment page > compare runs tab > chart header > move down option"
            />
          </DropdownMenu.CheckboxItem>
        </>
      }
      supportedDownloadFormats={['csv']}
      onClickDownload={(format) => {
        const savedChartTitle = [...config.selectedMetrics, ...config.selectedParams].join('-');

        if (format === 'csv') {
          downloadChartDataCsv(configuredChartRunData, config.selectedMetrics, config.selectedParams, savedChartTitle);
        }
      }}
      {...reorderProps}
    >
      {chartBody}
    </RunsChartCardWrapper>
  );
};

const styles = {
  parallelChartCardWrapper: {
    // Set "display: flex" here (and "flex: 1" in the child element)
    // so the chart will grow in width and height
    display: 'flex',
    overflow: 'hidden',
    cursor: 'pointer',
  },
};
```

--------------------------------------------------------------------------------

````

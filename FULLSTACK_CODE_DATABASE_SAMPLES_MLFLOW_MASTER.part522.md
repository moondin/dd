---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 522
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 522 of 991)

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

---[FILE: RunsScatterPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsScatterPlot.tsx
Signals: React

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import { isNil } from 'lodash';
import type { Data, Datum, Layout, PlotMouseEvent } from 'plotly.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LazyPlot } from '../../LazyPlot';
import { useMutableChartHoverCallback } from '../hooks/useMutableHoverCallback';
import { highlightScatterTraces, useRenderRunsChartTraceHighlight } from '../hooks/useRunsChartTraceHighlight';
import type { RunsChartsRunData, RunsChartAxisDef, RunsPlotsCommonProps } from './RunsCharts.common';
import {
  commonRunsChartStyles,
  runsChartDefaultMargin,
  runsChartHoverlabel,
  createThemedPlotlyLayout,
  useDynamicPlotSize,
  getLegendDataFromRuns,
} from './RunsCharts.common';
import RunsMetricsLegendWrapper from './RunsMetricsLegendWrapper';
import { createChartImageDownloadHandler } from '../hooks/useChartImageDownloadHandler';
import { RunsChartCardLoadingPlaceholder } from './cards/ChartCard.common';

export interface RunsScatterPlotProps extends RunsPlotsCommonProps {
  /**
   * Horizontal axis with a metric or a param
   */
  xAxis: RunsChartAxisDef;

  /**
   * Vertical axis with a metric or a param
   */
  yAxis: RunsChartAxisDef;

  /**
   * Array of runs data with corresponding values
   */
  runsData: RunsChartsRunData[];
}

const PLOT_CONFIG = {
  displaylogo: false,
  scrollZoom: false,
  modeBarButtonsToRemove: ['toImage'],
};

const createTooltipTemplate = () =>
  '<b>%{customdata[1]}:</b><br>' +
  '<b>%{xaxis.title.text}:</b> %{x:.2f}<br>' +
  '<b>%{yaxis.title.text}:</b> %{y:.2f}<br>' +
  '<extra></extra>';

/**
 * Implementation of plotly.js chart displaying
 * scatter plot comparing values for a given
 * set of experiments runs
 */
export const RunsScatterPlot = React.memo(
  ({
    runsData,
    xAxis,
    yAxis,
    markerSize = 10,
    className,
    margin = runsChartDefaultMargin,
    onUpdate,
    onHover,
    onUnhover,
    width,
    height,
    useDefaultHoverBox = true,
    selectedRunUuid,
    onSetDownloadHandler,
  }: RunsScatterPlotProps) => {
    const { theme } = useDesignSystemTheme();

    const { layoutHeight, layoutWidth, setContainerDiv, containerDiv, isDynamicSizeSupported } = useDynamicPlotSize();

    const plotData = useMemo(() => {
      // Prepare empty values
      const xValues: (number | string)[] = [];
      const yValues: (number | string)[] = [];
      const colors: (number | string)[] = [];
      const tooltipData: Datum[] = [];

      // Iterate through all the runs and aggregate selected metrics/params
      for (const runData of runsData) {
        const { runInfo, metrics, params, color, uuid, displayName } = runData;
        const { runUuid, runName } = runInfo || {};
        const xAxisData = xAxis.type === 'METRIC' ? metrics : params;
        const yAxisData = yAxis.type === 'METRIC' ? metrics : params;

        const x = xAxisData?.[xAxis.dataAccessKey ?? xAxis.key]?.value;
        const y = yAxisData?.[yAxis.dataAccessKey ?? yAxis.key]?.value;

        if (!isNil(x) && !isNil(y)) {
          xValues.push(x);
          yValues.push(y);
          colors.push(color || theme.colors.primary);
          if (runUuid) {
            tooltipData.push([runUuid, runName || runUuid] as any);
          } else {
            tooltipData.push([uuid, displayName] as any);
          }
        }
      }

      return [
        {
          x: xValues,
          y: yValues,
          customdata: tooltipData,
          text: runsData.map(({ displayName }) => displayName),
          hovertemplate: useDefaultHoverBox ? createTooltipTemplate() : undefined,
          hoverinfo: useDefaultHoverBox ? undefined : 'none',
          hoverlabel: useDefaultHoverBox ? runsChartHoverlabel : undefined,
          type: 'scatter',
          mode: 'markers',
          textposition: 'bottom center',
          marker: {
            size: markerSize,
            color: colors,
          },
        } as Data,
      ];
    }, [runsData, xAxis, yAxis, theme, markerSize, useDefaultHoverBox]);

    const plotlyThemedLayout = useMemo(() => createThemedPlotlyLayout(theme), [theme]);

    const [layout, setLayout] = useState<Partial<Layout>>({
      width: width || layoutWidth,
      height: height || layoutHeight,
      margin,
      xaxis: { title: xAxis.key, tickfont: { size: 11, color: theme.colors.textSecondary } },
      yaxis: { title: yAxis.key, tickfont: { size: 11, color: theme.colors.textSecondary } },
      template: { layout: plotlyThemedLayout },
    });

    useEffect(() => {
      setLayout((current) => {
        const newLayout = {
          ...current,
          width: width || layoutWidth,
          height: height || layoutHeight,
          margin,
        };

        if (newLayout.xaxis) {
          newLayout.xaxis.title = xAxis.key;
        }

        if (newLayout.yaxis) {
          newLayout.yaxis.title = yAxis.key;
        }

        return newLayout;
      });
    }, [layoutWidth, layoutHeight, margin, xAxis.key, yAxis.key, width, height]);

    const { setHoveredPointIndex } = useRenderRunsChartTraceHighlight(
      containerDiv,
      selectedRunUuid,
      runsData,
      highlightScatterTraces,
    );

    const hoverCallback = useCallback(
      ({ points }: PlotMouseEvent) => {
        // Find the corresponding run UUID by basing on "customdata" field set in the trace data.
        // Plotly TS typings don't support custom fields so we need to cast to "any" first
        const pointCustomDataRunUuid = (points[0] as any)?.customdata?.[0];
        setHoveredPointIndex(points[0]?.pointIndex ?? -1);

        if (pointCustomDataRunUuid) {
          onHover?.(pointCustomDataRunUuid, undefined, {});
        }
      },
      [onHover, setHoveredPointIndex],
    );

    const unhoverCallback = useCallback(() => {
      onUnhover?.();
      setHoveredPointIndex(-1);
    }, [onUnhover, setHoveredPointIndex]);

    /**
     * Unfortunately plotly.js memorizes first onHover callback given on initial render,
     * so in order to achieve updated behavior we need to wrap its most recent implementation
     * in the immutable callback.
     */
    const mutableHoverCallback = useMutableChartHoverCallback(hoverCallback);

    const legendLabelData = useMemo(() => getLegendDataFromRuns(runsData), [runsData]);

    useEffect(() => {
      const dataToExport: Data[] = plotData.map((trace: Data) => ({
        ...trace,
        mode: 'text+markers',
      }));
      onSetDownloadHandler?.(createChartImageDownloadHandler(dataToExport, layout));
    }, [layout, onSetDownloadHandler, plotData]);

    const chart = (
      <div
        css={[commonRunsChartStyles.chartWrapper(theme), commonRunsChartStyles.scatterChartHighlightStyles]}
        className={className}
        ref={setContainerDiv}
      >
        <LazyPlot
          data={plotData}
          useResizeHandler={!isDynamicSizeSupported}
          css={commonRunsChartStyles.chart(theme)}
          layout={layout}
          config={PLOT_CONFIG}
          onUpdate={onUpdate}
          onHover={mutableHoverCallback}
          onUnhover={unhoverCallback}
          fallback={<RunsChartCardLoadingPlaceholder />}
        />
      </div>
    );

    return <RunsMetricsLegendWrapper labelData={legendLabelData}>{chart}</RunsMetricsLegendWrapper>;
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ChartCard.common.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/ChartCard.common.tsx
Signals: React

```typescript
import {
  Button,
  DragIcon,
  DropdownMenu,
  OverflowIcon,
  Typography,
  useDesignSystemTheme,
  LegacyInfoTooltip,
  FullscreenIcon,
  Switch,
  Spinner,
} from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import type { PropsWithChildren, ReactNode } from 'react';
import React, { memo, useCallback, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { RunsChartsRunData } from '../RunsCharts.common';
import type { RunsChartsCardConfig } from '../../runs-charts.types';
import type { ExperimentChartImageDownloadFileFormat } from '../../hooks/useChartImageDownloadHandler';
import { noop } from 'lodash';

export const DRAGGABLE_CARD_HANDLE_CLASS = 'mlflow-charts-drag-handle';
export const DRAGGABLE_CARD_TRANSITION_NAME = '--drag-transform';
export const DRAGGABLE_CARD_TRANSITION_VAR = `var(${DRAGGABLE_CARD_TRANSITION_NAME})`;

export enum RunsChartsChartsDragGroup {
  PARALLEL_CHARTS_AREA = 'PARALLEL_CHARTS_AREA',
  GENERAL_AREA = 'GENERAL_AREA',
}

export interface RunsChartCardReorderProps {
  onReorderWith: (draggedKey: string, targetDropKey: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  previousChartUuid?: string;
  nextChartUuid?: string;
  canMoveToTop: boolean;
  canMoveToBottom: boolean;
  firstChartUuid?: string;
  lastChartUuid?: string;
}

export interface RunsChartCardSizeProps {
  height?: number;
  positionInSection?: number;
}

export interface RunsChartCardVisibilityProps {
  isInViewport?: boolean;
  isInViewportDeferred?: boolean;
}

export type RunsChartCardSetFullscreenFn = (chart: {
  config: RunsChartsCardConfig;
  title: string | ReactNode;
  subtitle: ReactNode;
}) => void;

export interface RunsChartCardFullScreenProps {
  fullScreen?: boolean;
  setFullScreenChart?: RunsChartCardSetFullscreenFn;
}

export interface ChartCardToggleProps {
  toggleLabel: string;
  currentToggle: boolean;
  setToggle: () => void;
}

export interface ChartCardWrapperProps extends RunsChartCardReorderProps, RunsChartCardSizeProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  tooltip?: React.ReactNode;
  uuid?: string;
  dragGroupKey: RunsChartsChartsDragGroup;
  additionalMenuContent?: React.ReactNode;
  toggleFullScreenChart?: () => void;
  toggles?: ChartCardToggleProps[];
  isRefreshing?: boolean;
  onClickDownload?: (format: ExperimentChartImageDownloadFileFormat | 'csv' | 'csv-full') => void;
  supportedDownloadFormats?: (ExperimentChartImageDownloadFileFormat | 'csv' | 'csv-full')[];
  isHidden?: boolean;
}

/**
 * Wrapper components for all chart cards. Provides styles and adds
 * a dropdown menu with actions for configure and delete.
 */
const RunsChartCardWrapperRaw = ({
  title,
  subtitle,
  onDelete,
  onEdit,
  children,
  uuid,
  dragGroupKey,
  tooltip = '',
  onReorderWith = noop,
  canMoveDown,
  canMoveUp,
  canMoveToTop,
  canMoveToBottom,
  previousChartUuid,
  nextChartUuid,
  firstChartUuid,
  lastChartUuid,
  additionalMenuContent,
  toggleFullScreenChart,
  toggles,
  supportedDownloadFormats = [],
  onClickDownload,
  isHidden,
  height,
  isRefreshing = false,
}: PropsWithChildren<ChartCardWrapperProps>) => {
  const { theme } = useDesignSystemTheme();

  const onMoveUp = useCallback(
    () => onReorderWith(uuid || '', previousChartUuid || ''),
    [onReorderWith, uuid, previousChartUuid],
  );
  const onMoveDown = useCallback(
    () => onReorderWith(uuid || '', nextChartUuid || ''),
    [onReorderWith, uuid, nextChartUuid],
  );
  const onMoveToTop = useCallback(
    () => onReorderWith(uuid || '', firstChartUuid || ''),
    [onReorderWith, uuid, firstChartUuid],
  );
  const onMoveToBottom = useCallback(
    () => onReorderWith(uuid || '', lastChartUuid || ''),
    [onReorderWith, uuid, lastChartUuid],
  );

  const usingCustomTitle = React.isValidElement(title);

  return (
    <div
      css={{
        // Either use provided height or default to 360
        height: height ?? 360,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        backgroundColor: theme.colors.backgroundPrimary,
        padding: 12,
        // have a slightly smaller padding when the enableDeepLearningUI
        // flag is on to accomodate the legend in the charts
        paddingBottom: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.general.borderRadiusBase,
        transition: 'opacity 0.12s',
        position: 'relative',
      }}
      data-testid="experiment-view-compare-runs-card"
    >
      <div
        css={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <div
          data-testid="experiment-view-compare-runs-card-drag-handle"
          css={{
            marginTop: usingCustomTitle ? theme.spacing.sm : theme.spacing.xs,
            marginRight: theme.spacing.sm,
            cursor: 'grab',
          }}
          className={DRAGGABLE_CARD_HANDLE_CLASS}
        >
          <DragIcon />
        </div>
        {usingCustomTitle ? (
          title
        ) : (
          <div css={{ overflow: 'hidden', flex: 1, flexShrink: 1 }}>
            <Typography.Title
              title={String(title)}
              level={4}
              withoutMargins
              css={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Typography.Title>
            {subtitle && <span css={styles.subtitle(theme)}>{subtitle}</span>}
            {tooltip && <LegacyInfoTooltip css={{ verticalAlign: 'middle' }} title={tooltip} />}
          </div>
        )}
        {isRefreshing && (
          <div
            css={{
              width: theme.general.heightSm,
              height: theme.general.heightSm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner />
          </div>
        )}
        {toggles && (
          <div
            css={{
              display: 'flex',
              padding: `0px ${theme.spacing.lg}px`,
              gap: theme.spacing.md,
              alignItems: 'flex-start',
            }}
          >
            {toggles.map((toggle) => {
              return (
                <Switch
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_262"
                  key={toggle.toggleLabel}
                  checked={toggle.currentToggle}
                  onChange={toggle.setToggle}
                  label={toggle.toggleLabel}
                />
              );
            })}
          </div>
        )}
        <Button
          componentId="fullscreen_button_chartcard"
          icon={<FullscreenIcon />}
          onClick={toggleFullScreenChart}
          disabled={!toggleFullScreenChart}
        />
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_cards_chartcard.common.tsx_158"
              type="tertiary"
              icon={<OverflowIcon />}
              data-testid="experiment-view-compare-runs-card-menu"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" minWidth={100}>
            <DropdownMenu.Item
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_288"
              onClick={onEdit}
              data-testid="experiment-view-compare-runs-card-edit"
            >
              Configure
            </DropdownMenu.Item>
            <DropdownMenu.Item
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_291"
              onClick={onDelete}
              data-testid="experiment-view-compare-runs-card-delete"
            >
              Delete
            </DropdownMenu.Item>
            {supportedDownloadFormats.length > 0 && onClickDownload && (
              <>
                <DropdownMenu.Separator />
                {supportedDownloadFormats.includes('csv') && (
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_298"
                    onClick={() => onClickDownload('csv')}
                  >
                    <FormattedMessage
                      defaultMessage="Export as CSV"
                      description="Experiment page > compare runs tab > chart header > export CSV data option"
                    />
                  </DropdownMenu.Item>
                )}
                {supportedDownloadFormats.includes('svg') && (
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_316"
                    onClick={() => onClickDownload('svg')}
                  >
                    <FormattedMessage
                      defaultMessage="Download as SVG"
                      description="Experiment page > compare runs tab > chart header > download as SVG option"
                    />
                  </DropdownMenu.Item>
                )}
                {supportedDownloadFormats.includes('png') && (
                  <DropdownMenu.Item
                    componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_324"
                    onClick={() => onClickDownload('png')}
                  >
                    <FormattedMessage
                      defaultMessage="Download as PNG"
                      description="Experiment page > compare runs tab > chart header > download as PNG option"
                    />
                  </DropdownMenu.Item>
                )}
              </>
            )}
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_334"
              disabled={!canMoveToTop}
              onClick={onMoveToTop}
              data-testid="experiment-view-compare-runs-move-to-top"
            >
              <FormattedMessage
                defaultMessage="Move to top"
                description="Experiment page > compare runs tab > chart header > move to top option"
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_340"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              data-testid="experiment-view-compare-runs-move-up"
            >
              <FormattedMessage
                defaultMessage="Move up"
                description="Experiment page > compare runs tab > chart header > move up option"
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_344"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              data-testid="experiment-view-compare-runs-move-down"
            >
              <FormattedMessage
                defaultMessage="Move down"
                description="Experiment page > compare runs tab > chart header > move down option"
              />
            </DropdownMenu.Item>
            {additionalMenuContent}
            <DropdownMenu.Item
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_cards_chartcard.common.tsx_350"
              disabled={!canMoveToBottom}
              onClick={onMoveToBottom}
              data-testid="experiment-view-compare-runs-move-to-bottom"
            >
              <FormattedMessage
                defaultMessage="Move to bottom"
                description="Experiment page > compare runs tab > chart header > move to bottom option"
              />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      {children}
    </div>
  );
};

const styles = {
  chartEntry: (theme: Theme) => ({
    height: 360,
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    backgroundColor: theme.colors.backgroundPrimary,
    padding: theme.spacing.md,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.general.borderRadiusBase,
  }),
  chartComponentWrapper: () => ({
    overflow: 'hidden',
  }),
  subtitle: (theme: Theme) => ({
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginRight: 4,
    verticalAlign: 'middle',
  }),
};

export const RunsChartCardWrapper = memo(RunsChartCardWrapperRaw);

export const RunsChartCardLoadingPlaceholder = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    style?: React.CSSProperties;
  }
>(({ className, style }, ref) => (
  <div
    css={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}
    className={className}
    style={style}
    ref={ref}
  >
    <Spinner />
  </div>
));
```

--------------------------------------------------------------------------------

---[FILE: RunsChartCardRenderError.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartCardRenderError.tsx

```typescript
import { DangerIcon, Empty } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export const RunsChartCardRenderError = () => (
  <div css={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Empty
      title={
        <FormattedMessage
          defaultMessage="Failed to load chart"
          description="Title for the error message when the MLflow chart fails to load"
        />
      }
      description={
        <FormattedMessage
          defaultMessage="There was an unrecoverable error while loading the chart. Please try to reconfigure the chart and/or reload the window."
          description="Description for the error message when the MLflow chart fails to load"
        />
      }
      image={<DangerIcon />}
    />
  </div>
);
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsBarChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsBarChartCard.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { RunsMetricsBarPlot } from '../RunsMetricsBarPlot';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsBarCardConfig } from '../../runs-charts.types';
import type { RunsChartCardFullScreenProps, RunsChartCardVisibilityProps } from './ChartCard.common';
import { RunsChartCardWrapper, type RunsChartCardReorderProps, RunsChartsChartsDragGroup } from './ChartCard.common';
import { useChartImageDownloadHandler } from '../../hooks/useChartImageDownloadHandler';
import { downloadChartDataCsv } from '../../../experiment-page/utils/experimentPage.common-utils';
import { customMetricBehaviorDefs } from '../../../experiment-page/utils/customMetricBehaviorUtils';
import { RunsChartsNoDataFoundIndicator } from '../RunsChartsNoDataFoundIndicator';
import { Tag, Typography } from '@databricks/design-system';

export interface RunsChartsBarChartCardProps
  extends RunsChartCardReorderProps,
    RunsChartCardFullScreenProps,
    RunsChartCardVisibilityProps {
  config: RunsChartsBarCardConfig;
  chartRunData: RunsChartsRunData[];

  hideEmptyCharts?: boolean;

  onDelete: () => void;
  onEdit: () => void;
}

export const barChartCardDefaultMargin = {
  t: 24,
  b: 48,
  r: 0,
  l: 4,
  pad: 0,
};

export const RunsChartsBarChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  fullScreen,
  setFullScreenChart,
  hideEmptyCharts,
  isInViewport: isInViewportProp,
  ...reorderProps
}: RunsChartsBarChartCardProps) => {
  const dataKey = config.dataAccessKey ?? config.metricKey;

  const toggleFullScreenChart = () => {
    setFullScreenChart?.({
      config,
      title: customMetricBehaviorDefs[config.metricKey]?.displayName ?? config.metricKey,
      subtitle: null,
    });
  };

  const slicedRuns = useMemo(
    () => chartRunData.filter(({ hidden, metrics }) => !hidden && metrics[dataKey]),
    [chartRunData, dataKey],
  );

  const isEmptyDataset = useMemo(() => {
    const metricsInRuns = slicedRuns.flatMap(({ metrics }) => Object.keys(metrics));
    return !metricsInRuns.includes(dataKey);
  }, [dataKey, slicedRuns]);

  const { setTooltip, resetTooltip, selectedRunUuid } = useRunsChartsTooltip(config);

  // If the chart is in fullscreen mode, we always render its body.
  // Otherwise, we only render the chart if it is in the viewport.
  const isInViewport = fullScreen || isInViewportProp;

  const [imageDownloadHandler, setImageDownloadHandler] = useChartImageDownloadHandler();

  const chartBody = (
    <div
      css={[
        styles.barChartCardWrapper,
        {
          height: fullScreen ? '100%' : undefined,
        },
      ]}
    >
      {isInViewport ? (
        <RunsMetricsBarPlot
          runsData={slicedRuns}
          metricKey={dataKey}
          displayRunNames={false}
          displayMetricKey={false}
          useDefaultHoverBox={false}
          margin={barChartCardDefaultMargin}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          selectedRunUuid={selectedRunUuid}
          onSetDownloadHandler={setImageDownloadHandler}
        />
      ) : null}
    </div>
  );

  if (fullScreen) {
    return chartBody;
  }

  // Do not render the card if the chart is empty and the user has enabled hiding empty charts
  if (hideEmptyCharts && isEmptyDataset) {
    return null;
  }

  const chartTitle = (() => {
    if (config.datasetName) {
      return (
        <div css={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <Typography.Text title={config.metricKey} ellipsis bold>
            <Tag componentId="mlflow.charts.bar_card_title.dataset_tag" css={{ marginRight: 0 }}>
              {config.datasetName}
            </Tag>{' '}
            {config.metricKey}
          </Typography.Text>
        </div>
      );
    }
    return customMetricBehaviorDefs[config.metricKey]?.displayName ?? config.displayName ?? config.metricKey;
  })();

  return (
    <RunsChartCardWrapper
      onEdit={onEdit}
      onDelete={onDelete}
      title={chartTitle}
      uuid={config.uuid}
      dragGroupKey={RunsChartsChartsDragGroup.GENERAL_AREA}
      // Disable fullscreen button if the chart is empty
      toggleFullScreenChart={isEmptyDataset ? undefined : toggleFullScreenChart}
      supportedDownloadFormats={['png', 'svg', 'csv']}
      onClickDownload={(format) => {
        if (format === 'csv' || format === 'csv-full') {
          const runsToExport = [...slicedRuns].reverse();
          downloadChartDataCsv(runsToExport, [config.metricKey], [], config.metricKey);
          return;
        }
        imageDownloadHandler?.(format, config.metricKey);
      }}
      {...reorderProps}
    >
      {isEmptyDataset ? <RunsChartsNoDataFoundIndicator /> : chartBody}
    </RunsChartCardWrapper>
  );
};

const styles = {
  barChartCardWrapper: {
    overflow: 'hidden',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsCard.tsx
Signals: React

```typescript
import { useMemo, memo } from 'react';
import { RunsChartType } from '../../runs-charts.types';
import type {
  RunsChartsBarCardConfig,
  RunsChartsCardConfig,
  RunsChartsContourCardConfig,
  RunsChartsDifferenceCardConfig,
  RunsChartsImageCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsParallelCardConfig,
  RunsChartsScatterCardConfig,
} from '../../runs-charts.types';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { RunsChartsBarChartCard } from './RunsChartsBarChartCard';
import { RunsChartsLineChartCard } from './RunsChartsLineChartCard';
import { RunsChartsScatterChartCard } from './RunsChartsScatterChartCard';
import { RunsChartsContourChartCard } from './RunsChartsContourChartCard';
import { RunsChartsParallelChartCard } from './RunsChartsParallelChartCard';
import type {
  RunsChartCardFullScreenProps,
  RunsChartCardReorderProps,
  RunsChartCardSizeProps,
  RunsChartCardVisibilityProps,
} from './ChartCard.common';
import { RunsChartsDifferenceChartCard } from './RunsChartsDifferenceChartCard';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import { RunsChartsImageChartCard } from './RunsChartsImageChartCard';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';

export interface RunsChartsCardProps
  extends RunsChartCardReorderProps,
    RunsChartCardFullScreenProps,
    RunsChartCardVisibilityProps,
    RunsChartCardSizeProps {
  cardConfig: RunsChartsCardConfig;
  chartRunData: RunsChartsRunData[];
  onStartEditChart: (chart: RunsChartsCardConfig) => void;
  onRemoveChart: (chart: RunsChartsCardConfig) => void;
  onDownloadFullMetricHistoryCsv?: (runUuids: string[], metricKeys: string[]) => void;
  index: number;
  sectionIndex?: number;
  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;
  groupBy: RunsGroupByConfig | null;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
}

const RunsChartsCardRaw = ({
  cardConfig,
  chartRunData,
  index,
  sectionIndex,
  onStartEditChart,
  onRemoveChart,
  setFullScreenChart,
  groupBy,
  fullScreen,
  canMoveDown,
  canMoveUp,
  canMoveToTop,
  canMoveToBottom,
  previousChartUuid,
  nextChartUuid,
  firstChartUuid,
  lastChartUuid,
  onReorderWith,
  autoRefreshEnabled,
  onDownloadFullMetricHistoryCsv,
  hideEmptyCharts,
  globalLineChartConfig,
  height,
  isInViewport,
  isInViewportDeferred,
}: RunsChartsCardProps) => {
  const reorderProps = useMemo(
    () => ({
      onReorderWith,
      canMoveDown,
      canMoveUp,
      previousChartUuid,
      nextChartUuid,
      canMoveToTop,
      canMoveToBottom,
      firstChartUuid,
      lastChartUuid,
    }),
    [
      onReorderWith,
      canMoveDown,
      canMoveUp,
      previousChartUuid,
      nextChartUuid,
      canMoveToTop,
      canMoveToBottom,
      firstChartUuid,
      lastChartUuid,
    ],
  );

  const editProps = useMemo(
    () => ({
      onEdit: () => onStartEditChart(cardConfig),
      onDelete: () => onRemoveChart(cardConfig),
      setFullScreenChart,
    }),
    [onStartEditChart, onRemoveChart, setFullScreenChart, cardConfig],
  );

  const commonChartProps = useMemo(
    () => ({
      fullScreen,
      autoRefreshEnabled,
      groupBy,
      hideEmptyCharts,
      height,
      isInViewport,
      isInViewportDeferred,
      ...editProps,
      ...reorderProps,
    }),
    [
      fullScreen,
      autoRefreshEnabled,
      groupBy,
      editProps,
      reorderProps,
      hideEmptyCharts,
      height,
      isInViewport,
      isInViewportDeferred,
    ],
  );

  const slicedRuns = useMemo(() => chartRunData.filter(({ hidden }) => !hidden).reverse(), [chartRunData]);

  if (cardConfig.type === RunsChartType.PARALLEL) {
    return (
      <RunsChartsParallelChartCard
        config={cardConfig as RunsChartsParallelCardConfig}
        chartRunData={chartRunData}
        {...commonChartProps}
      />
    );
  }

  if (cardConfig.type === RunsChartType.DIFFERENCE) {
    return (
      <RunsChartsDifferenceChartCard
        config={cardConfig as RunsChartsDifferenceCardConfig}
        chartRunData={chartRunData}
        {...commonChartProps}
      />
    );
  }

  if (cardConfig.type === RunsChartType.IMAGE) {
    return (
      <RunsChartsImageChartCard
        config={cardConfig as RunsChartsImageCardConfig}
        chartRunData={chartRunData}
        {...commonChartProps}
      />
    );
  }

  if (cardConfig.type === RunsChartType.BAR) {
    return (
      <RunsChartsBarChartCard
        config={cardConfig as RunsChartsBarCardConfig}
        chartRunData={slicedRuns}
        {...commonChartProps}
      />
    );
  } else if (cardConfig.type === RunsChartType.LINE) {
    return (
      <RunsChartsLineChartCard
        config={cardConfig as RunsChartsLineCardConfig}
        chartRunData={slicedRuns}
        onDownloadFullMetricHistoryCsv={onDownloadFullMetricHistoryCsv}
        globalLineChartConfig={globalLineChartConfig}
        positionInSection={index}
        {...commonChartProps}
      />
    );
  } else if (cardConfig.type === RunsChartType.SCATTER) {
    return (
      <RunsChartsScatterChartCard
        config={cardConfig as RunsChartsScatterCardConfig}
        chartRunData={slicedRuns}
        {...commonChartProps}
      />
    );
  } else if (cardConfig.type === RunsChartType.CONTOUR) {
    return (
      <RunsChartsContourChartCard
        config={cardConfig as RunsChartsContourCardConfig}
        chartRunData={slicedRuns}
        {...commonChartProps}
      />
    );
  }
  return null;
};

export const RunsChartsCard = memo(RunsChartsCardRaw);
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsContourChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsContourChartCard.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import type { RunsChartsContourCardConfig } from '../../runs-charts.types';
import type { RunsChartCardFullScreenProps, RunsChartCardReorderProps } from './ChartCard.common';
import { RunsChartCardWrapper, RunsChartsChartsDragGroup } from './ChartCard.common';
import { RunsContourPlot } from '../RunsContourPlot';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import { useChartImageDownloadHandler } from '../../hooks/useChartImageDownloadHandler';
import { downloadChartDataCsv } from '../../../experiment-page/utils/experimentPage.common-utils';
import { intersection, uniq } from 'lodash';
import { RunsChartsNoDataFoundIndicator } from '../RunsChartsNoDataFoundIndicator';

export interface RunsChartsContourChartCardProps extends RunsChartCardReorderProps, RunsChartCardFullScreenProps {
  config: RunsChartsContourCardConfig;
  chartRunData: RunsChartsRunData[];

  hideEmptyCharts?: boolean;

  onDelete: () => void;
  onEdit: () => void;
}

export const RunsChartsContourChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  fullScreen,
  setFullScreenChart,
  hideEmptyCharts,
  ...reorderProps
}: RunsChartsContourChartCardProps) => {
  const title = `${config.xaxis.key} vs. ${config.yaxis.key} vs. ${config.zaxis.key}`;

  const toggleFullScreenChart = () => {
    setFullScreenChart?.({
      config,
      title,
      subtitle: null,
    });
  };

  const slicedRuns = useMemo(() => chartRunData.filter(({ hidden }) => !hidden), [chartRunData]);

  const isEmptyDataset = useMemo(() => {
    const metricKeys = [config.xaxis.key, config.yaxis.key, config.zaxis.key];
    const metricsInRuns = slicedRuns.flatMap(({ metrics }) => Object.keys(metrics));
    return intersection(metricKeys, uniq(metricsInRuns)).length === 0;
  }, [config, slicedRuns]);

  const { setTooltip, resetTooltip, selectedRunUuid } = useRunsChartsTooltip(config);

  const [imageDownloadHandler, setImageDownloadHandler] = useChartImageDownloadHandler();

  const chartBody = (
    <div
      css={[
        styles.contourChartCardWrapper,
        {
          height: fullScreen ? '100%' : undefined,
        },
      ]}
    >
      <RunsContourPlot
        runsData={slicedRuns}
        xAxis={config.xaxis}
        yAxis={config.yaxis}
        zAxis={config.zaxis}
        useDefaultHoverBox={false}
        onHover={setTooltip}
        onUnhover={resetTooltip}
        selectedRunUuid={selectedRunUuid}
        onSetDownloadHandler={setImageDownloadHandler}
      />
    </div>
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
      title={title}
      uuid={config.uuid}
      dragGroupKey={RunsChartsChartsDragGroup.GENERAL_AREA}
      // Disable fullscreen button if the chart is empty
      toggleFullScreenChart={isEmptyDataset ? undefined : toggleFullScreenChart}
      supportedDownloadFormats={['png', 'svg', 'csv']}
      onClickDownload={(format) => {
        const savedChartTitle = [config.xaxis.key, config.yaxis.key, config.zaxis.key].join('-');
        if (format === 'csv' || format === 'csv-full') {
          const paramsToExport = [];
          const metricsToExport = [];
          for (const axis of ['xaxis' as const, 'yaxis' as const, 'zaxis' as const]) {
            if (config[axis].type === 'PARAM') {
              paramsToExport.push(config[axis].key);
            } else {
              metricsToExport.push(config[axis].key);
            }
          }
          downloadChartDataCsv(slicedRuns, metricsToExport, paramsToExport, savedChartTitle);
          return;
        }
        imageDownloadHandler?.(format, savedChartTitle);
      }}
      {...reorderProps}
    >
      {isEmptyDataset ? <RunsChartsNoDataFoundIndicator /> : chartBody}
    </RunsChartCardWrapper>
  );
};

const styles = {
  contourChartCardWrapper: {
    overflow: 'hidden',
  },
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 520
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 520 of 991)

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

---[FILE: RunsMetricsBarPlot.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsBarPlot.stories.tsx
Signals: React

```typescript
import { useState } from 'react';
import type { RunInfoEntity } from '../../../types';
import { chartColors, ChartStoryWrapper, getRandomRunName, stableNormalRandom } from './RunsCharts.stories-common';
import type { RunsMetricsBarPlotProps } from './RunsMetricsBarPlot';
import { RunsMetricsBarPlot } from './RunsMetricsBarPlot';

export default {
  title: 'Runs charts/Metrics/Bar plot',
  component: RunsMetricsBarPlot,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
};

const createMockMetricsData = (numRuns: number, negative = false): RunsMetricsBarPlotProps['runsData'] => {
  const random = stableNormalRandom(100);
  return new Array(numRuns).fill(0).map((_, index) => {
    let value = 500 * random() - 250;
    if (!negative) {
      value = Math.abs(value);
    }
    const runName = getRandomRunName(random);
    return {
      uuid: `id-for-run-${runName}`,
      displayName: runName,
      runInfo: {
        runUuid: `id-for-run-${runName}`,
        runName: runName,
      } as RunInfoEntity,
      metrics: { metric1: { value } as any },
      color: chartColors[index % chartColors.length],
    };
  });
};

const DATA = createMockMetricsData(10);
const NEGATIVE_DATA = createMockMetricsData(10, true);

const MetricsRunWrapper = ({
  runsData,
  metricKey,
  width,
  height,
  displayRunNames,
}: Pick<RunsMetricsBarPlotProps, 'runsData' | 'metricKey' | 'width' | 'height' | 'displayRunNames'>) => {
  const [hoveredRun, setHoveredRun] = useState('');
  return (
    <ChartStoryWrapper title="Line chart" controls={<>Hovered run ID: {hoveredRun}</>}>
      <RunsMetricsBarPlot
        metricKey={metricKey}
        runsData={runsData}
        onHover={setHoveredRun}
        onUnhover={() => setHoveredRun('')}
        width={width}
        height={height}
        displayRunNames={displayRunNames}
      />
    </ChartStoryWrapper>
  );
};

export const TwoRuns = () => <MetricsRunWrapper metricKey="metric1" runsData={DATA.slice(0, 2)} />;

export const TenRuns = () => <MetricsRunWrapper metricKey="metric1" runsData={DATA} />;
export const TenRunsNamesHidden = () => (
  <MetricsRunWrapper metricKey="metric1" runsData={DATA} displayRunNames={false} />
);
export const TenRunsStatic = () => <MetricsRunWrapper metricKey="metric1" runsData={DATA} width={300} height={500} />;

export const TenRunsNegative = () => <MetricsRunWrapper metricKey="metric1" runsData={NEGATIVE_DATA} />;

TwoRuns.storyName = '2 runs (auto-size)';
TenRuns.storyName = '10 runs (auto-size)';
TenRunsNamesHidden.storyName = '10 runs (auto-size, run names hidden)';
TenRunsStatic.storyName = '10 runs (static size: 300x500)';
TenRunsNegative.storyName = '10 runs with negative values (auto-size)';
```

--------------------------------------------------------------------------------

---[FILE: RunsMetricsBarPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsBarPlot.tsx
Signals: React

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import type { Config, Data, Layout } from 'plotly.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { LazyPlot } from '../../LazyPlot';
import { useMutableChartHoverCallback } from '../hooks/useMutableHoverCallback';
import { highlightBarTraces, useRenderRunsChartTraceHighlight } from '../hooks/useRunsChartTraceHighlight';
import type { RunsChartsRunData, RunsPlotsCommonProps } from './RunsCharts.common';
import {
  commonRunsChartStyles,
  runsChartDefaultMargin,
  runsChartHoverlabel,
  createThemedPlotlyLayout,
  normalizeChartValue,
  useDynamicPlotSize,
  getLegendDataFromRuns,
} from './RunsCharts.common';
import type { MetricEntity } from '../../../types';
import RunsMetricsLegendWrapper from './RunsMetricsLegendWrapper';
import { createChartImageDownloadHandler } from '../hooks/useChartImageDownloadHandler';
import { customMetricBehaviorDefs } from '../../experiment-page/utils/customMetricBehaviorUtils';
import { RunsChartCardLoadingPlaceholder } from './cards/ChartCard.common';

// We're not using params in bar plot
export type BarPlotRunData = Omit<RunsChartsRunData, 'params' | 'tags' | 'images'>;

export interface RunsMetricsBarPlotHoverData {
  xValue: string;
  yValue: number;
  index: number;
  metricEntity?: MetricEntity;
}

export interface RunsMetricsBarPlotProps extends RunsPlotsCommonProps {
  /**
   * Determines which metric are we comparing by
   */
  metricKey: string;

  /**
   * Array of runs data with corresponding values
   */
  runsData: BarPlotRunData[];

  /**
   * Relative width of the plot bar
   */
  barWidth?: number;

  /**
   * Display run names on the Y axis
   */
  displayRunNames?: boolean;

  /**
   * Display metric key on the X axis
   */
  displayMetricKey?: boolean;
}

const PLOT_CONFIG: Partial<Config> = {
  displaylogo: false,
  scrollZoom: false,
  doubleClick: 'autosize',
  showTips: false,
  modeBarButtonsToRemove: ['toImage'],
};

const Y_AXIS_PARAMS = {
  ticklabelposition: 'inside',
  tickfont: { size: 11 },
  fixedrange: true,
};

const getFixedPointValue = (val: string | number, places = 2) => (typeof val === 'number' ? val.toFixed(places) : val);

/**
 * Implementation of plotly.js chart displaying
 * bar plot comparing metrics for a given
 * set of experiments runs
 */
export const RunsMetricsBarPlot = React.memo(
  ({
    runsData,
    metricKey,
    className,
    margin = runsChartDefaultMargin,
    onUpdate,
    onHover,
    onUnhover,
    barWidth = 3 / 4,
    width,
    height,
    displayRunNames = true,
    useDefaultHoverBox = true,
    displayMetricKey = true,
    selectedRunUuid,
    onSetDownloadHandler,
  }: RunsMetricsBarPlotProps) => {
    const plotData = useMemo(() => {
      // Run uuids
      const ids = runsData.map((d) => d.uuid);

      // Trace names
      const names = runsData.map(({ displayName }) => displayName);

      // Actual metric values
      const values = runsData.map((d) => normalizeChartValue(d.metrics[metricKey]?.value));

      // Displayed metric values
      const textValues = runsData.map((d) => {
        const customMetricBehaviorDef = customMetricBehaviorDefs[metricKey];
        if (customMetricBehaviorDef) {
          return customMetricBehaviorDef.valueFormatter({ value: d.metrics[metricKey]?.value });
        }

        return getFixedPointValue(d.metrics[metricKey]?.value);
      });

      // Colors corresponding to each run
      const colors = runsData.map((d) => d.color);

      return [
        {
          y: ids,
          x: values,
          names,
          text: textValues,
          textposition: values.map((value) => (value === 0 ? 'outside' : 'auto')),
          textfont: {
            size: 11,
          },
          metrics: runsData.map((d) => d.metrics[metricKey]),
          // Display run name on hover. "<extra></extra>" removes plotly's "extra" tooltip that
          // is unnecessary here.
          type: 'bar' as any,
          hovertemplate: useDefaultHoverBox ? '%{label}<extra></extra>' : undefined,
          hoverinfo: useDefaultHoverBox ? 'y' : 'none',
          hoverlabel: useDefaultHoverBox ? runsChartHoverlabel : undefined,
          width: barWidth,

          orientation: 'h',
          marker: {
            color: colors,
          },
        } as Data & { names: string[] },
      ];
    }, [runsData, metricKey, barWidth, useDefaultHoverBox]);

    const { layoutHeight, layoutWidth, setContainerDiv, containerDiv, isDynamicSizeSupported } = useDynamicPlotSize();

    const { formatMessage } = useIntl();
    const { theme } = useDesignSystemTheme();
    const plotlyThemedLayout = useMemo(() => createThemedPlotlyLayout(theme), [theme]);

    const [layout, setLayout] = useState<Partial<Layout>>({
      width: width || layoutWidth,
      height: height || layoutHeight,
      hovermode: 'y',
      margin,
      xaxis: {
        title: displayMetricKey ? metricKey : undefined,
        tickfont: { size: 11, color: theme.colors.textSecondary },
        tickformat: customMetricBehaviorDefs[metricKey]?.chartAxisTickFormat ?? undefined,
      },
      yaxis: {
        showticklabels: displayRunNames,
        title: displayRunNames
          ? formatMessage({
              defaultMessage: 'Run name',
              description: 'Label for Y axis in bar chart when comparing metrics between runs',
            })
          : undefined,
        tickfont: { size: 11, color: theme.colors.textSecondary },
        fixedrange: true,
      },
      template: { layout: plotlyThemedLayout },
    });

    useEffect(() => {
      setLayout((current) => ({
        ...current,
        width: width || layoutWidth,
        height: height || layoutHeight,
        margin,
        xaxis: {
          ...current.xaxis,
          title: displayMetricKey ? metricKey : undefined,
        },
      }));
    }, [layoutWidth, layoutHeight, margin, metricKey, width, height, displayMetricKey]);

    const { setHoveredPointIndex } = useRenderRunsChartTraceHighlight(
      containerDiv,
      selectedRunUuid,
      runsData,
      highlightBarTraces,
    );

    const hoverCallback = useCallback(
      ({ points, event }) => {
        const metricEntity = points[0].data?.metrics[points[0].pointIndex];
        setHoveredPointIndex(points[0]?.pointIndex ?? -1);

        const hoverData: RunsMetricsBarPlotHoverData = {
          xValue: points[0].x,
          yValue: points[0].value,
          // The index of the X datum
          index: points[0].pointIndex,
          metricEntity,
        };

        const runUuid = points[0]?.label;
        if (runUuid) {
          onHover?.(runUuid, event, hoverData);
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
      // Prepare layout and data traces to export
      const layoutToExport = {
        ...layout,
        yaxis: {
          ...layout.yaxis,
          showticklabels: true,
          automargin: true,
        },
      };

      const dataToExport = plotData.map((trace) => ({
        ...trace,
        // In exported image, use names for Y axes
        y: trace.names,
      }));
      onSetDownloadHandler?.(createChartImageDownloadHandler(dataToExport, layoutToExport));
    }, [layout, onSetDownloadHandler, plotData]);

    const chart = (
      <div
        css={[commonRunsChartStyles.chartWrapper(theme), styles.highlightStyles]}
        className={className}
        ref={setContainerDiv}
      >
        <LazyPlot
          data={plotData}
          useResizeHandler={!isDynamicSizeSupported}
          css={commonRunsChartStyles.chart(theme)}
          onUpdate={onUpdate}
          layout={layout}
          config={PLOT_CONFIG}
          onHover={mutableHoverCallback}
          onUnhover={unhoverCallback}
          fallback={<RunsChartCardLoadingPlaceholder />}
        />
      </div>
    );

    return <RunsMetricsLegendWrapper labelData={legendLabelData}>{chart}</RunsMetricsLegendWrapper>;
  },
);

const styles = {
  highlightStyles: {
    '.trace.bars g.point path': {
      transition: 'var(--trace-transition)',
    },
    '.trace.bars.is-highlight g.point path': {
      opacity: 'var(--trace-opacity-dimmed-high) !important',
    },
    '.trace.bars g.point.is-hover-highlight path': {
      opacity: 'var(--trace-opacity-highlighted) !important',
    },
    '.trace.bars g.point.is-selection-highlight path': {
      opacity: 'var(--trace-opacity-highlighted) !important',
      stroke: 'var(--trace-stroke-color)',
      strokeWidth: 'var(--trace-stroke-width) !important',
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: RunsMetricsLegend.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsLegend.stories.tsx

```typescript
import { lineDashStyles } from './RunsCharts.common';
import { chartColors, getRandomRunName } from './RunsCharts.stories-common';
import type { LegendLabelData } from './RunsMetricsLegend';
import RunsMetricsLegend from './RunsMetricsLegend';

const createData = (withDashStyle: boolean): LegendLabelData[] => {
  const data = [];

  for (let i = 0; i < 10; i++) {
    data.push({
      label: getRandomRunName(),
      color: chartColors[i],
      dashStyle: withDashStyle ? lineDashStyles[i] : undefined,
    });
  }

  return data;
};

export const WithDashStyles = () => <RunsMetricsLegend labelData={createData(true)} height={500} />;
export const NoDashStyles = () => <RunsMetricsLegend labelData={createData(false)} height={500} />;

WithDashStyles.storyName = 'With dash styles';
NoDashStyles.storyName = 'No dash styles';
```

--------------------------------------------------------------------------------

---[FILE: RunsMetricsLegend.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsLegend.tsx
Signals: React

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';

import React from 'react';
import type { Dash } from 'plotly.js';

const STROKE_WIDTH = 3;

/**
 * Replicating plotly.js's dasharrays for each dash type, with smaller spaces
 * https://github.com/plotly/plotly.js/blob/master/src/components/drawing/index.js#L162
 */
const getDashArray = (dashType: Dash) => {
  switch (dashType) {
    case 'dot':
      return `${STROKE_WIDTH}`;
    case 'dash':
      return `${2 * STROKE_WIDTH}, ${STROKE_WIDTH}`;
    case 'longdash':
      return `${3 * STROKE_WIDTH}, ${STROKE_WIDTH}`;
    case 'dashdot':
      return `${2 * STROKE_WIDTH}, ${STROKE_WIDTH}, ${STROKE_WIDTH}, ${STROKE_WIDTH}`;
    case 'longdashdot':
      return `${3 * STROKE_WIDTH}, ${STROKE_WIDTH}, ${STROKE_WIDTH}, ${STROKE_WIDTH}`;
    default:
      return '';
  }
};

export type LegendLabelData = {
  label: string;
  color: string;
  dashStyle?: Dash;
  uuid?: string;
  metricKey?: string;
};

const TraceLabel: React.FC<React.PropsWithChildren<LegendLabelData>> = ({ label, color, dashStyle }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        textOverflow: 'ellipsis',
        flexShrink: 0,
        marginRight: theme.spacing.md,
        maxWidth: '100%',
      }}
    >
      <TraceLabelColorIndicator color={color} dashStyle={dashStyle} />
      <Typography.Text
        color="secondary"
        size="sm"
        css={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
      >
        {label}
      </Typography.Text>
    </div>
  );
};

export const TraceLabelColorIndicator: React.FC<
  React.PropsWithChildren<Pick<LegendLabelData, 'color' | 'dashStyle'>>
> = ({ color, dashStyle }) => {
  const { theme } = useDesignSystemTheme();
  const strokeDasharray = dashStyle ? getDashArray(dashStyle) : undefined;
  const pathYOffset = theme.typography.fontSizeSm / 2;

  return (
    <svg
      css={{
        height: theme.typography.fontSizeSm,
        width: STROKE_WIDTH * 8,
        marginRight: theme.spacing.xs,
        flexShrink: 0,
      }}
    >
      <path
        d={`M0,${pathYOffset}h${STROKE_WIDTH * 8}`}
        style={{
          strokeWidth: STROKE_WIDTH,
          stroke: color,
          strokeDasharray,
        }}
      />
    </svg>
  );
};
type RunsMetricsLegendProps = {
  labelData: LegendLabelData[];
  height: number;
  fullScreen?: boolean;
};

const RunsMetricsLegend: React.FC<React.PropsWithChildren<RunsMetricsLegendProps>> = ({
  labelData,
  height,
  fullScreen,
}) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        height,
        alignContent: fullScreen ? 'flex-start' : 'normal',
        gap: fullScreen ? theme.spacing.sm : 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        marginTop: fullScreen ? theme.spacing.lg : theme.spacing.sm,
      }}
    >
      {labelData.map((labelDatum) => (
        <TraceLabel
          key={
            labelDatum.uuid && labelDatum.metricKey ? `${labelDatum.uuid}-${labelDatum.metricKey}` : labelDatum.label
          }
          {...labelDatum}
        />
      ))}
    </div>
  );
};

export default RunsMetricsLegend;
```

--------------------------------------------------------------------------------

---[FILE: RunsMetricsLegendWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsLegendWrapper.tsx
Signals: React

```typescript
import React from 'react';

import type { LegendLabelData } from './RunsMetricsLegend';
import RunsMetricsLegend from './RunsMetricsLegend';
import { useDesignSystemTheme } from '@databricks/design-system';

const RunsMetricsLegendWrapper = ({
  labelData,
  fullScreen,
  children,
}: React.PropsWithChildren<{
  labelData: LegendLabelData[];
  fullScreen?: boolean;
}>) => {
  const { theme } = useDesignSystemTheme();

  const FULL_SCREEN_LEGEND_HEIGHT = 100;
  const LEGEND_HEIGHT = 32;

  const height = fullScreen ? FULL_SCREEN_LEGEND_HEIGHT : LEGEND_HEIGHT;
  const heightBuffer = fullScreen ? theme.spacing.lg : theme.spacing.md;

  return (
    <>
      <div css={{ height: `calc(100% - ${height + heightBuffer}px)` }}>{children}</div>
      <RunsMetricsLegend labelData={labelData} height={height} fullScreen={fullScreen} />
    </>
  );
};

export default RunsMetricsLegendWrapper;
```

--------------------------------------------------------------------------------

---[FILE: RunsMetricsLinePlot.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsLinePlot.stories.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';
import type { RunInfoEntity } from '../../../types';
import { chartColors, ChartStoryWrapper, getRandomRunName, stableNormalRandom } from './RunsCharts.stories-common';
import type { RunsMetricsLinePlotProps } from './RunsMetricsLinePlot';
import { RunsMetricsLinePlot } from './RunsMetricsLinePlot';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';

export default {
  title: 'Runs charts/Metrics/Line plot',
  component: RunsMetricsLinePlot,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
};

const createMockMetricsData = (
  numRuns: number,
  numValues: number,
  negative = false,
): RunsMetricsLinePlotProps['runsData'] => {
  const random = stableNormalRandom(100);
  const refDate = new Date('2022-01-01T15:00:00');
  return new Array(numRuns).fill(0).map((_, index) => {
    const metricsHistory = new Array(numValues).fill(0).map((__, stepindex) => {
      let value = 500 * random() - 250;
      if (!negative) {
        value = Math.max(Math.abs(value), 100);
      }
      const timestamp = new Date(refDate.valueOf());
      timestamp.setSeconds(timestamp.getSeconds() + stepindex ** 2);

      return {
        step: stepindex + 1,
        timestamp,
        value,
      } as any;
    });

    const runName = getRandomRunName(random);

    return {
      uuid: `id-for-run-${runName}`,
      displayName: runName,
      runInfo: {
        runUuid: `id-for-run-${runName}`,
        runName: runName,
      } as RunInfoEntity,
      metricsHistory: { metric1: metricsHistory },
      color: chartColors[index % chartColors.length],
      metrics: {},
      params: {},
    };
  });
};

const DATA = createMockMetricsData(10, 10);
const NEGATIVE_DATA = createMockMetricsData(10, 10, true);

const MetricsRunWrapper = ({
  runsData,
  disableLog = false,
  xAxisKey,
  width,
  height,
}: Pick<RunsMetricsLinePlotProps, 'runsData' | 'xAxisKey' | 'width' | 'height'> & {
  disableLog?: boolean;
}) => {
  const [log, setLog] = useState(false);
  const [polyLine, setPolyLine] = useState(false);
  const [hoveredRun, setHoveredRun] = useState('');

  const clear = useCallback(() => setHoveredRun(''), []);

  return (
    <ChartStoryWrapper
      title="Line chart"
      controls={
        <>
          {!disableLog && (
            <>
              Log scale: <input type="checkbox" checked={log} onChange={({ target: { checked } }) => setLog(checked)} />
            </>
          )}
          Poly line:{' '}
          <input type="checkbox" checked={polyLine} onChange={({ target: { checked } }) => setPolyLine(checked)} />
          hovered run: {hoveredRun}
        </>
      }
    >
      <RunsMetricsLinePlot
        metricKey="metric1"
        runsData={runsData}
        scaleType={log ? 'log' : 'linear'}
        onHover={setHoveredRun}
        onUnhover={clear}
        lineShape={polyLine ? 'linear' : 'spline'}
        xAxisKey={xAxisKey}
        selectedXAxisMetricKey=""
        width={width}
        height={height}
      />
    </ChartStoryWrapper>
  );
};

export const TwoRuns = () => <MetricsRunWrapper runsData={DATA.slice(0, 2)} />;
export const TenRuns = () => <MetricsRunWrapper runsData={DATA} />;
export const TenRunsStatic = () => <MetricsRunWrapper runsData={DATA} />;
export const TenRunsInTimeDomain = () => (
  <MetricsRunWrapper runsData={DATA} xAxisKey={RunsChartsLineChartXAxisType.TIME} />
);
export const TenRunsNegative = () => <MetricsRunWrapper runsData={NEGATIVE_DATA} disableLog />;

TwoRuns.storyName = '2 runs (auto-size)';
TenRuns.storyName = '10 runs (auto-size)';
TenRunsStatic.storyName = '10 runs (static size: 600x200)';
TenRunsInTimeDomain.storyName = '10 runs with time on X axis (auto-size)';
TenRunsNegative.storyName = '10 runs with negative values (auto-size)';
```

--------------------------------------------------------------------------------

---[FILE: RunsMetricsLinePlot.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsMetricsLinePlot.test.tsx

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import type { RunsMetricsLinePlotProps } from './RunsMetricsLinePlot';
import { RunsMetricsLinePlot } from './RunsMetricsLinePlot';
import { renderWithIntl, cleanup } from '../../../../common/utils/TestUtils.react18';
import { LazyPlot } from '../../LazyPlot';
import type { PlotParams } from 'react-plotly.js';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';

jest.mock('../../LazyPlot', () => ({
  LazyPlot: jest.fn(() => null),
}));

describe('RunsMetricsLinePlot', () => {
  const defaultProps: RunsMetricsLinePlotProps = {
    metricKey: 'testMetric',
    xAxisKey: RunsChartsLineChartXAxisType.STEP,
    lineSmoothness: 0,
    runsData: [
      {
        displayName: 'Run 1',
        uuid: 'run-1',
        metricsHistory: {
          testMetric: [
            { value: 0, step: 0, key: 'testMetric', timestamp: 1100 },
            { value: 10, step: 1, key: 'testMetric', timestamp: 1200 },
            { value: 20, step: 2, key: 'testMetric', timestamp: 1300 },
            { value: 30, step: 3, key: 'testMetric', timestamp: 1400 },
          ],
        },
      },
    ],
    selectedXAxisMetricKey: '',
  };

  // Helper function to get the last rendered props of the LazyPlot component
  const getLastRenderedPlotProps = (): PlotParams => {
    const [props] = jest.mocked(LazyPlot).mock.lastCall ?? [];
    return props;
  };

  test('it should properly filter negative values when using log scale on X axis', () => {
    // Render with linear scale and expect all values to be present
    renderWithIntl(<RunsMetricsLinePlot {...defaultProps} xAxisScaleType="linear" />);
    expect(getLastRenderedPlotProps().data[0]).toEqual(expect.objectContaining({ x: [0, 1, 2, 3] }));
    expect(getLastRenderedPlotProps().data[0]).toEqual(expect.objectContaining({ y: [0, 10, 20, 30] }));
    cleanup();

    // Render with log scale and expect non-positive values to be filtered out
    renderWithIntl(<RunsMetricsLinePlot {...defaultProps} xAxisScaleType="log" />);
    expect(getLastRenderedPlotProps().data[0]).toEqual(expect.objectContaining({ x: [1, 2, 3] }));
    expect(getLastRenderedPlotProps().data[0]).toEqual(expect.objectContaining({ y: [10, 20, 30] }));
    cleanup();
  });
});
```

--------------------------------------------------------------------------------

````

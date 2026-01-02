---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 531
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 531 of 991)

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

---[FILE: useRunsChartsMultipleTracesTooltip.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useRunsChartsMultipleTracesTooltip.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Figure } from 'react-plotly.js';
import type {
  LineChartTraceData,
  RunsCompareMultipleTracesTooltipData,
  RunsMetricsLinePlotProps,
  RunsMetricsSingleTraceTooltipData,
} from '../components/RunsMetricsLinePlot';
import { compact, isNumber, isString, isUndefined, orderBy, throttle, uniq } from 'lodash';
import type { LegendLabelData } from '../components/RunsMetricsLegend';
import type { RunsChartsLineChartXAxisType } from '../components/RunsCharts.common';

// Plotly-specific selectors for finding particular elements of interest in the plot DOM structure
const PLOTLY_SVG_SELECTOR = '.main-svg';
const PLOTLY_DRAGLAYER_SELECTOR = '.main-svg .draglayer .nsewdrag';

// Interval for throttling the tooltip data update handler
const TOOLTIP_DATA_UPDATE_INTERVAL = 50;

/**
 * Utility function, parses the microseconds from the plotly's axis boundary string
 * which are not supported by JavaScript's Date object and have to be added manually.
 *
 * E.g. transforms 2024-02-02 14:35:37.5747 into 0.7
 */
const parseMicroseconds = (plotlyAxisBoundary: string) => {
  const microsecondsString =
    isString(plotlyAxisBoundary) && plotlyAxisBoundary.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}\.([0-9]+)/)?.[1];
  if (!microsecondsString) {
    return 0;
  }

  // We turn the microseconds into a fraction of a millisecond, e.g. 0.5743 -> 574.3 -> 0.3
  return (Number(`0.${microsecondsString}`) * 1000) % 1;
};

export const useRunsMultipleTracesTooltipData = ({
  onUnhover,
  onHover,
  runsData,
  plotData,
  legendLabelData,
  containsMultipleMetricKeys,
  xAxisKeyLabel,
  xAxisKey,
  disabled = false,
  setHoveredPointIndex,
  xAxisScaleType = 'linear',
  positionInSection = 0,
}: Pick<RunsMetricsLinePlotProps, 'runsData' | 'onHover' | 'onUnhover'> & {
  plotData: LineChartTraceData[];
  legendLabelData: LegendLabelData[];
  containsMultipleMetricKeys?: boolean;
  xAxisKeyLabel: string;
  disabled?: boolean;
  xAxisKey: RunsChartsLineChartXAxisType;
  setHoveredPointIndex: (value: number) => void;
  xAxisScaleType?: 'linear' | 'log';
  positionInSection?: number;
}) => {
  // Save current boundaries/dimensions of the plot in the mutable ref object
  const chartBoundaries = useRef<{
    containerLeftPixels: number;
    plotWidthPixels: number;
    plotOffsetPixels: number;
    lowerBoundValue: number;
    valueRange: number;
    mainContainer: SVGElement | null;
    dragLayer: SVGElement | null;
    initialized: boolean;
  }>({
    containerLeftPixels: 0,
    plotWidthPixels: 0,
    plotOffsetPixels: 0,
    lowerBoundValue: 0,
    valueRange: 0,
    mainContainer: null,
    dragLayer: null,
    initialized: false,
  });

  // Keep the reference to the scanline element
  const scanlineElementRef = useRef<HTMLDivElement>(null);

  // Keep the reference to the current hovered trace data
  const currentHoveredDataPoint = useRef<RunsMetricsSingleTraceTooltipData | undefined>(undefined);

  // Calculate all visible X values each time the plot data changes
  const visibleXValues = useMemo(() => uniq(plotData.map(({ x }) => x).flat()) as number[], [plotData]);

  // Store the reference to the initialized plotly's figure object, helps keep track when the plot is initialized
  const [initializedFigure, setInitializedFigure] = useState<{
    figure: Readonly<Figure>;
    graphDiv: Readonly<HTMLElement>;
  } | null>(null);

  // We are calculating the tooltip data outside of React to avoid unnecessary re-renders,
  // so we're copying all the input data to the mutable ref objects
  const immediateHoverData = useRef<RunsCompareMultipleTracesTooltipData | undefined>(undefined);
  const immediateLegendLabelData = useRef(legendLabelData);
  const immediateRunsData = useRef(runsData);
  const immediatePlotData = useRef(plotData);
  const immediateXValuesData = useRef(visibleXValues);
  const immediateFigure = useRef(initializedFigure);

  // Update the mutable ref objects when the input data changes
  immediateLegendLabelData.current = legendLabelData;
  immediateRunsData.current = runsData;
  immediatePlotData.current = plotData;
  immediateXValuesData.current = visibleXValues;
  immediateFigure.current = initializedFigure;

  // Setup the boundaries of the plot
  const setupBoundaries = useCallback((figure: Readonly<Figure>) => {
    const lowerAxisValue = figure.layout.xaxis?.range?.[0];
    const upperAxisValue = figure.layout.xaxis?.range?.[1];

    // If the axis values are numbers, use them as is, otherwise convert them to timestamps
    let lowerBoundary = isNumber(lowerAxisValue) ? lowerAxisValue : new Date(lowerAxisValue ?? 0).getTime();
    let upperBoundary = isNumber(upperAxisValue) ? upperAxisValue : new Date(upperAxisValue ?? 0).getTime();

    lowerBoundary += parseMicroseconds(lowerAxisValue);
    upperBoundary += parseMicroseconds(upperAxisValue);

    // Save the boundaries to the mutable ref object
    chartBoundaries.current.lowerBoundValue = lowerBoundary ?? 0;
    chartBoundaries.current.valueRange = (upperBoundary ?? 0) - chartBoundaries.current.lowerBoundValue;
  }, []);

  const updateContainerPosition = useCallback(() => {
    const { mainContainer, dragLayer } = chartBoundaries.current;

    if (mainContainer && dragLayer) {
      const containerRect = mainContainer.getBoundingClientRect();
      const dragLayerRect = dragLayer.getBoundingClientRect();

      // Save the boundaries to the mutable ref object
      chartBoundaries.current.containerLeftPixels = containerRect.x;
      chartBoundaries.current.plotWidthPixels = dragLayerRect.width;
      chartBoundaries.current.plotOffsetPixels = dragLayerRect.x - containerRect.x;
      chartBoundaries.current.initialized = dragLayerRect.width > 0;
    }
  }, []);

  // This is a handler of plotly's onUpdate callback.
  // It is called when the plot is initialized and when the plot is updated.
  const onUpdatePlotHandler = useCallback(
    (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => {
      setupBoundaries(figure);

      const mainContainer: SVGElement | null = graphDiv.querySelector(PLOTLY_SVG_SELECTOR);
      const dragLayer: SVGElement | null = graphDiv.querySelector(PLOTLY_DRAGLAYER_SELECTOR);

      chartBoundaries.current.mainContainer = mainContainer;
      chartBoundaries.current.dragLayer = dragLayer;
      updateContainerPosition();
    },
    [setupBoundaries, updateContainerPosition],
  );

  // This is a handler of plotly's onInit callback.
  const onInitPlotHandler = useCallback(
    (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => {
      setInitializedFigure({ figure, graphDiv });
      onUpdatePlotHandler(figure, graphDiv);
    },
    [onUpdatePlotHandler],
  );

  useEffect(() => {
    // Recalculate positions after chart has been moved
    requestAnimationFrame(() => {
      if (!immediateFigure.current) {
        return;
      }
      onUpdatePlotHandler(immediateFigure.current.figure, immediateFigure.current.graphDiv);
    });
  }, [positionInSection, onUpdatePlotHandler]);

  // Hides the scanline when the mouse leaves the plot
  const pointerLeavePlotCallback = useCallback(
    (e: PointerEvent) => {
      // Noop if the mouse is moving to plotly's dragcover element
      if (e.relatedTarget instanceof Element && e.relatedTarget.classList.contains('dragcover')) {
        return;
      }
      onUnhover?.();
      if (scanlineElementRef.current) {
        scanlineElementRef.current.style.display = 'none';
      }
    },
    [onUnhover],
  );

  // This is a handler of plotly's onHover callback.
  const onPointHoverCallback = useCallback(
    ({ points }) => {
      const hoveredPoint = points[0];
      const hoveredPointData = hoveredPoint?.data;

      setHoveredPointIndex(hoveredPoint?.curveNumber ?? -1);

      if (!hoveredPointData) {
        return;
      }

      // Extract metric entity
      const metricEntity = hoveredPointData.metricHistory?.[hoveredPoint.pointIndex];

      const singleTraceData: RunsMetricsSingleTraceTooltipData = {
        // Value of the "x" axis (time, step)
        xValue: hoveredPoint.x,
        // Value of the "y" axis
        yValue: hoveredPoint.y,
        // Metric entity value
        metricEntity,
        // The index of the X datum
        index: hoveredPoint.pointIndex,
        // Current label ("Step", "Time" etc.)
        label: xAxisKeyLabel,
        // Run/group UUID
        traceUuid: hoveredPointData.uuid,
      };

      // Save the hovered point/trace data to the mutable ref object
      currentHoveredDataPoint.current = singleTraceData;
    },
    [xAxisKeyLabel, setHoveredPointIndex],
  );

  // This is a handler of plotly's onUnhover callback.
  const onPointUnhoverCallback = useCallback(() => {
    currentHoveredDataPoint.current = undefined;
    setHoveredPointIndex(-1);
  }, [setHoveredPointIndex]);

  const getClosestXValue = useCallback(
    (pointerClientX: number) => {
      const boundaries = chartBoundaries.current;
      // Calculate the X value of the hovered point
      const resultX =
        (pointerClientX - boundaries.plotOffsetPixels - boundaries.containerLeftPixels) / boundaries.plotWidthPixels;

      // Calculate the current step based on the X value and precalculated boundaries
      let currentStep = boundaries.lowerBoundValue + boundaries.valueRange * resultX;
      if (xAxisScaleType === 'log') {
        currentStep = 10 ** currentStep;
      }
      // Find the closest existing X value to the currently hovered value
      const closestXValue = immediateXValuesData.current.reduce((acc, x) => {
        if (Math.abs(x - currentStep) < Math.abs(acc - currentStep)) {
          return x;
        }
        return acc;
      }, immediateXValuesData.current[0]);
      return closestXValue;
    },
    [xAxisScaleType],
  );

  useEffect(() => {
    // Return early if this tooltip is disabled
    if (disabled) {
      return;
    }
    // Return early if the figure is not initialized yet
    if (!initializedFigure) {
      return;
    }

    // Setup the boundaries of the plot at the beginning
    setupBoundaries(initializedFigure.figure);

    // Get the drag layer element - this is the event-sensitive layer of rendered plotly chart
    const dragLayer: SVGElement | null = initializedFigure.graphDiv.querySelector(PLOTLY_DRAGLAYER_SELECTOR);

    // This is a throttled handler of the pointermove event, it contains some heavier logic so it's throttled for 50ms
    const tooltipDataUpdateHandler = throttle(
      (e: PointerEvent) => {
        // If for some reason the chart sizing is not initialized yet, do it now
        if (!chartBoundaries.current.initialized) {
          updateContainerPosition();
        }
        const closestXValue = getClosestXValue(e.clientX);

        // Calculate the tooltip data - based on existing legend, plot and runs data
        const data = immediateLegendLabelData.current.map((legendEntry) => {
          // First, find the corresponding data entry (from chart components's input data) and trace (from data prepared for plotly)
          const correspondingDataEntry = immediateRunsData.current.find(({ uuid }) => uuid === legendEntry.uuid);
          const correspondingDataTrace = immediatePlotData.current.find(
            ({ uuid, metricKey }) =>
              uuid === legendEntry.uuid && (!legendEntry.metricKey || legendEntry.metricKey === metricKey),
          );

          if (!correspondingDataTrace) {
            return undefined;
          }

          // Determine the display name of the metric - if there are multiple metrics, use the legend label,
          // otherwise use the display name of the corresponding data entry.
          const displayName = containsMultipleMetricKeys ? legendEntry.label : correspondingDataEntry?.displayName;

          // Find the value of the corresponding data trace at the closest X value
          const xIndex = correspondingDataTrace.x?.indexOf(closestXValue);
          if (isUndefined(xIndex) || xIndex === -1) {
            return undefined;
          }
          const value = correspondingDataTrace.y?.[xIndex];

          // Construct the tooltip legend entry
          return {
            displayName: displayName || '',
            value: isNumber(value) ? value : undefined,
            color: legendEntry?.color,
            dashStyle: legendEntry?.dashStyle,
            uuid: legendEntry.metricKey ? `${legendEntry.uuid}.${legendEntry.metricKey}` : `${legendEntry.uuid}`,
          };
        });

        // Save the tooltip data to the mutable ref object
        immediateHoverData.current = {
          tooltipLegendItems: orderBy(compact(data), 'value', 'desc'),
          hoveredDataPoint: currentHoveredDataPoint?.current,
          xValue: closestXValue,
          xAxisKey,
          xAxisKeyLabel,
        };
      },
      TOOLTIP_DATA_UPDATE_INTERVAL,
      { leading: true },
    );

    const windowResizeHandler = throttle(updateContainerPosition, TOOLTIP_DATA_UPDATE_INTERVAL);

    // This is a handler of the pointermove event.
    // It's not throttled: it just updates the scanline and tooltip position and pass precalculated tooltip data
    const hoverHandler = (e: PointerEvent) => {
      if (!immediateHoverData.current) {
        return;
      }

      const boundaries = chartBoundaries.current;
      const closestXValue = getClosestXValue(e.clientX);
      const closestXValueLeftX =
        ((xAxisScaleType === 'log' ? Math.log10(closestXValue) : closestXValue) - boundaries.lowerBoundValue) /
        boundaries.valueRange;
      const closestXValueLeftInPixels = closestXValueLeftX * boundaries.plotWidthPixels;

      // Enable and reposition the scanline
      if (scanlineElementRef.current) {
        scanlineElementRef.current.style.display = 'block';
        scanlineElementRef.current.style.left = `${boundaries.plotOffsetPixels + closestXValueLeftInPixels}px`;
      }

      onHover?.(
        immediateHoverData.current?.hoveredDataPoint?.traceUuid || '',
        {
          x: boundaries.containerLeftPixels + boundaries.plotOffsetPixels + closestXValueLeftInPixels,
          y: e.clientY,
          originalEvent: e,
        },
        immediateHoverData.current,
      );
    };

    if (dragLayer) {
      // Assign two separate handlers for move: one for updating the tooltip data, one for updating the scanline and tooltip position
      dragLayer.addEventListener('pointermove', tooltipDataUpdateHandler);
      dragLayer.addEventListener('pointermove', hoverHandler);
      window.addEventListener('resize', windowResizeHandler);

      // Assign a handler that hides the scanline and tooltip
      dragLayer.addEventListener('pointerleave', pointerLeavePlotCallback);
      return () => {
        dragLayer.removeEventListener('pointermove', tooltipDataUpdateHandler);
        dragLayer.removeEventListener('pointermove', hoverHandler);
        dragLayer.removeEventListener('pointerleave', pointerLeavePlotCallback);
        window.removeEventListener('resize', windowResizeHandler);
      };
    }

    return () => {};
  }, [
    pointerLeavePlotCallback,
    initializedFigure,
    setupBoundaries,
    onHover,
    containsMultipleMetricKeys,
    currentHoveredDataPoint,
    disabled,
    xAxisKey,
    xAxisKeyLabel,
    xAxisScaleType,
    getClosestXValue,
    updateContainerPosition,
  ]);

  const scanlineElement = disabled ? null : (
    <div
      css={{
        top: 0,
        width: 0,
        borderLeft: `1px dashed rgba(0,0,0,0.5)`,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
      }}
      ref={scanlineElementRef}
      style={{ display: 'none' }}
    />
  );

  return {
    updateHandler: onUpdatePlotHandler,
    initHandler: onInitPlotHandler,
    scanlineElement,
    onPointHover: onPointHoverCallback,
    onPointUnhover: onPointUnhoverCallback,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useRunsChartsTooltip.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useRunsChartsTooltip.enzyme.test.tsx
Signals: React

```typescript
import { describe, beforeEach, it, expect } from '@jest/globals';
import type { ReactWrapper } from 'enzyme';
import { mount } from 'enzyme';
import React from 'react';
import type { RunsChartsTooltipBodyComponent } from './useRunsChartsTooltip';
import { RunsChartsTooltipWrapper, useRunsChartsTooltip } from './useRunsChartsTooltip';

const defaultBodyComponent: RunsChartsTooltipBodyComponent = ({ runUuid }) => (
  <div data-testid="tooltip-body">
    tooltip body
    <div data-testid="tooltip-body-run-uuid">{runUuid}</div>
  </div>
);

const createWrapper = (
  contextData: string | undefined = undefined,
  chartData: string | undefined = undefined,
  TooltipBodyComponent: RunsChartsTooltipBodyComponent = defaultBodyComponent,
) => {
  const ContextComponent = ({ children }: React.PropsWithChildren<any>) => (
    <RunsChartsTooltipWrapper contextData={contextData} component={TooltipBodyComponent}>
      {children}
    </RunsChartsTooltipWrapper>
  );
  const TargetComponent = () => {
    const { setTooltip, resetTooltip } = useRunsChartsTooltip(chartData);

    return (
      <button
        data-testid="fake-chart"
        onMouseEnter={({ runId, nativeEvent, hoverData }: any) => setTooltip(runId, nativeEvent, hoverData)}
        onMouseLeave={resetTooltip}
      />
    );
  };

  return mount(
    <ContextComponent>
      <TargetComponent />
    </ContextComponent>,
  );
};

describe('useRunsChartsTooltip', () => {
  // @ts-expect-error TS(2709): Cannot use namespace 'ReactWrapper' as a type.
  let wrapper: ReactWrapper;

  beforeEach(() => {});

  const getFakeChart = () => wrapper.find('[data-testid="fake-chart"]');
  const getTooltipArea = () => wrapper.find(RunsChartsTooltipWrapper);
  const getTooltipContainer = () => wrapper.find('[data-testid="tooltip-container"]');
  const getTooltip = () => wrapper.find('[data-testid="tooltip-body"]');

  it('properly shows and hides the tooltip', () => {
    wrapper = createWrapper();
    const fakeChart = getFakeChart();

    expect(getTooltip().exists()).toBe(false);

    fakeChart.simulate('mouseenter', { runId: 'fake_run_id_123' });
    wrapper.update();

    expect(getTooltip().exists()).toBe(true);

    fakeChart.simulate('mouseleave');

    expect(getTooltip().exists()).toBe(false);
  });

  it('properly sets the tooltip content', () => {
    wrapper = createWrapper('context-data', 'chart-data', ({ runUuid, contextData, chartData }) => (
      <div data-testid="tooltip-body">
        {runUuid},{contextData},{chartData}
      </div>
    ));
    const fakeChart = getFakeChart();
    fakeChart.simulate('mouseenter', { runId: 'fake_run_id_123' });

    expect(getTooltip().exists()).toBe(true);

    expect(getTooltip().html()).toContain('fake_run_id_123,context-data,chart-data');
  });

  it('properly sets hover data', () => {
    wrapper = createWrapper(undefined, undefined, ({ runUuid, hoverData }) => (
      <div data-testid="tooltip-body">
        {runUuid}, step: {hoverData.step}
      </div>
    ));
    const fakeChart = getFakeChart();
    fakeChart.simulate('mouseenter', {
      runId: 'fake_run_id_123',
      hoverData: { step: 5 },
    });

    expect(getTooltip().exists()).toBe(true);

    expect(getTooltip().html()).toContain('fake_run_id_123, step: 5');
  });

  it('properly sets the tooltip position', () => {
    wrapper = createWrapper();
    getFakeChart().simulate('mouseenter', { runId: 'fake_run_id_123' });
    getTooltipArea().simulate('mousemove', { nativeEvent: { offsetX: 400, offsetY: 200 } });

    const styles = getComputedStyle(getTooltipContainer().getDOMNode());

    expect(styles.transform).toBe(`translate3d(${400 + 1}px, ${200 + 1}px, 0)`);
  });

  it('properly invokes the context menu out of the tooltip', () => {
    wrapper = createWrapper(undefined, undefined, ({ isHovering }) => (
      <div data-testid="tooltip-body">{!isHovering && <div>context menu only content</div>}</div>
    ));
    // Hover over the run
    getFakeChart().simulate('mouseenter', { runId: 'fake_run_id_123' });
    expect(getTooltip().exists()).toBe(true);
    expect(getTooltip().html()).not.toContain('context menu only content');

    // Lower the left mouse button
    getTooltipArea().simulate('mousedown', { button: 0, pageX: 100, pageY: 100 });

    // Next raise it without moving the cursor
    getTooltipArea().simulate('click', { button: 0, pageX: 100, pageY: 100 });

    // Assert that the resulting context-menu-only content is present
    expect(getTooltip().html()).toContain('context menu only content');
  });

  it('properly prevents the context menu from appearing if user has moved the mouse', () => {
    wrapper = createWrapper(undefined, undefined, ({ isHovering }) => (
      <div data-testid="tooltip-body">{!isHovering && <div>context menu only content</div>}</div>
    ));
    // Hover over the run
    getFakeChart().simulate('mouseenter', { runId: 'fake_run_id_123' });

    // Lower the left mouse button
    getTooltipArea().simulate('mousedown', { button: 0 });

    // Wobble our cursor a little, then release the button
    getTooltipArea().simulate('mousemove');
    getTooltipArea().simulate('click');

    // Assert that the context menu content didn't appear
    expect(getTooltip().html()).not.toContain('context menu only content');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useRunsChartsTooltip.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useRunsChartsTooltip.stories.tsx
Signals: React

```typescript
import { Button, CloseIcon } from '@databricks/design-system';
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { IntlProvider } from 'react-intl';
import type { RunInfoEntity } from '../../../types';
import { chartColors, getRandomRunName, stableNormalRandom } from '../components/RunsCharts.stories-common';
import { RunsContourPlot } from '../components/RunsContourPlot';
import { RunsMetricsBarPlot } from '../components/RunsMetricsBarPlot';
import { RunsMetricsLinePlot } from '../components/RunsMetricsLinePlot';
import { RunsScatterPlot } from '../components/RunsScatterPlot';
import type { RunsChartsTooltipBodyProps } from './useRunsChartsTooltip';
import { RunsChartsTooltipWrapper, useRunsChartsTooltip } from './useRunsChartsTooltip';

export default {
  title: 'Runs charts/Context menu',
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
};

const ContextMenuComponent = ({
  runUuid,
  contextData,
  hoverData,
  isHovering,
  closeContextMenu,
}: RunsChartsTooltipBodyProps<{ runs: ReturnType<typeof createMockData> }>) => {
  const run = contextData?.runs.find((x: any) => x.runInfo.runUuid === runUuid);

  if (!run) {
    return null;
  }

  return (
    <div>
      <div>name: {run.runInfo.runName}</div>
      <div>uuid: {runUuid}</div>
      <div>hovered menu id: {hoverData}</div>
      <div>mode: {isHovering ? 'hovering' : 'context menu'}</div>
      {!isHovering && (
        <div css={{ marginTop: 8 }}>
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_hooks_userunschartstooltip.stories.tsx_42"
            onClick={closeContextMenu}
            icon={<CloseIcon />}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Some mock data (both line- and scatter-compatible)
 */
const createMockData = (numRuns: number, numValues: number, negative = false) => {
  const random = stableNormalRandom(100);
  const refDate = new Date('2022-01-01T15:00:00');
  return new Array(numRuns).fill(0).map((_, index) => {
    const metricsHistory = new Array(numValues).fill(0).map((__, stepindex) => {
      let value = 500 * random() - 250;
      if (!negative) {
        value = Math.abs(value);
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
      runInfo: {
        runUuid: `id-for-run-${runName}`,
        runName: runName,
      } as RunInfoEntity,
      metricsHistory: { metric1: metricsHistory },
      metrics: {
        metric1: { key: 'metric1', value: Math.abs(500 * random() - 250) },
        metric2: { key: 'metric2', value: Math.abs(500 * random() - 250) },
        metric3: { key: 'metric3', value: Math.abs(500 * random() - 250) },
      } as any,
      params: {
        param1: { key: 'param1', value: Math.abs(500 * random() - 250) },
        param2: { key: 'param2', value: Math.abs(500 * random() - 250) },
        param3: { key: 'param3', value: Math.abs(500 * random() - 250) },
      } as any,
      color: chartColors[index % chartColors.length],
    };
  });
};

/**
 * Just a HOC for story purposes for easy context wrap
 */
const withChartMenuContext =
  <
    T,
    P extends JSX.IntrinsicAttributes &
      JSX.LibraryManagedAttributes<React.ComponentType<React.PropsWithChildren<T>>, React.PropsWithChildren<T>>,
  >(
    Component: React.ComponentType<React.PropsWithChildren<T>>,
  ) =>
  (props: P) => {
    const [data, setData] = useState(() => ({ runs: createMockData(15, 10) }));

    return (
      <RunsChartsTooltipWrapper component={ContextMenuComponent} contextData={data}>
        <IntlProvider locale="en">
          <div css={{ padding: 16 }}>
            <div css={{ marginBottom: 16, height: 200, overflowY: 'scroll' }}>
              <ul>
                {data.runs
                  .slice()
                  .reverse()
                  .map((run) => (
                    <li key={run.runInfo.runUuid} style={{ fontWeight: 'bold', color: run.color }}>
                      {run.runInfo.runName}
                    </li>
                  ))}
              </ul>
            </div>
            <div css={{ margin: '8px 0', display: 'flex', gap: 8 }}>
              <button onClick={() => setData({ runs: createMockData(15, 10) })}>Dataset: default</button>
              <button onClick={() => setData({ runs: createMockData(15, 10).reverse() })}>Dataset: reverse</button>
              <button onClick={() => setData({ runs: createMockData(5, 10) })}>Dataset: 5 runs</button>
              <button onClick={() => setData({ runs: createMockData(30, 10) })}>Dataset: 30 runs</button>
            </div>
            <Component {...props} data={data} />
          </div>
        </IntlProvider>
      </RunsChartsTooltipWrapper>
    );
  };

export const ChartContextMenuStory = withChartMenuContext(({ data }: any) => {
  const { setTooltip, resetTooltip } = useRunsChartsTooltip('dummy-chart-id');

  return (
    <div css={styles.chartsGrid}>
      <div css={styles.chartWrapper}>
        <RunsMetricsBarPlot
          metricKey="metric1"
          runsData={data.runs}
          useDefaultHoverBox={false}
          displayRunNames={false}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          height={400}
          margin={{
            t: 0,
            b: 48,
            r: 0,
            l: 8,
            pad: 0,
          }}
        />
      </div>
      <div css={styles.chartWrapper}>
        <RunsScatterPlot
          xAxis={{ key: 'param1', type: 'PARAM' }}
          yAxis={{ key: 'param2', type: 'PARAM' }}
          runsData={data.runs}
          useDefaultHoverBox={false}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          height={400}
        />
      </div>
      <div css={styles.chartWrapper}>
        <RunsMetricsLinePlot
          metricKey="metric1"
          selectedXAxisMetricKey=""
          runsData={data.runs}
          useDefaultHoverBox={false}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          height={400}
        />
      </div>
      <div css={styles.chartWrapper}>
        <RunsContourPlot
          xAxis={{ key: 'param3', type: 'PARAM' }}
          yAxis={{ key: 'param2', type: 'PARAM' }}
          zAxis={{ key: 'param1', type: 'PARAM' }}
          runsData={data.runs}
          useDefaultHoverBox={false}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          height={400}
        />
      </div>
    </div>
  );
});

const styles = {
  chartsGrid: { overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  chartWrapper: {
    overflow: 'hidden',
    border: `1px solid #ccc`,
    padding: 16,
    backgroundColor: 'white',
  },
};
```

--------------------------------------------------------------------------------

````

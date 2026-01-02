---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 515
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 515 of 991)

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

---[FILE: RunsCharts.common.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsCharts.common.ts
Signals: React

```typescript
import { intersection, throttle, uniq } from 'lodash';
import type { Dash, Layout, Margin } from 'plotly.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PlotParams } from 'react-plotly.js';
import type {
  ImageEntity,
  MetricEntitiesByName,
  MetricEntity,
  MetricHistoryByName,
  RunInfoEntity,
} from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import type { Theme } from '@emotion/react';
import type { LegendLabelData } from './RunsMetricsLegend';
import type {
  RunGroupParentInfo,
  RunGroupingAggregateFunction,
} from '../../experiment-page/utils/experimentPage.row-types';
import type { RunsChartsChartMouseEvent } from '../hooks/useRunsChartsTooltip';
import { defineMessages } from 'react-intl';
import type { ExperimentChartImageDownloadHandler } from '../hooks/useChartImageDownloadHandler';
import { quantile } from 'd3-array';
import type { UseGetRunQueryResponseRunInfo } from '../../run-page/hooks/useGetRunQuery';
import { shouldEnableChartExpressions } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import type {
  RunsChartsBarCardConfig,
  RunsChartsCardConfig,
  RunsChartsContourCardConfig,
  RunsChartsDifferenceCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsScatterCardConfig,
  RunsChartsParallelCardConfig,
} from '../runs-charts.types';
import { type RunsChartsLineChartExpression, RunsChartsLineChartYAxisType, RunsChartType } from '../runs-charts.types';
import { isParallelChartConfigured, processParallelCoordinateData } from '../utils/parallelCoordinatesPlot.utils';

/**
 * Common props for all charts used in experiment runs
 */
export interface RunsPlotsCommonProps {
  /**
   * A scatter layer marker size
   */
  markerSize?: number;

  /**
   * Additional class name passed to the chart wrapper
   */
  className?: string;

  /**
   * Plotly.js-compatible margin object
   */
  margin?: Partial<Margin>;

  /**
   * Callback fired when a run is hovered
   */
  onHover?: (runUuidOrParams: string, event?: RunsChartsChartMouseEvent, additionalAxisData?: any) => void;

  /**
   * Callback fired when no run is hovered anymore
   */
  onUnhover?: () => void;

  /**
   * Callback fired when the either plot's data or its layout has changed
   */
  onUpdate?: PlotParams['onUpdate'];

  /**
   * Width in pixels. If not provided, chart uses auto-sizing.
   */
  width?: number;

  /**
   * Height in pixels. If not provided, chart uses auto-sizing.
   */
  height?: number;

  /**
   * If true, renders default plotly.js powered hover box with run data
   */
  useDefaultHoverBox?: boolean;

  /**
   * Indicates which run is currently selected in the global context and should be highlighted
   */
  selectedRunUuid?: string | null;

  /**
   * If set to true, the chart will be displayed in full screen mode
   */
  fullScreen?: boolean;

  /**
   * Updates the download handler for the chart. See `ExperimentChartImageDownloadHandler` for the callback signature.
   */
  onSetDownloadHandler?: (downloadHandler: ExperimentChartImageDownloadHandler) => void;
}

/**
 * Defines single axis used in experiment run charts
 */
export interface RunsChartAxisDef {
  key: string;
  type: 'METRIC' | 'PARAM';
  dataAccessKey?: string;
  datasetName?: string;
}

export interface RunsChartsRunData {
  /**
   * UUID of a chart data trace
   */
  uuid: string;
  /**
   * Run or group name displayed in the legend and hover box
   */
  displayName: string;
  /**
   * Run's RunInfo object containing the metadata.
   * Unset for run groups.
   */
  runInfo?: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  /**
   * Run's parent group info. Set only for run groups.
   */
  groupParentInfo?: RunGroupParentInfo;
  /**
   * Set to "false" if run grouping is enabled, but run is not a part of any group.
   * Undefined if run grouping is disabled.
   */
  belongsToGroup?: boolean;
  /**
   * Object containing latest run's metrics by key
   */
  metrics: MetricEntitiesByName;
  /**
   * Dictionary with the metrics by name. This field
   * - is optional as it's used only by certain chart types
   * - might be initially empty since it's populated lazily
   */
  metricsHistory?: MetricHistoryByName;
  /**
   * Set for run groups, contains aggregated metrics history for each run group.
   * It's keyed by a metric name, then by an aggregate function (min, max, average).
   */
  aggregatedMetricsHistory?: Record<string, Record<RunGroupingAggregateFunction, MetricEntity[]>>;
  /**
   * Object containing run's params by key
   */
  params: Record<string, { key: string; value: string | number }>;
  /**
   * Object containing run's tags by key
   */
  tags: Record<string, KeyValueEntity>;
  /**
   * Object containing run's images by key. The first key is the imageKey,
   * the second key is the filename without extension for metadata file and image.
   * E.g. if metadata file is dog_step_1_WHDA.json and image file is
   * dog_step_1_WHDA.png, then truncated name is dog_step_1_WHDA.
   */
  images: Record<string, Record<string, ImageEntity>>;
  /**
   * Color corresponding to the run
   */
  color?: string;
  /**
   * Set to "true" if the run is pinned
   */
  pinned?: boolean;
  /**
   * Set to "true" if the run is pinnable (e.g. not a child run)
   */
  pinnable?: boolean;
  /**
   * Is the row hidden by user
   */
  hidden?: boolean;
}

/**
 * By default, Plotly.js is capable of autosizing only on resizing window with
 * no option to observe other constraints (e.g. container resize). This hooks
 * attaches a resize observer to the chart wrapper and dynamically returns its dimensions
 * so it can be passed to the chart's layout in order to correctly maintain responsive size.
 */
export const useDynamicPlotSize = (throttleMs = 100) => {
  const [layoutWidth, setLayoutWidth] = useState<undefined | number>(undefined);
  const [layoutHeight, setLayoutHeight] = useState<undefined | number>(undefined);

  const isDynamicSizeSupported = Boolean(window.ResizeObserver);

  const setDimensions = useCallback((width: number, height: number) => {
    setLayoutWidth(width);
    setLayoutHeight(height);
  }, []);

  const setDimensionsThrottled = useMemo(
    () =>
      throttle(setDimensions, throttleMs, {
        leading: true,
      }),
    [setDimensions, throttleMs],
  );

  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let unmounted = false;
    if (!containerDiv || !window.ResizeObserver) {
      return undefined;
    }
    const observer = new ResizeObserver(([observerEntry]) => {
      if (unmounted) {
        return;
      }

      setDimensionsThrottled(Math.round(observerEntry.contentRect.width), Math.round(observerEntry.contentRect.height));
    });

    observer.observe(containerDiv);
    return () => {
      unmounted = true;
      observer.disconnect();
    };
  }, [containerDiv, setDimensionsThrottled]);

  return { containerDiv, setContainerDiv, layoutWidth, layoutHeight, isDynamicSizeSupported };
};

export type UseMemoizedChartLayoutParams<T = any> = Pick<RunsPlotsCommonProps, 'margin'> & {
  resetViewOn: T[];
  xAxisKey: string;
  yAxisKey: string;
  layoutWidth?: number;
  layoutHeight?: number;
  additionalXAxisParams?: Partial<Layout['xaxis']>;
  additionalYAxisParams?: Partial<Layout['yaxis']>;
};

/**
 * Styles used in all metric/param experiment run charts
 */
export const commonRunsChartStyles = {
  // Styles used for highlighting traces in both scatter and contour chart types
  scatterChartHighlightStyles: {
    '.trace.scatter path.point': {
      transition: 'var(--trace-transition)',
    },
    '.trace.scatter.is-highlight path.point': {
      opacity: 'var(--trace-opacity-dimmed-low) !important',
    },
    '.trace.scatter path.point.is-hover-highlight': {
      opacity: 'var(--trace-opacity-highlighted) !important',
    },
    '.trace.scatter path.point.is-selection-highlight': {
      opacity: 'var(--trace-opacity-highlighted) !important',
      stroke: 'var(--trace-stroke-color)',
      strokeWidth: 'var(--trace-stroke-width) !important',
    },
  },
  chartWrapper: (theme: Theme) => ({
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative' as const,
    fontSize: 0,
    lineHeight: 0,
    '.js-plotly-plot .plotly .cursor-ew-resize, .js-plotly-plot .plotly .cursor-crosshair': {
      cursor: 'pointer',
    },
    // Add a little stroke to the Y axis text so if despite the margin
    // tick texts would overlay the axis label, it would still look decent
    '.js-plotly-plot g.infolayer > g.g-ytitle > text': {
      stroke: theme.colors.backgroundPrimary,
      strokeWidth: 16,
      paintOrder: 'stroke',
    },
    // Variable used by chart trace highlighting
    '--trace-transition': 'opacity .16s',
    '--trace-opacity-highlighted': '1',
    '--trace-opacity-dimmed': '0',
    '--trace-opacity-dimmed-low': '0.45',
    '--trace-opacity-dimmed-high': '0.55',
    '--trace-stroke-color': 'black',
    '--trace-stroke-width': '1',
  }),
  chart: (theme: Theme) => ({
    width: '100%',
    height: '100%',
    '.modebar-container svg': {
      fill: theme.colors.textPrimary,
    },
  }),
};

/**
 * Default margin for all experiment run charts but contour
 */
export const runsChartDefaultMargin: Partial<Margin> = {
  t: 0,
  b: 48,
  r: 0,
  l: 48,
  pad: 0,
};

/**
 * Default margin for contour experiment run charts
 */
export const runsChartDefaultContourMargin: Partial<Margin> = {
  t: 0,
  b: 48,
  r: 0,
  l: 80,
  pad: 0,
};

/**
 * Default hover label style for all experiment run charts
 */
export const runsChartHoverlabel = {
  bgcolor: 'white',
  bordercolor: '#ccc',
  font: {
    color: 'black',
  },
};

/**
 * Function that makes sure that extreme values e.g. infinities masked as 1.79E+308
 * are normalized to be displayed properly in charts.
 */
export const normalizeChartValue = (value?: number) => {
  const parsedValue = typeof value === 'string' ? parseFloat(value) : value;

  // Return all falsy values as-is
  if (!parsedValue) {
    return parsedValue;
  }
  if (!Number.isFinite(parsedValue) || Number.isNaN(parsedValue)) {
    return undefined;
  }
  if (Math.abs(parsedValue) === Number.MAX_VALUE) {
    return Number.POSITIVE_INFINITY * Math.sign(parsedValue);
  }

  return value;
};

export const createThemedPlotlyLayout = (theme: Theme): Partial<Layout> => ({
  font: {
    color: theme.colors.textPrimary,
  },
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',

  yaxis: {
    gridcolor: theme.colors.borderDecorative,
  },
  xaxis: {
    gridcolor: theme.colors.borderDecorative,
  },
});

/**
 * Creates a key for sampled chart data range, e.g. [-4,4] becomes "-4,4".
 * "DEFAULT" is used for automatic chart range.
 */
export const createChartAxisRangeKey = (range?: [number | string, number | string]) =>
  range ? range.join(',') : 'DEFAULT';

export const getLegendDataFromRuns = (
  runsData: Pick<RunsChartsRunData, 'displayName' | 'color' | 'uuid'>[],
): LegendLabelData[] =>
  runsData.map(
    (run): LegendLabelData => ({
      label: run.displayName,
      uuid: run.uuid,
      color: run.color ?? '',
    }),
  );

export const getLineChartLegendData = (
  runsData: Pick<RunsChartsRunData, 'runInfo' | 'color' | 'metricsHistory' | 'displayName' | 'uuid'>[],
  selectedMetricKeys: string[] | undefined,
  metricKey: string,
  yAxisKey: RunsChartsLineChartYAxisType,
  yAxisExpressions: RunsChartsLineChartExpression[],
): LegendLabelData[] =>
  runsData.flatMap((runEntry): LegendLabelData[] => {
    if (!runEntry.metricsHistory) {
      return [];
    }

    if (shouldEnableChartExpressions() && yAxisKey === RunsChartsLineChartYAxisType.EXPRESSION) {
      return yAxisExpressions.map((expression, idx) => ({
        label: `${runEntry.displayName} (${expression.expression})`,
        color: runEntry.color ?? '',
        dashStyle: lineDashStyles[idx % lineDashStyles.length],
        metricKey: expression.expression,
        uuid: runEntry.uuid,
      }));
    }

    const metricKeys = selectedMetricKeys ?? [metricKey];
    return metricKeys.map((metricKey, idx) => ({
      label: `${runEntry.displayName} (${metricKey})`,
      color: runEntry.color ?? '',
      dashStyle: lineDashStyles[idx % lineDashStyles.length],
      metricKey,
      uuid: runEntry.uuid,
    }));
  });

/**
 * Returns true if the sorted array contains duplicate values.
 * Uses simple O(n) algorithm and for loop to avoid creating a set.
 */
export const containsDuplicateXValues = (xValues: (number | undefined)[]) => {
  for (let i = 1; i < xValues.length; i++) {
    if (xValues[i] === xValues[i - 1]) {
      return true;
    }
  }
  return false;
};

export const lineDashStyles: Dash[] = ['solid', 'dash', 'dot', 'longdash', 'dashdot', 'longdashdot'];

/**
 * Calculates a semi-translucent hex color value based on the provided hex color and alpha value.
 */
export const createFadedTraceColor = (hexColor?: string, alpha = 0.1) => {
  if (!hexColor) {
    return hexColor;
  }
  const fadedColor = Math.round(Math.min(Math.max(alpha || 1, 0), 1) * 255);
  return hexColor + fadedColor.toString(16).toUpperCase();
};

/**
 * Enum for X axis types for line charts. Defined here to
 * avoid circular imports from runs-charts.types.ts
 */
export enum RunsChartsLineChartXAxisType {
  STEP = 'step',
  TIME = 'time',
  TIME_RELATIVE = 'time-relative',
  TIME_RELATIVE_HOURS = 'time-relative-hours',
  METRIC = 'metric',
}

const axisKeyToLabel = defineMessages<Exclude<RunsChartsLineChartXAxisType, RunsChartsLineChartXAxisType.METRIC>>({
  [RunsChartsLineChartXAxisType.TIME]: {
    defaultMessage: 'Time',
    description: 'Label for the time axis on the runs compare chart',
  },
  [RunsChartsLineChartXAxisType.TIME_RELATIVE]: {
    defaultMessage: 'Relative Time',
    description: 'Label for the relative axis on the runs compare chart',
  },
  [RunsChartsLineChartXAxisType.TIME_RELATIVE_HOURS]: {
    defaultMessage: 'Relative Time (hours)',
    description: 'Label for the relative axis on the runs compare chart in hours',
  },
  [RunsChartsLineChartXAxisType.STEP]: {
    defaultMessage: 'Step',
    description: 'Label for the step axis on the runs compare chart',
  },
});

export const getChartAxisLabelDescriptor = (
  axisKey: Exclude<RunsChartsLineChartXAxisType, RunsChartsLineChartXAxisType.METRIC>,
) => {
  return axisKeyToLabel[axisKey];
};

export const removeOutliersFromMetricHistory = (metricHistory: MetricEntity[]): MetricEntity[] => {
  const values = metricHistory.map((metric) => metric.value);
  const lowerBound = quantile(values, 0.05) ?? -Infinity;
  const upperBound = quantile(values, 0.95) ?? Infinity;
  return metricHistory.filter((metric) => metric.value >= lowerBound && metric.value <= upperBound);
};

const isContourChartCard = (card: RunsChartsCardConfig): card is RunsChartsContourCardConfig =>
  card.type === RunsChartType.CONTOUR;
const isBarChartCard = (card: RunsChartsCardConfig): card is RunsChartsBarCardConfig => card.type === RunsChartType.BAR;
const isScatterChartCard = (card: RunsChartsCardConfig): card is RunsChartsScatterCardConfig =>
  card.type === RunsChartType.SCATTER;
const isDifferenceChartCard = (card: RunsChartsCardConfig): card is RunsChartsDifferenceCardConfig =>
  card.type === RunsChartType.DIFFERENCE;
const isLineChartCard = (card: RunsChartsCardConfig): card is RunsChartsLineCardConfig =>
  card.type === RunsChartType.LINE;
const isParallelChartCard = (card: RunsChartsCardConfig): card is RunsChartsParallelCardConfig =>
  card.type === RunsChartType.PARALLEL;

export const isEmptyChartCard = (chartRunData: RunsChartsRunData[], chartCardConfig: RunsChartsCardConfig) => {
  const visibleChartRunData = chartRunData.filter((trace) => !trace.hidden);

  if (isContourChartCard(chartCardConfig)) {
    const metricKeys = [chartCardConfig.xaxis.key, chartCardConfig.yaxis.key, chartCardConfig.zaxis.key];
    const metricsInRuns = visibleChartRunData.flatMap(({ metrics }) => Object.keys(metrics));
    return intersection(metricKeys, uniq(metricsInRuns)).length === 0;
  }

  if (isBarChartCard(chartCardConfig)) {
    const metricsInRuns = visibleChartRunData.flatMap(({ metrics }) => Object.keys(metrics));
    return !metricsInRuns.includes(chartCardConfig.metricKey);
  }

  if (isScatterChartCard(chartCardConfig)) {
    const metricKeys = [
      chartCardConfig.xaxis.dataAccessKey ?? chartCardConfig.xaxis.key,
      chartCardConfig.yaxis.dataAccessKey ?? chartCardConfig.yaxis.key,
    ];
    const metricsInRuns = visibleChartRunData.flatMap(({ metrics }) => Object.keys(metrics));
    return intersection(metricKeys, uniq(metricsInRuns)).length === 0;
  }

  if (isDifferenceChartCard(chartCardConfig)) {
    return chartCardConfig.compareGroups?.length === 0;
  }

  if (isLineChartCard(chartCardConfig)) {
    const metricKeys = chartCardConfig.selectedMetricKeys ?? [chartCardConfig.metricKey];
    const metricsInRuns = visibleChartRunData.flatMap(({ metrics }) => Object.keys(metrics));
    return intersection(metricKeys, uniq(metricsInRuns)).length === 0;
  }

  if (isParallelChartCard(chartCardConfig)) {
    const isConfigured = isParallelChartConfigured(chartCardConfig);

    const relevantChartRunData = chartCardConfig?.showAllRuns ? chartRunData : visibleChartRunData;

    const data = isConfigured
      ? processParallelCoordinateData(
          relevantChartRunData,
          chartCardConfig.selectedParams,
          chartCardConfig.selectedMetrics,
        )
      : [];
    return data.length === 0;
  }

  return false;
};
```

--------------------------------------------------------------------------------

---[FILE: RunsCharts.stories-common.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsCharts.stories-common.tsx
Signals: React

```typescript
import { Dash } from 'plotly.js';
import { useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';

/**
 * Creates a stable (seeded) function that returns
 * gaussian-distributed randomized values
 */
export const stableNormalRandom = (seed = 0, g = 10) => {
  const random = () => {
    // eslint-disable-next-line no-param-reassign
    seed += 0x6d2b79f5;
    let t = seed;
    // eslint-disable-next-line no-bitwise
    t = Math.imul(t ^ (t >>> 15), t | 1);
    // eslint-disable-next-line no-bitwise
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    // eslint-disable-next-line no-bitwise
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return () => {
    let sum = 0;

    for (let i = 0; i < g; i += 1) {
      sum += random();
    }

    return sum / g;
  };
};

// An array of sample colors
// prettier-ignore
export const chartColors = ["#CE4661", "#3183AF", "#B65F95", "#FACE76", "#A96F2F", "#458C32", "#697A88", "#76AFCD", "#8F6DBF", "#C84856"];

// Arrays of sample adjectives and animal names
// prettier-ignore
const adjectives = ["ablaze","abrupt","accomplished","active","adored","adulated","adventurous","affectionate","amused","amusing","animal-like","antique","appreciated","archaic","ardent","arrogant","astonished","audacious","authoritative","awestruck","beaming","bewildered","bewitching","blissful","boisterous","booming","bouncy","breathtaking","bright","brilliant","bubbling","calm","calming","capricious","celestial","charming","cheerful","cherished","chiaroscuro","chilled","comical","commanding","companionable","confident","contentment","courage","crazy","creepy","dancing","dazzling","delicate","delightful","demented","desirable","determined","devoted","dominant","dramatic","drawn out","dripping","dumbstruck","ebullient","elated","expectant","expressive","exuberant","faint","fantastical","favorable","febrile","feral","feverish","fiery","floating","flying","folksy","fond","forgiven","forgiving","freakin' awesome","frenetic","frenzied","friendly. amorous","from a distance","frosted","funny","furry","galloping","gaping","gentle","giddy","glacial","gladness","gleaming","gleeful","gorgeous","imperious","impudent","in charge","inflated","innocent","inspired","intimate","intrepid","jagged","joking","joyful","jubilant","kindly","languid","larger than life","laughable","lickety-split","lighthearted","limping","linear","lively","lofty","love of","lovely","lulling","luminescent","lush","luxurious","magical","maniacal","manliness","march-like","masterful","merciful","merry","mischievous","misty","modest","moonlit","mysterious","mystical","mythological","nebulous","nostalgic","on fire","overstated","paganish","partying","perfunctory","perky","perplexed","persevering","pious","playful","pleasurable","poignant","portentous","posh","powerful","pretty","prickly","prideful","princesslike","proud","puzzled","queenly","questing","quiet","racy","ragged","regal","rejoicing","relaxed","reminiscent","repentant","reserved","resolute","ridiculous","ritualistic","robust","running","sarcastic","scampering","scoffing","scurrying","sensitive","serene","shaking","shining","silky","silly","simple","successful","summery","surprised","sympathetic","tapping","virile","walking","wild","witty","wondering","zealous","zestful"];
// prettier-ignore
const animalNames = ["aardvark","albatross","alligator","alpaca","ant","anteater","antelope","ape","armadillo","donkey","baboon","badger","barracuda","bat","bear","beaver","bee","bison","boar","buffalo","butterfly","camel","capybara","caribou","cassowary","cat","caterpillar","cattle","chamois","cheetah","chicken","chimpanzee","chinchilla","chough","clam","cobra","cockroach","cod","cormorant","coyote","crab","crane","crocodile","crow","curlew","deer","dinosaur","dog","dogfish","dolphin","dotterel","dove","dragonfly","duck","dugong","dunlin","eagle","echidna","eel","eland","elephant","elk","emu","falcon","ferret","finch","fish","flamingo","fly","fox","frog","gaur","gazelle","gerbil","giraffe","gnat","gnu","goat","goldfinch","goldfish","goose","gorilla","goshawk","grasshopper","grouse","guanaco","gull","hamster","hare","hawk","hedgehog","heron","herring","hippopotamus","hornet","horse","human","hummingbird","hyena","ibex","ibis","jackal","jaguar","jay","jellyfish","kangaroo","kingfisher","koala","kookabura","kouprey","kudu","lapwing","lark","lemur","leopard","lion","llama","lobster","locust","loris","louse","lyrebird","magpie","mallard","manatee","mandrill","mantis","marten","meerkat","mink","mole","mongoose","monkey","moose","mosquito","mouse","mule","narwhal","newt","nightingale","octopus","okapi","opossum","oryx","ostrich","otter","owl","oyster","panther","parrot","partridge","peafowl","pelican","penguin","pheasant","pig","pigeon","pony","porcupine","porpoise","quail","quelea","quetzal","rabbit","raccoon","rail","ram","rat","raven","red deer","red panda","reindeer","rhinoceros","rook","salamander","salmon","sand dollar","sandpiper","sardine","scorpion","seahorse","seal","shark","sheep","shrew","skunk","snail","snake","sparrow","spider","spoonbill","squid","squirrel","starling","stingray","stinkbug","stork","swallow","swan","tapir","tarsier","termite","tiger","toad","trout","turkey","turtle","viper","vulture","wallaby","walrus","wasp","weasel","whale","wildcat","wolf","wolverine","wombat","woodcock","woodpecker","worm","wren","yak","zebra"];

export const getRandomRunName = (randomFn = Math.random) =>
  `${adjectives[Math.floor(randomFn() * adjectives.length)]}-${
    animalNames[Math.floor(randomFn() * animalNames.length)]
  }-${Math.floor(randomFn() * 1000)}`;

export const ChartStoryWrapper = ({ children, controls }: React.PropsWithChildren<any>) => (
  <IntlProvider locale="en">
    <div
      css={{
        width: '100vw',
        height: '100vh',
        padding: 20,
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <div
        css={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          marginBottom: 16,
          backgroundColor: '#eee',
          padding: 8,
        }}
      >
        {controls || null}
      </div>
      {children}
    </div>
  </IntlProvider>
);

export const useControls = (zAxisVisible = false) => {
  const [xKey, setXKey] = useState('metric1');
  const [yKey, setYKey] = useState('param2');
  const [zKey, setZKey] = useState('param3');

  const axisProps = useMemo(
    () => ({
      xAxis: {
        key: xKey,
        type: xKey.includes('metric') ? ('METRIC' as const) : ('PARAM' as const),
      },
      yAxis: {
        key: yKey,
        type: yKey.includes('metric') ? ('METRIC' as const) : ('PARAM' as const),
      },
      zAxis: {
        key: zKey,
        type: zKey.includes('metric') ? ('METRIC' as const) : ('PARAM' as const),
      },
    }),
    [xKey, yKey, zKey],
  );

  const getOptions = () => (
    <>
      <option>metric1</option>
      <option>metric2</option>
      <option>metric3</option>
      <option>param1</option>
      <option>param2</option>
      <option>param3</option>
    </>
  );

  const controls = (
    <>
      X axis:{' '}
      <select value={xKey} onChange={({ target }) => setXKey(target.value)}>
        {getOptions()}
      </select>{' '}
      Y axis:{' '}
      <select value={yKey} onChange={({ target }) => setYKey(target.value)}>
        {getOptions()}
      </select>{' '}
      {zAxisVisible ? (
        <>
          Z axis:{' '}
          <select value={zKey} onChange={({ target }) => setZKey(target.value)}>
            {getOptions()}
          </select>
        </>
      ) : null}
    </>
  );

  return {
    axisProps,
    controls,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsAddChartMenu.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsAddChartMenu.tsx

```typescript
import { Button, DropdownMenu, PlusIcon } from '@databricks/design-system';
import type { Theme } from '@emotion/react';

import { ReactComponent as ChartBarIcon } from '../../../../common/static/chart-bar.svg';
import { ReactComponent as ChartContourIcon } from '../../../../common/static/chart-contour.svg';
import { ReactComponent as ChartLineIcon } from '../../../../common/static/chart-line.svg';
import { ReactComponent as ChartParallelIcon } from '../../../../common/static/chart-parallel.svg';
import { ReactComponent as ChartScatterIcon } from '../../../../common/static/chart-scatter.svg';
import { ReactComponent as ChartDifferenceIcon } from '../../../../common/static/chart-difference.svg';
import { ReactComponent as ChartImageIcon } from '../../../../common/static/chart-image.svg';
import { RunsChartType } from '../runs-charts.types';
import { FormattedMessage } from 'react-intl';

export interface RunsChartsAddChartMenuProps {
  onAddChart: (type: RunsChartType) => void;
  supportedChartTypes?: RunsChartType[];
}

export const RunsChartsAddChartMenu = ({ onAddChart, supportedChartTypes }: RunsChartsAddChartMenuProps) => {
  const isChartTypeSupported = (type: RunsChartType) => !supportedChartTypes || supportedChartTypes.includes(type);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_runscompareaddchartmenu.tsx_19"
          css={styles.addChartButton}
          icon={<PlusIcon />}
          data-testid="experiment-view-compare-runs-add-chart"
        >
          <FormattedMessage
            defaultMessage="Add chart"
            description="Experiment tracking > runs charts > add chart menu"
          />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {isChartTypeSupported(RunsChartType.BAR) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_42"
            onClick={() => onAddChart(RunsChartType.BAR)}
            data-testid="experiment-view-compare-runs-chart-type-bar"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartBarIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Bar chart"
              description="Experiment tracking > runs charts > add chart menu > bar chart"
            />
          </DropdownMenu.Item>
        )}
        {isChartTypeSupported(RunsChartType.LINE) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_56"
            onClick={() => onAddChart(RunsChartType.LINE)}
            data-testid="experiment-view-compare-runs-chart-type-line"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartLineIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Line chart"
              description="Experiment tracking > runs charts > add chart menu > line chart"
            />
          </DropdownMenu.Item>
        )}
        {isChartTypeSupported(RunsChartType.PARALLEL) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_70"
            onClick={() => onAddChart(RunsChartType.PARALLEL)}
            data-testid="experiment-view-compare-runs-chart-type-parallel"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartParallelIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Parallel coordinates"
              description="Experiment tracking > runs charts > add chart menu > parallel coordinates"
            />
          </DropdownMenu.Item>
        )}
        {isChartTypeSupported(RunsChartType.SCATTER) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_84"
            onClick={() => onAddChart(RunsChartType.SCATTER)}
            data-testid="experiment-view-compare-runs-chart-type-scatter"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartScatterIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Scatter chart"
              description="Experiment tracking > runs charts > add chart menu > scatter plot"
            />
          </DropdownMenu.Item>
        )}
        {isChartTypeSupported(RunsChartType.CONTOUR) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_98"
            onClick={() => onAddChart(RunsChartType.CONTOUR)}
            data-testid="experiment-view-compare-runs-chart-type-contour"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartContourIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Contour chart"
              description="Experiment tracking > runs charts > add chart menu > contour chart"
            />
          </DropdownMenu.Item>
        )}
        {isChartTypeSupported(RunsChartType.DIFFERENCE) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_112"
            onClick={() => onAddChart(RunsChartType.DIFFERENCE)}
            data-testid="experiment-view-compare-runs-chart-type-difference"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartDifferenceIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Difference view"
              description="Experiment tracking > runs charts > add chart menu > difference view"
            />
          </DropdownMenu.Item>
        )}
        {isChartTypeSupported(RunsChartType.IMAGE) && (
          <DropdownMenu.Item
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsaddchartmenu.tsx_126"
            onClick={() => onAddChart(RunsChartType.IMAGE)}
            data-testid="experiment-view-compare-runs-chart-type-image"
          >
            <DropdownMenu.IconWrapper css={styles.iconWrapper}>
              <ChartImageIcon />
            </DropdownMenu.IconWrapper>
            <FormattedMessage
              defaultMessage="Image grid"
              description="Experiment tracking > runs charts > add chart menu > image grid"
            />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const styles = {
  addChartButton: (theme: Theme) => ({
    // Overriden while waiting for design decision in DuBois (FEINF-1711)
    backgroundColor: `${theme.colors.backgroundPrimary} !important`,
  }),
  iconWrapper: (theme: Theme) => ({
    width: theme.general.iconSize + theme.spacing.xs,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsConfigureModal.test.tsx

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { RunsChartsConfigureModal } from './RunsChartsConfigureModal';
import type { RunsChartsLineCardConfig } from '../runs-charts.types';
import { RunsChartType } from '../runs-charts.types';
import { IntlProvider } from 'react-intl';
import { MockedReduxStoreProvider } from '../../../../common/utils/TestUtils';
import { RunsMetricsLinePlot } from './RunsMetricsLinePlot';
import { last } from 'lodash';
import userEvent from '@testing-library/user-event';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';
import { DesignSystemProvider } from '@databricks/design-system';
import { TestApolloProvider } from '../../../../common/utils/TestApolloProvider';

// Larger timeout for integration testing (form rendering)
// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(15000);

// Mock <RunsMetricsLinePlot> component, it's exact implementation is not important for this test
jest.mock('./RunsMetricsLinePlot', () => ({
  RunsMetricsLinePlot: jest.fn(() => <div>RunsMetricsLinePlot</div>),
}));

const sampleChartData = [
  {
    displayName: 'test-run',
    images: {},
    metrics: {},
    params: {},
    tags: {},
    uuid: 'test-run-uuid',
  },
];

const sampleLineChartConfig: RunsChartsLineCardConfig = {
  uuid: 'some-uuid',
  type: RunsChartType.LINE,
  deleted: false,
  isGenerated: false,
  selectedMetricKeys: ['metric-a'],
  lineSmoothness: 0,
  metricKey: 'metric-a',
  scaleType: 'linear',
  xAxisScaleType: 'linear',
  selectedXAxisMetricKey: '',
  xAxisKey: RunsChartsLineChartXAxisType.STEP,
};

describe('RunsChartsConfigureModal', () => {
  const renderTestComponent = (onSubmit?: () => void) => {
    render(
      <RunsChartsConfigureModal
        config={sampleLineChartConfig}
        chartRunData={sampleChartData}
        groupBy={null}
        metricKeyList={[]}
        onCancel={() => {}}
        onSubmit={onSubmit ?? (() => {})}
        paramKeyList={[]}
      />,
      {
        wrapper: ({ children }) => (
          <DesignSystemProvider>
            <TestApolloProvider>
              <MockedReduxStoreProvider
                state={{
                  entities: {
                    metricsByRunUuid: {},
                  },
                }}
              >
                <IntlProvider locale="en">{children}</IntlProvider>
              </MockedReduxStoreProvider>
            </TestApolloProvider>
          </DesignSystemProvider>
        ),
      },
    );
  };

  const getLastPropsForRunsMetricsLinePlot = () => last(jest.mocked(RunsMetricsLinePlot).mock.calls)?.[0];

  test('it should render line plot configuration form and preview with the correct props', async () => {
    const onSubmit = jest.fn();
    renderTestComponent(onSubmit);

    await waitFor(() => {
      expect(screen.getByText('Edit chart')).toBeInTheDocument();
    });

    expect(getLastPropsForRunsMetricsLinePlot()).toEqual(
      expect.objectContaining({
        displayPoints: undefined,
      }),
    );

    expect(screen.getByLabelText('Display points: Auto')).toBeChecked();

    await userEvent.click(screen.getByLabelText('Display points: On'));

    expect(getLastPropsForRunsMetricsLinePlot()).toEqual(
      expect.objectContaining({
        displayPoints: true,
      }),
    );

    await userEvent.click(screen.getByLabelText('Display points: Off'));

    expect(getLastPropsForRunsMetricsLinePlot()).toEqual(
      expect.objectContaining({
        displayPoints: false,
      }),
    );

    await userEvent.click(screen.getByLabelText('Display points: Auto'));

    expect(getLastPropsForRunsMetricsLinePlot()).toEqual(
      expect.objectContaining({
        displayPoints: undefined,
      }),
    );

    await userEvent.click(screen.getByLabelText('Display points: On'));
    await userEvent.click(screen.getByText('Save changes'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        displayPoints: true,
      }),
    );
  });
});
```

--------------------------------------------------------------------------------

````

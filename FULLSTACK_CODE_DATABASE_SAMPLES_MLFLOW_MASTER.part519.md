---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 519
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 519 of 991)

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

---[FILE: RunsChartsNoDataFoundIndicator.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsNoDataFoundIndicator.tsx
Signals: React

```typescript
import { Empty, NoIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useUpdateExperimentViewUIState } from '../../experiment-page/contexts/ExperimentPageUIStateContext';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

export const RunsChartsNoDataFoundIndicator = () => {
  const updateUIState = useUpdateExperimentViewUIState();
  const { theme } = useDesignSystemTheme();

  const hideEmptyCharts = useCallback(() => {
    updateUIState((state) => ({ ...state, hideEmptyCharts: true }));
  }, [updateUIState]);

  return (
    <div
      css={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.lg,
      }}
    >
      <Empty
        description={
          <FormattedMessage
            defaultMessage="No chart data available for the currently visible runs. Select other runs or <link>hide empty charts.</link>"
            description="Experiment tracking > runs charts > indication displayed when no corresponding data is found to be used in chart-based run comparison"
            values={{
              link: (chunks) => (
                <Typography.Link
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsnodatafoundindicator.tsx_31"
                  onClick={hideEmptyCharts}
                >
                  {chunks}
                </Typography.Link>
              ),
            }}
          />
        }
        image={<NoIcon />}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsTooltipBody.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsTooltipBody.tsx

```typescript
import { isNil } from 'lodash';
import {
  Button,
  CloseIcon,
  PinIcon,
  PinFillIcon,
  LegacyTooltip,
  VisibleIcon,
  Typography,
  Tooltip,
} from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { useExperimentIds } from '../../experiment-page/hooks/useExperimentIds';
import type { RunsChartsRunData } from './RunsCharts.common';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';
import type { RunsChartsTooltipBodyProps } from '../hooks/useRunsChartsTooltip';
import { RunsChartsTooltipMode, containsMultipleRunsTooltipData } from '../hooks/useRunsChartsTooltip';
import type {
  RunsChartsBarCardConfig,
  RunsChartsCardConfig,
  RunsChartsScatterCardConfig,
  RunsChartsContourCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsParallelCardConfig,
} from '../runs-charts.types';
import { RunsChartType } from '../runs-charts.types';
import {
  type RunsCompareMultipleTracesTooltipData,
  type RunsMetricsSingleTraceTooltipData,
} from './RunsMetricsLinePlot';
import { RunsMultipleTracesTooltipBody } from './RunsMultipleTracesTooltipBody';
import { shouldEnableRelativeTimeDateAxis } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import { customMetricBehaviorDefs } from '../../experiment-page/utils/customMetricBehaviorUtils';

interface RunsChartsContextMenuContentDataType {
  runs: RunsChartsRunData[];
  onTogglePin?: (runUuid: string) => void;
  onHideRun?: (runUuid: string) => void;
  getDataTraceLink?: (experimentId: string, traceUuid: string) => string;
}

type RunsChartContextMenuHoverDataType = RunsChartsCardConfig;

const createBarChartValuesBox = (cardConfig: RunsChartsBarCardConfig, activeRun: RunsChartsRunData) => {
  const { metricKey, dataAccessKey } = cardConfig;

  const dataKey = dataAccessKey ?? metricKey;

  const metric = activeRun?.metrics[dataKey];

  if (!metric) {
    return null;
  }

  const customMetricBehaviorDef = customMetricBehaviorDefs[metric.key];
  const displayName = customMetricBehaviorDef?.displayName ?? metric.key;
  const displayValue = customMetricBehaviorDef?.valueFormatter({ value: metric.value }) ?? metric.value;

  return (
    <div css={styles.value}>
      <strong>{displayName}:</strong> {displayValue}
    </div>
  );
};

const createScatterChartValuesBox = (cardConfig: RunsChartsScatterCardConfig, activeRun: RunsChartsRunData) => {
  const { xaxis, yaxis } = cardConfig;
  const xKey = xaxis.dataAccessKey ?? xaxis.key;
  const yKey = xaxis.dataAccessKey ?? yaxis.key;

  const xLabel = xaxis.key;
  const yLabel = yaxis.key;

  const xValue = xaxis.type === 'METRIC' ? activeRun.metrics[xKey]?.value : activeRun.params[xKey]?.value;

  const yValue = yaxis.type === 'METRIC' ? activeRun.metrics[yKey]?.value : activeRun.params[yKey]?.value;

  return (
    <>
      {xValue && (
        <div css={styles.value}>
          <strong>X ({xLabel}):</strong> {xValue}
        </div>
      )}
      {yValue && (
        <div css={styles.value}>
          <strong>Y ({yLabel}):</strong> {yValue}
        </div>
      )}
    </>
  );
};

const createContourChartValuesBox = (cardConfig: RunsChartsContourCardConfig, activeRun: RunsChartsRunData) => {
  const { xaxis, yaxis, zaxis } = cardConfig;
  const xKey = xaxis.key;
  const yKey = yaxis.key;
  const zKey = zaxis.key;

  const xValue = xaxis.type === 'METRIC' ? activeRun.metrics[xKey]?.value : activeRun.params[xKey]?.value;

  const yValue = yaxis.type === 'METRIC' ? activeRun.metrics[yKey]?.value : activeRun.params[yKey]?.value;

  const zValue = zaxis.type === 'METRIC' ? activeRun.metrics[zKey]?.value : activeRun.params[zKey]?.value;

  return (
    <>
      <div css={styles.value}>
        <strong>X ({xKey}):</strong> {xValue}
      </div>
      <div css={styles.value}>
        <strong>Y ({yKey}):</strong> {yValue}
      </div>
      <div css={styles.value}>
        <strong>Z ({zKey}):</strong> {zValue}
      </div>
    </>
  );
};

const normalizeRelativeTimeChartTooltipValue = (value: string | number) => {
  if (typeof value === 'number') {
    return value;
  }
  return value.split(' ')[1] || '00:00:00';
};

const getTooltipXValue = (
  hoverData: RunsMetricsSingleTraceTooltipData | undefined,
  xAxisKey: RunsChartsLineChartXAxisType,
) => {
  if (xAxisKey === RunsChartsLineChartXAxisType.METRIC) {
    return hoverData?.xValue ?? '';
  }

  if (shouldEnableRelativeTimeDateAxis() && xAxisKey === RunsChartsLineChartXAxisType.TIME_RELATIVE) {
    return normalizeRelativeTimeChartTooltipValue(hoverData?.xValue ?? '');
  }

  // Default return for other cases
  return hoverData?.xValue;
};

const createLineChartValuesBox = (
  cardConfig: RunsChartsLineCardConfig,
  activeRun: RunsChartsRunData,
  hoverData?: RunsMetricsSingleTraceTooltipData,
) => {
  const { metricKey: metricKeyFromConfig, xAxisKey } = cardConfig;
  const metricKey = hoverData?.metricEntity?.key || metricKeyFromConfig;

  // If there's available value from x axis (step or time), extract entry from
  // metric history instead of latest metric.
  const metricValue = hoverData?.yValue ?? activeRun?.metrics[metricKey].value;

  if (isNil(metricValue)) {
    return null;
  }

  const xValue = getTooltipXValue(hoverData, xAxisKey);
  return (
    <>
      {hoverData && (
        <div css={styles.value}>
          <strong>{hoverData.label}:</strong> {xValue}
        </div>
      )}
      <div css={styles.value}>
        <strong>{metricKey}:</strong> {metricValue}
      </div>
    </>
  );
};

const createParallelChartValuesBox = (
  cardConfig: RunsChartsParallelCardConfig,
  activeRun: RunsChartsRunData,
  isHovering?: boolean,
) => {
  const { selectedParams, selectedMetrics } = cardConfig as RunsChartsParallelCardConfig;
  const paramsList = selectedParams.map((paramKey) => {
    const param = activeRun?.params[paramKey];
    if (param) {
      return (
        <div key={paramKey}>
          <strong>{param.key}:</strong> {param.value}
        </div>
      );
    }
    return true;
  });
  const metricsList = selectedMetrics.map((metricKey) => {
    const metric = activeRun?.metrics[metricKey];
    if (metric) {
      return (
        <div key={metricKey}>
          <strong>{metric.key}:</strong> {metric.value}
        </div>
      );
    }
    return true;
  });

  // show only first 3 params and primary metric if hovering, else show all
  if (isHovering) {
    return (
      <>
        {paramsList.slice(0, 3)}
        {(paramsList.length > 3 || metricsList.length > 1) && <div>...</div>}
        {metricsList[metricsList.length - 1]}
      </>
    );
  } else {
    return (
      <>
        {paramsList}
        {metricsList}
      </>
    );
  }
};

/**
 * Internal component that displays metrics/params - its final design
 * is a subject to change
 */
const ValuesBox = ({
  activeRun,
  cardConfig,
  isHovering,
  hoverData,
}: {
  activeRun: RunsChartsRunData;
  cardConfig: RunsChartsCardConfig;
  isHovering?: boolean;
  hoverData?: RunsMetricsSingleTraceTooltipData;
}) => {
  if (cardConfig.type === RunsChartType.BAR) {
    return createBarChartValuesBox(cardConfig as RunsChartsBarCardConfig, activeRun);
  }

  if (cardConfig.type === RunsChartType.SCATTER) {
    return createScatterChartValuesBox(cardConfig as RunsChartsScatterCardConfig, activeRun);
  }

  if (cardConfig.type === RunsChartType.CONTOUR) {
    return createContourChartValuesBox(cardConfig as RunsChartsContourCardConfig, activeRun);
  }

  if (cardConfig.type === RunsChartType.LINE) {
    return createLineChartValuesBox(cardConfig as RunsChartsLineCardConfig, activeRun, hoverData);
  }

  if (cardConfig.type === RunsChartType.PARALLEL) {
    return createParallelChartValuesBox(cardConfig as RunsChartsParallelCardConfig, activeRun, isHovering);
  }

  return null;
};

export const RunsChartsTooltipBody = ({
  closeContextMenu,
  contextData,
  hoverData,
  chartData,
  runUuid,
  isHovering,
  mode,
}: RunsChartsTooltipBodyProps<
  RunsChartsContextMenuContentDataType,
  RunsChartContextMenuHoverDataType,
  RunsMetricsSingleTraceTooltipData | RunsCompareMultipleTracesTooltipData
>) => {
  const { runs, onTogglePin, onHideRun, getDataTraceLink } = contextData;
  const [experimentId] = useExperimentIds();
  const activeRun = runs?.find((run) => run.uuid === runUuid);

  if (
    containsMultipleRunsTooltipData(hoverData) &&
    mode === RunsChartsTooltipMode.MultipleTracesWithScanline &&
    isHovering
  ) {
    return <RunsMultipleTracesTooltipBody hoverData={hoverData} />;
  }

  const singleTraceHoverData = containsMultipleRunsTooltipData(hoverData) ? hoverData.hoveredDataPoint : hoverData;

  if (!activeRun) {
    return null;
  }

  const runName = activeRun.displayName || activeRun.uuid;
  const metricSuffix = singleTraceHoverData?.metricEntity ? ` (${singleTraceHoverData.metricEntity.key})` : '';

  return (
    <div>
      <div css={styles.contentWrapper}>
        <div css={styles.header}>
          <div css={styles.colorPill} style={{ backgroundColor: activeRun.color }} />
          {activeRun.groupParentInfo ? (
            <Typography.Text>{runName + metricSuffix}</Typography.Text>
          ) : (
            <Link
              to={getDataTraceLink?.(experimentId, runUuid) ?? Routes.getRunPageRoute(experimentId, runUuid)}
              target="_blank"
              css={styles.runLink}
              onClick={closeContextMenu}
            >
              {runName + metricSuffix}
            </Link>
          )}
        </div>
        {!isHovering && (
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_runscomparetooltipbody.tsx_259"
            size="small"
            onClick={closeContextMenu}
            icon={<CloseIcon />}
          />
        )}
      </div>

      <ValuesBox
        isHovering={isHovering}
        activeRun={activeRun}
        cardConfig={chartData}
        hoverData={singleTraceHoverData}
      />

      <div css={styles.actionsWrapper}>
        {activeRun.pinnable && onTogglePin && (
          <Tooltip
            componentId="mlflow.runs_chart.tooltip.pin_run"
            content={
              activeRun.pinned ? (
                <FormattedMessage
                  defaultMessage="Unpin run"
                  description="A tooltip for the pin icon button in the runs table next to the pinned run"
                />
              ) : (
                <FormattedMessage
                  defaultMessage="Click to pin the run"
                  description="A tooltip for the pin icon button in the runs chart tooltip next to the not pinned run"
                />
              )
            }
            side="bottom"
          >
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_runscomparetooltipbody.tsx_282"
              size="small"
              onClick={() => {
                onTogglePin(runUuid);
                closeContextMenu();
              }}
              icon={activeRun.pinned ? <PinFillIcon /> : <PinIcon />}
            />
          </Tooltip>
        )}
        {onHideRun && (
          <Tooltip
            componentId="mlflow.runs_chart.tooltip.hide_run"
            content={
              <FormattedMessage
                defaultMessage="Click to hide the run"
                description='A tooltip for the "hide" icon button in the runs chart tooltip'
              />
            }
            side="bottom"
          >
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_runscomparetooltipbody.tsx_302"
              data-testid="experiment-view-compare-runs-tooltip-visibility-button"
              size="small"
              onClick={() => {
                onHideRun(runUuid);
                closeContextMenu();
              }}
              icon={<VisibleIcon />}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const styles = {
  runLink: (theme: Theme) => ({
    color: theme.colors.primary,
    '&:hover': {},
  }),
  actionsWrapper: {
    marginTop: 8,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  value: {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  contentWrapper: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
    height: 24,
  },
  colorPill: { width: 12, height: 12, borderRadius: '100%' },
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsYAxisMetricAndExpressionSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsChartsYAxisMetricAndExpressionSelector.tsx
Signals: React

```typescript
import {
  Button,
  CloseIcon,
  Input,
  LegacySelect,
  PlusIcon,
  Radio,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type {
  RunsChartsCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsLineChartExpression,
} from '../runs-charts.types';
import { RunsChartsLineChartYAxisType } from '../runs-charts.types';
import { RunsChartsConfigureField } from './config/RunsChartsConfigure.common';
import { FormattedMessage } from 'react-intl';
import { shouldEnableChartExpressions } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import { useCallback, useEffect, useState } from 'react';
import { useChartExpressionParser } from '../hooks/useChartExpressionParser';
import { RunsChartsLineChartXAxisType } from './RunsCharts.common';

const renderMetricSelectorV1 = ({
  metricKeyList,
  metricKey,
  updateMetric,
}: {
  metricKeyList: string[];
  metricKey?: string;
  updateMetric: (metricKey: string) => void;
}) => {
  const emptyMetricsList = metricKeyList.length === 0;

  return (
    <LegacySelect
      css={{ width: '100%' }}
      value={emptyMetricsList ? 'No metrics available' : metricKey}
      onChange={updateMetric}
      disabled={emptyMetricsList}
      dangerouslySetAntdProps={{ showSearch: true }}
    >
      {metricKeyList.map((metric) => (
        <LegacySelect.Option key={metric} value={metric} data-testid={`metric-${metric}`}>
          {metric}
        </LegacySelect.Option>
      ))}
    </LegacySelect>
  );
};

const renderMetricSelectorV2 = ({
  metricKeyList,
  selectedMetricKeys,
  updateSelectedMetrics,
}: {
  metricKeyList: string[];
  selectedMetricKeys?: string[];
  updateSelectedMetrics: (metricKeys: string[]) => void;
}) => {
  const emptyMetricsList = metricKeyList.length === 0;

  return (
    <LegacySelect
      mode="multiple"
      placeholder={
        emptyMetricsList ? (
          <FormattedMessage
            defaultMessage="No metrics available"
            description="Text shown in a disabled multi-selector when there are no selectable metrics."
          />
        ) : (
          <FormattedMessage
            defaultMessage="Select metrics"
            description="Placeholder text for a metric multi-selector when configuring a line chart"
          />
        )
      }
      css={{ width: '100%' }}
      value={emptyMetricsList ? [] : selectedMetricKeys}
      onChange={updateSelectedMetrics}
      disabled={emptyMetricsList}
      dangerouslySetAntdProps={{ showSearch: true }}
    >
      {metricKeyList.map((metric) => (
        <LegacySelect.Option key={metric} value={metric} data-testid={`metric-${metric}`}>
          {metric}
        </LegacySelect.Option>
      ))}
    </LegacySelect>
  );
};

const ExpressionInput = ({
  chartExpression,
  index,
  updateYAxisExpression,
  removeYAxisExpression,
  metricKeyList,
}: {
  chartExpression: RunsChartsLineChartExpression;
  index: number;
  updateYAxisExpression: (expression: RunsChartsLineChartExpression, index: number) => void;
  removeYAxisExpression: (index: number) => void;
  metricKeyList: string[];
}) => {
  const { theme } = useDesignSystemTheme();
  const { compileExpression } = useChartExpressionParser();
  const [isValidExpression, setIsValidExpression] = useState(true);
  const validateAndUpdate = (expression: string) => {
    const compiledExpression = compileExpression(expression, metricKeyList);
    if (compiledExpression === undefined) {
      setIsValidExpression(false);
      updateYAxisExpression({ rpn: [], variables: [], expression }, index);
    } else {
      setIsValidExpression(true);
      updateYAxisExpression(compiledExpression, index);
    }
  };

  return (
    <span css={{ display: 'flex', width: '100%', gap: theme.spacing.sm }}>
      <Input
        componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsyaxismetricandexpressionselector.tsx_122"
        value={chartExpression.expression}
        onChange={(e) => validateAndUpdate(e.target.value)}
        validationState={isValidExpression ? undefined : 'error'}
      />
      <Button
        componentId="mlflow.charts.line-chart-expressions-remove"
        icon={<CloseIcon />}
        onClick={() => removeYAxisExpression(index)}
      />
    </span>
  );
};

export const RunsChartsYAxisMetricAndExpressionSelector = ({
  state,
  onStateChange,
  metricKeyList,
  updateSelectedMetrics,
}: {
  state: Partial<RunsChartsLineCardConfig>;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsLineCardConfig) => void;
  metricKeyList: string[];
  updateSelectedMetrics: (metricKeys: string[]) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const usingChartExpressions =
    shouldEnableChartExpressions() && state.xAxisKey !== RunsChartsLineChartXAxisType.METRIC;

  const DEBOUNCE_DELAY = 300; // in ms

  const [temporaryChartExpressions, setTemporaryChartExpressions] = useState<RunsChartsLineChartExpression[]>(
    state.yAxisExpressions || [],
  );

  const updateYAxisExpressionTemporary = (expression: RunsChartsLineChartExpression, index: number) => {
    setTemporaryChartExpressions((current) => {
      const newExpressions = [...current];
      newExpressions[index] = expression;
      return newExpressions;
    });
  };

  const addNewYAxisExpressionTemporary = () => {
    setTemporaryChartExpressions((current) => {
      return [...current, { rpn: [], variables: [], expression: '' } as RunsChartsLineChartExpression];
    });
  };

  const removeYAxisExpressionTemporary = (index: number) => {
    setTemporaryChartExpressions((current) => {
      const newExpressions = [...current];
      newExpressions.splice(index, 1);
      return newExpressions;
    });
  };

  useEffect(() => {
    const updateYAxisExpression = (yAxisExpressions: RunsChartsLineChartExpression[]) => {
      onStateChange((current) => {
        const config = current as RunsChartsLineCardConfig;
        return {
          ...config,
          yAxisExpressions,
        };
      });
    };
    const handler = setTimeout(() => {
      updateYAxisExpression(temporaryChartExpressions);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [temporaryChartExpressions, onStateChange]);

  const updateYAxisKey = useCallback(
    (yAxisKey: RunsChartsLineCardConfig['yAxisKey']) => {
      onStateChange((current) => {
        const config = current as RunsChartsLineCardConfig;
        return {
          ...config,
          yAxisKey,
          range: {
            ...config.range,
            yMin: undefined,
            yMax: undefined,
          },
        };
      });
    },
    [onStateChange],
  );

  return (
    <>
      {usingChartExpressions && (
        <RunsChartsConfigureField title="Metric type" compact>
          <Radio.Group
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_runschartsyaxismetricandexpressionselector.tsx_221"
            name="runs-charts-field-group-metric-type-y-axis"
            value={state.yAxisKey || RunsChartsLineChartYAxisType.METRIC}
            onChange={({ target: { value } }) => updateYAxisKey(value)}
          >
            <Radio value={RunsChartsLineChartYAxisType.METRIC} key={RunsChartsLineChartYAxisType.METRIC}>
              <FormattedMessage
                defaultMessage="Logged metrics"
                description="Experiment tracking > runs charts > line chart configuration > logged metrics label"
              />
            </Radio>
            <Radio value={RunsChartsLineChartYAxisType.EXPRESSION} key={RunsChartsLineChartYAxisType.EXPRESSION}>
              <FormattedMessage
                defaultMessage="Custom expression"
                description="Experiment tracking > runs charts > line chart configuration > custom expression label"
              />
            </Radio>
          </Radio.Group>
        </RunsChartsConfigureField>
      )}
      {usingChartExpressions && state.yAxisKey === RunsChartsLineChartYAxisType.EXPRESSION ? (
        <RunsChartsConfigureField title="Expression" compact>
          <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: theme.spacing.sm }}>
            {temporaryChartExpressions.map((chartExpression, index) => {
              return (
                <ExpressionInput
                  key={index}
                  chartExpression={chartExpression}
                  index={index}
                  updateYAxisExpression={updateYAxisExpressionTemporary}
                  removeYAxisExpression={removeYAxisExpressionTemporary}
                  metricKeyList={metricKeyList}
                />
              );
            })}
            <Button
              componentId="mlflow.charts.line-chart-expressions-add-new"
              icon={<PlusIcon />}
              onClick={addNewYAxisExpressionTemporary}
            >
              Add new
            </Button>
          </div>
        </RunsChartsConfigureField>
      ) : (
        <RunsChartsConfigureField title="Metric" compact>
          {renderMetricSelectorV2({
            metricKeyList,
            selectedMetricKeys: state.selectedMetricKeys,
            updateSelectedMetrics,
          })}
        </RunsChartsConfigureField>
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsContourPlot.stories.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsContourPlot.stories.tsx
Signals: React

```typescript
import { useCallback, useMemo, useState } from 'react';
import type { RunInfoEntity } from '../../../types';
import {
  chartColors,
  ChartStoryWrapper,
  getRandomRunName,
  stableNormalRandom,
  useControls,
} from './RunsCharts.stories-common';
import type { RunsContourPlotProps } from './RunsContourPlot';
import { RunsContourPlot } from './RunsContourPlot';

export default {
  title: 'Runs charts/Contour plot',
  component: RunsContourPlot,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
};

const createMockContourData = (numRuns: number): RunsContourPlotProps['runsData'] => {
  const random = stableNormalRandom(0);
  return new Array(numRuns).fill(0).map((_, index) => {
    const runName = getRandomRunName(random);
    return {
      uuid: `id-for-run-${runName}`,
      displayName: runName,
      runInfo: {
        runUuid: `id-for-run-${runName}`,
        runName: runName,
      } as RunInfoEntity,
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
      tags: {} as any,
      images: {} as any,
      color: chartColors[index % chartColors.length],
    };
  });
};

const ContourPlotStoryWrapper = (props: any) => {
  const [reverse, setReverse] = useState(false);
  const { axisProps, controls } = useControls(true);
  const [hoveredRun, setHoveredRun] = useState('');

  const clear = useCallback(() => setHoveredRun(''), []);

  return (
    <ChartStoryWrapper
      title={props.title}
      controls={
        <span>
          {controls} Reverse scale:{' '}
          <input type="checkbox" checked={reverse} onChange={({ target }) => setReverse(target.checked)} /> Hovered run
          ID: {hoveredRun}
        </span>
      }
    >
      <RunsContourPlot reverseScale={reverse} {...axisProps} onHover={setHoveredRun} onUnhover={clear} {...props} />
    </ChartStoryWrapper>
  );
};
export const TenRuns = () => <ContourPlotStoryWrapper runsData={useMemo(() => createMockContourData(10), [])} />;
export const TenRunsStatic = () => (
  <ContourPlotStoryWrapper runsData={useMemo(() => createMockContourData(10), [])} width={400} height={400} />
);
export const SeventyRuns = () => <ContourPlotStoryWrapper runsData={useMemo(() => createMockContourData(70), [])} />;
export const CustomScaleRuns = () => (
  <ContourPlotStoryWrapper
    runsData={useMemo(() => createMockContourData(10), [])}
    colorScale={useMemo(
      () => [
        [0, 'rgb(0,0,224)'],
        [0.25, 'rgb(0,128,192)'],
        [0.5, 'rgb(255,0,0)'],
        [0.75, 'rgb(192,168,0)'],
        [1, 'rgb(192,168,0)'],
      ],
      [],
    )}
  />
);

TenRuns.storyName = '10 runs (auto-size)';
TenRunsStatic.storyName = '10 runs (static size: 400x400)';
SeventyRuns.storyName = '70 runs (auto-size)';
CustomScaleRuns.storyName = 'Custom color scale (auto-size)';
```

--------------------------------------------------------------------------------

---[FILE: RunsContourPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/RunsContourPlot.tsx
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
  runsChartDefaultContourMargin,
  runsChartHoverlabel,
  createThemedPlotlyLayout,
  useDynamicPlotSize,
  getLegendDataFromRuns,
} from './RunsCharts.common';
import RunsMetricsLegendWrapper from './RunsMetricsLegendWrapper';
import { createChartImageDownloadHandler } from '../hooks/useChartImageDownloadHandler';
import { RunsChartCardLoadingPlaceholder } from './cards/ChartCard.common';

export interface RunsContourPlotProps extends RunsPlotsCommonProps {
  /**
   * Horizontal axis with a metric or a param
   */
  xAxis: RunsChartAxisDef;

  /**
   * Vertical axis with a metric or a param
   */
  yAxis: RunsChartAxisDef;

  /**
   * Depth dimension with a metric or a param
   */
  zAxis: RunsChartAxisDef;

  /**
   * Array of runs data with corresponding values
   */
  runsData: RunsChartsRunData[];

  /**
   * Sets the color scale in [[0.35, 'rgb(40,60,190)'],[0.5, 'rgb(70,100,245)'],...] format.
   * Leave unset to use the defualt scale.
   */
  colorScale?: [number, string][];

  /**
   * Set to `true` in order to reverse the color scale.
   */
  reverseScale?: boolean;
}

const PLOT_CONFIG = {
  displaylogo: false,
  scrollZoom: false,
  modeBarButtonsToRemove: ['toImage'],
};

const DEFAULT_COLOR_SCALE: [number, string][] = [
  [0, 'rgb(5,10,172)'],
  [0.35, 'rgb(40,60,190)'],
  [0.5, 'rgb(70,100,245)'],
  [0.6, 'rgb(90,120,245)'],
  [0.7, 'rgb(106,137,247)'],
  [1, 'rgb(220,220,220)'],
];

const createTooltipTemplate = (zAxisTitle: string) =>
  '<b>%{customdata[1]}:</b><br>' +
  '<b>%{xaxis.title.text}:</b> %{x:.2f}<br>' +
  '<b>%{yaxis.title.text}:</b> %{y:.2f}<br>' +
  `<b>${zAxisTitle}:</b> %{customdata[2]:.2f}` +
  '<extra></extra>';

/**
 * Implementation of plotly.js chart displaying
 * contour plot comparing values for a given
 * set of experiments runs
 */
export const RunsContourPlot = React.memo(
  ({
    runsData,
    xAxis,
    yAxis,
    zAxis,
    markerSize = 10,
    className,
    reverseScale,
    margin = runsChartDefaultContourMargin,
    colorScale = DEFAULT_COLOR_SCALE,
    onUpdate,
    onHover,
    onUnhover,
    width,
    height,
    useDefaultHoverBox = true,
    selectedRunUuid,
    onSetDownloadHandler,
  }: RunsContourPlotProps) => {
    const { theme } = useDesignSystemTheme();

    const { layoutHeight, layoutWidth, setContainerDiv, containerDiv, isDynamicSizeSupported } = useDynamicPlotSize();

    const plotData = useMemo(() => {
      // Prepare empty values
      const xValues: (number | string)[] = [];
      const yValues: (number | string)[] = [];
      const zValues: (number | string)[] = [];
      const colors: (number | string)[] = [];
      const tooltipData: Datum[] = [];

      // Iterate through all the runs and aggregate selected metrics/params
      for (const runData of runsData) {
        const { metrics, params, color, uuid, displayName } = runData;
        const xAxisData = xAxis.type === 'METRIC' ? metrics : params;
        const yAxisData = yAxis.type === 'METRIC' ? metrics : params;
        const zAxisData = zAxis.type === 'METRIC' ? metrics : params;

        const x = xAxisData?.[xAxis.key]?.value;
        const y = yAxisData?.[yAxis.key]?.value;
        const z = zAxisData?.[zAxis.key]?.value;

        if (!isNil(x) && !isNil(y) && !isNil(z)) {
          xValues.push(x);
          yValues.push(y);
          zValues.push(z);
          colors.push(color || theme.colors.primary);
          tooltipData.push([uuid, displayName || uuid, z] as any);
        }
      }

      // Let's compile chart layers
      const layers = [
        // The top layer with the scatter plot (dots)
        {
          x: xValues,
          y: yValues,
          customdata: tooltipData,
          text: runsData.map(({ displayName }) => displayName),
          hovertemplate: useDefaultHoverBox ? createTooltipTemplate(zAxis.key) : undefined,
          hoverinfo: useDefaultHoverBox ? undefined : 'none',
          hoverlabel: useDefaultHoverBox ? runsChartHoverlabel : undefined,
          type: 'scatter',
          mode: 'markers',
          textposition: 'bottom center',
          marker: {
            size: markerSize,
            color: colors,
            line: {
              color: 'black',
              width: 1,
            },
          },
        },
      ] as Data[];

      // If there are at least two runs, add a contour chart layer
      if (runsData.length > 1) {
        layers.unshift({
          x: xValues,
          y: yValues,
          z: zValues,
          type: 'contour',
          connectgaps: true,
          hoverinfo: 'none',
          contours: {
            coloring: 'heatmap',
          },
          colorscale: colorScale,
          reversescale: reverseScale,
          colorbar: {
            tickfont: { size: 11, color: theme.colors.textSecondary, family: '' },
          },
        } as Data);
      }
      return layers;
    }, [
      colorScale,
      reverseScale,
      markerSize,
      runsData,
      xAxis.type,
      xAxis.key,
      yAxis.type,
      yAxis.key,
      zAxis.type,
      zAxis.key,
      theme.colors.primary,
      theme.colors.textSecondary,
      useDefaultHoverBox,
    ]);

    const plotlyThemedLayout = useMemo(() => createThemedPlotlyLayout(theme), [theme]);

    const [layout, setLayout] = useState<Partial<Layout>>({
      width: width || layoutWidth,
      height: height || layoutHeight,
      margin,
      xaxis: { title: xAxis.key, tickfont: { size: 11, color: theme.colors.textSecondary } },
      yaxis: {
        ticks: 'inside',
        title: { standoff: 32, text: yAxis.key },
        tickfont: { size: 11, color: theme.colors.textSecondary },
      },
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
          newLayout.yaxis.title = { standoff: 32, text: yAxis.key };
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
        // Find hover event corresponding to the second curve (scatter plot) only
        const scatterPoints = points.find(({ curveNumber }) => curveNumber === 1);

        setHoveredPointIndex(scatterPoints?.pointIndex ?? -1);

        if (!scatterPoints) {
          return;
        }

        // Find the corresponding run UUID by basing on "customdata" field set in the trace data.
        // Plotly TS typings don't support custom fields so we need to cast to "any" first
        const pointCustomDataRunUuid = (scatterPoints as any)?.customdata?.[0];
        if (pointCustomDataRunUuid) {
          onHover?.(pointCustomDataRunUuid);
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
```

--------------------------------------------------------------------------------

````

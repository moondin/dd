---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 528
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 528 of 991)

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

---[FILE: RunsChartsConfigureMetricWithDatasetSelect.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureMetricWithDatasetSelect.tsx

```typescript
import { SimpleSelect, SimpleSelectOption, Tag } from '@databricks/design-system';
import type { RunsChartsMetricByDatasetEntry } from '../../runs-charts.types';

export const RunsChartsConfigureMetricWithDatasetSelect = ({
  metricKeysByDataset,
  value,
  onChange,
}: {
  metricKeysByDataset?: RunsChartsMetricByDatasetEntry[];
  value?: string;
  onChange: (metricByDatasetEntry: RunsChartsMetricByDatasetEntry) => void;
}) => {
  return (
    <SimpleSelect
      css={{ width: '100%' }}
      componentId="mlflow.charts.chart_configure.metric_with_dataset_select"
      id="mlflow.charts.chart_configure.metric_with_dataset_select"
      value={value}
      onChange={({ target }) => {
        const entry = metricKeysByDataset?.find(({ dataAccessKey }) => dataAccessKey === target.value);
        if (entry) {
          onChange(entry);
        }
      }}
      contentProps={{
        matchTriggerWidth: true,
        maxHeight: 400,
      }}
    >
      {metricKeysByDataset?.map(({ datasetName, metricKey, dataAccessKey }) => (
        <SimpleSelectOption key={dataAccessKey} value={dataAccessKey}>
          {datasetName && (
            <Tag componentId="mlflow.charts.chart_configure.metric_with_dataset_select.tag">{datasetName}</Tag>
          )}{' '}
          {metricKey}
        </SimpleSelectOption>
      ))}
    </SimpleSelect>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureParallelChart.preview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureParallelChart.preview.tsx
Signals: React

```typescript
import type { RunsChartsRunData } from '../RunsCharts.common';
import LazyParallelCoordinatesPlot from '../charts/LazyParallelCoordinatesPlot';
import { isParallelChartConfigured, processParallelCoordinateData } from '../../utils/parallelCoordinatesPlot.utils';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsParallelCardConfig } from '../../runs-charts.types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import { Empty, NoIcon } from '@databricks/design-system';
import { RunsChartCardLoadingPlaceholder } from '../cards/ChartCard.common';

export const RunsChartsConfigureParallelChartPreview = ({
  previewData,
  cardConfig,
  groupBy,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsParallelCardConfig;
  groupBy: RunsGroupByConfig | null;
}) => {
  const isConfigured = isParallelChartConfigured(cardConfig);

  const { setTooltip, resetTooltip } = useRunsChartsTooltip(cardConfig);

  const containsStringValues = useMemo(
    () =>
      cardConfig.selectedParams?.some(
        (paramKey) => previewData?.some((dataTrace) => isNaN(Number(dataTrace.params[paramKey]?.value))),
        [cardConfig.selectedParams, previewData],
      ),
    [cardConfig.selectedParams, previewData],
  );

  if (containsStringValues && groupBy) {
    return (
      <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <FormattedMessage
          defaultMessage="Parallel coordinates chart does not support aggregated string values. Use other parameters or disable run grouping to continue."
          description="Experiment page > compare runs > parallel coordinates chart configuration modal > unsupported string values warning"
        />
      </div>
    );
  }

  const filteredData = isConfigured
    ? processParallelCoordinateData(previewData, cardConfig.selectedParams, cardConfig.selectedMetrics)
    : [];

  if (!isConfigured) {
    return (
      <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Select at least two metrics and params first
      </div>
    );
  }

  return filteredData.length ? (
    /* Avoid displaying empty set, otherwise parcoord-es crashes */
    <LazyParallelCoordinatesPlot
      selectedMetrics={cardConfig.selectedMetrics}
      selectedParams={cardConfig.selectedParams}
      data={filteredData}
      axesRotateThreshold={6}
      onHover={setTooltip}
      onUnhover={resetTooltip}
      fallback={<RunsChartCardLoadingPlaceholder />}
    />
  ) : (
    <Empty
      description={
        <FormattedMessage
          defaultMessage="No matching data found for the available runs."
          description="Experiment tracking > runs charts > parallel coordinates chart preview > no data found description"
        />
      }
      image={<NoIcon />}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureParallelChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureParallelChart.tsx
Signals: React

```typescript
import { LegacySelect } from '@databricks/design-system';
import { useCallback } from 'react';
import type { RunsChartsCardConfig, RunsChartsParallelCardConfig } from '../../runs-charts.types';
import { RunsChartsConfigureField } from './RunsChartsConfigure.common';

/**
 * Form containing configuration controls for runs compare charts.
 */
export const RunsChartsConfigureParallelChart = ({
  state,
  onStateChange,
  metricKeyList,
  paramKeyList,
}: {
  metricKeyList: string[];
  paramKeyList: string[];
  state: Partial<RunsChartsParallelCardConfig>;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsParallelCardConfig) => void;
}) => {
  /**
   * Callback for updating selected metrics and params
   */

  const updateSelectedParams = useCallback(
    (selectedParams: string[]) => {
      onStateChange((current) => ({
        ...(current as RunsChartsParallelCardConfig),
        selectedParams,
      }));
    },
    [onStateChange],
  );

  const updateSelectedMetrics = useCallback(
    (selectedMetrics: string[]) => {
      onStateChange((current) => ({
        ...(current as RunsChartsParallelCardConfig),
        selectedMetrics,
      }));
    },
    [onStateChange],
  );

  const emptyMetricsList = metricKeyList.length === 0;
  const emptyParamsList = paramKeyList.length === 0;

  return (
    <>
      <RunsChartsConfigureField title="Params">
        <LegacySelect
          mode={emptyParamsList ? undefined : 'multiple'}
          onChange={updateSelectedParams}
          style={{
            width: 275,
          }}
          value={emptyParamsList ? ('No parameters available' as any) : state.selectedParams}
          disabled={emptyParamsList}
        >
          {paramKeyList.map((param) => (
            <LegacySelect.Option value={param} key={param}>
              {param}
            </LegacySelect.Option>
          ))}
        </LegacySelect>
      </RunsChartsConfigureField>
      <RunsChartsConfigureField title="Metrics">
        <LegacySelect
          mode={emptyMetricsList ? undefined : 'multiple'}
          onChange={updateSelectedMetrics}
          style={{
            width: 275,
          }}
          value={emptyMetricsList ? ('No metrics available' as any) : state.selectedMetrics}
          disabled={emptyMetricsList}
        >
          {metricKeyList.map((metric) => (
            <LegacySelect.Option value={metric} key={metric}>
              {metric}
            </LegacySelect.Option>
          ))}
        </LegacySelect>
      </RunsChartsConfigureField>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureScatterChart.preview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureScatterChart.preview.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { RunsScatterPlot } from '../RunsScatterPlot';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsScatterCardConfig } from '../../runs-charts.types';

export const RunsChartsConfigureScatterChartPreview = ({
  previewData,
  cardConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsScatterCardConfig;
}) => {
  const { resetTooltip, setTooltip } = useRunsChartsTooltip(cardConfig);

  // We need to re-render the chart when the x or y axis changes.
  // Plotly tries to determine axis format based on values and is not capable
  // of dynamic switching between different axis types, so we need to make sure
  // that we re-mount the chart when config changes.
  const key = useMemo(() => {
    const { xaxis, yaxis } = cardConfig;
    return JSON.stringify({ xaxis, yaxis });
  }, [cardConfig]);

  return (
    <RunsScatterPlot
      xAxis={cardConfig.xaxis}
      yAxis={cardConfig.yaxis}
      runsData={previewData}
      onHover={setTooltip}
      onUnhover={resetTooltip}
      useDefaultHoverBox={false}
      key={key}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureScatterChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureScatterChart.tsx
Signals: React

```typescript
import { useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  extractCanonicalSortKey,
  isCanonicalSortKeyOfType,
  makeCanonicalSortKey,
} from '../../../experiment-page/utils/experimentPage.common-utils';
import type { RunsChartsCardConfig, RunsChartsScatterCardConfig } from '../../runs-charts.types';
import {
  RunsChartsMetricParamSelect,
  RunsChartsConfigureField,
  runsChartsRunCountDefaultOptions,
} from './RunsChartsConfigure.common';

type ValidAxis = keyof Pick<RunsChartsScatterCardConfig, 'xaxis' | 'yaxis'>;

const scatterPlotDefaultOptions = runsChartsRunCountDefaultOptions;
scatterPlotDefaultOptions.push(
  {
    value: 100,
    label: (
      <FormattedMessage
        defaultMessage="100"
        description="Label for 100 first runs visible in run count selector within runs compare configuration modal"
      />
    ),
  },
  {
    value: 250,
    label: (
      <FormattedMessage
        defaultMessage="250"
        description="Label for 250 first runs visible in run count selector within runs compare configuration modal"
      />
    ),
  },
  {
    value: 500,
    label: (
      <FormattedMessage
        defaultMessage="500"
        description="Label for 500 first runs visible in run count selector within runs compare configuration modal"
      />
    ),
  },
);

/**
 * Form containing configuration controls for scatter runs compare chart.
 */
export const RunsChartsConfigureScatterChart = ({
  state,
  onStateChange,
  metricKeyList,
  paramKeyList,
}: {
  metricKeyList: string[];
  paramKeyList: string[];
  state: RunsChartsScatterCardConfig;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsScatterCardConfig) => void;
}) => {
  const { formatMessage } = useIntl();

  /**
   * Callback for updating X or Y axis
   */
  const updateAxis = useCallback(
    (canonicalKey: string, axis: ValidAxis) => {
      const type = isCanonicalSortKeyOfType(canonicalKey, 'METRIC') ? 'METRIC' : 'PARAM';
      const key = extractCanonicalSortKey(canonicalKey, type);
      onStateChange((current) => ({
        ...(current as RunsChartsScatterCardConfig),
        [axis]: { key, type },
      }));
    },
    [onStateChange],
  );

  /**
   * Callback for updating run count
   */
  const updateVisibleRunCount = useCallback(
    (runsCountToCompare: number) => {
      onStateChange((current) => ({
        ...(current as RunsChartsScatterCardConfig),
        runsCountToCompare,
      }));
    },
    [onStateChange],
  );

  /**
   * If somehow axes are not predetermined, automatically
   * select the first metric/param so it's not empty
   */
  useEffect(() => {
    const firstMetric = metricKeyList?.[0];
    const firstParam = paramKeyList?.[0];
    if (!state.xaxis?.key) {
      if (firstMetric) {
        updateAxis(makeCanonicalSortKey('METRIC', firstMetric), 'xaxis');
      } else if (firstParam) {
        updateAxis(makeCanonicalSortKey('PARAM', firstParam), 'xaxis');
      }
    }
    if (!state.yaxis?.key) {
      if (firstMetric) {
        updateAxis(makeCanonicalSortKey('METRIC', firstMetric), 'yaxis');
      } else if (firstParam) {
        updateAxis(makeCanonicalSortKey('PARAM', firstParam), 'yaxis');
      }
    }
  }, [state.xaxis, state.yaxis, updateAxis, metricKeyList, paramKeyList]);

  return (
    <>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'X axis',
          description: 'Label for X axis in scatter chart configurator in compare runs chart config modal',
        })}
      >
        <RunsChartsMetricParamSelect
          value={state.xaxis.key ? makeCanonicalSortKey(state.xaxis.type, state.xaxis.key) : ''}
          onChange={(value) => {
            updateAxis(value, 'xaxis');
          }}
          paramKeyList={paramKeyList}
          metricKeyList={metricKeyList}
        />
      </RunsChartsConfigureField>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'Y axis',
          description: 'Label for Y axis in scatter chart configurator in compare runs chart config modal',
        })}
      >
        <RunsChartsMetricParamSelect
          value={state.yaxis.key ? makeCanonicalSortKey(state.yaxis.type, state.yaxis.key) : ''}
          onChange={(value) => {
            updateAxis(value, 'yaxis');
          }}
          paramKeyList={paramKeyList}
          metricKeyList={metricKeyList}
        />
      </RunsChartsConfigureField>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureScatterChartWithDatasets.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureScatterChartWithDatasets.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import type {
  RunsChartsCardConfig,
  RunsChartsMetricByDatasetEntry,
  RunsChartsScatterCardConfig,
} from '../../runs-charts.types';
import { RunsChartsConfigureField, RunsChartsMetricParamSelectV2 } from './RunsChartsConfigure.common';

type ValidAxis = keyof Pick<RunsChartsScatterCardConfig, 'xaxis' | 'yaxis'>;

/**
 * Form containing configuration controls for scatter runs compare chart.
 */
export const RunsChartsConfigureScatterChartWithDatasets = ({
  state,
  onStateChange,
  paramKeyList,
  metricKeysByDataset,
}: {
  paramKeyList: string[];
  metricKeysByDataset: RunsChartsMetricByDatasetEntry[] | undefined;
  state: RunsChartsScatterCardConfig;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsScatterCardConfig) => void;
}) => {
  const { formatMessage } = useIntl();

  const metricOptions = useMemo(
    () =>
      metricKeysByDataset?.map(({ dataAccessKey, metricKey, datasetName }) => ({
        key: JSON.stringify(['METRIC', dataAccessKey]),
        dataAccessKey,
        datasetName,
        metricKey,
      })) ?? [],
    [metricKeysByDataset],
  );

  const paramOptions = useMemo(
    () =>
      paramKeyList?.map((paramKey) => ({
        key: JSON.stringify(['PARAM', paramKey]),
        paramKey,
      })) ?? [],
    [paramKeyList],
  );

  /**
   * Callback for updating X or Y axis
   */
  const handleChange = useCallback(
    (axis: ValidAxis) => (value: string) => {
      const foundMetric = metricOptions.find(({ key }) => key === value);
      if (foundMetric) {
        const { dataAccessKey, datasetName, metricKey } = foundMetric;
        onStateChange((current) => ({
          ...(current as RunsChartsScatterCardConfig),
          [axis]: { key: metricKey, type: 'METRIC', datasetName, dataAccessKey },
        }));
      }
      const foundParam = paramOptions.find(({ key }) => key === value);
      if (foundParam) {
        onStateChange((current) => ({
          ...(current as RunsChartsScatterCardConfig),
          [axis]: { key: foundParam.paramKey, type: 'PARAM' },
        }));
      }
    },
    [onStateChange, metricOptions, paramOptions],
  );

  useEffect(() => {
    // For each axis: if there is no selected value, select the first available option
    for (const axis of ['xaxis', 'yaxis'] as const) {
      if (!state[axis]?.key) {
        if (metricOptions?.[0]) {
          handleChange(axis)(metricOptions[0].key);
        } else if (paramOptions?.[0]) {
          handleChange(axis)(paramOptions[0].key);
        }
      }
    }
  }, [state, metricOptions, paramOptions, handleChange]);

  const getSelectedValue = useCallback(
    (axis: ValidAxis) => {
      if (state[axis].type === 'METRIC') {
        const foundMetricOption = metricOptions.find(
          ({ dataAccessKey }) => dataAccessKey === state[axis].dataAccessKey,
        );
        if (foundMetricOption) {
          return foundMetricOption.key;
        }
      }
      if (state[axis].type === 'PARAM') {
        const foundParamOption = paramOptions.find(({ paramKey }) => paramKey === state[axis].key);
        if (foundParamOption) {
          return foundParamOption.key;
        }
      }
      return '';
    },
    [state, metricOptions, paramOptions],
  );

  const selectedXValue = useMemo(() => getSelectedValue('xaxis'), [getSelectedValue]);
  const selectedYValue = useMemo(() => getSelectedValue('yaxis'), [getSelectedValue]);

  return (
    <>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'X axis',
          description: 'Label for X axis in scatter chart configurator in compare runs chart config modal',
        })}
      >
        <RunsChartsMetricParamSelectV2
          value={selectedXValue}
          onChange={handleChange('xaxis')}
          metricOptions={metricOptions}
          paramOptions={paramOptions}
          id="mlflow.charts.chart_configure.scatter.x_axis"
        />
      </RunsChartsConfigureField>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'Y axis',
          description: 'Label for Y axis in scatter chart configurator in compare runs chart config modal',
        })}
      >
        <RunsChartsMetricParamSelectV2
          value={selectedYValue}
          onChange={handleChange('yaxis')}
          metricOptions={metricOptions}
          paramOptions={paramOptions}
          id="mlflow.charts.chart_configure.scatter.y_axis"
        />
      </RunsChartsConfigureField>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useLineChartGlobalConfig.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/hooks/useLineChartGlobalConfig.tsx
Signals: React

```typescript
import { isUndefined, pick } from 'lodash';
import type { RunsChartsLineCardConfig } from '../../runs-charts.types';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';
import { useMemo } from 'react';
import { RunsChartsLineChartXAxisType } from '../RunsCharts.common';

/**
 * A utility hook that selects if certain line chart settings should be
 * taken from global configuration or from local chard card settings.
 */
export const useLineChartGlobalConfig = (
  originalCardConfig: RunsChartsLineCardConfig,
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig,
) =>
  useMemo(() => {
    const result = pick(originalCardConfig, ['xAxisKey', 'selectedXAxisMetricKey', 'lineSmoothness']);

    if (!globalLineChartConfig) {
      return result;
    }

    const globalXAxisKey = globalLineChartConfig.xAxisKey;

    if (originalCardConfig.useGlobalLineSmoothing && !isUndefined(globalLineChartConfig.lineSmoothness)) {
      result.lineSmoothness = globalLineChartConfig.lineSmoothness;
    }

    if (!isUndefined(globalXAxisKey) && originalCardConfig.useGlobalXaxisKey) {
      result.xAxisKey = globalXAxisKey;
      const globalSelectedXAxisMetricKey = globalLineChartConfig?.selectedXAxisMetricKey;
      if (globalXAxisKey === RunsChartsLineChartXAxisType.METRIC && globalSelectedXAxisMetricKey) {
        result.selectedXAxisMetricKey = globalSelectedXAxisMetricKey;
      }
    }

    return result;
  }, [originalCardConfig, globalLineChartConfig]);
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/sections/RunsChartsSection.tsx

```typescript
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import type { RunsChartsCardConfig } from '../../runs-charts.types';
import type { RunsChartsRunData } from '../RunsCharts.common';
import type { RunsChartCardSetFullscreenFn } from '../cards/ChartCard.common';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';
import type { ChartSectionConfig } from '../../../../types';
import { RunsChartsDraggableCardsGridSection } from '../RunsChartsDraggableCardsGridSection';

export interface RunsChartsSectionProps {
  sectionId: string;
  sectionConfig: ChartSectionConfig;
  sectionCharts: RunsChartsCardConfig[];
  reorderCharts: (sourceChartUuid: string, targetChartUuid: string) => void;
  insertCharts: (sourceChartUuid: string, targetSectionId: string) => void;
  isMetricHistoryLoading: boolean;
  chartData: RunsChartsRunData[];
  startEditChart: (chartCard: RunsChartsCardConfig) => void;
  removeChart: (configToDelete: RunsChartsCardConfig) => void;
  groupBy: RunsGroupByConfig | null;
  sectionIndex: number;
  setFullScreenChart: RunsChartCardSetFullscreenFn;
  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
}

export const RunsChartsSection = ({
  sectionId,
  sectionCharts,
  reorderCharts,
  insertCharts,
  isMetricHistoryLoading,
  chartData,
  startEditChart,
  removeChart,
  groupBy,
  sectionIndex,
  setFullScreenChart,
  autoRefreshEnabled,
  hideEmptyCharts,
  globalLineChartConfig,
  sectionConfig,
}: RunsChartsSectionProps) => {
  return (
    <RunsChartsDraggableCardsGridSection
      sectionConfig={sectionConfig}
      cardsConfig={sectionCharts}
      chartRunData={chartData}
      onStartEditChart={startEditChart}
      onRemoveChart={removeChart}
      setFullScreenChart={setFullScreenChart}
      sectionId={sectionId}
      groupBy={groupBy}
      autoRefreshEnabled={autoRefreshEnabled}
      hideEmptyCharts={hideEmptyCharts}
      globalLineChartConfig={globalLineChartConfig}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsSectionAccordion.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/sections/RunsChartsSectionAccordion.tsx
Signals: React

```typescript
import { Accordion } from '@databricks/design-system';
import type { ChartSectionConfig } from '../../../../types';
import type { RunsChartsRunData } from '../RunsCharts.common';
import type {
  RunsChartsBarCardConfig,
  RunsChartsCardConfig,
  RunsChartsLineCardConfig,
  RunsChartsScatterCardConfig,
  RunsChartsContourCardConfig,
  SerializedRunsChartsCardConfigCard,
  RunsChartsParallelCardConfig,
} from '../../runs-charts.types';
import { RunsChartType } from '../../runs-charts.types';
import MetricChartsAccordion, { METRIC_CHART_SECTION_HEADER_SIZE } from '../../../MetricChartsAccordion';
import { RunsChartsSectionHeader } from './RunsChartsSectionHeader';
import { RunsChartsSection } from './RunsChartsSection';
import { useCallback, useMemo } from 'react';
import { getUUID } from '@mlflow/mlflow/src/common/utils/ActionUtils';
import { useState } from 'react';
import { Button, PlusIcon } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { Empty } from '@databricks/design-system';
import { useDesignSystemTheme } from '@databricks/design-system';
import { Spacer } from '@databricks/design-system';
import { useUpdateRunsChartsUIConfiguration } from '../../hooks/useRunsChartsUIConfiguration';
import { compact, isArray } from 'lodash';
import type { RunsChartCardSetFullscreenFn } from '../cards/ChartCard.common';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';

const chartMatchesFilter = (filter: string, config: RunsChartsCardConfig) => {
  // Use regexp-based filtering if a feature flag is enabled
  if (config.type === RunsChartType.IMAGE || config.type === RunsChartType.DIFFERENCE) {
    return true;
  }

  try {
    const filterRegex = new RegExp(filter, 'i');
    return getChartMetricsAndParams(config).some((metricOrParam) => metricOrParam.match(filterRegex));
  } catch {
    // If the regex is invalid (e.g. user it still typing it), prevent from filtering
    return true;
  }
};

const getChartMetricsAndParams = (config: RunsChartsCardConfig): string[] => {
  if (config.type === RunsChartType.BAR) {
    const barConfig = config as RunsChartsBarCardConfig;
    if (barConfig.dataAccessKey) {
      return [barConfig.metricKey, barConfig.dataAccessKey];
    }
    return [barConfig.metricKey];
  } else if (config.type === RunsChartType.LINE) {
    const lineConfig = config as RunsChartsLineCardConfig;
    if (isArray(lineConfig.selectedMetricKeys)) {
      return lineConfig.selectedMetricKeys;
    }
    return [lineConfig.metricKey];
  } else if (config.type === RunsChartType.SCATTER) {
    const scatterConfig = config as RunsChartsScatterCardConfig;
    return [scatterConfig.xaxis.key.toLowerCase(), scatterConfig.yaxis.key.toLowerCase()];
  } else if (config.type === RunsChartType.PARALLEL) {
    const parallelConfig = config as RunsChartsParallelCardConfig;
    return [...parallelConfig.selectedMetrics, ...parallelConfig.selectedParams];
  } else {
    const contourConfig = config as RunsChartsContourCardConfig;
    return [contourConfig.xaxis.key, contourConfig.yaxis.key, contourConfig.zaxis.key];
  }
};

export interface RunsChartsSectionAccordionProps {
  compareRunSections?: ChartSectionConfig[];
  compareRunCharts?: SerializedRunsChartsCardConfigCard[];
  reorderCharts: (sourceChartUuid: string, targetChartUuid: string) => void;
  insertCharts: (sourceChartUuid: string, targetSectionId: string) => void;
  chartData: RunsChartsRunData[];
  isMetricHistoryLoading?: boolean;
  startEditChart: (chartCard: RunsChartsCardConfig) => void;
  removeChart: (configToDelete: RunsChartsCardConfig) => void;
  addNewChartCard: (metricSectionId: string) => (type: RunsChartType) => void;
  search: string;
  groupBy: RunsGroupByConfig | null;
  autoRefreshEnabled?: boolean;
  hideEmptyCharts?: boolean;
  supportedChartTypes?: RunsChartType[] | undefined;
  setFullScreenChart: RunsChartCardSetFullscreenFn;
  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;
  noRunsSelectedEmptyState?: React.ReactElement;
}

export const RunsChartsSectionAccordion = ({
  compareRunSections,
  compareRunCharts,
  reorderCharts,
  insertCharts,
  chartData,
  isMetricHistoryLoading = false,
  autoRefreshEnabled = false,
  startEditChart,
  removeChart,
  addNewChartCard,
  search,
  groupBy,
  supportedChartTypes,
  hideEmptyCharts,
  setFullScreenChart = () => {},
  globalLineChartConfig,
  noRunsSelectedEmptyState,
}: RunsChartsSectionAccordionProps) => {
  const updateUIState = useUpdateRunsChartsUIConfiguration();
  const [editSection, setEditSection] = useState(-1);
  const { theme } = useDesignSystemTheme();

  /**
   * Get the active (expanded) panels for the accordion
   */
  const activeKey = useMemo(() => {
    const activeSections = (compareRunSections || []).flatMap((sectionConfig: ChartSectionConfig) => {
      if (sectionConfig.display) {
        return [sectionConfig.uuid];
      } else {
        return [];
      }
    });
    return activeSections;
  }, [compareRunSections]);

  /**
   * Updates the active (expanded) panels for the accordion
   */
  const onActivePanelChange = useCallback(
    (key: string | string[]) => {
      updateUIState((current) => {
        const newCompareRunPanels = (current.compareRunSections || []).map((sectionConfig: ChartSectionConfig) => {
          const sectionId = sectionConfig.uuid;
          const shouldDisplaySection =
            (typeof key === 'string' && sectionId === key) || (Array.isArray(key) && key.includes(sectionId));
          return {
            ...sectionConfig,
            display: shouldDisplaySection,
          };
        });
        return {
          ...current,
          compareRunSections: newCompareRunPanels,
        };
      });
    },
    [updateUIState],
  );

  /**
   * Deletes a section from the accordion
   */
  const deleteSection = useCallback(
    (sectionId: string) => {
      updateUIState((current) => {
        const newCompareRunCharts = (current.compareRunCharts || [])
          // Keep charts that are generated or not in section
          .filter((chartConfig: RunsChartsCardConfig) => {
            return chartConfig.isGenerated || chartConfig.metricSectionId !== sectionId;
          })
          // For charts that are generated and in section, set deleted to true
          .map((chartConfig: RunsChartsCardConfig) => {
            if (chartConfig.isGenerated && chartConfig.metricSectionId === sectionId) {
              return { ...chartConfig, deleted: true };
            } else {
              return chartConfig;
            }
          });

        // Delete section
        const newCompareRunSections = (current.compareRunSections || [])
          .slice()
          .filter((sectionConfig: ChartSectionConfig) => {
            return sectionConfig.uuid !== sectionId;
          });

        return {
          ...current,
          compareRunCharts: newCompareRunCharts,
          compareRunSections: newCompareRunSections,
          isAccordionReordered: true,
        };
      });
    },
    [updateUIState],
  );

  /**
   * Adds a section to the accordion
   * @param sectionId indicates the section selected to anchor at
   * @param above is a boolean value indicating whether to add the section above or below the anchor
   */
  const addSection = useCallback(
    (sectionId: string, above: boolean) => {
      let idx = -1;
      updateUIState((current) => {
        // Look for index
        const newCompareRunSections = [...(current.compareRunSections || [])];
        idx = newCompareRunSections.findIndex((sectionConfig: ChartSectionConfig) => sectionConfig.uuid === sectionId);
        const newSection = { name: '', uuid: getUUID(), display: false, isReordered: false };
        if (idx < 0) {
          // Index not found, add to end
          newCompareRunSections.push(newSection);
        } else if (above) {
          newCompareRunSections.splice(idx, 0, newSection);
        } else {
          idx += 1;
          newCompareRunSections.splice(idx, 0, newSection);
        }
        return {
          ...current,
          compareRunSections: newCompareRunSections,
          isAccordionReordered: true,
        };
      });
      return idx;
    },
    [updateUIState],
  );

  /**
   * Appends a section to the end of the accordion
   */
  const appendSection = useCallback(() => {
    updateUIState((current) => {
      const newCompareRunSections = [
        ...(current.compareRunSections || []),
        { name: '', uuid: getUUID(), display: false, isReordered: false },
      ];
      return {
        ...current,
        compareRunSections: newCompareRunSections,
        isAccordionReordered: true,
      };
    });
    setEditSection(compareRunSections?.length || -1);
  }, [updateUIState, compareRunSections?.length]);

  /**
   * Updates the name of a section
   * @param sectionId the section to update the name of
   * @param name the new name of the section
   */
  const setSectionName = useCallback(
    (sectionId: string, name: string) => {
      updateUIState((current) => {
        const newCompareRunSections = (current.compareRunSections || []).map((sectionConfig: ChartSectionConfig) => {
          if (sectionConfig.uuid === sectionId) {
            return { ...sectionConfig, name: name };
          } else {
            return sectionConfig;
          }
        });
        return {
          ...current,
          compareRunSections: newCompareRunSections,
          isAccordionReordered: true,
        };
      });
    },
    [updateUIState],
  );

  /**
   * Reorders the sections in the accordion
   * @param sourceSectionId the section you are dragging
   * @param targetSectionId the section to drop
   */
  const sectionReorder = useCallback(
    (sourceSectionId: string, targetSectionId: string) => {
      updateUIState((current) => {
        const newCompareRunSections = (current.compareRunSections || []).slice();
        const sourceSectionIdx = newCompareRunSections.findIndex(
          (sectionConfig: ChartSectionConfig) => sectionConfig.uuid === sourceSectionId,
        );
        const targetSectionIdx = newCompareRunSections.findIndex(
          (sectionConfig: ChartSectionConfig) => sectionConfig.uuid === targetSectionId,
        );
        const sourceSection = newCompareRunSections.splice(sourceSectionIdx, 1)[0];
        // If the source section is above the target section, the target section index will be shifted down by 1
        newCompareRunSections.splice(targetSectionIdx, 0, sourceSection);
        return {
          ...current,
          compareRunSections: newCompareRunSections,
          isAccordionReordered: true,
        };
      });
    },
    [updateUIState],
  );

  const noRunsSelected = useMemo(() => chartData.filter(({ hidden }) => !hidden).length === 0, [chartData]);

  const { sectionsToRender, chartsToRender } = useMemo(() => {
    if (search === '') {
      return { sectionsToRender: compareRunSections, chartsToRender: compareRunCharts };
    }

    const compareRunChartsFiltered = (compareRunCharts || []).filter((config: RunsChartsCardConfig) => {
      return !config.deleted && chartMatchesFilter(search, config);
    });
    // Get the sections that have these charts
    const sectionsWithCharts = new Set<string>();
    compareRunChartsFiltered.forEach((config: RunsChartsCardConfig) => {
      if (config.metricSectionId) {
        sectionsWithCharts.add(config.metricSectionId);
      }
    });
    // Filter the sections
    const compareRunSectionsFiltered = (compareRunSections || []).filter((sectionConfig: ChartSectionConfig) => {
      return sectionsWithCharts.has(sectionConfig.uuid);
    });

    return { sectionsToRender: compareRunSectionsFiltered, chartsToRender: compareRunChartsFiltered };
  }, [search, compareRunCharts, compareRunSections]);

  const isSearching = search !== '';

  if (!compareRunSections || !compareRunCharts) {
    return null;
  }

  if (noRunsSelected) {
    return (
      noRunsSelectedEmptyState ?? (
        <div css={{ marginTop: theme.spacing.lg }}>
          <Empty
            description={
              <FormattedMessage
                defaultMessage="All runs are hidden. Select at least one run to view charts."
                description="Experiment tracking > runs charts > indication displayed when no runs are selected for comparison"
              />
            }
          />
        </div>
      )
    );
  }

  if (isSearching && chartsToRender?.length === 0) {
    // Render empty in the center of the page
    return (
      <>
        <Spacer size="lg" />
        <Empty
          title={
            <FormattedMessage
              defaultMessage="No metric charts"
              description="Experiment page > compare runs > no metric charts"
            />
          }
          description={
            <FormattedMessage
              defaultMessage="All charts are filtered. Clear the search filter to see hidden metric charts."
              description="Experiment page > compare runs > no metric charts > description"
            />
          }
        />
      </>
    );
  }

  return (
    <div>
      <MetricChartsAccordion activeKey={activeKey} onActiveKeyChange={onActivePanelChange}>
        {(sectionsToRender || []).map((sectionConfig: ChartSectionConfig, index: number) => {
          const sectionCharts = (chartsToRender || []).filter((config: RunsChartsCardConfig) => {
            const section = (config as RunsChartsBarCardConfig).metricSectionId;
            return !config.deleted && section === sectionConfig.uuid;
          });

          return (
            <Accordion.Panel
              header={
                <RunsChartsSectionHeader
                  index={index}
                  section={sectionConfig}
                  onDeleteSection={deleteSection}
                  onAddSection={addSection}
                  editSection={editSection}
                  onSetEditSection={setEditSection}
                  onSetSectionName={setSectionName}
                  sectionChartsLength={sectionCharts.length}
                  addNewChartCard={addNewChartCard}
                  onSectionReorder={sectionReorder}
                  isExpanded={activeKey.includes(sectionConfig.uuid)}
                  supportedChartTypes={supportedChartTypes}
                  // When searching, hide the section placement controls
                  hideExtraControls={isSearching}
                />
              }
              key={sectionConfig.uuid}
              aria-hidden={!activeKey.includes(sectionConfig.uuid)}
            >
              <RunsChartsSection
                sectionId={sectionConfig.uuid}
                sectionConfig={sectionConfig}
                sectionCharts={sectionCharts}
                reorderCharts={reorderCharts}
                insertCharts={insertCharts}
                isMetricHistoryLoading={isMetricHistoryLoading}
                chartData={chartData}
                startEditChart={startEditChart}
                removeChart={removeChart}
                groupBy={groupBy}
                sectionIndex={index}
                setFullScreenChart={setFullScreenChart}
                autoRefreshEnabled={autoRefreshEnabled}
                hideEmptyCharts={hideEmptyCharts}
                globalLineChartConfig={globalLineChartConfig}
              />
            </Accordion.Panel>
          );
        })}
      </MetricChartsAccordion>
      {!isSearching && (
        <div>
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-compare_sections_runscomparesectionaccordion.tsx_405"
            block
            onClick={appendSection}
            icon={<PlusIcon />}
            style={{ border: 'none', marginTop: '6px' }}
          >
            <FormattedMessage
              defaultMessage="Add section"
              description="Experiment page > compare runs > chart section > add section bar"
            />
          </Button>
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

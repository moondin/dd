---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 526
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 526 of 991)

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

---[FILE: RunsChartsConfigure.common.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigure.common.tsx
Signals: React

```typescript
import {
  LegacySelect,
  SimpleSelect,
  SimpleSelectOption,
  SimpleSelectOptionGroup,
  Tag,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ComponentProps, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { makeCanonicalSortKey } from '../../../experiment-page/utils/experimentPage.common-utils';

/**
 * Represents a field in the compare run charts configuration modal.
 * Displays a title and content with proper margins.
 */
export const RunsChartsConfigureField = ({
  title,
  compact = false,
  children,
}: PropsWithChildren<{
  title: React.ReactNode;
  compact?: boolean;
}>) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{ marginBottom: compact ? theme.spacing.sm : theme.spacing.md * 2 }}
      data-testid="experiment-view-compare-runs-config-field"
    >
      <Typography.Title level={4}>{title}</Typography.Title>
      {children}
    </div>
  );
};

/**
 * A searchable select for selecting metric or param from a categorized list.
 */
export const RunsChartsMetricParamSelect = ({
  value,
  onChange,
  metricKeyList,
  paramKeyList,
}: {
  value: string;
  onChange: ComponentProps<typeof LegacySelect>['onChange'];
  metricKeyList?: string[];
  paramKeyList?: string[];
}) => {
  const { formatMessage } = useIntl();

  const isEmpty = !paramKeyList?.length && !metricKeyList?.length;

  return (
    <LegacySelect
      css={styles.selectFull}
      value={
        isEmpty
          ? formatMessage({
              description:
                'Message displayed when no metrics or params are available in the compare runs chart configure modal',
              defaultMessage: 'No metrics or parameters available',
            })
          : value
      }
      disabled={isEmpty}
      onChange={onChange}
      dangerouslySetAntdProps={{ showSearch: true }}
    >
      {metricKeyList?.length ? (
        <LegacySelect.OptGroup
          label={formatMessage({
            defaultMessage: 'Metrics',
            description: "Label for 'metrics' option group in the compare runs chart configure modal",
          })}
        >
          {metricKeyList.map((metric) => (
            <LegacySelect.Option
              key={makeCanonicalSortKey('METRIC', metric)}
              value={makeCanonicalSortKey('METRIC', metric)}
            >
              {metric}
            </LegacySelect.Option>
          ))}
        </LegacySelect.OptGroup>
      ) : null}
      {paramKeyList?.length ? (
        <LegacySelect.OptGroup
          label={formatMessage({
            defaultMessage: 'Params',
            description: "Label for 'params' option group in the compare runs chart configure modal",
          })}
        >
          {paramKeyList.map((param) => (
            <LegacySelect.Option
              key={makeCanonicalSortKey('PARAM', param)}
              value={makeCanonicalSortKey('PARAM', param)}
            >
              {param}
            </LegacySelect.Option>
          ))}
        </LegacySelect.OptGroup>
      ) : null}
    </LegacySelect>
  );
};

export const RunsChartsMetricParamSelectV2 = ({
  value,
  id,
  onChange,
  metricOptions = [],
  paramOptions = [],
}: {
  value: string;
  id: string;
  onChange: (value: string) => void;
  metricOptions: {
    key: string;
    datasetName: string | undefined;
    metricKey: string;
  }[];
  paramOptions: {
    key: string;
    paramKey: string;
  }[];
}) => {
  const { formatMessage } = useIntl();

  const isEmpty = !paramOptions.length && !metricOptions.length;

  return (
    <SimpleSelect
      componentId="mlflow.charts.chart_configure.metric_with_dataset_select"
      id={id}
      css={styles.selectFull}
      value={
        isEmpty
          ? formatMessage({
              description:
                'Message displayed when no metrics or params are available in the compare runs chart configure modal',
              defaultMessage: 'No metrics or parameters available',
            })
          : value
      }
      disabled={isEmpty}
      onChange={({ target }) => {
        onChange(target.value);
      }}
      contentProps={{
        matchTriggerWidth: true,
        maxHeight: 500,
      }}
    >
      {metricOptions?.length ? (
        <SimpleSelectOptionGroup
          label={formatMessage({
            defaultMessage: 'Metrics',
            description: "Label for 'metrics' option group in the compare runs chart configure modal",
          })}
        >
          {metricOptions.map(({ datasetName, key, metricKey }) => (
            <SimpleSelectOption key={key} value={key}>
              {datasetName && (
                <Tag componentId="mlflow.charts.chart_configure.metric_with_dataset_select.tag">{datasetName}</Tag>
              )}{' '}
              {metricKey}
            </SimpleSelectOption>
          ))}
        </SimpleSelectOptionGroup>
      ) : null}
      {paramOptions?.length ? (
        <SimpleSelectOptionGroup
          label={formatMessage({
            defaultMessage: 'Params',
            description: "Label for 'params' option group in the compare runs chart configure modal",
          })}
        >
          {paramOptions.map(({ key, paramKey }) => (
            <SimpleSelectOption key={key} value={key}>
              {paramKey}
            </SimpleSelectOption>
          ))}
        </SimpleSelectOptionGroup>
      ) : null}
    </SimpleSelect>
  );
};

export const runsChartsRunCountDefaultOptions: { value: number; label: React.ReactNode }[] = [
  // We're not using any procedural generation so react-intl extractor can parse it
  {
    value: 5,
    label: (
      <FormattedMessage
        defaultMessage="5"
        description="Label for 5 first runs visible in run count selector within runs compare configuration modal"
      />
    ),
  },
  {
    value: 10,
    label: (
      <FormattedMessage
        defaultMessage="10"
        description="Label for 10 first runs visible in run count selector within runs compare configuration modal"
      />
    ),
  },
  {
    value: 20,
    label: (
      <FormattedMessage
        defaultMessage="20"
        description="Label for 20 first runs visible in run count selector within runs compare configuration modal"
      />
    ),
  },
];

const styles = { selectFull: { width: '100%' } };
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureBarChart.preview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureBarChart.preview.tsx

```typescript
import { barChartCardDefaultMargin } from '../cards/RunsChartsBarChartCard';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { RunsMetricsBarPlot } from '../RunsMetricsBarPlot';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsBarCardConfig } from '../../runs-charts.types';

export const RunsChartsConfigureBarChartPreview = ({
  previewData,
  cardConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsBarCardConfig;
}) => {
  const { resetTooltip, setTooltip } = useRunsChartsTooltip(cardConfig);

  const dataKey = cardConfig.dataAccessKey ?? cardConfig.metricKey;

  return (
    <RunsMetricsBarPlot
      useDefaultHoverBox={false}
      displayRunNames={false}
      displayMetricKey={false}
      metricKey={dataKey}
      runsData={previewData}
      margin={barChartCardDefaultMargin}
      onHover={setTooltip}
      onUnhover={resetTooltip}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureBarChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureBarChart.tsx
Signals: React

```typescript
import { LegacySelect } from '@databricks/design-system';
import { useCallback, useEffect } from 'react';
import type {
  RunsChartsCardConfig,
  RunsChartsBarCardConfig,
  RunsChartsMetricByDatasetEntry,
} from '../../runs-charts.types';
import { RunsChartsConfigureField, runsChartsRunCountDefaultOptions } from './RunsChartsConfigure.common';
import { isEmpty } from 'lodash';
import { RunsChartsConfigureMetricWithDatasetSelect } from './RunsChartsConfigureMetricWithDatasetSelect';

/**
 * Form containing configuration controls for runs compare charts.
 */
export const RunsChartsConfigureBarChart = ({
  state,
  onStateChange,
  metricKeyList,
  metricKeysByDataset,
}: {
  metricKeyList: string[];
  metricKeysByDataset?: RunsChartsMetricByDatasetEntry[];
  state: Partial<RunsChartsBarCardConfig>;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsBarCardConfig) => void;
}) => {
  /**
   * Callback for updating metric key
   */
  const updateMetric = useCallback(
    (metricKey: string, datasetName?: string, dataAccessKey?: string) => {
      onStateChange((current) => ({ ...(current as RunsChartsBarCardConfig), metricKey, datasetName, dataAccessKey }));
    },
    [onStateChange],
  );

  /**
   * Callback for updating run count
   */
  const updateVisibleRunCount = useCallback(
    (runsCountToCompare: number) => {
      onStateChange((current) => ({
        ...(current as RunsChartsBarCardConfig),
        runsCountToCompare,
      }));
    },
    [onStateChange],
  );

  /**
   * If somehow metric key is not predetermined, automatically
   * select the first one so it's not empty
   */
  useEffect(() => {
    if (!state.metricKey && metricKeysByDataset?.[0]) {
      updateMetric(
        metricKeysByDataset[0].metricKey,
        metricKeysByDataset[0].datasetName,
        metricKeysByDataset[0].dataAccessKey,
      );
      return;
    }

    if (!state.metricKey && metricKeyList?.[0]) {
      updateMetric(metricKeyList[0]);
    }
  }, [state.metricKey, updateMetric, metricKeyList, metricKeysByDataset]);

  const emptyMetricsList = metricKeyList.length === 0;

  return (
    <>
      <RunsChartsConfigureField title="Metric">
        {!isEmpty(metricKeysByDataset) ? (
          <RunsChartsConfigureMetricWithDatasetSelect
            metricKeysByDataset={metricKeysByDataset}
            onChange={({ metricKey, datasetName, dataAccessKey }) =>
              updateMetric(metricKey, datasetName, dataAccessKey)
            }
            value={state.dataAccessKey ?? state.metricKey}
          />
        ) : (
          <LegacySelect
            css={styles.selectFull}
            value={emptyMetricsList ? 'No metrics available' : state.metricKey}
            onChange={(metricKey) => updateMetric(metricKey)}
            disabled={emptyMetricsList}
            dangerouslySetAntdProps={{ showSearch: true }}
          >
            {metricKeyList.map((metric) => (
              <LegacySelect.Option key={metric} value={metric} data-testid={`metric-${metric}`}>
                {metric}
              </LegacySelect.Option>
            ))}
          </LegacySelect>
        )}
      </RunsChartsConfigureField>
    </>
  );
};

const styles = { selectFull: { width: '100%' } };
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureContourChart.preview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureContourChart.preview.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { RunsContourPlot } from '../RunsContourPlot';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsContourCardConfig } from '../../runs-charts.types';

export const RunsChartsConfigureContourChartPreview = ({
  previewData,
  cardConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsContourCardConfig;
}) => {
  const { resetTooltip, setTooltip } = useRunsChartsTooltip(cardConfig);

  // We need to re-render the chart when any axis config changes.
  // Plotly tries to determine axis format based on values and is not capable
  // of dynamic switching between different axis types, so we need to make sure
  // that we re-mount the chart when config changes.
  const key = useMemo(() => {
    const { xaxis, yaxis, zaxis } = cardConfig;
    return JSON.stringify({ xaxis, yaxis, zaxis });
  }, [cardConfig]);

  return (
    <RunsContourPlot
      xAxis={cardConfig.xaxis}
      yAxis={cardConfig.yaxis}
      zAxis={cardConfig.zaxis}
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

---[FILE: RunsChartsConfigureContourChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureContourChart.tsx
Signals: React

```typescript
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  extractCanonicalSortKey,
  isCanonicalSortKeyOfType,
  makeCanonicalSortKey,
} from '../../../experiment-page/utils/experimentPage.common-utils';
import type { RunsChartsCardConfig, RunsChartsContourCardConfig } from '../../runs-charts.types';
import { RunsChartsMetricParamSelect, RunsChartsConfigureField } from './RunsChartsConfigure.common';

type ValidAxis = keyof Pick<RunsChartsContourCardConfig, 'xaxis' | 'yaxis' | 'zaxis'>;

/**
 * Form containing configuration controls for Contour runs compare chart.
 */
export const RunsChartsConfigureContourChart = ({
  state,
  onStateChange,
  metricKeyList,
  paramKeyList,
}: {
  metricKeyList: string[];
  paramKeyList: string[];
  state: RunsChartsContourCardConfig;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsContourCardConfig) => void;
}) => {
  const { formatMessage } = useIntl();
  const runSelectOptions = [5, 10, 20, 50, 100];

  /**
   * Callback for updating X or Y axis
   */
  const updateAxis = useCallback(
    (canonicalKey: string, axis: ValidAxis) => {
      const type = isCanonicalSortKeyOfType(canonicalKey, 'METRIC') ? 'METRIC' : 'PARAM';
      const key = extractCanonicalSortKey(canonicalKey, type);
      onStateChange((current) => ({
        ...(current as RunsChartsContourCardConfig),
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
        ...(current as RunsChartsContourCardConfig),
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
    if (!state.zaxis?.key) {
      if (firstMetric) {
        updateAxis(makeCanonicalSortKey('METRIC', firstMetric), 'zaxis');
      } else if (firstParam) {
        updateAxis(makeCanonicalSortKey('PARAM', firstParam), 'zaxis');
      }
    }
  }, [state.xaxis, state.yaxis, state.zaxis, updateAxis, metricKeyList, paramKeyList]);

  return (
    <>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'X axis',
          description: 'Label for X axis in Contour chart configurator in compare runs chart config modal',
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
          description: 'Label for Y axis in Contour chart configurator in compare runs chart config modal',
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
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'Z axis',
          description: 'Label for Z axis in Contour chart configurator in compare runs chart config modal',
        })}
      >
        <RunsChartsMetricParamSelect
          value={state.zaxis.key ? makeCanonicalSortKey(state.zaxis.type, state.zaxis.key) : ''}
          onChange={(value) => {
            updateAxis(value, 'zaxis');
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

---[FILE: RunsChartsConfigureDifferenceChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureDifferenceChart.tsx
Signals: React

```typescript
import {
  Checkbox,
  Input,
  Switch,
  useDesignSystemTheme,
  LegacyTooltip,
  InfoSmallIcon,
  LegacyInfoTooltip,
} from '@databricks/design-system';
import type { RunsChartsCardConfig, RunsChartsDifferenceCardConfig } from '../../runs-charts.types';
import { DISABLED_GROUP_WHEN_GROUPBY, DifferenceCardConfigCompareGroup } from '../../runs-charts.types';
import { RunsChartsConfigureField } from './RunsChartsConfigure.common';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';

/**
 * Form containing configuration controls for runs compare difference view chart.
 */
export const RunsChartsConfigureDifferenceChart = ({
  state,
  onStateChange,
  metricKeyList,
  paramKeyList,
  groupBy,
}: {
  metricKeyList: string[];
  paramKeyList: string[];
  state: Partial<RunsChartsDifferenceCardConfig>;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsDifferenceCardConfig) => void;
  groupBy: RunsGroupByConfig | null;
}) => {
  /**
   * Callback for updating compare groups
   */
  const updateCompareGroups = useCallback(
    (compareGroup: DifferenceCardConfigCompareGroup) => {
      onStateChange((current) => {
        const currentConfig = current as RunsChartsDifferenceCardConfig;
        const compareGroups = currentConfig.compareGroups;
        if (compareGroups.includes(compareGroup)) {
          return {
            ...(current as RunsChartsDifferenceCardConfig),
            compareGroups: compareGroups.filter((group) => group !== compareGroup),
          };
        } else {
          return { ...(current as RunsChartsDifferenceCardConfig), compareGroups: [...compareGroups, compareGroup] };
        }
      });
    },
    [onStateChange],
  );

  const updateChartName = useCallback(
    (e) => onStateChange((current) => ({ ...(current as RunsChartsDifferenceCardConfig), chartName: e.target.value })),
    [onStateChange],
  );

  const updateShowChangeFromBaseline = useCallback(
    (showChangeFromBaseline: boolean) =>
      onStateChange((current) => ({
        ...(current as RunsChartsDifferenceCardConfig),
        showChangeFromBaseline,
      })),
    [onStateChange],
  );

  const updateShowDifferencesOnly = useCallback(
    (showDifferencesOnly: boolean) =>
      onStateChange((current) => ({
        ...(current as RunsChartsDifferenceCardConfig),
        showDifferencesOnly,
      })),
    [onStateChange],
  );

  const { theme } = useDesignSystemTheme();
  const { formatMessage } = useIntl();

  return (
    <>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'Compare',
          description:
            'Runs charts > components > config > RunsChartsConfigureDifferenceChart > Compare config section',
        })}
      >
        <Checkbox.Group id="checkbox-group" defaultValue={state.compareGroups}>
          {Object.values(DifferenceCardConfigCompareGroup).map((group) => {
            const groupedCondition = groupBy ? DISABLED_GROUP_WHEN_GROUPBY.includes(group) : false;
            return (
              <div css={{ display: 'inline-flex', alignItems: 'center' }} key={group}>
                <Checkbox
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_config_runschartsconfiguredifferencechart.tsx_98"
                  key={group}
                  value={group}
                  isChecked={state.compareGroups?.includes(group)}
                  onChange={() => updateCompareGroups(group)}
                  disabled={groupedCondition}
                >
                  {group}
                </Checkbox>
                {groupedCondition && (
                  <LegacyInfoTooltip
                    title={
                      <FormattedMessage
                        defaultMessage="Disable grouped runs to compare"
                        description="Experiment tracking > components > runs-charts > RunsChartsConfigureDifferenceCharts > disable grouped runs info message"
                      />
                    }
                  />
                )}
              </div>
            );
          })}
        </Checkbox.Group>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            padding: `${theme.spacing.md}px 0px`,
            gap: theme.spacing.sm,
          }}
        >
          <Switch
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_config_runschartsconfiguredifferencechart.tsx_129"
            checked={state.showChangeFromBaseline}
            onChange={updateShowChangeFromBaseline}
            label={formatMessage({
              defaultMessage: 'Show change from baseline',
              description:
                'Runs charts > components > config > RunsChartsConfigureDifferenceChart > Show change from baseline toggle',
            })}
          />
          <Switch
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_config_runschartsconfiguredifferencechart.tsx_138"
            checked={state.showDifferencesOnly}
            onChange={updateShowDifferencesOnly}
            label={formatMessage({
              defaultMessage: 'Show differences only',
              description:
                'Runs charts > components > config > RunsChartsConfigureDifferenceChart > Show differences only toggle',
            })}
          />
        </div>
      </RunsChartsConfigureField>

      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'Chart name',
          description:
            'Runs charts > components > config > RunsChartsConfigureDifferenceChart > Chart name config section',
        })}
      >
        <Input
          componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_config_runschartsconfiguredifferencechart.tsx_157"
          value={state.chartName}
          onChange={updateChartName}
        />
      </RunsChartsConfigureField>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureImageChart.preview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureImageChart.preview.tsx

```typescript
import type { RunsGroupByConfig } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/utils/experimentPage.group-row-utils';
import type { RunsChartsCardConfig, RunsChartsImageCardConfig } from '../../runs-charts.types';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { ImageGridPlot } from '../charts/ImageGridPlot';
import { FormattedMessage } from 'react-intl';
import { Empty } from '@databricks/design-system';
import { LOG_IMAGE_TAG_INDICATOR } from '../../../../constants';

export const RunsChartsConfigureImageChartPreview = ({
  previewData,
  cardConfig,
  setCardConfig,
  groupBy,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsImageCardConfig;
  setCardConfig: (setter: (current: RunsChartsCardConfig) => RunsChartsImageCardConfig) => void;
  groupBy: RunsGroupByConfig | null;
}) => {
  const containsLoggedImages = previewData.some((run: RunsChartsRunData) => Boolean(run.tags[LOG_IMAGE_TAG_INDICATOR]));

  if (containsLoggedImages && cardConfig?.imageKeys?.length === 0) {
    return (
      <Empty
        title={
          <FormattedMessage
            defaultMessage="No images configured for preview"
            description="Title for the empty state when user did not configure any images for preview yet"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Please use controls on the left to select images to be compared"
            description="Description for the empty state when user did not configure any images for preview yet"
          />
        }
      />
    );
  }

  const chartBody = (
    <ImageGridPlot previewData={previewData} cardConfig={cardConfig} setCardConfig={setCardConfig} groupBy={groupBy} />
  );

  const cardBodyToRender = chartBody;

  return <div css={{ width: '100%', overflow: 'auto hidden' }}>{cardBodyToRender}</div>;
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureImageChart.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureImageChart.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import type { RunsChartsCardConfig, RunsChartsImageCardConfig } from '../../runs-charts.types';
import { Input } from '@databricks/design-system';
import { useIntl } from 'react-intl';
import { RunsChartsConfigureField } from './RunsChartsConfigure.common';
import { DialogCombobox } from '@databricks/design-system';
import { DialogComboboxContent } from '@databricks/design-system';
import { DialogComboboxTrigger } from '@databricks/design-system';
import { DialogComboboxOptionListCheckboxItem } from '@databricks/design-system';
import { DialogComboboxOptionList } from '@databricks/design-system';
import { useImageSliderStepMarks } from '../../hooks/useImageSliderStepMarks';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { LineSmoothSlider } from '@mlflow/mlflow/src/experiment-tracking/components/LineSmoothSlider';

export const RunsChartsConfigureImageChart = ({
  previewData,
  state,
  onStateChange,
  imageKeyList,
}: {
  previewData: RunsChartsRunData[];
  imageKeyList: string[];
  state: Partial<RunsChartsImageCardConfig>;
  onStateChange: (setter: (current: RunsChartsCardConfig) => RunsChartsImageCardConfig) => void;
}) => {
  const IMAGE_CONFIG_WIDTH = 275;

  const { stepMarks, maxMark, minMark } = useImageSliderStepMarks({
    data: previewData,
    selectedImageKeys: state.imageKeys || [],
  });

  const updateImageKeys = useCallback(
    (imageKeys: string[]) => {
      onStateChange((current) => {
        return { ...(current as RunsChartsImageCardConfig), imageKeys };
      });
    },
    [onStateChange],
  );

  const updateStep = useCallback(
    (step: number) => {
      onStateChange((current) => {
        return { ...(current as RunsChartsImageCardConfig), step };
      });
    },
    [onStateChange],
  );

  const { formatMessage } = useIntl();

  const handleUpdate = (imageKey: string) => {
    onStateChange((current) => {
      const currentConfig = current as RunsChartsImageCardConfig;
      if (currentConfig.imageKeys?.includes(imageKey)) {
        return {
          ...currentConfig,
          imageKeys: currentConfig.imageKeys?.filter((key) => key !== imageKey),
        };
      } else {
        return { ...currentConfig, imageKeys: [...(currentConfig.imageKeys || []), imageKey] };
      }
    });
  };

  const handleClear = () => {
    onStateChange((current) => {
      return { ...(current as RunsChartsImageCardConfig), imageKeys: [] };
    });
  };

  return (
    <>
      <RunsChartsConfigureField
        title={formatMessage({
          defaultMessage: 'Images',
          description: 'Runs charts > components > config > RunsChartsConfigureImageGrid > Images section',
        })}
      >
        <DialogCombobox
          componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_config_runschartsconfigureimagechart.tsx_84"
          value={state.imageKeys}
          label="Images"
          multiSelect
        >
          <DialogComboboxTrigger onClear={handleClear} minWidth={IMAGE_CONFIG_WIDTH} />
          <DialogComboboxContent matchTriggerWidth>
            <DialogComboboxOptionList>
              {imageKeyList.map((imageKey) => {
                return (
                  <DialogComboboxOptionListCheckboxItem
                    key={imageKey}
                    value={imageKey}
                    onChange={handleUpdate}
                    checked={state.imageKeys?.includes(imageKey)}
                  />
                );
              })}
            </DialogComboboxOptionList>
          </DialogComboboxContent>
        </DialogCombobox>
      </RunsChartsConfigureField>
      <RunsChartsConfigureField title="Step">
        <LineSmoothSlider
          max={maxMark}
          min={minMark}
          marks={stepMarks}
          value={state.step}
          disabled={Object.keys(stepMarks).length <= 1}
          onChange={updateStep}
        />
      </RunsChartsConfigureField>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunsChartsConfigureLineChart.preview.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/config/RunsChartsConfigureLineChart.preview.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import type { ReduxState } from '../../../../../redux-types';
import type { MetricHistoryByName } from '../../../../types';
import {
  RunsChartsLineChartXAxisType,
  removeOutliersFromMetricHistory,
  type RunsChartsRunData,
} from '../RunsCharts.common';
import { RunsMetricsLinePlot } from '../RunsMetricsLinePlot';
import { RunsChartsTooltipMode, useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import type { RunsChartsLineCardConfig } from '../../runs-charts.types';
import { RunsChartsLineChartYAxisType } from '../../runs-charts.types';
import { shouldEnableChartExpressions } from '../../../../../common/utils/FeatureUtils';
import { useSampledMetricHistory } from '../../hooks/useSampledMetricHistory';
import { compact, isUndefined, uniq } from 'lodash';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import { useGroupedChartRunData } from '../../../runs-compare/hooks/useGroupedChartRunData';
import type { RunsChartsGlobalLineChartConfig } from '../../../experiment-page/models/ExperimentPageUIState';
import { useLineChartGlobalConfig } from '../hooks/useLineChartGlobalConfig';
import { RunsChartCardLoadingPlaceholder } from '../cards/ChartCard.common';

const RunsChartsConfigureLineChartPreviewImpl = ({
  previewData,
  cardConfig,
  metricsByRunUuid,
  groupBy,
  globalLineChartConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsLineCardConfig;
  groupBy: RunsGroupByConfig | null;

  globalLineChartConfig?: RunsChartsGlobalLineChartConfig;

  metricsByRunUuid: Record<string, MetricHistoryByName>;
}) => {
  const { lineSmoothness, selectedXAxisMetricKey, xAxisKey } = useLineChartGlobalConfig(
    cardConfig,
    globalLineChartConfig,
  );

  const isGrouped = useMemo(() => previewData.some((r) => r.groupParentInfo), [previewData]);

  const { aggregateFunction } = groupBy || {};

  const runUuidsToFetch = useMemo(() => {
    if (isGrouped) {
      const runsInGroups = compact(previewData.map((r) => r.groupParentInfo)).flatMap((g) => g.runUuids);
      const ungroupedRuns = compact(
        previewData.filter((r) => !r.groupParentInfo && !r.belongsToGroup).map((r) => r.runInfo?.runUuid ?? undefined),
      );
      return [...runsInGroups, ...ungroupedRuns];
    }
    return compact(previewData.map((r) => r.runInfo)).map((g) => g.runUuid ?? '');
  }, [previewData, isGrouped]);

  const metricKeysToFetch = useMemo(() => {
    const getYAxisKeys = (cardConfig: RunsChartsLineCardConfig) => {
      const fallback = [cardConfig.metricKey];
      if (!shouldEnableChartExpressions() || cardConfig.yAxisKey !== RunsChartsLineChartYAxisType.EXPRESSION) {
        return cardConfig.selectedMetricKeys ?? fallback;
      }
      const yAxisKeys = cardConfig.yAxisExpressions?.reduce((acc, exp) => {
        exp.variables.forEach((variable) => acc.add(variable));
        return acc;
      }, new Set<string>());
      return yAxisKeys === undefined ? fallback : Array.from(yAxisKeys);
    };
    const yAxisKeys = getYAxisKeys(cardConfig);
    const xAxisKeys = !selectedXAxisMetricKey ? [] : [selectedXAxisMetricKey];
    return yAxisKeys.concat(xAxisKeys);
  }, [cardConfig, selectedXAxisMetricKey]);

  const { resultsByRunUuid, isLoading } = useSampledMetricHistory({
    runUuids: runUuidsToFetch,
    metricKeys: metricKeysToFetch,
    enabled: true,
    maxResults: 320,
    autoRefreshEnabled: false,
  });

  const sampledData = useMemo(
    () =>
      previewData.map((run) => {
        const metricsHistory = metricKeysToFetch.reduce((acc: MetricHistoryByName, key) => {
          const history = resultsByRunUuid[run.uuid]?.[key]?.metricsHistory;
          if (history) {
            acc[key] = cardConfig.ignoreOutliers ? removeOutliersFromMetricHistory(history) : history;
          }
          return acc;
        }, {});

        return {
          ...run,
          metricsHistory,
        };
      }),
    [metricKeysToFetch, resultsByRunUuid, previewData, cardConfig.ignoreOutliers],
  );

  const sampledGroupData = useGroupedChartRunData({
    enabled: isGrouped,
    ungroupedRunsData: sampledData,
    metricKeys: metricKeysToFetch,
    sampledDataResultsByRunUuid: resultsByRunUuid,
    aggregateFunction,
    selectedXAxisMetricKey: xAxisKey === RunsChartsLineChartXAxisType.METRIC ? selectedXAxisMetricKey : undefined,
    ignoreOutliers: cardConfig.ignoreOutliers ?? false,
  });

  // Use grouped data traces only if enabled and if there are any groups
  const chartData = isGrouped ? sampledGroupData : sampledData;

  const { setTooltip, resetTooltip } = useRunsChartsTooltip(
    cardConfig,
    RunsChartsTooltipMode.MultipleTracesWithScanline,
  );

  if (isLoading) {
    return <RunsChartCardLoadingPlaceholder />;
  }

  const checkValidRange = (
    rangeMin: number | undefined,
    rangeMax: number | undefined,
  ): [number, number] | undefined => {
    if (isUndefined(rangeMin) || isUndefined(rangeMax)) {
      return undefined;
    }
    return [rangeMin, rangeMax];
  };

  const xRange = checkValidRange(cardConfig.range?.xMin, cardConfig.range?.xMax);
  const yRange = checkValidRange(cardConfig.range?.yMin, cardConfig.range?.yMax);

  return (
    <RunsMetricsLinePlot
      runsData={chartData}
      metricKey={cardConfig.metricKey}
      selectedMetricKeys={cardConfig.selectedMetricKeys}
      scaleType={cardConfig.scaleType}
      xAxisScaleType={cardConfig.xAxisScaleType}
      lineSmoothness={lineSmoothness}
      xAxisKey={xAxisKey}
      selectedXAxisMetricKey={selectedXAxisMetricKey}
      displayPoints={cardConfig.displayPoints}
      yAxisExpressions={cardConfig.yAxisExpressions}
      yAxisKey={cardConfig.yAxisKey}
      useDefaultHoverBox={false}
      onHover={setTooltip}
      onUnhover={resetTooltip}
      xRange={xRange}
      yRange={yRange}
    />
  );
};

const mapStateToProps = ({ entities: { metricsByRunUuid } }: ReduxState) => ({
  metricsByRunUuid,
});

/**
 * Preview of line chart used in compare runs configuration modal
 */
export const RunsChartsConfigureLineChartPreview = connect(mapStateToProps, undefined, undefined, {
  areStatesEqual: (nextState, prevState) => nextState.entities.metricsByRunUuid === prevState.entities.metricsByRunUuid,
})(RunsChartsConfigureLineChartPreviewImpl);
```

--------------------------------------------------------------------------------

````

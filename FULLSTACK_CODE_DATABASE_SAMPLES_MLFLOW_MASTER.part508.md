---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 508
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 508 of 991)

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

---[FILE: RunViewMetricCharts.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.intg.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, screen, act, within, cleanup, waitFor } from '../../../common/utils/TestUtils.react18';
import { RunViewMetricCharts } from './RunViewMetricCharts';
import type { DeepPartial } from 'redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import type { ReduxState } from '../../../redux-types';
import { shouldEnableRunDetailsPageAutoRefresh } from '../../../common/utils/FeatureUtils';
import type { RunsMetricsLinePlotProps } from '../runs-charts/components/RunsMetricsLinePlot';
import LocalStorageUtils from '../../../common/utils/LocalStorageUtils';
import { Provider } from 'react-redux';
import { sampledMetricsByRunUuid } from '../../reducers/SampledMetricsReducer';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { latestMetricsByRunUuid, metricsByRunUuid } from '../../reducers/MetricReducer';
import { paramsByRunUuid, tagsByRunUuid } from '../../reducers/Reducers';
import { imagesByRunUuid } from '@mlflow/mlflow/src/experiment-tracking/reducers/ImageReducer';
import { fetchEndpoint } from '../../../common/utils/FetchUtils';
import { DesignSystemProvider } from '@databricks/design-system';

import userEventFactory from '@testing-library/user-event';
import invariant from 'invariant';
import { EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL } from '../../utils/MetricsUtils';
import { TestApolloProvider } from '../../../common/utils/TestApolloProvider';
import { MlflowService } from '../../sdk/MlflowService';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000); // increase timeout, it's an integration test with a lot of unmocked code

jest.mock('../runs-charts/components/RunsMetricsLinePlot', () => ({
  RunsMetricsLinePlot: ({ metricKey }: RunsMetricsLinePlotProps) => {
    return <div data-testid="test-line-plot">Line plot for {metricKey}</div>;
  },
}));

jest.mock('../runs-charts/hooks/useIsInViewport', () => ({
  useIsInViewport: jest.fn(() => ({ isInViewport: true, isInViewportDeferred: true, setElementRef: jest.fn() })),
}));

jest.mock('../../../common/utils/FetchUtils', () => ({
  fetchEndpoint: jest.fn(),
}));

const testRunUuid = 'test_run_uuid';
const testMetricKeys = ['metric_1', 'metric_2', 'system/gpu_1', 'system/gpu_2'];

const testReduxState: DeepPartial<ReduxState> = {
  entities: {
    sampledMetricsByRunUuid: {},
    latestMetricsByRunUuid: {},
    metricsByRunUuid: {},
    paramsByRunUuid: {},
    tagsByRunUuid: {},
    imagesByRunUuid: {},
  },
};

// Exclude setInterval because it's used by waitFor
jest.useFakeTimers({ doNotFake: ['setInterval'] });

const userEvent = userEventFactory.setup({
  advanceTimers: jest.advanceTimersByTime,
});

jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
  shouldEnableRunDetailsPageAutoRefresh: jest.fn(),
}));

const findChartByTitle = (title: string) => {
  const chartCardElement: HTMLElement | null = screen
    .getByRole('heading', { name: title })
    .closest('[data-testid="experiment-view-compare-runs-card"]');

  invariant(chartCardElement, 'Chart with metric2 should exist');

  return chartCardElement;
};

const getMetricKeyFromEndpointCall = (relativeUrl: string) => {
  const requestParams = new URLSearchParams(relativeUrl);
  return requestParams.get('metric_key');
};
const getLastFetchedMetric = () =>
  getMetricKeyFromEndpointCall(jest.mocked(fetchEndpoint).mock.lastCall?.[0].relativeUrl);

const getLastFetchedMetrics = () =>
  jest.mocked(fetchEndpoint).mock.calls.map((call) => getMetricKeyFromEndpointCall(call[0].relativeUrl));

describe('RunViewMetricCharts - autorefresh', () => {
  const waitForMetricsRequest = () => act(async () => jest.runOnlyPendingTimers());

  beforeEach(() => {
    jest.mocked(shouldEnableRunDetailsPageAutoRefresh).mockImplementation(() => true);
    jest.mocked(fetchEndpoint).mockImplementation(async ({ relativeUrl }) => {
      const requestedKey = getMetricKeyFromEndpointCall(relativeUrl);

      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              metrics: [{ key: requestedKey, run_id: testRunUuid, step: 1, timestamp: 100, value: 1 }],
            }),
          1000,
        ),
      );
    });

    jest.spyOn(MlflowService, 'listArtifacts').mockImplementation(() => Promise.resolve([]));

    jest.spyOn(LocalStorageUtils, 'getStoreForComponent').mockImplementation(
      () =>
        ({
          setItem: () => ({}),
          getItem: () =>
            JSON.stringify({
              isAccordionReordered: false,
              compareRunCharts: [
                {
                  type: 'LINE',
                  metricSectionId: 'section_id',
                  uuid: 'chart_id',
                  metricKey: 'metric_2',
                  scaleType: 'linear',
                  xAxisKey: 'step',
                  xAxisScaleType: 'linear',
                  range: {
                    xMin: undefined,
                    xMax: undefined,
                    yMin: undefined,
                    yMax: undefined,
                  },
                },
              ],
              compareRunSections: [
                {
                  uuid: 'section_id',
                  name: 'Model metrics',
                  display: true,
                },
              ],
              autoRefreshEnabled: true,
            }),
        } as any),
    );
  });
  const renderComponent = async ({
    mode = 'model',
    metricKeys = testMetricKeys,
    state = testReduxState,
  }: {
    mode?: 'model' | 'system';
    metricKeys?: string[];
    state?: any;
  } = {}) => {
    const runInfo = {
      runUuid: testRunUuid,
    } as any;

    const store = createStore(
      combineReducers({
        entities: combineReducers({
          sampledMetricsByRunUuid,
          latestMetricsByRunUuid,
          metricsByRunUuid,
          paramsByRunUuid,
          tagsByRunUuid,
          imagesByRunUuid,
        }),
      }),
      state,
      applyMiddleware(thunk, promiseMiddleware()),
    );

    await act(async () => {
      render(<RunViewMetricCharts runInfo={runInfo} metricKeys={metricKeys} mode={mode} />, {
        wrapper: ({ children }) => (
          <DesignSystemProvider>
            <TestApolloProvider>
              <Provider store={store}>
                <IntlProvider locale="en">{children}</IntlProvider>
              </Provider>
            </TestApolloProvider>
          </DesignSystemProvider>
        ),
      });
    });
  };

  it('renders a chart for metric_2, adds a new one and auto-refreshes the results', async () => {
    // Render the component and wait for metrics
    await renderComponent({ mode: 'system' });

    // The initial call for metrics should be sent
    expect(fetchEndpoint).toHaveBeenCalledTimes(1);
    expect(getLastFetchedMetric()).toEqual('metric_2');

    // Wait for the metrics to be fetched
    await waitForMetricsRequest();

    // Wait for the auto-refresh interval
    await act(async () => {
      jest.advanceTimersByTime(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL);
    });

    await waitFor(() => {
      // The next call for metrics should be sent
      expect(fetchEndpoint).toHaveBeenCalledTimes(2);
      expect(getLastFetchedMetric()).toEqual('metric_2');
    });

    // Wait for the metrics to be fetched
    await waitForMetricsRequest();

    // Wait for some time (less than full auto refresh interval)
    await act(async () => {
      jest.advanceTimersByTime(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL / 2);
    });

    await waitFor(() => {
      // We should get no new calls
      expect(fetchEndpoint).toHaveBeenCalledTimes(2);
      expect(getLastFetchedMetric()).toEqual('metric_2');
    });

    // Add a new chart. By default, "metric_1" should be selected so we add a chart with "metric_1"
    await userEvent.click(screen.getByRole('button', { name: 'Add chart' }));
    await userEvent.click(screen.getByRole('menuitem', { name: /Line chart/ }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add chart' }));

    await waitFor(() => {
      // We should immediately get a new call
      expect(fetchEndpoint).toHaveBeenCalledTimes(3);
      expect(getLastFetchedMetric()).toEqual('metric_1');
    });

    // Wait for the metrics to be fetched
    await waitForMetricsRequest();

    // Wait for the remainder of the auto-refresh interval
    await act(async () => {
      jest.advanceTimersByTime(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL / 2);
    });

    await waitFor(() => {
      expect(fetchEndpoint).toHaveBeenCalledTimes(4);
      // We should have a call for original metric
      expect(getLastFetchedMetric()).toEqual('metric_2');
    });

    // Wait for the full auto-refresh interval
    await act(async () => {
      jest.advanceTimersByTime(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL);
    });

    await waitFor(() => {
      // We should have two more calls - one for metric_2 and one for metric_1
      expect(fetchEndpoint).toHaveBeenCalledTimes(6);
      expect(getLastFetchedMetrics().slice(-2)).toEqual(expect.arrayContaining(['metric_2', 'metric_1']));
    });

    // Remove "metric_1" chart
    await userEvent.click(within(findChartByTitle('metric_1')).getByTestId('experiment-view-compare-runs-card-menu'));
    await userEvent.click(screen.getByRole('menuitem', { name: /Delete/ }));

    // Wait for the metrics to be fetched after chart is deleted
    await waitForMetricsRequest();

    // Wait for the full auto-refresh interval
    await act(async () => {
      jest.advanceTimersByTime(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL);
    });

    // The next call for "metric_2" should be sent but none for "metric_1"
    await waitFor(() => {
      expect(fetchEndpoint).toHaveBeenCalledTimes(7);
      expect(getLastFetchedMetric()).toEqual('metric_2');
    });

    // Ummount the component
    cleanup();

    // Wait for 10 full auto-refresh intervals
    await act(async () => {
      jest.advanceTimersByTime(10 * EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL);
    });

    // We should get no new calls
    expect(fetchEndpoint).toHaveBeenCalledTimes(7);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewMetricCharts.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import { render, screen, cleanup, act, waitFor } from '../../../common/utils/TestUtils.react18';
import { RunViewMetricCharts } from './RunViewMetricCharts';
import { DeepPartial } from 'redux';
import { ReduxState } from '../../../redux-types';
import { type RunsChartsBarChartCardProps } from '../runs-charts/components/cards/RunsChartsBarChartCard';
import type { RunsChartsLineChartCardProps } from '../runs-charts/components/cards/RunsChartsLineChartCard';
import userEvent from '@testing-library/user-event';
import type { MetricEntitiesByName } from '../../types';
import type { KeyValueEntity } from '../../../common/types';
import { DesignSystemProvider } from '@databricks/design-system';
import { MlflowService } from '../../sdk/MlflowService';
import { LOG_IMAGE_TAG_INDICATOR } from '../../constants';

// Mock plot components, as they are not relevant to this test and would hog a lot of resources
jest.mock('../runs-charts/components/cards/RunsChartsBarChartCard', () => ({
  RunsChartsBarChartCard: ({ config }: RunsChartsBarChartCardProps) => (
    <div data-testid="test-bar-plot">Bar plot for {config.metricKey}</div>
  ),
}));
jest.mock('../runs-charts/components/cards/RunsChartsLineChartCard', () => ({
  RunsChartsLineChartCard: ({ config }: RunsChartsLineChartCardProps) => {
    return <div data-testid="test-line-plot">Line plot for {config.metricKey}</div>;
  },
}));

// Mock useIsInViewport hook to simulate that the chart element is in the viewport
jest.mock('../runs-charts/hooks/useIsInViewport', () => ({
  useIsInViewport: () => ({ isInViewport: true, setElementRef: jest.fn() }),
}));

const testRunUuid = 'test_run_uuid';
const testMetricKeys = ['metric_1', 'metric_2', 'system/gpu_1', 'system/gpu_2'];

const testMetrics: MetricEntitiesByName = {
  metric_1: {
    key: 'metric_1',
    step: 0,
    timestamp: 0,
    value: 1000,
  },
  metric_2: {
    key: 'metric_2',
    step: 5,
    timestamp: 0,
    value: 2000,
  },
  'system/gpu_1': {
    key: 'system/gpu_1',
    step: 10,
    timestamp: 10,
    value: 2000,
  },
  'system/gpu_2': {
    key: 'system/gpu_1',
    step: 10,
    timestamp: 10,
    value: 2000,
  },
};

describe('RunViewMetricCharts', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(MlflowService, 'listArtifacts').mockImplementation(() => Promise.resolve([]));
  });
  const renderComponent = ({
    mode = 'model',
    metricKeys = testMetricKeys,
    metrics = testMetrics,
    tags = {},
  }: {
    mode?: 'model' | 'system';
    metricKeys?: string[];
    metrics?: MetricEntitiesByName;
    tags?: Record<string, KeyValueEntity>;
  } = {}) => {
    const runInfo = {
      runUuid: testRunUuid,
    } as any;
    return render(
      <RunViewMetricCharts runInfo={runInfo} metricKeys={metricKeys} mode={mode} latestMetrics={metrics} tags={tags} />,
      {
        wrapper: ({ children }) => (
          <DesignSystemProvider>
            <MockedReduxStoreProvider state={{ entities: { sampledMetricsByRunUuid: {}, imagesByRunUuid: {} } }}>
              <IntlProvider locale="en">{children}</IntlProvider>
            </MockedReduxStoreProvider>
          </DesignSystemProvider>
        ),
      },
    );
  };

  it('renders bar charts for two model metrics', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Bar plot for metric_1')).toBeInTheDocument();
    });
    expect(screen.getByText('Line plot for metric_2')).toBeInTheDocument();

    expect(screen.queryAllByTestId('test-bar-plot')).toHaveLength(1);
    expect(screen.queryAllByTestId('test-line-plot')).toHaveLength(1);
  });

  it('renders line charts for two system metrics', async () => {
    renderComponent({ mode: 'system' });

    await waitFor(() => {
      expect(screen.getByText('Line plot for system/gpu_1')).toBeInTheDocument();
    });

    expect(screen.getByText('Line plot for system/gpu_2')).toBeInTheDocument();

    expect(screen.queryAllByTestId('test-bar-plot')).toHaveLength(0);
    expect(screen.queryAllByTestId('test-line-plot')).toHaveLength(2);
  });

  it('renders no charts when there are no metric keys configured', async () => {
    renderComponent({
      mode: 'system',
      metricKeys: [],
      metrics: {},
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId('test-bar-plot')).toHaveLength(0);
      expect(screen.queryAllByTestId('test-line-plot')).toHaveLength(0);

      expect(screen.getByText('No charts in this section')).toBeInTheDocument();
    });
  });

  it('filters metric charts by name (regexp)', async () => {
    jest.useFakeTimers();
    const userEventWithTimers = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderComponent();
    expect(screen.getByText('Bar plot for metric_1')).toBeInTheDocument();
    expect(screen.getByText('Line plot for metric_2')).toBeInTheDocument();

    // Filter out one particular chart using regexp
    // Note: in RTL, we need to use [[ to represent [
    await userEventWithTimers.type(screen.getByRole('searchbox'), 'm.tric_[[2]$');

    // Wait for filter input debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByText('Line plot for metric_2')).toBeInTheDocument();
    expect(screen.queryByText('Bar plot for metric_1')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('adds new charts and sections when new metrics are detected', async () => {
    renderComponent();
    // Assert charts for base metrics only
    await waitFor(() => {
      expect(screen.getByText('Bar plot for metric_1')).toBeInTheDocument();
    });

    expect(screen.getByText('Line plot for metric_2')).toBeInTheDocument();
    expect(screen.queryByText(/plot for metric_3/)).not.toBeInTheDocument();
    expect(screen.queryByText(/plot for metric_4/)).not.toBeInTheDocument();

    // Ummount the component
    cleanup();

    const newMetrics = {
      ...testMetrics,
      metric_3: {
        key: 'metric_3',
        step: 5,
        timestamp: 0,
        value: 1000,
      },
      metric_4: {
        key: 'metric_4',
        step: 0,
        timestamp: 0,
        value: 1000,
      },
      'custom-prefix/test-metric': {
        key: 'custom-prefix/test-metric',
        step: 0,
        timestamp: 0,
        value: 1000,
      },
    };

    renderComponent({
      metrics: newMetrics,
    });

    // Assert new charts
    await waitFor(() => {
      expect(screen.getByText('Line plot for metric_3')).toBeInTheDocument();
    });
    expect(screen.getByText('Bar plot for metric_4')).toBeInTheDocument();
    expect(screen.getByText('Bar plot for custom-prefix/test-metric')).toBeInTheDocument();

    // Assert new section
    expect(screen.getByText('custom-prefix')).toBeInTheDocument();
  });

  it('adds should not call for image artifacts when `mlflow.loggedImages` tag is not set', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Model metrics')).toBeInTheDocument();
    });

    expect(MlflowService.listArtifacts).not.toHaveBeenCalled();
  });

  it('adds should call for image artifacts when `mlflow.loggedImages` tag is set', async () => {
    renderComponent({
      tags: {
        [LOG_IMAGE_TAG_INDICATOR]: {
          key: LOG_IMAGE_TAG_INDICATOR,
          value: 'true',
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Model metrics')).toBeInTheDocument();
    });

    expect(MlflowService.listArtifacts).toHaveBeenCalledWith({ path: 'images', run_uuid: 'test_run_uuid' });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunViewMetricCharts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewMetricCharts.tsx
Signals: React, Redux/RTK

```typescript
import { TableSkeleton, ToggleButton, useDesignSystemTheme } from '@databricks/design-system';
import { compact, mapValues, values } from 'lodash';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../redux-types';
import type { MetricEntitiesByName, RunInfoEntity } from '../../types';
import type { KeyValueEntity } from '../../../common/types';

import { RunsChartsTooltipWrapper } from '../runs-charts/hooks/useRunsChartsTooltip';
import { RunViewChartTooltipBody } from './RunViewChartTooltipBody';
import { RunsChartType, RunsChartsCardConfig } from '../runs-charts/runs-charts.types';
import type { RunsChartsRunData } from '../runs-charts/components/RunsCharts.common';
import { RunsChartsLineChartXAxisType } from '../runs-charts/components/RunsCharts.common';
import type { ExperimentRunsChartsUIConfiguration } from '../experiment-page/models/ExperimentPageUIState';
import { RunsChartsSectionAccordion } from '../runs-charts/components/sections/RunsChartsSectionAccordion';
import { RunsChartsConfigureModal } from '../runs-charts/components/RunsChartsConfigureModal';
import {
  RunsChartsUIConfigurationContextProvider,
  useConfirmChartCardConfigurationFn,
  useInsertRunsChartsFn,
  useRemoveRunsChartFn,
  useReorderRunsChartsFn,
} from '../runs-charts/hooks/useRunsChartsUIConfiguration';
import {
  LOG_IMAGE_TAG_INDICATOR,
  MLFLOW_MODEL_METRIC_NAME,
  MLFLOW_SYSTEM_METRIC_NAME,
  MLFLOW_SYSTEM_METRIC_PREFIX,
} from '../../constants';
import LocalStorageUtils from '../../../common/utils/LocalStorageUtils';
import { RunsChartsFullScreenModal } from '../runs-charts/components/RunsChartsFullScreenModal';
import { useIsTabActive } from '../../../common/hooks/useIsTabActive';
import { shouldEnableRunDetailsPageAutoRefresh } from '../../../common/utils/FeatureUtils';
import { usePopulateImagesByRunUuid } from '../experiment-page/hooks/usePopulateImagesByRunUuid';
import type { UseGetRunQueryResponseRunInfo } from './hooks/useGetRunQuery';
import { RunsChartsGlobalChartSettingsDropdown } from '../runs-charts/components/RunsChartsGlobalChartSettingsDropdown';
import { RunsChartsDraggableCardsGridContextProvider } from '../runs-charts/components/RunsChartsDraggableCardsGridContext';
import { RunsChartsFilterInput } from '../runs-charts/components/RunsChartsFilterInput';

interface RunViewMetricChartsProps {
  metricKeys: string[];
  runInfo: RunInfoEntity | UseGetRunQueryResponseRunInfo;
  /**
   * Whether to display model or system metrics. This affects labels and tooltips.
   */
  mode: 'model' | 'system';

  latestMetrics?: MetricEntitiesByName;
  tags?: Record<string, KeyValueEntity>;
  params?: Record<string, KeyValueEntity>;
}

/**
 * Component displaying metric charts for a single run
 */
const RunViewMetricChartsImpl = ({
  runInfo,
  metricKeys,
  mode,
  chartUIState,
  updateChartsUIState,
  latestMetrics = {},
  params = {},
  tags = {},
}: RunViewMetricChartsProps & {
  chartUIState: ExperimentRunsChartsUIConfiguration;
  updateChartsUIState: (
    stateSetter: (state: ExperimentRunsChartsUIConfiguration) => ExperimentRunsChartsUIConfiguration,
  ) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const [search, setSearch] = useState('');
  const { formatMessage } = useIntl();

  const { compareRunCharts, compareRunSections, chartsSearchFilter } = chartUIState;

  // For the draggable grid layout, we filter visible cards on this level
  const visibleChartCards = useMemo(() => {
    return compareRunCharts?.filter((chart) => !chart.deleted) ?? [];
  }, [compareRunCharts]);

  const [fullScreenChart, setFullScreenChart] = useState<
    | {
        config: RunsChartsCardConfig;
        title: string | ReactNode;
        subtitle: ReactNode;
      }
    | undefined
  >(undefined);

  const metricsForRun = useSelector(({ entities }: ReduxState) => {
    return mapValues(entities.sampledMetricsByRunUuid[runInfo.runUuid ?? ''], (metricsByRange) => {
      return compact(
        values(metricsByRange)
          .map(({ metricsHistory }) => metricsHistory)
          .flat(),
      );
    });
  });

  const tooltipContextValue = useMemo(() => ({ runInfo, metricsForRun }), [runInfo, metricsForRun]);

  const { imagesByRunUuid } = useSelector((state: ReduxState) => ({
    imagesByRunUuid: state.entities.imagesByRunUuid,
  }));

  const [configuredCardConfig, setConfiguredCardConfig] = useState<RunsChartsCardConfig | null>(null);

  const reorderCharts = useReorderRunsChartsFn();

  const addNewChartCard = (metricSectionId: string) => (type: RunsChartType) =>
    setConfiguredCardConfig(RunsChartsCardConfig.getEmptyChartCardByType(type, false, undefined, metricSectionId));

  const insertCharts = useInsertRunsChartsFn();

  const startEditChart = (chartCard: RunsChartsCardConfig) => setConfiguredCardConfig(chartCard);

  const removeChart = useRemoveRunsChartFn();

  const confirmChartCardConfiguration = useConfirmChartCardConfigurationFn();

  const submitForm = (configuredCard: Partial<RunsChartsCardConfig>) => {
    confirmChartCardConfiguration(configuredCard);

    // Hide the modal
    setConfiguredCardConfig(null);
  };

  // Create a single run data object to be used in charts
  const chartData: RunsChartsRunData[] = useMemo(
    () => [
      {
        displayName: runInfo.runName ?? '',
        metrics: latestMetrics,
        params,
        tags,
        images: imagesByRunUuid[runInfo.runUuid ?? ''] || {},
        metricHistory: {},
        uuid: runInfo.runUuid ?? '',
        color: theme.colors.primary,
        runInfo,
      },
    ],
    [runInfo, latestMetrics, params, tags, imagesByRunUuid, theme],
  );

  useEffect(() => {
    if ((!compareRunSections || !compareRunCharts) && chartData.length > 0) {
      const { resultChartSet, resultSectionSet } = RunsChartsCardConfig.getBaseChartAndSectionConfigs({
        runsData: chartData,
        enabledSectionNames: [mode === 'model' ? MLFLOW_MODEL_METRIC_NAME : MLFLOW_SYSTEM_METRIC_NAME],
        // Filter only model or system metrics
        filterMetricNames: (name) => {
          const isSystemMetric = name.startsWith(MLFLOW_SYSTEM_METRIC_PREFIX);
          return mode === 'model' ? !isSystemMetric : isSystemMetric;
        },
      });

      updateChartsUIState((current) => ({
        ...current,
        compareRunCharts: resultChartSet,
        compareRunSections: resultSectionSet,
      }));
    }
  }, [compareRunCharts, compareRunSections, chartData, mode, updateChartsUIState]);

  /**
   * Update charts with the latest metrics if new are found
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
        // Filter only model or system metrics
        filterMetricNames: (name) => {
          const isSystemMetric = name.startsWith(MLFLOW_SYSTEM_METRIC_PREFIX);
          return mode === 'model' ? !isSystemMetric : isSystemMetric;
        },
      });

      if (!isResultUpdated) {
        return current;
      }
      return {
        ...current,
        compareRunCharts: resultChartSet,
        compareRunSections: resultSectionSet,
      };
    });
  }, [chartData, updateChartsUIState, mode]);

  const isTabActive = useIsTabActive();
  const autoRefreshEnabled = chartUIState.autoRefreshEnabled && shouldEnableRunDetailsPageAutoRefresh() && isTabActive;

  // Determine if run contains images logged by `mlflow.log_image()`
  const containsLoggedImages = Boolean(tags[LOG_IMAGE_TAG_INDICATOR]);

  usePopulateImagesByRunUuid({
    runUuids: [runInfo.runUuid ?? ''],
    runUuidsIsActive: [runInfo.status === 'RUNNING'],
    autoRefreshEnabled,
    enabled: containsLoggedImages,
  });

  return (
    <div
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        css={{
          paddingBottom: theme.spacing.md,
          display: 'flex',
          gap: theme.spacing.sm,
          flex: '0 0 auto',
        }}
      >
        <RunsChartsFilterInput chartsSearchFilter={chartsSearchFilter} />
        {shouldEnableRunDetailsPageAutoRefresh() && (
          <ToggleButton
            componentId="codegen_mlflow_app_src_experiment-tracking_components_run-page_runviewmetricchartsv2.tsx_244"
            pressed={chartUIState.autoRefreshEnabled}
            onPressedChange={(pressed) => {
              updateChartsUIState((current) => ({ ...current, autoRefreshEnabled: pressed }));
            }}
          >
            {formatMessage({
              defaultMessage: 'Auto-refresh',
              description: 'Run page > Charts tab > Auto-refresh toggle button',
            })}
          </ToggleButton>
        )}
        <RunsChartsGlobalChartSettingsDropdown
          metricKeyList={metricKeys}
          globalLineChartConfig={chartUIState.globalLineChartConfig}
          updateUIState={updateChartsUIState}
        />
      </div>
      <div
        css={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        <RunsChartsTooltipWrapper contextData={tooltipContextValue} component={RunViewChartTooltipBody}>
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
              supportedChartTypes={[RunsChartType.LINE, RunsChartType.BAR, RunsChartType.IMAGE]}
              setFullScreenChart={setFullScreenChart}
              autoRefreshEnabled={autoRefreshEnabled}
              globalLineChartConfig={chartUIState.globalLineChartConfig}
              groupBy={null}
            />
          </RunsChartsDraggableCardsGridContextProvider>
        </RunsChartsTooltipWrapper>
      </div>
      {configuredCardConfig && (
        <RunsChartsConfigureModal
          chartRunData={chartData}
          metricKeyList={metricKeys}
          paramKeyList={[]}
          config={configuredCardConfig}
          onSubmit={submitForm}
          onCancel={() => setConfiguredCardConfig(null)}
          groupBy={null}
          supportedChartTypes={[RunsChartType.LINE, RunsChartType.BAR, RunsChartType.IMAGE]}
          globalLineChartConfig={chartUIState.globalLineChartConfig}
        />
      )}
      <RunsChartsFullScreenModal
        fullScreenChart={fullScreenChart}
        onCancel={() => setFullScreenChart(undefined)}
        chartData={chartData}
        tooltipContextValue={tooltipContextValue}
        tooltipComponent={RunViewChartTooltipBody}
        autoRefreshEnabled={autoRefreshEnabled}
        groupBy={null}
      />
    </div>
  );
};

export const RunViewMetricCharts = (props: RunViewMetricChartsProps) => {
  const persistenceIdentifier = `${props.runInfo.runUuid}-${props.mode}`;

  const localStore = useMemo(
    () => LocalStorageUtils.getStoreForComponent('RunPage', persistenceIdentifier),
    [persistenceIdentifier],
  );

  const [chartUIState, updateChartsUIState] = useState<ExperimentRunsChartsUIConfiguration>(() => {
    const defaultChartState: ExperimentRunsChartsUIConfiguration = {
      isAccordionReordered: false,
      compareRunCharts: undefined,
      compareRunSections: undefined,
      // Auto-refresh is enabled by default only if the flag is set
      autoRefreshEnabled: shouldEnableRunDetailsPageAutoRefresh(),
      globalLineChartConfig: {
        xAxisKey: RunsChartsLineChartXAxisType.STEP,
        lineSmoothness: 0,
        selectedXAxisMetricKey: '',
      },
    };
    try {
      const persistedChartState = localStore.getItem('chartUIState');

      if (!persistedChartState) {
        return defaultChartState;
      }
      return JSON.parse(persistedChartState);
    } catch {
      return defaultChartState;
    }
  });

  useEffect(() => {
    localStore.setItem('chartUIState', JSON.stringify(chartUIState));
  }, [chartUIState, localStore]);

  return (
    <RunsChartsUIConfigurationContextProvider updateChartsUIState={updateChartsUIState}>
      <RunViewMetricChartsImpl {...props} chartUIState={chartUIState} updateChartsUIState={updateChartsUIState} />
    </RunsChartsUIConfigurationContextProvider>
  );
};

const RunViewMetricChartsSkeleton = ({ className }: { className?: string }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '200px',
        gap: theme.spacing.md,
      }}
      className={className}
    >
      {new Array(6).fill(null).map((_, index) => (
        <TableSkeleton key={index} lines={5} seed={index.toString()} />
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewModeSwitch.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/run-page/RunViewModeSwitch.tsx
Signals: React

```typescript
import { LegacyTabs, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import { RunPageTabName } from '../../constants';
import { useRunViewActiveTab } from './useRunViewActiveTab';
import { useState } from 'react';
import type { KeyValueEntity } from '../../../common/types';

// Set of tabs that when active, the margin of the tab selector should be removed for better displaying
const TABS_WITHOUT_MARGIN = [RunPageTabName.ARTIFACTS, RunPageTabName.EVALUATIONS];

/**
 * Mode switcher for the run details page.
 */
export const RunViewModeSwitch = ({ runTags }: { runTags: Record<string, KeyValueEntity> }) => {
  const { experimentId, runUuid } = useParams<{ runUuid: string; experimentId: string }>();
  const navigate = useNavigate();
  const { theme } = useDesignSystemTheme();
  const currentTab = useRunViewActiveTab();
  const [removeTabMargin, setRemoveTabMargin] = useState(TABS_WITHOUT_MARGIN.includes(currentTab));

  const onTabChanged = (newTabKey: string) => {
    if (!experimentId || !runUuid || currentTab === newTabKey) {
      return;
    }

    setRemoveTabMargin(TABS_WITHOUT_MARGIN.includes(newTabKey as RunPageTabName));

    if (newTabKey === RunPageTabName.OVERVIEW) {
      navigate(Routes.getRunPageRoute(experimentId, runUuid));
      return;
    }
    navigate(Routes.getRunPageTabRoute(experimentId, runUuid, newTabKey));
  };

  return (
    // @ts-expect-error TS(2322)
    <LegacyTabs activeKey={currentTab} onChange={onTabChanged} tabBarStyle={{ margin: removeTabMargin && '0px' }}>
      <LegacyTabs.TabPane
        tab={
          <FormattedMessage defaultMessage="Overview" description="Run details page > tab selector > overview tab" />
        }
        key={RunPageTabName.OVERVIEW}
      />

      <LegacyTabs.TabPane
        tab={
          <FormattedMessage
            defaultMessage="Model metrics"
            description="Run details page > tab selector > Model metrics tab"
          />
        }
        key={RunPageTabName.MODEL_METRIC_CHARTS}
      />
      <LegacyTabs.TabPane
        tab={
          <FormattedMessage
            defaultMessage="System metrics"
            description="Run details page > tab selector > Model metrics tab"
          />
        }
        key={RunPageTabName.SYSTEM_METRIC_CHARTS}
      />
      <LegacyTabs.TabPane
        tab={<FormattedMessage defaultMessage="Traces" description="Run details page > tab selector > Traces tab" />}
        key={RunPageTabName.EVALUATIONS}
      />
      <LegacyTabs.TabPane
        tab={
          <FormattedMessage defaultMessage="Artifacts" description="Run details page > tab selector > artifacts tab" />
        }
        key={RunPageTabName.ARTIFACTS}
      />
    </LegacyTabs>
  );
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 448
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 448 of 991)

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

---[FILE: MetricChartsAccordion.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricChartsAccordion.tsx
Signals: React

```typescript
import { Accordion, useDesignSystemTheme } from '@databricks/design-system';
import type { CSSObject } from '@emotion/react';
import { css } from '@emotion/react';
import { useMemo } from 'react';

export const METRIC_CHART_SECTION_HEADER_SIZE = 55;

interface MetricChartsAccordionProps {
  activeKey?: string | string[];
  onActiveKeyChange?: (key: string | string[]) => void;
  children: React.ReactNode;
  disableCollapse?: boolean;
}

const MetricChartsAccordion = ({
  activeKey,
  onActiveKeyChange,
  children,
  disableCollapse = false,
}: MetricChartsAccordionProps) => {
  const { theme, getPrefixedClassName } = useDesignSystemTheme();
  const clsPrefix = getPrefixedClassName('collapse');

  const styles = useMemo(() => {
    const classItem = `.${clsPrefix}-item`;
    const classItemActive = `${classItem}-active`;
    const classHeader = `.${clsPrefix}-header`;
    const classContent = `.${clsPrefix}-content`;
    const classContentBox = `.${clsPrefix}-content-box`;
    const classArrow = `.${clsPrefix}-arrow`;

    const styles: CSSObject = {
      [classContent]: {
        padding: '0px !important',
        backgroundColor: 'transparent !important',
      },

      [classContentBox]: {
        padding: '0 0 12px 0px !important',
        backgroundColor: 'transparent !important',
      },

      [`& > ${classItem} > ${classHeader} > ${classArrow}`]: {
        fontSize: theme.general.iconSize,
        left: 12,
        // TODO: This is needed currently because the rotated icon isn't centered, remove when accordion is fixed
        verticalAlign: '-7px',
        transform: 'rotate(-90deg)',
        display: disableCollapse ? 'none' : undefined,
      },

      [`& > ${classItemActive} > ${classHeader} > ${classArrow}`]: {
        transform: 'rotate(0deg)',
      },

      [classHeader]: {
        display: 'flex',
        color: theme.colors.textPrimary,
        fontWeight: 600,
        alignItems: 'center',

        '&:focus-visible': {
          outlineColor: `${theme.colors.primary} !important`,
          outlineStyle: 'auto !important',
        },
      },

      [`& > ${classItem}`]: {
        borderBottom: `1px solid ${theme.colors.border}`,
        borderRadius: 0,
      },

      [`& > ${classItem} > ${classHeader}`]: {
        padding: 0,
        lineHeight: '20px',
        height: METRIC_CHART_SECTION_HEADER_SIZE,
      },
    };
    return styles;
  }, [theme, clsPrefix, disableCollapse]);

  return (
    <Accordion
      componentId="codegen_mlflow_app_src_experiment-tracking_components_metricchartsaccordion.tsx_82"
      {...(activeKey ? { activeKey } : {})}
      {...(onActiveKeyChange ? { onChange: onActiveKeyChange } : {})}
      dangerouslyAppendEmotionCSS={css(styles)}
      dangerouslySetAntdProps={{ expandIconPosition: 'left' }}
    >
      {children}
    </Accordion>
  );
};

export default MetricChartsAccordion;
```

--------------------------------------------------------------------------------

---[FILE: MetricPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricPage.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import { MetricPageImpl, MetricPage } from './MetricPage';
import NotFoundPage from './NotFoundPage';
import { mountWithIntl } from '../../common/utils/TestUtils.enzyme';
import Utils from '../../common/utils/Utils';

describe('MetricPage', () => {
  let wrapper;
  let instance;
  let minimalProps: any;
  let commonProps: any;
  let minimalStore: any;

  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    minimalProps = {
      dispatch: jest.fn(),
      location: {
        search: '?runs=[]&metric="metricKey"',
      },
    };
    commonProps = {
      ...minimalProps,
      experimentIds: [0],
    };

    minimalStore = mockStore({
      entities: {},
      apis: jest.fn((key) => {
        return {};
      }),
    });
  });

  test('should render with minimal props without exploding', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <MetricPage {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    ).find(MetricPage);
    expect(wrapper.length).toBe(1);
  });

  test('should render NotFoundPage when runs are not in query parameters', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <MetricPage {...commonProps} />
        </MemoryRouter>
      </Provider>,
    ).find(MetricPage);

    instance = wrapper.find(MetricPageImpl).instance();
    expect(instance.renderPageContent().type).toBe(NotFoundPage);
  });

  test('should not render NotFoundPage when runs are provided in query parameters', () => {
    const props = {
      ...commonProps,
      location: {
        search:
          '?runs=["a"]&metric="primary_metric_key"&experiment=0&plot_metric_keys=["metric_1","metric_2"]&plot_layout={}',
      },
    };
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <MetricPage {...props} />
        </MemoryRouter>
      </Provider>,
    ).find(MetricPage);

    instance = wrapper.find(MetricPageImpl).instance();
    expect(instance.renderPageContent().type).not.toBe(NotFoundPage);
  });

  test('should display global error notification when query parameters are invalid', () => {
    jest.spyOn(Utils, 'displayGlobalErrorNotification').mockImplementation(() => {});
    const props = {
      ...commonProps,
      location: {
        search: '?xyz=abc',
      },
    };
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <MetricPage {...props} />
        </MemoryRouter>
      </Provider>,
    ).find(MetricPage);

    expect(wrapper.find(MetricPage).html()).toContain('Error during metric page load: invalid URL');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: MetricPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricPage.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { rest } from 'msw';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { setupTestRouter, testRoute, TestRouter } from '../../common/utils/RoutingTestUtils';
import { setupServer } from '../../common/utils/setup-msw';
import { render, screen, waitFor } from '../../common/utils/TestUtils.react18';
import MetricPage from './MetricPage';
import { DesignSystemProvider } from '@databricks/design-system';
import { apis } from '../reducers/Reducers';

// We care only about the MetricPage component, so we mock the inner components
jest.mock('./MetricView', () => ({
  MetricView: () => <div>view loaded successfully</div>,
}));

describe('MetricPage', () => {
  const { history } = setupTestRouter();
  const server = setupServer();

  const mockSuccessExperimentsResponse = () => {
    return rest.get('/ajax-api/2.0/mlflow/experiments/get', (req, res, ctx) => {
      return res(ctx.json({ experiment: { experiment_id: 123, name: 'experiment1' } }));
    });
  };

  const mockSuccessRunsResponse = () =>
    rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
      return res(ctx.json({ run: { info: { run_id: 'run123', run_uuid: 'run123', runName: 'run123' }, data: {} } }));
    });

  const renderTestComponent = (
    initialRoute = '/?runs=%5B"run123"%5D&metric="test_mean_absolute_error"&experiments=%5B"123"%5D&plot_metric_keys=%5B"test_mean_absolute_error"%5D&plot_layout=%7B"autosize"%3Atrue%2C"xaxis"%3A%7B%7D%2C"yaxis"%3A%7B%7D%7D&x_axis=relative&y_axis_scale=linear&line_smoothness=1&show_point=false&deselected_curves=%5B%5D&last_linear_y_axis_range=%5B%5D&o=123',
  ) => {
    const store = createStore(
      combineReducers({
        apis,
      }),
      applyMiddleware(thunk, promiseMiddleware()),
    );

    render(<MetricPage />, {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <DesignSystemProvider>
            <IntlProvider locale="en">
              <TestRouter
                routes={[testRoute(<>{children}</>, '/')]}
                history={history}
                initialEntries={[initialRoute]}
              />
            </IntlProvider>
          </DesignSystemProvider>
        </Provider>
      ),
    });
  };
  test('should render mocked view content when everything loads successfully', async () => {
    server.use(mockSuccessExperimentsResponse(), mockSuccessRunsResponse());
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText('view loaded successfully')).toBeVisible();
    });
  });

  describe('Error states', () => {
    beforeEach(() => {
      // Avoid flooding console with expected errors
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should render error when URL is malformed', async () => {
      renderTestComponent('/?blah=bleh');

      await waitFor(() => {
        expect(screen.getByText('Error during metric page load: invalid URL')).toBeVisible();
      });
    });

    test('should render relevant error when runs fail to load', async () => {
      server.use(
        mockSuccessExperimentsResponse(),
        rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
          return res(ctx.json({ error_code: 'RESOURCE_DOES_NOT_EXIST', message: 'Run not found' }), ctx.status(404));
        }),
      );

      renderTestComponent();

      await waitFor(() => {
        expect(screen.getByText('Error while loading metric page')).toBeVisible();
      });

      expect(screen.getByText('Run not found')).toBeVisible();
    });

    test('should render relevant error when experiment fail to load', async () => {
      server.use(
        mockSuccessRunsResponse(),
        rest.get('/ajax-api/2.0/mlflow/experiments/get', (req, res, ctx) => {
          return res(
            ctx.json({ error_code: 'RESOURCE_DOES_NOT_EXIST', message: 'Experiment not found' }),
            ctx.status(404),
          );
        }),
      );

      renderTestComponent();

      await waitFor(() => {
        expect(screen.getByText('Error while loading metric page')).toBeVisible();
      });

      expect(screen.getByText('Experiment not found')).toBeVisible();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: MetricPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricPage.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import { getExperimentApi, getRunApi } from '../actions';
import RequestStateWrapper from '../../common/components/RequestStateWrapper';
import NotFoundPage from './NotFoundPage';
import { MetricView } from './MetricView';
import { getUUID } from '../../common/utils/ActionUtils';
import { PageContainer } from '../../common/components/PageContainer';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';
import Utils from '../../common/utils/Utils';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { DangerIcon, Empty } from '@databricks/design-system';

type MetricPageImplProps = {
  runUuids: string[];
  metricKey: string;
  experimentIds?: string[];
  dispatch: (...args: any[]) => any;
  loadError?: unknown;
  intl: IntlShape;
};

export class MetricPageImpl extends Component<MetricPageImplProps> {
  requestIds: any;

  constructor(props: MetricPageImplProps) {
    super(props);
    this.requestIds = [];
  }

  fetchExperiments() {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    return this.props.experimentIds.map((experimentId) => {
      const experimentRequestId = getUUID();
      this.props.dispatch(getExperimentApi(experimentId, experimentRequestId)).catch((e: Error | ErrorWrapper) => {
        if (e instanceof ErrorWrapper) {
          // Async API errors are handled by the RequestStateWrapper
          return;
        }
        throw e;
      });
      return experimentRequestId;
    });
  }

  componentDidMount() {
    if (this.props.loadError instanceof Error) {
      const message = this.props.intl.formatMessage({
        defaultMessage: 'Error during metric page load: invalid URL',
        description: 'Error message when loading metric page fails',
      });
      throw new Error(message);
    }
    if (this.props.experimentIds !== null) {
      const getExperimentsRequestIds = this.fetchExperiments();
      this.requestIds.push(...getExperimentsRequestIds);
    }
    this.props.runUuids.forEach((runUuid) => {
      // Fetch tags for each run. TODO: it'd be nice if we could just fetch the tags directly
      const getRunRequestId = getUUID();
      this.requestIds.push(getRunRequestId);
      this.props.dispatch(getRunApi(runUuid, getRunRequestId)).catch((e: Error | ErrorWrapper) => {
        if (e instanceof ErrorWrapper) {
          // Async API errors are handled by the RequestStateWrapper
          return;
        }
        throw e;
      });
    });
  }

  renderPageContent() {
    const { runUuids } = this.props;
    return runUuids.length >= 1 ? (
      <MetricView
        runUuids={this.props.runUuids}
        metricKey={this.props.metricKey}
        experimentIds={this.props.experimentIds}
      />
    ) : (
      <NotFoundPage />
    );
  }

  render() {
    return (
      <PageContainer>
        <RequestStateWrapper
          requestIds={this.requestIds}
          // eslint-disable-next-line no-trailing-spaces
          customRequestErrorHandlerFn={(failedRequests) => {
            const firstFoundError = failedRequests.find((request) => request.error)?.error;
            if (firstFoundError instanceof ErrorWrapper) {
              // Extract and throw actual Error based on the ErrorWrapper
              throw firstFoundError.translateToErrorInstance();
            }
            if (firstFoundError) {
              throw firstFoundError;
            }
          }}
        >
          {this.renderPageContent()}
        </RequestStateWrapper>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: any, ownProps: WithRouterNextProps<{ metricKey: string }>) => {
  const { location } = ownProps;
  const searchValues = qs.parse(location.search);
  try {
    // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
    const runUuids = JSON.parse(searchValues['?runs']);
    // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
    const metricKey = JSON.parse(searchValues['metric']);
    let experimentIds = null;
    if (searchValues.hasOwnProperty('experiments')) {
      // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
      experimentIds = JSON.parse(searchValues['experiments']);
    }

    return {
      runUuids,
      metricKey,
      experimentIds,
    };
  } catch (e) {
    return {
      runUuids: [],
      metricKey: '',
      experimentIds: [],
      loadError: e,
    };
  }
};

const MetricPageWithRouter = withRouterNext(connect(mapStateToProps)(injectIntl(MetricPageImpl)));

const MetricPageErrorPage = ({ error }: { error: Error }) => (
  <div css={{ height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
    <Empty
      title={
        <FormattedMessage
          defaultMessage="Error while loading metric page"
          description="Title of the error state on the metric page"
        />
      }
      description={error.message}
      image={<DangerIcon />}
    />
  </div>
);

export const MetricPage = withErrorBoundary(
  ErrorUtils.mlflowServices.EXPERIMENTS,
  MetricPageWithRouter,
  undefined,
  MetricPageErrorPage,
);

export default MetricPage;
```

--------------------------------------------------------------------------------

---[FILE: MetricsPlotControls.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricsPlotControls.enzyme.test.tsx

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import { shallowWithInjectIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { MetricsPlotControls, X_AXIS_RELATIVE } from './MetricsPlotControls';
import { CHART_TYPE_BAR, CHART_TYPE_LINE } from './MetricsPlotPanel';

describe('unit tests', () => {
  let wrapper;
  const minimalPropsForLineChart = {
    distinctMetricKeys: ['metric_0', 'metric_1'],
    selectedMetricKeys: ['metric_0'],
    selectedXAxis: X_AXIS_RELATIVE,
    handleXAxisChange: jest.fn(),
    handleShowPointChange: jest.fn(),
    handleMetricsSelectChange: jest.fn(),
    handleYAxisLogScaleChange: jest.fn(),
    handleLineSmoothChange: jest.fn(),
    chartType: CHART_TYPE_LINE,
    initialLineSmoothness: 1,
    yAxisLogScale: true,
    xAxis: X_AXIS_RELATIVE,
    onLayoutChange: jest.fn(),
    showPoint: false,
    numRuns: 1,
    numCompletedRuns: 1,
    handleDownloadCsv: jest.fn(),
  };
  const minimalPropsForBarChart = { ...minimalPropsForLineChart, chartType: CHART_TYPE_BAR };

  test('should render with minimal props without exploding', () => {
    wrapper = shallowWithInjectIntl(<MetricsPlotControls {...minimalPropsForLineChart} />);
    expect(wrapper.length).toBe(1);
    wrapper = shallowWithInjectIntl(<MetricsPlotControls {...minimalPropsForBarChart} />);
    expect(wrapper.length).toBe(1);
  });

  test('should show x-axis controls for line chart', () => {
    wrapper = shallowWithInjectIntl(<MetricsPlotControls {...minimalPropsForLineChart} />);
    expect(wrapper.find('[data-testid="show-point-toggle"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="smoothness-toggle"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="x-axis-radio"]')).toHaveLength(3);
  });

  test('should not show x-axis controls for bar chart', () => {
    wrapper = shallowWithInjectIntl(<MetricsPlotControls {...minimalPropsForBarChart} />);
    expect(wrapper.find('[data-testid="show-point-toggle"]')).toHaveLength(0);
    expect(wrapper.find('[data-testid="smoothness-toggle"]')).toHaveLength(0);
    expect(wrapper.find('[data-testid="x-axis-radio"]')).toHaveLength(0);
  });

  test('should hide smoothness controls when disabled', () => {
    wrapper = shallowWithInjectIntl(
      // @ts-expect-error TS(2322): Type '{ disableSmoothnessControl: true; distinctMe... Remove this comment to see the full error message
      <MetricsPlotControls {...minimalPropsForLineChart} disableSmoothnessControl />,
    );
    expect(wrapper.find('[data-testid="smoothness-toggle"]')).toHaveLength(0);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: MetricsPlotControls.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricsPlotControls.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { Button, LegacySelect, Switch, Tooltip, Radio, QuestionMarkIcon } from '@databricks/design-system';
import { Progress } from '../../common/components/Progress';
import { CHART_TYPE_LINE } from './MetricsPlotPanel';
import { EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL } from '../utils/MetricsUtils';

import { FormattedMessage, injectIntl } from 'react-intl';
import { LineSmoothSlider } from './LineSmoothSlider';

const RadioGroup = Radio.Group;
export const X_AXIS_WALL = 'wall';
export const X_AXIS_STEP = 'step';
export const X_AXIS_RELATIVE = 'relative';
export const MAX_LINE_SMOOTHNESS = 100;

type Props = {
  distinctMetricKeys: string[];
  selectedMetricKeys: string[];
  selectedXAxis: string;
  handleXAxisChange: (...args: any[]) => any;
  handleShowPointChange: (...args: any[]) => any;
  handleMetricsSelectChange: (...args: any[]) => any;
  handleYAxisLogScaleChange: (...args: any[]) => any;
  handleLineSmoothChange: (value: number) => void;
  chartType: string;
  lineSmoothness: number;
  yAxisLogScale: boolean;
  showPoint: boolean;
  intl: {
    formatMessage: (...args: any[]) => any;
  };
  numRuns: number;
  numCompletedRuns: number;
  handleDownloadCsv: (...args: any[]) => any;
  disableSmoothnessControl: boolean;
};

class MetricsPlotControlsImpl extends React.Component<Props> {
  static defaultProps = {
    disableSmoothnessControl: false,
  };

  handleMetricsSelectFilterChange = (text: any, option: any) =>
    option.props.title.toUpperCase().includes(text.toUpperCase());

  getAllMetricKeys = () => {
    const { distinctMetricKeys } = this.props;
    return distinctMetricKeys.map((metricKey) => ({
      title: metricKey,
      value: metricKey,
      key: metricKey,
    }));
  };

  render() {
    const { chartType, yAxisLogScale, lineSmoothness, showPoint, numRuns, numCompletedRuns, disableSmoothnessControl } =
      this.props;

    const lineSmoothnessTooltipText = (
      <FormattedMessage
        // eslint-disable-next-line max-len
        defaultMessage='Make the line between points "smoother" based on Exponential Moving Average. Smoothing can be useful for displaying the overall trend when the logging frequency is high.'
        description="Helpful tooltip message to help with line smoothness for the metrics plot"
      />
    );
    const completedRunsTooltipText = (
      <FormattedMessage
        // eslint-disable-next-line max-len
        defaultMessage="MLflow UI automatically fetches metric histories for active runs and updates the metrics plot with a {interval} second interval."
        description="Helpful tooltip message to explain the automatic metrics plot update"
        values={{ interval: Math.round(EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL / 1000) }}
      />
    );
    return (
      <div
        className="plot-controls"
        css={[styles.controlsWrapper, chartType === CHART_TYPE_LINE && styles.centeredControlsWrapper]}
      >
        {chartType === CHART_TYPE_LINE ? (
          <div>
            <div className="inline-control">
              <div className="control-label">
                <FormattedMessage
                  defaultMessage="Completed Runs"
                  description="Label for the progress bar to show the number of completed runs"
                />{' '}
                <Tooltip
                  componentId="mlflow.experiment-tracking.metrics-plot-controls.reset"
                  content={completedRunsTooltipText}
                >
                  <span>
                    <QuestionMarkIcon />
                  </span>
                </Tooltip>
                <Progress
                  percent={Math.round((100 * numCompletedRuns) / numRuns)}
                  format={() => `${numCompletedRuns}/${numRuns}`}
                />
              </div>
            </div>
            <div className="inline-control">
              <div className="control-label">
                <FormattedMessage
                  defaultMessage="Points:"
                  // eslint-disable-next-line max-len
                  description="Label for the toggle button to toggle to show points or not for the metric experiment run"
                />
              </div>
              <Switch
                componentId="codegen_mlflow_app_src_experiment-tracking_components_metricsplotcontrols.tsx_120"
                data-testid="show-point-toggle"
                defaultChecked={showPoint}
                onChange={this.props.handleShowPointChange}
              />
            </div>
            {!disableSmoothnessControl && (
              <div className="block-control">
                <div className="control-label">
                  <FormattedMessage
                    defaultMessage="Line Smoothness"
                    description="Label for the smoothness slider for the graph plot for metrics"
                  />{' '}
                  <Tooltip
                    componentId="mlflow.experiment-tracking.metrics-plot-controls.save"
                    content={lineSmoothnessTooltipText}
                  >
                    <span>
                      <QuestionMarkIcon />
                    </span>
                  </Tooltip>
                </div>
                <LineSmoothSlider
                  data-testid="smoothness-toggle"
                  min={1}
                  max={MAX_LINE_SMOOTHNESS}
                  onChange={this.props.handleLineSmoothChange}
                  value={lineSmoothness}
                />
              </div>
            )}
            <div className="block-control">
              <div className="control-label">
                <FormattedMessage
                  defaultMessage="X-axis:"
                  // eslint-disable-next-line max-len
                  description="Label for the radio button to toggle the control on the X-axis of the metric graph for the experiment"
                />
              </div>
              <RadioGroup
                componentId="codegen_mlflow_app_src_experiment-tracking_components_metricsplotcontrols.tsx_154"
                name="metrics-plot-x-axis-radio-group"
                css={styles.xAxisControls}
                onChange={this.props.handleXAxisChange}
                value={this.props.selectedXAxis}
              >
                <Radio value={X_AXIS_STEP} data-testid="x-axis-radio">
                  <FormattedMessage
                    defaultMessage="Step"
                    // eslint-disable-next-line max-len
                    description="Radio button option to choose the step control option for the X-axis for metric graph on the experiment runs"
                  />
                </Radio>
                <Radio value={X_AXIS_WALL} data-testid="x-axis-radio">
                  <FormattedMessage
                    defaultMessage="Time (Wall)"
                    // eslint-disable-next-line max-len
                    description="Radio button option to choose the time wall control option for the X-axis for metric graph on the experiment runs"
                  />
                </Radio>
                <Radio value={X_AXIS_RELATIVE} data-testid="x-axis-radio">
                  <FormattedMessage
                    defaultMessage="Time (Relative)"
                    // eslint-disable-next-line max-len
                    description="Radio button option to choose the time relative control option for the X-axis for metric graph on the experiment runs"
                  />
                </Radio>
              </RadioGroup>
            </div>
          </div>
        ) : null}
        <div className="block-control">
          <div className="control-label">
            <FormattedMessage
              defaultMessage="Y-axis:"
              // eslint-disable-next-line max-len
              description="Label where the users can choose the metric of the experiment run to be plotted on the Y-axis"
            />
          </div>
          <LegacySelect
            placeholder={this.props.intl.formatMessage({
              defaultMessage: 'Please select metric',
              description:
                // eslint-disable-next-line max-len
                'Placeholder text where one can select metrics from the list of available metrics to render on the graph',
            })}
            value={this.props.selectedMetricKeys}
            onChange={this.props.handleMetricsSelectChange}
            mode="multiple"
            css={styles.axisSelector}
          >
            {this.getAllMetricKeys().map((key) => (
              <LegacySelect.Option value={key.value} key={key.key}>
                {key.title}
              </LegacySelect.Option>
            ))}
          </LegacySelect>
        </div>
        <div className="inline-control">
          <div className="control-label">
            <FormattedMessage
              defaultMessage="Y-axis Log Scale:"
              // eslint-disable-next-line max-len
              description="Label for the radio button to toggle the Log scale on the Y-axis of the metric graph for the experiment"
            />
          </div>
          <Switch
            componentId="codegen_mlflow_app_src_experiment-tracking_components_metricsplotcontrols.tsx_220"
            defaultChecked={yAxisLogScale}
            onChange={this.props.handleYAxisLogScaleChange}
          />
        </div>
        <div className="inline-control">
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_metricsplotcontrols.tsx_222"
            css={{
              textAlign: 'justify',
              textAlignLast: 'left',
            }}
            onClick={this.props.handleDownloadCsv}
          >
            <FormattedMessage
              defaultMessage="Download data"
              // eslint-disable-next-line max-len
              description="String for the download csv button to download metrics from this run offline in a CSV format"
            />
            <i className="fa fa-download" />
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  xAxisControls: (theme: any) => ({
    label: { marginTop: theme.spacing.xs, marginBottom: theme.spacing.xs },
  }),
  controlsWrapper: { minWidth: '20%', maxWidth: '30%' },
  axisSelector: { width: '100%' },
  centeredControlsWrapper: {
    // Make controls aligned to plotly line chart
    justifyContent: 'center',
  },
};

// @ts-expect-error TS(2769): No overload matches this call.
export const MetricsPlotControls = injectIntl(MetricsPlotControlsImpl);
```

--------------------------------------------------------------------------------

````

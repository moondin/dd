---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 444
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 444 of 991)

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

---[FILE: CompareRunPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunPage.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import qs from 'qs';
import { connect } from 'react-redux';
import { getRunApi, getExperimentApi } from '../actions';
import RequestStateWrapper from '../../common/components/RequestStateWrapper';
import CompareRunView from './CompareRunView';
import { getUUID } from '../../common/utils/ActionUtils';
import { PageContainer } from '../../common/components/PageContainer';
import { withRouterNext } from '../../common/utils/withRouterNext';
import type { WithRouterNextProps } from '../../common/utils/withRouterNext';
import { withErrorBoundary } from '../../common/utils/withErrorBoundary';
import ErrorUtils from '../../common/utils/ErrorUtils';
import type { ErrorWrapper } from '../../common/utils/ErrorWrapper';
import { DangerIcon, Empty, Spinner } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import Utils from '../../common/utils/Utils';
import { FallbackProps } from 'react-error-boundary';

type CompareRunPageProps = {
  experimentIds: string[];
  runUuids: string[];
  urlDecodeError?: boolean;
  dispatch: (...args: any[]) => any;
};

class CompareRunPageImpl extends Component<CompareRunPageProps> {
  requestIds: any;

  constructor(props: CompareRunPageProps) {
    super(props);
    this.requestIds = [];
  }

  state: {
    requestError?: Error | ErrorWrapper;
  } = {
    requestError: undefined,
  };

  fetchExperiments() {
    return this.props.experimentIds.map((experimentId) => {
      const experimentRequestId = getUUID();
      this.props
        .dispatch(getExperimentApi(experimentId, experimentRequestId))
        .catch((requestError: Error | ErrorWrapper) => this.setState({ requestError }));
      return experimentRequestId;
    });
  }

  componentDidMount() {
    this.requestIds.push(...this.fetchExperiments());
    this.props.runUuids.forEach((runUuid) => {
      const requestId = getUUID();
      this.requestIds.push(requestId);

      this.props.dispatch(getRunApi(runUuid, requestId)).catch((requestError: Error | ErrorWrapper) => {
        this.setState({ requestError });
      });
    });
  }

  render() {
    // If the error is set, throw it to be caught by the error boundary
    if (this.state.requestError) {
      const { requestError } = this.state;
      const errorToThrow = requestError instanceof Error ? requestError : new Error(requestError.getMessageField?.());
      throw errorToThrow;
    }
    return (
      <PageContainer>
        <RequestStateWrapper
          // We suppress throwing error by RequestStateWrapper since we handle it using component and error boundary
          suppressErrorThrow
          requestIds={this.requestIds}
        >
          <CompareRunView runUuids={this.props.runUuids} experimentIds={this.props.experimentIds} />
        </RequestStateWrapper>
      </PageContainer>
    );
  }
}

/**
 * When integrated via IFrame in Kubeflow it re-encodes the URI (sometimes multiple times), leading to an unparsable JSON.
 * This function decodes the URI until it is parsable.
 */
const decodeURI = (uri: string): string => {
  const decodedURI = decodeURIComponent(uri);
  if (uri !== decodedURI) {
    return decodeURI(decodedURI);
  }
  return decodedURI;
};

const mapStateToProps = (state: any, ownProps: WithRouterNextProps) => {
  try {
    const { location } = ownProps;
    const locationSearchDecoded = decodeURI(location.search);
    const searchValues = qs.parse(locationSearchDecoded);
    // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
    const runUuids = JSON.parse(searchValues['?runs']);
    // @ts-expect-error TS(2345): Argument of type 'string | string[] | ParsedQs | P... Remove this comment to see the full error message
    const experimentIds = JSON.parse(searchValues['experiments']);
    return { experimentIds, runUuids };
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new SyntaxError(`Error while parsing URL: ${e.message}`);
    }

    throw e;
  }
};

const CompareRunPageErrorFallback = ({ error }: { error: Error }) => (
  <div css={{ height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
    <Empty
      title={
        <FormattedMessage
          defaultMessage="Error while loading compare runs page"
          description="Title of the error state on the run compare page"
        />
      }
      description={error.message}
      image={<DangerIcon />}
    />
  </div>
);

const CompareRunPage = withRouterNext(connect(mapStateToProps)(CompareRunPageImpl));

export default withErrorBoundary(
  ErrorUtils.mlflowServices.RUN_TRACKING,
  CompareRunPage,
  undefined,
  CompareRunPageErrorFallback,
);
```

--------------------------------------------------------------------------------

---[FILE: CompareRunPlotContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunPlotContainer.tsx

```typescript
import type { Theme } from '@emotion/react';

interface CompareRunPlotContainerProps {
  controls: React.ReactNode;
}

export const CompareRunPlotContainer = (props: React.PropsWithChildren<CompareRunPlotContainerProps>) => (
  <div css={styles.wrapper}>
    <div css={styles.controls}>{props.controls}</div>
    <div css={styles.plotWrapper}>{props.children}</div>
  </div>
);

const styles = {
  plotWrapper: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    minHeight: 450,
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 1fr) 3fr',
  },
  controls: (theme: Theme) => ({
    padding: `0 ${theme.spacing.xs}px`,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: CompareRunScatter.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunScatter.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { mount } from 'enzyme';
import { Metric, Param } from '../sdk/MlflowMessages';
import { CompareRunScatter, CompareRunScatterImpl } from './CompareRunScatter';
import { ArtifactNode } from '../utils/ArtifactUtils';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

describe('CompareRunScatter', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStoreRaw: any;
  let minimalStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  beforeEach(() => {
    minimalProps = {
      runUuids: ['uuid-1234-5678-9012', 'uuid-1234-5678-9013'],
      runDisplayNames: ['Run 9012', 'Run 9013'],
    };
    minimalStoreRaw = {
      entities: {
        runInfosByUuid: {
          'uuid-1234-5678-9012': {
            runUuid: 'uuid-1234-5678-9012',
            experimentId: '12345',
            userId: 'me@me.com',
            status: 'RUNNING',
            startTime: 12345678990,
            endTime: 12345678999,
            artifactUri: 'dbfs:/databricks/abc/uuid-1234-5678-9012',
            lifecycleStage: 'active',
          },
          'uuid-1234-5678-9013': {
            runUuid: 'uuid-1234-5678-9013',
            experimentId: '12345',
            userId: 'me@me.com',
            status: 'RUNNING',
            startTime: 12345678990,
            endTime: 12345678999,
            artifactUri: 'dbfs:/databricks/abc/uuid-1234-5678-9013',
            lifecycleStage: 'active',
          },
        },
        artifactsByRunUuid: {
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          'uuid-1234-5678-9012': new ArtifactNode(true),
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
          'uuid-1234-5678-9013': new ArtifactNode(true),
        },
        experimentsById: {
          12345: {
            experimentId: 12345,
            name: 'my experiment',
            artifactLocation: 'dbfs:/databricks/abc',
            lifecycleStage: 'active',
            lastUpdateTime: 12345678999,
            creationTime: 12345678900,
            tags: [],
          },
        },
        tagsByRunUuid: {
          'uuid-1234-5678-9012': {},
          'uuid-1234-5678-9013': {},
        },
        paramsByRunUuid: {
          'uuid-1234-5678-9012': {},
          'uuid-1234-5678-9013': {},
        },
        latestMetricsByRunUuid: {
          'uuid-1234-5678-9012': {},
          'uuid-1234-5678-9013': {},
        },
        artifactRootUriByRunUuid: {
          'uuid-1234-5678-9012': 'root/uri',
          'uuid-1234-5678-9013': 'root/uri2',
        },
      },
      apis: {},
    };
    minimalStore = mockStore(minimalStoreRaw);
  });
  test('should render with minimal props without exploding', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CompareRunScatter {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    ).find(CompareRunScatter);
    expect(wrapper.find(CompareRunScatterImpl).length).toBe(1);
    const instance = wrapper.find(CompareRunScatterImpl).instance();
    // nothing is rendered
    expect(instance.state.disabled).toBe(true);
    expect(wrapper.find({ label: 'Parameter' }).length).toBe(0);
  });
  test('with params and metrics - select rendering, getPlotlyTooltip', () => {
    const store = mockStore({
      ...minimalStoreRaw,
      entities: {
        ...minimalStoreRaw.entities,
        paramsByRunUuid: {
          'uuid-1234-5678-9012': {
            p1: (Param as any).fromJs({ key: 'p1', value: 'v11' }),
            p2: (Param as any).fromJs({ key: 'p2', value: 'v12' }),
            p3: (Param as any).fromJs({ key: 'p3', value: 'v13' }),
          },
          'uuid-1234-5678-9013': {
            p1: (Param as any).fromJs({ key: 'p1', value: 'v21' }),
            p2: (Param as any).fromJs({ key: 'p2', value: 'v22' }),
          },
        },
        latestMetricsByRunUuid: {
          'uuid-1234-5678-9012': {
            m1: (Metric as any).fromJs({ key: 'm1', value: 1.1 }),
            m3: (Metric as any).fromJs({ key: 'm3', value: 1.3 }),
          },
          'uuid-1234-5678-9013': {
            m1: (Metric as any).fromJs({ key: 'm1', value: 2.1 }),
            m2: (Metric as any).fromJs({ key: 'm2', value: 2.2 }),
          },
        },
      },
    });
    wrapper = mountWithIntl(
      <Provider store={store}>
        <MemoryRouter>
          <CompareRunScatter {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    ).find(CompareRunScatter);
    const instance = wrapper.find(CompareRunScatterImpl).instance();
    expect(instance.state.disabled).toBe(false);
    // getPlotlyTooltip
    expect(instance.getPlotlyTooltip(0)).toEqual(
      '<b>Run 9012</b><br>p1: v11<br>p2: v12<br>p3: v13<br><br>m1: 1.1<br>m3: 1.3<br>',
    );
    expect(instance.getPlotlyTooltip(1)).toEqual('<b>Run 9013</b><br>p1: v21<br>p2: v22<br><br>m1: 2.1<br>m2: 2.2<br>');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareRunScatter.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunScatter.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { escape } from 'lodash';
import React, { Component } from 'react';
import { getParams, getRunInfo } from '../reducers/Reducers';
import { connect } from 'react-redux';
import { FormUI, SimpleSelect, SimpleSelectOption, SimpleSelectOptionGroup, Spacer } from '@databricks/design-system';
import Utils from '../../common/utils/Utils';
import { getLatestMetrics } from '../reducers/MetricReducer';
import CompareRunUtil from './CompareRunUtil';
import { FormattedMessage } from 'react-intl';
import { LazyPlot } from './LazyPlot';
import { CompareRunPlotContainer } from './CompareRunPlotContainer';

type CompareRunScatterImplProps = {
  runUuids: string[];
  runInfos: any[]; // TODO: PropTypes.instanceOf(RunInfo)
  metricLists: any[][];
  paramLists: any[][];
  runDisplayNames: string[];
};

type CompareRunScatterImplState = any;

export class CompareRunScatterImpl extends Component<CompareRunScatterImplProps, CompareRunScatterImplState> {
  // Size limits for displaying keys and values in our plot axes and tooltips
  static MAX_PLOT_KEY_LENGTH = 40;
  static MAX_PLOT_VALUE_LENGTH = 60;

  metricKeys: any;
  paramKeys: any;

  constructor(props: CompareRunScatterImplProps) {
    super(props);

    this.metricKeys = CompareRunUtil.getKeys(this.props.metricLists, false);
    this.paramKeys = CompareRunUtil.getKeys(this.props.paramLists, false);

    if (this.paramKeys.length + this.metricKeys.length < 2) {
      this.state = { disabled: true };
    } else {
      this.state = {
        disabled: false,
        x:
          this.paramKeys.length > 0
            ? {
                key: this.paramKeys[0],
                isMetric: false,
              }
            : {
                key: this.metricKeys[1],
                isMetric: true,
              },
        y:
          this.metricKeys.length > 0
            ? {
                key: this.metricKeys[0],
                isMetric: true,
              }
            : {
                key: this.paramKeys[1],
                isMetric: false,
              },
      };
    }
  }

  /**
   * Get the value of the metric/param described by {key, isMetric}, in run i
   */
  getValue(i: any, { key, isMetric }: any) {
    const value = CompareRunUtil.findInList((isMetric ? this.props.metricLists : this.props.paramLists)[i], key);
    return value === undefined ? value : (value as any).value;
  }

  render() {
    // @ts-expect-error TS(4111): Property 'disabled' comes from an index signature,... Remove this comment to see the full error message
    if (this.state.disabled) {
      return <div />;
    }

    const keyLength = CompareRunScatterImpl.MAX_PLOT_KEY_LENGTH;

    const xs: any = [];
    const ys: any = [];
    const tooltips: any = [];

    this.props.runInfos.forEach((_, index) => {
      // @ts-expect-error TS(4111): Property 'x' comes from an index signature, so it ... Remove this comment to see the full error message
      const x = this.getValue(index, this.state.x);
      // @ts-expect-error TS(4111): Property 'y' comes from an index signature, so it ... Remove this comment to see the full error message
      const y = this.getValue(index, this.state.y);
      if (x === undefined || y === undefined) {
        return;
      }
      xs.push(x);
      ys.push(y);
      tooltips.push(this.getPlotlyTooltip(index));
    });

    return (
      <CompareRunPlotContainer
        controls={
          <>
            <div>
              <FormUI.Label htmlFor="x-axis-selector">
                <FormattedMessage
                  defaultMessage="X-axis:"
                  description="Label text for x-axis in scatter plot comparison in MLflow"
                />
              </FormUI.Label>
              {this.renderSelect('x')}
            </div>
            <Spacer />
            <div>
              <FormUI.Label htmlFor="y-axis-selector">
                <FormattedMessage
                  defaultMessage="Y-axis:"
                  description="Label text for y-axis in scatter plot comparison in MLflow"
                />
              </FormUI.Label>
              {this.renderSelect('y')}
            </div>
          </>
        }
      >
        <LazyPlot
          data={[
            {
              x: xs,
              y: ys,
              text: tooltips,
              hoverinfo: 'text',
              type: 'scattergl',
              mode: 'markers',
              marker: {
                size: 10,
                color: 'rgba(200, 50, 100, .75)',
              },
            },
          ]}
          layout={{
            margin: {
              t: 30,
            },
            hovermode: 'closest',
            xaxis: {
              title: escape(Utils.truncateString(this.state['x'].key, keyLength)),
            },
            yaxis: {
              title: escape(Utils.truncateString(this.state['y'].key, keyLength)),
            },
          }}
          css={styles.plot}
          config={{
            responsive: true,
            displaylogo: false,
            scrollZoom: true,
            modeBarButtonsToRemove: [
              'sendDataToCloud',
              'select2d',
              'lasso2d',
              'resetScale2d',
              'hoverClosestCartesian',
              'hoverCompareCartesian',
            ],
          }}
          useResizeHandler
        />
      </CompareRunPlotContainer>
    );
  }

  renderSelect(axis: any) {
    return (
      <SimpleSelect
        componentId="codegen_mlflow_app_src_experiment-tracking_components_comparerunscatter.tsx_182"
        css={styles.select}
        id={axis + '-axis-selector'}
        onChange={({ target }) => {
          const { value } = target;
          const [prefix, ...keyParts] = value.split('-');
          const key = keyParts.join('-');
          const isMetric = prefix === 'metric';
          this.setState({ [axis]: { isMetric, key } });
        }}
        value={(this.state[axis].isMetric ? 'metric-' : 'param-') + this.state[axis].key}
      >
        <SimpleSelectOptionGroup label="Parameter">
          {this.paramKeys.map((p: any) => (
            <SimpleSelectOption key={'param-' + p} value={'param-' + p}>
              {p}
            </SimpleSelectOption>
          ))}
        </SimpleSelectOptionGroup>
        <SimpleSelectOptionGroup label="Metric">
          {this.metricKeys.map((m: any) => (
            <SimpleSelectOption key={'metric-' + m} value={'metric-' + m}>
              {m}
            </SimpleSelectOption>
          ))}
        </SimpleSelectOptionGroup>
      </SimpleSelect>
    );
  }

  getPlotlyTooltip(index: any) {
    const keyLength = CompareRunScatterImpl.MAX_PLOT_KEY_LENGTH;
    const valueLength = CompareRunScatterImpl.MAX_PLOT_VALUE_LENGTH;
    const runName = this.props.runDisplayNames[index];
    let result = `<b>${escape(runName)}</b><br>`;
    const paramList = this.props.paramLists[index];
    paramList.forEach((p) => {
      result +=
        escape(Utils.truncateString(p.key, keyLength)) +
        ': ' +
        escape(Utils.truncateString(p.value, valueLength)) +
        '<br>';
    });
    const metricList = this.props.metricLists[index];
    if (metricList.length > 0) {
      result += paramList.length > 0 ? '<br>' : '';
      metricList.forEach((m) => {
        result += escape(Utils.truncateString(m.key, keyLength)) + ': ' + Utils.formatMetric(m.value) + '<br>';
      });
    }
    return result;
  }
}

const styles = {
  select: {
    width: '100%',
  },
  plot: {
    width: '100%',
  },
};

const mapStateToProps = (state: any, ownProps: any) => {
  const runInfos: any = [];
  const metricLists: any = [];
  const paramLists: any = [];
  const { runUuids } = ownProps;
  runUuids.forEach((runUuid: any) => {
    runInfos.push(getRunInfo(runUuid, state));
    metricLists.push(Object.values(getLatestMetrics(runUuid, state)));
    paramLists.push(Object.values(getParams(runUuid, state)));
  });
  return { runInfos, metricLists, paramLists };
};

export const CompareRunScatter = connect(mapStateToProps)(CompareRunScatterImpl);
```

--------------------------------------------------------------------------------

---[FILE: CompareRunUtil.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunUtil.test.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, test, expect } from '@jest/globals';
import CompareRunUtil from './CompareRunUtil';
import { Metric } from '../sdk/MlflowMessages';

describe('CompareRunUtil', () => {
  const makeSublist = (obj: any) => {
    const newObj = {};
    Object.entries(obj).forEach(
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      ([key, value]) => (newObj[key] = (Metric as any).fromJs({ key: key, value: value })),
    );
    return Object.values(newObj);
  };
  const list = [
    // run 1
    makeSublist({
      rmse: 0.01,
      objective: 37.121,
      timestamp: 1571684492701,
      step: 1,
      strnum: '123',
      comment: 'oh 1',
    }),
    // run 2
    makeSublist({
      rmse: 0.02,
      objective: 37.122,
      timestamp: 1571684492702,
      step: 2,
      comment: 'oh 2',
      strnum: '4.5',
      loss: 1.0783,
    }),
  ];
  test('findInList - properly returns when not in list', () => {
    expect(CompareRunUtil.findInList(list[0], 'loss')).toEqual(undefined);
    expect(CompareRunUtil.findInList(list[0], undefined)).toEqual(undefined);
  });
  test('findInList - finds various value types in list', () => {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[0], 'rmse').value).toEqual(0.01);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[1], 'rmse').value).toEqual(0.02);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[0], 'timestamp').value).toEqual(1571684492701);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[1], 'timestamp').value).toEqual(1571684492702);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[0], 'comment').value).toEqual('oh 1');
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[1], 'comment').value).toEqual('oh 2');
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[0], 'strnum').value).toEqual('123');
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(CompareRunUtil.findInList(list[1], 'strnum').value).toEqual('4.5');
  });
  test('getKeys - no keys', () => {
    const emptyList = [[], []];
    expect(CompareRunUtil.getKeys(emptyList, false)).toEqual([]);
    expect(CompareRunUtil.getKeys(emptyList, true)).toEqual([]);
  });
  test("getKeys - no keys for 'numeric' = true", () => {
    const nonnumericList = [
      // run 1
      makeSublist({
        str1: 'blah',
        str2: 'bleh',
        str3: 'bloh',
      }),
      // run 2
      makeSublist({
        str1: 'ablah',
        str2: 'ableh',
        str4: 'abloh',
      }),
    ];
    expect(CompareRunUtil.getKeys(nonnumericList, true)).toEqual([]);
  });
  test('getKeys - returns keys properly', () => {
    expect(CompareRunUtil.getKeys(list, false)).toEqual([
      'comment',
      'loss',
      'objective',
      'rmse',
      'step',
      'strnum',
      'timestamp',
    ]);
    expect(CompareRunUtil.getKeys(list, true)).toEqual(['loss', 'objective', 'rmse', 'step', 'strnum', 'timestamp']);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareRunUtil.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunUtil.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export default class CompareRunUtil {
  /**
   * Find in a list of metrics/params a certain key
   */
  static findInList(data: any, key: any) {
    let found = undefined;
    data.forEach((value: any) => {
      if (value.key === key) {
        found = value;
      }
    });
    return found;
  }

  /**
   * Get all keys present in the data in ParamLists or MetricLists or Schema input and outputs lists
   */
  static getKeys(lists: any, numeric: any) {
    const keys = {};
    lists.forEach((list: any) =>
      list.forEach((item: any) => {
        if (!(item.key in keys)) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          keys[item.key] = true;
        }
        if (numeric && isNaN(parseFloat(item.value))) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          keys[item.key] = false;
        }
      }),
    );
    return (
      Object.keys(keys)
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        .filter((k) => keys[k])
        .sort()
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CompareRunView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunView.css

```text
.mlflow-sticky-header {
  position: sticky;
  position: -webkit-sticky;
  left: 0;
}

.mlflow-compare-run-table {
  display: block;
  overflow: auto;
  width: 100%;
}

.mlflow-compare-table th.inter-title {
  padding: 20px 0 0;
  background: transparent;
}

.mlflow-compare-table .head-value {
  overflow: hidden;
  overflow-wrap: break-word;
}

.mlflow-compare-table td.data-value,
.mlflow-compare-table th.data-value {
  overflow: hidden;
  max-width: 120px;
  text-overflow: ellipsis;
}

.mlflow-responsive-table-container {
  width: 100%;
  overflow-x: auto;
}

.mlflow-compare-table .diff-row .data-value {
  background-color: rgba(249, 237, 190, 0.5);
  color: #555;
}

.mlflow-compare-table .diff-row .head-value {
  background-color: rgba(249, 237, 190, 1);
  color: #555;
}

.mlflow-compare-table .diff-row:hover {
  background-color: rgba(249, 237, 190, 1);
  color: #555;
}

/* Overrides to make it look more like antd */
.mlflow-compare-table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}
.mlflow-compare-table th,
.mlflow-compare-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #e8e8e8;
}
.mlflow-compare-table th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background-color: rgb(250, 250, 250);
  text-align: left;
}
.mlflow-compare-table > tbody > tr:hover:not(.diff-row) > td:not(.highlight-data) {
  background-color: rgb(250, 250, 250);
}
```

--------------------------------------------------------------------------------

---[FILE: CompareRunView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunView.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { MockedReduxStoreProvider } from '../../common/utils/TestUtils';
import { render, screen, waitFor } from '../../common/utils/TestUtils.react18';
import CompareRunView from './CompareRunView';
import { testRoute, TestRouter } from '../../common/utils/RoutingTestUtils';

describe('CompareRunView', () => {
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <IntlProvider locale="en">
      <TestRouter routes={[testRoute(<>{children}</>)]} />
    </IntlProvider>
  );
  test('Will display title for two runs', async () => {
    render(
      <MockedReduxStoreProvider
        state={
          {
            compareExperiments: {},
            comparedExperiments: {},
            entities: {
              experimentsById: { exp_1: {} },
              runInfosByUuid: { run_1: { runUuid: 'run_1' }, run_2: { runUuid: 'run_2' } },
              paramsByRunUuid: { run_1: {}, run_2: {} },
              latestMetricsByRunUuid: { run_1: {}, run_2: {} },
              tagsByRunUuid: { run_1: {}, run_2: {} },
            },
          } as any
        }
      >
        <CompareRunView experimentIds={['exp_1']} runUuids={['run_1', 'run_2']} />
      </MockedReduxStoreProvider>,
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(screen.getByText(/Comparing 2 Runs/)).toBeInTheDocument();
    });
  });

  test('Will not crash when run infos are not present in the store', async () => {
    render(
      <MockedReduxStoreProvider
        state={
          {
            compareExperiments: {},
            comparedExperiments: {},
            entities: {
              experimentsById: { exp_1: {} },
              runInfosByUuid: {},
              paramsByRunUuid: {},
              latestMetricsByRunUuid: {},
            },
          } as any
        }
      >
        <CompareRunView experimentIds={['exp_1']} runUuids={['run_1', 'run_2']} />
      </MockedReduxStoreProvider>,
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(screen.getByText(/Comparing 0 Runs/)).toBeInTheDocument();
    });
  });

  test('Displays visualizations section with parallel coordinates plot by default', async () => {
    render(
      <MockedReduxStoreProvider
        state={
          {
            compareExperiments: {},
            comparedExperiments: {},
            entities: {
              experimentsById: { exp_1: {} },
              runInfosByUuid: { run_1: { runUuid: 'run_1' }, run_2: { runUuid: 'run_2' } },
              paramsByRunUuid: { run_1: {}, run_2: {} },
              latestMetricsByRunUuid: { run_1: {}, run_2: {} },
              tagsByRunUuid: { run_1: {}, run_2: {} },
            },
          } as any
        }
      >
        <CompareRunView experimentIds={['exp_1']} runUuids={['run_1', 'run_2']} />
      </MockedReduxStoreProvider>,
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(screen.getByText(/Visualizations/i)).toBeInTheDocument();
      expect(screen.getByText(/Parallel Coordinates Plot/i)).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 443
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 443 of 991)

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

---[FILE: CompareRunBox.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunBox.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { select } from '@databricks/design-system/test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { renderWithIntl, screen } from '../../common/utils/TestUtils.react18';
import type { RunInfoEntity } from '../types';
import { CompareRunBox } from './CompareRunBox';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000); // Larger timeout for integration testing (plotly rendering)

describe('CompareRunBox', () => {
  const runUuids = ['1', '2', '3'];
  const commonProps = {
    runUuids,
    runInfos: runUuids.map(
      (runUuid) =>
        ({
          runUuid,
          experimentId: '0',
        } as RunInfoEntity),
    ),
    runDisplayNames: runUuids,
  };

  it('renders a chart with the correct x and y axes', async () => {
    const props = {
      ...commonProps,
      paramLists: [[{ key: 'param-1', value: 1 }], [{ key: 'param-2', value: 2 }], [{ key: 'param-3', value: 3 }]],
      metricLists: [[{ key: 'metric-4', value: 4 }], [{ key: 'metric-5', value: 5 }], [{ key: 'metric-6', value: 6 }]],
    };

    renderWithIntl(<CompareRunBox {...props} />);
    expect(screen.queryByText('Select parameters/metrics to plot.')).toBeInTheDocument();

    // Select x axis value
    const xAxisSelector = screen.getByRole('combobox', { name: /X-axis/ });
    await userEvent.click(xAxisSelector);
    const xOptionNames = select.getOptionNames(xAxisSelector);
    const xAxisIdx = xOptionNames.indexOf('param-3');
    await userEvent.click(select.getOptions(xAxisSelector)[xAxisIdx]);

    expect(select.getDisplayLabel(xAxisSelector)).toBe('param-3');

    // Select y axis value
    const yAxisSelector = screen.getByRole('combobox', { name: /Y-axis/ });
    await userEvent.click(yAxisSelector);
    const yOptionNames = select.getOptionNames(yAxisSelector);
    const yAxisIdx = yOptionNames.indexOf('metric-4');
    await userEvent.click(select.getOptions(yAxisSelector)[yAxisIdx]);

    expect(select.getDisplayLabel(yAxisSelector)).toBe('metric-4');

    expect(screen.queryByText('Select parameters/metrics to plot.')).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareRunBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunBox.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Typography,
  Row,
  Col,
  SimpleSelect,
  SimpleSelectOptionGroup,
  SimpleSelectOption,
  FormUI,
} from '@databricks/design-system';
import { LazyPlot } from './LazyPlot';
import type { RunInfoEntity } from '../types';

type Props = {
  runUuids: string[];
  runInfos: RunInfoEntity[];
  metricLists: any[][];
  paramLists: any[][];
};

type Axis = {
  key?: string;
  isParam?: boolean;
};

const paramOptionPrefix = 'param-';
const metricOptionPrefix = 'metric-';

// Note: This component does not pass the value of the parent component to the child component.
// Doing so will cause weird rendering issues with the label and updating of the value.
const Selector = ({
  id,
  onChange,
  paramKeys,
  metricKeys,
}: {
  id: string;
  onChange: (axis: Axis) => void;
  paramKeys: string[];
  metricKeys: string[];
}) => {
  const intl = useIntl();
  return (
    <SimpleSelect
      componentId="codegen_mlflow_app_src_experiment-tracking_components_comparerunbox.tsx_46"
      id={id}
      css={{ width: '100%', marginBottom: '16px' }}
      placeholder={intl.formatMessage({
        defaultMessage: 'Select parameter or metric',
        description: 'Placeholder text for parameter/metric selector in box plot comparison in MLflow',
      })}
      onChange={({ target }) => {
        const { value } = target;
        const [_prefix, key] = value.split('-');
        const isParam = value.startsWith(paramOptionPrefix);
        onChange({ key, isParam });
      }}
    >
      <SimpleSelectOptionGroup label="Parameters">
        {paramKeys.map((key) => (
          <SimpleSelectOption key={key} value={paramOptionPrefix + key}>
            {key}
          </SimpleSelectOption>
        ))}
      </SimpleSelectOptionGroup>
      <SimpleSelectOptionGroup label="Metrics">
        {metricKeys.map((key) => (
          <SimpleSelectOption key={key} value={metricOptionPrefix + key}>
            {key}
          </SimpleSelectOption>
        ))}
      </SimpleSelectOptionGroup>
    </SimpleSelect>
  );
};

export const CompareRunBox = ({ runInfos, metricLists, paramLists }: Props) => {
  const [xAxis, setXAxis] = useState<Axis>({ key: undefined, isParam: undefined });
  const [yAxis, setYAxis] = useState<Axis>({ key: undefined, isParam: undefined });

  const paramKeys = Array.from(new Set(paramLists.flat().map(({ key }) => key))).sort();
  const metricKeys = Array.from(new Set(metricLists.flat().map(({ key }) => key))).sort();

  const getBoxPlotData = () => {
    const data = {};
    runInfos.forEach((_, index) => {
      const params = paramLists[index];
      const metrics = metricLists[index];
      const x = (xAxis.isParam ? params : metrics).find(({ key }) => key === xAxis.key);
      const y = (yAxis.isParam ? params : metrics).find(({ key }) => key === yAxis.key);
      if (x === undefined || y === undefined) {
        return;
      }

      if (x.value in data) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        data[x.value].push(y.value);
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        data[x.value] = [y.value];
      }
    });

    return Object.entries(data).map(([key, values]) => ({
      y: values,
      type: 'box',
      name: key,
      jitter: 0.3,
      pointpos: -1.5,
      boxpoints: 'all',
    }));
  };

  const renderPlot = () => {
    if (!(xAxis.key && yAxis.key)) {
      return (
        <div
          css={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography.Text size="xl">
            <FormattedMessage
              defaultMessage="Select parameters/metrics to plot."
              description="Text to show when x or y axis is not selected on box plot"
            />
          </Typography.Text>
        </div>
      );
    }

    return (
      <LazyPlot
        css={{
          width: '100%',
          height: '100%',
          minHeight: '35vw',
        }}
        data={getBoxPlotData()}
        layout={{
          margin: {
            t: 30,
          },
          hovermode: 'closest',
          xaxis: {
            title: xAxis.key,
          },
          yaxis: {
            title: yAxis.key,
          },
        }}
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
    );
  };

  return (
    <Row>
      <Col span={6}>
        <div css={styles.borderSpacer}>
          <div>
            <FormUI.Label htmlFor="x-axis-selector">
              <FormattedMessage
                defaultMessage="X-axis:"
                description="Label text for X-axis in box plot comparison in MLflow"
              />
            </FormUI.Label>
          </div>
          <Selector id="x-axis-selector" onChange={setXAxis} paramKeys={paramKeys} metricKeys={metricKeys} />

          <div>
            <FormUI.Label htmlFor="y-axis-selector">
              <FormattedMessage
                defaultMessage="Y-axis:"
                description="Label text for Y-axis in box plot comparison in MLflow"
              />
            </FormUI.Label>
          </div>
          <Selector id="y-axis-selector" onChange={setYAxis} paramKeys={paramKeys} metricKeys={metricKeys} />
        </div>
      </Col>
      <Col span={18}>{renderPlot()}</Col>
    </Row>
  );
};

const styles = {
  borderSpacer: (theme: any) => ({
    paddingLeft: theme.spacing.xs,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: CompareRunContour.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunContour.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import { CompareRunContour } from './CompareRunContour';
import { shallowWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

describe('unit tests', () => {
  let wrapper: any;
  let instance;
  const runUuids = ['run_uuid_0', 'run_uuid_1', 'run_uuid_2'];
  const commonProps = {
    runUuids,
    runInfos: runUuids.map((runUuid) => ({
      runUuid,
      experimentId: '1',
    })),
    runDisplayNames: runUuids,
  };
  beforeEach(() => {});
  test('should render with minimal props without exploding', () => {
    const props = {
      ...commonProps,
      paramLists: [
        [
          { key: 'p1', value: 1 },
          { key: 'p2', value: 2 },
        ],
        [
          { key: 'p1', value: 3 },
          { key: 'p2', value: 4 },
        ],
        [
          { key: 'p1', value: 5 },
          { key: 'p2', value: 6 },
        ],
      ],
      metricLists: [[{ key: 'm1', value: 7 }], [{ key: 'm1', value: 8 }], [{ key: 'm1', value: 9 }]],
    };
    wrapper = shallow(<CompareRunContour {...props} />);
    expect(wrapper.length).toBe(1);
    instance = wrapper.instance();
    expect(instance.paramKeys).toEqual(['p1', 'p2']);
    expect(instance.metricKeys).toEqual(['m1']);
    expect(instance.state).toEqual({
      disabled: false,
      reverseColor: false,
      xaxis: { key: 'p1', isMetric: false },
      yaxis: { key: 'p2', isMetric: false },
      zaxis: { key: 'm1', isMetric: true },
    });
  });
  test('should render a div with a message when the number of unique params/metrics is less than three', () => {
    const props = {
      ...commonProps,
      paramLists: [[{ key: 'p1', value: 1 }], [{ key: 'p1', value: 2 }], [{ key: 'p1', value: 3 }]],
      metricLists: [[{ key: 'm1', value: 4 }], [{ key: 'm1', value: 5 }], [{ key: 'm1', value: 6 }]],
    };
    wrapper = shallow(<CompareRunContour {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('div').length).toBe(1);
    instance = wrapper.instance();
    expect(instance.state).toEqual({ disabled: true });
  });
  test('should remove non-numeric params/metrics', () => {
    const props = {
      ...commonProps,
      paramLists: [
        [
          { key: 'p1', value: 1 },
          { key: 'p2', value: 'a' },
          { key: 'p3', value: 2 },
        ],
        [
          { key: 'p1', value: 3 },
          { key: 'p2', value: 'b' },
          { key: 'p3', value: 3 },
        ],
        [
          { key: 'p1', value: 5 },
          { key: 'p2', value: 'c' },
          { key: 'p3', value: 6 },
        ],
      ],
      metricLists: [[{ key: 'm1', value: 7 }], [{ key: 'm1', value: 8 }], [{ key: 'm1', value: 9 }]],
    };
    wrapper = shallow(<CompareRunContour {...props} />);
    expect(wrapper.length).toBe(1);
    instance = wrapper.instance();
    // 'p2' should be removed because it's a non-numeric parameter.
    expect(instance.paramKeys).toEqual(['p1', 'p3']);
    expect(instance.metricKeys).toEqual(['m1']);
    expect(instance.state).toEqual({
      disabled: false,
      reverseColor: false,
      xaxis: { key: 'p1', isMetric: false },
      yaxis: { key: 'p3', isMetric: false },
      zaxis: { key: 'm1', isMetric: true },
    });
  });
  test('should render with runs without metrics', () => {
    const props = {
      ...commonProps,
      paramLists: [
        [
          { key: 'p1', value: 1 },
          { key: 'p2', value: 2 },
          { key: 'p3', value: 3 },
        ],
        [
          { key: 'p1', value: 4 },
          { key: 'p2', value: 5 },
          { key: 'p3', value: 6 },
        ],
        [
          { key: 'p1', value: 7 },
          { key: 'p2', value: 8 },
          { key: 'p3', value: 9 },
        ],
      ],
      metricLists: [[], [], []],
    };
    wrapper = shallow(<CompareRunContour {...props} />);
    expect(wrapper.length).toBe(1);
    instance = wrapper.instance();
    expect(instance.paramKeys).toEqual(['p1', 'p2', 'p3']);
    expect(instance.metricKeys).toEqual([]);
    expect(instance.state).toEqual({
      disabled: false,
      reverseColor: false,
      xaxis: { key: 'p1', isMetric: false },
      yaxis: { key: 'p2', isMetric: false },
      zaxis: { key: 'p3', isMetric: false },
    });
  });
  test('should render with runs without params', () => {
    const props = {
      ...commonProps,
      paramLists: [[], [], []],
      metricLists: [
        [
          { key: 'm1', value: 1 },
          { key: 'm2', value: 2 },
          { key: 'm3', value: 3 },
        ],
        [
          { key: 'm1', value: 4 },
          { key: 'm2', value: 5 },
          { key: 'm3', value: 6 },
        ],
        [
          { key: 'm1', value: 7 },
          { key: 'm2', value: 8 },
          { key: 'm3', value: 9 },
        ],
      ],
    };
    wrapper = shallow(<CompareRunContour {...props} />);
    expect(wrapper.length).toBe(1);
    instance = wrapper.instance();
    expect(instance.paramKeys).toEqual([]);
    expect(instance.metricKeys).toEqual(['m1', 'm2', 'm3']);
    expect(instance.state).toEqual({
      disabled: false,
      reverseColor: false,
      xaxis: { key: 'm1', isMetric: true },
      yaxis: { key: 'm2', isMetric: true },
      zaxis: { key: 'm3', isMetric: true },
    });
  });
  test('should render when params/metrics corresponding to the x & y axes are only present in some runs', () => {
    const props = {
      ...commonProps,
      paramLists: [
        [
          { key: 'p1', value: 1 },
          { key: 'p2', value: 2 },
        ],
        [
          { key: 'p1', value: 3 },
          { key: 'p2', value: 4 },
        ],
        // this run does not contain 'b'.
        [{ key: 'p1', value: 5 }],
      ],
      metricLists: [[{ key: 'm1', value: 6 }], [{ key: 'm1', value: 7 }], [{ key: 'm1', value: 8 }]],
    };
    wrapper = shallow(<CompareRunContour {...props} />);
    expect(wrapper.length).toBe(1);
    instance = wrapper.instance();
    expect(instance.paramKeys).toEqual(['p1', 'p2']);
    expect(instance.metricKeys).toEqual(['m1']);
    expect(instance.state).toEqual({
      disabled: false,
      reverseColor: false,
      xaxis: { key: 'p1', isMetric: false },
      yaxis: { key: 'p2', isMetric: false },
      zaxis: { key: 'm1', isMetric: true },
    });
  });
  test('should render a warning message when X or Y axis does not have enough data points', () => {
    const props = {
      ...commonProps,
      paramLists: [
        [
          { key: 'p1', value: 0 },
          { key: 'p2', value: 1 },
        ],
        [
          { key: 'p1', value: 0 },
          { key: 'p2', value: 2 },
        ],
        [
          { key: 'p1', value: 0 },
          { key: 'p2', value: 3 },
        ],
      ],
      metricLists: [[{ key: 'm1', value: 4 }], [{ key: 'm1', value: 5 }], [{ key: 'm1', value: 6 }]],
    };
    wrapper = shallowWithIntl(<CompareRunContour {...props} />).dive();
    const renderControlsElement = () => wrapper.dive();
    // X axis: p1 | Y axis: p2
    expect(renderControlsElement().text().includes("The X axis doesn't have enough unique data points")).toBe(true);
    // X axis: p2 | Y axis: p1
    wrapper.setState({
      xaxis: { key: 'p2', isMetric: false },
      yaxis: { key: 'p1', isMetric: false },
    });
    expect(renderControlsElement().text().includes("The Y axis doesn't have enough unique data points")).toBe(true);
    // X axis: p1 | Y axis: p1
    wrapper.setState({ xaxis: { key: 'p1', isMetric: false } });
    expect(renderControlsElement().text().includes("The X and Y axes don't have enough unique data points")).toBe(true);
    // X axis: p2 | Y axis: p2
    wrapper.setState({
      xaxis: { key: 'p2', isMetric: false },
      yaxis: { key: 'p2', isMetric: false },
    });
    expect(renderControlsElement().text().includes('have enough unique data points')).toBe(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareRunContour.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunContour.tsx
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
import {
  Switch,
  Spacer,
  SimpleSelect,
  SimpleSelectOptionGroup,
  SimpleSelectOption,
  FormUI,
} from '@databricks/design-system';
import { getParams, getRunInfo } from '../reducers/Reducers';
import { connect } from 'react-redux';
import Utils from '../../common/utils/Utils';
import { getLatestMetrics } from '../reducers/MetricReducer';
import CompareRunUtil from './CompareRunUtil';
import { FormattedMessage } from 'react-intl';
import { LazyPlot } from './LazyPlot';
import { CompareRunPlotContainer } from './CompareRunPlotContainer';

type CompareRunContourProps = {
  runInfos: any[]; // TODO: PropTypes.instanceOf(RunInfo)
  metricLists: any[][];
  paramLists: any[][];
  runDisplayNames: string[];
};

type CompareRunContourState = any;

export class CompareRunContour extends Component<CompareRunContourProps, CompareRunContourState> {
  // Size limits for displaying keys and values in our plot axes and tooltips
  static MAX_PLOT_KEY_LENGTH = 40;
  static MAX_PLOT_VALUE_LENGTH = 60;

  metricKeys: any;
  paramKeys: any;

  constructor(props: CompareRunContourProps) {
    super(props);

    this.metricKeys = CompareRunUtil.getKeys(this.props.metricLists, true);
    this.paramKeys = CompareRunUtil.getKeys(this.props.paramLists, true);

    if (this.paramKeys.length + this.metricKeys.length < 3) {
      this.state = { disabled: true };
    } else {
      const common = { disabled: false, reverseColor: false };
      if (this.metricKeys.length === 0) {
        this.state = {
          ...common,
          xaxis: { key: this.paramKeys[0], isMetric: false },
          yaxis: { key: this.paramKeys[1], isMetric: false },
          zaxis: { key: this.paramKeys[2], isMetric: false },
        };
      } else if (this.paramKeys.length === 0) {
        this.state = {
          ...common,
          xaxis: { key: this.metricKeys[0], isMetric: true },
          yaxis: { key: this.metricKeys[1], isMetric: true },
          zaxis: { key: this.metricKeys[2], isMetric: true },
        };
      } else if (this.paramKeys.length === 1) {
        this.state = {
          ...common,
          xaxis: { key: this.paramKeys[0], isMetric: false },
          yaxis: { key: this.metricKeys[0], isMetric: true },
          zaxis: { key: this.metricKeys[1], isMetric: true },
        };
      } else {
        this.state = {
          ...common,
          xaxis: { key: this.paramKeys[0], isMetric: false },
          yaxis: { key: this.paramKeys[1], isMetric: false },
          zaxis: { key: this.metricKeys[0], isMetric: true },
        };
      }
    }
  }

  /**
   * Get the value of the metric/param described by {key, isMetric}, in run i
   */
  getValue(i: any, { key, isMetric }: any) {
    const value = CompareRunUtil.findInList((isMetric ? this.props.metricLists : this.props.paramLists)[i], key);
    return value === undefined ? value : (value as any).value;
  }

  getColorscale() {
    /*
     * contour plot has an option named "reversescale" which
     * reverses the color mapping if True, but it doesn't work properly now.
     *
     * https://github.com/plotly/plotly.js/issues/4430
     *
     * This function is a temporary workaround for the issue.
     */
    const colorscale = [
      [0, 'rgb(5,10,172)'],
      [0.35, 'rgb(40,60,190)'],
      [0.5, 'rgb(70,100,245)'],
      [0.6, 'rgb(90,120,245)'],
      [0.7, 'rgb(106,137,247)'],
      [1, 'rgb(220,220,220)'],
    ];

    // @ts-expect-error TS(4111): Property 'reverseColor' comes from an index signat... Remove this comment to see the full error message
    if (this.state.reverseColor) {
      return colorscale;
    } else {
      // reverse only RGB values
      return colorscale.map(([val], index) => [val, colorscale[colorscale.length - 1 - index][1]]);
    }
  }

  render() {
    // @ts-expect-error TS(4111): Property 'disabled' comes from an index signature,... Remove this comment to see the full error message
    if (this.state.disabled) {
      return (
        <div>
          <FormattedMessage
            defaultMessage="Contour plots can only be rendered when comparing a group of runs
              with three or more unique metrics or params. Log more metrics or params to your
              runs to visualize them using the contour plot."
            description="Text explanation when contour plot is disabled in comparison pages
              in MLflow"
          />
        </div>
      );
    }

    const keyLength = CompareRunContour.MAX_PLOT_KEY_LENGTH;

    const xs: any = [];
    const ys: any = [];
    const zs: any = [];
    const tooltips: any = [];

    this.props.runInfos.forEach((_, index) => {
      // @ts-expect-error TS(4111): Property 'xaxis' comes from an index signature, so... Remove this comment to see the full error message
      const x = this.getValue(index, this.state.xaxis);
      // @ts-expect-error TS(4111): Property 'yaxis' comes from an index signature, so... Remove this comment to see the full error message
      const y = this.getValue(index, this.state.yaxis);
      // @ts-expect-error TS(4111): Property 'zaxis' comes from an index signature, so... Remove this comment to see the full error message
      const z = this.getValue(index, this.state.zaxis);
      if (x === undefined || y === undefined || z === undefined) {
        return;
      }
      xs.push(parseFloat(x));
      ys.push(parseFloat(y));
      zs.push(parseFloat(z));
      tooltips.push(this.getPlotlyTooltip(index));
    });

    const maybeRenderPlot = () => {
      const invalidAxes = [];
      if (new Set(xs).size < 2) {
        invalidAxes.push('X');
      }
      if (new Set(ys).size < 2) {
        invalidAxes.push('Y');
      }
      if (invalidAxes.length > 0) {
        const messageHead =
          invalidAxes.length > 1 ? `The ${invalidAxes.join(' and ')} axes don't` : `The ${invalidAxes[0]} axis doesn't`;
        return (
          <div
            css={styles.noDataMessage}
          >{`${messageHead} have enough unique data points to render the contour plot.`}</div>
        );
      }

      return (
        <LazyPlot
          css={styles.plot}
          data={[
            // contour plot
            {
              z: zs,
              x: xs,
              y: ys,
              type: 'contour',
              hoverinfo: 'none',
              colorscale: this.getColorscale(),
              connectgaps: true,
              contours: {
                coloring: 'heatmap',
              },
            },
            // scatter plot
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
              title: escape(Utils.truncateString(this.state['xaxis'].key, keyLength)),
              range: [Math.min(...xs), Math.max(...xs)],
            },
            yaxis: {
              title: escape(Utils.truncateString(this.state['yaxis'].key, keyLength)),
              range: [Math.min(...ys), Math.max(...ys)],
            },
          }}
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
      );
    };

    return (
      <CompareRunPlotContainer
        controls={
          <>
            <div>
              <FormUI.Label htmlFor="xaxis-selector">
                <FormattedMessage
                  defaultMessage="X-axis:"
                  description="Label text for x-axis in contour plot comparison in MLflow"
                />
              </FormUI.Label>
              {this.renderSelect('xaxis')}
            </div>
            <Spacer />
            <div>
              <FormUI.Label htmlFor="yaxis-selector">
                <FormattedMessage
                  defaultMessage="Y-axis:"
                  description="Label text for y-axis in contour plot comparison in MLflow"
                />
              </FormUI.Label>
              {this.renderSelect('yaxis')}
            </div>
            <Spacer />
            <div>
              <FormUI.Label htmlFor="zaxis-selector">
                <FormattedMessage
                  defaultMessage="Z-axis:"
                  description="Label text for z-axis in contour plot comparison in MLflow"
                />
              </FormUI.Label>
              {this.renderSelect('zaxis')}
            </div>
            <Spacer />
            <div className="inline-control">
              <FormattedMessage
                defaultMessage="Reverse color:"
                description="Label text for reverse color toggle in contour plot comparison
                      in MLflow"
              />{' '}
              <Switch
                componentId="codegen_mlflow_app_src_experiment-tracking_components_compareruncontour.tsx_282"
                className="show-point-toggle"
                // @ts-expect-error TS(4111): Property 'reverseColor' comes from an index signat... Remove this comment to see the full error message
                checked={this.state.reverseColor}
                onChange={(checked) => this.setState({ reverseColor: checked })}
              />
            </div>
          </>
        }
      >
        {maybeRenderPlot()}
      </CompareRunPlotContainer>
    );
  }

  renderSelect(axis: string) {
    return (
      <SimpleSelect
        componentId="codegen_mlflow_app_src_experiment-tracking_components_compareruncontour.tsx_299"
        css={{ width: '100%' }}
        id={axis + '-selector'}
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
    const keyLength = CompareRunContour.MAX_PLOT_KEY_LENGTH;
    const valueLength = CompareRunContour.MAX_PLOT_VALUE_LENGTH;
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
  plot: {
    width: '100%',
  },
  noDataMessage: (theme: any) => ({
    padding: theme.spacing.sm,
    display: 'flex',
    justifyContent: 'center',
  }),
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

export default connect(mapStateToProps)(CompareRunContour);
```

--------------------------------------------------------------------------------

---[FILE: CompareRunPage.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunPage.enzyme.test.tsx
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
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import CompareRunPage from './CompareRunPage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

describe('CompareRunPage', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    minimalProps = {
      location: {
        search: {
          '?runs': '["runn-1234-5678-9012", "runn-1234-5678-9034"]',
          experiments: '["12345"]',
        },
      },
      experimentIds: ['12345'],
      runUuids: ['runn-1234-5678-9012', 'runn-1234-5678-9034'],
      dispatch: jest.fn(),
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
          <CompareRunPage {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find(CompareRunPage).length).toBe(1);
  });
});

describe('CompareRunPage URI encoded', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    // TODO: remove global fetch mock by explicitly mocking all the service API calls
    // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: true; status: number; tex... Remove this comment to see the full error message
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') }));
    minimalProps = {
      location: {
        search:
          '?runs=%5B%252281d708375e574d6cbf4985b8701d67d2%2522,%25225f70fea1ef004d3180a6c34fe2d0d94e%2522%5D&experiments=%5B%25220%2522%5D',
      },
      experimentIds: ['12345'],
      runUuids: ['runn-1234-5678-9012', 'runn-1234-5678-9034'],
      dispatch: jest.fn(),
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
          <CompareRunPage {...minimalProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find(CompareRunPage).length).toBe(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareRunPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/CompareRunPage.test.tsx

```typescript
import { jest, describe, beforeAll, test, expect } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '../../common/utils/TestUtils.react18';
import CompareRunPage from './CompareRunPage';
import { MockedReduxStoreProvider } from '../../common/utils/TestUtils';
import { setupTestRouter, testRoute, TestRouter } from '../../common/utils/RoutingTestUtils';
import { setupServer } from '../../common/utils/setup-msw';
import { rest } from 'msw';
import { EXPERIMENT_RUNS_MOCK_STORE } from './experiment-page/fixtures/experiment-runs.fixtures';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000);

// We're not testing RequestStateWrapper logic so it's just a pass through component in this test
jest.mock('../../common/components/RequestStateWrapper', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <>{children}</>),
}));

describe('CompareRunPage', () => {
  const { history } = setupTestRouter();
  const apiHandlers = {
    experimentsSuccess: rest.get('/ajax-api/2.0/mlflow/experiments/get', (req, res, ctx) =>
      res(ctx.json({ experiment: {} })),
    ),
    experimentsFailure: rest.get('/ajax-api/2.0/mlflow/experiments/get', (req, res, ctx) =>
      res(ctx.status(404), ctx.json({ message: `Experiment ${req.url.searchParams.get('experiment_id')} not found` })),
    ),
    runsSuccess: rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
      return res(ctx.json({ experiments: [] }));
    }),
    runsFailure: rest.get('/ajax-api/2.0/mlflow/runs/get', (req, res, ctx) => {
      return res(ctx.status(404), ctx.json({ message: 'Run was not found' }));
    }),
    artifactsSuccess: rest.get('/ajax-api/2.0/mlflow/artifacts/list', (req, res, ctx) => {
      return res(ctx.json({}));
    }),
  };

  const server = setupServer(
    // Setup handlers for the API calls
    apiHandlers.artifactsSuccess,
    apiHandlers.experimentsSuccess,
    apiHandlers.runsSuccess,
  );

  beforeAll(() => {
    server.listen();
  });

  const createPageUrl = ({
    experimentIds = ['123456789'],
    runUuids = ['experiment123456789_run1', 'experiment123456789_run2'],
  }: {
    runUuids?: string[];
    experimentIds?: string[];
  } = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('runs', JSON.stringify(runUuids));
    queryParams.append('experiments', JSON.stringify(experimentIds));
    return ['/?', queryParams.toString()].join('');
  };

  const renderTestComponent = (routerUrl = createPageUrl()) => {
    render(<CompareRunPage />, {
      wrapper: ({ children }) => (
        <MockedReduxStoreProvider
          state={
            {
              ...EXPERIMENT_RUNS_MOCK_STORE,
              compareExperiments: {},
            } as any
          }
        >
          <IntlProvider locale="en">
            <TestRouter routes={[testRoute(<>{children}</>, '/')]} history={history} initialEntries={[routerUrl]} />
          </IntlProvider>
        </MockedReduxStoreProvider>
      ),
    });
  };
  test('should render with minimal props', async () => {
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText(/Comparing 2 runs from 1 experiment/i)).toBeInTheDocument();
    });
  });

  test('should render error when experiment is not found', async () => {
    server.resetHandlers(apiHandlers.runsSuccess, apiHandlers.artifactsSuccess, apiHandlers.experimentsFailure);
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText(/Experiment 123456789 not found/)).toBeInTheDocument();
    });
  });

  test('should render error when run is not found', async () => {
    server.resetHandlers(apiHandlers.runsFailure, apiHandlers.artifactsSuccess, apiHandlers.experimentsSuccess);
    renderTestComponent();

    await waitFor(() => {
      expect(screen.getByText(/Run was not found/)).toBeInTheDocument();
    });
  });

  test('should display graceful message when URL is malformed', async () => {
    renderTestComponent('?runs=blah&experiments=123');

    await waitFor(() => {
      expect(screen.getByText(/Error while parsing URL(.+)/i)).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

````

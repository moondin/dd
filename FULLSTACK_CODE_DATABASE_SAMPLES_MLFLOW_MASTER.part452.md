---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 452
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 452 of 991)

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

---[FILE: ParallelCoordinatesPlotView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ParallelCoordinatesPlotView.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import {
  ParallelCoordinatesPlotView,
  generateAttributesForCategoricalDimension,
  createDimension,
  inferType,
  UNKNOWN_TERM,
} from './ParallelCoordinatesPlotView';

describe('unit tests', () => {
  let wrapper;
  let instance;
  let mininumProps: any;

  beforeEach(() => {
    mininumProps = {
      runUuids: ['runUuid_0', 'runUuid_1'],
      paramKeys: ['param_0', 'param_1'],
      metricKeys: ['metric_0', 'metric_1'],
      paramDimensions: [
        {
          label: 'param_0',
          values: [1, 2],
          tickformat: '.5f',
        },
        {
          label: 'param_1',
          values: [2, 3],
          tickformat: '.5f',
        },
      ],
      metricDimensions: [
        {
          label: 'metric_0',
          values: [1, 2],
          tickformat: '.5f',
        },
        {
          label: 'metric_1',
          values: [2, 3],
          tickformat: '.5f',
        },
      ],
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ParallelCoordinatesPlotView {...mininumProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('getDerivedStateFromProps should return null when the selections do not change', () => {
    const props = {
      paramKeys: ['param_0', 'param_1'],
      metricKeys: ['metric_0', 'metric_1'],
    };
    // state with different order but same selections
    const state = {
      sequence: ['param_0', 'metric_0', 'metric_1', 'param_1'],
    };
    expect(ParallelCoordinatesPlotView.getDerivedStateFromProps(props, state)).toBe(null);
  });

  test('getDerivedStateFromProps should return state when the selections changes', () => {
    const props = {
      paramKeys: ['param_0', 'param_1'],
      metricKeys: ['metric_0', 'metric_1', 'metric_2'], // props comes with an extra metric_2
    };
    const state = {
      sequence: ['param_0', 'metric_0', 'metric_1', 'param_1'],
    };
    expect(ParallelCoordinatesPlotView.getDerivedStateFromProps(props, state)).toEqual({
      sequence: ['param_0', 'param_1', 'metric_0', 'metric_1', 'metric_2'],
    });
  });

  test('maybeUpdateStateForColorScale should trigger setState when last metric change', () => {
    wrapper = shallow(<ParallelCoordinatesPlotView {...mininumProps} />);
    instance = wrapper.instance();
    instance.findLastMetricFromState = jest.fn(() => 'metric_1');
    instance.setState = jest.fn();
    instance.maybeUpdateStateForColorScale(['metric_1', 'metric_0']); // rightmost metric changes
    expect(instance.setState).toHaveBeenCalled();
  });

  test('maybeUpdateStateForColorScale should not trigger setState when last metric stays', () => {
    wrapper = shallow(<ParallelCoordinatesPlotView {...mininumProps} />);
    instance = wrapper.instance();
    instance.findLastMetricFromState = jest.fn(() => 'metric_1');
    instance.setState = jest.fn();
    instance.maybeUpdateStateForColorScale(['metric_0', 'metric_1']); // rightmost metric stays
    expect(instance.setState).not.toHaveBeenCalled();
  });

  test('generateAttributesForCategoricalDimension', () => {
    expect(generateAttributesForCategoricalDimension(['A', 'B', 'C', 'B', 'C'])).toEqual({
      values: [0, 1, 2, 1, 2],
      tickvals: [0, 1, 2],
      ticktext: ['A', 'B', 'C'],
    });
  });

  test('inferType works with numeric dimension', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 1 },
      },
      runUuid_1: {
        metric_0: { value: 2 },
      },
    };
    expect(inferType(key, runUuids, entryByRunUuid)).toBe('number');
  });

  test('inferType works with categorical dimension', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 'B' },
      },
      runUuid_1: {
        metric_0: { value: 'A' },
      },
    };
    expect(inferType(key, runUuids, entryByRunUuid)).toBe('string');
  });

  test('inferType works with numeric dimension that includes NaNs', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: NaN },
      },
      runUuid_1: {
        metric_0: { value: NaN },
      },
    };
    expect(inferType(key, runUuids, entryByRunUuid)).toBe('number');
  });

  test('inferType works with numeric dimension specified as strings', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: '1.0' },
      },
      runUuid_1: {
        metric_0: { value: 'NaN' },
      },
    };
    expect(inferType(key, runUuids, entryByRunUuid)).toBe('number');
  });

  test('inferType works with mixed string and number dimension', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: '1.0' },
      },
      runUuid_1: {
        metric_0: { value: 'this thing is a string' },
      },
    };
    expect(inferType(key, runUuids, entryByRunUuid)).toBe('string');
  });

  test('createDimension should work with numeric dimension', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 1 },
      },
      runUuid_1: {
        metric_0: { value: 2 },
      },
    };
    expect(createDimension(key, runUuids, entryByRunUuid)).toEqual({
      label: 'metric_0',
      values: [1, 2],
      tickformat: '.5f',
    });
  });

  test('createDimension should work with categorical dimension', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 'B' },
      },
      runUuid_1: {
        metric_0: { value: 'A' },
      },
    };
    expect(createDimension(key, runUuids, entryByRunUuid)).toEqual({
      label: 'metric_0',
      values: [1, 0],
      tickvals: [0, 1],
      ticktext: ['A', 'B'],
    });
  });

  test('createDimension should work with missing values and fill in NaN', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 1 },
      },
      runUuid_1: {},
    };
    expect(createDimension(key, runUuids, entryByRunUuid)).toEqual({
      label: 'metric_0',
      values: [1, 1.01],
      tickformat: '.5f',
    });
  });

  test('createDimension should work with NaN and fill in NaN', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 1 },
      },
      runUuid_1: {
        metric_0: { value: NaN },
      },
    };
    expect(createDimension(key, runUuids, entryByRunUuid)).toEqual({
      label: 'metric_0',
      values: [1, NaN],
      tickformat: '.5f',
    });
  });

  test('createDimension should work with undefined values for strings series', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 'True' },
      },
      runUuid_1: {},
    };
    expect(createDimension(key, runUuids, entryByRunUuid)).toEqual({
      label: 'metric_0',
      ticktext: ['True', UNKNOWN_TERM],
      tickvals: [0, 1],
      values: [0, 1],
    });
  });

  test('createDimension should work with undefined values for number series', () => {
    const key = 'metric_0';
    const runUuids = ['runUuid_0', 'runUuid_1'];
    const entryByRunUuid = {
      runUuid_0: {
        metric_0: { value: 1 },
      },
      runUuid_1: {},
    };
    expect(createDimension(key, runUuids, entryByRunUuid)).toEqual({
      label: 'metric_0',
      values: [1, 1.01],
      tickformat: '.5f',
    });
  });

  test('getColorScaleConfigsForDimension', () => {
    wrapper = shallow(<ParallelCoordinatesPlotView {...mininumProps} />);
    instance = wrapper.instance();
    const dimension = {
      label: 'metric_0',
      values: [3, 1, 2, 3, 0, 2],
    };
    expect(ParallelCoordinatesPlotView.getColorScaleConfigsForDimension(dimension)).toEqual({
      showscale: true,
      colorscale: 'Jet',
      cmin: 0,
      cmax: 3,
      color: [3, 1, 2, 3, 0, 2],
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ParallelCoordinatesPlotView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ParallelCoordinatesPlotView.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { connect } from 'react-redux';
import { findLast, invert, isEqual, max, min, range, sortBy, uniq } from 'lodash';
import { LazyPlot } from './LazyPlot';

const AXIS_LABEL_CLS = '.pcp-plot .parcoords .y-axis .axis-heading .axis-title';
export const UNKNOWN_TERM = 'unknown';

type ParallelCoordinatesPlotViewProps = {
  runUuids: string[];
  paramKeys: string[];
  metricKeys: string[];
  paramDimensions: any[];
  metricDimensions: any[];
};

type ParallelCoordinatesPlotViewState = any;

export class ParallelCoordinatesPlotView extends React.Component<
  ParallelCoordinatesPlotViewProps,
  ParallelCoordinatesPlotViewState
> {
  state = {
    // Current sequence of all axes, both parameters and metrics.
    sequence: [...this.props.paramKeys, ...this.props.metricKeys],
  };

  static getDerivedStateFromProps(props: any, state: any) {
    const keysFromProps = [...props.paramKeys, ...props.metricKeys];
    const keysFromState = state.sequence;
    if (!isEqual(sortBy(keysFromProps), sortBy(keysFromState))) {
      return { sequence: keysFromProps };
    }
    return null;
  }

  getData() {
    const { sequence } = this.state;
    const { paramDimensions, metricDimensions, metricKeys } = this.props;
    const lastMetricKey = this.findLastKeyFromState(metricKeys);
    const lastMetricDimension = this.props.metricDimensions.find((d) => d.label === lastMetricKey);
    const colorScaleConfigs = ParallelCoordinatesPlotView.getColorScaleConfigsForDimension(lastMetricDimension);
    // This make sure axis order consistency across renders.
    const orderedDimensions = ParallelCoordinatesPlotView.getDimensionsOrderedBySequence(
      [...paramDimensions, ...metricDimensions],
      sequence,
    );
    return [
      {
        type: 'parcoords',
        line: { ...colorScaleConfigs },
        dimensions: orderedDimensions,
      },
    ];
  }

  static getDimensionsOrderedBySequence(dimensions: any, sequence: any) {
    return sortBy(dimensions, [(dimension) => sequence.indexOf(dimension.label)]);
  }

  static getLabelElementsFromDom = () => Array.from(document.querySelectorAll(AXIS_LABEL_CLS));

  findLastKeyFromState(keys: any) {
    const { sequence } = this.state;
    const keySet = new Set(keys);
    return findLast(sequence, (key) => keySet.has(key));
  }

  static getColorScaleConfigsForDimension(dimension: any) {
    if (!dimension) return null;
    const cmin = min(dimension.values);
    const cmax = max(dimension.values);
    return {
      showscale: true,
      colorscale: 'Jet',
      cmin,
      cmax,
      color: dimension.values,
    };
  }

  // Update styles(green & bold) for metric axes.
  // Note(Zangr) 2019-6-25 this is needed because there is no per axis label setting available. This
  // needs to be called every time chart updates. More information about currently available label
  // setting here: https://plot.ly/javascript/reference/#parcoords-labelfont
  updateMetricAxisLabelStyle = () => {
    /* eslint-disable no-param-reassign */
    const metricsKeySet = new Set(this.props.metricKeys);
    // TODO(Zangr) 2019-06-20 This assumes name uniqueness across params & metrics. Find a way to
    // make it more deterministic. Ex. Add add different data attributes to indicate axis kind.
    ParallelCoordinatesPlotView.getLabelElementsFromDom()
      .filter((el) => metricsKeySet.has(el.innerHTML))
      .forEach((el) => {
        (el as any).style.fill = 'green';
        (el as any).style.fontWeight = 'bold';
      });
  };

  maybeUpdateStateForColorScale = (currentSequenceFromPlotly: any) => {
    const rightmostMetricKeyFromState = this.findLastKeyFromState(this.props.metricKeys);
    const metricsKeySet = new Set(this.props.metricKeys);
    const rightmostMetricKeyFromPlotly = findLast(currentSequenceFromPlotly, (key) => metricsKeySet.has(key));
    // Currently we always render color scale based on the rightmost metric axis, so if that changes
    // we need to setState with the new axes sequence to trigger a rerender.
    if (rightmostMetricKeyFromState !== rightmostMetricKeyFromPlotly) {
      this.setState({ sequence: currentSequenceFromPlotly });
    }
  };

  handlePlotUpdate = ({ data: [{ dimensions }] }: any) => {
    this.updateMetricAxisLabelStyle();
    this.maybeUpdateStateForColorScale(dimensions.map((d: any) => d.label));
  };

  render() {
    return (
      <LazyPlot
        layout={{ autosize: true, margin: { t: 50 } }}
        useResizeHandler
        css={styles.plot}
        data={this.getData()}
        onUpdate={this.handlePlotUpdate}
        className="pcp-plot"
        config={{ displayModeBar: false }}
      />
    );
  }
}

export const generateAttributesForCategoricalDimension = (labels: any) => {
  // Create a lookup from label to its own alphabetical sorted order.
  // Ex. ['A', 'B', 'C'] => { 'A': '0', 'B': '1', 'C': '2' }
  const sortedUniqLabels = uniq(labels).sort();

  // We always want the UNKNOWN_TERM to be at the top
  // of the chart which is end of the sorted label array
  // Ex. ['A', 'UNKNOWN_TERM', 'B'] => { 'A': '0', 'B': '1', 'UNKNOWN_TERM': '2' }
  let addUnknownTerm = false;
  const filteredSortedUniqLabels = sortedUniqLabels.filter((label) => {
    if (label === UNKNOWN_TERM) addUnknownTerm = true;
    return label !== UNKNOWN_TERM;
  });
  if (addUnknownTerm) {
    filteredSortedUniqLabels.push(UNKNOWN_TERM);
  }
  const labelToIndexStr = invert(filteredSortedUniqLabels);
  const attributes = {};

  // Values are assigned to their alphabetical sorted index number
  (attributes as any).values = labels.map((label: any) => Number(labelToIndexStr[label]));

  // Default to alphabetical order for categorical axis here. Ex. [0, 1, 2, 3 ...]
  (attributes as any).tickvals = range(filteredSortedUniqLabels.length);

  // Default to alphabetical order for categorical axis here. Ex. ['A', 'B', 'C', 'D' ...]
  (attributes as any).ticktext = filteredSortedUniqLabels.map((sortedUniqLabel) =>
    (sortedUniqLabel as any).substring(0, 10),
  );

  return attributes;
};

/**
 * Infer the type of data in a run. If all the values are numbers or castable to numbers, then
 * treat it as a number column.
 */
export const inferType = (key: any, runUuids: any, entryByRunUuid: any) => {
  for (let i = 0; i < runUuids.length; i++) {
    if (entryByRunUuid[runUuids[i]][key]) {
      const { value } = entryByRunUuid[runUuids[i]][key];
      if (typeof value === 'string' && isNaN(Number(value)) && value !== 'NaN') {
        return 'string';
      }
    }
  }
  return 'number';
};

export const createDimension = (key: any, runUuids: any, entryByRunUuid: any) => {
  let attributes = {};
  const dataType = inferType(key, runUuids, entryByRunUuid);
  if (dataType === 'string') {
    attributes = generateAttributesForCategoricalDimension(
      runUuids.map((runUuid: any) =>
        entryByRunUuid[runUuid][key] ? entryByRunUuid[runUuid][key].value : UNKNOWN_TERM,
      ),
    );
  } else {
    let maxValue = Number.MIN_SAFE_INTEGER;
    const values = runUuids.map((runUuid: any) => {
      if (entryByRunUuid[runUuid][key]) {
        const { value } = entryByRunUuid[runUuid][key];
        const numericValue = Number(value);
        if (maxValue < numericValue) maxValue = numericValue;
        return numericValue;
      }
      return UNKNOWN_TERM;
    });

    // For Numerical values, we take the max value of all the attribute
    // values and 0.01 to it so it is always at top of the graph.
    (attributes as any).values = values.map((value: any) => {
      if (value === UNKNOWN_TERM) return maxValue + 0.01;
      return value;
    });

    // For some reason, Plotly tries to plot these values with SI prefixes by default
    // Explicitly set to 5 fixed digits float here
    (attributes as any).tickformat = '.5f';
  }
  return {
    label: key,
    ...attributes,
  };
};

const styles = {
  plot: {
    width: '100%',
  },
};

const mapStateToProps = (state: any, ownProps: any) => {
  const { runUuids, paramKeys, metricKeys } = ownProps;
  const { latestMetricsByRunUuid, paramsByRunUuid } = state.entities;
  const paramDimensions = paramKeys.map((paramKey: any) => createDimension(paramKey, runUuids, paramsByRunUuid));
  const metricDimensions = metricKeys.map((metricKey: any) =>
    createDimension(metricKey, runUuids, latestMetricsByRunUuid),
  );
  return { paramDimensions, metricDimensions };
};

export default connect(mapStateToProps)(ParallelCoordinatesPlotView);
```

--------------------------------------------------------------------------------

---[FILE: PermissionDeniedView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/PermissionDeniedView.enzyme.test.tsx
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
import { PermissionDeniedView } from './PermissionDeniedView';

describe('PermissionDeniedView', () => {
  let wrapper;
  let minimalProps: any;
  const mockErrorMessage = 'This is a mock error message';
  const defaultMessage = 'The current user does not have permission to view this page.';

  beforeEach(() => {
    minimalProps = { errorMessage: mockErrorMessage };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<PermissionDeniedView {...minimalProps} />);
  });

  test('should render correct h2 text when error message is passed', () => {
    wrapper = shallow(<PermissionDeniedView {...minimalProps} />);
    expect(wrapper.childAt(2).text()).toBe(mockErrorMessage);
  });

  test('should render default message in h2 when no error message is passed', () => {
    wrapper = shallow(<PermissionDeniedView />);
    expect(wrapper.find('[data-testid="mlflow-error-message"]').text()).toBe(defaultMessage);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PermissionDeniedView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/PermissionDeniedView.tsx
Signals: React

```typescript
import React from 'react';
import permissionDeniedLock from '../../common/static/permission-denied-lock.svg';
import { useDesignSystemTheme } from '@databricks/design-system';

const defaultMessage = 'The current user does not have permission to view this page.';

type Props = {
  errorMessage?: string;
};

export function PermissionDeniedView({ errorMessage }: Props) {
  const { theme } = useDesignSystemTheme();
  return (
    <div className="mlflow-center">
      <img style={{ height: 300, marginTop: 80 }} src={permissionDeniedLock} alt="permission denied" />
      <h1 style={{ paddingTop: 10 }}>Permission Denied</h1>
      <h2 data-testid="mlflow-error-message" css={{ color: theme.colors.textSecondary }}>
        {errorMessage || defaultMessage}
      </h2>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: RunLinksPopover.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/RunLinksPopover.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import React from 'react';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { shallow, mount } from 'enzyme';

import { RunLinksPopover } from './RunLinksPopover';
import Routes from '../routes';

describe('unit tests', () => {
  let wrapper;
  let minimalProps: any;

  beforeEach(() => {
    minimalProps = {
      experimentId: '0',
      visible: false,
      x: 0,
      y: 0,
      runItems: [],
      handleClose: jest.fn(),
      handleKeyDown: jest.fn(),
      handleVisibleChange: jest.fn(),
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<RunLinksPopover {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should render two links when two run items are given', () => {
    const props = {
      ...minimalProps,
      visible: true,
      runItems: [
        {
          runId: 'runUuid1',
          name: 'run1',
          color: 'rgb(1, 1, 1)',
          y: 0.1,
        },
        {
          runId: 'runUuid2',
          name: 'run2',
          color: 'rgb(2, 2, 2)',
          y: 0.2,
        },
      ],
    };

    wrapper = mount(
      <MemoryRouter>
        <RunLinksPopover {...props} />
      </MemoryRouter>,
    ).find(RunLinksPopover);

    // The popover is attached to the document root and can't be found with wrapper.find.
    const popover = document.getElementsByClassName('ant-popover')[0];
    const links = popover.querySelectorAll('a[href]');
    expect(links.length).toBe(2);

    props.runItems.forEach(({ runId, name, color, y }: any, index: any) => {
      const link = links[index];
      const hrefExpected = Routes.getRunPageRoute(props.experimentId, runId);
      expect(link.getAttribute('href')).toBe(hrefExpected);

      const p = link.querySelector('p');
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      expect(p.textContent).toBe(`${name}, ${y}`);
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      expect(p.style.color).toBe(color);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunLinksPopover.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/RunLinksPopover.tsx
Signals: React

```typescript
import React from 'react';
import { Link } from '../../common/utils/RoutingUtils';
import Routes from '../routes';
import { IconButton } from '../../common/components/IconButton';
import Utils from '../../common/utils/Utils';
import { LegacyPopover } from '@databricks/design-system';
import { type RunItem } from '../types';

type Props = {
  experimentId: string;
  visible: boolean;
  x: number;
  y: number;
  runItems: RunItem[];
  handleClose: () => void;
  handleKeyDown: ({ key }: { key: string }) => void;
  handleVisibleChange: (visible: boolean) => void;
};

export class RunLinksPopover extends React.Component<Props> {
  componentDidMount() {
    document.addEventListener('keydown', this.props.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.props.handleKeyDown);
  }

  renderContent = () => {
    const { experimentId, runItems } = this.props;
    return (
      <div>
        {runItems.map(({ name, runId, color, y }, index) => {
          const key = `${runId}-${index}`;
          const to = Routes.getRunPageRoute(experimentId, runId);
          return (
            <Link key={key} to={to}>
              <p style={{ color }}>
                <i className="fa fa-external-link-o" style={{ marginRight: 5 }} />
                {`${name}, ${Utils.formatMetric(y)}`}
              </p>
            </Link>
          );
        })}
      </div>
    );
  };

  renderTitle = () => {
    const { handleClose } = this.props;
    return (
      <div>
        <span>Jump to individual runs</span>
        <IconButton
          icon={<i className="fa fa-times" />}
          onClick={handleClose}
          style={{ float: 'right', marginLeft: '7px' }}
        />
      </div>
    );
  };

  render() {
    const { visible, x, y, handleVisibleChange } = this.props;
    return (
      <LegacyPopover
        content={this.renderContent()}
        title={this.renderTitle()}
        placement="left"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <div
          style={{
            left: x,
            top: y,
            position: 'absolute',
          }}
        />
      </LegacyPopover>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RunNotFoundView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/RunNotFoundView.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { setupTestRouter, testRoute, TestRouter } from '../../common/utils/RoutingTestUtils';
import { RunNotFoundView } from './RunNotFoundView';

describe('RunNotFoundView', () => {
  const { history } = setupTestRouter();
  const mockRunId = 'This is a mock run ID';
  const minimalProps: any = { runId: mockRunId };

  const renderComponent = (props: any) => {
    return render(<RunNotFoundView {...props} />, {
      wrapper: ({ children }) => (
        <TestRouter
          history={history}
          initialEntries={['/test']}
          routes={[testRoute(<IntlProvider locale="en">{children}</IntlProvider>, '/test')]}
        />
      ),
    });
  };

  test('should render with minimal props without exploding', async () => {
    renderComponent(minimalProps);
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /run id this is a mock run id does not exist, go back to the home page\./i,
        }),
      ).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunNotFoundView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/RunNotFoundView.tsx

```typescript
import Routes from '../routes';
import { ErrorView } from '../../common/components/ErrorView';

type Props = {
  runId: string;
};

export function RunNotFoundView({ runId }: Props) {
  return (
    <ErrorView
      statusCode={404}
      subMessage={`Run ID ${runId} does not exist`}
      fallbackHomePageReactRoute={Routes.rootRoute}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: RunStatusIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/RunStatusIcon.tsx

```typescript
import { CheckCircleIcon, ClockIcon, Spinner, XCircleIcon, useDesignSystemTheme } from '@databricks/design-system';

const ErrorIcon = () => {
  const { theme } = useDesignSystemTheme();
  return <XCircleIcon css={{ color: theme.colors.textValidationDanger }} />;
};

const FinishedIcon = () => {
  const { theme } = useDesignSystemTheme();
  return <CheckCircleIcon css={{ color: theme.colors.textValidationSuccess }} />;
};

export const RunStatusIcon = ({ status, useSpinner }: { status: string; useSpinner?: boolean }) => {
  switch (status) {
    case 'FAILED':
    case 'KILLED':
      return <ErrorIcon />;
    case 'FINISHED':
      return <FinishedIcon />;
    case 'SCHEDULED':
    case 'RUNNING':
      return useSpinner ? <Spinner size="small" /> : <ClockIcon />;
    default:
      return null;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: RunView.nav.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/RunView.nav.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { renderWithIntl, screen, waitFor } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { RunPage } from './run-page/RunPage';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { EXPERIMENT_RUNS_MOCK_STORE } from './experiment-page/fixtures/experiment-runs.fixtures';
import { createMLflowRoutePath } from '../../common/utils/RoutingUtils';
import { testRoute, TestRouter } from '../../common/utils/RoutingTestUtils';
import userEvent from '@testing-library/user-event';
import { RoutePaths } from '../routes';
import { useRunDetailsPageData } from './run-page/hooks/useRunDetailsPageData';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { DesignSystemProvider } from '@databricks/design-system';

// Mock tab contents
jest.mock('./run-page/RunViewMetricCharts', () => ({
  // @ts-expect-error 'props' is of type 'unknown'
  RunViewMetricCharts: jest.fn((props) => <div>{props.mode} metric charts</div>),
}));
jest.mock('./run-page/RunViewOverview', () => ({
  RunViewOverview: jest.fn(() => <div>overview tab</div>),
}));
jest.mock('./run-page/RunViewArtifactTab', () => ({
  RunViewArtifactTab: jest.fn(() => <div>artifacts tab</div>),
}));
jest.mock('./run-page/RunViewHeaderRegisterModelButton', () => ({
  RunViewHeaderRegisterModelButton: jest.fn(() => <div>register model</div>),
}));
jest.mock('./run-page/hooks/useRunDetailsPageData', () => ({
  useRunDetailsPageData: jest.fn(),
}));

describe('RunView navigation integration test', () => {
  const renderComponent = (initialRoute = '/experiments/123456789/runs/experiment123456789_run1') => {
    const mockStore = configureStore([thunk, promiseMiddleware()]);
    const mockState = {
      ...EXPERIMENT_RUNS_MOCK_STORE,
      compareExperiments: {
        comparedExperimentIds: [],
        hasComparedExperimentsBefore: false,
      },
    };
    const queryClient = new QueryClient();
    const renderResult = renderWithIntl(
      <Provider store={mockStore(mockState)}>
        <QueryClientProvider client={queryClient}>
          <DesignSystemProvider>
            <TestRouter
              initialEntries={[createMLflowRoutePath(initialRoute)]}
              routes={[testRoute(<RunPage />, RoutePaths.runPageWithTab)]}
            />
          </DesignSystemProvider>
        </QueryClientProvider>
      </Provider>,
    );

    return renderResult;
  };
  beforeEach(() => {
    jest.mocked(useRunDetailsPageData).mockImplementation(
      () =>
        ({
          experiment: EXPERIMENT_RUNS_MOCK_STORE.entities.experimentsById['123456789'],
          runInfo: EXPERIMENT_RUNS_MOCK_STORE.entities.runInfosByUuid['experiment123456789_run1'],
          latestMetrics: {},
          tags: {},
          params: {},
          error: null,
          loading: false,
        } as any),
    );
  });
  test('should display overview by default and allow changing the tab', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('overview tab')).toBeInTheDocument();
      expect(screen.queryByText('model metric charts')).not.toBeInTheDocument();
      expect(screen.queryByText('system metric charts')).not.toBeInTheDocument();
      expect(screen.queryByText('artifacts tab')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('tab', { name: 'Model metrics' }));

    expect(screen.queryByText('overview tab')).not.toBeInTheDocument();
    expect(screen.queryByText('model metric charts')).toBeInTheDocument();
    expect(screen.queryByText('system metric charts')).not.toBeInTheDocument();
    expect(screen.queryByText('artifacts tab')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'System metrics' }));

    expect(screen.queryByText('overview tab')).not.toBeInTheDocument();
    expect(screen.queryByText('model metric charts')).not.toBeInTheDocument();
    expect(screen.queryByText('system metric charts')).toBeInTheDocument();
    expect(screen.queryByText('artifacts tab')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Artifacts' }));

    expect(screen.queryByText('overview tab')).not.toBeInTheDocument();
    expect(screen.queryByText('model metrics')).not.toBeInTheDocument();
    expect(screen.queryByText('system metrics')).not.toBeInTheDocument();
    expect(screen.queryByText('artifacts tab')).toBeInTheDocument();
  });

  test('should display artirfact tab if using a targeted artifact URL', async () => {
    renderComponent('/experiments/123456789/runs/experiment123456789_run1/artifacts/model/conda.yaml');

    await waitFor(() => {
      expect(screen.queryByText('artifacts tab')).toBeInTheDocument();
    });
  });

  test('should display artirfact tab if using a targeted artifact URL (legacy artifactPath pattern)', async () => {
    renderComponent('/experiments/123456789/runs/experiment123456789_run1/artifactPath/model/conda.yaml');
    await waitFor(() => {
      expect(screen.queryByText('artifacts tab')).toBeInTheDocument();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ArtifactViewComponents.types.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ArtifactViewComponents.types.ts

```typescript
import type { KeyValueEntity } from '../../../common/types';

export interface LoggedModelArtifactViewerProps {
  /**
   * Artifact viewer can also work with logged models instead of runs.
   * Set this to `true` to enable the logged models mode.
   */
  isLoggedModelsMode?: boolean;

  /**
   * ID of the logged model to display artifacts for. Works only in logged models mode.
   */
  loggedModelId?: string;

  /**
   * Indicates if the artifact viewer falls back from displaying run artifacts to logged model artifacts.
   * This is used when the run does not have the artifacts but the related logged model does.
   */
  isFallbackToLoggedModelArtifacts?: boolean;

  experimentId: string;

  entityTags?: Partial<KeyValueEntity>[];
}
```

--------------------------------------------------------------------------------

---[FILE: ArtifactViewErrorState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ArtifactViewErrorState.tsx
Signals: React

```typescript
import { Empty, DangerIcon } from '@databricks/design-system';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface ArtifactViewErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  description?: React.ReactNode;
  title?: React.ReactNode;
}

export const ArtifactViewErrorState = ({ description, title, ...props }: ArtifactViewErrorStateProps) => (
  <div
    css={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    {...props}
  >
    <Empty
      image={<DangerIcon />}
      title={
        title ?? (
          <FormattedMessage
            defaultMessage="Loading artifact failed"
            description="Run page > artifact view > error state > default error message"
          />
        )
      }
      description={description}
    />
  </div>
);
```

--------------------------------------------------------------------------------

---[FILE: ArtifactViewSkeleton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ArtifactViewSkeleton.tsx

```typescript
import { ParagraphSkeleton, useDesignSystemTheme, GenericSkeleton, TitleSkeleton } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

const SkeletonLines = ({ count }: { count: number }) => (
  <>
    {new Array(count).fill('').map((_, i) => (
      <ParagraphSkeleton
        key={i}
        seed={i.toString()}
        label={
          i === 0 ? (
            <FormattedMessage
              defaultMessage="Artifact loading"
              description="Run page > artifact view > loading skeleton label"
            />
          ) : undefined
        }
      />
    ))}
  </>
);

/**
 * Loading state for the artifact browser with sidepane and content area
 */
export const ArtifactViewBrowserSkeleton = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div css={{ display: 'flex', flex: 1 }}>
      <div css={{ flex: 1 }}>
        <div css={{ margin: theme.spacing.sm }}>
          <SkeletonLines count={9} />
        </div>
      </div>
      <div css={{ flex: 3, borderLeft: `1px solid ${theme.colors.border}` }}>
        <div css={{ margin: theme.spacing.sm }}>
          <TitleSkeleton css={{ marginBottom: theme.spacing.md }} />
          <SkeletonLines count={3} />

          <div css={{ width: '75%', marginTop: theme.spacing.md }}>
            <SkeletonLines count={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Generic loading state for the artifact viewer
 */
export const ArtifactViewSkeleton = (divProps: React.HTMLAttributes<HTMLDivElement>) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div data-testid="mlflow-artifact-view-skeleton" css={{ margin: theme.spacing.md }} {...divProps}>
      <SkeletonLines count={9} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FallbackToLoggedModelArtifactsInfo.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/FallbackToLoggedModelArtifactsInfo.tsx

```typescript
import { Alert, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../common/utils/RoutingUtils';
import { useGetLoggedModelQuery } from '../../hooks/logged-models/useGetLoggedModelQuery';
import Routes from '../../routes';

export const FallbackToLoggedModelArtifactsInfo = ({ loggedModelId }: { loggedModelId: string }) => {
  const { data } = useGetLoggedModelQuery({ loggedModelId });
  const experimentId = data?.info?.experiment_id;
  const { theme } = useDesignSystemTheme();
  return (
    <Alert
      type="info"
      componentId="mlflow.artifacts.logged_model_fallback_info"
      message={
        <FormattedMessage
          defaultMessage="You're viewing artifacts assigned to a <link>logged model</link> associated with this run."
          description="Alert message to inform the user that they are viewing artifacts assigned to a logged model associated with this run."
          values={{
            link: (chunks) =>
              experimentId ? (
                <Link to={Routes.getExperimentLoggedModelDetailsPage(experimentId, loggedModelId)}>{chunks}</Link>
              ) : (
                <>{chunks}</>
              ),
          }}
        />
      }
      closable={false}
      css={{ margin: theme.spacing.xs }}
    />
  );
};
```

--------------------------------------------------------------------------------

````

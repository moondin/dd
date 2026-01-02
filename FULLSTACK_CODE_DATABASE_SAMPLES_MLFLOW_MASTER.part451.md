---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 451
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 451 of 991)

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

---[FILE: MetricsSummaryTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricsSummaryTable.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { HtmlTableView } from './HtmlTableView';
import { getRunInfo } from '../reducers/Reducers';
import { getLatestMetrics, getMinMetrics, getMaxMetrics } from '../reducers/MetricReducer';
import Utils from '../../common/utils/Utils';
import { Link } from '../../common/utils/RoutingUtils';
import Routes from '../routes';
import type { RunInfoEntity } from '../types';

const maxTableHeight = 300;
// Because we make the table body scrollable, column widths must be fixed
// so that the header widths match the table body column widths.
const headerColWidth = 350;
const dataColWidth = 200;

type MetricsSummaryTableProps = {
  runUuids: string[];
  runExperimentIds: any;
  runDisplayNames: string[];
  metricKeys: string[];
  latestMetrics: any;
  minMetrics: any;
  maxMetrics: any;
  intl: {
    formatMessage: (...args: any[]) => any;
  };
};

class MetricsSummaryTable extends React.Component<MetricsSummaryTableProps> {
  render() {
    const { runUuids } = this.props;
    return (
      <div className="metrics-summary">
        {runUuids.length > 1 ? this.renderMetricTables() : this.renderRunTable(runUuids[0])}
      </div>
    );
  }

  renderRunTable(runUuid: any) {
    const { metricKeys, latestMetrics, minMetrics, maxMetrics, intl } = this.props;
    const columns = [
      {
        title: intl.formatMessage({
          defaultMessage: 'Metric',
          description:
            // eslint-disable-next-line max-len
            'Column title for the column displaying the metric names for a run',
        }),
        dataIndex: 'metricKey',
        sorter: (a: any, b: any) => (a.metricKey < b.metricKey ? -1 : a.metricKey > b.metricKey ? 1 : 0),
        width: headerColWidth,
      },
      ...this.dataColumns(),
    ];
    return metricKeys.length === 0 ? null : (
      <HtmlTableView
        columns={columns}
        values={getRunValuesByMetric(runUuid, metricKeys, latestMetrics, minMetrics, maxMetrics, intl)}
        scroll={{ y: maxTableHeight }}
      />
    );
  }

  renderMetricTables() {
    const { runExperimentIds, runUuids, runDisplayNames, metricKeys, latestMetrics, minMetrics, maxMetrics, intl } =
      this.props;
    const columns = [
      {
        title: intl.formatMessage({
          defaultMessage: 'Run',
          description:
            // eslint-disable-next-line max-len
            'Column title for the column displaying the run names for a metric',
        }),
        dataIndex: 'runLink',
        sorter: (a: any, b: any) => (a.runName < b.runName ? -1 : a.runName > b.runName ? 1 : 0),
        width: headerColWidth,
      },
      ...this.dataColumns(),
    ];
    return metricKeys.map((metricKey) => {
      return (
        <Fragment key={metricKey}>
          <h1>{metricKey}</h1>
          <HtmlTableView
            columns={columns}
            values={getMetricValuesByRun(
              metricKey,
              runExperimentIds,
              runUuids,
              runDisplayNames,
              latestMetrics,
              minMetrics,
              maxMetrics,
              intl,
            )}
            scroll={{ y: maxTableHeight }}
          />
        </Fragment>
      );
    });
  }

  dataColumns() {
    return [
      {
        title: this.props.intl.formatMessage({
          defaultMessage: 'Latest',
          description: 'Column title for the column displaying the latest metric values for a metric',
        }),
        dataIndex: 'latestFormatted',
        sorter: (a: any, b: any) => a.latestValue - b.latestValue,
        width: dataColWidth,
        ellipsis: true,
      },
      {
        title: this.props.intl.formatMessage({
          defaultMessage: 'Min',
          description: 'Column title for the column displaying the minimum metric values for a metric',
        }),
        dataIndex: 'minFormatted',
        sorter: (a: any, b: any) => a.minValue - b.minValue,
        width: dataColWidth,
        ellipsis: true,
      },
      {
        title: this.props.intl.formatMessage({
          defaultMessage: 'Max',
          description: 'Column title for the column displaying the maximum metric values for a metric',
        }),
        dataIndex: 'maxFormatted',
        sorter: (a: any, b: any) => a.maxValue - b.maxValue,
        width: dataColWidth,
        ellipsis: true,
      },
    ];
  }
}

const getMetricValuesByRun = (
  metricKey: any,
  runExperimentIds: any,
  runUuids: any,
  runDisplayNames: any,
  latestMetrics: any,
  minMetrics: any,
  maxMetrics: any,
  intl: any,
) => {
  return runUuids.map((runUuid: any, runIdx: any) => {
    const runName = runDisplayNames[runIdx];
    return {
      runName: runName,
      runLink: <Link to={Routes.getRunPageRoute(runExperimentIds[runUuid] || '', runUuid)}>{runName}</Link>,
      key: runUuid,
      ...rowData(runUuid, metricKey, latestMetrics, minMetrics, maxMetrics, intl),
    };
  });
};

const getRunValuesByMetric = (
  runUuid: any,
  metricKeys: any,
  latestMetrics: any,
  minMetrics: any,
  maxMetrics: any,
  intl: any,
) => {
  return metricKeys.map((metricKey: any) => {
    return {
      metricKey,
      key: metricKey,
      ...rowData(runUuid, metricKey, latestMetrics, minMetrics, maxMetrics, intl),
    };
  });
};

const rowData = (runUuid: any, metricKey: any, latestMetrics: any, minMetrics: any, maxMetrics: any, intl: any) => {
  const latestMetric = getMetric(latestMetrics, runUuid, metricKey);
  const minMetric = getMetric(minMetrics, runUuid, metricKey);
  const maxMetric = getMetric(maxMetrics, runUuid, metricKey);
  const latestValue = getValue(latestMetric);
  const minValue = getValue(minMetric);
  const maxValue = getValue(maxMetric);
  return {
    latestFormatted: (
      <span title={latestValue} css={{ marginRight: 10 }}>
        {formatMetric(latestMetric, intl)}
      </span>
    ),
    minFormatted: (
      <span title={minValue} css={{ marginRight: 10 }}>
        {formatMetric(minMetric, intl)}
      </span>
    ),
    maxFormatted: (
      <span title={maxValue} css={{ marginRight: 10 }}>
        {formatMetric(maxMetric, intl)}
      </span>
    ),
    latestValue,
    minValue,
    maxValue,
  };
};

const getMetric = (valuesMap: any, runUuid: any, metricKey: any) => valuesMap[runUuid] && valuesMap[runUuid][metricKey];

const getValue = (metric: any) => metric && metric.value;

const formatMetric = (metric: any, intl: any) =>
  metric === undefined
    ? ''
    : intl.formatMessage(
        {
          defaultMessage: '{value} (step={step})',
          description: 'Formats a metric value along with the step number it corresponds to',
        },
        {
          value: metric.value,
          step: metric.step,
        },
      );

const mapStateToProps = (state: any, ownProps: any) => {
  const { runUuids } = ownProps;
  const runExperimentIds = {};
  const latestMetrics = {};
  const minMetrics = {};
  const maxMetrics = {};
  runUuids.forEach((runUuid: any) => {
    const runInfo = getRunInfo(runUuid, state) as RunInfoEntity;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    runExperimentIds[runUuid] = runInfo && runInfo.experimentId;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    latestMetrics[runUuid] = getLatestMetrics(runUuid, state);
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    minMetrics[runUuid] = getMinMetrics(runUuid, state);
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    maxMetrics[runUuid] = getMaxMetrics(runUuid, state);
  });
  return { runExperimentIds, latestMetrics, minMetrics, maxMetrics };
};

// @ts-expect-error TS(2769): No overload matches this call.
const MetricsSummaryTableWithIntl = injectIntl(MetricsSummaryTable);

export default connect(mapStateToProps)(MetricsSummaryTableWithIntl);
```

--------------------------------------------------------------------------------

---[FILE: MetricView.css]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricView.css

```text
.mlflow-metrics-plot-container {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.mlflow-metrics-plot-container .plot-controls {
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.mlflow-metrics-plot-container .plot-controls .inline-control {
  margin-top: 25px;
  display: flex;
  align-items: center;
}

.mlflow-metrics-plot-container .plot-controls .inline-control .control-label {
  margin-right: 10px;
}

.mlflow-metrics-plot-container .plot-controls .block-control {
  margin-top: 25px;
}

.mlflow-metrics-plot-container .metrics-plot-data {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mlflow-metrics-plot-container .metrics-plot-view-container {
  min-height: 500px;
  flex: 1;
}

.mlflow-metrics-plot-container .metrics-summary {
  margin: 20px 20px 20px 60px;
}

.mlflow-metrics-plot-container .metrics-summary .mlflow-html-table-view {
  margin-bottom: 25px;
  /* Shrink to fit, so that scroll bars are aligned with the edge of the table */
  display: inline-block;
}

/* Reset min-width which is overridden in HtmlTableView as this breaks the
   table layout when scrolling is enabled and widths are specified */
.mlflow-metrics-plot-container .metrics-summary .mlflow-html-table-view th {
  min-width: auto;
}
```

--------------------------------------------------------------------------------

---[FILE: MetricView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricView.enzyme.test.tsx
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
import qs from 'qs';
import Fixtures from '../utils/test-utils/Fixtures';
import { MetricViewImpl } from './MetricView';
import Utils from '../../common/utils/Utils';
import MetricsPlotPanel from './MetricsPlotPanel';
import { PageHeader } from '../../shared/building_blocks/PageHeader';

const createLocation = (experimentIds: any, runUuids: any, metricKey: any) => {
  return {
    search:
      '?' +
      qs.stringify({
        experiments: experimentIds,
        runs: JSON.stringify(runUuids),
        plot_metric_keys: JSON.stringify([metricKey]),
      }),
  };
};

describe('MetricView', () => {
  let wrapper;
  let minimalProps: any;
  let experiments;
  let experimentIds;

  beforeEach(() => {
    experimentIds = ['2'];
    experiments = experimentIds.map((experimentId) =>
      Fixtures.createExperiment({
        experimentId: experimentId.toString(),
        name: experimentId.toString(),
        lifecycleStage: 'active',
      }),
    );

    minimalProps = {
      experiments,
      experimentIds,
      runUuids: [],
      runNames: [],
      metricKey: 'metricKey',
      location: createLocation(experimentIds, [''], 'metricKey'),
      navigate: jest.fn(),
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<MetricViewImpl {...minimalProps} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find(PageHeader).props().title).toContain('metricKey');
  });

  test('should render sub-components', () => {
    const mockNavigate = jest.fn();
    const props = {
      ...minimalProps,
      runUuids: ['a', 'b', 'c'],
      runNames: ['d', 'e', 'f'],
      navigate: mockNavigate,
    };

    // @ts-expect-error TS(2322): Type 'Mock<{ selectedMetricKeys: string[]; }, []>'... Remove this comment to see the full error message
    Utils.getMetricPlotStateFromUrl = jest.fn(() => {
      return { selectedMetricKeys: ['selectedKey'] };
    });

    wrapper = shallow(<MetricViewImpl {...props} />);

    const pageHeaderTitle = wrapper.find(PageHeader);
    const { title } = pageHeaderTitle.props();
    expect(title).toContain('selectedKey');

    const metricsPlotPanel = wrapper.find(MetricsPlotPanel);
    expect(metricsPlotPanel.length).toBe(1);
    expect(metricsPlotPanel.props().experimentIds).toEqual(['2']);
    expect(metricsPlotPanel.props().runUuids).toEqual(['a', 'b', 'c']);
    expect(metricsPlotPanel.props().metricKey).toBe('metricKey');
    expect(metricsPlotPanel.props().location).toEqual(props.location);
    expect(metricsPlotPanel.props().navigate).toBe(mockNavigate);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: MetricView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/MetricView.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Utils from '../../common/utils/Utils';
import './MetricView.css';
import { getExperiment, getRunInfo } from '../reducers/Reducers';
import MetricsPlotPanel from './MetricsPlotPanel';
import { Link } from '../../common/utils/RoutingUtils';
import type { Location } from '../../common/utils/RoutingUtils';
import { PageHeader } from '../../shared/building_blocks/PageHeader';
import Routes from '../routes';
import { withRouterNext } from '../../common/utils/withRouterNext';

type MetricViewImplProps = {
  experiments: any[]; // TODO: PropTypes.instanceOf(Experiment)
  experimentIds: string[];
  comparedExperimentIds?: string[];
  hasComparedExperimentsBefore?: boolean;
  runUuids: string[];
  runNames: string[];
  metricKey: string;
  location: Location;
  navigate: (path: string, options?: { replace?: boolean }) => void;
};

export class MetricViewImpl extends Component<MetricViewImplProps> {
  getCompareRunsPageText(numRuns: any, numExperiments: any) {
    return numExperiments > 1 ? (
      <FormattedMessage
        defaultMessage="Comparing {numRuns} Runs from {numExperiments} Experiments"
        // eslint-disable-next-line max-len
        description="Breadcrumb title for compare runs page with multiple experiments"
        values={{ numRuns, numExperiments }}
      />
    ) : (
      <FormattedMessage
        defaultMessage="Comparing {numRuns} Runs from 1 Experiment"
        description="Breadcrumb title for compare runs page with single experiment"
        values={{ numRuns }}
      />
    );
  }

  hasMultipleExperiments() {
    return this.props.experimentIds.length > 1;
  }

  getRunPageLink() {
    const { experimentIds, runUuids, runNames } = this.props;

    if (!runUuids || runUuids.length === 0) {
      return null;
    }

    if (runUuids.length === 1) {
      return <Link to={Routes.getRunPageRoute(experimentIds[0], runUuids[0])}>{runNames[0]}</Link>;
    }

    const text = this.getCompareRunsPageText(runUuids.length, experimentIds.length);
    return <Link to={Routes.getCompareRunPageRoute(runUuids, experimentIds)}>{text}</Link>;
  }

  getCompareExperimentsPageLinkText(numExperiments: any) {
    return (
      <FormattedMessage
        defaultMessage="Displaying Runs from {numExperiments} Experiments"
        // eslint-disable-next-line max-len
        description="Breadcrumb nav item to link to the compare-experiments page on compare runs page"
        values={{ numExperiments }}
      />
    );
  }

  getExperimentPageLink() {
    const { comparedExperimentIds, hasComparedExperimentsBefore, experimentIds, experiments } = this.props;

    if (hasComparedExperimentsBefore && comparedExperimentIds) {
      const text = this.getCompareExperimentsPageLinkText(comparedExperimentIds.length);
      return <Link to={Routes.getCompareExperimentsPageRoute(comparedExperimentIds)}>{text}</Link>;
    }

    if (this.hasMultipleExperiments()) {
      const text = this.getCompareExperimentsPageLinkText(experimentIds.length);
      return <Link to={Routes.getCompareExperimentsPageRoute(experimentIds)}>{text}</Link>;
    }

    return <Link to={Routes.getExperimentPageRoute(experimentIds[0])}>{experiments[0].name}</Link>;
  }

  render() {
    const { experimentIds, runUuids, metricKey, location } = this.props;
    const { selectedMetricKeys } = Utils.getMetricPlotStateFromUrl(location.search);
    const title =
      selectedMetricKeys.length > 1 ? (
        <FormattedMessage defaultMessage="Metrics" description="Title for metrics page" />
      ) : (
        selectedMetricKeys[0]
      );
    const breadcrumbs = [this.getExperimentPageLink(), this.getRunPageLink()];
    return (
      <div>
        <PageHeader title={title} breadcrumbs={breadcrumbs} hideSpacer />
        <MetricsPlotPanel
          experimentIds={experimentIds}
          runUuids={runUuids}
          metricKey={metricKey}
          location={location}
          navigate={this.props.navigate}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { comparedExperimentIds, hasComparedExperimentsBefore } = state.compareExperiments;
  const { experimentIds, runUuids } = ownProps;
  const experiments =
    experimentIds !== null ? experimentIds.map((experimentId: any) => getExperiment(experimentId, state)) : null;
  const runNames = runUuids.map((runUuid: any) => {
    const runInfo = getRunInfo(runUuid, state);
    return Utils.getRunDisplayName(runInfo, runUuid);
  });
  return { experiments, runNames, comparedExperimentIds, hasComparedExperimentsBefore };
};

export const MetricView = withRouterNext(connect(mapStateToProps)(MetricViewImpl));
```

--------------------------------------------------------------------------------

---[FILE: NotFoundPage.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/NotFoundPage.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  test('should render without exploding', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Resource not found.')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: NotFoundPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/NotFoundPage.tsx
Signals: React

```typescript
import React, { Component } from 'react';

class NotFoundPage extends Component {
  render() {
    return <div>Resource not found.</div>;
  }
}

export default NotFoundPage;
```

--------------------------------------------------------------------------------

---[FILE: ParallelCoordinatesPlotControls.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ParallelCoordinatesPlotControls.enzyme.test.tsx
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
import { shallow } from 'enzyme';
import { ParallelCoordinatesPlotControls } from './ParallelCoordinatesPlotControls';

describe('unit tests', () => {
  let wrapper;
  let mininumProps: any;

  beforeEach(() => {
    mininumProps = {
      paramKeys: ['param_0', 'param_1'],
      metricKeys: ['metric_0', 'metric_1'],
      selectedParamKeys: ['param_0', 'param_1'],
      selectedMetricKeys: ['metric_0', 'metric_1'],
      handleParamsSelectChange: jest.fn(),
      handleMetricsSelectChange: jest.fn(),
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ParallelCoordinatesPlotControls {...mininumProps} />);
    expect(wrapper.length).toBe(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ParallelCoordinatesPlotControls.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ParallelCoordinatesPlotControls.tsx

```typescript
import { Button, LegacySelect } from '@databricks/design-system';
import { type Theme } from '@emotion/react';
import { FormattedMessage } from 'react-intl';

type Props = {
  paramKeys: string[];
  metricKeys: string[];
  selectedParamKeys: string[];
  selectedMetricKeys: string[];
  handleParamsSelectChange: (paramValues: string[]) => void;
  handleMetricsSelectChange: (metricValues: string[]) => void;
  onClearAllSelect: () => void;
};

export function ParallelCoordinatesPlotControls({
  paramKeys,
  metricKeys,
  selectedParamKeys,
  selectedMetricKeys,
  handleParamsSelectChange,
  handleMetricsSelectChange,
  onClearAllSelect,
}: Props) {
  return (
    <div css={styles.wrapper}>
      <div>
        <FormattedMessage
          defaultMessage="Parameters:"
          description="Label text for parameters in parallel coordinates plot in MLflow"
        />
      </div>
      <LegacySelect
        mode="multiple"
        css={styles.select}
        placeholder={
          <FormattedMessage
            defaultMessage="Please select parameters"
            description="Placeholder text for parameters in parallel coordinates plot in MLflow"
          />
        }
        value={selectedParamKeys}
        onChange={handleParamsSelectChange}
      >
        {paramKeys.map((key) => (
          <LegacySelect.Option value={key} key={key}>
            {key}
          </LegacySelect.Option>
        ))}
      </LegacySelect>
      <div style={{ marginTop: 20 }}>
        <FormattedMessage
          defaultMessage="Metrics:"
          description="Label text for metrics in parallel coordinates plot in MLflow"
        />
      </div>
      <LegacySelect
        mode="multiple"
        css={styles.select}
        placeholder={
          <FormattedMessage
            defaultMessage="Please select metrics"
            description="Placeholder text for metrics in parallel coordinates plot in MLflow"
          />
        }
        value={selectedMetricKeys}
        onChange={handleMetricsSelectChange}
      >
        {metricKeys.map((key) => (
          <LegacySelect.Option value={key} key={key}>
            {key}
          </LegacySelect.Option>
        ))}
      </LegacySelect>
      <div style={{ marginTop: 20 }}>
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_parallelcoordinatesplotcontrols.tsx_84"
          data-testid="clear-button"
          onClick={onClearAllSelect}
        >
          <FormattedMessage
            defaultMessage="Clear All"
            description="String for the clear button to clear any selected parameters and metrics"
          />
        </Button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: (theme: Theme) => ({
    padding: `0 ${theme.spacing.xs}px`,
  }),
  select: { width: '100%' },
};
```

--------------------------------------------------------------------------------

---[FILE: ParallelCoordinatesPlotPanel.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ParallelCoordinatesPlotPanel.enzyme.test.tsx
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
import { ParallelCoordinatesPlotPanel, getDiffParams } from './ParallelCoordinatesPlotPanel';
import ParallelCoordinatesPlotView from './ParallelCoordinatesPlotView';

describe('unit tests', () => {
  let wrapper;
  let instance;
  let mininumProps: any;

  beforeEach(() => {
    mininumProps = {
      runUuids: ['runUuid_0', 'runUuid_1'],
      diffParamKeys: ['param_0', 'param_1'],
      sharedMetricKeys: ['metric_0', 'metric_1'],
      allParamKeys: ['param_0', 'param_1', 'param_2'],
      allMetricKeys: ['metric_0', 'metric_1', 'metric_2'],
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ParallelCoordinatesPlotPanel {...mininumProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should render empty component when no dimension is selected', () => {
    wrapper = shallow(<ParallelCoordinatesPlotPanel {...mininumProps} />);
    instance = wrapper.instance();
    expect(wrapper.find(ParallelCoordinatesPlotView)).toHaveLength(1);
    expect(wrapper.find('[data-testid="no-values-selected"]')).toHaveLength(0);
    instance.setState({
      selectedParamKeys: [],
      selectedMetricKeys: [],
    });
    expect(wrapper.find(ParallelCoordinatesPlotView)).toHaveLength(0);
    expect(wrapper.find('[data-testid="no-values-selected"]')).toHaveLength(1);
  });

  test('should select differing params correctly', () => {
    const runUuids = ['runId1', 'runId2', 'runId3'];
    const allParamKeys = ['param1', 'param2', 'param3'];
    const paramsByRunId = {
      runId1: { param1: { value: 1 }, param2: { value: 2 }, param3: { value: 3 } },
      runId2: { param1: { value: 1 }, param2: { value: 4 } },
      runId3: { param1: { value: 1 }, param2: { value: 3 } },
    };
    expect(getDiffParams(allParamKeys, runUuids, paramsByRunId)).toEqual(['param2', 'param3']);
  });

  test('should select differing params correctly when only one param', () => {
    const runUuids = ['runId1', 'runId2', 'runId3'];
    const allParamKeys = ['param1'];
    const paramsByRunId = {
      runId1: { param1: { value: 1 } },
      runId2: {},
      runId3: {},
    };
    expect(getDiffParams(allParamKeys, runUuids, paramsByRunId)).toEqual(['param1']);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ParallelCoordinatesPlotPanel.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/ParallelCoordinatesPlotPanel.tsx
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
import ParallelCoordinatesPlotView from './ParallelCoordinatesPlotView';
import { ParallelCoordinatesPlotControls } from './ParallelCoordinatesPlotControls';
import {
  getAllParamKeysByRunUuids,
  getAllMetricKeysByRunUuids,
  getSharedMetricKeysByRunUuids,
  getRunInfo,
} from '../reducers/Reducers';
import { isEmpty } from 'lodash';
import { CompareRunPlotContainer } from './CompareRunPlotContainer';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@databricks/design-system';

type ParallelCoordinatesPlotPanelProps = {
  runUuids: string[];
  allParamKeys: string[];
  allMetricKeys: string[];
  sharedMetricKeys: string[];
  diffParamKeys: string[];
};

type ParallelCoordinatesPlotPanelState = any;

export class ParallelCoordinatesPlotPanel extends React.Component<
  ParallelCoordinatesPlotPanelProps,
  ParallelCoordinatesPlotPanelState
> {
  state = {
    // Default to select differing parameters. Sort alphabetically (to match
    // highlighted params in param table), then cap at first 3
    selectedParamKeys: this.props.diffParamKeys.sort().slice(0, 3),
    // Default to select the first metric key.
    // Note that there will be no color scaling if no metric is selected.
    selectedMetricKeys: this.props.sharedMetricKeys.slice(0, 1),
  };

  handleParamsSelectChange = (paramValues: any) => {
    this.setState({ selectedParamKeys: paramValues });
  };

  handleMetricsSelectChange = (metricValues: any) => {
    this.setState({ selectedMetricKeys: metricValues });
  };

  onClearAllSelect = () => {
    this.setState({ selectedParamKeys: [], selectedMetricKeys: [] });
  };

  render() {
    const { runUuids, allParamKeys, allMetricKeys } = this.props;
    const { selectedParamKeys, selectedMetricKeys } = this.state;
    return (
      <CompareRunPlotContainer
        controls={
          <ParallelCoordinatesPlotControls
            paramKeys={allParamKeys}
            metricKeys={allMetricKeys}
            selectedParamKeys={selectedParamKeys}
            selectedMetricKeys={selectedMetricKeys}
            handleMetricsSelectChange={this.handleMetricsSelectChange}
            handleParamsSelectChange={this.handleParamsSelectChange}
            onClearAllSelect={this.onClearAllSelect}
          />
        }
      >
        {!isEmpty(selectedParamKeys) || !isEmpty(selectedMetricKeys) ? (
          <ParallelCoordinatesPlotView
            runUuids={runUuids}
            paramKeys={selectedParamKeys}
            metricKeys={selectedMetricKeys}
          />
        ) : (
          // @ts-expect-error TS(2322): Type '(theme: any) => { padding: any; textAlign: s... Remove this comment to see the full error message
          <div css={styles.noValuesSelected} data-testid="no-values-selected">
            <Typography.Title level={2}>
              <FormattedMessage
                defaultMessage="Nothing to compare!"
                // eslint-disable-next-line max-len
                description="Header displayed in the metrics and params compare plot when no values are selected"
              />
            </Typography.Title>
            <FormattedMessage
              defaultMessage="Please select parameters and/or metrics to display the comparison."
              // eslint-disable-next-line max-len
              description="Explanation displayed in the metrics and params compare plot when no values are selected"
            />
          </div>
        )}
      </CompareRunPlotContainer>
    );
  }
}

export const getDiffParams = (allParamKeys: any, runUuids: any, paramsByRunUuid: any) => {
  const diffParamKeys: any = [];
  allParamKeys.forEach((param: any) => {
    // collect all values for this param
    const paramVals = runUuids.map(
      (runUuid: any) => paramsByRunUuid[runUuid][param] && paramsByRunUuid[runUuid][param].value,
    );
    if (!paramVals.every((x: any, i: any, arr: any) => x === arr[0])) diffParamKeys.push(param);
  });
  return diffParamKeys;
};

const mapStateToProps = (state: any, ownProps: any) => {
  const { runUuids: allRunUuids } = ownProps;

  // Filter out runUuids that do not have corresponding runInfos
  const runUuids = (allRunUuids ?? []).filter((uuid: string) => getRunInfo(uuid, state));
  const allParamKeys = getAllParamKeysByRunUuids(runUuids, state);
  const allMetricKeys = getAllMetricKeysByRunUuids(runUuids, state);
  const sharedMetricKeys = getSharedMetricKeysByRunUuids(runUuids, state);
  const { paramsByRunUuid } = state.entities;
  const diffParamKeys = getDiffParams(allParamKeys, runUuids, paramsByRunUuid);

  return {
    allParamKeys,
    allMetricKeys,
    sharedMetricKeys,
    diffParamKeys,
  };
};

const styles = {
  noValuesSelected: (theme: any) => ({
    padding: theme.spacing.md,
    textAlign: 'center',
  }),
};

// @ts-expect-error TS(2345): Argument of type 'typeof ParallelCoordinatesPlotPa... Remove this comment to see the full error message
export default connect(mapStateToProps)(ParallelCoordinatesPlotPanel);
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 598
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 598 of 991)

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

---[FILE: CompareModelVersionsView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CompareModelVersionsView.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, test, expect } from '@jest/globals';
import { CompareModelVersionsView, CompareModelVersionsViewImpl } from './CompareModelVersionsView';
import React from 'react';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';

describe('unconnected tests', () => {
  let wrapper;
  let minimumProps: any;
  let minimalStore: any;
  let commonProps: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  beforeEach(() => {
    minimumProps = {
      modelName: 'test',
      versionsToRuns: { 1: '123', 2: 'somebadrunID' },
      runUuids: ['123'],
      runInfos: [],
      runInfosValid: [],
      metricLists: [],
      paramLists: [],
      runNames: [],
      runDisplayNames: [],
      inputsListByName: [],
      inputsListByIndex: [],
      outputsListByName: [],
      outputsListByIndex: [],
    };
    minimalStore = mockStore({
      entities: {
        runInfosByUuid: { 123: { dummy_key: 'dummy_value' } },
        latestMetricsByRunUuid: {
          123: [{ key: 'test_metric', value: 0.0 }],
        },
        paramsByRunUuid: { 123: [{ key: 'test_param', value: '0.0' }] },
        tagsByRunUuid: { 123: [{ key: 'test_tag', value: 'test.user' }] },
        mlModelArtifactByModelVersion: {},
      },
      apis: {},
    });
    commonProps = {
      ...minimumProps,
      runInfos: [
        {
          runUuid: '123',
          experimentId: '0',
          userId: 'test.user',
          status: 'FINISHED',
          startTime: '0',
          endTime: '21',
          artifactUri: './mlruns',
          lifecycleStage: 'active',
        },
        {
          runUuid: 'somebadrunID',
        },
      ],
      runInfosValid: [true, false],
      metricLists: [[{ key: 'test_metric', value: 0.0 }]],
      paramLists: [[{ key: 'test_param', value: '0.0' }]],
      inputsListByName: [],
      inputsListByIndex: [],
      outputsListByName: [],
      outputsListByIndex: [],
    };
  });
  test('unconnected should render with minimal props without exploding', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CompareModelVersionsView {...minimumProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.length).toBe(1);
  });
  test('check that the component renders correctly with common props', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CompareModelVersionsView {...commonProps} />
        </MemoryRouter>
      </Provider>,
    );
    // Checking the breadcrumb renders correctly
    expect(wrapper.containsAllMatchingElements(['Registered Models', 'test', 'Comparing 2 Versions'])).toEqual(true);
    // Checking the model version shows up
    expect(wrapper.containsAllMatchingElements(['Model Version:', '1'])).toEqual(true);
    expect(wrapper.containsAllMatchingElements(['Model Version:', '2'])).toEqual(true);
  });
});

describe('connected tests', () => {
  let wrapper;
  let minimumProps: any;
  let minimalStore: any;
  let commonStore: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  beforeEach(() => {
    minimumProps = {
      modelName: 'test',
      versionsToRuns: { 1: '123' },
    };
    minimalStore = mockStore({
      entities: {
        runInfosByUuid: { 123: { dummy_key: 'dummy_value' } },
        latestMetricsByRunUuid: {
          123: [{ key: 'test_metric', value: 0.0 }],
        },
        paramsByRunUuid: { 123: [{ key: 'test_param', value: '0.0' }] },
        tagsByRunUuid: { 123: [{ key: 'test_tag', value: 'test.user' }] },
        mlModelArtifactByModelVersion: {},
      },
      apis: {},
    });
    commonStore = mockStore({
      entities: {
        runInfosByUuid: {
          123: {
            runUuid: '123',
            experimentId: '0',
            userId: 'test.user',
            status: 'FINISHED',
            startTime: '0',
            endTime: '21',
            artifactUri: './mlruns',
            lifecycleStage: 'active',
          },
        },
        latestMetricsByRunUuid: {
          123: [{ key: 'test_metric', value: 0.0, timestamp: '321', step: '42' }],
        },
        paramsByRunUuid: { 123: [{ key: 'test_param', value: '0.0' }] },
        tagsByRunUuid: { 123: [{ key: 'test_tag', value: 'test.user' }] },
        mlModelArtifactByModelVersion: {
          test: {
            1: {
              signature: {
                inputs:
                  '[{"name": "sepal length (cm)", "type": "double"}, ' +
                  '{"name": "sepal width (cm)", "type": "double"}, ' +
                  '{"name": "petal length (cm)", "type": "double"}, ' +
                  '{"name":"petal width (cm)", "type": "double"}, ' +
                  '{"type": "double"}]',
                outputs: '[{"type": "double"}]',
              },
            },
          },
        },
      },
      apis: {},
    });
  });
  test('connected should render with minimal props and minimal store without exploding', () => {
    wrapper = mountWithIntl(
      <Provider store={minimalStore}>
        <MemoryRouter>
          <CompareModelVersionsView {...minimumProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find(CompareModelVersionsView).length).toBe(1);
  });
  test('connected should render with minimal props and common store correctly', () => {
    wrapper = mountWithIntl(
      <Provider store={commonStore}>
        <MemoryRouter>
          <CompareModelVersionsView {...minimumProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find(CompareModelVersionsView).length).toBe(1);
    // Checking the breadcrumb renders correctly
    expect(wrapper.containsAllMatchingElements(['Registered Models', 'test', 'Comparing 1 Versions'])).toEqual(true);
    // Checking the model version shows up
    expect(wrapper.containsAllMatchingElements(['Model Version:', '1'])).toEqual(true);
  });
  test('validate that comparison works with null run IDs or invalid run IDs', () => {
    const testProps = {
      modelName: 'test',
      versionsToRuns: { 1: '123', 2: null, 3: 'cats' },
    };
    wrapper = mountWithIntl(
      <Provider store={commonStore}>
        <MemoryRouter>
          <CompareModelVersionsView {...testProps} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper.find(CompareModelVersionsView).length).toBe(1);
    // Checking the breadcrumb renders correctly
    expect(wrapper.containsAllMatchingElements(['Registered Models', 'test', 'Comparing 3 Versions'])).toEqual(true);
    // Checking the model version shows up
    expect(wrapper.containsAllMatchingElements(['Model Version:', '1'])).toEqual(true);
  });
  test('inputsList and outputsList props contains correct columns', () => {
    wrapper = mountWithIntl(
      <Provider store={commonStore}>
        <MemoryRouter>
          <CompareModelVersionsView {...minimumProps} />
        </MemoryRouter>
      </Provider>,
    );
    const props = wrapper.find(CompareModelVersionsViewImpl).props();
    expect(props.inputsListByName).toEqual([
      [
        { key: 'sepal length (cm)', value: 'double' },
        { key: 'sepal width (cm)', value: 'double' },
        { key: 'petal length (cm)', value: 'double' },
        { key: 'petal width (cm)', value: 'double' },
        { key: '-', value: 'double' },
      ],
    ]);
    expect(props.inputsListByIndex).toEqual([
      [
        { key: 0, value: 'sepal length (cm): double' },
        { key: 1, value: 'sepal width (cm): double' },
        { key: 2, value: 'petal length (cm): double' },
        { key: 3, value: 'petal width (cm): double' },
        { key: 4, value: 'double' },
      ],
    ]);
    expect(props.outputsListByName).toEqual([[{ key: '-', value: 'double' }]]);
    expect(props.outputsListByIndex).toEqual([[{ key: 0, value: 'double' }]]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CompareModelVersionsView.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/CompareModelVersionsView.tsx
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
import { Link } from '../../common/utils/RoutingUtils';
import { every, isEmpty, uniq } from 'lodash';
import type { IntlShape } from 'react-intl';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Switch, LegacyTabs, useDesignSystemTheme } from '@databricks/design-system';

import { getParams, getRunInfo } from '../../experiment-tracking/reducers/Reducers';
import '../../experiment-tracking/components/CompareRunView.css';
import { CompareRunScatter } from '../../experiment-tracking/components/CompareRunScatter';
import { CompareRunBox } from '../../experiment-tracking/components/CompareRunBox';
import CompareRunContour from '../../experiment-tracking/components/CompareRunContour';
import Routes from '../../experiment-tracking/routes';
import { getLatestMetrics } from '../../experiment-tracking/reducers/MetricReducer';
import CompareRunUtil from '../../experiment-tracking/components/CompareRunUtil';
import Utils from '../../common/utils/Utils';
import ParallelCoordinatesPlotPanel from '../../experiment-tracking/components/ParallelCoordinatesPlotPanel';
import { ModelRegistryRoutes } from '../routes';
import { getModelVersionSchemas } from '../reducers';
import { PageHeader } from '../../shared/building_blocks/PageHeader';
import type { RunInfoEntity } from '../../experiment-tracking/types';

const { TabPane } = LegacyTabs;

function CenteredText(props: any) {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        textAlign: 'center',
        color: theme.colors.textSecondary,
      }}
      {...props}
    />
  );
}

function CompareTable(props: any) {
  const { theme } = useDesignSystemTheme();
  return (
    <table
      className="mlflow-compare-table table"
      css={{
        'th.main-table-header': {
          backgroundColor: theme.colors.white,
          padding: 0,
        },
        'td.highlight-data': {
          backgroundColor: theme.colors.backgroundValidationWarning,
        },
      }}
      {...props}
    />
  );
}

function CollapseButton(props: any) {
  const { theme } = useDesignSystemTheme();
  return (
    <button
      css={{
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        backgroundColor: theme.colors.white,
        paddingLeft: 0,
        cursor: 'pointer',
      }}
      {...props}
    />
  );
}

type CompareModelVersionsViewImplProps = {
  runInfos: RunInfoEntity[];
  runInfosValid: boolean[];
  runUuids: string[];
  metricLists: any[][];
  paramLists: any[][];
  runNames: string[];
  runDisplayNames: string[];
  modelName: string;
  versionsToRuns: any;
  // @ts-expect-error TS(2314): Generic type 'Array<T>' requires 1 type argument(s... Remove this comment to see the full error message
  inputsListByName: Array[];
  // @ts-expect-error TS(2314): Generic type 'Array<T>' requires 1 type argument(s... Remove this comment to see the full error message
  inputsListByIndex: Array[];
  // @ts-expect-error TS(2314): Generic type 'Array<T>' requires 1 type argument(s... Remove this comment to see the full error message
  outputsListByName: Array[];
  // @ts-expect-error TS(2314): Generic type 'Array<T>' requires 1 type argument(s... Remove this comment to see the full error message
  outputsListByIndex: Array[];
  intl: IntlShape;
};

type CompareModelVersionsViewImplState = any;

export class CompareModelVersionsViewImpl extends Component<
  CompareModelVersionsViewImplProps,
  CompareModelVersionsViewImplState
> {
  state = {
    inputActive: true,
    outputActive: true,
    paramsToggle: true,
    paramsActive: true,
    schemaToggle: true,
    compareByColumnNameToggle: false,
    schemaActive: true,
    metricToggle: true,
    metricActive: true,
  };

  icons = {
    plusIcon: <i className="fa fa-plus-square-o" />,
    minusIcon: <i className="fa fa-minus-square-o" />,
    downIcon: <i className="fa fa-caret-down" />,
    rightIcon: <i className="fa fa-caret-right" />,
    chartIcon: <i className="fa fa-line-chart padding-left-text" />,
  };

  onToggleClick = (active: any) => {
    this.setState((state: any) => ({
      [active]: !state[active],
    }));
  };

  render() {
    const {
      inputsListByIndex,
      inputsListByName,
      modelName,
      outputsListByIndex,
      outputsListByName,
      runInfos,
      runUuids,
      runDisplayNames,
      paramLists,
      metricLists,
    } = this.props;
    const title = (
      <FormattedMessage
        defaultMessage="Comparing {numVersions} Versions"
        description="Text for main title for the model comparison page"
        values={{ numVersions: this.props.runInfos.length }}
      />
    );
    const breadcrumbs = [
      // eslint-disable-next-line react/jsx-key
      <Link to={ModelRegistryRoutes.modelListPageRoute}>
        <FormattedMessage
          defaultMessage="Registered Models"
          description="Text for registered model link in the title for model comparison page"
        />
      </Link>,
      // eslint-disable-next-line react/jsx-key
      <Link to={ModelRegistryRoutes.getModelPageRoute(modelName)}>{modelName}</Link>,
    ];

    return (
      <div
        className="CompareModelVersionsView"
        // @ts-expect-error TS(2322): Type '{ '.mlflow-compare-table': { minWidth: number; }; '... Remove this comment to see the full error message
        css={{
          ...styles.compareModelVersionsView,
          ...styles.wrapper(runInfos.length),
        }}
      >
        <PageHeader title={title} breadcrumbs={breadcrumbs} />
        <div className="mlflow-responsive-table-container">
          <CompareTable>
            {this.renderTableHeader()}
            {this.renderModelVersionInfo()}
            {this.renderSectionHeader(
              'paramsActive',
              'paramsToggle',
              <FormattedMessage
                defaultMessage="Parameters"
                description="Table title text for parameters table in the model comparison page"
              />,
            )}
            {this.renderParams()}
            {this.renderSectionHeader(
              'schemaActive',
              'schemaToggle',
              <FormattedMessage
                defaultMessage="Schema"
                description="Table title text for schema table in the model comparison page"
              />,
              false,
              // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
              <Switch
                className="toggle-switch"
                // @ts-expect-error TS(2322): Type '{ className: string; style: { marginLeft: st... Remove this comment to see the full error message
                style={{ marginLeft: 'auto' }}
                onChange={() => this.onToggleClick('compareByColumnNameToggle')}
              />,
              <div className="padding-left-text padding-right-text">
                <span>
                  <FormattedMessage
                    defaultMessage="Ignore column ordering"
                    description="Toggle text that determines whether to ignore column order in the
                      model comparison page"
                  />
                </span>
              </div>,
            )}
            {this.renderSchemaSectionHeader(
              'inputActive',
              <FormattedMessage
                defaultMessage="Inputs"
                description="Table subtitle for schema inputs in the model comparison page"
              />,
            )}
            {this.renderSchema(
              'inputActive',
              <FormattedMessage
                defaultMessage="Inputs"
                description="Table section name for schema inputs in the model comparison page"
              />,
              inputsListByIndex,
              inputsListByName,
            )}
            {this.renderSchemaSectionHeader(
              'outputActive',
              <FormattedMessage
                defaultMessage="Outputs"
                description="Table subtitle for schema outputs in the model comparison page"
              />,
            )}
            {this.renderSchema(
              'outputActive',
              <FormattedMessage
                defaultMessage="Outputs"
                description="Table section name for schema outputs in the model comparison page"
              />,
              outputsListByIndex,
              outputsListByName,
            )}
            {this.renderSectionHeader(
              'metricActive',
              'metricToggle',
              <FormattedMessage
                defaultMessage="Metrics"
                description="Table title text for metrics table in the model comparison page"
              />,
            )}
            {this.renderMetrics()}
          </CompareTable>
        </div>
        <LegacyTabs>
          <TabPane
            tab={
              <FormattedMessage
                defaultMessage="Parallel Coordinates Plot"
                description="Tab text for parallel coordinates plot on the model comparison page"
              />
            }
            key="parallel-coordinates-plot"
          >
            <ParallelCoordinatesPlotPanel runUuids={runUuids} />
          </TabPane>
          <TabPane
            tab={
              <FormattedMessage
                defaultMessage="Scatter Plot"
                description="Tab text for scatter plot on the model comparison page"
              />
            }
            key="scatter-plot"
          >
            <CompareRunScatter runUuids={runUuids} runDisplayNames={runDisplayNames} />
          </TabPane>
          <TabPane
            tab={
              <FormattedMessage
                defaultMessage="Box Plot"
                description="Tab pane title for box plot on the compare runs page"
              />
            }
            key="box-plot"
          >
            <CompareRunBox runUuids={runUuids} runInfos={runInfos} paramLists={paramLists} metricLists={metricLists} />
          </TabPane>
          <TabPane
            tab={
              <FormattedMessage
                defaultMessage="Contour Plot"
                description="Tab text for contour plot on the model comparison page"
              />
            }
            key="contour-plot"
          >
            <CompareRunContour runUuids={runUuids} runDisplayNames={runDisplayNames} />
          </TabPane>
        </LegacyTabs>
      </div>
    );
  }

  renderTableHeader() {
    const { runInfos, runInfosValid } = this.props;
    return (
      <thead>
        <tr className="table-row">
          <th scope="row" className="row-header block-content">
            <FormattedMessage
              defaultMessage="Run ID:"
              description="Text for run ID header in the main table in the model comparison page"
            />
          </th>
          {runInfos.map((r, idx) => (
            <th scope="column" className="data-value block-content" key={r.runUuid}>
              {/* Do not show links for invalid run IDs */}
              {runInfosValid[idx] ? (
                <Link to={Routes.getRunPageRoute(r.experimentId ?? '0', r.runUuid ?? '')}>{r.runUuid}</Link>
              ) : (
                r.runUuid
              )}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  renderModelVersionInfo() {
    const { runInfos, runInfosValid, versionsToRuns, runNames, modelName } = this.props;
    return (
      <tbody className="scrollable-table">
        <tr className="table-row">
          <th scope="row" className="data-value block-content">
            <FormattedMessage
              defaultMessage="Model Version:"
              description="Text for model version row header in the main table in the model
                comparison page"
            />
          </th>
          {Object.keys(versionsToRuns).map((modelVersion) => {
            const run = versionsToRuns[modelVersion];
            return (
              <td className="meta-info block-content" key={run}>
                <Link to={ModelRegistryRoutes.getModelVersionPageRoute(modelName, modelVersion)}>{modelVersion}</Link>
              </td>
            );
          })}
        </tr>
        <tr className="table-row">
          <th scope="row" className="data-value block-content">
            <FormattedMessage
              defaultMessage="Run Name:"
              description="Text for run name row header in the main table in the model comparison
                page"
            />
          </th>
          {runNames.map((runName, i) => {
            return (
              <td className="meta-info block-content" key={runInfos[i].runUuid}>
                <div className="truncate-text single-line cell-content">{runName}</div>
              </td>
            );
          })}
        </tr>
        <tr className="table-row">
          <th scope="row" className="data-value block-content">
            <FormattedMessage
              defaultMessage="Start Time:"
              description="Text for start time row header in the main table in the model comparison
                page"
            />
          </th>
          {runInfos.map((run, idx) => {
            /* Do not attempt to get timestamps for invalid run IDs */
            const startTime =
              run.startTime && runInfosValid[idx] ? Utils.formatTimestamp(run.startTime, this.props.intl) : '(unknown)';
            return (
              <td className="meta-info block-content" key={run.runUuid}>
                {startTime}
              </td>
            );
          })}
        </tr>
      </tbody>
    );
  }

  /* additional Switch and Text are antd Switch component and the text followed by the toggle switch
  this is currently used in schema section where we have an additional switch toggle for
  ignore column ordering, same logic can be applied if future section needs additional toggle */
  renderSectionHeader(
    activeSection: any,
    toggleSection: any,
    sectionName: any,
    leftToggle = true,
    additionalSwitch = null,
    additionalSwitchText = null,
  ) {
    const { runInfos } = this.props;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const isActive = this.state[activeSection];
    const { downIcon, rightIcon } = this.icons;
    return (
      <tbody>
        <tr>
          <th scope="rowgroup" className="block-content main-table-header" colSpan={runInfos.length + 1}>
            <div className="switch-button-container">
              <CollapseButton onClick={() => this.onToggleClick(activeSection)}>
                {isActive ? downIcon : rightIcon}
                <span className="header">{sectionName}</span>
              </CollapseButton>
              {additionalSwitch}
              {additionalSwitchText}
              <Switch
                defaultChecked
                className="toggle-switch"
                // @ts-expect-error TS(2322): Type '{ defaultChecked: true; className: string; s... Remove this comment to see the full error message
                style={leftToggle ? { marginLeft: 'auto' } : {}}
                onChange={() => this.onToggleClick(toggleSection)}
              />
              <div className="padding-left-text">
                <span>
                  <FormattedMessage
                    defaultMessage="Show diff only"
                    description="Toggle text that determines whether to show diff only in the model
                      comparison page"
                  />
                </span>
              </div>
            </div>
          </th>
        </tr>
      </tbody>
    );
  }

  renderParams() {
    return (
      <tbody className="scrollable-table">
        {this.renderDataRows(
          this.props.paramLists,
          <FormattedMessage
            defaultMessage="Parameters"
            description="Field name text for parameters table in the model comparison page"
          />,
          this.state.paramsActive,
          this.state.paramsToggle,
        )}
      </tbody>
    );
  }

  renderSchemaSectionHeader(activeSection: any, sectionName: any) {
    const { runInfos } = this.props;
    const { schemaActive } = this.state;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const isActive = this.state[activeSection];
    const { minusIcon, plusIcon } = this.icons;
    return (
      <tbody>
        <tr className={`${schemaActive ? '' : 'hidden-row'}`}>
          <th scope="rowgroup" className="schema-table-header block-content" colSpan={runInfos.length + 1}>
            <button className="schema-collapse-button" onClick={() => this.onToggleClick(activeSection)}>
              {isActive ? minusIcon : plusIcon}
              <strong style={{ paddingLeft: 4 }}>{sectionName}</strong>
            </button>
          </th>
        </tr>
      </tbody>
    );
  }

  renderSchema(activeSection: any, sectionName: any, listByIndex: any, listByName: any) {
    const { schemaActive, compareByColumnNameToggle, schemaToggle } = this.state;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const isActive = this.state[activeSection];
    const showSchemaSection = schemaActive && isActive;
    const showListByIndex = !compareByColumnNameToggle && !isEmpty(listByIndex);
    const showListByName = compareByColumnNameToggle && !isEmpty(listByName);
    const listByIndexHeaderMap = (key: any, data: any) => (
      <>
        {sectionName} [{key}]
      </>
    );
    const listByNameHeaderMap = (key: any, data: any) => key;
    const schemaFormatter = (value: any) => value;
    const schemaFieldName = (
      <FormattedMessage
        defaultMessage="Schema {sectionName}"
        description="Field name text for schema table in the model comparison page"
        values={{ sectionName: sectionName }}
      />
    );
    return (
      <tbody className="scrollable-table schema-scrollable-table">
        {this.renderDataRows(
          listByIndex,
          schemaFieldName,
          showSchemaSection && showListByIndex,
          schemaToggle,
          listByIndexHeaderMap,
          schemaFormatter,
        )}
        {this.renderDataRows(
          listByName,
          schemaFieldName,
          showSchemaSection && showListByName,
          schemaToggle,
          listByNameHeaderMap,
          schemaFormatter,
        )}
      </tbody>
    );
  }

  renderMetrics() {
    const { runInfos, metricLists } = this.props;
    const { metricActive, metricToggle } = this.state;
    const { chartIcon } = this.icons;
    const metricsHeaderMap = (key: any, data: any) => {
      return (
        <Link
          to={Routes.getMetricPageRoute(
            runInfos.map((info) => info.runUuid).filter((uuid, idx) => data[idx] !== undefined),
            key,
            // TODO: Refactor so that the breadcrumb
            // on the linked page is for model registry
            [runInfos[0].experimentId],
          )}
          target="_blank"
          title="Plot chart"
        >
          {key}
          {chartIcon}
        </Link>
      );
    };
    return (
      <tbody className="scrollable-table">
        {this.renderDataRows(
          metricLists,
          <FormattedMessage
            defaultMessage="Metrics"
            description="Field name text for metrics table in the model comparison page"
          />,
          metricActive,
          metricToggle,
          metricsHeaderMap,
          Utils.formatMetric,
        )}
      </tbody>
    );
  }

  // eslint-disable-next-line no-unused-vars
  renderDataRows(
    list: any,
    fieldName: any,
    show = true,
    toggle = false,
    headerMap = (key: any, data: any) => key,
    formatter = (value: any) => (isNaN(value) ? `"${value}"` : value),
  ) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const keys = CompareRunUtil.getKeys(list);
    const data = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    keys.forEach((k) => (data[k] = []));
    list.forEach((records: any, i: any) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      keys.forEach((k) => data[k].push(undefined));
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      records.forEach((r: any) => (data[r.key][i] = r.value));
    });
    if (isEmpty(keys) || isEmpty(list)) {
      return (
        <tr className={`table-row ${show ? '' : 'hidden-row'}`}>
          <th scope="row" className="rowHeader block-content">
            <CenteredText>
              <FormattedMessage
                defaultMessage="{fieldName} are empty"
                description="Default text in data table where items are empty in the model
                  comparison page"
                values={{ fieldName: fieldName }}
              />
            </CenteredText>
          </th>
        </tr>
      );
    }
    // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
    const isAllNumeric = every(keys, (key) => !isNaN(key));
    if (isAllNumeric) {
      keys.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    } else {
      keys.sort();
    }
    let identical = true;
    const resultRows = keys.map((k) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const isDifferent = data[k].length > 1 && uniq(data[k]).length > 1;
      identical = !isDifferent && identical;
      return (
        <tr key={k} className={`table-row ${(toggle && !isDifferent) || !show ? 'hidden-row' : ''}`}>
          <th scope="row" className="rowHeader block-content">
            {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
            {headerMap(k, data[k])}
          </th>
          {/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
          {data[k].map((value: any, i: any) => (
            <td
              className={`data-value block-content ${isDifferent ? 'highlight-data' : ''}`}
              key={this.props.runInfos[i].runUuid}
            >
              <span className="truncate-text single-line cell-content">
                {value === undefined ? '-' : formatter(value)}
              </span>
            </td>
          ))}
        </tr>
      );
    });
    if (identical && toggle) {
      return (
        <tr className={`table-row ${show ? '' : 'hidden-row'}`}>
          <th scope="row" className="rowHeader block-content">
            <CenteredText>
              <FormattedMessage
                defaultMessage="{fieldName} are identical"
                // eslint-disable-next-line max-len
                description="Default text in data table where items are identical in the model comparison page"
                values={{ fieldName: fieldName }}
              />
            </CenteredText>
          </th>
        </tr>
      );
    }
    return resultRows;
  }
}

const getModelVersionSchemaColumnsByIndex = (columns: any) => {
  const columnsByIndex = {};
  columns.forEach((column: any, index: any) => {
    const name = column.name ? column.name : '';
    const type = column.type ? column.type : '';
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    columnsByIndex[index] = {
      key: index,
      value: name !== '' && type !== '' ? `${name}: ${type}` : `${name}${type}`,
    };
  });
  return columnsByIndex;
};

const getModelVersionSchemaColumnsByName = (columns: any) => {
  const columnsByName = {};
  columns.forEach((column: any) => {
    const name = column.name ? column.name : '-';
    const type = column.type ? column.type : '-';
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    columnsByName[name] = {
      key: name,
      value: type,
    };
  });
  return columnsByName;
};

const mapStateToProps = (state: any, ownProps: any) => {
  const runInfos = [];
  const runInfosValid = [];
  const metricLists = [];
  const paramLists = [];
  const runNames = [];
  const runDisplayNames = [];
  const runUuids = [];
  const { modelName, versionsToRuns } = ownProps;
  const inputsListByName = [];
  const inputsListByIndex = [];
  const outputsListByName = [];
  const outputsListByIndex = [];
  for (const modelVersion in versionsToRuns) {
    if (versionsToRuns && modelVersion in versionsToRuns) {
      const runUuid = versionsToRuns[modelVersion];
      const runInfo = getRunInfo(runUuid, state);
      if (runInfo) {
        runInfos.push(runInfo);
        runInfosValid.push(true);
        metricLists.push(Object.values(getLatestMetrics(runUuid, state)));
        paramLists.push(Object.values(getParams(runUuid, state)));
        runNames.push(Utils.getRunName(runInfo));
        // the following are used to render plots - we only include valid run IDs here
        runDisplayNames.push(Utils.getRunDisplayName(runInfo, runUuid));
        runUuids.push(runUuid);
      } else {
        if (runUuid) {
          runInfos.push({ runUuid });
        } else {
          runInfos.push({ runUuid: 'None' });
        }
        runInfosValid.push(false);
        metricLists.push([]);
        paramLists.push([]);
        runNames.push('Invalid Run');
      }
      const schema = getModelVersionSchemas(state, modelName, modelVersion);
      inputsListByIndex.push(Object.values(getModelVersionSchemaColumnsByIndex((schema as any).inputs)));
      inputsListByName.push(Object.values(getModelVersionSchemaColumnsByName((schema as any).inputs)));
      outputsListByIndex.push(Object.values(getModelVersionSchemaColumnsByIndex((schema as any).outputs)));
      outputsListByName.push(Object.values(getModelVersionSchemaColumnsByName((schema as any).outputs)));
    }
  }

  return {
    runInfos,
    runInfosValid,
    metricLists,
    paramLists,
    runNames,
    runDisplayNames,
    runUuids,
    modelName,
    inputsListByName,
    inputsListByIndex,
    outputsListByName,
    outputsListByIndex,
  };
};

const DEFAULT_COLUMN_WIDTH = 200;

const styles = {
  wrapper: (numRuns: any) => ({
    '.mlflow-compare-table': {
      // 1 extra unit for header column
      minWidth: (numRuns + 1) * DEFAULT_COLUMN_WIDTH,
    },
  }),
  compareModelVersionsView: {
    'button:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    'td.block-content th.block-content': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      tableLayout: 'fixed',
      boxSizing: 'content-box',
    },
    'th.schema-table-header': {
      height: 28,
      padding: 0,
    },
    'tr.table-row': {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
    },
    'tr.hidden-row': {
      display: 'none',
    },
    'tbody.scrollable-table': {
      width: '100%',
      display: 'block',
      border: 'none',
      maxHeight: 400,
      overflowY: 'auto',
    },
    'tbody.schema-scrollable-table': {
      maxHeight: 200,
    },
    '.switch-button-container': {
      display: 'flex',
      paddingTop: 16,
      paddingBottom: 16,
    },
    'button.schema-collapse-button': {
      textAlign: 'left',
      display: 'block',
      width: '100%',
      height: '100%',
      border: 'none',
    },
    '.collapse-button': {
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      backgroundColor: 'white',
      paddingLeft: 0,
    },
    '.cell-content': {
      maxWidth: '200px',
      minWidth: '100px',
    },
    '.padding-left-text': {
      paddingLeft: 8,
    },
    '.padding-right-text': {
      paddingRight: 16,
    },
    '.toggle-switch': {
      marginTop: 2,
    },
    '.header': {
      paddingLeft: 8,
      fontSize: 16,
    },
  },
};

export const CompareModelVersionsView = connect(mapStateToProps)(injectIntl(CompareModelVersionsViewImpl));
```

--------------------------------------------------------------------------------

---[FILE: ConfigureInferenceModal.types.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ConfigureInferenceModal.types.tsx

```typescript
export enum ConfigureInferenceFormFields {
  MODEL_VERSION_FIELD = 'modelVersion',
  INPUT_DATA_FIELD = 'inputTable',
  OUTPUT_DLT_TABLE_FIELD = 'outputTable',
  OUTPUT_SUBDIRECTORY_FIELD = 'outputSubdirectory',
}

export enum ConfigureInferenceTabs {
  BATCH_INFERENCE = 'batch-inference',
  REAL_TIME = 'real-time',
  DLT_INFERENCE = 'dlt-inference',
}
```

--------------------------------------------------------------------------------

````

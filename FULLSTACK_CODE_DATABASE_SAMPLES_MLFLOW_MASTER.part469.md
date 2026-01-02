---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 469
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 469 of 991)

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

---[FILE: ExperimentLoggedModelListCharts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListCharts.tsx
Signals: React

```typescript
import { Empty, Input, SearchIcon, Spinner, useDesignSystemTheme } from '@databricks/design-system';
import { noop, uniq } from 'lodash';
import type { ReactNode } from 'react';
import { memo, useMemo, useCallback, useState } from 'react';
import type { LoggedModelProto } from '../../types';
import type { ExperimentRunsChartsUIConfiguration } from '../experiment-page/models/ExperimentPageUIState';
import type { RunsChartsRunData } from '../runs-charts/components/RunsCharts.common';
import { RunsChartsDraggableCardsGridContextProvider } from '../runs-charts/components/RunsChartsDraggableCardsGridContext';
import { RunsChartsFullScreenModal } from '../runs-charts/components/RunsChartsFullScreenModal';
import { RunsChartsTooltipBody } from '../runs-charts/components/RunsChartsTooltipBody';
import { RunsChartsSectionAccordion } from '../runs-charts/components/sections/RunsChartsSectionAccordion';
import { RunsChartsTooltipWrapper } from '../runs-charts/hooks/useRunsChartsTooltip';
import {
  RunsChartsUIConfigurationContextProvider,
  useConfirmChartCardConfigurationFn,
  useRemoveRunsChartFn,
  useUpdateRunsChartsUIConfiguration,
} from '../runs-charts/hooks/useRunsChartsUIConfiguration';
import type { RunsChartsMetricByDatasetEntry } from '../runs-charts/runs-charts.types';
import { RunsChartsCardConfig, RunsChartType } from '../runs-charts/runs-charts.types';
import { useExperimentLoggedModelsChartsData } from './hooks/useExperimentLoggedModelsChartsData';
import { useExperimentLoggedModelsChartsUIState } from './hooks/useExperimentLoggedModelsChartsUIState';
import { useExperimentLoggedModelAllMetricsByDataset } from './hooks/useExperimentLoggedModelAllMetricsByDataset';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMemoDeep } from '../../../common/hooks/useMemoDeep';
import { RunsChartsConfigureModal } from '../runs-charts/components/RunsChartsConfigureModal';
import Routes from '../../routes';

const ExperimentLoggedModelListChartsImpl = memo(
  ({
    chartData,
    uiState,
    metricKeysByDataset,
    minWidth,
  }: {
    chartData: RunsChartsRunData[];
    uiState: ExperimentRunsChartsUIConfiguration;
    metricKeysByDataset: RunsChartsMetricByDatasetEntry[];
    minWidth: number;
  }) => {
    const { theme } = useDesignSystemTheme();
    const { formatMessage } = useIntl();

    const availableMetricKeys = useMemo(() => uniq(chartData.flatMap((run) => Object.keys(run.metrics))), [chartData]);
    const availableParamKeys = useMemo(() => uniq(chartData.flatMap((run) => Object.keys(run.params))), [chartData]);

    const updateChartsUIState = useUpdateRunsChartsUIConfiguration();

    const setSearch = useCallback(
      (search: string) => {
        updateChartsUIState((state) => ({ ...state, chartsSearchFilter: search }));
      },
      [updateChartsUIState],
    );

    const [configuredCardConfig, setConfiguredCardConfig] = useState<RunsChartsCardConfig | null>(null);

    const addNewChartCard = useCallback(
      (metricSectionId: string) => (type: RunsChartType) =>
        setConfiguredCardConfig(RunsChartsCardConfig.getEmptyChartCardByType(type, false, undefined, metricSectionId)),
      [],
    );

    const confirmChartCardConfiguration = useConfirmChartCardConfigurationFn();
    const removeChart = useRemoveRunsChartFn();

    const [fullScreenChart, setFullScreenChart] = useState<
      | {
          config: RunsChartsCardConfig;
          title: string | ReactNode;
          subtitle: ReactNode;
        }
      | undefined
    >(undefined);

    const fullscreenTooltipContextValue = useMemo(() => ({ runs: chartData }), [chartData]);

    const tooltipContextValue = useMemo(
      () => ({ runs: chartData, getDataTraceLink: Routes.getExperimentLoggedModelDetailsPageRoute }),
      [chartData],
    );

    const emptyState = (
      <div css={{ marginTop: theme.spacing.lg }}>
        <Empty
          description={
            <FormattedMessage
              defaultMessage="No models found in experiment or all models are hidden. Select at least one model to view charts."
              description="Label displayed in logged models chart view when no models are visible or selected"
            />
          }
        />
      </div>
    );

    return (
      <div
        css={{
          backgroundColor: theme.colors.backgroundPrimary,
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md,
          paddingBottom: theme.spacing.md,

          borderTop: `1px solid ${theme.colors.border}`,
          borderLeft: `1px solid ${theme.colors.border}`,

          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          minWidth,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
            overflow: 'hidden',
            flex: 1,
          }}
        >
          <Input
            componentId="mlflow.logged_model.list.charts.search"
            role="searchbox"
            prefix={<SearchIcon />}
            value={uiState.chartsSearchFilter ?? ''}
            allowClear
            onChange={({ target }) => setSearch(target.value)}
            placeholder={formatMessage({
              defaultMessage: 'Search metric charts',
              description: 'Placeholder for chart search input on the logged model chart view',
            })}
          />
          <div css={{ overflow: 'auto' }}>
            <RunsChartsTooltipWrapper contextData={tooltipContextValue} component={RunsChartsTooltipBody}>
              <RunsChartsDraggableCardsGridContextProvider visibleChartCards={uiState.compareRunCharts}>
                <RunsChartsSectionAccordion
                  compareRunSections={uiState.compareRunSections}
                  compareRunCharts={uiState.compareRunCharts}
                  reorderCharts={noop}
                  insertCharts={noop}
                  chartData={chartData}
                  startEditChart={setConfiguredCardConfig}
                  removeChart={removeChart}
                  addNewChartCard={addNewChartCard}
                  search={uiState.chartsSearchFilter ?? ''}
                  groupBy={null}
                  setFullScreenChart={setFullScreenChart}
                  autoRefreshEnabled={false}
                  hideEmptyCharts={false}
                  globalLineChartConfig={undefined}
                  supportedChartTypes={[RunsChartType.BAR, RunsChartType.SCATTER]}
                  noRunsSelectedEmptyState={emptyState}
                />
              </RunsChartsDraggableCardsGridContextProvider>
            </RunsChartsTooltipWrapper>
            <RunsChartsFullScreenModal
              fullScreenChart={fullScreenChart}
              onCancel={() => setFullScreenChart(undefined)}
              chartData={chartData}
              groupBy={null}
              tooltipContextValue={fullscreenTooltipContextValue}
              tooltipComponent={RunsChartsTooltipBody}
              autoRefreshEnabled={false}
              globalLineChartConfig={undefined}
            />
            {configuredCardConfig && (
              <RunsChartsConfigureModal
                chartRunData={chartData}
                metricKeyList={availableMetricKeys}
                metricKeysByDataset={metricKeysByDataset}
                paramKeyList={availableParamKeys}
                config={configuredCardConfig}
                onSubmit={(configuredCardConfig) => {
                  confirmChartCardConfiguration({ ...configuredCardConfig, displayName: undefined });
                  setConfiguredCardConfig(null);
                }}
                onCancel={() => setConfiguredCardConfig(null)}
                groupBy={null}
                supportedChartTypes={[RunsChartType.BAR, RunsChartType.SCATTER]}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

export const ExperimentLoggedModelListCharts = memo(
  ({
    loggedModels,
    experimentId,
    minWidth,
  }: {
    loggedModels: LoggedModelProto[];
    experimentId: string;
    minWidth: number;
  }) => {
    const { theme } = useDesignSystemTheme();

    // Perform deep comparison on the logged models to avoid re-rendering the charts when the logged models change.
    // Deep comparison should still be cheaper than rerendering all charts.
    const cachedLoggedModels = useMemoDeep(() => loggedModels, [loggedModels]);

    const metricsByDataset = useExperimentLoggedModelAllMetricsByDataset(cachedLoggedModels);

    const {
      chartUIState,
      updateUIState,
      loading: loadingState,
    } = useExperimentLoggedModelsChartsUIState(metricsByDataset, experimentId);
    const chartData = useExperimentLoggedModelsChartsData(cachedLoggedModels);

    if (loadingState) {
      return (
        <div
          css={{
            backgroundColor: theme.colors.backgroundPrimary,
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.border}`,
            borderLeft: `1px solid ${theme.colors.border}`,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Spinner />
        </div>
      );
    }
    return (
      <RunsChartsUIConfigurationContextProvider updateChartsUIState={updateUIState}>
        <ExperimentLoggedModelListChartsImpl
          chartData={chartData}
          uiState={chartUIState}
          metricKeysByDataset={metricsByDataset}
          minWidth={minWidth}
        />
      </RunsChartsUIConfigurationContextProvider>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageAutoComplete.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageAutoComplete.tsx
Signals: React

```typescript
import { FormattedMessage } from 'react-intl';
import { EntitySearchAutoComplete } from '../EntitySearchAutoComplete';
import type { LoggedModelProto } from '../../types';
import { useMemo } from 'react';
import type { EntitySearchAutoCompleteEntityNameGroup } from '../EntitySearchAutoComplete.utils';
import { getEntitySearchOptionsFromEntityNames } from '../EntitySearchAutoComplete.utils';
import { isUserFacingTag } from '../../../common/utils/TagUtils';

const getEntityNamesFromLoggedModelsData = (
  loggedModels: LoggedModelProto[],
): EntitySearchAutoCompleteEntityNameGroup => {
  const metricNames = new Set<string>();
  const paramNames = new Set<string>();
  const tagNames = new Set<string>();

  for (const loggedModel of loggedModels) {
    loggedModel.data?.metrics?.forEach((metric) => metric.key && metricNames.add(metric.key));
    loggedModel.data?.params?.forEach((param) => param.key && paramNames.add(param.key));
    loggedModel.info?.tags?.forEach((tag) => tag.key && tagNames.add(tag.key));
  }

  return {
    metricNames: Array.from(metricNames),
    paramNames: Array.from(paramNames),
    tagNames: Array.from(tagNames).filter(isUserFacingTag),
  };
};

const VALID_FILTER_ATTRIBUTES = [
  'model_id',
  'model_name',
  'status',
  'artifact_uri',
  'creation_time',
  'last_updated_time',
];

export const ExperimentLoggedModelListPageAutoComplete = ({
  searchQuery,
  onChangeSearchQuery,
  loggedModelsData,
}: {
  searchQuery?: string;
  onChangeSearchQuery: (searchFilter: string) => void;
  loggedModelsData: LoggedModelProto[];
}) => {
  const options = useMemo(() => {
    const entityNames = getEntityNamesFromLoggedModelsData(loggedModelsData);
    const validAttributeOptions = VALID_FILTER_ATTRIBUTES.map((attribute) => ({
      value: `attributes.${attribute}`,
    }));
    return getEntitySearchOptionsFromEntityNames(entityNames, validAttributeOptions);
  }, [loggedModelsData]);

  return (
    <EntitySearchAutoComplete
      searchFilter={searchQuery ?? ''}
      onSearchFilterChange={onChangeSearchQuery}
      defaultActiveFirstOption={false}
      baseOptions={options}
      onClear={() => onChangeSearchQuery('')}
      placeholder="metrics.rmse >= 0.8"
      tooltipContent={
        <div>
          <FormattedMessage
            defaultMessage="Search logged models using a simplified version of the SQL {whereBold} clause."
            description="Tooltip string to explain how to search logged models from the listing page"
            values={{ whereBold: <b>WHERE</b> }}
          />{' '}
          <br />
          <FormattedMessage
            defaultMessage="Examples:"
            description="Text header for examples of logged models search syntax"
          />
          <br />
          {'• metrics.rmse >= 0.8'}
          <br />
          {'• metrics.`f1 score` < 1'}
          <br />
          • params.type = 'tree'
          <br />
          • tags.my_tag = 'foobar'
          <br />
          • attributes.name = 'elasticnet'
          <br />
        </div>
      }
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageColumnSelector.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageColumnSelector.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import {
  ExperimentLoggedModelListPageKnownColumns,
  useExperimentLoggedModelListPageTableColumns,
} from './hooks/useExperimentLoggedModelListPageTableColumns';
import { ExperimentLoggedModelListPageColumnSelector } from './ExperimentLoggedModelListPageColumnSelector';

const getMetric = (key: string, datasetName: string | undefined) => ({
  key,
  value: 1000,
  step: 1,
  timestamp: 0,
  dataset_digest: `1234-${datasetName}`,
  dataset_name: datasetName,
  modelId: '',
  run_id: '',
});

const getDemoData = () => [
  {
    info: undefined,
    data: {
      metrics: [
        getMetric('loss', 'train'),
        getMetric('loss', 'eval'),
        getMetric('alpha', 'train'),
        getMetric('alpha', 'eval'),
        getMetric('ungrouped', undefined),
      ],
      params: [
        { key: 'param1', value: '0.9' },
        { key: 'param2', value: '0.9' },
      ],
    },
  },
];

describe('ExperimentLoggedModelListPageColumnSelector', () => {
  let currentColumnVisibility: any = {};
  const renderTestComponent = () => {
    const TestComponent = () => {
      const { columnDefs } = useExperimentLoggedModelListPageTableColumns({ loggedModels: getDemoData() });
      const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
      currentColumnVisibility = columnVisibility;
      return (
        <ExperimentLoggedModelListPageColumnSelector
          onUpdateColumns={setColumnVisibility}
          columnVisibility={columnVisibility}
          columnDefs={columnDefs}
        />
      );
    };
    render(<TestComponent />, {
      wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
    });
  };
  test('should handle enabling and disabling arbitrary columns', async () => {
    renderTestComponent();

    // We start with no columns hidden
    expect(currentColumnVisibility).toEqual({});

    // Click on the columns selector
    await userEvent.click(screen.getByRole('button', { name: 'Columns' }));

    // Toggle "eval" dataset metrics
    await userEvent.click(screen.getByTitle('Dataset: eval (#1234-eval)'));

    // We should have only eval metrics hidden
    expect(currentColumnVisibility).toEqual({
      'metrics.{"metricKey":"alpha","datasetName":"eval","datasetDigest":"1234-eval"}': false,
      'metrics.{"metricKey":"loss","datasetName":"eval","datasetDigest":"1234-eval"}': false,
    });

    // Now toggle ungrouped metrics
    await userEvent.click(screen.getByTitle('No dataset'));

    expect(currentColumnVisibility).toEqual({
      'metrics.{"metricKey":"alpha","datasetName":"eval","datasetDigest":"1234-eval"}': false,
      'metrics.{"metricKey":"loss","datasetName":"eval","datasetDigest":"1234-eval"}': false,
      'metrics.{"metricKey":"ungrouped"}': false,
    });

    // Disable attribute columns one by one
    await userEvent.click(screen.getByTitle('Status'));
    await userEvent.click(screen.getByTitle('Source run'));
    await userEvent.click(screen.getByTitle('Dataset'));

    expect(currentColumnVisibility).toEqual({
      'metrics.{"metricKey":"alpha","datasetName":"eval","datasetDigest":"1234-eval"}': false,
      'metrics.{"metricKey":"loss","datasetName":"eval","datasetDigest":"1234-eval"}': false,
      'metrics.{"metricKey":"ungrouped"}': false,
      [ExperimentLoggedModelListPageKnownColumns.Dataset]: false,
      [ExperimentLoggedModelListPageKnownColumns.SourceRun]: false,
      [ExperimentLoggedModelListPageKnownColumns.Status]: false,
    });

    // Toggle datasets and attributes again
    await userEvent.click(screen.getByTitle('Dataset: eval (#1234-eval)'));
    await userEvent.click(screen.getByTitle('No dataset'));
    await userEvent.click(screen.getByTitle('Status'));
    await userEvent.click(screen.getByTitle('Source run'));
    await userEvent.click(screen.getByTitle('Dataset'));

    // However, now click on parameters group
    await userEvent.click(screen.getByTitle('Parameters'));

    // We should have only parameters hidden
    expect(currentColumnVisibility).toEqual({
      'params.param1': false,
      'params.param2': false,
    });

    // Retoggle parameters in the end
    await userEvent.click(screen.getByTitle('Parameters'));

    // We should have all columns visible again
    expect(currentColumnVisibility).toEqual({});
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageColumnSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageColumnSelector.tsx
Signals: React

```typescript
import type { TreeDataNode } from '@databricks/design-system';
import { Button, ColumnsIcon, DropdownMenu, Tree, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';

import { compact } from 'lodash';
import { useMemo } from 'react';
import {
  ExperimentLoggedModelListPageKnownColumnGroups,
  ExperimentLoggedModelListPageStaticColumns,
  LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX,
} from './hooks/useExperimentLoggedModelListPageTableColumns';

interface BasicColumnDef {
  colId?: string;
  groupId?: string;
  headerName?: string;
  children?: BasicColumnDef[];
}

const METRIC_AGGREGATE_GROUP_ID = 'all_metrics';

const defaultExpandedTreeGroups = [
  ExperimentLoggedModelListPageKnownColumnGroups.Attributes,
  METRIC_AGGREGATE_GROUP_ID,
];

export const ExperimentLoggedModelListPageColumnSelector = ({
  onUpdateColumns,
  columnVisibility = {},
  columnDefs,
  disabled,
  customTrigger,
}: {
  onUpdateColumns: (columnVisibility: Record<string, boolean>) => void;
  columnVisibility?: Record<string, boolean>;
  columnDefs?: BasicColumnDef[];
  disabled?: boolean;
  customTrigger?: React.ReactNode;
}) => {
  const intl = useIntl();

  // Calculate the tree data for the column selector
  const { leafColumnIds = [], treeData = [] } = useMemo(() => {
    // If there are no column definitions, return an empty tree
    if (!columnDefs) {
      return {};
    }

    // We need to regroup columns so all dataset metric groups are included in another subtree
    const groupedColumnDefinitions: BasicColumnDef[] = [];

    // First, add the attribute column group
    const attributeColumnGroup = columnDefs.find(
      (col) => col.groupId === ExperimentLoggedModelListPageKnownColumnGroups.Attributes,
    );

    if (attributeColumnGroup) {
      groupedColumnDefinitions.push({
        ...attributeColumnGroup,
        // Filter out the static columns
        children: attributeColumnGroup.children?.filter(
          ({ colId }) => colId && !ExperimentLoggedModelListPageStaticColumns.includes(colId),
        ),
      });
    }

    // Next, get all the dataset-grouped metric column groups
    const metricColumnGroups = columnDefs
      .filter((col) => col.groupId?.startsWith(LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX))
      .map((col) => ({
        ...col,
        headerName: col.headerName
          ? `Dataset: ${col.headerName}`
          : intl.formatMessage({
              defaultMessage: 'No dataset',
              description: 'Label for the ungrouped metrics column group in the logged model column selector',
            }),
      }));

    // Aggregate all metric column groups into a single group
    if (metricColumnGroups.length > 0) {
      groupedColumnDefinitions.push({
        groupId: METRIC_AGGREGATE_GROUP_ID,
        headerName: intl.formatMessage({
          defaultMessage: 'Metrics',
          description: 'Label for the metrics column group in the logged model column selector',
        }),
        children: metricColumnGroups,
      });
    }

    // In the end, add the parameter column group
    const paramColumnGroup = columnDefs.find(
      (col) => col.groupId === ExperimentLoggedModelListPageKnownColumnGroups.Params,
    );

    if (paramColumnGroup) {
      groupedColumnDefinitions.push(paramColumnGroup);
    }

    const leafColumnIds: string[] = [];

    // Function for building tree branches recursively
    const buildDuboisTreeBranch = (col: BasicColumnDef): TreeDataNode => {
      if (col.colId) {
        leafColumnIds.push(col.colId);
      }
      return {
        key: col.groupId ?? col.colId ?? '',
        title: col.headerName ?? '',
        children: compact(col.children?.map(buildDuboisTreeBranch) ?? []),
      };
    };

    // Build a tree root for a column groups
    const treeData = compact(groupedColumnDefinitions?.map((col) => buildDuboisTreeBranch(col)) ?? []);

    return {
      leafColumnIds,
      treeData,
    };
  }, [columnDefs, intl]);

  const treeCheckChangeHandler: React.ComponentProps<typeof Tree>['onCheck'] = (checkedKeys) => {
    // Extract key data conforming to unusual antd API
    const keys = 'checked' in checkedKeys ? checkedKeys.checked : checkedKeys;

    // Start with empty visibility map
    const columnVisibility: Record<string, boolean> = {};

    // Go through all leaf columns and set visibility based on the checked keys.
    // We use one-way visibility flag, i.e. use only "false" to hide a column.
    for (const key of leafColumnIds) {
      if (!keys.includes(key)) {
        columnVisibility[key] = false;
      }
    }

    // Call the update handler
    onUpdateColumns(columnVisibility);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        {customTrigger ?? (
          <Button componentId="mlflow.logged_model.list.columns" icon={<ColumnsIcon />} disabled={disabled}>
            <FormattedMessage
              defaultMessage="Columns"
              description="Label for the column selector button in the logged model list page"
            />
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content css={{ maxHeight: 500, paddingRight: 32 }}>
        <Tree
          treeData={treeData}
          mode="checkable"
          showLine
          defaultExpandedKeys={defaultExpandedTreeGroups}
          // By default, check all columns that are visible
          defaultCheckedKeys={leafColumnIds.filter((colId) => columnVisibility[colId] !== false)}
          onCheck={treeCheckChangeHandler}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageControls.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageControls.tsx

```typescript
import {
  Button,
  ChartLineIcon,
  Checkbox,
  ListIcon,
  SegmentedControlButton,
  SegmentedControlGroup,
  SortAscendingIcon,
  SortDescendingIcon,
  Tooltip,
  Typography,
  useDesignSystemTheme,
  visuallyHidden,
} from '@databricks/design-system';
import { useIntl } from 'react-intl';

import { FormattedMessage } from 'react-intl';
import type { ColDef, ColGroupDef } from '@ag-grid-community/core';
import { ExperimentLoggedModelListPageColumnSelector } from './ExperimentLoggedModelListPageColumnSelector';
import { coerceToEnum } from '@databricks/web-shared/utils';
import { ExperimentLoggedModelListPageMode } from './hooks/useExperimentLoggedModelListPageMode';
import { ExperimentLoggedModelListPageAutoComplete } from './ExperimentLoggedModelListPageAutoComplete';
import type { LoggedModelMetricDataset, LoggedModelProto } from '../../types';
import { ExperimentLoggedModelListPageDatasetDropdown } from './ExperimentLoggedModelListPageDatasetDropdown';
import { ExperimentLoggedModelListPageOrderBySelector } from './ExperimentLoggedModelListPageOrderBySelector';
import type { LoggedModelsTableGroupByMode } from './ExperimentLoggedModelListPageTable.utils';
import { ExperimentLoggedModelListPageGroupBySelector } from './ExperimentLoggedModelListPageGroupBySelector';

export const ExperimentLoggedModelListPageControls = ({
  orderByColumn,
  orderByAsc,
  sortingAndFilteringEnabled,
  onChangeOrderBy,
  onUpdateColumns,
  columnDefs,
  columnVisibility = {},
  viewMode,
  setViewMode,
  searchQuery = '',
  onChangeSearchQuery,
  loggedModelsData,
  selectedFilterDatasets,
  onToggleDataset,
  onClearSelectedDatasets,
  groupBy,
  onChangeGroupBy,
}: {
  orderByColumn?: string;
  orderByAsc?: boolean;
  groupBy?: LoggedModelsTableGroupByMode;
  onChangeGroupBy?: (groupBy: LoggedModelsTableGroupByMode | undefined) => void;
  sortingAndFilteringEnabled?: boolean;
  onChangeOrderBy: (orderByColumn: string, orderByAsc: boolean) => void;
  onUpdateColumns: (columnVisibility: Record<string, boolean>) => void;
  columnDefs?: (ColDef | ColGroupDef)[];
  columnVisibility?: Record<string, boolean>;
  viewMode: ExperimentLoggedModelListPageMode;
  setViewMode: (mode: ExperimentLoggedModelListPageMode) => void;
  searchQuery?: string;
  onChangeSearchQuery: (searchFilter: string) => void;
  loggedModelsData: LoggedModelProto[];
  selectedFilterDatasets?: LoggedModelMetricDataset[];
  onToggleDataset?: (dataset: LoggedModelMetricDataset) => void;
  onClearSelectedDatasets?: () => void;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
      <SegmentedControlGroup
        componentId="mlflow.logged_model.list.view-mode"
        name="view-mode"
        value={viewMode}
        onChange={(e) => {
          setViewMode(
            coerceToEnum(ExperimentLoggedModelListPageMode, e.target.value, ExperimentLoggedModelListPageMode.TABLE),
          );
        }}
      >
        <SegmentedControlButton value="TABLE">
          <Tooltip
            componentId="mlflow.logged_model.list.view-mode-table-tooltip"
            content={intl.formatMessage({
              defaultMessage: 'Table view',
              description: 'Label for the table view toggle button in the logged model list page',
            })}
          >
            <ListIcon />
          </Tooltip>
          <span css={visuallyHidden}>
            {intl.formatMessage({
              defaultMessage: 'Table view',
              description: 'Label for the table view toggle button in the logged model list page',
            })}
          </span>
        </SegmentedControlButton>
        <SegmentedControlButton value="CHART">
          <Tooltip
            componentId="mlflow.logged_model.list.view-mode-chart-tooltip"
            content={intl.formatMessage({
              defaultMessage: 'Chart view',
              description: 'Label for the table view toggle button in the logged model list page',
            })}
          >
            <ChartLineIcon />
          </Tooltip>
          <span css={visuallyHidden}>
            {intl.formatMessage({
              defaultMessage: 'Chart view',
              description: 'Label for the table view toggle button in the logged model list page',
            })}
          </span>
        </SegmentedControlButton>
      </SegmentedControlGroup>
      {sortingAndFilteringEnabled ? (
        <>
          <ExperimentLoggedModelListPageAutoComplete
            searchQuery={searchQuery}
            onChangeSearchQuery={onChangeSearchQuery}
            loggedModelsData={loggedModelsData}
          />
          <ExperimentLoggedModelListPageDatasetDropdown
            loggedModelsData={loggedModelsData}
            onToggleDataset={onToggleDataset}
            onClearSelectedDatasets={onClearSelectedDatasets}
            selectedFilterDatasets={selectedFilterDatasets}
          />
          <ExperimentLoggedModelListPageOrderBySelector
            orderByColumn={orderByColumn ?? ''}
            orderByAsc={orderByAsc}
            onChangeOrderBy={onChangeOrderBy}
            columnDefs={columnDefs}
          />
        </>
      ) : (
        <Button
          componentId="mlflow.logged_model.list.sort"
          icon={orderByAsc ? <SortAscendingIcon /> : <SortDescendingIcon />}
          onClick={() => {
            orderByColumn && onChangeOrderBy(orderByColumn, !orderByAsc);
          }}
        >
          <FormattedMessage
            defaultMessage="Sort: Created"
            description="Label for the sort button in the logged model list page"
          />
        </Button>
      )}
      <ExperimentLoggedModelListPageColumnSelector
        columnDefs={columnDefs}
        columnVisibility={columnVisibility}
        onUpdateColumns={onUpdateColumns}
        disabled={viewMode === ExperimentLoggedModelListPageMode.CHART}
      />
      <ExperimentLoggedModelListPageGroupBySelector groupBy={groupBy} onChangeGroupBy={onChangeGroupBy} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageDatasetDropdown.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageDatasetDropdown.tsx
Signals: React

```typescript
import {
  Button,
  ChevronDownIcon,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxCountBadge,
  DialogComboboxCustomButtonTriggerWrapper,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  TableIcon,
  useDesignSystemTheme,
  XCircleFillIcon,
} from '@databricks/design-system';
import { useMemo, useRef } from 'react';
import type { LoggedModelMetricDataset, LoggedModelProto } from '../../types';
import { useIntl } from 'react-intl';

const getDatasetHash = (dataset: LoggedModelMetricDataset) =>
  JSON.stringify([dataset.dataset_name, dataset.dataset_digest]);

export const ExperimentLoggedModelListPageDatasetDropdown = ({
  loggedModelsData,
  selectedFilterDatasets,
  onToggleDataset,
  onClearSelectedDatasets,
}: {
  loggedModelsData: LoggedModelProto[];
  selectedFilterDatasets?: LoggedModelMetricDataset[];
  onToggleDataset?: (dataset: LoggedModelMetricDataset) => void;
  onClearSelectedDatasets?: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const cachedDatasets = useRef<Map<string, { hash: string } & LoggedModelMetricDataset>>(new Map());

  // Get all datasets with their hashes, also store them in an aggregated map.
  // The hash is used as a unique key and also being fed to DialogCombobox since it exclusively uses string values.
  // The map is used to aggregate all datasets encountered in the logged models data during the session.
  const allDatasets = useMemo(() => {
    for (const model of loggedModelsData) {
      for (const metric of model.data?.metrics || []) {
        if (!metric.dataset_name || !metric.dataset_digest) {
          continue;
        }
        const datasetHash = getDatasetHash(metric);
        if (!cachedDatasets.current.has(datasetHash)) {
          // We're purposely using mutable hashmap in the memo hook
          cachedDatasets.current.set(datasetHash, {
            hash: datasetHash,
            dataset_name: metric.dataset_name,
            dataset_digest: metric.dataset_digest,
          });
        }
      }
    }
    return Array.from(cachedDatasets.current.values());
  }, [loggedModelsData]);

  // Serialize the selected datasets to a string format for the DialogCombobox.
  const serializedSelectedDatasets = useMemo(
    () => selectedFilterDatasets?.map(getDatasetHash) || [],
    [selectedFilterDatasets],
  );

  return (
    <DialogCombobox
      componentId="mlflow.logged_model.list_page.datasets_filter"
      id="mlflow.logged_model.list_page.datasets_filter"
      value={serializedSelectedDatasets}
      label={intl.formatMessage({
        defaultMessage: 'Datasets',
        description: 'Label for the datasets filter dropdown in the logged model list page',
      })}
      stayOpenOnSelection
    >
      <DialogComboboxCustomButtonTriggerWrapper>
        <Button
          endIcon={<ChevronDownIcon />}
          componentId="mlflow.logged_model.list_page.datasets_filter.toggle"
          icon={<TableIcon />}
        >
          Datasets
          {serializedSelectedDatasets.length > 0 ? (
            <>
              <DialogComboboxCountBadge css={{ marginLeft: 4 }}>
                {serializedSelectedDatasets.length}
              </DialogComboboxCountBadge>
              <XCircleFillIcon
                aria-hidden="false"
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClearSelectedDatasets?.();
                }}
                css={{
                  color: theme.colors.textPlaceholder,
                  fontSize: theme.typography.fontSizeSm,
                  marginLeft: theme.spacing.xs,

                  ':hover': {
                    color: theme.colors.actionTertiaryTextHover,
                  },
                }}
              />
            </>
          ) : null}
        </Button>
      </DialogComboboxCustomButtonTriggerWrapper>
      <DialogComboboxContent>
        <DialogComboboxOptionList>
          {allDatasets.map(({ hash: serializedDataset, dataset_digest, dataset_name }) => (
            <DialogComboboxOptionListCheckboxItem
              value={serializedDataset}
              checked={serializedSelectedDatasets.includes(serializedDataset)}
              key={serializedDataset}
              onChange={() => onToggleDataset?.({ dataset_digest, dataset_name })}
            >
              {dataset_name} (#{dataset_digest})
            </DialogComboboxOptionListCheckboxItem>
          ))}
        </DialogComboboxOptionList>
      </DialogComboboxContent>
    </DialogCombobox>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLoggedModelListPageGroupBySelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/ExperimentLoggedModelListPageGroupBySelector.tsx

```typescript
import { Button, ChevronDownIcon, DropdownMenu, ListBorderIcon } from '@databricks/design-system';
import { defineMessage, FormattedMessage, type MessageDescriptor } from 'react-intl';

import { LoggedModelsTableGroupByMode } from './ExperimentLoggedModelListPageTable.utils';

const GroupByLabels: Record<LoggedModelsTableGroupByMode, MessageDescriptor> = {
  [LoggedModelsTableGroupByMode.RUNS]: defineMessage({
    defaultMessage: 'Source run',
    description: 'Label for the group by runs option in the logged model list page',
  }),
};

export const ExperimentLoggedModelListPageGroupBySelector = ({
  groupBy,
  onChangeGroupBy,
}: {
  groupBy: LoggedModelsTableGroupByMode | undefined;
  onChangeGroupBy?: (groupBy: LoggedModelsTableGroupByMode | undefined) => void;
}) => {
  const currentSelectedLabel = groupBy ? GroupByLabels[groupBy] : null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button componentId="mlflow.logged_model.list.group_by" icon={<ListBorderIcon />} endIcon={<ChevronDownIcon />}>
          {currentSelectedLabel ? (
            <FormattedMessage
              defaultMessage="Group by: {currentModeSelected}"
              description="Label for the grouping selector button in the logged model list page when groupin mode is selected"
              values={{ currentModeSelected: <FormattedMessage {...currentSelectedLabel} /> }}
            />
          ) : (
            <FormattedMessage
              defaultMessage="Group by"
              description="Label for the grouping selector button in the logged model list page when no grouping is selected"
            />
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.CheckboxItem
          checked={!groupBy}
          componentId="mlflow.logged_model.list.group_by.none"
          onClick={() => onChangeGroupBy?.(undefined)}
        >
          <DropdownMenu.ItemIndicator />
          <FormattedMessage
            defaultMessage="None"
            description="Label for the button disabling grouping in the logged model list page"
          />
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem
          checked={groupBy === LoggedModelsTableGroupByMode.RUNS}
          componentId="mlflow.logged_model.list.group_by.runs"
          onClick={() => onChangeGroupBy?.(LoggedModelsTableGroupByMode.RUNS)}
        >
          <DropdownMenu.ItemIndicator />
          <FormattedMessage {...GroupByLabels[LoggedModelsTableGroupByMode.RUNS]} />
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 524
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 524 of 991)

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

---[FILE: RunsChartsScatterChartCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/cards/RunsChartsScatterChartCard.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import type { RunsChartsRunData } from '../RunsCharts.common';
import type { RunsChartsScatterCardConfig } from '../../runs-charts.types';
import type {
  RunsChartCardFullScreenProps,
  RunsChartCardReorderProps,
  RunsChartCardVisibilityProps,
} from './ChartCard.common';
import { RunsChartCardWrapper, RunsChartsChartsDragGroup } from './ChartCard.common';
import { RunsScatterPlot } from '../RunsScatterPlot';
import { useRunsChartsTooltip } from '../../hooks/useRunsChartsTooltip';
import { useChartImageDownloadHandler } from '../../hooks/useChartImageDownloadHandler';
import { downloadChartDataCsv } from '../../../experiment-page/utils/experimentPage.common-utils';
import { intersection, uniq } from 'lodash';
import { RunsChartsNoDataFoundIndicator } from '../RunsChartsNoDataFoundIndicator';
import { Tag, Typography, useDesignSystemTheme } from '@databricks/design-system';

export interface RunsChartsScatterChartCardProps
  extends RunsChartCardReorderProps,
    RunsChartCardVisibilityProps,
    RunsChartCardFullScreenProps {
  config: RunsChartsScatterCardConfig;
  chartRunData: RunsChartsRunData[];

  hideEmptyCharts?: boolean;

  onDelete: () => void;
  onEdit: () => void;
}

export const RunsChartsScatterChartCard = ({
  config,
  chartRunData,
  onDelete,
  onEdit,
  fullScreen,
  setFullScreenChart,
  hideEmptyCharts,
  isInViewport: isInViewportProp,
  ...reorderProps
}: RunsChartsScatterChartCardProps) => {
  const { theme } = useDesignSystemTheme();
  const title = (() => {
    if (config.xaxis.datasetName || config.yaxis.datasetName) {
      return (
        <div css={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', gap: theme.spacing.xs }}>
          <Typography.Text title={config.xaxis.key} ellipsis bold>
            {config.xaxis.datasetName && (
              <>
                <Tag componentId="mlflow.charts.scatter_card_title.dataset_tag" css={{ marginRight: 0 }}>
                  {config.xaxis.datasetName}
                </Tag>{' '}
              </>
            )}
            {config.xaxis.key}
          </Typography.Text>
          <Typography.Text>vs</Typography.Text>
          <Typography.Text title={config.xaxis.key} ellipsis bold>
            {config.yaxis.datasetName && (
              <>
                <Tag componentId="mlflow.charts.scatter_card_title.dataset_tag" css={{ marginRight: 0 }}>
                  {config.yaxis.datasetName}
                </Tag>{' '}
              </>
            )}
            {config.yaxis.key}
          </Typography.Text>
        </div>
      );
    }
    return `${config.xaxis.key} vs. ${config.yaxis.key}`;
  })();

  const toggleFullScreenChart = () => {
    setFullScreenChart?.({
      config,
      title,
      subtitle: null,
    });
  };

  const slicedRuns = useMemo(() => chartRunData.filter(({ hidden }) => !hidden), [chartRunData]);

  const isEmptyDataset = useMemo(() => {
    const metricKeys = [config.xaxis.dataAccessKey ?? config.xaxis.key, config.yaxis.dataAccessKey ?? config.yaxis.key];
    const metricsInRuns = slicedRuns.flatMap(({ metrics }) => Object.keys(metrics));
    return intersection(metricKeys, uniq(metricsInRuns)).length === 0;
  }, [config, slicedRuns]);

  const { setTooltip, resetTooltip, selectedRunUuid } = useRunsChartsTooltip(config);

  // If the chart is in fullscreen mode, we always render its body.
  // Otherwise, we only render the chart if it is in the viewport.
  const isInViewport = fullScreen || isInViewportProp;

  const [imageDownloadHandler, setImageDownloadHandler] = useChartImageDownloadHandler();

  const chartBody = (
    <div
      css={[
        styles.scatterChartCardWrapper,
        {
          height: fullScreen ? '100%' : undefined,
        },
      ]}
    >
      {isInViewport ? (
        <RunsScatterPlot
          runsData={slicedRuns}
          xAxis={config.xaxis}
          yAxis={config.yaxis}
          onHover={setTooltip}
          onUnhover={resetTooltip}
          useDefaultHoverBox={false}
          selectedRunUuid={selectedRunUuid}
          onSetDownloadHandler={setImageDownloadHandler}
        />
      ) : null}
    </div>
  );

  // Do not render the card if the chart is empty and the user has enabled hiding empty charts
  if (hideEmptyCharts && isEmptyDataset) {
    return null;
  }

  if (fullScreen) {
    return chartBody;
  }

  return (
    <RunsChartCardWrapper
      onEdit={onEdit}
      onDelete={onDelete}
      title={title}
      uuid={config.uuid}
      dragGroupKey={RunsChartsChartsDragGroup.GENERAL_AREA}
      // Disable fullscreen button if the chart is empty
      toggleFullScreenChart={isEmptyDataset ? undefined : toggleFullScreenChart}
      supportedDownloadFormats={['png', 'svg', 'csv']}
      onClickDownload={(format) => {
        const savedChartTitle = [config.xaxis.key, config.yaxis.key].join('-');
        if (format === 'csv' || format === 'csv-full') {
          const paramsToExport = [];
          const metricsToExport = [];
          for (const axis of ['xaxis' as const, 'yaxis' as const]) {
            if (config[axis].type === 'PARAM') {
              paramsToExport.push(config[axis].key);
            } else {
              metricsToExport.push(config[axis].key);
            }
          }
          downloadChartDataCsv(slicedRuns, metricsToExport, paramsToExport, savedChartTitle);
          return;
        }
        imageDownloadHandler?.(format, savedChartTitle);
      }}
      {...reorderProps}
    >
      {isEmptyDataset ? <RunsChartsNoDataFoundIndicator /> : chartBody}
    </RunsChartCardWrapper>
  );
};

const styles = {
  scatterChartCardWrapper: {
    overflow: 'hidden',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: DifferenceViewPlot.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/DifferenceViewPlot.test.tsx

```typescript
import { describe, beforeAll, afterAll, jest, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { CellDifference } from './DifferenceViewPlot.utils';
import type { RunsChartsRunData } from '../RunsCharts.common';
import type { RunsChartsDifferenceCardConfig } from '../../runs-charts.types';
import { DifferenceCardConfigCompareGroup, RunsChartType } from '../../runs-charts.types';
import { IntlProvider } from 'react-intl';
import { DifferenceChartCellDirection } from '../../utils/differenceView';
import { DifferenceViewPlot } from './DifferenceViewPlot';

describe('DifferenceViewPlot', () => {
  const originalGetBoundingClientRect = window.Element.prototype.getBoundingClientRect;

  // Required to see virtualized entities
  beforeAll(() => {
    window.Element.prototype.getBoundingClientRect = () => ({ height: 300, width: 100 } as DOMRect);
  });
  afterAll(() => {
    window.Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  const previewData: RunsChartsRunData[] = [
    {
      uuid: 'run1-uuid',
      displayName: 'run1',
      images: {},
      runInfo: {
        runUuid: 'run1-uuid',
        experimentId: 'experiment1-uuid',
        status: 'FINISHED',
        startTime: 1633027589000,
        endTime: 1633027589000,
        lifecycleStage: 'active',
        runName: 'run1',
        artifactUri: 'artifactUri',
      },
      metrics: {
        metric1: { key: 'metric1', value: 10, step: 1, timestamp: 1633027589000 },
        metric2: { key: 'metric2', value: 20, step: 2, timestamp: 1633027589000 },
      },
      params: {
        param1: { key: 'key1', value: 'value1' },
        param2: { key: 'key2', value: 'value2' },
      },
      tags: {
        tag1: { key: 'tag1', value: 'value1' },
        tag2: { key: 'tag2', value: 'value2' },
      },
    },
    {
      uuid: 'run2-uuid',
      displayName: 'run2',
      runInfo: {
        runUuid: 'run2-uuid',
        experimentId: 'experiment1-uuid',
        status: 'FINISHED',
        startTime: 1633027589000,
        endTime: 1633027589000,
        lifecycleStage: 'active',
        runName: 'run2',
        artifactUri: 'artifact',
      },
      images: {},
      metrics: {
        metric1: { key: 'metric1', value: 30, step: 3, timestamp: 1633027589000 },
        metric2: { key: 'metric2', value: 40, step: 4, timestamp: 1633027589000 },
      },
      params: {
        param1: { key: 'param1', value: 'value3' },
        param2: { key: 'param2', value: 'value4' },
      },
      tags: {
        tag1: { key: 'tag1', value: 'value3' },
        tag2: { key: 'tag2', value: 'value4' },
      },
    },
  ];

  const cardConfig: RunsChartsDifferenceCardConfig = {
    type: RunsChartType.DIFFERENCE,
    compareGroups: [DifferenceCardConfigCompareGroup.MODEL_METRICS, DifferenceCardConfigCompareGroup.PARAMETERS],
    chartName: 'Runs difference view',
    showChangeFromBaseline: true,
    showDifferencesOnly: true,
    baselineColumnUuid: '',
    deleted: false,
    isGenerated: false,
  };

  const groupBy = null;

  const setCardConfig = jest.fn();

  it('renders the DifferenceViewPlot component', async () => {
    render(
      <IntlProvider locale="en">
        <DifferenceViewPlot
          previewData={previewData}
          cardConfig={cardConfig}
          groupBy={groupBy}
          setCardConfig={setCardConfig}
        />
      </IntlProvider>,
    );

    // Assert that the component is rendered
    expect(screen.getByText('Compare by')).toBeInTheDocument();

    // Assert that the selected groups exists
    expect(screen.getByText('Model Metrics')).toBeInTheDocument();
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
    expect(screen.queryByText('Attributes')).not.toBeInTheDocument();
    expect(screen.queryByText('System Metrics')).not.toBeInTheDocument();
  });
});

describe('CellDifference', () => {
  it('renders the CellDifference component', () => {
    render(
      <IntlProvider locale="en">
        <CellDifference label="10" direction={DifferenceChartCellDirection.POSITIVE} />
      </IntlProvider>,
    );

    // Assert that the component is rendered
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByTestId('positive-cell-direction')).toBeInTheDocument();
  });

  it('renders the CellDifference component with negative direction', () => {
    render(
      <IntlProvider locale="en">
        <CellDifference label="-10" direction={DifferenceChartCellDirection.NEGATIVE} />
      </IntlProvider>,
    );

    // Assert that the component is rendered
    expect(screen.getByText('-10')).toBeInTheDocument();
    expect(screen.getByTestId('negative-cell-direction')).toBeInTheDocument();
  });

  it('renders the CellDifference component with same direction', () => {
    render(
      <IntlProvider locale="en">
        <CellDifference label="0" direction={DifferenceChartCellDirection.SAME} />
      </IntlProvider>,
    );

    // Assert that the component is rendered
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByTestId('same-cell-direction')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: DifferenceViewPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/DifferenceViewPlot.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  Button,
  ChevronDownIcon,
  ChevronRightIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { CellContext, ColumnDef, ColumnDefTemplate, Row } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import type { RunsGroupByConfig } from '../../../experiment-page/utils/experimentPage.group-row-utils';
import type { RunsChartsCardConfig, RunsChartsDifferenceCardConfig } from '../../runs-charts.types';
import { DifferenceCardConfigCompareGroup } from '../../runs-charts.types';
import {
  DIFFERENCE_PLOT_EXPAND_COLUMN_ID,
  DIFFERENCE_PLOT_HEADING_COLUMN_ID,
  getDifferencePlotJSONRows,
  getDifferenceViewDataGroups,
} from '../../utils/differenceView';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { DifferencePlotDataCell } from './difference-view-plot/DifferencePlotDataCell';
import { DifferencePlotRunHeaderCell } from './difference-view-plot/DifferencePlotRunHeaderCell';

export type DifferencePlotDataColumnDef = ColumnDef<DifferencePlotDataRow> & {
  meta?: {
    traceData?: RunsChartsRunData;
    updateBaselineColumnUuid: (uuid: string) => void;
    isBaseline: boolean;
    showChangeFromBaseline: boolean;
    baselineColumnUuid?: string;
  };
};

export type DifferencePlotDataRow =
  | Record<string, any>
  | {
      children: DifferencePlotDataRow[];
      key: string;
      [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: string;
    };

const ExpandCell: ColumnDefTemplate<
  CellContext<DifferencePlotDataRow, unknown> & { toggleExpand?: (row: Row<DifferencePlotDataRow>) => void }
> = ({ row, toggleExpand }) => {
  if (row.getCanExpand() && toggleExpand) {
    return (
      <Button
        componentId="mlflow.charts.difference_plot.expand_button"
        size="small"
        type="link"
        onClick={() => toggleExpand(row)}
        icon={row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
      />
    );
  }
  return null;
};

export const DifferenceViewPlot = ({
  previewData,
  cardConfig,
  groupBy,
  setCardConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsDifferenceCardConfig;
  groupBy: RunsGroupByConfig | null;
  setCardConfig?: (setter: (current: RunsChartsCardConfig) => RunsChartsDifferenceCardConfig) => void;
}) => {
  const { formatMessage } = useIntl();
  const { theme } = useDesignSystemTheme();

  const { modelMetrics, systemMetrics, parameters, tags, attributes } = useMemo(
    () => getDifferenceViewDataGroups(previewData, cardConfig, DIFFERENCE_PLOT_HEADING_COLUMN_ID, groupBy),
    [previewData, cardConfig, groupBy],
  );

  const { baselineColumn, nonBaselineColumns } = useMemo(() => {
    const dataTracesReverse = previewData.slice().reverse();
    // baseline column (can be undefined if no baseline selected)
    let baselineColumn = dataTracesReverse.find((runData) => runData.uuid === cardConfig.baselineColumnUuid);
    if (baselineColumn === undefined && dataTracesReverse.length > 0) {
      // Set the first column as baseline column
      baselineColumn = dataTracesReverse[0];
    }
    // non-baseline columns
    const nonBaselineColumns = dataTracesReverse.filter(
      (runData) => baselineColumn === undefined || runData.uuid !== baselineColumn.uuid,
    );
    return { baselineColumn, nonBaselineColumns };
  }, [previewData, cardConfig.baselineColumnUuid]);

  const updateBaselineColumnUuid = useCallback(
    (baselineColumnUuid: string) => {
      setCardConfig?.((current) => ({
        ...(current as RunsChartsDifferenceCardConfig),
        baselineColumnUuid,
      }));
    },
    [setCardConfig],
  );

  const dataRows = useMemo<DifferencePlotDataRow[]>(
    () =>
      cardConfig.compareGroups.reduce((acc: DifferencePlotDataRow[], group: DifferenceCardConfigCompareGroup) => {
        switch (group) {
          case DifferenceCardConfigCompareGroup.MODEL_METRICS:
            acc.push({
              [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: formatMessage({
                defaultMessage: `Model Metrics`,
                description:
                  'Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > model metrics heading',
              }),
              children: [...modelMetrics],
              key: 'modelMetrics',
            });
            break;
          case DifferenceCardConfigCompareGroup.SYSTEM_METRICS:
            acc.push({
              [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: formatMessage({
                defaultMessage: `System Metrics`,
                description:
                  'Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > system metrics heading',
              }),
              children: [...systemMetrics],
              key: 'systemMetrics',
            });
            break;
          case DifferenceCardConfigCompareGroup.PARAMETERS:
            acc.push({
              [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: formatMessage({
                defaultMessage: `Parameters`,
                description:
                  'Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > parameters heading',
              }),
              children: getDifferencePlotJSONRows(parameters),
              key: 'parameters',
            });
            break;
          case DifferenceCardConfigCompareGroup.ATTRIBUTES:
            acc.push({
              [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: formatMessage({
                defaultMessage: `Attributes`,
                description:
                  'Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > attributes heading',
              }),
              children: [...attributes],
              key: 'attributes',
            });
            break;
          case DifferenceCardConfigCompareGroup.TAGS:
            acc.push({
              [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: formatMessage({
                defaultMessage: `Tags`,
                description: 'Experiment tracking > runs charts > cards > RunsChartsDifferenceChartCard > tags heading',
              }),
              children: [...tags],
              key: 'tags',
            });
            break;
        }
        return acc;
      }, []),
    [modelMetrics, systemMetrics, parameters, tags, attributes, cardConfig.compareGroups, formatMessage],
  );

  const columns = useMemo(() => {
    const columns: DifferencePlotDataColumnDef[] = [
      {
        id: DIFFERENCE_PLOT_EXPAND_COLUMN_ID,
        cell: ExpandCell,
        size: 32,
        enableResizing: false,
      },
      {
        accessorKey: DIFFERENCE_PLOT_HEADING_COLUMN_ID,
        size: 150,
        header: formatMessage({
          defaultMessage: 'Compare by',
          description: 'Runs charts > components > charts > DifferenceViewPlot > Compare by column heading',
        }),
        id: DIFFERENCE_PLOT_HEADING_COLUMN_ID,
        enableResizing: true,
      },
      ...[baselineColumn, ...nonBaselineColumns].map((traceData, index) => ({
        accessorKey: traceData?.uuid,
        size: 200,
        enableResizing: true,
        meta: {
          traceData,
          updateBaselineColumnUuid,
          showChangeFromBaseline: cardConfig.showChangeFromBaseline,
          isBaseline: traceData === baselineColumn,
          baselineColumnUuid: baselineColumn?.uuid,
        },
        id: traceData?.uuid ?? index.toString(),
        header: DifferencePlotRunHeaderCell as ColumnDefTemplate<DifferencePlotDataRow>,
        cell: DifferencePlotDataCell as ColumnDefTemplate<DifferencePlotDataRow>,
      })),
    ];
    return columns;
  }, [formatMessage, baselineColumn, nonBaselineColumns, updateBaselineColumnUuid, cardConfig.showChangeFromBaseline]);

  // Start with all row groups expanded
  const [expanded, setExpanded] = useState({
    modelMetrics: true,
    systemMetrics: true,
    parameters: true,
    attributes: true,
    tags: true,
  });

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/DifferenceViewPlot.tsx',
    {
      columns,
      data: dataRows,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      columnResizeMode: 'onChange',
      enableExpanding: true,
      getSubRows: (row) => row.children,
      getRowId: (row) => row.key,
      getRowCanExpand: (row) => Boolean(row.subRows.length),
      state: {
        expanded,
        columnPinning: {
          left: [DIFFERENCE_PLOT_EXPAND_COLUMN_ID, DIFFERENCE_PLOT_HEADING_COLUMN_ID],
        },
      },
    },
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = useCallback((row: Row<DifferencePlotDataRow>) => {
    const key = row.original.key;
    setExpanded((prev) => ({
      ...prev,
      [key]: !row.getIsExpanded(),
    }));
  }, []);

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: table.getExpandedRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 33, // Default row height
    paddingStart: 37, // Default header height,
  });

  const expandedRows = table.getExpandedRowModel().rows;

  return (
    <div css={{ flex: 1, overflowX: 'scroll', height: '100%' }} ref={tableContainerRef}>
      <Table css={{ width: table.getTotalSize(), position: 'relative' }}>
        <TableRow isHeader css={{ position: 'sticky', top: 0, zIndex: 101 }}>
          {table.getLeafHeaders().map((header, index) => {
            const isPinned = header.column.getIsPinned();

            return (
              <TableHeader
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                componentId="mlflow.charts.difference_plot.header"
                key={header.id}
                multiline={false}
                style={{
                  left: isPinned === 'left' ? `${header.column.getStart('left')}px` : undefined,
                  position: isPinned ? 'sticky' : 'relative',
                  width: header.column.getSize(),
                  flexBasis: header.column.getSize(),
                  zIndex: isPinned ? 100 : 0,
                }}
                wrapContent={false}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            );
          })}
        </TableRow>
        <div css={{ height: getTotalSize() }}>
          {getVirtualItems().map(({ index, start, size }) => {
            const row = expandedRows[index];

            return (
              <TableRow
                key={row.id + index}
                css={{
                  width: 'auto',
                  position: 'absolute',
                  top: 0,
                }}
                style={{
                  transform: `translateY(${start}px)`,
                  height: size,
                }}
              >
                {row.getVisibleCells().map((cell, index) => {
                  const isPinned = cell.column.getIsPinned();

                  const isNameColumn = cell.column.columnDef.id === DIFFERENCE_PLOT_HEADING_COLUMN_ID;
                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        left: isPinned === 'left' ? `${cell.column.getStart('left')}px` : undefined,
                        position: isPinned ? 'sticky' : 'relative',
                        width: cell.column.getSize(),
                        zIndex: isPinned ? 100 : 0,
                        flexBasis: cell.column.getSize(),
                      }}
                      css={[
                        {
                          backgroundColor: isPinned ? theme.colors.backgroundPrimary : undefined,
                        },
                        isNameColumn && { borderRight: `1px solid ${theme.colors.border}` },
                        isNameColumn && { paddingLeft: row.depth * theme.spacing.lg },
                      ]}
                      wrapContent={false}
                    >
                      {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), toggleExpand })}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </div>
      </Table>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: DifferenceViewPlot.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/DifferenceViewPlot.utils.tsx

```typescript
import type { TypographyColor } from '@databricks/design-system';
import { ArrowDownIcon, ArrowUpIcon, DashIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { DifferenceChartCellDirection } from '../../utils/differenceView';

export const CellDifference = ({ label, direction }: { label: string; direction: DifferenceChartCellDirection }) => {
  const { theme } = useDesignSystemTheme();
  let paragraphColor: TypographyColor | undefined = undefined;
  let icon = null;
  switch (direction) {
    case DifferenceChartCellDirection.NEGATIVE:
      paragraphColor = 'error';
      icon = <ArrowDownIcon color="danger" data-testid="negative-cell-direction" />;
      break;
    case DifferenceChartCellDirection.POSITIVE:
      paragraphColor = 'success';
      icon = <ArrowUpIcon color="success" data-testid="positive-cell-direction" />;
      break;
    case DifferenceChartCellDirection.SAME:
      paragraphColor = 'info';
      icon = <DashIcon css={{ color: theme.colors.textSecondary }} data-testid="same-cell-direction" />;
      break;
    default:
      break;
  }

  return (
    <div css={{ display: 'inline-flex', gap: theme.spacing.xs, alignItems: 'center' }}>
      <Typography.Paragraph color={paragraphColor} css={{ margin: 0 }}>
        {label}
      </Typography.Paragraph>
      {icon}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ImageGridMultipleKeyPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/ImageGridMultipleKeyPlot.tsx
Signals: React

```typescript
import { useDesignSystemTheme, TableRow, TableHeader, TableCell, Table, Tooltip } from '@databricks/design-system';
import { RunColorPill } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/components/RunColorPill';
import { useMemo } from 'react';
import type { RunsChartsImageCardConfig, RunsChartsCardConfig } from '../../runs-charts.types';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { EmptyImageGridPlot, ImagePlotWithHistory, MIN_GRID_IMAGE_SIZE } from './ImageGridPlot.common';
import type { ImageEntity } from '@mlflow/mlflow/src/experiment-tracking/types';
import { FormattedMessage } from 'react-intl';

export const ImageGridMultipleKeyPlot = ({
  previewData,
  cardConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsImageCardConfig;
  groupBy?: string;
  setCardConfig?: (setter: (current: RunsChartsCardConfig) => RunsChartsImageCardConfig) => void;
}) => {
  const { theme } = useDesignSystemTheme();

  const displayRuns = previewData.filter((run: RunsChartsRunData) => Object.keys(run.images).length !== 0);

  if (displayRuns.length === 0) {
    return <EmptyImageGridPlot />;
  }
  return (
    <div css={{ height: '100%', width: '100%' }}>
      <Table grid scrollable>
        <TableRow isHeader>
          <TableHeader
            componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_charts_imagegridmultiplekeyplot.tsx_44"
            css={{ minWidth: MIN_GRID_IMAGE_SIZE + theme.spacing.md }}
          >
            <FormattedMessage
              defaultMessage="images"
              description="Experiment tracking > runs charts > charts > image grid multiple key > table header text"
            />
          </TableHeader>
          {displayRuns.map((run: RunsChartsRunData) => {
            return (
              <TableHeader
                componentId="codegen_mlflow_app_src_experiment-tracking_components_runs-charts_components_charts_imagegridmultiplekeyplot.tsx_52"
                key={run.uuid}
                css={{ minWidth: MIN_GRID_IMAGE_SIZE + theme.spacing.md }}
              >
                <Tooltip content={run.displayName} componentId="mlflow.charts.image-plot.run-name-tooltip">
                  <div
                    css={{
                      height: theme.typography.lineHeightMd,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      margin: 'auto',
                      gap: theme.spacing.sm,
                      fontWeight: 'normal',
                    }}
                  >
                    <RunColorPill color={run.color} />
                    {run.displayName}
                  </div>
                </Tooltip>
              </TableHeader>
            );
          })}
        </TableRow>
        {cardConfig.imageKeys.map((imageKey) => {
          return (
            <TableRow key={imageKey}>
              <TableCell css={{ minWidth: MIN_GRID_IMAGE_SIZE + theme.spacing.md }}>
                <div style={{ whiteSpace: 'normal' }}>{imageKey}</div>
              </TableCell>
              {displayRuns.map((run: RunsChartsRunData) => {
                if (run.images[imageKey] && Object.keys(run.images[imageKey]).length > 0) {
                  const metadataByStep = Object.values(run.images[imageKey]).reduce((acc, metadata) => {
                    if (metadata.step !== undefined) {
                      acc[metadata.step] = metadata;
                    }
                    return acc;
                  }, {} as Record<number, ImageEntity>);
                  return (
                    <TableCell
                      key={run.uuid}
                      css={{
                        minWidth: MIN_GRID_IMAGE_SIZE + theme.spacing.md,
                        '&:hover': {
                          backgroundColor: theme.colors.tableBackgroundUnselectedHover,
                        },
                      }}
                    >
                      <ImagePlotWithHistory metadataByStep={metadataByStep} step={cardConfig.step} runUuid={run.uuid} />
                    </TableCell>
                  );
                }
                return <TableCell key={run.uuid} css={{ minWidth: MIN_GRID_IMAGE_SIZE + theme.spacing.md }} />;
              })}
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ImageGridPlot.common.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/ImageGridPlot.common.tsx
Signals: React

```typescript
import { ImageIcon, Spinner } from '@databricks/design-system';
import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { getArtifactLocationUrl } from '@mlflow/mlflow/src/common/utils/ArtifactUtils';
import type { ImageEntity } from '@mlflow/mlflow/src/experiment-tracking/types';
import { useState, useEffect } from 'react';
import { Typography } from '@databricks/design-system';
import { ImagePreviewGroup, Image } from '../../../../../shared/building_blocks/Image';

/**
 * Despite image size being dynamic, we want to set a minimum size for the grid images.
 */
export const MIN_GRID_IMAGE_SIZE = 200;

type ImagePlotProps = {
  imageUrl: string;
  compressedImageUrl: string;
  imageSize?: number;
  maxImageSize?: number;
};

export const ImagePlot = ({ imageUrl, compressedImageUrl, imageSize, maxImageSize }: ImagePlotProps) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const { theme } = useDesignSystemTheme();

  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    // Load the image in the memory (should reuse the same request) in order to get the loading state
    setImageLoading(true);
    const img = new window.Image();
    img.onload = () => setImageLoading(false);
    img.onerror = () => setImageLoading(false);
    img.src = compressedImageUrl;
    return () => {
      img.src = '';
    };
  }, [compressedImageUrl]);

  return (
    <div css={{ width: imageSize || '100%', height: imageSize || '100%' }}>
      <div css={{ display: 'contents' }}>
        {compressedImageUrl === undefined || imageLoading ? (
          <div
            css={{
              width: '100%',
              backgroundColor: theme.colors.backgroundSecondary,
              display: 'flex',
              aspectRatio: '1',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </div>
        ) : (
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: imageSize || '100%',
              aspectRatio: '1',
              maxWidth: maxImageSize,
              maxHeight: maxImageSize,
              backgroundColor: theme.colors.backgroundSecondary,
              '.rc-image': {
                cursor: 'pointer',
              },
            }}
          >
            <ImagePreviewGroup visible={previewVisible} onVisibleChange={setPreviewVisible}>
              <Image
                src={compressedImageUrl}
                preview={{ src: imageUrl }}
                style={{ maxWidth: maxImageSize || '100%', maxHeight: maxImageSize || '100%' }}
              />
            </ImagePreviewGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export const ImagePlotWithHistory = ({
  metadataByStep,
  imageSize,
  step,
  runUuid,
}: {
  metadataByStep: Record<number, ImageEntity>;
  imageSize?: number;
  step: number;
  runUuid: string;
}) => {
  const { theme } = useDesignSystemTheme();

  if (metadataByStep[step] === undefined) {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: imageSize,
          backgroundColor: theme.colors.backgroundSecondary,
          padding: theme.spacing.md,
          aspectRatio: '1',
        }}
      >
        <ImageIcon />
        <FormattedMessage
          defaultMessage="No image logged at this step"
          description="Experiment tracking > runs charts > charts > image plot with history > no image text"
        />
      </div>
    );
  }
  return (
    <ImagePlot
      imageUrl={getArtifactLocationUrl(metadataByStep[step].filepath, runUuid)}
      compressedImageUrl={getArtifactLocationUrl(metadataByStep[step].compressed_filepath, runUuid)}
      imageSize={imageSize}
    />
  );
};

export const EmptyImageGridPlot = () => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        fontSize: 16,
      }}
    >
      <Typography.Title css={{ marginTop: 16 }} color="secondary" level={3}>
        Compare logged images
      </Typography.Title>
      <Typography.Text css={{ marginBottom: 16 }} color="secondary">
        Use the image grid chart to compare logged images across runs.
      </Typography.Text>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ImageGridPlot.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/components/charts/ImageGridPlot.tsx

```typescript
import type { RunsChartsImageCardConfig, RunsChartsCardConfig } from '../../runs-charts.types';
import type { RunsChartsRunData } from '../RunsCharts.common';
import { ImageGridSingleKeyPlot } from './ImageGridSingleKeyPlot';
import { ImageGridMultipleKeyPlot } from './ImageGridMultipleKeyPlot';
import {
  LOG_IMAGE_TAG_INDICATOR,
  NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE,
} from '@mlflow/mlflow/src/experiment-tracking/constants';
import type { RunsGroupByConfig } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/utils/experimentPage.group-row-utils';
import { Empty } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export const ImageGridPlot = ({
  previewData,
  cardConfig,
  groupBy,
  setCardConfig,
}: {
  previewData: RunsChartsRunData[];
  cardConfig: RunsChartsImageCardConfig;
  groupBy: RunsGroupByConfig | null;
  setCardConfig?: (setter: (current: RunsChartsCardConfig) => RunsChartsImageCardConfig) => void;
}) => {
  const containsLoggedImages = previewData.some((run: RunsChartsRunData) => Boolean(run.tags[LOG_IMAGE_TAG_INDICATOR]));

  const filteredPreviewData = previewData
    .filter((run: RunsChartsRunData) => {
      return run.tags[LOG_IMAGE_TAG_INDICATOR];
    })
    .slice(-NUM_RUNS_TO_SUPPORT_FOR_LOG_IMAGE);

  if (!containsLoggedImages) {
    return (
      <div css={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Empty
          title={
            <FormattedMessage
              defaultMessage="No images found"
              description="Title for the empty state when no images are found in the currently visible runs"
            />
          }
          description={
            <FormattedMessage
              defaultMessage="No logged images found in the currently visible runs"
              description="Description for the empty state when no images are found in the currently visible runs"
            />
          }
        />
      </div>
    );
  }

  if (cardConfig.imageKeys.length === 1) {
    return <ImageGridSingleKeyPlot previewData={filteredPreviewData} cardConfig={cardConfig} />;
  } else if (cardConfig.imageKeys.length > 1) {
    return <ImageGridMultipleKeyPlot previewData={filteredPreviewData} cardConfig={cardConfig} />;
  }
  return null;
};
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 473
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 473 of 991)

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

---[FILE: useExperimentLoggedModelListPageTableColumns.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelListPageTableColumns.test.tsx
Signals: React

```typescript
import { describe, it, expect, jest } from '@jest/globals';
import { renderHook, render, screen, waitFor } from '@testing-library/react';
import type { LoggedModelProto, LoggedModelMetricProto } from '../../../types';
import {
  useExperimentLoggedModelListPageTableColumns,
  parseLoggedModelMetricOrderByColumnId,
} from './useExperimentLoggedModelListPageTableColumns';
import { IntlProvider } from 'react-intl';
import type { ColDef, ColGroupDef } from '@ag-grid-community/core';
import React from 'react';
import { ExperimentLoggedModelOpenDatasetDetailsContext } from './useExperimentLoggedModelOpenDatasetDetails';
import userEvent from '@testing-library/user-event';

const createTestMetric = (
  key: string,
  value: number,
  dataset_name?: string,
  index?: number,
): LoggedModelMetricProto => ({
  key,
  value,
  dataset_digest: '123',
  dataset_name,
  run_id: (123 + (index ?? 0)).toString(),
  step: 1,
  timestamp: 1728322600000,
});

describe('useExperimentLoggedModelListPageTableColumns', () => {
  describe('grouping metrics by datasets', () => {
    const loggedModels: LoggedModelProto[] = new Array(3).fill(0).map<LoggedModelProto>((_, index) => ({
      __typename: 'MlflowLoggedModel',
      info: {
        modelId: 'test-model-id',
      } as any,
      data: {
        __typename: 'MlflowLoggedModelData',
        // Let's prepare some easibly testable metrics
        metrics: [
          // Metric 1 will be logged in all 3 datasets, 100s will be be model index, 10s will be metric name and 1s will be dataset index
          createTestMetric('metric-1', (index + 1) * 100 + 10 + 1, 'dataset-1', index),
          createTestMetric('metric-1', (index + 1) * 100 + 10 + 2, 'dataset-2', index),
          createTestMetric('metric-1', (index + 1) * 100 + 10 + 3, 'dataset-3', index),

          // Metric 2 will be logged only in dataset-1, 100s will be be model index, 10s will be metric name and 1s will be dataset index
          createTestMetric('metric-2', (index + 1) * 100 + 20 + 1, 'dataset-2', index),

          // Metric 3 will have no dataset set
          createTestMetric('metric-3', (index + 1) * 100 + 20 + 1, undefined, index),
        ],
        params: undefined,
      },
    }));

    const renderTestHook = () => {
      const { columnDefs } = renderHook(() => useExperimentLoggedModelListPageTableColumns({ loggedModels }), {
        wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
      }).result.current;

      return columnDefs;
    };

    it('should group metrics by dataset name', () => {
      const hookResult = renderTestHook();

      const datasetNames = ['No dataset', 'dataset-1 (#123)', 'dataset-2 (#123)', 'dataset-3 (#123)'];

      // Let's get the column groups that are related to metrics
      const metricColumnGroups = hookResult.filter(
        (columnDef) =>
          columnDef.headerName === '' || (columnDef.headerName && datasetNames.includes(columnDef.headerName)),
      );

      const renderCell = (column: ColDef | ColGroupDef, data: LoggedModelProto) =>
        'valueGetter' in column && typeof column.valueGetter === 'function' && column.valueGetter({ data } as any);

      // Render our table rows
      const rows = loggedModels.map((loggedModel) =>
        metricColumnGroups.reduce(
          (result, columnGroup) => ({
            ...result,
            [columnGroup.headerName ?? '']: ('children' in columnGroup
              ? (columnGroup.children as ColDef[])
              : []
            ).reduce(
              (groupResult, metricColumn) => ({
                ...groupResult,
                [metricColumn.headerName ?? '']: renderCell(metricColumn, loggedModel),
              }),
              {},
            ),
          }),
          {},
        ),
      );

      expect(rows).toEqual([
        {
          // metric-3 should be ungrouped
          '': {
            'metric-3': 121,
          },
          'dataset-1 (#123)': {
            'metric-1': 111,
            'metric-2': undefined,
          },
          'dataset-2 (#123)': {
            'metric-1': 112,
            'metric-2': 121,
          },
          'dataset-3 (#123)': {
            'metric-1': 113,
            'metric-2': undefined,
          },
        },
        {
          // metric-3 should be ungrouped
          '': {
            'metric-3': 221,
          },
          'dataset-1 (#123)': {
            'metric-1': 211,
            'metric-2': undefined,
          },
          'dataset-2 (#123)': {
            'metric-1': 212,
            'metric-2': 221,
          },
          'dataset-3 (#123)': {
            'metric-1': 213,
            'metric-2': undefined,
          },
        },
        {
          // metric-3 should be ungrouped
          '': {
            'metric-3': 321,
          },
          'dataset-1 (#123)': {
            'metric-1': 311,
            'metric-2': undefined,
          },
          'dataset-2 (#123)': {
            'metric-1': 312,
            'metric-2': 321,
          },
          'dataset-3 (#123)': {
            'metric-1': 313,
            'metric-2': undefined,
          },
        },
      ]);
    });

    it('should render clickable column headers', async () => {
      const hookResult = renderTestHook();
      const onDatasetClicked = jest.fn();

      const datasetNames = ['No dataset', 'dataset-1 (#123)', 'dataset-2 (#123)', 'dataset-3 (#123)'];

      // Let's get the column groups that are related to metrics
      const metricColumnGroups = hookResult
        .filter(
          (columnDef) =>
            columnDef.headerName === '' || (columnDef.headerName && datasetNames.includes(columnDef.headerName)),
        )
        .map((colGroup) => ({
          ...colGroup,
          getGroupId: () => (colGroup as ColGroupDef).groupId,
        })) as ColGroupDef[];

      render(
        <div>
          {metricColumnGroups.map((columnGroup) => (
            <div key={columnGroup.groupId}>
              {React.createElement(columnGroup.headerGroupComponent, { columnGroup })}
            </div>
          ))}
        </div>,
        {
          wrapper: ({ children }) => (
            // @ts-expect-error Type 'unknown' is not assignable to type 'Promise<void>'
            <ExperimentLoggedModelOpenDatasetDetailsContext.Provider value={{ onDatasetClicked }}>
              <IntlProvider locale="en">{children}</IntlProvider>
            </ExperimentLoggedModelOpenDatasetDetailsContext.Provider>
          ),
        },
      );

      // Wait for the particular dataset header to be rendered
      await waitFor(() => {
        expect(screen.getByText('dataset-1 (#123)')).toBeVisible();
      });

      // Assert other dataset names are also visible
      expect(screen.getByText('No dataset')).toBeVisible();
      expect(screen.getByText('dataset-2 (#123)')).toBeVisible();
      expect(screen.getByText('dataset-3 (#123)')).toBeVisible();

      // Click on the dataset-1 header
      await userEvent.click(screen.getByText('dataset-1 (#123)'));

      // Assert the dataset click callback was called with the dataset name and digest
      // and with the first found run id
      await waitFor(() => {
        expect(onDatasetClicked).toHaveBeenCalledWith({
          datasetName: 'dataset-1',
          datasetDigest: '123',
          runId: '123',
        });
      });
    });
  });

  describe('parseLoggedModelMetricOrderByColumnId', () => {
    describe('with dataset names containing dots', () => {
      it('should correctly parse dataset names with single dot', () => {
        const columnId = 'metrics.{"metricKey":"accuracy","datasetName":"dataset.v1","datasetDigest":"abc123"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'accuracy',
          datasetName: 'dataset.v1',
          datasetDigest: 'abc123',
        });
      });

      it('should correctly parse dataset names with multiple dots', () => {
        const columnId =
          'metrics.{"metricKey":"f1_score","datasetName":"my.dataset.v2.final","datasetDigest":"xyz789"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'f1_score',
          datasetName: 'my.dataset.v2.final',
          datasetDigest: 'xyz789',
        });
      });

      it('should correctly parse dataset names with dots at start and end', () => {
        const columnId = 'metrics.{"metricKey":"precision","datasetName":".dataset.name.","datasetDigest":"digest456"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'precision',
          datasetName: '.dataset.name.',
          datasetDigest: 'digest456',
        });
      });

      it('should correctly parse dataset names with consecutive dots', () => {
        const columnId = 'metrics.{"metricKey":"recall","datasetName":"dataset..name","datasetDigest":"hash999"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'recall',
          datasetName: 'dataset..name',
          datasetDigest: 'hash999',
        });
      });
    });

    describe('with metric keys containing dots', () => {
      it('should correctly parse metric keys with dots', () => {
        const columnId =
          'metrics.{"metricKey":"metrics.accuracy.train","datasetName":"training_set","datasetDigest":"abc123"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'metrics.accuracy.train',
          datasetName: 'training_set',
          datasetDigest: 'abc123',
        });
      });

      it('should correctly parse metric keys with dots and no dataset', () => {
        const columnId = 'metrics.{"metricKey":"eval.metrics.f1"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'eval.metrics.f1',
          datasetName: undefined,
          datasetDigest: undefined,
        });
      });
    });

    describe('with ungrouped metrics', () => {
      it('should correctly parse ungrouped metrics without dataset', () => {
        const columnId = 'metrics.{"metricKey":"loss"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: 'loss',
          datasetName: undefined,
          datasetDigest: undefined,
        });
      });
    });

    describe('with non-metric column IDs', () => {
      it('should return fallback for column ID without prefix', () => {
        const columnId = 'created_time';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: columnId,
          datasetName: undefined,
          datasetDigest: undefined,
        });
      });

      it('should return fallback for invalid JSON', () => {
        const columnId = 'metrics.not-valid-json';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: columnId,
          datasetName: undefined,
          datasetDigest: undefined,
        });
      });

      it('should return fallback for JSON missing metricKey', () => {
        const columnId = 'metrics.{"datasetName":"dataset","datasetDigest":"digest"}';

        const result = parseLoggedModelMetricOrderByColumnId(columnId);

        expect(result).toEqual({
          metricKey: columnId,
          datasetName: undefined,
          datasetDigest: undefined,
        });
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelListPageTableColumns.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelListPageTableColumns.tsx
Signals: React

```typescript
import type { ColDef, ColGroupDef } from '@ag-grid-community/core';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { ExperimentLoggedModelTableNameCell } from '../ExperimentLoggedModelTableNameCell';
import { ExperimentLoggedModelTableDateCell } from '../ExperimentLoggedModelTableDateCell';
import { ExperimentLoggedModelStatusIndicator } from '../ExperimentLoggedModelStatusIndicator';
import { ExperimentLoggedModelTableDatasetCell } from '../ExperimentLoggedModelTableDatasetCell';
import type { LoggedModelProto } from '../../../types';
import { compact, isEqual, values, uniq, orderBy, isObject } from 'lodash';
import { ExperimentLoggedModelTableSourceRunCell } from '../ExperimentLoggedModelTableSourceRunCell';
import {
  ExperimentLoggedModelActionsCell,
  ExperimentLoggedModelActionsHeaderCell,
} from '../ExperimentLoggedModelActionsCell';
import { ExperimentLoggedModelTableRegisteredModelsCell } from '../ExperimentLoggedModelTableRegisteredModelsCell';
import {
  createLoggedModelDatasetColumnGroupId,
  ExperimentLoggedModelTableDatasetColHeader,
} from '../ExperimentLoggedModelTableDatasetColHeader';
import { ExperimentLoggedModelTableSourceCell } from '../ExperimentLoggedModelTableSourceCell';
import { shouldUnifyLoggedModelsAndRegisteredModels } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import {
  LoggedModelsTableGroupHeaderRowClass,
  type LoggedModelsTableRow,
} from '../ExperimentLoggedModelListPageTable.utils';

/**
 * Utility hook that memoizes value based on deep comparison.
 * Helps to regenerate columns only if underlying dependencies change.
 */
const useMemoizeColumns = <T,>(factory: () => T, deps: unknown[], disable?: boolean): T => {
  const ref = useRef<{ deps: unknown[]; value: T }>();

  if (!ref.current || (!isEqual(deps, ref.current.deps) && !disable)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
};

export enum ExperimentLoggedModelListPageKnownColumnGroups {
  Attributes = 'attributes',
  Params = 'params',
}

export enum ExperimentLoggedModelListPageKnownColumns {
  RelationshipType = 'relationship_type',
  Step = 'step',
  Select = 'select',
  Name = 'name',
  Status = 'status',
  CreationTime = 'creation_time',
  Source = 'source',
  SourceRun = 'source_run_id',
  RegisteredModels = 'registered_models',
  Dataset = 'dataset',
}

export const LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX = 'metrics.';

export const ExperimentLoggedModelListPageStaticColumns: string[] = [
  ExperimentLoggedModelListPageKnownColumns.Select,
  ExperimentLoggedModelListPageKnownColumns.Name,
  ExperimentLoggedModelListPageKnownColumns.CreationTime,
];

const createDatasetHash = (datasetName?: string, datasetDigest?: string) => {
  if (!datasetName || !datasetDigest) {
    return '';
  }
  return JSON.stringify([datasetName, datasetDigest]);
};

// Creates a metric column ID based on the metric key and optional dataset name and digest.
const createLoggedModelMetricOrderByColumnId = (
  metricKey: string,
  datasetName?: string,
  datasetDigest?: string,
): string => {
  const data: {
    metricKey: string;
    datasetName?: string;
    datasetDigest?: string;
  } = { metricKey };

  // Only include dataset fields if both are provided
  if (datasetName && datasetDigest) {
    data.datasetName = datasetName;
    data.datasetDigest = datasetDigest;
  }

  return `${LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX}${JSON.stringify(data)}`;
};

// Parse `metrics.<json>` format and return the structured data
// Falls back to safe defaults on any parsing error
export const parseLoggedModelMetricOrderByColumnId = (metricColumnId: string) => {
  // Default fallback values
  const fallback = {
    metricKey: metricColumnId,
    datasetName: undefined,
    datasetDigest: undefined,
  };

  // Check if it has the expected prefix
  if (!metricColumnId.startsWith(LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX)) {
    return fallback;
  }

  // Extract the JSON part
  const jsonPart = metricColumnId.slice(LOGGED_MODEL_LIST_METRIC_COLUMN_PREFIX.length);

  try {
    const parsed = JSON.parse(jsonPart) as {
      metricKey: string;
      datasetName?: string;
      datasetDigest?: string;
    };

    // Validate that we have at least a metricKey
    if (!parsed.metricKey || typeof parsed.metricKey !== 'string') {
      throw new Error('Invalid metric column data: missing or invalid metricKey');
    }

    return {
      metricKey: parsed.metricKey,
      datasetName: parsed.datasetName,
      datasetDigest: parsed.datasetDigest,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse metric column ID:', error);
    return fallback;
  }
};

/**
 * Iterate through all logged models and metrics grouped by datasets.
 * Each group is identified by a hashed combination of dataset name and digest.
 * For metrics without dataset, use empty string as a key.
 * The result is a map of dataset hashes to an object containing the dataset name, digest, metrics
 * and the first run ID found for that dataset.
 */
const extractMetricGroups = (loggedModels: LoggedModelProto[]) => {
  const result: Record<string, { datasetDigest?: string; datasetName?: string; runId?: string; metrics: string[] }> =
    {};
  for (const loggedModel of orderBy(loggedModels, (model) => model.info?.model_id)) {
    for (const metric of loggedModel?.data?.metrics ?? []) {
      if (!metric.key) {
        continue;
      }
      const datasetHash =
        metric.dataset_name && metric.dataset_digest
          ? createDatasetHash(metric.dataset_name, metric.dataset_digest)
          : '';

      if (!result[datasetHash]) {
        result[datasetHash] = {
          datasetName: metric.dataset_name,
          datasetDigest: metric.dataset_digest,
          // We use first found run ID, as it will be used for dataset fetching.
          runId: metric.run_id,
          metrics: [],
        };
      }
      if (result[datasetHash] && !result[datasetHash].metrics.includes(metric.key)) {
        result[datasetHash].metrics.push(metric.key);
      }
    }
  }
  return result;
};

const defaultColumnSet = [
  ExperimentLoggedModelListPageKnownColumns.Name,
  ExperimentLoggedModelListPageKnownColumns.Status,
  ExperimentLoggedModelListPageKnownColumns.CreationTime,
  ExperimentLoggedModelListPageKnownColumns.Source,
  ExperimentLoggedModelListPageKnownColumns.SourceRun,
  ExperimentLoggedModelListPageKnownColumns.RegisteredModels,
  ExperimentLoggedModelListPageKnownColumns.Dataset,
];

/**
 * Returns the columns for the logged model list table.
 * Metric column IDs follow the structure:
 * - `metrics.<datasetName>.<metricKey>` for metrics grouped by dataset
 * - `metrics.<metricKey>` for ungrouped metrics
 */
export const useExperimentLoggedModelListPageTableColumns = ({
  columnVisibility = {},
  supportedAttributeColumnKeys = defaultColumnSet,
  loggedModels = [],
  disablePinnedColumns = false,
  disableOrderBy = false,
  enableSortingByMetrics,
  orderByColumn,
  orderByAsc,
  isLoading,
}: {
  loggedModels?: LoggedModelProto[];
  columnVisibility?: Record<string, boolean>;
  disablePinnedColumns?: boolean;
  supportedAttributeColumnKeys?: string[];
  disableOrderBy?: boolean;
  enableSortingByMetrics?: boolean;
  orderByColumn?: string;
  orderByAsc?: boolean;
  isLoading?: boolean;
}) => {
  const datasetMetricGroups = useMemo(() => extractMetricGroups(loggedModels), [loggedModels]);

  const parameterKeys = useMemo(
    () => compact(uniq(loggedModels.map((loggedModel) => loggedModel?.data?.params?.map((param) => param.key)).flat())),
    [loggedModels],
  );

  const intl = useIntl();

  return useMemoizeColumns(
    () => {
      const isUnifiedLoggedModelsEnabled = shouldUnifyLoggedModelsAndRegisteredModels();

      const attributeColumns: ColDef[] = [
        {
          colId: ExperimentLoggedModelListPageKnownColumns.RelationshipType,
          headerName: 'Type',
          sortable: false,
          valueGetter: ({ data }) => {
            return data.direction === 'input'
              ? intl.formatMessage({
                  defaultMessage: 'Input',
                  description:
                    'Label indicating that the logged model was the input of the experiment run. Displayed in logged model list table on the run page.',
                })
              : intl.formatMessage({
                  defaultMessage: 'Output',
                  description:
                    'Label indicating that the logged model was the output of the experiment run Displayed in logged model list table on the run page.',
                });
          },
          pinned: !disablePinnedColumns ? 'left' : undefined,
          resizable: false,
          width: 100,
        },
        {
          colId: ExperimentLoggedModelListPageKnownColumns.Step,
          headerName: intl.formatMessage({
            defaultMessage: 'Step',
            description:
              'Header title for the step column in the logged model list table. Step indicates the run step where the model was logged.',
          }),
          field: 'step',
          valueGetter: ({ data }) => data.step ?? '-',
          pinned: !disablePinnedColumns ? 'left' : undefined,
          resizable: false,
          width: 60,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Model name',
            description: 'Header title for the model name column in the logged model list table',
          }),
          colId: ExperimentLoggedModelListPageKnownColumns.Name,
          cellRenderer: ExperimentLoggedModelTableNameCell,
          cellClass: ({ data }: { data: LoggedModelsTableRow }) => {
            return isObject(data) && 'isGroup' in data ? LoggedModelsTableGroupHeaderRowClass : '';
          },
          resizable: true,
          pinned: !disablePinnedColumns ? 'left' : undefined,
          minWidth: 140,
          flex: 1,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Status',
            description: 'Header title for the status column in the logged model list table',
          }),
          cellRenderer: ExperimentLoggedModelStatusIndicator,
          colId: ExperimentLoggedModelListPageKnownColumns.Status,
          pinned: !disablePinnedColumns ? 'left' : undefined,
          width: 140,
          resizable: false,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Created',
            description: 'Header title for the creation timestamp column in the logged model list table',
          }),
          field: 'info.creation_timestamp_ms',
          colId: ExperimentLoggedModelListPageKnownColumns.CreationTime,
          cellRenderer: ExperimentLoggedModelTableDateCell,
          resizable: true,
          pinned: !disablePinnedColumns ? 'left' : undefined,
          sortable: !disableOrderBy,
          sortingOrder: ['desc', 'asc'],
          comparator: () => 0,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Logged from',
            description: "Header title for the 'Logged from' column in the logged model list table",
          }),
          colId: ExperimentLoggedModelListPageKnownColumns.Source,
          cellRenderer: ExperimentLoggedModelTableSourceCell,
          resizable: true,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Source run',
            description: 'Header title for the source run column in the logged model list table',
          }),
          colId: ExperimentLoggedModelListPageKnownColumns.SourceRun,
          cellRenderer: ExperimentLoggedModelTableSourceRunCell,
          resizable: true,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Registered models',
            description: 'Header title for the registered models column in the logged model list table',
          }),
          colId: ExperimentLoggedModelListPageKnownColumns.RegisteredModels,
          cellRenderer: ExperimentLoggedModelTableRegisteredModelsCell,
          resizable: true,
        },

        {
          headerName: intl.formatMessage({
            defaultMessage: 'Dataset',
            description: 'Header title for the dataset column in the logged model list table',
          }),
          colId: ExperimentLoggedModelListPageKnownColumns.Dataset,
          cellRenderer: ExperimentLoggedModelTableDatasetCell,
          resizable: true,
        },
      ];

      const columnDefs: ColGroupDef[] = [
        {
          groupId: 'attributes',
          headerName: intl.formatMessage({
            defaultMessage: 'Model attributes',
            description: 'Header title for the model attributes section of the logged model list table',
          }),
          children: attributeColumns.filter((column) => {
            // Exclude registered models column when unified logged models feature is enabled
            if (
              isUnifiedLoggedModelsEnabled &&
              column.colId === ExperimentLoggedModelListPageKnownColumns.RegisteredModels
            ) {
              return false;
            }
            return !column.colId || supportedAttributeColumnKeys.includes(column.colId);
          }),
        },
      ];

      const metricGroups = orderBy(values(datasetMetricGroups), (group) => group?.datasetName);

      metricGroups.forEach(({ datasetDigest, datasetName, runId, metrics }) => {
        const isUngroupedMetricColumn = !datasetName || !datasetDigest;
        const headerName = isUngroupedMetricColumn ? '' : `${datasetName} (#${datasetDigest})`;
        columnDefs.push({
          headerName,
          groupId: createLoggedModelDatasetColumnGroupId(datasetName, datasetDigest, runId),
          headerGroupComponent: ExperimentLoggedModelTableDatasetColHeader,
          children:
            metrics?.map((metricKey) => {
              const metricColumnId = createLoggedModelMetricOrderByColumnId(metricKey, datasetName, datasetDigest);
              return {
                headerName: metricKey,
                hide: columnVisibility[metricColumnId] === false,
                colId: metricColumnId,
                valueGetter: ({ data }: { data: LoggedModelProto }) => {
                  // NB: Looping through metric values might not seem to be most efficient, but considering the number
                  // metrics we render on the screen it might be more efficient than creating a lookup table.
                  // Might be revisited if performance becomes an issue.
                  for (const metric of data.data?.metrics ?? []) {
                    if (metric.key === metricKey) {
                      if (metric.dataset_name === datasetName || (!datasetName && !metric.dataset_name)) {
                        return metric.value;
                      }
                    }
                  }
                  return undefined;
                },
                resizable: true,
                sortable: enableSortingByMetrics && !disableOrderBy,
                sortingOrder: ['desc', 'asc'],
                comparator: () => 0,
                sort: enableSortingByMetrics && metricColumnId === orderByColumn ? (orderByAsc ? 'asc' : 'desc') : null,
              };
            }) ?? [],
        });
      });

      if (parameterKeys.length > 0) {
        columnDefs.push({
          headerName: intl.formatMessage({
            defaultMessage: 'Parameters',
            description: 'Header title for the parameters section of the logged model list table',
          }),
          groupId: 'params',
          children: parameterKeys.map((paramKey) => ({
            headerName: paramKey,
            colId: `params.${paramKey}`,
            hide: columnVisibility[`params.${paramKey}`] === false,
            valueGetter: ({ data }: { data: LoggedModelProto }) => {
              for (const param of data.data?.params ?? []) {
                if (param.key === paramKey) {
                  return param.value;
                }
              }
              return undefined;
            },
            resizable: true,
          })),
        });
      }

      const compactColumnDefs = [
        {
          headerCheckboxSelection: false,
          checkboxSelection: false,
          width: 40,
          maxWidth: 40,
          resizable: false,
          colId: ExperimentLoggedModelListPageKnownColumns.Select,
          cellRenderer: ExperimentLoggedModelActionsCell,
          headerComponent: ExperimentLoggedModelActionsHeaderCell,
          flex: undefined,
        },
        {
          headerName: intl.formatMessage({
            defaultMessage: 'Model name',
            description: 'Header title for the model name column in the logged model list table',
          }),
          colId: ExperimentLoggedModelListPageKnownColumns.Name,
          cellRenderer: ExperimentLoggedModelTableNameCell,
          resizable: true,
          flex: 1,
        },
      ];

      return { columnDefs, compactColumnDefs };
    },
    [datasetMetricGroups, parameterKeys, supportedAttributeColumnKeys],
    // Do not recreate column definitions if logged models are being loaded, e.g. due to changing sort order
    isLoading,
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelOpenDatasetDetails.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelOpenDatasetDetails.tsx
Signals: React

```typescript
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  type DatasetWithRunType,
  ExperimentViewDatasetDrawer,
} from '../../experiment-page/components/runs/ExperimentViewDatasetDrawer';
import { useLazyGetRunQuery } from '../../run-page/hooks/useGetRunQuery';
import { transformDatasets as transformGraphQLResponseDatasets } from '../../run-page/hooks/useRunDetailsPageData';
import { keyBy } from 'lodash';
import type { KeyValueEntity } from '../../../../common/types';
import { ErrorLogType, ErrorName, PredefinedError } from '@databricks/web-shared/errors';
import { ErrorCodes } from '../../../../common/constants';
import { FormattedMessage } from 'react-intl';

class DatasetRunNotFoundError extends PredefinedError {
  errorLogType = ErrorLogType.UnexpectedSystemStateError;
  errorName = ErrorName.DatasetRunNotFoundError;
  isUserError = true;
  displayMessage = (
    <FormattedMessage
      defaultMessage="The run containing the dataset could not be found."
      description="Error message displayed when the run for the dataset is not found"
    />
  );
}

type ExperimentLoggedModelOpenDatasetDetailsContextType = {
  onDatasetClicked: (params: { datasetName: string; datasetDigest: string; runId: string }) => Promise<void>;
};

export const ExperimentLoggedModelOpenDatasetDetailsContext =
  createContext<ExperimentLoggedModelOpenDatasetDetailsContextType>({
    onDatasetClicked: () => Promise.resolve(),
  });

/**
 * Creates a context provider that allows opening the dataset details drawer from the logged model page.
 * Uses the `useGetRunQuery` GraphQL to fetch the run info for the dataset.
 */
export const ExperimentLoggedModelOpenDatasetDetailsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDatasetWithRun, setSelectedDatasetWithRun] = useState<DatasetWithRunType>();

  const [getRunInfo] = useLazyGetRunQuery();

  // Store the current promise's reject function
  const rejectCurrentPromiseFn = useRef<((reason?: any) => void) | null>(null);

  const onDatasetClicked = useCallback(
    async (params: { datasetName: string; datasetDigest: string; runId: string }) =>
      new Promise<void>((resolve, reject) => {
        // If there's a promise in flight, reject it to remove previous loading state
        rejectCurrentPromiseFn.current?.();

        return getRunInfo({
          onError: reject,
          onCompleted(data) {
            // If there's an API error in the response, reject the promise
            if (data.mlflowGetRun?.apiError) {
              // Special case: if the run is not found, show a different error message
              const error =
                data.mlflowGetRun.apiError.code === ErrorCodes.RESOURCE_DOES_NOT_EXIST
                  ? new DatasetRunNotFoundError()
                  : data.mlflowGetRun.apiError;
              reject(error);
              return;
            }
            // Transform the datasets into a format that can be used by the drawer UI
            const datasets = transformGraphQLResponseDatasets(data.mlflowGetRun?.run?.inputs?.datasetInputs);

            // Ensure that the datasets and run info are present
            if (!datasets || !data.mlflowGetRun?.run?.info) {
              resolve();
              return;
            }

            // Find the dataset that matches the dataset name and digest
            const matchingDataset = datasets?.find(
              (datasetInput) =>
                datasetInput.dataset?.digest === params.datasetDigest &&
                datasetInput.dataset.name === params.datasetName,
            );

            // If the dataset is not found, return early
            if (!matchingDataset) {
              resolve();
              return;
            }
            const { info, data: runData } = data.mlflowGetRun.run;

            // Convert tags into a dictionary for easier access
            const tagsDictionary = keyBy(runData?.tags?.filter((tag) => tag.key && tag.value) ?? [], 'key') as Record<
              string,
              KeyValueEntity
            >;

            // Open the drawer using the dataset and run info
            setIsDrawerOpen(true);
            setSelectedDatasetWithRun({
              datasetWithTags: {
                dataset: matchingDataset.dataset,
                tags: matchingDataset.tags,
              },
              runData: {
                datasets: datasets,
                runUuid: info.runUuid ?? '',
                experimentId: info.experimentId ?? '',
                runName: info.runName ?? '',
                tags: tagsDictionary,
              },
            });

            // Resolve the promise
            resolve();
            rejectCurrentPromiseFn.current = null;
          },
          variables: { data: { runId: params.runId } },
        });
      }),
    [getRunInfo],
  );

  const contextValue = useMemo(() => ({ onDatasetClicked }), [onDatasetClicked]);

  return (
    <ExperimentLoggedModelOpenDatasetDetailsContext.Provider value={contextValue}>
      {children}
      {selectedDatasetWithRun && (
        <ExperimentViewDatasetDrawer
          isOpen={isDrawerOpen}
          selectedDatasetWithRun={selectedDatasetWithRun}
          setIsOpen={setIsDrawerOpen}
          setSelectedDatasetWithRun={setSelectedDatasetWithRun}
        />
      )}
    </ExperimentLoggedModelOpenDatasetDetailsContext.Provider>
  );
};

export const useExperimentLoggedModelOpenDatasetDetails = () =>
  useContext(ExperimentLoggedModelOpenDatasetDetailsContext);
```

--------------------------------------------------------------------------------

---[FILE: useExperimentLoggedModelRegisteredVersions.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-logged-models/hooks/useExperimentLoggedModelRegisteredVersions.tsx
Signals: React

```typescript
import { useMemo } from 'react';
import { useQueries } from '../../../../common/utils/reactQueryHooks';
import type { LoggedModelProto } from '../../../types';
import type { RunPageModelVersionSummary } from '../../run-page/hooks/useUnifiedRegisteredModelVersionsSummariesForRun';
import { createMLflowRoutePath } from '../../../../common/utils/RoutingUtils';
import { isUCModelName } from '../../../utils/IsUCModelName';
const MODEL_VERSIONS_TAG_NAME = 'mlflow.modelVersions';

const getUCModelUrl = (name: string, version: string) =>
  `/explore/data/models/${name.replace(/\./g, '/')}/version/${version}`;
const getWMRModelUrl = (name: string, version: string) => createMLflowRoutePath(`/models/${name}/versions/${version}`);

const getTagValueForModel = (loggedModel: LoggedModelProto): { name: string; version: string }[] | null => {
  try {
    const tagValue = loggedModel.info?.tags?.find((tag) => tag.key === MODEL_VERSIONS_TAG_NAME)?.value;

    if (tagValue) {
      // Try to parse the tag. If it's malformed, catch and return nothing.
      return JSON.parse(tagValue);
    }
  } catch (e) {
    return null;
  }
  return null;
};

// Hook for ACL checking logic
const useModelVersionsAclCheck = (
  ucModels: RunPageModelVersionSummary[],
  checkAcl: boolean,
): { aclResults: Record<string, boolean>; isLoading: boolean } => {
  const queries = useMemo(() => {
    if (!checkAcl || ucModels.length === 0) {
      return [];
    }
    return [];
  }, [ucModels, checkAcl]);

  const queryResults = useQueries({ queries });

  const { aclResults, isLoading } = useMemo(() => {
    if (!checkAcl || ucModels.length === 0) {
      return { aclResults: {}, isLoading: false };
    }

    const isLoading = queryResults.some((result) => result.isLoading);
    const aclResults: Record<string, boolean> = {};
    return { aclResults, isLoading };
  }, [
    // prettier-ignore
    queryResults,
    checkAcl,
    ucModels.length,
  ]);

  return { aclResults, isLoading };
};

export interface RunPageModelVersionSummaryWithAccess extends RunPageModelVersionSummary {
  hasAccess: boolean;
}

export interface UseExperimentLoggedModelRegisteredVersionsResult {
  modelVersions: RunPageModelVersionSummaryWithAccess[];
  isLoading: boolean;
}

export const useExperimentLoggedModelRegisteredVersions = ({
  loggedModels,
  checkAcl = false,
}: {
  loggedModels: LoggedModelProto[];
  checkAcl?: boolean;
}): UseExperimentLoggedModelRegisteredVersionsResult => {
  // Combined useMemo for parsing tags and creating model versions
  const { modelVersions, ucModels } = useMemo(() => {
    const modelVersions = loggedModels.flatMap((loggedModel) => {
      const modelVersionsInTag = getTagValueForModel(loggedModel) ?? [];
      return modelVersionsInTag.map((registeredModelEntry) => {
        const isUCModel = isUCModelName(registeredModelEntry.name);
        const getUrlFn = isUCModel ? getUCModelUrl : getWMRModelUrl;
        return {
          displayedName: registeredModelEntry.name,
          version: registeredModelEntry.version,
          link: getUrlFn(registeredModelEntry.name, registeredModelEntry.version),
          source: null,
          status: null,
          sourceLoggedModel: loggedModel,
        };
      });
    });

    const ucModels = modelVersions.filter((model) => model.displayedName && isUCModelName(model.displayedName));

    return { modelVersions, ucModels };
  }, [loggedModels]);

  const { aclResults, isLoading } = useModelVersionsAclCheck(ucModels, checkAcl);

  // Add hasAccess to each model version
  const modelVersionsWithAccess = useMemo<RunPageModelVersionSummaryWithAccess[]>(
    () =>
      modelVersions.map((modelVersion) => {
        const displayedName = modelVersion.displayedName;
        const isUCModel = displayedName && isUCModelName(displayedName);

        let hasAccess = true; // Default for workspace models

        if (checkAcl && isUCModel && displayedName) {
          // For UC models with ACL check enabled, use the ACL result
          hasAccess = aclResults[`${displayedName}:${modelVersion.version}`] ?? false;
        }

        return {
          ...modelVersion,
          hasAccess,
        };
      }),
    [modelVersions, checkAcl, aclResults],
  );

  return {
    modelVersions: modelVersionsWithAccess,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

````

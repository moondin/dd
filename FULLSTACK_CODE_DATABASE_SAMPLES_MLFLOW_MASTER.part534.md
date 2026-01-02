---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 534
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 534 of 991)

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

---[FILE: differenceView.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/differenceView.ts

```typescript
import { MLFLOW_SYSTEM_METRIC_PREFIX } from '@mlflow/mlflow/src/experiment-tracking/constants';
import type { MetricEntitiesByName } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import type { RunsChartsRunData } from '../components/RunsCharts.common';
import type { RunsChartsDifferenceCardConfig } from '../runs-charts.types';
import { DifferenceCardAttributes } from '../runs-charts.types';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import type { RunsGroupByConfig } from '../../experiment-page/utils/experimentPage.group-row-utils';

const DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE = '-';
const DIFFERENCE_EPSILON = 1e-6;
export const getDifferenceChartDisplayedValue = (val: any, places = 2) => {
  if (typeof val === 'number') {
    return val.toFixed(places);
  } else if (typeof val === 'string') {
    return val;
  }
  try {
    return JSON.stringify(val);
  } catch {
    return DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE;
  }
};

export enum DifferenceChartCellDirection {
  POSITIVE,
  NEGATIVE,
  SAME,
}
export const differenceView = (a: any, b: any) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return undefined;
  } else {
    const diff = a - b;
    if (diff === 0) {
      return { label: getDifferenceChartDisplayedValue(diff).toString(), direction: DifferenceChartCellDirection.SAME };
    } else if (diff > 0) {
      return { label: `+${getDifferenceChartDisplayedValue(diff)}`, direction: DifferenceChartCellDirection.POSITIVE };
    } else {
      return {
        label: getDifferenceChartDisplayedValue(diff).toString(),
        direction: DifferenceChartCellDirection.NEGATIVE,
      };
    }
  }
};

export const isDifferent = (a: any, b: any) => {
  if (a === DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE || b === DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE) {
    return false;
  }
  // Check if type a and b are the same
  if (typeof a !== typeof b) {
    return true;
  } else if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) > DIFFERENCE_EPSILON;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a !== b;
  }
  return false;
};

export const getDifferenceViewDataGroups = (
  previewData: RunsChartsRunData[],
  cardConfig: RunsChartsDifferenceCardConfig,
  headingColumnId: string,
  groupBy: RunsGroupByConfig | null,
) => {
  const getMetrics = (
    filterCondition: (metric: string) => boolean,
    runDataKeys: (data: RunsChartsRunData) => string[],
    runDataAttribute: (
      data: RunsChartsRunData,
    ) =>
      | MetricEntitiesByName
      | Record<string, KeyValueEntity>
      | Record<string, { key: string; value: string | number }>,
  ) => {
    // Get array of sorted keys
    const keys = Array.from(new Set(previewData.flatMap((runData) => runDataKeys(runData))))
      .filter((key) => filterCondition(key))
      .sort();
    const values = keys.flatMap((key: string) => {
      const data: Record<string, string | number> = {};
      let hasDifference = false;

      previewData.forEach((runData, index) => {
        // Set the key as runData.uuid and the value as the metric's value or DEFAULT_EMPTY_VALUE
        data[runData.uuid] = runDataAttribute(runData)[key]
          ? runDataAttribute(runData)[key].value
          : DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE;
        if (index > 0) {
          const prev = previewData[index - 1];
          if (isDifferent(data[prev.uuid], data[runData.uuid])) {
            hasDifference = true;
          }
        }
      });
      if (cardConfig.showDifferencesOnly && !hasDifference) {
        return [];
      }
      return [
        {
          [headingColumnId]: key,
          ...data,
        },
      ];
    });
    return values;
  };

  const modelMetrics = getMetrics(
    (metric: string) => !metric.startsWith(MLFLOW_SYSTEM_METRIC_PREFIX),
    (runData: RunsChartsRunData) => Object.keys(runData.metrics),
    (runData: RunsChartsRunData) => runData.metrics,
  );

  const systemMetrics = getMetrics(
    (metric: string) => metric.startsWith(MLFLOW_SYSTEM_METRIC_PREFIX),
    (runData: RunsChartsRunData) => Object.keys(runData.metrics),
    (runData: RunsChartsRunData) => runData.metrics,
  );

  if (groupBy) {
    return { modelMetrics, systemMetrics, parameters: [], tags: [], attributes: [] };
  }

  const parameters = getMetrics(
    () => true,
    (runData: RunsChartsRunData) => Object.keys(runData.params),
    (runData: RunsChartsRunData) => runData.params,
  );

  const tags = getMetrics(
    () => true,
    (runData: RunsChartsRunData) => Utils.getVisibleTagValues(runData.tags).map(([key]) => key),
    (runData: RunsChartsRunData) => runData.tags,
  );

  // Get attributes
  const attributeGroups = [
    DifferenceCardAttributes.USER,
    DifferenceCardAttributes.SOURCE,
    DifferenceCardAttributes.VERSION,
    DifferenceCardAttributes.MODELS,
  ];
  const attributes = attributeGroups.flatMap((attribute) => {
    const attributeData: Record<string, string | number> = {};
    let hasDifference = false;
    previewData.forEach((runData, index) => {
      if (attribute === DifferenceCardAttributes.USER) {
        const user = Utils.getUser(runData.runInfo ?? {}, runData.tags);
        attributeData[runData.uuid] = user;
      } else if (attribute === DifferenceCardAttributes.SOURCE) {
        const source = Utils.getSourceName(runData.tags);
        attributeData[runData.uuid] = source;
      } else if (attribute === DifferenceCardAttributes.VERSION) {
        const version = Utils.getSourceVersion(runData.tags);
        attributeData[runData.uuid] = version;
      } else {
        const models = Utils.getLoggedModelsFromTags(runData.tags);
        attributeData[runData.uuid] = models.join(',');
      }
      if (index > 0) {
        const prev = previewData[index - 1];
        if (isDifferent(attributeData[prev.uuid], attributeData[runData.uuid])) {
          hasDifference = true;
        }
      }
    });
    if (cardConfig.showDifferencesOnly && !hasDifference) {
      return [];
    }
    return [
      {
        [headingColumnId]: attribute,
        ...attributeData,
      },
    ];
  });
  return { modelMetrics, systemMetrics, parameters, tags, attributes };
};

export const DIFFERENCE_PLOT_EXPAND_COLUMN_ID = 'expand';
export const DIFFERENCE_PLOT_HEADING_COLUMN_ID = 'headingColumn';

/**
 * Transforms an array of objects into a format suitable for rendering in a table.
 * Each object in the array represents a row in the table.
 * If all values in a row are JSON objects with the same keys, the row is transformed into a parent row with child rows.
 * Each child row represents a key-value pair from the JSON objects.
 * If a value in a row is not a JSON object or the JSON objects don't have the same keys, the row is not transformed.
 *
 * @param data - An array of objects. Each object represents a row in the table.
 * @returns An array of objects. Each object represents a row or a parent row with child rows in the table.
 */
export const getDifferencePlotJSONRows = (data: { [key: string]: string | number }[]) => {
  const validateParseJSON = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed) || Object.keys(parsed).length === 0) {
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  };

  const extractMaximumCommonSchema = (schema1: Record<any, any> | undefined, schema2: Record<any, any> | undefined) => {
    if (schema1 !== undefined && Object.keys(schema1).length === 0) {
      // This may not be a suitable object, return null
      return null;
    } else if (schema2 !== undefined && Object.keys(schema2).length === 0) {
      return null;
    }

    const schema: Record<string, unknown> = {};

    const collectKeys = (target: Record<any, any>, source: Record<any, any>) => {
      for (const key in source) {
        if (!target.hasOwnProperty(key) || target[key]) {
          if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            target[key] = target[key] || {};
            collectKeys(target[key], source[key]);
          } else if (source[key] === DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE) {
            target[key] = true;
          } else {
            target[key] = false;
          }
        }
      }
    };

    schema1 !== undefined && collectKeys(schema, schema1);
    schema2 !== undefined && collectKeys(schema, schema2);

    return schema;
  };

  const getChildren = (
    parsedRowWithoutHeadingCol: { [key: string]: Record<any, any> | undefined },
    schema: Record<any, any>,
  ): Record<string, any>[] => {
    return Object.keys(schema).map((key) => {
      if (typeof schema[key] === 'boolean') {
        let result = {
          key: key,
          [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: key,
        };
        Object.keys(parsedRowWithoutHeadingCol).forEach((runUuid) => {
          const value = parsedRowWithoutHeadingCol[runUuid]?.[key];
          result = {
            ...result,
            [runUuid]: value === undefined ? DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE : value,
          };
        });
        return result;
      }
      // Recurse
      const newParsedRow: { [key: string]: Record<any, any> | undefined } = {};
      Object.keys(parsedRowWithoutHeadingCol).forEach((runUuid) => {
        newParsedRow[runUuid] = parsedRowWithoutHeadingCol[runUuid]?.[key];
      });

      return {
        key: key,
        [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: key,
        children: getChildren(newParsedRow, schema[key]),
      };
    });
  };

  const isAllElementsJSON = (row: { [key: string]: string | number }) => {
    let jsonSchema: Record<any, any> | undefined = undefined;
    let isAllJson = true;
    const parsedRow: Record<string, any> = {};

    Object.keys(row).forEach((runUuid) => {
      if (runUuid !== DIFFERENCE_PLOT_HEADING_COLUMN_ID) {
        if (row[runUuid] !== DIFFERENCE_CHART_DEFAULT_EMPTY_VALUE) {
          const json = validateParseJSON(row[runUuid] as string);
          parsedRow[runUuid] = json;
          if (json === null) {
            isAllJson = false;
          } else {
            const commonSchema = extractMaximumCommonSchema(jsonSchema, json);
            if (commonSchema === null) {
              isAllJson = false;
            } else {
              jsonSchema = commonSchema;
            }
          }
        }
      }
    });
    if (isAllJson && jsonSchema !== undefined) {
      try {
        return {
          [DIFFERENCE_PLOT_HEADING_COLUMN_ID]: row[DIFFERENCE_PLOT_HEADING_COLUMN_ID],
          children: getChildren(parsedRow, jsonSchema),
          key: row[DIFFERENCE_PLOT_HEADING_COLUMN_ID],
        };
      } catch {
        return row;
      }
    } else {
      return row;
    }
  };
  return data.map(isAllElementsJSON);
};
```

--------------------------------------------------------------------------------

---[FILE: expressionCharts.utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/expressionCharts.utils.test.ts

```typescript
import { describe, it, jest, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { RunsChartsLineChartXAxisType } from '../components/RunsCharts.common';
import { useChartExpressionParser } from '../hooks/useChartExpressionParser';
import { getExpressionChartsSortedMetricHistory } from './expressionCharts.utils';

describe('getExpressionChartsSortedMetricHistory', () => {
  const { result } = renderHook(() => useChartExpressionParser());
  const { evaluateExpression } = result.current;

  it('should return an empty array if runEntry has no metrics history', () => {
    const expression = {
      expression: 'metric1 + metric2',
      rpn: ['metric1', 'metric2', '+'],
      variables: ['metric1', 'metric2'],
    };
    const runEntry = {
      // No metrics history
      uuid: 'run-uuid',
      displayName: 'run-name',
    };
    const evaluateExpression =
      jest.fn<Parameters<typeof getExpressionChartsSortedMetricHistory>[0]['evaluateExpression']>();
    const xAxisKey = RunsChartsLineChartXAxisType.STEP;

    const result = getExpressionChartsSortedMetricHistory({
      expression,
      runEntry,
      evaluateExpression,
      xAxisKey,
    });

    expect(result).toEqual([]);
  });

  it('should return an empty array if no common xDataPoints found', () => {
    const expression = {
      expression: 'metric1 + metric2',
      rpn: ['metric1', 'metric2', '+'],
      variables: ['metric1', 'metric2'],
    };
    const runEntry = {
      uuid: 'run-uuid',
      displayName: 'run-name',
      metricsHistory: {
        metric1: [
          { key: 'metric1', value: 1, step: 1, timestamp: 0 },
          { key: 'metric1', value: 2, step: 2, timestamp: 1 },
        ],
        metric2: [
          { key: 'metric2', value: 3, step: 3, timestamp: 0 },
          { key: 'metric2', value: 4, step: 4, timestamp: 1 },
        ],
      },
    };
    const evaluateExpression =
      jest.fn<Parameters<typeof getExpressionChartsSortedMetricHistory>[0]['evaluateExpression']>();
    const xAxisKey = RunsChartsLineChartXAxisType.STEP;

    const result = getExpressionChartsSortedMetricHistory({
      expression,
      runEntry,
      evaluateExpression,
      xAxisKey,
    });

    expect(result).toEqual([]);
  });

  it('should evaluate the expression for each xDataPoint and return the results', () => {
    const expression = {
      expression: 'metric1 + metric2',
      rpn: ['metric1', 'metric2', '+'],
      variables: ['metric1', 'metric2'],
    };
    const runEntry = {
      uuid: 'run-uuid',
      displayName: 'run-name',
      metricsHistory: {
        metric1: [
          { value: 1, step: 1, timestamp: 0, key: 'metric1' },
          { value: 2, step: 2, timestamp: 0, key: 'metric1' },
        ],
        metric2: [
          { value: 3, step: 1, timestamp: 0, key: 'metric2' },
          { value: 4, step: 2, timestamp: 0, key: 'metric2' },
        ],
      },
    };

    const xAxisKey = RunsChartsLineChartXAxisType.STEP;

    const result = getExpressionChartsSortedMetricHistory({
      expression,
      runEntry,
      evaluateExpression,
      xAxisKey,
    });

    expect(result).toEqual([
      { value: 4, key: 'metric1 + metric2', step: 1, timestamp: 0 },
      { value: 6, key: 'metric1 + metric2', step: 2, timestamp: 0 },
    ]);
  });

  it('should group by timestamp when xAxisKey is TIME', () => {
    const expression = {
      expression: 'metric1 + metric2',
      rpn: ['metric1', 'metric2', '+'],
      variables: ['metric1', 'metric2'],
    };
    const runEntry = {
      uuid: 'run-uuid',
      displayName: 'run-name',
      metricsHistory: {
        metric1: [
          { value: 1, step: 1, timestamp: 0, key: 'metric1' },
          { value: 2, step: 2, timestamp: 1, key: 'metric1' },
        ],
        metric2: [
          { value: 3, step: 1, timestamp: 1, key: 'metric2' },
          { value: 4, step: 2, timestamp: 0, key: 'metric2' },
        ],
      },
    };
    const xAxisKey = RunsChartsLineChartXAxisType.TIME;

    const result = getExpressionChartsSortedMetricHistory({
      expression,
      runEntry,
      evaluateExpression,
      xAxisKey,
    });

    expect(result).toEqual([
      { value: 5, key: 'metric1 + metric2', step: 0, timestamp: 0 },
      { value: 5, key: 'metric1 + metric2', step: 0, timestamp: 1 },
    ]);
  });

  it('should group by timestamp when xAxisKey is TIME_RELATIVE', () => {
    const expression = {
      expression: 'metric1 + metric2',
      rpn: ['metric1', 'metric2', '+'],
      variables: ['metric1', 'metric2'],
    };
    const runEntry = {
      uuid: 'run-uuid',
      displayName: 'run-name',
      metricsHistory: {
        metric1: [
          { value: 1, step: 1, timestamp: 0, key: 'metric1' },
          { value: 2, step: 2, timestamp: 1, key: 'metric1' },
        ],
        metric2: [
          { value: 3, step: 1, timestamp: 1, key: 'metric2' },
          { value: 4, step: 2, timestamp: 0, key: 'metric2' },
        ],
      },
    };
    const xAxisKey = RunsChartsLineChartXAxisType.TIME_RELATIVE;

    const result = getExpressionChartsSortedMetricHistory({
      expression,
      runEntry,
      evaluateExpression,
      xAxisKey,
    });

    expect(result).toEqual([
      { value: 5, key: 'metric1 + metric2', step: 0, timestamp: 0 },
      { value: 5, key: 'metric1 + metric2', step: 0, timestamp: 1 },
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: expressionCharts.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/expressionCharts.utils.ts

```typescript
import { intersection } from 'lodash';
import type { MetricEntity } from '../../../types';
import type { RunsChartsRunData } from '../components/RunsCharts.common';
import { RunsChartsLineChartXAxisType } from '../components/RunsCharts.common';
import type { RunsMetricsLinePlotProps } from '../components/RunsMetricsLinePlot';
import type { RunsChartsLineChartExpression } from '../runs-charts.types';

const getCompareValue = (element: MetricEntity, xAxisKey: RunsMetricsLinePlotProps['xAxisKey']) => {
  if (xAxisKey === RunsChartsLineChartXAxisType.STEP) {
    // If xAxisKey is steps, we match along step
    return element.step;
  } else if (
    xAxisKey === RunsChartsLineChartXAxisType.TIME ||
    xAxisKey === RunsChartsLineChartXAxisType.TIME_RELATIVE
  ) {
    // If xAxisKey is time, we match along timestamp
    return element.timestamp;
  }
  return null;
};

export const getExpressionChartsSortedMetricHistory = ({
  expression,
  runEntry,
  evaluateExpression,
  xAxisKey,
}: {
  expression: RunsChartsLineChartExpression;
  runEntry: Omit<RunsChartsRunData, 'metrics' | 'params' | 'tags' | 'images'>;
  evaluateExpression: (
    expression: RunsChartsLineChartExpression,
    variables: Record<string, number>,
  ) => number | undefined;
  xAxisKey: RunsMetricsLinePlotProps['xAxisKey'];
}) => {
  const xDataPointsPerVariable = expression.variables.map((variable) => {
    const elements = runEntry.metricsHistory?.[variable];
    if (elements !== undefined) {
      return elements.flatMap((element) => {
        const compareValue = getCompareValue(element, xAxisKey);
        if (compareValue !== null) {
          return [compareValue];
        }
        return [];
      });
    }
    return [];
  });
  const xDataPoints = intersection(...xDataPointsPerVariable);
  xDataPoints.sort((a, b) => a - b); // ascending

  // For each xDataPoint, extract variables and evaluate expression
  return xDataPoints.flatMap((xDataPoint) => {
    const variables = expression.variables.reduce((obj, variable) => {
      const elements = runEntry.metricsHistory?.[variable];
      const value = elements?.find((element) => getCompareValue(element, xAxisKey) === xDataPoint)?.value;
      if (value !== undefined) {
        obj[variable] = value;
      }
      return obj;
    }, {} as Record<string, number>);

    const expressionValue = evaluateExpression(expression, variables);
    if (expressionValue !== undefined) {
      return [
        {
          value: expressionValue,
          key: expression.expression,
          ...(xAxisKey === RunsChartsLineChartXAxisType.STEP || xAxisKey === RunsChartsLineChartXAxisType.METRIC
            ? { step: xDataPoint, timestamp: 0 }
            : { timestamp: xDataPoint, step: 0 }),
        },
      ];
    }
    return [];
  });
};
```

--------------------------------------------------------------------------------

---[FILE: findChartStepsByTimestamp.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/findChartStepsByTimestamp.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import {
  findAbsoluteTimestampRangeForRelativeRange,
  findChartStepsByTimestamp,
  findChartStepsByTimestampForRuns,
} from './findChartStepsByTimestamp';

const existingMetricsRangeA = [
  { key: '', step: 3, timestamp: new Date('2023-10-24 13:00:00').valueOf() },
  { key: '', step: 2, timestamp: new Date('2023-10-24 12:00:00').valueOf() },
  { key: '', step: -1, timestamp: new Date('2023-10-24 09:00:00').valueOf() },
  { key: '', step: 5, timestamp: new Date('2023-10-24 15:00:00').valueOf() },
];

const existingMetricsRangeB = [
  { key: '', step: 7, timestamp: new Date('2023-10-24 17:00:00').valueOf() },
  { key: '', step: 8, timestamp: new Date('2023-10-24 18:00:00').valueOf() },
  { key: '', step: 6, timestamp: new Date('2023-10-24 16:00:00').valueOf() },
  { key: '', step: 4, timestamp: new Date('2023-10-24 14:00:00').valueOf() },
];

const ranges = {
  '-1,5': {
    metricsHistory: existingMetricsRangeA as any,
  },
  '4,8': {
    metricsHistory: existingMetricsRangeB as any,
  },
};

describe('findChartStepsByTimestamp', () => {
  test('should find proper ranges for middle timestamps', () => {
    expect(findChartStepsByTimestamp(ranges, ['2023-10-24 13:30:00', '2023-10-24 13:45:00'])).toEqual([3, 4]);
  });

  test('should find proper ranges for lower boundary timestamp', () => {
    expect(findChartStepsByTimestamp(ranges, ['2023-10-24 09:01:00', '2023-10-24 13:45:00'])).toEqual([-1, 4]);
  });

  test('should find proper ranges for upper boundary timestamp', () => {
    expect(findChartStepsByTimestamp(ranges, ['2023-10-24 13:30:00', '2023-10-24 17:59:00'])).toEqual([3, 8]);
  });

  test('should find proper ranges when exceeding boundaries', () => {
    expect(findChartStepsByTimestamp(ranges, ['2022-10-23 10:00:00', '2024-12-25 18:00:00'])).toEqual([-1, 8]);
  });

  test('should return nothing when history is insufficient', () => {
    expect(
      findChartStepsByTimestamp({ DEFAULT: { metricsHistory: [] } }, ['2022-10-23 10:00:00', '2024-12-25 18:00:00']),
    ).toBeUndefined();
  });
});

describe('findChartStepsByTimestampForRuns', () => {
  const sampledMetrics = {
    runUuid1: {
      metricKey1: {
        DEFAULT: {
          metricsHistory: [
            { key: 'metricKey1', step: 3, timestamp: new Date('2023-10-24 13:00:00').valueOf() },
            { key: 'metricKey1', step: 2, timestamp: new Date('2023-10-24 12:00:00').valueOf() },
            { key: 'metricKey1', step: 1, timestamp: new Date('2023-10-24 11:00:00').valueOf() },
            { key: 'metricKey1', step: 5, timestamp: new Date('2023-10-24 15:00:00').valueOf() },
          ],
        },
      },
    },
    runUuid2: {
      metricKey1: {
        DEFAULT: {
          metricsHistory: [
            { key: 'metricKey1', step: 2, timestamp: new Date('2023-10-24 12:00:00').valueOf() },
            { key: 'metricKey1', step: 4, timestamp: new Date('2023-10-24 14:00:00').valueOf() },
            { key: 'metricKey1', step: 6, timestamp: new Date('2023-10-24 16:00:00').valueOf() },
            { key: 'metricKey1', step: 8, timestamp: new Date('2023-10-24 18:00:00').valueOf() },
          ],
        },
      },
    },
    runUuid3: {
      metricKey1: {
        DEFAULT: {
          metricsHistory: [
            { key: 'metricKey1', step: 1, timestamp: new Date('2023-10-26 12:00:00').valueOf() },
            { key: 'metricKey1', step: 33, timestamp: new Date('2023-10-26 14:00:00').valueOf() },
            { key: 'metricKey1', step: 66, timestamp: new Date('2023-10-26 16:00:00').valueOf() },
            { key: 'metricKey1', step: 99, timestamp: new Date('2023-10-26 18:00:00').valueOf() },
          ],
        },
      },
    },
  } as any;

  test('should find proper step ranges for two runs', () => {
    const runUuids = ['runUuid1', 'runUuid2'];
    const metricKey = 'metricKey1';
    const range: [string, string] = ['2023-10-24 12:00:00', '2023-10-24 15:00:00'];
    const result = findChartStepsByTimestampForRuns(sampledMetrics, runUuids, metricKey, range);
    expect(result).toEqual([2, 6]);
  });

  test('should find proper step ranges for a single run', () => {
    const runUuids = ['runUuid1'];
    const metricKey = 'metricKey1';
    const range: [string, string] = ['2023-10-24 12:00:00', '2023-10-24 15:00:00'];
    const result = findChartStepsByTimestampForRuns(sampledMetrics, runUuids, metricKey, range);
    expect(result).toEqual([2, 5]);
  });

  test('should skip range of run that is not included in the timestamp range', () => {
    const runUuids = ['runUuid1', 'runUuid2', 'runUuid3'];
    const metricKey = 'metricKey1';
    const range: [string, string] = ['2023-10-24 12:00:00', '2023-10-24 15:00:00'];
    const result = findChartStepsByTimestampForRuns(sampledMetrics, runUuids, metricKey, range);
    expect(result).toEqual([2, 6]);
  });

  test('should skip all ranges of run that is not included in the timestamp range', () => {
    const runUuids = ['runUuid1', 'runUuid2', 'runUuid3'];
    const metricKey = 'metricKey1';
    const range: [string, string] = ['2023-10-28 12:00:00', '2023-10-29 15:00:00'];
    const result = findChartStepsByTimestampForRuns(sampledMetrics, runUuids, metricKey, range);
    expect(result).toEqual(undefined);
  });
});

describe('findAbsoluteTimestampRangeForRelativeRange', () => {
  const currentlyVisibleMetrics = {
    runUuid1: {
      runUuid: 'runUuid1',
      metric1: {
        metricsHistory: [
          { key: '', step: 3, timestamp: new Date('2023-10-24 13:00:00').valueOf() },
          { key: '', step: 2, timestamp: new Date('2023-10-24 12:00:00').valueOf() },
        ],
      },
      metric2: {
        metricsHistory: [
          { key: '', step: 1, timestamp: new Date('2023-10-24 11:00:00').valueOf() },
          { key: '', step: 5, timestamp: new Date('2023-10-24 15:00:00').valueOf() },
        ],
      },
    },
    runUuid2: {
      runUuid: 'runUuid2',
      metric1: {
        metricsHistory: [
          { key: '', step: 2, timestamp: new Date('2023-10-26 13:00:00').valueOf() },
          { key: '', step: 4, timestamp: new Date('2023-10-26 12:00:00').valueOf() },
        ],
      },
      metric2: {
        metricsHistory: [
          { key: '', step: 6, timestamp: new Date('2023-10-26 11:00:00').valueOf() },
          { key: '', step: 8, timestamp: new Date('2023-10-26 15:00:00').valueOf() },
        ],
      },
    },
  } as any;

  test('should return the correct timestamp range for relative range', () => {
    const runUuids = ['runUuid1', 'runUuid2'];
    const relativeRange: [number, number] = [3600, 7200];
    const result = findAbsoluteTimestampRangeForRelativeRange(currentlyVisibleMetrics, runUuids, relativeRange);
    expect(result).toEqual([new Date('2023-10-24 12:00:00').valueOf(), new Date('2023-10-26 13:00:00').valueOf()]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: findChartStepsByTimestamp.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/findChartStepsByTimestamp.ts

```typescript
import { type Dictionary, compact, first, isUndefined, last, max, min, minBy, orderBy, values } from 'lodash';
import type { MetricEntity, SampledMetricsByRunUuidState } from '../../../types';
import type { SampledMetricsByRun } from '../hooks/useSampledMetricHistory';

/**
 * This function consumes chart timestamp range and returns
 * corresponding step range for a given metric basing on a history.
 */
export const findChartStepsByTimestamp = (
  // Currently fetched metric history
  currentMetricHistory: {
    [rangeKey: string]: {
      loading?: boolean | undefined;
      metricsHistory?: MetricEntity[] | undefined;
    };
  },
  // Timestamp range - either textual ("2022-10-23 10:00:00") or numeric (milliseconds)
  range: [string | number, string | number],
  // If set to true, will return entire boundaries from history if timestamps are not found.
  // Otherwise, will return undefined.
  useDefaultIfNotFound = true,
): [number, number] | undefined => {
  // First, let's compile a history of all metric values from all ranges,
  // then sort it by timestamp
  const flatHistory = orderBy(
    compact(
      values(currentMetricHistory)
        .map(({ metricsHistory }) => metricsHistory)
        .flat(),
    ),
    'timestamp',
  );

  // If there's no sufficient entries, return nothing
  if (flatHistory.length < 2) {
    return undefined;
  }

  // We consume textual ranges produced by charts so we have
  // to convert them to timestamps
  const lowerBound = new Date(range[0]).valueOf();
  const upperBound = new Date(range[1]).valueOf();

  // First, try to find the lower entry using loop
  let lowerEntry = useDefaultIfNotFound ? first(flatHistory) : undefined;

  for (let index = 0; index < flatHistory.length; index++) {
    const entry = flatHistory[index];
    if (entry.timestamp > lowerBound) {
      lowerEntry = flatHistory[index - 1] || entry;
      break;
    }
  }

  // Repeat for the upper entry
  let upperEntry = useDefaultIfNotFound ? last(flatHistory) : undefined;

  for (let index = flatHistory.length - 1; index >= 0; index--) {
    const entry = flatHistory[index];
    if (entry.timestamp < upperBound) {
      upperEntry = flatHistory[index + 1] || entry;
      break;
    }
  }

  // If boundaries are not found, return nothing
  if (isUndefined(lowerEntry) || isUndefined(upperEntry)) {
    return undefined;
  }

  // Return found boundary entries
  return [lowerEntry.step, upperEntry.step];
};

/**
 * Finds the chart steps by absolute timestamp for multiple runs.
 *
 * @param sampledMetrics - The sampled metrics by run UUID state.
 * @param runUuids - The array of run UUIDs.
 * @param metricKey - The metric key.
 * @param range - The range of timestamps.
 * @returns The lower and upper bounds of the chart steps, or undefined if not found.
 */
export const findChartStepsByTimestampForRuns = (
  sampledMetrics: SampledMetricsByRunUuidState,
  runUuids: string[],
  metricKey: string,
  range: [string | number, string | number],
): [number, number] | undefined => {
  const stepRangesPerRun = compact(
    runUuids.map((runUuid) => {
      const metricHistoryForRun = sampledMetrics[runUuid]?.[metricKey];
      return metricHistoryForRun ? findChartStepsByTimestamp(metricHistoryForRun, range, false) : undefined;
    }),
  );
  const lowerBound = min(stepRangesPerRun.map(([bound]) => bound));
  const upperBound = max(stepRangesPerRun.map(([, bound]) => bound));

  if (!isUndefined(lowerBound) && !isUndefined(upperBound)) {
    return [lowerBound, upperBound];
  }

  return undefined;
};

/**
 * This function consumes chart relative time range and returns
 * corresponding step range for a given metric basing on a history.
 *
 * @param currentlyVisibleMetrics currentlyVisibleMetrics is a dictionary of currently rendered metric traces for run
 * @param runUuids a list of run UUIDs to process
 * @param relativeRange a relative time range in seconds
 * @returns a range of steps or undefined if no relevant are found
 */
export const findAbsoluteTimestampRangeForRelativeRange = (
  currentlyVisibleMetrics: Dictionary<SampledMetricsByRun>,
  runUuids: string[],
  relativeRange: [number, number],
  multiplier = 1000,
): [number, number] | undefined => {
  const stepRangesPerRun = compact(
    runUuids.map((runUuid) => {
      const runData = currentlyVisibleMetrics[runUuid];

      if (!runData) {
        return null;
      }

      // omit the "runUuid" key so we can conveniently access the metrics data
      const { runUuid: _, ...runMetrics } = runData;

      // concat all the metrics history for the run
      const visibleMetricHistoryForRun = values(runMetrics).flatMap((metric) => metric.metricsHistory ?? []);

      // Find the timestamp offset for the run. Should be equal to lowest timestamp value for each run.
      const timestampOffset = minBy(visibleMetricHistoryForRun, 'timestamp')?.timestamp || 0;

      // Convert relative time range to timestamp range. Relative range comes
      // in seconds so we have to multiply it by 1000 to get milliseconds.
      return [relativeRange[0] * multiplier + timestampOffset, relativeRange[1] * multiplier + timestampOffset] as [
        number,
        number,
      ];
    }),
  );
  const lowerBound = min(stepRangesPerRun.map(([bound]) => bound));
  const upperBound = max(stepRangesPerRun.map(([, bound]) => bound));
  if (!isUndefined(lowerBound) && !isUndefined(upperBound)) {
    return [lowerBound, upperBound];
  }

  return undefined;
};
```

--------------------------------------------------------------------------------

---[FILE: parallelCoordinatesPlot.utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/utils/parallelCoordinatesPlot.utils.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import type { RunsChartsRunData } from '../components/RunsCharts.common';
import type { ParallelCoordinateDataEntry } from './parallelCoordinatesPlot.utils';
import { PARALLEL_CHART_MAX_NUMBER_STRINGS } from './parallelCoordinatesPlot.utils';
import { filterParallelCoordinateData } from './parallelCoordinatesPlot.utils';
import { processParallelCoordinateData } from './parallelCoordinatesPlot.utils';

describe('ParallelCoordinatesPlot utilities', () => {
  describe('filterParallelCoordinateData', () => {
    test('filters out NaNs and nulls', () => {
      const data: ParallelCoordinateDataEntry[] = [];

      for (let i = 0; i < 100; i++) {
        data.push({
          uuid: i,
          left: Math.random(),
          right: Math.random(),
        });
      }
      data.push({
        uuid: 100,
        left: NaN,
        right: Math.random(),
      });
      data.push({
        uuid: 101,
        left: null,
        right: Math.random(),
      });

      expect(data.length).toBe(102);
      const filteredData = filterParallelCoordinateData(data, ['left', 'right']);
      expect(filteredData.length).toBe(100);
    });

    test('keep a max of 30 unique string values', () => {
      const data = [];
      const divisor = 2;
      for (let i = 0; i < 100; i++) {
        data.push({
          uuid: i,
          left: `${Math.floor(i / divisor)}a`,
          right: Math.random(),
        });
      }
      expect(data.length).toBe(100);
      const filteredData = filterParallelCoordinateData(data, ['left', 'right']);
      expect(filteredData.length).toBe(PARALLEL_CHART_MAX_NUMBER_STRINGS * divisor);
    });

    test('displays 100 nums over 50 strings', () => {
      const data = [];

      for (let i = 0; i < 100; i++) {
        data.push({
          uuid: i,
          left: Math.random(),
          right: Math.random(),
        });
      }

      // "left" is populated with strings 50 times
      for (let i = 100; i < 150; i++) {
        data.push({
          uuid: i,
          left: `${Math.floor(i / 2)}a`,
          right: Math.random(),
        });
      }

      expect(data.length).toBe(150);
      const filteredData = filterParallelCoordinateData(data, ['left', 'right']);
      expect(filteredData.length).toBe(100);
    });

    test('displays 99 (effectively 90) strings over 51 numbers', () => {
      const data = [];
      const divisor = 3;
      // "left" is populated with numbers 50 times
      for (let i = 0; i < 51; i++) {
        data.push({
          uuid: i,
          left: Math.random(),
          right: Math.random(),
        });
      }

      // "left" is populated with strings 99 times
      for (let i = 51; i < 150; i++) {
        data.push({
          uuid: i,
          left: `${Math.floor(i / divisor)}a`,
          right: Math.random(),
        });
      }
      expect(data.length).toBe(150);
      const filteredData = filterParallelCoordinateData(data, ['left', 'right']);
      expect(filteredData.length).toBe(divisor * PARALLEL_CHART_MAX_NUMBER_STRINGS);
    });

    test('prepares data for 3 columns', () => {
      const data = [];
      const divisor = 4;
      for (let i = 0; i < 200; i++) {
        if (i % 4 === 0) {
          data.push({
            uuid: i,
            left: Math.random(),
            middle: 'a',
            right: Math.random(),
          });
        } else {
          data.push({
            uuid: i,
            left: `${Math.floor(i / divisor)}a`,
            middle: 'b',
            right: Math.random(),
          });
        }
      }

      expect(data.length).toBe(200);
      const filteredData = filterParallelCoordinateData(data, ['left', 'right', 'middle']);
      expect(filteredData.length).toBe((divisor - 1) * PARALLEL_CHART_MAX_NUMBER_STRINGS);
    });
  });

  describe('processParallelCoordinateData', () => {
    test('prepares parallel coordinates data entries and keeps all runs when metrics and params are matching', () => {
      const data: RunsChartsRunData[] = [];

      for (let i = 0; i < 20; i++) {
        data.push({
          uuid: i.toString(),
          params: {
            param_1: { key: 'param_1', value: 'abc' },
          },
          metrics: {
            metric_1: { key: 'metric_1', value: Math.random(), timestamp: 0, step: 0 },
            // Some extraneous metric
            metric_2: { key: 'metric_2', value: Math.random(), timestamp: 0, step: 0 },
          },
        } as any);
      }

      const filteredData = processParallelCoordinateData(data, ['param_1'], ['metric_1']);
      expect(filteredData.length).toBe(data.length);
    });

    test('prepares parallel coordinates data entries and discards runs with incomplete data', () => {
      const data: RunsChartsRunData[] = [];

      for (let i = 0; i < 20; i++) {
        data.push({
          uuid: i.toString(),
          params: {
            param_1: { key: 'param_1', value: 'abc' },
          },
          metrics: {
            metric_2: { key: 'metric_2', value: Math.random(), timestamp: 0, step: 0 },
          },
        } as any);
      }
      for (let i = 20; i < 40; i++) {
        data.push({
          uuid: i.toString(),
          params: {
            param_1: { key: 'param_1', value: 'abc' },
          },
          metrics: {
            metric_1: { key: 'metric_1', value: Math.random(), timestamp: 0, step: 0 },
            metric_2: { key: 'metric_2', value: Math.random(), timestamp: 0, step: 0 },
          },
        } as any);
      }
      for (let i = 40; i < 60; i++) {
        data.push({
          uuid: i.toString(),
          params: {},
          metrics: {
            metric_1: { key: 'metric_1', value: Math.random(), timestamp: 0, step: 0 },
          },
        } as any);
      }

      expect(data.length).toBe(60);
      const filteredData = processParallelCoordinateData(data, ['param_1'], ['metric_1', 'metric_2']);
      expect(filteredData.length).toBe(20);
    });
  });
});
```

--------------------------------------------------------------------------------

````

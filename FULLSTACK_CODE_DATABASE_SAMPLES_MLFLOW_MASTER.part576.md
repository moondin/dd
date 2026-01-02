---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 576
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 576 of 991)

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

---[FILE: MetricsUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/MetricsUtils.test.ts

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import {
  clampIndex,
  findNumberChunks,
  generateInfinityAnnotations,
  getAveragedPositionOnXAxis,
  normalizeInfinity,
  normalizeMetricsHistoryEntry,
} from './MetricsUtils';
import Utils from '../../common/utils/Utils';

jest.mock('../../common/utils/Utils');

describe('MetricsUtils', () => {
  test('isExtremeFloat', () => {
    expect(normalizeInfinity(0)).toBe(0);
    expect(normalizeInfinity(123)).toBe(123);
    expect(normalizeInfinity(1230000e10)).toBe(1230000e10);
    expect(normalizeInfinity(NaN)).toBe(NaN);
    expect(normalizeInfinity(Number.MAX_VALUE)).toBe(Number.POSITIVE_INFINITY);
    expect(normalizeInfinity(-Number.MAX_VALUE)).toBe(Number.NEGATIVE_INFINITY);
    expect(normalizeInfinity(Number.MAX_VALUE.toString())).toBe(Number.POSITIVE_INFINITY);
    expect(normalizeInfinity((-Number.MAX_VALUE).toString())).toBe(Number.NEGATIVE_INFINITY);
  });
  test('normalizeMetricsHistoryEntry', () => {
    expect(normalizeMetricsHistoryEntry({ key: 'foobar', value: '123', timestamp: 123, step: 5 })).toEqual({
      key: 'foobar',
      value: 123,
      timestamp: 123,
      step: 5,
    });

    expect(normalizeMetricsHistoryEntry({ key: 'foobar', value: Number.MAX_VALUE, timestamp: 123 })).toEqual({
      key: 'foobar',
      value: Number.POSITIVE_INFINITY,
      timestamp: 123,
      step: 0,
    });
  });
  test('findNumberChunks', () => {
    expect(findNumberChunks([1, 2, 4, 4, 5, 6], 4)).toEqual([{ startIndex: 2, endIndex: 3 }]);
    expect(findNumberChunks([1, 2, 2, 9, 2, 2, 8], 2)).toEqual([
      { startIndex: 1, endIndex: 2 },
      { startIndex: 4, endIndex: 5 },
    ]);

    expect(findNumberChunks([NaN, NaN, NaN, 9, NaN, NaN, NaN], NaN)).toEqual([
      { startIndex: 0, endIndex: 2 },
      { startIndex: 4, endIndex: 6 },
    ]);

    expect(findNumberChunks([NaN, NaN, NaN], NaN)).toEqual([{ startIndex: 0, endIndex: 2 }]);
    expect(
      findNumberChunks([Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, 1, 2, 3], Number.POSITIVE_INFINITY),
    ).toEqual([{ startIndex: 0, endIndex: 1 }]);

    expect(
      findNumberChunks(
        [
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ],
        Number.POSITIVE_INFINITY,
      ),
    ).toEqual([
      { startIndex: 0, endIndex: 0 },
      { startIndex: 2, endIndex: 2 },
      { startIndex: 4, endIndex: 4 },
    ]);

    expect(
      findNumberChunks(
        [
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ],
        Number.NEGATIVE_INFINITY,
      ),
    ).toEqual([
      { startIndex: 1, endIndex: 1 },
      { startIndex: 3, endIndex: 3 },
    ]);
  });

  test('clampIndex', () => {
    expect(clampIndex([1, 1, 1, 1, 1], 0)).toEqual(0);
    expect(clampIndex([1, 1, 1, 1, 1], -1)).toEqual(0);
    expect(clampIndex([1, 1, 1, 1, 1], 3)).toEqual(3);
    expect(clampIndex([1, 1, 1, 1, 1], 4)).toEqual(4);
    expect(clampIndex([1, 1, 1, 1, 1], 5)).toEqual(4);
  });

  test('getAveragedPositionOnXAxis', () => {
    expect(getAveragedPositionOnXAxis({ startIndex: 1, endIndex: 1 }, [1, 2, 3, 4, 5])).toEqual(2);
    expect(getAveragedPositionOnXAxis({ startIndex: 1, endIndex: 2 }, [1, 2, 3, 4, 5])).toEqual((2 + 3) / 2);
    expect(getAveragedPositionOnXAxis({ startIndex: 0, endIndex: 2 }, [1, 2, 3, 4, 5])).toEqual((2 + 3) / 2);
    expect(getAveragedPositionOnXAxis({ startIndex: 1, endIndex: 3 }, [1, 2, 3, 4, 5])).toEqual(3);
    expect(getAveragedPositionOnXAxis({ startIndex: 0, endIndex: 4 }, [1, 2, 3, 4, 5])).toEqual(3);

    getAveragedPositionOnXAxis({ startIndex: 1, endIndex: 2 }, [
      '2020-01-01 02:00:00',
      '2020-01-02 02:00:00',
      '2020-01-03 02:00:00',
      '2020-01-04 02:00:00',
      '2020-01-05 02:00:00',
    ]);
  });

  describe('generateInfinityAnnotations', () => {
    const xValuesNumber = [0, 1, 2, 3, 4, 5, 6, 7];
    test('positive and negative infinity annotations', () => {
      const yValues = [
        1,
        2,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        8,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        9,
      ];
      const result = generateInfinityAnnotations({ xValues: xValuesNumber, yValues });

      expect(result.annotations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            x: (2 + 3) / 2,
            y: 1,
            yanchor: 'top',
            yref: 'paper',
          }),
          expect.objectContaining({
            x: (5 + 6) / 2,
            y: 0,
            yanchor: 'bottom',
            yref: 'paper',
          }),
        ]),
      );

      expect(result.shapes).toEqual(
        expect.arrayContaining([
          // positive infinity shapes:
          expect.objectContaining({ y0: 0, y1: 1000, yanchor: 2, x0: 1, x1: 1 }),
          expect.objectContaining({ y0: 0, y1: 1000, yanchor: 8, x0: 4, x1: 4 }),
          // negative infinity shapes:
          expect.objectContaining({ y0: 0, y1: -1000, yanchor: 8, x0: 4, x1: 4 }),
          expect.objectContaining({ y0: 0, y1: -1000, yanchor: 9, x0: 7, x1: 7 }),
        ]),
      );
    });

    test('infinity annotations on edges', () => {
      const yValues = [
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        8,
        7,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ];
      const result = generateInfinityAnnotations({ xValues: xValuesNumber, yValues });

      expect(result.annotations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            x: 2,
            y: 1,
            yanchor: 'top',
            yref: 'paper',
          }),
        ]),
      );

      expect(result.shapes).toEqual(
        expect.arrayContaining([
          // positive infinity shapes:
          expect.objectContaining({
            y0: 0,
            y1: 1000,
            yanchor: Number.POSITIVE_INFINITY,
            x0: 0,
            x1: 0,
          }),
          expect.objectContaining({ y0: 0, y1: 1000, yanchor: 8, x0: 4, x1: 4 }),
          // negative infinity shapes:
          expect.objectContaining({ y0: 0, y1: -1000, yanchor: 7, x0: 5, x1: 5 }),
          expect.objectContaining({
            y0: 0,
            y1: -1000,
            yanchor: Number.NEGATIVE_INFINITY,
            x0: 7,
            x1: 7,
          }),
        ]),
      );
    });

    test('infinity annotations on log scale', () => {
      const yValues = [
        1,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        4,
        8,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        4,
      ];
      const result = generateInfinityAnnotations({
        xValues: xValuesNumber,
        yValues,
        isLogScale: true,
      });

      expect(result.annotations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            x: 1.5,
            y: 1,
            yanchor: 'top',
            yref: 'paper',
          }),
        ]),
      );

      expect(result.shapes).toEqual(
        expect.arrayContaining([
          // positive infinity shapes:
          expect.objectContaining({
            y0: 0,
            y1: 1000,
            yanchor: 1,
            x0: 0,
            x1: 0,
          }),
          expect.objectContaining({
            y0: 0,
            y1: 1000,
            yanchor: 4,
            x0: 3,
            x1: 3,
          }),

          // negative infinity shapes:
          expect.objectContaining({
            y0: 0,
            y1: 8,
            yanchor: 8,
            x0: 4,
            x1: 4,
          }),
          expect.objectContaining({
            y0: 0,
            y1: 4,
            yanchor: 4,
            x0: 7,
            x1: 7,
          }),
        ]),
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: MetricsUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/MetricsUtils.ts

```typescript
import type { MessageDescriptor } from 'react-intl';
import { defineMessages } from 'react-intl';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'date... Remove this comment to see the full error message
import dateFormat from 'dateformat';
import { MLFLOW_SYSTEM_METRIC_PREFIX } from '../constants';

interface MetricHistoryEntry {
  key: string;
  value: string | number;
  step?: number;
  timestamp: number;
}

const nonNumericLabels = defineMessages({
  positiveInfinity: {
    defaultMessage: 'Positive infinity ({metricKey})',
    description: 'Label indicating positive infinity used as a hover text in a plot UI element',
  },

  positiveInfinitySymbol: {
    defaultMessage: '+∞',
    description: 'Label displaying positive infinity symbol displayed on a plot UI element',
  },

  negativeInfinity: {
    defaultMessage: 'Negative infinity ({metricKey})',
    description: 'Label indicating negative infinity used as a hover text in a plot UI element',
  },

  negativeInfinitySymbol: {
    defaultMessage: '-∞',
    description: 'Label displaying negative infinity symbol displayed on a plot UI element',
  },

  nan: {
    defaultMessage: 'Not a number ({metricKey})',
    description: 'Label indicating "not-a-number" used as a hover text in a plot UI element',
  },

  nanSymbol: {
    defaultMessage: 'NaN',
    description: 'Label displaying "not-a-number" symbol displayed on a plot UI element',
  },
});

/**
 * Function checks if a given value is maximum/minimum possible
 * 64-bit IEEE 754 number representation. If true, converts it to a JS-recognized
 * infinity value.
 */
export const normalizeInfinity = (value: number | string) => {
  const normalizedValue = typeof value === 'string' ? parseFloat(value) : value;
  if (normalizedValue === Number.MAX_VALUE) return Number.POSITIVE_INFINITY;
  if (normalizedValue === -Number.MAX_VALUE) return Number.NEGATIVE_INFINITY;
  return normalizedValue;
};

/**
 * We consider maximum IEEE 754 values (1.79...e+308) as "infinity-like" values
 * due to the backend's behavior and existing API contract. This function maps all
 * extermal ("infinity-like") metric values to NaN values so they will be
 * displayed correctly on plot.
 */
export const normalizeMetricsHistoryEntry = ({ key, timestamp, value, step }: MetricHistoryEntry) => ({
  key: key,
  value: normalizeInfinity(value),
  step: step || 0,
  timestamp: timestamp,
});

/**
 * Compares two numbers, being able to return "true" if
 * two NaN values are given.
 */
const numberEqual = (n1: number, n2: number) => {
  if (isNaN(n1)) {
    return isNaN(n2);
  }
  return n1 === n2;
};

/**
 * Finds multiple continuous sequences of a given number in the array.
 *
 * @example
 * findNumberChunks([1, 2, 4, 4, 5, 6], 4);
 * -> [ {startIndex: 2, endIndex: 3} ]
 * findNumberChunks([1, 2, 2, 9, 2, 2, 8], 2)
 * -> [ {startIndex: 1, endIndex: 2}, {startIndex: 4, endIndex: 5} ]
 */
export const findNumberChunks = <T extends number = number>(
  arr: T[],
  needle: T,
  indexDelta = 0,
): {
  startIndex: number;
  endIndex: number;
}[] => {
  if (arr.length < 1) {
    return [];
  }

  const startIndex = arr.findIndex((value) => numberEqual(needle, value));
  if (startIndex === -1) {
    return [];
  }
  let endIndex = startIndex;
  let i = startIndex + 1;
  while (i < arr.length) {
    if (numberEqual(needle, arr[i])) {
      endIndex = i;
    } else {
      break;
    }
    i++;
  }

  return [
    {
      startIndex: startIndex + indexDelta,
      endIndex: endIndex + indexDelta,
    },
    ...findNumberChunks(arr.slice(endIndex + 1), needle, endIndex + 1 + indexDelta),
  ];
};

/**
 * Clamps the index to the given array
 */
export const clampIndex = <T>(arr: T[], index: number) => {
  return index < 0 ? 0 : index > arr.length - 1 ? arr.length - 1 : index;
};

const INFINITY_LINE_TEMPLATE = {
  type: 'line',
  ysizemode: 'pixel',
  y0: 0,
  line: {
    width: 1,
    color: 'red',
  },
};

/**
 * Given starting/ending indices of a chunk and an array, it calculates
 * averaged "x" position. Used for placing annotations in the middle of their
 * ranges.
 */
export const getAveragedPositionOnXAxis = (
  chunk: {
    startIndex: number;
    endIndex: number;
  },
  xValues: (number | string)[],
) => {
  const startIndex = clampIndex(xValues, chunk.startIndex - 1);
  const endIndex = clampIndex(xValues, chunk.endIndex + 1);

  // If it's not a number, then it's a date!
  if (typeof xValues[0] === 'string') {
    const date1 = xValues[startIndex];
    const date2 = xValues[endIndex];

    const d1msecs = new Date(date1).getTime(); // get milliseconds
    const d2msecs = new Date(date2).getTime(); // get milliseconds

    const avgTime = (d1msecs + d2msecs) / 2;

    return dateFormat(new Date(avgTime), 'yyyy-mm-dd HH:MM:ss.l');
  }

  return ((xValues[startIndex] as number) + (xValues[endIndex] as number)) / 2;
};

/**
 * Internal helper method - creates plotly annotation for an infinity
 */
const createInfinityAnnotation = (label: string, text: string, x: number, y: number) => ({
  hoverlabel: { bgcolor: 'red' },
  align: 'center',
  yref: 'paper',
  yanchor: y === 0 ? 'bottom' : 'top',
  showarrow: false,
  font: {
    size: 15,
    color: 'red',
  },
  y,
  text,
  x,
  hovertext: label,
});

export interface GenerateInfinityAnnotationsProps {
  /**
   * Array containing x coordinates of the plot data
   */
  xValues: number[];
  /**
   * Array containing y coordinates of the plot data
   */
  yValues: number[];
  /**
   * `true` if data should be prepared for logarithmic scale
   */
  isLogScale?: boolean;
  /**
   * Function used for label translation
   */
  stringFormatter?: (value: MessageDescriptor | string) => string;
}

/**
 *
 * Ingests plot's x and y values and earches for infinity and NaN values, then
 * generates plotly.js-compatible shapes and annotations for  * a given metric.
 *
 * @param configuration see `GenerateInfinityAnnotationsProps` for configuration reference
 * @returns an object containing arrays of plotly.js annotations and shapes
 */
export const generateInfinityAnnotations = ({
  xValues,
  yValues,
  isLogScale = false,
  stringFormatter = (str) => str.toString(),
}: GenerateInfinityAnnotationsProps) => {
  const nanChunks = findNumberChunks(yValues, NaN);
  const posInfChunks = findNumberChunks(yValues, Number.POSITIVE_INFINITY);
  const negInfChunks = findNumberChunks(yValues, Number.NEGATIVE_INFINITY);

  const nanAnnotations = nanChunks.map((chunk) => ({
    hovertext: stringFormatter(nonNumericLabels.nan),
    text: stringFormatter(nonNumericLabels.nanSymbol),
    align: 'center',
    yanchor: 'bottom',
    showarrow: false,
    font: {
      size: 12,
      color: 'blue',
    },
    x: getAveragedPositionOnXAxis(chunk, xValues),
    y: 0,
  }));
  const posInfAnnotations = posInfChunks.map((chunk) =>
    createInfinityAnnotation(
      stringFormatter(nonNumericLabels.positiveInfinity),
      stringFormatter(nonNumericLabels.positiveInfinitySymbol),
      getAveragedPositionOnXAxis(chunk, xValues),
      1,
    ),
  );

  const negInfAnnotations = negInfChunks.map((chunk) =>
    createInfinityAnnotation(
      stringFormatter(nonNumericLabels.negativeInfinity),
      stringFormatter(nonNumericLabels.negativeInfinitySymbol),
      getAveragedPositionOnXAxis(chunk, xValues),
      0,
    ),
  );

  const nanShapes = nanChunks.map((chunk) => {
    return {
      fillcolor: 'blue',
      opacity: 0.1,
      yref: 'paper',
      y0: 0,
      y1: 1,
      line: {
        width: 0,
      },
      x0: xValues[clampIndex(xValues, chunk.startIndex - 1)],
      x1: xValues[clampIndex(xValues, chunk.endIndex + 1)],
    };
  });

  const posInfinityShapes = posInfChunks.reduce<any>((shapes, chunk) => {
    shapes.push({
      ...INFINITY_LINE_TEMPLATE,
      y1: 1000,
      x0: xValues[clampIndex(xValues, chunk.startIndex - 1)],
      x1: xValues[clampIndex(xValues, chunk.startIndex - 1)],
      yanchor: yValues[clampIndex(yValues, chunk.startIndex - 1)],
    });
    if (chunk.endIndex + 1 < xValues.length) {
      shapes.push({
        ...INFINITY_LINE_TEMPLATE,
        y1: 1000,
        x0: xValues[clampIndex(xValues, chunk.endIndex + 1)],
        x1: xValues[clampIndex(xValues, chunk.endIndex + 1)],
        yanchor: yValues[clampIndex(yValues, chunk.endIndex + 1)],
      });
    }
    return shapes;
  }, []);
  const negInfinityShapes = negInfChunks.reduce<any>((shapes, chunk) => {
    if (isLogScale) {
      shapes.push({
        ...INFINITY_LINE_TEMPLATE,
        ysizemode: 'scaled',
        y0: 0,
        y1: yValues[clampIndex(yValues, chunk.startIndex - 1)],
        yanchor: yValues[clampIndex(yValues, chunk.startIndex - 1)],

        x0: xValues[clampIndex(xValues, chunk.startIndex - 1)],
        x1: xValues[clampIndex(xValues, chunk.startIndex - 1)],
      });
      shapes.push({
        ...INFINITY_LINE_TEMPLATE,
        ysizemode: 'scaled',
        y0: 0,
        y1: yValues[clampIndex(yValues, chunk.endIndex + 1)],
        yanchor: yValues[clampIndex(yValues, chunk.endIndex + 1)],

        x0: xValues[clampIndex(xValues, chunk.endIndex + 1)],
        x1: xValues[clampIndex(xValues, chunk.endIndex + 1)],
      });
    } else {
      shapes.push({
        ...INFINITY_LINE_TEMPLATE,
        y1: -1000,
        x0: xValues[clampIndex(xValues, chunk.startIndex - 1)],
        x1: xValues[clampIndex(xValues, chunk.startIndex - 1)],
        yanchor: yValues[clampIndex(yValues, chunk.startIndex - 1)],
      });
      shapes.push({
        ...INFINITY_LINE_TEMPLATE,
        y1: -1000,
        x0: xValues[clampIndex(xValues, chunk.endIndex + 1)],
        x1: xValues[clampIndex(xValues, chunk.endIndex + 1)],
        yanchor: yValues[clampIndex(yValues, chunk.endIndex + 1)],
      });
    }
    return shapes;
  }, []);
  return {
    shapes: [...nanShapes, ...negInfinityShapes, ...posInfinityShapes],
    annotations: [...nanAnnotations, ...posInfAnnotations, ...negInfAnnotations],
  };
};

export const truncateChartMetricString = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = '...';

  const sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

const systemMetricPrefix = new RegExp(`^${MLFLOW_SYSTEM_METRIC_PREFIX}`);

export const isSystemMetricKey = (metricKey: string) => metricKey.match(systemMetricPrefix);

export const EXPERIMENT_RUNS_SAMPLE_METRIC_AUTO_REFRESH_INTERVAL = 30000;
```

--------------------------------------------------------------------------------

---[FILE: NetworkUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/NetworkUtils.ts

```typescript
import { NetworkRequestError } from '@databricks/web-shared/errors';

export async function catchNetworkErrorIfExists(error: any): Promise<void> {
  if (error instanceof NetworkRequestError) {
    const body = await error.response?.json();
    error.message = body?.message;
  }

  throw error;
}
```

--------------------------------------------------------------------------------

---[FILE: NoteUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/NoteUtils.ts

```typescript
import { MLFLOW_INTERNAL_PREFIX } from '../../common/utils/TagUtils';

export const NOTE_CONTENT_TAG = MLFLOW_INTERNAL_PREFIX + 'note.content';
```

--------------------------------------------------------------------------------

---[FILE: RunNameUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/RunNameUtils.test.ts

```typescript
import { describe, beforeEach, jest, afterEach, it, expect } from '@jest/globals';
import { createPrng } from '../../common/utils/TestUtils';
import { generateRandomRunName, getDuplicatedRunName } from './RunNameUtils';

describe('RunNameUtils', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockImplementation(createPrng());
  });
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it.each([5, 10, 30])(
    'correctly generate random run names with respect to the maximum length of %s characters',
    (maxLength) => {
      const generatedNames = new Array(10).fill(0).map(() => generateRandomRunName('-', 3, maxLength));

      for (const name of generatedNames) {
        expect(name.length).toBeLessThanOrEqual(maxLength);
      }
    },
  );

  describe('getCopiedRunName', () => {
    it('creates simple copied name', () => {
      expect(getDuplicatedRunName('run-name')).toEqual('run-name (1)');
    });

    it('creates duplicated name out of already duplicated name', () => {
      expect(getDuplicatedRunName('run-name (1)')).toEqual('run-name (2)');
      expect(getDuplicatedRunName('run-name (2)')).toEqual('run-name (3)');
      expect(getDuplicatedRunName('run-name (9)')).toEqual('run-name (10)');
      expect(getDuplicatedRunName('run-name (99)')).toEqual('run-name (100)');
    });

    it('creates duplicated name considering already existing names', () => {
      expect(getDuplicatedRunName('run-name', ['run-name (1)'])).toEqual('run-name (2)');
      expect(getDuplicatedRunName('run-name (1)', ['run-name (2)'])).toEqual('run-name (3)');
      expect(getDuplicatedRunName('run-name (17)', ['run-name (18)', 'run-name (19)'])).toEqual('run-name (20)');
      expect(getDuplicatedRunName('run-name (15)', ['run-name (10)'])).toEqual('run-name (16)');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: RunNameUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/utils/RunNameUtils.ts

```typescript
/**
 * TS implementation of
 * https://github.com/mlflow/mlflow/blob/master/mlflow/utils/name_utils.py
 */

import { RUNS_COLOR_PALETTE } from '../../common/color-palette';
// prettier-ignore
const dictionaryAdjectives = ['abundant','able','abrasive','adorable','adaptable','adventurous','aged','agreeable','ambitious','amazing','amusing','angry','auspicious','awesome','bald','beautiful','bemused','bedecked','big','bittersweet','blushing','bold','bouncy','brawny','bright','burly','bustling','calm','capable','carefree','capricious','caring','casual','charming','chill','classy','clean','clumsy','colorful','crawling','dapper','debonair','dashing','defiant','delicate','delightful','dazzling','efficient','enchanting','entertaining','enthused','exultant','fearless','flawless','fortunate','fun','funny','gaudy','gentle','gifted','glamorous','grandiose','gregarious','handsome','hilarious','honorable','illustrious','incongruous','indecisive','industrious','intelligent','inquisitive','intrigued','invincible','judicious','kindly','languid','learned','legendary','likeable','loud','luminous','luxuriant','lyrical','magnificent','marvelous','masked','melodic','merciful','mercurial','monumental','mysterious','nebulous','nervous','nimble','nosy','omniscient','orderly','overjoyed','peaceful','painted','persistent','placid','polite','popular','powerful','puzzled','rambunctious','rare','rebellious','respected','resilient','righteous','receptive','redolent','resilient','rogue','rumbling','salty','sassy','secretive','selective','sedate','serious','shivering','skillful','sincere','skittish','silent','smiling','sneaky','sophisticated','spiffy','stately','suave','stylish','tasteful','thoughtful','thundering','traveling','treasured','trusting','unequaled','upset','unique','unleashed','useful','upbeat','unruly','valuable','vaunted','victorious','welcoming','whimsical','wistful','wise','worried','youthful','zealous'];
// prettier-ignore
const dictionaryNouns = ['ant','ape','asp','auk','bass','bat','bear','bee','bird','boar','bug','calf','carp','cat','chimp','cod','colt','conch','cow','crab','crane','croc','crow','cub','deer','doe','dog','dolphin','donkey','dove','duck','eel','elk','fawn','finch','fish','flea','fly','foal','fowl','fox','frog','gnat','gnu','goat','goose','grouse','grub','gull','hare','hawk','hen','hog','horse','hound','jay','kit','kite','koi','lamb','lark','loon','lynx','mare','midge','mink','mole','moose','moth','mouse','mule','newt','owl','ox','panda','penguin','perch','pig','pug','quail','ram','rat','ray','robin','roo','rook','seal','shad','shark','sheep','shoat','shrew','shrike','shrimp','skink','skunk','sloth','slug','smelt','snail','snake','snipe','sow','sponge','squid','squirrel','stag','steed','stoat','stork','swan','tern','toad','trout','turtle','vole','wasp','whale','wolf','worm','wren','yak','zebra'];

const generateString = (separator: string, integerScale: number) => {
  const randomAdjIndex = Math.floor(Math.random() * dictionaryAdjectives.length);
  const randomNounIndex = Math.floor(Math.random() * dictionaryNouns.length);
  const randomAdjective = dictionaryAdjectives[randomAdjIndex];
  const randomNoun = dictionaryNouns[randomNounIndex];
  const randomNumber = Math.floor(Math.random() * 10 ** integerScale);
  return [randomAdjective, randomNoun, randomNumber].join(separator);
};

/**
 * Generates a random name suitable for experiment run, e.g. invincible-mule-479
 */
export const generateRandomRunName = (separator = '-', integerScale = 3, maxLength = 20) => {
  let name = '';
  for (let i = 0; i < 10; i++) {
    name = generateString(separator, integerScale);
    if (name.length < maxLength) return name;
  }
  return name.slice(0, maxLength);
};

export const getDuplicatedRunName = (originalRunName = '', alreadyExistingRunNames: string[] = []) => {
  // Check if the the run name being copied is already suffixed with number
  const match = originalRunName.match(/\s\((\d+)\)$/);

  const nameSegmentWithoutIndex = match
    ? originalRunName.substring(0, originalRunName.length - match[0].length)
    : originalRunName;

  let newIndex = match ? parseInt(match[1], 10) + 1 : 1;
  // If there's already a run name with increased index, increase it again
  while (alreadyExistingRunNames.includes(nameSegmentWithoutIndex + ' (' + newIndex + ')')) {
    newIndex++;
  }
  return nameSegmentWithoutIndex + ' (' + newIndex + ')';
};

/**
 * Temporary function that assigns randomized, yet stable color
 * from the static palette basing on an input string. Used for coloring runs.
 *
 * TODO: make a decision on the final color hashing per run
 */
export const getStableColorForRun = (runUuid: string) => {
  let a = 0,
    b = 0;

  // Let's use super simple hashing method
  for (let i = 0; i < runUuid.length; i++) {
    a = (a + runUuid.charCodeAt(i)) % 255;
    b = (b + a) % 255;
  }

  // eslint-disable-next-line no-bitwise
  return RUNS_COLOR_PALETTE[(a | (b << 8)) % RUNS_COLOR_PALETTE.length];
};
```

--------------------------------------------------------------------------------

````

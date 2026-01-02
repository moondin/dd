---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 530
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 530 of 991)

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

---[FILE: useChartExpressionParser.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useChartExpressionParser.tsx
Signals: React

```typescript
import { last, uniq } from 'lodash';
import type { RunsChartsLineChartExpression } from '../runs-charts.types';
import { useCallback } from 'react';

const VARIABLE_OPERATOR = '$';
const MATCH_VARIABLE_REGEX = /\$\{([^}]+)\}/g;

enum Operator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  POWER = '^',
  // unary operators
  NEGATIVE_SIGN = '_',
  POSITIVE_SIGN = '|',
}
enum Parenthesis {
  OPEN = '(',
  CLOSE = ')',
}
enum VariableParenthesis {
  OPEN = '{',
  CLOSE = '}',
}
// Higher precedence value means higher priority
const precedence = {
  [Operator.ADD]: 1,
  [Operator.SUBTRACT]: 1,
  [Operator.MULTIPLY]: 2,
  [Operator.DIVIDE]: 2,
  [Operator.POWER]: 3,
  [Operator.NEGATIVE_SIGN]: 4,
  [Operator.POSITIVE_SIGN]: 4,
};

const isBinaryOperator = (char: string | number | undefined) => {
  if (typeof char === 'string') {
    return [Operator.ADD, Operator.SUBTRACT, Operator.MULTIPLY, Operator.DIVIDE, Operator.POWER].includes(
      char as Operator,
    );
  }
  return false;
};

const isUnaryOperator = (char: string | number | undefined) => {
  if (typeof char === 'string') {
    return [Operator.NEGATIVE_SIGN, Operator.POSITIVE_SIGN].includes(char as Operator);
  }
  return false;
};
const isHigherPrecedence = (op1: Operator, op2: Operator) => precedence[op1] > precedence[op2];

const indexToVariableString = (name: number) => `${VARIABLE_OPERATOR}{${name}}`;
const variableStringToIndex = (variable: string) => variable.slice(2, -1);

// Parses variables from an expression and replace with an index
export const parseVariablesAndReplaceWithIndex = (expression: string) => {
  const matches = expression.match(MATCH_VARIABLE_REGEX);
  if (!matches) {
    return { expression, variables: [] };
  }
  // De-duplicate matches and map them to their index
  const dedupMatches = uniq(matches);
  const matchesMap: Record<string, string> = {};
  dedupMatches.forEach((match, index) => {
    matchesMap[match] = indexToVariableString(index);
  });
  // Convert each variable into an index number e.g. ${train/loss} => ${0}
  const replacedExpression = expression.replace(MATCH_VARIABLE_REGEX, (match) => {
    if (match in matchesMap) {
      return matchesMap[match];
    }
    return match;
  });

  const variables = dedupMatches.map(variableStringToIndex);
  return { expression: replacedExpression, variables };
};

// Pop function that throws an error if the stack is empty
const popAndValidate = (stack: (string | number)[], operandCount: number[]): string | number => {
  const lastElement = stack.pop();
  if (lastElement === undefined) {
    throw new Error('Invalid expression: stack is empty');
  } else if (isBinaryOperator(lastElement)) {
    if (operandCount[operandCount.length - 1] < 2) {
      throw new Error('Invalid expression: Stack has binary operator without enough operands');
    }
    operandCount[operandCount.length - 1]--;
  } else if (isUnaryOperator(lastElement)) {
    if (operandCount[operandCount.length - 1] < 1) {
      throw new Error('Invalid expression: Stack has unary operator without enough operands');
    }
  } else {
    throw new Error('Invalid expression: Stack has invalid elements');
  }
  return lastElement;
};

// Flushes all the unary operators on a given value
const flushUnaryOperators = (stack: (string | number)[], output: (string | number)[], operandCount: number[]) => {
  while (stack.length > 0 && isUnaryOperator(last(stack))) {
    output.push(popAndValidate(stack, operandCount));
  }
};

const toRPN = (expression: string) => {
  const stack: (string | number)[] = [];
  const output: (string | number)[] = [];
  const operandCount: number[] = [0];

  const incrementOperand = () => {
    operandCount[operandCount.length - 1]++;
  };
  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];

    // Convert unary operators to placeholder negative and positive signs
    const isUnarySign = i === 0 || isBinaryOperator(expression[i - 1]) || expression[i - 1] === Parenthesis.OPEN;
    if (char === Operator.SUBTRACT && isUnarySign) {
      char = Operator.NEGATIVE_SIGN;
    } else if (char === Operator.ADD && isUnarySign) {
      char = Operator.POSITIVE_SIGN;
    }

    if (char === VARIABLE_OPERATOR) {
      let variable = '';
      if (i + 1 >= expression.length || expression[i + 1] !== VariableParenthesis.OPEN) {
        throw new Error('Invalid expression: Variable must be followed by {');
      }
      i++; // Skip '{'
      while (i + 1 < expression.length && expression[i + 1] !== VariableParenthesis.CLOSE) {
        variable += expression[++i];
      }
      i++; // Skip '}'
      output.push(variable);
      incrementOperand();
      flushUnaryOperators(stack, output, operandCount);
    } else if (/\d/.test(char) || char === '.') {
      // If the character is part of a number (digit or decimal point)
      let num = char;
      // Parse full number
      while (i + 1 < expression.length && (/\d/.test(expression[i + 1]) || expression[i + 1] === '.')) {
        num += expression[++i];
      }
      const periodMatches = num.match(/\./g);
      if (periodMatches && periodMatches.length > 1) {
        throw new Error('Invalid expression: Number has multiple decimal points');
      }
      const floatNum = parseFloat(num);
      incrementOperand();
      output.push(floatNum);
      flushUnaryOperators(stack, output, operandCount);
    } else if (isUnaryOperator(char)) {
      stack.push(char);
    } else if (isBinaryOperator(char)) {
      // If its a binary operator, we should have at least on element in the output to operate on
      if (output.length === 0) {
        throw new Error('Invalid expression: Binary operator without operands');
      }
      while (
        stack.length > 0 &&
        isBinaryOperator(last(stack)) &&
        (isHigherPrecedence(last(stack) as Operator, char as Operator) ||
          (last(stack) === char && char !== Operator.POWER))
      ) {
        output.push(popAndValidate(stack, operandCount));
      }
      stack.push(char);
    } else if (char === Parenthesis.OPEN) {
      stack.push(char);
      operandCount.push(0);
    } else if (char === Parenthesis.CLOSE) {
      while (stack.length > 0 && last(stack) !== Parenthesis.OPEN) {
        output.push(popAndValidate(stack, operandCount));
      }
      const openParen = stack.pop(); // Remove '(' from the stack
      if (openParen !== Parenthesis.OPEN) {
        throw new Error('Invalid expression: Parenthesis mismatch');
      }
      if (operandCount[operandCount.length - 1] !== 1) {
        throw new Error('Invalid expression: Parenthesis does not have exactly one operand');
      }
      operandCount.pop();
      incrementOperand();
      flushUnaryOperators(stack, output, operandCount);
    } else {
      throw new Error('Invalid expression: Unknown character in expression');
    }
  }
  // The stack should only have unary and binary operators at the end
  while (stack.length > 0) {
    output.push(popAndValidate(stack, operandCount));
  }
  if (operandCount.length !== 1 || operandCount[0] !== 1) {
    throw new Error('Invalid expression: Invalid number of operands');
  }
  return output;
};

const fromRPN = (tokens: (string | number)[]) => {
  const stack: (number | string)[] = [];
  tokens.forEach((token) => {
    if (typeof token === 'number') {
      stack.push(token);
      return;
    }
    if (isUnaryOperator(token)) {
      const x = stack.pop();
      if (typeof x !== 'number') {
        throw new Error('Invalid expression: Unary operator without operand');
      }
      switch (token) {
        case Operator.NEGATIVE_SIGN:
          stack.push(-x);
          break;
        case Operator.POSITIVE_SIGN:
          stack.push(x);
          break;
      }
    } else if (isBinaryOperator(token)) {
      const b = stack.pop();
      const a = stack.pop();
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Invalid expression: Binary operator without enough operands');
      }
      switch (token) {
        case Operator.ADD:
          stack.push(a + b);
          break;
        case Operator.SUBTRACT:
          stack.push(a - b);
          break;
        case Operator.MULTIPLY:
          stack.push(a * b);
          break;
        case Operator.DIVIDE:
          stack.push(a / b);
          break;
        case Operator.POWER:
          stack.push(Math.pow(a, b));
          break;
      }
    } else {
      throw new Error('Invalid expression: Unknown token in expression');
    }
  });
  if (stack.length !== 1 || typeof stack[0] !== 'number') {
    throw new Error('Invalid expression: Invalid expression result');
  }
  return stack[0];
};

export const useChartExpressionParser = () => {
  const compileExpression = useCallback(
    (expression: string, metricKeyList: string[]): RunsChartsLineChartExpression | undefined => {
      try {
        // Validate only contains valid characters
        const noVariableExpression = expression.replace(MATCH_VARIABLE_REGEX, '');
        if (!/^[0-9+\-*/().\s^]*$/.test(noVariableExpression)) {
          return undefined;
        }
        // Parse variables from expression and remove whitespace elsewhere
        const { expression: parsedExpression, variables } = parseVariablesAndReplaceWithIndex(expression);
        // Check if all variables are valid
        for (const variable of variables) {
          if (!metricKeyList.includes(variable)) {
            return undefined;
          }
        }
        const cleanedExpression = parsedExpression.replace(/\s/g, '');
        const replacedExpression = cleanedExpression.replace(MATCH_VARIABLE_REGEX, (match) => {
          const index = parseInt(match.slice(2, -1), 10);
          return `${VARIABLE_OPERATOR}{${variables[index]}}`;
        });
        // Convert expression to RPN
        const rpn = toRPN(replacedExpression);
        return {
          rpn,
          variables,
          expression,
        };
      } catch (e) {
        // If not a valid expression, return undefined
        return undefined;
      }
    },
    [],
  );

  const evaluateExpression = (
    chartExpression: RunsChartsLineChartExpression | undefined,
    variables: Record<string, number>,
  ): number | undefined => {
    if (chartExpression === undefined) {
      return undefined;
    }
    try {
      const parsedRPN = chartExpression.rpn.map((token) => {
        if (typeof token === 'string' && chartExpression.variables.includes(token)) {
          return variables[token];
        }
        return token;
      });
      return fromRPN(parsedRPN);
    } catch (e) {
      return undefined;
    }
  };

  return {
    compileExpression,
    evaluateExpression,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useChartImageDownloadHandler.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useChartImageDownloadHandler.tsx
Signals: React

```typescript
import { useCallback, useRef, useState } from 'react';
import { type Data, type Layout, type Config, downloadImage } from 'plotly.js';

export type ExperimentChartImageDownloadFileFormat = 'svg' | 'png';
export type ExperimentChartImageDownloadHandler = (
  format: ExperimentChartImageDownloadFileFormat,
  chartTitle: string,
) => void;

const experimentChartImageDefaultDownloadLayout: Partial<Layout> = {
  paper_bgcolor: 'white',
  plot_bgcolor: 'white',
};

const experimentChartImageDefaultDownloadSettings = {
  width: 1200,
  height: 600,
};

const experimentChartImageDefaultDownloadPlotConfig: Partial<Config> = {
  displaylogo: false,
  modeBarButtonsToRemove: ['toImage'],
};

export const createChartImageDownloadHandler =
  (data: Data[], layout: Partial<Layout>) => (format: 'svg' | 'png', title: string) =>
    downloadImage(
      {
        data,
        layout: { ...layout, ...experimentChartImageDefaultDownloadLayout },
        config: experimentChartImageDefaultDownloadPlotConfig,
      },
      { ...experimentChartImageDefaultDownloadSettings, format, filename: title },
    );

/**
 * Returns a memoized download handler for chart images.
 * Uses ref-based caching to ensure that the download handler is not recreated on every render.
 */
export const useChartImageDownloadHandler = () => {
  const downloadHandlerRef = useRef<ExperimentChartImageDownloadHandler | null>(null);
  const [downloadHandler, setDownloadHandler] = useState<ExperimentChartImageDownloadHandler | null>(null);

  const setDownloadHandlerCached = useCallback((downloadHandler: ExperimentChartImageDownloadHandler) => {
    downloadHandlerRef.current = downloadHandler;
    setDownloadHandler((existingHandler: ExperimentChartImageDownloadHandler | null) => {
      if (existingHandler) {
        return existingHandler;
      }

      return (format: ExperimentChartImageDownloadFileFormat, chartTitle: string) =>
        downloadHandlerRef.current?.(format, chartTitle);
    });
  }, []);

  return [downloadHandler, setDownloadHandlerCached] as const;
};
```

--------------------------------------------------------------------------------

---[FILE: useCompareRunChartSelectedRange.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useCompareRunChartSelectedRange.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';
import { findChartStepsByTimestampForRuns } from '../utils/findChartStepsByTimestamp';
import type { SampledMetricsByRunUuidState } from '../../../types';
import { isNumber, isString, isUndefined } from 'lodash';
import { RunsChartsLineChartXAxisType } from '../components/RunsCharts.common';
import type { RunsChartsLineCardConfig } from '../runs-charts.types';

/**
 * Hook used in compare run charts. It's responsible for converting selected range
 * (which can be either step or timestamp) to step range, based on chart axis type.
 * @param config Line chart configuration
 * @param xAxisKey Can be 'step', 'time' or 'time-relative'
 * @param metricKey
 * @param sampledMetricsByRunUuid Recorded history for metrics for runs in compare chart
 * @param runUuids List of run UUIDs in compare chart
 * @param scaleType Scale type for the chart
 */
export const useCompareRunChartSelectedRange = (
  config: RunsChartsLineCardConfig,
  xAxisKey: RunsChartsLineChartXAxisType,
  metricKey: string,
  sampledMetricsByRunUuid: SampledMetricsByRunUuidState,
  runUuids: string[],
  scaleType: 'linear' | 'log' = 'linear',
) => {
  const [xRangeLocal, setXRangeLocal] = useState<[number | string, number | string] | undefined>(() => {
    if (config.range && !isUndefined(config.range.xMin) && !isUndefined(config.range.xMax)) {
      return [config.range.xMin, config.range.xMax];
    }
    return undefined;
  });
  const [offsetTimestamp, setOffsetTimestamp] = useState<[number, number] | undefined>(undefined);
  const stepRange = useMemo<[number, number] | undefined>(() => {
    if (!xRangeLocal) {
      return undefined;
    }
    if (xAxisKey === RunsChartsLineChartXAxisType.TIME && isString(xRangeLocal[0]) && isString(xRangeLocal[1])) {
      // If we're dealing with absolute time-based chart axis, find corresponding steps based on timestamp
      const bounds = findChartStepsByTimestampForRuns(
        sampledMetricsByRunUuid,
        runUuids,
        metricKey,
        xRangeLocal as [string, string],
      );
      return bounds;
    }

    if (
      xAxisKey === RunsChartsLineChartXAxisType.TIME_RELATIVE &&
      offsetTimestamp &&
      isNumber(xRangeLocal[0]) &&
      isNumber(xRangeLocal[1])
    ) {
      // If we're dealing with absolute time-based chart axis, find corresponding steps based on timestamp
      const bounds = findChartStepsByTimestampForRuns(
        sampledMetricsByRunUuid,
        runUuids,
        metricKey,
        offsetTimestamp as [number, number],
      );
      return bounds;
    }

    if (xAxisKey === RunsChartsLineChartXAxisType.STEP && isNumber(xRangeLocal[0]) && isNumber(xRangeLocal[1])) {
      // If we're dealing with step-based chart axis, use those steps but incremented/decremented
      const lowerBound = Math.floor(scaleType === 'log' ? 10 ** xRangeLocal[0] : xRangeLocal[0]);
      const upperBound = Math.ceil(scaleType === 'log' ? 10 ** xRangeLocal[1] : xRangeLocal[1]);
      return lowerBound && upperBound ? [lowerBound - 1, upperBound + 1] : undefined;
    }

    // return undefined for xAxisKey === 'metric' because there isn't
    // necessarily a mapping between value range and step range
    return undefined;
  }, [xAxisKey, metricKey, xRangeLocal, sampledMetricsByRunUuid, runUuids, offsetTimestamp, scaleType]);

  return {
    /**
     * If there's an offset timestamp calculated from relative runs, set it using this function
     */
    setOffsetTimestamp,
    /**
     * Resulting step range
     */
    stepRange,
    /**
     * Local range selected by user
     */
    xRangeLocal,
    /**
     * Set selected range
     */
    setXRangeLocal,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useImageSliderStepMarks.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useImageSliderStepMarks.tsx

```typescript
import { ImageEntity } from '@mlflow/mlflow/src/experiment-tracking/types';
import type { RunsChartsRunData } from '../components/RunsCharts.common';

export const useImageSliderStepMarks = ({
  data,
  selectedImageKeys,
}: {
  data: RunsChartsRunData[];
  selectedImageKeys: string[];
}) => {
  const stepMarks = data.reduce((acc, run: RunsChartsRunData) => {
    for (const imageKey of Object.keys(run.images)) {
      if (selectedImageKeys?.includes(imageKey)) {
        const metadata = run.images[imageKey];
        for (const meta of Object.values(metadata)) {
          if (meta.step !== undefined) {
            acc[meta.step] = {
              style: { display: 'none' },
              label: '',
            };
          }
        }
      }
    }
    return acc;
  }, {} as Record<number, any>);

  return {
    stepMarks,
    maxMark: Math.max(...Object.keys(stepMarks).map(Number)),
    minMark: Math.min(...Object.keys(stepMarks).map(Number)),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useIsInViewport.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useIsInViewport.tsx
Signals: React

```typescript
import { useEffect, useRef, useState } from 'react';

// Define a module-global observer and a WeakMap on elements to hold callbacks
let sharedObserver: IntersectionObserver | null = null;
const entryCallbackMap = new WeakMap();

const ensureSharedObserverExists = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const entryCallback = entryCallbackMap.get(entry.target);
        entryCallback?.(entry.isIntersecting);
      }
    });
  }
};

function observeElement(element: Element, callback: (isIntersecting: boolean) => void) {
  ensureSharedObserverExists();
  entryCallbackMap.set(element, callback);
  sharedObserver?.observe(element);

  return () => {
    if (element) {
      sharedObserver?.unobserve(element);
      entryCallbackMap.delete(element);
    }
  };
}

/**
 * Checks if the element is currently visible within the viewport using IntersectionObserver.
 * If "enabled" is set to false, the returned value will always be true.
 */
export const useIsInViewport = <T extends Element>({ enabled = true }: { enabled?: boolean } = {}) => {
  const [element, setElementRef] = useState<T | null>(null);
  const [isInViewport, setIsInViewport] = useState(!enabled);

  useEffect(() => {
    // If already viewed or element is not available, do nothing
    if (!element) {
      return;
    }

    // If IntersectionObserver is not available, assume that the element is visible
    if (!window.IntersectionObserver || !enabled) {
      setIsInViewport(true);
      return;
    }

    return observeElement(element, setIsInViewport);
  }, [enabled, element]);

  // When the flag is disabled, deferred result is the same as the regular one
  return { isInViewport, setElementRef };
};
```

--------------------------------------------------------------------------------

---[FILE: useMutableHoverCallback.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useMutableHoverCallback.tsx
Signals: React

```typescript
import type { PlotMouseEvent } from 'plotly.js';
import { useEffect, useRef } from 'react';

/**
 * Unfortunately plotly.js memorizes first onHover callback given on initial render,
 * so in order to achieve updated behavior we need to wrap each onHover callback with an
 * immutable callback that will call mutable implementation.
 */
export const useMutableChartHoverCallback = <T extends (event: Readonly<PlotMouseEvent>) => void>(callback: T) => {
  const mutableRef = useRef<T>(callback);

  useEffect(() => {
    mutableRef.current = callback;
  }, [callback]);

  return (event: Readonly<PlotMouseEvent>) => {
    mutableRef.current(event);
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useRunsChartsMultipleTracesTooltip.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/runs-charts/hooks/useRunsChartsMultipleTracesTooltip.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import React, { useEffect, useRef } from 'react';
import { act, fireEvent, renderWithIntl, screen } from '../../../../common/utils/TestUtils.react18';
import { RunsChartsLineChartXAxisType } from '../components/RunsCharts.common';
import { useRunsMultipleTracesTooltipData } from './useRunsChartsMultipleTracesTooltip';
import type { Figure } from 'react-plotly.js';
import invariant from 'invariant';
import type { RunsCompareMultipleTracesTooltipData } from '../components/RunsMetricsLinePlot';

const testFigure: Figure = {
  layout: {
    xaxis: {
      range: [0, 100],
    },
  },
  data: [],
  frames: null,
};

jest.useFakeTimers();

const onHoverTestCallback = jest.fn();
const onUnhoverTestCallback = jest.fn();

describe('useCompareRunsAllTracesTooltipData', () => {
  const getLastHoverCallbackData = (): RunsCompareMultipleTracesTooltipData =>
    // @ts-expect-error Type 'unknown' is not assignable to type 'RunsCompareMultipleTracesTooltipData'
    jest.mocked(onHoverTestCallback).mock?.lastCall?.[2];

  const hoverPointerOnClientX = (clientX: number) => {
    jest.advanceTimersByTime(200);

    fireEvent(
      screen.getByTestId('draglayer'),
      new MouseEvent('pointermove', {
        clientX,
      }),
    );
  };

  const renderTestComponent = () => {
    let onPointHover: ({ points }: any) => void = () => {};
    const TestComponent = () => {
      const testChartElementRef = useRef<HTMLDivElement>(null);

      const hookResult = useRunsMultipleTracesTooltipData({
        onUnhover: onUnhoverTestCallback,
        onHover: onHoverTestCallback,
        disabled: false,
        legendLabelData: [
          { color: 'red', label: 'First trace', uuid: 'first-trace', metricKey: 'metric_a' },
          { color: 'blue', label: 'Second trace', uuid: 'second-trace', metricKey: 'metric_a' },
        ],
        plotData: [
          {
            x: [10, 20, 30],
            y: [110, 220, 330],
            uuid: 'first-trace',
            metricKey: 'metric_a',
          },
          {
            x: [10, 40, 60],
            y: [70, 440, 660],
            uuid: 'second-trace',
            metricKey: 'metric_a',
          },
        ],
        runsData: [
          { displayName: 'First trace', uuid: 'first-trace' },
          { displayName: 'Second trace', uuid: 'second-trace' },
        ],
        xAxisKeyLabel: 'Step',
        containsMultipleMetricKeys: false,
        xAxisKey: RunsChartsLineChartXAxisType.STEP,
        setHoveredPointIndex: () => {},
      });

      const { initHandler, scanlineElement } = hookResult;
      onPointHover = hookResult.onPointHover;

      useEffect(() => {
        if (!testChartElementRef.current) {
          return;
        }
        const SVG = testChartElementRef.current.querySelector('.main-svg');
        invariant(SVG, 'SVG should exist');
        const draglayer = SVG.querySelector('.nsewdrag');
        invariant(draglayer, 'draglayer should exist');
        // @ts-expect-error Argument is not assignable to parameter of type '() => DOMRect'
        SVG.getBoundingClientRect = jest.fn<typeof SVG.getBoundingClientRect>(() => ({
          width: 200,
          x: 0,
        }));
        // @ts-expect-error Argument is not assignable to parameter of type '() => DOMRect'
        draglayer.getBoundingClientRect = jest.fn<typeof draglayer.getBoundingClientRect>(() => ({
          width: 200,
          x: 0,
        }));
        initHandler(testFigure, testChartElementRef.current);
      }, [initHandler]);

      return (
        // Render mock chart element
        <div ref={testChartElementRef}>
          <svg className="main-svg" role="figure">
            <g className="draglayer">
              <g className="nsewdrag" data-testid="draglayer" />
            </g>
          </svg>
          {scanlineElement && React.cloneElement(scanlineElement, { 'data-testid': 'scanline' })}
        </div>
      );
    };
    renderWithIntl(<TestComponent />);

    return { onHoverMock: onHoverTestCallback, onUnhoverMock: onUnhoverTestCallback, onPointHover };
  };
  test('displays multiple traces tooltip', async () => {
    const { onPointHover } = renderTestComponent();

    // First, hover over the chart on exact position containing points of both traces
    hoverPointerOnClientX(10);
    expect(getLastHoverCallbackData().xValue).toEqual(10);
    expect(getLastHoverCallbackData().tooltipLegendItems).toEqual([
      expect.objectContaining({ displayName: 'First trace', uuid: 'first-trace.metric_a', value: 110 }),
      expect.objectContaining({ displayName: 'Second trace', uuid: 'second-trace.metric_a', value: 70 }),
    ]);
    expect(window.getComputedStyle(screen.getByTestId('scanline')).left).toEqual('20px');

    // First, hover over the chart just near the place where only the first trace has a point
    hoverPointerOnClientX(42);
    expect(getLastHoverCallbackData().xValue).toEqual(20);
    expect(getLastHoverCallbackData().tooltipLegendItems).toEqual([
      expect.objectContaining({ displayName: 'First trace', uuid: 'first-trace.metric_a', value: 220 }),
    ]);
    expect(window.getComputedStyle(screen.getByTestId('scanline')).left).toEqual('40px');

    // First, hover over the chart just near the place where only the second trace has a point,
    // also hover over a particular points in chart
    onPointHover({ points: [{ x: 40, y: 440, data: { uuid: 'second-trace.metric_a' } }] });
    hoverPointerOnClientX(77);
    expect(getLastHoverCallbackData().xValue).toEqual(40);
    expect(getLastHoverCallbackData().tooltipLegendItems).toEqual([
      expect.objectContaining({ displayName: 'Second trace', uuid: 'second-trace.metric_a', value: 440 }),
    ]);
    // Hook also reports hovered point
    expect(getLastHoverCallbackData().hoveredDataPoint?.traceUuid).toEqual('second-trace.metric_a');
    expect(window.getComputedStyle(screen.getByTestId('scanline')).left).toEqual('80px');

    // Simulate mouse leaving the chart
    expect(onUnhoverTestCallback).toHaveBeenCalledTimes(0);
    fireEvent(screen.getByTestId('draglayer'), new MouseEvent('pointerleave'));
    expect(onUnhoverTestCallback).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

````

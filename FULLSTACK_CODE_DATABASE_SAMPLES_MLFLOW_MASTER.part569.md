---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 569
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 569 of 991)

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

---[FILE: MetricReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/MetricReducer.test.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, test, expect } from '@jest/globals';
import {
  metricsByKey,
  getLatestMetrics,
  getMinMetrics,
  getMaxMetrics,
  getMetricsByKey,
  metricsByRunUuid,
  minMetricsByRunUuid,
  maxMetricsByRunUuid,
} from './MetricReducer';
import { GET_METRIC_HISTORY_API, GET_METRIC_HISTORY_API_BULK } from '../actions';
import { Metric } from '../sdk/MlflowMessages';
import { fulfilled } from '../../common/utils/ActionUtils';

describe('test getMetricsByKey', () => {
  test('run has no keys', () => {
    const state = {
      entities: {
        metricsByRunUuid: {
          run1: {},
        },
      },
    };
    expect(getMetricsByKey('run1', undefined, state)).toEqual(undefined);
  });

  test('run has no matching key', () => {
    const state = {
      entities: {
        metricsByRunUuid: {
          run1: { m1: undefined },
        },
      },
    };
    expect(getMetricsByKey('run1', 'm2', state)).toEqual(undefined);
  });

  test('returns matching key (1)', () => {
    const state = {
      entities: {
        metricsByRunUuid: {
          run1: { m1: 1, m2: undefined },
        },
      },
    };
    expect(getMetricsByKey('run1', 'm2', state)).toEqual(undefined);
  });

  test('returns matching key (2)', () => {
    const state = {
      entities: {
        metricsByRunUuid: {
          run1: { m1: 1, m2: 2 },
        },
      },
    };
    expect(getMetricsByKey('run1', 'm2', state)).toEqual(2);
  });
});

describe('test getLatestMetrics', () => {
  test('handle empty state', () => {
    const state = {
      entities: {
        latestMetricsByRunUuid: {},
      },
    };
    expect(getLatestMetrics('run1', state)).toEqual(undefined);
  });

  test('missing run', () => {
    const state = {
      entities: {
        latestMetricsByRunUuid: {
          run2: [],
        },
      },
    };
    expect(getLatestMetrics('run1', state)).toEqual(undefined);
  });

  test('run has no metrics', () => {
    const state = {
      entities: {
        latestMetricsByRunUuid: {
          run1: [],
        },
      },
    };
    expect(getLatestMetrics('run1', state)).toEqual([]);
  });

  test('returns all metrics', () => {
    const state = {
      entities: {
        latestMetricsByRunUuid: {
          run1: { m1: 1, m2: 2 },
        },
      },
    };
    expect(getLatestMetrics('run1', state)).toEqual({ m1: 1, m2: 2 });
  });

  test('returns correct metrics', () => {
    const state = {
      entities: {
        latestMetricsByRunUuid: {
          run1: { m1: 1, m2: 2 },
          run2: { m1: 3, m2: 4 },
        },
      },
    };
    expect(getLatestMetrics('run2', state)).toEqual({ m1: 3, m2: 4 });
  });
});

describe('test getMinMetrics', () => {
  test('handle empty state', () => {
    const state = {
      entities: {
        minMetricsByRunUuid: {},
      },
    };
    expect(getMinMetrics('run1', state)).toEqual(undefined);
  });

  test('returns correct metrics', () => {
    const state = {
      entities: {
        minMetricsByRunUuid: {
          run1: { m1: 1, m2: 2 },
          run2: { m1: 3, m2: 4 },
        },
      },
    };
    expect(getMinMetrics('run2', state)).toEqual({ m1: 3, m2: 4 });
  });
});

describe('test getMaxMetrics', () => {
  test('handle empty state', () => {
    const state = {
      entities: {
        maxMetricsByRunUuid: {},
      },
    };
    expect(getMaxMetrics('run1', state)).toEqual(undefined);
  });

  test('returns correct metrics', () => {
    const state = {
      entities: {
        maxMetricsByRunUuid: {
          run1: { m1: 1, m2: 2 },
          run2: { m1: 3, m2: 4 },
        },
      },
    };
    expect(getMaxMetrics('run2', state)).toEqual({ m1: 3, m2: 4 });
  });
});

const mockMetric = (key: any, value: any, timestamp = 1234567890000, step = 1, run_id = undefined) => {
  const metric = {
    key: key,
    value: value,
    timestamp: timestamp,
    step: step,
    run_id: run_id,
  };
  return [metric, (Metric as any).fromJs(metric)];
};

describe('test metricsByKey', () => {
  // All tests for GET_METRIC_HISTORY_API are valid for GET_METRIC_HISTORY_API_BULK
  // due to the same treatment inside metricsByKey()
  test('intial state (1)', () => {
    expect(metricsByKey({}, {}, undefined)).toEqual({});
  });

  test('intial state (2)', () => {
    expect(metricsByKey({ 1: '1' }, {}, undefined)).toEqual({ 1: '1' });
  });

  test('GET_METRIC_HISTORY_API handles empty state and empty metrics', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { key: 'm1' },
    };
    const metrics: any = [];
    expect(metricsByKey({}, action, metrics)).toEqual({ m1: [] });
  });

  test('GET_METRIC_HISTORY_API handles empty state with valid metrics', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { key: 'm1' },
    };
    const [m1, m1proto] = mockMetric('m1', 5);
    const metrics = [m1];
    expect(metricsByKey({}, action, metrics)).toEqual({ m1: [m1proto] });
  });

  test('GET_METRIC_HISTORY_API updates stale metrics', () => {
    const [, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 6);
    const state = {
      acc: [m1proto],
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { key: 'acc' },
    };
    const metrics = [m2];
    expect(metricsByKey(state, action, metrics)).toEqual({ acc: [m2proto] });
  });

  test('GET_METRIC_HISTORY_API refreshes metrics', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 6);
    const state = {
      acc: [m1proto],
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { key: 'acc' },
    };
    const metrics = [m1, m2];
    expect(metricsByKey(state, action, metrics)).toEqual({ acc: [m1proto, m2proto] });
  });

  test('GET_METRIC_HISTORY_API leaves other metric keys in state unaffected', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 6);
    const [, m3proto] = mockMetric('loss', 0.001);
    const state = {
      loss: [m3proto],
      acc: [m1proto],
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { key: 'acc' },
    };
    const metrics = [m1, m2];
    expect(metricsByKey(state, action, metrics)).toEqual({
      acc: [m1proto, m2proto],
      loss: [m3proto],
    });
  });
});

describe('test metricsByRunUuid', () => {
  test('initial state', () => {
    expect(metricsByRunUuid({}, {})).toEqual({});
  });

  test('state returned as is for empty action', () => {
    expect(metricsByRunUuid({ a: 1 }, {})).toEqual({ a: 1 });
  });

  test('GET_METRIC_HISTORY_API handles empty state', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'm1' },
      payload: {},
    };
    expect(metricsByRunUuid({}, action)).toEqual({ run1: { m1: [] } });
  });

  test('GET_METRIC_HISTORY_API_BULK handles empty state', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API_BULK),
      meta: { runUuids: ['run1', 'run2'], key: 'm1' },
      payload: {},
    };
    expect(metricsByRunUuid({}, action)).toEqual({ run1: { m1: [] }, run2: { m1: [] } });
  });

  test('GET_METRIC_HISTORY_API handles missing run in state', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'm1' },
      payload: {},
    };
    const state = { run2: undefined };
    expect(metricsByRunUuid(state, action)).toEqual({ run1: { m1: [] }, run2: undefined });
  });

  test('GET_METRIC_HISTORY_API_BULK handles missing run in state', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API_BULK),
      meta: { runUuids: ['run1', 'run2'], key: 'm1' },
      payload: {},
    };
    const state = { run3: undefined };
    expect(metricsByRunUuid(state, action)).toEqual({
      run1: { m1: [] },
      run2: { m1: [] },
      run3: undefined,
    });
  });

  test('GET_METRIC_HISTORY_API returns appropriate metrics', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 6);
    const state = {
      run1: {
        acc: [m1proto],
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(metricsByRunUuid(state, action)).toEqual({ run1: { acc: [m1proto, m2proto] } });
  });

  test('GET_METRIC_HISTORY_API_BULK returns appropriate metrics and separates them between runs', () => {
    // @ts-expect-error TS(2345): Argument of type '"run1"' is not assignable to par... Remove this comment to see the full error message
    const [m1, m1proto] = mockMetric('acc', 5, undefined, undefined, 'run1');
    // @ts-expect-error TS(2345): Argument of type '"run2"' is not assignable to par... Remove this comment to see the full error message
    const [m2, m2proto] = mockMetric('acc', 6, undefined, undefined, 'run2');
    const state = {
      run1: {
        acc: [m1proto],
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API_BULK),
      meta: { runUuids: ['run1', 'run2'], key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(metricsByRunUuid(state, action)).toEqual({
      run1: { acc: [m1proto] },
      run2: { acc: [m2proto] },
    });
  });

  test('GET_METRIC_HISTORY_API updates state for relevant metric and leaves other metrics unaffected', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 6);
    const [, m3proto] = mockMetric('loss', 0.001);
    const state = {
      run1: {
        acc: [m1proto],
        loss: [m3proto],
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(metricsByRunUuid(state, action)).toEqual({
      run1: {
        acc: [m1proto, m2proto],
        loss: [m3proto],
      },
    });
  });

  test("GET_METRIC_HISTORY_API updates state for relevant run's metrics and leaves other runs unaffected", () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 6);
    const [, m3proto] = mockMetric('loss', 0.001);
    const state = {
      run1: {
        acc: [m1proto],
      },
      run2: {
        acc: [m3proto],
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(metricsByRunUuid(state, action)).toEqual({
      run1: {
        acc: [m1proto, m2proto],
      },
      run2: {
        acc: [m3proto],
      },
    });
  });

  test("GET_METRIC_HISTORY_API_BULK updates state for relevant runs' metrics and leaves other runs unaffected", () => {
    // @ts-expect-error TS(2345): Argument of type '"run1"' is not assignable to par... Remove this comment to see the full error message
    const [, m1proto] = mockMetric('acc', 5, 1, 1, 'run1');
    // @ts-expect-error TS(2345): Argument of type '"run2"' is not assignable to par... Remove this comment to see the full error message
    const [, m2proto] = mockMetric('acc', 6, 1, 1, 'run2');
    // @ts-expect-error TS(2345): Argument of type '"run3"' is not assignable to par... Remove this comment to see the full error message
    const [m3, m3proto] = mockMetric('acc', 7, 1, 1, 'run3');
    const state = {
      run1: {
        acc: [m1proto],
      },
      run2: {
        acc: [m2proto],
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API_BULK),
      meta: { runUuids: ['run3'], key: 'acc' },
      payload: {
        metrics: [m3],
      },
    };
    expect(metricsByRunUuid(state, action)).toEqual({
      run1: {
        acc: [m1proto],
      },
      run2: {
        acc: [m2proto],
      },
      run3: {
        acc: [m3proto],
      },
    });
  });
});

describe('test minMetricsByRunUuid', () => {
  test('initial state', () => {
    expect(minMetricsByRunUuid({}, {})).toEqual({});
  });

  test('state returned as is for empty action', () => {
    expect(minMetricsByRunUuid({ a: 1 }, {})).toEqual({ a: 1 });
  });

  test('GET_METRIC_HISTORY_API handles empty state', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'm1' },
      payload: {},
    };
    expect(minMetricsByRunUuid({}, action)).toEqual({});
  });

  test('GET_METRIC_HISTORY_API handles empty metrics', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'm1' },
      payload: {
        metrics: [],
      },
    };
    expect(minMetricsByRunUuid({}, action)).toEqual({});
  });

  test('GET_METRIC_HISTORY_API returns correct minimum metrics', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2] = mockMetric('acc', 6);
    const [m3, m3proto] = mockMetric('acc', 4);
    const [m4] = mockMetric('acc', 8);
    const [m5] = mockMetric('acc', NaN);
    const state = {
      run1: {
        acc: m1proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2, m3, m4, m5],
      },
    };
    expect(minMetricsByRunUuid(state, action)).toEqual({ run1: { acc: m3proto } });
  });

  test('GET_METRIC_HISTORY_API_BULK returns correct minimum metrics', () => {
    // @ts-expect-error TS(2345): Argument of type '"run1"' is not assignable to par... Remove this comment to see the full error message
    const [m1, m1proto] = mockMetric('acc', 5, undefined, undefined, 'run1');
    // @ts-expect-error TS(2345): Argument of type '"run1"' is not assignable to par... Remove this comment to see the full error message
    const [m2, m2proto] = mockMetric('acc', 4, undefined, undefined, 'run1');
    // @ts-expect-error TS(2345): Argument of type '"run2"' is not assignable to par... Remove this comment to see the full error message
    const [m3, m3proto] = mockMetric('acc', 1, undefined, undefined, 'run2');
    // @ts-expect-error TS(2345): Argument of type '"run2"' is not assignable to par... Remove this comment to see the full error message
    const [m4] = mockMetric('acc', 2, undefined, undefined, 'run2');
    const state = {
      run1: {
        acc: m1proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API_BULK),
      meta: { runUuids: ['run1', 'run2'], key: 'acc' },
      payload: {
        metrics: [m1, m2, m3, m4],
      },
    };
    expect(minMetricsByRunUuid(state, action)).toEqual({
      run1: { acc: m2proto },
      run2: { acc: m3proto },
    });
  });

  test('GET_METRIC_HISTORY_API updates state for relevant metric and leaves other metrics unaffected', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 4);
    const [, m3proto] = mockMetric('loss', 6);
    const state = {
      run1: {
        acc: m1proto,
        loss: m3proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(minMetricsByRunUuid(state, action)).toEqual({
      run1: { acc: m2proto, loss: m3proto },
    });
  });

  test('GET_METRIC_HISTORY_API updates state for relevant run and leaves other runs unaffected', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 4);
    const [, m3proto] = mockMetric('acc', 6);
    const state = {
      run1: {
        acc: m1proto,
      },
      run2: {
        acc: m3proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(minMetricsByRunUuid(state, action)).toEqual({
      run1: { acc: m2proto },
      run2: { acc: m3proto },
    });
  });
});

describe('test maxMetricsByRunUuid', () => {
  test('initial state', () => {
    expect(maxMetricsByRunUuid({}, {})).toEqual({});
  });

  test('state returned as is for empty action', () => {
    expect(maxMetricsByRunUuid({ a: 1 }, {})).toEqual({ a: 1 });
  });

  test('GET_METRIC_HISTORY_API handles empty state', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'm1' },
      payload: {},
    };
    expect(maxMetricsByRunUuid({}, action)).toEqual({});
  });

  test('GET_METRIC_HISTORY_API handles empty metrics', () => {
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'm1' },
      payload: {
        metrics: [],
      },
    };
    expect(maxMetricsByRunUuid({}, action)).toEqual({});
  });

  test('GET_METRIC_HISTORY_API returns correct maximum metrics', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2] = mockMetric('acc', 6);
    const [m3, m3proto] = mockMetric('acc', 9);
    const [m4] = mockMetric('acc', 8);
    const [m5] = mockMetric('acc', NaN);
    const state = {
      run1: {
        acc: m1proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2, m3, m4, m5],
      },
    };
    expect(maxMetricsByRunUuid(state, action)).toEqual({ run1: { acc: m3proto } });
  });

  test('GET_METRIC_HISTORY_API_BULK returns correct maximum metrics', () => {
    // @ts-expect-error TS(2345): Argument of type '"run1"' is not assignable to par... Remove this comment to see the full error message
    const [m1, m1proto] = mockMetric('acc', 12, undefined, undefined, 'run1');
    // @ts-expect-error TS(2345): Argument of type '"run1"' is not assignable to par... Remove this comment to see the full error message
    const [m2] = mockMetric('acc', 8, undefined, undefined, 'run1');
    // @ts-expect-error TS(2345): Argument of type '"run2"' is not assignable to par... Remove this comment to see the full error message
    const [m3] = mockMetric('acc', 9, undefined, undefined, 'run2');
    // @ts-expect-error TS(2345): Argument of type '"run2"' is not assignable to par... Remove this comment to see the full error message
    const [m4, m4proto] = mockMetric('acc', 11, undefined, undefined, 'run2');
    const state = {
      run1: {
        acc: m1proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API_BULK),
      meta: { runUuids: ['run1', 'run2'], key: 'acc' },
      payload: {
        metrics: [m1, m2, m3, m4],
      },
    };
    expect(maxMetricsByRunUuid(state, action)).toEqual({
      run1: { acc: m1proto },
      run2: { acc: m4proto },
    });
  });

  test('GET_METRIC_HISTORY_API updates state for relevant metric and leaves other metrics unaffected', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 7);
    const [, m3proto] = mockMetric('loss', 6);
    const state = {
      run1: {
        acc: m1proto,
        loss: m3proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(maxMetricsByRunUuid(state, action)).toEqual({
      run1: { acc: m2proto, loss: m3proto },
    });
  });

  test('GET_METRIC_HISTORY_API updates state for relevant run and leaves other runs unaffected', () => {
    const [m1, m1proto] = mockMetric('acc', 5);
    const [m2, m2proto] = mockMetric('acc', 7);
    const [, m3proto] = mockMetric('acc', 6);
    const state = {
      run1: {
        acc: m1proto,
      },
      run2: {
        acc: m3proto,
      },
    };
    const action = {
      type: fulfilled(GET_METRIC_HISTORY_API),
      meta: { runUuid: 'run1', key: 'acc' },
      payload: {
        metrics: [m1, m2],
      },
    };
    expect(maxMetricsByRunUuid(state, action)).toEqual({
      run1: { acc: m2proto },
      run2: { acc: m3proto },
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: MetricReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/MetricReducer.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { minBy, maxBy } from 'lodash';
import {
  GET_METRIC_HISTORY_API,
  GET_METRIC_HISTORY_API_BULK,
  GET_RUN_API,
  LOAD_MORE_RUNS_API,
  SEARCH_RUNS_API,
} from '../actions';
import { Metric } from '../sdk/MlflowMessages';
import { fulfilled } from '../../common/utils/ActionUtils';

export const getMetricsByKey = (runUuid: any, key: any, state: any) => {
  return state.entities.metricsByRunUuid[runUuid][key];
};

/**
 * Return
 * {
 *   [metric.key]: metric
 *   ...
 * }, one per metricName
 */
export const getLatestMetrics = (runUuid: any, state: any) => {
  return state.entities.latestMetricsByRunUuid[runUuid];
};

export const getMinMetrics = (runUuid: any, state: any) => {
  return state.entities.minMetricsByRunUuid[runUuid];
};

export const getMaxMetrics = (runUuid: any, state: any) => {
  return state.entities.maxMetricsByRunUuid[runUuid];
};

/**
 * Return latest metrics by run UUID (object of run UUID -> object of metric key -> Metric object)
 */
export const latestMetricsByRunUuid = (state = {}, action: any) => {
  const metricArrToObject = (metrics: any) => {
    const metricObj = {};
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    metrics.forEach((m: any) => (metricObj[m.key] = (Metric as any).fromJs(m)));
    return metricObj;
  };
  switch (action.type) {
    case fulfilled(GET_RUN_API): {
      const runInfo = action.payload.run.info;
      const runUuid = runInfo.runUuid;
      const metrics = action.payload.run.data.metrics || [];
      return {
        ...state,
        [runUuid]: metricArrToObject(metrics),
      };
    }
    case fulfilled(SEARCH_RUNS_API):
    case fulfilled(LOAD_MORE_RUNS_API): {
      const newState = { ...state };
      if (action.payload.runs) {
        action.payload.runs.forEach((rJson: any) => {
          const runUuid = rJson.info.runUuid;
          const metrics = rJson.data.metrics || [];
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid] = metricArrToObject(metrics);
        });
      }
      return newState;
    }
    case fulfilled(GET_METRIC_HISTORY_API): {
      const newState = { ...state };
      const { runUuid, key } = action.meta;
      const { metrics } = action.payload;
      if (metrics && metrics.length > 0) {
        const lastMetric = (Metric as any).fromJs(metrics[metrics.length - 1]);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (newState[runUuid]) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid][key] = lastMetric;
        } else {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid] = { [key]: lastMetric };
        }
      }
      return newState;
    }
    case fulfilled(GET_METRIC_HISTORY_API_BULK): {
      const newState = { ...state };
      const { runUuids, key } = action.meta;
      const { metrics } = action.payload;
      if (metrics && metrics.length > 0) {
        for (const runUuid of runUuids) {
          const runMetrics = metrics.filter((m: any) => m.run_id === runUuid);
          if (runMetrics.length < 1) {
            continue;
          }
          const lastMetric = (Metric as any).fromJs(runMetrics[runMetrics.length - 1]);
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (newState[runUuid]) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            newState[runUuid][key] = lastMetric;
          } else {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            newState[runUuid] = { [key]: lastMetric };
          }
        }
      }
      return newState;
    }
    default:
      return state;
  }
};

const reducedMetricsByRunUuid = (state = {}, action: any, reducer: any) => {
  switch (action.type) {
    case fulfilled(GET_METRIC_HISTORY_API): {
      const newState = { ...state };
      const { runUuid, key } = action.meta;
      const { metrics } = action.payload;
      if (metrics && metrics.length > 0) {
        const reducedMetric = (Metric as any).fromJs(reducer(metrics));
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (newState[runUuid]) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid][key] = reducedMetric;
        } else {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          newState[runUuid] = { [key]: reducedMetric };
        }
      }
      return newState;
    }
    case fulfilled(GET_METRIC_HISTORY_API_BULK): {
      const newState = { ...state };
      const { runUuids, key } = action.meta;
      const { metrics } = action.payload;
      if (metrics && metrics.length > 0) {
        for (const runUuid of runUuids) {
          const runMetrics = metrics.filter((m: any) => m.run_id === runUuid);
          const reducerResult = reducer(runMetrics);
          if (!reducerResult) {
            continue;
          }
          const reducedMetric = (Metric as any).fromJs(reducerResult);
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          if (newState[runUuid]) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            newState[runUuid][key] = reducedMetric;
          } else {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            newState[runUuid] = { [key]: reducedMetric };
          }
        }
      }
      return newState;
    }
    default:
      return state;
  }
};

/**
 * Return minimum metrics by run UUID (object of run UUID -> object of metric key -> Metric object)
 */
export const minMetricsByRunUuid = (state = {}, action: any) =>
  reducedMetricsByRunUuid(state, action, (metrics: any) => minBy(metrics, 'value'));

/**
 * Return maximum metrics by run UUID (object of run UUID -> object of metric key -> Metric object)
 */
export const maxMetricsByRunUuid = (state = {}, action: any) =>
  reducedMetricsByRunUuid(state, action, (metrics: any) => maxBy(metrics, 'value'));

export const metricsByRunUuid = (state = {}, action: any) => {
  switch (action.type) {
    case fulfilled(GET_METRIC_HISTORY_API): {
      const { runUuid } = action.meta;
      const metrics = action.payload.metrics || [];
      return {
        ...state,
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        [runUuid]: metricsByKey(state[runUuid], action, metrics),
      };
    }
    case fulfilled(GET_METRIC_HISTORY_API_BULK): {
      const { runUuids } = action.meta;
      const metrics = action.payload.metrics || [];
      const newState = { ...state };

      for (const runUuid of runUuids) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        newState[runUuid] = metricsByKey(
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          state[runUuid],
          action,
          metrics.filter((m: any) => m.run_id === runUuid),
        );
      }

      return newState;
    }
    default:
      return state;
  }
};

export const metricsByKey = (state = {}, action: any, metrics: any) => {
  const newState = { ...state };
  switch (action.type) {
    case fulfilled(GET_METRIC_HISTORY_API):
    case fulfilled(GET_METRIC_HISTORY_API_BULK): {
      const { key, pageToken } = action.meta;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const existingMetrics = newState[key] || [];
      const newMetrics = metrics.map((m: any) => (Metric as any).fromJs(m));
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newState[key] = pageToken ? [...existingMetrics, ...newMetrics] : newMetrics;
      return newState;
    }
    default:
      return state;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: ModelGatewayReducer.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/ModelGatewayReducer.test.ts
Signals: Redux/RTK

```typescript
import { describe, it, expect } from '@jest/globals';
import { fulfilled, pending } from '../../common/utils/ActionUtils';
import type { AsyncAction, AsyncFulfilledAction } from '../../redux-types';
import type { MlflowDeploymentsEndpoint } from '../sdk/ModelGatewayService';
import type { SearchMlflowDeploymentsModelRoutesAction } from '../actions/ModelGatewayActions';
import { ModelGatewayRouteTask } from '../sdk/MlflowEnums';
import { modelGatewayReducer } from './ModelGatewayReducer';

describe('modelGatewayReducer - MLflow deployments endpoints', () => {
  const emptyState: ReturnType<typeof modelGatewayReducer> = {
    modelGatewayRoutes: {},
    modelGatewayRoutesLoading: {
      deploymentRoutesLoading: false,
      endpointRoutesLoading: false,
      gatewayRoutesLoading: false,
      loading: false,
    },
  };

  const MOCK_MLFLOW_DEPLOYMENTS_RESPONSE: Partial<MlflowDeploymentsEndpoint>[] = [
    {
      endpoint_type: ModelGatewayRouteTask.LLM_V1_CHAT,
      name: 'test-mlflow-deployment-endpoint-chat',
      endpoint_url: 'http://deployment.server/endpoint-url',
      model: {
        name: 'mpt-3.5',
        provider: 'mosaic',
      },
    },
    {
      endpoint_type: ModelGatewayRouteTask.LLM_V1_EMBEDDINGS,
      name: 'test-mlflow-deployment-endpoint-embeddingss',
      endpoint_url: 'http://deployment.server/endpoint-url',
      model: {
        name: 'mpt-3.5',
        provider: 'mosaic',
      },
    },
  ];

  const mockFulfilledSearchDeploymentsAction = (
    endpoints: any,
  ): AsyncFulfilledAction<SearchMlflowDeploymentsModelRoutesAction> => ({
    type: fulfilled('SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES'),
    payload: { endpoints },
  });

  const mockPendingSearchDeploymentsAction = (): AsyncAction => ({
    type: pending('SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES'),
    payload: Promise.resolve(),
  });

  it('gateway routes are correctly populated by search action', () => {
    let state = emptyState;
    // Start searching for routes
    state = modelGatewayReducer(state, mockPendingSearchDeploymentsAction());
    expect(state.modelGatewayRoutesLoading.deploymentRoutesLoading).toEqual(true);
    expect(state.modelGatewayRoutesLoading.loading).toEqual(true);

    // Search and retrieve 2 model routes
    state = modelGatewayReducer(state, mockFulfilledSearchDeploymentsAction(MOCK_MLFLOW_DEPLOYMENTS_RESPONSE));

    expect(state.modelGatewayRoutesLoading.deploymentRoutesLoading).toEqual(false);
    expect(state.modelGatewayRoutesLoading.loading).toEqual(false);
    expect(state.modelGatewayRoutes['mlflow_deployment_endpoint:test-mlflow-deployment-endpoint-chat'].type).toEqual(
      'mlflow_deployment_endpoint',
    );
    expect(state.modelGatewayRoutes['mlflow_deployment_endpoint:test-mlflow-deployment-endpoint-chat'].name).toEqual(
      'test-mlflow-deployment-endpoint-chat',
    );
    expect(
      state.modelGatewayRoutes['mlflow_deployment_endpoint:test-mlflow-deployment-endpoint-chat'].mlflowDeployment,
    ).toEqual(MOCK_MLFLOW_DEPLOYMENTS_RESPONSE[0]);

    // We ignore embeddings endpoints for now
    expect(
      state.modelGatewayRoutes['mlflow_deployment_endpoint:test-mlflow-deployment-endpoint-embeddings'],
    ).toBeUndefined();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelGatewayReducer.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/reducers/ModelGatewayReducer.ts
Signals: Redux/RTK

```typescript
import { combineReducers } from 'redux';
import type { ModelGatewayRouteLegacy, ModelGatewayRoute } from '../sdk/ModelGatewayService';
import { ModelGatewayRouteTask } from '../sdk/MlflowEnums';
import { fulfilled, pending, rejected } from '../../common/utils/ActionUtils';

import type { AsyncAction, AsyncFulfilledAction } from '../../redux-types';
import type { SearchMlflowDeploymentsModelRoutesAction } from '../actions/ModelGatewayActions';

export interface ModelGatewayReduxState {
  modelGatewayRoutesLegacy: Record<string, ModelGatewayRouteLegacy>;
  modelGatewayRoutesLoadingLegacy: boolean;
  modelGatewayRoutes: Record<string, ModelGatewayRoute>;
  modelGatewayRoutesLoading: {
    gatewayRoutesLoading?: boolean;
    endpointRoutesLoading?: boolean;
    deploymentRoutesLoading?: boolean;
    loading: boolean;
  };
}

const modelGatewayRoutesLoading = (
  state = {
    gatewayRoutesLoading: false,
    endpointRoutesLoading: false,
    deploymentRoutesLoading: false,
    loading: false,
  },
  action: AsyncAction,
) => {
  switch (action.type) {
    case pending('SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES'):
      return { ...state, deploymentRoutesLoading: true, loading: true };
    case fulfilled('SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES'):
    case rejected('SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES'):
      return {
        ...state,
        deploymentRoutesLoading: false,
        loading: state.endpointRoutesLoading || state.gatewayRoutesLoading,
      };
  }
  return state;
};

type ModelGatewayReducerActions = AsyncFulfilledAction<SearchMlflowDeploymentsModelRoutesAction>;
const modelGatewayRoutes = (
  state: Record<string, ModelGatewayRoute> = {},
  { payload, type }: ModelGatewayReducerActions,
): Record<string, ModelGatewayRoute> => {
  const compatibleEndpointTypes = [ModelGatewayRouteTask.LLM_V1_COMPLETIONS, ModelGatewayRouteTask.LLM_V1_CHAT];
  switch (type) {
    case fulfilled('SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES'):
      if (!payload.endpoints) {
        return state;
      }
      const compatibleGatewayEndpoints = payload.endpoints.filter(
        ({ endpoint_type }) =>
          endpoint_type && compatibleEndpointTypes.includes(endpoint_type as ModelGatewayRouteTask),
      );
      return compatibleGatewayEndpoints.reduce((newState, deploymentEndpoint) => {
        return {
          ...newState,
          [`mlflow_deployment_endpoint:${deploymentEndpoint.name}`]: {
            type: 'mlflow_deployment_endpoint',
            key: `mlflow_deployment_endpoint:${deploymentEndpoint.name}`,
            name: deploymentEndpoint.name,
            mlflowDeployment: deploymentEndpoint,
            task: deploymentEndpoint.endpoint_type as ModelGatewayRouteTask,
          },
        };
      }, state);
  }
  return state;
};

export const modelGatewayReducer = combineReducers({
  modelGatewayRoutesLoading,
  modelGatewayRoutes,
});
```

--------------------------------------------------------------------------------

````

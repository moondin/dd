---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 463
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 463 of 991)

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

---[FILE: useEvaluationArtifactTableData.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactTableData.test.tsx

```typescript
import { describe, test, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useEvaluationArtifactTableData } from './useEvaluationArtifactTableData';
import { fromPairs } from 'lodash';
import type { EvaluationArtifactTable, PendingEvaluationArtifactTableEntry } from '../../../types';

describe('useEvaluationArtifactTableData', () => {
  const mountTestComponent = ({
    artifactsByRun = {},
    pendingDataByRun = {},
    draftInputValues = [],
    comparedRunUuids = [],
    tableNames = [],
    groupByColumns = [],
    outputColumn = '',
  }: {
    artifactsByRun: {
      [runUuid: string]: {
        [artifactPath: string]: EvaluationArtifactTable;
      };
    };
    pendingDataByRun?: {
      [runUuid: string]: PendingEvaluationArtifactTableEntry[];
    };
    draftInputValues?: Record<string, string>[];
    comparedRunUuids: string[];
    tableNames: string[];
    groupByColumns: string[];
    outputColumn: string;
  }) => {
    const { result } = renderHook(() =>
      useEvaluationArtifactTableData(
        artifactsByRun,
        pendingDataByRun,
        draftInputValues,
        comparedRunUuids,
        tableNames,
        groupByColumns,
        outputColumn,
      ),
    );

    return { getHookResult: () => result.current };
  };

  describe('properly generates data for a single table', () => {
    const TABLE_NAME = '/table1';
    const COLUMNS = ['input', 'additionalInput', 'answer', 'prompt'];
    const MOCK_STORE = {
      run_a: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'alpha', answer: 'answer_a', prompt: 'prompt_a' }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_b: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'alpha', answer: 'answer_b', prompt: 'prompt_b' }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_c: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: 'answer_c', prompt: 'prompt_c' }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_d: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: 'answer_d', prompt: 'prompt_d' }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_e: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: 0 }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_f: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: -0 }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_g: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: false }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_h: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: NaN }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_i: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: null }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_j: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: '' }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
      run_k: {
        [TABLE_NAME]: {
          columns: COLUMNS,
          entries: [{ input: 'question', additionalInput: 'beta', answer: undefined }],
          path: TABLE_NAME,
          rawArtifact: {},
        },
      },
    };

    const getResultsForRuns = (comparedRunUuids: string[], groupByColumns: string[], outputColumn: string) =>
      mountTestComponent({
        artifactsByRun: MOCK_STORE,
        comparedRunUuids,
        groupByColumns,
        outputColumn,
        tableNames: ['/table1'],
      }).getHookResult();

    test('properly groups by a single column having one value', () => {
      const results = getResultsForRuns(
        ['run_a', 'run_b', 'run_c', 'run_e', 'run_f', 'run_g', 'run_h', 'run_i', 'run_j', 'run_k'],
        ['input'],
        'answer',
      );
      expect(results).toHaveLength(1);
      expect(results[0].cellValues?.['run_a']).toEqual('answer_a');
      expect(results[0].cellValues?.['run_b']).toEqual('answer_b');
      expect(results[0].cellValues?.['run_c']).toEqual('answer_c');

      // non-nil and non-strings should get stringified
      expect(results[0].cellValues?.['run_e']).toEqual('0');
      expect(results[0].cellValues?.['run_f']).toEqual('0'); // JSON.stringify(-0) === 0
      expect(results[0].cellValues?.['run_g']).toEqual('false');
      expect(results[0].cellValues?.['run_h']).toEqual('null'); // JSON.stringify(NaN) === 'null'
      expect(results[0].cellValues?.['run_i']).toEqual(null);
      expect(results[0].cellValues?.['run_j']).toEqual('');
      expect(results[0].cellValues?.['run_k']).toEqual(undefined);
    });

    test('properly groups by a single column having distinct values', () => {
      const results = getResultsForRuns(['run_a', 'run_b', 'run_c'], ['additionalInput'], 'answer');
      expect(results).toHaveLength(2);
      const valuesForAlpha = results[0].cellValues;
      const valuesForBeta = results[1].cellValues;
      expect(valuesForAlpha?.['run_a']).toEqual('answer_a');
      expect(valuesForAlpha?.['run_b']).toEqual('answer_b');
      expect(valuesForAlpha?.['run_c']).toBeUndefined();

      expect(valuesForBeta?.['run_a']).toBeUndefined();
      expect(valuesForBeta?.['run_b']).toBeUndefined();
      expect(valuesForBeta?.['run_c']).toEqual('answer_c');
    });

    test('properly groups by a single column having unique value for each run', () => {
      const results = getResultsForRuns(['run_a', 'run_b', 'run_c', 'run_d'], ['answer'], 'answer');
      expect(results).toHaveLength(4);
    });

    test('properly groups by multiple columns having distinct values and proper cell values', () => {
      const results = getResultsForRuns(['run_a', 'run_b', 'run_c', 'run_d'], ['input', 'additionalInput'], 'answer');
      expect(results).toHaveLength(2);

      expect(results[0].groupByCellValues['input']).toEqual('question');
      expect(results[0].groupByCellValues['additionalInput']).toEqual('alpha');

      expect(results[1].groupByCellValues['input']).toEqual('question');
      expect(results[1].groupByCellValues['additionalInput']).toEqual('beta');

      const valuesForAlpha = results[0].cellValues;
      const valuesForBeta = results[1].cellValues;

      expect(valuesForAlpha?.['run_a']).toEqual('answer_a');
      expect(valuesForAlpha?.['run_b']).toEqual('answer_b');
      expect(valuesForAlpha?.['run_c']).toBeUndefined();

      expect(valuesForBeta?.['run_a']).toBeUndefined();
      expect(valuesForBeta?.['run_b']).toBeUndefined();
      expect(valuesForBeta?.['run_c']).toEqual('answer_c');
    });

    test('properly ignores entries yielding empty values in "group by" columns', () => {
      const results = getResultsForRuns(
        ['run_a', 'run_b', 'run_c', 'run_d'],
        ['nonExistingColumn', 'otherNonExistingColumn'],
        'answer',
      );
      expect(results).toHaveLength(0);
    });
  });

  describe('properly pulls and generates data for multiple data tables and columns', () => {
    enum TestColumns {
      StaticData = 'StaticData',
      ValueVaryingPerTable = 'ValueVaryingPerTable',
      ValueVaryingPerRun = 'ValueVaryingPerRun',
      ValueVaryingPerRunAndTable = 'ValueVaryingPerRunAndTable',
    }

    // Prepare ten run UUIDS: run_0, run_1, run_2 etc.
    const RUN_IDS = new Array(10).fill(0).map((_, i) => `run_${i + 1}`);
    const TABLES = ['/table_a', '/table_b', '/table_c'];
    // There are four distinct columns, their purpose is described below
    const MOCK_COLUMNS = [
      TestColumns.StaticData,
      TestColumns.ValueVaryingPerTable,
      TestColumns.ValueVaryingPerRun,
      TestColumns.ValueVaryingPerRunAndTable,
    ];
    const mockedArtifactsByRun = fromPairs(
      RUN_IDS.map((runUuid) => [
        runUuid,
        fromPairs(
          TABLES.map((tableName) => [
            tableName,
            {
              path: tableName,
              columns: MOCK_COLUMNS,
              entries: [
                {
                  // Data assigned to this column will always have the same value
                  [TestColumns.StaticData]: 'static_value',
                  // Data assigned to this column will have data varying by table
                  [TestColumns.ValueVaryingPerTable]: `per_table_value_${tableName}`,
                  // Data assigned to this column will have data varying by run
                  [TestColumns.ValueVaryingPerRun]: `per_run_value_${runUuid}`,
                  // Data assigned to this column will have data varying by both run and table
                  [TestColumns.ValueVaryingPerRunAndTable]: `always_unique_value_${tableName}_${runUuid}`,
                },
              ],
              rawArtifact: {},
            },
          ]),
        ),
      ]),
    );

    test('yields just a single row if the "group by" column always evaluates to a single value', () => {
      // Preparation: we aggregate/group data by the column that always
      // have the same value regardless of the table and run.
      const results = mountTestComponent({
        artifactsByRun: mockedArtifactsByRun,
        comparedRunUuids: RUN_IDS,
        groupByColumns: [TestColumns.StaticData],
        tableNames: TABLES,
        // The output column is not important here
        outputColumn: TestColumns.ValueVaryingPerRunAndTable,
      }).getHookResult();

      // We expect only one row
      expect(results).toHaveLength(1);
    });

    test('yields as many rows as there are tables for the "group by" varying by table', () => {
      const results = mountTestComponent({
        artifactsByRun: mockedArtifactsByRun,
        comparedRunUuids: RUN_IDS,
        groupByColumns: [TestColumns.ValueVaryingPerTable],
        tableNames: TABLES,
        // The output column is not important here
        outputColumn: TestColumns.ValueVaryingPerRunAndTable,
      }).getHookResult();

      // We expect three rows since there are three tables
      expect(results).toHaveLength(3);
    });

    test('yields as many rows as there are runs for the "group by" varying by run', () => {
      const results = mountTestComponent({
        artifactsByRun: mockedArtifactsByRun,
        comparedRunUuids: RUN_IDS,
        groupByColumns: [TestColumns.ValueVaryingPerRun],
        tableNames: TABLES,
        // The output column is not important here
        outputColumn: TestColumns.ValueVaryingPerRunAndTable,
      }).getHookResult();

      // We expect ten rows since there are ten runs
      expect(results).toHaveLength(10);
    });

    test('yields as many rows as there are runs times tables for the "group by" varying by run and by table', () => {
      const results = mountTestComponent({
        artifactsByRun: mockedArtifactsByRun,
        comparedRunUuids: RUN_IDS,
        groupByColumns: [TestColumns.ValueVaryingPerRunAndTable],
        tableNames: TABLES,
        // The output column is not important here
        outputColumn: TestColumns.ValueVaryingPerRunAndTable,
      }).getHookResult();

      // Three tables per ten runs with distinct group values
      expect(results).toHaveLength(30);
    });
  });

  describe('properly displays overlapping and draft data', () => {
    const RUN_IDS = ['run_1'];
    const TABLES = ['/t1', '/t2'];
    const MOCK_COLUMNS = ['colA', 'colB'];
    const mockedArtifactsByRun = {
      run_1: {
        '/t1': {
          path: '/t1',
          columns: MOCK_COLUMNS,
          entries: [
            {
              colA: 'question',
              colB: 'answer_1',
            },
          ],
        },
      },
    } as any;

    it('selects the first valid cell value', () => {
      const mockedDuplicatedArtifactsByRun = {
        run_1: {
          '/t1': {
            path: '/t1',
            columns: MOCK_COLUMNS,
            entries: [
              {
                colA: 'question',
                colB: 'answer_1',
              },
            ],
          },
          '/t2': {
            path: '/t2',
            columns: MOCK_COLUMNS,
            entries: [
              {
                colA: 'question',
                colB: 'answer_2',
              },
            ],
          },
        },
      } as any;

      const results = mountTestComponent({
        artifactsByRun: mockedDuplicatedArtifactsByRun,
        comparedRunUuids: RUN_IDS,
        groupByColumns: ['colA'],
        tableNames: TABLES,
        // The output column is not important here
        outputColumn: 'colB',
      }).getHookResult();

      expect(results).toEqual([
        {
          isPendingInputRow: false,
          cellValues: { run_1: 'answer_1' },
          groupByCellValues: { colA: 'question' },
          key: 'question',
        },
      ]);
    });

    it('correctly overwrites fetched data with the pending data', () => {
      // Given data:
      // - pending evaluation entry with colA set to "question" and colB set to "answer_pending"
      const mockedPendingDataByRun = {
        run_1: [
          {
            isPending: true as const,
            entryData: {
              colA: 'question',
              colB: 'answer_pending',
            },
            evaluationTime: 100,
          },
        ],
      };

      const results = mountTestComponent({
        artifactsByRun: mockedArtifactsByRun,
        pendingDataByRun: mockedPendingDataByRun,
        comparedRunUuids: RUN_IDS,
        groupByColumns: ['colA'],
        tableNames: TABLES,
        outputColumn: 'colB',
      }).getHookResult();

      expect(results).toEqual([
        {
          cellValues: { run_1: 'answer_pending' },
          groupByCellValues: { colA: 'question' },
          key: 'question',
          isPendingInputRow: false,
          outputMetadataByRunUuid: {
            run_1: {
              evaluationTime: 100,
              isPending: true,
            },
          },
        },
      ]);
    });

    it('correctly returns fetched artifact data mixed with the pending data in the draft rows, grouped by single column', () => {
      // Given data:
      // - draft input "draft_question" for "colA"
      // - pending evaluation entry with colA set to "question" and colB set to "answer_pending"
      // - pending evaluation entry with colA set to "draft_question" and colB set to "another_answer_pending"
      const mockedPendingDataByRun = {
        run_1: [
          {
            isPending: true,
            entryData: {
              colA: 'question',
              colB: 'answer_pending',
            },
            evaluationTime: 100,
          },
          {
            isPending: true,
            entryData: {
              colA: 'draft_question',
              colB: 'another_answer_pending',
            },
            evaluationTime: 100,
          },
        ],
      };

      const results = mountTestComponent({
        artifactsByRun: mockedArtifactsByRun,
        pendingDataByRun: mockedPendingDataByRun,
        draftInputValues: [{ colA: 'draft_question' }],
        comparedRunUuids: RUN_IDS,
        groupByColumns: ['colA'],
        tableNames: TABLES,
        outputColumn: 'colB',
      }).getHookResult();

      expect(results).toEqual([
        {
          cellValues: { run_1: 'another_answer_pending' },
          groupByCellValues: {
            colA: 'draft_question',
          },
          isPendingInputRow: true,
          key: 'draft_question',
          outputMetadataByRunUuid: {
            run_1: {
              evaluationTime: 100,
              isPending: true,
            },
          },
        },
        {
          cellValues: { run_1: 'answer_pending' },
          groupByCellValues: { colA: 'question' },
          key: 'question',
          isPendingInputRow: false,
          outputMetadataByRunUuid: {
            run_1: {
              evaluationTime: 100,
              isPending: true,
            },
          },
        },
      ]);
    });

    it('correctly returns fetched artifact data mixed with the pending data in the draft rows', () => {
      // Given data:
      // - draft input "draft_question" for "colA"
      // - pending evaluation entry with colA set to "question" and colB set to "answer_pending"
      const mockedPendingDataByRun = {
        run_1: [
          {
            isPending: true,
            entryData: {
              colA: 'evaluated_with_input_a',
              colB: 'evaluated_with_input_b',
              colC: 'evaluated_output_c',
            },
            evaluationTime: 100,
          },
          {
            isPending: true,
            entryData: {
              colA: 'existing_input_a',
              colB: 'existing_input_b',
              colC: 'evaluated_output_c_for_existing_input',
            },
            evaluationTime: 100,
          },
        ],
      } as any;

      const results = mountTestComponent({
        artifactsByRun: {
          run_1: {
            '/t1': {
              path: '/t1',
              columns: ['colA', 'colB', 'colC'],
              entries: [
                {
                  colA: 'existing_input_a',
                  colB: 'existing_input_b',
                  colC: 'existing_output_c',
                },
                {
                  colA: 'another_existing_input_a',
                  colB: 'another_existing_input_b',
                  colC: 'another_existing_output_c',
                },
              ],
            },
          },
        },
        pendingDataByRun: mockedPendingDataByRun,
        draftInputValues: [
          // An input value set that was not evaluated yet
          { colA: 'not_yet_evaluated_input_a', colB: 'not_yet_evaluated_input_b' },
        ],
        comparedRunUuids: RUN_IDS,
        groupByColumns: ['colA', 'colB'],
        tableNames: ['/t1'],
        outputColumn: 'colC',
      }).getHookResult();

      expect(results).toEqual([
        // Row #1: draft input values, not evaluated yet
        {
          cellValues: {},
          groupByCellValues: {
            colA: 'not_yet_evaluated_input_a',
            colB: 'not_yet_evaluated_input_b',
          },
          isPendingInputRow: true,
          key: 'not_yet_evaluated_input_a.not_yet_evaluated_input_b',
          outputMetadataByRunUuid: undefined,
        },
        // Row #2: a new row with freshly evaluated values but not corresponding to the existing draft row
        {
          cellValues: { run_1: 'evaluated_output_c' },
          groupByCellValues: {
            colA: 'evaluated_with_input_a',
            colB: 'evaluated_with_input_b',
          },
          isPendingInputRow: true,
          key: 'evaluated_with_input_a.evaluated_with_input_b',
          outputMetadataByRunUuid: {
            run_1: {
              evaluationTime: 100,
              isPending: true,
            },
          },
        },
        // Row #3: a pre-existing row (key "question" existing in the original data), containing newly evaluated cells
        {
          cellValues: { run_1: 'evaluated_output_c_for_existing_input' },
          groupByCellValues: {
            colA: 'existing_input_a',
            colB: 'existing_input_b',
          },
          key: 'existing_input_a.existing_input_b',
          isPendingInputRow: false,
          outputMetadataByRunUuid: {
            run_1: {
              evaluationTime: 100,
              isPending: true,
            },
          },
        },
        // Row #4: a pre-existing row (key "question" existing in the original data), untouched by evaluation
        {
          cellValues: {
            run_1: 'another_existing_output_c',
          },
          groupByCellValues: {
            colA: 'another_existing_input_a',
            colB: 'another_existing_input_b',
          },
          isPendingInputRow: false,
          key: 'another_existing_input_a.another_existing_input_b',
          outputMetadataByRunUuid: undefined,
        },
      ]);
    });

    it('correctly returns newly evaluated data with draft rows if user provided data in the other order', () => {
      // Given data:
      // - draft input "bar" for "colB" and "foo" for "colA" (note the order)
      // - table grouped by "colA" and "colB" columns
      // - newly evaluated value "test output" for "colC" matching "colA=foo" and "colB=bar"
      const mockedPendingDataByRun = {
        run_1: [
          {
            isPending: true,
            entryData: {
              colA: 'foo',
              colB: 'bar',
              colC: 'test output',
            },
            evaluationTime: 100,
          },
        ],
      };

      const results = mountTestComponent({
        // Provide draft input values in another order than "group by" columns provided
        draftInputValues: [{ colB: 'bar', colA: 'foo' }],
        groupByColumns: ['colA', 'colB'],

        artifactsByRun: {},
        pendingDataByRun: mockedPendingDataByRun,
        comparedRunUuids: ['run_1'],
        tableNames: [],
        outputColumn: 'colC',
      }).getHookResult();

      // We should get only one row
      expect(results.length).toEqual(1);
      expect(results).toEqual([
        {
          key: 'foo.bar',
          groupByCellValues: { colA: 'foo', colB: 'bar' },
          cellValues: { run_1: 'test output' },
          isPendingInputRow: true,
          outputMetadataByRunUuid: {
            run_1: {
              evaluationTime: 100,
              isPending: true,
            },
          },
        },
      ]);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactTableData.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactTableData.ts
Signals: React, Redux/RTK

```typescript
import { fromPairs, isNil, isObject, isString, sortBy } from 'lodash';
import { useMemo } from 'react';

import type { ArtifactLogTableImageObject, EvaluateCellImage, EvaluationArtifactTableEntry } from '../../../types';
import { PendingEvaluationArtifactTableEntry } from '../../../types';
import type { EvaluationDataReduxState } from '../../../reducers/EvaluationDataReducer';
import { shouldEnablePromptLab } from '../../../../common/utils/FeatureUtils';
import {
  PROMPTLAB_METADATA_COLUMN_LATENCY,
  PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS,
} from '../../prompt-engineering/PromptEngineering.utils';
import { LOG_TABLE_IMAGE_COLUMN_TYPE } from '@mlflow/mlflow/src/experiment-tracking/constants';
import { getArtifactLocationUrl } from '@mlflow/mlflow/src/common/utils/ArtifactUtils';

type ArtifactsByRun = EvaluationDataReduxState['evaluationArtifactsByRunUuid'];
type PendingDataByRun = EvaluationDataReduxState['evaluationPendingDataByRunUuid'];
type DraftInputValues = EvaluationDataReduxState['evaluationDraftInputValues'];

export type UseEvaluationArtifactTableDataResult = {
  // Unique key for every result row
  key: string;

  // Values of "group by" columns. The column name is the key.
  groupByCellValues: Record<string, string>;

  // Values of output columns. The run uuid is the key.
  cellValues: Record<string, string | EvaluateCellImage>;

  // Contains data describing additional metadata for output: evaluation time, total tokens and a flag
  // indicating if the run was evaluated in this session and is unsynced
  outputMetadataByRunUuid?: Record<string, { isPending: boolean; evaluationTime: number; totalTokens?: number }>;

  isPendingInputRow?: boolean;
}[];

const extractGroupByValuesFromEntry = (entry: EvaluationArtifactTableEntry, groupByCols: string[]) => {
  const groupByMappings = groupByCols.map<[string, string]>((groupBy) => {
    const value = entry[groupBy];
    return [groupBy, isString(value) ? value : JSON.stringify(value)];
  });

  // Next, let's calculate a unique hash for values of those columns - it will serve as
  // an identifier of each result row.
  const groupByHashKey = groupByMappings.map(([, keyValue]) => String(keyValue)).join('.');

  return { key: groupByHashKey, groupByValues: fromPairs(groupByMappings) };
};

/**
 * Consumes table artifact data and based on provided dimensions,
 * generates the data ready to be displayed in the comparison data grid.
 *
 * @param artifactsByRun artifacts-by-run data (extracted from the redux store)
 * @param comparedRunsUuids UUIDs of runs we want to compare
 * @param tableNames table names we want to include in the comparison
 * @param groupByCols list of columns that will be used to group the results by
 * @param outputColumn selects the column to be displayed in the run
 */
export const useEvaluationArtifactTableData = (
  artifactsByRun: ArtifactsByRun,
  pendingDataByRun: PendingDataByRun,
  draftInputValues: DraftInputValues,
  comparedRunsUuids: string[],
  tableNames: string[],
  groupByCols: string[],
  outputColumn: string,
): UseEvaluationArtifactTableDataResult =>
  // eslint-disable-next-line complexity
  useMemo(() => {
    /**
     * End results, i.e. table rows
     */
    const results: UseEvaluationArtifactTableDataResult = [];

    /**
     * An aggregate object containing all output column values.
     * The first level key is the combined hash of all group by values,
     * the second level key is the run UUID. A leaf of this tree corresponds to the output cell value.
     */
    const outputCellsValueMap: Record<string, Record<string, any>> = {};

    /**
     * An aggregate object containing values of the "group by" columns.
     * The first level key is the combined hash of all group by values,
     * the second level key is the "group by" column name. A leaf of this tree corresponds to the cell value.
     */
    const groupByCellsValueMap: Record<string, Record<string, any>> = {};

    /**
     * This array contains all "group by" keys that were freshly added or evaluated, i.e. they are not found
     * in the original evaluation data. This helps to identify them, place them on the top and indicate
     * they're yet to be synchronized.
     */
    const pendingRowKeys: string[] = [];

    /**
     * Start with populating the table with the draft rows created from the draft input sets
     */
    for (const draftInputValueSet of draftInputValues) {
      const visibleGroupByValues = groupByCols.map((colName) => [colName, draftInputValueSet[colName]]);

      const draftInputRowKey = visibleGroupByValues.map(([, value]) => value).join('.');

      // Register new "group by" values combination and mark it as an artificial row
      groupByCellsValueMap[draftInputRowKey] = fromPairs(visibleGroupByValues);
      pendingRowKeys.push(draftInputRowKey);
    }

    const outputMetadataByCellsValueMap: Record<
      string,
      Record<string, { isPending: boolean; evaluationTime: number; totalTokens?: number }>
    > = {};

    // Search through artifact tables and get all entries corresponding to a particular run
    const runsWithEntries = comparedRunsUuids.map<[string, EvaluationArtifactTableEntry[]]>((runUuid) => {
      const baseEntries = Object.values(artifactsByRun[runUuid] || {})
        .filter(({ path }) => tableNames.includes(path))
        .map(({ entries }) => entries)
        .flat();
      return [runUuid, baseEntries];
    });

    // Iterate through all entries and assign them to the corresponding groups.
    for (const [runUuid, entries] of runsWithEntries) {
      for (const entry of entries) {
        const { key, groupByValues } = extractGroupByValuesFromEntry(entry, groupByCols);

        // Do not process the entry that have empty values for all active "group by" columns
        if (Object.values(groupByValues).every((value) => !value)) {
          continue;
        }

        // Assign "group by" column cell values
        if (!groupByCellsValueMap[key]) {
          groupByCellsValueMap[key] = groupByValues;
        }

        // Check if there are values in promptlab metadata columns
        if (entry[PROMPTLAB_METADATA_COLUMN_LATENCY] || entry[PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS]) {
          if (!outputMetadataByCellsValueMap[key]) {
            outputMetadataByCellsValueMap[key] = {};
          }

          // If true, save it to the record containing output metadata at the index
          // corresponding to a current "group by" key (row) and the run uuid (column)
          // Show the metadata of the most recent value
          if (!outputMetadataByCellsValueMap[key][runUuid]) {
            outputMetadataByCellsValueMap[key][runUuid] = {
              isPending: false,
              evaluationTime: parseFloat(entry[PROMPTLAB_METADATA_COLUMN_LATENCY]),
              totalTokens: entry[PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS]
                ? parseInt(entry[PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS], 10)
                : undefined,
            };
          }
        }

        // Assign output column cell values
        if (!outputCellsValueMap[key]) {
          outputCellsValueMap[key] = {};
        }

        const cellsEntry = outputCellsValueMap[key];

        // Use the data from the other set if present, but only if there
        // is no value assigned already. This way we will proritize prepended values.
        cellsEntry[runUuid] = cellsEntry[runUuid] || entry[outputColumn];
      }
    }

    for (const [runUuid, pendingEntries] of Object.entries(pendingDataByRun)) {
      for (const pendingEntry of pendingEntries) {
        const { entryData, ...metadata } = pendingEntry;
        const { key, groupByValues } = extractGroupByValuesFromEntry(entryData, groupByCols);

        // Do not process the entry that have empty values for all active "group by" columns
        if (Object.values(groupByValues).every((value) => !value)) {
          continue;
        }

        // Assign "group by" column cell values
        if (!groupByCellsValueMap[key]) {
          groupByCellsValueMap[key] = groupByValues;

          // If the key was not found in the original set, mark entire row as pending
          pendingRowKeys.push(key);
        }

        if (!outputMetadataByCellsValueMap[key]) {
          outputMetadataByCellsValueMap[key] = {};
        }

        // code pointer for where the metadat is stored
        outputMetadataByCellsValueMap[key][runUuid] = metadata;

        // Assign output column cell values
        if (!outputCellsValueMap[key]) {
          outputCellsValueMap[key] = {};
        }

        const cellsEntry = outputCellsValueMap[key];
        // Use pending data to overwrite already existing result
        cellsEntry[runUuid] = entryData[outputColumn] || cellsEntry[runUuid];
      }
    }

    /**
     * Extract all "group by" keys, i.e. effectively row keys.
     * Hoist all rows that were created during the pending evaluation to the top.
     */
    const allRowKeys = sortBy(Object.entries(groupByCellsValueMap), ([key]) => !pendingRowKeys.includes(key));

    // In the final step, iterate through all found combinations of "group by" values and
    // assign the cells
    for (const [key, groupByCellValues] of allRowKeys) {
      const existingTableRow = results.find(({ key: existingKey }) => key === existingKey);
      if (existingTableRow && outputCellsValueMap[key]) {
        existingTableRow.cellValues = outputCellsValueMap[key];
        existingTableRow.outputMetadataByRunUuid = outputMetadataByCellsValueMap[key];
      } else {
        const cellsEntry = outputCellsValueMap[key];
        Object.keys(cellsEntry || {}).forEach((runUuid: string) => {
          if (cellsEntry[runUuid] !== null && typeof cellsEntry[runUuid] === 'object') {
            try {
              const { type, filepath, compressed_filepath } = cellsEntry[runUuid] as ArtifactLogTableImageObject;
              if (type === LOG_TABLE_IMAGE_COLUMN_TYPE) {
                cellsEntry[runUuid] = {
                  url: getArtifactLocationUrl(filepath, runUuid),
                  compressed_url: getArtifactLocationUrl(compressed_filepath, runUuid),
                };
              } else {
                cellsEntry[runUuid] = JSON.stringify(cellsEntry[runUuid]);
              }
            } catch {
              cellsEntry[runUuid] = '';
            }
          } else if (!isNil(cellsEntry[runUuid]) && !isString(cellsEntry[runUuid])) {
            // stringify non-empty values so that the value
            // doesn't appear as (empty) in the output cell
            // also don't stringify strings, since they'll have
            // an extra quote around them
            cellsEntry[runUuid] = JSON.stringify(cellsEntry[runUuid]);
          }
        });

        results.push({
          key,
          groupByCellValues,
          cellValues: outputCellsValueMap[key] || {},
          outputMetadataByRunUuid: outputMetadataByCellsValueMap[key],
          isPendingInputRow: pendingRowKeys.includes(key),
        });
      }
    }

    return results;
  }, [comparedRunsUuids, artifactsByRun, groupByCols, draftInputValues, tableNames, outputColumn, pendingDataByRun]);
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactTables.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactTables.enzyme.test.tsx

```typescript
import { describe, it, expect, jest } from '@jest/globals';
import { mount } from 'enzyme';
import { useEvaluationArtifactTables } from './useEvaluationArtifactTables';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { MLFLOW_LOGGED_ARTIFACTS_TAG } from '../../../constants';

describe('useEvaluationArtifactTables', () => {
  const mountTestComponent = (comparedRuns: RunRowType[]) => {
    let hookResult: ReturnType<typeof useEvaluationArtifactTables>;
    const TestComponent = () => {
      hookResult = useEvaluationArtifactTables(comparedRuns);

      return null;
    };

    const wrapper = mount(<TestComponent />);

    return { wrapper, getHookResult: () => hookResult };
  };

  const tagDeclarationAlphaBetaGamma = JSON.stringify([
    { type: 'table', path: '/table_alpha.json' },
    { type: 'table', path: '/table_beta.json' },
    { type: 'table', path: '/table_gamma.json' },
  ]);

  const tagDeclarationAlphaBeta = JSON.stringify([
    { type: 'table', path: '/table_alpha.json' },
    { type: 'table', path: '/table_beta.json' },
  ]);

  const tagDeclarationBeta = JSON.stringify([{ type: 'table', path: '/table_beta.json' }]);
  const tagDeclarationGamma = JSON.stringify([{ type: 'table', path: '/table_gamma.json' }]);

  const createMockRun = (runUuid: string, artifactsDeclaration: string): RunRowType =>
    ({
      runUuid,
      tags: {
        [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
          key: MLFLOW_LOGGED_ARTIFACTS_TAG,
          value: artifactsDeclaration,
        },
      },
    } as any);

  it('properly extracts all table names for a set of runs with all tables', () => {
    const { getHookResult } = mountTestComponent([
      createMockRun('run_1', tagDeclarationAlphaBeta),
      createMockRun('run_2', tagDeclarationGamma),
    ]);

    expect(getHookResult().tables).toEqual(
      expect.arrayContaining(['/table_alpha.json', '/table_beta.json', '/table_gamma.json']),
    );
  });

  it('properly extracts all table names for a set of runs with some tables', () => {
    const { getHookResult } = mountTestComponent([createMockRun('run_1', tagDeclarationAlphaBeta)]);

    expect(getHookResult().tables).toEqual(['/table_alpha.json', '/table_beta.json']);
  });

  it('behaves correctly when where there are no tables reported', () => {
    const { getHookResult } = mountTestComponent([createMockRun('run_1', '[]')]);

    expect(getHookResult().tables).toEqual([]);
  });

  it('properly extracts intersection of table names for a set of runs with single common table', () => {
    const { getHookResult } = mountTestComponent([
      createMockRun('run_1', tagDeclarationAlphaBeta),
      createMockRun('run_2', tagDeclarationBeta),
    ]);

    expect(getHookResult().tablesIntersection).toEqual(['/table_beta.json']);
  });

  it('properly extracts intersection of table names for a set of runs with multiple common tables', () => {
    const { getHookResult } = mountTestComponent([
      createMockRun('run_1', tagDeclarationAlphaBeta),
      createMockRun('run_2', tagDeclarationAlphaBetaGamma),
    ]);

    expect(getHookResult().tablesIntersection).toEqual(['/table_alpha.json', '/table_beta.json']);
  });

  it('properly returns empty intersection of table names for a set of runs with no common tables', () => {
    const { getHookResult } = mountTestComponent([
      createMockRun('run_1', tagDeclarationAlphaBeta),
      createMockRun('run_2', tagDeclarationGamma),
    ]);

    expect(getHookResult().tablesIntersection).toEqual([]);
  });

  it('ignores runs with no table artifact metadata', () => {
    const { getHookResult } = mountTestComponent([
      {
        runUuid: 'run_empty',
        tags: {
          something: {
            key: 'something',
            value: 'something-something',
          },
        },
      } as any,
      createMockRun('run_1', tagDeclarationBeta),
    ]);

    expect(getHookResult().tablesByRun).toEqual({
      run_1: ['/table_beta.json'],
    });
  });

  it('ignores runs with no artifact not being tables', () => {
    const { getHookResult } = mountTestComponent([
      {
        runUuid: 'run_empty',
        tags: {
          [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
            key: MLFLOW_LOGGED_ARTIFACTS_TAG,
            value: '[{"type":"unknownType","path":"/file.json"}]',
          },
        },
      } as any,
      createMockRun('run_1', tagDeclarationBeta),
    ]);

    expect(getHookResult().tablesByRun).toEqual({
      run_1: ['/table_beta.json'],
    });
  });

  it('ignores runs with duplicated reported artifact tables', () => {
    const { getHookResult } = mountTestComponent([
      {
        runUuid: 'run_1',
        tags: {
          [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
            key: MLFLOW_LOGGED_ARTIFACTS_TAG,
            value: '[{"type":"table","path":"/table1.json"},{"type":"table","path":"/table1.json"}]',
          },
        },
      } as any,
    ]);

    expect(getHookResult().tablesByRun).toEqual({
      run_1: ['/table1.json'],
    });
  });

  it('throw an error when the declaration tag JSON is malformed', async () => {
    // Suppress console.error() since we're asserting exception
    // and want to keep the terminal clean
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    const mountInvalidComponent = () =>
      mountTestComponent([
        {
          runUuid: 'run_empty',
          tags: {
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[[malformedData[[[[[{{',
            },
          },
        } as any,
        createMockRun('run_1', tagDeclarationBeta),
      ]);

    expect(mountInvalidComponent).toThrow(SyntaxError);

    spy.mockRestore();
  });
});
```

--------------------------------------------------------------------------------

````

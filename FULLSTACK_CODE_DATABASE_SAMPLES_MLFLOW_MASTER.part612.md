---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 612
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 612 of 991)

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

---[FILE: GenAiTracesTableBody.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAiTracesTableBody.utils.tsx

```typescript
import type { ColumnDef } from '@tanstack/react-table';
import { isNil } from 'lodash';

import type { ThemeType } from '@databricks/design-system';
import { Tooltip } from '@databricks/design-system';
import type { IntlShape } from '@databricks/i18n';

import { traceInfoSortingFn } from './GenAiTracesTable.utils';
import {
  assessmentCellRenderer,
  expectationCellRenderer,
  inputColumnCellRenderer,
  traceInfoCellRenderer,
} from './cellRenderers/rendererFunctions';
import {
  getEvaluationResultAssessmentValue,
  KnownEvaluationResultAssessmentStringValue,
  stringifyValue,
} from './components/GenAiEvaluationTracesReview.utils';
import { RESPONSE_COLUMN_ID } from './hooks/useTableColumns';
import { TracesTableColumnType } from './types';
import type {
  AssessmentValueType,
  EvalTraceComparisonEntry,
  TracesTableColumn,
  AssessmentInfo,
  RunEvaluationResultAssessment,
} from './types';
import { timeSinceStr } from './utils/DisplayUtils';
import type { ModelTraceInfoV3 } from '../model-trace-explorer';

const DEFAULT_ASSESSMENT_CELL_WIDTH_PX = 120;
const DEFAULT_ASSESSMENTS_CELL_WIDTH_COMPARE_PX = 120;
const MAX_ASSESSMENT_COLUMN_SIZE = 200;
const DEFAULT_INPUT_COLUMNS_TOTAL_WIDTH_PX = 300;

export function compareAssessmentValues(
  assessmentInfo: AssessmentInfo,
  a: AssessmentValueType,
  b: AssessmentValueType,
): 'greater' | 'less' | 'equal' {
  if (assessmentInfo.dtype === 'pass-fail') {
    if (a === b) {
      return 'equal';
    }
    if (a === KnownEvaluationResultAssessmentStringValue.YES) {
      return 'greater';
    } else if (a === KnownEvaluationResultAssessmentStringValue.NO) {
      return 'less';
    } else {
      return !isNil(b) ? 'less' : 'equal';
    }
  } else if (assessmentInfo.dtype === 'boolean') {
    if (a === b) {
      return 'equal';
    }
    if (a === true) {
      return 'greater';
    } else if (a === false) {
      return 'less';
    } else {
      return !isNil(b) ? 'less' : 'equal';
    }
  } else if (assessmentInfo.dtype === 'string') {
    // Compare the strings in alphabetical sort order.
    if (a === b) {
      return 'equal';
    }
    if (a === null) {
      return 'less';
    }
    if (b === null) {
      return 'greater';
    }
    const aString = a as string | undefined;
    const bString = b as string | undefined;
    if (isNil(aString)) {
      return 'less';
    } else if (isNil(bString)) {
      return 'greater';
    }
    return aString.toString().localeCompare(bString.toString()) === 1 ? 'greater' : 'less';
  } else if (assessmentInfo.dtype === 'numeric') {
    if (a === b) {
      return 'equal';
    }
    if (a === null) {
      return 'less';
    }
    if (b === null) {
      return 'greater';
    }
    const aNumber = a as number;
    const bNumber = b as number;
    return aNumber > bNumber ? 'greater' : 'less';
  }

  return 'equal';
}

export const formatResponseTitle = (outputs: string) => {
  let outputsTitle = outputs;

  try {
    const parsedOutputs = JSON.parse(outputs);

    // Try to parse OpenAI messages
    const choices = parsedOutputs['response']['choices'];
    if (Array.isArray(choices) && !isNil(choices[0]?.message?.content)) {
      outputsTitle = choices[0]?.message?.content;
    } else {
      outputsTitle = stringifyValue(outputs);
    }
  } catch {
    outputsTitle = stringifyValue(outputs);
  }

  return outputsTitle;
};

export const getColumnConfig = (
  col: TracesTableColumn,
  {
    evaluationInputs,
    isComparing,
    theme,
    intl,
    experimentId,
    onChangeEvaluationId,
    onTraceTagsEdit,
  }: {
    evaluationInputs: TracesTableColumn[];
    isComparing: boolean;
    theme: ThemeType;
    intl: IntlShape;
    experimentId: string;
    onChangeEvaluationId: (evaluationId: string | undefined) => void;
    onTraceTagsEdit?: (trace: ModelTraceInfoV3) => void;
  },
): ColumnDef<EvalTraceComparisonEntry> => {
  const baseColConfig: ColumnDef<EvalTraceComparisonEntry> = {
    header: col.label,
    id: col.id,
    accessorFn: (originalRow) => originalRow,
  };

  switch (col.type) {
    case TracesTableColumnType.INPUT:
      return {
        ...baseColConfig,
        sortingFn: (a, b) => {
          const aValue = a.getValue(col.id) as EvalTraceComparisonEntry;
          const bValue = b.getValue(col.id) as EvalTraceComparisonEntry;
          const aSortValue = {
            request: aValue.currentRunValue?.inputs[col.id] || aValue.otherRunValue?.inputs[col.id] || '',
            evalId: aValue.currentRunValue?.evaluationId || aValue.otherRunValue?.evaluationId || '',
          };
          const bSortValue = {
            request: bValue.currentRunValue?.inputs[col.id] || bValue.otherRunValue?.inputs[col.id] || '',
            evalId: bValue.currentRunValue?.evaluationId || bValue.otherRunValue?.evaluationId || '',
          };

          return JSON.stringify(aSortValue).localeCompare(JSON.stringify(bSortValue));
        },
        size: DEFAULT_INPUT_COLUMNS_TOTAL_WIDTH_PX / evaluationInputs.length,
        minSize: 120,
        cell: (cell) =>
          inputColumnCellRenderer(
            onChangeEvaluationId,
            cell,
            isComparing,
            theme,
            col.id,
            (cell?.table?.options?.meta as any)?.getRunColor,
          ),
      };
    case TracesTableColumnType.ASSESSMENT:
      return {
        ...baseColConfig,
        accessorFn: (originalRow) => {
          return { isComparing, assessmentInfo: col.assessmentInfo, comparisonEntry: originalRow };
        },
        sortingFn: (a, b) => {
          const { comparisonEntry: aValue } = a.getValue(col.id) as {
            comparisonEntry: EvalTraceComparisonEntry;
          };
          const { comparisonEntry: bValue } = b.getValue(col.id) as {
            comparisonEntry: EvalTraceComparisonEntry;
          };
          if (col.assessmentInfo) {
            const aAssessment = {
              currentValue: aValue.currentRunValue?.responseAssessmentsByName[col.assessmentInfo.name]?.[0],
              otherValue: aValue.otherRunValue?.responseAssessmentsByName[col.assessmentInfo.name]?.[0],
            };
            const bAssessment = {
              currentValue: bValue.currentRunValue?.responseAssessmentsByName[col.assessmentInfo.name]?.[0],
              otherValue: bValue.otherRunValue?.responseAssessmentsByName[col.assessmentInfo.name]?.[0],
            };
            return sortCompareAssessments(col.assessmentInfo, aAssessment, bAssessment);
          }
          return 0;
        },
        maxSize: MAX_ASSESSMENT_COLUMN_SIZE,
        size: isComparing ? DEFAULT_ASSESSMENTS_CELL_WIDTH_COMPARE_PX : DEFAULT_ASSESSMENT_CELL_WIDTH_PX,
        minSize: isComparing ? DEFAULT_ASSESSMENTS_CELL_WIDTH_COMPARE_PX : DEFAULT_ASSESSMENT_CELL_WIDTH_PX,
        cell: (cell) => {
          const { isComparing, assessmentInfo, comparisonEntry } = cell.getValue() as {
            isComparing: boolean;
            assessmentInfo: AssessmentInfo;
            comparisonEntry: EvalTraceComparisonEntry;
          };
          return assessmentCellRenderer(theme, intl, isComparing, assessmentInfo, comparisonEntry);
        },
      };
    case TracesTableColumnType.EXPECTATION:
      return {
        ...baseColConfig,
        accessorFn: (originalRow) => {
          return { isComparing, expectationName: col.expectationName, comparisonEntry: originalRow };
        },
        maxSize: MAX_ASSESSMENT_COLUMN_SIZE,
        size: isComparing ? DEFAULT_ASSESSMENTS_CELL_WIDTH_COMPARE_PX : DEFAULT_ASSESSMENT_CELL_WIDTH_PX,
        minSize: isComparing ? DEFAULT_ASSESSMENTS_CELL_WIDTH_COMPARE_PX : DEFAULT_ASSESSMENT_CELL_WIDTH_PX,
        cell: (cell) => {
          const { isComparing, expectationName, comparisonEntry } = cell.getValue() as {
            isComparing: boolean;
            expectationName: string;
            comparisonEntry: EvalTraceComparisonEntry;
          };
          return expectationCellRenderer(theme, intl, isComparing, expectationName, comparisonEntry);
        },
      };
    case TracesTableColumnType.TRACE_INFO:
      return {
        ...baseColConfig,
        accessorFn: (originalRow) => {
          return { isComparing, comparisonEntry: originalRow };
        },
        sortingFn: (a, b) => {
          const { comparisonEntry: aValue } = a.getValue(col.id) as {
            comparisonEntry: EvalTraceComparisonEntry;
          };
          const { comparisonEntry: bValue } = b.getValue(col.id) as {
            comparisonEntry: EvalTraceComparisonEntry;
          };

          return traceInfoSortingFn(aValue?.currentRunValue?.traceInfo, bValue?.currentRunValue?.traceInfo, col.id);
        },
        size: col.id === RESPONSE_COLUMN_ID ? 300 : 100,
        minSize: col.id === RESPONSE_COLUMN_ID ? 120 : 100,
        cell: (cell) => {
          const { isComparing, comparisonEntry } = cell.getValue() as {
            isComparing: boolean;
            comparisonEntry: EvalTraceComparisonEntry;
          };

          return traceInfoCellRenderer(
            experimentId,
            isComparing,
            col.id,
            comparisonEntry,
            onChangeEvaluationId,
            intl,
            theme,
            onTraceTagsEdit,
          );
        },
      };
    case TracesTableColumnType.INTERNAL_MONITOR_REQUEST_TIME:
      return {
        ...baseColConfig,
        accessorFn: (originalRow) => originalRow.currentRunValue?.requestTime,
        sortingFn: (a, b) => {
          const aValue = a.getValue(col.id);
          const bValue = b.getValue(col.id);
          return JSON.stringify(aValue).localeCompare(JSON.stringify(bValue));
        },
        size: 100,
        minSize: 100,
        cell: (cell) => {
          const requestTime = cell.getValue() as string | undefined;
          if (!requestTime) {
            return null;
          }
          const date = new Date(requestTime);
          return (
            <Tooltip
              componentId="mlflow.experiment-evaluation-monitoring.trace-info-hover-request-time"
              content={date.toLocaleString(navigator.language, { timeZoneName: 'short' })}
            >
              <span>{timeSinceStr(date)}</span>
            </Tooltip>
          );
        },
      };
    default:
      return baseColConfig;
  }
};

export function sortCompareAssessments(
  assessmentInfo: AssessmentInfo,
  a: {
    currentValue?: RunEvaluationResultAssessment;
    otherValue?: RunEvaluationResultAssessment;
  },
  b: {
    currentValue?: RunEvaluationResultAssessment;
    otherValue?: RunEvaluationResultAssessment;
  },
) {
  const aCurrentValue = a.currentValue ? getEvaluationResultAssessmentValue(a.currentValue) : undefined;
  const bCurrentValue = b.currentValue ? getEvaluationResultAssessmentValue(b.currentValue) : undefined;
  const aOtherValue = a.otherValue ? getEvaluationResultAssessmentValue(a.otherValue) : undefined;
  const bOtherValue = b.otherValue ? getEvaluationResultAssessmentValue(b.otherValue) : undefined;

  if (assessmentInfo.dtype === 'pass-fail') {
    // Priorities:
    // Pass => Fail
    // Fail
    // Fail => Pass
    // Pass
    const aIsPassToFail =
      aOtherValue === KnownEvaluationResultAssessmentStringValue.YES &&
      aCurrentValue === KnownEvaluationResultAssessmentStringValue.NO;
    const bIsPassToFail =
      bOtherValue === KnownEvaluationResultAssessmentStringValue.YES &&
      bCurrentValue === KnownEvaluationResultAssessmentStringValue.NO;
    const aIsFailToPass =
      aOtherValue === KnownEvaluationResultAssessmentStringValue.NO &&
      aCurrentValue === KnownEvaluationResultAssessmentStringValue.YES;
    const bIsFailToPass =
      bOtherValue === KnownEvaluationResultAssessmentStringValue.NO &&
      bCurrentValue === KnownEvaluationResultAssessmentStringValue.YES;
    const aIsFailToFail =
      aOtherValue === KnownEvaluationResultAssessmentStringValue.NO &&
      aCurrentValue === KnownEvaluationResultAssessmentStringValue.NO;
    const bIsFailToFail =
      bOtherValue === KnownEvaluationResultAssessmentStringValue.NO &&
      bCurrentValue === KnownEvaluationResultAssessmentStringValue.NO;
    const aIsPassToPass =
      aOtherValue === KnownEvaluationResultAssessmentStringValue.YES &&
      aCurrentValue === KnownEvaluationResultAssessmentStringValue.YES;
    const bIsPassToPass =
      bOtherValue === KnownEvaluationResultAssessmentStringValue.YES &&
      bCurrentValue === KnownEvaluationResultAssessmentStringValue.YES;

    // Sort according to priority
    if (aIsPassToFail && !bIsPassToFail) return -1;
    if (!aIsPassToFail && bIsPassToFail) return 1;

    if (aIsFailToFail && !bIsFailToFail) return -1;
    if (!aIsFailToFail && bIsFailToFail) return 1;

    if (aIsFailToPass && !bIsFailToPass) return -1;
    if (!aIsFailToPass && bIsFailToPass) return 1;

    if (aIsPassToPass && !bIsPassToPass) return -1;
    if (!aIsPassToPass && bIsPassToPass) return 1;

    return sortPassFailAssessments(a.currentValue, b.currentValue);
  } else {
    if (aCurrentValue === bCurrentValue) {
      return 0;
    }
    if (!isNil(aCurrentValue) && !isNil(bCurrentValue)) {
      return aCurrentValue > bCurrentValue ? 1 : -1;
    } else {
      return isNil(aCurrentValue) ? -1 : 1;
    }
  }
}

function sortPassFailAssessments(a?: RunEvaluationResultAssessment, b?: RunEvaluationResultAssessment) {
  if (!a && b) {
    return 1;
  } else if (a && !b) {
    return -1;
  }
  if (!a || !b) {
    return 0;
  }

  const aIsPassing =
    a.stringValue === KnownEvaluationResultAssessmentStringValue.YES
      ? true
      : a.stringValue === KnownEvaluationResultAssessmentStringValue.NO
      ? false
      : undefined;
  const bIsPassing =
    b.stringValue === KnownEvaluationResultAssessmentStringValue.YES
      ? true
      : b.stringValue === KnownEvaluationResultAssessmentStringValue.NO
      ? false
      : undefined;

  if (aIsPassing === bIsPassing) {
    return 0;
  }
  // Null values get sorted last.
  if (aIsPassing === undefined) {
    return 1;
  }
  if (bIsPassing === undefined) {
    return -1;
  }
  return aIsPassing ? 1 : -1;
}
```

--------------------------------------------------------------------------------

---[FILE: GenAITracesTableBodyContainer.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAITracesTableBodyContainer.intg.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, expect, it } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import { GenAITracesTableBodyContainer } from './GenAITracesTableBodyContainer';
// eslint-disable-next-line import/no-namespace
import * as GenAiTracesTableUtils from './GenAiTracesTable.utils';
import { createTestTraceInfoV3, createTestAssessmentInfo, createTestColumns } from './index';
import { TestRouter, testRoute } from './utils/RoutingTestUtils';
import type { ModelTraceInfoV3 } from '../model-trace-explorer';

// Mock the virtualizer to render all rows in tests
jest.mock('@tanstack/react-virtual', () => {
  const actual = jest.requireActual<typeof import('@tanstack/react-virtual')>('@tanstack/react-virtual');
  return {
    ...actual,
    useVirtualizer: (opts: any) => {
      return {
        getVirtualItems: () =>
          Array.from({ length: opts.count }, (_, i) => ({
            index: i,
            key: i,
            start: i * 120,
            size: 120,
            measureElement: () => {},
          })),
        getTotalSize: () => opts.count * 120,
        measureElement: () => {},
      };
    },
  };
});

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(30000);

// Mock necessary modules
jest.mock('@databricks/web-shared/global-settings', () => ({
  getUser: jest.fn(),
}));

jest.mock('@databricks/web-shared/hooks', () => {
  return {
    ...jest.requireActual<typeof import('@databricks/web-shared/hooks')>('@databricks/web-shared/hooks'),
    getLocalStorageItemByParams: jest.fn().mockReturnValue({ hiddenColumns: undefined }),
    useLocalStorage: jest.fn().mockReturnValue([{}, jest.fn()]),
  };
});

const testExperimentId = 'test-experiment-id';
const testRunUuid = 'test-run-uuid';
const testCompareToRunUuid = 'compare-run-uuid';

describe('GenAITracesTableBodyContainer - integration test', () => {
  beforeEach(() => {
    // Mock user ID
    jest.mocked(getUser).mockImplementation(() => 'test.user@mlflow.org');

    // Mocked returned timestamp
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const waitForViewToBeReady = () =>
    waitFor(() => {
      expect(screen.getByText(/Request/)).toBeInTheDocument();
    });

  const renderTestComponent = (
    currentTraceInfoV3: ModelTraceInfoV3[],
    compareToTraceInfoV3: ModelTraceInfoV3[] = [],
    additionalProps: Partial<ComponentProps<typeof GenAITracesTableBodyContainer>> = {},
  ) => {
    const defaultAssessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
      createTestAssessmentInfo('is_correct', 'Is Correct', 'boolean'),
    ];

    const defaultColumns = createTestColumns(defaultAssessmentInfos);

    const defaultProps: ComponentProps<typeof GenAITracesTableBodyContainer> = {
      experimentId: testExperimentId,
      currentRunDisplayName: 'Test Run',
      runUuid: testRunUuid,
      compareToRunUuid: testCompareToRunUuid,
      compareToRunDisplayName: 'Compare Run',
      assessmentInfos: defaultAssessmentInfos,
      currentTraceInfoV3,
      compareToTraceInfoV3,
      selectedColumns: defaultColumns,
      allColumns: defaultColumns,
      tableSort: undefined,
      filters: [],
      setFilters: jest.fn(),
      getTrace: jest
        .fn<ComponentProps<typeof GenAITracesTableBodyContainer>['getTrace']>()
        .mockResolvedValue(undefined),
      getRunColor: jest
        .fn<NonNullable<ComponentProps<typeof GenAITracesTableBodyContainer>['getRunColor']>>()
        .mockReturnValue('#000000'),
      ...additionalProps,
    };

    const TestComponent = () => {
      return (
        <TestRouter
          routes={[
            testRoute(
              <DesignSystemProvider>
                <QueryClientProvider
                  client={
                    new QueryClient({
                      logger: {
                        error: () => {},
                        log: () => {},
                        warn: () => {},
                      },
                    })
                  }
                >
                  <GenAITracesTableBodyContainer {...defaultProps} />
                </QueryClientProvider>
              </DesignSystemProvider>,
            ),
          ]}
        />
      );
    };

    return render(
      <IntlProvider locale="en">
        <TestComponent />
      </IntlProvider>,
    );
  };

  it('renders table with single trace', async () => {
    const traceInfo = createTestTraceInfoV3(
      'trace-1',
      'request-1',
      'Hello world',
      [
        { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
        { name: 'quality_score', value: 0.85, dtype: 'numeric' },
      ],
      testExperimentId,
    );

    renderTestComponent([traceInfo]);

    await waitForViewToBeReady();

    // Verify basic table structure is rendered
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('trace-1')).toBeInTheDocument();
  });

  it('renders table with multiple traces', async () => {
    const traceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world 1',
        [{ name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' }],
        testExperimentId,
      ),
      createTestTraceInfoV3(
        'trace-2',
        'request-2',
        'Hello world 2',
        [{ name: 'overall_assessment', value: 'no', dtype: 'pass-fail' }],
        testExperimentId,
      ),
    ];

    renderTestComponent(traceInfos);

    await waitForViewToBeReady();

    // Verify both traces are rendered
    expect(screen.getByText('Hello world 1')).toBeInTheDocument();
    expect(screen.getByText('Hello world 2')).toBeInTheDocument();
    expect(screen.getByText('trace-1')).toBeInTheDocument();
    expect(screen.getByText('trace-2')).toBeInTheDocument();
  });

  it('renders table with comparison data', async () => {
    const currentTraceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world',
        [
          { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.85, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
    ];

    const compareToTraceInfos = [
      createTestTraceInfoV3(
        'trace-2',
        'request-2',
        'Hello world compare',
        [
          { name: 'overall_assessment', value: 'no', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.75, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
    ];

    renderTestComponent(currentTraceInfos, compareToTraceInfos);

    await waitForViewToBeReady();

    // Verify both current and comparison data are rendered
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Hello world compare')).toBeInTheDocument();
  });

  it('handles different assessment data types', async () => {
    const traceInfo = createTestTraceInfoV3(
      'trace-1',
      'request-1',
      'Hello world',
      [
        { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
        { name: 'quality_score', value: 0.85, dtype: 'numeric' },
        { name: 'is_correct', value: true, dtype: 'boolean' },
        { name: 'description', value: 'Good response', dtype: 'string' },
      ],
      testExperimentId,
    );

    const assessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
      createTestAssessmentInfo('is_correct', 'Is Correct', 'boolean'),
      createTestAssessmentInfo('description', 'Description', 'string'),
    ];

    const columns = createTestColumns(assessmentInfos);

    renderTestComponent([traceInfo], [], {
      assessmentInfos,
      selectedColumns: columns,
      allColumns: columns,
    });

    await waitForViewToBeReady();

    // Verify different assessment types are rendered
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('trace-1')).toBeInTheDocument();

    // Verify assessment data is present with correct display values
    expect(screen.getByText('Pass')).toBeInTheDocument(); // overall_assessment value (yes -> Pass)
    expect(screen.getByText('0.85')).toBeInTheDocument(); // quality_score value
    expect(screen.getByText('True')).toBeInTheDocument(); // is_correct value (true -> True)
    expect(screen.getByText('Good response')).toBeInTheDocument(); // description value
  });

  it('handles empty trace data', async () => {
    renderTestComponent([]);

    await waitForViewToBeReady();

    // Verify empty state is handled gracefully
    expect(screen.getByText(/No traces found/)).toBeInTheDocument();
  });

  it('handles trace with no assessments', async () => {
    const traceInfo = createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId);

    renderTestComponent([traceInfo]);

    await waitForViewToBeReady();

    // Verify trace is rendered even without assessments
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('trace-1')).toBeInTheDocument();
  });

  it('handles selected columns filtering', async () => {
    const traceInfo = createTestTraceInfoV3(
      'trace-1',
      'request-1',
      'Hello world',
      [
        { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
        { name: 'quality_score', value: 0.85, dtype: 'numeric' },
      ],
      testExperimentId,
    );

    const assessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
    ];

    // Only select the overall assessment column
    const allColumns = createTestColumns(assessmentInfos);
    const selectedColumns = allColumns.filter(
      (col) => col.id === 'request' || col.id === 'assessment_overall_assessment',
    );

    renderTestComponent([traceInfo], [], {
      assessmentInfos,
      selectedColumns,
      allColumns,
    });

    await waitForViewToBeReady();

    // Verify only selected columns are rendered
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.queryByText('trace-1')).not.toBeInTheDocument();
    expect(screen.getByText('Overall Assessment')).toBeInTheDocument();
    expect(screen.queryByText('Quality Score')).not.toBeInTheDocument();
  });

  it('handles assessment aggregates computation', async () => {
    const traceInfos = [
      createTestTraceInfoV3(
        'trace-1',
        'request-1',
        'Hello world 1',
        [
          { name: 'overall_assessment', value: 'yes', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.85, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
      createTestTraceInfoV3(
        'trace-2',
        'request-2',
        'Hello world 2',
        [
          { name: 'overall_assessment', value: 'no', dtype: 'pass-fail' },
          { name: 'quality_score', value: 0.75, dtype: 'numeric' },
        ],
        testExperimentId,
      ),
    ];

    const assessmentInfos = [
      createTestAssessmentInfo('overall_assessment', 'Overall Assessment', 'pass-fail'),
      createTestAssessmentInfo('quality_score', 'Quality Score', 'numeric'),
    ];

    const columns = createTestColumns(assessmentInfos);

    renderTestComponent(traceInfos, [], {
      assessmentInfos,
      selectedColumns: columns,
      allColumns: columns,
    });

    await waitForViewToBeReady();

    // Verify both traces are rendered with their assessments
    expect(screen.getByText('Hello world 1')).toBeInTheDocument();
    expect(screen.getByText('Hello world 2')).toBeInTheDocument();

    // Check for correct aggregate values
    // For pass-fail, expect both "Pass" and "Fail" to be present
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Fail')).toBeInTheDocument();

    // For numeric, check for the average (0.8 or 0.80)
    expect(screen.getByText(/0\.8/)).toBeInTheDocument();
  });

  it('handles undefined optional props gracefully', async () => {
    const traceInfo = createTestTraceInfoV3('trace-1', 'request-1', 'Hello world', [], testExperimentId);

    renderTestComponent([traceInfo], [], {
      currentRunDisplayName: undefined,
      runUuid: undefined,
      compareToRunUuid: undefined,
      compareToRunDisplayName: undefined,
      getRunColor: undefined,
      onTraceTagsEdit: undefined,
    });

    await waitForViewToBeReady();

    // Verify component renders without errors
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('trace-1')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: GenAITracesTableBodyContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/GenAITracesTableBodyContainer.tsx
Signals: React

```typescript
import type { RowSelectionState } from '@tanstack/react-table';
import React, { useState, useMemo, useCallback } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import type { Assessment, ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { AssessmentSchemaContextProvider } from '@databricks/web-shared/model-trace-explorer';

import { computeEvaluationsComparison } from './GenAiTracesTable.utils';
import { GenAiTracesTableBody } from './GenAiTracesTableBody';
import { useActiveEvaluation } from './hooks/useActiveEvaluation';
import type { GetTraceFunction } from './hooks/useGetTrace';
import { FilterOperator, TracesTableColumnGroup, TracesTableColumnType } from './types';
import type {
  AssessmentFilter,
  AssessmentInfo,
  TracesTableColumn,
  EvaluationsOverviewTableSort,
  TableFilter,
} from './types';
import { sortAssessmentInfos } from './utils/AggregationUtils';
import { shouldEnableTagGrouping } from './utils/FeatureUtils';
import { applyTraceInfoV3ToEvalEntry, DEFAULT_RUN_PLACEHOLDER_NAME } from './utils/TraceUtils';

interface GenAITracesTableBodyContainerProps {
  // Experiment metadata
  experimentId: string;
  currentRunDisplayName?: string;
  runUuid?: string;
  compareToRunUuid?: string;
  compareToRunDisplayName?: string;
  getRunColor?: (runUuid: string) => string;

  // Table metadata
  assessmentInfos: AssessmentInfo[];

  // Table data
  currentTraceInfoV3: ModelTraceInfoV3[];
  compareToTraceInfoV3?: ModelTraceInfoV3[];
  getTrace: GetTraceFunction;

  // Table state
  selectedColumns: TracesTableColumn[];
  allColumns: TracesTableColumn[];
  tableSort: EvaluationsOverviewTableSort | undefined;
  filters: TableFilter[];
  setFilters: (filters: TableFilter[]) => void;

  // TODO: Remove this in favor of unified tagging modal apis
  onTraceTagsEdit?: (trace: ModelTraceInfoV3) => void;

  // Configuration
  enableRowSelection?: boolean;

  /**
   * Whether to display a loading overlay over the table
   */
  displayLoadingOverlay?: boolean;
}

const GenAITracesTableBodyContainerImpl: React.FC<React.PropsWithChildren<GenAITracesTableBodyContainerProps>> =
  React.memo((props: GenAITracesTableBodyContainerProps) => {
    const {
      experimentId,
      currentTraceInfoV3,
      compareToTraceInfoV3,
      currentRunDisplayName,
      runUuid,
      compareToRunUuid,
      compareToRunDisplayName,
      setFilters,
      filters,
      selectedColumns,
      tableSort,
      assessmentInfos,
      getTrace,
      onTraceTagsEdit,
      allColumns,
      getRunColor,
      enableRowSelection = true,
      displayLoadingOverlay = false,
    } = props;
    const { theme } = useDesignSystemTheme();

    // Convert trace info v3 to the format expected by GenAITracesTableBody
    const currentEvaluationResults = useMemo(
      () =>
        applyTraceInfoV3ToEvalEntry(
          currentTraceInfoV3.map((traceInfo) => ({
            evaluationId: traceInfo.trace_id,
            requestId: traceInfo.client_request_id || traceInfo.trace_id,
            inputsId: traceInfo.trace_id,
            inputs: {},
            outputs: {},
            targets: {},
            overallAssessments: [],
            responseAssessmentsByName: {},
            metrics: {},
            traceInfo,
          })),
        ),
      [currentTraceInfoV3],
    );
    const compareToEvaluationResults = useMemo(
      () =>
        applyTraceInfoV3ToEvalEntry(
          (compareToTraceInfoV3 || []).map((traceInfo) => ({
            evaluationId: traceInfo.trace_id,
            requestId: traceInfo.client_request_id || traceInfo.trace_id,
            inputsId: traceInfo.trace_id,
            inputs: {},
            outputs: {},
            targets: {},
            overallAssessments: [],
            responseAssessmentsByName: {},
            metrics: {},
            traceInfo,
          })),
        ),
      [compareToTraceInfoV3],
    );

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Handle assessment filter toggle
    const handleAssessmentFilterToggle = useCallback(
      (assessmentName: string, filterValue: any, run: string) => {
        const filter = filters.find(
          (filter) => filter.column === TracesTableColumnGroup.ASSESSMENT && filter.key === assessmentName,
        );
        if (filter === undefined) {
          setFilters([
            ...filters,
            {
              column: TracesTableColumnGroup.ASSESSMENT,
              key: assessmentName,
              operator: FilterOperator.EQUALS,
              value: filterValue,
            },
          ]);
        } else if (filter.value === filterValue) {
          // Remove the filter because it already exists.
          setFilters(
            filters.filter(
              (filter) => !(filter.column === TracesTableColumnGroup.ASSESSMENT && filter.key === assessmentName),
            ),
          );
        } else {
          // Replace any filters with the same assessment name and run.
          setFilters(
            filters.map((filter) => {
              if (filter.column === TracesTableColumnGroup.ASSESSMENT && filter.key === assessmentName) {
                return {
                  column: TracesTableColumnGroup.ASSESSMENT,
                  key: assessmentName,
                  operator: FilterOperator.EQUALS,
                  value: filterValue,
                };
              }
              return filter;
            }),
          );
        }
      },
      [filters, setFilters],
    );

    const assessmentFilters: AssessmentFilter[] = useMemo(() => {
      return filters
        .filter((filter) => filter.column === TracesTableColumnGroup.ASSESSMENT)
        .map((filter) => ({
          assessmentName: filter.key || '',
          filterValue: filter.value,
          run: currentRunDisplayName || DEFAULT_RUN_PLACEHOLDER_NAME,
        }));
    }, [filters, currentRunDisplayName]);

    const [selectedEvaluationId, setSelectedEvaluationId] = useActiveEvaluation();

    // Get selected assessment infos
    const selectedAssessmentInfos = useMemo(() => {
      const selectedAssessmentCols = selectedColumns.filter((col) => col.type === TracesTableColumnType.ASSESSMENT);
      const selectedAssessments = selectedAssessmentCols.map((col) => col.assessmentInfo as AssessmentInfo);
      return sortAssessmentInfos(selectedAssessments);
    }, [selectedColumns]);

    // Compute evaluations comparison
    const evaluationResults = useMemo(
      () => computeEvaluationsComparison(currentEvaluationResults, compareToEvaluationResults),
      [currentEvaluationResults, compareToEvaluationResults],
    );

    const assessments = useMemo(() => {
      return currentEvaluationResults.flatMap((evalResult) => evalResult?.traceInfo?.assessments ?? []) as Assessment[];
    }, [currentEvaluationResults]);

    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
          overflow: 'hidden',
          flexGrow: 1,
        }}
      >
        <div
          css={{
            display: 'flex',
            gap: theme.spacing.md,
            width: '100%',
            flex: 1,
            overflowY: 'hidden',
          }}
        >
          <div
            css={{
              flex: 1,
              overflowY: 'hidden',
              position: 'relative',
            }}
          >
            <AssessmentSchemaContextProvider assessments={assessments}>
              <GenAiTracesTableBody
                experimentId={experimentId}
                selectedColumns={selectedColumns}
                allColumns={allColumns}
                evaluations={evaluationResults}
                selectedEvaluationId={selectedEvaluationId}
                selectedAssessmentInfos={selectedAssessmentInfos}
                assessmentInfos={assessmentInfos}
                assessmentFilters={assessmentFilters}
                onChangeEvaluationId={setSelectedEvaluationId}
                getRunColor={getRunColor}
                runUuid={runUuid}
                compareToRunUuid={compareToRunUuid}
                runDisplayName={currentRunDisplayName}
                compareToRunDisplayName={compareToRunDisplayName}
                enableRowSelection={enableRowSelection}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                toggleAssessmentFilter={handleAssessmentFilterToggle}
                tableSort={tableSort}
                getTrace={getTrace}
                onTraceTagsEdit={onTraceTagsEdit}
                enableGrouping={shouldEnableTagGrouping()}
                displayLoadingOverlay={displayLoadingOverlay}
              />
            </AssessmentSchemaContextProvider>
          </div>
        </div>
      </div>
    );
  });

// TODO: Add an error boundary to the OSS trace table
export const GenAITracesTableBodyContainer = GenAITracesTableBodyContainerImpl;
```

--------------------------------------------------------------------------------

````

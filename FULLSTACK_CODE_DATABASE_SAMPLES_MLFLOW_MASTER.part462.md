---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 462
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 462 of 991)

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

---[FILE: PromptEngineeringContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/contexts/PromptEngineeringContext.tsx
Signals: React, Redux/RTK

```typescript
import React, { useCallback, useContext, useMemo, useState } from 'react';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import type { UseEvaluationArtifactTableDataResult } from '../hooks/useEvaluationArtifactTableData';
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../../redux-types';
import type { EvaluationDataReduxState } from '../../../reducers/EvaluationDataReducer';
import { evaluatePromptTableValue } from '../../../actions/PromptEngineeringActions';
import {
  DEFAULT_PROMPTLAB_OUTPUT_COLUMN,
  canEvaluateOnRun,
  compilePromptInputText,
  extractEvaluationPrerequisitesForRun,
  extractPromptInputVariables,
} from '../../prompt-engineering/PromptEngineering.utils';
import Utils from '../../../../common/utils/Utils';
import { useEvaluateAllRows } from '../hooks/useEvaluateAllRows';
import { useIntl } from 'react-intl';
import type { ErrorWrapper } from '../../../../common/utils/ErrorWrapper';
import { getPromptEngineeringErrorMessage } from '../utils/PromptEngineeringErrorUtils';
import type { GatewayErrorWrapper } from '../../../utils/LLMGatewayUtils';

export interface PromptEngineeringContextType {
  getMissingParams: (run: RunRowType, rowKey: string) => string[] | null;
  getEvaluableRowCount: (run: RunRowType) => number;
  pendingDataLoading: EvaluationDataReduxState['evaluationPendingDataLoadingByRunUuid'];
  evaluateCell: (run: RunRowType, rowKey: string) => void;
  evaluateAllClick: (run: RunRowType) => void;
  runColumnsBeingEvaluated: string[];
  canEvaluateInRunColumn: (run: RunRowType) => boolean;
  toggleExpandedHeader: () => void;
  isHeaderExpanded: boolean;
}

const PromptEngineeringContext = React.createContext<PromptEngineeringContextType>({
  getMissingParams: () => [],
  pendingDataLoading: {},
  getEvaluableRowCount: () => 0,
  evaluateCell: () => {},
  evaluateAllClick: () => {},
  runColumnsBeingEvaluated: [],
  canEvaluateInRunColumn: () => false,
  toggleExpandedHeader: () => {},
  isHeaderExpanded: false,
});

export const PromptEngineeringContextProvider = ({
  tableData,
  outputColumn,
  children,
}: React.PropsWithChildren<{
  tableData: UseEvaluationArtifactTableDataResult;
  outputColumn: string;
}>) => {
  const intl = useIntl();

  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const toggleExpandedHeader = useCallback(() => setIsHeaderExpanded((expanded) => !expanded), []);

  const getMissingParams = useCallback(
    (run: RunRowType, rowKey: string) => {
      if (!canEvaluateOnRun(run)) {
        return null;
      }
      const row = tableData.find((x) => x.key === rowKey);
      if (!row) {
        return null;
      }

      const { promptTemplate } = extractEvaluationPrerequisitesForRun(run);

      if (!promptTemplate) {
        return null;
      }

      const requiredInputs = extractPromptInputVariables(promptTemplate);

      const missingInputParams = requiredInputs.filter((requiredInput) => !row.groupByCellValues[requiredInput]);

      return missingInputParams;
    },
    [tableData],
  );

  const dispatch = useDispatch<ThunkDispatch>();
  const { startEvaluatingRunColumn, stopEvaluatingRunColumn, runColumnsBeingEvaluated } = useEvaluateAllRows(
    tableData,
    outputColumn,
  );

  const pendingDataLoading = useSelector(
    ({ evaluationData }: ReduxState) => evaluationData.evaluationPendingDataLoadingByRunUuid,
  );

  const canEvaluateInRunColumn = useCallback(
    (run?: RunRowType) => outputColumn === DEFAULT_PROMPTLAB_OUTPUT_COLUMN && canEvaluateOnRun(run),
    [outputColumn],
  );

  const getEvaluableRowCount = useCallback(
    (run: RunRowType) => {
      const evaluatableRows = tableData.filter((tableRow) => {
        if (tableRow.cellValues[run.runUuid]) {
          return false;
        }
        const missingParams = getMissingParams(run, tableRow.key);
        return missingParams?.length === 0;
      });

      return evaluatableRows.length;
    },
    [tableData, getMissingParams],
  );

  const evaluateAllClick = useCallback(
    (run: RunRowType) => {
      if (runColumnsBeingEvaluated.includes(run.runUuid)) {
        stopEvaluatingRunColumn(run);
      } else {
        startEvaluatingRunColumn(run);
      }
    },
    [runColumnsBeingEvaluated, startEvaluatingRunColumn, stopEvaluatingRunColumn],
  );

  const evaluateCell = useCallback(
    (run: RunRowType, rowKey: string) => {
      const row = tableData.find(({ key }) => key === rowKey);
      if (!row) {
        return;
      }
      const inputValues = row.groupByCellValues;

      const { parameters, promptTemplate, routeName, routeType } = extractEvaluationPrerequisitesForRun(run);

      if (!promptTemplate) {
        return;
      }

      const compiledPrompt = compilePromptInputText(promptTemplate, inputValues);

      if (routeName) {
        const getAction = () => {
          return evaluatePromptTableValue({
            routeName,
            routeType,
            compiledPrompt,
            inputValues,
            outputColumn,
            rowKey,
            parameters,
            run,
          });
        };

        dispatch(getAction()).catch((e: Error | ErrorWrapper | GatewayErrorWrapper) => {
          const errorMessage = getPromptEngineeringErrorMessage(e);

          const wrappedMessage = intl.formatMessage(
            {
              defaultMessage: 'MLflow deployment returned the following error: "{errorMessage}"',
              description: 'Experiment page > MLflow deployment error message',
            },
            {
              errorMessage,
            },
          );
          Utils.logErrorAndNotifyUser(wrappedMessage);
        });
      }
    },
    [tableData, dispatch, outputColumn, intl],
  );
  const contextValue = useMemo(
    () => ({
      getMissingParams,
      getEvaluableRowCount,
      evaluateCell,
      evaluateAllClick,
      pendingDataLoading,
      canEvaluateInRunColumn,
      runColumnsBeingEvaluated,
      isHeaderExpanded,
      toggleExpandedHeader,
    }),
    [
      getMissingParams,
      getEvaluableRowCount,
      evaluateAllClick,
      evaluateCell,
      pendingDataLoading,
      canEvaluateInRunColumn,
      runColumnsBeingEvaluated,
      isHeaderExpanded,
      toggleExpandedHeader,
    ],
  );
  return <PromptEngineeringContext.Provider value={contextValue}>{children}</PromptEngineeringContext.Provider>;
};

export const usePromptEngineeringContext = () => useContext(PromptEngineeringContext);
```

--------------------------------------------------------------------------------

---[FILE: useEvaluateAllRows.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluateAllRows.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { useEvaluateAllRows } from './useEvaluateAllRows';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { evaluatePromptTableValue } from '../../../actions/PromptEngineeringActions';
import { cloneDeep } from 'lodash';
import type { UseEvaluationArtifactTableDataResult } from './useEvaluationArtifactTableData';
import { IntlProvider } from 'react-intl';

// Mock the evaluation action, it simulates taking 1000 ms to evaluate a single value
jest.mock('../../../actions/PromptEngineeringActions', () => ({
  evaluatePromptTableValue: jest.fn(() => ({
    type: 'evaluatePromptTableValue',
    payload: new Promise((resolve) => setTimeout(resolve, 1000)),
    meta: {},
  })),
}));

jest.useFakeTimers();

// Sample table with evaluation data. There are two input sets.
// - run_1 has recorded outputs for both inputs
// - run_2 has recorded output for one input
// - run_3 has no recorded outputs
const mockEvaluationTable: UseEvaluationArtifactTableDataResult = [
  {
    cellValues: { run_1: 'answer_alpha_1', run_2: '', run_3: '' },
    groupByCellValues: {
      col_question: 'question_alpha',
    },
    key: 'question',
  },
  {
    cellValues: { run_1: 'answer_beta_1', run_2: 'answer_beta_2', run_3: '' },
    groupByCellValues: {
      col_question: 'question_beta',
    },
    key: 'question_beta',
  },
];

// Utility function: creates a mocked run row (column in the evaluation table)
const createMockRun = (name: string): RunRowType =>
  ({
    runUuid: name,
    runName: name,
    params: [
      { key: 'model_route', value: 'model-route' },
      { key: 'prompt_template', value: 'this is a prompt template with {{ col_question }}' },
      { key: 'max_tokens', value: '100' },
      { key: 'temperature', value: '0.5' },
    ],
  } as any);

// Create three mocked runs
const mockRun1 = createMockRun('run_1');
const mockRun2 = createMockRun('run_2');
const mockRun3 = createMockRun('run_3');

// Utility function: creates a new result evaluation table with updated row
const updateResultTable = (
  sourceTable = mockEvaluationTable,
  questionValue: string,
  runUuid: string,
  newValue: string,
) => {
  const updatedTable = cloneDeep(sourceTable);
  const row = updatedTable.find(({ groupByCellValues }) => groupByCellValues['col_question'] === questionValue);

  if (row) {
    row.cellValues[runUuid] = newValue;
  }
  return updatedTable;
};

describe('useEvaluateAllRows', () => {
  const render = () => {
    const mockStore = configureStore([thunk, promiseMiddleware()])({});
    const { result, rerender } = renderHook((props) => useEvaluateAllRows(props.evaluationTable, 'col_output'), {
      initialProps: {
        evaluationTable: mockEvaluationTable,
      },
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <Provider store={mockStore}>{children}</Provider>
        </IntlProvider>
      ),
    });
    return { getResult: () => result.current, rerender };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it should ignore evaluation of the already fully evaluated run', async () => {
    const { getResult } = render();
    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
    await act(async () => {
      getResult().startEvaluatingRunColumn(mockRun1);
    });
    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
  });

  test('it should properly kickstart evaluation of partially evaluated run', async () => {
    const { getResult, rerender } = render();
    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
    await act(async () => {
      getResult().startEvaluatingRunColumn(mockRun2);
    });
    expect(getResult().runColumnsBeingEvaluated).toEqual(['run_2']);
    expect(evaluatePromptTableValue).toHaveBeenCalledWith(
      expect.objectContaining({
        compiledPrompt: 'this is a prompt template with question_alpha',
        inputValues: {
          col_question: 'question_alpha',
        },
        outputColumn: 'col_output',
        routeName: 'model-route',
        rowKey: 'question',
        run: mockRun2,
      }),
    );

    await act(async () => {
      rerender({
        evaluationTable: updateResultTable(mockEvaluationTable, 'question_alpha', 'run_2', 'newly_evaluated_data'),
      });
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
  });

  test('it should properly process a run column with multiple values to be evaluated', async () => {
    const { getResult, rerender } = render();
    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
    await act(async () => {
      getResult().startEvaluatingRunColumn(mockRun3);
    });
    expect(getResult().runColumnsBeingEvaluated).toEqual(['run_3']);
    expect(evaluatePromptTableValue).toHaveBeenCalledTimes(1);

    expect(evaluatePromptTableValue).toHaveBeenCalledWith(
      expect.objectContaining({
        compiledPrompt: 'this is a prompt template with question_alpha',
        inputValues: {
          col_question: 'question_alpha',
        },
        run: mockRun3,
      }),
    );

    const updatedTable = updateResultTable(mockEvaluationTable, 'question_alpha', 'run_3', 'newly_evaluated_data');

    rerender({
      evaluationTable: updatedTable,
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(evaluatePromptTableValue).toHaveBeenCalledTimes(2);

    expect(evaluatePromptTableValue).toHaveBeenCalledWith(
      expect.objectContaining({
        compiledPrompt: 'this is a prompt template with question_beta',
        inputValues: {
          col_question: 'question_beta',
        },
        run: mockRun3,
      }),
    );

    rerender({
      evaluationTable: updateResultTable(updatedTable, 'question_beta', 'run_3', 'newly_evaluated_data'),
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
  });

  test('it should properly stop evaluating', async () => {
    const { getResult, rerender } = render();
    expect(getResult().runColumnsBeingEvaluated).toEqual([]);
    await act(async () => {
      getResult().startEvaluatingRunColumn(mockRun3);
    });
    expect(getResult().runColumnsBeingEvaluated).toEqual(['run_3']);
    expect(evaluatePromptTableValue).toHaveBeenCalledTimes(1);

    expect(evaluatePromptTableValue).toHaveBeenCalledWith(
      expect.objectContaining({
        compiledPrompt: 'this is a prompt template with question_alpha',
        inputValues: {
          col_question: 'question_alpha',
        },
        run: mockRun3,
      }),
    );

    const updatedTable = updateResultTable(mockEvaluationTable, 'question_alpha', 'run_3', 'newly_evaluated_data');

    rerender({
      evaluationTable: updatedTable,
    });

    await act(async () => {
      getResult().stopEvaluatingRunColumn(mockRun3);
    });
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Contrary to previous test, we don't get additional action call
    expect(evaluatePromptTableValue).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEvaluateAllRows.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluateAllRows.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import type { UseEvaluationArtifactTableDataResult } from './useEvaluationArtifactTableData';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../../../redux-types';
import {
  compilePromptInputText,
  extractEvaluationPrerequisitesForRun,
  extractPromptInputVariables,
} from '../../prompt-engineering/PromptEngineering.utils';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { evaluatePromptTableValue } from '../../../actions/PromptEngineeringActions';
import Utils from '../../../../common/utils/Utils';
import { getPromptEngineeringErrorMessage } from '../utils/PromptEngineeringErrorUtils';

/**
 * Local utilility function, confirms if all param values
 * are provided for a particular evaluation table data row.
 */
const containsAllParamValuesForRow = (row: UseEvaluationArtifactTableDataResult[0], requiredInputs: string[]) => {
  const missingInputParams = requiredInputs.filter((requiredInput) => !row.groupByCellValues[requiredInput]);

  return missingInputParams.length === 0;
};

/**
 * A hook containing complete toolset supporting "Evaluate all" button
 */
export const useEvaluateAllRows = (evaluationTableData: UseEvaluationArtifactTableDataResult, outputColumn: string) => {
  const currentTableData = useRef<UseEvaluationArtifactTableDataResult>(evaluationTableData);
  const currentRunsBeingEvaluated = useRef<string[]>([]);
  const intl = useIntl();

  useEffect(() => {
    currentTableData.current = evaluationTableData;
  }, [evaluationTableData]);

  const [runColumnsBeingEvaluated, setEvaluatedRuns] = useState<string[]>([]);

  useEffect(() => {
    currentRunsBeingEvaluated.current = runColumnsBeingEvaluated;
  }, [runColumnsBeingEvaluated]);

  const dispatch = useDispatch<ThunkDispatch>();

  // Processes single run's evaluation queue.
  const processQueueForRun = useCallback(
    (run: RunRowType) => {
      const tableData = currentTableData.current;
      const { parameters, promptTemplate, routeName, routeType } = extractEvaluationPrerequisitesForRun(run);

      if (!promptTemplate) {
        return;
      }

      const requiredInputs = extractPromptInputVariables(promptTemplate);

      // Try to find the next row in the table that can be evaluated for a particular table
      const nextEvaluableRow = tableData.find(
        (tableRow) => !tableRow.cellValues[run.runUuid] && containsAllParamValuesForRow(tableRow, requiredInputs),
      );

      // If there's no row, close the queue and return
      if (!nextEvaluableRow) {
        setEvaluatedRuns((runs) => runs.filter((existingRunUuid) => existingRunUuid !== run.runUuid));
        return;
      }
      const rowKey = nextEvaluableRow.key;
      const inputValues = nextEvaluableRow.groupByCellValues;

      if (!promptTemplate) {
        return;
      }

      const compiledPrompt = compilePromptInputText(promptTemplate, inputValues);

      if (routeName) {
        dispatch(
          evaluatePromptTableValue({
            routeName,
            routeType,
            compiledPrompt,
            inputValues,
            outputColumn,
            rowKey,
            parameters,
            run,
          }),
        )
          .then(() => {
            // If the current queue for the run is still active, continue with processing
            if (currentRunsBeingEvaluated.current.includes(run.runUuid)) {
              processQueueForRun(run);
            }
          })
          .catch((e) => {
            const errorMessage = getPromptEngineeringErrorMessage(e);

            // In case of error, notify the user and close the queue
            const wrappedMessage = intl.formatMessage(
              {
                defaultMessage: 'Gateway returned the following error: "{errorMessage}"',
                description: 'Experiment page > gateway error message',
              },
              {
                errorMessage,
              },
            );
            Utils.logErrorAndNotifyUser(wrappedMessage);
            setEvaluatedRuns((runs) => runs.filter((existingRunUuid) => existingRunUuid !== run.runUuid));
          });
      }
    },
    [dispatch, outputColumn, intl],
  );

  // Enables run's evaluation queue and starts its processing
  const startEvaluatingRunColumn = useCallback(
    (run: RunRowType) => {
      setEvaluatedRuns((runs) => [...runs, run.runUuid]);
      processQueueForRun(run);
    },
    [processQueueForRun],
  );

  // Removes the run from evaluation queue so it will gracefully stop after currently pending evaluation
  const stopEvaluatingRunColumn = useCallback((run: RunRowType) => {
    setEvaluatedRuns((runs) => runs.filter((existingRunUuid) => existingRunUuid !== run.runUuid));
  }, []);

  return { runColumnsBeingEvaluated, startEvaluatingRunColumn, stopEvaluatingRunColumn };
};
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationAddNewInputsModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationAddNewInputsModal.test.tsx
Signals: React

```typescript
import { describe, it, jest, expect } from '@jest/globals';
import { useEvaluationAddNewInputsModal } from './useEvaluationAddNewInputsModal';
import { act, renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { createParamFieldName } from '../../experiment-page/utils/experimentPage.column-utils';
import { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { MLFLOW_RUN_SOURCE_TYPE_TAG, MLflowRunSourceType } from '../../../constants';

describe('useEvaluationAddNewInputsModal', () => {
  const renderHookResult = (runs: RunRowType[], onSuccess: (providedParamValues: Record<string, string>) => void) => {
    const Component = () => {
      const { AddNewInputsModal, showAddNewInputsModal } = useEvaluationAddNewInputsModal();
      useEffect(() => {
        showAddNewInputsModal(runs, onSuccess);
      }, [showAddNewInputsModal]);
      return <>{AddNewInputsModal}</>;
    };

    return renderWithIntl(<Component />);
  };

  it('should properly calculate input field names for visible runs', async () => {
    const runA = {
      runName: 'run A',
      params: [
        { key: 'model_route', value: 'some-route' },
        {
          key: 'prompt_template',
          value: 'This is run A with {{input_a}} and {{input_b}} template',
        },
      ],
      tags: {
        [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
          key: MLFLOW_RUN_SOURCE_TYPE_TAG,
          value: MLflowRunSourceType.PROMPT_ENGINEERING,
        },
      },
    } as any;

    const runB = {
      runName: 'run B',
      params: [
        { key: 'model_route', value: 'some-route' },
        {
          key: 'prompt_template',
          value: 'This is run B with {{input_b}} and {{input_c}} template',
        },
      ],
      tags: {
        [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
          key: MLFLOW_RUN_SOURCE_TYPE_TAG,
          value: MLflowRunSourceType.PROMPT_ENGINEERING,
        },
      },
    };

    const onSuccess = jest.fn();

    renderHookResult([runA, runB], onSuccess);

    expect(
      screen.getByText((_, element) => Boolean(element?.textContent?.trim().match(/^input_a\s?Used by run A$/))),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => Boolean(element?.textContent?.trim().match(/^input_b\s?Used by run A, run B$/))),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => Boolean(element?.textContent?.trim().match(/^input_c\s?Used by run B$/))),
    ).toBeInTheDocument();

    // Type in data for two inputs, leave input_b empty
    act(() => screen.getAllByRole<HTMLTextAreaElement>('textbox')[0].focus());
    await userEvent.paste('val_a');
    act(() => screen.getAllByRole<HTMLTextAreaElement>('textbox')[2].focus());
    await userEvent.paste('val_c');

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

    // Fill in missing input
    act(() => screen.getAllByRole<HTMLTextAreaElement>('textbox')[1].focus());
    await userEvent.paste('val_b');

    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Assert returned data
    expect(onSuccess).toHaveBeenCalledWith({
      input_a: 'val_a',
      input_b: 'val_b',
      input_c: 'val_c',
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationAddNewInputsModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationAddNewInputsModal.tsx
Signals: React

```typescript
import { Input, Modal, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { useCallback, useMemo, useState } from 'react';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { uniq, compact } from 'lodash';
import { canEvaluateOnRun, extractRequiredInputParamsForRun } from '../../prompt-engineering/PromptEngineering.utils';
import { FormattedMessage } from 'react-intl';

const MAX_RUN_NAMES = 5;

export const useEvaluationAddNewInputsModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [requiredInputKeys, setRequiredInputKeys] = useState<
    {
      inputName: string;
      runNames: string[];
    }[]
  >([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const allValuesProvided = useMemo(
    () => requiredInputKeys.every(({ inputName }) => inputValues[inputName]),
    [inputValues, requiredInputKeys],
  );

  const [successCallback, setSuccessCallback] = useState<(providedParamValues: Record<string, string>) => void>(
    async () => {},
  );

  const setInputValue = useCallback((key: string, value: string) => {
    setInputValues((values) => ({ ...values, [key]: value }));
  }, []);

  const showAddNewInputsModal = useCallback(
    (runs: RunRowType[], onSuccess: (providedParamValues: Record<string, string>) => void) => {
      const requiredInputsForRuns = runs.filter(canEvaluateOnRun).map((run) => ({
        runName: run.runName,
        params: extractRequiredInputParamsForRun(run),
      }));
      const inputValuesWithRunNames = uniq(requiredInputsForRuns.map(({ params }) => params).flat()).map(
        (inputName) => ({
          inputName,
          runNames: compact(
            requiredInputsForRuns.filter((r) => r.params.includes(inputName)).map(({ runName }) => runName),
          ),
        }),
      );
      setModalVisible(true);
      setRequiredInputKeys(inputValuesWithRunNames);
      setInputValues({});
      setSuccessCallback(() => onSuccess);
    },
    [],
  );
  const { theme } = useDesignSystemTheme();

  const AddNewInputsModal = (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_hooks_useevaluationaddnewinputsmodal.tsx_57"
      title={
        <FormattedMessage
          defaultMessage="Add row"
          description='Experiment page > artifact compare view > "add new row" modal title'
        />
      }
      okButtonProps={{ disabled: !allValuesProvided }}
      okText={
        <FormattedMessage
          // TODO(ML-32664): Implement "Submit and evaluate" that evaluates entire row
          defaultMessage="Submit"
          description='Experiment page > artifact compare view > "add new row" modal submit button label'
        />
      }
      cancelText={
        <FormattedMessage
          defaultMessage="Cancel"
          description='Experiment page > artifact compare view > "add new row" modal cancel button label'
        />
      }
      onOk={() => {
        successCallback(inputValues);
        setModalVisible(false);
      }}
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
    >
      {requiredInputKeys.map(({ inputName, runNames }) => (
        <div key={inputName} css={{ marginBottom: theme.spacing.md }}>
          <Typography.Text bold>{inputName}</Typography.Text>
          <Typography.Hint css={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <FormattedMessage
              defaultMessage="Used by {runNames} {hasMore, select, true {and other runs} other {}}"
              description="Experiment page > artifact compare view > label indicating which runs are using particular input field"
              values={{
                runNames: runNames.slice(0, MAX_RUN_NAMES).join(', '),
                hasMore: runNames.length > MAX_RUN_NAMES,
              }}
            />
          </Typography.Hint>
          <div css={{ marginTop: theme.spacing.sm }}>
            <Input.TextArea
              componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_hooks_useevaluationaddnewinputsmodal.tsx_99"
              value={inputValues[inputName]}
              onChange={(e) => setInputValue(inputName, e.target.value)}
            />
          </div>
        </div>
      ))}
    </Modal>
  );
  return { showAddNewInputsModal, AddNewInputsModal };
};
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactColumns.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactColumns.enzyme.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { mount } from 'enzyme';
import { useEvaluationArtifactColumns } from './useEvaluationArtifactColumns';
import type { EvaluationArtifactTable } from '../../../types';

describe('useEvaluationArtifactColumns', () => {
  const mountTestComponent = (
    storeData: {
      [runUuid: string]: {
        [artifactPath: string]: EvaluationArtifactTable;
      };
    },
    comparedRunUuids: string[],
    tableNames: string[],
  ) => {
    let hookResult: ReturnType<typeof useEvaluationArtifactColumns>;
    const TestComponent = () => {
      hookResult = useEvaluationArtifactColumns(storeData, comparedRunUuids, tableNames);

      return null;
    };

    const wrapper = mount(<TestComponent />);

    return { wrapper, getHookResult: () => hookResult };
  };

  const MOCK_STORE = {
    // Table with column "col_a"
    run_a: { '/table1': { columns: ['col_a'], entries: [], path: '/table1' } },
    // Table with column "col_b"
    run_b: { '/table1': { columns: ['col_b'], entries: [], path: '/table1' } },
    // Table with columns "col_a" and "col_b"
    run_ab: { '/table1': { columns: ['col_a', 'col_b'], entries: [], path: '/table1' } },
    // Table with columns "col_a", "col_b" and "col_c"
    run_abc: { '/table1': { columns: ['col_a', 'col_b', 'col_c'], entries: [], path: '/table1' } },
    // Table with columns "col_a", "col_b" and "col_c" but also "col_b" and "col_c" in the other table
    run_abc_othertable: {
      '/table1': { columns: ['col_a', 'col_b', 'col_c'], entries: [], path: '/table1' },
      '/table2': { columns: ['col_b', 'col_c'], entries: [], path: '/table2' },
    },
  };

  const getResultsForRuns = (runIds: string[], tableNames: string[]) =>
    mountTestComponent(MOCK_STORE, runIds, tableNames).getHookResult();

  it('properly extracts all column names for a set of runs', () => {
    expect(getResultsForRuns(['run_a'], ['/table1']).columns).toEqual(['col_a']);
    expect(getResultsForRuns(['run_a', 'run_b'], ['/table1']).columns).toEqual(['col_a', 'col_b']);
    expect(getResultsForRuns(['run_a', 'run_b', 'run_ab'], ['/table1']).columns).toEqual(['col_a', 'col_b']);
    expect(getResultsForRuns(['run_a', 'run_b', 'run_abc'], ['/table1']).columns).toEqual(['col_a', 'col_b', 'col_c']);
    expect(getResultsForRuns(['run_a', 'run_abc_othertable'], ['/table1', '/table2']).columns).toEqual([
      'col_a',
      'col_b',
      'col_c',
    ]);
  });

  it('properly extracts columns intersection for a set of runs', () => {
    expect(getResultsForRuns(['run_a'], ['/table1']).columnsIntersection).toEqual(['col_a']);
    expect(getResultsForRuns(['run_a', 'run_b'], ['/table1']).columnsIntersection).toEqual([]);
    expect(getResultsForRuns(['run_a', 'run_ab'], ['/table1']).columnsIntersection).toEqual(['col_a']);
    expect(getResultsForRuns(['run_abc_othertable'], ['/table1', '/table2']).columnsIntersection).toEqual([
      'col_b',
      'col_c',
    ]);
    expect(getResultsForRuns(['run_b', 'run_abc_othertable'], ['/table1', '/table2']).columnsIntersection).toEqual([
      'col_b',
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactColumns.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactColumns.ts
Signals: React, Redux/RTK

```typescript
import { useMemo } from 'react';
import type { EvaluationDataReduxState } from '../../../reducers/EvaluationDataReducer';
import type { ArtifactLogTableImageObject } from '@mlflow/mlflow/src/experiment-tracking/types';

type ArtifactsByRun = EvaluationDataReduxState['evaluationArtifactsByRunUuid'];

/**
 * Consumes artifacts data (extracted from the redux store) and based on the
 * provided list of tables and run UUIDs, returns:
 * - list of all columns found in the tables data
 * - list of columns that are present in every matching table
 */
export const useEvaluationArtifactColumns = (
  artifactsByRun: ArtifactsByRun,
  comparedRunUuids: string[],
  tableNames: string[],
) =>
  useMemo(() => {
    // Do not proceed if there are no tables or runs selected
    if (tableNames.length === 0 || comparedRunUuids.length === 0) {
      return { columns: [], columnsIntersection: [], imageColumns: [] };
    }

    // Extract all matching table objects from the store data
    const allTableEntries = comparedRunUuids
      .map((runUuid) => Object.values(artifactsByRun[runUuid] || {}).filter(({ path }) => tableNames.includes(path)))
      .flat();

    // Extract all valid column names
    const allColumnsForAllTables = allTableEntries
      .filter(({ path }) => tableNames.includes(path))
      .map(({ columns, entries }) => {
        return columns.map((column) => {
          const column_string = String(column);
          if (entries.length > 0) {
            const entry = entries[0][column];
            if (typeof entry === 'object' && (entry as ArtifactLogTableImageObject)?.type === 'image') {
              return { name: column_string, type: 'image' };
            } else {
              return { name: column_string, type: 'text' };
            }
          } else {
            return { name: column_string, type: 'text' };
          }
        });
      })
      .flat();

    // Remove duplicates
    const columns = Array.from(
      new Set(allColumnsForAllTables.filter((col) => col.type === 'text').map((col) => col.name)),
    );
    const imageColumns = Array.from(
      new Set(allColumnsForAllTables.filter((col) => col.type === 'image').map((col) => col.name)),
    );
    // Find the intersection
    const columnsIntersection = columns.filter((column) =>
      allTableEntries.every(({ columns: tableColumns }) => tableColumns.includes(column)),
    );

    return {
      columns,
      columnsIntersection,
      imageColumns,
    };
  }, [comparedRunUuids, artifactsByRun, tableNames]);
```

--------------------------------------------------------------------------------

````

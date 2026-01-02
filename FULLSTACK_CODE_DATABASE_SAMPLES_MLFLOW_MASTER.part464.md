---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 464
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 464 of 991)

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

---[FILE: useEvaluationArtifactTables.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactTables.ts
Signals: React

```typescript
import { fromPairs } from 'lodash';
import { useMemo } from 'react';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { extractLoggedTablesFromRunTags } from '../../../utils/ArtifactUtils';

/**
 * Consumes an array of experiment run entities and extracts names of
 * all table artifacts defined by their tags.
 */
export const useEvaluationArtifactTables = (comparedRunRows: RunRowType[]) =>
  useMemo(() => {
    const tablesByRun = fromPairs(
      comparedRunRows
        .map<[string, string[]]>((run) => {
          const tablesInRun = run.tags ? extractLoggedTablesFromRunTags(run.tags) : [];
          return [run.runUuid, tablesInRun];
        })
        // Filter entries with no tables reported
        .filter(([, tables]) => tables.length > 0),
    );

    const allUniqueTables = Array.from(new Set(Object.values(tablesByRun).flat()));

    const tablesIntersection = allUniqueTables.filter((tableName) =>
      comparedRunRows.every(({ runUuid }) => tablesByRun[runUuid]?.includes(tableName)),
    );

    const noEvalTablesLogged = allUniqueTables.length === 0;

    return {
      tables: allUniqueTables,
      tablesByRun,
      tablesIntersection,
      noEvalTablesLogged,
    };
  }, [comparedRunRows]);
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactViewState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactViewState.tsx
Signals: React

```typescript
import { useEffect, useState } from 'react';
import type { ExperimentPageViewState } from '../../experiment-page/models/ExperimentPageViewState';
import type { UpdateExperimentViewStateFn } from '../../../types';

export const useEvaluationArtifactViewState = (
  viewState: ExperimentPageViewState,
  updateViewState: UpdateExperimentViewStateFn,
) => {
  const { artifactViewState = {} } = viewState;
  const [selectedTables, setSelectedTables] = useState<string[]>(artifactViewState.selectedTables || []);
  const [groupByCols, setGroupByCols] = useState<string[]>(artifactViewState.groupByCols || []);
  const [outputColumn, setOutputColumn] = useState(artifactViewState.outputColumn || '');

  useEffect(
    () =>
      updateViewState({
        artifactViewState: {
          selectedTables,
          groupByCols,
          outputColumn,
        },
      }),
    [updateViewState, selectedTables, groupByCols, outputColumn],
  );

  return {
    selectedTables,
    groupByCols,
    outputColumn,
    setSelectedTables,
    setGroupByCols,
    setOutputColumn,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactWriteBack.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactWriteBack.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import { renderWithIntl, act, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { EvaluationDataReduxState } from '../../../reducers/EvaluationDataReducer';
import { useEvaluationArtifactWriteBack } from './useEvaluationArtifactWriteBack';
import {
  WRITE_BACK_EVALUATION_ARTIFACTS,
  discardPendingEvaluationData,
} from '../../../actions/PromptEngineeringActions';
import { uploadArtifactApi } from '../../../actions';
import { MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME } from '../../../constants';
import Utils from '../../../../common/utils/Utils';
import { fulfilled } from '../../../../common/utils/ActionUtils';

const mockState: EvaluationDataReduxState = {
  evaluationDraftInputValues: [],
  evaluationArtifactsByRunUuid: {},
  evaluationArtifactsLoadingByRunUuid: {},
  evaluationArtifactsErrorByRunUuid: {},
  evaluationPendingDataByRunUuid: {},
  evaluationPendingDataLoadingByRunUuid: {},
  evaluationArtifactsBeingUploaded: {},
};

jest.mock('../../../actions/PromptEngineeringActions', () => ({
  ...jest.requireActual<typeof import('../../../actions/PromptEngineeringActions')>(
    '../../../actions/PromptEngineeringActions',
  ),
  discardPendingEvaluationData: jest.fn().mockReturnValue({
    type: 'discardPendingEvaluationData',
    payload: Promise.resolve({}),
  }),
}));

jest.mock('../../../actions', () => ({
  getEvaluationTableArtifact: jest.fn().mockReturnValue({
    type: 'getEvaluationTableArtifact',
    payload: Promise.resolve({}),
  }),
  uploadArtifactApi: jest.fn().mockReturnValue({
    type: 'uploadArtifactApi',
    payload: Promise.resolve({}),
  }),
}));

const getPendingEntry = () => ({
  entryData: { question: 'new_question', answer: 'new_answer' },
  isPending: true,
  evaluationTime: 1,
});

describe('useEvaluationArtifactWriteBack + writeBackEvaluationArtifacts action', () => {
  let mockStore: any;
  const mountHook = (partialState: Partial<EvaluationDataReduxState> = {}) => {
    mockStore = configureStore([thunk, promiseMiddleware()])({
      evaluationData: { ...mockState, ...partialState },
    });
    const Component = () => {
      const { isSyncingArtifacts, EvaluationSyncStatusElement } = useEvaluationArtifactWriteBack();

      return (
        <div>
          {isSyncingArtifacts && <div data-testid="is-syncing" />}
          {EvaluationSyncStatusElement}
        </div>
      );
    };
    return renderWithIntl(
      <Provider store={mockStore}>
        <Component />
      </Provider>,
    );
  };
  it('properly displays entries to be evaluated', () => {
    const { container } = mountHook({
      evaluationPendingDataByRunUuid: {
        run_1: [getPendingEntry(), getPendingEntry()],
        run_2: [getPendingEntry()],
      },
    });

    expect(container).toHaveTextContent(/You have 3 unsaved evaluated values/);
  });

  beforeEach(() => {
    Utils.logErrorAndNotifyUser = jest.fn();
  });

  afterEach(() => {
    jest.mocked(Utils.logErrorAndNotifyUser).mockRestore();
  });

  it('properly synchronizes new entries', async () => {
    mountHook({
      evaluationArtifactsByRunUuid: {
        run_1: {
          [MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME]: {
            columns: ['question', 'answer'],
            entries: [],
            rawArtifactFile: {
              columns: ['question', 'answer'],
              data: [['existing_question', 'existing_answer']],
            },
            path: MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME,
          },
        },
        run_2: {
          [MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME]: {
            columns: ['question', 'answer'],
            entries: [],
            rawArtifactFile: {
              columns: ['question', 'answer'],
              data: [],
            },
            path: MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME,
          },
        },
      },
      evaluationPendingDataByRunUuid: {
        run_1: [getPendingEntry()],
        run_2: [getPendingEntry()],
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(uploadArtifactApi).toHaveBeenCalledWith('run_1', MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME, {
      columns: ['question', 'answer'],
      data: [
        ['new_question', 'new_answer'],
        ['existing_question', 'existing_answer'],
      ],
    });

    expect(uploadArtifactApi).toHaveBeenCalledWith('run_2', MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME, {
      columns: ['question', 'answer'],
      data: [['new_question', 'new_answer']],
    });

    expect(mockStore.getActions()).toContainEqual(
      expect.objectContaining({
        meta: {
          artifactPath: MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME,
          runUuidsToUpdate: ['run_1', 'run_2'],
        },
        payload: [
          {
            newEvaluationTable: {
              columns: ['question', 'answer'],
              // Two entries for run 1
              entries: [
                { answer: 'new_answer', question: 'new_question' },
                { answer: 'existing_answer', question: 'existing_question' },
              ],
              path: MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME,
              rawArtifactFile: {
                columns: ['question', 'answer'],
                data: [
                  ['new_question', 'new_answer'],
                  ['existing_question', 'existing_answer'],
                ],
              },
            },
            runUuid: 'run_1',
          },
          {
            newEvaluationTable: {
              columns: ['question', 'answer'],
              // Only new entry for run 2
              entries: [{ answer: 'new_answer', question: 'new_question' }],
              path: MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME,
              rawArtifactFile: {
                columns: ['question', 'answer'],
                data: [['new_question', 'new_answer']],
              },
            },
            runUuid: 'run_2',
          },
        ],
        type: fulfilled(WRITE_BACK_EVALUATION_ARTIFACTS),
      }),
    );
  });

  it('throws when the current artifact is not found in the store', async () => {
    mountHook({
      evaluationArtifactsByRunUuid: {},
      evaluationPendingDataByRunUuid: {
        run_1: [getPendingEntry()],
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(Utils.logErrorAndNotifyUser).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/Cannot find existing prompt engineering artifact for run run_1/),
      }),
    );
  });

  it('discards the data when clicked', async () => {
    mountHook({
      evaluationArtifactsByRunUuid: {},
      evaluationPendingDataByRunUuid: {
        run_1: [getPendingEntry()],
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Discard' }));

    expect(discardPendingEvaluationData).toHaveBeenCalledWith();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useEvaluationArtifactWriteBack.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/useEvaluationArtifactWriteBack.tsx
Signals: React, Redux/RTK

```typescript
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../../redux-types';
import { Button, Typography, useDesignSystemTheme } from '@databricks/design-system';
import {
  discardPendingEvaluationData,
  writeBackEvaluationArtifactsAction,
} from '../../../actions/PromptEngineeringActions';
import { FormattedMessage } from 'react-intl';
import Utils from '../../../../common/utils/Utils';
import { useBrowserKeyShortcutListener } from '../../../../common/hooks/useBrowserKeyShortcutListener';

export const useEvaluationArtifactWriteBack = () => {
  const { evaluationPendingDataByRunUuid, evaluationArtifactsBeingUploaded, evaluationDraftInputValues } = useSelector(
    ({ evaluationData }: ReduxState) => evaluationData,
  );

  const [isSyncingArtifacts, setSyncingArtifacts] = useState(false);

  const dispatch = useDispatch<ThunkDispatch>();

  const discard = useCallback(() => {
    dispatch(discardPendingEvaluationData());
  }, [dispatch]);

  const unsyncedDataEntriesCount = Object.values(evaluationPendingDataByRunUuid).flat().length;
  const draftInputValuesCount = evaluationDraftInputValues.length;
  const runsBeingSynchronizedCount = Object.values(evaluationArtifactsBeingUploaded).filter((runArtifacts) =>
    Object.values(runArtifacts).some((isSynced) => isSynced),
  ).length;

  useEffect(() => {
    if (unsyncedDataEntriesCount === 0) {
      setSyncingArtifacts(false);
    }
  }, [unsyncedDataEntriesCount]);

  const synchronizeArtifactData = useCallback(() => {
    if (unsyncedDataEntriesCount === 0 || isSyncingArtifacts) {
      return true;
    }
    setSyncingArtifacts(true);
    dispatch(writeBackEvaluationArtifactsAction()).catch((e) => {
      Utils.logErrorAndNotifyUser(e);
    });
    return true;
  }, [dispatch, unsyncedDataEntriesCount, isSyncingArtifacts]);

  const { isMacKeyboard } = useBrowserKeyShortcutListener('s', { ctrlOrCmdKey: true }, synchronizeArtifactData);

  const { theme } = useDesignSystemTheme();

  // Following flag is true when there are draft input values (draft rows), but
  // no evaluated values yet
  const pendingUnevaluatedDraftInputValues = draftInputValuesCount > 0 && unsyncedDataEntriesCount === 0;

  // Display write-back UI only if there are draft rows or unsynced evaluation values
  const shouldStatusElementBeDisplayed = unsyncedDataEntriesCount > 0 || pendingUnevaluatedDraftInputValues;

  const EvaluationSyncStatusElement = shouldStatusElementBeDisplayed ? (
    <div
      css={{
        backgroundColor: theme.colors.backgroundPrimary,
        border: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {pendingUnevaluatedDraftInputValues ? (
        <FormattedMessage
          defaultMessage="You have added rows with new input values, but you still need to evaluate the new data in order to save it."
          description="Experiment page > artifact compare view > prompt lab artifact synchronization > unevaluated rows indicator"
        />
      ) : isSyncingArtifacts ? (
        <Typography.Text>
          <FormattedMessage
            defaultMessage="Synchronizing artifacts for {runsBeingSynchronizedCount} runs..."
            description="Experiment page > artifact compare view > prompt lab artifact synchronization > loading state"
            values={{
              runsBeingSynchronizedCount: <strong>{runsBeingSynchronizedCount}</strong>,
            }}
          />
        </Typography.Text>
      ) : (
        <Typography.Text>
          <FormattedMessage
            defaultMessage={`You have <strong>{unsyncedDataEntriesCount}</strong> unsaved evaluated {unsyncedDataEntriesCount, plural, =1 {value} other {values}}. Click "Save" button or press {keyCombination} keys to synchronize the artifact data.`}
            description="Experiment page > artifact compare view > prompt lab artifact synchronization > pending changes indicator"
            values={{
              strong: (value) => <strong>{value}</strong>,
              unsyncedDataEntriesCount,
              keyCombination: isMacKeyboard() ? '⌘CMD+S' : 'CTRL+S',
            }}
          />
        </Typography.Text>
      )}
      <div css={{ display: 'flex', gap: theme.spacing.sm }}>
        <Button
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_hooks_useevaluationartifactwriteback.tsx_102"
          disabled={isSyncingArtifacts}
          onClick={discard}
        >
          <FormattedMessage
            defaultMessage="Discard"
            description="Experiment page > artifact compare view > prompt lab artifact synchronization > submit button label"
          />
        </Button>{' '}
        {/* Display "Save" button only if there are actual evaluated data to sync (don't allow to sync empty draft rows) */}
        {unsyncedDataEntriesCount > 0 && (
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_hooks_useevaluationartifactwriteback.tsx_110"
            loading={isSyncingArtifacts}
            type="primary"
            onClick={synchronizeArtifactData}
          >
            <FormattedMessage
              defaultMessage="Save"
              description="Experiment page > artifact compare view > prompt lab artifact synchronization > cancel button label"
            />
          </Button>
        )}
      </div>
    </div>
  ) : null;

  return { isSyncingArtifacts, EvaluationSyncStatusElement };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptEvaluationInputValues.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/usePromptEvaluationInputValues.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { usePromptEvaluationInputValues } from './usePromptEvaluationInputValues';

jest.useFakeTimers();

describe('usePromptEvaluationInputValues', () => {
  const mountTestComponent = () => {
    const { result } = renderHook(() => usePromptEvaluationInputValues());
    return { getHookResult: () => result.current };
  };

  it('should properly extract and update variables', () => {
    const { getHookResult } = mountTestComponent();

    const { updateInputVariableValue, updateInputVariables } = getHookResult();

    // Assert the initial variable set
    expect(getHookResult().inputVariables).toEqual([]);

    // Update the prompt template
    updateInputVariables('a variable {{a}} and the other one {{b}}');

    // Checking immediately, we should still be seeing the old one
    expect(getHookResult().inputVariables).toEqual([]);

    // Wait for .5s
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // We should have the input variable list updated
    expect(getHookResult().inputVariables).toEqual(expect.arrayContaining(['a', 'b']));

    // Set and assert some values
    act(() => {
      updateInputVariableValue('a', 'value of a');
      updateInputVariableValue('b', 'value of b');
    });

    expect(getHookResult().inputVariableValues).toEqual({ a: 'value of a', b: 'value of b' });
  });

  it('should properly report variable name violations', async () => {
    const { getHookResult } = mountTestComponent();

    const { updateInputVariables } = getHookResult();

    updateInputVariables('a variable {{a}} and the other one {{b}}');

    // Wait for .5s
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(getHookResult().inputVariableNameViolations).toEqual({ namesWithSpaces: [] });

    await act(async () => {
      updateInputVariables('a variable {{a}} and the other one {{x y z}}');
    });

    // Wait for .5s
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(getHookResult().inputVariableNameViolations).toEqual({ namesWithSpaces: ['x y z'] });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: usePromptEvaluationInputValues.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/usePromptEvaluationInputValues.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce, fromPairs, isEqual } from 'lodash';
import {
  DEFAULT_PROMPTLAB_INPUT_VALUES,
  extractPromptInputVariables,
  getPromptInputVariableNameViolations,
} from '../../prompt-engineering/PromptEngineering.utils';

export const usePromptEvaluationInputValues = () => {
  const [inputVariables, updateInputVariablesDirect] = useState<string[]>(extractPromptInputVariables(''));

  const [inputVariableNameViolations, setInputVariableNameViolations] = useState<
    ReturnType<typeof getPromptInputVariableNameViolations>
  >({ namesWithSpaces: [] });

  const [inputVariableValues, updateInputVariableValues] =
    useState<Record<string, string>>(DEFAULT_PROMPTLAB_INPUT_VALUES);

  const clearInputVariableValues = useCallback(() => updateInputVariableValues({}), []);

  const updateInputVariables = useMemo(
    () =>
      // Prevent calculating new input variable set on every keystroke of a template,
      // let's debounce it by 250ms
      debounce((promptTemplate: string) => {
        updateInputVariablesDirect((currentInputVariables) => {
          const newInputVariables = extractPromptInputVariables(promptTemplate);
          if (!isEqual(newInputVariables, currentInputVariables)) {
            return newInputVariables;
          }
          return currentInputVariables;
        });
        setInputVariableNameViolations(getPromptInputVariableNameViolations(promptTemplate));
      }, 250),
    [],
  );

  const updateInputVariableValue = useCallback((name: string, value: string) => {
    updateInputVariableValues((values) => ({ ...values, [name]: value }));
  }, []);

  // Sanitize the variable dictionary so only actually used variables
  // will be returned (discard leftovers from previous prompt templates)
  const sanitizedInputVariableValues = useMemo(
    () => fromPairs(Object.entries(inputVariableValues).filter(([key]) => inputVariables.includes(key))),
    [inputVariableValues, inputVariables],
  );

  return {
    updateInputVariables,
    inputVariables,
    inputVariableValues: sanitizedInputVariableValues,
    updateInputVariableValue,
    inputVariableNameViolations,
    clearInputVariableValues,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptEvaluationParameters.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/usePromptEvaluationParameters.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { defineMessage } from 'react-intl';

// Hardcoded model parameter definitions
const parameterDefinitions: {
  name: 'temperature' | 'max_tokens' | 'stop';
  type: 'slider' | 'input' | 'list';
  string: MessageDescriptor;
  helpString: MessageDescriptor;
  max?: number;
  min?: number;
  step?: number;
}[] = [
  {
    type: 'slider',
    name: 'temperature',
    string: defineMessage({
      defaultMessage: 'Temperature',
      description: 'Experiment page > prompt lab > temperature parameter label',
    }),
    helpString: defineMessage({
      defaultMessage: 'Increase or decrease the confidence level of the language model.',
      description: 'Experiment page > prompt lab > temperature parameter help text',
    }),
    max: 1,
    min: 0,
    step: 0.01,
  },
  {
    type: 'input',
    name: 'max_tokens',
    string: defineMessage({
      defaultMessage: 'Max tokens',
      description: 'Experiment page > prompt lab > max tokens parameter label',
    }),
    helpString: defineMessage({
      defaultMessage: 'Maximum number of language tokens returned from evaluation.',
      description: 'Experiment page > prompt lab > max tokens parameter help text',
    }),
    max: 64 * 1024,
    min: 1,
    step: 1,
  },
  {
    type: 'list',
    name: 'stop',
    string: defineMessage({
      defaultMessage: 'Stop Sequences',
      description: 'Experiment page > prompt lab > stop parameter label',
    }),
    helpString: defineMessage({
      defaultMessage: 'Specify sequences that signal the model to stop generating text.',
      description: 'Experiment page > prompt lab > stop parameter help text',
    }),
  },
];

// TODO: Fetch better values for default parameters
const DEFAULT_PARAMETER_VALUES = {
  temperature: 0.01,
  max_tokens: 100,
};

export const usePromptEvaluationParameters = () => {
  const [parameters, updateParameters] = useState<{
    temperature: number;
    max_tokens: number;
    stop?: string[] | undefined;
  }>(DEFAULT_PARAMETER_VALUES);

  const updateParameter = useCallback((name: string, value: number | string[]) => {
    updateParameters((currentParameters) => ({ ...currentParameters, [name]: value }));
  }, []);

  return {
    parameterDefinitions,
    parameters,
    updateParameter,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptEvaluationPromptTemplateValue.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/usePromptEvaluationPromptTemplateValue.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { usePromptEvaluationPromptTemplateValue } from './usePromptEvaluationPromptTemplateValue';
import { extractPromptInputVariables } from '../../prompt-engineering/PromptEngineering.utils';

describe('usePromptEvaluationPromptTemplateValue', () => {
  test('should properly generate subsequent template variable names', async () => {
    const { result } = renderHook(() => usePromptEvaluationPromptTemplateValue());
    expect(result.current.promptTemplate).toBeTruthy();

    await act(async () => {
      result.current.updatePromptTemplate('some new prompt template {{my_var}}');
    });

    expect(result.current.promptTemplate).toEqual('some new prompt template {{my_var}}');

    await act(async () => {
      result.current.handleAddVariableToTemplate();
      result.current.handleAddVariableToTemplate();
      result.current.handleAddVariableToTemplate();
    });

    expect(extractPromptInputVariables(result.current.promptTemplate)).toEqual([
      'my_var',
      'new_variable',
      'new_variable_2',
      'new_variable_3',
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: usePromptEvaluationPromptTemplateValue.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/hooks/usePromptEvaluationPromptTemplateValue.ts
Signals: React

```typescript
import React, { useCallback, useRef, useState } from 'react';

import type { TextAreaRef } from '@databricks/design-system';
import {
  DEFAULT_PROMPTLAB_NEW_TEMPLATE_VALUE,
  extractPromptInputVariables,
} from '../../prompt-engineering/PromptEngineering.utils';
import { max } from 'lodash';

const newVariableStartSegment = ' {{ ';
const newVariableEndSegment = ' }}';
const newDefaultVariableName = 'new_variable';

const getNewVariableName = (alreadyExistingVariableNames: string[] = []) => {
  if (!alreadyExistingVariableNames.includes(newDefaultVariableName)) {
    return newDefaultVariableName;
  }

  const maximumVariableNameIndex =
    max(alreadyExistingVariableNames.map((name) => parseInt(name.match(/new_variable_(\d+)/)?.[1] || '1', 10))) || 1;

  return `${newDefaultVariableName}_${maximumVariableNameIndex + 1}`;
};

/**
 * Keeps track of the current prompt value and exports method for adding + autoselecting new variables
 */
export const usePromptEvaluationPromptTemplateValue = () => {
  const [promptTemplate, updatePromptTemplate] = useState(DEFAULT_PROMPTLAB_NEW_TEMPLATE_VALUE);

  const promptTemplateRef = useRef<HTMLTextAreaElement>();

  const handleAddVariableToTemplate = useCallback(() => {
    updatePromptTemplate((template) => {
      const newVariableName = getNewVariableName(extractPromptInputVariables(template));
      const newValue = `${template}${newVariableStartSegment}${newVariableName}${newVariableEndSegment}`;

      // Wait until the next execution frame
      requestAnimationFrame(() => {
        const textAreaElement = promptTemplateRef.current;
        if (!textAreaElement) {
          return;
        }
        // Focus the element and set the newly added variable name
        textAreaElement.focus();
        textAreaElement.setSelectionRange(
          newValue.length - newVariableName.length - newVariableEndSegment.length,
          newValue.length - newVariableEndSegment.length,
        );
      });
      return newValue;
    });
  }, [updatePromptTemplate]);

  const savePromptTemplateInputRef = useCallback((ref: TextAreaRef) => {
    promptTemplateRef.current = ref?.resizableTextArea?.textArea;
  }, []);

  return {
    savePromptTemplateInputRef,
    handleAddVariableToTemplate,
    promptTemplate,
    updatePromptTemplate,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: PromptEngineeringErrorUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/utils/PromptEngineeringErrorUtils.ts

```typescript
import { ErrorWrapper } from '../../../../common/utils/ErrorWrapper';
import { GatewayErrorWrapper } from '../../../utils/LLMGatewayUtils';

/**
 * Due to multiple invocation methods, there are multiple error types that can be thrown.
 * This function extracts the proper error message from the error object.
 */
export const getPromptEngineeringErrorMessage = (e: GatewayErrorWrapper | ErrorWrapper | Error) => {
  const errorMessage =
    e instanceof GatewayErrorWrapper
      ? e.getGatewayErrorMessage()
      : e instanceof ErrorWrapper
      ? e.getMessageField()
      : e.message;

  return errorMessage;
};
```

--------------------------------------------------------------------------------

---[FILE: PromptExamples.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/utils/PromptExamples.ts

```typescript
export const PROMPT_TEMPLATE_EXAMPLES = [
  {
    prompt: [
      'You are a marketing consultant for a technology company. Develop a marketing strategy report for {{ company_name }} aiming to {{ company_goal }}',
    ],
    variables: [
      {
        name: 'company_name',
        value: 'XYZ Company',
      },
      {
        name: 'company_goal',
        value: 'Increase top-line revenue',
      },
    ],
  },
  {
    prompt: [
      'You are a helpful and friendly customer support chatbot. Answer the users question "{{ user_question }}" clearly, based on the following documentation: {{ documentation }}',
    ],
    variables: [
      {
        name: 'user_question',
        value: 'Is MLflow open source?',
      },
      {
        name: 'documentation',
        value: 'MLflow is an open source platform for managing the end-to-end machine learning lifecycle.',
      },
    ],
  },
  {
    prompt: [
      'Summarize the given text "{{ text }}" into a concise and coherent summary, capturing the main ideas and key points. Make sure that the summary does not exceed {{ word_count }} words.',
    ],
    variables: [
      {
        name: 'text',
        value:
          'Although C. septempunctata larvae and adults mainly eat aphids, they also feed on Thysanoptera, Aleyrodidae, on the larvae of Psyllidae and Cicadellidae, and on eggs and larvae of some beetles and butterflies. There are one or two generations per year. Adults overwinter in ground litter in parks, gardens and forest edges and under tree bark and rocks. C. septempunctata has a broad ecological range, generally living wherever there are aphids for it to eat. This includes, amongst other biotopes, meadows, fields, Pontic–Caspian steppe, parkland, gardens, Western European broadleaf forests and mixed forests. In the United Kingdom, there are fears that the seven-spot ladybird is being outcompeted for food by the harlequin ladybird. An adult seven-spot ladybird may reach a body length of 7.6–12.7 mm (0.3–0.5 in). Their distinctive spots and conspicuous colours warn of their toxicity, making them unappealing to predators. The species can secrete a fluid from joints in their legs which gives them a foul taste. A threatened ladybird may both play dead and secrete the unappetising substance to protect itself. The seven-spot ladybird synthesizes the toxic alkaloids, N-oxide coccinelline and its free base precoccinelline; depending on sex and diet, the spot size and coloration can provide some indication of how toxic the individual insect is to potential predators.',
      },
      {
        name: 'word_count',
        value: '75',
      },
    ],
  },
  {
    prompt: [
      'Generate a list of ten titles for my book. The book is about {{ topic }}. Each title should be between {{ word_range }} words long.',
      '### Examples of great titles ###',
      '{{ examples }}',
    ],
    variables: [
      {
        name: 'topic',
        value:
          'my journey as an adventurer who has lived an unconventional life, meeting many different personalities and finally finding peace in gardening.',
      },
      {
        name: 'word_range',
        value: 'two to five',
      },
      {
        name: 'examples',
        value: '"Long walk to freedom", "Wishful drinking", "I know why the caged bird sings"',
      },
    ],
  },
  {
    prompt: [
      'Generate a SQL query from a user’s question, using the information from the table.',
      'Question: {{ user_question }}',
      'Table Information: {{ table_information }}',
    ],
    variables: [
      {
        name: 'user_question',
        value: 'Which product generated the most sales this month?',
      },
      {
        name: 'table_information',
        value:
          'CREATE TABLE Sales (SaleID INT PRIMARY KEY, ProductID INT, SaleDate DATE, CustomerID INT, QuantitySold INT, UnitPrice DECIMAL(10, 2));',
      },
    ],
  },
];
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/constants.ts

```typescript
// Hardcoded file names corresponding to evaluation traces table files defined in MLflow
export const EVALUATIONS_ARTIFACT_FILE_NAME = '_evaluations.json';
export const METRICS_ARTIFACT_FILE_NAME = '_metrics.json';
export const ASSESSMENTS_ARTIFACT_FILE_NAME = '_assessments.json';
export const TAGS_ARTIFACT_FILE_NAME = '_tags.json';

// Counts the number of times the monitoring tab is clicked
export const AGENT_MONITORING_TAB_VIEW = 'mlflow.evaluations_review.agent_monitoring_tab_view';
// Counts the number of times the monitoring charts view is clicked
export const AGENT_MONITORING_CHARTS_VIEW = 'mlflow.evaluations_review.agent_monitoring_charts_view';
// Counts the number of times the monitoring log view is clicked
export const AGENT_MONITORING_LOGS_VIEW = 'mlflow.evaluations_review.agent_monitoring_logs_view';
```

--------------------------------------------------------------------------------

````

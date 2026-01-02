---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 457
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 457 of 991)

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

---[FILE: ShowArtifactVideoView.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/ShowArtifactVideoView.tsx
Signals: React

```typescript
import React, { useEffect, useState } from 'react';
import { LegacySkeleton } from '@databricks/design-system';
import {
  getArtifactBlob,
  getArtifactLocationUrl,
  getLoggedModelArtifactLocationUrl,
} from '../../../common/utils/ArtifactUtils';
import type { LoggedModelArtifactViewerProps } from './ArtifactViewComponents.types';

type Props = {
  runUuid: string;
  path: string;
  getArtifact?: (...args: any[]) => any;
} & LoggedModelArtifactViewerProps;

const ShowArtifactVideoView = ({
  runUuid,
  path,
  getArtifact = getArtifactBlob,
  isLoggedModelsMode,
  loggedModelId,
}: Props) => {
  const [videoUrl, setVideoUrl] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objUrl: string | undefined;

    const artifactUrl =
      isLoggedModelsMode && loggedModelId
        ? getLoggedModelArtifactLocationUrl(path, loggedModelId)
        : getArtifactLocationUrl(path, runUuid);

    getArtifact(artifactUrl).then((blob: Blob) => {
      objUrl = URL.createObjectURL(blob);
      setVideoUrl(objUrl);
      setLoading(false);
    });

    return () => {
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [runUuid, path, isLoggedModelsMode, loggedModelId, getArtifact]);

  const classNames = {
    videoOuterContainer: {
      padding: 10,
      overflow: 'hidden',
      background: 'black',
      minHeight: '100%',
    },
    hidden: { display: 'none' },
    video: {
      maxWidth: '100%',
      maxHeight: '62.5vh',
      objectFit: 'fit',
      display: 'block',
    },
  };

  return (
    <div css={{ flex: 1 }}>
      <div css={classNames.videoOuterContainer}>
        {loading && <LegacySkeleton active />}
        {videoUrl && (
          <video
            css={loading ? classNames.hidden : classNames.video}
            src={videoUrl}
            controls
            preload="auto"
            aria-label="video"
          >
            <track kind="captions" srcLang="en" src="" default />
          </video>
        )}
      </div>
    </div>
  );
};

export default ShowArtifactVideoView;
```

--------------------------------------------------------------------------------

---[FILE: fetchArtifactUnified.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/utils/fetchArtifactUnified.test.tsx

```typescript
import { jest, describe, it, expect } from '@jest/globals';
import { rest } from 'msw';
import { setupServer } from '../../../../common/utils/setup-msw';
import { fetchArtifactUnified } from './fetchArtifactUnified';

describe('fetchArtifactUnified', () => {
  const experimentId = 'test-experiment-id';
  const runUuid = 'test-run-uuid';
  const isLoggedModelsMode = true;
  const loggedModelId = 'test-logged-model-id';
  const path = '/path/to/artifact';

  const runArtifactContent = 'test-run-artifact-content';
  const loggedModelArtifactContent = 'test-logged-model-artifact-content';

  const server = setupServer(
    rest.get('/get-artifact', (req, res, ctx) => {
      return res(ctx.body(runArtifactContent));
    }),
    rest.get('/ajax-api/2.0/mlflow/get-artifact', (req, res, ctx) => {
      return res(ctx.body(runArtifactContent));
    }),
    rest.get('/ajax-api/2.0/mlflow/logged-models/test-logged-model-id/artifacts/files', (req, res, ctx) => {
      return res(ctx.body(loggedModelArtifactContent));
    }),
  );

  it('fetches run artifact from workspace API', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await fetchArtifactUnified({
      experimentId,
      path,
      runUuid,
      isLoggedModelsMode: false,
      loggedModelId: undefined,
    });

    expect(result).toEqual(runArtifactContent);
    jest.restoreAllMocks();
  });

  it('fetches logged model artifact from workspace API', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await fetchArtifactUnified({ experimentId, path, runUuid, isLoggedModelsMode, loggedModelId });

    expect(result).toEqual(loggedModelArtifactContent);
    jest.restoreAllMocks();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: fetchArtifactUnified.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/utils/fetchArtifactUnified.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import {
  type getArtifactBytesContent,
  getArtifactContent,
  getArtifactLocationUrl,
  getLoggedModelArtifactLocationUrl,
} from '../../../../common/utils/ArtifactUtils';
import type { KeyValueEntity } from '../../../../common/types';

type FetchArtifactParams = {
  experimentId: string;
  runUuid: string;
  path: string;
  isLoggedModelsMode?: boolean;
  loggedModelId?: string;
  entityTags?: Partial<KeyValueEntity>[];
};

type GetArtifactContentFn = typeof getArtifactContent | typeof getArtifactBytesContent;

// Internal util, strips leading slash from the path if it exists
const normalizeArtifactPath = (path: string) => (path.startsWith('/') ? path.substring(1) : path);

// Internal util that generates the artifact location URL for the workspace API
const getWorkspaceArtifactLocationUrl = (params: FetchArtifactParams) => {
  const { runUuid, path, isLoggedModelsMode, loggedModelId } = params;
  if (isLoggedModelsMode && loggedModelId) {
    return getLoggedModelArtifactLocationUrl(path, loggedModelId);
  }
  return getArtifactLocationUrl(path, runUuid);
};

/**
 * A function that provides a unified function for fetching artifacts, either from the workspace API or SPN API.
 */
export const fetchArtifactUnified = (
  params: FetchArtifactParams,
  getArtifactDataFn: GetArtifactContentFn = getArtifactContent,
) => {
  const workspaceAPIArtifactLocation = getWorkspaceArtifactLocationUrl(params);

  return getArtifactDataFn(workspaceAPIArtifactLocation);
};

export type FetchArtifactUnifiedFn<T = string> = (
  params: FetchArtifactParams,
  getArtifactDataFn: GetArtifactContentFn,
) => Promise<T>;
```

--------------------------------------------------------------------------------

---[FILE: setupReactPDFWorker.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/artifact-view-components/utils/setupReactPDFWorker.ts

```typescript
// eslint-disable-next-line import/no-namespace
import type * as pdfjs from 'pdfjs-dist';

export function setupReactPDFWorker(pdfjsInstance: typeof pdfjs) {
  pdfjsInstance.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
}
```

--------------------------------------------------------------------------------

---[FILE: CreateNotebookRunModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/CreateNotebookRunModal.tsx

```typescript
import {
  Button,
  CopyIcon,
  Input,
  Modal,
  LegacyTabPane,
  LegacyTabs,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { CodeSnippet } from '@databricks/web-shared/snippet';
import { CopyButton } from '../../../shared/building_blocks/CopyButton';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  experimentId: string;
};

const SNIPPET_LINE_HEIGHT = 18;

export const CreateNotebookRunModal = ({ isOpen, closeModal, experimentId }: Props): JSX.Element => {
  const { theme } = useDesignSystemTheme();

  const codeSnippetTheme = theme.isDarkMode ? 'duotoneDark' : 'light';

  const classical_ml_text = `
import mlflow
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor

# set the experiment id
mlflow.set_experiment(experiment_id="${experimentId}")

mlflow.autolog()
db = load_diabetes()

X_train, X_test, y_train, y_test = train_test_split(db.data, db.target)

# Create and train models.
rf = RandomForestRegressor(n_estimators=100, max_depth=6, max_features=3)
rf.fit(X_train, y_train)

# Use the model to make predictions on the test dataset.
predictions = rf.predict(X_test)
`.trimStart();

  const llm_text = `
import mlflow
import openai
import os
import pandas as pd

# you must set the OPENAI_API_KEY environment variable
assert (
  "OPENAI_API_KEY" in os.environ
), "Please set the OPENAI_API_KEY environment variable."

# set the experiment id
mlflow.set_experiment(experiment_id="${experimentId}")

system_prompt = (
  "The following is a conversation with an AI assistant."
  + "The assistant is helpful and very friendly."
)

# start a run
mlflow.start_run()
mlflow.log_param("system_prompt", system_prompt)

# Create a question answering model using prompt engineering
# with OpenAI. Log the model to MLflow Tracking
logged_model = mlflow.openai.log_model(
    model="gpt-4o-mini",
    task=openai.chat.completions,
    artifact_path="model",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "{question}"},
    ],
)

# Evaluate the model on some example questions
questions = pd.DataFrame(
    {
        "question": [
            "How do you create a run with MLflow?",
            "How do you log a model with MLflow?",
            "What is the capital of France?",
        ]
    }
)
mlflow.evaluate(
    model=logged_model.model_uri,
    model_type="question-answering",
    data=questions,
)
mlflow.end_run()
`.trimStart();

  const codeSnippetMessage = () => {
    return 'Run this code snippet in a notebook or locally, to create an experiment run';
  };

  // Calculate stable height for the code snippet UI area, based on the line count of the shortest one
  const snippetHeight =
    (Math.min(...[classical_ml_text, llm_text].map((text) => text.split('\n').length)) + 1) * SNIPPET_LINE_HEIGHT;

  return (
    <Modal
      componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_createnotebookrunmodal.tsx_111"
      visible={isOpen}
      onCancel={closeModal}
      onOk={closeModal}
      footer={
        <div css={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
          <Button
            componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_createnotebookrunmodal.tsx_117"
            onClick={closeModal}
            type="primary"
          >
            <FormattedMessage
              defaultMessage="Okay"
              description="Experiment page > new notebook run modal > okay button label"
            />
          </Button>
        </div>
      }
      title={
        <div>
          <Typography.Title level={2} css={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
            <FormattedMessage
              defaultMessage="New run using notebook"
              description="Experiment page > new notebook run modal > modal title"
            />
          </Typography.Title>
          <Typography.Hint css={{ marginTop: 0, fontWeight: 'normal' }}>{codeSnippetMessage()}</Typography.Hint>
        </div>
      }
    >
      <LegacyTabs>
        <LegacyTabPane
          tab={<FormattedMessage defaultMessage="Classical ML" description="Example text snippet for classical ML" />}
          key="classical-ml"
        >
          <CodeSnippet
            style={{ padding: '5px', height: snippetHeight }}
            language="python"
            theme={codeSnippetTheme}
            actions={
              <div
                style={{
                  marginTop: theme.spacing.sm,
                  marginRight: theme.spacing.md,
                }}
              >
                <CopyButton copyText={classical_ml_text} showLabel={false} icon={<CopyIcon />} />
              </div>
            }
          >
            {classical_ml_text}
          </CodeSnippet>
        </LegacyTabPane>
        <LegacyTabPane
          tab={<FormattedMessage defaultMessage="LLM" description="Example text snippet for LLM" />}
          key="llm"
        >
          <CodeSnippet
            style={{ padding: '5px', height: snippetHeight }}
            language="python"
            theme={codeSnippetTheme}
            actions={
              <div
                style={{
                  marginTop: theme.spacing.sm,
                  marginRight: theme.spacing.md,
                }}
              >
                <CopyButton copyText={llm_text} showLabel={false} icon={<CopyIcon />} />
              </div>
            }
          >
            {llm_text}
          </CodeSnippet>
        </LegacyTabPane>
      </LegacyTabs>
    </Modal>
  );
};

const styles = {
  formItem: { marginBottom: 16 },
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationArtifactCompare.utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/EvaluationArtifactCompare.utils.ts

```typescript
export const EVALUATION_ARTIFACTS_TEXT_COLUMN_WIDTH = {
  // Default width of "group by" columns
  initialWidthGroupBy: 200,
  // Default width of "compare" (output) columns
  initialWidthOutput: 360,
  maxWidth: 500,
  minWidth: 140,
};
export const EVALUATION_ARTIFACTS_TABLE_ROW_HEIGHT = 190;

export const getEvaluationArtifactsTableHeaderHeight = (isExpanded = false, includePlaceForMetadata = false) => {
  // If there is no metadata displayed at all, prepare
  // 40 px for group header plus 40 px for the run name
  if (!includePlaceForMetadata) {
    return 80;
  }

  // If there's a metadata to be displayed, base the resulting height
  // on the header expansion. Pixel values according to designs.
  return 40 + (isExpanded ? 175 : 62);
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationArtifactCompareView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/EvaluationArtifactCompareView.test.tsx
Signals: React, Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import type { EvaluationDataReduxState } from '../../reducers/EvaluationDataReducer';
import { EvaluationArtifactCompareView } from './EvaluationArtifactCompareView';
import configureStore from 'redux-mock-store';
import type { RunRowType } from '../experiment-page/utils/experimentPage.row-types';
import { ExperimentPageViewState } from '../experiment-page/models/ExperimentPageViewState';
import { renderWithIntl, act, within, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

import { getEvaluationTableArtifact } from '../../actions';
import { MLFLOW_LOGGED_ARTIFACTS_TAG, MLFLOW_RUN_SOURCE_TYPE_TAG, MLflowRunSourceType } from '../../constants';
import type { EvaluationArtifactCompareTableProps } from './components/EvaluationArtifactCompareTable';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import userEventGlobal, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { useState } from 'react';
import { DesignSystemProvider } from '@databricks/design-system';

// Disable pointer events check for DialogCombobox which masks the elements we want to click
const userEvent = userEventGlobal.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

jest.mock('../../actions', () => ({
  getEvaluationTableArtifact: jest
    .fn()
    .mockReturnValue({ type: 'GETEVALUATIONTABLEARTIFACT', payload: Promise.resolve() }),
}));

jest.mock('./components/EvaluationArtifactCompareTable', () => ({
  EvaluationArtifactCompareTable: ({
    visibleRuns,
    resultList,
    groupByColumns,
    onCellClick,
  }: EvaluationArtifactCompareTableProps) => (
    <div data-testid="mock-compare-table">
      {/* Render a super simple but functional variant of results table */}
      {resultList.map((result) => (
        <div key={result.key}>
          {groupByColumns.map((groupByCol) => (
            <div key={`groupby-${groupByCol}-${result.key}`} data-testid="group-by-cell">
              {result.groupByCellValues[groupByCol]}
            </div>
          ))}
          {visibleRuns.map(({ runUuid }) => (
            <button
              key={`result-${runUuid}-${result.key}`}
              data-testid={`result-${runUuid}-${result.key}`}
              onClick={() => onCellClick?.(result.cellValues[runUuid].toString(), runUuid)}
            >
              {`row ${result.key}, run ${runUuid}, result ${result.cellValues[runUuid] || '(empty)'}`}
            </button>
          ))}
        </div>
      ))}
    </div>
  ),
}));

const SAMPLE_COMPARED_RUNS: RunRowType[] = [
  {
    runUuid: 'run_a',
    tags: {
      [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
        key: MLFLOW_LOGGED_ARTIFACTS_TAG,
        value: '[{"path":"/table.json","type":"table"}]',
      },
    },
  },
  {
    runUuid: 'run_b',
    tags: {
      [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
        key: MLFLOW_LOGGED_ARTIFACTS_TAG,
        value: '[{"path":"/table.json","type":"table"}]',
      },
    },
  },
  {
    runUuid: 'run_c',
    tags: {
      [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
        key: MLFLOW_LOGGED_ARTIFACTS_TAG,
        value: '[{"path":"/table_c.json","type":"table"}]',
      },
    },
  },
] as any;

const SAMPLE_STATE = {
  evaluationArtifactsBeingUploaded: {},
  evaluationArtifactsByRunUuid: {
    run_a: {
      '/table.json': {
        columns: ['col_group', 'col_output'],
        path: '/table.json',
        entries: [
          { col_group: 'question_1', col_output: 'answer_1_run_a' },
          { col_group: 'question_2', col_output: 'answer_2_run_a' },
        ],
      },
    },
    run_b: {
      '/table.json': {
        columns: ['col_group', 'col_output'],
        path: '/table.json',
        entries: [
          { col_group: 'question_1', col_output: 'answer_1_run_b' },
          { col_group: 'question_2', col_output: 'answer_2_run_b' },
        ],
      },
    },
    run_c: {
      '/table_c.json': {
        columns: ['col_group', 'col_output'],
        path: '/table_c.json',
        entries: [
          { col_group: 'question_1', col_output: 'answer_1_run_c' },
          { col_group: 'question_2', col_output: 'answer_2_run_c' },
        ],
      },
    },
  },

  evaluationDraftInputValues: [],
  evaluationPendingDataByRunUuid: {},
  evaluationPendingDataLoadingByRunUuid: {},
  evaluationArtifactsErrorByRunUuid: {},
  evaluationArtifactsLoadingByRunUuid: {},
};

const IMAGE_JSON = {
  type: 'image',
  filepath: 'fakePathUncompressed',
  compressed_filepath: 'fakePath',
};

const SAMPLE_STATE_WITH_IMAGES = {
  evaluationArtifactsBeingUploaded: {},
  evaluationArtifactsByRunUuid: {
    run_a: {
      '/table.json': {
        columns: ['col_group', 'col_group_2', 'col_output'],
        path: '/table.json',
        entries: [
          { col_group: 'question_1', col_group_2: 'question_1', col_output: IMAGE_JSON },
          { col_group: 'question_2', col_group_2: 'question_2', col_output: IMAGE_JSON },
        ],
      },
    },
    run_b: {
      '/table.json': {
        columns: ['col_group', 'col_output'],
        path: '/table.json',
        entries: [
          { col_group: 'question_1', col_group_2: 'question_1', col_output: IMAGE_JSON },
          { col_group: 'question_2', col_group_2: 'question_2', col_output: IMAGE_JSON },
        ],
      },
    },
  },

  evaluationDraftInputValues: [],
  evaluationPendingDataByRunUuid: {},
  evaluationPendingDataLoadingByRunUuid: {},
  evaluationArtifactsErrorByRunUuid: {},
  evaluationArtifactsLoadingByRunUuid: {},
};

describe('EvaluationArtifactCompareView', () => {
  const mountTestComponent = ({
    comparedRuns = SAMPLE_COMPARED_RUNS,
    mockState = SAMPLE_STATE,
    viewState = new ExperimentPageViewState(),
  }: {
    viewState?: ExperimentPageViewState;
    mockState?: EvaluationDataReduxState;
    comparedRuns?: RunRowType[];
  } = {}) => {
    const mockStore = configureStore([thunk, promiseMiddleware()])({
      evaluationData: mockState,
      modelGateway: { modelGatewayRoutesLoading: {} },
    });
    const updateSearchFacetsMock = jest.fn();
    const updateViewStateMock = jest.fn();
    let setVisibleRunsFn: React.Dispatch<React.SetStateAction<RunRowType[]>>;
    const TestComponent = () => {
      const [visibleRuns, setVisibleRuns] = useState(comparedRuns);
      setVisibleRunsFn = setVisibleRuns;
      return (
        <Provider store={mockStore}>
          <DesignSystemProvider>
            <EvaluationArtifactCompareView
              comparedRuns={visibleRuns}
              updateViewState={updateViewStateMock}
              viewState={viewState}
              onDatasetSelected={() => {}}
            />
          </DesignSystemProvider>
        </Provider>
      );
    };
    const renderResult = renderWithIntl(<TestComponent />);
    return {
      updateSearchFacetsMock,
      updateViewStateMock,
      renderResult,
      setVisibleRuns: (runs: RunRowType[]) => setVisibleRunsFn(runs),
    };
  };

  test('checks if the initial tables are properly fetched', async () => {
    mountTestComponent();

    expect(getEvaluationTableArtifact).toHaveBeenCalledWith('run_a', '/table.json', false);
    expect(getEvaluationTableArtifact).toHaveBeenCalledWith('run_b', '/table.json', false);
  });
  test('checks if the newly selected table is being fetched', async () => {
    const { renderResult } = mountTestComponent();

    await userEvent.click(renderResult.getByTestId('dropdown-tables'));

    await userEvent.click(within(screen.getByRole('listbox')).getByLabelText('/table_c.json'));

    expect(getEvaluationTableArtifact).toHaveBeenCalledWith('run_c', '/table_c.json', false);
  });

  test('checks if the fetch artifact is properly called for differing tables', async () => {
    const { renderResult } = mountTestComponent({
      comparedRuns: [
        {
          runUuid: 'run_a',
          tags: {
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[{"path":"/table_a.json","type":"table"}]',
            },
          },
        },
        {
          runUuid: 'run_b',
          tags: {
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[{"path":"/table_b.json","type":"table"}]',
            },
          },
        },
      ] as any,
    });

    await userEvent.click(renderResult.getByTestId('dropdown-tables'));
    await userEvent.click(within(screen.getByRole('listbox')).getByLabelText('/table_a.json'));

    expect(getEvaluationTableArtifact).toHaveBeenCalledWith('run_a', '/table_a.json', false);
    expect(getEvaluationTableArtifact).not.toHaveBeenCalledWith('run_a', '/table_b.json', false);
    expect(getEvaluationTableArtifact).not.toHaveBeenCalledWith('run_b', '/table_a.json', false);
    expect(getEvaluationTableArtifact).not.toHaveBeenCalledWith('run_b', '/table_b.json', false);
  });

  test('checks if the table component receives proper result set based on the store data and selected table', async () => {
    mountTestComponent();

    // Check if the table "group by" column cells were properly populated
    expect(screen.getByText('question_1', { selector: '[data-testid="group-by-cell"]' })).toBeInTheDocument();
    expect(screen.getByText('question_2', { selector: '[data-testid="group-by-cell"]' })).toBeInTheDocument();

    // Check if the table output cells were properly populated
    [
      'row question_1, run run_a, result answer_1_run_a',
      'row question_1, run run_b, result answer_1_run_b',
      'row question_1, run run_c, result (empty)',
      'row question_2, run run_a, result answer_2_run_a',
      'row question_2, run run_b, result answer_2_run_b',
      'row question_2, run run_c, result (empty)',
    ].forEach((cellText) => {
      expect(screen.getByText(cellText, { selector: 'button' })).toBeInTheDocument();
    });

    expect.assertions(8);
  });

  test('checks if the preview sidebar renders proper details', async () => {
    const { renderResult } = mountTestComponent({
      viewState: Object.assign(new ExperimentPageViewState(), { previewPaneVisible: true }),
    });

    const previewSidebar = renderResult.getByTestId('preview-sidebar-content');
    expect(previewSidebar).toHaveTextContent(/Select a cell to display preview/);

    const run_a_question_1 = renderResult.getByTestId('result-run_a-question_1');
    const run_b_question_2 = renderResult.getByTestId('result-run_b-question_2');

    await userEvent.click(run_a_question_1);
    expect(previewSidebar).toHaveTextContent(/answer_1_run_a/);

    await userEvent.click(run_b_question_2);
    expect(previewSidebar).toHaveTextContent(/answer_2_run_b/);
  });

  test('checks if the component initializes with proper "group by" and "output" columns when evaluating prompt engineering artifacts', async () => {
    mountTestComponent({
      mockState: {
        ...SAMPLE_STATE,
        evaluationArtifactsByRunUuid: {
          run_a: {
            '/table_a.json': {
              columns: ['input_a', 'input_b', 'output'],
              path: '/table_a.json',
              entries: [],
            },
          },
          run_b: {
            '/table_b.json': {
              columns: ['input_b', 'output'],
              path: '/table_b.json',
              entries: [],
            },
          },
        },
      },
      comparedRuns: [
        {
          runUuid: 'run_a',
          params: [{ key: 'prompt_template', value: 'prompt template with {{input_a}} and {{input_b}}' }],
          tags: {
            [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
              key: MLFLOW_RUN_SOURCE_TYPE_TAG,
              value: MLflowRunSourceType.PROMPT_ENGINEERING,
            },
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[{"path":"/table_a.json","type":"table"}]',
            },
          },
        },
        {
          runUuid: 'run_b',
          params: [{ key: 'prompt_template', value: 'prompt template with {{input_c}}' }],
          tags: {
            [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
              key: MLFLOW_RUN_SOURCE_TYPE_TAG,
              value: MLflowRunSourceType.PROMPT_ENGINEERING,
            },
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[{"path":"/table_b.json","type":"table"}]',
            },
          },
          hidden: true,
        },
      ] as any,
    });

    await userEvent.click(screen.getByLabelText('Select "group by" columns'));

    expect(within(screen.getByRole('listbox')).getByLabelText('input_a')).toBeChecked();
    expect(within(screen.getByRole('listbox')).getByLabelText('input_b')).toBeChecked();

    expect(
      screen.getByRole('combobox', {
        name: 'Dialog Combobox, selected option: output',
      }),
    ).toBeInTheDocument();
  });

  test('checks if component behaves correctly if user deselects all "group by" columns', async () => {
    mountTestComponent({
      mockState: {
        ...SAMPLE_STATE,
        evaluationArtifactsByRunUuid: {
          run_a: {
            '/table_a.json': {
              columns: ['input_a', 'input_b', 'output'],
              path: '/table_a.json',
              entries: [],
            },
          },
          run_b: {
            '/table_b.json': {
              columns: ['input_b', 'output'],
              path: '/table_b.json',
              entries: [],
            },
          },
        },
      },
      comparedRuns: [
        {
          runUuid: 'run_a',
          params: [{ key: 'prompt_template', value: 'prompt template with {{input_a}} and {{input_b}}' }],
          tags: {
            [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
              key: MLFLOW_RUN_SOURCE_TYPE_TAG,
              value: MLflowRunSourceType.PROMPT_ENGINEERING,
            },
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[{"path":"/table_a.json","type":"table"}]',
            },
          },
        },
        {
          runUuid: 'run_b',
          params: [{ key: 'prompt_template', value: 'prompt template with {{input_c}}' }],
          tags: {
            [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
              key: MLFLOW_RUN_SOURCE_TYPE_TAG,
              value: MLflowRunSourceType.PROMPT_ENGINEERING,
            },
            [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
              key: MLFLOW_LOGGED_ARTIFACTS_TAG,
              value: '[{"path":"/table_b.json","type":"table"}]',
            },
          },
          hidden: true,
        },
      ] as any,
    });

    await userEvent.click(screen.getByLabelText('Select "group by" columns'));

    // Expect two "group by" columns to be initially selected
    expect(within(screen.getByRole('listbox')).getByLabelText('input_a')).toBeChecked();
    expect(within(screen.getByRole('listbox')).getByLabelText('input_b')).toBeChecked();

    expect(screen.queryByText('No group by columns selected')).not.toBeInTheDocument();

    // Deselect both columns
    await userEvent.click(within(screen.getByRole('listbox')).getByLabelText('input_a'));
    await userEvent.click(within(screen.getByRole('listbox')).getByLabelText('input_b'));

    // Expect proper message to appear
    expect(screen.getByText('No group by columns selected')).toBeInTheDocument();
  });

  test('checks if the component automatically re-selects "group by" columns when changing visible prompt engineering runs', async () => {
    const comparedRuns = [
      {
        runUuid: 'run_a',
        params: [{ key: 'prompt_template', value: 'prompt template with {{input_a}} and {{input_b}}' }],
        tags: {
          [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
            key: MLFLOW_RUN_SOURCE_TYPE_TAG,
            value: MLflowRunSourceType.PROMPT_ENGINEERING,
          },
          [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
            key: MLFLOW_LOGGED_ARTIFACTS_TAG,
            value: '[{"path":"/eval_results_table.json","type":"table"}]',
          },
        },
        hidden: true,
      },
      {
        runUuid: 'run_b',
        params: [{ key: 'prompt_template', value: 'prompt template with {{input_b}}' }],
        tags: {
          [MLFLOW_RUN_SOURCE_TYPE_TAG]: {
            key: MLFLOW_RUN_SOURCE_TYPE_TAG,
            value: MLflowRunSourceType.PROMPT_ENGINEERING,
          },
          [MLFLOW_LOGGED_ARTIFACTS_TAG]: {
            key: MLFLOW_LOGGED_ARTIFACTS_TAG,
            value: '[{"path":"/eval_results_table.json","type":"table"}]',
          },
        },
      },
    ];
    const { setVisibleRuns } = mountTestComponent({
      mockState: {
        ...SAMPLE_STATE,
        evaluationArtifactsByRunUuid: {
          run_a: {
            '/eval_results_table.json': {
              columns: ['input_a', 'input_b', 'output'],
              path: '/eval_results_table.json',
              entries: [],
            },
          },
          run_b: {
            '/eval_results_table.json': {
              columns: ['input_b', 'output'],
              path: '/eval_results_table.json',
              entries: [],
            },
          },
        },
      },
      comparedRuns: comparedRuns as any,
    });

    await userEvent.click(screen.getByLabelText('Select "group by" columns'));

    expect(within(screen.getByRole('listbox')).queryByLabelText('input_a')).not.toBeInTheDocument();
    expect(within(screen.getByRole('listbox')).getByLabelText('input_b')).toBeChecked();

    expect(
      screen.getByRole('combobox', {
        name: 'Dialog Combobox, selected option: output',
      }),
    ).toBeInTheDocument();

    // Unhide all runs
    await act(async () => {
      setVisibleRuns(comparedRuns.map((run) => ({ ...run, hidden: false })) as any);
    });

    expect(within(screen.getByRole('listbox')).getByLabelText('input_a')).toBeChecked();
    expect(within(screen.getByRole('listbox')).getByLabelText('input_b')).toBeChecked();
  });

  test('checks if relevant empty message is displayed when there are no logged evaluation tables', async () => {
    const { renderResult } = mountTestComponent({
      mockState: {
        ...SAMPLE_STATE,
        evaluationArtifactsByRunUuid: {
          run_a: {},
          run_b: {},
        },
      },
      comparedRuns: [
        {
          runUuid: 'run_a',
          params: [],
          tags: {},
        },
        {
          runUuid: 'run_b',
          params: [],
          tags: {},
        },
      ] as any,
    });

    expect(renderResult.getByTestId('dropdown-tables')).toBeDisabled();
    expect(renderResult.getByText(/No evaluation tables logged/)).toBeInTheDocument();
  });

  test('checks that image columns are correctly assigned to only be output columns', async () => {
    mountTestComponent({ mockState: SAMPLE_STATE_WITH_IMAGES });

    expect(getEvaluationTableArtifact).toHaveBeenCalledWith('run_a', '/table.json', false);
    expect(getEvaluationTableArtifact).toHaveBeenCalledWith('run_b', '/table.json', false);

    await userEvent.click(screen.getByLabelText('Select "group by" columns'));

    // Check that the group by columns are properly populated and recognizes image columns as non-groupable
    expect(within(screen.getByRole('listbox')).queryByLabelText('col_group')).toBeChecked();
    expect(within(screen.getByRole('listbox')).queryByLabelText('col_group')).toBeInTheDocument();
    expect(within(screen.getByRole('listbox')).queryByLabelText('col_group_2')).toBeInTheDocument();
    expect(within(screen.getByRole('listbox')).queryByLabelText('col_group_2')).not.toBeChecked();
    expect(within(screen.getByRole('listbox')).queryByLabelText('col_output')).not.toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

````

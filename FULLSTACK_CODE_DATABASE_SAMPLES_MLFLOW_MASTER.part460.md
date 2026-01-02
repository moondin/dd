---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 460
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 460 of 991)

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

---[FILE: EvaluationArtifactCompareTable.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationArtifactCompareTable.test.tsx
Signals: Redux/RTK

```typescript
import { jest, describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { EvaluationArtifactCompareTable } from './EvaluationArtifactCompareTable';
import { screen, waitFor, renderWithIntl } from '../../../../common/utils/TestUtils.react18';
import type { UseEvaluationArtifactTableDataResult } from '../hooks/useEvaluationArtifactTableData';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { BrowserRouter } from '../../../../common/utils/RoutingUtils';
import { DesignSystemProvider } from '@databricks/design-system';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(90000);

jest.mock('../../experiment-page/hooks/useExperimentRunColor', () => ({
  useGetExperimentRunColor: jest.fn().mockReturnValue((_: string) => '#000000'),
}));

describe('EvaluationArtifactCompareTable', () => {
  let originalImageSrc: any;

  beforeAll(() => {
    // Mock <img> src setter to trigger load callback
    originalImageSrc = Object.getOwnPropertyDescriptor(window.Image.prototype, 'src');
    Object.defineProperty(window.Image.prototype, 'src', {
      set() {
        setTimeout(() => this.onload?.());
      },
      get() {},
    });
  });

  afterAll(() => {
    Object.defineProperty(window.Image.prototype, 'src', originalImageSrc);
  });

  const renderComponent = (
    resultList: UseEvaluationArtifactTableDataResult,
    groupByColumns: string[],
    outputColumnName: string,
    isImageColumn: boolean,
  ) => {
    const visibleRuns: RunRowType[] = [
      {
        runUuid: 'run_a',
        runName: 'able-panda-761',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_a',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-761',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_a',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
      {
        runUuid: 'run_b',
        runName: 'able-panda-762',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_b',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-762',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_b',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
      {
        runUuid: 'run_c',
        runName: 'able-panda-763',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_c',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-763',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table_c.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_c',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
    ];
    const onHideRun = jest.fn();
    const onDatasetSelected = jest.fn();
    const highlightedText = '';

    const SAMPLE_STATE = {
      evaluationArtifactsBeingUploaded: {},
      evaluationArtifactsByRunUuid: {
        run_a: {
          '/table.json': {
            columns: ['data', 'output'],
            path: '/table.json',
            entries: [
              { data: 'question_1', output: 'answer_1_run_a' },
              { data: 'question_2', output: 'answer_2_run_a' },
            ],
          },
        },
        run_b: {
          '/table.json': {
            columns: ['data', 'output'],
            path: '/table.json',
            entries: [
              { data: 'question_1', output: 'answer_1_run_b' },
              { data: 'question_2', output: 'answer_2_run_b' },
            ],
          },
        },
        run_c: {
          '/table_c.json': {
            columns: ['data', 'output'],
            path: '/table_c.json',
            entries: [
              { data: 'question_1', output: 'answer_1_run_c' },
              { data: 'question_2', output: 'answer_2_run_c' },
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

    const mockStore = configureStore([thunk, promiseMiddleware()])({
      evaluationData: SAMPLE_STATE,
      modelGateway: { modelGatewayRoutesLoading: {} },
    });

    renderWithIntl(
      <BrowserRouter>
        <Provider store={mockStore}>
          <DesignSystemProvider>
            <EvaluationArtifactCompareTable
              resultList={resultList}
              visibleRuns={visibleRuns}
              groupByColumns={groupByColumns}
              onHideRun={onHideRun}
              onDatasetSelected={onDatasetSelected}
              highlightedText={highlightedText}
              outputColumnName={outputColumnName}
              isImageColumn={isImageColumn}
            />
          </DesignSystemProvider>
        </Provider>
      </BrowserRouter>,
    );
  };

  it('should render the component', async () => {
    const resultList: UseEvaluationArtifactTableDataResult = [
      {
        key: 'question_1',
        groupByCellValues: {
          data: 'question_1',
        },
        cellValues: {
          run_c: 'answer_1_run_c',
          run_b: 'answer_1_run_b',
          run_a: 'answer_1_run_a',
        },
        isPendingInputRow: false,
      },
      {
        key: 'question_2',
        groupByCellValues: {
          data: 'question_2',
        },
        cellValues: {
          run_c: 'answer_2_run_c',
          run_b: 'answer_2_run_b',
          run_a: 'answer_2_run_a',
        },
        isPendingInputRow: false,
      },
    ];

    renderComponent(resultList, ['data'], 'output', false);

    await waitFor(
      () => {
        expect(screen.getByRole('columnheader', { name: 'data' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: new RegExp('output', 'i') })).toBeInTheDocument();
        ['able-panda-761', 'able-panda-762', 'able-panda-763'].forEach((value) => {
          expect(screen.getByRole('columnheader', { name: new RegExp(value, 'i') })).toBeInTheDocument();
        });
        resultList.forEach((result) => {
          Object.values(result.groupByCellValues).forEach((value) => {
            expect(screen.getByRole('gridcell', { name: value })).toBeInTheDocument();
          });
          Object.values(result.cellValues).forEach((value) => {
            if (typeof value === 'string') {
              expect(screen.getByRole('gridcell', { name: value })).toBeInTheDocument();
            }
          });
        });
      },
      { timeout: 90000 },
    );
  });

  it('should render the component with multiple groups', async () => {
    const resultList: UseEvaluationArtifactTableDataResult = [
      {
        key: 'question_1.answer_1_run_c',
        groupByCellValues: {
          data: 'question_1',
          output: 'answer_1_run_c',
        },
        cellValues: {},
        isPendingInputRow: false,
      },
      {
        key: 'question_2.answer_2_run_c',
        groupByCellValues: {
          data: 'question_2',
          output: 'answer_2_run_c',
        },
        cellValues: {},
        isPendingInputRow: false,
      },
      {
        key: 'question_1.answer_1_run_b',
        groupByCellValues: {
          data: 'question_1',
          output: 'answer_1_run_b',
        },
        cellValues: {},
        isPendingInputRow: false,
      },
      {
        key: 'question_2.answer_2_run_b',
        groupByCellValues: {
          data: 'question_2',
          output: 'answer_2_run_b',
        },
        cellValues: {},
        isPendingInputRow: false,
      },
      {
        key: 'question_1.answer_1_run_a',
        groupByCellValues: {
          data: 'question_1',
          output: 'answer_1_run_a',
        },
        cellValues: {},
        isPendingInputRow: false,
      },
      {
        key: 'question_2.answer_2_run_a',
        groupByCellValues: {
          data: 'question_2',
          output: 'answer_2_run_a',
        },
        cellValues: {},
        isPendingInputRow: false,
      },
    ];

    renderComponent(resultList, ['data', 'output'], '', false);

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'data' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'output' })).toBeInTheDocument();
      ['able-panda-761', 'able-panda-762', 'able-panda-763'].forEach((value) => {
        expect(screen.getByRole('columnheader', { name: new RegExp(value, 'i') })).toBeInTheDocument();
      });
      resultList.forEach((result) => {
        Object.values(result.groupByCellValues).forEach((value) => {
          const cells = screen.getAllByRole('gridcell', { name: value });
          expect(cells.length).toBeGreaterThan(0);
        });
      });
    });
  });

  const renderMultiTypeComponent = (
    resultList: UseEvaluationArtifactTableDataResult,
    groupByColumns: string[],
    outputColumnName: string,
    isImageColumn: boolean,
  ) => {
    const visibleRuns: RunRowType[] = [
      {
        runUuid: 'run_a',
        runName: 'able-panda-761',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_a',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-761',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_a',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
      {
        runUuid: 'run_b',
        runName: 'able-panda-762',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_b',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-762',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_b',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
      {
        runUuid: 'run_c',
        runName: 'able-panda-763',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_c',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-763',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table_c.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_c',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
    ];
    const onHideRun = jest.fn();
    const onDatasetSelected = jest.fn();
    const highlightedText = '';

    const arrayJson = JSON.stringify(['arr1', 'arr2']);

    const sampleState = {
      evaluationArtifactsBeingUploaded: {},
      evaluationArtifactsByRunUuid: {
        run_a: {
          '/table.json': {
            columns: [1234, 4321],
            path: '/table.json',
            entries: [
              { 1234: 1, 4321: arrayJson },
              { 1234: null, 4321: 'text' },
              { 1234: 'text', 4321: null },
              { 1234: arrayJson, 4321: 1 },
            ],
          },
        },
        run_b: {
          '/table.json': {
            columns: [1234, 'output'],
            path: '/table.json',
            entries: [
              { 1234: 1, output: 1 },
              { 1234: null, output: null },
              { 1234: 'text', output: 'text' },
              { 1234: arrayJson, output: arrayJson },
            ],
          },
        },
        run_c: {
          '/table_c.json': {
            columns: ['data', null],
            path: '/table_c.json',
            entries: [
              { data: 1, null: 'text' },
              { data: null, null: 'text2' },
              { data: 'text', null: 'text3' },
              { data: arrayJson, null: 4 },
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

    const mockStore = configureStore([thunk, promiseMiddleware()])({
      evaluationData: sampleState,
      modelGateway: { modelGatewayRoutesLoading: {} },
    });

    renderWithIntl(
      <BrowserRouter>
        <Provider store={mockStore}>
          <DesignSystemProvider>
            <EvaluationArtifactCompareTable
              resultList={resultList}
              visibleRuns={visibleRuns}
              groupByColumns={groupByColumns}
              onHideRun={onHideRun}
              onDatasetSelected={onDatasetSelected}
              highlightedText={highlightedText}
              outputColumnName={outputColumnName}
              isImageColumn={isImageColumn}
            />
          </DesignSystemProvider>
        </Provider>
      </BrowserRouter>,
    );
  };

  it('should render the component with different types', async () => {
    const resultList: UseEvaluationArtifactTableDataResult = [
      {
        key: '1',
        groupByCellValues: {
          '1234': '1',
        },
        cellValues: {
          run_a: 1 as any,
        },
        isPendingInputRow: false,
      },
      {
        key: 'null',
        groupByCellValues: {
          '1234': 'null',
        },
        cellValues: {
          run_a: null as any,
        },
        isPendingInputRow: false,
      },
      {
        key: 'text',
        groupByCellValues: {
          '1234': 'text',
        },
        cellValues: {
          run_a: 'text',
        },
        isPendingInputRow: false,
      },
      {
        key: '["arr1","arr2"]',
        groupByCellValues: {
          '1234': '["arr1","arr2"]',
        },
        cellValues: {
          run_a: '["arr1","arr2"]',
        },
        isPendingInputRow: false,
      },
    ];

    renderMultiTypeComponent(resultList, ['data'], 'null', false);

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'data' })).toBeInTheDocument();
      ['able-panda-761', 'able-panda-762', 'able-panda-763'].forEach((value) => {
        expect(screen.getByRole('columnheader', { name: new RegExp(value, 'i') })).toBeInTheDocument();
      });
      resultList.forEach((result) => {
        Object.values(result.groupByCellValues).forEach((value) => {
          let cells = [];
          if (value === 'null') {
            cells = screen.getAllByRole('gridcell', { name: '(empty)' });
            expect(cells.length).toBeGreaterThan(0);
          } else if (value === '["arr1","arr2"]') {
            // Becomes a code block
            const complexDiv = screen.getByRole('gridcell', {
              name: /arr1/i,
            });
            expect(complexDiv).toBeInTheDocument();
          } else {
            cells = screen.getAllByRole('gridcell', { name: value });
            expect(cells.length).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  const renderImageComponent = (
    resultList: UseEvaluationArtifactTableDataResult,
    groupByColumns: string[],
    outputColumnName: string,
    isImageColumn: boolean,
  ) => {
    const visibleRuns: RunRowType[] = [
      {
        runUuid: 'run_a',
        runName: 'able-panda-761',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_a',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-761',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_a',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
      {
        runUuid: 'run_b',
        runName: 'able-panda-762',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_b',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-762',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_b',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
      {
        runUuid: 'run_c',
        runName: 'able-panda-763',
        rowUuid: '9b1b553bb1ca4e948c248c5ca426ae52',
        runInfo: {
          runUuid: 'run_c',
          status: 'FINISHED',
          artifactUri: 'dbfs:/databricks/mlflow-tracking/676587362364997/9b1b553bb1ca4e948c248c5ca426ae52/artifacts',
          endTime: 1717111275344,
          experimentId: '676587362364997',
          lifecycleStage: 'active',
          runName: 'able-panda-763',
          startTime: 1717111273526,
        },
        duration: '1.8s',
        tags: {
          'mlflow.loggedArtifacts': {
            key: 'mlflow.loggedArtifacts',
            value: '[{"path": "table_c.json", "type": "table"}]',
          },
        },
        models: {
          registeredModels: [],
          loggedModels: [],
          experimentId: '676587362364997',
          runUuid: 'run_c',
        },
        pinnable: true,
        hidden: false,
        pinned: false,
        datasets: [],
      },
    ];
    const onHideRun = jest.fn();
    const onDatasetSelected = jest.fn();
    const highlightedText = '';

    const imageJson = {
      type: 'image',
      filepath: 'fakePathUncompressed',
      compressed_filepath: 'fakePath',
    };
    const sampleState = {
      evaluationArtifactsBeingUploaded: {},
      evaluationArtifactsByRunUuid: {
        run_a: {
          '/table.json': {
            columns: [1234, 4321],
            path: '/table.json',
            entries: [
              { image: imageJson, text: 1 },
              { image: imageJson, text: 2 },
              { image: imageJson, text: 3 },
            ],
          },
        },
        run_b: {
          '/table.json': {
            columns: [1234, 'output'],
            path: '/table.json',
            entries: [
              { image: imageJson, text: 1 },
              { image: imageJson, text: 2 },
              { image: imageJson, text: 3 },
            ],
          },
        },
        run_c: {
          '/table_c.json': {
            columns: ['data', null],
            path: '/table_c.json',
            entries: [
              { image: imageJson, text: 1 },
              { image: imageJson, text: 2 },
              { image: imageJson, text: 3 },
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

    const mockStore = configureStore([thunk, promiseMiddleware()])({
      evaluationData: sampleState,
      modelGateway: { modelGatewayRoutesLoading: {} },
    });

    renderWithIntl(
      <BrowserRouter>
        <Provider store={mockStore}>
          <DesignSystemProvider>
            <EvaluationArtifactCompareTable
              resultList={resultList}
              visibleRuns={visibleRuns}
              groupByColumns={groupByColumns}
              onHideRun={onHideRun}
              onDatasetSelected={onDatasetSelected}
              highlightedText={highlightedText}
              outputColumnName={outputColumnName}
              isImageColumn={isImageColumn}
            />
          </DesignSystemProvider>
        </Provider>
      </BrowserRouter>,
    );
  };

  it('should render the component with images', async () => {
    const imageJson = {
      url: 'get-artifact?path=fakePathUncompressed&run_uuid=test-run-uuid',
      compressed_url: 'get-artifact?path=fakePath&run_uuid=test-run-uuid',
    };
    const resultList: UseEvaluationArtifactTableDataResult = [
      {
        key: '1',
        groupByCellValues: {
          text: '1',
        },
        cellValues: {
          run_a: imageJson,
          run_b: imageJson,
          run_c: imageJson,
        },
        isPendingInputRow: false,
      },
      {
        key: '2',
        groupByCellValues: {
          text: '2',
        },
        cellValues: {
          run_a: imageJson,
          run_b: imageJson,
          run_c: imageJson,
        },
        isPendingInputRow: false,
      },
      {
        key: '3',
        groupByCellValues: {
          text: '3',
        },
        cellValues: {
          run_a: imageJson,
          run_b: imageJson,
          run_c: imageJson,
        },
        isPendingInputRow: false,
      },
    ];

    renderImageComponent(resultList, ['text'], 'image', true);

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'text' })).toBeInTheDocument();
      ['able-panda-761', 'able-panda-762', 'able-panda-763'].forEach((value) => {
        expect(screen.getByRole('columnheader', { name: new RegExp(value, 'i') })).toBeInTheDocument();
      });
    });

    await waitFor(() => {
      const image = screen.getAllByRole('img');
      expect(image.length).toBeGreaterThan(0);
      expect(image[0]).toBeInTheDocument();
      expect(image[0]).toHaveAttribute(
        'src',
        expect.stringContaining('get-artifact?path=fakePath&run_uuid=test-run-uuid'),
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationArtifactCompareTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationArtifactCompareTable.tsx
Signals: React, Redux/RTK

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import type { UseEvaluationArtifactTableDataResult } from '../hooks/useEvaluationArtifactTableData';
import type { CellClickedEvent, ColDef, GridApi } from '@ag-grid-community/core';
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { MLFlowAgGridLoader } from '../../../../common/components/ag-grid/AgGridLoader';
import { EvaluationRunHeaderCellRenderer } from './EvaluationRunHeaderCellRenderer';
import { EvaluationTextCellRenderer } from './EvaluationTextCellRenderer';
import {
  EVALUATION_ARTIFACTS_TABLE_ROW_HEIGHT,
  EVALUATION_ARTIFACTS_TEXT_COLUMN_WIDTH,
  getEvaluationArtifactsTableHeaderHeight,
} from '../EvaluationArtifactCompare.utils';
import { EvaluationGroupByHeaderCellRenderer } from './EvaluationGroupByHeaderCellRenderer';
import type { Theme } from '@emotion/react';
import type { RunDatasetWithTags } from '../../../types';
import { useEvaluationAddNewInputsModal } from '../hooks/useEvaluationAddNewInputsModal';
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState, ThunkDispatch } from '../../../../redux-types';
import { evaluateAddInputValues } from '../../../actions/PromptEngineeringActions';
import { canEvaluateOnRun, extractRequiredInputParamsForRun } from '../../prompt-engineering/PromptEngineering.utils';
import { useIntl } from 'react-intl';
import { usePromptEngineeringContext } from '../contexts/PromptEngineeringContext';
import { EvaluationTableHeader } from './EvaluationTableHeader';
import { EvaluationTableActionsColumnRenderer } from './EvaluationTableActionsColumnRenderer';
import { EvaluationTableActionsCellRenderer } from './EvaluationTableActionsCellRenderer';
import { shouldEnablePromptLab } from '../../../../common/utils/FeatureUtils';
import { useCreateNewRun } from '../../experiment-page/hooks/useCreateNewRun';
import { EvaluationImageCellRenderer } from './EvaluationImageCellRenderer';

export interface EvaluationArtifactCompareTableProps {
  resultList: UseEvaluationArtifactTableDataResult;
  visibleRuns: RunRowType[];
  groupByColumns: string[];
  onCellClick?: (value: string, columnHeader: string) => void;
  onHideRun: (runUuid: string) => void;
  onDatasetSelected: (dataset: RunDatasetWithTags, run: RunRowType) => void;
  highlightedText: string;
  isPreviewPaneVisible?: boolean;
  outputColumnName: string;
  isImageColumn: boolean;
}

export const EvaluationArtifactCompareTable = ({
  resultList,
  visibleRuns,
  groupByColumns,
  onCellClick,
  onHideRun,
  onDatasetSelected,
  highlightedText = '',
  isPreviewPaneVisible,
  outputColumnName,
  isImageColumn,
}: EvaluationArtifactCompareTableProps) => {
  const [columns, setColumns] = useState<ColDef[]>([]);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const pendingData = useSelector(({ evaluationData }: ReduxState) => evaluationData.evaluationPendingDataByRunUuid);
  const gridWrapperRef = useRef<HTMLDivElement>(null);

  const { isHeaderExpanded } = usePromptEngineeringContext();
  const { createNewRun } = useCreateNewRun();

  // Before hiding or duplicating the run, let's refresh the header to mitigate ag-grid's
  // bug where it fails to defocus cell after the whole table has been hidden.
  const handleHideRun = useCallback(
    (runUuid: string) => {
      gridApi?.refreshHeader();
      onHideRun(runUuid);
    },
    [gridApi, onHideRun],
  );

  const handleDuplicateRun = useCallback(
    (runToDuplicate?: RunRowType) => {
      gridApi?.refreshHeader();
      createNewRun(runToDuplicate);
    },
    [createNewRun, gridApi],
  );

  useEffect(() => {
    if (gridApi && !isPreviewPaneVisible) {
      gridApi.clearFocusedCell();
    }
  }, [gridApi, isPreviewPaneVisible]);

  // Force-refresh visible cells' values when some pending data have changes
  // either by loading new data or discarding values. This makes sure
  // that even if the prompt evaluates to the same value, the grid still refreshes.
  useEffect(() => {
    if (!gridApi) {
      return;
    }
    const visibleRows = gridApi.getRenderedNodes();
    gridApi.refreshCells({ force: true, rowNodes: visibleRows });
  }, [gridApi, pendingData, highlightedText]);

  const { showAddNewInputsModal, AddNewInputsModal } = useEvaluationAddNewInputsModal();
  const dispatch = useDispatch<ThunkDispatch>();

  const scrollGridToTop = useCallback(() => {
    // Find the scrollable viewport element
    const gridViewport = gridWrapperRef.current?.querySelector('.ag-body-viewport');
    if (gridViewport) {
      gridViewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If for some reason there's no element, use native jumpy method
      gridApi?.ensureIndexVisible(0, 'top');
    }
  }, [gridApi]);

  const displayAddNewInputsButton = useMemo(
    // TODO(ML-32969): count prompt-engineered runs based on tags
    () => visibleRuns.map(extractRequiredInputParamsForRun).flat().length > 0,
    [visibleRuns],
  );

  const onAddNewInputs = useCallback(() => {
    showAddNewInputsModal(visibleRuns, (values) => {
      dispatch(evaluateAddInputValues(values));
      // Scroll the grid to the top after adding new row
      scrollGridToTop();
    });
  }, [scrollGridToTop, showAddNewInputsModal, dispatch, visibleRuns]);

  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const handleCellClicked = useCallback(
    ({ value, colDef, column }: CellClickedEvent) => {
      const emptyMessage = intl.formatMessage({
        defaultMessage: '(empty)',
        description: 'Experiment page > artifact compare view > results table > no result (empty cell)',
      });
      return onCellClick?.(value || emptyMessage, colDef.headerName || column.getId());
    },
    [intl, onCellClick],
  );

  const outputColumnIndicator = useMemo(
    () => <Typography.Text bold>{outputColumnName}</Typography.Text>,
    [outputColumnName],
  );

  useEffect(() => {
    const cols: ColDef[] = [];

    const { initialWidthGroupBy, initialWidthOutput, maxWidth, minWidth } = EVALUATION_ARTIFACTS_TEXT_COLUMN_WIDTH;

    if (shouldEnablePromptLab() && visibleRuns.some((run) => canEvaluateOnRun(run))) {
      cols.push({
        resizable: false,
        pinned: true,
        width: 40,
        headerComponent: 'ActionsColumnRenderer',
        cellRendererSelector: ({ rowIndex }) =>
          rowIndex === 0
            ? {
                component: 'ActionsCellRenderer',
                params: {
                  displayAddNewInputsButton,
                  onAddNewInputs,
                },
              }
            : undefined,
        cellClass: 'leading-column-cell',
      });
    }

    groupByColumns.forEach((col, index) => {
      const isLastGroupByColumns = index === groupByColumns.length - 1;
      cols.push({
        resizable: true,
        initialWidth: initialWidthGroupBy,
        minWidth,
        maxWidth,
        headerName: col,
        valueGetter: ({ data }) => data.groupByCellValues[col],
        suppressMovable: true,
        cellRenderer: 'TextRendererCellRenderer',
        headerClass: isLastGroupByColumns ? 'last-group-by-header-cell' : undefined,
        cellRendererParams: {
          isGroupByColumn: true,
        },
        headerComponent: 'GroupHeaderCellRenderer',
        headerComponentParams: {
          displayAddNewInputsButton,
          onAddNewInputs,
        },
        colId: col,
        onCellClicked: handleCellClicked,
      });
    });

    visibleRuns.forEach((run, index) => {
      const isFirstColumn = index === 0;
      cols.push({
        resizable: true,
        initialWidth: initialWidthOutput,
        minWidth,
        maxWidth,
        headerName: run.runName,
        colId: run.runUuid,
        valueGetter: ({ data }) => data.cellValues[run.runUuid],
        suppressMovable: true,
        cellRenderer: isImageColumn ? 'ImageRendererCellRenderer' : 'TextRendererCellRenderer',
        cellRendererParams: {
          run,
        },
        headerComponent: 'RunHeaderCellRenderer',
        headerComponentParams: {
          run,
          onDuplicateRun: handleDuplicateRun,
          onHideRun: handleHideRun,
          onDatasetSelected,
          groupHeaderContent: isFirstColumn ? outputColumnIndicator : null,
        },
        onCellClicked: handleCellClicked,
      });
    });

    setColumns(cols);
  }, [
    visibleRuns,
    groupByColumns,
    handleHideRun,
    handleDuplicateRun,
    onDatasetSelected,
    onAddNewInputs,
    displayAddNewInputsButton,
    handleCellClicked,
    outputColumnIndicator,
    isImageColumn,
  ]);

  useEffect(() => {
    if (!gridApi) {
      return;
    }

    // Check if we need to have a tall header, i.e. if we have any runs
    // with datasets or with evaluation metadata
    const runsContainHeaderMetadata = visibleRuns.some((run) => canEvaluateOnRun(run) || run.datasets?.length > 0);

    // Set header height dynamically
    gridApi.setHeaderHeight(getEvaluationArtifactsTableHeaderHeight(isHeaderExpanded, runsContainHeaderMetadata));
  }, [gridApi, isHeaderExpanded, visibleRuns]);

  return (
    <div css={{ height: '100%', overflow: 'hidden' }} ref={gridWrapperRef}>
      <MLFlowAgGridLoader
        css={createTableStyles(theme)}
        context={{ highlightedText }}
        rowHeight={EVALUATION_ARTIFACTS_TABLE_ROW_HEIGHT}
        onGridReady={({ api }) => setGridApi(api)}
        getRowId={({ data }) => data.key}
        suppressHorizontalScroll={false}
        columnDefs={columns}
        rowData={resultList}
        components={{
          TextRendererCellRenderer: EvaluationTextCellRenderer,
          GroupHeaderCellRenderer: EvaluationGroupByHeaderCellRenderer,
          RunHeaderCellRenderer: EvaluationRunHeaderCellRenderer,
          ActionsColumnRenderer: EvaluationTableActionsColumnRenderer,
          ActionsCellRenderer: EvaluationTableActionsCellRenderer,
          ImageRendererCellRenderer: EvaluationImageCellRenderer,
        }}
      />
      {AddNewInputsModal}
    </div>
  );
};

const createTableStyles = (theme: Theme) => ({
  '.ag-row:not(.ag-row-first), .ag-body-viewport': {
    borderTop: `1px solid ${theme.colors.borderDecorative}`,
  },
  '.ag-row-last': {
    borderBottom: `1px solid ${theme.colors.borderDecorative}`,
  },
  '.ag-cell, .last-group-by-header-cell .header-group-cell': {
    borderRight: `1px solid ${theme.colors.borderDecorative}`,
  },
  '.ag-cell-focus:not(.leading-column-cell)::after': {
    content: '""',
    position: 'absolute' as const,
    inset: 0,
    boxShadow: `inset 0 0 0px 2px ${theme.colors.blue300}`,
    pointerEvents: 'none' as const,
  },
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationCellEvaluateButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluation-artifacts-compare/components/EvaluationCellEvaluateButton.tsx

```typescript
import { Button, InfoSmallIcon, PlayIcon, RefreshIcon, Tooltip } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { usePromptEngineeringContext } from '../contexts/PromptEngineeringContext';
import type { RunRowType } from '../../experiment-page/utils/experimentPage.row-types';
import { canEvaluateOnRun } from '../../prompt-engineering/PromptEngineering.utils';

/**
 * Displays multiple variants of "(re)evaluate" button within the artifact comparison table
 */
export const EvaluationCellEvaluateButton = ({
  disabled,
  isLoading,
  run,
  rowKey,
}: {
  disabled?: boolean;
  isLoading: boolean;
  rowKey: string;
  run: RunRowType;
}) => {
  const isRunEvaluable = canEvaluateOnRun(run);
  const { evaluateCell, getMissingParams } = usePromptEngineeringContext();

  const missingParamsToEvaluate = (run && getMissingParams(run, rowKey)) || null;

  if (missingParamsToEvaluate && missingParamsToEvaluate.length > 0) {
    return (
      <Tooltip
        componentId="mlflow.experiment-tracking.evaluation-cell.evaluate-all"
        content={
          <FormattedMessage
            description="Experiment page > artifact compare view > text cell > missing evaluation parameter values tooltip"
            defaultMessage='Evaluation is not possible because values for the following inputs cannot be determined: {missingParamList}. Add input columns to the "group by" settings or use "Add row" button to define new parameter set.'
            values={{
              missingParamList: <code>{missingParamsToEvaluate.join(', ')}</code>,
            }}
          />
        }
      >
        <span>
          <InfoSmallIcon />
        </span>
      </Tooltip>
    );
  }

  if (!isRunEvaluable) {
    return (
      <Tooltip
        componentId="mlflow.experiment-tracking.evaluation-cell.not-evaluable"
        content={
          <FormattedMessage
            description="Experiment page > artifact compare view > text cell > run not evaluable tooltip"
            defaultMessage="You cannot evaluate this cell, this run was not created using served LLM model route"
          />
        }
      >
        <span>
          <InfoSmallIcon />
        </span>
      </Tooltip>
    );
  }
  return (
    <Button
      componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluation-artifacts-compare_components_evaluationcellevaluatebutton.tsx_59"
      loading={isLoading}
      disabled={disabled}
      size="small"
      onMouseDownCapture={(e) => e.stopPropagation()}
      onClickCapture={(e) => {
        e.stopPropagation();
        evaluateCell(run, rowKey);
      }}
      icon={<PlayIcon />}
    >
      <>Evaluate</>
    </Button>
  );
};
```

--------------------------------------------------------------------------------

````

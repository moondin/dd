---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 548
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 548 of 991)

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

---[FILE: RunEvaluationButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/RunEvaluationButton.tsx
Signals: React

```typescript
import { Button, ChartLineIcon, Modal, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CodeSnippet } from '@mlflow/mlflow/src/shared/web-shared/snippet';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const getCodeSnippet = (experimentId: string) => `import mlflow
from mlflow.genai import datasets, evaluate, scorers

mlflow.set_experiment(experiment_id="${experimentId}")

# Step 1: Define evaluation dataset
eval_dataset = [{
  "inputs": {
    "query": "What is MLflow?",
  }
}]

# Step 2: Define predict_fn
# predict_fn will be called for every row in your evaluation
# dataset. Replace with your app's prediction function.
# NOTE: The **kwargs to predict_fn are the same as the keys of
# the \`inputs\` in your dataset.
def predict(query):
  return query + " an answer"

# Step 3: Run evaluation
evaluate(
  data=eval_dataset,
  predict_fn=predict,
  scorers=scorers.get_all_scorers()
)

# Results will appear back in this UI`;

export const RunEvaluationButton = ({ experimentId }: { experimentId: string }) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const [isOpen, setIsOpen] = useState(false);
  const evalInstructions = (
    <FormattedMessage
      defaultMessage="Run the following code to start an evaluation."
      description="Instructions for running the evaluation code in OSS"
    />
  );
  const evalCodeSnippet = (
    <CodeSnippet theme={theme.isDarkMode ? 'duotoneDark' : 'light'} language="python">
      {getCodeSnippet(experimentId)}
    </CodeSnippet>
  );

  return (
    <>
      <Button componentId="mlflow.eval-runs.start-run-button" icon={<ChartLineIcon />} onClick={() => setIsOpen(true)}>
        <FormattedMessage
          defaultMessage="Run evaluation"
          description="Label for a button that displays instructions for starting a new evaluation run"
        />
      </Button>
      <Modal
        componentId="mlflow.eval-runs.start-run-modal"
        // eslint-disable-next-line formatjs/enforce-description
        title={<FormattedMessage defaultMessage="Run evaluation" />}
        visible={isOpen}
        okText="Discard"
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          <Typography.Text>{evalInstructions}</Typography.Text>
          {evalCodeSnippet}
        </div>
      </Modal>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationRunsPageCharts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/charts/ExperimentEvaluationRunsPageCharts.tsx
Signals: React

```typescript
import { useCallback, useMemo, useState } from 'react';
import type { RunEntity } from '../../../types';
import { ChartSectionConfig } from '../../../types';
import type { RunsChartsRunData } from '../../../components/runs-charts/components/RunsCharts.common';
import { RunsChartsTooltipWrapper } from '../../../components/runs-charts/hooks/useRunsChartsTooltip';
import { RunsChartsDraggableCardsGridContextProvider } from '../../../components/runs-charts/components/RunsChartsDraggableCardsGridContext';
import { RunsChartsSectionAccordion } from '../../../components/runs-charts/components/sections/RunsChartsSectionAccordion';
import {
  RunsChartsUIConfigurationContextProvider,
  useConfirmChartCardConfigurationFn,
  useInsertRunsChartsFn,
  useRemoveRunsChartFn,
  useReorderRunsChartsFn,
} from '../../../components/runs-charts/hooks/useRunsChartsUIConfiguration';
import {
  RunsChartsBarCardConfig,
  RunsChartsCardConfig,
  RunsChartType,
} from '../../../components/runs-charts/runs-charts.types';
import { keyBy, uniq } from 'lodash';
import { MLFLOW_RUN_COLOR_TAG } from '../../../constants';
import { getStableColorForRun } from '../../../utils/RunNameUtils';
import type { ExperimentEvaluationRunsChartsUIConfiguration } from '../hooks/useExperimentEvaluationRunsChartsUIState';
import { useExperimentEvaluationRunsChartsUIState } from '../hooks/useExperimentEvaluationRunsChartsUIState';
import { useMemoDeep } from '../../../../common/hooks/useMemoDeep';
import { RunsChartsConfigureModal } from '../../../components/runs-charts/components/RunsChartsConfigureModal';
import { RunsChartsTooltipBody } from '../../../components/runs-charts/components/RunsChartsTooltipBody';
import { TableSkeleton } from '@databricks/design-system';
import { useGetExperimentRunColor } from '../../../components/experiment-page/hooks/useExperimentRunColor';
import { useExperimentEvaluationRunsRowVisibility } from '../hooks/useExperimentEvaluationRunsRowVisibility';

const SUPPORTED_CHART_TYPES = [
  RunsChartType.LINE,
  RunsChartType.BAR,
  RunsChartType.CONTOUR,
  RunsChartType.DIFFERENCE,
  RunsChartType.PARALLEL,
  RunsChartType.SCATTER,
];

const ExperimentEvaluationRunsPageChartsImpl = ({
  runs = [],
  chartUIState,
}: {
  runs?: RunEntity[];
  chartUIState: ExperimentEvaluationRunsChartsUIConfiguration;
}) => {
  const getRunColor = useGetExperimentRunColor();
  const { isRowHidden } = useExperimentEvaluationRunsRowVisibility();

  const chartData: RunsChartsRunData[] = useMemo(() => {
    return runs
      .filter((run) => run.info)
      .map<RunsChartsRunData>((run, index) => {
        const metricsByKey = keyBy(run.data?.metrics, 'key');
        const paramsByKey = keyBy(run.data?.params, 'key');
        const tagsByKey = keyBy(run.data?.tags, 'key');

        return {
          displayName: run.info.runName,
          images: {},
          metrics: metricsByKey,
          params: paramsByKey,
          tags: tagsByKey,
          uuid: run.info.runUuid,
          color: getRunColor(run.info.runUuid),
          runInfo: run.info,
          hidden: isRowHidden(run.info.runUuid, index, run.info.status),
        };
      });
  }, [runs, isRowHidden, getRunColor]);

  const availableMetricKeys = useMemo(() => uniq(chartData.flatMap((run) => Object.keys(run.metrics))), [chartData]);
  const availableParamKeys = useMemo(() => uniq(chartData.flatMap((run) => Object.keys(run.params))), [chartData]);

  const removeChart = useRemoveRunsChartFn();
  const reorderCharts = useReorderRunsChartsFn();
  const insertCharts = useInsertRunsChartsFn();
  const confirmChartCardConfiguration = useConfirmChartCardConfigurationFn();

  const [configuredCardConfig, setConfiguredCardConfig] = useState<RunsChartsCardConfig | null>(null);

  const addNewChartCard = useCallback(
    (metricSectionId: string) => (type: RunsChartType) =>
      setConfiguredCardConfig(RunsChartsCardConfig.getEmptyChartCardByType(type, false, undefined, metricSectionId)),
    [],
  );

  const contextValue = useMemo(() => ({ runs: chartData }), [chartData]);

  return (
    <div>
      <RunsChartsTooltipWrapper contextData={contextValue} component={RunsChartsTooltipBody}>
        <RunsChartsDraggableCardsGridContextProvider visibleChartCards={chartUIState.compareRunCharts}>
          <RunsChartsSectionAccordion
            supportedChartTypes={SUPPORTED_CHART_TYPES}
            compareRunSections={chartUIState.compareRunSections}
            compareRunCharts={chartUIState.compareRunCharts}
            reorderCharts={reorderCharts}
            insertCharts={insertCharts}
            chartData={chartData}
            startEditChart={setConfiguredCardConfig}
            removeChart={removeChart}
            addNewChartCard={addNewChartCard}
            search={chartUIState.chartsSearchFilter ?? ''}
            // TODO: get group by to work for line charts. simply passing
            // groupBy from the parent component does not work, as the line
            // chart requires the chart data to contain the
            // groupParentInfo key.
            groupBy={null}
            setFullScreenChart={() => {}}
            autoRefreshEnabled={chartUIState.autoRefreshEnabled}
            hideEmptyCharts={false}
            globalLineChartConfig={chartUIState.globalLineChartConfig}
          />
          {configuredCardConfig && (
            <RunsChartsConfigureModal
              chartRunData={chartData}
              metricKeyList={availableMetricKeys}
              paramKeyList={availableParamKeys}
              config={configuredCardConfig}
              onSubmit={(configuredCardConfig) => {
                confirmChartCardConfiguration({ ...configuredCardConfig, displayName: undefined });
                setConfiguredCardConfig(null);
              }}
              onCancel={() => setConfiguredCardConfig(null)}
              groupBy={null}
              supportedChartTypes={SUPPORTED_CHART_TYPES}
            />
          )}
        </RunsChartsDraggableCardsGridContextProvider>
      </RunsChartsTooltipWrapper>
    </div>
  );
};

export const ExperimentEvaluationRunsPageCharts = ({
  runs = [],
  experimentId,
}: {
  runs?: RunEntity[];
  experimentId: string;
}) => {
  // Get all unique metric keys from the runs
  const uniqueMetricKeys = useMemo(() => {
    const metricKeys = runs.flatMap((run) => run.data?.metrics?.map((metric) => metric.key) || []);
    return Array.from(new Set(metricKeys));
  }, [runs]);

  // The list of updated metrics is used to regenerate list of charts,
  // so it's memoized deeply (using deep equality) to avoid unnecessary re-calculation.
  const memoizedMetricKeys = useMemoDeep(() => uniqueMetricKeys, [uniqueMetricKeys]);

  const { chartUIState, loading, updateUIState } = useExperimentEvaluationRunsChartsUIState(
    memoizedMetricKeys,
    experimentId,
  );

  if (loading) {
    return <TableSkeleton lines={5} />;
  }

  return (
    <RunsChartsUIConfigurationContextProvider updateChartsUIState={updateUIState}>
      <ExperimentEvaluationRunsPageChartsImpl runs={runs} chartUIState={chartUIState} />
    </RunsChartsUIConfigurationContextProvider>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentEvaluationRunsChartsUIState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/hooks/useExperimentEvaluationRunsChartsUIState.tsx
Signals: React

```typescript
import { useCallback, useEffect, useReducer, useState } from 'react';
import type { ChartSectionConfig } from '../../../types';
import { MetricEntitiesByName } from '../../../types';

import { compact, first, isEmpty, uniq } from 'lodash';
import type { RunsChartsUIConfigurationSetter } from '../../../components/runs-charts/hooks/useRunsChartsUIConfiguration';
import type { RunsChartsBarCardConfig, RunsChartsCardConfig } from '../../../components/runs-charts/runs-charts.types';
import { RunsChartType } from '../../../components/runs-charts/runs-charts.types';
import type { ExperimentRunsChartsUIConfiguration } from '../../../components/experiment-page/models/ExperimentPageUIState';

type UpdateChartStateAction = { type: 'UPDATE'; stateSetter: RunsChartsUIConfigurationSetter };
type InitializeChartStateAction = { type: 'INITIALIZE'; initialConfig?: ExperimentEvaluationRunsChartsUIConfiguration };
type NewDataStateAction = { type: 'METRICS_UPDATED'; allMetricKeys: string[] };

type ChartsReducerAction = UpdateChartStateAction | NewDataStateAction | InitializeChartStateAction;

export interface ExperimentEvaluationRunsChartsUIConfiguration extends ExperimentRunsChartsUIConfiguration {
  isDirty: boolean;
}

const createLocalStorageKey = (storeIdentifier: string, version = 1) =>
  `experiment-evaluation-runs-charts-ui-state-v${version}-${storeIdentifier}`;

/**
 * Generates a list of chart tiles based on logged models metrics and datasets.
 */
const getExperimentEvalRunsPageChartSetup = (allMetricKeys: string[]) => {
  const firstNameSegments = compact(
    uniq(allMetricKeys.map((key) => (key.includes('/') ? first(key.split('/')) : null))),
  );
  const compareRunCharts: RunsChartsBarCardConfig[] = allMetricKeys.map((key) => {
    const sectionKey = key.includes('/') ? first(key.split('/')) : null;
    return {
      deleted: false,
      type: RunsChartType.BAR,
      uuid: `autogen-${key}`,
      metricSectionId: sectionKey ? `autogen-${sectionKey}` : 'default',
      isGenerated: true,
      metricKey: key,
      displayName: key,
    };
  });

  const compareRunSections: ChartSectionConfig[] = firstNameSegments.map((segmentName) => ({
    display: true,
    name: segmentName,
    uuid: `autogen-${segmentName}`,
    isReordered: false,
  }));

  if (isEmpty(compareRunSections)) {
    compareRunSections.push({
      display: true,
      name: 'Metrics',
      uuid: 'default',
      isReordered: false,
    });
  }

  return {
    compareRunCharts,
    compareRunSections,
  };
};

// Internal utility function  used to merge the current charts state with potentially incoming new charts and sections
const reconcileChartsAndSections = (
  currentState: ExperimentEvaluationRunsChartsUIConfiguration,
  newCharts: { compareRunCharts: RunsChartsCardConfig[]; compareRunSections: ChartSectionConfig[] },
) => {
  // If there are no charts / sections, or if the state is in pristine state, just set the new charts if they're not empty
  if (!currentState.compareRunCharts || !currentState.compareRunSections || !currentState.isDirty) {
    if (newCharts.compareRunCharts.length > 0 || newCharts.compareRunSections.length > 0) {
      return {
        ...currentState,
        compareRunCharts: newCharts.compareRunCharts ?? [],
        compareRunSections: newCharts.compareRunSections ?? [],
      };
    }
  }

  // Otherwise, detect new sections and charts and add them to the list
  const newChartsToAdd = newCharts.compareRunCharts.filter(
    (newChart) => !currentState.compareRunCharts?.find((chart) => chart.uuid === newChart.uuid),
  );
  const newSectionsToAdd = newCharts.compareRunSections.filter(
    (newSection) =>
      newChartsToAdd.find((newChart) => newChart.metricSectionId === newSection.uuid) &&
      !currentState.compareRunSections?.find((section) => section.uuid === newSection.uuid),
  );

  if (newSectionsToAdd.length > 0 || newChartsToAdd.length > 0) {
    return {
      ...currentState,
      compareRunCharts: currentState.compareRunCharts
        ? [...currentState.compareRunCharts, ...newChartsToAdd]
        : newCharts.compareRunCharts,
      compareRunSections: currentState.compareRunSections
        ? [...currentState.compareRunSections, ...newSectionsToAdd]
        : newCharts.compareRunSections,
    };
  }
  return currentState;
};

const chartsUIStateInitializer = (): ExperimentEvaluationRunsChartsUIConfiguration => ({
  compareRunCharts: undefined,
  compareRunSections: undefined,
  autoRefreshEnabled: false,
  isAccordionReordered: false,
  chartsSearchFilter: '',
  globalLineChartConfig: undefined,
  isDirty: false,
});

// Reducer to manage the state of the charts UI
const chartsUIStateReducer = (state: ExperimentEvaluationRunsChartsUIConfiguration, action: ChartsReducerAction) => {
  // 'UPDATE' is sent by controls that updates the UI state directly
  if (action.type === 'UPDATE') {
    return { ...action.stateSetter(state), isDirty: true };
  }
  // 'METRICS_UPDATED' is sent when new logged models data is available and potentially new charts need to be added
  if (action.type === 'METRICS_UPDATED') {
    const { compareRunCharts, compareRunSections } = getExperimentEvalRunsPageChartSetup(action.allMetricKeys);
    const newState = reconcileChartsAndSections(state, { compareRunCharts, compareRunSections });
    return newState;
  }
  if (action.type === 'INITIALIZE') {
    if (action.initialConfig) {
      return action.initialConfig;
    }
  }
  return state;
};

// This function is async on purpose to accommodate potential asynchoronous storage mechanisms (e.g. IndexedDB) in the future
const loadPersistedDataFromStorage = async (storeIdentifier: string) => {
  const serializedData = localStorage.getItem(createLocalStorageKey(storeIdentifier));
  if (!serializedData) {
    return undefined;
  }
  try {
    return JSON.parse(serializedData);
  } catch {
    return undefined;
  }
};

// This function is async on purpose to accommodate potential asynchoronous storage mechanisms (e.g. IndexedDB) in the future
const saveDataToStorage = async (
  storeIdentifier: string,
  dataToPersist: ExperimentEvaluationRunsChartsUIConfiguration,
) => {
  localStorage.setItem(createLocalStorageKey(storeIdentifier), JSON.stringify(dataToPersist));
};

/**
 * A custom hook to manage the state of the charts UI for the Experiment Evaluation Runs page.
 * TODO: unify with useExperimentLoggedModelsChartsUIState
 * TODO: possibly refactor useEffects into useQuery
 */
export const useExperimentEvaluationRunsChartsUIState = (allMetricKeys: string[], storeIdentifier: string) => {
  const [chartUIState, dispatchChartUIState] = useReducer(chartsUIStateReducer, undefined, chartsUIStateInitializer);
  const [loading, setLoading] = useState(true);

  // Attempt to load the persisted data when the component mounts
  useEffect(() => {
    setLoading(true);
    loadPersistedDataFromStorage(storeIdentifier).then((data) => {
      dispatchChartUIState({ type: 'INITIALIZE', initialConfig: data });
      setLoading(false);
    });
  }, [storeIdentifier]);

  // Attempt to update the charts state when the logged models change
  useEffect(() => {
    if (loading) {
      return;
    }
    dispatchChartUIState({ type: 'METRICS_UPDATED', allMetricKeys });
  }, [allMetricKeys, loading]);

  // Attempt persist the data when the state changes
  useEffect(() => {
    if (chartUIState.isDirty) {
      saveDataToStorage(storeIdentifier, chartUIState);
    }
  }, [storeIdentifier, chartUIState]);

  // Create an updater function to pass it to chart controls
  const updateUIState = useCallback(
    (stateSetter: RunsChartsUIConfigurationSetter) =>
      dispatchChartUIState({
        type: 'UPDATE',
        stateSetter,
      }),
    [],
  );

  return { chartUIState, updateUIState, loading };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentEvaluationRunsPageMode.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/hooks/useExperimentEvaluationRunsPageMode.tsx

```typescript
import { coerceToEnum } from '@databricks/web-shared/utils';
import { useSearchParams } from '../../../../common/utils/RoutingUtils';

export enum ExperimentEvaluationRunsPageMode {
  TRACES = 'traces',
  CHARTS = 'charts',
}

const MODE_SEARCH_KEY = 'viewMode';

export const useExperimentEvaluationRunsPageMode = () => {
  const [params, setParams] = useSearchParams();
  const viewMode = coerceToEnum(
    ExperimentEvaluationRunsPageMode,
    params.get(MODE_SEARCH_KEY),
    ExperimentEvaluationRunsPageMode.TRACES,
  );

  const setViewMode = (newMode: ExperimentEvaluationRunsPageMode) => {
    setParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set(MODE_SEARCH_KEY, newMode);
      return newParams;
    });
  };

  return {
    viewMode,
    setViewMode,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentEvaluationRunsRowVisibility.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-runs/hooks/useExperimentEvaluationRunsRowVisibility.tsx
Signals: React

```typescript
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { RUNS_VISIBILITY_MODE } from '../../../components/experiment-page/models/ExperimentPageUIState';

interface ExperimentEvaluationRunsRowVisibilityContextValue {
  isRowHidden: (rowUuid: string, rowIndex: number, runStatus?: string) => boolean;
  toggleRowVisibility: (rowUuid: string) => void;
  setVisibilityMode: (mode: RUNS_VISIBILITY_MODE) => void;
  visibilityMode: RUNS_VISIBILITY_MODE;
  usingCustomVisibility: boolean;
  allRunsHidden: boolean;
}

const ExperimentEvaluationRunsRowVisibilityContext = createContext<ExperimentEvaluationRunsRowVisibilityContextValue>({
  isRowHidden: () => false,
  toggleRowVisibility: () => {},
  setVisibilityMode: () => {},
  visibilityMode: RUNS_VISIBILITY_MODE.SHOWALL,
  usingCustomVisibility: false,
  allRunsHidden: false,
});

export const ExperimentEvaluationRunsRowVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [hiddenRuns, setHiddenRuns] = useState<Set<string>>(new Set());
  const [visibilityMode, setVisibilityModeState] = useState<RUNS_VISIBILITY_MODE>(RUNS_VISIBILITY_MODE.SHOWALL);

  const isRowHidden = useCallback(
    (rowUuid: string, rowIndex: number, runStatus?: string) => {
      // If custom mode, check the hiddenRuns set
      if (visibilityMode === RUNS_VISIBILITY_MODE.CUSTOM) {
        return hiddenRuns.has(rowUuid);
      }

      // For other modes, apply the mode logic
      if (visibilityMode === RUNS_VISIBILITY_MODE.HIDEALL) {
        return true;
      }

      if (visibilityMode === RUNS_VISIBILITY_MODE.FIRST_10_RUNS) {
        return rowIndex >= 10;
      }

      if (visibilityMode === RUNS_VISIBILITY_MODE.FIRST_20_RUNS) {
        return rowIndex >= 20;
      }

      if (visibilityMode === RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS) {
        return ['FINISHED', 'FAILED', 'KILLED'].includes(runStatus ?? '');
      }

      // SHOWALL mode - show everything
      return false;
    },
    [hiddenRuns, visibilityMode],
  );

  const toggleRowVisibility = useCallback((rowUuid: string) => {
    setHiddenRuns((prevHiddenRuns) => {
      const newHiddenRuns = new Set(prevHiddenRuns);
      if (newHiddenRuns.has(rowUuid)) {
        newHiddenRuns.delete(rowUuid);
      } else {
        newHiddenRuns.add(rowUuid);
      }
      return newHiddenRuns;
    });
    // Switch to custom mode when manually toggling
    setVisibilityModeState(RUNS_VISIBILITY_MODE.CUSTOM);
  }, []);

  const setVisibilityMode = useCallback((mode: RUNS_VISIBILITY_MODE) => {
    setVisibilityModeState(mode);
    // Clear custom hidden runs when switching to a predefined mode
    if (mode !== RUNS_VISIBILITY_MODE.CUSTOM) {
      setHiddenRuns(new Set());
    }
  }, []);

  const usingCustomVisibility = visibilityMode === RUNS_VISIBILITY_MODE.CUSTOM && hiddenRuns.size > 0;
  const allRunsHidden = visibilityMode === RUNS_VISIBILITY_MODE.HIDEALL;

  const value = useMemo(
    () => ({
      isRowHidden,
      toggleRowVisibility,
      setVisibilityMode,
      visibilityMode,
      usingCustomVisibility,
      allRunsHidden,
    }),
    [isRowHidden, toggleRowVisibility, setVisibilityMode, visibilityMode, usingCustomVisibility, allRunsHidden],
  );

  return (
    <ExperimentEvaluationRunsRowVisibilityContext.Provider value={value}>
      {children}
    </ExperimentEvaluationRunsRowVisibilityContext.Provider>
  );
};

export const useExperimentEvaluationRunsRowVisibility = () => {
  return useContext(ExperimentEvaluationRunsRowVisibilityContext);
};
```

--------------------------------------------------------------------------------

````

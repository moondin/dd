---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 440
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 440 of 991)

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

---[FILE: routes.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/routes.ts

```typescript
import { createMLflowRoutePath, generatePath } from '../common/utils/RoutingUtils';
import type { ExperimentPageTabName } from './constants';

/**
 * Page identifiers for MLflow experiment tracking pages.
 * Keys should correspond to route paths.
 */
export enum PageId {
  home = 'mlflow.home',
  settingsPage = 'mlflow.settings',
  promptsPage = 'mlflow.prompts',
  promptDetailsPage = 'mlflow.prompts.details',
  experimentPageTabbed = 'mlflow.experiment.details.tab',
  experimentLoggedModelDetailsPageTab = 'mlflow.logged-model.details.tab',
  experimentLoggedModelDetailsPage = 'mlflow.logged-model.details',
  experimentPage = 'mlflow.experiment.details',
  // Child routes for experiment page:
  experimentPageTabRuns = 'mlflow.experiment.tab.runs',
  experimentPageTabModels = 'mlflow.experiment.tab.models',
  experimentPageTabTraces = 'mlflow.experiment.tab.traces',
  experimentPageTabEvaluationRuns = 'mlflow.experiment.tab.evaluation-runs',
  experimentPageTabDatasets = 'mlflow.experiment.tab.datasets',
  experimentPageTabChatSessions = 'mlflow.experiment.tab.chat-sessions',
  experimentPageTabSingleChatSession = 'mlflow.experiment.tab.single-chat-session',
  experimentPageTabScorers = 'mlflow.experiment.tab.scorers',
  experimentPageTabPrompts = 'mlflow.experiment.prompts.list',
  experimentPageTabPromptDetails = 'mlflow.experiment.prompt.details',
  // Child routes for experiment page - end
  experimentPageSearch = 'mlflow.experiment.details.search',
  compareExperimentsSearch = 'mlflow.experiment.compare',
  runPageWithTab = 'mlflow.experiment.run.details',
  runPageDirect = 'mlflow.experiment.run.details.direct',
  compareRuns = 'mlflow.experiment.run.compare',
  metricPage = 'mlflow.metric.details',
}

// Route path definitions (used in defining route elements)
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class RoutePaths {
  static get rootRoute() {
    return createMLflowRoutePath('/');
  }
  static get experimentObservatory() {
    return createMLflowRoutePath('/experiments');
  }
  static get experimentPage() {
    return createMLflowRoutePath('/experiments/:experimentId');
  }
  // Child routes for experiment page:
  static get experimentPageTabRuns() {
    return createMLflowRoutePath('/experiments/:experimentId/runs');
  }
  static get experimentPageTabTraces() {
    return createMLflowRoutePath('/experiments/:experimentId/traces');
  }
  static get experimentPageTabChatSessions() {
    return createMLflowRoutePath('/experiments/:experimentId/chat-sessions');
  }
  static get experimentPageTabSingleChatSession() {
    return createMLflowRoutePath('/experiments/:experimentId/chat-sessions/:sessionId');
  }
  static get experimentPageTabModels() {
    return createMLflowRoutePath('/experiments/:experimentId/models');
  }
  static get experimentPageTabEvaluationRuns() {
    return createMLflowRoutePath('/experiments/:experimentId/evaluation-runs');
  }
  static get experimentPageTabDatasets() {
    return createMLflowRoutePath('/experiments/:experimentId/datasets');
  }
  static get experimentPageTabScorers() {
    return createMLflowRoutePath('/experiments/:experimentId/judges');
  }
  // Child routes for experiment page - end
  static get experimentLoggedModelDetailsPageTab() {
    return createMLflowRoutePath('/experiments/:experimentId/models/:loggedModelId/:tabName');
  }
  static get experimentLoggedModelDetailsPage() {
    return createMLflowRoutePath('/experiments/:experimentId/models/:loggedModelId');
  }
  static get experimentPageTabbed() {
    return createMLflowRoutePath('/experiments/:experimentId/:tabName');
  }
  static get experimentPageSearch() {
    return createMLflowRoutePath('/experiments/:experimentId/s');
  }
  static get runPage() {
    return createMLflowRoutePath('/experiments/:experimentId/runs/:runUuid');
  }
  // More flexible route path, supporting subpages (tabs) and multi-slash artifact paths.
  // Will eventually replace "runPage" above.
  static get runPageWithTab() {
    return createMLflowRoutePath('/experiments/:experimentId/runs/:runUuid/*');
  }
  static get runPageWithArtifact() {
    return createMLflowRoutePath('/experiments/:experimentId/runs/:runUuid/artifactPath/*');
  }
  // OSS experiment prompt page routes
  static get experimentPageTabPrompts() {
    return createMLflowRoutePath('/experiments/:experimentId/prompts');
  }
  static get experimentPageTabPromptDetails() {
    return createMLflowRoutePath('/experiments/:experimentId/prompts/:promptName');
  }
  static get runPageDirect() {
    return createMLflowRoutePath('/runs/:runUuid');
  }
  static get metricPage() {
    return createMLflowRoutePath('/metric/*');
  }
  static get compareRuns() {
    return createMLflowRoutePath('/compare-runs');
  }
  static get compareExperiments() {
    return createMLflowRoutePath('/compare-experiments');
  }
  static get compareExperimentsSearch() {
    return createMLflowRoutePath('/compare-experiments/:searchString');
  }
  /**
   * Route paths for prompts management.
   * Featured exclusively in open source MLflow.
   */
  static get promptsPage() {
    return createMLflowRoutePath('/prompts');
  }
  static get promptDetailsPage() {
    return createMLflowRoutePath('/prompts/:promptName');
  }
  static get settingsPage() {
    return createMLflowRoutePath('/settings');
  }
}

// Concrete routes and functions for generating parametrized paths
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
class Routes {
  static get rootRoute() {
    return RoutePaths.rootRoute;
  }

  static get experimentsObservatoryRoute() {
    return RoutePaths.experimentObservatory;
  }

  static get experimentPageRoute() {
    return RoutePaths.experimentPage;
  }

  static get experimentPageSearchRoute() {
    return RoutePaths.experimentPageSearch;
  }

  static get settingsPageRoute() {
    return RoutePaths.settingsPage;
  }

  static getExperimentPageRoute(experimentId: string, isComparingRuns = false, shareState?: string) {
    const path = generatePath(RoutePaths.experimentPage, { experimentId });
    if (shareState) {
      return `${path}?viewStateShareKey=${shareState}`;
    }
    if (isComparingRuns) {
      return `${path}?isComparingRuns=true`;
    }
    return path;
  }

  static getExperimentPageTracesTabRoute(experimentId: string) {
    return `${Routes.getExperimentPageRoute(experimentId)}/traces`;
  }

  static getExperimentPageTabRoute(experimentId: string, tabName: ExperimentPageTabName) {
    return generatePath(RoutePaths.experimentPageTabbed, { experimentId, tabName });
  }

  static getExperimentPageTabSingleChatSessionRoute(experimentId: string, sessionId: string) {
    return generatePath(RoutePaths.experimentPageTabSingleChatSession, { experimentId, sessionId });
  }

  static getExperimentLoggedModelDetailsPage(experimentId: string, loggedModelId: string) {
    return generatePath(RoutePaths.experimentLoggedModelDetailsPage, { experimentId, loggedModelId });
  }

  static getExperimentLoggedModelDetailsPageRoute(experimentId: string, loggedModelId: string, tabName?: string) {
    if (tabName) {
      return generatePath(RoutePaths.experimentLoggedModelDetailsPageTab, { experimentId, loggedModelId, tabName });
    }
    return generatePath(RoutePaths.experimentLoggedModelDetailsPage, { experimentId, loggedModelId });
  }

  static searchRunsByUser(experimentId: string, userId: string) {
    const path = generatePath(RoutePaths.experimentPage, { experimentId });
    const filterString = `attributes.user_id = '${userId}'`;
    return `${path}?searchFilter=${encodeURIComponent(filterString)}`;
  }

  static searchRunsByLifecycleStage(experimentId: string, lifecycleStage: string) {
    const path = generatePath(RoutePaths.experimentPage, { experimentId });
    return `${path}?lifecycleFilter=${lifecycleStage}`;
  }

  static getRunPageRoute(experimentId: string, runUuid: string, artifactPath: string | null = null) {
    if (artifactPath) {
      return this.getRunPageTabRoute(experimentId, runUuid, ['artifacts', artifactPath].join('/'));
    }
    return generatePath(RoutePaths.runPage, { experimentId, runUuid });
  }

  static getDirectRunPageRoute(runUuid: string) {
    return generatePath(RoutePaths.runPageDirect, { runUuid });
  }

  static getRunPageTabRoute(experimentId: string, runUuid: string, tabPath?: string) {
    return generatePath(RoutePaths.runPageWithTab, {
      experimentId,
      runUuid,
      '*': tabPath,
    });
  }

  /**
   * Get route to the metric plot page
   * @param runUuids - Array of string run IDs to plot
   * @param metricKey - Primary metric key in plot, shown in page breadcrumb
   * @param experimentIds - IDs of experiments to link to from page breadcrumb
   * @param plotMetricKeys - Array of string metric keys to plot
   * @param plotLayout - Object containing plot layout information in Plotly format. See
   *   https://plot.ly/javascript/plotlyjs-events/#update-data for an idea of object structure
   * @param selectedXAxis - Enum (string) describing type of X axis (wall time, relative time, step)
   * @param yAxisLogScale - Boolean - if true, y axis should be displayed on a log scale
   *   (y axis scale is assumed to be linear otherwise)
   * @param lineSmoothness - Float, coefficient >= 0 describing how much line smoothing to apply
   * @param showPoint - Boolean, whether or not to show dots at individual data points in the metric
   *   line plot
   * @param deselectedCurves - Array of strings where each string describes a curve that was
   *   deselected / toggled off by the user (a curve that should not be displayed in the metric
   *   plot). Strings are of the form "<runId>-<metricKey>". We describe the plot in terms
   *   of deselected curves as we don't know a-priori which runs from
   *   runUuids contain which of the metric keys in plotMetricKeys
   * @param lastLinearYAxisRange - Array containing most recent bounds of a linear-scale y axis.
   *   Used to keep track of the most-recent linear y-axis plot range, to handle the specific
   *   case where we toggle a plot with negative y-axis bounds from linear to log scale,
   *   and then back to linear scale (we save the initial negative linear y-axis bounds so
   *   that we can restore them when converting from log back to linear scale)
   */
  static getMetricPageRoute(
    runUuids: string[],
    metricKey: string,
    experimentIds: string[],
    plotMetricKeys: string[] | null = null,
    plotLayout: any = {},
    selectedXAxis: 'wall' | 'step' | 'relative' = 'step',
    yAxisLogScale = false,
    lineSmoothness = 1,
    showPoint = false,
    deselectedCurves: string[] = [],
    lastLinearYAxisRange: string[] = [],
  ) {
    // If runs to display are specified (e.g. if user filtered to specific runs in a metric
    // comparison plot), embed them in the URL, otherwise default to metricKey
    const finalPlotMetricKeys = plotMetricKeys || [metricKey];
    // Convert boolean to enum to keep URL format extensible to adding new types of y axis scales
    const yAxisScale = yAxisLogScale ? 'log' : 'linear';

    const queryString =
      `?runs=${JSON.stringify(runUuids)}` +
      `&metric=${encodeURIComponent(JSON.stringify(metricKey))}` +
      `&experiments=${JSON.stringify(experimentIds)}` +
      `&plot_metric_keys=${encodeURIComponent(JSON.stringify(finalPlotMetricKeys))}` +
      `&plot_layout=${JSON.stringify(plotLayout)}` +
      `&x_axis=${selectedXAxis}` +
      `&y_axis_scale=${yAxisScale}` +
      `&line_smoothness=${lineSmoothness}` +
      `&show_point=${showPoint}` +
      `&deselected_curves=${JSON.stringify(deselectedCurves)}` +
      `&last_linear_y_axis_range=${JSON.stringify(lastLinearYAxisRange)}`;

    return `${generatePath(RoutePaths.metricPage)}${queryString}`;
  }

  static getCompareRunPageRoute(runUuids: string[], experimentIds: string[]) {
    const queryString = `?runs=${JSON.stringify(runUuids)}&experiments=${JSON.stringify(experimentIds)}`;
    return `${generatePath(RoutePaths.compareRuns)}${queryString}`;
  }

  static get compareRunPageRoute() {
    return RoutePaths.compareRuns;
  }
  static get compareExperimentsPageRoute() {
    return RoutePaths.compareExperiments;
  }
  static getCompareExperimentsPageRoute(experimentIds: string[]) {
    const queryString = `?experiments=${JSON.stringify(experimentIds.slice().sort())}`;
    const path = generatePath(RoutePaths.compareExperimentsSearch, { searchString: 's' });
    return `${path}${queryString}`;
  }

  /**
   * Routes for prompts management.
   * Featured exclusively in open source MLflow.
   */
  static get promptsPageRoute() {
    return RoutePaths.promptsPage;
  }

  static getPromptDetailsPageRoute(promptName: string, experimentId?: string) {
    if (experimentId) {
      return generatePath(RoutePaths.experimentPageTabPromptDetails, { experimentId, promptName });
    }
    return generatePath(RoutePaths.promptDetailsPage, { promptName });
  }
}

export default Routes;
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/types.ts
Signals: React

```typescript
import { type KeyValueEntity } from '../common/types';

/**
 * Type definitions for models used in experiment tracking.
 * See 'src/experiment-tracking/sdk/MlflowMessages.js' for reference
 *
 * Note: this could be automatically generated in the future.
 */
import { type CSSProperties } from 'react';
import type { ExperimentPageViewState } from './components/experiment-page/models/ExperimentPageViewState';
import type { RawEvaluationArtifact } from './sdk/EvaluationArtifactService';
import { type ArtifactNode } from './utils/ArtifactUtils';
import type { GetRun } from '../graphql/__generated__/graphql';

export interface RunItem {
  runId: string;
  name: string;
  color: CSSProperties['color'];
  y: number;
}

export type ModelAliasMap = { alias: string; version: string }[];
type ModelVersionAliasList = string[];

/**
 * An entity defining a single model
 */
export interface ModelEntity {
  creation_timestamp: number;
  last_updated_timestamp: number;
  current_stage: string;
  version: string;
  description: string;
  id: string;
  name: string;
  source: string;
  status: string;
  tags: KeyValueEntity[];
  permission_level: string;
  email_subscription_status: string;
  latest_versions: ModelVersionInfoEntity[];
  aliases?: ModelAliasMap;
}

/**
 * An entity defining a single model version
 */
export interface ModelVersionInfoEntity {
  name: string;
  version: string;
  creation_timestamp: number;
  last_updated_timestamp: number;
  user_id: string;
  current_stage: string;
  source: string;
  run_id: string;
  status: string;
  status_message?: string;
  description?: string;
  aliases?: ModelVersionAliasList;
  tags?: KeyValueEntity[];
}

/**
 * A run entity as seen in the API response
 */
export interface RunEntity {
  data: {
    params: KeyValueEntity[];
    tags: KeyValueEntity[];
    metrics: MetricEntity[];
  };
  info: RunInfoEntity;
  inputs?: RunInfoInputsEntity;
  outputs?: RunInfoOutputsEntity;
}

export interface RunInfoInputsEntity {
  datasetInputs?: RunDatasetWithTags[];
  modelInputs?: RunModelEntity[];
}

export interface RunInfoOutputsEntity {
  modelOutputs?: RunModelEntity[];
}

export interface RunModelEntity {
  modelId: string;
}

export interface RunInfoEntity {
  artifactUri: string;
  endTime: number;
  experimentId: string;
  lifecycleStage: string;
  runUuid: string;
  runName: string;
  startTime: number;
  status: 'SCHEDULED' | 'FAILED' | 'FINISHED' | 'RUNNING' | 'KILLED';
}

export interface RunDatasetWithTags {
  dataset: {
    digest: string;
    name: string;
    profile: string;
    schema: string;
    source: string;
    sourceType: string;
  };
  tags: KeyValueEntity[];
}

export interface DatasetSummary {
  experiment_id: string;
  digest: string;
  name: string;
  context?: string;
}

export interface MetricEntity {
  key: string;
  step: number;
  timestamp: number;
  value: number;
}

export type MetricEntitiesByName = Record<string, MetricEntity>;
export type MetricHistoryByName = Record<string, MetricEntity[]>;

export interface ExperimentEntity {
  allowedActions?: string[];
  artifactLocation: string;
  creationTime: number;
  experimentId: string;
  lastUpdateTime: number;
  lifecycleStage: string;
  name: string;
  tags: KeyValueEntity[];
}

export type SampledMetricsByRunUuidState = {
  [runUuid: string]: {
    [metricKey: string]: {
      [rangeKey: string]: {
        loading?: boolean;
        refreshing?: boolean;
        error?: any;
        metricsHistory?: MetricEntity[];
        lastUpdatedTime?: number;
      };
    };
  };
};

export interface RunInputsType {
  modelInputs?: {
    modelId: string;
  }[];
  datasetInputs?: RunDatasetWithTags[];
}

export interface RunOutputsType {
  modelOutputs?: {
    modelId: string;
  }[];
}

export interface ExperimentStoreEntities {
  /**
   * Dictionary with experiment ID as key and entity object as a value
   */
  experimentsById: Record<string, ExperimentEntity>;

  /**
   * Dictionary with run UUID as key and run info object as a value
   */
  runInfosByUuid: Record<string, RunInfoEntity>;

  /**
   * Array to ensure order of returned values is maintained.
   *
   * Run Info is stored as an object in the order that the backend responds
   * with, BUT order is not guaranteed to be preserved when reading
   * Object.values(runInfosByUuid). This array is used to ensure that the order
   * is respected.
   */
  runInfoOrderByUuid: string[];

  /**
   * Dictionary of recorded input datasets by run UUIDs
   */
  runDatasetsByUuid: Record<string, RunDatasetWithTags[]>;

  runInputsOutputsByUuid: Record<
    string,
    {
      inputs?: RunInputsType;
      outputs?: RunOutputsType;
    }
  >;

  /**
   * Dictionary with run UUID as key and metric sub-dictionary as a value.
   * Represents all metrics with history.
   */
  metricsByRunUuid: Record<string, MetricHistoryByName>;

  /**
   * Dictionary with run UUID as key and metric sub-dictionary as a value
   * Represents latest metrics (e.g. fetched along run history).
   */
  latestMetricsByRunUuid: Record<string, MetricEntitiesByName>;

  /**
   * Dictionary with run UUID as key and metric sub-dictionary as a value
   * Represents metrics with min value.
   */
  minMetricsByRunUuid: Record<string, MetricEntitiesByName>;

  /**
   * Dictionary with run UUID as key and metric sub-dictionary as a value
   * Represents metrics with max value.
   */
  maxMetricsByRunUuid: Record<string, MetricEntitiesByName>;

  /**
   * Dictionary of parameters for runs. Run UUID is a first key,
   * param name is the second one.
   */
  paramsByRunUuid: Record<string, Record<string, KeyValueEntity>>;

  /**
   * Dictionary of tags for runs. Run UUID serves is a first key,
   * tag name is the second one.
   */
  tagsByRunUuid: Record<string, Record<string, KeyValueEntity>>;

  /**
   * Dictionary of images for runs. The keys are Run UUID, image name, and
   * metadata filename respectively.
   */
  imagesByRunUuid: Record<string, Record<string, Record<string, ImageEntity>>>;

  /**
   * Dictionary of tags for experiments. Experiment ID serves is a first key,
   * tag name is the second one.
   */
  experimentTagsByExperimentId: Record<string, Record<string, KeyValueEntity>>;

  /**
   * Dictionary of models. Model name is the first key, model version is the second one.
   * Model entity object is the value.
   */
  modelVersionsByModel: Record<string, Record<string, ModelVersionInfoEntity>>;

  /**
   * Dictionary of models for runs. Run UUID is the key, used model entity object is the value.
   */
  modelVersionsByRunUuid: Record<string, ModelVersionInfoEntity[]>;

  /**
   * Dictionary of models by name. Model name is the key, used model entity object is the value.
   */
  modelByName: Record<string, ModelEntity>;

  /**
   * List of all runs that match recently used filter. Runs that were fetched because they are
   * pinned (not because they fit the filter) are excluded from this list.
   */
  runUuidsMatchingFilter: string[];

  /**
   * List of all datasets for given experiment ID.
   */
  datasetsByExperimentId: Record<string, DatasetSummary[]>;

  /**
   * Dictionary of sampled metric values.
   * Indexed by run UUIDs, metric keys and sample ranges.
   */
  sampledMetricsByRunUuid: SampledMetricsByRunUuidState;

  /**
   * Dictionary of artifact root URIs by run UUIDs.
   */
  artifactRootUriByRunUuid: Record<string, string>;

  /**
   * Dictionary of artifact root URIs by run UUIDs.
   */
  artifactsByRunUuid: Record<string, ArtifactNode>;

  /**
   * Easy-access dictionary of assigned run colors keyed by run UUIDs.
   */
  colorByRunUuid: Record<string, string>;
}

export enum LIFECYCLE_FILTER {
  ACTIVE = 'Active',
  DELETED = 'Deleted',
}

export enum MODEL_VERSION_FILTER {
  WITH_MODEL_VERSIONS = 'With Model Versions',
  WTIHOUT_MODEL_VERSIONS = 'Without Model Versions',
  ALL_RUNS = 'All Runs',
}

export type ExperimentCategorizedUncheckedKeys = {
  attributes: string[];
  metrics: string[];
  params: string[];
  tags: string[];
};

/**
 * Function used to update the local (non-persistable) view state.
 * First parameter is the subset of fields that the current view state model will be merged with.
 */
export type UpdateExperimentViewStateFn = (newPartialViewState: Partial<ExperimentPageViewState>) => void;

/**
 * Enum representing the different types of dataset sources.
 */
export enum DatasetSourceTypes {
  DELTA = 'delta_table',
  EXTERNAL = 'external',
  CODE = 'code',
  LOCAL = 'local',
  HTTP = 'http',
  S3 = 's3',
  HUGGING_FACE = 'hugging_face',
  UC = 'uc_volume',
  DATABRICKS_UC_TABLE = 'databricks-uc-table',
}

/**
 * Describes a single entry in the text evaluation artifact
 */
export interface EvaluationArtifactTableEntry {
  [fieldName: string]: any;
}

/**
 * Describes a single entry in the text evaluation artifact
 */
export interface PendingEvaluationArtifactTableEntry {
  isPending: boolean;
  entryData: EvaluationArtifactTableEntry;
  totalTokens?: number;
  evaluationTime: number;
}

/**
 * Descibes a single text evaluation artifact with a set of entries and its name
 */
export interface EvaluationArtifactTable {
  path: string;
  columns: string[];
  entries: EvaluationArtifactTableEntry[];
  /**
   * Raw contents of the artifact JSON file. Used to calculate the write-back.
   */
  rawArtifactFile?: RawEvaluationArtifact;
}

/**
 * Known artifact types that are useful for the evaluation purposes
 */
export enum RunLoggedArtifactType {
  TABLE = 'table',
}

/**
 * Shape of the contents of "mlflow.loggedArtifacts" tag
 */
export type RunLoggedArtifactsDeclaration = {
  path: string;
  type: RunLoggedArtifactType;
}[];

// "MODELS", "EVAL_RESULTS", "DATASETS", and "LABELING_SESSIONS" are the not real legacy view modes, they are used to navigate to the
// corresponding tabs on the experiment page.
export type ExperimentViewRunsCompareMode =
  | 'TABLE'
  | 'ARTIFACT'
  | 'CHART'
  | 'TRACES'
  | 'MODELS'
  | 'EVAL_RESULTS'
  | 'DATASETS'
  | 'LABELING_SESSIONS';

/**
 * Describes a section of the compare runs view
 */
export type ChartSectionConfig = {
  name: string; // Display name of the section
  uuid: string; // Unique section ID of the section
  display: boolean; // Whether the section is displayed
  isReordered: boolean; // Whether the charts in the section has been reordered
  columns?: number;
  cardHeight?: number;
};

export type RunViewMetricConfig = {
  metricKey: string; // key of the metric
  sectionKey: string; // key of the section initialized with prefix of metricKey
};

export interface ImageEntity {
  key: string;
  filepath: string;
  compressed_filepath: string;
  step: number;
  timestamp: number;
}

export interface ArtifactFileInfo {
  path: string;
  is_dir: boolean;
  file_size: number;
}

export interface ArtifactListFilesResponse {
  root_uri: string;
  files: ArtifactFileInfo[];
}

export interface ArtifactLogTableImageObject {
  type: string;
  filepath: string;
  compressed_filepath: string;
}

export interface EvaluateCellImage {
  url: string;
  compressed_url: string;
}

export interface GetRunApiResponse {
  run: RunEntity;
}

export interface SearchRunsApiResponse {
  runs?: RunEntity[];
  next_page_token?: string;
}

export interface SearchExperimentsApiResponse {
  experiments: ExperimentEntity[];
  next_page_token?: string;
}

export interface GetExperimentApiResponse {
  experiment: ExperimentEntity;
}
export type GraphQLExperimentRun = NonNullable<GetRun['mlflowGetRun']>['run'];

export enum LoggedModelStatusProtoEnum {
  LOGGED_MODEL_PENDING = 'LOGGED_MODEL_PENDING',
  LOGGED_MODEL_READY = 'LOGGED_MODEL_READY',
  LOGGED_MODEL_STATUS_UNSPECIFIED = 'LOGGED_MODEL_STATUS_UNSPECIFIED',
  LOGGED_MODEL_UPLOAD_FAILED = 'LOGGED_MODEL_UPLOAD_FAILED',
}

export interface LoggedModelMetricProto {
  dataset_digest?: string;
  dataset_name?: string;
  key?: string;
  model_id?: string;
  run_id?: string;
  step?: number;
  timestamp?: number;
  value?: number;
}

export type LoggedModelMetricDataset = Pick<LoggedModelMetricProto, 'dataset_digest' | 'dataset_name'>;

export interface LoggedModelKeyValueProto {
  key?: string;
  value?: string;
}
export interface LoggedModelRegistrationProto {
  name?: string;
  version?: string;
}

export type LoggedModelProto = {
  data?: {
    metrics?: LoggedModelMetricProto[];
    params?: LoggedModelKeyValueProto[];
  };
  info?: {
    artifact_uri?: string;
    creation_timestamp_ms?: number;
    creator_id?: string;
    experiment_id?: string;
    last_updated_timestamp_ms?: number;
    model_id?: string;
    model_type?: string;
    name?: string;
    source_run_id?: string;
    status?: LoggedModelStatusProtoEnum;
    status_message?: string;
    registrations?: LoggedModelRegistrationProto[];
    tags?: LoggedModelKeyValueProto[];
  };
};
```

--------------------------------------------------------------------------------

---[FILE: ModelGatewayActions.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/actions/ModelGatewayActions.ts
Signals: Redux/RTK

```typescript
import { MlflowService } from '@mlflow/mlflow/src/experiment-tracking/sdk/MlflowService';
import { getUUID } from '../../common/utils/ActionUtils';
import type { AsyncAction } from '../../redux-types';
import type {
  ModelGatewayQueryPayload,
  ModelGatewayRouteLegacy,
  SearchMlflowDeploymentsModelRoutesResponse,
} from '../sdk/ModelGatewayService';
import { ModelGatewayRoute, ModelGatewayService } from '../sdk/ModelGatewayService';

const SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES = 'SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES';

export interface SearchMlflowDeploymentsModelRoutesAction
  extends AsyncAction<SearchMlflowDeploymentsModelRoutesResponse> {
  type: 'SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES';
}

export const searchMlflowDeploymentsRoutesApi = (filter?: string): SearchMlflowDeploymentsModelRoutesAction => ({
  type: SEARCH_MLFLOW_DEPLOYMENTS_MODEL_ROUTES,
  payload: MlflowService.gatewayProxyGet({
    gateway_path: 'api/2.0/endpoints/',
  }) as Promise<SearchMlflowDeploymentsModelRoutesResponse>,
  meta: { id: getUUID() },
});
```

--------------------------------------------------------------------------------

---[FILE: PromptEngineeringActions.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/actions/PromptEngineeringActions.ts
Signals: Redux/RTK

```typescript
import { cloneDeep, fromPairs } from 'lodash';
import type { Action } from 'redux';
import Utils from '../../common/utils/Utils';
import type { AsyncAction, ReduxState, ThunkDispatch } from '../../redux-types';
import { uploadArtifactApi } from '../actions';
import type { RunRowType } from '../components/experiment-page/utils/experimentPage.row-types';
import { MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME } from '../constants';
import type { RawEvaluationArtifact } from '../sdk/EvaluationArtifactService';
import { parseEvaluationTableArtifact } from '../sdk/EvaluationArtifactService';
import type { ModelGatewayQueryPayload, ModelGatewayRouteType, ModelGatewayRoute } from '../sdk/ModelGatewayService';
import { ModelGatewayService } from '../sdk/ModelGatewayService';
import type { EvaluationArtifactTable } from '../types';
import { searchMlflowDeploymentsRoutesApi } from './ModelGatewayActions';
import {
  PROMPTLAB_METADATA_COLUMN_LATENCY,
  PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS,
} from '../components/prompt-engineering/PromptEngineering.utils';

const EVALUATE_PROMPT_TABLE_VALUE = 'EVALUATE_PROMPT_TABLE_VALUE';
export interface EvaluatePromptTableValueAction
  extends AsyncAction<
    { metadata: any; text: string },
    {
      inputValues: Record<string, string>;
      run: RunRowType;
      compiledPrompt: string;
      rowKey: string;
      startTime: number;
      gatewayRoute: ModelGatewayRoute;
    }
  > {
  type: 'EVALUATE_PROMPT_TABLE_VALUE';
}
const evaluatePromptTableValueUnified =
  ({
    routeName,
    routeType,
    compiledPrompt,
    inputValues,
    parameters,
    outputColumn,
    rowKey,
    run,
  }: {
    routeName: string;
    routeType: ModelGatewayRouteType;
    compiledPrompt: string;
    inputValues: Record<string, string>;
    parameters: ModelGatewayQueryPayload['parameters'];
    outputColumn: string;
    rowKey: string;
    run: RunRowType;
  }) =>
  async (dispatch: ThunkDispatch, getState: () => ReduxState) => {
    // Check if model gateway routes have been fetched. If not, fetch them first.
    const { modelGateway } = getState();
    if (!modelGateway.modelGatewayRoutesLoading.loading && Object.keys(modelGateway.modelGatewayRoutes).length === 0) {
      await dispatch(searchAllPromptLabAvailableEndpoints());
    }
    // If the gateway is not present in the store, it means that it was deleted
    // recently. Display relevant error in this scenario.
    const gatewayRoute = getState().modelGateway.modelGatewayRoutes[`${routeType}:${routeName}`];
    if (!gatewayRoute) {
      const errorMessage = `MLflow deployment endpoint ${routeName} does not exist anymore!`;
      Utils.logErrorAndNotifyUser(errorMessage);
      throw new Error(errorMessage);
    }
    const modelGatewayRequestPayload: ModelGatewayQueryPayload = {
      inputText: compiledPrompt,
      parameters,
    };

    const action = {
      type: EVALUATE_PROMPT_TABLE_VALUE,
      payload: ModelGatewayService.queryModelGatewayRoute(gatewayRoute, modelGatewayRequestPayload),
      meta: {
        inputValues,
        run,
        compiledPrompt,
        rowKey,
        startTime: performance.now(),
      },
    };
    return dispatch(action);
  };

const DISCARD_PENDING_EVALUATION_DATA = 'DISCARD_PENDING_EVALUATION_DATA';
export type DiscardPendingEvaluationDataAction = Action<'DISCARD_PENDING_EVALUATION_DATA'>;
export const discardPendingEvaluationData = () => ({
  type: DISCARD_PENDING_EVALUATION_DATA,
});

export const WRITE_BACK_EVALUATION_ARTIFACTS = 'WRITE_BACK_EVALUATION_ARTIFACTS';

export interface WriteBackEvaluationArtifactsAction
  extends AsyncAction<
    { runUuid: string; newEvaluationTable: EvaluationArtifactTable }[],
    { runUuidsToUpdate: string[]; artifactPath: string }
  > {
  type: 'WRITE_BACK_EVALUATION_ARTIFACTS';
}

export const writeBackEvaluationArtifactsAction = () => async (dispatch: ThunkDispatch, getState: () => ReduxState) => {
  const { evaluationPendingDataByRunUuid, evaluationArtifactsByRunUuid } = getState().evaluationData;
  const runUuidsToUpdate = Object.keys(evaluationPendingDataByRunUuid);
  const originalRunArtifacts = fromPairs(
    Object.entries(evaluationArtifactsByRunUuid)
      .filter(
        ([runUuid, artifactTableRecords]) =>
          runUuidsToUpdate.includes(runUuid) && artifactTableRecords[MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME],
      )
      .map(([runUuid, artifactTableRecords]) => [
        runUuid,
        artifactTableRecords[MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME],
      ]),
  );

  const updatedArtifactFiles = runUuidsToUpdate.map((runUuid) => {
    const originalTableRecord = originalRunArtifacts[runUuid];

    if (!originalTableRecord) {
      throw new Error(`Cannot find existing prompt engineering artifact for run ${runUuid}`);
    }

    const transformedEntries = evaluationPendingDataByRunUuid[runUuid].map(
      ({ entryData, evaluationTime, totalTokens }) => {
        return originalTableRecord.columns.map((columnName) => {
          if (columnName === PROMPTLAB_METADATA_COLUMN_LATENCY) {
            return evaluationTime.toString();
          } else if (columnName === PROMPTLAB_METADATA_COLUMN_TOTAL_TOKENS && totalTokens) {
            return totalTokens.toString();
          } else {
            return entryData[columnName] || '';
          }
        });
      },
    );

    const updatedArtifactFile = cloneDeep(originalRunArtifacts[runUuid].rawArtifactFile) as RawEvaluationArtifact;
    updatedArtifactFile?.data.unshift(...transformedEntries);

    return { runUuid, updatedArtifactFile };
  });

  const promises = updatedArtifactFiles.map(({ runUuid, updatedArtifactFile }) =>
    dispatch(uploadArtifactApi(runUuid, MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME, updatedArtifactFile)).then(() => {
      const newEvaluationTable = parseEvaluationTableArtifact(
        MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME,
        updatedArtifactFile,
      );
      return { runUuid, newEvaluationTable };
    }),
  );

  return dispatch({
    type: 'WRITE_BACK_EVALUATION_ARTIFACTS',
    payload: Promise.all(promises),
    meta: { runUuidsToUpdate, artifactPath: MLFLOW_PROMPT_ENGINEERING_ARTIFACT_NAME },
  });
};
const EVALUATE_ADD_INPUT_VALUES = 'EVALUATE_ADD_INPUT_VALUES';
export interface EvaluateAddInputValues extends Action<'EVALUATE_ADD_INPUT_VALUES'> {
  payload: Record<string, string>;
}
export const evaluateAddInputValues = (inputValues: Record<string, string>) => ({
  type: EVALUATE_ADD_INPUT_VALUES,
  payload: inputValues,
  meta: {},
});

export const evaluatePromptTableValue = ({
  routeName,
  routeType,
  compiledPrompt,
  inputValues,
  parameters,
  outputColumn,
  rowKey,
  run,
}: {
  routeName: string;
  routeType: ModelGatewayRouteType;
  compiledPrompt: string;
  inputValues: Record<string, string>;
  parameters: ModelGatewayQueryPayload['parameters'];
  outputColumn: string;
  rowKey: string;
  run: RunRowType;
}) => {
  const evaluateParams = {
    routeName,
    compiledPrompt,
    inputValues,
    parameters,
    outputColumn,
    rowKey,
    run,
  };

  return evaluatePromptTableValueUnified({
    ...evaluateParams,
    routeType,
  });
};

export const searchAllPromptLabAvailableEndpoints = () => async (dispatch: ThunkDispatch) => {
  return dispatch(searchMlflowDeploymentsRoutesApi());
};
```

--------------------------------------------------------------------------------

````

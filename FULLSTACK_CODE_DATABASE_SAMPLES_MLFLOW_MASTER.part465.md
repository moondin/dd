---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 465
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 465 of 991)

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

---[FILE: EvaluationRunCompareSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/EvaluationRunCompareSelector.tsx
Signals: React

```typescript
import {
  Typography,
  useDesignSystemTheme,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxOptionList,
  DialogComboboxOptionListSelectItem,
  DialogComboboxCustomButtonTriggerWrapper,
  Button,
  ChevronDownIcon,
  XCircleFillIcon,
} from '@databricks/design-system';
import { useCallback, useMemo } from 'react';
import { useGetExperimentRunColor } from '../experiment-page/hooks/useExperimentRunColor';
import { useIntl } from '@databricks/i18n';
import Routes from '../../routes';
import {
  useGenAiExperimentRunsForComparison,
  COMPARE_TO_RUN_DROPDOWN_COMPONENT_ID,
} from '@databricks/web-shared/genai-traces-table';
import { RunColorPill } from '../experiment-page/components/RunColorPill';

export const EvaluationRunCompareSelector = ({
  experimentId,
  currentRunUuid,
  setCompareToRunUuid,
  compareToRunUuid,
  setCurrentRunUuid: setCurrentRunUuidProp,
}: {
  experimentId: string;
  currentRunUuid?: string;
  setCompareToRunUuid?: (runUuid: string | undefined) => void;
  compareToRunUuid?: string;
  // used in evaluation runs tab
  setCurrentRunUuid?: (runUuid: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const getRunColor = useGetExperimentRunColor();

  const { runInfos: experimentRunInfos } = useGenAiExperimentRunsForComparison(experimentId);

  const currentRunOptions = useMemo(() => {
    if (!experimentRunInfos) return undefined;
    return experimentRunInfos
      .map((runInfo) => ({
        key: runInfo.runUuid,
        value: runInfo.runName ?? runInfo.runUuid,
      }))
      .filter((result) => result.key) as {
      key: string;
      value: string;
    }[];
  }, [experimentRunInfos]);

  const compareToRunOptions = useMemo(() => {
    if (!experimentRunInfos) return undefined;
    return experimentRunInfos
      .filter((runInfo) => runInfo.runUuid !== currentRunUuid)
      .map((runInfo) => ({
        key: runInfo.runUuid,
        value: runInfo.runName ?? runInfo.runUuid,
      }))
      .filter((result) => Boolean(result.key)) as {
      key: string;
      value: string;
    }[];
  }, [experimentRunInfos, currentRunUuid]);

  const currentRunInfo = experimentRunInfos?.find((runInfo) => runInfo.runUuid === currentRunUuid);
  const compareToRunInfo = experimentRunInfos?.find((runInfo) => runInfo.runUuid === compareToRunUuid);

  const defaultSetCurrentRunUuid = useCallback(
    (runUuid: string) => {
      const link = Routes.getRunPageRoute(experimentId, runUuid) + '/evaluations';
      // Propagate all the current URL query params.
      const currentParams = new URLSearchParams(window.location.search);

      const newUrl = new URL(link, window.location.origin);
      currentParams.forEach((value, key) => {
        newUrl.searchParams.set(key, value);
      });

      window.location.href = newUrl.toString();
    },
    [experimentId],
  );

  const setCurrentRunUuid = setCurrentRunUuidProp ?? defaultSetCurrentRunUuid;

  if (!currentRunUuid) {
    return <></>;
  }

  return (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing.sm,
        alignItems: 'center',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: theme.spacing.sm,
        }}
      >
        <DialogCombobox
          componentId={COMPARE_TO_RUN_DROPDOWN_COMPONENT_ID}
          id="compare-to-run-combobox"
          value={currentRunUuid ? [currentRunUuid] : undefined}
        >
          <DialogComboboxCustomButtonTriggerWrapper>
            <Button
              endIcon={<ChevronDownIcon />}
              componentId="mlflow.evaluations_review.table_ui.compare_to_run_button"
              css={{
                justifyContent: 'flex-start !important',
              }}
            >
              <div
                css={{
                  display: 'flex',
                  gap: theme.spacing.sm,
                  alignItems: 'center',
                  fontSize: `${theme.typography.fontSizeSm}px !important`,
                }}
              >
                <RunColorPill color={getRunColor(currentRunUuid)} />
                {currentRunInfo?.runName ? (
                  <Typography.Hint>{currentRunInfo?.runName}</Typography.Hint>
                ) : (
                  // eslint-disable-next-line formatjs/enforce-description
                  intl.formatMessage({ defaultMessage: 'Select baseline run' })
                )}
              </div>
            </Button>
          </DialogComboboxCustomButtonTriggerWrapper>
          <DialogComboboxContent>
            <DialogComboboxOptionList>
              {(currentRunOptions || []).map((item, i) => (
                <DialogComboboxOptionListSelectItem
                  key={i}
                  value={item.value}
                  onChange={(e) => setCurrentRunUuid(item.key)}
                  checked={item.key === currentRunUuid}
                >
                  <div
                    css={{
                      display: 'flex',
                      gap: theme.spacing.sm,
                      alignItems: 'center',
                    }}
                  >
                    <RunColorPill color={getRunColor(item.key)} />
                    {item.value}
                  </div>
                </DialogComboboxOptionListSelectItem>
              ))}
            </DialogComboboxOptionList>
          </DialogComboboxContent>
        </DialogCombobox>
      </div>
      <span css={{}}>
        {intl.formatMessage({
          defaultMessage: 'compare to',
          description: 'Label for "to" in compare to, which is split between two dropdowns of two runs to compare',
        })}
      </span>
      {setCompareToRunUuid && (
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <DialogCombobox
              componentId={COMPARE_TO_RUN_DROPDOWN_COMPONENT_ID}
              id="compare-to-run-combobox"
              value={compareToRunUuid ? [compareToRunUuid] : undefined}
            >
              <DialogComboboxCustomButtonTriggerWrapper>
                <Button
                  endIcon={<ChevronDownIcon />}
                  componentId="mlflow.evaluations_review.table_ui.compare_to_run_button"
                  css={{
                    justifyContent: 'flex-start !important',
                  }}
                >
                  <div
                    css={{
                      display: 'flex',
                      gap: theme.spacing.sm,
                      alignItems: 'center',
                      fontSize: `${theme.typography.fontSizeSm}px !important`,
                    }}
                  >
                    {compareToRunInfo?.runName ? (
                      <>
                        <RunColorPill color={getRunColor(compareToRunUuid)} />
                        <Typography.Hint>{compareToRunInfo?.runName}</Typography.Hint>
                      </>
                    ) : (
                      <span
                        css={{
                          color: theme.colors.textPlaceholder,
                        }}
                      >
                        {/* eslint-disable-next-line formatjs/enforce-description */}
                        {intl.formatMessage({ defaultMessage: 'baseline run' })}
                      </span>
                    )}
                  </div>
                </Button>
              </DialogComboboxCustomButtonTriggerWrapper>
              <DialogComboboxContent>
                <DialogComboboxOptionList>
                  {(compareToRunOptions || []).map((item, i) => (
                    <DialogComboboxOptionListSelectItem
                      key={i}
                      value={item.value}
                      onChange={(e) => setCompareToRunUuid(item.key)}
                      checked={item.key === compareToRunUuid}
                    >
                      <div
                        css={{
                          display: 'flex',
                          gap: theme.spacing.sm,
                          alignItems: 'center',
                        }}
                      >
                        <RunColorPill color={getRunColor(item.key)} />
                        {item.value}
                      </div>
                    </DialogComboboxOptionListSelectItem>
                  ))}
                </DialogComboboxOptionList>
              </DialogComboboxContent>
            </DialogCombobox>
            {compareToRunInfo?.runName && (
              <XCircleFillIcon
                aria-hidden="false"
                css={{
                  color: theme.colors.textPlaceholder,
                  fontSize: theme.typography.fontSizeSm,
                  marginLeft: theme.spacing.sm,

                  ':hover': {
                    color: theme.colors.actionTertiaryTextHover,
                  },
                }}
                role="button"
                onClick={() => {
                  setCompareToRunUuid(undefined);
                }}
                onPointerDownCapture={(e) => {
                  // Prevents the dropdown from opening when clearing
                  e.stopPropagation();
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewEvaluationsTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/RunViewEvaluationsTab.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { ParagraphSkeleton } from '@databricks/design-system';
import { type KeyValueEntity } from '../../../common/types';
import { useDesignSystemTheme } from '@databricks/design-system';
import { useCompareToRunUuid } from './hooks/useCompareToRunUuid';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import { EvaluationRunCompareSelector } from './EvaluationRunCompareSelector';
import { getEvalTabTotalTracesLimit } from '@mlflow/mlflow/src/common/utils/FeatureUtils';
import { getTrace as getTraceV3 } from '@mlflow/mlflow/src/experiment-tracking/utils/TraceUtils';
import type { TracesTableColumn, TraceActions, GetTraceFunction } from '@databricks/web-shared/genai-traces-table';
import {
  EXECUTION_DURATION_COLUMN_ID,
  GenAiTracesMarkdownConverterProvider,
  RUN_EVALUATION_RESULTS_TAB_COMPARE_RUNS,
  RUN_EVALUATION_RESULTS_TAB_SINGLE_RUN,
  getTracesTagKeys,
  STATE_COLUMN_ID,
  RESPONSE_COLUMN_ID,
  TracesTableColumnType,
  useMlflowTracesTableMetadata,
  useSelectedColumns,
  useSearchMlflowTraces,
  GenAITracesTableToolbar,
  GenAITracesTableProvider,
  GenAITracesTableBodyContainer,
  useGenAiTraceEvaluationArtifacts,
  useFilters,
  useTableSort,
  TOKENS_COLUMN_ID,
  invalidateMlflowSearchTracesCache,
  TRACE_ID_COLUMN_ID,
  shouldUseTracesV4API,
  createTraceLocationForExperiment,
  createTraceLocationForUCSchema,
  useFetchTraceV4LazyQuery,
  doesTraceSupportV4API,
} from '@databricks/web-shared/genai-traces-table';
import { useRunLoggedTraceTableArtifacts } from './hooks/useRunLoggedTraceTableArtifacts';
import { useMarkdownConverter } from '../../../common/utils/MarkdownUtils';
import { useEditExperimentTraceTags } from '../traces/hooks/useEditExperimentTraceTags';
import { useCallback, useMemo, useState } from 'react';
import { useDeleteTracesMutation } from './hooks/useDeleteTraces';
import { RunViewEvaluationsTabArtifacts } from './RunViewEvaluationsTabArtifacts';
import { useGetExperimentRunColor } from '../experiment-page/hooks/useExperimentRunColor';
import { useQueryClient } from '@databricks/web-shared/query-client';
import { checkColumnContents } from '../experiment-page/components/traces-v3/utils/columnUtils';
import type {
  ModelTraceLocationMlflowExperiment,
  ModelTraceLocationUcSchema,
} from '@databricks/web-shared/model-trace-explorer';
import { isV3ModelTraceInfo, type ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import type { UseGetRunQueryResponseExperiment } from '../run-page/hooks/useGetRunQuery';
import type { ExperimentEntity } from '../../types';
import { useGetDeleteTracesAction } from '../experiment-page/components/traces-v3/hooks/useGetDeleteTracesAction';
// eslint-disable-next-line no-useless-rename -- renaming due to copybara transformation
import { useExportTracesToDatasetModal as useExportTracesToDatasetModal } from '../../pages/experiment-evaluation-datasets/hooks/useExportTracesToDatasetModal';
import { useSearchRunsQuery } from '../run-page/hooks/useSearchRunsQuery';

const ContextProviders = ({
  children,
  makeHtmlFromMarkdown,
  experimentId,
}: {
  makeHtmlFromMarkdown: (markdown?: string) => string;
  experimentId?: string;
  children: React.ReactNode;
}) => {
  return (
    <GenAiTracesMarkdownConverterProvider makeHtml={makeHtmlFromMarkdown}>
      {children}
    </GenAiTracesMarkdownConverterProvider>
  );
};

const RunViewEvaluationsTabInner = ({
  experimentId,
  runUuid,
  runDisplayName,
  setCurrentRunUuid,
}: {
  experimentId: string;
  runUuid: string;
  runDisplayName: string;
  setCurrentRunUuid?: (runUuid: string) => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const makeHtmlFromMarkdown = useMarkdownConverter();

  const [compareToRunUuid, setCompareToRunUuid] = useCompareToRunUuid();

  const traceLocations = useMemo(() => [createTraceLocationForExperiment(experimentId)], [experimentId]);
  const getTrace = getTraceV3;
  const isQueryDisabled = false;

  // Get table metadata
  const {
    assessmentInfos,
    allColumns,
    totalCount,
    evaluatedTraces,
    otherEvaluatedTraces,
    isLoading: isTableMetadataLoading,
    error: tableMetadataError,
    tableFilterOptions,
  } = useMlflowTracesTableMetadata({
    locations: traceLocations,
    runUuid,
    otherRunUuid: compareToRunUuid,
    disabled: isQueryDisabled,
  });

  // Setup table states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useFilters();
  const getRunColor = useGetExperimentRunColor();
  const queryClient = useQueryClient();

  const defaultSelectedColumns = useCallback(
    (columns: TracesTableColumn[]) => {
      const { responseHasContent, inputHasContent, tokensHasContent } = checkColumnContents(
        evaluatedTraces.concat(otherEvaluatedTraces),
      );

      return columns.filter(
        (col) =>
          col.type === TracesTableColumnType.ASSESSMENT ||
          col.type === TracesTableColumnType.EXPECTATION ||
          (inputHasContent && col.type === TracesTableColumnType.INPUT) ||
          (responseHasContent && col.type === TracesTableColumnType.TRACE_INFO && col.id === RESPONSE_COLUMN_ID) ||
          (tokensHasContent && col.type === TracesTableColumnType.TRACE_INFO && col.id === TOKENS_COLUMN_ID) ||
          (col.type === TracesTableColumnType.TRACE_INFO &&
            [TRACE_ID_COLUMN_ID, EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID].includes(col.id)),
      );
    },
    [evaluatedTraces, otherEvaluatedTraces],
  );

  const { selectedColumns, toggleColumns, setSelectedColumns } = useSelectedColumns(
    experimentId,
    allColumns,
    defaultSelectedColumns,
    runUuid,
  );

  const [tableSort, setTableSort] = useTableSort(selectedColumns);

  // Get traces data
  const {
    data: traceInfos,
    isLoading: traceInfosLoading,
    isFetching: traceInfosFetching,
    error: traceInfosError,
    refetchMlflowTraces,
  } = useSearchMlflowTraces({
    locations: traceLocations,
    currentRunDisplayName: runDisplayName,
    searchQuery,
    filters,
    runUuid,
    tableSort,
    disabled: isQueryDisabled,
  });

  const {
    data: compareToRunData,
    displayName: compareToRunDisplayName,
    loading: compareToRunLoading,
  } = useGetCompareToData({
    experimentId,
    traceLocations,
    compareToRunUuid,
    isQueryDisabled,
  });

  const countInfo = useMemo(() => {
    return {
      currentCount: traceInfos?.length,
      logCountLoading: traceInfosLoading,
      totalCount: totalCount,
      maxAllowedCount: getEvalTabTotalTracesLimit(),
    };
  }, [traceInfos, traceInfosLoading, totalCount]);

  // TODO: We should update this to use web-shared/unified-tagging components for the
  // tag editor and react-query mutations for the apis.
  const { showEditTagsModalForTrace, EditTagsModal } = useEditExperimentTraceTags({
    onSuccess: () => invalidateMlflowSearchTracesCache({ queryClient }),
    existingTagKeys: getTracesTagKeys(traceInfos || []),
  });

  const deleteTracesAction = useGetDeleteTracesAction({ traceSearchLocations: traceLocations });
  // TODO: Unify export action between managed and OSS
  const { showExportTracesToDatasetsModal, setShowExportTracesToDatasetsModal, renderExportTracesToDatasetsModal } =
    useExportTracesToDatasetModal({
      experimentId,
    });

  const traceActions: TraceActions = useMemo(() => {
    return {
      deleteTracesAction,
      exportToEvals: {
        showExportTracesToDatasetsModal: showExportTracesToDatasetsModal,
        setShowExportTracesToDatasetsModal: setShowExportTracesToDatasetsModal,
        renderExportTracesToDatasetsModal: renderExportTracesToDatasetsModal,
      },
      // Enable unified tags modal if V4 APIs is enabled
      editTags: {
        showEditTagsModalForTrace,
        EditTagsModal,
      },
    };
  }, [
    deleteTracesAction,
    showExportTracesToDatasetsModal,
    setShowExportTracesToDatasetsModal,
    renderExportTracesToDatasetsModal,
    showEditTagsModalForTrace,
    EditTagsModal,
  ]);

  const isTableLoading = traceInfosLoading || compareToRunLoading;
  const displayLoadingOverlay = false;

  if (isTableMetadataLoading) {
    return <LoadingSkeleton />;
  }

  if (tableMetadataError) {
    return (
      <div>
        <pre>{String(tableMetadataError)}</pre>
      </div>
    );
  }

  return (
    <div
      css={{
        marginTop: theme.spacing.sm,
        width: '100%',
        overflowY: 'hidden',
      }}
    >
      <div
        css={{
          width: '100%',
          padding: `${theme.spacing.xs}px 0`,
        }}
      >
        <EvaluationRunCompareSelector
          experimentId={experimentId}
          currentRunUuid={runUuid}
          compareToRunUuid={compareToRunUuid}
          setCompareToRunUuid={setCompareToRunUuid}
          setCurrentRunUuid={setCurrentRunUuid}
        />
      </div>
      <GenAITracesTableProvider>
        <div
          css={{
            overflowY: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <GenAITracesTableToolbar
            experimentId={experimentId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            assessmentInfos={assessmentInfos}
            countInfo={countInfo}
            traceActions={traceActions}
            tableSort={tableSort}
            setTableSort={setTableSort}
            allColumns={allColumns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            toggleColumns={toggleColumns}
            traceInfos={traceInfos}
            tableFilterOptions={tableFilterOptions}
          />
          {isTableLoading ? (
            <LoadingSkeleton />
          ) : traceInfosError ? (
            <div>
              <pre>{String(traceInfosError)}</pre>
            </div>
          ) : (
            <ContextProviders makeHtmlFromMarkdown={makeHtmlFromMarkdown} experimentId={experimentId}>
              <GenAITracesTableBodyContainer
                experimentId={experimentId}
                currentRunDisplayName={runDisplayName}
                compareToRunDisplayName={compareToRunDisplayName}
                compareToRunUuid={compareToRunUuid}
                getTrace={getTrace}
                getRunColor={getRunColor}
                assessmentInfos={assessmentInfos}
                setFilters={setFilters}
                filters={filters}
                selectedColumns={selectedColumns}
                allColumns={allColumns}
                tableSort={tableSort}
                currentTraceInfoV3={traceInfos || []}
                compareToTraceInfoV3={compareToRunData}
                onTraceTagsEdit={showEditTagsModalForTrace}
                displayLoadingOverlay={displayLoadingOverlay}
              />
            </ContextProviders>
          )}
          {EditTagsModal}
        </div>
      </GenAITracesTableProvider>
    </div>
  );
};

export const RunViewEvaluationsTab = ({
  experimentId,
  experiment,
  runUuid,
  runTags,
  runDisplayName,
  setCurrentRunUuid,
}: {
  experimentId: string;
  experiment?: ExperimentEntity | UseGetRunQueryResponseExperiment;
  runUuid: string;
  runTags?: Record<string, KeyValueEntity>;
  runDisplayName: string;
  // used in evaluation runs tab
  setCurrentRunUuid?: (runUuid: string) => void;
}) => {
  // Determine which tables are logged in the run
  const traceTablesLoggedInRun = useRunLoggedTraceTableArtifacts(runTags);
  const isArtifactCallEnabled = Boolean(runUuid);

  const { data: artifactData, isLoading: isArtifactLoading } = useGenAiTraceEvaluationArtifacts(
    {
      runUuid: runUuid || '',
      ...{ artifacts: traceTablesLoggedInRun ? traceTablesLoggedInRun : undefined },
    },
    { disabled: !isArtifactCallEnabled },
  );

  if (isArtifactLoading) {
    return <LoadingSkeleton />;
  }

  if (!isNil(artifactData) && artifactData.length > 0) {
    return (
      <RunViewEvaluationsTabArtifacts
        experimentId={experimentId}
        runUuid={runUuid}
        runDisplayName={runDisplayName}
        data={artifactData}
        runTags={runTags}
      />
    );
  }

  return (
    <RunViewEvaluationsTabInner
      experimentId={experimentId}
      runUuid={runUuid}
      runDisplayName={runDisplayName}
      setCurrentRunUuid={setCurrentRunUuid}
    />
  );
};

const LoadingSkeleton = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div css={{ display: 'block', marginTop: theme.spacing.md, height: '100%', width: '100%' }}>
      {[...Array(10).keys()].map((i) => (
        <ParagraphSkeleton label="Loading..." key={i} seed={`s-${i}`} />
      ))}
    </div>
  );
};

const useGetCompareToData = (params: {
  experimentId: string;
  traceLocations: ModelTraceLocationUcSchema[] | ModelTraceLocationMlflowExperiment[];
  compareToRunUuid: string | undefined;
  isQueryDisabled?: boolean;
}): {
  data: ModelTraceInfoV3[] | undefined;
  displayName: string;
  loading: boolean;
} => {
  const { compareToRunUuid, experimentId, traceLocations, isQueryDisabled } = params;
  const { data: traceInfos, isLoading: traceInfosLoading } = useSearchMlflowTraces({
    locations: traceLocations,
    currentRunDisplayName: undefined,
    runUuid: compareToRunUuid,
    disabled: isNil(compareToRunUuid) || isQueryDisabled,
  });

  const { data: runData, loading: runDetailsLoading } = useSearchRunsQuery({
    experimentIds: [experimentId],
    filter: `attributes.runId = "${compareToRunUuid}"`,
    disabled: isNil(compareToRunUuid),
  });

  return {
    data: traceInfos,
    displayName: Utils.getRunDisplayName(runData?.info, compareToRunUuid),
    loading: traceInfosLoading || runDetailsLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: RunViewEvaluationsTabArtifacts.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/RunViewEvaluationsTabArtifacts.tsx

```typescript
import { isNil } from 'lodash';
import { Empty, LegacySkeleton } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { type KeyValueEntity } from '../../../common/types';
import { useDesignSystemTheme } from '@databricks/design-system';
import { useCompareToRunUuid } from './hooks/useCompareToRunUuid';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import { EvaluationRunCompareSelector } from './EvaluationRunCompareSelector';
import { useSavePendingEvaluationAssessments } from './hooks/useSavePendingEvaluationAssessments';
import type {
  GenAiTraceEvaluationArtifactFile,
  TracesTableColumn,
  RunEvaluationTracesDataEntry,
} from '@databricks/web-shared/genai-traces-table';
import {
  EXECUTION_DURATION_COLUMN_ID,
  GenAiTracesTable,
  GenAiTracesMarkdownConverterProvider,
  STATE_COLUMN_ID,
  TAGS_COLUMN_ID,
  TracesTableColumnType,
  useGenAiTraceEvaluationArtifacts,
} from '@databricks/web-shared/genai-traces-table';
import { useRunLoggedTraceTableArtifacts } from './hooks/useRunLoggedTraceTableArtifacts';
import { useMarkdownConverter } from '../../../common/utils/MarkdownUtils';
import { getTraceLegacy } from '@mlflow/mlflow/src/experiment-tracking/utils/TraceUtils';
import { useSearchRunsQuery } from '../run-page/hooks/useSearchRunsQuery';

export const RunViewEvaluationsTabArtifacts = ({
  experimentId,
  runUuid,
  runTags,
  runDisplayName,
  data,
}: {
  experimentId: string;
  runUuid: string;
  runTags?: Record<string, KeyValueEntity>;
  runDisplayName: string;
  data: RunEvaluationTracesDataEntry[];
}) => {
  const { theme } = useDesignSystemTheme();

  // Determine which tables are logged in the run
  const traceTablesLoggedInRun = useRunLoggedTraceTableArtifacts(runTags);

  const noEvaluationTablesLogged = data?.length === 0;

  const [compareToRunUuid, setCompareToRunUuid] = useCompareToRunUuid();

  const makeHtmlFromMarkdown = useMarkdownConverter();
  const saveAssessmentsQuery = useSavePendingEvaluationAssessments();

  const {
    data: compareToRunData,
    displayName: compareToRunDisplayName,
    loading: compareToRunLoading,
  } = useGetCompareToDataWithArtifacts(experimentId, compareToRunUuid, traceTablesLoggedInRun);

  if (compareToRunLoading) {
    // TODO: Implement proper skeleton for this page
    return <LegacySkeleton />;
  }

  const initialSelectedColumns = (allColumns: TracesTableColumn[]) => {
    return allColumns.filter(
      (col) =>
        col.type === TracesTableColumnType.ASSESSMENT ||
        col.type === TracesTableColumnType.INPUT ||
        (col.type === TracesTableColumnType.TRACE_INFO &&
          [EXECUTION_DURATION_COLUMN_ID, STATE_COLUMN_ID, TAGS_COLUMN_ID].includes(col.id)),
    );
  };

  /**
   * Determine whether to render the component from the shared codebase (GenAiTracesTable)
   * or the legacy one from the local codebase (EvaluationsOverview).
   */
  const getOverviewTableComponent = () => {
    const componentProps = {
      experimentId,
      currentRunDisplayName: runDisplayName,
      currentEvaluationResults: data || [],
      compareToEvaluationResults: compareToRunData,
      runUuid,
      compareToRunUuid,
      compareToRunDisplayName,
      compareToRunLoading,
      saveAssessmentsQuery,
      getTrace: getTraceLegacy,
      initialSelectedColumns,
    } as const;
    return (
      <GenAiTracesMarkdownConverterProvider makeHtml={makeHtmlFromMarkdown}>
        <GenAiTracesTable {...componentProps} />
      </GenAiTracesMarkdownConverterProvider>
    );
  };

  if (noEvaluationTablesLogged) {
    return (
      <div css={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Empty
          title={
            <FormattedMessage
              defaultMessage="No evaluation tables logged"
              description="Run page > Evaluations tab > No evaluation tables logged"
            />
          }
          description={null}
        />
      </div>
    );
  }

  return (
    <div
      css={{
        marginTop: theme.spacing.sm,
        width: '100%',
        overflowY: 'hidden',
      }}
    >
      <div
        css={{
          width: '100%',
          padding: `${theme.spacing.xs}px 0`,
        }}
      >
        <EvaluationRunCompareSelector
          experimentId={experimentId}
          currentRunUuid={runUuid}
          compareToRunUuid={compareToRunUuid}
          setCompareToRunUuid={setCompareToRunUuid}
        />
      </div>
      {getOverviewTableComponent()}
    </div>
  );
};

const useGetCompareToDataWithArtifacts = (
  experimentId: string,
  compareToRunUuid: string | undefined,
  traceTablesLoggedInRun: GenAiTraceEvaluationArtifactFile[],
): {
  data: RunEvaluationTracesDataEntry[] | undefined;
  displayName: string;
  loading: boolean;
} => {
  const { data, isLoading: loading } = useGenAiTraceEvaluationArtifacts(
    {
      runUuid: compareToRunUuid || '',
      artifacts: traceTablesLoggedInRun,
    },
    { disabled: isNil(compareToRunUuid) },
  );

  const { data: runData, loading: runDetailsLoading } = useSearchRunsQuery({
    experimentIds: [experimentId],
    filter: `attributes.runId = "${compareToRunUuid}"`,
    disabled: isNil(compareToRunUuid),
  });

  return {
    data,
    displayName: Utils.getRunDisplayName(runData?.info, compareToRunUuid),
    loading: loading || runDetailsLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useCompareToRunUuid.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/evaluations/hooks/useCompareToRunUuid.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

const QUERY_PARAM_KEY = 'compareToRunUuid';

/**
 * Query param-powered hook that returns the compare to run uuid when comparison is enabled.
 */
export const useCompareToRunUuid = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const compareToRunUuid = searchParams.get(QUERY_PARAM_KEY) ?? undefined;

  const setCompareToRunUuid = useCallback(
    (compareToRunId: string | undefined) => {
      setSearchParams((params) => {
        if (compareToRunId === undefined) {
          params.delete(QUERY_PARAM_KEY);
          return params;
        }
        params.set(QUERY_PARAM_KEY, compareToRunId);
        return params;
      });
    },
    [setSearchParams],
  );

  return [compareToRunUuid, setCompareToRunUuid] as const;
};
```

--------------------------------------------------------------------------------

````

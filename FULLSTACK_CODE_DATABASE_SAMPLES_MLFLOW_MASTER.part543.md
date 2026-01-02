---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 543
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 543 of 991)

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

---[FILE: ExperimentSingleChatConversation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/single-chat-view/ExperimentSingleChatConversation.tsx
Signals: React

```typescript
import {
  getModelTraceId,
  SingleChatTurnMessages,
  SingleChatTurnAssessments,
  shouldEnableAssessmentsInSessions,
  type ModelTrace,
} from '@databricks/web-shared/model-trace-explorer';
import {
  Button,
  importantify,
  ParagraphSkeleton,
  Spacer,
  TitleSkeleton,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import type { MutableRefObject } from 'react';
import { ExperimentSingleChatIcon } from './ExperimentSingleChatIcon';

export const ExperimentSingleChatConversation = ({
  traces,
  selectedTurnIndex,
  setSelectedTurnIndex,
  setSelectedTrace,
  chatRefs,
  getAssessmentTitle,
}: {
  traces: ModelTrace[];
  selectedTurnIndex: number | null;
  setSelectedTurnIndex: (turnIndex: number | null) => void;
  setSelectedTrace: (trace: ModelTrace) => void;
  chatRefs: MutableRefObject<{ [traceId: string]: HTMLDivElement }>;
  getAssessmentTitle: (assessmentName: string) => string;
}) => {
  const { theme } = useDesignSystemTheme();

  if (!traces) {
    return null;
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflowY: 'auto',
        gap: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        paddingLeft: theme.spacing.sm,
      }}
    >
      {traces.map((trace, index) => {
        const isActive = selectedTurnIndex === index;
        const traceId = getModelTraceId(trace);

        return (
          <div
            ref={(el) => {
              if (el) {
                chatRefs.current[traceId] = el;
              }
            }}
            key={traceId}
            css={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              gap: theme.spacing.sm,
              backgroundColor: isActive ? theme.colors.actionDefaultBackgroundHover : undefined,
              border: `1px solid ${theme.colors.border}`,
              padding: theme.spacing.md,
              borderRadius: theme.borders.borderRadiusMd,
            }}
            onMouseEnter={() => setSelectedTurnIndex(index)}
          >
            <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <ExperimentSingleChatIcon />
              <Typography.Text bold>
                <FormattedMessage
                  defaultMessage="Turn {turnNumber}"
                  description="Label for a single turn within an experiment chat session"
                  values={{ turnNumber: index + 1 }}
                />
              </Typography.Text>
              <div css={{ flex: 1 }} />
              <Button
                componentId="mlflow.experiment.chat-session.view-trace"
                size="small"
                color="primary"
                css={[
                  {
                    visibility: isActive ? 'visible' : 'hidden',
                  },
                  // Required for button to have an outstanding background over the chat turn hover state
                  importantify({ backgroundColor: theme.colors.backgroundPrimary }),
                ]}
                onClick={() => setSelectedTrace(trace)}
              >
                <FormattedMessage
                  defaultMessage="View full trace"
                  description="Button to view a full trace within a chat session"
                />
              </Button>
            </div>
            <SingleChatTurnMessages key={traceId} trace={trace} />
            {shouldEnableAssessmentsInSessions() && (
              <>
                <Spacer size="sm" />
                <SingleChatTurnAssessments
                  trace={trace}
                  getAssessmentTitle={getAssessmentTitle}
                  onAddAssessmentsClick={() => setSelectedTrace(trace)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ExperimentSingleChatConversationSkeleton = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflowY: 'auto',
        gap: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        paddingLeft: theme.spacing.sm,
      }}
    >
      <div
        css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, width: '60%', alignSelf: 'flex-start' }}
      >
        <TitleSkeleton css={{ width: '20%' }} />
        {[...Array(5).keys()].map((i) => (
          <ParagraphSkeleton key={i} seed={`s-${i}`} />
        ))}
      </div>
      <div
        css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, width: '60%', alignSelf: 'flex-end' }}
      >
        <TitleSkeleton css={{ width: '20%' }} />
        {[...Array(5).keys()].map((i) => (
          <ParagraphSkeleton key={i} seed={`s-${i}`} />
        ))}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentSingleChatIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/single-chat-view/ExperimentSingleChatIcon.tsx

```typescript
import { ChainIcon, useDesignSystemTheme } from '@databricks/design-system';

export const ExperimentSingleChatIcon = ({ displayLink = false }: { displayLink?: boolean }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: theme.general.iconSize,
        height: theme.general.iconSize,
        borderRadius: theme.borders.borderRadiusSm,
        border: `1px solid ${theme.colors.branded.ai.gradientStart}`,
        backgroundColor: theme.colors.backgroundSecondary,
        '::after': displayLink
          ? {
              content: '""',
              position: 'absolute',
              width: 1,
              height: theme.spacing.md,
              backgroundColor: theme.colors.branded.ai.gradientStart,
              top: '100%',
              left: theme.spacing.sm,
            }
          : undefined,
      }}
    >
      <ChainIcon color="ai" />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentSingleChatSessionPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/single-chat-view/ExperimentSingleChatSessionPage.tsx
Signals: React

```typescript
import ErrorUtils from '@mlflow/mlflow/src/common/utils/ErrorUtils';
import { withErrorBoundary } from '@mlflow/mlflow/src/common/utils/withErrorBoundary';
import { FormattedMessage } from '@mlflow/mlflow/src/i18n/i18n';
import type { GetTraceFunction } from '@databricks/web-shared/genai-traces-table';
import {
  createTraceLocationForExperiment,
  createTraceLocationForUCSchema,
  doesTraceSupportV4API,
  useGetTraces,
  useSearchMlflowTraces,
} from '@databricks/web-shared/genai-traces-table';

import { useParams, useLocation } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import invariant from 'invariant';
import { useGetExperimentQuery } from '../../../hooks/useExperimentQuery';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { TracesV3Toolbar } from '../../../components/experiment-page/components/traces-v3/TracesV3Toolbar';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';
import {
  getModelTraceId,
  isV3ModelTraceInfo,
  ModelTraceExplorer,
  ModelTraceExplorerUpdateTraceContextProvider,
  shouldUseTracesV4API,
} from '@databricks/web-shared/model-trace-explorer';
import {
  ExperimentSingleChatSessionSidebar,
  ExperimentSingleChatSessionSidebarSkeleton,
} from './ExperimentSingleChatSessionSidebar';
import { getTrace as getTraceV3 } from '@mlflow/mlflow/src/experiment-tracking/utils/TraceUtils';
import { getChatSessionsFilter } from '../utils';
import {
  ExperimentSingleChatConversation,
  ExperimentSingleChatConversationSkeleton,
} from './ExperimentSingleChatConversation';
import { Drawer, useDesignSystemTheme } from '@databricks/design-system';
import { SELECTED_TRACE_ID_QUERY_PARAM } from '../../../constants';

const ContextProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const ExperimentSingleChatSessionPageImpl = () => {
  const { theme } = useDesignSystemTheme();
  const { experimentId, sessionId } = useParams();
  const location = useLocation();
  const [selectedTurnIndex, setSelectedTurnIndex] = useState<number | null>(null);
  const [selectedTrace, setSelectedTrace] = useState<ModelTrace | null>(null);
  const chatRefs = useRef<{ [traceId: string]: HTMLDivElement }>({});

  invariant(experimentId, 'Experiment ID must be defined');
  invariant(sessionId, 'Session ID must be defined');

  const selectedTraceIdFromUrl = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(SELECTED_TRACE_ID_QUERY_PARAM);
  }, [location.search]);

  const { loading: isLoadingExperiment } = useGetExperimentQuery({
    experimentId,
    options: {
      fetchPolicy: 'cache-only',
    },
  });

  const traceSearchLocations = useMemo(
    () => {
      return [createTraceLocationForExperiment(experimentId)];
    },
    // prettier-ignore
    [
      experimentId,
    ],
  );

  const filters = useMemo(() => getChatSessionsFilter({ sessionId }), [sessionId]);

  const { data: traceInfos, isLoading: isLoadingTraceInfos } = useSearchMlflowTraces({
    locations: traceSearchLocations,
    filters,
    disabled: false,
  });

  const sortedTraceInfos = useMemo(() => {
    return traceInfos?.sort((a, b) => new Date(a.request_time).getTime() - new Date(b.request_time).getTime());
  }, [traceInfos]);

  const getTrace = getTraceV3;
  const getAssessmentTitle = useCallback((assessmentName: string) => assessmentName, []);
  const {
    data: traces,
    isLoading: isLoadingTraceDatas,
    invalidateSingleTraceQuery,
  } = useGetTraces(getTrace, sortedTraceInfos);

  useEffect(() => {
    if (selectedTraceIdFromUrl && traces && traces.length > 0 && !isLoadingTraceDatas) {
      const traceIndex = traces.findIndex((trace) => getModelTraceId(trace) === selectedTraceIdFromUrl);
      if (traceIndex !== -1) {
        setSelectedTurnIndex(traceIndex);
        const traceRef = chatRefs.current[selectedTraceIdFromUrl];
        if (traceRef) {
          traceRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [selectedTraceIdFromUrl, traces, isLoadingTraceDatas]);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <TracesV3Toolbar
        // prettier-ignore
        viewState="single-chat-session"
        sessionId={sessionId}
      />
      {isLoadingTraceDatas || isLoadingTraceInfos ? (
        <div css={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <ExperimentSingleChatSessionSidebarSkeleton />
          <ExperimentSingleChatConversationSkeleton />
        </div>
      ) : (
        <div css={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <ExperimentSingleChatSessionSidebar
            traces={traces ?? []}
            selectedTurnIndex={selectedTurnIndex}
            setSelectedTurnIndex={setSelectedTurnIndex}
            setSelectedTrace={setSelectedTrace}
            chatRefs={chatRefs}
          />
          <ExperimentSingleChatConversation
            traces={traces ?? []}
            selectedTurnIndex={selectedTurnIndex}
            setSelectedTurnIndex={setSelectedTurnIndex}
            setSelectedTrace={setSelectedTrace}
            chatRefs={chatRefs}
            getAssessmentTitle={getAssessmentTitle}
          />
        </div>
      )}
      <Drawer.Root
        open={selectedTrace !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTrace(null);
          }
        }}
      >
        <Drawer.Content
          componentId="mlflow.experiment.chat-session.trace-drawer"
          title={selectedTrace ? getModelTraceId(selectedTrace) : ''}
          width="90vw"
          expandContentToFullHeight
        >
          <div
            css={{
              height: '100%',
              marginLeft: -theme.spacing.lg,
              marginRight: -theme.spacing.lg,
              marginBottom: -theme.spacing.lg,
            }}
          >
            <ContextProviders // prettier-ignore
            >
              {selectedTrace && <ModelTraceExplorer modelTrace={selectedTrace} collapseAssessmentPane="force-open" />}
            </ContextProviders>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
};

const ExperimentSingleChatSessionPage = withErrorBoundary(
  ErrorUtils.mlflowServices.CHAT_SESSIONS,
  ExperimentSingleChatSessionPageImpl,
  <FormattedMessage
    defaultMessage="An error occurred while rendering the chat session."
    description="Generic error message for uncaught errors when rendering a single chat session in MLflow experiment page"
  />,
);

export default ExperimentSingleChatSessionPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentSingleChatSessionSidebar.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-chat-sessions/single-chat-view/ExperimentSingleChatSessionSidebar.tsx
Signals: React

```typescript
import { ChainIcon, TitleSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { getModelTraceId, type ModelTrace, type ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import type { MutableRefObject } from 'react';
import { useCallback } from 'react';
import { ExperimentSingleChatIcon } from './ExperimentSingleChatIcon';
import { FormattedMessage } from 'react-intl';

export const ExperimentSingleChatSessionSidebar = ({
  traces,
  selectedTurnIndex,
  setSelectedTurnIndex,
  setSelectedTrace,
  chatRefs,
}: {
  traces: ModelTrace[];
  selectedTurnIndex: number | null;
  setSelectedTurnIndex: (turnIndex: number | null) => void;
  setSelectedTrace: (trace: ModelTrace) => void;
  chatRefs: MutableRefObject<{ [traceId: string]: HTMLDivElement }>;
}) => {
  const { theme } = useDesignSystemTheme();

  const scrollToTrace = useCallback(
    (trace: ModelTrace) => {
      const traceId = getModelTraceId(trace);
      if (chatRefs.current[traceId]) {
        chatRefs.current[traceId].scrollIntoView({ behavior: 'smooth' });
      }
    },
    [chatRefs],
  );

  if (!traces) {
    return null;
  }

  return (
    <div
      css={{
        minHeight: 0,
        width: 200,
        borderRight: `1px solid ${theme.colors.border}`,
        overflow: 'auto',
        paddingTop: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
      }}
    >
      {traces.map((trace, index) => (
        <div
          key={getModelTraceId(trace)}
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            backgroundColor: selectedTurnIndex === index ? theme.colors.actionDefaultBackgroundHover : undefined,
            padding: theme.spacing.xs,
            borderRadius: theme.borders.borderRadiusSm,
            cursor: 'pointer',
          }}
          onMouseEnter={() => setSelectedTurnIndex(index)}
          onClick={() => scrollToTrace(trace)}
        >
          <ExperimentSingleChatIcon displayLink={index !== traces.length - 1} />

          <Typography.Text bold>
            <FormattedMessage
              defaultMessage="Turn {turnNumber}"
              description="Label for a single turn within an experiment chat session"
              values={{ turnNumber: index + 1 }}
            />
          </Typography.Text>
        </div>
      ))}
    </div>
  );
};

export const ExperimentSingleChatSessionSidebarSkeleton = () => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: 200,
        borderRight: `1px solid ${theme.colors.border}`,
        gap: theme.spacing.xs,
        paddingTop: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
      }}
    >
      <TitleSkeleton css={{ width: '60%' }} />
      <TitleSkeleton css={{ width: '80%' }} />
      <TitleSkeleton css={{ width: '70%' }} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/constants.ts

```typescript
export const GET_DATASET_RECORDS_QUERY_KEY = 'GET_DATASET_RECORDS';
export const SEARCH_EVALUATION_DATASETS_QUERY_KEY = 'SEARCH_EVALUATION_DATASETS';
export const FETCH_TRACES_QUERY_KEY = 'FETCH_TRACES';
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/ExperimentEvaluationDatasetsPage.tsx
Signals: React

```typescript
import { Global } from '@emotion/react';
import { useDesignSystemTheme } from '@databricks/design-system';
import { ResizableBox } from 'react-resizable';
import { ExperimentViewRunsTableResizerHandle } from '../../components/experiment-page/components/runs/ExperimentViewRunsTableResizer';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from '../../../common/utils/RoutingUtils';
import invariant from 'invariant';
import { ExperimentEvaluationDatasetsListTable } from './components/ExperimentEvaluationDatasetsListTable';
import { ExperimentEvaluationDatasetRecordsTable } from './components/ExperimentEvaluationDatasetRecordsTable';
import { ExperimentEvaluationDatasetsPageWrapper } from './ExperimentEvaluationDatasetsPageWrapper';
import { ExperimentEvaluationDatasetsEmptyState } from './components/ExperimentEvaluationDatasetsEmptyState';
import { useSelectedDatasetBySearchParam } from './hooks/useSelectedDatasetBySearchParam';
import { useSearchEvaluationDatasets } from './hooks/useSearchEvaluationDatasets';

const ExperimentEvaluationDatasetsPageImpl = () => {
  const { experimentId } = useParams();
  const { theme } = useDesignSystemTheme();
  const [tableWidth, setTableWidth] = useState(400);
  const [dragging, setDragging] = useState(false);
  const [datasetListHidden, setDatasetListHidden] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useSelectedDatasetBySearchParam();
  // searchFilter only gets updated after the user presses enter
  const [searchFilter, setSearchFilter] = useState('');

  invariant(experimentId, 'Experiment ID must be defined');

  const {
    data: datasets,
    isLoading,
    isFetching,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useSearchEvaluationDatasets({ experimentId, nameFilter: searchFilter });

  // Auto-select the first dataset when:
  // - No dataset is currently selected, OR
  // - The selected dataset is no longer in the list (e.g., was deleted / not in search)
  const datasetIds = useMemo(() => datasets?.map((d) => d.dataset_id) ?? [], [datasets]);
  useEffect(() => {
    if (datasets?.length && (!selectedDatasetId || !datasetIds.includes(selectedDatasetId))) {
      setSelectedDatasetId(datasets[0].dataset_id);
    }
  }, [datasets, selectedDatasetId, datasetIds, setSelectedDatasetId]);

  // Derive selected dataset from datasets and selectedDatasetId
  const selectedDataset = useMemo(() => {
    if (!datasets?.length || !selectedDatasetId) return undefined;
    return datasets.find((d) => d.dataset_id === selectedDatasetId);
  }, [datasets, selectedDatasetId]);

  return (
    <div css={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: '0px' }}>
      <ResizableBox
        css={{ display: 'flex', position: 'relative' }}
        style={{ flex: `0 0 ${datasetListHidden ? 0 : tableWidth}px` }}
        width={tableWidth}
        axis="x"
        resizeHandles={['e']}
        minConstraints={[250, 0]}
        handle={
          <ExperimentViewRunsTableResizerHandle
            runListHidden={datasetListHidden}
            updateRunListHidden={() => {
              setDatasetListHidden(!datasetListHidden);
            }}
          />
        }
        onResize={(event, { size }) => {
          if (datasetListHidden) {
            return;
          }
          setTableWidth(size.width);
        }}
        onResizeStart={() => !datasetListHidden && setDragging(true)}
        onResizeStop={() => setDragging(false)}
      >
        <div css={{ display: datasetListHidden ? 'none' : 'flex', flex: 1, minWidth: 0 }}>
          <ExperimentEvaluationDatasetsListTable
            experimentId={experimentId}
            datasets={datasets}
            isLoading={isLoading}
            isFetching={isFetching}
            error={error}
            refetch={refetch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            selectedDatasetId={selectedDatasetId}
            setSelectedDatasetId={setSelectedDatasetId}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
          />
        </div>
      </ResizableBox>
      <div
        css={{
          flex: 1,
          display: 'flex',
          borderLeft: `1px solid ${theme.colors.border}`,
          minHeight: '0px',
          overflow: 'hidden',
        }}
      >
        {!isLoading && !selectedDataset && <ExperimentEvaluationDatasetsEmptyState experimentId={experimentId} />}
        {selectedDataset && <ExperimentEvaluationDatasetRecordsTable dataset={selectedDataset} />}
      </div>
      {dragging && (
        <Global
          styles={{
            'body, :host': {
              userSelect: 'none',
            },
          }}
        />
      )}
    </div>
  );
};

const ExperimentEvaluationDatasetsPage = () => {
  return (
    <ExperimentEvaluationDatasetsPageWrapper>
      <ExperimentEvaluationDatasetsPageImpl />
    </ExperimentEvaluationDatasetsPageWrapper>
  );
};

export default ExperimentEvaluationDatasetsPage;
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetsPageWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/ExperimentEvaluationDatasetsPageWrapper.tsx

```typescript
import { UserActionErrorHandler } from '@databricks/web-shared/metrics';
import { ErrorBoundary } from 'react-error-boundary';
import { DangerIcon, Empty, PageWrapper } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

const PageFallback = ({ error }: { error?: Error }) => {
  return (
    <PageWrapper css={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Empty
        data-testid="fallback"
        title={
          <FormattedMessage
            defaultMessage="Error"
            description="Title for error fallback component in experiment datasets UI"
          />
        }
        description={
          error?.message ?? (
            <FormattedMessage
              defaultMessage="An error occurred while rendering this component."
              description="Description for default error message in experiment datasets UI"
            />
          )
        }
        image={<DangerIcon />}
      />
    </PageWrapper>
  );
};

/**
 * Wrapper for the experiment evaluation datasets page.
 * Provides error boundaries and user action error handling.
 */
export const ExperimentEvaluationDatasetsPageWrapper = ({
  children,
  resetKey,
}: {
  children: React.ReactNode;
  resetKey?: unknown;
}) => {
  return (
    <ErrorBoundary FallbackComponent={PageFallback} resetKeys={[resetKey]}>
      <UserActionErrorHandler>{children}</UserActionErrorHandler>
    </ErrorBoundary>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/types.ts

```typescript
export type EvaluationDataset = {
  // Unique identifier for the dataset
  dataset_id: string;

  // Dataset name (user-friendly identifier)
  name: string;

  // Tags as JSON string (key-value pairs for metadata)
  tags?: string;

  // Schema information (JSON)
  schema?: string;

  // Profile information (JSON)
  profile?: string;

  // Dataset digest for integrity checking
  digest?: string;

  // Creation timestamp in milliseconds
  created_time: number;

  // Last update timestamp in milliseconds
  last_update_time: number;

  // User who created the dataset
  created_by: string;

  // User who last updated the dataset
  last_updated_by: string;

  // Associated experiment IDs (populated from entity_associations table)
  experiment_ids: string[];
};

export interface EvaluationDatasetRecord {
  // Unique identifier for the record
  dataset_record_id: string;

  // ID of the dataset this record belongs to
  dataset_id: string;

  // Inputs as JSON string
  inputs?: string;

  // Expectations as JSON string
  expectations?: string;

  // Tags as JSON string
  tags?: string;

  // Source information as JSON string
  source?: string;

  // Source ID for quick lookups (e.g., trace_id)
  source_id?: string;

  // Source type
  source_type?: DatasetRecordSource;

  // Creation timestamp in milliseconds
  created_time?: number;

  // Last update timestamp in milliseconds
  last_update_time?: number;

  // User who created the record
  created_by?: string;

  // User who last updated the record
  last_updated_by?: string;

  // Outputs as JSON string
  outputs?: string;
}

export type SourceType = 'SOURCE_TYPE_UNSPECIFIED' | 'TRACE' | 'HUMAN' | 'DOCUMENT' | 'CODE';

export type DatasetRecordSource = {
  // The type of the source.
  source_type?: SourceType;

  // Source-specific data as JSON
  source_data?: string;
};

export type GetDatasetRecords = {
  // Dataset ID to get records for
  dataset_id: string;

  // Optional pagination - maximum number of records to return
  max_results?: number;

  // Optional pagination token for getting next page
  page_token?: string;
};
```

--------------------------------------------------------------------------------

---[FILE: CreateEvaluationDatasetButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/CreateEvaluationDatasetButton.tsx
Signals: React

```typescript
import { Button, DatabaseIcon } from '@databricks/design-system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CreateEvaluationDatasetModal } from './CreateEvaluationDatasetModal';

export const CreateEvaluationDatasetButton = ({ experimentId }: { experimentId: string }) => {
  const [showCreateDatasetModal, setShowCreateDatasetModal] = useState(false);
  return (
    <>
      <Button
        componentId="mlflow.eval-datasets.create-dataset-button"
        css={{ width: 'min-content' }}
        icon={<DatabaseIcon />}
        onClick={() => setShowCreateDatasetModal(true)}
      >
        <FormattedMessage defaultMessage="Create dataset" description="Create evaluation dataset button" />
      </Button>
      <CreateEvaluationDatasetModal
        experimentId={experimentId}
        visible={showCreateDatasetModal}
        onCancel={() => setShowCreateDatasetModal(false)}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: CreateEvaluationDatasetModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/CreateEvaluationDatasetModal.tsx
Signals: React

```typescript
import { FormUI, Input, Modal } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { useCreateEvaluationDatasetMutation } from '../hooks/useCreateEvaluationDatasetMutation';
import { useCallback, useState } from 'react';

export const CreateEvaluationDatasetModal = ({
  visible,
  experimentId,
  onCancel,
}: {
  visible: boolean;
  experimentId: string;
  onCancel: () => void;
}) => {
  const intl = useIntl();
  const [datasetName, setDatasetName] = useState('');
  const [datasetNameError, setDatasetNameError] = useState('');
  const { createEvaluationDatasetMutation, isLoading } = useCreateEvaluationDatasetMutation({
    onSuccess: () => {
      // close modal when dataset is created
      onCancel();
    },
  });

  const handleCreateEvaluationDataset = useCallback(() => {
    if (!datasetName) {
      setDatasetNameError(
        intl.formatMessage({
          defaultMessage: 'Dataset name is required',
          description: 'Input field error when dataset name is empty',
        }),
      );
      return;
    }
    createEvaluationDatasetMutation({ datasetName, experimentIds: [experimentId] });
  }, [createEvaluationDatasetMutation, experimentId, datasetName, intl]);

  return (
    <Modal
      componentId="mlflow.create-evaluation-dataset-modal"
      visible={visible}
      onCancel={onCancel}
      okText={intl.formatMessage({ defaultMessage: 'Create', description: 'Create evaluation dataset button text' })}
      cancelText={intl.formatMessage({
        defaultMessage: 'Cancel',
        description: 'Cancel create evaluation dataset button text',
      })}
      onOk={handleCreateEvaluationDataset}
      okButtonProps={{ loading: isLoading, disabled: !datasetName }}
      title={
        <FormattedMessage
          defaultMessage="Create evaluation dataset"
          description="Create evaluation dataset modal title"
        />
      }
    >
      <FormUI.Label htmlFor="dataset-name-input">
        <FormattedMessage defaultMessage="Dataset name" description="Dataset name label" />
      </FormUI.Label>
      <Input
        componentId="mlflow.create-evaluation-dataset-modal.dataset-name"
        id="dataset-name-input"
        name="name"
        type="text"
        placeholder={intl.formatMessage({
          defaultMessage: 'Enter dataset name',
          description: 'Dataset name placeholder',
        })}
        value={datasetName}
        onChange={(e) => {
          setDatasetName(e.target.value);
          setDatasetNameError('');
        }}
      />
      {datasetNameError && <FormUI.Message type="error" message={datasetNameError} />}
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentEvaluationDatasetJsonCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-evaluation-datasets/components/ExperimentEvaluationDatasetJsonCell.tsx
Signals: React

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';
import type { Cell, Table } from '@tanstack/react-table';
import type { EvaluationDatasetRecord } from '../types';
import { useMemo } from 'react';
import { escapeRegExp } from 'lodash';

const HighlightedText = ({ text, searchFilter, theme }: { text: string; searchFilter: string; theme: any }) => {
  const highlightedParts = useMemo(() => {
    if (!searchFilter.trim()) {
      return [text];
    }

    const regex = new RegExp(`(${escapeRegExp(searchFilter)})`, 'gi');
    const parts = text.split(regex);

    // Use blue highlight colors that work well in both light and dark modes
    const highlightColor = theme.isDarkMode ? theme.colors.blue800 : theme.colors.blue100;

    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === searchFilter.toLowerCase();
      if (isMatch) {
        return (
          <span key={index} css={{ backgroundColor: highlightColor }}>
            {part}
          </span>
        );
      }
      return part;
    });
  }, [text, searchFilter, theme]);

  return <>{highlightedParts}</>;
};

export const JsonCell = ({
  cell,
  table: { options },
}: {
  cell: Cell<EvaluationDatasetRecord, any>;
  table: Table<EvaluationDatasetRecord>;
}) => {
  const { theme } = useDesignSystemTheme();
  const cellValue = cell.getValue();
  const value = cellValue !== undefined ? JSON.stringify(cellValue, null, 2) : '';
  const rowSize = (options?.meta as any)?.rowSize;
  const searchFilter = (options?.meta as any)?.searchFilter || '';

  // Calculate number of lines for dynamic row count
  const lineCount = useMemo(() => (value ? value.split('\n').length : 1), [value]);
  const rows = useMemo(() => Math.min(Math.max(lineCount + 1, 3), 20), [lineCount]);

  return (
    <div css={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: theme.spacing.xs, flex: 1 }}>
      {rowSize === 'sm' ? (
        <code
          css={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: `${theme.typography.fontSizeSm}px !important`,
            margin: '0 !important',
          }}
        >
          {value}
        </code>
      ) : (
        <div
          css={{
            overflow: 'auto',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            resize: 'vertical',
            width: '100%',
            border: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.xs,
            backgroundColor: theme.colors.backgroundSecondary,
            fontSize: `${theme.typography.fontSizeSm}px`,
            maxHeight: theme.typography.fontSizeLg * (rowSize === 'md' ? 10 : 20),
          }}
        >
          <HighlightedText text={value} searchFilter={searchFilter} theme={theme} />
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

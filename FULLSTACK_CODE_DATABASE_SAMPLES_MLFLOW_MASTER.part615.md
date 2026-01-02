---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 615
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 615 of 991)

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

---[FILE: LoggedModelCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/LoggedModelCell.tsx

```typescript
import { isNil } from 'lodash';

import {
  ModelsIcon,
  ParagraphSkeleton,
  Typography,
  Tooltip,
  Tag,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useQuery } from '@databricks/web-shared/query-client';

import { ErrorCell } from './ErrorCell';
import { NullCell } from './NullCell';
import { StackedComponents } from './StackedComponents';
import type { ModelTraceInfoV3 } from '../../model-trace-explorer';
import { getAjaxUrl, makeRequest } from '../utils/FetchUtils';
import MlflowUtils from '../utils/MlflowUtils';
import { Link } from '../utils/RoutingUtils';

export const LoggedModelCell = (props: {
  experimentId: string;
  currentTraceInfo?: ModelTraceInfoV3;
  otherTraceInfo?: ModelTraceInfoV3;
  isComparing: boolean;
}) => {
  const { experimentId, currentTraceInfo, otherTraceInfo, isComparing } = props;
  const currentModelId = currentTraceInfo?.trace_metadata?.['mlflow.modelId'];
  const otherModelId = otherTraceInfo?.trace_metadata?.['mlflow.modelId'];

  return (
    <StackedComponents
      first={
        currentModelId ? (
          <LoggedModelComponent experimentId={experimentId} modelId={currentModelId} isComparing={isComparing} />
        ) : (
          <NullCell isComparing={isComparing} />
        )
      }
      second={
        isComparing &&
        (otherModelId ? (
          <LoggedModelComponent experimentId={experimentId} modelId={otherModelId} isComparing={isComparing} />
        ) : (
          <NullCell isComparing={isComparing} />
        ))
      }
    />
  );
};

const LoggedModelComponent = (props: { experimentId: string; modelId: string; isComparing: boolean }) => {
  const { experimentId, modelId, isComparing } = props;
  const { theme } = useDesignSystemTheme();

  const { data, isLoading, error } = useLoggedModelName({ loggedModelId: modelId });
  const modelName = data?.info?.name;

  if (isLoading) {
    return <ParagraphSkeleton />;
  }

  if (error) {
    return <ErrorCell />;
  }

  if (!modelName) {
    return <NullCell isComparing={isComparing} />;
  }

  return (
    <Tooltip componentId="mlflow.eval-runs.model-version-cell-tooltip" content={modelName}>
      <Tag
        componentId="mlflow.eval-runs.model-version-cell"
        id="model-version-cell"
        css={{ width: 'fit-content', maxWidth: '100%', marginRight: 0, cursor: 'pointer' }}
      >
        <Link
          to={MlflowUtils.getLoggedModelPageRoute(experimentId, modelId)}
          target="_blank"
          css={{
            maxWidth: '100%',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={modelName}
        >
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              maxWidth: '100%',
            }}
          >
            <ModelsIcon css={{ color: theme.colors.textPrimary, fontSize: 16 }} />
            <Typography.Text css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {modelName}
            </Typography.Text>
          </div>
        </Link>
      </Tag>
    </Tooltip>
  );
};

interface LoggedModelNameResponse {
  model: {
    info: {
      name?: string;
    };
  };
}

/**
 * Retrieve logged model from API based on its ID
 */
const useLoggedModelName = ({ loggedModelId }: { loggedModelId?: string }) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<LoggedModelNameResponse, Error>({
    queryKey: ['loggedModelName', loggedModelId],
    queryFn: async () => {
      const res: LoggedModelNameResponse = await makeRequest(
        getAjaxUrl(`ajax-api/2.0/mlflow/logged-models/${loggedModelId}`),
        'GET',
      );
      return res;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
    retry: 1,
    enabled: !isNil(loggedModelId),
  });

  return {
    isLoading,
    isFetching,
    data: data?.model,
    refetch,
    error,
  } as const;
};
```

--------------------------------------------------------------------------------

---[FILE: NullCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/NullCell.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

export const NullCell = ({ isComparing }: { isComparing?: boolean }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <span
      css={{
        height: '20px',
      }}
    >
      {isComparing && <span css={{ fontStyle: 'italic', color: theme.colors.textSecondary }}>null</span>}
    </span>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: rendererFunctions.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/rendererFunctions.tsx

```typescript
import type { CellContext } from '@tanstack/react-table';
import { first, isNil } from 'lodash';
import type { FormatDateOptions } from 'react-intl';

import type { ThemeType } from '@databricks/design-system';
import { ArrowRightIcon, Tag, Tooltip, Typography, UserIcon } from '@databricks/design-system';
import { type IntlShape } from '@databricks/i18n';
import type { ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';
import { ExpectationValuePreview } from '@databricks/web-shared/model-trace-explorer';

import { LoggedModelCell } from './LoggedModelCell';
import { NullCell } from './NullCell';
import { RunName } from './RunName';
import { SessionIdLinkWrapper } from './SessionIdLinkWrapper';
import { SourceCellRenderer } from './Source/SourceRenderer';
import { StackedComponents } from './StackedComponents';
import { StatusCellRenderer } from './StatusRenderer';
import { TagsCellRenderer } from './Tags/TagsCellRenderer';
import { TokensCell } from './TokensCell';
import { getTraceInfoValueWithColId } from '../GenAiTracesTable.utils';
import { compareAssessmentValues, formatResponseTitle } from '../GenAiTracesTableBody.utils';
import { EvaluationsReviewAssessmentTag } from '../components/EvaluationsReviewAssessmentTag';
import {
  getEvaluationResultAssessmentValue,
  getEvaluationResultInputTitle,
  KnownEvaluationResultAssessmentValueMissingTooltip,
  stringifyValue,
} from '../components/GenAiEvaluationTracesReview.utils';
import { RunColorCircle } from '../components/RunColorCircle';
import {
  CUSTOM_METADATA_COLUMN_ID,
  EXECUTION_DURATION_COLUMN_ID,
  LINKED_PROMPTS_COLUMN_ID,
  LOGGED_MODEL_COLUMN_ID,
  REQUEST_TIME_COLUMN_ID,
  RESPONSE_COLUMN_ID,
  RUN_NAME_COLUMN_ID,
  SESSION_COLUMN_ID,
  SOURCE_COLUMN_ID,
  STATE_COLUMN_ID,
  TAGS_COLUMN_ID,
  TOKENS_COLUMN_ID,
  TRACE_ID_COLUMN_ID,
  TRACE_NAME_COLUMN_ID,
  USER_COLUMN_ID,
} from '../hooks/useTableColumns';
import type { AssessmentInfo, EvalTraceComparisonEntry } from '../types';
import { getUniqueValueCountsBySourceId } from '../utils/AggregationUtils';
import { COMPARE_TO_RUN_COLOR, CURRENT_RUN_COLOR } from '../utils/Colors';
import { timeSinceStr } from '../utils/DisplayUtils';
import { shouldEnableTagGrouping } from '../utils/FeatureUtils';
import {
  getCustomMetadataKeyFromColumnId,
  getTagKeyFromColumnId,
  getTraceInfoOutputs,
  MLFLOW_SOURCE_RUN_KEY,
} from '../utils/TraceUtils';

type timestampType = number | string | Date | null;

/**
 * Formats a timestamp into a date and time string.
 * @param timestamp
 * @param intl
 * @param options
 * @returns {string} formatted date and time string
 * @example
 * formatDateTime(1626825600000, intl);
 * // => 'Jul 21, 2021, 12:00 AM'
 * formatDateTime(1626825600000, intl, { hour: 'numeric', minute: '2-digit' });
 * // => 'Jul 21, 2021, 5:30 AM'
 * formatDateTime(1626825600000, intl, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
 * // => 'Jul 21, 2021, 05:30 AM PDT'
 * formatDateTime(1626825600000, intl, { month: 'long', minute: '2-digit'});
 * // => 'July 21, 2021, 05:30 AM'
 **/
export function formatDateTime(timestamp: timestampType, intl: IntlShape, options?: FormatDateOptions): string {
  if (!timestamp) {
    return '';
  }

  return intl.formatDate(timestamp, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

export const assessmentCellRenderer = (
  theme: ThemeType,
  intl: IntlShape,
  isComparing: boolean,
  assessmentInfo: AssessmentInfo,
  comparisonEntry: EvalTraceComparisonEntry,
) => {
  const assessmentName = assessmentInfo.name;
  const assessment = {
    currentValue: first(comparisonEntry.currentRunValue?.responseAssessmentsByName[assessmentName]),
    otherValue: first(comparisonEntry.otherRunValue?.responseAssessmentsByName[assessmentName]),
  };

  const uniqueValueCounts = getUniqueValueCountsBySourceId(
    assessmentInfo,
    comparisonEntry.currentRunValue?.responseAssessmentsByName[assessmentName] || [],
  );

  const currentIsAssessmentRootCause =
    comparisonEntry.currentRunValue?.overallAssessments[0]?.rootCauseAssessment?.assessmentName === assessmentName;
  const otherIsAssessmentRootCause =
    comparisonEntry.otherRunValue?.overallAssessments[0]?.rootCauseAssessment?.assessmentName === assessmentName;

  const currentValue = assessment.currentValue
    ? getEvaluationResultAssessmentValue(assessment.currentValue)
    : undefined;
  const otherValue = assessment.otherValue ? getEvaluationResultAssessmentValue(assessment.otherValue) : undefined;
  const assessmentComparison = compareAssessmentValues(
    assessmentInfo,
    isNil(currentValue) ? undefined : currentValue,
    isNil(otherValue) ? undefined : otherValue,
  );

  const assessmentChanged = otherValue !== currentValue;

  const missingTooltip = KnownEvaluationResultAssessmentValueMissingTooltip[assessmentName];
  return (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing.sm,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
      }}
    >
      {isComparing ? (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
            borderRadius: theme.legacyBorders.borderRadiusMd,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.sm,
              alignItems: 'center',
            }}
          >
            <EvaluationsReviewAssessmentTag
              key={`tag_${comparisonEntry.currentRunValue?.evaluationId}_${assessment.currentValue?.name}`}
              showRationaleInTooltip
              disableJudgeTypeIcon
              hideAssessmentName
              assessment={assessment.currentValue}
              isRootCauseAssessment={currentIsAssessmentRootCause}
              assessmentInfo={assessmentInfo}
              type="value"
            />
            {assessmentChanged && (
              <ArrowRightIcon
                css={{
                  // Rotate by 45 degrees when the current is passing
                  transform: assessmentComparison === 'greater' ? 'rotate(-45deg)' : 'rotate(45deg)',
                  color: theme.colors.textSecondary,
                }}
              />
            )}
          </div>
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.sm,
              alignItems: 'center',
            }}
          >
            <EvaluationsReviewAssessmentTag
              key={`tag_${comparisonEntry.otherRunValue?.evaluationId}_${assessment.currentValue?.name}`}
              showRationaleInTooltip
              disableJudgeTypeIcon
              hideAssessmentName
              assessment={assessment.otherValue}
              isRootCauseAssessment={otherIsAssessmentRootCause}
              assessmentInfo={assessmentInfo}
              type="value"
            />
            {/* This invisible icon aligns the values. */}
            {assessmentChanged && (
              <ArrowRightIcon
                css={{
                  visibility: 'hidden',
                }}
              />
            )}
          </div>
        </div>
      ) : assessment.currentValue ? (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
          {uniqueValueCounts.map((uniqueValueCount) => {
            const assessment = uniqueValueCount.latestAssessment;
            const count = uniqueValueCount.count;
            return (
              <EvaluationsReviewAssessmentTag
                key={`tag_${uniqueValueCount.latestAssessment.name}_${uniqueValueCount.value}`}
                showRationaleInTooltip
                disableJudgeTypeIcon
                hideAssessmentName
                assessment={assessment}
                isRootCauseAssessment={currentIsAssessmentRootCause}
                assessmentInfo={assessmentInfo}
                type="value"
                count={count}
              />
            );
          })}
        </div>
      ) : (
        <EvaluationsReviewAssessmentTag
          key={`tag_${assessmentName}_${comparisonEntry.currentRunValue?.evaluationId}`}
          showRationaleInTooltip
          disableJudgeTypeIcon
          hideAssessmentName
          isRootCauseAssessment={currentIsAssessmentRootCause}
          assessmentInfo={assessmentInfo}
          assessment={{
            name: assessmentName,
            rationale: missingTooltip
              ? intl.formatMessage(missingTooltip)
              : intl.formatMessage({
                  defaultMessage: 'No assessment for this evaluation',
                  description: 'Text displayed when there is no assessment for a given evaluation',
                }),
            source: {
              sourceId: '',
              sourceType: 'AI_JUDGE',
              metadata: {},
            },
            stringValue: null,
            booleanValue: null,
            rootCauseAssessment: null,
            numericValue: null,
            timestamp: null,
            metadata: {},
          }}
          type="value"
        />
      )}
    </div>
  );
};

export const expectationCellRenderer = (
  theme: ThemeType,
  intl: IntlShape,
  isComparing: boolean,
  expectationName: string,
  comparisonEntry: EvalTraceComparisonEntry,
) => {
  const currentValue = comparisonEntry.currentRunValue?.targets?.[expectationName];
  const otherValue = comparisonEntry.otherRunValue?.targets?.[expectationName];

  const currentValuePreview = currentValue ? (
    <ExpectationValuePreview parsedValue={currentValue} singleLine />
  ) : (
    <NullCell isComparing={isComparing} />
  );
  const otherValuePreview = otherValue ? (
    <ExpectationValuePreview parsedValue={otherValue} singleLine />
  ) : (
    <NullCell isComparing={isComparing} />
  );

  return isComparing ? (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      <div css={{ display: 'flex', flex: 1 }}>{currentValuePreview}</div>
      <div css={{ display: 'flex', flex: 1 }}>{otherValuePreview}</div>
    </div>
  ) : (
    currentValuePreview
  );
};

export const inputColumnCellRenderer = (
  onChangeEvaluationId: (evaluationId: string | undefined) => void,
  row: CellContext<EvalTraceComparisonEntry, unknown>,
  isComparing: boolean,
  theme: ThemeType,
  inputColumn: string,
  getRunColor?: (runUuid: string) => string,
) => {
  const value = row.getValue() as EvalTraceComparisonEntry;
  const evalId = value.currentRunValue?.evaluationId || value.otherRunValue?.evaluationId;

  // fetch colors if possible
  const currentRunUuid = value.currentRunValue?.traceInfo?.trace_metadata?.[MLFLOW_SOURCE_RUN_KEY];
  const otherRunUuid = value.otherRunValue?.traceInfo?.trace_metadata?.[MLFLOW_SOURCE_RUN_KEY];
  const currentRunColor = getRunColor && currentRunUuid ? getRunColor(currentRunUuid) : CURRENT_RUN_COLOR;
  const otherRunColor = getRunColor && otherRunUuid ? getRunColor(otherRunUuid) : COMPARE_TO_RUN_COLOR;

  const currentInputColumnTitle = value.currentRunValue
    ? getEvaluationResultInputTitle(value.currentRunValue, inputColumn)
    : undefined;

  const otherInputColumnTitle = value.otherRunValue
    ? getEvaluationResultInputTitle(value.otherRunValue, inputColumn)
    : undefined;

  const inputColumnTitle = currentInputColumnTitle || otherInputColumnTitle;

  return (
    <div
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
      }}
    >
      <Typography.Link
        css={{
          display: 'block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        componentId="mlflow.evaluations_review.table_ui.evaluation_id_link"
        onClick={() => onChangeEvaluationId(evalId)}
      >
        {inputColumnTitle ? (
          inputColumnTitle
        ) : (
          <span
            css={{
              fontStyle: 'italic',
            }}
          >
            null
          </span>
        )}
      </Typography.Link>
      {isComparing && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          <div
            css={{
              display: 'flex',
            }}
          >
            {currentRunUuid ? <RunColorCircle color={currentRunColor} /> : <div css={{ width: 12, height: 12 }} />}
          </div>
          <div
            css={{
              display: 'flex',
            }}
          >
            {otherRunUuid ? <RunColorCircle color={otherRunColor} /> : <div css={{ width: 12, height: 12 }} />}
          </div>
        </div>
      )}
    </div>
  );
};

export const traceInfoCellRenderer = (
  experimentId: string,
  isComparing: boolean,
  colId: string,
  comparisonEntry: EvalTraceComparisonEntry,
  onChangeEvaluationId: (evalId: string) => void,
  intl: IntlShape,
  theme: ThemeType,
  onTraceTagsEdit?: (trace: ModelTraceInfoV3) => void,
) => {
  const currentTraceInfo = comparisonEntry.currentRunValue?.traceInfo;
  const otherTraceInfo = isComparing ? comparisonEntry.otherRunValue?.traceInfo : undefined;

  if (colId === REQUEST_TIME_COLUMN_ID) {
    const date = currentTraceInfo?.request_time ? new Date(currentTraceInfo.request_time) : undefined;
    const otherDate = otherTraceInfo?.request_time ? new Date(otherTraceInfo.request_time) : undefined;

    return (
      <StackedComponents
        first={
          date ? (
            <Tooltip
              componentId="mlflow.experiment-evaluation-monitoring.trace-info-hover-request-time"
              content={date.toLocaleString(navigator.language, { timeZoneName: 'short' })}
            >
              <span css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {formatDateTime(date, intl, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </span>
            </Tooltip>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherDate ? (
            <Tooltip
              componentId="mlflow.experiment-evaluation-monitoring.trace-info-hover-other-request-time"
              content={otherDate.toLocaleString(navigator.language, { timeZoneName: 'short' })}
            >
              <span css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {timeSinceStr(otherDate)}
              </span>
            </Tooltip>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === STATE_COLUMN_ID) {
    return (
      <StackedComponents
        first={<StatusCellRenderer original={currentTraceInfo} isComparing={isComparing} />}
        second={
          isComparing &&
          (otherTraceInfo ? (
            <StatusCellRenderer original={otherTraceInfo} isComparing={isComparing} />
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === SOURCE_COLUMN_ID) {
    return (
      <StackedComponents
        first={
          currentTraceInfo ? (
            <SourceCellRenderer traceInfo={currentTraceInfo} isComparing={isComparing} />
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherTraceInfo ? (
            <SourceCellRenderer traceInfo={otherTraceInfo} isComparing={isComparing} />
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === TAGS_COLUMN_ID) {
    const tagsArr: { key: string; value: string }[] = Object.entries(currentTraceInfo?.tags || {}).map(
      ([key, value]) => ({
        key,
        value,
      }),
    );

    const otherTagsArr: { key: string; value: string }[] = Object.entries(otherTraceInfo?.tags || {}).map(
      ([key, value]) => ({
        key,
        value,
      }),
    );

    // We only support editing tags in single trace mode
    const onAddEditTags = !otherTraceInfo && currentTraceInfo ? () => onTraceTagsEdit?.(currentTraceInfo) : undefined;

    return (
      <StackedComponents
        first={<TagsCellRenderer baseComponentId="tags-cell-renderer" tags={tagsArr} onAddEditTags={onAddEditTags} />}
        second={
          isComparing &&
          (otherTraceInfo ? (
            <TagsCellRenderer baseComponentId="tags-cell-renderer-other" tags={otherTagsArr} />
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (shouldEnableTagGrouping() && colId.startsWith(TAGS_COLUMN_ID)) {
    const tagKey = getTagKeyFromColumnId(colId);
    if (!tagKey) {
      return <NullCell isComparing={isComparing} />;
    }
    const tagValue = currentTraceInfo?.tags?.[tagKey];
    const otherTagValue = otherTraceInfo?.tags?.[tagKey];
    return (
      <StackedComponents
        first={
          tagValue ? (
            <span
              title={tagValue}
              css={{
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {tagValue}
            </span>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherTagValue ? (
            <span
              title={tagValue}
              css={{
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {otherTagValue}
            </span>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === TRACE_NAME_COLUMN_ID) {
    const evalId = comparisonEntry.currentRunValue?.evaluationId;

    const currentTraceName = currentTraceInfo?.tags?.['mlflow.traceName'];
    const otherTraceName = otherTraceInfo?.tags?.['mlflow.traceName'];

    return (
      <StackedComponents
        first={
          currentTraceName ? (
            !isComparing ? (
              <Typography.Link
                css={{
                  display: 'block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                componentId="mlflow.evaluations_review.table_ui.evaluation_id_link"
                onClick={() => evalId && onChangeEvaluationId(evalId)}
              >
                {currentTraceInfo?.tags?.['mlflow.traceName']}
              </Typography.Link>
            ) : (
              <div>{currentTraceInfo?.tags?.['mlflow.traceName']}</div>
            )
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={isComparing && (otherTraceName ? <div>{otherTraceName}</div> : <NullCell isComparing={isComparing} />)}
      />
    );
  } else if (colId === RUN_NAME_COLUMN_ID) {
    // This column is only shown on experiment level traces which does not support comparison mode

    const runUuid = currentTraceInfo?.trace_metadata?.[MLFLOW_SOURCE_RUN_KEY];

    if (!runUuid) {
      return <NullCell />;
    }

    return <RunName experimentId={experimentId} runUuid={runUuid} />;
  } else if (colId === USER_COLUMN_ID) {
    const value = currentTraceInfo?.trace_metadata?.['mlflow.trace.user'] || currentTraceInfo?.tags?.['mlflow.user'];
    const otherValue = otherTraceInfo?.trace_metadata?.['mlflow.trace.user'] || otherTraceInfo?.tags?.['mlflow.user'];

    return (
      <StackedComponents
        first={
          value ? (
            <span
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
              title={value}
            >
              <UserIcon css={{ color: theme.colors.textSecondary, fontSize: 16 }} />
              <span css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
            </span>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherValue ? (
            <span
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
              title={otherValue}
            >
              <UserIcon css={{ color: theme.colors.textSecondary, fontSize: 16 }} />
              <span css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherValue}</span>
            </span>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === TRACE_ID_COLUMN_ID) {
    const value = currentTraceInfo?.trace_id;
    const otherValue = otherTraceInfo?.trace_id;
    return (
      <StackedComponents
        first={
          value ? (
            <Tag
              css={{ width: 'fit-content', maxWidth: '100%' }}
              componentId="mlflow.genai-traces-table.trace-id"
              color="indigo"
              onClick={() => onChangeEvaluationId(value)}
            >
              <span
                css={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </span>
            </Tag>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherValue ? (
            <Tag
              css={{ width: 'fit-content', maxWidth: '100%' }}
              componentId="mlflow.genai-traces-table.trace-id"
              color="indigo"
              title={otherValue}
              onClick={() => onChangeEvaluationId(otherValue)}
            >
              <span
                css={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {otherValue}
              </span>
            </Tag>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === SESSION_COLUMN_ID) {
    const value = currentTraceInfo?.trace_metadata?.['mlflow.trace.session'];
    const otherValue = otherTraceInfo?.trace_metadata?.['mlflow.trace.session'];
    const currentTraceId = currentTraceInfo?.trace_id;
    const otherTraceId = otherTraceInfo?.trace_id;
    return (
      <StackedComponents
        first={
          value ? (
            <SessionIdLinkWrapper sessionId={value} experimentId={experimentId} traceId={currentTraceId}>
              <Tag
                css={{ width: 'fit-content', maxWidth: '100%' }}
                componentId="mlflow.genai-traces-table.session"
                title={value}
              >
                <span
                  css={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}
                </span>
              </Tag>
            </SessionIdLinkWrapper>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherValue ? (
            <SessionIdLinkWrapper sessionId={otherValue} experimentId={experimentId} traceId={otherTraceId}>
              <Tag
                css={{ width: 'fit-content', maxWidth: '100%' }}
                componentId="mlflow.genai-traces-table.session"
                title={otherValue}
              >
                <span
                  css={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {otherValue}
                </span>
              </Tag>
            </SessionIdLinkWrapper>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === RESPONSE_COLUMN_ID) {
    const value = currentTraceInfo ? formatResponseTitle(getTraceInfoOutputs(currentTraceInfo)) : '';
    const otherValue = otherTraceInfo ? formatResponseTitle(getTraceInfoOutputs(otherTraceInfo)) : '';
    return (
      <StackedComponents
        first={
          value ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={value}>
              {value}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherValue ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={otherValue}>
              {otherValue}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === LOGGED_MODEL_COLUMN_ID) {
    return (
      <LoggedModelCell
        experimentId={experimentId}
        currentTraceInfo={currentTraceInfo}
        otherTraceInfo={otherTraceInfo}
        isComparing={isComparing}
      />
    );
  } else if (colId === TOKENS_COLUMN_ID) {
    return <TokensCell currentTraceInfo={currentTraceInfo} otherTraceInfo={otherTraceInfo} isComparing={isComparing} />;
  } else if (colId.startsWith(CUSTOM_METADATA_COLUMN_ID)) {
    const metadataKey = getCustomMetadataKeyFromColumnId(colId);
    if (!metadataKey) {
      return <NullCell isComparing={isComparing} />;
    }
    const value = currentTraceInfo?.trace_metadata?.[metadataKey];
    const otherValue = otherTraceInfo?.trace_metadata?.[metadataKey];
    return (
      <StackedComponents
        first={
          value ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={value}>
              {value}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (otherValue ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={otherValue}>
              {otherValue}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === EXECUTION_DURATION_COLUMN_ID) {
    // Parse and reformat time values from the backend. Keep up to 3 decimal places for float values,
    // trim trailing zeros and the dot if there are no decimal places
    const normalizeFloatValue = (val?: string) => {
      if (val === undefined) {
        return undefined;
      }
      const floatVal = parseFloat(val);
      const unit = val
        ?.replace?.(/[0-9.]/g, '')
        .trim()
        .toLowerCase();
      if (isNil(floatVal) || isNaN(floatVal)) {
        return undefined;
      }
      return [floatVal.toFixed(3).replace(/\.?0+$/, ''), unit].filter(Boolean).join('');
    };

    const value = normalizeFloatValue(currentTraceInfo?.[EXECUTION_DURATION_COLUMN_ID]);
    const otherValue = normalizeFloatValue(otherTraceInfo?.[EXECUTION_DURATION_COLUMN_ID]);

    return (
      <StackedComponents
        first={
          !isNil(value) ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={value}>
              {value}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (!isNil(otherValue) ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={otherValue}>
              {otherValue}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  } else if (colId === LINKED_PROMPTS_COLUMN_ID) {
    const formatPrompts = (promptsJson: string | undefined) => {
      if (!promptsJson) return null;
      try {
        const prompts = JSON.parse(promptsJson);
        if (Array.isArray(prompts) && prompts.length > 0) {
          return prompts
            .map((prompt: { name: string; version: string }) => `${prompt.name}/${prompt.version}`)
            .join(', ');
        }
      } catch (e) {
        // Invalid JSON, return as-is
        return promptsJson;
      }
      return null;
    };

    const currentPrompts = currentTraceInfo?.tags?.['mlflow.linkedPrompts'];
    const otherPrompts = otherTraceInfo?.tags?.['mlflow.linkedPrompts'];
    const formattedCurrent = formatPrompts(currentPrompts);
    const formattedOther = formatPrompts(otherPrompts);

    return (
      <StackedComponents
        first={
          formattedCurrent ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={formattedCurrent}>
              {formattedCurrent}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          )
        }
        second={
          isComparing &&
          (formattedOther ? (
            <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={formattedOther}>
              {formattedOther}
            </div>
          ) : (
            <NullCell isComparing={isComparing} />
          ))
        }
      />
    );
  }

  const value = currentTraceInfo ? stringifyValue(getTraceInfoValueWithColId(currentTraceInfo, colId)) : '';
  const otherValue = otherTraceInfo ? stringifyValue(getTraceInfoValueWithColId(otherTraceInfo, colId)) : '';

  return (
    <StackedComponents
      first={
        value ? (
          <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={value}>
            {value}
          </div>
        ) : (
          <NullCell isComparing={isComparing} />
        )
      }
      second={
        isComparing &&
        (otherValue ? (
          <div css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={otherValue}>
            {otherValue}
          </div>
        ) : (
          <NullCell isComparing={isComparing} />
        ))
      }
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: RunName.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/RunName.tsx

```typescript
import { ParagraphSkeleton } from '@databricks/design-system';
import type { NetworkRequestError } from '@databricks/web-shared/errors';
import { useQuery } from '@databricks/web-shared/query-client';

import { ErrorCell } from './ErrorCell';
import { NullCell } from './NullCell';
import { getAjaxUrl, makeRequest } from '../utils/FetchUtils';
import MlflowUtils from '../utils/MlflowUtils';
import { Link } from '../utils/RoutingUtils';

export const RunName = (props: { experimentId: string; runUuid: string }) => {
  const { experimentId, runUuid } = props;

  const { data, isLoading, error } = useRunName(experimentId, runUuid);

  const runName = data?.runs?.[0]?.info?.run_name;

  if (isLoading) {
    return <ParagraphSkeleton />;
  }

  if (error) {
    return <ErrorCell />;
  }

  if (!runName) {
    return <NullCell />;
  }

  return (
    <Link
      css={{
        display: 'flex',
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
      to={MlflowUtils.getRunPageRoute(experimentId, runUuid)}
      title={runName}
    >
      {runName}
    </Link>
  );
};

interface RunNameResponse {
  runs: {
    data: {
      tags: { [key: string]: string };
    };
    info: {
      run_name: string;
    };
  }[];
}
const useRunName = (experimentId: string, runUuid: string) => {
  return useQuery<RunNameResponse, NetworkRequestError>({
    queryKey: ['runName', experimentId, runUuid],
    cacheTime: Infinity,
    staleTime: Infinity,
    retry: 1, // limit retries so we don't spam the api
    refetchOnMount: false,
    queryFn: async () => {
      const filter = `run_id IN ('${runUuid}')`;
      const url = getAjaxUrl('ajax-api/2.0/mlflow/runs/search');

      const res: RunNameResponse = await makeRequest(url, 'POST', {
        experiment_ids: [experimentId],
        filter,
      });

      return res;
    },
  });
};
```

--------------------------------------------------------------------------------

````

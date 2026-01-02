---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 616
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 616 of 991)

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

---[FILE: SessionIdLinkWrapper.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/SessionIdLinkWrapper.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { TestRouter, testRoute } from '../utils/RoutingTestUtils';
import { SessionIdLinkWrapper } from './SessionIdLinkWrapper';

describe('SessionIdLinkWrapper', () => {
  const renderComponent = (props: { sessionId: string; experimentId: string; traceId?: string }) => {
    return render(
      <IntlProvider locale="en">
        <TestRouter
          routes={[
            testRoute(
              <SessionIdLinkWrapper {...props}>
                <span>Test Content</span>
              </SessionIdLinkWrapper>,
            ),
          ]}
        />
      </IntlProvider>,
    );
  };

  test('should render a link to the session page without traceId when traceId is not provided', () => {
    renderComponent({
      sessionId: 'test-session-123',
      experimentId: 'exp-456',
    });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/experiments/exp-456/chat-sessions/test-session-123');
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('should render a link to the session page with selectedTraceId query parameter when traceId is provided', () => {
    renderComponent({
      sessionId: 'test-session-123',
      experimentId: 'exp-456',
      traceId: 'trace-789',
    });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/experiments/exp-456/chat-sessions/test-session-123?selectedTraceId=trace-789',
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('should encode special characters in traceId', () => {
    renderComponent({
      sessionId: 'test-session-123',
      experimentId: 'exp-456',
      traceId: 'trace/with/special?chars',
    });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/experiments/exp-456/chat-sessions/test-session-123?selectedTraceId=trace%2Fwith%2Fspecial%3Fchars',
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SessionIdLinkWrapper.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/SessionIdLinkWrapper.tsx

```typescript
import { SELECTED_TRACE_ID_QUERY_PARAM } from '../../../../experiment-tracking/constants';
import MlflowUtils from '../utils/MlflowUtils';
import { Link } from '../utils/RoutingUtils';

export const SessionIdLinkWrapper = ({
  sessionId,
  experimentId,
  traceId,
  children,
}: {
  sessionId: string;
  experimentId: string;
  traceId?: string;
  children: React.ReactElement;
}) => {
  const baseUrl = MlflowUtils.getExperimentChatSessionPageRoute(experimentId, sessionId);
  const url = traceId
    ? `${baseUrl}?${new URLSearchParams({ [SELECTED_TRACE_ID_QUERY_PARAM]: traceId }).toString()}`
    : baseUrl;

  return (
    <Link
      // prettier-ignore
      to={url}
    >
      {children}
    </Link>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: StackedComponents.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/StackedComponents.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

export interface StackedComponentsProps {
  first: React.ReactNode;
  second?: React.ReactNode;
  // Allow overriding the default styles if needed:
  gap?: string;
  borderRadius?: string;
  marginY?: string;
}

export const StackedComponents = (props: StackedComponentsProps) => {
  const { first, second, gap, borderRadius, marginY } = props;
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: gap || theme.spacing.sm,
        borderRadius: borderRadius || theme.legacyBorders.borderRadiusMd,
        marginTop: marginY || 'auto',
        marginBottom: marginY || 'auto',
      }}
    >
      {first}
      {second}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: StatusRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/StatusRenderer.tsx

```typescript
import type { Theme } from '@emotion/react';

import { CheckCircleIcon, ClockIcon, useDesignSystemTheme, XCircleIcon } from '@databricks/design-system';
import { useIntl, defineMessage } from '@databricks/i18n';

import { NullCell } from './NullCell';
import type { ModelTraceInfoV3 } from '../../model-trace-explorer';

export const ExperimentViewTracesStatusLabels = {
  STATE_UNSPECIFIED: null,
  IN_PROGRESS: defineMessage({
    defaultMessage: 'In progress',
    description: 'Experiment page > traces table > status label > in progress',
  }),
  OK: defineMessage({
    defaultMessage: 'OK',
    description: 'Experiment page > traces table > status label > ok',
  }),
  ERROR: defineMessage({
    defaultMessage: 'Error',
    description: 'Experiment page > traces table > status label > error',
  }),
};

const getIcon = (state: ModelTraceInfoV3['state'], theme: Theme) => {
  if (state === 'IN_PROGRESS') {
    return <ClockIcon css={{ color: theme.colors.textValidationWarning }} />;
  }

  if (state === 'OK') {
    return <CheckCircleIcon css={{ color: theme.colors.textValidationSuccess }} />;
  }

  if (state === 'ERROR') {
    return <XCircleIcon css={{ color: theme.colors.textValidationDanger }} />;
  }

  return null;
};

export const StatusCellRenderer = ({
  original,
  isComparing,
}: {
  original: ModelTraceInfoV3 | undefined;
  isComparing: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const labelDescriptor = ExperimentViewTracesStatusLabels[original?.state || 'STATE_UNSPECIFIED'];

  return labelDescriptor ? (
    <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
      {getIcon(original?.state || 'STATE_UNSPECIFIED', theme)}
      {labelDescriptor ? intl.formatMessage(labelDescriptor) : ''}
    </div>
  ) : (
    <NullCell isComparing={isComparing} />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TokensCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/TokensCell.tsx

```typescript
import { HoverCard, Tag, Typography } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';
import { TOKEN_USAGE_METADATA_KEY, type ModelTraceInfoV3 } from '@databricks/web-shared/model-trace-explorer';

import { NullCell } from './NullCell';
import { StackedComponents } from './StackedComponents';

export const TokensCell = (props: {
  currentTraceInfo?: ModelTraceInfoV3;
  otherTraceInfo?: ModelTraceInfoV3;
  isComparing: boolean;
}) => {
  const { currentTraceInfo, otherTraceInfo, isComparing } = props;

  return (
    <StackedComponents
      first={<TokenComponent traceInfo={currentTraceInfo} isComparing={isComparing} />}
      second={isComparing && <TokenComponent traceInfo={otherTraceInfo} isComparing={isComparing} />}
    />
  );
};

const TokenComponent = (props: { traceInfo?: ModelTraceInfoV3; isComparing: boolean }) => {
  const { traceInfo, isComparing } = props;

  const tokenUsage = traceInfo?.trace_metadata?.[TOKEN_USAGE_METADATA_KEY];
  const parsedTokenUsage = (() => {
    try {
      return tokenUsage ? JSON.parse(tokenUsage) : {};
    } catch {
      return {};
    }
  })();
  const totalTokens = parsedTokenUsage.total_tokens;
  const inputTokens = parsedTokenUsage.input_tokens;
  const outputTokens = parsedTokenUsage.output_tokens;

  const intl = useIntl();

  if (!totalTokens) {
    return <NullCell isComparing={isComparing} />;
  }

  return (
    <HoverCard
      trigger={
        <Tag css={{ width: 'fit-content', maxWidth: '100%' }} componentId="mlflow.genai-traces-table.tokens">
          <span
            css={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {totalTokens}
          </span>
        </Tag>
      }
      content={
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {totalTokens && (
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                css={{
                  width: '35%',
                }}
              >
                <Typography.Text>
                  {intl.formatMessage({
                    defaultMessage: 'Total',
                    description: 'Label for the total tokensin the tooltip for the tokens cell.',
                  })}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text color="secondary">{totalTokens}</Typography.Text>
              </div>
            </div>
          )}
          {inputTokens && (
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                css={{
                  width: '35%',
                }}
              >
                <Typography.Text>
                  {intl.formatMessage({
                    defaultMessage: 'Input',
                    description: 'Label for the input tokens in the tooltip for the tokens cell.',
                  })}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text color="secondary">{inputTokens}</Typography.Text>
              </div>
            </div>
          )}
          {outputTokens && (
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                css={{
                  width: '35%',
                }}
              >
                <Typography.Text>
                  {intl.formatMessage({
                    defaultMessage: 'Output',
                    description: 'Label for the output tokens in the tooltip for the tokens cell.',
                  })}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text color="secondary">{outputTokens}</Typography.Text>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExperimentSourceTypeIcon.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/Source/ExperimentSourceTypeIcon.tsx

```typescript
import { FolderBranchIcon, HomeIcon, NotebookIcon, WorkflowsIcon } from '@databricks/design-system';

enum SourceType {
  NOTEBOOK = 'NOTEBOOK',
  JOB = 'JOB',
  PROJECT = 'PROJECT',
  LOCAL = 'LOCAL',
  UNKNOWN = 'UNKNOWN',
}

export const ExperimentSourceTypeIcon = ({
  sourceType,
  className,
}: {
  sourceType: SourceType | string;
  className?: string;
}) => {
  if (sourceType === SourceType.NOTEBOOK) {
    return <NotebookIcon className={className} />;
  } else if (sourceType === SourceType.LOCAL) {
    return <HomeIcon className={className} />;
  } else if (sourceType === SourceType.PROJECT) {
    return <FolderBranchIcon className={className} />;
  } else if (sourceType === SourceType.JOB) {
    return <WorkflowsIcon className={className} />;
  }
  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: SourceRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/Source/SourceRenderer.tsx

```typescript
import { useDesignSystemTheme } from '@databricks/design-system';

import { ExperimentSourceTypeIcon } from './ExperimentSourceTypeIcon';
import type { ModelTraceInfoV3 } from '../../../model-trace-explorer';
import MlflowUtils from '../../utils/MlflowUtils';
import { NullCell } from '../NullCell';

export const SourceCellRenderer = (props: {
  traceInfo: ModelTraceInfoV3;
  isComparing: boolean;
  disableLinks?: boolean;
}) => {
  const tags = props.traceInfo.tags;
  const { theme } = useDesignSystemTheme();

  if (!tags) {
    return <NullCell isComparing={props.isComparing} />;
  }

  const sourceType = props.traceInfo.trace_metadata?.[MlflowUtils.sourceTypeTag];

  const sourceLink = MlflowUtils.renderSourceFromMetadata(props.traceInfo);

  return sourceLink && sourceType ? (
    <div
      css={{
        display: 'flex',
        gap: theme.spacing.xs,
        alignItems: 'center',
        // Disable links if the disableLinks prop is true
        ...(props.disableLinks && {
          '& a': {
            pointerEvents: 'none',
            color: 'inherit',
            textDecoration: 'none',
            cursor: 'default',
          },
        }),
      }}
    >
      <ExperimentSourceTypeIcon sourceType={sourceType} css={{ color: theme.colors.textSecondary }} />
      <span css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sourceLink}</span>
    </div>
  ) : (
    <NullCell isComparing={props.isComparing} />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/Tags/KeyValueTag.tsx
Signals: React

```typescript
import type { Interpolation, Theme } from '@emotion/react';
import React, { useState } from 'react';

import { Tag, Tooltip, Typography } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { KeyValueTagFullViewModal } from './KeyValueTagFullViewModal';

/**
 * An arbitrary number that is used to determine if a tag is too
 * long and should be truncated. We want to avoid short keys or values
 * in a long tag to be truncated
 * */
const TRUNCATE_ON_CHARS_LENGTH = 30;

function getTruncatedStyles(shouldTruncate = true): Interpolation<Theme> {
  return shouldTruncate
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textWrap: 'nowrap',
        whiteSpace: 'nowrap' as const,
      }
    : { whiteSpace: 'nowrap' as const };
}

interface KeyValueEntity {
  key: string;
  value: string;
}

/**
 * A <Tag /> wrapper used for displaying key-value entity
 */
export const KeyValueTag = ({
  isClosable = false,
  onClose,
  tag,
  enableFullViewModal = false,
  charLimit = TRUNCATE_ON_CHARS_LENGTH,
  maxWidth = 300,
  className,
}: {
  isClosable?: boolean;
  onClose?: () => void;
  tag: KeyValueEntity;
  enableFullViewModal?: boolean;
  charLimit?: number;
  maxWidth?: number;
  className?: string;
}) => {
  const intl = useIntl();

  const [isKeyValueTagFullViewModalVisible, setIsKeyValueTagFullViewModalVisible] = useState(false);

  const { shouldTruncateKey, shouldTruncateValue } = getKeyAndValueComplexTruncation(tag, charLimit);
  const allowFullViewModal = enableFullViewModal && (shouldTruncateKey || shouldTruncateValue);

  const fullViewModalLabel = intl.formatMessage({
    defaultMessage: 'Click to see more',
    description: 'Run page > Overview > Tags cell > Tag',
  });

  return (
    <div>
      <Tag
        componentId="codegen_mlflow_app_src_common_components_keyvaluetag.tsx_60"
        closable={isClosable}
        onClose={onClose}
        title={tag.key}
        className={className}
      >
        <Tooltip
          componentId="web-shared.genai-traces-table.key-value-tag.full-view-tooltip"
          content={allowFullViewModal ? <span>{fullViewModalLabel}</span> : undefined}
        >
          <span
            css={{ maxWidth, display: 'inline-flex' }}
            onClick={() => (allowFullViewModal ? setIsKeyValueTagFullViewModalVisible(true) : undefined)}
          >
            <Typography.Text bold title={tag.key} css={getTruncatedStyles(shouldTruncateKey)}>
              {tag.key}
            </Typography.Text>
            {tag.value && (
              <Typography.Text title={tag.value} css={getTruncatedStyles(shouldTruncateValue)}>
                : {tag.value}
              </Typography.Text>
            )}
          </span>
        </Tooltip>
      </Tag>
      <div>
        {isKeyValueTagFullViewModalVisible && (
          <KeyValueTagFullViewModal
            tagKey={tag.key}
            tagValue={tag.value}
            isKeyValueTagFullViewModalVisible={isKeyValueTagFullViewModalVisible}
            setIsKeyValueTagFullViewModalVisible={setIsKeyValueTagFullViewModalVisible}
          />
        )}
      </div>
    </div>
  );
};

export function getKeyAndValueComplexTruncation(
  tag: KeyValueEntity,
  charLimit = TRUNCATE_ON_CHARS_LENGTH,
): { shouldTruncateKey: boolean; shouldTruncateValue: boolean } {
  const { key, value } = tag;
  const fullLength = key.length + value.length;
  const isKeyLonger = key.length > value.length;
  const shorterLength = isKeyLonger ? value.length : key.length;

  // No need to truncate if tag is short enough
  if (fullLength <= charLimit) return { shouldTruncateKey: false, shouldTruncateValue: false };
  // If the shorter string is too long, truncate both key and value.
  if (shorterLength > charLimit / 2) return { shouldTruncateKey: true, shouldTruncateValue: true };

  // Otherwise truncate the longer string
  return {
    shouldTruncateKey: isKeyLonger,
    shouldTruncateValue: !isKeyLonger,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTagFullViewModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/Tags/KeyValueTagFullViewModal.tsx
Signals: React

```typescript
import React from 'react';

import { Modal, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CopyActionButton } from '@databricks/web-shared/copy';
const { Paragraph } = Typography;

export interface KeyValueTagFullViewModalProps {
  tagKey: string;
  tagValue: string;
  setIsKeyValueTagFullViewModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isKeyValueTagFullViewModalVisible: boolean;
}

export const KeyValueTagFullViewModal = React.memo((props: KeyValueTagFullViewModalProps) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Modal
      componentId="codegen_mlflow_app_src_common_components_keyvaluetagfullviewmodal.tsx_17"
      title={'Tag: ' + props.tagKey}
      visible={props.isKeyValueTagFullViewModalVisible}
      onCancel={() => props.setIsKeyValueTagFullViewModalVisible(false)}
    >
      <div css={{ display: 'flex', alignItems: 'center' }}>
        <Paragraph css={{ flexGrow: 1 }}>
          <pre
            css={{
              backgroundColor: theme.colors.backgroundPrimary,
              marginTop: theme.spacing.sm,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {props.tagValue}
          </pre>
        </Paragraph>
        <div
          css={{
            marginBottom: theme.spacing.md,
          }}
        >
          <CopyActionButton
            componentId="mlflow.genai-traces-table.tag_view_modal.tag_value_copy_button"
            copyText={props.tagValue}
          />
        </div>
      </div>
    </Modal>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: TagsCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/cellRenderers/Tags/TagsCellRenderer.tsx

```typescript
import { Button, PencilIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { KeyValueTag } from './KeyValueTag';
import { MLFLOW_INTERNAL_PREFIX } from '../../utils/TraceUtils';

export const TagsCellRenderer = ({
  onAddEditTags,
  tags,
  baseComponentId,
}: {
  tags: { key: string; value: string }[];
  onAddEditTags?: () => void;
  baseComponentId: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const visibleTagList = tags?.filter(({ key }) => key && !key.startsWith(MLFLOW_INTERNAL_PREFIX)) || [];
  const containsTags = visibleTagList.length > 0;
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: theme.spacing.xs,
        rowGap: theme.spacing.xs,
      }}
    >
      {visibleTagList.map((tag) => (
        <KeyValueTag
          key={tag.key}
          tag={tag}
          css={{ marginRight: 0 }}
          charLimit={20}
          maxWidth={150}
          enableFullViewModal
        />
      ))}
      {onAddEditTags && (
        <Button
          componentId="mlflow.tags_cell_renderer.traces_table.edit_tag"
          size="small"
          icon={!containsTags ? undefined : <PencilIcon />}
          onClick={onAddEditTags}
          children={
            !containsTags ? (
              <FormattedMessage
                defaultMessage="Add tags"
                description="Button text to add tags to a trace in the experiment traces table"
              />
            ) : undefined
          }
          css={{
            flexShrink: 0,
            opacity: 0,
            '[role=row]:hover &': {
              opacity: 1,
            },
            '[role=row]:focus-within &': {
              opacity: 1,
            },
          }}
          type="tertiary"
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsAssessmentHoverCard.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsAssessmentHoverCard.tsx

```typescript
import {
  BinaryIcon,
  BracketsXIcon,
  NumbersIcon,
  SparkleDoubleIcon,
  Tag,
  Typography,
  useDesignSystemTheme,
  UserIcon,
} from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import { EvaluationsRcaStats } from './EvaluationsRcaStats';
import { KnownEvaluationResultAssessmentName } from '../enum';
import type { AssessmentAggregates, AssessmentFilter, AssessmentInfo, AssessmentValueType } from '../types';

export const EvaluationsAssessmentHoverCard = ({
  assessmentInfo,
  assessmentNameToAggregates,
  allAssessmentFilters,
  toggleAssessmentFilter,
  runUuid,
  compareToRunUuid,
}: {
  assessmentInfo: AssessmentInfo;
  assessmentNameToAggregates: Record<string, AssessmentAggregates>;
  allAssessmentFilters: AssessmentFilter[];
  toggleAssessmentFilter: (
    assessmentName: string,
    filterValue: AssessmentValueType,
    run: string,
    filterType?: AssessmentFilter['filterType'],
  ) => void;
  runUuid?: string;
  compareToRunUuid?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  return (
    <>
      <div
        css={{
          maxWidth: '25rem',
          display: 'flex',
          flexDirection: 'column',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          gap: theme.spacing.sm,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xs,
              paddingBottom: theme.spacing.sm,
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              css={{
                display: 'flex',
                gap: theme.spacing.xs,
                alignItems: 'center',
              }}
            >
              {/* Dtype icon  */}
              {assessmentInfo.dtype === 'numeric' ? (
                <NumbersIcon />
              ) : assessmentInfo.dtype === 'boolean' ? (
                <BinaryIcon />
              ) : (
                <></>
              )}

              <Typography.Title
                level={4}
                css={{
                  marginBottom: 0,
                  marginRight: theme.spacing.xs,
                }}
              >
                {assessmentInfo.displayName}
              </Typography.Title>
              {assessmentInfo.source?.sourceType === 'AI_JUDGE' && (
                <Tag color="turquoise" componentId="mlflow.experiment.evaluations.ai-judge-tag">
                  <div
                    css={{
                      display: 'flex',
                      gap: theme.spacing.xs,
                    }}
                  >
                    <SparkleDoubleIcon
                      css={{
                        color: theme.colors.textSecondary,
                      }}
                    />
                    <Typography.Hint>
                      {intl.formatMessage({
                        defaultMessage: 'AI Judge',
                        description: 'Label for AI judge in the tooltip for the assessment in the evaluation metrics.',
                      })}
                    </Typography.Hint>
                  </div>
                </Tag>
              )}
              {assessmentInfo.source?.sourceType === 'HUMAN' && (
                <Tag color="coral" componentId="mlflow.experiment.evaluations.human-judge-tag">
                  <div
                    css={{
                      display: 'flex',
                      gap: theme.spacing.xs,
                    }}
                  >
                    <UserIcon />
                    <Typography.Hint>
                      {intl.formatMessage({
                        defaultMessage: 'Human judge',
                        description:
                          'Label for human judge in the tooltip for the assessment in the evaluation metrics.',
                      })}
                    </Typography.Hint>
                  </div>
                </Tag>
              )}
              {assessmentInfo.isCustomMetric && (
                <Tag color="indigo" componentId="mlflow.experiment.evaluations.ai-judge-tag">
                  <div
                    css={{
                      display: 'flex',
                      gap: theme.spacing.xs,
                    }}
                  >
                    <Typography.Hint>
                      <BracketsXIcon />
                    </Typography.Hint>

                    <Typography.Hint>{assessmentInfo.metricName}</Typography.Hint>
                  </div>
                </Tag>
              )}
            </div>
            <div>
              <Typography.Hint>{assessmentInfo.name}</Typography.Hint>
            </div>
          </div>
        </div>
        <div>
          <span
            css={{
              display: 'contents',
              '& p': {
                marginBottom: 0,
              },
            }}
          >
            {assessmentInfo.description}
          </span>
        </div>
        {assessmentInfo.name === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT && runUuid ? (
          <div>
            <EvaluationsRcaStats
              overallAssessmentInfo={assessmentInfo}
              assessmentNameToAggregates={assessmentNameToAggregates}
              allAssessmentFilters={allAssessmentFilters}
              toggleAssessmentFilter={toggleAssessmentFilter}
              runUuid={runUuid}
              compareToRunUuid={compareToRunUuid}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsOverviewColumnSelector.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsOverviewColumnSelector.tsx

```typescript
import {
  ChevronDownIcon,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxCustomButtonTriggerWrapper,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  Button,
  ColumnsIcon,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import type { TracesTableColumn } from '../types';

/**
 * Component for column selector in MLflow monitoring traces view. Allows user to control which assessments show up in table to prevent too much clutter.
 */
export const EvaluationsOverviewColumnSelector = ({
  columns,
  selectedColumns,
  setSelectedColumns,
  setSelectedColumnsWithHiddenColumns,
}: {
  columns: TracesTableColumn[];
  selectedColumns: TracesTableColumn[];
  // @deprecated use setSelectedColumnsWithHiddenColumns instead
  setSelectedColumns?: React.Dispatch<React.SetStateAction<TracesTableColumn[]>>;
  setSelectedColumnsWithHiddenColumns?: (newColumns: TracesTableColumn[]) => void;
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const handleChange = (newColumn: TracesTableColumn) => {
    if (setSelectedColumnsWithHiddenColumns) {
      return setSelectedColumnsWithHiddenColumns([newColumn]);
    } else if (setSelectedColumns) {
      setSelectedColumns((current: TracesTableColumn[]) => {
        const newSelectedColumns = current.some((col) => col.id === newColumn.id)
          ? current.filter((col) => col.id !== newColumn.id)
          : [...current, newColumn];
        return newSelectedColumns;
      });
    }
  };

  return (
    <DialogCombobox componentId="mlflow.evaluations_overview.column_selector_dropdown" label="Columns" multiSelect>
      <DialogComboboxCustomButtonTriggerWrapper>
        <Button endIcon={<ChevronDownIcon />} componentId="mlflow.evaluations_review.table_ui.filter_button">
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.sm,
              alignItems: 'center',
            }}
          >
            <ColumnsIcon />
            {intl.formatMessage({
              defaultMessage: 'Columns',
              description: 'Evaluation review > evaluations list > filter dropdown button',
            })}
          </div>
        </Button>
      </DialogComboboxCustomButtonTriggerWrapper>
      <DialogComboboxContent>
        <DialogComboboxOptionList>
          {columns.map((column) => (
            <DialogComboboxOptionListCheckboxItem
              key={column.id}
              value={column.label}
              checked={selectedColumns.some((col) => col.id === column.id)}
              onChange={() => handleChange(column)}
            />
          ))}
        </DialogComboboxOptionList>
      </DialogComboboxContent>
    </DialogCombobox>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsOverviewColumnSelectorGrouped.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsOverviewColumnSelectorGrouped.tsx
Signals: React

```typescript
import React, { useMemo, useState } from 'react';

import {
  ChevronDownIcon,
  DialogCombobox,
  DialogComboboxContent,
  DialogComboboxCustomButtonTriggerWrapper,
  DialogComboboxOptionList,
  DialogComboboxOptionListCheckboxItem,
  DialogComboboxSectionHeader,
  Button,
  ColumnsIcon,
  useDesignSystemTheme,
  DialogComboboxOptionListSearch,
  DangerIcon,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { sortGroupedColumns } from '../GenAiTracesTable.utils';
import { TracesTableColumnGroup, TracesTableColumnGroupToLabelMap, type TracesTableColumn } from '../types';

interface Props {
  columns: TracesTableColumn[];
  selectedColumns: TracesTableColumn[];
  toggleColumns: (cols: TracesTableColumn[]) => void;
  setSelectedColumns: (cols: TracesTableColumn[]) => void;
  isMetadataLoading?: boolean;
  metadataError?: Error | null;
}

const OPTION_HEIGHT = 32;

const getGroupLabel = (group: string): string => {
  return group === TracesTableColumnGroup.INFO
    ? 'Attributes'
    : TracesTableColumnGroupToLabelMap[group as TracesTableColumnGroup];
};

/**
 * Column selector with section headers for each column‐group.
 */
export const EvaluationsOverviewColumnSelectorGrouped: React.FC<React.PropsWithChildren<Props>> = ({
  columns = [],
  selectedColumns = [],
  toggleColumns,
  setSelectedColumns,
  isMetadataLoading = false,
  metadataError,
}) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();

  const [search, setSearch] = useState('');

  const sortedGroupedColumns = useMemo(() => {
    const sortedColumns = sortGroupedColumns(columns);
    const map: Record<string, TracesTableColumn[]> = {};
    sortedColumns.forEach((col) => {
      const group = col.group ?? TracesTableColumnGroup.INFO;
      if (!map[group]) map[group] = [];
      map[group].push(col);
    });

    return map;
  }, [columns]);

  const filteredGroupedColumns = useMemo(() => {
    if (!search.trim()) return sortedGroupedColumns;

    const needle = search.trim().toLowerCase();
    const out: Record<string, TracesTableColumn[]> = {};

    Object.entries(sortedGroupedColumns).forEach(([group, cols]) => {
      // Check if group name matches
      const groupLabel = getGroupLabel(group);
      const groupMatches = groupLabel.toLowerCase().includes(needle);

      // Check if any columns in the group match
      const hits = cols.filter((c) => c.label.toLowerCase().includes(needle));

      // Include the group if either the group name or any columns match
      if (groupMatches || hits.length) {
        out[group] = groupMatches ? cols : hits;
      }
    });

    return out;
  }, [sortedGroupedColumns, search]);

  const handleToggle = (column: TracesTableColumn) => {
    return toggleColumns([column]);
  };

  const handleSelectAllInGroup = (groupColumns: TracesTableColumn[]) => {
    const allSelected = groupColumns.every((col) => selectedColumns.some((c) => c.id === col.id));
    if (allSelected) {
      // If all are selected, deselect all in this group
      const newSelection = selectedColumns.filter((col) => !groupColumns.some((gc) => gc.id === col.id));
      setSelectedColumns(newSelection);
    } else {
      // If not all are selected, select all in this group
      const newSelection = [...selectedColumns];
      groupColumns.forEach((col) => {
        if (!newSelection.some((c) => c.id === col.id)) {
          newSelection.push(col);
        }
      });
      setSelectedColumns(newSelection);
    }
  };

  return (
    <DialogCombobox
      componentId="mlflow.evaluations_overview_grouped.column_selector_dropdown"
      label="Columns"
      multiSelect
    >
      <DialogComboboxCustomButtonTriggerWrapper>
        <Button
          endIcon={<ChevronDownIcon />}
          data-testid="column-selector-button"
          componentId="mlflow.evaluations_review.table_ui.filter_button"
        >
          <div
            css={{
              display: 'flex',
              gap: theme.spacing.sm,
              alignItems: 'center',
            }}
          >
            <ColumnsIcon />
            {intl.formatMessage({
              defaultMessage: 'Columns',
              description: 'Evaluation review > evaluations list > filter dropdown button',
            })}
          </div>
        </Button>
      </DialogComboboxCustomButtonTriggerWrapper>
      <DialogComboboxContent
        maxHeight={OPTION_HEIGHT * 15.5}
        minWidth={300}
        maxWidth={500}
        loading={isMetadataLoading && !metadataError}
      >
        {metadataError ? (
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.xs,
              padding: `${theme.spacing.md}px`,
              color: theme.colors.textValidationDanger,
            }}
            data-testid="filter-dropdown-error"
          >
            <DangerIcon />
            <FormattedMessage
              defaultMessage="Fetching traces failed"
              description="Error message for fetching traces failed"
            />
          </div>
        ) : (
          <DialogComboboxOptionList>
            <DialogComboboxOptionListSearch controlledValue={search} setControlledValue={setSearch}>
              {Object.entries(filteredGroupedColumns).map(([groupName, cols]) => (
                <React.Fragment key={groupName}>
                  <DialogComboboxSectionHeader>{getGroupLabel(groupName)}</DialogComboboxSectionHeader>

                  <DialogComboboxOptionListCheckboxItem
                    value={`all-${groupName}`}
                    checked={cols.every((col) => selectedColumns.some((c) => c.id === col.id))}
                    onChange={() => handleSelectAllInGroup(cols)}
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: 'All {groupLabel}',
                        description: 'Evaluation review > evaluations list > select all columns in group',
                      },
                      { groupLabel: getGroupLabel(groupName) },
                    )}
                  </DialogComboboxOptionListCheckboxItem>

                  {cols.map((col) => (
                    <DialogComboboxOptionListCheckboxItem
                      key={col.id}
                      value={col.label}
                      checked={selectedColumns.some((c) => c.id === col.id)}
                      onChange={() => handleToggle(col)}
                    >
                      {col.label}
                    </DialogComboboxOptionListCheckboxItem>
                  ))}
                </React.Fragment>
              ))}
            </DialogComboboxOptionListSearch>
          </DialogComboboxOptionList>
        )}
      </DialogComboboxContent>
    </DialogCombobox>
  );
};
```

--------------------------------------------------------------------------------

````

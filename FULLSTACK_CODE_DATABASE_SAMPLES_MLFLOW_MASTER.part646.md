---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 646
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 646 of 991)

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

---[FILE: AssessmentsPane.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentsPane.tsx
Signals: React

```typescript
import { isNil, partition, uniqBy } from 'lodash';
import { useMemo } from 'react';

import {
  Button,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  Tooltip,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { AssessmentCreateButton } from './AssessmentCreateButton';
import { ASSESSMENT_PANE_MIN_WIDTH } from './AssessmentsPane.utils';
import { ExpectationItem } from './ExpectationItem';
import { FeedbackGroup } from './FeedbackGroup';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment, FeedbackAssessment } from '../ModelTrace.types';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';
import { useTraceCachedActions } from '../hooks/useTraceCachedActions';

type GroupedFeedbacksByValue = { [value: string]: FeedbackAssessment[] };

type GroupedFeedbacks = [assessmentName: string, feedbacks: GroupedFeedbacksByValue][];

const groupFeedbacks = (feedbacks: FeedbackAssessment[]): GroupedFeedbacks => {
  const aggregated: Record<string, GroupedFeedbacksByValue> = {};
  feedbacks.forEach((feedback) => {
    if (feedback.valid === false) {
      return;
    }

    let value = null;
    if (feedback.feedback.value !== '') {
      value = JSON.stringify(feedback.feedback.value);
    }

    const { assessment_name } = feedback;
    if (!aggregated[assessment_name]) {
      aggregated[assessment_name] = {};
    }

    const group = aggregated[assessment_name];
    if (!isNil(value)) {
      if (!group[value]) {
        group[value] = [];
      }
      group[value].push(feedback);
    }
  });

  return Object.entries(aggregated).toSorted(([leftName], [rightName]) => leftName.localeCompare(rightName));
};

export const AssessmentsPane = ({
  assessments,
  traceId,
  activeSpanId,
}: {
  assessments: Assessment[];
  traceId: string;
  activeSpanId?: string;
}) => {
  const reconstructAssessments = useTraceCachedActions((state) => state.reconstructAssessments);
  const cachedActions = useTraceCachedActions((state) => state.assessmentActions[traceId]);

  // Combine the initial assessments with the cached actions (additions and deletions)
  const allAssessments = useMemo(() => {
    // Caching actions is enabled only with Traces V4 feature
    if (!shouldUseTracesV4API()) {
      return assessments;
    }
    const reconstructed = reconstructAssessments(assessments, cachedActions);
    return uniqBy(reconstructed, ({ assessment_id }) => assessment_id);
  }, [assessments, reconstructAssessments, cachedActions]);

  const { theme } = useDesignSystemTheme();
  const { setAssessmentsPaneExpanded, assessmentsPaneExpanded, isInComparisonView } = useModelTraceExplorerViewState();
  const [feedbacks, expectations] = useMemo(
    () => partition(allAssessments, (assessment) => 'feedback' in assessment),
    [allAssessments],
  );
  const groupedFeedbacks = useMemo(() => groupFeedbacks(feedbacks), [feedbacks]);
  const sortedExpectations = expectations.toSorted((left, right) =>
    left.assessment_name.localeCompare(right.assessment_name),
  );

  return (
    <div
      data-testid="assessments-pane"
      css={{
        display: 'flex',
        flexDirection: 'column',
        ...(isInComparisonView
          ? { padding: `${theme.spacing.sm} 0`, maxHeight: theme.spacing.lg * 10 }
          : { padding: theme.spacing.sm, paddingTop: theme.spacing.xs, height: '100%' }),
        ...(isInComparisonView ? {} : { borderLeft: `1px solid ${theme.colors.border}` }),
        overflowY: 'auto',
        minWidth: ASSESSMENT_PANE_MIN_WIDTH,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div css={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {!isInComparisonView && (
          <Typography.Text bold>
            <FormattedMessage defaultMessage="Assessments" description="Label for the assessments pane" />
          </Typography.Text>
        )}
        {!isInComparisonView && setAssessmentsPaneExpanded && (
          <Tooltip
            componentId="shared.model-trace-explorer.close-assessments-pane-tooltip"
            content={
              <FormattedMessage
                defaultMessage="Hide assessments"
                description="Tooltip for a button that closes the assessments pane"
              />
            }
          >
            <Button
              data-testid="close-assessments-pane-button"
              componentId="shared.model-trace-explorer.close-assessments-pane"
              size="small"
              icon={<CloseIcon />}
              onClick={() => setAssessmentsPaneExpanded(false)}
            />
          </Tooltip>
        )}
      </div>
      {groupedFeedbacks.map(([name, valuesMap]) => (
        <FeedbackGroup key={name} name={name} valuesMap={valuesMap} traceId={traceId} activeSpanId={activeSpanId} />
      ))}
      {sortedExpectations.length > 0 && (
        <>
          <Typography.Text color="secondary" css={{ marginBottom: theme.spacing.sm }}>
            <FormattedMessage
              defaultMessage="Expectations"
              description="Label for the expectations section in the assessments pane"
            />
          </Typography.Text>
          <div
            css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}
          >
            {sortedExpectations.map((expectation) => (
              <ExpectationItem expectation={expectation} key={expectation.assessment_id} />
            ))}
          </div>
        </>
      )}
      <AssessmentCreateButton
        title={
          <FormattedMessage
            defaultMessage="Add new assessment"
            description="Label for the button to add a new assessment"
          />
        }
        spanId={activeSpanId}
        traceId={traceId}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentsPane.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentsPane.utils.tsx

```typescript
import { FormattedMessage } from '@databricks/i18n';

import type { Expectation, Feedback } from '../ModelTrace.types';

export type AssessmentFormInputDataType = 'string' | 'boolean' | 'number' | 'json';

export const ASSESSMENT_PANE_MIN_WIDTH = 250;

// assessment names from databricks judges can sometimes have several
// prefixes that function like namespaces. for example:
//
// metric/global_guideline_adherence/api_code
//
// in this case, we only want to display the last element, as that
// is the most helpful name to the user (and to save ui space).
// if there are more slashes beyond that, we assume the user added
// it themselves, so we retain them.
export const getAssessmentDisplayName = (name: string): string => {
  const split = name.split('/');
  if (split.length === 1) {
    return name;
  } else if (split.length === 2) {
    return split[1];
  }
  return split.slice(2).join('/');
};

// forked from mlflow/server/js/src/common/utils/Utils.tsx
export const timeSinceStr = (date: any, referenceDate = new Date()) => {
  const seconds = Math.max(0, Math.floor((referenceDate.getTime() - date) / 1000));
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 year} other {# years}} ago"
        description="Text for time in years since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 month} other {# months}} ago"
        description="Text for time in months since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 day} other {# days}} ago"
        description="Text for time in days since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 hour} other {# hours}} ago"
        description="Text for time in hours since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return (
      <FormattedMessage
        defaultMessage="{timeSince, plural, =1 {1 minute} other {# minutes}} ago"
        description="Text for time in minutes since given date for MLflow views"
        values={{ timeSince: interval }}
      />
    );
  }
  return (
    <FormattedMessage
      defaultMessage="{timeSince, plural, =1 {1 second} other {# seconds}} ago"
      description="Text for time in seconds since given date for MLflow views"
      values={{ timeSince: seconds }}
    />
  );
};

export const getParsedExpectationValue = (expectation: Expectation) => {
  if ('value' in expectation) {
    return expectation.value;
  }

  try {
    // at the moment, "JSON_FORMAT" is the only serialization format
    // that is supported. in the future, we may switch on the
    // expectation.serialized_value.serialization_format field
    // to determine how to parse the value.
    return JSON.parse(expectation.serialized_value.value);
  } catch (e) {
    return expectation.serialized_value.value;
  }
};

export const getCreateAssessmentPayloadValue = ({
  formValue,
  dataType,
  isFeedback,
}: {
  formValue: string | boolean | number | null;
  dataType: AssessmentFormInputDataType;
  isFeedback: boolean;
}): { feedback: Feedback } | { expectation: Expectation } => {
  if (isFeedback) {
    return { feedback: { value: formValue } };
  }

  if (dataType === 'json') {
    return { expectation: { serialized_value: { value: String(formValue), serialization_format: 'JSON_FORMAT' } } };
  }

  return { expectation: { value: formValue } };
};
```

--------------------------------------------------------------------------------

---[FILE: ExpectationItem.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/ExpectationItem.tsx
Signals: React

```typescript
import { useState } from 'react';

import { Typography, useDesignSystemTheme, ChevronRightIcon, ChevronDownIcon, Button } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { AssessmentActionsOverflowMenu } from './AssessmentActionsOverflowMenu';
import { AssessmentDeleteModal } from './AssessmentDeleteModal';
import { AssessmentEditForm } from './AssessmentEditForm';
import { AssessmentSourceName } from './AssessmentSourceName';
import { getParsedExpectationValue } from './AssessmentsPane.utils';
import { ExpectationValuePreview } from './ExpectationValuePreview';
import { SpanNameDetailViewLink } from './SpanNameDetailViewLink';
import { getSourceIcon } from './utils';
import type { ExpectationAssessment } from '../ModelTrace.types';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';

export const ExpectationItem = ({ expectation }: { expectation: ExpectationAssessment }) => {
  const { theme } = useDesignSystemTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { nodeMap, activeView } = useModelTraceExplorerViewState();

  const associatedSpan = expectation.span_id ? nodeMap[expectation.span_id] : null;
  // the summary view displays all assessments regardless of span, so
  // we need some way to indicate which span an assessment is associated with.
  const showAssociatedSpan = activeView === 'summary' && associatedSpan;

  const parsedValue = getParsedExpectationValue(expectation.expectation);
  const SourceIcon = getSourceIcon(expectation.source);

  return (
    <div
      css={{
        padding: theme.spacing.sm + theme.spacing.xs,
        paddingTop: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borders.borderRadiusMd,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
      }}
    >
      <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography.Text bold css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {expectation.assessment_name}
        </Typography.Text>
        <AssessmentActionsOverflowMenu
          assessment={expectation}
          setIsEditing={setIsEditing}
          setShowDeleteModal={setShowDeleteModal}
        />
        <AssessmentDeleteModal
          assessment={expectation}
          isModalVisible={showDeleteModal}
          setIsModalVisible={setShowDeleteModal}
        />
      </div>
      {isEditing ? (
        <AssessmentEditForm
          assessment={expectation}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
          <div css={{ display: 'flex', alignItems: 'center' }}>
            <SourceIcon
              size={theme.typography.fontSizeSm}
              css={{
                padding: 2,
                backgroundColor: theme.colors.actionIconBackgroundHover,
                borderRadius: theme.borders.borderRadiusFull,
              }}
            />
            <AssessmentSourceName source={expectation.source} />
          </div>
          <div css={{ display: 'flex', alignItems: isExpanded ? 'flex-start' : 'center', gap: theme.spacing.xs }}>
            <Button
              componentId="shared.model-trace-explorer.toggle-expectation-expanded"
              size="small"
              icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              onClick={() => setIsExpanded(!isExpanded)}
            />
            <div css={{ flex: 1, minWidth: 0 }}>
              {isExpanded ? (
                <div
                  css={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                    borderRadius: theme.borders.borderRadiusMd,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography.Text>
                    {typeof parsedValue === 'string' ? parsedValue : JSON.stringify(parsedValue, null, 2)}
                  </Typography.Text>
                </div>
              ) : (
                <ExpectationValuePreview parsedValue={parsedValue} singleLine />
              )}
            </div>
          </div>
        </div>
      )}
      {showAssociatedSpan && (
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <Typography.Text size="sm" color="secondary">
            <FormattedMessage defaultMessage="Span" description="Label for the associated span of an assessment" />
          </Typography.Text>
          <SpanNameDetailViewLink node={associatedSpan} />
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ExpectationValuePreview.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/ExpectationValuePreview.tsx

```typescript
import { isString, isObject, isNil } from 'lodash';

import { Tag, Tooltip, Typography, useDesignSystemTheme } from '@databricks/design-system';

const SingleExpectationValuePreview = ({ objectKey, value }: { objectKey?: string; value: any }) => {
  const { theme } = useDesignSystemTheme();
  const displayValue = isString(value) ? value : JSON.stringify(value);

  return (
    <Tooltip content={displayValue} componentId="shared.model-trace-explorer.expectation-value-preview-tooltip">
      <Tag
        color="indigo"
        componentId="shared.model-trace-explorer.expectation-array-item-tag"
        css={{ width: 'min-content', maxWidth: '100%' }}
      >
        <Typography.Text css={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {objectKey && (
            <Typography.Text bold css={{ marginRight: theme.spacing.xs }}>
              {objectKey}:
            </Typography.Text>
          )}
          {displayValue}
        </Typography.Text>
      </Tag>
    </Tooltip>
  );
};

export const ExpectationValuePreview = ({
  parsedValue,
  singleLine = false,
}: {
  parsedValue: any;
  singleLine?: boolean;
}): React.ReactElement | null => {
  const { theme } = useDesignSystemTheme();

  if (isNil(parsedValue)) {
    return null;
  }

  if (Array.isArray(parsedValue)) {
    return singleLine ? (
      <SingleExpectationValuePreview value={parsedValue} />
    ) : (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}
      >
        {parsedValue.map((item, index) => (
          <SingleExpectationValuePreview value={item} key={index} />
        ))}
      </div>
    );
  }

  if (isObject(parsedValue)) {
    return singleLine ? (
      <SingleExpectationValuePreview value={parsedValue} />
    ) : (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
        }}
      >
        {Object.entries(parsedValue).map(([key, value]) => (
          <SingleExpectationValuePreview key={key} objectKey={key} value={value} />
        ))}
      </div>
    );
  }

  return <SingleExpectationValuePreview value={parsedValue} />;
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackErrorItem.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackErrorItem.tsx
Signals: React

```typescript
import { useState } from 'react';

import { Alert, Modal, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { CodeSnippetRenderMode, type AssessmentError } from '../ModelTrace.types';
import { ModelTraceExplorerCodeSnippet } from '../ModelTraceExplorerCodeSnippet';

export const FeedbackErrorItem = ({ error }: { error: AssessmentError }) => {
  const { theme } = useDesignSystemTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
      <Alert
        type="error"
        closable={false}
        message={error.error_code}
        componentId="shared.model-trace-explorer.feedback-error-item"
        description={
          <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
            <span>{error.error_message}</span>
            {error.stack_trace && (
              <Typography.Link
                componentId="shared.model-trace-explorer.feedback-error-item-stack-trace-link"
                onClick={() => setIsModalVisible(true)}
              >
                <FormattedMessage
                  defaultMessage="View stack trace"
                  description="Link to view the stack trace for an assessment error"
                />
              </Typography.Link>
            )}
          </div>
        }
      />
      {error.stack_trace && (
        <Modal
          title={
            <FormattedMessage
              defaultMessage="Error stack trace"
              description="Title of the assessment error stack trace modal"
            />
          }
          visible={isModalVisible}
          componentId="shared.model-trace-explorer.feedback-error-stack-trace-modal"
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <ModelTraceExplorerCodeSnippet
            data={JSON.stringify(error.stack_trace)}
            title=""
            initialRenderMode={CodeSnippetRenderMode.TEXT}
          />
        </Modal>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackGroup.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackGroup.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useState } from 'react';

import { useDesignSystemTheme, Typography, Button, PlusIcon, Tooltip, DangerIcon } from '@databricks/design-system';

import { AssessmentCreateForm } from './AssessmentCreateForm';
import { getAssessmentDisplayName } from './AssessmentsPane.utils';
import { FeedbackValueGroup } from './FeedbackValueGroup';
import type { FeedbackAssessment } from '../ModelTrace.types';

export const FeedbackGroup = ({
  name,
  valuesMap,
  traceId,
  activeSpanId,
}: {
  name: string;
  valuesMap: { [value: string]: FeedbackAssessment[] };
  traceId: string;
  activeSpanId?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  const displayName = getAssessmentDisplayName(name);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const hasError = Object.values(valuesMap)
    .flat()
    .some((feedback) => !isNil(feedback.feedback.error));

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borders.borderRadiusMd,
        padding: theme.spacing.sm + theme.spacing.xs,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.sm,
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sm,
        }}
      >
        <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flex: 1, minWidth: 0 }}>
          <Typography.Text bold css={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
            {displayName}
          </Typography.Text>
          {hasError && <DangerIcon css={{ flexShrink: 0 }} color="danger" />}
        </div>
        <Tooltip content="Add new feedback" componentId="shared.model-trace-explorer.add-feedback-in-group-tooltip">
          <Button
            componentId="shared.model-trace-explorer.add-feedback"
            css={{ flexShrink: 0, marginRight: -theme.spacing.xs }}
            size="small"
            icon={<PlusIcon />}
            onClick={() => setShowCreateForm(true)}
          />
        </Tooltip>
      </div>
      {Object.entries(valuesMap).map(([jsonValue, feedbacks]) => (
        <FeedbackValueGroup jsonValue={jsonValue} feedbacks={feedbacks} key={jsonValue} />
      ))}
      {showCreateForm && (
        <AssessmentCreateForm
          assessmentName={name}
          spanId={activeSpanId}
          traceId={traceId}
          setExpanded={setShowCreateForm}
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackHistoryItem.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackHistoryItem.tsx

```typescript
import { isNil } from 'lodash';

import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { GenAIMarkdownRenderer } from '@databricks/web-shared/genai-markdown-renderer';

import { AssessmentDisplayValue } from './AssessmentDisplayValue';
import { AssessmentItemHeader } from './AssessmentItemHeader';
import { FeedbackErrorItem } from './FeedbackErrorItem';
import type { FeedbackAssessment } from '../ModelTrace.types';

// this is mostly a copy of FeedbackItem, but with
// different styling and no ability to edit.
export const FeedbackHistoryItem = ({ feedback }: { feedback: FeedbackAssessment }) => {
  const { theme } = useDesignSystemTheme();
  const value = feedback.feedback.value;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <AssessmentItemHeader renderConnector={false} assessment={feedback} />
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
          marginLeft: 10,
          paddingLeft: theme.spacing.md,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.md,
          paddingRight: theme.spacing.lg,
          borderLeft: `1px solid ${theme.colors.border}`,
        }}
      >
        {!isNil(feedback.feedback.error) ? (
          <FeedbackErrorItem error={feedback.feedback.error} />
        ) : (
          <>
            <Typography.Text size="sm" color="secondary">
              <FormattedMessage defaultMessage="Feedback" description="Label for the value of an feedback assessment" />
            </Typography.Text>
            <div>
              <AssessmentDisplayValue jsonValue={JSON.stringify(value)} assessmentName={feedback.assessment_name} />
            </div>
          </>
        )}
        {feedback.rationale && (
          <>
            <Typography.Text size="sm" color="secondary" css={{ marginTop: theme.spacing.xs }}>
              <FormattedMessage
                defaultMessage="Rationale"
                description="Label for the rationale of an expectation assessment"
              />
            </Typography.Text>
            <GenAIMarkdownRenderer>{feedback.rationale}</GenAIMarkdownRenderer>
          </>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackHistoryModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackHistoryModal.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import { Modal } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { FeedbackHistoryItem } from './FeedbackHistoryItem';
import type { Assessment, FeedbackAssessment } from '../ModelTrace.types';

// helper function to traverse the linked list of overridden
// assessments. this function handles cycles by keeping track
// of the assessments we've seen. the backend should prevent
// such cases from existing, but we should be defensive.
const flattenOverrides = (assessment: Assessment) => {
  const seen = new Set<string>();
  const flattened = [];

  let currentAssessment: Assessment | undefined = assessment;
  while (currentAssessment && !seen.has(currentAssessment.assessment_id)) {
    seen.add(currentAssessment.assessment_id);
    flattened.push(currentAssessment);
    currentAssessment = currentAssessment.overriddenAssessment;
  }

  return flattened;
};

export const FeedbackHistoryModal = ({
  isModalVisible,
  setIsModalVisible,
  feedback,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  feedback: FeedbackAssessment;
}) => {
  const assessmentHistory = useMemo(() => flattenOverrides(feedback), [feedback]);

  return (
    <Modal
      componentId="shared.model-trace-explorer.feedback-history-modal"
      visible={isModalVisible}
      footer={null}
      onCancel={() => {
        setIsModalVisible(false);
      }}
      title={
        <FormattedMessage
          defaultMessage="Edit history"
          description="Title of a modal that shows the edit history of an assessment"
        />
      }
    >
      {assessmentHistory.map((assessment) =>
        'feedback' in assessment ? <FeedbackHistoryItem key={assessment.assessment_id} feedback={assessment} /> : null,
      )}
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackItem.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackItem.tsx
Signals: React

```typescript
import { useState } from 'react';

import { useDesignSystemTheme } from '@databricks/design-system';

import { AssessmentEditForm } from './AssessmentEditForm';
import { AssessmentItemHeader } from './AssessmentItemHeader';
import { FeedbackItemContent } from './FeedbackItemContent';
import type { FeedbackAssessment } from '../ModelTrace.types';

export const FeedbackItem = ({ feedback }: { feedback: FeedbackAssessment }) => {
  const { theme } = useDesignSystemTheme();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xs,
        paddingLeft: theme.spacing.lg / 2,
        marginLeft: theme.spacing.lg / 2,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        borderLeft: `1px solid ${theme.colors.border}`,
        position: 'relative',
      }}
    >
      <AssessmentItemHeader assessment={feedback} setIsEditing={setIsEditing} />
      {isEditing ? (
        <AssessmentEditForm
          assessment={feedback}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <FeedbackItemContent feedback={feedback} />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackItemContent.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackItemContent.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { useState } from 'react';

import { Typography, useDesignSystemTheme, NewWindowIcon } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { GenAIMarkdownRenderer } from '@databricks/web-shared/genai-markdown-renderer';

import { AssessmentDisplayValue } from './AssessmentDisplayValue';
import { FeedbackErrorItem } from './FeedbackErrorItem';
import { FeedbackHistoryModal } from './FeedbackHistoryModal';
import { SpanNameDetailViewLink } from './SpanNameDetailViewLink';
import type { FeedbackAssessment } from '../ModelTrace.types';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';
import { Link, useParams } from '../RoutingUtils';
import { MLFLOW_ASSESSMENT_JUDGE_COST, MLFLOW_ASSESSMENT_SCORER_TRACE_ID } from '../constants';
import { getExperimentPageTracesTabRoute } from '../routes';

export const FeedbackItemContent = ({ feedback }: { feedback: FeedbackAssessment }) => {
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const { theme } = useDesignSystemTheme();
  const { nodeMap, activeView } = useModelTraceExplorerViewState();
  const { experimentId } = useParams();

  const value = feedback.feedback.value;

  const associatedSpan = feedback.span_id ? nodeMap[feedback.span_id] : null;
  // the summary view displays all assessments regardless of span, so
  // we need some way to indicate which span an assessment is associated with.
  const showAssociatedSpan = activeView === 'summary' && associatedSpan;

  const judgeTraceId = feedback.metadata?.[MLFLOW_ASSESSMENT_SCORER_TRACE_ID];
  const judgeTraceHref = judgeTraceId && experimentId ? getJudgeTraceHref(experimentId, judgeTraceId) : undefined;

  const judgeCost = feedback.metadata?.[MLFLOW_ASSESSMENT_JUDGE_COST];
  const formattedCost = (() => {
    if (judgeCost === null) {
      return undefined;
    }

    const numericCost = Number(judgeCost);
    if (!Number.isFinite(numericCost)) {
      return undefined;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(numericCost);
  })();
  const shouldShowCostSection = Boolean(formattedCost);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginLeft: theme.spacing.lg }}>
      {!isNil(feedback.feedback.error) && <FeedbackErrorItem error={feedback.feedback.error} />}
      {showAssociatedSpan && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          <Typography.Text size="sm" color="secondary">
            <FormattedMessage defaultMessage="Span" description="Label for the associated span of an assessment" />
          </Typography.Text>
          <SpanNameDetailViewLink node={associatedSpan} />
        </div>
      )}
      {isNil(feedback.feedback.error) && (
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <Typography.Text size="sm" color="secondary">
            <FormattedMessage defaultMessage="Feedback" description="Label for the value of an feedback assessment" />
          </Typography.Text>
          <div css={{ display: 'flex', gap: theme.spacing.xs }}>
            <AssessmentDisplayValue jsonValue={JSON.stringify(value)} assessmentName={feedback.assessment_name} />
            {feedback.overriddenAssessment && (
              <>
                <span onClick={() => setIsHistoryModalVisible(true)}>
                  <Typography.Text
                    css={{
                      '&:hover': {
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      },
                    }}
                    color="secondary"
                  >
                    <FormattedMessage
                      defaultMessage="(edited)"
                      description="Link text in an edited assessment that allows the user to click to see the previous value"
                    />
                  </Typography.Text>
                </span>
                <FeedbackHistoryModal
                  isModalVisible={isHistoryModalVisible}
                  setIsModalVisible={setIsHistoryModalVisible}
                  feedback={feedback}
                />
              </>
            )}
          </div>
        </div>
      )}
      {feedback.rationale && (
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <Typography.Text size="sm" color="secondary">
            <FormattedMessage
              defaultMessage="Rationale"
              description="Label for the rationale of an expectation assessment"
            />
          </Typography.Text>
          <div css={{ '& > div:last-of-type': { marginBottom: 0 } }}>
            <GenAIMarkdownRenderer>{feedback.rationale}</GenAIMarkdownRenderer>
          </div>
        </div>
      )}
      {shouldShowCostSection && (
        <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          <Typography.Text size="sm" color="secondary">
            <FormattedMessage
              defaultMessage="Cost"
              description="Label for the cost metadata associated with a judge feedback"
            />
          </Typography.Text>
          <Typography.Text style={{ color: theme.colors.textSecondary }}>{formattedCost}</Typography.Text>
        </div>
      )}
      {judgeTraceHref && (
        <Link to={judgeTraceHref} target="_blank" rel="noreferrer">
          <span css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <FormattedMessage
              defaultMessage="View trace"
              description="Link text for navigating to the corresponding judge trace"
            />
            <NewWindowIcon css={{ fontSize: 12 }} />
          </span>
        </Link>
      )}
    </div>
  );
};

const getJudgeTraceHref = (experimentId: string, judgeTraceId: string) => {
  return `${getExperimentPageTracesTabRoute(experimentId)}?selectedEvaluationId=${judgeTraceId}`;
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackValueGroup.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackValueGroup.tsx
Signals: React

```typescript
import { useState } from 'react';

import { Button, ChevronDownIcon, ChevronRightIcon, useDesignSystemTheme } from '@databricks/design-system';

import { AssessmentDisplayValue } from './AssessmentDisplayValue';
import { FeedbackItem } from './FeedbackItem';
import { FeedbackValueGroupSourceCounts } from './FeedbackValueGroupSourceCounts';
import type { FeedbackAssessment } from '../ModelTrace.types';

export const FeedbackValueGroup = ({
  jsonValue,
  feedbacks,
}: {
  jsonValue: string;
  feedbacks: FeedbackAssessment[];
}) => {
  const { theme } = useDesignSystemTheme();
  const [expanded, setExpanded] = useState(false);
  const assessmentName = feedbacks[0]?.assessment_name;

  return (
    <div css={{ display: 'flex', flexDirection: 'column' }}>
      <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
        <Button
          componentId="shared.model-trace-explorer.toggle-assessment-expanded"
          css={{ flexShrink: 0 }}
          size="small"
          icon={expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => setExpanded(!expanded)}
        />
        <AssessmentDisplayValue jsonValue={jsonValue} assessmentName={assessmentName} />
        <FeedbackValueGroupSourceCounts feedbacks={feedbacks} />
      </div>
      {expanded && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {feedbacks.map((feedback) =>
            // don't display assessments that have been overridden
            feedback?.valid === false ? null : <FeedbackItem feedback={feedback} key={feedback.assessment_id} />,
          )}
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeedbackValueGroupSourceCounts.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/FeedbackValueGroupSourceCounts.tsx

```typescript
import { countBy } from 'lodash';

import { CodeIcon, SparkleIcon, Tag, Typography, useDesignSystemTheme, UserIcon } from '@databricks/design-system';

import type { AssessmentSourceType, FeedbackAssessment } from '../ModelTrace.types';

const getSourceTypeIcon = (sourceType: AssessmentSourceType) => {
  const smallIconStyles = {
    '& > svg': {
      width: 12,
      height: 12,
    },
  };
  switch (sourceType) {
    case 'HUMAN':
      return <UserIcon css={smallIconStyles} />;
    case 'LLM_JUDGE':
      return <SparkleIcon css={smallIconStyles} />;
    case 'CODE':
      return <CodeIcon css={smallIconStyles} />;
    default:
      return null;
  }
};

export const FeedbackValueGroupSourceCounts = ({ feedbacks }: { feedbacks: FeedbackAssessment[] }) => {
  const { theme } = useDesignSystemTheme();

  if (feedbacks.length < 2) {
    return null;
  }

  const sourceCounts = countBy(feedbacks, (feedback) => feedback.source.source_type);
  return (
    <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center', marginLeft: theme.spacing.xs }}>
      {Object.entries(sourceCounts).map(([sourceType, count]) => (
        <Tag
          componentId="shared.model-trace-explorer.feedback-source-count"
          css={{
            margin: 0,
          }}
          key={sourceType}
        >
          <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            {getSourceTypeIcon(sourceType as AssessmentSourceType)}
            <Typography.Text>{count}</Typography.Text>
          </div>
        </Tag>
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

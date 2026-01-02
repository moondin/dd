---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 618
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 618 of 991)

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

---[FILE: EvaluationsReviewAssessments.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessments.tsx
Signals: React

```typescript
import { first, isString } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import {
  AssistantIcon,
  BugIcon,
  Button,
  ChevronRightIcon,
  ChevronUpIcon,
  PlusIcon,
  Spacer,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { EvaluationsReviewAssessmentDetailedHistory } from './EvaluationsReviewAssessmentDetailedHistory';
import { EvaluationsReviewAssessmentTag } from './EvaluationsReviewAssessmentTag';
import { EvaluationsReviewAssessmentTooltip } from './EvaluationsReviewAssessmentTooltip';
import { EvaluationsReviewAssessmentUpsertForm } from './EvaluationsReviewAssessmentUpsertForm';
import {
  createDraftEvaluationResultAssessmentObject,
  getEvaluationResultAssessmentValue,
  isAssessmentMissing,
  isDraftAssessment,
  KnownEvaluationResultAssessmentName,
  KnownEvaluationResultAssessmentValueLabel,
} from './GenAiEvaluationTracesReview.utils';
import { useEditAssessmentFormState } from '../hooks/useEditAssessmentFormState';
import type { AssessmentInfo, RunEvaluationResultAssessmentDraft, RunEvaluationResultAssessment } from '../types';
import { EXPANDED_ASSESSMENT_DETAILS_VIEW } from '../utils/EvaluationLogging';
import { useMarkdownConverter } from '../utils/MarkdownUtils';

/**
 * Displays an expanded assessment with rationale and edit history.
 * Expanded assessments each has its own edit form.
 */
const ExpandedAssessment = ({
  assessmentsType, // Type of the assessments, e.g. 'overall', 'response', 'retrieval'. Used for component IDs.
  assessmentName, // Name of the assessment.
  assessmentHistory, // A list of assessment history.
  rootCauseAssessment, // The root cause assessment causing this to fail.
  onUpsertAssessment, // Callback to upsert an assessment. This is called when the user saves an assessment. Any pre-saving logic should be done here.
  allowEditing = false, // Whether editing is allowed.
  options, // A list of known assessment names as options for the dropdown.
  inputs, // Dependency array to control the refresh of the states.
  assessmentInfo,
  assessmentInfos,
}: {
  assessmentsType: 'overall' | 'response' | 'retrieval';
  assessmentName: string;
  assessmentHistory: RunEvaluationResultAssessment[];
  rootCauseAssessment?: RunEvaluationResultAssessment;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  allowEditing?: boolean;
  options?: KnownEvaluationResultAssessmentName[];
  inputs?: any;
  assessmentInfo: AssessmentInfo;
  assessmentInfos: AssessmentInfo[];
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const isOverallAssessment = assessmentsType === 'overall';

  const {
    suggestions,
    editingAssessment,
    showUpsertForm: isEditing,
    editAssessment,
    closeForm,
  } = useEditAssessmentFormState(assessmentHistory, assessmentInfos);

  // Clear the states when the inputs change
  useEffect(() => {
    // Close the form if it's open
    closeForm();
  }, [inputs, closeForm]);

  const assessment = first(assessmentHistory);

  const intlLabel = KnownEvaluationResultAssessmentValueLabel[assessmentName];
  const label = intlLabel ? intl.formatMessage(intlLabel) : assessmentName;

  const hasValue = Boolean(assessment && getEvaluationResultAssessmentValue(assessment));
  const isDraft = Boolean(assessment && isDraftAssessment(assessment));

  const isEditable = allowEditing && (hasValue || isDraft);

  const { makeHTML } = useMarkdownConverter();

  const suggestedActionHtml = useMemo(() => {
    const suggestedAction = assessment?.rootCauseAssessment?.suggestedActions;
    return isString(suggestedAction) ? makeHTML(suggestedAction) : null;
  }, [assessment, makeHTML]);

  return (
    <div
      key={assessmentName}
      css={{
        display: 'block',
        marginBottom: !isOverallAssessment ? theme.spacing.md : undefined,
      }}
    >
      {!isEditing && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
          {assessmentName !== KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT && (
            <div
              css={{
                display: 'flex',
                gap: theme.spacing.sm,
                alignItems: 'center',
              }}
            >
              <EvaluationsReviewAssessmentTag
                assessment={assessment}
                aria-label={label}
                disableJudgeTypeIcon={isAssessmentMissing(assessment)}
                onEdit={
                  isEditable
                    ? () => {
                        const assessmentToEdit = first(assessmentHistory);
                        assessmentToEdit && editAssessment(assessmentToEdit);
                      }
                    : undefined
                }
                assessmentInfo={assessmentInfo}
                type="assessment-value"
              />
            </div>
          )}
          <EvaluationsReviewAssessmentDetailedHistory
            history={assessmentHistory}
            alwaysExpanded={isOverallAssessment}
          />

          {rootCauseAssessment && (
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
                marginTop: theme.spacing.xs,
              }}
            >
              {/* Root cause failure */}
              <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
                <BugIcon color="danger" />
                <Typography.Text bold>
                  <FormattedMessage
                    defaultMessage="Root cause failure:"
                    description="Evaluation review > assessments > root cause failure > title"
                  />
                </Typography.Text>
                <EvaluationsReviewAssessmentTag
                  assessment={rootCauseAssessment}
                  isRootCauseAssessment
                  aria-label={label}
                  assessmentInfo={assessmentInfo}
                  type="assessment-value"
                />
              </div>
              <EvaluationsReviewAssessmentDetailedHistory
                history={[rootCauseAssessment]}
                alwaysExpanded={isOverallAssessment}
              />
              {suggestedActionHtml && (
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.sm,
                  }}
                >
                  <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
                    <AssistantIcon color="ai" />
                    <Typography.Text bold>
                      <FormattedMessage
                        defaultMessage="Suggested actions"
                        description="Evaluation review > assessments > suggested actions > title"
                      />
                    </Typography.Text>
                  </div>
                  {/* eslint-disable-next-line react/no-danger */}
                  <span css={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: suggestedActionHtml }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <>
          <EvaluationsReviewAssessmentUpsertForm
            key={editingAssessment?.name}
            editedAssessment={editingAssessment}
            valueSuggestions={suggestions}
            onCancel={closeForm}
            onSave={({ value, rationale, assessmentName }) => {
              const defaultAssessmentName = isOverallAssessment
                ? KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT
                : '';
              const assessment = createDraftEvaluationResultAssessmentObject({
                name: assessmentName ?? editingAssessment?.name ?? defaultAssessmentName,
                isOverallAssessment: isOverallAssessment,
                value,
                rationale,
              });
              onUpsertAssessment(assessment);
              closeForm();
            }}
          />
        </>
      )}
    </div>
  );
};

/**
 * Displays a list of assessments in expanded mode along with an add assessment button at the end.
 */
const ExpandedAssessments = ({
  assessmentsType, // Type of the assessments, e.g. 'overall', 'response', 'retrieval'. Used for component IDs.
  assessmentsByName, // A list of assessments by name.
  rootCauseAssessment, // The root cause assessment causing this to fail.
  onUpsertAssessment, // Callback to upsert an assessment. This is called when the user saves an assessment. Any pre-saving logic should be done here.
  allowEditing = false, // Whether editing is allowed.
  allowMoreThanOne = false, // Whether allow more than one assessment.
  options, // A list of known assessment names as options for the dropdown.
  inputs, // Dependency array to control the refresh of the states.
  assessmentInfos,
}: {
  assessmentsType: 'overall' | 'response' | 'retrieval';
  assessmentsByName: [string, RunEvaluationResultAssessment[]][];
  rootCauseAssessment?: RunEvaluationResultAssessment;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  allowEditing?: boolean;
  allowMoreThanOne?: boolean;
  options?: KnownEvaluationResultAssessmentName[];
  inputs?: any;
  assessmentInfos: AssessmentInfo[];
}) => {
  const { theme } = useDesignSystemTheme();

  const isOverallAssessment = assessmentsType === 'overall';

  const nonEmptyAssessments = assessmentsByName.filter(([_, assessmentList]) => assessmentList.length > 0);

  const { suggestions, editingAssessment, showUpsertForm, addAssessment, closeForm } = useEditAssessmentFormState(
    nonEmptyAssessments.flatMap(([_key, assessmentList]) => assessmentList),
    assessmentInfos,
  );

  // Clear the states when the inputs change
  useEffect(() => {
    // Close the form if it's open
    closeForm();
  }, [inputs, closeForm]);

  const containsAssessments = Object.keys(nonEmptyAssessments).length > 0;
  const showAddAssessmentButton = allowEditing && (allowMoreThanOne || !containsAssessments);

  return (
    <>
      <div
        // comment for copybara formatting
        css={{ display: 'block', flexWrap: 'wrap', gap: theme.spacing.xs }}
      >
        {nonEmptyAssessments.map(([key, assessmentList]) => {
          const assessmentInfo = assessmentInfos.find((info) => info.name === key);
          if (!assessmentInfo) {
            return <div css={{ display: 'none' }} key={key} />;
          }
          return (
            <ExpandedAssessment
              key={key}
              assessmentsType={assessmentsType}
              assessmentName={key}
              assessmentHistory={assessmentList}
              rootCauseAssessment={rootCauseAssessment}
              onUpsertAssessment={onUpsertAssessment}
              allowEditing={allowEditing}
              options={options}
              inputs={inputs}
              assessmentInfo={assessmentInfo}
              assessmentInfos={assessmentInfos}
            />
          );
        })}
        {showAddAssessmentButton && (
          <Button
            componentId={
              assessmentsType === 'overall'
                ? 'mlflow.evaluations_review.add_assessment_overall_button'
                : assessmentsType === 'response'
                ? 'mlflow.evaluations_review.add_assessment_response_button'
                : 'mlflow.evaluations_review.add_assessment_retrieval_button'
            }
            onClick={addAssessment}
            icon={<PlusIcon />}
            size="small"
          >
            <FormattedMessage
              defaultMessage="Add assessment"
              description="Evaluation review > assessments > add assessment button label"
            />
          </Button>
        )}
      </div>
      {showUpsertForm && (
        <>
          <Spacer size="sm" />
          <EvaluationsReviewAssessmentUpsertForm
            valueSuggestions={suggestions}
            onCancel={closeForm}
            onSave={({ value, rationale, assessmentName }) => {
              const defaultAssessmentName = isOverallAssessment
                ? KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT
                : assessmentName || '';
              const assessment = createDraftEvaluationResultAssessmentObject({
                name: assessmentName ?? editingAssessment?.name ?? defaultAssessmentName,
                isOverallAssessment: isOverallAssessment,
                value,
                rationale,
              });
              onUpsertAssessment(assessment);
              closeForm();
            }}
          />
        </>
      )}
    </>
  );
};

/**
 * Displays a list of assessments in compact mode.
 * Compact assessments share the same edit form.
 */
const CompactAssessments = ({
  assessmentsType, // Type of the assessments, e.g. 'overall', 'response', 'retrieval'. Used for component IDs.
  assessmentsByName, // A list of assessments by name.
  onUpsertAssessment, // Callback to upsert an assessment. This is called when the user saves an assessment. Any pre-saving logic should be done here.
  allowEditing = false, // Whether editing is allowed.
  allowMoreThanOne = false, // Whether allow more than one assessment.
  options, // A list of known assessment names as options for the dropdown.
  inputs, // Dependency array to control the refresh of the states.
  assessmentInfos,
}: {
  assessmentsType: 'overall' | 'response' | 'retrieval';
  assessmentsByName: [string, RunEvaluationResultAssessment[]][];
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  allowEditing?: boolean;
  allowMoreThanOne?: boolean;
  options?: KnownEvaluationResultAssessmentName[];
  inputs?: any;
  assessmentInfos: AssessmentInfo[];
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const isOverallAssessment = assessmentsType === 'overall';

  const { suggestions, editingAssessment, showUpsertForm, addAssessment, editAssessment, closeForm } =
    useEditAssessmentFormState(
      assessmentsByName.flatMap(([_key, assessmentList]) => assessmentList),
      assessmentInfos,
    );

  // Clear the states when the inputs change
  useEffect(() => {
    // Close the form if it's open
    closeForm();
  }, [inputs, closeForm]);

  const nonEmptyAssessments = assessmentsByName.filter(([_, assessmentList]) => assessmentList.length > 0);

  const containsAssessments = Object.keys(nonEmptyAssessments).length > 0;
  const showAddAssessmentButton = allowEditing && (allowMoreThanOne || !containsAssessments);

  return (
    <>
      <div css={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.xs, alignItems: 'center' }}>
        {nonEmptyAssessments.map(([key, assessmentList]) => {
          const assessment = first(assessmentList);
          const assessmentInfo = assessmentInfos.find((info) => info.name === key);

          if (!assessmentInfo) {
            // eslint-disable-next-line react/jsx-key -- TODO(FEINF-1756)
            return <></>;
          }

          const intlLabel = KnownEvaluationResultAssessmentValueLabel[key];
          const label = intlLabel ? intl.formatMessage(intlLabel) : key;

          const hasValue = Boolean(assessment && getEvaluationResultAssessmentValue(assessment));
          const isDraft = Boolean(assessment && isDraftAssessment(assessment));

          const isEditable = allowEditing && (hasValue || isDraft) && assessmentInfo.isEditable;

          return (
            <div
              key={key}
              css={{
                display: 'contents',
              }}
            >
              <EvaluationsReviewAssessmentTooltip assessmentHistory={assessmentList}>
                <EvaluationsReviewAssessmentTag
                  assessment={assessment}
                  aria-label={label}
                  active={editingAssessment?.name === key && showUpsertForm}
                  disableJudgeTypeIcon={isAssessmentMissing(assessment)}
                  onEdit={
                    isEditable
                      ? () => {
                          const assessmentToEdit = first(assessmentList);
                          assessmentToEdit && editAssessment(assessmentToEdit);
                        }
                      : undefined
                  }
                  assessmentInfo={assessmentInfo}
                  type="assessment-value"
                />
              </EvaluationsReviewAssessmentTooltip>
            </div>
          );
        })}
        {showAddAssessmentButton && (
          <Button
            componentId={
              assessmentsType === 'overall'
                ? 'mlflow.evaluations_review.add_assessment_overall_button'
                : assessmentsType === 'response'
                ? 'mlflow.evaluations_review.add_assessment_response_button'
                : 'mlflow.evaluations_review.add_assessment_retrieval_button'
            }
            onClick={addAssessment}
            icon={<PlusIcon />}
            size="small"
          >
            <FormattedMessage
              defaultMessage="Add assessment"
              description="Evaluation review > assessments > add assessment button label"
            />
          </Button>
        )}
      </div>
      {showUpsertForm && (
        <>
          <Spacer size="sm" />
          <EvaluationsReviewAssessmentUpsertForm
            key={editingAssessment?.name}
            editedAssessment={editingAssessment}
            valueSuggestions={suggestions}
            onCancel={closeForm}
            onSave={({ value, rationale, assessmentName }) => {
              const defaultAssessmentName = isOverallAssessment
                ? KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT
                : assessmentName || '';
              const assessment = createDraftEvaluationResultAssessmentObject({
                name: assessmentName ?? editingAssessment?.name ?? defaultAssessmentName,
                isOverallAssessment: isOverallAssessment,
                value,
                rationale,
              });
              onUpsertAssessment(assessment);
              closeForm();
            }}
          />
        </>
      )}
    </>
  );
};

/**
 * Displays a list of assessments with an option to expand and see the detailed view.
 */
export const EvaluationsReviewAssessments = ({
  assessmentsType, // Type of the assessments, e.g. 'overall', 'response', 'retrieval'. Used for component IDs.
  assessmentsByName, // A list of assessments by name.
  rootCauseAssessment, // The root cause assessment causing this to fail.
  onUpsertAssessment, // Callback to upsert an assessment. This is called when the user saves an assessment. Any pre-saving logic should be done here.
  allowEditing = false, // Whether editing is allowed.
  allowMoreThanOne = false, // Whether allow more than one assessment.
  alwaysExpanded = false, // Whether the detailed view is always expanded.
  options, // A list of known assessment names as options for the dropdown.
  inputs, // Dependency array to control the refresh of the states.
  assessmentInfos,
}: {
  assessmentsType: 'overall' | 'response' | 'retrieval';
  assessmentsByName: [string, RunEvaluationResultAssessment[]][];
  rootCauseAssessment?: RunEvaluationResultAssessment;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  allowEditing?: boolean;
  allowMoreThanOne?: boolean;
  alwaysExpanded?: boolean;
  options?: KnownEvaluationResultAssessmentName[];
  inputs?: any;
  assessmentInfos: AssessmentInfo[];
}) => {
  // True if in expanded view, false otherwise.
  const [isExpandedView, setIsExpandedView] = useState(false);
  const showExpandedView = alwaysExpanded || isExpandedView;

  const nonEmptyAssessments = assessmentsByName.filter(([_, assessmentList]) => assessmentList.length > 0);

  // Remove the overall assessment if it's not an overall assessment and we're not showing overall assessments.
  let filteredAssessmentsByName = assessmentsByName;
  if (assessmentsType !== 'overall') {
    filteredAssessmentsByName = assessmentsByName.filter(
      ([key, _]) => key !== KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT,
    );
  }

  const containsAssessments = Object.keys(nonEmptyAssessments).length > 0;

  return (
    <>
      {showExpandedView && (
        <ExpandedAssessments
          assessmentsType={assessmentsType}
          assessmentsByName={filteredAssessmentsByName}
          rootCauseAssessment={rootCauseAssessment}
          onUpsertAssessment={onUpsertAssessment}
          allowEditing={allowEditing}
          allowMoreThanOne={allowMoreThanOne}
          options={options}
          inputs={inputs}
          assessmentInfos={assessmentInfos}
        />
      )}
      {!showExpandedView && (
        <CompactAssessments
          assessmentsType={assessmentsType}
          assessmentsByName={filteredAssessmentsByName}
          onUpsertAssessment={onUpsertAssessment}
          allowEditing={allowEditing}
          allowMoreThanOne={allowMoreThanOne}
          options={options}
          inputs={inputs}
          assessmentInfos={assessmentInfos}
        />
      )}
      {containsAssessments && !alwaysExpanded && (
        <>
          <Spacer size="sm" />
          <Button
            size="small"
            type="tertiary"
            componentId={
              assessmentsType === 'overall'
                ? 'mlflow.evaluations_review.see_assessment_details_overall_button'
                : assessmentsType === 'response'
                ? 'mlflow.evaluations_review.see_assessment_details_response_button'
                : 'mlflow.evaluations_review.see_assessment_details_retrieval_button'
            }
            icon={showExpandedView ? <ChevronUpIcon /> : <ChevronRightIcon />}
            onClick={() => setIsExpandedView((mode) => !mode)}
          >
            {showExpandedView ? (
              <FormattedMessage
                defaultMessage="Hide details"
                description="Evaluation review > assessments > hide details button"
              />
            ) : (
              <FormattedMessage
                defaultMessage="See details"
                description="Evaluation review > assessments > see details button"
              />
            )}
          </Button>
        </>
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewAssessmentsConfirmButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentsConfirmButton.tsx

```typescript
import { Button, ChevronRightIcon } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

export const EvaluationsReviewAssessmentsConfirmButton = ({
  toBeReviewed,
  containsOverallAssessment,
  isNextResultAvailable,
  overridingExistingReview,
  hasPendingAssessments,
  onClickNext,
  onSave,
  onCancelOverride,
}: {
  toBeReviewed: boolean;
  containsOverallAssessment: boolean;
  isNextResultAvailable: boolean;
  hasPendingAssessments: boolean;
  overridingExistingReview: boolean;
  onSave?: () => Promise<void>;
  onClickNext?: () => void;
  onCancelOverride?: () => void;
}) => {
  if (toBeReviewed) {
    if (hasPendingAssessments) {
      return (
        <Button type="primary" componentId="mlflow.evaluations_review.save_pending_assessments_button" onClick={onSave}>
          <FormattedMessage defaultMessage="Save" description="Evaluation review > assessments > save button" />
        </Button>
      );
    }
    if (overridingExistingReview) {
      return (
        <Button componentId="mlflow.evaluations_review.cancel_override_assessments_button" onClick={onCancelOverride}>
          <FormattedMessage
            defaultMessage="Cancel"
            description="Evaluation review > assessments > cancel overriding review button"
          />
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        componentId="mlflow.evaluations_review.mark_as_reviewed_button"
        onClick={onSave}
        disabled={!containsOverallAssessment}
      >
        <FormattedMessage
          defaultMessage="Mark as reviewed"
          description="Evaluation review > assessments > mark as reviewed button"
        />
      </Button>
    );
  }
  return (
    <Button
      type="primary"
      componentId="mlflow.evaluations_review.next_evaluation_result_button"
      onClick={onClickNext}
      endIcon={<ChevronRightIcon />}
      disabled={!isNextResultAvailable}
    >
      <FormattedMessage defaultMessage="Next" description="Evaluation review > assessments > next button" />
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewAssessmentsSection.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentsSection.tsx

```typescript
import { first } from 'lodash';

import {
  Button,
  CheckCircleIcon,
  PencilIcon,
  Spacer,
  SparkleDoubleIcon,
  Typography,
  useDesignSystemTheme,
  Tooltip,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { EvaluationsReviewAssessmentTag } from './EvaluationsReviewAssessmentTag';
import { EvaluationsReviewAssessments } from './EvaluationsReviewAssessments';
import { EvaluationsReviewAssessmentsConfirmButton } from './EvaluationsReviewAssessmentsConfirmButton';
import {
  KnownEvaluationResultAssessmentName,
  getOrderedAssessments,
  isEvaluationResultReviewedAlready,
  KnownEvaluationResponseAssessmentNames,
  isAssessmentMissing,
} from './GenAiEvaluationTracesReview.utils';
import { VerticalBar } from './VerticalBar';
import type {
  AssessmentInfo,
  RunEvaluationResultAssessment,
  RunEvaluationResultAssessmentDraft,
  RunEvaluationTracesDataEntry,
} from '../types';

/**
 * Displays section with a list of evaluation assessments: overall and detailed.
 */
const EvaluationsReviewSingleRunAssessmentsSection = ({
  evaluationResult,
  onUpsertAssessment,
  onSavePendingAssessments,
  onClickNext,
  onResetPendingAssessments,
  isNextAvailable,
  overridingExistingReview = false,
  pendingAssessments = [],
  setOverridingExistingReview,
  isReadOnly = false,
  assessmentInfos,
}: {
  evaluationResult: RunEvaluationTracesDataEntry;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  onSavePendingAssessments: () => Promise<void>;
  onClickNext?: () => void;
  onResetPendingAssessments?: () => void;
  isNextAvailable?: boolean;
  overridingExistingReview?: boolean;
  pendingAssessments?: RunEvaluationResultAssessmentDraft[];
  setOverridingExistingReview: (override: boolean) => void;
  isReadOnly?: boolean;
  assessmentInfos: AssessmentInfo[];
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  if (!evaluationResult) {
    return null;
  }
  const currentOverallAssessment = first(evaluationResult.overallAssessments);
  const rootCauseAssessmentName = currentOverallAssessment?.rootCauseAssessment?.assessmentName;
  const rootCauseAssessment = rootCauseAssessmentName
    ? first(evaluationResult?.responseAssessmentsByName[rootCauseAssessmentName])
    : undefined;

  const toBeReviewed =
    !isReadOnly && (!isEvaluationResultReviewedAlready(evaluationResult) || overridingExistingReview);

  const reopenReviewTooltip = intl.formatMessage({
    defaultMessage: 'Reopen review',
    description: 'Evaluation review > assessments > reopen review tooltip',
  });

  const overallAssessmentsByName: [string, RunEvaluationResultAssessment[]][] = [
    [KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT, evaluationResult.overallAssessments],
  ];

  const overallAssessmentInfo = assessmentInfos.find(
    (info) => info.name === KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT,
  );

  return (
    <div css={{ width: '100%' }}>
      <div css={{ width: '100%', paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }}>
        <div
          css={{
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.spacing.md,
            paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
          }}
        >
          {overallAssessmentInfo && (
            <div css={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
              <SparkleDoubleIcon color="ai" />
              <Typography.Text bold>
                <FormattedMessage
                  defaultMessage="Overall assessment:"
                  description="Evaluation review > assessments > overall assessment > title"
                />
              </Typography.Text>
              {/* TODO: make overall assessment editable */}
              <EvaluationsReviewAssessmentTag
                assessment={currentOverallAssessment}
                aria-label={KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT}
                disableJudgeTypeIcon={isAssessmentMissing(currentOverallAssessment)}
                assessmentInfo={overallAssessmentInfo}
                type="assessment-value"
              />
            </div>
          )}
          <EvaluationsReviewAssessments
            assessmentsType="overall"
            assessmentsByName={overallAssessmentsByName}
            rootCauseAssessment={rootCauseAssessment}
            onUpsertAssessment={onUpsertAssessment}
            allowEditing={toBeReviewed}
            alwaysExpanded
            options={[KnownEvaluationResultAssessmentName.OVERALL_ASSESSMENT]}
            assessmentInfos={assessmentInfos}
          />
          <div
            css={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.general.borderRadiusBase,
              padding: theme.spacing.sm,
            }}
          >
            <Typography.Text bold>
              <FormattedMessage
                defaultMessage="Detailed assessments"
                description="Evaluation review > assessments > detailed assessments > title"
              />
            </Typography.Text>
            <Spacer size="sm" />
            <EvaluationsReviewAssessments
              assessmentsType="response"
              assessmentsByName={getOrderedAssessments(evaluationResult.responseAssessmentsByName)}
              onUpsertAssessment={onUpsertAssessment}
              allowEditing={toBeReviewed}
              allowMoreThanOne
              options={KnownEvaluationResponseAssessmentNames}
              assessmentInfos={assessmentInfos}
            />
          </div>
        </div>
        <div
          css={{
            position: 'sticky',
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.spacing.md,
            top: 0,
            display: 'flex',
            justifyContent: 'space-between',
            gap: theme.spacing.sm,
            zIndex: theme.options.zIndexBase,
          }}
        >
          <div>
            {!toBeReviewed && !isReadOnly && (
              <div
                css={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.general.borderRadiusBase,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                }}
              >
                <CheckCircleIcon css={{ color: theme.colors.textValidationSuccess }} />
                <Typography.Hint>
                  <FormattedMessage
                    defaultMessage="Reviewed"
                    description="Evaluation review > assessments > already reviewed indicator"
                  />
                </Typography.Hint>
                <Tooltip
                  componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluations_components_evaluationsreviewassessmentssection.tsx_149"
                  content={reopenReviewTooltip}
                >
                  <Button
                    aria-label={reopenReviewTooltip}
                    componentId="mlflow.evaluations_review.reopen_review_button"
                    size="small"
                    icon={<PencilIcon />}
                    onClick={() => setOverridingExistingReview(true)}
                  />
                </Tooltip>
              </div>
            )}
          </div>
          <div css={{ flex: 1 }} />
          {pendingAssessments.length > 0 && (
            <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <FormattedMessage
                defaultMessage="{pendingCount} pending {pendingCount, plural, =1 {change} other {changes}}"
                description="Evaluation review > assessments > pending entries counter"
                values={{ pendingCount: pendingAssessments.length }}
              />
              <Button
                componentId="mlflow.evaluations_review.discard_pending_assessments_button"
                onClick={onResetPendingAssessments}
              >
                <FormattedMessage
                  defaultMessage="Discard"
                  description="Evaluation review > assessments > discard pending assessments button label"
                />
              </Button>
            </div>
          )}
          <EvaluationsReviewAssessmentsConfirmButton
            onSave={async () => {
              // Save the pending assessments
              await onSavePendingAssessments();
              // We can reset the override review flag now
              setOverridingExistingReview(false);
            }}
            containsOverallAssessment={Boolean(currentOverallAssessment)}
            isNextResultAvailable={Boolean(isNextAvailable)}
            onClickNext={onClickNext}
            toBeReviewed={toBeReviewed}
            hasPendingAssessments={pendingAssessments.length > 0}
            overridingExistingReview={overridingExistingReview}
            onCancelOverride={() => setOverridingExistingReview(false)}
          />
        </div>
      </div>
      <Spacer size="md" />
    </div>
  );
};

/**
 * Displays section with a list of evaluation assessments: overall and detailed.
 */
export const EvaluationsReviewAssessmentsSection = ({
  evaluationResult,
  otherEvaluationResult,
  onUpsertAssessment,
  onSavePendingAssessments,
  onClickNext,
  onResetPendingAssessments,
  isNextAvailable,
  overridingExistingReview = false,
  pendingAssessments = [],
  setOverridingExistingReview,
  isReadOnly = false,
  assessmentInfos,
}: {
  evaluationResult?: RunEvaluationTracesDataEntry;
  otherEvaluationResult?: RunEvaluationTracesDataEntry;
  onUpsertAssessment: (assessment: RunEvaluationResultAssessmentDraft) => void;
  onSavePendingAssessments: () => Promise<void>;
  onClickNext?: () => void;
  onResetPendingAssessments?: () => void;
  isNextAvailable?: boolean;
  overridingExistingReview?: boolean;
  pendingAssessments?: RunEvaluationResultAssessmentDraft[];
  setOverridingExistingReview: (override: boolean) => void;
  isReadOnly?: boolean;
  assessmentInfos: AssessmentInfo[];
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        width: '100%',
        gap: theme.spacing.sm,
      }}
    >
      {evaluationResult && (
        <EvaluationsReviewSingleRunAssessmentsSection
          evaluationResult={evaluationResult}
          onUpsertAssessment={onUpsertAssessment}
          onSavePendingAssessments={onSavePendingAssessments}
          onClickNext={onClickNext}
          onResetPendingAssessments={onResetPendingAssessments}
          isNextAvailable={isNextAvailable}
          overridingExistingReview={overridingExistingReview}
          setOverridingExistingReview={setOverridingExistingReview}
          pendingAssessments={pendingAssessments}
          isReadOnly={isReadOnly}
          assessmentInfos={assessmentInfos}
        />
      )}
      {otherEvaluationResult && (
        <>
          <VerticalBar />
          <EvaluationsReviewSingleRunAssessmentsSection
            evaluationResult={otherEvaluationResult}
            onUpsertAssessment={onUpsertAssessment}
            onSavePendingAssessments={onSavePendingAssessments}
            onClickNext={onClickNext}
            onResetPendingAssessments={onResetPendingAssessments}
            isNextAvailable={isNextAvailable}
            overridingExistingReview={overridingExistingReview}
            setOverridingExistingReview={setOverridingExistingReview}
            pendingAssessments={pendingAssessments}
            isReadOnly
            assessmentInfos={assessmentInfos}
          />
        </>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

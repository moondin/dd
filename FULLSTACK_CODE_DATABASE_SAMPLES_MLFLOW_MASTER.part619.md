---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 619
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 619 of 991)

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

---[FILE: EvaluationsReviewAssessmentTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentTag.tsx
Signals: React

```typescript
import { isNil, isString } from 'lodash';
import { useMemo } from 'react';

import {
  PencilIcon,
  SparkleDoubleIcon,
  UserIcon,
  useDesignSystemTheme,
  Button,
  CheckCircleIcon,
  XCircleIcon,
  WarningIcon,
  XCircleFillIcon,
  HoverCard,
  Typography,
  InfoSmallIcon,
  BracketsXIcon,
  DangerIcon,
} from '@databricks/design-system';
import type { ThemeType } from '@databricks/design-system';
import type { IntlShape } from '@databricks/i18n';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import {
  KnownEvaluationResultAssessmentValueLabel,
  KnownEvaluationResultAssessmentValueMapping,
  getEvaluationResultAssessmentValue,
  hasBeenEditedByHuman,
  KnownEvaluationResultAssessmentStringValue,
  KnownEvaluationResultAssessmentValueMissingTooltip,
  ASSESSMENTS_DOC_LINKS,
  getJudgeMetricsLink,
} from './GenAiEvaluationTracesReview.utils';
import type { AssessmentInfo, RunEvaluationResultAssessment } from '../types';
import {
  getEvaluationResultAssessmentBackgroundColor,
  getEvaluationResultIconColor,
  getEvaluationResultTextColor,
} from '../utils/Colors';
import { displayFloat } from '../utils/DisplayUtils';
import { useMarkdownConverter } from '../utils/MarkdownUtils';

export const isAssessmentPassing = (
  assessmentInfo: AssessmentInfo,
  assessmentValue?: string | number | boolean | null,
) => {
  if (!isNil(assessmentValue)) {
    if (assessmentInfo.dtype === 'pass-fail') {
      if (assessmentValue === KnownEvaluationResultAssessmentStringValue.YES) {
        return true;
      } else if (assessmentValue === KnownEvaluationResultAssessmentStringValue.NO) {
        return false;
      }
    } else if (assessmentInfo.dtype === 'boolean') {
      return assessmentValue === true;
    }
  }
  return undefined;
};

function getAssessmentTagDisplayValue(
  theme: ThemeType,
  intl: IntlShape,
  type: 'value' | 'assessment-value',
  assessmentInfo: AssessmentInfo,
  editedByHuman: boolean,
  assessment?: RunEvaluationResultAssessment,
  isRootCauseAssessment?: boolean,
): { tagText: JSX.Element | string; icon: JSX.Element; fullTagText?: JSX.Element | string | undefined } {
  let tagText: string | JSX.Element = '';
  let fullTagText: string | JSX.Element | undefined = undefined;
  let icon: JSX.Element = <></>;

  const errorDisplayValue = {
    tagText: (
      <FormattedMessage defaultMessage="Error" description="Error assessment status in the evaluations table." />
    ),
    icon: <DangerIcon css={{ color: theme.colors.textValidationWarning }} />,
  };

  const nullDisplayValue = {
    tagText: (
      <span css={{ fontStyle: 'italic' }}>
        <FormattedMessage defaultMessage="null" description="Null value in the evaluations table." />
      </span>
    ),
    icon: <WarningIcon css={{ color: theme.colors.grey400 }} />,
  };

  const value = assessment ? getEvaluationResultAssessmentValue(assessment) : undefined;
  const isError = Boolean(assessment?.errorMessage);

  if (isError) {
    return errorDisplayValue;
  }

  if (assessmentInfo.dtype === 'pass-fail' || assessmentInfo.dtype === 'boolean') {
    const isPassing = isAssessmentPassing(assessmentInfo, value);
    let displayValueText = '';
    if (assessmentInfo.dtype === 'pass-fail') {
      // Known assessments are all pass / fail.
      if (isPassing === true) {
        displayValueText = intl.formatMessage({
          defaultMessage: 'Pass',
          description: 'Passing evaluation status in the evaluations table.',
        });
      } else if (isPassing === false) {
        displayValueText = intl.formatMessage({
          defaultMessage: 'Fail',
          description: 'Failing evaluation status in the evaluations table.',
        });
      } else {
        return nullDisplayValue;
      }
    } else if (isPassing === true) {
      displayValueText = intl.formatMessage({
        defaultMessage: 'True',
        description: 'True value in the evaluations table.',
      });
    } else if (isPassing === false) {
      displayValueText = intl.formatMessage({
        defaultMessage: 'False',
        description: 'False value in the evaluations table.',
      });
    } else {
      return nullDisplayValue;
    }

    const iconColor = getEvaluationResultIconColor(theme, assessmentInfo, assessment);
    icon =
      isPassing === true ? (
        <CheckCircleIcon
          css={{
            color: iconColor,
          }}
        />
      ) : isPassing === false ? (
        isRootCauseAssessment ? (
          <XCircleFillIcon
            css={{
              color: iconColor,
            }}
          />
        ) : (
          <XCircleIcon
            css={{
              color: iconColor,
            }}
          />
        )
      ) : (
        <WarningIcon
          css={{
            color: iconColor,
          }}
        />
      );

    if (type === 'assessment-value') {
      const knownMapping = KnownEvaluationResultAssessmentValueMapping[assessmentInfo.name];

      if (knownMapping) {
        const messageDescriptor = value
          ? knownMapping[value.toString()] ?? knownMapping[KnownEvaluationResultAssessmentStringValue.YES]
          : knownMapping[KnownEvaluationResultAssessmentStringValue.YES];
        if (messageDescriptor) {
          tagText = <FormattedMessage {...messageDescriptor} values={{ value }} />;
        }
      } else {
        tagText = (
          <>
            {assessmentInfo.displayName}: {value}
          </>
        );
      }
    } else if (type === 'value') {
      if (isNil(isPassing)) {
        tagText = <span css={{ fontStyle: 'italic' }}>{displayValueText}</span>;
      } else {
        tagText = displayValueText;
      }
    }
  } else if (assessmentInfo.dtype === 'numeric') {
    const roundedValue = !isNil(value) ? displayFloat(value as number | undefined | null) : value;

    if (type === 'assessment-value') {
      tagText = (
        <>
          {assessmentInfo.displayName}: {roundedValue}
        </>
      );
      fullTagText = (
        <>
          {assessmentInfo.displayName}: {value}
        </>
      );
    } else {
      if (isNil(roundedValue)) {
        return nullDisplayValue;
      }
      tagText = `${roundedValue}`;
      fullTagText = `${value}`;
    }
  } else {
    // Wrap nulls in italics.
    if (isNil(value)) {
      return nullDisplayValue;
    }
    const valueElement = <>{String(value)}</>;
    if (type === 'assessment-value') {
      if (isNil(value)) {
        tagText = <>{assessmentInfo.displayName}</>;
      } else {
        tagText = (
          <>
            {assessmentInfo.displayName}: {valueElement}
          </>
        );
      }
    } else {
      tagText = valueElement;
    }
  }
  return { tagText, icon, fullTagText };
}

export const EvaluationsReviewAssessmentTag = ({
  assessment,
  onEdit,
  active = false,
  disableJudgeTypeIcon,
  showRationaleInTooltip = false,
  showPassFailText = false,
  hideAssessmentName = false,
  iconOnly = false,
  disableTooltip = false,
  isRootCauseAssessment,
  assessmentInfo,
  type,
  count,
}: {
  assessment?: RunEvaluationResultAssessment;
  onEdit?: () => void;
  active?: boolean;
  disableJudgeTypeIcon?: boolean;
  showRationaleInTooltip?: boolean;
  showPassFailText?: boolean;
  hideAssessmentName?: boolean;
  iconOnly?: boolean;
  disableTooltip?: boolean;
  isRootCauseAssessment?: boolean;
  assessmentInfo: AssessmentInfo;
  type: 'value' | 'assessment-value';
  count?: number;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const value = assessment ? getEvaluationResultAssessmentValue(assessment) : undefined;
  const isPassing = useMemo(() => isAssessmentPassing(assessmentInfo, value), [value, assessmentInfo]);

  const iconColor = getEvaluationResultIconColor(theme, assessmentInfo, assessment);
  const textColor = getEvaluationResultTextColor(theme, assessmentInfo, assessment);

  let errorMessage: string | undefined = undefined;
  if (
    assessment?.errorMessage ||
    (isPassing === undefined && assessment && KnownEvaluationResultAssessmentValueMissingTooltip[assessment.name])
  ) {
    errorMessage =
      assessment.errorMessage ||
      intl.formatMessage(KnownEvaluationResultAssessmentValueMissingTooltip[assessment.name]);
  }

  const knownValueLabel = assessment ? KnownEvaluationResultAssessmentValueLabel[assessment.name] : undefined;
  const assessmentTitle = useMemo(
    () => (knownValueLabel ? intl.formatMessage(knownValueLabel) : assessment?.name),
    [assessment, knownValueLabel, intl],
  );
  const learnMoreLink = useMemo(
    () => (assessment ? getJudgeMetricsLink(ASSESSMENTS_DOC_LINKS[assessment.name]) : undefined),
    [assessment],
  );

  const { makeHTML } = useMarkdownConverter();

  const rationaleHTML = useMemo(() => {
    const rationale = assessment?.rationale;
    return isString(rationale) ? makeHTML(rationale) : undefined;
  }, [assessment, makeHTML]);

  const editedByHuman = useMemo(() => !isNil(assessment) && hasBeenEditedByHuman(assessment), [assessment]);

  const { tagText, icon, fullTagText } = useMemo(
    () =>
      getAssessmentTagDisplayValue(theme, intl, type, assessmentInfo, editedByHuman, assessment, isRootCauseAssessment),
    [theme, intl, type, assessmentInfo, assessment, isRootCauseAssessment, editedByHuman],
  );

  const tagContent = (
    <>
      {tagText}
      {count && count > 1 ? ` (${count})` : ''}
    </>
  );

  // Hide human assessment tags when not defined.
  const hideTag = assessmentInfo.source?.sourceType === 'HUMAN' && !assessment?.source?.sourceId;
  if (hideTag) {
    return <></>;
  }

  const tagElement = (
    <div>
      <EvaluationsReviewTag
        iconOnly={iconOnly}
        hideAssessmentName={hideAssessmentName}
        tagContent={tagContent}
        active={active}
        icon={icon}
        iconColor={iconColor}
        textColor={textColor}
        sourceIcon={
          assessmentInfo.isCustomMetric ? (
            <BracketsXIcon />
          ) : assessment && editedByHuman ? (
            <UserIcon />
          ) : (
            <SparkleDoubleIcon />
          )
        }
        backgroundColor={getEvaluationResultAssessmentBackgroundColor(theme, assessmentInfo, assessment)}
        disableSourceTypeIcon={disableJudgeTypeIcon && !editedByHuman}
        hasBeenEditedByHuman={editedByHuman}
        onEdit={onEdit}
      />
    </div>
  );

  return (
    <>
      {disableTooltip ? (
        tagElement
      ) : (
        <HoverCard
          side="bottom"
          content={
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    css={{
                      display: 'flex',
                      gap: theme.spacing.sm,
                      alignItems: 'center',
                    }}
                  >
                    <Typography.Title
                      css={{
                        marginBottom: 0,
                      }}
                    >
                      {assessmentTitle}
                    </Typography.Title>
                    <EvaluationsReviewTag
                      iconOnly={iconOnly}
                      hideAssessmentName={hideAssessmentName}
                      tagContent={fullTagText ? fullTagText : tagContent}
                      active={active}
                      icon={icon}
                      iconColor={iconColor}
                      textColor={textColor}
                      sourceIcon={
                        assessmentInfo.isCustomMetric ? (
                          <BracketsXIcon />
                        ) : assessment && hasBeenEditedByHuman(assessment) ? (
                          <UserIcon />
                        ) : (
                          <SparkleDoubleIcon />
                        )
                      }
                      backgroundColor={getEvaluationResultAssessmentBackgroundColor(theme, assessmentInfo, assessment)}
                      disableSourceTypeIcon={disableJudgeTypeIcon}
                      hasBeenEditedByHuman={editedByHuman}
                    />
                  </div>
                  {learnMoreLink && (
                    <a
                      href={learnMoreLink}
                      target="_blank"
                      rel="noreferrer"
                      css={{
                        height: '16px',
                      }}
                    >
                      <InfoSmallIcon />
                    </a>
                  )}
                </div>
                {isRootCauseAssessment && (
                  <Typography.Hint>
                    {intl.formatMessage({
                      defaultMessage: 'This assessment is the root cause of the overall evaluation failure.',
                      description:
                        'Root cause assessment hint that explains that this assessment is causing the overall assessment to fail.',
                    })}
                  </Typography.Hint>
                )}
              </div>
              {showRationaleInTooltip && assessment && rationaleHTML && (
                <div>
                  <>
                    <span
                      css={{
                        display: 'contents',
                        '& p': {
                          marginBottom: 0,
                        },
                      }}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: rationaleHTML }}
                    />
                  </>
                </div>
              )}
              {errorMessage && (
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.xs,
                  }}
                >
                  <span
                    css={{
                      color: theme.colors.textValidationWarning,
                      fontStyle: 'italic',
                    }}
                  >
                    {errorMessage}
                  </span>
                </div>
              )}
            </div>
          }
          trigger={tagElement}
        />
      )}
    </>
  );
};

const EvaluationsReviewTag = ({
  iconOnly,
  hideAssessmentName,
  tagContent,
  active,
  sourceIcon,
  icon,
  iconColor,
  textColor,
  backgroundColor,
  disableSourceTypeIcon,
  hasBeenEditedByHuman,
  onEdit,
}: {
  iconOnly: boolean;
  hideAssessmentName: boolean;
  tagContent: string | number | true | JSX.Element | undefined;
  active?: boolean;
  sourceIcon?: JSX.Element;
  icon: JSX.Element;
  iconColor: string;
  textColor: string;
  backgroundColor: string;
  disableSourceTypeIcon?: boolean;
  hasBeenEditedByHuman?: boolean;
  onEdit?: () => void;
}) => {
  const { theme } = useDesignSystemTheme();

  const svgSize = iconOnly ? 18 : 12;

  return (
    <div
      css={{
        // TODO: Use <Badge /> when it's aligned with design
        display: 'inline-flex',
        height: iconOnly ? svgSize : 20,
        width: iconOnly ? svgSize : hideAssessmentName ? 'fit-content' : '',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: iconOnly ? '0' : onEdit ? '0 0 0 8px' : '0 8px',
        gap: theme.spacing.sm,
        borderRadius: iconOnly ? '50%' : theme.legacyBorders.borderRadiusMd,
        backgroundColor: backgroundColor,
        boxShadow: `inset 0 0 1px 1px ${active ? theme.colors.borderAccessible : 'transparent'}`,
        // border: iconOnly ? '' : `1px solid ${getEvaluationBorderColor(theme, assessment)}`,
        fontSize: theme.typography.fontSizeSm,
        svg: { width: svgSize, height: svgSize },
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {tagContent && (
        <span
          css={{
            color: textColor,
          }}
        >
          {tagContent}
        </span>
      )}
      {disableSourceTypeIcon !== true ? (
        <span
          css={{
            color: iconColor,
          }}
        >
          {sourceIcon}
        </span>
      ) : (
        <></>
      )}
      {onEdit && (
        <Button
          componentId="mlflow.evaluations_review.edit_assessment_button"
          onClick={onEdit}
          size="small"
          icon={
            <PencilIcon
              css={{
                ':hover': {
                  color: theme.colors.actionDefaultTextHover,
                },
              }}
            />
          }
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewAssessmentTooltip.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentTooltip.tsx
Signals: React

```typescript
import { first } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { Tooltip } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import {
  KnownEvaluationResultAssessmentValueMapping,
  getEvaluationResultAssessmentValue,
  isDraftAssessment,
  isEvaluationResultOverallAssessment,
  hasBeenEditedByHuman,
} from './GenAiEvaluationTracesReview.utils';
import type { RunEvaluationResultAssessment } from '../types';
import { timeSinceStr } from '../utils/DisplayUtils';

export const EvaluationsReviewAssessmentTooltip = ({
  assessmentHistory,
  children,
  disable = false,
}: React.PropsWithChildren<{
  assessmentHistory: RunEvaluationResultAssessment[];
  disable?: boolean;
}>) => {
  const intl = useIntl();

  const isOverallAssessment = useMemo(
    () => assessmentHistory.some(isEvaluationResultOverallAssessment),
    [assessmentHistory],
  );

  const [referenceDate, setReferenceDate] = useState<Date>(new Date());

  useEffect(() => {
    const updateDateInterval = setInterval(() => {
      setReferenceDate(new Date());
    }, 5000);
    return () => {
      clearInterval(updateDateInterval);
    };
  }, []);

  const getTitle = () => {
    const mostRecentEntry = first(assessmentHistory);
    if (!mostRecentEntry) {
      return undefined;
    }
    const isEditedByHuman = hasBeenEditedByHuman(mostRecentEntry);

    if (isEditedByHuman) {
      const previousRecentEntry = assessmentHistory[1];
      const previousRecentValue = previousRecentEntry
        ? getEvaluationResultAssessmentValue(previousRecentEntry)?.toString()
        : undefined;

      const timeSince = isDraftAssessment(mostRecentEntry)
        ? intl.formatMessage({
            defaultMessage: 'just now',
            description: 'Evaluation review > assessments > tooltip > just now',
          })
        : timeSinceStr(mostRecentEntry.timestamp, referenceDate);

      if (previousRecentValue) {
        const mappedValue = KnownEvaluationResultAssessmentValueMapping[mostRecentEntry.name]?.[previousRecentValue];
        const displayedPreviousValue = mappedValue ? intl.formatMessage(mappedValue) : previousRecentValue;

        return (
          <FormattedMessage
            defaultMessage="Edited {timeSince} by {source}. Original value: {value}"
            values={{
              timeSince,
              source: mostRecentEntry?.source?.sourceId,
              value: displayedPreviousValue,
            }}
            description="Evaluation review > assessments > tooltip > edited by human"
          />
        );
      }

      return (
        <FormattedMessage
          defaultMessage="Edited {timeSince} by {source}."
          values={{
            timeSince,
            source: mostRecentEntry?.source?.sourceId,
          }}
          description="Evaluation review > assessments > tooltip > edited by human"
        />
      );
    }

    if (isOverallAssessment) {
      return (
        <FormattedMessage
          defaultMessage="Overall assessment added by LLM-as-a-judge"
          description="Evaluation review > assessments > tooltip > overall assessment added by LLM-as-a-judge"
        />
      );
    }

    if (mostRecentEntry?.errorMessage) {
      return mostRecentEntry?.errorMessage;
    }

    return (
      <FormattedMessage
        defaultMessage="Assessment added by LLM-as-a-judge"
        description="Evaluation review > assessments > tooltip > assessment added by LLM-as-a-judge"
      />
    );
  };
  return (
    <Tooltip
      componentId="web-shared.genai-traces-table.evaluations-review-assessment.tooltip"
      content={disable ? undefined : <span>{getTitle()}</span>}
      side="top"
    >
      {children}
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewAssessmentUpsertForm.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentUpsertForm.test.tsx
Signals: React

```typescript
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';

import { IntlProvider } from '@databricks/i18n';

import { EvaluationsReviewAssessmentUpsertForm } from './EvaluationsReviewAssessmentUpsertForm';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(50000); // Larger timeout for heavier UI test

describe('EvaluationsReviewAssessmentUpsertForm', () => {
  const onSaveMock = jest.fn();
  const onCancelMock = jest.fn();

  const renderTestComponent = (
    overrideProps: Partial<ComponentProps<typeof EvaluationsReviewAssessmentUpsertForm>> = {},
  ) =>
    render(
      <EvaluationsReviewAssessmentUpsertForm
        onCancel={onCancelMock}
        onSave={onSaveMock}
        valueSuggestions={[]}
        {...overrideProps}
      />,
      { wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider> },
    );

  beforeEach(() => {
    onSaveMock.mockClear();
    onCancelMock.mockClear();

    // eslint-disable-next-line no-console -- TODO(FEINF-3587)
    const originalConsoleError = console.error;

    // Silence a noisy issue with Typeahead component and its '_TYPE' prop
    jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
      if (message.includes('React does not recognize the `%s` prop on a DOM element')) {
        return;
      }
      originalConsoleError(message, ...args);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('will render and display suggestions for known assessment', async () => {
    renderTestComponent({
      valueSuggestions: [
        { label: 'Pass', key: 'yes' },
        { label: 'Fail', key: 'no' },
      ],
      editedAssessment: {
        name: 'overall_assessment',
      } as any,
    });

    await userEvent.click(screen.getByPlaceholderText('Select or type an assessment'));
    await userEvent.click(screen.getByText('Pass'));
    await userEvent.click(screen.getByText('Confirm'));

    expect(onSaveMock).toHaveBeenLastCalledWith({
      assessmentName: 'overall_assessment',
      rationale: undefined,
      value: 'yes',
    });
  });

  test('will render and display suggestions for all assessments', async () => {
    renderTestComponent({
      valueSuggestions: [
        { label: 'Relevant', key: 'yes', rootAssessmentName: 'relevancy' },
        { label: 'Irrelevant', key: 'no', rootAssessmentName: 'relevancy' },
        { label: 'Correct', key: 'yes', rootAssessmentName: 'correctness' },
        { label: 'Incorrect', key: 'no', rootAssessmentName: 'correctness' },
      ],
    });

    const inputElement = screen.getByPlaceholderText('Select or type an assessment');

    await userEvent.click(inputElement);
    await userEvent.click(screen.getByText('Relevant'));
    await userEvent.click(screen.getByText('Confirm'));

    expect(onSaveMock).toHaveBeenLastCalledWith({
      assessmentName: 'relevancy',
      rationale: undefined,
      value: 'yes',
    });
  });

  test('will allow entering custom suggestion', async () => {
    renderTestComponent({
      valueSuggestions: [
        { label: 'Relevant', key: 'yes', rootAssessmentName: 'relevancy' },
        { label: 'Irrelevant', key: 'no', rootAssessmentName: 'relevancy' },
        { label: 'Correct', key: 'yes', rootAssessmentName: 'correctness' },
        { label: 'Incorrect', key: 'no', rootAssessmentName: 'correctness' },
      ],
    });

    const inputElement = screen.getByPlaceholderText('Select or type an assessment');
    const rationaleInputElement = screen.getByPlaceholderText('Add rationale (optional)');

    await userEvent.click(inputElement);
    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, 'incorrect');

    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    expect(screen.queryByText('Correct')).not.toBeInTheDocument();

    await userEvent.clear(inputElement);
    await userEvent.click(inputElement);
    await userEvent.paste('some_custom_value');

    expect(screen.getByText('Add "some_custom_value"')).toBeInTheDocument();

    await userEvent.click(rationaleInputElement);
    await userEvent.paste('test rationale');

    await userEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenLastCalledWith({
        assessmentName: 'some_custom_value',
        value: true,
        rationale: 'test rationale',
      });
    });
  });

  test('will disallow entering custom suggestion on readonly fields', async () => {
    renderTestComponent({
      editedAssessment: {
        stringValue: 'yes',
        name: 'relevancy',
      } as any,
      valueSuggestions: [
        { label: 'Relevant', key: 'yes', rootAssessmentName: 'relevancy' },
        { label: 'Irrelevant', key: 'no', rootAssessmentName: 'relevancy' },
      ],
      readOnly: true,
    });

    const inputElement = screen.getByPlaceholderText('Select or type an assessment');

    expect(inputElement).toHaveAttribute('readonly');

    // Attempt to clear the input should throw an error
    await expect(() => userEvent.clear(inputElement)).rejects.toThrow();
  });

  test('will display and repeat existing rationale', async () => {
    renderTestComponent({
      valueSuggestions: [
        { label: 'Pass', key: 'yes' },
        { label: 'Fail', key: 'no' },
      ],
      editedAssessment: {
        name: 'overall_assessment',
        rationale: 'test rationale',
        stringValue: 'yes',
      } as any,
    });

    expect(screen.getByPlaceholderText('Add rationale (optional)')).toHaveValue('test rationale');

    await userEvent.click(screen.getByText('Confirm'));

    expect(onSaveMock).toHaveBeenLastCalledWith({
      assessmentName: 'overall_assessment',
      rationale: 'test rationale',
      value: 'yes',
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: EvaluationsReviewAssessmentUpsertForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/genai-traces-table/components/EvaluationsReviewAssessmentUpsertForm.tsx
Signals: React

```typescript
import { useMemo, useState } from 'react';

import {
  Button,
  Input,
  Spacer,
  TypeaheadComboboxInput,
  TypeaheadComboboxMenu,
  TypeaheadComboboxMenuItem,
  TypeaheadComboboxRoot,
  useComboboxState,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';

import { getEvaluationResultAssessmentValue } from './GenAiEvaluationTracesReview.utils';
import type {
  AssessmentDropdownSuggestionItem,
  RunEvaluationResultAssessment,
  RunEvaluationResultAssessmentDraft,
} from '../types';

/**
 * A form capable of adding or editing an assessment.
 */
export const EvaluationsReviewAssessmentUpsertForm = ({
  editedAssessment,
  valueSuggestions,
  onSave,
  onCancel,
  readOnly = false,
}: {
  editedAssessment?: RunEvaluationResultAssessment | RunEvaluationResultAssessmentDraft;
  valueSuggestions: AssessmentDropdownSuggestionItem[];
  onSave: (values: { value: string | boolean; rationale?: string; assessmentName?: string }) => void;
  onCancel: () => void;
  readOnly?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const [rationale, setRationale] = useState<string | undefined>(() => {
    return editedAssessment?.rationale || undefined;
  });

  const [inputValue, setInputValue] = useState('');

  const [formValue, setFormValue] = useState<AssessmentDropdownSuggestionItem | undefined>(() => {
    // If we're editing an existing assessment, find relevant suggestion and use it as a form value
    if (editedAssessment) {
      const value = getEvaluationResultAssessmentValue(editedAssessment)?.toString();
      if (value) {
        return valueSuggestions.find((item) => item.key === value) ?? { key: value, label: value };
      }

      // Special case: if there's no value at all but we use a draft assessment, use assessment name
      return { key: editedAssessment.name, label: editedAssessment.name };
    }

    return { key: '', label: '' };
  });

  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const filteredSuggestions = useMemo(
    () => valueSuggestions.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase())),
    [inputValue, valueSuggestions],
  );

  // Show either all or filtered suggestions
  const visibleSuggestions = showAllSuggestions ? valueSuggestions : filteredSuggestions;

  // The combobox is displayed if there are suggestions or a custom value is provided
  const displayCombobox = inputValue || visibleSuggestions.length > 0;

  const comboboxState = useComboboxState<AssessmentDropdownSuggestionItem>({
    componentId:
      'codegen_mlflow_app_src_experiment-tracking_components_evaluations_components_evaluationsreviewassessmentupsertform.tsx_124',
    allItems: valueSuggestions,
    items: visibleSuggestions,
    setItems: () => {},
    setInputValue: (val) => {
      setShowAllSuggestions(false);
      setInputValue(val);
    },
    multiSelect: false,
    allowNewValue: true,
    itemToString: (item) => (item ? item.label : ''),
    formValue,
    initialSelectedItem: formValue,
    initialInputValue: formValue?.label ?? '',
    formOnChange: (item) => {
      // If no changes made to the currently selected item, do nothing.
      // This is required, otherwise TypeaheadCombobox will replace object with plain string
      if (formValue?.label === item) {
        return;
      }

      // If provided custom value, construct a new item
      if (typeof item === 'string') {
        setFormValue({ key: inputValue ?? '', label: inputValue ?? '' });
        return;
      }

      // If used a dropdown option, set it as a form value
      setFormValue(item);
    },
    onIsOpenChange(isOpen) {
      if (isOpen) {
        // After uses clicks on the combobox, we're displaying all suggestions
        setShowAllSuggestions(true);
      }
    },
  });

  const addNewElementLabel = intl.formatMessage(
    {
      defaultMessage: 'Add "{label}"',
      description: 'Evaluation review > assessments > add new custom value element',
    },
    {
      label: inputValue,
    },
  );

  return (
    <div>
      <TypeaheadComboboxRoot comboboxState={comboboxState}>
        <TypeaheadComboboxInput
          readOnly={readOnly}
          css={{ width: 300, backgroundColor: theme.colors.backgroundPrimary }}
          placeholder={intl.formatMessage({
            defaultMessage: 'Select or type an assessment',
            description: 'Evaluation review > assessments > combobox placeholder',
          })}
          onKeyUp={(e) => {
            // Close menu on Enter if no item is highlighted. We need to use onKeyUp to avoid conflicts with Downshift
            if (comboboxState.highlightedIndex === -1 && e.key === 'Enter') {
              comboboxState.closeMenu();
            }
          }}
          comboboxState={comboboxState}
          formOnChange={(val) => {
            setFormValue(val);
          }}
        />
        {displayCombobox && (
          <TypeaheadComboboxMenu comboboxState={comboboxState} emptyText={addNewElementLabel} matchTriggerWidth>
            {visibleSuggestions.map((item, index) => (
              <TypeaheadComboboxMenuItem
                key={`${item.key}-${index}`}
                item={item}
                index={index}
                comboboxState={comboboxState}
                isDisabled={item?.disabled || false}
              >
                {item.label}
              </TypeaheadComboboxMenuItem>
            ))}
          </TypeaheadComboboxMenu>
        )}
      </TypeaheadComboboxRoot>
      <Spacer size="sm" />
      <div css={{ backgroundColor: theme.colors.backgroundPrimary, borderRadius: theme.general.borderRadiusBase }}>
        <Input.TextArea
          componentId="codegen_mlflow_app_src_experiment-tracking_components_evaluations_components_evaluationsreviewassessmentupsertform.tsx_160"
          autoSize
          value={rationale ?? ''}
          onChange={(e) => setRationale(e.target.value)}
          placeholder={intl.formatMessage({
            defaultMessage: 'Add rationale (optional)',
            description: 'Evaluation review > assessments > rationale input placeholder',
          })}
        />
      </div>
      <Spacer size="sm" />
      <div css={{ display: 'flex', gap: theme.spacing.xs }}>
        <Button
          size="small"
          type="primary"
          componentId="mlflow.evaluations_review.confirm_edited_assessment_button"
          onClick={() => {
            // Assert form value
            if (!formValue) {
              return;
            }
            // Select assessment name either:
            // - from general suggestion when having multiple
            // - from already existing assessment when editing
            // - from custom value when provided
            const targetAssessmentName = formValue.rootAssessmentName ?? editedAssessment?.name ?? formValue.key;

            // Either use value or set it to "true" if we're using plain custom assessment name
            const value = targetAssessmentName !== formValue.key ? formValue.key : true;
            onSave({ value, rationale, assessmentName: targetAssessmentName });
          }}
          disabled={!formValue?.key}
        >
          <FormattedMessage
            defaultMessage="Confirm"
            description="Evaluation review > assessments > confirm assessment button label"
          />
        </Button>
        <Button
          size="small"
          type="tertiary"
          componentId="mlflow.evaluations_review.cancel_edited_assessment_button"
          onClick={onCancel}
        >
          <FormattedMessage
            defaultMessage="Cancel"
            description="Evaluation review > assessments > cancel assessment button label"
          />
        </Button>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````

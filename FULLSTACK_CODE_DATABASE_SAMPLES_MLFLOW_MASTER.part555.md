---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 555
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 555 of 991)

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

---[FILE: scorerCardUtils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/scorerCardUtils.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { getFormValuesFromScorer } from './scorerCardUtils';
import type { LLMScorer, CustomCodeScorer } from './types';
import { TEMPLATE_INSTRUCTIONS_MAP } from './prompts';

describe('scorerCardUtils', () => {
  describe('getFormValuesFromScorer', () => {
    describe('Golden Path - Successful Operations', () => {
      it('should successfully convert LLM scorer with all properties to form data', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Test LLM Scorer',
          type: 'llm',
          sampleRate: 75,
          filterString: 'status == "success"',
          llmTemplate: 'Correctness',
          guidelines: ['Be objective', 'Consider context', 'Rate consistently'],
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result).toEqual({
          llmTemplate: 'Correctness',
          name: 'Test LLM Scorer',
          sampleRate: 75,
          code: '',
          scorerType: 'llm',
          guidelines: 'Be objective\nConsider context\nRate consistently',
          instructions: TEMPLATE_INSTRUCTIONS_MAP['Correctness'],
          filterString: 'status == "success"',
          model: '',
          disableMonitoring: undefined,
          isInstructionsJudge: undefined,
        });
      });

      it('should successfully convert custom code scorer with all properties to form data', () => {
        // Arrange
        const customCodeScorer: CustomCodeScorer = {
          name: 'Test Custom Scorer',
          type: 'custom-code',
          sampleRate: 50,
          filterString: 'model_name == "gpt-4"',
          code: 'def evaluate(input, output):\n    return {"score": 1.0}',
          callSignature: '',
          originalFuncName: '',
        };

        // Act
        const result = getFormValuesFromScorer(customCodeScorer);

        // Assert
        expect(result).toEqual({
          llmTemplate: '',
          name: 'Test Custom Scorer',
          sampleRate: 50,
          code: 'def evaluate(input, output):\n    return {"score": 1.0}',
          scorerType: 'custom-code',
          guidelines: '',
          instructions: '',
          filterString: 'model_name == "gpt-4"',
          model: '',
        });
      });

      it('should convert LLM scorer with minimal properties to form data', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Minimal LLM Scorer',
          type: 'llm',
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result).toEqual({
          llmTemplate: '',
          name: 'Minimal LLM Scorer',
          sampleRate: 0,
          code: '',
          scorerType: 'llm',
          guidelines: '',
          instructions: '',
          filterString: '',
          model: '',
        });
      });

      it('should convert custom code scorer with minimal properties to form data', () => {
        // Arrange
        const customCodeScorer: CustomCodeScorer = {
          name: 'Minimal Custom Scorer',
          type: 'custom-code',
          code: 'return {"score": 0.5}',
          callSignature: '',
          originalFuncName: '',
        };

        // Act
        const result = getFormValuesFromScorer(customCodeScorer);

        // Assert
        expect(result).toEqual({
          llmTemplate: '',
          name: 'Minimal Custom Scorer',
          sampleRate: 0,
          code: 'return {"score": 0.5}',
          scorerType: 'custom-code',
          guidelines: '',
          instructions: '',
          filterString: '',
          model: '',
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle LLM scorer with empty name', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: '',
          type: 'llm',
          sampleRate: 25,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.name).toBe('');
        expect(result.scorerType).toBe('llm');
        expect(result.sampleRate).toBe(25);
      });

      it('should handle custom code scorer with empty code', () => {
        // Arrange
        const customCodeScorer: CustomCodeScorer = {
          name: 'Empty Code Scorer',
          type: 'custom-code',
          code: '',
          callSignature: '',
          originalFuncName: '',
        };

        // Act
        const result = getFormValuesFromScorer(customCodeScorer);

        // Assert
        expect((result as any).code).toBe('');
        expect(result.name).toBe('Empty Code Scorer');
        expect(result.scorerType).toBe('custom-code');
      });

      it('should handle LLM scorer with empty guidelines array', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'No Guidelines Scorer',
          type: 'llm',
          guidelines: [],
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).guidelines).toBe('');
        expect(result.scorerType).toBe('llm');
      });

      it('should handle LLM scorer with single guideline', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Single Guideline Scorer',
          type: 'llm',
          guidelines: ['Single guideline'],
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).guidelines).toBe('Single guideline');
      });

      it('should handle scorer with zero sample rate', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Zero Sample Rate Scorer',
          type: 'llm',
          sampleRate: 0,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.sampleRate).toBe(0);
      });

      it('should handle scorer with undefined sample rate', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Undefined Sample Rate Scorer',
          type: 'llm',
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.sampleRate).toBe(0);
      });

      it('should handle scorer with undefined filter string', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'No Filter Scorer',
          type: 'llm',
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.filterString).toBe('');
      });

      it('should handle LLM scorer with undefined built-in scorer class', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'No Built-in Class Scorer',
          type: 'llm',
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).llmTemplate).toBe('');
      });

      it('should handle guidelines with newline characters properly', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Multiline Guidelines Scorer',
          type: 'llm',
          guidelines: ['First line\nwith newline', 'Second line', 'Third\nmultiline\nguideline'],
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).guidelines).toBe('First line\nwith newline\nSecond line\nThird\nmultiline\nguideline');
      });

      it('should handle negative sample rate', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Negative Sample Rate',
          type: 'llm',
          sampleRate: -10,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.sampleRate).toBe(-10);
      });

      it('should handle sample rate above 100', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'High Sample Rate',
          type: 'llm',
          sampleRate: 150,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.sampleRate).toBe(150);
      });

      it('should handle non-integer sample rate', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Decimal Sample Rate',
          type: 'llm',
          sampleRate: 23.5,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.sampleRate).toBe(23.5);
      });
    });

    describe('Error Conditions', () => {
      it('should handle null name gracefully', () => {
        // Arrange
        const llmScorer = {
          name: null as any,
          type: 'llm' as const,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.name).toBe('');
      });

      it('should handle undefined name gracefully', () => {
        // Arrange
        const llmScorer = {
          name: undefined as any,
          type: 'llm' as const,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.name).toBe('');
      });

      it('should handle null guidelines array gracefully', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Null Guidelines Scorer',
          type: 'llm',
          guidelines: null as any,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).guidelines).toBe('');
      });

      it('should handle undefined guidelines array gracefully', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Undefined Guidelines Scorer',
          type: 'llm',
          guidelines: undefined,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).guidelines).toBe('');
      });

      it('should handle null filter string gracefully', () => {
        // Arrange
        const llmScorer = {
          name: 'Null Filter Scorer',
          type: 'llm' as const,
          filterString: null as any,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.filterString).toBe('');
      });

      it('should handle null built-in scorer class gracefully', () => {
        // Arrange
        const llmScorer: LLMScorer = {
          name: 'Null Built-in Class Scorer',
          type: 'llm',
          llmTemplate: null as any,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect((result as any).llmTemplate).toBe('');
      });

      it('should handle null code for custom scorer gracefully', () => {
        // Arrange
        const customCodeScorer = {
          name: 'Null Code Scorer',
          type: 'custom-code' as const,
          code: null as any,
          callSignature: '',
          originalFuncName: '',
        };

        // Act
        const result = getFormValuesFromScorer(customCodeScorer);

        // Assert
        expect((result as any).code).toBe('');
      });

      it('should handle undefined code for custom scorer gracefully', () => {
        // Arrange
        const customCodeScorer = {
          name: 'Undefined Code Scorer',
          type: 'custom-code' as const,
          code: undefined as any,
          callSignature: '',
          originalFuncName: '',
        };

        // Act
        const result = getFormValuesFromScorer(customCodeScorer);

        // Assert
        expect((result as any).code).toBe('');
      });

      it('should handle null sample rate gracefully', () => {
        // Arrange
        const llmScorer = {
          name: 'Null Sample Rate Scorer',
          type: 'llm' as const,
          sampleRate: null as any,
        };

        // Act
        const result = getFormValuesFromScorer(llmScorer);

        // Assert
        expect(result.sampleRate).toBe(0);
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: scorerCardUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/scorerCardUtils.tsx
Signals: React

```typescript
import React from 'react';
import { SparkleDoubleIcon, CodeIcon, CheckCircleIcon, XCircleIcon } from '@databricks/design-system';
import type { TagColors } from '@databricks/design-system';
import type { IntlShape } from '@databricks/i18n';
import type { UseFormReset } from 'react-hook-form';
import { isNil } from 'lodash';
import type { ScheduledScorer, LLMScorer, CustomCodeScorer } from './types';
import type { LLMScorerFormData } from './LLMScorerFormRenderer';
import type { CustomCodeScorerFormData } from './CustomCodeScorerFormRenderer';
import { TEMPLATE_INSTRUCTIONS_MAP } from './prompts';

export const getTypeDisplayName = (scorer: ScheduledScorer, intl: IntlShape): string => {
  if (scorer.type === 'custom-code') {
    return intl.formatMessage({
      defaultMessage: 'Custom code',
      description: 'Label for custom code scorer type',
    });
  }
  if (scorer.type === 'llm') {
    return intl.formatMessage({
      defaultMessage: 'LLM-as-a-judge',
      description: 'Label for LLM scorer type',
    });
  }
  throw new Error(`Unknown scorer type ${(scorer as any).type}`);
};

export const getTypeIcon = (scorer: ScheduledScorer): React.ReactNode => {
  if (scorer.type === 'custom-code') {
    return <CodeIcon />;
  }
  if (scorer.type === 'llm') {
    return <SparkleDoubleIcon />;
  }
  throw new Error(`Unknown scorer type ${(scorer as any).type}`);
};

export const getTypeColor = (scorer: ScheduledScorer): 'pink' | 'purple' => {
  if (scorer.type === 'custom-code') {
    return 'pink';
  }
  return 'purple';
};

const isActive = (scorer: ScheduledScorer): boolean => {
  if (isNil(scorer.sampleRate)) return false;
  return scorer.sampleRate > 0;
};

export const getStatusTag = (
  scorer: ScheduledScorer,
  intl: IntlShape,
): { text: string; color: TagColors; icon: React.ReactNode } => {
  const active = isActive(scorer);
  return {
    text: active
      ? intl.formatMessage({
          defaultMessage: 'Evaluating traces: ON',
          description: 'Status label for active scorer',
        })
      : intl.formatMessage({
          defaultMessage: 'Evaluating traces: OFF',
          description: 'Status label for stopped scorer',
        }),
    color: active ? 'lime' : 'pink',
    icon: active ? <CheckCircleIcon /> : <XCircleIcon />,
  };
};

/**
 * Helper function to derive form values from a ScheduledScorer
 * @param scorer The ScheduledScorer to derive form values from
 * @returns Form values object suitable for react-hook-form
 */
export const getFormValuesFromScorer = (scorer: ScheduledScorer): LLMScorerFormData | CustomCodeScorerFormData => {
  // For LLM scorers, get instructions from the scorer or fall back to template defaults
  let instructions = '';
  if (scorer.type === 'llm') {
    const llmScorer = scorer as LLMScorer;
    // Use stored instructions if available, otherwise look up from template map
    const templateInstructions = llmScorer.llmTemplate ? TEMPLATE_INSTRUCTIONS_MAP[llmScorer.llmTemplate] : '';
    instructions = llmScorer.instructions || templateInstructions || '';
  }

  return {
    llmTemplate: scorer.type === 'llm' ? (scorer as LLMScorer).llmTemplate || '' : '',
    name: scorer.name || '',
    sampleRate: scorer.sampleRate || 0,
    code: scorer.type === 'custom-code' ? (scorer as CustomCodeScorer).code || '' : '',
    scorerType: scorer.type,
    guidelines: scorer.type === 'llm' ? (scorer as LLMScorer).guidelines?.join('\n') || '' : '',
    instructions,
    filterString: scorer.filterString || '',
    model: scorer.type === 'llm' ? (scorer as LLMScorer).model || '' : '',
    disableMonitoring: scorer.disableMonitoring,
    isInstructionsJudge: scorer.type === 'llm' ? (scorer as LLMScorer).is_instructions_judge : undefined,
  };
};

/**
 * Helper function to sync form state with scorer prop values
 * @param scorer The ScheduledScorer to derive form values from
 * @param reset The react-hook-form reset function
 */
export const syncFormWithScorer = (
  scorer: ScheduledScorer,
  reset: UseFormReset<LLMScorerFormData | CustomCodeScorerFormData>,
): void => {
  const formValues = getFormValuesFromScorer(scorer);
  reset(formValues);
};
```

--------------------------------------------------------------------------------

---[FILE: ScorerEmptyStateRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerEmptyStateRenderer.tsx
Signals: React

```typescript
import React from 'react';
import {
  useDesignSystemTheme,
  Empty,
  Button,
  PlusIcon,
  Spacer,
  GavelIcon,
  Typography,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { COMPONENT_ID_PREFIX } from './constants';

const getProductionMonitoringDocUrl = () => {
  return 'https://mlflow.org/docs/latest/genai/eval-monitor/';
};

interface ScorerEmptyStateRendererProps {
  onAddScorerClick: () => void;
}

const ScorerEmptyStateRenderer: React.FC<ScorerEmptyStateRendererProps> = ({ onAddScorerClick }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
      }}
    >
      <Empty
        image={<GavelIcon css={{ fontSize: 48, color: theme.colors.textSecondary }} />}
        title={
          <FormattedMessage
            defaultMessage="Add a judge to your experiment to measure your GenAI app quality"
            description="Title for the empty state when no judges exist"
          />
        }
        description={
          <div css={{ maxWidth: 600, textAlign: 'center' }}>
            <Spacer size="sm" />
            <FormattedMessage
              defaultMessage="Choose from a selection of built-in LLM judges or create your own custom code based judge. {learnMore}"
              description="Description for the empty state when no judges exist"
              values={{
                learnMore: (
                  <Typography.Link
                    componentId={`${COMPONENT_ID_PREFIX}.empty-state-learn-more-link`}
                    href={getProductionMonitoringDocUrl()}
                    openInNewTab
                  >
                    <FormattedMessage
                      defaultMessage="Learn more"
                      description="Link text for production monitoring documentation"
                    />
                  </Typography.Link>
                ),
              }}
            />
          </div>
        }
        button={
          <Button
            icon={<PlusIcon />}
            componentId={`${COMPONENT_ID_PREFIX}.empty-state-add-scorer-button`}
            onClick={onAddScorerClick}
          >
            <FormattedMessage defaultMessage="New judge" description="Button text to add a judge from empty state" />
          </Button>
        }
      />
    </div>
  );
};

export default ScorerEmptyStateRenderer;
```

--------------------------------------------------------------------------------

---[FILE: ScorerFormCreateContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerFormCreateContainer.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { isRunningScorersEnabled } from '../../../common/utils/FeatureUtils';
import { useCreateScheduledScorerMutation } from './hooks/useCreateScheduledScorer';
import { convertFormDataToScheduledScorer, type ScorerFormData } from './utils/scorerTransformUtils';
import ScorerFormRenderer from './ScorerFormRenderer';
import { SCORER_FORM_MODE } from './constants';

interface ScorerFormCreateContainerProps {
  experimentId: string;
  onClose: () => void;
}

const ScorerFormCreateContainer: React.FC<ScorerFormCreateContainerProps> = ({ experimentId, onClose }) => {
  // Local error state for synchronous errors
  const [componentError, setComponentError] = useState<string | null>(null);

  // Check if running scorers feature is enabled
  const isRunningScorersFeatureEnabled = isRunningScorersEnabled();

  // Hook for creating scorer
  const createScorerMutation = useCreateScheduledScorerMutation();

  const { handleSubmit, control, reset, setValue, getValues } = useForm<ScorerFormData>({
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      scorerType: 'llm',
      name: '',
      sampleRate: 100,
      filterString: '',
      llmTemplate: 'Custom',
      model: '',
      disableMonitoring: true,
      isInstructionsJudge: true, // Custom template is an instructions judge
    },
  });

  // Watch the scorer type from form data
  const scorerType = useWatch({ control, name: 'scorerType' });

  const onFormSubmit = (data: ScorerFormData) => {
    try {
      setComponentError(null);

      // Convert form data to ScheduledScorer - this could throw synchronously
      const scheduledScorer = convertFormDataToScheduledScorer(data, undefined);

      // Create new scorer
      createScorerMutation.mutate(
        {
          experimentId,
          scheduledScorer,
        },
        {
          onSuccess: () => {
            setComponentError(null);
            onClose();
            reset();
          },
          onError: () => {
            // Keep form open when there's an error so user can see error message and retry
          },
        },
      );
    } catch (error: any) {
      setComponentError(error?.message || error?.displayMessage || 'Failed to create scorer');
    }
  };

  const handleCancel = () => {
    onClose();
    reset();
    setComponentError(null); // Clear local error state
    createScorerMutation.reset(); // Clear mutation error state
  };

  // Determine if the submit button should be disabled
  const isSubmitButtonDisabled = () => {
    if (createScorerMutation.isLoading) {
      return true;
    }

    // Disable for custom-code scorers
    if (scorerType === 'custom-code') {
      return true;
    }

    return false;
  };

  return (
    <div
      css={{
        ...(isRunningScorersFeatureEnabled ? { height: '100%' } : { maxHeight: '70vh' }),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScorerFormRenderer
        mode={SCORER_FORM_MODE.CREATE}
        handleSubmit={handleSubmit}
        onFormSubmit={onFormSubmit}
        control={control}
        setValue={setValue}
        getValues={getValues}
        scorerType={scorerType}
        mutation={createScorerMutation}
        componentError={componentError}
        handleCancel={handleCancel}
        isSubmitButtonDisabled={isSubmitButtonDisabled}
        experimentId={experimentId}
      />
    </div>
  );
};

export default ScorerFormCreateContainer;
```

--------------------------------------------------------------------------------

---[FILE: ScorerFormEditContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerFormEditContainer.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { isRunningScorersEnabled } from '../../../common/utils/FeatureUtils';
import { useUpdateScheduledScorerMutation } from './hooks/useUpdateScheduledScorer';
import { convertFormDataToScheduledScorer, type ScorerFormData } from './utils/scorerTransformUtils';
import { getFormValuesFromScorer } from './scorerCardUtils';
import ScorerFormRenderer from './ScorerFormRenderer';
import type { ScheduledScorer } from './types';
import { SCORER_FORM_MODE } from './constants';

interface ScorerFormEditContainerProps {
  experimentId: string;
  onClose: () => void;
  existingScorer: ScheduledScorer;
}

const ScorerFormEditContainer: React.FC<ScorerFormEditContainerProps> = ({ experimentId, onClose, existingScorer }) => {
  // Local error state for synchronous errors
  const [componentError, setComponentError] = useState<string | null>(null);

  // Check if running scorers feature is enabled
  const isRunningScorersFeatureEnabled = isRunningScorersEnabled();

  // Hook for updating scorer
  const updateScorerMutation = useUpdateScheduledScorerMutation();

  const { handleSubmit, control, reset, setValue, getValues, formState } = useForm<ScorerFormData>({
    mode: 'onChange', // Enable real-time validation
    defaultValues: getFormValuesFromScorer(existingScorer),
  });

  // Watch the scorer type from form data
  const scorerType = useWatch({ control, name: 'scorerType' });

  const onFormSubmit = (data: ScorerFormData) => {
    try {
      setComponentError(null);

      // Convert form data to ScheduledScorer - this could throw synchronously
      const scheduledScorer = convertFormDataToScheduledScorer(data, existingScorer);

      // Update existing scorer
      updateScorerMutation.mutate(
        {
          experimentId,
          scheduledScorers: [scheduledScorer],
        },
        {
          onSuccess: () => {
            setComponentError(null);
            onClose();
            reset();
          },
          onError: () => {
            // Keep form open when there's an error so user can see error message and retry
          },
        },
      );
    } catch (error: any) {
      setComponentError(error?.message || error?.displayMessage || 'Failed to update scorer');
    }
  };

  const handleCancel = () => {
    onClose();
    reset();
    setComponentError(null); // Clear local error state
    updateScorerMutation.reset(); // Clear mutation error state
  };

  // Determine if the submit button should be disabled
  const isSubmitButtonDisabled = () => {
    if (updateScorerMutation.isLoading) {
      return true;
    }

    // Disable for custom-code scorers
    if (scorerType === 'custom-code') {
      return true;
    }

    // In edit mode, disable if form is not dirty
    if (!formState.isDirty) {
      return true;
    }

    return false;
  };

  return (
    <div
      css={{
        ...(isRunningScorersFeatureEnabled ? { height: '100%' } : { maxHeight: '70vh' }),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScorerFormRenderer
        mode={SCORER_FORM_MODE.EDIT}
        handleSubmit={handleSubmit}
        onFormSubmit={onFormSubmit}
        control={control}
        setValue={setValue}
        getValues={getValues}
        scorerType={scorerType}
        mutation={updateScorerMutation}
        componentError={componentError}
        handleCancel={handleCancel}
        isSubmitButtonDisabled={isSubmitButtonDisabled}
        experimentId={experimentId}
      />
    </div>
  );
};

export default ScorerFormEditContainer;
```

--------------------------------------------------------------------------------

---[FILE: ScorerFormRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerFormRenderer.tsx
Signals: React

```typescript
import React, { useState, useRef, useCallback } from 'react';
import {
  type UseFormHandleSubmit,
  type Control,
  type UseFormSetValue,
  type UseFormGetValues,
  Controller,
  useWatch,
} from 'react-hook-form';
import { useDesignSystemTheme, Button, FormUI, Alert, Radio, Tag } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { isRunningScorersEnabled } from '../../../common/utils/FeatureUtils';
import {
  ModelTraceExplorerResizablePane,
  type ModelTraceExplorerResizablePaneRef,
} from '@databricks/web-shared/model-trace-explorer';
import LLMScorerFormRenderer, { type LLMScorerFormData } from './LLMScorerFormRenderer';
import CustomCodeScorerFormRenderer, { type CustomCodeScorerFormData } from './CustomCodeScorerFormRenderer';
import SampleScorerOutputPanelContainer from './SampleScorerOutputPanelContainer';
import type { ScheduledScorer } from './types';
import { getTypeDisplayName, getTypeIcon } from './scorerCardUtils';
import type { ScorerFormData } from './utils/scorerTransformUtils';
import { COMPONENT_ID_PREFIX, SCORER_FORM_MODE, type ScorerFormMode } from './constants';

interface ScorerFormRendererProps {
  mode: ScorerFormMode;
  handleSubmit: UseFormHandleSubmit<ScorerFormData>;
  onFormSubmit: (data: ScorerFormData) => void;
  control: Control<ScorerFormData>;
  setValue: UseFormSetValue<ScorerFormData>;
  getValues: UseFormGetValues<ScorerFormData>;
  scorerType: ScorerFormData['scorerType'];
  mutation: {
    isLoading: boolean;
    error: any;
  };
  componentError: string | null;
  handleCancel: () => void;
  isSubmitButtonDisabled: () => boolean;
  experimentId: string;
}

// Extracted form content component
interface ScorerFormContentProps {
  mode: ScorerFormMode;
  control: Control<ScorerFormData>;
  setValue: UseFormSetValue<ScorerFormData>;
  getValues: UseFormGetValues<ScorerFormData>;
  scorerType: ScorerFormData['scorerType'];
  mutation: {
    isLoading: boolean;
    error: any;
  };
  componentError: string | null;
}

const ScorerFormContent: React.FC<ScorerFormContentProps> = ({
  mode,
  control,
  setValue,
  getValues,
  scorerType,
  mutation,
  componentError,
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  return (
    <>
      {/* Scorer Type Selection - only show in create mode */}
      {mode === SCORER_FORM_MODE.CREATE && (
        <div>
          <FormUI.Label>
            <FormattedMessage defaultMessage="Judge type" description="Label for judge type selection" />
          </FormUI.Label>
          <Controller
            name="scorerType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Radio.Group
                {...field}
                componentId={`${COMPONENT_ID_PREFIX}.new-scorer-type.radio-group`}
                name="scorer-type"
              >
                <Radio value="llm">
                  <Tag
                    componentId={`${COMPONENT_ID_PREFIX}.llm-type-tag`}
                    color="purple"
                    icon={getTypeIcon({ type: 'llm' } as ScheduledScorer)}
                  >
                    {getTypeDisplayName({ type: 'llm' } as ScheduledScorer, intl)}
                  </Tag>
                </Radio>
                <FormUI.Hint>
                  <FormattedMessage
                    defaultMessage="Use a large language model to automatically evaluate traces."
                    description="Hint text for LLM scorer type option"
                  />
                </FormUI.Hint>

                <Radio value="custom-code">
                  <Tag
                    componentId={`${COMPONENT_ID_PREFIX}.custom-code-type-tag`}
                    color="pink"
                    icon={getTypeIcon({ type: 'custom-code' } as ScheduledScorer)}
                  >
                    {getTypeDisplayName({ type: 'custom-code' } as ScheduledScorer, intl)}
                  </Tag>
                </Radio>
                <FormUI.Hint>
                  <FormattedMessage
                    defaultMessage="Create your own judge using a Python function. Useful if your requirements are not met by LLM-as-a-judge judges."
                    description="Hint text for custom code judge type option"
                  />
                </FormUI.Hint>
              </Radio.Group>
            )}
          />
        </div>
      )}
      {/* Conditional Form Content */}
      {scorerType === 'llm' ? (
        <LLMScorerFormRenderer
          mode={mode}
          control={control as Control<LLMScorerFormData>}
          setValue={setValue as UseFormSetValue<LLMScorerFormData>}
          getValues={getValues as UseFormGetValues<LLMScorerFormData>}
        />
      ) : (
        <CustomCodeScorerFormRenderer mode={mode} control={control as Control<CustomCodeScorerFormData>} />
      )}
      {/* Error message - display with priority: local error first, then mutation error */}
      {(mutation.error || componentError) && (
        <Alert
          componentId={`${COMPONENT_ID_PREFIX}.scorer-form-error`}
          type="error"
          message={componentError || mutation.error?.message || mutation.error?.displayMessage}
          closable={false}
          css={{ marginTop: theme.spacing.md }}
        />
      )}
    </>
  );
};

const ScorerFormRenderer: React.FC<ScorerFormRendererProps> = ({
  mode,
  handleSubmit,
  onFormSubmit,
  control,
  setValue,
  getValues,
  scorerType,
  mutation,
  componentError,
  handleCancel,
  isSubmitButtonDisabled,
  experimentId,
}) => {
  const { theme } = useDesignSystemTheme();
  const [leftPaneWidth, setLeftPaneWidth] = useState(800);
  const resizablePaneRef = useRef<ModelTraceExplorerResizablePaneRef>(null);
  const isRunningScorersFeatureEnabled = isRunningScorersEnabled();

  // Callback to adjust panel ratio after scorer runs
  const handleScorerFinished = useCallback(() => {
    // Update to 34% left / 66% right split
    const containerWidth = resizablePaneRef.current?.getContainerWidth();
    if (containerWidth) {
      const newLeftWidth = containerWidth * 0.34;
      setLeftPaneWidth(newLeftWidth);
      resizablePaneRef.current?.updateRatio(newLeftWidth);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {isRunningScorersFeatureEnabled && scorerType === 'llm' ? (
        // Two-column resizable layout with sample scorer output panel (only for LLM scorers)
        <div css={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          <ModelTraceExplorerResizablePane
            ref={resizablePaneRef}
            initialRatio={0.55}
            paneWidth={leftPaneWidth}
            setPaneWidth={setLeftPaneWidth}
            leftMinWidth={200}
            rightMinWidth={200}
            leftChild={
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  minHeight: 0,
                  height: '100%',
                  width: '100%',
                }}
              >
                {/* Scrollable content area */}
                <div
                  css={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.sm,
                    paddingBottom: theme.spacing.md,
                    paddingRight: theme.spacing.md,
                  }}
                >
                  <ScorerFormContent
                    mode={mode}
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                    scorerType={scorerType}
                    mutation={mutation}
                    componentError={componentError}
                  />
                </div>
              </div>
            }
            rightChild={
              <div
                css={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  minHeight: 0,
                  height: '100%',
                  paddingLeft: theme.spacing.md,
                  borderLeft: `1px solid ${theme.colors.border}`,
                }}
              >
                <SampleScorerOutputPanelContainer
                  control={control}
                  experimentId={experimentId}
                  onScorerFinished={handleScorerFinished}
                />
              </div>
            }
          />
        </div>
      ) : (
        // Single-column layout (no sample scorer output panel)
        <div
          css={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
            paddingBottom: theme.spacing.md,
          }}
        >
          <ScorerFormContent
            mode={mode}
            control={control}
            setValue={setValue}
            getValues={getValues}
            scorerType={scorerType}
            mutation={mutation}
            componentError={componentError}
          />
        </div>
      )}
      {/* Sticky footer with buttons */}
      <div
        css={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: theme.spacing.sm,
          paddingTop: theme.spacing.md,
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Button componentId={`${COMPONENT_ID_PREFIX}.new-scorer-form.cancel-button`} onClick={handleCancel}>
          <FormattedMessage defaultMessage="Cancel" description="Cancel button text" />
        </Button>
        <Button
          componentId={`${COMPONENT_ID_PREFIX}.scorer-form.submit-button`}
          type="primary"
          htmlType="submit"
          loading={mutation.isLoading}
          disabled={isSubmitButtonDisabled()}
        >
          {mode === SCORER_FORM_MODE.EDIT ? (
            <FormattedMessage defaultMessage="Save" description="Save judge button text" />
          ) : (
            <FormattedMessage defaultMessage="Create judge" description="Create judge button text" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default ScorerFormRenderer;
```

--------------------------------------------------------------------------------

---[FILE: ScorerModalRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/experiment-scorers/ScorerModalRenderer.tsx
Signals: React

```typescript
import React from 'react';
import { Modal } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { isRunningScorersEnabled } from '../../../common/utils/FeatureUtils';
import ScorerFormCreateContainer from './ScorerFormCreateContainer';
import ScorerFormEditContainer from './ScorerFormEditContainer';
import { COMPONENT_ID_PREFIX, SCORER_FORM_MODE, type ScorerFormMode } from './constants';
import type { ScheduledScorer } from './types';

interface ScorerModalRendererProps {
  experimentId: string;
  visible: boolean;
  onClose: () => void;
  mode: ScorerFormMode;
  existingScorer?: ScheduledScorer;
}

const ScorerModalRenderer: React.FC<ScorerModalRendererProps> = ({
  experimentId,
  visible,
  onClose,
  mode,
  existingScorer,
}) => {
  const isRunningScorersFeatureEnabled = isRunningScorersEnabled();

  return (
    <Modal
      componentId={`${COMPONENT_ID_PREFIX}.scorer-modal`}
      title={
        mode === SCORER_FORM_MODE.EDIT ? (
          <FormattedMessage defaultMessage="Edit judge" description="Title for edit judge modal" />
        ) : (
          <FormattedMessage defaultMessage="Create judge" description="Title for new judge modal" />
        )
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      size="wide"
      css={{
        width: '100% !important',
      }}
      {...(isRunningScorersFeatureEnabled && {
        verticalSizing: 'maxed_out' as const,
        dangerouslySetAntdProps: {
          bodyStyle: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          },
        },
      })}
    >
      {mode === SCORER_FORM_MODE.EDIT && existingScorer ? (
        <ScorerFormEditContainer experimentId={experimentId} onClose={onClose} existingScorer={existingScorer} />
      ) : (
        <ScorerFormCreateContainer experimentId={experimentId} onClose={onClose} />
      )}
    </Modal>
  );
};

export default ScorerModalRenderer;
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 645
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 645 of 991)

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

---[FILE: AssessmentCreateForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentCreateForm.tsx
Signals: React

```typescript
import { isNil } from 'lodash';
import { forwardRef, useCallback, useState } from 'react';

import {
  Button,
  Input,
  SimpleSelect,
  SimpleSelectOption,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';

import { AssessmentCreateNameTypeahead } from './AssessmentCreateNameTypeahead';
import type { AssessmentFormInputDataType } from './AssessmentsPane.utils';
import { getCreateAssessmentPayloadValue } from './AssessmentsPane.utils';
import { BooleanInput } from './components/BooleanInput';
import { JsonInput } from './components/JsonInput';
import { NumericInput } from './components/NumericInput';
import { TextInput } from './components/TextInput';
import type { AssessmentValueInputFieldProps } from './components/types';
import type { CreateAssessmentPayload } from '../api';
import type { AssessmentSchema } from '../contexts/AssessmentSchemaContext';
import { useAssessmentSchemas } from '../contexts/AssessmentSchemaContext';
import { useCreateAssessment } from '../hooks/useCreateAssessment';

const ComponentMap: Record<AssessmentFormInputDataType, React.ComponentType<AssessmentValueInputFieldProps>> = {
  json: JsonInput,
  string: TextInput,
  boolean: BooleanInput,
  number: NumericInput,
};

type AssessmentCreateFormProps = {
  assessmentName?: string;
  spanId?: string;
  traceId: string;
  setExpanded: (expanded: boolean) => void;
};

export const AssessmentCreateForm = forwardRef<HTMLDivElement, AssessmentCreateFormProps>(
  (
    {
      assessmentName,
      spanId,
      traceId,
      // used to close the form
      // after the assessment is created
      setExpanded,
    },
    ref,
  ) => {
    const { theme } = useDesignSystemTheme();
    const { schemas } = useAssessmentSchemas();

    const [name, setName] = useState('');
    const [assessmentType, setAssessmentType] = useState<'feedback' | 'expectation'>('feedback');
    const [dataType, setDataType] = useState<AssessmentFormInputDataType>('boolean');
    const [value, setValue] = useState<string | boolean | number>(true);
    const [rationale, setRationale] = useState('');
    const [nameError, setNameError] = useState<React.ReactNode | null>(null);
    const [valueError, setValueError] = useState<React.ReactNode | null>(null);
    const isNamePrefilled = !isNil(assessmentName);

    // default to string if somehow the data type is not supported
    const InputComponent = ComponentMap[dataType] ?? ComponentMap['string'];

    const { createAssessmentMutation, isLoading } = useCreateAssessment({
      traceId,
      onSettled: () => {
        setExpanded(false);
      },
    });

    const handleCreate = useCallback(async () => {
      if (dataType === 'json') {
        try {
          // validate JSON
          JSON.parse(value as string);
        } catch (e) {
          setValueError(
            <FormattedMessage
              defaultMessage="The provided value is not valid JSON"
              description="Error message for invalid JSON in an assessment creation form"
            />,
          );
          return;
        }
      }

      if (!isNamePrefilled && name === '') {
        setNameError(
          <FormattedMessage
            defaultMessage="Please enter a name"
            description="Error message for empty assessment name in a creation form"
          />,
        );
        return;
      }

      const valueObj = getCreateAssessmentPayloadValue({
        formValue: value,
        dataType,
        isFeedback: assessmentType === 'feedback',
      });

      const payload: CreateAssessmentPayload = {
        assessment: {
          assessment_name: isNamePrefilled ? assessmentName : name,
          trace_id: traceId,
          source: {
            source_type: 'HUMAN',
            source_id: getUser() ?? '',
          },
          span_id: spanId,
          rationale,
          ...valueObj,
        },
      };

      createAssessmentMutation(payload);
    }, [
      dataType,
      value,
      assessmentType,
      isNamePrefilled,
      assessmentName,
      name,
      traceId,
      spanId,
      rationale,
      createAssessmentMutation,
    ]);

    const handleChangeSchema = useCallback(
      (schema: AssessmentSchema | null) => {
        // clear the form back to defaults
        if (!schema) {
          setName('');
          setAssessmentType('feedback');
          setDataType('boolean');
          setValue(true);
          setRationale('');
          setValueError(null);
          return;
        }

        // Check if this is a real schema from the schemas list or a fake one created for a new name
        const isRealSchema = schemas.some((s) => s.name === schema.name);

        // Only update the name if it's a new assessment name (not in schemas)
        // This preserves the user's selections for assessment type and data type
        if (!isRealSchema) {
          setName(schema.name);
          return;
        }

        // For existing schemas, update all fields
        setName(schema.name);
        setAssessmentType(schema.assessmentType);
        setDataType(schema.dataType);

        // set the appropriate empty value for the data type
        switch (schema.dataType) {
          case 'string':
          case 'json':
            setValue('');
            break;
          case 'number':
            setValue(0);
            break;
          case 'boolean':
            setValue(true);
            break;
        }
      },
      [schemas],
    );

    return (
      <div
        ref={ref}
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
          marginTop: theme.spacing.sm,
          border: `1px solid ${theme.colors.border}`,
          padding: theme.spacing.sm,
          borderRadius: theme.borders.borderRadiusSm,
        }}
      >
        <Typography.Text size="sm" color="secondary">
          <FormattedMessage
            defaultMessage="Assessment Type"
            description="Field label for assessment type in a creation form"
          />
        </Typography.Text>
        <SimpleSelect
          id="shared.model-trace-explorer.assessment-type-select"
          componentId="shared.model-trace-explorer.assessment-type-select"
          label="Assessment Type"
          value={assessmentType}
          disabled={isLoading}
          onChange={(e) => {
            setAssessmentType(e.target.value as 'feedback' | 'expectation');
            // JSON data is not available for feedback
            if (e.target.value === 'feedback' && dataType === 'json') {
              setDataType('string');
            }
          }}
        >
          <SimpleSelectOption value="feedback">
            <FormattedMessage defaultMessage="Feedback" description="Feedback select menu option for assessment type" />
          </SimpleSelectOption>
          <SimpleSelectOption value="expectation">
            <FormattedMessage
              defaultMessage="Expectation"
              description="Expectation select menu option for assessment type"
            />
          </SimpleSelectOption>
        </SimpleSelect>
        <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
          <FormattedMessage
            defaultMessage="Assessment Name"
            description="Field label for assessment name in a creation form"
          />
        </Typography.Text>
        {isNamePrefilled ? (
          <Typography.Text>{assessmentName}</Typography.Text>
        ) : (
          <AssessmentCreateNameTypeahead
            name={name}
            setName={setName}
            handleChangeSchema={handleChangeSchema}
            nameError={nameError}
            setNameError={setNameError}
          />
        )}
        <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
          <FormattedMessage
            defaultMessage="Data Type"
            description="Field label for assessment data type in a creation form"
          />
        </Typography.Text>
        <SimpleSelect
          id="shared.model-trace-explorer.assessment-data-type-select"
          componentId="shared.model-trace-explorer.assessment-data-type-select"
          label="Data Type"
          value={dataType}
          disabled={isLoading}
          onChange={(e) => {
            setDataType(e.target.value as AssessmentFormInputDataType);
            setValueError(null);
          }}
        >
          {assessmentType === 'expectation' && (
            <SimpleSelectOption value="json">
              <FormattedMessage defaultMessage="JSON" description="JSON select menu option for assessment data type" />
            </SimpleSelectOption>
          )}
          <SimpleSelectOption value="string">
            <FormattedMessage
              defaultMessage="String"
              description="String select menu option for assessment data type"
            />
          </SimpleSelectOption>
          <SimpleSelectOption value="boolean">
            <FormattedMessage
              defaultMessage="Boolean"
              description="Boolean select menu option for assessment data type"
            />
          </SimpleSelectOption>
          <SimpleSelectOption value="number">
            <FormattedMessage
              defaultMessage="Number"
              description="Numeric select menu option for assessment data type"
            />
          </SimpleSelectOption>
        </SimpleSelect>
        <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
          <FormattedMessage defaultMessage="Value" description="Field label for assessment value in a creation form" />
        </Typography.Text>
        <InputComponent
          value={value}
          valueError={valueError}
          setValue={setValue}
          setValueError={setValueError}
          isSubmitting={isLoading}
        />
        <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
          <FormattedMessage
            defaultMessage="Rationale"
            description="Field label for assessment rationale in a creation form"
          />
        </Typography.Text>
        <Input.TextArea
          componentId="shared.model-trace-explorer.assessment-rationale-input"
          value={rationale}
          autoSize={{ minRows: 1, maxRows: 5 }}
          disabled={isLoading}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => setRationale(e.target.value)}
        />
        <div css={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing.xs }}>
          <Button
            componentId="shared.model-trace-explorer.assessment-create-button"
            disabled={isLoading}
            onClick={() => setExpanded(false)}
          >
            <FormattedMessage
              defaultMessage="Cancel"
              description="Button label for cancelling the creation of an assessment"
            />
          </Button>
          <Button
            css={{ marginLeft: theme.spacing.sm }}
            type="primary"
            componentId="shared.model-trace-explorer.assessment-create-button"
            onClick={handleCreate}
            loading={isLoading}
          >
            <FormattedMessage defaultMessage="Create" description="Button label for creating an assessment" />
          </Button>
        </div>
      </div>
    );
  },
);
```

--------------------------------------------------------------------------------

---[FILE: AssessmentCreateNameTypeahead.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentCreateNameTypeahead.tsx
Signals: React

```typescript
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo, useState } from 'react';

import {
  FormUI,
  TypeaheadComboboxInput,
  TypeaheadComboboxMenu,
  TypeaheadComboboxMenuItem,
  TypeaheadComboboxRoot,
  useComboboxState,
} from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

import type { AssessmentSchema } from '../contexts/AssessmentSchemaContext';
import { useAssessmentSchemas } from '../contexts/AssessmentSchemaContext';

const getDefaultSchema = (name: string): AssessmentSchema => ({
  name,
  assessmentType: 'feedback',
  dataType: 'boolean',
});

export const AssessmentCreateNameTypeahead = ({
  name,
  setName,
  nameError,
  setNameError,
  handleChangeSchema,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  nameError: React.ReactNode | null;
  setNameError: Dispatch<SetStateAction<React.ReactNode | null>>;
  handleChangeSchema: (schema: AssessmentSchema | null) => void;
}) => {
  const { schemas } = useAssessmentSchemas();
  const intl = useIntl();
  const schemaNames = schemas.map((schema) => schema.name ?? '');

  const [selectedItem, setSelectedItem] = useState<AssessmentSchema | null>(null);
  const [itemsTest, setItemsTest] = useState<(AssessmentSchema | null)[]>(schemas);

  const items = useMemo(() => {
    const filteredItems = [...itemsTest];

    // hack to allow creating a new assessment name even if it's not in
    // the schemas. basically creates a fake schema with the name of the
    // input value so it always shows up in the typeahead
    if (name && !schemaNames.includes(name)) {
      const newSchema = getDefaultSchema(name);
      filteredItems.unshift(newSchema);
    }

    return filteredItems;
  }, [name, itemsTest, schemaNames]);

  const formOnChange = useCallback(
    (newSelectedItem: AssessmentSchema | null) => {
      setSelectedItem(newSelectedItem);
      handleChangeSchema(newSelectedItem);
      setNameError(null);
    },
    [handleChangeSchema, setNameError],
  );

  const comboboxState = useComboboxState<AssessmentSchema | null>({
    componentId: 'shared.model-trace-explorer.assessment-name-typeahead',
    allItems: schemas,
    items,
    setItems: setItemsTest,
    multiSelect: false,
    setInputValue: (value) => {
      setName(value);
      setNameError(null);
    },
    itemToString: (item) => item?.name ?? '',
    matcher: (item, query) => item?.name?.toLowerCase().includes(query.toLowerCase()) ?? false,
    formValue: selectedItem,
    formOnChange,
    preventUnsetOnBlur: true,
  });

  return (
    <TypeaheadComboboxRoot
      onKeyDown={(e) => {
        // disable left and right to prevent the previous/next
        // trace interaction while typing an assessment name,
        // but still allow up and down for tabbing through
        // typeahead options
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.stopPropagation();
        }
      }}
      id="shared.model-trace-explorer.assessment-name-typeahead"
      comboboxState={comboboxState}
    >
      <TypeaheadComboboxInput
        data-testid="assessment-name-typeahead-input"
        placeholder={intl.formatMessage({
          defaultMessage: 'Enter an assessment name',
          description: 'Placeholder for the assessment name typeahead',
        })}
        validationState={nameError ? 'error' : undefined}
        comboboxState={comboboxState}
        formOnChange={formOnChange}
        onPressEnter={() => {
          if (items.length > 0) {
            formOnChange(items[0]);
          }
        }}
        allowClear
        showComboboxToggleButton
      />
      {nameError && <FormUI.Message type="error" message={nameError} />}
      <TypeaheadComboboxMenu comboboxState={comboboxState}>
        {items.map((item, index) => (
          <TypeaheadComboboxMenuItem
            data-testid={`assessment-name-typeahead-item-${item?.name ?? ''}`}
            key={`assessment-name-typeahead-${item?.name ?? ''}`}
            item={item}
            index={index}
            comboboxState={comboboxState}
          >
            {item?.name ?? ''}
          </TypeaheadComboboxMenuItem>
        ))}
      </TypeaheadComboboxMenu>
    </TypeaheadComboboxRoot>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentDeleteModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentDeleteModal.tsx
Signals: React

```typescript
import { useCallback } from 'react';

import { Modal } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { Assessment } from '../ModelTrace.types';
import { useDeleteAssessment } from '../hooks/useDeleteAssessment';

export const AssessmentDeleteModal = ({
  assessment,
  isModalVisible,
  setIsModalVisible,
}: {
  assessment: Assessment;
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
}) => {
  const { deleteAssessmentMutation, isLoading } = useDeleteAssessment({
    assessment,
    onSettled: () => {
      setIsModalVisible(false);
    },
  });

  const handleDelete = useCallback(() => {
    deleteAssessmentMutation();
  }, [deleteAssessmentMutation]);

  return (
    <Modal
      componentId="shared.model-trace-explorer.assessment-delete-modal"
      visible={isModalVisible}
      onOk={handleDelete}
      okButtonProps={{ danger: true, loading: isLoading }}
      okText={<FormattedMessage defaultMessage="Delete" description="Delete assessment modal button text" />}
      onCancel={() => {
        setIsModalVisible(false);
      }}
      cancelText={<FormattedMessage defaultMessage="Cancel" description="Delete assessment modal cancel button text" />}
      confirmLoading={isLoading}
      title={<FormattedMessage defaultMessage="Delete assessment" description="Delete assessments modal title" />}
    >
      <FormattedMessage
        defaultMessage="Are you sure you want to delete this assessment?"
        description="Delete assessments modal confirmation text"
      />
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentDisplayValue.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentDisplayValue.tsx
Signals: React

```typescript
import React from 'react';

import type { TagColors } from '@databricks/design-system';
import {
  CheckCircleIcon,
  DangerIcon,
  Tag,
  Tooltip,
  useDesignSystemTheme,
  XCircleIcon,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

const BUILTIN_SCORER_ASSESSMENT_DISPLAY = {
  user_frustration: {
    none: {
      color: 'lime' as TagColors,
      icon: CheckCircleIcon,
      label: (
        <FormattedMessage
          defaultMessage="None"
          description="Label for a user_frustration assessment with 'none' value"
        />
      ),
    },
    resolved: {
      color: 'lemon' as TagColors,
      icon: CheckCircleIcon,
      label: (
        <FormattedMessage
          defaultMessage="Resolved"
          description="Label for a user_frustration assessment with 'resolved' value"
        />
      ),
    },
    unresolved: {
      color: 'coral' as TagColors,
      icon: XCircleIcon,
      label: (
        <FormattedMessage
          defaultMessage="Unresolved"
          description="Label for a user_frustration assessment with 'unresolved' value"
        />
      ),
    },
  },
} as const;

type BuiltInScorerAssessmentName = keyof typeof BUILTIN_SCORER_ASSESSMENT_DISPLAY;

const getBuiltInScorerAssessmentDisplay = (
  assessmentName: string | undefined,
  parsedValue: any,
  theme: any,
  skipIcons: boolean,
): { color: TagColors; children: React.ReactNode } | undefined => {
  if (!assessmentName) {
    return undefined;
  }

  const builtInAssessment = BUILTIN_SCORER_ASSESSMENT_DISPLAY[assessmentName as BuiltInScorerAssessmentName];
  if (!builtInAssessment) {
    return undefined;
  }

  const valueKey = String(parsedValue ?? '') as keyof typeof builtInAssessment;
  const displayConfig = builtInAssessment[valueKey];
  if (!displayConfig) {
    return undefined;
  }

  const IconComponent = displayConfig.icon;
  return {
    color: displayConfig.color,
    children: (
      <>
        {!skipIcons && <IconComponent css={{ marginRight: theme.spacing.xs }} />}
        {displayConfig.label}
      </>
    ),
  };
};

// displays a single JSON-strigified assessment value as a tag
export const AssessmentDisplayValue = ({
  jsonValue,
  className,
  prefix,
  skipIcons = false,
  overrideColor,
  assessmentName,
}: {
  jsonValue: string;
  className?: string;
  prefix?: React.ReactNode;
  skipIcons?: boolean;
  overrideColor?: TagColors;
  assessmentName?: string;
}) => {
  const { theme } = useDesignSystemTheme();

  // treat empty strings as null
  if (!jsonValue || jsonValue === '""') {
    return null;
  }

  let parsedValue: any;
  try {
    parsedValue = JSON.parse(jsonValue);
  } catch (e) {
    // if the value is not valid JSON, just use the string value
    parsedValue = jsonValue;
  }

  let color: TagColors = 'default';
  let children: React.ReactNode = JSON.stringify(parsedValue, null, 2);

  const builtInDisplay = getBuiltInScorerAssessmentDisplay(assessmentName, parsedValue, theme, skipIcons);
  if (builtInDisplay) {
    color = builtInDisplay.color;
    children = builtInDisplay.children;
  } else if (parsedValue === 'yes') {
    color = 'lime';
    children = (
      <>
        {!skipIcons && <CheckCircleIcon css={{ marginRight: theme.spacing.xs }} />}
        <FormattedMessage defaultMessage="Yes" description="Label for an assessment with a 'yes' value" />
      </>
    );
  } else if (parsedValue === 'no') {
    color = 'coral';
    children = (
      <>
        {!skipIcons && <XCircleIcon css={{ marginRight: theme.spacing.xs }} />}
        <FormattedMessage defaultMessage="No" description="Label for an assessment with a 'no' value" />
      </>
    );
  } else if (typeof parsedValue === 'string') {
    children = parsedValue;
  } else if (parsedValue === null) {
    // feedback can only have null values if they are errors
    color = 'coral';
    children = (
      <>
        {!skipIcons && <DangerIcon css={{ marginRight: theme.spacing.xs }} />}
        <FormattedMessage defaultMessage="Error" description="Label for an assessment with an error" />
      </>
    );
  } else if (parsedValue === true) {
    color = 'lime';
    children = (
      <>
        {!skipIcons && <CheckCircleIcon css={{ marginRight: theme.spacing.xs }} />}
        <FormattedMessage defaultMessage="True" description="Label for an assessment with a 'true' boolean value" />
      </>
    );
  } else if (parsedValue === false) {
    color = 'coral';
    children = (
      <>
        {!skipIcons && <XCircleIcon css={{ marginRight: theme.spacing.xs }} />}
        <FormattedMessage defaultMessage="False" description="Label for an assessment with a 'false' boolean value" />
      </>
    );
  }

  return (
    <Tooltip componentId="shared.model-trace-explorer.assesment-value-tooltip" content={children}>
      <Tag
        css={{ display: 'inline-flex', maxWidth: '100%', minWidth: theme.spacing.md, marginRight: 0 }}
        componentId="shared.model-trace-explorer.assesment-value-tag"
        color={overrideColor ?? color}
        className={className}
      >
        <span
          css={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textWrap: 'nowrap',
          }}
        >
          {prefix}
          {children}
        </span>
      </Tag>
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentEditForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentEditForm.tsx
Signals: React

```typescript
import { useCallback, useState } from 'react';

import {
  Typography,
  useDesignSystemTheme,
  SimpleSelect,
  SimpleSelectOption,
  SegmentedControlGroup,
  SegmentedControlButton,
  Input,
  Button,
  FormUI,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';

import type { AssessmentFormInputDataType } from './AssessmentsPane.utils';
import { getCreateAssessmentPayloadValue } from './AssessmentsPane.utils';
import { getAssessmentValue } from './utils';
import type { Assessment } from '../ModelTrace.types';
import type { UpdateAssessmentPayload } from '../api';
import { useOverrideAssessment } from '../hooks/useOverrideAssessment';
import { useUpdateAssessment } from '../hooks/useUpdateAssessment';

// default to the original type of the value if possible. however,
// we only support editing simple types in the UI (i.e. not arrays / objects)
// so if the value does not fit, we just default to boolean for simplicity
const getDefaultType = (value: any, isFeedback: boolean): AssessmentFormInputDataType => {
  if (typeof value === 'string') {
    // treat empty strings as null, default to boolean
    if (value === '') {
      return 'boolean';
    }

    if (isFeedback) {
      return 'string';
    }

    try {
      JSON.parse(value);
      return 'json';
    } catch (e) {
      // not valid JSON, default to string
      return 'string';
    }
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return typeof value as 'boolean' | 'number';
  }
  return 'boolean';
};

const getDefaultValue = (value: any): string | boolean | number | null => {
  if (typeof value === 'string') {
    // treat empty strings as null
    return value || null;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  return null;
};

export const AssessmentEditForm = ({
  assessment,
  onSuccess,
  onSettled,
  onCancel,
}: {
  assessment: Assessment;
  onSuccess?: () => void;
  onSettled?: () => void;
  onCancel: () => void;
}) => {
  const isFeedback = 'feedback' in assessment;
  const initialValue = getAssessmentValue(assessment);
  const defaultType = getDefaultType(initialValue, isFeedback);
  const defaultValue = getDefaultValue(initialValue);
  const user = getUser() ?? '';

  const { theme } = useDesignSystemTheme();
  const [dataType, setDataType] = useState<AssessmentFormInputDataType>(defaultType);
  const [value, setValue] = useState<string | boolean | number | null>(defaultValue);
  const [rationale, setRationale] = useState(assessment.rationale);
  const [valueError, setValueError] = useState<React.ReactNode | null>(null);

  const { updateAssessmentMutation, isLoading: isUpdating } = useUpdateAssessment({
    assessment,
    onSuccess,
    onSettled,
  });

  const { overrideAssessmentMutation, isLoading: isOverwriting } = useOverrideAssessment({
    traceId: assessment.trace_id,
    onSuccess,
    onSettled,
  });

  const isLoading = isUpdating || isOverwriting;

  const handleUpdate = useCallback(async () => {
    if (dataType === 'json') {
      try {
        JSON.parse(value as string);
      } catch (e) {
        setValueError(
          <FormattedMessage
            defaultMessage="The provided value is not valid JSON"
            description="Error message for invalid JSON in an assessment edit form"
          />,
        );
        return;
      }
    }

    const valueObj = getCreateAssessmentPayloadValue({
      formValue: value,
      dataType,
      isFeedback,
    });

    // if a user edits their own assessment, we update it in
    // place as they are likely just correcting a mistake.
    // expectation edits should always call the update API
    if (user === assessment.source.source_id || !isFeedback) {
      const payload: UpdateAssessmentPayload = {
        assessment: {
          ...valueObj,
          rationale,
        },
        update_mask: `${isFeedback ? 'feedback' : 'expectation'},rationale`,
      };

      updateAssessmentMutation(payload);
    } else {
      overrideAssessmentMutation({
        oldAssessment: assessment,
        value: valueObj,
        ...(rationale ? { rationale } : {}),
      });
    }
  }, [dataType, value, isFeedback, user, assessment, rationale, updateAssessmentMutation, overrideAssessmentMutation]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.sm,
        borderRadius: theme.borders.borderRadiusSm,
      }}
    >
      <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
        <FormattedMessage
          defaultMessage="Data Type"
          description="Field label for assessment data type in an edit form"
        />
      </Typography.Text>
      <SimpleSelect
        id="shared.model-trace-explorer.assessment-edit-data-type-select"
        componentId="shared.model-trace-explorer.assessment-edit-data-type-select"
        value={dataType}
        disabled={isLoading}
        onChange={(e) => {
          setDataType(e.target.value as AssessmentFormInputDataType);
          setValueError(null);
        }}
      >
        {!isFeedback && (
          <SimpleSelectOption value="json">
            <FormattedMessage defaultMessage="JSON" description="JSON select menu option for assessment data type" />
          </SimpleSelectOption>
        )}
        <SimpleSelectOption value="string">
          <FormattedMessage defaultMessage="String" description="String select menu option for assessment data type" />
        </SimpleSelectOption>
        <SimpleSelectOption value="boolean">
          <FormattedMessage
            defaultMessage="Boolean"
            description="Boolean select menu option for assessment data type"
          />
        </SimpleSelectOption>
        <SimpleSelectOption value="number">
          <FormattedMessage defaultMessage="Number" description="Numeric select menu option for assessment data type" />
        </SimpleSelectOption>
      </SimpleSelect>
      <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
        <FormattedMessage defaultMessage="Value" description="Field label for assessment value in an edit form" />
      </Typography.Text>
      {dataType === 'json' && (
        <>
          <Input.TextArea
            componentId="shared.model-trace-explorer.assessment-edit-value-string-input"
            value={String(value)}
            rows={3}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              setValue(e.target.value);
              setValueError(null);
            }}
            validationState={valueError ? 'error' : undefined}
            disabled={isLoading}
          />
          {valueError && (
            <FormUI.Message
              id="shared.model-trace-explorer.assessment-edit-value-json-error"
              message={valueError}
              type="error"
            />
          )}
        </>
      )}
      {dataType === 'string' && (
        <Input
          componentId="shared.model-trace-explorer.assessment-edit-value-string-input"
          value={String(value)}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            setValue(e.target.value);
            setValueError(null);
          }}
          disabled={isLoading}
          allowClear
        />
      )}
      {dataType === 'boolean' && (
        <SegmentedControlGroup
          componentId="shared.model-trace-explorer.assessment-edit-value-boolean-input"
          name="shared.model-trace-explorer.assessment-edit-value-boolean-input"
          value={value}
          disabled={isLoading}
          onChange={(e) => {
            setValue(e.target.value);
            setValueError(null);
          }}
        >
          <SegmentedControlButton value>True</SegmentedControlButton>
          <SegmentedControlButton value={false}>False</SegmentedControlButton>
        </SegmentedControlGroup>
      )}
      {dataType === 'number' && (
        <Input
          componentId="shared.model-trace-explorer.assessment-edit-value-number-input"
          value={String(value)}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            setValue(e.target.value ? Number(e.target.value) : '');
            setValueError(null);
          }}
          type="number"
          disabled={isLoading}
          allowClear
        />
      )}
      <Typography.Text css={{ marginTop: theme.spacing.xs }} size="sm" color="secondary">
        <FormattedMessage
          defaultMessage="Rationale"
          description="Field label for assessment rationale in an edit form"
        />
      </Typography.Text>
      <Input.TextArea
        componentId="shared.model-trace-explorer.assessment-edit-rationale-input"
        value={rationale}
        autoSize={{ minRows: 1, maxRows: 5 }}
        disabled={isLoading}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => setRationale(e.target.value)}
      />
      <div css={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing.xs }}>
        <Button
          componentId="shared.model-trace-explorer.assessment-edit-cancel-button"
          disabled={isLoading}
          onClick={onCancel}
        >
          <FormattedMessage
            defaultMessage="Cancel"
            description="Button label for cancelling the edit of an assessment"
          />
        </Button>
        <Button
          css={{ marginLeft: theme.spacing.sm }}
          type="primary"
          componentId="shared.model-trace-explorer.assessment-edit-save-button"
          onClick={handleUpdate}
          loading={isLoading}
        >
          <FormattedMessage defaultMessage="Save" description="Button label for saving an edit to an assessment" />
        </Button>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentItemHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentItemHeader.tsx
Signals: React

```typescript
import { useState } from 'react';

import { useDesignSystemTheme, Typography } from '@databricks/design-system';

import { AssessmentActionsOverflowMenu } from './AssessmentActionsOverflowMenu';
import { AssessmentDeleteModal } from './AssessmentDeleteModal';
import { AssessmentSourceName } from './AssessmentSourceName';
import { timeSinceStr } from './AssessmentsPane.utils';
import { getSourceIcon } from './utils';
import type { Assessment } from '../ModelTrace.types';

export const AssessmentItemHeader = ({
  // connector is not displayed in history items
  renderConnector = true,
  assessment,
  setIsEditing,
  hideOverflowMenu = false,
}: {
  renderConnector?: boolean;
  assessment: Assessment;
  setIsEditing?: (isEditing: boolean) => void;
  hideOverflowMenu?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const SourceIcon = getSourceIcon(assessment.source);

  return (
    <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {renderConnector && (
        <div
          css={{
            position: 'absolute',
            left: -1,
            top: 0,
            width: 10,
            height: theme.typography.lineHeightBase,
            boxSizing: 'border-box',
            borderBottomLeftRadius: theme.borders.borderRadiusMd,
            borderBottom: `1px solid ${theme.colors.border}`,
            borderLeft: `1px solid ${theme.colors.border}`,
          }}
        />
      )}
      <SourceIcon
        size={theme.typography.fontSizeSm}
        css={{
          padding: 2,
          backgroundColor: theme.colors.actionIconBackgroundHover,
          borderRadius: theme.borders.borderRadiusFull,
        }}
      />
      <AssessmentSourceName source={assessment.source} />
      <div
        css={{
          marginLeft: 'auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
      >
        {assessment.last_update_time && (
          <Typography.Text
            color="secondary"
            size="sm"
            css={{
              marginLeft: theme.spacing.sm,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textWrap: 'nowrap',
            }}
          >
            {timeSinceStr(new Date(assessment.last_update_time))}
          </Typography.Text>
        )}
        {!hideOverflowMenu && (
          <AssessmentActionsOverflowMenu
            assessment={assessment}
            setIsEditing={setIsEditing}
            setShowDeleteModal={setShowDeleteModal}
          />
        )}
        <AssessmentDeleteModal
          assessment={assessment}
          isModalVisible={showDeleteModal}
          setIsModalVisible={setShowDeleteModal}
        />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentPaneToggle.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentPaneToggle.tsx

```typescript
import { GavelIcon, SegmentedControlGroup, SegmentedControlButton } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';

export const AssessmentPaneToggle = () => {
  const { assessmentsPaneExpanded, setAssessmentsPaneExpanded, assessmentsPaneEnabled, isInComparisonView } =
    useModelTraceExplorerViewState();

  if (isInComparisonView) {
    return null;
  }

  return (
    <SegmentedControlGroup
      css={{ display: 'block' }}
      name="shared.model-trace-explorer.assessments-pane-toggle"
      componentId="shared.model-trace-explorer.assessments-pane-toggle"
      value={assessmentsPaneExpanded}
      size="small"
    >
      <SegmentedControlButton
        value
        disabled={!assessmentsPaneEnabled}
        icon={<GavelIcon />}
        onClick={() => setAssessmentsPaneExpanded?.(!assessmentsPaneExpanded)}
        css={{
          '& > span': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {!assessmentsPaneExpanded && (
          <FormattedMessage
            defaultMessage="Assessments"
            description="Label for the assessments pane of the model trace explorer."
          />
        )}
      </SegmentedControlButton>
    </SegmentedControlGroup>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentSourceName.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/AssessmentSourceName.tsx

```typescript
import { Tooltip, useDesignSystemTheme, Typography } from '@databricks/design-system';

import type { AssessmentSource } from '../ModelTrace.types';

export const AssessmentSourceName = ({ source }: { source: AssessmentSource }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Tooltip componentId="shared.model-trace-explorer.assessment-source-name" content={source.source_id}>
      {/* wrap in span so the tooltip can show up */}
      <span
        css={{
          flexShrink: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textWrap: 'nowrap',
          marginLeft: theme.spacing.sm,
          minWidth: theme.spacing.md,
        }}
      >
        <Typography.Text>
          <span css={{ color: theme.colors.blue500 }}>{source.source_id}</span>
        </Typography.Text>
      </span>
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

````

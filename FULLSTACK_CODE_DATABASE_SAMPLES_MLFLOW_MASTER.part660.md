---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 660
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 660 of 991)

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

---[FILE: useTagAssignmentFieldArray.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/hooks/useTagAssignmentFieldArray.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { IntlProvider } from 'react-intl';

import { useTagAssignmentFieldArray } from './useTagAssignmentFieldArray';

const DefaultWrapper = ({ children }: { children: React.ReactNode }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

describe('useTagAssignmentFieldArray', () => {
  it('should use passed form as prop', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ input: string; tags: { key: string; value: string }[] }>({
        defaultValues: { input: 'test_input', tags: [{ key: 'key1', value: 'value1' }] },
      }),
    );
    const { result } = renderHook(
      () =>
        useTagAssignmentFieldArray({
          name: 'tags',
          emptyValue: { key: '', value: '' },
          form: formResult.current,
          keyProperty: 'key',
        }),
      { wrapper: DefaultWrapper },
    );
    result.current.appendIfPossible({ key: 'foo', value: 'bar' }, {});

    const values = result.current.form.getValues();
    expect(values.tags).toStrictEqual([
      { key: 'key1', value: 'value1' },
      { key: 'foo', value: 'bar' },
    ]);
    expect(values.input).toBe('test_input');
  });

  it('should use context form if no form prop is passed', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm<{ input: string; tags: { key: string; value: string }[] }>({
        defaultValues: { input: 'test_input', tags: [{ key: 'key1', value: 'value1' }] },
      });
      return (
        <IntlProvider locale="en">
          c<FormProvider {...methods}>{children}</FormProvider>
        </IntlProvider>
      );
    };

    const { result } = renderHook(
      () =>
        useTagAssignmentFieldArray({
          name: 'tags',
          emptyValue: { key: '', value: '' },
          keyProperty: 'key',
        }),
      { wrapper: Wrapper },
    );
    result.current.appendIfPossible({ key: 'foo', value: 'bar' }, {});

    const values = result.current.form.getValues();
    expect(values['tags']).toStrictEqual([
      { key: 'key1', value: 'value1' },
      { key: 'foo', value: 'bar' },
    ]);
    expect(values['input']).toBe('test_input');
  });

  it('should throw an error if no form is passed and not in a form context', () => {
    expect(() =>
      renderHook(
        () =>
          useTagAssignmentFieldArray({
            name: 'tags',
            emptyValue: { key: '', value: undefined },
            keyProperty: 'key',
          }),
        { wrapper: DefaultWrapper },
      ),
    ).toThrow('Nest your component on a FormProvider or pass a form prop');
  });

  it('should not add the empty value to the form via appendIfPossible if maxLength is reached', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ tags: { key: string; value: string }[] }>({
        defaultValues: {
          tags: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' },
          ],
        },
      }),
    );

    const { result } = renderHook(
      () =>
        useTagAssignmentFieldArray<{ tags: { key: string; value: string }[] }>({
          name: 'tags',
          emptyValue: { key: '', value: '' },
          maxLength: 2,
          form: formResult.current,
          keyProperty: 'key',
        }),
      { wrapper: DefaultWrapper },
    );

    result.current.appendIfPossible({ key: 'not-added', value: 'not-added' }, {});
    expect(result.current.getTagsValues()).toStrictEqual([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ]);
  });

  it('should remove tag when removeOrUpdate is called for tag not at the end of the array', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ tags: { key: string; value: string }[] }>({
        defaultValues: {
          tags: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' },
            { key: '', value: '' },
          ],
        },
      }),
    );
    const { result } = renderHook(
      () =>
        useTagAssignmentFieldArray({
          name: 'tags',
          emptyValue: { key: '', value: '' },
          maxLength: 5,
          form: formResult.current,
          keyProperty: 'key',
        }),
      { wrapper: DefaultWrapper },
    );

    result.current.removeOrUpdate(0);

    expect(result.current.getTagsValues()).toStrictEqual([
      { key: 'key2', value: 'value2' },
      { key: '', value: '' },
    ]);
  });

  it('should set last tag to the empty value when removeOrUpdate is called for last tag', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ tags: { key: string; value: string }[] }>({
        defaultValues: {
          tags: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' },
          ],
        },
      }),
    );
    const { result } = renderHook(
      () =>
        useTagAssignmentFieldArray({
          name: 'tags',
          emptyValue: { key: '', value: '' },
          maxLength: 2,
          form: formResult.current,
          keyProperty: 'key',
        }),
      { wrapper: DefaultWrapper },
    );

    result.current.removeOrUpdate(1);

    expect(result.current.getTagsValues()).toStrictEqual([
      { key: 'key1', value: 'value1' },
      { key: '', value: '' },
    ]);
  });

  it('should add an empty tag to the end of the array when removeOrUpdate is called when the max number of tags are present', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ tags: { key: string; value: string }[] }>({
        defaultValues: {
          tags: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' },
          ],
        },
      }),
    );
    const { result } = renderHook(
      () =>
        useTagAssignmentFieldArray({
          name: 'tags',
          emptyValue: { key: '', value: '' },
          maxLength: 2,
          form: formResult.current,
          keyProperty: 'key',
        }),
      { wrapper: DefaultWrapper },
    );

    result.current.removeOrUpdate(0);

    expect(result.current.getTagsValues()).toStrictEqual([
      { key: 'key2', value: 'value2' },
      { key: '', value: '' },
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useTagAssignmentFieldArray.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/hooks/useTagAssignmentFieldArray.ts
Signals: React

```typescript
import invariant from 'invariant';
import { useCallback, useState } from 'react';
import type { ArrayPath, FieldArray, FieldArrayMethodProps, FieldValues, Path } from 'react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import type { UseTagAssignmentProps } from './useTagAssignmentForm';

function getTagAssignmentRules(maxLength: number | undefined, intl: IntlShape) {
  if (maxLength === undefined) return undefined;
  if (maxLength === 0) {
    invariant(false, 'maxLength must be greater than 0');
  }
  return {
    maxLength: {
      value: maxLength,
      message: intl.formatMessage(
        {
          defaultMessage: `You can set a maximum of {maxLength} values`,
          description:
            'Error message when trying to submit a key-value pair form with more than the maximum allowed values',
        },
        {
          maxLength,
        },
      ),
    },
  };
}

type UseTagAssignmentFieldArrayProps<
  T extends FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
> = Pick<UseTagAssignmentProps<T, K, V>, 'name' | 'maxLength' | 'emptyValue' | 'form' | 'keyProperty'>;

/**
 * Alternative to useTagAssignmentForm that only provides a wrapper around RHF's useFieldArray without any
 * side effects to initialize the form state.
 *
 * As with useFieldArray, the caller is expected to manage the form state themselves using these methods.
 * For conformance to the unified tagging pattern, there are 2 key things you are responsible for:
 *   1. Initialize the form state with an empty tag
 *   2. Call appendIfPossible when the user inputs something into the last tag key field
 */
export function useTagAssignmentFieldArray<
  T extends FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
>({ name, maxLength, emptyValue, form, keyProperty }: UseTagAssignmentFieldArrayProps<T, K, V>) {
  const intl = useIntl();

  const formCtx = useFormContext<T>();
  const shouldUseFormContext = Boolean(formCtx) && !form;
  const internalForm = shouldUseFormContext ? formCtx : form;

  invariant(internalForm, 'Nest your component on a FormProvider or pass a form prop');

  const [_emptyValue] = useState(emptyValue);
  const {
    append: originalAppend,
    update,
    remove: originalRemove,
    ...fieldArrayMethods
  } = useFieldArray<T, K>({
    name,
    control: internalForm.control,
    rules: getTagAssignmentRules(maxLength, intl),
  });

  const { getValues } = internalForm;

  const getTagsValues = useCallback(() => {
    return getValues(name as Path<T>) as V[] | undefined;
  }, [getValues, name]);

  const appendIfPossible = useCallback(
    (value: V | V[], options: FieldArrayMethodProps) => {
      const tags = getTagsValues();
      if (maxLength && tags && tags.length >= maxLength) return;
      originalAppend(value, options);
    },
    [getTagsValues, maxLength, originalAppend],
  );

  const removeOrUpdate = useCallback(
    (index: number) => {
      const tags = getTagsValues();
      if (tags && index === tags.length - 1) {
        return update(index, _emptyValue);
      }
      const lastTag = tags?.at(-1);
      if (lastTag?.[keyProperty]) {
        originalRemove(index);
        originalAppend(_emptyValue, { shouldFocus: false });
        return;
      }
      originalRemove(index);
    },
    [_emptyValue, getTagsValues, keyProperty, originalAppend, originalRemove, update],
  );

  return {
    form: internalForm,
    ...fieldArrayMethods,
    originalAppend,
    update,
    originalRemove,
    appendIfPossible,
    removeOrUpdate,
    getTagsValues,
  };
}

export type UseTagAssignmentFieldArrayReturn<
  T extends FieldValues = FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
> = ReturnType<typeof useTagAssignmentFieldArray<T, K, V>>;
```

--------------------------------------------------------------------------------

---[FILE: useTagAssignmentForm.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/hooks/useTagAssignmentForm.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { IntlProvider } from 'react-intl';

import { useTagAssignmentForm } from './useTagAssignmentForm';

const DefaultWrapper = ({ children }: { children: React.ReactNode }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

describe('useTagAssignmentForm', () => {
  it('should use passed form as prop', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ input: string; tags: { key: string; value: undefined }[] }>({ defaultValues: { input: 'test_input' } }),
    );
    const { result } = renderHook(
      () =>
        useTagAssignmentForm({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          form: formResult.current,
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { wrapper: DefaultWrapper },
    );
    const values = result.current.form.getValues();
    expect(values.tags).toStrictEqual([{ key: '', value: undefined }]);
    expect(values.input).toBe('test_input');
  });

  it('should use context form if no form prop is passed', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm<{ input: string; tags: { key: string; value: undefined }[] }>({
        defaultValues: { input: 'test_input' },
      });
      return (
        <FormProvider {...methods}>
          <IntlProvider locale="en">{children}</IntlProvider>
        </FormProvider>
      );
    };

    const { result } = renderHook(
      () =>
        useTagAssignmentForm({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { wrapper: Wrapper },
    );

    const values = result.current.form.getValues();
    expect(values['tags']).toStrictEqual([{ key: '', value: undefined }]);
    expect(values['input']).toBe('test_input');
  });

  it('should add an empty value on default values provided by form context', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm<{ input: string; tags: { key: string; value: string | undefined }[] }>({
        defaultValues: { input: 'test_input', tags: [{ key: 'defaultKey', value: 'defaultValue' }] },
      });
      return (
        <FormProvider {...methods}>
          <IntlProvider locale="en">{children}</IntlProvider>
        </FormProvider>
      );
    };

    const { result } = renderHook(
      () =>
        useTagAssignmentForm({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { wrapper: Wrapper },
    );

    const values = result.current.form.getValues();
    expect(values['tags']).toStrictEqual([
      { key: 'defaultKey', value: 'defaultValue' },
      { key: '', value: undefined },
    ]);
    expect(values['input']).toBe('test_input');
  });

  it('should throw an error if no form is passed and not in a form context', () => {
    expect(() =>
      renderHook(
        () =>
          useTagAssignmentForm({
            name: 'tags',
            emptyValue: { key: '', value: undefined },
            keyProperty: 'key',
            valueProperty: 'value',
          }),
        { wrapper: DefaultWrapper },
      ),
    ).toThrow('Nest your component on a FormProvider or pass a form prop');
  });

  it('should throw an error if default values are passed and in a form context', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm<{ input: string; tags: { key: string; value: string | undefined }[] }>({
        defaultValues: { input: 'test_input' },
      });
      return (
        <FormProvider {...methods}>
          <IntlProvider locale="en">{children}</IntlProvider>
        </FormProvider>
      );
    };

    expect(() =>
      renderHook(
        () =>
          useTagAssignmentForm({
            name: 'tags',
            emptyValue: { key: '', value: undefined },
            keyProperty: 'key',
            valueProperty: 'value',
            defaultValues: [{ key: 'defaultKey', value: 'defaultValue' }],
          }),
        { wrapper: Wrapper },
      ),
    ).toThrow('Define defaultValues at form context level');
  });

  it('should use empty value if no default values are passed', () => {
    const { result: formResult } = renderHook(() => useForm());
    const { result } = renderHook(
      () =>
        useTagAssignmentForm({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          keyProperty: 'key',
          valueProperty: 'value',
          form: formResult.current,
        }),
      { wrapper: DefaultWrapper },
    );

    const values = result.current.form.getValues();
    expect(values['tags']).toStrictEqual([{ key: '', value: undefined }]);
  });

  it('should use default values + empty value if default values are passed', () => {
    const { result: formResult } = renderHook(() => useForm<{ tags: { key: string; value: string | undefined }[] }>());
    const defaultValues = [{ key: 'defaultKey', value: 'defaultValue' }];
    const { result } = renderHook(
      () =>
        useTagAssignmentForm<{ tags: { key: string; value: string | undefined }[] }>({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          defaultValues,
          form: formResult.current,
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { wrapper: DefaultWrapper },
    );

    const values = result.current.form.getValues();
    expect(values.tags).toStrictEqual([
      { key: 'defaultKey', value: 'defaultValue' },
      { key: '', value: undefined },
    ]);
  });

  it('should not add the empty value to the form if maxLength is reached', () => {
    const { result: formResult } = renderHook(() => useForm<{ tags: { key: string; value: string | undefined }[] }>());
    const defaultValues = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ];
    const { result } = renderHook(
      () =>
        useTagAssignmentForm<{ tags: { key: string; value: string | undefined }[] }>({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          defaultValues,
          maxLength: 2,
          form: formResult.current,
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { wrapper: DefaultWrapper },
    );

    const values = result.current.form.getValues();
    expect(values.tags).toStrictEqual([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ]);
  });

  it('should wait for loading before resetting', () => {
    const { result: formResult } = renderHook(() => useForm());
    const { result, rerender } = renderHook(
      ({ loading }) =>
        useTagAssignmentForm({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          loading,
          form: formResult.current,
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { initialProps: { loading: true }, wrapper: DefaultWrapper },
    );

    const initialValues = result.current.form.getValues();
    expect(initialValues['tags']).toStrictEqual([]);

    rerender({ loading: false });

    const values = result.current.form.getValues();
    expect(values['tags']).toStrictEqual([{ key: '', value: undefined }]);
  });

  it('should not override the other filled values when setting default values', () => {
    const { result: formResult } = renderHook(() =>
      useForm<{ tags: { key: string; value: string | undefined }[]; input1: string; input2: string }>({
        defaultValues: {
          input1: 'test_input1',
          input2: 'test_input2',
        },
      }),
    );
    const { result } = renderHook(
      () =>
        useTagAssignmentForm({
          name: 'tags',
          emptyValue: { key: '', value: undefined },
          form: formResult.current,
          keyProperty: 'key',
          valueProperty: 'value',
        }),
      { wrapper: DefaultWrapper },
    );

    const values = result.current.form.getValues();
    expect(values.tags).toStrictEqual([{ key: '', value: undefined }]);
    expect(values.input1).toBe('test_input1');
    expect(values.input2).toBe('test_input2');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useTagAssignmentForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/hooks/useTagAssignmentForm.tsx
Signals: React

```typescript
import invariant from 'invariant';
import { useEffect, useState } from 'react';
import type { ArrayPath, FieldArray, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { useTagAssignmentFieldArray } from './useTagAssignmentFieldArray';

export interface UseTagAssignmentProps<
  T extends FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
> {
  name: K;
  maxLength?: number;
  emptyValue: V;
  loading?: boolean;
  defaultValues?: V[];
  form?: UseFormReturn<T>;
  keyProperty: keyof V extends string ? keyof V : never;
  valueProperty: keyof V extends string ? keyof V : never;
}

export function useTagAssignmentForm<
  T extends FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
>({
  name,
  maxLength,
  emptyValue,
  defaultValues,
  loading,
  form,
  keyProperty,
  valueProperty,
}: UseTagAssignmentProps<T, K, V>) {
  const [_emptyValue] = useState(emptyValue);

  const formCtx = useFormContext<T>();
  const shouldUseFormContext = Boolean(formCtx) && !form;
  const internalForm = shouldUseFormContext ? formCtx : form;

  invariant(internalForm, 'Nest your component on a FormProvider or pass a form prop');
  invariant(!(defaultValues && shouldUseFormContext), 'Define defaultValues at form context level');

  const { setValue } = internalForm;

  const fieldArrayMethods = useTagAssignmentFieldArray({
    name,
    maxLength,
    emptyValue,
    form: internalForm,
    keyProperty,
  });
  const getTagsValues = fieldArrayMethods.getTagsValues;

  useEffect(() => {
    if (loading) return;
    if (defaultValues) {
      const newValues = [...defaultValues];
      if (!maxLength || (maxLength && newValues.length < maxLength)) {
        newValues.push(_emptyValue);
      }
      setValue(name as Path<T>, newValues as PathValue<T, Path<T>>);
      return;
    }

    if (shouldUseFormContext) {
      const existentValues = getTagsValues() ?? [];
      if (!maxLength || (maxLength && existentValues.length < maxLength)) {
        existentValues.push(_emptyValue);
      }
      setValue(name as Path<T>, existentValues as PathValue<T, Path<T>>);
      return;
    }

    setValue(name as Path<T>, [_emptyValue] as PathValue<T, Path<T>>);
  }, [defaultValues, setValue, loading, maxLength, name, _emptyValue, shouldUseFormContext, getTagsValues]);

  return {
    ...fieldArrayMethods,
    form: internalForm,
    maxLength,
    emptyValue,
    name,
    keyProperty,
    valueProperty,
  };
}

export type UseTagAssignmentFormReturn<
  T extends FieldValues = FieldValues,
  K extends ArrayPath<T> = ArrayPath<T>,
  V extends FieldArray<T, K> = FieldArray<T, K>,
> = ReturnType<typeof useTagAssignmentForm<T, K, V>>;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/test-utils/index.ts

```typescript
export { TestTagAssignmentContextProvider } from './TestTagAssignmentContextProvider';
```

--------------------------------------------------------------------------------

---[FILE: TestTagAssignmentContextProvider.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/unified-tagging/test-utils/TestTagAssignmentContextProvider.tsx

```typescript
import { FormProvider, useForm } from 'react-hook-form';

import { TagAssignmentContext } from '../context/TagAssignmentContextProvider';
import { useTagAssignmentForm } from '../hooks/useTagAssignmentForm';

interface TestFormI {
  tags: {
    key: string;
    value: string;
  }[];
}

interface TestTagAssignmentContextProviderProps extends Partial<ReturnType<typeof useTagAssignmentForm<TestFormI>>> {
  children: React.ReactNode;
}

export function TestTagAssignmentContextProvider({ children, ...props }: TestTagAssignmentContextProviderProps) {
  const form = useForm<TestFormI>();
  const tagForm = useTagAssignmentForm<TestFormI, 'tags', { key: string; value: string }>({
    form,
    name: 'tags',
    emptyValue: { key: '', value: '' },
    keyProperty: 'key',
    valueProperty: 'value',
  });
  return (
    <FormProvider {...form}>
      <TagAssignmentContext.Provider
        value={{
          ...(tagForm as any),
          ...props,
        }}
      >
        {children}
      </TagAssignmentContext.Provider>
    </FormProvider>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: coerceToEnum.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/utils/coerceToEnum.ts

```typescript
export function coerceToEnum<T extends Record<string, string>, K extends keyof T, V extends T[K] | undefined>(
  enumObj: T,
  value: any,
  fallback: V,
): V | T[keyof T] {
  if (value === undefined || value === null || typeof value !== 'string') {
    return fallback;
  }
  for (const v in enumObj) {
    if (enumObj[v] === value) return enumObj[v];
  }
  return fallback;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/utils/index.ts

```typescript
export * from './coerceToEnum';
export * from './unified-details';
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/utils/unified-details/index.tsx
Signals: React

```typescript
import { GenericSkeleton, ParagraphSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import useResponsiveContainer from './useResponsiveContainer';

export interface AsideSectionProps {
  id: string;
  title?: ReactNode;
  content: ReactNode;
  isTitleLoading?: boolean;
}

export type MaybeAsideSection = AsideSectionProps | null;
export type AsideSections = Array<MaybeAsideSection>;

const SIDEBAR_WIDTHS = {
  sm: 316,
  lg: 480,
} as const;
const VERTICAL_MARGIN_PX = 16;
const DEFAULT_MAX_WIDTH = 450;

export const OverviewLayout = ({
  isLoading,
  asideSections,
  children,
  isTabLayout = true,
  sidebarSize = 'sm',
  verticalStackOrder,
}: {
  isLoading?: boolean;
  asideSections: AsideSections;
  children: ReactNode;
  isTabLayout?: boolean;
  sidebarSize?: 'sm' | 'lg';
  verticalStackOrder?: 'main-first' | 'aside-first';
}) => {
  const { theme } = useDesignSystemTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const stackVertically = useResponsiveContainer(containerRef, { small: theme.responsive.breakpoints.lg }) === 'small';

  // Determine vertical stack order, i.e. should the main content be on top or bottom
  const verticalDisplayPrimaryContentOnTop = verticalStackOrder === 'main-first';

  const totalSidebarWidth = SIDEBAR_WIDTHS[sidebarSize];
  const innerSidebarWidth = totalSidebarWidth - VERTICAL_MARGIN_PX;

  const secondaryStackedStyles = stackVertically
    ? verticalDisplayPrimaryContentOnTop
      ? { width: '100%' }
      : { borderBottom: `1px solid ${theme.colors.border}`, width: '100%' }
    : verticalDisplayPrimaryContentOnTop
    ? {
        width: innerSidebarWidth,
      }
    : {
        paddingBottom: theme.spacing.sm,
        width: innerSidebarWidth,
      };

  return (
    <div
      data-testid="entity-overview-container"
      ref={containerRef}
      css={{
        display: 'flex',
        flexDirection: stackVertically ? (verticalDisplayPrimaryContentOnTop ? 'column' : 'column-reverse') : 'row',
        gap: theme.spacing.lg,
      }}
    >
      <div
        css={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          gap: theme.spacing.md,
          width: stackVertically ? '100%' : `calc(100% - ${totalSidebarWidth}px)`,
        }}
      >
        {isLoading ? <GenericSkeleton /> : children}
      </div>
      <div
        style={{
          display: 'flex',
          ...(isTabLayout && { marginTop: -theme.spacing.md }), // remove the gap between tab list and sidebar content
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
            ...secondaryStackedStyles,
          }}
        >
          {isLoading && <GenericSkeleton />}
          {!isLoading && <SidebarWrapper secondarySections={asideSections} />}
        </div>
      </div>
    </div>
  );
};

const SidebarWrapper = ({ secondarySections }: { secondarySections: AsideSections }) => {
  return (
    <div>
      {secondarySections
        .filter((section) => section !== null)
        .filter((section) => section?.content !== null)
        .map(({ title, isTitleLoading, content, id }, index) => (
          <AsideSection title={title} isTitleLoading={isTitleLoading} content={content} key={id} index={index} />
        ))}
    </div>
  );
};

export const AsideSectionTitle = ({ children }: { children: ReactNode }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <Typography.Title
      level={4}
      style={{
        whiteSpace: 'nowrap',
        marginRight: theme.spacing.lg,
        marginTop: 0,
      }}
    >
      {children}
    </Typography.Title>
  );
};

const AsideSection = ({
  title,
  content,
  index,
  isTitleLoading = false,
}: Omit<AsideSectionProps, 'id'> & {
  index: number;
}) => {
  const { theme } = useDesignSystemTheme();

  const titleComponent = isTitleLoading ? (
    <ParagraphSkeleton
      label={
        <FormattedMessage
          defaultMessage="Section title loading"
          description="Loading skeleton label for overview page section title in Catalog Explorer"
        />
      }
    />
  ) : title ? (
    <AsideSectionTitle>{title}</AsideSectionTitle>
  ) : null;

  const compactStyles = { padding: `${theme.spacing.md}px 0 ${theme.spacing.md}px 0` };

  return (
    <div
      css={{
        ...compactStyles,
        ...(index === 0 ? {} : { borderTop: `1px solid ${theme.colors.border}` }),
      }}
    >
      {titleComponent}
      {content}
    </div>
  );
};

export const KeyValueProperty = ({
  keyValue,
  value,
  maxWidth,
}: {
  keyValue: string;
  value: React.ReactNode;
  maxWidth?: number | string;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      data-testid={`key-value-${keyValue}`}
      css={{
        display: 'flex',
        alignItems: 'center',
        '&:has(+ div)': {
          marginBottom: theme.spacing.xs,
        },
        maxWidth: maxWidth ?? DEFAULT_MAX_WIDTH,
        wordBreak: 'break-word',
        lineHeight: theme.typography.lineHeightLg,
      }}
    >
      <div
        css={{
          color: theme.colors.textSecondary,
          flex: 0.5,
          alignSelf: 'start',
        }}
      >
        {keyValue}
      </div>
      <div
        css={{
          flex: 1,
          alignSelf: 'start',
          overflow: 'hidden',
        }}
      >
        {value}
      </div>
    </div>
  );
};

export const NoneCell = () => {
  return (
    <Typography.Text color="secondary">
      <FormattedMessage defaultMessage="None" description="Cell value when there's no content" />
    </Typography.Text>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useResponsiveContainer.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/utils/unified-details/useResponsiveContainer.ts
Signals: React

```typescript
import type { RefObject } from 'react';
import { useState, useEffect } from 'react';

interface SizeMap {
  [key: string]: number;
}

function useResponsiveContainer(ref: RefObject<HTMLElement>, sizeMap: SizeMap): string | null {
  const [matchedSize, setMatchedSize] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current && sizeMap) {
      const handleResize = () => {
        if (!ref.current) {
          return;
        }
        const elementWidth = ref.current.offsetWidth;
        const matchedKey = Object.keys(sizeMap)
          .filter((key) => sizeMap[key] >= elementWidth)
          .sort((a, b) => sizeMap[a] - sizeMap[b])[0];

        setMatchedSize(matchedKey);
      };

      handleResize();

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(ref.current);

      return () => resizeObserver.disconnect();
    }
    return undefined;
  }, [ref, sizeMap]);

  return matchedSize;
}

export default useResponsiveContainer;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/zustand/index.ts

```typescript
// eslint-disable-next-line import/no-extraneous-dependencies
export * from 'zustand';
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/index.ts

```typescript
/**
 * Telemetry module
 *
 * Provides telemetry logging functionality using a SharedWorker
 * to coordinate logging across multiple browser tabs.
 */

export { telemetryClient } from './TelemetryClient';
export type { TelemetryRecord } from './worker/types';
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/server/js/src/telemetry/README.md

```text
# MLflow UI Telemetry

## Overview

Telemetry in MLflow's UI is based on a [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker), which is a type of web worker that can be accessed by multiple tabs. This allows us to effectively consolidate and batch logs.

## Architecture

### Client

**TelemetryClient.ts**:

- Client API for logging events. A singleton is exported from this file, and
  is imported / used in `app.tsx` (the top-level MLflow frontend component).
- We hook into the built-in `DesignSystemEventProvider`, which generates view and click events for every interactive component.
- When `logEvent` is called, the client forwards the log to the SharedWorker via postMessage

### SharedWorker

**TelemetryLogger.worker.ts**:

- Main worker class that handles communication with the `/ui-telemetry` server endpoint.
- Please keep external dependencies here minimal, as it is bundled separately from the main app and we'd ideally keep the generated bundle relatively light (see the `telemetry-worker` entrypoint in `craco.config.js`)

**LogQueue.ts**:

- Simple class that batches logs and uploads them to the server every 15s.
```

--------------------------------------------------------------------------------

---[FILE: TelemetryClient.ts]---
Location: mlflow-master/mlflow/server/js/src/telemetry/TelemetryClient.ts

```typescript
/**
 * TelemetryLogger client
 *
 * Wrapper for interacting with the TelemetryLogger SharedWorker.
 * Provides a simple API for logging telemetry events.
 */
import type { TelemetryRecord } from './worker/types';
import { isDesignSystemEvent, TELEMETRY_ENABLED_STORAGE_KEY, TELEMETRY_ENABLED_STORAGE_VERSION } from './utils';
import { WorkerToClientMessageType, ClientToWorkerMessageType } from './worker/types';
import { getLocalStorageItem } from '../shared/web-shared/hooks/useLocalStorage';

const LOCAL_STORAGE_INSTALLATION_ID_KEY = 'mlflow-telemetry-installation-id';

class TelemetryClient {
  private installationId: string = this.getInstallationId();
  private port: MessagePort | null = null;
  private ready: Promise<boolean> = this.initWorker();

  private getInstallationId(): string {
    // not using `getLocalStorageItem` because this key is not used in react
    const localStorageInstallationId = localStorage.getItem(LOCAL_STORAGE_INSTALLATION_ID_KEY);

    if (!localStorageInstallationId) {
      const installationId = crypto.randomUUID();
      localStorage.setItem(LOCAL_STORAGE_INSTALLATION_ID_KEY, installationId);
      return installationId;
    } else {
      return localStorageInstallationId;
    }
  }

  private getTelemetryEnabled(): boolean {
    // need to use the function from web-shared because this key is
    // changed using `useLocalStorage` inside the settings page, which
    // appends the version to the key.
    const telemetryEnabled = getLocalStorageItem(
      TELEMETRY_ENABLED_STORAGE_KEY,
      TELEMETRY_ENABLED_STORAGE_VERSION,
      // default to true as the feature is opt-out
      true,
    );

    return telemetryEnabled;
  }

  private initWorker(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // if telemetry is disabled, we don't need to initialize the worker at all
        if (!this.getTelemetryEnabled()) {
          resolve(false);
          return;
        }

        // Create SharedWorker instance
        this.port = new SharedWorker(new URL('./worker/TelemetryLogger.worker.ts', import.meta.url), {
          name: 'telemetry-worker',
        }).port;

        if (!this.port) {
          resolve(false);
          return;
        }

        const handleReadyMessage = (event: MessageEvent): void => {
          if (event.data.type === WorkerToClientMessageType.READY) {
            resolve(true);
          }
        };

        // Listen for the "READY" message from worker
        this.port.onmessage = handleReadyMessage;
      } catch (error) {
        console.error('[TelemetryLogger] Failed to initialize SharedWorker:', error);
        resolve(false);
      }
    });
  }

  /**
   * Log a telemetry event
   */
  public async logEvent(record: any): Promise<void> {
    const isReady = await this.ready;
    if (!isReady || !this.port) {
      return;
    }

    if (!isDesignSystemEvent(record)) {
      return;
    }

    // drop view events to reduce noise
    if (record.eventType === 'onView') {
      return;
    }

    // session_id is generated by the worker
    const payload: Omit<TelemetryRecord, 'session_id'> = {
      installation_id: this.installationId,
      event_name: 'ui_event',
      // convert from ms to ns
      timestamp_ns: Date.now() * 1e6,
      params: {
        componentId: record.componentId,
        componentViewId: record.componentViewId,
        componentType: record.componentType,
        componentSubType: record.componentSubType,
        eventType: record.eventType,
      },
    };

    this.port?.postMessage({
      type: ClientToWorkerMessageType.LOG_EVENT,
      payload,
    });
  }

  public shutdown(): void {
    this.port?.postMessage({
      type: ClientToWorkerMessageType.SHUTDOWN,
    });
    this.port = null;
  }

  // used for restarting the worker after a shutdown
  public start(): void {
    this.ready = this.initWorker();
  }
}

// Singleton instance
export const telemetryClient: TelemetryClient = new TelemetryClient();
```

--------------------------------------------------------------------------------

````

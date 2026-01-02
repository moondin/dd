---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 653
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 653 of 991)

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

---[FILE: useOverrideAssessment.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useOverrideAssessment.test.tsx
Signals: React

```typescript
import { describe, jest, beforeAll, beforeEach, it, expect, afterEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { QueryClientProvider, QueryClient } from '@databricks/web-shared/query-client';

import { useOverrideAssessment } from './useOverrideAssessment';
import { useTraceCachedActions } from './useTraceCachedActions';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment, ModelTraceInfoV3, ModelTraceLocation } from '../ModelTrace.types';
import type { CreateAssessmentPayload } from '../api';
import { ModelTraceExplorerUpdateTraceContextProvider } from '../contexts/UpdateTraceContext';

jest.mock('../FeatureUtils', () => ({
  shouldUseTracesV4API: jest.fn(),
  doesTraceSupportV4API: jest.fn(() => true),
}));

jest.mock('@databricks/web-shared/global-settings', () => ({
  getUser: jest.fn(() => 'test-user@databricks.com'),
  getOrgID: jest.fn(() => '123456'),
}));

describe('useOverrideAssessment', () => {
  const server = setupServer();
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());

  const mockTraceLocation: ModelTraceLocation = {
    type: 'UC_SCHEMA',
    uc_schema: {
      catalog_name: 'my_catalog',
      schema_name: 'my_schema',
    },
  };

  const mockTraceInfo: ModelTraceInfoV3 = {
    trace_id: 'trace-123',
    trace_location: mockTraceLocation,
    request_time: '2025-02-19T09:52:23.140Z',
    state: 'OK',
    tags: {},
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
              },
            })
          }
        >
          <ModelTraceExplorerUpdateTraceContextProvider modelTraceInfo={mockTraceInfo} sqlWarehouseId="warehouse-123">
            {children}
          </ModelTraceExplorerUpdateTraceContextProvider>
        </QueryClientProvider>
      </DesignSystemProvider>
    </IntlProvider>
  );

  const mockOldAssessment: Assessment = {
    assessment_id: 'assessment-old-123',
    assessment_name: 'Correctness',
    trace_id: 'trace-123',
    source: {
      source_type: 'LLM_JUDGE',
      source_id: 'databricks',
    },
    feedback: {
      value: 'no',
    },
    create_time: '2025-11-16T10:00:00.000Z',
    last_update_time: '2025-11-16T10:00:00.000Z',
    valid: true,
  } as Assessment;

  const mockNewAssessmentResponse = {
    assessment: {
      assessment_id: 'assessment-new-456',
      assessment_name: 'Correctness',
      trace_id: 'trace-123',
      source: {
        source_type: 'HUMAN',
        source_id: 'test-user@databricks.com',
      },
      feedback: {
        value: 'yes',
      },
      overrides: 'assessment-old-123',
      create_time: '2025-11-16T12:00:00.000Z',
      last_update_time: '2025-11-16T12:00:00.000Z',
      valid: true,
    } as Assessment,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() => useTraceCachedActions()).result.current.resetCache();
  });

  describe('when V4 API is disabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(false);
      server.use(
        rest.post('*/ajax-api/*/mlflow/traces/trace-123/assessments', async (req, res, ctx) =>
          res(ctx.json(mockNewAssessmentResponse)),
        ),
      );
    });

    it('should override assessment using V3 API', async () => {
      const createSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.post('*/ajax-api/*/mlflow/traces/trace-123/assessments', async (req, res, ctx) => {
          createSpy(await req.json());
          return res(ctx.json(mockNewAssessmentResponse));
        }),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useOverrideAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      result.current.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
        rationale: 'Human override',
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(createSpy).toHaveBeenCalled();

      const payload = createSpy.mock.calls[0][0] as CreateAssessmentPayload;
      expect(payload.assessment.overrides).toBe('assessment-old-123');
      expect(payload.assessment.source.source_type).toBe('HUMAN');
    });

    it('should not update cache when V4 API is disabled', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          overrideHook: useOverrideAssessment({ traceId: 'trace-123', onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.overrideHook.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(result.current.cacheHook.assessmentActions['trace-123']).toBeUndefined();
    });
  });

  describe('when V4 API is enabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(true);
      server.use(
        rest.post('*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments', async (req, res, ctx) =>
          res(ctx.json(mockNewAssessmentResponse)),
        ),
      );
    });

    it('should override assessment using V4 API', async () => {
      const createSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.post('*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments', async (req, res, ctx) => {
          createSpy(await req.json());
          return res(ctx.json(mockNewAssessmentResponse));
        }),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useOverrideAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      result.current.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
        rationale: 'Human override',
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(createSpy).toHaveBeenCalled();
    });

    it('should add new assessment to cache and delete old assessment', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          overrideHook: useOverrideAssessment({ traceId: 'trace-123', onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.overrideHook.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      expect(actions).toHaveLength(2);
      expect(actions[0]).toMatchObject({
        action: 'ADD',
        assessment: expect.objectContaining({
          assessment_id: 'assessment-new-456',
        }),
      });
      expect(actions[1]).toMatchObject({
        action: 'DELETE',
        assessment: expect.objectContaining({
          assessment_id: 'assessment-old-123',
        }),
      });
    });

    it('should populate overriddenAssessment field in new assessment', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          overrideHook: useOverrideAssessment({ traceId: 'trace-123', onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.overrideHook.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      const addedAssessment = actions[0].assessment;
      expect(addedAssessment?.overriddenAssessment).toEqual(mockOldAssessment);
    });

    it('should include rationale in override', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useOverrideAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      result.current.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
        rationale: 'The agent actually performed correctly',
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should handle expectation overrides', async () => {
      server.resetHandlers();
      server.use(
        rest.post('*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments', async (req, res, ctx) =>
          res(
            ctx.json({
              assessment: {
                ...mockNewAssessmentResponse.assessment,
                expectation: { value: '{"key": "value"}' },
              },
            }),
          ),
        ),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useOverrideAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      const oldExpectation = { ...mockOldAssessment, expectation: { value: '{"old": "value"}' } };
      result.current.overrideAssessmentMutation({
        oldAssessment: oldExpectation as Assessment,
        value: { expectation: { value: '{"key": "value"}' } },
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should call onSettled callback', async () => {
      const onSuccess = jest.fn();
      const onSettled = jest.fn();
      const { result } = renderHook(() => useOverrideAssessment({ traceId: 'trace-123', onSuccess, onSettled }), {
        wrapper,
      });

      result.current.overrideAssessmentMutation({
        oldAssessment: mockOldAssessment,
        value: { feedback: { value: 'yes' } },
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(onSettled).toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useOverrideAssessment.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useOverrideAssessment.tsx

```typescript
import { isObject, omit } from 'lodash';

import { useIntl } from '@databricks/i18n';
import { getUser } from '@databricks/web-shared/global-settings';
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';

import { invalidateMlflowSearchTracesCache } from './invalidateMlflowSearchTracesCache';
import { useTraceCachedActions } from './useTraceCachedActions';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment, Expectation, Feedback } from '../ModelTrace.types';
import {
  displayErrorNotification,
  doesTraceSupportV4API,
  FETCH_TRACE_INFO_QUERY_KEY,
  isV3ModelTraceInfo,
} from '../ModelTraceExplorer.utils';
import type { CreateAssessmentPayload, CreateAssessmentV3Response, CreateAssessmentV4Response } from '../api';
import { createAssessment, TracesServiceV4 } from '../api';
import { useModelTraceExplorerUpdateTraceContext } from '../contexts/UpdateTraceContext';

export const useOverrideAssessment = ({
  traceId,
  onSuccess,
  onError,
  onSettled,
}: {
  traceId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const logCachedUpdateAction = useTraceCachedActions((state) => state.logAddedAssessment);
  const logCachedDeleteAction = useTraceCachedActions((state) => state.logRemovedAssessment);
  const updateTraceVariables = useModelTraceExplorerUpdateTraceContext();

  const { mutate: overrideAssessmentMutation, isLoading } = useMutation({
    mutationFn: ({
      oldAssessment,
      value,
      rationale,
    }: {
      oldAssessment: Assessment;
      value: { feedback: Feedback } | { expectation: Expectation };
      rationale?: string;
    }): Promise<CreateAssessmentV4Response | CreateAssessmentV3Response> => {
      const newAssessment: Assessment = {
        ...oldAssessment,
        ...value,
        rationale,
        source: {
          source_id: getUser() ?? '',
          source_type: 'HUMAN',
        },
        overrides: oldAssessment.assessment_id,
      };
      const payload: CreateAssessmentPayload = {
        assessment: omit(newAssessment, 'assessment_id', 'create_time', 'last_update_time', 'overriddenAssessments'),
      };

      // TODO: Squash all this logic into a single util function (in both model-trace-explorer and genai-traces-table)
      if (
        shouldUseTracesV4API() &&
        updateTraceVariables.modelTraceInfo &&
        isV3ModelTraceInfo(updateTraceVariables.modelTraceInfo) &&
        doesTraceSupportV4API(updateTraceVariables.modelTraceInfo)
      ) {
        return TracesServiceV4.createAssessmentV4({
          payload,
          traceLocation: updateTraceVariables.modelTraceInfo.trace_location,
        });
      }

      return createAssessment({ payload });
    },
    onError: (error: any) => {
      displayErrorNotification(
        intl.formatMessage(
          {
            defaultMessage: 'Failed to override assessment. Error: {error}',
            description: 'Error message when overriding an assessment fails',
          },
          {
            error: error instanceof Error ? error.message : String(error),
          },
        ),
      );
      onError?.(error);
    },
    onSuccess: (updatedAssessment: CreateAssessmentV4Response | CreateAssessmentV3Response, variables) => {
      if (shouldUseTracesV4API() && isObject(updatedAssessment)) {
        const assessment = 'assessment' in updatedAssessment ? updatedAssessment.assessment : updatedAssessment;
        assessment.overriddenAssessment = variables.oldAssessment;
        logCachedUpdateAction(traceId, assessment);
        logCachedDeleteAction(traceId, variables.oldAssessment);
      }
      queryClient.invalidateQueries({ queryKey: [FETCH_TRACE_INFO_QUERY_KEY, traceId] });
      updateTraceVariables.invalidateTraceQuery?.(traceId);
      invalidateMlflowSearchTracesCache({ queryClient });
      onSuccess?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return {
    overrideAssessmentMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useTraceCachedActions.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useTraceCachedActions.test.tsx

```typescript
import { describe, beforeEach, it, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

import { useTraceCachedActions } from './useTraceCachedActions';
import type { Assessment } from '../ModelTrace.types';

describe('useTraceCachedActions', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useTraceCachedActions());
    act(() => {
      result.current.resetCache();
    });
  });

  const mockAssessment: Assessment = {
    assessment_id: 'test-id-1',
    name: 'Test Assessment',
    trace_id: 'trace-1',
  } as any;

  describe('reconstructAssessments', () => {
    it('should apply multiple add and delete operations in sequence', () => {
      const { result } = renderHook(() => useTraceCachedActions());
      const assessment2: Assessment = {
        assessment_id: 'test-id-2',
        name: 'Second Assessment',
        trace_id: 'trace-1',
      } as any;
      const initial: Assessment[] = [mockAssessment, { assessment_id: 'existing-1' } as any];

      act(() => {
        result.current.logAddedAssessment('trace-1', assessment2);
        result.current.logAddedAssessment('trace-1', { assessment_id: 'test-id-3' } as any);
        result.current.logRemovedAssessment('trace-1', mockAssessment);
      });

      const reconstructed = result.current.reconstructAssessments(initial, result.current.assessmentActions['trace-1']);

      expect(reconstructed).toHaveLength(3);
      expect(reconstructed[0].assessment_id).toBe('test-id-3');
      expect(reconstructed[1].assessment_id).toBe('test-id-2');
      expect(reconstructed[2].assessment_id).toBe('existing-1');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useTraceCachedActions.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useTraceCachedActions.tsx

```typescript
import { create } from '@databricks/web-shared/zustand';

import type { Assessment } from '../ModelTrace.types';

type TraceActionCacheAction = { action: 'ADD' | 'DELETE'; assessment?: Assessment };

export const useTraceCachedActions = create<{
  assessmentActions: Record<string, TraceActionCacheAction[]>;
  /**
   * Log an added or updated assessment
   */
  logAddedAssessment: (traceId: string, assessment: Assessment) => void;
  /**
   * Log a removed assessment
   */
  logRemovedAssessment: (traceId: string, assessment: Assessment) => void;
  /**
   * Reconstruct the list of assessments by applying cached actions on top of the initial list
   */
  reconstructAssessments: (initialAssessments: Assessment[], actions: TraceActionCacheAction[]) => Assessment[];
  resetCache: () => void;
}>((set) => ({
  assessmentActions: {},
  resetCache: () => set(() => ({ assessmentActions: {} })),
  logAddedAssessment: (traceId: string, assessment?: Assessment) =>
    set((state) => {
      if (!assessment) {
        return state;
      }
      return {
        assessmentActions: {
          ...state.assessmentActions,
          [traceId]: [...(state.assessmentActions[traceId] || []), { action: 'ADD', assessment }],
        },
      };
    }),
  logRemovedAssessment: (traceId: string, assessment: Assessment) =>
    set((state) => {
      if (!assessment) {
        return state;
      }
      return {
        assessmentActions: {
          ...state.assessmentActions,
          [traceId]: [...(state.assessmentActions[traceId] || []), { action: 'DELETE', assessment }],
        },
      };
    }),
  reconstructAssessments: (initialAssessments: Assessment[], actions?: TraceActionCacheAction[]) => {
    if (!actions) {
      return initialAssessments;
    }
    let assessments = [...initialAssessments];
    actions.forEach(({ action, assessment }) => {
      if (action === 'ADD' && assessment) {
        assessments.unshift(assessment);
      } else if (action === 'DELETE' && assessment) {
        assessments = assessments.filter((a) => a.assessment_id !== assessment.assessment_id);
      }
    });
    return assessments;
  },
}));
```

--------------------------------------------------------------------------------

---[FILE: useUnifiedTraceTagsModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useUnifiedTraceTagsModal.tsx
Signals: React

```typescript
import { isArray, isObject } from 'lodash';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, Button, Modal, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import {
  TagAssignmentKey,
  TagAssignmentLabel,
  TagAssignmentRemoveButton,
  TagAssignmentRoot,
  TagAssignmentRow,
  TagAssignmentValue,
  useTagAssignmentForm,
} from '@databricks/web-shared/unified-tagging';

import { useUpdateTraceTagsMutation } from './useUpdateTraceTagsMutation';
import type { ModelTrace } from '../ModelTrace.types';
import { MLFLOW_INTERNAL_PREFIX } from '../TagUtils';

const emptyValue = { key: '', value: '' };

type KeyValueEntity = {
  key: string;
  value: string;
};

export const useUnifiedTraceTagsModal = ({
  componentIdPrefix,
  onSuccess,
  onClose,
}: {
  componentIdPrefix: string;
  onSuccess?: () => void;
  onClose?: () => void;
}) => {
  const baseComponentId = `${componentIdPrefix}.tag-assignment-modal`;
  const intl = useIntl();

  const [editedTraceInfo, setEditedTraceInfo] = useState<ModelTrace['info'] | undefined>(undefined);

  const currentTags = useMemo(() => {
    if (!editedTraceInfo) {
      return [];
    }
    if (isArray(editedTraceInfo.tags)) {
      return editedTraceInfo.tags.filter(({ key }) => !key.startsWith(MLFLOW_INTERNAL_PREFIX));
    }
    if (isObject(editedTraceInfo.tags)) {
      return Object.entries(editedTraceInfo.tags)
        .map(([key, value]) => ({ key, value: String(value) }))
        .filter(({ key }) => !key.startsWith(MLFLOW_INTERNAL_PREFIX));
    }
    return [];
  }, [editedTraceInfo]);

  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useDesignSystemTheme();
  const form = useForm<{ tags: KeyValueEntity[] }>({ mode: 'onChange' });

  const tagsForm = useTagAssignmentForm({
    name: 'tags',
    emptyValue: { key: '', value: '' },
    keyProperty: 'key',
    valueProperty: 'value',
    form,
    defaultValues: currentTags,
  });

  const showTagAssignmentModal = (traceInfo: ModelTrace['info']) => {
    setEditedTraceInfo(traceInfo);

    setIsVisible(true);
  };

  const hideTagAssignmentModal = () => {
    setIsVisible(false);
    setEditedTraceInfo(undefined);
    form.reset({ tags: [emptyValue] });
    onClose?.();
  };

  const {
    mutate: commitUpdatedTags,
    isLoading,
    error,
  } = useUpdateTraceTagsMutation({
    onSuccess: () => {
      hideTagAssignmentModal();
      onSuccess?.();
    },
  });

  const handleSubmit = async ({ tags: updatedTags }: { tags: KeyValueEntity[] }) => {
    if (!editedTraceInfo) {
      return;
    }
    const tags: KeyValueEntity[] = updatedTags.filter(({ key }) => Boolean(key));
    const newTags = tags.filter((tag) => !currentTags?.some((t) => t.key === tag.key && t.value === tag.value)) ?? [];
    const deletedTags = currentTags?.filter((tag) => !tags.some((t) => t.key === tag.key)) ?? [];

    // prettier-ignore
    commitUpdatedTags({
      newTags,
      deletedTags,
      modelTraceInfo: editedTraceInfo,
    });
  };

  const TagAssignmentModal = (
    <Modal
      componentId={baseComponentId}
      title={<FormattedMessage defaultMessage="Add tags" description="Title for unified trace tag assignment modal" />}
      visible={isVisible}
      destroyOnClose
      onCancel={hideTagAssignmentModal}
      footer={
        <>
          <Button
            componentId={`${baseComponentId}.submit-button`}
            onClick={hideTagAssignmentModal}
            disabled={isLoading}
          >
            <FormattedMessage
              defaultMessage="Cancel"
              description="Cancel button in unified trace tag assignment modal"
            />
          </Button>
          <Button
            componentId={`${baseComponentId}.submit-button`}
            type="primary"
            onClick={form.handleSubmit(handleSubmit)}
            loading={isLoading}
            disabled={isLoading}
          >
            <FormattedMessage defaultMessage="Save" description="Save button in unified trace tag assignment modal" />
          </Button>
        </>
      }
    >
      {error && (
        <Alert
          type="error"
          message={error instanceof Error ? error.message : String(error)}
          componentId={`${baseComponentId}.error`}
          closable={false}
          css={{ marginBottom: theme.spacing.sm }}
        />
      )}
      <TagAssignmentRoot {...tagsForm}>
        <TagAssignmentRow>
          <TagAssignmentLabel>
            <FormattedMessage defaultMessage="Key" description="Tag key label in unified trace tag assignment modal" />
          </TagAssignmentLabel>
          <TagAssignmentLabel>
            <FormattedMessage
              defaultMessage="Value"
              description="Tag value label in unified trace tag assignment modal"
            />
          </TagAssignmentLabel>
        </TagAssignmentRow>

        {tagsForm.fields.map((field, index) => {
          return (
            <TagAssignmentRow key={field.id}>
              <TagAssignmentKey
                index={index}
                rules={{
                  validate: {
                    unique: (value) => {
                      const tags = tagsForm.getTagsValues();
                      if (tags?.findIndex((tag) => tag.key === value) !== index) {
                        return intl.formatMessage({
                          defaultMessage: 'Key must be unique',
                          description: 'Error message for unique key in trace tag assignment modal',
                        });
                      }
                      return true;
                    },
                    required: (value) => {
                      const tags = tagsForm.getTagsValues();
                      if (tags?.at(index)?.value && !value) {
                        return intl.formatMessage({
                          defaultMessage: 'Key is required if value is present',
                          description: 'Error message for required key in trace tag assignment modal',
                        });
                      }
                      return true;
                    },
                  },
                }}
              />
              <TagAssignmentValue index={index} />
              <TagAssignmentRemoveButton index={index} componentId={`${baseComponentId}.remove-button`} />
            </TagAssignmentRow>
          );
        })}
      </TagAssignmentRoot>
    </Modal>
  );

  return {
    TagAssignmentModal,
    showTagAssignmentModal,
    hideTagAssignmentModal,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useUpdateAssessment.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useUpdateAssessment.test.tsx
Signals: React

```typescript
import { describe, jest, beforeAll, beforeEach, it, expect, afterEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { QueryClientProvider, QueryClient } from '@databricks/web-shared/query-client';

import { useTraceCachedActions } from './useTraceCachedActions';
import { useUpdateAssessment } from './useUpdateAssessment';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment, ModelTraceInfoV3, ModelTraceLocation } from '../ModelTrace.types';
import type { UpdateAssessmentPayload } from '../api';
import { ModelTraceExplorerUpdateTraceContextProvider } from '../contexts/UpdateTraceContext';

jest.mock('../FeatureUtils', () => ({
  shouldUseTracesV4API: jest.fn(),
  doesTraceSupportV4API: jest.fn(() => true),
}));

jest.mock('@databricks/web-shared/global-settings', () => ({
  getUser: jest.fn(() => 'test-user@databricks.com'),
  getOrgID: jest.fn(() => '123456'),
}));

describe('useUpdateAssessment', () => {
  const server = setupServer();
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());

  const mockTraceLocation: ModelTraceLocation = {
    type: 'UC_SCHEMA',
    uc_schema: {
      catalog_name: 'my_catalog',
      schema_name: 'my_schema',
    },
  };

  const mockTraceInfo: ModelTraceInfoV3 = {
    trace_id: 'trace-123',
    trace_location: mockTraceLocation,
    request_time: '2025-02-19T09:52:23.140Z',
    state: 'OK',
    tags: {},
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale="en">
      <DesignSystemProvider>
        <QueryClientProvider client={new QueryClient()}>
          <ModelTraceExplorerUpdateTraceContextProvider modelTraceInfo={mockTraceInfo} sqlWarehouseId="warehouse-123">
            {children}
          </ModelTraceExplorerUpdateTraceContextProvider>
        </QueryClientProvider>
      </DesignSystemProvider>
    </IntlProvider>
  );

  const mockAssessment: Assessment = {
    assessment_id: 'assessment-123',
    assessment_name: 'Correctness',
    trace_id: 'trace-123',
    source: {
      source_type: 'HUMAN',
      source_id: 'test-user@databricks.com',
    },
    feedback: {
      value: 'yes',
    },
    create_time: '2025-11-16T10:00:00.000Z',
    last_update_time: '2025-11-16T10:00:00.000Z',
    valid: true,
  } as Assessment;

  const mockUpdatedAssessmentResponse = {
    assessment: {
      ...mockAssessment,
      feedback: {
        value: 'no',
      },
      last_update_time: '2025-11-16T12:00:00.000Z',
    } as Assessment,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() => useTraceCachedActions()).result.current.resetCache();
  });

  describe('when V4 API is disabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(false);
      server.use(
        rest.patch('*/ajax-api/*/mlflow/traces/trace-123/assessments/assessment-123', async (req, res, ctx) =>
          res(ctx.json(mockUpdatedAssessmentResponse)),
        ),
      );
    });

    it('should update assessment using V3 API', async () => {
      const updateSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.patch('*/ajax-api/*/mlflow/traces/trace-123/assessments/assessment-123', async (req, res, ctx) => {
          updateSpy(await req.json());
          return res(ctx.json(mockUpdatedAssessmentResponse));
        }),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useUpdateAssessment({ assessment: mockAssessment, onSuccess }), { wrapper });

      const payload = {
        assessment: {
          feedback: {
            value: 'no',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(updateSpy).toHaveBeenCalled();

      const receivedPayload = updateSpy.mock.calls[0][0] as UpdateAssessmentPayload;
      expect(receivedPayload.assessment.feedback?.value).toBe('no');
    });

    it('should not update cache when V4 API is disabled', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          updateHook: useUpdateAssessment({ assessment: mockAssessment, onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      const payload = {
        assessment: {
          feedback: {
            value: 'no',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateHook.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(result.current.cacheHook.assessmentActions['trace-123']).toBeUndefined();
    });
  });

  describe('when V4 API is enabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(true);
      server.use(
        rest.patch(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) => res(ctx.json(mockUpdatedAssessmentResponse)),
        ),
      );
    });

    it('should update assessment using V4 API', async () => {
      const updateSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.patch(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) => {
            updateSpy(await req.json());
            return res(ctx.json(mockUpdatedAssessmentResponse));
          },
        ),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useUpdateAssessment({ assessment: mockAssessment, onSuccess }), { wrapper });

      const payload = {
        assessment: {
          feedback: {
            value: 'no',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should add update action to cache', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          updateHook: useUpdateAssessment({ assessment: mockAssessment, onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      const payload = {
        assessment: {
          feedback: {
            value: 'no',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateHook.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      expect(actions).toHaveLength(1);
      expect(actions[0]).toMatchObject({
        action: 'ADD',
        assessment: expect.objectContaining({
          assessment_id: 'assessment-123',
          feedback: {
            value: 'no',
          },
        }),
      });
    });

    it('should update feedback value', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useUpdateAssessment({ assessment: mockAssessment, onSuccess }), { wrapper });

      const payload = {
        assessment: {
          feedback: {
            value: 'no',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should update expectation value', async () => {
      const expectationAssessment = {
        ...mockAssessment,
        expectation: { value: '{"old": "value"}' },
      } as Assessment;

      server.resetHandlers();
      server.use(
        rest.patch(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) =>
            res(
              ctx.json({
                assessment: {
                  ...expectationAssessment,
                  expectation: { value: '{"new": "value"}' },
                },
              }),
            ),
        ),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useUpdateAssessment({ assessment: expectationAssessment, onSuccess }), {
        wrapper,
      });

      const payload = {
        assessment: {
          expectation: {
            value: '{"new": "value"}',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should update rationale', async () => {
      server.resetHandlers();
      server.use(
        rest.patch(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) =>
            res(
              ctx.json({
                assessment: {
                  ...mockUpdatedAssessmentResponse.assessment,
                  rationale: 'Updated reasoning',
                },
              }),
            ),
        ),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useUpdateAssessment({ assessment: mockAssessment, onSuccess }), { wrapper });

      const payload = {
        assessment: {
          rationale: 'Updated reasoning',
        },
      } as UpdateAssessmentPayload;

      result.current.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should call onSettled callback', async () => {
      const onSuccess = jest.fn();
      const onSettled = jest.fn();
      const { result } = renderHook(() => useUpdateAssessment({ assessment: mockAssessment, onSuccess, onSettled }), {
        wrapper,
      });

      const payload = {
        assessment: {
          feedback: {
            value: 'no',
          },
        },
      } as UpdateAssessmentPayload;

      result.current.updateAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(onSettled).toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

````

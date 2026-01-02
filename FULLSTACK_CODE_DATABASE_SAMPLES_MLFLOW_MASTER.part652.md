---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 652
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 652 of 991)

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

---[FILE: ModelTraceExplorerTextFieldRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/field-renderers/ModelTraceExplorerTextFieldRenderer.tsx
Signals: React

```typescript
import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { GenAIMarkdownRenderer } from '@databricks/web-shared/genai-markdown-renderer';

const STRING_TRUNCATION_LIMIT = 400;

export const ModelTraceExplorerTextFieldRenderer = ({ title, value }: { title: string; value: string }) => {
  const { theme } = useDesignSystemTheme();
  const [expanded, setExpanded] = useState(false);

  const isExpandable = value.length > STRING_TRUNCATION_LIMIT;
  const displayValue =
    !expanded && value.length > STRING_TRUNCATION_LIMIT ? value.slice(0, STRING_TRUNCATION_LIMIT) + '...' : value;

  const hoverStyles = isExpandable
    ? { ':hover': { backgroundColor: theme.colors.actionIconBackgroundHover, cursor: 'pointer' } }
    : {};

  return (
    <div
      css={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borders.borderRadiusSm,
      }}
    >
      {title && (
        <div
          role="button"
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${theme.spacing.sm}px ${theme.spacing.sm + theme.spacing.xs}px`,
            ...hoverStyles,
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Typography.Title level={4} color="secondary" withoutMargins>
            {title}
          </Typography.Title>
          {isExpandable && (expanded ? <ChevronDownIcon /> : <ChevronRightIcon />)}
        </div>
      )}
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
          paddingLeft: theme.spacing.sm + theme.spacing.xs,
          paddingRight: theme.spacing.sm + theme.spacing.xs,
          paddingTop: title ? 0 : theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
          // get rid of last margin in markdown renderer
          '& > div:last-of-type': {
            marginBottom: 0,
          },
        }}
      >
        <GenAIMarkdownRenderer>{displayValue}</GenAIMarkdownRenderer>
        {isExpandable && (
          <Typography.Link
            onClick={() => setExpanded(!expanded)}
            componentId="shared.model-trace-explorer.text-field-see-more-link"
          >
            {expanded ? (
              <FormattedMessage
                defaultMessage="See less"
                description="Button to collapse a long text field in the trace explorer summary field renderer"
              />
            ) : (
              <FormattedMessage
                defaultMessage="See more"
                description="Button to expand a long text field in the trace explorer summary field renderer"
              />
            )}
          </Typography.Link>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: invalidateMlflowSearchTracesCache.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/invalidateMlflowSearchTracesCache.ts

```typescript
import type { QueryClient } from '@databricks/web-shared/query-client';

export const SEARCH_MLFLOW_TRACES_QUERY_KEY = 'searchMlflowTraces';

export const invalidateMlflowSearchTracesCache = ({ queryClient }: { queryClient: QueryClient }) => {
  queryClient.invalidateQueries({ queryKey: [SEARCH_MLFLOW_TRACES_QUERY_KEY] });
};
```

--------------------------------------------------------------------------------

---[FILE: useCreateAssessment.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useCreateAssessment.test.tsx
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

import { useCreateAssessment } from './useCreateAssessment';
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

describe('useCreateAssessment', () => {
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

  const mockNewAssessmentResponse = {
    assessment: {
      assessment_id: 'assessment-new-123',
      assessment_name: 'Correctness',
      trace_id: 'trace-123',
      source: {
        source_type: 'HUMAN',
        source_id: 'test-user@databricks.com',
      },
      feedback: {
        value: 'yes',
      },
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

    it('should create assessment using V3 API', async () => {
      const createSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.post('*/ajax-api/*/mlflow/traces/trace-123/assessments', async (req, res, ctx) => {
          createSpy(await req.json());
          return res(ctx.json(mockNewAssessmentResponse));
        }),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(createSpy).toHaveBeenCalled();

      const receivedPayload = createSpy.mock.calls[0][0] as CreateAssessmentPayload;
      expect(receivedPayload.assessment.assessment_name).toBe('Correctness');
      expect(receivedPayload.assessment.source.source_type).toBe('HUMAN');
    });

    it('should not update cache when V4 API is disabled', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          createHook: useCreateAssessment({ traceId: 'trace-123', onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createHook.createAssessmentMutation(payload);

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

    it('should create assessment using V4 API', async () => {
      const createSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.post('*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments', async (req, res, ctx) => {
          createSpy(await req.json());
          return res(ctx.json(mockNewAssessmentResponse));
        }),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(createSpy).toHaveBeenCalled();
    });

    it('should add new assessment to cache', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          createHook: useCreateAssessment({ traceId: 'trace-123', onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createHook.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      expect(actions).toHaveLength(1);
      expect(actions[0]).toMatchObject({
        action: 'ADD',
        assessment: expect.objectContaining({
          assessment_id: 'assessment-new-123',
        }),
      });
    });

    it('should create assessment with feedback value', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should create assessment with expectation value', async () => {
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
      const { result } = renderHook(() => useCreateAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      const payload = {
        assessment: {
          assessment_name: 'Schema Check',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          expectation: {
            value: '{"key": "value"}',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should include rationale in assessment', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useCreateAssessment({ traceId: 'trace-123', onSuccess }), { wrapper });

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
          rationale: 'Response is accurate',
        },
      } as CreateAssessmentPayload;

      result.current.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('should call onSettled callback', async () => {
      const onSuccess = jest.fn();
      const onSettled = jest.fn();
      const { result } = renderHook(() => useCreateAssessment({ traceId: 'trace-123', onSuccess, onSettled }), {
        wrapper,
      });

      const payload = {
        assessment: {
          assessment_name: 'Correctness',
          trace_id: 'trace-123',
          source: {
            source_type: 'HUMAN',
            source_id: 'test-user@databricks.com',
          },
          feedback: {
            value: 'yes',
          },
        },
      } as CreateAssessmentPayload;

      result.current.createAssessmentMutation(payload);

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(onSettled).toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useCreateAssessment.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useCreateAssessment.tsx

```typescript
import { isObject } from 'lodash';

/* eslint-disable import/no-duplicates */
import { useIntl } from '@databricks/i18n';
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';

import { invalidateMlflowSearchTracesCache } from './invalidateMlflowSearchTracesCache';
import { useTraceCachedActions } from './useTraceCachedActions';
import { shouldUseTracesV4API } from '../FeatureUtils';
import { FETCH_TRACE_INFO_QUERY_KEY, displayErrorNotification, isV3ModelTraceInfo } from '../ModelTraceExplorer.utils';
import { doesTraceSupportV4API } from '../ModelTraceExplorer.utils';
import { createAssessment } from '../api';
import { TracesServiceV4 } from '../api';
import type { CreateAssessmentPayload, CreateAssessmentV3Response, CreateAssessmentV4Response } from '../api';
import { useModelTraceExplorerUpdateTraceContext } from '../contexts/UpdateTraceContext';

export const useCreateAssessment = ({
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

  const logCachedCreateAction = useTraceCachedActions((state) => state.logAddedAssessment);

  const updateTraceVariables = useModelTraceExplorerUpdateTraceContext();
  const { mutate: createAssessmentMutation, isLoading } = useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => {
      // TODO: Squash all this logic into a single util function (in both model-trace-explorer and genai-traces-table)
      if (
        shouldUseTracesV4API() &&
        updateTraceVariables?.modelTraceInfo &&
        isV3ModelTraceInfo(updateTraceVariables.modelTraceInfo) &&
        doesTraceSupportV4API(updateTraceVariables?.modelTraceInfo)
      ) {
        return TracesServiceV4.createAssessmentV4({
          payload,
          traceLocation: updateTraceVariables.modelTraceInfo.trace_location,
        });
      }
      return createAssessment({ payload });
    },
    onSuccess: (createdAssessment: CreateAssessmentV4Response | CreateAssessmentV3Response) => {
      if (shouldUseTracesV4API() && isObject(createdAssessment)) {
        const assessment = 'assessment' in createdAssessment ? createdAssessment.assessment : createdAssessment;
        logCachedCreateAction(traceId, assessment);
      }
      updateTraceVariables.invalidateTraceQuery?.(traceId);
      queryClient.invalidateQueries({ queryKey: [FETCH_TRACE_INFO_QUERY_KEY, traceId] });
      invalidateMlflowSearchTracesCache({ queryClient });
      onSuccess?.();
    },
    onError: (error) => {
      displayErrorNotification(
        intl.formatMessage(
          {
            defaultMessage: 'Failed to create assessment. Error: {error}',
            description: 'Error message when creating an assessment fails',
          },
          {
            error: error instanceof Error ? error.message : String(error),
          },
        ),
      );
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return {
    createAssessmentMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useDeleteAssessment.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useDeleteAssessment.test.tsx
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

import { useDeleteAssessment } from './useDeleteAssessment';
import { useTraceCachedActions } from './useTraceCachedActions';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment, ModelTraceInfoV3, ModelTraceLocation } from '../ModelTrace.types';
import { ModelTraceExplorerUpdateTraceContextProvider } from '../contexts/UpdateTraceContext';

jest.mock('../FeatureUtils', () => ({
  shouldUseTracesV4API: jest.fn(),
}));

describe('useDeleteAssessment', () => {
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
      source_id: 'user@databricks.com',
    },
    feedback: {
      value: 'yes',
    },
    create_time: '2025-11-16T12:00:00.000Z',
    last_update_time: '2025-11-16T12:00:00.000Z',
    valid: true,
  } as Assessment;

  const mockOverriddenAssessment: Assessment = {
    ...mockAssessment,
    assessment_id: 'assessment-old-llm',
    source: {
      source_type: 'LLM_JUDGE',
      source_id: 'databricks',
    },
    feedback: {
      value: 'no',
    },
    create_time: '2025-11-16T10:00:00.000Z',
    valid: false,
  } as Assessment;

  const mockAssessmentWithOverride: Assessment = {
    ...mockAssessment,
    overrides: 'assessment-old-llm',
    overriddenAssessment: mockOverriddenAssessment,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() => useTraceCachedActions()).result.current.resetCache();
  });

  describe('when V4 API is disabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(false);
      server.use(
        rest.delete('*/ajax-api/*/mlflow/traces/trace-123/assessments/assessment-123', async (req, res, ctx) =>
          res(ctx.json({})),
        ),
      );
    });

    it('should delete assessment using V3 API', async () => {
      const deleteSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.delete('*/ajax-api/*/mlflow/traces/trace-123/assessments/assessment-123', async (req, res, ctx) => {
          deleteSpy();
          return res(ctx.json({}));
        }),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteAssessment({ assessment: mockAssessment, onSuccess }), { wrapper });

      result.current.deleteAssessmentMutation();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(deleteSpy).toHaveBeenCalled();
    });

    it('should not update cache when V4 API is disabled', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          deleteHook: useDeleteAssessment({ assessment: mockAssessment, onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.deleteHook.deleteAssessmentMutation();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(result.current.cacheHook.assessmentActions['trace-123']).toBeUndefined();
    });
  });

  describe('when V4 API is enabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(true);
      server.use(
        rest.delete(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) => res(ctx.json({})),
        ),
      );
    });

    it('should delete assessment using V4 API', async () => {
      const deleteSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.delete(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) => {
            deleteSpy();
            return res(ctx.json({}));
          },
        ),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteAssessment({ assessment: mockAssessment, onSuccess }), { wrapper });

      result.current.deleteAssessmentMutation();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
      expect(deleteSpy).toHaveBeenCalled();
    });

    it('should add delete action to cache', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          deleteHook: useDeleteAssessment({ assessment: mockAssessment, onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.deleteHook.deleteAssessmentMutation();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      expect(actions).toHaveLength(1);
      expect(actions[0]).toMatchObject({
        action: 'DELETE',
        assessment: expect.objectContaining({ assessment_id: 'assessment-123' }),
      });
    });

    it('should restore overridden assessment when deleting an override', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          deleteHook: useDeleteAssessment({ assessment: mockAssessmentWithOverride, onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.deleteHook.deleteAssessmentMutation();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      expect(actions).toHaveLength(2);
      expect(actions[0]).toMatchObject({
        action: 'ADD',
        assessment: expect.objectContaining({
          assessment_id: 'assessment-old-llm',
          valid: true,
        }),
      });
      expect(actions[1]).toMatchObject({
        action: 'DELETE',
        assessment: expect.objectContaining({ assessment_id: 'assessment-123' }),
      });
    });

    it('should not restore assessment if there is no overriddenAssessment', async () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(
        () => ({
          deleteHook: useDeleteAssessment({ assessment: mockAssessment, onSuccess }),
          cacheHook: useTraceCachedActions(),
        }),
        { wrapper },
      );

      result.current.deleteHook.deleteAssessmentMutation();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      const actions = result.current.cacheHook.assessmentActions['trace-123'];
      expect(actions).toHaveLength(1);
      expect(actions[0].action).toBe('DELETE');
    });

    it('should call onSettled callback', async () => {
      const onSettled = jest.fn();
      const { result } = renderHook(() => useDeleteAssessment({ assessment: mockAssessment, onSettled }), { wrapper });

      result.current.deleteAssessmentMutation();

      await waitFor(() => expect(onSettled).toHaveBeenCalled());
    });

    it('should not delete when skip is true', async () => {
      const deleteSpy = jest.fn();
      server.resetHandlers();
      server.use(
        rest.delete(
          '*/ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-123/assessments/assessment-123',
          async (req, res, ctx) => {
            deleteSpy();
            return res(ctx.json({}));
          },
        ),
      );

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteAssessment({ assessment: mockAssessment, skip: true, onSuccess }), {
        wrapper,
      });

      result.current.deleteAssessmentMutation();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(deleteSpy).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useDeleteAssessment.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useDeleteAssessment.tsx

```typescript
import { useIntl } from '@databricks/i18n';
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';

import { invalidateMlflowSearchTracesCache } from './invalidateMlflowSearchTracesCache';
import { useTraceCachedActions } from './useTraceCachedActions';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment } from '../ModelTrace.types';
import {
  displayErrorNotification,
  doesTraceSupportV4API,
  FETCH_TRACE_INFO_QUERY_KEY,
  isV3ModelTraceInfo,
} from '../ModelTraceExplorer.utils';
import { deleteAssessment, TracesServiceV4 } from '../api';
import { useModelTraceExplorerUpdateTraceContext } from '../contexts/UpdateTraceContext';

export const useDeleteAssessment = ({
  assessment,
  onSuccess,
  onError,
  onSettled,
  skip,
}: {
  assessment?: Assessment;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
  skip?: boolean;
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const traceId = assessment?.trace_id;
  const assessmentId = assessment?.assessment_id;

  const logCachedDeleteAction = useTraceCachedActions((state) => state.logRemovedAssessment);
  const logCachedAddAction = useTraceCachedActions((state) => state.logAddedAssessment);

  const updateTraceVariables = useModelTraceExplorerUpdateTraceContext();
  const isSkipped = skip || !traceId || !assessmentId;

  const { mutate: deleteAssessmentMutation, isLoading } = useMutation({
    mutationFn: () => {
      if (isSkipped) {
        return Promise.reject(new Error('Mutation is skipped'));
      }

      if (
        shouldUseTracesV4API() &&
        updateTraceVariables.modelTraceInfo &&
        isV3ModelTraceInfo(updateTraceVariables.modelTraceInfo) &&
        doesTraceSupportV4API(updateTraceVariables.modelTraceInfo)
      ) {
        return TracesServiceV4.deleteAssessmentV4({
          traceId,
          assessmentId,
          traceLocation: updateTraceVariables.modelTraceInfo.trace_location,
        });
      }
      return deleteAssessment({ traceId, assessmentId });
    },
    onSuccess: () => {
      if (shouldUseTracesV4API() && !isSkipped) {
        if (assessment.overriddenAssessment) {
          const restoredAssessment = { ...assessment.overriddenAssessment, valid: true };
          logCachedAddAction(traceId, restoredAssessment);
        }
        logCachedDeleteAction(traceId, assessment);
      }
      queryClient.invalidateQueries({ queryKey: [FETCH_TRACE_INFO_QUERY_KEY, traceId] });
      updateTraceVariables.invalidateTraceQuery?.(traceId);
      invalidateMlflowSearchTracesCache({ queryClient });
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof Error && isSkipped) {
        return;
      }

      displayErrorNotification(
        intl.formatMessage(
          {
            defaultMessage: 'Failed to delete assessment. Error: {error}',
            description: 'Error message when deleting an assessment fails.',
          },
          {
            error: error instanceof Error ? error.message : String(error),
          },
        ),
      );
      onError?.(error);
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return {
    deleteAssessmentMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useGetModelTraceInfo.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useGetModelTraceInfo.tsx
Signals: React

```typescript
import { useMemo } from 'react';

import { useQuery } from '@databricks/web-shared/query-client';

import { shouldUseTracesV4API } from '../FeatureUtils';
import type { ModelTrace } from '../ModelTrace.types';
import { FETCH_TRACE_INFO_QUERY_KEY, isV3ModelTraceInfo } from '../ModelTraceExplorer.utils';
import { fetchTraceInfoV3, TracesServiceV4 } from '../api';
import { useModelTraceExplorerUpdateTraceContext } from '../contexts/UpdateTraceContext';

export const useGetModelTraceInfo = ({
  traceId,
  setModelTrace,
  setAssessmentsPaneEnabled,
  enabled = true,
}: {
  traceId: string;
  setModelTrace: React.Dispatch<React.SetStateAction<ModelTrace>>;
  setAssessmentsPaneEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  enabled?: boolean;
}) => {
  const queryKey = [FETCH_TRACE_INFO_QUERY_KEY, traceId];

  const traceInfoContext = useModelTraceExplorerUpdateTraceContext();

  const isQueryEnabled = useMemo(() => {
    if (shouldUseTracesV4API() && !traceId.startsWith('tr-')) {
      return enabled && traceInfoContext.modelTraceInfo && isV3ModelTraceInfo(traceInfoContext.modelTraceInfo);
    }
    return enabled && traceId.startsWith('tr-');
  }, [enabled, traceId, traceInfoContext.modelTraceInfo]);

  return useQuery({
    queryKey,
    queryFn: () => {
      if (
        shouldUseTracesV4API() &&
        traceInfoContext.modelTraceInfo &&
        isV3ModelTraceInfo(traceInfoContext.modelTraceInfo) &&
        !traceId.startsWith('tr-')
      ) {
        return TracesServiceV4.getTraceInfoV4({
          traceId,
          traceLocation: traceInfoContext.modelTraceInfo?.trace_location,
        });
      }
      return fetchTraceInfoV3({ traceId });
    },
    onSuccess: (response) => {
      // In V4, the trace info is directly in the response's root.
      // In V3, it's nested under response.trace.trace_info.
      const traceInfo = isV3ModelTraceInfo(response) ? response : response?.trace?.trace_info;
      setModelTrace((prevModelTrace: ModelTrace) => ({
        data: prevModelTrace.data,
        info: traceInfo ?? {},
      }));
      setAssessmentsPaneEnabled(true);
    },
    onError: () => {
      setAssessmentsPaneEnabled(false);
    },
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
};
```

--------------------------------------------------------------------------------

---[FILE: useModelTraceSearch.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useModelTraceSearch.tsx
Signals: React

```typescript
import { compact, isNil } from 'lodash';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import type {
  ModelTraceExplorerTab,
  ModelTraceSpanNode,
  SearchMatch,
  SpanFilterState,
  ModelTrace,
} from '../ModelTrace.types';
import { searchTree } from '../ModelTraceExplorer.utils';
import {
  getSpanNodeParentIds,
  getTimelineTreeNodesList,
  getTimelineTreeNodesMap,
} from '../timeline-tree/TimelineTree.utils';

const getDefaultSpanFilterState = (treeNodes: ModelTraceSpanNode[]): SpanFilterState => {
  const spanTypeDisplayState: Record<string, boolean> = {};

  // populate the spanTypeDisplayState with
  // all span types that exist on the trace
  if (treeNodes) {
    const allSpanTypes = compact(getTimelineTreeNodesList<ModelTraceSpanNode>(treeNodes).map((node) => node.type));
    allSpanTypes.forEach((spanType) => {
      spanTypeDisplayState[spanType] = true;
    });
  }

  return {
    showParents: true,
    showExceptions: true,
    spanTypeDisplayState,
  };
};

const getTabForMatch = (match: SearchMatch): ModelTraceExplorerTab => {
  switch (match.section) {
    case 'inputs':
    case 'outputs':
      return 'content';
    case 'attributes':
      return 'attributes';
    case 'events':
      return 'events';
    default:
      // shouldn't happen
      return 'content';
  }
};

export const useModelTraceSearch = ({
  treeNodes,
  selectedNode,
  setSelectedNode,
  setActiveTab,
  setExpandedKeys,
  modelTraceInfo,
}: {
  treeNodes: ModelTraceSpanNode[];
  selectedNode: ModelTraceSpanNode | undefined;
  setSelectedNode: (node: ModelTraceSpanNode) => void;
  setActiveTab: (tab: ModelTraceExplorerTab) => void;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  modelTraceInfo: ModelTrace['info'] | null;
}): {
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  spanFilterState: SpanFilterState;
  setSpanFilterState: (state: SpanFilterState) => void;
  filteredTreeNodes: ModelTraceSpanNode[];
  matchData: {
    match: SearchMatch | null;
    totalMatches: number;
    currentMatchIndex: number;
  };
  handleNextSearchMatch: () => void;
  handlePreviousSearchMatch: () => void;
} => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [spanFilterState, setSpanFilterState] = useState<SpanFilterState>(() => getDefaultSpanFilterState(treeNodes));
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const treeNodesKeys = treeNodes.map((n) => n.key).join(',');
  const { filteredTreeNodes, matches } = useMemo(() => {
    // Run search over each root and merge results
    const merged = treeNodes.map((root) => searchTree(root, searchFilter, spanFilterState));
    return {
      filteredTreeNodes: merged.flatMap((r) => r.filteredTreeNodes),
      matches: merged.flatMap((r) => r.matches),
    };
    // use the span ID to determine whether the state should be recomputed.
    // using the whole object seems to cause the state to be reset at
    // unexpected times.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeNodesKeys, searchFilter, spanFilterState, modelTraceInfo]);

  const nodeMap = useMemo(() => {
    return getTimelineTreeNodesMap(filteredTreeNodes);
  }, [filteredTreeNodes]);

  const selectMatch = useCallback(
    (newMatchIndex: number) => {
      if (newMatchIndex >= matches.length || newMatchIndex < 0) {
        return;
      }
      setActiveMatchIndex(newMatchIndex);
      const match = matches[newMatchIndex];
      setSelectedNode(match.span);
      setActiveTab(getTabForMatch(match));
      // Make sure parents are expanded
      const parents = getSpanNodeParentIds(match.span, nodeMap);
      setExpandedKeys((expandedKeys) => {
        // set.union seems to not be available in all environments
        return new Set([...expandedKeys, ...parents]);
      });
    },
    [matches, setSelectedNode, setActiveTab, nodeMap, setExpandedKeys],
  );

  const handleNextSearchMatch = useCallback(() => {
    selectMatch(activeMatchIndex + 1);
  }, [activeMatchIndex, selectMatch]);

  const handlePreviousSearchMatch = useCallback(() => {
    selectMatch(activeMatchIndex - 1);
  }, [activeMatchIndex, selectMatch]);

  useLayoutEffect(() => {
    if (filteredTreeNodes.length === 0) {
      return;
    }

    // this case can trigger on two conditions:
    // 1. the search term is cleared, therefore there are no matches
    // 2. the search term only matches on span names, which don't count
    //    as matches since we don't support jumping to them.
    if (matches.length === 0) {
      // if the selected node is no longer in the tree, then select
      // the first node. this can occur from condition #2 above
      const selectedNodeKey = selectedNode?.key ?? '';
      if (!(selectedNodeKey in nodeMap)) {
        const newSpan = filteredTreeNodes[0];
        setSelectedNode(newSpan);
        setActiveTab(newSpan?.chatMessages ? 'chat' : 'content');
      } else {
        // another reason the tree can change is if modelTraceInfo changes.
        // (e.g. tags/assessments were updated). if this happens, we need
        // to reselect the updated node from the node map, otherwise the
        // updates will not be reflected in the UI.
        setSelectedNode(nodeMap[selectedNodeKey]);
      }

      // otherwise, if search was cleared, then we don't want to
      // do anything. this is to preserve the user's context
      // (e.g. they've jumped to a span and now want to dive deeper)
      return;
    }

    // when matches update, select the first match
    setActiveMatchIndex(0);
    setSelectedNode(matches[0].span);
    setActiveTab(getTabForMatch(matches[0]));
    // don't subscribe to selectedNode to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTreeNodes, matches, setSelectedNode]);

  return {
    matchData: {
      match: matches[activeMatchIndex] ?? null,
      totalMatches: matches.length,
      currentMatchIndex: activeMatchIndex,
    },
    searchFilter: searchFilter.toLowerCase().trim(),
    setSearchFilter,
    spanFilterState,
    setSpanFilterState,
    filteredTreeNodes,
    handleNextSearchMatch,
    handlePreviousSearchMatch,
  };
};
```

--------------------------------------------------------------------------------

````

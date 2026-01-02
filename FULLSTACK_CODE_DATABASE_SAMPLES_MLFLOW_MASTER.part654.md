---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 654
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 654 of 991)

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

---[FILE: useUpdateAssessment.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useUpdateAssessment.tsx

```typescript
import { isObject } from 'lodash';

import { useIntl } from '@databricks/i18n';
import { useMutation, useQueryClient } from '@databricks/web-shared/query-client';

import { invalidateMlflowSearchTracesCache } from './invalidateMlflowSearchTracesCache';
import { useTraceCachedActions } from './useTraceCachedActions';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { Assessment } from '../ModelTrace.types';
import {
  displayErrorNotification,
  FETCH_TRACE_INFO_QUERY_KEY,
  isV3ModelTraceInfo,
  doesTraceSupportV4API,
} from '../ModelTraceExplorer.utils';
import type { UpdateAssessmentPayload, UpdateAssessmentV3Response, UpdateAssessmentV4Response } from '../api';
import { updateAssessment, TracesServiceV4 } from '../api';
import { useModelTraceExplorerUpdateTraceContext } from '../contexts/UpdateTraceContext';

// This API is used to update an assessment in place.
// To override an assessment (preserving the original)
// use `useOverrideAssessment` instead
export const useUpdateAssessment = ({
  assessment,
  onSuccess,
  onError,
  onSettled,
}: {
  assessment: Assessment;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const logCachedUpdateAction = useTraceCachedActions((state) => state.logAddedAssessment);

  const updateTraceVariables = useModelTraceExplorerUpdateTraceContext();

  const { mutate: updateAssessmentMutation, isLoading } = useMutation({
    mutationFn: (payload: UpdateAssessmentPayload) => {
      // TODO: Squash all this logic into a single util function (in both model-trace-explorer and genai-traces-table)
      if (
        shouldUseTracesV4API() &&
        updateTraceVariables?.modelTraceInfo &&
        isV3ModelTraceInfo(updateTraceVariables.modelTraceInfo) &&
        doesTraceSupportV4API(updateTraceVariables?.modelTraceInfo)
      ) {
        // V4 API requires assessment_name to be set on update
        payload.assessment.assessment_name = assessment.assessment_name;
        return TracesServiceV4.updateAssessmentV4({
          traceId: assessment.trace_id,
          assessmentId: assessment.assessment_id,
          payload,
          traceLocation: updateTraceVariables.modelTraceInfo.trace_location,
        });
      }
      return updateAssessment({ traceId: assessment.trace_id, assessmentId: assessment.assessment_id, payload });
    },
    onError: (error) => {
      displayErrorNotification(
        intl.formatMessage(
          {
            defaultMessage: 'Failed to update assessment. Error: {error}',
            description: 'Error message when updating an assessment fails',
          },
          {
            error: error instanceof Error ? error.message : String(error),
          },
        ),
      );
      onError?.(error);
    },
    onSuccess: (updatedAssessment: UpdateAssessmentV3Response | UpdateAssessmentV4Response) => {
      if (shouldUseTracesV4API() && isObject(updatedAssessment)) {
        const assessment = 'assessment' in updatedAssessment ? updatedAssessment.assessment : updatedAssessment;
        logCachedUpdateAction(assessment.trace_id, assessment);
      }
      queryClient.invalidateQueries({ queryKey: [FETCH_TRACE_INFO_QUERY_KEY, assessment.trace_id] });
      updateTraceVariables.invalidateTraceQuery?.(assessment.trace_id);
      invalidateMlflowSearchTracesCache({ queryClient });
      onSuccess?.();
    },
    onSettled: () => {
      onSettled?.();
    },
  });

  return {
    updateAssessmentMutation,
    isLoading,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useUpdateTraceTagsMutation.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useUpdateTraceTagsMutation.test.tsx

```typescript
import { describe, jest, beforeAll, beforeEach, it, expect } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { QueryClientProvider, QueryClient } from '@databricks/web-shared/query-client';

import { useUpdateTraceTagsMutation } from './useUpdateTraceTagsMutation';
import { shouldUseTracesV4API } from '../FeatureUtils';
import type { ModelTraceInfoV3, ModelTraceLocation } from '../ModelTrace.types';

jest.mock('../FeatureUtils', () => ({
  shouldUseTracesV4API: jest.fn(),
}));

describe('useUpdateTraceTagsMutation', () => {
  const server = setupServer();
  beforeAll(() => server.listen());

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  const mockTraceLocation: ModelTraceLocation = {
    type: 'MLFLOW_EXPERIMENT',
    mlflow_experiment: {
      experiment_id: 'exp-123',
    },
  };

  const mockTraceInfoV3: ModelTraceInfoV3 = {
    trace_id: 'trace-456',
    trace_location: mockTraceLocation,
    request_time: '2025-02-19T09:52:23.140Z',
    state: 'OK',
    tags: {},
  };

  const newTags = [
    { key: 'tag1', value: 'value1' },
    { key: 'tag2', value: 'value2' },
  ];

  const deletedTags = [
    { key: 'tag3', value: 'value3' },
    { key: 'tag4', value: 'value4' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when V4 API is enabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(true);
    });

    it('should use V4 endpoints for UC_SCHEMA location', async () => {
      const ucSchemaLocation: ModelTraceLocation = {
        type: 'UC_SCHEMA',
        uc_schema: {
          catalog_name: 'my_catalog',
          schema_name: 'my_schema',
        },
      };

      const traceInfoWithUcSchema: ModelTraceInfoV3 = {
        ...mockTraceInfoV3,
        trace_location: ucSchemaLocation,
      };

      const patchSpy = jest.fn();
      const deleteSpy = jest.fn();

      server.use(
        rest.patch('ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-456/tags', async (req, res, ctx) => {
          patchSpy(await req.json());
          return res(ctx.json({}));
        }),
        rest.delete('ajax-api/4.0/mlflow/traces/my_catalog.my_schema/trace-456/tags/:tagKey', async (req, res, ctx) => {
          deleteSpy(req.params['tagKey']);
          return res(ctx.json({}));
        }),
      );

      const { result } = renderHook(() => useUpdateTraceTagsMutation({}), {
        wrapper,
      });

      await result.current.mutateAsync({
        newTags: [{ key: 'tag1', value: 'value1' }],
        deletedTags: [{ key: 'tag2', value: 'value2' }],
        modelTraceInfo: traceInfoWithUcSchema,
      });

      await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledWith({ key: 'tag1', value: 'value1' });
        expect(deleteSpy).toHaveBeenCalledWith('tag2');
      });
    });
  });

  describe('when V4 API is disabled', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(false);
    });

    it('should use V3 endpoints', async () => {
      const v3TagRequests: { method: string; body?: any; url: string }[] = [];

      server.use(
        rest.patch('http://localhost/ajax-api/3.0/mlflow/traces/trace-456/tags', async (req, res, ctx) => {
          v3TagRequests.push({ method: 'PATCH', body: await req.json(), url: req.url.href });
          return res(ctx.json({}));
        }),
        rest.delete('http://localhost/ajax-api/3.0/mlflow/traces/trace-456/tags', async (req, res, ctx) => {
          v3TagRequests.push({ method: 'DELETE', url: req.url.href });
          return res(ctx.json({}));
        }),
      );

      const { result } = renderHook(() => useUpdateTraceTagsMutation({}), {
        wrapper,
      });

      await result.current.mutateAsync({
        newTags,
        deletedTags,
        modelTraceInfo: mockTraceInfoV3,
      });

      await waitFor(() => {
        expect(v3TagRequests).toHaveLength(4);
      });

      // Verify creation requests
      const createRequests = v3TagRequests.filter((req) => req.method === 'PATCH');
      expect(createRequests).toHaveLength(2);
      expect(createRequests[0].body).toEqual({ key: 'tag1', value: 'value1' });
      expect(createRequests[1].body).toEqual({ key: 'tag2', value: 'value2' });

      // Verify deletion requests
      const deleteRequests = v3TagRequests.filter((req) => req.method === 'DELETE');
      expect(deleteRequests).toHaveLength(2);
      expect(deleteRequests[0].url).toContain('key=tag3');
      expect(deleteRequests[1].url).toContain('key=tag4');
    });
  });

  describe('onSuccess callback', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(false);
    });

    it('should call onSuccess callback after successful mutation', async () => {
      const onSuccess = jest.fn();

      server.use(
        rest.patch('http://localhost/ajax-api/3.0/mlflow/traces/trace-456/tags', async (req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      const { result } = renderHook(() => useUpdateTraceTagsMutation({ onSuccess }), {
        wrapper,
      });

      await result.current.mutateAsync({
        newTags: [{ key: 'tag1', value: 'value1' }],
        deletedTags: [],
        modelTraceInfo: mockTraceInfoV3,
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      jest.mocked(shouldUseTracesV4API).mockReturnValue(false);
    });

    it('should handle empty newTags and deletedTags arrays', async () => {
      const { result } = renderHook(() => useUpdateTraceTagsMutation({}), {
        wrapper,
      });

      await result.current.mutateAsync({
        newTags: [],
        deletedTags: [],
        modelTraceInfo: mockTraceInfoV3,
      });

      // Should complete without making any requests
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle only newTags', async () => {
      const v3TagRequests: { method: string }[] = [];

      server.use(
        rest.patch('http://localhost/ajax-api/3.0/mlflow/traces/trace-456/tags', async (req, res, ctx) => {
          v3TagRequests.push({ method: 'PATCH' });
          return res(ctx.json({}));
        }),
      );

      const { result } = renderHook(() => useUpdateTraceTagsMutation({}), {
        wrapper,
      });

      await result.current.mutateAsync({
        newTags: [{ key: 'tag1', value: 'value1' }],
        deletedTags: [],
        modelTraceInfo: mockTraceInfoV3,
      });

      await waitFor(() => {
        expect(v3TagRequests).toHaveLength(1);
        expect(v3TagRequests[0].method).toBe('PATCH');
      });
    });

    it('should handle only deletedTags', async () => {
      const v3TagRequests: { method: string }[] = [];

      server.use(
        rest.delete('http://localhost/ajax-api/3.0/mlflow/traces/trace-456/tags', async (req, res, ctx) => {
          v3TagRequests.push({ method: 'DELETE' });
          return res(ctx.json({}));
        }),
      );

      const { result } = renderHook(() => useUpdateTraceTagsMutation({}), {
        wrapper,
      });

      await result.current.mutateAsync({
        newTags: [],
        deletedTags: [{ key: 'tag1', value: 'value1' }],
        modelTraceInfo: mockTraceInfoV3,
      });

      await waitFor(() => {
        expect(v3TagRequests).toHaveLength(1);
        expect(v3TagRequests[0].method).toBe('DELETE');
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useUpdateTraceTagsMutation.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/hooks/useUpdateTraceTagsMutation.tsx

```typescript
import { useMutation } from '@databricks/web-shared/query-client';

import { shouldUseTracesV4API } from '../FeatureUtils';
import type { ModelTrace } from '../ModelTrace.types';
import { doesTraceSupportV4API, isV3ModelTraceInfo } from '../ModelTraceExplorer.utils';
import { TracesServiceV3, TracesServiceV4 } from '../api';

/**
 * Updates (sets+deletes) tags for a given trace.
 * Supports both v3 and v4 API endpoints based on the provided trace info.
 */
export const useUpdateTraceTagsMutation = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async ({
      deletedTags,
      modelTraceInfo,
      newTags,
    }: {
      newTags: {
        key: string;
        value: string;
      }[];
      deletedTags: {
        key: string;
        value: string;
      }[];
      modelTraceInfo: ModelTrace['info'];
    }) => {
      // Use v4 API endpoints if conditions are met
      // TODO: Squash all this logic into a single util function (in both model-trace-explorer and genai-traces-table)
      if (
        shouldUseTracesV4API() &&
        isV3ModelTraceInfo(modelTraceInfo) &&
        modelTraceInfo.trace_location &&
        doesTraceSupportV4API(modelTraceInfo)
      ) {
        const creationPromises = newTags.map((tag) =>
          TracesServiceV4.setTraceTagV4({
            tag,
            traceLocation: modelTraceInfo.trace_location,
            traceId: modelTraceInfo.trace_id,
          }),
        );
        const deletionPromises = deletedTags.map((tag) =>
          TracesServiceV4.deleteTraceTagV4({
            tagKey: tag.key,
            traceLocation: modelTraceInfo.trace_location,
            traceId: modelTraceInfo.trace_id,
          }),
        );
        return Promise.all([...creationPromises, ...deletionPromises]);
      }

      const traceId = isV3ModelTraceInfo(modelTraceInfo) ? modelTraceInfo.trace_id : modelTraceInfo.request_id ?? '';
      // Otherwise, fallback to v3 API endpoints
      const creationPromises = newTags.map((tag) =>
        TracesServiceV3.setTraceTagV3({
          tag,
          traceId,
        }),
      );
      const deletionPromises = deletedTags.map((tag) =>
        TracesServiceV3.deleteTraceTagV3({
          tagKey: tag.key,
          traceId,
        }),
      );
      return Promise.all([...creationPromises, ...deletionPromises]);
    },
    onSuccess,
  });
};
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/key-value-tag/KeyValueTag.tsx

```typescript
import type { Interpolation, Theme } from '@emotion/react';

import { Tag, Tooltip, Typography } from '@databricks/design-system';

// max characters for key + value before truncation
const MAX_CHARS_LENGTH = 18;

const getTruncatedStyles = (shouldTruncate: boolean): Interpolation<Theme> =>
  shouldTruncate
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }
    : { whiteSpace: 'nowrap' };

/**
 * A <Tag /> wrapper used for displaying key-value entity
 */
export const KeyValueTag = ({
  itemKey,
  itemValue,
  charLimit = MAX_CHARS_LENGTH,
  maxWidth = 150,
  className,
}: {
  itemKey: string;
  itemValue: string;
  charLimit?: number;
  maxWidth?: number;
  className?: string;
}) => {
  const { shouldTruncateKey, shouldTruncateValue } = getKeyAndValueComplexTruncation(itemKey, itemValue, charLimit);

  return (
    <Tooltip componentId="shared.model-trace-explorer.key-value-tag.hover-tooltip" content={`${itemKey}: ${itemValue}`}>
      <Tag componentId="shared.model-trace-explorer.key-value-tag" className={className}>
        <span css={{ maxWidth, display: 'inline-flex' }}>
          <Typography.Text bold css={getTruncatedStyles(shouldTruncateKey)} size="sm">
            {itemKey}
          </Typography.Text>
          :&nbsp;
          <Typography.Text css={getTruncatedStyles(shouldTruncateValue)} size="sm">
            {itemValue}
          </Typography.Text>
        </span>
      </Tag>
    </Tooltip>
  );
};

export function getKeyAndValueComplexTruncation(
  key: string,
  value: string,
  charLimit: number,
): { shouldTruncateKey: boolean; shouldTruncateValue: boolean } {
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

---[FILE: library-versions.json]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/ml-model-trace-renderer/library-versions.json

```json
{
  "current": {
    "path": "/static/lib/ml-model-trace-renderer/index.html"
  },
  "2": {
    "path": "/static/lib/ml-model-trace-renderer/2/index.html",
    "commit": "4b4af7f303ca266b48e8c70d422b8a5173b662b2"
  },
  "oss": {
    "path": "/static/lib/ml-model-trace-renderer/oss/index.html",
    "commit": "b5595f5c6263c1c8e3614d85eb1d233d28789bb9"
  },
  "3": {
    "path": "/static/lib/ml-model-trace-renderer/3/index.html",
    "commit": "4b4af7f303ca266b48e8c70d422b8a5173b662b2"
  },
  "4": {
    "path": "/static/lib/ml-model-trace-renderer/4/index.html",
    "commit": "4b4af7f303ca266b48e8c70d422b8a5173b662b2"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bootstrap.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/bootstrap.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';

import { IntlProvider } from '@databricks/i18n';
import { SupportsDuBoisThemes } from '@databricks/web-shared/design-system';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';
import '@databricks/design-system/dist/index.css';
import '@databricks/design-system/dist/index-dark.css';

import './index.css';

const LazyModelTraceExplorer = React.lazy(() =>
  import('@databricks/web-shared/model-trace-explorer').then((module) => ({
    default: module.ModelTraceExplorerOSSNotebookRenderer,
  })),
);

const getLazyDesignSystem = () => import('@databricks/design-system');

const LazyDesignSystemProvider = React.lazy(() =>
  getLazyDesignSystem().then((module) => ({ default: module.DesignSystemProvider })),
);

const LazyApplyGlobalStyles = React.lazy(() =>
  getLazyDesignSystem().then((module) => ({ default: module.ApplyGlobalStyles })),
);

const LazyDesignSystemContext = React.lazy(() =>
  getLazyDesignSystem().then((module) => ({ default: module.DesignSystemEventProvider })),
);

const DesignSystemProviders: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <SupportsDuBoisThemes>
      <LazyDesignSystemContext callback={() => {}}>
        <LazyDesignSystemProvider>
          <LazyApplyGlobalStyles />
          {children}
        </LazyDesignSystemProvider>
      </LazyDesignSystemContext>
    </SupportsDuBoisThemes>
  );
};

const FLAG_OVERRIDES: Record<string, boolean> = {
  // without this, the tags look really ugly in OSS
  'databricks.fe.designsystem.useNewTagColors': true,
  'databricks.fe.traceExplorer.enableSummaryView': true,
};

export const AppComponent = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  // hack to silence console warnings in OSS
  if (!(window as any).__databricks_mfe_rpc) {
    Object.defineProperty(window, '__databricks_mfe_rpc', {
      configurable: false,
      writable: false,
      value: {
        // mock all safex calls to return their default value
        makeCall: (id: string, args: any) => {
          if (args?.flagName in FLAG_OVERRIDES) {
            return FLAG_OVERRIDES[args?.flagName];
          }

          return args?.defaultValue;
        },
        hasHandlerFor: () => true,
        registerHandler: () => {},
        unregisterHandler: () => {},
      },
    });
  }

  return (
    <React.Suspense fallback={null}>
      <DesignSystemProviders>
        <IntlProvider locale="en">
          <QueryClientProvider client={queryClient}>
            <LazyModelTraceExplorer />
          </QueryClientProvider>
        </IntlProvider>
      </DesignSystemProviders>
    </React.Suspense>
  );
};

ReactDOM.render(<AppComponent />, document.getElementById('root'));
```

--------------------------------------------------------------------------------

---[FILE: index.css]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.css

```text
input,
select,
option,
button,
textarea,
body,
thead {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

body,
thead {
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  box-shadow: none;
}

html,
body,
pre,
code {
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
}

html {
  overflow-y: hidden;
}
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.html

```text
<html>
  <head></head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.ts

```typescript
// Override webpack public path for dynamic imports
declare const __webpack_public_path__ = '/static-files/';

// Bootstrapping asynchronously to avoid eager consumption of shared modules.
/* webpackMode: "eager" */
import('./bootstrap');
```

--------------------------------------------------------------------------------

---[FILE: mlflow-fetch-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/mlflow-fetch-utils.ts

```typescript
import type { ModelTrace, ModelTraceData } from '@databricks/web-shared/model-trace-explorer';
import { getAjaxUrl } from '../ModelTraceExplorer.request.utils';

// returns ModelTrace if the request is successful, otherwise returns an error message
export async function getTraceArtifact(requestId: string): Promise<ModelTrace | string> {
  try {
    // eslint-disable-next-line no-restricted-globals -- See go/spog-fetch
    const result = await fetch(getAjaxUrl(`ajax-api/2.0/mlflow/get-trace-artifact?request_id=${requestId}`));
    const text = await result.text();

    const jsonData = JSON.parse(text);
    // successful request containing span data
    if (jsonData.spans) {
      return {
        info: {
          request_id: requestId,
        },
        data: jsonData as ModelTraceData,
      };
    }

    if (jsonData.error_code) {
      return jsonData.message;
    }

    return 'Unknown error occurred';
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }

    if (typeof e === 'string') {
      return e;
    }

    return 'Unknown error occurred';
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerOSSNotebookRenderer.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/ModelTraceExplorerOSSNotebookRenderer.test.tsx

```typescript
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { DesignSystemProvider } from '@databricks/design-system';
import { IntlProvider } from '@databricks/i18n';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';

import { ModelTraceExplorerOSSNotebookRenderer } from './ModelTraceExplorerOSSNotebookRenderer';
import { getTraceArtifact } from './mlflow-fetch-utils';
import { MOCK_TRACE } from '../ModelTraceExplorer.test-utils';

jest.mock('./mlflow-fetch-utils', () => ({
  getTraceArtifact: jest.fn(),
}));

jest.mock('../hooks/useGetModelTraceInfo', () => ({
  useGetModelTraceInfo: jest.fn().mockReturnValue({
    refetch: jest.fn(),
  }),
}));

describe('ModelTraceExplorerOSSNotebookRenderer', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: new URL('http://localhost:5000/?trace_id=1&experiment_id=1'),
    });

    jest.mocked(getTraceArtifact).mockResolvedValue(MOCK_TRACE);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    const queryClient = new QueryClient();

    render(
      <IntlProvider locale="en">
        <DesignSystemProvider>
          <QueryClientProvider client={queryClient}>
            <ModelTraceExplorerOSSNotebookRenderer />
          </QueryClientProvider>
        </DesignSystemProvider>
      </IntlProvider>,
    );

    expect(await screen.findByText('MLflow Trace UI')).toBeInTheDocument();
    expect(await screen.findByText('document-qa-chain')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerOSSNotebookRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/ModelTraceExplorerOSSNotebookRenderer.tsx
Signals: React

```typescript
import { useState, useEffect, useMemo } from 'react';

import {
  useDesignSystemTheme,
  Typography,
  Pagination,
  Empty,
  DangerIcon,
  InfoTooltip,
} from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';
import { ModelTraceExplorer, getTraceArtifact } from '@databricks/web-shared/model-trace-explorer';
import type { ModelTrace } from '@databricks/web-shared/model-trace-explorer';

const MLFLOW_DOCS_URI = 'https://mlflow.org/docs/latest/llms/tracing/index.html?ref=jupyter-notebook-widget';

const getMlflowUILinkForTrace = (traceId: string, experimentId: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('selectedTraceId', traceId);
  queryParams.append('compareRunsMode', 'TRACES');
  return `/#/experiments/${experimentId}?${queryParams.toString()}`;
};

export const ModelTraceExplorerOSSNotebookRenderer = () => {
  const traceIds = useMemo(() => new URLSearchParams(window.location.search).getAll('trace_id'), []);
  const experimentIds = useMemo(() => new URLSearchParams(window.location.search).getAll('experiment_id'), []);

  const [activeTraceIndex, setActiveTraceIndex] = useState(traceIds.length > 0 ? 0 : null);
  const [traceData, setTraceData] = useState<ModelTrace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useDesignSystemTheme();

  useEffect(() => {
    const fetchTraceData = async () => {
      if (activeTraceIndex === null) {
        return;
      }

      setIsLoading(true);
      const activeTraceId = traceIds[activeTraceIndex];
      const data = await getTraceArtifact(activeTraceId);

      if (typeof data === 'string') {
        setError(data);
      } else {
        setTraceData(data);
      }

      setIsLoading(false);
    };

    fetchTraceData();
  }, [activeTraceIndex, traceIds]);

  if (traceIds.length === 0 || activeTraceIndex === null) {
    return null;
  }

  if (isLoading) {
    return (
      <div css={{ width: 'calc(100% - 2px)' }}>
        <Typography.Text color="secondary">
          <FormattedMessage
            defaultMessage="Fetching trace data..."
            description="MLflow trace notebook output > loading state"
          />
        </Typography.Text>
      </div>
    );
  }

  // some error occured
  if (!traceData) {
    return (
      <div css={{ paddingTop: theme.spacing.md, width: 'calc(100% - 2px)' }}>
        <Empty
          image={<DangerIcon />}
          description={
            <>
              <Typography.Paragraph>
                <FormattedMessage
                  defaultMessage="An error occurred while attempting to fetch trace data (ID: {traceId}). Please ensure that the MLflow tracking server is running, and that the trace data exists. Error details:"
                  description="An error message explaining that an error occured while fetching trace data"
                  values={{ traceId: traceIds[activeTraceIndex] }}
                />
              </Typography.Paragraph>
              {error && <Typography.Paragraph>{error}</Typography.Paragraph>}
            </>
          }
          title={
            <FormattedMessage defaultMessage="Error" description="MLflow trace notebook output > error state title" />
          }
        />
      </div>
    );
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.colors.border}`,
        // -2px to prevent bottom border from being cut off
        height: 'calc(100% - 2px)',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <Typography.Title level={4} withoutMargins>
            MLflow Trace UI
          </Typography.Title>
          <InfoTooltip
            componentId="mlflow.notebook.trace-ui-info"
            iconTitle="More information"
            maxWidth={400}
            content={
              <FormattedMessage
                defaultMessage="To disable or enable this display, call {disableFunction} or {enableFunction} and re-run the cell"
                description="Content in an info popover that instructs the user on how to disable the display. The disable and enable functions are code snippets with the real function names"
                values={{
                  disableFunction: <code>mlflow.tracing.disable_notebook_display()</code>,
                  enableFunction: <code>mlflow.tracing.enable_notebook_display()</code>,
                }}
              />
            }
          />
          <Typography.Link
            componentId="mlflow.notebook.trace-ui-learn-more-link"
            href={MLFLOW_DOCS_URI}
            openInNewTab
            title="Learn More"
          >
            <FormattedMessage
              defaultMessage="Learn More"
              description="Link to MLflow documentation for more information on MLflow tracing"
            />
          </Typography.Link>
        </div>
        <Typography.Link
          componentId="mlflow.notebook.trace-ui-see-in-mlflow-link"
          href={getMlflowUILinkForTrace(traceIds[activeTraceIndex], experimentIds[activeTraceIndex])}
          openInNewTab
          title="View in MLflow UI"
        >
          <FormattedMessage
            defaultMessage="View in MLflow UI"
            description="Link to the MLflow UI for an alternate view of the current trace"
          />
        </Typography.Link>
      </div>
      {traceIds.length > 1 && (
        <Pagination
          componentId="mlflow.notebook.pagination"
          currentPageIndex={activeTraceIndex + 1}
          dangerouslySetAntdProps={{
            showQuickJumper: true,
          }}
          numTotal={traceIds.length}
          onChange={(index) => setActiveTraceIndex(index - 1)}
          pageSize={1}
          style={{ marginBottom: theme.spacing.sm, paddingLeft: theme.spacing.sm, paddingRight: theme.spacing.sm }}
        />
      )}
      <div css={{ flex: 1, overflow: 'hidden' }}>
        <ModelTraceExplorer modelTrace={traceData} initialActiveView="detail" />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/README.md

```text
# Jupter Notebook Trace UI Renderer

This directory contains a standalone notebook renderer that is built as a separate entry point from the main MLflow application.

## Architecture

The notebook renderer is configured as a separate webpack entry point that generates its own HTML file and JavaScript bundle, completely independent of the main MLflow application.

### Build Configuration

The webpack configuration in `craco.config.js` handles the dual-entry setup:

1. **Entry Points**:

   - `main`: The main MLflow application (`src/index.tsx`)
   - `ml-model-trace-renderer`: The notebook renderer (`src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.ts`)

2. **Output Structure**:

   ```
   build/
   ├── index.html                           # Main app HTML (excludes notebook renderer)
   ├── static/js/main.[hash].js             # Main app bundle
   ├── static/css/main.[hash].css           # Main app styles
   └── lib/notebook-trace-renderer/
       ├── index.html                       # Notebook renderer HTML
       └── js/ml-model-trace-renderer.[hash].js  # Notebook renderer bundle
   ```

3. **Path Resolution**:
   - Main app uses relative paths: `static-files/static/js/...`
   - Notebook renderer uses absolute paths: `/static-files/lib/notebook-trace-renderer/js/...`
   - Dynamic chunks use absolute paths: `/static-files/static/...` (via `__webpack_public_path__`)

### Key Configuration Details

#### Separate Entry Configuration

```javascript
webpackConfig.entry = {
  main: webpackConfig.entry, // Preserve original entry as 'main'
  'ml-model-trace-renderer': path.resolve(
    __dirname,
    'src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.ts',
  ),
};
```

#### Output Path Functions

```javascript
webpackConfig.output = {
  filename: (pathData) => {
    return pathData.chunk.name === 'ml-model-trace-renderer'
      ? 'lib/notebook-trace-renderer/js/[name].[contenthash].js'
      : 'static/js/[name].[contenthash:8].js';
  },
  // ... similar for chunkFilename
};
```

#### HTML Plugin Configuration

- **Main app**: Excludes notebook renderer chunks via `excludeChunks: ['ml-model-trace-renderer']`
- **Notebook renderer**: Includes only its own chunks via `chunks: ['ml-model-trace-renderer']`

#### Runtime Path Override

The notebook renderer sets `__webpack_public_path__ = '/static-files/'` at runtime to ensure dynamically loaded chunks use the correct absolute paths.

## Files

- `index.ts`: Entry point that sets webpack public path and bootstraps the renderer
- `bootstrap.tsx`: Main renderer component
- `index.html`: HTML template for the standalone renderer
- `index.css`: Styles for the renderer

## Usage

The notebook renderer is built automatically as part of the main build process:

```bash
yarn build
```

This generates both the main application and the standalone notebook renderer, accessible at:

- Main app: `/static-files/index.html`
- Notebook renderer: `/static-files/lib/notebook-trace-renderer/index.html`

## Development Notes

- The renderer is completely independent of the main app - no shared runtime dependencies
- Uses absolute paths to avoid complex relative path calculations
- Webpack code splitting works correctly for both entry points
- CSS extraction is configured separately for each entry point
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerAttributesTab.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/right-pane/ModelTraceExplorerAttributesTab.tsx

```typescript
import { isNil, keys } from 'lodash';

import { Empty, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import type { ModelTraceSpanNode, SearchMatch } from '../ModelTrace.types';
import { ModelTraceExplorerCodeSnippet } from '../ModelTraceExplorerCodeSnippet';

export function ModelTraceExplorerAttributesTab({
  activeSpan,
  searchFilter,
  activeMatch,
}: {
  activeSpan: ModelTraceSpanNode;
  searchFilter: string;
  activeMatch: SearchMatch | null;
}) {
  const { theme } = useDesignSystemTheme();
  const { attributes } = activeSpan;
  const containsAttributes = keys(attributes).length > 0;
  const isActiveMatchSpan = !isNil(activeMatch) && activeMatch.span.key === activeSpan.key;

  if (!containsAttributes || isNil(attributes)) {
    return (
      <div css={{ marginTop: theme.spacing.md }}>
        <Empty
          description={
            <FormattedMessage
              defaultMessage="No attributes found"
              description="Empty state for the attributes tab in the model trace explorer. Attributes are properties of a span that the user defines."
            />
          }
        />
      </div>
    );
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
      }}
    >
      {Object.entries(attributes).map(([key, value]) => (
        <ModelTraceExplorerCodeSnippet
          key={key}
          title={key}
          data={JSON.stringify(value, null, 2)}
          searchFilter={searchFilter}
          activeMatch={activeMatch}
          containsActiveMatch={isActiveMatchSpan && activeMatch.section === 'attributes' && activeMatch.key === key}
        />
      ))}
    </div>
  );
}
```

--------------------------------------------------------------------------------

````

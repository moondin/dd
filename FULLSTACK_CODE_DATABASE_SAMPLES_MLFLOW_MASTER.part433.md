---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 433
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 433 of 991)

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

---[FILE: ArtifactUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/ArtifactUtils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { ErrorWrapper } from './ErrorWrapper';
import { getDefaultHeaders, HTTPMethods } from './FetchUtils';

/**
 * Async function to fetch and return the specified artifact blob from response.
 * Throw exception if the request fails.
 */
export async function getArtifactBlob(artifactLocation: any) {
  const getArtifactRequest = new Request(artifactLocation, {
    method: HTTPMethods.GET,
    redirect: 'follow',
    // TODO: fix types
    headers: new Headers(getDefaultHeaders(document.cookie) as any),
  });
  // eslint-disable-next-line no-restricted-globals -- See go/spog-fetch
  const response = await fetch(getArtifactRequest);

  if (!response.ok) {
    const errorMessage = (await response.text()) || response.statusText;
    throw new ErrorWrapper(errorMessage, response.status);
  }
  return response.blob();
}

class TextArtifactTooLargeError extends Error {}

/**
 * Async function to fetch and return the specified text artifact.
 * Avoids unnecessary conversion to blob, parses chunked responses directly to text.
 */
export const getArtifactChunkedText = async (artifactLocation: string) =>
  new Promise<string>(async (resolve, reject) => {
    const getArtifactRequest = new Request(artifactLocation, {
      method: HTTPMethods.GET,
      redirect: 'follow',
      headers: new Headers(getDefaultHeaders(document.cookie) as HeadersInit),
    });
    // eslint-disable-next-line no-restricted-globals -- See go/spog-fetch
    const response = await fetch(getArtifactRequest);

    if (!response.ok) {
      const errorMessage = (await response.text()) || response.statusText;
      reject(new ErrorWrapper(errorMessage, response.status));
      return;
    }
    const reader = response.body?.getReader();

    if (reader) {
      let resultData = '';
      const decoder = new TextDecoder();
      const appendChunk = async (result: ReadableStreamReadResult<Uint8Array>) => {
        const decodedChunk = decoder.decode(result.value || new Uint8Array(), {
          stream: !result.done,
        });
        resultData += decodedChunk;
        if (result.done) {
          resolve(resultData);
        } else {
          reader.read().then(appendChunk).catch(reject);
        }
      };

      reader.read().then(appendChunk).catch(reject);
    } else {
      reject(new Error("Can't get artifact data from the server"));
    }
  });

/**
 * Fetches the specified artifact, returning a Promise that resolves with
 * the raw content converted to text of the artifact if the fetch is
 * successful, and rejects otherwise
 */
export function getArtifactContent<R = unknown>(artifactLocation: string, isBinary = false): Promise<R> {
  return new Promise<R>(async (resolve, reject) => {
    try {
      const blob = await getArtifactBlob(artifactLocation);

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        // Resolve promise with artifact contents
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        resolve(event.target.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      if (isBinary) {
        fileReader.readAsArrayBuffer(blob);
      } else {
        fileReader.readAsText(blob);
      }
    } catch (error) {
      // eslint-disable-next-line no-console -- TODO(FEINF-3587)
      console.error(error);
      reject(error);
    }
  });
}

/**
 * Fetches the specified artifact, returning a Promise that resolves with
 * the raw content in bytes of the artifact if the fetch is successful, and rejects otherwise
 */
export function getArtifactBytesContent(artifactLocation: any) {
  return getArtifactContent(artifactLocation, true);
}

export const getLoggedModelArtifactLocationUrl = (path: string, loggedModelId: string) => {
  return `ajax-api/2.0/mlflow/logged-models/${loggedModelId}/artifacts/files?artifact_file_path=${encodeURIComponent(
    path,
  )}`;
};

export const getArtifactLocationUrl = (path: string, runUuid: string) => {
  const artifactEndpointPath = 'get-artifact';
  return `${artifactEndpointPath}?path=${encodeURIComponent(path)}&run_uuid=${encodeURIComponent(runUuid)}`;
};
```

--------------------------------------------------------------------------------

---[FILE: DatabricksTestUtils.d.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/DatabricksTestUtils.d.ts

```typescript
export const test: (name: string, fn: () => any) => void;
```

--------------------------------------------------------------------------------

---[FILE: ErrorUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/ErrorUtils.tsx
Signals: React

```typescript
import React from 'react';
import { BadRequestError, InternalServerError, NotFoundError, PermissionError } from '@databricks/web-shared/errors';
import { ErrorWrapper } from './ErrorWrapper';
import { ErrorCodes } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
class ErrorUtils {
  static mlflowServices = {
    MODEL_REGISTRY: 'Model Registry',
    EXPERIMENTS: 'Experiments',
    CHAT_SESSIONS: 'Chat Sessions',
    MODEL_SERVING: 'Model Serving',
    RUN_TRACKING: 'Run Tracking',
  };
}

/**
 * Maps known types of ErrorWrapper (legacy) to platform's predefined error instances.
 */
export const mapErrorWrapperToPredefinedError = (errorWrapper: ErrorWrapper, requestId?: string) => {
  if (!(errorWrapper instanceof ErrorWrapper)) {
    return undefined;
  }
  const { status } = errorWrapper;
  let error: Error | undefined = undefined;
  const networkErrorDetails = { status };
  if (errorWrapper.getErrorCode() === ErrorCodes.RESOURCE_DOES_NOT_EXIST) {
    error = new NotFoundError(networkErrorDetails);
  }
  if (errorWrapper.getErrorCode() === ErrorCodes.PERMISSION_DENIED) {
    error = new PermissionError(networkErrorDetails);
  }
  if (errorWrapper.getErrorCode() === ErrorCodes.INTERNAL_ERROR) {
    error = new InternalServerError(networkErrorDetails);
  }
  if (errorWrapper.getErrorCode() === ErrorCodes.INVALID_PARAMETER_VALUE) {
    error = new BadRequestError(networkErrorDetails);
  }

  // Attempt to extract message from error wrapper and assign it to the error instance.
  const messageFromErrorWrapper = errorWrapper.getMessageField();
  if (error && messageFromErrorWrapper) {
    error.message = messageFromErrorWrapper;
  }

  return error;
};
export default ErrorUtils;
```

--------------------------------------------------------------------------------

---[FILE: ErrorWrapper.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/ErrorWrapper.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { ErrorWrapper } from './ErrorWrapper';

describe('ErrorWrapper', () => {
  it('renderHttpError works on DatabricksServiceExceptions', () => {
    const error = new ErrorWrapper('{ "error_code": "INVALID_REQUEST", "message": "Foo!" }', 400).renderHttpError();
    expect(error).toEqual('INVALID_REQUEST: Foo!');
  });

  it('renderHttpError works on DatabricksServiceExceptions with stack traces', () => {
    const error = new ErrorWrapper(
      '{ "error_code": "INVALID_REQUEST", "message": "Foo!", "stack_trace": "Boop!" }',
      400,
    ).renderHttpError();
    expect(error).toEqual('INVALID_REQUEST: Foo!\n\nBoop!');
  });

  it('renderHttpError works on HTML', () => {
    const error = new ErrorWrapper('<div>This\n\n\n</div>Is an error!<br/>', 400).renderHttpError();
    expect(error).toEqual('This\nIs an error!');
  });

  it('renderHttpError works weird stuff', () => {
    const error = new ErrorWrapper('{}', 500).renderHttpError();
    expect(error).toEqual('Request Failed');
  });

  it('ErrorWrapper.getErrorCode does not fail on JSON decoding problems', () => {
    const error = new ErrorWrapper('a{waefaw', 400).getErrorCode();
    expect(error).toEqual('INTERNAL_ERROR');
  });

  it('ErrorWrapper.is4xxError correctly detects 4XX error', () => {
    const error401 = new ErrorWrapper('{}', 401);
    const error404 = new ErrorWrapper('{}', 404);
    const error503 = new ErrorWrapper('{}', 503);
    const errorUncategorized = new ErrorWrapper('some textual error');

    expect(error401.is4xxError()).toEqual(true);
    expect(error404.is4xxError()).toEqual(true);
    expect(error503.is4xxError()).toEqual(false);
    expect(errorUncategorized.is4xxError()).toEqual(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ErrorWrapper.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/ErrorWrapper.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { NotFoundError, BadRequestError, InternalServerError, PermissionError } from '@databricks/web-shared/errors';
import { ErrorCodes } from '../constants';

export class ErrorWrapper {
  status: any;
  text: any;
  textJson: any;
  constructor(text: any, status = 500) {
    this.status = status;
    this.text = text;
    if (typeof text === 'object') {
      this.textJson = text;
    } else {
      try {
        this.textJson = JSON.parse(text);
      } catch {
        this.textJson = null;
      }
    }
  }

  getStatus() {
    return this.status;
  }

  getUserVisibleError() {
    return this.textJson || 'INTERNAL_SERVER_ERROR';
  }

  getErrorCode() {
    return this.textJson ? this.textJson.error_code : ErrorCodes.INTERNAL_ERROR;
  }

  getMessageField() {
    return this.textJson ? this.textJson.message : ErrorCodes.INTERNAL_ERROR;
  }

  renderHttpError() {
    if (this.textJson) {
      if (this.textJson.error_code && this.textJson.message) {
        const message = this.textJson.error_code + ': ' + this.textJson.message;
        return this.textJson.stack_trace ? `${message}\n\n${this.textJson.stack_trace}` : message;
      } else {
        return this.textJson.message || 'Request Failed';
      }
    } else {
      // Do our best to clean up and return the error: remove any tags, and reduce duplicate
      // newlines.
      let simplifiedText = this.text.replace(/<[^>]+>/gi, '');
      simplifiedText = simplifiedText.replace(/\n\n+/gi, '\n');
      simplifiedText = simplifiedText.trim();
      return simplifiedText;
    }
  }

  /**
   * Returns true if this instance wraps HTTP client (4XX) error
   */
  is4xxError() {
    const status = parseInt(this.getStatus(), 10);
    return status >= 400 && status <= 499;
  }

  // Tries to parse the error message from the response and convert it to matching PredefinedError instance
  translateToErrorInstance() {
    let error = null;
    if (this.status === 404 || this.textJson?.error_code === ErrorCodes.RESOURCE_DOES_NOT_EXIST) {
      error = new NotFoundError({});
    } else if (this.status === 400 || this.textJson?.error_code === ErrorCodes.INVALID_PARAMETER_VALUE) {
      error = new BadRequestError({});
    } else if (this.status === 403 || this.textJson?.error_code === ErrorCodes.PERMISSION_DENIED) {
      error = new PermissionError({});
    } else if (this.status === 500 || this.textJson?.error_code === ErrorCodes.INTERNAL_ERROR) {
      error = new InternalServerError({});
    }

    if (error) {
      if (this.getMessageField()) {
        error.message = this.getMessageField();
      }

      return error;
    }

    return new Error(this.getMessageField());
  }
}
```

--------------------------------------------------------------------------------

---[FILE: FeatureUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/FeatureUtils.ts

```typescript
/**
 * This file aggregates utility functions for enabling features configured by flags.
 * In the OSS version, you can override them in local development by manually changing the return values.
 */

export const shouldEnableRunDetailsPageAutoRefresh = () => true;

/**
 * Enable chart expressions feature
 */
export const shouldEnableChartExpressions = () => false;

/**
 * Update relative time axis to use date
 */
export const shouldEnableRelativeTimeDateAxis = () => false;
/**
 * Should enable new difference view charts
 */
export const shouldEnableNewDifferenceViewCharts = () => false;
export const shouldEnableDifferenceViewChartsV3 = () => false;
export const shouldEnableMinMaxMetricsOnExperimentPage = () => false;

export const shouldUseCompressedExperimentViewSharedState = () => true;
export const shouldEnableUnifiedChartDataTraceHighlight = () => true;
export const shouldUseRegexpBasedAutoRunsSearchFilter = () => false;
export const shouldUseRunRowsVisibilityMap = () => true;
export const isUnstableNestedComponentsMigrated = () => true;
export const shouldUsePredefinedErrorsInExperimentTracking = () => true;

/**
 * Determines if logged models UI (part of model-centric IA shift) is enabled
 */
export const isLoggedModelsFilteringAndSortingEnabled = () => false;
export const isRunPageLoggedModelsTableEnabled = () => true;

/**
 * Flags enabling fetching data via GraphQL for particular views:
 */
export const shouldEnableGraphQLRunDetailsPage = () => true;
export const shouldEnableGraphQLSampledMetrics = () => false;
export const shouldEnableGraphQLModelVersionsForRunDetails = () => false;
export const shouldRerunExperimentUISeeding = () => false;

/**
 * Feature flag to enable Scorers UI tab in experiment page
 */
export const enableScorersUI = () => {
  return false;
};

/**
 * Determines if running scorers feature is enabled (ability to run LLM scorers on sample traces)
 */
export const isRunningScorersEnabled = () => {
  return false;
};

/**
 * Determines if experiment kind inference is enabled.
 */
export const shouldEnableExperimentKindInference = () => true;

/**
 * Determines if the new prompts tab on DB platform is enabled.
 */
export const shouldEnablePromptsTabOnDBPlatform = () => false;

export const shouldEnablePromptTags = () => false;

export const shouldUseSharedTaggingUI = () => false;

export const shouldDisableReproduceRunButton = () => false;

export const shouldEnablePromptLab = () => {
  return true;
};

export const shouldUnifyLoggedModelsAndRegisteredModels = () => {
  return false;
};

/**
 * Enables use of GetLoggedModels API allowing to get multiple logged models by their IDs.
 */
export const shouldUseGetLoggedModelsBatchAPI = () => {
  return false;
};

/**
 * A flag determining if we should display the new models UI.
 */
export const shouldShowModelsNextUI = () => {
  return true;
};

export const shouldEnableTracesV3View = () => {
  return true;
};

export const shouldEnableTraceInsights = () => {
  return false;
};

export const shouldEnableTracesSyncUI = () => {
  return false;
};

/**
 * Total number of traces that will be fetched via mlflow traces 3.0 search api in eval tab
 */
export const getEvalTabTotalTracesLimit = () => {
  return 1000;
};

/**
 * Determines if evaluation results online monitoring UI is enabled
 */
export const isExperimentEvalResultsMonitoringUIEnabled = () => {
  return true;
};

export const shouldUseUnifiedArtifactBrowserForLoggedModels = () => {
  return false;
};

export const shouldUseUnifiedArtifactBrowserForRunDetailsPage = () => {
  return false;
};

/**
 * Determines if the run metadata are visible on run details page overview.
 */
export const shouldEnableRunDetailsMetadataBoxOnRunDetailsPage = () => {
  return false;
};

/**
 * Determines if the artifacts are visible on run details page overview.
 */
export const shouldEnableArtifactsOnRunDetailsPage = () => {
  return false;
};

/**
 * Determines if the assessments pane should be disabled when trace info fetch fails.
 * In OSS, we keep the pane enabled to avoid confusing users (showing stale data is better than nothing).
 * In Databricks, we disable it because playground creates fake traces that can't have assessments.
 */
export const shouldDisableAssessmentsPaneOnFetchFailure = () => {
  return false;
};

export const shouldEnableExperimentPageSideTabs = () => {
  return true;
};
```

--------------------------------------------------------------------------------

---[FILE: FetchUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/FetchUtils.test.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  defaultResponseParser,
  getDefaultHeadersFromCookies,
  HTTPMethods,
  HTTPRetryStatuses,
  jsonBigIntResponseParser,
  parseResponse,
  yamlResponseParser,
  retry,
  fetchEndpointRaw,
  fetchEndpoint,
  getJson,
  getBigIntJson,
  putBigIntJson,
  patchBigIntJson,
  getYaml,
  putJson,
  putYaml,
  patchJson,
  patchYaml,
  postJson,
  postBigIntJson,
  postYaml,
  deleteJson,
  deleteBigIntJson,
  deleteYaml,
} from './FetchUtils';
import { ErrorWrapper } from './ErrorWrapper';

describe('FetchUtils', () => {
  describe('getDefaultHeadersFromCookies', () => {
    it('empty cookie should result in no headers', () => {
      expect(getDefaultHeadersFromCookies('')).toEqual({});
    });
    it('cookies from static service are parsed correctly', () => {
      expect(
        getDefaultHeadersFromCookies(`a=b; mlflow-request-header-My-CSRF=1; mlflow-request-header-Hello=World; c=d`),
      ).toEqual({ 'My-CSRF': '1', Hello: 'World' });
    });
  });
  describe('parseResponse', () => {
    let mockResolve: any;
    beforeEach(() => {
      mockResolve = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('parseResponse parser failure resolves to text', async () => {
      const invalidParser = () => {
        throw new Error('failed to parse');
      };
      const mockResponse = {
        text: () => Promise.resolve('text'),
      };
      parseResponse({ resolve: mockResolve, response: mockResponse, parser: invalidParser });
      await new Promise(setImmediate);
      expect(mockResolve).toHaveBeenCalledWith('text');
    });
    it('defaultResponseParser', async () => {
      const mockResponse = {
        text: () => Promise.resolve('{"a": 123, "b": "flying monkey"}'),
      };
      defaultResponseParser({ resolve: mockResolve, response: mockResponse });
      await new Promise(setImmediate);
      expect(mockResolve).toHaveBeenCalledWith({ a: 123, b: 'flying monkey' });
    });
    it('jsonBigIntResponseParser', async () => {
      const mockResponse = {
        text: () => Promise.resolve('{"a": 11111111222222223333333344444445555555555}'),
      };
      jsonBigIntResponseParser({ resolve: mockResolve, response: mockResponse });
      await new Promise(setImmediate);
      expect(mockResolve).toHaveBeenCalledWith({ a: '11111111222222223333333344444445555555555' });
    });
    it('yamlResponseParser', async () => {
      const mockResponse = {
        text: () => Promise.resolve('artifact_path: model_signature\nflavors:\n  keras:\n    data: data\n'),
      };
      yamlResponseParser({ resolve: mockResolve, response: mockResponse });
      await new Promise(setImmediate);
      expect(mockResolve).toHaveBeenCalledWith({
        artifact_path: 'model_signature',
        flavors: { keras: { data: 'data' } },
      });
    });
  });
  describe('fetchEndpointRaw', () => {
    let mockResponse: any;
    let setTimeoutSpy: any;
    let mockFetch: any;
    let relativeUrl: any;
    let mockData: any;
    beforeEach(() => {
      mockResponse = {
        ok: true,
        status: 200,
        statusText: 'Ok',
        text: () => Promise.resolve('{"crazy": 8}'),
      };
      mockFetch = jest.fn(() => Promise.resolve(mockResponse));
      global.fetch = mockFetch;
      setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      relativeUrl = '/ajax-api/2.0/service/endpoint';
      mockData = {
        group_id: 12345,
        user_id: 'qwerty',
        experimental_user: true,
        invalid_field: undefined,
      };
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('default headerOptions and options are expected', () => {
      Object.values(HTTPMethods).forEach(async (method) => {
        await fetchEndpointRaw({ relativeUrl, method, data: mockData });
        expect(mockFetch).toHaveBeenCalledWith(relativeUrl, {
          dataType: 'json',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method,
        });
      });
    });
    it('overridden headerOptions and options are propagated correctly', () => {
      const customHeaders = { zzz_header: '123456', 'Content-Type': 'application/text' };
      const customOptions = { redirect: 'follow', dataType: 'text' };
      Object.values(HTTPMethods).forEach(async (method) => {
        await fetchEndpointRaw({
          relativeUrl,
          method,
          data: mockData,
          headerOptions: customHeaders,
          options: customOptions,
        });
        expect(mockFetch).toHaveBeenCalledWith(relativeUrl, {
          dataType: 'text',
          headers: { 'Content-Type': 'application/text', zzz_header: '123456' },
          method,
          redirect: 'follow',
        });
      });
    });
    it('setting timeout triggers setTimeout', async () => {
      await fetchEndpointRaw({ relativeUrl, timeoutMs: 1000 });
      // setTimeout should have been called
      expect(setTimeoutSpy).toHaveBeenCalled();
      // abort signal should've been set by abort controller
      expect(mockFetch.mock.calls[0][1].signal).not.toBeUndefined();
    });
    it('without setting timeout setTimeout is not triggered', async () => {
      await fetchEndpointRaw({ relativeUrl });
      // setTimeout should NOT have been called
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      // signal should be undefined
      expect(mockFetch.mock.calls[0][1].signal).toBeUndefined();
    });
  });
  describe('retry', () => {
    let mockFn: any;
    let mockSuccess: any;
    let mockError: any;
    let mockSuccessCondition: any;
    let mockErrorCondition: any;
    let setTimeoutSpy: any;
    const retryWithMocks = ({ retries = 5, interval = 5, retryIntervalMultiplier = 1 }) =>
      retry(mockFn, {
        retries: retries,
        interval: interval,
        retryIntervalMultiplier: retryIntervalMultiplier,
        successCondition: mockSuccessCondition,
        success: mockSuccess,
        errorCondition: mockErrorCondition,
        error: mockError,
      });
    beforeEach(() => {
      mockFn = jest.fn(() => 'response string');
      mockSuccess = jest.fn();
      mockError = jest.fn();
      mockSuccessCondition = jest.fn(() => true);
      mockErrorCondition = jest.fn(() => false);
      setTimeoutSpy = jest.spyOn(window, 'setTimeout');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('retry triggers success callback on successCondition=true', async () => {
      mockSuccessCondition = jest.fn(() => true);
      mockErrorCondition = jest.fn(() => false);
      await retryWithMocks({});
      // trigger fn and no timeout
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      // success callback is triggered with response
      expect(mockSuccess).toHaveBeenCalledTimes(1);
      expect(mockSuccess).toHaveBeenCalledWith({ res: 'response string' });
      // error callback is not triggered
      expect(mockError).not.toHaveBeenCalled();
    });
    it('retry triggers error callback on errorCondition=true', async () => {
      mockSuccessCondition = jest.fn(() => false);
      mockErrorCondition = jest.fn(() => true);
      await retryWithMocks({});
      // trigger fn and no timeout
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      // error callback is triggered with response
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith({ res: 'response string' });
      // success callback is not triggered
      expect(mockSuccess).not.toHaveBeenCalled();
    });
    it('retry triggers success callback when both successCondition and errorCondition are true', async () => {
      mockSuccessCondition = jest.fn(() => true);
      mockErrorCondition = jest.fn(() => true);
      await retryWithMocks({});
      // trigger fn and no timeout
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      // success callback is triggered with response
      expect(mockSuccess).toHaveBeenCalledTimes(1);
      expect(mockSuccess).toHaveBeenCalledWith({ res: 'response string' });
      // error callback is not triggered
      expect(mockError).not.toHaveBeenCalled();
    });
    it('retry triggers error callback on exception', async () => {
      mockFn = jest.fn(() => {
        throw new Error('oops');
      });
      await retryWithMocks({});
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(setTimeoutSpy).not.toHaveBeenCalled();
      // error callback is triggered with the err
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith({ err: new Error('oops') });
      // success callback is not triggered
      expect(mockSuccess).not.toHaveBeenCalled();
    });
    it('retry triggers success callback after satisfying successCondition within retry limits', async () => {
      let n = 0;
      // make the function success after 3 retries
      mockSuccessCondition = jest.fn(() => {
        const res = n === 3;
        n += 1;
        return res;
      });
      mockErrorCondition = jest.fn(() => false);
      await retryWithMocks({});
      // function is triggered for 4 times and we've set timeout for 3 times
      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
      // success callback is triggered after 3 retries with the response
      expect(mockSuccess).toHaveBeenCalledTimes(1);
      expect(mockSuccess).toHaveBeenCalledWith({ res: 'response string' });
      // error callback is not triggered
      expect(mockError).not.toHaveBeenCalled();
    });
    it('retry triggers error callback after reaching retry limits', async () => {
      mockSuccessCondition = jest.fn(() => false);
      mockErrorCondition = jest.fn(() => false);
      await retryWithMocks({});
      // function is triggered for 6 times and we've set timeout for 5 times
      expect(mockFn).toHaveBeenCalledTimes(6);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(5);
      // error callback is triggered after 5 retries with the response
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError).toHaveBeenCalledWith({ res: 'response string' });
      // success callback is not triggered
      expect(mockSuccess).not.toHaveBeenCalled();
    });
    it('retryIntervalMultiplier changes retry interval', async () => {
      mockSuccessCondition = jest.fn(() => false);
      mockErrorCondition = jest.fn(() => false);
      await retryWithMocks({ retries: 5, interval: 100, retryIntervalMultiplier: 2 });
      expect(mockFn).toHaveBeenCalledTimes(6);
      let i = 0;
      [100, 200, 400, 800, 1600].forEach((interval) => {
        expect(setTimeoutSpy.mock.calls[i][1]).toEqual(interval);
        i += 1;
      });
    });
  });
  describe('fetchEndpoint', () => {
    it('fetchEndpoint resolves on ok response', async () => {
      const okResponse = { ok: true, status: 200, text: () => Promise.resolve('{"dope": "ape"}') };
      // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: boolean; status: number; ... Remove this comment to see the full error message
      global.fetch = jest.fn(() => Promise.resolve(okResponse));
      await expect(fetchEndpoint({ relativeUrl: 'http://localhost:3000' })).resolves.toEqual({
        dope: 'ape',
      });
    });
    it.each(HTTPRetryStatuses)(
      'fetchEndpoint resolves on consecutive retry status and a final valid response',
      async (retryStatus) => {
        const tooManyRequestsResponse = {
          ok: false,
          status: retryStatus,
          statusText: 'TooManyRequests',
        };
        const okResponse = {
          ok: true,
          status: 200,
          text: () => Promise.resolve('{"sorry": "I am late"}'),
        };
        const responses = [...Array(2).fill(tooManyRequestsResponse), okResponse];
        // pop the head of the array on each call
        global.fetch = jest.fn(() => Promise.resolve(responses.shift()));
        await expect(
          fetchEndpoint({
            relativeUrl: 'http://localhost:3000',
            initialDelay: 5,
            retries: 4,
          }),
        ).resolves.toEqual({ sorry: 'I am late' });
      },
    );
    it.each(HTTPRetryStatuses)(
      'fetchEndpoint rejects on consecutive retry status and no valid response',
      async (retryStatus) => {
        const tooManyRequestsResponse = {
          ok: false,
          status: retryStatus,
          text: () => Promise.resolve('{error_code: "TooManyRequests", message: "TooManyRequests"}'),
        };
        const responses = Array(3).fill(tooManyRequestsResponse);
        global.fetch = jest.fn(() => Promise.resolve(responses.shift()));
        await expect(
          fetchEndpoint({
            relativeUrl: 'http://localhost:3000',
            initialDelay: 5,
            retries: 2,
          }),
        ).rejects.toEqual(new ErrorWrapper('{error_code: "TooManyRequests", message: "TooManyRequests"}', retryStatus));
      },
    );
    it('fetchEndpoint rejects on non retry status failures', async () => {
      const permissionDeniedResponse = {
        ok: false,
        status: 403,
        text: () => Promise.resolve('{error_code: "PermissionDenied", message: "PermissionDenied"}'),
      };
      // @ts-expect-error TS(2322): Type 'Mock<Promise<{ ok: boolean; status: number; ... Remove this comment to see the full error message
      global.fetch = jest.fn(() => Promise.resolve(permissionDeniedResponse));
      await expect(
        fetchEndpoint({
          relativeUrl: 'http://localhost:3000',
          initialDelay: 5,
          retries: 2,
        }),
      ).rejects.toEqual(new ErrorWrapper('{error_code: "PermissionDenied", message: "PermissionDenied"}', 403));
    });
    it('fetchEndpoint rejects on random exceptions', async () => {
      const randomError = new Error('something went wrong...');
      global.fetch = jest.fn(() => Promise.reject(randomError));
      await expect(
        fetchEndpoint({
          relativeUrl: 'http://localhost:3000',
          initialDelay: 5,
          retries: 2,
        }),
      ).rejects.toEqual(new ErrorWrapper(new Error('something went wrong...'), 500));
    });
  });
  describe('fetchEndpoint syntactic sugars', () => {
    let mockResponse: any;
    let mockFetch: any;
    let relativeUrl: any;
    let mockData: any;
    beforeEach(() => {
      mockResponse = {
        ok: true,
        status: 200,
        statusText: 'Ok',
        text: () => Promise.resolve('{"crazy": 8}'),
      };
      mockFetch = jest.fn(() => Promise.resolve(mockResponse));
      global.fetch = mockFetch;
      relativeUrl = '/ajax-api/2.0/service/endpoint';
      mockData = {
        group_id: 12345,
        user_id: 'qwerty',
        experimental_user: false,
        null_field: null,
        undefined_field: undefined,
      };
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('GET requests bake data in query params', () => {
      [getJson, getBigIntJson, getYaml].forEach(async (getCall) => {
        await getCall({ relativeUrl, data: mockData });
        expect(mockFetch).toHaveBeenCalledWith(
          `${relativeUrl}?group_id=12345&user_id=qwerty&experimental_user=false&null_field=null`,
          {
            dataType: 'json',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            method: 'GET',
          },
        );
      });
    });
    it('other requests pass data to request body', () => {
      [
        { fetchCall: putJson, method: HTTPMethods.PUT },
        { fetchCall: putBigIntJson, method: HTTPMethods.PUT },
        { fetchCall: putYaml, method: HTTPMethods.PUT },
        { fetchCall: patchJson, method: HTTPMethods.PATCH },
        { fetchCall: patchBigIntJson, method: HTTPMethods.PATCH },
        { fetchCall: patchYaml, method: HTTPMethods.PATCH },
        { fetchCall: postJson, method: HTTPMethods.POST },
        { fetchCall: postBigIntJson, method: HTTPMethods.POST },
        { fetchCall: postYaml, method: HTTPMethods.POST },
        { fetchCall: deleteJson, method: HTTPMethods.DELETE },
        { fetchCall: deleteBigIntJson, method: HTTPMethods.DELETE },
        { fetchCall: deleteYaml, method: HTTPMethods.DELETE },
      ].forEach((args) => {
        const { fetchCall, method } = args;
        const mockArrayData = [1, undefined, null, 2];
        const mockStringData = '[1, undefined, null, 2]';
        fetchCall({ relativeUrl, data: mockData });
        expect(mockFetch).toHaveBeenLastCalledWith(relativeUrl, {
          dataType: 'json',
          body: JSON.stringify({
            group_id: 12345,
            user_id: 'qwerty',
            experimental_user: false,
            null_field: null,
          }),
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method,
        });
        fetchCall({ relativeUrl, data: mockArrayData });
        expect(mockFetch).toHaveBeenLastCalledWith(relativeUrl, {
          dataType: 'json',
          body: JSON.stringify([1, null, 2]),
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method,
        });
        fetchCall({ relativeUrl, data: mockStringData });
        expect(mockFetch).toHaveBeenCalledWith(relativeUrl, {
          dataType: 'json',
          body: mockStringData,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method,
        });
      });
    });
  });
});
```

--------------------------------------------------------------------------------

````

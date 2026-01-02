---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 434
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 434 of 991)

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

---[FILE: FetchUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/FetchUtils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import cookie from 'cookie';
import JsonBigInt from 'json-bigint';
import yaml from 'js-yaml';
import { isNil, pickBy } from 'lodash';
import { ErrorWrapper } from './ErrorWrapper';
import { matchPredefinedError } from '@databricks/web-shared/errors';
import { matchPredefinedErrorFromResponse } from '@databricks/web-shared/errors';

export const HTTPMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP status codes that should be retried. Includes:
// 429 (too many requests), 556 (RCP: workspace not served by shard)
export const HTTPRetryStatuses = [429, 556];

// To enable running behind applications that require specific headers
// to be set during HTTP requests (e.g., CSRF tokens), we support parsing
// a set of cookies with a key prefix of "$appName-request-header-$headerName",
// which will be added as an HTTP header to all requests.
export const getDefaultHeadersFromCookies = (cookieStr: any) => {
  const headerCookiePrefix = 'mlflow-request-header-';
  const parsedCookie = cookie.parse(cookieStr);
  if (!parsedCookie || Object.keys(parsedCookie).length === 0) {
    return {};
  }
  return Object.keys(parsedCookie)
    .filter((cookieName) => cookieName.startsWith(headerCookiePrefix))
    .reduce(
      (acc, cookieName) => ({
        ...acc,
        [cookieName.substring(headerCookiePrefix.length)]: parsedCookie[cookieName],
      }),
      {},
    );
};

export const getDefaultHeaders = (cookieStr: any) => {
  const cookieHeaders = getDefaultHeadersFromCookies(cookieStr);
  return {
    ...cookieHeaders,
  };
};

export const getAjaxUrl = (relativeUrl: any) => {
  if (process.env['MLFLOW_USE_ABSOLUTE_AJAX_URLS'] === 'true' && !relativeUrl.startsWith('/')) {
    return '/' + relativeUrl;
  }
  return relativeUrl;
};

// return response json by default, if response is not parsable to json,
// return response text as best effort.
// e.g. model artifact files are in yaml format. Currently it is parsed in a separate action.
// We should remove the redundant action and use the yaml parser defined here
export const parseResponse = ({ resolve, response, parser }: any) => {
  response.text().then((text: any) => {
    try {
      resolve(parser(text));
    } catch {
      resolve(text);
    }
  });
};

export const defaultResponseParser = ({ resolve, response }: any) =>
  parseResponse({ resolve, response, parser: JSON.parse });

export const jsonBigIntResponseParser = ({ resolve, response }: any) =>
  parseResponse({
    resolve,
    response,
    parser: JsonBigInt({ strict: true, storeAsString: true }).parse,
  });

export const yamlResponseParser = ({ resolve, response }: any) =>
  parseResponse({ resolve, response, parser: yaml.safeLoad });

export const defaultError = ({ reject, response, err }: any) => {
  // eslint-disable-next-line no-console -- TODO(FEINF-3587)
  console.error('Fetch failed: ', response || err);
  if (response) {
    response.text().then((text: any) => reject(new ErrorWrapper(text, response.status)));
  } else if (err) {
    reject(new ErrorWrapper(err, 500));
  }
};

/**
 * Makes a fetch request.
 * Note this is not intended to be used outside of this file,
 * use `fetchEndpoint` instead.
 */
export const fetchEndpointRaw = ({
  relativeUrl,
  method = HTTPMethods.GET,
  body = undefined,
  headerOptions = {},
  options = {},
  timeoutMs = undefined,
}: any) => {
  const url = getAjaxUrl(relativeUrl);

  // if custom headers has duplicate fields with default Headers,
  // values in the custom headers options will always override.
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    ...getDefaultHeaders(document.cookie),
    ...headerOptions,
  };

  const defaultOptions = {
    dataType: 'json',
  };
  // use an abort controller for setting request timeout if defined
  // https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
  const abortController = new AbortController();
  if (timeoutMs) {
    setTimeout(() => abortController.abort(), timeoutMs);
  }

  const fetchOptions = {
    method,
    headers,
    ...(body && { body }),
    ...defaultOptions,
    ...options,
    ...(timeoutMs && { signal: abortController.signal }),
  };
  // eslint-disable-next-line no-restricted-globals -- See go/spog-fetch
  return fetch(url, fetchOptions);
};

/**
 * Generic function to retry a given function
 * @param fn: function to retry
 * @param options: additional options
 * - retries: max number of retries
 * - interval: wait interval before the next retry
 * - retryIntervalMultiplier: wait interval multiplier for each additional retry
 * - successCondition: callback with the result of `fn` to determine
 * if `success` callback should be triggered.
 * Defaults to `true`, meaning as long as no exception is thrown,
 * we should trigger `success` callback.
 * - success: callback with the result of `fn` when `successCondition` is true,
 * Defaults to returning the response
 * - errorCondition: callback with the result of `fn` to determine
 * if `error` callback should be triggered.
 * Defaults to `false`, meaning as long as we got a response,
 * we should not trigger `error` callback.
 * - error: callback with the result of `fn` when any of the following case is met
 * 1. errorCondition is true
 * 2. the max number of retries has reached
 * 3. an exception error is thrown while executing `fn`
 * Defaults to throwing an exception
 * @returns {Promise<*|undefined>}
 */
// @ts-expect-error TS(7023): 'retry' implicitly has return type 'any' because i... Remove this comment to see the full error message
export const retry = async (
  fn: any,
  {
    retries = 2,
    interval = 500,
    retryIntervalMultiplier = 1,
    successCondition = () => true,
    success = ({ res }: any) => res,
    errorCondition = () => false,
    error = ({ res, err }: any) => {
      throw new Error(res || err);
    },
  } = {},
) => {
  try {
    const fnResult = await fn();
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    if (successCondition(fnResult)) return success({ res: fnResult });
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    if (retries === 0 || errorCondition(fnResult)) return error({ res: fnResult });
    await new Promise((resolve) => setTimeout(resolve, interval));
    return retry(fn, {
      retries: retries - 1,
      interval: interval * retryIntervalMultiplier,
      retryIntervalMultiplier,
      success,
      error,
      successCondition,
      errorCondition,
    });
  } catch (err) {
    return error({ err });
  }
};

// not a 200 and also not a retryable HTTP status code
const defaultFetchErrorConditionFn = (res: any) => !res || (!res.ok && !HTTPRetryStatuses.includes(res.status));

/**
 * Makes a fetch request.
 * @param relativeUrl: relative URL to the shard URL
 * @param method: HTTP method for the request
 * @param body: request body
 * @param headerOptions: additional headers for the request
 * @param options: additional fetch options for the request
 * @param timeoutMs: timeout for the request in milliseconds, defaults to browser timeout
 * @param retries: Number of times to retry the request on a retryable HTTP status code
 * @param initialDelay: Initial delay for the retry, will be doubled for each additional retry
 * @param success: callback on 200 responses
 * @param error: callback on non 200 responses
 * note that fetch won't reject HTTP error status
 * so this is the callback to handle non 200 responses.
 * See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#differences_from_jquery
 * @returns {Promise<T>}
 */
export const fetchEndpoint = ({
  relativeUrl,
  method = HTTPMethods.GET,
  body = undefined,
  headerOptions = {},
  options = {},
  timeoutMs = undefined,
  retries = 7,
  initialDelay = 1000,
  success = defaultResponseParser,
  error = defaultError,
  errorCondition = defaultFetchErrorConditionFn,
}: any) => {
  return new Promise((resolve, reject) =>
    retry(
      () =>
        fetchEndpointRaw({
          relativeUrl,
          method,
          body,
          headerOptions,
          options,
          timeoutMs,
        }),
      {
        retries,
        interval: initialDelay,
        retryIntervalMultiplier: 2,
        // 200s
        // @ts-expect-error TS(2322): Type '(res: any) => any' is not assignable to type... Remove this comment to see the full error message
        successCondition: (res: any) => res && res.ok,
        success: ({ res }) => success({ resolve, reject, response: res }),
        errorCondition,
        // @ts-expect-error TS(2322): Type '({ res, err }: any) => any' is not assignabl... Remove this comment to see the full error message
        error: ({ res, err }) => error({ resolve, reject, response: res, err: err }),
      },
    ),
  );
};

const filterUndefinedFields = (data: any) => {
  if (!Array.isArray(data)) {
    return pickBy(data, (v) => v !== undefined);
  } else {
    return data.filter((v) => v !== undefined);
  }
};

// Generate request body from js object or a string
const generateJsonBody = (data: any) => {
  if (typeof data === 'string') {
    // assuming the input is already a valid JSON string
    return data;
  } else if (typeof data === 'object') {
    return JSON.stringify(filterUndefinedFields(data));
  } else {
    throw new Error(
      // Reported during ESLint upgrade
      // eslint-disable-next-line max-len
      'Unexpected type of input. The REST api payload type must be either an object or a string, got ' + typeof data,
    );
  }
};

/* All functions below are essentially syntactic sugars for fetchEndpoint */

export const getJson = (props: any) => {
  const { relativeUrl, data } = props;
  const queryParams = new URLSearchParams(filterUndefinedFields(data)).toString();
  const combinedUrl = queryParams ? `${relativeUrl}?${queryParams}` : relativeUrl;
  return fetchEndpoint({
    ...props,
    relativeUrl: combinedUrl,
    method: HTTPMethods.GET,
    success: defaultResponseParser,
  });
};

export const postJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    method: HTTPMethods.POST,
    body: generateJsonBody(data),
    success: defaultResponseParser,
    ...props,
  });
};

export const putJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.PUT,
    body: generateJsonBody(data),
    success: defaultResponseParser,
  });
};

export const patchJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.PATCH,
    body: generateJsonBody(data),
    success: defaultResponseParser,
  });
};

export const deleteJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.DELETE,
    body: generateJsonBody(data),
    success: defaultResponseParser,
  });
};

export const getBigIntJson = (props: any) => {
  const { relativeUrl, data } = props;
  const queryParams = new URLSearchParams(filterUndefinedFields(data));
  return fetchEndpoint({
    ...props,
    ...(String(queryParams).length > 0 && {
      relativeUrl: `${relativeUrl}?${queryParams}`,
    }),
    method: HTTPMethods.GET,
    success: jsonBigIntResponseParser,
  });
};

export const postBigIntJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.POST,
    body: generateJsonBody(data),
    success: jsonBigIntResponseParser,
  });
};

export const putBigIntJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.PUT,
    body: generateJsonBody(data),
    success: jsonBigIntResponseParser,
  });
};

export const patchBigIntJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.PATCH,
    body: generateJsonBody(data),
    success: jsonBigIntResponseParser,
  });
};

export const deleteBigIntJson = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.DELETE,
    body: generateJsonBody(data),
    success: jsonBigIntResponseParser,
  });
};

export const getYaml = (props: any) => {
  const { relativeUrl, data } = props;
  const queryParams = new URLSearchParams(filterUndefinedFields(data));
  return fetchEndpoint({
    ...props,
    ...(queryParams && { relativeUrl: `${relativeUrl}?${queryParams}` }),
    method: HTTPMethods.GET,
    success: yamlResponseParser,
  });
};

export const postYaml = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.POST,
    body: generateJsonBody(data),
    success: yamlResponseParser,
  });
};

export const putYaml = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.PUT,
    body: generateJsonBody(data),
    success: yamlResponseParser,
  });
};

export const patchYaml = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.PATCH,
    body: generateJsonBody(data),
    success: yamlResponseParser,
  });
};

export const deleteYaml = (props: any) => {
  const { data } = props;
  return fetchEndpoint({
    ...props,
    method: HTTPMethods.DELETE,
    body: generateJsonBody(data),
    success: yamlResponseParser,
  });
};

function serializeRequestBody(payload: any | FormData | Blob) {
  if (payload === undefined) {
    return undefined;
  }
  return typeof payload === 'string' || payload instanceof FormData || payload instanceof Blob
    ? payload
    : JSON.stringify(payload);
}

// Helper method to make a request to the backend.
export const fetchAPI = async (url: string, method: 'POST' | 'GET' | 'PATCH' | 'DELETE' = 'GET', body?: any) => {
  // eslint-disable-next-line no-restricted-globals
  const fetchFn = fetch;
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...getDefaultHeaders(document.cookie),
  };
  const response = await fetchFn(url, {
    method,
    body: serializeRequestBody(body),
    headers,
  });
  if (!response.ok) {
    const predefinedError = matchPredefinedError(response);
    if (predefinedError) {
      try {
        // Attempt to use message from the response
        const message = (await response.json()).message;
        predefinedError.message = message ?? predefinedError.message;
      } catch {
        // If the message can't be parsed, use default one
      }
      throw predefinedError;
    }
  }
  return response.json();
};
/**
 * Wrapper around fetch that throws on non-OK responses
 * Returns the Response object for further processing (.json(), .text(), etc.)
 *
 * @param input - URL or Request object
 * @param options - Fetch options
 * @returns Response object if successful
 * @throws PredefinedError (NotFoundError, PermissionError, etc.) if response is not OK
 */
export async function fetchOrFail(input: RequestInfo | URL, options?: RequestInit): Promise<Response> {
  // eslint-disable-next-line no-restricted-globals -- See go/spog-fetch
  const response = await fetch(input, options);
  if (!response.ok) {
    const error = matchPredefinedErrorFromResponse(response);
    throw error;
  }
  return response;
}
```

--------------------------------------------------------------------------------

---[FILE: FileUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/FileUtils.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import { getLanguage } from './FileUtils';

describe('FileUtils', () => {
  test('getLanguage', () => {
    expect(getLanguage('foo.js')).toBe('js');
    expect(getLanguage('foo.bar.js')).toBe('js');
    expect(getLanguage('foo/bar.js')).toBe('js');
    expect(getLanguage('foo')).toBe('foo');
    expect(getLanguage('MLmodel')).toBe('yaml');
    expect(getLanguage('MLproject')).toBe('yaml');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: FileUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/FileUtils.ts

```typescript
export const getBasename = (path: string) => {
  const parts = path.split('/');
  return parts[parts.length - 1];
};

export const getExtension = (path: string) => {
  const parts = path.split(/[./]/);
  return parts[parts.length - 1];
};

export const getLanguage = (path: string) => {
  const ext = getExtension(path).toLowerCase();
  if (ext in MLFLOW_FILE_LANGUAGES) {
    return MLFLOW_FILE_LANGUAGES[ext];
  }
  return ext;
};

const MLPROJECT_FILE_NAME = 'mlproject';
const MLMODEL_FILE_NAME = 'mlmodel';

const MLFLOW_FILE_LANGUAGES = {
  [MLPROJECT_FILE_NAME.toLowerCase()]: 'yaml',
  [MLMODEL_FILE_NAME.toLowerCase()]: 'yaml',
};

export const IMAGE_EXTENSIONS = new Set(['jpg', 'bmp', 'jpeg', 'png', 'gif', 'svg']);
export const TEXT_EXTENSIONS = new Set([
  'txt',
  'log',
  'err',
  'cfg',
  'conf',
  'cnf',
  'cf',
  'ini',
  'properties',
  'prop',
  'hocon',
  'toml',
  'yaml',
  'yml',
  'xml',
  'json',
  'js',
  'py',
  'py3',
  'md',
  'rst',
  MLPROJECT_FILE_NAME.toLowerCase(),
  MLMODEL_FILE_NAME.toLowerCase(),
  'jsonnet',
]);
export const HTML_EXTENSIONS = new Set(['html']);
export const MAP_EXTENSIONS = new Set(['geojson']);
export const PDF_EXTENSIONS = new Set(['pdf']);
export const DATA_EXTENSIONS = new Set(['csv', 'tsv']);
// Audio extensions supported by wavesurfer.js
// Source https://github.com/katspaugh/wavesurfer.js/discussions/2703#discussioncomment-5259526
export const AUDIO_EXTENSIONS = new Set(['m4a', 'mp3', 'mp4', 'wav', 'aac', 'wma', 'flac', 'opus', 'ogg']);
export const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'mkv', 'webm', 'avi']);
```

--------------------------------------------------------------------------------

---[FILE: graphQLHooks.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/graphQLHooks.tsx

```typescript
import type { Observable } from '@apollo/client/core';
import { ApolloLink, type Operation, type NextLink, type FetchResult } from '@apollo/client/core';
import { getDefaultHeaders } from './FetchUtils';
export * from '@apollo/client';
export * from '@apollo/client/link/retry';
export * from '@apollo/client/testing';

export class DefaultHeadersLink extends ApolloLink {
  private cookieStr: string;

  constructor({ cookieStr }: { cookieStr: string }) {
    super();
    this.cookieStr = cookieStr;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...getDefaultHeaders(this.cookieStr),
      },
    }));

    return forward(operation);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LocalStorageUtils.d.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/LocalStorageUtils.d.ts

```typescript
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export class LocalStorageUtils {
  static version: string;

  static getStoreForComponent(componentName: any, id: any): LocalStorageStore;
  static getSessionScopedStoreForComponent(componentName: any, id: any): LocalStorageStore;
}

export class LocalStorageStore {
  constructor(scope: string, type: string);
  static reactComponentStateKey: string;
  loadComponentState(): any;
  saveComponentState(stateRecord: any): void;
  withScopePrefix(key: any): any;
  setItem(key: any, value: any): void;
  getItem(key: any): any;
}

export default LocalStorageUtils;
```

--------------------------------------------------------------------------------

---[FILE: LocalStorageUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/LocalStorageUtils.test.ts

```typescript
import { test, expect, jest } from '@jest/globals';
import LocalStorageUtils from './LocalStorageUtils';
import { ExperimentPagePersistedState } from '../../experiment-tracking/sdk/MlflowLocalStorageMessages';

test('Setting key-value pairs in one scope does not affect the other', () => {
  const store0 = LocalStorageUtils.getStoreForComponent('SomeTestComponent', 1);
  const store1 = LocalStorageUtils.getStoreForComponent('AnotherTestComponent', 1);
  const store2 = LocalStorageUtils.getStoreForComponent('SomeTestComponent', 2);
  const persistedState0 = new ExperimentPagePersistedState({ searchInput: 'params.ollKorrect' });
  const persistedState1 = new ExperimentPagePersistedState({ searchInput: 'metrics.ok' });
  [store1, store2].forEach((otherStore) => {
    store0.setItem('myKey', 'myCoolVal');
    otherStore.setItem('myKey', 'thisValIsBetterYo');
    expect(store0.getItem('myKey')).toEqual('myCoolVal');
    expect(otherStore.getItem('myKey')).toEqual('thisValIsBetterYo');

    store0.saveComponentState(persistedState0);
    otherStore.saveComponentState(persistedState1);
    expect(store0.loadComponentState().searchInput).toEqual('params.ollKorrect');
    expect(otherStore.loadComponentState().searchInput).toEqual('metrics.ok');
  });
});

test('Overwriting key-value pairs is possible', () => {
  const store = LocalStorageUtils.getStoreForComponent('SomeTestComponent', 1);
  store.setItem('a', 'b');
  expect(store.getItem('a')).toEqual('b');
  store.setItem('a', 'c');
  expect(store.getItem('a')).toEqual('c');
  store.saveComponentState(new ExperimentPagePersistedState({ searchInput: 'params.ollKorrect' }));
  expect(store.loadComponentState().searchInput).toEqual('params.ollKorrect');
  store.saveComponentState(new ExperimentPagePersistedState({ searchInput: 'params.okay' }));
  expect(store.loadComponentState().searchInput).toEqual('params.okay');
});

test('Session scoped storage works', () => {
  const store = LocalStorageUtils.getSessionScopedStoreForComponent('SomeTestComponent', 1);
  store.setItem('a', 'b');
  expect(store.getItem('a')).toEqual('b');
  store.setItem('a', 'c');
  expect(store.getItem('a')).toEqual('c');
  store.saveComponentState(new ExperimentPagePersistedState({ searchInput: 'params.ollKorrect' }));
  expect(store.loadComponentState().searchInput).toEqual('params.ollKorrect');
  store.saveComponentState(new ExperimentPagePersistedState({ searchInput: 'params.okay' }));
  expect(store.loadComponentState().searchInput).toEqual('params.okay');

  const store1 = LocalStorageUtils.getSessionScopedStoreForComponent('AnotherTestComponent', 1);
  const store2 = LocalStorageUtils.getSessionScopedStoreForComponent('SomeTestComponent', 2);
  const persistedState0 = new ExperimentPagePersistedState({ searchInput: 'params.ollKorrect' });
  const persistedState1 = new ExperimentPagePersistedState({ searchInput: 'metrics.ok' });
  [store1, store2].forEach((otherStore) => {
    store.setItem('myKey', 'myCoolVal');
    otherStore.setItem('myKey', 'thisValIsBetterYo');
    expect(store.getItem('myKey')).toEqual('myCoolVal');
    expect(otherStore.getItem('myKey')).toEqual('thisValIsBetterYo');

    store.saveComponentState(persistedState0);
    otherStore.saveComponentState(persistedState1);
    expect(store.loadComponentState().searchInput).toEqual('params.ollKorrect');
    expect(otherStore.loadComponentState().searchInput).toEqual('metrics.ok');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: LocalStorageUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/LocalStorageUtils.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

/**
 * Utils for working with local storage.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- TODO(FEINF-4274)
export default class LocalStorageUtils {
  /**
   * Protocol version of MLflow's local storage. Should be incremented on any breaking change in how
   * data persisted in local storage is used, to prevent old (invalid) cached data from being loaded
   * and breaking the application.
   */
  static version = '1.1';

  /**
   * Return a LocalStorageStore corresponding to the specified component and ID, where the ID
   * can be used to disambiguate between multiple instances of cached data for the same component
   * (e.g. cached data for multiple experiments).
   */
  static getStoreForComponent(componentName: any, id: any) {
    return new LocalStorageStore([componentName, id].join('-'), 'localStorage');
  }

  static getSessionScopedStoreForComponent(componentName: any, id: any) {
    return new LocalStorageStore([componentName, id].join('-'), 'sessionStorage');
  }
}

/**
 * Interface to browser local storage that allows for setting key-value pairs under the specified
 * "scope".
 */
class LocalStorageStore {
  constructor(scope: any, type: any) {
    this.scope = scope;
    if (type === 'localStorage') {
      this.storageObj = window.localStorage;
    } else {
      this.storageObj = window.sessionStorage;
    }
  }
  static reactComponentStateKey = 'ReactComponentState';

  scope: any;
  storageObj: any;

  /**
   * Loads React component state cached in local storage into a vanilla JS object.
   */
  loadComponentState() {
    const storedVal = this.getItem(LocalStorageStore.reactComponentStateKey);
    if (storedVal) {
      return JSON.parse(storedVal);
    }
    return {};
  }

  /**
   * Save React component state in local storage.
   * @param stateRecord: Immutable.Record instance or plain object containing component state.
   */
  saveComponentState(stateRecord: any) {
    const targetValue = typeof stateRecord.toJSON === 'function' ? stateRecord.toJSON() : stateRecord;
    this.setItem(LocalStorageStore.reactComponentStateKey, JSON.stringify(targetValue));
  }

  /**
   * Helper method for constructing a scoped key to use for setting/getting values in
   * local storage.
   */
  withScopePrefix(key: any) {
    return ['MLflowLocalStorage', LocalStorageUtils.version, this.scope, key].join('-');
  }

  /** Save the specified key-value pair in local storage. */
  setItem(key: any, value: any) {
    this.storageObj.setItem(this.withScopePrefix(key), value);
  }

  /** Fetch the value corresponding to the passed-in key from local storage. */
  getItem(key: any) {
    return this.storageObj.getItem(this.withScopePrefix(key));
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MarkdownUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/common/utils/MarkdownUtils.ts
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { useCallback } from 'react';
import sanitizeHtml from 'sanitize-html';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'show... Remove this comment to see the full error message
import { Converter } from 'showdown';

// Use Github-like Markdown (i.e. support for tasklists, strikethrough,
// simple line breaks, code blocks, emojis)
const DEFAULT_MARKDOWN_FLAVOR = 'github';

let _converter: Converter | null = null;

export const getMarkdownConverter = () => {
  // Reuse the same converter instance if available
  if (_converter) {
    return _converter;
  }
  _converter = new Converter();
  _converter.setFlavor(DEFAULT_MARKDOWN_FLAVOR);
  return _converter;
};

// Options for HTML sanitizer.
// See https://www.npmjs.com/package/sanitize-html#what-are-the-default-options for usage.
// These options were chosen to be similar to Github's allowlist but simpler (i.e. we don't
// do any transforms of the contained HTML and we disallow script entirely instead of
// removing contents).
const sanitizerOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'h7',
    'h8',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'ins',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'del',
    'sup',
    'sub',
    'dl',
    'dt',
    'dd',
    'kbd',
    'q',
    'samp',
    'samp',
    'var',
    'hr',
    'rt',
    'rp',
    'summary',
    'iframe',
    'img',
    'caption',
    'figure',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src', 'longdesc'],
    div: ['itemscope', 'itemtype'],
  },
};

export const sanitizeConvertedHtml = (dirtyHtml: any) => {
  return sanitizeHtml(dirtyHtml, sanitizerOptions);
};

export const forceAnchorTagNewTab = (html: any) => {
  return html.replace(new RegExp('<a', 'g'), '<a target="_blank"');
};

export const useMarkdownConverter = () =>
  useCallback((markdown?: string) => {
    const converter = getMarkdownConverter();
    const html = converter.makeHtml(markdown);
    return sanitizeConvertedHtml(html);
  }, []);
```

--------------------------------------------------------------------------------

---[FILE: reactQueryHooks.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/reactQueryHooks.tsx

```typescript
export * from '@tanstack/react-query';
```

--------------------------------------------------------------------------------

---[FILE: RoutingTestUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/RoutingTestUtils.tsx
Signals: React

```typescript
import React from 'react';
import { MemoryRouter, Route, Routes } from './RoutingUtils';

const renderRoute = ({ element, path = '*', pageId, children }: any) => {
  if (children && children.length > 0) {
    return (
      <Route element={element} key={pageId || path} path={path}>
        {children.map(renderRoute)}
      </Route>
    );
  }
  return <Route element={element} key={pageId || path} path={path} />;
};

/**
 * A dummy router to be used in jest tests. Usage:
 *
 * @example
 * ```ts
 *  import { testRoute, TestRouter } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
 *  import { setupTestRouter, waitForRoutesToBeRendered } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
 *
 *  describe('ComponentUnderTest', () => {
 *    it('renders', async () => {
 *      render(<Router history={history} routes={[testRoute(<ComponentUnderTest props={...}/>)]}/>);
 *
 *      expect(...);
 *    });
 *  });
 * ```
 *
 */
export const TestRouter = ({ routes, history, initialEntries }: TestRouterProps) => {
  return (
    <MemoryRouter initialEntries={initialEntries ?? ['/']}>
      <Routes>{routes.map(renderRoute)}</Routes>
    </MemoryRouter>
  );
};

type TestRouteReturnValue = {
  element: React.ReactElement;
  path?: string;
  pageId?: string;
  children?: TestRouteReturnValue[];
};
interface TestRouterProps {
  routes: TestRouteReturnValue[];
  history?: any;
  initialEntries?: string[];
}

export const testRoute = (element: React.ReactNode, path = '*', pageId = '', children = []): TestRouteReturnValue => {
  return { element, path, pageId, children } as any;
};

export const setupTestRouter = () => ({ history: {} });
export const waitForRoutesToBeRendered = async () => {
  return Promise.resolve();
};
```

--------------------------------------------------------------------------------

---[FILE: RoutingUtils.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/RoutingUtils.tsx
Signals: React

```typescript
/**
 * This file is the only one that should directly import from 'react-router-dom' module
 */
/* eslint-disable no-restricted-imports */

/**
 * Import React Router V6 parts
 */
import {
  BrowserRouter,
  MemoryRouter,
  HashRouter,
  matchPath,
  generatePath,
  Navigate,
  Route,
  UNSAFE_NavigationContext,
  NavLink,
  Outlet as OutletDirect,
  Link as LinkDirect,
  useNavigate as useNavigateDirect,
  useLocation as useLocationDirect,
  useParams as useParamsDirect,
  useSearchParams as useSearchParamsDirect,
  createHashRouter,
  RouterProvider,
  Routes,
  type To,
  type NavigateOptions,
  type Location,
  type NavigateFunction,
  type Params,
} from 'react-router-dom';

/**
 * Import React Router V5 parts
 */
import { HashRouter as HashRouterV5, Link as LinkV5, NavLink as NavLinkV5 } from 'react-router-dom';
import type { ComponentProps } from 'react';
import React from 'react';

const useLocation = useLocationDirect;

const useSearchParams = useSearchParamsDirect;

const useParams = useParamsDirect;

const useNavigate = useNavigateDirect;

const Outlet = OutletDirect;

const Link = LinkDirect;

export const createMLflowRoutePath = (routePath: string) => {
  return routePath;
};

export {
  // React Router V6 API exports
  BrowserRouter,
  MemoryRouter,
  HashRouter,
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  generatePath,
  matchPath,
  Navigate,
  Route,
  Routes,
  Outlet,

  // Exports used to build hash-based data router
  createHashRouter,
  RouterProvider,

  // Unsafe navigation context, will be improved after full migration to react-router v6
  UNSAFE_NavigationContext,
};

export const createLazyRouteElement = (
  // Load the module's default export and turn it into React Element
  componentLoader: () => Promise<{ default: React.ComponentType<React.PropsWithChildren<any>> }>,
) => React.createElement(React.lazy(componentLoader));
export const createRouteElement = (component: React.ComponentType<React.PropsWithChildren<any>>) =>
  React.createElement(component);

export type { Location, NavigateFunction, Params, To, NavigateOptions };
```

--------------------------------------------------------------------------------

---[FILE: setup-msw.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/setup-msw.tsx

```typescript
import { afterAll, afterEach, beforeAll, beforeEach, jest } from '@jest/globals';
import type { RequestHandler } from 'msw';
import { setupServer as setupMsw } from 'msw/node';

export function setupServer(...handlers: RequestHandler[]) {
  const server = setupMsw(...handlers);

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    });
  });

  beforeEach(() => {
    // In order to make graphql work with msw, we need to restore the fetch function so that it
    // automatically throw an error
    // This is only relevant for when the graphql queries are called.
    jest.mocked(global.fetch).mockRestore();
  });

  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
}
```

--------------------------------------------------------------------------------

````

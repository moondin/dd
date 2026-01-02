---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 438
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 438 of 991)

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

---[FILE: withErrorBoundary.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/withErrorBoundary.tsx
Signals: React

```typescript
import React from 'react';
import type { ErrorBoundaryPropsWithComponent, FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorUtils from './ErrorUtils';
import { DangerIcon, Empty } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

export type ErrorBoundaryProps = {
  children: React.Component;
  customFallbackComponent?: ErrorBoundaryPropsWithComponent['FallbackComponent'];
};

function ErrorFallback() {
  return (
    <Empty
      data-testid="fallback"
      title={<FormattedMessage defaultMessage="Error" description="Title of editor error fallback component" />}
      description={
        <FormattedMessage
          defaultMessage="An error occurred while rendering this component."
          description="Description of error fallback component"
        />
      }
      image={<DangerIcon />}
    />
  );
}

function CustomErrorBoundary({ children, customFallbackComponent }: React.PropsWithChildren<ErrorBoundaryProps>) {
  function logErrorToConsole(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console -- TODO(FEINF-3587)
    console.error('Caught Unexpected Error: ', error, info.componentStack);
  }

  if (customFallbackComponent) {
    return (
      <ErrorBoundary onError={logErrorToConsole} FallbackComponent={customFallbackComponent}>
        {children}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary onError={logErrorToConsole} fallback={<ErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
}

export function withErrorBoundary<P>(
  service: string,
  Component: React.ComponentType<React.PropsWithChildren<P>>,
  errorMessage?: React.ReactNode,
  customFallbackComponent?: React.ComponentType<React.PropsWithChildren<FallbackProps>>,
): React.ComponentType<React.PropsWithChildren<P>> {
  return function CustomErrorBoundaryWrapper(props: P) {
    return (
      <CustomErrorBoundary customFallbackComponent={customFallbackComponent}>
        {/* @ts-expect-error Generics don't play well with WithConditionalCSSProp type coming @emotion/react jsx typing to validate css= prop values typing. More details here: emotion-js/emotion#2169 */}
        <Component {...props} />
      </CustomErrorBoundary>
    );
  };
}
```

--------------------------------------------------------------------------------

---[FILE: withRouterNext.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/utils/withRouterNext.tsx
Signals: React

```typescript
import React from 'react';

import {
  type Location,
  type Params as RouterDOMParams,
  type NavigateOptions,
  type To,
  useLocation,
  useNavigate,
  useParams,
} from './RoutingUtils';
import { useSearchParams } from './RoutingUtils';

export interface WithRouterNextProps<Params extends RouterDOMParams = RouterDOMParams> {
  navigate: ReturnType<typeof useNavigate>;
  location: Location;
  params: Params;
}

/**
 * This HoC serves as a retrofit for class components enabling them to use
 * react-router v6's location, navigate and params being injected via props.
 */
export const withRouterNext =
  <
    T,
    Props extends JSX.IntrinsicAttributes &
      JSX.LibraryManagedAttributes<React.ComponentType<React.PropsWithChildren<T>>, React.PropsWithChildren<T>>,
    Params extends RouterDOMParams = RouterDOMParams,
  >(
    Component: React.ComponentType<React.PropsWithChildren<T>>,
  ) =>
  (
    props: Omit<
      Props,
      | 'location'
      | 'navigate'
      | 'params'
      | 'navigationType'
      /* prettier-ignore*/
    >,
  ) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams<Params>();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
      <Component
        /* prettier-ignore */
        params={params as Params}
        location={location}
        navigate={navigate}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        {...(props as Props)}
      />
    );
  };
```

--------------------------------------------------------------------------------

---[FILE: actions.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/actions.test.ts
Signals: Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, beforeEach, afterEach, describe, it, expect } from '@jest/globals';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import {
  fetchMissingParents,
  fetchMissingParentsWithSearchRuns,
  getEvaluationTableArtifact,
  getParentRunIdsToFetch,
  getParentRunTagName,
  searchRunsPayload,
} from './actions';
import { fetchEvaluationTableArtifact } from './sdk/EvaluationArtifactService';
import { ViewType } from './sdk/MlflowEnums';
import { MlflowService } from './sdk/MlflowService';
import { RunLoggedArtifactType } from './types';
import { getUUID } from '@mlflow/mlflow/src/common/utils/ActionUtils';

jest.mock('./sdk/EvaluationArtifactService', () => ({
  fetchEvaluationTableArtifact: jest.fn(),
}));

const a = {
  info: { run_id: 'a' },
  data: {
    tags: [
      {
        key: getParentRunTagName(),
        value: 'aParent',
      },
    ],
  },
};
const b = {
  info: { run_id: 'b' },
  data: {
    tags: [
      {
        key: getParentRunTagName(),
        value: 'bParent',
      },
    ],
  },
};
const aParent = { info: { run_id: 'aParent' } };
const bParent = { info: { run_id: 'bParent' } };

// When fetching missing parent runs, the filter string is expected to be in the form:
// "run_id = 'parent_run_id'"
const FETCH_PARENT_FILTER_PREFIX = 'run_id = ';

// Extract parent run_id from the filter string
const getParentRunIdFromFilter = (filter: string) => filter.split(FETCH_PARENT_FILTER_PREFIX)[1].replace(/'/g, '');

beforeEach(() => {
  // searchRuns is used distinctly for fetching initial runs and fetching missing parent runs
  // Filtering by a single run_id indicates fetching a missing parent run
  jest.spyOn(MlflowService, 'searchRuns').mockImplementation(({ filter }) => {
    if (filter?.includes(FETCH_PARENT_FILTER_PREFIX)) {
      return Promise.resolve({ runs: [{ info: { run_id: getParentRunIdFromFilter(filter) } }] } as any);
    } else {
      return Promise.resolve({ runs: [a, b, aParent] } as any);
    }
  });

  jest
    .spyOn(MlflowService, 'getRun')
    .mockImplementation((data) => Promise.resolve({ run: { info: { run_id: data.run_id } } } as any));

  jest.spyOn(MlflowService, 'createRun').mockImplementation((data) =>
    Promise.resolve({
      run: { info: { run_id: getUUID(), experiment_id: data.experiment_id } as any },
    }),
  );
});

afterEach(() => {
  (MlflowService.searchRuns as any).mockRestore();
  (MlflowService.getRun as any).mockRestore();
  (MlflowService.createRun as any).mockRestore();
});

describe('fetchMissingParents', () => {
  it('should not explode if no runs', () => {
    const res = { nextPageToken: 'something' };
    expect(fetchMissingParents(res)).toBe(res);
  });

  it('should return res if runs empty', () => {
    const res = {
      runs: [],
      nextPageToken: 'something',
    };
    expect(fetchMissingParents(res)).toEqual(res);
  });

  it('should merge received parent runs', () => {
    const res = { runs: [a, b] };
    return fetchMissingParents(res).then((runs: any) => {
      expect(runs).toEqual({ runs: [a, b, aParent, bParent] });
    });
  });

  it('should return given runs even if no parent runs', () => {
    const res = { runs: [a, b, aParent, bParent] };
    return fetchMissingParents(res).then((runs: any) => {
      expect(runs).toEqual({ runs: [a, b, aParent, bParent] });
    });
  });

  it('should handle deleted parent runs', () => {
    const mockParentRunDeletedError = {
      getErrorCode() {
        return 'RESOURCE_DOES_NOT_EXIST';
      },
    };

    jest.spyOn(MlflowService, 'getRun').mockImplementation((data) => {
      if (data.run_id === 'aParent') {
        return Promise.resolve({ run: { info: { run_id: data.run_id } } }) as any;
      } else {
        return Promise.reject(mockParentRunDeletedError);
      }
    });

    const res = { runs: [a, b] };
    return fetchMissingParents(res).then((runs: any) => {
      expect(runs).toEqual({ runs: [a, b, aParent] });
    });
  });
  it('should throw for unexpected exceptions encountered during run resolution', async () => {
    const mockUnexpectedGetRunError = {
      getErrorCode() {
        return 'INTERNAL_ERROR';
      },
    };

    jest.spyOn(MlflowService, 'getRun').mockImplementation(() => Promise.reject(mockUnexpectedGetRunError));

    const res = { runs: [a, b] };
    await expect(fetchMissingParents(res)).rejects.toEqual(mockUnexpectedGetRunError);
  });
});

describe('fetchMissingParentsWithSearchRuns', () => {
  it('should not explode if no runs', () => {
    const res = { nextPageToken: 'something' };
    expect(fetchMissingParentsWithSearchRuns(res, 'mock_id')).toBe(res);
  });

  it('should return res if runs empty', () => {
    const res = {
      runs: [],
      nextPageToken: 'something',
    };
    expect(fetchMissingParentsWithSearchRuns(res, 'mock_id')).toEqual(res);
  });

  it('should merge received parent runs', () => {
    const res = { runs: [a, b] };
    return fetchMissingParentsWithSearchRuns(res, 'mock_id').then((runs: any) => {
      expect(runs).toEqual({ runs: [a, b, aParent, bParent] });
    });
  });

  it('should return given runs even if no parent runs', () => {
    const res = { runs: [a, b, aParent, bParent] };
    return fetchMissingParentsWithSearchRuns(res, 'mock_id').then((runs: any) => {
      expect(runs).toEqual({ runs: [a, b, aParent, bParent] });
    });
  });

  it('should handle deleted parent runs', () => {
    const mockParentRunDeletedError = {
      getErrorCode() {
        return 'RESOURCE_DOES_NOT_EXIST';
      },
    };

    jest.spyOn(MlflowService, 'searchRuns').mockImplementation(({ filter }) => {
      if (filter?.includes(FETCH_PARENT_FILTER_PREFIX)) {
        // Mock bParent as deleted
        if (getParentRunIdFromFilter(filter) === 'bParent') {
          return Promise.reject(mockParentRunDeletedError);
        } else {
          return Promise.resolve({ runs: [{ info: { run_id: getParentRunIdFromFilter(filter) } }] } as any);
        }
      } else {
        return Promise.resolve({ runs: [a, b, aParent] } as any);
      }
    });

    const res = { runs: [a, b] };
    return fetchMissingParentsWithSearchRuns(res, 'mock_id').then((runs: any) => {
      expect(runs).toEqual({ runs: [a, b, aParent] });
    });
  });
  it('should throw for unexpected exceptions encountered during run resolution', async () => {
    const mockUnexpectedGetRunError = {
      getErrorCode() {
        return 'INTERNAL_ERROR';
      },
    };

    jest.spyOn(MlflowService, 'searchRuns').mockImplementation(() => Promise.reject(mockUnexpectedGetRunError));

    const res = { runs: [a, b] };
    await expect(fetchMissingParentsWithSearchRuns(res, 'mock_id')).rejects.toEqual(mockUnexpectedGetRunError);
  });
});

describe('createRun', () => {
  it('should create a run under the correct experiment', async () => {
    expect(await MlflowService.createRun({ experiment_id: '1' })).toEqual(
      expect.objectContaining({
        run: expect.objectContaining({
          info: expect.objectContaining({
            experiment_id: '1',
            run_id: expect.any(String),
          }),
        }),
      }),
    );
  });
});

describe('getParentRunIdsToFetch', () => {
  it('should return empty array if no runs', () => {
    expect(getParentRunIdsToFetch([])).toEqual([]);
  });

  it('should return an array of absent parents ids given an array of runs', () => {
    expect(getParentRunIdsToFetch([a, b, bParent])).toEqual(['aParent']);
    expect(getParentRunIdsToFetch([a, b])).toEqual(['aParent', 'bParent']);
    expect(getParentRunIdsToFetch([a, b, aParent, bParent])).toEqual([]);
    expect(getParentRunIdsToFetch([a, bParent])).toEqual(['aParent']);
  });
});

const searchRunsPayloadTests = () => {
  it('should fetch parents only if shouldFetchParents is true', async () => {
    await searchRunsPayload({}).then((res) => {
      expect(res).toEqual(expect.objectContaining({ runs: [a, b, aParent] }));
    });
    await searchRunsPayload({ shouldFetchParents: false }).then((res) => {
      expect(res).toEqual(expect.objectContaining({ runs: [a, b, aParent] }));
    });
    await searchRunsPayload({ shouldFetchParents: true }).then((res) => {
      expect(res).toEqual(expect.objectContaining({ runs: [a, b, aParent, bParent] }));
    });
  });
  it('should make only a single call when no pinned rows are requested', async () => {
    await searchRunsPayload({ shouldFetchParents: false });
    expect(MlflowService.searchRuns).toHaveBeenCalledTimes(1);
    (MlflowService.searchRuns as any).mockClear();
    await searchRunsPayload({ shouldFetchParents: false, runsPinned: [] });
    expect(MlflowService.searchRuns).toHaveBeenCalledTimes(1);
  });
  it('should make an additional call for pinned rows', async () => {
    await searchRunsPayload({
      shouldFetchParents: false,
      runsPinned: ['r1', 'r2'],
      filter: 'metric.m1 > 2',
      runViewType: ViewType.ACTIVE_ONLY,
    });
    // We expect creating two requests
    expect(MlflowService.searchRuns).toHaveBeenCalledTimes(2);
    // One regular call for the runs including filters...
    expect(MlflowService.searchRuns).toHaveBeenCalledWith(
      expect.objectContaining({ filter: 'metric.m1 > 2', run_view_type: ViewType.ACTIVE_ONLY }),
    );
    // ...and the second dedicated to the pinned runs
    expect(MlflowService.searchRuns).toHaveBeenCalledWith(
      expect.objectContaining({ filter: "run_id IN ('r1','r2')", run_view_type: ViewType.ALL }),
    );
  });
  it('should properly fetch for pinned runs and calculate runs matching filter', async () => {
    // Create mocked version of searchRuns() that will return
    // a specialized set of runs when asked for pinned runs
    jest.spyOn(MlflowService, 'searchRuns').mockImplementation(({ filter }) => {
      if (filter?.includes('run_id IN')) {
        return Promise.resolve({ runs: [b] }) as any;
      }
      return Promise.resolve({ runs: [a] }) as any;
    });
    const result = await searchRunsPayload({
      runsPinned: [b.info.run_id],
    });
    expect(result).toEqual(
      expect.objectContaining({
        // We expect both runs to be in the resulting set
        runs: [a, b],
        // But only "a" run did match the filter
        runsMatchingFilter: [a],
      }),
    );
  });
  it('should properly handle result with pinned runs only', async () => {
    // Create mocked version of searchRuns() that will return
    // only pinned row
    jest.spyOn(MlflowService, 'searchRuns').mockImplementation(({ filter }) => {
      if (filter?.includes('run_id IN')) {
        return Promise.resolve({ runs: [b] });
      }
      return Promise.resolve({});
    });
    const result = await searchRunsPayload({
      runsPinned: [b.info.run_id],
    });
    expect(result).toEqual(
      expect.objectContaining({
        // We expect only pinned row to be in the result
        runs: [b],
        // And no rows matching filter
        runsMatchingFilter: [],
      }),
    );
  });
  it('should mark additionally fetched parent runs as correctly filtered ones', async () => {
    const result = await searchRunsPayload({ shouldFetchParents: true });
    expect(result.runsMatchingFilter).toEqual(expect.arrayContaining([bParent]));
  });
  it('throws proper error when received an invalid response', async () => {
    jest
      .spyOn(MlflowService, 'searchRuns')
      .mockImplementation(() => Promise.resolve('this is a non-object response') as any);
    await expect(async () => searchRunsPayload({ shouldFetchParents: true })).rejects.toThrow(
      /Invalid format of the runs search response/,
    );
  });
};

describe('searchRunsPayload', () => {
  searchRunsPayloadTests();
});

describe('getEvaluationArtifact', () => {
  const emptyStore = {
    evaluationData: { evaluationArtifactsByRunUuid: {}, evaluationArtifactsLoadingByRunUuid: {} },
  };
  const mockStoreFactory = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    jest.mocked(fetchEvaluationTableArtifact).mockClear();
  });

  it('should invoke downloading single artifact', () => {
    const mockStore = mockStoreFactory(emptyStore);
    mockStore.dispatch(getEvaluationTableArtifact('run_1', '/path/to/artifact'));
    expect(fetchEvaluationTableArtifact).toHaveBeenCalledWith('run_1', '/path/to/artifact');
  });

  it('should invoke downloading missing artifacts', () => {
    const mockStore = mockStoreFactory({
      evaluationData: {
        evaluationArtifactsByRunUuid: { run_1: { '/path/to/artifact': {} } },
        evaluationArtifactsLoadingByRunUuid: {},
      },
    });
    mockStore.dispatch(getEvaluationTableArtifact('run_1', '/path/to/artifact'));
    mockStore.dispatch(getEvaluationTableArtifact('run_1', '/path/to/other/artifact'));
    expect(fetchEvaluationTableArtifact).toHaveBeenCalledTimes(1);
    expect(fetchEvaluationTableArtifact).toHaveBeenCalledWith('run_1', '/path/to/other/artifact');
  });

  it('should invoke downloading all artifacts if force refreshing', () => {
    const mockStore = mockStoreFactory({
      evaluationData: {
        evaluationArtifactsByRunUuid: {
          run_1: { '/path/to/artifact': {} },
        },
        evaluationArtifactsLoadingByRunUuid: {},
      },
    });
    mockStore.dispatch(getEvaluationTableArtifact('run_1', '/path/to/artifact', true));
    mockStore.dispatch(getEvaluationTableArtifact('run_1', '/path/to/other/artifact', true));
    expect(fetchEvaluationTableArtifact).toHaveBeenCalledTimes(2);
    expect(fetchEvaluationTableArtifact).toHaveBeenCalledWith('run_1', '/path/to/artifact');
    expect(fetchEvaluationTableArtifact).toHaveBeenCalledWith('run_1', '/path/to/other/artifact');
  });
});
```

--------------------------------------------------------------------------------

````

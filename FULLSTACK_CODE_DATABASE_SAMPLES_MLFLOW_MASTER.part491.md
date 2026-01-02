---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 491
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 491 of 991)

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

---[FILE: useExperimentListQuery.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentListQuery.test.tsx

```typescript
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@databricks/web-shared/query-client';
import { useExperimentListQuery } from './useExperimentListQuery';
import { MlflowService } from '../../../sdk/MlflowService';
import type { SearchExperimentsApiResponse } from '../../../types';
import type { TagFilter } from './useTagsFilter';

// Mock MlflowService
jest.mock('../../../sdk/MlflowService', () => ({
  MlflowService: {
    searchExperiments: jest.fn(),
  },
}));

// Mock localStorage for useLocalStorage hook
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockSearchExperiments = jest.mocked(MlflowService.searchExperiments);

describe('useExperimentListQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset mock
    mockSearchExperiments.mockReset();
  });

  const createWrapper = () => {
    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  const createMockResponse = (experimentIds: string[], nextPageToken?: string): SearchExperimentsApiResponse => ({
    experiments: experimentIds.map((id) => ({
      experimentId: id,
      name: `Experiment ${id}`,
      artifactLocation: `/artifacts/${id}`,
      lifecycleStage: 'active',
      lastUpdateTime: Date.now(),
      creationTime: Date.now(),
      tags: [],
      allowedActions: [],
    })),
    next_page_token: nextPageToken,
  });

  describe('pagination reset on filter changes', () => {
    it('resets pagination when searchFilter changes', async () => {
      // Mock responses for all possible query variations
      mockSearchExperiments.mockImplementation(async (params) => {
        // Extract the filter to determine which response to return
        const filterParam = params.find((p: any) => p?.[0] === 'filter')?.[1];
        const pageToken = params.find((p: any) => p?.[0] === 'page_token')?.[1];

        if (filterParam?.includes('test')) {
          // After filter change - return different data
          return createMockResponse(['7'], undefined);
        } else if (pageToken === 'page_2_token') {
          // Second page
          return createMockResponse(['4', '5', '6'], 'page_3_token');
        } else {
          // First page
          return createMockResponse(['1', '2', '3'], 'page_2_token');
        }
      });

      // Initial render without search filter
      const { result, rerender } = renderHook(
        ({ searchFilter }: { searchFilter?: string }) => useExperimentListQuery({ searchFilter }),
        {
          wrapper: createWrapper(),
          initialProps: { searchFilter: undefined as string | undefined },
        },
      );

      // Wait for initial query to complete
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Verify we have the first page of experiments
      expect(result.current.data).toHaveLength(3);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);

      // Navigate to next page
      act(() => {
        result.current.onNextPage();
      });

      // Wait for next page to load
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('4');
      });
      expect(result.current.hasPreviousPage).toBe(true);

      // Now change the search filter - this should reset pagination
      rerender({ searchFilter: 'test' });

      // Wait for the query to complete with new filter
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('7');
      });

      // Verify pagination was reset
      expect(result.current.data).toHaveLength(1);
      expect(result.current.hasPreviousPage).toBe(false); // Should be back to first page
      expect(result.current.hasNextPage).toBe(false);
    });

    it('resets pagination when tagsFilter changes', async () => {
      // Mock responses based on tags filter
      mockSearchExperiments.mockImplementation(async (params) => {
        const filterParam = params.find((p: any) => p?.[0] === 'filter')?.[1];
        const pageToken = params.find((p: any) => p?.[0] === 'page_token')?.[1];

        if (filterParam?.includes('tags')) {
          // After tags filter change
          return createMockResponse(['7'], undefined);
        } else if (pageToken === 'page_2_token') {
          // Second page
          return createMockResponse(['4', '5', '6'], 'page_3_token');
        } else {
          // First page
          return createMockResponse(['1', '2', '3'], 'page_2_token');
        }
      });

      const initialTagsFilter: TagFilter[] | undefined = [];
      const updatedTagsFilter: TagFilter[] = [{ key: 'env', operator: 'IS', value: 'prod' }];

      // Initial render without tags filter
      const { result, rerender } = renderHook(
        ({ tagsFilter }: { tagsFilter?: TagFilter[] }) => useExperimentListQuery({ tagsFilter }),
        {
          wrapper: createWrapper(),
          initialProps: { tagsFilter: initialTagsFilter as TagFilter[] | undefined },
        },
      );

      // Wait for initial query to complete
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Navigate to next page
      act(() => {
        result.current.onNextPage();
      });

      // Wait for next page to load
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('4');
      });

      // Now change the tags filter - this should reset pagination
      rerender({ tagsFilter: updatedTagsFilter });

      // Wait for the query to complete with new filter
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('7');
      });

      // Verify pagination was reset
      expect(result.current.hasPreviousPage).toBe(false); // Should be back to first page
    });

    it('resets pagination when sorting changes', async () => {
      // Mock responses based on sorting order
      mockSearchExperiments.mockImplementation(async (params) => {
        const orderBy = params.find((p: any) => p?.[0] === 'order_by')?.[1];
        const pageToken = params.find((p: any) => p?.[0] === 'page_token')?.[1];

        if (orderBy?.includes('name ASC')) {
          // After sorting change
          return createMockResponse(['10', '11', '12'], undefined);
        } else if (pageToken === 'page_2_token') {
          // Second page
          return createMockResponse(['4', '5', '6'], 'page_3_token');
        } else {
          // First page
          return createMockResponse(['1', '2', '3'], 'page_2_token');
        }
      });

      // Initial render
      const { result } = renderHook(() => useExperimentListQuery(), {
        wrapper: createWrapper(),
      });

      // Wait for initial query to complete
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Navigate to next page
      act(() => {
        result.current.onNextPage();
      });

      // Wait for next page to load
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('4');
      });

      // Now change the sorting - this should reset pagination
      act(() => {
        result.current.setSorting([{ id: 'name', desc: false }]);
      });

      // Wait for the query to complete with new sorting
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('10');
      });

      // Verify pagination was reset
      expect(result.current.hasPreviousPage).toBe(false); // Should be back to first page
    });
  });

  describe('pagination controls', () => {
    it('allows forward and backward pagination', async () => {
      mockSearchExperiments
        .mockResolvedValueOnce(createMockResponse(['1', '2', '3'], 'page_2_token'))
        .mockResolvedValueOnce(createMockResponse(['4', '5', '6'], 'page_3_token'))
        .mockResolvedValueOnce(createMockResponse(['1', '2', '3'], 'page_2_token'));

      const { result } = renderHook(() => useExperimentListQuery(), {
        wrapper: createWrapper(),
      });

      // Wait for initial query
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // First page
      expect(result.current.data?.[0].experimentId).toBe('1');
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);

      // Go to next page
      act(() => {
        result.current.onNextPage();
      });

      await waitFor(() => expect(result.current.data?.[0].experimentId).toBe('4'));
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(true);

      // Go back to previous page
      act(() => {
        result.current.onPreviousPage();
      });

      await waitFor(() => expect(result.current.data?.[0].experimentId).toBe('1'));
      expect(result.current.hasPreviousPage).toBe(false);
    });

    it('resets pagination when page size changes', async () => {
      mockSearchExperiments
        .mockResolvedValueOnce(createMockResponse(['1', '2', '3'], 'page_2_token'))
        .mockResolvedValueOnce(createMockResponse(['4', '5', '6'], undefined))
        .mockResolvedValueOnce(createMockResponse(['1', '2', '3', '4', '5'], undefined));

      const { result } = renderHook(() => useExperimentListQuery(), {
        wrapper: createWrapper(),
      });

      // Wait for initial query
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Go to next page
      act(() => {
        result.current.onNextPage();
      });

      await waitFor(() => expect(result.current.data?.[0].experimentId).toBe('4'));
      expect(result.current.hasPreviousPage).toBe(true);

      // Change page size - should reset pagination
      act(() => {
        result.current.pageSizeSelect.onChange(50);
      });

      await waitFor(() => expect(result.current.data).toHaveLength(5));
      expect(result.current.hasPreviousPage).toBe(false); // Should be back to first page
    });
  });

  describe('API query construction', () => {
    it('includes search filter in API call', async () => {
      mockSearchExperiments.mockResolvedValueOnce(createMockResponse(['1'], undefined));

      renderHook(() => useExperimentListQuery({ searchFilter: 'my-experiment' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(mockSearchExperiments).toHaveBeenCalled());

      const apiCallData = mockSearchExperiments.mock.calls[0][0];
      const filterParam = apiCallData.find((param: [string, string]) => param?.[0] === 'filter');

      expect(filterParam).toBeDefined();
      expect(filterParam?.[1]).toContain("name ILIKE '%my-experiment%'");
    });

    it('includes tag filters in API call', async () => {
      mockSearchExperiments.mockResolvedValueOnce(createMockResponse(['1'], undefined));

      const tagsFilter: TagFilter[] = [
        { key: 'env', operator: 'IS', value: 'prod' },
        { key: 'team', operator: 'CONTAINS', value: 'ml' },
      ];

      renderHook(() => useExperimentListQuery({ tagsFilter }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(mockSearchExperiments).toHaveBeenCalled());

      const apiCallData = mockSearchExperiments.mock.calls[0][0];
      const filterParam = apiCallData.find((param: [string, string]) => param?.[0] === 'filter');

      expect(filterParam).toBeDefined();
      expect(filterParam?.[1]).toContain("tags.`env` = 'prod'");
      expect(filterParam?.[1]).toContain("tags.`team` ILIKE '%ml%'");
    });

    it('includes page token in API call when paginating', async () => {
      mockSearchExperiments
        .mockResolvedValueOnce(createMockResponse(['1', '2', '3'], 'page_2_token'))
        .mockResolvedValueOnce(createMockResponse(['4', '5', '6'], undefined));

      const { result } = renderHook(() => useExperimentListQuery(), {
        wrapper: createWrapper(),
      });

      // Wait for initial query to complete
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // First call should not have page token
      let apiCallData = mockSearchExperiments.mock.calls[0][0];
      let pageTokenParam = apiCallData.find((param: [string, string]) => param?.[0] === 'page_token');
      expect(pageTokenParam).toBeUndefined();

      // Go to next page
      act(() => {
        result.current.onNextPage();
      });

      // Wait for second query to complete
      await waitFor(() => {
        expect(result.current.data?.[0].experimentId).toBe('4');
      });

      // Second call should have page token
      expect(mockSearchExperiments).toHaveBeenCalledTimes(2);
      apiCallData = mockSearchExperiments.mock.calls[1][0];
      pageTokenParam = apiCallData.find((param: [string, string]) => param?.[0] === 'page_token');
      expect(pageTokenParam).toBeDefined();
      expect(pageTokenParam?.[1]).toBe('page_2_token');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentListQuery.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentListQuery.ts
Signals: React

```typescript
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery, useQueryClient } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { MlflowService } from '../../../sdk/MlflowService';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchExperimentsApiResponse } from '../../../types';
import { useLocalStorage } from '@mlflow/mlflow/src/shared/web-shared/hooks/useLocalStorage';
import type { CursorPaginationProps } from '@databricks/design-system';
import type { SortingState } from '@tanstack/react-table';
import type { TagFilter } from './useTagsFilter';

const STORE_KEY = {
  PAGE_SIZE: 'experiments_page.page_size',
  SORTING_STATE: 'experiments_page.sorting_state',
};
const DEFAULT_PAGE_SIZE = 25;

const ExperimentListQueryKeyHeader = 'experiment_list';

type ExperimentListQueryKey = [
  typeof ExperimentListQueryKeyHeader,
  { searchFilter?: string; tagsFilter?: TagFilter[]; pageToken?: string; pageSize?: number; sorting?: SortingState },
];

export const useInvalidateExperimentList = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [ExperimentListQueryKeyHeader] });
  };
};

function tagFilterToSql(tagFilter: TagFilter) {
  switch (tagFilter.operator) {
    case 'IS':
      return `tags.\`${tagFilter.key}\` = '${tagFilter.value}'`;
    case 'IS NOT':
      return `tags.\`${tagFilter.key}\` != '${tagFilter.value}'`;
    case 'CONTAINS':
      return `tags.\`${tagFilter.key}\` ILIKE '%${tagFilter.value}%'`;
  }
}

function getFilters({ searchFilter, tagsFilter }: Pick<ExperimentListQueryKey['1'], 'searchFilter' | 'tagsFilter'>) {
  const filters = [];

  if (searchFilter) {
    filters.push(`name ILIKE '%${searchFilter}%'`);
  }

  for (const tagFilter of tagsFilter ?? []) {
    filters.push(tagFilterToSql(tagFilter));
  }

  if (filters.length > 0) {
    return ['filter', filters.join(' AND ')];
  } else {
    return undefined;
  }
}

const queryFn = ({ queryKey }: QueryFunctionContext<ExperimentListQueryKey>) => {
  const [, { searchFilter, tagsFilter, pageToken, pageSize, sorting }] = queryKey;

  // NOTE: REST API docs are not detailed enough, see: mlflow/store/tracking/abstract_store.py#search_experiments
  const orderBy = sorting?.map((column) => ['order_by', `${column.id} ${column.desc ? 'DESC' : 'ASC'}`]) ?? [];

  const data: (string[] | undefined)[] = [['max_results', String(pageSize)], ...orderBy];

  // NOTE: undefined values are fine, they're filtered out by `getBigIntJson` inside `MlflowService`
  data.push(getFilters({ searchFilter, tagsFilter }));

  if (pageToken) {
    data.push(['page_token', pageToken]);
  }

  return MlflowService.searchExperiments(data);
};

export const useExperimentListQuery = ({
  searchFilter,
  tagsFilter,
}: { searchFilter?: string; tagsFilter?: TagFilter[] } = {}) => {
  const previousPageTokens = useRef<(string | undefined)[]>([]);

  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>(undefined);

  const [pageSize, setPageSize] = useLocalStorage({
    key: STORE_KEY.PAGE_SIZE,
    version: 0,
    initialValue: DEFAULT_PAGE_SIZE,
  });

  const [sorting, setSorting] = useLocalStorage<SortingState>({
    key: STORE_KEY.SORTING_STATE,
    version: 0,
    initialValue: [{ id: 'last_update_time', desc: true }],
  });

  // Reset pagination when filters or sorting changes
  useEffect(() => {
    setCurrentPageToken(undefined);
    previousPageTokens.current = [];
  }, [searchFilter, tagsFilter, sorting]);

  const pageSizeSelect: CursorPaginationProps['pageSizeSelect'] = {
    options: [10, 25, 50, 100],
    default: pageSize,
    onChange(pageSize) {
      setPageSize(pageSize);
      setCurrentPageToken(undefined);
    },
  };

  const queryResult = useQuery<
    SearchExperimentsApiResponse,
    Error,
    SearchExperimentsApiResponse,
    ExperimentListQueryKey
  >([ExperimentListQueryKeyHeader, { searchFilter, tagsFilter, pageToken: currentPageToken, pageSize, sorting }], {
    queryFn,
    retry: false,
  });

  const onNextPage = useCallback(() => {
    previousPageTokens.current.push(currentPageToken);
    setCurrentPageToken(queryResult.data?.next_page_token);
  }, [queryResult.data?.next_page_token, currentPageToken]);

  const onPreviousPage = useCallback(() => {
    const previousPageToken = previousPageTokens.current.pop();
    setCurrentPageToken(previousPageToken);
  }, []);

  return {
    data: queryResult.data?.experiments,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    hasNextPage: queryResult.data?.next_page_token !== undefined,
    hasPreviousPage: Boolean(currentPageToken),
    onNextPage,
    onPreviousPage,
    refetch: queryResult.refetch,
    pageSizeSelect,
    sorting,
    setSorting,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentPageSearchFacets.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageSearchFacets.test.tsx
Signals: React

```typescript
import { describe, test, expect, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { useExperimentPageSearchFacets, useUpdateExperimentPageSearchFacets } from './useExperimentPageSearchFacets';
import { MemoryRouter, Routes, Route, useLocation, useSearchParams } from '../../../../common/utils/RoutingUtils';
import { testRoute, TestRouter } from '../../../../common/utils/RoutingTestUtils';
import { useEffect } from 'react';
import { screen, renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';
import { createExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';

describe('useExperimentPageSearchFacets', () => {
  const mountHook = async (initialPath = '/') => {
    const hookResult = renderHook(() => useExperimentPageSearchFacets(), {
      wrapper: ({ children }) => (
        <TestRouter
          initialEntries={[initialPath]}
          routes={[
            testRoute(<div>{children}</div>, '/experiments/:experimentId'),
            testRoute(<div>{children}</div>, '/compare-experiments'),
          ]}
        />
      ),
    });

    return hookResult;
  };
  test('return null for uninitialized state', async () => {
    const { result } = await mountHook('/experiments/123');
    expect(result.current).toEqual([null, ['123'], false]);
  });

  test('return correct data for initialized state', async () => {
    const { result } = await mountHook(
      '/experiments/123?orderByKey=foo&orderByAsc=true&searchFilter=test%20string&datasetsFilter=W10=&lifecycleFilter=ACTIVE&modelVersionFilter=All Runs&startTime=ALL',
    );
    expect(result.current).toEqual([
      {
        orderByAsc: true,
        orderByKey: 'foo',
        searchFilter: 'test string',
        datasetsFilter: [],
        lifecycleFilter: 'ACTIVE',
        modelVersionFilter: 'All Runs',
        startTime: 'ALL',
      },
      ['123'],
      false,
    ]);
  });

  test('return correct data for multiple compared experiments', async () => {
    const { result } = await mountHook('/compare-experiments?experiments=%5B%22444%22%2C%22555%22%5D&orderByKey=foo');
    expect(result.current).toEqual([
      expect.objectContaining({
        orderByKey: 'foo',
      }),
      ['444', '555'],
      false,
    ]);
  });

  test('return empty list when facing invalid compare experiment IDs', async () => {
    const { result } = await mountHook('/compare-experiments?experiments=__invalid_array__&orderByKey=foo');
    expect(result.current).toEqual([
      expect.objectContaining({
        orderByKey: 'foo',
      }),
      [
        /* empty */
      ],
      false,
    ]);
  });

  test('ignore unrelated parameters', async () => {
    const { result } = await mountHook('/experiments/123?orderByKey=foo&o=123456');
    expect(result.current).toEqual([
      expect.objectContaining({
        orderByKey: 'foo',
      }),
      ['123'],
      false,
    ]);
  });

  test('return the same reference when unrelated query params change', async () => {
    const changeFacetsSpy = jest.fn();
    const TestComponent = () => {
      const [, changeParams] = useSearchParams();
      const [searchFacets] = useExperimentPageSearchFacets();
      useEffect(() => {
        changeFacetsSpy();
      }, [searchFacets]);
      return (
        <div>
          <button
            onClick={() =>
              changeParams((params) => {
                params.set('orderByKey', 'foobar');
                return params;
              })
            }
          >
            Change order
          </button>
          <button
            onClick={() =>
              changeParams((params) => {
                params.set('somethingelse', 'xyz');
                return params;
              })
            }
          >
            Change other parameter
          </button>
        </div>
      );
    };
    renderWithIntl(
      <MemoryRouter initialEntries={['/experiments/123?orderByKey=abc']}>
        <Routes>
          <Route path="/experiments/:experimentId" element={<TestComponent />} />
        </Routes>
      </MemoryRouter>,
    );

    // Initial render
    expect(changeFacetsSpy).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByText('Change order'));

    // Should trigger re-render because of change in orderByKey
    expect(changeFacetsSpy).toHaveBeenCalledTimes(2);

    await userEvent.click(screen.getByText('Change other parameter'));

    // Should not trigger re-render because of change in unrelated search param
    expect(changeFacetsSpy).toHaveBeenCalledTimes(2);
  });

  test('fills gaps when only partial facets are provided', async () => {
    const { result } = await mountHook('/experiments/123?orderByKey=foo&o=123456');

    expect(result.current).toEqual([
      {
        ...createExperimentPageSearchFacetsState(),
        orderByKey: 'foo',
      },
      ['123'],
      false,
    ]);
  });

  test('reports if the view is in preview mode', async () => {
    const { result } = await mountHook('/experiments/123?o=123456&isPreview=true');

    expect(result.current).toEqual([null, ['123'], true]);
  });
});

describe('useUpdateExperimentPageSearchFacets', () => {
  const locationSpyFn = jest.fn();
  const LocationSpy = () => {
    const location = useLocation();
    useEffect(() => {
      locationSpyFn([location.pathname, location.search].join(''));
    }, [location]);
    return null;
  };

  const mountHook = async (initialPath = '/') => {
    const hookResult = renderHook(() => useUpdateExperimentPageSearchFacets(), {
      wrapper: ({ children }) => (
        <>
          <TestRouter
            initialEntries={[initialPath]}
            routes={[
              testRoute(
                <div>
                  <LocationSpy />
                  {children}
                </div>,
                '/experiments/:experimentId',
              ),
              testRoute(
                <div>
                  <LocationSpy />
                  {children}
                </div>,
                '/compare-experiments',
              ),
            ]}
          />
        </>
      ),
    });

    return hookResult;
  };

  test('correctly change search facets for single experiment', async () => {
    const { result } = await mountHook('/experiments/123');
    let updateFn = result.current;
    act(() => {
      updateFn({ orderByKey: 'some-column', orderByAsc: true });
    });
    expect(locationSpyFn).toHaveBeenLastCalledWith('/experiments/123?orderByKey=some-column&orderByAsc=true');

    updateFn = result.current;
    act(() => {
      updateFn({
        datasetsFilter: [{ context: 'ctx', digest: 'digest', experiment_id: '123', name: 'name' }],
      });
    });
    expect(locationSpyFn).toHaveBeenLastCalledWith(
      '/experiments/123?orderByKey=some-column&orderByAsc=true&datasetsFilter=W3sibmFtZSI6Im5hbWUiLCJkaWdlc3QiOiJkaWdlc3QiLCJjb250ZXh0IjoiY3R4In1d',
    );
  });

  test('correctly change search facets for compare experiments', async () => {
    const { result } = await mountHook('/compare-experiments?experiments=%5B%22444%22%2C%22555%22%5D');

    expect(locationSpyFn).toHaveBeenLastCalledWith('/compare-experiments?experiments=%5B%22444%22%2C%22555%22%5D');

    const updateFn = result.current;
    act(() => {
      updateFn({ orderByKey: 'some-column' });
    });

    expect(locationSpyFn).toHaveBeenLastCalledWith(
      '/compare-experiments?experiments=%5B%22444%22%2C%22555%22%5D&orderByKey=some-column',
    );
  });

  test('correctly retain unrelated parameters', async () => {
    const { result } = await mountHook('/experiments/123?o=12345');
    const updateFn = result.current;
    act(() => {
      updateFn({ orderByKey: 'some-column' });
    });
    expect(locationSpyFn).toHaveBeenLastCalledWith('/experiments/123?o=12345&orderByKey=some-column');
  });

  test('correctly disable preview mode when params are explicitly changed', async () => {
    const { result } = await mountHook('/experiments/123?o=12345&&orderByKey=abc&isPreview=true');
    const updateFn = result.current;
    act(() => {
      updateFn({ orderByKey: 'some-column' });
    });
    expect(locationSpyFn).toHaveBeenLastCalledWith('/experiments/123?o=12345&orderByKey=some-column');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentPageSearchFacets.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageSearchFacets.tsx
Signals: React

```typescript
import { assign, entries, isNil, keys, omitBy, pick } from 'lodash';
import { useMemo } from 'react';
import type { NavigateOptions } from '../../../../common/utils/RoutingUtils';
import { useParams, useSearchParams } from '../../../../common/utils/RoutingUtils';
import type { ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import { createExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import {
  deserializeFieldsFromQueryString,
  serializeFieldsToQueryString,
} from '../utils/persistSearchFacets.serializers';

export const EXPERIMENT_PAGE_QUERY_PARAM_KEYS = [
  'searchFilter',
  'orderByKey',
  'orderByAsc',
  'startTime',
  'lifecycleFilter',
  'modelVersionFilter',
  'datasetsFilter',
];

export const EXPERIMENT_PAGE_QUERY_PARAM_IS_PREVIEW = 'isPreview';

export type ExperimentPageQueryParams = any;

export type ExperimentQueryParamsSearchFacets = ExperimentPageSearchFacetsState & {
  experimentIds?: string[];
};

const getComparedExperimentIds = (comparedExperimentIds: string): string[] => {
  try {
    return comparedExperimentIds ? JSON.parse(comparedExperimentIds) : [];
  } catch {
    return [];
  }
};

export const useExperimentPageSearchFacets = (): [ExperimentQueryParamsSearchFacets | null, string[], boolean] => {
  const [queryParams] = useSearchParams();

  // Pick only the keys we care about
  const pickedValues = useMemo(
    () => pick(Object.fromEntries(queryParams.entries()), EXPERIMENT_PAGE_QUERY_PARAM_KEYS),
    [queryParams],
  );

  // Check if the page is in preview mode. If so, it should not be persisted until explicitly changed
  const isPreview = queryParams.get(EXPERIMENT_PAGE_QUERY_PARAM_IS_PREVIEW) === 'true';

  // Destructure to get raw values
  const { searchFilter, orderByKey, orderByAsc, startTime, lifecycleFilter, modelVersionFilter, datasetsFilter } =
    pickedValues;

  const areValuesEmpty = keys(pickedValues).length < 1;

  const { experimentId } = useParams<{ experimentId: string }>();
  const queryParamsExperimentIds = queryParams.get('experiments');

  // Calculate experiment IDs
  const experimentIds = useMemo(() => {
    if (experimentId) {
      return [experimentId];
    }
    if (queryParamsExperimentIds) {
      return getComparedExperimentIds(queryParamsExperimentIds);
    }
    return [];
  }, [experimentId, queryParamsExperimentIds]);

  // Calculate and memoize search facets
  const searchFacets = useMemo(() => {
    if (areValuesEmpty) {
      return null;
    }
    const deserializedFields = deserializeFieldsFromQueryString(
      omitBy(
        {
          searchFilter,
          orderByKey,
          orderByAsc,
          startTime,
          lifecycleFilter,
          modelVersionFilter,
          datasetsFilter,
        },
        isNil,
      ),
    ) as ExperimentPageSearchFacetsState;

    // If not all fields are provided, fill the gaps with default values
    return assign(createExperimentPageSearchFacetsState(), deserializedFields);
  }, [
    // Use exact values to avoid unnecessary re-renders
    searchFilter,
    orderByKey,
    orderByAsc,
    startTime,
    lifecycleFilter,
    modelVersionFilter,
    datasetsFilter,
    areValuesEmpty,
  ]);

  return [searchFacets, experimentIds, isPreview];
};

export const useUpdateExperimentPageSearchFacets = () => {
  const [, setParams] = useSearchParams();

  return (partialFacets: Partial<ExperimentPageSearchFacetsState>, options?: NavigateOptions) => {
    const newParams = serializeFieldsToQueryString(partialFacets);
    setParams((currentParams) => {
      entries(newParams).forEach(([key, value]) => {
        currentParams.set(key, value);
      });
      currentParams.delete(EXPERIMENT_PAGE_QUERY_PARAM_IS_PREVIEW);
      return currentParams;
    }, options);
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useExperimentPageViewMode.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageViewMode.test.tsx
Signals: React

```typescript
import { describe, jest, test, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { getExperimentPageDefaultViewMode, useExperimentPageViewMode } from './useExperimentPageViewMode';
import { useLocation } from '../../../../common/utils/RoutingUtils';
import { TestRouter, testRoute } from '../../../../common/utils/RoutingTestUtils';
import { useEffect } from 'react';

describe('useExperimentPageViewMode', () => {
  const locationSpyFn = jest.fn();
  const LocationSpy = () => {
    const location = useLocation();
    useEffect(() => {
      locationSpyFn([location.pathname, location.search].join(''));
    }, [location]);
    return null;
  };

  const mountHook = async (initialPath = '/') => {
    const renderResult = renderHook(() => useExperimentPageViewMode(), {
      wrapper: ({ children }) => (
        <TestRouter
          initialEntries={[initialPath]}
          routes={[
            testRoute(
              <>
                <LocationSpy />
                <div>{children}</div>
              </>,
            ),
          ]}
        />
      ),
    });

    return renderResult;
  };
  test('start with uninitialized state and cycle through modes', async () => {
    const { result } = await mountHook();
    const [, setMode] = result.current;
    expect(result.current[0]).toEqual(getExperimentPageDefaultViewMode());

    act(() => {
      setMode('ARTIFACT');
    });
    expect(result.current[0]).toEqual('ARTIFACT');
    expect(locationSpyFn).toHaveBeenLastCalledWith('/?compareRunsMode=ARTIFACT');

    act(() => {
      setMode('CHART');
    });
    expect(result.current[0]).toEqual('CHART');
    expect(locationSpyFn).toHaveBeenLastCalledWith('/?compareRunsMode=CHART');

    act(() => {
      setMode('TABLE');
    });

    expect(result.current[0]).toEqual('TABLE');
    expect(locationSpyFn).toHaveBeenLastCalledWith('/?compareRunsMode=TABLE');
  });

  test('correctly return preinitialized state', async () => {
    const { result } = await mountHook('/something/?compareRunsMode=ARTIFACT');
    expect(result.current[0]).toEqual('ARTIFACT');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useExperimentPageViewMode.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useExperimentPageViewMode.tsx

```typescript
import { useNavigate, useSearchParams } from '../../../../common/utils/RoutingUtils';
import { ExperimentPageTabName } from '../../../constants';
import Routes from '../../../routes';
import { type ExperimentViewRunsCompareMode } from '../../../types';

export const EXPERIMENT_PAGE_VIEW_MODE_QUERY_PARAM_KEY = 'compareRunsMode';

export const getExperimentPageDefaultViewMode = (): ExperimentViewRunsCompareMode => 'TABLE';

// This map is being used to wire routes to certain view modes
const viewModeToRouteMap: Partial<Record<ExperimentViewRunsCompareMode, (experimentId: string) => void>> = {
  MODELS: (experimentId: string) => Routes.getExperimentPageTabRoute(experimentId, ExperimentPageTabName.Models),
};
/**
 * Hook using search params to retrieve and update the current experiment page runs view mode.
 * Handles legacy part of the mode switching, based on "compareRunsMode" query parameter.
 * Modern part of the mode switching is handled by <ExperimentViewRunsModeSwitchV2> which works using route params.
 */
export const useExperimentPageViewMode = (): [
  ExperimentViewRunsCompareMode,
  (newCompareRunsMode: ExperimentViewRunsCompareMode, experimentId?: string) => void,
] => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const mode =
    (params.get(EXPERIMENT_PAGE_VIEW_MODE_QUERY_PARAM_KEY) as ExperimentViewRunsCompareMode) ||
    getExperimentPageDefaultViewMode();
  const setMode = (newCompareRunsMode: ExperimentViewRunsCompareMode, experimentId?: string) => {
    // Check if the new mode should actually navigate to a different route instead of just changing the query param
    if (newCompareRunsMode in viewModeToRouteMap && experimentId) {
      const route = viewModeToRouteMap[newCompareRunsMode]?.(experimentId);
      if (route) {
        navigate(route);
        return;
      }
    }
    setParams(
      (currentParams) => {
        currentParams.set(EXPERIMENT_PAGE_VIEW_MODE_QUERY_PARAM_KEY, newCompareRunsMode || '');
        return currentParams;
      },
      { replace: false },
    );
  };

  return [mode, setMode];
};
```

--------------------------------------------------------------------------------

````

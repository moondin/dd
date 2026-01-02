---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 496
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 496 of 991)

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

---[FILE: useRunSortOptions.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useRunSortOptions.ts
Signals: React

```typescript
import { useMemo } from 'react';
import {
  ATTRIBUTE_COLUMN_SORT_KEY,
  ATTRIBUTE_COLUMN_SORT_LABEL,
  COLUMN_SORT_BY_ASC,
  COLUMN_SORT_BY_DESC,
  COLUMN_TYPES,
  SORT_DELIMITER_SYMBOL,
} from '../../../constants';
import { makeCanonicalSortKey } from '../utils/experimentPage.common-utils';

export type ExperimentRunSortOption = {
  label: string;
  order: string;
  value: string;
};

type SORT_KEY_TYPE = keyof (typeof ATTRIBUTE_COLUMN_SORT_KEY & typeof ATTRIBUTE_COLUMN_SORT_LABEL);

/**
 * This hook creates a set of run+sort options basing on currently selected
 * columns and the list of all metrics and keys.
 */
export const useRunSortOptions = (
  filteredMetricKeys: string[],
  filteredParamKeys: string[],
): ExperimentRunSortOption[] =>
  useMemo(() => {
    let sortOptions = [];
    const ColumnSortByOrder = [COLUMN_SORT_BY_ASC, COLUMN_SORT_BY_DESC];
    const attributesSortBy = Object.keys(ATTRIBUTE_COLUMN_SORT_LABEL).reduce<any[]>((options, sortLabelKey) => {
      const sortLabel = ATTRIBUTE_COLUMN_SORT_LABEL[sortLabelKey as SORT_KEY_TYPE];

      ColumnSortByOrder.forEach((order) => {
        options.push({
          label: sortLabel,
          value: ATTRIBUTE_COLUMN_SORT_KEY[sortLabelKey as SORT_KEY_TYPE] + SORT_DELIMITER_SYMBOL + order,
          order,
        });
      });

      return options;
    }, []);
    const metricsSortBy = filteredMetricKeys.reduce<any[]>((options, sortLabelKey) => {
      ColumnSortByOrder.forEach((order) => {
        options.push({
          label: sortLabelKey,
          value: `${makeCanonicalSortKey(COLUMN_TYPES.METRICS, sortLabelKey)}${SORT_DELIMITER_SYMBOL}${order}`,
          order,
        });
      });

      return options;
    }, []);
    const paramsSortBy = filteredParamKeys.reduce<any[]>((options, sortLabelKey) => {
      ColumnSortByOrder.forEach((order) => {
        options.push({
          label: sortLabelKey,
          value: `${makeCanonicalSortKey(COLUMN_TYPES.PARAMS, sortLabelKey)}${SORT_DELIMITER_SYMBOL}${order}`,
          order,
        });
      });

      return options;
    }, []);
    sortOptions = [...attributesSortBy, ...metricsSortBy, ...paramsSortBy];

    return sortOptions;
  }, [filteredMetricKeys, filteredParamKeys]);
```

--------------------------------------------------------------------------------

---[FILE: useSearchFilter.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useSearchFilter.tsx

```typescript
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

export function useSearchFilter() {
  const name = 'experimentSearchFilter';
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFilter = searchParams.get(name) ?? '';

  function setSearchFilter(searchFilter: string) {
    if (!searchFilter) {
      searchParams.delete(name);
    } else {
      searchParams.set(name, searchFilter);
    }
    setSearchParams(searchParams);
  }

  return [searchFilter, setSearchFilter] as const;
}
```

--------------------------------------------------------------------------------

---[FILE: useSharedExperimentViewState.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useSharedExperimentViewState.test.tsx

```typescript
import { jest, describe, beforeEach, it, expect, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useSearchParams, useNavigate } from '../../../../common/utils/RoutingUtils';

import { useUpdateExperimentPageSearchFacets } from './useExperimentPageSearchFacets';
import { useSharedExperimentViewState } from './useSharedExperimentViewState';
import { createExperimentPageUIState } from '../models/ExperimentPageUIState';
import type { ExperimentEntity } from '../../../types';
import { createExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import { isNil, omitBy } from 'lodash';
import { IntlProvider } from 'react-intl';
import { shouldUseCompressedExperimentViewSharedState } from '../../../../common/utils/FeatureUtils';
import { textCompressDeflate } from '../../../../common/utils/StringUtils';

jest.mock('../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/FeatureUtils')>(
    '../../../../common/utils/FeatureUtils',
  ),
  shouldUseCompressedExperimentViewSharedState: jest.fn(),
}));

jest.mock('../../../../common/utils/RoutingUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/RoutingUtils')>(
    '../../../../common/utils/RoutingUtils',
  ),
  useSearchParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('./useExperimentPageSearchFacets', () => ({
  ...jest.requireActual<typeof import('./useExperimentPageSearchFacets')>('./useExperimentPageSearchFacets'),
  useUpdateExperimentPageSearchFacets: jest.fn(),
}));

const testUIState = { ...createExperimentPageUIState(), selectedColumns: ['metrics.m2'], viewMaximized: true };
const testFacetsState = { ...createExperimentPageSearchFacetsState(), orderByKey: 'metrics.m1', orderByAsc: true };

const testSerializedShareViewState = JSON.stringify({
  ...testUIState,
  ...testFacetsState,
});
const testSerializedStateHash = 'abcdef123456789';

const getTestExperiment = async (isCompressed: boolean) => {
  const tagValue = isCompressed
    ? await textCompressDeflate(testSerializedShareViewState)
    : testSerializedShareViewState;
  return {
    experimentId: 'experiment_1',
    tags: [{ key: `mlflow.sharedViewState.${testSerializedStateHash}`, value: tagValue }],
  } as ExperimentEntity;
};

describe('useSharedExperimentViewState', () => {
  const uiStateSetterMock = jest.fn();
  const updateSearchFacetsMock = jest.fn();
  const navigateMock = jest.fn();

  const renderHookWithIntl = (hook: () => ReturnType<typeof useSharedExperimentViewState>) => {
    return renderHook(hook, { wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider> });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), jest.fn()]);
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useUpdateExperimentPageSearchFacets).mockReturnValue(updateSearchFacetsMock);
  });

  describe.each([true, false])('when state compression flag is set to %s', (compressionEnabled) => {
    beforeEach(() => {
      jest.mocked(shouldUseCompressedExperimentViewSharedState).mockImplementation(() => compressionEnabled);
    });

    it('should return isViewStateShared as false when viewStateShareKey is not present', async () => {
      const { result } = renderHookWithIntl(() => useSharedExperimentViewState(uiStateSetterMock));

      await waitFor(() => {
        expect(result.current.isViewStateShared).toBe(false);
      });
    });

    it('should return isViewStateShared as true when viewStateShareKey is present', async () => {
      jest
        .mocked(useSearchParams)
        .mockReturnValue([new URLSearchParams(`viewStateShareKey=${testSerializedStateHash}`), jest.fn()]);

      const { result } = renderHookWithIntl(() => useSharedExperimentViewState(uiStateSetterMock));

      await waitFor(() => {
        expect(result.current.isViewStateShared).toBe(true);
      });
    });

    it('should update search facets and ui state when shared state is present', async () => {
      jest
        .mocked(useSearchParams)
        .mockReturnValue([new URLSearchParams(`viewStateShareKey=${testSerializedStateHash}`), jest.fn()]);

      const testExperiment = await getTestExperiment(compressionEnabled);

      const { result } = renderHookWithIntl(() => useSharedExperimentViewState(uiStateSetterMock, testExperiment));

      // Expected state fields, undefined values are omitted
      const expectedFacetsState = omitBy(testFacetsState, isNil);
      const expectedUiState = omitBy(testUIState, isNil);

      await waitFor(() => {
        expect(updateSearchFacetsMock).toHaveBeenCalledWith(expect.objectContaining(expectedFacetsState), {
          replace: true,
        });
        expect(uiStateSetterMock).toHaveBeenCalledWith(expect.objectContaining(expectedUiState));
        expect(result.current.sharedStateError).toBeNull();
      });
    });

    it('should not update state when the hook is disabled', async () => {
      jest
        .mocked(useSearchParams)
        .mockReturnValue([new URLSearchParams(`viewStateShareKey=${testSerializedStateHash}`), jest.fn()]);

      const testExperiment = await getTestExperiment(compressionEnabled);

      const { result } = renderHookWithIntl(() =>
        useSharedExperimentViewState(uiStateSetterMock, testExperiment, true),
      );

      await waitFor(() => {
        expect(updateSearchFacetsMock).not.toHaveBeenCalled();
        expect(uiStateSetterMock).not.toHaveBeenCalled();
        expect(result.current.sharedStateError).toBeNull();
      });
    });

    it('should report an error and navigate to experiment page when shared state is malformed', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest
        .mocked(useSearchParams)
        .mockReturnValue([new URLSearchParams(`viewStateShareKey=${testSerializedStateHash}`), jest.fn()]);

      const testExperiment = await getTestExperiment(compressionEnabled);

      const brokenExperiment = {
        ...testExperiment,
        tags: [{ key: `mlflow.sharedViewState.${testSerializedStateHash}`, value: 'broken' }],
      } as ExperimentEntity;

      const { result } = renderHookWithIntl(() => useSharedExperimentViewState(uiStateSetterMock, brokenExperiment));

      await waitFor(() => {
        expect(updateSearchFacetsMock).not.toHaveBeenCalled();
        expect(uiStateSetterMock).not.toHaveBeenCalled();
        expect(result.current.sharedStateError).toMatch(/Error loading shared view state: share key is invalid/);
        expect(navigateMock).toHaveBeenCalledWith(expect.stringMatching(/\/experiments\/experiment_1$/), {
          replace: true,
        });
        // eslint-disable-next-line no-console -- TODO(FEINF-3587)
        jest.mocked(console.error).mockRestore();
      });
    });
  });

  test('should recognize uncompressed state also when compression flag is enabled', async () => {
    jest.mocked(shouldUseCompressedExperimentViewSharedState).mockImplementation(() => true);

    jest
      .mocked(useSearchParams)
      .mockReturnValue([new URLSearchParams(`viewStateShareKey=${testSerializedStateHash}`), jest.fn()]);

    const testExperiment = await getTestExperiment(false);

    const { result } = renderHookWithIntl(() => useSharedExperimentViewState(uiStateSetterMock, testExperiment));

    // Expected state fields, undefined values are omitted
    const expectedFacetsState = omitBy(testFacetsState, isNil);
    const expectedUiState = omitBy(testUIState, isNil);

    await waitFor(() => {
      expect(updateSearchFacetsMock).toHaveBeenCalledWith(expect.objectContaining(expectedFacetsState), {
        replace: true,
      });
      expect(uiStateSetterMock).toHaveBeenCalledWith(expect.objectContaining(expectedUiState));
      expect(result.current.sharedStateError).toBeNull();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useSharedExperimentViewState.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useSharedExperimentViewState.ts
Signals: React

```typescript
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { EXPERIMENT_PAGE_QUERY_PARAM_KEYS, useUpdateExperimentPageSearchFacets } from './useExperimentPageSearchFacets';
import { pick } from 'lodash';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { EXPERIMENT_PAGE_UI_STATE_FIELDS } from '../models/ExperimentPageUIState';
import type { ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import type { ExperimentEntity } from '../../../types';
import type { KeyValueEntity } from '../../../../common/types';
import { useNavigate, useSearchParams } from '../../../../common/utils/RoutingUtils';
import Utils from '../../../../common/utils/Utils';
import {
  EXPERIMENT_PAGE_VIEW_STATE_SHARE_TAG_PREFIX,
  EXPERIMENT_PAGE_VIEW_STATE_SHARE_URL_PARAM_KEY,
} from '../../../constants';
import Routes from '../../../routes';
import { isTextCompressedDeflate, textDecompressDeflate } from '../../../../common/utils/StringUtils';

const deserializePersistedState = async (state: string) => {
  if (isTextCompressedDeflate(state)) {
    return JSON.parse(await textDecompressDeflate(state));
  }
  return JSON.parse(state);
};

/**
 * Hook that handles loading shared view state from URL and updating the search facets/UI state accordingly
 */
export const useSharedExperimentViewState = (
  uiStateSetter: React.Dispatch<React.SetStateAction<ExperimentPageUIState>>,
  experiment?: ExperimentEntity,
  disabled = false,
) => {
  const [searchParams] = useSearchParams();
  const intl = useIntl();
  const viewStateShareKey = searchParams.get(EXPERIMENT_PAGE_VIEW_STATE_SHARE_URL_PARAM_KEY);

  const isViewStateShared = Boolean(viewStateShareKey);

  const updateSearchFacets = useUpdateExperimentPageSearchFacets();

  const [sharedSearchFacetsState, setSharedSearchFacetsState] = useState<ExperimentPageSearchFacetsState | null>(null);
  const [sharedUiState, setSharedUiState] = useState<ExperimentPageUIState | null>(null);
  const [sharedStateError, setSharedStateError] = useState<string | null>(null);
  const [sharedStateErrorMessage, setSharedStateErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!viewStateShareKey || !experiment) {
      return;
    }

    // Find the tag with the given share key
    const shareViewTag = experiment.tags.find(
      ({ key }) => key === `${EXPERIMENT_PAGE_VIEW_STATE_SHARE_TAG_PREFIX}${viewStateShareKey}`,
    );

    const tryParseSharedStateFromTag = async (shareViewTag: KeyValueEntity) => {
      try {
        const parsedSharedViewState = await deserializePersistedState(shareViewTag.value);
        // First, extract search facets part of the shared view state
        const sharedSearchFacetsState = pick(
          parsedSharedViewState,
          EXPERIMENT_PAGE_QUERY_PARAM_KEYS,
        ) as ExperimentPageSearchFacetsState;

        // Then, extract UI state part of the shared view state
        const sharedUiState = pick(parsedSharedViewState, EXPERIMENT_PAGE_UI_STATE_FIELDS) as ExperimentPageUIState;

        setSharedSearchFacetsState(sharedSearchFacetsState);
        setSharedUiState(sharedUiState);
        setSharedStateError(null);
        setSharedStateErrorMessage(null);
      } catch (e) {
        setSharedSearchFacetsState(null);
        setSharedUiState(null);
        setSharedStateError(`Error loading shared view state: share key is invalid`);
        setSharedStateErrorMessage(
          intl.formatMessage({
            defaultMessage: `Error loading shared view state: share key is invalid`,
            description: 'Experiment page > share viewstate > error > share key is invalid',
          }),
        );
      }
    };

    // If the tag exists, parse the view state from the tag value
    if (!shareViewTag) {
      setSharedSearchFacetsState(null);
      setSharedUiState(null);
      setSharedStateError(`Error loading shared view state: share key ${viewStateShareKey} does not exist`);
      setSharedStateErrorMessage(
        intl.formatMessage(
          {
            defaultMessage: `Error loading shared view state: share key "{viewStateShareKey}" does not exist`,
            description: 'Experiment page > share viewstate > error > share key does not exist',
          },
          {
            viewStateShareKey,
          },
        ),
      );
      return;
    }

    tryParseSharedStateFromTag(shareViewTag);
  }, [experiment, viewStateShareKey, intl]);

  useEffect(() => {
    if (!sharedSearchFacetsState || disabled) {
      return;
    }
    updateSearchFacets(sharedSearchFacetsState, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedSearchFacetsState, disabled]);

  useEffect(() => {
    if (!sharedUiState || disabled) {
      return;
    }
    uiStateSetter(sharedUiState);
  }, [uiStateSetter, sharedUiState, disabled]);

  const navigate = useNavigate();

  useEffect(() => {
    if (disabled) {
      return;
    }
    if (sharedStateError && experiment) {
      // If there's an error with share key, remove it from the URL and notify user
      Utils.logErrorAndNotifyUser(new Error(sharedStateError));
      Utils.displayGlobalErrorNotification(sharedStateErrorMessage, 3);
      navigate(Routes.getExperimentPageRoute(experiment.experimentId), { replace: true });
    }
  }, [sharedStateError, sharedStateErrorMessage, experiment, navigate, disabled]);

  return {
    isViewStateShared,
    sharedStateError,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useTagsFilter.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useTagsFilter.tsx
Signals: React

```typescript
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';
import { useMemo, useState } from 'react';

export const OPERATORS = ['IS', 'IS NOT', 'CONTAINS'] as const;
type Operator = typeof OPERATORS[number];
export type TagFilter = { key: string; operator: Operator; value: string };

function isOperator(value: string): value is Operator {
  return (OPERATORS as readonly string[]).includes(value);
}

function serialize(tagFilter: TagFilter) {
  return [tagFilter.key, tagFilter.operator, tagFilter.value].join('-');
}

function deserialize(value: string) {
  const split = value.split('-');
  if (split.length >= 3 && isOperator(split[1])) {
    // NOTE: key may not have dashes in it, but value may, so we'll join the rest
    const [key, operator, ...valueParts] = split;
    return { key, operator, value: valueParts.join('-') } satisfies TagFilter;
  } else {
    return null;
  }
}

export function useTagsFilter() {
  const [isTagsFilterOpen, setIsTagsFilterOpen] = useState(false);

  const name = 'experimentTagsFilter';
  const [searchParams, setSearchParams] = useSearchParams();

  const tagsFilter = useMemo(
    () => (searchParams.getAll(name) ?? []).map(deserialize).filter((tagFilter) => tagFilter !== null),
    [searchParams],
  );

  function setTagsFilter(tagsFilter: TagFilter[]) {
    searchParams.delete(name);

    const filtered = tagsFilter.filter((tagFilter) => tagFilter.key !== '' && tagFilter.value !== '');

    if (filtered.length !== 0) {
      for (const tagFilter of filtered) {
        searchParams.append(name, serialize(tagFilter));
      }
    }
    setSearchParams(searchParams);
    setIsTagsFilterOpen(false);
  }

  return { tagsFilter, setTagsFilter, isTagsFilterOpen, setIsTagsFilterOpen };
}
```

--------------------------------------------------------------------------------

---[FILE: useToggleRowVisibilityCallback.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useToggleRowVisibilityCallback.test.tsx
Signals: React

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useToggleRowVisibilityCallback } from './useToggleRowVisibilityCallback';
import { ExperimentPageUIStateContextProvider } from '../contexts/ExperimentPageUIStateContext';
import { RUNS_VISIBILITY_MODE, createExperimentPageUIState } from '../models/ExperimentPageUIState';
import { useEffect, useState } from 'react';
import type { RunRowType } from '../utils/experimentPage.row-types';
import { shouldUseRunRowsVisibilityMap } from '../../../../common/utils/FeatureUtils';

jest.mock('../../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../../common/utils/FeatureUtils')>(
    '../../../../common/utils/FeatureUtils',
  ),
  shouldUseRunRowsVisibilityMap: jest.fn(() => false),
}));

describe('useToggleRowVisibilityCallback', () => {
  let currentUIState = createExperimentPageUIState();
  const renderConfiguredHook = (
    tableRows: RunRowType[] = [],
    initialUiState = createExperimentPageUIState(),
    useGroupedValuesInCharts = true,
  ) =>
    renderHook((props) => useToggleRowVisibilityCallback(props.tableRows, useGroupedValuesInCharts), {
      initialProps: { tableRows },
      wrapper: function Wrapper({ children }) {
        const [uiState, setUIState] = useState(initialUiState);
        useEffect(() => {
          currentUIState = uiState;
        }, [uiState]);
        return (
          <ExperimentPageUIStateContextProvider setUIState={setUIState}>
            {children}
          </ExperimentPageUIStateContextProvider>
        );
      },
    }).result.current;
  test('performs simple update of the mode in the UI state', () => {
    const toggleRowVisibility = renderConfiguredHook();

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.SHOWALL);
    });

    // Assert updated mode
    expect(currentUIState.runsHiddenMode).toBe(RUNS_VISIBILITY_MODE.SHOWALL);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.HIDEALL);
    });

    // Assert updated mode
    expect(currentUIState.runsHiddenMode).toBe(RUNS_VISIBILITY_MODE.HIDEALL);
  });

  test('enables certain run row in the UI state using legacy runsHidden UI state', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(false);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: true, runUuid: 'run-1' },
        { hidden: false, runUuid: 'run-2' },
        { hidden: true, runUuid: 'run-3' },
        { hidden: false, runUuid: 'run-4' },
        { hidden: false, runUuid: 'run-5' },
      ] as any,
      { ...createExperimentPageUIState(), runsHidden: ['run-1', 'run-3'] },
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'run-5');
    });

    // Assert updated mode
    expect(currentUIState.runsHiddenMode).toBe(RUNS_VISIBILITY_MODE.CUSTOM);
    // Assert updated hidden runs
    expect(currentUIState.runsHidden).toEqual(['run-1', 'run-3', 'run-5']);
  });

  test('enables certain run row in the UI state using runsVisibilityMap UI state', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(true);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: true, runUuid: 'run-1' },
        { hidden: false, runUuid: 'run-2' },
        { hidden: true, runUuid: 'run-3' },
        { hidden: false, runUuid: 'run-4' },
        { hidden: false, runUuid: 'run-5' },
      ] as any,
      { ...createExperimentPageUIState(), runsVisibilityMap: { 'run-1': false, 'run-3': false } },
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'run-5', false);
    });

    // Assert mode didn't change
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);
    // Assert updated runs visibility map
    expect(currentUIState.runsVisibilityMap).toEqual({ 'run-1': false, 'run-3': false, 'run-5': true });
  });

  test('disables run group when useGroupedValuesInCharts is true (using legacy runsHidden UI state)', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(false);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: false, rowUuid: 'group-1', groupParentInfo: { runUuids: ['run-1-a', 'run-1-b'] } },
        { hidden: false, runUuid: 'run-1-a' },
        { hidden: false, runUuid: 'run-1-b' },
        { hidden: false, rowUuid: 'group-2', groupParentInfo: { runUuids: ['run-2-a', 'run-2-b'] } },
        { hidden: false, runUuid: 'run-2-a' },
        { hidden: false, runUuid: 'run-2-b' },
      ] as any,
      { ...createExperimentPageUIState() },
      true,
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'group-2');
    });

    // Assert updated mode
    expect(currentUIState.runsHiddenMode).toBe(RUNS_VISIBILITY_MODE.CUSTOM);
    // Assert updated hidden runs
    expect(currentUIState.runsHidden).toEqual(['group-2']);
  });

  test('disables run group when useGroupedValuesInCharts is true (using runsVisibilityMap UI state)', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(true);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: false, rowUuid: 'group-1', groupParentInfo: { runUuids: ['run-1-a', 'run-1-b'] } },
        { hidden: false, runUuid: 'run-1-a' },
        { hidden: false, runUuid: 'run-1-b' },
        { hidden: false, rowUuid: 'group-2', groupParentInfo: { runUuids: ['run-2-a', 'run-2-b'] } },
        { hidden: false, runUuid: 'run-2-a' },
        { hidden: false, runUuid: 'run-2-b' },
      ] as any,
      { ...createExperimentPageUIState() },
      true,
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'group-2', false);
    });

    // Assert mode didn't change
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);
    // Assert updated runs visibility map
    expect(currentUIState.runsVisibilityMap).toEqual({ 'group-2': true });
  });

  test('disables run group when useGroupedValuesInCharts is false (using legacy runsHidden UI state)', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(false);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: false, rowUuid: 'group-1', groupParentInfo: { runUuids: ['run-1-a', 'run-1-b'] } },
        { hidden: false, runUuid: 'run-1-a' },
        { hidden: false, runUuid: 'run-1-b' },
        { hidden: false, rowUuid: 'group-2', groupParentInfo: { runUuids: ['run-2-a', 'run-2-b'] } },
        { hidden: false, runUuid: 'run-2-a' },
        { hidden: false, runUuid: 'run-2-b' },
      ] as any,
      { ...createExperimentPageUIState() },
      false,
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'group-2');
    });

    // Assert updated mode
    expect(currentUIState.runsHiddenMode).toBe(RUNS_VISIBILITY_MODE.CUSTOM);
    // Assert updated hidden runs
    expect(currentUIState.runsHidden).toEqual(['run-2-a', 'run-2-b']);
  });

  test('disables run group when useGroupedValuesInCharts is false (using runsVisibilityMap UI state)', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(true);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: false, rowUuid: 'group-1', groupParentInfo: { runUuids: ['run-1-a', 'run-1-b'] } },
        { hidden: false, runUuid: 'run-1-a' },
        { hidden: false, runUuid: 'run-1-b' },
        { hidden: false, rowUuid: 'group-2', groupParentInfo: { runUuids: ['run-2-a', 'run-2-b'] } },
        { hidden: false, runUuid: 'run-2-a' },
        { hidden: false, runUuid: 'run-2-b' },
      ] as any,
      { ...createExperimentPageUIState() },
      false,
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'group-2');
    });

    // Assert mode didn't change
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);
    // Assert updated runs visibility map
    expect(currentUIState.runsVisibilityMap).toEqual({ 'run-2-a': true, 'run-2-b': true });
  });

  test('disables certain run row in the UI state when using legacy runsHidden UI state', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(false);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: true, runUuid: 'run-1' },
        { hidden: false, runUuid: 'run-2' },
        { hidden: true, runUuid: 'run-3' },
        { hidden: false, runUuid: 'run-4' },
        { hidden: false, runUuid: 'run-5' },
      ] as any,
      { ...createExperimentPageUIState(), runsHidden: ['run-1', 'run-3'] },
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'run-3');
    });

    // Assert updated mode
    expect(currentUIState.runsHiddenMode).toBe(RUNS_VISIBILITY_MODE.CUSTOM);
    // Assert updated hidden runs
    expect(currentUIState.runsHidden).toEqual(['run-1']);
  });

  test('disables certain run row in the UI state when using runsVisibilityMap UI state', () => {
    jest.mocked(shouldUseRunRowsVisibilityMap).mockReturnValue(true);
    const toggleRowVisibility = renderConfiguredHook(
      [
        { hidden: true, runUuid: 'run-1' },
        { hidden: false, runUuid: 'run-2' },
        { hidden: true, runUuid: 'run-3' },
        { hidden: false, runUuid: 'run-4' },
        { hidden: false, runUuid: 'run-5' },
      ] as any,
      {
        ...createExperimentPageUIState(),
        runsVisibilityMap: { 'run-1': false, 'run-3': true },
      },
    );

    // Assert initial mode
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);

    act(() => {
      toggleRowVisibility(RUNS_VISIBILITY_MODE.CUSTOM, 'run-3', true);
    });

    // Assert mode didn't change
    expect(currentUIState.runsHiddenMode).toBe(createExperimentPageUIState().runsHiddenMode);
    // Assert updated runs visibility map
    expect(currentUIState.runsVisibilityMap).toEqual({ 'run-1': false, 'run-3': false });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: useToggleRowVisibilityCallback.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useToggleRowVisibilityCallback.tsx
Signals: React

```typescript
import { useCallback, useRef } from 'react';
import { useUpdateExperimentViewUIState } from '../contexts/ExperimentPageUIStateContext';
import { RUNS_VISIBILITY_MODE } from '../models/ExperimentPageUIState';
import type { RunRowType } from '../utils/experimentPage.row-types';
import { shouldUseRunRowsVisibilityMap } from '../../../../common/utils/FeatureUtils';

export const useToggleRowVisibilityCallback = (tableRows: RunRowType[], useGroupedValuesInCharts = true) => {
  const updateUIState = useUpdateExperimentViewUIState();

  // We're going to use current state of the table rows to determine which rows are hidden.
  // Since we're interested only in the latest data, we avoid using state here to avoid unnecessary re-renders.
  const immediateTableRows = useRef(tableRows);
  immediateTableRows.current = tableRows;

  const toggleRowUsingVisibilityMap = useCallback(
    (mode: RUNS_VISIBILITY_MODE, groupOrRunUuid?: string, isCurrentlyVisible?: boolean) => {
      updateUIState((currentUIState) => {
        // If user has toggled a run or a group manually, we need to update the visibility map
        if (mode === RUNS_VISIBILITY_MODE.CUSTOM && groupOrRunUuid) {
          const newRunsVisibilityMap = {
            ...currentUIState.runsVisibilityMap,
          };

          // Check if the toggles row is a run group
          const currentToggledGroupInfo = immediateTableRows.current.find(
            ({ rowUuid, groupParentInfo }) => rowUuid === groupOrRunUuid && groupParentInfo,
          )?.groupParentInfo;

          // If we're toggling a group and we're not using grouped values in charts,
          // then toggle all runs in the group
          if (currentToggledGroupInfo && useGroupedValuesInCharts === false) {
            for (const runUuid of currentToggledGroupInfo.runUuids) {
              newRunsVisibilityMap[runUuid] = !isCurrentlyVisible;
            }
          } else {
            newRunsVisibilityMap[groupOrRunUuid] = !isCurrentlyVisible;
          }

          return {
            ...currentUIState,
            runsVisibilityMap: newRunsVisibilityMap,
          };
        }
        // Otherwise, we're toggling a predefined visibility mode
        // and clearing the visibility map
        if (
          [
            RUNS_VISIBILITY_MODE.SHOWALL,
            RUNS_VISIBILITY_MODE.HIDEALL,
            RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
            RUNS_VISIBILITY_MODE.FIRST_20_RUNS,
            RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS,
          ].includes(mode)
        ) {
          return {
            ...currentUIState,
            runsHiddenMode: mode,
            runsHidden: [],
            runsVisibilityMap: {},
          };
        }

        return currentUIState;
      });
    },
    [updateUIState, useGroupedValuesInCharts],
  );

  /**
   * @deprecated `toggleRowUsingVisibilityMap` replaces this function.
   * This one should be removed after ramping up `runsVisibility` field.
   */
  const toggleRowVisibility = useCallback(
    (mode: RUNS_VISIBILITY_MODE, groupOrRunUuid?: string) => {
      updateUIState((currentUIState) => {
        if (mode === RUNS_VISIBILITY_MODE.SHOWALL) {
          // Case #1: Showing all runs
          return {
            ...currentUIState,
            runsHiddenMode: RUNS_VISIBILITY_MODE.SHOWALL,
            runsHidden: [],
          };
        } else if (mode === RUNS_VISIBILITY_MODE.HIDEALL) {
          // Case #2: Hiding all runs
          return {
            ...currentUIState,
            runsHiddenMode: RUNS_VISIBILITY_MODE.HIDEALL,
            runsHidden: [],
          };
        } else if (mode === RUNS_VISIBILITY_MODE.FIRST_10_RUNS) {
          // Case #3: Showing only first 10 runs
          return {
            ...currentUIState,
            runsHiddenMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
            runsHidden: [],
          };
        } else if (mode === RUNS_VISIBILITY_MODE.FIRST_20_RUNS) {
          // Case #4: Showing only first 20 runs
          return {
            ...currentUIState,
            runsHiddenMode: RUNS_VISIBILITY_MODE.FIRST_20_RUNS,
            runsHidden: [],
          };
        } else if (mode === RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS) {
          // Case #5: Hiding finished runs
          return {
            ...currentUIState,
            runsHiddenMode: RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS,
            runsHidden: [],
          };
        }

        // Case #6: Custom visibility mode enabled by manually toggling visibility of a run or a group
        if (groupOrRunUuid) {
          // Determine which runs are hidden at the moment
          const currentlyHiddenRows = immediateTableRows.current
            .filter(({ hidden }) => hidden)
            .map(({ groupParentInfo, rowUuid, runUuid }) => (groupParentInfo ? rowUuid : runUuid));

          // Check if the toggles row is a run group
          const currentToggledGroupInfo = immediateTableRows.current.find(
            ({ rowUuid, groupParentInfo }) => rowUuid === groupOrRunUuid && groupParentInfo,
          )?.groupParentInfo;

          // If we're toggling a group and we're not using grouped values in charts,
          // then toggle all runs in the group
          if (currentToggledGroupInfo && useGroupedValuesInCharts === false) {
            let newHiddenRows: string[] = [];

            // Depending on the current state of the group, we either show all runs or hide all runs
            if (currentToggledGroupInfo.allRunsHidden) {
              newHiddenRows = currentlyHiddenRows.filter(
                (currentGroupOrRunUuid) => !currentToggledGroupInfo.runUuids.includes(currentGroupOrRunUuid),
              );
            } else {
              newHiddenRows = currentlyHiddenRows.concat(
                currentToggledGroupInfo.runUuids.filter((runUuid) => !currentlyHiddenRows.includes(runUuid)),
              );
            }
            return {
              ...currentUIState,
              // Set mode to "custom"
              runsHiddenMode: RUNS_VISIBILITY_MODE.CUSTOM,
              runsHidden: newHiddenRows,
            };
          }

          // Toggle visibility of a run/group by either adding or removing from the array
          const newHiddenRows = currentlyHiddenRows.includes(groupOrRunUuid)
            ? currentlyHiddenRows.filter((currentGroupOrRunUuid) => currentGroupOrRunUuid !== groupOrRunUuid)
            : [...currentlyHiddenRows, groupOrRunUuid];

          return {
            ...currentUIState,
            // Set mode to "custom"
            runsHiddenMode: RUNS_VISIBILITY_MODE.CUSTOM,
            runsHidden: newHiddenRows,
          };
        }

        return currentUIState;
      });
    },
    [updateUIState, useGroupedValuesInCharts],
  );

  return shouldUseRunRowsVisibilityMap() ? toggleRowUsingVisibilityMap : toggleRowVisibility;
};
```

--------------------------------------------------------------------------------

---[FILE: useUpdateExperimentKind.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/hooks/useUpdateExperimentKind.tsx

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { ExperimentKind } from '../../../constants';
import { MlflowService } from '../../../sdk/MlflowService';

/**
 * An utility wrapper hook to update the experiment kind.
 * The success callback is optional but it's part of the mutation to include it in the loading state.
 */
export const useUpdateExperimentKind = (onSuccess?: () => void) =>
  useMutation<unknown, Error, { experimentId: string; kind: ExperimentKind }>({
    mutationFn: ({ experimentId, kind }) =>
      MlflowService.setExperimentTag({
        experiment_id: experimentId,
        key: 'mlflow.experimentKind',
        value: kind,
      }).then(() => onSuccess?.() ?? Promise.resolve()),
  });
```

--------------------------------------------------------------------------------

````

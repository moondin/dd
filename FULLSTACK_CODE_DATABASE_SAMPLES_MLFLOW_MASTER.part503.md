---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 503
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 503 of 991)

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

---[FILE: getCommonArtifacts.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/getCommonArtifacts.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { getCommonArtifacts } from './getCommonArtifacts';
import type { ArtifactListFilesResponse } from '../../../types';

describe('getCommonArtifacts', () => {
  it('returns an empty array if no runs are provided', () => {
    const result = getCommonArtifacts({});
    expect(result).toEqual([]);
  });

  it('returns the artifact list if only one run is provided', () => {
    const artifactsKeyedByRun = {
      run1: {
        files: [{ path: 'artifact1' }, { path: 'artifact2' }],
      } as ArtifactListFilesResponse,
    };

    const result = getCommonArtifacts(artifactsKeyedByRun);
    expect(result).toEqual(['artifact1', 'artifact2']);
  });

  it('returns common artifacts across multiple runs', () => {
    const artifactsKeyedByRun = {
      run1: {
        files: [{ path: 'artifact1' }, { path: 'artifact2' }],
      } as ArtifactListFilesResponse,
      run2: {
        files: [{ path: 'artifact1' }, { path: 'artifact3' }],
      } as ArtifactListFilesResponse,
    };

    const result = getCommonArtifacts(artifactsKeyedByRun);
    expect(result).toEqual(['artifact1']);
  });

  it('returns an empty array if no common artifacts exist in the given runs', () => {
    const artifactsKeyedByRun = {
      run1: {
        files: [{ path: 'artifact1' }, { path: 'artifact2' }],
      } as ArtifactListFilesResponse,
      run2: {
        files: [{ path: 'artifact3' }, { path: 'artifact4' }],
      } as ArtifactListFilesResponse,
    };

    const result = getCommonArtifacts(artifactsKeyedByRun);
    expect(result).toEqual([]);
  });

  it('works when there are some runs without any files', () => {
    const artifactsKeyedByRun = {
      run1: {
        files: [{ path: 'artifact1' }, { path: 'artifact2' }],
      } as ArtifactListFilesResponse,
      run2: {
        files: [] as any,
      } as ArtifactListFilesResponse,
    };

    const result = getCommonArtifacts(artifactsKeyedByRun);
    expect(result).toEqual([]);
  });

  it('filters out directories', () => {
    const artifactsKeyedByRun = {
      run1: {
        files: [{ path: 'artifact1', is_dir: true }],
      } as ArtifactListFilesResponse,
      run2: {
        files: [{ path: 'artifact1', is_dir: true }],
      } as ArtifactListFilesResponse,
    };

    const result = getCommonArtifacts(artifactsKeyedByRun);
    expect(result).toEqual([]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: getCommonArtifacts.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/getCommonArtifacts.ts

```typescript
import type { ArtifactFileInfo, ArtifactListFilesResponse } from '../../../types';

/**
 * Gets the list of artifacts that are present in all runs in the given list of runs.
 * @param artifactsKeyedByRun Object containing artifacts keyed by run UUID
 * @returns List of common artifacts
 */
export const getCommonArtifacts = (artifactsKeyedByRun: Record<string, ArtifactListFilesResponse>) => {
  const runUuids = Object.keys(artifactsKeyedByRun);

  if (runUuids.length === 0) return [];

  let commonArtifacts = artifactsKeyedByRun[runUuids[0]]?.files
    ?.map((file: ArtifactFileInfo) => (file.is_dir ? null : file.path))
    ?.filter((path: string | null) => path !== null);

  if (!commonArtifacts || commonArtifacts.length === 0) return [];

  for (let i = 1; i < runUuids.length; i++) {
    const currentRunArtifacts = artifactsKeyedByRun[runUuids[i]]?.files?.map((file: any) => file.path);
    commonArtifacts = commonArtifacts?.filter((path: any) => currentRunArtifacts.includes(path));
    if (commonArtifacts.length === 0) {
      break;
    }
  }

  return commonArtifacts;
};
```

--------------------------------------------------------------------------------

---[FILE: persistSearchFacets.serializers.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/persistSearchFacets.serializers.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  deserializeFieldsFromLocalStorage,
  deserializeFieldsFromQueryString,
  serializeFieldsToLocalStorage,
  serializeFieldsToQueryString,
} from './persistSearchFacets.serializers';

describe('persistSearchFacets serializers and deserializers', () => {
  it('tests serializeToQueryString', () => {
    const serializedObject = serializeFieldsToQueryString({
      orderByKey: 'column_name',
    });

    expect(serializedObject).toEqual(
      expect.objectContaining({
        orderByKey: 'column_name',
      }),
    );
  });

  it('tests deserializeToQueryString', () => {
    const deserializedObject = deserializeFieldsFromQueryString({
      orderByKey: 'column_name',
    });

    expect(deserializedObject).toEqual(
      expect.objectContaining({
        orderByKey: 'column_name',
      }),
    );
  });

  it('tests serializeLocalStorage', () => {
    const serializedObject = serializeFieldsToLocalStorage({
      orderByKey: 'column_name',
    });

    expect(serializedObject).toEqual(
      expect.objectContaining({
        orderByKey: 'column_name',
      }),
    );
  });

  it('tests deserializing search filter without extra characters', () => {
    const serializedObjectQs = deserializeFieldsFromQueryString({
      searchFilter: ['param.p1 = "something', 'separated', 'by comma"'],
    });
    const serializedObjectLs = deserializeFieldsFromLocalStorage({
      searchFilter: ['param.p1 = "something', 'separated', 'by comma"'],
    });

    expect(serializedObjectQs).toEqual(serializedObjectLs);
    expect(serializedObjectQs).toEqual(
      expect.objectContaining({
        searchFilter: 'param.p1 = "something,separated,by comma"',
      }),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: persistSearchFacets.serializers.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/persistSearchFacets.serializers.ts

```typescript
import { isArray } from 'lodash';
import { atobUtf8, btoaUtf8 } from '../../../../common/utils/StringUtils';
import type { ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';

type PersistSearchSerializeFunctions<Serialized = any, Unserialized = any> = {
  serializeLocalStorage?(input: Unserialized): Serialized;
  serializeQueryString?(input: Unserialized): Serialized;
  deserializeLocalStorage?(input: Serialized): Unserialized;
  deserializeQueryString?(input: Serialized): Unserialized;
};

/**
 * "Flattens" the strings array, i.e. merges it into a single value
 */
const flattenString = (input: string | string[]) => (isArray(input) ? input.join() : input);

/**
 * All known field serialization and deserialization mechanisms used in search facets state persisting mechanism.
 */
const persistSearchStateFieldSerializers: Record<string, PersistSearchSerializeFunctions> = {
  /**
   * In rare cases, search filter might contain commas that interfere with `querystring` library
   * parsing causing it to return array instead of string. Since it's difficult to selectively
   * change `querystring`'s parsing action, we are making sure that the parsed values are always strings.
   */
  searchFilter: {
    deserializeLocalStorage: flattenString,
    deserializeQueryString: flattenString,
  },
  orderByAsc: {
    serializeQueryString(input: boolean) {
      return input.toString();
    },
    deserializeQueryString(input: string) {
      return input === 'true';
    },
  },
  datasetsFilter: {
    serializeQueryString(inputs: ExperimentPageSearchFacetsState['datasetsFilter']) {
      const inputsWithoutExperimentId = inputs.map(({ name, digest, context }) => ({
        name,
        digest,
        context,
      }));
      return btoaUtf8(JSON.stringify(inputsWithoutExperimentId));
    },
    deserializeQueryString(input: string): ExperimentPageSearchFacetsState['datasetsFilter'] {
      try {
        // Process the URL defensively against intended and unintended malformation
        const parsedResult = JSON.parse(atobUtf8(input));
        if (!Array.isArray(parsedResult)) {
          return [];
        }
        return parsedResult;
      } catch {
        return [];
      }
    },
  },
  /**
   * Array of visible configured charts are serialized into base64-encoded JSON when put into query string
   */
  compareRunCharts: {
    serializeQueryString(input: ExperimentPageUIState['compareRunCharts']) {
      return btoaUtf8(JSON.stringify(input));
    },
    deserializeQueryString(input: string): ExperimentPageUIState['compareRunCharts'] {
      try {
        // Process the URL defensively against intended and unintended malformation
        const parsedResult = JSON.parse(atobUtf8(input));
        if (!Array.isArray(parsedResult)) {
          return undefined;
        }
        return parsedResult;
      } catch {
        return undefined;
      }
    },
  },
  /**
   * For "compareRunsMode", we will always save "undefined" value to local storage so users will
   * get back to default view after visiting the view once more.
   */
  compareRunsMode: {
    serializeLocalStorage() {
      return undefined;
    },
  },
};

type StateKey = keyof Partial<ExperimentPageSearchFacetsState>;

/**
 * Consumes an object with persistable search facets and transforms relevant fields
 * with the registered serialization functions specific to query string.
 * Example scenario: serializing an array of visible configured charts into base64-encoded JSON.
 */
export const serializeFieldsToQueryString = (input: Partial<ExperimentPageSearchFacetsState>) => {
  const resultObject: Partial<Record<StateKey, any>> = { ...input };
  for (const field of Object.keys(resultObject) as StateKey[]) {
    const serializeFn = persistSearchStateFieldSerializers[field]?.serializeQueryString;
    if (serializeFn) {
      resultObject[field] = serializeFn(resultObject[field]);
    }
  }
  return resultObject;
};

/**
 * Consumes an object with search facets extracted from query string and transforms relevant fields
 * with the registered deserialization functions. Example scenario: deserializing an array of
 * visible configured charts from base64-encoded JSON.
 */
export const deserializeFieldsFromQueryString = (
  input: Partial<ExperimentPageSearchFacetsState> | Record<string, any>,
) => {
  const resultObject: Partial<Record<StateKey, any>> = { ...input };
  for (const field of Object.keys(resultObject) as StateKey[]) {
    const deserializeFn = persistSearchStateFieldSerializers[field]?.deserializeQueryString;
    if (deserializeFn) {
      resultObject[field] = deserializeFn(resultObject[field]);
    }
  }
  return resultObject;
};

/**
 * Consumes an object with persistable search facets and transforms relevant fields
 * with the registered serialization functions specific to local storage.
 * Example scenario: serializing an array of visible configured charts into base64-encoded JSON.
 */
export const serializeFieldsToLocalStorage = (input: Partial<ExperimentPageSearchFacetsState>) => {
  const resultObject: Partial<Record<StateKey, any>> = { ...input };
  for (const field of Object.keys(resultObject) as StateKey[]) {
    const serializeFn = persistSearchStateFieldSerializers[field]?.serializeLocalStorage;
    if (serializeFn) {
      resultObject[field] = serializeFn(resultObject[field]);
    }
  }
  return resultObject;
};

/**
 * Consumes an object with search facets extracted from local storage and transforms relevant fields
 * with the registered deserialization functions. Example scenario: deserializing an array of
 * visible configured charts from base64-encoded JSON.
 */
export const deserializeFieldsFromLocalStorage = (
  input: Partial<ExperimentPageSearchFacetsState> | Record<string, any>,
) => {
  const resultObject: Partial<Record<StateKey, any>> = { ...input };
  for (const field of Object.keys(resultObject) as StateKey[]) {
    const deserializeFn = persistSearchStateFieldSerializers[field]?.deserializeLocalStorage;
    if (deserializeFn) {
      resultObject[field] = deserializeFn(resultObject[field]);
    }
  }
  return resultObject;
};
```

--------------------------------------------------------------------------------

---[FILE: persistSearchFacets.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/persistSearchFacets.ts

```typescript
import LocalStorageUtils from '../../../../common/utils/LocalStorageUtils';
import Utils from '../../../../common/utils/Utils';

import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { createExperimentPageUIState } from '../models/ExperimentPageUIState';
import type { ExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';
import { createExperimentPageSearchFacetsState } from '../models/ExperimentPageSearchFacetsState';

/**
 * Loads current view state (UI state, view state) in the local storage.
 */
export function loadExperimentViewState(idKey: string) {
  try {
    const localStorageInstance = LocalStorageUtils.getStoreForComponent('ExperimentPage', idKey);
    return localStorageInstance.loadComponentState();
  } catch {
    Utils.logErrorAndNotifyUser(`Error: malformed persisted search state for experiment(s) ${idKey}`);

    return {
      ...createExperimentPageUIState(),
      ...createExperimentPageSearchFacetsState(),
    };
  }
}

/**
 * Persists view state (UI state, view state) in the local storage.
 */
export function saveExperimentViewState(data: ExperimentPageUIState & ExperimentPageSearchFacetsState, idKey: string) {
  const localStorageInstance = LocalStorageUtils.getStoreForComponent('ExperimentPage', idKey);
  localStorageInstance.saveComponentState(data);
}
```

--------------------------------------------------------------------------------

---[FILE: test-utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/utils/test-utils.ts

```typescript
import type { ExperimentEntity, RunInfoEntity } from '../../../types';
import { RunsChartsLineChartXAxisType } from '../../runs-charts/components/RunsCharts.common';
import type { ExperimentPageUIState } from '../models/ExperimentPageUIState';
import { RUNS_VISIBILITY_MODE } from '../models/ExperimentPageUIState';
import type { ExperimentRunsSelectorResult } from './experimentRuns.selector';

/**
 * Create a base UI state that matches the structure required by the initializer.
 */
export const createBaseUIState = (): ExperimentPageUIState => ({
  selectedColumns: [],
  runsExpanded: {},
  runsPinned: [],
  runsHidden: [],
  runsHiddenMode: RUNS_VISIBILITY_MODE.FIRST_10_RUNS,
  runsVisibilityMap: {},
  viewMaximized: false,
  runListHidden: false,
  groupBy: null,
  groupsExpanded: {},
  useGroupedValuesInCharts: true,
  hideEmptyCharts: true,
  globalLineChartConfig: {
    xAxisKey: RunsChartsLineChartXAxisType.STEP,
    lineSmoothness: 0,
    selectedXAxisMetricKey: '',
  },
  isAccordionReordered: false,
  autoRefreshEnabled: false,
});

/**
 * Create a base runs data object.
 */
export const createBaseRunsData = (): ExperimentRunsSelectorResult => ({
  paramKeyList: [],
  metricKeyList: [],
  datasetsList: [],
  experimentTags: {},
  metricsList: [],
  modelVersionsByRunUuid: {},
  paramsList: [],
  runInfos: [],
  runUuidsMatchingFilter: [],
  tagsList: [],
});

/**
 * Helper to create a tag.
 */
export function makeTag(key: string, value: string) {
  return { key, value };
}

/**
 * Create a base ExperimentEntity object.
 */
export const createBaseExperimentEntity = (): ExperimentEntity => ({
  allowedActions: [],
  artifactLocation: '',
  creationTime: 0,
  experimentId: 'experiment_1',
  lastUpdateTime: 0,
  lifecycleStage: 'active',
  name: 'AutoML Experiment',
  tags: [],
});

/**
 * Create a base RunInfoEntity object.
 */
export const createBaseRunsInfoEntity = (): RunInfoEntity => ({
  artifactUri: '',
  endTime: 0,
  experimentId: 'experiment_1',
  lifecycleStage: 'active',
  runName: 'run_1',
  runUuid: 'run_1',
  startTime: 0,
  status: 'FINISHED',
});
```

--------------------------------------------------------------------------------

---[FILE: ExperimentLinkedPromptsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-prompts/ExperimentLinkedPromptsTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  useDesignSystemTheme,
  Typography,
  Table,
  Empty,
  TableRow,
  TableHeader,
  TableCell,
  Input,
  getShadowScrollStyles,
  SearchIcon,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import type { ColumnDef, ColumnDefTemplate, CellContext } from '@tanstack/react-table';
import { getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';

import { Link } from '../../../common/utils/RoutingUtils';
import Routes from '../../routes';
import { PROMPT_VERSION_QUERY_PARAM } from '../../pages/prompts/utils';

interface Props {
  data: LinkedPromptsRow[];
}

type LinkedPromptsRow = { experimentId: string; name: string; version: string };

type TableCellRenderer = ColumnDefTemplate<CellContext<LinkedPromptsRow, unknown>>;

const PromptNameCellRenderer: ColumnDef<LinkedPromptsRow>['cell'] = ({ row }) => {
  const { experimentId, name, version } = row.original ?? {};

  // TODO: allow linking to prompt versions in OSS
  const baseRoute = Routes.getPromptDetailsPageRoute(name);

  if (version) {
    const searchParams = new URLSearchParams();
    searchParams.set(PROMPT_VERSION_QUERY_PARAM, version);
    const routeWithVersion = `${baseRoute}?${searchParams.toString()}`;
    return <Link to={routeWithVersion}>{name}</Link>;
  }

  return <Link to={baseRoute}>{name}</Link>;
};

const VersionCellRenderer: ColumnDef<LinkedPromptsRow>['cell'] = ({ row }) => {
  const { version } = row.original ?? {};

  return <Typography.Paragraph withoutMargins>{version}</Typography.Paragraph>;
};

export const ExperimentLinkedPromptsTable = ({ data }: Props) => {
  const intl = useIntl();
  const { theme } = useDesignSystemTheme();
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'name',
        header: intl.formatMessage({
          defaultMessage: 'Prompt Name',
          description: 'Header for prompt name column in linked prompts table on logged model details page',
        }),
        enableResizing: true,
        size: 400,
        accessorKey: 'name',
        cell: PromptNameCellRenderer as TableCellRenderer,
      },
      {
        id: 'version',
        header: intl.formatMessage({
          defaultMessage: 'Version',
          description: 'Header for version column in linked prompts table on logged model details page',
        }),
        enableResizing: false,
        accessorKey: 'version',
        cell: VersionCellRenderer as TableCellRenderer,
      },
    ],
    [intl],
  );

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/components/experiment-prompts/ExperimentLinkedPromptsTable.tsx',
    {
      data,
      getRowId: (row) => row.name,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      columns,
      state: {
        globalFilter,
      },
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: 'includesString',
    },
  );

  const renderTableContent = () => {
    return (
      <>
        <div css={{ marginBottom: theme.spacing.sm }}>
          <Input
            componentId="mlflow.logged_model.details.runs.table.search"
            prefix={<SearchIcon />}
            placeholder={intl.formatMessage({
              defaultMessage: 'Search prompts',
              description:
                'Placeholder text for the search input in the prompts table on the logged model details page',
            })}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            allowClear
          />
        </div>
        <Table
          scrollable
          css={{
            '&>div': getShadowScrollStyles(theme, {
              orientation: 'vertical',
            }),
          }}
          empty={
            data.length === 0 ? (
              <Empty
                description={
                  <FormattedMessage
                    defaultMessage="No prompts"
                    description="No results message for linked prompts table on logged model details page"
                  />
                }
              />
            ) : table.getFilteredRowModel().rows.length === 0 ? (
              <Empty
                description={
                  <FormattedMessage
                    defaultMessage="No prompts match your search"
                    description="No search results message for linked prompts table on logged model details page"
                  />
                }
              />
            ) : null
          }
        >
          <TableRow isHeader>
            {table.getLeafHeaders().map((header) => (
              <TableHeader
                componentId="mlflow.logged_model.details.linked_prompts.table.header"
                key={header.id}
                header={header}
                column={header.column}
                setColumnSizing={table.setColumnSizing}
                isResizing={header.column.getIsResizing()}
                css={{
                  flexGrow: header.column.getCanResize() ? 0 : 1,
                }}
                style={{
                  flexBasis: header.column.getCanResize() ? header.column.getSize() : undefined,
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeader>
            ))}
          </TableRow>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={`${row.id}-${row.original.name}-${row.original.version}-row`}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={`${cell.id}-${row.original.name}-${row.original.version}-cell`}
                  style={{
                    flexGrow: cell.column.getCanResize() ? 0 : 1,
                    flexBasis: cell.column.getCanResize() ? cell.column.getSize() : undefined,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      </>
    );
  };

  return (
    <div css={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: 400 }}>
      <Typography.Title css={{ fontSize: 16 }}>
        <FormattedMessage
          defaultMessage="Prompts"
          description="Title for linked prompts table on logged model details page"
        />
      </Typography.Title>
      <div
        css={{
          padding: theme.spacing.sm,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.general.borderRadiusBase,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {renderTableContent()}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: BulkDeleteExperimentModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/BulkDeleteExperimentModal.test.tsx

```typescript
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { BulkDeleteExperimentModal } from './BulkDeleteExperimentModal';
import { render, screen, waitFor } from '../../../common/utils/TestUtils.react18';
import { IntlProvider } from 'react-intl';
import { MockedReduxStoreProvider } from '../../../common/utils/TestUtils';
import userEvent from '@testing-library/user-event';
import { MlflowService } from '../../sdk/MlflowService';
import { deleteExperimentApi, getExperimentApi } from '../../actions';
import Utils from '../../../common/utils/Utils';

jest.mock('../../actions', () => ({
  getExperimentApi: jest.fn(() => ({ type: 'action', meta: {}, payload: Promise.resolve({}) })),
  deleteExperimentApi: jest.fn(() => ({ type: 'action', meta: {}, payload: Promise.resolve({}) })),
}));

describe('RenameExperimentModal', () => {
  let minimalProps: any;

  beforeEach(() => {
    jest.mocked(deleteExperimentApi).mockClear();
    jest.mocked(getExperimentApi).mockClear();
    jest.spyOn(MlflowService, 'getExperimentByName').mockImplementation(() => Promise.reject({} as any));
    jest.spyOn(Utils, 'logErrorAndNotifyUser');
    jest.clearAllMocks();
  });

  const renderTestComponent = () => {
    minimalProps = {
      isOpen: true,
      experiments: [{ experimentId: 0, name: '0' }],
      onClose: jest.fn(() => Promise.resolve({})),
      onExperimentsDeleted: jest.fn(),
    };

    render(<BulkDeleteExperimentModal {...minimalProps} />, {
      wrapper: ({ children }) => (
        <IntlProvider locale="en">
          <MockedReduxStoreProvider
            state={{
              entities: {},
            }}
          >
            {children}
          </MockedReduxStoreProvider>
        </IntlProvider>
      ),
    });
  };

  test('should render with minimal props without exploding', async () => {
    renderTestComponent();
    expect(screen.getByText(/Delete \d+ Experiment/)).toBeInTheDocument();
  });

  test('form submission should result in deleteExperimentApi calls', async () => {
    renderTestComponent();
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(deleteExperimentApi).toHaveBeenCalledTimes(1);
    });
  });

  test('if deleteExperimentApi fails, error is reported', async () => {
    const error = new Error('123');
    jest
      .mocked(deleteExperimentApi)
      .mockImplementation(() => ({ type: 'action', meta: {}, payload: Promise.reject(error) } as any));

    renderTestComponent();
    await userEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(Utils.logErrorAndNotifyUser).toHaveBeenLastCalledWith(error);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: BulkDeleteExperimentModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/BulkDeleteExperimentModal.tsx
Signals: Redux/RTK

```typescript
import { Typography } from '@databricks/design-system';
import type { ExperimentEntity } from '../../types';
import { ConfirmModal } from './ConfirmModal';
import { deleteExperimentApi } from '../../actions';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '@mlflow/mlflow/src/redux-types';
import Utils from '@mlflow/mlflow/src/common/utils/Utils';
import { FormattedMessage } from 'react-intl';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  experiments: Pick<ExperimentEntity, 'experimentId' | 'name'>[];
  onExperimentsDeleted: () => void;
};

export const BulkDeleteExperimentModal = ({ isOpen, onClose, experiments, onExperimentsDeleted }: Props) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const handleSubmit = () => {
    return Promise.all(experiments.map((experiment) => dispatch(deleteExperimentApi(experiment.experimentId))))
      .then(onExperimentsDeleted)
      .catch((e: any) => Utils.logErrorAndNotifyUser(e));
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      title={
        <FormattedMessage
          defaultMessage="Delete {count, plural, one {# Experiment} other {# Experiments}}"
          description="Experiments page list, delete bulk experiments modal title"
          values={{
            count: experiments.length,
          }}
        />
      }
      helpText={
        <div>
          <Typography.Paragraph>The following experiments will be deleted:</Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              {experiments.map((experiment) => (
                <li key={experiment.experimentId}>
                  <Typography.Text>
                    {experiment.name} (ID: {experiment.experimentId})
                  </Typography.Text>
                </li>
              ))}
            </ul>
          </Typography.Paragraph>
        </div>
      }
      confirmButtonText={
        <FormattedMessage
          defaultMessage="Delete"
          description="Experiments page list, delete bulk experiments modal primary button"
        />
      }
      confirmButtonProps={{ danger: true }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ConfirmModal.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/ConfirmModal.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { describe, beforeEach, jest, test, expect } from '@jest/globals';
import React from 'react';
import { shallow } from 'enzyme';
import { ConfirmModal } from './ConfirmModal';
import { Modal } from '@databricks/design-system';

describe('ConfirmModal', () => {
  let wrapper: any;
  let instance;
  let minimalProps: any;
  let onCloseMock: any;

  beforeEach(() => {
    onCloseMock = jest.fn();
    minimalProps = {
      isOpen: false,
      handleSubmit: jest.fn(() => Promise.resolve({})),
      onClose: onCloseMock,
      title: 'testTitle',
      helpText: 'testHelp',
      confirmButtonText: 'confirmTest',
    };
    wrapper = shallow(<ConfirmModal {...minimalProps} />);
  });

  test('should render with minimal props without exploding', () => {
    expect(wrapper.length).toBe(1);
    expect(wrapper.find(Modal).length).toBe(1);
  });

  test('onRequestCloseHandler executes properly based on state', () => {
    instance = wrapper.instance();
    instance.onRequestCloseHandler();
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    instance.setState({ isSubmitting: true });
    instance.onRequestCloseHandler();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line jest/no-done-callback -- TODO(FEINF-1337)
  test('handleSubmitWrapper closes modal in both success & failure cases', (done) => {
    const promise = wrapper.find(Modal).prop('onOk')();
    promise.finally(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(wrapper.state('isSubmitting')).toBe(false);
      done();
    });

    const mockFailHandleSubmit = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          window.setTimeout(() => {
            reject();
          }, 100);
        }),
    );
    const failProps = { ...minimalProps, handleSubmit: mockFailHandleSubmit };
    const failWrapper = shallow(<ConfirmModal {...failProps} />);
    const failPromise = failWrapper.find(Modal).prop('onOk')();
    failPromise.finally(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(2);
      expect(failWrapper.state('isSubmitting')).toBe(false);
      done();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ConfirmModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/ConfirmModal.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';
import type { ModalProps } from '@databricks/design-system';
import { Modal } from '@databricks/design-system';

type Props = {
  isOpen: boolean;
  handleSubmit: (...args: any[]) => any;
  onClose: (...args: any[]) => any;
  title: React.ReactNode;
  helpText: React.ReactNode;
  confirmButtonText: React.ReactNode;
  confirmButtonProps?: ModalProps['okButtonProps'];
};

type State = any;

export class ConfirmModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onRequestCloseHandler = this.onRequestCloseHandler.bind(this);
    this.handleSubmitWrapper = this.handleSubmitWrapper.bind(this);
  }

  state = {
    isSubmitting: false,
  };

  onRequestCloseHandler() {
    if (!this.state.isSubmitting) {
      this.props.onClose();
    }
  }

  handleSubmitWrapper() {
    this.setState({ isSubmitting: true });
    return this.props.handleSubmit().finally(() => {
      this.props.onClose();
      this.setState({ isSubmitting: false });
    });
  }

  render() {
    return (
      <Modal
        data-testid="confirm-modal"
        title={this.props.title}
        visible={this.props.isOpen}
        onOk={this.handleSubmitWrapper}
        okText={this.props.confirmButtonText}
        okButtonProps={this.props.confirmButtonProps}
        confirmLoading={this.state.isSubmitting}
        onCancel={this.onRequestCloseHandler}
        // @ts-expect-error TS(2322): Type '{ children: Element; "data-testid": string; ... Remove this comment to see the full error message
        centered
      >
        <div className="modal-explanatory-text">{this.props.helpText}</div>
      </Modal>
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CreateExperimentForm.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/CreateExperimentForm.test.tsx
Signals: React

```typescript
import { describe, jest, it, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { CreateExperimentForm } from './CreateExperimentForm';

describe('Render test', () => {
  const minimalProps = {
    visible: true,
    // eslint-disable-next-line no-unused-vars
    form: { getFieldDecorator: jest.fn((opts) => (c: any) => c) },
  };

  it('should render with minimal props without exploding', () => {
    renderWithIntl(<CreateExperimentForm {...minimalProps} />);
    expect(
      screen.getByRole('textbox', {
        name: /experiment name/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: /artifact location/i,
      }),
    ).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CreateExperimentForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/modals/CreateExperimentForm.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React, { Component } from 'react';

import { injectIntl } from 'react-intl';
import { Input, LegacyForm } from '@databricks/design-system';

export const EXP_NAME_FIELD = 'experimentName';
export const ARTIFACT_LOCATION = 'artifactLocation';

type Props = {
  validator?: (...args: any[]) => any;
  intl: {
    formatMessage: (...args: any[]) => any;
  };
  innerRef: any;
};

/**
 * Component that renders a form for creating a new experiment.
 */
class CreateExperimentFormComponent extends Component<Props> {
  render() {
    return (
      // @ts-expect-error TS(2322): Type '{ children: Element[]; ref: any; layout: "ve... Remove this comment to see the full error message
      <LegacyForm ref={this.props.innerRef} layout="vertical">
        <LegacyForm.Item
          label={this.props.intl.formatMessage({
            defaultMessage: 'Experiment Name',
            description: 'Label for create experiment modal to enter a valid experiment name',
          })}
          name={EXP_NAME_FIELD}
          rules={[
            {
              required: true,
              message: this.props.intl.formatMessage({
                defaultMessage: 'Please input a new name for the new experiment.',
                description: 'Error message for name requirement in create experiment for MLflow',
              }),
            },
            {
              validator: this.props.validator,
            },
          ]}
        >
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_modals_createexperimentform.tsx_51"
            placeholder={this.props.intl.formatMessage({
              defaultMessage: 'Input an experiment name',
              description: 'Input placeholder to enter experiment name for create experiment',
            })}
            autoFocus
          />
        </LegacyForm.Item>
        <LegacyForm.Item
          name={ARTIFACT_LOCATION}
          label={this.props.intl.formatMessage({
            defaultMessage: 'Artifact Location',
            description: 'Label for create experiment modal to enter a artifact location',
          })}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            componentId="codegen_mlflow_app_src_experiment-tracking_components_modals_createexperimentform.tsx_71"
            placeholder={this.props.intl.formatMessage({
              defaultMessage: 'Input an artifact location (optional)',
              description: 'Input placeholder to enter artifact location for create experiment',
            })}
          />
        </LegacyForm.Item>
      </LegacyForm>
    );
  }
}

// @ts-expect-error TS(2769): No overload matches this call.
export const CreateExperimentForm = injectIntl(CreateExperimentFormComponent);
```

--------------------------------------------------------------------------------

````

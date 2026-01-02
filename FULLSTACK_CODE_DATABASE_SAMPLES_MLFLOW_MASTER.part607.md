---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 607
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 607 of 991)

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

---[FILE: ModelListTable.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/model-list/ModelListTable.enzyme.test.tsx

```typescript
import { jest, describe, beforeEach, it, expect, test } from '@jest/globals';
import { MemoryRouter } from '../../../common/utils/RoutingUtils';
import { getTableRowByCellText, getTableRows } from '@databricks/design-system/test-utils/enzyme';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { renderWithIntl, act, screen, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { ModelListTableProps } from './ModelListTable';
import { ModelListTable } from './ModelListTable';
import { DesignSystemProvider } from '@databricks/design-system';

import { Stages } from '../../constants';
import Utils from '../../../common/utils/Utils';
import { withNextModelsUIContext } from '../../hooks/useNextModelsUI';
import { ModelsNextUIToggleSwitch } from '../ModelsNextUIToggleSwitch';
import userEvent from '@testing-library/user-event';
import { shouldShowModelsNextUI } from '../../../common/utils/FeatureUtils';
import { I18nUtils } from '../../../i18n/I18nUtils';
jest.mock('../../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../../common/utils/FeatureUtils')>('../../../common/utils/FeatureUtils'),
  shouldShowModelsNextUI: jest.fn(),
}));

const MODELS = [
  {
    name: 'test_model_1',
    creation_timestamp: 1234,
    email_subscription_status: 'active',
    last_updated_timestamp: 1234,
    permission_level: '',
    source: 'notebook',
    status: 'active',
    user_id: '123',
    latest_versions: [{ version: 1 } as any],
    tags: [],
  },
  {
    name: 'test_model_2',
    creation_timestamp: 100000,
    email_subscription_status: 'active',
    last_updated_timestamp: 100000,
    permission_level: '',
    source: 'notebook',
    status: 'active',
    user_id: '123',
    latest_versions: [
      { version: 2, current_stage: Stages.PRODUCTION },
      { version: 3, current_stage: Stages.STAGING },
      { version: 1 },
    ] as any,
    tags: [],
  },
];

describe('ModelListTable', () => {
  const minimalProps: ModelListTableProps = {
    isLoading: false,
    error: undefined,
    modelsData: MODELS as any,
    onSortChange: jest.fn(),
    orderByAsc: false,
    orderByKey: 'name',
    pagination: <div data-testid="pagination" />,
    isFiltered: false,
  };

  const createComponentWrapper = (moreProps: Partial<ModelListTableProps> = {}) => {
    return mountWithIntl(
      <MemoryRouter>
        <DesignSystemProvider>
          <ModelListTable {...minimalProps} {...moreProps} />
        </DesignSystemProvider>
      </MemoryRouter>,
    );
  };

  it('mounts the component and checks if rows are rendered', () => {
    const wrapper = createComponentWrapper({});

    // One header row and two data rows
    expect(wrapper.find('div[role="row"]').length).toBe(3);

    // Our mocked pagination exists
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBeTruthy();
  });

  it('checks if the modification date column is rendered', () => {
    const wrapper = createComponentWrapper({});
    const intl = I18nUtils.createIntlWithLocale();

    const {
      bodyRows: [firstRow],
    } = getTableRows(wrapper);
    expect(
      firstRow
        .findWhere((column: any) =>
          column.text().includes(Utils.formatTimestamp(MODELS[0].last_updated_timestamp, intl)),
        )
        .exists(),
    ).toBeTruthy();
  });

  it('checks if the model link is rendered', () => {
    const wrapper = createComponentWrapper({});
    expect(
      getTableRowByCellText(wrapper, 'test_model_1').find('a[href$="/models/test_model_1"]').exists(),
    ).toBeTruthy();
    expect(
      getTableRowByCellText(wrapper, 'test_model_2').find('a[href$="/models/test_model_2"]').exists(),
    ).toBeTruthy();
  });

  it('checks if the simple model version links are rendered', () => {
    const wrapper = createComponentWrapper({});
    // Model #1 contains only one version
    expect(
      getTableRowByCellText(wrapper, 'test_model_1').find('a[href$="/models/test_model_1/versions/1"]').exists(),
    ).toBeTruthy();
  });

  it('checks if the staged model version links are rendered', () => {
    const wrapper = createComponentWrapper({});
    // Model #2 contains versions 2 and 3 in staging in production, but version 1 is not shown
    const row = getTableRowByCellText(wrapper, 'test_model_2');
    expect(row.find('a[href$="/models/test_model_2/versions/1"]').exists()).toBeFalsy();
    expect(row.find('a[href$="/models/test_model_2/versions/2"]').exists()).toBeTruthy();
    expect(row.find('a[href$="/models/test_model_2/versions/3"]').exists()).toBeTruthy();
  });

  it('checks if the tags are rendered correctly and are expanding', () => {
    const modelWithManyTags = {
      ...MODELS[0],
      // Create four tags for the model
      tags: [
        ...new Array(4).fill(0).map((_, index) => ({ key: `Tag ${index + 1}`, value: `Value ${index + 1}` })),
        { key: 'Empty tag', value: undefined },
      ],
    };
    const wrapper = createComponentWrapper({ modelsData: [modelWithManyTags as any] });
    const row = getTableRowByCellText(wrapper, MODELS[0].name);

    expect(row.text()).toContain('Tag 1: Value 1');
    expect(row.text()).toContain('Tag 2: Value 2');
    expect(row.text()).toContain('Tag 3: Value 3');
    expect(row.text()).not.toContain('Tag 4: Value 4');

    const moreButton = row.findWhere((e: any) => e.text() === '2 more').find('button');
    expect(moreButton.exists()).toBeTruthy();

    moreButton.simulate('click');
    wrapper.update();

    expect(row.text()).toContain('Tag 4: Value 4');
    expect(row.text()).toContain('Empty tag: (empty)');
    const lessButton = row.findWhere((e: any) => e.text() === 'Show less').find('button');
    lessButton.simulate('click');
    expect(row.text()).not.toContain('Tag 4: Value 4');
  });
  test('should display no results message when search results are empty', () => {
    const wrapper = createComponentWrapper({ modelsData: [], isFiltered: true });
    expect(wrapper.html()).toContain('No results. Try using a different keyword or adjusting your filters.');
  });

  test('should display error message on API errors', () => {
    const errMsg = 'TEMPORARILY_UNAVAILABLE: Backend unavailable';
    const wrapper = createComponentWrapper({ error: new Error(errMsg) });
    const wrapperHtml = wrapper.html();
    expect(wrapperHtml).toContain('Error fetching models');
    expect(wrapperHtml).toContain(errMsg);
  });

  test('should display aliases column instead of stage in new models UI', async () => {
    jest.mocked(shouldShowModelsNextUI).mockImplementation(() => true);
    const TestComponent = withNextModelsUIContext(() => (
      <MemoryRouter>
        <DesignSystemProvider>
          <ModelListTable {...minimalProps} />
          <ModelsNextUIToggleSwitch />
        </DesignSystemProvider>
      </MemoryRouter>
    ));
    renderWithIntl(<TestComponent />);

    // Assert stage columns being invisible and aliased versions column being present
    expect(screen.queryByRole('columnheader', { name: 'Staging' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Production' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Aliased versions' })).toBeInTheDocument();

    // Flip the "Next models UI" switch
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(screen.getByText('Disable'));

    // Assert stages column being visible and aliased versions column being absent
    expect(screen.queryByRole('columnheader', { name: 'Staging' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Production' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Aliases' })).not.toBeInTheDocument();
    jest.resetModules();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelListTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/model-list/ModelListTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  SearchIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Tooltip,
  Empty,
  PlusIcon,
  TableSkeletonRows,
  WarningIcon,
} from '@databricks/design-system';
import type { Interpolation, Theme } from '@emotion/react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from '../../../common/utils/RoutingUtils';
import { ModelListTagsCell, ModelListVersionLinkCell } from './ModelTableCellRenderers';
import { RegisteringModelDocUrl } from '../../../common/constants';
import Utils from '../../../common/utils/Utils';
import type { ModelEntity, ModelVersionInfoEntity } from '../../../experiment-tracking/types';
import type { KeyValueEntity } from '../../../common/types';
import { Stages } from '../../constants';
import { ModelRegistryRoutes } from '../../routes';
import { CreateModelButton } from '../CreateModelButton';
import { ModelsTableAliasedVersionsCell } from '../aliases/ModelsTableAliasedVersionsCell';
import { useNextModelsUIContext } from '../../hooks/useNextModelsUI';
import { ErrorWrapper } from '../../../common/utils/ErrorWrapper';

const getLatestVersionNumberByStage = (latestVersions: ModelVersionInfoEntity[], stage: string) => {
  const modelVersion = latestVersions && latestVersions.find((v) => v.current_stage === stage);
  return modelVersion && modelVersion.version;
};

enum ColumnKeys {
  NAME = 'name',
  LATEST_VERSION = 'latest_versions',
  LAST_MODIFIED = 'timestamp',
  CREATED_BY = 'user_id',
  STAGE_STAGING = 'stage_staging',
  STAGE_PRODUCTION = 'stage_production',
  TAGS = 'tags',
  ALIASED_VERSIONS = 'aliased_versions',
}

export interface ModelListTableProps {
  modelsData: ModelEntity[];
  pagination: React.ReactElement;
  orderByKey: string;
  orderByAsc: boolean;
  isLoading: boolean;
  error?: Error;
  isFiltered: boolean;
  onSortChange: (params: { orderByKey: string; orderByAsc: boolean }) => void;
}

type EnrichedModelEntity = ModelEntity;
type ModelsColumnDef = ColumnDef<EnrichedModelEntity> & {
  // Our experiments column definition houses style definitions in the metadata field
  meta?: { styles?: Interpolation<Theme> };
};

export const ModelListTable = ({
  modelsData,
  orderByAsc,
  orderByKey,
  onSortChange,
  isLoading,
  error,
  isFiltered,
  pagination,
}: ModelListTableProps) => {
  const intl = useIntl();

  const { usingNextModelsUI } = useNextModelsUIContext();

  const enrichedModelsData: EnrichedModelEntity[] = modelsData.map((model) => {
    return model;
  });

  const tableColumns = useMemo(() => {
    const columns: ModelsColumnDef[] = [
      {
        id: ColumnKeys.NAME,
        enableSorting: true,
        header: intl.formatMessage({
          defaultMessage: 'Name',
          description: 'Column title for model name in the registered model page',
        }),
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <Link to={ModelRegistryRoutes.getModelPageRoute(String(getValue()))}>
            <Tooltip componentId="mlflow.model-registry.model-list.model-name.tooltip" content={getValue()}>
              <span>{getValue()}</span>
            </Tooltip>
          </Link>
        ),
        meta: { styles: { minWidth: 200, flex: 1 } },
      },
      {
        id: ColumnKeys.LATEST_VERSION,
        enableSorting: false,

        header: intl.formatMessage({
          defaultMessage: 'Latest version',
          description: 'Column title for latest model version in the registered model page',
        }),
        accessorKey: 'latest_versions',
        cell: ({ getValue, row: { original } }) => {
          const { name } = original;
          const latestVersions = getValue() as ModelVersionInfoEntity[];
          const latestVersionNumber =
            (Boolean(latestVersions?.length) &&
              Math.max(...latestVersions.map((v) => parseInt(v.version, 10))).toString()) ||
            '';
          return <ModelListVersionLinkCell name={name} versionNumber={latestVersionNumber} />;
        },
        meta: { styles: { maxWidth: 120 } },
      },
    ];
    if (usingNextModelsUI) {
      // Display aliases column only when "new models UI" is flipped
      columns.push({
        id: ColumnKeys.ALIASED_VERSIONS,
        enableSorting: false,

        header: intl.formatMessage({
          defaultMessage: 'Aliased versions',
          description: 'Column title for aliased versions in the registered model page',
        }),
        cell: ({ row: { original: modelEntity } }) => {
          return <ModelsTableAliasedVersionsCell model={modelEntity} />;
        },
        meta: { styles: { minWidth: 150 } },
      });
    } else {
      // If not, display legacy "Stage" columns
      columns.push(
        {
          id: ColumnKeys.STAGE_STAGING,
          enableSorting: false,

          header: intl.formatMessage({
            defaultMessage: 'Staging',
            description: 'Column title for staging phase version in the registered model page',
          }),
          cell: ({ row: { original } }) => {
            const { latest_versions, name } = original;
            const versionNumber = getLatestVersionNumberByStage(latest_versions, Stages.STAGING);
            return <ModelListVersionLinkCell name={name} versionNumber={versionNumber} />;
          },
          meta: { styles: { maxWidth: 120 } },
        },
        {
          id: ColumnKeys.STAGE_PRODUCTION,
          enableSorting: false,

          header: intl.formatMessage({
            defaultMessage: 'Production',
            description: 'Column title for production phase version in the registered model page',
          }),
          cell: ({ row: { original } }) => {
            const { latest_versions, name } = original;
            const versionNumber = getLatestVersionNumberByStage(latest_versions, Stages.PRODUCTION);
            return <ModelListVersionLinkCell name={name} versionNumber={versionNumber} />;
          },
          meta: { styles: { maxWidth: 120 } },
        },
      );
    }

    columns.push(
      {
        id: ColumnKeys.CREATED_BY,
        header: intl.formatMessage({
          defaultMessage: 'Created by',
          description: 'Column title for created by column for a model in the registered model page',
        }),
        accessorKey: 'user_id',
        enableSorting: false,
        cell: ({ getValue, row: { original } }) => {
          return <span title={getValue() as string}>{getValue()}</span>;
        },
        meta: { styles: { flex: 1 } },
      },
      {
        id: ColumnKeys.LAST_MODIFIED,
        enableSorting: true,
        header: intl.formatMessage({
          defaultMessage: 'Last modified',
          description: 'Column title for last modified timestamp for a model in the registered model page',
        }),
        accessorKey: 'last_updated_timestamp',
        cell: ({ getValue }) => <span>{Utils.formatTimestamp(getValue(), intl)}</span>,
        meta: { styles: { flex: 1, maxWidth: 150 } },
      },
      {
        id: ColumnKeys.TAGS,
        header: intl.formatMessage({
          defaultMessage: 'Tags',
          description: 'Column title for model tags in the registered model page',
        }),
        enableSorting: false,
        accessorKey: 'tags',
        cell: ({ getValue }) => {
          return <ModelListTagsCell tags={getValue() as KeyValueEntity[]} />;
        },
      },
    );

    return columns;
  }, [intl, usingNextModelsUI]);

  const sorting: SortingState = [{ id: orderByKey, desc: !orderByAsc }];

  const setSorting = (stateUpdater: SortingState | ((state: SortingState) => SortingState)) => {
    const [newSortState] = typeof stateUpdater === 'function' ? stateUpdater(sorting) : stateUpdater;
    if (newSortState) {
      onSortChange({ orderByKey: newSortState.id, orderByAsc: !newSortState.desc });
    }
  };

  // eslint-disable-next-line prefer-const
  let registerModelDocUrl = RegisteringModelDocUrl;

  const noResultsDescription = (() => {
    return (
      <FormattedMessage
        defaultMessage="No results. Try using a different keyword or adjusting your filters."
        description="Models table > no results after filtering"
      />
    );
  })();
  const emptyComponent = error ? (
    <Empty
      image={<WarningIcon />}
      description={error instanceof ErrorWrapper ? error.getMessageField() : error.message}
      title={
        <FormattedMessage
          defaultMessage="Error fetching models"
          description="Workspace models page > Error empty state title"
        />
      }
    />
  ) : isFiltered ? (
    // Displayed when there is no results, but any filters have been applied
    <Empty description={noResultsDescription} image={<SearchIcon />} data-testid="model-list-no-results" />
  ) : (
    // Displayed when there is no results with no filters applied
    <Empty
      description={
        <FormattedMessage
          defaultMessage="No models registered yet. <link>Learn more about registering models</link>."
          description="Models table > no models present yet"
          values={{
            link: (content: any) => (
              <a target="_blank" rel="noopener noreferrer" href={registerModelDocUrl}>
                {content}
              </a>
            ),
          }}
        />
      }
      image={<PlusIcon />}
      button={
        <CreateModelButton
          buttonType="primary"
          buttonText={
            <FormattedMessage defaultMessage="Create a model" description="Create button to register a new model" />
          }
        />
      }
    />
  );

  const isEmpty = () => (!isLoading && table.getRowModel().rows.length === 0) || error;

  const table = useReactTable<EnrichedModelEntity>(
    'mlflow/server/js/src/model-registry/components/model-list/ModelListTable.tsx',
    {
      data: enrichedModelsData,
      columns: tableColumns,
      state: {
        sorting,
      },
      getCoreRowModel: getCoreRowModel(),
      getRowId: ({ id }) => id,
      onSortingChange: setSorting,
    },
  );

  return (
    <>
      <Table
        data-testid="model-list-table"
        pagination={pagination}
        scrollable
        empty={isEmpty() ? emptyComponent : undefined}
      >
        <TableRow isHeader>
          {table.getLeafHeaders().map((header) => (
            <TableHeader
              componentId="codegen_mlflow_app_src_model-registry_components_model-list_modellisttable.tsx_412"
              ellipsis
              key={header.id}
              sortable={header.column.getCanSort()}
              sortDirection={header.column.getIsSorted() || 'none'}
              onToggleSort={() => {
                const [currentSortColumn] = sorting;
                const changingDirection = header.column.id === currentSortColumn.id;
                const sortDesc = changingDirection ? !currentSortColumn.desc : false;
                header.column.toggleSorting(sortDesc);
              }}
              css={(header.column.columnDef as ModelsColumnDef).meta?.styles}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeader>
          ))}
        </TableRow>
        {isLoading ? (
          <TableSkeletonRows table={table} />
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell ellipsis key={cell.id} css={(cell.column.columnDef as ModelsColumnDef).meta?.styles}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </Table>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTableCellRenderers.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/model-list/ModelTableCellRenderers.tsx
Signals: React

```typescript
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../common/utils/RoutingUtils';
import { useState } from 'react';
import {
  Button,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  Tooltip,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { ModelRegistryRoutes } from '../../routes';
import type { KeyValueEntity } from '../../../common/types';
import { MLFLOW_INTERNAL_PREFIX } from '../../../common/utils/TagUtils';

const EmptyCell = () => <>&mdash;</>;

export const ModelListTagsCell = ({ tags }: { tags: KeyValueEntity[] }) => {
  const tagsToShowInitially = 3;
  const { theme } = useDesignSystemTheme();
  const [showMore, setShowMore] = useState(false);

  const validTags = tags?.filter((tag) => !tag.key.startsWith(MLFLOW_INTERNAL_PREFIX));

  const tagsToDisplay = validTags?.slice(0, showMore ? undefined : tagsToShowInitially);

  if (!validTags?.length) {
    return <EmptyCell />;
  }

  const noValue = (
    <em>
      <FormattedMessage description="Models table > tags column > no value" defaultMessage="(empty)" />
    </em>
  );

  return (
    <div>
      {tagsToDisplay.map((tag) => (
        <Tooltip
          componentId="mlflow.model-registry.model-list.model-tag.tooltip"
          key={tag.key}
          content={
            <>
              {tag.key}: {tag.value || noValue}
            </>
          }
          side="left"
        >
          <span
            key={tag.key}
            css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            data-testid="models-table-tag-entry"
          >
            <Typography.Text bold>{tag.key}</Typography.Text>: {tag.value || noValue}
          </span>
        </Tooltip>
      ))}
      {tags.length > tagsToShowInitially && (
        <Button
          componentId="codegen_mlflow_app_src_model-registry_components_model-list_modeltablecellrenderers.tsx_65"
          css={{ marginTop: theme.spacing.sm }}
          size="small"
          onClick={() => setShowMore(!showMore)}
          icon={showMore ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
          data-testid="models-table-show-more-tags"
        >
          {showMore ? (
            <FormattedMessage
              defaultMessage="Show less"
              description="Models table > tags column > show less toggle button"
            />
          ) : (
            <FormattedMessage
              defaultMessage="{value} more"
              description="Models table > tags column > show more toggle button"
              values={{ value: validTags.length - tagsToShowInitially }}
            />
          )}
        </Button>
      )}
    </div>
  );
};

/**
 * Renders model version with the link in the models table
 */
export const ModelListVersionLinkCell = ({ versionNumber, name }: { versionNumber?: string; name: string }) => {
  if (!versionNumber) {
    return <EmptyCell />;
  }
  return (
    <FormattedMessage
      defaultMessage="<link>Version {versionNumber}</link>"
      description="Row entry for version columns in the registered model page"
      values={{
        versionNumber,
        link: (text: any) => <Link to={ModelRegistryRoutes.getModelVersionPageRoute(name, versionNumber)}>{text}</Link>,
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: useNextModelsUI.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/hooks/useNextModelsUI.tsx
Signals: React

```typescript
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { shouldShowModelsNextUI } from '../../common/utils/FeatureUtils';

const useOldModelsUIStorageKey = '_mlflow_user_setting_dismiss_next_model_registry_ui';

const NextModelsUIContext = React.createContext<{
  usingNextModelsUI: boolean;
  setUsingNextModelsUI: (newValue: boolean) => void;
}>({
  usingNextModelsUI: shouldShowModelsNextUI(),
  setUsingNextModelsUI: () => {},
});

/**
 * Get
 */
export const useNextModelsUIContext = () => useContext(NextModelsUIContext);

/**
 * Wraps the component with tools allowing to get and change the current value of
 * "use next models UI" toggle flag. It will wrap the component with the relevant React Context
 * and in order to make it usable in class components, it also injects `usingNextModelsUI`
 * boolean prop with the current flag value. To easily access the context in the downstream
 * function components, use `useNextModelsUIContext()` hook.
 */
export const withNextModelsUIContext =
  <
    BaseProps,
    P extends JSX.IntrinsicAttributes &
      JSX.LibraryManagedAttributes<
        React.ComponentType<React.PropsWithChildren<BaseProps>>,
        React.PropsWithChildren<BaseProps>
      > & {
        usingNextModelsUI?: boolean;
      },
  >(
    Component: React.ComponentType<React.PropsWithChildren<BaseProps>>,
  ) =>
  (props: P) => {
    const [usingNextModelsUI, setUsingNextModelsUI] = useState(
      localStorage.getItem(useOldModelsUIStorageKey) !== 'true',
    );

    useEffect(() => {
      localStorage.setItem(useOldModelsUIStorageKey, (!usingNextModelsUI).toString());
    }, [usingNextModelsUI]);

    const contextValue = useMemo(() => ({ usingNextModelsUI, setUsingNextModelsUI }), [usingNextModelsUI]);

    if (!shouldShowModelsNextUI()) {
      return <Component {...props} usingNextModelsUI={false} />;
    }

    return (
      <NextModelsUIContext.Provider value={contextValue}>
        <Component {...props} usingNextModelsUI={contextValue.usingNextModelsUI} />
      </NextModelsUIContext.Provider>
    );
  };
```

--------------------------------------------------------------------------------

---[FILE: ModelRegistryMessages.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/sdk/ModelRegistryMessages.ts

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

/* eslint-disable */

/**
 * DO NOT EDIT!!!
 *
 * @NOTE(dli) 12-21-2016
 *   This file is generated. For now, it is a snapshot of the proto messages as of
 *   Jul 23, 2020 4:21:44 PM. We will update the generation pipeline to actually
 *   place these generated records in the correct location shortly.
 */

import Immutable from 'immutable';
import { RecordUtils } from '../../common/sdk/RecordUtils';
import { ModelBuilder } from '../../common/sdk/ModelBuilder';

export const RegisteredModelTag = Immutable.Record(
  {
    // optional STRING
    key: undefined,

    // optional STRING
    value: undefined,
  },
  'RegisteredModelTag',
);

/**
 * By default Immutable.fromJS will translate an object field in JSON into Immutable.Map.
 * This reviver allow us to keep the Immutable.Record type when serializing JSON message
 * into nested Immutable Record class.
 */
(RegisteredModelTag as any).fromJsReviver = function fromJsReviver(key: any, value: any) {
  switch (key) {
    default:
      return Immutable.fromJS(value);
  }
};

const extended_RegisteredModelTag = ModelBuilder.extend(RegisteredModelTag, {
  getKey() {
    return this.key !== undefined ? this.key : '';
  },
  getValue() {
    return this.value !== undefined ? this.value : '';
  },
});

/**
 * This is a customized fromJs function used to translate plain old Javascript
 * objects into this Immutable Record.  Example usage:
 *
 *   // The pojo is your javascript object
 *   const record = RegisteredModelTag.fromJs(pojo);
 */
(RegisteredModelTag as any).fromJs = function fromJs(pojo: any) {
  const pojoWithNestedImmutables = RecordUtils.fromJs(pojo, (RegisteredModelTag as any).fromJsReviver);
  // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
  return new extended_RegisteredModelTag(pojoWithNestedImmutables);
};

export const ModelVersionTag = Immutable.Record(
  {
    // optional STRING
    key: undefined,

    // optional STRING
    value: undefined,
  },
  'ModelVersionTag',
);

/**
 * By default Immutable.fromJS will translate an object field in JSON into Immutable.Map.
 * This reviver allow us to keep the Immutable.Record type when serializing JSON message
 * into nested Immutable Record class.
 */
(ModelVersionTag as any).fromJsReviver = function fromJsReviver(key: any, value: any) {
  switch (key) {
    default:
      return Immutable.fromJS(value);
  }
};

const extended_ModelVersionTag = ModelBuilder.extend(ModelVersionTag, {
  getKey() {
    return this.key !== undefined ? this.key : '';
  },
  getValue() {
    return this.value !== undefined ? this.value : '';
  },
});

/**
 * This is a customized fromJs function used to translate plain old Javascript
 * objects into this Immutable Record.  Example usage:
 *
 *   // The pojo is your javascript object
 *   const record = ModelVersionTag.fromJs(pojo);
 */
(ModelVersionTag as any).fromJs = function fromJs(pojo: any) {
  const pojoWithNestedImmutables = RecordUtils.fromJs(pojo, (ModelVersionTag as any).fromJsReviver);
  // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
  return new extended_ModelVersionTag(pojoWithNestedImmutables);
};
```

--------------------------------------------------------------------------------

---[FILE: model-schema.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/types/model-schema.ts

```typescript
export type DataType = 'binary' | 'datetime' | 'boolean' | 'double' | 'float' | 'integer' | 'long' | 'string';

export type ColumnType = ScalarType | ArrayType | ObjectType;
export type ScalarType = {
  type: DataType;
};
export type ArrayType = {
  type: 'array';
  items: ColumnType;
};
export type ObjectType = {
  type: 'object';
  properties: { [name: string]: ColumnType & { required?: boolean } };
};
export type ColumnSpec = ColumnType & {
  name: string;
  required?: boolean;
  optional?: boolean;
};

export type TensorSpec = {
  type: 'tensor';
  'tensor-spec': {
    dtype: string;
    shape: Array<number>;
  };
  required?: boolean;
  optional?: boolean;
};
```

--------------------------------------------------------------------------------

---[FILE: SearchUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/utils/SearchUtils.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { getModelNameFilter, getCombinedSearchFilter, constructSearchInputFromURLState } from './SearchUtils';

describe('getModelNameFilter', () => {
  it('should construct name filter correctly', () => {
    expect(getModelNameFilter('abc')).toBe("name ilike '%abc%'");
  });
});

describe('getCombinedSearchFilter', () => {
  it('should return filter string correctly with plain name strings', () => {
    expect(getCombinedSearchFilter({ query: 'xyz' })).toBe("name ilike '%xyz%'");
  });

  it('should return filter string correctly with MLflow Search Syntax string with tags.', () => {
    expect(getCombinedSearchFilter({ query: "tags.k = 'v'" })).toBe("tags.k = 'v'");
  });

  it('should return filter string correctly with MLflow Search Syntax string with tags. and name', () => {
    expect(getCombinedSearchFilter({ query: "name ilike '%abc%' AND tags.k = 'v'" })).toBe(
      "name ilike '%abc%' AND tags.k = 'v'",
    );
  });
});

describe('constructSearchInputFromURLState', () => {
  it('should construct searchInput correctly from URLState with nameSearchInput', () => {
    expect(constructSearchInputFromURLState({ nameSearchInput: 'xyz' })).toBe('xyz');
  });

  it('should construct searchInput correctly from URLState with tagSearchInput', () => {
    expect(constructSearchInputFromURLState({ tagSearchInput: "tags.k = 'v'" })).toBe("tags.k = 'v'");
  });

  it('should construct searchInput correctly from URLState with nameSearchInput and tagSearchInput', () => {
    expect(
      constructSearchInputFromURLState({
        nameSearchInput: 'xyz',
        tagSearchInput: "tags.k = 'v'",
      }),
    ).toBe("name ilike '%xyz%' AND tags.k = 'v'");
  });

  it('should construct searchInput correctly from URLState with searchInput', () => {
    expect(
      constructSearchInputFromURLState({
        searchInput: 'name ilike "%xyz%" AND tags.k = "v"',
      }),
    ).toBe('name ilike "%xyz%" AND tags.k = "v"');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: SearchUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/utils/SearchUtils.ts

```typescript
import { REGISTERED_MODELS_SEARCH_NAME_FIELD } from '../constants';
import { resolveFilterValue } from '../actions';

export function getModelNameFilter(query: string): string {
  if (query) {
    return `${REGISTERED_MODELS_SEARCH_NAME_FIELD} ilike ${resolveFilterValue(query, true)}`;
  } else {
    return '';
  }
}

export function getCombinedSearchFilter({
  query = '',
}: {
  query?: string;
} = {}) {
  const filters = [];
  const initialFilter = query.includes('tags.') ? query : getModelNameFilter(query);
  if (initialFilter) filters.push(initialFilter);
  return filters.join(' AND ');
}

export function constructSearchInputFromURLState(urlState: Record<string, string>): string {
  if ('searchInput' in urlState) {
    return urlState['searchInput'];
  }
  if ('nameSearchInput' in urlState && 'tagSearchInput' in urlState) {
    return getModelNameFilter(urlState['nameSearchInput']) + ` AND ` + urlState['tagSearchInput'];
  }
  if ('tagSearchInput' in urlState) {
    return urlState['tagSearchInput'];
  }
  if ('nameSearchInput' in urlState) {
    return urlState['nameSearchInput'];
  }
  return '';
}
```

--------------------------------------------------------------------------------

---[FILE: VersionUtils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/utils/VersionUtils.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';
import { extractArtifactPathFromModelSource } from './VersionUtils';

describe('extractArtifactPathFromModelSource', () => {
  it('test extractArtifactPathFromModelSource', () => {
    expect(extractArtifactPathFromModelSource('mlflow-artifacts:/0/01bcd/artifacts/xx/yy', '01bcd')).toBe('xx/yy');
    expect(extractArtifactPathFromModelSource('mlflow-artifacts:/0/01bcd/artifacts/artifacts/xx/yy', '01bcd')).toBe(
      'artifacts/xx/yy',
    );
    expect(extractArtifactPathFromModelSource('mlflow-artifacts:/0/01bcd/artifacts/xx/yy', '01bce')).toBe(undefined);
    expect(extractArtifactPathFromModelSource('file///path/to/mlruns/0/01bcd/artifacts/xx/yy', '01bcd')).toBe('xx/yy');
    expect(extractArtifactPathFromModelSource('file///path/to/artifacts/mlruns/0/01bcd/artifacts/xx/yy', '01bcd')).toBe(
      'xx/yy',
    );
    expect(extractArtifactPathFromModelSource('file///path/to/mlruns/0/01bcd/artifacts/artifacts/xx/yy', '01bcd')).toBe(
      'artifacts/xx/yy',
    );
    expect(extractArtifactPathFromModelSource('file///path/to/mlruns/0/01bcd/artifacts/xx/yy', '01bce')).toBe(
      undefined,
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: VersionUtils.ts]---
Location: mlflow-master/mlflow/server/js/src/model-registry/utils/VersionUtils.ts

```typescript
/**
 * Extract artifact path from provided `modelSource` string
 */
export function extractArtifactPathFromModelSource(modelSource: string, runId: string) {
  return modelSource.match(new RegExp(`/${runId}/artifacts/(.+)`))?.[1];
}
```

--------------------------------------------------------------------------------

---[FILE: SettingsPage.tsx]---
Location: mlflow-master/mlflow/server/js/src/settings/SettingsPage.tsx
Signals: React

```typescript
import { Switch, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from '@databricks/i18n';
import { useLocalStorage } from '../shared/web-shared/hooks';
import { TELEMETRY_ENABLED_STORAGE_KEY, TELEMETRY_ENABLED_STORAGE_VERSION } from '../telemetry/utils';
import { telemetryClient } from '../telemetry';
import { useCallback } from 'react';

const SettingsPage = () => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const [isTelemetryEnabled, setIsTelemetryEnabled] = useLocalStorage({
    key: TELEMETRY_ENABLED_STORAGE_KEY,
    version: TELEMETRY_ENABLED_STORAGE_VERSION,
    initialValue: true,
  });

  const handleTelemetryToggle = useCallback(
    (checked: boolean) => {
      setIsTelemetryEnabled(checked);
      if (checked) {
        telemetryClient.start();
      } else {
        telemetryClient.shutdown();
      }
    },
    [setIsTelemetryEnabled],
  );

  return (
    <div css={{ padding: theme.spacing.md }}>
      <Typography.Title level={2}>
        <FormattedMessage defaultMessage="Settings" description="Settings page title" />
      </Typography.Title>

      <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 600 }}>
        <div css={{ display: 'flex', flexDirection: 'column', marginRight: theme.spacing.lg }}>
          <Typography.Title level={4}>
            <FormattedMessage defaultMessage="Enable telemetry" description="Enable telemetry settings title" />
          </Typography.Title>
          <Typography.Text>
            <FormattedMessage
              defaultMessage="This setting enables UI telemetry data collection. Learn more about what types of data are collected in our {documentation}."
              description="Enable telemetry settings description"
              values={{
                documentation: (
                  <Typography.Link
                    componentId="mlflow.settings.telemetry.documentation-link"
                    href="https://mlflow.org/docs/latest/community/usage-tracking.html"
                    openInNewTab
                  >
                    <FormattedMessage defaultMessage="documentation" description="Documentation link text" />
                  </Typography.Link>
                ),
              }}
            />
          </Typography.Text>
        </div>
        <Switch
          componentId="mlflow.settings.telemetry.toggle-switch"
          checked={isTelemetryEnabled}
          onChange={handleTelemetryToggle}
          label=" "
          activeLabel={intl.formatMessage({ defaultMessage: 'On', description: 'Telemetry enabled label' })}
          inactiveLabel={intl.formatMessage({ defaultMessage: 'Off', description: 'Telemetry disabled label' })}
          disabledLabel=" "
        />
      </div>
    </div>
  );
};

export default SettingsPage;
```

--------------------------------------------------------------------------------

---[FILE: CopyBox.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/CopyBox.test.tsx
Signals: React

```typescript
import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { CopyBox } from './CopyBox';
import { DesignSystemProvider } from '@databricks/design-system';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

describe('CopyBox', () => {
  it('should render with minimal props without exploding', () => {
    renderWithIntl(
      <DesignSystemProvider>
        <CopyBox copyText="copy text" />
      </DesignSystemProvider>,
    );
    const input = screen.getByTestId('copy-box');
    expect(input).toHaveValue('copy text');
    expect(input).toHaveAttribute('readOnly');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CopyBox.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/CopyBox.tsx

```typescript
import { Input } from '@databricks/design-system';
import { CopyButton } from './CopyButton';

type Props = {
  copyText: string;
};

export const CopyBox = ({ copyText }: Props) => (
  <div css={{ display: 'flex', gap: 4 }}>
    <Input
      componentId="codegen_mlflow_app_src_shared_building_blocks_copybox.tsx_18"
      readOnly
      value={copyText}
      data-testid="copy-box"
    />
    <CopyButton copyText={copyText} />
  </div>
);
```

--------------------------------------------------------------------------------

````

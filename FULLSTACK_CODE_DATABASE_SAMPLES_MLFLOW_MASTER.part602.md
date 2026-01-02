---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 602
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 602 of 991)

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

---[FILE: ModelVersionTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelVersionTable.tsx
Signals: React, Redux/RTK

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  Empty,
  PlusIcon,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableRowSelectCell,
  Tooltip,
  Typography,
  useDesignSystemTheme,
  TableSkeletonRows,
} from '@databricks/design-system';
import type { ColumnDef, RowSelectionState, SortingState, ColumnSort } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import type { ModelEntity, ModelVersionInfoEntity, ModelAliasMap } from '../../experiment-tracking/types';
import type { KeyValueEntity } from '../../common/types';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RegisteringModelDocUrl } from '../../common/constants';
import {
  ACTIVE_STAGES,
  ModelVersionStatusIcons,
  StageTagComponents,
  mlflowAliasesLearnMoreLink,
  modelVersionStatusIconTooltips,
} from '../constants';
import { Link } from '../../common/utils/RoutingUtils';
import { ModelRegistryRoutes } from '../routes';
import Utils from '../../common/utils/Utils';
import { KeyValueTagsEditorCell } from '../../common/components/KeyValueTagsEditorCell';
import { useDispatch } from 'react-redux';
import type { ThunkDispatch } from '../../redux-types';
import { useEditKeyValueTagsModal } from '../../common/hooks/useEditKeyValueTagsModal';
import { useEditAliasesModal } from '../../common/hooks/useEditAliasesModal';
import { updateModelVersionTagsApi } from '../actions';
import { ModelVersionTableAliasesCell } from './aliases/ModelVersionTableAliasesCell';
import type { Interpolation, Theme } from '@emotion/react';
import { truncateToFirstLineWithMaxLength } from '../../common/utils/StringUtils';
import { setModelVersionAliasesApi } from '../actions';

type ModelVersionTableProps = {
  isLoading: boolean;
  modelName: string;
  pagination: React.ReactElement;
  orderByKey: string;
  orderByAsc: boolean;
  modelVersions?: ModelVersionInfoEntity[];
  activeStageOnly?: boolean;
  onChange: (selectedRowKeys: string[], selectedRows: ModelVersionInfoEntity[]) => void;
  getSortFieldName: (columnId: string) => string | null;
  onSortChange: (params: { sorter: ColumnSort }) => void;
  modelEntity?: ModelEntity;
  onMetadataUpdated: () => void;
  usingNextModelsUI: boolean;
  aliases?: ModelAliasMap;
};

type ModelVersionColumnDef = ColumnDef<ModelVersionInfoEntity> & {
  meta?: { styles?: Interpolation<Theme>; multiline?: boolean; className?: string };
};

enum COLUMN_IDS {
  STATUS = 'status',
  VERSION = 'version',
  CREATION_TIMESTAMP = 'creation_timestamp',
  USER_ID = 'user_id',
  TAGS = 'tags',
  STAGE = 'current_stage',
  DESCRIPTION = 'description',
  ALIASES = 'aliases',
}

const getAliasesModalTitle = (version: string) => (
  <FormattedMessage
    defaultMessage="Add/Edit alias for model version {version}"
    description="Model registry > model version alias editor > Title of the update alias modal"
    values={{ version }}
  />
);

export const ModelVersionTable = ({
  modelName,
  modelVersions,
  activeStageOnly,
  orderByAsc,
  orderByKey,
  onSortChange,
  onChange,
  getSortFieldName,
  modelEntity,
  onMetadataUpdated,
  usingNextModelsUI,
  aliases,
  pagination,
  isLoading,
}: ModelVersionTableProps) => {
  const aliasesByVersion = useMemo(() => {
    const result: Record<string, string[]> = {};
    aliases?.forEach(({ alias, version }) => {
      if (!result[version]) {
        result[version] = [];
      }
      result[version].push(alias);
    });
    return result;
  }, [aliases]);
  const versions = useMemo(
    () =>
      activeStageOnly
        ? (modelVersions || []).filter(({ current_stage }) => ACTIVE_STAGES.includes(current_stage))
        : modelVersions,
    [activeStageOnly, modelVersions],
  );

  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  const allTagsKeys = useMemo(() => {
    const allTagsList: KeyValueEntity[] = versions?.map((modelVersion) => modelVersion?.tags || []).flat() || [];

    // Extract keys, remove duplicates and sort the
    return Array.from(new Set(allTagsList.map(({ key }) => key))).sort();
  }, [versions]);

  const dispatch = useDispatch<ThunkDispatch>();

  const { EditTagsModal, showEditTagsModal } = useEditKeyValueTagsModal<ModelVersionInfoEntity>({
    allAvailableTags: allTagsKeys,
    saveTagsHandler: async (modelVersion, existingTags, newTags) =>
      dispatch(updateModelVersionTagsApi(modelVersion, existingTags, newTags)),
    onSuccess: onMetadataUpdated,
  });

  const { EditAliasesModal, showEditAliasesModal } = useEditAliasesModal({
    aliases: modelEntity?.aliases ?? [],
    onSuccess: onMetadataUpdated,
    onSave: async (currentlyEditedVersion: string, existingAliases: string[], draftAliases: string[]) =>
      dispatch(setModelVersionAliasesApi(modelName, currentlyEditedVersion, existingAliases, draftAliases)),
    getTitle: getAliasesModalTitle,
    description: (
      <FormattedMessage
        defaultMessage="Aliases allow you to assign a mutable, named reference to a particular model version. <link>Learn more</link>"
        description="Explanation of registered model aliases"
        values={{
          link: (chunks) => (
            <a href={mlflowAliasesLearnMoreLink} rel="noreferrer" target="_blank">
              {chunks}
            </a>
          ),
        }}
      />
    ),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    const selectedVersions = (versions || []).filter(({ version }) => rowSelection[version]);
    const selectedVersionNumbers = selectedVersions.map(({ version }) => version);
    onChange(selectedVersionNumbers, selectedVersions);
  }, [rowSelection, onChange, versions]);

  const tableColumns = useMemo(() => {
    const columns: ModelVersionColumnDef[] = [
      {
        id: COLUMN_IDS.STATUS,
        enableSorting: false,
        header: '', // Status column does not have title
        meta: { styles: { flexBasis: theme.general.heightSm, flexGrow: 0 } },
        cell: ({ row: { original } }) => {
          const { status, status_message } = original || {};
          return (
            <Tooltip
              componentId="mlflow.model-registry.model-view.model-versions.version-status.tooltip"
              content={status_message || modelVersionStatusIconTooltips[status]}
            >
              <span>
                <Typography.Text>{ModelVersionStatusIcons[status]}</Typography.Text>
              </span>
            </Tooltip>
          );
        },
      },
    ];
    columns.push(
      {
        id: COLUMN_IDS.VERSION,
        enableSorting: false,
        header: intl.formatMessage({
          defaultMessage: 'Version',
          description: 'Column title text for model version in model version table',
        }),
        meta: { className: 'model-version' },
        accessorKey: 'version',
        cell: ({ getValue }) => (
          <FormattedMessage
            defaultMessage="<link>Version {versionNumber}</link>"
            description="Link to model version in the model version table"
            values={{
              link: (chunks) => (
                <Link to={ModelRegistryRoutes.getModelVersionPageRoute(modelName, String(getValue()))}>{chunks}</Link>
              ),
              versionNumber: getValue(),
            }}
          />
        ),
      },
      {
        id: COLUMN_IDS.CREATION_TIMESTAMP,
        enableSorting: true,
        meta: { styles: { minWidth: 200 } },
        header: intl.formatMessage({
          defaultMessage: 'Registered at',
          description: 'Column title text for created at timestamp in model version table',
        }),
        accessorKey: 'creation_timestamp',
        cell: ({ getValue }) => Utils.formatTimestamp(getValue(), intl),
      },

      {
        id: COLUMN_IDS.USER_ID,
        enableSorting: false,
        meta: { styles: { minWidth: 100 } },
        header: intl.formatMessage({
          defaultMessage: 'Created by',
          description: 'Column title text for creator username in model version table',
        }),
        accessorKey: 'user_id',
        cell: ({ getValue }) => <span>{getValue()}</span>,
      },
    );

    if (usingNextModelsUI) {
      // Display tags and aliases columns only when "new models UI" is flipped
      columns.push(
        {
          id: COLUMN_IDS.TAGS,
          enableSorting: false,
          header: intl.formatMessage({
            defaultMessage: 'Tags',
            description: 'Column title text for model version tags in model version table',
          }),
          meta: { styles: { flex: 2 } },
          accessorKey: 'tags',
          cell: ({ getValue, row: { original } }) => {
            return (
              <KeyValueTagsEditorCell
                tags={getValue() as KeyValueEntity[]}
                onAddEdit={() => {
                  showEditTagsModal?.(original);
                }}
              />
            );
          },
        },
        {
          id: COLUMN_IDS.ALIASES,
          accessorKey: 'aliases',
          enableSorting: false,
          header: intl.formatMessage({
            defaultMessage: 'Aliases',
            description: 'Column title text for model version aliases in model version table',
          }),
          meta: { styles: { flex: 2 }, multiline: true },
          cell: ({ getValue, row: { original } }) => {
            const mvAliases = aliasesByVersion[original.version] || [];
            return (
              <ModelVersionTableAliasesCell
                modelName={modelName}
                version={original.version}
                aliases={mvAliases}
                onAddEdit={() => {
                  showEditAliasesModal?.(original.version);
                }}
              />
            );
          },
        },
      );
    } else {
      // If not, display legacy "Stage" columns
      columns.push({
        id: COLUMN_IDS.STAGE,
        enableSorting: false,
        header: intl.formatMessage({
          defaultMessage: 'Stage',
          description: 'Column title text for model version stage in model version table',
        }),
        accessorKey: 'current_stage',
        cell: ({ getValue }) => {
          return StageTagComponents[getValue() as string];
        },
      });
    }
    columns.push({
      id: COLUMN_IDS.DESCRIPTION,
      enableSorting: false,
      header: intl.formatMessage({
        defaultMessage: 'Description',
        description: 'Column title text for description in model version table',
      }),
      meta: { styles: { flex: 2 } },
      accessorKey: 'description',
      cell: ({ getValue }) => truncateToFirstLineWithMaxLength(getValue() as string, 32),
    });
    return columns;
  }, [theme, intl, modelName, showEditTagsModal, showEditAliasesModal, usingNextModelsUI, aliasesByVersion]);

  const sorting: SortingState = [{ id: orderByKey, desc: !orderByAsc }];

  const setSorting = (stateUpdater: SortingState | ((state: SortingState) => SortingState)) => {
    const [newSortState] = typeof stateUpdater === 'function' ? stateUpdater(sorting) : stateUpdater;
    if (newSortState) {
      onSortChange({ sorter: newSortState });
    }
  };

  const table = useReactTable<ModelVersionInfoEntity>(
    'mlflow/server/js/src/model-registry/components/ModelVersionTable.tsx',
    {
      data: versions || [],
      columns: tableColumns,
      state: {
        rowSelection,
        sorting,
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getRowId: ({ version }) => version,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
    },
  );

  const isEmpty = () => table.getRowModel().rows.length === 0;

  const getLearnMoreLinkUrl = () => {
    return RegisteringModelDocUrl;
  };

  const emptyComponent = (
    <Empty
      description={
        <FormattedMessage
          defaultMessage="No models versions are registered yet. <link>Learn more</link> about how to
          register a model version."
          description="Message text when no model versions are registered"
          values={{
            link: (chunks) => (
              <Typography.Link
                componentId="codegen_mlflow_app_src_model-registry_components_modelversiontable.tsx_425"
                target="_blank"
                href={getLearnMoreLinkUrl()}
              >
                {chunks}
              </Typography.Link>
            ),
          }}
        />
      }
      image={<PlusIcon />}
    />
  );
  return (
    <>
      <Table
        data-testid="model-version-table"
        pagination={pagination}
        scrollable
        empty={isEmpty() ? emptyComponent : undefined}
        someRowsSelected={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
      >
        <TableRow isHeader>
          <TableRowSelectCell
            componentId="codegen_mlflow_app_src_model-registry_components_modelversiontable.tsx_450"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
          {table.getLeafHeaders().map((header) => (
            <TableHeader
              componentId="codegen_mlflow_app_src_model-registry_components_modelversiontable.tsx_458"
              multiline={false}
              key={header.id}
              sortable={header.column.getCanSort()}
              sortDirection={header.column.getIsSorted() || 'none'}
              onToggleSort={() => {
                const [currentSortColumn] = sorting;
                const changingDirection = header.column.id === currentSortColumn.id;
                const sortDesc = changingDirection ? !currentSortColumn.desc : false;
                header.column.toggleSorting(sortDesc);
              }}
              css={(header.column.columnDef as ModelVersionColumnDef).meta?.styles}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeader>
          ))}
        </TableRow>
        {isLoading ? (
          <TableSkeletonRows table={table} />
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              css={{
                '.table-row-select-cell': {
                  alignItems: 'flex-start',
                },
              }}
            >
              <TableRowSelectCell
                componentId="codegen_mlflow_app_src_model-registry_components_modelversiontable.tsx_477"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
              {row.getAllCells().map((cell) => (
                <TableCell
                  className={(cell.column.columnDef as ModelVersionColumnDef).meta?.className}
                  multiline={(cell.column.columnDef as ModelVersionColumnDef).meta?.multiline}
                  key={cell.id}
                  css={(cell.column.columnDef as ModelVersionColumnDef).meta?.styles}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </Table>
      {EditTagsModal}
      {EditAliasesModal}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionView.css]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelVersionView.css

```text
/* >>> Extract to our own Alert wrapper component */
.mlflow-status-alert {
  margin-bottom: 16px;
  border-radius: 2px;
}

.mlflow-status-alert .model-version-status-icon {
  margin-left: -3px;
}

.mlflow-status-alert.mlflow-status-alert-info {
  border-left: 2px solid #3895d3;
}

.mlflow-status-alert.mlflow-status-alert-error {
  border-left: 2px solid red;
}

.mlflow-version-follow-icon {
  margin-left: auto;
}

.ant-popover-content {
  max-width: 500px;
}
/* <<< Extract to our own Alert wrapper component */
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionView.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/ModelVersionView.enzyme.test.tsx
Signals: React, Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import React from 'react';
import { ModelVersionView, ModelVersionViewImpl } from './ModelVersionView';
import { mockModelVersionDetailed } from '../test-utils';
import { Stages, ModelVersionStatus, ACTIVE_STAGES } from '../constants';
import { MemoryRouter } from '../../common/utils/RoutingUtils';
import Utils from '../../common/utils/Utils';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { ModelVersionTag } from '../sdk/ModelRegistryMessages';
import { Provider } from 'react-redux';
import { mockRunInfo } from '../../experiment-tracking/utils/test-utils/ReduxStoreFixtures';
import TrackingRouters from '../../experiment-tracking/routes';
import { ModelRegistryRoutes } from '../routes';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import { DesignSystemContainer } from '../../common/components/DesignSystemContainer';
import { Services } from '../services';
import { shouldShowModelsNextUI } from '../../common/utils/FeatureUtils';

jest.spyOn(Services, 'searchRegisteredModels').mockResolvedValue({});
jest.mock('../../common/utils/FeatureUtils', () => ({
  ...jest.requireActual<typeof import('../../common/utils/FeatureUtils')>('../../common/utils/FeatureUtils'),
  shouldShowModelsNextUI: jest.fn(),
}));
describe('ModelVersionView', () => {
  let wrapper;
  let minimalProps: any;
  let minimalStoreRaw;
  let minimalStore: any;
  let createComponentInstance: any;
  const mockStore = configureStore([thunk, promiseMiddleware()]);
  beforeEach(() => {
    minimalProps = {
      modelName: 'Model A',
      modelVersion: mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY),
      handleStageTransitionDropdownSelect: jest.fn(),
      deleteModelVersionApi: jest.fn(() => Promise.resolve()),
      handleEditDescription: jest.fn(() => Promise.resolve()),
      setModelVersionTagApi: jest.fn(),
      deleteModelVersionTagApi: jest.fn(),
      tags: {},
      schema: {
        inputs: [],
        outputs: [],
      },
    };
    minimalStoreRaw = {
      entities: {
        tagsByModelVersion: {
          'Model A': {
            1: {
              'special key': (ModelVersionTag as any).fromJs({
                key: 'special key',
                value: 'not so special value',
              }),
            },
          },
        },
      },
      apis: {},
    };
    minimalStore = mockStore(minimalStoreRaw);
    createComponentInstance = (props: any) =>
      mountWithIntl(
        <DesignSystemContainer>
          <Provider store={minimalStore}>
            <MemoryRouter>
              <ModelVersionView {...props} />
            </MemoryRouter>
          </Provider>
        </DesignSystemContainer>,
      );
  });
  test('should render with minimal props without exploding', () => {
    wrapper = createComponentInstance(minimalProps);
    expect(wrapper.length).toBe(1);
  });
  test('should render delete dropdown item when model version is ready', () => {
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailed('Model A', 1, Stages.NONE, ModelVersionStatus.READY),
    };
    wrapper = createComponentInstance(props);
    expect(wrapper.find('button[data-testid="overflow-menu-trigger"]').length).toBe(1);
  });
  test('should disable dropdown delete menu item when model version is in active stage', () => {
    let i;
    for (i = 0; i < ACTIVE_STAGES.length; ++i) {
      const props = {
        ...minimalProps,
        modelVersion: mockModelVersionDetailed('Model A', 1, ACTIVE_STAGES[i], ModelVersionStatus.READY),
      };
      wrapper = createComponentInstance(props);
      wrapper.find("button[data-testid='overflow-menu-trigger']").simulate('click');
      // The antd `Menu.Item` component converts the `disabled` attribute to `aria-disabled`
      // when generating HTML. Accordingly, we check for the presence of the `aria-disabled`
      // attribute within the rendered HTML.
      const deleteMenuItem = wrapper.find('[data-testid="delete"]').hostNodes();
      expect(deleteMenuItem.prop('aria-disabled')).toBe(true);
      deleteMenuItem.simulate('click');
      expect(wrapper.find(ModelVersionViewImpl).instance().state.isDeleteModalVisible).toBe(false);
    }
  });
  test('should enable dropdown delete menu item when model version is in active stage', () => {
    const inactiveStages = [Stages.NONE, Stages.ARCHIVED];
    let i;
    for (i = 0; i < inactiveStages.length; ++i) {
      const props = {
        ...minimalProps,
        modelVersion: mockModelVersionDetailed('Model A', 1, inactiveStages[i], ModelVersionStatus.READY),
      };
      wrapper = createComponentInstance(props);
      wrapper.find('button[data-testid="overflow-menu-trigger"]').at(0).simulate('click');
      // The antd `Menu.Item` component converts the `disabled` attribute to `aria-disabled`
      // when generating HTML. Accordingly, we check for the presence of the `aria-disabled`
      // attribute within the rendered HTML.
      const deleteMenuItem = wrapper.find('[data-testid="delete"]').hostNodes();
      expect(deleteMenuItem.prop('aria-disabled')).toBeFalsy();
      deleteMenuItem.simulate('click');
      expect(wrapper.find(ModelVersionViewImpl).instance().state.isDeleteModalVisible).toBe(true);
    }
  });
  test('run link renders if set', () => {
    const runLink =
      'https://other.mlflow.hosted.instance.com/experiments/18722387/runs/d2c09dbd056c4d9c9289b854f491be10';
    const modelVersion = mockModelVersionDetailed(
      'Model A',
      1,
      Stages.NONE,
      ModelVersionStatus.READY,
      [],
      // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      runLink,
    );
    const runId = 'somerunid';
    const experimentId = 'experiment_id';
    // @ts-expect-error TS(2345): Argument of type '"experiment_id"' is not assignab... Remove this comment to see the full error message
    const runInfo = mockRunInfo(runId, experimentId);
    const expectedRunDisplayName = Utils.getRunDisplayName({}, runId);
    const props = {
      ...minimalProps,
      modelVersion: modelVersion,
      runInfo: runInfo,
      runDisplayName: expectedRunDisplayName,
    };
    wrapper = createComponentInstance(props);
    const linkedRun = wrapper.find('.linked-run').at(0); // TODO: Figure out why it returns 2.
    expect(linkedRun.html()).toContain(runLink);
    expect(linkedRun.html()).toContain(runLink.substr(0, 37) + '...');
  });
  test('run name and link render if runinfo provided', () => {
    const runId = 'somerunid';
    const experimentId = 'experiment_id';
    // @ts-expect-error TS(2345): Argument of type '"experiment_id"' is not assignab... Remove this comment to see the full error message
    const runInfo = mockRunInfo(runId, experimentId);
    const expectedRunLink = TrackingRouters.getRunPageRoute(experimentId, runId);
    const expectedRunDisplayName = Utils.getRunDisplayName({}, runId);
    const props = {
      ...minimalProps,
      runInfo: runInfo,
      runDisplayName: expectedRunDisplayName,
    };
    wrapper = createComponentInstance(props);
    const linkedRun = wrapper.find('.linked-run').at(0); // TODO: Figure out why it returns 2.
    expect(linkedRun.html()).toContain(expectedRunLink);
    expect(linkedRun.html()).toContain(expectedRunDisplayName);
  });
  test('Page title is set', () => {
    const mockUpdatePageTitle = jest.fn();
    Utils.updatePageTitle = mockUpdatePageTitle;
    wrapper = createComponentInstance(minimalProps);
    expect(mockUpdatePageTitle.mock.calls[0][0]).toBe('Model A v1 - MLflow Model');
  });
  test('should tags rendered in the UI', () => {
    wrapper = createComponentInstance(minimalProps);
    expect(wrapper.html()).toContain('special key');
    expect(wrapper.html()).toContain('not so special value');
  });
  test('creator description not rendered if user_id is unavailable', () => {
    jest.mocked(shouldShowModelsNextUI).mockImplementation(() => false);
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailed(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.READY,
        [],
        // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
        null,
        'b99a0fc567ae4d32994392c800c0b6ce',
        null,
      ),
    };
    wrapper = createComponentInstance(props);
    expect(wrapper.find('[data-testid="descriptions-item"]').length).toBe(4);
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(0).text()).toBe('Registered At');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(1).text()).toBe('Last Modified');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(2).text()).toBe('Source Run');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(3).text()).toBe('Stage');
  });
  test('creator description rendered if user_id is available', () => {
    jest.mocked(shouldShowModelsNextUI).mockImplementation(() => false);
    wrapper = createComponentInstance(minimalProps);
    expect(wrapper.find('[data-testid="descriptions-item"]').length).toBe(5);
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(0).text()).toBe('Registered At');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(1).text()).toBe('Creator');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(2).text()).toBe('Last Modified');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(3).text()).toBe('Source Run');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(4).text()).toBe('Stage');
  });
  test('should render copied from link when model version is a copy', () => {
    jest.mocked(shouldShowModelsNextUI).mockImplementation(() => true);
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailed(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.READY,
        [],
        undefined,
        'b99a0fc567ae4d32994392c800c0b6ce',
        'richard@example.com',
        'models:/Model B/2',
      ),
    };
    wrapper = createComponentInstance(props);
    expect(wrapper.find('[data-testid="descriptions-item"]').length).toBe(7);
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(0).text()).toBe('Registered At');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(1).text()).toBe('Creator');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(2).text()).toBe('Last Modified');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(3).text()).toBe('Source Run');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(4).text()).toBe('Copied from');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(5).text()).toBe('Aliases');
    expect(wrapper.find('[data-testid="descriptions-item-label"]').at(6).text()).toBe('Stage (deprecated)');
    const linkedRun = wrapper.find('[data-testid="copied-from-link"]').at(0);
    expect(linkedRun.html()).toContain(ModelRegistryRoutes.getModelVersionPageRoute('Model B', '2'));
  });
});
```

--------------------------------------------------------------------------------

````

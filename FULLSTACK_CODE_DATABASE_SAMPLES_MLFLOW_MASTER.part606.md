---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 606
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 606 of 991)

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

---[FILE: SchemaTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/SchemaTable.tsx
Signals: React

```typescript
import React, { useMemo, useState } from 'react';
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  useDesignSystemTheme,
  MinusSquareIcon,
  PlusSquareIcon,
  Input,
  Spacer,
} from '@databricks/design-system';
import { LogModelWithSignatureUrl } from '../../common/constants';
import type { ColumnSpec, TensorSpec, ColumnType } from '../types/model-schema';
import { FormattedMessage, useIntl } from 'react-intl';
import { Interpolation, Theme } from '@emotion/react';
import { identity, isEmpty, isFunction } from 'lodash';
import { useSafeDeferredValue } from '../../common/hooks/useSafeDeferredValue';

const { Text } = Typography;
const INDENTATION_SPACES = 2;
const LIMIT_VISIBLE_COLUMNS = 100;

type Props = {
  schema?: any;
  defaultExpandAllRows?: boolean;
};

function getTensorTypeRepr(tensorType: TensorSpec): string {
  return `Tensor (dtype: ${tensorType['tensor-spec'].dtype}, shape: [${tensorType['tensor-spec'].shape}])`;
}

// return a formatted string representation of the column type
function getColumnTypeRepr(columnType: ColumnType, indentationLevel: number): string {
  const { type } = columnType;

  const indentation = ' '.repeat(indentationLevel * INDENTATION_SPACES);
  if (type === 'object') {
    const propertyReprs = Object.keys(columnType.properties).map((propertyName) => {
      const property = columnType.properties[propertyName];
      const requiredRepr = property.required ? '' : ' (optional)';
      const propertyRepr = getColumnTypeRepr(property, indentationLevel + 1);
      const indentOffset = (indentationLevel + 1) * INDENTATION_SPACES;

      return `${' '.repeat(indentOffset)}${propertyName}: ${propertyRepr.slice(indentOffset) + requiredRepr}`;
    });

    return `${indentation}{\n${propertyReprs.join(',\n')}\n${indentation}}`;
  }

  if (type === 'array') {
    const indentOffset = indentationLevel * INDENTATION_SPACES;
    const itemsTypeRepr = getColumnTypeRepr(columnType.items, indentationLevel).slice(indentOffset);
    return `${indentation}Array(${itemsTypeRepr})`;
  }

  return `${indentation}${type}`;
}

function ColumnName({ spec }: { spec: ColumnSpec | TensorSpec }): React.ReactElement {
  let required = true;
  if (spec.required !== undefined) {
    ({ required } = spec);
  } else if (spec.optional !== undefined && spec.optional) {
    required = false;
  }
  const requiredTag = required ? <Text bold>(required)</Text> : <Text color="secondary">(optional)</Text>;

  const name = 'name' in spec ? spec.name : '-';

  return (
    <Text css={{ marginLeft: 32 }}>
      {name} {requiredTag}
    </Text>
  );
}

function ColumnSchema({ spec }: { spec: ColumnSpec | TensorSpec }): React.ReactElement {
  const { theme } = useDesignSystemTheme();
  const repr = spec.type === 'tensor' ? getTensorTypeRepr(spec) : getColumnTypeRepr(spec, 0);

  return (
    <pre
      css={{
        whiteSpace: 'pre-wrap',
        padding: theme.spacing.sm,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
      }}
    >
      {repr}
    </pre>
  );
}

const SchemaTableRow = ({ schemaData }: { schemaData?: (ColumnSpec | TensorSpec)[] }) => {
  const isEmptySchema = isEmpty(schemaData);
  const intl = useIntl();

  // Determine if the schema is too large (more than LIMIT_VISIBLE_COLUMNS = 100 rows) to display all at once
  const isLargeSchema = Boolean(schemaData && schemaData.length > LIMIT_VISIBLE_COLUMNS);
  const [searchText, setSearchText] = useState('');

  // Defer the search text to avoid blocking the UI when typing
  const deferredSearchText = useSafeDeferredValue(searchText);

  const filteredSchemaData = useMemo(() => {
    if (!isLargeSchema) {
      return schemaData;
    }
    const normalizedSearchText = deferredSearchText.toLowerCase();
    return schemaData
      ?.filter((schemaRow) => {
        return (
          'name' in schemaRow &&
          schemaRow.name !== null &&
          String(schemaRow.name).toLowerCase().includes(normalizedSearchText)
        );
      })
      .slice(0, LIMIT_VISIBLE_COLUMNS);
  }, [schemaData, deferredSearchText, isLargeSchema]);

  if (isEmptySchema) {
    return (
      <TableRow>
        <TableCell>
          <FormattedMessage
            defaultMessage="No schema. See <link>MLflow docs</link> for how to include
                     input and output schema with your model."
            description="Text for schema table when no schema exists in the model version
                     page"
            values={{
              link: (chunks: any) => (
                <a href={LogModelWithSignatureUrl} target="_blank" rel="noreferrer">
                  {chunks}
                </a>
              ),
            }}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {isLargeSchema && (
        <>
          <Spacer />
          <Typography.Hint>
            <FormattedMessage
              defaultMessage="Schema is too large to display all rows. Please search for a column name to filter the results. Currently showing {currentResults} results from {allResults} total rows."
              description="Text for model inputs/outputs schema table when schema is too large to display all rows"
              values={{
                currentResults: filteredSchemaData?.length,
                allResults: schemaData?.length,
              }}
            />
          </Typography.Hint>
          <Spacer />
          <Input
            placeholder={intl.formatMessage({
              defaultMessage: 'Search for a field',
              description: 'Placeholder for search input in schema table',
            })}
            componentId="mlflow.schema_table.search_input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Spacer />
        </>
      )}
      {filteredSchemaData?.map((schemaRow, index) => (
        <TableRow key={index}>
          <TableCell css={{ flex: 2, alignItems: 'center' }}>
            <ColumnName spec={schemaRow} />
          </TableCell>
          <TableCell css={{ flex: 3, alignItems: 'center' }}>
            <ColumnSchema spec={schemaRow} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export const SchemaTable = ({ schema, defaultExpandAllRows }: Props) => {
  const { theme } = useDesignSystemTheme();
  const [inputsExpanded, setInputsExpanded] = useState(defaultExpandAllRows);
  const [outputsExpanded, setOutputsExpanded] = useState(defaultExpandAllRows);

  return (
    <Table css={{ maxWidth: 800 }}>
      <TableRow isHeader>
        <TableHeader componentId="mlflow.schema_table.header.name" css={{ flex: 2 }}>
          <Text bold css={{ paddingLeft: theme.spacing.lg + theme.spacing.xs }}>
            <FormattedMessage
              defaultMessage="Name"
              description="Text for name column in schema table in model version page"
            />
          </Text>
        </TableHeader>
        <TableHeader componentId="mlflow.schema_table.header.type" css={{ flex: 3 }}>
          <Text bold>
            <FormattedMessage
              defaultMessage="Type"
              description="Text for type column in schema table in model version page"
            />
          </Text>
        </TableHeader>
      </TableRow>
      <>
        <TableRow onClick={() => setInputsExpanded(!inputsExpanded)} css={{ cursor: 'pointer' }}>
          <TableCell>
            <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
              <div
                css={{
                  width: theme.spacing.lg,
                  height: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  svg: {
                    color: theme.colors.textSecondary,
                  },
                }}
              >
                {inputsExpanded ? <MinusSquareIcon /> : <PlusSquareIcon />}
              </div>
              <FormattedMessage
                defaultMessage="Inputs ({numInputs})"
                description="Input section header for schema table in model version page"
                values={{
                  numInputs: schema.inputs.length,
                }}
              />
            </div>
          </TableCell>
        </TableRow>
        {inputsExpanded && <SchemaTableRow schemaData={schema.inputs} />}
        <TableRow onClick={() => setOutputsExpanded(!outputsExpanded)} css={{ cursor: 'pointer' }}>
          <TableCell>
            <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
              <div
                css={{
                  width: theme.spacing.lg,
                  height: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  svg: {
                    color: theme.colors.textSecondary,
                  },
                }}
              >
                {outputsExpanded ? <MinusSquareIcon /> : <PlusSquareIcon />}
              </div>
              <FormattedMessage
                defaultMessage="Outputs ({numOutputs})"
                description="Input section header for schema table in model version page"
                values={{
                  numOutputs: schema.outputs.length,
                }}
              />
            </div>
          </TableCell>
        </TableRow>
        {outputsExpanded && <SchemaTableRow schemaData={schema.outputs} />}
      </>
    </Table>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelsTableAliasedVersionsCell.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/aliases/ModelsTableAliasedVersionsCell.test.tsx

```typescript
import { describe, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { type Location, useLocation } from '../../../common/utils/RoutingUtils';
import {
  setupTestRouter,
  testRoute,
  waitForRoutesToBeRendered,
  TestRouter,
} from '../../../common/utils/RoutingTestUtils';
import { renderWithIntl, act, screen, within } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import type { ModelEntity } from '../../../experiment-tracking/types';
import { ModelsTableAliasedVersionsCell } from './ModelsTableAliasedVersionsCell';
import { openDropdownMenu } from '@databricks/design-system/test-utils/rtl';
import { DesignSystemProvider } from '@databricks/design-system';

describe('ModelListTableAliasedVersionsCell', () => {
  const modelWithOneAlias: ModelEntity = {
    name: 'test-model',
    aliases: [{ alias: 'alias-version-1', version: '1' }],
  } as any;

  const modelWithMultipleAliases: ModelEntity = {
    name: 'test-model',
    aliases: [
      { alias: 'alias-version-1-another', version: '1' },
      { alias: 'alias-version-1', version: '1' },
      { alias: 'alias-version-2', version: '2' },
      { alias: 'alias-version-10', version: '10' },
    ],
  } as any;

  const renderWithRouterWrapper = async (element: React.ReactElement) => {
    let _location: Location | null = null;
    const Component = () => {
      _location = useLocation();

      return <>{element}</>;
    };
    renderWithIntl(
      <DesignSystemProvider>
        <TestRouter routes={[testRoute(<Component />)]} />
      </DesignSystemProvider>,
    );
    return { getLocation: () => _location };
  };

  test('display a single version and navigate to it', async () => {
    const { getLocation } = await renderWithRouterWrapper(<ModelsTableAliasedVersionsCell model={modelWithOneAlias} />);
    expect(screen.getByText(/@ alias-version-1/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /alias-version-1 : Version 1/ }));
    expect(getLocation()?.pathname).toMatch('/models/test-model/versions/1');
  });

  test('display multiple versions and navigate there', async () => {
    const { getLocation } = await renderWithRouterWrapper(
      <ModelsTableAliasedVersionsCell model={modelWithMultipleAliases} />,
    );
    expect(screen.getByText(/@ alias-version-10/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /alias-version-10 : Version 10/ }));
    expect(getLocation()?.pathname).toMatch('/models/test-model/versions/10');

    await act(async () => {
      await openDropdownMenu(screen.getByRole('button', { name: '+3' }));
    });

    await userEvent.click(within(screen.getByRole('menu')).getByText(/Version 2/));

    expect(getLocation()?.pathname).toMatch('/models/test-model/versions/2');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelsTableAliasedVersionsCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/aliases/ModelsTableAliasedVersionsCell.tsx

```typescript
import { first, sortBy } from 'lodash';
import type { ModelEntity } from '../../../experiment-tracking/types';
import { AliasTag } from '../../../common/components/AliasTag';
import { Button, DropdownMenu, useDesignSystemTheme } from '@databricks/design-system';
import { Link } from '../../../common/utils/RoutingUtils';
import { ModelRegistryRoutes } from '../../routes';
import { FormattedMessage, defineMessage } from 'react-intl';

const versionLabel = defineMessage({
  defaultMessage: 'Version {version}',
  description: 'Model registry > models table > aliases column > version indicator',
});

interface ModelsTableAliasedVersionsCellProps {
  model: ModelEntity;
}

export const ModelsTableAliasedVersionsCell = ({ model }: ModelsTableAliasedVersionsCellProps) => {
  const { aliases } = model;
  const { theme } = useDesignSystemTheme();

  if (!aliases?.length) {
    return null;
  }

  // Sort alias entries by version, descending
  const aliasesByVersionSorted = sortBy(aliases, ({ version }) => parseInt(version, 10) || 0).reverse();

  const latestVersionAlias = first(aliasesByVersionSorted);

  // Return nothing if there's not a single alias present
  if (!latestVersionAlias) {
    return null;
  }

  const otherAliases = aliasesByVersionSorted.filter((alias) => alias !== latestVersionAlias);

  return (
    <div>
      <Link to={ModelRegistryRoutes.getModelVersionPageRoute(model.name, latestVersionAlias.version)}>
        <AliasTag value={latestVersionAlias.alias} css={{ marginRight: 0, cursor: 'pointer' }} />
        : <FormattedMessage {...versionLabel} values={{ version: latestVersionAlias.version }} />
      </Link>
      {otherAliases.length > 0 && (
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button
              componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelstablealiasedversionscell.tsx_47"
              size="small"
              css={{ borderRadius: 12, marginLeft: theme.spacing.xs }}
            >
              +{aliases.length - 1}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {otherAliases.map(({ alias, version }) => (
              <DropdownMenu.Item
                componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelstablealiasedversionscell.tsx_57"
                key={alias}
              >
                <Link to={ModelRegistryRoutes.getModelVersionPageRoute(model.name, version)}>
                  <AliasTag value={alias} css={{ marginRight: 0, cursor: 'pointer' }} />:{' '}
                  <span css={{ color: theme.colors.actionTertiaryTextDefault }}>
                    <FormattedMessage {...versionLabel} values={{ version }} />
                  </span>
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionTableAliasesCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/aliases/ModelVersionTableAliasesCell.tsx

```typescript
import { Button, PencilIcon, useDesignSystemTheme } from '@databricks/design-system';
import { AliasTag } from '../../../common/components/AliasTag';
import { FormattedMessage } from 'react-intl';

interface ModelVersionTableAliasesCellProps {
  aliases?: string[];
  modelName: string;
  version: string;
  onAddEdit: () => void;
  className?: string;
}

export const ModelVersionTableAliasesCell = ({
  aliases = [],
  onAddEdit,
  className,
}: ModelVersionTableAliasesCellProps) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        maxWidth: 300,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        '> *': {
          marginRight: '0 !important',
        },
        rowGap: theme.spacing.xs / 2,
        columnGap: theme.spacing.xs,
      }}
      className={className}
    >
      {aliases.length < 1 ? (
        <Button
          componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelversiontablealiasescell.tsx_30"
          size="small"
          type="link"
          onClick={onAddEdit}
        >
          <FormattedMessage
            defaultMessage="Add"
            description="Model registry > model version table > aliases column > 'add' button label"
          />
        </Button>
      ) : (
        <>
          {aliases.map((alias) => (
            <AliasTag value={alias} key={alias} css={{ marginTop: theme.spacing.xs / 2 }} />
          ))}
          <Button
            componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelversiontablealiasescell.tsx_41"
            size="small"
            icon={<PencilIcon />}
            onClick={onAddEdit}
          />
        </>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionViewAliasEditor.intg.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/aliases/ModelVersionViewAliasEditor.intg.test.tsx
Signals: React, Redux/RTK

```typescript
import { jest, describe, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';

import { ModelVersionViewAliasEditor } from './ModelVersionViewAliasEditor';
import { renderWithIntl, act, screen, within, findAntdOption } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import { useEffect, useState } from 'react';
import type { ModelEntity, ModelVersionInfoEntity } from '../../../experiment-tracking/types';
import { Services as ModelRegistryServices } from '../../services';

// eslint-disable-next-line no-restricted-syntax -- TODO(FEINF-4392)
jest.setTimeout(60000); // increase timeout since it's integration testing

/**
 * A simple mocked API to that mimics storing registered model,
 * its versions and and is capable of updating aliases
 */
class MockDatabase {
  models: ModelEntity[] = [];
  modelVersions: ModelVersionInfoEntity[] = [];
  constructor() {
    const initialAliases = { 1: ['champion', 'first_version'], 2: ['challenger'] };
    const initialModel: ModelEntity = {
      name: 'test_model',
      creation_timestamp: 1234,
      last_updated_timestamp: 2345,
      current_stage: '',
      email_subscription_status: 'active',
      permission_level: '',
      source: 'notebook',
      status: 'active',
      version: '1',
      description: '',
      id: 'test_model',
      latest_versions: [],
      tags: [],
    };
    const initialModelVersions: ModelVersionInfoEntity[] = [
      {
        ...initialModel,
        last_updated_timestamp: 1234,
        run_id: 'experiment123456789_run4',
        user_id: '123',
        version: '1',
        tags: [],
        aliases: initialAliases['1'],
      },
      {
        ...initialModel,
        last_updated_timestamp: 1234,
        run_id: 'experiment123456789_run4',
        user_id: '123',
        version: '2',
        tags: [],
        aliases: initialAliases['2'],
      },
    ];
    initialModel.latest_versions.push(initialModelVersions[1]);

    this.models.push(initialModel);
    this.modelVersions.push(...initialModelVersions);

    initialModel.aliases = this.modelVersions.flatMap(({ version, aliases }) =>
      (aliases || []).map((alias) => ({ version, alias })),
    );
  }
  private getModel(findName: string) {
    return this.models.find(({ name }) => name === findName) || null;
  }
  private getVersions(modelName: string) {
    return this.modelVersions.filter(({ name, version }) => name === modelName) || [];
  }
  // Exposed "API":
  fetchModel = async (findName: string) => {
    return Promise.resolve(this.getModel(findName));
  };
  searchModelVersions = async (modelName: string) => {
    return Promise.resolve(this.getVersions(modelName));
  };
  setAlias = async ({ alias, name, version }: { alias: string; name: string; version: string }) => {
    const existingAliasVersion = this.modelVersions.find(
      (versionEntity) => versionEntity.name === name && versionEntity.aliases?.includes(alias),
    );
    if (existingAliasVersion) {
      existingAliasVersion.aliases = existingAliasVersion.aliases?.filter((a) => a !== alias) || [];
    }
    const aliasVersion = this.modelVersions.find(
      (versionEntity) => versionEntity.name === name && versionEntity.version === version,
    );
    if (!aliasVersion) {
      return;
    }
    aliasVersion.aliases = Array.from(new Set([...(aliasVersion.aliases || []), alias]));
    const model = this.models.find((existingModel) => existingModel.name === name);
    if (model) {
      model.aliases = this.modelVersions.flatMap(({ version: existingVersion, aliases: existingAliases }) =>
        (existingAliases || []).map((a) => ({ version: existingVersion, alias: a })),
      );
    }
  };
  deleteAlias = async ({ alias, name, version }: { alias: string; name: string; version: string }) => {
    const existingAliasVersion = this.modelVersions.find(
      (versionEntity) => versionEntity.name === name && versionEntity.version === version,
    );
    if (existingAliasVersion) {
      existingAliasVersion.aliases = existingAliasVersion.aliases?.filter((a) => a !== alias) || [];
    }

    const model = this.models.find((existingModel) => existingModel.name === name);
    if (model) {
      model.aliases = this.modelVersions.flatMap(({ version: existingVersion, aliases: existingAliases }) =>
        (existingAliases || []).map((a) => ({ version: existingVersion, alias: a })),
      );
    }
  };
}

/**
 * This integration test tests component, hook and service
 * logic for adding and deleting model aliases.
 *
 * Test scenario:
 * - Load model "test_model" from mocked API
 * - Load two model versions:
 *   - Version "1" with added 'champion', 'first_version' aliases
 *   - Version "2" with added 'challenger' alias
 * - View version #2 aliases
 * - Open alias editor modal for version #2
 * - Add "champion" alias
 * - Add "latest_version" alias
 * - Save the data
 * - Confirm that new aliases are added and old ones are gone
 * - View version #1 aliases
 * - Confirm that aliases have been reloaded
 * - Open alias editor modal for version #1
 * - Remove "first_version" alias
 * - Save the data
 * - Confirm that aliases are removed
 * - Given no aliases exist for version #1, confirm the button with title "Add aliases" exists
 */
describe('useEditRegisteredModelAliasesModal integration', () => {
  // Wire up service to the mocked "database" server
  const database = new MockDatabase();
  ModelRegistryServices.setModelVersionAlias = jest.fn(database.setAlias);
  ModelRegistryServices.deleteModelVersionAlias = jest.fn(database.deleteAlias);

  let unmountPage: () => void;

  function renderTestPage(currentVersionNumber: string) {
    // Mock redux store to enable redux actions
    const mockStoreFactory = configureStore([thunk, promiseMiddleware()]);
    const mockStore = mockStoreFactory({});

    function TestPage() {
      const [model, setModel] = useState<ModelEntity | null>(null);
      const [versions, setVersions] = useState<ModelVersionInfoEntity[]>([]);

      const fetchData = () => {
        database.fetchModel('test_model').then(setModel);
        database.searchModelVersions('test_model').then(setVersions);
      };

      useEffect(() => {
        fetchData();
      }, []);

      const editedVersion = versions.find(({ version }) => version === currentVersionNumber);

      if (!model || !editedVersion) {
        return <>Loading</>;
      }

      return (
        <ModelVersionViewAliasEditor
          version={currentVersionNumber}
          modelEntity={model}
          aliases={editedVersion.aliases}
          onAliasesModified={fetchData}
        />
      );
    }
    const { unmount } = renderWithIntl(
      <Provider store={mockStore}>
        <TestPage />
      </Provider>,
    );
    unmountPage = unmount;
  }

  test('it should display model details and modify its aliases using the modal', async () => {
    // Render the page for model version #2
    await act(async () => {
      renderTestPage('2');
    });

    // Check if the "challenger" alias exists
    expect(screen.getByRole('status', { name: 'challenger' })).toBeInTheDocument();

    // Open the editor modal
    await userEvent.click(screen.getByRole('button', { name: 'Edit aliases' }));

    // Type in "champion" alias name, confirm the selection
    await userEvent.type(screen.getByRole('combobox'), 'champion');
    await userEvent.click(await findAntdOption('champion'));

    // Assert there's a conflict
    expect(
      screen.getByText(
        'The "champion" alias is also being used on version 1. Adding it to this version will remove it from version 1.',
      ),
    ).toBeInTheDocument();

    // Add yet another alias, confirm the selection
    await userEvent.type(screen.getByRole('combobox'), 'latest_version');
    await userEvent.click(await findAntdOption('latest_version'));

    // Save the aliases
    await userEvent.click(screen.getByRole('button', { name: 'Save aliases' }));

    // Assert there are new aliases loaded from "API"
    expect(screen.getByRole('status', { name: 'champion' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'challenger' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'latest_version' })).toBeInTheDocument();

    // Unmount the page, display version #1 aliases now
    await act(async () => {
      unmountPage();
      renderTestPage('1');
    });

    // Assert there are version 1 aliases shown only
    expect(screen.getByRole('status', { name: 'first_version' })).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'champion' })).not.toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'latest_version' })).not.toBeInTheDocument();

    // Show the editor modal
    await userEvent.click(screen.getByRole('button', { name: 'Edit aliases' }));

    // Locate the tag pill with the existing "first_version" alias, click the "X" button within
    await userEvent.click(
      within(within(screen.getByRole('dialog')).getByRole('status', { name: 'first_version' })).getByRole('button'),
    );

    // Save the new aliases
    await userEvent.click(screen.getByRole('button', { name: 'Save aliases' }));

    // Confirm there are no aliases shown at all
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Confirm a button with "Add aliases" title is displayed now
    expect(screen.queryByTitle('Add aliases')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelVersionViewAliasEditor.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/aliases/ModelVersionViewAliasEditor.tsx
Signals: React, Redux/RTK

```typescript
import { Button, PencilIcon } from '@databricks/design-system';
import type { ModelEntity } from '../../../experiment-tracking/types';
import { useEditAliasesModal } from '../../../common/hooks/useEditAliasesModal';
import { AliasTag } from '../../../common/components/AliasTag';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import type { ThunkDispatch } from '../../../redux-types';
import { setModelVersionAliasesApi } from '../../actions';
import { mlflowAliasesLearnMoreLink } from '../../constants';

const getAliasesModalTitle = (version: string) => (
  <FormattedMessage
    defaultMessage="Add/Edit alias for model version {version}"
    description="Model registry > model version alias editor > Title of the update alias modal"
    values={{ version }}
  />
);

export const ModelVersionViewAliasEditor = ({
  aliases = [],
  modelEntity,
  version,
  onAliasesModified,
}: {
  modelEntity?: ModelEntity;
  aliases?: string[];
  version: string;
  onAliasesModified?: () => void;
}) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const { EditAliasesModal, showEditAliasesModal } = useEditAliasesModal({
    aliases: modelEntity?.aliases ?? [],
    onSuccess: onAliasesModified,
    onSave: async (currentlyEditedVersion: string, existingAliases: string[], draftAliases: string[]) =>
      dispatch(
        setModelVersionAliasesApi(modelEntity?.name ?? '', currentlyEditedVersion, existingAliases, draftAliases),
      ),
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
  const onAddEdit = useCallback(() => {
    showEditAliasesModal(version);
  }, [showEditAliasesModal, version]);
  return (
    <>
      {EditAliasesModal}
      {aliases.length < 1 ? (
        <Button
          componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelversionviewaliaseditor.tsx_29"
          size="small"
          type="link"
          onClick={onAddEdit}
          title="Add aliases"
        >
          Add
        </Button>
      ) : (
        <div css={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {aliases.map((alias) => (
            <AliasTag compact value={alias} key={alias} />
          ))}
          <Button
            componentId="codegen_mlflow_app_src_model-registry_components_aliases_modelversionviewaliaseditor.tsx_37"
            size="small"
            icon={<PencilIcon />}
            onClick={onAddEdit}
            title="Edit aliases"
          />
        </div>
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelListFilters.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/model-list/ModelListFilters.enzyme.test.tsx

```typescript
import { describe, it, expect, jest } from '@jest/globals';
import { mountWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.enzyme';
import type { ModelListFiltersProps } from './ModelListFilters';
import { ModelListFilters } from './ModelListFilters';

describe('ModelListFilters', () => {
  const minimalProps: ModelListFiltersProps = {
    isFiltered: false,
    onSearchFilterChange: () => {},
    searchFilter: '',
  };

  const createComponentWrapper = (moreProps: Partial<ModelListFiltersProps> = {}) => {
    return mountWithIntl(<ModelListFilters {...minimalProps} {...moreProps} />);
  };

  it('mounts the component and checks if input is rendered', () => {
    const wrapper = createComponentWrapper({});

    expect(wrapper.find('[data-testid="model-search-input"]')).toBeTruthy();
  });
  it('mounts the component and checks if search input works', () => {
    const onSearchFilterChange = jest.fn();
    const wrapper = createComponentWrapper({
      onSearchFilterChange,
    });

    wrapper.find('input[data-testid="model-search-input"]').simulate('change', { target: { value: 'searched model' } });

    wrapper.find('input[data-testid="model-search-input"]').simulate('submit');

    expect(onSearchFilterChange).toHaveBeenCalledWith('searched model');
  });

  it('resets the search filter', () => {
    const onSearchFilterChange = jest.fn();
    const wrapper = createComponentWrapper({
      onSearchFilterChange,
      searchFilter: 'some search filter',
      isFiltered: true,
    });

    wrapper.find('[data-testid="models-list-filters-reset"]').hostNodes().simulate('click');
    expect(onSearchFilterChange).toHaveBeenCalledWith('');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ModelListFilters.tsx]---
Location: mlflow-master/mlflow/server/js/src/model-registry/components/model-list/ModelListFilters.tsx
Signals: React

```typescript
import {
  TableFilterLayout,
  Button,
  TableFilterInput,
  InfoSmallIcon,
  Popover,
  Typography,
} from '@databricks/design-system';
import { useEffect, useState } from 'react';
import { FormattedMessage, defineMessage, useIntl } from 'react-intl';
import { ExperimentRunSearchSyntaxDocUrl } from '../../../common/constants';

export interface ModelListFiltersProps {
  searchFilter: string;
  onSearchFilterChange: (newValue: string) => void;
  isFiltered: boolean;
}

export const ModelSearchInputHelpTooltip = ({
  exampleEntityName = 'my_model_name',
}: {
  exampleEntityName?: string;
}) => {
  const { formatMessage } = useIntl();
  const tooltipIntroMessage = defineMessage({
    defaultMessage:
      'To search by tags or by names and tags, use a simplified version{newline}of the SQL {whereBold} clause.',
    description: 'Tooltip string to explain how to search models from the model registry table',
  });

  // Tooltips are not expected to contain links.
  const labelText = formatMessage(tooltipIntroMessage, { newline: ' ', whereBold: 'WHERE' });

  return (
    <Popover.Root componentId="codegen_mlflow_app_src_model-registry_components_model-list_modellistfilters.tsx_46">
      <Popover.Trigger
        aria-label={labelText}
        css={{ border: 0, background: 'none', padding: 0, lineHeight: 0, cursor: 'pointer' }}
      >
        <InfoSmallIcon />
      </Popover.Trigger>
      <Popover.Content align="start">
        <div>
          <FormattedMessage {...tooltipIntroMessage} values={{ newline: <br />, whereBold: <b>WHERE</b> }} />{' '}
          <FormattedMessage
            defaultMessage="<link>Learn more</link>"
            description="Learn more tooltip link to learn more on how to search models"
            values={{
              link: (chunks) => (
                <Typography.Link
                  componentId="codegen_mlflow_app_src_model-registry_components_model-list_modellistfilters.tsx_61"
                  href={ExperimentRunSearchSyntaxDocUrl + '#syntax'}
                  openInNewTab
                >
                  {chunks}
                </Typography.Link>
              ),
            }}
          />
          <br />
          <br />
          <FormattedMessage defaultMessage="Examples:" description="Text header for examples of mlflow search syntax" />
          <br />
          • tags.my_key = "my_value"
          <br />• name ILIKE "%{exampleEntityName}%" AND tags.my_key = "my_value"
        </div>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
};

export const ModelListFilters = ({
  // prettier-ignore
  searchFilter,
  onSearchFilterChange,
  isFiltered,
}: ModelListFiltersProps) => {
  const intl = useIntl();

  const [internalSearchFilter, setInternalSearchFilter] = useState(searchFilter);

  const triggerSearch = () => {
    onSearchFilterChange(internalSearchFilter);
  };
  useEffect(() => {
    setInternalSearchFilter(searchFilter);
  }, [searchFilter]);

  const reset = () => {
    onSearchFilterChange('');
  };

  return (
    <TableFilterLayout>
      <TableFilterInput
        componentId="codegen_mlflow_app_src_model-registry_components_model-list_modellistfilters.tsx_118"
        placeholder={intl.formatMessage({
          defaultMessage: 'Filter registered models by name or tags',
          description: 'Placeholder text inside model search bar',
        })}
        onSubmit={triggerSearch}
        onClear={() => {
          setInternalSearchFilter('');
          onSearchFilterChange('');
        }}
        onChange={(e) => setInternalSearchFilter(e.target.value)}
        data-testid="model-search-input"
        suffix={<ModelSearchInputHelpTooltip />}
        value={internalSearchFilter}
        showSearchButton
      />
      {isFiltered && (
        <Button
          componentId="codegen_mlflow_app_src_model-registry_components_model-list_modellistfilters.tsx_152"
          type="tertiary"
          onClick={reset}
          data-testid="models-list-filters-reset"
        >
          <FormattedMessage defaultMessage="Reset filters" description="Reset filters button in list" />
        </Button>
      )}
    </TableFilterLayout>
  );
};
```

--------------------------------------------------------------------------------

````

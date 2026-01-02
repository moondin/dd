---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 566
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 566 of 991)

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

---[FILE: PromptVersionMetadata.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionMetadata.tsx
Signals: React

```typescript
import { Button, ParagraphSkeleton, PencilIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { ModelVersionTableAliasesCell } from '../../../../model-registry/components/aliases/ModelVersionTableAliasesCell';
import type { RegisteredPrompt, RegisteredPromptVersion } from '../types';
import Utils from '../../../../common/utils/Utils';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { usePromptRunsInfo } from '../hooks/usePromptRunsInfo';
import { getModelConfigFromTags, MODEL_CONFIG_FIELD_LABELS, REGISTERED_PROMPT_SOURCE_RUN_IDS } from '../utils';
import { useCallback, useMemo } from 'react';
import { PromptVersionRuns } from './PromptVersionRuns';
import { isUserFacingTag } from '@mlflow/mlflow/src/common/utils/TagUtils';
import { KeyValueTag } from '@mlflow/mlflow/src/common/components/KeyValueTag';
import { PromptVersionTags } from './PromptVersionTags';

const MAX_VISIBLE_TAGS = 3;

export const PromptVersionMetadata = ({
  registeredPromptVersion,
  registeredPrompt,
  showEditAliasesModal,
  onEditVersion,
  showEditPromptVersionMetadataModal,
  showEditModelConfigModal,
  aliasesByVersion,
  isBaseline,
}: {
  registeredPrompt?: RegisteredPrompt;
  registeredPromptVersion?: RegisteredPromptVersion;
  showEditAliasesModal?: (versionNumber: string) => void;
  onEditVersion?: (vesrion: RegisteredPromptVersion) => void;
  showEditPromptVersionMetadataModal?: (version: RegisteredPromptVersion) => void;
  showEditModelConfigModal?: (version: RegisteredPromptVersion) => void;
  aliasesByVersion: Record<string, string[]>;
  isBaseline?: boolean;
}) => {
  const { theme } = useDesignSystemTheme();

  const runIds = useMemo(() => {
    const tagValue = registeredPromptVersion?.tags?.find((tag) => tag.key === REGISTERED_PROMPT_SOURCE_RUN_IDS)?.value;
    if (!tagValue) {
      return [];
    }
    return tagValue.split(',').map((runId) => runId.trim());
  }, [registeredPromptVersion]);

  const { isLoading: isLoadingRuns, runInfoMap } = usePromptRunsInfo(runIds ? runIds : []);

  if (!registeredPrompt || !registeredPromptVersion) {
    return null;
  }

  const visibleTagList = registeredPromptVersion?.tags?.filter((tag) => isUserFacingTag(tag.key)) || [];

  const versionElement = (
    <FormattedMessage
      defaultMessage="Version {version}"
      values={{ version: registeredPromptVersion.version }}
      description="A label for the version number in the prompt details page"
    />
  );

  const onEditVersionMetadata = showEditPromptVersionMetadataModal
    ? () => {
        showEditPromptVersionMetadataModal(registeredPromptVersion);
      }
    : undefined;

  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gridAutoRows: `minmax(${theme.typography.lineHeightLg}, auto)`,
        alignItems: 'flex-start',
        rowGap: theme.spacing.xs,
        columnGap: theme.spacing.sm,
      }}
    >
      {onEditVersion && (
        <>
          <Typography.Text bold>Version:</Typography.Text>
          <Typography.Text>
            <Typography.Link
              componentId="mlflow.prompts.details.version.goto"
              onClick={() => onEditVersion(registeredPromptVersion)}
            >
              {versionElement}
            </Typography.Link>{' '}
            {isBaseline && (
              <FormattedMessage
                defaultMessage="(baseline)"
                description="A label displayed next to baseline version in the prompt versions comparison view"
              />
            )}
          </Typography.Text>
        </>
      )}
      <Typography.Text bold>
        <FormattedMessage
          defaultMessage="Registered at:"
          description="A label for the registration timestamp in the prompt details page"
        />
      </Typography.Text>
      <Typography.Text>{Utils.formatTimestamp(registeredPromptVersion.creation_timestamp)}</Typography.Text>
      <Typography.Text bold>
        <FormattedMessage
          defaultMessage="Aliases:"
          description="A label for the aliases list in the prompt details page"
        />
      </Typography.Text>
      <div>
        <ModelVersionTableAliasesCell
          css={{ maxWidth: 'none' }}
          modelName={registeredPrompt.name}
          version={registeredPromptVersion.version}
          aliases={aliasesByVersion[registeredPromptVersion.version] || []}
          onAddEdit={() => {
            showEditAliasesModal?.(registeredPromptVersion.version);
          }}
        />
      </div>
      {registeredPromptVersion.description && (
        <>
          <Typography.Text bold>
            <FormattedMessage
              defaultMessage="Commit message:"
              description="A label for the commit message in the prompt details page"
            />
          </Typography.Text>
          <Typography.Text>{registeredPromptVersion.description}</Typography.Text>
        </>
      )}
      <PromptVersionTags onEditVersionMetadata={onEditVersionMetadata} tags={visibleTagList} />
      {/* Model Config Section */}
      {(() => {
        const modelConfig = getModelConfigFromTags(registeredPromptVersion?.tags);
        const hasModelConfig = !!modelConfig;

        // Only show section if there's config or ability to edit
        if (!hasModelConfig && !showEditModelConfigModal) return null;

        return (
          <>
            <Typography.Text bold>
              <FormattedMessage
                defaultMessage="Model Config:"
                description="Label for model configuration in the prompt details page"
              />
            </Typography.Text>
            <div css={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm }}>
              {hasModelConfig ? (
                <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, flex: 1 }}>
                  {Object.entries(modelConfig).map(([key, value]) => {
                    if (value === undefined || value === null) return null;
                    if (Array.isArray(value) && value.length === 0) return null;

                    // Handle extra_params separately - display as nested section
                    if (key === 'extra_params' && typeof value === 'object' && !Array.isArray(value)) {
                      const extraParams = value as Record<string, any>;
                      if (Object.keys(extraParams).length === 0) return null;

                      return (
                        <div key={key}>
                          <Typography.Text css={{ color: theme.colors.textSecondary }}>extra_params:</Typography.Text>
                          <div css={{ marginLeft: theme.spacing.md }}>
                            {Object.entries(extraParams).map(([extraKey, extraValue]) => {
                              if (extraValue === undefined || extraValue === null) return null;
                              const extraDisplayValue =
                                typeof extraValue === 'object' ? JSON.stringify(extraValue) : String(extraValue);
                              return (
                                <div key={`${key}.${extraKey}`}>
                                  <Typography.Text css={{ color: theme.colors.textSecondary }}>
                                    {extraKey}:{' '}
                                  </Typography.Text>
                                  <Typography.Text>{extraDisplayValue}</Typography.Text>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    const label = MODEL_CONFIG_FIELD_LABELS[key as keyof typeof MODEL_CONFIG_FIELD_LABELS];
                    const displayValue = Array.isArray(value) ? value.join(', ') : String(value);

                    return (
                      <div key={key}>
                        <Typography.Text css={{ color: theme.colors.textSecondary }}>{label}: </Typography.Text>
                        <Typography.Text>{displayValue}</Typography.Text>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Typography.Hint>—</Typography.Hint>
              )}
              {showEditModelConfigModal && (
                <Button
                  componentId="mlflow.prompts.details.version.edit_model_config"
                  size="small"
                  icon={<PencilIcon />}
                  onClick={() => showEditModelConfigModal(registeredPromptVersion)}
                />
              )}
            </div>
          </>
        );
      })()}
      {(isLoadingRuns || runIds.length > 0) && (
        <PromptVersionRuns isLoadingRuns={isLoadingRuns} runIds={runIds} runInfoMap={runInfoMap} />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptVersionRuns.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionRuns.tsx
Signals: React

```typescript
import { useState } from 'react';
import { Button, ParagraphSkeleton, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { Link } from '../../../../common/utils/RoutingUtils';
import Routes from '../../../routes';
import { isNil } from 'lodash';

export const PromptVersionRuns = ({
  isLoadingRuns,
  runIds,
  runInfoMap,
}: {
  isLoadingRuns: boolean;
  runIds: string[];
  runInfoMap: Record<string, any>;
}) => {
  const [showAll, setShowAll] = useState(false);
  const { theme } = useDesignSystemTheme();

  const displayThreshold = 3;
  const visibleCount = showAll ? runIds.length : Math.min(displayThreshold, runIds.length || 0);
  const hasMore = runIds.length > displayThreshold;

  return (
    <>
      <Typography.Text bold>
        <FormattedMessage
          defaultMessage="MLflow runs:"
          description="A label for the associated MLflow runs in the prompt details page"
        />
      </Typography.Text>

      <div>
        {isLoadingRuns ? (
          <ParagraphSkeleton css={{ width: 100 }} />
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {runIds.slice(0, visibleCount).map((runId, index) => {
                const runInfo = runInfoMap[runId];

                if (!isNil(runInfo?.experimentId) && runInfo?.runUuid && runInfo?.runName) {
                  const { experimentId, runUuid, runName } = runInfo;
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Typography.Text>
                      <Link to={Routes.getRunPageRoute(experimentId, runUuid)}>{runName}</Link>
                      {index < visibleCount - 1 && ','}
                    </Typography.Text>
                  );
                } else {
                  // eslint-disable-next-line react/jsx-key
                  return <span>{runInfo?.runName || runInfo?.runUuid}</span>;
                }
              })}
              {hasMore && (
                <Button
                  componentId="mlflow.prompts.details.runs.show_more"
                  size="small"
                  type="link"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <FormattedMessage
                      defaultMessage="Show less"
                      description="Label for a link that shows less tags when clicked"
                    />
                  ) : (
                    <FormattedMessage
                      defaultMessage="{count} more..."
                      description="Label for a link that renders the remaining tags when clicked"
                      values={{ count: runIds.length - visibleCount }}
                    />
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptVersionsDiffSelectorButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionsDiffSelectorButton.tsx

```typescript
import { Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';

/**
 * A custom split button to select versions to compare in the prompt details page.
 */
export const PromptVersionsDiffSelectorButton = ({
  isSelectedFirstToCompare,
  isSelectedSecondToCompare,
  onSelectFirst,
  onSelectSecond,
}: {
  isSelectedFirstToCompare: boolean;
  isSelectedSecondToCompare: boolean;
  onSelectFirst?: () => void;
  onSelectSecond?: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  return (
    <div
      css={{ width: theme.general.buttonHeight, display: 'flex', alignItems: 'center', paddingRight: theme.spacing.sm }}
    >
      <div css={{ display: 'flex', height: theme.general.buttonInnerHeight + theme.spacing.xs, gap: 0, flex: 1 }}>
        <Tooltip
          componentId="mlflow.prompts.details.select_baseline.tooltip"
          content={
            <FormattedMessage
              defaultMessage="Select as baseline version"
              description="Label for selecting baseline prompt version in the comparison view"
            />
          }
          delayDuration={0}
          side="left"
        >
          <button
            onClick={onSelectFirst}
            role="radio"
            aria-checked={isSelectedFirstToCompare}
            aria-label={intl.formatMessage({
              defaultMessage: 'Select as baseline version',
              description: 'Label for selecting baseline prompt version in the comparison view',
            })}
            css={{
              flex: 1,
              border: `1px solid ${
                isSelectedFirstToCompare
                  ? theme.colors.actionDefaultBorderFocus
                  : theme.colors.actionDefaultBorderDefault
              }`,
              borderRight: 0,
              marginLeft: 1,
              borderTopLeftRadius: theme.borders.borderRadiusMd,
              borderBottomLeftRadius: theme.borders.borderRadiusMd,
              backgroundColor: isSelectedFirstToCompare
                ? theme.colors.actionDefaultBackgroundPress
                : theme.colors.actionDefaultBackgroundDefault,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.colors.actionDefaultBackgroundHover,
              },
            }}
          />
        </Tooltip>
        <Tooltip
          componentId="mlflow.prompts.details.select_compared.tooltip"
          content={
            <FormattedMessage
              defaultMessage="Select as compared version"
              description="Label for selecting compared prompt version in the comparison view"
            />
          }
          delayDuration={0}
          side="right"
        >
          <button
            onClick={onSelectSecond}
            role="radio"
            aria-checked={isSelectedSecondToCompare}
            aria-label={intl.formatMessage({
              defaultMessage: 'Select as compared version',
              description: 'Label for selecting compared prompt version in the comparison view',
            })}
            css={{
              flex: 1,
              border: `1px solid ${
                isSelectedSecondToCompare
                  ? theme.colors.actionDefaultBorderFocus
                  : theme.colors.actionDefaultBorderDefault
              }`,
              borderLeft: `1px solid ${
                isSelectedFirstToCompare || isSelectedSecondToCompare
                  ? theme.colors.actionDefaultBorderFocus
                  : theme.colors.actionDefaultBorderDefault
              }`,
              borderTopRightRadius: theme.borders.borderRadiusMd,
              borderBottomRightRadius: theme.borders.borderRadiusMd,
              backgroundColor: isSelectedSecondToCompare
                ? theme.colors.actionDefaultBackgroundPress
                : theme.colors.actionDefaultBackgroundDefault,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.colors.actionDefaultBackgroundHover,
              },
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptVersionsTable.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionsTable.tsx
Signals: React

```typescript
import { useReactTable_unverifiedWithReact18 as useReactTable } from '@databricks/web-shared/react-table';
import {
  ChevronRightIcon,
  Empty,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableSkeletonRows,
  useDesignSystemTheme,
} from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { RegisteredPrompt, RegisteredPromptVersion } from '../types';
import { PromptVersionsTableMode } from '../utils';
import { PromptVersionsTableCombinedCell } from './PromptVersionsTableCombinedCell';
import { PromptVersionsDiffSelectorButton } from './PromptVersionsDiffSelectorButton';

type PromptVersionsTableColumnDef = ColumnDef<RegisteredPromptVersion>;

export const PromptVersionsTable = ({
  promptVersions,
  onUpdateComparedVersion,
  isLoading,
  onUpdateSelectedVersion,
  comparedVersion,
  selectedVersion,
  mode,
  registeredPrompt,
  showEditAliasesModal,
  aliasesByVersion,
}: {
  promptVersions?: RegisteredPromptVersion[];
  isLoading: boolean;
  selectedVersion?: string;
  comparedVersion?: string;
  onUpdateSelectedVersion: (version: string) => void;
  onUpdateComparedVersion: (version: string) => void;
  mode: PromptVersionsTableMode;
  registeredPrompt?: RegisteredPrompt;
  showEditAliasesModal?: (versionNumber: string) => void;
  aliasesByVersion: Record<string, string[]>;
}) => {
  const intl = useIntl();

  const { theme } = useDesignSystemTheme();
  const columns = useMemo(() => {
    const resultColumns: PromptVersionsTableColumnDef[] = [
      {
        id: 'version',
        header: intl.formatMessage({
          defaultMessage: 'Version',
          description: 'Header for the version column in the registered prompts table',
        }),
        accessorKey: 'version',
        cell: PromptVersionsTableCombinedCell,
      },
    ];

    return resultColumns;
  }, [intl]);

  const table = useReactTable(
    'mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionsTable.tsx',
    {
      data: promptVersions ?? [],
      getRowId: (row) => row.version,
      columns,
      getCoreRowModel: getCoreRowModel(),
      meta: { showEditAliasesModal, aliasesByVersion, registeredPrompt },
    },
  );

  const getEmptyState = () => {
    if (!isLoading && promptVersions?.length === 0) {
      return (
        <Empty
          title={
            <FormattedMessage
              defaultMessage="No prompt versions created"
              description="A header for the empty state in the prompt versions table"
            />
          }
          description={
            <FormattedMessage
              defaultMessage='Use "Create prompt version" button in order to create a new prompt version'
              description="Guidelines for the user on how to create a new prompt version in the prompt versions table"
            />
          }
        />
      );
    }

    return null;
  };

  return (
    <div css={{ flex: 1, overflow: 'hidden' }}>
      <Table scrollable empty={getEmptyState()} aria-label="Prompt versions table">
        <TableRow isHeader>
          {table.getLeafHeaders().map((header) => (
            <TableHeader componentId="mlflow.prompts.versions.table.header" key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeader>
          ))}
        </TableRow>
        {isLoading ? (
          <TableSkeletonRows table={table} />
        ) : (
          table.getRowModel().rows.map((row) => {
            const isSelectedSingle =
              [PromptVersionsTableMode.PREVIEW].includes(mode) && selectedVersion === row.original.version;

            const isSelectedFirstToCompare =
              [PromptVersionsTableMode.COMPARE].includes(mode) && selectedVersion === row.original.version;

            const isSelectedSecondToCompare =
              [PromptVersionsTableMode.COMPARE].includes(mode) && comparedVersion === row.original.version;

            const getColor = () => {
              if (isSelectedSingle) {
                return theme.colors.actionDefaultBackgroundPress;
              } else if (isSelectedFirstToCompare) {
                return theme.colors.actionDefaultBackgroundHover;
              } else if (isSelectedSecondToCompare) {
                return theme.colors.actionDefaultBackgroundHover;
              }
              return 'transparent';
            };

            const showCursorForEntireRow = mode === PromptVersionsTableMode.PREVIEW;
            return (
              <TableRow
                key={row.id}
                css={{
                  backgroundColor: getColor(),
                  cursor: showCursorForEntireRow ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (mode !== PromptVersionsTableMode.PREVIEW) {
                    return;
                  }
                  onUpdateSelectedVersion(row.original.version);
                }}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} css={{ alignItems: 'center' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {isSelectedSingle && (
                  <div
                    css={{
                      width: theme.spacing.md * 2,
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: theme.spacing.sm,
                    }}
                  >
                    <ChevronRightIcon />
                  </div>
                )}
                {mode === PromptVersionsTableMode.COMPARE && (
                  <PromptVersionsDiffSelectorButton
                    onSelectFirst={() => onUpdateSelectedVersion(row.original.version)}
                    onSelectSecond={() => onUpdateComparedVersion(row.original.version)}
                    isSelectedFirstToCompare={isSelectedFirstToCompare}
                    isSelectedSecondToCompare={isSelectedSecondToCompare}
                  />
                )}
              </TableRow>
            );
          })
        )}
      </Table>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptVersionsTableCombinedCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionsTableCombinedCell.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import type { ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import Utils from '../../../../common/utils/Utils';
import type { RegisteredPromptVersion } from '../types';
import type { PromptsVersionsTableMetadata } from '../utils';
import { ModelVersionTableAliasesCell } from '../../../../model-registry/components/aliases/ModelVersionTableAliasesCell';

export const PromptVersionsTableCombinedCell: ColumnDef<RegisteredPromptVersion>['cell'] = ({
  row: { original },
  table: {
    options: { meta },
  },
}) => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const { aliasesByVersion, showEditAliasesModal, registeredPrompt } = meta as PromptsVersionsTableMetadata;
  const aliases = aliasesByVersion[original.version] || [];

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
        <Typography.Text bold>Version {original.version}</Typography.Text>
        {registeredPrompt && (
          <ModelVersionTableAliasesCell
            modelName={registeredPrompt.name}
            version={original.version}
            aliases={aliases}
            onAddEdit={() => {
              showEditAliasesModal?.(original.version);
            }}
          />
        )}
      </div>
      <Typography.Text size="sm" color="secondary">
        {Utils.formatTimestamp(original.creation_timestamp, intl)}
      </Typography.Text>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: PromptVersionTags.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/PromptVersionTags.tsx
Signals: React

```typescript
import { useState } from 'react';
import { Button, PencilIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';

import { KeyValueTag } from '@mlflow/mlflow/src/common/components/KeyValueTag';
import type { KeyValueEntity } from '../../../../common/types';
import { isNil } from 'lodash';

export const PromptVersionTags = ({
  tags,
  onEditVersionMetadata,
}: {
  tags: KeyValueEntity[];
  onEditVersionMetadata?: () => void;
}) => {
  const [showAll, setShowAll] = useState(false);
  const { theme } = useDesignSystemTheme();

  const displayThreshold = 3;
  const visibleCount = showAll ? tags.length : Math.min(displayThreshold, tags.length || 0);
  const hasMore = tags.length > displayThreshold;
  const shouldAllowEditingMetadata = !isNil(onEditVersionMetadata);

  const editButton =
    tags.length > 0 ? (
      <Button
        componentId="mlflow.prompts.details.version.edit_tags"
        size="small"
        icon={<PencilIcon />}
        onClick={onEditVersionMetadata}
      />
    ) : (
      <Button
        componentId="mlflow.prompts.details.version.add_tags"
        size="small"
        type="link"
        onClick={onEditVersionMetadata}
      >
        <FormattedMessage
          defaultMessage="Add"
          description="Model registry > model version table > metadata column > 'add' button label"
        />
      </Button>
    );

  return (
    <>
      <Typography.Text bold>
        <FormattedMessage
          defaultMessage="Metadata:"
          description="A key-value pair for the metadata in the prompt details page"
        />
      </Typography.Text>
      <div>
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.xs }}>
            {tags.slice(0, visibleCount).map((tag) => (
              <KeyValueTag css={{ margin: 0 }} key={tag.key} tag={tag} />
            ))}
            {shouldAllowEditingMetadata && editButton}
            {!shouldAllowEditingMetadata && tags.length === 0 && <Typography.Hint>—</Typography.Hint>}
            {hasMore && (
              <Button
                componentId="mlflow.prompts.details.version.tags.show_more"
                size="small"
                type="link"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <FormattedMessage
                    defaultMessage="Show less"
                    description="Label for a link that shows less tags when clicked"
                  />
                ) : (
                  <FormattedMessage
                    defaultMessage="{count} more..."
                    description="Label for a link that renders the remaining tags when clicked"
                    values={{ count: tags.length - visibleCount }}
                  />
                )}
              </Button>
            )}
          </div>
        </>
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

````

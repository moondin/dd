---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 487
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 487 of 991)

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

---[FILE: ModelsCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/ModelsCellRenderer.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';
import { ModelsIcon, Overflow, Tag, Tooltip, useDesignSystemTheme } from '@databricks/design-system';
import Utils from '../../../../../../common/utils/Utils';
import { ModelRegistryRoutes } from '../../../../../../model-registry/routes';
import Routes from '../../../../../routes';
import type { RunRowModelsInfo } from '../../../utils/experimentPage.row-types';
import { Link } from '../../../../../../common/utils/RoutingUtils';
import { ReactComponent as RegisteredModelOkIcon } from '../../../../../../common/static/registered-model-grey-ok.svg';
import type { LoggedModelProto } from '../../../../../types';
import { FormattedMessage } from 'react-intl';
import { useExperimentLoggedModelRegisteredVersions } from '../../../../experiment-logged-models/hooks/useExperimentLoggedModelRegisteredVersions';
import { isEmpty, uniqBy, values } from 'lodash';
import { isUCModelName } from '../../../../../utils/IsUCModelName';
import {
  shouldUnifyLoggedModelsAndRegisteredModels,
  shouldUseGetLoggedModelsBatchAPI,
} from '../../../../../../common/utils/FeatureUtils';

const EMPTY_CELL_PLACEHOLDER = '-';

export interface ModelsCellRendererProps {
  value: RunRowModelsInfo;
}

/**
 * Backfill Typescript type for the value returned from Utils.mergeLoggedAndRegisteredModels
 */
interface CombinedModelType {
  registeredModelName?: string;
  isUc?: boolean;
  registeredModelVersion?: string;
  artifactPath?: string;
  flavors?: string[];
  originalLoggedModel?: LoggedModelProto;
}

/**
 * Icon, label and link for a single model
 */
const ModelLink = ({
  model: { isUc, registeredModelName, registeredModelVersion, flavors, artifactPath, originalLoggedModel } = {},
  experimentId,
  runUuid,
}: {
  model?: CombinedModelType;
  experimentId: string;
  runUuid: string;
}) => {
  const { theme } = useDesignSystemTheme();

  // Renders a model name based on whether it's a registered model or not
  const renderModelName = () => {
    let tooltipBody: React.ReactNode = `${registeredModelName} v${registeredModelVersion}`;

    // If the model is a registered model coming from V3 logged model, we need to show the original logged model name
    if (
      registeredModelName &&
      registeredModelVersion &&
      originalLoggedModel &&
      shouldUnifyLoggedModelsAndRegisteredModels()
    ) {
      const loggedModelExperimentId = originalLoggedModel.info?.experiment_id;
      const loggedModelId = originalLoggedModel.info?.model_id;
      if (loggedModelExperimentId && loggedModelId) {
        tooltipBody = (
          <FormattedMessage
            defaultMessage="Original logged model: {originalModelLink}"
            description="Tooltip text with link to the original logged model"
            values={{
              originalModelLink: (
                <Link
                  to={Routes.getExperimentLoggedModelDetailsPage(loggedModelExperimentId, loggedModelId)}
                  css={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  {originalLoggedModel.info?.name}
                </Link>
              ),
            }}
          />
        );
      }
    }
    if (registeredModelName) {
      return (
        <Tooltip
          componentId="mlflow.experiment-tracking.models-cell.model-link"
          content={tooltipBody}
          side="top"
          align="start"
        >
          <span>
            <span css={{ verticalAlign: 'middle' }}>{registeredModelName}</span>{' '}
            <Tag
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_modelscellrenderer.tsx_49"
              css={{ marginRight: 0, verticalAlign: 'middle' }}
            >
              v{registeredModelVersion}
            </Tag>
          </span>
        </Tooltip>
      );
    }

    const firstFlavorName = flavors?.[0];

    return (
      firstFlavorName || (
        <FormattedMessage
          defaultMessage="Model"
          description="Experiment page > runs table > models column > default label for no specific model"
        />
      )
    );
  };

  // Renders a link to either the model registry or the run artifacts page
  const renderModelLink = () => {
    if (registeredModelName && registeredModelVersion) {
      return ModelRegistryRoutes.getModelVersionPageRoute(registeredModelName, registeredModelVersion);
    }
    return Routes.getRunPageRoute(experimentId, runUuid, artifactPath);
  };

  // Renders an icon based on whether it's a registered model or not
  const renderModelIcon = () => {
    if (registeredModelName) {
      return <RegisteredModelOkIcon css={{ color: theme.colors.actionPrimaryBackgroundDefault }} />;
    }
    return <ModelsIcon css={{ color: theme.colors.actionPrimaryBackgroundDefault }} />;
  };

  return (
    <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, overflow: 'hidden' }}>
      <div css={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0 }}>
        {renderModelIcon()}
      </div>
      <Link
        to={renderModelLink()}
        target="_blank"
        css={{ textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer' }}
      >
        {renderModelName()}
      </Link>
    </div>
  );
};

const LoggedModelV3Link = ({ model }: { model: LoggedModelProto }) => {
  const { theme } = useDesignSystemTheme();

  if (!model.info?.model_id || !model.info?.experiment_id) {
    return null;
  }
  return (
    <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, overflow: 'hidden' }}>
      <div css={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0 }}>
        <ModelsIcon css={{ color: theme.colors.actionPrimaryBackgroundDefault }} />
      </div>
      <Link
        to={Routes.getExperimentLoggedModelDetailsPage(model.info.experiment_id, model.info.model_id)}
        target="_blank"
        css={{ textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer' }}
      >
        {model.info.name}
      </Link>
    </div>
  );
};

/**
 * This component renders combined set of models, based on provided models payload.
 * The models are sourced from:
 * - `registeredModels` containing WMR and UC model versions associated with the run, populated by API call
 * - `loggedModels` containing legacy (pre-V3) logged models associated with the run, listed in run's tag
 * - `loggedModelsV3` containing V3 logged models associated with the runs inputs and outputs, populated by API call
 * In the component, we also resolve registered model versions for V3 logged models based on loged model's tags
 */
export const ModelsCellRenderer = React.memo((props: ModelsCellRendererProps) => {
  const { registeredModels = [], loggedModels = [], loggedModelsV3, experimentId, runUuid } = props.value || {};

  // First, we merge legacy logged models and registered models.
  const modelsLegacy: CombinedModelType[] = Utils.mergeLoggedAndRegisteredModels(
    loggedModels,
    registeredModels,
  ) as any[];

  // Next, registered model versions are resolved from V3 logged models' tags
  const { modelVersions: registeredModelVersions } = useExperimentLoggedModelRegisteredVersions({
    loggedModels: loggedModelsV3 || [],
  });

  // We create a map of registered model versions by their source logged model.
  // This allows to unfurl logged model to registered model versions while hiding the original logged model.
  const registeredModelVersionsByLoggedModel = useMemo(() => {
    if (!shouldUseGetLoggedModelsBatchAPI()) {
      return {};
    }
    const map: Record<string, CombinedModelType[]> = {};
    registeredModelVersions.forEach((modelVersion) => {
      const loggedModelId = modelVersion.sourceLoggedModel?.info?.model_id;
      if (loggedModelId) {
        const registeredModels = map[loggedModelId] || [];
        const name = modelVersion.displayedName ?? undefined;
        registeredModels.push({
          registeredModelName: name,
          registeredModelVersion: modelVersion.version ?? undefined,
          isUc: isUCModelName(name ?? ''),
          artifactPath: modelVersion.sourceLoggedModel?.info?.artifact_uri ?? '',
          flavors: [],
          originalLoggedModel: modelVersion.sourceLoggedModel,
        });
        map[loggedModelId] = registeredModels;
      }
    });
    return map;
  }, [registeredModelVersions]);

  // Merge legacy models with registered model versions from V3 logged models.
  const registeredModelsToDisplay = useMemo(() => {
    const allModels = [...modelsLegacy, ...Array.from(values(registeredModelVersionsByLoggedModel)).flat()];
    // Remove duplicates (it's not impossible to reference the same model version twice in a single logged model)
    return uniqBy(allModels, (model) =>
      JSON.stringify(
        model.registeredModelName && model.registeredModelVersion
          ? [model.registeredModelName, model.registeredModelVersion?.toString()]
          : [model.artifactPath],
      ),
    );
  }, [modelsLegacy, registeredModelVersionsByLoggedModel]);

  const containsModels = !isEmpty(registeredModelsToDisplay) || !isEmpty(loggedModelsV3);

  if (!props.value) {
    return <>{EMPTY_CELL_PLACEHOLDER}</>;
  }

  if (containsModels) {
    return (
      // <Overflow /> component does not ideally fit within ag-grid cell so we need to override its styles a bit
      <div css={{ width: '100%', '&>div': { maxWidth: '100%', display: 'flex' } }}>
        <Overflow>
          {registeredModelsToDisplay.map((model, index) => (
            <ModelLink model={model} key={model.artifactPath || index} experimentId={experimentId} runUuid={runUuid} />
          ))}
          {loggedModelsV3?.map((model, index) => {
            // Display logged model only if it does not have registered model versions associated with it.
            const modelId = model.info?.model_id;
            const loggedModelRegisteredVersions = modelId ? registeredModelVersionsByLoggedModel[modelId] : [];
            if (!isEmpty(loggedModelRegisteredVersions)) {
              return null;
            }

            return <LoggedModelV3Link key={model.info?.model_id ?? index} model={model} />;
          })}
        </Overflow>
      </div>
    );
  }
  return <>{EMPTY_CELL_PLACEHOLDER}</>;
});
```

--------------------------------------------------------------------------------

---[FILE: ModelsHeaderCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/ModelsHeaderCellRenderer.tsx
Signals: React

```typescript
import React from 'react';
import {
  SortAscendingIcon,
  SortDescendingIcon,
  Tooltip,
  useDesignSystemTheme,
  InfoTooltip,
} from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import { ATTRIBUTE_COLUMN_LABELS } from '../../../../../constants';
import {
  shouldUnifyLoggedModelsAndRegisteredModels,
  shouldUseGetLoggedModelsBatchAPI,
} from '../../../../../../common/utils/FeatureUtils';

export const ModelsHeaderCellRenderer = React.memo(() => {
  const { theme } = useDesignSystemTheme();

  // Check if we are using:
  // - unified (registered and logged) models
  // - models based on run's inputs and outputs
  // We'll use it to display better tooltip
  const isUsingUnifiedModels = shouldUnifyLoggedModelsAndRegisteredModels() && shouldUseGetLoggedModelsBatchAPI();

  return (
    <div
      role="columnheader"
      css={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: theme.spacing.xs,
      }}
    >
      {isUsingUnifiedModels ? (
        <>
          {ATTRIBUTE_COLUMN_LABELS.MODELS}
          <InfoTooltip
            componentId="mlflow.experiment_view_runs_table.column_header.models.tooltip"
            content={
              <FormattedMessage
                defaultMessage="This column contains all models logged or evaluated by the run. Click into an individual run to see more detailed information about all models associated with it."
                description='A descriptive tooltip for the "Models" column header in the runs table on the MLflow experiment detail page'
              />
            }
          />
        </>
      ) : (
        <Tooltip
          componentId="mlflow.experiment-tracking.models-header.info"
          content={
            <FormattedMessage
              defaultMessage="Click into an individual run to see all models associated with it"
              description='MLflow experiment detail page > runs table > tooltip on ML "Models" column header'
            />
          }
        >
          <span>{ATTRIBUTE_COLUMN_LABELS.MODELS}</span>
        </Tooltip>
      )}
    </div>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: RowActionsCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/RowActionsCellRenderer.tsx
Signals: React

```typescript
import { PinIcon, PinFillIcon, useDesignSystemTheme, visuallyHidden, Tooltip } from '@databricks/design-system';
import type { SuppressKeyboardEventParams } from '@ag-grid-community/core';

// TODO: Import this icon from design system when added
import { ReactComponent as VisibleFillIcon } from '../../../../../../common/static/icon-visible-fill.svg';
import type { Theme } from '@emotion/react';
import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import type { RunRowType } from '../../../utils/experimentPage.row-types';
import { RunRowVisibilityControl } from '../../../utils/experimentPage.row-types';
import { useUpdateExperimentViewUIState } from '../../../contexts/ExperimentPageUIStateContext';
import type { RUNS_VISIBILITY_MODE } from '../../../models/ExperimentPageUIState';
import { isRemainingRunsGroup } from '../../../utils/experimentPage.group-row-utils';
import { RunVisibilityControlButton } from './RunVisibilityControlButton';
import { useExperimentViewRunsTableHeaderContext } from '../ExperimentViewRunsTableHeaderContext';

const labels = {
  visibility: {
    groups: defineMessages({
      unhide: {
        defaultMessage: 'Unhide group',
        description: 'A tooltip for the visibility icon button in the runs table next to the hidden run group',
      },
      hide: {
        defaultMessage: 'Hide group',
        description: 'A tooltip for the visibility icon button in the runs table next to the visible run group',
      },
    }),
    runs: defineMessages({
      unhide: {
        defaultMessage: 'Unhide run',
        description: 'A tooltip for the visibility icon button in the runs table next to the hidden run',
      },
      hide: {
        defaultMessage: 'Hide run',
        description: 'A tooltip for the visibility icon button in the runs table next to the visible run',
      },
    }),
  },
  pinning: {
    groups: defineMessages({
      unpin: {
        defaultMessage: 'Unpin group',
        description: 'A tooltip for the pin icon button in the runs table next to the pinned run group',
      },
      pin: {
        defaultMessage: 'Pin group',
        description: 'A tooltip for the pin icon button in the runs table next to the not pinned run group',
      },
    }),
    runs: defineMessages({
      unpin: {
        defaultMessage: 'Unpin run',
        description: 'A tooltip for the pin icon button in the runs table next to the pinned run',
      },
      pin: {
        defaultMessage: 'Pin run',
        description: 'A tooltip for the pin icon button in the runs table next to the not pinned run',
      },
    }),
  },
};

export const RowActionsCellRenderer = React.memo(
  (props: {
    data: RunRowType;
    value: { pinned: boolean; hidden: boolean };
    onTogglePin: (runUuid: string) => void;
    onToggleVisibility: (runUuidOrToggle: string | RUNS_VISIBILITY_MODE, runUuid?: string) => void;
  }) => {
    const updateUIState = useUpdateExperimentViewUIState();
    const { theme } = useDesignSystemTheme();
    const { useGroupedValuesInCharts } = useExperimentViewRunsTableHeaderContext();

    const { groupParentInfo, runDateAndNestInfo, visibilityControl } = props.data;
    const { belongsToGroup } = runDateAndNestInfo || {};
    const isGroupRow = Boolean(groupParentInfo);
    const isVisibilityButtonDisabled = visibilityControl === RunRowVisibilityControl.Disabled;
    const { pinned, hidden } = props.value;
    const { runUuid, rowUuid } = props.data;

    // If a row is a run group, we use its rowUuid for setting visibility.
    // If this is a run, use runUuid.
    const runUuidToToggle = groupParentInfo ? rowUuid : runUuid;

    const isRowHidden = (() => {
      // If "Use grouping from the runs table in charts" option is off and we're displaying a group,
      // we should check if all runs in the group are hidden in order to determine visibility toggle.
      if (useGroupedValuesInCharts === false && groupParentInfo) {
        return Boolean(groupParentInfo.allRunsHidden);
      }

      // Otherwise, we should use the hidden flag from the row itself.
      return hidden;
    })();

    const visibilityMessageDescriptor = isGroupRow
      ? isRowHidden
        ? labels.visibility.groups.unhide
        : labels.visibility.groups.hide
      : isRowHidden
      ? labels.visibility.runs.unhide
      : labels.visibility.runs.hide;

    const pinningMessageDescriptor = isGroupRow
      ? pinned
        ? labels.pinning.groups.unpin
        : labels.pinning.groups.pin
      : pinned
      ? labels.pinning.runs.unpin
      : labels.pinning.runs.pin;

    const isVisibilityButtonHidden = visibilityControl === RunRowVisibilityControl.Hidden;

    return (
      <div css={styles.actionsContainer}>
        <RunVisibilityControlButton
          rowHidden={isRowHidden}
          buttonHidden={isVisibilityButtonHidden}
          disabled={isVisibilityButtonDisabled}
          label={<FormattedMessage {...visibilityMessageDescriptor} />}
          onClick={props.onToggleVisibility}
          runUuid={runUuidToToggle}
          css={[
            styles.actionCheckbox(theme),
            // We show this button only in the runs compare mode
            styles.showOnlyInCompareMode,
          ]}
        />
        {((props.data.pinnable && runUuid) || groupParentInfo) && (
          <Tooltip
            componentId="mlflow.run.row_actions.pinning.tooltip"
            delayDuration={0}
            side="right"
            // We have to force remount of the tooltip with every rerender, otherwise it will jump
            // around when the row order changes.
            key={Math.random()}
            content={<FormattedMessage {...pinningMessageDescriptor} />}
          >
            <label css={styles.actionCheckbox(theme)} className="is-pin-toggle" data-testid="column-pin-toggle">
              <span css={visuallyHidden}>
                <FormattedMessage {...pinningMessageDescriptor} />
              </span>
              <input
                type="checkbox"
                checked={pinned}
                onChange={() => {
                  const uuidToPin = groupParentInfo ? props.data.rowUuid : runUuid;
                  updateUIState((existingState) => {
                    if (uuidToPin) {
                      return {
                        ...existingState,
                        runsPinned: !existingState.runsPinned.includes(uuidToPin)
                          ? [...existingState.runsPinned, uuidToPin]
                          : existingState.runsPinned.filter((r) => r !== uuidToPin),
                      };
                    }
                    return existingState;
                  });
                }}
              />
              {pinned ? <PinFillIcon /> : <PinIcon />}
            </label>
          </Tooltip>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.value.hidden === nextProps.value.hidden &&
    prevProps.value.pinned === nextProps.value.pinned &&
    prevProps.data.visibilityControl === nextProps.data.visibilityControl &&
    prevProps.data.groupParentInfo?.allRunsHidden === nextProps.data.groupParentInfo?.allRunsHidden,
);

/**
 * A utility function that enables custom keyboard navigation for the row actions cell renderer by providing
 * conditional suppression of default events.
 */
export const RowActionsCellRendererSuppressKeyboardEvents = ({ event }: SuppressKeyboardEventParams) => {
  if (
    event.key === 'Tab' &&
    event.target instanceof HTMLElement &&
    // Let's suppress the default action if the focus is on cell or on visibility toggle checkbox, allowing
    // tab to move to the next focusable element.
    (event.target.classList.contains('ag-cell') || event.target.classList.contains('is-visibility-toggle-checkbox'))
  ) {
    return true;
  }
  return false;
};

const styles = {
  actionsContainer: {
    display: 'flex',
    gap: 18, // In design there's 20 px of gutter, it's minus 2 px due to pin icon's internal padding
  },
  showOnlyInCompareMode: {
    display: 'none',
    '.is-table-comparing-runs-mode &': {
      display: 'flex',
    },
  },
  actionCheckbox: (theme: Theme) => ({
    input: { width: 0, appearance: 'none' as const },
    cursor: 'pointer',
    display: 'flex',
    svg: {
      width: theme.general.iconFontSize,
      height: theme.general.iconFontSize,
      cursor: 'pointer',
    },
    // Styling for the pin button - it's transparent when unpinned and not hovered
    '&.is-pin-toggle svg': {
      color: 'transparent',
      '.ag-row:hover &': {
        color: theme.colors.grey500,
      },
    },
    '& input:checked + span svg': {
      color: theme.colors.grey500,
    },
    '& input:focus-visible + span svg': {
      color: theme.colors.grey500,
    },
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: RowActionsHeaderCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/RowActionsHeaderCellRenderer.tsx
Signals: React

```typescript
import { DashIcon, DropdownMenu, Icon, VisibleOffIcon, useDesignSystemTheme } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RUNS_VISIBILITY_MODE } from '@mlflow/mlflow/src/experiment-tracking/components/experiment-page/models/ExperimentPageUIState';
// TODO: Import this icon from design system when added
import { ReactComponent as VisibleFillIcon } from '../../../../../../common/static/icon-visible-fill.svg';
import { useExperimentViewRunsTableHeaderContext } from '../ExperimentViewRunsTableHeaderContext';

const VisibleIcon = () => <Icon component={VisibleFillIcon} />;

const RowActionsHeaderCellRendererV2 = React.memo(
  ({
    onToggleVisibility,
  }: {
    onToggleVisibility: (mode: RUNS_VISIBILITY_MODE | string, runOrGroupUuid?: string) => void;
  }) => {
    const { theme } = useDesignSystemTheme();
    const intl = useIntl();
    const { runsHiddenMode, usingCustomVisibility, allRunsHidden } = useExperimentViewRunsTableHeaderContext();

    return (
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button
            css={[
              styles.actionButton(theme),
              // We show this button only in the runs compare mode
              styles.showOnlyInCompareMode,
            ]}
            data-testid="experiment-view-runs-visibility-column-header"
            aria-label={intl.formatMessage({
              defaultMessage: 'Toggle visibility of runs',
              description: 'Experiment page > runs table > toggle visibility of runs > accessible label',
            })}
          >
            {runsHiddenMode === RUNS_VISIBILITY_MODE.HIDEALL || allRunsHidden ? <VisibleOffIcon /> : <VisibleIcon />}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.RadioGroup
            componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_rowactionsheadercellrenderer.tsx_52"
            value={runsHiddenMode}
            onValueChange={(e) => onToggleVisibility(e)}
          >
            <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.FIRST_10_RUNS}>
              {/* Dropdown menu does not support indeterminate state, so we're doing it manually */}
              <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
              <FormattedMessage
                defaultMessage="Show first 10"
                description="Menu option for showing only 10 first runs in the experiment view runs compare mode"
              />
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.FIRST_20_RUNS}>
              <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
              <FormattedMessage
                defaultMessage="Show first 20"
                description="Menu option for showing only 10 first runs in the experiment view runs compare mode"
              />
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.SHOWALL}>
              <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
              <FormattedMessage
                defaultMessage="Show all runs"
                description="Menu option for revealing all hidden runs in the experiment view runs compare mode"
              />
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.HIDEALL}>
              <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
              <FormattedMessage
                defaultMessage="Hide all runs"
                description="Menu option for revealing all hidden runs in the experiment view runs compare mode"
              />
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value={RUNS_VISIBILITY_MODE.HIDE_FINISHED_RUNS}>
              <DropdownMenu.ItemIndicator>{usingCustomVisibility ? <DashIcon /> : null}</DropdownMenu.ItemIndicator>
              <FormattedMessage
                defaultMessage="Hide finished runs"
                description="Menu option for hiding all finished runs in the experiment view runs compare mode"
              />
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
);

/**
 * A component used to render "eye" icon in the table header used to hide/show all runs
 */
export const RowActionsHeaderCellRenderer = React.memo(
  (props: {
    allRunsHidden?: boolean;
    usingCustomVisibility?: boolean;
    onToggleVisibility: (runUuidOrToggle: string) => void;
    eGridHeader?: HTMLElement;
  }) => {
    const intl = useIntl();

    // Since ag-grid does not add accessible labels to its checkboxes, we do it manually.
    // This is executed once per table lifetime.
    useEffect(() => {
      // Find a checkbox in the header
      const selectAllCheckbox = props.eGridHeader?.querySelector('input');

      // If found, assign aria-label attribute
      if (selectAllCheckbox) {
        selectAllCheckbox.ariaLabel = intl.formatMessage({
          defaultMessage: 'Select all runs',
          description: 'Experiment page > runs table > select all rows > accessible label',
        });
      }
    }, [props.eGridHeader, intl]);

    return <RowActionsHeaderCellRendererV2 {...props} />;
  },
);

const styles = {
  actionButton: (theme: Theme) => ({
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    // When visibility icon is next to the ag-grid checkbox, remove the bonus padding
    '.ag-checkbox:not(.ag-hidden) + &': { padding: '0 1px' },
    svg: {
      width: theme.general.iconFontSize,
      height: theme.general.iconFontSize,
      cursor: 'pointer',
      color: theme.colors.grey500,
    },
  }),
  showOnlyInCompareMode: {
    display: 'none',
    '.is-table-comparing-runs-mode &': {
      display: 'flex',
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: RunDescriptionCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/RunDescriptionCellRenderer.tsx
Signals: React

```typescript
import React from 'react';
import { Tooltip } from '@databricks/design-system';
import Utils from '../../../../../../common/utils/Utils';
import type { RunRowType } from '../../../utils/experimentPage.row-types';
import { TrimmedText } from '../../../../../../common/components/TrimmedText';

export const RunDescriptionCellRenderer = React.memo(({ value }: { value: RunRowType['tags'] }) => {
  const description = Utils.getRunDescriptionFromTags(value) || '-';
  return (
    <>
      <Tooltip componentId="mlflow.experiment-tracking.run-description.display" content={description}>
        <span>
          <TrimmedText text={description} maxSize={50} />
        </span>
      </Tooltip>
    </>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: RunNameCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/RunNameCellRenderer.tsx
Signals: React

```typescript
import type { ICellRendererParams } from '@ag-grid-community/core';
import { Button, MinusSquareIcon, PlusSquareIcon, useDesignSystemTheme } from '@databricks/design-system';
import type { Theme } from '@emotion/react';
import React, { useMemo } from 'react';
import { Link } from '../../../../../../common/utils/RoutingUtils';
import Routes from '../../../../../routes';
import type { RunRowType } from '../../../utils/experimentPage.row-types';
import { GroupParentCellRenderer } from './GroupParentCellRenderer';
import invariant from 'invariant';
import { RunColorPill } from '../../RunColorPill';
import { useGetExperimentRunColor, useSaveExperimentRunColor } from '../../../hooks/useExperimentRunColor';
import { useExperimentViewRunsTableHeaderContext } from '../ExperimentViewRunsTableHeaderContext';

export interface RunNameCellRendererProps extends ICellRendererParams {
  data: RunRowType;
  isComparingRuns?: boolean;
  onExpand: (runUuid: string, childrenIds?: string[]) => void;
}

export const RunNameCellRenderer = React.memo((props: RunNameCellRendererProps) => {
  const { theme } = useDesignSystemTheme();

  const saveRunColor = useSaveExperimentRunColor();
  const getRunColor = useGetExperimentRunColor();
  const { useGroupedValuesInCharts } = useExperimentViewRunsTableHeaderContext();

  // If we're rendering a group row, use relevant component
  if (props.data.groupParentInfo) {
    return <GroupParentCellRenderer {...props} />;
  }
  const { onExpand, data } = props;
  const { runName, experimentId, runUuid, runDateAndNestInfo, hidden } = data;

  // If we are not rendering a group, assert existence of necessary fields
  invariant(experimentId, 'experimentId should be set for run rows');
  invariant(runUuid, 'runUuid should be set for run rows');
  invariant(runDateAndNestInfo, 'runDateAndNestInfo should be set for run rows');

  const { hasExpander, expanderOpen, childrenIds, level, belongsToGroup } = runDateAndNestInfo;

  const renderingAsParent = !isNaN(level) && hasExpander;
  const hideRunColorControl = belongsToGroup && useGroupedValuesInCharts;

  return (
    <div css={styles.cellWrapper}>
      <div css={styles.expanderWrapper}>
        <div
          css={styles.nestLevel(theme)}
          style={{
            width: (level + 1) * theme.spacing.lg,
          }}
        >
          {renderingAsParent && (
            <Button
              componentId="codegen_mlflow_app_src_experiment-tracking_components_experiment-page_components_runs_cells_runnamecellrenderer.tsx_46"
              css={styles.expanderButton}
              size="small"
              onClick={() => {
                onExpand(runUuid, childrenIds);
              }}
              key={'Expander-' + runUuid}
              type="link"
              icon={expanderOpen ? <MinusSquareIcon /> : <PlusSquareIcon />}
            />
          )}
        </div>
      </div>
      <div css={styles.runLink}>
        {hideRunColorControl ? (
          // Render empty color pills for grouped runs
          <div css={{ width: 12, height: 12, flexShrink: 0 }} />
        ) : (
          <RunColorPill
            color={getRunColor(runUuid)}
            hidden={props.isComparingRuns && hidden}
            data-testid="experiment-view-table-run-color"
            onChangeColor={(colorValue) => saveRunColor({ runUuid, colorValue })}
          />
        )}
        <Link to={Routes.getRunPageRoute(experimentId, runUuid)} css={styles.runLink} tabIndex={0}>
          <span css={styles.runName}>{runName}</span>
        </Link>
      </div>
    </div>
  );
});

const styles = {
  link: (theme: Theme) => ({
    display: 'inline-block',
    minWidth: theme.typography.fontSizeBase,
    minHeight: theme.typography.fontSizeBase,
  }),
  cellWrapper: {
    display: 'flex',
  },
  expanderButton: {
    svg: {
      width: 12,
      height: 12,
    },
  },
  runLink: {
    overflow: 'hidden',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    '&:focus-visible': {
      textDecoration: 'underline',
    },
  },
  runName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  expanderWrapper: {
    display: 'none',
    '.ag-grid-expanders-visible &': {
      display: 'block',
    },
  },
  nestLevel: (theme: Theme) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    height: theme.spacing.lg,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: RunVisibilityControlButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/RunVisibilityControlButton.tsx

```typescript
import { Icon, Tooltip, VisibleOffIcon, useDesignSystemTheme, visuallyHidden } from '@databricks/design-system';
import { RUNS_VISIBILITY_MODE } from '../../../models/ExperimentPageUIState';
import { ReactComponent as VisibleFillIcon } from '../../../../../../common/static/icon-visible-fill.svg';
import type { Theme } from '@emotion/react';

const VisibleIcon = () => <Icon component={VisibleFillIcon} />;

interface RunVisibilityControlButtonProps {
  className?: string;
  runUuid: string;
  rowHidden: boolean;
  buttonHidden: boolean;
  disabled: boolean;
  onClick: (runUuidOrToggle: string | RUNS_VISIBILITY_MODE, runUuid?: string, isRowVisible?: boolean) => void;
  label: React.ReactNode;
}

export const RunVisibilityControlButton = ({
  runUuid,
  className,
  rowHidden,
  buttonHidden,
  disabled,
  onClick,
  label,
}: RunVisibilityControlButtonProps) => {
  const { theme } = useDesignSystemTheme();
  if (buttonHidden) {
    return <div className={className} css={[styles.button(theme)]} />;
  }
  if (disabled) {
    return (
      <VisibleOffIcon
        className={className}
        css={[
          styles.button(theme),
          {
            opacity: 0.25,
            color: theme.colors.grey400,
          },
        ]}
      />
    );
  }
  return (
    <Tooltip delayDuration={0} side="left" content={label} componentId="mlflow.run.row_actions.visibility.tooltip">
      <label className={className} css={styles.button(theme)}>
        <span css={visuallyHidden}>{label}</span>
        <input
          type="checkbox"
          className="is-visibility-toggle-checkbox"
          checked={!rowHidden}
          onChange={() => {
            if (runUuid) {
              const isRowVisible = !rowHidden;
              onClick(RUNS_VISIBILITY_MODE.CUSTOM, runUuid, isRowVisible);
            }
          }}
        />
        {!rowHidden ? <VisibleIcon /> : <VisibleOffIcon />}
      </label>
    </Tooltip>
  );
};

const styles = {
  button: (theme: Theme) => ({
    width: theme.general.iconFontSize,
    color: theme.colors.grey400,
    '.ag-row:hover &': {
      color: theme.colors.grey500,
    },
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: SourceCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/SourceCellRenderer.tsx
Signals: React

```typescript
import React from 'react';
import Utils from '../../../../../../common/utils/Utils';
import type { RunRowType } from '../../../utils/experimentPage.row-types';
import { useDesignSystemTheme } from '@databricks/design-system';
import { ExperimentSourceTypeIcon } from '../../../../ExperimentSourceTypeIcon';

export const SourceCellRenderer = React.memo(({ value: tags }: { value: RunRowType['tags'] }) => {
  const { theme } = useDesignSystemTheme();
  if (!tags) {
    return <>-</>;
  }
  const sourceType = tags[Utils.sourceTypeTag]?.value || '';

  const sourceLink = Utils.renderSource(tags || {}, undefined, undefined);
  return sourceLink ? (
    <div css={{ display: 'flex', gap: theme.spacing.xs, alignItems: 'center' }}>
      <ExperimentSourceTypeIcon sourceType={sourceType} css={{ color: theme.colors.textSecondary }} />
      <span css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sourceLink}</span>
    </div>
  ) : (
    <>-</>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: VersionCellRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/components/experiment-page/components/runs/cells/VersionCellRenderer.tsx
Signals: React

```typescript
import React from 'react';
import Utils from '../../../../../../common/utils/Utils';
import type { RunRowVersionInfo } from '../../../utils/experimentPage.row-types';

export const VersionCellRenderer = React.memo(({ value }: { value?: RunRowVersionInfo }) => {
  if (!value) {
    return <>-</>;
  }
  const {
    // Run row version object parameters
    version,
    name,
    type,
  } = value;

  return (
    Utils.renderSourceVersion(
      // Using function from utils to render the source link
      version,
      name,
      type,
    ) || <>-</>
  );
});
```

--------------------------------------------------------------------------------

````

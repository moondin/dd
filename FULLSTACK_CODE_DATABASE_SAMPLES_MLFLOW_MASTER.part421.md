---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 421
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 421 of 991)

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

---[FILE: KeyValueTag.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/KeyValueTag.tsx
Signals: React

```typescript
import { Tag, Tooltip, Typography } from '@databricks/design-system';
import type { KeyValueEntity } from '../types';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { KeyValueTagFullViewModal } from './KeyValueTagFullViewModal';
import type { Interpolation, Theme } from '@emotion/react';

/**
 * An arbitrary number that is used to determine if a tag is too
 * long and should be truncated. We want to avoid short keys or values
 * in a long tag to be truncated
 * */
const TRUNCATE_ON_CHARS_LENGTH = 30;

function getTruncatedStyles(shouldTruncate = true): Interpolation<Theme> {
  return shouldTruncate
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textWrap: 'nowrap',
        whiteSpace: 'nowrap' as const,
      }
    : { whiteSpace: 'nowrap' as const };
}

/**
 * A <Tag /> wrapper used for displaying key-value entity
 */
export const KeyValueTag = ({
  isClosable = false,
  onClose,
  tag,
  enableFullViewModal = false,
  charLimit = TRUNCATE_ON_CHARS_LENGTH,
  maxWidth = 300,
  className,
}: {
  isClosable?: boolean;
  onClose?: () => void;
  tag: KeyValueEntity;
  enableFullViewModal?: boolean;
  charLimit?: number;
  maxWidth?: number;
  className?: string;
}) => {
  const intl = useIntl();

  const [isKeyValueTagFullViewModalVisible, setIsKeyValueTagFullViewModalVisible] = useState(false);

  const { shouldTruncateKey, shouldTruncateValue } = getKeyAndValueComplexTruncation(tag, charLimit);
  const allowFullViewModal = enableFullViewModal && (shouldTruncateKey || shouldTruncateValue);

  const fullViewModalLabel = intl.formatMessage({
    defaultMessage: 'Click to see more',
    description: 'Run page > Overview > Tags cell > Tag',
  });

  return (
    <div>
      <Tag
        componentId="codegen_mlflow_app_src_common_components_keyvaluetag.tsx_60"
        closable={isClosable}
        onClose={onClose}
        title={tag.key}
        className={className}
      >
        <Tooltip
          content={allowFullViewModal ? fullViewModalLabel : ''}
          componentId="mlflow.common.components.key-value-tag.tooltip"
        >
          <span
            css={{ maxWidth, display: 'inline-flex' }}
            onClick={() => (allowFullViewModal ? setIsKeyValueTagFullViewModalVisible(true) : undefined)}
          >
            <Typography.Text bold title={tag.key} css={getTruncatedStyles(shouldTruncateKey)}>
              {tag.key}
            </Typography.Text>
            {tag.value && (
              <Typography.Text title={tag.value} css={getTruncatedStyles(shouldTruncateValue)}>
                : {tag.value}
              </Typography.Text>
            )}
          </span>
        </Tooltip>
      </Tag>
      <div>
        {isKeyValueTagFullViewModalVisible && (
          <KeyValueTagFullViewModal
            tagKey={tag.key}
            tagValue={tag.value}
            isKeyValueTagFullViewModalVisible={isKeyValueTagFullViewModalVisible}
            setIsKeyValueTagFullViewModalVisible={setIsKeyValueTagFullViewModalVisible}
          />
        )}
      </div>
    </div>
  );
};

export function getKeyAndValueComplexTruncation(
  tag: KeyValueEntity,
  charLimit = TRUNCATE_ON_CHARS_LENGTH,
): { shouldTruncateKey: boolean; shouldTruncateValue: boolean } {
  const { key, value } = tag;
  const fullLength = key.length + value.length;
  const isKeyLonger = key.length > value.length;
  const shorterLength = isKeyLonger ? value.length : key.length;

  // No need to truncate if tag is short enough
  if (fullLength <= charLimit) return { shouldTruncateKey: false, shouldTruncateValue: false };
  // If the shorter string is too long, truncate both key and value.
  if (shorterLength > charLimit / 2) return { shouldTruncateKey: true, shouldTruncateValue: true };

  // Otherwise truncate the longer string
  return {
    shouldTruncateKey: isKeyLonger,
    shouldTruncateValue: !isKeyLonger,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTagFullViewModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/KeyValueTagFullViewModal.test.tsx

```typescript
import { describe, jest, beforeAll, afterAll, test, expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { KeyValueTagFullViewModal } from './KeyValueTagFullViewModal';
import { DesignSystemProvider } from '@databricks/design-system';
import { screen, renderWithIntl } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';

describe('KeyValueTagFullViewModal', () => {
  const mockSetIsKeyValueTagFullViewModalVisible = jest.fn();

  let navigatorClipboard: Clipboard;

  // Prepare fake clipboard
  beforeAll(() => {
    navigatorClipboard = navigator.clipboard;
    (navigator.clipboard as any) = { writeText: jest.fn() };
  });

  // Cleanup and restore clipboard
  afterAll(() => {
    (navigator.clipboard as any) = navigatorClipboard;
  });

  test('renders the component', async () => {
    const longKey = '123'.repeat(100);
    const longValue = 'abc'.repeat(100);

    renderWithIntl(
      <DesignSystemProvider>
        <KeyValueTagFullViewModal
          tagKey={longKey}
          tagValue={longValue}
          setIsKeyValueTagFullViewModalVisible={mockSetIsKeyValueTagFullViewModalVisible}
          isKeyValueTagFullViewModalVisible
        />
      </DesignSystemProvider>,
    );

    expect(screen.getByText('Tag: ' + longKey)).toBeInTheDocument();
    expect(screen.getByText(longValue)).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Copy'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longValue);

    await userEvent.click(screen.getByLabelText('Close'));

    expect(mockSetIsKeyValueTagFullViewModalVisible).toHaveBeenCalledWith(false);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTagFullViewModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/KeyValueTagFullViewModal.tsx
Signals: React

```typescript
import React from 'react';
import { Modal, Typography, CopyIcon, useDesignSystemTheme } from '@databricks/design-system';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';

const { Paragraph } = Typography;

export interface KeyValueTagFullViewModalProps {
  tagKey: string;
  tagValue: string;
  setIsKeyValueTagFullViewModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isKeyValueTagFullViewModalVisible: boolean;
}

export const KeyValueTagFullViewModal = React.memo((props: KeyValueTagFullViewModalProps) => {
  const { theme } = useDesignSystemTheme();

  return (
    <Modal
      componentId="codegen_mlflow_app_src_common_components_keyvaluetagfullviewmodal.tsx_17"
      title={'Tag: ' + props.tagKey}
      visible={props.isKeyValueTagFullViewModalVisible}
      onCancel={() => props.setIsKeyValueTagFullViewModalVisible(false)}
    >
      <div css={{ display: 'flex' }}>
        <Paragraph css={{ flexGrow: 1 }}>
          <pre
            css={{
              backgroundColor: theme.colors.backgroundPrimary,
              marginTop: theme.spacing.sm,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {props.tagValue}
          </pre>
        </Paragraph>
        <div
          css={{
            marginTop: theme.spacing.sm,
          }}
        >
          <CopyButton copyText={props.tagValue} showLabel={false} icon={<CopyIcon />} aria-label="Copy" />
        </div>
      </div>
    </Modal>
  );
});
```

--------------------------------------------------------------------------------

---[FILE: KeyValueTagsEditorCell.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/KeyValueTagsEditorCell.tsx

```typescript
import { Button, PencilIcon, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from 'react-intl';
import type { KeyValueEntity } from '../types';
import { KeyValueTag } from './KeyValueTag';

interface KeyValueTagsEditorCellProps {
  tags?: KeyValueEntity[];
  onAddEdit: () => void;
}

/**
 * A cell renderer used in tables, displaying a list of key-value tags with button for editing those
 */
export const KeyValueTagsEditorCell = ({ tags = [], onAddEdit }: KeyValueTagsEditorCellProps) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        '> *': {
          marginRight: '0 !important',
        },
        gap: theme.spacing.xs,
      }}
    >
      {tags.length < 1 ? (
        <Button
          componentId="codegen_mlflow_app_src_common_components_keyvaluetagseditorcell.tsx_29"
          size="small"
          type="link"
          onClick={onAddEdit}
        >
          <FormattedMessage defaultMessage="Add" description="Key-value tag table cell > 'add' button label" />
        </Button>
      ) : (
        <>
          {tags.map((tag) => (
            <KeyValueTag tag={tag} key={`${tag.key}-${tag.value}`} />
          ))}
          <Button
            componentId="codegen_mlflow_app_src_common_components_keyvaluetagseditorcell.tsx_37"
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

---[FILE: MlflowHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/MlflowHeader.tsx

```typescript
import ExperimentTrackingRoutes from '../../experiment-tracking/routes';
import { Link } from '../utils/RoutingUtils';
import { HomePageDocsUrl, Version } from '../constants';
import { DarkThemeSwitch } from '@mlflow/mlflow/src/common/components/DarkThemeSwitch';
import { Button, MenuIcon, useDesignSystemTheme } from '@databricks/design-system';
import { MlflowLogo } from './MlflowLogo';

export const MlflowHeader = ({
  isDarkTheme = false,
  setIsDarkTheme = (val: boolean) => {},
  sidebarOpen,
  toggleSidebar,
}: {
  isDarkTheme?: boolean;
  setIsDarkTheme?: (isDarkTheme: boolean) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <header
      css={{
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.textSecondary,
        display: 'flex',
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.md,
        paddingTop: theme.spacing.sm + theme.spacing.xs,
        paddingBottom: theme.spacing.xs,
        a: {
          color: theme.colors.textSecondary,
        },
        alignItems: 'center',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          type="tertiary"
          componentId="mlflow_header.toggle_sidebar_button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-pressed={sidebarOpen}
          icon={<MenuIcon />}
        />
        <Link to={ExperimentTrackingRoutes.rootRoute}>
          <MlflowLogo
            css={{
              display: 'block',
              height: theme.spacing.md * 2,
              color: theme.colors.textPrimary,
            }}
          />
        </Link>
        <span
          css={{
            fontSize: theme.typography.fontSizeSm,
          }}
        >
          {Version}
        </span>
      </div>
      <div css={{ flex: 1 }} />
      <div css={{ display: 'flex', gap: theme.spacing.lg, alignItems: 'center' }}>
        <DarkThemeSwitch isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
        <a href="https://github.com/mlflow/mlflow">GitHub</a>
        <a href={HomePageDocsUrl}>Docs</a>
      </div>
    </header>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: MlflowLogo.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/MlflowLogo.tsx

```typescript
export const MlflowLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="109" height="40" viewBox="0 0 109 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>MLflow</title>
      <path
        d="M0 31.0316V15.5024H3.54258V17.4699C4.43636 15.8756 6.38278 15.045 8.13589 15.045C10.178 15.045 11.9636 15.9713 12.7943 17.7895C14.0096 15.7474 15.8278 15.045 17.8373 15.045C20.6469 15.045 23.3263 16.8325 23.3263 20.9493V31.0316H19.7531V21.5541C19.7531 19.7359 18.8268 18.3636 16.7522 18.3636C14.8057 18.3636 13.5292 19.8947 13.5292 21.8086V31.0297H9.89282V21.5541C9.89282 19.7684 8.99522 18.3732 6.88995 18.3732C4.91292 18.3732 3.66699 19.8412 3.66699 21.8182V31.0392Z"
        fill="currentColor"
      />
      <path d="M27.8546 31.0316V7.92917H31.5579V31.0316Z" fill="currentColor" />
      <path
        d="M30.0708 39.4871C30.9033 39.7187 31.6517 39.8699 33.2402 39.8699C36.1933 39.8699 39.6765 38.2048 40.5933 33.5311L44.3789 14.7923H50.0076L50.6947 11.6746H45.0086L45.7741 7.95023C46.3598 5.05837 47.9598 3.59234 50.5282 3.59234C51.1962 3.59234 51.0086 3.64975 51.6038 3.76267L52.4268 0.570327C51.6344 0.333006 50.9244 0.191379 49.378 0.191379C47.7454 0.166831 46.1514 0.688934 44.8497 1.67463C43.4086 2.78851 42.4574 4.42487 42.023 6.53779L40.9569 11.6746H35.9234L35.5119 14.7943H40.3349L36.8593 32.1206C36.4765 34.0861 35.3588 36.4364 32.1512 36.4364C31.4239 36.4364 31.688 36.3809 31.0297 36.2737Z"
        fill="#0194E2"
      />
      <path d="M53.3416 30.9053H49.6402L54.7139 7.59616H58.4153Z" fill="#0194E2" />
      <path
        d="M71.8067 16.4766C68.5762 14.2161 64.1778 14.6606 61.4649 17.5216C58.7519 20.3826 58.5416 24.7984 60.9703 27.9043L63.3952 26.1244C62.1915 24.6312 61.9471 22.5815 62.7658 20.8471C63.5845 19.1127 65.3224 17.9987 67.2402 17.979V19.8737Z"
        fill="#43C9ED"
      />
      <path
        d="M62.6179 29.4717C65.8484 31.7322 70.2468 31.2877 72.9597 28.4267C75.6727 25.5657 75.883 21.1499 73.4543 18.044L71.0294 19.8239C72.2331 21.3171 72.4775 23.3668 71.6588 25.1012C70.8401 26.8356 69.1022 27.9496 67.1844 27.9693V26.0746Z"
        fill="#0194E2"
      />
      <path
        d="M78.0919 15.4928H82.1359L82.9588 26.1053L88.7177 15.4928L92.5569 15.5483L94.0651 26.1053L99.1387 15.4928L102.84 15.5483L95.1617 31.0412H91.4603L89.6765 19.9349L83.7818 31.0412H79.9426Z"
        fill="#0194E2"
      />
      <path d="M105.072 15.7684H104.306V15.5024H106.151V15.7741H105.386V18.0172H105.072Z" fill="#0194E2" />
      <path
        d="M106.614 15.5024H106.997L107.479 16.8421C107.541 17.0143 107.598 17.1904 107.657 17.3665H107.675C107.734 17.1904 107.788 17.0143 107.847 16.8421L108.325 15.5024H108.708V18.0172H108.41V16.6297C108.41 16.4096 108.434 16.1072 108.45 15.8832H108.434L108.243 16.4574L107.768 17.7608H107.56L107.079 16.4593L106.888 15.8852H106.873C106.89 16.1091 106.915 16.4115 106.915 16.6316V18.0191H106.624Z"
        fill="#0194E2"
      />
    </svg>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: MlflowSidebar.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/MlflowSidebar.tsx
Signals: React

```typescript
import {
  BeakerIcon,
  Button,
  DatabaseIcon,
  DropdownMenu,
  GearIcon,
  HomeIcon,
  ModelsIcon,
  PlusIcon,
  TextBoxIcon,
  useDesignSystemTheme,
  DesignSystemEventProviderComponentTypes,
  DesignSystemEventProviderAnalyticsEventTypes,
} from '@databricks/design-system';
import type { Location } from '../utils/RoutingUtils';
import { Link, matchPath, useLocation, useNavigate } from '../utils/RoutingUtils';
import ExperimentTrackingRoutes from '../../experiment-tracking/routes';
import { ModelRegistryRoutes } from '../../model-registry/routes';
import GatewayRoutes from '../../gateway/routes';
import { CreateExperimentModal } from '../../experiment-tracking/components/modals/CreateExperimentModal';
import { useMemo, useState } from 'react';
import { useInvalidateExperimentList } from '../../experiment-tracking/components/experiment-page/hooks/useExperimentListQuery';
import { CreateModelModal } from '../../model-registry/components/CreateModelModal';
import {
  CreatePromptModalMode,
  useCreatePromptModal,
} from '../../experiment-tracking/pages/prompts/hooks/useCreatePromptModal';
import Routes from '../../experiment-tracking/routes';
import { FormattedMessage } from 'react-intl';
import { useLogTelemetryEvent } from '../../telemetry/hooks/useLogTelemetryEvent';

const isHomeActive = (location: Location) => matchPath({ path: '/', end: true }, location.pathname);
const isExperimentsActive = (location: Location) =>
  matchPath('/experiments/*', location.pathname) || matchPath('/compare-experiments/*', location.pathname);
const isModelsActive = (location: Location) => matchPath('/models/*', location.pathname);
const isPromptsActive = (location: Location) => matchPath('/prompts/*', location.pathname);
const isGatewayActive = (location: Location) => matchPath('/gateway/*', location.pathname);
const isSettingsActive = (location: Location) => matchPath('/settings/*', location.pathname);

export function MlflowSidebar() {
  const location = useLocation();
  const { theme } = useDesignSystemTheme();
  const invalidateExperimentList = useInvalidateExperimentList();
  const navigate = useNavigate();
  const viewId = useMemo(() => crypto.randomUUID(), []);

  const [showCreateExperimentModal, setShowCreateExperimentModal] = useState(false);
  const [showCreateModelModal, setShowCreateModelModal] = useState(false);
  const { CreatePromptModal, openModal: openCreatePromptModal } = useCreatePromptModal({
    mode: CreatePromptModalMode.CreatePrompt,
    onSuccess: ({ promptName }) => navigate(Routes.getPromptDetailsPageRoute(promptName)),
  });

  const menuItems = [
    {
      key: 'home',
      icon: <HomeIcon />,
      linkProps: {
        to: ExperimentTrackingRoutes.rootRoute,
        isActive: isHomeActive,
        children: <FormattedMessage defaultMessage="Home" description="Sidebar link for home page" />,
      },
      componentId: 'mlflow.sidebar.home_tab_link',
    },
    {
      key: 'experiments',
      icon: <BeakerIcon />,
      linkProps: {
        to: ExperimentTrackingRoutes.experimentsObservatoryRoute,
        isActive: isExperimentsActive,
        children: <FormattedMessage defaultMessage="Experiments" description="Sidebar link for experiments tab" />,
      },
      componentId: 'mlflow.sidebar.experiments_tab_link',
      dropdownProps: {
        componentId: 'mlflow_sidebar.create_experiment_button',
        onClick: () => setShowCreateExperimentModal(true),
        children: (
          <FormattedMessage
            defaultMessage="Experiment"
            description="Sidebar button inside the 'new' popover to create new experiment"
          />
        ),
      },
    },
    {
      key: 'models',
      icon: <ModelsIcon />,
      linkProps: {
        to: ModelRegistryRoutes.modelListPageRoute,
        isActive: isModelsActive,
        children: <FormattedMessage defaultMessage="Models" description="Sidebar link for models tab" />,
      },
      componentId: 'mlflow.sidebar.models_tab_link',
      dropdownProps: {
        componentId: 'mlflow_sidebar.create_model_button',
        onClick: () => setShowCreateModelModal(true),
        children: (
          <FormattedMessage
            defaultMessage="Model"
            description="Sidebar button inside the 'new' popover to create new model"
          />
        ),
      },
    },
    {
      key: 'prompts',
      icon: <TextBoxIcon />,
      linkProps: {
        to: ExperimentTrackingRoutes.promptsPageRoute,
        isActive: isPromptsActive,
        children: <FormattedMessage defaultMessage="Prompts" description="Sidebar link for prompts tab" />,
      },
      componentId: 'mlflow.sidebar.prompts_tab_link',
      dropdownProps: {
        componentId: 'mlflow_sidebar.create_prompt_button',
        onClick: openCreatePromptModal,
        children: (
          <FormattedMessage
            defaultMessage="Prompt"
            description="Sidebar button inside the 'new' popover to create new prompt"
          />
        ),
      },
    },
    {
      key: 'gateway',
      icon: <DatabaseIcon />,
      linkProps: {
        to: GatewayRoutes.gatewayPageRoute,
        isActive: isGatewayActive,
        children: <FormattedMessage defaultMessage="Gateway" description="Sidebar link for gateway configuration" />,
      },
      componentId: 'mlflow.sidebar.gateway_tab_link',
    },
  ];

  const logTelemetryEvent = useLogTelemetryEvent();

  return (
    <aside
      css={{
        width: 200,
        flexShrink: 0,
        padding: theme.spacing.sm,
        display: 'inline-flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
      }}
    >
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <Button componentId="mlflow.sidebar.new_button" icon={<PlusIcon />}>
            <FormattedMessage
              defaultMessage="New"
              description="Sidebar create popover button to create new experiment, model or prompt"
            />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content side="right" sideOffset={theme.spacing.sm} align="start">
          {menuItems
            .filter((item) => item.dropdownProps !== undefined)
            .map(({ key, icon, dropdownProps }) => (
              <DropdownMenu.Item key={key} componentId={dropdownProps.componentId} onClick={dropdownProps.onClick}>
                <DropdownMenu.IconWrapper>{icon}</DropdownMenu.IconWrapper>
                {dropdownProps.children}
              </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <nav css={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <ul
          css={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {menuItems.map(({ key, icon, linkProps, componentId }) => (
            <li key={key}>
              <Link
                to={linkProps.to}
                aria-current={linkProps.isActive(location) ? 'page' : undefined}
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  color: theme.colors.textPrimary,
                  paddingInline: theme.spacing.md,
                  paddingBlock: theme.spacing.xs,
                  borderRadius: theme.borders.borderRadiusSm,
                  '&:hover': {
                    color: theme.colors.actionLinkHover,
                    backgroundColor: theme.colors.actionDefaultBackgroundHover,
                  },
                  '&[aria-current="page"]': {
                    backgroundColor: theme.colors.actionDefaultBackgroundPress,
                    color: theme.isDarkMode ? theme.colors.blue300 : theme.colors.blue700,
                    fontWeight: theme.typography.typographyBoldFontWeight,
                  },
                }}
                onClick={() =>
                  logTelemetryEvent({
                    componentId,
                    componentViewId: viewId,
                    componentType: DesignSystemEventProviderComponentTypes.TypographyLink,
                    componentSubType: null,
                    eventType: DesignSystemEventProviderAnalyticsEventTypes.OnClick,
                  })
                }
              >
                {icon}
                {linkProps.children}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={ExperimentTrackingRoutes.settingsPageRoute}
          aria-current={isSettingsActive(location) ? 'page' : undefined}
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            color: theme.colors.textPrimary,
            paddingInline: theme.spacing.md,
            paddingBlock: theme.spacing.sm,
            borderRadius: theme.borders.borderRadiusSm,
            '&:hover': {
              color: theme.colors.actionLinkHover,
              backgroundColor: theme.colors.actionDefaultBackgroundHover,
            },
            '&[aria-current="page"]': {
              backgroundColor: theme.colors.actionDefaultBackgroundPress,
              color: theme.isDarkMode ? theme.colors.blue300 : theme.colors.blue700,
              fontWeight: theme.typography.typographyBoldFontWeight,
            },
          }}
          onClick={() =>
            logTelemetryEvent({
              componentId: 'mlflow.sidebar.settings_tab_link',
              componentViewId: viewId,
              componentType: DesignSystemEventProviderComponentTypes.TypographyLink,
              componentSubType: null,
              eventType: DesignSystemEventProviderAnalyticsEventTypes.OnClick,
            })
          }
        >
          <GearIcon />
          <FormattedMessage defaultMessage="Settings" description="Sidebar link for settings page" />
        </Link>
      </nav>

      <CreateExperimentModal
        isOpen={showCreateExperimentModal}
        onClose={() => setShowCreateExperimentModal(false)}
        onExperimentCreated={invalidateExperimentList}
      />
      <CreateModelModal modalVisible={showCreateModelModal} hideModal={() => setShowCreateModelModal(false)} />
      {CreatePromptModal}
    </aside>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: PageContainer.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/PageContainer.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import { PageWrapper, Spacer } from '@databricks/design-system';

type OwnProps = {
  usesFullHeight?: boolean;
  children?: React.ReactNode;
};

// @ts-expect-error TS(2565): Property 'defaultProps' is used before being assig... Remove this comment to see the full error message
type Props = OwnProps & typeof PageContainer.defaultProps;

export function PageContainer(props: Props) {
  const { usesFullHeight, ...restProps } = props;
  return (
    // @ts-expect-error TS(2322): Type '{ height: string; display: string; flexDirec... Remove this comment to see the full error message
    <PageWrapper css={usesFullHeight ? styles.useFullHeightLayout : styles.wrapper}>
      {/* @ts-expect-error TS(2322): Type '{ css: { flexShrink: number; }; }' is not as... Remove this comment to see the full error message */}
      <Spacer css={styles.fixedSpacer} />
      {usesFullHeight ? props.children : <div {...restProps} css={styles.container} />}
    </PageWrapper>
  );
}

PageContainer.defaultProps = {
  usesFullHeight: false,
};

const styles = {
  useFullHeightLayout: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:last-child': {
      flexGrow: 1,
    },
  },
  wrapper: { flex: 1 },
  fixedSpacer: {
    // Ensure spacer's fixed height regardless of flex
    flexShrink: 0,
  },
  container: {
    width: '100%',
    flexGrow: 1,
    paddingBottom: 24,
  },
};
```

--------------------------------------------------------------------------------

---[FILE: PageNotFoundView.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/PageNotFoundView.test.tsx
Signals: React

```typescript
import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import { BrowserRouter } from '../utils/RoutingUtils';
import { PageNotFoundView } from './PageNotFoundView';

describe('PageNotFoundView', () => {
  test('should render without exploding', () => {
    renderWithIntl(
      <BrowserRouter>
        <PageNotFoundView />
      </BrowserRouter>,
    );
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: PageNotFoundView.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/PageNotFoundView.tsx

```typescript
import { ErrorView } from './ErrorView';

export const PageNotFoundView = () => {
  return <ErrorView statusCode={404} fallbackHomePageReactRoute="/" />;
};

export default PageNotFoundView;
```

--------------------------------------------------------------------------------

---[FILE: PreviewSidebar.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/PreviewSidebar.tsx
Signals: React

```typescript
import React from 'react';
import { Button, CloseIcon, CopyIcon, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CopyButton } from '../../shared/building_blocks/CopyButton';

const PREVIEW_SIDEBAR_WIDTH = 300;

/**
 * Displays a sidebar helpful in expanding textual data in table components.
 * Will be replaced by DuBois standardized component in the future.
 */
export const PreviewSidebar = ({
  content,
  copyText,
  headerText,
  empty,
  onClose,
}: {
  content?: React.ReactNode;
  copyText?: string;
  headerText?: string;
  empty?: React.ReactNode;
  onClose?: () => void;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        width: PREVIEW_SIDEBAR_WIDTH,
        padding: theme.spacing.sm,
        paddingRight: 0,
        borderLeft: `1px solid ${theme.colors.borderDecorative}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      data-testid="preview-sidebar-content"
    >
      {content ? (
        <>
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              rowGap: theme.spacing.sm,
              alignItems: 'flex-start',
              flex: '0 0 auto',
            }}
          >
            {headerText && (
              <Typography.Title
                level={4}
                css={{
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  marginTop: theme.spacing.sm,
                  marginRight: theme.spacing.xs,

                  // Escape hatch if for some reason title is so long it would consume entire sidebar
                  maxHeight: 200,
                }}
              >
                {headerText}
              </Typography.Title>
            )}
            {copyText && <CopyButton copyText={copyText} showLabel={false} icon={<CopyIcon />} />}
            {onClose && (
              <Button
                componentId="codegen_mlflow_app_src_common_components_previewsidebar.tsx_67"
                type="primary"
                icon={<CloseIcon />}
                onClick={onClose}
              />
            )}
          </div>
          <div
            css={{
              // Preserve original line breaks
              whiteSpace: 'pre-wrap',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {content}
          </div>
        </>
      ) : (
        <div css={{ marginTop: theme.spacing.md }}>{empty}</div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Progress.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/Progress.tsx

```typescript
import type { Theme } from '@emotion/react';

export interface ProgressProps {
  percent: number;
  format: (percent: number) => string;
  className?: string;
}

/**
 * Recreates basic features of antd's <Progress /> component.
 * Temporary solution, waiting for this component to be included in DuBois.
 */
export const Progress = (props: ProgressProps) => {
  return (
    <div css={styles.wrapper} className={props.className}>
      <div css={styles.track}>
        <div css={styles.progressTrack} style={{ width: `${props.percent}%` }} />
      </div>
      {props.format(props.percent)}
    </div>
  );
};

const styles = {
  wrapper: (theme: Theme) => ({ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }),
  track: (theme: Theme) => ({
    backgroundColor: theme.colors.backgroundSecondary,
    height: theme.spacing.sm,
    flex: 1,
    borderRadius: theme.spacing.sm,
  }),
  progressTrack: (theme: Theme) => ({
    backgroundColor: theme.colors.primary,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: Prompt.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/Prompt.tsx
Signals: React

```typescript
import React from 'react';
import { UNSAFE_NavigationContext } from '../utils/RoutingUtils';

const useNavigationBlock = () => {
  return (React.useContext(UNSAFE_NavigationContext) as any).navigator.block;
};

export interface PromptProps {
  when: boolean;
  message: string;
}

/**
 * Component confirms navigating away by displaying prompt if given condition is met.
 * Uses react-router v6 API.
 */
export const Prompt = ({ when, message }: PromptProps) => {
  const block = useNavigationBlock();

  React.useEffect(() => {
    if (!when) return;

    const unblock = block?.(() => {
      // eslint-disable-next-line no-alert
      return window.confirm(message);
    });

    // eslint-disable-next-line consistent-return
    return unblock;
  }, [message, block, when]);

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: RequestStateWrapper.enzyme.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/components/RequestStateWrapper.enzyme.test.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { test, expect, jest } from '@jest/globals';
import React from 'react';
import { RequestStateWrapper, DEFAULT_ERROR_MESSAGE } from './RequestStateWrapper';
import { ErrorCodes } from '../constants';
import { shallow } from 'enzyme';
import { Spinner } from './Spinner';
import { ErrorWrapper } from '../utils/ErrorWrapper';

const activeRequest = {
  id: 'a',
  active: true,
};

const completeRequest = {
  id: 'a',
  active: false,
  data: { run_id: 'run_id' },
};

const errorRequest = {
  id: 'errorId',
  active: false,
  error: new ErrorWrapper(`{"error_code": "${ErrorCodes.RESOURCE_DOES_NOT_EXIST}"}`, 404),
};

const non404ErrorRequest = {
  id: 'errorId2',
  active: false,
  error: new ErrorWrapper(`{"error_code": "${ErrorCodes.INTERNAL_ERROR}"}`, 500),
};

test('Renders loading page when requests are not complete', () => {
  const wrapper = shallow(
    <RequestStateWrapper requests={[activeRequest, completeRequest]}>
      <div>I am the child</div>
    </RequestStateWrapper>,
  );
  expect(wrapper.find(Spinner)).toHaveLength(1);
});

test('Renders custom loading page when requests are not complete', () => {
  const wrapper = shallow(
    <RequestStateWrapper
      requests={[activeRequest, completeRequest]}
      customSpinner={<h1 className="custom-spinner">a custom spinner</h1>}
    >
      <div>I am the child</div>
    </RequestStateWrapper>,
  );
  expect(wrapper.find('h1.custom-spinner')).toHaveLength(1);
});

test('Renders children when requests are complete', () => {
  const wrapper = shallow(
    <RequestStateWrapper requests={[completeRequest]}>
      <div className="child">I am the child</div>
    </RequestStateWrapper>,
  );
  expect(wrapper.find('div.child')).toHaveLength(1);
  expect(wrapper.find('div.child').text()).toContain('I am the child');
});

test('Throws exception if child is a React element and wrapper has bad request.', () => {
  try {
    shallow(
      <RequestStateWrapper requests={[errorRequest]}>
        <div className="child">I am the child</div>
      </RequestStateWrapper>,
    );
  } catch (e) {
    expect((e as any).message).toContain(DEFAULT_ERROR_MESSAGE);
  }
});

test('Throws exception if errorRenderFunc returns undefined and wrapper has bad request.', () => {
  try {
    shallow(
      <RequestStateWrapper requests={[errorRequest]}>
        <div className="child">I am the child</div>
      </RequestStateWrapper>,
    );
    // @ts-expect-error TS(2304): Cannot find name 'assert'.
    assert.fail();
  } catch (e) {
    expect((e as any).message).toContain(DEFAULT_ERROR_MESSAGE);
  }
});

test('Renders child if request expectedly returns a 404', () => {
  const wrapper = shallow(
    <RequestStateWrapper requests={[errorRequest]} requestIdsWith404sToIgnore={[errorRequest.id]}>
      <div className="child">I am the child</div>
    </RequestStateWrapper>,
  );
  expect(wrapper.find('div.child')).toHaveLength(1);
  expect(wrapper.find('div.child').text()).toContain('I am the child');
});

test('Does not render child if request returns a non-404 error', () => {
  try {
    shallow(
      <RequestStateWrapper requests={[non404ErrorRequest]} requestIdsWith404sToIgnore={[errorRequest.id]}>
        <div className="child">I am the child</div>
      </RequestStateWrapper>,
    );
    // @ts-expect-error TS(2304): Cannot find name 'assert'.
    assert.fail();
  } catch (e) {
    expect((e as any).message).toContain(DEFAULT_ERROR_MESSAGE);
  }
});

test('Render func works if wrapper has bad request.', () => {
  const wrapper = shallow(
    <RequestStateWrapper requests={[activeRequest, completeRequest, errorRequest]}>
      {(isLoading: any, shouldRenderError: any, requests: any) => {
        if (shouldRenderError) {
          expect(requests).toEqual([activeRequest, completeRequest, errorRequest]);
          return <div className="error">Error!</div>;
        }
        return <div className="child">I am the child</div>;
      }}
    </RequestStateWrapper>,
  );
  expect(wrapper.find('div.error')).toHaveLength(1);
  expect(wrapper.find('div.error').text()).toContain('Error!');
});

test('Should call child if child is a function, even if no requests', () => {
  const childFunction = jest.fn();
  shallow(<RequestStateWrapper requests={[]}>{childFunction}</RequestStateWrapper>);

  expect(childFunction).toHaveBeenCalledTimes(1);
});
```

--------------------------------------------------------------------------------

````

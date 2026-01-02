---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 608
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 608 of 991)

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

---[FILE: CopyButton.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/CopyButton.test.tsx
Signals: React

```typescript
import { describe, beforeEach, jest, afterEach, it, expect } from '@jest/globals';
import React from 'react';
import { CopyButton } from './CopyButton';
import { DesignSystemProvider } from '@databricks/design-system';
import { renderWithIntl, screen } from '@mlflow/mlflow/src/common/utils/TestUtils.react18';
import userEvent from '@testing-library/user-event';

describe('CopyButton', () => {
  const originalClipboard = { ...global.navigator.clipboard };
  beforeEach(() => {
    const mockClipboard = {
      writeText: jest.fn(),
    };
    Object.defineProperty(global.navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: originalClipboard,
      writable: false,
    });
  });

  it('should render with minimal props without exploding', async () => {
    renderWithIntl(
      <DesignSystemProvider>
        <CopyButton copyText="copyText" />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('Copy')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Copy'));
    expect(screen.getByRole('tooltip', { name: 'Copied' })).toBeInTheDocument();
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('copyText');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: CopyButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/CopyButton.tsx
Signals: React

```typescript
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, type ButtonProps, Tooltip } from '@databricks/design-system';

interface CopyButtonProps extends Partial<ButtonProps> {
  copyText: string;
  showLabel?: React.ReactNode;
  componentId?: string;
}

export const CopyButton = ({ copyText, showLabel = true, componentId, ...buttonProps }: CopyButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(copyText);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <Tooltip
      content={
        <FormattedMessage defaultMessage="Copied" description="Tooltip text shown when copy operation completes" />
      }
      open={showTooltip}
      componentId="mlflow.shared.copy_button.tooltip"
    >
      <Button
        componentId={componentId ?? 'mlflow.shared.copy_button'}
        type="primary"
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        css={{ 'z-index': 1 }}
        // Define children as a explicit prop so it can be easily overrideable
        children={
          showLabel ? <FormattedMessage defaultMessage="Copy" description="Button text for copy button" /> : undefined
        }
        {...buttonProps}
      />
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: FeatureBadge.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/FeatureBadge.tsx
Signals: React

```typescript
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Tag, useDesignSystemTheme } from '@databricks/design-system';
export const FeatureBadge = ({
  type,
  expirationDate,
  className,
}: {
  type: 'new' | 'preview' | 'beta';
  expirationDate: Date;
  className?: string;
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <Tag
      componentId="codegen_mlflow_app_src_shared_building_blocks_previewbadge.tsx_14"
      className={className}
      css={{ marginLeft: theme.spacing.xs }}
      color="turquoise"
    >
      <FormattedMessage
        defaultMessage="Experimental"
        description="Experimental badge shown for features which are experimental"
      />
    </Tag>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Image.css]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/Image.css

```text
/* Replaceing AntD Image */
.mlflow-ui-container .rc-image-preview {
  height: 100%;
  pointer-events: none;
  text-align: center;
}

.mlflow-ui-container .rc-image-preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.mlflow-ui-container .rc-image-preview-mask img {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mlflow-ui-container .rc-image-preview-mask {
  background-color: rgba(0, 0, 0, 0.45);
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.mlflow-ui-container .rc-image-preview-mask-hidden {
  display: none;
}

.mlflow-ui-container .rc-image-preview-wrap {
  -webkit-overflow-scrolling: touch;
  bottom: 0;
  left: 0;
  outline: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0px;
}

.mlflow-ui-container .rc-image-preview-body {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
}

.mlflow-ui-container .rc-image-preview-img {
  cursor: grab;
  max-height: 100%;
  max-width: 100%;
  pointer-events: auto;
  transform: scaleX(1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  vertical-align: middle;
}

.mlflow-ui-container .rc-image-preview-img,
.mlflow-ui-container .rc-image-preview-img-wrapper {
  transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
}

.mlflow-ui-container .rc-image-preview-img-wrapper {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.mlflow-ui-container .rc-image-preview-img-wrapper:before {
  content: '';
  display: inline-block;
  height: 50%;
  margin-right: -1px;
  width: 1px;
}

.mlflow-ui-container .rc-image-preview-moving .mlflow-ui-container .rc-image-preview-img {
  cursor: grabbing;
}

.mlflow-ui-container .rc-image-preview-moving .mlflow-ui-container .rc-image-preview-img-wrapper {
  transition-duration: 0s;
}

.mlflow-ui-container .rc-image-preview-wrap {
  z-index: 1080;
}

.mlflow-ui-container .rc-image-preview-operations {
  font-feature-settings: 'tnum', 'tnum';
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  color: hsla(0, 0%, 100%, 0.85);
  display: flex;
  flex-direction: row-reverse;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  margin: 0;
  padding: 0;
  pointer-events: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}

.mlflow-ui-container .rc-image-preview-operations-operation {
  cursor: pointer;
  margin-left: 12px;
  padding: 12px;
}

.mlflow-ui-container .rc-image-preview-operations-operation-disabled {
  color: hsla(0, 0%, 100%, 0.25);
  pointer-events: none;
}

.mlflow-ui-container .rc-image-preview-operations-operation:last-of-type {
  margin-left: 0;
}

.mlflow-ui-container .rc-image-preview-operations-icon {
  font-size: 18px;
}

.mlflow-ui-container .rc-image-preview-switch-left,
.mlflow-ui-container .rc-image-preview-switch-right {
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  color: hsla(0, 0%, 100%, 0.85);
  cursor: pointer;
  display: flex;
  height: 44px;
  justify-content: center;
  margin-top: -22px;
  pointer-events: auto;
  position: absolute;
  right: 10px;
  top: 50%;
  width: 44px;
  z-index: 1;
}

.mlflow-ui-container .rc-image-preview-switch-left-disabled,
.mlflow-ui-container .rc-image-preview-switch-right-disabled {
  color: hsla(0, 0%, 100%, 0.25);
  cursor: not-allowed;
}

.mlflow-ui-container .rc-image-preview-switch-left-disabled > .anticon,
.mlflow-ui-container .rc-image-preview-switch-right-disabled > .anticon {
  cursor: not-allowed;
}

.mlflow-ui-container .rc-image-preview-switch-left > .anticon,
.mlflow-ui-container .rc-image-preview-switch-right > .anticon {
  font-size: 18px;
}

.mlflow-ui-container .rc-image-preview-switch-left {
  left: 10px;
}

.mlflow-ui-container .rc-image-preview-switch-right {
  right: 10px;
}

.mlflow-ui-container .fade-enter,
.mlflow-ui-container .fade-appear {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
}
.mlflow-ui-container .fade-leave {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
}
.mlflow-ui-container .fade-enter.fade-enter-active,
.mlflow-ui-container .fade-appear.fade-appear-active {
  animation-name: mlflow-rcImageFadeIn;
  animation-play-state: running;
}
.mlflow-ui-container .fade-leave.fade-leave-active {
  animation-name: mlflow-rcImageFadeOut;
  animation-play-state: running;
  pointer-events: none;
}
.mlflow-ui-container .fade-enter,
.mlflow-ui-container .fade-appear {
  opacity: 0;
  animation-timing-function: linear;
}
.mlflow-ui-container .fade-leave {
  animation-timing-function: linear;
}

@keyframes mlflow-rcImageFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes mlflow-rcImageFadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.mlflow-ui-container .zoom-enter,
.mlflow-ui-container .zoom-appear {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
}
.mlflow-ui-container .zoom-leave {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
}
.mlflow-ui-container .zoom-enter.zoom-enter-active,
.mlflow-ui-container .zoom-appear.zoom-appear-active {
  animation-name: mlflow-rcImageZoomIn;
  animation-play-state: running;
}
.mlflow-ui-container .zoom-leave.zoom-leave-active {
  animation-name: mlflow-rcImageZoomOut;
  animation-play-state: running;
  pointer-events: none;
}
.mlflow-ui-container .zoom-enter,
.mlflow-ui-container .zoom-appear {
  transform: scale(0);
  opacity: 0;
  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
}
.mlflow-ui-container .zoom-leave {
  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

@keyframes mlflow-rcImageZoomIn {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes mlflow-rcImageZoomOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.2);
    opacity: 0;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Image.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/Image.tsx
Signals: React

```typescript
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  DesignSystemContext,
  RedoIcon,
  UndoIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@databricks/design-system';
import { useContext } from 'react';
import RcImage from 'rc-image';
import './Image.css';
import { MLflowImagePreviewContainer } from '../../common/components/DesignSystemContainer';

const icons = {
  rotateLeft: <UndoIcon />,
  rotateRight: <RedoIcon />,
  zoomIn: <ZoomInIcon />,
  zoomOut: <ZoomOutIcon />,
  close: <CloseIcon />,
  left: <ArrowLeftIcon />,
  right: <ArrowRightIcon />,
};

export const ImagePreviewGroup = ({
  children,
  visible,
  onVisibleChange,
}: {
  children: React.ReactNode;
  visible: boolean;
  onVisibleChange: (v: boolean) => void;
}) => {
  const { getImagePreviewPopupContainer } = useContext(MLflowImagePreviewContainer);

  return (
    <RcImage.PreviewGroup
      icons={icons}
      preview={{
        visible: visible,
        getContainer: getImagePreviewPopupContainer,
        onVisibleChange: (v) => onVisibleChange(v),
      }}
    >
      {children}
    </RcImage.PreviewGroup>
  );
};

export { RcImage as Image };
```

--------------------------------------------------------------------------------

---[FILE: PageHeader.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/PageHeader.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';
import {
  Breadcrumb,
  Button,
  Spacer,
  Dropdown,
  Menu,
  Header,
  OverflowIcon,
  useDesignSystemTheme,
  type HeaderProps,
} from '@databricks/design-system';
import { useIntl } from 'react-intl';

import { PreviewBadge } from './PreviewBadge';

type OverflowMenuProps = {
  menu?: {
    id: string;
    itemName: React.ReactNode;
    onClick?: (...args: any[]) => any;
    href?: string;
  }[];
};

export function OverflowMenu({ menu }: OverflowMenuProps) {
  const overflowMenu = (
    <Menu>
      {/* @ts-expect-error TS(2532): Object is possibly 'undefined'. */}
      {menu.map(({ id, itemName, onClick, href, ...otherProps }) => (
        // @ts-expect-error TS(2769): No overload matches this call.
        <Menu.Item key={id} onClick={onClick} href={href} data-testid={id} {...otherProps}>
          {itemName}
        </Menu.Item>
      ))}
    </Menu>
  );

  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  return menu.length > 0 ? (
    <Dropdown overlay={overflowMenu} trigger={['click']} placement="bottomLeft" arrow>
      <Button
        componentId="codegen_mlflow_app_src_shared_building_blocks_pageheader.tsx_54"
        icon={<OverflowIcon />}
        data-testid="overflow-menu-trigger"
        aria-label="Open header dropdown menu"
      />
    </Dropdown>
  ) : null;
}

type PageHeaderProps = Pick<HeaderProps, 'dangerouslyAppendEmotionCSS'> & {
  title: React.ReactNode;
  breadcrumbs?: React.ReactNode[];
  preview?: boolean;
  feedbackOrigin?: string;
  infoPopover?: React.ReactNode;
  children?: React.ReactNode;
  spacerSize?: 'xs' | 'sm' | 'md' | 'lg';
  hideSpacer?: boolean;
  titleAddOns?: React.ReactNode | React.ReactNode[];
};

/**
 * A page header that includes:
 *   - title,
 *   - optional breadcrumb content,
 *   - optional preview mark,
 *   - optional feedback origin: shows the "Send feedback" button when not empty, and
 *   - optional info popover, safe to have link inside.
 */
export function PageHeader(props: PageHeaderProps) {
  const {
    title, // required
    breadcrumbs = [],
    titleAddOns = [],
    preview,
    children,
    spacerSize,
    hideSpacer = false,
    dangerouslyAppendEmotionCSS,
  } = props;
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();

  return (
    <>
      <Header
        breadcrumbs={
          breadcrumbs.length > 0 && (
            <Breadcrumb includeTrailingCaret>
              {breadcrumbs.map((b, i) => (
                <Breadcrumb.Item key={i}>{b}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )
        }
        buttons={children}
        title={title}
        // prettier-ignore
        titleAddOns={
          <>
            {preview && <PreviewBadge css={{ marginLeft: 0 }} />}
            {titleAddOns}
          </>
        }
        dangerouslyAppendEmotionCSS={dangerouslyAppendEmotionCSS}
      />
      <Spacer
        // @ts-expect-error TS(2322): Type '{ css: { flexShrink: number; }; }' is not as... Remove this comment to see the full error message
        css={{
          // Ensure spacer's fixed height
          flexShrink: 0,
          ...(hideSpacer ? { display: 'none' } : {}),
        }}
        size={spacerSize}
      />
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: PreviewBadge.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/PreviewBadge.tsx
Signals: React

```typescript
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Tag, useDesignSystemTheme } from '@databricks/design-system';
export const PreviewBadge = ({ className }: { className?: string }) => {
  const { theme } = useDesignSystemTheme();
  return (
    <Tag
      componentId="codegen_mlflow_app_src_shared_building_blocks_previewbadge.tsx_14"
      className={className}
      css={{ marginLeft: theme.spacing.xs }}
      color="turquoise"
    >
      <FormattedMessage
        defaultMessage="Experimental"
        description="Experimental badge shown for features which are experimental"
      />
    </Tag>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Spacer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/building_blocks/Spacer.tsx
Signals: React

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import React from 'react';

const spacingSizes = [4, 8, 16, 24, 32, 40];

const getMarginSize = (size: any) => {
  switch (size) {
    case 'small':
      return 4;
    case 'medium':
    case undefined:
      return 8;
    case 'large':
      return 16;
    default:
      return spacingSizes[size];
  }
};

type SpacerProps = {
  size?: any; // TODO: PropTypes.oneOf([undefined, 'small', 'medium', 'large', 0, 1, 2, 3, 4, 5])
  direction?: string;
};

/**
 * Spaces its children according to the direction and size specified.
 * @param props size: One of "small", "medium" or "large". Default small.
 * @param props direction: One of "horizontal" or "vertical". Default vertical.
 */
export class Spacer extends React.Component<SpacerProps> {
  render() {
    const { children, size = 'small', direction = 'vertical' } = this.props;
    const marginSize = getMarginSize(size);
    const style = styles(marginSize, direction);
    return <div css={style}>{children}</div>;
  }
}

const styles = (marginSize: any, direction: any) =>
  direction === 'horizontal'
    ? {
        display: 'flex',
        alignItems: 'center',
        '> :not(:last-child)': { marginRight: marginSize },
      }
    : {
        '> :not(:last-child)': { marginBottom: marginSize },
      };
```

--------------------------------------------------------------------------------

---[FILE: test-types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/test-types.ts

```typescript
type WebSharedDesignSystem = typeof import('@databricks/web-shared/design-system');
type StubDesignSystem = typeof import('./design-system');

type Equal<U1, U2> = [U1] extends [U2] ? ([U2] extends [U1] ? true : false) : false;

// To see the type mismatch, uncomment the following line and adjust the types
// const a: WebSharedDesignSystem = {} as StubDesignSystem;

// All the Equal results should be true
const _testUtilsEqual: [Equal<WebSharedDesignSystem, StubDesignSystem>] = [true];
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/browse/index.ts

```typescript
export * from './TimeAgo';
```

--------------------------------------------------------------------------------

---[FILE: TimeAgo.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/browse/TimeAgo.tsx
Signals: React

```typescript
import React from 'react';

import { Tooltip } from '@databricks/design-system';
import type { IntlShape } from 'react-intl';
import { useIntl } from 'react-intl';

// Time intervals in seconds
const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

type Interval = {
  seconds: number;
  timeAgoMessage: (count: number) => string;
};

const getIntervals = (intl: IntlShape): Interval[] => [
  {
    seconds: YEAR,
    timeAgoMessage: (count: number) =>
      intl.formatMessage(
        {
          defaultMessage: '{count, plural, =1 {1 year} other {# years}} ago',
          description: 'Time duration in years',
        },
        { count },
      ),
  },
  {
    seconds: MONTH,
    timeAgoMessage: (count: number) =>
      intl.formatMessage(
        {
          defaultMessage: '{count, plural, =1 {1 month} other {# months}} ago',
          description: 'Time duration in months',
        },
        { count },
      ),
  },
  {
    seconds: DAY,
    timeAgoMessage: (count: number) =>
      intl.formatMessage(
        {
          defaultMessage: '{count, plural, =1 {1 day} other {# days}} ago',
          description: 'Time duration in days',
        },
        { count },
      ),
  },
  {
    seconds: HOUR,
    timeAgoMessage: (count: number) =>
      intl.formatMessage(
        {
          defaultMessage: '{count, plural, =1 {1 hour} other {# hours}} ago',
          description: 'Time duration in hours',
        },
        { count },
      ),
  },
  {
    seconds: MINUTE,
    timeAgoMessage: (count: number) =>
      intl.formatMessage(
        {
          defaultMessage: '{count, plural, =1 {1 minute} other {# minutes}} ago',
          description: 'Time duration in minutes',
        },
        { count },
      ),
  },
  {
    seconds: SECOND,
    timeAgoMessage: (count: number) =>
      intl.formatMessage(
        {
          defaultMessage: '{count, plural, =1 {1 second} other {# seconds}} ago',
          description: 'Time duration in seconds',
        },
        { count },
      ),
  },
];

export interface TimeAgoProps {
  date: Date;
  tooltipFormatOptions?: DateTooltipOptionsType;
}

type DateTooltipOptionsType = Intl.DateTimeFormatOptions;

const DateTooltipOptions: DateTooltipOptionsType = {
  timeZoneName: 'short',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export const getTimeAgoStrings = ({
  date,
  intl,
  tooltipFormatOptions = DateTooltipOptions,
}: TimeAgoProps & { intl: IntlShape }): { displayText: string; tooltipTitle: string } => {
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  const locale = navigator.language || 'en-US';
  let tooltipTitle = '';
  try {
    tooltipTitle = Intl.DateTimeFormat(locale, tooltipFormatOptions).format(date);
  } catch (e) {
    // ES-1357574 Do nothing; this is not a critical path, let's just not throw an error
  }

  for (const interval of getIntervals(intl)) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return { displayText: interval.timeAgoMessage(count), tooltipTitle };
    }
  }

  return {
    displayText: intl.formatMessage({
      defaultMessage: 'just now',
      description: 'Indicates a time duration that just passed',
    }),
    tooltipTitle,
  };
};

export const TimeAgo: React.FC<React.PropsWithChildren<TimeAgoProps>> = ({
  date,
  tooltipFormatOptions = DateTooltipOptions,
}) => {
  const intl = useIntl();
  const { displayText, tooltipTitle } = getTimeAgoStrings({ date, intl, tooltipFormatOptions });
  return (
    <Tooltip componentId="web-shared.time-ago" content={tooltipTitle}>
      <span>{displayText}</span>
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Copyable.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/copy/Copyable.tsx
Signals: React

```typescript
import type { ReactNode } from 'react';
import React from 'react';

import { Typography, useDesignSystemTheme } from '@databricks/design-system';

import { CopyActionButton } from './CopyActionButton';

interface CommonProps {
  className?: string;
  /** Tracking id for copy icon button.
   * It is applied to its tooltip
   * appending "_tooltip" to it.*/
  componentId?: string;
  copyPlacement?: 'top' | 'center';
  copyTooltip?: string;
  onCopy?: () => void;
  stretch?: boolean;
}
interface WithCopyText extends CommonProps {
  children: ReactNode;
  copyText: string;
}
interface WithoutCopyText extends CommonProps {
  children: string;
  copyText?: null;
}
export type CopyableProps = WithCopyText | WithoutCopyText;

export function Copyable({
  children,
  componentId,
  copyPlacement = 'center',
  copyText,
  copyTooltip,
  onCopy,
  stretch = false,
}: CopyableProps) {
  const { theme } = useDesignSystemTheme();
  const copyTextOrChildren = copyText ?? children;
  return (
    <span css={{ display: 'flex', alignItems: 'stretch' }}>
      <span css={{ display: 'flex', alignItems: 'center', width: stretch ? '100%' : undefined, overflow: 'hidden' }}>
        <Typography.Text css={{ width: stretch ? '100%' : undefined, maxWidth: '100%' }}>{children}</Typography.Text>
      </span>
      <span
        css={{
          display: 'flex',
          alignItems: copyPlacement === 'center' ? 'center' : 'start',
          marginLeft: theme.spacing.sm,
        }}
      >
        <CopyActionButton
          componentId={componentId}
          copyText={copyTextOrChildren}
          copyTooltip={copyTooltip}
          onCopy={onCopy}
        />
      </span>
    </span>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: CopyActionButton.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/copy/CopyActionButton.tsx
Signals: React

```typescript
import React from 'react';

import type { ButtonProps, TooltipProps } from '@databricks/design-system';
import { Button, Tooltip } from '@databricks/design-system';

import { useCopyController } from './useCopyController';

export interface CopyActionButtonProps {
  buttonProps?: Partial<ButtonProps>;
  componentId?: string;
  copyText: string;
  copyTooltip?: string;
  isInsideInputGroup?: boolean;
  onCopy?: () => void;
  tooltipProps?: Partial<TooltipProps>;
}

export function CopyActionButton({
  buttonProps,
  componentId,
  copyText,
  copyTooltip,
  isInsideInputGroup = false,
  onCopy,
  tooltipProps,
}: CopyActionButtonProps) {
  const { actionIcon, copy, handleTooltipOpenChange, tooltipOpen, tooltipMessage } = useCopyController(
    copyText,
    copyTooltip,
    onCopy,
  );

  const button = (
    <Button
      aria-label={tooltipMessage}
      componentId={componentId ?? 'codegen_web-shared_src_copy_copyactionbutton.tsx_17'}
      icon={actionIcon}
      onClick={copy}
      size="small"
      {...buttonProps}
    />
  );

  const inputGroupButton = (
    <Button
      aria-label={tooltipMessage}
      componentId={componentId ?? 'codegen_web-shared_src_copy_copyactionbutton.tsx_17'}
      onClick={copy}
      {...buttonProps}
    >
      {actionIcon}
    </Button>
  );

  return (
    <Tooltip
      componentId={
        componentId ? `${componentId}-tooltip` : 'codegen_web-shared_src_copy_copyactionbutton.tsx_17-tooltip'
      }
      content={tooltipMessage}
      onOpenChange={handleTooltipOpenChange}
      open={tooltipOpen}
      {...tooltipProps}
    >
      {isInsideInputGroup ? inputGroupButton : button}
    </Tooltip>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/copy/index.tsx

```typescript
export * from './Copyable';
export * from './CopyActionButton';
export * from './useCopyController';
```

--------------------------------------------------------------------------------

---[FILE: useCopyController.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/copy/useCopyController.tsx
Signals: React

```typescript
import type { ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';

import { CheckIcon, CopyIcon } from '@databricks/design-system';
import { useIntl } from '@databricks/i18n';

export interface CopyController {
  actionIcon: ReactElement;
  tooltipMessage: string;
  copy: () => void;
  copied: boolean;
  ariaLabel: string;
  tooltipOpen: boolean;
  handleTooltipOpenChange: (open: boolean) => void;
}

/**
 * Utility hook that is internal to web-shared, use: `Copyable` or `CopyActionButton`
 *  or if it's a `CodeSnippet`, `SnippetCopyAction`
 */
export function useCopyController(text: string, copyTooltip?: string, onCopy?: () => void): CopyController {
  const intl = useIntl();

  const copyMessage = copyTooltip
    ? copyTooltip
    : intl.formatMessage({
        defaultMessage: 'Copy',
        description: 'Tooltip message displayed on copy action',
      });

  const copiedMessage = intl.formatMessage({
    defaultMessage: 'Copied',
    description: 'Tooltip message displayed on copy action after it has been clicked',
  });

  const clipboard = useClipboard();
  const copiedTimerIdRef = useRef<number>();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimerIdRef.current);
    };
  }, []);

  const copy = () => {
    clipboard.copy(text);
    window.clearTimeout(copiedTimerIdRef.current);
    setCopied(true);
    onCopy?.();
    copiedTimerIdRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return {
    actionIcon: copied ? <CheckIcon /> : <CopyIcon />,
    tooltipMessage: copied ? copiedMessage : copyMessage,
    copy,
    copied,
    ariaLabel: copyMessage,
    tooltipOpen: open || copied,
    handleTooltipOpenChange: setOpen,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/design-system/index.tsx
Signals: React

```typescript
import React from 'react';

import { DesignSystemThemeProvider } from '@databricks/design-system';

export type DarkModePref = 'system' | 'dark' | 'light';

export const DARK_MODE_PREF_DEFAULT = 'system';

export const LOCAL_STORAGE_DARK_MODE_PREF_KEY: any = 'dark-mode-pref';

export interface SupportsDuBoisThemesProps {
  disabled?: boolean;
}

export const SupportsDuBoisThemes: React.FC<React.PropsWithChildren<SupportsDuBoisThemesProps>> = ({
  disabled = false,
  children,
}) => {
  // eslint-disable-next-line react/forbid-elements
  return <DesignSystemThemeProvider isDarkMode={false}>{children}</DesignSystemThemeProvider>;
};

export const getIsDarkMode = (prefersDarkMode: DarkModePref): boolean => {
  return prefersDarkMode === 'dark';
};

export function getUserDarkModePref(): DarkModePref {
  return 'system';
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function setUserDarkModePref(value: DarkModePref) {}

// For system-level dark mode preference
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function systemPrefersDark(): boolean {
  return darkModeMediaQuery.matches;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function setDarkModeSupported(value: boolean) {}

export function WorkspaceImg(props: React.ImgHTMLAttributes<HTMLImageElement> & { src?: string; alt?: string }) {
  return <img alt="altt" {...props} />;
}
```

--------------------------------------------------------------------------------

---[FILE: ErrorLogType.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/errors/ErrorLogType.ts

```typescript
export enum ErrorLogType {
  UserInputError = 'UserInputError',
  UnexpectedSystemStateError = 'UnexpectedSystemStateError',
  ServerError = 'ServerError',
  SessionError = 'SessionError',
  NetworkError = 'NetworkError',
  ApplicationError = 'ApplicationError',
  UnknownError = 'UnknownError',
}
```

--------------------------------------------------------------------------------

---[FILE: ErrorName.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/errors/ErrorName.ts

```typescript
export enum ErrorName {
  BadRequestError = 'BadRequestError',
  DatasetRunNotFoundError = 'DatasetRunNotFoundError',
  FormValidationError = 'FormInputError',
  GenericNetworkRequestError = 'GenericNetworkRequestError',
  GraphQLGenericError = 'GraphQLGenericError',
  InternalServerError = 'InternalServerError',
  NotFoundError = 'NotFoundError',
  PermissionError = 'PermissionError',
  RateLimitedError = 'RateLimitedError',
  RouteNotFoundError = 'RouteNotFoundError',
  ScorerTransformationError = 'ScorerTransformationError',
  ServiceUnavailableError = 'ServiceUnavailableError',
  UnauthorizedError = 'UnauthorizedError',
  UnknownError = 'UnknownError',
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/errors/index.ts

```typescript
export * from './PredefinedErrors';
export * from './ErrorLogType';
export * from './ErrorName';
```

--------------------------------------------------------------------------------

---[FILE: PredefinedErrors.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/errors/PredefinedErrors.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import type { ErrorLogType } from './ErrorLogType';
import type { ErrorName } from './ErrorName';
import {
  PredefinedError,
  matchPredefinedError,
  NotFoundError,
  PermissionError,
  UnauthorizedError,
  UnknownError,
} from './PredefinedErrors';

class GenericError extends PredefinedError {
  errorLogType = 'GenericError' as ErrorLogType;
  errorName = 'GenericError' as ErrorName;
  displayMessage = 'Generic Message';
}

describe('PredefinedErrors', () => {
  describe('matchPredefinedError', () => {
    it('should properly handle errors which are Responses', () => {
      const testResponseError = new Response(null, { status: 404 });

      const matchedError = matchPredefinedError(testResponseError);

      expect(matchedError).toBeInstanceOf(NotFoundError);
    });

    it('should properly handle errors which are Apollo Errors', () => {
      const testApolloError = new Error('Test Apollo Error');
      const networkError = new Error();
      Object.assign(networkError, { statusCode: 401, response: new Response(null, { status: 401 }) });
      (testApolloError as any).networkError = networkError;
      const matchedError = matchPredefinedError(testApolloError);

      expect(matchedError).toBeInstanceOf(UnauthorizedError);
    });

    it('should pass through predefined error', () => {
      const testPredefinedError = new PermissionError({});
      const matchedError = matchPredefinedError(testPredefinedError);

      expect(matchedError).toEqual(testPredefinedError);
    });

    it('should pass through unknown error if unable to match', () => {
      const testUnknownError = new Error('Test Unknown Error');
      const matchedError = matchPredefinedError(testUnknownError);

      expect(matchedError).toBeInstanceOf(UnknownError);
    });
  });
});
```

--------------------------------------------------------------------------------

````

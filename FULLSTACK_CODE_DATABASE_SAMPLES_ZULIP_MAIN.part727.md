---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 727
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 727 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: banners.css]---
Location: zulip-main/web/styles/banners.css

```text
.banner-wrapper {
    container: banner / inline-size;
}

.banner {
    box-sizing: border-box;
    display: grid;
    grid-template: var(--banner-grid-template-rows) / var(
            --banner-grid-template-columns
        );
    grid-template-areas: var(--banner-grid-template-areas);
    place-items: start;
    border: 1px solid;
    border-radius: 6px;
}

.banner-link {
    color: var(--color-text-link);
    text-decoration: none;
    text-decoration-color: var(--color-text-link-decoration);

    &:hover {
        color: var(--color-text-link-hover);
        text-decoration-color: var(--color-text-link-decoration-hover);
    }

    &:active {
        color: var(--color-text-link-active);
        text-decoration-color: currentcolor;
    }
}

.banner-content {
    grid-area: banner-content;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    gap: 0 0.625em; /* 10px at 16px/1em */
}

.banner-label {
    /* We allow the banner label to grow and shrink, and set
       the flex basis to 60% of the query container's width.
       When the width of the banner label goes below this
       flex basis value, the banner action buttons are wrapped
       on to the next line.  */
    flex: 1 1 60cqw;
    /* The padding and line-height values for the banner label
       are identical to those of the action buttons', to match
       the height of both of these elements. This is required to
       align the banner children elements vertically, since we
       cannot use flexbox center alignment as we also need to
       account for the UI when the banner has a muli-line label.
    */
    padding: 0.25em 0; /* 4px at 16px/1em */
    line-height: 1.25; /* 20px at 16px/1em */
    text-align: start;
}

.banner-action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em; /* 8px at 16px/1em */
}

.banner-action-buttons:empty {
    display: none;
}

.banner-close-button {
    display: flex;
    grid-area: banner-close-button;
    padding: 0.6875em; /* 11px at 16px/1em */
    margin-left: 0.3125em; /* 5px at 16px/1em */

    &:focus-visible {
        outline-offset: -2px;
    }
}

.navbar-alert-banner {
    border: unset;
    border-bottom: 1px solid;
    border-radius: 0;
    place-items: start center;

    .banner-content {
        justify-content: center;
        flex-wrap: nowrap;
    }

    .banner-label {
        /* Reset to initial value */
        flex: 0 1 auto;
    }

    .banner-action-buttons {
        flex-wrap: nowrap;
    }
}

/* This utility class defines the structure of the medium-type
   navbar banners where the banner action buttons are placed
   below the banner label. This utility class is required since
   unlike the normal banners, the navbar counterparts have
   horizontally centered elements, wherein the flex-basis logic
   won't apply and we need to manually apply these properties
   based on the container size queries below. */
.navbar-alert-medium-banner {
    .banner-content {
        flex-direction: column;
        align-items: center;
    }

    .banner-label {
        text-align: center;
    }

    .banner-action-buttons {
        flex-wrap: wrap;
        justify-content: center;
    }
}

@container banner (width >= 44em) and (width < 63em) {
    .navbar-alert-banner[data-process="desktop-notifications"] {
        @extend .navbar-alert-medium-banner;
    }
}

@container banner (width < 44em) {
    .navbar-alert-banner {
        @extend .navbar-alert-medium-banner;
    }
}

@container banner (width < 25em) {
    .banner-content {
        flex-direction: column;
    }

    .banner-label {
        /* Reset to initial value */
        flex: 0 1 auto;
    }

    .banner-action-buttons {
        flex-direction: column;
        width: 100%;
    }
}

.banner-neutral {
    background-color: var(--color-background-neutral-banner);
    color: var(--color-text-neutral-banner);
    border-color: var(--color-border-neutral-banner);
}

.banner-brand {
    background-color: var(--color-background-brand-banner);
    color: var(--color-text-brand-banner);
    border-color: var(--color-border-brand-banner);
}

.banner-info {
    background-color: var(--color-background-info-banner);
    color: var(--color-text-info-banner);
    border-color: var(--color-border-info-banner);
}

.banner-success {
    background-color: var(--color-background-success-banner);
    color: var(--color-text-success-banner);
    border-color: var(--color-border-success-banner);
}

.banner-warning {
    background-color: var(--color-background-warning-banner);
    color: var(--color-text-warning-banner);
    border-color: var(--color-border-warning-banner);
}

.banner-danger {
    background-color: var(--color-background-danger-banner);
    color: var(--color-text-danger-banner);
    border-color: var(--color-border-danger-banner);
}

@keyframes popup-banner-fadeIn {
    0% {
        opacity: 0;
        transform: translateY(
            calc(-1 * var(--popup-banner-translate-y-distance))
        );
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes popup-banner-fadeOut {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(
            calc(-1 * var(--popup-banner-translate-y-distance))
        );
    }
}

.popup-banner-animations {
    animation-name: popup-banner-fadeIn;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;

    &.fade-out {
        animation-name: popup-banner-fadeOut;
    }
}

.popup-banner {
    @extend .popup-banner-animations;

    width: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: blueslip.css]---
Location: zulip-main/web/styles/blueslip.css

```text
.blueslip-display {
    display: none;

    &.show {
        display: block;
    }
}

.blueslip-animations {
    &.show {
        animation-name: fadeIn;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
    }

    &.fade-out {
        animation-name: fadeOut;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
    }
}

.blueslip-error-container {
    /* We define this variable here since this is shared
       with portico. */
    --blueslip-overlay-translate-y-distance: 100px;
    position: fixed;
    /* Offset to account for the top padding + 5px from the top. */
    top: calc(5px + (-1 * var(--blueslip-overlay-translate-y-distance)));
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: min(calc(100% - 20px), 1100px);
    z-index: 230;
    /* Subtract 5px to account for the bottom margin and another
       5px to account for the top. */
    max-height: calc(100vh - 10px);
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Set top padding to account for the translate-y motion of the
       animation to prevent the vertical scroll bar from appearing. */
    padding-top: var(--blueslip-overlay-translate-y-distance);
    display: flex;
    /* Using column-reverse flex direction enables a stack-like
       behavior where the most recent error is always on top. */
    flex-direction: column-reverse;
    gap: 5px;
}

.stacktrace {
    @extend .blueslip-display, .blueslip-animations;

    box-sizing: border-box;
    width: 100%;
    pointer-events: auto;
    font-size: 1rem;
    color: hsl(0deg 80% 40%);

    padding: 1rem 0;

    background-color: hsl(0deg 100% 98%);
    border-radius: 4px;
    border: 1px solid hsl(0deg 80% 40%);
    box-shadow: 0 0 2px hsl(0deg 80% 40%);

    .stacktrace-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .message {
            flex: 1 1 auto;
        }

        .warning-symbol,
        .exit {
            flex: 0 0 auto;
            font-size: 1.3rem;
            padding: 0 1rem;
        }

        .exit::after {
            cursor: pointer;
            font-size: 2.3rem;
            content: "\d7";
            line-height: 0.5;
        }
    }

    .stacktrace-more-info {
        font-size: 0.85rem;
        white-space: pre;
        font-family: "Source Code Pro", monospace;
        margin-left: 3.3rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background-color: hsl(0deg 7% 98%);
    }

    .stacktrace-content {
        font-family: "Source Code Pro", monospace;
        font-size: 0.85rem;

        margin-bottom: 0.5rem;

        .stackframe {
            overflow-wrap: break-word;
            padding-left: calc(3.3rem - 14px);
            padding-right: 1rem;
        }
    }

    .expand {
        cursor: pointer;
        color: hsl(0deg 32% 83%);

        &:hover {
            color: hsl(0deg 0% 20%);
        }
    }

    .subtle {
        color: hsl(0deg 7% 45%);
    }

    .code-context {
        color: hsl(0deg 7% 15%);
        background-color: hsl(0deg 7% 98%);
        box-shadow:
            inset 0 11px 10px -10px hsl(0deg 7% 70%),
            inset 0 -11px 10px -10px hsl(0deg 7% 70%);

        margin-top: 1em;
        margin-bottom: 1em;

        .code-context-content {
            padding: 1rem 0;
            white-space: pre;
            overflow-x: auto;
        }

        .line-number {
            width: 3rem;
            display: inline-block;
            text-align: right;
            color: hsl(0deg 7% 35%);
        }

        .focus-line {
            background-color: hsl(0deg 7% 90%);
            width: 100%;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: buttons.css]---
Location: zulip-main/web/styles/buttons.css

```text
.action-button {
    position: relative;
    display: flex;
    gap: 0.75ch;
    justify-content: center;
    align-items: center;
    line-height: 1.25;
    font-size: var(--base-font-size-px);
    font-family: "Source Sans 3 VF", sans-serif;
    font-weight: 500;
    letter-spacing: 0.02ch;
    padding: 0.25em 0.625em;
    color: var(--color-text-neutral-quiet-action-button);
    background-color: var(--color-background-neutral-quiet-action-button);
    border-radius: 4px;
    white-space: nowrap;
    user-select: none;
    border: none;
    cursor: pointer;
    clip-path: inset(-1px);
    transition: 0.05s ease-in;
    transition-property: background-color, clip-path;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-neutral-quiet-action-button-hover
        );
        transition: 0.1s ease-out;
        transition-property: background-color, clip-path;
    }

    &:active {
        background-color: var(
            --color-background-neutral-quiet-action-button-active
        );
        clip-path: inset(1px round 4px);
    }

    &:focus {
        /* Override common button outline style set in zulip.css and dark_theme.css */
        outline: none;
    }

    &:focus-visible {
        /* Override common button outline style set in zulip.css and dark_theme.css */
        outline: var(--outline-width-button-focus) solid
            var(--color-outline-button-focus) !important;
        outline-offset: var(--outline-offset-button-focus);
        clip-path: inset(
            calc(
                    -1 *
                        (
                            var(--outline-width-button-focus) +
                                var(--outline-offset-button-focus)
                        )
                )
                round 4px
        );
    }

    &:disabled {
        cursor: default;
        pointer-events: none;
        opacity: 0.5;
    }

    .zulip-icon {
        /* We apply the same line-height to icons,
           as those applied to the label element,
           to maintain a consistent height for
           icon-only action buttons. */
        line-height: 1.25; /* 20px at 16px/1em */
    }
}

.action-button-label {
    max-width: 32ch;
    text-overflow: ellipsis;
    overflow: hidden;
}

/* Action buttons -- Neutral Intent */
.action-button-primary-neutral {
    color: var(--color-text-neutral-primary-action-button);
    background-color: var(--color-background-neutral-primary-action-button);

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-neutral-primary-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-neutral-primary-action-button-active
        );
    }
}

.action-button-quiet-neutral {
    color: var(--color-text-neutral-quiet-action-button);
    background-color: var(--color-background-neutral-quiet-action-button);
    box-shadow: 0 0 0.5px 0.5px var(--color-inner-shadow-action-button) inset;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-neutral-quiet-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-neutral-quiet-action-button-active
        );
    }
}

.action-button-borderless-neutral {
    color: var(--color-text-neutral-borderless-action-button);
    background-color: transparent;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-neutral-borderless-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-neutral-borderless-action-button-active
        );
    }
}

/* Action buttons -- Brand Intent */
.action-button-primary-brand {
    color: var(--color-text-brand-primary-action-button);
    background-color: var(--color-background-brand-primary-action-button);

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-brand-primary-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-brand-primary-action-button-active
        );
    }
}

.action-button-quiet-brand {
    color: var(--color-text-brand-quiet-action-button);
    background-color: var(--color-background-brand-quiet-action-button);
    box-shadow: 0 0 0.5px 0.5px var(--color-inner-shadow-action-button) inset;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-brand-quiet-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-brand-quiet-action-button-active
        );
    }
}

.action-button-borderless-brand {
    color: var(--color-text-brand-borderless-action-button);
    background-color: transparent;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-brand-borderless-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-brand-borderless-action-button-active
        );
    }
}

/* Action buttons -- Info Intent */
.action-button-primary-info {
    color: var(--color-text-info-primary-action-button);
    background-color: var(--color-background-info-primary-action-button);

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-info-primary-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-info-primary-action-button-active
        );
    }
}

.action-button-quiet-info {
    color: var(--color-text-info-quiet-action-button);
    background-color: var(--color-background-info-quiet-action-button);
    box-shadow: 0 0 0.5px 0.5px var(--color-inner-shadow-action-button) inset;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-info-quiet-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-info-quiet-action-button-active
        );
    }
}

.action-button-borderless-info {
    color: var(--color-text-info-borderless-action-button);
    background-color: transparent;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-info-borderless-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-info-borderless-action-button-active
        );
    }
}

/* Action buttons -- Success Intent */
.action-button-primary-success {
    color: var(--color-text-success-primary-action-button);
    background-color: var(--color-background-success-primary-action-button);

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-success-primary-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-success-primary-action-button-active
        );
    }
}

.action-button-quiet-success {
    color: var(--color-text-success-quiet-action-button);
    background-color: var(--color-background-success-quiet-action-button);
    box-shadow: 0 0 0.5px 0.5px var(--color-inner-shadow-action-button) inset;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-success-quiet-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-success-quiet-action-button-active
        );
    }
}

.action-button-borderless-success {
    color: var(--color-text-success-borderless-action-button);
    background-color: transparent;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-success-borderless-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-success-borderless-action-button-active
        );
    }
}

/* Action buttons -- Warning Intent */
.action-button-primary-warning {
    color: var(--color-text-warning-primary-action-button);
    background-color: var(--color-background-warning-primary-action-button);

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-warning-primary-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-warning-primary-action-button-active
        );
    }
}

.action-button-quiet-warning {
    color: var(--color-text-warning-quiet-action-button);
    background-color: var(--color-background-warning-quiet-action-button);
    box-shadow: 0 0 0.5px 0.5px var(--color-inner-shadow-action-button) inset;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-warning-quiet-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-warning-quiet-action-button-active
        );
    }
}

.action-button-borderless-warning {
    color: var(--color-text-warning-borderless-action-button);
    background-color: transparent;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-warning-borderless-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-warning-borderless-action-button-active
        );
    }
}

/* Action buttons -- Danger Intent */
.action-button-primary-danger {
    color: var(--color-text-danger-primary-action-button);
    background-color: var(--color-background-danger-primary-action-button);

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-danger-primary-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-danger-primary-action-button-active
        );
    }
}

.action-button-quiet-danger {
    color: var(--color-text-danger-quiet-action-button);
    background-color: var(--color-background-danger-quiet-action-button);
    box-shadow: 0 0 0.5px 0.5px var(--color-inner-shadow-action-button) inset;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-danger-quiet-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-danger-quiet-action-button-active
        );
    }
}

.action-button-borderless-danger {
    color: var(--color-text-danger-borderless-action-button);
    background-color: transparent;

    &:hover,
    &:focus-visible {
        background-color: var(
            --color-background-danger-borderless-action-button-hover
        );
    }

    &:active {
        background-color: var(
            --color-background-danger-borderless-action-button-active
        );
    }
}

.icon-button {
    /* This class should always be used with an icon-button-* class
       defining the color scheme of the button, defined below. */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
    font-size: var(--base-font-size-px);
    background-color: transparent; /* Override button default background color */
    padding: 0.375em;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    clip-path: inset(-1px);
    transition: 0.05s ease-in;
    transition-property: background-color, clip-path;

    &:hover,
    &:focus-visible {
        transition: 0.1s ease-out;
        transition-property: background-color, clip-path;
    }

    &:active {
        clip-path: inset(1px round 4px);
    }

    &:focus {
        /* Override common button outline style set in zulip.css and dark_theme.css */
        outline: none;
    }

    &:focus-visible {
        /* Override common button outline style set in zulip.css and dark_theme.css */
        outline: var(--outline-width-button-focus) solid
            var(--color-outline-button-focus) !important;
        outline-offset: var(--outline-offset-button-focus);
        clip-path: inset(
            calc(
                    -1 *
                        (
                            var(--outline-width-button-focus) +
                                var(--outline-offset-button-focus)
                        )
                )
                round 4px
        );
    }

    &:disabled {
        cursor: default;
        pointer-events: none;
        opacity: 0.5;
    }
}

.icon-button-neutral {
    color: var(--color-text-neutral-icon-button);

    &:hover,
    &:focus-visible {
        color: var(--color-text-neutral-icon-button-hover);
    }

    &:active {
        color: var(--color-text-neutral-icon-button-active);
    }

    &.icon-button-square {
        &:hover,
        &:focus-visible {
            background-color: var(
                --color-background-neutral-icon-button-square-hover
            );
        }

        &:active {
            color: var(--color-text-neutral-icon-button-square-active);
            background-color: var(
                --color-background-neutral-icon-button-square-active
            );
        }
    }
}

.icon-button-brand {
    color: var(--color-text-brand-icon-button);

    &:hover,
    &:focus-visible {
        color: var(--color-text-brand-icon-button-hover);
    }

    &:active {
        color: var(--color-text-brand-icon-button-active);
    }

    &.icon-button-square {
        &:hover,
        &:focus-visible {
            background-color: var(
                --color-background-brand-icon-button-square-hover
            );
        }

        &:active {
            color: var(--color-text-brand-icon-button-square-active);
            background-color: var(
                --color-background-brand-icon-button-square-active
            );
        }
    }
}

.icon-button-info {
    color: var(--color-text-info-icon-button);

    &:hover,
    &:focus-visible {
        color: var(--color-text-info-icon-button-hover);
    }

    &:active {
        color: var(--color-text-info-icon-button-active);
    }

    &.icon-button-square {
        &:hover,
        &:focus-visible {
            background-color: var(
                --color-background-info-icon-button-square-hover
            );
        }

        &:active {
            color: var(--color-text-info-icon-button-square-active);
            background-color: var(
                --color-background-info-icon-button-square-active
            );
        }
    }
}

.icon-button-success {
    color: var(--color-text-success-icon-button);

    &:hover,
    &:focus-visible {
        color: var(--color-text-success-icon-button-hover);
    }

    &:active {
        color: var(--color-text-success-icon-button-active);
    }

    &.icon-button-square {
        &:hover,
        &:focus-visible {
            background-color: var(
                --color-background-success-icon-button-square-hover
            );
        }

        &:active {
            color: var(--color-text-success-icon-button-square-active);
            background-color: var(
                --color-background-success-icon-button-square-active
            );
        }
    }
}

.icon-button-warning {
    color: var(--color-text-warning-icon-button);

    &:hover,
    &:focus-visible {
        color: var(--color-text-warning-icon-button-hover);
    }

    &:active {
        color: var(--color-text-warning-icon-button-active);
    }

    &.icon-button-square {
        &:hover,
        &:focus-visible {
            background-color: var(
                --color-background-warning-icon-button-square-hover
            );
        }

        &:active {
            color: var(--color-text-warning-icon-button-square-active);
            background-color: var(
                --color-background-warning-icon-button-square-active
            );
        }
    }
}

.icon-button-danger {
    color: var(--color-text-danger-icon-button);

    &:hover,
    &:focus-visible {
        color: var(--color-text-danger-icon-button-hover);
    }

    &:active {
        color: var(--color-text-danger-icon-button-active);
    }

    &.icon-button-square {
        &:hover,
        &:focus-visible {
            background-color: var(
                --color-background-danger-icon-button-square-hover
            );
        }

        &:active {
            color: var(--color-text-danger-icon-button-square-active);
            background-color: var(
                --color-background-danger-icon-button-square-active
            );
        }
    }
}

.button-loading-indicator {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

    .loading_indicator_spinner {
        /* Override standard values defined
           in web/styles/app_components.css */
        height: 100%;
        width: unset;
        aspect-ratio: 1;

        & path {
            /* Set the loading indicator color
               to the font color of the button. */
            fill: currentcolor;
        }
    }
}

.button-hide-loading-indicator-on-hover:hover {
    .button-loading-indicator {
        visibility: hidden;
    }

    .action-button-label,
    .zulip-icon {
        visibility: visible !important;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: color_picker.css]---
Location: zulip-main/web/styles/color_picker.css

```text
.color-swatch-list {
    display: grid;
    grid-template-columns: repeat(6, var(--size-color-swatch));
    gap: var(--grid-gap-color-swatch);
    place-items: center;
    padding: var(--padding-color-swatch-list);
}

.color-swatch-input {
    display: none;
}

.color-swatch-input:checked + .color-swatch-label {
    outline: 2px solid var(--color-outline-focus);
    outline-offset: 1px;
}

.color-swatch-label {
    width: var(--size-color-swatch);
    height: var(--size-color-swatch);
    border-radius: 50%;
    cursor: pointer;

    &:focus-visible {
        outline: 2px solid var(--color-outline-focus);
        outline-offset: 1px;
    }
}

.custom-color-picker {
    position: relative;
}

.color-picker-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
    visibility: hidden;
}

.custom-color-swatch-icon {
    border-radius: 50%;
    background: var(--gradient-custom-swatch);
}

.color-picker-popover .message-header-contents {
    border: none;
}

.color_picker_confirm_button {
    height: 100%;

    &:focus-visible {
        outline: 1px solid var(--color-outline-focus);
        outline-offset: -2px;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: components.css]---
Location: zulip-main/web/styles/components.css

```text
/* Reusable, object-oriented CSS base components for all Zulip pages
   (both web app and portico). */

label.checkbox {
    padding: 0;
    display: inline-block;
    position: relative;
    vertical-align: top;
    min-height: 20px;

    & input[type="checkbox"] {
        position: absolute;
        clip-path: rect(0 0 0 0);

        ~ .rendered-checkbox {
            display: inline-block;
            vertical-align: middle;
            position: relative;
            top: -2px;

            padding: 2px;
            margin: 0 5px 0 0;
            height: 10px;
            width: 10px;

            font-weight: 300;
            line-height: 0.8;
            font-size: 1.3rem;
            text-align: center;
            /* Color variables are not imported to the portico, so we duplicate
               the light-mode color value here as a fallback. */
            border: 1px solid
                var(--color-border-rendered-checkbox, hsl(0deg 0% 0% / 60%));
            border-radius: 4px;

            cursor: pointer;
        }

        &:checked ~ .rendered-checkbox {
            /* As with the border color above, we duplicate
               the light-mode SVG URL value here as a fallback. */
            background-image: var(
                --svg-url-rendered-checkbox,
                url("../images/checkbox.svg")
            );
            background-size: 85%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }

        &:disabled ~ .rendered-checkbox {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &:has(.enter_sends) {
        vertical-align: middle;
    }
}

a.no-style {
    color: inherit;
}

a.no-underline,
a.no-underline:hover,
a.no-underline:focus {
    text-decoration: none;
}

.italic {
    font-style: italic;
}

.simplebar-track {
    .simplebar-scrollbar::before {
        background-color: hsl(0deg 0% 0%);
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 33%);
    }

    &.simplebar-vertical {
        transition: width 0.2s ease 1s; /* stylelint-disable-line plugin/no-low-performance-animation-properties */

        &.simplebar-hover {
            width: 15px;
            transition: width 0.2s ease; /* stylelint-disable-line plugin/no-low-performance-animation-properties */
        }
    }

    &.simplebar-horizontal {
        transition: height 0.2s ease 1s; /* stylelint-disable-line plugin/no-low-performance-animation-properties */

        &.simplebar-hover {
            height: 15px;
            transition: height 0.2s ease; /* stylelint-disable-line plugin/no-low-performance-animation-properties */
        }
    }
}

i.zulip-icon.zulip-icon-bot {
    color: var(--color-icon-bot);
}

/* Hide the somewhat buggy browser show password feature in IE, Edge,
   since it duplicates our own "show password" widget. */
input::-ms-reveal {
    display: none;
}

.password-div {
    position: relative;

    .password_visibility_toggle {
        position: absolute;
        right: 10px;
        top: 42px;
        opacity: 0.6;

        &:hover {
            opacity: 1;
        }
    }
}

select.bootstrap-focus-style {
    &:focus {
        outline: 1px dotted hsl(0deg 0% 20%);
        outline: 5px auto -webkit-focus-ring-color;
        outline-offset: -2px;
        transition: none;
    }
}
```

--------------------------------------------------------------------------------

````

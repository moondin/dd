---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 730
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 730 of 1290)

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

---[FILE: informational_overlays.css]---
Location: zulip-main/web/styles/informational_overlays.css

```text
.informational-overlays {
    .overlay-content {
        width: var(--informational-overlay-max-width);
        margin: 0 auto;
        position: relative;
        top: calc((30vh - 50px) / 2);
        border-radius: 4px;
        overflow: hidden;

        background-color: var(--color-background-modal);
    }

    .overlay-tabs {
        padding: 10px 0;
        border-bottom: 1px solid hsl(0deg 0% 0% / 20%);

        .tab-switcher {
            margin-left: 15px;
        }

        .exit {
            float: right;
            font-size: 1.5rem;
            color: hsl(0deg 0% 67%);
            font-weight: 600;
            margin: 0 15px;
            cursor: pointer;
        }
    }

    .overlay-modal {
        padding-bottom: 10px;

        .overlay-scroll-container {
            height: 70vh;
            text-align: center;
            outline: none;

            .help-table {
                table-layout: fixed;
            }

            & th {
                font-weight: 400;
            }
        }
    }

    & td.operator {
        font-size: 0.9em;
    }

    .poll-question-header {
        display: inline;
    }
}

.hotkeys_table {
    table-layout: fixed;
    width: 100%;
    vertical-align: middle;
    display: table;

    & td.definition {
        /* keeps dividing line at same width for all tables in model. */
        width: calc(50% - 11px);
        text-align: right;
    }

    .hotkey {
        font-weight: normal;
    }

    .arrow-key {
        font-size: 1.36em;
        line-height: 1;
        padding: 0 0.2em 0.2em;
    }

    & th {
        width: 245px;
        text-align: center;
        /* aligns table name with dividing line */
    }

    & td:not(.definition) {
        text-align: left;
        white-space: normal;
        font-weight: bold;
    }
}

#keyboard-shortcuts table {
    margin-bottom: 10px !important;
}

@media only screen and (width < $md_min) {
    .informational-overlays {
        .overlay-content {
            width: calc(100% - 20px);
            /* Constrain to same width as in larger viewports. */
            max-width: var(--informational-overlay-max-width);
        }

        .tab-switcher {
            display: flex;

            &.large .ind-tab {
                width: 100%;
            }
        }

        .hotkeys_table {
            width: 100%;
            display: table;
        }
    }
}

#message-formatting-first-header,
#search-operators-first-header {
    width: 40%;
}
```

--------------------------------------------------------------------------------

---[FILE: inputs.css]---
Location: zulip-main/web/styles/inputs.css

```text
.input-active-styles {
    color: var(--color-text-input);
    background-color: var(--color-background-input-focus);
    outline-color: var(--color-outline-input-focus);
}

.input-element-wrapper {
    display: grid;
    grid-template:
        /* We present a variable to set a uniform row height when needed;
           otherwise, we fall back to the sensible `auto` value. */
        [input-element-start] "icon-starting-offset input-icon icon-content-gap content button-content-gap input-button button-ending-offset" var(
            --input-element-row-height,
            auto
        )
        [input-element-end] / [input-element-start] var(
            --input-icon-starting-offset
        )
        var(--input-icon-width) var(--input-icon-content-gap) minmax(0, 1fr)
        var(--input-button-content-gap) var(--input-button-width) var(
            --input-button-ending-offset
        )
        [input-element-end];
    align-items: center;

    .input-element {
        grid-area: input-element;
        box-sizing: border-box;
        padding: 0.25em 0.5em; /* 4px at 16px/1em and 8px at 16px/1em */
        font-size: var(--base-font-size-px);
        font-family: "Source Sans 3 VF", sans-serif;
        line-height: 1.25;
        text-overflow: ellipsis;
        color: var(--color-text-input);
        background: var(--color-background-input);
        outline: 1px solid var(--color-outline-input);
        outline-offset: -1px;
        border: none;
        border-radius: 4px;
        transition: 0.1s linear;
        transition-property: outline-color, box-shadow;

        &:hover {
            outline-color: var(--color-outline-input-hover);
        }

        &:focus {
            @extend .input-active-styles;

            box-shadow: 0 0 5px var(--color-box-shadow-input-focus);
        }
    }

    &.has-input-icon .input-element {
        padding-left: calc(
            var(--input-icon-starting-offset) + var(--input-icon-width) +
                var(--input-icon-content-gap)
        );
    }

    &.has-input-button .input-element {
        padding-right: calc(
            var(--input-button-content-gap) + var(--input-button-width) +
                var(--input-button-ending-offset)
        );
    }

    /* Special styles for input with pills */
    &.has-input-pills .pill-container {
        .input {
            flex-grow: 1;
            /* Override default values in web/styles/input_pill.css  */
            padding: 0;
            line-height: inherit;

            &:empty::before {
                color: var(--color-text-placeholder);
                content: attr(data-placeholder);
            }
        }

        .pill {
            height: 1.25em; /* 20px at 16px/1em */
        }

        &:has(.input:hover) {
            outline-color: var(--color-outline-input-hover);
        }

        &:has(.input:focus) {
            @extend .input-active-styles;

            box-shadow: 0 0 5px var(--color-box-shadow-input-focus);
        }
    }
}

.input-icon {
    grid-area: input-icon;
    /* Matching the color of input icon on the left to
       that of a neutral icon button gives us a consistent
       look when paired with the input button on the right. */
    color: var(--color-text-neutral-icon-button);
    /* We need to set the z-index, since the input icon
       comes before the input element in the DOM, but we
       want to display it over the input element in the UI. */
    z-index: 1;
    pointer-events: none;
}

.input-button {
    grid-area: input-button;
    padding: 0.25em; /* 4px at 16px/1em */
}

.filter-input {
    /* We use the `input` tag in the selector to avoid conflicts
       with the pill containing counterpart, which uses a `contenteditable`
       div instead of an input element, and thus doesn't support the
       placeholder pseudo-classes. */
    input.input-element {
        &:placeholder-shown {
            /* In case of filter inputs, when the input field
            is empty, we hide the input button and adjust
            the right padding to compensate for the same. */
            padding-right: 0.5em;

            ~ .input-close-filter-button {
                visibility: hidden;
            }
        }

        &:not(:placeholder-shown) {
            @extend .input-active-styles;
        }
    }

    /* Specific styles for filter input with pills */
    &.has-input-pills {
        &:not(:has(.pill)):has(.input:empty) {
            .input-element {
                padding-right: 0.5em;
            }

            .input-close-filter-button {
                visibility: hidden;
            }
        }

        &:has(.pill):not(:has(.input:empty)) .input-element {
            @extend .input-active-styles;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: input_pill.css]---
Location: zulip-main/web/styles/input_pill.css

```text
.pill-container {
    display: inline-flex;
    gap: var(--vertical-spacing-input-pill) var(--horizontal-spacing-input-pill);
    flex-wrap: wrap;
    min-width: 0;

    background-color: var(--color-background-pill-container);

    padding: var(--outer-spacing-input-pill-container);
    border: 1px solid var(--color-border-pill-container);
    border-radius: 4px;
    align-items: center;

    cursor: text;

    .pill {
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        min-width: 0;
        position: relative;

        height: var(--height-input-pill);
        /* Make sure the `height` property
           is the authoritative source of an
           input pill's height, without being
           affected by borders, etc. */
        box-sizing: border-box;
        margin: 0;

        color: inherit;

        border-radius: 4px;
        background-color: var(--color-background-input-pill);
        cursor: pointer;

        /* Not focus-visible, because we want to support mouse+backpace to
           delete pills */
        &:focus {
            /* Box shadow instead of border, because user pills have avatars
               that extend all the way to the edge of the pill. */
            box-shadow: 0 0 0 1px var(--color-focus-outline-input-pill) inset;
            outline: none;

            /* For user pills with avatars, the avatar covers up the box
               shadow, so we also have to make a border around the avatar. */
            .pill-image-border {
                border-right: none;
                border-radius: 4px 0 0 4px;
                border-color: var(--color-focus-outline-input-pill);
            }
        }

        /* Ensure a hover state on pills that can be clicked
           to reveal a user card. */
        &.view_user_profile:hover {
            background-color: var(--color-background-input-pill-hover);
        }

        .pill-image {
            height: var(--height-input-pill);
            width: var(--height-input-pill);
            border-radius: 4px;
        }

        .pill-image-border {
            height: var(--height-input-pill);
            width: var(--height-input-pill);
            position: absolute;
            box-sizing: border-box;
            border: 1px solid;
            border-radius: 4px;
            border-color: var(--color-border-input-pill-image);
        }

        .channel-privacy-type-icon {
            padding-right: 2px;
        }

        .pill-label {
            /* Treat as flex container to better position status
               emoji and control ellipsis on the pill value. */
            display: flex;
            /* Allow label to collapse for ellipsis effect. */
            min-width: 0;
            align-items: center;
            margin: 0 var(--input-pill-side-padding);

            .zulip-icon-bot {
                margin-left: 0.4em;
            }
        }

        .pill-value {
            flex: 0 1 auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5;
        }

        .pill-close-button,
        .pill-expand-button {
            font-size: 0.7142em; /* 10px at 14px em */
            text-decoration: none;
            /* Let the close button's box stretch,
               but no larger than the height of the
               banner box when the action button
               achieves its full height (margin,
               padding, and height), which keeps
               the X vertically centered with it. */
            align-self: stretch;
            max-height: 52px;
            /* Display as flexbox to better control
               the X icon's position. This creates
               an anonymous flexbox item out of the
               ::before content where the icon sits. */
            display: flex;
            align-items: center;
            /* !important overrides `.dark-theme:root a:hover` */
            color: var(--color-input-pill-close) !important;
            opacity: 0.7;
        }

        .exit,
        .expand {
            width: var(--length-input-pill-exit);
            height: var(--length-input-pill-exit);
            display: flex;
            justify-content: center;
            margin-right: 2px;
            border-radius: 2px;

            &:hover {
                background: var(--color-background-input-pill-exit-hover);

                .pill-close-button,
                .pill-expand-button {
                    opacity: 1;
                }
            }
        }

        .group-members-count {
            opacity: 0.65;
        }

        &.deactivated-pill {
            background-color: var(--color-background-deactivated-user-pill);
            opacity: 0.7;

            &:focus {
                border-color: var(--color-focus-outline-deactivated-user-pill);
            }

            .pill-close-button {
                /* !important overrides `.dark-theme:root a:hover` */
                color: var(--color-close-deactivated-user-pill) !important;
            }

            .exit:hover {
                background: var(
                    --color-background-exit-hover-deactivated-user-pill
                );
            }

            > img {
                opacity: 0.5;
            }
        }
    }

    .slashed-circle-icon {
        position: absolute;
        background-color: var(--color-background-deactivated-user-pill);
        padding: 0.2em;
        font-size: 0.7em;
        border-radius: 0.625em;
        bottom: -0.0625em;
        left: 1.1em;
        opacity: 1;
    }

    &.not-editable {
        cursor: not-allowed;
        border: none;
        background-color: transparent;
        padding: 0;

        .pill {
            padding-right: 4px;
            cursor: not-allowed;

            &:focus {
                color: inherit;
                border: 1px solid hsl(0deg 0% 0% / 15%);
                background-color: hsl(0deg 0% 0% / 7%);
            }

            .exit {
                display: none;
            }
        }
    }

    .input {
        display: inline-block;
        /* This keeps the input sized to
           the same height as pills. */
        line-height: var(--height-input-pill);
        padding: 0 4px;

        min-width: 2px;
        overflow-wrap: anywhere;
        flex: 1 1 auto;

        outline: none;

        &.shake {
            animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
        }
    }

    &.not-editable-by-user {
        cursor: not-allowed;

        .pill {
            cursor: not-allowed;
        }

        .exit {
            display: none;
        }
    }

    &.invalid {
        border-color: var(--color-invalid-input-border);
        box-shadow: var(--invalid-input-box-shadow);
    }
}

.person_picker {
    .pill:hover {
        background-color: var(--color-background-input-pill-hover);
    }
}

#compose-direct-recipient .pill-container {
    border: 1px solid var(--color-compose-recipient-box-border-color);

    .input:first-child:empty::before {
        content: attr(data-no-recipients-text);
        opacity: 0.5;
    }

    &:has(.input:focus) {
        border-color: var(--color-compose-recipient-box-has-focus);
    }
}

#invitee_emails_container .pill-container,
#integration-url-filter-branches .pill-container {
    width: 100%;
    box-sizing: border-box;
    background-color: var(
        --color-background-pill-container-without-placeholder
    );
}

#invitee_emails_container .pill-container.not-editable-by-user {
    height: var(--height-input-pill);
    background-color: var(--color-background-pill-container-input-disabled);
}

.add_subscribers_container .pill-container,
.add_streams_container .pill-container,
.add-user-group-container .pill-container,
.add_members_container .pill-container {
    width: 100%;

    .input:first-child:empty::before {
        opacity: 0.5;
        content: attr(data-placeholder);
    }
}

.add_streams_container .input,
.add-user-group-container .input {
    flex-grow: 1;
}

.display_only_pill,
.display_only_group_pill {
    /* Ensure middle alignment in table contexts. */
    vertical-align: middle;
    /* Resetting these values to prevent unintended inheritance from .pill-container styles. */
    padding: 0;
    border: 0;

    /* Particularly in light mode, pill colors are almost identical
       to the settings modal background. We place a higher-contrast
       outline on them accordingly. */
    .pill,
    .pill:focus {
        outline: 1px solid var(--color-outline-low-attention-input-pill);
        /* We offset the outline so that pills do not grow in size
           when presented with an outline. */
        outline-offset: -1px;

        /* Display `(you)` with the same 5px padding to the right
           as ordinary .pill-value text. */
        .my_user_status {
            padding-right: 5px;
        }

        /* Zero out the margin placed to the left of the bot icon,
           and add in the 5px of padding to the right. Specificity
           necessitates duplicating the .pill-label class here. */
        .pill-label .zulip-icon-bot {
            margin-left: 0;
            padding-right: 5px;
        }

        .deactivated-user-icon {
            padding-right: 5px;
        }
    }

    .pill:focus {
        /* We don't want to flash a focus outline
               when clicking on display-only pills. */
        box-shadow: unset;
        /* We also suppress the border on the pill
               image. */
        .pill-image-border {
            border: 0;
        }
    }
}

/* These pill are similar to .not-editable, but are meant to show
   profile cards when clicked. */
.user-type-custom-field-pill-container > .display_only_pill,
.panel_user_list > .pill-container,
.creator_details > .display_only_pill {
    gap: 2px;
    flex-wrap: nowrap;

    &.inline_with_text_pill > .pill-deactivated {
        font-size: 0.9em;
        padding-right: 2px;
    }

    &:hover {
        color: inherit;
    }

    /* `settings.css` applies a :focus-within box-shadow to `.custom_user_field .pill-container`
    and `.bot_owner_user_field .pill-container`.That effect conflicts with the unified pill
    styling (no shadow), so we override it here. */
    &:focus-within {
        box-shadow: none;
    }

    > .pill {
        border: none;
        text-decoration: none;

        &:focus {
            color: inherit;
        }

        > .pill-label {
            margin: 0;

            > .pill-value {
                padding: 5px;
                max-width: 165px;
            }
        }
    }
}

#user-profile-modal {
    .user-type-custom-field-pill-container {
        display: inline-flex;
        gap: var(--vertical-spacing-input-pill)
            var(--horizontal-spacing-input-pill);
        max-width: 100%;
        flex-wrap: wrap;

        /* We override the `.pill-container` style defined in
         `settings.css` to ensure it expands to full width, preventing
        names in the pill from being cut off in the user profile modal. */
        .pill-container {
            max-width: 100%;
        }

        /* We're overriding the `.pill-value` style defined
        in `settings.css` to ensure that names inside the pill
        render fully and aren't cut off in the user profile modal. */
        .pill-value {
            max-width: 100%;
        }
    }
}

.creator_details > .display_only_pill {
    /* On channel and group creation details,
       align the pill contents better with
       the surrounding text. */
    vertical-align: baseline;
}

.creator_details > .display_only_pill.inline_with_text_pill {
    padding: 0;

    > .pill {
        margin: 0;
        align-items: baseline;

        > .pill-image {
            /* Add line-height equal to height to mimic baseline alignment. */
            line-height: 20px;
            align-self: center;
        }

        > .pill-label {
            > .pill-value {
                padding: 0 5px;
                max-width: 200px;
            }

            > .my_user_status {
                margin-right: 2px;
            }
        }
    }
}

.display_only_group_pill .zulip-icon-user-group {
    /* Reserve the same square box for the user-group
       icon as on pill images. */
    height: var(--height-input-pill);
    width: var(--height-input-pill);
    /* Center the icon in the box using flex. */
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-3px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(3px, 0, 0);
    }
}
```

--------------------------------------------------------------------------------

````

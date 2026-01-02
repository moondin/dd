---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 742
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 742 of 1290)

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

---[FILE: typeahead.css]---
Location: zulip-main/web/styles/typeahead.css

```text
/* CSS for Bootstrap typeahead */

.dropdown-menu {
    display: none;
    min-width: 160px;
    list-style: none;
}

.open > .dropdown-menu {
    display: block;
}

.typeahead {
    z-index: 1051;
}

.typeahead.dropdown-menu .typeahead-menu .simplebar-content {
    min-width: max-content;

    & > li {
        overflow-wrap: anywhere;

        & > a {
            display: flex;
            align-items: center;
            padding: 0.2142em 0.7142em; /* 3px 10px at 14px em */
            gap: 0.3571em; /* 5px at 14px em */
            font-weight: normal;
            /* We want to keep this `max-width` less than 320px. */
            max-width: 292px;
            line-height: 1.43; /* 20px / 14px */
            color: var(--color-dropdown-item);
            white-space: nowrap;

            @media (width >= $ml_min) {
                /* Scale up with font size on larger widths. */
                /* 292px / 14px */
                max-width: 20.86em;
            }

            /* hidden text just to maintain line height for a blank option */
            strong:empty {
                &::after {
                    content: ".";
                    visibility: hidden;
                }
            }

            &:hover,
            &:focus {
                text-decoration: none;
                outline: 0;
            }

            &.topic-typeahead-link {
                gap: 5px;
            }

            &.topic-edit-typeahead {
                display: flex;
                flex-wrap: wrap;

                .typeahead-strong-section {
                    /* We want to wrap the topic but preserve
                       original white spaces sequence too. */
                    white-space: pre-wrap;
                }
            }

            .typeahead-text-container {
                display: flex;
                align-self: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                gap: 3px;
                align-items: baseline;
            }

            .compose-stream-name {
                overflow: visible;
                gap: 0;
            }
        }

        .stream-to-topic-arrow {
            margin-left: 0.375em; /* 6px at 16px em */
            cursor: default;
            color: var(--color-compose-chevron-arrow);
            text-decoration: none;
        }
    }

    .active > a {
        &,
        &:hover,
        &:focus {
            color: var(--color-active-dropdown-item);
            background-color: var(--background-color-active-typeahead-item);
        }

        & .user-circle-offline {
            /* Ensure better contrast on highlighted
               typeahead items. */
            color: var(--color-user-circle-offline-typeahead-highlight);
        }
    }

    .pronouns,
    .autocomplete_secondary {
        align-self: baseline;
        opacity: 0.8;
        font-size: 85%;
        overflow: hidden;
        text-overflow: ellipsis;

        & > a {
            color: var(--color-dropdown-item);
            text-decoration: underline 1px;
            text-decoration-color: var(--color-dropdown-item-link-underline);
            opacity: 0.6;
        }
    }

    .autocomplete_secondary {
        flex: 1 1 0;
    }

    .active .pronouns,
    .active .autocomplete_secondary {
        opacity: 1;
    }
}

.typeahead.dropdown-menu {
    .typeahead-menu {
        list-style: none;
        margin: 4px 0;
        max-height: min(248px, 95vh);
        overflow-y: auto;
    }

    .typeahead-footer {
        margin: 0;
        padding: 4px 10px;
        border-top: 1px solid hsl(0deg 0% 0% / 20%);
        display: flex;
        align-items: center;
    }

    #typeahead-footer-text {
        color: var(--color-dropdown-item);
        font-size: 0.8571em; /* 12px at 14px/em */
    }

    a strong.typeahead-strong-section {
        /* Can't use flex to display this item if
           we want `text-overflow: ellipsis` to work
           which only works on block elements. */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
        align-items: baseline;
        font-weight: 500;

        .channel-privacy-type-icon {
            margin-right: 3px;
        }
    }
}

.typeahead-option-label-container {
    display: flex !important;
    justify-content: space-between;

    > strong {
        margin-right: 14px;
    }

    .typeahead-option-label {
        color: var(--color-typeahead-option-label);
    }
}

.typeahead-image.zulip-icon {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* For FontAwesome icons and zulip icons used in place of images for some users. */
.typeahead-image {
    flex: 0 0 auto;
    position: relative;
    height: 1.3125em; /* 21px at 16px/1em */
    width: 1.3125em; /* 21px at 16px/1em */
    border-radius: 4px;

    .typeahead-image-avatar {
        border-radius: 4px;
        /* Override bootstrap img */
        vertical-align: baseline;
    }

    .user-circle {
        position: absolute;
        /* This is smaller than the sidebar because avatars here are smaller */
        font-size: 0.4375em; /* 7px at 16px/1em */
        line-height: 1;
        bottom: -0.5px;
        right: -0.5px;
        background-color: var(--color-background-dropdown-widget);
        padding: 1px;
        border-radius: 50%;

        &.user-circle-offline {
            display: none;
        }
    }

    /* Move the background styles onto the :before element so that the 1px padding
       outline still works. */
    .user-circle-idle {
        background: var(--color-background-dropdown-widget);
    }

    .user-circle-idle::before {
        background: var(--gradient-user-circle-idle);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        border-radius: 50%;
    }
}

.typeahead-text-container {
    i.zulip-icon-bot {
        align-self: center;
    }

    /*
    Negates the extra 3px left margin from `.status-emoji` in zulip.css, which,
    combined with .typeahead-text-container's `gap`, created unintended spacing.
    The typeahead's spacing is now managed only by `gap` in
    .typeahead-text-container.
    */
    .status-emoji {
        margin-left: 0;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: typing_notifications.css]---
Location: zulip-main/web/styles/typing_notifications.css

```text
#typing_notifications {
    display: none;
    margin-left: 10px;
    font-style: italic;
    color: hsl(0deg 0% 53%);
}

#typing_notification_list {
    list-style: none;
    margin: 0;
}

#mark_as_read_turned_off_banner {
    /* override the margin of main-view-banner since it causes
       more gap than we want between mark as read banner and typing
       notification.  */
    margin: 5px 0;
}
```

--------------------------------------------------------------------------------

---[FILE: user_circles.css]---
Location: zulip-main/web/styles/user_circles.css

```text
.user-circle-active {
    color: var(--color-user-circle-active);
}

.user-circle-idle {
    background: var(--gradient-user-circle-idle);
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.with_avatar .user-circle-idle {
    background: var(--gradient-user-circle-idle-avatar);
}

.user-circle-offline {
    color: var(--color-user-circle-offline);
}

.user-circle-deactivated {
    color: var(--color-user-circle-deactivated);
}
```

--------------------------------------------------------------------------------

---[FILE: user_status.css]---
Location: zulip-main/web/styles/user_status.css

```text
#set-user-status-modal {
    /* A narrower width is more attractive for this modal. */
    width: 384px;

    .user-status-content-wrapper {
        display: grid;
        grid-template:
            "status-icon search-input clear-search" auto / auto minmax(0, 1fr)
            auto;
        align-items: center;
        outline: 1px solid hsl(0deg 0% 0% / 60%);
        outline-offset: -1px;
        border-radius: 4px;
        background-color: var(--color-background-input);

        & input.user-status {
            grid-area: search-input;
            line-height: 1.25em; /* 20px at 16px/em */
            padding: 0.5em 0.125em; /* 8px 2px at 16px/1em */
            width: 100%;
            /* Override default input height */
            height: unset;
            border: none;
            outline: none;
            box-shadow: none;
            /* Transparent here is to allow the input
               background set on the wrapper to show
               through. */
            background-color: transparent;
            margin: 0;

            &:focus {
                box-shadow: none;
            }
        }

        #clear_status_message_button {
            grid-area: clear-search;
            padding: 0.5em; /* 8px at 16px/1em */
            margin: 0.125em; /* 2px at 16px/1em */
        }

        .status-emoji-wrapper {
            display: flex;
            padding: 0.375em; /* 6px at 16px/1em */
            margin: 0.125em; /* 2px at 16px/1em */
            border-radius: 4px;
            cursor: pointer;

            .selected-emoji,
            .smiley-icon {
                width: 1.25em; /* 20px at 16px/em */
                height: 1.25em; /* 20px at 16px/em */
                cursor: pointer;
            }

            .smiley-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-modal-selectable-icon);

                &:hover {
                    text-decoration: none;
                }
            }

            &:hover,
            &.active-emoji-picker-reference {
                background-color: var(
                    --background-color-modal-selectable-icon-hover
                );

                .smiley-icon {
                    color: var(--color-modal-selectable-icon-hover);
                }
            }
        }
    }

    .user-status-options {
        padding-top: 15px;

        .user-status-value {
            /* We set the gap between the status emoji and text
               in the default user status options to match the gap
               between the corresponding emoji and text of the
               custom user status input.
               6px (emoji button padding)
               + 2px (emoji button margin)
               + 2px (input padding) */
            gap: 0.625em; /* 10px at 16px/em */

            .status-emoji {
                /* Size and align status emoji to match
                   the top line of the modal. */
                height: 1.25em; /* 20px at 16px/em */
                width: 1.25em; /* 20px at 16px/em */
                margin: 0;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: widgets.css]---
Location: zulip-main/web/styles/widgets.css

```text
.widget-content {
    margin-bottom: var(--markdown-interelement-space-px);
}

.widget-choices {
    & ul {
        padding: 3px;
    }

    & li {
        padding: 2px;
        list-style: none;
    }

    & button {
        font-weight: 700;
        color: hsl(240deg 100% 50%);
    }

    .widget-choices-heading {
        font-weight: 600;
    }
}

.todo-widget {
    .todo-task-list-title-bar {
        flex: 1 1 auto;
        display: flex;
        /* Ensure controls remain visible on narrower screens. */
        flex-flow: row wrap;
        gap: 5px;
        margin-bottom: var(--markdown-interelement-space-px);
    }

    .add-task-bar {
        display: flex;
        /* Ensure controls remain visible on narrower screens. */
        flex-flow: row wrap;
        gap: 5px;
    }

    /* For the box-shadow to be visible on the left */
    .add-task,
    .add-desc {
        font-weight: 400;
    }

    & label.checkbox {
        display: flex; /* Arrange that a multi-line description line wraps properly. */
        /* Keep checkboxes vertically aligned, including with multi-line tasks. */
        align-items: baseline;
        /* Reset default label.checkbox styles. */
        gap: 5px;
        position: static;
        min-height: 0;

        & input[type="checkbox"] {
            ~ .custom-checkbox {
                display: inline-block;
                vertical-align: middle;
                position: static;

                padding: 2px;
                margin: 0;

                font-size: 1.3em; /* 18.2px / 14px em */
                height: 0.6593em; /* 12px at 18.2px / em */
                width: 0.6593em; /* 12px at 18.2px / em */

                font-weight: 300;
                line-height: 0.8;
                text-align: center;
                border: 2px solid var(--color-border-todo-checkbox);

                border-radius: 4px;
                filter: brightness(1);

                cursor: pointer;
            }

            &:checked ~ .custom-checkbox {
                background-image: url("../images/checkbox-white.svg");
                background-size: 75%;
                background-position: 50% 50%;
                background-repeat: no-repeat;
                background-color: var(--color-background-todo-checkbox-checked);
                border-color: var(--color-border-todo-checkbox-checked);
            }

            &:disabled ~ .custom-checkbox {
                opacity: 0.5;
                cursor: not-allowed;
            }

            &:hover ~ .custom-checkbox {
                border-color: var(--color-border-todo-checkbox-hover);
            }

            &:not(:checked):hover ~ .custom-checkbox {
                /* We only change the background color on hover,
                   when the checkbox is not checked. */
                background-color: var(--color-background-todo-checkbox-hover);
            }

            &:focus ~ .custom-checkbox {
                outline-color: hsl(0deg 0% 100% / 0%);
            }
        }
    }
}

.todo-widget,
.poll-widget {
    .poll-question-header,
    .todo-task-list-title-header {
        font-size: 1.1em;
        font-weight: 600;
    }

    & li {
        display: flex;
        gap: 5px;
        align-items: baseline;
        list-style: none;
        margin: 0 0 5px;
    }

    & ul {
        margin: 0 0 5px;
        padding: 0;
    }

    & input[type="text"] {
        /* Reset from zulip.css */
        height: unset;
        border: 1px solid hsl(0deg 0% 80%);
        box-shadow: inset 0 1px 1px hsl(0deg 0% 0% / 7.5%);
        border-radius: 4px;
        color: var(--color-text-default);

        &:focus {
            border-color: hsl(206deg 80% 62% / 80%);
            outline: 0;
            box-shadow: none;
            background-color: var(--color-background-widget-input);
            transition:
                border-color linear 0.2s,
                box-shadow linear 0.2s;
        }
    }
}

.poll-widget {
    .poll-option-bar {
        display: flex;
        /* Ensure controls remain visible on narrower screens. */
        flex-flow: row wrap;
        gap: 5px;
    }

    .poll-option {
        font-weight: 400;
    }

    .poll-option-label {
        display: flex;
        gap: 5px;
        align-items: baseline;
    }

    .poll-option-text {
        font-weight: 600;
        /* Start with max-content, but allow options
           to shrink, so that voting names wrap comfortably. */
        flex: 0 1 max-content;
    }

    .poll-vote {
        color: var(--color-poll-vote);
        border-color: var(--color-border-poll-vote);
        border-style: solid;
        font-weight: 600;
        border-radius: 3px;
        /* We don't want poll-vote tallies to spill
           digits onto second lines in narrow viewports. */
        flex-shrink: 0;
        min-width: 1.7857em; /* 25px at 14px / em */
        height: 1.7857em; /* 25px at 14px / em */
        font-size: 0.9285em; /* 13px at 14px / em */
        background-color: var(--color-background-widget-button);

        &:hover {
            color: var(--color-poll-vote-hover);
            background-color: var(--color-background-poll-vote-hover);
            border-color: var(--color-border-poll-vote-hover);
        }

        &:focus {
            outline: 0;
            color: var(--color-poll-vote-focus);
            background-color: var(--color-background-poll-vote-focus);
            border-color: var(--color-border-poll-vote-focus);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .poll-names {
        color: var(--color-poll-names);
        /* Aim for 50% of the flexbox for voting names,
           but also shrink modestly (.5) adjacent a long
           option. */
        flex: 1 0.5 50%;
    }
}

button {
    &.task {
        height: 20px;
        width: 20px;
        background-color: transparent;
        border-color: hsl(156deg 28% 70%);
        margin-right: 4px;
        border-radius: 3px;

        &:hover {
            border: 1px solid hsl(194deg 60% 40%);
        }
    }

    &.add-task,
    &.poll-option {
        color: hsl(156deg 41% 40%);
        border: 1px solid hsl(156deg 28% 70%);
        width: max-content;
        flex: 0 0 auto;
        border-radius: 3px;
        background-color: var(--color-background-widget-button);
        padding: 4px;
        padding-left: 14px;
        padding-right: 14px;

        &:hover,
        &:focus {
            outline: 0;
            border-color: hsl(156deg 30% 50%);
            transition: 0.2s ease;
            transition-property: background-color, border-color, color;
        }

        &:active {
            transition: 0.2s ease;
            transition-property: background-color, border-color, color;
        }

        &:disabled {
            cursor: not-allowed;
            filter: saturate(0);
            background-color: var(--color-background-zulip-button-disabled);
            color: hsl(0deg 3% 52%);
        }
    }
}

input {
    &.add-task,
    &.add-desc,
    &.poll-option,
    &.poll-question,
    &.todo-task-list-title {
        flex: 1 0 auto;
        padding: var(--input-vertical-padding) var(--input-horizontal-padding);
    }
}

.widget-error {
    color: hsl(1deg 45% 50%);
    font-size: 0.8571em; /* 12px at 14px/em */
    display: flex;
    align-items: center;
}

.poll-question-check,
.poll-question-remove,
.todo-task-list-title-check,
.todo-task-list-title-remove {
    align-self: stretch;
    /* TODO: Re-express the 30.5px value here
       as part of information density work. */
    flex: 0 0 30.5px;
    min-height: 30.5px;
    border-radius: 3px;
    border: 1px solid var(--color-border-zulip-button);
    background-color: var(--color-background-zulip-button);

    &:hover {
        border-color: var(--color-border-zulip-button-interactive);
        background-color: var(--color-background-zulip-button-hover);
    }
}

.poll-edit-question,
.todo-edit-task-list-title {
    color: var(--color-message-action-visible);

    &:hover,
    &:focus-visible {
        color: var(--color-message-action-interactive);
    }
}

.poll-question-bar {
    flex: 1 1 auto;
    display: flex;
    /* Ensure controls remain visible on narrower screens. */
    flex-flow: row wrap;
    gap: 5px;
    /* Reserve space for the focus outline to prevent it from being cut off */
    margin-right: 2px;
    margin-bottom: var(--markdown-interelement-space-px);
}

.poll-widget-header-area,
.todo-widget-header-area {
    display: flex;
    align-items: baseline;
    gap: 5px;
}

.current-user-vote {
    background-color: hsl(156deg 10% 90% / 90%);
}

.add-task-wrapper {
    display: inline;
    position: relative;
    z-index: 1;

    /* Unlike other browsers like Chrome, Microsoft Edge, etc.,
    Firefox does not automatically display the "not-allowed"
    cursor for disabled elements. The below css ensures that the
    correct cursor is shown across all browsers. */
    &:hover {
        cursor: not-allowed;
    }
}
```

--------------------------------------------------------------------------------

````

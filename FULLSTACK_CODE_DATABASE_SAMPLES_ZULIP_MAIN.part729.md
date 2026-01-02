---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 729
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 729 of 1290)

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

---[FILE: dark_theme.css]---
Location: zulip-main/web/styles/dark_theme.css

```text
@import url("flatpickr/dist/themes/dark.css");

%dark-theme {
    color-scheme: dark;

    kbd {
        text-shadow: none;
    }

    /************************* MODAL DARK THEME *******************/

    #message-formatting,
    #keyboard-shortcuts {
        & kbd {
            border: 1px solid var(--color-hotkey-hint);
            border-radius: 3px;
            color: var(--color-hotkey-hint);
            opacity: 0.8;
        }
    }

    .enter_sends_choices {
        color: hsl(236deg 33% 90%);

        .enter_sends_minor {
            color: hsl(0deg 0% 80%);
        }
    }

    .dropdown-list-delete {
        /* hsl(7deg 100% 74%) corresponds to var(--red-250) */
        color: color-mix(
            in oklch,
            hsl(7deg 100% 74%) 70%,
            transparent
        ) !important;

        &:hover {
            color: hsl(7deg 100% 74%) !important;
        }
    }

    /* this one is because in the app we have blue and in dark-theme it should be white. */
    .popover a {
        color: inherit;
    }

    /* these are converting grey things to "new grey".
       :disabled rules are exploded for CSS selector performance reasons. */
    button:disabled:not(.action-button, .icon-button, .info-density-button),
    option:disabled,
    select:disabled,
    input:disabled:not(.modal_text_input),
    input:not([type="radio"], .modal_text_input):read-only,
    #organization-permissions .dropdown-widget-button:disabled,
    #organization-settings .dropdown-widget-button:disabled {
        color: inherit;
        opacity: 0.5;
    }

    button.info-density-button:disabled {
        color: inherit;
        opacity: 0.4;
    }

    select,
    .user-status-content-wrapper,
    .custom-time-input-value,
    #organization-permissions .dropdown-widget-button,
    #organization-settings .dropdown-widget-button {
        background-color: hsl(0deg 0% 0% / 20%);
        border-color: hsl(0deg 0% 0% / 60%);
    }

    .popover-filter-input-wrapper .popover-filter-input:focus {
        background-color: hsl(225deg 6% 7%);
        border: 1px solid hsl(0deg 0% 100% / 50%);
        box-shadow: 0 0 5px hsl(0deg 0% 100% / 40%);
    }

    & select option {
        background-color: var(--color-background);
        color: hsl(236deg 33% 90%);
    }

    .pill-container.not-editable-by-user {
        opacity: 0.5;
    }

    #searchbox {
        /* Light theme shows hover mostly through box-shadow,
          and dark theme shows it mostly through changing color
          of the search button. */
        .navbar-search:not(.expanded)
            #searchbox-input-container:hover
            .search_icon {
            opacity: 0.75;
        }
    }

    textarea.schedule-reminder-note:focus,
    #compose_recipient_box:focus {
        border-color: hsl(0deg 0% 0% / 90%);
    }

    .popover hr,
    hr {
        opacity: 0.2;
    }

    .zoom-in {
        #topics_header {
            background-color: var(--color-background);
        }
    }

    #recent_view_table {
        .zulip-icon-user {
            opacity: 0.7;
        }
    }

    #recent_view
        .change_visibility_policy
        .visibility-status-icon:not(.recent-view-row-topic-menu):hover {
        filter: invert(1);
    }

    .drafts-container .header-body .delete-drafts-group > *:focus {
        background-color: hsl(228deg 11% 17%);
    }

    .table-striped tbody tr:nth-child(even) td {
        border-color: hsl(0deg 0% 0% / 20%);
        background-color: color-mix(
            in srgb,
            hsl(0deg 0% 0%) 20%,
            var(--color-background-modal)
        );
    }

    .overlay-message-row
        .message_header_private_message
        .message_label_clickable {
        padding: 4px 6px 3px;
        color: inherit;
    }

    & time {
        background: hsl(0deg 0% 0% / 20%);
        box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 40%);
    }

    .tip,
    .invite-stream-notice {
        color: inherit;
    }

    #request-progress-status-banner {
        background-color: hsl(212deg 32% 14%);
    }

    .alert.home-error-bar {
        color: hsl(236deg 33% 90%);
        background-color: hsl(35deg 84% 62% / 25%);
        border: 1px solid hsl(11deg 46% 54%);
    }

    .alert.alert-success {
        color: inherit;
        background-color: hsl(161deg 60% 46% / 20%);
        border-color: hsl(165deg 68% 37%);
    }

    .alert.alert-info {
        color: hsl(205deg 58% 80%);
        background-color: hsl(204deg 100% 12%);
        border-color: hsl(205deg 58% 69% / 40%);
    }

    .alert.alert-error,
    .alert.alert-danger {
        background-color: hsl(318deg 12% 21%);
        color: inherit;
        border: 1px solid hsl(0deg 75% 65%);
    }

    .alert-box .alert,
    .alert-box .stacktrace,
    .alert.alert-error {
        background-color: hsl(318deg 12% 21%);
        color: inherit;
        border: 1px solid hsl(0deg 75% 65%);
    }

    .alert-box {
        .alert.alert-error::before {
            color: hsl(0deg 75% 65%);
        }
    }

    .stacktrace {
        color: hsl(314deg 22% 85%);
        background-color: hsl(318deg 12% 21%);
        border: 1px solid hsl(0deg 75% 65%);

        .expand {
            color: hsl(318deg 14% 36%);
        }

        .subtle {
            color: hsl(314deg 19% 63%);
        }

        .stacktrace-more-info {
            background-color: hsl(312deg 7% 14%);
        }

        .code-context {
            color: hsl(314deg 27% 82%);
            background-color: hsl(312deg 7% 14%);
            box-shadow:
                inset 0 11px 10px -10px hsl(0deg 0% 6%),
                inset 0 -11px 10px -10px hsl(0deg 0% 6%);

            .line-number {
                color: hsl(318deg 14% 44%);
            }

            .focus-line {
                background-color: hsl(307deg 9% 19%);
            }
        }
    }

    .top-messages-logo {
        opacity: 0.7;
    }

    .history-limited-box,
    .all-messages-search-caution {
        background-color: hsl(0deg 0% 0% / 20%);
    }

    /* Search highlight used in both topics and rendered_markdown */
    .highlight {
        background-color: hsl(51deg 100% 23%);
    }

    .searching-for-more-topics img {
        filter: invert(100%);
    }

    .simplebar-track .simplebar-scrollbar::before {
        background-color: hsl(0deg 0% 100%);
        box-shadow: 0 0 0 1px hsl(0deg 0% 0% / 33%);
    }

    .collapse-settings-button:hover {
        color: hsl(200deg 79% 66%);
    }

    #request-progress-status-banner .loading-indicator,
    #loading_older_messages_indicator,
    #recent_view_loading_messages_indicator {
        & path {
            fill: hsl(0deg 0% 100%);
        }
    }

    & a:not(:active):focus,
    button:not(.action-button, .icon-button):focus-visible,
    i.fa:focus,
    i.zulip-icon:focus,
    [role="button"]:focus {
        outline-color: hsl(0deg 0% 67%);
    }

    .color_animated_button {
        .zulip-icon {
            color: hsl(0deg 0% 100%);
        }
    }

    .panel_user_list > .pill-container,
    .creator_details > .display_only_pill {
        &:hover {
            color: inherit;
        }

        > .pill {
            &:focus,
            &:hover {
                color: inherit;
            }
        }
    }

    .help_link_widget:hover {
        color: inherit;
    }

    #uppy-editor .uppy-ImageCropper {
        /* Uppy cropper canvas has some CSS properties set for the background that
        do not look good for dark theme. When using Uppy Dashboard, this can be
        solved by passing `theme` field with value as true in config options.
        However we are not using that plugin so we need to provide our own dark
        theme CSS for this detail.

        Link for source from where the CSS properties are taken -
        https://github.com/transloadit/uppy/blob/b7605df9402e4db9b02828bf24558e21eae76637/packages/%40uppy/image-editor/src/style.scss#L123
        and https://github.com/transloadit/uppy/blob/b7605df9402e4db9b02828bf24558e21eae76637/packages/%40uppy/image-editor/src/style.scss#L133 */
        .cropper-modal {
            opacity: 0.7;
            background-color: hsl(0deg 0% 0%);
        }

        .cropper-view-box {
            background: repeating-conic-gradient(
                    hsl(0deg 1.18% 16.67%) 0% 25%,
                    hsl(0deg 0% 0%) 0% 50%
                )
                50%/16px 16px;
        }
    }
}

@media screen {
    :root.dark-theme {
        @extend %dark-theme;
    }
}

@media screen and (prefers-color-scheme: dark) {
    :root.color-scheme-automatic {
        @extend %dark-theme;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: drafts.css]---
Location: zulip-main/web/styles/drafts.css

```text
.drafts-container {
    .banner-container {
        margin: 0 25px 5px;
    }

    .header-body {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        gap: 5px;

        .drafts-header-note {
            text-align: left;
            margin-left: 25px;

            @media (width < $lg_min) {
                text-align: center;
                margin-left: 0;
            }
        }

        .delete-drafts-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;

            .delete-selected-drafts-button {
                &:focus {
                    background-color: hsl(0deg 0% 93%);
                }
            }

            .select-drafts-button {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-right: 25px;
                padding-left: 15px;
                padding-right: 15px;

                &:focus {
                    background-color: hsl(0deg 0% 93%);
                }
            }

            .select-state-indicator {
                width: 15px;
            }

            @media (width < $lg_min) {
                margin-top: 5px;
                width: 100%;
            }
        }

        @media (width < $lg_min) {
            display: block;
        }
    }

    .drafts-list {
        & h2 {
            font-size: 1.1em;
            line-height: normal;
            margin-bottom: 5px;
            white-space: pre-wrap;
        }
    }

    .draft-selection-checkbox {
        margin-top: 0.25em;
        /* Required to make sure that the checkbox icon stays inside
           the grid. Any value greater than 13px (original width of
           the checkbox icon) will work. */
        width: 15px;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: image_upload_widget.css]---
Location: zulip-main/web/styles/image_upload_widget.css

```text
/* common CSS for all image upload widget's */
.image_upload_widget {
    position: relative;
    border-radius: 5px;
    box-shadow: 0 0 10px hsl(0deg 0% 0% / 10%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-block {
        background-size: contain;
    }

    .image-hover-background {
        content: "";
        background-color: hsl(0deg 0% 0% / 60%);
        height: 100%;
        width: 100%;
        z-index: 99;
        position: absolute;
        display: none;
        cursor: pointer;
    }

    .image_upload_button {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        box-shadow: 0 0 10px hsl(0deg 0% 0% / 10%);
        z-index: 99;
    }

    .image-delete-button {
        background: none;
        border: none;
        cursor: pointer;
        color: hsl(0deg 0% 75%);
        opacity: 0;
        padding: 0;
        position: absolute;
        font-size: 2rem;
        top: 10px;
        right: 10px;
        z-index: 99;
        line-height: 20px;

        &:focus:not(:focus-visible) {
            outline: none;
        }
    }

    .image-disabled-text {
        color: hsl(0deg 0% 100%);
        cursor: not-allowed;
        position: absolute;
        text-align: center;
        visibility: hidden;
        z-index: 99;
    }

    .image-delete-text,
    .image-upload-text,
    .image-disabled-text {
        box-sizing: border-box;
        width: 100%;
        padding: 0 10px;
    }

    .image-delete-button:focus,
    .image-delete-button:hover {
        color: hsl(0deg 0% 100%);
    }

    .image-delete-button:hover ~ .image-upload-text {
        visibility: hidden;
    }

    .image-delete-button:hover ~ .image-delete-text {
        visibility: visible;
    }

    .image-delete-text {
        color: hsl(0deg 0% 100%);
        font-size: 0.85rem;
        position: absolute;
        visibility: hidden;
        z-index: 99;
    }

    .image-upload-text {
        cursor: pointer;
        font-size: 0.85rem;
        color: hsl(0deg 0% 85%);
        position: absolute;
        z-index: 99;
        visibility: hidden;

        &:focus:not(:focus-visible) {
            outline: none;
        }
    }

    .image-upload-text:hover {
        color: hsl(0deg 0% 100%);
    }

    .upload-spinner-background {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: hsl(0deg 0% 10%);
        font-size: 0.8rem;
        width: 100%;
        opacity: 0.8;
        height: 100%;
        position: absolute;
        visibility: hidden;
        z-index: 99;
        cursor: pointer;
        border-radius: 5px;
    }

    .hide {
        display: none;
    }

    &:hover {
        .image-upload-text {
            visibility: visible;
        }

        .image-delete-button {
            opacity: 1;
        }

        .image-disabled-text {
            visibility: visible;
        }

        .image-hover-background {
            display: block;
        }
    }
}

.user-avatar-section,
.realm-icon-section {
    margin: 20px 0;
}

.realm-logo-section {
    margin: 0 0 20px;
}

/* CSS related to settings page user avatar upload widget only */
#user-avatar-upload-widget {
    .image-block {
        width: 200px;
        height: 200px;
    }
}

#user-avatar-source {
    font-size: 1em;
    z-index: 99;
    margin-top: 10px;
}

/* CSS related to settings page realm icon upload widget only */
#realm-icon-upload-widget {
    width: 100px;
    height: 100px;
    box-shadow: 0 0 10px hsl(0deg 0% 0% / 10%);

    .image-delete-button {
        top: 5px;
        right: 5px;
    }
}

/* CSS related to settings page realm day/night logo upload widget only */
#realm-day-logo-upload-widget,
#realm-night-logo-upload-widget {
    width: 220px;
    height: 55px;
    text-align: center;

    .image-delete-button {
        top: 5px;
        right: 5px;
    }
}

#realm-day-logo-upload-widget {
    /* Match to light-theme --color-background-navbar. */
    background-color: hsl(0deg 0% 97%);
    padding: 5px;
}

#realm-night-logo-upload-widget {
    /* Match to dark-theme --color-background-navbar. */
    background-color: hsl(0deg 0% 13%);
    padding: 5px;
}

.realm-logo-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .image_upload_button {
        top: 0;
        left: 0;
    }
}

/* CSS  related to upload widget's preview image */
.upload_widget_image_preview {
    object-fit: cover;
}
```

--------------------------------------------------------------------------------

---[FILE: inbox.css]---
Location: zulip-main/web/styles/inbox.css

```text
.inbox-container {
    display: flex;
    flex-direction: column;
    background: var(--color-background-inbox);
    padding: 0;
    min-height: 100vh;

    #inbox-pane {
        max-width: 100%;
        display: flex;
        flex-direction: column;
        margin: var(--navbar-fixed-height) 25px 0;

        a {
            color: var(--color-text-message-header);
            text-decoration: none;
        }

        .unread_count {
            opacity: 1;
            outline: 0 solid var(--color-background-unread-counter);
            transition: outline-width 0.1s ease;

            &:hover {
                outline-width: 1.5px;
            }
        }

        .search_group {
            position: sticky;
            top: var(--navbar-fixed-height);
            background: var(--color-background-inbox);
            display: flex;
            /* This padding-top value aligns the inbox filters
               with the filters in the left and right sidebars. */
            padding: 10px 0;
            z-index: 1;
        }

        .button-inbox-selected {
            background-color: var(--color-background-button-inbox-selected);
        }

        #inbox-filters {
            .inbox-search-wrapper {
                flex-grow: 1;
                max-width: var(--width-inbox-search);
            }
        }

        .inbox-empty-text {
            display: none;
        }

        #inbox-loading-indicator {
            margin-top: 20px;
            margin-bottom: var(--max-unmaximized-compose-height);

            .searching-for-more-topics {
                margin-left: 0;
            }
        }

        #inbox-list {
            overflow: hidden;
            /* search box left border (1px) + search box right border (1px)
               + dropdown left border (1px) + dropdown right border (1px) = 4px at 16px em */
            max-width: calc(
                var(--width-inbox-search) +
                    var(--width-inbox-filters-dropdown) + 0.25em
            );

            .inbox-channel-topic-list {
                margin: 0;
            }

            .inbox-focus-border {
                display: flex;
                min-height: 1.875em; /* 30px at 16px em */
                border: 2px solid transparent;
                border-radius: 3px;
                box-sizing: border-box;
                justify-content: space-between;
            }

            .inbox-header {
                user-select: none;
                display: block;
                height: 1.875em; /* 30px at 16px em */

                .inbox-focus-border {
                    height: 1.875em; /* 30px at 16px em */
                }

                .inbox-left-part {
                    grid-template:
                        auto / minmax(auto, min-content)
                        auto min-content min-content;
                    grid-template-areas: "header_name collapse_button unread_mention_info unread_count";
                }

                .inbox-header-name {
                    grid-area: header_name;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    outline: 0;
                    cursor: pointer;

                    .inbox-header-name-text {
                        margin: 0;
                        padding: 1px 0;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        font-weight: 600;
                    }
                }

                &:focus {
                    outline: 0;
                }

                &:hover {
                    .collapsible-button {
                        visibility: visible;
                    }
                }
            }

            .fa-lock {
                margin-right: 3px;
            }

            .stream-privacy.filter-icon {
                /* 0 5px at 16px/1em */
                padding: 0 0.3125em;
                margin: 0;
            }

            .zulip-icon-user {
                position: relative;
                top: -1px;
                margin-right: 4px;
            }

            .collapsible-button {
                grid-area: collapse_button;

                &:hover {
                    cursor: pointer;
                }

                .zulip-icon-chevron-down {
                    padding: 0.3125em 0.25em; /* 5px 4px at 16px em */
                    transform: rotate(180deg);
                }
            }

            .user-circle {
                /* 8.5328px at 16px/1em */
                font-size: 0.5333em;
                /* TODO: Refactor inbox rows to use grid, to avoid the
                   min-width here that holds the other rows to similar
                   columns. */
                /* 16px at 8.5328px/1em */
                min-width: 1.8751em;
                top: 0;
                text-align: center;
            }

            .zulip-icon-bot,
            .conversation-partners-icon {
                opacity: 0.7;
                /* Required to align DM fullnames in user circle icon */
                /* 2px at 16px / 1em */
                margin-left: 0.125em;
            }

            .user_block .zulip-icon {
                /* 0 5px at 16px/1em */
                padding: 0 0.3125em;

                &.user-circle {
                    /* 5px at 16px / ~ 0.5em */
                    padding: 0 0.586em;
                }
            }

            .inbox-row {
                user-select: none;
                display: block;
                background-color: var(--color-background-inbox-row);

                &:hover {
                    background: var(--color-background-inbox-row-hover);
                }

                .inbox-left-part {
                    grid-template:
                        auto / min-content minmax(0, 1fr)
                        min-content min-content;
                    grid-template-areas: "match_topic_and_dm_start recipient_info unread_mention_info unread_count";
                }

                .inbox-topic-container .user-circle {
                    grid-area: match_topic_and_dm_start;
                }

                .recipients_info,
                .inbox-topic-name {
                    grid-area: recipient_info;
                }
            }

            .channel-visibility-policy-indicator,
            .visibility-policy-indicator {
                display: flex;
                align-items: center;
                border-radius: 3px;
                margin-left: 3px;
            }

            .unread-count-focus-outline {
                /* Because the inbox view font-size will
                   never be smaller than the em-equivalent
                   of 15px, we restate the base font-size
                   here so that unreads match others in
                   the UI at legacy size (14px). */
                font-size: var(--base-font-size-px);
                grid-area: unread_count;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 3px;
                padding: 0 5px;
                /* Stretch to the row to keep unread
                   count from affecting overall row
                   size as test scales up. */
                align-self: stretch;
            }

            .unread_mention_info {
                grid-area: unread_mention_info;
                margin-right: 0;
            }

            .stream-privacy {
                display: flex;
                align-items: center;
                margin-right: 4px;
                margin-left: 17px;

                .zulip-icon {
                    line-height: 0.875em; /* 14px at 16px em */
                    height: 1em;
                    width: 1em;
                }
            }

            .inbox-topic-name {
                /* 16px channel icon width + 10px padding */
                padding-left: 1.625em; /* 26x at 16px em */
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                & a {
                    padding: 1px 0;
                    white-space: pre;
                }
            }

            .inbox-left-part-wrapper {
                display: flex;
                width: 80%;
            }

            #inbox-direct-messages-container {
                /* Since a direct message row can have span to multiple lines,
                   having an underline focus will not work very well.
                */
                .inbox-row:focus-visible {
                    box-shadow: inset 0 0 0 2px var(--color-outline-focus);
                }
            }

            .inbox-left-part {
                width: 100%;
                display: grid;
                align-items: center;

                &:hover {
                    cursor: pointer;
                }

                .inbox-group-or-bot-dm {
                    position: relative;
                    left: -3px;

                    /* We don't display status emoji in group DMs,
                       so prepare an ordinary inline layout... */
                    .user-status-microlayout {
                        display: inline;
                        white-space: collapse;
                    }
                    /* ...and hide the status emoji. */
                    .status-emoji {
                        display: none;
                    }
                }

                .recipients_info {
                    display: flex;
                    flex-wrap: wrap;
                    column-gap: 10px;
                    grid-area: recipient_info;

                    .user_block {
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }

        #inbox-collapsed-note {
            display: none;
            overflow: hidden;
            max-width: calc(
                var(--width-inbox-search) +
                    var(--width-inbox-filters-dropdown) + 0.25em
            );

            .inbox-collapsed-note-and-button-wrapper {
                margin-top: 3px;
                padding-left: 8px;

                .inbox-collapsed-note-span {
                    font-size: 1em;
                }

                #inbox-expand-all-button {
                    display: block;
                    margin-top: 5px;
                }
            }
        }

        .inbox-right-part-wrapper {
            flex-grow: 1;

            .inbox-right-part {
                display: flex;
                justify-content: space-between;
                flex-grow: 1;

                > .inbox-action-button:first-child {
                    margin-left: auto;
                }
            }
        }

        .inbox-row,
        .inbox-header {
            &:hover {
                .inbox-row-visibility-policy-inherit,
                .inbox-action-button {
                    opacity: 1;
                }
            }
        }

        .inbox-row-visibility-policy-inherit {
            opacity: 0;

            &.visibility-policy-popover-visible {
                opacity: 1;
            }
        }

        .inbox-action-button {
            display: flex;
            border-radius: 3px;
            outline: none;
            opacity: 0;

            &.hide {
                display: none;
            }

            & i {
                padding: 0.3125em; /* 5px at 16px em */
                opacity: 0.3;
                color: var(--color-vdots-hover);

                &:hover {
                    opacity: 1;
                    cursor: pointer;
                }
            }
        }
    }

    .inbox-header-stream-archived {
        color: var(--color-text-message-header-archived);
        margin-left: 0.3125em; /* 5px at 16px em */
    }
}

#inbox-view {
    display: none;
    position: relative;

    .inbox-folder {
        margin-bottom: 1px;
        background-color: transparent;

        .inbox-header-name-text,
        .unread_mention_info {
            color: var(--color-folder-header);
            opacity: 0.5;
        }

        .inbox-header-name-text {
            font-style: normal;
            font-weight: var(--font-weight-sidebar-heading);
            line-height: 112.5%;
            letter-spacing: var(--letter-spacing-sidebar-heading);
            text-transform: uppercase;
            outline: none;
            /* 16px at 16px / 1em */
            font-size: 1em;
            /* Align the folder title with the channel privacy icons; 5px at 16px/1em.

            TODO: Reduce the depth of selectors in this file,
            so that the use of !important becomes unnecessary
            here. */
            padding-left: 0.3125em !important;
        }

        &:hover {
            .inbox-header-name-text,
            .collapsible-button .zulip-icon,
            .unread_mention_info,
            .unread_count {
                opacity: 1;
            }
        }
    }

    .hidden_by_filters {
        display: none !important;
    }

    .channel-folders-inbox-menu-icon {
        display: grid;
        /* width excluding left & right margin */
        width: calc(var(--left-sidebar-vdots-width) - 3px);
        cursor: pointer;
        place-items: center center;
        border-radius: 3px;
        margin: 2px 2px 2px 1px;
        color: var(--color-vdots-visible);

        i.zulip-icon {
            font-size: 1.0625em;
        }

        &:hover {
            color: var(--color-vdots-hover);
            background-color: var(--color-background-sidebar-action-hover);
        }
    }
}

.inbox-container #inbox-pane #inbox-empty-without-search {
    margin-top: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.inbox-empty-illustration {
    width: 54px;
    height: 54px;
    margin-bottom: 16px;
    background-color: var(--color-background-inbox-no-unreads-illustration);
    mask: url("../images/empty-view-illustrations/inbox-done.svg") no-repeat
        center;
}

.inbox-empty-title {
    /* Matches the font-size used for .empty-list-message */
    font-size: 1.5em;
    color: var(--color-background-inbox-no-unreads-illustration);
}

.inbox-empty-action {
    font-size: 1.3em;
    padding-top: 0.5em;
}

.inbox-container #inbox-pane .inbox-empty-action-link {
    color: var(--color-text-url);

    &:hover {
        color: var(--color-text-url-hover);
    }
}

#inbox-filter_widget {
    margin-right: 0.3571em; /* 5px / 14px em */
    max-width: var(--width-inbox-filters-dropdown);
    border: 1px solid var(--color-border-inbox-search);
    background-color: var(--color-background-inbox-search);
    gap: 0.3571em; /* 5px / 14px em */
    /* 1.5px at 16px/1em and legacy 6px at 14px/1em. */
    padding: 0.0937em 0.4285em;

    &:hover {
        background-color: var(--color-background-inbox-search-hover);
        border: 1px solid var(--color-border-inbox-search-hover);
    }

    &:focus {
        outline: none;
    }
}

#recent-view-filter_widget .dropdown_widget_value,
#inbox-filter_widget .dropdown_widget_value {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-align: left;
}

#recent-view-filter_widget .zulip-icon-chevron-down,
#inbox-filter_widget .zulip-icon-chevron-down {
    color: var(--color-icons-inbox);
    opacity: 0.4;
}

.recent-view-filter-dropdown-list-container .dropdown-list-wrapper,
.inbox-filter-dropdown-list-container .dropdown-list-wrapper,
.new_channel_privacy-dropdown-list-container .dropdown-list-wrapper,
.channel_privacy-dropdown-list-container .dropdown-list-wrapper {
    /* We want these dropdowns to open to fit their
       contents, which differ based on the language
       in use. */
    width: 100%;
    /* We also don't want to set a min-width, again
       so that the content is in charge. This pushes
       back against more generic styles. */
    min-width: unset;
}

.recent-view-filter-dropdown-list-container
    .dropdown-list
    .dropdown-list-item-common-styles,
.inbox-filter-dropdown-list-container
    .dropdown-list
    .dropdown-list-item-common-styles,
.new_channel_privacy-dropdown-list-container
    .dropdown-list
    .dropdown-list-item-common-styles,
.channel_privacy-dropdown-list-container
    .dropdown-list
    .dropdown-list-item-common-styles {
    /* Parallel to the `width: 100%` set on
       .dropdown-list-wrapper above, we set
       min-width here to max-content so that
       the box opens to accommodate different
       lengths of text--and to ensure that
       hovered/selectable areas look correct. */
    min-width: max-content;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    /* For columnar flex items, we need
       to make set alignment to the start
       of the flex container. This pushes
       back against non-columnar flexboxes
       that require centered alignment. */
    align-items: flex-start;
}

.recent-view-filter-dropdown-list-container .dropdown-list-item-name,
.inbox-filter-dropdown-list-container .dropdown-list-item-name,
.new_channel_privacy-dropdown-list-container .dropdown-list-item-name,
.channel_privacy-dropdown-list-container .dropdown-list-item-name {
    white-space: nowrap;
    font-weight: 500;
    padding: 0;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
}

.recent-view-filter-dropdown-list-container .dropdown-list-item-description,
.inbox-filter-dropdown-list-container .dropdown-list-item-description,
.channel_privacy-dropdown-list-container .dropdown-list-item-description,
.new_channel_privacy-dropdown-list-container .dropdown-list-item-description {
    white-space: nowrap;
    font-weight: 400;
    font-size: 0.9285em; /* 13px at 14px em */
    opacity: 0.8;
    padding: 0;
    text-overflow: ellipsis;
    overflow: hidden;
}

.inbox-container #inbox-pane .inbox-folder .unread_count {
    transition: none;
    cursor: default;

    &:hover {
        outline: 0;
    }
}

.inbox-container #inbox-pane .inbox-folder:not(#inbox-dm-header) .unread_count {
    display: none;
}

#inbox-pane #inbox-list .collapsible-button {
    visibility: hidden;
}

#inbox-pane #inbox-list .inbox-collapsed-state .collapsible-button {
    visibility: visible;

    .zulip-icon-chevron-down {
        transform: rotate(0deg);
    }
}

.folder-row-chevron {
    color: var(--color-folder-header);
}

.channel-row-chevron {
    color: var(--color-inbox-row-chevron);
}

.inbox-collapsed-state {
    .folder-row-chevron,
    .channel-row-chevron {
        opacity: 0.5;
    }
}

.inbox-container #inbox-pane .inbox-folder .unread_mention_info {
    display: none;
}

.inbox-container
    #inbox-pane
    .inbox-folder.inbox-collapsed-state
    .unread_mention_info,
.inbox-container
    #inbox-pane
    .inbox-folder.inbox-collapsed-state:not(#inbox-dm-header)
    .unread_count {
    display: inline;
}

.inbox-folder-components {
    border-radius: 5px;
    border: 0.5px solid hsl(0deg 0% 0% / 13%);
    overflow: hidden;

    &:has(.inbox-row:not(.hidden_by_filters)),
    &:has(.inbox-header:not(.hidden_by_filters)) {
        margin-bottom: 0.5em;
    }
}

.inbox-folder.inbox-collapsed-state,
.inbox-folder.hidden_by_filters {
    + .inbox-folder-components {
        border: 0;
    }
}

#inbox-pane #inbox-list .inbox-collapsed-state {
    + .inbox-folder-components,
    + .inbox-topic-container {
        display: none;
    }
}

#inbox-pane
    #inbox-list
    .inbox-streams-container
    .inbox-header
    .inbox-header-name {
    /* 5px at 16px / 1em */
    padding: 1px 0.3125em 1px 0;
}

#inbox-view.no-visible-focus-outlines
    .inbox-container
    #inbox-pane
    [tabindex="0"] {
    /* Remove default focus outline from elements. */
    &:focus-visible {
        outline: 0;
    }
}

#inbox-view:not(.no-visible-focus-outlines) .inbox-container #inbox-pane {
    /* Only show focus outlines when user uses keyboard. */
    #inbox-filter_widget {
        &:focus-visible {
            outline: 2px solid var(--color-outline-focus);
        }
    }

    .inbox-header {
        &:focus-visible {
            .inbox-focus-border {
                border-color: var(--color-outline-focus);
            }

            .collapsible-button > .zulip-icon {
                opacity: 1;
            }

            .collapsible-button {
                visibility: visible;
            }
        }
    }

    .inbox-row {
        &:focus-visible {
            .inbox-focus-border {
                border: 2px solid var(--color-outline-focus);
                border-radius: 3px;
            }

            outline: 0;
            padding: 0;
        }
    }

    .channel-visibility-policy-indicator,
    .visibility-policy-indicator {
        &:focus-visible {
            outline: 2px solid var(--color-outline-focus);
        }
    }

    .inbox-action-button {
        &:focus-visible {
            box-shadow: 0 0 0 2px var(--color-outline-focus);
        }
    }

    .unread-count-focus-outline {
        &:focus-visible {
            outline: 2px solid var(--color-outline-focus);
        }
    }

    .inbox-row,
    .inbox-header {
        /* Don't show the icons unless user is visibly focused
            on the element or one of the elements within it. */
        &:focus-within:not(:focus),
        &:focus-visible {
            .channel-visibility-policy-indicator,
            .inbox-row-visibility-policy-inherit,
            .inbox-action-button {
                opacity: 1;
            }
        }
    }

    .inbox-folder {
        &:focus-visible {
            .inbox-header-name-text,
            .collapsible-button .zulip-icon,
            .unread_mention_info,
            .unread_count {
                opacity: 1;
            }

            background: light-dark(
                transparent,
                var(--color-background-hover-popover-menu)
            );
        }
    }
}
```

--------------------------------------------------------------------------------

````

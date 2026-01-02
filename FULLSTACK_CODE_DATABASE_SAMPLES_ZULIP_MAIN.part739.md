---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 739
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 739 of 1290)

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

---[FILE: right_sidebar.css]---
Location: zulip-main/web/styles/right_sidebar.css

```text
:root {
    /* Width of emoji used by user to display status. */
    --user-status-emoji-width: 24px;
}

.right-sidebar {
    & a:hover {
        text-decoration: none;
    }
}

.right-sidebar-items {
    padding-left: var(--right-sidebar-padding-left);
}

.right-sidebar-title {
    color: var(--color-text-sidebar-heading);
    opacity: var(--opacity-sidebar-heading);
    font-size: inherit;
    font-weight: var(--font-weight-sidebar-heading);
    letter-spacing: var(--letter-spacing-sidebar-heading);
}

#buddy_list_wrapper {
    position: relative;
    margin-left: 0;
    overflow: auto;
}

.buddy-list-section-toggle.zulip-icon-heading-triangle-right {
    transition:
        opacity 140ms linear,
        rotate 140ms linear;

    &.rotate-icon-down {
        rotate: 90deg;
    }

    &.rotate-icon-right {
        rotate: 0deg;
    }
}

.buddy-list-section-toggle {
    grid-area: arrow;
    justify-self: center;
    color: var(--color-text-sidebar-heading);
    opacity: var(--opacity-sidebar-heading-icon);
}

.buddy-list-section-container {
    /* This establishes better visual concord with
       the left sidebar's spacing between a last
       channel/topic and the header that follows. */
    margin-bottom: 3px;

    &.no-display {
        display: none;
    }
}

.buddy-list-section-container.collapsed {
    .buddy-list-section,
    .buddy-list-user-link {
        display: none;
    }
}

.buddy-list-section .user_sidebar_entry,
#userlist-header {
    .user-list-sidebar-menu-icon {
        justify-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2px 2px 2px 1px;
        /* This helps horizontally align the vdots,
           given the reduced margin-left above.
           Vertical centering looks better with an
           extra pixel of top padding in this area,
           too. */
        padding: 1px 0 0 1px;
        border-radius: 3px;

        & .zulip-icon-more-vertical {
            /* 17px at 16px em */
            font-size: 1.0625em;
        }

        /*
        Hover does not work for touch-based devices like mobile phones.
        Hence the icons does not appear, making the user unaware of its
        presence on such devices. The following media property displays the
        icon by default for such behaviour.
        */

        @media (hover: none) {
            visibility: visible;
            /* Show dots on touchscreens in a less distracting,
               lighter shade. */
            color: var(--color-vdots-hint);
        }
    }

    &:hover {
        .user-list-sidebar-menu-icon {
            cursor: pointer;
            color: var(--color-vdots-visible);

            &:hover {
                color: var(--color-vdots-hover);
                background-color: var(--color-background-sidebar-action-hover);
            }
        }
    }
}

.buddy-list-section {
    margin: 0;
    overflow-x: hidden;
    list-style-position: inside; /* Draw the bullets inside our box */
    line-height: var(--line-height-sidebar-row);

    .user-list-sidebar-menu-icon {
        visibility: hidden;
    }

    li:hover {
        .user-list-sidebar-menu-icon {
            visibility: visible;
        }
    }

    & li {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        list-style-type: none;
        border-radius: 4px;
        padding: 0;

        &:hover,
        &.narrow-filter:has(a.user-presence-link:focus-visible),
        &.highlighted_user {
            background-color: var(--color-buddy-list-highlighted-user);
            box-shadow: inset 0 0 0 1px var(--color-shadow-sidebar-row-hover);
        }

        &.narrow-filter:has(a.user-presence-link:focus-visible),
        &.highlighted_user {
            outline: 2px solid var(--color-outline-focus);
            outline-offset: -2px;
        }
    }

    & .narrow-filter {
        a.user-presence-link:focus {
            outline: none;
            text-decoration: none;
        }
    }

    .user-circle {
        grid-area: starting-anchor-element;
        place-self: center center;
        /* Tighten the line-height to match the icon's size... */
        line-height: 1;
        /* ...which is approximately 8px at 15px/1em in Vlad's design. */
        font-size: 0.5333em;
    }

    .user_sidebar_entry.with_avatar {
        .user-profile-picture-container {
            /* Establish positioning context for user circle. */
            position: relative;
            /* TODO: Express this as part of the grid on
               .selectable_sidebar_block. */
            margin-right: var(--right-sidebar-avatar-right-margin);

            &:not(:has(.user-circle-offline)) .user-profile-picture {
                /* The over-avatar user circle width is 15.5px at 20px/1em;
                   we adjust the border radius here to avoid any pixels
                   from the avatar bleeding through. */
                border-bottom-right-radius: 0.3875em; /* 7.75px at 20px/1em */
            }
        }

        .user-profile-picture {
            /* Push back on the margin-right usually allotted here;
               we put it on .user-profile-picture-container instead,
               so that user circles occupy the corner of the image. */
            margin-right: 0;
        }

        .user-circle {
            position: absolute;
            /* 10px at 16px/1em */
            font-size: 0.625em;
            bottom: -0.5px;
            right: -0.5px;
            background-color: var(--color-background);
            /* A 1.5px border provides better results than
               a 1px border, especially at smaller font sizes. */
            border: 1.5px solid var(--color-background);
            border-radius: 50%;

            &.user-circle-offline {
                display: none;
            }
        }
    }

    /* Overwrite some stray list rules (including one in left_sidebar.css) to turn color
       back to the bootstrap default. */
    .view-all-subscribers-link,
    .view-all-users-link {
        color: var(--color-text-url);

        &:hover {
            /* Prevent hover styles set on other rows until
               the right sidebar matches the action-heading typography
               of the left sidebar. */
            box-shadow: none;
            background-color: inherit;
            color: var(--color-text-url-hover);
        }
    }
}

#left-sidebar-empty-list-message {
    list-style-type: none;
    padding-top: 10px;
    text-align: center;
}

#left-sidebar-empty-list-message .empty-list-message,
.buddy-list-section .empty-list-message {
    font-style: italic;
    color: var(--color-text-empty-list-message);
    /* Overwrite default empty list font size, to look better under the subheaders. */
    /* 14px at 16px/1em */
    font-size: 0.875em;
    /* Override .empty-list-message !important styling */
    padding: 0 !important;
    text-align: left;

    &:hover {
        /* Prevent hover styles set on other rows. */
        box-shadow: none;
        background-color: inherit;
    }
}

.buddy-list-subsection-header {
    display: grid;
    align-items: center;
    grid-template:
        "arrow row-content scroll-buffer" var(
            --line-height-sidebar-row-prominent
        )
        / var(--right-sidebar-header-icon-toggle-width) minmax(0, 1fr);
    cursor: pointer;
    background-color: var(--color-background);
    position: sticky;
    top: 0;
    z-index: 1;
    color: var(--color-text-default);
    border-radius: 4px;
    margin-right: var(--width-simplebar-scroll-hover);

    &:hover {
        background-color: var(--color-buddy-list-highlighted-user);
        box-shadow: inset 0 0 0 1px var(--color-shadow-sidebar-row-hover);

        .buddy-list-section-toggle,
        .buddy-list-heading {
            opacity: var(--opacity-sidebar-heading-hover);
        }
    }
}

.buddy-list-heading {
    user-select: none;
    margin: 0;
    padding: 5px 5px 5px 0;
    color: var(--color-text-sidebar-heading);
    font-size: inherit;
    font-weight: var(--font-weight-sidebar-heading);
    letter-spacing: var(--letter-spacing-sidebar-heading);
    opacity: var(--opacity-sidebar-heading);
    transition: opacity 140ms linear;
    grid-area: row-content;
    display: flex;
}

.buddy-list-heading-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 2px;
}

.buddy-list-heading-user-count-with-parens {
    opacity: 0.75;
}

.buddy-list-subsection-header.no-display {
    display: none;
}

.user-presence-link,
.user_sidebar_entry .selectable_sidebar_block {
    overflow: hidden;
    color: var(--color-text-sidebar-row);

    .user-name {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.user_sidebar_entry .selectable_sidebar_block {
    grid-area: row-content;
    display: grid;
    grid-template:
        "starting-anchor-element row-content markers-and-controls" var(
            --line-height-sidebar-row
        )
        ".                       row-content ." auto / var(
            --right-sidebar-presence-circle-width
        )
        minmax(0, 1fr)
        minmax(0, auto);
    align-items: baseline;
}

.user_sidebar_entry.with_avatar {
    grid-template:
        "row-content" var(--line-height-sidebar-row-with-avatars)
        "row-content" auto / minmax(0, 1fr);

    .selectable_sidebar_block {
        grid-template-rows: auto;
        padding: 4px;
        padding-left: calc(var(--right-sidebar-header-icon-toggle-width) / 2);
    }

    .avatar-preload-background {
        background-color: var(--color-buddy-list-avatar-loading);
    }

    .unread_count:not(.hide) {
        margin-right: 2px;
    }

    &.with_status .unread_count {
        align-self: baseline;
    }
}

.user-presence-link {
    user-select: text;
    grid-area: row-content;

    &:hover,
    &:focus {
        color: var(--color-text-sidebar-row);
        text-decoration: none;
    }
}

.information-settings .profile-with-avatar,
.user_sidebar_entry.with_avatar .selectable_sidebar_block {
    line-height: var(--line-height-sidebar-row-with-avatars);
    display: grid;
    grid-template:
        "avatar row-content markers-and-controls" var(
            --right-sidebar-avatar-width
        )
        / auto minmax(0, 1fr) minmax(0, auto);
    justify-content: flex-start;
    align-items: center;
}

.information-settings .profile-with-avatar {
    margin: 5px 0;
}

.my_user_status {
    opacity: 0.5;
    white-space: nowrap;
}

.selectable_sidebar_block {
    cursor: pointer;
}

.user_list_style_values {
    .user-name-and-status-emoji {
        display: flex;
        align-items: center;
        width: 100%;

        .user-name {
            display: inline-block;
            max-width: calc(100% - var(--user-status-emoji-width));
            overflow-x: hidden;
            text-overflow: ellipsis;
        }

        .status-emoji {
            line-height: 20px;
            margin-left: 6px;
        }
    }

    .status-text {
        overflow-x: hidden;
        text-overflow: ellipsis;
    }
}

.user_sidebar_entry {
    display: grid;
    /* We establish a two-row, two-column outer grid so
       that controls remain aligned with the username,
       even when there is a status line shown below.

       The 25px column for the vdots is less than the
       30px allotted in the left sidebar, but it holds
       the username area constant, so that no ellipsis
       appears on the username on hover. The 25px value
       is necessary for correct vdots alignment with the
       filter row's vdots. */
    grid-template:
        "row-content ending-anchor-element" var(--line-height-sidebar-row)
        "row-content ." auto / minmax(0, 1fr) var(--right-sidebar-vdots-width);
    align-content: baseline;
    margin-right: var(--width-simplebar-scroll-hover);
    /* When both the left circle and three dot menu are present, we want
       the space to the left of the circle to be more similar to the space
       to the right of the three dot menu. */
    &:not(.with_avatar) {
        padding-left: calc(var(--right-sidebar-toggle-width-offset) - 2px);
    }

    &:hover {
        cursor: pointer;
    }

    .user-name-and-status-emoji {
        display: flex;
    }

    .status-text {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.75;
        font-size: 90%;
    }

    & span.status-text:not(:empty) {
        /* Cinch up the status text by one quarter of the
           sidebar row's line-height. */
        margin-top: calc((var(--line-height-sidebar-row) / 4) * -1);
    }

    .unread_count {
        grid-area: markers-and-controls;
        align-self: center;
        display: none;
    }

    .unread_count:not(.hide) {
        display: block;
        margin-left: 4px;

        &:empty {
            /* Hide otherwise empty unread count pill
               after DMs have been read, but before the
               count has been removed from the DOM. */
            display: none;
        }
    }
}

#userlist-toggle {
    text-align: center;
    vertical-align: middle;
}

#userlist-toggle-button {
    text-decoration: none;
    color: hsl(0deg 0% 60%);

    &:hover {
        color: inherit;
    }
}

.right-sidebar-items:first-of-type #userlist-header {
    border-top: none;
}

#userlist-header {
    cursor: pointer;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    padding-left: var(--right-sidebar-heading-left-spacing);
    /* The scrollbar doesn't extend this high, but we want the three-dot
       menus to line up. */
    padding-right: var(--width-simplebar-scroll-hover);
    padding-bottom: var(--sidebar-filter-bottom-spacing);
    background-color: var(--color-background);

    #buddy-list-menu-icon {
        color: var(--color-vdots-visible);
        width: var(--right-sidebar-vdots-width);
        /* Push back against default right-sidebar
           spacing for better vdots alignment. */
        padding: 0;
        /* No left/right margin to maintain vdots
           alignment with user rows below. */
        margin: 2px 0;

        &:hover {
            color: var(--color-vdots-hover);
            background-color: var(--color-background-sidebar-action-hover);
        }
    }
}

.buddy-list-user-link,
.invite-user-shortcut {
    margin-right: var(--width-simplebar-scroll-hover);
    border-radius: 4px;

    &:hover {
        background: var(--color-background-sidebar-action-heading-hover);
        box-shadow: inset 0 0 0 1px var(--color-shadow-sidebar-row-hover);
        color: var(--color-text-sidebar-action-heading-hover);
    }

    .right-sidebar-wrappable-text-container {
        display: grid;
        grid-template-rows: minmax(
            var(--line-height-sidebar-row-prominent),
            auto
        );
        align-items: center;
        color: var(--color-text-sidebar-action-heading);

        .right-sidebar-wrappable-text-inner {
            margin: var(--spacing-top-bottom-sidebar-topic-inner) 0;
            line-height: 1;
            text-decoration: none;
            font-size: var(--font-size-sidebar-action-heading);
            font-weight: var(--font-weight-sidebar-action-heading);
            font-variant: var(--font-variant-sidebar-action-heading);
            font-feature-settings: var(
                --font-feature-settings-sidebar-action-heading
            );
        }
        text-transform: var(--text-transform-sidebar-action-heading);
    }
}

#user-list.with_avatars
    .buddy-list-user-link
    .right-sidebar-wrappable-text-container,
#user-list.with_avatars .buddy-list-section .empty-list-message {
    margin-left: var(--right-sidebar-text-indent-with-avatar);
}

.buddy-list-user-link .right-sidebar-wrappable-text-container,
.buddy-list-section .empty-list-message {
    margin-left: var(--right-sidebar-text-indent-without-avatar);
}

.invite-user-shortcut {
    /* The margin top is calculated from a legacy 25px height,
       from a 20px line of text and 5px of margin top. We calculate
       a scaling margin-top by subtracting the em-unit line height
       from the legacy value. */
    margin-top: calc(25px - (var(--legacy-body-line-height-unitless) * 1em));
    margin-bottom: var(--sidebar-bottom-spacing);

    .invite-user-link {
        /* TODO: We should eventually change the grid to use the correct
           --right-sidebar-presence-circle-width with left spacing, and
           share that left spacing value here. */
        padding-left: calc(var(--right-sidebar-toggle-width-offset) + 0.3em);
    }
}

#user-list.with_avatars .invite-user-link {
    padding-left: calc(var(--right-sidebar-header-icon-toggle-width) / 2);
}

#buddy-list-actions-menu-popover {
    .display-style-selector + .invite-user-link-item {
        border-top: 1px solid var(--color-border-sidebar-subheader);
    }

    /* No hover effect on the label */
    .display-style-selector-header:hover {
        background: inherit;
        cursor: default;
    }

    .popover-menu-link:not(.display-style-selector-header) {
        display: grid;
        grid-template: "left-icon row-content" auto / 18px minmax(
                max-content,
                1fr
            );
        align-items: center;

        .popover-menu-icon,
        .user_list_style_choice {
            grid-area: left-icon;
            justify-self: baseline;
        }

        .popover-menu-label {
            grid-area: row-content;
        }
    }
}

#buddy-list-loading-subscribers {
    margin: auto;
    padding-right: var(--width-simplebar-scroll-hover);
    padding-top: 30px;
}
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages.css]---
Location: zulip-main/web/styles/scheduled_messages.css

```text
#reminders-overlay-container,
#scheduled_messages_overlay_container {
    .no-overlay-messages {
        display: none;

        &:only-child {
            display: block;
        }
    }
}

#scheduled_message_indicator {
    display: block;
    margin-left: 10px;
    font-style: italic;
    color: hsl(0deg 0% 53%);
}

#reminders-overlay-container .message_content {
    cursor: auto;
}

.schedule-reminder-note {
    /* Horizontal resizing in the popover doesn't look good at all. */
    resize: vertical;
    width: 100%;
    min-width: 10em;
    padding: 3px;
    /* We set the minimum height of textarea to be enough for two lines of text. */
    min-height: calc(2em * var(--base-line-height-unitless));

    background-color: var(--background-color-textarea);

    font-size: 1em;
    line-height: var(--base-line-height-unitless);
    font-family: "Source Sans 3 VF", sans-serif;
}
```

--------------------------------------------------------------------------------

---[FILE: search.css]---
Location: zulip-main/web/styles/search.css

```text
#searchbox {
    width: 100%;
    height: var(--header-height);

    .navbar-search {
        margin: 0.2187em 0; /* 3.5px at 16px em */
        border-radius: 5px;
        position: absolute;
        overflow: hidden;
        /* We bump the z-index to keep the search box
           clickable despite position-based layout
           adjustments. */
        z-index: 1;
    }

    .search_icon {
        grid-area: search-icon;
        align-self: center;
        text-decoration: none;
        padding: 0 0.4117em; /* 7px at 17px em */
        font-size: 1.0625em; /* 17px at 16px em */
        border: none;
        background-color: transparent;
        color: var(--color-search-icons);
        opacity: 0.5;
        cursor: default;

        &:active,
        &:focus {
            outline: none;
        }

        &:disabled {
            visibility: hidden;
        }
    }

    .search_close_button {
        grid-area: search-close;
        width: 1.75em; /* 28px at 16px em */
        height: 100%;
        background: none;
        border: none;
        opacity: 0.5;
        line-height: 0;
        border-radius: 4px;
        /* Reset iOS button defaults. */
        color: var(--color-search-icons);
        padding: 0;
        outline: none;

        &:hover {
            opacity: 1;
        }

        &:focus-visible {
            outline: 2px solid var(--color-outline-focus);
            outline-offset: -3px;
        }

        &:disabled {
            visibility: hidden;
        }
    }

    .search-input-and-pills {
        grid-area: search-pills;
        display: flex;
        padding: 0;
        flex-wrap: wrap;
        gap: 0.125em; /* 2px at 16px em */
        align-self: center;
    }

    .navbar-search:not(.expanded) {
        right: 0;
        background-color: var(--color-background-search-collapsed);

        .search_close_button {
            display: none;
        }

        #searchbox-input-container {
            width: var(--search-box-width);

            @media (width < $md_min) {
                grid-template:
                    "search-icon search-pills" var(--search-box-height)
                    / var(--search-box-height) 0;
                column-gap: 0;
            }
        }

        .search-input {
            border-radius: 5px;
            color: var(--color-text-search);
            box-shadow: none;
        }

        &:hover {
            cursor: pointer;

            @media (width >= $md_min) {
                box-shadow:
                    0 4px 20px var(--color-search-box-hover-shadow),
                    0 1px 5px var(--color-search-box-hover-shadow);
            }

            .search_icon {
                cursor: pointer;
            }
        }

        @media (width < $md_min) {
            .search-input {
                opacity: 0;
            }
        }

        @media (height < $short_navbar_cutoff_height) {
            #searchbox-input-container .search_icon {
                font-size: 1.125em; /* 18px at 16px/em */
            }
        }
    }

    .navbar-search.expanded {
        width: 100%;
        box-shadow:
            0 4px 20px var(--color-search-shadow-wide),
            0 1px 5px var(--color-search-shadow-tight);

        .search-input {
            cursor: text;
        }

        #searchbox-input-container.pill-container {
            /* Pill container should display the same background
               color as the search typeahead. */
            background-color: var(--color-background-search);
        }

        @media (width < $md_min) {
            /* 3px chosen so that the cursor clicks the search button
               and close button from the same position. */
            width: calc(100% - 3px);
            /* z-index to not see the gear icon underneath */
            z-index: 1;
        }
    }

    .typeahead.dropdown-menu {
        /* Match the typeahead's width to its parent container. */
        right: 0;
        top: 0;
        margin-top: 0;
        padding-top: 0;
        box-shadow: none;
        position: relative;
        width: 100%;
        background: var(--color-background-search);
        color: var(--color-text-search);

        border-width: 0;
        border-top-width: 1px;
        border-top-color: var(--color-search-dropdown-top-border);
        border-radius: 0 0 4px 4px;

        .active > a {
            background-color: var(--color-background-search-option-hover);
            background-image: none;
            color: var(--color-text-search-hover);
        }

        .typeahead-menu .simplebar-content {
            min-width: unset;
        }

        .typeahead-menu .simplebar-content > li > a {
            max-width: none;
        }
    }

    .input-append {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 0;
    }

    .search-input {
        /* Avoid massive inheritance chain on font-size. */
        font-size: var(--base-font-size-px);
        /* override bootstrap padding for input[type="text"] */
        padding: 0;
        border: none;
        outline: none;
        border-radius: 0;
        font-family: "Source Sans 3 VF", sans-serif;
        font-weight: 400;
        background: transparent;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: pre;
        flex-grow: 1;

        color: var(--color-text-search);

        display: flex;
        align-items: center;

        &:empty::before {
            content: attr(data-placeholder-text);
            color: var(--color-text-search-placeholder);
        }
    }

    #searchbox-input-container .user-pill-container,
    .typeahead-menu .user-pill-container {
        border: 1px solid transparent;

        > .pill-label {
            min-width: fit-content;
            white-space: nowrap;
            width: fit-content;
            /* Replaced by the 5px gap. */
            margin-right: 0;
        }

        .pill {
            height: var(--length-user-pill-height);
        }

        .pill-image {
            height: var(--length-search-pill-image);
            width: var(--length-search-pill-image);
        }

        .pill-image-border {
            border: none;
        }

        .pill:not(.deactivated-pill) {
            background-color: var(--color-background-user-pill);
        }
    }

    #searchbox-input-container {
        display: grid;
        /* The next two styles override .input-append style from app_components.js */
        letter-spacing: normal;
        font-size: 100%;
        /* Override style for .pill-container that isn't relevant for search. */
        border: none;
        grid-template:
            "search-icon search-pills search-close" var(--search-box-height)
            ". search-pills ." auto / var(--search-left-padding) minmax(0, 1fr)
            1.75em; /* 28px at 16px em */
        align-content: center;
        cursor: pointer;

        /* Override styles for .pill-container that aren't relevant for search. */
        &.pill-container {
            background: inherit;
            gap: 0;
            /* Override padding. */
            padding: 0;
        }

        .pill {
            margin: 0;
            min-width: unset;
            background-color: var(--color-background-input-pill-search);
        }

        &:not(.focused) {
            height: var(--search-box-height);
            overflow: hidden;

            .search-input-and-pills {
                flex-wrap: nowrap;
                overflow: hidden;

                @media (height < $short_navbar_cutoff_height) {
                    line-height: var(--base-line-height-unitless);
                }
            }
        }

        &.focused .user-pill-container {
            flex-flow: row wrap;
        }

        .user-pill-container {
            gap: 2px 5px;
            /* Don't enforce a height, as user-pill containers
                can contain multiple user pills that wrap onto
                new lines. */
            height: unset;

            /* Not focus-visible, because we want to support mouse+backpace
                to delete pills */
            &:focus {
                /* Unlike regular `.pill` this multi-user pill has a border,
                    so we use border instead of box-shadow on focus. */
                box-shadow: none;
                border-color: var(--color-focus-outline-input-pill);
            }

            > .pill-label {
                /* Don't inherit large line-height for user pill labels. */
                line-height: 1.1;
            }

            .pill {
                border: none;
                /* Match border radius to image */
                border-radius: 4px;
                max-width: none;
                /* Set the minimum width on the pill container;
                    this accommodates the avatar, a minimum
                    two-character username, and the closing X.
                    90px at 20px/1em.

                TODO: This would ideally be reworked, as we need to
                override it for search suggestion pills (with no X) below.
               */
                min-width: 4.5em;
                display: grid;
                grid-template-columns:
                    var(--length-search-pill-image) minmax(0, 1fr)
                    var(--length-input-pill-exit);
                align-content: center;
                /* Don't inherit large line-height for user pills themselves, either. */
                line-height: 1.1;
            }
        }
    }

    @media (width >= $md_min) {
        .navbar-search {
            background: var(--color-background-search);
        }

        .navbar-search:not(.expanded) {
            box-shadow: 0 0 2px var(--color-search-box-hover-shadow);
        }
    }

    @media (width < $md_min) {
        .navbar-search:not(.expanded) .search_icon:hover {
            opacity: 1;
        }

        .navbar-search.expanded {
            background: var(--color-background-search);
        }
    }

    @media (height < $short_navbar_cutoff_height) {
        #searchbox_form:not(.expanded) {
            margin: 0;
            /* Now that the header is shorter, the search box will take up the whole
               height (which looks weird), so add 1px of space above and below it
               by manipulating the margin and the height. */
            margin-top: 1px;
            height: calc(var(--header-height) - 3px);
        }

        /* It looks fine to fill the navbar when the typeahead is open. */
        #searchbox_form.expanded {
            margin-top: 1px;
        }
    }

    @media (width < $sm_min) {
        #searchbox_form.expanded {
            position: fixed;
            left: 0;
            right: 9px;
            width: 100%;
            border-radius: 0;
            box-shadow: none;
            /* To be visible over `.left-sidebar-toggle-unreadcount` */
            z-index: 20;
        }
    }

    .typeahead-menu .simplebar-content > li > a {
        padding: 3px var(--search-left-padding);
        /* Override white-space: nowrap from zulip.css */
        white-space: normal;

        .search_list_item {
            max-width: 100%;
            display: flex;
            gap: 5px;
            align-items: center;
        }

        .search_list_item .description {
            margin: 2px 0;
        }

        .search_list_item .pill-container {
            margin: 2px 0;
            /* This contains only one pill, which handles its own border */
            border: none;
            cursor: pointer;
            padding: 0;
            max-width: 100%;
        }

        .pill {
            align-items: baseline;
            margin: 0;

            /* We remove the close button's column space from the grid template
               for search suggestions, since there's no exit button.
               The min-width here prevents extra space on very short names. */
            min-width: 0;
            grid-template-columns: var(--length-search-pill-image) minmax(
                    0,
                    1fr
                );

            /* We don't show a border for focused pills
               in the search typeahead */
            &:focus {
                /* Regular pills use box-shadow. */
                box-shadow: none;

                /* User pills use border */
                border-color: var(--color-background-input-pill);

                .pill-image-border {
                    border-color: var(--color-border-input-pill-image);
                }
            }

            .exit {
                display: none;
            }
        }

        .user-pill-container {
            gap: 5px;
        }

        .pill-image {
            /* Add line-height equal to height to mimic baseline alignment. */
            line-height: var(--height-input-pill);
            align-self: center;
        }
    }

    /* Break really long words (unlikely to happen). */
    .search_list_item span {
        overflow-wrap: anywhere;
    }
}
```

--------------------------------------------------------------------------------

````

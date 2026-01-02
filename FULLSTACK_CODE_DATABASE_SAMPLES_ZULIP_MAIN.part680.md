---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 680
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 680 of 1290)

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

---[FILE: sidebar_ui.ts]---
Location: zulip-main/web/src/sidebar_ui.ts

```typescript
import $ from "jquery";
import _ from "lodash";

import render_left_sidebar from "../templates/left_sidebar.hbs";
import render_buddy_list_popover from "../templates/popovers/buddy_list_popover.hbs";
import render_right_sidebar from "../templates/right_sidebar.hbs";

import {buddy_list} from "./buddy_list.ts";
import * as channel from "./channel.ts";
import * as compose_ui from "./compose_ui.ts";
import {$t} from "./i18n.ts";
import * as keydown_util from "./keydown_util.ts";
import * as left_sidebar_navigation_area from "./left_sidebar_navigation_area.ts";
import {ListCursor} from "./list_cursor.ts";
import {localstorage} from "./localstorage.ts";
import * as message_lists from "./message_lists.ts";
import * as message_reminder from "./message_reminder.ts";
import * as message_viewport from "./message_viewport.ts";
import {page_params} from "./page_params.ts";
import * as pm_list from "./pm_list.ts";
import * as popover_menus from "./popover_menus.ts";
import * as popovers from "./popovers.ts";
import * as resize from "./resize.ts";
import * as scheduled_messages from "./scheduled_messages.ts";
import * as scroll_util from "./scroll_util.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import * as settings_preferences from "./settings_preferences.ts";
import * as spectators from "./spectators.ts";
import {current_user} from "./state_data.ts";
import * as stream_list from "./stream_list.ts";
import * as ui_util from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

const LEFT_SIDEBAR_NAVIGATION_AREA_TITLE = $t({defaultMessage: "VIEWS"});

export let left_sidebar_cursor: ListCursor<JQuery>;

function save_sidebar_toggle_status(): void {
    const ls = localstorage();
    ls.set("left-sidebar", $("body").hasClass("hide-left-sidebar"));

    if (!page_params.is_spectator) {
        // The right sidebar is never shown in the spectator mode;
        // avoid interacting with local storage state for it.
        ls.set("right-sidebar", $("body").hasClass("hide-right-sidebar"));
    }
}

export function restore_sidebar_toggle_status(): void {
    const ls = localstorage();
    if (ls.get("left-sidebar")) {
        $("body").addClass("hide-left-sidebar");
    }

    if (!page_params.is_spectator && ls.get("right-sidebar")) {
        // The right sidebar is never shown in the spectator mode;
        // avoid processing local storage state for hiding the right
        // sidebar.
        $("body").addClass("hide-right-sidebar");
    }
}

export let left_sidebar_expanded_as_overlay = false;
export let right_sidebar_expanded_as_overlay = false;

export function hide_userlist_sidebar(): void {
    const $userlist_sidebar = $(".app-main .column-right");
    $userlist_sidebar.removeClass("expanded topmost-overlay");
    right_sidebar_expanded_as_overlay = false;
}

export function show_userlist_sidebar(): void {
    const $streamlist_sidebar = $(".app-main .column-left");
    const $userlist_sidebar = $(".app-main .column-right");
    if ($userlist_sidebar.css("display") !== "none") {
        // Return early if the right sidebar is already visible.
        return;
    }

    if (ui_util.matches_viewport_state("gte_xl_min")) {
        $("body").removeClass("hide-right-sidebar");
        fix_invite_user_button_flicker();
        return;
    }

    $userlist_sidebar.addClass("expanded");
    if (left_sidebar_expanded_as_overlay) {
        $userlist_sidebar.addClass("topmost-overlay");
        $streamlist_sidebar.removeClass("topmost-overlay");
    }
    fix_invite_user_button_flicker();
    resize.resize_page_components();
    right_sidebar_expanded_as_overlay = true;
}

export function show_streamlist_sidebar(): void {
    const $userlist_sidebar = $(".app-main .column-right");
    const $streamlist_sidebar = $(".app-main .column-left");
    // Left sidebar toggle icon is attached to middle column.
    $(".app-main .column-left, #navbar-middle").addClass("expanded");
    if (right_sidebar_expanded_as_overlay) {
        $streamlist_sidebar.addClass("topmost-overlay");
        $userlist_sidebar.removeClass("topmost-overlay");
    }
    resize.resize_stream_filters_container();
    left_sidebar_expanded_as_overlay = true;
}

// We use this to display left sidebar without setting
// toggle status
export function show_left_sidebar(): void {
    if (
        // Check if left column is a overlay and is not visible.
        $("#streamlist-toggle").css("display") !== "none" &&
        !left_sidebar_expanded_as_overlay
    ) {
        popovers.hide_all();
        show_streamlist_sidebar();
    } else if (!left_sidebar_expanded_as_overlay) {
        $("body").removeClass("hide-left-sidebar");
    }
}

export function hide_streamlist_sidebar(): void {
    const $streamlist_sidebar = $(".app-main .column-left");
    $(".app-main .column-left, #navbar-middle").removeClass("expanded");
    $streamlist_sidebar.removeClass("topmost-overlay");
    left_sidebar_expanded_as_overlay = false;
}

export function any_sidebar_expanded_as_overlay(): boolean {
    return left_sidebar_expanded_as_overlay || right_sidebar_expanded_as_overlay;
}

export function update_invite_user_option(): void {
    if (
        !settings_data.user_can_invite_users_by_email() &&
        !settings_data.user_can_create_multiuse_invite()
    ) {
        $("#right-sidebar .invite-user-link").hide();
    } else {
        $("#right-sidebar .invite-user-link").show();
    }
}

export function hide_all(): void {
    hide_streamlist_sidebar();
    hide_userlist_sidebar();
}

function fix_invite_user_button_flicker(): void {
    // Keep right sidebar hidden after browser renders it to avoid
    // flickering of "Invite more users" button. Since the user list
    // is a complex component browser takes time for it to render
    // causing the invite button to render first.
    $("body").addClass("hide-right-sidebar-by-visibility");
    // Show the right sidebar after the browser has completed the above render.
    setTimeout(() => {
        $("body").removeClass("hide-right-sidebar-by-visibility");
    }, 0);
}

export function initialize(): void {
    $("body").on("click", ".login_button", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = spectators.build_login_link();
    });

    $("body").on("keydown", ".login_button", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = spectators.build_login_link();
        }
    });

    $("#userlist-toggle-button").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (ui_util.matches_viewport_state("gte_xl_min")) {
            $("body").toggleClass("hide-right-sidebar");
            if (!$("body").hasClass("hide-right-sidebar")) {
                fix_invite_user_button_flicker();
            }
            // We recheck the scrolling-button status of the compose
            // box, which may change for users who've chosen to
            // use full width on wide screens.
            compose_ui.maybe_show_scrolling_formatting_buttons(
                "#message-formatting-controls-container",
            );
            save_sidebar_toggle_status();
            return;
        }

        if (right_sidebar_expanded_as_overlay) {
            hide_userlist_sidebar();
            return;
        }
        show_userlist_sidebar();
    });

    $(".left-sidebar-toggle-button").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (ui_util.matches_viewport_state("gte_md_min")) {
            $("body").toggleClass("hide-left-sidebar");
            if (
                message_lists.current !== undefined &&
                !ui_util.matches_viewport_state("gte_xl_min")
            ) {
                // We expand the middle column width between md and xl breakpoints when the
                // left sidebar is hidden. This can cause the pointer to move out of view.
                message_viewport.scroll_to_selected();
            }
            // We recheck the scrolling-button status of the compose
            // box, which may change for users who've chosen to
            // use full width on wide screens.
            compose_ui.maybe_show_scrolling_formatting_buttons(
                "#message-formatting-controls-container",
            );
            save_sidebar_toggle_status();
            return;
        }

        if (left_sidebar_expanded_as_overlay) {
            hide_streamlist_sidebar();
            return;
        }
        show_streamlist_sidebar();
    });

    // Hide left / right sidebar on click outside.
    document.addEventListener(
        "click",
        (e) => {
            if (!(left_sidebar_expanded_as_overlay || right_sidebar_expanded_as_overlay)) {
                return;
            }

            if (!(e.target instanceof Element)) {
                return;
            }

            const $elt = $(e.target);
            // Since sidebar toggle buttons have their own click handlers, don't handle them here.
            if (
                $elt.closest(".left-sidebar-toggle-button").length > 0 ||
                $elt.closest("#userlist-toggle-button").length > 0
            ) {
                return;
            }

            // Overrides for certain elements that should not close the sidebars.
            if ($elt.closest(".no-auto-hide-sidebar-overlays").length > 0) {
                return;
            }

            if (
                left_sidebar_expanded_as_overlay &&
                $elt.closest(".auto-hide-left-sidebar-overlay").length > 0
            ) {
                hide_streamlist_sidebar();
            }

            if (
                left_sidebar_expanded_as_overlay &&
                $elt.closest(".no-auto-hide-left-sidebar-overlay").length === 0
            ) {
                const $left_column = $(".app-main .column-left");
                const click_outside_left_sidebar = $elt.closest($left_column).length === 0;
                if (click_outside_left_sidebar) {
                    hide_streamlist_sidebar();
                }
            }

            if (
                right_sidebar_expanded_as_overlay &&
                $elt.closest(".no-auto-hide-right-sidebar-overlay").length === 0
            ) {
                const $right_column = $(".app-main .column-right");
                const click_outside_right_sidebar = $elt.closest($right_column).length === 0;

                if (click_outside_right_sidebar) {
                    hide_userlist_sidebar();
                }
            }
        },
        {capture: true},
    );
}

export function update_expanded_views_for_search(search_term: string): void {
    if (!search_term) {
        // Show all the views if there is no search term.
        $("#left-sidebar-navigation-area, #left-sidebar-navigation-list .top_left_row").removeClass(
            "hidden-by-filters",
        );
        left_sidebar_navigation_area.update_scheduled_messages_row();
        left_sidebar_navigation_area.update_reminders_row();
        return;
    }

    let any_view_visible = false;
    const expanded_views = left_sidebar_navigation_area.get_built_in_views();
    const show_all_views = util.prefix_match({
        value: LEFT_SIDEBAR_NAVIGATION_AREA_TITLE,
        search_term,
    });
    for (const view of expanded_views) {
        let show_view =
            show_all_views ||
            util.prefix_match({
                value: view.name,
                search_term,
            });
        const $view = $(`.top_left_${view.css_class_suffix}`);

        if (show_view && $view.hasClass("top_left_scheduled_messages")) {
            show_view = scheduled_messages.get_count() !== 0;
        }

        if (show_view && $view.hasClass("top_left_reminders")) {
            show_view = message_reminder.get_count() !== 0;
        }
        $view.toggleClass("hidden-by-filters", !show_view);
        any_view_visible ||= show_view;
    }
    // Hide "VIEWS" header if all views are hidden.
    $("#left-sidebar-navigation-area").toggleClass("hidden-by-filters", !any_view_visible);
}

export function initialize_left_sidebar(): void {
    const primary_condensed_views =
        left_sidebar_navigation_area.get_built_in_primary_condensed_views();
    const expanded_views = left_sidebar_navigation_area.get_built_in_views();

    const rendered_sidebar = render_left_sidebar({
        is_guest: current_user.is_guest,
        is_spectator: page_params.is_spectator,
        primary_condensed_views,
        expanded_views,
        LEFT_SIDEBAR_NAVIGATION_AREA_TITLE,
        LEFT_SIDEBAR_DIRECT_MESSAGES_TITLE: pm_list.LEFT_SIDEBAR_DIRECT_MESSAGES_TITLE,
    });

    $("#left-sidebar-container").html(rendered_sidebar);
    // make sure home-view and left_sidebar order persists
    left_sidebar_navigation_area.reorder_left_sidebar_navigation_list(user_settings.web_home_view);
    stream_list.update_unread_counts_visibility();
    initialize_left_sidebar_cursor();
    set_event_handlers();
}

export function focus_topic_search_filter(): void {
    popovers.hide_all();
    show_left_sidebar();
    const $filter = $("#topic_filter_query");
    $filter.trigger("focus");
}

export function initialize_right_sidebar(): void {
    const rendered_sidebar = render_right_sidebar();

    $("#right-sidebar-container").html(rendered_sidebar);

    buddy_list.initialize_tooltips();

    update_invite_user_option();

    $("#buddy-list-users-matching-view").on("mouseenter", ".user_sidebar_entry", (e) => {
        const $status_emoji = $(e.target).closest(".user_sidebar_entry").find("img.status-emoji");
        if ($status_emoji.length > 0) {
            const animated_url = $status_emoji.attr("data-animated-url");
            if (animated_url) {
                $status_emoji.attr("src", animated_url);
            }
        }
    });

    $("#buddy-list-users-matching-view").on("mouseleave", ".user_sidebar_entry", (e) => {
        const $status_emoji = $(e.target).closest(".user_sidebar_entry").find("img.status-emoji");
        if ($status_emoji.length > 0) {
            const still_url = $status_emoji.attr("data-still-url");
            if (still_url) {
                $status_emoji.attr("src", still_url);
            }
        }
    });

    $("#buddy-list-users-matching-view-container").on(
        "click",
        ".buddy-list-subsection-header",
        (e) => {
            e.stopPropagation();
            buddy_list.toggle_users_matching_view_section();
        },
    );

    $("#buddy-list-participants-container").on("click", ".buddy-list-subsection-header", (e) => {
        e.stopPropagation();
        buddy_list.toggle_participants_section();
    });

    $("#buddy-list-other-users-container").on("click", ".buddy-list-subsection-header", (e) => {
        e.stopPropagation();
        buddy_list.toggle_other_users_section();
    });

    function close_buddy_list_popover(): void {
        if (popover_menus.popover_instances.buddy_list !== null) {
            popover_menus.popover_instances.buddy_list.destroy();
            popover_menus.popover_instances.buddy_list = null;
        }
    }

    popover_menus.register_popover_menu("#buddy-list-menu-icon", {
        theme: "popover-menu",
        placement: "right",
        onCreate(instance) {
            popover_menus.popover_instances.buddy_list = instance;
            instance.setContent(
                ui_util.parse_html(
                    render_buddy_list_popover({
                        display_style_options: settings_config.user_list_style_values,
                        can_invite_users:
                            settings_data.user_can_invite_users_by_email() ||
                            settings_data.user_can_create_multiuse_invite(),
                    }),
                ),
            );
        },
        onMount() {
            const current_user_list_style =
                settings_preferences.user_settings_panel.settings_object.user_list_style;
            $("#buddy-list-actions-menu-popover")
                .find(`.user_list_style_choice[value=${current_user_list_style}]`)
                .prop("checked", true);
        },
        onHidden() {
            close_buddy_list_popover();
        },
    });

    $("body").on(
        "click",
        "#buddy-list-actions-menu-popover .display-style-selector",
        function (this: HTMLElement) {
            const data = {user_list_style: $(this).val()};
            const current_user_list_style =
                settings_preferences.user_settings_panel.settings_object.user_list_style;

            if (current_user_list_style === data.user_list_style) {
                close_buddy_list_popover();
                return;
            }

            void channel.patch({
                url: "/json/settings",
                data,
                success() {
                    close_buddy_list_popover();
                },
            });
        },
    );
}

function get_header_rows_selectors(): string {
    return (
        // Views header.
        "#left-sidebar-navigation-area:not(.hidden-by-filters) #views-label-container, " +
        // DM Headers
        "#direct-messages-section-header, " +
        // All channel headers.
        ".stream-list-section-container:not(.no-display) .stream-list-subsection-header"
    );
}

function all_rows(): JQuery {
    // NOTE: This function is designed to be used for keyboard navigation purposes.
    // This function returns all the rows in the left sidebar.
    // It is used to find the first key for the ListCursor.
    const $all_rows = $(
        // All left sidebar view rows.
        ".top_left_row, " +
            // All DM and channel rows.
            ".bottom_left_row, " +
            get_header_rows_selectors(),
    ).not(".hidden-by-filters");
    // Remove rows hidden due to being inactive or muted.
    const $inactive_or_muted_rows = $(
        "#streams_list:not(.is_searching) .stream-list-section-container:not(.showing-inactive-or-muted)" +
            " .inactive-or-muted-in-channel-folder .bottom_left_row:not(.hidden-by-filters)",
    );
    // Remove rows in collapsed sections / folders.
    const $collapsed_views = $(
        "#views-label-container.showing-condensed-navigation +" +
            " #left-sidebar-navigation-list .top_left_row",
    ).not(".top-left-active-filter");
    const $collapsed_channels = $(
        ".stream-list-section-container.collapsed .narrow-filter:not(.stream-expanded) .bottom_left_row",
    );
    const $hidden_topic_rows = $(
        ".stream-list-section-container.collapsed .topic-list-item:not(.active-sub-filter).bottom_left_row",
    );

    // Exclude toggle inactive / muted channels row from the list of rows if user is searching.
    const $toggle_inactive_or_muted_channels_row = $(
        "#streams_list.is_searching .stream-list-toggle-inactive-or-muted-channels.bottom_left_row",
    );

    return $all_rows
        .not($inactive_or_muted_rows)
        .not($collapsed_views)
        .not($collapsed_channels)
        .not($hidden_topic_rows)
        .not($toggle_inactive_or_muted_channels_row);
}

class LeftSidebarListCursor extends ListCursor<JQuery> {
    override adjust_scroll($li: JQuery): void {
        $li[0]!.scrollIntoView({
            block: "center",
        });
    }
}

export function initialize_left_sidebar_cursor(): void {
    left_sidebar_cursor = new LeftSidebarListCursor({
        list: {
            // `scroll_container_selector` is not used
            // since we override `adjust_scroll` above.
            scroll_container_selector: "#left-sidebar",
            find_li(opts) {
                return opts.key;
            },
            first_key(): JQuery | undefined {
                const $all_rows = all_rows();
                if ($all_rows.length === 0) {
                    return undefined;
                }
                const $non_header_rows = $all_rows.not($(get_header_rows_selectors()));
                return $non_header_rows.first();
            },
            next_key($key) {
                const $all_rows = all_rows();
                if ($all_rows.length === 0) {
                    return undefined;
                }

                const key_index = $all_rows.index($key);
                if (key_index === -1 || key_index === $all_rows.length - 1) {
                    return $key;
                }
                const $next = $all_rows.eq(key_index + 1);
                return $next;
            },
            prev_key($key) {
                const $all_rows = all_rows();
                if ($all_rows.length === 0) {
                    return undefined;
                }

                const key_index = $all_rows.index($key);
                if (key_index <= 0) {
                    return $key;
                }
                const $prev = $all_rows.eq(key_index - 1);
                return $prev;
            },
        },
        highlight_class: "highlighted_row",
    });
}

function actually_update_left_sidebar_for_search(): void {
    const search_value = ui_util.get_left_sidebar_search_term();
    const is_left_sidebar_search_active = search_value !== "";
    left_sidebar_cursor.set_is_highlight_visible(is_left_sidebar_search_active);

    // Update left sidebar navigation area.
    update_expanded_views_for_search(search_value);
    const $views_label_container = $("#views-label-container");
    const $views_label_icon = $("#toggle-top-left-navigation-area-icon");
    if (
        !$views_label_container.hasClass("showing-expanded-navigation") &&
        is_left_sidebar_search_active
    ) {
        left_sidebar_navigation_area.expand_views($views_label_container, $views_label_icon);
    } else if (!is_left_sidebar_search_active) {
        left_sidebar_navigation_area.restore_views_state();
    }

    // Update left sidebar DM list.
    pm_list.update_private_messages();

    // Update left sidebar channel list.
    stream_list.update_streams_sidebar();

    resize.resize_page_components();
    left_sidebar_cursor.reset();
    $("#left-sidebar-empty-list-message").toggleClass(
        "hidden",
        !is_left_sidebar_search_active || all_rows().length > 0,
    );
}

// Scroll position before user started searching.
let pre_search_scroll_position = 0;
let previous_search_term = "";

const update_left_sidebar_for_search = _.throttle(() => {
    const search_term = ui_util.get_left_sidebar_search_term();
    const is_previous_search_term_empty = previous_search_term === "";
    previous_search_term = search_term;

    const left_sidebar_scroll_container = scroll_util.get_left_sidebar_scroll_container();
    if (search_term === "") {
        requestAnimationFrame(() => {
            actually_update_left_sidebar_for_search();
            // Restore previous scroll position.
            left_sidebar_scroll_container.scrollTop(pre_search_scroll_position);
        });
    } else {
        if (is_previous_search_term_empty) {
            // Store original scroll position to be restored later.
            pre_search_scroll_position = left_sidebar_scroll_container.scrollTop()!;
        }
        requestAnimationFrame(() => {
            actually_update_left_sidebar_for_search();
            // Always scroll to top when there is a search term present.
            left_sidebar_scroll_container.scrollTop(0);
        });
    }
}, 50);

function focus_left_sidebar_filter(e: JQuery.ClickEvent): void {
    left_sidebar_cursor.reset();
    e.stopPropagation();
}

export function focus_pm_search_filter(): void {
    popovers.hide_all();
    show_left_sidebar();
    const $filter = $(".direct-messages-list-filter").expectOne();
    $filter.trigger("focus");
}

export function set_event_handlers(): void {
    const $search_input = $(".left-sidebar-search-input").expectOne();

    function keydown_enter_key(): void {
        const $row = left_sidebar_cursor.get_key();

        if ($row === undefined) {
            // This can happen for empty searches, no need to warn.
            return;
        }

        if ($row[0]!.id === "views-label-container") {
            $row.find("#toggle-top-left-navigation-area-icon").trigger("click");
            return;
        }

        if (
            $row.hasClass("stream-list-toggle-inactive-or-muted-channels") ||
            $row[0]!.id === "direct-messages-section-header" ||
            $row.hasClass("stream-list-subsection-header")
        ) {
            $row.trigger("click");
            return;
        }
        // Clear search input so that there is no confusion
        // about which search input is active.
        $search_input.val("");
        const $nearest_link = $row.find("a").first();
        if ($nearest_link.length > 0) {
            // If the row has a link, we click it.
            $nearest_link[0]!.click();
        } else {
            // If the row does not have a link,
            // let the browser handle it or add special
            // handling logic for it here.
        }
        // Don't trigger `input` which confuses the search input
        // for zoomed in topic search.
        actually_update_left_sidebar_for_search();
        $search_input.trigger("blur");
    }

    keydown_util.handle({
        $elem: $search_input,
        handlers: {
            Enter() {
                keydown_enter_key();
                return true;
            },
            ArrowUp() {
                left_sidebar_cursor.prev();
                return true;
            },
            ArrowDown() {
                left_sidebar_cursor.next();
                return true;
            },
        },
    });

    $search_input.on("click", focus_left_sidebar_filter);
    $search_input.on("focusout", () => {
        left_sidebar_cursor.clear();
    });
    $search_input.on("input", update_left_sidebar_for_search);
}

export function initiate_search(): void {
    popovers.hide_all();

    const $filter = $(".left-sidebar-search-input").expectOne();

    show_left_sidebar();
    $filter.trigger("focus");

    left_sidebar_cursor.reset();
}
```

--------------------------------------------------------------------------------

---[FILE: spectators.ts]---
Location: zulip-main/web/src/spectators.ts

```typescript
// Module for displaying the modal asking spectators to log in when
// attempting to do things that are not possible as a spectator (like
// add an emoji reaction, star a message, etc.).  While in many cases,
// we will prefer to hide menu options that don't make sense for
// spectators, this modal is useful for everything that doesn't make
// sense to remove from a design perspective.

import $ from "jquery";

import render_login_to_access_modal from "../templates/login_to_access.hbs";

import {page_params} from "./base_page_params.ts";
import * as browser_history from "./browser_history.ts";
import * as modals from "./modals.ts";
import {realm} from "./state_data.ts";

export function current_hash_as_next(): string {
    return `next=/${encodeURIComponent(window.location.hash)}`;
}

export function build_login_link(): string {
    let login_link = "/login/?" + current_hash_as_next();
    if (page_params.development_environment) {
        login_link = "/devlogin/?" + current_hash_as_next();
    }
    return login_link;
}

export let login_to_access = (empty_narrow?: boolean): void => {
    // Hide all overlays, popover and go back to the previous hash if the
    // hash has changed.
    const login_link = build_login_link();
    const realm_name = realm.realm_name;

    $("body").append(
        $(
            render_login_to_access_modal({
                signup_link: "/register/",
                login_link,
                empty_narrow,
                realm_name,
            }),
        ),
    );

    modals.open("login_to_access_modal", {
        autoremove: true,
        on_hide() {
            browser_history.return_to_web_public_hash();
        },
    });
};

export function rewire_login_to_access(value: typeof login_to_access): void {
    login_to_access = value;
}
```

--------------------------------------------------------------------------------

---[FILE: spoilers.ts]---
Location: zulip-main/web/src/spoilers.ts

```typescript
import $ from "jquery";

import * as mouse_drag from "./mouse_drag.ts";
import * as util from "./util.ts";

function collapse_spoiler($spoiler: JQuery): void {
    const spoiler_height = $spoiler.height() ?? 0;

    // Set height to rendered height on next frame, then to zero on following
    // frame to allow CSS transition animation to work
    requestAnimationFrame(() => {
        $spoiler.height(`${spoiler_height}px`);
        $spoiler.removeClass("spoiler-content-open");

        requestAnimationFrame(() => {
            $spoiler.height("0px");
        });
    });
}

function expand_spoiler($spoiler: JQuery): void {
    // Normally, the height of the spoiler block is not defined absolutely on
    // the `spoiler-content-open` class, but just set to `auto` (i.e. the height
    // of the content). CSS animations do not work with properties set to
    // `auto`, so we get the actual height of the content here and temporarily
    // put it explicitly on the element styling to allow the transition to work.
    const spoiler_height = util.the($spoiler).scrollHeight;
    $spoiler.height(`${spoiler_height}px`);
    // The `spoiler-content-open` class has CSS animations defined on it which
    // will trigger on the frame after this class change.
    $spoiler.addClass("spoiler-content-open");

    $spoiler.on("transitionend", () => {
        $spoiler.off("transitionend");
        // When the CSS transition is over, reset the height to auto
        // This keeps things working if, e.g., the viewport is resized
        $spoiler.height("");
    });
}

export const hide_spoilers_in_notification = ($content: JQuery): JQuery => {
    $content.find(".spoiler-block").each((_i, elem) => {
        $(elem).find(".spoiler-content").remove();
        let text = $(elem).find(".spoiler-header").text().trim();
        if (text.length > 0) {
            text = `${text} `;
        }
        text = `${text}(…)`;
        $(elem).find(".spoiler-header").text(text);
    });
    return $content;
};

export function initialize(): void {
    $("body").on("click", ".spoiler-header", function (this: HTMLElement, e) {
        const $button = $(this).children(".spoiler-button");
        const $arrow = $button.children(".spoiler-arrow");
        const $spoiler_content = $(this).siblings(".spoiler-content");
        const $target = $(e.target);

        // Spoiler headers can contain Markdown, including links.  We
        // return so that clicking such links will be processed by
        // the browser rather than opening the header.
        if ($target.closest("a").length > 0) {
            return;
        }

        // Don't toggle if the user is dragging to select text. This handles
        // both dragging within the header and across the message body.
        if (mouse_drag.is_drag(e)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if ($spoiler_content.hasClass("spoiler-content-open")) {
            // Content was open, we are collapsing
            $arrow.removeClass("spoiler-button-open");

            // Modify ARIA roles for screen readers
            $button.attr("aria-expanded", "false");
            $spoiler_content.attr("aria-hidden", "true");

            collapse_spoiler($spoiler_content);
        } else {
            // Content was closed, we are expanding
            $arrow.addClass("spoiler-button-open");

            // Modify ARIA roles for screen readers
            $button.attr("aria-expanded", "true");
            $spoiler_content.attr("aria-hidden", "false");

            expand_spoiler($spoiler_content);
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: starred_messages.ts]---
Location: zulip-main/web/src/starred_messages.ts

```typescript
import * as message_store from "./message_store.ts";
import type {StateData} from "./state_data.ts";

export const starred_ids = new Set<number>();

export function initialize(starred_messages_params: StateData["starred_messages"]): void {
    starred_ids.clear();

    for (const id of starred_messages_params.starred_messages) {
        starred_ids.add(id);
    }
}

export function add(ids: number[]): void {
    for (const id of ids) {
        starred_ids.add(id);
    }
}

export function remove(ids: number[]): void {
    for (const id of ids) {
        starred_ids.delete(id);
    }
}

export function get_count(): number {
    return starred_ids.size;
}

export function get_starred_msg_ids(): number[] {
    return [...starred_ids];
}

export function get_count_in_topic(stream_id?: number, topic?: string): number {
    if (stream_id === undefined || topic === undefined) {
        return 0;
    }

    const messages = [...starred_ids].filter((id) => {
        const message = message_store.get(id);

        if (message === undefined) {
            // We know the `id` from the initial data fetch from page_params,
            // but the message itself hasn't been fetched from the server yet.
            // We ignore this message, since we can't check if it belongs to
            // the topic, but it could, meaning this implementation isn't
            // completely correct.
            // Since this function is used only when opening the topic popover,
            // and not for actually unstarring messages, this discrepancy is
            // probably acceptable. The worst it could manifest as is the topic
            // popover not having the "Unstar all messages in topic" option, when
            // it should have had.
            return false;
        }

        return (
            message.type === "stream" &&
            message.stream_id === stream_id &&
            message.topic.toLowerCase() === topic.toLowerCase()
        );
    });

    return messages.length;
}
```

--------------------------------------------------------------------------------

---[FILE: starred_messages_ui.ts]---
Location: zulip-main/web/src/starred_messages_ui.ts

```typescript
import render_confirm_unstar_all_messages from "../templates/confirm_dialog/confirm_unstar_all_messages.hbs";
import render_confirm_unstar_all_messages_in_topic from "../templates/confirm_dialog/confirm_unstar_all_messages_in_topic.hbs";

import * as confirm_dialog from "./confirm_dialog.ts";
import {$t_html} from "./i18n.ts";
import * as left_sidebar_navigation_area from "./left_sidebar_navigation_area.ts";
import * as message_flags from "./message_flags.ts";
import * as message_live_update from "./message_live_update.ts";
import * as message_store from "./message_store.ts";
import type {Message} from "./message_store.ts";
import * as popover_menus from "./popover_menus.ts";
import * as starred_messages from "./starred_messages.ts";
import * as sub_store from "./sub_store.ts";
import * as unread_ops from "./unread_ops.ts";
import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

export function toggle_starred_and_update_server(message: Message): void {
    if (message.locally_echoed) {
        // This is defensive code for when you hit the "*" key
        // before we get a server ack.  It's rare that somebody
        // can star this quickly, and we don't have a good way
        // to tell the server which message was starred.
        return;
    }

    message.starred = !message.starred;

    // Unlike most calls to mark messages as read, we don't check
    // msg_list.can_mark_messages_read, because starring a message is an
    // explicit interaction and we'd like to preserve the user
    // expectation invariant that all starred messages are read.
    unread_ops.notify_server_message_read(message);
    message_live_update.update_starred_view(message.id, message.starred);

    if (message.starred) {
        message_flags.send_flag_update_for_messages([message.id], "starred", "add");
        starred_messages.add([message.id]);
        rerender_ui();
    } else {
        message_flags.send_flag_update_for_messages([message.id], "starred", "remove");
        starred_messages.remove([message.id]);
        rerender_ui();
    }
}

// This updates the state of the starred flag in local data
// structures, and triggers a UI rerender.
export function update_starred_flag(message_id: number, updated_starred_flag: boolean): void {
    const message = message_store.get(message_id);
    if (message === undefined) {
        // If we don't have the message locally, do nothing; if later
        // we fetch it, it'll come with the correct `starred` state.
        return;
    }
    message.starred = updated_starred_flag;
    message_live_update.update_starred_view(message_id, updated_starred_flag);
}

export function rerender_ui(): void {
    const count = starred_messages.get_count();
    let hidden = false;

    if (!user_settings.starred_message_counts) {
        // This essentially hides the count
        hidden = true;
    }

    popover_menus.get_topic_menu_popover()?.hide();
    popover_menus.get_starred_messages_popover()?.hide();
    left_sidebar_navigation_area.update_starred_count(count, hidden);
}

export function confirm_unstar_all_messages(): void {
    const html_body = render_confirm_unstar_all_messages();

    confirm_dialog.launch({
        html_heading: $t_html({defaultMessage: "Unstar all messages"}),
        html_body,
        on_click: message_flags.unstar_all_messages,
    });
}

export function confirm_unstar_all_messages_in_topic(stream_id: number, topic: string): void {
    function on_click(): void {
        message_flags.unstar_all_messages_in_topic(stream_id, topic);
    }

    const stream_name = sub_store.maybe_get_stream_name(stream_id);
    if (stream_name === undefined) {
        return;
    }

    const html_body = render_confirm_unstar_all_messages_in_topic({
        stream_name,
        topic_display_name: util.get_final_topic_display_name(topic),
        is_empty_string_topic: topic === "",
    });

    confirm_dialog.launch({
        html_heading: $t_html({defaultMessage: "Unstar messages in topic"}),
        html_body,
        on_click,
    });
}

export function initialize(): void {
    rerender_ui();
}
```

--------------------------------------------------------------------------------

````

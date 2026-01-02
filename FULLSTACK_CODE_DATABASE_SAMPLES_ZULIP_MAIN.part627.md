---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 627
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 627 of 1290)

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

---[FILE: left_sidebar_navigation_area.ts]---
Location: zulip-main/web/src/left_sidebar_navigation_area.ts

```typescript
import $ from "jquery";
import _ from "lodash";

import * as drafts from "./drafts.ts";
import type {Filter} from "./filter.ts";
import {localstorage} from "./localstorage.ts";
import * as message_reminder from "./message_reminder.ts";
import * as navigation_views from "./navigation_views.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import * as resize from "./resize.ts";
import * as scheduled_messages from "./scheduled_messages.ts";
import * as settings_config from "./settings_config.ts";
import type {NarrowTerm} from "./state_data.ts";
import * as ui_util from "./ui_util.ts";
import * as unread from "./unread.ts";

let last_mention_count = 0;
const ls_key = "left_sidebar_views_state";
const ls = localstorage();

const STATES = {
    EXPANDED: "expanded",
    CONDENSED: "condensed",
};

export function restore_views_state(): void {
    if (page_params.is_spectator) {
        // Spectators should always see the expanded view.
        return;
    }

    const views_state = ls.get(ls_key);
    // Expanded state is default, so we only need to toggle if the state is condensed.
    if (views_state === STATES.CONDENSED) {
        toggle_condensed_navigation_area();
    }
}

function save_state(state: string): void {
    ls.set(ls_key, state);
}

export function update_starred_count(count: number, hidden: boolean): void {
    const $starred_li = $(".top_left_starred_messages");
    ui_util.update_unread_count_in_dom($starred_li, count);

    if (hidden) {
        $starred_li.addClass("hide_starred_message_count");
        return;
    }
    $starred_li.removeClass("hide_starred_message_count");
}

export function update_scheduled_messages_row(): void {
    const $scheduled_li = $(".top_left_scheduled_messages");
    const count = scheduled_messages.get_count();
    $scheduled_li.toggleClass("hidden-by-filters", count === 0);
    ui_util.update_unread_count_in_dom($scheduled_li, count);
}

export function update_reminders_row(): void {
    const $reminders_li = $(".top_left_reminders");
    const count = message_reminder.get_count();
    $reminders_li.toggleClass("hidden-by-filters", count === 0);
    ui_util.update_unread_count_in_dom($reminders_li, count);
}

export let update_dom_with_unread_counts = function (
    counts: unread.FullUnreadCountsData,
    skip_animations: boolean,
): void {
    // Note that direct message counts are handled in pm_list.ts.

    // mentioned/home views have simple integer counts
    const $mentioned_li = $(".top_left_mentions");
    const $home_view_li = $(".selected-home-view");
    const $condensed_view_li = $(".top_left_condensed_unread_marker");
    const $back_to_streams = $("#topics_header");

    ui_util.update_unread_count_in_dom($mentioned_li, counts.mentioned_message_count);
    ui_util.update_unread_count_in_dom($home_view_li, counts.home_unread_messages);
    ui_util.update_unread_count_in_dom($condensed_view_li, counts.home_unread_messages);
    ui_util.update_unread_count_in_dom($back_to_streams, counts.stream_unread_messages);

    if (!skip_animations) {
        animate_unread_changes($mentioned_li, counts.mentioned_message_count, last_mention_count);
    }

    last_mention_count = counts.mentioned_message_count;
};

export function rewire_update_dom_with_unread_counts(
    value: typeof update_dom_with_unread_counts,
): void {
    update_dom_with_unread_counts = value;
}

export let select_top_left_corner_item = function (narrow_to_activate: string): void {
    $(".top-left-active-filter").removeClass("top-left-active-filter");
    if (narrow_to_activate !== "") {
        $(narrow_to_activate).addClass("top-left-active-filter");
    }
};

export function rewire_select_top_left_corner_item(
    func: (narrow_to_activate: string) => void,
): void {
    select_top_left_corner_item = func;
}

export function handle_narrow_activated(filter: Filter): void {
    let terms: NarrowTerm[];
    let filter_name: string;

    // TODO: handle confused filters like "in:all stream:foo"
    terms = filter.terms_with_operator("in");
    if (terms[0] !== undefined) {
        filter_name = terms[0].operand;
        if (filter_name === "home") {
            highlight_all_messages_view();
            return;
        }
    }
    terms = filter.terms_with_operator("is");
    if (terms[0] !== undefined) {
        filter_name = terms[0].operand;
        if (filter_name === "starred") {
            select_top_left_corner_item(".top_left_starred_messages");
            return;
        } else if (filter_name === "mentioned") {
            select_top_left_corner_item(".top_left_mentions");
            return;
        }
    }
    const term_types = filter.sorted_term_types();
    if (
        _.isEqual(term_types, ["sender", "has-reaction"]) &&
        filter.terms_with_operator("sender")[0]!.operand === people.my_current_email()
    ) {
        select_top_left_corner_item(".top_left_my_reactions");
        return;
    }

    // If we don't have a specific handler for this narrow, we just clear all.
    select_top_left_corner_item("");
}

export function expand_views($views_label_container: JQuery, $views_label_icon: JQuery): void {
    $views_label_container.addClass("showing-expanded-navigation");
    $views_label_container.removeClass("showing-condensed-navigation");
    $views_label_icon.addClass("rotate-icon-down");
    $views_label_icon.removeClass("rotate-icon-right");
}

export function collapse_views($views_label_container: JQuery, $views_label_icon: JQuery): void {
    $views_label_container.addClass("showing-condensed-navigation");
    $views_label_container.removeClass("showing-expanded-navigation");
    $views_label_icon.addClass("rotate-icon-right");
    $views_label_icon.removeClass("rotate-icon-down");
}

export function force_expand_views(): void {
    if (page_params.is_spectator) {
        // We don't support collapsing VIEWS for spectators, so exit early.
        return;
    }

    const $views_label_container = $("#views-label-container");
    const $views_label_icon = $("#toggle-top-left-navigation-area-icon");

    if ($views_label_container.hasClass("showing-condensed-navigation")) {
        expand_views($views_label_container, $views_label_icon);
        save_state(STATES.EXPANDED);
        resize.resize_stream_filters_container();
    }
}

export function force_collapse_views(): void {
    if (page_params.is_spectator) {
        // We don't support collapsing VIEWS for spectators, so exit early.
        return;
    }

    const $views_label_container = $("#views-label-container");
    const $views_label_icon = $("#toggle-top-left-navigation-area-icon");

    if ($views_label_container.hasClass("showing-expanded-navigation")) {
        collapse_views($views_label_container, $views_label_icon);
        save_state(STATES.CONDENSED);
        resize.resize_stream_filters_container();
    }
}

function toggle_condensed_navigation_area(): void {
    const $views_label_container = $("#views-label-container");

    if (page_params.is_spectator) {
        // We don't support collapsing VIEWS for spectators, so exit early.
        return;
    }

    if ($views_label_container.hasClass("showing-expanded-navigation")) {
        force_collapse_views();
    } else {
        force_expand_views();
    }
}

export function animate_unread_changes(
    $li: JQuery,
    new_count: number,
    previous_count: number,
): void {
    if (new_count > previous_count) {
        ui_util.do_new_unread_animation($li);
    }
}

export function highlight_inbox_view(): void {
    select_top_left_corner_item(".top_left_inbox");

    setTimeout(() => {
        resize.resize_stream_filters_container();
    }, 0);
}

export function highlight_recent_view(): void {
    select_top_left_corner_item(".top_left_recent_view");

    setTimeout(() => {
        resize.resize_stream_filters_container();
    }, 0);
}

export function highlight_all_messages_view(): void {
    select_top_left_corner_item(".top_left_all_messages");

    setTimeout(() => {
        resize.resize_stream_filters_container();
    }, 0);
}

export function get_view_rows_by_view_name(view: string): JQuery {
    if (view === settings_config.web_home_view_values.all_messages.code) {
        return $(".top_left_all_messages");
    }

    if (view === settings_config.web_home_view_values.recent_topics.code) {
        return $(".top_left_recent_view");
    }

    return $(".top_left_inbox");
}

// Reorder <li> views elements in the DOM based on the current home_view.
// Called twice: on initial page load and when home_view changes.
export function reorder_left_sidebar_navigation_list(home_view: string): void {
    const $left_sidebar = $("#left-sidebar-navigation-list");
    const $left_sidebar_condensed = $("#left-sidebar-navigation-list-condensed");

    // First, re-order the views back to the original default order, to preserve the relative order.
    for (const key of Object.keys(settings_config.web_home_view_values).toReversed()) {
        if (key !== home_view) {
            const $view = get_view_rows_by_view_name(key);
            $view.eq(1).prependTo($left_sidebar);
            $view.eq(0).prependTo($left_sidebar_condensed);
        }
    }

    // Detach the selected home_view and inserts it at the beginning of the navigation list.
    const $selected_home_view = get_view_rows_by_view_name(home_view);
    $selected_home_view.eq(1).prependTo($left_sidebar);
    $selected_home_view.eq(0).prependTo($left_sidebar_condensed);
}

export function handle_home_view_changed(new_home_view: string): void {
    const $current_home_view = $(".selected-home-view");
    const $new_home_view = get_view_rows_by_view_name(new_home_view);
    const res = unread.get_counts();

    // Remove class from current home view
    $current_home_view.removeClass("selected-home-view");

    // Add the class to the matching home view
    $new_home_view.addClass("selected-home-view");

    reorder_left_sidebar_navigation_list(new_home_view);
    update_dom_with_unread_counts(res, true);
}

export function get_built_in_primary_condensed_views(): navigation_views.BuiltInViewMetadata[] {
    function score(view: navigation_views.BuiltInViewMetadata): number {
        if (view.prioritize_in_condensed_view) {
            return 1;
        }
        return 0;
    }
    // Get the top 5 prioritized views.
    return navigation_views
        .get_built_in_views()
        .toSorted((view1, view2) => score(view2) - score(view1))
        .slice(0, 5);
    // TODO: Think about filtering out scheduled message and reminders views with UI to support less than 5 views.
}

export function get_built_in_popover_condensed_views(): navigation_views.BuiltInViewMetadata[] {
    const visible_condensed_views = get_built_in_primary_condensed_views();
    const all_views = navigation_views.get_built_in_views();
    return all_views.filter((view) => {
        if (view.fragment === "scheduled") {
            const scheduled_message_count = scheduled_messages.get_count();
            if (scheduled_message_count === 0) {
                return false;
            }
            view.unread_count = scheduled_message_count;
            return true;
        }
        if (view.fragment === "reminders") {
            const reminders_count = message_reminder.get_count();
            if (reminders_count === 0) {
                return false;
            }
            view.unread_count = reminders_count;
            return true;
        }
        if (view.fragment === "drafts") {
            view.unread_count = drafts.draft_model.getDraftCount();
        }
        // Remove views that are already visible.
        return !visible_condensed_views.some(
            (visible_view) => visible_view.fragment === view.fragment,
        );
    });
}

export function get_built_in_views(): navigation_views.BuiltInViewMetadata[] {
    return navigation_views.get_built_in_views();
}

export function initialize(): void {
    update_reminders_row();
    update_scheduled_messages_row();
    restore_views_state();

    $("body").on(
        "click",
        "#toggle-top-left-navigation-area-icon, #views-label-container .left-sidebar-title",
        (e) => {
            e.stopPropagation();
            toggle_condensed_navigation_area();
        },
    );
}
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_navigation_area_popovers.ts]---
Location: zulip-main/web/src/left_sidebar_navigation_area_popovers.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_left_sidebar_all_messages_popover from "../templates/popovers/left_sidebar/left_sidebar_all_messages_popover.hbs";
import render_left_sidebar_drafts_popover from "../templates/popovers/left_sidebar/left_sidebar_drafts_popover.hbs";
import render_left_sidebar_inbox_popover from "../templates/popovers/left_sidebar/left_sidebar_inbox_popover.hbs";
import render_left_sidebar_recent_view_popover from "../templates/popovers/left_sidebar/left_sidebar_recent_view_popover.hbs";
import render_left_sidebar_starred_messages_popover from "../templates/popovers/left_sidebar/left_sidebar_starred_messages_popover.hbs";
import render_left_sidebar_views_popover from "../templates/popovers/left_sidebar/left_sidebar_views_popover.hbs";

import * as channel from "./channel.ts";
import * as drafts from "./drafts.ts";
import * as left_sidebar_navigation_area from "./left_sidebar_navigation_area.ts";
import * as popover_menus from "./popover_menus.ts";
import * as popovers from "./popovers.ts";
import * as settings_config from "./settings_config.ts";
import * as starred_messages from "./starred_messages.ts";
import * as starred_messages_ui from "./starred_messages_ui.ts";
import * as ui_util from "./ui_util.ts";
import * as unread from "./unread.ts";
import * as unread_ops from "./unread_ops.ts";
import {user_settings} from "./user_settings.ts";

function common_click_handlers(): void {
    $("body").on("click", ".set-home-view", (e) => {
        e.preventDefault();

        const web_home_view = $(e.currentTarget).attr("data-view-code");
        const data = {web_home_view};
        void channel.patch({
            url: "/json/settings",
            data,
        });

        popovers.hide_all();
    });
}
// This callback is called from the popovers on all home views
function register_mark_all_read_handler(
    event: JQuery.ClickEvent<
        tippy.PopperElement,
        {
            instance: tippy.Instance;
        }
    >,
): void {
    const {instance} = event.data;
    unread_ops.confirm_mark_messages_as_read();
    popover_menus.hide_current_popover_if_visible(instance);
}

function register_toggle_unread_message_count(
    event: JQuery.ClickEvent<
        tippy.PopperElement,
        {
            instance: tippy.Instance;
        }
    >,
): void {
    const unread_message_count = user_settings.web_left_sidebar_unreads_count_summary;
    const {instance} = event.data;
    const data = {
        web_left_sidebar_unreads_count_summary: JSON.stringify(!unread_message_count),
    };
    void channel.patch({
        url: "/json/settings",
        data,
    });
    popover_menus.hide_current_popover_if_visible(instance);
}

export function initialize(): void {
    // Starred messages popover
    popover_menus.register_popover_menu(".starred-messages-sidebar-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        onMount(instance) {
            const $popper = $(instance.popper);
            popover_menus.popover_instances.starred_messages = instance;
            assert(instance.reference instanceof HTMLElement);
            ui_util.show_left_sidebar_menu_icon(instance.reference);

            $popper.one("click", "#unstar_all_messages", () => {
                starred_messages_ui.confirm_unstar_all_messages();
                popover_menus.hide_current_popover_if_visible(instance);
            });
            $popper.one("click", "#toggle_display_starred_msg_count", () => {
                const starred_msg_counts = user_settings.starred_message_counts;
                const data = {
                    starred_message_counts: JSON.stringify(!starred_msg_counts),
                };
                void channel.patch({
                    url: "/json/settings",
                    data,
                });
                popover_menus.hide_current_popover_if_visible(instance);
            });
        },
        onShow(instance) {
            popovers.hide_all();
            const show_unstar_all_button = starred_messages.get_count() > 0;

            instance.setContent(
                ui_util.parse_html(
                    render_left_sidebar_starred_messages_popover({
                        show_unstar_all_button,
                        starred_message_counts: user_settings.starred_message_counts,
                    }),
                ),
            );
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.starred_messages = null;
            ui_util.hide_left_sidebar_menu_icon();
        },
    });

    // Drafts popover
    popover_menus.register_popover_menu(".drafts-sidebar-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        onMount(instance) {
            const $popper = $(instance.popper);
            $popper.addClass("drafts-popover");
            popover_menus.popover_instances.drafts = instance;
            assert(instance.reference instanceof HTMLElement);
            ui_util.show_left_sidebar_menu_icon(instance.reference);

            $popper.one("click", "#delete_all_drafts_sidebar", () => {
                drafts.confirm_delete_all_drafts();
                popover_menus.hide_current_popover_if_visible(instance);
            });
        },
        onShow(instance) {
            popovers.hide_all();

            instance.setContent(ui_util.parse_html(render_left_sidebar_drafts_popover({})));
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.drafts = null;
            ui_util.hide_left_sidebar_menu_icon();
        },
    });

    // Inbox popover
    popover_menus.register_popover_menu(".inbox-sidebar-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        onMount(instance) {
            const $popper = $(instance.popper);
            popover_menus.popover_instances.left_sidebar_inbox_popover = instance;
            assert(instance.reference instanceof HTMLElement);
            ui_util.show_left_sidebar_menu_icon(instance.reference);

            $popper.one(
                "click",
                ".mark_all_messages_as_read",
                {instance},
                register_mark_all_read_handler,
            );

            $popper.one(
                "click",
                ".toggle_display_unread_message_count",
                {instance},
                register_toggle_unread_message_count,
            );
        },
        onShow(instance) {
            popovers.hide_all();
            const view_code = settings_config.web_home_view_values.inbox.code;
            const counts = unread.get_counts();
            const unread_messages_present =
                counts.home_unread_messages + counts.muted_topic_unread_messages_count > 0;
            instance.setContent(
                ui_util.parse_html(
                    render_left_sidebar_inbox_popover({
                        is_home_view: user_settings.web_home_view === view_code,
                        view_code,
                        show_unread_count: user_settings.web_left_sidebar_unreads_count_summary,
                        unread_messages_present,
                    }),
                ),
            );
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.left_sidebar_inbox_popover = null;
            ui_util.hide_left_sidebar_menu_icon();
        },
    });

    // Combined feed popover
    popover_menus.register_popover_menu(".all-messages-sidebar-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        onMount(instance) {
            const $popper = $(instance.popper);
            $popper.one(
                "click",
                ".mark_all_messages_as_read",
                {instance},
                register_mark_all_read_handler,
            );

            $popper.one(
                "click",
                ".toggle_display_unread_message_count",
                {instance},
                register_toggle_unread_message_count,
            );
        },
        onShow(instance) {
            popover_menus.popover_instances.left_sidebar_all_messages_popover = instance;
            assert(instance.reference instanceof HTMLElement);
            ui_util.show_left_sidebar_menu_icon(instance.reference);
            popovers.hide_all();
            const view_code = settings_config.web_home_view_values.all_messages.code;
            const counts = unread.get_counts();
            const unread_messages_present =
                counts.home_unread_messages + counts.muted_topic_unread_messages_count > 0;

            instance.setContent(
                ui_util.parse_html(
                    render_left_sidebar_all_messages_popover({
                        is_home_view: user_settings.web_home_view === view_code,
                        view_code,
                        show_unread_count: user_settings.web_left_sidebar_unreads_count_summary,
                        unread_messages_present,
                    }),
                ),
            );
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.left_sidebar_all_messages_popover = null;
            ui_util.hide_left_sidebar_menu_icon();
        },
    });

    // Recent view popover
    popover_menus.register_popover_menu(".recent-view-sidebar-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        onMount(instance) {
            const $popper = $(instance.popper);
            $popper.one(
                "click",
                ".mark_all_messages_as_read",
                {instance},
                register_mark_all_read_handler,
            );

            $popper.one(
                "click",
                ".toggle_display_unread_message_count",
                {instance},
                register_toggle_unread_message_count,
            );
        },
        onShow(instance) {
            popover_menus.popover_instances.left_sidebar_recent_view_popover = instance;
            assert(instance.reference instanceof HTMLElement);
            ui_util.show_left_sidebar_menu_icon(instance.reference);
            popovers.hide_all();
            const view_code = settings_config.web_home_view_values.recent_topics.code;
            const counts = unread.get_counts();
            const unread_messages_present =
                counts.home_unread_messages + counts.muted_topic_unread_messages_count > 0;
            instance.setContent(
                ui_util.parse_html(
                    render_left_sidebar_recent_view_popover({
                        is_home_view: user_settings.web_home_view === view_code,
                        view_code,
                        show_unread_count: user_settings.web_left_sidebar_unreads_count_summary,
                        unread_messages_present,
                    }),
                ),
            );
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.left_sidebar_recent_view_popover = null;
            ui_util.hide_left_sidebar_menu_icon();
        },
    });

    popover_menus.register_popover_menu(".left-sidebar-navigation-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        onMount(instance) {
            const $popper = $(instance.popper);

            $popper.one(
                "click",
                ".mark_all_messages_as_read",
                {instance},
                register_mark_all_read_handler,
            );

            $popper.one(
                "click",
                ".toggle_display_unread_message_count",
                {instance},
                register_toggle_unread_message_count,
            );
        },
        onShow(instance) {
            const built_in_popover_condensed_views =
                left_sidebar_navigation_area.get_built_in_popover_condensed_views();
            const unread_count = unread.get_counts();
            const unread_messages_present = unread_count.home_unread_messages > 0;
            const show_unread_count = user_settings.web_left_sidebar_unreads_count_summary;
            const is_home_view_active = window.location.hash === "#" + user_settings.web_home_view;

            popovers.hide_all();
            instance.setContent(
                ui_util.parse_html(
                    render_left_sidebar_views_popover({
                        views: built_in_popover_condensed_views,
                        is_home_view_active,
                        unread_messages_present,
                        show_unread_count,
                    }),
                ),
            );
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.top_left_sidebar = null;
        },
    });

    common_click_handlers();
}
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_tooltips.ts]---
Location: zulip-main/web/src/left_sidebar_tooltips.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as tippy from "tippy.js";

import * as drafts from "./drafts.ts";
import {$t} from "./i18n.ts";
import * as scheduled_messages from "./scheduled_messages.ts";
import * as settings_data from "./settings_data.ts";
import * as starred_messages from "./starred_messages.ts";
import {
    EXTRA_LONG_HOVER_DELAY,
    LONG_HOVER_DELAY,
    get_tooltip_content,
    topic_visibility_policy_tooltip_props,
} from "./tippyjs.ts";
import * as unread from "./unread.ts";
import {user_settings} from "./user_settings.ts";

export function initialize(): void {
    tippy.delegate("body", {
        target: ".tippy-left-sidebar-tooltip",
        placement: "right",
        delay: EXTRA_LONG_HOVER_DELAY,
        appendTo: () => document.body,
        onShow(instance) {
            const $container = $(instance.popper).find(".views-tooltip-container");
            let display_count = 0;
            const sidebar_option = $container.attr("data-view-code");

            switch (sidebar_option) {
                case user_settings.web_home_view:
                    $container.find(".views-tooltip-home-view-note").removeClass("hide");
                    display_count = unread.get_counts().home_unread_messages;
                    $container.find(".views-message-count").text(
                        $t(
                            {
                                defaultMessage:
                                    "You have {display_count, plural, =0 {no unread messages} one {# unread message} other {# unread messages}}.",
                            },
                            {display_count},
                        ),
                    );
                    break;
                case "mentions":
                    display_count = unread.unread_mentions_counter.size;
                    $container.find(".views-message-count").text(
                        $t(
                            {
                                defaultMessage:
                                    "You have {display_count, plural, =0 {no unread mentions} one {# unread mention} other {# unread mentions}}.",
                            },
                            {display_count},
                        ),
                    );
                    break;
                case "starred_message":
                    display_count = starred_messages.get_count();
                    $container.find(".views-message-count").text(
                        $t(
                            {
                                defaultMessage:
                                    "You have {display_count, plural, =0 {no starred messages} one {# starred message} other {# starred messages}}.",
                            },
                            {display_count},
                        ),
                    );
                    break;
                case "drafts":
                    display_count = drafts.draft_model.getDraftCount();
                    $container.find(".views-message-count").text(
                        $t(
                            {
                                defaultMessage:
                                    "You have {display_count, plural, =0 {no drafts} one {# draft} other {# drafts}}.",
                            },
                            {display_count},
                        ),
                    );
                    break;
                case "scheduled_message":
                    display_count = scheduled_messages.get_count();
                    $container.find(".views-message-count").text(
                        $t(
                            {
                                defaultMessage:
                                    "You have {display_count, plural, =0 {no scheduled messages} one {# scheduled message} other {# scheduled messages}}.",
                            },
                            {display_count},
                        ),
                    );
                    break;
            }

            // Since the tooltip is attached to the anchor tag which doesn't
            // include width of the ellipsis icon, we need to offset the
            // tooltip so that the tooltip is displayed to right of the
            // ellipsis icon.
            if (instance.reference.classList.contains("left-sidebar-navigation-label-container")) {
                instance.setProps({
                    offset: [0, 40],
                });
            }
        },
        onHidden(instance) {
            instance.destroy();
        },
        popperOptions: {
            modifiers: [
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: "bottom",
                    },
                },
            ],
        },
    });

    // Variant of .tippy-left-sidebar-tooltip configuration. Since
    // some elements don't have an always visible label, and
    // thus hovering them is a way to find out what they do, give
    // them the shorter LONG_HOVER_DELAY.
    tippy.delegate("body", {
        target: ".tippy-left-sidebar-tooltip-no-label-delay",
        placement: "right",
        delay: LONG_HOVER_DELAY,
        appendTo: () => document.body,
        popperOptions: {
            modifiers: [
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: "bottom",
                    },
                },
            ],
        },
    });

    tippy.delegate("body", {
        target: ".stream-list-section-container .add-stream-tooltip",
        appendTo: () => document.body,
    });

    tippy.delegate("body", {
        target: "#add_streams_tooltip",
        onShow(instance) {
            const can_create_streams =
                settings_data.user_can_create_private_streams() ||
                settings_data.user_can_create_public_streams() ||
                settings_data.user_can_create_web_public_streams();
            const tooltip_text = can_create_streams
                ? $t({defaultMessage: "Browse or create channels"})
                : $t({defaultMessage: "Browse channels"});
            instance.setContent(tooltip_text);
        },
        appendTo: () => document.body,
    });

    tippy.delegate("body", {
        target: ".views-tooltip-target",
        onShow(instance) {
            if ($("#toggle-top-left-navigation-area-icon").hasClass("rotate-icon-down")) {
                instance.setContent(
                    $t({
                        defaultMessage: "Collapse views",
                    }),
                );
            } else {
                instance.setContent($t({defaultMessage: "Expand views"}));
            }
        },
        delay: EXTRA_LONG_HOVER_DELAY,
        appendTo: () => document.body,
    });

    tippy.delegate("body", {
        target: ".dm-tooltip-target",
        onShow(instance) {
            if ($(".direct-messages-container").hasClass("zoom-in")) {
                return false;
            }

            if ($("#toggle-direct-messages-section-icon").hasClass("rotate-icon-down")) {
                instance.setContent(
                    $t({
                        defaultMessage: "Collapse direct messages",
                    }),
                );
            } else {
                instance.setContent($t({defaultMessage: "Expand direct messages"}));
            }
            return undefined;
        },
        delay: EXTRA_LONG_HOVER_DELAY,
        appendTo: () => document.body,
        onHidden(instance) {
            instance.destroy();
        },
    });

    tippy.delegate("body", {
        target: ".header-main .column-left .left-sidebar-toggle-button",
        delay: LONG_HOVER_DELAY,
        placement: "bottom",
        appendTo: () => document.body,
        onShow(instance) {
            let template = "show-left-sidebar-tooltip-template";
            if ($("#left-sidebar-container").css("display") !== "none") {
                template = "hide-left-sidebar-tooltip-template";
            }
            $(instance.reference).attr("data-tooltip-template-id", template);
            instance.setContent(get_tooltip_content(instance.reference));
        },
        onHidden(instance) {
            instance.destroy();
        },
    });

    tippy.delegate("body", {
        target: [
            "#inbox-view .visibility-policy-indicator .recipient_bar_icon",
            "#left-sidebar-container .visibility-policy-icon",
        ].join(","),
        ...topic_visibility_policy_tooltip_props,
    });

    tippy.delegate("body", {
        target: ".stream-list-section-container .left-sidebar-title",
        delay: LONG_HOVER_DELAY,
        appendTo: () => document.body,
        onShow(instance) {
            const folder_name_element = instance.reference;
            assert(folder_name_element instanceof HTMLElement);

            if (folder_name_element.offsetWidth < folder_name_element.scrollWidth) {
                const folder_name = folder_name_element.textContent ?? "";
                instance.setContent(folder_name);
                return undefined;
            }

            return false;
        },
        onHidden(instance) {
            instance.destroy();
        },
    });
}
```

--------------------------------------------------------------------------------

````

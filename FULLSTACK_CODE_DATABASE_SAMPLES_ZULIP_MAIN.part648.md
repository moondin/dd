---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 648
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 648 of 1290)

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

---[FILE: navigation_views.ts]---
Location: zulip-main/web/src/navigation_views.ts

```typescript
import * as blueslip from "./blueslip.ts";
import {$t} from "./i18n.ts";
import type {NavigationView, StateData} from "./state_data.ts";
import {user_settings} from "./user_settings.ts";

export type BuiltInViewBasicMetadata = {
    fragment: string;
    name: string;
    is_pinned: boolean;
    icon: string;
    css_class_suffix: string;
    tooltip_template_id: string;
    has_unread_count: boolean;
    unread_count_type: "normal-count" | "quiet-count" | "";
    supports_masked_unread: boolean;
    hidden_for_spectators: boolean;
    menu_icon_class: string;
    menu_aria_label: string;
    home_view_code: string;
    prioritize_in_condensed_view: boolean;
};

export const built_in_views_meta_data: Record<string, BuiltInViewBasicMetadata> = {
    inbox: {
        fragment: "inbox",
        name: $t({defaultMessage: "Inbox"}),
        is_pinned: true,
        icon: "zulip-icon-inbox",
        css_class_suffix: "inbox",
        tooltip_template_id: "inbox-tooltip-template",
        has_unread_count: true,
        unread_count_type: "normal-count",
        supports_masked_unread: true,
        hidden_for_spectators: true,
        menu_icon_class: "inbox-sidebar-menu-icon",
        menu_aria_label: $t({defaultMessage: "Inbox options"}),
        home_view_code: "inbox",
        prioritize_in_condensed_view: true,
    },
    recent_view: {
        fragment: "recent",
        name: $t({defaultMessage: "Recent conversations"}),
        is_pinned: true,
        icon: "zulip-icon-recent",
        css_class_suffix: "recent_view",
        tooltip_template_id: "recent-conversations-tooltip-template",
        has_unread_count: true,
        unread_count_type: "normal-count",
        supports_masked_unread: true,
        hidden_for_spectators: false,
        menu_icon_class: "recent-view-sidebar-menu-icon",
        menu_aria_label: $t({defaultMessage: "Recent conversations options"}),
        home_view_code: "recent_topics",
        prioritize_in_condensed_view: true,
    },
    all_messages: {
        fragment: "feed",
        name: $t({defaultMessage: "Combined feed"}),
        is_pinned: true,
        icon: "zulip-icon-all-messages",
        css_class_suffix: "all_messages",
        tooltip_template_id: "all-message-tooltip-template",
        has_unread_count: true,
        unread_count_type: "normal-count",
        supports_masked_unread: true,
        hidden_for_spectators: false,
        menu_icon_class: "all-messages-sidebar-menu-icon",
        menu_aria_label: $t({defaultMessage: "Combined feed options"}),
        home_view_code: "all_messages",
        prioritize_in_condensed_view: true,
    },
    mentions: {
        fragment: "narrow/is/mentioned",
        name: $t({defaultMessage: "Mentions"}),
        is_pinned: true,
        icon: "zulip-icon-at-sign",
        css_class_suffix: "mentions",
        tooltip_template_id: "mentions-tooltip-template",
        has_unread_count: true,
        unread_count_type: "normal-count",
        supports_masked_unread: false,
        hidden_for_spectators: true,
        menu_icon_class: "",
        menu_aria_label: "",
        home_view_code: "",
        prioritize_in_condensed_view: true,
    },
    my_reactions: {
        fragment: "narrow/has/reaction/sender/me",
        name: $t({defaultMessage: "Reactions"}),
        is_pinned: true,
        icon: "zulip-icon-smile",
        css_class_suffix: "my_reactions",
        tooltip_template_id: "my-reactions-tooltip-template",
        has_unread_count: false,
        unread_count_type: "",
        supports_masked_unread: false,
        hidden_for_spectators: true,
        menu_icon_class: "",
        menu_aria_label: "",
        home_view_code: "",
        prioritize_in_condensed_view: false,
    },
    starred_messages: {
        fragment: "narrow/is/starred",
        name: $t({defaultMessage: "Starred messages"}),
        is_pinned: true,
        icon: "zulip-icon-star",
        css_class_suffix: "starred_messages",
        tooltip_template_id: "starred-message-tooltip-template",
        has_unread_count: true,
        unread_count_type: "quiet-count",
        supports_masked_unread: true,
        hidden_for_spectators: true,
        menu_icon_class: "starred-messages-sidebar-menu-icon",
        menu_aria_label: $t({defaultMessage: "Starred messages options"}),
        home_view_code: "",
        prioritize_in_condensed_view: true,
    },
    drafts: {
        fragment: "drafts",
        name: $t({defaultMessage: "Drafts"}),
        is_pinned: true,
        icon: "zulip-icon-drafts",
        css_class_suffix: "drafts",
        tooltip_template_id: "drafts-tooltip-template",
        has_unread_count: true,
        unread_count_type: "quiet-count",
        supports_masked_unread: false,
        hidden_for_spectators: true,
        menu_icon_class: "drafts-sidebar-menu-icon",
        menu_aria_label: $t({defaultMessage: "Drafts options"}),
        home_view_code: "",
        prioritize_in_condensed_view: false,
    },
    scheduled_messages: {
        fragment: "scheduled",
        name: $t({defaultMessage: "Scheduled messages"}),
        is_pinned: true,
        icon: "zulip-icon-calendar-days",
        css_class_suffix: "scheduled_messages",
        tooltip_template_id: "scheduled-tooltip-template",
        has_unread_count: true,
        unread_count_type: "quiet-count",
        supports_masked_unread: false,
        hidden_for_spectators: true,
        menu_icon_class: "",
        menu_aria_label: "",
        home_view_code: "",
        prioritize_in_condensed_view: false,
    },
    reminders: {
        fragment: "reminders",
        name: $t({defaultMessage: "Reminders"}),
        is_pinned: true,
        icon: "zulip-icon-alarm-clock",
        css_class_suffix: "reminders",
        tooltip_template_id: "reminders-tooltip-template",
        has_unread_count: true,
        unread_count_type: "quiet-count",
        supports_masked_unread: false,
        hidden_for_spectators: true,
        menu_icon_class: "",
        menu_aria_label: "",
        home_view_code: "",
        prioritize_in_condensed_view: false,
    },
};

let navigation_views_dict: Map<string, NavigationView>;

export function add_navigation_view(navigation_view: NavigationView): void {
    navigation_views_dict.set(navigation_view.fragment, navigation_view);
}

export function update_navigation_view(fragment: string, data: Partial<NavigationView>): void {
    const view = get_navigation_view_by_fragment(fragment);
    if (view) {
        navigation_views_dict.set(fragment, {
            ...view,
            ...data,
        });
    } else {
        blueslip.error("Cannot find navigation view to update");
    }
}

export function remove_navigation_view(fragment: string): void {
    navigation_views_dict.delete(fragment);
}

export function get_navigation_view_by_fragment(fragment: string): NavigationView | undefined {
    return navigation_views_dict.get(fragment);
}

export type BuiltInViewMetadata = BuiltInViewBasicMetadata & {
    is_home_view: boolean;
    unread_count?: number;
};

export function get_built_in_views(): BuiltInViewMetadata[] {
    return Object.values(built_in_views_meta_data).map((view) => {
        const view_current_data = get_navigation_view_by_fragment(view.fragment);
        return {
            ...view,
            is_pinned: view_current_data?.is_pinned ?? view.is_pinned,
            is_home_view: view.home_view_code === user_settings.web_home_view,
        };
    });
}

export function get_all_navigation_views(): NavigationView[] {
    const built_in_views = get_built_in_views().map((view) => ({
        fragment: view.fragment,
        is_pinned: view.is_pinned,
        name: view.name,
    }));
    const built_in_fragments = new Set(built_in_views.map((view) => view.fragment));
    const custom_views = [...navigation_views_dict.values()].filter(
        (view) => !built_in_fragments.has(view.fragment),
    );

    return [...built_in_views, ...custom_views];
}

export const initialize = (params: StateData["navigation_views"]): void => {
    navigation_views_dict = new Map<string, NavigationView>(
        params.navigation_views.map((view) => [view.fragment, view]),
    );
};
```

--------------------------------------------------------------------------------

---[FILE: onboarding_steps.ts]---
Location: zulip-main/web/src/onboarding_steps.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as z from "zod/mini";

import render_navigation_tour_video_modal from "../templates/navigation_tour_video_modal.hbs";

import * as channel from "./channel.ts";
import * as compose_recipient from "./compose_recipient.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t, $t_html} from "./i18n.ts";
import type * as message_view from "./message_view.ts";
import * as people from "./people.ts";
import type {StateData, onboarding_step_schema} from "./state_data.ts";
import * as util from "./util.ts";

export type OnboardingStep = z.output<typeof onboarding_step_schema>;

export const ONE_TIME_NOTICES_TO_DISPLAY = new Set<string>();

const MAX_RETRIES = 5;

export function post_onboarding_step_as_read(
    onboarding_step_name: string,
    schedule_navigation_tour_video_reminder_delay?: number,
    attempt = 1,
): void {
    if (attempt > MAX_RETRIES) {
        return;
    }

    const data: {onboarding_step: string; schedule_navigation_tour_video_reminder_delay?: number} =
        {
            onboarding_step: onboarding_step_name,
        };
    if (schedule_navigation_tour_video_reminder_delay !== undefined) {
        assert(onboarding_step_name === "navigation_tour_video");
        data.schedule_navigation_tour_video_reminder_delay =
            schedule_navigation_tour_video_reminder_delay;
    }
    void channel.post({
        url: "/json/users/me/onboarding_steps",
        data,
        error(xhr) {
            if (xhr.status === 400) {
                // Bad request: Codepath calling this function supplied
                // invalid 'onboarding_step_name' (almost negligible chance
                // because it's not user input) - but no point of retrying
                // in that case.
                return;
            }

            const retry_delay_secs = util.get_retry_backoff_seconds(xhr, attempt);
            setTimeout(() => {
                post_onboarding_step_as_read(
                    onboarding_step_name,
                    schedule_navigation_tour_video_reminder_delay,
                    attempt + 1,
                );
            }, retry_delay_secs * 1000);
        },
    });
}

export function update_onboarding_steps_to_display(onboarding_steps: OnboardingStep[]): void {
    ONE_TIME_NOTICES_TO_DISPLAY.clear();

    for (const onboarding_step of onboarding_steps) {
        if (onboarding_step.type === "one_time_notice") {
            ONE_TIME_NOTICES_TO_DISPLAY.add(onboarding_step.name);
        }
    }
}

function narrow_to_dm_with_welcome_bot_new_user(
    onboarding_steps: OnboardingStep[],
    show_message_view: typeof message_view.show,
): void {
    if (
        onboarding_steps.some(
            (onboarding_step) => onboarding_step.name === "narrow_to_dm_with_welcome_bot_new_user",
        )
    ) {
        show_message_view(
            [
                {
                    operator: "dm",
                    operand: people.WELCOME_BOT.email,
                },
            ],
            {trigger: "sidebar"},
        );
        post_onboarding_step_as_read("narrow_to_dm_with_welcome_bot_new_user");
    }
}

function show_navigation_tour_video(navigation_tour_video_url: string | null): void {
    if (ONE_TIME_NOTICES_TO_DISPLAY.has("navigation_tour_video")) {
        assert(navigation_tour_video_url !== null);
        const html_body = render_navigation_tour_video_modal({
            video_src: navigation_tour_video_url,
            poster_src: "/static/images/navigation-tour-video-thumbnail.png",
        });
        let watch_later_clicked = false;
        dialog_widget.launch({
            html_heading: $t_html({defaultMessage: "Welcome to Zulip!"}),
            html_body,
            on_click() {
                // Do nothing
            },
            html_submit_button: $t_html({defaultMessage: "Skip video — I'm familiar with Zulip"}),
            html_exit_button: $t_html({defaultMessage: "Watch later"}),
            close_on_submit: true,
            id: "navigation-tour-video-modal",
            footer_minor_text: $t({defaultMessage: "Tip: You can watch this video without sound."}),
            close_on_overlay_click: false,
            post_render() {
                const $watch_later_button = $("#navigation-tour-video-modal .dialog_exit_button");
                $watch_later_button.on("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Schedule a reminder message for a few hours from now.
                    const reminder_delay_seconds = 2 * 60 * 60;
                    post_onboarding_step_as_read("navigation_tour_video", reminder_delay_seconds);
                    watch_later_clicked = true;
                    dialog_widget.close();
                });

                const $skip_video_button = $("#navigation-tour-video-modal .dialog_submit_button");
                $skip_video_button
                    .removeClass("dialog_submit_button")
                    .addClass("dialog_exit_button");
                $skip_video_button.css({"margin-left": "12px"});

                const $video = $<HTMLVideoElement>("#navigation-tour-video");
                $video.on("play", () => {
                    // Remove the custom play button overlaying the video.
                    $("#navigation-tour-video-wrapper").addClass("hide-play-button");
                });

                let skip_video_button_text_updated = false;
                let video_ended_button_visible = false;
                $video.on("timeupdate", () => {
                    const $video_elem = util.the($video);
                    const current_time = $video_elem.currentTime;
                    if (!skip_video_button_text_updated && current_time >= 30) {
                        $skip_video_button.text($t({defaultMessage: "Skip the rest"}));
                        skip_video_button_text_updated = true;
                    }
                    if (video_ended_button_visible && current_time < $video_elem.duration) {
                        $("#navigation-tour-video-ended-button-wrapper").css(
                            "visibility",
                            "hidden",
                        );
                        video_ended_button_visible = false;
                        $video.removeClass("dimmed-background");
                    }
                });

                $video.on("ended", () => {
                    $("#navigation-tour-video-ended-button-wrapper").css("visibility", "visible");
                    video_ended_button_visible = true;
                    $video.addClass("dimmed-background");
                    $skip_video_button.css("visibility", "hidden");
                    $watch_later_button.css("visibility", "hidden");
                    // Exit fullscreen to make the 'video-ended-button-wrapper' button visible.
                    const $video_elem = util.the($video);
                    if (document.fullscreenElement === $video_elem) {
                        void document.exitFullscreen();
                    }
                });

                $("#navigation-tour-video-ended-button").on("click", () => {
                    dialog_widget.close();
                });
            },
            on_hide() {
                // `narrow_to_dm_with_welcome_bot_new_user` triggers a focus change from
                // #compose_recipient_box to #compose-textarea (see `compose_actions.show_compose_box`
                // with `opts.defer_focus = true`). We start initializing this modal while the
                // focus transition is in progress, resulting in a flaky behaviour of the
                // element that will be in focus when modal is closed.
                //
                // We explicitly set the focus to #compose-textarea to avoid flaky nature.
                $("textarea#compose-textarea").trigger("focus");
                compose_recipient.update_recipient_row_attention_level();

                if (!watch_later_clicked) {
                    // $watch_later_button click handler already calls this function.
                    post_onboarding_step_as_read("navigation_tour_video");
                }
            },
        });
    }
}

export function initialize(
    params: StateData["onboarding_steps"],
    {show_message_view}: {show_message_view: typeof message_view.show},
): void {
    update_onboarding_steps_to_display(params.onboarding_steps);
    narrow_to_dm_with_welcome_bot_new_user(params.onboarding_steps, show_message_view);
    show_navigation_tour_video(params.navigation_tour_video_url);
}
```

--------------------------------------------------------------------------------

---[FILE: overlays.ts]---
Location: zulip-main/web/src/overlays.ts

```typescript
import $ from "jquery";

import * as blueslip from "./blueslip.ts";
import * as mouse_drag from "./mouse_drag.ts";
import * as overlay_util from "./overlay_util.ts";

type Hook = () => void;

type OverlayOptions = {
    name: string;
    $overlay: JQuery;
    on_close: () => void;
};

type Overlay = {
    $element: JQuery;
    close_handler: () => void;
};

let active_overlay: Overlay | undefined;
let open_overlay_name: string | undefined;

const pre_open_hooks: Hook[] = [];
const pre_close_hooks: Hook[] = [];

function reset_state(): void {
    active_overlay = undefined;
    open_overlay_name = undefined;
}

export function register_pre_open_hook(func: Hook): void {
    pre_open_hooks.push(func);
}

export function register_pre_close_hook(func: Hook): void {
    pre_close_hooks.push(func);
}

function call_hooks(func_list: Hook[]): void {
    for (const element of func_list) {
        element();
    }
}

export function any_active(): boolean {
    return Boolean(open_overlay_name);
}

export function info_overlay_open(): boolean {
    return open_overlay_name === "informationalOverlays";
}

export function settings_open(): boolean {
    return open_overlay_name === "settings";
}

export function streams_open(): boolean {
    return open_overlay_name === "subscriptions";
}

export function groups_open(): boolean {
    return open_overlay_name === "group_subscriptions";
}

export function lightbox_open(): boolean {
    return open_overlay_name === "lightbox";
}

export function drafts_open(): boolean {
    return open_overlay_name === "drafts";
}

export function scheduled_messages_open(): boolean {
    return open_overlay_name === "scheduled";
}

export function reminders_open(): boolean {
    return open_overlay_name === "reminders";
}

export function message_edit_history_open(): boolean {
    return open_overlay_name === "message_edit_history";
}

export function open_overlay(opts: OverlayOptions): void {
    call_hooks(pre_open_hooks);

    if (!opts.name || !opts.$overlay || !opts.on_close) {
        blueslip.error("Programming error in open_overlay");
        return;
    }

    if (active_overlay !== undefined || open_overlay_name) {
        blueslip.error("Programming error - trying to open overlay before closing other", {
            name: opts.name,
            open_overlay_name,
        });
        return;
    }

    blueslip.debug("open overlay: " + opts.name);

    // Our overlays are kind of crufty...we have an HTML id
    // attribute for them and then a data-overlay attribute for
    // them.  Make sure they match.
    if (opts.$overlay.attr("data-overlay") !== opts.name) {
        blueslip.error("Bad overlay setup for " + opts.name);
        return;
    }

    open_overlay_name = opts.name;
    active_overlay = {
        $element: opts.$overlay,
        close_handler() {
            opts.on_close();
            reset_state();
        },
    };
    if (document.activeElement) {
        $(document.activeElement).trigger("blur");
    }
    overlay_util.disable_scrolling();
    opts.$overlay.addClass("show");
    opts.$overlay.attr("aria-hidden", "false");
    $(".app").attr("aria-hidden", "true");
    $("#navbar-fixed-container").attr("aria-hidden", "true");
}

export function close_overlay(name: string): void {
    call_hooks(pre_close_hooks);

    if (name !== open_overlay_name) {
        blueslip.error("Trying to close overlay with another open", {name, open_overlay_name});
        return;
    }

    if (name === undefined) {
        blueslip.error("Undefined name was passed into close_overlay");
        return;
    }

    if (active_overlay === undefined) {
        blueslip.error("close_overlay called without checking any_active()");
        return;
    }

    blueslip.debug("close overlay: " + name);
    active_overlay.$element.removeClass("show");

    active_overlay.$element.attr("aria-hidden", "true");
    $(".app").attr("aria-hidden", "false");
    $("#navbar-fixed-container").attr("aria-hidden", "false");

    // Prevent a bug where a blank settings section appears
    // when the settings panel is reopened.
    $(".settings-section").removeClass("show");

    active_overlay.close_handler();
    overlay_util.enable_scrolling();
}

export function close_active(): void {
    if (!open_overlay_name) {
        blueslip.warn("close_active() called without checking any_active()");
        return;
    }

    close_overlay(open_overlay_name);
}

export function close_for_hash_change(): void {
    if (open_overlay_name) {
        close_overlay(open_overlay_name);
    }
}

export function initialize(): void {
    $("body").on("click", "div.overlay, div.overlay .exit", (e) => {
        let $target = $(e.target);

        if (mouse_drag.is_drag(e)) {
            return;
        }

        // if the target is not the div.overlay element, search up the node tree
        // until it is found.
        if ($target.is(".exit, .exit-sign, .overlay-content, .exit span")) {
            $target = $target.closest("[data-overlay]");
        } else if (!$target.is("div.overlay")) {
            // not a valid click target then.
            return;
        }

        if ($target.data("noclose")) {
            // This overlay has been marked explicitly to not be closed.
            return;
        }

        const target_name = $target.attr("data-overlay")!;

        close_overlay(target_name);

        e.preventDefault();
        e.stopPropagation();
    });
}

export function trap_focus_for_settings_overlay(): void {
    $("#settings_overlay_container").on("keydown", (e) => {
        if (e.key !== "Tab") {
            return;
        }

        const two_column_mode =
            Number.parseInt($("#settings_content").css("--column-count"), 10) === 2;
        const $settings_overlay_container = $("#settings_overlay_container");
        let visible_focusable_elements;
        if (two_column_mode) {
            visible_focusable_elements =
                overlay_util.get_visible_focusable_elements_in_overlay_container(
                    $settings_overlay_container,
                );
        } else {
            const $right_section = $settings_overlay_container.find(".content-wrapper");
            const $left_section = $settings_overlay_container.find(".sidebar-wrapper");
            if ($right_section.hasClass("show")) {
                const $settings_panel = $right_section.find(".settings-section.show");
                visible_focusable_elements =
                    overlay_util.get_visible_focusable_elements_in_overlay_container(
                        $settings_panel,
                    );
            } else {
                visible_focusable_elements =
                    overlay_util.get_visible_focusable_elements_in_overlay_container($left_section);
            }
        }

        if (visible_focusable_elements.length === 0) {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === visible_focusable_elements[0]) {
                e.preventDefault();
                visible_focusable_elements.at(-1)!.focus();
            }
        } else {
            if (document.activeElement === visible_focusable_elements.at(-1)) {
                e.preventDefault();
                visible_focusable_elements[0]!.focus();
            }
        }
    });

    $("#channels_overlay_container, #groups_overlay_container").on("keydown", (e) => {
        if (e.key !== "Tab") {
            return;
        }

        const $overlay = $(e.currentTarget);
        const two_column_mode =
            Number.parseInt(
                $overlay.find(".two-pane-settings-container").css("--column-count"),
                10,
            ) === 2;
        let visible_focusable_elements;
        if (two_column_mode) {
            visible_focusable_elements =
                overlay_util.get_visible_focusable_elements_in_overlay_container($overlay);
        } else {
            const $right_section = $overlay.find(".right");
            const $left_section = $overlay.find(".left");
            if ($right_section.hasClass("show")) {
                visible_focusable_elements =
                    overlay_util.get_visible_focusable_elements_in_overlay_container(
                        $right_section,
                    );
            } else {
                visible_focusable_elements =
                    overlay_util.get_visible_focusable_elements_in_overlay_container($left_section);
            }
        }

        if (visible_focusable_elements.length === 0) {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === visible_focusable_elements[0]) {
                e.preventDefault();
                visible_focusable_elements.at(-1)!.focus();
            }
        } else {
            if (document.activeElement === visible_focusable_elements.at(-1)) {
                e.preventDefault();
                visible_focusable_elements[0]!.focus();
            }
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: overlay_util.ts]---
Location: zulip-main/web/src/overlay_util.ts

```typescript
import $ from "jquery";

export function disable_scrolling(): void {
    // Why disable scrolling?
    // Since fixed / absolute positioned elements don't capture the scroll event unless
    // they overflow their defined container. Since fixed / absolute elements are not treated
    // as part of the document flow, we cannot capture `scroll` events on them and prevent propagation
    // as event bubbling doesn't work naturally.
    const scrollbar_width = window.innerWidth - document.documentElement.clientWidth;
    $(":root").css({"overflow-y": "hidden", "--disabled-scrollbar-width": `${scrollbar_width}px`});
}

export function enable_scrolling(): void {
    $(":root").css({"overflow-y": "scroll", "--disabled-scrollbar-width": "0px"});
}

export function get_visible_focusable_elements_in_overlay_container(
    $container: JQuery,
): HTMLElement[] {
    const visible_focusable_elements = [
        ...$container.find(
            "input, button, select, .input, .sidebar-item, .ind-tab.first, a[href], a[tabindex='0']",
        ),
    ].filter(
        (element) =>
            element.getClientRects().length > 0 && $(element).css("visibility") !== "hidden",
    );
    return visible_focusable_elements;
}
```

--------------------------------------------------------------------------------

---[FILE: padded_widget.ts]---
Location: zulip-main/web/src/padded_widget.ts

```typescript
import $ from "jquery";

export function update_padding(opts: {
    content_selector: string;
    padding_selector: string;
    total_rows: number;
    shown_rows: number;
}): void {
    const $content = $(opts.content_selector);
    const $padding = $(opts.padding_selector);
    const total_rows = opts.total_rows;
    const shown_rows = opts.shown_rows;
    const hidden_rows = total_rows - shown_rows;

    if (shown_rows === 0) {
        $padding.height(0);
        return;
    }

    const ratio = hidden_rows / shown_rows;

    const content_height = $content.height();
    if (content_height === undefined) {
        return;
    }

    const new_padding_height = ratio * content_height;

    $padding.height(new_padding_height);
    $padding.width(1);
}
```

--------------------------------------------------------------------------------

---[FILE: page_params.ts]---
Location: zulip-main/web/src/page_params.ts

```typescript
import assert from "minimalistic-assert";

import {page_params as base_page_params} from "./base_page_params.ts";

assert(base_page_params.page_type === "home");

// We need to export with a narrowed TypeScript type.
// eslint-disable-next-line unicorn/prefer-export-from
export const page_params = base_page_params;
```

--------------------------------------------------------------------------------

---[FILE: password_quality.ts]---
Location: zulip-main/web/src/password_quality.ts

```typescript
import {zxcvbn, zxcvbnOptions} from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

import {$t} from "./i18n.ts";

zxcvbnOptions.setOptions({
    translations: zxcvbnEnPackage.translations,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
});

// Note: this module is loaded asynchronously from the app with
// import() to keep zxcvbn out of the initial page load.  Do not
// import it synchronously from the app.

// Return a boolean indicating whether the password is acceptable.
// Also updates a Bootstrap progress bar control (a jQuery object)
// if provided.
export function password_quality(
    password: string,
    $bar: JQuery | undefined,
    $password_field: JQuery,
): boolean {
    const min_length = Number($password_field.attr("data-min-length"));
    const max_length = Number($password_field.attr("data-max-length"));
    const min_guesses = Number($password_field.attr("data-min-guesses"));

    const result = zxcvbn(password);
    const acceptable =
        password.length >= min_length &&
        password.length <= max_length &&
        result.guesses >= min_guesses;

    if ($bar !== undefined) {
        const t = result.crackTimesSeconds.offlineSlowHashing1e4PerSecond;
        let bar_progress = Math.min(1, Math.log(1 + t) / 22);

        // Even if zxcvbn loves your short password, the bar should be
        // filled at most 1/3 of the way, because we won't accept it.
        if (!acceptable) {
            bar_progress = Math.min(bar_progress, 0.33);
        }

        // The bar bottoms out at 10% so there's always something
        // for the user to see.
        $bar.width(`${90 * bar_progress + 10}%`)
            .removeClass("bar-success bar-danger")
            .addClass(acceptable ? "bar-success" : "bar-danger");
    }

    return acceptable;
}

export function password_warning(password: string, $password_field: JQuery): string {
    const min_length = Number($password_field.attr("data-min-length"));
    const max_length = Number($password_field.attr("data-max-length"));

    if (password.length < min_length) {
        return $t(
            {defaultMessage: "Password should be at least {length} characters long."},
            {length: min_length},
        );
    } else if (password.length > max_length) {
        return $t(
            {
                defaultMessage: "Maximum password length: {max} characters.",
            },
            {max: max_length},
        );
    }
    return zxcvbn(password).feedback.warning ?? $t({defaultMessage: "Password is too weak."});
}
```

--------------------------------------------------------------------------------

````

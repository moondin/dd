---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 590
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 590 of 1290)

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

---[FILE: bulleted_numbered_list_util.ts]---
Location: zulip-main/web/src/bulleted_numbered_list_util.ts

```typescript
export const get_last_line = (text: string): string => text.slice(text.lastIndexOf("\n") + 1);

export const is_bulleted = (line: string): boolean =>
    line.startsWith("- ") || line.startsWith("* ") || line.startsWith("+ ");

// testing against regex for string with numbered syntax, that is,
// any string starting with digit/s followed by a period and space
export const is_numbered = (line: string): boolean => /^\d+\. /.test(line);

export const strip_bullet = (line: string): string => line.slice(2);

export const strip_numbering = (line: string): string => line.slice(line.indexOf(" ") + 1);
```

--------------------------------------------------------------------------------

---[FILE: buttons.ts]---
Location: zulip-main/web/src/buttons.ts

```typescript
import $ from "jquery";

import * as loading from "./loading.ts";
import {COMPONENT_INTENT_VALUES} from "./types.ts";
import type {ComponentIntent} from "./types.ts";

export const ACTION_BUTTON_ATTENTION_VALUES = ["primary", "quiet", "borderless"] as const;

export type ActionButtonAttention = (typeof ACTION_BUTTON_ATTENTION_VALUES)[number];

export type ActionButton = {
    attention: ActionButtonAttention;
    intent?: ComponentIntent;
    label?: string;
    icon?: string;
    id?: string;
    custom_classes?: string;
};

let loading_indicator_count = 0;
export function show_button_loading_indicator($button: JQuery): void {
    // If the button already has a loading indicator, do nothing.
    if ($button.find(".button-loading-indicator").length > 0) {
        return;
    }
    // First, we hide the current content of the button.
    $button.find(".zulip-icon").css("visibility", "hidden");
    $button.find(".action-button-label").css("visibility", "hidden");
    // Next, we create a loading indicator with a unique id.
    // The unique id is required for the `filter` element in the loader SVG,
    // to prevent the loading indicator from being hidden due to duplicate ids.
    // Reference commit: 995d073dbfd8f22a2ef50c1320e3b1492fd28649
    const loading_indicator_unique_id = `button-loading-indicator-${loading_indicator_count}`;
    loading_indicator_count += 1;
    const $button_loading_indicator = $("<span>")
        .attr("id", loading_indicator_unique_id)
        .addClass("button-loading-indicator");
    requestAnimationFrame(() => {
        // We want this to happen in the same animation frame to
        // avoid showing a non spinning loading indicator.
        $button.append($button_loading_indicator);
        loading.make_indicator($button_loading_indicator, {
            width: $button.width(),
            height: $button.height(),
        });
    });
}

export function hide_button_loading_indicator($button: JQuery): void {
    $button.find(".button-loading-indicator").remove();
    $button.prop("disabled", false);
    $button.find(".zulip-icon").css("visibility", "visible");
    $button.find(".action-button-label").css("visibility", "visible");
}

export function modify_action_button_style(
    $button: JQuery,
    opts: {
        attention?: ActionButtonAttention;
        intent?: ComponentIntent;
    },
): void {
    if (opts.attention === undefined && opts.intent === undefined) {
        // If neither attention nor intent is provided, do nothing.
        return;
    }
    const action_button_attention_pattern = ACTION_BUTTON_ATTENTION_VALUES.join("|");
    const component_intent_pattern = COMPONENT_INTENT_VALUES.join("|");
    const action_button_style_regex = new RegExp(
        `action-button-(${action_button_attention_pattern})-(${component_intent_pattern})`,
    );
    const action_button_style_regex_match = $button.attr("class")?.match(action_button_style_regex);
    if (!action_button_style_regex_match) {
        // If the button doesn't have the expected class, do nothing.
        return;
    }
    const [action_button_style_class, old_attention, old_intent] = action_button_style_regex_match;
    // Replace the old attention and intent values with the new ones, if provided.
    $button.removeClass(action_button_style_class);
    $button.addClass(
        `action-button-${opts.attention ?? old_attention}-${opts.intent ?? old_intent}`,
    );
}
```

--------------------------------------------------------------------------------

---[FILE: channel.ts]---
Location: zulip-main/web/src/channel.ts
Signals: Zod

```typescript
import * as Sentry from "@sentry/browser";
import $ from "jquery";
import _ from "lodash";
import * as z from "zod/mini";

import {page_params} from "./base_page_params.ts";
import * as blueslip from "./blueslip.ts";
import * as reload_state from "./reload_state.ts";
import {normalize_path, shouldCreateSpanForRequest} from "./sentry.ts";
import * as spectators from "./spectators.ts";

// We omit `success` handler from original `AjaxSettings` type because it types
// the `data` parameter as `any` type and we want to avoid that.
type AjaxRequestHandlerOptions = Omit<JQuery.AjaxSettings, "success"> & {
    url: string;
    ignore_reload?: boolean;
    success?:
        | ((
              data: unknown,
              textStatus: JQuery.Ajax.SuccessTextStatus,
              jqXHR: JQuery.jqXHR<unknown>,
          ) => void)
        | undefined;
    error?: JQuery.Ajax.ErrorCallback<unknown>;
};

export type AjaxRequestHandler = typeof call;

let password_change_in_progress = false;
export let password_changes = 0;

export function set_password_change_in_progress(value: boolean): void {
    password_change_in_progress = value;
    if (!value) {
        password_changes += 1;
    }
}

function call(args: AjaxRequestHandlerOptions): JQuery.jqXHR<unknown> | undefined {
    if (reload_state.is_in_progress() && !args.ignore_reload) {
        // If we're in the process of reloading, most HTTP requests
        // are useless, with exceptions like cleaning up our event
        // queue and blueslip (Which doesn't use channel.js).
        return undefined;
    }

    const txn_title = `call ${args.type} ${normalize_path(args.url)}`;
    const span_data = {
        op: "function",
        data: {
            url: args.url,
            method: args.type,
        },
    };
    /* istanbul ignore if */
    if (!shouldCreateSpanForRequest(args.url)) {
        return call_in_span(undefined, args);
    }
    return Sentry.startSpanManual({...span_data, name: txn_title}, (span) => {
        try {
            return call_in_span(span, args);
        } catch (error) /* istanbul ignore next */ {
            span?.end();
            throw error;
        }
    });
}

function call_in_span(
    span: Sentry.Span | undefined,
    args: AjaxRequestHandlerOptions,
): JQuery.jqXHR<unknown> {
    // Remember the number of completed password changes when the
    // request was initiated. This allows us to detect race
    // situations where a password change occurred before we got a
    // response that failed due to the ongoing password change.
    const orig_password_changes = password_changes;

    // Wrap the error handlers to reload the page if we get a CSRF error
    // (What probably happened is that the user logged out in another tab).
    const orig_error =
        args.error ??
        (() => {
            // Ignore errors by default
        });
    args.error = function wrapped_error(xhr, error_type, xhn) {
        /* istanbul ignore if */
        if (span !== undefined) {
            Sentry.setHttpStatus(span, xhr.status);
            span.end();
        }
        if (reload_state.is_in_progress()) {
            // If we're in the process of reloading the browser,
            // there's no point in running the error handler,
            // because all of our state is about to be discarded
            // anyway.
            blueslip.log(`Ignoring ${args.type} ${args.url} error response while reloading`);
            return;
        }

        if (xhr.status === 401) {
            if (password_change_in_progress || orig_password_changes !== password_changes) {
                // The backend for handling password change API requests
                // will replace the user's session; this results in a
                // brief race where any API request will fail with a 401
                // error after the old session is deactivated but before
                // the new one has been propagated to the browser.  So we
                // skip our normal HTTP 401 error handling if we're in the
                // process of executing a password change.
                return;
            }

            if (page_params.page_type === "home" && page_params.is_spectator) {
                // In theory, the spectator implementation should be
                // designed to prevent accessing widgets that would
                // make network requests not available to spectators.
                //
                // In the case that we have a bug in that logic, we
                // prefer the user experience of offering the
                // login_to_access widget over reloading the page.
                spectators.login_to_access();
            } else if (page_params.page_type === "home") {
                // We got logged out somehow, perhaps from another window
                // changing the user's password, or a session timeout.  We
                // could display an error message, but jumping right to
                // the login page conveys the same information with a
                // smoother relogin experience.
                window.location.replace(page_params.login_page);
                return;
            }
        } else if (xhr.status === 403) {
            if (xhr.responseJSON === undefined) {
                blueslip.error("Unexpected 403 response from server", {
                    xhr: xhr.responseText,
                    args,
                });
            } else if (
                z.object({code: z.literal("CSRF_FAILED")}).safeParse(xhr.responseJSON).success &&
                reload_state.csrf_failed_handler !== undefined
            ) {
                reload_state.csrf_failed_handler();
            }
        }
        orig_error(xhr, error_type, xhn);
    };

    const orig_success =
        args.success ??
        (() => {
            // Do nothing by default
        });
    args.success = function wrapped_success(data, textStatus, jqXHR) {
        /* istanbul ignore if */
        if (span !== undefined) {
            Sentry.setHttpStatus(span, jqXHR.status);
            span.end();
        }
        if (reload_state.is_in_progress()) {
            // If we're in the process of reloading the browser,
            // there's no point in running the success handler,
            // because all of our state is about to be discarded
            // anyway.
            blueslip.log(`Ignoring ${args.type} ${args.url} response while reloading`);
            return;
        }

        orig_success(data, textStatus, jqXHR);
    };

    return $.ajax(args);
}

export function get(options: AjaxRequestHandlerOptions): JQuery.jqXHR<unknown> | undefined {
    const args = {type: "GET", dataType: "json", ...options};
    return call(args);
}

export function post(options: AjaxRequestHandlerOptions): JQuery.jqXHR<unknown> | undefined {
    const args = {type: "POST", dataType: "json", ...options};
    return call(args);
}

export function put(options: AjaxRequestHandlerOptions): JQuery.jqXHR<unknown> | undefined {
    const args = {type: "PUT", dataType: "json", ...options};
    return call(args);
}

// Not called exports.delete because delete is a reserved word in JS
export function del(options: AjaxRequestHandlerOptions): JQuery.jqXHR<unknown> | undefined {
    const args = {type: "DELETE", dataType: "json", ...options};
    return call(args);
}

export function patch(options: AjaxRequestHandlerOptions): JQuery.jqXHR<unknown> | undefined {
    const args = {type: "PATCH", dataType: "json", ...options};
    return call(args);
}

export function xhr_error_message(message: string, xhr: JQuery.jqXHR<unknown>): string {
    let parsed;
    if (
        xhr.status >= 400 &&
        xhr.status < 500 &&
        (parsed = z.object({msg: z.string()}).safeParse(xhr.responseJSON)).success
    ) {
        // Only display the error response for 4XX, where we've crafted
        // a nice response.
        const server_response_html = _.escape(parsed.data.msg);
        if (message) {
            message += ": " + server_response_html;
        } else {
            message = server_response_html;
        }
    }

    return message;
}
```

--------------------------------------------------------------------------------

---[FILE: channel_folders.ts]---
Location: zulip-main/web/src/channel_folders.ts
Signals: Zod

```typescript
import assert from "minimalistic-assert";
import type * as z from "zod/mini";

import {FoldDict} from "./fold_dict.ts";
import type {ChannelFolderUpdateEvent} from "./server_event_types.ts";
import type {StateData, channel_folder_schema} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import type {StreamSubscription} from "./sub_store.ts";
import * as util from "./util.ts";

export type ChannelFolder = z.infer<typeof channel_folder_schema>;

let channel_folder_name_dict: FoldDict<ChannelFolder>;
let channel_folder_by_id_dict: Map<number, ChannelFolder>;
let active_channel_folder_ids: Set<number>;

function compare_by_name(a: StreamSubscription, b: StreamSubscription): number {
    return util.strcmp(a.name, b.name);
}

export function clean_up_description(channel_folder: ChannelFolder): void {
    if (channel_folder.rendered_description !== undefined) {
        channel_folder.rendered_description = channel_folder.rendered_description
            .replace("<p>", "")
            .replace("</p>", "");
    }
}

export function add(channel_folder: ChannelFolder): void {
    clean_up_description(channel_folder);
    channel_folder_name_dict.set(channel_folder.name, channel_folder);
    channel_folder_by_id_dict.set(channel_folder.id, channel_folder);
    if (!channel_folder.is_archived) {
        active_channel_folder_ids.add(channel_folder.id);
    }
}

export function initialize(params: StateData["channel_folders"]): void {
    channel_folder_name_dict = new FoldDict();
    channel_folder_by_id_dict = new Map<number, ChannelFolder>();
    active_channel_folder_ids = new Set<number>();

    for (const channel_folder of params.channel_folders) {
        add(channel_folder);
    }
}

export function get_channel_folders(include_archived = false): ChannelFolder[] {
    const channel_folders = [...channel_folder_by_id_dict.values()];
    return channel_folders
        .filter((channel_folder) => {
            if (!include_archived && channel_folder.is_archived) {
                return false;
            }

            return true;
        })
        .toSorted((folder_a, folder_b) => folder_a.order - folder_b.order);
}

export function get_active_folder_ids(): Set<number> {
    return active_channel_folder_ids;
}

export function get_all_folder_ids(): Set<number> {
    return new Set(channel_folder_by_id_dict.keys());
}

export function is_valid_folder_id(folder_id: number): boolean {
    return channel_folder_by_id_dict.has(folder_id);
}

export function get_channel_folder_by_id(folder_id: number): ChannelFolder {
    const channel_folder = channel_folder_by_id_dict.get(folder_id);
    assert(channel_folder !== undefined);
    return channel_folder;
}

export function user_has_folders(): boolean {
    const subscribed_subs = stream_data.subscribed_subs();

    for (const sub of subscribed_subs) {
        if (sub.folder_id) {
            return true;
        }
    }

    return false;
}

export function update_channel_folder(
    folder_id: number,
    property: "name" | "description" | "rendered_description" | "is_archived",
    value: string | boolean,
): void {
    const channel_folder = get_channel_folder_by_id(folder_id);

    if (property === "is_archived") {
        assert(typeof value === "boolean");
        channel_folder.is_archived = value;
        if (channel_folder.is_archived) {
            active_channel_folder_ids.delete(channel_folder.id);
        }
        return;
    }

    assert(typeof value === "string");
    const old_value = channel_folder[property];

    channel_folder[property] = value;

    if (property === "name") {
        channel_folder_name_dict.delete(old_value);
        channel_folder_name_dict.set(channel_folder.name, channel_folder);
    }

    if (property === "rendered_description") {
        clean_up_description(channel_folder);
    }
}

export function update(event: ChannelFolderUpdateEvent): void {
    const folder_id = event.channel_folder_id;
    if (event.data.name !== undefined) {
        update_channel_folder(folder_id, "name", event.data.name);
    }

    if (event.data.description !== undefined) {
        update_channel_folder(folder_id, "description", event.data.description);
        assert(event.data.rendered_description !== undefined);
        update_channel_folder(folder_id, "rendered_description", event.data.rendered_description);
    }

    if (event.data.is_archived !== undefined) {
        update_channel_folder(folder_id, "is_archived", event.data.is_archived);
    }
}

export function get_streams_in_folder(folder_id: number): StreamSubscription[] {
    const streams = stream_data.get_unsorted_subs().filter((sub) => sub.folder_id === folder_id);
    return streams;
}

export function get_sorted_streams_in_folder(folder_id: number): StreamSubscription[] {
    const streams = get_streams_in_folder(folder_id);
    streams.sort(compare_by_name);
    return streams;
}

export function get_stream_ids_in_folder(folder_id: number): number[] {
    const streams = get_streams_in_folder(folder_id);
    return streams.map((sub) => sub.stream_id);
}

export function get_channels_in_folders_matching_search_term_in_folder_name(
    search_term: string,
    all_subscribed_stream_ids: Set<number>,
): number[] {
    const channel_folders = get_channel_folders();
    const matching_channel_folders = util.filter_by_word_prefix_match(
        channel_folders,
        search_term,
        (channel_folder) => channel_folder.name,
    );

    const channel_ids: number[] = [];
    for (const channel_folder of matching_channel_folders) {
        for (const stream_id of get_stream_ids_in_folder(channel_folder.id)) {
            if (all_subscribed_stream_ids.has(stream_id)) {
                channel_ids.push(stream_id);
            }
        }
    }
    return channel_ids;
}

export function reorder(order: number[]): void {
    for (const [index, folder_id] of order.entries()) {
        const channel_folder = get_channel_folder_by_id(folder_id);
        channel_folder.order = index;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: channel_folders_popover.ts]---
Location: zulip-main/web/src/channel_folders_popover.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_channel_folder_setting_popover from "../templates/popovers/channel_folder_setting_popover.hbs";

import * as channel from "./channel.ts";
import * as left_sidebar_navigation_area from "./left_sidebar_navigation_area.ts";
import * as pm_list from "./pm_list.ts";
import * as popover_menus from "./popover_menus.ts";
import * as stream_list from "./stream_list.ts";
import {parse_html} from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";

function do_change_show_channel_folders_left_sidebar(instance: tippy.Instance): void {
    const show_channel_folders = user_settings.web_left_sidebar_show_channel_folders;
    const data = {
        web_left_sidebar_show_channel_folders: JSON.stringify(!show_channel_folders),
    };
    void channel.patch({
        url: "/json/settings",
        data,
    });
    popover_menus.hide_current_popover_if_visible(instance);
}

function do_change_show_channel_folders_inbox(instance: tippy.Instance): void {
    const show_channel_folders = user_settings.web_inbox_show_channel_folders;
    const data = {
        web_inbox_show_channel_folders: JSON.stringify(!show_channel_folders),
    };
    void channel.patch({
        url: "/json/settings",
        data,
    });
    popover_menus.hide_current_popover_if_visible(instance);
}

function expand_all_sections(instance: tippy.Instance): void {
    // Expand Views section
    left_sidebar_navigation_area.force_expand_views();

    // Expand Direct Messages section
    if (pm_list.is_private_messages_collapsed()) {
        pm_list.expand();
    }

    // Expand all channel/stream sections
    stream_list.expand_all_stream_sections();

    popover_menus.hide_current_popover_if_visible(instance);
}

function collapse_all_sections(instance: tippy.Instance): void {
    // Collapse Views section
    left_sidebar_navigation_area.force_collapse_views();

    // Collapse Direct Messages section
    if (!pm_list.is_private_messages_collapsed()) {
        pm_list.close();
    }

    // Collapse all channel/stream sections
    stream_list.collapse_all_stream_sections();
    popover_menus.hide_current_popover_if_visible(instance);
}

export function initialize(): void {
    popover_menus.register_popover_menu("#left-sidebar-search .channel-folders-sidebar-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        theme: "popover-menu",
        onMount(instance) {
            const $popper = $(instance.popper);
            assert(instance.reference instanceof HTMLElement);
            $popper.one("click", "#left_sidebar_channel_folders", () => {
                do_change_show_channel_folders_left_sidebar(instance);
            });
            $popper.one("click", "#left_sidebar_expand_all", () => {
                expand_all_sections(instance);
            });
            $popper.one("click", "#left_sidebar_collapse_all", () => {
                collapse_all_sections(instance);
            });
        },
        onShow(instance) {
            const show_channel_folders = user_settings.web_left_sidebar_show_channel_folders;
            const show_collapse_expand_all_options = true;
            // Assuming that the instance can be shown, track and
            // prep the instance for showing
            popover_menus.popover_instances.show_folders_sidebar = instance;
            instance.setContent(
                parse_html(
                    render_channel_folder_setting_popover({
                        show_channel_folders,
                        channel_folders_id: "left_sidebar_channel_folders",
                        show_collapse_expand_all_options,
                    }),
                ),
            );
            popover_menus.on_show_prep(instance);

            return undefined;
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.show_folders_sidebar = null;
        },
    });

    popover_menus.register_popover_menu("#inbox-view .channel-folders-inbox-menu-icon", {
        ...popover_menus.left_sidebar_tippy_options,
        theme: "popover-menu",
        onMount(instance) {
            const $popper = $(instance.popper);
            assert(instance.reference instanceof HTMLElement);
            $popper.one("click", "#inbox_channel_folders", () => {
                do_change_show_channel_folders_inbox(instance);
            });
        },
        onShow(instance) {
            const show_channel_folders = user_settings.web_inbox_show_channel_folders;
            const show_collapse_expand_all_options = false;
            // Assuming that the instance can be shown, track and
            // prep the instance for showing
            popover_menus.popover_instances.show_folders_inbox = instance;
            instance.setContent(
                parse_html(
                    render_channel_folder_setting_popover({
                        show_channel_folders,
                        channel_folders_id: "inbox_channel_folders",
                        show_collapse_expand_all_options,
                    }),
                ),
            );
            popover_menus.on_show_prep(instance);

            return undefined;
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.show_folders_inbox = null;
        },
    });
}
```

--------------------------------------------------------------------------------

````

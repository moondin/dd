---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 659
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 659 of 1290)

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

---[FILE: recent_view_util.ts]---
Location: zulip-main/web/src/recent_view_util.ts

```typescript
import type {Message} from "./message_store.ts";

let is_view_visible = false;

export function set_visible(value: boolean): void {
    is_view_visible = value;
}

export function is_visible(): boolean {
    return is_view_visible;
}

export function get_topic_key(stream_id: number, topic: string): string {
    return stream_id + ":" + topic.toLowerCase();
}

export function get_key_from_message(msg: Message): string {
    if (msg.type === "private") {
        // The to_user_ids field on a direct message object is a
        // string containing the user IDs involved in the message in
        // sorted order.
        return msg.to_user_ids;
    }

    // For messages with type = "stream".
    return get_topic_key(msg.stream_id, msg.topic);
}
```

--------------------------------------------------------------------------------

---[FILE: reload.ts]---
Location: zulip-main/web/src/reload.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as compose_state from "./compose_state.ts";
import * as drafts from "./drafts.ts";
import * as hash_util from "./hash_util.ts";
import type {LocalStorage} from "./localstorage.ts";
import {localstorage} from "./localstorage.ts";
import * as message_lists from "./message_lists.ts";
import {page_params} from "./page_params.ts";
import * as popup_banners from "./popup_banners.ts";
import type {ReloadingReason} from "./popup_banners.ts";
import * as reload_state from "./reload_state.ts";
import * as util from "./util.ts";

// Read https://zulip.readthedocs.io/en/latest/subsystems/hashchange-system.html

let server_reachable_check_failures = 0;

export const reload_metadata_schema = z.object({
    hash: z.string(),
    message_view_pointer: z.optional(z.number()),
    message_view_scroll_offset: z.optional(z.number()),
    compose_active_draft_id: z.optional(z.string()),
    compose_active_draft_send_immediately: z.optional(z.boolean()),
    timestamp: z.number(),
});

const reload_hooks: (() => void)[] = [];

export function add_reload_hook(hook: () => void): void {
    reload_hooks.push(hook);
}

function call_reload_hooks(): void {
    for (const hook of reload_hooks) {
        hook();
    }
}

function preserve_state(
    compose_active_draft_send_immediately: boolean,
    save_compose: boolean,
): void {
    if (!localstorage.supported()) {
        // If local storage is not supported by the browser, we can't
        // save the browser's position across reloads (since there's
        // no secure way to pass that state in a signed fashion to the
        // next instance of the browser client).
        //
        // So we just return here and let the reload proceed without
        // having preserved state.  We keep the hash the same so we'll
        // at least save their narrow state.
        blueslip.log("Can't preserve state; no local storage.");
        return;
    }

    if (!$("#app-loading").hasClass("loaded")) {
        blueslip.log("Can't preserve state; message_lists not yet initialized.");
        return;
    }

    let draft_id: string | undefined;
    if (save_compose && compose_state.get_message_type()) {
        draft_id = drafts.update_draft({force_save: true});
        assert(draft_id !== undefined);
    }
    let message_view_pointer: number | undefined;
    let message_view_scroll_offset: number | undefined;
    if (message_lists.current !== undefined) {
        const narrow_pointer = message_lists.current.selected_id();
        if (narrow_pointer !== -1) {
            message_view_pointer = narrow_pointer;
        }
        const $narrow_row = message_lists.current.selected_row();
        if ($narrow_row.length > 0) {
            message_view_scroll_offset = $narrow_row.get_offset_to_window().top;
        }
    }

    const reload_data: z.infer<typeof reload_metadata_schema> = {
        compose_active_draft_send_immediately,
        compose_active_draft_id: draft_id,
        message_view_pointer,
        message_view_scroll_offset,
        hash: hash_util.get_reload_hash(),
        timestamp: Date.now(),
    };

    // Delete unused states that have been around for a while.
    const ls = localstorage();
    delete_stale_tokens(ls);

    // To protect the browser against CSRF type attacks, the reload
    // logic uses a random token (to distinct this browser from
    // others) which is passed via the URL to the browser (post
    // reloading).  The token is a key into local storage, where we
    // marshall and store the URL.
    const token = util.random_int(0, 1024 * 1024 * 1024 * 1024);
    ls.set("reload:" + token, reload_data);
    window.location.replace("#reload:" + token);
}

export function is_stale_refresh_token(token_metadata: unknown, now: number): boolean {
    const parsed = reload_metadata_schema.safeParse(token_metadata);
    // TODO/compatibility(12.0): The metadata format was rewritten in
    // the 12.0 development branch in 2025. We garbage-collect reload
    // tokens in the old format if they are more than a week stale. We
    // can delete the parsing logic for the old format once it's no
    // longer possible to directly upgrade from 11.x to main.
    if (!parsed.success) {
        return true;
    }
    const {timestamp} = parsed.data;

    // The time between reload token generation and use should usually be
    // fewer than 30 seconds, but we keep tokens around for a week just in case
    // (e.g. a tab could fail to load and be refreshed a while later).
    const milliseconds_in_a_day = 1000 * 60 * 60 * 24;
    const timedelta = now - timestamp;
    const days_since_token_creation = timedelta / milliseconds_in_a_day;
    return days_since_token_creation > 7;
}

function delete_stale_tokens(ls: LocalStorage): void {
    const now = Date.now();
    ls.removeDataRegexWithCondition("reload:\\d+", (metadata) =>
        is_stale_refresh_token(metadata, now),
    );
}

function do_reload_app(
    send_after_reload: boolean,
    save_compose: boolean,
    reason: ReloadingReason,
): void {
    if (reload_state.is_in_progress()) {
        blueslip.log("do_reload_app: Doing nothing since reload_in_progress");
        return;
    }

    // TODO: we should completely disable the UI here
    try {
        preserve_state(send_after_reload, save_compose);
    } catch (error) {
        blueslip.error("Failed to preserve state", undefined, error);
    }

    // TODO: We need a better API for showing messages.
    popup_banners.open_reloading_application_banner(reason);
    blueslip.log("Starting server requested page reload");
    reload_state.set_state_to_in_progress();

    // Sometimes the window.location.reload that we attempt has no
    // immediate effect (likely by browsers trying to save power by
    // skipping requested reloads), which can leave the Zulip app in a
    // broken state and cause lots of confusing tracebacks.  So, we
    // set ourselves to try reloading a bit later, both periodically
    // and when the user focuses the window.
    setTimeout(() => {
        // We add this handler after a bit of delay, because in some
        // browsers, processing window.location.reload causes the
        // window to gain focus, and duplicate reload attempts result
        // in the browser sending duplicate requests to `/`.
        $(window).one("focus", () => {
            blueslip.log("Retrying on-focus page reload");

            window.location.reload();
        });
    }, 5000);

    function retry_reload(): void {
        blueslip.log("Retrying page reload due to 30s timer");
        window.location.reload();
    }
    util.call_function_periodically(retry_reload, 30000);

    try {
        call_reload_hooks();
    } catch (error) {
        blueslip.error("Failed to clean up before reloading", undefined, error);
    }

    window.location.reload();
}

export function initiate({
    immediate = false,
    save_compose = true,
    send_after_reload = false,
    reason = "reload",
}: {
    immediate?: boolean;
    save_compose?: boolean;
    send_after_reload?: boolean;
    reason?: ReloadingReason;
}): void {
    if (reload_state.is_in_progress()) {
        // If we're already attempting to reload, there's nothing to do.
        return;
    }

    if (reload_state.is_pending() && !immediate) {
        // If we're already pending and the caller is not requesting
        // an immediate reload, there's nothing to do.
        return;
    }

    // In order to avoid races with the user's device connecting to
    // the internet due to a network change while the device was
    // suspended, we fetch a cheap unauthenticated API endpoint and
    // only initiate the reload if we get a success response from the
    // server.
    void channel.get({
        url: "/compatibility",
        success() {
            server_reachable_check_failures = 0;
            if (immediate) {
                do_reload_app(send_after_reload, save_compose, reason);
                // We don't expect do_reload_app to return, but if it
                // does, the fallthrough logic seems fine.
            }

            if (reload_state.is_pending()) {
                // If we're already pending, don't set the timers a second time.
                return;
            }

            reload_state.set_state_to_pending();

            // We're now planning to execute a reload of the browser, usually
            // to get an updated version of the Zulip web app code.  Because in
            // most cases all browsers will be receiving this notice at the
            // same or similar times, we need to randomize the time that we do
            // this in order to avoid a thundering herd overloading the server.
            //
            // Additionally, we try to do this reload at a time the user will
            // not notice.  So completely idle clients will reload first;
            // those will an open compose box will wait until the message has
            // been sent (or until it's clear the user isn't likely to send it).
            //
            // And then we unconditionally reload sometime after 30 minutes
            // even if there is continued activity, because we don't support
            // old JavaScript versions against newer servers and eventually
            // letting that situation continue will lead to users seeing bugs.
            //
            // It's a little odd that how this timeout logic works with
            // compose box resets including the random variance, but that
            // makes it simple to reason about: We know that reloads will be
            // spread over at least 5 minutes in all cases.

            let idle_control: ReturnType<JQuery["idle"]>;
            const random_variance = util.random_int(0, 1000 * 60 * 5);
            const unconditional_timeout = 1000 * 60 * 30 + random_variance;
            const composing_idle_timeout = 1000 * 60 * 7 + random_variance;
            const basic_idle_timeout = 1000 * 60 * 1 + random_variance;

            function reload_from_idle(): void {
                do_reload_app(false, save_compose, reason);
            }

            // Make sure we always do a reload eventually after
            // unconditional_timeout.  Because we save cursor location and
            // compose state when reloading, we expect this to not be
            // particularly disruptive.
            setTimeout(reload_from_idle, unconditional_timeout);

            function compose_done_handler(): void {
                // If the user sends their message or otherwise closes
                // compose, we return them to the not-composing timeouts.
                idle_control.cancel();
                idle_control = $(document).idle({
                    idle: basic_idle_timeout,
                    onIdle: reload_from_idle,
                });
                $(document).off(
                    "compose_canceled.zulip compose_finished.zulip",
                    compose_done_handler,
                );
                $(document).on("compose_started.zulip", compose_started_handler);
            }
            function compose_started_handler(): void {
                // If the user stops being idle and starts composing a
                // message, switch to the compose-open timeouts.
                idle_control.cancel();
                idle_control = $(document).idle({
                    idle: composing_idle_timeout,
                    onIdle: reload_from_idle,
                });
                $(document).off("compose_started.zulip", compose_started_handler);
                $(document).on(
                    "compose_canceled.zulip compose_finished.zulip",
                    compose_done_handler,
                );
            }

            if (compose_state.composing()) {
                idle_control = $(document).idle({
                    idle: composing_idle_timeout,
                    onIdle: reload_from_idle,
                });
                $(document).on(
                    "compose_canceled.zulip compose_finished.zulip",
                    compose_done_handler,
                );
            } else {
                idle_control = $(document).idle({
                    idle: basic_idle_timeout,
                    onIdle: reload_from_idle,
                });
                $(document).on("compose_started.zulip", compose_started_handler);
            }
        },
        error(xhr) {
            server_reachable_check_failures += 1;
            const retry_delay_secs = util.get_retry_backoff_seconds(
                xhr,
                server_reachable_check_failures,
            );
            setTimeout(() => {
                initiate({immediate, save_compose, send_after_reload, reason});
            }, retry_delay_secs * 1000);
        },
    });
}

window.addEventListener("beforeunload", () => {
    // When navigating away from the page do not try to reload.
    // The polling get_events call will fail after we delete the event queue.
    // When that happens we reload the page to correct the problem. If this
    // happens before the navigation is complete the user is kept captive at
    // zulip.
    blueslip.log("Setting reload_in_progress in beforeunload handler");
    reload_state.set_state_to_in_progress();
});

reload_state.set_csrf_failed_handler(() => {
    if (page_params.is_spectator) {
        // If the user is a spectator, we don't want to reload the page
        // since it will most likely lead an infinite reload loop.
        return;
    }

    initiate({
        immediate: true,
        save_compose: true,
    });
});
```

--------------------------------------------------------------------------------

---[FILE: reload_setup.ts]---
Location: zulip-main/web/src/reload_setup.ts
Signals: Zod

```typescript
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as activity from "./activity.ts";
import * as blueslip from "./blueslip.ts";
import * as compose from "./compose.ts";
import * as compose_actions from "./compose_actions.ts";
import * as drafts from "./drafts.ts";
import {localstorage} from "./localstorage.ts";
import * as message_fetch from "./message_fetch.ts";
import * as message_view from "./message_view.ts";
import * as people from "./people.ts";
import {reload_metadata_schema} from "./reload.ts";

// Check if we're doing a compose-preserving reload.  This must be
// done before the first call to get_events

// See history of `reload.preserve_state` for context on how this is built.
const legacy_reload_vars_schema = z.intersection(
    z.object({
        oldhash: z.string(),
        narrow_pointer: z.optional(z.string()),
        narrow_offset: z.optional(z.string()),
        send_after_reload: z.enum(["0", "1"]),
    }),
    z.union([
        z.object({
            msg: z.optional(z.undefined()),
        }),
        z.intersection(
            z.object({
                msg: z.string(),
                draft_id: z.optional(z.string()),
            }),
            z.discriminatedUnion("msg_type", [
                z.object({
                    msg_type: z.literal("private"),
                    recipient: z.string(),
                }),
                z.object({
                    msg_type: z.literal("stream"),
                    stream_id: z.optional(z.string()),
                    topic: z.string(),
                }),
            ]),
        ),
    ]),
);

export function initialize(): void {
    // window.location.hash should be e.g. `#reload:12345123412312`
    if (!window.location.hash.startsWith("#reload:")) {
        return;
    }
    const hash_fragment = window.location.hash.slice("#".length);

    // Using the token, recover the saved pre-reload data from local
    // storage.  Afterwards, we clear the reload entry from local
    // storage to avoid a local storage space leak.
    const ls = localstorage();
    const fragment = ls.get(hash_fragment);
    if (fragment === undefined) {
        // Since this can happen sometimes with hand-reloading, it's
        // not really worth throwing an exception if these don't
        // exist, but be log it so that it's available for future
        // debugging if an exception happens later.
        blueslip.info("Invalid hash change reload token");
        message_view.changehash("", "reload");
        return;
    }
    ls.remove(hash_fragment);

    const parsed = reload_metadata_schema.safeParse(fragment);
    if (parsed.success) {
        // IMPORTANT: Most changes to this function's behavior should
        // also update load_from_legacy_data.
        const data = parsed.data;
        if (data.compose_active_draft_id !== undefined) {
            const draft = drafts.draft_model.getDraft(data.compose_active_draft_id);
            if (draft === false) {
                blueslip.warn("Tried to restore a draft that didn't exist.");
            } else {
                compose_actions.start({...draft, message_type: draft.type});
                if (data.compose_active_draft_send_immediately) {
                    compose.finish();
                }
            }
        }

        // We only restore pointer and offset for the current narrow, even if
        // there are narrows that were cached before the reload, they are no
        // longer cached after the reload. We could possibly store the pointer
        // and offset for these narrows but it might lead to a confusing
        // experience if the user gets back to these narrow much later (maybe days)
        // and finds them at a random position in the narrow which they didn't
        // navigate to while they were trying to just get to the latest unread
        // message in that narrow which will now take more effort to find.
        message_fetch.set_initial_pointer_and_offset({
            narrow_pointer: data.message_view_pointer,
            narrow_offset: data.message_view_scroll_offset,
        });

        activity.set_new_user_input(false);
        message_view.changehash(data.hash, "reload");
    } else {
        load_from_legacy_data(fragment);
    }
}

function load_from_legacy_data(fragment: unknown): void {
    // IMPORTANT: This function mostly duplicates initialize with
    // different parsing logic. Be careful to avoid fixing only one
    // code path.
    //
    // TODO/compatibility(12.0): This legacy code path can be deleted
    // once it is no longer possible to directly upgrade from 11.x to
    // main.
    //
    // TODO/compatibility: `fragment` was changed from a string
    // to a map containing the string and a timestamp. For now we'll
    // delete all tokens that only contain the url. Remove the
    // `z.string().parse(fragment)` branch once you can no longer
    // directly upgrade from Zulip 5.x to the current version.
    let parsed_fragment: string;
    const parse_with_url = z.object({url: z.string()}).safeParse(fragment);
    if (parse_with_url.success) {
        parsed_fragment = parse_with_url.data.url;
    } else {
        parsed_fragment = z.string().parse(fragment);
    }
    const match = /^#reload:(.*)/.exec(parsed_fragment);
    assert(match !== null);
    const matched_fragment = match[1];
    assert(matched_fragment !== undefined);
    const keyvals: string[] = matched_fragment.split("+");
    const raw_vars: Record<string, string> = {};

    for (const str of keyvals) {
        const pair = str.split("=");
        assert(pair.length === 2);
        raw_vars[pair[0]!] = decodeURIComponent(pair[1]!);
    }

    const vars = legacy_reload_vars_schema.parse(raw_vars);
    if (vars.msg !== undefined) {
        const send_now = vars.send_after_reload === "1";

        try {
            const private_message_recipient_ids =
                vars.msg_type === "private" ? people.emails_string_to_user_ids(vars.recipient) : [];
            const stream_id =
                vars.msg_type === "stream" && vars.stream_id
                    ? Number.parseInt(vars.stream_id, 10)
                    : undefined;
            const topic = vars.msg_type === "stream" ? vars.topic : "";
            compose_actions.start({
                message_type: vars.msg_type,
                stream_id,
                topic,
                private_message_recipient_ids,
                content: vars.msg ?? "",
                draft_id: vars.draft_id ?? "",
            });
            if (send_now) {
                compose.finish();
            }
        } catch (error) {
            // We log an error if we can't open the compose box, but otherwise
            // we continue, since this is not critical.
            blueslip.warn(String(error));
        }
    }

    // We only restore pointer and offset for the current narrow, even if there are narrows that
    // were cached before the reload, they are no longer cached after the reload. We could possibly
    // store the pointer and offset for these narrows but it might lead to a confusing experience if
    // user gets back to these narrow much later (maybe days) and finds them at a random position in
    // narrow which they didn't navigate to while they were trying to just get to the latest unread
    // message in that narrow which will now take more effort to find.
    const narrow_pointer = vars.narrow_pointer
        ? Number.parseInt(vars.narrow_pointer, 10)
        : undefined;
    const narrow_offset = vars.narrow_offset ? Number.parseInt(vars.narrow_offset, 10) : undefined;
    message_fetch.set_initial_pointer_and_offset({
        narrow_pointer,
        narrow_offset,
    });

    activity.set_new_user_input(false);
    message_view.changehash(vars.oldhash, "reload");
}
```

--------------------------------------------------------------------------------

---[FILE: reload_state.ts]---
Location: zulip-main/web/src/reload_state.ts

```typescript
/*
    We want his module to load pretty early in the process
    of starting the app, so that people.js can load early.
    All the heavy lifting for reload logic happens in
    reload.ts, which has lots of UI dependencies.  If we
    didn't split out this module, our whole dependency tree
    would be kind of upside down.
*/

let reload_in_progress = false;
let reload_pending = false;
export let csrf_failed_handler: (() => void) | undefined;

export function clear_for_testing(): void {
    reload_in_progress = false;
    reload_pending = false;
    csrf_failed_handler = undefined;
}

export function is_pending(): boolean {
    return reload_pending;
}

export function is_in_progress(): boolean {
    return reload_in_progress;
}

export function set_state_to_pending(): void {
    // Why do we never set this back to false?
    // Because the reload is gonna happen next. :)
    // I was briefly confused by this, hence the comment.
    reload_pending = true;
}

export function set_state_to_in_progress(): void {
    reload_in_progress = true;
}

export function set_csrf_failed_handler(handler: () => void): void {
    csrf_failed_handler = handler;
}
```

--------------------------------------------------------------------------------

---[FILE: reminders_overlay_ui.ts]---
Location: zulip-main/web/src/reminders_overlay_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_reminder_list from "../templates/reminder_list.hbs";
import render_reminders_overlay from "../templates/reminders_overlay.hbs";

import * as browser_history from "./browser_history.ts";
import * as message_reminder from "./message_reminder.ts";
import type {Reminder} from "./message_reminder.ts";
import * as messages_overlay_ui from "./messages_overlay_ui.ts";
import * as overlays from "./overlays.ts";
import * as timerender from "./timerender.ts";

type ReminderRenderContext = Reminder & {
    formatted_send_at_time: string;
};

export const keyboard_handling_context = {
    get_items_ids() {
        const reminders_ids = [];
        const sorted_reminders = sort_reminders(message_reminder.reminders_by_id);
        for (const reminder of sorted_reminders) {
            reminders_ids.push(reminder.reminder_id.toString());
        }
        return reminders_ids;
    },
    on_enter() {
        // TODO: Allow editing reminder.
        return;
    },
    on_delete() {
        const focused_element_id = messages_overlay_ui.get_focused_element_id(this);
        if (focused_element_id === undefined) {
            return;
        }
        const $focused_row = messages_overlay_ui.row_with_focus(this);
        messages_overlay_ui.focus_on_sibling_element(this);
        // We need to have a super responsive UI feedback here, so we remove the row from the DOM manually
        $focused_row.remove();
        message_reminder.delete_reminder(Number.parseInt(focused_element_id, 10));
    },
    items_container_selector: "reminders-container",
    items_list_selector: "reminders-list",
    row_item_selector: "reminder-row",
    box_item_selector: "reminder-info-box",
    id_attribute_name: "data-reminder-id",
};

function sort_reminders(reminders: Map<number, Reminder>): Reminder[] {
    const sorted_reminders = [...reminders.values()];
    sorted_reminders.sort(
        (reminder1, reminder2) =>
            reminder1.scheduled_delivery_timestamp - reminder2.scheduled_delivery_timestamp,
    );
    return sorted_reminders;
}

export function handle_keyboard_events(event_key: string): void {
    messages_overlay_ui.modals_handle_events(event_key, keyboard_handling_context);
}

function format(reminders: Map<number, Reminder>): ReminderRenderContext[] {
    const formatted_reminders = [];
    const sorted_reminders = sort_reminders(reminders);

    for (const reminder of sorted_reminders) {
        const time = new Date(reminder.scheduled_delivery_timestamp * 1000);
        const formatted_send_at_time = timerender.get_full_datetime(time, "time");
        const reminder_render_context = {
            ...reminder,
            formatted_send_at_time,
        };
        formatted_reminders.push(reminder_render_context);
    }
    return formatted_reminders;
}

export function launch(select_reminder_id?: number): void {
    $("#reminders-overlay-container").html(render_reminders_overlay());
    overlays.open_overlay({
        name: "reminders",
        $overlay: $("#reminders-overlay"),
        on_close() {
            browser_history.exit_overlay();
        },
    });

    const rendered_list = render_reminder_list({
        reminders_data: format(message_reminder.reminders_by_id),
    });
    const $messages_list = $("#reminders-overlay .overlay-messages-list");
    $messages_list.append($(rendered_list));

    if (select_reminder_id !== undefined) {
        // Check that the reminder to be focused exists.
        const $reminder_to_be_focused = $(
            `#reminders-overlay .reminder-row[data-reminder-id=${CSS.escape(
                select_reminder_id.toString(),
            )}]`,
        );
        if ($reminder_to_be_focused.length > 0) {
            messages_overlay_ui.set_initial_element(
                select_reminder_id.toString(),
                keyboard_handling_context,
            );
            return;
        }
    }
    const first_element_id = keyboard_handling_context.get_items_ids()[0];
    messages_overlay_ui.set_initial_element(first_element_id, keyboard_handling_context);
}

export function rerender(): void {
    if (!overlays.reminders_open()) {
        return;
    }
    const rendered_list = render_reminder_list({
        reminders_data: format(message_reminder.reminders_by_id),
    });
    const $messages_list = $("#reminders-overlay .overlay-messages-list");
    $messages_list.find(".reminder-row").remove();
    $messages_list.append($(rendered_list));
}

export function remove_reminder_id(reminder_id: number): void {
    if (overlays.reminders_open()) {
        $(`#reminders-overlay .reminder-row[data-reminder-id=${reminder_id}]`).remove();
    }
}

export function initialize(): void {
    $("body").on("click", ".reminder-row .delete-overlay-message", (e) => {
        const scheduled_msg_id = $(e.currentTarget)
            .closest(".reminder-row")
            .attr("data-reminder-id");
        assert(scheduled_msg_id !== undefined);

        message_reminder.delete_reminder(Number.parseInt(scheduled_msg_id, 10));

        e.stopPropagation();
        e.preventDefault();
    });

    $("body").on("focus", ".reminder-info-box", function (this: HTMLElement) {
        messages_overlay_ui.activate_element(this, keyboard_handling_context);
    });

    $("body").on("click", ".message-reminder-overlay-link", function (e) {
        e.stopPropagation();
        e.preventDefault();

        const reminder_id = $(this).attr("data-reminder-id");
        assert(reminder_id !== undefined);
        launch(Number.parseInt(reminder_id, 10));
    });
}
```

--------------------------------------------------------------------------------

````

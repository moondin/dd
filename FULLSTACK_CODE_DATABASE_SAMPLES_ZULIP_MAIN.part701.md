---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 701
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 701 of 1290)

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

---[FILE: typing.ts]---
Location: zulip-main/web/src/typing.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as compose_pm_pill from "./compose_pm_pill.ts";
import * as compose_state from "./compose_state.ts";
import * as message_store from "./message_store.ts";
import * as people from "./people.ts";
import * as rows from "./rows.ts";
import {realm} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import type {EditingStatusWorker, Recipient} from "./typing_status.ts";
import * as typing_status from "./typing_status.ts";
import {user_settings} from "./user_settings.ts";

let edit_box_worker: EditingStatusWorker;

type TypingAPIRequest = {op: "start" | "stop"} & (
    | {
          type: string;
          to: string;
      }
    | {
          type: string;
          stream_id: string;
          topic: string;
      }
);

// This module handles the outbound side of typing indicators.
// We detect changes in the compose box and notify the server
// when we are typing.  For the inbound side see typing_events.ts.
// See docs/subsystems/typing-indicators.md for more details.

function send_typing_notification_ajax(data: TypingAPIRequest): void {
    void channel.post({
        url: "/json/typing",
        data,
        error(xhr) {
            if (xhr.readyState !== 0) {
                blueslip.warn("Failed to send typing event: " + xhr.responseText);
            }
        },
    });
}

function send_message_edit_typing_notification_ajax(
    message_id: number,
    operation: "start" | "stop",
): void {
    const data = {
        op: operation,
    };
    void channel.post({
        url: `/json/messages/${message_id}/typing`,
        data,
        error(xhr) {
            if (xhr.readyState !== 0) {
                blueslip.warn("Failed to send message edit typing event: " + xhr.responseText);
            }
        },
    });
}

function send_direct_message_typing_notification(
    user_ids_array: number[],
    operation: "start" | "stop",
): void {
    const data = {
        to: JSON.stringify(user_ids_array),
        type: "direct",
        op: operation,
    };
    send_typing_notification_ajax(data);
}

function send_stream_typing_notification(
    stream_id: number,
    topic: string,
    operation: "start" | "stop",
): void {
    const stream = stream_data.get_sub_by_id(stream_id)!;
    if (!stream_data.can_post_messages_in_stream(stream)) {
        return;
    }
    const data = {
        type: "stream",
        stream_id: JSON.stringify(stream_id),
        topic,
        op: operation,
    };
    send_typing_notification_ajax(data);
}

function send_typing_notification_based_on_message_type(
    to: Recipient,
    operation: "start" | "stop",
): void {
    assert(to.notification_event_type === "typing");
    if (to.message_type === "direct" && user_settings.send_private_typing_notifications) {
        send_direct_message_typing_notification(to.ids, operation);
    } else if (to.message_type === "stream" && user_settings.send_stream_typing_notifications) {
        send_stream_typing_notification(to.stream_id, to.topic, operation);
    }
}

function message_edit_typing_notifications_enabled(message_id: number): boolean {
    const message = message_store.get(message_id);
    assert(message !== undefined);
    if (message.type === "stream") {
        return user_settings.send_stream_typing_notifications;
    }
    return user_settings.send_private_typing_notifications;
}

function send_typing_notifications_for_message_edit(
    message_id: number,
    operation: "start" | "stop",
): void {
    if (message_edit_typing_notifications_enabled(message_id)) {
        send_message_edit_typing_notification_ajax(message_id, operation);
    }
}

function get_user_ids_array(): number[] | null {
    const user_ids_string = compose_pm_pill.get_user_ids_string();
    if (user_ids_string === "") {
        return null;
    }

    return people.user_ids_string_to_ids_array(user_ids_string);
}

function is_valid_conversation(): boolean {
    const compose_empty = !compose_state.has_message_content();
    if (compose_empty) {
        return false;
    }

    return true;
}

function get_current_time(): number {
    return Date.now();
}

function notify_server_start(to: Recipient): void {
    send_typing_notification_based_on_message_type(to, "start");
}

function notify_server_stop(to: Recipient): void {
    send_typing_notification_based_on_message_type(to, "stop");
}

function notify_server_editing_start(to: Recipient): void {
    assert(to.notification_event_type === "typing_message_edit");
    send_typing_notifications_for_message_edit(to.message_id, "start");
}

function notify_server_editing_stop(to: Recipient): void {
    assert(to.notification_event_type === "typing_message_edit");
    send_typing_notifications_for_message_edit(to.message_id, "stop");
}

export function get_recipient(): Recipient | null {
    const message_type = compose_state.get_message_type();
    if (message_type === "private") {
        const user_ids = get_user_ids_array();
        // compose box with no valid user pills.
        if (user_ids === null) {
            return null;
        }
        return {
            message_type: "direct",
            notification_event_type: "typing",
            ids: user_ids,
        };
    }
    if (message_type === "stream") {
        const stream_name = compose_state.stream_name();
        const stream_id = stream_data.get_stream_id(stream_name);
        if (stream_id === undefined) {
            // compose box with no stream selected.
            return null;
        }
        const topic = compose_state.topic();
        if (!stream_data.can_use_empty_topic(stream_id) && topic === "") {
            // compose box with empty topic string.
            return null;
        }
        return {
            message_type: "stream",
            notification_event_type: "typing",
            stream_id,
            topic,
        };
    }
    return null;
}

function get_message_edit_recipient(message_id: number): Recipient {
    return {
        notification_event_type: "typing_message_edit",
        message_id,
    };
}
export function stop_message_edit_notifications(message_id: number): void {
    const recipient = get_message_edit_recipient(message_id);
    typing_status.update_editing_status(
        edit_box_worker,
        recipient,
        "stop",
        realm.server_typing_started_wait_period_milliseconds,
        realm.server_typing_stopped_wait_period_milliseconds,
    );
}

export function initialize(): void {
    const worker = {
        get_current_time,
        notify_server_start,
        notify_server_stop,
    };

    edit_box_worker = {
        get_current_time,
        notify_server_editing_start,
        notify_server_editing_stop,
    };

    $(document).on("input", "#compose-textarea", () => {
        // If our previous state was no typing notification, send a
        // start-typing notice immediately.
        const new_recipient = is_valid_conversation() ? get_recipient() : null;
        typing_status.update(
            worker,
            new_recipient,
            realm.server_typing_started_wait_period_milliseconds,
            realm.server_typing_stopped_wait_period_milliseconds,
        );
    });

    $("body").on("input", ".message_edit_content", function (this: HTMLElement) {
        const $message_row = $(this).closest(".message_row");
        const message_id = rows.id($message_row);
        const new_recipient = get_message_edit_recipient(message_id);
        typing_status.update_editing_status(
            edit_box_worker,
            new_recipient,
            "start",
            realm.server_typing_started_wait_period_milliseconds,
            realm.server_typing_stopped_wait_period_milliseconds,
        );
    });

    // We send a stop-typing notification immediately when compose is
    // closed/cancelled
    $(document).on("compose_canceled.zulip compose_finished.zulip", () => {
        typing_status.update(
            worker,
            null,
            realm.server_typing_started_wait_period_milliseconds,
            realm.server_typing_stopped_wait_period_milliseconds,
        );
    });
}
```

--------------------------------------------------------------------------------

---[FILE: typing_data.ts]---
Location: zulip-main/web/src/typing_data.ts

```typescript
import * as muted_users from "./muted_users.ts";
import * as util from "./util.ts";

// See docs/subsystems/typing-indicators.md for details on typing indicators.

const typists_dict = new Map<string, number[]>();
const edit_message_typing_ids = new Set<number>();
const inbound_timer_dict = new Map<string, ReturnType<typeof setInterval> | undefined>();

export function clear_for_testing(): void {
    typists_dict.clear();
    inbound_timer_dict.clear();
}

export function get_direct_message_conversation_key(group: number[]): string {
    const ids = util.sorted_ids(group);
    return "direct:" + ids.join(",");
}

export function get_topic_key(stream_id: number, topic: string): string {
    topic = topic.toLowerCase(); // Topics are case-insensitive
    return "topic:" + JSON.stringify({stream_id, topic});
}

export function add_typist(key: string, typist: number): void {
    const current = typists_dict.get(key) ?? [];
    if (!current.includes(typist)) {
        current.push(typist);
    }
    typists_dict.set(key, util.sorted_ids(current));
}

export function remove_typist(key: string, typist: number): boolean {
    let current = typists_dict.get(key) ?? [];

    if (!current.includes(typist)) {
        return false;
    }

    current = current.filter((user_id) => user_id !== typist);

    typists_dict.set(key, current);
    return true;
}

export function get_group_typists(group: number[]): number[] {
    const key = get_direct_message_conversation_key(group);
    const user_ids = typists_dict.get(key) ?? [];
    return muted_users.filter_muted_user_ids(user_ids);
}

export function get_all_direct_message_typists(): number[] {
    let typists: number[] = [];
    for (const [key, value] of typists_dict) {
        if (key.startsWith("direct:")) {
            typists.push(...value);
        }
    }
    typists = util.sorted_ids(typists);
    return muted_users.filter_muted_user_ids(typists);
}

export function get_topic_typists(stream_id: number, topic: string): number[] {
    const typists = typists_dict.get(get_topic_key(stream_id, topic)) ?? [];
    return muted_users.filter_muted_user_ids(typists);
}

export function clear_typing_data(): void {
    for (const [, timer] of inbound_timer_dict.entries()) {
        clearTimeout(timer);
    }
    inbound_timer_dict.clear();
    typists_dict.clear();
}

export function add_edit_message_typing_id(message_id: number): void {
    if (!edit_message_typing_ids.has(message_id)) {
        edit_message_typing_ids.add(message_id);
    }
}

export function remove_edit_message_typing_id(message_id: number): boolean {
    if (!edit_message_typing_ids.has(message_id)) {
        return false;
    }
    edit_message_typing_ids.delete(message_id);
    return true;
}

export function is_message_editing(message_id: number): boolean {
    return edit_message_typing_ids.has(message_id);
}

// The next functions aren't pure data, but it is easy
// enough to mock the setTimeout/clearTimeout functions.
export function clear_inbound_timer(key: string): void {
    const timer = inbound_timer_dict.get(key);
    if (timer) {
        clearTimeout(timer);
        inbound_timer_dict.set(key, undefined);
    }
}

export function kickstart_inbound_timer(key: string, delay: number, callback: () => void): void {
    clear_inbound_timer(key);
    const timer = setTimeout(callback, delay);
    inbound_timer_dict.set(key, timer);
}
```

--------------------------------------------------------------------------------

---[FILE: typing_events.ts]---
Location: zulip-main/web/src/typing_events.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import render_editing_notifications from "../templates/editing_notifications.hbs";
import render_typing_notifications from "../templates/typing_notifications.hbs";

import * as message_lists from "./message_lists.ts";
import * as narrow_state from "./narrow_state.ts";
import * as people from "./people.ts";
import {current_user, realm} from "./state_data.ts";
import * as typing_data from "./typing_data.ts";

// See docs/subsystems/typing-indicators.md for details on typing indicators.

// This code handles the inbound side of typing notifications.
// When another user is typing, we process the events here.
//
// We also handle the local event of re-narrowing.
// (For the outbound code, see typing.ts.)

// If number of users typing exceed this,
// we render "Several people are typing..."
const MAX_USERS_TO_DISPLAY_NAME = 3;

// Note!: There are also timing constants in typing_status.ts
// that make typing indicators work.

export const typing_user_schema = z.object({
    email: z.string(),
    user_id: z.number(),
});

export const typing_event_schema = z.intersection(
    z.object({
        id: z.number(),
        op: z.enum(["start", "stop"]),
        type: z.literal("typing"),
    }),
    z.discriminatedUnion("message_type", [
        z.object({
            message_type: z.literal("stream"),
            sender: typing_user_schema,
            stream_id: z.number(),
            topic: z.string(),
        }),
        z.object({
            message_type: z.literal("direct"),
            recipients: z.array(typing_user_schema),
            sender: typing_user_schema,
        }),
    ]),
);
type TypingEvent = z.output<typeof typing_event_schema>;

export const typing_edit_message_event_schema = z.object({
    message_id: z.number(),
    op: z.enum(["start", "stop"]),
    type: z.literal("typing_edit_message"),
    sender_id: z.number(),
    recipient: z.discriminatedUnion("type", [
        z.object({
            type: z.literal("channel"),
            channel_id: z.number(),
            topic: z.string(),
        }),
        z.object({
            type: z.literal("direct"),
            user_ids: z.array(z.number()),
        }),
    ]),
});

type TypingMessageEditEvent = z.output<typeof typing_edit_message_event_schema>;

function get_users_typing_for_narrow(): number[] {
    if (narrow_state.narrowed_by_topic_reply()) {
        const current_stream_id = narrow_state.stream_id(narrow_state.filter(), true);
        const current_topic = narrow_state.topic();
        if (current_stream_id === undefined) {
            // Narrowed to a channel which doesn't exist.
            return [];
        }
        assert(current_topic !== undefined);
        return typing_data.get_topic_typists(current_stream_id, current_topic);
    }

    if (!narrow_state.narrowed_to_pms()) {
        // Narrow is neither "dm:" nor "is:dm" nor topic.
        return [];
    }

    // Narrow has a filter with either "dm:" or "is:dm".
    const current_filter = narrow_state.filter()!;
    if (current_filter.has_operator("dm")) {
        // Get list of users typing in this conversation
        const narrow_emails_string = current_filter.terms_with_operator("dm")[0]!.operand;
        if (!people.is_valid_bulk_emails_for_compose(narrow_emails_string.split(","))) {
            // Narrowed to an invalid direct message recipient.
            return [];
        }
        const narrow_user_ids = people.emails_string_to_user_ids(narrow_emails_string);
        const group = [...narrow_user_ids, current_user.user_id];
        return typing_data.get_group_typists(group);
    }
    // Get all users typing (in all direct message conversations with current user)
    return typing_data.get_all_direct_message_typists();
}

export function render_notifications_for_narrow(): void {
    const user_ids = get_users_typing_for_narrow();
    const users_typing = user_ids
        .map((user_id) => people.get_user_by_id_assert_valid(user_id))
        .filter((person) => !person.is_inaccessible_user);
    const num_of_users_typing = users_typing.length;

    if (num_of_users_typing === 0) {
        $("#typing_notifications").hide();
    } else {
        $("#typing_notifications").html(
            render_typing_notifications({
                users: users_typing,
                several_users: num_of_users_typing > MAX_USERS_TO_DISPLAY_NAME,
            }),
        );
        $("#typing_notifications").show();
    }
}

function apply_message_edit_notifications($row: JQuery, is_typing: boolean): void {
    const $editing_notifications = $row.find(".edit-notifications");
    if (is_typing) {
        $row.find(".message_edit_notice").addClass("hide");
        $editing_notifications.html(render_editing_notifications());
    } else {
        $row.find(".message_edit_notice").removeClass("hide");
        $editing_notifications.html("");
    }
}

export function render_message_editing_typing(message_id: number, is_typing: boolean): void {
    const $row = message_lists.current?.get_row(message_id);
    if ($row !== undefined) {
        apply_message_edit_notifications($row, is_typing);
    }
}

function get_key(event: TypingEvent): string {
    if (event.message_type === "stream") {
        return typing_data.get_topic_key(event.stream_id, event.topic);
    }
    if (event.message_type === "direct") {
        const recipients = event.recipients.map((user) => user.user_id);
        recipients.sort();
        return typing_data.get_direct_message_conversation_key(recipients);
    }
    throw new Error("Invalid typing notification type", event);
}

export function hide_notification(event: TypingEvent): void {
    const key = get_key(event);
    typing_data.clear_inbound_timer(key);

    const removed = typing_data.remove_typist(key, event.sender.user_id);

    if (removed) {
        render_notifications_for_narrow();
    }
}

export function hide_message_edit_notification(event: TypingMessageEditEvent): void {
    const message_id = event.message_id;
    const key = JSON.stringify(message_id);
    typing_data.clear_inbound_timer(key);
    const removed = typing_data.remove_edit_message_typing_id(message_id);
    if (removed) {
        render_message_editing_typing(message_id, false);
    }
}

export function display_notification(event: TypingEvent): void {
    const sender_id = event.sender.user_id;

    const key = get_key(event);
    typing_data.add_typist(key, sender_id);

    render_notifications_for_narrow();

    typing_data.kickstart_inbound_timer(
        key,
        realm.server_typing_started_expiry_period_milliseconds,
        () => {
            hide_notification(event);
        },
    );
}

export function display_message_edit_notification(event: TypingMessageEditEvent): void {
    const message_id = event.message_id;
    const key = JSON.stringify(message_id);
    typing_data.add_edit_message_typing_id(message_id);
    render_message_editing_typing(message_id, true);
    typing_data.kickstart_inbound_timer(
        key,
        realm.server_typing_started_expiry_period_milliseconds,
        () => {
            hide_message_edit_notification(event);
        },
    );
}

export function disable_typing_notification(): void {
    typing_data.clear_typing_data();
    render_notifications_for_narrow();
}
```

--------------------------------------------------------------------------------

---[FILE: typing_status.ts]---
Location: zulip-main/web/src/typing_status.ts

```typescript
import _ from "lodash";
import assert from "minimalistic-assert";

type StreamTopic = {
    stream_id: number;
    topic: string;
};
export type Recipient =
    | {
          message_type: "direct";
          notification_event_type: "typing";
          ids: number[];
      }
    | (StreamTopic & {
          message_type: "stream";
          notification_event_type: "typing";
      })
    | {
          notification_event_type: "typing_message_edit";
          message_id: number;
      };

type TypingStatusWorker = {
    get_current_time: () => number;
    notify_server_start: (recipient: Recipient) => void;
    notify_server_stop: (recipient: Recipient) => void;
};

export type EditingStatusWorker = {
    get_current_time: () => number;
    notify_server_editing_start: (recipient: Recipient) => void;
    notify_server_editing_stop: (recipient: Recipient) => void;
};

type TypingStatusState = {
    current_recipient: Recipient;
    next_send_start_time: number;
    idle_timer: ReturnType<typeof setTimeout>;
};

function lower_same(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase();
}

function same_stream_and_topic(a: StreamTopic, b: StreamTopic): boolean {
    // Streams and topics are case-insensitive.
    return a.stream_id === b.stream_id && lower_same(a.topic, b.topic);
}

function same_recipient(a: Recipient | null, b: Recipient | null): boolean {
    if (a === null || b === null) {
        return false;
    }

    if (a.notification_event_type === "typing" && b.notification_event_type === "typing") {
        if (a.message_type === "direct" && b.message_type === "direct") {
            // direct message recipients
            return _.isEqual(a.ids, b.ids);
        } else if (a.message_type === "stream" && b.message_type === "stream") {
            // stream recipients
            return same_stream_and_topic(a, b);
        }
    }
    return false;
}

/** Exported only for tests. */
export let state: TypingStatusState | null = null;
export const editing_state = new Map<number, TypingStatusState>();

export function rewire_state(value: typeof state): void {
    state = value;
}

/** Exported only for tests. */
export let stop_last_notification = (worker: TypingStatusWorker): void => {
    assert(state !== null, "State object should not be null here.");
    clearTimeout(state.idle_timer);
    worker.notify_server_stop(state.current_recipient);
    state = null;
};

export function stop_notification_for_message_edit(
    worker: EditingStatusWorker,
    message_id: number,
): void {
    const state = editing_state.get(message_id);
    if (state !== undefined) {
        clearTimeout(state.idle_timer);
        worker.notify_server_editing_stop(state.current_recipient);
        editing_state.delete(message_id);
    }
}

export function rewire_stop_last_notification(value: typeof stop_last_notification): void {
    stop_last_notification = value;
}

/** Exported only for tests. */
export let start_or_extend_idle_timer = (
    worker: TypingStatusWorker,
    typing_stopped_wait_period: number,
): ReturnType<typeof setTimeout> => {
    function on_idle_timeout(): void {
        // We don't do any real error checking here, because
        // if we've been idle, we need to tell folks, and if
        // our current recipients has changed, previous code will
        // have stopped the timer.
        stop_last_notification(worker);
    }

    if (state?.idle_timer) {
        clearTimeout(state.idle_timer);
    }
    return setTimeout(on_idle_timeout, typing_stopped_wait_period);
};

function start_or_extend_idle_timer_for_message_edit(
    worker: EditingStatusWorker,
    message_id: number,
    typing_stopped_wait_period: number,
): ReturnType<typeof setTimeout> {
    function on_idle_timeout(): void {
        // We don't do any real error checking here, because
        // if we've been idle, we need to tell folks, and if
        // our current recipients has changed, previous code will
        // have stopped the timer.
        stop_notification_for_message_edit(worker, message_id);
    }
    const state = editing_state.get(message_id);
    if (state?.idle_timer) {
        clearTimeout(state.idle_timer);
    }

    return setTimeout(on_idle_timeout, typing_stopped_wait_period);
}

export function rewire_start_or_extend_idle_timer(value: typeof start_or_extend_idle_timer): void {
    start_or_extend_idle_timer = value;
}

function set_next_start_time(current_time: number, typing_started_wait_period: number): void {
    assert(state !== null, "State object should not be null here.");
    state.next_send_start_time = current_time + typing_started_wait_period;
}

function set_next_start_time_for_message_edit(
    current_time: number,
    typing_started_wait_period: number,
    message_id: number,
): void {
    const state = editing_state.get(message_id);
    assert(state !== undefined);
    state.next_send_start_time = current_time + typing_started_wait_period;
    editing_state.set(message_id, state);
}

// Exported for tests
export let actually_ping_server = (
    worker: TypingStatusWorker,
    recipient: Recipient,
    current_time: number,
    typing_started_wait_period: number,
): void => {
    worker.notify_server_start(recipient);
    set_next_start_time(current_time, typing_started_wait_period);
};

function actually_ping_server_for_message_edit(
    worker: EditingStatusWorker,
    recipient: Recipient,
    current_time: number,
    typing_started_wait_period: number,
): void {
    assert(recipient.notification_event_type === "typing_message_edit");
    worker.notify_server_editing_start(recipient);
    set_next_start_time_for_message_edit(
        current_time,
        typing_started_wait_period,
        recipient.message_id,
    );
}

export function rewire_actually_ping_server(value: typeof actually_ping_server): void {
    actually_ping_server = value;
}

/** Exported only for tests. */
export let maybe_ping_server = (
    worker: TypingStatusWorker,
    recipient: Recipient,
    typing_started_wait_period: number,
): void => {
    assert(state !== null, "State object should not be null here.");
    const current_time = worker.get_current_time();
    if (current_time > state.next_send_start_time) {
        actually_ping_server(worker, recipient, current_time, typing_started_wait_period);
    }
};

export function maybe_ping_server_for_message_edit(
    worker: EditingStatusWorker,
    recipient: Recipient,
    typing_started_wait_period: number,
): void {
    assert(recipient.notification_event_type === "typing_message_edit");
    const state = editing_state.get(recipient.message_id);
    assert(state !== undefined);
    const current_time = worker.get_current_time();
    if (current_time > state.next_send_start_time) {
        actually_ping_server_for_message_edit(
            worker,
            recipient,
            current_time,
            typing_started_wait_period,
        );
    }
}
export function rewire_maybe_ping_server(value: typeof maybe_ping_server): void {
    maybe_ping_server = value;
}

/**
 * Update our state machine, and the server as needed, on the user's typing status.
 *
 * This can and should be called frequently, on each keystroke.  The
 * implementation sends "still typing" notices at an appropriate throttled
 * rate, and keeps a timer to send a "stopped typing" notice when the user
 * hasn't typed for a few seconds.
 *
 * Call with `new_recipient` as `null` when the user actively stops
 * composing a message.  If the user switches from one set of recipients to
 * another, there's no need to call with `null` in between; the
 * implementation tracks the change and behaves appropriately.
 *
 * See docs/subsystems/typing-indicators.md for detailed background on the
 * typing indicators system.
 *
 * @param {*} worker Callbacks for reaching the real world. See typing.ts
 *   for implementations.
 * @param {*} new_recipient Depends on type of message being composed. If
 *   * Direct message: An Object containing id of users the DM being composed is addressed to
 *    and a message_type="direct" property.
 *   * Stream message: An Object containing stream_id, topic and message_type="stream".
 *   * No message is being composed: `null`
 */
export function update(
    worker: TypingStatusWorker,
    new_recipient: Recipient | null,
    typing_started_wait_period: number,
    typing_stopped_wait_period: number,
): void {
    if (state !== null) {
        if (same_recipient(new_recipient, state.current_recipient)) {
            // Nothing has really changed, except we may need
            // to send a ping to the server.
            maybe_ping_server(worker, new_recipient!, typing_started_wait_period);

            // We can also extend out our idle time.
            state.idle_timer = start_or_extend_idle_timer(worker, typing_stopped_wait_period);

            return;
        }

        // We apparently stopped talking to our old recipients,
        // so we must stop the old notification.  Don't return
        // yet, because we may have new recipients.
        stop_last_notification(worker);
    }

    if (new_recipient === null) {
        // If we are not talking to somebody we care about,
        // then there is no more action to take.
        return;
    }

    // We just started talking to these recipients, so notify
    // the server.
    state = {
        current_recipient: new_recipient,
        next_send_start_time: 0,
        idle_timer: start_or_extend_idle_timer(worker, typing_stopped_wait_period),
    };
    const current_time = worker.get_current_time();
    actually_ping_server(worker, new_recipient, current_time, typing_started_wait_period);
}

export function update_editing_status(
    edit_box_worker: EditingStatusWorker,
    new_recipient: Recipient,
    new_status: "start" | "stop",
    typing_started_wait_period: number,
    typing_stopped_wait_period: number,
): void {
    assert(new_recipient.notification_event_type === "typing_message_edit");
    const message_id = new_recipient.message_id;

    if (new_status === "stop") {
        stop_notification_for_message_edit(edit_box_worker, message_id);
        return;
    }

    if (editing_state.has(message_id)) {
        // Nothing has really changed, except we may need to extend out our idle time.
        const state = editing_state.get(message_id)!;
        state.idle_timer = start_or_extend_idle_timer_for_message_edit(
            edit_box_worker,
            message_id,
            typing_stopped_wait_period,
        );

        // We may need to send a ping to the server too.
        maybe_ping_server_for_message_edit(
            edit_box_worker,
            new_recipient,
            typing_started_wait_period,
        );
        return;
    }

    const edit_state: TypingStatusState = {
        current_recipient: new_recipient,
        next_send_start_time: 0,
        idle_timer: start_or_extend_idle_timer_for_message_edit(
            edit_box_worker,
            message_id,
            typing_stopped_wait_period,
        ),
    };

    editing_state.set(message_id, edit_state);
    const current_time = edit_box_worker.get_current_time();
    actually_ping_server_for_message_edit(
        edit_box_worker,
        new_recipient,
        current_time,
        typing_started_wait_period,
    );
}
```

--------------------------------------------------------------------------------

````

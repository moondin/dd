---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 642
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 642 of 1290)

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

---[FILE: message_scroll.ts]---
Location: zulip-main/web/src/message_scroll.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import * as compose_banner from "./compose_banner.ts";
import * as message_fetch from "./message_fetch.ts";
import * as message_lists from "./message_lists.ts";
import * as message_scroll_state from "./message_scroll_state.ts";
import * as message_viewport from "./message_viewport.ts";
import * as narrow_state from "./narrow_state.ts";
import * as unread from "./unread.ts";
import * as unread_ops from "./unread_ops.ts";
import * as unread_ui from "./unread_ui.ts";
import {the} from "./util.ts";

let hide_scroll_to_bottom_timer: ReturnType<typeof setTimeout> | undefined;
export function hide_scroll_to_bottom(): void {
    const $show_scroll_to_bottom_button = $("#scroll-to-bottom-button-container");
    if (message_lists.current === undefined) {
        // Scroll to bottom button is not for non-message views.
        $show_scroll_to_bottom_button.removeClass("show");
        return;
    }

    if (
        message_viewport.bottom_rendered_message_visible() ||
        message_lists.current.visibly_empty()
    ) {
        // If last message is visible, just hide the
        // scroll to bottom button.
        $show_scroll_to_bottom_button.removeClass("show");
        return;
    }

    // Wait before hiding to allow user time to click on the button.
    hide_scroll_to_bottom_timer = setTimeout(() => {
        // Don't hide if user is hovered on it.
        if (
            !narrow_state.narrowed_by_topic_reply() &&
            !the($show_scroll_to_bottom_button).matches(":hover")
        ) {
            $show_scroll_to_bottom_button.removeClass("show");
        }
    }, 3000);
}

export function show_scroll_to_bottom_button(): void {
    if (message_viewport.bottom_rendered_message_visible()) {
        // Only show scroll to bottom button when
        // last message is not visible in the
        // current scroll position.
        return;
    }

    clearTimeout(hide_scroll_to_bottom_timer);
    $("#scroll-to-bottom-button-container").addClass("show");
}

$(document).on("keydown", (e) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
        return;
    }

    // Hide scroll to bottom button on any keypress.
    // Keyboard users are very less likely to use this button.
    $("#scroll-to-bottom-button-container").removeClass("show");
});

export function scroll_finished(): void {
    message_scroll_state.set_actively_scrolling(false);
    hide_scroll_to_bottom();

    if (message_lists.current === undefined) {
        return;
    }

    // It's possible that we are in transit and message_lists.current is not defined.
    // We still want the rest of the code to run but it's fine to skip this.
    message_lists.current.view.update_sticky_recipient_headers();

    if (compose_banner.scroll_to_message_banner_message_id !== null) {
        const $message_row = message_lists.current.get_row(
            compose_banner.scroll_to_message_banner_message_id,
        );
        if ($message_row.length > 0 && !message_viewport.is_message_below_viewport($message_row)) {
            compose_banner.clear_message_sent_banners(false);
        }
    }

    if (message_scroll_state.update_selection_on_next_scroll) {
        message_viewport.keep_pointer_in_view();
        // If we don't want to update message selection on this scroll,
        // we also don't want to mark any visible messages as read and
        // are waiting on user input to do so. So, we only mark messages
        // as read if we are updating selection on this scroll.
        //
        // When the window scrolls, it may cause some messages to
        // enter the screen and become read.  Calling
        // unread_ops.process_visible will update necessary
        // data structures and DOM elements.
        unread_ops.process_visible();
    } else {
        message_scroll_state.set_update_selection_on_next_scroll(true);
    }

    if (message_lists.current.view.should_fetch_older_messages()) {
        // Subtle note: While we've only checked that we're at the
        // very top of the render window (i.e. there may be some more
        // cached messages to render), it's a good idea to fetch
        // additional message history even if we're not actually at
        // the edge of what we already have from the server.
        message_fetch.maybe_load_older_messages({
            msg_list: message_lists.current,
            msg_list_data: message_lists.current.data,
        });
    }

    if (message_lists.current.view.should_fetch_newer_messages()) {
        // See the similar message_viewport.at_rendered_top block.
        message_fetch.maybe_load_newer_messages({
            msg_list: message_lists.current,
        });
    }
}

let scroll_timer: ReturnType<typeof setTimeout> | undefined;
function scroll_finish(): void {
    message_scroll_state.set_actively_scrolling(true);

    // Don't present the "scroll to bottom" widget if the current
    // scroll was triggered by the keyboard.
    if (!message_scroll_state.keyboard_triggered_current_scroll) {
        show_scroll_to_bottom_button();
    }
    message_scroll_state.set_keyboard_triggered_current_scroll(false);

    clearTimeout(scroll_timer);
    scroll_timer = setTimeout(scroll_finished, 100);
}

export function initialize(): void {
    $(document).on(
        "scroll",
        _.throttle(() => {
            if (message_lists.current === undefined) {
                return;
            }

            message_lists.current.view.update_sticky_recipient_headers();
            scroll_finish();
        }, 50),
    );

    // Scroll handler that marks messages as read when you scroll past them.
    $(document).on("message_selected.zulip", (event) => {
        if (event.id === -1) {
            return;
        }

        if (event.mark_read && event.previously_selected_id !== -1) {
            // Mark messages between old pointer and new pointer as read
            if (event.id < event.previously_selected_id) {
                // We don't mark messages as read when the pointer moves up.
                return;
            }

            const messages = event.msg_list.message_range(event.previously_selected_id, event.id);
            // If the user just arrived at the message `event.id`, we don't mark it as read
            // unless it is the last message in the list.
            // We only mark messages as read when the pointer moves past the message.
            // This is likely the last message in the list. So, we loop through the messages
            // in reverse order to find the message.
            for (let i = messages.length - 1; i >= 0; i -= 1) {
                if (messages[i]!.id === event.id && event.id !== event.msg_list.last()?.id) {
                    messages.splice(i, 1);
                    break;
                }
            }

            if (event.msg_list.can_mark_messages_read()) {
                unread_ops.notify_server_messages_read(messages, {from: "pointer"});
            } else if (
                unread.get_unread_messages(messages).length > 0 &&
                // The below checks might seem redundant, but it's
                // possible this logic, which runs after a delay, lost
                // a race with switching to another view, like Recent
                // Topics, and we don't want to display this banner
                // in such a view.
                //
                // This can likely be fixed more cleanly with another approach.
                narrow_state.filter() !== undefined &&
                message_lists.current === event.msg_list
            ) {
                unread_ui.notify_messages_remain_unread();
            }
        }
    });

    const $show_scroll_to_bottom_button = $("#scroll-to-bottom-button-container").expectOne();
    // Delete the tippy tooltip whenever the fadeout animation for
    // this button is finished. This is necessary because the fading animation
    // confuses Tippy's built-in `data-reference-hidden` feature.
    $show_scroll_to_bottom_button.on("transitionend", (e) => {
        assert(e.originalEvent instanceof TransitionEvent);
        if (e.originalEvent.propertyName === "visibility") {
            const tooltip = the(
                $<tippy.ReferenceElement>("#scroll-to-bottom-button-clickable-area"),
            )._tippy;
            // make sure the tooltip exists and the class is not currently showing
            if (tooltip && !$show_scroll_to_bottom_button.hasClass("show")) {
                tooltip.destroy();
            }
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: message_scroll_state.ts]---
Location: zulip-main/web/src/message_scroll_state.ts

```typescript
// Tracks whether the next scroll that will complete is initiated by
// code, not the user, and thus should avoid moving the selected
// message.
export let update_selection_on_next_scroll = true;

export function set_update_selection_on_next_scroll(value: boolean): void {
    update_selection_on_next_scroll = value;
}

// Whether a keyboard shortcut is triggering a message feed scroll event.
export let keyboard_triggered_current_scroll = false;

export function set_keyboard_triggered_current_scroll(value: boolean): void {
    keyboard_triggered_current_scroll = value;
}

// Whether a scroll is currently occurring.
export let actively_scrolling = false;

export function set_actively_scrolling(value: boolean): void {
    actively_scrolling = value;
}
```

--------------------------------------------------------------------------------

---[FILE: message_store.ts]---
Location: zulip-main/web/src/message_store.ts
Signals: Zod

```typescript
import _ from "lodash";
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import type {RawLocalMessage} from "./echo.ts";
import type {LocalMessage, NewMessage, ProcessedMessage} from "./message_helper.ts";
import type {TimeFormattedReminder} from "./message_reminder.ts";
import * as people from "./people.ts";
import {topic_link_schema} from "./types.ts";
import type {UserStatusEmojiInfo} from "./user_status.ts";
import * as util from "./util.ts";

const stored_messages = new Map<number, ProcessedMessage>();

const matched_message_schema = z.object({
    match_content: z.optional(z.string()),
    match_subject: z.optional(z.string()),
});

export type MatchedMessage = z.infer<typeof matched_message_schema>;

const message_reaction_type_schema = z.enum(["unicode_emoji", "realm_emoji", "zulip_extra_emoji"]);

export type MessageReactionType = z.infer<typeof message_reaction_type_schema>;

const display_recipient_user_schema = z.object({
    email: z.string(),
    full_name: z.string(),
    id: z.number(),
});

export type DisplayRecipientUser = z.infer<typeof display_recipient_user_schema>;

const display_recipient_schema = z.union([z.string(), z.array(display_recipient_user_schema)]);

export type DisplayRecipient = z.infer<typeof display_recipient_schema>;

const message_edit_history_entry_schema = z.object({
    user_id: z.nullable(z.number()),
    timestamp: z.number(),
    prev_content: z.optional(z.string()),
    prev_rendered_content: z.optional(z.string()),
    prev_stream: z.optional(z.number()),
    prev_topic: z.optional(z.string()),
    stream: z.optional(z.number()),
    topic: z.optional(z.string()),
});

export type MessageEditHistoryEntry = z.infer<typeof message_edit_history_entry_schema>;

const message_reaction_schema = z.object({
    emoji_name: z.string(),
    emoji_code: z.string(),
    reaction_type: message_reaction_type_schema,
    user_id: z.number(),
});

export type MessageReaction = z.infer<typeof message_reaction_schema>;

export const submessage_schema = z.object({
    id: z.number(),
    sender_id: z.number(),
    message_id: z.number(),
    content: z.string(),
    msg_type: z.string(),
});

export const raw_message_schema = z.intersection(
    z.intersection(
        z.object({
            avatar_url: z.nullable(z.string()),
            client: z.string(),
            content: z.string(),
            content_type: z.literal("text/html"),
            display_recipient: display_recipient_schema,
            edit_history: z.optional(z.array(message_edit_history_entry_schema)),
            id: z.number(),
            is_me_message: z.boolean(),
            last_edit_timestamp: z.optional(z.number()),
            last_moved_timestamp: z.optional(z.number()),
            reactions: z.array(message_reaction_schema),
            sender_email: z.string(),
            sender_full_name: z.string(),
            sender_id: z.number(),
            // The web app doesn't use sender_realm_str; ignore.
            // sender_realm_str: z.string(),
            submessages: z.array(submessage_schema),
            timestamp: z.number(),
            flags: z.array(z.string()),
        }),
        z.discriminatedUnion("type", [
            z.object({
                type: z.literal("private"),
                topic_links: z.optional(z.array(z.undefined())),
            }),
            z.object({
                type: z.literal("stream"),
                stream_id: z.number(),
                // Messages that come from the server use `subject`.
                // Messages that come from `send_message` use `topic`.
                subject: z.optional(z.string()),
                topic: z.optional(z.string()),
                topic_links: z.array(topic_link_schema),
            }),
        ]),
    ),
    matched_message_schema,
);

export type RawMessage = z.infer<typeof raw_message_schema>;

// We add these boolean properties to Raw message in
// `message_store.convert_raw_message_to_message_with_booleans` method.
type Booleans = {
    unread: boolean;
    historical: boolean;
    starred: boolean;
    mentioned: boolean;
    mentioned_me_directly: boolean;
    stream_wildcard_mentioned: boolean;
    topic_wildcard_mentioned: boolean;
    collapsed: boolean;
    condensed?: boolean;
    alerted: boolean;
};

type RawMessageWithBooleans = (
    | Omit<RawMessage & {type: "private"}, "flags">
    | Omit<RawMessage & {type: "stream"}, "flags">
) &
    Booleans;

type LocalMessageWithBooleans = (
    | Omit<RawLocalMessage & {type: "private"}, "flags">
    | Omit<RawLocalMessage & {type: "stream"}, "flags">
) &
    Booleans;

export type MessageWithBooleans = RawMessageWithBooleans | LocalMessageWithBooleans;

export type MessageCleanReaction = {
    class: string;
    count: number;
    emoji_alt_code: boolean;
    emoji_code: string;
    emoji_name: string;
    is_realm_emoji: boolean;
    label: string;
    local_id: string;
    reaction_type: "zulip_extra_emoji" | "realm_emoji" | "unicode_emoji";
    user_ids: number[];
    vote_text: string;
};

export type Message = (
    | Omit<RawMessageWithBooleans & {type: "private"}, "reactions">
    | Omit<RawMessageWithBooleans & {type: "stream"}, "reactions" | "subject">
) & {
    clean_reactions: Map<string, MessageCleanReaction>;

    // Local echo state cluster of fields.
    locally_echoed?: boolean;
    failed_request?: boolean;
    show_slow_send_spinner?: boolean;
    resend?: boolean;
    local_id?: string;

    // The original markup for the message, which we'll have if we
    // sent it or if we fetched it (usually, because the current user
    // tried to edit the message).
    raw_content?: string | undefined;

    // Added in `message_helper.process_new_message`.
    sent_by_me: boolean;
    reply_to: string;

    // These properties are set and used in `message_list_view.ts`.
    // TODO: It would be nice if we could not store these on the message
    // object and only reference them within `message_list_view`.
    message_reactions?: MessageCleanReaction[];
    url?: string;

    // Used in `markdown.js`, `server_events.js`, and
    // `convert_raw_message_to_message_with_booleans`
    flags?: string[];

    // Used in `message_avatar.hbs` to render sender avatar in
    // message list.
    small_avatar_url?: string | null;

    // Used in `message_body.hbs` to show sender status emoji alongside
    // their name in message list.
    status_emoji_info?: UserStatusEmojiInfo | undefined;

    // Used for edited messages to show their last edit time.
    local_edit_timestamp?: number;

    // Used in message_notifications to track if a notification has already
    // been sent for this message.
    notification_sent?: boolean;

    // Added during message rendering in message_list_view.ts. Should
    // never be accessed outside rendering, as the value may be stale.
    reminders?: TimeFormattedReminder[] | undefined;
} & (
        | {
              type: "private";
              is_private: true;
              is_stream: false;
              pm_with_url: string;
              to_user_ids: string;
              display_reply_to: string;
          }
        | {
              type: "stream";
              is_private: false;
              is_stream: true;
              stream: string;
              topic: string;
              display_reply_to: undefined;
          }
    );

export function update_message_cache(message_data: ProcessedMessage): void {
    // You should only call this from message_helper (or in tests).
    stored_messages.set(message_data.message.id, message_data);
}

export function get_cached_message(message_id: number): ProcessedMessage | undefined {
    // You should only call this from message_helper.
    // Use the get() wrapper below for most other use cases.
    return stored_messages.get(message_id);
}

export function clear_for_testing(): void {
    stored_messages.clear();
}

// This can return a LocalMessage, but unless anything needs that,
// it's easier to type it as just returning a Message.
// TODO: If we finish converting to typescript and find that
// nothing needs LocalMessage, explicitly remove its extra fields
// here before returning the Message.
export function get(message_id: number): Message | undefined {
    return stored_messages.get(message_id)?.message;
}

export function get_pm_emails(
    message: Message | MessageWithBooleans | LocalMessageWithBooleans,
): string {
    const user_ids = people.pm_with_user_ids(message) ?? [];
    const emails = user_ids.map((user_id) => {
        const person = people.maybe_get_user_by_id(user_id);
        if (!person) {
            blueslip.error("Unknown user id", {user_id});
            return "?";
        }
        return person.email;
    });
    emails.sort();

    return emails.join(", ");
}

export function get_pm_full_names(user_ids: number[]): string {
    user_ids = people.sorted_other_user_ids(user_ids);
    const sorted_names = people.get_display_full_names(user_ids);
    sorted_names.sort(util.make_strcmp());

    return sorted_names.join(", ");
}

export function convert_raw_message_to_message_with_booleans(opts: NewMessage):
    | {
          type: "server_message";
          message: RawMessageWithBooleans;
      }
    | {
          type: "local_message";
          message: LocalMessageWithBooleans;
      } {
    const flags = opts.raw_message.flags ?? [];

    function convert_flag(flag_name: string): boolean {
        return flags.includes(flag_name);
    }

    const converted_flags = {
        unread: !convert_flag("read"),
        historical: convert_flag("historical"),
        starred: convert_flag("starred"),
        mentioned:
            convert_flag("mentioned") ||
            convert_flag("stream_wildcard_mentioned") ||
            convert_flag("topic_wildcard_mentioned"),
        mentioned_me_directly: convert_flag("mentioned"),
        stream_wildcard_mentioned: convert_flag("stream_wildcard_mentioned"),
        topic_wildcard_mentioned: convert_flag("topic_wildcard_mentioned"),
        collapsed: convert_flag("collapsed"),
        alerted: convert_flag("has_alert_word"),
    };

    // Once we have set boolean flags here, the `flags` attribute is
    // just a distraction, so we delete it.  (All the downstream code
    // uses booleans.)

    // We have to return these separately because of how the `MessageWithBooleans`
    // type is set up.
    if (opts.type === "local_message") {
        if (opts.raw_message.type === "private") {
            return {
                type: "local_message",
                message: {
                    ..._.omit(opts.raw_message, "flags"),
                    ...converted_flags,
                },
            };
        }
        return {
            type: "local_message",
            message: {
                ..._.omit(opts.raw_message, "flags"),
                ...converted_flags,
            },
        };
    }
    if (opts.raw_message.type === "private") {
        return {
            type: "server_message",
            message: {
                ..._.omit(opts.raw_message, "flags"),
                ...converted_flags,
            },
        };
    }
    return {
        type: "server_message",
        message: {
            ..._.omit(opts.raw_message, "flags"),
            ...converted_flags,
        },
    };
}

export function update_booleans(message: Message, flags: string[]): void {
    // When we get server flags for local echo or message edits,
    // we are vulnerable to race conditions, so only update flags
    // that are driven by message content.
    function convert_flag(flag_name: string): boolean {
        return flags.includes(flag_name);
    }

    message.mentioned =
        convert_flag("mentioned") ||
        convert_flag("stream_wildcard_mentioned") ||
        convert_flag("topic_wildcard_mentioned");
    message.mentioned_me_directly = convert_flag("mentioned");
    message.stream_wildcard_mentioned = convert_flag("stream_wildcard_mentioned");
    message.topic_wildcard_mentioned = convert_flag("topic_wildcard_mentioned");
    message.alerted = convert_flag("has_alert_word");
}

export function update_sender_full_name(user_id: number, new_name: string): void {
    for (const message_data of stored_messages.values()) {
        const message = message_data.message;
        if (message.sender_id && message.sender_id === user_id) {
            message.sender_full_name = new_name;
        }
    }
}

export function update_small_avatar_url(user_id: number, new_url: string | null): void {
    for (const message_data of stored_messages.values()) {
        const message = message_data.message;
        if (message.sender_id && message.sender_id === user_id) {
            message.small_avatar_url = new_url;
        }
    }
}

export function update_stream_name(stream_id: number, new_name: string): void {
    for (const message_data of stored_messages.values()) {
        const message = message_data.message;
        if (message.type === "stream" && message.stream_id === stream_id) {
            message.display_recipient = new_name;
        }
    }
}

export function update_status_emoji_info(
    user_id: number,
    new_info: UserStatusEmojiInfo | undefined,
): void {
    for (const message_data of stored_messages.values()) {
        const message = message_data.message;
        if (message.sender_id && message.sender_id === user_id) {
            message.status_emoji_info = new_info;
        }
    }
}

export function reify_message_id({old_id, new_id}: {old_id: number; new_id: number}): void {
    const message_data = stored_messages.get(old_id);
    if (message_data !== undefined) {
        const server_message: Message & Partial<LocalMessage> = message_data.message;
        if (message_data.type === "local_message") {
            // Important: Messages are managed as singletons, so
            // MessageListData objects may already have pointers to
            // the LocalMessage object for this message. So we must
            // convert the LocalMessage into a Message by dropping the
            // extra local echo/drafts fields, not by constructing a
            // new object with the new type.

            delete server_message.queue_id;
            delete server_message.draft_id;
            delete server_message.to;
            if (server_message.type === "private") {
                delete server_message.topic;
            }
        }
        server_message.id = new_id;
        server_message.locally_echoed = false;
        stored_messages.set(new_id, {type: "server_message", message: server_message});
        stored_messages.delete(old_id);
    }
}

export function update_message_content(message: Message, new_content: string): void {
    message.content = new_content;
}

export function remove(message_ids: number[]): void {
    for (const message_id of message_ids) {
        stored_messages.delete(message_id);
    }
}

export function get_message_ids_in_stream(stream_id: number): number[] {
    return [...stored_messages.values()]
        .filter(
            (message_data) =>
                message_data.message.type === "stream" &&
                message_data.message.stream_id === stream_id,
        )
        .map((message_data) => message_data.message.id);
}
```

--------------------------------------------------------------------------------

---[FILE: message_summary.ts]---
Location: zulip-main/web/src/message_summary.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import render_topic_summary from "../templates/topic_summary.hbs";

import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {Filter} from "./filter.ts";
import {$t} from "./i18n.ts";
import * as message_fetch from "./message_fetch.ts";
import * as rendered_markdown from "./rendered_markdown.ts";
import * as unread from "./unread.ts";
import * as unread_ops from "./unread_ops.ts";
import * as util from "./util.ts";

export function get_narrow_summary(channel_id: number, topic_name: string): void {
    const filter = new Filter([
        {operator: "channel", operand: `${channel_id}`},
        {operator: "topic", operand: topic_name},
    ]);
    const data = {narrow: message_fetch.get_narrow_for_message_fetch(filter)};
    const display_topic_name = util.get_final_topic_display_name(topic_name);
    const unread_topic_params = {
        html_submit_button: $t({defaultMessage: "Mark topic as read"}),
        html_exit_button: $t({defaultMessage: "Close"}),
        on_click() {
            unread_ops.mark_topic_as_read(channel_id, topic_name);
        },
        single_footer_button: false,
    };

    let params = {
        html_submit_button: $t({defaultMessage: "Close"}),
        on_click() {
            // Just close the modal, there is nothing else to do.
        },
        single_footer_button: true,
    };
    if (unread.topic_has_any_unread(channel_id, topic_name)) {
        params = {
            ...params,
            ...unread_topic_params,
        };
    }
    dialog_widget.launch({
        text_heading: display_topic_name,
        html_body: "",
        close_on_submit: true,
        id: "topic-summary-modal",
        footer_minor_text: $t({defaultMessage: "AI summaries may have errors."}),
        ...params,
        post_render() {
            const close_on_success = false;
            dialog_widget.submit_api_request(
                channel.get,
                "/json/messages/summary",
                data,
                {
                    success_continuation(response_data) {
                        const data = z.object({summary: z.string()}).parse(response_data);
                        const summary_markdown = data.summary;
                        const summary_html = render_topic_summary({
                            summary_markdown,
                        });
                        $("#topic-summary-modal .modal__content").addClass("rendered_markdown");
                        $("#topic-summary-modal .modal__content").html(summary_html);
                        rendered_markdown.update_elements(
                            $("#topic-summary-modal .modal__content"),
                        );
                    },
                },
                close_on_success,
            );
        },
    });
}
```

--------------------------------------------------------------------------------

---[FILE: message_user_ids.ts]---
Location: zulip-main/web/src/message_user_ids.ts

```typescript
/*
    We keep a set of user_ids for all people
    who have sent stream messages or who have
    been on direct messages sent by the user.

    We will use this in search to prevent really
    large result sets for realms that have lots
    of users who haven't sent messages recently.

    We'll likely eventually want to replace this with
    accessing some combination of data from recent_senders
    and pm_conversations for better accuracy.
*/
const user_set = new Set<number>();

export function clear_for_testing(): void {
    user_set.clear();
}

export function user_ids(): number[] {
    return [...user_set];
}

export function add_user_id(user_id: number): void {
    user_set.add(user_id);
}
```

--------------------------------------------------------------------------------

---[FILE: message_util.ts]---
Location: zulip-main/web/src/message_util.ts

```typescript
import assert from "minimalistic-assert";

import {all_messages_data} from "./all_messages_data.ts";
import * as message_lists from "./message_lists.ts";
import * as message_store from "./message_store.ts";
import type {Message} from "./message_store.ts";
import * as people from "./people.ts";
import * as pm_conversations from "./pm_conversations.ts";
import * as unread from "./unread.ts";
import * as unread_ui from "./unread_ui.ts";

type DirectMessagePermissionHints = {
    is_known_empty_conversation: boolean;
    is_local_echo_safe: boolean;
};

export function do_unread_count_updates(messages: Message[], expect_no_new_unreads = false): void {
    const any_new_unreads = unread.process_loaded_messages(messages, expect_no_new_unreads);

    if (any_new_unreads) {
        // The following operations are expensive, and thus should
        // only happen if we found any unread messages justifying it.
        unread_ui.update_unread_counts();
    }
}

export function get_count_of_messages_in_topic_sent_after_current_message(
    stream_id: number,
    topic: string,
    message_id: number,
): number {
    const all_messages = get_loaded_messages_in_topic(stream_id, topic);
    return all_messages.filter((msg) => msg.id >= message_id).length;
}

export function get_loaded_messages_in_topic(stream_id: number, topic: string): Message[] {
    return all_messages_data
        .all_messages_after_mute_filtering()
        .filter(
            (x) =>
                x.type === "stream" &&
                x.stream_id === stream_id &&
                x.topic.toLowerCase() === topic.toLowerCase(),
        );
}

export function get_messages_in_dm_conversations(user_ids_strings: Set<string>): Message[] {
    return all_messages_data
        .all_messages_after_mute_filtering()
        .filter((x) => x.type === "private" && user_ids_strings.has(x.to_user_ids));
}

export function get_max_message_id_in_stream(stream_id: number): number {
    let max_message_id = 0;
    for (const msg of all_messages_data.all_messages_after_mute_filtering()) {
        if (msg.type === "stream" && msg.stream_id === stream_id && msg.id > max_message_id) {
            max_message_id = msg.id;
        }
    }
    return max_message_id;
}

export function get_topics_for_message_ids(message_ids: number[]): Map<string, [number, string]> {
    const topics = new Map<string, [number, string]>(); // key = stream_id:topic
    for (const msg_id of message_ids) {
        // message_store still has data on deleted messages when this runs.
        const message = message_store.get(msg_id);
        if (message === undefined) {
            // We may not have the deleted message cached locally in
            // message_store; if so, we can just skip processing it.
            continue;
        }
        if (message.type === "stream") {
            // Create unique keys for stream_id and topic.
            const topic_key = message.stream_id + ":" + message.topic;
            topics.set(topic_key, [message.stream_id, message.topic]);
        }
    }
    return topics;
}

export function get_direct_message_permission_hints(
    recipient_ids_string: string,
): DirectMessagePermissionHints {
    // Check if there are any previous messages in the DM conversation.
    const have_conversation_in_cache =
        pm_conversations.recent.has_conversation(recipient_ids_string);
    if (have_conversation_in_cache) {
        return {is_known_empty_conversation: false, is_local_echo_safe: true};
    }

    // If not, we need to check if the current filter matches the DM view we
    // are composing to.
    const dm_conversation =
        message_lists.current?.data?.filter.terms_with_operator("dm")[0]?.operand;
    if (dm_conversation) {
        const current_user_ids_string = people.emails_strings_to_user_ids_string(dm_conversation);
        assert(current_user_ids_string !== undefined);
        // If it matches and the messages for the current filter are fetched,
        // then there are certainly no messages in the conversation.
        if (
            people.pm_lookup_key(recipient_ids_string) ===
                people.pm_lookup_key(current_user_ids_string) &&
            message_lists.current?.data?.fetch_status.has_found_newest()
        ) {
            return {is_known_empty_conversation: true, is_local_echo_safe: true};
        }
    }

    // If it does not match, then there can be messages in the DM conversation
    // which are not fetched locally and hence we disable local echo for clean
    // error handling in case there are no messages in the conversation and
    // user is not allowed to initiate DM conversations.
    return {is_known_empty_conversation: false, is_local_echo_safe: false};
}

export function user_can_send_direct_message(user_ids_string: string): boolean {
    return (
        (!get_direct_message_permission_hints(user_ids_string).is_known_empty_conversation ||
            people.user_can_initiate_direct_message_thread(user_ids_string)) &&
        people.user_can_direct_message(user_ids_string)
    );
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 641
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 641 of 1290)

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

---[FILE: message_live_update.ts]---
Location: zulip-main/web/src/message_live_update.ts

```typescript
import * as message_lists from "./message_lists.ts";
import * as message_store from "./message_store.ts";
import type {UserStatusEmojiInfo} from "./user_status.ts";

export function rerender_messages_view(): void {
    for (const list of message_lists.all_rendered_message_lists()) {
        list.rerender_view();
    }
}

export function rerender_messages_view_by_message_ids(message_ids: number[]): void {
    const messages_to_render = [];
    for (const id of message_ids) {
        const message = message_store.get(id);
        if (message !== undefined) {
            messages_to_render.push(message);
        }
    }
    for (const list of message_lists.all_rendered_message_lists()) {
        list.view.rerender_messages(messages_to_render);
    }
}

function rerender_messages_view_for_user(user_id: number): void {
    for (const list of message_lists.all_rendered_message_lists()) {
        const messages = list.data.get_messages_sent_by_user(user_id);
        if (messages.length === 0) {
            continue;
        }
        list.view.rerender_messages(messages);
    }
}

export function update_message_in_all_views(
    message_id: number,
    callback: ($row: JQuery) => void,
): void {
    for (const msg_list of message_lists.all_rendered_message_lists()) {
        const $row = msg_list.get_row(message_id);
        if ($row === undefined) {
            // The row may not exist, e.g. if you do an action on a message in
            // a narrowed view
            continue;
        }
        callback($row);
    }
}

export function update_starred_view(message_id: number, new_value: boolean): void {
    const starred = new_value;

    // Avoid a full re-render, but update the star in each message
    // table in which it is visible.
    update_message_in_all_views(message_id, ($row) => {
        const $elt = $row.find(".star");
        const $star_container = $row.find(".star_container");
        if (starred) {
            $elt.addClass("zulip-icon-star-filled").removeClass("zulip-icon-star");
            $star_container.removeClass("empty-star");
        } else {
            $elt.removeClass("zulip-icon-star-filled").addClass("zulip-icon-star");
            $star_container.addClass("empty-star");
        }
        const data_template_id = starred
            ? "unstar-message-tooltip-template"
            : "star-message-tooltip-template";
        $star_container.attr("data-tooltip-template-id", data_template_id);
    });
}

export function update_stream_name(stream_id: number, new_name: string): void {
    message_store.update_stream_name(stream_id, new_name);
    rerender_messages_view();
}

export function update_user_full_name(user_id: number, full_name: string): void {
    message_store.update_sender_full_name(user_id, full_name);
    rerender_messages_view_for_user(user_id);
}

export function update_avatar(user_id: number, avatar_url: string | null): void {
    message_store.update_small_avatar_url(user_id, avatar_url);
    rerender_messages_view_for_user(user_id);
}

export function update_user_status_emoji(
    user_id: number,
    status_emoji_info: UserStatusEmojiInfo | undefined,
): void {
    message_store.update_status_emoji_info(user_id, status_emoji_info);
    rerender_messages_view_for_user(user_id);
}
```

--------------------------------------------------------------------------------

---[FILE: message_notifications.ts]---
Location: zulip-main/web/src/message_notifications.ts

```typescript
import $ from "jquery";

import * as alert_words from "./alert_words.ts";
import * as blueslip from "./blueslip.ts";
import * as desktop_notifications from "./desktop_notifications.ts";
import type {ElectronBridgeNotification} from "./desktop_notifications.ts";
import {$t} from "./i18n.ts";
import * as message_parser from "./message_parser.ts";
import type {Message} from "./message_store.ts";
import * as message_view from "./message_view.ts";
import * as people from "./people.ts";
import * as spoilers from "./spoilers.ts";
import * as stream_data from "./stream_data.ts";
import * as ui_util from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";
import * as user_topics from "./user_topics.ts";
import * as util from "./util.ts";

type TestNotificationMessage = {
    id: number;
    type: "test-notification";
    sender_email: string;
    sender_full_name: string;
    display_reply_to: string;
    content: string;
    unread: boolean;
    notification_sent?: boolean;
    // Needed for functions that handle Message
    is_me_message?: undefined;
    sent_by_me?: undefined;
    mentioned_me_directly?: undefined;
};

function small_avatar_url_for_test_notification(message: TestNotificationMessage): string {
    // this is a heavily simplified version of people.small_avatar_url
    return people.gravatar_url_for_email(message.sender_email);
}

function get_notification_content(message: Message | TestNotificationMessage): string {
    let content;
    // Convert the content to plain text, replacing emoji with their alt text
    const $content = $("<div>").html(message.content);
    ui_util.convert_unicode_eligible_emoji_to_unicode($content);
    ui_util.change_katex_to_raw_latex($content);
    ui_util.potentially_collapse_quotes($content);
    spoilers.hide_spoilers_in_notification($content);

    if (
        $content.text().trim() === "" &&
        (message_parser.message_has_image(message.content) ||
            message_parser.message_has_attachment(message.content))
    ) {
        content = $t({defaultMessage: "(attached file)"});
    } else {
        content = $content.text();
    }

    if (message.is_me_message) {
        content = message.sender_full_name + content.slice(3);
    }

    if (
        (message.type === "private" || message.type === "test-notification") &&
        !user_settings.pm_content_in_desktop_notifications
    ) {
        content = $t(
            {defaultMessage: "New direct message from {sender_full_name}"},
            {sender_full_name: message.sender_full_name},
        );
    }

    return content;
}

function debug_notification_source_value(message: Message | TestNotificationMessage): void {
    let notification_source;

    if (message.type === "private" || message.type === "test-notification") {
        notification_source = "pm";
    } else if (message.mentioned) {
        notification_source = "mention";
    } else if (message.alerted) {
        notification_source = "alert";
    } else {
        notification_source = "stream";
    }

    blueslip.debug("Desktop notification from source " + notification_source);
}

function get_notification_key(message: Message | TestNotificationMessage): string {
    if (message.type === "test-notification") {
        return `test:${message.display_reply_to}`;
    }

    if (message.type === "private") {
        return `dm:${message.to_user_ids}`;
    }

    return `channel:${message.sender_id}:${message.stream_id}:${message.topic}`;
}

function remove_sender_from_list_of_recipients(message: Message): string {
    return `, ${message.display_reply_to}, `
        .replace(`, ${message.sender_full_name}, `, ", ")
        .slice(", ".length, -", ".length);
}

function get_notification_title(
    message: Message | TestNotificationMessage,
    msg_count: number,
): string {
    let title_prefix = message.sender_full_name;
    let title_suffix = "";
    let other_recipients;
    let other_recipients_translated;

    if (msg_count > 1) {
        title_prefix = $t(
            {defaultMessage: "{msg_count} messages from {sender_name}"},
            {msg_count, sender_name: message.sender_full_name},
        );
    }

    switch (message.type) {
        case "private":
            if (message.display_recipient.length > 2) {
                other_recipients = remove_sender_from_list_of_recipients(message);
                // Same as compose_ui.compute_placeholder_text.
                other_recipients_translated = util.format_array_as_list(
                    other_recipients.split(", "),
                    "long",
                    "conjunction",
                );
                // Character limit taken from https://www.pushengage.com/push-notification-character-limits
                // We use a higher character limit so that the 3rd sender can at least be partially visible so that
                // the user can distinguish the group DM.
                // If the message has too many recipients to list them all...
                if (title_prefix.length + other_recipients_translated.length > 50) {
                    // Then count how many people are in the conversation and summarize
                    title_suffix = $t(
                        {defaultMessage: "(to you and {participants_count} more)"},
                        {participants_count: message.display_recipient.length - 2},
                    );
                } else {
                    title_suffix = $t(
                        {defaultMessage: "(to you and {other_participant_names})"},
                        {other_participant_names: other_recipients_translated},
                    );
                }
            } else {
                title_suffix = $t({defaultMessage: "(to you)"});
            }

            return title_prefix + " " + title_suffix;
        case "stream": {
            const stream_name = stream_data.get_stream_name_from_id(message.stream_id);
            const topic_display_name = util.get_final_topic_display_name(message.topic);
            title_suffix = " (#" + stream_name + " > " + topic_display_name + ")";
            break;
        }
    }

    return title_prefix + title_suffix;
}

export function process_notification(notification: {
    message: Message | TestNotificationMessage;
    desktop_notify: boolean;
}): void {
    const message = notification.message;
    const content = get_notification_content(message);
    const key = get_notification_key(message);
    let notification_object: ElectronBridgeNotification | Notification;
    let msg_count = 1;

    debug_notification_source_value(message);

    const notice_memory = desktop_notifications.notice_memory.get(key);
    if (notice_memory) {
        msg_count = notice_memory.msg_count + 1;
        notification_object = notice_memory.obj;
        notification_object.close();
    }

    const title = get_notification_title(message, msg_count);

    if (notification.desktop_notify && desktop_notifications.NotificationAPI !== undefined) {
        const icon_url =
            message.type === "test-notification"
                ? small_avatar_url_for_test_notification(message)
                : people.small_avatar_url(message);
        notification_object = new desktop_notifications.NotificationAPI(title, {
            icon: icon_url,
            body: content,
            tag: message.id.toString(),
        });
        desktop_notifications.notice_memory.set(key, {
            obj: notification_object,
            msg_count,
            message_id: message.id,
        });

        if (typeof notification_object.addEventListener === "function") {
            // Sadly, some third-party Electron apps like Franz/Ferdi
            // misimplement the Notification API not inheriting from
            // EventTarget.  This results in addEventListener being
            // unavailable for them.
            notification_object.addEventListener("click", () => {
                notification_object.close();
                if (message.type !== "test-notification") {
                    // Narrowing to message's near view helps to handle the case
                    // where a user clicked the notification, but before narrowing
                    // the message deletion got processed.
                    message_view.narrow_to_message_near(message, "notification");
                }
                window.focus();
            });
            notification_object.addEventListener("close", () => {
                const current_notice_memory = desktop_notifications.notice_memory.get(key);
                // This check helps avoid race between close event for current notification
                // object and the previous notification_object close handler.
                if (current_notice_memory?.obj === notification_object) {
                    desktop_notifications.notice_memory.delete(key);
                }
            });
        }
    }
}

export function message_is_notifiable(message: Message | TestNotificationMessage): boolean {
    // Independent of the user's notification settings, are there
    // properties of the message that unconditionally mean we
    // shouldn't notify about it.

    if (message.sent_by_me) {
        return false;
    }

    // If a message is edited multiple times, we want to err on the side of
    // not spamming notifications.
    if (message.notification_sent) {
        return false;
    }

    // @-<username> mentions take precedence over muted-ness. Note
    // that @all mentions are still suppressed by muting.
    if (message.mentioned_me_directly) {
        return true;
    }

    // Messages to followed topics take precedence over muted-ness.
    if (
        message.type === "stream" &&
        user_topics.is_topic_followed(message.stream_id, message.topic)
    ) {
        return true;
    }

    // Messages to unmuted topics in muted streams may generate desktop notifications.
    if (
        message.type === "stream" &&
        stream_data.is_muted(message.stream_id) &&
        !user_topics.is_topic_unmuted(message.stream_id, message.topic)
    ) {
        return false;
    }

    if (message.type === "stream" && user_topics.is_topic_muted(message.stream_id, message.topic)) {
        return false;
    }

    // Everything else is on the table; next filter based on notification
    // settings.
    return true;
}

export function should_send_desktop_notification(
    message: Message | TestNotificationMessage,
): boolean {
    // Always notify for testing notifications.
    if (message.type === "test-notification") {
        return true;
    }

    // For streams, send if desktop notifications are enabled for all
    // message on this stream.
    if (
        message.type === "stream" &&
        stream_data.receives_notifications(message.stream_id, "desktop_notifications")
    ) {
        return true;
    }

    // enable_followed_topic_desktop_notifications determines whether we pop up
    // a notification for messages in followed topics.
    if (
        message.type === "stream" &&
        user_topics.is_topic_followed(message.stream_id, message.topic) &&
        user_settings.enable_followed_topic_desktop_notifications
    ) {
        return true;
    }

    // enable_desktop_notifications determines whether we pop up a
    // notification for direct messages, mentions, and/or alerts.
    if (!user_settings.enable_desktop_notifications) {
        return false;
    }

    // And then we need to check if the message is a direct message,
    // mention, wildcard mention with wildcard_mentions_notify, or alert.
    if (message.type === "private") {
        return true;
    }

    if (alert_words.notifies(message)) {
        return true;
    }

    if (message.mentioned_me_directly) {
        return true;
    }

    // The following blocks for 'wildcard mentions' and 'Followed topic wildcard mentions'
    // should be placed below (as they are right now) the 'user_settings.enable_desktop_notifications'
    // block because the global, stream-specific, and followed topic wildcard mention
    // settings are wrappers around the personal-mention setting.
    // wildcard mentions
    if (
        message.mentioned &&
        stream_data.receives_notifications(message.stream_id, "wildcard_mentions_notify")
    ) {
        return true;
    }

    // Followed topic wildcard mentions
    if (
        message.mentioned &&
        user_topics.is_topic_followed(message.stream_id, message.topic) &&
        user_settings.enable_followed_topic_wildcard_mentions_notify
    ) {
        return true;
    }

    return false;
}

export function should_send_audible_notification(
    message: Message | TestNotificationMessage,
): boolean {
    // If `None` is selected as the notification sound, never send
    // audible notifications regardless of other configuration.
    if (user_settings.notification_sound === "none") {
        return false;
    }

    // For streams, ding if sounds are enabled for all messages on
    // this stream.
    if (
        message.type === "stream" &&
        stream_data.receives_notifications(message.stream_id, "audible_notifications")
    ) {
        return true;
    }

    // enable_followed_topic_audible_notifications determines whether we ding
    // for messages in followed topics.
    if (
        message.type === "stream" &&
        user_topics.is_topic_followed(message.stream_id, message.topic) &&
        user_settings.enable_followed_topic_audible_notifications
    ) {
        return true;
    }

    // enable_sounds determines whether we ding for direct messages,
    // mentions, and/or alerts.
    if (!user_settings.enable_sounds) {
        return false;
    }

    // And then we need to check if the message is a direct message,
    // mention, wildcard mention with wildcard_mentions_notify, or alert.
    if (message.type === "private" || message.type === "test-notification") {
        return true;
    }

    if (alert_words.notifies(message)) {
        return true;
    }

    if (message.mentioned_me_directly) {
        return true;
    }

    // The following blocks for 'wildcard mentions' and 'Followed topic wildcard mentions'
    // should be placed below (as they are right now) the 'user_settings.enable_sounds'
    // block because the global, stream-specific, and followed topic wildcard mention
    // settings are wrappers around the personal-mention setting.
    // wildcard mentions
    if (
        message.mentioned &&
        stream_data.receives_notifications(message.stream_id, "wildcard_mentions_notify")
    ) {
        return true;
    }

    // Followed topic wildcard mentions
    if (
        message.mentioned &&
        user_topics.is_topic_followed(message.stream_id, message.topic) &&
        user_settings.enable_followed_topic_wildcard_mentions_notify
    ) {
        return true;
    }

    return false;
}

export function received_messages(messages: (Message | TestNotificationMessage)[]): void {
    for (const message of messages) {
        if (!message_is_notifiable(message)) {
            continue;
        }
        if (!message.unread) {
            // The message is already read; Zulip is currently in focus.
            continue;
        }

        message.notification_sent = true;

        if (should_send_desktop_notification(message)) {
            process_notification({
                message,
                desktop_notify: desktop_notifications.granted_desktop_notifications_permission(),
            });
        }
        if (should_send_audible_notification(message)) {
            void ui_util.play_audio(util.the($("#user-notification-sound-audio")));
        }
    }
}

export function send_test_notification(content: string): void {
    received_messages([
        {
            id: Math.random(),
            type: "test-notification",
            sender_email: "notification-bot@zulip.com",
            sender_full_name: "Notification Bot",
            display_reply_to: "Notification Bot",
            content,
            unread: true,
        },
    ]);
}
```

--------------------------------------------------------------------------------

---[FILE: message_parser.ts]---
Location: zulip-main/web/src/message_parser.ts

```typescript
// We only use jquery for parsing.
import $ from "jquery";

import type {Message} from "./message_store.ts";

// We need to check if the message content contains the specified HTML
// elements.  We wrap the message.content in a <div>; this is
// important because $("Text <a>link</a>").find("a") returns nothing;
// one needs an outer element wrapping an object to use this
// construction.
function is_element_in_message_content(message_content: string, element_selector: string): boolean {
    return $(`<div>${message_content}</div>`).find(element_selector).length > 0;
}

export function message_has_link(message_content: string): boolean {
    return is_element_in_message_content(message_content, "a");
}

export function message_has_image(message_content: string): boolean {
    return is_element_in_message_content(message_content, ".message_inline_image");
}

export function message_has_attachment(message_content: string): boolean {
    return is_element_in_message_content(message_content, "a[href^='/user_uploads']");
}

export function message_has_reaction(message: Message): boolean {
    return message.clean_reactions.size > 0;
}
```

--------------------------------------------------------------------------------

---[FILE: message_reminder.ts]---
Location: zulip-main/web/src/message_reminder.ts
Signals: Zod

```typescript
import $ from "jquery";
import type * as z from "zod/mini";

import render_message_reminders from "../templates/message_reminders.hbs";

import * as channel from "./channel.ts";
import * as feedback_widget from "./feedback_widget.ts";
import {$t} from "./i18n.ts";
import * as message_lists from "./message_lists.ts";
import type {StateData, reminder_schema} from "./state_data.ts";
import * as timerender from "./timerender.ts";
import * as ui_report from "./ui_report.ts";

export type Reminder = z.infer<typeof reminder_schema>;

// Used to render reminders in message list.
export type TimeFormattedReminder = {
    reminder_id: number;
    formatted_delivery_time: string;
    scheduled_delivery_timestamp: number;
};

export const reminders_by_id = new Map<number, Reminder>();

export const reminders_by_message_id = new Map<number, TimeFormattedReminder[]>();

export function get_reminders(message_id: number): TimeFormattedReminder[] | undefined {
    return reminders_by_message_id.get(message_id);
}

export function set_message_reminder(send_at_time: number, message_id: number, note: string): void {
    channel.post({
        url: "/json/reminders",
        data: {
            message_id,
            scheduled_delivery_timestamp: send_at_time,
            note,
        },
        success(): void {
            const populate: (element: JQuery) => void = ($container) => {
                $container.html(
                    $t(
                        {defaultMessage: "Your reminder has been scheduled for {translated_time}."},
                        {
                            translated_time: timerender.get_full_datetime(
                                new Date(send_at_time * 1000),
                                "time",
                            ),
                        },
                    ),
                );
            };
            const title_text = $t({defaultMessage: "Reminder scheduled"});
            feedback_widget.show({
                populate,
                title_text,
                hide_delay: 6000,
            });
        },
        error(xhr: JQuery.jqXHR): void {
            ui_report.error($t({defaultMessage: "Failed"}), xhr, $("#home-error"), 2000);
        },
    });
}

export function add_reminders(reminders: Reminder[]): void {
    const message_ids_to_rerender = new Set<number>();
    for (const reminder of reminders) {
        message_ids_to_rerender.add(reminder.reminder_target_message_id);
        reminders_by_id.set(reminder.reminder_id, reminder);

        // Do all the formatting and sorting needed to display
        // reminders for a message to avoid doing at the time of render.
        const formatted_delivery_time = timerender.get_full_datetime(
            new Date(reminder.scheduled_delivery_timestamp * 1000),
            "time",
        );
        const time_formatted_reminder: TimeFormattedReminder = {
            reminder_id: reminder.reminder_id,
            formatted_delivery_time,
            scheduled_delivery_timestamp: reminder.scheduled_delivery_timestamp,
        };
        if (!reminders_by_message_id.has(reminder.reminder_target_message_id)) {
            reminders_by_message_id.set(reminder.reminder_target_message_id, [
                time_formatted_reminder,
            ]);
            continue;
        }
        const message_reminders = get_reminders(reminder.reminder_target_message_id)!;
        message_reminders.push(time_formatted_reminder);
        // Sort reminders to show the earliest one first.
        message_reminders.sort(
            (a, b) => a.scheduled_delivery_timestamp - b.scheduled_delivery_timestamp,
        );
    }

    for (const message_id of message_ids_to_rerender) {
        rerender_reminders_for_message(message_id);
    }
}

export function initialize(reminders_params: StateData["reminders"]): void {
    add_reminders(reminders_params.reminders);
}

export function remove_reminder(reminder_id: number): void {
    if (reminders_by_id.has(reminder_id)) {
        reminders_by_id.delete(reminder_id);

        for (const [message_id, message_reminders] of reminders_by_message_id) {
            const index = message_reminders.findIndex((r) => r.reminder_id === reminder_id);
            if (index !== -1) {
                message_reminders.splice(index, 1);
                if (message_reminders.length === 0) {
                    reminders_by_message_id.delete(message_id);
                }
                rerender_reminders_for_message(message_id);
                break;
            }
        }
    }
}

export function delete_reminder(reminder_id: number, success?: () => void): void {
    void channel.del({
        url: "/json/reminders/" + reminder_id,
        success,
    });
}

export function get_count(): number {
    return reminders_by_id.size;
}

export function rerender_reminders_for_message(message_id: number): void {
    const $rows = message_lists.all_rendered_row_for_message_id(message_id);
    if ($rows.length === 0) {
        return;
    }

    const message_reminders = get_reminders(message_id) ?? [];
    if (message_reminders.length === 0) {
        $rows.find(".message-reminders").remove();
        return;
    }

    const rendered_message_reminders_html = render_message_reminders({
        msg: {
            reminders: message_reminders,
        },
    });

    $rows.each(function () {
        const $row = $(this);
        const $existing = $row.find(".message-reminders");
        if ($existing.length > 0) {
            $existing.replaceWith($(rendered_message_reminders_html));
        } else {
            // Insert after reactions if they exist, otherwise after "more" section.
            const $content = $row.find(".messagebox-content");
            $content.append($(rendered_message_reminders_html));
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: message_report.ts]---
Location: zulip-main/web/src/message_report.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_report_message_modal from "../templates/report_message_modal.hbs";

import * as channel from "./channel.ts";
import * as condense from "./condense.ts";
import * as dialog_widget from "./dialog_widget.ts";
import type {Option} from "./dropdown_widget.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import {$t, $t_html} from "./i18n.ts";
import {
    type MessageContainer,
    type MessageGroup,
    get_timestr,
    populate_group_from_message,
} from "./message_list_view.ts";
import type {Message} from "./message_store.ts";
import * as people from "./people.ts";
import {update_elements} from "./rendered_markdown.ts";
import * as rows from "./rows.ts";
import {realm} from "./state_data.ts";
import {process_submessages} from "./submessage.ts";
import * as ui_report from "./ui_report.ts";
import {toggle_user_card_popover_for_message} from "./user_card_popover.ts";

function register_message_preview_click_handlers(
    $message_preview_container: JQuery,
    sender_id: number,
): void {
    // This function registers click handlers and mouseover effects
    // for the message sender in the message preview container.
    // The logic here is partly from message_list_hover.ts, and
    // partly from user_card_popover.ts.

    $message_preview_container.on("mouseover", ".sender_info_hover", function (this: HTMLElement) {
        const $row = $(this).closest(".message_row");
        $row.addClass("sender_info_hovered");
    });

    $message_preview_container.on("mouseout", ".sender_info_hover", function (this: HTMLElement) {
        const $row = $(this).closest(".message_row");
        $row.removeClass("sender_info_hovered");
    });

    $message_preview_container.on(
        "click",
        ".sender_name, .inline-profile-picture-wrapper",
        function (this: HTMLElement, e) {
            e.stopPropagation();
            const user = people.get_by_user_id(sender_id);
            toggle_user_card_popover_for_message(this, user, sender_id, true);
        },
    );
}

function get_message_group_for_message_preview(message: Message): MessageGroup {
    // This creates a simpler recipient_row without element like the
    // topic menu and topic visibility policy menu.
    const message_group = populate_group_from_message(message, false, false, undefined);
    if (message_group.is_stream) {
        message_group.user_can_resolve_topic = false;
        message_group.is_topic_editable = false;
    }
    return message_group;
}

function get_message_container_for_preview(message: Message): MessageContainer {
    const computed_variables = {
        include_sender: true,
        // Message report preview will be automatically collapsed
        is_hidden: false,
        msg: message,
        sender_is_bot: people.sender_is_bot(message),
        sender_is_deactivated: people.sender_is_deactivated(message),
        sender_is_guest: people.sender_is_guest(message),
        should_add_guest_indicator_for_sender: people.should_add_guest_user_indicator(
            message.sender_id,
        ),
        small_avatar_url: people.small_avatar_url(message),
        status_message: "",
        timestr: get_timestr(message),
        want_date_divider: false,
    };
    const unused_variables = {
        date_divider_html: undefined,
        edited: false,
        include_recipient: false,
        last_edit_timestamp: undefined,
        last_moved_timestamp: undefined,
        mention_classname: undefined,
        message_edit_notices_alongside_sender: false,
        message_edit_notices_for_status_message: false,
        message_edit_notices_in_left_col: false,
        modified: false,
        moved: false,
        year_changed: false,
    };
    return {
        ...computed_variables,
        ...unused_variables,
    };
}

function post_process_message_preview($row: JQuery): void {
    const $content = $row.find(".message_content");
    update_elements($content);
    const id = rows.id($row);
    process_submessages({
        $row,
        message_id: id,
    });
    // Disable most UI for interacting with message widget in the report
    // message preview UI.
    const $widget_content = $content.find(".widget-content");
    $widget_content.find("button, input, select").prop("disabled", true);
    $widget_content.find(".poll-edit-question, .poll-option-bar").hide();
}

export function show_message_report_modal(message: Message): void {
    const message_preview_body_args = get_message_container_for_preview(message);
    const html_body = render_report_message_modal({
        recipient_row_data: get_message_group_for_message_preview(message),
        message_container_data: {
            ...message_preview_body_args,
            message_list_id: "",
        },
    });
    let report_type_dropdown_widget: dropdown_widget.DropdownWidget;
    let $message_report_description: JQuery<HTMLTextAreaElement>;

    function message_report_post_render(): void {
        $message_report_description = $<HTMLTextAreaElement>("textarea#message-report-description");
        const $report_message_preview_container = $("#report-message-preview-container");

        function check_toggle_submit_button(): void {
            const selected_report_type = report_type_dropdown_widget.value();
            assert(selected_report_type !== undefined);
            const report_description = $message_report_description.val();
            const $submit_button = $(".dialog_submit_button");
            $submit_button.prop(
                "disabled",
                selected_report_type === "other" && !report_description,
            );
        }

        register_message_preview_click_handlers(
            $report_message_preview_container,
            message.sender_id,
        );

        post_process_message_preview($report_message_preview_container.find(".message_row"));
        // Condense the message preview, the main motivation is to hide the
        // potentially unpleasant message content.
        $report_message_preview_container.find(".message_content").addClass("collapsed");
        condense.show_message_expander(
            $report_message_preview_container,
            null,
            $t({defaultMessage: "Show message"}),
        );

        $report_message_preview_container.on("click", ".message_expander", (e) => {
            const $content = $report_message_preview_container.find(".message_content");
            if ($content.hasClass("collapsed")) {
                $content.removeClass("collapsed");
                condense.show_message_condenser(
                    $report_message_preview_container,
                    null,
                    $t({defaultMessage: "Hide message"}),
                );
            }
            e.preventDefault();
            e.stopPropagation();
        });

        $report_message_preview_container.on("click", ".message_condenser", (e) => {
            const $content = $report_message_preview_container.find(".message_content");
            if (!$content.hasClass("collapsed")) {
                $content.addClass("collapsed");
                condense.show_message_expander(
                    $report_message_preview_container,
                    null,
                    $t({defaultMessage: "Show message"}),
                );
            }
            e.preventDefault();
            e.stopPropagation();
        });
        function get_message_report_types(): Option[] {
            return realm.server_report_message_types.map((report_type) => ({
                unique_id: report_type.key,
                name: report_type.name,
            }));
        }

        $message_report_description.on("input", check_toggle_submit_button);

        function message_report_type_click_callback(
            event: JQuery.ClickEvent,
            dropdown: tippy.Instance,
        ): void {
            report_type_dropdown_widget.render();
            $(".report-type-wrapper").trigger("input");
            check_toggle_submit_button();
            dropdown.hide();
            event.preventDefault();
            event.stopPropagation();
        }

        report_type_dropdown_widget = new dropdown_widget.DropdownWidget({
            widget_name: "report_type_options",
            get_options: get_message_report_types,
            item_click_callback: message_report_type_click_callback,
            $events_container: $("#message_report_modal"),
            default_id: "spam",
            unique_id_type: "string",
        });
        report_type_dropdown_widget.setup();
        report_type_dropdown_widget.render();
    }

    function report_message(): void {
        const selected_report_type = report_type_dropdown_widget.value();
        assert(selected_report_type !== undefined);
        const report_description = $<HTMLTextAreaElement>("textarea#message-report-description")
            .val()!
            .trim();
        if (selected_report_type === "other" && !report_description) {
            ui_report.error(
                $t_html({defaultMessage: "Please explain why you are reporting this message."}),
                undefined,
                $("#dialog_error"),
            );
            dialog_widget.hide_dialog_spinner();
            return;
        }

        const data = {
            report_type: selected_report_type.toString(),
            description: report_description,
        };
        const url = "/json/messages/" + encodeURIComponent(message.id) + "/report";

        void channel.post({
            url,
            data,
            cache: false,
            success() {
                dialog_widget.close();
            },
            error(xhr) {
                ui_report.error($t_html({defaultMessage: "Failed"}), xhr, $("#dialog_error"));
                dialog_widget.hide_dialog_spinner();
            },
        });
    }

    dialog_widget.launch({
        html_heading: $t_html({
            defaultMessage: "Report a message",
        }),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Submit"}),
        help_link: "/help/report-a-message",
        id: "message_report_modal",
        form_id: "message_report_form",
        on_click: report_message,
        post_render: message_report_post_render,
        loading_spinner: true,
    });
}
```

--------------------------------------------------------------------------------

````

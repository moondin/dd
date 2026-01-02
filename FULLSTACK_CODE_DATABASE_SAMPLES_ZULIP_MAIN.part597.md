---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 597
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 597 of 1290)

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

---[FILE: compose_call.ts]---
Location: zulip-main/web/src/compose_call.ts

```typescript
import {realm} from "./state_data.ts";

export const zoom_token_callbacks = new Map();
export const video_call_xhrs = new Map<string, JQuery.jqXHR<unknown>>();

export function get_jitsi_server_url(): string | null {
    return realm.realm_jitsi_server_url ?? realm.server_jitsi_server_url;
}

export function abort_video_callbacks(edit_message_id = ""): void {
    zoom_token_callbacks.delete(edit_message_id);
    const xhr = video_call_xhrs.get(edit_message_id);
    if (xhr !== undefined) {
        xhr.abort();
        video_call_xhrs.delete(edit_message_id);
    }
}

export function compute_show_video_chat_button(): boolean {
    const available_providers = realm.realm_available_video_chat_providers;
    if (realm.realm_video_chat_provider === available_providers.disabled.id) {
        return false;
    }

    if (
        realm.realm_video_chat_provider === available_providers.jitsi_meet.id &&
        !get_jitsi_server_url()
    ) {
        return false;
    }

    return true;
}

export function compute_show_audio_chat_button(): boolean {
    const available_providers = realm.realm_available_video_chat_providers;
    if (
        (available_providers.jitsi_meet &&
            get_jitsi_server_url() !== null &&
            realm.realm_video_chat_provider === available_providers.jitsi_meet.id) ||
        (available_providers.zoom &&
            realm.realm_video_chat_provider === available_providers.zoom.id) ||
        (available_providers.big_blue_button &&
            realm.realm_video_chat_provider === available_providers.big_blue_button.id) ||
        (available_providers.zoom_server_to_server &&
            realm.realm_video_chat_provider === available_providers.zoom_server_to_server.id)
    ) {
        return true;
    }
    return false;
}
```

--------------------------------------------------------------------------------

---[FILE: compose_call_ui.ts]---
Location: zulip-main/web/src/compose_call_ui.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import * as channel from "./channel.ts";
import * as compose_banner from "./compose_banner.ts";
import * as compose_call from "./compose_call.ts";
import {get_recipient_label} from "./compose_closed_ui.ts";
import * as compose_ui from "./compose_ui.ts";
import {$t, $t_html} from "./i18n.ts";
import * as rows from "./rows.ts";
import {current_user, realm} from "./state_data.ts";
import * as ui_report from "./ui_report.ts";
import * as util from "./util.ts";

const call_response_schema = z.object({
    msg: z.string(),
    result: z.string(),
    url: z.string(),
});

export function update_audio_and_video_chat_button_display(): void {
    update_audio_chat_button_display();
    update_video_chat_button_display();
}

export function update_video_chat_button_display(): void {
    const show_video_chat_button = compose_call.compute_show_video_chat_button();
    $(".compose-control-buttons-container .video_link").toggle(show_video_chat_button);
    $(".message-edit-feature-group .video_link").toggle(show_video_chat_button);
}

export function update_audio_chat_button_display(): void {
    const show_audio_chat_button = compose_call.compute_show_audio_chat_button();
    $(".compose-control-buttons-container .audio_link").toggle(show_audio_chat_button);
    $(".message-edit-feature-group .audio_link").toggle(show_audio_chat_button);
}

function insert_video_call_url(url: string, $target_textarea: JQuery<HTMLTextAreaElement>): void {
    const link_text = $t({defaultMessage: "Join video call."});
    compose_ui.insert_syntax_and_focus(`[${link_text}](${url})`, $target_textarea, "block", 1);
}

function insert_audio_call_url(url: string, $target_textarea: JQuery<HTMLTextAreaElement>): void {
    const link_text = $t({defaultMessage: "Join voice call."});
    compose_ui.insert_syntax_and_focus(`[${link_text}](${url})`, $target_textarea, "block", 1);
}

export function generate_and_insert_audio_or_video_call_link(
    $target_element: JQuery,
    is_audio_call: boolean,
): void {
    let $target_textarea: JQuery<HTMLTextAreaElement>;
    let edit_message_id: string | undefined;
    if ($target_element.parents(".message_edit_form").length === 1) {
        edit_message_id = rows.id($target_element.parents(".message_row")).toString();
        $target_textarea = $(`#edit_form_${CSS.escape(edit_message_id)} .message_edit_content`);
    } else {
        $target_textarea = $<HTMLTextAreaElement>("textarea#compose-textarea");
    }

    const available_providers = realm.realm_available_video_chat_providers;
    const provider_is_zoom =
        available_providers.zoom && realm.realm_video_chat_provider === available_providers.zoom.id;
    const provider_is_zoom_server_to_server =
        available_providers.zoom_server_to_server &&
        realm.realm_video_chat_provider === available_providers.zoom_server_to_server.id;

    if (provider_is_zoom || provider_is_zoom_server_to_server) {
        compose_call.abort_video_callbacks(edit_message_id);
        const key = edit_message_id ?? "";

        const request = {
            is_video_call: !is_audio_call,
        };

        const make_zoom_call = (): void => {
            const xhr = channel.post({
                url: "/json/calls/zoom/create",
                data: request,
                success(res) {
                    const data = call_response_schema.parse(res);
                    compose_call.video_call_xhrs.delete(key);
                    if (is_audio_call) {
                        insert_audio_call_url(data.url, $target_textarea);
                    } else {
                        insert_video_call_url(data.url, $target_textarea);
                    }
                },
                error(xhr, status) {
                    compose_call.video_call_xhrs.delete(key);
                    const parsed = z.object({code: z.string()}).safeParse(xhr.responseJSON);
                    if (
                        status === "error" &&
                        parsed.success &&
                        parsed.data.code === "INVALID_ZOOM_TOKEN"
                    ) {
                        current_user.has_zoom_token = false;
                    }
                    if (
                        status === "error" &&
                        parsed.success &&
                        parsed.data.code === "UNKNOWN_ZOOM_USER"
                    ) {
                        compose_banner.show_unknown_zoom_user_error(current_user.delivery_email);
                    } else if (status !== "abort") {
                        ui_report.generic_embed_error(
                            $t_html({defaultMessage: "Failed to create video call."}),
                        );
                    }
                },
            });
            if (xhr !== undefined) {
                compose_call.video_call_xhrs.set(key, xhr);
            }
        };

        if (current_user.has_zoom_token || provider_is_zoom_server_to_server) {
            make_zoom_call();
        } else {
            compose_call.zoom_token_callbacks.set(key, make_zoom_call);
            window.open(
                window.location.protocol + "//" + window.location.host + "/calls/zoom/register",
                "_blank",
                "width=800,height=500,noopener,noreferrer",
            );
        }
    } else if (
        available_providers.big_blue_button &&
        realm.realm_video_chat_provider === available_providers.big_blue_button.id
    ) {
        const meeting_name = `${get_recipient_label()?.label_text ?? ""} meeting`;
        const request = {
            meeting_name,
            voice_only: is_audio_call,
        };
        void channel.get({
            url: "/json/calls/bigbluebutton/create",
            data: request,
            success(response) {
                const data = call_response_schema.parse(response);
                if (is_audio_call) {
                    insert_audio_call_url(data.url, $target_textarea);
                } else {
                    insert_video_call_url(data.url, $target_textarea);
                }
            },
        });
    } else {
        // TODO: Use `new URL` to generate the URLs here.
        const video_call_id = util.random_int(100000000000000, 999999999999999);
        const video_call_link = compose_call.get_jitsi_server_url() + "/" + video_call_id;
        if (is_audio_call) {
            insert_audio_call_url(
                video_call_link + "#config.startWithVideoMuted=true",
                $target_textarea,
            );
        } else {
            /* Because Jitsi remembers what last call type you joined
               in browser local storage, we need to specify that video
               should not be muted in the video call case, or your
               next call will also join without video after joining an
               audio-only call.

               This has the annoying downside that it requires users
               who have a personal preference to disable video every
               time, but Jitsi's UI makes that very easy to do, and
               that inconvenience is probably less important than letting
               the person organizing a call specify their intended
               call type (video vs audio).
           */
            insert_video_call_url(
                video_call_link + "#config.startWithVideoMuted=false",
                $target_textarea,
            );
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: compose_closed_ui.ts]---
Location: zulip-main/web/src/compose_closed_ui.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_reply_recipient_label from "../templates/reply_recipient_label.hbs";

import * as compose_actions from "./compose_actions.ts";
import {$t} from "./i18n.ts";
import * as inbox_util from "./inbox_util.ts";
import * as message_lists from "./message_lists.ts";
import * as message_store from "./message_store.ts";
import * as message_util from "./message_util.ts";
import * as narrow_state from "./narrow_state.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import * as recent_view_util from "./recent_view_util.ts";
import * as stream_data from "./stream_data.ts";
import * as util from "./util.ts";

type RecipientLabel = {
    label_text: string;
    has_empty_string_topic?: boolean;
    stream_name?: string;
    is_dm_with_self?: boolean;
};

function get_stream_recipient_label(stream_id: number, topic: string): RecipientLabel | undefined {
    const stream = stream_data.get_sub_by_id(stream_id);
    const topic_display_name = util.get_final_topic_display_name(topic);
    if (stream) {
        const recipient_label: RecipientLabel = {
            label_text: "#" + stream.name + " > " + topic_display_name,
            has_empty_string_topic: topic === "",
            stream_name: stream.name,
        };
        return recipient_label;
    }
    return undefined;
}

function get_direct_message_recipient_label(user_ids: number[]): RecipientLabel {
    let label_text = "";
    let is_dm_with_self = false;
    if (people.is_direct_message_conversation_with_self(user_ids)) {
        is_dm_with_self = true;
    } else {
        label_text = message_store.get_pm_full_names(user_ids);
    }
    const recipient_label: RecipientLabel = {
        label_text,
        is_dm_with_self,
    };
    return recipient_label;
}

export type ReplyRecipientInformation = {
    stream_id?: number | undefined;
    topic?: string | undefined;
    user_ids?: number[] | undefined;
    display_reply_to?: string | undefined;
};

export function get_recipient_label(
    recipient_information?: ReplyRecipientInformation,
): RecipientLabel | undefined {
    if (recipient_information !== undefined) {
        assert(recent_view_util.is_visible() || inbox_util.is_visible());
        // When we're in either the Inbox or Recent Conversations view,
        // we try to update the closed compose box button label with
        // information about the reply target from the focused row in
        // the view.
        if (
            recipient_information.stream_id !== undefined &&
            recipient_information.topic !== undefined
        ) {
            return get_stream_recipient_label(
                recipient_information.stream_id,
                recipient_information.topic,
            );
        }
        if (recipient_information.user_ids !== undefined) {
            return get_direct_message_recipient_label(recipient_information.user_ids);
        }
        if (recipient_information.display_reply_to !== undefined) {
            return {label_text: recipient_information.display_reply_to};
        }
    }

    // Otherwise, we check the current message list for information
    // about the reply target for the closed compose box button label.
    if (message_lists.current === undefined) {
        return undefined;
    }

    if (message_lists.current.visibly_empty()) {
        // For empty narrows where there's a clear reply target,
        // i.e. channel and topic or a direct message conversation,
        // we label the button as replying to the thread.
        const stream_id = narrow_state.stream_id(narrow_state.filter(), true);
        const topic = narrow_state.topic();
        const user_ids_string = narrow_state.pm_ids_string();
        if (stream_id !== undefined && topic !== undefined) {
            return get_stream_recipient_label(stream_id, topic);
        }
        if (user_ids_string !== undefined) {
            const user_ids = people.user_ids_string_to_ids_array(user_ids_string);
            return get_direct_message_recipient_label(user_ids);
        }
        // Show the standard button text for empty narrows without
        // a clear reply target, e.g., an empty search view.
        return undefined;
    }

    const selected_message = message_lists.current.selected_message();
    if (selected_message !== undefined) {
        if (selected_message?.is_stream) {
            return get_stream_recipient_label(selected_message.stream_id, selected_message.topic);
        }
        const user_ids = people.user_ids_string_to_ids_array(selected_message.to_user_ids);
        return get_direct_message_recipient_label(user_ids);
    }
    // Fall through to show the standard button text.
    return undefined;
}

// Exported for tests
export let update_reply_button_state = (disable = false): void => {
    $(".compose_reply_button").attr("disabled", disable ? "disabled" : null);
    if (disable) {
        if (maybe_get_selected_message_stream_id() !== undefined) {
            $("#compose_buttons .compose-reply-button-wrapper").attr(
                "data-reply-button-type",
                "stream_disabled",
            );
        } else {
            $("#compose_buttons .compose-reply-button-wrapper").attr(
                "data-reply-button-type",
                "direct_disabled",
            );
        }
        return;
    }
    if (narrow_state.is_message_feed_visible()) {
        $("#compose_buttons .compose-reply-button-wrapper").attr(
            "data-reply-button-type",
            "selected_message",
        );
    } else {
        $("#compose_buttons .compose-reply-button-wrapper").attr(
            "data-reply-button-type",
            "selected_conversation",
        );
    }
};

export function rewire_update_reply_button_state(value: typeof update_reply_button_state): void {
    update_reply_button_state = value;
}

function update_new_conversation_button(
    data_attribute_string: "direct" | "stream" | "non-specific",
): void {
    $("#new_conversation_button").attr("data-conversation-type", data_attribute_string);
}

function maybe_get_selected_message_stream_id(): number | undefined {
    if (message_lists.current?.visibly_empty()) {
        return undefined;
    }
    const selected_message = message_lists.current?.selected_message();
    if (!selected_message?.is_stream) {
        return undefined;
    }
    return selected_message.stream_id;
}

function should_disable_compose_reply_button_for_stream(): boolean {
    const stream_id = maybe_get_selected_message_stream_id();
    if (stream_id !== undefined && !page_params.is_spectator) {
        const stream = stream_data.get_sub_by_id(stream_id);
        if (stream && !stream_data.can_post_messages_in_stream(stream)) {
            return true;
        }
    }
    return false;
}

// Exported for tests
export function should_disable_compose_reply_button_for_direct_message(): boolean {
    const pm_ids_string = narrow_state.pm_ids_string();
    // If we can identify a direct message recipient, and the user can't
    // reply to that recipient, then we disable the compose_reply_button.
    if (pm_ids_string && !message_util.user_can_send_direct_message(pm_ids_string)) {
        return true;
    }
    return false;
}

export function update_buttons(update_type?: string): void {
    let disable_reply_button;
    if (update_type === "direct") {
        // Based on whether there's a direct message recipient for
        // the current narrow_state.
        disable_reply_button = should_disable_compose_reply_button_for_direct_message();
    } else {
        // Based on whether there's a selected channel message in
        // the current message list.
        disable_reply_button = should_disable_compose_reply_button_for_stream();
    }

    if (update_type === "direct" || update_type === "stream") {
        update_new_conversation_button(update_type);
        update_reply_button_state(disable_reply_button);
        return;
    }

    // Default case for most views.
    update_new_conversation_button("non-specific");
    update_reply_button_state(disable_reply_button);
    set_standard_text_for_reply_button();
}

export function maybe_update_buttons_for_dm_recipient(): void {
    const filter = narrow_state.filter();
    if (filter?.contains_only_private_messages()) {
        update_buttons("direct");
    }
}

function set_reply_button_label(label: string): void {
    $("#left_bar_compose_reply_button_big").text(label);
}

export function set_standard_text_for_reply_button(): void {
    set_reply_button_label($t({defaultMessage: "Compose message"}));
}

export function update_recipient_text_for_reply_button(
    recipient_information?: ReplyRecipientInformation,
): void {
    const recipient_label = get_recipient_label(recipient_information);
    if (recipient_label !== undefined) {
        const empty_string_topic_display_name = util.get_final_topic_display_name("");
        const rendered_recipient_label = render_reply_recipient_label({
            has_empty_string_topic: recipient_label.has_empty_string_topic,
            channel_name: recipient_label.stream_name,
            is_dm_with_self: recipient_label.is_dm_with_self,
            empty_string_topic_display_name,
            label_text: recipient_label.label_text,
        });
        $("#left_bar_compose_reply_button_big").html(rendered_recipient_label);
    } else {
        set_standard_text_for_reply_button();
    }
}

function can_user_reply_to_message(message_id: number): boolean {
    const selected_message = message_store.get(message_id);
    if (selected_message === undefined) {
        return false;
    }
    if (selected_message.is_stream) {
        return !should_disable_compose_reply_button_for_stream();
    }
    assert(selected_message.is_private);
    return message_util.user_can_send_direct_message(selected_message.to_user_ids);
}

export function initialize(): void {
    // When the message selection changes, change the label on the Reply button.
    $(document).on("message_selected.zulip", () => {
        if (narrow_state.is_message_feed_visible()) {
            // message_selected events can occur with Recent Conversations
            // open due to the combined feed view loading in the background,
            // so we only update if message feed is visible.
            update_recipient_text_for_reply_button();
            update_reply_button_state(
                !can_user_reply_to_message(message_lists.current!.selected_id()),
            );
        }
    });

    // Click handlers for buttons in the compose box.
    $("body").on("click", ".compose_new_conversation_button", () => {
        compose_actions.start({
            message_type: "stream",
            trigger: "clear topic button",
            keep_composebox_empty: true,
        });
    });

    $("body").on("click", ".compose_mobile_button", () => {
        // Remove the channel and topic context, since on mobile widths,
        // the "+" button should open the compose box with the channel
        // picker open (even if the user is in a topic or channel view).
        compose_actions.start({
            message_type: "stream",
            stream_id: undefined,
            topic: "",
            keep_composebox_empty: true,
        });
    });

    $("body").on("click", ".compose_new_direct_message_button", () => {
        compose_actions.start({
            message_type: "private",
            trigger: "new direct message",
            keep_composebox_empty: true,
        });
    });
}
```

--------------------------------------------------------------------------------

---[FILE: compose_fade.ts]---
Location: zulip-main/web/src/compose_fade.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";

import * as compose_fade_helper from "./compose_fade_helper.ts";
import * as compose_state from "./compose_state.ts";
import type {MessageGroup} from "./message_list_view.ts";
import * as message_lists from "./message_lists.ts";
import * as message_viewport from "./message_viewport.ts";
import * as people from "./people.ts";
import * as rows from "./rows.ts";
import * as util from "./util.ts";

let normal_display = false;

export function set_focused_recipient(msg_type?: "private" | "stream"): void {
    if (msg_type === undefined) {
        compose_fade_helper.clear_focused_recipient();
    }

    // Construct focused_recipient as a mocked up element which has all the
    // fields of a message used by util.same_recipient()
    let focused_recipient;
    if (msg_type === "stream") {
        const stream_id = compose_state.stream_id();
        const topic = compose_state.topic();
        if (stream_id) {
            focused_recipient = {
                type: msg_type,
                stream_id,
                topic,
            };
        }
    } else if (msg_type === "private") {
        // Normalize the recipient list so it matches the one used when
        // adding the message (see message_helper.process_new_message()).
        const reply_to = util.normalize_recipients(
            compose_state.private_message_recipient_emails(),
        );
        const to_user_ids = people.reply_to_to_user_ids_string(reply_to);
        focused_recipient = {
            type: msg_type,
            reply_to,
            to_user_ids,
        };
    }

    compose_fade_helper.set_focused_recipient(focused_recipient);
}

function display_messages_normally(): void {
    message_lists.current?.view.$list.find(".recipient_row").removeClass("message-fade");

    normal_display = true;
}

function change_fade_state($elt: JQuery, should_fade_group: boolean): void {
    if (should_fade_group) {
        $elt.addClass("message-fade");
    } else {
        $elt.removeClass("message-fade");
    }
}

function fade_messages(): void {
    if (message_lists.current === undefined) {
        return;
    }

    normal_display = false;

    // Update the visible messages first, before the compose box opens
    for (const group_elt of message_viewport.visible_groups(false)) {
        const $first_row = rows.first_message_in_group($(group_elt));
        const first_message = message_lists.current.get(rows.id($first_row));
        assert(first_message !== undefined);
        const should_fade_group = compose_fade_helper.should_fade_message(first_message);

        change_fade_state($(group_elt), should_fade_group);
    }

    // Defer updating all message groups so that the compose box can open sooner
    setTimeout(
        (expected_msg_list, expected_recipient) => {
            if (
                message_lists.current !== expected_msg_list ||
                !compose_state.composing() ||
                compose_state.private_message_recipient_emails() !== expected_recipient
            ) {
                return;
            }

            const $all_groups = message_lists.current.view.$list.find(".recipient_row");
            // Note: The below algorithm relies on the fact that all_elts is
            // sorted as it would be displayed in the message view
            for (const group_elt of $all_groups) {
                const $group_elt = $(group_elt);
                const should_fade_group = compose_fade_helper.should_fade_message(
                    rows.recipient_from_group($group_elt)!,
                );
                change_fade_state($group_elt, should_fade_group);
            }
        },
        0,
        message_lists.current,
        compose_state.private_message_recipient_emails(),
    );
}

export function do_update_all(): void {
    if (compose_fade_helper.want_normal_display()) {
        if (!normal_display) {
            display_messages_normally();
        }
    } else {
        fade_messages();
    }
}

// This gets called on keyup events, hence the throttling.
export const update_all = _.debounce(do_update_all, 50);

export function start_compose(msg_type?: "private" | "stream"): void {
    set_focused_recipient(msg_type);
    do_update_all();
}

export function clear_compose(): void {
    compose_fade_helper.clear_focused_recipient();
    display_messages_normally();
}

export function update_message_list(): void {
    if (compose_fade_helper.want_normal_display()) {
        display_messages_normally();
    } else {
        fade_messages();
    }
}

export function update_rendered_message_groups(
    message_groups: MessageGroup[],
    get_element: (message_group: MessageGroup) => JQuery,
): void {
    if (compose_fade_helper.want_normal_display()) {
        return;
    }

    // This loop is superficially similar to some code in fade_messages, but an
    // important difference here is that we look at each message individually, whereas
    // the other code takes advantage of blocks beneath recipient bars.
    for (const message_group of message_groups) {
        const $elt = get_element(message_group);
        const first_message = message_group.message_containers[0]!.msg;
        const should_fade = compose_fade_helper.should_fade_message(first_message);
        change_fade_state($elt, should_fade);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: compose_fade_helper.ts]---
Location: zulip-main/web/src/compose_fade_helper.ts

```typescript
import $ from "jquery";

import type {Message} from "./message_store.ts";
import * as stream_data from "./stream_data.ts";
import * as sub_store from "./sub_store.ts";
import type {Recipient} from "./util.ts";
import * as util from "./util.ts";

let focused_recipient: Recipient | undefined;

export function should_fade_message(message: Message): boolean {
    return !util.same_recipient(focused_recipient, message);
}

export function clear_focused_recipient(): void {
    focused_recipient = undefined;
}

export function set_focused_recipient(recipient?: Recipient): void {
    focused_recipient = recipient;
}

export function want_normal_display(): boolean {
    // If we're not composing show a normal display.
    if (focused_recipient === undefined) {
        return true;
    }

    // If the user really hasn't specified anything let, then we want a normal display
    if (focused_recipient.type === "stream") {
        // If a stream doesn't exist, there is no real chance of a mix, so fading
        // is just noise to the user.
        if (!sub_store.get(focused_recipient.stream_id)) {
            return true;
        }

        // If the topic is empty, we want a normal display in the following cases:
        // * realm requires topic
        // * realm allows empty topic but the focus is in topic input box,
        //   means user is still configuring topic.
        if (
            focused_recipient.topic === "" &&
            (!stream_data.can_use_empty_topic(focused_recipient.stream_id) ||
                $("input#stream_message_recipient_topic").is(":focus"))
        ) {
            return true;
        }
    }

    return focused_recipient.type === "private" && focused_recipient.reply_to === "";
}
```

--------------------------------------------------------------------------------

````

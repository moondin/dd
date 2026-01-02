---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 657
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 657 of 1290)

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

---[FILE: realm_playground.ts]---
Location: zulip-main/web/src/realm_playground.ts
Signals: Zod

```typescript
import type * as z from "zod/mini";

import {$t} from "./i18n.ts";
import * as pygments_data from "./pygments_data.ts";
import type {realm_playground_schema} from "./state_data.ts";
import * as typeahead from "./typeahead.ts";
import * as util from "./util.ts";

export type RealmPlayground = z.output<typeof realm_playground_schema>;

const map_language_to_playground_info = new Map<string, RealmPlayground[]>();
const map_pygments_pretty_name_to_aliases = new Map<string, string[]>();

export function update_playgrounds(playgrounds_data: RealmPlayground[]): void {
    map_language_to_playground_info.clear();

    for (const data of playgrounds_data) {
        const element_to_push: RealmPlayground = {
            id: data.id,
            name: data.name,
            url_template: data.url_template,
            pygments_language: data.pygments_language,
        };
        if (map_language_to_playground_info.has(data.pygments_language)) {
            map_language_to_playground_info.get(data.pygments_language)!.push(element_to_push);
        } else {
            map_language_to_playground_info.set(data.pygments_language, [element_to_push]);
        }
    }
}

export function get_playground_info_for_languages(lang: string): RealmPlayground[] | undefined {
    return map_language_to_playground_info.get(lang);
}

function sort_pygments_pretty_names_by_priority(
    comparator_func: (a: string, b: string) => number,
): void {
    const priority_sorted_pygments_data = Object.entries(pygments_data.langs);
    priority_sorted_pygments_data.sort(([a], [b]) => comparator_func(a, b));
    for (const [alias, data] of priority_sorted_pygments_data) {
        const pretty_name = data.pretty_name;
        // JS Map remembers the original order of insertion of keys.
        if (map_pygments_pretty_name_to_aliases.has(pretty_name)) {
            map_pygments_pretty_name_to_aliases.get(pretty_name)!.push(alias);
        } else {
            map_pygments_pretty_name_to_aliases.set(pretty_name, [alias]);
        }
    }
}

// This gets the candidate list for showing autocomplete for a code block in
// the composebox. The candidate list will include pygments data as well as any
// Code Playgrounds.
//
// May return duplicates, since it's common for playground languages
// to also be pygments languages! retain_unique_language_aliases will
// deduplicate them.
export function get_pygments_typeahead_list_for_composebox(): string[] {
    const playground_pygment_langs = [...map_language_to_playground_info.keys()];
    const pygment_langs = Object.keys(pygments_data.langs);

    return [...playground_pygment_langs, ...pygment_langs];
}

// This gets the candidate list for showing autocomplete in settings when
// adding a new Code Playground.
export function get_pygments_typeahead_list_for_settings(query: string): Map<string, string> {
    const language_labels = new Map<string, string>();

    // Adds a typeahead that allows selecting a custom language, by adding a
    // "Custom language" label in the first position of the typeahead list.
    const clean_query = typeahead.clean_query_lowercase(query);
    if (clean_query !== "") {
        language_labels.set(
            clean_query,
            $t({defaultMessage: "Custom language: {query}"}, {query: clean_query}),
        );
    }

    const playground_pygment_langs = [...map_language_to_playground_info.keys()];
    for (const lang of playground_pygment_langs) {
        language_labels.set(lang, $t({defaultMessage: "Custom language: {query}"}, {query: lang}));
    }

    for (const [key, values] of map_pygments_pretty_name_to_aliases) {
        const formatted_string = util.format_array_as_list_with_conjunction(values, "narrow");
        language_labels.set(key, key + " (" + formatted_string + ")");
    }

    return language_labels;
}

export function initialize({
    playground_data,
    pygments_comparator_func,
}: {
    playground_data: RealmPlayground[];
    pygments_comparator_func: (a: string, b: string) => number;
}): void {
    update_playgrounds(playground_data);
    sort_pygments_pretty_names_by_priority(pygments_comparator_func);
}
```

--------------------------------------------------------------------------------

---[FILE: realm_user_settings_defaults.ts]---
Location: zulip-main/web/src/realm_user_settings_defaults.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import type {StateData} from "./state_data.ts";

export const realm_default_settings_schema = z.object({
    allow_private_data_export: z.boolean(),
    automatically_follow_topics_policy: z.number(),
    automatically_follow_topics_where_mentioned: z.boolean(),
    automatically_unmute_topics_in_muted_streams_policy: z.number(),
    available_notification_sounds: z.array(z.string()),
    color_scheme: z.number(),
    default_language: z.string(),
    demote_inactive_streams: z.number(),
    desktop_icon_count_display: z.number(),
    display_emoji_reaction_users: z.boolean(),
    email_address_visibility: z.number(),
    email_notifications_batching_period_seconds: z.number(),
    emojiset: z.string(),
    emojiset_choices: z.array(z.object({key: z.string(), text: z.string()})),
    enable_desktop_notifications: z.boolean(),
    enable_digest_emails: z.boolean(),
    enable_drafts_synchronization: z.boolean(),
    enable_followed_topic_audible_notifications: z.boolean(),
    enable_followed_topic_desktop_notifications: z.boolean(),
    enable_followed_topic_email_notifications: z.boolean(),
    enable_followed_topic_push_notifications: z.boolean(),
    enable_followed_topic_wildcard_mentions_notify: z.boolean(),
    enable_login_emails: z.boolean(),
    enable_marketing_emails: z.boolean(),
    enable_offline_email_notifications: z.boolean(),
    enable_offline_push_notifications: z.boolean(),
    enable_online_push_notifications: z.boolean(),
    enable_sounds: z.boolean(),
    enable_stream_audible_notifications: z.boolean(),
    enable_stream_desktop_notifications: z.boolean(),
    enable_stream_email_notifications: z.boolean(),
    enable_stream_push_notifications: z.boolean(),
    enter_sends: z.boolean(),
    fluid_layout_width: z.boolean(),
    hide_ai_features: z.boolean(),
    high_contrast_mode: z.boolean(),
    left_side_userlist: z.boolean(),
    message_content_in_email_notifications: z.boolean(),
    notification_sound: z.string(),
    pm_content_in_desktop_notifications: z.boolean(),
    presence_enabled: z.boolean(),
    realm_name_in_email_notifications_policy: z.number(),
    receives_typing_notifications: z.boolean(),
    resolved_topic_notice_auto_read_policy: z.enum(["always", "except_followed", "never"]),
    send_private_typing_notifications: z.boolean(),
    send_read_receipts: z.boolean(),
    send_stream_typing_notifications: z.boolean(),
    starred_message_counts: z.boolean(),
    translate_emoticons: z.boolean(),
    twenty_four_hour_time: z.boolean(),
    user_list_style: z.number(),
    web_animate_image_previews: z.string(),
    web_channel_default_view: z.number(),
    web_escape_navigates_to_home_view: z.boolean(),
    web_font_size_px: z.number(),
    web_home_view: z.string(),
    web_inbox_show_channel_folders: z.boolean(),
    web_left_sidebar_show_channel_folders: z.boolean(),
    web_left_sidebar_unreads_count_summary: z.boolean(),
    web_line_height_percent: z.number(),
    web_mark_read_on_scroll_policy: z.number(),
    web_navigate_to_sent_message: z.boolean(),
    web_stream_unreads_count_display_policy: z.number(),
    wildcard_mentions_notify: z.boolean(),
});
export type RealmDefaultSettings = z.infer<typeof realm_default_settings_schema>;

export let realm_user_settings_defaults: RealmDefaultSettings;

export function initialize(params: StateData["realm_settings_defaults"]): void {
    realm_user_settings_defaults = params.realm_user_settings_defaults;
}
```

--------------------------------------------------------------------------------

---[FILE: recent_senders.ts]---
Location: zulip-main/web/src/recent_senders.ts

```typescript
import _ from "lodash";

import {FoldDict} from "./fold_dict.ts";
import * as message_store from "./message_store.ts";
import * as people from "./people.ts";
import type {User} from "./people.ts";

// This class is only exported for unit testing purposes.
// If we find reuse opportunities, we should just put it into
// its own module.
export class IdTracker {
    ids = new Set<number>();

    // We cache the max message id to make sure that
    // typeahead code is efficient.  We don't eagerly
    // compute it, since it's plausible a spammy bot
    // could cause us to process many messages at a time
    // during fetching.
    _cached_max_id: number | undefined = undefined;

    add(id: number): void {
        this.ids.add(id);
        if (this._cached_max_id !== undefined && id > this._cached_max_id) {
            this._cached_max_id = id;
        }
    }

    remove(id: number): void {
        this.ids.delete(id);
        this._cached_max_id = undefined;
    }

    max_id(): number {
        this._cached_max_id ??= _.max([...this.ids]);
        return this._cached_max_id ?? -1;
    }

    empty(): boolean {
        return this.ids.size === 0;
    }
}

// topic_senders[stream_id][sender_id] = IdTracker
const stream_senders = new Map<number, Map<number, IdTracker>>();

// topic_senders[stream_id][topic_id][sender_id] = IdTracker
const topic_senders = new Map<number, FoldDict<Map<number, IdTracker>>>();

// pm_senders[user_ids_string][user_id] = IdTracker
const pm_senders = new Map<string, Map<number, IdTracker>>();

export function clear_for_testing(): void {
    stream_senders.clear();
    topic_senders.clear();
}

function max_id_for_stream_topic_sender(opts: {
    stream_id: number;
    topic: string;
    sender_id: number;
}): number {
    const {stream_id, topic, sender_id} = opts;
    const topic_dict = topic_senders.get(stream_id);
    if (!topic_dict) {
        return -1;
    }
    const sender_dict = topic_dict.get(topic);
    if (!sender_dict) {
        return -1;
    }
    const id_tracker = sender_dict.get(sender_id);
    return id_tracker ? id_tracker.max_id() : -1;
}

function max_id_for_stream_sender(opts: {stream_id: number; sender_id: number}): number {
    const {stream_id, sender_id} = opts;
    const sender_dict = stream_senders.get(stream_id);
    if (!sender_dict) {
        return -1;
    }
    const id_tracker = sender_dict.get(sender_id);
    return id_tracker ? id_tracker.max_id() : -1;
}

function add_stream_message(opts: {
    stream_id: number;
    sender_id: number;
    message_id: number;
}): void {
    const {stream_id, sender_id, message_id} = opts;
    const sender_dict = stream_senders.get(stream_id) ?? new Map<number, IdTracker>();
    const id_tracker = sender_dict.get(sender_id) ?? new IdTracker();
    stream_senders.set(stream_id, sender_dict);
    sender_dict.set(sender_id, id_tracker);
    id_tracker.add(message_id);
}

function add_topic_message(opts: {
    stream_id: number;
    topic: string;
    sender_id: number;
    message_id: number;
}): void {
    const {stream_id, topic, sender_id, message_id} = opts;
    const topic_dict = topic_senders.get(stream_id) ?? new FoldDict();
    const sender_dict = topic_dict.get(topic) ?? new Map<number, IdTracker>();
    const id_tracker = sender_dict.get(sender_id) ?? new IdTracker();
    topic_senders.set(stream_id, topic_dict);
    topic_dict.set(topic, sender_dict);
    sender_dict.set(sender_id, id_tracker);
    id_tracker.add(message_id);
}

export function process_stream_message(message: {
    stream_id: number;
    topic: string;
    sender_id: number;
    id: number;
}): void {
    const stream_id = message.stream_id;
    const topic = message.topic;
    const sender_id = message.sender_id;
    const message_id = message.id;

    add_stream_message({stream_id, sender_id, message_id});
    add_topic_message({stream_id, topic, sender_id, message_id});
}

function remove_topic_message(opts: {
    stream_id: number;
    topic: string;
    sender_id: number;
    message_id: number;
}): void {
    const {stream_id, topic, sender_id, message_id} = opts;
    const topic_dict = topic_senders.get(stream_id);
    if (!topic_dict) {
        return;
    }

    const sender_dict = topic_dict.get(topic);

    if (!sender_dict) {
        return;
    }

    const id_tracker = sender_dict.get(sender_id);

    if (!id_tracker) {
        return;
    }

    id_tracker.remove(message_id);
    if (id_tracker.empty()) {
        sender_dict.delete(sender_id);
    }

    if (sender_dict.size === 0) {
        topic_dict.delete(topic);
    }
}

export function process_topic_edit(opts: {
    message_ids: number[];
    old_stream_id: number;
    old_topic: string;
    new_stream_id: number;
    new_topic: string;
}): void {
    const {message_ids, old_stream_id, old_topic, new_stream_id, new_topic} = opts;
    // Note that we don't delete anything from stream_senders here.
    // Our view is that it's probably better to not do so; users who
    // recently posted to a stream are relevant for typeahead even if
    // the messages were moved to another stream or deleted.

    for (const message_id of message_ids) {
        const message = message_store.get(message_id);
        if (!message) {
            continue;
        }
        const sender_id = message.sender_id;

        remove_topic_message({stream_id: old_stream_id, topic: old_topic, sender_id, message_id});
        add_topic_message({stream_id: new_stream_id, topic: new_topic, sender_id, message_id});

        add_stream_message({stream_id: new_stream_id, sender_id, message_id});
    }
}

export function update_topics_of_deleted_message_ids(message_ids: number[]): void {
    for (const message_id of message_ids) {
        const message = message_store.get(message_id);
        if (!message || message.type !== "stream") {
            continue;
        }

        const stream_id = message.stream_id;
        const topic = message.topic;
        const sender_id = message.sender_id;

        remove_topic_message({stream_id, topic, sender_id, message_id});
    }
}

export function compare_by_recency(
    user_a: User,
    user_b: User,
    stream_id: number,
    topic: string,
): number {
    let a_message_id;
    let b_message_id;

    a_message_id = max_id_for_stream_topic_sender({stream_id, topic, sender_id: user_a.user_id});
    b_message_id = max_id_for_stream_topic_sender({stream_id, topic, sender_id: user_b.user_id});

    if (a_message_id !== b_message_id) {
        return b_message_id - a_message_id;
    }

    a_message_id = max_id_for_stream_sender({stream_id, sender_id: user_a.user_id});
    b_message_id = max_id_for_stream_sender({stream_id, sender_id: user_b.user_id});

    return b_message_id - a_message_id;
}

export function get_topic_recent_senders(stream_id: number, topic: string): number[] {
    const topic_dict = topic_senders.get(stream_id);
    if (topic_dict === undefined) {
        return [];
    }

    const sender_dict = topic_dict.get(topic);
    if (sender_dict === undefined) {
        return [];
    }

    function by_max_message_id(item1: [number, IdTracker], item2: [number, IdTracker]): number {
        const list1 = item1[1];
        const list2 = item2[1];
        return list2.max_id() - list1.max_id();
    }

    const sorted_senders = [...sender_dict.entries()];
    sorted_senders.sort(by_max_message_id);
    const recent_senders = [];
    for (const item of sorted_senders) {
        recent_senders.push(item[0]);
    }
    return recent_senders;
}

export function process_private_message(opts: {
    to_user_ids: string;
    sender_id: number;
    id: number;
}): void {
    const {to_user_ids, sender_id, id} = opts;
    const sender_dict = pm_senders.get(to_user_ids) ?? new Map<number, IdTracker>();
    const id_tracker = sender_dict.get(sender_id) ?? new IdTracker();
    pm_senders.set(to_user_ids, sender_dict);
    sender_dict.set(sender_id, id_tracker);
    id_tracker.add(id);
}

type DirectMessageSendersInfo = {participants: number[]; non_participants: number[]};
export function get_pm_recent_senders(user_ids_string: string): DirectMessageSendersInfo {
    const user_ids = [...people.get_participants_from_user_ids_string(user_ids_string)];
    const sender_dict = pm_senders.get(user_ids_string);
    const pm_senders_info: DirectMessageSendersInfo = {participants: [], non_participants: []};
    if (sender_dict === undefined) {
        return pm_senders_info;
    }

    for (const user_id of user_ids) {
        if (sender_dict.get(user_id)) {
            pm_senders_info.participants.push(user_id);
        } else {
            pm_senders_info.non_participants.push(user_id);
        }
    }
    pm_senders_info.participants.sort((user_id1: number, user_id2: number) => {
        const max_id1 = sender_dict.get(user_id1)?.max_id() ?? -1;
        const max_id2 = sender_dict.get(user_id2)?.max_id() ?? -1;
        return max_id2 - max_id1;
    });
    return pm_senders_info;
}

export function get_topic_message_ids_for_sender(
    stream_id: number,
    topic: string,
    sender_id: number,
): Set<number> {
    const id_tracker = topic_senders?.get(stream_id)?.get(topic)?.get(sender_id);
    if (id_tracker === undefined) {
        return new Set();
    }
    return id_tracker.ids;
}
```

--------------------------------------------------------------------------------

---[FILE: recent_view_data.ts]---
Location: zulip-main/web/src/recent_view_data.ts

```typescript
import type {Message} from "./message_store.ts";
import * as people from "./people.ts";
import {get_key_from_message} from "./recent_view_util.ts";

export type ConversationData = {
    last_msg_id: number;
    participated: boolean;
    type: "private" | "stream";
};
export const conversations = new Map<string, ConversationData>();
// For stream messages, key is stream-id:topic.
// For pms, key is the user IDs to whom the message is being sent.

export function process_message(msg: Message): boolean {
    // Important: This function must correctly handle processing a
    // given message more than once; this happens during the loading
    // process because of how recent_view_message_list_data duplicates
    // all_messages_data.

    // Return whether any conversation data is updated.
    let conversation_data_updated = false;

    // Initialize conversation data
    const key = get_key_from_message(msg);
    let conversation_data = conversations.get(key);
    if (conversation_data === undefined) {
        conversation_data = {
            last_msg_id: -1,
            participated: false,
            type: msg.type,
        };
        conversations.set(key, conversation_data);
        conversation_data_updated = true;
    }
    // Update conversation data
    if (conversation_data.last_msg_id < msg.id) {
        // NOTE: This also stores locally echoed msg_id which
        // has not been successfully received from the server.
        // We store it now and reify it when response is available
        // from server.
        conversation_data.last_msg_id = msg.id;
        conversation_data_updated = true;
    }
    // TODO: Add backend support for participated topics.
    // Currently participated === recently participated
    // i.e. Only those topics are participated for which we have the user's
    // message fetched in the topic. Ideally we would want this to be attached
    // to topic info fetched from backend, which is currently not a thing.
    if (!conversation_data.participated && people.is_my_user_id(msg.sender_id)) {
        conversation_data.participated = true;
        conversation_data_updated = true;
    }
    return conversation_data_updated;
}

function get_sorted_conversations(): Map<string | undefined, ConversationData> {
    // Sort all recent conversations by last message time.
    return new Map(
        [...conversations.entries()].toSorted((a, b) => b[1].last_msg_id - a[1].last_msg_id),
    );
}

export function get_conversations(): Map<string | undefined, ConversationData> {
    return get_sorted_conversations();
}

export function reify_message_id_if_available(opts: {old_id: number; new_id: number}): boolean {
    // We don't need to reify the message_id of the conversation
    // if a new message arrives in the conversation from another user,
    // since it replaces the last_msg_id of the conversation which
    // we were trying to reify.
    for (const value of conversations.values()) {
        if (value.last_msg_id === opts.old_id) {
            value.last_msg_id = opts.new_id;
            return true;
        }
    }
    return false;
}
```

--------------------------------------------------------------------------------

````

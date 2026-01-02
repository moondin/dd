---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 692
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 692 of 1290)

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

---[FILE: stream_topic_history.ts]---
Location: zulip-main/web/src/stream_topic_history.ts

```typescript
import assert from "minimalistic-assert";

import * as echo_state from "./echo_state.ts";
import {FoldDict} from "./fold_dict.ts";
import * as message_util from "./message_util.ts";
import * as resolved_topics from "./resolved_topic.ts";
import * as sub_store from "./sub_store.ts";
import * as unread from "./unread.ts";

// stream_id -> PerStreamHistory object
const stream_dict = new Map<number, PerStreamHistory>();
const fetched_stream_ids = new Set<number>();
const request_pending_stream_ids = new Set<number>();

// This is stream_topic_history_util.get_server_history.
// We have to indirectly set it to avoid a circular dependency.
let update_topic_last_message_id: (stream_id: number, topic_name: string) => void;
export function set_update_topic_last_message_id(
    f: (stream_id: number, topic_name: string) => void,
): void {
    update_topic_last_message_id = f;
}

export function stream_has_topics(stream_id: number): boolean {
    if (!stream_dict.has(stream_id)) {
        return false;
    }

    const history = stream_dict.get(stream_id);
    assert(history !== undefined);

    return history.has_topics();
}

export function stream_has_locally_available_named_topics(stream_id: number): boolean {
    if (!stream_dict.has(stream_id)) {
        return false;
    }

    const history = stream_dict.get(stream_id);
    assert(history !== undefined);

    const topic_names = history.topics.keys();
    for (const topic_name of topic_names) {
        if (topic_name !== "") {
            return true;
        }
    }
    return false;
}

export function stream_has_locally_available_resolved_topics(stream_id: number): boolean {
    if (!stream_dict.has(stream_id)) {
        return false;
    }

    const history = stream_dict.get(stream_id);
    assert(history !== undefined);

    return history.has_resolved_topics();
}

export type TopicHistoryEntry = {
    count: number;
    message_id: number;
    pretty_name: string;
};

type ServerTopicHistoryEntry = {
    name: string;
    max_id: number;
};

export class PerStreamHistory {
    /*
        For a given stream, this structure has a dictionary of topics.
        The main getter of this object is get_recent_topic_names, and
        we just sort on the fly every time we are called.

        Attributes for a topic are:
        * message_id: The latest message_id in the topic. This is to
            the best of our knowledge, and may not be accurate if
            we have not seen all the messages in the topic.
        * pretty_name: The topic_name, with original case.
        * count: Number of known messages in the topic.  Used to detect
          when the last messages in a topic were moved to other topics or
          deleted.
    */

    topics = new FoldDict<TopicHistoryEntry>();
    // Most recent message ID for the stream.
    max_message_id = 0;
    stream_id: number;

    constructor(stream_id: number) {
        this.stream_id = stream_id;
    }

    has_resolved_topics(): boolean {
        return [...this.topics.keys()].some((topic) => resolved_topics.is_resolved(topic));
    }

    has_topics(): boolean {
        return this.topics.size > 0;
    }

    update_stream_with_message_id(message_id: number): void {
        if (message_id > this.max_message_id) {
            this.max_message_id = message_id;
        }

        // Update the first_message_id for the stream.
        // It is fine if `first_message_id` changes to be higher
        // due to removal of messages since it will not cause to
        // display wrong list of topics. So, we don't update it here.
        // On the other hand, if it changes to be lower
        // we may miss some topics in autocomplete in the range
        // of outdated-`first_message_id` to new-`message_id`.
        // Note that this can only happen if a user moves old
        // messages to the stream from another stream.
        const sub = sub_store.get(this.stream_id);
        if (!sub) {
            return;
        }

        if (sub.first_message_id === null || sub.first_message_id === undefined) {
            fetched_stream_ids.delete(this.stream_id);
            sub.first_message_id = message_id;
            return;
        }

        if (sub.first_message_id > message_id) {
            fetched_stream_ids.delete(this.stream_id);
            sub.first_message_id = message_id;
        }
    }

    add_or_update(topic_name: string, message_id: number): void {
        // The `message_id` provided here can easily be far from the latest
        // message in the topic, but it is more important for us to cache the topic
        // for autocomplete purposes than to have an accurate max message ID.
        this.update_stream_with_message_id(message_id);

        const existing = this.topics.get(topic_name);

        if (!existing) {
            this.topics.set(topic_name, {
                message_id,
                pretty_name: topic_name,
                count: 1,
            });
            return;
        }

        existing.count += 1;

        if (message_id > existing.message_id) {
            existing.message_id = message_id;
            existing.pretty_name = topic_name;
        }
    }

    maybe_remove(topic_name: string, num_messages: number): void {
        const existing = this.topics.get(topic_name);

        if (!existing) {
            return;
        }

        if (existing.count <= num_messages) {
            this.topics.delete(topic_name);
            // Verify if this topic still has messages from the server.
            update_topic_last_message_id(this.stream_id, topic_name);
        }

        existing.count -= num_messages;
    }

    add_history(server_history: ServerTopicHistoryEntry[]): void {
        // This method populates list of topics from the server.

        for (const obj of server_history) {
            const topic_name = obj.name;
            const message_id = obj.max_id;

            const existing = this.topics.get(topic_name);

            if (existing) {
                // If we have a topic in our cache, we update
                // the message_id to accurately reflect the latest
                // message in the topic.
                existing.message_id = message_id;
                continue;
            }

            // If we get here, we are either finding out about
            // the topic for the first time, or we are getting
            // more current data for it.

            this.topics.set(topic_name, {
                message_id,
                pretty_name: topic_name,
                count: 0,
            });
            this.update_stream_with_message_id(message_id);
        }
    }

    get_recent_topic_names(): string[] {
        // Combines several data sources to produce a complete picture
        // of topics the client knows about.
        //
        // This data source is this module's own data structures.
        const my_recents = [...this.topics.values()];
        // This data source is older topics that we know exist because
        // we have unread messages in the topic, even if we don't have
        // any messages from the topic in our local cache.
        const missing_topics = unread.get_missing_topics({
            stream_id: this.stream_id,
            topic_dict: this.topics,
        });

        // This data source is locally echoed messages, which should
        // are treated as newer than all delivered messages.
        const local_echo_topics = [
            ...echo_state.get_waiting_for_ack_local_ids_by_topic(this.stream_id).entries(),
        ].map(([topic, local_id]) => ({pretty_name: topic, message_id: local_id}));
        const local_echo_set = new Set<string>(
            local_echo_topics.map((message_topic) => message_topic.pretty_name.toLowerCase()),
        );

        // We first sort the topics without locally echoed messages,
        // and then prepend topics with locally echoed messages.
        const server_topics = [...my_recents, ...missing_topics].filter(
            (message_topic) => !local_echo_set.has(message_topic.pretty_name.toLowerCase()),
        );
        server_topics.sort((a, b) => b.message_id - a.message_id);
        return [...local_echo_topics, ...server_topics].map((obj) => obj.pretty_name);
    }

    get_max_message_id(): number {
        // TODO: We probably want to migrate towards this function
        // ignoring locally echoed messages, and thus returning an integer.
        const unacked_message_ids_in_stream = [
            ...echo_state.get_waiting_for_ack_local_ids_by_topic(this.stream_id).values(),
        ];
        const max_message_id = Math.max(...unacked_message_ids_in_stream, this.max_message_id);
        return max_message_id;
    }
}

export function remove_messages(opts: {
    stream_id: number;
    topic_name: string;
    num_messages: number;
    max_removed_msg_id: number;
}): void {
    const stream_id = opts.stream_id;
    const topic_name = opts.topic_name;
    const num_messages = opts.num_messages;
    const max_removed_msg_id = opts.max_removed_msg_id;
    const history = stream_dict.get(stream_id);

    // This is the special case of "removing" a message from
    // a topic, which happens when we edit topics.

    if (!history) {
        return;
    }

    // Adjust our local data structures to account for the
    // removal of messages from a topic. We can also remove
    // the topic if it has no messages left or if we cannot
    // locally determine the current state of the topic.
    // So, it is important that we return below if we don't have
    // the topic cached.
    history.maybe_remove(topic_name, num_messages);
    const existing_topic = history.topics.get(topic_name);
    if (!existing_topic) {
        return;
    }

    // Update max_message_id in topic
    if (existing_topic.message_id <= max_removed_msg_id) {
        const msgs_in_topic = message_util.get_loaded_messages_in_topic(stream_id, topic_name);
        let max_message_id = 0;
        for (const msg of msgs_in_topic) {
            if (msg.id > max_message_id) {
                max_message_id = msg.id;
            }
        }
        existing_topic.message_id = max_message_id;
    }

    // Update max_message_id in stream
    if (history.max_message_id <= max_removed_msg_id) {
        history.max_message_id = message_util.get_max_message_id_in_stream(stream_id);
    }
}

export function find_or_create(stream_id: number): PerStreamHistory {
    let history = stream_dict.get(stream_id);

    if (!history) {
        history = new PerStreamHistory(stream_id);
        stream_dict.set(stream_id, history);
    }

    return history;
}

export function add_message(opts: {
    stream_id: number;
    message_id: number;
    topic_name: string;
}): void {
    const stream_id = opts.stream_id;
    const message_id = opts.message_id;
    const topic_name = opts.topic_name;

    const history = find_or_create(stream_id);

    history.add_or_update(topic_name, message_id);
}

export function add_history(stream_id: number, server_history: ServerTopicHistoryEntry[]): void {
    const history = find_or_create(stream_id);
    history.add_history(server_history);
    fetched_stream_ids.add(stream_id);
}

export function has_history_for(stream_id: number): boolean {
    return fetched_stream_ids.has(stream_id);
}

export function mark_history_fetched_for(stream_id: number): void {
    fetched_stream_ids.add(stream_id);
}

export let get_recent_topic_names = (stream_id: number): string[] => {
    const history = find_or_create(stream_id);

    return history.get_recent_topic_names();
};

export function rewire_get_recent_topic_names(value: typeof get_recent_topic_names): void {
    get_recent_topic_names = value;
}

export function get_max_message_id(stream_id: number): number {
    const history = find_or_create(stream_id);

    return history.get_max_message_id();
}

export function get_latest_known_message_id_in_topic(
    stream_id: number,
    topic_name: string,
): number | undefined {
    const history = stream_dict.get(stream_id);
    return history?.topics.get(topic_name)?.message_id;
}

export function reset(): void {
    // This is only used by tests.
    stream_dict.clear();
    fetched_stream_ids.clear();
    request_pending_stream_ids.clear();
}

export function is_request_pending_for(stream_id: number): boolean {
    return request_pending_stream_ids.has(stream_id);
}

export function add_request_pending_for(stream_id: number): void {
    request_pending_stream_ids.add(stream_id);
}

export function remove_request_pending_for(stream_id: number): void {
    request_pending_stream_ids.delete(stream_id);
}

export function remove_history_for_stream(stream_id: number): void {
    // Currently only used when user loses access to a stream.
    if (stream_dict.has(stream_id)) {
        stream_dict.delete(stream_id);
    }

    if (fetched_stream_ids.has(stream_id)) {
        fetched_stream_ids.delete(stream_id);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: stream_topic_history_util.ts]---
Location: zulip-main/web/src/stream_topic_history_util.ts
Signals: Zod

```typescript
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as channel from "./channel.ts";
import * as stream_topic_history from "./stream_topic_history.ts";
import * as util from "./util.ts";

const stream_topic_history_response_schema = z.object({
    topics: z.array(
        z.object({
            name: z.string(),
            max_id: z.number(),
        }),
    ),
});

const pending_on_success_callbacks = new Map<number, (() => void)[]>();

export const MAX_RETRIES = 5;

function fetch_channel_history_with_retry(stream_id: number, attempt = 1): void {
    if (attempt > MAX_RETRIES) {
        pending_on_success_callbacks.delete(stream_id);
        stream_topic_history.remove_request_pending_for(stream_id);
        return;
    }

    const url = "/json/users/me/" + stream_id + "/topics";
    void channel.get({
        url,
        data: {allow_empty_topic_name: true},
        success(raw_data) {
            const data = stream_topic_history_response_schema.parse(raw_data);
            const server_history = data.topics;
            stream_topic_history.add_history(stream_id, server_history);
            stream_topic_history.remove_request_pending_for(stream_id);
            for (const callback of pending_on_success_callbacks.get(stream_id)!) {
                callback();
            }
            pending_on_success_callbacks.delete(stream_id);
        },
        error(xhr) {
            const retry_delay_secs = util.get_retry_backoff_seconds(xhr, attempt);
            setTimeout(() => {
                fetch_channel_history_with_retry(stream_id, attempt + 1);
            }, retry_delay_secs * 1000);
        },
    });
}

export function get_server_history(stream_id: number, on_success: () => void): void {
    if (stream_topic_history.has_history_for(stream_id)) {
        on_success();
        return;
    }
    if (stream_topic_history.is_request_pending_for(stream_id)) {
        const callbacks = pending_on_success_callbacks.get(stream_id) ?? [];
        callbacks.push(on_success);
        pending_on_success_callbacks.set(stream_id, callbacks);
        return;
    }

    stream_topic_history.add_request_pending_for(stream_id);
    pending_on_success_callbacks.set(stream_id, [on_success]);

    fetch_channel_history_with_retry(stream_id);
}

export function update_topic_last_message_id(
    stream_id: number,
    topic_name: string,
    update_dom_on_success: () => void,
): void {
    void channel.get({
        url: "/json/messages",
        data: {
            narrow: JSON.stringify([
                {operator: "stream", operand: stream_id},
                {operator: "topic", operand: topic_name},
            ]),
            anchor: "newest",
            num_before: 1,
            num_after: 0,
            allow_empty_topic_name: true,
        },
        success(data) {
            const {messages} = z
                .object({
                    messages: z.array(
                        z.object({
                            id: z.number(),
                        }),
                    ),
                })
                .parse(data);
            if (messages.length !== 1) {
                return;
            }

            const last_message = messages[0];
            assert(last_message !== undefined);
            stream_topic_history.add_history(stream_id, [
                {
                    name: topic_name,
                    max_id: last_message.id,
                },
            ]);
            update_dom_on_success();
        },
        error() {
            // Ideally we would retry since we should always be able to get a success response
            // from the server for this request, but for now we just ignore the error.
        },
    });
}
```

--------------------------------------------------------------------------------

---[FILE: stream_types.ts]---
Location: zulip-main/web/src/stream_types.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import {group_setting_value_schema} from "./types.ts";

export const StreamPostPolicy = {
    EVERYONE: 1,
    ADMINS: 2,
    RESTRICT_NEW_MEMBERS: 3,
    MODERATORS: 4,
} as const;
export type StreamPostPolicy = (typeof StreamPostPolicy)[keyof typeof StreamPostPolicy];

export const stream_permission_group_settings_schema = z.enum([
    "can_add_subscribers_group",
    "can_administer_channel_group",
    "can_create_topic_group",
    "can_delete_any_message_group",
    "can_delete_own_message_group",
    "can_move_messages_out_of_channel_group",
    "can_move_messages_within_channel_group",
    "can_remove_subscribers_group",
    "can_resolve_topics_group",
    "can_send_message_group",
    "can_subscribe_group",
]);
export type StreamPermissionGroupSetting = z.infer<typeof stream_permission_group_settings_schema>;

export const stream_topics_policy_schema = z.enum([
    "allow_empty_topic",
    "disable_empty_topic",
    "empty_topic_only",
    "inherit",
]);
export type StreamTopicsPolicy = z.infer<typeof stream_topics_policy_schema>;

// These types are taken from the `zerver/lib/types.py`.
export const stream_schema = z.object({
    can_add_subscribers_group: group_setting_value_schema,
    can_administer_channel_group: group_setting_value_schema,
    can_create_topic_group: group_setting_value_schema,
    can_delete_any_message_group: group_setting_value_schema,
    can_delete_own_message_group: group_setting_value_schema,
    can_move_messages_out_of_channel_group: group_setting_value_schema,
    can_move_messages_within_channel_group: group_setting_value_schema,
    can_remove_subscribers_group: group_setting_value_schema,
    can_resolve_topics_group: group_setting_value_schema,
    can_send_message_group: group_setting_value_schema,
    can_subscribe_group: group_setting_value_schema,
    creator_id: z.nullable(z.number()),
    date_created: z.number(),
    description: z.string(),
    first_message_id: z.nullable(z.number()),
    folder_id: z.nullable(z.number()),
    history_public_to_subscribers: z.boolean(),
    invite_only: z.boolean(),
    is_announcement_only: z.boolean(),
    is_archived: z.boolean(),
    is_recently_active: z.boolean(),
    is_web_public: z.boolean(),
    message_retention_days: z.nullable(z.number()),
    name: z.string(),
    rendered_description: z.string(),
    stream_id: z.number(),
    stream_post_policy: z.enum(StreamPostPolicy),
    topics_policy: stream_topics_policy_schema,
});

export const stream_specific_notification_settings_schema = z.object({
    audible_notifications: z.nullable(z.boolean()),
    desktop_notifications: z.nullable(z.boolean()),
    email_notifications: z.nullable(z.boolean()),
    push_notifications: z.nullable(z.boolean()),
    wildcard_mentions_notify: z.nullable(z.boolean()),
});

export const api_stream_schema = z.object({
    ...stream_schema.shape,
    stream_weekly_traffic: z.nullable(z.number()),
    // This field is stripped from subscriber objects when loading data
    // from the server. Always use `peer_data.get_subscriber_count` to
    // access channel subscriber counts, and see its comments for notes
    // about the possibility of inaccuracy in the presence of certain races.
    subscriber_count: z.number(),
});
export type APIStream = z.infer<typeof api_stream_schema>;

export const never_subscribed_stream_schema = z.object({
    ...api_stream_schema.shape,
    subscribers: z.optional(z.array(z.number())),
    partial_subscribers: z.optional(z.array(z.number())),
});

export const stream_properties_schema = z.object({
    ...stream_specific_notification_settings_schema.shape,
    color: z.string(),
    is_muted: z.boolean(),
    pin_to_top: z.boolean(),
});

// This is the raw data we get from the server for a subscription.
export const api_stream_subscription_schema = z.object({
    ...api_stream_schema.shape,
    ...stream_properties_schema.shape,
    subscribers: z.optional(z.array(z.number())),
    partial_subscribers: z.optional(z.array(z.number())),
});

export const updatable_stream_properties_schema = z.object({
    ...api_stream_subscription_schema.shape,
    in_home_view: z.boolean(),
});
export type UpdatableStreamProperties = z.infer<typeof updatable_stream_properties_schema>;
```

--------------------------------------------------------------------------------

````

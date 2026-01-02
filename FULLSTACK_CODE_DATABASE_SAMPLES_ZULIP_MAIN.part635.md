---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 635
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 635 of 1290)

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

---[FILE: message_events_util.ts]---
Location: zulip-main/web/src/message_events_util.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as compose_notifications from "./compose_notifications.ts";
import type {MessageList} from "./message_list.ts";
import * as message_lists from "./message_lists.ts";
import * as message_store from "./message_store.ts";
import type {Message} from "./message_store.ts";
import * as narrow_state from "./narrow_state.ts";
import * as unread_ops from "./unread_ops.ts";
import * as util from "./util.ts";

const msg_match_narrow_api_response_schema = z.object({
    messages: z.record(
        z.string(),
        z.object({
            match_content: z.string(),
            match_subject: z.string(),
        }),
    ),
});

export function maybe_add_narrowed_messages(
    messages: Message[],
    msg_list: MessageList,
    messages_are_new = false,
    attempt = 1,
): void {
    const ids: number[] = [];

    for (const elem of messages) {
        ids.push(elem.id);
    }

    void channel.get({
        url: "/json/messages/matches_narrow",
        data: {
            msg_ids: JSON.stringify(ids),
            narrow: JSON.stringify(narrow_state.public_search_terms()),
        },
        timeout: 5000,
        success(raw_data) {
            const data = msg_match_narrow_api_response_schema.parse(raw_data);

            if (!narrow_state.is_message_feed_visible() || msg_list !== message_lists.current) {
                // We unnarrowed or moved to Recent Conversations in the meantime.
                return;
            }

            let new_messages: Message[] = [];
            const elsewhere_messages: Message[] = [];

            for (const elem of messages) {
                if (Object.hasOwn(data.messages, elem.id)) {
                    util.set_match_data(elem, data.messages[elem.id]!);
                    new_messages.push(elem);
                } else {
                    elsewhere_messages.push(elem);
                }
            }

            // We replace our slightly stale message object with the
            // latest copy from the message_store. This helps in very
            // rare race conditions, where e.g. the current user's name was
            // edited in between when they sent the message and when
            // we hear back from the server and can echo the new
            // message.
            new_messages = new_messages.map((new_msg) => {
                const cached_msg_data = message_store.get_cached_message(new_msg.id);
                if (cached_msg_data !== undefined) {
                    const cached_message = cached_msg_data.message;
                    // Copy the match topic and content over from the new_msg to
                    // cached_msg. Also unlike message_helper.process_new_message, we
                    // are not checking if new_msg has match_topic, the upstream code
                    // ensure that.
                    util.set_match_data(cached_message, new_msg);
                    return cached_message;
                }

                return new_msg;
            });

            // Remove the elsewhere_messages from the message list since
            // they don't match the filter as per data from server.
            msg_list.remove_and_rerender(elsewhere_messages.map((msg) => msg.id));
            msg_list.add_messages(new_messages, {messages_are_new});
            unread_ops.process_visible();
            compose_notifications.notify_messages_outside_current_search(elsewhere_messages);
        },
        error(xhr) {
            if (!narrow_state.is_message_feed_visible() || msg_list !== message_lists.current) {
                return;
            }
            if (xhr.status === 400) {
                // This narrow was invalid -- don't retry it, and don't display the message.
                return;
            }
            if (attempt >= 5) {
                // Too many retries -- bail out.  However, this means the `messages` are potentially
                // missing from the search results view.  Since this is a very unlikely circumstance
                // (Tornado is up, Django is down for 5 retries, user is in a search view that it
                // cannot apply itself) and the failure mode is not bad (it will simply fail to
                // include live updates of new matching messages), just log an error.
                blueslip.error(
                    "Failed to determine if new message matches current narrow, after 5 tries",
                );
                return;
            }
            // Backoff on retries, with full jitter: up to 2s, 4s, 8s, 16s, 32s
            const delay = Math.random() * 2 ** attempt * 2000;
            setTimeout(() => {
                if (msg_list === message_lists.current) {
                    // Don't actually try again if we un-narrowed
                    // while waiting
                    maybe_add_narrowed_messages(messages, msg_list, messages_are_new, attempt + 1);
                }
            }, delay);
        },
    });
}
```

--------------------------------------------------------------------------------

---[FILE: message_feed_loading.ts]---
Location: zulip-main/web/src/message_feed_loading.ts

```typescript
import $ from "jquery";

import * as loading from "./loading.ts";

let loading_older_messages_indicator_showing = false;
let loading_newer_messages_indicator_showing = false;

export function show_loading_older(): void {
    if (!loading_older_messages_indicator_showing) {
        $(".top-messages-logo").toggleClass("loading", true);
        loading.make_indicator($("#loading_older_messages_indicator"), {abs_positioned: true});
        loading_older_messages_indicator_showing = true;
    }
}

export function hide_loading_older(): void {
    if (loading_older_messages_indicator_showing) {
        $(".top-messages-logo").toggleClass("loading", false);
        loading.destroy_indicator($("#loading_older_messages_indicator"));
        loading_older_messages_indicator_showing = false;
    }
}

export function show_loading_newer(): void {
    if (!loading_newer_messages_indicator_showing) {
        $(".bottom-messages-logo").show();
        $(".bottom-messages-logo").toggleClass("loading", true);
        loading.make_indicator($("#loading_more_indicator"), {abs_positioned: true});
        loading_newer_messages_indicator_showing = true;
    }
}

export function hide_loading_newer(): void {
    if (loading_newer_messages_indicator_showing) {
        $(".bottom-messages-logo").hide();
        $(".bottom-messages-logo").toggleClass("loading", false);
        loading.destroy_indicator($("#loading_more_indicator"));
        loading_newer_messages_indicator_showing = false;
    }
}

export function hide_indicators(): void {
    hide_loading_older();
    hide_loading_newer();
}
```

--------------------------------------------------------------------------------

---[FILE: message_feed_top_notices.ts]---
Location: zulip-main/web/src/message_feed_top_notices.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";

import * as hash_util from "./hash_util.ts";
import type {MessageList} from "./message_list.ts";
import * as message_lists from "./message_lists.ts";
import * as narrow_banner from "./narrow_banner.ts";
import * as narrow_state from "./narrow_state.ts";
import * as people from "./people.ts";

function show_history_limit_notice(): void {
    $(".top-messages-logo").hide();
    $(".history-limited-box").show();
    narrow_banner.hide_empty_narrow_message();
}

function hide_history_limit_notice(): void {
    $(".top-messages-logo").show();
    $(".history-limited-box").hide();
}

function hide_end_of_results_notice(): void {
    $(".all-messages-search-caution").hide();
}

function show_end_of_results_notice(): void {
    $(".all-messages-search-caution").show();

    // Set the link to point to this search with streams:public added.
    // Note that element we adjust is not visible to spectators.
    const narrow_filter = narrow_state.filter();
    assert(narrow_filter !== undefined);
    const terms = narrow_filter.terms();
    const update_hash = hash_util.search_public_streams_notice_url(terms);
    $(".all-messages-search-caution a.search-shared-history").attr("href", update_hash);
}

export function update_top_of_narrow_notices(msg_list: MessageList): void {
    // Assumes that the current state is all notices hidden (i.e. this
    // will not hide a notice that should not be there)
    if (message_lists.current === undefined || msg_list !== message_lists.current) {
        return;
    }

    if (msg_list.data.fetch_status.has_found_oldest()) {
        const filter = narrow_state.filter();
        // Potentially display the notice that lets users know
        // that not all messages were searched.  One could
        // imagine including `filter.is_keyword_search()` in these
        // conditions, but there's a very legitimate use case
        // for moderation of searching for all messages sent
        // by a potential spammer user.
        if (
            filter &&
            !filter.is_in_home() &&
            !filter.contains_only_private_messages() &&
            !filter.includes_full_stream_history() &&
            !filter.is_personal_filter() &&
            !(
                _.isEqual(filter._sorted_term_types, ["sender", "has-reaction"]) &&
                filter.terms_with_operator("sender")[0]!.operand === people.my_current_email()
            )
        ) {
            show_end_of_results_notice();
        }
    }

    if (msg_list.data.fetch_status.history_limited()) {
        show_history_limit_notice();
    }
}

export function hide_top_of_narrow_notices(): void {
    hide_end_of_results_notice();
    hide_history_limit_notice();
}
```

--------------------------------------------------------------------------------

````

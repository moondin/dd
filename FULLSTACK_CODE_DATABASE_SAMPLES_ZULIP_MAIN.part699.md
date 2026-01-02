---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 699
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 699 of 1290)

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

---[FILE: topic_popover.ts]---
Location: zulip-main/web/src/topic_popover.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_delete_topic_modal from "../templates/confirm_dialog/confirm_delete_topic.hbs";
import render_left_sidebar_topic_actions_popover from "../templates/popovers/left_sidebar/left_sidebar_topic_actions_popover.hbs";

import * as clipboard_handler from "./clipboard_handler.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as hash_util from "./hash_util.ts";
import {$t_html} from "./i18n.ts";
import * as message_delete from "./message_delete.ts";
import * as message_edit from "./message_edit.ts";
import * as message_summary from "./message_summary.ts";
import * as popover_menus from "./popover_menus.ts";
import * as popover_menus_data from "./popover_menus_data.ts";
import * as starred_messages_ui from "./starred_messages_ui.ts";
import {realm} from "./state_data.ts";
import * as stream_popover from "./stream_popover.ts";
import * as ui_util from "./ui_util.ts";
import * as unread_ops from "./unread_ops.ts";
import * as user_topics from "./user_topics.ts";
import * as util from "./util.ts";

function get_conversation(instance: tippy.Instance): {
    stream_id: number;
    topic_name: string;
    url: string;
} {
    let stream_id;
    let topic_name;
    let url;

    if (instance.reference.classList.contains("recipient-bar-control")) {
        const $elt = $(instance.reference);
        const $message_header = $elt.closest(".message_header").expectOne();
        stream_id = Number.parseInt($message_header.attr("data-stream-id")!, 10);
        topic_name = $message_header.attr("data-topic-name")!;
        const topic_narrow_url = hash_util.by_channel_topic_permalink(stream_id, topic_name);
        url = new URL(topic_narrow_url, realm.realm_url).href;
    } else if (!instance.reference.classList.contains("topic-sidebar-menu-icon")) {
        const $elt = $(instance.reference);
        stream_id = Number.parseInt($elt.attr("data-stream-id")!, 10);
        topic_name = $elt.attr("data-topic-name")!;
        url = new URL($elt.attr("data-topic-url")!, realm.realm_url).href;
    } else {
        const $elt = $(instance.reference).closest(".topic-sidebar-menu-icon").expectOne();
        const $stream_li = $elt.closest(".narrow-filter").expectOne();
        topic_name = $elt.closest("li").expectOne().attr("data-topic-name")!;
        url = util.the($elt.closest("li").find<HTMLAnchorElement>("a.topic-box")).href;
        stream_id = stream_popover.elem_to_stream_id($stream_li);
    }

    return {stream_id, topic_name, url};
}

export function initialize(): void {
    popover_menus.register_popover_menu(
        "#stream_filters .topic-sidebar-menu-icon, .inbox-row .inbox-topic-menu, .recipient-row-topic-menu, .recent_view_focusable .visibility-status-icon",
        {
            ...popover_menus.left_sidebar_tippy_options,
            onShow(instance) {
                popover_menus.popover_instances.topics_menu = instance;
                ui_util.show_left_sidebar_menu_icon(instance.reference);
                popover_menus.on_show_prep(instance);

                const context = popover_menus_data.get_topic_popover_content_context(
                    get_conversation(instance),
                );
                instance.setContent(
                    ui_util.parse_html(render_left_sidebar_topic_actions_popover(context)),
                );
            },
            onMount(instance) {
                const $reference = $(instance.reference);
                const $popper = $(instance.popper);
                const {stream_id, topic_name, url} = get_conversation(instance);
                const context = popover_menus_data.get_topic_popover_content_context({
                    stream_id,
                    topic_name,
                    url,
                });
                const is_topic_empty = context.is_topic_empty;
                const topic_display_name = context.topic_display_name;
                const is_empty_string_topic = context.is_empty_string_topic;

                const $elt = $(instance.reference).closest(".recent_view_focusable");
                if ($elt.length === 1) {
                    $elt.addClass("topic-popover-visible");
                }

                if (!stream_id) {
                    popover_menus.hide_current_popover_if_visible(instance);
                    return;
                }

                $popper.on("change", "input[name='sidebar-topic-visibility-select']", (e) => {
                    const start_time = Date.now();
                    const visibility_policy = Number.parseInt(
                        $(e.currentTarget).attr("data-visibility-policy")!,
                        10,
                    );

                    const success_cb = (): void => {
                        setTimeout(
                            () => {
                                popover_menus.hide_current_popover_if_visible(instance);
                            },
                            util.get_remaining_time(start_time, 500),
                        );
                    };

                    const error_cb = (): void => {
                        const prev_visibility_policy = user_topics.get_topic_visibility_policy(
                            stream_id,
                            topic_name,
                        );
                        const $prev_visibility_policy_input = $(e.currentTarget)
                            .parent()
                            .find(`input[data-visibility-policy="${prev_visibility_policy}"]`);
                        setTimeout(
                            () => {
                                $prev_visibility_policy_input.prop("checked", true);
                            },
                            util.get_remaining_time(start_time, 500),
                        );
                    };

                    user_topics.set_user_topic_visibility_policy(
                        stream_id,
                        topic_name,
                        visibility_policy,
                        false,
                        false,
                        undefined,
                        success_cb,
                        error_cb,
                    );
                });

                if (is_topic_empty) {
                    return;
                }

                $popper.one("click", ".sidebar-popover-unstar-all-in-topic", () => {
                    starred_messages_ui.confirm_unstar_all_messages_in_topic(stream_id, topic_name);
                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-mark-topic-read", () => {
                    unread_ops.mark_topic_as_read(stream_id, topic_name);
                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-mark-topic-unread", () => {
                    unread_ops.mark_topic_as_unread(stream_id, topic_name);
                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-delete-topic-messages", () => {
                    const html_body = render_delete_topic_modal({
                        topic_display_name,
                        is_empty_string_topic,
                    });

                    confirm_dialog.launch({
                        html_heading: $t_html({defaultMessage: "Delete topic"}),
                        help_link: "/help/delete-a-topic",
                        html_body,
                        on_click() {
                            message_delete.delete_topic(stream_id, topic_name);
                        },
                    });

                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-summarize-topic", () => {
                    message_summary.get_narrow_summary(stream_id, topic_name);

                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-toggle-resolved", () => {
                    message_edit.with_first_message_id(stream_id, topic_name, (message_id) => {
                        assert(message_id !== undefined);
                        let $recipient_row;
                        if ($reference.hasClass("recipient-row-topic-menu")) {
                            // If the popover was opened from the recipient row, we
                            // we pass the recipient row to the toggle_resolve_topic
                            // function to show the loading indicator accordingly.
                            $recipient_row = $reference.closest(".recipient_row");
                        }
                        message_edit.toggle_resolve_topic(
                            message_id,
                            topic_name,
                            true,
                            $recipient_row,
                        );
                    });

                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-move-topic-messages", () => {
                    void stream_popover.build_move_topic_to_stream_popover(
                        stream_id,
                        topic_name,
                        false,
                    );
                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.one("click", ".sidebar-popover-rename-topic-messages", () => {
                    void stream_popover.build_move_topic_to_stream_popover(
                        stream_id,
                        topic_name,
                        true,
                    );
                    popover_menus.hide_current_popover_if_visible(instance);
                });

                $popper.on("click", ".sidebar-popover-copy-link-to-topic", (e) => {
                    assert(e.currentTarget instanceof HTMLElement);
                    clipboard_handler.popover_copy_link_to_clipboard(instance, $(e.currentTarget));
                });
            },
            onHidden(instance) {
                const $elt = $(instance.reference).closest(".recent_view_focusable");
                if ($elt.length === 1) {
                    $elt.removeClass("topic-popover-visible");
                }
                instance.destroy();
                popover_menus.popover_instances.topics_menu = null;
                ui_util.hide_left_sidebar_menu_icon();
            },
        },
    );
}
```

--------------------------------------------------------------------------------

---[FILE: transmit.ts]---
Location: zulip-main/web/src/transmit.ts
Signals: Zod

```typescript
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import type {Message} from "./message_store.ts";
import * as people from "./people.ts";
import * as reload from "./reload.ts";
import * as reload_state from "./reload_state.ts";
import * as sent_messages from "./sent_messages.ts";
import * as server_events_state from "./server_events_state.ts";
import {current_user} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";

type SendMessageData = {
    local_id: string;
    sender_id: number;
    queue_id: string | null;
    to: string;
    content: string;
    resend?: boolean;
    locally_echoed?: boolean;
} & (
    | {
          type: "stream";
          topic: string;
      }
    | {
          type: "private";
      }
);

export function send_message(
    request: SendMessageData,
    on_success: (raw_data: unknown) => void,
    error: (response: string, code: string) => void,
): void {
    if (!request.resend) {
        sent_messages.start_tracking_message({
            local_id: request.local_id,
            locally_echoed: request.locally_echoed ?? false,
        });
    }
    sent_messages.wrap_send(request.local_id, () => {
        channel.post({
            url: "/json/messages",
            data: request,
            success: function success(data) {
                // Call back to our callers to do things like closing the compose
                // box, turning off spinners, reifying locally echoed messages and
                // displaying visibility policy related compose banners.
                on_success(data);
                // Once everything is done, get ready to report times to the server.
                const state = sent_messages.get_message_state(request.local_id);
                /* istanbul ignore if */
                if (!state) {
                    return;
                }
                state.report_server_ack();

                // We only start our timer for events coming in here,
                // since it's plausible the server rejected our message,
                // or took a while to process it, but there is nothing
                // wrong with our event loop.
                /* istanbul ignore if */
                if (!state.saw_event) {
                    setTimeout(() => {
                        if (state.saw_event) {
                            // We got our event, no need to do anything
                            return;
                        }

                        blueslip.log(
                            `Restarting get_events due to delayed receipt of sent message ${request.local_id}`,
                        );

                        server_events_state.restart_get_events();
                    }, 5000);
                }
            },
            error(xhr, error_type) {
                sent_messages.get_message_state(request.local_id)?.report_error();
                if (error_type !== "timeout" && reload_state.is_pending()) {
                    // The error might be due to the server changing
                    reload.initiate({
                        immediate: true,
                        save_compose: true,
                        send_after_reload: true,
                    });
                    return;
                }

                const response = channel.xhr_error_message("Error sending message", xhr);
                const parsed = z.object({code: z.string()}).safeParse(xhr.responseJSON);
                error(response, parsed.success ? parsed.data.code : "");
            },
        });
    });
}

export function reply_message(message: Message, content: string): void {
    // This code does an application-triggered reply to a message (as
    // opposed to the user themselves doing it).  Its only use case
    // for now is experimental widget-aware bots, so treat this as
    // somewhat beta code.  To understand the use case, think of a
    // bot that wants to give users 3 or 4 canned replies to some
    // choice, but it wants to front-end each of these options
    // with a one-click button.  This function is part of that architecture.

    function success(): void {
        // TODO: If server response comes back before the message event,
        //       we could show it earlier, although that creates some
        //       complexity.  For now do nothing.  (Note that send_message
        //       already handles things like reporting times to the server.)
    }

    function error(_response: string, _server_error_code: string): void {
        // TODO: In our current use case, which is widgets, to meaningfully
        //       handle errors, we would want the widget to provide some
        //       kind of callback to us so it can do some appropriate UI.
        //       For now do nothing.
    }

    const locally_echoed = false;
    const local_id = sent_messages.get_new_local_id();

    const sender_id = current_user.user_id;
    const queue_id = server_events_state.queue_id;

    sent_messages.start_tracking_message({
        local_id,
        locally_echoed,
    });

    if (message.type === "stream") {
        const stream_name = stream_data.get_stream_name_from_id(message.stream_id);

        const mention = people.get_mention_syntax(message.sender_full_name, message.sender_id);

        content = mention + " " + content;

        const reply: SendMessageData = {
            type: "stream",
            local_id,
            sender_id,
            queue_id,
            to: stream_name,
            content,
            topic: message.topic,
        };

        send_message(reply, success, error);
        return;
    }

    if (message.type === "private") {
        const pm_recipient = people.pm_reply_to(message);
        assert(pm_recipient !== undefined);

        const reply: SendMessageData = {
            type: "private",
            local_id,
            sender_id,
            queue_id,
            to: JSON.stringify(pm_recipient.split(",")),
            content,
        };

        send_message(reply, success, error);
        return;
    }

    blueslip.error("unknown message type", {message, content});
}
```

--------------------------------------------------------------------------------

---[FILE: typeahead.ts]---
Location: zulip-main/web/src/typeahead.ts

```typescript
import _ from "lodash";

/*
    We hand selected the following emojis a few years
    ago to be given extra precedence in our typeahead
    algorithms and emoji picker UIs.  We call them "popular"
    emojis for historical reasons, although we've never
    technically measured their popularity (and any
    results now would be biased in favor of the ones
    below, since they've easier to submit).  Nonetheless, it
    is often convenient to quickly find these.  We can
    adjust this list over time; we just need to make
    sure it works well with the emoji picker's layout
    if you increase the number of them.

    For typeahead we'll favor any of these as long as
    the emoji code matches.  For example, we'll show the
    emoji with code 1f44d at the top of your suggestions
    whether you type "+" as a prefix for "+1"
    or "th" as a prefix for "thumbs up".
*/
export type EmojiItem = {
    emoji_type: string;
    emoji_code: string;
};

export const popular_emojis = [
    "1f44d", // +1
    "1f389", // tada
    "1f642", // slight_smile
    "2764", // heart
    "1f6e0", // working_on_it
    "1f419", // octopus
];

export function get_popular_emojis(): EmojiItem[] {
    return popular_emojis.map((emoji_code) => ({emoji_type: "unicode_emoji", emoji_code}));
}

export let frequently_used_emojis: EmojiItem[] = [...get_popular_emojis()];

export type Emoji =
    | {
          emoji_name: string;
          reaction_type: "realm_emoji" | "zulip_extra_emoji";
          is_realm_emoji: true;
          emoji_url?: string | undefined;
          emoji_code?: undefined;
      }
    | UnicodeEmoji;

// emoji_code is only available for unicode emojis.
type UnicodeEmoji = {
    emoji_name: string;
    emoji_code: string;
    reaction_type: "unicode_emoji";
    is_realm_emoji: false;
    emoji_url?: string | undefined;
};
export type EmojiSuggestion = Emoji & {
    type: "emoji";
};

export type BaseEmoji = {emoji_name: string} & (
    | {is_realm_emoji: false; emoji_code: string}
    | {is_realm_emoji: true; emoji_code?: undefined}
);

export function remove_diacritics(s: string): string {
    const unicode_marks = /\p{M}/gu;
    return s.normalize("NFKD").replaceAll(unicode_marks, "");
}

export function last_prefix_match(prefix: string, words: string[]): number | null {
    // This function takes in a lexicographically sorted array of `words`,
    // and a `prefix` string. It uses binary search to compute the index
    // of `prefix`'s upper bound, that is, the string immediately after
    // the lexicographically last prefix match of `prefix`. So, the return
    // value is the upper bound minus 1, that is, the last prefix match's
    // index. When no prefix match is found, we return null.
    let left = 0;
    let right = words.length;
    let found = false;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (words[mid]!.startsWith(prefix)) {
            // Note that left can never be 0 if `found` is true,
            // since it is incremented at least once here.
            left = mid + 1;
            found = true;
        } else if (words[mid]! < prefix) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    if (found) {
        return left - 1;
    }
    return null;
}

export function query_matches_string_in_order(
    query: string,
    source_str: string,
    split_char: string,
): boolean {
    query = query.toLowerCase();
    source_str = source_str.toLowerCase();

    const should_remove_diacritics = /^[a-z]+$/.test(query);
    if (should_remove_diacritics) {
        source_str = remove_diacritics(source_str);
    }

    return query_matches_string_in_order_assume_canonicalized(query, source_str, split_char);
}

// This function attempts to match a query in order with a source text.
// * query is the user-entered search query
// * source_str is the string we're matching in, e.g. a user's name
// * split_char is the separator for this syntax (e.g. ' ').
export function query_matches_string_in_order_assume_canonicalized(
    query: string,
    source_str: string,
    split_char: string,
    match_prefix?: boolean,
): boolean {
    if (!query.includes(split_char) && !match_prefix) {
        // If query is a single token (doesn't contain a separator),
        // the match can be anywhere in the string.
        return source_str.includes(query);
    }

    // If there is a separator character in the query, then we
    // require the match to start at the start of a token.
    // (E.g. for 'ab cd ef', query could be 'ab c' or 'cd ef',
    // but not 'b cd ef'.)
    return source_str.startsWith(query) || source_str.includes(split_char + query);
}

// Match the words in the query to the words in the source text, in any order.
//
// The query matches the source if each word in the query can be matched to
// a different word in the source. The order the words appear in the query
// or in the source does not affect the result.
//
// A query word matches a source word if it is a prefix of the source word,
// after both words are converted to lowercase and diacritics are removed.
//
// Returns true if the query matches, and false if not.
//
// * query is the user-entered search query
// * source_str is the string we're matching in, e.g. a user's name
// * split_char is the separator for this syntax (e.g. ' ').
export function query_matches_string_in_any_order(
    query: string,
    source_str: string,
    split_char: string,
): boolean {
    source_str = source_str.toLowerCase();
    source_str = remove_diacritics(source_str);

    query = query.toLowerCase();
    query = remove_diacritics(query);

    const search_words = query.split(split_char).filter(Boolean);
    const source_words = source_str.split(split_char).filter(Boolean);
    if (search_words.length > source_words.length) {
        return false;
    }

    // We go through the search words in reverse lexicographical order, and to select
    // the corresponding source word for each, one by one, we find the lexicographically
    // last possible prefix match and immediately then remove it from consideration for
    // remaining search words.

    // This essentially means that there is no search word lexicographically greater than
    // our current search word (say, q1) which might require the current corresponding source
    // word (as all search words lexicographically greater than it have already been matched)
    // and also that all search words lexicographically smaller than it have the best possible
    // chance for getting matched.

    // This is because if the source word we just removed (say, s1) is the sole match for
    // another search word (say, q2 - obviously lexicographically smaller than q1), this
    // means that either q2 = q1 or that q2 is a prefix of q1. In either case, the final
    // return value of this function should anyway be false, as s1 would be the sole match
    // for q1 too; while we need unique matches for each search word.

    search_words.sort();
    search_words.reverse();
    source_words.sort();
    for (const word of search_words) {
        // `match_index` is the index of the best possible match of `word`.
        const match_index = last_prefix_match(word, source_words);
        if (match_index === null) {
            // We return false if no match was found for `word`.
            return false;
        }
        source_words.splice(match_index, 1);
    }
    return true;
}

function clean_query(query: string): string {
    query = remove_diacritics(query);
    // When `abc ` with a space at the end is typed in
    // a content-editable widget such as the composebox
    // direct message section, the space at the end was
    // a `no break-space (U+00A0)` instead of `space (U+0020)`,
    // which lead to no matches in those cases.
    query = query.replaceAll("\u00A0", " ");

    return query;
}

export function clean_query_lowercase(query: string): string {
    query = query.toLowerCase();
    query = clean_query(query);
    return query;
}

export const parse_unicode_emoji_code = (code: string): string =>
    code
        .split("-")
        .map((hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
        .join("");

export function get_emoji_matcher(query: string): (emoji: EmojiSuggestion) => boolean {
    // replace spaces with underscores for emoji matching
    query = query.replaceAll(" ", "_");
    query = clean_query_lowercase(query);

    return function (emoji) {
        const matches_emoji_literal =
            emoji.reaction_type === "unicode_emoji" &&
            parse_unicode_emoji_code(emoji.emoji_code) === query;
        return matches_emoji_literal || query_matches_string_in_order(query, emoji.emoji_name, "_");
    };
}

// space, hyphen, underscore and slash characters are considered word
// boundaries for now, but we might want to consider the characters
// from BEFORE_MENTION_ALLOWED_REGEX in zerver/lib/mention.py later.
export const word_boundary_chars = " _/-";

export function triage_raw_with_multiple_items<T>(
    query: string,
    objs: T[],
    get_items: (x: T) => string[],
): {
    exact_matches: T[];
    begins_with_case_sensitive_matches: T[];
    begins_with_case_insensitive_matches: T[];
    word_boundary_matches: T[];
    no_matches: T[];
} {
    const exact_matches = [];
    const begins_with_case_sensitive_matches = [];
    const begins_with_case_insensitive_matches = [];
    const word_boundary_matches = [];
    const no_matches = [];
    const lower_query = query ? query.toLowerCase() : "";

    const word_boundary_match_regex = new RegExp(
        `[${word_boundary_chars}]${_.escapeRegExp(lower_query)}`,
    );

    for (const obj of objs) {
        const items = get_items(obj);

        const lower_items = items.map((item) => item.toLowerCase());

        if (lower_items.includes(lower_query)) {
            exact_matches.push(obj);
        } else if (items.some((item) => item.startsWith(query))) {
            begins_with_case_sensitive_matches.push(obj);
        } else if (lower_items.some((item) => item.startsWith(lower_query))) {
            begins_with_case_insensitive_matches.push(obj);
        } else if (lower_items.some((item) => word_boundary_match_regex.test(item))) {
            word_boundary_matches.push(obj);
        } else {
            no_matches.push(obj);
        }
    }

    return {
        exact_matches,
        begins_with_case_sensitive_matches,
        begins_with_case_insensitive_matches,
        word_boundary_matches,
        no_matches,
    };
}

export function triage_raw<T>(
    query: string,
    objs: T[],
    get_item: (x: T) => string,
): {
    exact_matches: T[];
    begins_with_case_sensitive_matches: T[];
    begins_with_case_insensitive_matches: T[];
    word_boundary_matches: T[];
    no_matches: T[];
} {
    /*
        We split objs into five groups:

            - entire string exact match
            - match prefix exactly with `query`
            - match prefix case-insensitively
            - match word boundary prefix case-insensitively
            - other

        and return an object of these.
    */
    const exact_matches = [];
    const begins_with_case_sensitive_matches = [];
    const begins_with_case_insensitive_matches = [];
    const word_boundary_matches = [];
    const no_matches = [];
    const lower_query = query ? query.toLowerCase() : "";

    for (const obj of objs) {
        const item = get_item(obj);
        const lower_item = item.toLowerCase();

        if (lower_item === lower_query) {
            exact_matches.push(obj);
        } else if (item.startsWith(query)) {
            begins_with_case_sensitive_matches.push(obj);
        } else if (lower_item.startsWith(lower_query)) {
            begins_with_case_insensitive_matches.push(obj);
        } else if (
            new RegExp(`[${word_boundary_chars}]${_.escapeRegExp(lower_query)}`).test(lower_item)
        ) {
            word_boundary_matches.push(obj);
        } else {
            no_matches.push(obj);
        }
    }

    return {
        exact_matches,
        begins_with_case_sensitive_matches,
        begins_with_case_insensitive_matches,
        word_boundary_matches,
        no_matches,
    };
}

export function triage<T>(
    query: string,
    objs: T[],
    get_item: (x: T) => string,
    sorting_comparator?: (a: T, b: T) => number,
): {matches: T[]; rest: T[]} {
    const {
        exact_matches,
        begins_with_case_sensitive_matches,
        begins_with_case_insensitive_matches,
        word_boundary_matches,
        no_matches,
    } = triage_raw(query, objs, get_item);

    if (sorting_comparator) {
        const beginning_matches_sorted = [
            ...begins_with_case_sensitive_matches,
            ...begins_with_case_insensitive_matches,
        ].toSorted(sorting_comparator);
        return {
            matches: [
                ...exact_matches.toSorted(sorting_comparator),
                ...beginning_matches_sorted,
                ...word_boundary_matches.toSorted(sorting_comparator),
            ],
            rest: no_matches.toSorted(sorting_comparator),
        };
    }

    return {
        matches: [
            ...exact_matches,
            ...begins_with_case_sensitive_matches,
            ...begins_with_case_insensitive_matches,
            ...word_boundary_matches,
        ],
        rest: no_matches,
    };
}

export function set_frequently_used_emojis(frequently_used: EmojiItem[]): void {
    frequently_used_emojis = frequently_used;
}

export function sort_emojis<T extends BaseEmoji>(objs: T[], query: string): T[] {
    // replace spaces with underscores for emoji matching
    query = query.replaceAll(" ", "_");
    query = query.toLowerCase();

    function decent_match(name: string): boolean {
        const pieces = name.toLowerCase().split("_");
        return pieces.some((piece) => piece.startsWith(query));
    }

    const popular_set = new Set(frequently_used_emojis.map((e) => e.emoji_code));

    function is_popular(obj: BaseEmoji): boolean {
        return (
            !obj.is_realm_emoji && popular_set.has(obj.emoji_code) && decent_match(obj.emoji_name)
        );
    }

    const realm_emoji_names = new Set(
        objs.filter((obj) => obj.is_realm_emoji).map((obj) => obj.emoji_name),
    );

    const perfect_emoji_matches = objs.filter((obj) => obj.emoji_name === query);
    const without_perfect_matches = objs.filter((obj) => obj.emoji_name !== query);

    const popular_emoji_matches = without_perfect_matches.filter((obj) => is_popular(obj));
    const others = without_perfect_matches.filter((obj) => !is_popular(obj));

    const triage_results = triage(query, others, (x) => x.emoji_name);

    function prioritise_realm_emojis(emojis: T[]): T[] {
        return [
            ...emojis.filter((emoji) => emoji.is_realm_emoji),
            ...emojis.filter((emoji) => !emoji.is_realm_emoji),
        ];
    }

    const sorted_results_with_possible_duplicates = [
        ...perfect_emoji_matches,
        ...popular_emoji_matches,
        ...prioritise_realm_emojis(triage_results.matches),
        ...prioritise_realm_emojis(triage_results.rest),
    ];
    // remove unicode emojis with same code but different names
    // and unicode emojis overridden by realm emojis with same names
    const unicode_emoji_codes = new Set();
    const sorted_unique_results: T[] = [];
    for (const emoji of sorted_results_with_possible_duplicates) {
        if (emoji.is_realm_emoji) {
            sorted_unique_results.push(emoji);
        } else if (
            !unicode_emoji_codes.has(emoji.emoji_code) &&
            !realm_emoji_names.has(emoji.emoji_name)
        ) {
            unicode_emoji_codes.add(emoji.emoji_code);
            sorted_unique_results.push(emoji);
        }
    }

    return sorted_unique_results;
}
```

--------------------------------------------------------------------------------

````

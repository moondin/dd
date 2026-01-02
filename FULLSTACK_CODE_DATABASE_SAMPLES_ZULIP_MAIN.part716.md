---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 716
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 716 of 1290)

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

---[FILE: user_topic_popover.ts]---
Location: zulip-main/web/src/user_topic_popover.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_change_visibility_policy_popover from "../templates/popovers/change_visibility_policy_popover.hbs";

import * as popover_menus from "./popover_menus.ts";
import * as popover_menus_data from "./popover_menus_data.ts";
import {parse_html} from "./ui_util.ts";
import * as user_topics from "./user_topics.ts";
import * as util from "./util.ts";

const extract_visibility_policy_popover_context = (
    $element: JQuery,
): {
    stream_id: number;
    topic_name: string;
} => {
    const stream_id_str = $element.attr("data-stream-id");
    assert(stream_id_str !== undefined);
    const stream_id = Number.parseInt(stream_id_str, 10);
    const topic_name = $element.attr("data-topic-name")!;
    assert(stream_id !== undefined);
    assert(topic_name !== undefined);
    return {stream_id, topic_name};
};

export function initialize(): void {
    popover_menus.register_popover_menu(".change_visibility_policy", {
        theme: "popover-menu",
        placement: "bottom",
        popperOptions: {
            modifiers: [
                {
                    // The placement is set to bottom, but if that placement does not fit,
                    // the opposite top placement will be used.
                    name: "flip",
                    options: {
                        fallbackPlacements: ["top", "left"],
                    },
                },
            ],
        },
        onShow(instance) {
            popover_menus.popover_instances.change_visibility_policy = instance;
            popover_menus.on_show_prep(instance);
            const $reference = $(instance.reference);
            const $change_visibility_policy_button = $reference
                .closest(".change_visibility_policy")
                .expectOne();

            // The topic visibility policy popover logic is shared between
            // the recipient bar and other parts of the app. However, the
            // relevant data attributes are located in different elements —
            // specifically, within the message header when triggered from
            // the recipient bar, instead of the button itself. Hence, we
            // need to conditionally extract the data attributes below.
            const $data_element = $reference.hasClass("recipient-bar-control")
                ? $reference.closest(".message_header").expectOne()
                : $change_visibility_policy_button;
            const {stream_id, topic_name} =
                extract_visibility_policy_popover_context($data_element);

            $change_visibility_policy_button.addClass("visibility-policy-popover-visible");
            instance.setContent(
                parse_html(
                    render_change_visibility_policy_popover(
                        popover_menus_data.get_change_visibility_policy_popover_content_context(
                            stream_id,
                            topic_name,
                        ),
                    ),
                ),
            );
        },
        onMount(instance) {
            const $popper = $(instance.popper);
            const $reference = $(instance.reference);
            const $change_visibility_policy_button = $reference
                .closest(".change_visibility_policy")
                .expectOne();

            const $data_element = $reference.hasClass("recipient-bar-control")
                ? $reference.closest(".message_header").expectOne()
                : $change_visibility_policy_button;
            const {stream_id, topic_name} =
                extract_visibility_policy_popover_context($data_element);

            if (!stream_id) {
                popover_menus.hide_current_popover_if_visible(instance);
                return;
            }

            $popper.on("change", "input[name='visibility-policy-select']", (e) => {
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
                    assert(stream_id !== undefined);
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
                assert(stream_id !== undefined);
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
        },
        onHidden(instance) {
            $(instance.reference)
                .closest(".change_visibility_policy")
                .expectOne()
                .removeClass("visibility-policy-popover-visible");
            instance.destroy();
            popover_menus.popover_instances.change_visibility_policy = null;

            // If the reference is in recent view / inbox, we would ideally restore focus
            // to the reference icon here but we don't do that because there are a lot of
            // reasons why the popover might be hidden (e.g. user clicking outside the popover).
        },
    });
}
```

--------------------------------------------------------------------------------

---[FILE: util.ts]---
Location: zulip-main/web/src/util.ts
Signals: Zod

```typescript
import Handlebars from "handlebars/runtime.js";
import _ from "lodash";
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import {$t} from "./i18n.ts";
import type {MatchedMessage, Message, RawMessage} from "./message_store.ts";
import type {UpdateMessageEvent} from "./server_event_types.ts";
import {realm} from "./state_data.ts";
import {user_settings} from "./user_settings.ts";

// From MDN: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
export function random_int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Like C++'s std::lower_bound.  Returns the first index at which
// `value` could be inserted without changing the ordering.  Assumes
// the array is sorted.
//
// `first` and `last` are indices and `less` is an optionally-specified
// function that returns true if
//   array[i] < value
// for some i and false otherwise.
//
// Usage: lower_bound(array, value, less)
export function lower_bound<T1, T2>(
    array: T1[],
    value: T2,
    less: (item: T1, value: T2, middle: number) => boolean,
): number {
    let first = 0;
    const last = array.length;

    let len = last - first;
    let middle;
    let step;
    while (len > 0) {
        step = Math.floor(len / 2);
        middle = first + step;
        if (less(array[middle]!, value, middle)) {
            first = middle;
            first += 1;
            len = len - step - 1;
        } else {
            len = step;
        }
    }
    return first;
}

export const lower_same = function lower_same(a?: string, b?: string): boolean {
    if (a === undefined || b === undefined) {
        blueslip.error("Cannot compare strings; at least one value is undefined", {a, b});
        return false;
    }
    return a.toLowerCase() === b.toLowerCase();
};

export type StreamTopic = {
    stream_id: number;
    topic: string;
};

export const same_stream_and_topic = function util_same_stream_and_topic(
    a: StreamTopic,
    b: StreamTopic,
): boolean {
    // Streams and topics are case-insensitive.
    return a.stream_id === b.stream_id && lower_same(a.topic, b.topic);
};

export function extract_pm_recipients(recipients: string): string[] {
    return recipients.split(/\s*[,;]\s*/).filter((recipient) => recipient.trim() !== "");
}

// When the type is "private", properties from to_user_ids might be undefined.
// See https://github.com/zulip/zulip/pull/23032#discussion_r1038480596.
export type Recipient =
    | {type: "private"; to_user_ids?: string | undefined; reply_to: string}
    | ({type: "stream"} & StreamTopic);

export const same_recipient = function util_same_recipient(a?: Recipient, b?: Recipient): boolean {
    if (a === undefined || b === undefined) {
        return false;
    }

    if (a.type === "private" && b.type === "private") {
        if (a.to_user_ids === undefined) {
            return false;
        }
        return a.to_user_ids === b.to_user_ids;
    } else if (a.type === "stream" && b.type === "stream") {
        return same_stream_and_topic(a, b);
    }

    return false;
};

export function normalize_recipients(recipients: string): string {
    // Converts a string listing emails of message recipients
    // into a canonical formatting: emails sorted ASCIIbetically
    // with exactly one comma and no spaces between each.
    return recipients
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0)
        .toSorted()
        .join(",");
}

// Avoid URI decode errors by removing characters from the end
// one by one until the decode succeeds.  This makes sense if
// we are decoding input that the user is in the middle of
// typing.
export function robust_url_decode(str: string): string {
    let end = str.length;
    while (end > 0) {
        try {
            return decodeURIComponent(str.slice(0, end));
        } catch (error) {
            if (!(error instanceof URIError)) {
                throw error;
            }
            end -= 1;
        }
    }
    return "";
}

// If we can, use a locale-aware sorter.  However, if the browser
// doesn't support the ECMAScript Internationalization API
// Specification, do a dumb string comparison because
// String.localeCompare is really slow.
export function make_strcmp(): (x: string, y: string) => number {
    try {
        const collator = new Intl.Collator();
        return collator.compare.bind(collator);
    } catch {
        // continue regardless of error
    }

    return function util_strcmp(a: string, b: string): number {
        return a < b ? -1 : a > b ? 1 : 0;
    };
}

export const strcmp = make_strcmp();

export const array_compare = function util_array_compare<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    let i;
    for (i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

/* Represents a value that is expensive to compute and should be
 * computed on demand and then cached.  The value can be forcefully
 * recalculated on the next call to get() by calling reset().
 *
 * You must supply a option to the constructor called compute_value
 * which should be a function that computes the uncached value.
 */
const unassigned_value_sentinel: unique symbol = Symbol("unassigned_value_sentinel");
export class CachedValue<T> {
    _value: T | typeof unassigned_value_sentinel = unassigned_value_sentinel;

    private compute_value: () => T;

    constructor(opts: {compute_value: () => T}) {
        this.compute_value = opts.compute_value;
    }

    get(): T {
        if (this._value === unassigned_value_sentinel) {
            this._value = this.compute_value();
        }
        return this._value;
    }

    reset(): void {
        this._value = unassigned_value_sentinel;
    }
}

export function find_stream_wildcard_mentions(message_content: string): string | null {
    // We cannot use the exact same regex as the server side uses (in zerver/lib/mention.py)
    // because Safari < 16.4 does not support look-behind assertions.  Reframe the lookbehind of a
    // negative character class as a start-of-string or positive character class.
    const mention = /(?:^|[\s"'(/<[{])(@\*{2}(all|everyone|stream|channel)\*{2})/.exec(
        message_content,
    );
    if (mention === null) {
        return null;
    }
    return mention[2]!;
}

export const move_array_elements_to_front = function util_move_array_elements_to_front<T>(
    array: T[],
    selected: T[],
): T[] {
    const selected_hash = new Set(selected);
    const selected_elements: T[] = [];
    const unselected_elements: T[] = [];
    for (const element of array) {
        (selected_hash.has(element) ? selected_elements : unselected_elements).push(element);
    }
    return [...selected_elements, ...unselected_elements];
};

// check by the userAgent string if a user's client is likely mobile.
export function is_mobile(): boolean {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        window.navigator.userAgent,
    );
}

export function is_client_safari(): boolean {
    // Since GestureEvent is only supported on Safari, we can use it
    // to detect if the browser is Safari including Safari on iOS.
    // https://developer.mozilla.org/en-US/docs/Web/API/GestureEvent
    return "GestureEvent" in window;
}

export function sorted_ids(ids: number[]): number[] {
    // This makes sure we don't mutate the list.
    const id_list = [...new Set(ids)];
    id_list.sort((a, b) => a - b);

    return id_list;
}

export function set_match_data(target: Message, source: MatchedMessage | RawMessage): void {
    target.match_subject = source.match_subject;
    target.match_content = source.match_content;
}

export function get_match_topic(obj: Message | RawMessage): string | undefined {
    return obj.match_subject;
}

export function get_edit_event_topic(obj: UpdateMessageEvent): string | undefined {
    if (obj.topic === undefined) {
        return obj.subject;
    }

    // This code won't be reachable till we fix the
    // server, but we use it now in tests.
    return obj.topic;
}

export function get_edit_event_orig_topic(obj: UpdateMessageEvent): string | undefined {
    return obj.orig_subject;
}

export function is_topic_synonym(operator: string): boolean {
    return operator === "subject";
}

export function is_channel_synonym(text: string): boolean {
    return text === "stream";
}

export function is_channels_synonym(text: string): boolean {
    return text === "streams";
}

export function canonicalize_channel_synonyms(text: string): string {
    if (is_channel_synonym(text.toLowerCase())) {
        return "channel";
    }
    if (is_channels_synonym(text.toLowerCase())) {
        return "channels";
    }
    return text;
}

export function prefix_match({value, search_term}: {value: string; search_term: string}): boolean {
    return filter_by_word_prefix_match([value], search_term, (s) => s).length === 1;
}
export function filter_by_word_prefix_match<T>(
    items: T[],
    search_term: string,
    item_to_text: (item: T) => string,
    word_separator_regex = /\s/,
): T[] {
    if (search_term === "") {
        return items;
    }

    let search_terms = search_term.toLowerCase().split(",");
    search_terms = search_terms.map((s) => s.trim());

    const filtered_items = items.filter((item) =>
        search_terms.some((search_term) => {
            const lower_name = item_to_text(item).toLowerCase();
            // returns true if the item starts with the search term or if the
            // search term with a word separator right before it appears in the item
            return (
                lower_name.startsWith(search_term) ||
                new RegExp(word_separator_regex.source + _.escapeRegExp(search_term)).test(
                    lower_name,
                )
            );
        }),
    );

    return filtered_items;
}

export function get_time_from_date_muted(date_muted: number | undefined): number {
    if (date_muted === undefined) {
        return Date.now();
    }
    return date_muted * 1000;
}

export let call_function_periodically = (callback: () => void, delay: number): void => {
    // We previously used setInterval for this purpose, but
    // empirically observed that after unsuspend, Chrome can end
    // up trying to "catch up" by doing dozens of these requests
    // at once, wasting resources as well as hitting rate limits
    // on the server. We have not been able to reproduce this
    // reliably enough to be certain whether the setInterval
    // requests are those that would have happened while the
    // laptop was suspended or during a window after unsuspend
    // before the user focuses the browser tab.

    // But using setTimeout this instead ensures that we're only
    // scheduling a next call if the browser will actually be
    // calling "callback".
    setTimeout(() => {
        call_function_periodically(callback, delay);

        // Do the callback after scheduling the next call, so that we
        // are certain to call it again even if the callback throws an
        // exception.
        callback();
    }, delay);
};

export function rewire_call_function_periodically(value: typeof call_function_periodically): void {
    call_function_periodically = value;
}

export function get_string_diff(string1: string, string2: string): [number, number, number] {
    // This function specifies the single minimal diff between 2 strings. For
    // example, the diff between "#ann is for updates" and "#**announce** is
    // for updates" is from index 1, till 4 in the 1st string and 13 in the
    // 2nd string;

    let diff_start_index = -1;
    for (let i = 0; i < Math.min(string1.length, string2.length); i += 1) {
        if (string1.charAt(i) === string2.charAt(i)) {
            diff_start_index = i;
        } else {
            break;
        }
    }
    diff_start_index += 1;

    if (string1.length === string2.length && string1.length === diff_start_index) {
        // if the 2 strings are identical
        return [0, 0, 0];
    }

    let diff_end_1_index = string1.length;
    let diff_end_2_index = string2.length;
    for (
        let i = string1.length - 1, j = string2.length - 1;
        i >= diff_start_index && j >= diff_start_index;
        i -= 1, j -= 1
    ) {
        if (string1.charAt(i) === string2.charAt(j)) {
            diff_end_1_index = i;
            diff_end_2_index = j;
        } else {
            break;
        }
    }

    return [diff_start_index, diff_end_1_index, diff_end_2_index];
}

export function try_parse_as_truthy<T>(val: (T | undefined)[]): T[] | undefined {
    // This is a typesafe helper to narrow an array from containing
    // possibly falsy values into an array containing non-undefined
    // items or undefined when any of the items is falsy.

    // While this eliminates the possibility of returning an array
    // with falsy values, the type annotation does not provide that
    // guarantee. Ruling out undefined values is sufficient for the
    // helper's usecases.
    const result: T[] = [];
    for (const x of val) {
        if (!x) {
            return undefined;
        }
        result.push(x);
    }
    return result;
}

export function is_valid_url(url: string, require_absolute = false): boolean {
    try {
        let base_url;
        if (!require_absolute) {
            base_url = window.location.origin;
        }

        // JavaScript only requires the base element if we provide a relative URL.
        // If we don’t provide one, it defaults to undefined. Alternatively, if we
        // provide a base element with an absolute URL, JavaScript ignores the base element.
        new URL(url, base_url);
    } catch (error) {
        blueslip.log(`Invalid URL: ${url}.`, {error});
        return false;
    }
    return true;
}

// Formats an array of strings as a Internationalized list using the specified language.
export function format_array_as_list(
    array: string[],
    style: Intl.ListFormatStyle,
    type: Intl.ListFormatType,
): string {
    // If Intl.ListFormat is not supported
    if (Intl.ListFormat === undefined) {
        return array.join(", ");
    }

    // Use Intl.ListFormat to format the array as a Internationalized list.
    const list_formatter = new Intl.ListFormat(user_settings.default_language, {style, type});

    // Return the formatted string.
    return list_formatter.format(array);
}

export function format_array_as_list_with_conjunction(
    array: string[],
    // long uses "and", narrow uses commas.
    join_strategy: "long" | "narrow",
): string {
    return format_array_as_list(array, join_strategy, "conjunction");
}

export function format_array_as_list_with_highlighted_elements(
    array: string[],
    style: Intl.ListFormatStyle,
    type: Intl.ListFormatType,
): string {
    // If Intl.ListFormat is not supported
    if (Intl.ListFormat === undefined) {
        return array
            .map(
                (item) =>
                    `<b class="highlighted-element">${Handlebars.Utils.escapeExpression(item)}</b>`,
            )
            .join(", ");
    }

    // Use Intl.ListFormat to format the array as a Internationalized list.
    const list_formatter = new Intl.ListFormat(user_settings.default_language, {style, type});

    const formatted_parts = list_formatter.formatToParts(array);
    return formatted_parts
        .map((part) => {
            // There are two types of parts: elements (the actual
            // items), and literals (commas, etc.). We need to
            // HTML-escape the elements, but not the literals.
            if (part.type === "element") {
                return `<b class="highlighted-element">${Handlebars.Utils.escapeExpression(part.value)}</b>`;
            }
            return part.value;
        })
        .join("");
}

// Returns the remaining time in milliseconds from the start_time and duration.
export function get_remaining_time(start_time: number, duration: number): number {
    return Math.max(0, start_time + duration - Date.now());
}

export function get_custom_time_in_minutes(time_unit: string, time_input: number): number {
    switch (time_unit) {
        case "minutes":
            return time_input;
        case "hours":
            return time_input * 60;
        case "days":
            return time_input * 24 * 60;
        case "weeks":
            return time_input * 7 * 24 * 60;
    }
    blueslip.error(`Unexpected custom time unit: ${time_unit}`);
    return time_input;
}

export function check_time_input(input_value: string, keep_number_as_float = false): number {
    // This check is important to make sure that inputs like "24a" are
    // considered invalid and this function returns NaN for such inputs.
    // Number.parseInt and Number.parseFloat will convert strings like
    // "24a" to 24.
    if (Number.isNaN(Number(input_value))) {
        return Number.NaN;
    }

    if (keep_number_as_float) {
        return Number.parseFloat(Number.parseFloat(input_value).toFixed(1));
    }

    return Number.parseInt(input_value, 10);
}

export function validate_custom_time_input(time_input: number, can_be_zero = true): boolean {
    if (can_be_zero) {
        if (Number.isNaN(time_input) || time_input < 0) {
            return false;
        }
    } else {
        if (Number.isNaN(time_input) || time_input <= 0) {
            return false;
        }
    }
    return true;
}

// Helper for shorthand for Typescript to get an item from a list with
// exactly one item.
export function the<T>(items: T[] | JQuery<T>): T {
    if (items.length === 0) {
        blueslip.error("the: expected only 1 item, got none");
    } else if (items.length > 1) {
        blueslip.error("the: expected only 1 item, got more", {
            num_items: items.length,
        });
    }
    return items[0]!;
}

export function compare_a_b<T>(a: T, b: T): number {
    if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    }
    return -1;
}

export function get_final_topic_display_name(topic_name: string): string {
    if (topic_name === "") {
        if (realm.realm_empty_topic_display_name === "general chat") {
            return $t({defaultMessage: "general chat"});
        }
        return realm.realm_empty_topic_display_name;
    }
    return topic_name;
}

export function is_topic_name_considered_empty(topic: string): boolean {
    // NOTE: Use this check only when realm.realm_topics_policy is set to disable_empty_topic.
    topic = topic.trim();
    // When the topic is mandatory in a realm via realm_topics_policy, the topic
    // can't be an empty string, "(no topic)", or the displayed topic name for empty string.
    if (topic === "" || topic === "(no topic)" || topic === get_final_topic_display_name("")) {
        return true;
    }
    return false;
}

export let get_retry_backoff_seconds = (
    xhr: JQuery.jqXHR<unknown> | undefined,
    attempts: number,
    tighter_backoff = false,
): number => {
    // We need to respect the server's rate-limiting headers, but beyond
    // that, we also want to avoid contributing to a thundering herd if
    // the server is giving us 500/502 responses.
    //
    // We do the maximum of the retry-after header and an exponential
    // backoff.
    let backoff_scale: number;
    if (tighter_backoff) {
        // Starts at 1-2s and ends at 16-32s after enough failures.
        backoff_scale = Math.min(2 ** attempts, 32);
    } else {
        // Starts at 1-2s and ends at 45-90s after enough failures.
        backoff_scale = Math.min(2 ** ((attempts + 1) / 2), 90);
    }
    // Add a bit jitter to backoff scale.
    const backoff_delay_secs = ((1 + Math.random()) / 2) * backoff_scale;
    let rate_limit_delay_secs = 0;
    const rate_limited_error_schema = z.object({
        "retry-after": z.number(),
        code: z.literal("RATE_LIMIT_HIT"),
    });
    const parsed = rate_limited_error_schema.safeParse(xhr?.responseJSON);
    if (xhr?.status === 429 && parsed?.success && parsed?.data) {
        // Add a bit of jitter to the required delay suggested by the
        // server, because we may be racing with other copies of the web
        // app.
        rate_limit_delay_secs = parsed.data["retry-after"] + Math.random() * 0.5;
    }
    return Math.max(backoff_delay_secs, rate_limit_delay_secs);
};

export function rewire_get_retry_backoff_seconds(value: typeof get_retry_backoff_seconds): void {
    get_retry_backoff_seconds = value;
}

export async function sha256_hash(text: string): Promise<string | undefined> {
    // The Web Crypto API is only available in secure contexts (HTTPS or localhost).
    if (!window.isSecureContext) {
        return undefined;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = [...new Uint8Array(hashBuffer)];
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
}
```

--------------------------------------------------------------------------------

---[FILE: vdom.ts]---
Location: zulip-main/web/src/vdom.ts

```typescript
import $ from "jquery";
import _ from "lodash";

import * as blueslip from "./blueslip.ts";

export type Node<T> = T & {
    key: unknown;
    render: () => string;
    eq: (other: Node<T>) => boolean;
};

type Options<T> = {
    attrs: [string, string][];
    keyed_nodes: Node<T>[];
};

export type Tag<T> = {
    tag_name: string;
    opts: Options<T>;
};

export function eq_array<T>(
    a: T[] | undefined,
    b: T[] | undefined,
    eq: (a_item: T, b_item: T) => boolean,
): boolean {
    if (a === b) {
        // either both are undefined, or they
        // are referentially equal
        return true;
    }

    if (a === undefined || b === undefined) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    return a.every((item, i) => eq(item, b[i]!));
}

export function ul<T>(opts: Options<T>): Tag<T> {
    return {
        tag_name: "ul",
        opts,
    };
}

export function render_tag<T>(tag: Tag<T>): string {
    /*
        This renders a tag into a string.  It will
        automatically escape attributes, but it's your
        responsibility to make sure keyed_nodes provide
        a `render` method that escapes HTML properly.
        (One option is to use templates.)

        Do NOT call this method directly, except for
        testing.  The vdom scheme expects you to use
        the `update` method.
    */
    const opts = tag.opts;
    const tag_name = tag.tag_name;
    const attr_str = opts.attrs.map((attr) => ` ${attr[0]}="${_.escape(attr[1])}"`).join("");

    const start_tag = "<" + tag_name + attr_str + ">";
    const end_tag = "</" + tag_name + ">";

    const innards = opts.keyed_nodes.map((node) => node.render()).join("\n");
    return start_tag + "\n" + innards + "\n" + end_tag;
}

export function update_attrs(
    $elem: JQuery,
    new_attrs: Iterable<[string, string]>,
    old_attrs: Iterable<[string, string]>,
): void {
    const new_dict = new Map(new_attrs);
    const old_dict = new Map(old_attrs);

    for (const [k, v] of new_attrs) {
        if (v !== old_dict.get(k)) {
            $elem.attr(k, v);
        }
    }

    for (const [k] of old_attrs) {
        if (!new_dict.has(k)) {
            $elem.removeAttr(k);
        }
    }
}

export function update<T>(
    replace_content: (html: string) => void,
    find: () => JQuery,
    new_dom: Tag<T>,
    old_dom: Tag<T> | undefined,
): void {
    /*
        The update method allows you to continually
        update a "virtual" representation of your DOM,
        and then this method actually updates the
        real DOM using jQuery.  The caller will pass
        in a method called `replace_content` that will replace
        the entire html and a method called `find` to
        find the existing DOM for more surgical updates.

        The first "update" will be more like a create,
        because your `old_dom` should be undefined.
        After that initial call, it is important that
        you always pass in a correct value of `old_dom`;
        otherwise, things will be incredibly confusing.

        The basic scheme here is simple:

            1) If old_dom is undefined, we render
               everything for the first time.

            2) If the keys of your new children are no
               longer the same order as the old
               children, then we just render
               everything anew.
               (We may refine this in the future.)

            3) If your key structure remains the same,
               then we update your child nodes on
               a child-by-child basis, and we avoid
               updates where the data had remained
               the same.

        The key to making this all work is that
        `new_dom` should include a `keyed_nodes` option
        where each `keyed_node` has a `key` and supports
        these methods:

            eq - can compare itself to similar nodes
                 for data equality

            render - can create an HTML representation
                     of itself

        The `new_dom` should generally be created with
        something like `vdom.ul`, which will set a
        tag field internally and which will want options
        like `attrs` for attributes.

        For examples of creating vdom objects, look at
        `pm_list_dom.ts`.
    */
    function do_full_update(): void {
        const rendered_dom = render_tag(new_dom);
        replace_content(rendered_dom);
    }

    if (old_dom === undefined) {
        do_full_update();
        return;
    }

    const new_opts = new_dom.opts;
    const old_opts = old_dom.opts;

    if (new_opts.keyed_nodes === undefined) {
        // We generally want to use vdom on lists, and
        // adding keys for children lets us avoid unnecessary
        // redraws (or lets us know we should just rebuild
        // the dom).
        blueslip.error("We need keyed_nodes for updates.");
        return;
    }

    const same_structure = eq_array(
        new_opts.keyed_nodes,
        old_opts.keyed_nodes,
        (a, b) => a.key === b.key,
    );

    if (!same_structure) {
        /* We could do something smarter like detecting row
           moves, but it's overkill for small lists.
        */
        do_full_update();
        return;
    }

    /*
        DO "QUICK" UPDATES:

        We've gotten this far, so we know we have the
        same overall structure for our parent tag, and
        the only thing left to do with our child nodes
        is to possibly update them in place (via jQuery).
        We will only update nodes whose data has changed.
    */

    const $child_elems = find().children();

    for (const [i, new_node] of new_opts.keyed_nodes.entries()) {
        const old_node = old_opts.keyed_nodes[i]!;
        if (new_node.eq(old_node)) {
            continue;
        }
        const rendered_dom = new_node.render();
        $child_elems.eq(i).replaceWith($(rendered_dom));
    }

    update_attrs(find(), new_opts.attrs, old_opts.attrs);
}
```

--------------------------------------------------------------------------------

````

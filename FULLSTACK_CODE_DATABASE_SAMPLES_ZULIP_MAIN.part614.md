---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 614
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 614 of 1290)

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

---[FILE: feedback_widget.ts]---
Location: zulip-main/web/src/feedback_widget.ts

```typescript
import $ from "jquery";

import render_feedback_container from "../templates/feedback_container.hbs";

import * as blueslip from "./blueslip.ts";

/*

This code lets you show something like this:

    +-----
    | TOPIC MUTES [undo] [x]
    |
    | You muted stream Foo, topic Bar.
    +-----

And then you configure the undo behavior, and
everything else is controlled by the widget.

Code-wise it's a singleton widget that controls the DOM inside
#feedback_container, which gets served up by server.

*/

type FeedbackWidgetMeta = {
    hide_me_time: number | null;
    alert_hover_state: boolean;
    $container: JQuery | null;
    opened: boolean;
    handlers_set?: boolean;
    undo: (() => void) | undefined;
};

type FeedbackWidgetOptions = {
    populate: (element: JQuery) => void;
    title_text: string;
    undo_button_text?: string;
    on_undo?: () => void;
    hide_delay?: number;
};

const meta: FeedbackWidgetMeta = {
    hide_me_time: null,
    alert_hover_state: false,
    $container: null,
    opened: false,
    undo: undefined,
};

const animate = {
    maybe_close() {
        if (!meta.opened) {
            return;
        }

        if ((meta.hide_me_time ?? 0) < Date.now() && !meta.alert_hover_state) {
            animate.fadeOut();
            return;
        }

        setTimeout(() => {
            animate.maybe_close();
        }, 100);
    },
    fadeOut() {
        if (!meta.opened) {
            return;
        }

        if (meta.$container) {
            meta.$container.addClass("slide-out-feedback-container");
            // Delay setting `display: none` enough that the hide animation starts.
            setTimeout(
                () =>
                    meta.$container?.removeClass([
                        "show-feedback-container",
                        "slide-out-feedback-container",
                    ]),
                50,
            );
            meta.opened = false;
            meta.alert_hover_state = false;
        }
    },
    fadeIn() {
        if (meta.opened) {
            return;
        }

        if (meta.$container) {
            meta.$container.addClass("show-feedback-container");
            meta.opened = true;
            setTimeout(() => {
                animate.maybe_close();
            }, 100);
        }
    },
};

function set_up_handlers(): void {
    if (meta.handlers_set) {
        return;
    }

    if (!meta.$container) {
        blueslip.error("$container not found for feedback widget.");
        return;
    }

    meta.handlers_set = true;

    // if the user mouses over the notification, don't hide it.
    meta.$container.on("mouseenter", () => {
        if (!meta.opened) {
            return;
        }

        meta.alert_hover_state = true;
    });

    // once the user's mouse leaves the notification, restart the countdown.
    meta.$container.on("mouseleave", () => {
        if (!meta.opened) {
            return;
        }

        meta.alert_hover_state = false;
        // add at least 2000ms but if more than that exists just keep the
        // current amount.
        meta.hide_me_time = Math.max(meta.hide_me_time ?? 0, Date.now() + 2000);
    });

    meta.$container.on("click", ".exit-me", () => {
        animate.fadeOut();
    });

    meta.$container.on("click", ".feedback_undo", () => {
        if (meta.undo) {
            meta.undo();
        }
        animate.fadeOut();
    });
}

export function is_open(): boolean {
    return meta.opened;
}

export function dismiss(): void {
    animate.fadeOut();
}

export function show(opts: FeedbackWidgetOptions): void {
    if (!opts.populate) {
        blueslip.error("programmer needs to supply populate callback.");
        return;
    }

    meta.$container = $("#feedback_container");

    let has_undo_button = true;
    if (opts.on_undo === undefined) {
        has_undo_button = false;
    }
    const html = render_feedback_container({has_undo_button});
    meta.$container.html(html);

    set_up_handlers();

    meta.undo = opts.on_undo;

    // add a four second delay before closing up.
    meta.hide_me_time = Date.now() + (opts.hide_delay ?? 4000);

    meta.$container.find(".feedback_title").text(opts.title_text);
    meta.$container.find(".feedback_undo").text(opts.undo_button_text ?? "");
    opts.populate(meta.$container.find(".feedback_content"));

    animate.fadeIn();
}
```

--------------------------------------------------------------------------------

---[FILE: fenced_code.ts]---
Location: zulip-main/web/src/fenced_code.ts

```typescript
import katex from "katex";
import _ from "lodash";
import assert from "minimalistic-assert";

type PygmentsData = {
    langs: Record<
        string,
        {
            priority: number;
            pretty_name: string;
        }
    >;
};

type Handler = {
    handle_line: (line: string) => void;
    done: () => void;
};
// Parsing routine that can be dropped in to message parsing
// and formats code blocks
//
// This supports arbitrarily nested code blocks as well as
// auto-completing code blocks missing a trailing close.

// See backend fenced_code.py:71 for associated regexp
const fencestr =
    "^(~{3,}|`{3,})" + // Opening fence
    "[ ]*" + // Spaces
    "(" +
    "\\{?\\.?" +
    "([a-zA-Z0-9_+-./#]*)" + // Language
    "\\}?" +
    ")" +
    "[ ]*" + // Spaces
    "(" +
    "\\{?\\.?" +
    "([^~`]*)" + // Header (see fenced_code.py)
    "\\}?" +
    ")" +
    "$";
const fence_re = new RegExp(fencestr);

// Default stashing function does nothing
let stash_func = function (text: string): string {
    return text;
};

// We fill up the actual values when initializing.
let pygments_data: PygmentsData["langs"] = {};

export function initialize(generated_pygments_data: PygmentsData): void {
    pygments_data = generated_pygments_data.langs;
}

export function wrap_code(code: string, lang?: string): string {
    let header = '<div class="codehilite"><pre><span></span><code>';
    // Mimics the backend logic of adding a data-attribute (data-code-language)
    // to know what Pygments language was used to highlight this code block.
    if (lang !== undefined && lang !== "") {
        const code_language = pygments_data[lang]?.pretty_name ?? lang;
        header = `<div class="codehilite" data-code-language="${_.escape(
            code_language,
        )}"><pre><span></span><code>`;
    }
    // Trim trailing \n until there's just one left
    // This mirrors how pygments handles code input
    return header + _.escape(code.replaceAll(/^\n+|\n+$/g, "")) + "\n</code></pre></div>";
}

function wrap_quote(text: string): string {
    const paragraphs = text.split("\n");
    const quoted_paragraphs = [];

    // Prefix each quoted paragraph with > at the
    // beginning of each line
    for (const paragraph of paragraphs) {
        const lines = paragraph.split("\n");
        quoted_paragraphs.push(lines.map((line) => "> " + line).join("\n"));
    }

    return quoted_paragraphs.join("\n");
}

function wrap_tex(tex: string): string {
    try {
        return "<p>" + katex.renderToString(tex, {displayMode: true}) + "</p>";
    } catch {
        return '<p><span class="tex-error">' + _.escape(tex) + "</span></p>";
    }
}

function wrap_spoiler(header: string, text: string, stash_func: (text: string) => string): string {
    const header_div_open_html = '<div class="spoiler-block"><div class="spoiler-header">';
    const end_header_start_content_html = '</div><div class="spoiler-content" aria-hidden="true">';
    const footer_html = "</div></div>";

    const output = [
        stash_func(header_div_open_html),
        header,
        stash_func(end_header_start_content_html),
        text,
        stash_func(footer_html),
    ];
    return output.join("\n\n");
}

export function set_stash_func(stash_handler: (text: string) => string): void {
    stash_func = stash_handler;
}

export function process_fenced_code(content: string): string {
    const input = content.split("\n");
    const output: string[] = [];
    const handler_stack: Handler[] = [];
    let consume_line: (lines: string[], line: string) => void;

    function handler_for_fence(
        output_lines: string[],
        fence: string,
        lang: string,
        header: string,
    ): Handler {
        // lang is ignored except for 'quote', as we
        // don't do syntax highlighting yet
        const lines: string[] = [];
        if (lang === "quote") {
            return {
                handle_line(line) {
                    if (line === fence) {
                        this.done();
                    } else {
                        consume_line(lines, line);
                    }
                },

                done() {
                    const text = wrap_quote(lines.join("\n"));
                    output_lines.push("", text, "");
                    handler_stack.pop();
                },
            };
        }

        if (lang === "math") {
            return {
                handle_line(line) {
                    if (line === fence) {
                        this.done();
                    } else {
                        lines.push(line);
                    }
                },

                done() {
                    const text = wrap_tex(lines.join("\n"));
                    const placeholder = stash_func(text);
                    output_lines.push("", placeholder, "");
                    handler_stack.pop();
                },
            };
        }

        if (lang === "spoiler") {
            return {
                handle_line(line) {
                    if (line === fence) {
                        this.done();
                    } else {
                        lines.push(line);
                    }
                },

                done() {
                    const text = wrap_spoiler(header, lines.join("\n"), stash_func);
                    output_lines.push("", text, "");
                    handler_stack.pop();
                },
            };
        }

        return {
            handle_line(line) {
                if (line === fence) {
                    this.done();
                } else {
                    lines.push(line.trimEnd());
                }
            },

            done() {
                const text = wrap_code(lines.join("\n"), lang);
                // insert safe HTML that is passed through the parsing
                const placeholder = stash_func(text);
                output_lines.push("", placeholder, "");
                handler_stack.pop();
            },
        };
    }

    function default_handler(): Handler {
        return {
            handle_line(line) {
                consume_line(output, line);
            },
            done() {
                handler_stack.pop();
            },
        };
    }

    consume_line = function consume_line(output_lines: string[], line: string) {
        const match = fence_re.exec(line);
        if (match) {
            const fence = match[1]!;
            const lang = match[3]!;
            const header = match[5]!;
            const handler = handler_for_fence(output_lines, fence, lang, header);
            handler_stack.push(handler);
        } else {
            output_lines.push(line);
        }
    };

    const current_handler = default_handler();
    handler_stack.push(current_handler);

    for (const line of input) {
        const handler = handler_stack.at(-1);
        assert(handler !== undefined, "Handler stack is empty.");
        handler.handle_line(line);
    }

    // Clean up all trailing blocks by letting them
    // insert closing fences
    while (handler_stack.length > 0) {
        const handler = handler_stack.at(-1);
        handler!.done();
    }

    if (output.length > 2 && output.at(-2) !== "") {
        output.push("");
    }

    return output.join("\n");
}

const fence_length_re = /^ {0,3}(`{3,})/gm;
export function get_unused_fence(content: string): string {
    // we only return ``` fences, not ~~~.
    let length = 3;
    let match;
    fence_length_re.lastIndex = 0;
    while ((match = fence_length_re.exec(content)) !== null) {
        length = Math.max(length, match[1]!.length + 1);
    }
    return "`".repeat(length);
}
```

--------------------------------------------------------------------------------

---[FILE: fetch_status.ts]---
Location: zulip-main/web/src/fetch_status.ts

```typescript
import * as message_feed_loading from "./message_feed_loading.ts";
import type {Message, RawMessage} from "./message_store.ts";

function max_id_for_messages(messages: (Message | RawMessage)[]): number {
    let max_id = 0;
    for (const msg of messages) {
        max_id = Math.max(max_id, msg.id);
    }
    return max_id;
}

export class FetchStatus {
    // The FetchStatus object tracks the state of a
    // message_list_data object, whether rendered in the DOM or not,
    // and is the source of truth for whether the message_list_data
    // object has the complete history of the view or whether more
    // messages should be loaded when scrolling to the top or bottom
    // of the message feed.
    _loading_older = false;
    _loading_newer = false;
    _found_oldest = false;
    _found_newest = false;
    _history_limited = false;

    // Tracks the highest message ID that we know exist in this view,
    // but are not within the contiguous range of messages we have
    // received from the server.  Used to correctly handle a rare race
    // condition where a newly sent message races with fetching a
    // group of messages that would lead to found_newest being set
    // (described in detail below).
    _expected_max_message_id = 0;

    start_older_batch(opts: {update_loading_indicator: boolean}): void {
        this._loading_older = true;
        if (opts.update_loading_indicator) {
            message_feed_loading.show_loading_older();
        }
    }

    finish_older_batch(opts: {
        found_oldest: boolean;
        history_limited: boolean;
        update_loading_indicator: boolean;
    }): void {
        this._loading_older = false;
        this._found_oldest = opts.found_oldest;
        this._history_limited = opts.history_limited;
        if (opts.update_loading_indicator) {
            message_feed_loading.hide_loading_older();
        }
    }

    can_load_older_messages(): boolean {
        return !this._loading_older && !this._found_oldest;
    }

    has_found_oldest(): boolean {
        return this._found_oldest;
    }

    history_limited(): boolean {
        return this._history_limited;
    }

    start_newer_batch(opts: {update_loading_indicator: boolean}): void {
        this._loading_newer = true;
        if (opts.update_loading_indicator) {
            message_feed_loading.show_loading_newer();
        }
    }

    finish_newer_batch(
        messages: RawMessage[],
        opts: {update_loading_indicator: boolean; found_newest: boolean},
    ): boolean {
        // Returns true if and only if the caller needs to trigger an
        // additional fetch due to the race described below.
        const found_max_message_id = max_id_for_messages(messages);
        this._loading_newer = false;
        this._found_newest = opts.found_newest;
        if (opts.update_loading_indicator) {
            message_feed_loading.hide_loading_newer();
        }
        if (this._found_newest && this._expected_max_message_id > found_max_message_id) {
            // This expected_max_message_id logic is designed to
            // resolve a subtle race condition involving newly sent
            // messages in a view that does not display the currently
            // latest messages.
            //
            // When a new message arrives matching the current view
            // and found_newest is false, we cannot add the message to
            // the view in-order without creating invalid output
            // (where two messages are display adjacent but might be
            // weeks and hundreds of messages apart in actuality).
            //
            // So we have to discard those messages.  Usually, this is
            // fine; the client will receive those when the user
            // scrolls to the bottom of the page, triggering another
            // fetch.  With that solution, a rare race is still possible,
            // with this sequence:
            //
            // 1. Client initiates GET /messages to fetch the last
            //    batch of messages in this view.  The server
            //    completes the database access and starts sending
            //    the response with found_newest=true.
            // 1. A new message is sent matching the view, the event reaches
            //    the client.  We discard the message because found_newest=false.
            // 1. The client receives the GET /messages response, and
            //    marks found_newest=true.  As a result, it believes is has
            //    the latest messages and won't fetch more, but is missing the
            //    recently sent message.
            //
            // To address this problem, we track the highest message
            // ID among messages that were discarded due to
            // fetch_status in expected_max_message_id.  If that is
            // higher than the highest ID returned in a GET /messages
            // response with found_newest=true, we know the above race
            // has happened and trigger an additional fetch.
            this._found_newest = false;

            // Resetting our tracked last message id is an important
            // circuit-breaker for cases where the message(s) that we
            // "know" exist were deleted or moved to another topic.
            this._expected_max_message_id = 0;
            return true;
        }
        return false;
    }

    can_load_newer_messages(): boolean {
        return !this._loading_newer && !this._found_newest;
    }

    has_found_newest(): boolean {
        return this._found_newest;
    }

    update_expected_max_message_id(messages: Message[]): void {
        this._expected_max_message_id = Math.max(
            this._expected_max_message_id,
            max_id_for_messages(messages),
        );
    }

    copy_status(fetch_status: FetchStatus): void {
        this._found_newest = fetch_status.has_found_newest();
        this._found_oldest = fetch_status.has_found_oldest();
        this._expected_max_message_id = fetch_status._expected_max_message_id;
        this._history_limited = fetch_status._history_limited;
        // We don't want to copy over the loading state of the message list
        // data since the same data object is not used for two messages lists
        // and hence when the fetch is finished, only the original message list
        // data will be updated.
    }
}
```

--------------------------------------------------------------------------------

````

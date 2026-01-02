---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 698
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 698 of 1290)

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

---[FILE: topic_list.ts]---
Location: zulip-main/web/src/topic_list.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";

import render_more_topics from "../templates/more_topics.hbs";
import render_more_topics_spinner from "../templates/more_topics_spinner.hbs";
import render_topic_list_item from "../templates/topic_list_item.hbs";
import render_topic_list_new_topic from "../templates/topic_list_new_topic.hbs";

import {all_messages_data} from "./all_messages_data.ts";
import * as blueslip from "./blueslip.ts";
import {Typeahead} from "./bootstrap_typeahead.ts";
import type {TypeaheadInputElement} from "./bootstrap_typeahead.ts";
import * as mouse_drag from "./mouse_drag.ts";
import * as popover_menus from "./popover_menus.ts";
import * as scroll_util from "./scroll_util.ts";
import * as stream_data from "./stream_data.ts";
import * as stream_topic_history from "./stream_topic_history.ts";
import * as stream_topic_history_util from "./stream_topic_history_util.ts";
import type {StreamSubscription} from "./sub_store.ts";
import * as sub_store from "./sub_store.ts";
import * as topic_filter_pill from "./topic_filter_pill.ts";
import type {TopicFilterPill, TopicFilterPillWidget} from "./topic_filter_pill.ts";
import * as topic_list_data from "./topic_list_data.ts";
import type {TopicInfo} from "./topic_list_data.ts";
import * as typeahead_helper from "./typeahead_helper.ts";
import * as ui_util from "./ui_util.ts";
import * as vdom from "./vdom.ts";

/* Track all active widgets with a Map by stream_id. We have at max
   one for now, but we may eventually allow multiple streams to be
   expanded. */
const active_widgets = new Map<number, LeftSidebarTopicListWidget>();
export let topic_filter_pill_widget: TopicFilterPillWidget | null = null;
export let topic_state_typeahead: Typeahead<TopicFilterPill> | undefined;

// We know whether we're zoomed or not.
let zoomed = false;

// Scroll position before user started searching.
let pre_search_scroll_position = 0;
let previous_search_term = "";

export function update(): void {
    for (const widget of active_widgets.values()) {
        widget.build();
    }
}

export function update_widget_for_stream(stream_id: number): void {
    const widget = active_widgets.get(stream_id);
    if (widget === undefined) {
        blueslip.warn("User re-narrowed before topic history was returned.");
        return;
    }
    widget.build();
}

export function clear(): void {
    popover_menus.get_topic_menu_popover()?.hide();
    topic_filter_pill_widget?.clear(true);

    for (const widget of active_widgets.values()) {
        widget.remove();
    }

    active_widgets.clear();
}

export function close(): void {
    zoomed = false;
    clear();
    ui_util.enable_left_sidebar_search();
}

export function zoom_out(): void {
    zoomed = false;
    ui_util.enable_left_sidebar_search();

    const stream_ids = [...active_widgets.keys()];

    if (stream_ids.length !== 1 || stream_ids[0] === undefined) {
        blueslip.error("Unexpected number of topic lists to zoom out.");
        return;
    }

    const stream_id = stream_ids[0];
    const widget = active_widgets.get(stream_id);
    assert(widget !== undefined);
    const parent_widget = widget.get_parent();

    // Reset the resolved topic filter since we moved away
    // from the view.
    topic_filter_pill_widget?.clear(true);

    rebuild_left_sidebar(parent_widget, stream_id);
}

type ListInfoNodeOptions =
    | {
          type: "topic";
          conversation: TopicInfo;
      }
    | {
          type: "more_items";
          more_topics_unreads: number;
      }
    | {
          type: "spinner";
      }
    | {
          type: "new_topic";
      };

export type ListInfoNode = vdom.Node<ListInfoNodeOptions>;

export function keyed_topic_li(conversation: TopicInfo): ListInfoNode {
    const render = (): string => render_topic_list_item(conversation);

    const eq = (other: ListInfoNode): boolean =>
        other.type === "topic" && _.isEqual(conversation, other.conversation);

    const key = "t:" + conversation.topic_name;

    return {
        key,
        render,
        type: "topic",
        conversation,
        eq,
    };
}

export function more_li(
    more_topics_unreads: number,
    more_topics_have_unread_mention_messages: boolean,
    more_topics_unread_count_muted: boolean,
): ListInfoNode {
    const render = (): string =>
        render_more_topics({
            more_topics_unreads,
            more_topics_have_unread_mention_messages,
            more_topics_unread_count_muted,
        });

    const eq = (other: ListInfoNode): boolean =>
        other.type === "more_items" && more_topics_unreads === other.more_topics_unreads;

    const key = "more";

    return {
        key,
        type: "more_items",
        more_topics_unreads,
        render,
        eq,
    };
}

export function spinner_li(): ListInfoNode {
    const render = (): string => render_more_topics_spinner();

    const eq = (other: ListInfoNode): boolean => other.type === "spinner";

    const key = "more";

    return {
        key,
        type: "spinner",
        render,
        eq,
    };
}

export function new_topic(stream_id: number): ListInfoNode {
    const render = (): string => render_topic_list_new_topic({stream_id});

    const eq = (other: ListInfoNode): boolean => other.type === "new_topic";

    const key = "more";

    return {
        key,
        type: "new_topic",
        render,
        eq,
    };
}

export function is_full_topic_history_available(
    stream_id: number,
    num_topics_displayed: number,
): boolean {
    if (stream_topic_history.has_history_for(stream_id)) {
        return true;
    }

    function all_topics_in_cache(sub: StreamSubscription): boolean {
        // Checks whether this browser's cache of contiguous messages
        // (used to locally render narrows) in all_messages_data has all
        // messages from a given stream. Because all_messages_data is a range,
        // we just need to compare it to the range of history on the stream.

        // If the cache isn't initialized, it's a clear false.
        if (all_messages_data === undefined || all_messages_data.empty()) {
            return false;
        }

        // If the cache doesn't have the latest messages, we can't be sure
        // we have all topics.
        if (!all_messages_data.fetch_status.has_found_newest()) {
            return false;
        }

        if (sub.first_message_id === null) {
            // If the stream has no message history, we have it all
            // vacuously.  This should be a very rare condition, since
            // stream creation sends a message.
            return true;
        }

        const first_cached_message = all_messages_data.first_including_muted();
        if (sub.first_message_id < first_cached_message!.id) {
            // Missing the oldest topics in this stream in our cache.
            return false;
        }

        // At this stage, number of topics displayed in the topic list
        // widget is at max `topic_list_data.max_topics` and
        // sub.first_message_id >= first_cached_message!.id.
        //
        // There's a possibility of a few topics missing for messages
        // which were sent when the user wasn't subscribed.
        // Fetch stream history to confirm if all topics are already
        // displayed otherwise rebuild with updated data.
        stream_topic_history_util.get_server_history(stream_id, () => {
            const history = stream_topic_history.find_or_create(stream_id);
            if (history.topics.size > num_topics_displayed) {
                update_widget_for_stream(stream_id);
            }
        });
        // We return `true` which can possibly lead to missing
        // 'show all topics', even if all the topics are not displayed.
        // The `get_server_history` call above takes care of fetching
        // channel history and rebuilding topic list if needed.
        return true;
    }

    const sub = sub_store.get(stream_id);
    const in_cache = sub !== undefined && all_topics_in_cache(sub);

    if (in_cache) {
        /*
            If the stream is cached, we can add it to
            fetched_stream_ids.  Note that for the opposite
            scenario, we don't delete from
            fetched_stream_ids, because we may just be
            waiting for the initial message fetch.
        */
        stream_topic_history.mark_history_fetched_for(stream_id);
    }

    return in_cache;
}

export class TopicListWidget {
    topic_list_class_name = "topic-list";
    prior_dom: vdom.Tag<ListInfoNodeOptions> | undefined = undefined;
    $parent_elem: JQuery;
    my_stream_id: number;
    filter_topics: (topic_names: string[]) => string[];

    constructor(
        $parent_elem: JQuery,
        my_stream_id: number,
        filter_topics: (topic_names: string[]) => string[],
    ) {
        this.$parent_elem = $parent_elem;
        this.my_stream_id = my_stream_id;
        this.filter_topics = filter_topics;
    }

    build_list(
        spinner: boolean,
        formatter: (conversation: TopicInfo) => ListInfoNode,
        is_zoomed: boolean,
    ): vdom.Tag<ListInfoNodeOptions> {
        const list_info = topic_list_data.get_list_info(
            this.my_stream_id,
            is_zoomed,
            this.filter_topics,
        );

        const num_possible_topics = list_info.num_possible_topics;
        const more_topics_unreads = list_info.more_topics_unreads;
        const more_topics_have_unread_mention_messages =
            list_info.more_topics_have_unread_mention_messages;

        const is_showing_all_possible_topics =
            list_info.items.length === num_possible_topics &&
            is_full_topic_history_available(this.my_stream_id, num_possible_topics);

        const topic_list_classes: [string] = [this.topic_list_class_name];

        if (list_info.items.length > 0) {
            topic_list_classes.push("topic-list-has-topics");
        }

        const attrs: [string, string][] = [["class", topic_list_classes.join(" ")]];

        const nodes = list_info.items.map((conversation) => formatter(conversation));
        const stream = stream_data.get_sub_by_id(this.my_stream_id);
        assert(stream);

        if (spinner) {
            nodes.push(spinner_li());
        } else if (!is_showing_all_possible_topics) {
            nodes.push(
                more_li(
                    more_topics_unreads,
                    more_topics_have_unread_mention_messages,
                    list_info.more_topics_unread_count_muted,
                ),
            );
        } else if (is_zoomed && stream_data.can_post_messages_in_stream(stream)) {
            nodes.push(new_topic(this.my_stream_id));
        }

        const dom = vdom.ul({
            attrs,
            keyed_nodes: nodes,
        });

        return dom;
    }

    get_parent(): JQuery {
        return this.$parent_elem;
    }

    get_stream_id(): number {
        return this.my_stream_id;
    }

    remove(): void {
        this.$parent_elem.find(`.${this.topic_list_class_name}`).remove();
        this.prior_dom = undefined;
    }

    build(
        spinner = false,
        formatter: (conversation: TopicInfo) => ListInfoNode,
        is_zoomed: boolean,
    ): void {
        const new_dom = this.build_list(spinner, formatter, is_zoomed);

        const replace_content = (html: string): void => {
            this.remove();
            this.$parent_elem.append($(html));
        };

        const find = (): JQuery => this.$parent_elem.find(`.${this.topic_list_class_name}`);

        vdom.update(replace_content, find, new_dom, this.prior_dom);

        this.prior_dom = new_dom;
    }

    is_empty(): boolean {
        const $topic_list = this.$parent_elem.find(`.${this.topic_list_class_name}`);
        return !$topic_list.hasClass("topic-list-has-topics");
    }
}

function filter_topics_left_sidebar(topic_names: string[]): string[] {
    const search_term = get_left_sidebar_topic_search_term();
    return topic_list_data.filter_topics_by_search_term(
        topic_names,
        search_term,
        get_typeahead_search_pills_syntax(),
    );
}

export class LeftSidebarTopicListWidget extends TopicListWidget {
    constructor($parent_elem: JQuery, my_stream_id: number) {
        super($parent_elem, my_stream_id, filter_topics_left_sidebar);
    }

    override build(spinner = false): void {
        const is_zoomed = zoomed;
        const formatter = keyed_topic_li;

        super.build(spinner, formatter, is_zoomed);
    }
}

export function clear_topic_search(e: JQuery.Event): void {
    e.stopPropagation();

    topic_filter_pill_widget?.clear(true);

    const $input = $("#topic_filter_query");
    // Since the `clear` function of the topic_filter_pill_widget
    // takes care of clearing both the text content and the
    // pills, we just need to trigger an input event on the
    // contenteditable element to reset the topic list via
    // the `input` event handler without having to manually
    // manage the reset of the topic list.
    $input.trigger("input");
}

export function active_stream_id(): number | undefined {
    const stream_ids = [...active_widgets.keys()];

    if (stream_ids.length !== 1) {
        return undefined;
    }

    return stream_ids[0];
}

export function get_stream_li(): JQuery | undefined {
    const widgets = [...active_widgets.values()];

    if (widgets.length !== 1 || widgets[0] === undefined) {
        return undefined;
    }

    const $stream_li = widgets[0].get_parent();
    return $stream_li;
}

export function rebuild_left_sidebar($stream_li: JQuery, stream_id: number): void {
    const active_widget = active_widgets.get(stream_id);

    if (active_widget) {
        active_widget.build();
        return;
    }

    clear();
    const widget = new LeftSidebarTopicListWidget($stream_li, stream_id);
    widget.build();

    active_widgets.set(stream_id, widget);
}

export function left_sidebar_scroll_zoomed_in_topic_into_view(): void {
    const $selected_topic = $(".topic-list .topic-list-item.active-sub-filter");
    if ($selected_topic.length === 0) {
        // If we don't have a selected topic, scroll to top.
        scroll_util.get_scroll_element($("#left_sidebar_scroll_container")).scrollTop(0);
        return;
    }
    const $container = $("#left_sidebar_scroll_container");
    const stream_header_height =
        $(".narrow-filter.stream-expanded .bottom_left_row").outerHeight(true) ?? 0;
    const topic_header_height = $("#topics_header").outerHeight(true) ?? 0;
    const channel_folder_header_height =
        $selected_topic.closest(".stream-list-subsection-header").outerHeight(true) ?? 0;
    const sticky_header_height =
        stream_header_height + topic_header_height + channel_folder_header_height;
    scroll_util.scroll_element_into_container($selected_topic, $container, sticky_header_height);
}

// For zooming, we only do topic-list stuff here...let stream_list
// handle hiding/showing the non-narrowed streams
export function zoom_in(): void {
    zoomed = true;
    previous_search_term = "";
    pre_search_scroll_position = 0;
    ui_util.disable_left_sidebar_search();

    const stream_id = active_stream_id();
    if (stream_id === undefined) {
        blueslip.error("Cannot find widget for topic history zooming.");
        return;
    }

    const active_widget = active_widgets.get(stream_id);
    assert(active_widget !== undefined);

    function on_success(): void {
        if (!active_widgets.has(stream_id!)) {
            blueslip.warn("User re-narrowed before topic history was returned.");
            return;
        }

        if (!zoomed) {
            blueslip.warn("User zoomed out before topic history was returned.");
            // Note that we could attempt to re-draw the zoomed out topic list
            // here, given that we have more history, but that might be more
            // confusing than helpful to a user who is likely trying to browse
            // other streams.
            return;
        }

        active_widget!.build();
        if (zoomed) {
            // It is fine to force scroll here even if user has scrolled to a different
            // position since we just added some topics to the list which moved user
            // to a different position anyway.
            left_sidebar_scroll_zoomed_in_topic_into_view();
            topic_state_typeahead?.lookup(true);
        }
    }

    const spinner = true;
    active_widget.build(spinner);

    stream_topic_history_util.get_server_history(stream_id, on_success);
    left_sidebar_scroll_zoomed_in_topic_into_view();
}

export function get_left_sidebar_topic_search_term(): string {
    if (zoomed) {
        return $("#topic_filter_query").text().trim();
    }
    return ui_util.get_left_sidebar_search_term();
}

export function get_typeahead_search_pills_syntax(): string {
    const pills = topic_filter_pill_widget?.items() ?? [];

    if (pills.length === 0) {
        return "";
    }

    // For now, there is only one pill in the left sidebar topic search input.
    // This is because we only allow one topic filter pill at a time.
    // If we allow multiple pills in the future, we may need to
    // change this logic to return the syntax of all pills.
    if (pills.length > 1) {
        blueslip.warn("Multiple pills found in left sidebar topic search input.");
    }

    // We can remove this assumption once we allow multiple pills and hence update the
    // callers of this function to handle multiple pills and implement the search accordingly.
    return pills[0]!.syntax;
}

function set_search_bar_text(text: string): void {
    const $input = $("#topic_filter_query");
    $input.text(text);
    $input.trigger("input");
}

export function setup_topic_search_typeahead(): void {
    const $input = $("#topic_filter_query");
    const $pill_container = $("#left-sidebar-filter-topic-input");

    if ($input.length === 0 || $pill_container.length === 0) {
        return;
    }

    topic_filter_pill_widget = topic_filter_pill.create_pills($pill_container);

    const typeahead_input: TypeaheadInputElement = {
        $element: $input,
        type: "contenteditable",
    };

    const options = {
        source() {
            const stream_id = active_stream_id();
            assert(stream_id !== undefined);

            if (!stream_topic_history.stream_has_locally_available_resolved_topics(stream_id)) {
                return [];
            }
            const $pills = $("#left-sidebar-filter-topic-input .pill");
            if ($pills.length > 0) {
                return [];
            }
            return [...topic_filter_pill.filter_options];
        },
        item_html(item: TopicFilterPill) {
            return typeahead_helper.render_topic_state(item.label);
        },
        matcher(item: TopicFilterPill, query: string) {
            // This basically only matches if `is:` is in the query.
            return (
                query.includes(":") &&
                (item.syntax.toLowerCase().startsWith(query.toLowerCase()) ||
                    (item.syntax.startsWith("-") &&
                        item.syntax.slice(1).toLowerCase().startsWith(query.toLowerCase())))
            );
        },
        sorter(items: TopicFilterPill[]) {
            // This sort order places "Unresolved topics" first
            // always, which is good because that's almost always what
            // users will want.
            return items;
        },
        updater(item: TopicFilterPill) {
            assert(topic_filter_pill_widget !== null);
            topic_filter_pill_widget.clear(true);
            topic_filter_pill_widget.appendValue(item.syntax);
            set_search_bar_text("");
            $input.trigger("focus");
            return get_left_sidebar_topic_search_term();
        },
        // Prevents key events from propagating to other handlers or
        // triggering default browser actions.
        stopAdvance: true,
        // Use dropup, to match compose typeahead.
        dropup: true,
    };

    topic_state_typeahead = new Typeahead(typeahead_input, options);

    $input.on("keydown", (e: JQuery.KeyDownEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        } else if (e.key === ",") {
            e.stopPropagation();
            return;
        }
    });

    topic_filter_pill_widget.onPillRemove(() => {
        const stream_id = active_stream_id();
        if (stream_id !== undefined) {
            const widget = active_widgets.get(stream_id);
            if (widget) {
                widget.build();
            }
        }
    });
}

export function initialize({
    on_topic_click,
}: {
    on_topic_click: (stream_id: number, topic: string) => void;
}): void {
    $("#stream_filters").on("click", ".topic-box", (e) => {
        const $target = $(e.target);
        if (e.metaKey || e.ctrlKey || e.shiftKey) {
            return;
        }

        // We avoid navigating to the topic if the click happens within elements
        // that are supposed to have their unique behavior on click without triggering
        // navigation.
        if ($(e.target).closest(".show-more-topics").length > 0) {
            return;
        }

        if (
            $target.closest(".visibility-policy-icon").get(0) ||
            $target.closest(".topic-sidebar-menu-icon").get(0)
        ) {
            return;
        }

        // The remaining elements are the topic name, unread counter, and resolved topic
        // marker, as well as empty space. Clicking any of these elements should navigate
        // to the topic, being careful to avoid accidentally triggering click handlers when
        // dragging.
        if (mouse_drag.is_drag(e)) {
            // To avoid the click behavior if a topic link is selected.
            e.preventDefault();
            return;
        }
        const $stream_row = $(e.target).parents(".narrow-filter");
        const stream_id_string = $stream_row.attr("data-stream-id");
        assert(stream_id_string !== undefined);
        const stream_id = Number.parseInt(stream_id_string, 10);
        const topic = $(e.target).parents("li").attr("data-topic-name")!;
        on_topic_click(stream_id, topic);

        e.preventDefault();
        e.stopPropagation();
    });

    $("body").on("input", "#left-sidebar-filter-topic-input", (): void => {
        const stream_id = active_stream_id();
        assert(stream_id !== undefined);

        const search_term = get_left_sidebar_topic_search_term();
        const is_previous_search_term_empty = previous_search_term === "";
        previous_search_term = search_term;

        const widget = active_widgets.get(stream_id)!;
        const left_sidebar_scroll_container = scroll_util.get_left_sidebar_scroll_container();
        if (search_term === "") {
            requestAnimationFrame(() => {
                widget.build();
                // Restore previous scroll position.
                left_sidebar_scroll_container.scrollTop(pre_search_scroll_position);
            });

            // When the contenteditable div is empty, the browser
            // adds a <br> element to it, which interferes with
            // the ":empty" selector in the CSS. Hence, we detect
            // this case and clear the content of the div to ensure
            // that the CSS styles are applied correctly.
            // TODO: Remove this when we have a better way to handle
            // empty contenteditable elements. Since while testing this
            // effect in a sandbox, a `display: inline` applied to the
            // contenteditable element seems to fix the issue, but that
            // doesn't work in this particular case.
            // See: https://stackoverflow.com/questions/14638887/br-is-inserted-into-contenteditable-html-element-if-left-empty
            $("#topic_filter_query").empty();
        } else {
            if (is_previous_search_term_empty) {
                // Store original scroll position to be restored later.
                pre_search_scroll_position = left_sidebar_scroll_container.scrollTop()!;
            }
            requestAnimationFrame(() => {
                widget.build();
                // Always scroll to top when there is a search term present.
                left_sidebar_scroll_container.scrollTop(0);
            });
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: topic_list_data.ts]---
Location: zulip-main/web/src/topic_list_data.ts

```typescript
import assert from "minimalistic-assert";

import * as hash_util from "./hash_util.ts";
import * as narrow_state from "./narrow_state.ts";
import * as resolved_topic from "./resolved_topic.ts";
import * as stream_topic_history from "./stream_topic_history.ts";
import * as sub_store from "./sub_store.ts";
import * as unread from "./unread.ts";
import * as user_topics from "./user_topics.ts";
import * as util from "./util.ts";

const max_topics = 8;
const max_topics_with_unread = 12;

export type TopicInfo = {
    stream_id: number;
    topic_name: string;
    topic_resolved_prefix: string;
    topic_display_name: string;
    is_empty_string_topic: boolean;
    unread: number;
    is_zero: boolean;
    is_muted: boolean;
    is_followed: boolean;
    is_unmuted_or_followed: boolean;
    is_active_topic: boolean;
    url: string;
    contains_unread_mention: boolean;
};

type TopicChoiceState = {
    active_topic: string | undefined;
    topics_with_unread_mentions: Set<string>;
    more_topics_unmuted_unreads: number;
    more_topics_have_unread_mention_messages: boolean;
    more_topics_muted_unreads: number;
    more_topics_have_muted_unread_mention_messages: boolean;
    topics_selected: number;
    items: TopicInfo[];
};

function choose_topics(
    stream_id: number,
    topic_names: string[],
    zoomed: boolean,
    topic_choice_state: TopicChoiceState,
): void {
    for (const [idx, topic_name] of topic_names.entries()) {
        const num_unread = unread.num_unread_for_topic(stream_id, topic_name);
        const is_active_topic = topic_choice_state.active_topic === topic_name.toLowerCase();
        const is_topic_muted = user_topics.is_topic_muted(stream_id, topic_name);
        const is_topic_followed = user_topics.is_topic_followed(stream_id, topic_name);
        const is_topic_unmuted_or_followed = user_topics.is_topic_unmuted_or_followed(
            stream_id,
            topic_name,
        );
        const [topic_resolved_prefix, topic_bare_name] = resolved_topic.display_parts(topic_name);
        // Important: Topics are lower-case in this set.
        const contains_unread_mention = topic_choice_state.topics_with_unread_mentions.has(
            topic_name.toLowerCase(),
        );

        if (!zoomed) {
            function should_show_topic(topics_selected: number): boolean {
                // This function exists just for readability, to
                // avoid long chained conditionals to determine
                // which topics to include.

                // We always show the active topic.  Ideally, this
                // logic would first check whether the active
                // topic is in the set of those with unreads to
                // avoid ending up with max_topics_with_unread + 1
                // total topics if the active topic comes after
                // the first several topics with unread messages.
                if (is_active_topic) {
                    return true;
                }

                // We unconditionally skip showing muted topics
                // when not zoomed, even if they have unread
                // messages.
                if (is_topic_muted) {
                    return false;
                }

                // We include the most recent max_topics topics,
                // even if there are no unread messages.
                if (idx < max_topics && topics_selected < max_topics) {
                    return true;
                }

                // We include older topics with unread messages up
                // until max_topics_with_unread total topics have
                // been included.
                if (num_unread > 0 && topics_selected < max_topics_with_unread) {
                    return true;
                }

                // Otherwise, we don't show the topic in the
                // unzoomed view.  We might display its unread
                // count in "show all topics" if it is not muted.
                return false;
            }

            const show_topic = should_show_topic(topic_choice_state.topics_selected);
            if (!show_topic) {
                if (!is_topic_muted) {
                    topic_choice_state.more_topics_unmuted_unreads += num_unread;
                    if (contains_unread_mention) {
                        topic_choice_state.more_topics_have_unread_mention_messages = true;
                    }
                } else {
                    topic_choice_state.more_topics_muted_unreads += num_unread;
                    if (contains_unread_mention) {
                        topic_choice_state.more_topics_have_muted_unread_mention_messages = true;
                    }
                }
                continue;
            }
            topic_choice_state.topics_selected += 1;
            // We fall through to rendering the topic, using the
            // same code we do when zoomed.
        }

        const topic_info: TopicInfo = {
            stream_id,
            topic_name,
            topic_resolved_prefix,
            topic_display_name: util.get_final_topic_display_name(topic_bare_name),
            is_empty_string_topic: topic_bare_name === "",
            unread: num_unread,
            is_zero: num_unread === 0,
            is_muted: is_topic_muted,
            is_followed: is_topic_followed,
            is_unmuted_or_followed: is_topic_unmuted_or_followed,
            is_active_topic,
            url: hash_util.by_channel_topic_permalink(stream_id, topic_name),
            contains_unread_mention,
        };

        topic_choice_state.items.push(topic_info);
    }
}

function contains_topic(topic_names: string[], narrowed_topic: string): boolean {
    const lower_cased_topics = topic_names.map((name) => name.toLowerCase());
    return lower_cased_topics.includes(narrowed_topic.toLowerCase());
}

type TopicListInfo = {
    items: TopicInfo[];
    num_possible_topics: number;
    more_topics_unreads: number;
    more_topics_have_unread_mention_messages: boolean;
    more_topics_unread_count_muted: boolean;
};

export function filter_topics_by_search_term(
    topic_names: string[],
    search_term: string,
    topics_state = "",
): string[] {
    if (search_term === "" && topics_state === "") {
        return topic_names;
    }

    const word_separator_regex = /[\s/:_-]/; // Use -, _, :, / as word separators in addition to spaces.
    const empty_string_topic_display_name = util.get_final_topic_display_name("");
    topic_names = util.filter_by_word_prefix_match(
        topic_names,
        search_term,
        (topic) => (topic === "" ? empty_string_topic_display_name : topic),
        word_separator_regex,
    );

    if (topics_state === "is:resolved") {
        topic_names = topic_names.filter((name) => resolved_topic.is_resolved(name));
    } else if (topics_state === "-is:resolved") {
        topic_names = topic_names.filter((name) => !resolved_topic.is_resolved(name));
    }

    return topic_names;
}

export function get_filtered_topic_names(
    stream_id: number,
    filter_topics: (topic_names: string[]) => string[],
): string[] {
    const topic_names = stream_topic_history.get_recent_topic_names(stream_id);
    const narrowed_topic = narrow_state.topic();

    // If the user is viewing a topic with no messages, include
    // the topic name to the beginning of the list of topics.
    if (
        stream_id === narrow_state.stream_id() &&
        narrowed_topic !== undefined &&
        !contains_topic(topic_names, narrowed_topic)
    ) {
        topic_names.unshift(narrowed_topic);
    }

    return filter_topics(topic_names);
}

export function get_list_info(
    stream_id: number,
    zoomed: boolean,
    filter_topics: (topic_names: string[]) => string[],
): TopicListInfo {
    const topic_choice_state: TopicChoiceState = {
        items: [],
        topics_selected: 0,
        more_topics_muted_unreads: 0,
        more_topics_unmuted_unreads: 0,
        more_topics_have_unread_mention_messages: false,
        more_topics_have_muted_unread_mention_messages: false,
        active_topic: narrow_state.topic()?.toLowerCase(),
        topics_with_unread_mentions: unread.get_topics_with_unread_mentions(stream_id),
    };

    const sub = sub_store.get(stream_id);
    assert(sub !== undefined);
    const stream_muted = sub.is_muted;

    const topic_names = get_filtered_topic_names(stream_id, filter_topics);

    if (stream_muted && !zoomed) {
        const unmuted_or_followed_topics = topic_names.filter((topic) =>
            user_topics.is_topic_unmuted_or_followed(stream_id, topic),
        );
        choose_topics(stream_id, unmuted_or_followed_topics, zoomed, topic_choice_state);

        const other_topics = topic_names.filter(
            (topic) => !user_topics.is_topic_unmuted_or_followed(stream_id, topic),
        );
        choose_topics(stream_id, other_topics, zoomed, topic_choice_state);
    } else {
        choose_topics(stream_id, topic_names, zoomed, topic_choice_state);
    }

    if (
        topic_choice_state.more_topics_unmuted_unreads === 0 &&
        topic_choice_state.more_topics_muted_unreads > 0 &&
        stream_muted
    ) {
        // For muted streams, if the only unreads are in muted topics,
        // we have a muted styling "all topics" row.
        return {
            items: topic_choice_state.items,
            num_possible_topics: topic_names.length,
            more_topics_unreads: topic_choice_state.more_topics_muted_unreads,
            more_topics_have_unread_mention_messages:
                topic_choice_state.more_topics_have_muted_unread_mention_messages,
            more_topics_unread_count_muted: true,
        };
    }
    return {
        items: topic_choice_state.items,
        num_possible_topics: topic_names.length,
        more_topics_unreads: topic_choice_state.more_topics_unmuted_unreads,
        more_topics_have_unread_mention_messages:
            // Because mentions are important, and get displayed in the
            // overall summary, we display the mention indicator even if
            // they are in muted streams.
            topic_choice_state.more_topics_have_unread_mention_messages ||
            topic_choice_state.more_topics_have_muted_unread_mention_messages,
        more_topics_unread_count_muted: false,
    };
}
```

--------------------------------------------------------------------------------

````

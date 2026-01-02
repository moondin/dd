---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 644
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 644 of 1290)

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

---[FILE: message_viewport.ts]---
Location: zulip-main/web/src/message_viewport.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as message_lists from "./message_lists.ts";
import * as message_scroll_state from "./message_scroll_state.ts";
import type {Message} from "./message_store.ts";
import * as rows from "./rows.ts";
import * as util from "./util.ts";

export type MessageViewportInfo = {
    visible_top: number;
    visible_bottom: number;
    visible_height: number;
};

export const $scroll_container = $(":root");

let window_resize_handler: () => void;

export function register_resize_handler(handler: () => void): void {
    window_resize_handler = handler;
}

let in_stoppable_autoscroll = false;

const cached_width = new util.CachedValue({compute_value: () => $scroll_container.width() ?? 0});
const cached_height = new util.CachedValue({compute_value: () => $scroll_container.height() ?? 0});
export const width = cached_width.get.bind(cached_width);
export const height = cached_height.get.bind(cached_height);

// Includes both scroll and arrow events. Negative means scroll up,
// positive means scroll down.
export let last_movement_direction = 1;

export function set_last_movement_direction(value: number): void {
    last_movement_direction = value;
}

export function at_rendered_top(): boolean {
    return scrollTop() <= 0;
}

export function message_viewport_info(): MessageViewportInfo {
    // Return a structure that tells us details of the viewport
    // accounting for fixed elements like the top navbar.
    //
    // Sticky message_header is NOT considered to be part of the visible
    // message pane, which should make sense for callers, who will
    // generally be concerned about whether actual message content is
    // visible.
    const $element_just_above_us = $("#navbar-fixed-container");
    const $element_just_below_us = $("#compose");

    let visible_top = $element_just_above_us.outerHeight() ?? 0;

    const $sticky_header = $(".sticky_header");
    if ($sticky_header.length > 0) {
        visible_top += $sticky_header.outerHeight() ?? 0;
    }

    const visible_bottom = $element_just_below_us.position().top;

    const visible_height = visible_bottom - visible_top;

    return {
        visible_top,
        visible_bottom,
        visible_height,
    };
}

// Important note: These functions just look at the state of the
// rendered message feed; messages that are not displayed due to a
// limited render window or because they have not been fetched from
// the server are not considered.
export function at_rendered_bottom(): boolean {
    const bottom = scrollTop() + height();
    // This also includes bottom whitespace.
    const full_height = util.the($scroll_container).scrollHeight;

    // We only know within a pixel or two if we're
    // exactly at the bottom, due to browser quirkiness,
    // and we err on the side of saying that we are at
    // the bottom.
    return bottom + 2 >= full_height;
}

// This differs from at_rendered_bottom in that it only requires the
// bottom message to be visible, but you may be able to scroll down
// further to see the rest of that message.
export function bottom_rendered_message_visible(): boolean {
    const $last_row = rows.last_visible();
    if ($last_row[0] !== undefined) {
        const message_bottom = $last_row[0].getBoundingClientRect().bottom;
        const bottom_of_feed = util.the($("#compose")).getBoundingClientRect().top;
        return bottom_of_feed > message_bottom;
    }
    return false;
}

export function is_below_visible_bottom(offset: number): boolean {
    return offset > scrollTop() + height() - ($("#compose").height() ?? 0);
}

export function is_scrolled_up(): boolean {
    // Let's determine whether the user was already dealing
    // with messages off the screen, which can guide auto
    // scrolling decisions.
    const $last_row = rows.last_visible();
    if ($last_row.length === 0) {
        return false;
    }

    const offset = offset_from_bottom($last_row);

    return offset > 0;
}

export function offset_from_bottom($last_row: JQuery): number {
    // A positive return value here means the last row is
    // below the bottom of the feed (i.e. obscured by the compose
    // box or even further below the bottom).
    const message_bottom = $last_row.get_offset_to_window().bottom;
    const info = message_viewport_info();

    return message_bottom - info.visible_bottom;
}

export function set_message_position(
    message_top: number,
    message_height: number,
    viewport_info: MessageViewportInfo,
    ratio: number,
): void {
    // message_top = offset of the top of a message that you are positioning
    // message_height = height of the message that you are positioning
    // viewport_info = result of calling message_viewport.message_viewport_info
    // ratio = fraction indicating how far down the screen the msg should be

    let how_far_down_in_visible_page = viewport_info.visible_height * ratio;

    // special case: keep large messages fully on the screen
    if (how_far_down_in_visible_page + message_height > viewport_info.visible_height) {
        how_far_down_in_visible_page = viewport_info.visible_height - message_height;

        // Next handle truly gigantic messages.  We just say that the top of the
        // message goes to the top of the viewing area.  Realistically, gigantic
        // messages should either be condensed, socially frowned upon, or scrolled
        // with the mouse.
        if (how_far_down_in_visible_page < 0) {
            how_far_down_in_visible_page = 0;
        }
    }

    const hidden_top = viewport_info.visible_top - scrollTop();

    const message_offset = how_far_down_in_visible_page + hidden_top;

    const new_scroll_top = message_top - message_offset;

    // Ensure we will scroll before we disable updating selection.
    // This avoids a bug where message selection doesn't change on user scroll.
    if (
        // Can't scroll up if we are already at top.
        (new_scroll_top <= 0 && window.scrollY === 0) ||
        // Can't scroll down if we are already at bottom.
        (new_scroll_top >= height() && window.scrollY === height())
    ) {
        return;
    }
    message_scroll_state.set_update_selection_on_next_scroll(false);
    scrollTop(new_scroll_top);
}

function in_viewport_or_tall(
    rect: DOMRect,
    top_of_feed: number,
    bottom_of_feed: number,
    require_fully_visible: boolean,
): boolean {
    if (require_fully_visible) {
        return (
            rect.top > top_of_feed && // Message top is in view and
            (rect.bottom < bottom_of_feed || // message is fully in view or
                (rect.height > bottom_of_feed - top_of_feed && rect.top < bottom_of_feed))
        ); // message is tall.
    }
    return rect.bottom > top_of_feed && rect.top < bottom_of_feed;
}

function add_to_visible<T>(
    $candidates: JQuery,
    visible: T[],
    top_of_feed: number,
    bottom_of_feed: number,
    require_fully_visible: boolean,
    row_to_output: ($row: HTMLElement) => T,
): void {
    for (const row of $candidates) {
        const row_rect = row.getBoundingClientRect();
        // Mark very tall messages as read once we've gotten past them
        if (in_viewport_or_tall(row_rect, top_of_feed, bottom_of_feed, require_fully_visible)) {
            visible.push(row_to_output(row));
        } else {
            break;
        }
    }
}

const top_of_feed = new util.CachedValue({
    compute_value() {
        const $header = $("#navbar-fixed-container");
        let visible_top = $header.outerHeight() ?? 0;

        const $sticky_header = $(".sticky_header");
        if ($sticky_header.length > 0) {
            visible_top += $sticky_header.outerHeight() ?? 0;
        }
        return visible_top;
    },
});

const bottom_of_feed = new util.CachedValue({
    compute_value() {
        return util.the($("#compose")).getBoundingClientRect().top;
    },
});

function _visible_divs<T>(
    $selected_row: JQuery,
    row_min_height: number,
    row_to_output: ($row: HTMLElement) => T,
    div_class: string,
    require_fully_visible: boolean,
): T[] {
    // Note that when using getBoundingClientRect() we are getting offsets
    // relative to the visible window, but when using jQuery's offset() we are
    // getting offsets relative to the full scrollable window. You can't try to
    // compare heights from these two methods.
    const height = bottom_of_feed.get() - top_of_feed.get();
    const num_neighbors = Math.floor(height / row_min_height);

    // We do this explicitly without merges and without recalculating
    // the feed bounds to keep this computation as cheap as possible.
    const visible: T[] = [];
    const $above_pointer = $selected_row
        .prevAll(`div.${CSS.escape(div_class)}`)
        .slice(0, num_neighbors);
    const $below_pointer = $selected_row
        .nextAll(`div.${CSS.escape(div_class)}`)
        .slice(0, num_neighbors);
    add_to_visible(
        $selected_row,
        visible,
        top_of_feed.get(),
        bottom_of_feed.get(),
        require_fully_visible,
        row_to_output,
    );
    add_to_visible(
        $above_pointer,
        visible,
        top_of_feed.get(),
        bottom_of_feed.get(),
        require_fully_visible,
        row_to_output,
    );
    add_to_visible(
        $below_pointer,
        visible,
        top_of_feed.get(),
        bottom_of_feed.get(),
        require_fully_visible,
        row_to_output,
    );

    return visible;
}

export function visible_groups(require_fully_visible: boolean): HTMLElement[] {
    assert(message_lists.current !== undefined);
    const $selected_row = message_lists.current.selected_row();
    if ($selected_row === undefined || $selected_row.length === 0) {
        return [];
    }

    const $selected_group = rows.get_message_recipient_row($selected_row);

    function get_row(row: HTMLElement): HTMLElement {
        return row;
    }

    // Being simplistic about this, the smallest group is about 75 px high.
    return _visible_divs<HTMLElement>(
        $selected_group,
        75,
        get_row,
        "recipient_row",
        require_fully_visible,
    );
}

export function visible_messages(require_fully_visible: boolean): Message[] {
    assert(message_lists.current !== undefined);
    const $selected_row = message_lists.current.selected_row();

    function row_to_id(row: HTMLElement): Message {
        assert(message_lists.current !== undefined);
        return message_lists.current.get(rows.id($(row)))!;
    }

    // Being simplistic about this, the smallest message is 25 px high.
    return _visible_divs<Message>(
        $selected_row,
        25,
        row_to_id,
        "message_row",
        require_fully_visible,
    );
}

export function scrollTop(): number;
export function scrollTop(target_scrollTop: number): JQuery;
export function scrollTop(target_scrollTop?: number): JQuery | number {
    const orig_scrollTop = $scroll_container.scrollTop();
    if (target_scrollTop === undefined) {
        return orig_scrollTop ?? 0;
    }
    let $ret = $scroll_container.scrollTop(target_scrollTop);
    const new_scrollTop = $scroll_container.scrollTop();
    const space_to_scroll = $("#bottom_whitespace").get_offset_to_window().top - height();

    // Check whether our scrollTop didn't move even though one could have scrolled down
    if (
        space_to_scroll > 0 &&
        target_scrollTop > 0 &&
        orig_scrollTop === 0 &&
        new_scrollTop === 0
    ) {
        // Chrome has a bug where sometimes calling
        // window.scrollTop(x) has no effect, resulting in the browser
        // staying at 0 -- and afterwards if you call
        // window.scrollTop(x) again, it will still do nothing.  To
        // fix this, we need to first scroll to some other place.
        blueslip.info(
            "ScrollTop did nothing when scrolling to " + target_scrollTop + ", fixing...",
        );
        // First scroll to 1 in order to clear the stuck state
        $scroll_container.scrollTop(1);
        // And then scroll where we intended to scroll to
        $ret = $scroll_container.scrollTop(target_scrollTop);
        if ($scroll_container.scrollTop() === 0) {
            blueslip.info(
                "ScrollTop fix did not work when scrolling to " +
                    target_scrollTop +
                    "!  space_to_scroll was " +
                    space_to_scroll,
            );
        }
    }
    return $ret;
}

export function stop_auto_scrolling(): void {
    if (in_stoppable_autoscroll) {
        $scroll_container.stop();
    }
}

export function system_initiated_animate_scroll(
    scroll_amount: number,
    update_selection_on_scroll = false,
): void {
    message_scroll_state.set_update_selection_on_next_scroll(update_selection_on_scroll);
    const viewport_offset = scrollTop();
    in_stoppable_autoscroll = true;
    $scroll_container.animate({
        scrollTop: viewport_offset + scroll_amount,
        always() {
            in_stoppable_autoscroll = false;
        },
    });
}

export function user_initiated_animate_scroll(scroll_amount: number): void {
    message_scroll_state.set_update_selection_on_next_scroll(false);
    in_stoppable_autoscroll = false; // defensive

    const viewport_offset = scrollTop();

    $scroll_container.animate({
        scrollTop: viewport_offset + scroll_amount,
    });
}

export function recenter_view(
    $message: JQuery,
    {from_scroll = false, force_center = false} = {},
): void {
    // BarnOwl-style recentering: if the pointer is too high, move it to
    // the 1/2 marks. If the pointer is too low, move it to the 1/7 mark.
    // See keep_pointer_in_view() for related logic to keep the pointer onscreen.

    const viewport_info = message_viewport_info();
    const top_threshold = viewport_info.visible_top;

    const bottom_threshold = viewport_info.visible_bottom;

    const message_top = $message.get_offset_to_window().top;
    const message_height = $message.outerHeight(true) ?? 0;
    const message_bottom = message_top + message_height;

    const is_above = message_top < top_threshold;
    const is_below = message_bottom > bottom_threshold;

    if (from_scroll) {
        // If the message you're trying to center on is already in view AND
        // you're already trying to move in the direction of that message,
        // don't try to recenter. This avoids disorienting jumps when the
        // pointer has gotten itself outside the threshold (e.g. by
        // autoscrolling).
        if (is_above && last_movement_direction >= 0) {
            return;
        }
        if (is_below && last_movement_direction <= 0) {
            return;
        }
    }

    if (is_above || force_center) {
        set_message_position(message_top, message_height, viewport_info, 1 / 2);
    } else if (is_below) {
        set_message_position(message_top, message_height, viewport_info, 1 / 7);
    }
}

export function maybe_scroll_to_show_message_top(): void {
    assert(message_lists.current !== undefined);
    // Sets the top of the message to the top of the viewport.
    // Only applies if the top of the message is out of view above the visible area.
    const $selected_message = message_lists.current.selected_row();
    const viewport_info = message_viewport_info();
    const message_top = $selected_message.get_offset_to_window().top;
    const message_height = $selected_message.outerHeight(true) ?? 0;
    if (message_top < viewport_info.visible_top) {
        set_message_position(message_top, message_height, viewport_info, 0);
    }
}

export function is_message_below_viewport($message_row: JQuery): boolean {
    const info = message_viewport_info();
    const offset = $message_row.get_offset_to_window();
    return offset.top >= info.visible_bottom;
}

export function keep_pointer_in_view(): void {
    assert(message_lists.current !== undefined);
    // See message_viewport.recenter_view() for related logic to keep the pointer onscreen.
    // This function mostly comes into place for mouse scrollers, and it
    // keeps the pointer in view.  For people who purely scroll with the
    // mouse, the pointer is kind of meaningless to them, but keyboard
    // users will occasionally do big mouse scrolls, so this gives them
    // a pointer reasonably close to the middle of the screen.
    let $candidate;
    let $next_row = message_lists.current.selected_row();

    if ($next_row.length === 0) {
        return;
    }

    const info = message_viewport_info();
    const top_threshold = info.visible_top + (1 / 10) * info.visible_height;
    const bottom_threshold = info.visible_top + (9 / 10) * info.visible_height;

    function message_is_far_enough_down(): boolean {
        if (at_rendered_top()) {
            return true;
        }

        const message_top = $next_row.get_offset_to_window().top;

        // If the message starts after the very top of the screen, we just
        // leave it alone.  This avoids bugs like #1608, where overzealousness
        // about repositioning the pointer can cause users to miss messages.
        if (message_top >= info.visible_top) {
            return true;
        }

        // If at least part of the message is below top_threshold (10% from
        // the top), then we also leave it alone.
        const bottom_offset = message_top + ($next_row.outerHeight(true) ?? 0);
        if (bottom_offset >= top_threshold) {
            return true;
        }

        // If we got this far, the message is not "in view."
        return false;
    }

    function message_is_far_enough_up(): boolean {
        return at_rendered_bottom() || $next_row.get_offset_to_window().top <= bottom_threshold;
    }

    function adjust(
        in_view: () => boolean,
        get_next_row: ($message_row: JQuery) => JQuery,
    ): boolean {
        // return true only if we make an actual adjustment, so
        // that we know to short circuit the other direction
        if (in_view()) {
            return false; // try other side
        }
        while (!in_view()) {
            $candidate = get_next_row($next_row);
            if ($candidate.length === 0) {
                break;
            }
            $next_row = $candidate;
        }
        return true;
    }

    if (!adjust(message_is_far_enough_down, rows.next_visible)) {
        adjust(message_is_far_enough_up, rows.prev_visible);
    }

    message_lists.current.select_id(rows.id($next_row), {from_scroll: true});
}

export function scroll_to_selected(): void {
    assert(message_lists.current !== undefined);
    const $selected_row = message_lists.current.selected_row();
    if ($selected_row && $selected_row.length > 0) {
        recenter_view($selected_row);
    }
}

export let scroll_to_selected_planned = false;

export function plan_scroll_to_selected(): void {
    scroll_to_selected_planned = true;
}

export function maybe_scroll_to_selected(): void {
    // If we have made a plan to scroll to the selected message but
    // deferred doing so, do so here.
    if (scroll_to_selected_planned) {
        scroll_to_selected();
        scroll_to_selected_planned = false;
    }
}

export function can_scroll(): boolean {
    const full_height = util.the($scroll_container).scrollHeight;
    return full_height > window.innerHeight;
}

export function initialize(): void {
    // This handler must be placed before all resize handlers in our application
    $(window).on("resize", () => {
        cached_width.reset();
        cached_height.reset();
        top_of_feed.reset();
        bottom_of_feed.reset();
        window_resize_handler?.();
    });

    $(document).on("compose_started compose_canceled compose_finished", () => {
        bottom_of_feed.reset();
    });

    // We stop autoscrolling when the user is clearly in the middle of
    // doing something.  Be careful, though, if you try to capture
    // mousemove, then you will have to contend with the autoscroll
    // itself generating mousemove events.
    $(document).on("message_selected.zulip wheel", () => {
        stop_auto_scrolling();
    });
}
```

--------------------------------------------------------------------------------

---[FILE: message_view_header.ts]---
Location: zulip-main/web/src/message_view_header.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_inline_decorated_channel_name from "../templates/inline_decorated_channel_name.hbs";
import render_message_view_header from "../templates/message_view_header.hbs";

import type {Filter} from "./filter.ts";
import * as hash_util from "./hash_util.ts";
import {$t} from "./i18n.ts";
import * as inbox_util from "./inbox_util.ts";
import * as narrow_state from "./narrow_state.ts";
import {page_params} from "./page_params.ts";
import * as peer_data from "./peer_data.ts";
import * as recent_view_util from "./recent_view_util.ts";
import * as rendered_markdown from "./rendered_markdown.ts";
import * as search from "./search.ts";
import {current_user} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import type {StreamSubscription} from "./sub_store.ts";

type MessageViewHeaderContext = {
    title?: string | undefined;
    title_html?: string | undefined;
    description?: string;
    link?: string;
    is_spectator?: boolean;
    sub_count?: string | number;
    formatted_sub_count?: string;
    rendered_narrow_description?: string;
    is_admin?: boolean;
    stream?: StreamSubscription;
    stream_settings_link?: string;
} & (
    | {
          zulip_icon: string;
      }
    | {
          icon: string | undefined;
      }
);

function get_message_view_header_context(filter: Filter | undefined): MessageViewHeaderContext {
    if (recent_view_util.is_visible()) {
        return {
            title: $t({defaultMessage: "Recent conversations"}),
            description: $t({defaultMessage: "Overview of ongoing conversations."}),
            zulip_icon: "recent",
            link: "/help/recent-conversations",
        };
    }

    if (inbox_util.is_visible() && !inbox_util.is_channel_view()) {
        return {
            title: $t({defaultMessage: "Inbox"}),
            description: $t({
                defaultMessage: "Overview of your conversations with unread messages.",
            }),
            zulip_icon: "inbox",
            link: "/help/inbox",
        };
    }

    // TODO: If we're not in the recent or inbox view, there should be
    // a message feed with a declared filter in the center pane. But
    // because of an initialization order bug, this function gets
    // called with a filter of `undefined` when loading the web app
    // with, say, inbox as the home view.
    //
    // TODO: Refactor this function to move the inbox/recent cases
    // into the caller, and this function can always get a Filter object.
    //
    // TODO: This ideally doesn't need a special case, we can just use
    // `filter.get_description` for it.
    if (filter === undefined || filter.is_in_home()) {
        let description;
        if (page_params.is_spectator) {
            description = $t({
                defaultMessage: "All your messages.",
            });
        } else {
            description = $t({
                defaultMessage: "All your messages except those in muted channels and topics.",
            });
        }
        return {
            title: $t({defaultMessage: "Combined feed"}),
            description,
            zulip_icon: "all-messages",
            link: "/help/combined-feed",
        };
    }

    const title = filter.get_title();
    const description = filter.get_description()?.description;
    const link = filter.get_description()?.link;
    assert(title !== undefined);
    let context = filter.add_icon_data({
        title,
        description,
        link,
        is_spectator: page_params.is_spectator,
    });

    if (filter.has_operator("channel")) {
        const current_stream = stream_data.get_sub_by_id_string(
            filter.terms_with_operator("channel")[0]!.operand,
        );
        if (!current_stream) {
            return {
                ...context,
                sub_count: "0",
                formatted_sub_count: "0",
                rendered_narrow_description: $t({
                    defaultMessage: "This channel does not exist or is private.",
                }),
            };
        }

        if (inbox_util.is_visible() && inbox_util.is_channel_view()) {
            const stream_name_with_privacy_symbol_html = render_inline_decorated_channel_name({
                stream: current_stream,
                show_colored_icon: true,
            });
            context = {
                ...context,
                title: undefined,
                title_html: stream_name_with_privacy_symbol_html,
                // We don't want to show an initial icon here.
                icon: undefined,
                zulip_icon: undefined,
            };
        }

        // We can now be certain that the narrow
        // involves a stream which exists and
        // the current user can access.
        const sub_count = peer_data.get_subscriber_count(current_stream.stream_id);
        return {
            ...context,
            is_admin: current_user.is_admin,
            rendered_narrow_description: current_stream.rendered_description,
            sub_count,
            stream: current_stream,
            stream_settings_link: hash_util.channels_settings_edit_url(current_stream, "general"),
        };
    }

    return context;
}

export function colorize_message_view_header(): void {
    const current_sub = narrow_state.stream_sub();
    if (!current_sub) {
        return;
    }
    // selecting i instead of .fa because web public streams have custom icon.
    $("#message_view_header a.stream i").css("color", current_sub.color);
}

function append_and_display_title_area(context: MessageViewHeaderContext): void {
    const $message_view_header_elem = $("#message_view_header");
    $message_view_header_elem.html(render_message_view_header(context));
    if (context.stream_settings_link) {
        colorize_message_view_header();
    }
    $message_view_header_elem.removeClass("notdisplayed");
    const $content = $message_view_header_elem.find("span.rendered_markdown");
    if ($content) {
        // Update syntax like stream names, emojis, mentions, timestamps.
        rendered_markdown.update_elements($content);
    }
}

function build_message_view_header(filter: Filter | undefined): void {
    // This makes sure we don't waste time appending
    // message_view_header on a template where it's never used
    if (filter && !filter.is_common_narrow()) {
        search.open_search_bar_and_close_narrow_description();
    } else {
        const context = get_message_view_header_context(filter);
        append_and_display_title_area(context);
        search.close_search_bar_and_open_narrow_description();
    }
}

export function initialize(): void {
    render_title_area();

    const hide_stream_settings_button_width_threshold = 620;
    $("body").on("mouseenter mouseleave", ".narrow_description", function (event) {
        const $view_description_elt = $(this);
        const window_width = $(window).width()!;
        let hover_timeout;

        if (event.type === "mouseenter") {
            if (!$view_description_elt.hasClass("view-description-extended")) {
                const current_width = $view_description_elt.outerWidth();
                // Set fixed width for word-wrap to work
                $view_description_elt.css("width", current_width + "px");
            }
            hover_timeout = setTimeout(() => {
                $view_description_elt.addClass("view-description-extended");
                $(".top-navbar-container").addClass(
                    "top-navbar-container-allow-description-extension",
                );

                if (window_width <= hide_stream_settings_button_width_threshold) {
                    $(".message-header-stream-settings-button").hide();
                    // Let it expand naturally on smaller screens
                    $view_description_elt.css("width", "");
                }
            }, 250);
            $view_description_elt.data("hover_timeout", hover_timeout);
        } else if (event.type === "mouseleave") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            hover_timeout = $view_description_elt.data("hover_timeout");
            if (typeof hover_timeout === "number") {
                // Clear any pending hover_timeout to prevent unexpected behavior
                clearTimeout(hover_timeout);
            }
            $view_description_elt.addClass("leaving-extended-view-description");

            // Wait for the reverse animation duration before cleaning up
            setTimeout(() => {
                $view_description_elt.removeClass("view-description-extended");
                $view_description_elt.removeClass("leaving-extended-view-description");
                if (window_width <= hide_stream_settings_button_width_threshold) {
                    $(".message-header-stream-settings-button").show();
                    $view_description_elt.css("width", "");
                } else {
                    // Reset to flexbox-determined width
                    $view_description_elt.css("width", "");
                }
            }, 100);
        }
    });
}

export function render_title_area(): void {
    const filter = narrow_state.filter();
    build_message_view_header(filter);
}

// This function checks if "modified_sub" which is the stream whose values
// have been updated is the same as the stream which is currently
// narrowed and rerenders if necessary
export function maybe_rerender_title_area_for_stream(modified_stream_id: number): void {
    const current_stream_id = narrow_state.stream_id();

    if (current_stream_id === modified_stream_id) {
        render_title_area();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: modals.ts]---
Location: zulip-main/web/src/modals.ts

```typescript
import $ from "jquery";
import Micromodal from "micromodal";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as mouse_drag from "./mouse_drag.ts";
import * as overlay_util from "./overlay_util.ts";
import * as overlays from "./overlays.ts";

type Hook = () => void;

export type ModalConfig = {
    autoremove?: boolean;
    on_show?: () => void;
    on_shown?: (() => void) | undefined;
    on_hide?: (() => void) | undefined;
    on_hidden?: (() => void) | undefined;
};

const pre_open_hooks: Hook[] = [];
const pre_close_hooks: Hook[] = [];

export function register_pre_open_hook(func: Hook): void {
    pre_open_hooks.push(func);
}

export function register_pre_close_hook(func: Hook): void {
    pre_close_hooks.push(func);
}

function call_hooks(func_list: Hook[]): void {
    for (const element of func_list) {
        element();
    }
}

export function any_active_or_animating(): boolean {
    const $active_modal = $(".micromodal");
    return $active_modal.hasClass("modal--open") || $active_modal.hasClass("modal--opening");
}

export function any_active(): boolean {
    return $(".micromodal").hasClass("modal--open");
}

export function active_modal(): string | undefined {
    if (!any_active()) {
        blueslip.error("Programming error — Called active_modal when there is no modal open");
        return undefined;
    }

    const $micromodal = $(".micromodal.modal--open");
    return `#${CSS.escape($micromodal.attr("id")!)}`;
}

export function is_active(modal_id: string): boolean {
    const $micromodal = $(".micromodal.modal--open");
    return $micromodal.attr("id") === modal_id;
}

// If conf.autoremove is true, the modal element will be removed from the DOM
// once the modal is hidden.
// conf also accepts the following optional properties:
// on_show: Callback to run when the modal is triggered to show.
// on_shown: Callback to run when the modal is shown.
// on_hide: Callback to run when the modal is triggered to hide.
// on_hidden: Callback to run when the modal is hidden.
export function open(
    modal_id: string,
    conf: ModalConfig & {recursive_call_count?: number} = {},
): void {
    if (modal_id === undefined) {
        blueslip.error("Undefined id was passed into open");
        return;
    }

    // Don't accept hash-based selector to enforce modals to have unique ids and
    // since micromodal doesn't accept hash based selectors.
    if (modal_id.startsWith("#")) {
        blueslip.error("hash-based selector passed in to open", {modal_id});
        return;
    }

    if (any_active()) {
        /*
          Our modal system doesn't directly support opening a modal
          when one is already open, because the `any_active` CSS
          class doesn't update until Micromodal has finished its
          animations, which can take 100ms or more.

          We can likely fix that, but in the meantime, we should
          handle this situation correctly, by closing the current
          modal, waiting for it to finish closing, and then attempting
          to open the current modal again.
        */
        if (!conf.recursive_call_count) {
            conf.recursive_call_count = 1;
        } else {
            conf.recursive_call_count += 1;
        }
        if (conf.recursive_call_count > 50) {
            blueslip.error("Modal incorrectly is still open", {modal_id});
            return;
        }

        close_active();
        setTimeout(() => {
            open(modal_id, conf);
        }, 10);
        return;
    }

    blueslip.debug("open modal: " + modal_id);

    // Micromodal gets elements using the getElementById DOM function
    // which doesn't require the hash. We add it manually here.
    const id_selector = `#${CSS.escape(modal_id)}`;
    const $micromodal = $(id_selector);

    $micromodal.find(".modal__container").on("animationend", (event) => {
        assert(event.originalEvent instanceof AnimationEvent);
        const animation_name = event.originalEvent.animationName;
        if (animation_name === "mmfadeIn") {
            // Micromodal adds the is-open class before the modal animation
            // is complete, which isn't really helpful since a modal is open after the
            // animation is complete. So, we manually add a class after the
            // animation is complete.
            $micromodal.addClass("modal--open");
            $micromodal.removeClass("modal--opening");

            if (conf.on_shown) {
                conf.on_shown();
            }
        } else if (animation_name === "mmfadeOut") {
            // Call the on_hidden callback after the modal finishes hiding.

            $micromodal.removeClass("modal--open");
            if (conf.autoremove) {
                $micromodal.remove();
            }
            if (conf.on_hidden) {
                conf.on_hidden();
            }
        }
    });

    $micromodal.find(".modal__overlay").on("click", (e) => {
        if (!$(e.target).is(".modal__overlay")) {
            return;
        }

        if ($(e.target).hasClass("ignore-overlay-click")) {
            return;
        }

        /* Micromodal's data-micromodal-close feature doesn't check for
           range selections; this means dragging a selection of text in an
           input inside the modal too far will weirdly close the modal.
           See https://github.com/ghosh/Micromodal/issues/505.
           Work around this with our own implementation. */
        if (mouse_drag.is_drag(e)) {
            return;
        }
        close(modal_id);
    });

    function on_show_callback(): void {
        if (conf.on_show) {
            conf.on_show();
        }
        // We avoid toggling scrolling when opening a modal over an active overlay.
        // This prevents a subtle UI shift, as reported in
        // https://chat.zulip.org/#narrow/channel/9-issues/topic/A.20little.20right.20shift.20can.20be.20observed.20when.20confirm.20dialog.20ope/near/2026160
        // There is no need to enable or disable the scrolling when modal is
        // opened because it is already handled while opening and closing the overlay.
        if (!overlays.any_active()) {
            overlay_util.disable_scrolling();
        }
        call_hooks(pre_open_hooks);
    }

    function on_close_callback(): void {
        if (conf.on_hide) {
            conf.on_hide();
        }
        // Since we are disabling scroll only when the modal is not
        // opened over an overlay, we will enable it in that way only.
        if (!overlays.any_active()) {
            overlay_util.enable_scrolling();
        }
        call_hooks(pre_close_hooks);
    }

    Micromodal.show(modal_id, {
        disableFocus: true,
        openClass: "modal--opening",
        onShow: on_show_callback,
        onClose: on_close_callback,
    });
}

// `conf` is an object with the following optional properties:
// * on_hidden: Callback to run when the modal finishes hiding.
export function close(modal_id: string, conf: Pick<ModalConfig, "on_hidden"> = {}): void {
    if (modal_id === undefined) {
        blueslip.error("Undefined id was passed into close");
        return;
    }

    if (!any_active()) {
        blueslip.warn("close_active() called without checking any_active()");
        return;
    }

    if (active_modal() !== `#${CSS.escape(modal_id)}`) {
        blueslip.error("Trying to close modal when other is open", {modal_id, active_modal});
        return;
    }

    blueslip.debug("close modal: " + modal_id);

    const id_selector = `#${CSS.escape(modal_id)}`;
    const $micromodal = $(id_selector);

    // On-hidden hooks should typically be registered in
    // overlays.open.  However, we offer this alternative
    // mechanism as a convenience for hooks only known when
    // closing the modal.
    $micromodal.find(".modal__container").on("animationend", (event) => {
        assert(event.originalEvent instanceof AnimationEvent);
        const animation_name = event.originalEvent.animationName;
        if (animation_name === "mmfadeOut" && conf.on_hidden) {
            conf.on_hidden();
        }
    });

    Micromodal.close(modal_id);
}

export function close_if_open(modal_id: string): void {
    if (modal_id === undefined) {
        blueslip.error("Undefined id was passed into close_if_open");
        return;
    }

    if (!any_active()) {
        return;
    }

    const $micromodal = $(".micromodal.modal--open");
    const active_modal_id = CSS.escape(CSS.escape($micromodal.attr("id") ?? ""));
    if (active_modal_id === CSS.escape(modal_id)) {
        Micromodal.close(CSS.escape($micromodal.attr("id") ?? ""));
    } else {
        blueslip.info(
            `${active_modal_id} is the currently active modal and ${modal_id} is already closed.`,
        );
    }
}

export function close_active(): void {
    if (!any_active()) {
        blueslip.warn("close_active() called without checking any_active()");
        return;
    }

    const $micromodal = $(".micromodal.modal--open");
    Micromodal.close(CSS.escape($micromodal.attr("id") ?? ""));
}

export function close_active_if_any(): void {
    if (any_active()) {
        close_active();
    }
}
```

--------------------------------------------------------------------------------

````

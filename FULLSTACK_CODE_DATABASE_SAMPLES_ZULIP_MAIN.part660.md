---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 660
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 660 of 1290)

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

---[FILE: rendered_markdown.ts]---
Location: zulip-main/web/src/rendered_markdown.ts

```typescript
import ClipboardJS from "clipboard";
import {isValid, parseISO} from "date-fns";
import $ from "jquery";
import assert from "minimalistic-assert";

import render_channel_message_link from "../templates/channel_message_link.hbs";
import code_buttons_container from "../templates/code_buttons_container.hbs";
import render_markdown_audio from "../templates/markdown_audio.hbs";
import render_markdown_timestamp from "../templates/markdown_timestamp.hbs";
import render_mention_content_wrapper from "../templates/mention_content_wrapper.hbs";
import render_topic_link from "../templates/topic_link.hbs";

import * as blueslip from "./blueslip.ts";
import {show_copied_confirmation} from "./copied_tooltip.ts";
import * as hash_util from "./hash_util.ts";
import {$t} from "./i18n.ts";
import * as message_store from "./message_store.ts";
import type {Message} from "./message_store.ts";
import * as people from "./people.ts";
import * as realm_playground from "./realm_playground.ts";
import * as rows from "./rows.ts";
import * as rtl from "./rtl.ts";
import * as sub_store from "./sub_store.ts";
import * as timerender from "./timerender.ts";
import * as user_groups from "./user_groups.ts";
import {user_settings} from "./user_settings.ts";
import * as util from "./util.ts";

/*
    rendered_markdown

    This module provides a single function 'update_elements' to
    update any renamed users/streams/groups etc. and other
    dynamic parts of our rendered messages.

    Use this module wherever some Markdown rendered content
    is being displayed.
*/

export function get_user_id_for_mention_button(elem: HTMLElement): "*" | number | undefined {
    const user_id_string = $(elem).attr("data-user-id");
    // Handle legacy Markdown that was rendered before we cut
    // over to using data-user-id.
    const email = $(elem).attr("data-user-email");

    if (user_id_string === "*" || email === "*") {
        return "*";
    }

    if (user_id_string) {
        return Number.parseInt(user_id_string, 10);
    }

    if (email) {
        // Will return undefined if there's no match
        const user = people.get_by_email(email);
        if (user) {
            return user.user_id;
        }
    }
    return undefined;
}

function get_user_group_id_for_mention_button(elem: HTMLElement): number {
    const user_group_id = $(elem).attr("data-user-group-id");
    assert(user_group_id !== undefined);
    return Number.parseInt(user_group_id, 10);
}

function get_message_for_message_content($content: JQuery): Message | undefined {
    // TODO: This selector is designed to exclude drafts/scheduled
    // messages. Arguably those settings should be unconditionally
    // marked with user-mention-me, but rows.id doesn't support
    // those elements, and we should address that quirk for
    // mentions holistically.
    const $message_row = $content.closest(".message_row");
    if ($message_row.length === 0 || $message_row.closest(".overlay-message-row").length > 0) {
        // There's no containing message when rendering a preview.
        return undefined;
    }
    const message_id = rows.id($message_row);
    return message_store.get(message_id);
}

// Function to safely wrap mentioned names in a DOM element.
// This enables mentions to display inline, while adjusting
// the outer element's font-size for better appearance on
// lines of message text.
function wrap_mention_content_in_dom_element(element: HTMLElement, is_bot = false): HTMLElement {
    const mention_text = $(element).text();
    $(element).html(render_mention_content_wrapper({mention_text, is_bot}));
    return element;
}

// Helper function to update a mentioned user's name.
export function set_name_in_mention_element(
    element: HTMLElement,
    name: string,
    user_id?: number,
): void {
    const user_is_bot = user_id !== undefined && people.is_valid_bot_user(user_id);
    if (user_id !== undefined && people.should_add_guest_user_indicator(user_id)) {
        let display_text;
        if (!$(element).hasClass("silent")) {
            display_text = $t({defaultMessage: "@{name} (guest)"}, {name});
        } else {
            display_text = $t({defaultMessage: "{name} (guest)"}, {name});
        }
        $(element).text(display_text);
        wrap_mention_content_in_dom_element(element);
        return;
    }

    if ($(element).hasClass("silent")) {
        $(element).text(name);
    } else {
        $(element).text("@" + name);
    }

    wrap_mention_content_in_dom_element(element, user_is_bot);
}

export const update_elements = ($content: JQuery): void => {
    // Set the rtl class if the text has an rtl direction
    if (rtl.get_direction($content.text()) === "rtl") {
        $content.addClass("rtl");
    }

    if (util.is_client_safari()) {
        // Without this video thumbnail doesn't load on Safari.
        $content.find<HTMLMediaElement>(".message_inline_video video").each(function () {
            // On Safari, one needs to manually load video elements.
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load
            this.load();
        });
    }

    // personal and stream wildcard mentions
    $content.find(".user-mention").each(function (): void {
        const user_id = get_user_id_for_mention_button(this);
        const message = get_message_for_message_content($content);
        const user_is_bot =
            user_id !== undefined && user_id !== "*" && people.is_valid_bot_user(user_id);
        // We give special highlights to the mention buttons
        // that refer to the current user.
        if (user_id === "*" && message && message.stream_wildcard_mentioned) {
            $(this).addClass("user-mention-me");
        }
        if (
            user_id !== undefined &&
            user_id !== "*" &&
            people.is_my_user_id(user_id) &&
            message &&
            message.mentioned_me_directly
        ) {
            $(this).addClass("user-mention-me");
        }

        if (user_id && user_id !== "*" && $(this).find(".highlight").length === 0) {
            // If it's a mention of a specific user, edit the mention
            // text to show the user's current name, assuming that
            // you're not searching for text inside the highlight.
            const person = people.maybe_get_user_by_id(user_id, true);
            if (person === undefined || person.is_inaccessible_user) {
                // Note that person might be undefined in some
                // unpleasant corner cases involving data import
                // or when guest users cannot access all users in
                // the organization.
                //
                // In these cases, the best we can do is leave the
                // existing name in the existing mention pill
                // HTML. Clicking on the pill will show the
                // "Unknown user" popover.
                if (person === undefined) {
                    people.add_inaccessible_user(user_id);
                }
                wrap_mention_content_in_dom_element(this);
                return;
            }

            set_name_in_mention_element(this, person.full_name, user_id);
        }

        wrap_mention_content_in_dom_element(this, user_is_bot);
    });

    $content.find(".topic-mention").each(function (): void {
        const message = get_message_for_message_content($content);

        if (message && message.topic_wildcard_mentioned) {
            $(this).addClass("user-mention-me");
        }

        wrap_mention_content_in_dom_element(this);
    });

    $content.find(".user-group-mention").each(function (): void {
        const user_group_id = get_user_group_id_for_mention_button(this);
        let user_group;
        try {
            user_group = user_groups.get_user_group_from_id(user_group_id);
        } catch {
            // This is a user group the current user doesn't have
            // data on.  This can happen when user groups are
            // deleted.
            blueslip.info("Rendered unexpected user group", {user_group_id});
            return;
        }

        const my_user_id = people.my_current_user_id();
        // Mark user group you're a member of.
        if (user_groups.is_user_in_group(user_group_id, my_user_id)) {
            $(this).addClass("user-mention-me");
        }

        if (user_group_id && $(this).find(".highlight").length === 0) {
            // Edit the mention to show the current name for the
            // user group, if its not in search.
            set_name_in_mention_element(this, user_groups.get_display_group_name(user_group.name));
        }
    });

    $content.find("a.stream").each(function (): void {
        const stream_id_string = $(this).attr("data-stream-id");
        assert(stream_id_string !== undefined);
        const stream_id = Number.parseInt(stream_id_string, 10);
        if (stream_id && $(this).find(".highlight").length === 0) {
            // Display the current name for stream if it is not
            // being displayed in search highlight.
            const stream_name = sub_store.maybe_get_stream_name(stream_id);
            if (stream_name !== undefined) {
                // If the stream has been deleted,
                // sub_store.maybe_get_stream_name might return
                // undefined.  Otherwise, display the current stream name.
                $(this).text("#" + stream_name);
            }
        }
    });

    $content.find("a.stream-topic, a.message-link").each(function (): void {
        const narrow_url = $(this).attr("href");
        assert(narrow_url !== undefined);
        const channel_topic = hash_util.decode_stream_topic_from_url(narrow_url);
        assert(channel_topic !== null);
        const channel_name = sub_store.maybe_get_stream_name(channel_topic.stream_id);
        if (channel_name !== undefined && $(this).find(".highlight").length === 0) {
            // Display the current channel name if it hasn't been deleted
            // and not being displayed in search highlight.
            // TODO: Ideally, we should NOT skip this if only topic is highlighted,
            // but we are doing so currently.
            const topic_name = channel_topic.topic_name;
            assert(topic_name !== undefined);
            const topic_display_name = util.get_final_topic_display_name(topic_name);
            const context = {
                channel_name,
                topic_display_name,
                is_empty_string_topic: topic_name === "",
                href: narrow_url,
            };
            if ($(this).hasClass("stream-topic")) {
                const topic_link_html = render_topic_link({
                    channel_id: channel_topic.stream_id,
                    ...context,
                });
                $(this).replaceWith($(topic_link_html));
            } else {
                const message_link_html = render_channel_message_link(context);
                $(this).replaceWith($(message_link_html));
            }
        }
    });

    $content.find("time").each(function (): void {
        // Populate each timestamp span with mentioned time
        // in user's local time zone.
        const time_str = $(this).attr("datetime");
        if (time_str === undefined) {
            return;
        }

        const timestamp = parseISO(time_str);
        if (isValid(timestamp)) {
            const rendered_timestamp = render_markdown_timestamp({
                text: timerender.format_markdown_time(timestamp),
            });
            $(this).html(rendered_timestamp);
        } else {
            // This shouldn't happen. If it does, we're very interested in debugging it.
            blueslip.error("Could not parse datetime supplied by backend", {time_str});
        }
    });

    $content.find("span.timestamp-error").each(function (): void {
        const match_array = /^Invalid time format: (.*)$/.exec($(this).text());
        assert(match_array !== null);
        const [, time_str] = match_array;
        const text = $t(
            {defaultMessage: "Invalid time format: {timestamp}"},
            {timestamp: time_str},
        );
        $(this).text(text);
    });

    $content.find("div.spoiler-header").each(function (): void {
        // If a spoiler block has no header content, it should have a default header.
        // We do this client side to allow for i18n by the client.
        if ($(this).html().trim().length === 0) {
            $(this).append($("<p>").text($t({defaultMessage: "Spoiler"})));
        }

        $(this).find("p").addClass("spoiler-header-text");

        // Add the expand/collapse button to spoiler blocks
        const toggle_button_html =
            '<span class="spoiler-button" aria-expanded="false"><span class="spoiler-arrow"></span></span>';
        $(this).append($(toggle_button_html));
    });

    // Display the view-code-in-playground and the copy-to-clipboard button inside the div.codehilite element,
    // and add a `zulip-code-block` class to it to detect it easily in `compose_paste.ts`.
    $content.find("div.codehilite").each(function (): void {
        const $codehilite = $(this);
        const $pre = $codehilite.find("pre");
        const fenced_code_lang = $codehilite.attr("data-code-language");
        let playground_info: realm_playground.RealmPlayground[] | undefined;
        if (fenced_code_lang !== undefined) {
            playground_info = realm_playground.get_playground_info_for_languages(fenced_code_lang);
        }
        const show_playground_button =
            fenced_code_lang !== undefined && playground_info !== undefined;

        const $buttonContainer = $(code_buttons_container({show_playground_button}));
        $pre.prepend($buttonContainer);

        if (show_playground_button) {
            // If a playground is configured for this language,
            // offer to view the code in that playground.  When
            // there are multiple playgrounds, we display a
            // popover listing the options.
            let title = $t({defaultMessage: "View in playground"});
            const $view_in_playground_button = $buttonContainer.find(".code_external_link");
            if (playground_info?.length === 1 && playground_info[0] !== undefined) {
                title = $t(
                    {defaultMessage: "View in {playground_name}"},
                    {playground_name: playground_info[0].name},
                );
            } else {
                $view_in_playground_button.attr("aria-haspopup", "true");
            }
            $view_in_playground_button.attr("data-tippy-content", title);
            $view_in_playground_button.attr("aria-label", title);
        }
        const $copy_button = $buttonContainer.find(".copy_codeblock");
        const clipboard = new ClipboardJS(util.the($copy_button), {
            text(copy_element) {
                const $code = $(copy_element).parent().siblings("code");
                return $code.text();
            },
        });

        clipboard.on("success", () => {
            show_copied_confirmation(util.the($copy_button), {
                show_check_icon: true,
            });
        });
        $codehilite.addClass("zulip-code-block");
    });

    $content.find("audio").each(function (): void {
        // We grab the audio source and title for
        // inserting into the template
        const audio_src = $(this).attr("src");
        const audio_title = $(this).attr("title");

        const rendered_audio = render_markdown_audio({
            audio_src,
            audio_title,
        });

        $(this).replaceWith($(rendered_audio));
    });

    // Display emoji (including realm emoji) as text if
    // user_settings.emojiset is 'text'.
    if (user_settings.emojiset === "text") {
        $content
            .find(".emoji")
            .text(function () {
                const text = $(this).attr("title") ?? "";
                return ":" + text + ":";
            })
            .contents()
            .unwrap();
    }
};
```

--------------------------------------------------------------------------------

---[FILE: resize.ts]---
Location: zulip-main/web/src/resize.ts

```typescript
import autosize from "autosize";
import $ from "jquery";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as compose_state from "./compose_state.ts";
import * as compose_ui from "./compose_ui.ts";
import {media_breakpoints_num} from "./css_variables.ts";
import * as message_viewport from "./message_viewport.ts";

function get_bottom_whitespace_height(): number {
    return message_viewport.height() * 0.4;
}

function get_new_heights(): {
    stream_filters_max_height: number;
    buddy_list_wrapper_max_height: number;
} {
    const viewport_height = message_viewport.height();
    // Add some gap for bottom element to be properly visible.
    const GAP = 15;

    let stream_filters_max_height =
        viewport_height -
        Number.parseInt($("#left-sidebar").css("paddingTop"), 10) -
        ($("#left-sidebar-navigation-area").not(".hidden-by-filters").outerHeight(true) ?? 0) -
        ($("#direct-messages-section-header").not(".hidden-by-filters").outerHeight(true) ?? 0) -
        GAP;

    // Don't let us crush the stream sidebar completely out of view
    stream_filters_max_height = Math.max(80, stream_filters_max_height);

    // RIGHT SIDEBAR

    const usable_height =
        viewport_height -
        Number.parseInt($("#right-sidebar").css("paddingTop"), 10) -
        ($("#userlist-header").outerHeight(true) ?? 0);

    const buddy_list_wrapper_max_height = Math.max(80, usable_height);

    return {
        stream_filters_max_height,
        buddy_list_wrapper_max_height,
    };
}

export function watch_manual_resize(element: string): (() => void)[] | undefined {
    const box = document.querySelector(element);

    if (!box) {
        blueslip.error("Bad selector in watch_manual_resize", {element});
        return undefined;
    }

    return watch_manual_resize_for_element(box);
}

export function watch_manual_resize_for_element(
    box: Element,
    resize_callback?: (height: number) => void,
): (() => void)[] {
    let height: number;
    let mousedown = false;

    const box_handler = function (): void {
        mousedown = true;
        height = box.clientHeight;
    };
    box.addEventListener("mousedown", box_handler);

    // If the user resizes the textarea manually, we use the
    // callback to stop autosize from adjusting the height.
    // It will be re-enabled when this component is next opened.
    const body_handler = function (): void {
        if (mousedown) {
            mousedown = false;
            if (height !== box.clientHeight) {
                height = box.clientHeight;
                autosize.destroy($(box)).height(height + "px");
                if (resize_callback) {
                    resize_callback(height);
                }
            }
        }
    };
    document.body.addEventListener("mouseup", body_handler);

    return [box_handler, body_handler];
}

function height_of($element: JQuery): number {
    return $element.get(0)!.getBoundingClientRect().height;
}

export function reset_compose_message_max_height(bottom_whitespace_height?: number): void {
    // If the compose-box is open, we set the `max-height` property of
    // `compose-textarea` and `preview-textarea`, so that the
    // compose-box's maximum extent does not overlap the last message
    // in the current stream.  We also leave a tiny bit of space after
    // the last message of the current stream.

    // Compute bottom_whitespace_height if not provided by caller.
    if (typeof bottom_whitespace_height !== "number") {
        bottom_whitespace_height = get_bottom_whitespace_height();
    }

    const compose_height = height_of($("#compose"));
    const compose_textarea_height = Math.max(
        height_of($("textarea#compose-textarea")),
        height_of($("#preview_message_area")),
    );
    const compose_non_textarea_height = compose_height - compose_textarea_height;

    // We ensure that the last message is not overlapped by compose box.
    $("textarea#compose-textarea").css(
        "max-height",
        bottom_whitespace_height - compose_non_textarea_height,
    );
    $("#preview_message_area").css(
        "max-height",
        bottom_whitespace_height - compose_non_textarea_height,
    );
    $("#scroll-to-bottom-button-container").css("bottom", compose_height);
    compose_ui.autosize_textarea($("#compose-textarea"));
}

export function resize_bottom_whitespace(): void {
    const bottom_whitespace_height = get_bottom_whitespace_height();
    $(":root").css("--max-unmaximized-compose-height", `${bottom_whitespace_height}px`);
    // The height of the compose box is tied to that of
    // bottom_whitespace, so update it if necessary.
    //
    // reset_compose_message_max_height cannot compute the right
    // height correctly while compose is hidden. This is OK, because
    // we also resize compose every time it is opened.
    if (compose_state.composing()) {
        reset_compose_message_max_height(bottom_whitespace_height);
    }
}

export function resize_stream_subscribers_list(): void {
    // Calculates the height of the subscribers list in stream settings.
    // This avoids the stream settings from overflowing the container and
    // having a scroll bar.

    if ($("#stream_settings").length === 0) {
        // Don't run if stream settings (like $subscriptions_info below) is not open.
        return;
    }

    const $subscriptions_info = $("#subscription_overlay .two-pane-settings-container .right");
    const classes_above_subscribers_list = [
        ".display-type", // = stream_settings_title
        ".subscriber_list_settings_container .stream_settings_header",
        ".subscription_settings .stream_setting_subsection_title",
        ".subscription_settings .subscriber_list_settings",
        ".subscription_settings .stream_setting_subsection_title",
    ];
    const $classes_above_subscribers_list = $subscriptions_info.find(
        classes_above_subscribers_list.join(", "),
    );
    let total_height_of_classes_above_subscribers_list = 0;
    $classes_above_subscribers_list.each(function () {
        const outer_height = $(this).outerHeight(true);
        assert(outer_height !== undefined);
        total_height_of_classes_above_subscribers_list += outer_height;
    });
    const subscribers_list_header_height = 30;
    const margin_between_tab_switcher_and_add_subscribers_title = 20;
    const subscriptions_info_height = $subscriptions_info.height();
    assert(subscriptions_info_height !== undefined);
    const subscribers_list_height =
        subscriptions_info_height -
        total_height_of_classes_above_subscribers_list -
        subscribers_list_header_height -
        margin_between_tab_switcher_and_add_subscribers_title;
    $(":root").css("--stream-subscriber-list-max-height", `${subscribers_list_height}px`);
}

export function resize_stream_filters_container(): void {
    const h = get_new_heights();
    resize_bottom_whitespace();
    $("#left_sidebar_scroll_container").css("max-height", h.stream_filters_max_height);
}

export function resize_sidebars(): void {
    const h = get_new_heights();
    $("#buddy_list_wrapper").css("max-height", h.buddy_list_wrapper_max_height);
    $("#left_sidebar_scroll_container").css("max-height", h.stream_filters_max_height);
}

export function update_recent_view(): void {
    const $recent_view_filter_container = $("#recent_view_filter_buttons");

    // Update max avatars to prevent participant avatars from overflowing.
    // These numbers are just based on speculation.
    const recent_view_filters_width = $recent_view_filter_container.outerWidth(true) ?? 0;
    if (!recent_view_filters_width) {
        return;
    }
    const num_avatars_narrow_window = 2;
    const num_avatars_max = 4;
    if (recent_view_filters_width < media_breakpoints_num.md) {
        $(":root").css("--recent-view-max-avatars", num_avatars_narrow_window);
    } else {
        $(":root").css("--recent-view-max-avatars", num_avatars_max);
    }
}

function resize_navbar_alerts(): void {
    const navbar_alerts_height = $("#navbar_alerts_wrapper").height();
    document.documentElement.style.setProperty(
        "--navbar-alerts-wrapper-height",
        navbar_alerts_height + "px",
    );

    // If the compose-box is in full sized state,
    // reset its height as well.
    if (compose_ui.is_full_size()) {
        compose_ui.set_compose_box_top(true);
    }
}

// We need to make the height of subheaders on both sides same. This is not
// easy to achieve using only CSS because we cannot set a fixed height — the
// right subheader contains the stream name, which can sometimes be long
// enough to wrap the text into multiple lines. Text wrapping may also be
// required for smaller window sizes.
//
// Here we first let subheaders on both sides attain their natural height as
// per the content and then make both of them equal by setting the
// height of subheader which is smaller to the height of subheader that
// has larger height.
// This feels a bit hacky and a cleaner solution would be nice to find.
export function resize_settings_overlay_subheader($container: JQuery): void {
    const $left_subheader = $container.find(".left .two-pane-settings-subheader");
    const $right_subheader = $container.find(".right .two-pane-settings-subheader");

    $left_subheader.css("height", "");
    $right_subheader.css("height", "");

    const left_subheader_height = height_of($left_subheader);
    const right_subheader_height = height_of($right_subheader);

    // Since height_of returns height including border width, we will
    // subtract 1px, which is the bottom border width.
    if (left_subheader_height < right_subheader_height) {
        $left_subheader.css("height", right_subheader_height - 1);
    } else {
        $right_subheader.css("height", left_subheader_height - 1);
    }
}

export function resize_settings_overlay($container: JQuery): void {
    if ($container.find(".two-pane-settings-overlay.show").length === 0) {
        return;
    }

    resize_settings_overlay_subheader($container);

    $container
        .find(".two-pane-settings-left-simplebar-container")
        .css(
            "height",
            height_of($container.find(".two-pane-settings-container")) -
                height_of($container.find(".two-pane-settings-header")) -
                height_of($container.find(".two-pane-settings-subheader")) -
                height_of($container.find(".two-pane-settings-search")),
        );

    $container
        .find(".two-pane-settings-right-simplebar-container")
        .css(
            "height",
            height_of($container.find(".two-pane-settings-container")) -
                height_of($container.find(".two-pane-settings-header")) -
                height_of($container.find(".two-pane-settings-subheader")),
        );
}

export function resize_settings_creation_overlay($container: JQuery): void {
    if ($container.find(".two-pane-settings-creation-simplebar-container").length === 0) {
        return;
    }

    $container
        .find(".two-pane-settings-creation-simplebar-container")
        .css(
            "height",
            height_of($container.find(".two-pane-settings-container")) -
                height_of($container.find(".two-pane-settings-header")) -
                height_of($container.find(".two-pane-settings-subheader")) -
                height_of($container.find(".settings-sticky-footer")),
        );
}

export function resize_page_components(): void {
    resize_navbar_alerts();
    resize_sidebars();
    resize_bottom_whitespace();
    resize_stream_subscribers_list();
    resize_settings_overlay($("#groups_overlay_container"));
    resize_settings_overlay($("#channels_overlay_container"));
    resize_settings_creation_overlay($("#groups_overlay_container"));
    resize_settings_creation_overlay($("#channels_overlay_container"));
}
```

--------------------------------------------------------------------------------

---[FILE: resize_handler.ts]---
Location: zulip-main/web/src/resize_handler.ts

```typescript
import $ from "jquery";

import * as compose_ui from "./compose_ui.ts";
import * as condense from "./condense.ts";
import * as message_lists from "./message_lists.ts";
import * as message_viewport from "./message_viewport.ts";
import * as resize from "./resize.ts";
import * as scroll_bar from "./scroll_bar.ts";
import * as sidebar_ui from "./sidebar_ui.ts";
import * as util from "./util.ts";

export let _old_width = $(window).width();

export function handler(): void {
    const new_width = $(window).width();
    let width_changed = false;

    const mobile = util.is_mobile();
    if (!mobile || new_width !== _old_width) {
        sidebar_ui.hide_all();
    }

    if (new_width !== _old_width) {
        _old_width = new_width;
        width_changed = true;
    }
    resize.resize_page_components();
    compose_ui.autosize_textarea($("textarea#compose-textarea"));
    compose_ui.maybe_show_scrolling_formatting_buttons("#message-formatting-controls-container");
    compose_ui.maybe_show_scrolling_formatting_buttons(".message-edit-feature-group");
    resize.update_recent_view();
    scroll_bar.handle_overlay_scrollbars();

    // Re-compute and display/remove 'Show more' buttons to messages
    condense.condense_and_collapse(message_lists.all_current_message_rows());

    // Height can change on mobile OS like i0S if scrolling causes URL bar to change height.
    // We don't want to cause scroll jump in that case and just let our logic for keeping the
    // selected message in the view handle it. Width can change due change in device orientation
    // in which case we want to scroll to the selected message.
    const only_height_changed_on_mobile = mobile && !width_changed;
    // This function might run onReady (if we're in a narrow window),
    // but before we've loaded in the messages; in that case, don't
    // try to scroll to one.
    if (
        !only_height_changed_on_mobile &&
        message_lists.current !== undefined &&
        message_lists.current.selected_id() !== -1
    ) {
        message_viewport.scroll_to_selected();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: resolved_topic.ts]---
Location: zulip-main/web/src/resolved_topic.ts

```typescript
/** The canonical form of the resolved-topic prefix. */
export const RESOLVED_TOPIC_PREFIX = "✔ ";

/**
 * Pattern for an arbitrary resolved-topic prefix.
 *
 * These always begin with the canonical prefix, but can go on longer.
 */
// The class has the same characters as RESOLVED_TOPIC_PREFIX.
// It's designed to remove a weird "✔ ✔✔ " prefix, if present.
// Compare maybe_send_resolve_topic_notifications in zerver/actions/message_edit.py.
const RESOLVED_TOPIC_PREFIX_RE = /^✔ [ ✔]*/;

export function is_resolved(topic_name: string): boolean {
    return topic_name.startsWith(RESOLVED_TOPIC_PREFIX);
}

export function resolve_name(topic_name: string): string {
    return RESOLVED_TOPIC_PREFIX + topic_name;
}

/**
 * The un-resolved form of this topic name.
 *
 * If the topic is already not a resolved topic, this is the identity.
 */
export function unresolve_name(topic_name: string): string {
    return topic_name.replace(RESOLVED_TOPIC_PREFIX_RE, "");
}

/**
 * Split the topic name for display, into a "resolved" prefix and remainder.
 *
 * The prefix is always the canonical resolved-topic prefix, or empty.
 *
 * This function is injective: different topics never produce the same
 * result, even when `unresolve_name` would give the same result.  That's a
 * property we want when listing topics in the UI, so that we don't end up
 * showing what look like several identical topics.
 */
export function display_parts(topic_name: string): [string, string] {
    return is_resolved(topic_name)
        ? [RESOLVED_TOPIC_PREFIX, topic_name.slice(RESOLVED_TOPIC_PREFIX.length)]
        : ["", topic_name];
}
```

--------------------------------------------------------------------------------

---[FILE: rows.ts]---
Location: zulip-main/web/src/rows.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as message_lists from "./message_lists.ts";
import * as message_store from "./message_store.ts";
import type {Message} from "./message_store.ts";

// We don't need an andSelf() here because we already know
// that our next element is *not* a message_row, so this
// isn't going to end up empty unless we're at the bottom or top.
export function next_visible($message_row: JQuery): JQuery {
    if ($message_row === undefined || $message_row.length === 0) {
        return $();
    }
    const $row = $message_row.next(".selectable_row");
    if ($row.length > 0) {
        return $row;
    }
    const $recipient_row = get_message_recipient_row($message_row);
    const $next_recipient_rows = $recipient_row.nextAll(".recipient_row");
    if ($next_recipient_rows.length === 0) {
        return $();
    }
    return $(".selectable_row", $next_recipient_rows[0]).first();
}

export function prev_visible($message_row: JQuery): JQuery {
    if ($message_row === undefined || $message_row.length === 0) {
        return $();
    }
    const $row = $message_row.prev(".selectable_row");
    if ($row.length > 0) {
        return $row;
    }
    const $recipient_row = get_message_recipient_row($message_row);
    const $prev_recipient_rows = $recipient_row.prevAll(".recipient_row");
    if ($prev_recipient_rows.length === 0) {
        return $();
    }
    return $(".selectable_row", $prev_recipient_rows[0]).last();
}

export function first_visible(): JQuery {
    return $(".focused-message-list .selectable_row").first();
}

export function last_visible(): JQuery {
    return $(".focused-message-list .selectable_row").last();
}

export function visible_range(start_id: number, end_id: number): JQuery[] {
    /*
        Get all visible rows between start_id
        and end_in, being inclusive on both ends.
    */

    const rows = [];

    assert(message_lists.current);
    let $row = message_lists.current.get_row(start_id);
    let msg_id = id($row);

    while (msg_id <= end_id) {
        rows.push($row);

        if (msg_id >= end_id) {
            break;
        }
        $row = next_visible($row);
        msg_id = id($row);
    }

    return rows;
}

export function is_overlay_row($row: JQuery): boolean {
    return $row.closest(".overlay-message-row").length > 0;
}

export function id($message_row: JQuery): number {
    if (is_overlay_row($message_row)) {
        throw new Error("Drafts and scheduled messages have no message id.");
    }

    if ($message_row.length !== 1) {
        throw new Error("Caller should pass in a single row.");
    }

    const message_id = $message_row.attr("data-message-id");

    if (message_id === undefined) {
        throw new Error("Calling code passed rows.id a row with no `data-message-id` attr.");
    }

    return Number.parseFloat(message_id);
}

export function local_echo_id($message_row: JQuery): string {
    const message_id = $message_row.attr("data-message-id");

    if (message_id === undefined) {
        throw new Error("Calling code passed rows.local_id a row with no `data-message-id` attr.");
    }

    if (!message_id.includes(".0")) {
        blueslip.error("Trying to get local_id from row that has reified message id", {message_id});
    }

    return message_id;
}

export function get_message_id(elem: HTMLElement): number {
    // Gets the message_id for elem, where elem is a DOM
    // element inside a message.  This is typically used
    // in click handlers for things like the reaction button.
    const $row = $(elem).closest(".message_row");
    const message_id = id($row);
    return message_id;
}

export function get_closest_group(element: HTMLElement): JQuery {
    // This gets the closest message row to an element, whether it's
    // a recipient bar or message.  With our current markup,
    // this is the most reliable way to do it.
    return $(element).closest("div.recipient_row");
}

export function get_closest_row($element: JQuery): JQuery {
    return $element.closest("div.message_row");
}

export function first_message_in_group($message_group: JQuery): JQuery {
    return $("div.message_row", $message_group).first();
}

export function last_message_in_group($message_group: JQuery): JQuery {
    return $("div.message_row", $message_group).last();
}

export function get_message_recipient_row($message_row: JQuery): JQuery {
    return $message_row.parent(".recipient_row").expectOne();
}

export function get_message_recipient_header($message_row: JQuery): JQuery {
    return $message_row.parent(".recipient_row").find(".message_header").expectOne();
}

export function recipient_from_group($message_group: JQuery): Message | undefined {
    const message_id = id($message_group.children(".message_row").first().expectOne());
    return message_store.get(message_id);
}

export function is_header_of_row_sticky($recipient_row: JQuery): boolean {
    return $recipient_row.find(".message_header").hasClass("sticky_header");
}

export function id_for_recipient_row($recipient_row: JQuery): number {
    if (is_header_of_row_sticky($recipient_row)) {
        const msg_id = message_lists.current?.view.sticky_recipient_message_id;
        if (msg_id !== undefined) {
            return msg_id;
        }
    }

    const $msg_row = first_message_in_group($recipient_row);
    return id($msg_row);
}
```

--------------------------------------------------------------------------------

````

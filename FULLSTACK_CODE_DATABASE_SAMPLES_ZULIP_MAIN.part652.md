---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 652
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 652 of 1290)

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

---[FILE: pm_list.ts]---
Location: zulip-main/web/src/pm_list.ts
Signals: Zod

```typescript
import $ from "jquery";
import _ from "lodash";
import * as z from "zod/mini";

import type {Filter} from "./filter.ts";
import {$t} from "./i18n.ts";
import {localstorage} from "./localstorage.ts";
import * as mouse_drag from "./mouse_drag.ts";
import * as pm_list_data from "./pm_list_data.ts";
import type {DisplayObject} from "./pm_list_data.ts";
import * as pm_list_dom from "./pm_list_dom.ts";
import type {PMNode} from "./pm_list_dom.ts";
import * as resize from "./resize.ts";
import * as scroll_util from "./scroll_util.ts";
import * as ui_util from "./ui_util.ts";
import type {FullUnreadCountsData} from "./unread.ts";
import * as util from "./util.ts";
import * as vdom from "./vdom.ts";

export const LEFT_SIDEBAR_DIRECT_MESSAGES_TITLE = $t({defaultMessage: "DIRECT MESSAGES"});

let prior_dom: vdom.Tag<PMNode> | undefined;

// This module manages the direct messages section in the upper
// left corner of the app.  This was split out from stream_list.ts.

const ls_key = "left_sidebar_direct_messages_collapsed_state";
const ls_schema = z._default(z.boolean(), false);
const ls = localstorage();
let private_messages_collapsed = false;
let last_direct_message_count: number | undefined;

// The direct messages section can be zoomed in to view more messages.
// This keeps track of if we're zoomed in or not.
let zoomed = false;

// Scroll position before user started searching.
let pre_search_scroll_position = 0;
let previous_search_term = "";

export function is_zoomed_in(): boolean {
    return zoomed;
}

function get_private_messages_section_header(): JQuery {
    return $("#direct-messages-section-header");
}

export function set_count(count: number): void {
    ui_util.update_unread_count_in_dom(get_private_messages_section_header(), count);
}

export function close(): void {
    private_messages_collapsed = true;
    ls.set(ls_key, private_messages_collapsed);
    update_private_messages();
}

export function _build_direct_messages_list(opts: {
    all_conversations_shown: boolean;
    conversations_to_be_shown: DisplayObject[];
    search_term: string;
}): vdom.Tag<PMNode> {
    const pm_list_nodes = opts.conversations_to_be_shown.map((conversation) =>
        pm_list_dom.keyed_pm_li(conversation),
    );
    const pm_list_info = pm_list_data.get_list_info(zoomed, opts.search_term);
    const more_conversations_unread_count = pm_list_info.more_conversations_unread_count;

    if (!opts.all_conversations_shown) {
        pm_list_nodes.push(
            pm_list_dom.more_private_conversations_li(more_conversations_unread_count),
        );
    }
    const dom_ast = pm_list_dom.pm_ul(pm_list_nodes);

    return dom_ast;
}

function set_dom_to(new_dom: vdom.Tag<PMNode>): void {
    const $container = scroll_util.get_content_element($("#direct-messages-list"));

    function replace_content(html: string): void {
        $container.html(html);
    }

    function find(): JQuery {
        return $container.find("ul");
    }

    vdom.update(replace_content, find, new_dom, prior_dom);
    prior_dom = new_dom;
}

export function update_private_messages(): void {
    const is_left_sidebar_search_active = ui_util.get_left_sidebar_search_term() !== "";
    const is_dm_section_expanded = is_left_sidebar_search_active || !private_messages_collapsed;
    $("#toggle-direct-messages-section-icon").toggleClass(
        "rotate-icon-down",
        is_dm_section_expanded,
    );
    $("#toggle-direct-messages-section-icon").toggleClass(
        "rotate-icon-right",
        !is_dm_section_expanded,
    );

    let search_term = "";
    if (zoomed) {
        const $filter = $<HTMLInputElement>(".direct-messages-list-filter").expectOne();
        search_term = $filter.val()!;
    } else if (is_left_sidebar_search_active) {
        search_term = ui_util.get_left_sidebar_search_term();
        if (util.prefix_match({value: LEFT_SIDEBAR_DIRECT_MESSAGES_TITLE, search_term})) {
            // Show all DMs if the search term matches the header text.
            search_term = "";
        }
    }

    const conversations = pm_list_data.get_conversations(search_term);
    const pm_list_info = pm_list_data.get_list_info(zoomed, search_term);
    const conversations_to_be_shown = pm_list_info.conversations_to_be_shown;

    const all_conversations_shown = conversations_to_be_shown.length === conversations.length;
    const is_header_visible =
        // Always show header when zoomed in.
        zoomed ||
        // Show header if there are conversations to be shown.
        conversations_to_be_shown.length > 0 ||
        // Show header if there are hidden conversations somehow.
        !all_conversations_shown ||
        // If there is no search term, always show the header.
        !search_term;
    $("#direct-messages-section-header").toggleClass("hidden-by-filters", !is_header_visible);

    if (!is_dm_section_expanded) {
        // In the collapsed state, we will still display the current
        // conversation, to preserve the UI invariant that there's
        // always something highlighted in the left sidebar.
        const all_conversations = pm_list_data.get_conversations();
        const active_conversation = all_conversations.find(
            (conversation) => conversation.is_active,
        );

        if (active_conversation) {
            const node = [pm_list_dom.keyed_pm_li(active_conversation)];
            const new_dom = pm_list_dom.pm_ul(node);
            set_dom_to(new_dom);
        } else {
            // Otherwise, empty the section.
            $(".dm-list").empty();
            prior_dom = undefined;
        }
    } else {
        const new_dom = _build_direct_messages_list({
            all_conversations_shown,
            conversations_to_be_shown,
            search_term,
        });
        set_dom_to(new_dom);
    }
    // Make sure to update the left sidebar heights after updating
    // direct messages.
    setTimeout(resize.resize_stream_filters_container, 0);
}

export function expand(): void {
    private_messages_collapsed = false;
    ls.set(ls_key, private_messages_collapsed);
    update_private_messages();
}

export function update_dom_with_unread_counts(
    counts: FullUnreadCountsData,
    skip_animations = false,
): void {
    // In theory, we could support passing the counts object through
    // to pm_list_data, rather than fetching it directly there. But
    // it's not an important optimization, because it's unlikely a
    // user would have 10,000s of unread direct messages where it
    // could matter.
    update_private_messages();

    // This is just the global unread count.
    const new_direct_message_count = counts.direct_message_count;
    set_count(new_direct_message_count);

    if (last_direct_message_count === undefined) {
        // We don't want to animate the DM header
        // when Zulip first loads, but we must update
        // the last DM count to correctly animate
        // the arrival of new unread DMs.
        last_direct_message_count = new_direct_message_count;
        return;
    }

    if (new_direct_message_count > last_direct_message_count && !skip_animations) {
        const $dm_header = $("#direct-messages-section-header");
        const $top_dm_item = $(".dm-list .dm-list-item:first-child");
        const top_item_active = $top_dm_item.hasClass("active-sub-filter");
        const top_item_no_unreads = $top_dm_item.hasClass("zero-dm-unreads");
        const $scroll_wrapper = $("#left_sidebar_scroll_container .simplebar-content-wrapper");
        let dms_scrolled_up = false;

        if ($scroll_wrapper.length > 0) {
            const scroll_top = $scroll_wrapper.scrollTop() ?? 0;
            dms_scrolled_up = scroll_top > 0;
        }
        // If the DMs area is scrolled up at all, we highlight the
        // DM header's count. It is possible for the DMs section to
        // be collapsed *and* the active conversation be scrolled
        // out of view, too, so we err on the side of highlighting
        // the header row.
        // If the DMs area is collapsed without the top item being
        // active, as is the case when narrowed to a DM, or if the
        // active DM item has the .zero-dm-unreads class, we highlight
        // the DM header's count.
        // That makes the assumption that a new DM has arrived in a
        // conversation other than the active one. Note that that will
        // fail animate anything--the header or the row--when an unread
        // arrives for a conversion other than the active one. But in
        // typical active DMing, unreads will be cleared immediately,
        // so that should be a fairly rare edge case.
        if (
            dms_scrolled_up ||
            (is_private_messages_collapsed() && !top_item_active) ||
            top_item_no_unreads
        ) {
            ui_util.do_new_unread_animation($dm_header);
        }
        // Unless the top item has the active-sub-filter class, which
        // we won't highlight to avoid annoying users in an active,
        // ongoing conversation, we highlight the top DM row, where
        // the newly arrived unread message will be, as the DM list
        // will be resorted by the time this logic runs.
        else if (!top_item_active) {
            ui_util.do_new_unread_animation($top_dm_item);
        }
    }

    last_direct_message_count = new_direct_message_count;
}

export function highlight_all_private_messages_view(): void {
    $(".direct-messages-container").addClass("active-direct-messages-section");
}

function unhighlight_all_private_messages_view(): void {
    $(".direct-messages-container").removeClass("active-direct-messages-section");
}

function scroll_pm_into_view($target_li: JQuery): void {
    const $container = $("#left_sidebar_scroll_container");
    const pm_header_height = $("#direct-messages-section-header").outerHeight();
    if ($target_li.length > 0) {
        scroll_util.scroll_element_into_container($target_li, $container, pm_header_height);
    }
}

function scroll_all_private_into_view(): void {
    const $container = $("#left_sidebar_scroll_container");
    const $scroll_element = scroll_util.get_scroll_element($container);
    $scroll_element.scrollTop(0);
}

export function handle_narrow_activated(filter: Filter): void {
    const active_filter = filter;
    const is_all_private_message_view = _.isEqual(active_filter.sorted_term_types(), ["is-dm"]);
    const narrow_to_private_messages_section = active_filter.terms_with_operator("dm").length > 0;
    const is_private_messages_in_view = active_filter.has_operator("dm");

    if (is_all_private_message_view) {
        // In theory, this should get expanded when we scroll to the
        // top, but empirically that doesn't occur, so we just ensure the
        // section is expanded before scrolling.
        expand();
        highlight_all_private_messages_view();
        scroll_all_private_into_view();
    } else {
        unhighlight_all_private_messages_view();
    }
    if (narrow_to_private_messages_section) {
        const current_user_ids_string = pm_list_data.get_active_user_ids_string();
        if (current_user_ids_string !== undefined) {
            const $active_filter_li = $(
                `li[data-user-ids-string='${CSS.escape(current_user_ids_string)}']`,
            );
            scroll_pm_into_view($active_filter_li);
        }
        update_private_messages();
    } else if (!is_private_messages_in_view) {
        update_private_messages();
    }
}

export function handle_message_view_deactivated(): void {
    // Since one can renarrow via the keyboard shortcut or similar, we
    // avoid disturbing the zoomed state here.
    unhighlight_all_private_messages_view();
    update_private_messages();
}

export function is_private_messages_collapsed(): boolean {
    return private_messages_collapsed;
}

export function toggle_private_messages_section(): void {
    // change the state of direct message section depending on
    // the previous state.
    if (private_messages_collapsed) {
        expand();
    } else {
        close();
    }
}

function zoom_in(): void {
    zoomed = true;
    previous_search_term = "";
    pre_search_scroll_position = 0;
    ui_util.disable_left_sidebar_search();
    update_private_messages();
    $(".direct-messages-container").removeClass("zoom-out").addClass("zoom-in");
    $("#hide-more-direct-messages").addClass("dm-zoomed-in");
    $("#streams_list").hide();
    $(".left-sidebar .right-sidebar-items").hide();

    const $filter = $(".direct-messages-list-filter").expectOne();
    $filter.trigger("focus");
}

function zoom_out(): void {
    zoomed = false;
    ui_util.enable_left_sidebar_search();
    clear_search();
    $(".direct-messages-container").removeClass("zoom-in").addClass("zoom-out");
    $("#hide-more-direct-messages").removeClass("dm-zoomed-in");
    $("#streams_list").show();
    $(".left-sidebar .right-sidebar-items").show();
}

export function clear_search(): void {
    const $filter = $(".direct-messages-list-filter").expectOne();
    $filter.val("");
    update_private_messages();
    $filter.trigger("blur");
}

export function initialize(): void {
    // Restore collapsed status.
    private_messages_collapsed = ls_schema.parse(ls.get(ls_key));
    if (private_messages_collapsed) {
        close();
    } else {
        expand();
    }

    $(".direct-messages-container").on("click", "#show-more-direct-messages", (e) => {
        e.stopPropagation();
        e.preventDefault();

        zoom_in();
    });

    $(".dm-list").on("click", ".dm-box", (e) => {
        // To avoid the click behavior if a dm box is selected.
        if (mouse_drag.is_drag(e)) {
            e.preventDefault();
        }
    });

    $("#left-sidebar").on("click", "#hide-more-direct-messages", (e) => {
        e.stopPropagation();
        e.preventDefault();

        zoom_out();
    });

    const throttled_update_private_message = _.throttle(() => {
        const $filter = $<HTMLInputElement>(".direct-messages-list-filter").expectOne();
        const search_term = $filter.val()!;
        const is_previous_search_term_empty = previous_search_term === "";
        previous_search_term = search_term;

        const left_sidebar_scroll_container = scroll_util.get_left_sidebar_scroll_container();
        if (search_term === "") {
            requestAnimationFrame(() => {
                update_private_messages();
                // Restore previous scroll position.
                left_sidebar_scroll_container.scrollTop(pre_search_scroll_position);
            });
        } else {
            if (is_previous_search_term_empty) {
                // Store original scroll position to be restored later.
                pre_search_scroll_position = left_sidebar_scroll_container.scrollTop()!;
            }
            requestAnimationFrame(() => {
                update_private_messages();
                // Always scroll to top when there is a search term present.
                left_sidebar_scroll_container.scrollTop(0);
            });
        }
    }, 50);

    $(".direct-messages-container").on("input", ".direct-messages-list-filter", (e) => {
        e.preventDefault();

        throttled_update_private_message();
    });

    $(".direct-messages-container").on("mouseenter", () => {
        $("#direct-messages-section-header").addClass("hover-over-dm-section");
    });

    $(".direct-messages-container").on("mouseleave", () => {
        $("#direct-messages-section-header").removeClass("hover-over-dm-section");
    });
}
```

--------------------------------------------------------------------------------

---[FILE: pm_list_data.ts]---
Location: zulip-main/web/src/pm_list_data.ts

```typescript
import * as buddy_data from "./buddy_data.ts";
import * as hash_util from "./hash_util.ts";
import * as narrow_state from "./narrow_state.ts";
import * as people from "./people.ts";
import * as pm_conversations from "./pm_conversations.ts";
import * as unread from "./unread.ts";
import * as user_status from "./user_status.ts";
import type {UserStatusEmojiInfo} from "./user_status.ts";

// Maximum number of conversation threads to show in default view.
const max_conversations_to_show = 8;

// Maximum number of conversation threads to show in default view with unreads.
const max_conversations_to_show_with_unreads = 15;

export function get_active_user_ids_string(): string | undefined {
    const filter = narrow_state.filter();

    if (!filter) {
        return undefined;
    }

    const emails = filter.terms_with_operator("dm")[0]?.operand;

    if (!emails) {
        return undefined;
    }

    const users_ids_array = people.emails_strings_to_user_ids_array(emails);
    if (!users_ids_array || users_ids_array.length === 0) {
        return undefined;
    }
    return people.sorted_other_user_ids(users_ids_array).join(",");
}

export type DisplayObject = {
    recipients: string;
    user_ids_string: string;
    is_current_user: boolean;
    unread: number;
    is_zero: boolean;
    is_active: boolean;
    url: string;
    status_emoji_info: UserStatusEmojiInfo | undefined;
    user_circle_class: string | undefined;
    is_group: boolean;
    is_bot: boolean;
    has_unread_mention: boolean;
    includes_deactivated_user: boolean;
};

export function get_conversations(search_string = ""): DisplayObject[] {
    const conversations = pm_conversations.recent.get();
    const display_objects: DisplayObject[] = [];

    // The user_ids_string for the current view, if any.
    const active_user_ids_string = get_active_user_ids_string();

    if (
        active_user_ids_string !== undefined &&
        !conversations
            .map((conversation) => conversation.user_ids_string)
            .includes(active_user_ids_string)
    ) {
        conversations.unshift({user_ids_string: active_user_ids_string, max_message_id: -1});
    }

    for (const conversation of conversations) {
        const user_ids_string = conversation.user_ids_string;

        const user_ids = people.user_ids_string_to_ids_array(user_ids_string);
        const users = people.get_users_from_ids(user_ids);
        if (!people.dm_matches_search_string(users, search_string)) {
            // Skip adding the conversation to the display_objects array if it does
            // not match the search_term.
            continue;
        }

        const recipients_string = people.format_recipients(user_ids_string, "narrow");

        const num_unread = unread.num_unread_for_user_ids_string(user_ids_string);
        const has_unread_mention =
            unread.num_unread_mentions_for_user_ids_strings(user_ids_string) > 0;
        const is_group = user_ids_string.includes(",");
        const is_active = user_ids_string === active_user_ids_string;
        const includes_deactivated_user = user_ids.some(
            (id) => !people.is_active_user_for_popover(id),
        );

        let user_circle_class: string | undefined;
        let status_emoji_info: UserStatusEmojiInfo | undefined;
        let is_bot = false;
        let is_current_user = false;

        if (!is_group) {
            const user_id = Number.parseInt(user_ids_string, 10);
            user_circle_class = buddy_data.get_user_circle_class(
                user_id,
                includes_deactivated_user,
            );
            const recipient_user_obj = people.get_by_user_id(user_id);

            if (recipient_user_obj.is_bot) {
                is_bot = true;
            } else {
                is_current_user = people.is_my_user_id(user_id);
                status_emoji_info = user_status.get_status_emoji(user_id);
            }
        }

        const display_object: DisplayObject = {
            recipients: recipients_string,
            user_ids_string,
            unread: num_unread,
            is_zero: num_unread === 0,
            is_active,
            url: hash_util.pm_with_url(user_ids_string),
            status_emoji_info,
            user_circle_class,
            is_group,
            is_bot,
            has_unread_mention,
            includes_deactivated_user,
            is_current_user,
        };
        display_objects.push(display_object);
    }

    return display_objects;
}

// Designed to closely match topic_list_data.get_list_info().
export function get_list_info(
    zoomed: boolean,
    search_term = "",
): {
    conversations_to_be_shown: DisplayObject[];
    more_conversations_unread_count: number;
} {
    const conversations = get_conversations(search_term);

    if (zoomed) {
        return {
            conversations_to_be_shown: conversations,
            more_conversations_unread_count: 0,
        };
    }

    const conversations_to_be_shown = [];
    let more_conversations_unread_count = 0;

    function should_show_conversation(conversation: DisplayObject): boolean {
        const current_to_be_shown_count = conversations_to_be_shown.length;

        // We always show the active conversation; see the similar
        // comment in topic_list_data.ts.
        if (conversation.is_active) {
            return true;
        }

        // We don't need to filter muted users here, because
        // pm_conversations.ts takes care of this for us.

        // Conversations that include any deactivated users should
        // only be visible in the unzoomed view.
        if (conversation.includes_deactivated_user) {
            return false;
        }

        // We include the most recent max_conversations_to_show
        // conversations, regardless of whether they have unread
        // messages.
        if (current_to_be_shown_count < max_conversations_to_show) {
            return true;
        }

        // We include older conversations with unread messages up
        // until max_conversations_to_show_with_unreads total
        // topics have been included.
        if (
            conversation.unread > 0 &&
            current_to_be_shown_count < max_conversations_to_show_with_unreads
        ) {
            return true;
        }

        // Otherwise, this conversation should only be visible in
        // the unzoomed view.
        return false;
    }

    for (const conversation of conversations) {
        if (should_show_conversation(conversation)) {
            conversations_to_be_shown.push(conversation);
        } else {
            more_conversations_unread_count += conversation.unread;
        }
    }

    return {
        conversations_to_be_shown,
        more_conversations_unread_count,
    };
}
```

--------------------------------------------------------------------------------

---[FILE: pm_list_dom.ts]---
Location: zulip-main/web/src/pm_list_dom.ts

```typescript
import _ from "lodash";

import render_more_private_conversations from "../templates/more_pms.hbs";
import render_pm_list_item from "../templates/pm_list_item.hbs";

import * as vdom from "./vdom.ts";

// TODO/typescript: Move this to pm_list_data
type PMListConversation = {
    user_ids_string: string;
};

export type PMNode =
    | {
          type: "conversation";
          conversation: PMListConversation;
      }
    | {
          type: "more_items";
          more_conversations_unread_count: number;
      };

export function keyed_pm_li(conversation: PMListConversation): vdom.Node<PMNode> {
    const render = (): string => render_pm_list_item(conversation);

    const eq = (other: PMNode): boolean =>
        other.type === "conversation" && _.isEqual(conversation, other.conversation);

    const key = conversation.user_ids_string;

    return {
        key,
        render,
        eq,
        type: "conversation",
        conversation,
    };
}

export function more_private_conversations_li(
    more_conversations_unread_count: number,
): vdom.Node<PMNode> {
    const render = (): string =>
        render_more_private_conversations({more_conversations_unread_count});

    // Used in vdom.js to check if an element has changed and needs to
    // be updated in the DOM.
    const eq = (other: PMNode): boolean =>
        other.type === "more_items" &&
        more_conversations_unread_count === other.more_conversations_unread_count;

    // This special key must be impossible as a user_ids_string.
    const key = "more_private_conversations";

    return {
        key,
        render,
        eq,
        type: "more_items",
        more_conversations_unread_count,
    };
}

export function pm_ul(nodes: vdom.Node<PMNode>[]): vdom.Tag<PMNode> {
    const attrs: [string, string][] = [
        ["class", "dm-list"],
        ["data-name", "private"],
    ];
    return vdom.ul({
        attrs,
        keyed_nodes: nodes,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: poll_data.ts]---
Location: zulip-main/web/src/poll_data.ts
Signals: Zod

```typescript
import assert from "minimalistic-assert";
import * as z from "zod/mini";

export type PollDataConfig = {
    message_sender_id: number;
    current_user_id: number;
    is_my_poll: boolean;
    question: string;
    options: string[];
    comma_separated_names: (user_ids: number[]) => string;
    report_error_function: (msg: string, more_info?: Record<string, unknown>) => void;
};

export type PollOptionData = {
    option: string;
    names: string;
    count: number;
    key: string;
    current_user_vote: boolean;
};

type PollOption = {
    option: string;
    user_id: number | string;
    votes: Map<number, number>;
};

export type WidgetData = {
    options: PollOptionData[];
    question: string;
};

export type InboundData = unknown;
export type NewOptionOutboundData = {type: string; idx: number; option: string};
export type QuestionOutboundData = {type: string; question: string};
export type VoteOutboundData = {type: string; key: string; vote: number};
export type PollHandle = {
    new_option: {
        outbound: (option: string) => NewOptionOutboundData;
        inbound: (sender_id: number | string, data: InboundData) => void;
    };
    question: {
        outbound: (question: string) => QuestionOutboundData | undefined;
        inbound: (sender_id: number, data: InboundData) => void;
    };
    vote: {
        outbound: (key: string) => VoteOutboundData;
        inbound: (sender_id: number, data: InboundData) => void;
    };
};

const inbound_option_schema = z.object({
    idx: z.number(),
    option: z.string(),
    type: z.literal("new_option"),
});

const inbound_question_schema = z.object({
    question: z.string(),
    type: z.literal("question"),
});

const inbound_vote_schema = z.object({
    key: z.string(),
    type: z.literal("vote"),
    vote: z.number(),
});

// Any single user should send add a finite number of options
// to a poll. We arbitrarily pick this value.
const MAX_IDX = 1000;

export class PollData {
    // This object just holds data for a poll, although it
    // works closely with the widget's concept of how data
    // should be represented for rendering, plus how the
    // server sends us data.

    key_to_option = new Map<string, PollOption>();
    my_idx = 1;
    message_sender_id: number;
    me: number;
    is_my_poll: boolean;
    poll_question: string;
    input_mode: boolean;
    comma_separated_names: (user_ids: number[]) => string;
    report_error_function: (error_message: string) => void;
    handle: PollHandle;

    constructor({
        message_sender_id,
        current_user_id,
        is_my_poll,
        question,
        options,
        comma_separated_names,
        report_error_function,
    }: PollDataConfig) {
        this.message_sender_id = message_sender_id;
        this.me = current_user_id;
        this.is_my_poll = is_my_poll;
        this.poll_question = question;
        this.input_mode = is_my_poll; // for now
        this.comma_separated_names = comma_separated_names;
        this.report_error_function = report_error_function;

        if (question) {
            this.set_question(question);
        }

        this.handle = {
            new_option: {
                outbound: (option) => {
                    const event = {
                        type: "new_option",
                        idx: this.my_idx,
                        option,
                    };

                    this.my_idx += 1;

                    return event;
                },

                inbound: (sender_id, data) => {
                    const safe_data = inbound_option_schema.parse(data);

                    // All message readers may add a new option to the poll.
                    const idx = safe_data.idx;
                    const option = safe_data.option;
                    const options = this.get_widget_data().options;

                    // While the UI doesn't allow adding duplicate options
                    // to an existing poll, the /poll command syntax to create
                    // them does not prevent duplicates, so we suppress them here.
                    if (this.is_option_present(options, option)) {
                        return;
                    }

                    if (idx < 0 || idx > MAX_IDX) {
                        this.report_error_function("poll widget: idx out of bound");
                        return;
                    }

                    const key = `${sender_id},${idx}`;
                    const votes = new Map<number, number>();

                    this.key_to_option.set(key, {
                        option,
                        user_id: sender_id,
                        votes,
                    });

                    // I may have added a poll option from another device.
                    if (sender_id === this.me && this.my_idx <= idx) {
                        this.my_idx = idx + 1;
                    }
                },
            },

            question: {
                outbound: (question) => {
                    const event = {
                        type: "question",
                        question,
                    };
                    if (this.is_my_poll) {
                        return event;
                    }
                    return undefined;
                },

                inbound: (sender_id, data) => {
                    const safe_data = inbound_question_schema.parse(data);

                    // Only the message author can edit questions.
                    if (sender_id !== this.message_sender_id) {
                        this.report_error_function(
                            `user ${sender_id} is not allowed to edit the question`,
                        );
                        return;
                    }

                    this.set_question(safe_data.question);
                },
            },

            vote: {
                outbound: (key) => {
                    let vote = 1;

                    // toggle
                    assert(this.key_to_option.has(key), `option key not found: ${key}`);
                    if (this.key_to_option.get(key)!.votes.get(this.me)) {
                        vote = -1;
                    }

                    const event = {
                        type: "vote",
                        key,
                        vote,
                    };

                    return event;
                },

                inbound: (sender_id, data) => {
                    const safe_data = inbound_vote_schema.parse(data);

                    // All message readers may vote on poll options.
                    const key = safe_data.key;
                    const vote = safe_data.vote;

                    if (!(vote === 1 || vote === -1)) {
                        this.report_error_function("poll widget: bad value for inbound vote count");
                        return;
                    }

                    const option = this.key_to_option.get(key);

                    if (option === undefined) {
                        this.report_error_function("unknown key for poll: " + key);
                        return;
                    }

                    const votes = option.votes;

                    if (vote === 1) {
                        votes.set(sender_id, 1);
                    } else {
                        votes.delete(sender_id);
                    }
                },
            },
        };

        for (const [i, option] of options.entries()) {
            this.handle.new_option.inbound("canned", {
                idx: i,
                option,
                type: "new_option",
            });
        }
    }

    set_question(new_question: string): void {
        this.input_mode = false;
        this.poll_question = new_question;
    }

    get_question(): string {
        return this.poll_question;
    }

    set_input_mode(): void {
        this.input_mode = true;
    }

    clear_input_mode(): void {
        this.input_mode = false;
    }

    get_input_mode(): boolean {
        return this.input_mode;
    }

    get_widget_data(): WidgetData {
        const options: PollOptionData[] = [];

        for (const [key, obj] of this.key_to_option) {
            const voters = [...obj.votes.keys()];
            const current_user_vote = voters.includes(this.me);

            options.push({
                option: obj.option,
                names: this.comma_separated_names(voters),
                count: voters.length,
                key,
                current_user_vote,
            });
        }

        const widget_data = {
            options,
            question: this.poll_question,
        };

        return widget_data;
    }

    handle_event(sender_id: number, data: InboundData): void {
        assert(
            typeof data === "object" &&
                data !== null &&
                "type" in data &&
                typeof data.type === "string",
        );
        const type = data.type;
        if (type === "new_option" || type === "question" || type === "vote") {
            this.handle[type].inbound(sender_id, data);
        } else {
            this.report_error_function(`poll widget: unknown inbound type: ${type}`);
        }
    }

    // function to check whether option already exists
    is_option_present(data: PollOptionData[], latest_option: string): boolean {
        return data.some((el) => el.option === latest_option);
    }
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 656
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 656 of 1290)

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

---[FILE: reactions.ts]---
Location: zulip-main/web/src/reactions.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import render_message_reaction from "../templates/message_reaction.hbs";
import render_message_reactions from "../templates/message_reactions.hbs";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import type {RawLocalMessage} from "./echo.ts";
import * as emoji from "./emoji.ts";
import type {EmojiRenderingDetails} from "./emoji.ts";
import {$t} from "./i18n.ts";
import * as message_lists from "./message_lists.ts";
import * as message_store from "./message_store.ts";
import type {Message, MessageCleanReaction, RawMessage} from "./message_store.ts";
import {page_params} from "./page_params.ts";
import * as people from "./people.ts";
import * as spectators from "./spectators.ts";
import {current_user} from "./state_data.ts";
import {user_settings} from "./user_settings.ts";

const waiting_for_server_request_ids = new Set<string>();

export type ReactionEvent = {
    message_id: number;
    user_id: number;
    reaction_type: "zulip_extra_emoji" | "realm_emoji" | "unicode_emoji";
    emoji_name: string;
    emoji_code: string;
};

export function get_local_reaction_id(rendering_details: EmojiRenderingDetails): string {
    return [rendering_details.reaction_type, rendering_details.emoji_code].join(",");
}

export function current_user_has_reacted_to_emoji(message: Message, local_id: string): boolean {
    update_clean_reactions(message);

    const clean_reaction_object = message.clean_reactions.get(local_id);
    return clean_reaction_object?.user_ids.includes(current_user.user_id) ?? false;
}

function get_message(message_id: number): Message | undefined {
    const message = message_store.get(message_id);
    if (!message) {
        blueslip.error("reactions: Bad message id", {message_id});
        return undefined;
    }

    update_clean_reactions(message);
    return message;
}

export type RawReaction = {
    emoji_name: string;
    reaction_type: "zulip_extra_emoji" | "realm_emoji" | "unicode_emoji";
    emoji_code: string;
    user_id: number;
};

function create_reaction(
    message_id: number,
    rendering_details: EmojiRenderingDetails,
): ReactionEvent {
    return {
        message_id,
        user_id: current_user.user_id,
        reaction_type: rendering_details.reaction_type,
        emoji_name: rendering_details.emoji_name,
        emoji_code: rendering_details.emoji_code,
    };
}

function update_ui_and_send_reaction_ajax(
    message: Message,
    rendering_details: EmojiRenderingDetails,
): void {
    if (page_params.is_spectator) {
        // Spectators can't react, since they don't have accounts.  We
        // stop here to avoid a confusing reaction local echo.
        spectators.login_to_access();
        return;
    }

    const local_id = get_local_reaction_id(rendering_details);
    const has_reacted = current_user_has_reacted_to_emoji(message, local_id);
    const operation = has_reacted ? "remove" : "add";
    const reaction = create_reaction(message.id, rendering_details);

    // To avoid duplicate requests to the server, we construct a
    // unique request ID combining the message ID and the local ID,
    // which identifies just which emoji to use.
    const reaction_request_id = [message.id, local_id].join(",");
    if (waiting_for_server_request_ids.has(reaction_request_id)) {
        return;
    }

    if (operation === "add") {
        add_reaction(reaction);
    } else {
        remove_reaction(reaction);
    }

    const args = {
        url: "/json/messages/" + message.id + "/reactions",
        data: rendering_details,
        success() {
            waiting_for_server_request_ids.delete(reaction_request_id);
        },
        error(xhr: JQuery.jqXHR) {
            waiting_for_server_request_ids.delete(reaction_request_id);
            if (xhr.readyState !== 0) {
                const parsed = z.object({code: z.string()}).safeParse(xhr.responseJSON);
                if (
                    parsed.success &&
                    (parsed.data.code === "REACTION_ALREADY_EXISTS" ||
                        parsed.data.code === "REACTION_DOES_NOT_EXIST")
                ) {
                    // Don't send error report for simple precondition failures caused by race
                    // conditions; the user already got what they wanted
                } else {
                    blueslip.error(channel.xhr_error_message("Error sending reaction", xhr));
                }
            }
        },
    };

    waiting_for_server_request_ids.add(reaction_request_id);
    if (operation === "add") {
        void channel.post(args);
    } else if (operation === "remove") {
        void channel.del(args);
    }
}

export function toggle_emoji_reaction(message: Message, emoji_name: string): void {
    // This codepath doesn't support toggling a deactivated realm emoji.
    // Since a user can interact with a deactivated realm emoji only by
    // clicking on a reaction and that is handled by `process_reaction_click()`
    // method. This codepath is to be used only where there is no chance of an
    // user interacting with a deactivated realm emoji like emoji picker.

    const rendering_details = emoji.get_emoji_details_by_name(emoji_name);
    update_ui_and_send_reaction_ajax(message, rendering_details);
}

export function process_reaction_click(message_id: number, local_id: string): void {
    const message = get_message(message_id);

    if (!message) {
        blueslip.error("message_id for reaction click is unknown", {message_id});
        return;
    }

    const clean_reaction_object = message.clean_reactions.get(local_id);

    if (!clean_reaction_object) {
        blueslip.error("Data integrity problem for reaction", {local_id, message_id});
        return;
    }

    const rendering_details = {
        reaction_type: clean_reaction_object.reaction_type,
        emoji_name: clean_reaction_object.emoji_name,
        emoji_code: clean_reaction_object.emoji_code,
    };

    update_ui_and_send_reaction_ajax(message, rendering_details);
}

function generate_title(emoji_name: string, user_ids: number[]): string {
    const usernames = people.get_display_full_names(
        user_ids.filter((user_id) => user_id !== current_user.user_id),
    );
    const current_user_reacted = user_ids.length !== usernames.length;

    const colon_emoji_name = ":" + emoji_name + ":";

    if (user_ids.length === 1) {
        if (current_user_reacted) {
            const context = {
                emoji_name: colon_emoji_name,
            };
            return $t({defaultMessage: "You (click to remove) reacted with {emoji_name}"}, context);
        }
        const context = {
            emoji_name: colon_emoji_name,
            username: usernames[0],
        };
        return $t({defaultMessage: "{username} reacted with {emoji_name}"}, context);
    }

    if (user_ids.length === 2 && current_user_reacted) {
        const context = {
            emoji_name: colon_emoji_name,
            other_username: usernames[0],
        };
        return $t(
            {
                defaultMessage:
                    "You (click to remove) and {other_username} reacted with {emoji_name}",
            },
            context,
        );
    }

    const context = {
        emoji_name: colon_emoji_name,
        comma_separated_usernames: usernames.slice(0, -1).join(", "),
        last_username: usernames.at(-1),
    };
    if (current_user_reacted) {
        return $t(
            {
                defaultMessage:
                    "You (click to remove), {comma_separated_usernames} and {last_username} reacted with {emoji_name}",
            },
            context,
        );
    }
    return $t(
        {
            defaultMessage:
                "{comma_separated_usernames} and {last_username} reacted with {emoji_name}",
        },
        context,
    );
}

// Add a tooltip showing who reacted to a message.
export function get_reaction_title_data(message_id: number, local_id: string): string {
    const message = get_message(message_id);
    assert(message !== undefined);

    const clean_reaction_object = message.clean_reactions.get(local_id);
    assert(clean_reaction_object !== undefined);

    const user_list = clean_reaction_object.user_ids;
    const emoji_name = clean_reaction_object.emoji_name;
    const title = generate_title(emoji_name, user_list);

    return title;
}

export function get_reaction_sections(message_id: number): JQuery {
    const $rows = message_lists.all_rendered_row_for_message_id(message_id);
    return $rows.find(".message_reactions");
}

export let find_reaction = (message_id: number, local_id: string): JQuery => {
    const $reaction_section = get_reaction_sections(message_id);
    const $reaction = $reaction_section.find(`[data-reaction-id='${CSS.escape(local_id)}']`);
    return $reaction;
};

export function rewire_find_reaction(value: typeof find_reaction): void {
    find_reaction = value;
}

export function get_add_reaction_button(message_id: number): JQuery {
    const $reaction_section = get_reaction_sections(message_id);
    const $add_button = $reaction_section.find(".reaction_button");
    return $add_button;
}

export let set_reaction_vote_text = ($reaction: JQuery, vote_text: string): void => {
    const $count_element = $reaction.find(".message_reaction_count");
    $count_element.text(vote_text);
};

export function rewire_set_reaction_vote_text(value: typeof set_reaction_vote_text): void {
    set_reaction_vote_text = value;
}

export let add_reaction = (event: ReactionEvent): void => {
    const message_id = event.message_id;
    const message = message_store.get(message_id);

    if (message === undefined) {
        // If we don't have the message in cache, do nothing; if we
        // ever fetch it from the server, it'll come with the
        // latest reactions attached
        return;
    }

    update_clean_reactions(message);

    const local_id = get_local_reaction_id(event);
    const user_id = event.user_id;
    let clean_reaction_object = message.clean_reactions.get(local_id);
    if (clean_reaction_object?.user_ids.includes(user_id)) {
        return;
    }

    if (clean_reaction_object) {
        clean_reaction_object.user_ids.push(user_id);
        const reaction_counts_and_user_ids = get_reaction_counts_and_user_ids(message);
        const should_display_reactors = check_should_display_reactors(reaction_counts_and_user_ids);
        update_user_fields(clean_reaction_object, should_display_reactors);
        update_existing_reaction(clean_reaction_object, message, user_id);
    } else {
        const reaction_counts_and_user_ids = get_reaction_counts_and_user_ids(message);
        reaction_counts_and_user_ids.push({
            user_ids: [user_id],
            count: 1,
        });
        const should_display_reactors = check_should_display_reactors(reaction_counts_and_user_ids);
        clean_reaction_object = make_clean_reaction({
            local_id,
            user_ids: [user_id],
            reaction_type: event.reaction_type,
            emoji_name: event.emoji_name,
            emoji_code: event.emoji_code,
            should_display_reactors,
        });

        message.clean_reactions.set(local_id, clean_reaction_object);
        insert_new_reaction(clean_reaction_object, message, user_id);
    }
};

export function rewire_add_reaction(value: typeof add_reaction): void {
    add_reaction = value;
}

export let update_existing_reaction = (
    clean_reaction_object: MessageCleanReaction,
    message: Message,
    acting_user_id: number,
): void => {
    // Our caller ensures that this message already has a reaction
    // for this emoji and sets up our user_list.  This function
    // simply updates the DOM.
    const local_id = get_local_reaction_id(clean_reaction_object);
    const $reaction = find_reaction(message.id, local_id);

    const new_label = generate_title(
        clean_reaction_object.emoji_name,
        clean_reaction_object.user_ids,
    );
    $reaction.attr("aria-label", new_label);

    if (acting_user_id === current_user.user_id) {
        $reaction.addClass("reacted");
    }

    update_vote_text_on_message(message);
};

export function rewire_update_existing_reaction(value: typeof update_existing_reaction): void {
    update_existing_reaction = value;
}

export let insert_new_reaction = (
    clean_reaction_object: MessageCleanReaction,
    message: Message,
    user_id: number,
): void => {
    // Our caller ensures we are the first user to react to this
    // message with this emoji. We then render the emoji/title/count
    // and insert it before the add button.

    const emoji_details = emoji.get_emoji_details_for_rendering(clean_reaction_object);
    const new_label = generate_title(
        clean_reaction_object.emoji_name,
        clean_reaction_object.user_ids,
    );

    const is_realm_emoji =
        emoji_details.reaction_type === "realm_emoji" ||
        emoji_details.reaction_type === "zulip_extra_emoji";
    const reaction_class =
        user_id === current_user.user_id ? "message_reaction reacted" : "message_reaction";

    const context = {
        message_id: message.id,
        ...emoji_details,
        count: 1,
        label: new_label,
        local_id: get_local_reaction_id(clean_reaction_object),
        emoji_alt_code: user_settings.emojiset === "text",
        is_realm_emoji,
        vote_text: "", // Updated below
        class: reaction_class,
    };

    // If the given reaction is the first reaction in a message, then we add
    // the whole message reactions section along with the new reaction.
    // Else, we insert the new reaction before the add reaction button.
    if (message.clean_reactions.size - 1 === 0) {
        const $rows = message_lists.all_rendered_row_for_message_id(message.id);
        const reaction_section_context = {
            msg: {
                message_reactions: [context],
            },
        };
        const $msg_reaction_section = $(render_message_reactions(reaction_section_context));
        $rows.find(".messagebox-content").append($msg_reaction_section);
    } else {
        const $new_reaction = $(render_message_reaction(context));
        const $reaction_button_element = get_add_reaction_button(message.id);
        $new_reaction.insertBefore($reaction_button_element);
    }

    update_vote_text_on_message(message);
};

export function rewire_insert_new_reaction(value: typeof insert_new_reaction): void {
    insert_new_reaction = value;
}

export let remove_reaction = (event: ReactionEvent): void => {
    const message_id = event.message_id;
    const user_id = event.user_id;
    const message = message_store.get(message_id);
    const local_id = get_local_reaction_id(event);

    if (message === undefined) {
        // If we don't have the message in cache, do nothing; if we
        // ever fetch it from the server, it'll come with the
        // latest reactions attached
        return;
    }

    update_clean_reactions(message);

    const clean_reaction_object = message.clean_reactions.get(local_id);

    if (!clean_reaction_object) {
        return;
    }

    if (!clean_reaction_object.user_ids.includes(user_id)) {
        return;
    }

    clean_reaction_object.user_ids = clean_reaction_object.user_ids.filter((id) => id !== user_id);
    if (clean_reaction_object.user_ids.length === 0) {
        message.clean_reactions.delete(local_id);
    }

    const reaction_counts_and_user_ids = get_reaction_counts_and_user_ids(message);
    const should_display_reactors = check_should_display_reactors(reaction_counts_and_user_ids);
    update_user_fields(clean_reaction_object, should_display_reactors);

    remove_reaction_from_view(clean_reaction_object, message, user_id);
};

export function rewire_remove_reaction(value: typeof remove_reaction): void {
    remove_reaction = value;
}

export let remove_reaction_from_view = (
    clean_reaction_object: MessageCleanReaction,
    message: Message,
    user_id: number,
): void => {
    const local_id = get_local_reaction_id(clean_reaction_object);
    const $reaction = find_reaction(message.id, local_id);
    const reaction_count = clean_reaction_object.user_ids.length;

    // Cleanup: If the reaction being removed is the last reaction on the
    // message, we remove the whole message reaction section and exit.
    if (message.clean_reactions.size === 0) {
        const $msg_reaction_section = get_reaction_sections(message.id);
        $msg_reaction_section.remove();
        return;
    }

    if (reaction_count === 0) {
        // If this user was the only one reacting for this emoji, we
        // remove the entire `message_reaction` template outer
        // container, and then update vote text in case we now have
        // few enough reactions to display names again.
        $reaction.parent(".message_reaction_container").remove();
        update_vote_text_on_message(message);
        return;
    }

    // The emoji still has reactions from other users, so we need to update
    // the title/count and, if the user is the current user, turn off the
    // "reacted" class.
    const new_label = generate_title(
        clean_reaction_object.emoji_name,
        clean_reaction_object.user_ids,
    );
    $reaction.attr("aria-label", new_label);
    if (user_id === current_user.user_id) {
        $reaction.removeClass("reacted");
    }

    update_vote_text_on_message(message);
};

export function rewire_remove_reaction_from_view(value: typeof remove_reaction_from_view): void {
    remove_reaction_from_view = value;
}

export function get_emojis_used_by_user_for_message_id(message_id: number): string[] {
    const user_id = current_user.user_id;
    assert(user_id !== undefined);
    const message = message_store.get(message_id);
    assert(message !== undefined);
    update_clean_reactions(message);

    const names = [];
    for (const clean_reaction_object of message.clean_reactions.values()) {
        if (clean_reaction_object.user_ids.includes(user_id)) {
            names.push(clean_reaction_object.emoji_name);
        }
    }

    return names;
}

export function get_message_reactions(message: Message): MessageCleanReaction[] {
    update_clean_reactions(message);
    return [...message.clean_reactions.values()];
}

export function generate_clean_reactions(
    message: RawMessage | RawLocalMessage,
): Map<string, MessageCleanReaction> {
    /*
      generate_clean_reactions processes the raw message.reactions object,
      which will contain one object for each individual reaction, even
      if two users react with the same emoji.

      Its output, `cleaned_reactions`, is a more compressed format with
      one entry per reaction pill that should be displayed visually to
      users.
    */

    // This first loop creates a temporary distinct_reactions data
    // structure, which will accumulate the set of users who have
    // reacted with each distinct reaction.
    assert(message.reactions !== undefined);
    const distinct_reactions = new Map<string, RawReaction>();
    const user_map = new Map<string, number[]>();
    for (const reaction of message.reactions) {
        const local_id = get_local_reaction_id(reaction);
        const user_id = reaction.user_id;

        if (!distinct_reactions.has(local_id)) {
            distinct_reactions.set(local_id, reaction);
            user_map.set(local_id, []);
        }

        const user_ids = user_map.get(local_id)!;

        if (user_ids.includes(user_id)) {
            blueslip.error("server sent duplicate reactions", {user_id, local_id});
            continue;
        }

        user_ids.push(user_id);
    }

    const clean_reactions = new Map<string, MessageCleanReaction>();

    const reaction_counts_and_user_ids = [...distinct_reactions.keys()].map((local_id) => {
        const user_ids = user_map.get(local_id);
        assert(user_ids !== undefined);
        return {
            count: user_ids.length,
            user_ids,
        };
    });
    const should_display_reactors = check_should_display_reactors(reaction_counts_and_user_ids);

    for (const local_id of distinct_reactions.keys()) {
        const reaction = distinct_reactions.get(local_id);
        assert(reaction !== undefined);
        const user_ids = user_map.get(local_id);
        assert(user_ids !== undefined);

        clean_reactions.set(
            local_id,
            make_clean_reaction({local_id, user_ids, should_display_reactors, ...reaction}),
        );
    }

    return clean_reactions;
}

export function update_clean_reactions(message: Message): void {
    // Update display details for the reaction. In particular,
    // user_settings.display_emoji_reaction_users or the names of
    // the users appearing in the reaction may have changed since
    // this reaction was first rendered.
    const reaction_counts_and_user_ids = get_reaction_counts_and_user_ids(message);
    const should_display_reactors = check_should_display_reactors(reaction_counts_and_user_ids);
    for (const clean_reaction of message.clean_reactions.values()) {
        update_user_fields(clean_reaction, should_display_reactors);
    }
}

function make_clean_reaction({
    local_id,
    user_ids,
    emoji_name,
    emoji_code,
    reaction_type,
    should_display_reactors,
}: {
    local_id: string;
    user_ids: number[];
    emoji_name: string;
    emoji_code: string;
    reaction_type: "zulip_extra_emoji" | "realm_emoji" | "unicode_emoji";
    should_display_reactors: boolean;
}): MessageCleanReaction {
    const emoji_details = emoji.get_emoji_details_for_rendering({
        emoji_name,
        emoji_code,
        reaction_type,
    });
    const emoji_alt_code = user_settings.emojiset === "text";
    const is_realm_emoji =
        emoji_details.reaction_type === "realm_emoji" ||
        emoji_details.reaction_type === "zulip_extra_emoji";

    return {
        local_id,
        user_ids,
        ...emoji_details,
        emoji_alt_code,
        is_realm_emoji,
        ...build_reaction_data(user_ids, emoji_name, should_display_reactors),
    };
}

function build_reaction_data(
    user_ids: number[],
    emoji_name: string,
    should_display_reactors: boolean,
): {
    count: number;
    label: string;
    class: string;
    vote_text: string;
} {
    return {
        count: user_ids.length,
        label: generate_title(emoji_name, user_ids),
        class: user_ids.includes(current_user.user_id)
            ? "message_reaction reacted"
            : "message_reaction",
        // The vote_text field set here is used directly in the Handlebars
        // template for rendering (or rerendering!) a message.
        vote_text: get_vote_text(user_ids, should_display_reactors),
    };
}

export function update_user_fields(
    clean_reaction_object: MessageCleanReaction,
    should_display_reactors: boolean,
): void {
    // update_user_fields needs to be called whenever the set of users
    // who reacted on a message might have changed, including due to
    // upvote/downvotes on ANY reaction in the message, because those
    // can change the correct value of should_display_reactors to use.
    Object.assign(clean_reaction_object, {
        ...clean_reaction_object,
        ...build_reaction_data(
            clean_reaction_object.user_ids,
            clean_reaction_object.emoji_name,
            should_display_reactors,
        ),
    });
}

type ReactionUserIdAndCount = {
    count: number;
    user_ids: number[];
};

function get_reaction_counts_and_user_ids(message: Message): ReactionUserIdAndCount[] {
    return [...message.clean_reactions.values()].map((reaction) => ({
        count: reaction.count,
        user_ids: reaction.user_ids,
    }));
}

export function get_vote_text(user_ids: number[], should_display_reactors: boolean): string {
    if (should_display_reactors) {
        return comma_separated_usernames(user_ids);
    }
    return `${user_ids.length}`;
}

function check_should_display_reactors(
    reaction_counts_and_user_ids: ReactionUserIdAndCount[],
): boolean {
    if (!user_settings.display_emoji_reaction_users) {
        return false;
    }

    let total_reactions = 0;
    for (const {count, user_ids} of reaction_counts_and_user_ids) {
        total_reactions += count ?? user_ids.length;
    }
    return total_reactions <= 3;
}

function comma_separated_usernames(user_list: number[]): string {
    const usernames = people.get_display_full_names(user_list);
    const current_user_has_reacted = user_list.includes(current_user.user_id);

    if (current_user_has_reacted) {
        const current_user_index = user_list.indexOf(current_user.user_id);
        usernames[current_user_index] = $t({
            defaultMessage: "You",
        });
    }
    const comma_separated_usernames = usernames.join(", ");
    return comma_separated_usernames;
}

export let update_vote_text_on_message = (message: Message): void => {
    // Because whether we display a count or the names of reacting
    // users depends on total reactions on the message, we need to
    // recalculate this whenever adjusting reaction rendering on a
    // message.
    update_clean_reactions(message);
    const reaction_counts_and_user_ids = get_reaction_counts_and_user_ids(message);
    const should_display_reactors = check_should_display_reactors(reaction_counts_and_user_ids);
    for (const [reaction, clean_reaction] of message.clean_reactions.entries()) {
        const reaction_elem = find_reaction(message.id, clean_reaction.local_id);
        const vote_text = get_vote_text(clean_reaction.user_ids, should_display_reactors);
        const message_clean_reaction = message.clean_reactions.get(reaction);
        assert(message_clean_reaction !== undefined);
        message_clean_reaction.vote_text = vote_text;
        set_reaction_vote_text(reaction_elem, vote_text);
    }
};

export function rewire_update_vote_text_on_message(
    value: typeof update_vote_text_on_message,
): void {
    update_vote_text_on_message = value;
}
```

--------------------------------------------------------------------------------

---[FILE: read_receipts.ts]---
Location: zulip-main/web/src/read_receipts.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import SimpleBar from "simplebar";
import * as z from "zod/mini";

import render_read_receipts from "../templates/read_receipts.hbs";
import render_read_receipts_modal from "../templates/read_receipts_modal.hbs";

import * as channel from "./channel.ts";
import {$t, $t_html} from "./i18n.ts";
import * as loading from "./loading.ts";
import * as message_store from "./message_store.ts";
import * as modals from "./modals.ts";
import * as people from "./people.ts";
import {realm} from "./state_data.ts";
import * as ui_report from "./ui_report.ts";
import * as util from "./util.ts";

const read_receipts_polling_interval_ms = 60 * 1000;
const read_receipts_api_response_schema = z.object({
    user_ids: z.array(z.number()),
});

let interval_id: number | null = null;
let has_initial_data = false;

export function fetch_read_receipts(message_id: number): void {
    const message = message_store.get(message_id);
    assert(message !== undefined, "message is undefined");

    if (message.sender_email === "notification-bot@zulip.com") {
        $("#read_receipts_modal .read_receipts_info").text(
            $t({
                defaultMessage: "Read receipts are not available for Notification Bot messages.",
            }),
        );
        $("#read_receipts_modal .modal__content").addClass("compact");
        return;
    }
    if (!realm.realm_enable_read_receipts) {
        ui_report.error(
            $t({
                defaultMessage: "Read receipts are disabled for this organization.",
            }),
            undefined,
            $("#read_receipts_modal #read_receipts_error"),
        );
        return;
    }

    if (!has_initial_data) {
        loading.make_indicator($("#read_receipts_modal .loading_indicator"));
    }

    void channel.get({
        url: `/json/messages/${message_id}/read_receipts`,
        success(raw_data) {
            const $modal = $("#read_receipts_modal").filter(`[data-message-id=${message_id}]`);
            // If the read receipts modal for the selected message ID is closed
            // by the time we receive the response, return immediately.
            if ($modal.length === 0) {
                return;
            }

            has_initial_data = true;
            $("#read_receipts_modal .read_receipts_error").removeClass("show");
            const data = read_receipts_api_response_schema.parse(raw_data);
            const users = data.user_ids.map((id) => people.get_user_by_id_assert_valid(id));
            users.sort(people.compare_by_name);

            const context = {
                users: users.map((user) => ({
                    user_id: user.user_id,
                    full_name: user.full_name,
                    avatar_url: people.small_avatar_url_for_person(user),
                })),
            };

            if (users.length === 0) {
                $("#read_receipts_modal .read_receipts_info").text(
                    $t({defaultMessage: "No one has read this message yet."}),
                );
                $modal.find(".read_receipts_list").hide();
            } else {
                $("#read_receipts_modal .read_receipts_info").html(
                    $t_html(
                        {
                            defaultMessage:
                                "{num_of_people, plural, one {This message has been <z-link>read</z-link> by {num_of_people} person:} other {This message has been <z-link>read</z-link> by {num_of_people} people:}}",
                        },
                        {
                            num_of_people: users.length,
                            "z-link": (content_html) =>
                                `<a href="/help/read-receipts" target="_blank" rel="noopener noreferrer">${content_html.join(
                                    "",
                                )}</a>`,
                        },
                    ),
                );
                $modal.find(".read_receipts_list").html(render_read_receipts(context)).show();
                $("#read_receipts_modal .modal__container").addClass("showing_read_receipts_list");
                new SimpleBar(util.the($("#read_receipts_modal .modal__content")), {
                    tabIndex: -1,
                });
            }
            loading.destroy_indicator($("#read_receipts_modal .loading_indicator"));
        },
        error(xhr) {
            ui_report.error(
                $t({defaultMessage: "Failed to load read receipts."}),
                xhr,
                $("#read_receipts_modal #read_receipts_error"),
            );
            loading.destroy_indicator($("#read_receipts_modal .loading_indicator"));
        },
    });
}

export function show_user_list(message_id: number): void {
    $("#read-receipts-modal-container").html(render_read_receipts_modal({message_id}));
    modals.open("read_receipts_modal", {
        autoremove: true,
        on_shown() {
            has_initial_data = false;
            fetch_read_receipts(message_id);
            interval_id = window.setInterval(() => {
                fetch_read_receipts(message_id);
            }, read_receipts_polling_interval_ms);
        },
        on_hidden() {
            if (interval_id !== null) {
                clearInterval(interval_id);
                interval_id = null;
            }
        },
    });
}

export function hide_user_list(): void {
    modals.close_if_open("read_receipts_modal");
}
```

--------------------------------------------------------------------------------

---[FILE: realm_icon.ts]---
Location: zulip-main/web/src/realm_icon.ts

```typescript
import $ from "jquery";

import * as channel from "./channel.ts";
import {current_user, realm} from "./state_data.ts";
import * as upload_widget from "./upload_widget.ts";
import type {UploadFunction} from "./upload_widget.ts";

export function build_realm_icon_widget(upload_function: UploadFunction): void {
    const get_file_input = function (): JQuery<HTMLInputElement> {
        return $<HTMLInputElement>("#realm-icon-upload-widget .image_file_input").expectOne();
    };

    if (!current_user.is_admin) {
        return;
    }
    if (realm.realm_icon_source === "G") {
        $("#realm-icon-upload-widget .image-delete-button").hide();
    } else {
        $("#realm-icon-upload-widget .image-delete-button").show();
    }
    $("#realm-icon-upload-widget .image-delete-button").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        void channel.del({
            url: "/json/realm/icon",
        });
    });

    upload_widget.build_direct_upload_widget(
        get_file_input,
        $("#realm-icon-upload-widget-error").expectOne(),
        $("#realm-icon-upload-widget .image_upload_button").expectOne(),
        upload_function,
        realm.max_icon_file_size_mib,
        "realm_icon",
    );
}

export function rerender(): void {
    $("#realm-icon-upload-widget .image-block").attr("src", realm.realm_icon_url);
    if (realm.realm_icon_source === "U") {
        $("#realm-icon-upload-widget .image-delete-button").show();
    } else {
        $("#realm-icon-upload-widget .image-delete-button").hide();
        // Need to clear input because of a small edge case
        // where you try to upload the same image you just deleted.
        const $file_input = $("#realm-icon-upload-widget .image_file_input");
        $file_input.val("");
    }
}
```

--------------------------------------------------------------------------------

---[FILE: realm_logo.ts]---
Location: zulip-main/web/src/realm_logo.ts

```typescript
import $ from "jquery";

import * as channel from "./channel.ts";
import * as settings_data from "./settings_data.ts";
import {current_user, realm} from "./state_data.ts";
import * as ui_util from "./ui_util.ts";
import * as upload_widget from "./upload_widget.ts";
import type {UploadFunction} from "./upload_widget.ts";
import {user_settings} from "./user_settings.ts";

export function build_realm_logo_widget(upload_function: UploadFunction, is_night: boolean): void {
    let logo_section_id = "#realm-day-logo-upload-widget";
    let logo_source = realm.realm_logo_source;

    if (is_night) {
        logo_section_id = "#realm-night-logo-upload-widget";
        logo_source = realm.realm_night_logo_source;
    }

    const $delete_button_elem = $(logo_section_id + " .image-delete-button");
    const $file_input_elem = $<HTMLInputElement>(logo_section_id + " .image_file_input");
    const $file_input_error_elem = $(logo_section_id + "-error");
    const $upload_button_elem = $(logo_section_id + " .image_upload_button");

    const get_file_input = function (): JQuery<HTMLInputElement> {
        return $file_input_elem.expectOne();
    };

    if (!current_user.is_admin) {
        return;
    }

    if (logo_source === "D") {
        $delete_button_elem.hide();
    } else {
        $delete_button_elem.show();
    }

    const data = {night: JSON.stringify(is_night)};
    $delete_button_elem.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        void channel.del({
            url: "/json/realm/logo",
            data,
        });
    });

    upload_widget.build_direct_upload_widget(
        get_file_input,
        $file_input_error_elem.expectOne(),
        $upload_button_elem.expectOne(),
        upload_function,
        realm.max_logo_file_size_mib,
        "realm_logo",
    );
}

function change_logo_delete_button(
    logo_source: string,
    $logo_delete_button: JQuery,
    $file_input: JQuery<HTMLInputElement>,
): void {
    if (logo_source === "U") {
        $logo_delete_button.show();
    } else {
        $logo_delete_button.hide();
        // Need to clear input because of a small edge case
        // where you try to upload the same image you just deleted.
        $file_input.val("");
    }
}

export function render(): void {
    const $file_input = $<HTMLInputElement>("#realm-day-logo-upload-widget input.image_file_input");
    const $night_file_input = $<HTMLInputElement>(
        "#realm-night-logo-upload-widget input.image_file_input",
    );
    $("#realm-day-logo-upload-widget .image-block").attr("src", realm.realm_logo_url);

    if (realm.realm_night_logo_source === "D" && realm.realm_logo_source !== "D") {
        // If no dark theme logo is uploaded but a light theme one
        // is, use the light theme one; this handles the common case
        // of transparent background logos that look good on both
        // dark and light themes.  See also similar code in admin.ts.

        $("#realm-night-logo-upload-widget .image-block").attr("src", realm.realm_logo_url);
    } else {
        $("#realm-night-logo-upload-widget .image-block").attr("src", realm.realm_night_logo_url);
    }

    const $realm_logo = $<HTMLImageElement>("#realm-navbar-wide-logo");
    if (settings_data.using_dark_theme() && realm.realm_night_logo_source !== "D") {
        $realm_logo.attr("src", realm.realm_night_logo_url);
    } else {
        $realm_logo.attr("src", realm.realm_logo_url);
    }

    $realm_logo.on("load", () => {
        const logo_width = $realm_logo.width();
        if (logo_width) {
            $(":root").css(
                "--realm-logo-current-width",
                logo_width / user_settings.web_font_size_px + "em",
            );
        }
    });

    change_logo_delete_button(
        realm.realm_logo_source,
        $("#realm-day-logo-upload-widget .image-delete-button"),
        $file_input,
    );
    change_logo_delete_button(
        realm.realm_night_logo_source,
        $("#realm-night-logo-upload-widget .image-delete-button"),
        $night_file_input,
    );
}

export function initialize(): void {
    // render once
    render();

    // Rerender the realm-navbar-wide-logo when the browser detects color scheme changes.
    ui_util.listener_for_preferred_color_scheme_change(render);
}
```

--------------------------------------------------------------------------------

````

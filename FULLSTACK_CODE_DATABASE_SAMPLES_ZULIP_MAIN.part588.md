---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 588
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 588 of 1290)

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

---[FILE: bot_data.ts]---
Location: zulip-main/web/src/bot_data.ts
Signals: Zod

```typescript
import type * as z from "zod/mini";

import type {services_schema} from "./bot_types.ts";
import {server_add_bot_schema, server_update_bot_schema} from "./bot_types.ts";
import * as people from "./people.ts";
import type {StateData} from "./state_data.ts";

export type ServerUpdateBotData = z.infer<typeof server_update_bot_schema>;
export type ServerAddBotData = z.infer<typeof server_add_bot_schema>;
export type Bot = Omit<ServerAddBotData, "services">;

export type Services = z.infer<typeof services_schema>;

const bots = new Map<number, Bot>();
const services = new Map<number, Services>();

export function all_user_ids(): number[] {
    return [...bots.keys()];
}

export function add(bot_data: ServerAddBotData): void {
    // TODO/typescript: Move validation to the caller when
    // server_events_dispatch.js is converted to TypeScript.
    const {services: bot_services, ...clean_bot} = server_add_bot_schema.parse(bot_data);
    bots.set(clean_bot.user_id, clean_bot);

    services.set(clean_bot.user_id, bot_services);
}

export function del(bot_id: number): void {
    bots.delete(bot_id);
    services.delete(bot_id);
}

export function update(bot_id: number, bot_update: ServerUpdateBotData): void {
    const bot = bots.get(bot_id)!;
    // TODO/typescript: Move validation to the caller when
    // server_events_dispatch.js is converted to TypeScript.
    const {services: services_update, ...bot_update_rest} =
        server_update_bot_schema.parse(bot_update);

    Object.assign(bot, bot_update_rest);

    // We currently only support one service per bot.
    const service = services.get(bot_id)![0];
    if (service !== undefined && services_update !== undefined && services_update.length > 0) {
        Object.assign(service, services_update[0]);
    }
}

export function get_all_bots_for_current_user(): Bot[] {
    const ret = [];
    for (const bot of bots.values()) {
        if (bot.owner_id !== null && people.is_my_user_id(bot.owner_id)) {
            ret.push(bot);
        }
    }
    return ret;
}

export function get_all_bots_ids_for_current_user(): number[] {
    const ret = [];
    for (const bot of bots.values()) {
        if (bot.owner_id !== null && people.is_my_user_id(bot.owner_id)) {
            ret.push(bot.user_id);
        }
    }
    return ret;
}

export function get_all_bots_owned_by_user(user_id: number): Bot[] {
    const ret = [];
    for (const bot of bots.values()) {
        if (bot.owner_id === user_id && bot.is_active) {
            ret.push(bot);
        }
    }
    return ret;
}

export function get(bot_id: number): Bot | undefined {
    return bots.get(bot_id);
}

export function get_services(bot_id: number): Services | undefined {
    return services.get(bot_id);
}

export function initialize(params: StateData["bot"]): void {
    bots.clear();
    for (const bot of params.realm_bots) {
        add(bot);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: bot_helper.ts]---
Location: zulip-main/web/src/bot_helper.ts
Signals: Zod

```typescript
import ClipboardJS from "clipboard";
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as bot_data from "./bot_data.ts";
import * as channel from "./channel.ts";
import {show_copied_confirmation} from "./copied_tooltip.ts";
import {realm} from "./state_data.ts";

export function generate_zuliprc_url(bot_id: number): string {
    const bot = bot_data.get(bot_id);
    assert(bot !== undefined);
    const data = generate_zuliprc_content(bot);
    return encode_zuliprc_as_url(data);
}

export function encode_zuliprc_as_url(zuliprc: string): string {
    return "data:application/octet-stream;charset=utf-8," + encodeURIComponent(zuliprc);
}

export function generate_zuliprc_content(bot: {
    bot_type?: number;
    user_id: number;
    email: string;
    api_key: string;
}): string {
    let token;
    // For outgoing webhooks, include the token in the zuliprc.
    // It's needed for authenticating to the Botserver.
    if (bot.bot_type === 3) {
        const services = bot_data.get_services(bot.user_id);
        assert(services !== undefined);
        const service = services[0];
        assert(service && "token" in service);
        token = service.token;
    }
    return (
        "[api]" +
        "\nemail=" +
        bot.email +
        "\nkey=" +
        bot.api_key +
        "\nsite=" +
        realm.realm_url +
        (token === undefined ? "" : "\ntoken=" + token) +
        // Some tools would not work in files without a trailing new line.
        "\n"
    );
}

export function initialize_clipboard_handlers(): void {
    new ClipboardJS("#copy-api-key-button", {
        text(trigger) {
            const data = $(trigger).closest("span").attr("data-api-key") ?? "";
            return data;
        },
    }).on("success", (e) => {
        assert(e.trigger instanceof HTMLElement);
        show_copied_confirmation(e.trigger, {
            show_check_icon: true,
        });
    });

    new ClipboardJS("#copy-zuliprc-config", {
        text(trigger) {
            const $bot_info = $(trigger).closest("#bot-edit-form");
            const bot_id = Number.parseInt($bot_info.attr("data-user-id")!, 10);
            const bot = bot_data.get(bot_id);
            assert(bot !== undefined);
            const data = generate_zuliprc_content(bot);
            return data;
        },
    }).on("success", (e) => {
        assert(e.trigger instanceof HTMLElement);
        show_copied_confirmation(e.trigger, {
            show_check_icon: true,
        });
    });
}

export function initialize_bot_click_handlers(): void {
    $("body").on("click", "button.bot-modal-regenerate-bot-api-key", (e) => {
        e.preventDefault();
        const bot_id = Number.parseInt(
            $(e.currentTarget).closest("span").attr("data-user-id")!,
            10,
        );
        const $row = $(e.currentTarget).closest(".input-group");

        void channel.post({
            url: `/json/bots/${encodeURIComponent(bot_id)}/api_key/regenerate`,
            success(data) {
                const parsed_data = z
                    .object({
                        api_key: z.string(),
                    })
                    .parse(data);

                $row.find(".api-key").val(parsed_data.api_key);
                $row.find("span[data-api-key]").attr("data-api-key", parsed_data.api_key);
                $row.find(".bot-modal-api-key-error").hide();
            },
            error(xhr) {
                const parsed = z.object({msg: z.string()}).safeParse(xhr.responseJSON);
                if (parsed.success && parsed.data.msg) {
                    $row.find(".bot-modal-api-key-error").text(parsed.data.msg).show();
                }
            },
        });
    });

    $("body").on("click", "button.download-bot-zuliprc", function () {
        const $bot_info = $(this).closest("#bot-edit-form");
        const bot_id = Number.parseInt($bot_info.attr("data-user-id")!, 10);
        const bot_email = $bot_info.attr("data-email");

        // Select the <a> element by matching data-email.
        const $zuliprc_link = $(`.hidden-zuliprc-download[data-email="${bot_email}"]`);
        $zuliprc_link.attr("href", generate_zuliprc_url(bot_id));
        $zuliprc_link[0]?.click();
    });
}
```

--------------------------------------------------------------------------------

---[FILE: bot_types.ts]---
Location: zulip-main/web/src/bot_types.ts
Signals: Zod

```typescript
import * as z from "zod/mini";

const basic_bot_schema = z.object({
    api_key: z.string(),
    avatar_url: z.string(),
    bot_type: z.number(),
    default_all_public_streams: z.boolean(),
    default_events_register_stream: z.nullable(z.string()),
    default_sending_stream: z.nullable(z.string()),
    email: z.string(),
    full_name: z.string(),
    is_active: z.boolean(),
    owner_id: z.nullable(z.number()),
    user_id: z.number(),
});

const outgoing_service_schema = z.object({
    base_url: z.string(),
    interface: z.number(),
    token: z.string(),
});

const embedded_service_schema = z.object({
    config_data: z.record(z.string(), z.string()),
    service_name: z.string(),
});

export const services_schema = z.union([
    z.array(outgoing_service_schema),
    z.array(embedded_service_schema),
]);

export const server_update_bot_schema = z.object({
    ...z.partial(basic_bot_schema).shape,
    user_id: z.number(),
    services: z.optional(services_schema),
});

export const server_add_bot_schema = z.object({
    ...basic_bot_schema.shape,
    bot_type: z.number(),
    email: z.string(),
    is_active: z.boolean(),
    services: services_schema,
});
```

--------------------------------------------------------------------------------

---[FILE: browser_history.ts]---
Location: zulip-main/web/src/browser_history.ts
Signals: Zod

```typescript
// TODO: Rewrite this module to use window.history.pushState.
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import * as hash_parser from "./hash_parser.ts";
import * as ui_util from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";

export const state: {
    is_internal_change: boolean;
    hash_before_overlay: string | null | undefined;
    old_hash: string;
    changing_hash: boolean;
    spectator_old_hash: string | null;
} = {
    is_internal_change: false,
    hash_before_overlay: null,
    old_hash: window.location.hash,
    changing_hash: false,
    // If the spectator's hash changes to a restricted hash, then we store the old hash
    // so that we can take user back to the allowed hash.
    // TODO: Store #narrow old hashes. Currently they are not stored here since, the #narrow
    // hashes are changed without calling `hashchanged` in many ways.
    spectator_old_hash: hash_parser.is_spectator_compatible(window.location.hash)
        ? window.location.hash
        : null,
};

export function clear_for_testing(): void {
    state.is_internal_change = false;
    state.hash_before_overlay = null;
    state.old_hash = "#";
}

export function old_hash(): string {
    return state.old_hash;
}

export function set_hash_before_overlay(hash: string | undefined): void {
    state.hash_before_overlay = hash;
}

export function update_web_public_hash(hash: string): boolean {
    // Returns true if hash is web-public compatible.
    if (hash_parser.is_spectator_compatible(hash)) {
        state.spectator_old_hash = hash;
        return true;
    }
    return false;
}

export function save_old_hash(): boolean {
    state.old_hash = window.location.hash;

    const was_internal_change = state.is_internal_change;
    state.is_internal_change = false;

    return was_internal_change;
}

export let update = (new_hash: string): void => {
    const old_hash = window.location.hash;

    if (!new_hash.startsWith("#")) {
        blueslip.error("programming error: prefix hashes with #", {new_hash});
        return;
    }

    if (old_hash === new_hash) {
        // If somebody is calling us with the same hash we already have, it's
        // probably harmless, and we just ignore it.  But it could be a symptom
        // of disorganized code that's prone to an infinite loop of repeatedly
        // assigning the same hash.
        blueslip.info("ignoring probably-harmless call to browser_history.update: " + new_hash);
        return;
    }

    state.old_hash = old_hash;
    state.is_internal_change = true;
    window.location.hash = new_hash;
};

export function rewire_update(value: typeof update): void {
    update = value;
}

export function exit_overlay(): void {
    if (hash_parser.is_overlay_hash(window.location.hash) && !state.changing_hash) {
        ui_util.blur_active_element();
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const new_hash = state.hash_before_overlay || `#${user_settings.web_home_view}`;
        update(new_hash);
    }
}

export function go_to_location(hash: string): void {
    // Call this function when you WANT the hashchanged
    // function to run.
    window.location.hash = hash;
}

export function update_hash_internally_if_required(hash: string): void {
    if (window.location.hash !== hash) {
        update(hash);
    }
}

export function return_to_web_public_hash(): void {
    window.location.hash = state.spectator_old_hash ?? `#${user_settings.web_home_view}`;
}

export function get_full_url(hash: string): string {
    const location = window.location;

    if (!hash.startsWith("#") && hash !== "") {
        hash = "#" + hash;
    }

    // IE returns pathname as undefined and missing the leading /
    let pathname = location.pathname;
    if (pathname === undefined) {
        pathname = "/";
    } else if (pathname === "" || !pathname.startsWith("/")) {
        pathname = "/" + pathname;
    }

    // Build a full URL to not have same origin problems
    const url = location.protocol + "//" + location.host + pathname + hash;
    return url;
}

export function set_hash(hash: string): void {
    if (hash === window.location.hash) {
        // Avoid adding duplicate entries in browser history.
        return;
    }
    if (window.history.pushState) {
        const url = get_full_url(hash);
        try {
            window.history.pushState(null, "", url);
            update_web_public_hash(hash);
        } catch (error) {
            if (error instanceof TypeError) {
                // The window has been destroyed and the history object has been marked dead, so cannot
                // be updated.  Silently do nothing, since there's nothing we can do.
            } else {
                throw error;
            }
        }
    } else {
        // pushState has 97% global support according to caniuse. So, we will ideally never reach here.
        // TODO: Delete this case if we don't see any error reports in a while.
        if (hash === "" || hash === "#") {
            // Setting empty hash here would scroll to the top.
            hash = user_settings.web_home_view;
        }

        blueslip.error("browser does not support pushState");
        window.location.hash = hash;
    }
}

export const state_data_schema = z.object({
    narrow_pointer: z.optional(z.number()),
    narrow_offset: z.optional(z.number()),
    show_more_topics: z.optional(z.boolean()),
});

type StateData = z.infer<typeof state_data_schema>;

export function current_scroll_offset(): number | undefined {
    const current_state = z.nullable(state_data_schema).parse(window.history.state);
    return current_state?.narrow_offset;
}

export function update_current_history_state_data(
    new_data: StateData,
    url: string = window.location.href,
): void {
    // The optional url parameter is for those rare situations where
    // we want to adjust the URL without adding a new history entry.
    const current_state = z.nullable(state_data_schema).parse(window.history.state);
    const current_state_data = {
        narrow_pointer: current_state?.narrow_pointer,
        narrow_offset: current_state?.narrow_offset,
        show_more_topics: current_state?.show_more_topics,
    };
    const state_data = {...current_state_data, ...new_data};
    window.history.replaceState(state_data, "", url);
}

export function get_current_state_show_more_topics(): boolean | undefined {
    const current_state = z.nullable(state_data_schema).parse(window.history.state);
    return current_state?.show_more_topics;
}

export function get_home_view_hash(): string {
    let home_view_hash = `#${user_settings.web_home_view}`;
    if (home_view_hash === "#recent_topics") {
        home_view_hash = "#recent";
    }

    if (home_view_hash === "#all_messages") {
        home_view_hash = "#feed";
    }

    return home_view_hash;
}

export function is_current_hash_home_view(): boolean {
    const current_hash = window.location.hash;
    if (current_hash === "") {
        // Empty hash for home view is always valid.
        return true;
    }

    return current_hash === get_home_view_hash();
}
```

--------------------------------------------------------------------------------

---[FILE: buddy_data.ts]---
Location: zulip-main/web/src/buddy_data.ts

```typescript
import assert from "minimalistic-assert";

import * as hash_util from "./hash_util.ts";
import {$t} from "./i18n.ts";
import * as message_lists from "./message_lists.ts";
import * as muted_users from "./muted_users.ts";
import * as narrow_state from "./narrow_state.ts";
import {page_params} from "./page_params.ts";
import * as peer_data from "./peer_data.ts";
import * as people from "./people.ts";
import * as presence from "./presence.ts";
import * as stream_data from "./stream_data.ts";
import * as timerender from "./timerender.ts";
import * as unread from "./unread.ts";
import {user_settings} from "./user_settings.ts";
import * as user_status from "./user_status.ts";
import * as util from "./util.ts";

/*

   This is the main model code for building the buddy list.
   We also rely on presence.js to compute the actual presence
   for users.  We glue in other "people" data and do
   filtering/sorting of the data that we'll send into the view.

*/

export let max_size_before_shrinking = 600;

export function rewire_max_size_before_shrinking(value: typeof max_size_before_shrinking): void {
    max_size_before_shrinking = value;
}

export let max_channel_size_to_show_all_subscribers = 75;

export function rewire_max_channel_size_to_show_all_subscribers(
    value: typeof max_channel_size_to_show_all_subscribers,
): void {
    max_channel_size_to_show_all_subscribers = value;
}

let is_searching_users = false;

export function get_is_searching_users(): boolean {
    return is_searching_users;
}

export function set_is_searching_users(val: boolean): void {
    is_searching_users = val;
}

export function get_user_circle_class(user_id: number, use_deactivated_circle = false): string {
    if (use_deactivated_circle) {
        return "user-circle-deactivated";
    }

    const status = presence.get_status(user_id);

    switch (status) {
        case "active":
            return "user-circle-active";
        case "idle":
            return "user-circle-idle";
        default:
            return "user-circle-offline";
    }
}

export function level(user_id: number): number {
    // Put current user at the top, unless we're in a user search view.
    if (people.is_my_user_id(user_id) && !is_searching_users) {
        return 0;
    }

    const status = presence.get_status(user_id);

    switch (status) {
        case "active":
            return 1;
        case "idle":
            return 2;
        default:
            return 3;
    }
}

export let user_matches_narrow_using_loaded_data = (
    user_id: number,
    pm_ids: Set<number>,
    stream_id: number | undefined,
): boolean => {
    // All users we're checking should be subscribed, because we show all users
    // for small channels but fetch all users for small channels, and we only
    // show recently active users for large channels and we always fetch
    // recently active users.
    if (stream_id) {
        return stream_data.is_user_loaded_and_subscribed(stream_id, user_id);
    }
    if (pm_ids.size > 0) {
        return pm_ids.has(user_id) || people.is_my_user_id(user_id);
    }
    return false;
};

export function rewire_user_matches_narrow_using_loaded_data(
    value: typeof user_matches_narrow_using_loaded_data,
): void {
    user_matches_narrow_using_loaded_data = value;
}

export function compare_function(
    a: number,
    b: number,
    stream_id: number | undefined,
    pm_ids: Set<number>,
    conversation_participants: Set<number>,
): number {
    const a_is_participant = conversation_participants.has(a);
    const b_is_participant = conversation_participants.has(b);
    if (a_is_participant && !b_is_participant) {
        return -1;
    }
    if (!a_is_participant && b_is_participant) {
        return 1;
    }

    const a_would_receive_message = user_matches_narrow_using_loaded_data(a, pm_ids, stream_id);
    const b_would_receive_message = user_matches_narrow_using_loaded_data(b, pm_ids, stream_id);
    if (a_would_receive_message && !b_would_receive_message) {
        return -1;
    }
    if (!a_would_receive_message && b_would_receive_message) {
        return 1;
    }

    const level_a = level(a);
    const level_b = level(b);
    const diff = level_a - level_b;
    if (diff !== 0) {
        return diff;
    }

    // Sort equivalent direct message names alphabetically
    const person_a = people.maybe_get_user_by_id(a);
    const person_b = people.maybe_get_user_by_id(b);

    const full_name_a = person_a ? person_a.full_name : "";
    const full_name_b = person_b ? person_b.full_name : "";

    return util.strcmp(full_name_a, full_name_b);
}

export function sort_users(user_ids: number[], conversation_participants: Set<number>): number[] {
    // TODO sort by unread count first, once we support that
    const stream_id = narrow_state.stream_id(narrow_state.filter(), true);
    const pm_ids_set = narrow_state.pm_ids_set();
    user_ids.sort((a, b) =>
        compare_function(a, b, stream_id, pm_ids_set, conversation_participants),
    );
    return user_ids;
}

function get_num_unread(user_id: number): number {
    return unread.num_unread_for_user_ids_string(user_id.toString());
}

export function user_last_seen_time_status(
    user_id: number,
    missing_data_callback?: (user_id: number) => void,
): string {
    const status = presence.get_status(user_id);
    if (status === "active") {
        return $t({defaultMessage: "Active now"});
    }

    if (status === "idle") {
        // When we complete our presence API rewrite to have the data
        // plumbed, we may want to change this to also mention when
        // they were last active.
        return $t({defaultMessage: "Idle"});
    }

    const last_active_date = presence.last_active_date(user_id);
    if (last_active_date === undefined) {
        // There are situations where the client has incomplete presence
        // history on a user. This can happen when users are deactivated,
        // or when the user's last activity is older than what we fetch.
        assert(page_params.presence_history_limit_days_for_web_app === 365);

        if (missing_data_callback !== undefined) {
            missing_data_callback(user_id);
            return "";
        }
        return $t({defaultMessage: "Not active in the last year"});
    }
    return timerender.last_seen_status_from_date(last_active_date);
}

export type BuddyUserInfo = {
    href: string;
    name: string;
    user_id: number;
    profile_picture: string;
    status_emoji_info: user_status.UserStatusEmojiInfo | undefined;
    is_current_user: boolean;
    num_unread: number;
    user_circle_class: string;
    status_text: string | undefined;
    has_status_text: boolean;
    user_list_style: {
        COMPACT: boolean;
        WITH_STATUS: boolean;
        WITH_AVATAR: boolean;
    };
    should_add_guest_user_indicator: boolean;
    faded?: boolean;
};

export function info_for(user_id: number, direct_message_recipients: Set<number>): BuddyUserInfo {
    const is_deactivated = !people.is_person_active(user_id);
    const is_dm = direct_message_recipients.has(user_id);

    const user_circle_class = get_user_circle_class(user_id, is_deactivated && is_dm);
    const person = people.get_by_user_id(user_id);

    const status_emoji_info = user_status.get_status_emoji(user_id);
    const status_text = user_status.get_status_text(user_id);
    const user_list_style_value = user_settings.user_list_style;
    const user_list_style = {
        COMPACT: user_list_style_value === 1,
        WITH_STATUS: user_list_style_value === 2,
        WITH_AVATAR: user_list_style_value === 3,
    };

    return {
        href: hash_util.pm_with_url(person.user_id.toString()),
        name: person.full_name,
        user_id,
        status_emoji_info,
        profile_picture: people.small_avatar_url_for_person(person),
        is_current_user: people.is_my_user_id(user_id),
        num_unread: get_num_unread(user_id),
        user_circle_class,
        status_text,
        has_status_text: Boolean(status_text),
        user_list_style,
        should_add_guest_user_indicator: people.should_add_guest_user_indicator(user_id),
    };
}

export type TitleData = {
    first_line: string;
    second_line: string | undefined;
    third_line: string;
    show_you?: boolean;
    is_deactivated?: boolean;
};

export function get_title_data(
    user_ids_string: string,
    is_group: boolean,
    should_show_status: boolean,
): TitleData {
    if (is_group) {
        // For groups, just return a string with recipient names.
        return {
            first_line: people.format_recipients(user_ids_string, "long"),
            second_line: "",
            third_line: "",
        };
    }

    // Since it's not a group, user_ids_string is a single user ID.
    const user_id = Number.parseInt(user_ids_string, 10);
    const person = people.get_by_user_id(user_id);
    const is_deactivated = !people.is_person_active(user_id);

    if (person.is_bot) {
        const bot_owner = people.get_bot_owner_user(person);

        if (bot_owner) {
            const bot_owner_name = $t(
                {defaultMessage: "Owner: {name}"},
                {name: bot_owner.full_name},
            );

            return {
                first_line: person.full_name,
                second_line: bot_owner_name,
                third_line: is_deactivated
                    ? $t({defaultMessage: "This bot has been deactivated."})
                    : "",
                is_deactivated,
            };
        }

        // Bot does not have an owner.
        return {
            first_line: person.full_name,
            second_line: "",
            third_line: "",
        };
    }

    // For buddy list and individual direct messages.
    // Since is_group=False, it's a single, human user.
    const last_seen = user_last_seen_time_status(user_id);
    const is_my_user = people.is_my_user_id(user_id);

    if (is_deactivated) {
        return {
            first_line: person.full_name,
            second_line: $t({defaultMessage: "This user has been deactivated."}),
            third_line: "",
            show_you: is_my_user,
            is_deactivated,
        };
    }

    // Users has a status.
    if (user_status.get_status_text(user_id)) {
        return {
            first_line: person.full_name,
            second_line: should_show_status ? user_status.get_status_text(user_id) : "",
            third_line: last_seen,
            show_you: is_my_user,
        };
    }

    // Users does not have a status.
    return {
        first_line: person.full_name,
        second_line: last_seen,
        third_line: "",
        show_you: is_my_user,
    };
}

export function get_items_for_users(user_ids: number[]): BuddyUserInfo[] {
    const direct_message_recipients = narrow_state.pm_ids_set();
    const user_info = user_ids.map((user_id) => info_for(user_id, direct_message_recipients));
    return user_info;
}

function user_is_recently_active(user_id: number): boolean {
    // return true if the user has a green/orange circle
    return level(user_id) <= 2;
}

function maybe_shrink_list(
    user_ids: number[],
    user_filter_text: string,
    conversation_participants: Set<number>,
): number[] {
    if (user_ids.length <= max_size_before_shrinking) {
        return user_ids;
    }

    if (user_filter_text) {
        // If the user types something, we want to show all
        // users matching the text, even if they have not been
        // online recently.
        // For super common letters like "s", we may
        // eventually want to filter down to only users that
        // are in presence.get_user_ids().
        return user_ids;
    }

    // We want to always show PM recipients even if they're inactive.
    const pm_ids_set = narrow_state.pm_ids_set();
    const stream_id = narrow_state.stream_id(narrow_state.filter(), true);
    const filter_by_stream_id =
        stream_id &&
        peer_data.get_subscriber_count(stream_id) <= max_channel_size_to_show_all_subscribers;

    user_ids = user_ids.filter(
        (user_id) =>
            user_is_recently_active(user_id) ||
            user_matches_narrow_using_loaded_data(
                user_id,
                pm_ids_set,
                filter_by_stream_id ? stream_id : undefined,
            ) ||
            conversation_participants.has(user_id),
    );

    return user_ids;
}

function filter_user_ids(user_filter_text: string, user_ids: number[]): number[] {
    // This first filter is for whether the user is eligible to be
    // displayed in the right sidebar at all.
    const direct_message_recipients = narrow_state.pm_ids_set();
    user_ids = user_ids.filter((user_id) => {
        const person = people.maybe_get_user_by_id(user_id, true);

        if (!person) {
            // See the comments in presence.set_info for details, but this is an expected race.
            // User IDs for whom we have presence but no user metadata should be skipped.
            return false;
        }

        if (person.is_bot) {
            // Bots should never appear in the right sidebar.  This
            // case should never happen, since bots cannot have
            // presence data.
            return false;
        }

        const is_dm = direct_message_recipients.has(user_id);
        if (!people.is_person_active(user_id) && !is_dm) {
            // Deactivated users are hidden in the buddy list except in DM narrows.
            return false;
        }

        if (muted_users.is_user_muted(user_id)) {
            // Muted users are hidden from the right sidebar entirely.
            return false;
        }

        return true;
    });

    if (!user_filter_text) {
        return user_ids;
    }

    // If a query is present in "Filter users", we return matches.
    const persons = user_ids.map((user_id) => people.get_by_user_id(user_id));
    return [...people.filter_people_by_search_terms(persons, user_filter_text)];
}

function get_filtered_user_id_list(
    user_filter_text: string,
    conversation_participants: Set<number>,
): number[] {
    let base_user_id_list = [];

    if (user_filter_text) {
        // If there's a filter, select from all users, not just those
        // recently active.
        base_user_id_list = people.get_active_user_ids();
    } else {
        // From large realms, the user_ids in presence may exclude
        // users who have been idle more than three weeks.  When the
        // filter text is blank, we show only those recently active users.
        base_user_id_list = presence.get_user_ids();

        // Always include ourselves, even if we're "unavailable".
        const my_user_id = people.my_current_user_id();
        if (!base_user_id_list.includes(my_user_id)) {
            base_user_id_list = [my_user_id, ...base_user_id_list];
        }

        // We want to always show PM recipients even if they're inactive.
        const pm_ids_set = narrow_state.pm_ids_set();
        if (pm_ids_set.size > 0) {
            const base_user_id_set = new Set([...base_user_id_list, ...pm_ids_set]);
            base_user_id_list = [...base_user_id_set];
        }

        // We want to show subscribers even if they're inactive, if there are few
        // enough subscribers in the channel.
        const stream_id = narrow_state.stream_id(narrow_state.filter(), true);
        if (stream_id) {
            const subscriber_count = peer_data.get_subscriber_count(stream_id);
            if (subscriber_count <= max_channel_size_to_show_all_subscribers) {
                // We can know these are all loaded because we fetch all subscribers
                // for small channels, and max_channel_size_to_show_all_subscribers
                // is less than MIN_PARTIAL_SUBSCRIBERS_CHANNEL_SIZE.
                const subscribers = peer_data.get_subscriber_ids_assert_loaded(stream_id);
                const base_user_id_set = new Set([...base_user_id_list, ...subscribers]);
                base_user_id_list = [...base_user_id_set];
            }
        }
    }

    // Make sure all the participants are in the list, even if they're inactive.
    const user_ids_set = new Set([...base_user_id_list, ...conversation_participants]);
    return filter_user_ids(user_filter_text, [...user_ids_set]);
}
// get participants of the current viewed conversation.
export function get_conversation_participants_callback(): () => Set<number> {
    return () => {
        if (
            !narrow_state.stream_id() ||
            narrow_state.topic() === undefined ||
            !message_lists.current
        ) {
            return new Set<number>();
        }
        return message_lists.current.data.participants.visible();
    };
}

export function get_filtered_and_sorted_user_ids(user_filter_text: string): number[] {
    let user_ids;
    const conversation_participants = get_conversation_participants_callback()();
    user_ids = get_filtered_user_id_list(user_filter_text, conversation_participants);
    user_ids = maybe_shrink_list(user_ids, user_filter_text, conversation_participants);
    return sort_users(user_ids, conversation_participants);
}

export function matches_filter(user_filter_text: string, user_id: number): boolean {
    // This is a roundabout way of checking a user if you look
    // too hard at it, but it should be fine for now.
    return filter_user_ids(user_filter_text, [user_id]).length === 1;
}
```

--------------------------------------------------------------------------------

````

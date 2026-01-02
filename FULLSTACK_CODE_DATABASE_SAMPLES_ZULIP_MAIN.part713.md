---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 713
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 713 of 1290)

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

---[FILE: user_group_popover.ts]---
Location: zulip-main/web/src/user_group_popover.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_user_group_info_popover from "../templates/popovers/user_group_info_popover.hbs";

import * as blueslip from "./blueslip.ts";
import * as buddy_data from "./buddy_data.ts";
import * as hash_util from "./hash_util.ts";
import * as message_lists from "./message_lists.ts";
import * as mouse_drag from "./mouse_drag.ts";
import * as people from "./people.ts";
import type {User} from "./people.ts";
import * as popover_menus from "./popover_menus.ts";
import * as rows from "./rows.ts";
import * as settings_data from "./settings_data.ts";
import {current_user} from "./state_data.ts";
import * as ui_util from "./ui_util.ts";
import * as user_group_components from "./user_group_components.ts";
import * as user_groups from "./user_groups.ts";
import * as util from "./util.ts";

const MAX_ROWS_IN_POPOVER = 30;
let user_group_popover_instance: tippy.Instance | undefined;

type PopoverGroupMember = User & {user_circle_class: string; user_last_seen_time_status: string};

export function hide(): void {
    if (user_group_popover_instance !== undefined) {
        user_group_popover_instance.destroy();
        user_group_popover_instance = undefined;
    }
}

export function is_open(): boolean {
    return Boolean(user_group_popover_instance);
}

function get_user_group_popover_items(): JQuery | undefined {
    if (user_group_popover_instance === undefined) {
        blueslip.error("Trying to get menu items when user group popover is closed.");
        return undefined;
    }

    const $popover = $(user_group_popover_instance.popper);
    if (!$popover) {
        blueslip.error("Cannot find user group popover data");
        return undefined;
    }

    return $("li:not(.divider) a", $popover);
}

export function handle_keyboard(key: string): void {
    const $items = get_user_group_popover_items();
    popover_menus.popover_items_handle_keyboard(key, $items);
}

// element is the target element to pop off of;
// the element could be user group pill or mentions in a message;
// in case of message, message_id is the message id containing it;
// in case of user group pill, message_id is not used;
export function toggle_user_group_info_popover(
    element: tippy.ReferenceElement,
    message_id: number | undefined,
): void {
    if (is_open()) {
        hide();
        return;
    }
    const $elt = $(element);
    const user_group_id_str = $elt.attr("data-user-group-id");
    assert(user_group_id_str !== undefined);

    const user_group_id = Number.parseInt(user_group_id_str, 10);
    const group = user_groups.get_user_group_from_id(user_group_id);

    popover_menus.toggle_popover_menu(
        element,
        {
            theme: "popover-menu",
            placement: "right",
            popperOptions: {
                modifiers: [
                    {
                        name: "flip",
                        options: {
                            fallbackPlacements: ["left", "top", "bottom"],
                        },
                    },
                ],
            },
            onCreate(instance) {
                if (message_id) {
                    assert(message_lists.current !== undefined);
                    message_lists.current.select_id(message_id);
                }
                user_group_popover_instance = instance;
                const subgroups = user_groups.convert_name_to_display_name_for_groups(
                    user_groups
                        .get_direct_subgroups_of_group(group)
                        .toSorted(user_group_components.sort_group_member_name),
                );
                const members = sort_group_members(fetch_group_members([...group.members]));
                const all_individual_members = [...user_groups.get_recursive_group_members(group)];
                const has_bots =
                    group.is_system_group &&
                    all_individual_members.some((member_id) => {
                        const member = people.get_user_by_id_assert_valid(member_id);
                        return people.is_active_user_for_popover(member.user_id) && member.is_bot;
                    });
                const displayed_subgroups = subgroups.slice(0, MAX_ROWS_IN_POPOVER);
                const displayed_members =
                    subgroups.length < MAX_ROWS_IN_POPOVER
                        ? members.slice(0, MAX_ROWS_IN_POPOVER - subgroups.length)
                        : [];
                const display_all_subgroups_and_members =
                    subgroups.length + members.length <= MAX_ROWS_IN_POPOVER;
                const args = {
                    group_name: user_groups.get_display_group_name(group.name),
                    group_description: group.description,
                    group_edit_url: hash_util.group_edit_url(group, "general"),
                    is_guest: current_user.is_guest,
                    is_system_group: group.is_system_group,
                    deactivated: group.deactivated,
                    members_count: all_individual_members.length,
                    group_members_url: hash_util.group_edit_url(group, "members"),
                    display_all_subgroups_and_members,
                    has_bots,
                    user_can_access_all_other_users:
                        settings_data.user_can_access_all_other_users(),
                    displayed_subgroups,
                    displayed_members,
                };
                instance.setContent(ui_util.parse_html(render_user_group_info_popover(args)));
            },
            onHidden() {
                hide();
            },
        },
        {
            show_as_overlay_on_mobile: true,
            show_as_overlay_always: false,
        },
    );
}

export function register_click_handlers(): void {
    $("#main_div").on("click", ".user-group-mention", function (this: HTMLElement, e) {
        e.stopPropagation();
        if (mouse_drag.is_drag(e)) {
            return;
        }

        const $elt = $(this);
        const $row = $elt.closest(".message_row");
        const message_id = rows.id($row);

        assert(message_lists.current !== undefined);
        const message = message_lists.current.get(message_id);
        assert(message !== undefined);

        try {
            toggle_user_group_info_popover(this, message.id);
        } catch {
            // This user group has likely been deleted.
            blueslip.info("Unable to find user group in message" + message.sender_id);
        }
    });

    // Show the user_group_popover when pill clicked in subscriber settings.
    $("body").on(
        "click",
        ".person_picker .pill[data-user-group-id]",
        function (this: HTMLElement, e) {
            e.stopPropagation();
            toggle_user_group_info_popover(this, undefined);
        },
    );

    // Show the user_group_popover in user invite section.
    $("body").on(
        "click",
        "#invite-user-group-container .pill-container .pill",
        function (this: HTMLElement, e) {
            e.stopPropagation();
            toggle_user_group_info_popover(this, undefined);
        },
    );
    // Note: Message feeds and drafts have their own direct event listeners
    // that run before this one and call stopPropagation.
    $("body").on("click", ".messagebox .user-group-mention", function (this: HTMLElement, e) {
        e.stopPropagation();
        if (mouse_drag.is_drag(e)) {
            return;
        }
        toggle_user_group_info_popover(this, undefined);
    });

    $("body").on("click", ".view_user_group", function (this: HTMLElement, e) {
        e.stopPropagation();
        toggle_user_group_info_popover(this, undefined);
    });
}

function fetch_group_members(member_ids: number[]): PopoverGroupMember[] {
    return (
        member_ids
            .map((m: number) => people.get_user_by_id_assert_valid(m))
            // Only include users that the current user is allowed to see in the popover.
            // Inaccessible or unknown users should not appear in displayed_members.
            .filter(
                (m: User) =>
                    people.is_active_user_for_popover(m.user_id) && !m.is_inaccessible_user,
            )
            .map((p: User) => ({
                ...p,
                user_circle_class: buddy_data.get_user_circle_class(p.user_id),
                user_last_seen_time_status: buddy_data.user_last_seen_time_status(p.user_id),
            }))
    );
}

function sort_group_members(members: PopoverGroupMember[]): PopoverGroupMember[] {
    return members.toSorted((a: PopoverGroupMember, b: PopoverGroupMember) =>
        util.strcmp(a.full_name, b.full_name),
    );
}

// exporting these functions for testing purposes
export const _test_fetch_group_members = fetch_group_members;

export const _test_sort_group_members = sort_group_members;

export function initialize(): void {
    register_click_handlers();
}
```

--------------------------------------------------------------------------------

---[FILE: user_pill.ts]---
Location: zulip-main/web/src/user_pill.ts

```typescript
import assert from "minimalistic-assert";

import render_input_pill from "../templates/input_pill.hbs";

import * as blueslip from "./blueslip.ts";
import type {EmojiRenderingDetails} from "./emoji.ts";
import * as group_permission_settings from "./group_permission_settings.ts";
import type {InputPillConfig, InputPillContainer} from "./input_pill.ts";
import * as input_pill from "./input_pill.ts";
import type {User} from "./people.ts";
import * as people from "./people.ts";
import type {
    CombinedPill,
    CombinedPillContainer,
    GroupSettingPillContainer,
} from "./typeahead_helper.ts";
import * as user_status from "./user_status.ts";

// This will be used for pills for things like composing
// direct messages or adding users to a stream/group.

export type UserPill = {
    type: "user";
    user_id: number;
    email: string;
    full_name: string;
    img_src?: string;
    deactivated?: boolean;
    status_emoji_info?: (EmojiRenderingDetails & {emoji_alt_code?: boolean}) | undefined; // TODO: Move this in user_status.js
    should_add_guest_user_indicator?: boolean;
    is_bot?: boolean;
};

export type UserPillWidget = InputPillContainer<UserPill>;

export type UserPillData = {type: "user"; user: User};

export function create_item_from_user_id(
    user_id: string,
    current_items: CombinedPill[],
    pill_config?: InputPillConfig,
): UserPill | undefined {
    const user = people.maybe_get_user_by_id(Number(user_id), true);
    if (!user) {
        return undefined;
    }

    if (pill_config?.exclude_inaccessible_users && user.is_inaccessible_user) {
        return undefined;
    }

    if (current_items.some((item) => item.type === "user" && item.user_id === user.user_id)) {
        return undefined;
    }

    const avatar_url = people.small_avatar_url_for_person(user);

    const status_emoji_info = user_status.get_status_emoji(user.user_id);

    const item: UserPill = {
        type: "user",
        full_name: user.full_name,
        user_id: user.user_id,
        email: user.email,
        img_src: avatar_url,
        deactivated: false,
        status_emoji_info,
        should_add_guest_user_indicator: people.should_add_guest_user_indicator(user.user_id),
        is_bot: user.is_bot,
    };

    // We pass deactivated true for a deactivated user
    //
    // We consider inaccessible users as active to avoid
    // falsely showing the user as deactivated as we do
    // not have any information about whether they are
    // active or not.
    if (!people.is_person_active(user.user_id) && !user.is_inaccessible_user) {
        item.deactivated = true;
    }

    return item;
}

export function get_unique_full_name_from_item(item: UserPill): string {
    return people.get_unique_full_name(item.full_name, item.user_id);
}

export function append_person(
    opts: {
        person: User;
        pill_widget: UserPillWidget | CombinedPillContainer | GroupSettingPillContainer;
    },
    execute_oncreate_callback = true,
): void {
    const person = opts.person;
    const pill_widget = opts.pill_widget;
    const avatar_url = people.small_avatar_url_for_person(person);
    const status_emoji_info = user_status.get_status_emoji(opts.person.user_id);

    const pill_data: UserPill = {
        type: "user",
        full_name: person.full_name,
        user_id: person.user_id,
        email: person.email,
        img_src: avatar_url,
        status_emoji_info,
        should_add_guest_user_indicator: people.should_add_guest_user_indicator(person.user_id),
        is_bot: person.is_bot,
    };

    pill_widget.appendValidatedData(pill_data, false, !execute_oncreate_callback);
    pill_widget.clear_text();
}

export function get_user_ids(
    pill_widget: UserPillWidget | CombinedPillContainer | GroupSettingPillContainer,
): number[] {
    const items = pill_widget.items();
    return items.flatMap((item) => (item.type === "user" ? item.user_id : []));
}

export function has_unconverted_data(pill_widget: UserPillWidget): boolean {
    // This returns true if we have text that hasn't been
    // turned into pills.
    if (pill_widget.is_pending()) {
        return true;
    }

    const items = pill_widget.items();
    const has_unknown_items = items.some((item) => item.user_id === undefined);

    return has_unknown_items;
}

export function typeahead_source(
    pill_widget: UserPillWidget | CombinedPillContainer | GroupSettingPillContainer,
    exclude_bots?: boolean,
    setting_name?: string,
    setting_type?: "realm" | "stream" | "group",
): UserPillData[] {
    let users = exclude_bots ? people.get_realm_active_human_users() : people.get_realm_users();
    if (setting_name !== undefined) {
        assert(setting_type !== undefined);
        const group_setting_config = group_permission_settings.get_group_permission_setting_config(
            setting_name,
            setting_type,
        );
        assert(group_setting_config !== undefined);
        if (!group_setting_config.allow_everyone_group) {
            users = users.filter((user) => !user.is_guest);
        }
    }
    return filter_taken_users(users, pill_widget).map((user) => ({type: "user", user}));
}

export function filter_taken_users(
    items: User[],
    pill_widget: UserPillWidget | CombinedPillContainer | GroupSettingPillContainer,
): User[] {
    const taken_user_ids = get_user_ids(pill_widget);
    items = items.filter((item) => !taken_user_ids.includes(item.user_id));
    return items;
}

export function append_user(
    user: User,
    pills: UserPillWidget | CombinedPillContainer | GroupSettingPillContainer,
    execute_oncreate_callback = true,
): void {
    if (user) {
        append_person(
            {
                pill_widget: pills,
                person: user,
            },
            execute_oncreate_callback,
        );
    } else {
        blueslip.warn("Undefined user in function append_user");
    }
}

export function get_display_value_from_item(item: UserPill): string {
    return item.full_name ?? item.email;
}

export function generate_pill_html(item: UserPill, show_user_status_emoji = false): string {
    let status_emoji_info;
    let has_status;
    if (show_user_status_emoji) {
        has_status = item.status_emoji_info !== undefined;
        if (has_status) {
            status_emoji_info = item.status_emoji_info;
        }
    }
    return render_input_pill({
        display_value: get_display_value_from_item(item),
        has_image: item.img_src !== undefined,
        deactivated: item.deactivated,
        should_add_guest_user_indicator: item.should_add_guest_user_indicator,
        user_id: item.user_id,
        img_src: item.img_src,
        has_status,
        status_emoji_info,
        is_bot: item.is_bot,
    });
}

export function create_pills(
    $pill_container: JQuery,
    pill_config?: InputPillConfig,
): input_pill.InputPillContainer<UserPill> {
    const pills = input_pill.create({
        $container: $pill_container,
        pill_config,
        create_item_from_text: create_item_from_user_id,
        get_text_from_item: get_unique_full_name_from_item,
        get_display_value_from_item,
        generate_pill_html,
    });
    return pills;
}
```

--------------------------------------------------------------------------------

````

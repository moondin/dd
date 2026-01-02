---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 709
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 709 of 1290)

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

---[FILE: user_deactivation_ui.ts]---
Location: zulip-main/web/src/user_deactivation_ui.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import render_settings_deactivation_bot_modal from "../templates/confirm_dialog/confirm_deactivate_bot.hbs";
import render_confirm_deactivate_own_user from "../templates/confirm_dialog/confirm_deactivate_own_user.hbs";
import render_settings_deactivation_user_modal from "../templates/confirm_dialog/confirm_deactivate_user.hbs";
import render_settings_reactivation_bot_modal from "../templates/confirm_dialog/confirm_reactivate_bot.hbs";
import render_settings_reactivation_user_modal from "../templates/confirm_dialog/confirm_reactivate_user.hbs";

import * as bot_data from "./bot_data.ts";
import * as channel from "./channel.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t_html} from "./i18n.ts";
import * as people from "./people.ts";
import {invite_schema} from "./settings_invites.ts";
import {current_user, realm} from "./state_data.ts";

export function confirm_deactivation(
    user_id: number,
    handle_confirm: () => void,
    loading_spinner: boolean,
): void {
    if (user_id === current_user.user_id) {
        const html_body = render_confirm_deactivate_own_user();
        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Deactivate your account"}),
            html_body,
            on_click: handle_confirm,
            help_link: "/help/deactivate-your-account",
            loading_spinner,
        });
        return;
    }

    // Knowing the number of invites requires making this request. If the request fails,
    // we won't have the accurate number of invites. So, we don't show the modal if the
    // request fails.
    void channel.get({
        url: "/json/invites",
        timeout: 10 * 1000,
        success(raw_data) {
            const data = z.object({invites: z.array(invite_schema)}).parse(raw_data);

            let number_of_invites_by_user = 0;
            for (const invite of data.invites) {
                if (invite.invited_by_user_id === user_id) {
                    number_of_invites_by_user = number_of_invites_by_user + 1;
                }
            }

            const bots_owned_by_user = bot_data.get_all_bots_owned_by_user(user_id);
            const user = people.get_by_user_id(user_id);
            const realm_url = realm.realm_url;
            const realm_name = realm.realm_name;
            const opts = {
                username: user.full_name,
                email: user.delivery_email,
                bots_owned_by_user,
                number_of_invites_by_user,
                admin_email: people.my_current_email(),
                realm_url,
                realm_name,
            };
            const html_body = render_settings_deactivation_user_modal(opts);

            function set_email_field_visibility(dialog_widget_id: string): void {
                const $modal = $(`#${CSS.escape(dialog_widget_id)}`);
                const $send_email_checkbox = $modal.find(".send_email");
                const $email_field = $modal.find(".email_field");

                $email_field.hide();
                $send_email_checkbox.on("change", () => {
                    if ($send_email_checkbox.is(":checked")) {
                        $email_field.show();
                    } else {
                        $email_field.hide();
                    }
                });
            }

            dialog_widget.launch({
                html_heading: $t_html(
                    {defaultMessage: "Deactivate {name}?"},
                    {name: user.full_name},
                ),
                help_link: "/help/deactivate-or-reactivate-a-user#deactivating-a-user",
                html_body,
                html_submit_button: $t_html({defaultMessage: "Deactivate"}),
                id: "deactivate-user-modal",
                on_click: handle_confirm,
                post_render: set_email_field_visibility,
                loading_spinner,
                focus_submit_on_open: true,
            });
        },
    });
}

export function confirm_bot_deactivation(
    bot_id: number,
    handle_confirm: () => void,
    loading_spinner: boolean,
): void {
    const bot = people.get_by_user_id(bot_id);
    const html_body = render_settings_deactivation_bot_modal();

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Deactivate {name}?"}, {name: bot.full_name}),
        help_link: "/help/deactivate-or-reactivate-a-bot",
        html_body,
        html_submit_button: $t_html({defaultMessage: "Deactivate"}),
        on_click: handle_confirm,
        loading_spinner,
    });
}

export function confirm_reactivation(
    user_id: number,
    handle_confirm: () => void,
    loading_spinner: boolean,
): void {
    const user = people.get_by_user_id(user_id);
    const opts: {
        username: string;
        original_owner_deactivated?: boolean;
        owner_name?: string;
    } = {
        username: user.full_name,
    };

    let html_body;
    // check if bot or human
    if (user.is_bot) {
        if (user.bot_owner_id !== null && !people.is_person_active(user.bot_owner_id)) {
            opts.original_owner_deactivated = true;
            opts.owner_name = people.get_by_user_id(user.bot_owner_id).full_name;
        } else {
            opts.original_owner_deactivated = false;
        }
        html_body = render_settings_reactivation_bot_modal(opts);
    } else {
        html_body = render_settings_reactivation_user_modal(opts);
    }

    confirm_dialog.launch({
        html_heading: $t_html({defaultMessage: "Reactivate {name}"}, {name: user.full_name}),
        help_link: "/help/deactivate-or-reactivate-a-user#reactivating-a-user",
        html_body,
        on_click: handle_confirm,
        loading_spinner,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: user_events.ts]---
Location: zulip-main/web/src/user_events.ts
Signals: Zod

```typescript
// This module is kind of small, but it will help us keep
// server_events.js simple while breaking some circular
// dependencies that existed when this code was in people.js.
// (We should do bot updates here too.)
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as activity_ui from "./activity_ui.ts";
import * as blueslip from "./blueslip.ts";
import {buddy_list} from "./buddy_list.ts";
import * as compose_state from "./compose_state.ts";
import * as message_live_update from "./message_live_update.ts";
import * as narrow_state from "./narrow_state.ts";
import * as navbar_alerts from "./navbar_alerts.ts";
import * as people from "./people.ts";
import * as pm_list from "./pm_list.ts";
import * as settings from "./settings.ts";
import * as settings_account from "./settings_account.ts";
import * as settings_bots from "./settings_bots.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_exports from "./settings_exports.ts";
import * as settings_linkifiers from "./settings_linkifiers.ts";
import * as settings_org from "./settings_org.ts";
import * as settings_profile_fields from "./settings_profile_fields.ts";
import * as settings_realm_user_settings_defaults from "./settings_realm_user_settings_defaults.ts";
import * as settings_streams from "./settings_streams.ts";
import * as settings_users from "./settings_users.ts";
import {current_user, realm} from "./state_data.ts";
import * as stream_events from "./stream_events.ts";
import * as user_group_edit from "./user_group_edit.ts";
import * as user_profile from "./user_profile.ts";

export const user_update_schema = z.intersection(
    z.object({user_id: z.number()}),
    z.union([
        z.object({
            avatar_source: z.string(),
            avatar_url: z.nullable(z.string()),
            avatar_url_medium: z.nullable(z.string()),
            avatar_version: z.number(),
        }),
        z.object({bot_owner_id: z.number()}),
        z.object({
            custom_profile_field: z.object({
                id: z.number(),
                value: z.nullable(z.string()),
                rendered_value: z.optional(z.string()),
            }),
        }),
        z.object({delivery_email: z.nullable(z.string())}),
        z.object({new_email: z.string()}),
        z.object({full_name: z.string()}),
        z.object({role: z.number()}),
        z.object({email: z.string(), timezone: z.string()}),
        z.object({is_active: z.boolean()}),
    ]),
);

type UserUpdate = z.output<typeof user_update_schema>;

export const update_person = function update(event: UserUpdate): void {
    const user = people.maybe_get_user_by_id(event.user_id);

    if (!user) {
        blueslip.error("Got update_person event for unexpected user", {user_id: event.user_id});
        return;
    }

    if ("new_email" in event) {
        const user_id = event.user_id;
        const new_email = event.new_email;

        people.update_email(user_id, new_email);
        narrow_state.update_email(user_id, new_email);
        compose_state.update_email(user_id, new_email);

        if (people.is_my_user_id(event.user_id)) {
            current_user.email = new_email;
        }
    }

    if ("delivery_email" in event) {
        const delivery_email = event.delivery_email;
        user.delivery_email = delivery_email;
        user_profile.update_profile_modal_ui(user, event);
        if (people.is_my_user_id(event.user_id)) {
            assert(delivery_email !== null);
            settings_account.update_email(delivery_email);
            current_user.delivery_email = delivery_email;
            settings_account.hide_confirm_email_banner();
        }
    }

    if ("full_name" in event) {
        people.set_full_name(user, event.full_name);

        settings_users.update_user_data(event.user_id, event);
        activity_ui.redraw();
        message_live_update.update_user_full_name(event.user_id, event.full_name);
        pm_list.update_private_messages();
        user_profile.update_profile_modal_ui(user, event);
        if (people.is_my_user_id(event.user_id)) {
            current_user.full_name = event.full_name;
            settings_account.update_full_name(event.full_name);
        }
    }

    if ("role" in event) {
        const was_owner = user.is_owner;
        user.role = event.role;
        user.is_owner = event.role === settings_config.user_role_values.owner.code;
        user.is_admin = event.role === settings_config.user_role_values.admin.code || user.is_owner;
        user.is_guest = event.role === settings_config.user_role_values.guest.code;
        user.is_moderator =
            user.is_admin || event.role === settings_config.user_role_values.moderator.code;
        settings_users.update_user_data(event.user_id, event);
        user_profile.update_profile_modal_ui(user, event);
        settings_account.set_user_own_role_dropdown_value();

        if (people.is_my_user_id(event.user_id)) {
            settings_account.update_role_text();
        }

        if (people.is_my_user_id(event.user_id) && current_user.is_owner !== user.is_owner) {
            current_user.is_owner = user.is_owner;
            settings_org.maybe_disable_widgets();
            settings_org.enable_or_disable_group_permission_settings();
            settings.update_lock_icon_in_sidebar();
            settings_account.add_or_remove_owner_from_role_dropdown();
            settings_account.update_user_own_role_dropdown_state();
        }

        if (people.is_my_user_id(event.user_id) && current_user.is_admin !== user.is_admin) {
            current_user.is_admin = user.is_admin;
            settings_linkifiers.maybe_disable_widgets();
            settings_org.maybe_disable_widgets();
            settings_org.enable_or_disable_group_permission_settings();
            settings_profile_fields.maybe_disable_widgets();
            settings_streams.maybe_disable_widgets();
            settings_realm_user_settings_defaults.maybe_disable_widgets();
            settings_account.update_account_settings_display();
            settings.update_lock_icon_in_sidebar();
            settings_account.update_user_own_role_dropdown_state();
        }

        if (
            !people.is_my_user_id(event.user_id) &&
            was_owner !== user.is_owner &&
            current_user.is_owner
        ) {
            settings_account.update_user_own_role_dropdown_state();
        }

        if (
            people.is_my_user_id(event.user_id) &&
            current_user.is_moderator !== user.is_moderator
        ) {
            current_user.is_moderator = user.is_moderator;
        }
    }

    if ("avatar_url" in event) {
        const url = event.avatar_url;
        user.avatar_url = url;
        user.avatar_version = event.avatar_version;

        if (people.is_my_user_id(event.user_id)) {
            current_user.avatar_source = event.avatar_source;
            current_user.avatar_url = url;
            current_user.avatar_url_medium = event.avatar_url_medium;
            $("#user-avatar-upload-widget .image-block").attr("src", event.avatar_url_medium);
            $("#personal-menu-dropdown .avatar-image, .header-button-avatar-image").attr(
                "src",
                `${event.avatar_url_medium}`,
            );
        }

        message_live_update.update_avatar(user.user_id, event.avatar_url);
        user_profile.update_profile_modal_ui(user, event);
    }

    if ("custom_profile_field" in event) {
        people.set_custom_profile_field_data(event.user_id, event.custom_profile_field);
        user_profile.update_user_custom_profile_fields(user);
        if (event.user_id === people.my_current_user_id()) {
            navbar_alerts.maybe_toggle_empty_required_profile_fields_banner();

            const field_id = event.custom_profile_field.id;
            const field_value = people.get_custom_profile_data(event.user_id, field_id)?.value;
            const is_field_required = realm.custom_profile_fields?.find(
                (f) => field_id === f.id,
            )?.required;
            if (is_field_required) {
                const $custom_user_field = $(
                    `.profile-settings-form .custom_user_field[data-field-id="${CSS.escape(`${field_id}`)}"]`,
                );
                const $field = $custom_user_field.find(".settings-profile-user-field");
                const $required_symbol = $custom_user_field.find(".required-symbol");
                if (!field_value) {
                    if (!$field.hasClass("empty-required-field")) {
                        $field.addClass("empty-required-field");
                        $required_symbol.removeClass("hidden");
                    }
                } else {
                    if ($field.hasClass("empty-required-field")) {
                        $field.removeClass("empty-required-field");
                        $required_symbol.addClass("hidden");
                    }
                }
            }
        }
    }

    if ("timezone" in event) {
        user.timezone = event.timezone;
    }

    if ("bot_owner_id" in event) {
        assert(user.is_bot);
        user.bot_owner_id = event.bot_owner_id;
        user_profile.update_profile_modal_ui(user, event);
    }

    if ("is_active" in event) {
        const is_bot_user = user.is_bot;
        if (event.is_active) {
            people.add_active_user(user);
            settings_users.update_view_on_reactivate(event.user_id, is_bot_user);
        } else {
            people.deactivate(user);
            // We used to remove deactivated users in this code block before. But now,
            // that should be done by the `peer_remove` event being sent by the server.
            // This function should be removed altogether if we go through a period of
            // no blueslip errors raised in the function below.
            stream_events.report_error_if_user_still_has_subscriptions(event.user_id);
            user_group_edit.remove_deactivated_user_from_all_groups(event.user_id);
            settings_users.update_view_on_deactivate(event.user_id, is_bot_user);
        }
        buddy_list.insert_or_move([event.user_id]);
        settings_account.maybe_update_deactivate_account_button();
        if (is_bot_user) {
            settings_bots.update_bot_data(event.user_id);
        } else if (!event.is_active) {
            // A human user deactivated, update 'Export permissions' table.
            settings_exports.remove_export_consent_data_and_redraw(event.user_id);
        }
    }
};
```

--------------------------------------------------------------------------------

---[FILE: user_groups.ts]---
Location: zulip-main/web/src/user_groups.ts
Signals: Zod

```typescript
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as blueslip from "./blueslip.ts";
import {FoldDict} from "./fold_dict.ts";
import type {UserGroupUpdateEvent} from "./server_event_types.ts";
import * as settings_config from "./settings_config.ts";
import type {GroupPermissionSetting, GroupSettingValue, StateData} from "./state_data.ts";
import {current_user, raw_user_group_schema, realm} from "./state_data.ts";
import type {UserOrMention} from "./typeahead_helper.ts";
import * as util from "./util.ts";

type UserGroupRaw = z.infer<typeof raw_user_group_schema>;

export const user_group_schema = z.object({
    ...raw_user_group_schema.shape, // These are delivered via the API as lists, but converted to sets
    // during initialization for more convenient manipulation.
    members: z.set(z.number()),
    direct_subgroup_ids: z.set(z.number()),
});
export type UserGroup = z.infer<typeof user_group_schema>;

let user_group_name_dict: FoldDict<UserGroup>;
let user_group_by_id_dict: Map<number, UserGroup>;

// We have an init() function so that our automated tests
// can easily clear data.
export function init(): void {
    user_group_name_dict = new FoldDict();
    user_group_by_id_dict = new Map<number, UserGroup>();
}

// WE INITIALIZE DATA STRUCTURES HERE!
init();

// Ideally this should be included in page params.
// Like we have realm.max_stream_name_length` and
// `realm.max_stream_description_length` for streams.
export const max_user_group_name_length = 100;

export function add(user_group_raw: UserGroupRaw): UserGroup {
    // Reformat the user group members structure to be a set.
    const user_group = {
        description: user_group_raw.description,
        id: user_group_raw.id,
        name: user_group_raw.name,
        creator_id: user_group_raw.creator_id,
        date_created: user_group_raw.date_created,
        members: new Set(user_group_raw.members),
        is_system_group: user_group_raw.is_system_group,
        direct_subgroup_ids: new Set(user_group_raw.direct_subgroup_ids),
        can_add_members_group: user_group_raw.can_add_members_group,
        can_join_group: user_group_raw.can_join_group,
        can_leave_group: user_group_raw.can_leave_group,
        can_manage_group: user_group_raw.can_manage_group,
        can_mention_group: user_group_raw.can_mention_group,
        can_remove_members_group: user_group_raw.can_remove_members_group,
        deactivated: user_group_raw.deactivated,
    };

    user_group_name_dict.set(user_group.name, user_group);
    user_group_by_id_dict.set(user_group.id, user_group);
    return user_group;
}

export function remove(user_group: UserGroup): void {
    user_group_name_dict.delete(user_group.name);
    user_group_by_id_dict.delete(user_group.id);
}

export function get_user_group_from_id(group_id: number): UserGroup {
    const user_group = user_group_by_id_dict.get(group_id);
    if (!user_group) {
        throw new Error(`Unknown group_id in get_user_group_from_id: ${group_id}`);
    }
    return user_group;
}

export function maybe_get_user_group_from_id(group_id: number): UserGroup | undefined {
    return user_group_by_id_dict.get(group_id);
}

export function update(event: UserGroupUpdateEvent, group: UserGroup): void {
    if (event.data.name !== undefined) {
        user_group_name_dict.delete(group.name);
        group.name = event.data.name;
        user_group_name_dict.set(group.name, group);
    }
    if (event.data.description !== undefined) {
        group.description = event.data.description;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.deactivated !== undefined) {
        group.deactivated = event.data.deactivated;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.can_add_members_group !== undefined) {
        group.can_add_members_group = event.data.can_add_members_group;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.can_mention_group !== undefined) {
        group.can_mention_group = event.data.can_mention_group;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.can_manage_group !== undefined) {
        group.can_manage_group = event.data.can_manage_group;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.can_join_group !== undefined) {
        group.can_join_group = event.data.can_join_group;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.can_leave_group !== undefined) {
        group.can_leave_group = event.data.can_leave_group;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }

    if (event.data.can_remove_members_group !== undefined) {
        group.can_remove_members_group = event.data.can_remove_members_group;
        user_group_name_dict.delete(group.name);
        user_group_name_dict.set(group.name, group);
    }
}

export function get_user_group_from_name(name: string): UserGroup | undefined {
    return user_group_name_dict.get(name);
}

export function realm_has_deactivated_user_groups(): boolean {
    const realm_user_groups = get_realm_user_groups(true);
    const deactivated_group_count = realm_user_groups.filter((group) => group.deactivated).length;

    return deactivated_group_count > 0;
}

export function get_realm_user_groups(include_deactivated = false): UserGroup[] {
    const user_groups = [...user_group_by_id_dict.values()];
    user_groups.sort((a, b) => a.id - b.id);
    return user_groups.filter((group) => {
        if (group.is_system_group) {
            return false;
        }

        if (!include_deactivated && group.deactivated) {
            return false;
        }

        return true;
    });
}

export function get_all_realm_user_groups(
    include_deactivated = false,
    include_internet_group = false,
): UserGroup[] {
    const user_groups = [...user_group_by_id_dict.values()];
    user_groups.sort((a, b) => a.id - b.id);
    return user_groups.filter((group) => {
        if (!include_deactivated && group.deactivated) {
            return false;
        }

        if (!include_internet_group && group.name === "role:internet") {
            return false;
        }

        return true;
    });
}

export function get_user_groups_allowed_to_mention(): UserGroup[] {
    const user_groups = get_realm_user_groups();
    return user_groups.filter((group) => {
        const can_mention_group_id = group.can_mention_group;
        return is_user_in_setting_group(can_mention_group_id, current_user.user_id);
    });
}

export function is_direct_member_of(user_id: number, user_group_id: number): boolean {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return false;
    }
    return user_group.members.has(user_id);
}

export function add_members(user_group_id: number, user_ids: number[]): void {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return;
    }

    for (const user_id of user_ids) {
        user_group.members.add(user_id);
    }
}

export function remove_members(user_group_id: number, user_ids: number[]): void {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return;
    }

    for (const user_id of user_ids) {
        user_group.members.delete(user_id);
    }
}

export function add_subgroups(user_group_id: number, subgroup_ids: number[]): void {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return;
    }

    for (const subgroup_id of subgroup_ids) {
        user_group.direct_subgroup_ids.add(subgroup_id);
    }
}

export function remove_subgroups(user_group_id: number, subgroup_ids: number[]): void {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return;
    }

    for (const subgroup_id of subgroup_ids) {
        user_group.direct_subgroup_ids.delete(subgroup_id);
    }
}

export function initialize(params: StateData["user_groups"]): void {
    for (const user_group of params.realm_user_groups) {
        add(user_group);
    }
}

export function is_user_group(
    item: (UserOrMention & {members: undefined}) | UserGroup,
): item is UserGroup {
    return item.members !== undefined;
}

export function is_empty_group(user_group_id: number): boolean {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return false;
    }
    if (user_group.members.size > 0) {
        return false;
    }

    // Check if all the recursive subgroups are empty.
    // Correctness of this algorithm relying on the ES6 Set
    // implementation having the property that a `for of` loop will
    // visit all items that are added to the set during the loop.
    const subgroup_ids = new Set(user_group.direct_subgroup_ids);
    for (const subgroup_id of subgroup_ids) {
        const subgroup = user_group_by_id_dict.get(subgroup_id);
        if (subgroup === undefined) {
            blueslip.error("Could not find subgroup", {subgroup_id});
            return false;
        }
        if (subgroup.members.size > 0) {
            return false;
        }
        for (const direct_subgroup_id of subgroup.direct_subgroup_ids) {
            subgroup_ids.add(direct_subgroup_id);
        }
    }
    return true;
}

export function is_setting_group_empty(setting_group: GroupSettingValue): boolean {
    if (typeof setting_group === "number") {
        return is_empty_group(setting_group);
    }

    if (setting_group.direct_members.length > 0) {
        return false;
    }

    for (const subgroup_id of setting_group.direct_subgroups) {
        if (!is_empty_group(subgroup_id)) {
            return false;
        }
    }

    return true;
}

export function is_setting_group_set_to_nobody_group(setting_group: GroupSettingValue): boolean {
    if (typeof setting_group === "number") {
        const user_group = get_user_group_from_id(setting_group);
        if (user_group.name === "role:nobody") {
            return true;
        }

        return false;
    }

    return setting_group.direct_subgroups.length === 0 && setting_group.direct_members.length === 0;
}

export function get_user_groups_of_user(
    user_id: number,
    include_deactivated_groups = false,
): UserGroup[] {
    const user_groups_realm = get_realm_user_groups(include_deactivated_groups);
    const groups_of_user = user_groups_realm.filter((group) => is_user_in_group(group.id, user_id));
    return groups_of_user;
}

export function get_recursive_subgroups(target_user_group: UserGroup): Set<number> | undefined {
    // Correctness of this algorithm relying on the ES6 Set
    // implementation having the property that a `for of` loop will
    // visit all items that are added to the set during the loop.
    const subgroup_ids = new Set(target_user_group.direct_subgroup_ids);
    for (const subgroup_id of subgroup_ids) {
        const subgroup = user_group_by_id_dict.get(subgroup_id);
        if (subgroup === undefined) {
            blueslip.error("Could not find subgroup", {subgroup_id});
            return undefined;
        }

        for (const direct_subgroup_id of subgroup.direct_subgroup_ids) {
            subgroup_ids.add(direct_subgroup_id);
        }
    }
    return subgroup_ids;
}

export function is_subgroup_of_target_group(target_group_id: number, subgroup_id: number): boolean {
    const target_user_group = get_user_group_from_id(target_group_id);
    const direct_subgroup_ids = new Set(target_user_group.direct_subgroup_ids);
    if (direct_subgroup_ids.has(subgroup_id)) {
        return true;
    }

    const recursive_subgroup_ids = get_recursive_subgroups(target_user_group);
    if (recursive_subgroup_ids === undefined) {
        return false;
    }

    return recursive_subgroup_ids.has(subgroup_id);
}

export function get_supergroups_of_user_group(group_id: number): UserGroup[] {
    return get_realm_user_groups().filter((user_group) =>
        is_subgroup_of_target_group(user_group.id, group_id),
    );
}

export function get_recursive_group_members(target_user_group: UserGroup): Set<number> {
    const members = new Set(target_user_group.members);
    const subgroup_ids = get_recursive_subgroups(target_user_group);

    if (subgroup_ids === undefined) {
        return members;
    }

    for (const subgroup_id of subgroup_ids) {
        const subgroup = user_group_by_id_dict.get(subgroup_id);
        assert(subgroup !== undefined);
        for (const member of subgroup.members) {
            members.add(member);
        }
    }
    return members;
}

export function is_group_larger_than(target_user_group: UserGroup, max_size: number): boolean {
    // Optimized function to check if a group's recursive membership
    // can possibly be large, with runtime `O(max_size +
    // total_subgroups)`, critically not having runtime scaling with
    // the total users in the group or its subgroups.
    if (target_user_group.members.size > max_size) {
        return true;
    }

    const members = new Set(target_user_group.members);
    const subgroup_ids = get_recursive_subgroups(target_user_group);
    if (subgroup_ids === undefined) {
        return false;
    }

    for (const subgroup_id of subgroup_ids) {
        const subgroup = user_group_by_id_dict.get(subgroup_id);
        assert(subgroup !== undefined);
        for (const member of subgroup.members) {
            members.add(member);
        }

        if (members.size > max_size) {
            return true;
        }
    }

    return false;
}

export function check_group_can_be_subgroup(
    subgroup: UserGroup,
    target_user_group: UserGroup,
): boolean {
    // This logic could be optimized if we maintained a reverse map
    // from each group to the groups containing it, which might be a
    // useful data structure for other code paths as well.
    if (subgroup.deactivated) {
        return false;
    }

    const already_subgroup_ids = target_user_group.direct_subgroup_ids;
    if (subgroup.id === target_user_group.id) {
        return false;
    }

    if (already_subgroup_ids.has(subgroup.id)) {
        return false;
    }

    const recursive_subgroup_ids = get_recursive_subgroups(subgroup);
    assert(recursive_subgroup_ids !== undefined);
    if (recursive_subgroup_ids.has(target_user_group.id)) {
        return false;
    }
    return true;
}

export function get_potential_subgroups(target_user_group_id: number): UserGroup[] {
    const target_user_group = get_user_group_from_id(target_user_group_id);
    return get_all_realm_user_groups().filter((user_group) =>
        check_group_can_be_subgroup(user_group, target_user_group),
    );
}

export function get_direct_subgroups_of_group(target_user_group: UserGroup): UserGroup[] {
    const direct_subgroups = [];
    const subgroup_ids = target_user_group.direct_subgroup_ids;
    for (const subgroup_id of subgroup_ids) {
        const subgroup = user_group_by_id_dict.get(subgroup_id);
        assert(subgroup !== undefined);
        direct_subgroups.push(subgroup);
    }
    return direct_subgroups;
}

export function convert_name_to_display_name_for_groups(user_groups: UserGroup[]): UserGroup[] {
    return user_groups.map((user_group) => ({
        ...user_group,
        name: get_display_group_name(user_group.name),
    }));
}

export function is_user_in_group(
    user_group_id: number,
    user_id: number,
    direct_member_only = false,
): boolean {
    const user_group = user_group_by_id_dict.get(user_group_id);
    if (user_group === undefined) {
        blueslip.error("Could not find user group", {user_group_id});
        return false;
    }
    if (is_direct_member_of(user_id, user_group_id)) {
        return true;
    }

    if (direct_member_only) {
        return false;
    }

    const subgroup_ids = get_recursive_subgroups(user_group);
    if (subgroup_ids === undefined) {
        return false;
    }

    for (const group_id of subgroup_ids) {
        if (is_direct_member_of(user_id, group_id)) {
            return true;
        }
    }
    return false;
}

export function group_has_permission(setting_value: GroupSettingValue, group_id: number): boolean {
    if (typeof setting_value === "number") {
        if (setting_value === group_id) {
            return true;
        }

        return is_subgroup_of_target_group(setting_value, group_id);
    }

    const direct_subgroup_ids = setting_value.direct_subgroups;
    if (direct_subgroup_ids.includes(group_id)) {
        return true;
    }

    for (const direct_subgroup_id of direct_subgroup_ids) {
        if (is_subgroup_of_target_group(direct_subgroup_id, group_id)) {
            return true;
        }
    }

    return false;
}

export function is_user_in_any_group(
    user_group_ids: number[],
    user_id: number,
    direct_member_only = false,
): boolean {
    for (const group_id of user_group_ids) {
        if (is_user_in_group(group_id, user_id, direct_member_only)) {
            return true;
        }
    }
    return false;
}

export function get_associated_subgroups(user_group: UserGroup, user_id: number): UserGroup[] {
    const subgroup_ids = get_recursive_subgroups(user_group)!;
    if (subgroup_ids === undefined) {
        return [];
    }

    const subgroups = [];
    for (const group_id of subgroup_ids) {
        if (is_direct_member_of(user_id, group_id)) {
            subgroups.push(user_group_by_id_dict.get(group_id)!);
        }
    }
    return subgroups;
}

export function format_group_list(user_groups: UserGroup[]): string {
    return util.format_array_as_list(
        user_groups.map((user_group) => user_group.name),
        "short",
        "conjunction",
    );
}

export function is_user_in_setting_group(
    setting_value: GroupSettingValue,
    user_id: number,
): boolean {
    if (typeof setting_value === "number") {
        return is_user_in_group(setting_value, user_id);
    }

    const direct_members = setting_value.direct_members;
    if (direct_members.includes(user_id)) {
        return true;
    }

    const direct_subgroups = setting_value.direct_subgroups;
    for (const direct_subgroup_id of direct_subgroups) {
        if (is_user_in_group(direct_subgroup_id, user_id)) {
            return true;
        }
    }
    return false;
}

export function check_system_user_group_allowed_for_setting(
    group_name: string,
    group_setting_config: GroupPermissionSetting,
    for_new_settings_ui: boolean,
): boolean {
    const {allow_internet_group, allow_nobody_group, allow_everyone_group, allowed_system_groups} =
        group_setting_config;

    if (!allow_internet_group && group_name === "role:internet") {
        return false;
    }

    if ((!allow_nobody_group || for_new_settings_ui) && group_name === "role:nobody") {
        return false;
    }

    if (!allow_everyone_group && group_name === "role:everyone") {
        return false;
    }

    if (allowed_system_groups.length > 0 && !allowed_system_groups.includes(group_name)) {
        return false;
    }

    if (
        group_name === "role:fullmembers" &&
        for_new_settings_ui &&
        realm.realm_waiting_period_threshold === 0
    ) {
        // We hide the full members group in the typeahead when
        // there is no separation between member and full member
        // users due to organization not having set a waiting
        // period for member users to become full members.
        return false;
    }

    return true;
}

export function get_display_group_name(group_name: string): string {
    const group = settings_config.system_user_groups_list.find(
        (system_group) => system_group.name === group_name,
    );

    if (group === undefined) {
        return group_name;
    }

    return group.display_name;
}
```

--------------------------------------------------------------------------------

````

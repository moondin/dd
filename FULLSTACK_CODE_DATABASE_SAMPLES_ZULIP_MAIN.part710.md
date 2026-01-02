---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 710
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 710 of 1290)

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

---[FILE: user_group_components.ts]---
Location: zulip-main/web/src/user_group_components.ts

```typescript
import $ from "jquery";

import {$t_html} from "./i18n.ts";
import * as people from "./people.ts";
import type {User} from "./people.ts";
import * as resize from "./resize.ts";
import * as user_groups from "./user_groups.ts";
import type {UserGroup} from "./user_groups.ts";
import * as user_sort from "./user_sort.ts";
import * as util from "./util.ts";

export let active_group_id: number | undefined;

export function set_active_group_id(group_id: number): void {
    active_group_id = group_id;
}

export function reset_active_group_id(): void {
    active_group_id = undefined;
}

export const show_user_group_settings_pane = {
    nothing_selected() {
        $("#groups_overlay .settings, #user-group-creation").hide();
        reset_active_group_id();
        $("#groups_overlay .nothing-selected").show();
        $("#groups_overlay .user-group-info-title").text(
            $t_html({defaultMessage: "User group settings"}),
        );
        $("#groups_overlay .deactivated-user-group-icon-right").hide();
        resize.resize_settings_overlay($("#groups_overlay_container"));
    },
    settings(group: UserGroup) {
        $("#groups_overlay .nothing-selected, #user-group-creation").hide();
        $("#groups_overlay .settings").show();
        set_active_group_id(group.id);
        const group_name = user_groups.get_display_group_name(group.name);
        $("#groups_overlay .user-group-info-title").text(group_name).addClass("showing-info-title");
        if (group.deactivated) {
            $("#groups_overlay .deactivated-user-group-icon-right").show();
        } else {
            $("#groups_overlay .deactivated-user-group-icon-right").hide();
        }
        resize.resize_settings_overlay($("#groups_overlay_container"));
    },
    create_user_group(container_name = "configure_user_group_settings", group_name?: string) {
        $(".user_group_creation").hide();
        if (container_name === "configure_user_group_settings") {
            $("#groups_overlay .user-group-info-title").text(
                $t_html({defaultMessage: "Configure new group settings"}),
            );
        } else {
            $("#groups_overlay .user-group-info-title")
                .text($t_html({defaultMessage: "Add members to {group_name}"}, {group_name}))
                .addClass("showing-info-title");
        }
        update_footer_buttons(container_name);
        $(`.${CSS.escape(container_name)}`).show();
        $("#groups_overlay .nothing-selected, #groups_overlay .settings").hide();
        reset_active_group_id();
        $("#user-group-creation").show();
        $("#groups_overlay .deactivated-user-group-icon-right").hide();
        resize.resize_settings_overlay($("#groups_overlay_container"));
        resize.resize_settings_creation_overlay($("#groups_overlay_container"));
    },
};

export function update_footer_buttons(container_name: string): void {
    if (container_name === "user_group_members_container") {
        // Hide user group creation containers and show add members container
        $("#groups_overlay .finalize_create_user_group").show();
        $("#groups_overlay #user_group_go_to_members").hide();
        $("#groups_overlay #user_group_go_to_configure_settings").show();
    } else {
        // Hide add members container and show user group creation containers
        $("#groups_overlay .finalize_create_user_group").hide();
        $("#groups_overlay #user_group_go_to_members").show();
        $("#groups_overlay #user_group_go_to_configure_settings").hide();
    }
}

export function sort_group_member_email(a: User | UserGroup, b: User | UserGroup): number {
    if ("user_id" in a && "user_id" in b) {
        return user_sort.sort_email(a, b);
    }

    if ("user_id" in a) {
        return -1;
    }

    if ("user_id" in b) {
        return 1;
    }

    return util.compare_a_b(a.name.toLowerCase(), b.name.toLowerCase());
}

export function sort_group_member_name(a: User | UserGroup, b: User | UserGroup): number {
    let a_name;
    if ("user_id" in a) {
        a_name = a.full_name;
    } else {
        a_name = a.name;
    }

    let b_name;
    if ("user_id" in b) {
        b_name = b.full_name;
    } else {
        b_name = b.name;
    }

    return util.compare_a_b(a_name.toLowerCase(), b_name.toLowerCase());
}

export function build_group_member_matcher(query: string): (member: User | UserGroup) => boolean {
    query = query.trim();

    const termlets = query.toLowerCase().split(/\s+/);
    const termlet_matchers = termlets.map((termlet) => people.build_termlet_matcher(termlet));

    return function (member: User | UserGroup): boolean {
        if ("user_id" in member) {
            const email = member.email.toLowerCase();

            if (email.startsWith(query)) {
                return true;
            }

            return termlet_matchers.every((matcher) => matcher(member));
        }

        const group_name = user_groups.get_display_group_name(member.name).toLowerCase();
        if (group_name.startsWith(query)) {
            return true;
        }
        return false;
    };
}
```

--------------------------------------------------------------------------------

---[FILE: user_group_create.ts]---
Location: zulip-main/web/src/user_group_create.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import render_change_user_group_info_modal from "../templates/user_group_settings/change_user_group_info_modal.hbs";

import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import * as group_permission_settings from "./group_permission_settings.ts";
import {$t, $t_html} from "./i18n.ts";
import * as keydown_util from "./keydown_util.ts";
import * as loading from "./loading.ts";
import * as settings_components from "./settings_components.ts";
import * as settings_data from "./settings_data.ts";
import {realm} from "./state_data.ts";
import type {GroupSettingPillContainer} from "./typeahead_helper.ts";
import * as ui_report from "./ui_report.ts";
import * as user_group_components from "./user_group_components.ts";
import * as user_group_create_members from "./user_group_create_members.ts";
import * as user_group_create_members_data from "./user_group_create_members_data.ts";
import * as user_groups from "./user_groups.ts";

let created_group_name: string | undefined;

export function reset_name(): void {
    created_group_name = undefined;
}

export function set_name(group_name: string): void {
    created_group_name = group_name;
}

export function get_name(): string | undefined {
    return created_group_name;
}

export const group_setting_widget_map = new Map<string, GroupSettingPillContainer | null>([
    ["can_add_members_group", null],
    ["can_join_group", null],
    ["can_leave_group", null],
    ["can_manage_group", null],
    ["can_mention_group", null],
    ["can_remove_members_group", null],
]);

export function maybe_update_error_message(): void {
    const group_name = $<HTMLInputElement>("input#create_user_group_name").val()!.trim();
    user_group_name_error.pre_validate(group_name);
}

class UserGroupMembershipError {
    report_no_members_to_user_group(): void {
        $("#user_group_membership_error").text(
            $t({defaultMessage: "You cannot create a user group with no members or subgroups."}),
        );
        $("#user_group_membership_error").show();
    }

    clear_errors(): void {
        $("#user_group_membership_error").hide();
    }
}
const user_group_membership_error = new UserGroupMembershipError();

class UserGroupNameError {
    report_already_exists(error?: string): void {
        const error_message =
            error ?? $t({defaultMessage: "A user group with this name already exists."});
        $("#user_group_name_error").text(error_message);
        $("#user_group_name_error").show();
    }

    clear_errors(): void {
        $("#user_group_name_error").hide();
        $("#deactivated_group_rename").hide();
    }

    report_empty_user_group(): void {
        $("#user_group_name_error").text(
            $t({defaultMessage: "Choose a name for the new user group."}),
        );
        $("#user_group_name_error").show();
    }

    select(): void {
        $("#create_user_group_name").trigger("focus").trigger("select");
    }

    rename_deactivated_group(group_id: number): void {
        $("#deactivated_group_rename").text($t({defaultMessage: "Rename deactivated user group"}));
        $("#deactivated_group_rename").attr("data-group-id", group_id);
        $("#deactivated_group_rename").show();
    }

    pre_validate(user_group_name: string): void {
        const user_group = user_groups.get_user_group_from_name(user_group_name);
        if (user_group_name && user_group) {
            let error;
            if (user_group.deactivated) {
                error = $t({
                    defaultMessage: "A deactivated user group with this name already exists.",
                });
                if (settings_data.can_manage_user_group(user_group.id)) {
                    this.rename_deactivated_group(user_group.id);
                }
            }
            this.report_already_exists(error);
            return;
        }

        this.clear_errors();
    }

    validate_for_submit(user_group_name: string): boolean {
        if (!user_group_name) {
            this.report_empty_user_group();
            this.select();
            return false;
        }

        const group = user_groups.get_user_group_from_name(user_group_name);
        if (group) {
            let error;
            if (group.deactivated) {
                error = $t({
                    defaultMessage: "A deactivated user group with this name already exists.",
                });
            }
            this.report_already_exists(error);
            this.select();
            return false;
        }

        return true;
    }
}
const user_group_name_error = new UserGroupNameError();

$("body").on("click", ".settings-sticky-footer #user_group_go_to_members", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const group_name = $<HTMLInputElement>("input#create_user_group_name").val()!.trim();
    const is_user_group_name_valid = user_group_name_error.validate_for_submit(group_name);

    let is_any_group_widget_pending = false;
    const permission_settings = Object.keys(realm.server_supported_permission_settings.group);
    for (const setting_name of permission_settings) {
        const widget = group_setting_widget_map.get(setting_name);
        assert(widget !== undefined);
        assert(widget !== null);
        if (widget.is_pending()) {
            is_any_group_widget_pending = true;
            // We are not appending any value here, but instead this is
            // a proxy to invoke the error state for a group widget
            // that would usually get triggered on pressing enter.
            widget.appendValue(widget.getCurrentText()!);
            break;
        }
    }

    if (is_user_group_name_valid && !is_any_group_widget_pending) {
        user_group_components.show_user_group_settings_pane.create_user_group(
            "user_group_members_container",
            group_name,
        );
    }
});

$("body").on("click", ".settings-sticky-footer #user_group_go_to_configure_settings", (e) => {
    e.preventDefault();
    e.stopPropagation();
    user_group_components.show_user_group_settings_pane.create_user_group(
        "configure_user_group_settings",
    );
});

function clear_error_display(): void {
    user_group_name_error.clear_errors();
    $(".user_group_create_info").hide();
    user_group_membership_error.clear_errors();
}

export function show_new_user_group_modal(): void {
    $("#user-group-creation").removeClass("hide");
    $(".right .settings").hide();

    user_group_create_members.build_widgets();

    clear_error_display();
}

function create_user_group(): void {
    const group_name = $<HTMLInputElement>("input#create_user_group_name").val()!.trim();
    const description = $<HTMLInputElement>("input#create_user_group_description").val()!.trim();
    set_name(group_name);

    // Even though we already check to make sure that while typing the user cannot enter
    // newline characters (by pressing the Enter key) it would still be possible to copy
    // and paste over a description with newline characters in it. Prevent that.
    if (description.includes("\n")) {
        ui_report.client_error(
            $t_html({defaultMessage: "The group description cannot contain newline characters."}),
            $(".user_group_create_info"),
        );
        return;
    }
    const user_ids = user_group_create_members.get_principals();
    const subgroup_ids = user_group_create_members.get_subgroups();

    const data: Record<string, string> = {
        name: group_name,
        description,
        members: JSON.stringify(user_ids),
        subgroups: JSON.stringify(subgroup_ids),
    };
    loading.make_indicator($("#user_group_creating_indicator"), {
        text: $t({defaultMessage: "Creating group…"}),
    });

    const permission_settings = Object.keys(realm.server_supported_permission_settings.group);
    for (const setting_name of permission_settings) {
        const widget = group_setting_widget_map.get(setting_name);
        assert(widget !== undefined);
        assert(widget !== null);
        const setting_value = settings_components.get_group_setting_widget_value(widget);
        data[setting_name] = JSON.stringify(setting_value);
    }

    void channel.post({
        url: "/json/user_groups/create",
        data,
        success() {
            $("#create_user_group_name").val("");
            $("#create_user_group_description").val("");
            user_group_create_members.clear_member_list();
            loading.destroy_indicator($("#user_group_creating_indicator"));
            // TODO: The rest of the work should be done via the create event we will get for user group.
        },
        error(xhr) {
            ui_report.error(
                $t_html({defaultMessage: "Error creating user group."}),
                xhr,
                $(".user_group_create_info"),
            );
            reset_name();
            loading.destroy_indicator($("#user_group_creating_indicator"));
        },
    });
}

export function set_up_handlers(): void {
    const $people_to_add_holder = $("#people_to_add_in_group").expectOne();
    user_group_create_members.create_handlers($people_to_add_holder);

    const $container = $("#user-group-creation").expectOne();

    $container.on("click", ".finalize_create_user_group", (e) => {
        e.preventDefault();
        clear_error_display();

        const group_name = $<HTMLInputElement>("input#create_user_group_name").val()!.trim();
        const name_ok = user_group_name_error.validate_for_submit(group_name);

        if (!name_ok) {
            user_group_components.show_user_group_settings_pane.create_user_group(
                "configure_user_group_settings",
            );
            return;
        }

        const principals = user_group_create_members_data.get_principals();
        const subgroups = user_group_create_members_data.get_subgroups();
        if (principals.length === 0 && subgroups.length === 0) {
            user_group_membership_error.report_no_members_to_user_group();
            return;
        }

        assert(user_group_create_members.pill_widget !== undefined);
        assert(user_group_create_members.pill_widget !== null);
        if (user_group_create_members.pill_widget.is_pending()) {
            // We are not appending any value here, but instead this is
            // a proxy to invoke the error state for a group widget
            // that would usually get triggered on pressing enter.
            user_group_create_members.pill_widget.appendValue(
                user_group_create_members.pill_widget.getCurrentText()!,
            );
            return;
        }

        create_user_group();
    });

    $container.on("input", "#create_user_group_name", () => {
        const user_group_name = $<HTMLInputElement>("input#create_user_group_name").val()!.trim();

        // This is an inexpensive check.
        user_group_name_error.pre_validate(user_group_name);
    });

    // Do not allow the user to enter newline characters while typing out the
    // group's description during it's creation.
    $container.on("keydown", "#create_user_group_description", (e) => {
        if (keydown_util.is_enter_event(e)) {
            e.preventDefault();
        }
    });

    // This will always be enabled when creating a user group.
    settings_components.enable_opening_typeahead_on_clicking_label($container);

    const permission_settings = group_permission_settings.get_group_permission_settings();
    for (const setting_name of permission_settings) {
        const widget = settings_components.create_group_setting_widget({
            $pill_container: $(`#id_new_group_${CSS.escape(setting_name)}`),
            setting_name,
        });
        group_setting_widget_map.set(setting_name, widget);
    }

    $container.on("click", "#deactivated_group_rename", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const group_id = Number.parseInt($("#deactivated_group_rename").attr("data-group-id")!, 10);
        const group = user_groups.get_user_group_from_id(group_id);
        assert(group !== undefined);

        const template_data = {
            group_name: user_groups.get_display_group_name(group.name),
            max_user_group_name_length: user_groups.max_user_group_name_length,
            allow_editing_description: false,
        };
        const change_user_group_info_modal = render_change_user_group_info_modal(template_data);
        dialog_widget.launch({
            html_heading: $t_html(
                {defaultMessage: "Rename {group_name} (<i>deactivated</i>)"},
                {group_name: user_groups.get_display_group_name(group.name)},
            ),
            html_body: change_user_group_info_modal,
            id: "change_group_info_modal",
            loading_spinner: true,
            on_click: save_group_info,
            post_render() {
                $("#change_group_info_modal .dialog_submit_button")
                    .addClass("save-button")
                    .attr("data-group-id", group_id);
            },
            update_submit_disabled_state_on_change: true,
        });
    });

    function save_group_info(): void {
        const group_id = Number.parseInt($("#deactivated_group_rename").attr("data-group-id")!, 10);
        const group = user_groups.get_user_group_from_id(group_id);
        assert(group !== undefined);
        const url = `/json/user_groups/${group.id}`;
        let name;
        const new_name = $<HTMLInputElement>("#change_user_group_name").val()!.trim();

        if (new_name !== group.name) {
            name = new_name;
        }

        const data = {
            name,
        };
        dialog_widget.submit_api_request(channel.patch, url, data);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: user_group_create_members.ts]---
Location: zulip-main/web/src/user_group_create_members.ts

```typescript
import $ from "jquery";

import render_new_user_group_user from "../templates/stream_settings/new_stream_user.hbs";
import render_new_user_group_subgroup from "../templates/user_group_settings/new_user_group_subgroup.hbs";
import render_new_user_group_users from "../templates/user_group_settings/new_user_group_users.hbs";

import * as add_group_members_pill from "./add_group_members_pill.ts";
import * as ListWidget from "./list_widget.ts";
import type {ListWidget as ListWidgetType} from "./list_widget.ts";
import * as people from "./people.ts";
import type {User} from "./people.ts";
import {current_user} from "./state_data.ts";
import type {CombinedPillContainer} from "./typeahead_helper.ts";
import * as user_group_components from "./user_group_components.ts";
import * as user_group_create_members_data from "./user_group_create_members_data.ts";
import * as user_groups from "./user_groups.ts";
import type {UserGroup} from "./user_groups.ts";
import * as user_pill from "./user_pill.ts";

export let pill_widget: CombinedPillContainer;
let all_users_list_widget: ListWidgetType<User | UserGroup, User | UserGroup>;

export function get_principals(): number[] {
    return user_group_create_members_data.get_principals();
}

export function get_subgroups(): number[] {
    return user_group_create_members_data.get_subgroups();
}

function redraw_member_list(): void {
    all_users_list_widget.replace_list_data(user_group_create_members_data.sorted_members());
}

function add_members(user_ids: number[], subgroup_ids: number[]): void {
    user_group_create_members_data.add_user_ids(user_ids);
    user_group_create_members_data.add_subgroup_ids(subgroup_ids);
    redraw_member_list();
}

function soft_remove_user_id(user_id: number): void {
    user_group_create_members_data.soft_remove_user_id(user_id);
    redraw_member_list();
}

function undo_soft_remove_user_id(user_id: number): void {
    user_group_create_members_data.undo_soft_remove_user_id(user_id);
    redraw_member_list();
}

function soft_remove_subgroup_id(subgroup_id: number): void {
    user_group_create_members_data.soft_remove_subgroup_id(subgroup_id);
    redraw_member_list();
}

function undo_soft_remove_subgroup_id(subgroup_id: number): void {
    user_group_create_members_data.undo_soft_remove_subgroup_id(subgroup_id);
    redraw_member_list();
}

export function clear_member_list(): void {
    user_group_create_members_data.initialize_with_current_user();
    user_group_create_members_data.reset_subgroups_data();
    redraw_member_list();
}

function sync_members(user_ids: number[], subgroup_ids: number[]): void {
    user_group_create_members_data.sync_user_ids(user_ids);
    user_group_create_members_data.sync_subgroup_ids(subgroup_ids);
    redraw_member_list();
}

function build_pill_widget({$parent_container}: {$parent_container: JQuery}): void {
    const $pill_container = $parent_container.find(".pill-container");

    pill_widget = add_group_members_pill.create({
        $pill_container,
        get_potential_members: user_group_create_members_data.get_potential_members,
        get_potential_groups: user_group_create_members_data.get_potential_subgroups,
        with_add_button: false,
        onPillCreateAction: add_members,
        // It is better to sync the current set of user and subgroup ids
        // in the input instead of removing them from the user_ids_set
        // and subgroup_id_set, otherwise we'll have to have more complex
        // logic of when to remove a user and when not to depending upon
        // their channel and individual pills.
        onPillRemoveAction: sync_members,
    });
}

export function create_handlers($container: JQuery): void {
    $container.on("click", ".remove_potential_subscriber", function (this: HTMLElement, e) {
        e.preventDefault();
        const $subscriber_row = $(this).closest(".settings-subscriber-row");
        const user_id = Number.parseInt($subscriber_row.attr("data-user-id")!, 10);
        soft_remove_user_id(user_id);
    });

    $container.on(
        "click",
        ".undo_soft_removed_potential_subscriber",
        function (this: HTMLElement, e) {
            e.preventDefault();
            const $subscriber_row = $(this).closest(".settings-subscriber-row");
            const user_id = Number.parseInt($subscriber_row.attr("data-user-id")!, 10);
            undo_soft_remove_user_id(user_id);
        },
    );

    $container.on("click", ".remove_potential_subgroup", function (this: HTMLElement, e) {
        e.preventDefault();
        const $user_group_subgroup_row = $(this).closest(".user-group-subgroup-row");
        const subgroup_id = Number.parseInt($user_group_subgroup_row.attr("data-group-id")!, 10);
        soft_remove_subgroup_id(subgroup_id);
    });

    $container.on(
        "click",
        ".undo_soft_removed_potential_subgroup",
        function (this: HTMLElement, e) {
            e.preventDefault();
            const $user_group_subgroup_row = $(this).closest(".user-group-subgroup-row");
            const subgroup_id = Number.parseInt(
                $user_group_subgroup_row.attr("data-group-id")!,
                10,
            );
            undo_soft_remove_subgroup_id(subgroup_id);
        },
    );
}

export function build_widgets(): void {
    const $add_people_container = $("#people_to_add_in_group");
    $add_people_container.html(render_new_user_group_users({}));

    const $simplebar_container = $add_people_container.find(".member_list_container");

    build_pill_widget({$parent_container: $add_people_container});

    user_group_create_members_data.initialize_with_current_user();
    const current_user_id = current_user.user_id;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const initial_members = [people.get_by_user_id(current_user_id)] as (User | UserGroup)[];

    all_users_list_widget = ListWidget.create($("#create_user_group_members"), initial_members, {
        name: "new_user_group_add_users",
        $parent_container: $add_people_container,
        get_item: ListWidget.default_get_item,
        sort_fields: {
            email: user_group_components.sort_group_member_email,
            name: user_group_components.sort_group_member_name,
        },
        modifier_html(member: User | UserGroup) {
            if ("user_id" in member) {
                const item = {
                    email: member.delivery_email,
                    user_id: member.user_id,
                    full_name: member.full_name,
                    is_current_user: member.user_id === current_user_id,
                    is_bot: member.is_bot,
                    img_src: people.small_avatar_url_for_person(member),
                    soft_removed: user_group_create_members_data.user_id_in_soft_remove_list(
                        member.user_id,
                    ),
                };
                return render_new_user_group_user(item);
            }

            const item = {
                group_id: member.id,
                display_value: user_groups.get_display_group_name(member.name),
                soft_removed: user_group_create_members_data.subgroup_id_in_soft_remove_list(
                    member.id,
                ),
            };
            return render_new_user_group_subgroup(item);
        },
        filter: {
            $element: $("#people_to_add_in_group .add-user-list-filter"),
            predicate(member, search_term) {
                return user_group_components.build_group_member_matcher(search_term)(member);
            },
        },
        $simplebar_container,
    });
    const current_person = people.get_by_user_id(current_user.user_id);
    user_pill.append_user(current_person, pill_widget);
}
```

--------------------------------------------------------------------------------

---[FILE: user_group_create_members_data.ts]---
Location: zulip-main/web/src/user_group_create_members_data.ts

```typescript
import _ from "lodash";

import * as people from "./people.ts";
import type {User} from "./people.ts";
import {current_user} from "./state_data.ts";
import * as user_group_components from "./user_group_components.ts";
import * as user_groups from "./user_groups.ts";
import type {UserGroup} from "./user_groups.ts";

let user_id_set: Set<number>;
let soft_remove_user_id_set: Set<number>;
let subgroup_id_set = new Set<number>();
let soft_remove_subgroup_id_set = new Set<number>();

export function initialize_with_current_user(): void {
    user_id_set = new Set([current_user.user_id]);
    soft_remove_user_id_set = new Set();
}

export function reset_subgroups_data(): void {
    subgroup_id_set = new Set();
    soft_remove_subgroup_id_set = new Set<number>();
}

export function sorted_members(): (User | UserGroup)[] {
    const users = people.get_users_from_ids([...user_id_set]);
    people.sort_but_pin_current_user_on_top(users);

    const subgroups = [...subgroup_id_set].map((group_id) =>
        user_groups.get_user_group_from_id(group_id),
    );
    subgroups.sort(user_group_components.sort_group_member_name);

    return [...subgroups, ...users];
}

export function get_all_user_ids(): number[] {
    const potential_members = people.get_realm_users();
    const user_ids = potential_members.map((user) => user.user_id);
    // sort for determinism
    user_ids.sort((a, b) => a - b);
    return user_ids;
}

export function get_principals(): number[] {
    // Return list of user ids which were selected by user.
    return _.difference([...user_id_set], [...soft_remove_user_id_set]);
}

export function get_subgroups(): number[] {
    return _.difference([...subgroup_id_set], [...soft_remove_subgroup_id_set]);
}

export function get_potential_members(): User[] {
    const potential_members = people.get_realm_users();
    return potential_members.filter((user) => !user_id_set.has(user.user_id));
}

export function get_potential_subgroups(): UserGroup[] {
    const potential_subgroups = user_groups.get_all_realm_user_groups();
    return potential_subgroups.filter((group) => !subgroup_id_set.has(group.id));
}

export function add_user_ids(user_ids: number[]): void {
    for (const user_id of user_ids) {
        if (!user_id_set.has(user_id)) {
            const user = people.maybe_get_user_by_id(user_id);
            if (user) {
                user_id_set.add(user_id);
                // Re-adding a user explicitly will not undo the soft remove on their row.
                // e.g If `Iago` was added as part of a group and crossed out.
                // Now, adding another group with Iago as part of it should not undo the soft remove.
            }
        }
    }
}

export function remove_user_ids(user_ids: number[]): void {
    for (const user_id of user_ids) {
        user_id_set.delete(user_id);
        undo_soft_remove_user_id(user_id);
    }
}

export function sync_user_ids(user_ids: number[]): void {
    user_id_set = new Set(user_ids);
}

export function soft_remove_user_id(user_id: number): void {
    soft_remove_user_id_set.add(user_id);
}

export function undo_soft_remove_user_id(user_id: number): void {
    soft_remove_user_id_set.delete(user_id);
}

export function user_id_in_soft_remove_list(user_id: number): boolean {
    return soft_remove_user_id_set.has(user_id);
}

export function add_subgroup_ids(subgroup_ids: number[]): void {
    for (const subgroup_id of subgroup_ids) {
        if (!subgroup_id_set.has(subgroup_id)) {
            const group = user_groups.get_user_group_from_id(subgroup_id);
            if (group) {
                subgroup_id_set.add(subgroup_id);
            }
        }
    }
}

export function sync_subgroup_ids(subgroup_ids: number[]): void {
    subgroup_id_set = new Set(subgroup_ids);
}

export function soft_remove_subgroup_id(subgroup_id: number): void {
    soft_remove_subgroup_id_set.add(subgroup_id);
}

export function undo_soft_remove_subgroup_id(subgroup_id: number): void {
    soft_remove_subgroup_id_set.delete(subgroup_id);
}

export function subgroup_id_in_soft_remove_list(subgroup_id: number): boolean {
    return soft_remove_subgroup_id_set.has(subgroup_id);
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 672
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 672 of 1290)

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

---[FILE: settings_data.ts]---
Location: zulip-main/web/src/settings_data.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as group_permission_settings from "./group_permission_settings.ts";
import {page_params} from "./page_params.ts";
import type {User} from "./people.ts";
import * as settings_config from "./settings_config.ts";
import {current_user, realm} from "./state_data.ts";
import type {CurrentUser, GroupSettingValue} from "./state_data.ts";
import * as user_groups from "./user_groups.ts";
import {user_settings} from "./user_settings.ts";

/*
    This is a close cousin of settings_config,
    but this has a bit more logic, and we
    ensure 100% line coverage on it.

    Our main goal with this code is to isolate
    some key modules from having to know
    about page_params and settings_config details.
*/

export function user_can_change_name(): boolean {
    if (current_user.is_admin) {
        return true;
    }
    if (realm.realm_name_changes_disabled || realm.server_name_changes_disabled) {
        return false;
    }
    return true;
}

export function user_can_change_avatar(): boolean {
    if (current_user.is_admin) {
        return true;
    }
    if (realm.realm_avatar_changes_disabled || realm.server_avatar_changes_disabled) {
        return false;
    }
    return true;
}

export function user_can_change_email(): boolean {
    if (current_user.is_admin) {
        return true;
    }
    if (realm.realm_email_changes_disabled) {
        return false;
    }
    return true;
}

export function user_can_change_logo(): boolean {
    return current_user.is_admin && realm.zulip_plan_is_not_limited;
}

export function user_has_permission_for_group_setting(
    setting_value: GroupSettingValue,
    setting_name: string,
    setting_type: "realm" | "stream" | "group",
    user: CurrentUser | User = current_user,
): boolean {
    if (page_params.is_spectator) {
        return false;
    }

    const settings_config = group_permission_settings.get_group_permission_setting_config(
        setting_name,
        setting_type,
    );
    assert(settings_config !== undefined);

    if (!settings_config.allow_everyone_group && user.is_guest) {
        return false;
    }

    return user_groups.is_user_in_setting_group(setting_value, user.user_id);
}

export function user_can_invite_users_by_email(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_invite_users_group,
        "can_invite_users_group",
        "realm",
    );
}

export function user_can_create_multiuse_invite(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_create_multiuse_invite_group,
        "create_multiuse_invite_group",
        "realm",
    );
}

export function user_can_summarize_topics(): boolean {
    if (!realm.server_can_summarize_topics) {
        return false;
    }

    return user_has_permission_for_group_setting(
        realm.realm_can_summarize_topics_group,
        "can_summarize_topics_group",
        "realm",
    );
}

export function can_subscribe_others_to_all_accessible_streams(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_add_subscribers_group,
        "can_add_subscribers_group",
        "realm",
    );
}

export function user_can_create_private_streams(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_create_private_channel_group,
        "can_create_private_channel_group",
        "realm",
    );
}

export function user_can_create_public_streams(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_create_public_channel_group,
        "can_create_public_channel_group",
        "realm",
    );
}

export function user_can_create_web_public_streams(): boolean {
    if (!realm.server_web_public_streams_enabled || !realm.realm_enable_spectator_access) {
        return false;
    }

    return user_has_permission_for_group_setting(
        realm.realm_can_create_web_public_channel_group,
        "can_create_web_public_channel_group",
        "realm",
    );
}

export function user_can_move_messages_between_streams(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_move_messages_between_channels_group,
        "can_move_messages_between_channels_group",
        "realm",
    );
}

export function user_can_manage_all_groups(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_manage_all_groups,
        "can_manage_all_groups",
        "realm",
    );
}

export function can_manage_user_group(group_id: number): boolean {
    if (page_params.is_spectator) {
        return false;
    }

    const group = user_groups.get_user_group_from_id(group_id);

    if (user_can_manage_all_groups()) {
        return true;
    }

    return user_has_permission_for_group_setting(
        group.can_manage_group,
        "can_manage_group",
        "group",
    );
}

export function can_add_members_to_user_group(group_id: number): boolean {
    const group = user_groups.get_user_group_from_id(group_id);
    if (
        user_has_permission_for_group_setting(
            group.can_add_members_group,
            "can_add_members_group",
            "group",
        )
    ) {
        return true;
    }

    return can_manage_user_group(group_id);
}

export function can_remove_members_from_user_group(group_id: number): boolean {
    const group = user_groups.get_user_group_from_id(group_id);
    if (
        user_has_permission_for_group_setting(
            group.can_remove_members_group,
            "can_remove_members_group",
            "group",
        )
    ) {
        return true;
    }

    return can_manage_user_group(group_id);
}

export function can_join_user_group(group_id: number): boolean {
    const group = user_groups.get_user_group_from_id(group_id);
    if (user_has_permission_for_group_setting(group.can_join_group, "can_join_group", "group")) {
        return true;
    }

    return can_add_members_to_user_group(group_id);
}

export function can_leave_user_group(group_id: number): boolean {
    const group = user_groups.get_user_group_from_id(group_id);
    if (user_has_permission_for_group_setting(group.can_leave_group, "can_leave_group", "group")) {
        return true;
    }

    return can_remove_members_from_user_group(group_id);
}

export function user_can_create_user_groups(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_create_groups,
        "can_create_groups",
        "realm",
    );
}

export function user_can_add_custom_emoji(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_add_custom_emoji_group,
        "can_add_custom_emoji_group",
        "realm",
    );
}

export function user_has_billing_access(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_manage_billing_group,
        "can_manage_billing_group",
        "realm",
    );
}

export function user_can_move_messages_to_another_topic(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_move_messages_between_topics_group,
        "can_move_messages_between_topics_group",
        "realm",
    );
}

export function user_can_resolve_topic(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_resolve_topics_group,
        "can_resolve_topics_group",
        "realm",
    );
}

export function user_can_delete_any_message(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_delete_any_message_group,
        "can_delete_any_message_group",
        "realm",
    );
}

export function user_can_delete_own_message(): boolean {
    return user_has_permission_for_group_setting(
        realm.realm_can_delete_own_message_group,
        "can_delete_own_message_group",
        "realm",
    );
}

export function should_mask_unread_count(
    sub_muted: boolean,
    unmuted_unread_count: number,
): boolean {
    if (
        user_settings.web_stream_unreads_count_display_policy ===
        settings_config.web_stream_unreads_count_display_policy_values.no_streams.code
    ) {
        return true;
    }

    /* istanbul ignore next */
    if (
        user_settings.web_stream_unreads_count_display_policy ===
        settings_config.web_stream_unreads_count_display_policy_values.unmuted_streams.code
    ) {
        if (!sub_muted) {
            // This policy always shows unread counts in non-muted channels.
            return false;
        }
        // For muted channels, it depends whether any unmuted unreads exist.
        return unmuted_unread_count === 0;
    }

    return false;
}

export function using_dark_theme(): boolean {
    if (user_settings.color_scheme === settings_config.color_scheme_values.dark.code) {
        return true;
    }

    if (
        user_settings.color_scheme === settings_config.color_scheme_values.automatic.code &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return true;
    }
    return false;
}

export function user_email_not_configured(): boolean {
    // The following should also be true in the only circumstance
    // under which we expect this condition to be possible:
    // realm.demo_organization_scheduled_deletion_date
    return current_user.is_owner && current_user.delivery_email === "";
}

export function bot_type_id_to_string(type_id: number): string | undefined {
    const bot_type = Object.values(settings_config.bot_type_values).find(
        (bot_type) => bot_type.type_id === type_id,
    );

    if (bot_type === undefined) {
        return undefined;
    }

    return bot_type.name;
}

export function user_can_access_all_other_users(): boolean {
    // While spectators have is_guest=true for convenience in some code
    // paths, they do not currently use the guest user systems for
    // limiting their user access to subscribers of web-public
    // channels, which is typically the entire user set for a server
    // anyway.
    if (page_params.is_spectator) {
        return true;
    }

    if (!current_user.is_guest) {
        // The only valid values for this setting are role:members and
        // role:everyone, both of which are always true for non-guest
        // users. This is an important optimization for code that may
        // call this function in a loop.
        return true;
    }

    return user_has_permission_for_group_setting(
        realm.realm_can_access_all_users_group,
        "can_access_all_users_group",
        "realm",
    );
}

/* istanbul ignore next */
export function get_request_data_for_stream_privacy(selected_val: string): {
    is_private: boolean;
    history_public_to_subscribers: boolean;
    is_web_public: boolean;
} {
    // When changing a channel from public to private with public history,
    // "history_public_to_subscribers" value is same and does not change.
    // So, it will not be included in the data returned by
    // "populate_data_for_stream_settings_request" as it only includes
    // the field whose new value has changed from its original value.
    //
    // So, we need to include "history_public_to_subscribers" here
    // itself so that the correct value is passed to the API, otherwise
    // private streams are set to have private history by default.
    const history_public_to_subscribers: boolean = $("#id_history_public_to_subscribers").is(
        ":checked",
    );
    switch (selected_val) {
        case settings_config.stream_privacy_policy_values.public.code: {
            return {
                is_private: false,
                history_public_to_subscribers,
                is_web_public: false,
            };
        }
        case settings_config.stream_privacy_policy_values.private.code: {
            return {
                is_private: true,
                history_public_to_subscribers,
                is_web_public: false,
            };
        }
        case settings_config.stream_privacy_policy_values.web_public.code: {
            return {
                is_private: false,
                history_public_to_subscribers,
                is_web_public: true,
            };
        }
        default:
            throw new Error("Invalid value for channel privacy: " + selected_val);
    }
}

export function guests_can_access_all_other_users(): boolean {
    const everyone_group = user_groups.get_user_group_from_id(
        realm.realm_can_access_all_users_group,
    );
    return everyone_group.name === "role:everyone";
}
```

--------------------------------------------------------------------------------

---[FILE: settings_emoji.ts]---
Location: zulip-main/web/src/settings_emoji.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import emoji_codes from "../../static/generated/emoji/emoji_codes.json";
import render_confirm_deactivate_custom_emoji from "../templates/confirm_dialog/confirm_deactivate_custom_emoji.hbs";
import emoji_settings_warning_modal from "../templates/confirm_dialog/confirm_emoji_settings_warning.hbs";
import render_add_emoji from "../templates/settings/add_emoji.hbs";
import render_admin_emoji_list from "../templates/settings/admin_emoji_list.hbs";

import * as channel from "./channel.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import * as emoji from "./emoji.ts";
import type {ServerEmoji} from "./emoji.ts";
import {$t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import * as loading from "./loading.ts";
import * as people from "./people.ts";
import * as scroll_util from "./scroll_util.ts";
import * as settings_data from "./settings_data.ts";
import {current_user} from "./state_data.ts";
import * as ui_report from "./ui_report.ts";
import * as upload_widget from "./upload_widget.ts";
import * as util from "./util.ts";

const meta = {
    loaded: false,
};

function can_delete_emoji(emoji: ServerEmoji): boolean {
    if (current_user.is_admin) {
        return true;
    }
    if (emoji.author_id === null) {
        // If we don't have the author information then only admin is allowed to disable that emoji.
        return false;
    }
    if (people.is_my_user_id(emoji.author_id)) {
        return true;
    }
    return false;
}

export function update_custom_emoji_ui(): void {
    if (!settings_data.user_can_add_custom_emoji()) {
        $(".add-emoji-text").hide();
        $("#add-custom-emoji-button").hide();
        $("#emoji-settings .emoji-settings-tip-container").show();
        $(".org-settings-list li[data-section='emoji-settings'] .locked").show();
    } else {
        $(".add-emoji-text").show();
        $("#add-custom-emoji-button").show();
        $("#emoji-settings .emoji-settings-tip-container").hide();
        $(".org-settings-list li[data-section='emoji-settings'] .locked").hide();
    }

    populate_emoji();
}

export function reset(): void {
    meta.loaded = false;
}

function sort_author_full_name(a: ServerEmoji, b: ServerEmoji): number {
    const author_a = a.author?.full_name;
    const author_b = b.author?.full_name;

    if (author_a === author_b) {
        return 0;
    }

    if (author_a && author_b) {
        return util.strcmp(author_a, author_b);
    }

    // If one of the author is null, then we put the null author at the end.
    return author_a ? -1 : 1;
}

function is_default_emoji(emoji_name: string): boolean {
    // Spaces are replaced with `_` to match how the emoji name will
    // actually be stored in the backend.
    return emoji_codes.names.includes(emoji_name.replaceAll(" ", "_"));
}

function is_custom_emoji(emoji_name: string): boolean {
    const emoji_data = emoji.get_server_realm_emoji_data();
    for (const emoji of Object.values(emoji_data)) {
        if (emoji.name === emoji_name && !emoji.deactivated) {
            return true;
        }
    }
    return false;
}

export function populate_emoji(): void {
    if (!meta.loaded) {
        return;
    }

    const emoji_data = emoji.get_server_realm_emoji_data();
    const active_emoji_data = Object.values(emoji_data).filter((emoji) => !emoji.deactivated);

    for (const emoji of active_emoji_data) {
        // Add people.js data for the user here.
        if (emoji.author_id !== null) {
            emoji.author = people.get_user_by_id_assert_valid(emoji.author_id);
        } else {
            emoji.author = null;
        }
    }

    const $emoji_table = $("#admin_emoji_table").expectOne();
    ListWidget.create<ServerEmoji>($emoji_table, active_emoji_data, {
        name: "emoji_list",
        get_item: ListWidget.default_get_item,
        modifier_html(item) {
            const author = item.author
                ? {...item.author, is_active: people.is_person_active(item.author_id)}
                : "";
            return render_admin_emoji_list({
                emoji: {
                    name: item.name,
                    display_name: item.name.replaceAll("_", " "),
                    source_url: item.source_url,
                    author,
                    can_delete_emoji: can_delete_emoji(item),
                },
            });
        },
        filter: {
            $element: $emoji_table
                .closest(".settings-section")
                .find<HTMLInputElement>("input.search"),
            predicate(item, value) {
                return item.name.toLowerCase().includes(value);
            },
            onupdate() {
                scroll_util.reset_scrollbar($emoji_table);
            },
        },
        $parent_container: $("#emoji-settings").expectOne(),
        sort_fields: {
            author_full_name: sort_author_full_name,
            ...ListWidget.generic_sort_functions("alphabetic", ["name"]),
        },
        init_sort: "name_alphabetic",
        $simplebar_container: $("#emoji-settings .progressive-table-wrapper"),
    });

    loading.destroy_indicator($("#admin_page_emoji_loading_indicator"));
}

export function add_custom_emoji_post_render(): void {
    $("#add-custom-emoji-modal .dialog_submit_button").prop("disabled", true);

    $("#add-custom-emoji-form").on("input", "input", () => {
        $("#add-custom-emoji-modal .dialog_submit_button").prop(
            "disabled",
            $("#emoji_name").val() === "" || $("#emoji_file_input").val() === "",
        );
    });

    const get_file_input = function (): JQuery<HTMLInputElement> {
        return $("#emoji_file_input");
    };

    const $file_name_field = $("#emoji-file-name");
    const $input_error = $("#emoji_file_input_error");
    const $clear_button = $("#emoji_image_clear_button");
    const $upload_button = $("#emoji_upload_button");
    const $preview_text = $("#emoji_preview_text");
    const $preview_image = $("#emoji_preview_image");
    const $placeholder_icon = $("#emoji_placeholder_icon");

    $preview_image.hide();

    upload_widget.build_widget(
        get_file_input,
        $file_name_field,
        $input_error,
        $clear_button,
        $upload_button,
        $preview_text,
        $preview_image,
    );

    get_file_input().on("input", () => {
        $placeholder_icon.hide();
        $preview_image.show();
    });

    $preview_text.show();
    $clear_button.on("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        $("#add-custom-emoji-modal .dialog_submit_button").prop("disabled", true);

        $preview_image.hide();
        $placeholder_icon.show();
        $preview_text.show();
    });
}

function show_modal(): void {
    const html_body = render_add_emoji({});

    function add_custom_emoji(): void {
        dialog_widget.show_dialog_spinner();

        const $emoji_status = $("#dialog_error");
        const emoji: Record<string, string> = {};

        function submit_custom_emoji_request(formData: FormData): void {
            assert(emoji["name"] !== undefined);
            void channel.post({
                url: "/json/realm/emoji/" + encodeURIComponent(emoji["name"]),
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success() {
                    dialog_widget.close();
                },
                error(xhr) {
                    $("#dialog_error").hide();
                    dialog_widget.hide_dialog_spinner();
                    ui_report.error($t_html({defaultMessage: "Failed"}), xhr, $emoji_status);
                },
            });
        }

        for (const obj of $("#add-custom-emoji-form").serializeArray()) {
            emoji[obj.name] = obj.value;
        }
        assert(emoji["name"] !== undefined);

        if (emoji["name"].trim() === "") {
            ui_report.client_error(
                $t_html({defaultMessage: "Failed: Emoji name is required."}),
                $emoji_status,
            );
            dialog_widget.hide_dialog_spinner();
            return;
        }

        if (is_custom_emoji(emoji["name"])) {
            ui_report.client_error(
                $t_html({
                    defaultMessage: "Failed: A custom emoji with this name already exists.",
                }),
                $emoji_status,
            );
            dialog_widget.hide_dialog_spinner();
            return;
        }

        const formData = new FormData();
        const files = util.the($<HTMLInputElement>("input#emoji_file_input")).files;
        assert(files !== null);
        for (const [i, file] of [...files].entries()) {
            formData.append("file-" + i, file);
        }

        if (is_default_emoji(emoji["name"])) {
            if (!current_user.is_admin) {
                ui_report.client_error(
                    $t_html({
                        defaultMessage:
                            "Failed: There is a default emoji with this name. Only administrators can override default emoji.",
                    }),
                    $emoji_status,
                );
                dialog_widget.hide_dialog_spinner();
                return;
            }

            dialog_widget.close(() => {
                const html_body = emoji_settings_warning_modal({
                    emoji_name: emoji["name"],
                });
                confirm_dialog.launch({
                    html_heading: $t_html({defaultMessage: "Override default emoji?"}),
                    html_body,
                    on_click() {
                        submit_custom_emoji_request(formData);
                    },
                });
            });
        } else {
            submit_custom_emoji_request(formData);
        }
    }
    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Add a new emoji"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Confirm"}),
        id: "add-custom-emoji-modal",
        form_id: "add-custom-emoji-form",
        loading_spinner: true,
        on_click: add_custom_emoji,
        post_render: add_custom_emoji_post_render,
        on_shown() {
            $("#emoji_name").trigger("focus");
        },
    });
}

export function set_up(): void {
    meta.loaded = true;

    $("#add-custom-emoji-button").on("click", show_modal);

    loading.make_indicator($("#admin_page_emoji_loading_indicator"));

    // Populate emoji table
    populate_emoji();

    $(".admin_emoji_table").on("click", ".delete", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $button = $(this);
        const url =
            "/json/realm/emoji/" +
            encodeURIComponent($button.closest("tr").attr("data-emoji-name")!);
        const html_body = render_confirm_deactivate_custom_emoji({});

        const opts = {
            success_continuation() {
                const $row = $button.parents("tr");
                $row.remove();
            },
        };

        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Deactivate custom emoji?"}),
            html_body,
            id: "confirm_deactivate_custom_emoji_modal",
            on_click() {
                dialog_widget.submit_api_request(channel.del, url, {}, opts);
            },
            loading_spinner: true,
        });
    });
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 678
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 678 of 1290)

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

---[FILE: settings_realm_user_settings_defaults.ts]---
Location: zulip-main/web/src/settings_realm_user_settings_defaults.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as audible_notifications from "./audible_notifications.ts";
import * as information_density from "./information_density.ts";
import * as overlays from "./overlays.ts";
import {realm_user_settings_defaults} from "./realm_user_settings_defaults.ts";
import * as settings_components from "./settings_components.ts";
import * as settings_notifications from "./settings_notifications.ts";
import * as settings_org from "./settings_org.ts";
import * as settings_preferences from "./settings_preferences.ts";
import type {SettingsPanel} from "./settings_preferences.ts";
import {current_user} from "./state_data.ts";
import type {HTMLSelectOneElement} from "./types.ts";
import * as util from "./util.ts";

export let realm_default_settings_panel: SettingsPanel | undefined;

export function maybe_disable_widgets(): void {
    if (!current_user.is_admin) {
        $(".organization-box [data-name='organization-level-user-defaults']")
            .find("input, select")
            .prop("disabled", true);

        $(".organization-box [data-name='organization-level-user-defaults']")
            .find("input[type='checkbox']:disabled")
            .closest(".input-group")
            .addClass("control-label-disabled");

        $(".organization-box [data-name='organization-level-user-defaults']")
            .find(".play_notification_sound")
            .addClass("control-label-disabled");

        $(".organization-box [data-name='organization-level-user-defaults']")
            .find(".info-density-button")
            .prop("disabled", true);
        $(".organization-box [data-name='organization-level-user-defaults']")
            .find(".information-density-settings")
            .addClass("disabled-setting");
    }
}

export function update_page(property: string): void {
    if (!overlays.settings_open()) {
        return;
    }

    const $element = $(`#realm_${CSS.escape(property)}`);
    if ($element.length > 0) {
        const $subsection = $element.closest(".settings-subsection-parent");
        if ($subsection.find(".save-button-controls").hasClass("hide")) {
            settings_org.discard_realm_default_property_element_changes(util.the($element));
        } else {
            settings_org.discard_realm_default_settings_subsection_changes($subsection);
        }
    }
}

export function set_up(): void {
    assert(realm_default_settings_panel !== undefined);
    const $container = $(realm_default_settings_panel.container);
    const $notification_sound_elem = $<HTMLAudioElement>(
        "audio#realm-default-notification-sound-audio",
    );
    const $notification_sound_dropdown = $container.find<HTMLSelectOneElement>(
        ".setting_notification_sound",
    );

    settings_preferences.set_up(realm_default_settings_panel);

    audible_notifications.update_notification_sound_source(
        $notification_sound_elem,
        realm_default_settings_panel.settings_object,
    );

    $notification_sound_dropdown.on("change", () => {
        const sound = $notification_sound_dropdown.val()!.toLowerCase();
        audible_notifications.update_notification_sound_source($notification_sound_elem, {
            notification_sound: sound,
        });
    });

    $container.find(".info-density-button").on("click", function (this: HTMLElement, e) {
        e.preventDefault();
        const changed_property = information_density.information_density_properties_schema.parse(
            $(this).closest(".button-group").attr("data-property"),
        );
        const new_value = information_density.get_new_value_for_information_density_settings(
            $(this),
            changed_property,
        );
        $(this).closest(".button-group").find(".current-value").val(new_value);
        let display_value = new_value.toString();
        if (changed_property === "web_line_height_percent") {
            display_value = information_density.get_string_display_value_for_line_height(new_value);
        }
        $(this).closest(".button-group").find(".display-value").text(display_value);
        information_density.enable_or_disable_control_buttons($container);
        const $subsection = $(this).closest(".settings-subsection-parent");
        settings_components.save_discard_default_realm_settings_widget_status_handler($subsection);
    });

    settings_notifications.set_up(realm_default_settings_panel);

    $("#realm_email_address_visibility").val(realm_user_settings_defaults.email_address_visibility);

    settings_org.register_save_discard_widget_handlers(
        $container,
        "/json/realm/user_settings_defaults",
        true,
    );

    maybe_disable_widgets();
}

export function initialize(): void {
    realm_default_settings_panel = {
        container: "#realm-user-default-settings",
        settings_object: realm_user_settings_defaults,
        notification_sound_elem: "audio#realm-default-notification-sound-audio",
        for_realm_settings: true,
    };
}
```

--------------------------------------------------------------------------------

---[FILE: settings_sections.ts]---
Location: zulip-main/web/src/settings_sections.ts

```typescript
import assert from "minimalistic-assert";

import * as alert_words_ui from "./alert_words_ui.ts";
import * as attachments_ui from "./attachments_ui.ts";
import * as blueslip from "./blueslip.ts";
import * as settings_account from "./settings_account.ts";
import * as settings_bots from "./settings_bots.ts";
import * as settings_emoji from "./settings_emoji.ts";
import * as settings_exports from "./settings_exports.ts";
import * as settings_folders from "./settings_folders.ts";
import * as settings_invites from "./settings_invites.ts";
import * as settings_linkifiers from "./settings_linkifiers.ts";
import * as settings_muted_users from "./settings_muted_users.ts";
import * as settings_notifications from "./settings_notifications.ts";
import * as settings_org from "./settings_org.ts";
import * as settings_playgrounds from "./settings_playgrounds.ts";
import * as settings_preferences from "./settings_preferences.ts";
import * as settings_profile_fields from "./settings_profile_fields.ts";
import * as settings_realm_user_settings_defaults from "./settings_realm_user_settings_defaults.ts";
import * as settings_streams from "./settings_streams.ts";
import * as settings_user_topics from "./settings_user_topics.ts";
import * as settings_users from "./settings_users.ts";

const load_func_dict = new Map<string, () => void>(); // key is a group
const loaded_groups = new Set();

export function get_group(section: string): string {
    // Sometimes several sections all share the same code.

    switch (section) {
        case "organization-profile":
        case "organization-settings":
        case "organization-permissions":
        case "auth-methods":
            return "org_misc";

        case "bots":
            return "org_bots";

        case "users":
            return "org_users";

        case "profile":
        case "account-and-privacy":
            return "your-account";

        default:
            return section;
    }
}

export function initialize(): void {
    // personal
    load_func_dict.set("your-account", settings_account.set_up);
    load_func_dict.set("preferences", () => {
        settings_preferences.set_up(settings_preferences.user_settings_panel);
    });
    load_func_dict.set("notifications", () => {
        assert(settings_notifications.user_settings_panel !== undefined);
        settings_notifications.set_up(settings_notifications.user_settings_panel);
    });
    load_func_dict.set("alert-words", alert_words_ui.set_up_alert_words);
    load_func_dict.set("uploaded-files", attachments_ui.set_up_attachments);
    load_func_dict.set("topics", settings_user_topics.set_up);
    load_func_dict.set("muted-users", settings_muted_users.set_up);

    // org
    load_func_dict.set("org_misc", settings_org.set_up);
    load_func_dict.set("org_bots", settings_bots.set_up_bots);
    load_func_dict.set("org_users", settings_users.set_up_humans);
    load_func_dict.set("emoji-settings", settings_emoji.set_up);
    load_func_dict.set("default-channels-list", settings_streams.set_up);
    load_func_dict.set("linkifier-settings", settings_linkifiers.set_up);
    load_func_dict.set("playground-settings", settings_playgrounds.set_up);
    load_func_dict.set("profile-field-settings", settings_profile_fields.set_up);
    load_func_dict.set("data-exports-admin", settings_exports.set_up);
    load_func_dict.set(
        "organization-level-user-defaults",
        settings_realm_user_settings_defaults.set_up,
    );
    load_func_dict.set("channel-folders", settings_folders.set_up);
}

export function load_settings_section(section: string): void {
    const group = get_group(section);

    if (!load_func_dict.has(group)) {
        blueslip.error("Unknown section " + section);
        return;
    }

    if (loaded_groups.has(group)) {
        // We only load groups once (unless somebody calls
        // reset_sections).
        return;
    }

    const load_func = load_func_dict.get(group);
    assert(load_func !== undefined);

    // Do the real work here!
    load_func();
    loaded_groups.add(group);
}

export function reset_sections(): void {
    loaded_groups.clear();
    settings_emoji.reset();
    settings_exports.reset();
    settings_linkifiers.reset();
    settings_playgrounds.reset();
    settings_invites.reset();
    settings_org.reset();
    settings_profile_fields.reset();
    settings_streams.reset();
    settings_user_topics.reset();
    settings_muted_users.reset();
    alert_words_ui.reset();
    settings_folders.reset();
    // settings_users doesn't need a reset()
}
```

--------------------------------------------------------------------------------

---[FILE: settings_streams.ts]---
Location: zulip-main/web/src/settings_streams.ts

```typescript
import $ from "jquery";
import type * as tippy from "tippy.js";

import render_add_default_streams from "../templates/settings/add_default_streams.hbs";
import render_admin_default_streams_list from "../templates/settings/admin_default_streams_list.hbs";
import render_default_stream_choice from "../templates/settings/default_stream_choice.hbs";

import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import * as hash_parser from "./hash_parser.ts";
import {$t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import * as loading from "./loading.ts";
import * as scroll_util from "./scroll_util.ts";
import * as settings_profile_fields from "./settings_profile_fields.ts";
import {current_user} from "./state_data.ts";
import * as stream_data from "./stream_data.ts";
import * as sub_store from "./sub_store.ts";
import * as ui_report from "./ui_report.ts";

function add_choice_row($widget: JQuery): void {
    if ($widget.closest(".choice-row").next().hasClass("choice-row")) {
        return;
    }
    create_choice_row();
}

function get_chosen_default_streams(): Set<number> {
    // Return the set of stream id's of streams chosen in the default stream modal.
    return new Set(
        // Note: We selectively map through the dropdown elements that contain the
        // `data-stream-id` attribute to avoid adding an element with undefined value
        //  into the returned `Set`.
        $("#default-stream-choices .choice-row .dropdown_widget_value[data-stream-id]")
            .map((_i, elem) => Number($(elem).attr("data-stream-id")))
            .get(),
    );
}

function create_choice_row(): void {
    const $container = $("#default-stream-choices");
    const value = settings_profile_fields.get_value_for_new_option($container);
    const stream_dropdown_widget_name = `select_default_stream_${value}`;
    const row_html = render_default_stream_choice({value, stream_dropdown_widget_name});
    $container.append($(row_html));

    // List of non-default streams that are not yet selected.
    function get_options(): {name: string; unique_id: number}[] {
        const chosen_default_streams = get_chosen_default_streams();

        return stream_data
            .get_non_default_stream_names()
            .filter((e) => !chosen_default_streams.has(e.unique_id));
    }

    function item_click_callback(event: JQuery.ClickEvent, dropdown: tippy.Instance): void {
        const $selected_stream = $(event.currentTarget);
        const selected_stream_name = $selected_stream.attr("data-name")!;
        const selected_stream_id = Number.parseInt($selected_stream.attr("data-unique-id")!, 10);

        const $stream_dropdown_widget = $(`#${CSS.escape(stream_dropdown_widget_name)}_widget`);
        const $stream_name = $stream_dropdown_widget.find(".dropdown_widget_value");
        $stream_name.text(selected_stream_name);
        $stream_name.attr("data-stream-id", selected_stream_id);

        add_choice_row($stream_dropdown_widget);
        dropdown.hide();
        $("#add-default-stream-modal .dialog_submit_button").prop("disabled", false);
        event.stopPropagation();
        event.preventDefault();
    }

    new dropdown_widget.DropdownWidget({
        widget_name: stream_dropdown_widget_name,
        get_options,
        item_click_callback,
        $events_container: $container,
    }).setup();
}

const meta = {
    loaded: false,
};

export function reset(): void {
    meta.loaded = false;
}

export function maybe_disable_widgets(): void {
    if (current_user.is_admin) {
        return;
    }

    $(".organization-box [data-name='default-channels-list']")
        .find("input:not(.search), button, select")
        .prop("disabled", true);
}

export function build_default_stream_table(): void {
    const $table = $("#admin_default_streams_table").expectOne();

    const stream_ids = stream_data.get_default_stream_ids();
    const subs = stream_ids.map((stream_id) => sub_store.get(stream_id)!);

    ListWidget.create($table, subs, {
        name: "default_streams_list",
        get_item: ListWidget.default_get_item,
        modifier_html(item) {
            return render_admin_default_streams_list({
                stream: item,
                can_modify: current_user.is_admin,
            });
        },
        filter: {
            $element: $table.closest(".settings-section").find<HTMLInputElement>("input.search"),
            predicate(item, query) {
                return item.name.toLowerCase().includes(query.toLowerCase());
            },
            onupdate() {
                scroll_util.reset_scrollbar($table);
            },
        },
        $parent_container: $("#admin-default-channels-list").expectOne(),
        init_sort: "name_alphabetic",
        sort_fields: {
            ...ListWidget.generic_sort_functions("alphabetic", ["name"]),
        },
        $simplebar_container: $("#admin-default-channels-list .progressive-table-wrapper"),
    });

    loading.destroy_indicator($("#admin_page_default_streams_loading_indicator"));
}

export function update_default_streams_table(): void {
    if (["organization", "settings"].includes(hash_parser.get_current_hash_category())) {
        $("#admin_default_streams_table").expectOne().find("tr.default_stream_row").remove();
        build_default_stream_table();
    }
}

export function delete_default_stream(
    stream_id: number,
    $default_stream_row: JQuery,
    $alert_element: JQuery,
): void {
    void channel.del({
        url: "/json/default_streams?" + $.param({stream_id}),
        error(xhr) {
            ui_report.generic_row_button_error(xhr, $alert_element);
        },
        success() {
            $default_stream_row.remove();
        },
    });
}

function delete_choice_row(e: JQuery.ClickEvent): void {
    const $row = $(e.currentTarget).parent();
    $row.remove();

    // Disable the submit button if no streams are selected.
    $("#add-default-stream-modal .dialog_submit_button").prop(
        "disabled",
        $(".choice-row").length <= 1,
    );
}

function show_add_default_streams_modal(): void {
    const html_body = render_add_default_streams();

    function add_default_streams(e: JQuery.ClickEvent): void {
        e.preventDefault();
        e.stopPropagation();

        // Keep track of the number of successful requests. Close the modal
        // only if all the requests are successful.
        let successful_requests = 0;
        const chosen_streams = get_chosen_default_streams();

        function make_default_stream_request(stream_id: number): void {
            const data = {stream_id};
            void channel.post({
                url: "/json/default_streams",
                data,
                success() {
                    successful_requests = successful_requests + 1;

                    if (successful_requests === chosen_streams.size) {
                        dialog_widget.close();
                    }
                },
                error(xhr) {
                    ui_report.error(
                        $t_html({defaultMessage: "Failed adding one or more channels."}),
                        xhr,
                        $("#dialog_error"),
                    );
                    dialog_widget.hide_dialog_spinner();
                },
            });
        }

        for (const chosen_stream of chosen_streams) {
            make_default_stream_request(chosen_stream);
        }
    }

    function default_stream_post_render(): void {
        $("#add-default-stream-modal .dialog_submit_button").prop("disabled", true);

        create_choice_row();
        $("#default-stream-choices").on("click", "button.delete-choice", delete_choice_row);
    }

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Add default channels"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Add"}),
        help_link: "/help/set-default-channels-for-new-users",
        id: "add-default-stream-modal",
        loading_spinner: true,
        on_click: add_default_streams,
        post_render: default_stream_post_render,
        on_shown() {
            $("#select_default_stream_0_widget").trigger("focus");
        },
    });
}

export function set_up(): void {
    build_page();
    maybe_disable_widgets();
}

export function build_page(): void {
    meta.loaded = true;

    update_default_streams_table();

    $("#show-add-default-streams-modal").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        show_add_default_streams_modal();
    });

    $("body").on(
        "click",
        ".default_stream_row .remove-default-stream",
        function (this: HTMLElement) {
            const $row = $(this).closest(".default_stream_row");
            const stream_id = Number.parseInt($row.attr("data-stream-id")!, 10);
            delete_default_stream(stream_id, $row, $(this));
        },
    );
}
```

--------------------------------------------------------------------------------

---[FILE: settings_toggle.ts]---
Location: zulip-main/web/src/settings_toggle.ts

```typescript
import $ from "jquery";

import * as components from "./components.ts";
import type {Toggle} from "./components.ts";
import {$t} from "./i18n.ts";
import * as settings_panel_menu from "./settings_panel_menu.ts";

let toggler: Toggle | undefined;

export function goto(tab_name: string): void {
    if (toggler) {
        toggler.goto(tab_name);
    }
}

export function initialize(): void {
    toggler = components.toggle({
        child_wants_focus: true,
        values: [
            {label: $t({defaultMessage: "Personal"}), key: "settings"},
            {label: $t({defaultMessage: "Organization"}), key: "organization"},
        ],
        callback(_name, key) {
            if (key === "organization") {
                settings_panel_menu.show_org_settings();
            } else {
                settings_panel_menu.show_normal_settings();
            }
        },
    });

    settings_panel_menu.set_key_handlers(toggler);

    toggler.get().appendTo("#settings_overlay_container .tab-container");
}

// Handles the collapse/reveal of some tabs in the org settings for non-admins.
export function toggle_org_setting_collapse(): void {
    const is_collapsed = $(".collapse-org-settings").hasClass("hide-org-settings");
    const show_fewer_settings_text = $t({defaultMessage: "Show fewer"});
    const show_more_settings_text = $t({defaultMessage: "Show more"});

    if (is_collapsed) {
        for (const elem of $(".collapse-org-settings")) {
            $(elem).removeClass("hide-org-settings");
        }

        $("#toggle_collapse_chevron").removeClass("fa-angle-double-down");
        $("#toggle_collapse_chevron").addClass("fa-angle-double-up");

        $("#toggle_collapse").text(show_fewer_settings_text);
    } else {
        for (const elem of $(".collapse-org-settings")) {
            $(elem).addClass("hide-org-settings");
        }

        $("#toggle_collapse_chevron").removeClass("fa-angle-double-up");
        $("#toggle_collapse_chevron").addClass("fa-angle-double-down");

        $("#toggle_collapse").text(show_more_settings_text);
    }

    // If current tab is about to be collapsed, go to default tab.
    const $current_tab = $(".org-settings-list .active");
    if ($current_tab.hasClass("hide-org-settings")) {
        window.location.href = "/#organization/organization-profile";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: settings_ui.ts]---
Location: zulip-main/web/src/settings_ui.ts

```typescript
import $ from "jquery";

import checkbox_image from "../images/checkbox-green.svg";

import type {AjaxRequestHandler} from "./channel.ts";
import {$t, $t_html} from "./i18n.ts";
import * as loading from "./loading.ts";
import * as ui_report from "./ui_report.ts";
import * as util from "./util.ts";

export type RequestOpts = {
    success_msg_html?: string | undefined;
    failure_msg_html?: string;
    success_continuation?: (response_data: unknown) => void;
    error_continuation?: (xhr: JQuery.jqXHR) => void;
    sticky?: boolean | undefined;
    $error_msg_element?: JQuery;
};

export function display_checkmark($elem: JQuery): void {
    const $check_mark = $("<img>");
    $check_mark.attr("src", checkbox_image);
    $check_mark.addClass("settings-save-checkmark");
    $elem.prepend($check_mark);
}

export const strings = {
    success_html: $t_html({defaultMessage: "Saved"}),
    failure_html: $t_html({defaultMessage: "Save failed"}),
    saving: $t({defaultMessage: "Saving"}),
};
// Generic function for informing users about changes to the settings
// UI.  Intended to replace the old system that was built around
// direct calls to `ui_report`.
export function do_settings_change(
    request_method: AjaxRequestHandler,
    url: string,
    data: Record<string, unknown>,
    $status_element: JQuery,
    {
        success_msg_html = strings.success_html,
        failure_msg_html = strings.failure_html,
        success_continuation,
        error_continuation,
        sticky = false,
        $error_msg_element,
    }: RequestOpts = {},
): void {
    const $spinner = $status_element.expectOne();
    $spinner.fadeTo(0, 1);
    loading.make_indicator($spinner, {text: strings.saving});
    const remove_after = sticky ? undefined : 1000;
    const appear_after = 500;
    const request_start_time = Date.now();

    void request_method({
        url,
        data,
        success(response_data) {
            const remaining_delay = util.get_remaining_time(request_start_time, appear_after);
            setTimeout(() => {
                ui_report.success(success_msg_html, $spinner, remove_after);
                display_checkmark($spinner);
            }, remaining_delay);
            if (success_continuation !== undefined) {
                success_continuation(response_data);
            }
        },
        error(xhr) {
            if ($error_msg_element) {
                loading.destroy_indicator($spinner);
                ui_report.error(failure_msg_html, xhr, $error_msg_element);
            } else {
                ui_report.error(failure_msg_html, xhr, $spinner);
            }
            if (error_continuation !== undefined) {
                error_continuation(xhr);
            }
        },
    });
}

// This function is used to disable sub-setting when main setting is checked or unchecked
// or two settings are inter-dependent on their values.
// * is_checked is boolean, shows if the main setting is checked or not.
// * sub_setting_id is sub setting or setting which depend on main setting,
//   string id of setting.
// * disable_on_uncheck is boolean, true if sub setting should be disabled
//   when main setting unchecked.
export function disable_sub_setting_onchange(
    is_checked: boolean,
    sub_setting_id: string,
    disable_on_uncheck: boolean,
    include_label = false,
): void {
    if ((is_checked && disable_on_uncheck) || (!is_checked && !disable_on_uncheck)) {
        $(`#${CSS.escape(sub_setting_id)}`).prop("disabled", false);
        if (include_label) {
            $(`#${CSS.escape(sub_setting_id)}_label`)
                .parent()
                .removeClass("control-label-disabled");
        }
    } else if ((is_checked && !disable_on_uncheck) || (!is_checked && disable_on_uncheck)) {
        $(`#${CSS.escape(sub_setting_id)}`).prop("disabled", true);
        if (include_label) {
            $(`#${CSS.escape(sub_setting_id)}_label`)
                .parent()
                .addClass("control-label-disabled");
        }
    }
}
```

--------------------------------------------------------------------------------

````

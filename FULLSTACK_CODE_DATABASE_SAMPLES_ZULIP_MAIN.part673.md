---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 673
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 673 of 1290)

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

---[FILE: settings_exports.ts]---
Location: zulip-main/web/src/settings_exports.ts
Signals: Zod

```typescript
import $ from "jquery";
import type * as tippy from "tippy.js";
import * as z from "zod/mini";

import render_confirm_delete_data_export from "../templates/confirm_dialog/confirm_delete_data_export.hbs";
import render_export_modal_warning_notes from "../templates/export_modal_warning_notes.hbs";
import render_allow_private_data_export_banner from "../templates/modal_banner/allow_private_data_export_banner.hbs";
import render_admin_export_consent_list from "../templates/settings/admin_export_consent_list.hbs";
import render_admin_export_list from "../templates/settings/admin_export_list.hbs";
import render_start_export_modal from "../templates/start_export_modal.hbs";

import * as channel from "./channel.ts";
import * as components from "./components.ts";
import * as compose_banner from "./compose_banner.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import type {DropdownWidget, Option} from "./dropdown_widget.ts";
import {$t, $t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import type {ListWidget as ListWidgetType} from "./list_widget.ts";
import * as loading from "./loading.ts";
import * as people from "./people.ts";
import * as scroll_util from "./scroll_util.ts";
import * as settings_config from "./settings_config.ts";
import * as timerender from "./timerender.ts";
import type {HTMLSelectOneElement} from "./types.ts";
import * as ui_report from "./ui_report.ts";
import {user_settings} from "./user_settings.ts";

export const export_consent_schema = z.object({
    user_id: z.number(),
    consented: z.boolean(),
    email_address_visibility: z.number(),
});
type ExportConsent = z.output<typeof export_consent_schema>;

export const realm_export_schema = z.object({
    id: z.number(),
    export_time: z.number(),
    acting_user_id: z.number(),
    export_url: z.nullable(z.string()),
    deleted_timestamp: z.nullable(z.number()),
    failed_timestamp: z.nullable(z.number()),
    pending: z.boolean(),
    export_type: z.number(),
});
type RealmExport = z.output<typeof realm_export_schema>;

const meta = {
    loaded: false,
};

let users_consented_for_export_count: number;
let total_users_count: number;

export function reset(): void {
    meta.loaded = false;
}

function sort_user(a: RealmExport, b: RealmExport): number {
    const a_name = people.get_full_name(a.acting_user_id).toLowerCase();
    const b_name = people.get_full_name(b.acting_user_id).toLowerCase();
    if (a_name > b_name) {
        return 1;
    } else if (a_name === b_name) {
        return 0;
    }
    return -1;
}

export function populate_exports_table(exports: RealmExport[]): void {
    if (!meta.loaded) {
        return;
    }

    const $exports_table = $("#admin_exports_table").expectOne();
    ListWidget.create($exports_table, Object.values(exports), {
        name: "admin_exports_list",
        get_item: ListWidget.default_get_item,
        modifier_html(data) {
            let failed_timestamp = null;
            let deleted_timestamp = null;

            if (data.failed_timestamp !== null) {
                failed_timestamp = timerender.relative_time_string_from_date(
                    new Date(data.failed_timestamp * 1000),
                );
            }

            if (data.deleted_timestamp !== null) {
                deleted_timestamp = timerender.relative_time_string_from_date(
                    new Date(data.deleted_timestamp * 1000),
                );
            }

            let export_type_description = settings_config.export_type_values.public.description;
            if (data.export_type !== settings_config.export_type_values.public.value) {
                export_type_description =
                    settings_config.export_type_values.full_with_consent.description;
            }

            return render_admin_export_list({
                realm_export: {
                    id: data.id,
                    acting_user: people.get_full_name(data.acting_user_id),
                    // Convert seconds -> milliseconds
                    event_time: timerender.relative_time_string_from_date(
                        new Date(data.export_time * 1000),
                    ),
                    url: data.export_url,
                    time_failed: failed_timestamp,
                    pending: data.pending,
                    time_deleted: deleted_timestamp,
                    export_type_description,
                },
            });
        },
        filter: {
            $element: $exports_table
                .closest(".settings-section")
                .find<HTMLInputElement>("input.search"),
            predicate(item, value) {
                return people.get_full_name(item.acting_user_id).toLowerCase().includes(value);
            },
            onupdate() {
                scroll_util.reset_scrollbar($exports_table);
            },
        },
        $parent_container: $('[data-export-section="data-exports"]').expectOne(),
        init_sort: sort_user,
        sort_fields: {
            user: sort_user,
            ...ListWidget.generic_sort_functions("numeric", ["export_time"]),
        },
        $simplebar_container: $('[data-export-section="data-exports"] .progressive-table-wrapper'),
    });

    const $spinner = $(".export_row .export_url_spinner");
    if ($spinner.length > 0) {
        loading.make_indicator($spinner);
    } else {
        loading.destroy_indicator($spinner);
    }
}

function sort_user_by_name(a: ExportConsent, b: ExportConsent): number {
    const a_name = people.get_full_name(a.user_id).toLowerCase();
    const b_name = people.get_full_name(b.user_id).toLowerCase();
    if (a_name > b_name) {
        return 1;
    } else if (a_name === b_name) {
        return 0;
    }
    return -1;
}
type UserConsentInfo = {
    consented: boolean;
    email_address_visibility: number;
};
const export_consents = new Map<number, UserConsentInfo>();
const queued_export_consents: (ExportConsent | number)[] = [];
let export_consent_list_widget: ListWidgetType<ExportConsent>;
let filter_by_consent_dropdown_widget: DropdownWidget;
const filter_by_consent_options: Option[] = [
    {
        unique_id: 0,
        name: $t({defaultMessage: "Granted"}),
    },
    {
        unique_id: 1,
        name: $t({defaultMessage: "Not granted"}),
    },
];

function get_export_consents_having_consent_value(consent: boolean): ExportConsent[] {
    const export_consent_list: ExportConsent[] = [];
    for (const [user_id, user_consent_info] of export_consents.entries()) {
        const consented = user_consent_info.consented;
        const email_address_visibility = user_consent_info.email_address_visibility;
        if (consent === user_consent_info.consented) {
            export_consent_list.push({
                user_id,
                consented,
                email_address_visibility,
            });
        }
    }
    return export_consent_list;
}

function get_export_consents_having_email_visibility_value(
    email_address_visibility_code: number,
): ExportConsent[] {
    const export_consent_list: ExportConsent[] = [];
    for (const [user_id, user_consent_info] of export_consents.entries()) {
        const consented = user_consent_info.consented;
        const email_address_visibility = user_consent_info.email_address_visibility;
        if (email_address_visibility_code === email_address_visibility) {
            export_consent_list.push({
                user_id,
                consented,
                email_address_visibility,
            });
        }
    }
    return export_consent_list;
}

export function redraw_export_consents_list(): void {
    let new_list_data;
    if (filter_by_consent_dropdown_widget.value() === filter_by_consent_options[0]!.unique_id) {
        new_list_data = get_export_consents_having_consent_value(true);
    } else {
        new_list_data = get_export_consents_having_consent_value(false);
    }
    export_consent_list_widget.replace_list_data(new_list_data);
}

export function populate_export_consents_table(): void {
    if (!meta.loaded) {
        return;
    }

    const $export_consents_table = $("#admin_export_consents_table").expectOne();
    export_consent_list_widget = ListWidget.create(
        $export_consents_table,
        get_export_consents_having_consent_value(true),
        {
            name: "admin_export_consents_list",
            get_item: ListWidget.default_get_item,
            modifier_html(item) {
                const person = people.get_by_user_id(item.user_id);
                let consent = $t({defaultMessage: "Not granted"});
                if (item.consented) {
                    consent = $t({defaultMessage: "Granted"});
                }
                return render_admin_export_consent_list({
                    export_consent: {
                        user_id: person.user_id,
                        full_name: person.full_name,
                        img_src: people.small_avatar_url_for_person(person),
                        consent,
                    },
                });
            },
            filter: {
                $element: $export_consents_table
                    .closest(".export_section")
                    .find<HTMLInputElement>("input.search"),
                predicate(item, value) {
                    return people.get_full_name(item.user_id).toLowerCase().includes(value);
                },
                onupdate() {
                    scroll_util.reset_scrollbar($export_consents_table);
                },
            },
            $parent_container: $('[data-export-section="export-permissions"]').expectOne(),
            init_sort: sort_user_by_name,
            sort_fields: {
                full_name: sort_user_by_name,
            },
            $simplebar_container: $(
                '[data-export-section="export-permissions"] .progressive-table-wrapper',
            ),
        },
    );

    filter_by_consent_dropdown_widget = new dropdown_widget.DropdownWidget({
        widget_name: "filter_by_consent",
        unique_id_type: "number",
        get_options: () => filter_by_consent_options,
        item_click_callback(
            event: JQuery.ClickEvent,
            dropdown: tippy.Instance,
            widget: dropdown_widget.DropdownWidget,
        ) {
            event.preventDefault();
            event.stopPropagation();

            redraw_export_consents_list();

            dropdown.hide();
            widget.render();
        },
        $events_container: $("#data-exports"),
        default_id: filter_by_consent_options[0]!.unique_id,
        hide_search_box: true,
    });
    filter_by_consent_dropdown_widget.setup();
}

function maybe_show_allow_private_data_export_banner(): void {
    if (!user_settings.allow_private_data_export) {
        const context = {
            banner_type: compose_banner.WARNING,
            classname: "allow_private_data_export_warning",
            hide_close_button: true,
        };
        $("#allow_private_data_export_banner_container").html(
            render_allow_private_data_export_banner(context),
        );
    }
}

export function refresh_allow_private_data_export_banner(): void {
    if (user_settings.allow_private_data_export) {
        $(".allow_private_data_export_warning").remove();
    } else if ($("#allow_private_data_export_banner_container").length > 0) {
        maybe_show_allow_private_data_export_banner();
        const $export_type = $<HTMLSelectOneElement>("select:not([multiple])#export_type");
        const selected_export_type = Number.parseInt($export_type.val()!, 10);
        if (selected_export_type === settings_config.export_type_values.public.value) {
            $(".allow_private_data_export_warning").hide();
        }
    }
}

function maybe_show_notes_about_unusable_users_if_exported(export_type: number): void {
    // Show warnings if there are users whose accounts will be inaccessible
    // once exported. A user account will be inaccessible if they:
    //  - Don’t consent to their private data being exported and “Standard
    //    export” is selected.
    //  - Have set their email visibility to “nobody” and “Public export”
    //    is selected.
    let unusable_user_ids: number[] = [];
    const $warning_container = $("div#unusable-user-accounts-warning");
    $warning_container.empty();
    if (export_type === settings_config.export_type_values.full_with_consent.value) {
        const non_consenting_users = get_export_consents_having_consent_value(false);
        unusable_user_ids = non_consenting_users.map((user) => user.user_id);
    } else if (export_type === settings_config.export_type_values.public.value) {
        const users_with_inaccessible_email = get_export_consents_having_email_visibility_value(
            settings_config.email_address_visibility_values.nobody.code,
        );
        unusable_user_ids = users_with_inaccessible_email.map((user) => user.user_id);
    } else {
        return;
    }

    if (unusable_user_ids.length === 0) {
        return;
    }

    // List admins/owners who won’t be able to log in.
    const admins_or_owners_with_unusable_account = people.get_users_that_match_role_ids(
        new Set(unusable_user_ids),
        new Set([
            settings_config.user_role_values.admin.code,
            settings_config.user_role_values.owner.code,
        ]),
    );

    const $export_warnings = render_export_modal_warning_notes({
        unusable_user_count: unusable_user_ids.length,
        unusable_admin_users: admins_or_owners_with_unusable_account,
        unusable_admin_user_count: admins_or_owners_with_unusable_account.length,
    });
    $warning_container.append($export_warnings);
}

function show_start_export_modal(): void {
    const html_body = render_start_export_modal({
        export_type_values: settings_config.export_type_values,
    });

    function start_export(): void {
        dialog_widget.show_dialog_spinner();
        const $export_status = $("#export_status");
        const export_type = Number.parseInt(
            $<HTMLSelectOneElement>("select:not([multiple])#export_type").val()!,
            10,
        );

        void channel.post({
            url: "/json/export/realm",
            data: {export_type},
            success() {
                dialog_widget.hide_dialog_spinner();
                ui_report.success(
                    $t_html({defaultMessage: "Export started. Check back in a few minutes."}),
                    $export_status,
                    4000,
                );
                dialog_widget.close();
            },
            error(xhr) {
                dialog_widget.hide_dialog_spinner();
                ui_report.error($t_html({defaultMessage: "Export failed"}), xhr, $export_status);
                dialog_widget.close();
            },
        });
    }

    function start_export_modal_post_render(): void {
        $("#allow_private_data_export_stats").text(
            $t(
                {
                    defaultMessage: `
                        Exporting private data for {users_consented_for_export_count,
                        plural, one {# user} other {# users}} ({total_users_count,
                        plural, one {# user} other {# users}} total).
                    `,
                },
                {users_consented_for_export_count, total_users_count},
            ),
        );

        maybe_show_allow_private_data_export_banner();

        const $export_type = $<HTMLSelectOneElement>("select:not([multiple])#export_type");
        $export_type.on("change", () => {
            const selected_export_type = Number.parseInt($export_type.val()!, 10);
            if (
                selected_export_type === settings_config.export_type_values.full_with_consent.value
            ) {
                $("#allow_private_data_export_stats").show();
                $(".allow_private_data_export_warning").show();
            } else {
                $("#allow_private_data_export_stats").hide();
                $(".allow_private_data_export_warning").hide();
            }
            maybe_show_notes_about_unusable_users_if_exported(selected_export_type);
        });
        $export_type.trigger("change");
    }

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Start export?"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Start export"}),
        id: "start-export-modal",
        loading_spinner: true,
        on_click: start_export,
        post_render: start_export_modal_post_render,
    });
}

export function set_up(): void {
    meta.loaded = true;

    const toggler = components.toggle({
        child_wants_focus: true,
        values: [
            {label: $t({defaultMessage: "Data exports"}), key: "data-exports"},
            {label: $t({defaultMessage: "Export permissions"}), key: "export-permissions"},
        ],
        callback(_name, key) {
            $(".export_section").hide();
            $(`[data-export-section="${CSS.escape(key)}"]`).show();
        },
    });

    toggler.get().prependTo($("#data-exports .tab-container"));
    toggler.goto("data-exports");

    // Do an initial population of the 'Export permissions' table
    void channel.get({
        url: "/json/export/realm/consents",
        success(raw_data) {
            const data = z
                .object({export_consents: z.array(export_consent_schema)})
                .parse(raw_data);

            for (const export_consent of data.export_consents) {
                export_consents.set(export_consent.user_id, {
                    consented: export_consent.consented,
                    email_address_visibility: export_consent.email_address_visibility,
                });
            }

            // Apply queued_export_consents on top of the received response.
            for (const item of queued_export_consents) {
                if (typeof item === "number") {
                    // user deactivated; item is user_id in this case.
                    export_consents.delete(item);
                    continue;
                }
                export_consents.set(item.user_id, {
                    consented: item.consented,
                    email_address_visibility: item.email_address_visibility,
                });
            }
            queued_export_consents.length = 0;

            total_users_count = export_consents.size;
            users_consented_for_export_count =
                get_export_consents_having_consent_value(true).length;
            populate_export_consents_table();
        },
    });

    $("#start-export-button").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        show_start_export_modal();
    });

    // Do an initial population of the 'Data exports' table
    void channel.get({
        url: "/json/export/realm",
        success(raw_data) {
            const data = z.object({exports: z.array(realm_export_schema)}).parse(raw_data);
            populate_exports_table(data.exports);
        },
    });

    $(".admin_exports_table").on("click", ".delete", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $button = $(this);
        const url =
            "/json/export/realm/" +
            encodeURIComponent($button.closest("tr").attr("data-export-id")!);
        const html_body = render_confirm_delete_data_export();

        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Delete data export?"}),
            html_body,
            on_click() {
                dialog_widget.submit_api_request(channel.del, url, {});
            },
            loading_spinner: true,
        });
    });
}

function maybe_store_export_consent_data_and_return(export_consent: ExportConsent): boolean {
    // Handles a race where the client has requested the server for export consents
    // to populate 'Export permissions' table but hasn't received the response yet,
    // but received a few updated events which should be applied on top of the received
    // response to avoid outdated table.
    // We store the export_consent data received via events to apply them on top of
    // the received response.
    if (export_consents === undefined) {
        queued_export_consents.push(export_consent);
        return true;
    }
    return false;
}

function update_start_export_modal_stats(): void {
    total_users_count = export_consents.size;
    users_consented_for_export_count = get_export_consents_having_consent_value(true).length;
    if ($("#allow_private_data_export_stats").length > 0) {
        $("#allow_private_data_export_stats").text(
            $t(
                {
                    defaultMessage: `
                        Exporting private data for {users_consented_for_export_count,
                        plural, one {# user} other {# users}} ({total_users_count,
                        plural, one {# user} other {# users}} total).
                    `,
                },
                {users_consented_for_export_count, total_users_count},
            ),
        );
    }
}

export function remove_export_consent_data_and_redraw(user_id: number): void {
    if (!meta.loaded) {
        return;
    }

    if (export_consents === undefined) {
        queued_export_consents.push(user_id);
        return;
    }

    export_consents.delete(user_id);
    redraw_export_consents_list();
    update_start_export_modal_stats();
}

export function update_export_consent_data_and_redraw(export_consent: ExportConsent): void {
    if (!meta.loaded) {
        return;
    }

    if (maybe_store_export_consent_data_and_return(export_consent)) {
        return;
    }

    export_consents.set(export_consent.user_id, {
        consented: export_consent.consented,
        email_address_visibility: export_consent.email_address_visibility,
    });
    redraw_export_consents_list();
    update_start_export_modal_stats();
}
```

--------------------------------------------------------------------------------

---[FILE: settings_folders.ts]---
Location: zulip-main/web/src/settings_folders.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import SortableJS from "sortablejs";

import render_admin_channel_folder_list_item from "../templates/settings/admin_channel_folder_list_item.hbs";

import * as channel from "./channel.ts";
import * as channel_folders from "./channel_folders.ts";
import type {ChannelFolder} from "./channel_folders.ts";
import * as channel_folders_ui from "./channel_folders_ui.ts";
import * as ListWidget from "./list_widget.ts";
import type {ListWidget as ListWidgetType} from "./list_widget.ts";
import {postprocess_content} from "./postprocess_content.ts";
import type {ChannelFolderUpdateEvent} from "./server_event_types.ts";
import * as settings_ui from "./settings_ui.ts";
import {current_user} from "./state_data.ts";
import * as util from "./util.ts";

const meta = {
    loaded: false,
};

let folders_list_widget: ListWidgetType<ChannelFolder, ChannelFolder>;

function update_folder_order(this: HTMLElement): void {
    const order: number[] = [];
    $(".channel-folder-row").each(function () {
        order.push(Number.parseInt($(this).attr("data-channel-folder-id")!, 10));
    });
    const archived_folders = channel_folders
        .get_channel_folders(true)
        .filter((folder) => folder.is_archived);
    archived_folders.sort((a, b) => util.strcmp(a.name.toLowerCase(), b.name.toLowerCase()));
    for (const folder of archived_folders) {
        order.push(folder.id);
    }

    const opts = {
        error_continuation() {
            assert(folders_list_widget !== undefined);
            const folders = channel_folders.get_channel_folders();
            folders_list_widget.replace_list_data(folders);
        },
    };
    settings_ui.do_settings_change(
        channel.patch,
        "/json/channel_folders",
        {order: JSON.stringify(order)},
        $("#admin-channel-folder-status").expectOne(),
        opts,
    );
}

export function do_populate_channel_folders(): void {
    const folders_data = channel_folders.get_channel_folders();

    const $channel_folders_table = $("#admin_channel_folders_table").expectOne();

    folders_list_widget = ListWidget.create($channel_folders_table, folders_data, {
        name: "channel_folders_list",
        get_item(folder) {
            return folder;
        },
        modifier_html(folder) {
            return render_admin_channel_folder_list_item({
                folder_name: folder.name,
                rendered_description: folder.rendered_description,
                id: folder.id,
                is_admin: current_user.is_admin,
            });
        },
        $parent_container: $("#channel-folder-settings").expectOne(),
        $simplebar_container: $("#channel-folder-settings .progressive-table-wrapper"),
    });

    if (current_user.is_admin) {
        const field_list = util.the($("#admin_channel_folders_table"));
        SortableJS.create(field_list, {
            onUpdate: update_folder_order,
            filter: "input",
            preventOnFilter: false,
        });
    }
}

export function populate_channel_folders(): void {
    if (!meta.loaded) {
        // If outside callers call us when we're not loaded, just
        // exit and we'll draw the widgets again during set_up().
        return;
    }
    do_populate_channel_folders();
}

export function set_up(): void {
    do_populate_channel_folders();
    meta.loaded = true;

    $("#channel-folder-settings").on(
        "click",
        ".add-channel-folder-button",
        channel_folders_ui.add_channel_folder,
    );
    $("#channel-folder-settings").on("click", ".edit-channel-folder-button", (e) => {
        const folder_id = Number.parseInt(
            $(e.target).closest(".channel-folder-row").attr("data-channel-folder-id")!,
            10,
        );
        channel_folders_ui.handle_editing_channel_folder(folder_id);
    });
    $("#channel-folder-settings").on("click", ".archive-channel-folder-button", (e) => {
        const folder_id = Number.parseInt(
            $(e.target).closest(".channel-folder-row").attr("data-channel-folder-id")!,
            10,
        );
        channel_folders_ui.handle_archiving_channel_folder(folder_id);
    });
}

export function reset(): void {
    meta.loaded = false;
}

function get_channel_folder_row(folder_id: number): JQuery {
    return $("#admin_channel_folders_table").find(
        `tr.channel-folder-row[data-channel-folder-id='${CSS.escape(folder_id.toString())}']`,
    );
}

export function update_folder_row(event: ChannelFolderUpdateEvent): void {
    if (!meta.loaded) {
        return;
    }

    const folder_id = event.channel_folder_id;
    const $folder_row = get_channel_folder_row(folder_id);

    if (event.data.name !== undefined) {
        $folder_row.find(".channel-folder-name").text(event.data.name);
    }

    if (event.data.description !== undefined) {
        const folder = channel_folders.get_channel_folder_by_id(folder_id);
        $folder_row
            .find(".channel-folder-description")
            .html(postprocess_content(folder.rendered_description));
    }

    if (event.data.is_archived) {
        $folder_row.remove();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: settings_invites.ts]---
Location: zulip-main/web/src/settings_invites.ts
Signals: Zod

```typescript
import $ from "jquery";
import * as z from "zod/mini";

import render_settings_resend_invite_modal from "../templates/confirm_dialog/confirm_resend_invite.hbs";
import render_settings_revoke_invite_modal from "../templates/confirm_dialog/confirm_revoke_invite.hbs";
import render_admin_invites_list from "../templates/settings/admin_invites_list.hbs";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import * as loading from "./loading.ts";
import * as people from "./people.ts";
import * as settings_config from "./settings_config.ts";
import * as settings_data from "./settings_data.ts";
import {current_user} from "./state_data.ts";
import * as timerender from "./timerender.ts";
import * as ui_report from "./ui_report.ts";
import * as util from "./util.ts";

export const invite_schema = z.intersection(
    z.object({
        invited_by_user_id: z.number(),
        invited: z.number(),
        expiry_date: z.nullable(z.number()),
        id: z.number(),
        invited_as: z.number(),
    }),
    z.discriminatedUnion("is_multiuse", [
        z.object({
            is_multiuse: z.literal(false),
            email: z.string(),
            notify_referrer_on_join: z.boolean(),
        }),
        z.object({
            is_multiuse: z.literal(true),
            link_url: z.string(),
        }),
    ]),
);
type Invite = z.output<typeof invite_schema> & {
    invited_as_text?: string | undefined;
    invited_absolute_time?: string;
    expiry_date_absolute_time?: string;
    is_admin?: boolean;
    disable_buttons?: boolean;
    referrer_name?: string;
    img_src?: string;
    notify_referrer_on_join?: boolean;
};

const meta = {
    loaded: false,
};

export function reset(): void {
    meta.loaded = false;
}

function failed_listing_invites(xhr: JQuery.jqXHR): void {
    loading.destroy_indicator($("#admin_page_invites_loading_indicator"));
    ui_report.error(
        $t_html({defaultMessage: "Error listing invites"}),
        xhr,
        $("#invites-field-status"),
    );
}

function add_invited_as_text(invites: Invite[]): void {
    for (const data of invites) {
        data.invited_as_text = settings_config.user_role_map.get(data.invited_as);
    }
}

function sort_invitee(a: Invite, b: Invite): number {
    // multi-invite links don't have an email field,
    // so we set them to empty strings to let them
    // sort to the top
    const str1 = a.is_multiuse ? "" : a.email.toUpperCase();
    const str2 = b.is_multiuse ? "" : b.email.toUpperCase();

    return util.strcmp(str1, str2);
}

function populate_invites(invites_data: {invites: Invite[]}): void {
    if (!meta.loaded) {
        return;
    }

    add_invited_as_text(invites_data.invites);

    const $invites_table = $("#admin_invites_table").expectOne();
    ListWidget.create($invites_table, invites_data.invites, {
        name: "admin_invites_list",
        get_item: ListWidget.default_get_item,
        modifier_html(item) {
            item.invited_absolute_time = timerender.absolute_time(item.invited * 1000);
            if (item.expiry_date !== null) {
                item.expiry_date_absolute_time = timerender.absolute_time(item.expiry_date * 1000);
            }
            item.is_admin = current_user.is_admin;
            item.disable_buttons =
                item.invited_as === settings_config.user_role_values.owner.code &&
                !current_user.is_owner;
            item.referrer_name = people.get_by_user_id(item.invited_by_user_id).full_name;
            item.img_src = people.small_avatar_url_for_person(
                people.get_by_user_id(item.invited_by_user_id),
            );
            return render_admin_invites_list({invite: item});
        },
        filter: {
            $element: $invites_table
                .closest(".user-settings-section")
                .find<HTMLInputElement>("input.search"),
            predicate(item, value) {
                const referrer = people.get_by_user_id(item.invited_by_user_id);
                const referrer_email = referrer.email;
                const referrer_name = referrer.full_name;
                const referrer_name_matched = referrer_name.toLowerCase().includes(value);
                const referrer_email_matched = referrer_email.toLowerCase().includes(value);
                if (item.is_multiuse) {
                    return referrer_name_matched || referrer_email_matched;
                }
                const invitee_email_matched = item.email.toLowerCase().includes(value);
                return referrer_email_matched || referrer_name_matched || invitee_email_matched;
            },
        },
        $parent_container: $("#admin-invites-list").expectOne(),
        init_sort: sort_invitee,
        sort_fields: {
            invitee: sort_invitee,
            ...ListWidget.generic_sort_functions("alphabetic", ["referrer_name"]),
            ...ListWidget.generic_sort_functions("numeric", [
                "invited",
                "expiry_date",
                "invited_as",
            ]),
        },
        $simplebar_container: $("#admin-invites-list .progressive-table-wrapper"),
    });

    loading.destroy_indicator($("#admin_page_invites_loading_indicator"));
}

function do_revoke_invite({
    $row,
    invite_id,
    is_multiuse,
}: {
    $row: JQuery;
    invite_id: string;
    is_multiuse: string;
}): void {
    const modal_invite_id = $(".dialog_submit_button").attr("data-invite-id");
    const modal_is_multiuse = $(".dialog_submit_button").attr("data-is-multiuse");

    if (modal_invite_id !== invite_id || modal_is_multiuse !== is_multiuse) {
        blueslip.error("Invite revoking canceled due to non-matching fields.");
        ui_report.client_error(
            $t_html({
                defaultMessage: "Error: Could not revoke invitation.",
            }),
            $("#revoke_invite_modal #dialog_error"),
        );
        dialog_widget.hide_dialog_spinner();
        return;
    }

    let url = "/json/invites/" + invite_id;

    if (modal_is_multiuse === "true") {
        url = "/json/invites/multiuse/" + invite_id;
    }
    void channel.del({
        url,
        error(xhr) {
            dialog_widget.hide_dialog_spinner();
            ui_report.error(
                $t_html({
                    defaultMessage: "Failed",
                }),
                xhr,
                $("#dialog_error"),
            );
        },
        success() {
            dialog_widget.hide_dialog_spinner();
            dialog_widget.close();
            $row.remove();
        },
    });
}

function do_resend_invite({$row, invite_id}: {$row: JQuery; invite_id: string}): void {
    const modal_invite_id = $(".dialog_submit_button").attr("data-invite-id");
    const $resend_button = $row.find("button.resend");
    const $check_button = $row.find("button.check");

    if (modal_invite_id !== invite_id) {
        blueslip.error("Invite resending canceled due to non-matching fields.");
        ui_report.client_error(
            $t_html({
                defaultMessage: "Error: Could not resend invitation.",
            }),
            $("#resend_invite_modal #dialog_error"),
        );
        dialog_widget.hide_dialog_spinner();
        return;
    }

    void channel.post({
        url: "/json/invites/" + invite_id + "/resend",
        error(xhr) {
            dialog_widget.hide_dialog_spinner();
            ui_report.error(
                $t_html({
                    defaultMessage: "Failed",
                }),
                xhr,
                $("#dialog_error"),
            );
        },
        success() {
            dialog_widget.hide_dialog_spinner();
            dialog_widget.close();

            $resend_button.hide();
            $check_button.removeClass("hide");

            // Showing a success checkmark for a short time (3 seconds).
            setTimeout(() => {
                $resend_button.show();
                $check_button.addClass("hide");
            }, 3000);
        },
    });
}

export function set_up(initialize_event_handlers = true): void {
    meta.loaded = true;

    // create loading indicators
    loading.make_indicator($("#admin_page_invites_loading_indicator"));

    // Populate invites table
    void channel.get({
        url: "/json/invites",
        timeout: 10 * 1000,
        success(raw_data) {
            const data = z.object({invites: z.array(invite_schema)}).parse(raw_data);
            on_load_success(data, initialize_event_handlers);
        },
        error: failed_listing_invites,
    });
}

export function on_load_success(
    invites_data: {invites: Invite[]},
    initialize_event_handlers: boolean,
): void {
    meta.loaded = true;
    populate_invites(invites_data);
    if (!initialize_event_handlers) {
        return;
    }
    $(".admin_invites_table").on("click", ".revoke", function (this: HTMLElement, e) {
        // This click event must not get propagated to parent container otherwise the modal
        // will not show up because of a call to `close_active` in `settings.ts`.
        e.preventDefault();
        e.stopPropagation();
        const $row = $(this).closest(".invite_row");
        const email = $row.find(".email").text();
        const referred_by = $row.find(".referred_by").text();
        const invite_id = $(this).closest("tr").attr("data-invite-id")!;
        const is_multiuse = $(this).closest("tr").attr("data-is-multiuse")!;
        const ctx = {
            is_multiuse: is_multiuse === "true",
            email,
            referred_by,
        };
        const html_body = render_settings_revoke_invite_modal(ctx);

        confirm_dialog.launch({
            html_heading: ctx.is_multiuse
                ? $t_html({defaultMessage: "Revoke invitation link"})
                : $t_html({defaultMessage: "Revoke invitation to {email}"}, {email}),
            html_body,
            id: "revoke_invite_modal",
            close_on_submit: false,
            loading_spinner: true,
            on_click() {
                do_revoke_invite({$row, invite_id, is_multiuse});
            },
        });

        $(".dialog_submit_button").attr("data-invite-id", invite_id);
        $(".dialog_submit_button").attr("data-is-multiuse", is_multiuse);
    });

    $(".admin_invites_table").on("click", ".resend", function (this: HTMLElement, e) {
        // This click event must not get propagated to parent container otherwise the modal
        // will not show up because of a call to `close_active` in `settings.ts`.
        e.preventDefault();
        e.stopPropagation();

        const $row = $(this).closest(".invite_row");
        const email = $row.find(".email").text();
        const invite_id = $(this).closest("tr").attr("data-invite-id")!;
        const html_body = render_settings_resend_invite_modal({email});

        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Resend invitation?"}),
            html_body,
            id: "resend_invite_modal",
            close_on_submit: false,
            loading_spinner: true,
            on_click() {
                do_resend_invite({$row, invite_id});
            },
        });

        $(".dialog_submit_button").attr("data-invite-id", invite_id);
    });
}

export function update_invite_users_setting_tip(): void {
    if (settings_data.user_can_invite_users_by_email()) {
        $(".invite-user-settings-banner").hide();
        return;
    }

    $(".invite-user-settings-banner").show();
}

export function update_invite_user_panel(): void {
    update_invite_users_setting_tip();
    if (
        !settings_data.user_can_invite_users_by_email() &&
        !settings_data.user_can_create_multiuse_invite()
    ) {
        $("#admin-invites-list .invite-user-link").hide();
    } else {
        $("#admin-invites-list .invite-user-link").show();
    }
}
```

--------------------------------------------------------------------------------

````

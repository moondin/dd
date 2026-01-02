---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 676
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 676 of 1290)

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

---[FILE: settings_panel_menu.ts]---
Location: zulip-main/web/src/settings_panel_menu.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import * as browser_history from "./browser_history.ts";
import * as components from "./components.ts";
import type {Toggle} from "./components.ts";
import {$t, $t_html} from "./i18n.ts";
import * as keydown_util from "./keydown_util.ts";
import * as popovers from "./popovers.ts";
import * as scroll_util from "./scroll_util.ts";
import {redraw_all_bots_list, redraw_your_bots_list} from "./settings_bots.ts";
import {resize_textareas_in_section} from "./settings_components.ts";
import * as settings_sections from "./settings_sections.ts";
import {redraw_active_users_list, redraw_deactivated_users_list} from "./settings_users.ts";
import * as util from "./util.ts";

export let normal_settings: SettingsPanelMenu;
export let org_settings: SettingsPanelMenu;

export function mobile_deactivate_section(): void {
    const $settings_overlay_container = $("#settings_overlay_container");
    $settings_overlay_container.find(".right").removeClass("show");
    $settings_overlay_container.find(".settings-header.mobile").removeClass("slide-left");
}

export function mobile_activate_section(): void {
    const $settings_overlay_container = $("#settings_overlay_container");
    $settings_overlay_container.find(".right").addClass("show");
    $settings_overlay_container.find(".settings-header.mobile").addClass("slide-left");
}

function two_column_mode(): boolean {
    return Number.parseInt($("#settings_content").css("--column-count"), 10) === 2;
}

function set_settings_header(key: string): void {
    const selected_tab_key = $("#settings_page .tab-switcher .selected").attr("data-tab-key");
    let header_prefix = $t_html({defaultMessage: "Personal settings"});
    if (selected_tab_key === "organization") {
        header_prefix = $t_html({defaultMessage: "Organization settings"});
    }
    $(".settings-header h1 .header-prefix").text(header_prefix);

    const header_text = $(
        `#settings_page .sidebar-list [data-section='${CSS.escape(key)}'] .text`,
    ).text();
    if (header_text) {
        $(".settings-header h1 .section").text(" / " + header_text);
    } else {
        blueslip.warn(
            "Error: the key '" +
                key +
                "' does not exist in the settings" +
                " sidebar list. Please add it.",
        );
    }
}

export class SettingsPanelMenu {
    $main_elem: JQuery;
    hash_prefix: string;
    $curr_li: JQuery;
    current_tab: string;
    current_user_settings_tab: string | undefined;
    current_bot_settings_tab: string | undefined;
    org_user_settings_toggler: Toggle;
    org_bot_settings_toggler: Toggle;

    constructor(opts: {$main_elem: JQuery; hash_prefix: string}) {
        this.$main_elem = opts.$main_elem;
        this.hash_prefix = opts.hash_prefix;
        this.$curr_li = this.$main_elem.children("li").eq(0);
        this.current_tab = this.$curr_li.attr("data-section")!;
        this.current_user_settings_tab = "active";
        this.current_bot_settings_tab = "all-bots";
        this.org_user_settings_toggler = components.toggle({
            html_class: "org-user-settings-switcher",
            child_wants_focus: true,
            values: [
                {label: $t({defaultMessage: "Users"}), key: "active"},
                {
                    label: $t({defaultMessage: "Deactivated"}),
                    key: "deactivated",
                },
                {label: $t({defaultMessage: "Invitations"}), key: "invitations"},
            ],
            callback: (_name, key) => {
                browser_history.update(`#organization/users/${key}`);
                this.set_user_settings_tab(key);
                $(".user-settings-section").hide();
                if (key === "active") {
                    redraw_active_users_list();
                } else if (key === "deactivated") {
                    redraw_deactivated_users_list();
                }
                $(`[data-user-settings-section="${CSS.escape(key)}"]`).show();
            },
        });

        this.org_bot_settings_toggler = components.toggle({
            html_class: "org-bot-settings-switcher",
            child_wants_focus: true,
            values: [
                {label: $t({defaultMessage: "All bots"}), key: "all-bots"},
                {
                    label: $t({defaultMessage: "Your bots"}),
                    key: "your-bots",
                },
            ],
            callback: (_name, key) => {
                browser_history.update(`#organization/bots/${key}`);
                this.set_bot_settings_tab(key);
                $(".bot-settings-section").hide();
                if (key === "all-bots") {
                    redraw_all_bots_list();
                } else if (key === "your-bots") {
                    redraw_your_bots_list();
                }
                $(`[data-bot-settings-section="${CSS.escape(key)}"]`).show();
            },
        });

        this.$main_elem.on("click", "li[data-section]", (e) => {
            const section = $(e.currentTarget).attr("data-section")!;

            const settings_tab = this.get_settings_tab(section);
            this.activate_section_or_default(section, settings_tab);
            // You generally want to add logic to activate_section,
            // not to this click handler.

            e.stopPropagation();
        });
    }

    show(): void {
        this.$main_elem.show();
        const section = this.current_tab;

        const activate_section_for_mobile = two_column_mode();
        const settings_tab = this.get_settings_tab(section);
        this.activate_section_or_default(section, settings_tab, activate_section_for_mobile);
        this.$curr_li.trigger("focus");
    }

    show_org_user_settings_toggler(): void {
        if ($("#admin-user-list").find(".tab-switcher").length === 0) {
            const toggler_html = util.the(this.org_user_settings_toggler.get());
            $("#admin-user-list .tab-container").html(toggler_html);

            // We need to re-register these handlers since they are
            // destroyed once the settings modal closes.
            this.org_user_settings_toggler.register_event_handlers();
            this.set_key_handlers(this.org_user_settings_toggler, $(".org-user-settings-switcher"));
        }
    }

    show_org_bot_settings_toggler(): void {
        if ($("#admin-bot-list").find(".tab-switcher").length === 0) {
            const toggler_html = util.the(this.org_bot_settings_toggler.get());
            $("#admin-bot-list .tab-container").html(toggler_html);

            // We need to re-register these handlers since they are
            // destroyed once the settings modal closes.
            this.org_bot_settings_toggler.register_event_handlers();
            this.set_key_handlers(this.org_bot_settings_toggler, $(".org-bot-settings-switcher"));
        }
    }

    hide(): void {
        this.$main_elem.hide();
    }

    li_for_section(section: string): JQuery {
        const $li = $(`#settings_overlay_container li[data-section='${CSS.escape(section)}']`);
        return $li;
    }

    set_key_handlers(toggler: Toggle, $elem = this.$main_elem): void {
        const {vim_left, vim_right, vim_up, vim_down} = keydown_util;
        keydown_util.handle({
            $elem,
            handlers: {
                ArrowLeft: toggler.maybe_go_left,
                ArrowRight: toggler.maybe_go_right,
                Enter: () => this.enter_panel(),
                ArrowUp: () => this.prev(),
                ArrowDown: () => this.next(),

                // Binding vim keys as well
                [vim_left]: toggler.maybe_go_left,
                [vim_right]: toggler.maybe_go_right,
                [vim_up]: () => this.prev(),
                [vim_down]: () => this.next(),
            },
        });
    }

    prev(): boolean {
        const li = [...this.$curr_li.prevAll()].find((li) => li.getClientRects().length);
        li?.focus();
        li?.click();
        return true;
    }

    next(): boolean {
        const li = [...this.$curr_li.nextAll()].find((li) => li.getClientRects().length);
        li?.focus();
        li?.click();
        return true;
    }

    enter_panel(): boolean {
        const $panel = this.get_panel();
        [...$panel.find("input,button,select")]
            .find((element) => element.getClientRects().length)
            ?.focus();
        return true;
    }

    set_current_tab(tab: string): void {
        this.current_tab = tab;
    }

    set_user_settings_tab(tab: string | undefined): void {
        this.current_user_settings_tab = tab;
    }

    set_bot_settings_tab(tab: string | undefined): void {
        this.current_bot_settings_tab = tab;
    }

    get_settings_tab(section: string): string | undefined {
        if (section === "users") {
            return this.current_user_settings_tab;
        }

        if (section === "bots") {
            return this.current_bot_settings_tab;
        }

        return undefined;
    }

    activate_section_or_default(
        section: string | undefined,
        settings_tab?: string,
        activate_section_for_mobile = true,
    ): void {
        popovers.hide_all();
        if (!section) {
            // No section is given so we display the default.

            if (two_column_mode()) {
                // In two column mode we resume to the last active section.
                section = this.current_tab;
            } else {
                // In single column mode we close the active section
                // so that you always start at the settings list.
                mobile_deactivate_section();
                return;
            }
        }

        const $li_for_section = this.li_for_section(section);
        if ($li_for_section.length === 0) {
            // This happens when there is no such section or the user does not have
            // permission to view that section.
            section = this.current_tab;
        } else {
            this.$curr_li = $li_for_section;
        }

        this.$main_elem.children("li").removeClass("active");
        this.$curr_li.addClass("active");
        this.set_current_tab(section);

        if (section !== "users" && section !== "bots") {
            const settings_section_hash = "#" + this.hash_prefix + section;

            // It could be that the hash has already been set.
            browser_history.update_hash_internally_if_required(settings_section_hash);
        }
        if (section === "users" && this.org_user_settings_toggler !== undefined) {
            assert(settings_tab !== undefined);
            this.show_org_user_settings_toggler();
            this.org_user_settings_toggler.goto(settings_tab);
        }

        if (section === "bots" && this.org_bot_settings_toggler !== undefined) {
            assert(settings_tab !== undefined);
            this.show_org_bot_settings_toggler();
            this.org_bot_settings_toggler.goto(settings_tab);
        }

        $(".settings-section").removeClass("show");

        settings_sections.load_settings_section(section);

        this.get_panel().addClass("show");

        scroll_util.reset_scrollbar($("#settings_content"));

        if (activate_section_for_mobile) {
            mobile_activate_section();
        }

        set_settings_header(section);
        resize_textareas_in_section(this.get_panel());
    }

    get_panel(): JQuery {
        const section = this.$curr_li.attr("data-section")!;
        const sel = `[data-name='${CSS.escape(section)}']`;
        const $panel = $(".settings-section" + sel);
        return $panel;
    }
}

export function initialize(): void {
    normal_settings = new SettingsPanelMenu({
        $main_elem: $(".normal-settings-list"),
        hash_prefix: "settings/",
    });
    org_settings = new SettingsPanelMenu({
        $main_elem: $(".org-settings-list"),
        hash_prefix: "organization/",
    });
}

export function show_normal_settings(): void {
    org_settings.hide();
    normal_settings.show();
}

export function show_org_settings(): void {
    normal_settings.hide();
    org_settings.show();
}

export function set_key_handlers(toggler: Toggle): void {
    normal_settings.set_key_handlers(toggler);
    org_settings.set_key_handlers(toggler);
}
```

--------------------------------------------------------------------------------

---[FILE: settings_playgrounds.ts]---
Location: zulip-main/web/src/settings_playgrounds.ts

```typescript
import $ from "jquery";

import render_confirm_delete_playground from "../templates/confirm_dialog/confirm_delete_playground.hbs";
import render_admin_playground_list from "../templates/settings/admin_playground_list.hbs";

import {Typeahead} from "./bootstrap_typeahead.ts";
import * as bootstrap_typeahead from "./bootstrap_typeahead.ts";
import type {TypeaheadInputElement} from "./bootstrap_typeahead.ts";
import * as channel from "./channel.ts";
import * as confirm_dialog from "./confirm_dialog.ts";
import * as dialog_widget from "./dialog_widget.ts";
import {$t_html} from "./i18n.ts";
import * as ListWidget from "./list_widget.ts";
import * as realm_playground from "./realm_playground.ts";
import type {RealmPlayground} from "./realm_playground.ts";
import * as scroll_util from "./scroll_util.ts";
import {current_user, realm} from "./state_data.ts";
import {render_typeahead_item} from "./typeahead_helper.ts";
import * as ui_report from "./ui_report.ts";

let pygments_typeahead: Typeahead<string>;

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
}

export function populate_playgrounds(playgrounds_data: RealmPlayground[]): void {
    if (!meta.loaded) {
        return;
    }
    const $playgrounds_table = $("#admin_playgrounds_table").expectOne();
    ListWidget.create<RealmPlayground>($playgrounds_table, playgrounds_data, {
        name: "playgrounds_list",
        get_item: ListWidget.default_get_item,
        modifier_html(playground) {
            return render_admin_playground_list({
                playground: {
                    playground_name: playground.name,
                    pygments_language: playground.pygments_language,
                    url_template: playground.url_template,
                    id: playground.id,
                },
                can_modify: current_user.is_admin,
            });
        },
        filter: {
            $element: $playgrounds_table
                .closest(".settings-section")
                .find<HTMLInputElement>("input.search"),
            predicate(item, value) {
                return (
                    item.name.toLowerCase().includes(value) ||
                    item.pygments_language.toLowerCase().includes(value)
                );
            },
            onupdate() {
                scroll_util.reset_scrollbar($playgrounds_table);
            },
        },
        $parent_container: $("#playground-settings").expectOne(),
        init_sort: "pygments_language_alphabetic",
        sort_fields: {
            ...ListWidget.generic_sort_functions("alphabetic", [
                "pygments_language",
                "name",
                "url_template",
            ]),
        },
        $simplebar_container: $("#playground-settings .progressive-table-wrapper"),
    });
}

export function set_up(): void {
    build_page();
    maybe_disable_widgets();
}

function build_page(): void {
    meta.loaded = true;
    populate_playgrounds(realm.realm_playgrounds);
    $(".admin_playgrounds_table").on("click", ".delete", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $button = $(this);
        const url =
            "/json/realm/playgrounds/" +
            encodeURIComponent($button.closest("tr").attr("data-playground-id")!);
        const html_body = render_confirm_delete_playground();

        confirm_dialog.launch({
            html_heading: $t_html({defaultMessage: "Delete code playground?"}),
            html_body,
            id: "confirm_delete_code_playgrounds_modal",
            on_click() {
                dialog_widget.submit_api_request(channel.del, url, {});
            },
            loading_spinner: true,
        });
    });

    $(".organization form.admin-playground-form")
        .off("submit")
        .on("submit", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const $playground_status = $("#admin-playground-status");
            const $add_playground_button = $(".new-playground-form button");
            $add_playground_button.prop("disabled", true);
            $playground_status.hide();
            const data = {
                name: $("#playground_name").val(),
                pygments_language: $("#playground_pygments_language").val(),
                url_template: $("#playground_url_template").val(),
            };
            void channel.post({
                url: "/json/realm/playgrounds",
                data,
                success() {
                    $("#playground_pygments_language").val("");
                    $("#playground_name").val("");
                    $("#playground_url_template").val("");
                    $add_playground_button.prop("disabled", false);
                    ui_report.success(
                        $t_html({defaultMessage: "Custom playground added!"}),
                        $playground_status,
                        3000,
                    );
                    // FIXME: One thing to note here is that the "view code in playground"
                    // option for an already rendered code block (tagged with this newly added
                    // language) would not be visible without a re-render. To fix this, we should
                    // probably do some extraction in `rendered_markdown.ts` which does a
                    // live-update of the `data-code-language` parameter in code blocks. Or change
                    // how we do the HTML in the frontend so that the icon labels/behavior are
                    // computed dynamically when you hover over the message based on configured
                    // playgrounds. Since this isn't high priority right now, we can probably
                    // take this up later.
                },
                error(xhr) {
                    $add_playground_button.prop("disabled", false);
                    ui_report.error(
                        $t_html({defaultMessage: "Failed"}),
                        xhr,
                        $playground_status,
                        3000,
                    );
                },
            });
        });

    const $search_pygments_box = $<HTMLInputElement>("input#playground_pygments_language");
    let language_labels = new Map<string, string>();

    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $search_pygments_box,
        type: "input",
    };

    pygments_typeahead = new Typeahead(bootstrap_typeahead_input, {
        source(query: string): string[] {
            language_labels = realm_playground.get_pygments_typeahead_list_for_settings(query);
            return [...language_labels.keys()];
        },
        helpOnEmptyStrings: true,
        item_html: (item: string): string =>
            render_typeahead_item({primary: language_labels.get(item)}),
        matcher(item: string, query: string): boolean {
            const q = query.trim().toLowerCase();
            return item.toLowerCase().startsWith(q);
        },
        sorter(items: string[], query: string): string[] {
            return bootstrap_typeahead.defaultSorter(items, query);
        },
    });

    $search_pygments_box.on("click", (e) => {
        pygments_typeahead.lookup(false);
        $search_pygments_box.trigger("select");
        e.preventDefault();
        e.stopPropagation();
    });
}
```

--------------------------------------------------------------------------------

---[FILE: settings_preferences.ts]---
Location: zulip-main/web/src/settings_preferences.ts
Signals: Zod

```typescript
import $ from "jquery";
import Cookies from "js-cookie";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";
import * as z from "zod/mini";

import render_dialog_default_language from "../templates/default_language_modal.hbs";

import * as channel from "./channel.ts";
import * as dialog_widget from "./dialog_widget.ts";
import * as dropdown_widget from "./dropdown_widget.ts";
import * as emojisets from "./emojisets.ts";
import {$t_html, get_language_list_columns} from "./i18n.ts";
import * as information_density from "./information_density.ts";
import * as loading from "./loading.ts";
import * as overlays from "./overlays.ts";
import {page_params} from "./page_params.ts";
import type {RealmDefaultSettings} from "./realm_user_settings_defaults.ts";
import * as settings_components from "./settings_components.ts";
import type {RequestOpts} from "./settings_ui.ts";
import * as settings_ui from "./settings_ui.ts";
import * as ui_report from "./ui_report.ts";
import {user_settings, user_settings_schema} from "./user_settings.ts";
import type {UserSettings} from "./user_settings.ts";
import * as util from "./util.ts";

export type SettingsPanel = {
    container: string;
    notification_sound_elem: string | null;
} & (
    | {
          settings_object: UserSettings;
          for_realm_settings: false;
      }
    | {
          settings_object: RealmDefaultSettings;
          for_realm_settings: true;
      }
);

export const user_settings_property_schema = z.keyof(
    z.omit(user_settings_schema, {available_notification_sounds: true, emojiset_choices: true}),
);
type UserSettingsProperty = z.output<typeof user_settings_property_schema>;

const meta = {
    loaded: false,
};

export let user_settings_panel: SettingsPanel;
let default_language_dropdown_widget: dropdown_widget.DropdownWidget;

function change_display_setting(
    data: Record<string, string | boolean | number>,
    $status_el: JQuery,
    success_continuation?: (response_data: unknown) => void,
    error_continuation?: (response_data: unknown) => void,
    success_msg_html?: string,
    sticky?: boolean,
): void {
    const status_is_sticky = $status_el.attr("data-is_sticky") === "true";
    const display_message_html = status_is_sticky
        ? $status_el.attr("data-sticky_msg_html")
        : success_msg_html;
    const opts: RequestOpts = {
        success_msg_html: display_message_html,
        sticky: status_is_sticky || sticky,
    };

    if (success_continuation !== undefined) {
        opts.success_continuation = success_continuation;
    }

    if (error_continuation !== undefined) {
        opts.error_continuation = error_continuation;
    }

    if (sticky && success_msg_html) {
        $status_el.attr("data-is_sticky", "true");
        $status_el.attr("data-sticky_msg_html", success_msg_html);
    }
    settings_ui.do_settings_change(channel.patch, "/json/settings", data, $status_el, opts);
}

function spectator_default_language_modal_post_render(): void {
    $("#language_selection_modal")
        .find(".language")
        .on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dialog_widget.close();

            assert(
                page_params.language_cookie_name !== undefined,
                "Expected language_cookie_name present for spectator",
            );

            const $link = $(e.target).closest("a[data-code]");
            Cookies.set(page_params.language_cookie_name, $link.attr("data-code")!);
            window.location.reload();
        });
}

export function launch_default_language_setting_modal_for_spectator(): void {
    const selected_language = user_settings.default_language;

    const html_body = render_dialog_default_language({
        language_list: get_language_list_columns(selected_language).toSorted((a, b) =>
            util.strcmp(a.name_with_percent, b.name_with_percent),
        ),
    });

    dialog_widget.launch({
        html_heading: $t_html({defaultMessage: "Select language"}),
        html_body,
        html_submit_button: $t_html({defaultMessage: "Close"}),
        id: "language_selection_modal",
        close_on_submit: true,
        focus_submit_on_open: true,
        single_footer_button: true,
        post_render: spectator_default_language_modal_post_render,
        on_click() {
            // We perform no actions since the 'close_on_submit' field takes care
            // of closing the modal.
        },
    });
}

export function set_up(settings_panel: SettingsPanel): void {
    meta.loaded = true;
    const $container = $(settings_panel.container);
    const settings_object = settings_panel.settings_object;
    const for_realm_settings = settings_panel.for_realm_settings;

    // Select current values for enum/select type fields. For boolean
    // fields, the current value is set automatically in the template.
    $container
        .find(".setting_demote_inactive_streams")
        .val(settings_object.demote_inactive_streams);
    $container
        .find(
            `.setting_color_scheme[value='${CSS.escape(settings_object.color_scheme.toString())}']`,
        )
        .prop("checked", true);
    $container.find(".setting_web_home_view").val(settings_object.web_home_view);
    $container
        .find(".setting_twenty_four_hour_time")
        .val(JSON.stringify(settings_object.twenty_four_hour_time));
    $container
        .find(".setting_web_mark_read_on_scroll_policy")
        .val(settings_object.web_mark_read_on_scroll_policy);
    $container
        .find(".setting_web_channel_default_view")
        .val(settings_object.web_channel_default_view);
    $container
        .find(`.setting_emojiset_choice[value="${CSS.escape(settings_object.emojiset)}"]`)
        .prop("checked", true);
    $container
        .find(`.setting_user_list_style_choice[value=${settings_object.user_list_style}]`)
        .prop("checked", true);

    $container
        .find(".setting_web_animate_image_previews")
        .val(settings_object.web_animate_image_previews);
    $container
        .find(".setting_web_stream_unreads_count_display_policy")
        .val(settings_object.web_stream_unreads_count_display_policy);

    information_density.enable_or_disable_control_buttons($container);

    if (for_realm_settings) {
        // For the realm-level defaults page, we use the common
        // settings_org.ts handlers, so we can return early here.
        return;
    }

    // Common handler for sending requests to the server when an input
    // element is changed.
    $container.on("change", "input[type=checkbox], select", function (this: HTMLElement, e) {
        const $input_elem = $(e.currentTarget);
        const setting = $input_elem.attr("name");
        assert(setting !== undefined);
        const data: Record<string, string | boolean | number> = {};
        const setting_value = settings_components.get_input_element_value(this)!;
        assert(typeof setting_value !== "object");
        data[setting] = setting_value;

        const $status_element = $input_elem
            .closest(".subsection-parent")
            .find(".alert-notification");
        change_display_setting(data, $status_element);
    });

    $container.find(".info-density-button").on("click", function (this: HTMLElement, e) {
        e.preventDefault();
        const changed_property = z
            .enum(["web_font_size_px", "web_line_height_percent"])
            .parse($(this).closest(".button-group").attr("data-property"));
        const original_value = user_settings[changed_property];

        const new_value = information_density.update_information_density_settings(
            $(this),
            changed_property,
            true,
        );
        const data = {[changed_property]: new_value};

        const $status_element = $(this).closest(".subsection-parent").find(".alert-notification");
        information_density.enable_or_disable_control_buttons($container);

        const error_continuation: () => void = () => {
            information_density.update_information_density_settings(
                $(this),
                changed_property,
                true,
                original_value,
            );
            information_density.enable_or_disable_control_buttons($container);
        };
        change_display_setting(data, $status_element, undefined, error_continuation);
    });

    $container.find(".setting_color_scheme").on("change", function () {
        const $input_elem = $(this);
        const new_theme_code = $input_elem.val();
        assert(new_theme_code !== undefined);

        const $status_element = $input_elem
            .closest(".subsection-parent")
            .find(".alert-notification");

        const opts: RequestOpts = {
            error_continuation() {
                setTimeout(() => {
                    const prev_theme_code = user_settings.color_scheme;
                    $input_elem
                        .parent()
                        .find(
                            `.setting_color_scheme[value='${CSS.escape(prev_theme_code.toString())}']`,
                        )
                        .prop("checked", true);
                }, 500);
            },
        };

        settings_ui.do_settings_change(
            channel.patch,
            "/json/settings",
            {color_scheme: new_theme_code},
            $status_element,
            opts,
        );
    });

    $container.find(".setting_emojiset_choice").on("click", function () {
        const data = {emojiset: $(this).val()};
        const current_emojiset = settings_object.emojiset;
        if (current_emojiset === data.emojiset) {
            return;
        }
        const $spinner = $container.find(".emoji-preferences-settings-status").expectOne();
        loading.make_indicator($spinner, {text: settings_ui.strings.saving});

        void channel.patch({
            url: "/json/settings",
            data,
            success() {
                // We don't launch any success report, since it is currently handled
                // by function report_emojiset_change.
            },
            error(xhr) {
                ui_report.error(
                    settings_ui.strings.failure_html,
                    xhr,
                    $container.find(".emoji-preferences-settings-status").expectOne(),
                );
            },
        });
    });

    $container.find(".setting_user_list_style_choice").on("click", function () {
        const data = {user_list_style: $(this).val()};
        const current_user_list_style = settings_object.user_list_style;
        if (current_user_list_style === data.user_list_style) {
            return;
        }
        const $spinner = $container.find(".information-settings-status").expectOne();
        loading.make_indicator($spinner, {text: settings_ui.strings.saving});

        void channel.patch({
            url: "/json/settings",
            data,
            success() {
                // We don't launch any success report, since it is
                // currently handled by report_user_list_style_change.
            },
            error(xhr) {
                ui_report.error(
                    settings_ui.strings.failure_html,
                    xhr,
                    $container.find(".information-settings-status").expectOne(),
                );
            },
        });
    });

    render_language_dropdown_widget();
}

export async function report_emojiset_change(settings_panel: SettingsPanel): Promise<void> {
    // TODO: Clean up how this works so we can use
    // change_display_setting.  The challenge is that we don't want to
    // report success before the server_events request returns that
    // causes the actual sprite sheet to change.  The current
    // implementation is wrong, though, in that it displays the UI
    // update in all active browser windows.
    await emojisets.select(settings_panel.settings_object.emojiset);

    const $spinner = $(settings_panel.container).find(".emoji-preferences-settings-status");
    if ($spinner.length > 0) {
        loading.destroy_indicator($spinner);
        ui_report.success(
            $t_html({defaultMessage: "Emoji set changed successfully!"}),
            $spinner.expectOne(),
            1000,
        );
        $spinner.expectOne();
        settings_ui.display_checkmark($spinner);
    }
}

export function report_user_list_style_change(settings_panel: SettingsPanel): void {
    // TODO: Clean up how this works so we can use
    // change_display_setting.  The challenge is that we don't want to
    // report success before the server_events request returns that
    // causes the actual sprite sheet to change.  The current
    // implementation is wrong, though, in that it displays the UI
    // update in all active browser windows.
    const $spinner = $(settings_panel.container).find(".information-settings-status");
    if ($spinner.length > 0) {
        loading.destroy_indicator($spinner);
        ui_report.success(
            $t_html({defaultMessage: "User list style changed successfully!"}),
            $spinner.expectOne(),
            1000,
        );
        $spinner.expectOne();
        settings_ui.display_checkmark($spinner);
    }
}

export function update_page(property: UserSettingsProperty): void {
    if (!overlays.settings_open()) {
        return;
    }
    const $container = $(user_settings_panel.container);
    let value = user_settings[property];

    // settings_org.set_input_element_value doesn't support radio
    // button widgets like these.
    if (property === "emojiset" || property === "user_list_style") {
        $container.find(`input[value=${CSS.escape(value.toString())}]`).prop("checked", true);
        return;
    }

    // The twenty_four_hour_time setting is represented as a boolean
    // in the API, but a dropdown with "true"/"false" as strings in
    // the UI, so we need to convert its format here.
    if (property === "twenty_four_hour_time") {
        value = value.toString();
    }

    const $input_elem = $container.find(`[name=${CSS.escape(property)}]`);
    settings_components.set_input_element_value($input_elem, value);
}

function language_select_callback(
    event: JQuery.ClickEvent,
    dropdown: tippy.Instance,
    widget: dropdown_widget.DropdownWidget,
): void {
    dropdown.hide();
    event.preventDefault();
    event.stopPropagation();
    widget.render();

    const current_value = widget.current_value;
    assert(current_value !== undefined);
    const data = {default_language: current_value};
    change_display_setting(
        data,
        $("#settings_content").find(".general-settings-status"),
        undefined,
        undefined,
        $t_html(
            {
                defaultMessage:
                    "Saved. Please <z-link>reload</z-link> for the change to take effect.",
            },
            {
                "z-link": (content_html) => `<a class='reload_link'>${content_html.join("")}</a>`,
            },
        ),
        true,
    );
}

export function set_default_language(default_language: string): void {
    if (!default_language_dropdown_widget) {
        return;
    }
    default_language_dropdown_widget.render(default_language);
}

function render_language_dropdown_widget(): void {
    default_language_dropdown_widget = new dropdown_widget.DropdownWidget({
        widget_name: "default_language",
        get_options: settings_components.language_options,
        item_click_callback: language_select_callback,
        default_id: user_settings.default_language,
        $events_container: $("#user-preferences .preferences-settings-form"),
        unique_id_type: "string",
    });
    default_language_dropdown_widget.setup();
}

export function initialize(): void {
    user_settings_panel = {
        container: "#user-preferences",
        settings_object: user_settings,
        for_realm_settings: false,
        notification_sound_elem: null,
    };
}
```

--------------------------------------------------------------------------------

````

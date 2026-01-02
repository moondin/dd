---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 651
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 651 of 1290)

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

---[FILE: personal_menu_popover.ts]---
Location: zulip-main/web/src/personal_menu_popover.ts

```typescript
import $ from "jquery";

import render_navbar_personal_menu_popover from "../templates/popovers/navbar/navbar_personal_menu_popover.hbs";

import * as channel from "./channel.ts";
import * as information_density from "./information_density.ts";
import * as message_view from "./message_view.ts";
import * as people from "./people.ts";
import * as popover_menus from "./popover_menus.ts";
import * as popover_menus_data from "./popover_menus_data.ts";
import * as popovers from "./popovers.ts";
import {current_user} from "./state_data.ts";
import {parse_html} from "./ui_util.ts";
import {user_settings} from "./user_settings.ts";
import * as user_status from "./user_status.ts";

export function initialize(): void {
    popover_menus.register_popover_menu("#personal-menu", {
        theme: "popover-menu",
        placement: "bottom",
        offset: [-50, 0],
        // The strategy: "fixed"; and eventlisteners modifier option
        // ensure that the personal menu does not modify its position
        // or disappear when user zooms the page.
        popperOptions: {
            strategy: "fixed",
            modifiers: [
                {
                    name: "eventListeners",
                    options: {
                        scroll: false,
                    },
                },
            ],
        },
        onMount(instance) {
            const $popper = $(instance.popper);
            popover_menus.popover_instances.personal_menu = instance;

            $popper.on("change", "input[name='theme-select']", (e) => {
                const new_theme_code = $(e.currentTarget).attr("data-theme-code");
                channel.patch({
                    url: "/json/settings",
                    data: {color_scheme: new_theme_code},
                    error() {
                        // NOTE: The additional delay allows us to visually communicate
                        // that an error occurred due to which we are reverting back
                        // to the previously used value.
                        setTimeout(() => {
                            const prev_theme_code = user_settings.color_scheme;
                            $(e.currentTarget)
                                .parent()
                                .find(`input[data-theme-code="${prev_theme_code}"]`)
                                .prop("checked", true);
                        }, 500);
                    },
                });
            });

            $popper.one("click", ".personal-menu-clear-status", (e) => {
                e.preventDefault();
                user_status.server_update_status({
                    status_text: "",
                    emoji_name: "",
                    emoji_code: "",
                    success() {
                        popover_menus.hide_current_popover_if_visible(instance);
                    },
                });
            });

            $popper.one("click", ".narrow-self-direct-message", (e) => {
                const user_id = current_user.user_id;
                const email = people.get_by_user_id(user_id).email;
                message_view.show(
                    [
                        {
                            operator: "dm",
                            operand: email,
                        },
                    ],
                    {trigger: "personal menu"},
                );
                popovers.hide_all();
                e.preventDefault();
            });

            $popper.one("click", ".narrow-messages-sent", (e) => {
                const user_id = current_user.user_id;
                const email = people.get_by_user_id(user_id).email;
                message_view.show(
                    [
                        {
                            operator: "sender",
                            operand: email,
                        },
                    ],
                    {trigger: "personal menu"},
                );
                popovers.hide_all();
                e.preventDefault();
            });

            $popper.one("click", ".open-profile-settings", function (this: HTMLElement, e) {
                this.click();
                popovers.hide_all();
                e.preventDefault();
            });

            $popper.on("click", ".info-density-controls button", function (this: HTMLElement, e) {
                const changed_property =
                    information_density.information_density_properties_schema.parse(
                        $(this).closest(".button-group").attr("data-property"),
                    );
                const new_setting_value = information_density.update_information_density_settings(
                    $(this),
                    changed_property,
                );
                const data = {[changed_property]: new_setting_value};
                information_density.enable_or_disable_control_buttons($popper);

                if (changed_property === "web_font_size_px") {
                    // We do not want to display the arrow once font size is changed
                    // because popover will be detached from the user avatar as we
                    // do not change the font size in popover.
                    $("#personal-menu-dropdown").closest(".tippy-box").find(".tippy-arrow").hide();
                }

                void channel.patch({
                    url: "/json/settings",
                    data,
                    // We don't declare success or error
                    // handlers. We've already locally echoed the
                    // change, and the thinking for this component is
                    // that right answer for error handling is to do
                    // nothing. For the offline case, just letting you
                    // adjust the font size locally is great, and it's
                    // not obvious what good error handling is here
                    // for the server being down other than "try again
                    // later", which might as well be your next
                    // session.
                    //
                    // This strategy also avoids unpleasant races
                    // involving the button being clicked several
                    // times in quick succession.
                });
                e.preventDefault();
            });

            information_density.enable_or_disable_control_buttons($popper);
            void instance.popperInstance?.update();

            // We do not want font size of the popover to change when changing
            // font size using the buttons in popover, so that the buttons do
            // not shift.
            const font_size =
                popover_menus.POPOVER_FONT_SIZE_IN_EM * user_settings.web_font_size_px;
            $("#personal-menu-dropdown")
                .closest(".tippy-box")
                .css("font-size", font_size + "px");
        },
        onShow(instance) {
            const args = popover_menus_data.get_personal_menu_content_context();
            instance.setContent(parse_html(render_navbar_personal_menu_popover(args)));
            $("#personal-menu").addClass("active-navbar-menu");
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.personal_menu = null;
            $("#personal-menu").removeClass("active-navbar-menu");
        },
    });
}

export function toggle(): void {
    // NOTE: Since to open personal menu, you need to click on your avatar (which calls
    // tippyjs.hideAll()), or go via gear menu if using hotkeys, we don't need to
    // call tippyjs.hideAll() for it.
    $("#personal-menu").trigger("click");
}
```

--------------------------------------------------------------------------------

---[FILE: pill_typeahead.ts]---
Location: zulip-main/web/src/pill_typeahead.ts

```typescript
import assert from "minimalistic-assert";

import * as blueslip from "./blueslip.ts";
import {Typeahead} from "./bootstrap_typeahead.ts";
import type {TypeaheadInputElement} from "./bootstrap_typeahead.ts";
import * as people from "./people.ts";
import type {User} from "./people.ts";
import * as stream_pill from "./stream_pill.ts";
import type {StreamPillData, StreamPillWidget} from "./stream_pill.ts";
import * as typeahead_helper from "./typeahead_helper.ts";
import type {CombinedPillContainer, GroupSettingPillContainer} from "./typeahead_helper.ts";
import * as user_group_pill from "./user_group_pill.ts";
import type {UserGroupPillData} from "./user_group_pill.ts";
import type {UserGroup} from "./user_groups.ts";
import * as user_pill from "./user_pill.ts";
import type {UserPillData, UserPillWidget} from "./user_pill.ts";

function person_matcher(query: string, item: UserPillData): boolean {
    return (
        people.is_known_user_id(item.user.user_id) &&
        typeahead_helper.query_matches_person(query, item)
    );
}

function group_matcher(query: string, item: UserGroupPillData): boolean {
    return typeahead_helper.query_matches_group_name(query, item);
}

type TypeaheadItem = UserGroupPillData | StreamPillData | UserPillData;
type GroupSettingTypeaheadItem = UserGroupPillData | UserPillData;

export function set_up_user(
    $input: JQuery,
    pills: UserPillWidget,
    opts: {
        exclude_bots?: boolean;
        update_func?: () => void;
    },
): void {
    const exclude_bots = opts.exclude_bots;
    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $input,
        type: "contenteditable",
    };
    new Typeahead(bootstrap_typeahead_input, {
        dropup: true,
        source(_query: string): UserPillData[] {
            return user_pill.typeahead_source(pills, exclude_bots);
        },
        item_html(item: UserPillData, _query: string): string {
            return typeahead_helper.render_person(item);
        },
        matcher(item: UserPillData, query: string): boolean {
            query = query.toLowerCase();
            query = query.replaceAll("\u00A0", " ");
            return person_matcher(query, item);
        },
        sorter(matches: UserPillData[], query: string): UserPillData[] {
            const users = matches.filter((match) => people.is_known_user_id(match.user.user_id));
            return typeahead_helper.sort_recipients({users, query}).map((item) => {
                assert(item.type === "user");
                return item;
            });
        },
        updater(item: UserPillData, _query: string): undefined {
            if (people.is_known_user_id(item.user.user_id)) {
                user_pill.append_user(item.user, pills);
            }
            $input.trigger("focus");
            opts.update_func?.();
        },
        stopAdvance: true,
    });
}

export function set_up_stream(
    $input: JQuery,
    pills: StreamPillWidget,
    opts: {
        help_on_empty_strings?: boolean;
        hide_on_empty_after_backspace?: boolean;
        invite_streams?: boolean;
        update_func?: () => void;
    },
): void {
    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $input,
        type: "contenteditable",
    };
    opts.help_on_empty_strings ??= false;
    opts.hide_on_empty_after_backspace ??= false;
    new Typeahead(bootstrap_typeahead_input, {
        dropup: true,
        helpOnEmptyStrings: opts.help_on_empty_strings,
        hideOnEmptyAfterBackspace: opts.hide_on_empty_after_backspace,
        source(_query: string): StreamPillData[] {
            return stream_pill.typeahead_source(pills, opts.invite_streams);
        },
        item_html(item: StreamPillData, _query: string): string {
            return typeahead_helper.render_stream(item);
        },
        matcher(item: StreamPillData, query: string): boolean {
            query = query.toLowerCase();
            query = query.replaceAll("\u00A0", " ");
            query = query.trim();
            if (query.startsWith("#")) {
                query = query.slice(1);
            }
            return item.name.toLowerCase().includes(query);
        },
        sorter(matches: StreamPillData[], query: string): StreamPillData[] {
            const stream_matches: StreamPillData[] = [];
            for (const match of matches) {
                assert(match.type === "stream");
                stream_matches.push(match);
            }
            query = query.trim();
            if (query.startsWith("#")) {
                query = query.slice(1);
            }
            return typeahead_helper.sort_streams_by_name(stream_matches, query);
        },
        updater(item: StreamPillData, _query: string): undefined {
            stream_pill.append_stream(item, pills, false);
            $input.trigger("focus");
            opts.update_func?.();
        },
        stopAdvance: true,
    });
}

export function set_up_user_group(
    $input: JQuery,
    pills: user_group_pill.UserGroupPillWidget,
    opts: {
        user_group_source: () => UserGroup[];
    },
): void {
    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $input,
        type: "contenteditable",
    };
    new Typeahead(bootstrap_typeahead_input, {
        dropup: true,
        source(_query: string): UserGroupPillData[] {
            return opts
                .user_group_source()
                .map((user_group) => ({type: "user_group", ...user_group}));
        },
        item_html(item: UserGroupPillData, _query: string): string {
            return typeahead_helper.render_user_group(item);
        },
        matcher(item: UserGroupPillData, query: string): boolean {
            query = query.toLowerCase();
            query = query.replaceAll("\u00A0", " ");
            return group_matcher(query, item);
        },
        sorter(matches: UserGroupPillData[], query: string): UserGroupPillData[] {
            return typeahead_helper.sort_user_groups(matches, query);
        },
        updater(item: UserGroupPillData, _query: string): undefined {
            user_group_pill.append_user_group(item, pills);
            $input.trigger("focus");
        },
        stopAdvance: true,
        helpOnEmptyStrings: true,
        hideOnEmptyAfterBackspace: true,
    });
}

export function set_up_group_setting_typeahead(
    $input: JQuery,
    pills: GroupSettingPillContainer,
    opts: {
        setting_name: string;
        setting_type: "realm" | "stream" | "group";
        group?: UserGroup | undefined;
    },
): void {
    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $input,
        type: "contenteditable",
    };
    new Typeahead(bootstrap_typeahead_input, {
        dropup: true,
        source(_query: string): GroupSettingTypeaheadItem[] {
            let source: GroupSettingTypeaheadItem[] = [];

            source = user_group_pill.typeahead_source(pills, opts.setting_name, opts.setting_type);
            source = [
                ...source,
                ...user_pill.typeahead_source(pills, true, opts.setting_name, opts.setting_type),
            ];

            return source;
        },
        item_html(item: GroupSettingTypeaheadItem, _query: string): string {
            if (item.type === "user_group") {
                return typeahead_helper.render_user_group(item);
            }

            assert(item.type === "user");
            return typeahead_helper.render_person(item);
        },
        matcher(item: GroupSettingTypeaheadItem, query: string): boolean {
            query = query.toLowerCase();
            query = query.replaceAll("\u00A0", " ");

            let matches = false;
            if (item.type === "user_group") {
                matches = matches || group_matcher(query, item);
            }

            if (item.type === "user") {
                matches = matches || person_matcher(query, item);
            }
            return matches;
        },
        sorter(matches: GroupSettingTypeaheadItem[], query: string): GroupSettingTypeaheadItem[] {
            const users: UserPillData[] = [];
            for (const match of matches) {
                if (match.type === "user" && people.is_known_user_id(match.user.user_id)) {
                    users.push(match);
                }
            }

            const groups: UserGroupPillData[] = [];
            for (const match of matches) {
                if (match.type === "user_group") {
                    groups.push(match);
                }
            }

            return typeahead_helper.sort_group_setting_options({
                users,
                query,
                groups,
                target_group: opts.group,
            });
        },
        updater(item: GroupSettingTypeaheadItem, _query: string): undefined {
            if (item.type === "user_group") {
                user_group_pill.append_user_group(item, pills);
            } else if (item.type === "user" && people.is_known_user_id(item.user.user_id)) {
                user_pill.append_user(item.user, pills);
            }

            $input.trigger("focus");
        },
        stopAdvance: true,
        helpOnEmptyStrings: true,
        hideOnEmptyAfterBackspace: true,
    });
}

export function set_up_combined(
    $input: JQuery,
    pills: CombinedPillContainer,
    opts: {
        user: boolean;
        user_group?: boolean;
        stream?: boolean;
        user_source?: () => User[];
        user_group_source?: () => UserGroup[];
        exclude_bots?: boolean;
        update_func?: () => void;
        for_stream_subscribers: boolean;
    },
): void {
    if (!opts.user && !opts.user_group && !opts.stream) {
        blueslip.error("Unspecified possible item types");
        return;
    }
    const include_streams = (query: string): boolean =>
        opts.stream !== undefined && query.trim().startsWith("#");
    const include_user_groups = opts.user_group;
    const include_users = opts.user;
    const exclude_bots = opts.exclude_bots;

    const bootstrap_typeahead_input: TypeaheadInputElement = {
        $element: $input,
        type: "contenteditable",
    };
    new Typeahead(bootstrap_typeahead_input, {
        dropup: true,
        helpOnEmptyStrings: true,
        hideOnEmptyAfterBackspace: true,
        source(query: string): TypeaheadItem[] {
            let source: TypeaheadItem[] = [];
            if (include_streams(query)) {
                // If query starts with # we expect,
                // only stream suggestions so we simply
                // return stream source.
                return stream_pill.typeahead_source(pills);
            }

            if (include_user_groups) {
                if (opts.user_group_source !== undefined) {
                    const groups: UserGroupPillData[] = opts
                        .user_group_source()
                        .map((user_group) => ({type: "user_group", ...user_group}));
                    source = [...source, ...groups];
                } else {
                    source = [...source, ...user_group_pill.typeahead_source(pills)];
                }
            }

            if (include_users) {
                if (opts.user_source !== undefined) {
                    // If user_source is specified in opts, it
                    // is given priority. Otherwise we use
                    // default user_pill.typeahead_source.
                    const users: UserPillData[] = opts
                        .user_source()
                        .map((user) => ({type: "user", user}));
                    source = [...source, ...users];
                } else {
                    source = [...source, ...user_pill.typeahead_source(pills, exclude_bots)];
                }
            }
            return source;
        },
        item_html(item: TypeaheadItem, query: string): string {
            if (include_streams(query) && item.type === "stream") {
                return typeahead_helper.render_stream(item);
            }

            if (include_user_groups && item.type === "user_group") {
                return typeahead_helper.render_user_group(item);
            }

            // After reaching this point, it is sure
            // that given item is a person. So this
            // handles `include_users` cases along with
            // default cases.
            assert(item.type === "user");
            return typeahead_helper.render_person(item);
        },
        matcher(item: TypeaheadItem, query: string): boolean {
            query = query.toLowerCase();
            query = query.replaceAll("\u00A0", " ");

            if (include_streams(query) && item.type === "stream") {
                query = query.trim().slice(1);
                return item.name.toLowerCase().includes(query);
            }

            let matches = false;
            if (include_user_groups && item.type === "user_group") {
                matches = matches || group_matcher(query, item);
            }

            if (include_users && item.type === "user") {
                matches = matches || person_matcher(query, item);
            }
            return matches;
        },
        sorter(matches: TypeaheadItem[], query: string): TypeaheadItem[] {
            if (include_streams(query)) {
                const stream_matches: StreamPillData[] = [];
                for (const match of matches) {
                    assert(match.type === "stream");
                    stream_matches.push(match);
                }
                return typeahead_helper.sort_streams(stream_matches, query.trim().slice(1));
            }

            const users: UserPillData[] = [];
            if (include_users) {
                for (const match of matches) {
                    if (match.type === "user" && people.is_known_user_id(match.user.user_id)) {
                        users.push(match);
                    }
                }
            }

            const groups: UserGroupPillData[] = [];
            if (include_user_groups) {
                for (const match of matches) {
                    if (match.type === "user_group") {
                        groups.push(match);
                    }
                }
            }

            return typeahead_helper.sort_stream_or_group_members_options({
                users,
                query,
                groups,
                for_stream_subscribers: opts.for_stream_subscribers,
            });
        },
        updater(item: TypeaheadItem, query: string): undefined {
            if (include_streams(query) && item.type === "stream") {
                stream_pill.append_stream(item, pills);
            } else if (include_user_groups && item.type === "user_group") {
                const show_expand_button =
                    !opts.for_stream_subscribers &&
                    (item.members.size > 0 || item.direct_subgroup_ids.size > 0);
                user_group_pill.append_user_group(item, pills, true, show_expand_button);
            } else if (
                include_users &&
                item.type === "user" &&
                people.is_known_user_id(item.user.user_id)
            ) {
                user_pill.append_user(item.user, pills);
            }

            $input.trigger("focus");
            if (opts.update_func) {
                opts.update_func();
            }
        },
        stopAdvance: true,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: playground_links_popover.ts]---
Location: zulip-main/web/src/playground_links_popover.ts

```typescript
import $ from "jquery";
import type * as tippy from "tippy.js";
import * as url_template_lib from "url-template";

import render_playground_links_popover from "../templates/popovers/playground_links_popover.hbs";

import * as blueslip from "./blueslip.ts";
import * as popover_menus from "./popover_menus.ts";
import * as realm_playground from "./realm_playground.ts";
import type {RealmPlayground} from "./realm_playground.ts";
import * as ui_util from "./ui_util.ts";
import * as util from "./util.ts";

type RealmPlaygroundWithURL = RealmPlayground & {playground_url: string};

let playground_links_popover_instance: tippy.Instance | null = null;

// Playground_store contains all the data we need to generate a popover of
// playground links for each code block. The element is the target element
// to pop off of.
function toggle_playground_links_popover(
    element: tippy.ReferenceElement,
    playground_store: Map<number, RealmPlaygroundWithURL>,
): void {
    if (is_open()) {
        return;
    }

    popover_menus.toggle_popover_menu(element, {
        theme: "popover-menu",
        placement: "bottom",
        popperOptions: {
            modifiers: [
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: ["top"],
                    },
                },
            ],
        },
        onCreate(instance) {
            // We extract all the values out of playground_store map into
            // the playground_info array. Each element of the array is an
            // object with all properties the template needs for rendering.
            const playground_info = [...playground_store.values()];
            playground_links_popover_instance = instance;
            instance.setContent(
                ui_util.parse_html(render_playground_links_popover({playground_info})),
            );
        },
        onShow(instance) {
            const $reference = $(instance.reference);
            $reference.parent().addClass("active-playground-links-reference");
        },
        onHidden() {
            hide();
        },
    });
}

export function is_open(): boolean {
    return Boolean(playground_links_popover_instance);
}

export function hide(): void {
    if (!playground_links_popover_instance) {
        return;
    }

    $(playground_links_popover_instance.reference)
        .parent()
        .removeClass("active-playground-links-reference");
    playground_links_popover_instance.destroy();
    playground_links_popover_instance = null;
}

function get_playground_links_popover_items(): JQuery | undefined {
    if (!playground_links_popover_instance) {
        blueslip.error("Trying to get menu items when playground links popover is closed.");
        return undefined;
    }

    const $popover = $(playground_links_popover_instance.popper);
    if (!$popover) {
        blueslip.error("Cannot find playground links popover data");
        return undefined;
    }

    return $popover.find(".popover_playground_link");
}

export function handle_keyboard(key: string): void {
    const $items = get_playground_links_popover_items();
    popover_menus.popover_items_handle_keyboard(key, $items);
}

function register_click_handlers(): void {
    $("#main_div, #preview_content, #message-history").on(
        "click",
        ".code_external_link",
        function (e) {
            const $view_in_playground_button = $(this);
            const $codehilite_div = $(this).closest(".codehilite");
            e.stopPropagation();
            const language = $codehilite_div.attr("data-code-language");
            if (language === undefined) {
                return;
            }
            const playground_info = realm_playground.get_playground_info_for_languages(language);
            if (playground_info === undefined) {
                return;
            }
            // We do the code extraction here and send user to the target destination,
            // obtained by expanding the url_template with the extracted code.
            // Depending on whether the language has multiple playground links configured,
            // a popover is shown.
            const extracted_code = $codehilite_div.find("code").text();
            if (playground_info.length === 1 && playground_info[0] !== undefined) {
                const url_template = url_template_lib.parseTemplate(
                    playground_info[0].url_template,
                );
                const playground_url = url_template.expand({code: extracted_code});
                window.open(playground_url, "_blank", "noopener,noreferrer");
            } else {
                const playground_store = new Map<number, RealmPlaygroundWithURL>();
                for (const playground of playground_info) {
                    const url_template = url_template_lib.parseTemplate(playground.url_template);
                    const playground_url = url_template.expand({code: extracted_code});
                    playground_store.set(playground.id, {...playground, playground_url});
                }
                const popover_target = util.the(
                    $view_in_playground_button.find(".playground-links-popover-container"),
                );
                toggle_playground_links_popover(popover_target, playground_store);
            }
        },
    );

    $("body").on("click", ".popover_playground_link", (e) => {
        hide();
        e.stopPropagation();
    });
}

export function initialize(): void {
    register_click_handlers();
}
```

--------------------------------------------------------------------------------

---[FILE: pm_conversations.ts]---
Location: zulip-main/web/src/pm_conversations.ts

```typescript
import {FoldDict} from "./fold_dict.ts";
import type {Message} from "./message_store.ts";
import * as muted_users from "./muted_users.ts";
import * as people from "./people.ts";
import type {StateData} from "./state_data.ts";

type PMConversation = {
    user_ids_string: string;
    max_message_id: number;
};

const partners = new Set<number>();

export let set_partner = (user_id: number): void => {
    partners.add(user_id);
};

export function rewire_set_partner(value: typeof set_partner): void {
    set_partner = value;
}

export function is_partner(user_id: number): boolean {
    return partners.has(user_id);
}

function filter_muted_pms(conversation: PMConversation): boolean {
    // We hide muted users from the top left corner, as well as those direct
    // message groups in which all participants are muted.
    const recipients = people.split_to_ints(conversation.user_ids_string);

    if (recipients.every((id) => muted_users.is_user_muted(id))) {
        return false;
    }

    return true;
}

class RecentDirectMessages {
    // This data structure keeps track of the sets of users you've had
    // recent conversations with, sorted by time (implemented via
    // `message_id` sorting, since that's how we time-sort messages).
    recent_message_ids = new FoldDict<PMConversation>(); // key is user_ids_string
    recent_private_messages: PMConversation[] = [];

    insert(user_ids: number[], message_id: number): void {
        if (user_ids.length === 0) {
            // The server sends [] for direct messages to oneself.
            user_ids = [people.my_current_user_id()];
        }
        user_ids.sort((a, b) => a - b);

        const user_ids_string = user_ids.join(",");
        let conversation = this.recent_message_ids.get(user_ids_string);

        if (conversation === undefined) {
            // This is a new user, so create a new object.
            conversation = {
                user_ids_string,
                max_message_id: message_id,
            };
            this.recent_message_ids.set(user_ids_string, conversation);

            // Optimistically insert the new message at the front, since that
            // is usually where it belongs, but we'll re-sort.
            this.recent_private_messages.unshift(conversation);
        } else {
            if (conversation.max_message_id >= message_id) {
                // don't backdate our conversation.  This is the
                // common code path after initialization when
                // processing old messages, since we'll already have
                // the latest message_id for the conversation from
                // initialization.
                return;
            }

            // update our latest message_id
            conversation.max_message_id = message_id;
        }

        this.recent_private_messages.sort((a, b) => b.max_message_id - a.max_message_id);
    }

    get(): PMConversation[] {
        // returns array of structs with user_ids_string and
        // message_id
        return this.recent_private_messages.filter((pm) => filter_muted_pms(pm));
    }

    get_strings(): string[] {
        // returns array of structs with user_ids_string and
        // message_id
        return this.recent_private_messages
            .filter((pm) => filter_muted_pms(pm))
            .map((conversation) => conversation.user_ids_string);
    }

    has_conversation(user_ids_string: string): boolean {
        // Returns a boolean indicating whether we have a record proving
        // this particular direct message conversation exists.
        const recipient_ids_string = people.pm_lookup_key(user_ids_string);
        return this.recent_message_ids.get(recipient_ids_string) !== undefined;
    }

    initialize(params: StateData["pm_conversations"]): void {
        for (const conversation of params.recent_private_conversations) {
            this.insert(conversation.user_ids, conversation.max_message_id);
        }
    }
}

export let recent = new RecentDirectMessages();

export function process_message(message: Message): void {
    const user_ids = people.pm_with_user_ids(message);
    if (!user_ids) {
        return;
    }

    for (const user_id of user_ids) {
        set_partner(user_id);
    }

    recent.insert(user_ids, message.id);
}

export function clear_for_testing(): void {
    recent = new RecentDirectMessages();
    partners.clear();
}
```

--------------------------------------------------------------------------------

````

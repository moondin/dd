---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 584
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 584 of 1290)

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

---[FILE: activity.ts]---
Location: zulip-main/web/src/activity.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as channel from "./channel.ts";
import {electron_bridge} from "./electron_bridge.ts";
import {page_params} from "./page_params.ts";
import * as presence from "./presence.ts";
import * as watchdog from "./watchdog.ts";

export const post_presence_response_schema = z.object({
    msg: z.string(),
    result: z.string(),
    // A bunch of these fields below are .optional() due to the fact
    // that we have two modes of querying the presence endpoint:
    // ping_only mode and a mode where we also fetch presence data
    // for the realm.
    // For ping_only requests, these fields are not returned in the
    // response. If we're fetching presence data however, they should
    // all be present, and send_presence_to_server() will validate that.
    server_timestamp: z.optional(z.number()),
    presences: z.optional(
        z.record(
            z.string(),
            z.object({
                active_timestamp: z.number(),
                idle_timestamp: z.number(),
            }),
        ),
    ),
    presence_last_update_id: z.optional(z.number()),
});

/* Keep in sync with views.py:update_active_status_backend() */
export type ActivityState = "active" | "idle";

/*
    Helpers for detecting user activity and managing user idle states
*/

/* Broadcast "idle" to server after 5 minutes of local inactivity */
const DEFAULT_IDLE_TIMEOUT_MS = 5 * 60 * 1000;

// When you open Zulip in a new browser window, client_is_active
// should be true.  When a server-initiated reload happens, however,
// it should be initialized to false.  We handle this with a check for
// whether the window is focused at initialization time.
export let client_is_active = document.hasFocus();

// new_user_input is a more strict version of client_is_active used
// primarily for analytics.  We initialize this to true, to count new
// page loads, but set it to false in the onload function in reload.ts
// if this was a server-initiated-reload to avoid counting a
// server-initiated reload as user activity.
export let new_user_input = true;

export let received_new_messages = false;

type UserInputHook = () => void;
const on_new_user_input_hooks: UserInputHook[] = [];

export function register_on_new_user_input_hook(hook: UserInputHook): void {
    on_new_user_input_hooks.push(hook);
}

export function set_received_new_messages(value: boolean): void {
    received_new_messages = value;
}

export function set_new_user_input(value: boolean): void {
    new_user_input = value;
    for (const hook of on_new_user_input_hooks) {
        hook();
    }
}

export function clear_for_testing(): void {
    client_is_active = false;
}

export function mark_client_idle(): void {
    // When we become idle, we don't immediately send anything to the
    // server; instead, we wait for our next periodic update, since
    // this data is fundamentally not timely.
    client_is_active = false;
}

export function compute_active_status(): ActivityState {
    // The overall algorithm intent for the `status` field is to send
    // `ACTIVE` (aka green circle) if we know the user is at their
    // computer, and IDLE (aka orange circle) if the user might not
    // be:
    //
    // * For the web app, we just know whether this window has focus.
    // * For the electron desktop app, we also know whether the
    //   user is active or idle elsewhere on their system.
    //
    // The check for `get_idle_on_system === undefined` is feature
    // detection; older desktop app releases never set that property.
    if (electron_bridge?.get_idle_on_system !== undefined) {
        if (electron_bridge.get_idle_on_system()) {
            return "idle";
        }
        return "active";
    }

    if (client_is_active) {
        return "active";
    }
    return "idle";
}

export let send_presence_to_server = (redraw?: () => void): void => {
    // Zulip has 2 data feeds coming from the server to the client:
    // The server_events data, and this presence feed.  Data from
    // server_events is nicely serialized, but if we've been offline
    // and not running for a while (e.g. due to suspend), we can end
    // up with inconsistent state where users appear in presence that
    // don't appear in people.js.  We handle this in 2 stages.  First,
    // here, we trigger an extra run of the clock-jump check that
    // detects whether this device just resumed from suspend.  This
    // ensures that watchdog.suspect_offline is always up-to-date
    // before we initiate a presence request.
    //
    // If we did just resume, it will also trigger an immediate
    // server_events request to the server (the success handler to
    // which will clear suspect_offline and potentially trigger a
    // reload if the device was offline for more than
    // DEFAULT_EVENT_QUEUE_TIMEOUT_SECS).
    if (page_params.is_spectator) {
        return;
    }

    watchdog.check_for_unsuspend();

    void channel.post({
        url: "/json/users/me/presence",
        data: {
            status: compute_active_status(),
            ping_only: !redraw,
            new_user_input,
            last_update_id: presence.presence_last_update_id,
        },
        success(response) {
            const data = post_presence_response_schema.parse(response);

            set_new_user_input(false);

            if (redraw) {
                assert(
                    data.presences !== undefined,
                    "Presences should be present if not a ping only presence request",
                );
                assert(
                    data.server_timestamp !== undefined,
                    "Server timestamp should be present if not a ping only presence request",
                );
                assert(
                    data.presence_last_update_id !== undefined,
                    "Presence last update id should be present if not a ping only presence request",
                );

                presence.set_info(
                    data.presences,
                    data.server_timestamp,
                    data.presence_last_update_id,
                );
                redraw();
            }
        },
    });
};

export function rewire_send_presence_to_server(value: typeof send_presence_to_server): void {
    send_presence_to_server = value;
}

export function mark_client_active(): void {
    // exported for testing
    if (!client_is_active) {
        client_is_active = true;
        send_presence_to_server();
    }
}

export function initialize(): void {
    $(document).on("mousemove", () => {
        set_new_user_input(true);
    });

    $(window).on("focus", mark_client_active);
    $(window).idle({
        idle: DEFAULT_IDLE_TIMEOUT_MS,
        onIdle: mark_client_idle,
        onActive: mark_client_active,
        keepTracking: true,
    });
}
```

--------------------------------------------------------------------------------

---[FILE: activity_ui.ts]---
Location: zulip-main/web/src/activity_ui.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";

import * as activity from "./activity.ts";
import * as blueslip from "./blueslip.ts";
import * as buddy_data from "./buddy_data.ts";
import {buddy_list} from "./buddy_list.ts";
import * as keydown_util from "./keydown_util.ts";
import {ListCursor} from "./list_cursor.ts";
import * as loading from "./loading.ts";
import * as narrow_state from "./narrow_state.ts";
import * as peer_data from "./peer_data.ts";
import * as people from "./people.ts";
import * as pm_list from "./pm_list.ts";
import * as popovers from "./popovers.ts";
import * as presence from "./presence.ts";
import type {PresenceInfoFromEvent} from "./presence.ts";
import * as sidebar_ui from "./sidebar_ui.ts";
import {realm} from "./state_data.ts";
import * as ui_util from "./ui_util.ts";
import type {FullUnreadCountsData} from "./unread.ts";
import {UserSearch} from "./user_search.ts";
import * as util from "./util.ts";

export let user_cursor: ListCursor<number> | undefined;
export let user_filter: UserSearch | undefined;

// Function initialized from `ui_init` to avoid importing narrow.js and causing circular imports.
let narrow_by_email: (email: string) => void;

function get_pm_list_item(user_id: string): JQuery | undefined {
    return buddy_list.find_li({
        key: Number.parseInt(user_id, 10),
    });
}

function set_pm_count(user_ids_string: string, count: number): void {
    const $pm_li = get_pm_list_item(user_ids_string);
    if ($pm_li !== undefined) {
        ui_util.update_unread_count_in_dom($pm_li, count);
    }
}

export function update_dom_with_unread_counts(counts: FullUnreadCountsData): void {
    // counts is just a data object that gets calculated elsewhere
    // Our job is to update some DOM elements.

    for (const [user_ids_string, count] of counts.pm_count) {
        // TODO: just use user_ids_string in our markup
        const is_pm = !user_ids_string.includes(",");
        if (is_pm) {
            set_pm_count(user_ids_string, count);
        }
    }
}

export function clear_for_testing(): void {
    user_cursor = undefined;
    user_filter = undefined;
}

export let update_presence_indicators = (): void => {
    $("[data-presence-indicator-user-id]").each(function () {
        const user_id = Number.parseInt($(this).attr("data-presence-indicator-user-id") ?? "", 10);
        const is_deactivated = !people.is_active_user_for_popover(user_id || 0);
        assert(!Number.isNaN(user_id));
        const user_circle_class = buddy_data.get_user_circle_class(user_id, is_deactivated);
        const user_circle_class_with_icon = `${user_circle_class} zulip-icon-${user_circle_class}`;
        $(this)
            .removeClass(
                `
                user-circle-active zulip-icon-user-circle-active
                user-circle-idle zulip-icon-user-circle-idle
                user-circle-offline zulip-icon-user-circle-offline
            `,
            )
            .addClass(user_circle_class_with_icon);
    });
};

export function rewire_update_presence_indicators(value: typeof update_presence_indicators): void {
    update_presence_indicators = value;
}

export function redraw_user(user_id: number): void {
    if (realm.realm_presence_disabled) {
        return;
    }

    const filter_text = get_filter_text();

    if (!buddy_data.matches_filter(filter_text, user_id)) {
        return;
    }

    buddy_list.insert_or_move([user_id]);
    update_presence_indicators();
}

export function rerender_user_sidebar_participants(): void {
    if (!narrow_state.stream_id() || narrow_state.topic() === undefined) {
        return;
    }

    buddy_list.rerender_participants();
}

export function check_should_redraw_new_user(user_id: number): boolean {
    if (realm.realm_presence_disabled) {
        return false;
    }

    const user_is_in_presence_info = presence.presence_info.has(user_id);
    const user_not_yet_known = people.maybe_get_user_by_id(user_id, true) === undefined;
    return user_is_in_presence_info && user_not_yet_known;
}

export function searching(): boolean {
    return user_filter?.searching() ?? false;
}

export let build_user_sidebar = (): number[] | undefined => {
    if (realm.realm_presence_disabled) {
        return undefined;
    }

    assert(user_filter !== undefined);
    const filter_text = user_filter.text();

    const all_user_ids = buddy_data.get_filtered_and_sorted_user_ids(filter_text);

    buddy_list.populate({all_user_ids});

    return all_user_ids; // for testing
};

export function rewire_build_user_sidebar(value: typeof build_user_sidebar): void {
    build_user_sidebar = value;
}

export function remove_loading_indicator_for_search(): void {
    loading.destroy_indicator($("#buddy-list-loading-subscribers"));
    $("#buddy_list_wrapper").show();
}

// We need to make sure we have all subscribers before displaying
// users during search, because we show all matching users and
// sort them by if they're subscribed. We store all pending fetches,
// in case we navigate away from a stream and back to it and kick
// off another search. We also store the current pending fetch so
// we know if it's still relevant once it's completed.
let pending_fetch_for_search_stream_id: number | undefined;
const all_pending_fetches_for_search = new Map<number, Promise<void>>();

export async function await_pending_promise_for_testing(): Promise<void> {
    assert(pending_fetch_for_search_stream_id !== undefined);
    await all_pending_fetches_for_search.get(pending_fetch_for_search_stream_id);
}

function do_update_users_for_search(): void {
    // Hide all the popovers but not userlist sidebar
    // when the user is searching.
    popovers.hide_all();

    const stream_id = narrow_state.stream_id(narrow_state.filter(), true);
    if (!stream_id || peer_data.has_full_subscriber_data(stream_id)) {
        pending_fetch_for_search_stream_id = undefined;
        build_user_sidebar();
        assert(user_cursor !== undefined);
        user_cursor.reset();
        return;
    }

    pending_fetch_for_search_stream_id = stream_id;

    // If we're already fetching for this stream, we don't need to wait for
    // another promise. The sidebar will be updated once that promise resolves.
    if (all_pending_fetches_for_search.has(stream_id)) {
        return;
    }

    all_pending_fetches_for_search.set(
        stream_id,
        (async () => {
            $("#buddy_list_wrapper").hide();
            loading.make_indicator($("#buddy-list-loading-subscribers"));
            await peer_data.maybe_fetch_stream_subscribers(stream_id);
            all_pending_fetches_for_search.delete(stream_id);

            // If we changed narrows during the fetch, don't rebuild the sidebar
            // anymore. Let the new narrow handle its own state. The loading indicator
            // should have already been removed on narrow change.
            if (pending_fetch_for_search_stream_id !== stream_id) {
                return;
            }
            remove_loading_indicator_for_search();
            pending_fetch_for_search_stream_id = undefined;
            build_user_sidebar();
            assert(user_cursor !== undefined);
            user_cursor.reset();
        })(),
    );
}

const update_users_for_search = _.throttle(do_update_users_for_search, 50);

export function initialize(opts: {narrow_by_email: (email: string) => void}): void {
    narrow_by_email = opts.narrow_by_email;

    set_cursor_and_filter();

    build_user_sidebar();

    buddy_list.start_scroll_handler();

    function get_full_presence_list_update(): void {
        activity.send_presence_to_server(redraw);
    }

    /* Time between keep-alive pings */
    const active_ping_interval_ms = realm.server_presence_ping_interval_seconds * 1000;
    util.call_function_periodically(get_full_presence_list_update, active_ping_interval_ms);

    // Let the server know we're here, but do not pass
    // redraw, since we just got all this info in page_params.
    activity.send_presence_to_server();
}

export function update_presence_info(info: PresenceInfoFromEvent): void {
    const presence_entry = Object.entries(info)[0];
    assert(presence_entry !== undefined);
    const [user_id_string, presence_info] = presence_entry;
    const user_id = Number.parseInt(user_id_string, 10);

    // There can be some case where the presence event
    // was set for an inaccessible user if
    // CAN_ACCESS_ALL_USERS_GROUP_LIMITS_PRESENCE is
    // disabled. We just ignore that event and return.
    const person = people.maybe_get_user_by_id(user_id, true);
    if (person === undefined || person.is_inaccessible_user) {
        return;
    }

    presence.update_info_from_event(user_id, presence_info);
    redraw_user(user_id);
    pm_list.update_private_messages();
}

export function redraw(): void {
    build_user_sidebar();
    assert(user_cursor !== undefined);
    user_cursor.redraw();
    pm_list.update_private_messages();
    update_presence_indicators();
}

export function reset_users(): void {
    // Call this when we're leaving the search widget.
    build_user_sidebar();
    assert(user_cursor !== undefined);
    user_cursor.clear();
}

export function narrow_for_user(opts: {$li: JQuery}): void {
    const user_id = buddy_list.get_user_id_from_li({$li: opts.$li});
    narrow_for_user_id({user_id});
}

export function narrow_for_user_id(opts: {user_id: number}): void {
    const person = people.get_by_user_id(opts.user_id);
    const email = person.email;

    assert(narrow_by_email);
    narrow_by_email(email);
    assert(user_filter !== undefined);
    user_filter.clear_search();
}

function keydown_enter_key(): void {
    assert(user_cursor !== undefined);
    const user_id = user_cursor.get_key();
    if (user_id === undefined) {
        return;
    }

    narrow_for_user_id({user_id});
    sidebar_ui.hide_all();
    popovers.hide_all();
}

export function set_cursor_and_filter(): void {
    user_cursor = new ListCursor({
        list: buddy_list,
        highlight_class: "highlighted_user",
    });

    user_filter = new UserSearch({
        update_list: update_users_for_search,
        reset_items: reset_users,
        on_focus() {
            user_cursor!.reset();
        },
        set_is_highlight_visible(value: boolean) {
            user_cursor!.set_is_highlight_visible(value);
        },
    });

    const $input = user_filter.input_field();

    $input.on("blur", () => {
        user_cursor!.clear();
    });

    keydown_util.handle({
        $elem: $input,
        handlers: {
            Enter() {
                keydown_enter_key();
                return true;
            },
            ArrowUp() {
                user_cursor!.prev();
                return true;
            },
            ArrowDown() {
                user_cursor!.next();
                return true;
            },
        },
    });
}

export function initiate_search(): void {
    if (user_filter) {
        $("body").removeClass("hide-right-sidebar");
        popovers.hide_all();
        user_filter.initiate_search();
    }
}

export function clear_search(): void {
    if (user_filter) {
        user_filter.clear_search();
        remove_loading_indicator_for_search();
    }
}

export function get_filter_text(): string {
    if (!user_filter) {
        // This may be overly defensive, but there may be
        // situations where get called before everything is
        // fully initialized.  The empty string is a fine
        // default here.
        blueslip.warn("get_filter_text() is called before initialization");
        return "";
    }

    return user_filter.text();
}
```

--------------------------------------------------------------------------------

---[FILE: add_group_members_pill.ts]---
Location: zulip-main/web/src/add_group_members_pill.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";

import * as add_subscribers_pill from "./add_subscribers_pill.ts";
import * as input_pill from "./input_pill.ts";
import * as keydown_util from "./keydown_util.ts";
import * as loading from "./loading.ts";
import * as people from "./people.ts";
import type {User} from "./people.ts";
import * as stream_pill from "./stream_pill.ts";
import type {CombinedPill, CombinedPillContainer} from "./typeahead_helper.ts";
import * as user_group_components from "./user_group_components.ts";
import * as user_group_pill from "./user_group_pill.ts";
import * as user_groups from "./user_groups.ts";
import type {UserGroup} from "./user_groups.ts";
import * as user_pill from "./user_pill.ts";

async function get_pill_user_ids(pill_widget: CombinedPillContainer): Promise<number[]> {
    const user_ids = user_pill.get_user_ids(pill_widget);
    const stream_user_ids = await stream_pill.get_user_ids(pill_widget);
    return [...user_ids, ...stream_user_ids];
}

function get_pill_group_ids(pill_widget: CombinedPillContainer): number[] {
    const group_user_ids = user_group_pill.get_group_ids(pill_widget);
    return group_user_ids;
}

function expand_group_pill($pill_elem: JQuery, pill_widget: CombinedPillContainer): void {
    const group_id = Number.parseInt($pill_elem.attr("data-user-group-id")!, 10);
    const group = user_groups.get_user_group_from_id(group_id);
    const direct_subgroup_ids = group.direct_subgroup_ids;
    const direct_member_ids = group.members;

    const taken_group_ids = user_group_pill.get_group_ids(pill_widget);
    const taken_user_ids = user_pill.get_user_ids(pill_widget);

    for (const member_id of direct_member_ids) {
        if (!taken_user_ids.includes(member_id)) {
            const user = people.get_by_user_id(member_id);
            user_pill.append_user(user, pill_widget, false);
        }
    }

    for (const group_id of direct_subgroup_ids) {
        if (!taken_group_ids.includes(group_id)) {
            const subgroup = user_groups.get_user_group_from_id(group_id);
            user_group_pill.append_user_group(subgroup, pill_widget, false, true);
        }
    }
}

export function create_item_from_text(
    text: string,
    current_items: CombinedPill[],
): CombinedPill | undefined {
    const stream_item = stream_pill.create_item_from_stream_name(text, current_items);
    if (stream_item) {
        return stream_item;
    }

    const group_item = user_group_pill.create_item_from_group_name(text, current_items);
    if (group_item) {
        const subgroup = user_groups.get_user_group_from_id(group_item.group_id);
        group_item.show_expand_button =
            subgroup.members.size > 0 || subgroup.direct_subgroup_ids.size > 0;

        if (user_group_components.active_group_id === undefined) {
            // Checking whether this group can be used as a subgroup
            // is not needed when creating a new group.
            return group_item;
        }

        const current_group_id = user_group_components.active_group_id;
        assert(current_group_id !== undefined);
        const current_group = user_groups.get_user_group_from_id(current_group_id);
        if (user_groups.check_group_can_be_subgroup(subgroup, current_group)) {
            return group_item;
        }

        return undefined;
    }

    return user_pill.create_item_from_user_id(text, current_items);
}

export function create({
    $pill_container,
    get_potential_members,
    get_potential_groups,
    with_add_button,
    onPillCreateAction,
    onPillRemoveAction,
}: {
    $pill_container: JQuery;
    get_potential_members: () => User[];
    get_potential_groups: () => UserGroup[];
    with_add_button: boolean;
    onPillCreateAction?: (pill_user_ids: number[], pill_subgroup_ids: number[]) => void;
    onPillRemoveAction?: (pill_user_ids: number[], pill_subgroup_ids: number[]) => void;
}): CombinedPillContainer {
    const pill_widget = input_pill.create<CombinedPill>({
        $container: $pill_container,
        create_item_from_text,
        get_text_from_item: add_subscribers_pill.get_text_from_item,
        get_display_value_from_item: add_subscribers_pill.get_display_value_from_item,
        generate_pill_html: add_subscribers_pill.generate_pill_html,
        show_outline_on_invalid_input: true,
    });

    if (onPillCreateAction) {
        pill_widget.onPillCreate(() => {
            void (async () => {
                loading.make_indicator($(".add-group-member-loading-spinner"), {
                    height: 56, // 4em at 14px / 1em
                });
                const user_ids = await get_pill_user_ids(pill_widget);
                onPillCreateAction(user_ids, get_pill_group_ids(pill_widget));
                loading.destroy_indicator($(".add-group-member-loading-spinner"));
            })();
        });
    }

    if (onPillRemoveAction) {
        pill_widget.onPillRemove(() => {
            void (async () => {
                const user_ids = await get_pill_user_ids(pill_widget);
                onPillRemoveAction(user_ids, get_pill_group_ids(pill_widget));
            })();
        });
    }

    function get_users(): User[] {
        const potential_members = get_potential_members();
        return user_pill.filter_taken_users(potential_members, pill_widget);
    }

    function get_user_groups(): UserGroup[] {
        let potential_groups = get_potential_groups();
        potential_groups = potential_groups.filter((item) => item.name !== "role:nobody");
        return user_group_pill.filter_taken_groups(potential_groups, pill_widget);
    }

    pill_widget.onPillExpand((pill) => {
        expand_group_pill(pill, pill_widget);
    });

    add_subscribers_pill.set_up_pill_typeahead({
        pill_widget,
        $pill_container,
        get_users,
        get_user_groups,
        for_stream_subscribers: false,
    });

    if (with_add_button) {
        add_subscribers_pill.set_up_handlers_for_add_button_state(pill_widget, $pill_container);
    }

    return pill_widget;
}

export function set_up_handlers({
    get_pill_widget,
    $parent_container,
    pill_selector,
    button_selector,
    action,
}: {
    get_pill_widget: () => CombinedPillContainer;
    $parent_container: JQuery;
    pill_selector: string;
    button_selector: string;
    action: ({
        pill_user_ids,
        pill_group_ids,
    }: {
        pill_user_ids: number[];
        pill_group_ids: number[];
    }) => void;
}): void {
    /*
        This is similar to add_subscribers_pill.set_up_handlers
        with only difference that selecting a user group does
        not add all its members to list, but instead just adds
        the group itself.
    */
    function callback(): void {
        const pill_widget = get_pill_widget();
        void (async () => {
            loading.make_indicator($(".add-group-member-loading-spinner"), {
                height: 56, // 4em at 14px / 1em
            });
            const pill_user_ids = await get_pill_user_ids(pill_widget);
            // If we're no longer in the same view after fetching
            // subscriber data, don't update the UI. We don't need
            // to destroy the loading spinner because the tab re-renders
            // every time it opens, and also there might be a new tab
            // with a current loading spinner.
            if (get_pill_widget() !== pill_widget) {
                return;
            }
            loading.destroy_indicator($(".add-group-member-loading-spinner"));
            const pill_group_ids = get_pill_group_ids(pill_widget);
            action({pill_user_ids, pill_group_ids});
        })();
    }

    $parent_container.on("keyup", pill_selector, (e) => {
        const pill_widget = get_pill_widget();
        if (!pill_widget.is_pending() && keydown_util.is_enter_event(e)) {
            e.preventDefault();
            callback();
        }
    });

    $parent_container.on("click", button_selector, (e) => {
        const pill_widget = get_pill_widget();
        if (!pill_widget.is_pending()) {
            e.preventDefault();
            callback();
        } else {
            // We are not appending any value here, but instead this is
            // a proxy to invoke the error state for a pill widget
            // that would usually get triggered on pressing enter.
            pill_widget.appendValue(pill_widget.getCurrentText()!);
        }
    });
}
```

--------------------------------------------------------------------------------

---[FILE: add_stream_options_popover.ts]---
Location: zulip-main/web/src/add_stream_options_popover.ts

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import type * as tippy from "tippy.js";

import render_left_sidebar_stream_setting_popover from "../templates/popovers/left_sidebar/left_sidebar_stream_setting_popover.hbs";

import * as popover_menus from "./popover_menus.ts";
import * as settings_data from "./settings_data.ts";
import {parse_html} from "./ui_util.ts";

export function initialize(): void {
    popover_menus.register_popover_menu("#streams_inline_icon", {
        theme: "popover-menu",
        onShow(instance) {
            const can_create_streams =
                settings_data.user_can_create_private_streams() ||
                settings_data.user_can_create_public_streams() ||
                settings_data.user_can_create_web_public_streams();

            if (!can_create_streams) {
                // If the user can't create streams, we directly
                // navigate them to the Stream settings subscribe UI.
                window.location.assign("#channels/all");
                // Returning false from an onShow handler cancels the show.
                return false;
            }

            // Assuming that the instance can be shown, track and
            // prep the instance for showing
            popover_menus.popover_instances.stream_settings = instance;
            instance.setContent(parse_html(render_left_sidebar_stream_setting_popover()));
            popover_menus.on_show_prep(instance);

            //  When showing the popover menu, we want the
            // "Add channels" and the "Filter channels" tooltip
            //  to appear below the "Add channels" icon.
            const add_streams_tooltip: tippy.ReferenceElement | undefined =
                $("#add_streams_tooltip").get(0);
            assert(add_streams_tooltip !== undefined);
            add_streams_tooltip._tippy?.setProps({
                placement: "bottom",
            });

            return undefined;
        },
        onHidden(instance) {
            instance.destroy();
            popover_menus.popover_instances.stream_settings = null;

            //  After the popover menu is closed, we want the
            //  "Add channels" and the "Filter channels" tooltip
            //  to appear at it's original position that is
            //  above the "Add channels" icon.
            const add_streams_tooltip: tippy.ReferenceElement | undefined =
                $("#add_streams_tooltip").get(0);
            assert(add_streams_tooltip !== undefined);
            add_streams_tooltip._tippy?.setProps({
                placement: "top",
            });
        },
    });
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 665
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 665 of 1290)

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

---[FILE: search_util.ts]---
Location: zulip-main/web/src/search_util.ts

```typescript
export function get_search_terms(input: string): string[] {
    const search_terms = input
        .toLowerCase()
        .split(",")
        .map((s) => s.trim());
    return search_terms;
}

export function vanilla_match(opts: {val: string; search_terms: string[]}): boolean {
    /*
        This is a pretty vanilla search criteria
        where we see if any of our search terms
        is in our value. When in doubt we should use
        this for all Zulip filters, but we may
        have more complicated use cases in some
        places.

        This is case insensitive.
    */
    const val = opts.val.toLowerCase();
    return opts.search_terms.some((term) => val.includes(term));
}
```

--------------------------------------------------------------------------------

---[FILE: sentry.ts]---
Location: zulip-main/web/src/sentry.ts
Signals: Zod

```typescript
import * as Sentry from "@sentry/browser";
import * as z from "zod/mini";

type UserInfo = {
    id?: string;
    realm: string;
    role?: string;
};

const sentry_params_schema = z.object({
    dsn: z.string(),
    environment: z.string(),
    realm_key: z.string(),
    sample_rate: z.number(),
    server_version: z.string(),
    trace_rate: z.number(),
    user: z.optional(z.object({id: z.number(), role: z.string()})),
});

const sentry_params_json =
    window.document?.querySelector("script#sentry-params")?.textContent ?? undefined;
const sentry_params =
    sentry_params_json === undefined
        ? undefined
        : sentry_params_schema.parse(JSON.parse(sentry_params_json));

export function normalize_path(path: string, is_portico = false): string {
    if (path === undefined) {
        return "unknown";
    }
    path = path
        .replace(/\/\d+(\/|$)/, "/*$1")
        .replace(
            /^\/(join|reactivate|new|accounts\/do_confirm|accounts\/confirm_new_email)\/[^/]+(\/?)$/,
            "$1/*$2",
        );
    if (is_portico) {
        return "portico: " + path;
    }
    return path;
}

export function shouldCreateSpanForRequest(url: string): boolean {
    const parsed = new URL(url, window.location.href);
    return parsed.pathname !== "/json/events";
}

if (sentry_params !== undefined) {
    const sample_rates = new Map([
        // This is controlled by shouldCreateSpanForRequest, above, but also put here for consistency
        ["call GET /json/events", 0],
        // These requests are high-volume and do not add much data
        ["call POST /json/users/me/presence", 0.01],
        ["call POST /json/typing", 0.05],
    ]);

    Sentry.init({
        dsn: sentry_params.dsn,
        environment: sentry_params.environment,
        tunnel: "/error_tracing",

        release: "zulip-server@" + ZULIP_VERSION,
        integrations: [
            Sentry.browserTracingIntegration({
                instrumentNavigation: false,
                beforeStartSpan(context) {
                    return {
                        ...context,
                        metadata: {source: "custom"},
                        name: normalize_path(
                            window.location.pathname,
                            sentry_params.realm_key === "www",
                        ),
                    };
                },
                shouldCreateSpanForRequest,
            }),
        ],
        sampleRate: sentry_params.sample_rate,
        tracesSampler(samplingContext) {
            const base_rate = sentry_params.trace_rate;
            const name = samplingContext.name;
            return base_rate * (sample_rates.get(name) ?? 1);
        },
        initialScope(scope) {
            const user_role = sentry_params.user?.role ?? "Logged out";
            const user_info: UserInfo = {
                realm: sentry_params.realm_key,
                role: user_role,
            };
            if (sentry_params.user !== undefined) {
                user_info.id = sentry_params.user.id.toString();
            }
            scope.setTags({
                realm: sentry_params.realm_key,
                server_version: sentry_params.server_version,
                user_role,
            });
            scope.setUser(user_info);
            return scope;
        },
    });
} else {
    Sentry.init({});
}
```

--------------------------------------------------------------------------------

---[FILE: sent_messages.ts]---
Location: zulip-main/web/src/sent_messages.ts

```typescript
import * as Sentry from "@sentry/browser";

import * as blueslip from "./blueslip.ts";

export let next_local_id = 0;
export const messages = new Map<string, MessageState>();

export function get_new_local_id(): string {
    next_local_id += 1;
    const local_id = next_local_id;
    return "loc-" + local_id.toString();
}

export class MessageState {
    local_id: string;
    locally_echoed: boolean;
    rendered_changed = false;

    server_acked = false;
    saw_event = false;

    span: Sentry.Span | undefined = undefined;
    event_span: Sentry.Span | undefined = undefined;

    constructor(opts: {local_id: string; locally_echoed: boolean}) {
        this.local_id = opts.local_id;
        this.locally_echoed = opts.locally_echoed;
    }

    wrap_send(callback: () => void): void {
        Sentry.startSpanManual(
            {
                op: "function",
                name: "message send",
            },
            (span) => {
                try {
                    this.span = span;
                    this.event_span = Sentry.startInactiveSpan({
                        op: "function",
                        name: "message send (server event loop)",
                    });
                    callback();
                } catch (error) {
                    this.event_span?.end();
                    span?.end();
                    throw error;
                }
            },
        );
    }

    mark_disparity(): void {
        this.rendered_changed = true;
    }

    report_server_ack(): void {
        this.server_acked = true;
        this.maybe_finish_txn();
    }

    report_event_received(): void {
        if (!this.event_span) {
            return;
        }
        this.saw_event = true;
        this.event_span?.end();
        this.maybe_finish_txn();
    }

    report_error(): void {
        this.event_span?.end();
        this.span?.end();
    }

    maybe_finish_txn(): void {
        if (!this.saw_event || !this.server_acked) {
            return;
        }
        const setTag = (name: string, val: boolean): void => {
            const str_val = val ? "true" : "false";
            this.event_span?.setAttribute(name, str_val);
            this.span?.setAttribute(name, str_val);
        };
        setTag("rendered_changed", this.rendered_changed);
        setTag("locally_echoed", this.locally_echoed);
        this.span?.end();
        messages.delete(this.local_id);
    }
}

export function start_tracking_message(opts: {local_id: string; locally_echoed: boolean}): void {
    const local_id = opts.local_id;

    if (!opts.local_id) {
        blueslip.error("You must supply a local_id");
        return;
    }

    if (messages.has(local_id)) {
        blueslip.error("We are reusing a local_id");
        return;
    }

    const state = new MessageState(opts);

    messages.set(local_id, state);
}

export function get_message_state(local_id: string): MessageState | undefined {
    const state = messages.get(local_id);

    if (!state) {
        blueslip.warn("Unknown local_id: " + local_id);
    }

    return state;
}

export function wrap_send(local_id: string, callback: () => void): void {
    const state = get_message_state(local_id);
    if (state) {
        state.wrap_send(callback);
    } else {
        callback();
    }
}

export function mark_disparity(local_id: string): void {
    const state = get_message_state(local_id);
    if (!state) {
        return;
    }
    state.mark_disparity();
}

export function report_event_received(local_id: string): void {
    if (local_id === undefined) {
        return;
    }
    const state = get_message_state(local_id);
    if (!state) {
        return;
    }

    state.report_event_received();
}
```

--------------------------------------------------------------------------------

---[FILE: server_events.js]---
Location: zulip-main/web/src/server_events.js

```javascript
import $ from "jquery";
import _ from "lodash";

import * as blueslip from "./blueslip.ts";
import * as channel from "./channel.ts";
import * as echo from "./echo.ts";
import * as loading from "./loading.ts";
import * as message_events from "./message_events.ts";
import {page_params} from "./page_params.ts";
import * as popup_banners from "./popup_banners.ts";
import * as reload from "./reload.ts";
import * as reload_state from "./reload_state.ts";
import * as sent_messages from "./sent_messages.ts";
import * as server_events_dispatch from "./server_events_dispatch.js";
import {queue_id} from "./server_events_state.ts";
import {server_message_schema} from "./server_message.ts";
import * as util from "./util.ts";
import * as watchdog from "./watchdog.ts";

// Docs: https://zulip.readthedocs.io/en/latest/subsystems/events-system.html

let last_event_id;
let event_queue_longpoll_timeout_seconds;

let waiting_on_initial_fetch = true;

let events_stored_while_loading = [];

let get_events_xhr;
let get_events_timeout;
let get_events_failures = 0;
const get_events_params = {};

let event_queue_expired = false;

function get_events_success(events) {
    let raw_messages = [];
    const update_message_events = [];
    const post_message_events = [];

    const clean_event = function clean_event(event) {
        // Only log a whitelist of the event to remove private data
        return _.pick(event, "id", "type", "op");
    };

    for (const event of events) {
        try {
            get_events_params.last_event_id = Math.max(get_events_params.last_event_id, event.id);
        } catch (error) {
            blueslip.error("Failed to update last_event_id", {event: clean_event(event)}, error);
        }
    }

    if (waiting_on_initial_fetch) {
        events_stored_while_loading = [...events_stored_while_loading, ...events];
        return;
    }

    if (events_stored_while_loading.length > 0) {
        events = [...events_stored_while_loading, ...events];
        events_stored_while_loading = [];
    }

    // Most events are dispatched via the code server_events_dispatch,
    // called in the default case.  The goal of this split is to avoid
    // contributors needing to read or understand the complex and
    // rarely modified logic for non-normal events.
    const dispatch_event = function dispatch_event(event) {
        switch (event.type) {
            case "message": {
                const msg = server_message_schema.parse(event.message);
                msg.flags = event.flags;
                if (event.local_message_id) {
                    msg.local_id = event.local_message_id;
                }
                raw_messages.push(msg);
                break;
            }

            case "update_message":
                update_message_events.push(event);
                break;

            case "delete_message":
            case "submessage":
            case "update_message_flags":
                post_message_events.push(event);
                break;

            default:
                server_events_dispatch.dispatch_normal_event(event);
        }
    };

    for (const event of events) {
        try {
            dispatch_event(event);
        } catch (error) {
            blueslip.error("Failed to process an event", {event: clean_event(event)}, error);
        }
    }

    if (raw_messages.length > 0) {
        // Sort by ID, so that if we get multiple messages back from
        // the server out-of-order, we'll still end up with our
        // message lists in order.
        raw_messages = _.sortBy(raw_messages, "id");
        try {
            raw_messages = echo.process_from_server(raw_messages);
            if (raw_messages.length > 0) {
                let sent_by_this_client = false;
                for (const msg of raw_messages) {
                    if (sent_messages.messages.has(msg.local_id)) {
                        sent_by_this_client = true;
                    }
                    sent_messages.report_event_received(msg.local_id);
                }
                // If some message in this batch of events was sent by this
                // client, almost every time, this message will be the only one
                // in messages, because multiple messages being returned by
                // get_events usually only happens when a client is offline.
                // But in any case, insert_new_messages handles multiple
                // messages, only one of which was sent by this client,
                // correctly.
                message_events.insert_new_messages({
                    type: "server_message",
                    raw_messages,
                    sent_by_this_client,
                });
            }
        } catch (error) {
            blueslip.error("Failed to insert new messages", undefined, error);
        }
    }

    if (update_message_events.length > 0) {
        try {
            message_events.update_messages(update_message_events);
        } catch (error) {
            blueslip.error("Failed to update messages", undefined, error);
        }
    }

    // We do things like updating message flags and deleting messages last,
    // to avoid ordering issues that are caused by batch handling of
    // messages above.
    for (const event of post_message_events) {
        server_events_dispatch.dispatch_normal_event(event);
    }
}

function get_events({dont_block = false} = {}) {
    if (reload_state.is_in_progress()) {
        return;
    }

    // TODO: In the future, we may implement Tornado support for live
    // update for spectators (#20315), but until then, there's nothing
    // to do here. Update report_late_add if this changes.
    if (page_params.is_spectator) {
        return;
    }

    get_events_params.dont_block = dont_block || get_events_failures > 0;

    if (get_events_params.dont_block) {
        // If we're requesting an immediate re-connect to the server,
        // that means it's fairly likely that this client has been off
        // the Internet and thus may have stale state (which is
        // important for potential presence issues).
        watchdog.set_suspect_offline(true);
    }
    if (get_events_params.queue_id === undefined) {
        get_events_params.queue_id = queue_id;
        get_events_params.last_event_id = last_event_id;
    }

    if (get_events_xhr !== undefined) {
        get_events_xhr.abort();
    }
    if (get_events_timeout !== undefined) {
        clearTimeout(get_events_timeout);
    }

    get_events_params.client_gravatar = true;
    get_events_params.slim_presence = true;

    get_events_timeout = undefined;
    get_events_xhr = channel.get({
        url: "/json/events",
        data: get_events_params,
        timeout: event_queue_longpoll_timeout_seconds * 1000,
        success(data) {
            watchdog.set_suspect_offline(false);
            try {
                get_events_xhr = undefined;
                get_events_failures = 0;
                popup_banners.close_connection_error_popup_banner("server_events");

                get_events_success(data.events);
            } catch (error) {
                blueslip.error("Failed to handle get_events success", undefined, error);
            }
            get_events_timeout = setTimeout(get_events, 0);
        },
        error(xhr, error_type) {
            const retry_delay_secs = util.get_retry_backoff_seconds(xhr, get_events_failures);
            try {
                get_events_xhr = undefined;
                // If we're old enough that our message queue has been
                // garbage collected, immediately reload.
                if (xhr.status === 400 && xhr.responseJSON?.code === "BAD_EVENT_QUEUE_ID") {
                    event_queue_expired = true;
                    reload.initiate({
                        immediate: true,
                        save_compose: true,
                    });
                    return;
                }

                if (error_type === "abort") {
                    // Don't restart if we explicitly aborted
                    return;
                } else if (error_type === "timeout") {
                    // Retry indefinitely on timeout.
                    get_events_failures = 0;
                    popup_banners.close_connection_error_popup_banner("server_events");
                } else {
                    get_events_failures += 1;
                }

                if (get_events_failures >= 8) {
                    popup_banners.open_connection_error_popup_banner({
                        caller: "server_events",
                        retry_delay_secs,
                        on_retry_callback() {
                            restart_get_events({dont_block: true});
                        },
                    });
                }
            } catch (error) {
                blueslip.error("Failed to handle get_events error", undefined, error);
            }

            get_events_timeout = setTimeout(get_events, retry_delay_secs * 1000);
        },
    });
}

export function assert_get_events_running(error_message) {
    if (get_events_xhr === undefined && get_events_timeout === undefined) {
        restart_get_events({dont_block: true});
        blueslip.error(error_message);
    }
}

export function restart_get_events(options) {
    get_events(options);
}

export function force_get_events() {
    get_events_timeout = setTimeout(get_events, 0);
}

export function finished_initial_fetch() {
    waiting_on_initial_fetch = false;
    get_events_success([]);
    // Destroy loading indicator after we added fetched messages.
    loading.destroy_indicator($("#page_loading_indicator"));
}

export function initialize(params) {
    last_event_id = params.last_event_id;
    event_queue_longpoll_timeout_seconds = params.event_queue_longpoll_timeout_seconds;

    window.addEventListener("beforeunload", () => {
        cleanup_event_queue();
    });
    reload.add_reload_hook(cleanup_event_queue);
    watchdog.on_unsuspend(() => {
        // Immediately poll for new events on unsuspend
        blueslip.log("Restarting get_events due to unsuspend");
        get_events_failures = 0;
        restart_get_events({dont_block: true});
    });

    get_events();
}

function cleanup_event_queue() {
    // Submit a request to the server to clean up our event queue
    if (event_queue_expired || page_params.no_event_queue) {
        return;
    }
    blueslip.log("Cleaning up our event queue");
    // Set expired because in a reload we may be called twice.
    event_queue_expired = true;
    channel.del({
        url: "/json/events",
        data: {queue_id},
        ignore_reload: true,
    });
}

// For unit testing
export const _get_events_success = get_events_success;
```

--------------------------------------------------------------------------------

````

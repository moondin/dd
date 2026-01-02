---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 720
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 720 of 1290)

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

---[FILE: integrations.ts]---
Location: zulip-main/web/src/portico/integrations.ts

```typescript
import $ from "jquery";
import _ from "lodash";

import * as common from "../common.ts";

import * as google_analytics from "./google-analytics.ts";

// these constants are populated immediately with data from the DOM on page load
// name -> display name
const INTEGRATIONS = new Map<string, string>();

function load_integration_names_from_catalog(): void {
    for (const integration of $(".integration-lozenge")) {
        const name = $(integration).attr("data-name");
        const display_name = $(integration).find(".integration-name").text().trim();

        if (display_name && name) {
            INTEGRATIONS.set(name, display_name);
        }
    }
}

let search_query = "";

function adjust_font_sizing(): void {
    for (const integration of $(".integration-lozenge")) {
        const $integration_name = $(integration).find(".integration-name");
        const $integration_category = $(integration).find(".integration-category");

        // if the text has wrapped to two lines, decrease font-size
        if (($integration_name.height() ?? 0) > 30) {
            $integration_name.css("font-size", "1em");
            if (($integration_name.height() ?? 0) > 30) {
                $integration_name.css("font-size", ".95em");
            }
        }

        if (($integration_category.height() ?? 0) > 30) {
            $integration_category.css("font-size", ".8em");
            if (($integration_category.height() ?? 0) > 30) {
                $integration_category.css("font-size", ".75em");
            }
        }
    }
}

const filter_integrations = _.debounce(() => {
    const max_scrollY = window.scrollY;

    for (const integration of $(".integration-lozenges").find(".integration-lozenge")) {
        const $integration = $(integration);

        const display_name = INTEGRATIONS.get($integration.attr("data-name")!) ?? "";
        const display = common.phrase_match(search_query, display_name);
        $integration.prop("hidden", !display);

        document.body.scrollTop = Math.min(window.scrollY, max_scrollY);
    }

    adjust_font_sizing();
}, 50);

function render(query: string): void {
    if (search_query !== query) {
        search_query = query;
        filter_integrations();
    }
}

function toggle_categories_dropdown(): void {
    const $dropdown_list = $(".integration-categories-dropdown .dropdown-list");
    $dropdown_list.slideToggle(250);
}

function setup_integration_catalog_events(): void {
    const $search_input = $<HTMLInputElement>(".integrations .searchbar .search_input");
    $search_input.on("keydown", function (e) {
        if (e.key === "Enter" && this.value.trim() !== "") {
            $(".integration-lozenges .integration-lozenge:not([hidden])")[0]?.closest("a")?.click();
        }
    });
    $search_input.on("input", function () {
        render(this.value.toLowerCase());
    });

    $(".integration-categories-dropdown .integration-toggle-categories-dropdown").on(
        "click",
        () => {
            toggle_categories_dropdown();
        },
    );

    $(window).on("scroll", () => {
        if (document.body.scrollTop > 330) {
            $(".integration-categories-sidebar").addClass("sticky");
        } else {
            $(".integration-categories-sidebar").removeClass("sticky");
        }
    });

    $(window).on("resize", () => {
        adjust_font_sizing();
    });
}

// init
$(() => {
    const path = window.location.pathname;
    const is_doc_view =
        path !== "/integrations/" &&
        !path.startsWith("/integrations/category/") &&
        path.startsWith("/integrations/");

    if (!is_doc_view) {
        setup_integration_catalog_events();
        load_integration_names_from_catalog();
        render(search_query);
        $(".integrations .searchbar .search_input").trigger("focus");
    }

    google_analytics.config({page_path: window.location.pathname});
    adjust_font_sizing();
});
```

--------------------------------------------------------------------------------

---[FILE: integrations_dev_panel.ts]---
Location: zulip-main/web/src/portico/integrations_dev_panel.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as channel from "../channel.ts";
import * as util from "../util.ts";
// Main JavaScript file for the integrations development panel at
// /devtools/integrations.

// Data segment: We lazy load the requested fixtures from the backend
// as and when required and then cache them here.

const fixture_schema = z.record(
    z.string(),
    z.object({
        body: z.unknown(),
        headers: z.record(z.string(), z.string()),
    }),
);

type Fixtures = z.infer<typeof fixture_schema>;

type HTMLSelectOneElement = HTMLSelectElement & {type: "select-one"};

type ClearHandlers = {
    stream_name: string;
    topic_name: string;
    URL: string;
    results_notice: string;
    bot_name: () => void;
    integration_name: () => void;
    fixture_name: () => void;
    fixture_body: () => void;
    custom_http_headers: () => void;
    results: () => void;
};

const integrations_api_response_schema = z.object({
    msg: z.string(),
    responses: z.array(
        z.object({
            status_code: z.number(),
            message: z.string(),
            fixture_name: z.optional(z.string()),
        }),
    ),
    result: z.string(),
});

type ServerResponse = z.infer<typeof integrations_api_response_schema>;

const loaded_fixtures = new Map<string, Fixtures>();
const url_base = "/api/v1/external/";

// A map defining how to clear the various UI elements.
const clear_handlers: ClearHandlers = {
    stream_name: "#stream_name",
    topic_name: "#topic_name",
    URL: "#URL",
    results_notice: "#results_notice",
    bot_name() {
        const bot_option = $<HTMLSelectOneElement>("select:not([multiple])#bot_name").children()[0];
        assert(bot_option instanceof HTMLOptionElement);
        bot_option.selected = true;
    },
    integration_name() {
        const integration_option = $<HTMLSelectOneElement>(
            "select:not([multiple])#integration_name",
        ).children()[0];
        assert(integration_option instanceof HTMLOptionElement);
        integration_option.selected = true;
    },
    fixture_name() {
        $("#fixture_name").empty();
    },
    fixture_body() {
        util.the($<HTMLTextAreaElement>("textarea#fixture_body")).value = "";
    },
    custom_http_headers() {
        util.the($<HTMLTextAreaElement>("textarea#custom_http_headers")).value = "{}";
    },
    results() {
        util.the($<HTMLTextAreaElement>("textarea#idp-results")).value = "";
    },
};

function clear_elements(elements: (keyof ClearHandlers)[]): void {
    // Supports strings (a selector to clear) or calling a function
    // (for more complex logic).
    for (const element_name of elements) {
        const handler = clear_handlers[element_name];
        if (typeof handler === "string") {
            $(handler).val("").empty();
        } else {
            handler();
        }
    }
    return;
}

// Success/failure colors used for displaying results to the user.
const results_notice_level_to_color_map = {
    warning: "#be1931",
    success: "#085d44",
};

function set_results_notice(msg: string, level: "warning" | "success"): void {
    $("#results_notice").text(msg).css("color", results_notice_level_to_color_map[level]);
}

function get_api_key_from_selected_bot(): string {
    return $<HTMLSelectOneElement>("select:not([multiple])#bot_name").val()!;
}

function get_selected_integration_name(): string {
    return $<HTMLSelectOneElement>("select:not([multiple])#integration_name").val()!;
}

function get_fixture_format(fixture_name: string): string | undefined {
    return fixture_name.split(".").at(-1);
}

function get_custom_http_headers(): string | undefined {
    let custom_headers = $<HTMLTextAreaElement>("textarea#custom_http_headers").val()!;
    if (custom_headers !== "") {
        // JSON.parse("") would trigger an error, as empty strings do not qualify as JSON.
        try {
            // Let JavaScript validate the JSON for us.
            custom_headers = JSON.stringify(JSON.parse(custom_headers));
        } catch {
            set_results_notice("Custom HTTP headers are not in a valid JSON format.", "warning");
            return undefined;
        }
    }
    return custom_headers;
}

function set_results(response: ServerResponse): void {
    /* The backend returns the JSON responses for each of the
    send_message actions included in our request (which is just 1 for
    send, but usually is several for send all).  We display these
    responses to the user in the "results" panel.

    The following is a bit messy, but it's a devtool, so ultimately OK */
    const responses = response.responses;

    let data = "Results:\n\n";
    for (const response of responses) {
        if (response.fixture_name !== undefined) {
            data += "Fixture:            " + response.fixture_name;
            data += "\nStatus code:    " + response.status_code;
        } else {
            data += "Status code:    " + response.status_code;
        }
        data += "\nResponse:       " + response.message + "\n\n";
    }
    util.the($<HTMLTextAreaElement>("textarea#idp-results")).value = data;
}

function load_fixture_body(fixture_name: string): void {
    /* Given a fixture name, use the loaded_fixtures dictionary to set
     * the fixture body field. */
    const integration_name = get_selected_integration_name();
    const fixture = loaded_fixtures.get(integration_name)![fixture_name];
    assert(fixture !== undefined);
    let fixture_body = fixture.body;
    const headers = fixture.headers;
    if (fixture_body === undefined) {
        set_results_notice("Fixture does not have a body.", "warning");
        return;
    }
    if (get_fixture_format(fixture_name) === "json") {
        // The 4 argument is pretty printer indentation.
        fixture_body = JSON.stringify(fixture_body, null, 4);
    }
    assert(typeof fixture_body === "string");
    util.the($<HTMLTextAreaElement>("textarea#fixture_body")).value = fixture_body;
    util.the($<HTMLTextAreaElement>("textarea#custom_http_headers")).value = JSON.stringify(
        headers,
        null,
        4,
    );

    return;
}

function load_fixture_options(integration_name: string): void {
    /* Using the integration name and loaded_fixtures object to set
    the fixture options for the fixture_names dropdown and also set
    the fixture body to the first fixture by default. */
    const fixtures_options_dropdown = util.the(
        $<HTMLSelectOneElement>("select:not([multiple])#fixture_name"),
    );
    const fixtures = loaded_fixtures.get(integration_name);
    assert(fixtures !== undefined);
    const fixtures_names = Object.keys(fixtures);
    fixtures_names.sort();

    for (const fixture_name of fixtures_names) {
        const new_dropdown_option = document.createElement("option");
        new_dropdown_option.value = fixture_name;
        new_dropdown_option.textContent = fixture_name;
        fixtures_options_dropdown.add(new_dropdown_option);
    }
    assert(fixtures_names[0] !== undefined);
    load_fixture_body(fixtures_names[0]);

    return;
}

function update_url(): void {
    /* Construct the URL that the webhook should be targeting, using
    the bot's API key and the integration name.  The stream and topic
    are both optional, and for the sake of completeness, it should be
    noted that the topic is irrelevant without specifying the
    stream. */
    const url_field = $<HTMLInputElement>("input#URL")[0];

    const integration_name = get_selected_integration_name();
    const api_key = get_api_key_from_selected_bot();
    assert(typeof api_key === "string");
    if (integration_name === "" || api_key === "") {
        clear_elements(["URL"]);
    } else {
        const params = new URLSearchParams({api_key});
        const stream_name = $<HTMLInputElement>("input#stream_name").val()!;
        if (stream_name !== "") {
            params.set("stream", stream_name);
            const topic_name = $<HTMLInputElement>("input#topic_name").val()!;
            if (topic_name !== "") {
                params.set("topic", topic_name);
            }
        }
        const url = `${url_base}${integration_name}?${params.toString()}`;
        url_field!.value = url;
    }

    return;
}

// API callers: These methods handle communicating with the Python backend API.
function handle_unsuccessful_response(response: JQuery.jqXHR): void {
    const parsed = z.object({msg: z.string()}).safeParse(response.responseJSON);
    if (parsed.data) {
        const status_code = response.status;
        set_results_notice(`Result: (${status_code}) ${parsed.data.msg}`, "warning");
    } else {
        // If the response is not a JSON response, then it is probably
        // Django returning an HTML response containing a stack trace
        // with useful debugging information regarding the backend
        // code.
        set_results_notice(response.responseText, "warning");
    }
    return;
}

function get_fixtures(integration_name: string): void {
    /* Request fixtures from the backend for any integrations that we
    don't already have fixtures cached in loaded_fixtures). */
    if (integration_name === "") {
        clear_elements([
            "custom_http_headers",
            "fixture_body",
            "fixture_name",
            "URL",
            "results_notice",
        ]);
        return;
    }

    if (loaded_fixtures.has(integration_name)) {
        load_fixture_options(integration_name);
        return;
    }

    // We don't have the fixtures for this integration; fetch them
    // from the backend.  Relative URL pattern:
    // /devtools/integrations/<integration_name>/fixtures
    void channel.get({
        url: "/devtools/integrations/" + integration_name + "/fixtures",
        success(raw_response) {
            const response = z
                .object({
                    result: z.string(),
                    msg: z.string(),
                    fixtures: fixture_schema,
                })
                .parse(raw_response);

            loaded_fixtures.set(integration_name, response.fixtures);
            load_fixture_options(integration_name);
            return;
        },
        error: handle_unsuccessful_response,
    });

    return;
}

function send_webhook_fixture_message(): void {
    /* Make sure that the user is sending valid JSON in the fixture
    body and that the URL is not empty. Then simply send the fixture
    body to the target URL. */

    // Note: If the user just logged in to a different Zulip account
    // using another tab while the integrations dev panel is open,
    // then the csrf token that we have stored in the hidden input
    // element would have been expired, leading to an error message
    // when the user tries to send the fixture body.
    const csrftoken = $<HTMLInputElement>("input#csrftoken").val()!;

    const url = $("#URL").val();
    if (url === "") {
        set_results_notice("URL can't be empty.", "warning");
        return;
    }

    let body = $<HTMLTextAreaElement>("textarea#fixture_body").val()!;
    const fixture_name = $<HTMLSelectOneElement>("select:not([multiple])#fixture_name").val();
    let is_json = false;
    if (fixture_name && get_fixture_format(fixture_name) === "json") {
        try {
            // Let JavaScript validate the JSON for us.
            body = JSON.stringify(JSON.parse(body));
            is_json = true;
        } catch {
            set_results_notice("Invalid JSON in fixture body.", "warning");
            return;
        }
    }

    const custom_headers = get_custom_http_headers();

    void channel.post({
        url: "/devtools/integrations/check_send_webhook_fixture_message",
        data: {url, body, custom_headers, is_json},
        beforeSend(xhr) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        success(raw_response) {
            // If the previous fixture body was sent successfully,
            // then we should change the success message up a bit to
            // let the user easily know that this fixture body was
            // also sent successfully.
            const response = integrations_api_response_schema.parse(raw_response);
            set_results(response);
            if ($("#results_notice").text() === "Success!") {
                set_results_notice("Success!!!", "success");
            } else {
                set_results_notice("Success!", "success");
            }
            return;
        },
        error: handle_unsuccessful_response,
    });

    return;
}

function send_all_fixture_messages(): void {
    /* Send all fixture messages for a given integration. */
    const url = $("#URL").val();
    const integration = get_selected_integration_name();
    if (integration === "") {
        set_results_notice("You have to select an integration first.", "warning");
        return;
    }

    const csrftoken = $<HTMLInputElement>("input#csrftoken").val()!;
    void channel.post({
        url: "/devtools/integrations/send_all_webhook_fixture_messages",
        data: {url, integration_name: integration},
        beforeSend(xhr) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        success(raw_response) {
            const response = integrations_api_response_schema.parse(raw_response);
            set_results(response);
        },
        error: handle_unsuccessful_response,
    });

    return;
}

// Initialization
$(() => {
    clear_elements([
        "stream_name",
        "topic_name",
        "URL",
        "bot_name",
        "integration_name",
        "fixture_name",
        "custom_http_headers",
        "fixture_body",
        "results_notice",
        "results",
    ]);

    util.the($<HTMLInputElement>("input#stream_name")).value = "Denmark";
    util.the($<HTMLInputElement>("input#topic_name")).value = "Integrations testing";

    const potential_default_bot = util.the(
        $<HTMLSelectOneElement>("select:not([multiple])#bot_name"),
    )[1];
    assert(potential_default_bot instanceof HTMLOptionElement);
    if (potential_default_bot !== undefined) {
        potential_default_bot.selected = true;
    }

    $<HTMLSelectOneElement>("select:not([multiple])#integration_name").on("change", function () {
        clear_elements(["custom_http_headers", "fixture_body", "fixture_name", "results_notice"]);
        const integration_name = $(this.selectedOptions).val()!;
        get_fixtures(integration_name);
        update_url();
        return;
    });

    $<HTMLSelectOneElement>("select:not([multiple])#fixture_name").on("change", function () {
        clear_elements(["fixture_body", "results_notice"]);
        const fixture_name = $(this.selectedOptions).val()!;
        load_fixture_body(fixture_name);
        return;
    });

    $("#send_fixture_button").on("click", () => {
        send_webhook_fixture_message();
        return;
    });

    $("#send_all_fixtures_button").on("click", () => {
        clear_elements(["results_notice"]);
        send_all_fixture_messages();
        return;
    });

    $("#bot_name").on("change", update_url);

    $("#stream_name").on("change", update_url);

    $("#topic_name").on("change", update_url);
});
```

--------------------------------------------------------------------------------

---[FILE: legacy_landing_page.ts]---
Location: zulip-main/web/src/portico/legacy_landing_page.ts
Signals: Zod

```typescript
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import {page_params} from "../base_page_params.ts";

import type {UserOS} from "./tabbed-instructions.ts";
import {detect_user_os} from "./tabbed-instructions.ts";
import render_tabs from "./team.ts";

type VersionInfo = {
    description: string;
    app_type: "mobile" | "desktop";
} & (
    | {
          alt: "Windows";
          download_link: string;
          install_guide: string;
      }
    | {
          alt: "macOS";
          download_link: string;
          mac_intel_link: string;
          install_guide: string;
      }
    | {
          alt: "Android";
          download_link: string;
          play_store_link: string;
          legacy_download_link: string;
      }
    | {
          alt: "iOS";
          app_store_link: string;
      }
    | {
          alt: "Linux";
          download_link: string;
          install_guide: string;
      }
) &
    (
        | {
              show_instructions: false;
              download_instructions?: undefined;
          }
        | {
              show_instructions: true;
              download_instructions: string;
          }
    );

export function path_parts(): string[] {
    return window.location.pathname.split("/").filter((chunk) => chunk !== "");
}

const apps_events = function (): void {
    const info: Record<UserOS, VersionInfo> = {
        windows: {
            alt: "Windows",
            description:
                "The Zulip desktop app comes with native <a class='apps-page-link' href='/help/desktop-notifications'>desktop notifications</a>, support for multiple Zulip accounts, and a dedicated tray icon.",
            download_link: "/apps/download/windows",
            show_instructions: true,
            install_guide: "/help/desktop-app-install-guide",
            app_type: "desktop",
            download_instructions:
                'For help or to install offline, see our <a class="apps-page-link" href="/help/desktop-app-install-guide" target="_blank" rel="noopener noreferrer">installation guide</a>.',
        },
        mac: {
            alt: "macOS",
            description:
                "The Zulip desktop app comes with native <a class='apps-page-link' href='/help/desktop-notifications'>desktop notifications</a>, support for multiple Zulip accounts, and a dedicated tray icon.",
            download_link: "/apps/download/mac-arm64",
            mac_intel_link: "/apps/download/mac-intel",
            show_instructions: true,
            install_guide: "/help/desktop-app-install-guide",
            app_type: "desktop",
            download_instructions:
                'For help or to install via Homebrew, see our <a class="apps-page-link" href="/help/desktop-app-install-guide" target="_blank" rel="noopener noreferrer">installation guide</a>.',
        },
        android: {
            alt: "Android",
            description:
                "Zulip's native Android app makes it easy to keep up while on the go, with fully customizable <a class='apps-page-link' href='/help/mobile-notifications'>mobile notifications</a>.",
            show_instructions: false,
            play_store_link: "https://play.google.com/store/apps/details?id=com.zulipmobile",
            download_link: "https://github.com/zulip/zulip-flutter/releases/latest",
            legacy_download_link: "https://github.com/zulip/zulip-mobile/releases/latest",
            app_type: "mobile",
        },
        ios: {
            alt: "iOS",
            description:
                "Zulip's native iOS app makes it easy to keep up while on the go, with fully customizable <a class='apps-page-link' href='/help/mobile-notifications'>mobile notifications</a>.",
            show_instructions: false,
            app_store_link: "https://itunes.apple.com/us/app/zulip/id1203036395",
            app_type: "mobile",
        },
        linux: {
            alt: "Linux",
            description:
                "The Zulip desktop app comes with native <a class='apps-page-link' href='/help/desktop-notifications'>desktop notifications</a>, support for multiple Zulip accounts, and a dedicated tray icon.",
            download_link: "/apps/download/linux",
            show_instructions: true,
            install_guide: "/help/desktop-app-install-guide",
            app_type: "desktop",
            download_instructions:
                'For help or to install via a package manager, see our <a class="apps-page-link" href="/help/desktop-app-install-guide" target="_blank" rel="noopener noreferrer">installation guide</a>.',
        },
    };

    let version: UserOS;

    function get_version_from_path(): UserOS {
        let result: UserOS | undefined;
        const parts = path_parts();
        let version: UserOS;
        for (version in info) {
            if (parts.includes(version)) {
                result = version;
            }
        }

        result = result ?? detect_user_os();
        return result;
    }

    const update_page: () => void = function () {
        const $download_instructions = $(".download-instructions");
        const $third_party_apps = $("#third-party-apps");
        const $download_android_apk = $("#download-android-apk");
        const $android_apk_current = $(".android-apk-current");
        const $android_apk_legacy = $(".android-apk-legacy");
        const $download_from_google_play_store = $(".download-from-google-play-store");
        const $download_from_apple_app_store = $(".download-from-apple-app-store");
        const $download_from_microsoft_store = $("#download-from-microsoft-store");
        const $download_mac_intel = $("#download-mac-intel");
        const $desktop_download_link = $(".desktop-download-link");
        const version_info = info[version];

        $(".info .platform").text(version_info.alt);
        $(".info .description").html(version_info.description);

        if (version_info.alt === "Android") {
            $download_from_google_play_store.attr("href", version_info.play_store_link);
            $android_apk_current.attr("href", version_info.download_link);
            $android_apk_legacy.attr("href", version_info.legacy_download_link);
        } else if (version_info.alt === "iOS") {
            $download_from_apple_app_store.attr("href", version_info.app_store_link);
        } else {
            $desktop_download_link.attr("href", version_info.download_link);
            if (version_info.alt === "macOS") {
                $download_mac_intel.find("a").attr("href", version_info.mac_intel_link);
            }
            assert(version_info.download_instructions);
            $download_instructions.html(version_info.download_instructions);
        }

        $download_instructions.toggle(version_info.show_instructions);

        $third_party_apps.toggle(version_info.app_type === "desktop");
        $desktop_download_link.toggle(version_info.app_type === "desktop");
        $download_android_apk.toggle(version === "android");
        $download_from_google_play_store.toggle(version === "android");
        $download_from_apple_app_store.toggle(version === "ios");
        $download_from_microsoft_store.toggle(version === "windows");
        $download_mac_intel.toggle(version === "mac");
    };

    // init
    version = get_version_from_path();
    update_page();
};

const events = function (): void {
    if (path_parts().includes("apps")) {
        apps_events();
    }
};

$(() => {
    // Set up events / categories / search
    events();

    if (window.location.pathname === "/team/") {
        assert(page_params.page_type === "team");
        assert(page_params.contributors);
        const contributors = page_params.contributors;
        delete page_params.contributors;
        render_tabs(contributors);
    }

    if (window.location.pathname.endsWith("/plans/")) {
        const tabs = ["#cloud", "#self-hosted"];
        // Show the correct tab based on context.
        let tab_to_show = $(".portico-pricing").hasClass("showing-self-hosted")
            ? "#self-hosted"
            : "#cloud";
        const target_hash = window.location.hash;

        // Capture self-hosted-based fragments, such as
        // #self-hosted-plan-comparison, and show the
        // #self-hosted tab
        if (target_hash.startsWith("#self-hosted")) {
            tab_to_show = "#self-hosted";
        }

        // Don't scroll to tab targets
        if (tabs.includes(target_hash)) {
            window.scroll({top: 0});
        }

        const $pricing_wrapper = $(".portico-pricing");
        $pricing_wrapper.removeClass("showing-cloud showing-self-hosted");
        $pricing_wrapper.addClass(`showing-${tab_to_show.slice(1)}`);

        // Make sure that links coming from elsewhere scroll
        // to the comparison table
        if (target_hash.includes("plan-comparison")) {
            document.querySelector(target_hash)!.scrollIntoView();
        }

        const plans_columns_count = tab_to_show.slice(1) === "self-hosted" ? 4 : 3;
        // Set the correct values for span and colspan
        $(".features-col-group").attr("span", plans_columns_count);
        $(".subheader-filler").attr("colspan", plans_columns_count);
    }

    if (window.location.pathname.endsWith("/features/")) {
        // Default to Cloud and its three columns
        $(".features-col-group").attr("span", 3);
        $(".subheader-filler").attr("colspan", 3);
    }
});

// Scroll to anchor link when clicked. Note that help.js has a similar
// function; this file and help.js are never included on the same
// page.
$(document).on("click", ".markdown h1, .markdown h2, .markdown h3", function () {
    window.location.hash = $(this).attr("id")!;
});

$(document).on("click", ".nav-zulip-logo", (e) => {
    if (document.querySelector(".portico-hello-page")) {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: "smooth"});
    }
});

$(document).on("click", ".pricing-tab", function () {
    const id = $(this).attr("id")!;
    const $pricing_wrapper = $(".portico-pricing");
    $pricing_wrapper.removeClass("showing-cloud showing-self-hosted");
    $pricing_wrapper.addClass(`showing-${id}`);

    const $comparison_table = $(".zulip-plans-comparison");
    const comparison_table_id = $comparison_table.attr(id);

    // Not all pages that show plans include the comparison
    // table, but when it's present, make sure to set the
    // comparison table features to match the current active tab
    // However, once a user has begun to interact with the
    // comparison table, giving the `id` attribute a value, we
    // no longer apply this logic
    if ($comparison_table.length > 0 && !comparison_table_id) {
        const plans_columns_count = id === "self-hosted" ? 4 : 3;

        // Set the correct values for span and colspan
        $(".features-col-group").attr("span", plans_columns_count);
        $(".subheader-filler").attr("colspan", plans_columns_count);
    }

    window.history.pushState(null, "", `#${id}`);
});

$(document).on("click", ".comparison-tab", function (this: HTMLElement, _event: JQuery.Event) {
    const plans_columns_counts = {
        "tab-cloud": 3,
        "tab-hosted": 4,
        "tab-all": 7,
    };

    const tab_label = z
        .enum(["tab-cloud", "tab-hosted", "tab-all"])
        .parse(this.getAttribute("data-label"));
    const plans_columns_count = plans_columns_counts[tab_label];
    const visible_plans_id = `showing-${tab_label}`;

    $(".zulip-plans-comparison").attr("id", visible_plans_id);

    // Set the correct values for span and colspan
    $(".features-col-group").attr("span", plans_columns_count);
    $(".subheader-filler").attr("colspan", plans_columns_count);

    // To accommodate the icons in the All view, we need to attach
    // additional logic to handle the increased subheader-row size.
    if (visible_plans_id === "showing-tab-all") {
        // We need to be aware of user scroll direction
        let previous_y_position = 0;
        // We need to be aware of the y value of the
        // entry record for the IntersectionObserver callback
        // on subheaders of interest (those about to be sticky)
        let previous_entry_y = 0;

        const isScrollingUp = (): boolean => {
            let is_scrolling_up = true;
            if (window.scrollY > previous_y_position) {
                is_scrolling_up = false;
            }

            previous_y_position = window.scrollY;

            return is_scrolling_up;
        };

        const observer = new IntersectionObserver(
            ([entries]) => {
                assert(entries !== undefined);
                // We want to stop an infinite jiggle when a change in subheader
                // padding erroneously triggers the observer at just the right spot.
                // There may be a momentary jiggle, but it will resolve almost
                // immediately. Rounding to the nearest full pixel is precise enough;
                // full values would cause the jiggle to continue.
                const rounded_entry_y = Math.ceil(entries.boundingClientRect.y);
                if (rounded_entry_y === previous_entry_y) {
                    // Jiggles might end with the class being removed, which
                    // is the poorer behavior, so always make sure the "stuck"
                    // class is present on a jiggling element.
                    entries.target.classList.add("stuck");
                    return;
                }

                // `intersectionRatio` values are 0 when the element first comes into
                // view at the bottom of the page, and then again at the top--which is
                // what we care about. That why we only want to force the class toggle
                // when dealing with subheader elements closer to the top of the page.

                // But: once the "stuck" class has been applied, it can be removed
                // too eagerly should a user scroll back down. So we want to determine
                // whether a user is scrolling up, in which case we want to act below
                // a certain y value. When they scroll down, we want them to scroll
                // down a bit further, and check for a greater-than y value before
                // removing it.
                let force_class_toggle;
                if (isScrollingUp()) {
                    force_class_toggle =
                        entries.intersectionRatio < 1 && entries.boundingClientRect.y > 125;
                } else {
                    force_class_toggle =
                        entries.intersectionRatio < 1 && entries.boundingClientRect.y < 185;
                }

                // Rather than blindly toggle, we force `classList.toggle` to add
                // (which may mean keeping the class on) or remove (keeping it off)
                // depending on scroll direction, etc.
                entries.target.classList.toggle("stuck", force_class_toggle);

                // Track the entry's previous rounded y.
                previous_entry_y = rounded_entry_y;
            },
            // To better catch subtle changes on IntersectionObserver, we use
            // an array of threshold values to detect exits (0) as well as
            // full intersections (1).
            // The -110px rootMargin value is arrived at from 60px worth of
            // navigation menu, and the header-row height minus extra top
            // padding.
            {threshold: [0, 1], rootMargin: "-110px 0px 0px 0px"},
        );

        for (const subheader of document.querySelectorAll("#showing-tab-all td.subheader")) {
            observer.observe(subheader);
        }
    }
});
```

--------------------------------------------------------------------------------

---[FILE: portico_modals.ts]---
Location: zulip-main/web/src/portico/portico_modals.ts

```typescript
import $ from "jquery";
import Micromodal from "micromodal";
import assert from "minimalistic-assert";

import * as blueslip from "../blueslip.ts";

function is_open(): boolean {
    return $(".micromodal").hasClass("modal--open");
}

function active_modal(): string | undefined {
    if (!is_open()) {
        blueslip.error("Programming error — Called active_modal when there is no modal open");
        return undefined;
    }

    const $micromodal = $(".micromodal.modal--open");
    return `#${CSS.escape($micromodal.attr("id")!)}`;
}

export function close_active(): void {
    if (!is_open()) {
        blueslip.warn("close_active() called without checking is_open()");
        return;
    }

    const $micromodal = $(".micromodal.modal--open");
    Micromodal.close(CSS.escape($micromodal.attr("id") ?? ""));
}

export function open(modal_id: string, recursive_call_count = 0): void {
    if (modal_id === undefined) {
        blueslip.error("Undefined id was passed into open");
        return;
    }

    // Don't accept hash-based selector to enforce modals to have unique ids and
    // since micromodal doesn't accept hash based selectors.
    if (modal_id.startsWith("#")) {
        blueslip.error("hash-based selector passed in to open", {modal_id});
        return;
    }

    if (is_open()) {
        /*
          Our modal system doesn't directly support opening a modal
          when one is already open, because the `is_open` CSS
          class doesn't update until Micromodal has finished its
          animations, which can take 100ms or more.

          We can likely fix that, but in the meantime, we should
          handle this situation correctly, by closing the current
          modal, waiting for it to finish closing, and then attempting
          to open the current modal again.
        */
        if (recursive_call_count) {
            recursive_call_count = 1;
        } else {
            recursive_call_count += 1;
        }
        if (recursive_call_count > 50) {
            blueslip.error("Modal incorrectly is still open", {modal_id});
            return;
        }

        close_active();
        setTimeout(() => {
            open(modal_id, recursive_call_count);
        }, 10);
        return;
    }

    blueslip.debug("open modal: " + modal_id);

    // Micromodal gets elements using the getElementById DOM function
    // which doesn't require the hash. We add it manually here.
    const id_selector = `#${CSS.escape(modal_id)}`;
    const $micromodal = $(id_selector);

    $micromodal.find(".modal__container").on("animationend", (event) => {
        assert(event.originalEvent instanceof AnimationEvent);
        const animation_name = event.originalEvent.animationName;
        if (animation_name === "mmfadeIn") {
            // Micromodal adds the is-open class before the modal animation
            // is complete, which isn't really helpful since a modal is open after the
            // animation is complete. So, we manually add a class after the
            // animation is complete.
            $micromodal.addClass("modal--open");
            $micromodal.removeClass("modal--opening");
        } else if (animation_name === "mmfadeOut") {
            $micromodal.removeClass("modal--open");
        }
    });

    $micromodal.find(".modal__overlay").on("click", (e) => {
        /* Micromodal's data-micromodal-close feature doesn't check for
           range selections; this means dragging a selection of text in an
           input inside the modal too far will weirdly close the modal.
           See https://github.com/ghosh/Micromodal/issues/505.
           Work around this with our own implementation. */
        if (!$(e.target).is(".modal__overlay")) {
            return;
        }

        if (document.getSelection()?.type === "Range") {
            return;
        }
        close(modal_id);
    });

    Micromodal.show(modal_id, {
        disableFocus: true,
        openClass: "modal--opening",
    });
}

export function close(modal_id: string): void {
    if (modal_id === undefined) {
        blueslip.error("Undefined id was passed into close");
        return;
    }

    if (!is_open()) {
        blueslip.warn("close_active() called without checking is_open()");
        return;
    }

    if (active_modal() !== `#${CSS.escape(modal_id)}`) {
        blueslip.error("Trying to close modal when other is open", {modal_id, active_modal});
        return;
    }

    blueslip.debug("close modal: " + modal_id);

    Micromodal.close(modal_id);
}
```

--------------------------------------------------------------------------------

---[FILE: redirect-to-post.ts]---
Location: zulip-main/web/src/portico/redirect-to-post.ts

```typescript
import $ from "jquery";

$(() => {
    $(".redirect-to-post-form").trigger("submit");
});
```

--------------------------------------------------------------------------------

````

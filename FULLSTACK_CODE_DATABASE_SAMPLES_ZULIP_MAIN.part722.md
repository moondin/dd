---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 722
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 722 of 1290)

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

---[FILE: signup.ts]---
Location: zulip-main/web/src/portico/signup.ts
Signals: Zod

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import * as common from "../common.ts";
import {$t} from "../i18n.ts";
import {password_quality, password_warning} from "../password_quality.ts";
import * as settings_config from "../settings_config.ts";

import * as portico_modals from "./portico_modals.ts";

/* global AltchaWidgetMethods, AltchaStateChangeEvent */
import "altcha";

$(() => {
    // NB: this file is included on multiple pages.  In each context,
    // some of the jQuery selectors below will return empty lists.

    const $password_field = $<HTMLInputElement>("input#id_password, input#id_new_password1");
    if ($password_field.length > 0) {
        $.validator.addMethod(
            "password_strength",
            (value: string) => password_quality(value, undefined, $password_field),
            () => password_warning($password_field.val()!, $password_field),
        );
        // Reset the state of the password strength bar if the page
        // was just reloaded due to a validation failure on the backend.
        password_quality($password_field.val()!, $("#pw_strength .bar"), $password_field);

        const debounced_password_quality = _.debounce((password_value: string, $field: JQuery) => {
            password_quality(password_value, $("#pw_strength .bar"), $field);
        }, 300);

        $password_field.on("input", function () {
            const password_value = $(this).val()!;

            if (password_value.length > 30) {
                debounced_password_quality(password_value, $(this));
            } else {
                debounced_password_quality.cancel();
                password_quality(password_value, $("#pw_strength .bar"), $(this));
            }
        });
    }

    common.setup_password_visibility_toggle(
        "#ldap-password",
        "#ldap-password ~ .password_visibility_toggle",
    );
    common.setup_password_visibility_toggle(
        "#id_password",
        "#id_password ~ .password_visibility_toggle",
    );
    common.setup_password_visibility_toggle(
        "#id_new_password1",
        "#id_new_password1 ~ .password_visibility_toggle",
    );
    common.setup_password_visibility_toggle(
        "#id_new_password2",
        "#id_new_password2 ~ .password_visibility_toggle",
    );

    $("#registration, #password_reset, #create_realm, #create_demo_realm").validate({
        rules: {
            password: {
                password_strength: {
                    depends(element: HTMLElement): boolean {
                        // In the registration flow where the user is required to
                        // enter their LDAP password, we don't check password strength,
                        // and the validator method is not even set up.
                        return element.id !== "ldap-password";
                    },
                },
            },
            new_password1: "password_strength",
        },
        errorElement: "p",
        errorPlacement($error: JQuery, $element: JQuery) {
            // NB: this is called at most once, when the error element
            // is created.
            $element.next(".help-inline.alert.alert-error").remove();
            if ($element.next().is(`label[for="${$element.attr("id")!}"]`)) {
                $error.insertAfter($element.next()).addClass("help-inline alert alert-error");
            } else if ($element.parent().is(`label[for="${$element.attr("id")!}"]`)) {
                // For checkboxes and radio-buttons
                $error.insertAfter($element.parent()).addClass("help-inline alert alert-error");
            } else {
                $error.insertAfter($element).addClass("help-inline alert alert-error");
            }
        },
    });

    if ($("#registration").length > 0) {
        // Check if there is no input field with errors.
        if ($(".help-inline:not(:empty)").length === 0) {
            // Find the first input field present in the form that is
            // not hidden and disabled and store it in a variable.
            const $firstInputElement = $("input:not([type=hidden], :disabled)").first();
            // Focus on the first input field in the form.
            $firstInputElement.trigger("focus");
            // Override the automatic scroll to the focused
            // element. On the (tall) new organization form, at least,
            // this avoids scrolling to the middle of the page (past
            // the organization details section).
            $("html").scrollTop(0);
        } else {
            // If input field with errors is present.
            // Find the input field having errors and stores it in a variable.
            const $inputElementWithError = $(".help-inline:not(:empty)")
                .first()
                .parent()
                .find("input");
            // Focus on the input field having errors.
            $inputElementWithError.trigger("focus");
        }

        // reset error message displays
        $("#id_team_subdomain_error_client").css("display", "none");
        if ($(".team_subdomain_error_server").text() === "") {
            $(".team_subdomain_error_server").css("display", "none");
        }

        $("#timezone").val(new Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    if ($("#demo-realm-creation").length > 0) {
        $("#demo-creator-timezone").val(new Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    $("#registration").on("submit", () => {
        if ($("#registration").valid()) {
            $(".register-button .loader").css("display", "inline-block");
            $(".register-button").prop("disabled", true);
            $(".register-button span").hide();
        }
    });

    // Code in this block will be executed when the /accounts/send_confirm/
    // endpoint is visited i.e. accounts_send_confirm.html is rendered.
    if ($("[data-page-id='accounts-send-confirm']").length > 0) {
        $("#resend_email_link").on("click", () => {
            $(".resend_confirm").trigger("submit");
        });
    }

    // Code in this block will be executed when the user visits /register
    // i.e. accounts_home.html is rendered.
    if ($("[data-page-id='accounts-home']").length > 0 && window.location.hash.startsWith("#")) {
        document.querySelector<HTMLFormElement>("#send_form")!.action += window.location.hash;
    }

    // Code in this block will be executed when the user is at login page
    // i.e. login.html is rendered.
    if ($("[data-page-id='login-page']").length > 0 && window.location.hash.startsWith("#")) {
        // All next inputs have the same value when the page is
        // rendered, so it's OK that this selector gets N elements.
        const next_value = $("input[name='next']").attr("value");

        // We need to add `window.location.hash` to the `next`
        // property, since the server doesn't receive URL fragments
        // (and thus could not have included them when rendering a
        // redirect to this page).
        $("input[name='next']").attr("value", `${next_value!}${window.location.hash}`);
    }

    $("#send_confirm").validate({
        errorElement: "div",
        errorPlacement($error: JQuery) {
            $(".email-frontend-error").empty();
            $("#send_confirm .alert.email-backend-error").remove();
            $error.appendTo($(".email-frontend-error")).addClass("text-error");
        },
        success() {
            $("#errors").empty();
        },
    });

    $<HTMLInputElement>(".register-page input#email, .login-page-container input#id_username").on(
        "focusout keydown",
        function (e) {
            // check if it is the "focusout" or if it is a keydown, then check
            // if the key was "Enter"
            if (e.type === "focusout" || e.key === "Enter") {
                $(this).val($(this).val()!.trim());
            }
        },
    );

    const show_subdomain_section = function (bool: boolean): void {
        const action = bool ? "hide" : "show";
        $("#subdomain_section")[action]();
    };

    $("#realm_in_root_domain").on("change", function () {
        show_subdomain_section($(this).is(":checked"));
    });

    $("#login_form").validate({
        errorClass: "text-error",
        wrapper: "div",
        submitHandler(form) {
            $("#login_form").find(".loader").css("display", "inline-block");
            $("#login_form").find("button .text").hide();

            form.submit();
        },
        invalidHandler() {
            // this removes all previous errors that were put on screen
            // by the server.
            $("#login_form .alert.alert-error").remove();
        },
        showErrors(error_map) {
            if (error_map["password"]) {
                $("#login_form .alert.alert-error").remove();
            }
            this.defaultShowErrors!();
        },
    });

    function check_subdomain_available(subdomain: string): void {
        const url = "/json/realm/subdomain/" + subdomain;
        void $.get(url, (response) => {
            const {msg} = z.object({msg: z.string()}).parse(response);
            if (msg !== "available") {
                $("#id_team_subdomain_error_client").html(msg);
                $("#id_team_subdomain_error_client").show();
            }
        });
    }

    function update_full_name_section(): void {
        if ($("#source_realm_select").length > 0 && $("#source_realm_select").val() !== "") {
            $("#full_name_input_section").hide();
            $("#profile_info_section").show();
            const avatar_url = $($("#source_realm_select").prop("selectedOptions")).attr(
                "data-avatar",
            );
            const full_name = $($("#source_realm_select").prop("selectedOptions")).attr(
                "data-full-name",
            );
            $("#profile_full_name").text(full_name!);
            $("#id_full_name").val(full_name!);
            $("#profile_avatar").attr("src", avatar_url!);
        } else {
            $("#full_name_input_section").show();
            $("#profile_info_section").hide();
        }
    }

    $("#source_realm_select").on("change", update_full_name_section);
    update_full_name_section();

    let timer: number;
    $("#id_team_subdomain").on("input", () => {
        $(".team_subdomain_error_server").text("").css("display", "none");
        $("#id_team_subdomain_error_client").css("display", "none");
        clearTimeout(timer);
        timer = setTimeout(check_subdomain_available, 250, $("#id_team_subdomain").val());
    });

    // GitHub auth
    $("body").on("click", "#choose_email .choose-email-box", function (this: HTMLElement) {
        assert(this.parentElement instanceof HTMLFormElement);
        this.parentElement.submit();
    });

    $("#new-user-email-address-visibility .change_email_address_visibility").on("click", () => {
        portico_modals.open("change-email-address-visibility-modal");
    });

    $("#change-email-address-visibility-modal .dialog_submit_button").on("click", () => {
        const selected_val = Number.parseInt(
            $<HTMLSelectElement & {type: "select-one"}>(
                "select:not([multiple])#new_user_email_address_visibility",
            ).val()!,
            10,
        );
        $("#email_address_visibility").val(selected_val);
        portico_modals.close("change-email-address-visibility-modal");

        let selected_option_text;

        // These strings should be consistent with those defined for the same element in
        // 'templates/zerver/create_user/new_user_email_address_visibility.html'.
        switch (selected_val) {
            case settings_config.email_address_visibility_values.admins_only.code: {
                selected_option_text = $t({
                    defaultMessage:
                        "Administrators of this Zulip organization will be able to see this email address.",
                });

                break;
            }
            case settings_config.email_address_visibility_values.moderators.code: {
                selected_option_text = $t({
                    defaultMessage:
                        "Administrators and moderators this Zulip organization will be able to see this email address.",
                });

                break;
            }
            case settings_config.email_address_visibility_values.nobody.code: {
                selected_option_text = $t({
                    defaultMessage:
                        "Nobody in this Zulip organization will be able to see this email address.",
                });

                break;
            }
            default: {
                selected_option_text = $t({
                    defaultMessage:
                        "Other users in this Zulip organization will be able to see this email address.",
                });
            }
        }
        $("#new-user-email-address-visibility .current-selected-option").text(selected_option_text);
    });

    $("#registration").on("click keydown", ".edit-realm-details", (e) => {
        if (e.type === "keydown" && e.key !== "Enter") {
            return;
        }

        $("#registration .not-editable-realm-details").addClass("hide");
        $("#registration .realm-creation-editable-inputs").removeClass("hide");
        $("#id_team_name").trigger("focus");
        // This is a hack to have cursor at end after focussing the input.
        const name_val = $("#id_team_name").val()!;
        $("#id_team_name").val("").val(name_val);

        $(e.target).hide();
    });

    $("form.select-email-form").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            $(this).trigger("submit");
        }
    });

    $<HTMLSelectElement>("#how-realm-creator-found-zulip select").on("change", function () {
        const elements = new Map([
            ["other", "how-realm-creator-found-zulip-other"],
            ["ad", "how-realm-creator-found-zulip-where-ad"],
            ["existing_user", "how-realm-creator-found-zulip-which-organization"],
            ["review_site", "how-realm-creator-found-zulip-review-site"],
            ["ai_chatbot", "how-realm-creator-found-zulip-which-ai-chatbot"],
        ]);

        const hideElement = (element: string): void => {
            const $element = $(`#${CSS.escape(element)}`);
            $element.hide();
            $element.removeAttr("required");
            $(`#${CSS.escape(element)}-error`).hide();
        };

        const showElement = (element: string): void => {
            const $element = $(`#${CSS.escape(element)}`);
            $element.show();
            $element.attr("required", "required");
        };

        // Reset state
        for (const element of elements.values()) {
            if (element) {
                hideElement(element);
            }
        }

        // Show the additional input box if needed.
        const selected_element = elements.get(this.value);
        if (selected_element !== undefined) {
            showElement(selected_element);
        }
    });

    // Configure altcha
    const altcha = document.querySelector<AltchaWidgetMethods & HTMLElement>("altcha-widget");
    if (altcha) {
        altcha.configure({
            auto: "onload",
            async customfetch(url: string, init?: RequestInit) {
                return fetch(url, {...init, credentials: "include"});
            },
        });
        const $submit = $(altcha).closest("form").find("button[type=submit]");
        $submit.prop("disabled", true);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        altcha.addEventListener("statechange", ((ev: AltchaStateChangeEvent) => {
            if (ev.detail.state === "verified") {
                $submit.prop("disabled", false);
                // Hide checkbox on successful verification.
                altcha.querySelector(".altcha")!.classList.add("altcha-checkbox-hidden");
                altcha.style.opacity = "1";
                // Animate hiding the altcha after a delay.
                setTimeout(() => {
                    altcha.style.transition = "opacity 1s ease-in-out";
                    altcha.style.opacity = "0";
                    altcha.style.pointerEvents = "none";
                }, 1000);
            }
        }) as EventListener);
    }

    if ($("a#deactivated-org-auto-redirect").length > 0) {
        // Update the href of the deactivated organization auto-redirect link
        // to include the current URL hash, if it exists.
        const $deactivated_org_auto_redirect = $("a#deactivated-org-auto-redirect");
        let new_org_url = $deactivated_org_auto_redirect.attr("href")!;
        const url_hash = window.location.hash;
        if (url_hash.startsWith("#")) {
            // Ensure we don't double-add hashes and handle query parameters properly
            const url = new URL(new_org_url);
            url.hash = url_hash;
            new_org_url = url.toString();
        }
        $deactivated_org_auto_redirect.attr("href", new_org_url);

        // This is a special case for the deactivated organization page,
        // where we want to redirect to the login page after 5 seconds.
        const interval_id = setInterval(() => {
            const $countdown_elt = $("#deactivated-org-auto-redirect-countdown");
            const current_countdown = Number($countdown_elt.text());
            if (current_countdown > 0) {
                $countdown_elt.text((current_countdown - 1).toString());
            } else {
                const new_org_url = $deactivated_org_auto_redirect.attr("href")!;
                window.location.href = new_org_url;
                clearInterval(interval_id);
            }
        }, 1000);
    }
});
```

--------------------------------------------------------------------------------

---[FILE: slack-import.ts]---
Location: zulip-main/web/src/portico/slack-import.ts
Signals: Zod

```typescript
import {Uppy} from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import Tus from "@uppy/tus";
import $ from "jquery";
import assert from "minimalistic-assert";
import * as z from "zod/mini";

import {$t} from "../i18n.ts";

$(() => {
    if ($("#slack-import-dashboard").length > 0) {
        const max_file_upload_size_mib = Number(
            $("#slack-import-dashboard").attr("data-max-file-size"),
        );
        const key = $<HTMLInputElement>("#auth_key_for_file_upload").val();
        const uppy = new Uppy({
            autoProceed: true,
            restrictions: {
                maxNumberOfFiles: 1,
                minNumberOfFiles: 1,
                allowedFileTypes: [".zip", "application/zip"],
                maxFileSize: max_file_upload_size_mib * 1024 * 1024,
            },
            meta: {
                key,
            },
            locale: {
                strings: {
                    youCanOnlyUploadFileTypes: $t({
                        defaultMessage: "Upload your Slack export zip file.",
                    }),
                    exceedsSize: $t({
                        defaultMessage:
                            "Uploaded file exceeds maximum size for self-serve imports.",
                    }),
                },
                // Copied from
                // https://github.com/transloadit/uppy/blob/d1a3345263b3421a06389aa2e84c66e894b3f29d/packages/%40uppy/utils/src/Translator.ts#L122
                // since we don't want to override the default function.
                // Defining pluralize is required by typescript.
                pluralize(n: number): 0 | 1 {
                    if (n === 1) {
                        return 0;
                    }
                    return 1;
                },
            },
        });
        uppy.use(Dashboard, {
            target: "#slack-import-dashboard",
            // This will be replace by an HTML note after being mounted.
            note: "...",
        });
        uppy.use(Tus, {
            endpoint: "/api/v1/tus/",
            // Allow user to upload the same file multiple times.
            removeFingerprintOnSuccess: true,
        });
        uppy.on("restriction-failed", (_file, error) => {
            $("#slack-import-file-upload-error").text(error.message);
        });
        uppy.on("upload-error", (_file, error) => {
            $("#slack-import-file-upload-error").text(error.message);
        });
        uppy.on("upload-success", (file, _response) => {
            assert(file !== undefined);
            $("#slack-import-start-upload-wrapper").removeClass("hidden");
            $("#slack-import-dashboard-wrapper").addClass("hidden");

            $("#slack-import-uploaded-file-name").text(file.name);
            $("#slack-import-file-upload-error").text("");
            $("#realm-creation-form-slack-import .register-button").prop("disabled", false);
        });
        uppy.on("dashboard:modal-open", () => {
            // Replace the note with the actual content after the dashboard is mounted.
            $(".uppy-Dashboard-note").text(
                $t({
                    defaultMessage: "Upload your Slack export zip file.",
                }),
            );
        });

        $(".slack-import-upload-file").on("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const dashboard = uppy.getPlugin("Dashboard")!;
            assert(dashboard instanceof Dashboard);
            void dashboard.openModal();
        });
    }

    if ($("#slack-import-poll-status").length > 0) {
        const key = $<HTMLInputElement>("#auth_key_for_polling").val();
        const pollInterval = 2000; // Poll every 2 seconds

        let poll_id: ReturnType<typeof setTimeout> | undefined;
        function checkImportStatus(): void {
            $.get(`/json/realm/import/status/${key}`, {}, (response) => {
                const {status, redirect} = z
                    .object({status: z.string(), redirect: z.optional(z.string())})
                    .parse(response);
                $("#slack-import-poll-status").text(status);
                if (poll_id && redirect !== undefined) {
                    clearInterval(poll_id);
                    window.location.assign(redirect);
                }
            });
        }

        // Start polling
        poll_id = setInterval(checkImportStatus, pollInterval);
    }

    $("#cancel-slack-import").on("click", () => {
        $("#cancel-slack-import-form").trigger("submit");
    });

    $("#slack-access-token").on("input", () => {
        $("#update-slack-access-token").show();
    });
});
```

--------------------------------------------------------------------------------

---[FILE: tabbed-instructions.ts]---
Location: zulip-main/web/src/portico/tabbed-instructions.ts

```typescript
import * as common from "../common.ts";

export type UserOS = "android" | "ios" | "mac" | "windows" | "linux";

export function detect_user_os(): UserOS {
    if (/android/i.test(navigator.userAgent)) {
        return "android";
    }
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        return "ios";
    }
    if (common.has_mac_keyboard()) {
        return "mac";
    }
    if (/win/i.test(navigator.userAgent)) {
        return "windows";
    }
    if (/linux/i.test(navigator.userAgent)) {
        return "linux";
    }
    return "mac"; // if unable to determine OS return Mac by default
}
```

--------------------------------------------------------------------------------

---[FILE: team.ts]---
Location: zulip-main/web/src/portico/team.ts

```typescript
import $ from "jquery";
import _ from "lodash";
import assert from "minimalistic-assert";

// The list of repository names is duplicated here in order to provide
// a clear type for Contributor objects.
//
// TODO: We can avoid this if we introduce a `contributions` object
// referenced from Contributor, rather than having repository names be
// direct keys in the namespace that also has `email`.
const all_repository_names = [
    "docker-zulip",
    "errbot-backend-zulip",
    "github-actions-zulip",
    "hubot-zulip",
    "puppet-zulip",
    "python-zulip-api",
    "trello-to-zulip",
    "swift-zulip-api",
    "zulint",
    "zulip",
    "zulip-android-legacy",
    "zulip-architecture",
    "zulip-archive",
    "zulip-csharp",
    "zulip-desktop",
    "zulip-desktop-legacy",
    "zulip-flutter",
    "zulip-ios-legacy",
    "zulip-js",
    "zulip-mobile",
    "zulip-redmine-plugin",
    "zulip-terminal",
    "zulip-zapier",
    "zulipbot",
] as const;

const all_tab_names = [
    "server",
    "desktop",
    "mobile",
    "terminal",
    "api-clients",
    "devtools",
] as const;

type RepositoryName = (typeof all_repository_names)[number];
type TabName = (typeof all_tab_names)[number];

const tab_name_to_repo_list: Record<TabName, RepositoryName[]> = {
    server: ["zulip", "docker-zulip"],
    desktop: ["zulip-desktop", "zulip-desktop-legacy"],
    mobile: ["zulip-mobile", "zulip-flutter", "zulip-ios-legacy", "zulip-android-legacy"],
    terminal: ["zulip-terminal"],
    "api-clients": [
        "python-zulip-api",
        "zulip-js",
        "zulip-archive",
        "errbot-backend-zulip",
        "github-actions-zulip",
        "hubot-zulip",
        "puppet-zulip",
        "trello-to-zulip",
        "swift-zulip-api",
        "zulip-csharp",
        "zulip-redmine-plugin",
        "zulip-zapier",
    ],
    devtools: ["zulipbot", "zulint", "zulip-architecture"],
};

export type Contributor = {
    avatar: string;
    email?: string | undefined;
    github_username?: string | undefined;
    name?: string | undefined;
} & Partial<Record<RepositoryName, number>>;
type ContributorData = {
    avatar: string;
    email?: string | undefined;
    github_username?: string | undefined;
    name?: string | undefined;
    total_commits: number;
};

// Remember the loaded repositories so that HTML is not redundantly edited
// if a user leaves and then revisits the same tab.
const loaded_tabs: string[] = [];

function calculate_total_commits(contributor: Contributor): number {
    let commits = 0;
    for (const repo_name of all_repository_names) {
        commits += contributor[repo_name] ?? 0;
    }
    return commits;
}

function get_profile_url(contributor: Contributor, tab_name?: string): string | undefined {
    if (contributor.github_username) {
        return `https://github.com/${contributor.github_username}`;
    }

    const email = contributor.email;
    if (!email) {
        return undefined;
    }

    if (tab_name) {
        return `https://github.com/zulip/${tab_name}/commits?author=${email}`;
    }

    for (const repo_name of all_repository_names) {
        if (repo_name in contributor) {
            return `https://github.com/zulip/${repo_name}/commits?author=${email}`;
        }
    }

    return undefined;
}

function get_display_name(contributor: Contributor): string {
    if (contributor.github_username) {
        return "@" + contributor.github_username;
    }
    assert(contributor.name !== undefined);
    return contributor.name;
}

function exclude_bot_contributors(contributor: Contributor): boolean {
    return contributor.github_username !== "dependabot[bot]";
}

// TODO (for v2 of /team/ contributors):
//   - Make tab header responsive.
//   - Display full name instead of GitHub username.
export default function render_tabs(contributors: Contributor[]): void {
    const template = _.template($("#contributors-template").html());
    const count_template = _.template($("#count-template").html());
    const total_count_template = _.template($("#total-count-template").html());
    const contributors_list = contributors
        ? contributors.filter((c) => exclude_bot_contributors(c))
        : [];
    const mapped_contributors_list = contributors_list.map((c) => ({
        name: get_display_name(c),
        github_username: c.github_username,
        avatar: c.avatar,
        profile_url: get_profile_url(c),
        commits: calculate_total_commits(c),
    }));
    mapped_contributors_list.sort((a, b) =>
        a.commits < b.commits ? 1 : a.commits > b.commits ? -1 : 0,
    );
    const total_tab_html = mapped_contributors_list.map((c) => template(c)).join("");

    const twenty_plus_total_contributors = mapped_contributors_list.filter((c) => c.commits >= 20);
    const hundred_plus_total_contributors = mapped_contributors_list.filter(
        (c) => c.commits >= 100,
    );

    $("#tab-total .contributors-grid").html(total_tab_html);
    $("#tab-total").prepend(
        $(
            total_count_template({
                contributor_count: contributors_list.length,
                tab_name: "total",
                twenty_plus_contributor_count: twenty_plus_total_contributors.length,
                hundred_plus_contributor_count: hundred_plus_total_contributors.length,
            }),
        ),
    );

    for (const tab_name of all_tab_names) {
        const repo_list = tab_name_to_repo_list[tab_name];
        if (!repo_list) {
            continue;
        }
        // Set as the loading template for now, and load when clicked.
        $(`#tab-${CSS.escape(tab_name)} .contributors-grid`).html($("#loading-template").html());

        $(`#${CSS.escape(tab_name)}`).on("click", () => {
            if (!loaded_tabs.includes(tab_name)) {
                const filtered_by_tab: ContributorData[] = contributors_list
                    .filter((c: Contributor) =>
                        repo_list.some((repo_name: RepositoryName) => c[repo_name] !== undefined),
                    )
                    .map((c: Contributor) => ({
                        ..._.pick(c, "avatar", "email", "name", "github_username"),
                        total_commits: repo_list.reduce(
                            (commits: number, repo_name: RepositoryName) =>
                                commits + (c[repo_name] ?? 0),
                            0,
                        ),
                    }));
                filtered_by_tab.sort((a, b) => {
                    const a_commits = a.total_commits;
                    const b_commits = b.total_commits;
                    return a_commits < b_commits ? 1 : a_commits > b_commits ? -1 : 0;
                });

                const html = filtered_by_tab
                    .map((c) =>
                        template({
                            name: get_display_name(c),
                            github_username: c.github_username,
                            avatar: c.avatar,
                            profile_url: get_profile_url(c, tab_name),
                            commits: c.total_commits,
                        }),
                    )
                    .join("");

                $(`#tab-${CSS.escape(tab_name)} .contributors-grid`).html(html);
                const contributor_count = filtered_by_tab.length;
                const hundred_plus_contributor_count = filtered_by_tab.filter((c) => {
                    const commits = c.total_commits;
                    return commits >= 100;
                }).length;
                const twenty_plus_contributor_count = filtered_by_tab.filter((c) => {
                    const commits = c.total_commits;
                    return commits >= 20;
                }).length;
                const repo_url_list = repo_list.map(
                    (repo_name) => `https://github.com/zulip/${repo_name}`,
                );
                $(`#tab-${CSS.escape(tab_name)}`).prepend(
                    $(
                        count_template({
                            contributor_count,
                            repo_list,
                            repo_url_list,
                            twenty_plus_contributor_count,
                            hundred_plus_contributor_count,
                        }),
                    ),
                );

                loaded_tabs.push(tab_name);
            }
        });
    }
}
```

--------------------------------------------------------------------------------

---[FILE: tippyjs.ts]---
Location: zulip-main/web/src/portico/tippyjs.ts

```typescript
import $ from "jquery";
import * as tippy from "tippy.js";

const LONG_HOVER_DELAY: [number, number] = [750, 20];

function initialize(): void {
    tippy.default("[data-tippy-content]", {
        // Same defaults as set in web app tippyjs module.
        maxWidth: 300,
        delay: [100, 20],
        touch: ["hold", 750],
        // Different default from web app tippyjs module.
        animation: true,
        placement: "bottom",
    });

    tippy.default(".organization-name-delayed-tooltip", {
        maxWidth: 300,
        delay: LONG_HOVER_DELAY,
        touch: ["hold", 750],
        animation: true,
        placement: "bottom",
        onShow(instance) {
            const content = $(instance.reference).text();
            instance.setContent(content);
        },
    });
}

$(() => {
    initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: page_params.ts]---
Location: zulip-main/web/src/stats/page_params.ts

```typescript
import assert from "minimalistic-assert";

import {page_params as base_page_params} from "../base_page_params.ts";

assert(base_page_params.page_type === "stats");

// We need to export with a narrowed TypeScript type
// eslint-disable-next-line unicorn/prefer-export-from
export const page_params = base_page_params;
```

--------------------------------------------------------------------------------

````

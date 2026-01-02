---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 571
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 571 of 1290)

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

---[FILE: user-deactivation.test.ts]---
Location: zulip-main/web/e2e-tests/user-deactivation.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function navigate_to_user_list(page: Page): Promise<void> {
    const menu_selector = "#settings-dropdown";
    await page.waitForSelector(menu_selector, {visible: true});
    await page.click(menu_selector);

    const organization_settings = '.link-item a[href="#organization"]';
    await page.waitForSelector(organization_settings, {visible: true});
    await page.click(organization_settings);

    await page.waitForSelector("#settings_overlay_container.show", {visible: true});
    await page.click("li[data-section='users']");
    await page.waitForSelector("#admin-user-list.show", {visible: true});
}

async function user_row(page: Page, name: string): Promise<string> {
    const user_id = await common.get_user_id_from_name(page, name);
    assert.ok(user_id !== undefined);
    return `.user_row[data-user-id="${CSS.escape(user_id.toString())}"]`;
}

async function test_reactivation_confirmation_modal(page: Page, fullname: string): Promise<void> {
    await common.wait_for_micromodal_to_open(page);

    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Reactivate " + fullname,
        "Unexpected title for reactivate user modal",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Confirm",
        "Reactivate button has incorrect text.",
    );
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);
}

async function test_deactivate_user(page: Page): Promise<void> {
    const cordelia_user_row = await user_row(page, common.fullname.cordelia);
    await page.waitForSelector(cordelia_user_row, {visible: true});
    await page.waitForSelector(cordelia_user_row + " .zulip-icon-user-x");
    await page.click(cordelia_user_row + " .deactivate");
    await common.wait_for_micromodal_to_open(page);

    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Deactivate " + common.fullname.cordelia + "?",
        "Unexpected title for deactivate user modal",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Deactivate",
        "Deactivate button has incorrect text.",
    );
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);
}

async function test_reactivate_user(page: Page): Promise<void> {
    let cordelia_user_row = await user_row(page, common.fullname.cordelia);
    await page.waitForSelector(cordelia_user_row + ".deactivated_user");
    await page.waitForSelector(cordelia_user_row + " .zulip-icon-user-plus");
    await page.click(cordelia_user_row + " .reactivate");

    await test_reactivation_confirmation_modal(page, common.fullname.cordelia);

    await page.waitForSelector(cordelia_user_row + ":not(.deactivated_user)", {visible: true});
    cordelia_user_row = await user_row(page, common.fullname.cordelia);
    await page.waitForSelector(cordelia_user_row + " .zulip-icon-user-x");
}

async function test_deactivated_users_section(page: Page): Promise<void> {
    const cordelia_user_row = await user_row(page, common.fullname.cordelia);
    await test_deactivate_user(page);

    // "Deactivated users" section doesn't render just deactivated users until reloaded.
    await page.reload();
    await page.waitForSelector("#admin-user-list.show", {visible: true});
    const deactivated_users_section = ".tab-container .ind-tab[data-tab-key='deactivated']";
    await page.waitForSelector(deactivated_users_section, {visible: true});
    await page.click(deactivated_users_section);

    // Instead of waiting for reactivate button using the `waitForSelector` function,
    // we wait until the input is focused because the `waitForSelector` function
    // doesn't guarantee that element is interactable.
    await page.waitForSelector("input[aria-label='Filter deactivated users']", {visible: true});
    await page.click("input[aria-label='Filter deactivated users']");
    await page.waitForFunction(
        () => document.activeElement?.classList?.contains("search") === true,
    );
    await page.click("#admin_deactivated_users_table " + cordelia_user_row + " .reactivate");

    await test_reactivation_confirmation_modal(page, common.fullname.cordelia);

    await page.waitForSelector(
        "#admin_deactivated_users_table " + cordelia_user_row + " button:not(.reactivate)",
        {visible: true},
    );
}

async function test_bot_deactivation_and_reactivation(page: Page): Promise<void> {
    await page.click("li[data-section='bots']");

    const default_bot_user_row = await user_row(page, "Zulip Default Bot");

    await page.click(default_bot_user_row + " .deactivate");
    await common.wait_for_micromodal_to_open(page);

    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Deactivate Zulip Default Bot?",
        "Unexpected title for deactivate bot modal",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Deactivate",
        "Deactivate button has incorrect text.",
    );
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector(default_bot_user_row + ".deactivated_user", {visible: true});
    await page.waitForSelector(default_bot_user_row + " .zulip-icon-user-plus");

    await page.click(default_bot_user_row + " .reactivate");
    await test_reactivation_confirmation_modal(page, "Zulip Default Bot");
    await page.waitForSelector(default_bot_user_row + ":not(.deactivated_user)", {visible: true});
    await page.waitForSelector(default_bot_user_row + " .zulip-icon-user-x");
}

async function user_deactivation_test(page: Page): Promise<void> {
    await common.log_in(page);
    await navigate_to_user_list(page);
    await test_deactivate_user(page);
    await test_reactivate_user(page);
    await test_deactivated_users_section(page);
    await test_bot_deactivation_and_reactivation(page);
}

common.run_test(user_deactivation_test);
```

--------------------------------------------------------------------------------

---[FILE: user-status.test.ts]---
Location: zulip-main/web/e2e-tests/user-status.test.ts

```typescript
import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function open_set_user_status_modal(page: Page): Promise<void> {
    await page.click("#personal-menu");
    await page.waitForSelector("#personal-menu-dropdown", {visible: true});
    // We are using evaluate to click because it is very hard to detect if
    // the personal menu popover has opened.
    await page.evaluate(() => {
        document.querySelector<HTMLAnchorElement>(".update_status_text")!.click();
    });

    // Wait for the modal to completely open.
    await common.wait_for_micromodal_to_open(page);
}

async function test_user_status(page: Page): Promise<void> {
    await open_set_user_status_modal(page);
    // Check by clicking on common statues.
    await page.click(".user-status-option:nth-child(2) .user-status-value");
    await page.waitForFunction(
        () => document.querySelector<HTMLInputElement>(".user-status")!.value === "In a meeting",
    );
    // It should select calendar emoji.
    await page.waitForSelector(".selected-emoji.emoji-1f4c5");

    // Clear everything.
    await page.click("#clear_status_message_button");
    await page.waitForFunction(
        () => document.querySelector<HTMLInputElement>(".user-status")!.value === "",
    );
    await page.waitForSelector(".status-emoji-wrapper .smiley-icon", {visible: true});

    // Manually adding everything.
    await page.type(".user-status", "Busy");
    const tada_emoji_selector = ".emoji-1f389";
    await page.click(".status-emoji-wrapper .smiley-icon");
    // Wait until emoji popover is opened.
    await page.waitForSelector(`.emoji-popover  ${tada_emoji_selector}`, {visible: true});
    await page.click(`.emoji-popover  ${tada_emoji_selector}`);
    await page.waitForSelector(".emoji-picker-popover", {hidden: true});
    await page.waitForSelector(`.selected-emoji${tada_emoji_selector}`);

    await page.click("#set-user-status-modal .dialog_submit_button");
    // It should close the modal after saving.
    await page.waitForSelector("#set-user-status-modal", {hidden: true});

    // Check if the emoji is added in user presence list.
    await page.waitForSelector(`.user-presence-link .status-emoji${tada_emoji_selector}`);
}

async function user_status_test(page: Page): Promise<void> {
    await common.log_in(page);
    await test_user_status(page);
}

common.run_test(user_status_test);
```

--------------------------------------------------------------------------------

---[FILE: common.ts]---
Location: zulip-main/web/e2e-tests/lib/common.ts
Signals: Zod

```typescript
import assert from "node:assert/strict";
import * as fs from "node:fs";
import path from "node:path";
import timersPromises from "node:timers/promises";
import * as url from "node:url";

import "css.escape";
import ErrorStackParser from "error-stack-parser";
import type {Browser, ConsoleMessage, ConsoleMessageLocation, ElementHandle, Page} from "puppeteer";
import * as puppeteer from "puppeteer";
import StackFrame from "stackframe";
import StackTraceGPS from "stacktrace-gps";
import * as z from "zod/mini";

const root_dir = url.fileURLToPath(new URL("../../..", import.meta.url));
const puppeteer_dir = path.join(root_dir, "var/puppeteer");

export const test_credentials = z
    .object({default_user: z.object({username: z.string(), password: z.string()})})
    .parse(JSON.parse(fs.readFileSync(path.join(puppeteer_dir, "test_credentials.json"), "utf8")));

type Message = Record<string, string | boolean> & {
    recipient?: string;
    content: string;
    stream_name?: string;
    topic?: string;
};

let browser: Browser | null = null;
let screenshot_id = 0;
export const is_firefox = process.env["PUPPETEER_PRODUCT"] === "firefox";
let realm_url = "http://zulip.zulipdev.com:9981/";
const gps = new StackTraceGPS({ajax: async (url) => (await fetch(url)).text()});

let last_current_msg_list_id: number | undefined;

export const pm_recipient = {
    async set(page: Page, recipient: string): Promise<void> {
        // Without using the delay option here there seems to be
        // a flake where the typeahead doesn't show up.
        // The flake seems to be due to some method that triggers focus on
        // compose textarea, which causes the typeahead to not show up.
        // Add a delay before typing.
        await timersPromises.setTimeout(100);
        await page.type("#private_message_recipient", recipient);

        // PM typeaheads always have an image. This ensures we are waiting for the right typeahead to appear.
        const entry = await page.waitForSelector(".typeahead .active a .typeahead-image", {
            visible: false,
        });
        // log entry in puppeteer logs
        console.log(await entry!.evaluate((el) => el.textContent));
        await entry!.click();
    },

    async expect(page: Page, expected: string): Promise<void> {
        const actual_recipients = await page.evaluate(() =>
            zulip_test.private_message_recipient_emails(),
        );
        assert.equal(actual_recipients, expected);
    },
};

export const fullname = {
    cordelia: "Cordelia, Lear's daughter",
    othello: "Othello, the Moor of Venice",
    hamlet: "King Hamlet",
};

export const window_size = {
    width: 1400,
    height: 1024,
};

export async function ensure_browser(): Promise<Browser> {
    browser ??= await puppeteer.launch({
        args: [
            `--window-size=${window_size.width},${window_size.height}`,
            "--no-sandbox",
            "--disable-setuid-sandbox",
        ],
        // TODO: Change defaultViewport to 1280x1024 when puppeteer fixes the window size issue with firefox.
        // Here is link to the issue that is tracking the above problem https://github.com/puppeteer/puppeteer/issues/6442.
        defaultViewport: null,
        headless: true,
    });
    return browser;
}

export async function get_page(): Promise<Page> {
    const browser = await ensure_browser();
    const page = await browser.newPage();
    return page;
}

export async function screenshot(page: Page, name: string | null = null): Promise<void> {
    if (name === null) {
        name = `${screenshot_id}`;
        screenshot_id += 1;
    }

    await page.screenshot({
        path: `${path.join(puppeteer_dir, name)}.png`,
    });
}

export async function page_url_with_fragment(page: Page): Promise<string> {
    // `page.url()` does not include the url fragment when running
    // Puppeteer with Firefox: https://github.com/puppeteer/puppeteer/issues/6787.
    //
    // This function hacks around that issue; once it's fixed in
    // puppeteer upstream, we can delete this function and return
    // its callers to using `page.url()`
    return await page.evaluate(() => window.location.href);
}

// This function will clear the existing value of the element and
// replace it with the text.
export async function clear_and_type(page: Page, selector: string, text: string): Promise<void> {
    // Select all text currently in the element.
    await page.click(selector, {clickCount: 3});
    await page.keyboard.press("Delete");
    await page.type(selector, text);
}

/**
 * This function takes a params object whose fields
 * are referenced by name attribute of an input field and
 * the input as a key.
 *
 * For example to fill:
 *  <form id="#demo">
 *     <input type="text" name="username">
 *     <input type="checkbox" name="terms">
 *  </form>
 *
 * You can call:
 * common.fill_form(page, '#demo', {
 *     username: 'Iago',
 *     terms: true
 * });
 */
export async function fill_form(
    page: Page,
    form_selector: string,
    params: Record<string, boolean | string>,
): Promise<void> {
    async function is_dropdown(page: Page, name: string): Promise<boolean> {
        return (await page.$(`select[name="${CSS.escape(name)}"]`)) !== null;
    }
    for (const [name, value] of Object.entries(params)) {
        if (typeof value === "boolean") {
            await page.$eval(
                `${form_selector} input[name="${CSS.escape(name)}"]`,
                (el, value) => {
                    if (el.checked !== value) {
                        el.click();
                    }
                },
                value,
            );
        } else if (await is_dropdown(page, name)) {
            if (typeof value !== "string") {
                throw new TypeError(`Expected string for ${name}`);
            }
            await page.select(`${form_selector} select[name="${CSS.escape(name)}"]`, value);
        } else {
            await clear_and_type(page, `${form_selector} [name="${CSS.escape(name)}"]`, value);
        }
    }
}

export async function check_form_contents(
    page: Page,
    form_selector: string,
    params: Record<string, boolean | string>,
): Promise<void> {
    for (const name of Object.keys(params)) {
        const expected_value = params[name];
        if (typeof expected_value === "boolean") {
            assert.equal(
                await page.$eval(
                    `${form_selector} input[name="${CSS.escape(name)}"]`,
                    (el) => el.checked,
                ),
                expected_value,
                "Form content is not as expected.",
            );
        } else {
            assert.equal(
                await page.$eval(`${form_selector} [name="${CSS.escape(name)}"]`, (el) => {
                    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
                        throw new TypeError("Expected <input> or <textarea>");
                    }
                    return el.value;
                }),
                expected_value,
                "Form content is not as expected.",
            );
        }
    }
}

export async function get_element_text(element: ElementHandle): Promise<string> {
    const text = await (await element.getProperty("innerText")).jsonValue();
    assert.ok(typeof text === "string");
    return text;
}

export async function get_text_from_selector(page: Page, selector: string): Promise<string> {
    const elements = await page.$$(selector);
    const texts = await Promise.all(elements.map(async (element) => get_element_text(element)));
    return texts.join("").trim();
}

export async function check_compose_state(
    page: Page,
    params: {stream_name?: string; topic?: string; content: string},
): Promise<void> {
    const form_params: Record<string, string> = {content: params.content};
    if (params.stream_name) {
        assert.equal(
            await get_text_from_selector(
                page,
                "#compose_select_recipient_widget .dropdown_widget_value",
            ),
            params.stream_name,
        );
    }
    if (params.topic) {
        form_params["stream_message_recipient_topic"] = params.topic;
    }
    await check_form_contents(page, "form#send_message_form", form_params);
}

export function has_class_x(class_name: string): string {
    return `contains(concat(" ", @class, " "), " ${class_name} ")`;
}

export async function get_stream_id(page: Page, stream_name: string): Promise<number | undefined> {
    return await page.evaluate(
        (stream_name: string) => zulip_test.get_stream_id(stream_name),
        stream_name,
    );
}

export async function get_user_id_from_name(page: Page, name: string): Promise<number | undefined> {
    return await page.evaluate((name: string) => zulip_test.get_user_id_from_name(name), name);
}

export async function get_internal_email_from_name(
    page: Page,
    name: string,
): Promise<string | undefined> {
    return await page.evaluate((fullname: string) => {
        const user_id = zulip_test.get_user_id_from_name(fullname);
        return user_id === undefined ? undefined : zulip_test.get_person_by_user_id(user_id).email;
    }, name);
}

export async function log_in(
    page: Page,
    credentials: {username: string; password: string} = test_credentials.default_user,
): Promise<void> {
    console.log("Logging in");
    await page.goto(realm_url + "login/");
    assert.equal(realm_url + "login/", page.url());
    // fill login form
    const params = {
        username: credentials.username,
        password: credentials.password,
    };
    await fill_form(page, "form#login_form", params);
    await page.$eval("form#login_form", (form) => {
        form.submit();
    });

    await page.waitForSelector("#inbox-main", {visible: true});
}

export async function log_out(page: Page): Promise<void> {
    await page.goto(realm_url);
    const menu_selector = "#personal-menu";
    const logout_selector = ".personal-menu-actions a.logout_button";
    console.log("Logging out");
    await page.waitForSelector(menu_selector, {visible: true});
    await page.click(menu_selector);
    await page.waitForSelector(logout_selector);
    await page.click(logout_selector);

    // Wait for a email input in login page so we know login
    // page is loaded. Then check that we are at the login url.
    await page.waitForSelector('input[name="username"]');
    assert.ok(page.url().includes("/login/"));
}

export function set_realm_url(new_realm_url: string): void {
    realm_url = new_realm_url;
}

export async function ensure_enter_does_not_send(page: Page): Promise<void> {
    // NOTE: Caller should ensure that the compose box is already open.
    await page.click("#send_later");
    await page.waitForSelector("#send_later_popover");
    const enter_sends = await page.$eval(
        ".enter_sends_choice input[value='true']",
        (el) => el.checked,
    );

    if (enter_sends) {
        const enter_sends_false_selector = ".enter_sends_choice input[value='false']";
        await page.waitForSelector(enter_sends_false_selector);
        await page.click(enter_sends_false_selector);
    }
}

export async function assert_compose_box_content(
    page: Page,
    expected_value: string,
): Promise<void> {
    const compose_box_element = await page.waitForSelector("textarea#compose-textarea");
    assert.ok(compose_box_element !== null);
    const compose_box_content = await page.evaluate(
        (element) => element.value,
        compose_box_element,
    );
    assert.equal(
        compose_box_content,
        expected_value,
        `Compose box content did not match with the expected value '{${expected_value}}'`,
    );
}

export async function wait_for_fully_processed_message(page: Page, content: string): Promise<void> {
    // Wait in parallel for the message list scroll animation, which
    // interferes with Puppeteer accurately clicking on messages.
    const scroll_delay = timersPromises.setTimeout(400);

    await page.waitForFunction(
        (content: string) => {
            /*
                The tricky part about making sure that
                a message has actually been fully processed
                is that we'll "locally echo" the message
                first on the client.  Until the server
                actually acks the message, the message will
                have a temporary id and will not have all
                the normal message controls.
                For the Puppeteer tests, we want to avoid all
                the edge cases with locally echoed messages.
                In order to make sure a message is processed,
                we use internals to determine the following:
                    - has message_list even been updated with
                      the message with out content?
                    - has the locally_echoed flag been cleared?
                But for the final steps we look at the
                actual DOM (via JQuery):
                    - is it visible?
                    - does it look to have been
                      re-rendered based on server info?
            */
            const last_msg = zulip_test.current_msg_list?.last();
            if (last_msg === undefined) {
                return false;
            }

            if (last_msg.raw_content !== content) {
                return false;
            }

            if (last_msg.locally_echoed) {
                return false;
            }

            const $row = zulip_test.last_visible_row();
            if (zulip_test.row_id($row) !== last_msg.id) {
                return false;
            }

            /*
                Make sure the message is completely
                re-rendered from its original "local echo"
                version by looking for the star icon.  We
                don't add the star icon until the server
                responds.
            */
            return $row.find(".star").length === 1;
        },
        {},
        content,
    );

    await scroll_delay;
}

export async function select_stream_in_compose_via_dropdown(
    page: Page,
    stream_name: string,
): Promise<void> {
    console.log(`Clicking on 'compose_select_recipient_widget' to select ${stream_name}`);
    const menu_visible = (await page.$(".dropdown-list-container")) !== null;
    if (!menu_visible) {
        await page.waitForSelector("#compose_select_recipient_widget", {visible: true});
        await page.click("#compose_select_recipient_widget");
        await page.waitForSelector(".dropdown-list-container .list-item", {
            visible: true,
        });
    }
    const stream_to_select = `.dropdown-list-container .list-item[data-name="${stream_name}"]`;
    await page.waitForSelector(stream_to_select, {visible: true});
    await page.click(stream_to_select);
    assert.ok((await page.$(".dropdown-list-container")) === null);
}

// Wait for any previous send to finish, then send a message.
export async function send_message(
    page: Page,
    type: "stream" | "private",
    params: Message,
    wait_for_narrow_change = true,
): Promise<void> {
    // Compose box content should be empty before sending the message.
    await assert_compose_box_content(page, "");

    if (type === "stream") {
        await page.keyboard.press("KeyC");
    } else if (type === "private") {
        await page.keyboard.press("KeyX");
        const recipients = params.recipient!.split(", ");
        for (const recipient of recipients) {
            await pm_recipient.set(page, recipient);
        }
        delete params.recipient;
    } else {
        assert.fail("`send_message` got invalid message type");
    }

    if (params.stream_name) {
        await select_stream_in_compose_via_dropdown(page, params.stream_name);
        delete params.stream_name;
    }

    if (params.topic) {
        params["stream_message_recipient_topic"] = params.topic;
        delete params.topic;
    }

    await fill_form(page, 'form[action^="/json/messages"]', params);
    await assert_compose_box_content(page, params.content);
    await ensure_enter_does_not_send(page);
    await page.waitForSelector("#compose-send-button", {visible: true});
    await page.click("#compose-send-button");

    if (wait_for_narrow_change) {
        // After the message is sent, wait for the narrow
        // to change to the message recipient.
        await get_current_msg_list_id(page, true);
    }

    // Sending should clear compose box content.
    await assert_compose_box_content(page, "");
    await wait_for_fully_processed_message(page, params.content);

    // Close the compose box after sending the message.
    await page.evaluate(() => {
        zulip_test.cancel_compose();
    });
    // Make sure the compose box is closed.
    await page.waitForSelector("#compose-textarea", {hidden: true});
}

export async function send_multiple_messages(page: Page, msgs: Message[]): Promise<void> {
    let last_msg_stream;
    let last_msg_topic;
    let last_msg_recipient;
    for (const msg of msgs) {
        const msg_type = msg.stream_name !== undefined ? "stream" : "private";
        // Check if `msg` and `last_msg` are in the same narrow.
        let wait_for_narrow_change = true;
        if (
            msg.stream_name === last_msg_stream &&
            msg.topic === last_msg_topic &&
            msg.recipient === last_msg_recipient
        ) {
            wait_for_narrow_change = false;
        }
        last_msg_stream = msg.stream_name;
        last_msg_topic = msg.topic;
        last_msg_recipient = msg.recipient;
        await send_message(page, msg_type, msg, wait_for_narrow_change);
    }
}

/**
 * This method returns a array, which is formatted as:
 *  [
 *    ['stream > topic', ['message 1', 'message 2']],
 *    ['You and Cordelia, Lear's daughter', ['message 1', 'message 2']]
 *  ]
 *
 * The messages are sorted chronologically.
 */
export async function get_rendered_messages(
    page: Page,
    message_list_id: number,
): Promise<[string, string[]][]> {
    const recipient_rows = await page.$$(
        `.message-list[data-message-list-id='${message_list_id}'] .recipient_row`,
    );
    return Promise.all(
        recipient_rows.map(async (element): Promise<[string, string[]]> => {
            const stream_label = await element.$(".stream_label");
            const stream_name = (await get_element_text(stream_label!)).trim();
            const topic_label = await element.$(".stream_topic a");
            const topic_name =
                topic_label === null ? "" : (await get_element_text(topic_label)).trim();
            let key = stream_name;
            if (topic_name !== "") {
                // If topic_name is '', then this is direct messages, so only
                // append > topic_name if we are not in 1:1 or group direct
                // messages.
                key = `${stream_name} > ${topic_name}`;
            }

            const messages = await Promise.all(
                (await element.$$(".message_row .message_content")).map(async (message_row) =>
                    (await get_element_text(message_row)).trim(),
                ),
            );

            return [key, messages];
        }),
    );
}

// This method takes in page, table to fetch the messages
// from, and expected messages. The format of expected
// message is { "stream > topic": [messages] }.
// The method will only check that all the messages in the
// messages array passed exist in the order they are passed.
export async function check_messages_sent(
    page: Page,
    message_list_id: number,
    messages: [string, string[]][],
): Promise<void> {
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    const rendered_messages = await get_rendered_messages(page, message_list_id);

    // We only check the last n messages because if we run
    // the test with --interactive there will be duplicates.
    const last_n_messages = rendered_messages.slice(-messages.length);
    assert.deepStrictEqual(last_n_messages, messages);
}

export async function open_streams_modal(page: Page): Promise<void> {
    const all_streams_selector = "#subscribe-to-more-streams";
    await page.waitForSelector(all_streams_selector, {visible: true});
    await page.click(all_streams_selector);

    await page.waitForSelector("#subscription_overlay", {visible: true});
    const url = await page_url_with_fragment(page);
    assert.ok(url.includes("#channels/available"));
}

export async function open_personal_menu(page: Page): Promise<void> {
    const menu_selector = "#personal-menu";
    await page.waitForSelector(menu_selector, {visible: true});
    await page.click(menu_selector);
}

export async function manage_organization(page: Page): Promise<void> {
    const menu_selector = "#settings-dropdown";
    await page.waitForSelector(menu_selector, {visible: true});
    await page.click(menu_selector);

    const organization_settings = '.link-item a[href="#organization"]';
    await page.waitForSelector(organization_settings, {visible: true});
    await page.click(organization_settings);
    await page.waitForSelector("#settings_overlay_container.show", {visible: true});

    const url = await page_url_with_fragment(page);
    assert.match(url, /^http:\/\/[^/]+\/#organization/, "Unexpected organization settings URL");

    const organization_settings_data_section = "li[data-section='organization-settings']";
    await page.click(organization_settings_data_section);
}

export async function select_item_via_typeahead(
    page: Page,
    field_selector: string,
    str: string,
    item: string,
): Promise<void> {
    console.log(`Looking in ${field_selector} to select ${str}, ${item}`);
    await clear_and_type(page, field_selector, str);
    const entry = await page.waitForSelector(
        `xpath///*[${has_class_x("typeahead")}]//li[contains(normalize-space(), "${item}")]//a`,
        {visible: true},
    );
    assert.ok(entry);
    await entry.hover();
    await entry.click();
}

export async function wait_for_modal_to_close(page: Page): Promise<void> {
    // This function will ensure that the mouse events are enabled for the background for further tests.
    await page.waitForFunction(
        () => document.querySelector(".overlay.show")?.getAttribute("style") === null,
    );
}

export async function wait_for_micromodal_to_open(page: Page): Promise<void> {
    // We manually add the `modal--open` class to the modal after the modal animation completes.
    await page.waitForFunction(() => document.querySelector(".modal--open") !== null);
}

export async function wait_for_micromodal_to_close(page: Page): Promise<void> {
    // This function will ensure that the mouse events are enabled for the background for further tests.
    await page.waitForFunction(() => document.querySelector(".modal--open") === null);
}

export async function run_test_async(test_function: (page: Page) => Promise<void>): Promise<void> {
    // Pass a page instance to test so we can take
    // a screenshot of it when the test fails.
    const browser = await ensure_browser();
    const page = await get_page();

    // Used to keep console messages in order after async source mapping
    let console_ready = Promise.resolve();

    page.on("console", (message: ConsoleMessage) => {
        const context = async ({
            url,
            lineNumber,
            columnNumber,
        }: ConsoleMessageLocation): Promise<string> => {
            let frame = new StackFrame({
                ...(url !== undefined && {fileName: url}),
                ...(lineNumber !== undefined && {lineNumber: lineNumber + 1}),
                ...(columnNumber !== undefined && {columnNumber: columnNumber + 1}),
            });
            try {
                frame = await gps.getMappedLocation(frame);
            } catch {
                // Ignore source mapping errors
            }
            if (frame.lineNumber === undefined || frame.columnNumber === undefined) {
                return String(frame.fileName);
            }
            return `${String(frame.fileName)}:${frame.lineNumber}:${frame.columnNumber}`;
        };

        const console_ready1 = console_ready;
        console_ready = (async () => {
            let output = `${await context(
                message.location(),
            )}: ${message.type()}: ${message.text()}`;
            if (message.type() === "trace") {
                for (const frame of message.stackTrace()) {
                    output += `\n    at ${await context(frame)}`;
                }
            }
            await console_ready1;
            console.log(output);
        })();
    });

    let page_errored = false;
    page.on("pageerror", (error: unknown) => {
        page_errored = true;

        const console_ready1 = console_ready;
        console_ready = (async () => {
            let message;
            if (error instanceof Error) {
                const frames = await Promise.all(
                    ErrorStackParser.parse(error).map(async (frame) => {
                        try {
                            frame = await gps.getMappedLocation(frame);
                        } catch {
                            // Ignore source mapping errors
                        }
                        return `\n    at ${String(frame.functionName)} (${String(
                            frame.fileName,
                        )}:${String(frame.lineNumber)}:${String(frame.columnNumber)})`;
                    }),
                );
                message = error.toString() + frames.join("");
            } else {
                message = String(error);
            }
            await console_ready1;
            console.error("Page error:", message);
        })();

        const console_ready2 = console_ready;
        console_ready = (async () => {
            try {
                // Take a screenshot, and increment the screenshot_id.
                await screenshot(page, `failure-${screenshot_id}`);
                screenshot_id += 1;
            } finally {
                await console_ready2;
                console.log("Closing page to stop the test...");
                await page.close();
            }
        })();
    });

    try {
        await test_function(page);
        await log_out(page);

        if (page_errored) {
            throw new Error("Page threw an error");
        }
    } catch (error: unknown) {
        if (!page_errored) {
            // Take a screenshot, and increment the screenshot_id.
            await screenshot(page, `failure-${screenshot_id}`);
            screenshot_id += 1;
        }

        throw error;
    } finally {
        await console_ready;
        await browser.close();
    }
}

export function run_test(test_function: (page: Page) => Promise<void>): void {
    run_test_async(test_function).catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
}

export async function get_current_msg_list_id(
    page: Page,
    wait_for_change = false,
): Promise<number> {
    if (wait_for_change) {
        // Wait for the current_msg_list to change if the in the middle of switching narrows.
        // Also works as a way to verify that the current message list did change.
        // NOTE: This only checks if the current message list id changed from the last call to this function,
        // so, make sure to have a call to this function before changing to the narrow that you want to check.
        await page.waitForFunction(
            (last_current_msg_list_id) => {
                const current_msg_list = zulip_test.current_msg_list;
                return (
                    current_msg_list !== undefined &&
                    current_msg_list.id !== last_current_msg_list_id
                );
            },
            {},
            last_current_msg_list_id,
        );
    }
    last_current_msg_list_id = await page.evaluate(() => zulip_test.current_msg_list?.id);
    assert.ok(last_current_msg_list_id !== undefined);
    return last_current_msg_list_id;
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/web/generated/README.md

```text
This directory is for generated frontend assets.
```

--------------------------------------------------------------------------------

---[FILE: 5xx-cloud.html]---
Location: zulip-main/web/html/5xx-cloud.html

```text
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>500 internal server error | Zulip</title>
        <meta http-equiv="refresh" content="60;URL='/'" />
        <!-- We use `error-styles` webpack assets to styles this page. -->
    </head>
    <body>
        <div class="header">
            <div class="header-main" id="top_navbar">
                <div class="float-left">
                    <a class="brand logo" href="https://zulip.com/">
                        <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="68.96 55.62 1742.12 450.43" height="25">
                            <path fill="hsl(0, 0%, 27%)" d="M473.09 122.97c0 22.69-10.19 42.85-25.72 55.08L296.61 312.69c-2.8 2.4-6.44-1.47-4.42-4.7l55.3-110.72c1.55-3.1-.46-6.91-3.64-6.91H129.36c-33.22 0-60.4-30.32-60.4-67.37 0-37.06 27.18-67.37 60.4-67.37h283.33c33.22-.02 60.4 30.3 60.4 67.35zM129.36 506.05h283.33c33.22 0 60.4-30.32 60.4-67.37 0-37.06-27.18-67.37-60.4-67.37H198.2c-3.18 0-5.19-3.81-3.64-6.91l55.3-110.72c2.02-3.23-1.62-7.1-4.42-4.7L94.68 383.6c-15.53 12.22-25.72 32.39-25.72 55.08 0 37.05 27.18 67.37 60.4 67.37zm522.5-124.15l124.78-179.6v-1.56H663.52v-48.98h190.09v34.21L731.55 363.24v1.56h124.01v48.98h-203.7V381.9zm338.98-230.14V302.6c0 45.09 17.1 68.03 47.43 68.03 31.1 0 48.2-21.77 48.2-68.03V151.76h59.09V298.7c0 80.86-40.82 119.34-109.24 119.34-66.09 0-104.96-36.54-104.96-120.12V151.76h59.48zm244.91 0h59.48v212.25h104.18v49.76h-163.66V151.76zm297 0v262.01h-59.48V151.76h59.48zm90.18 3.5c18.27-3.11 43.93-5.44 80.08-5.44 36.54 0 62.59 7 80.08 20.99 16.72 13.22 27.99 34.99 27.99 60.64 0 25.66-8.55 47.43-24.1 62.2-20.21 19.05-50.15 27.6-85.13 27.6-7.77 0-14.77-.39-20.21-1.17v93.69h-58.7V155.26zm58.7 118.96c5.05 1.17 11.27 1.55 19.83 1.55 31.49 0 50.92-15.94 50.92-42.76 0-24.1-16.72-38.49-46.26-38.49-12.05 0-20.21 1.17-24.49 2.33v77.37z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        <div class="error_page">
            <img src="/static/images/errors/500art.svg" alt=""/>
            <div class="errorbox">
                <div class="errorcontent">
                    <!-- Keep in sync with templates/500.html -->
                    <h1 class="lead">Internal server error</h1>
                    <p>
                        Something went wrong. Sorry about that! We're
                        aware of the problem and are working to fix
                        it. Zulip will load automatically once it is
                        working again.
                    </p>
                    <p>
                        Please check <a href="https://status.zulip.com/">Zulip Cloud status</a> for
                        more information, and <a href="mailto:support@zulip.com">contact
                        Zulip support</a> with any questions.
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
```

--------------------------------------------------------------------------------

````

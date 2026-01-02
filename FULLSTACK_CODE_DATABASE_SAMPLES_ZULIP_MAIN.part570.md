---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 570
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 570 of 1290)

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

---[FILE: settings.test.ts]---
Location: zulip-main/web/e2e-tests/settings.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";
import {test_credentials} from "./lib/common.ts";

const OUTGOING_WEBHOOK_BOT_TYPE = "3";
const GENERIC_BOT_TYPE = "1";

const zuliprc_regex =
    /^data:application\/octet-stream;charset=utf-8,\[api]\nemail=.+\nkey=.+\nsite=.+\n$/;

async function get_decoded_url_in_selector(page: Page, selector: string): Promise<string> {
    const a = await page.$(`a:is(${selector})`);
    return decodeURIComponent(await (await a!.getProperty("href")).jsonValue());
}

async function open_manage_bot_tab(page: Page, user_id: number): Promise<void> {
    const manage_button_selector = `#admin_your_bots_table .user_row[data-user-id="${user_id}"] .manage-user-button`;
    await page.waitForSelector(manage_button_selector, {visible: true});
    await page.click(manage_button_selector);

    // Wait for modal, then go to tab
    await common.wait_for_micromodal_to_open(page);
}

async function open_settings(page: Page): Promise<void> {
    await common.open_personal_menu(page);

    const settings_selector = "#personal-menu-dropdown a[href^='#settings']";
    await page.waitForSelector(settings_selector, {visible: true});
    await page.click(settings_selector);

    await page.waitForSelector("#settings_content .profile-settings-form", {visible: true});
    const page_url = await common.page_url_with_fragment(page);
    assert.ok(
        page_url.includes("/#settings/"),
        `Page url: ${page_url} does not contain /#settings/`,
    );
    // Wait for settings overlay to open.
    await page.waitForSelector("#settings_overlay_container", {visible: true});
}

async function close_settings_and_date_picker(page: Page): Promise<void> {
    const date_picker_selector = ".date-field-alt-input";
    await page.click(date_picker_selector);

    await page.waitForSelector(".flatpickr-calendar", {visible: true});

    await page.keyboard.press("Escape");
    await page.waitForSelector(".flatpickr-calendar", {hidden: true});
    await page.waitForSelector("#settings_overlay_container", {hidden: true});
}

async function test_change_full_name(page: Page): Promise<void> {
    await page.waitForSelector("#full_name", {visible: true});
    await page.click("#full_name");

    const full_name_input_selector = 'input[name="full_name"]';
    await common.clear_and_type(page, full_name_input_selector, "New name");

    await page.click("#settings_content .profile-settings-form");
    await page.waitForSelector(".full-name-change-container .alert-success", {visible: true});
    await page.waitForFunction(
        () => document.querySelector<HTMLInputElement>("#full_name")?.value === "New name",
    );
}

async function test_change_password(page: Page): Promise<void> {
    await page.click("#change_password");

    const change_password_button_selector = "#change_password_modal .dialog_submit_button";
    await page.waitForSelector(change_password_button_selector, {visible: true});

    await common.wait_for_micromodal_to_open(page);
    await page.type("#old_password", test_credentials.default_user.password);
    test_credentials.default_user.password = "new_password";
    await page.type("#new_password", test_credentials.default_user.password);
    await page.click(change_password_button_selector);

    // On success the change password modal gets closed.
    await common.wait_for_micromodal_to_close(page);
}

async function test_get_api_key(page: Page): Promise<void> {
    await page.click('[data-section="account-and-privacy"]');
    const show_change_api_key_selector = "#api_key_button";
    await page.click(show_change_api_key_selector);

    const get_api_key_button_selector = "#get_api_key_button";
    await page.waitForSelector(get_api_key_button_selector, {visible: true});
    await common.wait_for_micromodal_to_open(page);
    await common.fill_form(page, "#api_key_form", {
        password: test_credentials.default_user.password,
    });

    // When typing the password in Firefox, it shows "Not Secure" warning
    // which was hiding the Get API key button.
    // You can see the screenshot of it in https://github.com/zulip/zulip/pull/17136.
    // Focusing on it will remove the warning.
    await page.focus(get_api_key_button_selector);
    await page.click(get_api_key_button_selector);

    await page.waitForSelector("#show_api_key", {visible: true});
    const api_key = await common.get_text_from_selector(page, "#api_key_value");
    assert.match(api_key, /[\dA-Za-z]{32}/, "Incorrect API key format.");

    const download_zuliprc_selector = "#download_zuliprc";
    await page.click(download_zuliprc_selector);
    const zuliprc_decoded_url = await get_decoded_url_in_selector(page, download_zuliprc_selector);
    assert.match(zuliprc_decoded_url, zuliprc_regex, "Incorrect zuliprc file");
    await page.click("#api_key_modal .modal__close");
    await common.wait_for_micromodal_to_close(page);
}

async function test_webhook_bot_creation(page: Page): Promise<void> {
    await page.click("#admin-bot-list .add-a-new-bot");
    await common.wait_for_micromodal_to_open(page);
    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Add a new bot",
        "Unexpected title for deactivate user modal",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Add",
        "Deactivate button has incorrect text.",
    );
    await common.fill_form(page, "#create_bot_form", {
        bot_name: "Bot 1",
        bot_short_name: "1",
        bot_type: OUTGOING_WEBHOOK_BOT_TYPE,
        payload_url: "http://hostname.example.com/bots/followup",
    });
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    const user_id = await common.get_user_id_from_name(page, "Bot 1");
    await open_manage_bot_tab(page, user_id!);

    const outgoing_webhook_zuliprc_regex =
        /^data:application\/octet-stream;charset=utf-8,\[api]\nemail=.+\nkey=.+\nsite=.+\ntoken=.+\n$/;

    const zuliprc_url_selector = `.micromodal .hidden-zuliprc-download`;
    const download_zuliprc_selector = `.download-bot-zuliprc`;

    await page.waitForSelector(download_zuliprc_selector, {visible: true});
    await page.click(download_zuliprc_selector);

    const zuliprc_decoded_url = await get_decoded_url_in_selector(page, zuliprc_url_selector);
    assert.match(
        zuliprc_decoded_url,
        outgoing_webhook_zuliprc_regex,
        "Incorrect outgoing webhook bot zuliprc format",
    );
    await page.click(".micromodal .modal__close");
    await common.wait_for_micromodal_to_close(page);
}

async function test_normal_bot_creation(page: Page): Promise<void> {
    await page.click("#admin-bot-list .add-a-new-bot");
    await common.wait_for_micromodal_to_open(page);
    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Add a new bot",
        "Unexpected title for deactivate user modal",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button span"),
        "Add",
        "Deactivate button has incorrect text.",
    );
    await common.fill_form(page, "#create_bot_form", {
        bot_name: "Bot 2",
        bot_short_name: "2",
        bot_type: GENERIC_BOT_TYPE,
    });
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    const user_id = await common.get_user_id_from_name(page, "Bot 2");
    await open_manage_bot_tab(page, user_id!);

    const zuliprc_url_selector = `.micromodal .hidden-zuliprc-download`;
    const download_zuliprc_selector = `.download-bot-zuliprc`;

    await page.waitForSelector(download_zuliprc_selector, {visible: true});
    await page.click(download_zuliprc_selector);
    const zuliprc_decoded_url = await get_decoded_url_in_selector(page, zuliprc_url_selector);
    assert.match(zuliprc_decoded_url, zuliprc_regex, "Incorrect zuliprc format for bot.");
    await page.click(".micromodal .modal__close");
    await common.wait_for_micromodal_to_close(page);
}

async function test_botserverrc(page: Page): Promise<void> {
    await page.click("#download-botserverrc-file");
    await page.waitForSelector('#hidden-botserverrc-download[href^="data:application"]');
    const botserverrc_decoded_url = await get_decoded_url_in_selector(
        page,
        "#hidden-botserverrc-download",
    );
    const botserverrc_regex =
        /^data:application\/octet-stream;charset=utf-8,\[]\nemail=.+\nkey=.+\nsite=.+\ntoken=.+\n$/;
    assert.match(botserverrc_decoded_url, botserverrc_regex, "Incorrect botserverrc format.");
}

// Disabled the below test due to non-deterministic failures.
// The test often fails to close the modal, as does the
// test_invalid_edit_bot_form above.
// TODO: Debug this and re-enable with a fix.
async function test_edit_bot_form(page: Page): Promise<void> {
    return;
    const bot1_email = "1-bot@zulip.testserver";
    const bot1_edit_button = `.open_edit_bot_form[data-email="${CSS.escape(bot1_email)}"]`;
    await page.click(bot1_edit_button);

    const edit_form_selector = `#bot-edit-form[data-email="${CSS.escape(bot1_email)}"]`;
    await page.waitForSelector(edit_form_selector, {visible: true});
    assert.equal(
        await page.$eval(`${edit_form_selector} input[name=full_name]`, (el) => el.value),
        "Bot 1",
    );

    await common.fill_form(page, edit_form_selector, {full_name: "Bot one"});
    const save_button_selector = "#user-profile-modal .dialog_submit_button";
    await page.click(save_button_selector);

    // The form gets closed on saving. So, assert it's closed by waiting for it to be hidden.
    await page.waitForSelector("#edit_bot_modal", {hidden: true});

    await page.waitForSelector(
        `xpath///*[${common.has_class_x(
            "open_edit_bot_form",
        )} and @data-email="${bot1_email}"]/ancestor::*[${common.has_class_x(
            "details",
        )}]/*[${common.has_class_x("name")} and text()="Bot one"]`,
    );

    await common.wait_for_micromodal_to_close(page);
}

// Disabled the below test due to non-deterministic failures.
// The test often fails to close the modal.
// TODO: Debug this and re-enable with a fix.
async function test_invalid_edit_bot_form(page: Page): Promise<void> {
    return;
    const bot1_email = "1-bot@zulip.testserver";
    const bot1_edit_button = `.open_edit_bot_form[data-email="${CSS.escape(bot1_email)}"]`;
    await page.click(bot1_edit_button);

    const edit_form_selector = `#bot-edit-form[data-email="${CSS.escape(bot1_email)}"]`;
    await page.waitForSelector(edit_form_selector, {visible: true});
    assert.equal(
        await page.$eval(`${edit_form_selector} input[name=full_name]`, (el) => el.value),
        "Bot one",
    );

    await common.fill_form(page, edit_form_selector, {full_name: "Bot 2"});
    const save_button_selector = "#user-profile-modal .dialog_submit_button";
    await page.click(save_button_selector);

    // The form should not get closed on saving. Errors should be visible on the form.
    await common.wait_for_micromodal_to_open(page);
    await page.waitForSelector("#dialog_error", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(page, "#dialog_error"),
        "Failed: Name is already in use.",
    );

    const cancel_button_selector = "#user-profile-modal .dialog_exit_button";
    await page.waitForFunction(
        (cancel_button_selector: string) =>
            !document.querySelector(cancel_button_selector)?.hasAttribute("disabled"),
        {},
        cancel_button_selector,
    );
    await page.click(cancel_button_selector);
    await page.waitForSelector(
        `xpath///*[${common.has_class_x(
            "open_edit_bot_form",
        )} and @data-email="${bot1_email}"]/ancestor::*[${common.has_class_x(
            "details",
        )}]/*[${common.has_class_x("name")} and text()="Bot one"]`,
    );

    await common.wait_for_micromodal_to_close(page);
}

async function test_your_bots_section(page: Page): Promise<void> {
    await page.click(".your-bots-link");
    await test_webhook_bot_creation(page);
    await test_normal_bot_creation(page);
    await test_botserverrc(page);
    await test_edit_bot_form(page);
    await test_invalid_edit_bot_form(page);
}

const alert_word_status_banner_selector = ".alert-word-status-banner";

async function add_alert_word(page: Page, word: string): Promise<void> {
    await page.click("#open-add-alert-word-modal");
    await common.wait_for_micromodal_to_open(page);

    await page.type("#add-alert-word-name", word);
    await page.click("#add-alert-word .dialog_submit_button");

    await common.wait_for_micromodal_to_close(page);
}

async function check_alert_word_added(page: Page, word: string): Promise<void> {
    const added_alert_word_selector = `.alert-word-item[data-word='${CSS.escape(word)}']`;
    await page.waitForSelector(added_alert_word_selector, {visible: true});
}

async function get_alert_words_status_text(page: Page): Promise<string> {
    await page.waitForSelector(alert_word_status_banner_selector, {visible: true});
    const status_text = await common.get_text_from_selector(
        page,
        ".alert-word-status-banner .banner-label",
    );
    return status_text;
}

async function close_alert_words_status(page: Page): Promise<void> {
    const status_close_button = ".alert-word-status-banner .banner-close-button";
    await page.click(status_close_button);
    assert.ok((await page.$(alert_word_status_banner_selector)) === null);
}

async function test_duplicate_alert_words_cannot_be_added(
    page: Page,
    duplicate_word: string,
): Promise<void> {
    await page.click("#open-add-alert-word-modal");
    await common.wait_for_micromodal_to_open(page);

    await page.type("#add-alert-word-name", duplicate_word);
    await page.click("#add-alert-word .dialog_submit_button");

    const alert_word_status_selector = "#dialog_error";
    await page.waitForSelector(alert_word_status_selector, {visible: true});
    const status_text = await common.get_text_from_selector(page, alert_word_status_selector);
    assert.strictEqual(status_text, "Alert word already exists!");

    await page.click("#add-alert-word .dialog_exit_button");
    await common.wait_for_micromodal_to_close(page);
}

async function delete_alert_word(page: Page, word: string): Promise<void> {
    const delete_button_selector = `tr[data-word="${CSS.escape(word)}"] .remove-alert-word`;
    await page.click(delete_button_selector);
    await page.waitForSelector(delete_button_selector, {hidden: true});
}

async function test_alert_word_deletion(page: Page, word: string): Promise<void> {
    await delete_alert_word(page, word);
    const status_text = await get_alert_words_status_text(page);
    assert.strictEqual(status_text, `Alert word ${word} removed successfully!`);
    await close_alert_words_status(page);
}

async function test_alert_words_section(page: Page): Promise<void> {
    await page.click('[data-section="alert-words"]');
    const word = "puppeteer";
    await add_alert_word(page, word);
    await check_alert_word_added(page, word);
    await test_duplicate_alert_words_cannot_be_added(page, word);
    await test_alert_word_deletion(page, word);
}

async function change_language(page: Page, language_data_code: string): Promise<void> {
    await page.waitForSelector("#default_language_widget", {
        visible: true,
    });
    await page.click("#default_language_widget");
    await page.waitForSelector(".dropdown-list", {visible: true});
    const language_selector = `li[data-unique-id="${CSS.escape(language_data_code)}"]`;
    await page.click(language_selector);
}

async function check_language_setting_status(page: Page): Promise<void> {
    await page.waitForSelector("#user-preferences .general-settings-status .reload_link", {
        visible: true,
    });
}

async function assert_language_changed_to_chinese(page: Page): Promise<void> {
    await page.waitForSelector("#default_language_widget", {
        visible: true,
    });
    const default_language = await common.get_text_from_selector(page, ".dropdown_widget_value");
    assert.strictEqual(
        default_language.slice(0, 7),
        "中文 (简体)",
        "Default language has not been changed to Chinese.",
    );
}

async function test_i18n_language_precedence(page: Page): Promise<void> {
    const settings_url_for_german = "http://zulip.zulipdev.com:9981/de/#settings";
    await page.goto(settings_url_for_german);
    await page.waitForSelector("#settings-change-box", {visible: true});
    const page_language_code = await page.evaluate(() => document.documentElement.lang);
    assert.strictEqual(page_language_code, "de");
}

async function test_default_language_setting(page: Page): Promise<void> {
    // Since the "Bots" section of Personal Settings redirects us to Organization Settings > Bots with the "Your Bots" tab preselected,
    // we need to switch back to the Personal Settings tab to proceed with further testing.
    await page.waitForSelector('.tab-switcher .ind-tab[data-tab-key="settings"]', {visible: true});
    await page.click('.tab-switcher .ind-tab[data-tab-key="settings"]');
    await page.waitForSelector("#settings_overlay_container", {visible: true});

    const preferences_section = '[data-section="preferences"]';
    await page.click(preferences_section);

    const chinese_language_data_code = "zh-hans";
    await change_language(page, chinese_language_data_code);
    // Check that the saved indicator appears
    await check_language_setting_status(page);
    await page.click(".reload_link");
    await page.waitForSelector("#default_language_widget", {
        visible: true,
    });
    await assert_language_changed_to_chinese(page);
    await test_i18n_language_precedence(page);
    await page.waitForSelector(preferences_section, {visible: true});
    await page.click(preferences_section);

    // Change the language back to English so that subsequent tests pass.
    await change_language(page, "en");

    // Check that the saved indicator appears
    await check_language_setting_status(page);
    await page.goto("http://zulip.zulipdev.com:9981/#settings"); // get back to normal language.
    await page.waitForSelector(preferences_section, {visible: true});
    await page.click(preferences_section);
    await page.waitForSelector("#user-preferences .general-settings-status", {
        visible: true,
    });
    await page.waitForSelector("#default_language_widget", {
        visible: true,
    });
}

async function test_notifications_section(page: Page): Promise<void> {
    await page.click('[data-section="notifications"]');
    // At the beginning, "DMs, mentions, and alerts"(checkbox name=enable_sounds) audio will be on
    // and "Streams"(checkbox name=enable_stream_audible_notifications) audio will be off by default.

    const notification_sound_enabled =
        "#user-notification-settings .setting_notification_sound:enabled";
    await page.waitForSelector(notification_sound_enabled, {visible: true});

    await common.fill_form(page, "#user-notification-settings .notification-settings-form", {
        enable_stream_audible_notifications: true,
        enable_sounds: false,
    });
    await page.waitForSelector(notification_sound_enabled, {visible: true});

    await common.fill_form(page, "#user-notification-settings .notification-settings-form", {
        enable_stream_audible_notifications: true,
    });
    /*
    Usually notifications sound dropdown gets disabled on disabling
    all audio notifications. But this seems flaky in tests.
    TODO: Find the right fix and enable this.

    const notification_sound_disabled = ".setting_notification_sound:disabled";
    await page.waitForSelector(notification_sound_disabled);
    */
}

async function settings_tests(page: Page): Promise<void> {
    await common.log_in(page);
    await open_settings(page);
    await close_settings_and_date_picker(page);
    await open_settings(page);
    await test_change_full_name(page);
    await test_alert_words_section(page);
    await test_your_bots_section(page);
    await test_default_language_setting(page);
    await test_notifications_section(page);
    await test_get_api_key(page);
    await test_change_password(page);
    // test_change_password should be the very last test, because it
    // replaces your session, which can lead to some nondeterministic
    // failures in test code after it, involving `GET /events`
    // returning a 401. (We reset the test database after each file).
}

common.run_test(settings_tests);
```

--------------------------------------------------------------------------------

---[FILE: stars.test.ts]---
Location: zulip-main/web/e2e-tests/stars.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

const message = "test star";

async function stars_count(page: Page): Promise<number> {
    return (await page.$$(".message-list .zulip-icon-star-filled:not(.empty-star)")).length;
}

async function toggle_test_star_message(page: Page): Promise<void> {
    const messagebox = await page.waitForSelector(
        `xpath/(//*[${common.has_class_x("message-list")}]//*[${common.has_class_x(
            "message_content",
        )} and normalize-space()="${message}"])[last()]/ancestor::*[${common.has_class_x(
            "messagebox",
        )}]`,
        {visible: true},
    );
    assert.ok(messagebox !== null);
    await messagebox.hover();

    const star_icon = await messagebox.waitForSelector(".star", {visible: true});
    assert.ok(star_icon !== null);
    await star_icon.click();
}

async function test_narrow_to_starred_messages(page: Page): Promise<void> {
    await page.click('#left-sidebar-navigation-list a[href^="#narrow/is/starred"]');
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await common.check_messages_sent(page, message_list_id, [["Verona > stars", [message]]]);

    // Go back to the combined feed view.
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const combined_feed_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${combined_feed_id}'] .message_row`,
        {visible: true},
    );
}

async function stars_test(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    let message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );
    // Assert that there is only one message list.
    assert.equal((await page.$$(".message-list")).length, 1);
    await common.send_message(page, "stream", {
        stream_name: "Verona",
        topic: "stars",
        content: message,
    });

    assert.strictEqual(await stars_count(page), 0, "Unexpected already starred message(s).");

    await toggle_test_star_message(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .zulip-icon-star-filled`,
        {visible: true},
    );
    assert.strictEqual(
        await stars_count(page),
        1,
        "Failed to ensure 1 starred message after change.",
    );

    await test_narrow_to_starred_messages(page);
    assert.strictEqual(
        await stars_count(page),
        1,
        "Message star disappeared after switching views.",
    );

    await toggle_test_star_message(page);
    assert.strictEqual(await stars_count(page), 0, "Message was not unstarred correctly.");
}

common.run_test(stars_test);
```

--------------------------------------------------------------------------------

---[FILE: stream_create.test.ts]---
Location: zulip-main/web/e2e-tests/stream_create.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function user_row_selector(page: Page, name: string): Promise<string> {
    const user_id = await common.get_user_id_from_name(page, name);
    const selector = `.settings-subscriber-row[data-user-id="${user_id}"]`;
    return selector;
}

async function await_user_visible(page: Page, name: string): Promise<void> {
    const selector = await user_row_selector(page, name);
    await page.waitForSelector(selector, {visible: true});
}

async function await_user_hidden(page: Page, name: string): Promise<void> {
    const selector = await user_row_selector(page, name);
    await page.waitForSelector(selector, {hidden: true});
}

async function add_user_to_stream(page: Page, name: string): Promise<void> {
    const user_id = await common.get_user_id_from_name(page, name);
    assert.ok(user_id !== undefined);
    await page.evaluate((user_id) => {
        zulip_test.add_user_id_to_new_stream(user_id);
    }, user_id);
    await await_user_visible(page, name);
}

async function stream_name_error(page: Page): Promise<string> {
    await page.waitForSelector("#stream_name_error", {visible: true});
    return await common.get_text_from_selector(page, "#stream_name_error");
}

async function click_create_new_stream(page: Page): Promise<void> {
    await page.click("#add_new_subscription .create_stream_button");
    await page.type("#create_stream_name", "Test Stream 1");
    await page.click("#stream_creation_go_to_subscribers");
    await page.waitForSelector(".finalize_create_stream", {visible: true});

    // sanity check that desdemona is the initial subsscriber
    await await_user_visible(page, "desdemona");
}

async function clear_ot_filter_with_backspace(page: Page): Promise<void> {
    await page.click(".add-user-list-filter");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
}

async function test_user_filter_ui(page: Page): Promise<void> {
    await page.waitForSelector("form#stream_creation_form", {visible: true});
    // Desdemona should be there by default
    await await_user_visible(page, "desdemona");

    await add_user_to_stream(page, common.fullname.cordelia);
    await add_user_to_stream(page, common.fullname.othello);

    await page.type(`form#stream_creation_form [name="user_list_filter"]`, "ot", {delay: 100});
    await page.waitForSelector("#create_stream_subscribers", {visible: true});
    // Wait until filtering is completed.
    await page.waitForFunction(
        () =>
            document.querySelectorAll("#create_stream_subscribers .remove_potential_subscriber")
                .length === 1,
    );

    await await_user_hidden(page, common.fullname.cordelia);
    await await_user_hidden(page, "desdemona");
    await await_user_visible(page, common.fullname.othello);

    // Clear the filter.
    await clear_ot_filter_with_backspace(page);

    await await_user_visible(page, common.fullname.cordelia);
    await await_user_visible(page, "desdemona");
    await await_user_visible(page, common.fullname.othello);
}

async function create_stream(page: Page): Promise<void> {
    await page.click("#stream_creation_go_to_configure_channel_settings");
    await page.waitForSelector('xpath///*[text()="Configure new channel settings"]', {
        visible: true,
    });

    await common.fill_form(page, "form#stream_creation_form", {
        stream_name: "Puppeteer",
        stream_description: "Everything Puppeteer",
    });
    await page.click("#stream_creation_go_to_subscribers");
    await page.type("#create_stream_name", "Test Stream 2");
    await page.click("form#stream_creation_form .finalize_create_stream");

    // We redirect to the channel message view.
    await page.waitForSelector("#subscription_overlay", {hidden: true});
    await page.waitForSelector(
        `xpath///*[${common.has_class_x("message-header-navbar-title")} and text()="Puppeteer"]`,
    );

    await page.waitForSelector(".message-header-stream-settings-button");
    await page.click(".message-header-stream-settings-button");
    await page.waitForSelector(".stream_section");
    await page.waitForSelector(
        `xpath///*[${common.has_class_x("stream-name-title")} and text()="Puppeteer"]`,
        {visible: true},
    );
    const stream_name = await common.get_text_from_selector(
        page,
        ".stream-header .stream-name .sub-stream-name",
    );
    const stream_description = await common.get_text_from_selector(
        page,
        ".stream-description .sub-stream-description",
    );
    assert.strictEqual(stream_name, "Puppeteer");
    assert.strictEqual(stream_description, "Everything Puppeteer");

    // Assert subscriber count becomes 3 (cordelia, desdemona, othello)
    await page.waitForSelector(
        `xpath///*[@data-stream-name="Puppeteer"]//*[${common.has_class_x(
            "subscriber-count",
        )} and normalize-space()="3"]`,
    );
}

async function test_streams_with_empty_names_cannot_be_created(page: Page): Promise<void> {
    await page.click("#add_new_subscription .create_stream_button");
    await page.waitForSelector("form#stream_creation_form", {visible: true});
    await common.fill_form(page, "form#stream_creation_form", {stream_name: "  "});
    await page.click("form#stream_creation_form button#stream_creation_go_to_subscribers");
    assert.strictEqual(await stream_name_error(page), "Choose a name for the new channel.");
}

async function test_streams_with_duplicate_names_cannot_be_created(page: Page): Promise<void> {
    await common.fill_form(page, "form#stream_creation_form", {stream_name: "Puppeteer"});
    await page.click("form#stream_creation_form button#stream_creation_go_to_subscribers");
    assert.strictEqual(await stream_name_error(page), "A channel with this name already exists.");

    const cancel_button_selector = "form#stream_creation_form button.create_stream_cancel";
    await page.click(cancel_button_selector);
}

async function test_stream_creation(page: Page): Promise<void> {
    await click_create_new_stream(page);
    await test_user_filter_ui(page);
    await create_stream(page);
    await test_streams_with_empty_names_cannot_be_created(page);
    await test_streams_with_duplicate_names_cannot_be_created(page);
}

async function test_streams_search_feature(page: Page): Promise<void> {
    assert.strictEqual(await common.get_text_from_selector(page, "#search_stream_name"), "");
    const hidden_streams_selector = ".stream-row.notdisplayed .stream-name";
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            '.stream-row[data-stream-name="Verona"] .stream-name',
        ),
        "Verona",
    );
    assert.ok(
        !(await common.get_text_from_selector(page, hidden_streams_selector)).includes("Verona"),
        "#Verona is hidden",
    );

    await page.type('#stream_filter input[type="text"]', "Puppeteer");
    await page.waitForSelector(".stream-row[data-stream-name='core team']", {hidden: true});
    assert.strictEqual(
        await common.get_text_from_selector(page, ".stream-row:not(.notdisplayed) .stream-name"),
        "Puppeteer",
    );
    assert.ok(
        (await common.get_text_from_selector(page, hidden_streams_selector)).includes("Verona"),
        "#Verona is not hidden",
    );
    assert.ok(
        !(await common.get_text_from_selector(page, hidden_streams_selector)).includes("Puppeteer"),
        "Puppeteer is hidden after searching.",
    );
}

async function subscriptions_tests(page: Page): Promise<void> {
    await common.log_in(page);
    await common.open_streams_modal(page);
    await test_stream_creation(page);
    await test_streams_search_feature(page);
}

common.run_test(subscriptions_tests);
```

--------------------------------------------------------------------------------

---[FILE: subscribe_toggle.test.ts]---
Location: zulip-main/web/e2e-tests/subscribe_toggle.test.ts

```typescript
import type {ElementHandle, Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function test_subscription_button(page: Page): Promise<void> {
    const all_stream_selector = "[data-tab-key='all-streams']";
    await page.waitForSelector(all_stream_selector, {visible: true});
    await page.click(all_stream_selector);
    const stream_selector = "[data-stream-name='Venice']";
    const button_selector = `${stream_selector} .sub_unsub_button`;
    const subscribed_selector = `${button_selector}.checked`;
    const unsubscribed_selector = `${button_selector}:not(.checked)`;

    async function subscribed(): Promise<ElementHandle | null> {
        await page.waitForSelector(
            `xpath///*[${common.has_class_x("stream_settings_header")}]//*[${common.has_class_x(
                "sub_unsub_button",
            )} and normalize-space()="Unsubscribe"]`,
        );
        return await page.waitForSelector(subscribed_selector, {visible: true});
    }

    async function unsubscribed(): Promise<ElementHandle | null> {
        await page.waitForSelector(
            `xpath///*[${common.has_class_x("stream_settings_header")}]//*[${common.has_class_x(
                "sub_unsub_button",
            )} and normalize-space()="Subscribe"]`,
        );
        return await page.waitForSelector(unsubscribed_selector, {visible: true});
    }

    // Make sure that Venice is even in our list of streams.
    await page.waitForSelector(stream_selector, {visible: true});
    await page.waitForSelector(button_selector, {visible: true});

    await page.click(stream_selector);

    // Note that we intentionally re-find the button after each click, since
    // the live-update code may replace the whole row.
    // We assume Venice is already subscribed, so the first line here
    // should happen immediately.
    await (await subscribed())!.click();
    await (await unsubscribed())!.click();
    await (await subscribed())!.click();
    await (await unsubscribed())!.click();
    await subscribed();
}

async function subscriptions_tests(page: Page): Promise<void> {
    await common.log_in(page);
    await common.open_streams_modal(page);
    await test_subscription_button(page);
}

common.run_test(subscriptions_tests);
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 568
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 568 of 1290)

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

---[FILE: copy-messages.test.ts]---
Location: zulip-main/web/e2e-tests/copy-messages.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function copy_messages(
    page: Page,
    start_message: string,
    end_message: string,
): Promise<string[]> {
    return await page.evaluate(
        (start_message: string, end_message: string) => {
            function get_message_node(message: string): Element {
                return [...document.querySelectorAll(".message-list .message_content")].find(
                    (node) => node.textContent?.trim() === message,
                )!;
            }

            // select messages from start_message to end_message
            const selectedRange = document.createRange();
            selectedRange.setStartAfter(get_message_node(start_message));
            selectedRange.setEndBefore(get_message_node(end_message));
            window.getSelection()!.removeAllRanges();
            window.getSelection()!.addRange(selectedRange);

            // emulate copy event
            const clipboard_data = new DataTransfer();
            const copy_event = new ClipboardEvent("copy", {
                bubbles: true,
                cancelable: true,
                clipboardData: clipboard_data,
            });
            document.dispatchEvent(copy_event);

            const copied_html = clipboard_data.getData("text/html");

            // Convert the copied HTML into separate message strings
            const parser = new DOMParser();
            const doc = parser.parseFromString(copied_html, "text/html");

            return [...doc.body.children].map((el) => el.textContent.trim());
        },
        start_message,
        end_message,
    );
}

async function test_copying_first_message_from_topic(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test C", "copy paste test C");
    const expected_copied_lines: string[] = [];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_last_message_from_topic(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test E", "copy paste test E");
    const expected_copied_lines: string[] = [];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_first_two_messages_from_topic(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test C", "copy paste test D");
    const expected_copied_lines = ["Desdemona: copy paste test C", "Desdemona: copy paste test D"];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_all_messages_from_topic(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test C", "copy paste test E");
    const expected_copied_lines = [
        "Desdemona: copy paste test C",
        "Desdemona: copy paste test D",
        "Desdemona: copy paste test E",
    ];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_last_from_prev_first_from_next(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test B", "copy paste test C");
    const expected_copied_lines = [
        "Verona > copy-paste-topic #1 Today",
        "Desdemona: copy paste test B",
        "Verona > copy-paste-topic #2 Today",
        "Desdemona: copy paste test C",
    ];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_last_from_prev_all_from_next(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test B", "copy paste test E");
    const expected_copied_lines = [
        "Verona > copy-paste-topic #1 Today",
        "Desdemona: copy paste test B",
        "Verona > copy-paste-topic #2 Today",
        "Desdemona: copy paste test C",
        "Desdemona: copy paste test D",
        "Desdemona: copy paste test E",
    ];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_all_from_prev_first_from_next(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test A", "copy paste test C");
    const expected_copied_lines = [
        "Verona > copy-paste-topic #1 Today",
        "Desdemona: copy paste test A",
        "Desdemona: copy paste test B",
        "Verona > copy-paste-topic #2 Today",
        "Desdemona: copy paste test C",
    ];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function test_copying_messages_from_several_topics(page: Page): Promise<void> {
    const actual_copied_lines = await copy_messages(page, "copy paste test B", "copy paste test F");
    const expected_copied_lines = [
        "Verona > copy-paste-topic #1 Today",
        "Desdemona: copy paste test B",
        "Verona > copy-paste-topic #2 Today",
        "Desdemona: copy paste test C",
        "Desdemona: copy paste test D",
        "Desdemona: copy paste test E",
        "Verona > copy-paste-topic #3 Today",
        "Desdemona: copy paste test F",
    ];
    assert.deepStrictEqual(actual_copied_lines, expected_copied_lines);
}

async function copy_paste_test(page: Page): Promise<void> {
    await common.log_in(page);
    await common.send_multiple_messages(page, [
        {stream_name: "Verona", topic: "copy-paste-topic #1", content: "copy paste test A"},

        {stream_name: "Verona", topic: "copy-paste-topic #1", content: "copy paste test B"},

        {stream_name: "Verona", topic: "copy-paste-topic #2", content: "copy paste test C"},

        {stream_name: "Verona", topic: "copy-paste-topic #2", content: "copy paste test D"},

        {stream_name: "Verona", topic: "copy-paste-topic #2", content: "copy paste test E"},

        {stream_name: "Verona", topic: "copy-paste-topic #3", content: "copy paste test F"},

        {stream_name: "Verona", topic: "copy-paste-topic #3", content: "copy paste test G"},
    ]);

    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > copy-paste-topic #1", ["copy paste test A", "copy paste test B"]],
        [
            "Verona > copy-paste-topic #2",
            ["copy paste test C", "copy paste test D", "copy paste test E"],
        ],
        ["Verona > copy-paste-topic #3", ["copy paste test F", "copy paste test G"]],
    ]);
    console.log("Messages were sent successfully");

    await test_copying_first_message_from_topic(page);
    await test_copying_last_message_from_topic(page);
    await test_copying_first_two_messages_from_topic(page);
    await test_copying_all_messages_from_topic(page);
    await test_copying_last_from_prev_first_from_next(page);
    await test_copying_last_from_prev_all_from_next(page);
    await test_copying_all_from_prev_first_from_next(page);
    await test_copying_messages_from_several_topics(page);
}

common.run_test(copy_paste_test);
```

--------------------------------------------------------------------------------

---[FILE: custom-profile.test.ts]---
Location: zulip-main/web/e2e-tests/custom-profile.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

// This will be the row of the custom profile field we add.
const profile_field_row = "#admin_profile_fields_table tr:nth-last-child(1)";

async function test_add_new_profile_field(page: Page): Promise<void> {
    await page.click("#add-custom-profile-field-button");
    await common.wait_for_micromodal_to_open(page);
    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Add a new custom profile field",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Add",
    );
    await page.waitForSelector(".admin-profile-field-form", {visible: true});
    await common.fill_form(page, "form.admin-profile-field-form", {
        field_type: "1",
        name: "Teams",
    });
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector(
        'xpath///*[@id="admin_profile_fields_table"]//tr[last()]/td[normalize-space()="Teams"]',
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, `${profile_field_row} span.profile_field_type`),
        "Text (short)",
    );
}

async function test_edit_profile_field(page: Page): Promise<void> {
    await page.click(`${profile_field_row} button.open-edit-form-modal`);
    await common.wait_for_micromodal_to_open(page);
    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Edit custom profile field",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Save changes",
    );
    await common.fill_form(page, "form.name-setting", {
        name: "team",
    });
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector(
        'xpath///*[@id="admin_profile_fields_table"]//tr[last()]/td[normalize-space()="team"]',
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, `${profile_field_row} span.profile_field_type`),
        "Text (short)",
    );
}

async function test_delete_custom_profile_field(page: Page): Promise<void> {
    await page.click(`${profile_field_row} button.delete`);
    await common.wait_for_micromodal_to_open(page);
    assert.strictEqual(
        await common.get_text_from_selector(page, ".dialog_heading"),
        "Delete custom profile field?",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".micromodal .dialog_submit_button"),
        "Confirm",
    );
    await page.click(".micromodal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector("#admin-profile-field-status img", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(page, "div#admin-profile-field-status"),
        "Saved",
    );
}

async function test_custom_profile(page: Page): Promise<void> {
    await common.log_in(page);
    await common.manage_organization(page);

    console.log("Testing custom profile fields");
    await page.click("li[data-section='profile-field-settings']");

    await test_add_new_profile_field(page);
    await test_edit_profile_field(page);
    await test_delete_custom_profile_field(page);
}

common.run_test(test_custom_profile);
```

--------------------------------------------------------------------------------

---[FILE: delete-message.test.ts]---
Location: zulip-main/web/e2e-tests/delete-message.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function click_delete_and_return_last_msg_id(page: Page): Promise<string> {
    const msg = (await page.$$(".message-list .message_row")).at(-1);
    assert.ok(msg !== undefined);
    const id = await (await msg.getProperty("id")).jsonValue();
    await msg.hover();
    const info = await page.waitForSelector(
        `#${CSS.escape(id)} .message_control_button.actions_hover`,
        {visible: true},
    );
    assert.ok(info !== null);
    await info.click();
    await page.waitForSelector(".delete_message", {visible: true});
    await page.click(".delete_message");
    return id;
}

async function delete_message_test(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );
    // Assert that there is only one message list.
    assert.equal((await page.$$(".message-list")).length, 1);
    const messages_quantity = (await page.$$(".message-list .message_row")).length;
    const last_message_id = await click_delete_and_return_last_msg_id(page);

    await common.wait_for_micromodal_to_open(page);
    await page.evaluate(() => {
        document.querySelector<HTMLButtonElement>(".dialog_submit_button")?.click();
    });
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector(`#${CSS.escape(last_message_id)}`, {hidden: true});
    assert.equal((await page.$$(".message-list .message_row")).length, messages_quantity - 1);
}

common.run_test(delete_message_test);
```

--------------------------------------------------------------------------------

---[FILE: drafts.test.ts]---
Location: zulip-main/web/e2e-tests/drafts.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function wait_for_drafts_to_disappear(page: Page): Promise<void> {
    await page.waitForSelector("#draft_overlay.show", {hidden: true});
}

async function wait_for_drafts_to_appear(page: Page): Promise<void> {
    await page.waitForSelector("#draft_overlay.show");
}

async function get_drafts_count(page: Page): Promise<number> {
    return await page.$$eval("#drafts_table .overlay-message-row", (drafts) => drafts.length);
}

const drafts_button = ".top_left_drafts";
const drafts_overlay = "#draft_overlay";

async function test_empty_drafts(page: Page): Promise<void> {
    await page.waitForSelector(drafts_button, {visible: true});
    await page.click(drafts_button);

    await wait_for_drafts_to_appear(page);
    await page.waitForSelector(drafts_overlay, {visible: true});
    assert.strictEqual(await common.get_text_from_selector(page, ".drafts-list"), "No drafts.");

    await page.click(`${drafts_overlay} .exit`);
    await wait_for_drafts_to_disappear(page);
}

async function create_stream_message_draft(page: Page): Promise<void> {
    console.log("Creating stream message draft");
    await page.keyboard.press("KeyC");
    await page.waitForSelector("#stream_message_recipient_topic", {visible: true});
    await common.select_stream_in_compose_via_dropdown(page, "Denmark");
    await common.fill_form(page, "form#send_message_form", {
        content: "Test stream message.",
    });
    await page.type("#stream_message_recipient_topic", "tests", {delay: 100});
    await page.click("#compose_close");
}

async function test_restore_stream_message_draft_by_opening_compose_box(page: Page): Promise<void> {
    await page.click(".search_icon");
    await page.waitForSelector("#search_query", {visible: true});
    await common.clear_and_type(page, "#search_query", "stream:Denmark topic:tests");
    await page.keyboard.press("Enter");
    // Wait for narrow to complete.
    const wait_for_change = true;
    await common.get_current_msg_list_id(page, wait_for_change);
    await page.keyboard.press("Enter");

    await page.click("#left_bar_compose_reply_button_big");
    await page.waitForSelector("#send_message_form", {visible: true});

    await common.check_compose_state(page, {
        stream_name: "Denmark",
        topic: "tests",
        content: "Test stream message. ",
    });
    await page.click("#compose_close");
    await page.waitForSelector("#send_message_form", {visible: false});
}

async function create_private_message_draft(page: Page): Promise<void> {
    console.log("Creating direct message draft");
    await page.keyboard.press("KeyX");
    await page.waitForSelector("#private_message_recipient", {visible: true});
    await common.fill_form(page, "form#send_message_form", {content: "Test direct message."});
    await common.pm_recipient.set(page, "cordelia@zulip.com");
    await common.pm_recipient.set(page, "hamlet@zulip.com");
}

async function test_restore_private_message_draft_by_opening_composebox(page: Page): Promise<void> {
    await page.click("#left_bar_compose_reply_button_big");
    await page.waitForSelector("#private_message_recipient", {visible: true});

    await common.check_form_contents(page, "form#send_message_form", {
        content: "Test direct message. ",
    });
    await page.click("#compose_close");
    await page.waitForSelector("#private_message_recipient", {visible: false});
}

async function open_compose_markdown_preview(page: Page): Promise<void> {
    const new_conversation_button = "#new_conversation_button";
    await page.waitForSelector(new_conversation_button, {visible: true});
    await page.click(new_conversation_button);

    const markdown_preview_button = "#compose .markdown_preview"; // eye icon.
    await page.waitForSelector(markdown_preview_button, {visible: true});
    await page.click(markdown_preview_button);
}

async function open_drafts_after_markdown_preview(page: Page): Promise<void> {
    await open_compose_markdown_preview(page);
    await page.waitForSelector(drafts_button, {visible: true});
    await page.click(drafts_button);
    await wait_for_drafts_to_appear(page);
}

async function test_previously_created_drafts_rendered(page: Page): Promise<void> {
    const drafts_count = await get_drafts_count(page);
    assert.strictEqual(drafts_count, 2, "Drafts improperly loaded.");
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_header_stream .stream_label",
        ),
        "Denmark",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_header_stream .stream_topic",
        ),
        "tests",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .private-message .rendered_markdown.restore-overlay-message",
        ),
        "Test direct message.",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_header_private_message .stream_label",
        ),
        "You and Cordelia, Lear's daughter, King Hamlet",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_row:not(.private-message) .rendered_markdown.restore-overlay-message",
        ),
        "Test stream message.",
    );
}

async function test_restore_message_draft_via_draft_overlay(page: Page): Promise<void> {
    console.log("Restoring stream message draft");
    await page.click("#drafts_table .message_row:not(.private-message) .restore-overlay-message");
    await wait_for_drafts_to_disappear(page);
    await page.waitForSelector("#stream_message_recipient_topic", {visible: true});
    await page.waitForSelector("#preview_message_area", {hidden: true});
    await common.check_compose_state(page, {
        stream_name: "Denmark",
        topic: "tests",
        content: "Test stream message.",
    });
    assert.strictEqual(
        await common.get_text_from_selector(page, "title"),
        "#Denmark > tests - Zulip Dev - Zulip",
        "Didn't narrow to the right topic.",
    );
}

async function edit_stream_message_draft(page: Page): Promise<void> {
    await common.select_stream_in_compose_via_dropdown(page, "Denmark");
    await common.fill_form(page, "form#send_message_form", {
        content: "Updated stream message",
    });
    await page.click("#compose_close");
}

async function test_edited_draft_message(page: Page): Promise<void> {
    await page.waitForSelector(drafts_button, {visible: true});
    await page.click(drafts_button);

    await wait_for_drafts_to_appear(page);
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_header_stream .stream_label",
        ),
        "Denmark",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_header_stream .stream_topic",
        ),
        "tests",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_row:not(.private-message) .rendered_markdown.restore-overlay-message",
        ),
        "Updated stream message",
    );
}

async function test_restore_private_message_draft_via_draft_overlay(page: Page): Promise<void> {
    console.log("Restoring direct message draft.");
    await page.click(".message_row.private-message .restore-overlay-message");
    await wait_for_drafts_to_disappear(page);
    await page.waitForSelector("#compose-direct-recipient", {visible: true});
    await common.check_compose_state(page, {
        content: "Test direct message.",
    });
    const cordelia_internal_email = await common.get_internal_email_from_name(
        page,
        common.fullname.cordelia,
    );
    const hamlet_internal_email = await common.get_internal_email_from_name(
        page,
        common.fullname.hamlet,
    );
    await common.pm_recipient.expect(page, `${cordelia_internal_email},${hamlet_internal_email}`);
    assert.strictEqual(
        await common.get_text_from_selector(page, "title"),
        "Cordelia, Lear's daughter and King Hamlet - Zulip Dev - Zulip",
        "Didn't narrow to the direct messages with cordelia and hamlet",
    );
    await page.click("#compose_close");
}

async function test_delete_draft(page: Page): Promise<void> {
    console.log("Deleting draft");
    await page.waitForSelector(drafts_button, {visible: true});
    await page.click(drafts_button);
    await wait_for_drafts_to_appear(page);
    await page.click("#drafts_table .message_row.private-message .delete-overlay-message");
    const drafts_count = await get_drafts_count(page);
    assert.strictEqual(drafts_count, 1, "Draft not deleted.");
    await page.waitForSelector("#drafts_table .message_row.private-message", {hidden: true});
    await page.click(`${drafts_overlay} .exit`);
    await wait_for_drafts_to_disappear(page);
    await page.click("body");
}

async function test_save_draft_by_reloading(page: Page): Promise<void> {
    console.log("Saving draft by reloading.");
    await page.keyboard.press("KeyX");
    await page.waitForSelector("#compose-direct-recipient", {visible: true});
    await common.fill_form(page, "form#send_message_form", {
        content: "Test direct message draft.",
    });
    await common.pm_recipient.set(page, "cordelia@zulip.com");
    await page.reload();

    // Reloading into a direct messages narrow opens compose box.
    await page.waitForSelector("#compose-textarea", {visible: true});
    await page.click("#compose_close");

    console.log("Reloading finished. Opening drafts again now.");
    await page.waitForSelector(drafts_button, {visible: true});
    await page.click(drafts_button);

    console.log("Checking drafts survived after the reload");
    await wait_for_drafts_to_appear(page);
    const drafts_count = await get_drafts_count(page);
    assert.strictEqual(drafts_count, 2, "All drafts aren't loaded.");
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row .message_header_private_message .stream_label",
        ),
        "You and Cordelia, Lear's daughter",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            "#drafts_table .overlay-message-row:nth-last-child(2) .rendered_markdown.restore-overlay-message",
        ),
        "Test direct message draft.",
    );
}

async function test_delete_draft_on_clearing_text(page: Page): Promise<void> {
    console.log("Deleting draft by clearing compose box textarea.");
    await page.click("#drafts_table .message_row:not(.private-message) .restore-overlay-message");
    await wait_for_drafts_to_disappear(page);
    await page.waitForSelector("#send_message_form", {visible: true});
    await common.fill_form(page, "form#send_message_form", {content: ""});
    await page.click("#compose_close");
    await page.waitForSelector("#send_message_form", {hidden: true});
    await page.click(drafts_button);
    await wait_for_drafts_to_appear(page);
    const drafts_count = await get_drafts_count(page);
    assert.strictEqual(drafts_count, 1, "Draft not deleted.");
}

async function drafts_test(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );

    await test_empty_drafts(page);

    await create_stream_message_draft(page);
    await test_restore_stream_message_draft_by_opening_compose_box(page);

    // Send a private message so that the draft we create is
    // for an existing conversation.
    await common.send_message(page, "private", {
        recipient: "cordelia@zulip.com, hamlet@zulip.com",
        content: "howdy doo",
    });
    await create_private_message_draft(page);
    // Close and try restoring it by opening the composebox again.
    await page.click("#compose_close");
    await test_restore_private_message_draft_by_opening_composebox(page);

    await open_drafts_after_markdown_preview(page);
    await test_previously_created_drafts_rendered(page);

    await test_restore_message_draft_via_draft_overlay(page);
    await edit_stream_message_draft(page);
    await test_edited_draft_message(page);

    await test_restore_private_message_draft_via_draft_overlay(page);
    await test_delete_draft(page);
    await test_save_draft_by_reloading(page);
    await test_delete_draft_on_clearing_text(page);
}

common.run_test(drafts_test);
```

--------------------------------------------------------------------------------

---[FILE: edit.test.ts]---
Location: zulip-main/web/e2e-tests/edit.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function trigger_edit_last_message(page: Page): Promise<void> {
    const msg = (await page.$$(".message-list .message_row")).at(-1);
    assert.ok(msg !== undefined);
    const id = await (await msg.getProperty("id")).jsonValue();
    await msg.hover();
    const info = await page.waitForSelector(
        `#${CSS.escape(id)} .message_control_button.actions_hover`,
        {visible: true},
    );
    assert.ok(info !== null);
    await info.click();
    await page.waitForSelector(".popover_edit_message", {visible: true});
    await page.click(".popover_edit_message");
    await page.waitForSelector(".message_edit_content", {visible: true});
}

async function edit_stream_message(page: Page, content: string): Promise<void> {
    await trigger_edit_last_message(page);

    await common.clear_and_type(page, ".message_edit_content", content);
    await page.click(".message_edit_save");

    await common.wait_for_fully_processed_message(page, content);
}

async function test_stream_message_edit(page: Page): Promise<void> {
    await common.send_message(page, "stream", {
        stream_name: "Verona",
        topic: "edits",
        content: "test editing",
    });

    await edit_stream_message(page, "test edited");

    const message_list_id = await common.get_current_msg_list_id(page, false);
    await common.check_messages_sent(page, message_list_id, [["Verona > edits", ["test edited"]]]);
}

async function test_edit_message_with_slash_me(page: Page): Promise<void> {
    const last_message_xpath = `(//*[${common.has_class_x("message-list")}]//*[${common.has_class_x(
        "messagebox",
    )}])[last()]`;

    await common.send_message(
        page,
        "stream",
        {
            stream_name: "Verona",
            topic: "edits",
            content: "/me test editing a message with me",
        },
        // We already narrow in test_stream_message_edit.
        false,
    );
    await page.waitForSelector(
        `xpath/${last_message_xpath}//*[${common.has_class_x(
            "status-message",
        )} and text()="test editing a message with me"]`,
    );
    await page.waitForSelector(
        `xpath/${last_message_xpath}//*[${common.has_class_x(
            "sender_name",
        )} and normalize-space()="Desdemona"]`,
    );

    await edit_stream_message(page, "/me test edited a message with me");

    await page.waitForSelector(
        `xpath/${last_message_xpath}//*[${common.has_class_x(
            "status-message",
        )} and text()="test edited a message with me"]`,
    );
    await page.waitForSelector(
        `xpath/${last_message_xpath}//*[${common.has_class_x(
            "sender_name",
        )} and normalize-space()="Desdemona"]`,
    );
}

async function test_edit_private_message(page: Page): Promise<void> {
    await common.send_message(page, "private", {
        recipient: "cordelia@zulip.com",
        content: "test editing pm",
    });
    await trigger_edit_last_message(page);

    await common.clear_and_type(page, ".message_edit_content", "test edited pm");
    await page.click(".message_edit_save");
    await common.wait_for_fully_processed_message(page, "test edited pm");

    const message_list_id = await common.get_current_msg_list_id(page, false);
    await common.check_messages_sent(page, message_list_id, [
        ["You and Cordelia, Lear's daughter", ["test edited pm"]],
    ]);
}

async function edit_tests(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );

    await test_stream_message_edit(page);
    await test_edit_message_with_slash_me(page);
    await test_edit_private_message(page);
}

common.run_test(edit_tests);
```

--------------------------------------------------------------------------------

---[FILE: mention.test.ts]---
Location: zulip-main/web/e2e-tests/mention.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function test_mention(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    let message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );
    await page.keyboard.press("KeyC");
    await page.waitForSelector("#compose", {visible: true});

    await common.select_stream_in_compose_via_dropdown(page, "Verona");
    await common.fill_form(page, 'form[action^="/json/messages"]', {
        stream_message_recipient_topic: "Test mention all",
    });
    await common.select_item_via_typeahead(page, "#compose-textarea", "@**all", "all");
    await common.ensure_enter_does_not_send(page);

    console.log("Checking for all everyone warning");
    const stream_size = await page.evaluate(() =>
        zulip_test.get_subscriber_count(zulip_test.get_sub("Verona")!.stream_id),
    );
    const threshold = await page.evaluate(() => {
        zulip_test.set_wildcard_mention_threshold(5);
        return zulip_test.wildcard_mention_threshold;
    });
    assert.ok(stream_size > threshold);
    await page.click("#compose-send-button");

    await page.waitForSelector("#compose_banners .wildcard_warning", {visible: true});
    await page.click("#compose_banners .wildcard_warning .main-view-banner-action-button");
    await page.waitForSelector(".wildcard_warning", {hidden: true});

    message_list_id = await common.get_current_msg_list_id(page, true);
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > Test mention all", ["@all"]],
    ]);
}

common.run_test(test_mention);
```

--------------------------------------------------------------------------------

````

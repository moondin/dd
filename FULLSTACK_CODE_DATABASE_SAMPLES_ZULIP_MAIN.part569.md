---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 569
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 569 of 1290)

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

---[FILE: message-basics.test.ts]---
Location: zulip-main/web/e2e-tests/message-basics.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function get_stream_li(page: Page, stream_name: string): Promise<string> {
    const stream_id = await common.get_stream_id(page, stream_name);
    assert.ok(stream_id !== undefined);
    return `#stream_filters .narrow-filter[data-stream-id="${CSS.escape(stream_id.toString())}"]`;
}

async function expect_home(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    // Assert that there is only one message list.
    assert.equal((await page.$$(".message-list")).length, 1);
    assert.strictEqual(await page.title(), "Combined feed - Zulip Dev - Zulip");
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > test", ["verona test a", "verona test b"]],
        ["Verona > other topic", ["verona other topic c"]],
        ["Denmark > test", ["denmark message"]],
        [
            "You and Cordelia, Lear's daughter, King Hamlet",
            ["group direct message a", "group direct message b"],
        ],
        ["You and Cordelia, Lear's daughter", ["direct message c"]],
        ["Verona > test", ["verona test d"]],
        ["You and Cordelia, Lear's daughter, King Hamlet", ["group direct message d"]],
        ["You and Cordelia, Lear's daughter", ["direct message e"]],
    ]);
}

async function expect_verona_stream_top_topic(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > test", ["verona test a", "verona test b", "verona test d"]],
    ]);
    assert.strictEqual(await page.title(), "#Verona > test - Zulip Dev - Zulip");
}

async function expect_verona_stream(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > test", ["verona test a", "verona test b"]],
        ["Verona > other topic", ["verona other topic c"]],
        ["Verona > test", ["verona test d"]],
    ]);
    assert.strictEqual(await page.title(), "#Verona - Zulip Dev - Zulip");
}

async function expect_verona_stream_test_topic(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > test", ["verona test a", "verona test b", "verona test d"]],
    ]);
    assert.strictEqual(
        await common.get_text_from_selector(page, "#new_conversation_button"),
        "Start new conversation",
    );
}

async function expect_verona_other_topic(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > other topic", ["verona other topic c"]],
    ]);
}

async function expect_test_topic(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        ["Verona > test", ["verona test a", "verona test b"]],
        ["Denmark > test", ["denmark message"]],
        ["Verona > test", ["verona test d"]],
    ]);
}

async function expect_group_direct_messages(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        [
            "You and Cordelia, Lear's daughter, King Hamlet",
            ["group direct message a", "group direct message b", "group direct message d"],
        ],
    ]);
    assert.strictEqual(
        await page.title(),
        "Cordelia, Lear's daughter, King Hamlet - Zulip Dev - Zulip",
    );
}

async function expect_cordelia_direct_messages(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        ["You and Cordelia, Lear's daughter", ["direct message c", "direct message e"]],
    ]);
}

async function un_narrow(page: Page): Promise<void> {
    if ((await (await page.$(".message_comp"))!.boundingBox())?.height) {
        await page.keyboard.press("Escape");
    }
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
}

async function un_narrow_by_clicking_org_icon(page: Page): Promise<void> {
    await page.click(".brand");
}

async function expect_recent_view(page: Page): Promise<void> {
    await page.waitForSelector("#recent_view_table", {visible: true});
    assert.strictEqual(await page.title(), "Recent conversations - Zulip Dev - Zulip");
}

async function test_navigations_from_home(page: Page): Promise<void> {
    return; // No idea why this is broken.
    console.log("Narrowing by clicking stream");
    await page.click(`.focused-message-list [title='Narrow to stream "Verona"']`);
    await expect_verona_stream(page);

    assert.strictEqual(await page.title(), "#Verona - Zulip Dev - Zulip");
    await un_narrow(page);
    await expect_home(page);

    console.log("Narrowing by clicking topic");
    await page.click(`.focused-message-list [title='Narrow to stream "Verona", topic "test"']`);
    await expect_verona_stream_test_topic(page);

    await un_narrow(page);
    await expect_home(page);

    return; // TODO: rest of this test seems nondeterministically broken
    console.log("Narrowing by clicking group personal header");
    await page.click(
        `.focused-message-list [title="Narrow to your direct messages with Cordelia, Lear's daughter, King Hamlet"]`,
    );
    await expect_group_direct_messages(page);

    await un_narrow(page);
    await expect_home(page);

    await page.click(
        `.focused-message-list [title="Narrow to your direct messages with Cordelia, Lear's daughter, King Hamlet"]`,
    );
    await un_narrow_by_clicking_org_icon(page);
    await expect_recent_view(page);
}

async function search_and_check(
    page: Page,
    search_str: string,
    item_to_select: string,
    check: (page: Page) => Promise<void>,
    expected_narrow_title: string,
): Promise<void> {
    await page.click(".search_icon");
    await page.waitForSelector(".navbar-search.expanded", {visible: true});
    await common.select_item_via_typeahead(page, "#search_query", search_str, item_to_select);
    // Enter to trigger search
    await page.keyboard.press("Enter");
    await check(page);
    assert.strictEqual(await page.title(), expected_narrow_title);
    await un_narrow(page);
    await expect_home(page);
}

async function search_silent_user(page: Page, str: string, item: string): Promise<void> {
    await page.click(".search_icon");
    await page.waitForSelector(".navbar-search.expanded", {visible: true});
    await common.select_item_via_typeahead(page, "#search_query", str, item);
    // Enter to trigger search
    await page.keyboard.press("Enter");
    await page.waitForSelector(".empty_feed_notice", {visible: true});
    const expect_message = "You haven't received any messages sent by Email Gateway yet.";
    assert.strictEqual(
        await common.get_text_from_selector(page, ".empty_feed_notice"),
        expect_message,
    );
    await common.get_current_msg_list_id(page, true);
    await un_narrow(page);
    await expect_home(page);
}

async function search_tests(page: Page): Promise<void> {
    await search_and_check(
        page,
        "Verona",
        "#Verona",
        expect_verona_stream,
        "#Verona - Zulip Dev - Zulip",
    );

    await search_and_check(
        page,
        "Cordelia",
        "dm:",
        expect_cordelia_direct_messages,
        "Cordelia, Lear's daughter - Zulip Dev - Zulip",
    );

    await search_and_check(
        page,
        "stream:Verona",
        "",
        expect_verona_stream,
        "#Verona - Zulip Dev - Zulip",
    );

    await search_and_check(
        page,
        "stream:Verona topic:test",
        "",
        expect_verona_stream_test_topic,
        "#Verona > test - Zulip Dev - Zulip",
    );

    await search_and_check(
        page,
        "stream:Verona topic:other+topic",
        "",
        expect_verona_other_topic,
        "#Verona > other topic - Zulip Dev - Zulip",
    );

    await search_and_check(
        page,
        "topic:test",
        "",
        expect_test_topic,
        "Search results - Zulip Dev - Zulip",
    );

    await search_silent_user(page, "sender:emailgateway@zulip.com", "");
}

async function expect_all_direct_messages(page: Page): Promise<void> {
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });
    await common.check_messages_sent(page, message_list_id, [
        [
            "You and Cordelia, Lear's daughter, King Hamlet",
            ["group direct message a", "group direct message b"],
        ],
        ["You and Cordelia, Lear's daughter", ["direct message c"]],
        ["You and Cordelia, Lear's daughter, King Hamlet", ["group direct message d"]],
        ["You and Cordelia, Lear's daughter", ["direct message e"]],
    ]);
    assert.strictEqual(
        await common.get_text_from_selector(page, "#new_conversation_button"),
        "Start new conversation",
    );
    assert.strictEqual(await page.title(), "Direct message feed - Zulip Dev - Zulip");
}

async function test_narrow_by_clicking_the_left_sidebar(page: Page): Promise<void> {
    console.log("Narrowing with left sidebar");

    await page.click((await get_stream_li(page, "Verona")) + " .stream-name");
    await expect_verona_stream_top_topic(page);

    await page.click("#left-sidebar-navigation-list .top_left_all_messages a");
    await expect_home(page);

    const all_private_messages_icon = "#show-all-direct-messages";
    await page.waitForSelector(all_private_messages_icon, {visible: true});
    await page.click(all_private_messages_icon);
    await expect_all_direct_messages(page);

    await un_narrow(page);
    await expect_home(page);
}

async function arrow(page: Page, direction: "Up" | "Down"): Promise<void> {
    await page.keyboard.press(({Up: "ArrowUp", Down: "ArrowDown"} as const)[direction]);
}

async function test_search_venice(page: Page): Promise<void> {
    await common.clear_and_type(page, ".left-sidebar-search-input", "vEnI"); // Must be case insensitive.
    await page.waitForSelector(await get_stream_li(page, "Denmark"), {hidden: true});
    await page.waitForSelector(await get_stream_li(page, "Verona"), {hidden: true});
    await arrow(page, "Down");
    await page.waitForSelector((await get_stream_li(page, "Venice")) + " .highlighted_row", {
        visible: true,
    });

    // Clearing list gives back all the streams in the list
    await common.clear_and_type(page, ".left-sidebar-search-input", "");
    await page.waitForSelector(await get_stream_li(page, "Denmark"), {visible: true});
    await page.waitForSelector(await get_stream_li(page, "Venice"), {visible: true});
    await page.waitForSelector(await get_stream_li(page, "Verona"), {visible: true});
}

async function test_stream_search_filters_stream_list(page: Page): Promise<void> {
    console.log("Filter streams using left side bar");

    await page.waitForSelector(".left-sidebar-search-section");

    // assert streams exist by waiting till they're visible
    await page.waitForSelector(await get_stream_li(page, "Denmark"), {visible: true});
    await page.waitForSelector(await get_stream_li(page, "Venice"), {visible: true});
    await page.waitForSelector(await get_stream_li(page, "Verona"), {visible: true});

    // Enter the search box and test highlighted suggestion
    await page.click(".left-sidebar-search-input");

    // Selection is not highlighted until user wants to move the cursor.
    await page.waitForSelector(".top_left_inbox.top_left_row.highlighted_row", {hidden: true});
    await arrow(page, "Down");
    await page.waitForSelector(".top_left_inbox.top_left_row.highlighted_row", {visible: true});

    await page.waitForSelector((await get_stream_li(page, "Verona")) + " .highlighted_row", {
        hidden: true,
    });

    // Navigate through suggestions using arrow keys
    // Reach core team
    for (let i = 0; i < 12; i += 1) {
        await arrow(page, "Down");
    }
    await arrow(page, "Down"); // core team -> Denmark
    await arrow(page, "Down"); // Denmark -> sandbox
    await arrow(page, "Up"); // sandbox -> Denmark
    await arrow(page, "Up"); // Denmark -> core team
    await arrow(page, "Up"); // core team -> core team
    await arrow(page, "Down"); // core team -> Denmark
    await arrow(page, "Down"); // Denmark -> sandbox
    await arrow(page, "Down"); // sandbox-> Venice
    await arrow(page, "Down"); // Venice -> Verona

    await page.waitForSelector((await get_stream_li(page, "Verona")) + " .highlighted_row", {
        visible: true,
    });

    await page.waitForSelector((await get_stream_li(page, "core team")) + " .highlighted_row", {
        hidden: true,
    });
    await page.waitForSelector((await get_stream_li(page, "Denmark")) + " .highlighted_row", {
        hidden: true,
    });
    await page.waitForSelector((await get_stream_li(page, "Venice")) + " .highlighted_row", {
        hidden: true,
    });
    await page.waitForSelector((await get_stream_li(page, "Zulip")) + " .highlighted_row", {
        hidden: true,
    });
    await test_search_venice(page);

    // Search for beginning of "Verona".
    await page.type(".left-sidebar-search-input", "ver");
    await page.waitForSelector(await get_stream_li(page, "core team"), {hidden: true});
    await page.waitForSelector(await get_stream_li(page, "Denmark"), {hidden: true});
    await page.waitForSelector(await get_stream_li(page, "Venice"), {hidden: true});
    await page.click(await get_stream_li(page, "Verona"));
    await expect_verona_stream_top_topic(page);
    assert.strictEqual(
        await common.get_text_from_selector(page, ".left-sidebar-search-input"),
        "",
        "Clicking on stream didn't clear search",
    );
    await un_narrow(page);
}

async function test_users_search(page: Page): Promise<void> {
    console.log("Search users using right sidebar");
    async function assert_in_list(page: Page, name: string): Promise<void> {
        await page.waitForSelector(`#buddy-list-other-users li[data-name="${CSS.escape(name)}"]`, {
            visible: true,
        });
    }

    async function assert_selected(page: Page, name: string): Promise<void> {
        await page.waitForSelector(
            `#buddy-list-other-users li.highlighted_user[data-name="${CSS.escape(name)}"]`,
            {visible: true},
        );
    }

    async function assert_not_selected(page: Page, name: string): Promise<void> {
        await page.waitForSelector(
            `#buddy-list-other-users li.highlighted_user[data-name="${CSS.escape(name)}"]`,
            {hidden: true},
        );
    }

    await assert_in_list(page, "Desdemona");
    await assert_in_list(page, "Cordelia, Lear's daughter");
    await assert_in_list(page, "King Hamlet");
    await assert_in_list(page, "aaron");

    // Enter the search box and test selected suggestion navigation
    await page.click(".user-list-filter");
    // Selection is not highlighted until user wants to move the cursor.
    await page.waitForSelector("#buddy-list-other-users .highlighted_user", {hidden: true});
    await arrow(page, "Down");
    await page.waitForSelector("#buddy-list-other-users .highlighted_user", {visible: true});
    await assert_selected(page, "Desdemona");
    await assert_not_selected(page, "Cordelia, Lear's daughter");
    await assert_not_selected(page, "King Hamlet");
    await assert_not_selected(page, "aaron");

    // Navigate using arrow keys.
    // go down 2, up 3, then down 3
    //       Desdemona
    //       aaron
    //       Cordelia, Lear's daughter
    //       Iago
    await arrow(page, "Down");
    await arrow(page, "Down");
    await arrow(page, "Up");
    await arrow(page, "Up");
    await arrow(page, "Up"); // does nothing; already on the top.
    await arrow(page, "Down");
    await arrow(page, "Down");
    await arrow(page, "Down");

    // Now Iago must be highlighted
    await page.waitForSelector('#buddy-list-other-users li.highlighted_user[data-name="Iago"]', {
        visible: true,
    });
    await assert_not_selected(page, "King Hamlet");
    await assert_not_selected(page, "aaron");
    await assert_not_selected(page, "Desdemona");

    // arrow up and press Enter. We should be taken to direct messages with Cordelia, Lear's daughter
    await arrow(page, "Up");
    await page.keyboard.press("Enter");
    await expect_cordelia_direct_messages(page);
}

async function test_narrow_public_streams(page: Page): Promise<void> {
    const stream_id = await common.get_stream_id(page, "Denmark");
    await page.goto(`http://zulip.zulipdev.com:9981/#channels/${stream_id}/Denmark`);
    await page.waitForSelector("button.sub_unsub_button", {visible: true});
    await page.click("button.sub_unsub_button");
    await page.waitForSelector(
        `xpath///button[${common.has_class_x(
            "sub_unsub_button",
        )} and normalize-space()="Subscribe"]`,
    );
    await page.click("#subscription_overlay .two-pane-settings-header .exit-sign");
    await page.waitForSelector("#subscription_overlay", {hidden: true});
    await page.goto(`http://zulip.zulipdev.com:9981/#narrow/channel/${stream_id}-Denmark`);
    let message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .recipient_row ~ .recipient_row ~ .recipient_row`,
    );
    assert.ok(
        (await page.$(
            `.message-list[data-message-list-id='${message_list_id}'] .stream-status`,
        )) !== null,
    );

    await page.goto("http://zulip.zulipdev.com:9981/#narrow/channels/public");
    message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .recipient_row ~ .recipient_row ~ .recipient_row`,
    );
    assert.ok(
        (await page.$(
            `.message-list[data-message-list-id='${message_list_id}'] .stream-status`,
        )) === null,
    );
}

async function message_basic_tests(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );

    console.log("Sending messages");
    await common.send_multiple_messages(page, [
        {stream_name: "Verona", topic: "test", content: "verona test a"},
        {stream_name: "Verona", topic: "test", content: "verona test b"},
        {
            stream_name: "Verona",
            topic: "other topic",
            content: "verona other topic c",
        },
        {stream_name: "Denmark", topic: "test", content: "denmark message"},
        {
            recipient: "cordelia@zulip.com, hamlet@zulip.com",
            content: "group direct message a",
        },
        {
            recipient: "cordelia@zulip.com, hamlet@zulip.com",
            content: "group direct message b",
        },
        {recipient: "cordelia@zulip.com", content: "direct message c"},
        {stream_name: "Verona", topic: "test", content: "verona test d"},
        {
            recipient: "cordelia@zulip.com, hamlet@zulip.com",
            content: "group direct message d",
        },
        {recipient: "cordelia@zulip.com", content: "direct message e"},
    ]);

    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    await expect_home(page);

    await test_navigations_from_home(page);
    await search_tests(page);
    await test_narrow_by_clicking_the_left_sidebar(page);
    await test_stream_search_filters_stream_list(page);
    await test_users_search(page);
    await test_narrow_public_streams(page);
}

common.run_test(message_basic_tests);
```

--------------------------------------------------------------------------------

---[FILE: navigation.test.ts]---
Location: zulip-main/web/e2e-tests/navigation.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function navigate_using_left_sidebar(page: Page, stream_name: string): Promise<void> {
    console.log("Visiting #" + stream_name);
    const stream_id = await page.evaluate(() => zulip_test.get_sub("Verona")!.stream_id);
    await page.click(`.narrow-filter[data-stream-id="${stream_id}"] .stream-name`);
    await page.waitForSelector("#message_view_header .zulip-icon-hashtag", {visible: true});
}

async function open_menu(page: Page): Promise<void> {
    const menu_selector = "#settings-dropdown";
    await page.waitForSelector(menu_selector, {visible: true});
    await page.click(menu_selector);
}

async function navigate_to_settings(page: Page): Promise<void> {
    console.log("Navigating to settings");

    await common.open_personal_menu(page);

    const settings_selector = "#personal-menu-dropdown a[href^='#settings']";
    await page.waitForSelector(settings_selector, {visible: true});
    await page.click(settings_selector);

    const profile_section_tab_selector = "li[data-section='profile']";
    await page.waitForSelector(profile_section_tab_selector, {visible: true});
    await page.click(profile_section_tab_selector);
    await page.waitForSelector(`${profile_section_tab_selector}:focus`, {visible: true});

    await page.click("#settings_page .content-wrapper .exit");
    // Wait until the overlay is completely closed.
    await page.waitForSelector("#settings_overlay_container", {hidden: true});
}

async function navigate_to_subscriptions(page: Page): Promise<void> {
    console.log("Navigate to subscriptions");

    await open_menu(page);

    const manage_streams_selector = '.link-item a[href^="#channels"]';
    await page.waitForSelector(manage_streams_selector, {visible: true});
    await page.click(manage_streams_selector);

    await page.waitForSelector("#subscription_overlay", {visible: true});

    await page.click("#subscription_overlay .exit");
    // Wait until the overlay is completely closed.
    await page.waitForSelector("#subscription_overlay", {hidden: true});
}

async function navigate_to_private_messages(page: Page): Promise<void> {
    console.log("Navigate to direct messages");

    const all_private_messages_icon = "#show-all-direct-messages";
    await page.waitForSelector(all_private_messages_icon, {visible: true});
    await page.click(all_private_messages_icon);

    await page.waitForSelector("#message_view_header .zulip-icon-user", {visible: true});
}

async function test_reload_hash(page: Page): Promise<void> {
    const initial_page_load_time = await page.evaluate(() => zulip_test.page_load_time);
    assert.ok(initial_page_load_time !== undefined);
    console.log(`initial load time: ${initial_page_load_time}`);

    const initial_hash = await page.evaluate(() => window.location.hash);

    await page.evaluate(() => {
        zulip_test.initiate_reload({immediate: true});
    });
    await page.waitForNavigation();
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(`.message-list[data-message-list-id='${message_list_id}']`, {
        visible: true,
    });

    const page_load_time = await page.evaluate(() => zulip_test.page_load_time);
    assert.ok(page_load_time !== undefined);
    assert.ok(page_load_time > initial_page_load_time, "Page not reloaded.");

    const hash = await page.evaluate(() => window.location.hash);
    assert.strictEqual(hash, initial_hash, "Hash not preserved.");
}

async function navigation_tests(page: Page): Promise<void> {
    await common.log_in(page);

    await navigate_to_settings(page);

    await navigate_using_left_sidebar(page, "Verona");

    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    await page.waitForSelector("#message_view_header .zulip-icon-all-messages", {visible: true});

    await navigate_to_subscriptions(page);

    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    await page.waitForSelector("#message_view_header .zulip-icon-all-messages", {visible: true});

    await navigate_to_settings(page);
    await navigate_to_private_messages(page);
    await navigate_to_subscriptions(page);
    await navigate_using_left_sidebar(page, "Verona");

    await test_reload_hash(page);

    // Verify that we're narrowed to the target stream
    await page.waitForSelector(
        `xpath///*[@id="message_view_header"]//*[${common.has_class_x(
            "message-header-stream-settings-button",
        )} and normalize-space()="Verona"]`,
    );
}

common.run_test(navigation_tests);
```

--------------------------------------------------------------------------------

---[FILE: realm-creation.test.ts]---
Location: zulip-main/web/e2e-tests/realm-creation.test.ts
Signals: Zod

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";
import * as z from "zod/mini";

import * as common from "./lib/common.ts";

const email = "alice@test.example.com";
const organization_name = "Awesome Organization";
const host = "zulipdev.com:9981";

async function realm_creation_tests(page: Page): Promise<void> {
    await page.goto("http://" + host + "/new/");

    // submit the email for realm creation.
    await page.waitForSelector("#email");
    await page.type("#email", email);
    await page.type("#id_team_name", organization_name);
    await page.select("#realm_type", "business");
    await page.$eval("input#realm_in_root_domain", (el) => {
        el.click();
    });

    await Promise.all([
        page.waitForNavigation(),
        page.$eval("form#create_realm", (form) => {
            form.submit();
        }),
    ]);

    // Make sure confirmation email is sent.
    assert.ok(page.url().includes("/accounts/new/send_confirm/?email=alice%40test.example.com"));

    // Special endpoint enabled only during tests for extracting confirmation key
    await page.goto("http://" + host + "/confirmation_key/");

    // Open the confirmation URL
    const page_content = await page.evaluate(() => document.querySelector("body")!.textContent);
    assert.ok(page_content !== null);
    const {confirmation_key} = z
        .object({confirmation_key: z.string()})
        .parse(JSON.parse(page_content));
    const confirmation_url = `http://${host}/accounts/do_confirm/${confirmation_key}`;
    await page.goto(confirmation_url);

    // We wait until the DOMContentLoaded event because we want the code
    // that focuses the first input field to run before we run our tests to avoid
    // flakes. Without waiting for DOMContentLoaded event, in rare cases, the
    // first input is focused when we are typing something for other fields causing
    // validation errors. The code for focusing the input is wrapped in jQuery
    // $() calls which runs when DOMContentLoaded is fired.
    await page.waitForNavigation({waitUntil: "domcontentloaded"});

    // Make sure the realm creation page is loaded correctly by
    // checking the text in <p> tag under pitch class is as expected.
    await page.waitForSelector(".pitch");
    const text_in_pitch = await page.evaluate(
        () => document.querySelector(".pitch p")!.textContent,
    );
    assert.equal(text_in_pitch, "Enter your account details to complete registration.");

    // fill the form.
    const params = {
        full_name: "Alice",
        password: "passwordwhichisnotreallycomplex",
        terms: true,
        how_realm_creator_found_zulip: "other",
        how_realm_creator_found_zulip_other_text: "test",
    };
    // For some reason, page.click() does not work this for particular checkbox
    // so use page.$eval here to call the .click method in the browser.
    await common.fill_form(page, "#registration", params);
    await page.$eval("form#registration", (form) => {
        form.submit();
    });

    // Check if realm is created and user is logged in by checking if
    // element of id `lightbox_overlay` exists.
    await page.waitForSelector("#lightbox_overlay"); // if element doesn't exist,timeout error raises

    // Check if the modal having the onboarding video has been displayed.
    await common.wait_for_micromodal_to_open(page);
    await page.click("#navigation-tour-video-modal .modal__close");
    await common.wait_for_micromodal_to_close(page);

    // Updating common.realm_url because we are redirecting to it when logging out.
    common.set_realm_url(page.url());
}

common.run_test(realm_creation_tests);
```

--------------------------------------------------------------------------------

---[FILE: realm-linkifier.test.ts]---
Location: zulip-main/web/e2e-tests/realm-linkifier.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function test_add_linkifier(page: Page): Promise<void> {
    await page.waitForSelector(".admin-linkifier-form", {visible: true});
    await common.fill_form(page, "form.admin-linkifier-form", {
        pattern: "#(?P<id>[0-9]+)",
        url_template: "https://trac.example.com/ticket/{id}",
    });
    await page.click('form.admin-linkifier-form button[type="submit"]');

    const admin_linkifier_status_selector = "div#admin-linkifier-status";
    await page.waitForSelector(admin_linkifier_status_selector, {visible: true});
    const admin_linkifier_status = await common.get_text_from_selector(
        page,
        admin_linkifier_status_selector,
    );
    assert.strictEqual(admin_linkifier_status, "Custom linkifier added!");

    await page.waitForSelector(".linkifier_row:nth-child(4)", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            ".linkifier_row:nth-child(4) span.linkifier_pattern",
        ),
        "#(?P<id>[0-9]+)",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            ".linkifier_row:nth-child(4) span.linkifier_url_template",
        ),
        "https://trac.example.com/ticket/{id}",
    );
}

async function test_delete_linkifier(page: Page): Promise<void> {
    await page.waitForFunction(() => document.querySelectorAll(".linkifier_row").length === 4);
    await page.click(".linkifier_row:nth-last-child(1) .delete");
    await common.wait_for_micromodal_to_open(page);
    await page.click("#confirm_delete_linkifiers_modal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);
    await page.waitForFunction(() => document.querySelectorAll(".linkifier_row").length === 3);
}

async function test_add_invalid_linkifier_pattern(page: Page): Promise<void> {
    await page.waitForSelector(".admin-linkifier-form", {visible: true});
    await common.fill_form(page, "form.admin-linkifier-form", {
        pattern: "(foo",
        url_template: "https://trac.example.com/ticket/{id}",
    });
    await page.click('form.admin-linkifier-form button[type="submit"]');

    await page.waitForSelector("div#admin-linkifier-status", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(page, "div#admin-linkifier-status"),
        "Failed: Bad regular expression: missing ): (foo",
    );
}

async function test_edit_linkifier(page: Page): Promise<void> {
    await page.click(".linkifier_row:nth-last-child(1) .edit");
    await common.wait_for_micromodal_to_open(page);
    await common.fill_form(page, "form.linkifier-edit-form", {
        pattern: "(?P<num>[0-9a-f]{40})",
        url_template: "https://trac.example.com/commit/{num}",
    });
    await page.click(".dialog_submit_button");

    await page.waitForSelector(".micromodal", {hidden: true});
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector(".linkifier_row:nth-last-child(1)", {visible: true});
    await page.waitForFunction(
        () =>
            document.querySelector(".linkifier_row:nth-last-child(1) span.linkifier_pattern")
                ?.textContent === "(?P<num>[0-9a-f]{40})",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            ".linkifier_row:nth-last-child(1) span.linkifier_url_template",
        ),
        "https://trac.example.com/commit/{num}",
    );
}

async function test_edit_invalid_linkifier(page: Page): Promise<void> {
    await page.click(".linkifier_row:nth-last-child(1) .edit");
    await common.wait_for_micromodal_to_open(page);
    await common.fill_form(page, "form.linkifier-edit-form", {
        pattern: "#(?P<id>d????)",
        url_template: "{id",
    });
    await page.click(".dialog_submit_button");

    const edit_linkifier_pattern_status_selector = "div#dialog_error";
    await page.waitForSelector(edit_linkifier_pattern_status_selector, {visible: true});
    const edit_linkifier_pattern_status = await common.get_text_from_selector(
        page,
        edit_linkifier_pattern_status_selector,
    );
    assert.strictEqual(
        edit_linkifier_pattern_status,
        "Failed: Bad regular expression: bad repetition operator: ????",
    );

    const edit_linkifier_template_status_selector = "div#edit-linkifier-template-status";
    await page.waitForSelector(edit_linkifier_template_status_selector, {visible: true});
    const edit_linkifier_template_status = await common.get_text_from_selector(
        page,
        edit_linkifier_template_status_selector,
    );
    assert.strictEqual(edit_linkifier_template_status, "Failed: Invalid URL template.");

    await page.click(".dialog_exit_button");
    await page.waitForSelector(".micromodal", {hidden: true});

    await page.waitForSelector(".linkifier_row:nth-last-child(1)", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            ".linkifier_row:nth-last-child(1) span.linkifier_pattern",
        ),
        "(?P<num>[0-9a-f]{40})",
    );
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            ".linkifier_row:nth-last-child(1) span.linkifier_url_template",
        ),
        "https://trac.example.com/commit/{num}",
    );
}

async function linkifier_test(page: Page): Promise<void> {
    await common.log_in(page);
    await common.manage_organization(page);
    await page.click("li[data-section='linkifier-settings']");

    await test_add_linkifier(page);
    await test_edit_linkifier(page);
    await test_edit_invalid_linkifier(page);
    await test_add_invalid_linkifier_pattern(page);
    await test_delete_linkifier(page);
}

common.run_test(linkifier_test);
```

--------------------------------------------------------------------------------

---[FILE: realm-playground.test.ts]---
Location: zulip-main/web/e2e-tests/realm-playground.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

type Playground = {
    playground_name: string;
    pygments_language: string;
    url_template: string;
};

async function _add_playground_and_return_status(page: Page, payload: Playground): Promise<string> {
    await page.waitForSelector(".admin-playground-form", {visible: true});
    // Let's first ensure that the success/failure status from an earlier step has disappeared.
    const admin_playground_status_selector = "div#admin-playground-status";
    await page.waitForSelector(admin_playground_status_selector, {hidden: true});

    await common.select_item_via_typeahead(
        page,
        "#playground_pygments_language",
        payload.pygments_language,
        payload.pygments_language,
    );

    // Now we can fill and click the submit button.
    await common.fill_form(page, "form.admin-playground-form", {
        playground_name: payload.playground_name,
        url_template: payload.url_template,
    });
    // Not sure why, but page.click() doesn't seem to always click the submit button.
    // So we resort to using eval with the button ID instead.
    await page.$eval("button#submit_playground_button", (el) => {
        el.click();
    });

    // We return the success/failure status message back to the caller.
    await page.waitForSelector(admin_playground_status_selector, {visible: true});
    const admin_playground_status = await common.get_text_from_selector(
        page,
        admin_playground_status_selector,
    );
    return admin_playground_status;
}

async function test_successful_playground_creation(page: Page): Promise<void> {
    const payload = {
        pygments_language: "Python",
        playground_name: "Python3 playground",
        url_template: "https://python.example.com?code={code}",
    };
    const status = await _add_playground_and_return_status(page, payload);
    assert.strictEqual(status, "Custom playground added!");
    await page.waitForSelector(".playground_row", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(
            page,
            ".playground_row span.playground_pygments_language",
        ),
        "Python",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".playground_row span.playground_name"),
        "Python3 playground",
    );
    assert.strictEqual(
        await common.get_text_from_selector(page, ".playground_row span.playground_url_template"),
        "https://python.example.com?code={code}",
    );
}

async function test_invalid_playground_parameters(page: Page): Promise<void> {
    const payload = {
        pygments_language: "Python",
        playground_name: "Python3 playground",
        url_template: "not_a_url_template{",
    };
    let status = await _add_playground_and_return_status(page, payload);
    assert.strictEqual(status, "Failed: Invalid URL template.");

    payload.url_template = "https://python.example.com?code={code}";
    payload.pygments_language = "py!@%&";
    status = await _add_playground_and_return_status(page, payload);
    assert.strictEqual(status, "Failed: Invalid characters in pygments language");
}

async function test_successful_playground_deletion(page: Page): Promise<void> {
    await page.click(".playground_row button.delete");

    await common.wait_for_micromodal_to_open(page);
    await page.click("#confirm_delete_code_playgrounds_modal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector(".playground_row", {hidden: true});
}

async function playground_test(page: Page): Promise<void> {
    await common.log_in(page);
    await common.manage_organization(page);
    await page.click("li[data-section='playground-settings']");

    await test_successful_playground_creation(page);
    await test_invalid_playground_parameters(page);
    await test_successful_playground_deletion(page);
}

common.run_test(playground_test);
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 567
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 567 of 1290)

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

---[FILE: webpack.assets.json]---
Location: zulip-main/web/webpack.assets.json

```json
{
    "activity": [
        "./third/bootstrap/css/bootstrap.portico.css",
        "./src/bundles/common.ts",
        "sorttable",
        "./styles/portico/activity.css"
    ],
    "billing": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/billing/helpers.ts",
        "./src/billing/billing.ts",
        "./styles/portico/billing.css"
    ],
    "sponsorship": [
        "./src/bundles/legacy_portico_bundle.ts",
        "jquery-validation",
        "./src/portico/signup.ts",
        "./src/billing/sponsorship.ts",
        "./styles/portico/billing.css"
    ],
    "billing_auth": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/billing/helpers.ts",
        "jquery-validation",
        "./src/billing/remote_billing_auth.ts",
        "./src/billing/deactivate_server.ts",
        "./styles/portico/billing.css"
    ],
    "upgrade": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/billing/helpers.ts",
        "./src/billing/upgrade.ts",
        "jquery-validation",
        "./styles/portico/billing.css"
    ],
    "billing-event-status": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/billing/event_status.ts",
        "./src/billing/helpers.ts",
        "./styles/portico/billing.css"
    ],
    "portico": ["./src/bundles/legacy_portico_bundle.ts"],
    "error-styles": [
        "./third/bootstrap/css/bootstrap.portico.css",
        "./styles/portico/legacy_portico_styles_bundle.css"
    ],
    "common": ["./src/bundles/common.ts"],
    "help": [
        "./src/bundles/legacy_portico_bundle.ts",
        "simplebar/dist/simplebar.css",
        "simplebar",
        "./src/portico/help.ts"
    ],
    "marketing-page": [
        "./src/bundles/marketing_page_bundle.ts",
        "./src/portico/legacy_landing_page.ts",
        "./styles/portico/portico_variables.css",
        "./styles/portico/marketing_page.css",
        "./styles/portico/pricing_plans.css"
    ],
    "landing-page-hello": [
        "./src/bundles/hello.ts",
        "./src/portico/hello.ts",
        "./src/portico/legacy_landing_page.ts",
        "./src/portico/header.ts",
        "./styles/portico/svg_icons.css",
        "./styles/portico/hello.css",
        "./styles/portico/navbar.css",
        "./styles/portico/footer.css"
    ],
    "plans-page": [
        "./src/bundles/hello.ts",
        "./src/portico/legacy_landing_page.ts",
        "./src/portico/header.ts",
        "./styles/portico/portico_variables.css",
        "./styles/portico/hello.css",
        "./styles/portico/navbar.css",
        "./styles/portico/footer.css",
        "./styles/portico/plans_pages.css",
        "./styles/portico/pricing_plans.css",
        "./styles/portico/comparison_table.css"
    ],
    "integrations": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/portico/integrations.ts",
        "./styles/portico/legacy_landing_page.css",
        "./styles/portico/integrations.css",
        "./src/portico/help.ts"
    ],
    "communities": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/portico/communities.ts",
        "./styles/portico/legacy_landing_page.css",
        "./styles/portico/integrations.css"
    ],
    "signup": [
        "./src/bundles/legacy_portico_bundle.ts",
        "jquery-validation",
        "./src/portico/signup.ts"
    ],
    "register": [
        "./src/bundles/legacy_portico_bundle.ts",
        "jquery-validation",
        "./src/portico/signup.ts"
    ],
    "slack-import": [
        "./src/bundles/legacy_portico_bundle.ts",
        "jquery-validation",
        "./src/portico/signup.ts",
        "@uppy/core/css/style.min.css",
        "@uppy/dashboard/css/style.min.css",
        "./src/portico/slack-import.ts"
    ],
    "redirect-to-post": [
        "./third/bootstrap/css/bootstrap.portico.css",
        "./src/bundles/common.ts",
        "./src/portico/redirect-to-post.ts"
    ],
    "support": [
        "./third/bootstrap/css/bootstrap.portico.css",
        "./src/bundles/common.ts",
        "sorttable",
        "./styles/portico/activity.css",
        "./src/support/support.ts",
        "./src/portico/tippyjs.ts",
        "tippy.js/dist/tippy.css"
    ],
    "desktop-login": ["./src/bundles/legacy_portico_bundle.ts", "./src/portico/desktop-login.ts"],
    "desktop-redirect": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/portico/desktop-redirect.ts"
    ],
    "stats": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./styles/portico/stats.css",
        "./src/stats/stats.ts"
    ],
    "app": ["./src/bundles/app.ts"],
    "digest": ["./src/bundles/legacy_portico_bundle.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: webpack.config.ts]---
Location: zulip-main/web/webpack.config.ts

```typescript
/// <reference types="webpack-dev-server" />

import path from "node:path";
import * as url from "node:url";

import type {ZopfliOptions} from "@gfx/zopfli";
import {gzip} from "@gfx/zopfli";
import CompressionPlugin from "compression-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import BundleTracker from "webpack-bundle-tracker";

import DebugRequirePlugin from "./debug-require-webpack-plugin.ts";
import assets from "./webpack.assets.json" with {type: "json"};
import dev_assets from "./webpack.dev-assets.json" with {type: "json"};

const config = (
    env: {
        minimize?: true;
        puppeteer_tests?: true;
        ZULIP_VERSION?: string;
        custom_5xx_file?: string;
    } = {},
    argv: {mode?: string},
): webpack.Configuration[] => {
    const production: boolean = argv.mode === "production";

    const baseConfig: webpack.Configuration = {
        mode: production ? "production" : "development",
        context: import.meta.dirname,
        cache: {
            type: "filesystem",
            buildDependencies: {
                config: [import.meta.filename],
            },
        },
    };

    const plugins: webpack.WebpackPluginInstance[] = [
        new webpack.DefinePlugin({
            DEVELOPMENT: JSON.stringify(!production),
            ZULIP_VERSION: JSON.stringify(env.ZULIP_VERSION ?? "development"),
        }),
        new DebugRequirePlugin(),
        new BundleTracker({
            path: path.join(import.meta.dirname, production ? ".." : "../var"),
            filename: production ? "webpack-stats-production.json" : "webpack-stats-dev.json",
        }),
        // Extract CSS from files
        new MiniCssExtractPlugin({
            filename: production ? "[name].[contenthash].css" : "[name].css",
            chunkFilename: production ? "[contenthash].css" : "[id].css",
        }),
        new HtmlWebpackPlugin({
            filename: "5xx.html",
            template: env.custom_5xx_file ? "html/" + env.custom_5xx_file : "html/5xx.html",
            chunks: ["error-styles"],
            publicPath: production ? "/static/webpack-bundles/" : "/webpack/",
        }),
    ];
    if (production && !env.puppeteer_tests) {
        plugins.push(
            new CompressionPlugin<ZopfliOptions>({
                // Use zopfli to write pre-compressed versions of text files
                test: /\.(js|css|html)$/,
                algorithm: gzip,
            }),
        );
    }

    const frontendConfig: webpack.Configuration = {
        ...baseConfig,
        name: "frontend",
        entry: production
            ? assets
            : Object.fromEntries(
                  Object.entries({...assets, ...dev_assets}).map(([name, paths]) => [
                      name,
                      [...paths, "./src/debug.ts"],
                  ]),
              ),
        module: {
            rules: [
                {
                    test: path.resolve(import.meta.dirname, "src/zulip_test.ts"),
                    loader: "expose-loader",
                    options: {exposes: "zulip_test"},
                },
                {
                    test: path.resolve(import.meta.dirname, "debug-require.cjs"),
                    loader: "expose-loader",
                    options: {exposes: "require"},
                },
                {
                    test: url.fileURLToPath(import.meta.resolve("jquery")),
                    loader: "expose-loader",
                    options: {exposes: ["$", "jQuery"]},
                },
                // Generate webfont
                {
                    test: /\.font\.cjs$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: false, // webfonts-loader generates public relative URLs
                            },
                        },
                        {
                            loader: "webfonts-loader",
                            options: {
                                fileName: production
                                    ? "files/[fontname].[chunkhash].[ext]"
                                    : "files/[fontname].[ext]",
                                publicPath: "",
                            },
                        },
                    ],
                    type: "javascript/auto",
                },
                // Transpile .js and .ts files with Babel
                {
                    test: /\.[cm]?[jt]s$/,
                    include: [path.resolve(import.meta.dirname, "src")],
                    loader: "babel-loader",
                },
                // regular css files
                {
                    test: /\.css$/,
                    exclude: path.resolve(import.meta.dirname, "styles"),
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                // PostCSS loader
                {
                    test: /\.css$/,
                    include: path.resolve(import.meta.dirname, "styles"),
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.hbs$/,
                    loader: "handlebars-loader",
                    options: {
                        ignoreHelpers: true,
                        // Tell webpack not to explicitly require these.
                        knownHelpers: [
                            // The ones below are defined in web/src/templates.ts
                            "eq",
                            "and",
                            "or",
                            "not",
                            "t",
                            "tr",
                            "rendered_markdown",
                            "numberFormat",
                            "tooltip_hotkey_hints",
                            "popover_hotkey_hints",
                        ],
                        precompileOptions: {
                            knownHelpersOnly: true,
                            strict: true,
                            explicitPartialContext: true,
                        },
                        preventIndent: true,
                        // This replaces relative image resources with
                        // a computed require() path to them, so their
                        // webpack-hashed URLs are used.
                        inlineRequires: /^(\.\.\/)+(images|static)\//,
                    },
                },
                // load fonts and files
                {
                    test: /\.(eot|jpg|svg|ttf|otf|png|webp|woff2?)$/,
                    type: "asset/resource",
                },
            ],
        },
        output: {
            path: path.resolve(import.meta.dirname, "../static/webpack-bundles"),
            publicPath: "auto",
            filename: production ? "[name].[contenthash].js" : "[name].js",
            assetModuleFilename: production
                ? "files/[name].[hash][ext][query]"
                : // Avoid directory traversal bug that upstream won't fix
                  // (https://github.com/webpack/webpack/issues/11937)
                  (pathData) => "files" + path.join("/", pathData.filename!),
            chunkFilename: production ? "[contenthash].js" : "[id].js",
            crossOriginLoading: "anonymous",
        },
        // We prefer cheap-module-source-map over any eval-* options
        // because stacktrace-gps doesn't currently support extracting
        // the source snippets with the eval-* options.
        devtool: production ? "source-map" : "cheap-module-source-map",
        optimization: {
            minimize: env.minimize ?? production,
            minimizer: [
                new CssMinimizerPlugin({
                    minify: CssMinimizerPlugin.cleanCssMinify,
                }),
                "...",
            ],
            splitChunks: {
                chunks: "all",
                // webpack/examples/many-pages suggests 20 requests for HTTP/2
                maxAsyncRequests: 20,
                maxInitialRequests: 20,
            },
        },
        plugins,
        devServer: {
            client: {
                overlay: {
                    runtimeErrors: false,
                },
            },
            devMiddleware: {
                publicPath: "/webpack/",
                stats: {
                    // We want just errors and a clear, brief notice
                    // whenever webpack compilation has finished.
                    preset: "minimal",
                    assets: false,
                    modules: false,
                },
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Timing-Allow-Origin": "*",
            },
            setupMiddlewares: (middlewares) =>
                middlewares.filter((middleware) => middleware.name !== "cross-origin-header-check"),
        },
        infrastructureLogging: {
            level: "warn",
        },
        watchOptions: {
            ignored: [
                "**/node_modules/**",
                // Prevent Emacs file locks from crashing webpack-dev-server
                // https://github.com/webpack/webpack-dev-server/issues/2821
                "**/.#*",
            ],
        },
    };

    const serverConfig: webpack.Configuration = {
        ...baseConfig,
        name: "server",
        target: "node",
        entry: {
            katex_server: "babel-loader!./server/katex_server.ts",
            "katex-cli": "shebang-loader!katex/cli",
        },
        output: {
            path: path.resolve(import.meta.dirname, "../static/webpack-bundles"),
        },
    };

    return [frontendConfig, serverConfig];
};
export default config;
```

--------------------------------------------------------------------------------

---[FILE: webpack.dev-assets.json]---
Location: zulip-main/web/webpack.dev-assets.json

```json
{
    "dev-login": ["./src/bundles/legacy_portico_bundle.ts", "./src/portico/dev-login.ts"],
    "dev-integrations-panel": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./src/portico/integrations_dev_panel.ts",
        "./styles/portico/integrations_dev_panel.css",
        "./src/reload_state.ts",
        "./src/channel.ts"
    ],
    "dev-email-log": [
        "./src/bundles/common.ts",
        "./src/portico/email_log.ts",
        "./src/portico/portico_modals.ts",
        "./styles/portico/email_log.css",
        "./src/reload_state.ts",
        "./src/channel.ts"
    ],
    "dev-help": [
        "./src/bundles/legacy_portico_bundle.ts",
        "./styles/portico/dev_help.css",
        "./styles/portico/markdown.css"
    ],
    "showroom": ["./src/bundles/showroom.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: admin.test.ts]---
Location: zulip-main/web/e2e-tests/admin.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function submit_announcements_stream_settings(page: Page): Promise<void> {
    await page.waitForSelector('#org-notifications .save-button[data-status="unsaved"]', {
        visible: true,
    });

    const save_button = "#org-notifications .save-button";
    await page.waitForFunction(
        (save_button: string) => {
            const button = document.querySelector(save_button);
            return button && button.textContent?.trim() === "Save changes";
        },
        {},
        save_button,
    );
    await page.click(save_button);

    await page.waitForSelector('#org-notifications .save-button[data-status="saved"]', {
        visible: true,
    });
    await page.waitForFunction(
        (save_button: string) => {
            const button = document.querySelector(save_button);
            return button && button.textContent?.trim() === "Saved";
        },
        {},
        save_button,
    );

    await page.waitForSelector("#org-notifications .save-button", {hidden: true});
}

async function test_change_new_stream_announcements_stream(page: Page): Promise<void> {
    await page.click("#realm_new_stream_announcements_stream_id_widget.dropdown-widget-button");
    await page.waitForSelector(".dropdown-list-container", {
        visible: true,
    });

    await page.type(".dropdown-list-search-input", "rome");

    const rome_in_dropdown = await page.waitForSelector(
        `xpath///*[${common.has_class_x("list-item")}][normalize-space()="Rome"]`,
        {visible: true},
    );
    assert.ok(rome_in_dropdown);
    await rome_in_dropdown.click();

    await submit_announcements_stream_settings(page);
}

async function test_change_signup_announcements_stream(page: Page): Promise<void> {
    await page.click("#realm_signup_announcements_stream_id_widget.dropdown-widget-button");
    await page.waitForSelector(".dropdown-list-container", {
        visible: true,
    });

    await page.type(".dropdown-list-search-input", "rome");

    const rome_in_dropdown = await page.waitForSelector(
        `xpath///*[${common.has_class_x("list-item")}][normalize-space()="Rome"]`,
        {visible: true},
    );
    assert.ok(rome_in_dropdown);
    await rome_in_dropdown.click();

    await submit_announcements_stream_settings(page);
}

async function test_change_zulip_update_announcements_stream(page: Page): Promise<void> {
    await page.click("#realm_zulip_update_announcements_stream_id_widget.dropdown-widget-button");
    await page.waitForSelector(".dropdown-list-container", {
        visible: true,
    });

    await page.type(".dropdown-list-search-input", "rome");

    const rome_in_dropdown = await page.waitForSelector(
        `xpath///*[${common.has_class_x("list-item")}][normalize-space()="Rome"]`,
        {visible: true},
    );
    assert.ok(rome_in_dropdown);
    await rome_in_dropdown.click();

    await submit_announcements_stream_settings(page);
}

async function test_save_joining_organization_change_worked(page: Page): Promise<void> {
    const saved_status = '#org-join-settings .save-button[data-status="saved"]';
    await page.waitForSelector(saved_status, {
        visible: true,
    });
    await page.waitForSelector(saved_status, {hidden: true});
}

async function submit_joining_organization_change(page: Page): Promise<void> {
    const save_button = "#org-join-settings .save-button";
    await page.waitForSelector(save_button, {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(page, save_button),
        "Save changes",
        "Save button didn't appear for permissions change.",
    );
    await page.waitForSelector(save_button, {visible: true});
    await page.click(save_button);

    await test_save_joining_organization_change_worked(page);
}

async function test_set_new_user_threshold_to_three_days(page: Page): Promise<void> {
    console.log("Test setting new user threshold to three days.");
    await page.waitForSelector("#id_realm_waiting_period_threshold", {visible: true});
    await page.select("#id_realm_waiting_period_threshold", "3");
    await submit_joining_organization_change(page);
}

async function test_set_new_user_threshold_to_N_days(page: Page): Promise<void> {
    console.log("Test setting new user threshold to N days.");
    await page.waitForSelector("#id_realm_waiting_period_threshold", {visible: true});
    await page.select("#id_realm_waiting_period_threshold", "custom_period");

    const N = "10";
    await common.clear_and_type(page, "#id_realm_waiting_period_threshold_custom_input", N);
    await submit_joining_organization_change(page);
}

async function test_organization_permissions(page: Page): Promise<void> {
    await page.click("li[data-section='organization-permissions']");

    // Test temporarily disabled 2024-02-25 due to nondeterminsitic failures.
    // See https://chat.zulip.org/#narrow/channel/43-automated-testing/topic/main.20failing/near/1743361
    console.log("Skipping", test_set_new_user_threshold_to_three_days);
    console.log("Skipping", test_set_new_user_threshold_to_N_days);
}

async function test_add_emoji(page: Page): Promise<void> {
    await common.fill_form(page, "#add-custom-emoji-form", {name: "zulip logo"});

    const emoji_upload_handle = await page.$("input#emoji_file_input");
    assert.ok(emoji_upload_handle);
    await emoji_upload_handle.uploadFile("static/images/logo/zulip-icon-128x128.png");
    await page.click("#add-custom-emoji-modal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    await page.waitForSelector("tr#emoji_zulip_logo", {visible: true});
    assert.strictEqual(
        await common.get_text_from_selector(page, "tr#emoji_zulip_logo .emoji_name"),
        "zulip logo",
        "Emoji name incorrectly saved.",
    );
    await page.waitForSelector("tr#emoji_zulip_logo img", {visible: true});
}

async function test_delete_emoji(page: Page): Promise<void> {
    await page.click("tr#emoji_zulip_logo button.delete");

    await common.wait_for_micromodal_to_open(page);
    await page.click("#confirm_deactivate_custom_emoji_modal .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);

    // assert the emoji is deleted.
    await page.waitForSelector("tr#emoji_zulip_logo", {hidden: true});
}

async function test_custom_realm_emoji(page: Page): Promise<void> {
    await page.click("li[data-section='emoji-settings']");
    await page.click("#add-custom-emoji-button");
    await common.wait_for_micromodal_to_open(page);

    await test_add_emoji(page);
    await test_delete_emoji(page);
}

async function test_upload_realm_icon_image(page: Page): Promise<void> {
    const upload_handle = await page.$("#realm-icon-upload-widget input.image_file_input");
    assert.ok(upload_handle);
    await upload_handle.uploadFile("static/images/logo/zulip-icon-128x128.png");

    await common.wait_for_micromodal_to_open(page);
    await page.click("#uppy-editor .dialog_submit_button");
    await common.wait_for_micromodal_to_close(page);
    await page.waitForSelector(
        '#realm-icon-upload-widget .image-block[src^="/user_avatars/2/realm/icon.png?version=2"]',
        {visible: true},
    );
}

async function delete_realm_icon(page: Page): Promise<void> {
    await page.click("li[data-section='organization-profile']");
    await page.click("#realm-icon-upload-widget .image-delete-button");

    await page.waitForSelector("#realm-icon-upload-widget .image-delete-button", {hidden: true});
}

async function test_organization_profile(page: Page): Promise<void> {
    await page.click("li[data-section='organization-profile']");
    const gravatar_selector =
        '#realm-icon-upload-widget .image-block[src^="https://secure.gravatar.com/avatar/"]';
    await page.waitForSelector(gravatar_selector, {visible: true});
    await page.waitForSelector("#realm-icon-upload-widget .image-delete-button", {hidden: true});

    await test_upload_realm_icon_image(page);
    await page.waitForSelector("#realm-icon-upload-widget .image-delete-button", {visible: true});

    await delete_realm_icon(page);
    await page.waitForSelector("#realm-icon-upload-widget .image-delete-button", {hidden: true});
    await page.waitForSelector(gravatar_selector, {visible: true});
}

async function test_authentication_methods(page: Page): Promise<void> {
    await page.click("li[data-section='auth-methods']");
    await page.waitForSelector(".method_row[data-method='Google'] input[type='checkbox'] + span", {
        visible: true,
    });

    await page.click(".method_row[data-method='Google'] input[type='checkbox'] + span");
    const save_button = "#org-auth_settings .save-button";
    assert.strictEqual(await common.get_text_from_selector(page, save_button), "Save changes");
    await page.click(save_button);

    // Leave the page and return.
    const settings_dropdown = "#settings-dropdown";
    await page.click(settings_dropdown);

    await common.manage_organization(page);
    await page.click("li[data-section='auth-methods']");

    // Test setting was saved.
    await page.waitForSelector(".method_row[data-method='Google'] input[type='checkbox'] + span", {
        visible: true,
    });
    await page.waitForSelector(
        ".method_row[data-method='Google'] input[type='checkbox']:not(:checked)",
    );
}

async function admin_test(page: Page): Promise<void> {
    await common.log_in(page);

    await common.manage_organization(page);
    await test_change_new_stream_announcements_stream(page);
    await test_change_signup_announcements_stream(page);
    await test_change_zulip_update_announcements_stream(page);

    await test_organization_permissions(page);
    // Currently, Firefox (with puppeteer) does not support file upload:
    //    https://github.com/puppeteer/puppeteer/issues/6688.
    // Until that is resolved upstream, we need to skip the tests that involve
    // doing file upload on Firefox.
    if (!common.is_firefox) {
        await test_custom_realm_emoji(page);
        await test_organization_profile(page);
    }
    await test_authentication_methods(page);
}

common.run_test(admin_test);
```

--------------------------------------------------------------------------------

---[FILE: compose.test.ts]---
Location: zulip-main/web/e2e-tests/compose.test.ts

```typescript
import assert from "node:assert/strict";

import type {Page} from "puppeteer";

import * as common from "./lib/common.ts";

async function check_compose_form_empty(page: Page): Promise<void> {
    await common.check_compose_state(page, {
        stream_name: "",
        topic: "",
        content: "",
    });
}

async function close_compose_box(page: Page): Promise<void> {
    const recipient_dropdown_visible = (await page.$(".dropdown-list-container")) !== null;

    if (recipient_dropdown_visible) {
        await page.keyboard.press("Escape");
        await page.waitForSelector(".dropdown-list-container", {hidden: true});
    }
    await page.keyboard.press("Escape");
    await page.waitForSelector("#compose-textarea", {hidden: true});
}

function get_message_selector(text: string): string {
    return `xpath/(//p[text()='${text}'])[last()]`;
}

async function test_send_messages(page: Page): Promise<void> {
    const initial_msgs_count = (await page.$$(".message-list .message_row")).length;

    await common.send_multiple_messages(page, [
        {stream_name: "Verona", topic: "Reply test", content: "Compose stream reply test"},
        {recipient: "cordelia@zulip.com", content: "Compose direct message reply test"},
    ]);

    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );
    assert.equal((await page.$$(".message-list .message_row")).length, initial_msgs_count + 2);
}

async function test_stream_compose_keyboard_shortcut(page: Page): Promise<void> {
    await page.keyboard.press("KeyC");
    await page.waitForSelector("#stream_message_recipient_topic", {visible: true});
    await check_compose_form_empty(page);
    await close_compose_box(page);
}

async function test_private_message_compose_shortcut(page: Page): Promise<void> {
    await page.keyboard.press("KeyX");
    await page.waitForSelector("#private_message_recipient", {visible: true});
    await common.pm_recipient.expect(page, "");
    await close_compose_box(page);
}

async function test_keyboard_shortcuts(page: Page): Promise<void> {
    await test_stream_compose_keyboard_shortcut(page);
    await test_private_message_compose_shortcut(page);
}

async function test_reply_by_click_prepopulates_stream_topic_names(page: Page): Promise<void> {
    const stream_message_selector = get_message_selector("Compose stream reply test");
    const stream_message = await page.waitForSelector(stream_message_selector, {visible: true});
    assert.ok(stream_message !== null);
    // we chose only the last element make sure we don't click on any duplicates.
    await stream_message.click();
    await common.check_compose_state(page, {
        stream_name: "Verona",
        topic: "Reply test",
        content: "",
    });
    await close_compose_box(page);
}

async function test_reply_by_click_prepopulates_private_message_recipient(
    page: Page,
): Promise<void> {
    const private_message = await page.$(get_message_selector("Compose direct message reply test"));
    assert.ok(private_message !== null);
    await private_message.click();
    await page.waitForSelector("#private_message_recipient", {visible: true});
    const email = await common.get_internal_email_from_name(page, common.fullname.cordelia);
    assert.ok(email !== undefined);
    await common.pm_recipient.expect(page, email);
    await close_compose_box(page);
}

async function test_reply_with_r_shortcut(page: Page): Promise<void> {
    // The last message(private) in the narrow is currently selected as a result of previous tests.
    // Now we go up and open compose box with r key.
    await page.keyboard.press("KeyK");
    await page.keyboard.press("KeyR");
    await common.check_compose_state(page, {
        stream_name: "Verona",
        topic: "Reply test",
        content: "",
    });
}

async function test_open_close_compose_box(page: Page): Promise<void> {
    await page.waitForSelector("#stream_message_recipient_topic", {visible: true});
    await close_compose_box(page);
    await page.waitForSelector("#stream_message_recipient_topic", {hidden: true});

    await page.keyboard.press("KeyX");
    await page.waitForSelector("#compose-direct-recipient", {visible: true});
    await close_compose_box(page);
    await page.waitForSelector("#compose-direct-recipient", {hidden: true});
}

async function test_narrow_to_private_messages_with_cordelia(page: Page): Promise<void> {
    const you_and_cordelia_selector =
        '*[data-tippy-content="Go to direct messages with Cordelia, Lear\'s daughter"]';
    // For some unknown reason page.click() isn't working here.
    await page.evaluate((selector: string) => {
        document.querySelector<HTMLElement>(selector)!.click();
    }, you_and_cordelia_selector);
    const cordelia_user_id = await common.get_user_id_from_name(page, "Cordelia, Lear's daughter");
    const pm_list_selector = `li[data-user-ids-string="${cordelia_user_id}"].dm-list-item.active-sub-filter`;
    await page.waitForSelector(pm_list_selector, {visible: true});
    await close_compose_box(page);

    await page.keyboard.press("KeyC");
    await page.waitForSelector("#compose", {visible: true});
    await page.waitForSelector(`.dropdown-list-container .list-item`, {visible: true});
    await close_compose_box(page);
}

async function test_send_multirecipient_pm_from_cordelia_pm_narrow(page: Page): Promise<void> {
    const recipients = ["cordelia@zulip.com", "othello@zulip.com"];
    const multiple_recipients_pm = "A direct message group to check spaces";
    await common.send_message(page, "private", {
        recipient: recipients.join(", "),
        content: multiple_recipients_pm,
    });

    // Go back to the combined feed view and make sure all messages are loaded.
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );
    const pm = await page.waitForSelector(
        `xpath/(//*[${common.has_class_x(
            "messagebox",
        )} and contains(normalize-space(), "${multiple_recipients_pm}") and count(.//*[${common.has_class_x(
            "star",
        )}])>0])[last()]`,
    );
    assert.ok(pm !== null);
    await pm.click();
    await page.waitForSelector("#compose-textarea", {visible: true});
    const recipient_internal_emails = [
        await common.get_internal_email_from_name(page, common.fullname.cordelia),
        await common.get_internal_email_from_name(page, common.fullname.othello),
    ].join(",");
    await common.pm_recipient.expect(page, recipient_internal_emails);
}

const markdown_preview_button = "#compose .markdown_preview";
const markdown_preview_hide_button = "#compose .undo_markdown_preview";

async function test_markdown_preview_buttons_visibility(page: Page): Promise<void> {
    await page.waitForSelector(markdown_preview_button, {visible: true});
    await page.waitForSelector(markdown_preview_hide_button, {hidden: true});

    // verify if Markdown preview button works.
    await page.click(markdown_preview_button);
    await page.waitForSelector(markdown_preview_button, {hidden: true});
    await page.waitForSelector(markdown_preview_hide_button, {visible: true});

    // verify if hide button works.
    await page.click(markdown_preview_hide_button);
    await page.waitForSelector(markdown_preview_button, {visible: true});
    await page.waitForSelector(markdown_preview_hide_button, {hidden: true});
}

async function test_markdown_preview_without_any_content(page: Page): Promise<void> {
    await page.click("#compose .markdown_preview");
    await page.waitForSelector("#compose .undo_markdown_preview", {visible: true});
    const markdown_preview_element = await page.$("#compose .preview_content");
    assert.ok(markdown_preview_element);
    assert.equal(
        await page.evaluate((element: Element) => element.textContent, markdown_preview_element),
        "Nothing to preview",
    );
    await page.click("#compose .undo_markdown_preview");
}

async function test_markdown_rendering(page: Page): Promise<void> {
    await page.waitForSelector("#compose .markdown_preview", {visible: true});
    assert.equal(await common.get_text_from_selector(page, "#compose .preview_content"), "");
    await common.fill_form(page, 'form[action^="/json/messages"]', {
        content: "**Markdown preview** >> Test for Markdown preview",
    });
    await page.click("#compose .markdown_preview");
    const preview_content = await page.waitForSelector(
        `xpath///*[@id="compose"]//*[${common.has_class_x(
            "preview_content",
        )} and normalize-space()!=""]`,
        {visible: true},
    );
    assert.ok(preview_content !== null);
    const expected_markdown_html =
        "<p><strong>Markdown preview</strong> &gt;&gt; Test for Markdown preview</p>";
    assert.equal(
        await (await preview_content.getProperty("innerHTML")).jsonValue(),
        expected_markdown_html,
    );
}

async function test_markdown_preview(page: Page): Promise<void> {
    await test_markdown_preview_buttons_visibility(page);
    await test_markdown_preview_without_any_content(page);
    await test_markdown_rendering(page);
}

async function compose_tests(page: Page): Promise<void> {
    await common.log_in(page);
    await page.click("#left-sidebar-navigation-list .top_left_all_messages");
    const message_list_id = await common.get_current_msg_list_id(page, true);
    await page.waitForSelector(
        `.message-list[data-message-list-id='${message_list_id}'] .message_row`,
        {visible: true},
    );
    await test_send_messages(page);
    await test_keyboard_shortcuts(page);
    await test_reply_by_click_prepopulates_stream_topic_names(page);
    await test_reply_by_click_prepopulates_private_message_recipient(page);
    await test_reply_with_r_shortcut(page);
    await test_open_close_compose_box(page);
    await test_narrow_to_private_messages_with_cordelia(page);
    await test_send_multirecipient_pm_from_cordelia_pm_narrow(page);
    await test_markdown_preview(page);
}

common.run_test(compose_tests);
```

--------------------------------------------------------------------------------

````

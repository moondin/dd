---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 724
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 724 of 1290)

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

---[FILE: support.ts]---
Location: zulip-main/web/src/support/support.ts

```typescript
import ClipboardJS from "clipboard";
import $ from "jquery";
import assert from "minimalistic-assert";

function initialize(): void {
    $("body").on("click", "button.scrub-realm-button", function (this: HTMLButtonElement, e) {
        e.preventDefault();
        const message =
            "Confirm the string_id of the realm you want to scrub.\n\n WARNING! This action is irreversible!";
        const actual_string_id = $(this).attr("data-string-id");
        // eslint-disable-next-line no-alert
        const confirmed_string_id = window.prompt(message);
        if (confirmed_string_id === actual_string_id) {
            assert(this.form !== null);
            this.form.submit();
        } else {
            // eslint-disable-next-line no-alert
            window.alert("The string_id you entered is not correct. Aborted.");
        }
    });

    $("body").on("click", "button.delete-user-button", function (this: HTMLButtonElement, e) {
        e.preventDefault();
        const message =
            "Confirm the email of the user you want to delete.\n\n WARNING! This action is irreversible!";
        const actual_email = $(this).attr("data-email");
        // eslint-disable-next-line no-alert
        const confirmed_email = window.prompt(message);
        if (confirmed_email === actual_email) {
            const actual_string_id = $(this).attr("data-string-id");
            // eslint-disable-next-line no-alert
            const confirmed_string_id = window.prompt(
                "Now provide string_id of the realm to confirm.",
            );
            if (confirmed_string_id === actual_string_id) {
                assert(this.form !== null);
                this.form.submit();
            } else {
                // eslint-disable-next-line no-alert
                window.alert("The string_id you entered is not correct. Aborted.");
            }
        } else {
            // eslint-disable-next-line no-alert
            window.alert("The email you entered is not correct. Aborted.");
        }
    });

    new ClipboardJS("a.copy-button");

    $("body").on(
        "blur",
        "input[name='monthly_discounted_price']",
        function (this: HTMLInputElement, _event: JQuery.Event) {
            const input_monthly_price = $(this).val();
            if (!input_monthly_price) {
                return;
            }
            const monthly_price = Number.parseInt(input_monthly_price, 10);
            const $annual_price = $(this).siblings("input[name='annual_discounted_price']");
            // Update the annual price input if it's empty
            if (!$annual_price.val()) {
                const data_original_monthly_price = $(this).attr("data-original-monthly-price");
                const data_original_annual_price = $annual_price.attr("data-original-annual-price");
                if (data_original_monthly_price && data_original_annual_price) {
                    const original_monthly_price = Number.parseInt(data_original_monthly_price, 10);
                    const original_annual_price = Number.parseInt(data_original_annual_price, 10);
                    let derived_annual_price =
                        (original_annual_price / original_monthly_price) * monthly_price;
                    derived_annual_price = Math.round(derived_annual_price);
                    $annual_price.val(derived_annual_price);
                }
            }
        },
    );

    $("body").on(
        "blur",
        "input[name='annual_discounted_price']",
        function (this: HTMLInputElement, _event: JQuery.Event) {
            const input_annual_price = $(this).val();
            if (!input_annual_price) {
                return;
            }
            const annual_price = Number.parseInt(input_annual_price, 10);
            const $monthly_price = $(this).siblings("input[name='monthly_discounted_price']");
            // Update the monthly price input if it's empty
            if (!$monthly_price.val()) {
                const data_original_monthly_price = $monthly_price.attr(
                    "data-original-monthly-price",
                );
                const data_original_annual_price = $(this).attr("data-original-annual-price");
                if (data_original_monthly_price && data_original_annual_price) {
                    const original_monthly_price = Number.parseInt(data_original_monthly_price, 10);
                    const original_annual_price = Number.parseInt(data_original_annual_price, 10);
                    let derived_monthly_price =
                        (original_monthly_price / original_annual_price) * annual_price;
                    derived_monthly_price = Math.round(derived_monthly_price);
                    $monthly_price.val(derived_monthly_price);
                }
            }
        },
    );
}

initialize();
```

--------------------------------------------------------------------------------

---[FILE: eslint-plugin-no-jquery.d.ts]---
Location: zulip-main/web/src/types/eslint-plugin-no-jquery.d.ts

```typescript
import type {Linter, Rule} from "eslint";

declare const eslintPluginNoJquery: {
    rules: Record<string, Rule.RuleModule>;
    configs: {
        recommended: Linter.LegacyConfig;
        slim: Linter.LegacyConfig;
        deprecated: Linter.LegacyConfig;
        ["deprecated-3.7"]: Linter.LegacyConfig;
        ["deprecated-3.6"]: Linter.LegacyConfig;
        ["deprecated-3.5"]: Linter.LegacyConfig;
        ["deprecated-3.4"]: Linter.LegacyConfig;
        ["deprecated-3.3"]: Linter.LegacyConfig;
        ["deprecated-3.2"]: Linter.LegacyConfig;
        ["deprecated-3.1"]: Linter.LegacyConfig;
        ["deprecated-3.0"]: Linter.LegacyConfig;
        ["deprecated-2.2"]: Linter.LegacyConfig;
        ["deprecated-2.1"]: Linter.LegacyConfig;
        ["deprecated-2.0"]: Linter.LegacyConfig;
        ["deprecated-1.12"]: Linter.LegacyConfig;
        ["deprecated-1.11"]: Linter.LegacyConfig;
        ["deprecated-1.10"]: Linter.LegacyConfig;
        ["deprecated-1.9"]: Linter.LegacyConfig;
        ["deprecated-1.8"]: Linter.LegacyConfig;
        ["deprecated-1.7"]: Linter.LegacyConfig;
        ["deprecated-1.6"]: Linter.LegacyConfig;
        ["deprecated-1.5"]: Linter.LegacyConfig;
        ["deprecated-1.4"]: Linter.LegacyConfig;
        ["deprecated-1.3"]: Linter.LegacyConfig;
        ["deprecated-1.2"]: Linter.LegacyConfig;
        ["deprecated-1.1"]: Linter.LegacyConfig;
        ["deprecated-1.0"]: Linter.LegacyConfig;
        all: Linter.LegacyConfig;
    };
};

export = eslintPluginNoJquery;
```

--------------------------------------------------------------------------------

---[FILE: postcss-extend-rule.d.ts]---
Location: zulip-main/web/src/types/postcss-extend-rule.d.ts

```typescript
import type {PluginCreator} from "postcss";

export type PostCSSExtendRuleOptions = {
    onFunctionalSelector?: "remove" | "ignore" | "warn" | "throw";
    onRecursiveExtend?: "remove" | "ignore" | "warn" | "throw";
    onUnusedExtend?: "remove" | "ignore" | "warn" | "throw";
};

declare const postcssExtendRule: PluginCreator<PostCSSExtendRuleOptions>;
export default postcssExtendRule;
```

--------------------------------------------------------------------------------

---[FILE: postcss-import.d.ts]---
Location: zulip-main/web/src/types/postcss-import.d.ts

```typescript
import type {AcceptedPlugin, PluginCreator} from "postcss";

export type PostCSSImportOptions = {
    filter?: (path: string) => boolean;
    root?: string;
    path?: string | string[];
    plugins?: AcceptedPlugin[];
    resolve?: (
        id: string,
        basedir: string,
        importOptions: PostCSSImportOptions,
        astNode: unknown,
    ) => string | string[] | Promise<string | string[]>;
    load?: (filename: string, importOptions: PostCSSImportOptions) => string | Promise<string>;
    skipDuplicates?: boolean;
    addModulesDirectories?: string[];
    warnOnEmpty?: boolean;
};

declare const postcssImport: PluginCreator<PostCSSImportOptions>;
export default postcssImport;
```

--------------------------------------------------------------------------------

---[FILE: application-error.d.ts]---
Location: zulip-main/web/src/types/openapi-examples-validator/application-error.d.ts

```typescript
export enum ErrorType {
    jsENOENT = "ENOENT",
    jsonPathNotFound = "JsonPathNotFound",
    errorAndErrorsMutuallyExclusive = "ErrorErrorsMutuallyExclusive",
    parseError = "ParseError",
    validation = "Validation",
}

export type ApplicationErrorOptions = {
    instancePath?: string;
    examplePath?: string;
    exampleFilePath?: string;
    keyword?: string;
    message?: string;
    mapFilePath?: string;
    params?: {
        path?: string;
        missingProperty?: string;
        type?: string;
    };
    schemaPath?: string;
};

/**
 * Unified application-error
 */
export class ApplicationError {
    /**
     * Factory-function, which is able to consume validation-errors and
     * JS-errors. If a validation error is passed, all properties will be
     * adopted.
     *
     * @param err - Javascript-, validation- or custom-error, to create the
     * application-error from
     * @returns Unified application-error instance
     */
    static create(err: Error): ApplicationError;

    /**
     * Constructor
     *
     * @param type - Type of error (see statics)
     * @param options - Optional properties
     */
    constructor(type: ErrorType, options?: ApplicationErrorOptions);

    type: ErrorType;
    instancePath?: string;
    examplePath?: string;
    exampleFilePath?: string;
    keyword?: string;
    message?: string;
    mapFilePath?: string;
    params?: {
        path?: string;
        missingProperty?: string;
        type?: string;
    };
    schemaPath?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: index.d.ts]---
Location: zulip-main/web/src/types/openapi-examples-validator/index.d.ts

```typescript
import type {ApplicationError} from "./application-error.d.ts";

declare namespace OpenApiExamplesValidator {
    export type ValidationStatistics = {
        schemasWithExamples: number;
        examplesTotal: number;
        examplesWithoutSchema: number;
        matchingFilePathsMapping?: number | undefined;
    };

    export type ValidationResponse = {
        valid: boolean;
        statistics: ValidationStatistics;
        errors: ApplicationError[];
    };

    /**
     * Validates OpenAPI-spec with embedded examples.
     *
     * @param openapiSpec - OpenAPI-spec
     */
    export function validateExamples(
        openapiSpec: object,
        options?: {
            /**
             * Don't allow properties that are not defined in the schema
             */
            noAdditionalProperties?: boolean | undefined;
            /**
             * Make all properties required
             */
            allPropertiesRequired?: boolean | undefined;
            /**
             * List of datatype formats that shall be ignored (to prevent
             * "unsupported format" errors). If an Array with only one string is
             * provided where the formats are separated with `\n`, the entries will
             * be expanded to a new array containing all entries.
             */
            ignoreFormats?: string[] | undefined;
        },
    ): Promise<ValidationResponse>;
    // eslint-disable-next-line unicorn/no-named-default
    export {validateExamples as default};

    /**
     * Validates OpenAPI-spec with embedded examples.
     *
     * @param filePath - File-path to the OpenAPI-spec
     */
    export function validateFile(
        filePath: string,
        options?: {
            /**
             * Don't allow properties that are not defined in the schema
             */
            noAdditionalProperties?: boolean | undefined;
            /**
             * Make all properties required
             */
            allPropertiesRequired?: boolean | undefined;
            /**
             * List of datatype formats that shall be ignored (to prevent
             * "unsupported format" errors). If an Array with only one string is
             * provided where the formats are separated with `\n`, the entries will
             * be expanded to a new array containing all entries.
             */
            ignoreFormats?: string[] | undefined;
        },
    ): Promise<ValidationResponse>;

    /**
     * Validates examples by mapping-files.
     *
     * @param filePathSchema - File-path to the OpenAPI-spec
     * @param globMapExternalExamples - File-path (globs are supported) to the
     * mapping-file containing JSON-paths to schemas as key and a single file-path
     * or Array of file-paths to external examples
     */
    export function validateExamplesByMap(
        filePathSchema: string,
        globMapExternalExamples: string,
        options?: {
            /**
             * Change working directory for resolving the example-paths (relative to
             * the mapping-file)
             */
            cwdToMappingFile?: boolean | undefined;
            /**
             * Don't allow properties that are not defined in the schema
             */
            noAdditionalProperties?: boolean | undefined;
            /**
             * Make all properties required
             */
            allPropertiesRequired?: boolean | undefined;
            /**
             * List of datatype formats that shall be ignored (to prevent
             * "unsupported format" errors). If an Array with only one string is
             * provided where the formats are separated with `\n`, the entries will
             * be expanded to a new array containing all entries.
             */
            ignoreFormats?: string[] | undefined;
        },
    ): Promise<ValidationResponse>;

    /**
     * Validates a single external example.
     *
     * @param filePathSchema - File-path to the OpenAPI-spec
     * @param pathSchema - JSON-path to the schema
     * @param filePathExample - File-path to the external example-file
     */
    export function validateExample(
        filePathSchema: string,
        pathSchema: string,
        filePathExample: string,
        options?: {
            /**
             * Don't allow properties that are not described in the schema
             */
            noAdditionalProperties?: boolean | undefined;
            /**
             * Make all properties required
             */
            allPropertiesRequired?: boolean | undefined;
            /**
             * List of datatype formats that shall be ignored (to prevent
             * "unsupported format" errors). If an Array with only one string is
             * provided where the formats are separated with `\n`, the entries will
             * be expanded to a new array containing all entries.
             */
            ignoreFormats?: string[] | undefined;
        },
    ): Promise<ValidationResponse>;
}

export default OpenApiExamplesValidator;
```

--------------------------------------------------------------------------------

---[FILE: alerts.css]---
Location: zulip-main/web/styles/alerts.css

```text
:root {
    --color-alert-red: hsl(16deg 60% 45%);
    --color-alert-error-red: hsl(0deg 80% 40%);
}

.alert-display {
    display: none;

    &.show {
        display: block;
    }
}

.alert-animations {
    /* TODO: Remove these animations in favour of those
       in web/styles/banners.css, once all the alert popups
       have been converted to use the new banner component. */
    &.show {
        animation-name: fadeIn;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
    }

    &.fade-out {
        animation-name: fadeOut;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
    }

    .faded {
        opacity: 0.7;
    }
}

.home-error-bar {
    display: none;
}

/* alert box component changes */

#alert-popup-container {
    /* Ensure alert box remains in viewport, regardless of scroll
       position in message list. */
    position: fixed;
    /* Offset to account for the top padding + 5px from the top. */
    top: calc(5px + (-1 * var(--popup-banner-translate-y-distance)));
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 900px;
    z-index: 220;
    max-height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Set top padding to account for the translate-y motion of the
       animation to prevent the vertical scroll bar from appearing. */
    padding-top: var(--popup-banner-translate-y-distance);

    @media (width < $lg_min) {
        max-width: 90%;
    }
}

.alert-box {
    display: flex;
    /* Using column-reverse flex direction enables a stack-like
       behavior where the most recent alert is always on top. */
    flex-direction: column-reverse;
    justify-content: center;
    gap: 5px;

    .alert {
        @extend .alert-animations;

        box-sizing: border-box;
        width: 100%;
        border-radius: 4px;
        background-color: hsl(0deg 0% 100%);

        position: relative;

        /* gives room for the error icon and the exit button. */
        padding: 10px 50px;

        text-shadow: none;

        color: var(--color-alert-red);
        border: 1px solid var(--color-alert-red);
        box-shadow: 0 0 2px var(--color-alert-red);

        &::before {
            float: left;
            margin-left: -38px;

            font-family: FontAwesome;
            font-size: 1.3em;
            line-height: 1;
            overflow: hidden;
            content: "\f071";

            color: hsl(16deg 60% 55%);
        }

        &::after {
            clear: both;
            content: "";
            display: table;
        }

        &.alert-error {
            color: var(--color-alert-error-red);
            border: 1px solid var(--color-alert-error-red);
            box-shadow: 0 0 2px var(--color-alert-error-red);

            &::before {
                color: var(--color-alert-error-red);
            }
        }

        .exit {
            float: right;
            margin: -10px -50px -10px 0;
            padding: 13px 10px;

            font-size: 2.5em;
            font-weight: 300;
            line-height: 1ex;
            overflow: hidden;

            cursor: pointer;

            &::after {
                content: "\d7";
            }
        }
    }
}

/* animation section */
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(
            calc(-1 * var(--popup-banner-translate-y-distance))
        );
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(
            calc(-1 * var(--popup-banner-translate-y-distance))
        );
    }
}

#request-progress-status-banner {
    display: none;
    align-items: center;
    padding: 5px 10px;
    margin-top: 10px;
    grid-template-columns: 80px auto 50px;

    &.show {
        display: grid !important;
    }

    &.alert-loading {
        .alert-zulip-logo,
        .loading-indicator {
            display: block;
        }

        /* Hide exit button since clicking it will be useless in
           this scenario. */
        .exit {
            display: none;
        }
    }

    &.alert-success .success-indicator {
        display: block;
    }

    &.alert-loading,
    &.alert-success {
        border-color: hsl(156deg 28% 70%);
        box-shadow: 0 0 2px hsl(156deg 28% 70%);

        .exit {
            color: hsl(156deg 30% 50%);
        }
    }

    &::before {
        content: "";
        margin-left: 0;
    }

    .alert-zulip-logo {
        display: none;
        margin: auto;
        grid-column: 1 / 2;
        grid-row-start: 1;
    }

    .loading-indicator {
        display: none;
        margin: auto;
        grid-column: 1 / 2;
        grid-row-start: 1;
    }

    .success-indicator {
        display: none;
        margin: auto;
        grid-column: 1 / 2;
        grid-row-start: 1;
        padding: 7px;
        font-size: 1.5em;
        line-height: 0;
        color: hsl(156deg 30% 50%);
    }

    .alert-content {
        grid-column: 2 / 3;
        grid-row-start: 1;
        color: var(--color-request-progress-status-alert-text);
    }

    .exit {
        float: unset;
        margin: 0;
        margin-left: auto;
        grid-column: 3 / 4;
        grid-row-start: 1;
        line-height: 0;
    }
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 3
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 3 of 1290)

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

---[FILE: eslint.config.js]---
Location: zulip-main/eslint.config.js
Signals: Zod

```javascript
// @ts-check

import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import confusingBrowserGlobals from "confusing-browser-globals";
import {defineConfig} from "eslint/config";
import prettier from "eslint-config-prettier";
import {configs as astroConfigs} from "eslint-plugin-astro";
import formatjs from "eslint-plugin-formatjs";
import importPlugin from "eslint-plugin-import";
import * as mdx from "eslint-plugin-mdx";
import noJquery from "eslint-plugin-no-jquery";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({baseDirectory: import.meta.dirname});

export default defineConfig(
    {
        // This is intended for generated files and vendored third-party files.
        // For our source code, instead of adding files here, consider using
        // specific eslint-disable comments in the files themselves.
        ignores: [
            "docs/_build",
            "static/generated",
            "static/webpack-bundles",
            "var",
            "web/generated",
            "web/third",
        ],
    },
    js.configs.recommended,
    importPlugin.flatConfigs.recommended,
    compat.config(noJquery.configs.recommended),
    compat.config(noJquery.configs.deprecated),
    unicorn.configs.recommended,
    prettier,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    mdx.flat,
    {
        files: ["**/*.cts", "**/*.mts", "**/*.ts"],
        extends: [importPlugin.flatConfigs.typescript],
    },
    {
        plugins: {
            formatjs,
            "no-jquery": noJquery,
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            ecmaVersion: "latest",
            globals: {
                JQuery: "readonly",
            },
            parserOptions: {
                projectService: true,
                tsConfigRootDir: import.meta.dirname,
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
        settings: {
            formatjs: {
                additionalFunctionNames: ["$t", "$t_html"],
            },
            "import/resolver": {
                node: {
                    extensions: [".ts", ".d.ts", ".js"],
                },
            },
            "no-jquery": {
                collectionReturningPlugins: {expectOne: "always"},
                variablePattern: "^\\$(?!t$|t_html$).",
            },
        },
        rules: {
            "@typescript-eslint/consistent-return": "error",
            "@typescript-eslint/consistent-type-assertions": ["error", {assertionStyle: "never"}],
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
            "@typescript-eslint/member-ordering": "error",
            "@typescript-eslint/method-signature-style": "error",
            "@typescript-eslint/no-loop-func": "error",
            "@typescript-eslint/no-misused-spread": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-restricted-imports": [
                "error",
                {paths: [{name: "zod", message: "Use zod/mini."}]},
            ],
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/no-unnecessary-qualifier": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {args: "all", argsIgnorePattern: "^_", ignoreRestSiblings: true},
            ],
            "@typescript-eslint/no-use-before-define": [
                "error",
                {functions: false, variables: false},
            ],
            "@typescript-eslint/parameter-properties": "error",
            "@typescript-eslint/promise-function-async": "error",
            "@typescript-eslint/restrict-plus-operands": ["error", {}],
            "@typescript-eslint/restrict-template-expressions": ["error", {}],
            "array-callback-return": "error",
            "arrow-body-style": "error",
            curly: "error",
            eqeqeq: "error",
            "formatjs/enforce-default-message": ["error", "literal"],
            "formatjs/enforce-placeholders": [
                "error",
                {ignoreList: ["b", "code", "em", "i", "kbd", "p", "strong"]},
            ],
            "formatjs/no-id": "error",
            "guard-for-in": "error",
            "import/extensions": ["error", "ignorePackages"],
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-cycle": ["error", {ignoreExternal: true}],
            "import/no-duplicates": "error",
            "import/no-self-import": "error",
            "import/no-unresolved": "off",
            "import/no-useless-path-segments": "error",
            "import/order": ["error", {alphabetize: {order: "asc"}, "newlines-between": "always"}],
            "import/unambiguous": "error",
            "lines-around-directive": "error",
            "new-cap": "error",
            "no-alert": "error",
            "no-bitwise": "error",
            "no-caller": "error",
            "no-constant-condition": ["error", {checkLoops: false}],
            "no-div-regex": "error",
            "no-else-return": "error",
            "no-eval": "error",
            "no-implicit-coercion": "error",
            "no-jquery/no-append-html": "error",
            "no-jquery/no-constructor-attributes": "error",
            "no-jquery/no-parse-html-literal": "error",
            "no-jquery/no-sizzle": ["error", {}],
            "no-label-var": "error",
            "no-labels": "error",
            "no-multi-str": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-object-constructor": "error",
            "no-octal-escape": "error",
            "no-plusplus": "error",
            "no-proto": "error",
            "no-restricted-globals": ["error", ...confusingBrowserGlobals],
            "no-return-assign": "error",
            "no-script-url": "error",
            "no-self-compare": "error",
            "no-undef": "error",
            "no-undef-init": "error",
            "no-unneeded-ternary": ["error", {defaultAssignment: false}],
            "no-useless-concat": "error",
            "no-var": "error",
            "object-shorthand": ["error", "always", {avoidExplicitReturnArrows: true}],
            "one-var": ["error", "never"],
            "prefer-arrow-callback": "error",
            "prefer-const": ["error", {ignoreReadBeforeAssign: true}],
            radix: "error",
            "sort-imports": ["error", {ignoreDeclarationSort: true}],
            "spaced-comment": ["error", "always", {markers: ["/"]}],
            strict: "error",
            "unicorn/consistent-function-scoping": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-await-expression-member": "off",
            "unicorn/no-negated-condition": "off",
            "unicorn/no-null": "off",
            "unicorn/no-process-exit": "off",
            "unicorn/no-useless-undefined": "off",
            "unicorn/numeric-separators-style": "off",
            "unicorn/prefer-dom-node-dataset": "off",
            "unicorn/prefer-global-this": "off",
            "unicorn/prefer-string-raw": "off",
            "unicorn/prefer-ternary": "off",
            "unicorn/prefer-top-level-await": "off",
            "unicorn/prevent-abbreviations": "off",
            "unicorn/switch-case-braces": "off",
            "valid-typeof": ["error", {requireStringLiterals: true}],
            yoda: "error",
        },
    },
    {
        ignores: ["**/*.cts", "**/*.mts", "**/*.ts"],
        extends: [tseslint.configs.disableTypeChecked],
        rules: {
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-require-imports": "off",
            "consistent-return": "error",
            "dot-notation": "error",
            "no-implied-eval": "error",
            "no-throw-literal": "error",
        },
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
    {
        files: ["**/*.mdx"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "comma-spacing": "error",
            "import/extensions": "off",
            "import/unambiguous": "off",
            quotes: "error",
        },
    },
    {
        files: ["**/*.md"],
        rules: {
            "import/unambiguous": "off",
        },
    },
    {
        files: ["web/tests/**"],
        rules: {
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-extraneous-class": "off",
            "no-jquery/no-selector-prop": "off",
            "no-redeclare": "off",
        },
    },
    {
        files: ["web/e2e-tests/**"],
        languageOptions: {
            globals: {
                zulip_test: "readonly",
            },
        },
    },
    {
        files: ["**/*.d.ts"],
        rules: {
            "import/unambiguous": "off",
        },
    },
    {
        ignores: ["web/src/**"],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ["web/e2e-tests/**", "web/tests/**"],
        languageOptions: {
            globals: {
                CSS: "readonly",
                document: "readonly",
                navigator: "readonly",
                window: "readonly",
            },
        },
        rules: {
            "formatjs/no-id": "off",
            "new-cap": "off",
        },
    },
    {
        files: ["web/debug-require.cjs"],
        rules: {
            "no-var": "off",
            "object-shorthand": "off",
            "prefer-arrow-callback": "off",
        },
    },
    {
        files: ["web/src/**"],
        settings: {
            "import/resolver": {
                webpack: {
                    config: {},
                },
            },
        },
        rules: {
            "no-console": "error",
        },
    },
    {
        files: ["web/src/**"],
        languageOptions: {
            globals: {
                ...globals.browser,
                DEVELOPMENT: "readonly",
                StripeCheckout: "readonly",
                ZULIP_VERSION: "readonly",
            },
        },
    },
    {
        files: ["starlight_help/src/scripts/client/**"],
        rules: {
            "unicorn/prefer-module": "off",
        },
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            sourceType: "script",
        },
    },
    astroConfigs.recommended,
    {
        files: ["starlight_help/src/components/ZulipNote.astro"],
        rules: {
            "import/unambiguous": "off",
        },
    },
    {
        files: ["starlight_help/src/content/include/*"],
        rules: {
            // We need to turn off this rule since we want import statements
            // to be easily copy-paste-able between content/include and
            // content/docs.
            "import/no-useless-path-segments": "off",
        },
    },
);
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: zulip-main/LICENSE

```text

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

--------------------------------------------------------------------------------

---[FILE: manage.py]---
Location: zulip-main/manage.py
Signals: Django

```python
#!/usr/bin/env python3
import configparser
import os
import sys
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
from scripts.lib.setup_path import setup_path

setup_path()

from django.core.management import ManagementUtility, get_commands
from django.core.management.color import color_style
from typing_extensions import override

from scripts.lib.zulip_tools import assert_not_running_as_root


def get_filtered_commands() -> dict[str, str]:
    """Because Zulip uses management commands in production, `manage.py
    help` is a form of documentation for users. Here we exclude from
    that documentation built-in commands that are not constructive for
    end users or even Zulip developers to run.

    Ideally, we'd do further customization to display management
    commands with more organization in the help text, and also hide
    development-focused management commands in production.
    """
    all_commands = get_commands()
    documented_commands = dict()
    documented_apps = [
        # "auth" removed because its commands are not applicable to Zulip.
        # "contenttypes" removed because we don't use that subsystem, and
        #   even if we did.
        "django.core",
        "analytics",
        # "otp_static" removed because it's a 2FA internals detail.
        # "sessions" removed because it's just a cron job with a misleading
        #   name, since all it does is delete expired sessions.
        # "social_django" removed for similar reasons to sessions.
        # "staticfiles" removed because its commands are only usefully run when
        #   wrapped by Zulip tooling.
        # "two_factor" removed because it's a 2FA internals detail.
        "zerver",
        "zilencer",
    ]
    documented_command_subsets = {
        "django.core": {
            "changepassword",
            "dbshell",
            "makemigrations",
            "migrate",
            "shell",
            "showmigrations",
        },
    }
    for command, app in all_commands.items():
        if app not in documented_apps:
            continue
        if app in documented_command_subsets and command not in documented_command_subsets[app]:
            continue

        documented_commands[command] = app
    return documented_commands


class FilteredManagementUtility(ManagementUtility):
    """Replaces the main_help_text function of ManagementUtility with one
    that calls our get_filtered_commands(), rather than the default
    get_commands() function.

    All other change are just code style differences to pass the Zulip linter.
    """

    @override
    def main_help_text(self, commands_only: bool = False) -> str:
        """Return the script's main help text, as a string."""
        if commands_only:
            usage = sorted(get_filtered_commands())
        else:
            usage = [
                "",
                f"Type '{self.prog_name} help <subcommand>' for help on a specific subcommand.",
                "",
                "Available subcommands:",
            ]
            commands_dict = defaultdict(list)
            for name, app in get_filtered_commands().items():
                if app == "django.core":
                    app = "django"
                else:
                    app = app.rpartition(".")[-1]
                commands_dict[app].append(name)
            style = color_style()
            for app in sorted(commands_dict):
                usage.append("")
                usage.append(style.NOTICE(f"[{app}]"))
                usage.extend(f"    {name}" for name in sorted(commands_dict[app]))
            # Output an extra note if settings are not properly configured
            if self.settings_exception is not None:
                usage.append(
                    style.NOTICE(
                        "Note that only Django core commands are listed "
                        f"as settings are not properly configured (error: {self.settings_exception})."
                    )
                )

        return "\n".join(usage)


def execute_from_command_line(argv: list[str] | None = None) -> None:
    """Run a FilteredManagementUtility."""
    utility = FilteredManagementUtility(argv)
    utility.execute()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "email_server":
        # This needs to be able to run as root to read certificates
        # for STARTTLS, and bind to port 25.
        pass
    else:
        assert_not_running_as_root()

    config_file = configparser.RawConfigParser()
    config_file.read("/etc/zulip/zulip.conf")
    PRODUCTION = config_file.has_option("machine", "deploy_type")
    HAS_SECRETS = os.access("/etc/zulip/zulip-secrets.conf", os.R_OK)

    if PRODUCTION and not HAS_SECRETS:
        # The best way to detect running manage.py as another user in
        # production before importing anything that would require that
        # access is to check for access to /etc/zulip/zulip.conf (in
        # which case it's a production server, not a dev environment)
        # and lack of access for /etc/zulip/zulip-secrets.conf (which
        # should be only readable by root and zulip)
        print(
            "Error accessing Zulip secrets; manage.py in production must be run as the zulip user."
        )
        sys.exit(1)

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zproject.settings")
    from django.conf import settings
    from django.core.management.base import CommandError

    from scripts.lib.zulip_tools import log_management_command

    log_management_command(sys.argv, settings.MANAGEMENT_LOG_PATH)

    if "--no-traceback" not in sys.argv and len(sys.argv) > 1:
        sys.argv.append("--traceback")
    try:
        execute_from_command_line(sys.argv)
    except CommandError as e:
        print(e, file=sys.stderr)
        sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: NOTICE]---
Location: zulip-main/NOTICE

```text
Copyright 2012–2015 Dropbox, Inc., 2015–2021 Kandra Labs, Inc., and contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this project except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

The software includes some works released by third parties under other
free and open source licenses. Those works are redistributed under the
license terms under which the works were received. For more details,
see the ``docs/THIRDPARTY`` file included with this distribution.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: zulip-main/package.json

```json
{
  "private": true,
  "packageManager": "pnpm@10.23.0+sha512.21c4e5698002ade97e4efe8b8b4a89a8de3c85a37919f957e7a0f30f38fbc5bbdd05980ffe29179b2fb6e6e691242e098d945d1601772cad0fef5fb6411e2a4b",
  "type": "module",
  "dependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "@babel/preset-typescript": "^7.15.0",
    "@date-fns/tz": "^1.4.1",
    "@fontsource-variable/open-sans": "^5.0.9",
    "@formatjs/intl": "^3.0.1",
    "@gfx/zopfli": "^1.0.15",
    "@giphy/js-components": "^5.13.0",
    "@giphy/js-fetch-api": "^5.6.0",
    "@koa/bodyparser": "^6.0.0",
    "@sentry/browser": "^10.5.0",
    "@sentry/core": "^10.5.0",
    "@uppy/core": "^5.0.1",
    "@uppy/dashboard": "^5.0.4",
    "@uppy/image-editor": "^4.0.2",
    "@uppy/tus": "^5.0.0",
    "@uppy/utils": "^7.0.1",
    "@zxcvbn-ts/core": "^3.0.1",
    "@zxcvbn-ts/language-common": "^3.0.2",
    "@zxcvbn-ts/language-en": "^3.0.1",
    "altcha": "^2.0.3",
    "autosize": "^5.0.2",
    "babel-loader": "^10.0.0",
    "babel-plugin-formatjs": "^10.2.6",
    "blueimp-md5": "^2.10.0",
    "clean-css": "^5.1.0",
    "clipboard": "^2.0.4",
    "colord": "^2.9.3",
    "compression-webpack-plugin": "^11.1.0",
    "core-js": "^3.46.0",
    "css-loader": "^7.1.1",
    "css-minimizer-webpack-plugin": "^7.0.0",
    "date-fns": "^4.1.0",
    "email-addresses": "^5.0.0",
    "emoji-datasource-google": "^16.0.0",
    "emoji-datasource-twitter": "^16.0.0",
    "error-stack-parser": "^2.0.2",
    "expose-loader": "^5.0.0",
    "flatpickr": "^4.5.7",
    "font-awesome": "^4.7.0",
    "font-subset-loader2": "^1.1.7",
    "fonteditor-core": "^2.6.3",
    "ga-gtag": "^1.0.1",
    "handlebars": "^4.7.2",
    "handlebars-loader": "^1.7.1",
    "html-webpack-plugin": "^5.3.2",
    "intl-messageformat": "^10.3.0",
    "is-url": "^1.2.4",
    "jquery": "^3.6.3",
    "jquery-caret-plugin": "^1.5.2",
    "jquery-validation": "^1.19.0",
    "js-cookie": "^3.0.1",
    "katex": "^0.16.2",
    "koa": "^3.0.0",
    "lodash": "^4.17.19",
    "micromodal": "^0.6.1",
    "mini-css-extract-plugin": "^2.2.2",
    "minimalistic-assert": "^1.0.1",
    "panzoom": "^9.4.2",
    "plotly.js": "^3.0.0",
    "postcss": "^8.0.3",
    "postcss-extend-rule": "^4.0.0",
    "postcss-import": "^16.0.0",
    "postcss-loader": "^8.0.0",
    "postcss-prefixwrap": "^1.24.0",
    "postcss-preset-env": "^10.0.2",
    "postcss-simple-vars": "^7.0.0",
    "prom-client": "^15.1.0",
    "regenerator-runtime": "^0.14.0",
    "shebang-loader": "^0.0.1",
    "simplebar": "^6.2.7",
    "sortablejs": "^1.9.0",
    "sorttable": "^1.0.2",
    "source-code-pro": "^2.38.0",
    "source-sans": "^3.28.0",
    "stackframe": "^1.3.4",
    "stacktrace-gps": "^3.0.4",
    "style-loader": "^4.0.0",
    "text-field-edit": "^4.0.0",
    "textarea-caret": "^3.1.0",
    "tippy.js": "^6.3.7",
    "turndown": "^7.0.0",
    "url-loader": "^4.1.1",
    "url-template": "^3.1.1",
    "webfonts-loader": "^8.0.0",
    "webpack": "^5.61.0",
    "webpack-bundle-tracker": "^3.0.1",
    "webpack-cli": "^6.0.1",
    "zod": "^4.1.5"
  },
  "devDependencies": {
    "@apidevtools/swagger-parser": "^12.0.0",
    "@babel/plugin-transform-modules-commonjs": "^7.19.6",
    "@babel/register": "^7.6.2",
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.15.0",
    "@formatjs/cli": "^6.0.0",
    "@giphy/js-types": "^5.1.0",
    "@types/autosize": "^4.0.1",
    "@types/babel__core": "^7.20.5",
    "@types/babel__preset-env": "^7.10.0",
    "@types/blueimp-md5": "^2.18.0",
    "@types/co-body": "^6.1.3",
    "@types/confusing-browser-globals": "^1.0.3",
    "@types/eslint-config-prettier": "^6.11.3",
    "@types/gtag.js": "^0.0.20",
    "@types/is-url": "^1.2.32",
    "@types/jquery": "^3.3.31",
    "@types/jquery.validation": "^1.16.7",
    "@types/js-cookie": "^3.0.6",
    "@types/katex": "^0.16.0",
    "@types/koa": "^3.0.0",
    "@types/lodash": "^4.14.172",
    "@types/micromodal": "^0.3.3",
    "@types/minimalistic-assert": "^1.0.1",
    "@types/node": "^24.9.2",
    "@types/plotly.js": "^3.0.0",
    "@types/sortablejs": "^1.15.1",
    "@types/textarea-caret": "^3.0.3",
    "@types/throttle-debounce": "^5.0.2",
    "@types/tinycolor2": "^1.4.5",
    "@types/turndown": "^5.0.1",
    "@typescript-eslint/eslint-plugin": "^8.2.0",
    "@typescript-eslint/parser": "^8.2.0",
    "@typescript-eslint/utils": "^8.25.0",
    "astro-eslint-parser": "^1.2.2",
    "babel-plugin-istanbul": "^7.0.0",
    "callsites": "^4.2.0",
    "cldr-annotations-derived-full": "^48.0.0",
    "cldr-annotations-full": "^48.0.0",
    "confusing-browser-globals": "^1.0.11",
    "css.escape": "^1.5.1",
    "diff": "^8.0.2",
    "difflib": "^0.2.4",
    "enhanced-resolve": "^5.8.2",
    "es-check": "^9.1.2",
    "eslint": "^9.15.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-import-resolver-webpack": "^0.13.4",
    "eslint-plugin-astro": "^1.3.1",
    "eslint-plugin-formatjs": "^5.0.0",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-mdx": "^3.6.2",
    "eslint-plugin-no-jquery": "^3.0.2",
    "eslint-plugin-unicorn": "^62.0.0",
    "globals": "^16.0.0",
    "jsdom": "^27.0.0",
    "mockdate": "^3.0.2",
    "nyc": "^17.0.0",
    "openapi-examples-validator": "^6.0.1",
    "postcss-load-config": "^6.0.1",
    "preact": "^10.24.3",
    "prettier": "~3.5.3",
    "prettier-plugin-astro": "^0.14.1",
    "puppeteer": "^24.1.1",
    "remark-cli": "^12.0.1",
    "source-map": "npm:source-map-js@^1.2.1",
    "stylelint": "^16.2.0",
    "stylelint-config-standard": "^39.0.0",
    "stylelint-high-performance-animation": "^1.10.0",
    "svgo": "^4.0.0",
    "typescript": "^5.0.2",
    "typescript-eslint": "^8.13.0",
    "vnu-jar": "^25.11.25",
    "webpack-dev-server": "^5.0.2",
    "xvfb": "^0.4.0",
    "yaml": "^2.0.0-8",
    "zulip-js": "^2.0.8"
  },
  "pnpm": {
    "overrides": {
      "@types/eslint": "npm:eslint@^9.10.0",
      "source-map@^0.6": "npm:source-map-js@^1.2.1"
    },
    "patchedDependencies": {
      "@uppy/utils": "patches/@uppy__utils.patch",
      "eslint-plugin-astro": "patches/eslint-plugin-astro.patch",
      "handlebars": "patches/handlebars.patch",
      "simplebar": "patches/simplebar.patch",
      "stylelint-high-performance-animation": "patches/stylelint-high-performance-animation.patch",
      "svgicons2svgfont": "patches/svgicons2svgfont.patch",
      "textarea-caret@3.1.0": "patches/textarea-caret@3.1.0.patch",
      "tippy.js@6.3.7": "patches/tippy.js@6.3.7.patch"
    }
  },
  "nyc": {
    "exclude": [
      "**/node_modules/**"
    ]
  }
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 555
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 555 of 1290)

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

---[FILE: provision_inner.py]---
Location: zulip-main/tools/lib/provision_inner.py
Signals: Django

```python
#!/usr/bin/env python3

############################## NOTE ################################
# This script is used to provision a development environment ONLY.
# For production, extend update-prod-static to generate new static
# assets, and puppet to install other software.
####################################################################

import argparse
import glob
import os
import pwd
import re
import shutil
import subprocess
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

sys.path.append(ZULIP_PATH)
import pygments

from scripts.lib import clean_unused_caches
from scripts.lib.zulip_tools import (
    ENDC,
    OKBLUE,
    get_dev_uuid_var_path,
    get_tzdata_zi,
    is_digest_obsolete,
    run,
    run_as_root,
    write_new_digest,
)
from tools.setup.generate_bots_integrations_static_files import (
    generate_pythonapi_integrations_static_files,
    generate_zulip_bots_static_files,
)
from version import PROVISION_VERSION

VENV_PATH = os.path.join(ZULIP_PATH, ".venv")
UUID_VAR_PATH = get_dev_uuid_var_path()

with get_tzdata_zi() as f:
    line = f.readline()
    assert line.startswith("# version ")
    timezones_version = line.removeprefix("# version ")


def create_var_directories() -> None:
    # create var/coverage, var/log, etc.
    var_dir = os.path.join(ZULIP_PATH, "var")
    sub_dirs = [
        "coverage",
        "log",
        "node-coverage",
        "test_uploads",
        "uploads",
        "xunit-test-results",
    ]
    for sub_dir in sub_dirs:
        path = os.path.join(var_dir, sub_dir)
        os.makedirs(path, exist_ok=True)


def build_pygments_data_paths() -> list[str]:
    paths = [
        "tools/setup/build_pygments_data",
        "tools/setup/lang.json",
    ]
    return paths


def build_timezones_data_paths() -> list[str]:
    paths = [
        "tools/setup/build_timezone_values",
    ]
    return paths


def build_landing_page_images_paths() -> list[str]:
    paths = ["tools/setup/generate_landing_page_images.py"]
    paths += glob.glob("static/images/landing-page/hello/original/*")
    return paths


def compilemessages_paths() -> list[str]:
    paths = ["zerver/management/commands/compilemessages.py"]
    paths += glob.glob("locale/*/LC_MESSAGES/*.po")
    paths += glob.glob("locale/*/translations.json")
    return paths


def configure_rabbitmq_paths() -> list[str]:
    paths = [
        "scripts/setup/configure-rabbitmq",
    ]
    return paths


def is_wsl_instance() -> bool:
    if "WSL_DISTRO_NAME" in os.environ:
        return True

    with open("/proc/version") as file:
        content = file.read().lower()
        if "microsoft" in content:
            return True

    result = subprocess.run(["uname", "-r"], capture_output=True, text=True, check=True)
    if "microsoft" in result.stdout.lower():
        return True

    return False


def is_vagrant_or_digitalocean_instance() -> bool:
    user_id = os.getuid()
    user_name = pwd.getpwuid(user_id).pw_name
    return user_name in ["vagrant", "zulipdev"]


def setup_shell_profile(shell_profile: str) -> None:
    shell_profile_path = os.path.expanduser(shell_profile)
    if os.path.exists(shell_profile_path):
        with open(shell_profile_path) as f:
            code = f.read()
    else:
        code = ""

    # We want to activate the virtual environment for login shells only on virtualized systems.
    zulip_code = ""
    if is_vagrant_or_digitalocean_instance() or is_wsl_instance():
        zulip_code += (
            "if [ -L /srv/zulip-py3-venv ]; then\n"  # For development environment downgrades
            "source /srv/zulip-py3-venv/bin/activate\n"  # Not indented so old versions recognize and avoid re-adding this
            "else\n"
            f"source {os.path.join(VENV_PATH, 'bin', 'activate')}\n"
            "fi\n"
        )
    if os.path.exists("/srv/zulip"):
        zulip_code += "cd /srv/zulip\n"
    if zulip_code:
        zulip_code = f"\n# begin Zulip setup\n{zulip_code}# end Zulip setup\n"

    def patch_code(code: str) -> str:
        return re.sub(
            r"\n# begin Zulip setup\n(?s:.*)# end Zulip setup\n|(?:source /srv/zulip-py3-venv/bin/activate\n|cd /srv/zulip\n)+|\Z",
            lambda m: zulip_code,
            code,
            count=1,
        )

    new_code = patch_code(code)
    if new_code != code:
        assert patch_code(new_code) == new_code
        with open(f"{shell_profile_path}.new", "w") as f:
            f.write(new_code)
        os.rename(f"{shell_profile_path}.new", shell_profile_path)


def setup_bash_profile() -> None:
    """Select a bash profile file to add setup code to."""

    BASH_PROFILES = [
        os.path.expanduser(p) for p in ("~/.bash_profile", "~/.bash_login", "~/.profile")
    ]

    def clear_old_profile() -> None:
        # An earlier version of this script would output a fresh .bash_profile
        # even though a .profile existed in the image used. As a convenience to
        # existing developers (and, perhaps, future developers git-bisecting the
        # provisioning scripts), check for this situation, and blow away the
        # created .bash_profile if one is found.

        BASH_PROFILE = BASH_PROFILES[0]
        DOT_PROFILE = BASH_PROFILES[2]
        OLD_PROFILE_TEXT = "source /srv/zulip-py3-venv/bin/activate\ncd /srv/zulip\n"

        if os.path.exists(DOT_PROFILE):
            try:
                with open(BASH_PROFILE) as f:
                    profile_contents = f.read()
                if profile_contents == OLD_PROFILE_TEXT:
                    os.unlink(BASH_PROFILE)
            except FileNotFoundError:
                pass

    clear_old_profile()

    for candidate_profile in BASH_PROFILES:
        if os.path.exists(candidate_profile):
            setup_shell_profile(candidate_profile)
            break
    else:
        # no existing bash profile found; claim .bash_profile
        setup_shell_profile(BASH_PROFILES[0])


def need_to_run_build_pygments_data() -> bool:
    if not os.path.exists("web/generated/pygments_data.json"):
        return True

    return is_digest_obsolete(
        "build_pygments_data_hash",
        build_pygments_data_paths(),
        [pygments.__version__],
    )


def need_to_run_build_timezone_data() -> bool:
    if not os.path.exists("web/generated/timezones.json"):
        return True

    return is_digest_obsolete(
        "build_timezones_data_hash",
        build_timezones_data_paths(),
        [timezones_version],
    )


def need_to_regenerate_landing_page_images() -> bool:
    if not os.path.exists("static/images/landing-page/hello/generated"):
        return True

    return is_digest_obsolete(
        "landing_page_images_hash",
        build_landing_page_images_paths(),
    )


def need_to_run_compilemessages() -> bool:
    if not os.path.exists("locale/language_name_map.json"):
        # User may have cleaned their Git checkout.
        print("Need to run compilemessages due to missing language_name_map.json")
        return True

    return is_digest_obsolete(
        "last_compilemessages_hash",
        compilemessages_paths(),
    )


def need_to_run_configure_rabbitmq(settings_list: list[str]) -> bool:
    obsolete = is_digest_obsolete(
        "last_configure_rabbitmq_hash",
        configure_rabbitmq_paths(),
        settings_list,
    )

    if obsolete:
        return True

    try:
        from zerver.lib.queue import SimpleQueueClient

        SimpleQueueClient()
        return False
    except Exception:
        return True


def main(options: argparse.Namespace) -> int:
    setup_bash_profile()
    setup_shell_profile("~/.zprofile")

    # This needs to happen before anything that imports zproject.settings.
    run(["scripts/setup/generate_secrets.py", "--development"])

    create_var_directories()

    # The `build_emoji` script requires `emoji-datasource` package
    # which we install via npm; thus this step is after installing npm
    # packages.
    run(["tools/setup/emoji/build_emoji"])

    # copy over static files from the zulip_bots and integrations packages
    generate_zulip_bots_static_files()
    generate_pythonapi_integrations_static_files()

    if options.is_force or need_to_run_build_pygments_data():
        run(["tools/setup/build_pygments_data"])
        write_new_digest(
            "build_pygments_data_hash",
            build_pygments_data_paths(),
            [pygments.__version__],
        )
    else:
        print("No need to run `tools/setup/build_pygments_data`.")

    if options.is_force or need_to_run_build_timezone_data():
        run(["tools/setup/build_timezone_values"])
        write_new_digest(
            "build_timezones_data_hash",
            build_timezones_data_paths(),
            [timezones_version],
        )
    else:
        print("No need to run `tools/setup/build_timezone_values`.")

    if options.is_force or need_to_regenerate_landing_page_images():
        run(["tools/setup/generate_landing_page_images.py"])
        write_new_digest(
            "landing_page_images_hash",
            build_landing_page_images_paths(),
        )

    if not options.is_build_release_tarball_only:
        # The following block is skipped when we just need the development
        # environment to build a release tarball.

        # Need to set up Django before using template_status
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zproject.settings")
        import django

        django.setup()

        from django.conf import settings

        from zerver.lib.test_fixtures import (
            DEV_DATABASE,
            TEST_DATABASE,
            destroy_leaked_test_databases,
        )

        assert settings.RABBITMQ_PASSWORD is not None
        if options.is_force or need_to_run_configure_rabbitmq([settings.RABBITMQ_PASSWORD]):
            run_as_root(["scripts/setup/configure-rabbitmq"])
            write_new_digest(
                "last_configure_rabbitmq_hash",
                configure_rabbitmq_paths(),
                [settings.RABBITMQ_PASSWORD],
            )
        else:
            print("No need to run `scripts/setup/configure-rabbitmq.")

        dev_template_db_status = DEV_DATABASE.template_status()
        if options.is_force or dev_template_db_status == "needs_rebuild":
            run(["tools/setup/postgresql-init-dev-db"])
            if options.skip_dev_db_build:
                # We don't need to build the manual development
                # database on continuous integration for running tests, so we can
                # just leave it as a template db and save a minute.
                #
                # Important: We don't write a digest as that would
                # incorrectly claim that we ran migrations.
                pass
            else:
                run(["tools/rebuild-dev-database"])
                DEV_DATABASE.write_new_db_digest()
        elif dev_template_db_status == "run_migrations":
            DEV_DATABASE.run_db_migrations()
        elif dev_template_db_status == "current":
            print("No need to regenerate the dev DB.")

        test_template_db_status = TEST_DATABASE.template_status()
        if options.is_force or test_template_db_status == "needs_rebuild":
            run(["tools/setup/postgresql-init-test-db"])
            run(["tools/rebuild-test-database"])
            TEST_DATABASE.write_new_db_digest()
        elif test_template_db_status == "run_migrations":
            TEST_DATABASE.run_db_migrations()
        elif test_template_db_status == "current":
            print("No need to regenerate the test DB.")

        if options.is_force or need_to_run_compilemessages():
            run(["./manage.py", "compilemessages", "--ignore=*"])
            write_new_digest(
                "last_compilemessages_hash",
                compilemessages_paths(),
            )
        else:
            print("No need to run `manage.py compilemessages`.")

        destroyed = destroy_leaked_test_databases()
        if destroyed:
            print(f"Dropped {destroyed} stale test databases!")

    clean_unused_caches.main(
        argparse.Namespace(
            threshold_days=6,
            # The defaults here should match parse_cache_script_args in zulip_tools.py
            dry_run=False,
            verbose=False,
            no_headings=True,
        )
    )

    # Keeping this cache file around can cause eslint to throw
    # random TypeErrors when new/updated dependencies are added
    if os.path.isfile(".eslintcache"):
        # Remove this block when
        # https://github.com/eslint/eslint/issues/11639 is fixed
        # upstream.
        os.remove(".eslintcache")

    # Clean up the root of the `var/` directory for various
    # testing-related files that we have migrated to
    # `var/<uuid>/test-backend`.
    print("Cleaning var/ directory files...")
    var_paths = glob.glob("var/test*")
    var_paths.append("var/bot_avatar")
    for path in var_paths:
        try:
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
        except FileNotFoundError:
            pass

    version_file = os.path.join(UUID_VAR_PATH, "provision_version")
    print(f"writing to {version_file}\n")
    with open(version_file, "w") as f:
        f.write(".".join(map(str, PROVISION_VERSION)) + "\n")

    print()
    print(OKBLUE + "Zulip development environment setup succeeded!" + ENDC)
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--force",
        action="store_true",
        dest="is_force",
        help="Ignore all provisioning optimizations.",
    )

    parser.add_argument(
        "--build-release-tarball-only",
        action="store_true",
        dest="is_build_release_tarball_only",
        help="Provision for test suite with production settings.",
    )

    parser.add_argument(
        "--skip-dev-db-build", action="store_true", help="Don't run migrations on dev database."
    )

    options = parser.parse_args()
    sys.exit(main(options))
```

--------------------------------------------------------------------------------

---[FILE: sanity_check.py]---
Location: zulip-main/tools/lib/sanity_check.py

```python
import os
import pwd
import sys


def check_venv(filename: str) -> None:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    venv = os.path.realpath(os.path.join(BASE_DIR, ".venv"))
    if sys.prefix != venv:
        print(f"You need to run {filename} inside a Zulip dev environment.")
        user_id = os.getuid()
        user_name = pwd.getpwuid(user_id).pw_name

        print(f"You can `source {venv}/bin/activate` to enter the development environment.")

        if user_name not in ("vagrant", "zulipdev"):
            print()
            print("If you are using Vagrant, first run `vagrant ssh` to enter the Vagrant guest.")
        sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: template_parser.py]---
Location: zulip-main/tools/lib/template_parser.py
Signals: Django

```python
from collections.abc import Callable

from typing_extensions import override

from .html_elements import FOREIGN_CONTEXTS, VALID_HTML_CONTEXTS, html_context_fallbacks


class FormattedError(Exception):
    pass


class TemplateParserError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message

    @override
    def __str__(self) -> str:
        return self.message


class TokenizationError(Exception):
    def __init__(self, message: str, line_content: str | None = None) -> None:
        self.message = message
        self.line_content = line_content


class TokenizerState:
    def __init__(self) -> None:
        self.i = 0
        self.line = 1
        self.col = 1


class Token:
    def __init__(self, kind: str, s: str, tag: str, line: int, col: int, line_span: int) -> None:
        self.kind = kind
        self.s = s
        self.tag = tag
        self.line = line
        self.col = col
        self.line_span = line_span

        # These get set during the validation pass.
        self.start_token: Token | None = None
        self.end_token: Token | None = None

        # These get set during the pretty-print phase.
        self.new_s = ""
        self.indent: str | None = None
        self.orig_indent: str | None = None
        self.child_indent: str | None = None
        self.indent_is_final = False
        self.parent_token: Token | None = None


def tokenize(text: str, template_format: str | None = None) -> list[Token]:
    in_code_block = False

    def advance(n: int) -> None:
        for _ in range(n):
            state.i += 1
            if state.i >= 0 and text[state.i - 1] == "\n":
                state.line += 1
                state.col = 1
            else:
                state.col += 1

    def looking_at(s: str) -> bool:
        return text[state.i : state.i + len(s)] == s

    def looking_at_htmlcomment() -> bool:
        return looking_at("<!--")

    def looking_at_handlebars_comment() -> bool:
        return looking_at("{{!")

    def looking_at_djangocomment() -> bool:
        return template_format == "django" and looking_at("{#")

    def looking_at_handlebars_partial() -> bool:
        return template_format == "handlebars" and looking_at("{{>")

    def looking_at_handlebars_partial_block() -> bool:
        return template_format == "handlebars" and looking_at("{{#>")

    def looking_at_handlebars_triple_stache() -> bool:
        return template_format == "handlebars" and (looking_at("{{{") or looking_at("{{~{"))

    def looking_at_html_start() -> bool:
        return looking_at("<") and not looking_at("</")

    def looking_at_html_end() -> bool:
        return looking_at("</")

    def looking_at_handlebars_start() -> bool:
        return looking_at("{{#") or looking_at("{{^") or looking_at("{{~#")

    def looking_at_handlebars_else() -> bool:
        return template_format == "handlebars" and looking_at("{{else")

    def looking_at_template_var() -> bool:
        return looking_at("{")

    def looking_at_handlebars_end() -> bool:
        return template_format == "handlebars" and (looking_at("{{/") or looking_at("{{~/"))

    def looking_at_django_start() -> bool:
        return template_format == "django" and looking_at("{% ")

    def looking_at_django_else() -> bool:
        return template_format == "django" and (
            looking_at("{% else")
            or looking_at("{% elif")
            or looking_at("{%- else")
            or looking_at("{%- elif")
        )

    def looking_at_django_end() -> bool:
        return template_format == "django" and looking_at("{% end")

    def looking_at_jinja2_end_whitespace_stripped() -> bool:
        return template_format == "django" and looking_at("{%- end")

    def looking_at_jinja2_start_whitespace_stripped_type2() -> bool:
        # This function detects tag like {%- if foo -%}...{% endif %}
        return template_format == "django" and looking_at("{%-") and not looking_at("{%- end")

    def looking_at_whitespace() -> bool:
        return looking_at("\n") or looking_at(" ")

    state = TokenizerState()
    tokens: list[Token] = []

    while state.i < len(text):
        try:
            if in_code_block:
                in_code_block = False
                s = get_code(text, state.i)
                if s == "":
                    continue
                tag = ""
                kind = "code"
            elif looking_at_htmlcomment():
                s = get_html_comment(text, state.i)
                tag = s[4:-3]
                kind = "html_comment"
            elif looking_at_handlebars_comment():
                s = get_handlebars_comment(text, state.i)
                tag = s[3:-2]
                kind = "handlebars_comment"
            elif looking_at_djangocomment():
                s = get_django_comment(text, state.i)
                tag = s[2:-2]
                kind = "django_comment"
            elif looking_at_handlebars_partial():
                s = get_handlebars_partial(text, state.i)
                tag = s[9:-2]
                kind = "handlebars_partial"
            elif looking_at_handlebars_partial_block():
                s = get_handlebars_partial(text, state.i)
                tag = s[5:-2].split(None, 1)[0]
                kind = "handlebars_partial_block"
            elif looking_at_html_start():
                s = get_html_tag(text, state.i)
                if s.endswith("/>"):
                    end_offset = -2
                else:
                    end_offset = -1
                tag_parts = s[1:end_offset].split()

                if not tag_parts:
                    raise TemplateParserError("Tag name missing")

                tag = tag_parts[0]

                if tag == "!DOCTYPE":
                    kind = "html_doctype"
                elif s.endswith("/>"):
                    kind = "html_singleton"
                else:
                    kind = "html_start"
                if tag in ("code", "pre", "script"):
                    in_code_block = True
            elif looking_at_html_end():
                s = get_html_tag(text, state.i)
                tag = s[2:-1]
                kind = "html_end"
            elif looking_at_handlebars_else():
                s = get_handlebars_tag(text, state.i)
                tag = "else"
                kind = "handlebars_else"
            elif looking_at_handlebars_triple_stache():
                s = get_handlebars_triple_stache_tag(text, state.i)
                start_offset = end_offset = 3
                if s.startswith("{{~{"):
                    start_offset += 1
                if s.endswith("}~}}"):
                    end_offset += 1
                tag = s[start_offset:-end_offset].strip()
                if not tag.endswith("_html"):
                    raise TemplateParserError(
                        "Unescaped variables in triple staches {{{ }}} must be suffixed with `_html`"
                    )
                kind = "handlebars_triple_stache"
            elif looking_at_handlebars_start():
                s = get_handlebars_tag(text, state.i)
                tag = s[3:-2].split()[0].strip("#").removeprefix("*")
                kind = "handlebars_start"
            elif looking_at_handlebars_end():
                s = get_handlebars_tag(text, state.i)
                tag = s[3:-2].strip("/#~")
                kind = "handlebars_end"
            elif looking_at_django_else():
                s = get_django_tag(text, state.i)
                tag = "else"
                kind = "django_else"
            elif looking_at_django_end():
                s = get_django_tag(text, state.i)
                tag = s[6:-3]
                kind = "django_end"
            elif looking_at_django_start():
                # must check this after end/else
                s = get_django_tag(text, state.i)
                tag = s[3:-2].split()[0]
                kind = "django_start"

                if s[-3] == "-":
                    kind = "jinja2_whitespace_stripped_start"
            elif looking_at_jinja2_end_whitespace_stripped():
                s = get_django_tag(text, state.i)
                tag = s[7:-3]
                kind = "jinja2_whitespace_stripped_end"
            elif looking_at_jinja2_start_whitespace_stripped_type2():
                s = get_django_tag(text, state.i, stripped=True)
                tag = s[3:-3].split()[0]
                kind = "jinja2_whitespace_stripped_type2_start"
            elif looking_at_template_var():
                # order is important here
                s = get_template_var(text, state.i)
                tag = "var"
                kind = "template_var"
            elif looking_at("\n"):
                s = "\n"
                tag = "newline"
                kind = "newline"
            elif looking_at(" "):
                s = get_spaces(text, state.i)
                tag = ""
                if not tokens or tokens[-1].kind == "newline":
                    kind = "indent"
                else:
                    kind = "whitespace"
            elif text[state.i] in "{<":
                snippet = text[state.i :][:15]
                raise AssertionError(f"tool cannot parse {snippet}")
            else:
                s = get_text(text, state.i)
                if s == "":
                    continue
                tag = ""
                kind = "text"
        except TokenizationError as e:
            raise FormattedError(
                f'''{e.message} at line {state.line} col {state.col}:"{e.line_content}"''',
            )

        line_span = len(s.strip("\n").split("\n"))
        token = Token(
            kind=kind,
            s=s,
            tag=tag.strip(),
            line=state.line,
            col=state.col,
            line_span=line_span,
        )
        tokens.append(token)
        advance(len(s))

    return tokens


# The following excludes some obscure tags that are never used
# in Zulip code.
HTML_INLINE_TAGS = {
    "a",
    "b",
    "br",
    "button",
    "cite",
    "code",
    "em",
    "i",
    "img",
    "input",
    "kbd",
    "label",
    "object",
    "script",
    "select",
    "small",
    "span",
    "strong",
    "textarea",
}


def tag_flavor(token: Token) -> str | None:
    kind = token.kind
    tag = token.tag
    if kind in (
        "code",
        "django_comment",
        "handlebars_comment",
        "handlebars_partial",
        "html_comment",
        "html_doctype",
        "html_singleton",
        "indent",
        "newline",
        "template_var",
        "text",
        "whitespace",
        "handlebars_triple_stache",
    ):
        return None

    if kind in ("handlebars_start", "handlebars_partial_block", "html_start"):
        return "start"
    elif kind in (
        "django_else",
        "django_end",
        "handlebars_else",
        "handlebars_end",
        "html_end",
        "jinja2_whitespace_stripped_end",
    ):
        return "end"
    elif kind in {
        "django_start",
        "django_else",
        "jinja2_whitespace_stripped_start",
        "jinja2_whitespace_stripped_type2_start",
    }:
        if is_django_block_tag(tag):
            return "start"
        else:
            return None
    else:
        raise AssertionError(f"tools programmer neglected to handle {kind} tokens")


def validate(
    fn: str | None = None,
    text: str | None = None,
    template_format: str | None = None,
) -> list[Token]:
    assert fn or text

    if fn is None:
        fn = "<in memory file>"

    if text is None:
        with open(fn) as f:
            text = f.read()

    lines = text.split("\n")

    try:
        tokens = tokenize(text, template_format=template_format)
    except FormattedError as e:
        raise TemplateParserError(
            f"""
            fn: {fn}
            {e}"""
        )

    prevent_whitespace_violations(fn, tokens)

    class State:
        def __init__(self, func: Callable[[Token | None], None]) -> None:
            self.depth = 0
            self.matcher = func
            self.html_context = "unknown"

    def no_start_tag(token: Token | None) -> None:
        assert token
        raise TemplateParserError(
            f"""
            No start tag
            fn: {fn}
            end tag:
                {token.tag}
                line {token.line}, col {token.col}
            """
        )

    state = State(no_start_tag)

    def start_tag_matcher(start_token: Token) -> None:
        state.depth += 1
        start_tag = start_token.tag.strip("~")
        start_line = start_token.line
        start_col = start_token.col

        old_matcher = state.matcher
        old_html_context = state.html_context

        def f(end_token: Token | None) -> None:
            if end_token is None:
                raise TemplateParserError(
                    f"""

    Problem with {fn}
    Missing end tag for the token at row {start_line} {start_col}!

{start_token.s}

    It's possible you have a typo in a token that you think is
    matching this tag.
                    """
                )

            is_else_tag = end_token.tag == "else"

            end_tag = end_token.tag.strip("~")
            end_line = end_token.line
            end_col = end_token.col

            def report_problem() -> str | None:
                if (start_tag == "code") and (end_line == start_line + 1):
                    return "Code tag is split across two lines."

                if is_else_tag:
                    # We are not completely rigorous about having a sensible
                    # order of if/elif/elif/else, but we catch obviously
                    # mismatching else tags.
                    if start_tag not in ("if", "else", "unless"):
                        return f"Unexpected else/elif tag encountered after {start_tag} tag."
                elif start_tag != end_tag:
                    return f"Mismatched tags: ({start_tag} != {end_tag})"

                return None

            problem = report_problem()
            if problem:
                raise TemplateParserError(
                    f"""
                    fn: {fn}
                   {problem}
                    start:
                        {start_token.s}
                        line {start_line}, col {start_col}
                    end tag:
                        {end_tag}
                        line {end_line}, col {end_col}
                    """
                )

            if not is_else_tag:
                state.matcher = old_matcher
                state.html_context = old_html_context
                state.depth -= 1

            # TODO: refine this for the else/elif use cases
            end_token.start_token = start_token
            start_token.end_token = end_token

        state.matcher = f

    for token in tokens:
        kind = token.kind
        tag = token.tag

        flavor = tag_flavor(token)
        if flavor == "start":
            start_tag_matcher(token)
        elif flavor == "end":
            state.matcher(token)

        if kind in ("html_start", "html_singleton"):
            for context in html_context_fallbacks(state.html_context):
                if (tag, context) in VALID_HTML_CONTEXTS:
                    new_context = VALID_HTML_CONTEXTS[tag, context]
                    if new_context == "transparent":
                        new_context = state.html_context
                    break
            else:
                if "-" in tag and "phrasing" in html_context_fallbacks(state.html_context):
                    new_context = state.html_context  # custom elements
                elif state.html_context in FOREIGN_CONTEXTS:
                    new_context = state.html_context  # unchecked foreign elements
                else:
                    raise TemplateParserError(
                        f"<{tag}> is not valid in {state.html_context} context"
                        + (
                            ' (consider growing HTML_CONTEXT_FALLBACKS["unknown"]?)'
                            if state.html_context == "unknown"
                            else ""
                        )
                        + f" at {fn} line {token.line}, col {token.col}"
                    )

            if new_context not in FOREIGN_CONTEXTS:
                if kind == "html_start" and new_context == "void":
                    raise TemplateParserError(
                        f"Tag must be self-closing: {tag} at {fn} line {token.line}, col {token.col}"
                    )
                elif kind == "html_singleton" and new_context != "void":
                    raise TemplateParserError(
                        f"Tag must not be self-closing: {tag} at {fn} line {token.line}, col {token.col}"
                    )

            if kind == "html_start":
                state.html_context = new_context

    if state.depth != 0:
        state.matcher(None)

    ensure_matching_indentation(fn, tokens, lines)

    return tokens


def ensure_matching_indentation(fn: str, tokens: list[Token], lines: list[str]) -> None:
    def has_bad_indentation() -> bool:
        is_inline_tag = start_tag in HTML_INLINE_TAGS and start_token.kind == "html_start"

        if end_line > start_line + 1:
            if is_inline_tag:
                end_row_text = lines[end_line - 1]
                if end_row_text.lstrip().startswith(end_token.s) and end_col != start_col:
                    return True
            else:
                if end_col != start_col:
                    return True

        return False

    for token in tokens:
        if token.start_token is None:
            continue

        end_token = token

        start_token = token.start_token
        start_line = start_token.line
        start_col = start_token.col
        start_tag = start_token.tag
        end_tag = end_token.tag.strip("~")
        end_line = end_token.line
        end_col = end_token.col

        if has_bad_indentation():
            raise TemplateParserError(
                f"""
                fn: {fn}
                Indentation for start/end tags does not match.
                start tag: {start_token.s}

                start:
                    line {start_line}, col {start_col}
                end:
                    {end_tag}
                    line {end_line}, col {end_col}
                """
            )


def prevent_extra_newlines(fn: str, tokens: list[Token]) -> None:
    count = 0

    for token in tokens:
        if token.kind != "newline":
            count = 0
            continue

        count += 1
        if count >= 4:
            raise TemplateParserError(
                f"""Please avoid so many blank lines near row {token.line} in {fn}."""
            )


def prevent_whitespace_violations(fn: str, tokens: list[Token]) -> None:
    if tokens[0].kind in ("indent", "whitespace"):
        raise TemplateParserError(f" Please remove the whitespace at the beginning of {fn}.")

    prevent_extra_newlines(fn, tokens)

    for i in range(1, len(tokens) - 1):
        token = tokens[i]
        next_token = tokens[i + 1]

        if token.kind == "indent":
            if next_token.kind in ("indent", "whitespace"):
                raise AssertionError("programming error parsing indents")

            if next_token.kind == "newline":
                raise TemplateParserError(
                    f"""Please just make row {token.line} in {fn} a truly blank line (no spaces)."""
                )

            if len(token.s) % 4 != 0:
                raise TemplateParserError(
                    f"""
                        Please use 4-space indents for template files. Most of our
                        codebase (including Python and JavaScript) uses 4-space indents,
                        so it's worth investing in configuring your editor to use
                        4-space indents for files like
                        {fn}

                        The line at row {token.line} is indented with {len(token.s)} spaces.
                    """
                )

        if token.kind == "whitespace":
            if len(token.s) > 1:
                raise TemplateParserError(
                    f"""
                        We did not expect this much whitespace at row {token.line} column {token.col} in {fn}.
                    """
                )
            if next_token.kind == "newline":
                raise TemplateParserError(
                    f"""
                        Unexpected trailing whitespace at row {token.line} column {token.col} in {fn}.
                    """
                )


def is_django_block_tag(tag: str) -> bool:
    return tag in [
        "autoescape",
        "block",
        "comment",
        "for",
        "if",
        "ifequal",
        "macro",
        "verbatim",
        "blocktrans",
        "trans",
        "raw",
        "with",
    ]


def get_handlebars_tag(text: str, i: int) -> str:
    end = i + 2
    while end < len(text) - 2 and text[end] != "}":
        end += 1
    if text[end] != "}" or text[end + 1] != "}":
        raise TokenizationError('Tag missing "}}"', text[i : end + 2])
    s = text[i : end + 2]
    return s


def get_handlebars_triple_stache_tag(text: str, i: int) -> str:
    end = i + 3
    while end < len(text) - 3 and text[end] != "}":
        end += 1
    if text[end : end + 3] == "}}}":
        return text[i : end + 3]
    elif end + 4 <= len(text) and text[end : end + 4] == "}~}}":
        return text[i : end + 4]
    else:
        raise TokenizationError('Tag missing "}}}"', text[i : end + 3])


def get_spaces(text: str, i: int) -> str:
    s = ""
    while i < len(text) and text[i] in " ":
        s += text[i]
        i += 1
    return s


def get_code(text: str, i: int) -> str:
    s = ""
    while i < len(text) and text[i] not in "<":
        s += text[i]
        i += 1
    return s


def get_text(text: str, i: int) -> str:
    s = ""
    while i < len(text) and text[i] not in "{<":
        s += text[i]
        i += 1
    return s.strip()


def get_django_tag(text: str, i: int, stripped: bool = False) -> str:
    end = i + 2
    if stripped:
        end += 1
    while end < len(text) - 1 and text[end] != "%":
        end += 1
    if text[end] != "%" or text[end + 1] != "}":
        raise TokenizationError('Tag missing "%}"', text[i : end + 2])
    s = text[i : end + 2]
    return s


def get_html_tag(text: str, i: int) -> str:
    quote_count = 0
    end = i + 1
    unclosed_end = 0
    while end < len(text) and (text[end] != ">" or (quote_count % 2 != 0 and text[end] != "<")):
        if text[end] == '"':
            quote_count += 1
        if not unclosed_end and text[end] == "<":
            unclosed_end = end
        end += 1
    if quote_count % 2 != 0:
        if unclosed_end:
            raise TokenizationError("Unbalanced quotes", text[i:unclosed_end])
        else:
            raise TokenizationError("Unbalanced quotes", text[i : end + 1])
    if end == len(text) or text[end] != ">":
        raise TokenizationError('Tag missing ">"', text[i : end + 1])
    s = text[i : end + 1]
    return s


def get_html_comment(text: str, i: int) -> str:
    end = i + 7
    unclosed_end = 0
    while end <= len(text):
        if text[end - 3 : end] == "-->":
            return text[i:end]
        if not unclosed_end and text[end] == "<":
            unclosed_end = end
        end += 1
    raise TokenizationError("Unclosed comment", text[i:unclosed_end])


def get_handlebars_comment(text: str, i: int) -> str:
    end = i + 5
    unclosed_end = 0
    while end <= len(text):
        if text[end - 2 : end] == "}}":
            return text[i:end]
        if not unclosed_end and text[end] == "<":
            unclosed_end = end
        end += 1
    raise TokenizationError("Unclosed comment", text[i:unclosed_end])


def get_template_var(text: str, i: int) -> str:
    end = i + 3
    unclosed_end = 0
    while end <= len(text):
        if text[end - 1] == "}":
            if end < len(text) and text[end] == "}":
                end += 1
            return text[i:end]
        if not unclosed_end and text[end] == "<":
            unclosed_end = end
        end += 1
    raise TokenizationError("Unclosed var", text[i:unclosed_end])


def get_django_comment(text: str, i: int) -> str:
    end = i + 4
    unclosed_end = 0
    while end <= len(text):
        if text[end - 2 : end] == "#}":
            return text[i:end]
        if not unclosed_end and text[end] == "<":
            unclosed_end = end
        end += 1
    raise TokenizationError("Unclosed comment", text[i:unclosed_end])


def get_handlebars_partial(text: str, i: int) -> str:
    """Works for both partials and partial blocks."""
    end = i + 10
    unclosed_end = 0
    while end <= len(text):
        if text[end - 2 : end] == "}}":
            return text[i:end]
        if not unclosed_end and text[end] == "<":
            unclosed_end = end
        end += 1
    raise TokenizationError("Unclosed partial", text[i:unclosed_end])
```

--------------------------------------------------------------------------------

````

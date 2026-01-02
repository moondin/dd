---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 920
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 920 of 1290)

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

---[FILE: fenced_code.py]---
Location: zulip-main/zerver/lib/markdown/fenced_code.py
Signals: Django

```python
"""
Fenced Code Extension for Python Markdown
=========================================

This extension adds Fenced Code Blocks to Python-Markdown.

    >>> import markdown
    >>> text = '''
    ... A paragraph before a fenced code block:
    ...
    ... ~~~
    ... Fenced code block
    ... ~~~
    ... '''
    >>> html = markdown.markdown(text, extensions=['fenced_code'])
    >>> print html
    <p>A paragraph before a fenced code block:</p>
    <pre><code>Fenced code block
    </code></pre>

Works with safe_mode also (we check this because we are using the HtmlStash):

    >>> print markdown.markdown(text, extensions=['fenced_code'], safe_mode='replace')
    <p>A paragraph before a fenced code block:</p>
    <pre><code>Fenced code block
    </code></pre>

Include tilde's in a code block and wrap with blank lines:

    >>> text = '''
    ... ~~~~~~~~
    ...
    ... ~~~~
    ... ~~~~~~~~'''
    >>> print markdown.markdown(text, extensions=['fenced_code'])
    <pre><code>
    ~~~~
    </code></pre>

Removes trailing whitespace from code blocks that cause horizontal scrolling
    >>> import markdown
    >>> text = '''
    ... A paragraph before a fenced code block:
    ...
    ... ~~~
    ... Fenced code block    \t\t\t\t\t\t\t
    ... ~~~
    ... '''
    >>> html = markdown.markdown(text, extensions=['fenced_code'])
    >>> print html
    <p>A paragraph before a fenced code block:</p>
    <pre><code>Fenced code block
    </code></pre>

Language tags:

    >>> text = '''
    ... ~~~~{.python}
    ... # Some python code
    ... ~~~~'''
    >>> print markdown.markdown(text, extensions=['fenced_code'])
    <pre><code class="python"># Some python code
    </code></pre>

Copyright 2007-2008 [Waylan Limberg](http://achinghead.com/).

Project website: <http://packages.python.org/Markdown/extensions/fenced_code_blocks.html>
Contact: markdown@freewisdom.org

License: BSD (see ../docs/LICENSE for details)

Dependencies:
* [Python 2.4+](http://python.org)
* [Markdown 2.0+](http://packages.python.org/Markdown/)
* [Pygments (optional)](http://pygments.org)

"""

import re
from collections.abc import Callable, Iterable, Mapping, MutableSequence, Sequence
from typing import Any

import lxml.html
from django.utils.html import escape
from markdown import Markdown
from markdown.extensions import Extension, codehilite
from markdown.extensions.codehilite import CodeHiliteExtension, parse_hl_lines
from markdown.preprocessors import Preprocessor
from pygments.lexers import find_lexer_class_by_name
from pygments.util import ClassNotFound
from typing_extensions import override

from zerver.lib.exceptions import MarkdownRenderingError
from zerver.lib.markdown.priorities import PREPROCESSOR_PRIORITIES
from zerver.lib.tex import render_tex

# Global vars
FENCE_RE = re.compile(
    r"""
    # ~~~ or ```
    (?P<fence>
        ^(?:~{3,}|`{3,})
    )

    [ ]* # spaces

    (?:
        # language, like ".py" or "{javascript}"
        \{?\.?
        (?P<lang>
            [a-zA-Z0-9_+-./#]+
        ) # "py" or "javascript"

        [ ]* # spaces

        # header for features that use fenced block header syntax (like spoilers)
        (?P<header>
            [^ ~`][^~`]*
        )?
        \}?
    )?
    $
    """,
    re.VERBOSE,
)


CODE_WRAP = "<pre><code{}>{}\n</code></pre>"
LANG_TAG = ' class="{}"'


def validate_curl_content(lines: list[str]) -> None:
    error_msg = """
Missing required -X argument in curl command:

{command}
""".strip()

    for line in lines:
        regex = r'curl [-](sS)?X "?(GET|DELETE|PATCH|POST)"?'
        if line.startswith("curl") and re.search(regex, line) is None:
            raise MarkdownRenderingError(error_msg.format(command=line.strip()))


CODE_VALIDATORS: dict[str | None, Callable[[list[str]], None]] = {
    "curl": validate_curl_content,
}


# This function is similar to one used in fenced_code.ts
def get_unused_fence(content: str) -> str:
    # Define the regular expression pattern to match ``` fences
    fence_length_re = re.compile(r"^ {0,3}(`{3,})", re.MULTILINE)

    # Initialize the length variable to 3, corresponding to default fence length
    length = 3
    matches = fence_length_re.findall(content)
    for match in matches:
        length = max(length, len(match) + 1)

    return "`" * length


class FencedCodeExtension(Extension):
    def __init__(self, config: Mapping[str, Any] = {}) -> None:
        self.config = {
            "run_content_validators": [
                config.get("run_content_validators", False),
                "Boolean specifying whether to run content validation code in CodeHandler",
            ],
        }

        for key, value in config.items():
            self.setConfig(key, value)

    @override
    def extendMarkdown(self, md: Markdown) -> None:
        """Add FencedBlockPreprocessor to the Markdown instance."""
        md.registerExtension(self)
        processor = FencedBlockPreprocessor(
            md, run_content_validators=self.config["run_content_validators"][0]
        )
        md.preprocessors.register(
            processor, "fenced_code_block", PREPROCESSOR_PRIORITIES["fenced_code_block"]
        )


class ZulipBaseHandler:
    def __init__(
        self,
        processor: "FencedBlockPreprocessor",
        output: MutableSequence[str],
        fence: str | None = None,
        process_contents: bool = False,
    ) -> None:
        self.processor = processor
        self.output = output
        self.fence = fence
        self.process_contents = process_contents
        self.lines: list[str] = []

    def handle_line(self, line: str) -> None:
        if line.rstrip() == self.fence:
            self.done()
        else:
            self.lines.append(line.rstrip())

    def done(self) -> None:
        if self.lines:
            text = "\n".join(self.lines)
            text = self.format_text(text)

            # For code blocks, the contents should not receive further
            # processing.  Whereas with quote and spoiler blocks, we
            # explicitly want Markdown formatting of the content
            # inside. This behavior is controlled by the
            # process_contents configuration flag.
            if not self.process_contents:
                text = self.processor.placeholder(text)

            processed_lines = text.split("\n")
            self.output.append("")
            self.output.extend(processed_lines)
            self.output.append("")
        self.processor.pop()

    def format_text(self, text: str) -> str:
        """Returns a formatted text.
        Subclasses should override this method.
        """
        raise NotImplementedError


def generic_handler(
    processor: "FencedBlockPreprocessor",
    output: MutableSequence[str],
    fence: str,
    lang: str | None,
    header: str | None,
    run_content_validators: bool = False,
    default_language: str | None = None,
) -> ZulipBaseHandler:
    if lang is not None:
        lang = lang.lower()
    if lang in ("quote", "quoted"):
        return QuoteHandler(processor, output, fence, default_language)
    elif lang == "math":
        return TexHandler(processor, output, fence)
    elif lang == "spoiler":
        return SpoilerHandler(processor, output, fence, header)
    else:
        return CodeHandler(processor, output, fence, lang, run_content_validators)


def check_for_new_fence(
    processor: "FencedBlockPreprocessor",
    output: MutableSequence[str],
    line: str,
    run_content_validators: bool = False,
    default_language: str | None = None,
) -> None:
    m = FENCE_RE.match(line)
    if m:
        fence = m.group("fence")
        lang: str | None = m.group("lang")
        header: str | None = m.group("header")
        if not lang and default_language:
            lang = default_language
        handler = generic_handler(
            processor, output, fence, lang, header, run_content_validators, default_language
        )
        processor.push(handler)
    else:
        output.append(line)


class OuterHandler(ZulipBaseHandler):
    def __init__(
        self,
        processor: "FencedBlockPreprocessor",
        output: MutableSequence[str],
        run_content_validators: bool = False,
        default_language: str | None = None,
    ) -> None:
        self.run_content_validators = run_content_validators
        self.default_language = default_language
        super().__init__(processor, output)

    @override
    def handle_line(self, line: str) -> None:
        check_for_new_fence(
            self.processor, self.output, line, self.run_content_validators, self.default_language
        )


class CodeHandler(ZulipBaseHandler):
    def __init__(
        self,
        processor: "FencedBlockPreprocessor",
        output: MutableSequence[str],
        fence: str,
        lang: str | None,
        run_content_validators: bool = False,
    ) -> None:
        self.lang = lang
        self.run_content_validators = run_content_validators
        super().__init__(processor, output, fence)

    @override
    def done(self) -> None:
        # run content validators (if any)
        if self.run_content_validators:
            validator = CODE_VALIDATORS.get(self.lang, lambda text: None)
            validator(self.lines)
        super().done()

    @override
    def format_text(self, text: str) -> str:
        return self.processor.format_code(self.lang, text)


class QuoteHandler(ZulipBaseHandler):
    def __init__(
        self,
        processor: "FencedBlockPreprocessor",
        output: MutableSequence[str],
        fence: str,
        default_language: str | None = None,
    ) -> None:
        self.default_language = default_language
        super().__init__(processor, output, fence, process_contents=True)

    @override
    def handle_line(self, line: str) -> None:
        if line.rstrip() == self.fence:
            self.done()
        else:
            check_for_new_fence(
                self.processor, self.lines, line, default_language=self.default_language
            )

    @override
    def format_text(self, text: str) -> str:
        return self.processor.format_quote(text)


class SpoilerHandler(ZulipBaseHandler):
    def __init__(
        self,
        processor: "FencedBlockPreprocessor",
        output: MutableSequence[str],
        fence: str,
        spoiler_header: str | None,
    ) -> None:
        self.spoiler_header = spoiler_header
        super().__init__(processor, output, fence, process_contents=True)

    @override
    def handle_line(self, line: str) -> None:
        if line.rstrip() == self.fence:
            self.done()
        else:
            check_for_new_fence(self.processor, self.lines, line)

    @override
    def format_text(self, text: str) -> str:
        return self.processor.format_spoiler(self.spoiler_header, text)


class TexHandler(ZulipBaseHandler):
    @override
    def format_text(self, text: str) -> str:
        return self.processor.format_tex(text)


class CodeHilite(codehilite.CodeHilite):
    def _parseHeader(self) -> None:
        # Python-Markdown has a feature to parse-and-hide shebang
        # lines present in code blocks:
        #
        # https://python-markdown.github.io/extensions/code_hilite/#shebang-no-path
        #
        # While using shebang lines for language detection is
        # reasonable, we don't want this feature because it can be
        # really confusing when doing anything else in a one-line code
        # block that starts with `!` (which would then render as an
        # empty code block!).  So we disable the feature, by
        # overriding this function, which implements it in CodeHilite
        # upstream.

        # split text into lines
        lines = self.src.split("\n")
        # Python-Markdown pops out the first line which we are avoiding here.
        # Examine first line
        fl = lines[0]

        c = re.compile(
            r"""
            (?:(?:^::+)|(?P<shebang>^[#]!)) # Shebang or 2 or more colons
            (?P<path>(?:/\w+)*[/ ])?        # Zero or 1 path
            (?P<lang>[\w#.+-]*)             # The language
            \s*                             # Arbitrary whitespace
            # Optional highlight lines, single- or double-quote-delimited
            (hl_lines=(?P<quot>"|')(?P<hl_lines>.*?)(?P=quot))?
            """,
            re.VERBOSE,
        )
        # Search first line for shebang
        m = c.search(fl)
        if m:
            # We have a match
            try:
                self.lang = m.group("lang").lower()
            except IndexError:  # nocoverage
                self.lang = None

            if self.options["linenos"] is None and m.group("shebang"):
                # Overridable and Shebang exists - use line numbers
                self.options["linenos"] = True

            self.options["hl_lines"] = parse_hl_lines(m.group("hl_lines"))

        self.src = "\n".join(lines).strip("\n")


class FencedBlockPreprocessor(Preprocessor):
    def __init__(self, md: Markdown, run_content_validators: bool = False) -> None:
        super().__init__(md)

        self.checked_for_codehilite = False
        self.run_content_validators = run_content_validators
        self.codehilite_conf: Mapping[str, Sequence[Any]] = {}

    def push(self, handler: ZulipBaseHandler) -> None:
        self.handlers.append(handler)

    def pop(self) -> None:
        self.handlers.pop()

    @override
    def run(self, lines: Iterable[str]) -> list[str]:
        """Match and store Fenced Code Blocks in the HtmlStash."""

        from zerver.lib.markdown import ZulipMarkdown

        output: list[str] = []

        processor = self
        self.handlers: list[ZulipBaseHandler] = []

        default_language = None
        if isinstance(self.md, ZulipMarkdown) and self.md.zulip_realm is not None:
            default_language = self.md.zulip_realm.default_code_block_language
        handler = OuterHandler(processor, output, self.run_content_validators, default_language)
        self.push(handler)

        for line in lines:
            self.handlers[-1].handle_line(line)

        while self.handlers:
            self.handlers[-1].done()

        # This fiddly handling of new lines at the end of our output was done to make
        # existing tests pass. Markdown is just kind of funny when it comes to new lines,
        # but we could probably remove this hack.
        if len(output) > 2 and output[-2] != "":
            output.append("")
        return output

    def format_code(self, lang: str | None, text: str) -> str:
        if lang:
            langclass = LANG_TAG.format(lang)
        else:
            langclass = ""

        # Check for code hilite extension
        if not self.checked_for_codehilite:
            for ext in self.md.registeredExtensions:
                if isinstance(ext, CodeHiliteExtension):
                    self.codehilite_conf = ext.config
                    break

            self.checked_for_codehilite = True

        # If config is not empty, then the codehighlite extension
        # is enabled, so we call it to highlight the code
        if self.codehilite_conf:
            highliter = CodeHilite(
                text,
                linenums=self.codehilite_conf["linenums"][0],
                guess_lang=self.codehilite_conf["guess_lang"][0],
                css_class=self.codehilite_conf["css_class"][0],
                style=self.codehilite_conf["pygments_style"][0],
                use_pygments=self.codehilite_conf["use_pygments"][0],
                lang=lang or None,
                noclasses=self.codehilite_conf["noclasses"][0],
                # By default, the Pygments PHP lexers won't highlight
                # code without a `<?php` marker at the start of the
                # code block, which is undesired in the common case of
                # pasting a snippet of PHP code rather than whole
                # file. The `startinline` option overrides this
                # behavior for PHP-descended languages and has no
                # effect on other lexers.
                #
                # See https://pygments.org/docs/lexers/#lexers-for-php-and-related-languages
                startinline=True,
            )

            code = highliter.hilite().rstrip("\n")
        else:
            code = CODE_WRAP.format(langclass, self._escape(text))

        # To support our "view in playground" feature, the frontend
        # needs to know what Pygments language was used for
        # highlighting this code block.  We record this in a data
        # attribute attached to the outer `pre` element.
        # Unfortunately, the pygments API doesn't offer a way to add
        # this, so we need to do it in a post-processing step.
        if lang:
            div_tag = lxml.html.fromstring(code)

            # For the value of our data element, we get the lexer
            # subclass name instead of directly using the language,
            # since that canonicalizes aliases (Eg: `js` and
            # `javascript` will be mapped to `JavaScript`).
            try:
                code_language = find_lexer_class_by_name(lang).name
            except ClassNotFound:
                # If there isn't a Pygments lexer by this name, we
                # still tag it with the user's data-code-language
                # value, since this allows hooking up a "playground"
                # for custom "languages" that aren't known to Pygments.
                code_language = lang

            div_tag.attrib["data-code-language"] = code_language
            code = lxml.html.tostring(div_tag, encoding="unicode")
        return code

    def format_quote(self, text: str) -> str:
        paragraphs = text.split("\n")
        quoted_paragraphs = []
        for paragraph in paragraphs:
            lines = paragraph.split("\n")
            quoted_paragraphs.append("\n".join("> " + line for line in lines))
        return "\n".join(quoted_paragraphs)

    def format_spoiler(self, header: str | None, text: str) -> str:
        output = []
        header_div_open_html = '<div class="spoiler-block"><div class="spoiler-header">'
        end_header_start_content_html = '</div><div class="spoiler-content" aria-hidden="true">'
        footer_html = "</div></div>"

        output.append(self.placeholder(header_div_open_html))
        if header is not None:
            output.append(header)
        output.append(self.placeholder(end_header_start_content_html))
        output.append(text)
        output.append(self.placeholder(footer_html))
        return "\n\n".join(output)

    def format_tex(self, text: str) -> str:
        paragraphs = text.split("\n\n")
        tex_paragraphs = []
        for paragraph in paragraphs:
            html = render_tex(paragraph, is_inline=False)
            if html is not None:
                tex_paragraphs.append(html)
            else:
                tex_paragraphs.append('<span class="tex-error">' + escape(paragraph) + "</span>")
        return "\n\n".join(tex_paragraphs)

    def placeholder(self, code: str) -> str:
        return self.md.htmlStash.store(code)

    def _escape(self, txt: str) -> str:
        """basic html escaping"""
        txt = txt.replace("&", "&amp;")
        txt = txt.replace("<", "&lt;")
        txt = txt.replace(">", "&gt;")
        txt = txt.replace('"', "&quot;")
        return txt


def makeExtension(*args: Any, **kwargs: Any) -> FencedCodeExtension:
    return FencedCodeExtension(kwargs)


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```

--------------------------------------------------------------------------------

---[FILE: help_settings_links.py]---
Location: zulip-main/zerver/lib/markdown/help_settings_links.py

```python
import re
from re import Match
from typing import Any

from markdown import Markdown
from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
from typing_extensions import override

from zerver.lib.markdown.priorities import PREPROCESSOR_PRIORITIES

REGEXP = re.compile(r"\{settings_tab\|(?P<setting_identifier>.*?)\}")


# If any changes to this link mapping are made,
# `starlight_help/src/components/NavigationSteps.astro` should be updated accordingly.
# This manual update mechanism will cease to exist once we have switched to the
# starlight_help system.
link_mapping = {
    # a mapping from the setting identifier that is the same as the final URL
    # breadcrumb to that setting to the name of its setting type, the setting
    # name as it appears in the user interface, and a relative link that can
    # be used to get to that setting
    "profile": ["Personal settings", "Profile", "/#settings/profile"],
    "account-and-privacy": [
        "Personal settings",
        "Account & privacy",
        "/#settings/account-and-privacy",
    ],
    "preferences": ["Personal settings", "Preferences", "/#settings/preferences"],
    "notifications": ["Personal settings", "Notifications", "/#settings/notifications"],
    "your-bots": ["Personal settings", "Bots", "/#settings/your-bots"],
    "alert-words": ["Personal settings", "Alert words", "/#settings/alert-words"],
    "uploaded-files": ["Personal settings", "Uploaded files", "/#settings/uploaded-files"],
    "topics": ["Personal settings", "Topics", "/#settings/topics"],
    "muted-users": ["Personal settings", "Muted users", "/#settings/muted-users"],
    "organization-profile": [
        "Organization settings",
        "Organization profile",
        "/#organization/organization-profile",
    ],
    "organization-settings": [
        "Organization settings",
        "Organization settings",
        "/#organization/organization-settings",
    ],
    "organization-permissions": [
        "Organization settings",
        "Organization permissions",
        "/#organization/organization-permissions",
    ],
    "default-user-settings": [
        "Organization settings",
        "Default user settings",
        "/#organization/organization-level-user-defaults",
    ],
    "emoji-settings": ["Organization settings", "Custom emoji", "/#organization/emoji-settings"],
    "auth-methods": [
        "Organization settings",
        "Authentication methods",
        "/#organization/auth-methods",
    ],
    "users": [
        "Organization settings",
        "Users",
        "/#organization/users/active",
    ],
    "deactivated": [
        "Organization settings",
        "Users",
        "/#organization/users/deactivated",
    ],
    "invitations": [
        "Organization settings",
        "Users",
        "/#organization/users/invitations",
    ],
    "bots": [
        "Organization settings",
        "Bots",
        "/#organization/bots",
    ],
    "default-channels-list": [
        "Organization settings",
        "Default channels",
        "/#organization/default-channels-list",
    ],
    "linkifier-settings": [
        "Organization settings",
        "Linkifiers",
        "/#organization/linkifier-settings",
    ],
    "playground-settings": [
        "Organization settings",
        "Code playgrounds",
        "/#organization/playground-settings",
    ],
    "profile-field-settings": [
        "Organization settings",
        "Custom profile fields",
        "/#organization/profile-field-settings",
    ],
    "channel-folder-settings": [
        "Organization settings",
        "Channel folders",
        "/#organization/channel-folders",
    ],
    "data-exports-admin": [
        "Organization settings",
        "Data exports",
        "/#organization/data-exports-admin",
    ],
}

settings_markdown = """
1. Click on the **gear** (<i class="zulip-icon zulip-icon-gear"></i>) icon in the upper
   right corner of the web or desktop app.

1. Select **{setting_type_name}**.

1. On the left, click {setting_reference}.
"""


def getMarkdown(setting_type_name: str, setting_name: str, setting_link: str) -> str:
    if relative_settings_links:
        relative_link = f"[{setting_name}]({setting_link})"
        # The "Bots" label appears in both Personal and Organization settings
        # in the user interface so we need special text for this setting.
        if setting_name in ["Bots", "Users"]:
            return f"1. Navigate to the {relative_link} \
                    tab of the **{setting_type_name}** menu."
        return f"1. Go to {relative_link}."
    return settings_markdown.format(  # nocoverage
        setting_type_name=setting_type_name,
        setting_reference=f"**{setting_name}**",
    )


class SettingHelpExtension(Extension):
    @override
    def extendMarkdown(self, md: Markdown) -> None:
        """Add SettingHelpExtension to the Markdown instance."""
        md.registerExtension(self)
        md.preprocessors.register(Setting(), "setting", PREPROCESSOR_PRIORITIES["setting"])


relative_settings_links: bool = False


def set_relative_settings_links(value: bool) -> None:
    global relative_settings_links
    relative_settings_links = value


class Setting(Preprocessor):
    @override
    def run(self, lines: list[str]) -> list[str]:
        done = False
        while not done:
            for line in lines:
                loc = lines.index(line)
                match = REGEXP.search(line)

                if match:
                    text = [self.handleMatch(match)]
                    # The line that contains the directive to include the macro
                    # may be preceded or followed by text or tags, in that case
                    # we need to make sure that any preceding or following text
                    # stays the same.
                    line_split = REGEXP.split(line, maxsplit=0)
                    preceding = line_split[0]
                    following = line_split[-1]
                    text = [preceding, *text, following]
                    lines = lines[:loc] + text + lines[loc + 1 :]
                    break
            else:
                done = True
        return lines

    def handleMatch(self, match: Match[str]) -> str:
        setting_identifier = match.group("setting_identifier")
        return getMarkdown(*link_mapping[setting_identifier])


def makeExtension(*args: Any, **kwargs: Any) -> SettingHelpExtension:
    return SettingHelpExtension(*args, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: include.py]---
Location: zulip-main/zerver/lib/markdown/include.py

```python
import os
import re
from re import Match
from xml.etree.ElementTree import Element

from markdown import Extension, Markdown
from markdown.blockparser import BlockParser
from markdown.blockprocessors import BlockProcessor
from typing_extensions import override

from zerver.lib.exceptions import InvalidMarkdownIncludeStatementError
from zerver.lib.markdown.priorities import BLOCK_PROCESSOR_PRIORITIES


class IncludeExtension(Extension):
    def __init__(self, base_path: str) -> None:
        super().__init__()
        self.base_path = base_path

    @override
    def extendMarkdown(self, md: Markdown) -> None:
        md.parser.blockprocessors.register(
            IncludeBlockProcessor(md.parser, self.base_path),
            "include",
            BLOCK_PROCESSOR_PRIORITIES["include"],
        )


class IncludeBlockProcessor(BlockProcessor):
    RE = re.compile(r"^ {,3}\{!([^!]+)!\} *$", re.MULTILINE)

    def __init__(self, parser: BlockParser, base_path: str) -> None:
        super().__init__(parser)
        self.base_path = base_path

    @override
    def test(self, parent: Element, block: str) -> bool:
        return bool(self.RE.search(block))

    def expand_include(self, m: Match[str]) -> str:
        try:
            with open(os.path.normpath(os.path.join(self.base_path, m[1]))) as f:
                lines = f.read().splitlines()
        except OSError as e:
            raise InvalidMarkdownIncludeStatementError(m[0].strip()) from e

        for prep in self.parser.md.preprocessors:
            lines = prep.run(lines)

        return "\n".join(lines)

    @override
    def run(self, parent: Element, blocks: list[str]) -> None:
        self.parser.state.set("include")
        self.parser.parseChunk(parent, self.RE.sub(self.expand_include, blocks.pop(0)))
        self.parser.state.reset()


def makeExtension(base_path: str) -> IncludeExtension:
    return IncludeExtension(base_path=base_path)
```

--------------------------------------------------------------------------------

---[FILE: nested_code_blocks.py]---
Location: zulip-main/zerver/lib/markdown/nested_code_blocks.py

```python
from collections.abc import Mapping
from typing import Any
from xml.etree.ElementTree import Element, SubElement

import markdown
from markdown.extensions import Extension
from typing_extensions import override

from zerver.lib.markdown import ResultWithFamily, walk_tree_with_family
from zerver.lib.markdown.priorities import PREPROCESSOR_PRIORITIES


class NestedCodeBlocksRenderer(Extension):
    @override
    def extendMarkdown(self, md: markdown.Markdown) -> None:
        md.treeprocessors.register(
            NestedCodeBlocksRendererTreeProcessor(md, self.getConfigs()),
            "nested_code_blocks",
            PREPROCESSOR_PRIORITIES["nested_code_blocks"],
        )


class NestedCodeBlocksRendererTreeProcessor(markdown.treeprocessors.Treeprocessor):
    def __init__(self, md: markdown.Markdown, config: Mapping[str, Any]) -> None:
        super().__init__(md)

    @override
    def run(self, root: Element) -> None:
        code_tags = walk_tree_with_family(root, self.get_code_tags)
        nested_code_blocks = self.get_nested_code_blocks(code_tags)
        for block in nested_code_blocks:
            _tag, text = block.result
            codehilite_block = self.get_codehilite_block(text)
            self.replace_element(block.family.grandparent, codehilite_block, block.family.parent)

    def get_code_tags(self, e: Element) -> tuple[str, str | None] | None:
        if e.tag == "code":
            return (e.tag, e.text)
        return None

    def get_nested_code_blocks(
        self,
        code_tags: list[ResultWithFamily[tuple[str, str | None]]],
    ) -> list[ResultWithFamily[tuple[str, str | None]]]:
        nested_code_blocks = []
        for code_tag in code_tags:
            parent: Any = code_tag.family.parent
            grandparent: Any = code_tag.family.grandparent
            if (
                parent.tag == "p"
                and grandparent.tag == "li"
                and parent.text is None
                and len(parent) == 1
                and sum(1 for text in parent.itertext()) == 1
            ):
                # if the parent (<p>) has no text, and no children,
                # that means that the <code> element inside is its
                # only thing inside the bullet, we can confidently say
                # that this is a nested code block
                nested_code_blocks.append(code_tag)

        return nested_code_blocks

    def get_codehilite_block(self, code_block_text: str | None) -> Element:
        div = Element("div")
        div.set("class", "codehilite")
        pre = SubElement(div, "pre")
        pre.text = code_block_text
        return div

    def replace_element(
        self,
        parent: Element | None,
        replacement: Element,
        element_to_replace: Element,
    ) -> None:
        if parent is None:
            return

        for index, child in enumerate(parent):
            if child is element_to_replace:
                parent.insert(index, replacement)
                parent.remove(element_to_replace)


def makeExtension(*args: Any, **kwargs: str) -> NestedCodeBlocksRenderer:
    return NestedCodeBlocksRenderer(**kwargs)
```

--------------------------------------------------------------------------------

---[FILE: priorities.py]---
Location: zulip-main/zerver/lib/markdown/priorities.py

```python
# Note that in the Markdown preprocessor registry, the highest
# numeric value is considered the highest priority, so the dict
# below is ordered from highest-to-lowest priority.
# Priorities for the built-in preprocessors are commented out.
PREPROCESSOR_PRIORITIES = {
    "generate_parameter_description": 535,
    "generate_response_description": 531,
    "generate_api_header": 530,
    "generate_code_example": 525,
    "generate_return_values": 510,
    "generate_api_arguments": 505,
    "setting": 450,
    # "normalize_whitespace": 30,
    "fenced_code_block": 25,
    # "html_block": 20,
    "tabbed_sections": -500,
    "nested_code_blocks": -500,
    "emoticon_translations": -505,
    "static_images": -510,
}

BLOCK_PROCESSOR_PRIORITIES = {
    "include": 51,
}
```

--------------------------------------------------------------------------------

---[FILE: static.py]---
Location: zulip-main/zerver/lib/markdown/static.py
Signals: Django

```python
from typing import Any
from xml.etree.ElementTree import Element

import markdown
from django.contrib.staticfiles.storage import staticfiles_storage
from markdown.extensions import Extension
from typing_extensions import override

from zerver.lib.markdown.priorities import PREPROCESSOR_PRIORITIES


class MarkdownStaticImagesGenerator(Extension):
    @override
    def extendMarkdown(self, md: markdown.Markdown) -> None:
        md.treeprocessors.register(
            StaticImageProcessor(md),
            "static_images",
            PREPROCESSOR_PRIORITIES["static_images"],
        )


class StaticImageProcessor(markdown.treeprocessors.Treeprocessor):
    """
    Rewrite img tags which refer to /static/ to use staticfiles
    """

    @override
    def run(self, root: Element) -> None:
        for img in root.iter("img"):
            url = img.get("src")
            if url is not None and url.startswith("/static/"):
                img.set("src", staticfiles_storage.url(url.removeprefix("/static/")))


def makeExtension(*args: Any, **kwargs: str) -> MarkdownStaticImagesGenerator:
    return MarkdownStaticImagesGenerator(*args, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: tabbed_sections.py]---
Location: zulip-main/zerver/lib/markdown/tabbed_sections.py

```python
import re
from collections.abc import Mapping
from typing import Any

import markdown
from markdown.extensions import Extension
from markdown.preprocessors import Preprocessor
from typing_extensions import override

from zerver.lib.markdown.priorities import PREPROCESSOR_PRIORITIES

START_TABBED_SECTION_REGEX = re.compile(r"^\{start_tabs\}$")
END_TABBED_SECTION_REGEX = re.compile(r"^\{end_tabs\}$")
TAB_CONTENT_REGEX = re.compile(r"^\{tab\|([^}]+)\}$")

TABBED_SECTION_TEMPLATE = """
<div class="tabbed-section {tab_class}" markdown="1">
{nav_bar}
<div class="blocks">
{blocks}
</div>
</div>
""".strip()

NAV_BAR_TEMPLATE = """
<ul class="nav">
{tabs}
</ul>
""".strip()

NAV_LIST_ITEM_TEMPLATE = """
<li class="{class_}" data-tab-key="{data_tab_key}" tabindex="0">{label}</li>
""".strip()

DIV_TAB_CONTENT_TEMPLATE = """
<div class="tab-content {class_}" data-tab-key="{data_tab_key}" markdown="1">
{content}
</div>
""".strip()

# If adding new entries here, also check if you need to update
# tabbed-instructions.js
TAB_SECTION_LABELS = {
    "desktop-web": "Desktop/Web",
    "ios": "iOS",
    "android": "Android",
    "python": "Python",
    "js": "JavaScript",
    "curl": "curl",
    "zulip-send": "zulip-send",
    "instructions-for-all-platforms": "Instructions for all platforms",
    "for-a-bot": "For a bot",
    "for-yourself": "For yourself",
    "grafana-latest": "Grafana 8.3+",
    "grafana-older-version": "Grafana 8.2 and below",
    "send-channel-message": "Send a channel message",
    "send-dm": "Send a DM",
}


class TabbedSectionsGenerator(Extension):
    @override
    def extendMarkdown(self, md: markdown.Markdown) -> None:
        md.preprocessors.register(
            TabbedSectionsPreprocessor(md, self.getConfigs()),
            "tabbed_sections",
            PREPROCESSOR_PRIORITIES["tabbed_sections"],
        )


def parse_tabs(lines: list[str]) -> dict[str, Any] | None:
    block: dict[str, Any] = {}
    for index, line in enumerate(lines):
        start_match = START_TABBED_SECTION_REGEX.search(line)
        if start_match:
            block["start_tabs_index"] = index

        tab_content_match = TAB_CONTENT_REGEX.search(line)
        if tab_content_match:
            block.setdefault("tabs", [])
            tab = {"start": index, "tab_key": tab_content_match.group(1)}
            block["tabs"].append(tab)

        end_match = END_TABBED_SECTION_REGEX.search(line)
        if end_match:
            block["end_tabs_index"] = index
            break
    return block


def generate_content_blocks(
    tab_section: dict[str, Any], lines: list[str], tab_content_template: str
) -> str:
    tab_content_blocks = []
    for index, tab in enumerate(tab_section["tabs"]):
        start_index = tab["start"] + 1
        try:
            # If there are more tabs, we can use the starting index
            # of the next tab as the ending index of the previous one
            end_index = tab_section["tabs"][index + 1]["start"]
        except IndexError:
            # Otherwise, just use the end of the entire section
            end_index = tab_section["end_tabs_index"]

        content = "\n".join(lines[start_index:end_index]).strip()
        tab_content_block = tab_content_template.format(
            class_="active" if index == 0 else "",
            data_tab_key=tab["tab_key"],
            # This attribute is not used directly in this file here,
            # we need this for the current conversion script in for
            # starlight_help where this function is being imported.
            tab_label=TAB_SECTION_LABELS[tab["tab_key"]],
            # Wrapping the content in two newlines is necessary here.
            # If we don't do this, the inner Markdown does not get
            # rendered properly.
            content=f"\n{content}\n",
        )
        tab_content_blocks.append(tab_content_block)
    return "\n".join(tab_content_blocks)


class TabbedSectionsPreprocessor(Preprocessor):
    def __init__(self, md: markdown.Markdown, config: Mapping[str, Any]) -> None:
        super().__init__(md)

    @override
    def run(self, lines: list[str]) -> list[str]:
        tab_section = parse_tabs(lines)
        while tab_section:
            if "tabs" in tab_section:
                tab_class = "has-tabs"
            else:
                tab_class = "no-tabs"
                tab_section["tabs"] = [
                    {
                        "tab_key": "instructions-for-all-platforms",
                        "start": tab_section["start_tabs_index"],
                    }
                ]
            nav_bar = self.generate_nav_bar(tab_section)
            content_blocks = generate_content_blocks(tab_section, lines, DIV_TAB_CONTENT_TEMPLATE)
            rendered_tabs = TABBED_SECTION_TEMPLATE.format(
                tab_class=tab_class, nav_bar=nav_bar, blocks=content_blocks
            )

            start = tab_section["start_tabs_index"]
            end = tab_section["end_tabs_index"] + 1
            lines = [*lines[:start], rendered_tabs, *lines[end:]]
            tab_section = parse_tabs(lines)
        return lines

    def generate_nav_bar(self, tab_section: dict[str, Any]) -> str:
        li_elements = []
        for index, tab in enumerate(tab_section["tabs"]):
            tab_key = tab.get("tab_key")
            tab_label = TAB_SECTION_LABELS.get(tab_key)
            if tab_label is None:
                raise ValueError(
                    f"Tab '{tab_key}' is not present in TAB_SECTION_LABELS in zerver/lib/markdown/tabbed_sections.py"
                )
            class_ = "active" if index == 0 else ""

            li = NAV_LIST_ITEM_TEMPLATE.format(class_=class_, data_tab_key=tab_key, label=tab_label)
            li_elements.append(li)

        return NAV_BAR_TEMPLATE.format(tabs="\n".join(li_elements))


def makeExtension(*args: Any, **kwargs: str) -> TabbedSectionsGenerator:
    return TabbedSectionsGenerator(**kwargs)
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 736
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 736 of 1290)

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

---[FILE: print.css]---
Location: zulip-main/web/styles/print.css

```text
@media print {
    /* Hide unnecessary blocks. */
    #navbar_alerts_wrapper,
    #streamlist-toggle,
    #left-sidebar-container,
    #right-sidebar-container,
    .column-left,
    .top-messages-logo,
    #userlist-toggle,
    .message_length_controller,
    #loading_older_messages_indicator,
    #page_loading_indicator,
    #message_feed_errors_container,
    #bottom_whitespace,
    #mark_read_on_scroll_state_banner,
    #mark_read_on_scroll_state_banner_place_holder,
    .trailing_bookend,
    #compose {
        display: none;
    }

    /* Allow printer to set the margins, and
       prevent Safari from using screen-based ones. */
    .column-middle {
        margin: 0;
    }

    /* Prevent headers from running on every page. */
    #navbar-fixed-container,
    .message-feed .message_header {
        position: static;
    }

    /* Save a bit of paper by removing height, which
       otherwise creates a blank final page, and padding. */
    html,
    body {
        height: auto;
    }

    #message_feed_container {
        padding-top: 0;
    }

    /* Hide unnecessary controls, but leave them
       in the document flow. */
    .search_icon,
    #search_exit,
    .settings-dropdown-cog,
    .recipient_bar_controls {
        visibility: hidden;
    }

    /* Try to keep the message header with the messages
       that follow in interleaved views. */
    .message_header_stream {
        break-after: avoid;
    }

    /* Don't highlight the selected message. */
    .selected_message .messagebox-content {
        outline: 0;
    }

    .messagebox-content {
        .message_edit_notice,
        .message-time {
            /* Firefox seems to have a bug that fuzzes out
               small text with opacity; this unsets that
               value, and replaces with a matching gray. */
            opacity: unset;
            color: hsl(0deg 0% 0% / 48%);
        }
    }

    /* Show collapsed content for printing. Note that
       CSS Grid does not yet break very intelligently
       in all browsers, so longer messages may sometimes
       appear at the top of new pages. */
    .message_content.collapsed,
    .message_content.condensed {
        max-height: unset !important;
        min-height: unset !important;
        overflow: auto !important;
        height: auto !important;
        mask-image: none;
    }

    /* Print links in the same color as text, with any
       likely full URL values in parentheses. */
    .message_content a {
        color: inherit;

        &[href^="http"]::after {
            content: " (" attr(href) ")";
        }
    }

    /* Ensure that emoji print. They are background-images,
       which ordinarily do not print, so these properties
       should ensure proper printing of inline, status, and
       other emoji. */
    .emoji {
        color-adjust: exact;
        print-color-adjust: exact;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: progress_bar.css]---
Location: zulip-main/web/styles/progress_bar.css

```text
@keyframes progress-bar-stripes {
    from {
        background-position: 40px 0;
    }

    to {
        background-position: 0 0;
    }
}

.progress {
    overflow: hidden;
    height: 20px;
    margin-bottom: 20px;
    background: linear-gradient(to bottom, hsl(0deg 0% 96%), hsl(0deg 0% 98%));
    background-repeat: repeat-x;
    box-shadow: inset 0 1px 2px hsl(0deg 0% 0% / 10%);
    border-radius: 4px;
}

.progress .bar {
    width: 0%;
    height: 100%;
    color: hsl(0deg 0% 100%);
    float: left;
    background: linear-gradient(
        to bottom,
        hsl(200deg 84% 48%),
        hsl(200deg 96% 38%)
    );
    background-repeat: repeat-x;
    box-shadow: inset 0 -1px 2px hsl(0deg 0% 0% / 15%);
    box-sizing: border-box;
    transition: width 0.6s ease; /* stylelint-disable-line plugin/no-low-performance-animation-properties */
}

.progress.active .bar {
    animation: progress-bar-stripes 2s linear infinite;
}

.progress .bar-danger {
    background: linear-gradient(
        to bottom,
        hsl(2deg 81% 65%),
        hsl(3deg 57% 49%)
    );
    background-repeat: repeat-x;
}

.progress .bar-success {
    background: linear-gradient(
        to bottom,
        hsl(120deg 45% 58%),
        hsl(120deg 32% 50%)
    );
    background-repeat: repeat-x;
}
```

--------------------------------------------------------------------------------

---[FILE: pygments.css]---
Location: zulip-main/web/styles/pygments.css

```text
/* stylelint-disable color-no-hex, no-duplicate-selectors */

/* Begin Pygments Default Colors */

%light-theme {
    .codehilite .hll {
        background-color: #ffc;
    }

    .codehilite .c {
        color: #3d7b7b;
        font-style: italic;
    } /* Comment */
    .codehilite .err {
        border: 1px solid #f00;
    } /* Error */
    .codehilite .k {
        color: #008000;
        font-weight: bold;
    } /* Keyword */
    .codehilite .o {
        color: #666;
    } /* Operator */
    .codehilite .ch {
        color: #3d7b7b;
        font-style: italic;
    } /* Comment.Hashbang */
    .codehilite .cm {
        color: #3d7b7b;
        font-style: italic;
    } /* Comment.Multiline */
    .codehilite .cp {
        color: #9c6500;
    } /* Comment.Preproc */
    .codehilite .cpf {
        color: #3d7b7b;
        font-style: italic;
    } /* Comment.PreprocFile */
    .codehilite .c1 {
        color: #3d7b7b;
        font-style: italic;
    } /* Comment.Single */
    .codehilite .cs {
        color: #3d7b7b;
        font-style: italic;
    } /* Comment.Special */
    .codehilite .gd {
        color: #a00000;
    } /* Generic.Deleted */
    .codehilite .ge {
        font-style: italic;
    } /* Generic.Emph */
    .codehilite .ges {
        font-weight: bold;
        font-style: italic;
    } /* Generic.EmphStrong */
    .codehilite .gr {
        color: #e40000;
    } /* Generic.Error */
    .codehilite .gh {
        color: #000080;
        font-weight: bold;
    } /* Generic.Heading */
    .codehilite .gi {
        color: #008400;
    } /* Generic.Inserted */
    .codehilite .go {
        color: #717171;
    } /* Generic.Output */
    .codehilite .gp {
        color: #000080;
        font-weight: bold;
    } /* Generic.Prompt */
    .codehilite .gs {
        font-weight: bold;
    } /* Generic.Strong */
    .codehilite .gu {
        color: #800080;
        font-weight: bold;
    } /* Generic.Subheading */
    .codehilite .gt {
        color: #04d;
    } /* Generic.Traceback */
    .codehilite .kc {
        color: #008000;
        font-weight: bold;
    } /* Keyword.Constant */
    .codehilite .kd {
        color: #008000;
        font-weight: bold;
    } /* Keyword.Declaration */
    .codehilite .kn {
        color: #008000;
        font-weight: bold;
    } /* Keyword.Namespace */
    .codehilite .kp {
        color: #008000;
    } /* Keyword.Pseudo */
    .codehilite .kr {
        color: #008000;
        font-weight: bold;
    } /* Keyword.Reserved */
    .codehilite .kt {
        color: #b00040;
    } /* Keyword.Type */
    .codehilite .m {
        color: #666;
    } /* Literal.Number */
    .codehilite .s {
        color: #ba2121;
    } /* Literal.String */
    .codehilite .na {
        color: #687822;
    } /* Name.Attribute */
    .codehilite .nb {
        color: #008000;
    } /* Name.Builtin */
    .codehilite .nc {
        color: #00f;
        font-weight: bold;
    } /* Name.Class */
    .codehilite .no {
        color: #800;
    } /* Name.Constant */
    .codehilite .nd {
        color: #a2f;
    } /* Name.Decorator */
    .codehilite .ni {
        color: #717171;
        font-weight: bold;
    } /* Name.Entity */
    .codehilite .ne {
        color: #cb3f38;
        font-weight: bold;
    } /* Name.Exception */
    .codehilite .nf {
        color: #00f;
    } /* Name.Function */
    .codehilite .nl {
        color: #767600;
    } /* Name.Label */
    .codehilite .nn {
        color: #00f;
        font-weight: bold;
    } /* Name.Namespace */
    .codehilite .nt {
        color: #008000;
        font-weight: bold;
    } /* Name.Tag */
    .codehilite .nv {
        color: #19177c;
    } /* Name.Variable */
    .codehilite .ow {
        color: #a2f;
        font-weight: bold;
    } /* Operator.Word */
    .codehilite .w {
        color: #bbb;
    } /* Text.Whitespace */
    .codehilite .mb {
        color: #666;
    } /* Literal.Number.Bin */
    .codehilite .mf {
        color: #666;
    } /* Literal.Number.Float */
    .codehilite .mh {
        color: #666;
    } /* Literal.Number.Hex */
    .codehilite .mi {
        color: #666;
    } /* Literal.Number.Integer */
    .codehilite .mo {
        color: #666;
    } /* Literal.Number.Oct */
    .codehilite .sa {
        color: #ba2121;
    } /* Literal.String.Affix */
    .codehilite .sb {
        color: #ba2121;
    } /* Literal.String.Backtick */
    .codehilite .sc {
        color: #ba2121;
    } /* Literal.String.Char */
    .codehilite .dl {
        color: #ba2121;
    } /* Literal.String.Delimiter */
    .codehilite .sd {
        color: #ba2121;
        font-style: italic;
    } /* Literal.String.Doc */
    .codehilite .s2 {
        color: #ba2121;
    } /* Literal.String.Double */
    .codehilite .se {
        color: #aa5d1f;
        font-weight: bold;
    } /* Literal.String.Escape */
    .codehilite .sh {
        color: #ba2121;
    } /* Literal.String.Heredoc */
    .codehilite .si {
        color: #a45a77;
        font-weight: bold;
    } /* Literal.String.Interpol */
    .codehilite .sx {
        color: #008000;
    } /* Literal.String.Other */
    .codehilite .sr {
        color: #a45a77;
    } /* Literal.String.Regex */
    .codehilite .s1 {
        color: #ba2121;
    } /* Literal.String.Single */
    .codehilite .ss {
        color: #19177c;
    } /* Literal.String.Symbol */
    .codehilite .bp {
        color: #008000;
    } /* Name.Builtin.Pseudo */
    .codehilite .fm {
        color: #00f;
    } /* Name.Function.Magic */
    .codehilite .vc {
        color: #19177c;
    } /* Name.Variable.Class */
    .codehilite .vg {
        color: #19177c;
    } /* Name.Variable.Global */
    .codehilite .vi {
        color: #19177c;
    } /* Name.Variable.Instance */
    .codehilite .vm {
        color: #19177c;
    } /* Name.Variable.Magic */
    .codehilite .il {
        color: #666;
    } /* Literal.Number.Integer.Long */
}
/* End Pygments Default Colors */

%dark-theme {
    /* Begin Pygments Monokai Styles */
    .codehilite .hll {
        background-color: #49483e;
    }

    .codehilite .c {
        color: #959077;
    } /* Comment */
    .codehilite .err {
        color: #ed007e;
        background-color: #1e0010;
    } /* Error */
    .codehilite .esc {
        color: #f8f8f2;
    } /* Escape */
    .codehilite .g {
        color: #f8f8f2;
    } /* Generic */
    .codehilite .k {
        color: #66d9ef;
    } /* Keyword */
    .codehilite .l {
        color: #ae81ff;
    } /* Literal */
    .codehilite .n {
        color: #f8f8f2;
    } /* Name */
    .codehilite .o {
        color: #ff4689;
    } /* Operator */
    .codehilite .x {
        color: #f8f8f2;
    } /* Other */
    .codehilite .p {
        color: #f8f8f2;
    } /* Punctuation */
    .codehilite .ch {
        color: #959077;
    } /* Comment.Hashbang */
    .codehilite .cm {
        color: #959077;
    } /* Comment.Multiline */
    .codehilite .cp {
        color: #959077;
    } /* Comment.Preproc */
    .codehilite .cpf {
        color: #959077;
    } /* Comment.PreprocFile */
    .codehilite .c1 {
        color: #959077;
    } /* Comment.Single */
    .codehilite .cs {
        color: #959077;
    } /* Comment.Special */
    .codehilite .gd {
        color: #ff4689;
    } /* Generic.Deleted */
    .codehilite .ge {
        color: #f8f8f2;
        font-style: italic;
    } /* Generic.Emph */
    .codehilite .ges {
        color: #f8f8f2;
        font-weight: bold;
        font-style: italic;
    } /* Generic.EmphStrong */
    .codehilite .gr {
        color: #f8f8f2;
    } /* Generic.Error */
    .codehilite .gh {
        color: #f8f8f2;
    } /* Generic.Heading */
    .codehilite .gi {
        color: #a6e22e;
    } /* Generic.Inserted */
    .codehilite .go {
        color: #66d9ef;
    } /* Generic.Output */
    .codehilite .gp {
        color: #ff4689;
        font-weight: bold;
    } /* Generic.Prompt */
    .codehilite .gs {
        color: #f8f8f2;
        font-weight: bold;
    } /* Generic.Strong */
    .codehilite .gu {
        color: #959077;
    } /* Generic.Subheading */
    .codehilite .gt {
        color: #f8f8f2;
    } /* Generic.Traceback */
    .codehilite .kc {
        color: #66d9ef;
    } /* Keyword.Constant */
    .codehilite .kd {
        color: #66d9ef;
    } /* Keyword.Declaration */
    .codehilite .kn {
        color: #ff4689;
    } /* Keyword.Namespace */
    .codehilite .kp {
        color: #66d9ef;
    } /* Keyword.Pseudo */
    .codehilite .kr {
        color: #66d9ef;
    } /* Keyword.Reserved */
    .codehilite .kt {
        color: #66d9ef;
    } /* Keyword.Type */
    .codehilite .ld {
        color: #e6db74;
    } /* Literal.Date */
    .codehilite .m {
        color: #ae81ff;
    } /* Literal.Number */
    .codehilite .s {
        color: #e6db74;
    } /* Literal.String */
    .codehilite .na {
        color: #a6e22e;
    } /* Name.Attribute */
    .codehilite .nb {
        color: #f8f8f2;
    } /* Name.Builtin */
    .codehilite .nc {
        color: #a6e22e;
    } /* Name.Class */
    .codehilite .no {
        color: #66d9ef;
    } /* Name.Constant */
    .codehilite .nd {
        color: #a6e22e;
    } /* Name.Decorator */
    .codehilite .ni {
        color: #f8f8f2;
    } /* Name.Entity */
    .codehilite .ne {
        color: #a6e22e;
    } /* Name.Exception */
    .codehilite .nf {
        color: #a6e22e;
    } /* Name.Function */
    .codehilite .nl {
        color: #f8f8f2;
    } /* Name.Label */
    .codehilite .nn {
        color: #f8f8f2;
    } /* Name.Namespace */
    .codehilite .nx {
        color: #a6e22e;
    } /* Name.Other */
    .codehilite .py {
        color: #f8f8f2;
    } /* Name.Property */
    .codehilite .nt {
        color: #ff4689;
    } /* Name.Tag */
    .codehilite .nv {
        color: #f8f8f2;
    } /* Name.Variable */
    .codehilite .ow {
        color: #ff4689;
    } /* Operator.Word */
    .codehilite .pm {
        color: #f8f8f2;
    } /* Punctuation.Marker */
    .codehilite .w {
        color: #f8f8f2;
    } /* Text.Whitespace */
    .codehilite .mb {
        color: #ae81ff;
    } /* Literal.Number.Bin */
    .codehilite .mf {
        color: #ae81ff;
    } /* Literal.Number.Float */
    .codehilite .mh {
        color: #ae81ff;
    } /* Literal.Number.Hex */
    .codehilite .mi {
        color: #ae81ff;
    } /* Literal.Number.Integer */
    .codehilite .mo {
        color: #ae81ff;
    } /* Literal.Number.Oct */
    .codehilite .sa {
        color: #e6db74;
    } /* Literal.String.Affix */
    .codehilite .sb {
        color: #e6db74;
    } /* Literal.String.Backtick */
    .codehilite .sc {
        color: #e6db74;
    } /* Literal.String.Char */
    .codehilite .dl {
        color: #e6db74;
    } /* Literal.String.Delimiter */
    .codehilite .sd {
        color: #e6db74;
    } /* Literal.String.Doc */
    .codehilite .s2 {
        color: #e6db74;
    } /* Literal.String.Double */
    .codehilite .se {
        color: #ae81ff;
    } /* Literal.String.Escape */
    .codehilite .sh {
        color: #e6db74;
    } /* Literal.String.Heredoc */
    .codehilite .si {
        color: #e6db74;
    } /* Literal.String.Interpol */
    .codehilite .sx {
        color: #e6db74;
    } /* Literal.String.Other */
    .codehilite .sr {
        color: #e6db74;
    } /* Literal.String.Regex */
    .codehilite .s1 {
        color: #e6db74;
    } /* Literal.String.Single */
    .codehilite .ss {
        color: #e6db74;
    } /* Literal.String.Symbol */
    .codehilite .bp {
        color: #f8f8f2;
    } /* Name.Builtin.Pseudo */
    .codehilite .fm {
        color: #a6e22e;
    } /* Name.Function.Magic */
    .codehilite .vc {
        color: #f8f8f2;
    } /* Name.Variable.Class */
    .codehilite .vg {
        color: #f8f8f2;
    } /* Name.Variable.Global */
    .codehilite .vi {
        color: #f8f8f2;
    } /* Name.Variable.Instance */
    .codehilite .vm {
        color: #f8f8f2;
    } /* Name.Variable.Magic */
    .codehilite .il {
        color: #ae81ff;
    } /* Literal.Number.Integer.Long */
}
/* stylelint-enable color-no-hex, no-duplicate-selectors */

@media screen {
    :root:not(.color-scheme-automatic, .dark-theme) {
        @extend %light-theme;
    }
}

@media screen and (not (prefers-color-scheme: dark)) {
    :root.color-scheme-automatic {
        @extend %light-theme;
    }
}

@media not screen {
    :root {
        @extend %light-theme;
    }
}

@media screen {
    :root.dark-theme {
        @extend %dark-theme;
    }
}

@media screen and (prefers-color-scheme: dark) {
    :root.color-scheme-automatic {
        @extend %dark-theme;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: reactions.css]---
Location: zulip-main/web/styles/reactions.css

```text
.message_reactions {
    overflow: hidden;
    user-select: none;

    &:has(.message_reaction) {
        margin-bottom: var(--message-box-markdown-aligned-vertical-space);
    }

    .message_reaction_container {
        &.disabled {
            cursor: not-allowed;
        }
    }

    .message_reaction {
        display: flex;
        /* Set a pixel and half padding to maintain
           pill height adjacent own reactions. */
        padding: 1.5px 4px 1.5px 3px;
        box-sizing: border-box;
        min-width: 44px;
        cursor: pointer;
        color: var(--color-message-reaction-text);
        background-color: var(--color-message-reaction-background);
        border: 1px solid var(--color-message-reaction-border);
        border-radius: 21px;
        align-items: center;
        box-shadow: inset 0 0 5px 0 var(--color-message-reaction-shadow-inner);
        transition:
            transform 100ms linear,
            font-weight 100ms linear; /* stylelint-disable-line plugin/no-low-performance-animation-properties */

        &.reacted {
            color: var(--color-message-reaction-text-reacted);
            background-color: var(--color-message-reaction-background-reacted);
            border-color: var(--color-message-reaction-border-reacted);
            /* Make this border thicker by half a pixel,
               to make own reactions more prominent. */
            border-width: 1.5px;
            /* Reduce the padding top and bottom by half
               a pixel accordingly, to maintain the same
               pill height. */
            padding: 1px 4px 1px 3px;
            font-weight: var(--font-weight-message-reaction);
            box-shadow: none;
        }

        &.disabled {
            pointer-events: none;
        }

        &:hover {
            background-color: var(--color-message-reaction-background-hover);
        }

        &:active {
            transform: scale(var(--scale-message-reaction-active));
        }

        .emoji {
            margin: 1px 3px;
            /* 17px at 14px/1em */
            height: 1.2143em;
            width: 1.2143em;
            /* Preserve the emoji's dimensions, no
               matter what the flexbox does. */
            flex-shrink: 0;
            /* Don't inherit position: relative; from
               the base .emoji class. */
            position: static;
        }

        .emoji_alt_code {
            /* Apply the same margins as on graphical emoji. */
            margin: 1px 3px;
            font-size: 0.8em;
        }
    }

    .message_reaction_count {
        /* 90% works out here to 12.6px */
        font-size: 90%;
        /* No top and bottom margin; just allow
           flexbox to handle the vertical alignment. */
        margin: 0 3px;
        /* Set the 12.6px text on a 13px line;
           the goal is to center correctly on the
           vertical with square emoji, resulting in
           equal space above and below the reaction
           count/name.
           13px at 12.6/1em */
        line-height: 1.0317em;
    }

    .message_reaction:hover .message_reaction_count {
        color: var(--color-message-reaction-button-text-hover);
    }

    &:hover .reaction_button {
        visibility: visible;
        pointer-events: all;
    }

    .emoji-message-control-button-container {
        display: flex;
        align-items: center;
    }

    .reaction_button {
        visibility: hidden;
        pointer-events: none;
        /* Set top/bottom padding to accommodate borders
           and padding around reaction pills. */
        padding: 4px 6px;
        border-radius: 21px;
        color: var(--color-message-reaction-button-text);
        background-color: var(--color-message-reaction-button-background);
        border: 1px solid var(--color-message-reaction-button-border);

        & i {
            font-size: 1em;
            color: var(--color-message-reaction-button-text);
        }

        &:hover i {
            color: var(--color-message-reaction-button-text-hover);
        }

        &:hover {
            color: var(--color-message-reaction-button-text-hover);
            background-color: var(
                --color-message-reaction-button-background-hover
            );
            border: 1px solid var(--color-message-reaction-button-border-hover);
            border-color: var(--color-message-reaction-button-border-hover);
            box-shadow: inset 0 0 5px 0
                var(--color-message-reaction-shadow-inner);
            cursor: pointer;
            opacity: 1;
        }

        .message_reaction_count {
            font-weight: 700;
            color: var(--color-message-reaction-button-text);
            margin-right: 0;
            line-height: 14px;
        }

        &:hover .message_reaction_count {
            color: var(--color-message-reaction-button-text-hover);
        }
    }
}

.active-emoji-picker-reference,
.active-playground-links-reference {
    visibility: visible !important;
    pointer-events: all !important;
    opacity: 1 !important;
}

.emoji-picker-popover {
    padding: 0;
    user-select: none;

    .emoji-popover {
        width: 16.6667em; /* 250px at 15px/em */

        .emoji-popover-category-tabs {
            /* Flex needed here to work around #7511 (90% zoom issues in firefox) */
            display: flex;
            background-color: var(--color-background-emoji-picker-popover);
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;

            .emoji-popover-tab-item {
                font-size: 1.0667em; /* 16px at 15px/em */
                display: inline-block;
                padding-top: 0.5em; /* 8px at 16px/em */
                width: 1.5625em; /* 25px at 16px/em */
                height: 1.5625em; /* 25px at 16px/em */
                text-align: center;
                cursor: pointer;
                /* Flex needed here to work around #7511 (90% zoom issues in firefox) */
                flex-grow: 1;

                &.active {
                    background-color: var(
                        --color-background-emoji-picker-popover-tab-item-active
                    );
                }
            }
        }

        .emoji-popover-emoji-map,
        .emoji-search-results-container {
            padding: 0;
            position: relative;
            overflow: hidden auto;
            display: block;
            width: 16.4667em; /* 247px at 15px/em */
            padding-left: 0.2em; /* 3px at 15px/em */
        }

        .emoji-popover-emoji-map {
            height: 16.6667em; /* 250px at 15px/em */

            .emoji-popover-subheading {
                font-weight: 600;
                padding: 0.3333em 0.2em; /* 5px 3px at 15px/em */
            }
        }

        .emoji-popover-emoji {
            display: inline-block;
            margin: 0;
            padding: 0.4em; /* 6px at 15px/em */
            cursor: pointer;
            border-radius: 0.5em;
            height: 1.6667em; /* 25px at 15px/em */
            width: 1.6667em; /* 25px at 15px/em */

            &:focus {
                background-color: var(
                    --color-background-emoji-picker-emoji-focus
                );
                /* Only dark mode takes a box shadow on
                   the emoji-picker's focused emoji. */
                box-shadow: 0 0 1px
                    var(--color-box-shadow-emoji-picker-emoji-focus);
                outline: none;
            }

            &.reacted {
                background-color: var(
                    --color-background-emoji-picker-emoji-reacted
                );
                border-color: var(--color-border-emoji-picker-emoji-reacted);
            }

            &.reacted:focus {
                background-color: var(
                    --color-background-emoji-picker-emoji-reacted-focus
                );
            }

            &.hide {
                display: none;
            }

            .emoji {
                height: 1.6667em; /* 25px at 15px/em */
                width: 1.6667em; /* 25px at 15px/em */
            }
        }

        .emoji-search-results-container {
            /* Keep it hidden initially to avoid it taking extra height
               when the emoji popover is initially rendered which can
               cause the popover to render at incorrect position when
               the search container is hidden `onMount`. */
            display: none;
            height: 18.8667em; /* 283px at 15px/em */

            .emoji-popover-results-heading {
                font-size: 1.1333em; /* 17px at 15px/em */
                font-weight: 600;
                padding: 0.2941em 0.1765em 0.1765em 0.2941em; /* 5px 3px 3px 5px at 17px/em */
            }
        }
    }

    .emoji-showcase-container {
        position: relative;
        background-color: var(--color-background-emoji-picker-popover);
        min-height: 2.9333em; /* 44px at 15px/em */
        width: 16.6667em; /* 250px at 15px/em */
        border-radius: 0 0 6px 6px;

        .emoji-preview {
            position: absolute;
            width: 2.1333em; /* 32px at 15px/em */
            height: 2.1333em; /* 32px at 15px/em */
            left: 0.3333em; /* 5px at 15px/em */
            top: 0.4em; /* 6px at 15px/em */
            margin-top: 0;
        }

        .emoji-canonical-name {
            font-size: 1.0667em; /* 16px at 15px/em */
            position: relative;
            top: 0.75em; /* 12px at 16px/em */
            margin-left: 3.125em; /* 50px at 16px/em */
            font-weight: 600;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}

.typeahead .emoji {
    top: 2px;
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 68
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 68 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: config.py]---
Location: prowler-master/dashboard/config.py

```python
import os

# Emojis to be used in the compliance table
pass_emoji = "✅"
fail_emoji = "❌"
info_emoji = "ℹ️"
manual_emoji = "✋🏽"

# Main colors
fail_color = "#e67272"
pass_color = "#54d283"
info_color = "#2684FF"
manual_color = "#636c78"

# Muted colors
muted_fail_color = "#fca903"
muted_pass_color = "#03fccf"
muted_manual_color = "#b33696"

# Severity colors
critical_color = "#951649"
high_color = "#e11d48"
medium_color = "#ee6f15"
low_color = "#fcf45d"
informational_color = "#3274d9"

# Folder output path
folder_path_overview = os.getcwd() + "/output"
folder_path_compliance = os.getcwd() + "/output/compliance"

encoding_format = "utf-8"
# Error action, it is recommended to use "ignore" or "replace"
error_action = "ignore"
```

--------------------------------------------------------------------------------

---[FILE: tailwind.config.js]---
Location: prowler-master/dashboard/tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "*.{py,html,js}",
    "./**/*.{py,html,js}",
    "./**/**/*.{py,html,js}",
  ],
  theme: {
    extend: {
      colors: {
        prowler: {
          stone: {
            950: "#1C1917",
            900: "#292524",
            500: "#E7E5E4",
            300: "#F5F5F4",
          },
          gray: {
            900: "#9bAACF",
            700: "#BEC8E4",
            500: "#C8D0E7",
            300: "#E4EBF5",
          },
          status: {
            passed: "#1FB53F",
            failed: "#A3231F",
          },
        	lime: "#84CC16",
          white: "#FFFFFF",
          error: "#B91C1C",
        },
      },
      fontSize: {
        '3xs': '0.625rem',  // 10px
        '2xs': '0.6875rem', // 11px
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.375rem',  // 22px
        '2xxl': '1.5rem',   // 24px
        '3xl': '1.75rem',   // 28px
        '4xl': '2rem',      // 32px
        '5xl': '2.25rem',   // 36px
        '6xl': '2.75rem',   // 44px
        '7xl': '3.5rem'     // 56px
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
        heavy: 800
      },
      lineHeight: {
        14: "0.875rem",     // 14px
        22: "1.375rem",     // 22px
        26: "1.625rem",     // 26px
        28: "1.75rem",      // 28px
        30: "1.875rem",     // 30px
        32: "2rem",         // 32px
        34: "2.125rem",     // 34px
        36: "2.25rem",      // 36px
        40: "2.5rem",       // 40px
        44: "2.75rem",      // 44px
        48: "3rem",         // 48px
        56: "3.5rem",       // 56px
        68: "4.25rem",      // 68px
      },
			boxShadow: {
				"provider":
					".3rem .3rem .6rem #c8d0e7, -.2rem -.2rem .5rem #FFF",
				"box-up":
					"0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem #FFF",
				"box-down":
					"inset .2rem .2rem .5rem #c8d0e7, inset -.2rem -.2rem .5rem #FFF",
			},
			backgroundImage: {
        "gradient-passed":
          "linear-gradient(127.43deg, #F1F5F8 -177.68%, #4ADE80 87.35%)",
        "gradient-failed":
          "linear-gradient(127.43deg, #F1F5F8 -177.68%, #EF4444 87.35%)",
      },
    },
  },
  plugins: [],
};
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: prowler-master/dashboard/__init__.py

```python
DASHBOARD_PORT = 11666
DASHBOARD_ARGS = {"debug": True, "port": DASHBOARD_PORT, "use_reloader": False}
```

--------------------------------------------------------------------------------

---[FILE: __main__.py]---
Location: prowler-master/dashboard/__main__.py
Signals: Flask

```python
# Importing Packages
import sys
import warnings

import click
import dash
import dash_bootstrap_components as dbc
from colorama import Fore, Style
from dash import dcc, html
from dash.dependencies import Input, Output

from dashboard.config import folder_path_overview
from prowler.config.config import orange_color
from prowler.lib.banner import print_banner

warnings.filterwarnings("ignore")

cli = sys.modules["flask.cli"]
print_banner()
print(
    f"{Fore.GREEN}Loading all CSV files from the folder {folder_path_overview} ...\n{Style.RESET_ALL}"
)
cli.show_server_banner = lambda *x: click.echo(
    f"{Fore.YELLOW}NOTE:{Style.RESET_ALL} If you are using {Fore.GREEN}{Style.BRIGHT}Prowler SaaS{Style.RESET_ALL} with the S3 integration or that integration \nfrom {Fore.CYAN}{Style.BRIGHT}Prowler Open Source{Style.RESET_ALL} and you want to use your data from your S3 bucket,\nrun: `{orange_color}aws s3 cp s3://<your-bucket>/output/csv ./output --recursive{Style.RESET_ALL}`\nand then run `prowler dashboard` again to load the new files."
)

# Initialize the app - incorporate css
dashboard = dash.Dash(
    __name__,
    external_stylesheets=[dbc.themes.FLATLY],
    use_pages=True,
    suppress_callback_exceptions=True,
    title="Prowler Dashboard",
)

# Logo
prowler_logo = html.Img(
    src="https://cdn.prod.website-files.com/68c4ec3f9fb7b154fbcb6e36/68ffb46d40ed7faa37a592a5_prowler-logo.png",
    alt="Prowler Logo",
)

menu_icons = {
    "overview": "/assets/images/icons/overview.svg",
    "compliance": "/assets/images/icons/compliance.svg",
}


# Function to generate navigation links
def generate_nav_links(current_path):
    nav_links = []
    for page in dash.page_registry.values():
        # Gets the icon URL based on the page name
        icon_url = menu_icons.get(page["name"].lower())
        is_active = (
            " bg-prowler-stone-950 border-r-4 border-solid border-prowler-lime"
            if current_path == page["relative_path"]
            else ""
        )
        link_class = f"block hover:bg-prowler-stone-950 hover:border-r-4 hover:border-solid hover:border-prowler-lime{is_active}"

        link_content = html.Span(
            [
                html.Img(src=icon_url, className="w-5"),
                html.Span(
                    page["name"], className="font-medium text-base leading-6 text-white"
                ),
            ],
            className="flex justify-center lg:justify-normal items-center gap-x-3 py-2 px-3",
        )

        nav_link = html.Li(
            dcc.Link(link_content, href=page["relative_path"], className=link_class)
        )
        nav_links.append(nav_link)
    return nav_links


def generate_help_menu():
    help_links = [
        {
            "title": "Help",
            "url": "https://github.com/prowler-cloud/prowler/issues",
            "icon": "/assets/images/icons/help.png",
        },
        {
            "title": "Docs",
            "url": "https://docs.prowler.com",
            "icon": "/assets/images/icons/docs.png",
        },
    ]

    link_class = "block hover:bg-prowler-stone-950 hover:border-r-4 hover:border-solid hover:border-prowler-lime"

    menu_items = []
    for link in help_links:
        menu_item = html.Li(
            html.A(
                html.Span(
                    [
                        html.Img(src=link["icon"], className="w-5"),
                        html.Span(
                            link["title"],
                            className="font-medium text-base leading-6 text-white",
                        ),
                    ],
                    className="flex items-center gap-x-3 py-2 px-3",
                ),
                href=link["url"],
                target="_blank",
                className=link_class,
            )
        )
        menu_items.append(menu_item)

    return menu_items


# Layout
dashboard.layout = html.Div(
    [
        dcc.Location(id="url", refresh=False),
        html.Link(rel="icon", href="assets/favicon.ico"),
        # Placeholder for dynamic navigation bar
        html.Div(
            [
                html.Div(
                    id="navigation-bar", className="bg-prowler-stone-900 min-w-36 z-10"
                ),
                html.Div(
                    [
                        dash.page_container,
                    ],
                    id="content_select",
                    className="bg-prowler-white w-full col-span-11 h-screen mx-auto overflow-y-scroll no-scrollbar px-10 py-7",
                ),
            ],
            className="grid custom-grid 2xl:custom-grid-large h-screen",
        ),
    ],
    className="h-screen mx-auto",
)


# Callback to update navigation bar
@dashboard.callback(Output("navigation-bar", "children"), [Input("url", "pathname")])
def update_nav_bar(pathname):
    return html.Div(
        [
            html.Div([prowler_logo], className="mb-8 px-3"),
            html.H6(
                "Dashboards",
                className="px-3 text-prowler-stone-500 text-sm opacity-90 font-regular mb-2",
            ),
            html.Nav(
                [html.Ul(generate_nav_links(pathname), className="")],
                className="flex flex-col gap-y-6",
            ),
            html.Nav(
                [
                    html.A(
                        [
                            html.Span(
                                [
                                    html.Img(src="assets/favicon.ico", className="w-5"),
                                    "Subscribe to Prowler Cloud",
                                ],
                                className="flex items-center gap-x-3 text-white",
                            ),
                        ],
                        href="https://prowler.com/",
                        target="_blank",
                        className="block p-3 uppercase text-xs hover:bg-prowler-stone-950 hover:border-r-4 hover:border-solid hover:border-prowler-lime",
                    ),
                    html.Ul(generate_help_menu(), className=""),
                ],
                className="flex flex-col gap-y-6 mt-auto",
            ),
        ],
        className="flex flex-col bg-prowler-stone-900 py-7 h-full",
    )
```

--------------------------------------------------------------------------------

---[FILE: markdown-styles.css]---
Location: prowler-master/dashboard/assets/markdown-styles.css

```text
/* Override Tailwind CSS reset for markdown content */
.markdown-content ul {
    list-style: disc !important;
    margin-left: 20px !important;
    padding-left: 10px !important;
    margin-bottom: 8px !important;
}

.markdown-content ol {
    list-style: decimal !important;
    margin-left: 20px !important;
    padding-left: 10px !important;
    margin-bottom: 8px !important;
}

.markdown-content li {
    margin-bottom: 4px !important;
    display: list-item !important;
}

.markdown-content p {
    margin-bottom: 8px !important;
}

/* Ensure nested lists work properly */
.markdown-content ul ul {
    margin-top: 4px !important;
    margin-bottom: 4px !important;
}

.markdown-content ol ol {
    margin-top: 4px !important;
    margin-bottom: 4px !important;
}
```

--------------------------------------------------------------------------------

---[FILE: arrows.svg]---
Location: prowler-master/dashboard/assets/images/icons/arrows.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 443 511.62"><path fill-rule="nonzero" d="M152.93 286.97c0 17.1-13.87 30.97-30.97 30.97-17.11 0-30.98-13.87-30.98-30.97v-177.4l-37.45 40.31c-11.63 12.5-31.19 13.2-43.68 1.57-12.49-11.62-13.19-31.18-1.57-43.68L99.33 9.79l2.06-1.94c12.69-11.35 32.2-10.26 43.55 2.43l91.05 101.47c11.35 12.69 10.26 32.2-2.43 43.55-12.68 11.36-32.19 10.27-43.55-2.42l-37.08-41.33v175.42zm236.24 71.77c11.35-12.69 30.86-13.78 43.55-2.43 12.69 11.36 13.78 30.87 2.42 43.56L344.1 501.34c-11.36 12.69-30.87 13.78-43.55 2.42l-2.02-1.97-91.09-97.95c-11.63-12.49-10.93-32.05 1.57-43.67 12.49-11.63 32.05-10.93 43.67 1.57l37.46 40.31V231.53c0-17.11 13.87-30.97 30.97-30.97s30.97 13.86 30.97 30.97v168.54l37.09-41.33z"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: compliance.svg]---
Location: prowler-master/dashboard/assets/images/icons/compliance.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clip-rule="evenodd"/>
  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963z"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: dropdown.svg]---
Location: prowler-master/dashboard/assets/images/icons/dropdown.svg

```text
<svg class="svg-icon" style="width: 1.001953125em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1013.7 90.8C997.8 75.5 972.4 76 957.1 92L510.9 557.1 73.2 90.8C58 74.7 32.7 73.9 16.6 89 0.5 104.1-0.3 129.4 14.8 145.5l466.6 497.1 1.5 1.5c0.2 0.2 0.4 0.4 0.7 0.6 0.3 0.3 0.6 0.5 0.9 0.8 0.3 0.3 0.6 0.5 0.9 0.7 0.2 0.2 0.4 0.4 0.7 0.6 0.3 0.2 0.6 0.5 0.9 0.7 0.2 0.2 0.5 0.4 0.7 0.5l0.9 0.6c0.3 0.2 0.5 0.4 0.8 0.5 0.3 0.2 0.6 0.3 0.9 0.5 0.3 0.2 0.6 0.3 0.9 0.5 0.3 0.2 0.5 0.3 0.8 0.4 0.3 0.2 0.6 0.3 1 0.5 0.3 0.1 0.5 0.3 0.8 0.4 0.3 0.2 0.7 0.3 1 0.5 0.2 0.1 0.5 0.2 0.7 0.3 0.4 0.2 0.7 0.3 1.1 0.4 0.2 0.1 0.5 0.2 0.7 0.3 0.4 0.1 0.8 0.3 1.2 0.4 0.2 0.1 0.5 0.1 0.7 0.2l1.2 0.3c0.2 0.1 0.4 0.1 0.7 0.2 0.4 0.1 0.8 0.2 1.3 0.3 0.2 0 0.4 0.1 0.6 0.1 0.4 0.1 0.9 0.2 1.3 0.2 0.2 0 0.4 0.1 0.6 0.1 0.5 0.1 0.9 0.1 1.4 0.2 0.2 0 0.4 0 0.6 0.1 0.5 0 1 0.1 1.5 0.1h4.6c0.5 0 1-0.1 1.5-0.1 0.2 0 0.4 0 0.5-0.1 0.5 0 0.9-0.1 1.4-0.2 0.2 0 0.4-0.1 0.6-0.1 0.4-0.1 0.9-0.1 1.3-0.2 0.2 0 0.4-0.1 0.6-0.1l1.2-0.3c0.2-0.1 0.4-0.1 0.7-0.2l1.2-0.3c0.2-0.1 0.5-0.1 0.7-0.2 0.4-0.1 0.8-0.2 1.1-0.4 0.2-0.1 0.5-0.2 0.7-0.3 0.4-0.1 0.7-0.3 1.1-0.4 0.3-0.1 0.5-0.2 0.8-0.3 0.3-0.1 0.7-0.3 1-0.5 0.3-0.1 0.5-0.2 0.8-0.4 0.3-0.2 0.6-0.3 0.9-0.5 0.3-0.1 0.6-0.3 0.8-0.4 0.3-0.2 0.6-0.3 0.8-0.5 0.3-0.2 0.6-0.3 0.9-0.5 0.3-0.2 0.5-0.3 0.8-0.5l0.9-0.6c0.2-0.2 0.4-0.3 0.7-0.5 0.3-0.2 0.6-0.5 1-0.7 0.2-0.1 0.4-0.3 0.6-0.5 0.3-0.3 0.7-0.5 1-0.8 0.2-0.1 0.3-0.3 0.5-0.5 0.5-0.5 1-0.9 1.5-1.4l0.9-0.9 475.4-495.6c15.3-15.7 14.7-41.1-1.2-56.3z" fill="#898989" /></svg>
```

--------------------------------------------------------------------------------

---[FILE: overview.svg]---
Location: prowler-master/dashboard/assets/images/icons/overview.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0z" clip-rule="evenodd"/>
  <path fill-rule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3z" clip-rule="evenodd"/>
</svg>
```

--------------------------------------------------------------------------------

````

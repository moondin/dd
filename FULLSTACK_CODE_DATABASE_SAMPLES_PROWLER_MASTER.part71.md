---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 71
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 71 of 867)

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

---[FILE: nis2_azure.py]---
Location: prowler-master/dashboard/compliance/nis2_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_3_levels

warnings.filterwarnings("ignore")


def get_table(data):
    data["REQUIREMENTS_DESCRIPTION"] = (
        data["REQUIREMENTS_ID"] + " - " + data["REQUIREMENTS_DESCRIPTION"]
    )

    data["REQUIREMENTS_DESCRIPTION"] = data["REQUIREMENTS_DESCRIPTION"].apply(
        lambda x: x[:150] + "..." if len(str(x)) > 150 else x
    )

    data["REQUIREMENTS_ATTRIBUTES_SECTION"] = data[
        "REQUIREMENTS_ATTRIBUTES_SECTION"
    ].apply(lambda x: x[:80] + "..." if len(str(x)) > 80 else x)

    data["REQUIREMENTS_ATTRIBUTES_SUBSECTION"] = data[
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION"
    ].apply(lambda x: x[:150] + "..." if len(str(x)) > 150 else x)

    aux = data[
        [
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_3_levels(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_DESCRIPTION",
    )
```

--------------------------------------------------------------------------------

---[FILE: nis2_gcp.py]---
Location: prowler-master/dashboard/compliance/nis2_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_3_levels

warnings.filterwarnings("ignore")


def get_table(data):
    data["REQUIREMENTS_DESCRIPTION"] = (
        data["REQUIREMENTS_ID"] + " - " + data["REQUIREMENTS_DESCRIPTION"]
    )

    data["REQUIREMENTS_DESCRIPTION"] = data["REQUIREMENTS_DESCRIPTION"].apply(
        lambda x: x[:150] + "..." if len(str(x)) > 150 else x
    )

    data["REQUIREMENTS_ATTRIBUTES_SECTION"] = data[
        "REQUIREMENTS_ATTRIBUTES_SECTION"
    ].apply(lambda x: x[:80] + "..." if len(str(x)) > 80 else x)

    data["REQUIREMENTS_ATTRIBUTES_SUBSECTION"] = data[
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION"
    ].apply(lambda x: x[:150] + "..." if len(str(x)) > 150 else x)

    aux = data[
        [
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_3_levels(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_DESCRIPTION",
    )
```

--------------------------------------------------------------------------------

---[FILE: nist_800_171_revision_2_aws.py]---
Location: prowler-master/dashboard/compliance/nist_800_171_revision_2_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: nist_800_53_revision_4_aws.py]---
Location: prowler-master/dashboard/compliance/nist_800_53_revision_4_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: nist_800_53_revision_5_aws.py]---
Location: prowler-master/dashboard/compliance/nist_800_53_revision_5_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: nist_csf_1_1_aws.py]---
Location: prowler-master/dashboard/compliance/nist_csf_1_1_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: nist_csf_2_0_aws.py]---
Location: prowler-master/dashboard/compliance/nist_csf_2_0_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: pci_3_2_1_aws.py]---
Location: prowler-master/dashboard/compliance/pci_3_2_1_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format1

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format1(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: pci_4_0_aws.py]---
Location: prowler-master/dashboard/compliance/pci_4_0_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: pci_4_0_azure.py]---
Location: prowler-master/dashboard/compliance/pci_4_0_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: pci_4_0_gcp.py]---
Location: prowler-master/dashboard/compliance/pci_4_0_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: pci_4_0_kubernetes.py]---
Location: prowler-master/dashboard/compliance/pci_4_0_kubernetes.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: prowler_threatscore_aws.py]---
Location: prowler-master/dashboard/compliance/prowler_threatscore_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_threatscore

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_threatscore(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_ID",
    )
```

--------------------------------------------------------------------------------

---[FILE: prowler_threatscore_azure.py]---
Location: prowler-master/dashboard/compliance/prowler_threatscore_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_threatscore

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_threatscore(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_ID",
    )
```

--------------------------------------------------------------------------------

---[FILE: prowler_threatscore_gcp.py]---
Location: prowler-master/dashboard/compliance/prowler_threatscore_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_threatscore

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_threatscore(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_ID",
    )
```

--------------------------------------------------------------------------------

---[FILE: prowler_threatscore_kubernetes.py]---
Location: prowler-master/dashboard/compliance/prowler_threatscore_kubernetes.py

```python
import warnings

from dashboard.common_methods import get_section_containers_threatscore

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_threatscore(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_ID",
    )
```

--------------------------------------------------------------------------------

---[FILE: prowler_threatscore_m365.py]---
Location: prowler-master/dashboard/compliance/prowler_threatscore_m365.py

```python
import warnings

from dashboard.common_methods import get_section_containers_threatscore

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_threatscore(
        aux,
        "REQUIREMENTS_ATTRIBUTES_SECTION",
        "REQUIREMENTS_ATTRIBUTES_SUBSECTION",
        "REQUIREMENTS_ID",
    )
```

--------------------------------------------------------------------------------

---[FILE: rbi_cyber_security_framework_aws.py]---
Location: prowler-master/dashboard/compliance/rbi_cyber_security_framework_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_rbi

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ]
    return get_section_containers_rbi(aux, "REQUIREMENTS_ID")
```

--------------------------------------------------------------------------------

---[FILE: soc2_aws.py]---
Location: prowler-master/dashboard/compliance/soc2_aws.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: soc2_azure.py]---
Location: prowler-master/dashboard/compliance/soc2_azure.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: soc2_gcp.py]---
Location: prowler-master/dashboard/compliance/soc2_gcp.py

```python
import warnings

from dashboard.common_methods import get_section_containers_format3

warnings.filterwarnings("ignore")


def get_table(data):
    aux = data[
        [
            "REQUIREMENTS_ID",
            "REQUIREMENTS_DESCRIPTION",
            "REQUIREMENTS_ATTRIBUTES_SECTION",
            "CHECKID",
            "STATUS",
            "REGION",
            "ACCOUNTID",
            "RESOURCEID",
        ]
    ].copy()

    return get_section_containers_format3(
        aux, "REQUIREMENTS_ATTRIBUTES_SECTION", "REQUIREMENTS_ID"
    )
```

--------------------------------------------------------------------------------

---[FILE: cards.py]---
Location: prowler-master/dashboard/lib/cards.py

```python
from typing import List

from dash import html


def create_provider_card(
    provider: str,
    provider_logo: str,
    account_type: str,
    filtered_data,
) -> List[html.Div]:
    """
    Card to display the provider's name and icon.
    Args:
        provider (str): Name of the provider.
        provider_icon (str): Icon of the provider.
    Returns:
        html.Div: Card to display the provider's name and icon.
    """
    accounts = len(
        filtered_data[filtered_data["PROVIDER"] == provider]["ACCOUNT_UID"].unique()
    )
    checks_executed = len(
        filtered_data[filtered_data["PROVIDER"] == provider]["CHECK_ID"].unique()
    )
    fails = len(
        filtered_data[
            (filtered_data["PROVIDER"] == provider)
            & (filtered_data["STATUS"] == "FAIL")
        ]
    )
    passes = len(
        filtered_data[
            (filtered_data["PROVIDER"] == provider)
            & (filtered_data["STATUS"] == "PASS")
        ]
    )
    # Take the values in the MUTED colum that are true for the provider
    if "MUTED" in filtered_data.columns:
        muted = len(
            filtered_data[
                (filtered_data["PROVIDER"] == provider)
                & (filtered_data["MUTED"] == "True")
            ]
        )
    else:
        muted = 0

    return [
        html.Div(
            [
                html.Div(
                    [
                        html.Div(
                            [
                                html.Div(
                                    [
                                        html.Div([provider_logo], className="w-8"),
                                    ],
                                    className="p-2 shadow-box-up rounded-full",
                                ),
                                html.H5(
                                    f"{provider.upper()} {account_type}",
                                    className="text-base font-semibold leading-snug tracking-normal text-gray-900",
                                ),
                            ],
                            className="flex justify-between items-center mb-3",
                        ),
                        html.Div(
                            [
                                html.Div(
                                    [
                                        html.Span(
                                            account_type,
                                            className="text-prowler-stone-900 inline-block text-3xs font-bold uppercase transition-all rounded-lg text-prowler-stone-900 shadow-box-up px-4 py-1 text-center col-span-6 flex justify-center items-center",
                                        ),
                                        html.Div(
                                            accounts,
                                            className="inline-block text-xs  text-prowler-stone-900 font-bold shadow-box-down px-4 py-1 rounded-lg text-center col-span-5 col-end-13",
                                        ),
                                    ],
                                    className="grid grid-cols-12",
                                ),
                                html.Div(
                                    [
                                        html.Span(
                                            "Checks",
                                            className="text-prowler-stone-900 inline-block text-3xs font-bold uppercase transition-all rounded-lg text-prowler-stone-900 shadow-box-up px-4 py-1 text-center col-span-6 flex justify-center items-center",
                                        ),
                                        html.Div(
                                            checks_executed,
                                            className="inline-block text-xs  text-prowler-stone-900 font-bold shadow-box-down px-4 py-1 rounded-lg text-center col-span-5 col-end-13",
                                        ),
                                    ],
                                    className="grid grid-cols-12",
                                ),
                                html.Div(
                                    [
                                        html.Span(
                                            "FAILED",
                                            className="text-prowler-stone-900 inline-block text-3xs font-bold uppercase transition-all rounded-lg text-prowler-stone-900 shadow-box-up px-4 py-1 text-center col-span-6 flex justify-center items-center",
                                        ),
                                        html.Div(
                                            [
                                                html.Div(
                                                    fails,
                                                    className="m-[2px] px-4 py-1 rounded-lg bg-gradient-failed",
                                                ),
                                            ],
                                            className="inline-block text-xs font-bold shadow-box-down  rounded-lg text-center col-span-5 col-end-13",
                                        ),
                                    ],
                                    className="grid grid-cols-12",
                                ),
                                html.Div(
                                    [
                                        html.Span(
                                            "PASSED",
                                            className="text-prowler-stone-900 inline-block text-3xs font-bold uppercase transition-all rounded-lg text-prowler-stone-900 shadow-box-up px-4 py-1 text-center col-span-6 flex justify-center items-center",
                                        ),
                                        html.Div(
                                            [
                                                html.Div(
                                                    passes,
                                                    className="m-[2px] px-4 py-1 rounded-lg bg-gradient-passed",
                                                ),
                                            ],
                                            className="inline-block text-xs font-bold shadow-box-down rounded-lg text-center col-span-5 col-end-13",
                                        ),
                                    ],
                                    className="grid grid-cols-12",
                                ),
                                html.Div(
                                    [
                                        html.Span(
                                            "MUTED",
                                            className="text-prowler-stone-900 inline-block text-3xs font-bold uppercase transition-all rounded-lg text-prowler-stone-900 shadow-box-up px-4 py-1 text-center col-span-6 flex justify-center items-center",
                                        ),
                                        html.Div(
                                            [
                                                html.Div(
                                                    muted,
                                                    className="m-[2px] px-4 py-1 rounded-lg bg-gradient-muted",
                                                ),
                                            ],
                                            className="inline-block text-xs font-bold shadow-box-down rounded-lg text-center col-span-5 col-end-13",
                                        ),
                                    ],
                                    className="grid grid-cols-12",
                                ),
                            ],
                            className="grid gap-x-8 gap-y-4",
                        ),
                    ],
                    className="px-4 py-3",
                ),
            ],
            className="relative flex flex-col bg-white shadow-provider rounded-xl w-full transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 hover:z-50 hover:cursor-pointer",
        )
    ]
```

--------------------------------------------------------------------------------

---[FILE: dropdowns.py]---
Location: prowler-master/dashboard/lib/dropdowns.py

```python
from dash import dcc, html


def create_date_dropdown(assesment_times: list) -> html.Div:
    """
    Dropdown to select the date of the last available scan for each account.
    Args:
        assesment_times (list): List of dates of the last available scan for each account.
    Returns:
        html.Div: Dropdown to select the date of the last available scan for each account.
    """
    return html.Div(
        [
            html.Div(
                [
                    html.Label(
                        "Assessment date (last available scan) ",
                        className="text-prowler-stone-900 font-bold text-sm",
                    ),
                    html.Img(
                        id="info-file-over",
                        src="/assets/images/icons/help-black.png",
                        className="w-5",
                        title="The date of the last available scan for each account is displayed here. If you have not run prowler yet, the date will be empty.",
                    ),
                ],
                style={"display": "inline-flex"},
            ),
            dcc.Dropdown(
                id="report-date-filter",
                options=[
                    {"label": account, "value": account} for account in assesment_times
                ],
                value=assesment_times[0],
                clearable=False,
                multi=False,
                style={"color": "#000000", "width": "100%"},
            ),
        ],
    )


def create_date_dropdown_compliance(assesment_times: list) -> html.Div:
    """
    Dropdown to select the date of the last available scan for each account.
    Args:
        assesment_times (list): List of dates of the last available scan for each account.
    Returns:
        html.Div: Dropdown to select the date of the last available scan for each account.
    """
    return html.Div(
        [
            html.Label(
                "Assesment Date:", className="text-prowler-stone-900 font-bold text-sm"
            ),
            dcc.Dropdown(
                id="date-filter-analytics",
                options=[
                    {"label": account, "value": account} for account in assesment_times
                ],
                value=assesment_times[0],
                clearable=False,
                multi=False,
                style={"color": "#000000", "width": "100%"},
            ),
        ],
    )


def create_region_dropdown(regions: list) -> html.Div:
    """
    Dropdown to select the region of the account.
    Args:
        regions (list): List of regions of the account.
    Returns:
        html.Div: Dropdown to select the region of the account.
    """
    return html.Div(
        [
            html.Label(
                "Region / Location / Namespace :",
                className="text-prowler-stone-900 font-bold text-sm",
            ),
            dcc.Dropdown(
                id="region-filter",
                options=[{"label": region, "value": region} for region in regions],
                value=["All"],  # Initial selection is ALL
                clearable=False,
                multi=True,
                style={"color": "#000000", "width": "100%"},
            ),
        ],
    )


def create_region_dropdown_compliance(regions: list) -> html.Div:
    """
    Dropdown to select the region of the account.
    Args:
        regions (list): List of regions of the account.
    Returns:
        html.Div: Dropdown to select the region of the account.
    """
    return html.Div(
        [
            html.Label(
                "Region / Location / Namespace :",
                className="text-prowler-stone-900 font-bold text-sm",
            ),
            dcc.Dropdown(
                id="region-filter-compliance",
                options=[{"label": region, "value": region} for region in regions],
                value=["All"],  # Initial selection is ALL
                clearable=False,
                multi=True,
                style={"color": "#000000", "width": "100%"},
            ),
        ],
    )


def create_account_dropdown(accounts: list) -> html.Div:
    """
    Dropdown to select the account.
    Args:
        accounts (list): List of accounts.
    Returns:
        html.Div: Dropdown to select the account.
    """
    return html.Div(
        [
            html.Label(
                "Account / Subscription / Project / Cluster :",
                className="text-prowler-stone-900 font-bold text-sm",
            ),
            dcc.Dropdown(
                id="cloud-account-filter",
                options=[{"label": account, "value": account} for account in accounts],
                value=["All"],  # Initial selection is ALL
                clearable=False,
                multi=True,
                style={"color": "#000000", "width": "100%"},
            ),
        ],
    )


def create_account_dropdown_compliance(accounts: list) -> html.Div:
    """
    Dropdown to select the account.
    Args:
        accounts (list): List of accounts.
    Returns:
        html.Div: Dropdown to select the account.
    """
    return html.Div(
        [
            html.Label(
                "Account / Subscription / Project / Cluster :",
                className="text-prowler-stone-900 font-bold text-sm",
            ),
            dcc.Dropdown(
                id="cloud-account-filter-compliance",
                options=[{"label": account, "value": account} for account in accounts],
                value=["All"],  # Initial selection is ALL
                clearable=False,
                multi=True,
                style={"color": "#000000", "width": "100%"},
            ),
        ],
    )


def create_compliance_dropdown(compliance: list) -> html.Div:
    """
    Dropdown to select the compliance.
    Args:
        compliance (list): List of compliance.
    Returns:
        html.Div: Dropdown to select the compliance.
    """
    return html.Div(
        [
            html.Label(
                "Compliance:", className="text-prowler-stone-900 font-bold text-sm"
            ),
            dcc.Dropdown(
                id="report-compliance-filter",
                options=[{"label": i, "value": i} for i in compliance],
                value=compliance[0],
                clearable=False,
                style={"color": "#000000"},
            ),
        ],
    )


def create_severity_dropdown(severity: list) -> html.Div:
    """
    Dropdown to select the severity.
    Args:
        severity (list): List of severity.
    Returns:
        html.Div: Dropdown to select the severity.
    """
    return html.Div(
        [
            html.Label(
                "Severity:", className="text-prowler-stone-900 font-bold text-sm"
            ),
            dcc.Dropdown(
                id="severity-filter",
                options=[{"label": i, "value": i} for i in severity],
                value=["All"],
                clearable=False,
                multi=True,
                style={"color": "#000000"},
            ),
        ],
    )


def create_service_dropdown(services: list) -> html.Div:
    """
    Dropdown to select the service.
    Args:
        services (list): List of services.
    Returns:
        html.Div: Dropdown to select the service.
    """
    return html.Div(
        [
            html.Label(
                "Service:", className="text-prowler-stone-900 font-bold text-sm"
            ),
            dcc.Dropdown(
                id="service-filter",
                options=[{"label": i, "value": i} for i in services],
                value=["All"],
                clearable=False,
                multi=True,
                style={"color": "#000000"},
            ),
        ],
    )


def create_provider_dropdown(providers: list) -> html.Div:
    """
    Dropdown to select the provider.
    Args:
        providers (list): List of providers.
    Returns:
        html.Div: Dropdown to select the provider.
    """
    return html.Div(
        [
            html.Label(
                "Provider:", className="text-prowler-stone-900 font-bold text-sm"
            ),
            dcc.Dropdown(
                id="provider-filter",
                options=[{"label": i, "value": i} for i in providers],
                value=["All"],
                clearable=False,
                multi=True,
                style={"color": "#000000"},
            ),
        ],
    )


def create_status_dropdown(status: list) -> html.Div:
    """
    Dropdown to select the status.
    Args:
        status (list): List of status.
    Returns:
        html.Div: Dropdown to select the status.
    """
    return html.Div(
        [
            html.Label("Status:", className="text-prowler-stone-900 font-bold text-sm"),
            dcc.Dropdown(
                id="status-filter",
                options=[{"label": i, "value": i} for i in status],
                value=["All"],
                clearable=False,
                multi=True,
                style={"color": "#000000"},
            ),
        ],
    )


def create_table_row_dropdown(table_rows: list) -> html.Div:
    """
    Dropdown to select the number of rows in the table.
    Args:
        table_rows (list): List of number of rows.
    Returns:
        html.Div: Dropdown to select the number of rows in the table.
    """
    return html.Div(
        [
            dcc.Dropdown(
                id="table-rows",
                options=[{"label": i, "value": i} for i in table_rows],
                value=table_rows[0],
                clearable=False,
                style={"color": "#000000", "margin-right": "10px"},
            ),
        ],
    )
```

--------------------------------------------------------------------------------

````

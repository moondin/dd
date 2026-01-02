---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 43
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 43 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: messages.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/openai/messages.rst

```text
:orphan:

.. _mlflow.openai.messages:

Supported ``messages`` formats for OpenAI chat completion task
==============================================================

This document covers the following:

- Supported ``messages`` formats for OpenAI chat completion task in the ``openai`` flavor.
- Logged model signature for each format.
- Payload sent to OpenAI chat completion API for each format.
- Expected prediction input types for each format.


``messages`` with variables
---------------------------

The ``messages`` argument accepts a list of dictionaries with ``role`` and ``content`` keys. The
``content`` field in each message can contain variables (= named format fields). When the logged
model is loaded and makes a prediction, the variables are replaced with the values from the
prediction input.

Single variable
~~~~~~~~~~~~~~~

.. code-block:: python

    import mlflow
    import openai

    with mlflow.start_run():
        model_info = mlflow.openai.log_model(
            name="model",
            model="gpt-4o-mini",
            task=openai.chat.completions,
            messages=[
                {
                    "role": "user",
                    "content": "Tell me a {adjective} joke",
                    #                     ^^^^^^^^^^
                    #                     variable
                },
                # Can contain more messages
            ],
        )

    model = mlflow.pyfunc.load_model(model_info.model_uri)
    print(model.predict([{"adjective": "funny"}]))

Logged model signature:

.. code-block:: python

    {
        "inputs": [{"type": "string"}],
        "outputs": [{"type": "string"}],
    }

Expected prediction input types:

.. code-block:: python

    # A list of dictionaries with 'adjective' key
    [{"adjective": "funny"}, ...]

    # A list of strings
    ["funny", ...]


Payload sent to OpenAI chat completion API:

.. code-block:: python

    {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Tell me a funny joke",
            }
        ],
    }


Multiple variables
~~~~~~~~~~~~~~~~~~

.. code-block:: python

    import mlflow
    import openai

    with mlflow.start_run():
        model_info = mlflow.openai.log_model(
            name="model",
            model="gpt-4o-mini",
            task=openai.chat.completions,
            messages=[
                {
                    "role": "user",
                    "content": "Tell me a {adjective} joke about {thing}.",
                    #                     ^^^^^^^^^^             ^^^^^^^
                    #                     variable               another variable
                },
                # Can contain more messages
            ],
        )

    model = mlflow.pyfunc.load_model(model_info.model_uri)
    print(model.predict([{"adjective": "funny", "thing": "vim"}]))

Logged model signature:

.. code-block:: python

    {
        "inputs": [
            {"name": "adjective", "type": "string"},
            {"name": "thing", "type": "string"},
        ],
        "outputs": [{"type": "string"}],
    }

Expected prediction input types:

.. code-block:: python

    # A list of dictionaries with 'adjective' and 'thing' keys
    [{"adjective": "funny", "thing": "vim"}, ...]

Payload sent to OpenAI chat completion API:

.. code-block:: python

    {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Tell me a funny joke about vim",
            }
        ],
    }


``messages`` without variables
------------------------------

If no variables are provided, the prediction input will be _appended_ to the logged ``messages``
with ``role = user``.

.. code-block:: python

    with mlflow.start_run():
        model_info = mlflow.openai.log_model(
            name="model",
            model="gpt-4o-mini",
            task=openai.chat.completions,
            messages=[
                {
                    "role": "system",
                    "content": "You're a frontend engineer.",
                }
            ],
        )

    model = mlflow.pyfunc.load_model(model_info.model_uri)
    print(model.predict(["Tell me a funny joke."]))

Logged model signature:

.. code-block:: python

    {
        "inputs": [{"type": "string"}],
        "outputs": [{"type": "string"}],
    }

Expected prediction input type:

- A list of dictionaries with a single key
- A list of strings

Payload sent to OpenAI chat completion API:

.. code-block:: python

    {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You're a frontend engineer.",
            },
            {
                "role": "user",
                "content": "Tell me a funny joke.",
            },
        ],
    }


No ``messages``
---------------

The ``messages`` argument is optional and can be omitted. If omitted, the prediction input will be
sent to the OpenAI chat completion API as-is with ``role = user``.

.. code-block:: python

    import mlflow
    import openai

    with mlflow.start_run():
        model_info = mlflow.openai.log_model(
            name="model",
            model="gpt-4o-mini",
            task=openai.chat.completions,
        )

    model = mlflow.pyfunc.load_model(model_info.model_uri)
    print(model.predict(["Tell me a funny joke."]))

Logged model signature:

.. code-block:: python

    {
        "inputs": [{"type": "string"}],
        "outputs": [{"type": "string"}],
    }

Expected prediction input types:

.. code-block:: python

    # A list of dictionaries with a single key
    [{"<any key>": "Tell me a funny joke."}, ...]

    # A list of strings
    ["Tell me a funny joke.", ...]

Payload sent to OpenAI chat completion API:

.. code-block:: python

    {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Tell me a funny joke.",
            }
        ],
    }
```

--------------------------------------------------------------------------------

---[FILE: index.rst]---
Location: mlflow-master/docs/api_reference/source/typescript_api/index.rst

```text
.. _typescript_api:

TypeScript API
==============

This file is a placeholder. TypeScript documentation is filled in by the build-tsdoc.sh script, executed during "make html".
```

--------------------------------------------------------------------------------

---[FILE: clippy.svg]---
Location: mlflow-master/docs/api_reference/source/_static/clippy.svg

```text
<svg height="1024" width="896" xmlns="http://www.w3.org/2000/svg">
  <path d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" />
</svg>
```

--------------------------------------------------------------------------------

---[FILE: runllm.js]---
Location: mlflow-master/docs/api_reference/source/_static/runllm.js

```javascript
document.addEventListener("DOMContentLoaded", function () {
    var script = document.createElement("script");
    script.type = "module";
    script.id = "runllm-widget-script"

    script.src = "https://widget.runllm.com";

    script.setAttribute("runllm-keyboard-shortcut", "Mod+j"); // cmd-j or ctrl-j to open the widget.
    script.setAttribute("runllm-name", "MLflow");
    script.setAttribute("runllm-position", "BOTTOM_RIGHT");
    script.setAttribute("runllm-assistant-id", "116");
    script.setAttribute("runllm-theme-color", "#008ED9");
    script.setAttribute("runllm-brand-logo", "https://mlflow.org/img/mlflow-favicon.ico");
    script.setAttribute("runllm-community-type", "slack");
    script.setAttribute("runllm-community-url", "https://mlflow.org/slack");
    script.setAttribute("runllm-disable-ask-a-person", "true");

    script.async = true;
    document.head.appendChild(script);
});
```

--------------------------------------------------------------------------------

---[FILE: important-icon.svg]---
Location: mlflow-master/docs/api_reference/source/_static/icons/important-icon.svg

```text
<?xml version="1.0" encoding="utf-8"?>
<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5-103 385.5-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103zm128 1247v-190q0-14-9-23.5t-22-9.5h-192q-13 0-23 10t-10 23v190q0 13 10 23t23 10h192q13 0 22-9.5t9-23.5zm-2-344l18-621q0-12-10-18-10-8-24-8h-220q-14 0-24 8-10 6-10 18l17 621q0 10 10 17.5t24 7.5h185q14 0 23.5-7.5t10.5-17.5z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: nav-home.svg]---
Location: mlflow-master/docs/api_reference/source/_static/icons/nav-home.svg

```text
<?xml version="1.0" encoding="UTF-8"?>
<svg width="19px" height="16px" viewBox="0 0 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 40 (33762) - http://www.bohemiancoding.com/sketch -->
    <title>house</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="1" transform="translate(-11.000000, -237.000000)" stroke-width="1.5" stroke="#0193E1">
            <g id="leftnav" transform="translate(0.000000, 74.000000)">
                <g id="house" transform="translate(12.000000, 164.000000)">
                    <g id="Group-5">
                        <polyline id="Stroke-1" points="3 4.10584211 3 13.9431579 14 13.9431579 14 4.10584211"></polyline>
                        <polyline id="Stroke-3" points="17 6.71168421 8.5004837 0.5 0 6.71168421"></polyline>
                    </g>
                    <path d="M8.75,13.5 L8.75,10.5" id="Line" stroke-linecap="square"></path>
                </g>
            </g>
        </g>
    </g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: note-icon.svg]---
Location: mlflow-master/docs/api_reference/source/_static/icons/note-icon.svg

```text
<?xml version="1.0" encoding="utf-8"?>
<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M532 1108l152 152-52 52h-56v-96h-96v-56zm414-390q14 13-3 30l-291 291q-17 17-30 3-14-13 3-30l291-291q17-17 30-3zm-274 690l544-544-288-288-544 544v288h288zm608-608l92-92q28-28 28-68t-28-68l-152-152q-28-28-68-28t-68 28l-92 92zm384-384v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: tip-icon.svg]---
Location: mlflow-master/docs/api_reference/source/_static/icons/tip-icon.svg

```text
<?xml version="1.0" encoding="utf-8"?>
<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1120 576q0 13-9.5 22.5t-22.5 9.5-22.5-9.5-9.5-22.5q0-46-54-71t-106-25q-13 0-22.5-9.5t-9.5-22.5 9.5-22.5 22.5-9.5q50 0 99.5 16t87 54 37.5 90zm160 0q0-72-34.5-134t-90-101.5-123-62-136.5-22.5-136.5 22.5-123 62-90 101.5-34.5 134q0 101 68 180 10 11 30.5 33t30.5 33q128 153 141 298h228q13-145 141-298 10-11 30.5-33t30.5-33q68-79 68-180zm128 0q0 155-103 268-45 49-74.5 87t-59.5 95.5-34 107.5q47 28 47 82 0 37-25 64 25 27 25 64 0 52-45 81 13 23 13 47 0 46-31.5 71t-77.5 25q-20 44-60 70t-87 26-87-26-60-70q-46 0-77.5-25t-31.5-71q0-24 13-47-45-29-45-81 0-37 25-64-25-27-25-64 0-54 47-82-4-50-34-107.5t-59.5-95.5-74.5-87q-103-113-103-268 0-99 44.5-184.5t117-142 164-89 186.5-32.5 186.5 32.5 164 89 117 142 44.5 184.5z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: warning-icon.svg]---
Location: mlflow-master/docs/api_reference/source/_static/icons/warning-icon.svg

```text
<?xml version="1.0" encoding="utf-8"?>
<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z" fill="#fff"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: body_postscripts.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/body_postscripts.html

```text
{% if not embedded %}
  <script type="text/javascript">
    var DOCUMENTATION_OPTIONS = {
      URL_ROOT:'{{ url_root }}',
      VERSION:'{{ release|e }}',
      COLLAPSE_INDEX:false,
      FILE_SUFFIX:'{{ '' if no_search_suffix else file_suffix }}',
      HAS_SOURCE:  {{ has_source|lower }}
    };
  </script>

  {%- for scriptfile in script_files %}
    <script type="text/javascript" src="/{{ pathto(scriptfile, 1) }}"></script>
  {%- endfor %}
{% endif %}

<script type="text/javascript" src="{{ pathto('_static/js/clipboard.min.js', 1) }}"></script>
<script type="text/javascript" src="{{ pathto('_static/js/jquery.waypoints.min.js', 1) }}"></script>

{# RTD hosts this file, so just load on non RTD builds #}
{% if not READTHEDOCS %}
  {# I'm sorry, I don't know how to use sphinx to inject this into the static JS. #}
  <script type="text/javascript">var CLIPPY_SVG_PATH = "{{ pathto('_static/clippy.svg', 1) }}";</script>
  <script type="text/javascript" src="{{ pathto('_static/js/custom.js', 1) }}"></script>
{% endif %}

{# STICKY NAVIGATION #}
{% if theme_sticky_navigation %}
  <script type="text/javascript">
    jQuery(function () {
      SphinxRtdTheme.StickyNav.enable();
    });

  </script>
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: breadcrumbs.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/breadcrumbs.html

```text
{# Support for Sphinx 1.3+ page_source_suffix, but don't break old builds. #}

{% if page_source_suffix %}
{% set suffix = page_source_suffix %}
{% else %}
{% set suffix = source_suffix %}
{% endif %}

{% set github_user = 'mlflow' %}
{% set github_repo = 'mlflow'  %}
{% set github_version = 'master' %}
{% set conf_py_path = 'docs/source' %}

<div role="navigation" aria-label="breadcrumbs navigation">
  <ul class="wy-breadcrumbs">
    <li><a href="{{ pathto(master_doc) }}">Documentation</a> <span class="db-icon db-icon-chevron-right"></span></li>
    {% for doc in parents %}
        <li><a href="{{ doc.link|e }}">{{ doc.title }}</a> <span class="db-icon db-icon-chevron-right"></span></li>
    {% endfor %}
    {% if title %}
      <li>{{ title }}</li>
    {% elif pagename == "search" %}
      <li>Search</li>
    {% endif %}
    {% if not pagename == "search" %}
    <!-- <li class="wy-breadcrumbs-aside">
      <a href="https://{{ github_host|default("github.com") }}/{{ github_user }}/{{ github_repo }}/blob/{{ github_version }}/{{ conf_py_path }}/{{ pagename }}{{ suffix }}" class="fa fa-github"> Edit on GitHub</a>
    </li> -->
    {% endif %}
  </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: build_info.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/build_info.html

```text
{%- if (build_id and build_url) or commit or last_updated or last_edited %}
  <p class="build_info">
    {%- if build_id and build_url %}
      {% trans build_url=build_url, build_id=build_id %}
        <span class="build">
          Build
          <a href="{{ build_url }}">{{ build_id }}</a>.
        </span>
      {% endtrans %}
    {%- elif commit %}
      {% trans commit=commit %}
        <span class="commit">
          Revision <code>{{ commit }}</code>.
        </span>
      {% endtrans %}
    {%- elif last_updated %}
      {% trans last_updated=last_updated|e %}Updated {{ last_updated }}{% endtrans %}
    {%- endif %}
  </p>
{%- endif %}
```

--------------------------------------------------------------------------------

---[FILE: footer.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/footer.html

```text
<footer>
  {% if next or prev %}
    <div class="rst-footer-buttons" role="navigation" aria-label="footer navigation">
      {% if prev %}
        <a href="{{ prev.link|e }}" class="btn btn-neutral" title="{{ prev.title|striptags|e }}" accesskey="p"><span class="db-icon db-icon-chevron-left"></span> Previous</a>
      {% endif %}
      {% if next %}
        <a href="{{ next.link|e }}" class="btn btn-neutral" title="{{ next.title|striptags|e }}" accesskey="n">Next <span class="db-icon db-icon-chevron-right"></span></a>
      {% endif %}
    </div>
  {% endif %}

  <hr/>

  <div role="contentinfo">
    {%- if show_copyright %}
      <p class="copyright">
        {%- if hasdoc('copyright') %}
          {% trans path=pathto('copyright'), copyright=copyright|e %}&copy; <a href="{{ path }}">Copyright</a> {{ copyright }}{% endtrans %}
        {%- else %}
          {% trans copyright=copyright|e %}&copy; {{ copyright }}.{% endtrans %}
        {%- endif %}
      </p>
    {%- endif %}

  </div>

  {%- block extrafooter %} {% endblock %}

</footer>
```

--------------------------------------------------------------------------------

---[FILE: header.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/header.html

```text
<div class="header-container">
  <style scoped>
    .header-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;

      background-color: #fff;
      box-shadow: 0 1px 2px 0 #0000001a;
    }

    .logo-container {
      display: flex;
      gap: 12px;
      flex-direction: row;
      white-space: nowrap;
      align-items: center;
      justify-content: center;
    }

    a:hover {
      text-decoration: none;
      color: #0194e2;
    }
  </style>
  <div class="logo-container">
    <i
      data-toggle="wy-nav-top"
      class="wy-nav-top-menu-button db-icon db-icon-menu pull-left"
    ></i>
    <a href="{{ pathto(master_doc) }}" class="wy-nav-top-logo">
      <img
        src="{{ pathto('_static/MLflow-logo-final-black.png', 1) }}"
        alt="MLflow"
      />
    </a>
    <a
      style="overflow: hidden; text-overflow: ellipsis"
      class="header-link"
      href="/docs/latest"
      >Main Docs</a
    >
    <span style="overflow: hidden; text-overflow: ellipsis" class="header-link"
      >API Documentation</span
    >
  </div>
  <span class="header-link version">{{version}}</span>
</div>
```

--------------------------------------------------------------------------------

---[FILE: layout.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/layout.html

```text
{# TEMPLATE VAR SETTINGS #}
{%- set url_root = pathto('', 1) %}
{%- if url_root == '#' %}{% set url_root = '' %}{% endif %}

<!DOCTYPE html>
<!-- source: docs/source/{{ pagename }}{{ page_source_suffix }} -->
<!--[if IE 8]><html class="no-js lt-ie9" lang="en" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->
<head>
  <meta charset="utf-8">
  {{ metatags }}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {% block htmltitle %}
  <title>{{ title|striptags|e }}</title>
  {% endblock %}
  {# CANONICAL #} 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="canonical" href="https://mlflow.org/docs/latest/{{ pagename }}.html">
  {# FAVICON #}
  {% if favicon %}
    <link rel="shortcut icon" href="{{ pathto('_static/' + favicon, 1) }}"/>
  {% endif %}

  {% if s %}
    <meta name="robots" content="noindex">
  {% endif %}

  {# Google Tag Manager #}
    {% if gtm_id %}
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',"{{gtm_id}}");</script>
        <!-- End Google Tag Manager -->
    {% endif %}
  
  {# GTag #}
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16857946923"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'AW-16857946923');
  </script>
  <!-- Eng gtag -->

  {# CSS #}

  {# Algolia / Docusaurus Indexing #}
  <meta name="docsearch:docusaurus_tag" content="default" data-rh="true">
  <meta name="docusaurus_tag" content="default" data-rh="true">
  <meta name="docusaurus_version" content="current" data-rh="true">
  <meta name="docsearch:version" content="current" data-rh="true">
  <meta name="docusaurus_locale" content="en" data-rh="true">
  <meta name="docsearch:language" content="en" data-rh="true">

  {# OPENSEARCH #}
  {% if not embedded %}
    {% if use_opensearch %}
      <link rel="search" type="application/opensearchdescription+xml" title="{% trans docstitle=docstitle|e %}Search within {{ docstitle }}{% endtrans %}" href="{{ pathto('_static/opensearch.xml', 1) }}"/>
    {% endif %}

  {% endif %}

  {# RTD hosts this file, so just load on non RTD builds #}
  {% if not READTHEDOCS %}
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600" rel="stylesheet">
    <link rel="stylesheet" href="{{ pathto('_static/css/theme.css', 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/css/custom.css', 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/css/cards.css', 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/css/grids.css', 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/css/mobile.css', 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/css/simple-cards.css', 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/css/tabs.css', 1) }}" type="text/css" />
    {% if target_cloud == 'azure' %}
      <link rel="stylesheet" href="{{ pathto('_static/css/custom-azure.css', 1) }}" type="text/css" />
    {% endif %}
  {% endif %}

  {%- block linktags %}
    {%- if hasdoc('about') %}
        <link rel="author" title="{{ _('About these documents') }}"
              href="{{ pathto('about') }}"/>
    {%- endif %}
    {%- if hasdoc('genindex') %}
        <link rel="index" title="{{ _('Index') }}"
              href="{{ pathto('genindex') }}"/>
    {%- endif %}
    {%- if hasdoc('search') %}
        <link rel="search" title="{{ _('Search') }}" href="{{ pathto('search') }}"/>
    {%- endif %}
    {%- if hasdoc('copyright') %}
        <link rel="copyright" title="{{ _('Copyright') }}" href="{{ pathto('copyright') }}"/>
    {%- endif %}
    <link rel="top" title="{{ docstitle|e }}" href="{{ pathto('index') }}"/>
    {%- if parents %}
        <link rel="up" title="{{ parents[-1].title|striptags|e }}" href="{{ parents[-1].link|e }}"/>
    {%- endif %}
    {%- if next %}
        <link rel="next" title="{{ next.title|striptags|e }}" href="/{{ next.link|e }}"/>
    {%- endif %}
    {%- if prev %}
        <link rel="prev" title="{{ prev.title|striptags|e }}" href="/{{ prev.link|e }}"/>
    {%- endif %}
  {%- endblock %}
  {%- block extrahead %} {% endblock %}

  {# Keep modernizr in head - http://modernizr.com/docs/#installing #}
  <script src="{{ pathto('_static/js/modernizr.min.js', 1) }}"></script>

</head>

{%- for scriptfile in script_files %}
<script type="text/javascript" src="{{ pathto(scriptfile, 1) }}"></script>
{%- endfor %}

<body class="wy-body-for-nav" role="document">
  {% if gtm_id %}
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{gtm_id}}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
  {% endif %}

  {# Header. Includes toggle for sidebar when on thin screen #}
  <nav class="wy-nav-top header" role="navigation" aria-label="top navigation">
    {% include "header.html" %}
  </nav>
  <page>
    {# SIDE NAV BAR, TOGGLES ON MOBILE #}

    <nav data-toggle="wy-nav-shift" class="wy-nav-side relative">
      {% include "side_nav.html" %}
    </nav>

    <main class="wy-grid-for-nav">
      <section data-toggle="wy-nav-shift" class="wy-nav-content-wrap">
        <div class="wy-nav-content">
          <div class="rst-content">
            {% include "breadcrumbs.html" %}
            <div role="main" class="document" itemscope="itemscope" itemtype="http://schema.org/Article">
              <div itemprop="articleBody">
                {% block body %}{% endblock %}
              </div>
            </div>
            {% include "footer.html" %}
          </div>
        </div>
      </section>
    </main>
  </page>

  {% include "versions.html" %}

  {% if not embedded %}
  <script type="text/javascript">
    var DOCUMENTATION_OPTIONS = {
      URL_ROOT:'{{ url_root }}',
      VERSION:'{{ release|e }}',
      COLLAPSE_INDEX:false,
      FILE_SUFFIX:'{{ '' if no_search_suffix else file_suffix }}',
      LINK_SUFFIX: '.html',
      HAS_SOURCE:  {{ has_source|lower }}
    };
  </script>

  {% endif %}

  <script type="text/javascript" src="{{ pathto('_static/js/clipboard.min.js', 1) }}"></script>
  <script type="text/javascript" src="{{ pathto('_static/js/jquery.waypoints.min.js', 1) }}"></script>
  {%- block scripts %} {%- endblock %}

  {# RTD hosts this file, so just load on non RTD builds #}
  {% if not READTHEDOCS %}
  {# I'm sorry, I don't know how to use sphinx to inject this into the static JS. #}
  <script type="text/javascript">var CLIPPY_SVG_PATH = "{{ pathto('_static/clippy.svg', 1) }}";</script>
  <script type="text/javascript" src="{{ pathto('_static/js/custom.js', 1) }}"></script>
  {% endif %}

  {# STICKY NAVIGATION #}
  {% if theme_sticky_navigation %}
  <script type="text/javascript">
    jQuery(function () {
      SphinxRtdTheme.StickyNav.enable();
    });

  </script>
  {% endif %}

  {# Clipboard Code Copy Functionality #}
  <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function() {
        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        // Get the code block designator class entries
        const allHighlights = document.querySelectorAll('.highlight');
        // Disable copyable links for notebook cell numbering and for cell outputs
        const highlights = Array.from(allHighlights).filter(highlight => !highlight.closest('.highlight-none') && 
            !highlight.closest('.nboutput'));
    
        highlights.forEach(function(highlight) {
            const copyIcon = document.createElement('span');
            copyIcon.classList.add('copy-icon');
            copyIcon.innerHTML = '&#xf0ea;';

            copyIcon.addEventListener('click', function() {
                const code = highlight.querySelector('pre').textContent;
                copyToClipboard(code);

                // Flash effect on click
                this.style.color = '#0194E2';
                setTimeout(() => {
                    this.style.color = ''; 
                }, 100);

                // Display "Code copied to clipboard" near the clicked icon
                const message = document.createElement('span');
                message.textContent = "Copied!";
                message.classList.add('copy-message'); 

                // Append the message to the icon
                this.appendChild(message);

                setTimeout(() => {
                    this.removeChild(message);
                }, 500);
            });

            highlight.appendChild(copyIcon);
        });
    });
  </script>

{# Notebook download functionality #}
<script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function() {
        // Force download for notebook-download-btn
        const downloadButtons = document.querySelectorAll('.notebook-download-btn');
        downloadButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default behavior

                // Fetch the raw content of the notebook from GitHub
                fetch(button.href)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        const filename = button.href.split('/').pop();
                        link.download = filename; 

                        document.body.appendChild(link);
                        link.click();

                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(link);
                    })
                    .catch(err => console.error('Error fetching the notebook:', err));
            });
        });
    });
</script>


  {%- block footer %} {% endblock %}
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: layout_old.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/layout_old.html

```text
{#
    basic/layout.html
    ~~~~~~~~~~~~~~~~~

    Master layout template for Sphinx themes.

    :copyright: Copyright 2007-2013 by the Sphinx team, see AUTHORS.
    :license: BSD, see LICENSE for details.
#}
{%- block doctype -%}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
{%- endblock %}
{%- set reldelim1 = reldelim1 is not defined and ' &raquo;' or reldelim1 %}
{%- set reldelim2 = reldelim2 is not defined and ' |' or reldelim2 %}
{%- set render_sidebar = (not embedded) and (not theme_nosidebar|tobool) and
                         (sidebars != []) %}
{%- set url_root = pathto('', 1) %}
{# XXX necessary? #}
{%- if url_root == '#' %}{% set url_root = '' %}{% endif %}
{%- if not embedded and docstitle %}
  {%- set titlesuffix = " &mdash; "|safe + docstitle|e %}
{%- else %}
  {%- set titlesuffix = "" %}
{%- endif %}

{%- macro relbar() %}
    <div class="related">
      <h3>{{ _('Navigation') }}</h3>
      <ul>
        {%- for rellink in rellinks %}
        <li class="right" {% if loop.first %}style="margin-right: 10px"{% endif %}>
          <a href="{{ pathto(rellink[0]) }}" title="{{ rellink[1]|striptags|e }}"
             {{ accesskey(rellink[2]) }}>{{ rellink[3] }}</a>
          {%- if not loop.first %}{{ reldelim2 }}{% endif %}</li>
        {%- endfor %}
        {%- block rootrellink %}
        <li><a href="{{ pathto(master_doc) }}">{{ shorttitle|e }}</a>{{ reldelim1 }}</li>
        {%- endblock %}
        {%- for parent in parents %}
          <li><a href="{{ parent.link|e }}" {% if loop.last %}{{ accesskey("U") }}{% endif %}>{{ parent.title }}</a>{{ reldelim1 }}</li>
        {%- endfor %}
        {%- block relbaritems %} {% endblock %}
      </ul>
    </div>
{%- endmacro %}

{%- macro sidebar() %}
      {%- if render_sidebar %}
      <div class="sphinxsidebar">
        <div class="sphinxsidebarwrapper">
          {%- block sidebarlogo %}
          {%- if logo %}
            <p class="logo"><a href="{{ pathto(master_doc) }}">
              <img class="logo" src="{{ pathto('_static/' + logo, 1) }}" alt="Logo"/>
            </a></p>
          {%- endif %}
          {%- endblock %}
          {%- if sidebars != None %}
            {#- new style sidebar: explicitly include/exclude templates #}
            {%- for sidebartemplate in sidebars %}
            {%- include sidebartemplate %}
            {%- endfor %}
          {%- else %}
            {#- old style sidebars: using blocks -- should be deprecated #}
            {%- block sidebartoc %}
            {%- include "localtoc.html" %}
            {%- endblock %}
            {%- block sidebarrel %}
            {%- include "relations.html" %}
            {%- endblock %}
            {%- block sidebarsourcelink %}
            {%- include "sourcelink.html" %}
            {%- endblock %}
            {%- if customsidebar %}
            {%- include customsidebar %}
            {%- endif %}
            {%- block sidebarsearch %}
            {%- include "searchbox.html" %}
            {%- endblock %}
          {%- endif %}
        </div>
      </div>
      {%- endif %}
{%- endmacro %}

{%- macro script() %}
    <script type="text/javascript">
      var DOCUMENTATION_OPTIONS = {
        URL_ROOT:    '{{ url_root }}',
        VERSION:     '{{ release|e }}',
        COLLAPSE_INDEX: false,
        FILE_SUFFIX: '{{ '' if no_search_suffix else file_suffix }}',
        HAS_SOURCE:  {{ has_source|lower }}
      };
    </script>
    {%- for scriptfile in script_files %}
    <script type="text/javascript" src="{{ pathto(scriptfile, 1) }}"></script>
    {%- endfor %}
{%- endmacro %}

{%- macro css() %}
    <link rel="stylesheet" href="{{ pathto('_static/' + style, 1) }}" type="text/css" />
    <link rel="stylesheet" href="{{ pathto('_static/pygments.css', 1) }}" type="text/css" />
    {%- for cssfile in css_files %}
    <link rel="stylesheet" href="{{ pathto(cssfile, 1) }}" type="text/css" />
    {%- endfor %}
{%- endmacro %}

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset={{ encoding }}" />
    {{ metatags }}
    {%- block htmltitle %}
    <title>{{ title|striptags|e }}{{ titlesuffix }}</title>
    {%- endblock %}
    {{ css() }}
    {%- if not embedded %}
    {{ script() }}
    {%- if use_opensearch %}
    <link rel="search" type="application/opensearchdescription+xml"
          title="{% trans docstitle=docstitle|e %}Search within {{ docstitle }}{% endtrans %}"
          href="{{ pathto('_static/opensearch.xml', 1) }}"/>
    {%- endif %}
    {%- if favicon %}
    <link rel="shortcut icon" href="{{ pathto('_static/' + favicon, 1) }}"/>
    {%- endif %}
    {%- endif %}
{%- block linktags %}
    {%- if hasdoc('about') %}
    <link rel="author" title="{{ _('About these documents') }}" href="{{ pathto('about') }}" />
    {%- endif %}
    {%- if hasdoc('genindex') %}
    <link rel="index" title="{{ _('Index') }}" href="{{ pathto('genindex') }}" />
    {%- endif %}
    {%- if hasdoc('search') %}
    <link rel="search" title="{{ _('Search') }}" href="{{ pathto('search') }}" />
    {%- endif %}
    {%- if hasdoc('copyright') %}
    <link rel="copyright" title="{{ _('Copyright') }}" href="{{ pathto('copyright') }}" />
    {%- endif %}
    <link rel="top" title="{{ docstitle|e }}" href="{{ pathto('index') }}" />
    {%- if parents %}
    <link rel="up" title="{{ parents[-1].title|striptags|e }}" href="{{ parents[-1].link|e }}" />
    {%- endif %}
    {%- if next %}
    <link rel="next" title="{{ next.title|striptags|e }}" href="{{ next.link|e }}" />
    {%- endif %}
    {%- if prev %}
    <link rel="prev" title="{{ prev.title|striptags|e }}" href="{{ prev.link|e }}" />
    {%- endif %}
{%- endblock %}
{%- block extrahead %} {% endblock %}
  </head>
  <body>
{%- block header %}{% endblock %}

{%- block relbar1 %}{{ relbar() }}{% endblock %}

{%- block content %}
  {%- block sidebar1 %} {# possible location for sidebar #} {% endblock %}

    <div class="document">
  {%- block document %}
      <div class="documentwrapper">
      {%- if render_sidebar %}
        <div class="bodywrapper">
      {%- endif %}
          <div class="body">
            {% block body %} {% endblock %}
          </div>
      {%- if render_sidebar %}
        </div>
      {%- endif %}
      </div>
  {%- endblock %}

  {%- block sidebar2 %}{{ sidebar() }}{% endblock %}
      <div class="clearer"></div>
    </div>
{%- endblock %}

{%- block relbar2 %}{{ relbar() }}{% endblock %}

{%- block footer %}
    <div class="footer">
    {%- if show_copyright %}
      {%- if hasdoc('copyright') %}
        {% trans path=pathto('copyright'), copyright=copyright|e %}&copy; <a href="{{ path }}">Copyright</a> {{ copyright }}.{% endtrans %}
      {%- else %}
        {% trans copyright=copyright|e %}&copy; Copyright {{ copyright }}.{% endtrans %}
      {%- endif %}
    {%- endif %}
    {%- if last_updated %}
      {% trans last_updated=last_updated|e %}Last updated on {{ last_updated }}.{% endtrans %}
    {%- endif %}
    {%- if show_sphinx %}
      {% trans sphinx_version=sphinx_version|e %}Created using <a href="http://sphinx-doc.org/">Sphinx</a> {{ sphinx_version }}.{% endtrans %}
    {%- endif %}
    </div>
    <p>asdf asdf asdf asdf 22</p>
{%- endblock %}
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: search.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/search.html

```text
{#
  basic/search.html
  ~~~~~~~~~~~~~~~~~

  Template for the search page.

  :copyright: Copyright 2007-2021 by the Sphinx team, see AUTHORS.
  :license: BSD, see LICENSE for details.

  Taken from https://github.com/sphinx-doc/sphinx/blob/v3.5.4/sphinx/themes/basic/search.html
#}
{%- extends "layout.html" %}
{% set title = _('Search') %}
{%- block scripts %}
  {{ super() }}
  <script src="{{ pathto('_static/searchtools.js', 1) }}"></script>
  <script src="{{ pathto('_static/language_data.js', 1) }}"></script>
{%- endblock %}
{% block extrahead %}
<script src="{{ pathto('searchindex.js', 1) }}" defer></script>
{{ super() }}
{% endblock %}
{% block body %}
<h1 id="search-documentation">{{ _('Search') }}</h1>
<div id="fallback" class="admonition warning">
<script>$('#fallback').hide();</script>
<p>
  {% trans %}Please activate JavaScript to enable the search
  functionality.{% endtrans %}
</p>
</div>
<p>
  {% trans %}Searching for multiple words only shows matches that contain
  all words.{% endtrans %}
</p>
<!-- Hide searchbox -->
<!-- <form action="" method="get">
  <input type="text" name="q" aria-labelledby="search-documentation" value="" />
  <input type="submit" value="{{ _('search') }}" />
</form> -->
<span id="search-progress" style="padding-left: 10px"></span>
{% if search_performed %}
  <h2>{{ _('Search Results') }}</h2>
  {% if not search_results %}
    <p>{{ _('Your search did not match any documents. Please make sure that all words are spelled correctly and that you\'ve selected enough categories.') }}</p>
  {% endif %}
{% endif %}
<div id="search-results">
{% if search_results %}
  <ul>
  {% for href, caption, context in search_results %}
    <li><a href="{{ pathto(item.href) }}">{{ caption }}</a>
      <div class="context">{{ context|e }}</div>
    </li>
  {% endfor %}
  </ul>
{% endif %}
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: searchbox.html]---
Location: mlflow-master/docs/api_reference/theme/mlflow/searchbox.html

```text
{%- if builder != 'singlehtml' %}
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="{{ pathto('search') }}" method="get">
  <input type="text" name="q" placeholder="Search" />
  <input type="hidden" name="check_keywords" value="yes" />
  <input type="hidden" name="area" value="default" />
  </form>
</div>
{% endif %}
```

--------------------------------------------------------------------------------

````
